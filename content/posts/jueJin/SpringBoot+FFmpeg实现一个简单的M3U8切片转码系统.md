---
author: "GresonYee"
title: "SpringBoot+FFmpeg实现一个简单的M3U8切片转码系统"
date: 2021-05-17
description: "使用大名鼎鼎的ffmpeg，把视频文件切片成m3u8，并且通过springboot，可以实现在线的点播。想法客户端上传视频到服务器，服务器对视频进行切片后，返回m3u8，封面等访问路径。"
tags: ["SpringBoot","后端"]
ShowReadingTime: "阅读2分钟"
weight: 270
---
使用大名鼎鼎的ffmpeg，把视频文件切片成m3u8，并且通过springboot，可以实现在线的点播。

想法
--

客户端上传视频到服务器，服务器对视频进行切片后，返回m3u8，封面等访问路径。可以在线的播放。 服务器可以对视频做一些简单的处理，例如裁剪，封面的截取时间。

### 视频转码文件夹的定义

arduino

 代码解读

复制代码

`喜羊羊与灰太狼  // 文件夹名称就是视频标题   |-index.m3u8  // 主m3u8文件，里面可以配置多个码率的播放地址   |-poster.jpg  // 截取的封面图片   |-ts      // 切片目录     |-index.m3u8  // 切片播放索引     |-key   // 播放需要解密的AES KEY`

实现
--

> 需要先在本机安装FFmpeg，并且添加到PATH环境变量，如果不会先通过搜索引擎找找资料

### 工程

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/74ad551a29cd424ab57161c25570ab67~tplv-k3u1fbpfcp-zoom-in-crop-mark:1512:0:0:0.awebp)

### pom

pom

 代码解读

复制代码

`<project xmlns="http://maven.apache.org/POM/4.0.0" 	xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" 	xsi:schemaLocation="http://maven.apache.org/POM/4.0.0 https://maven.apache.org/xsd/maven-4.0.0.xsd"> 	<modelVersion>4.0.0</modelVersion> 	<groupId>com.demo</groupId> 	<artifactId>demo</artifactId> 	<version>0.0.1-SNAPSHOT</version> 	<parent> 		<groupId>org.springframework.boot</groupId> 		<artifactId>spring-boot-starter-parent</artifactId> 		<version>2.4.5</version> 		<relativePath /> <!-- lookup parent from repository --> 	</parent> 	<dependencies> 		<dependency> 			<groupId>org.springframework.boot</groupId> 			<artifactId>spring-boot-starter-test</artifactId> 			<scope>test</scope> 		</dependency> 		<dependency> 			<groupId>org.junit.vintage</groupId> 			<artifactId>junit-vintage-engine</artifactId> 			<scope>test</scope> 		</dependency> 		<dependency> 			<groupId>org.springframework.boot</groupId> 			<artifactId>spring-boot-starter-web</artifactId> 			<exclusions> 				<exclusion> 					<groupId>org.springframework.boot</groupId> 					<artifactId>spring-boot-starter-tomcat</artifactId> 				</exclusion> 			</exclusions> 		</dependency> 		<dependency> 			<groupId>org.springframework.boot</groupId> 			<artifactId>spring-boot-starter-undertow</artifactId> 		</dependency> 		<dependency> 			<groupId>commons-codec</groupId> 			<artifactId>commons-codec</artifactId> 		</dependency> 		<dependency> 			<groupId>com.google.code.gson</groupId> 			<artifactId>gson</artifactId> 		</dependency> 	</dependencies> 	<build> 		<finalName>${project.artifactId}</finalName> 		<plugins> 			<plugin> 				<groupId>org.springframework.boot</groupId> 				<artifactId>spring-boot-maven-plugin</artifactId> 				<configuration> 					<executable>true</executable> 				</configuration> 			</plugin> 		</plugins> 	</build> </project>`

### 配置文件

yaml

 代码解读

复制代码

`server:   port: 80 app:   # 存储转码视频的文件夹地址   video-folder: "C:\\Users\\Administrator\\Desktop\\tmp" spring:   servlet:     multipart:       enabled: true       # 不限制文件大小       max-file-size: -1       # 不限制请求体大小       max-request-size: -1       # 临时IO目录       location: "${java.io.tmpdir}"       # 不延迟解析       resolve-lazily: false       # 超过1Mb，就IO到临时目录       file-size-threshold: 1MB   web:     resources:       static-locations:         - "classpath:/static/"         - "file:${app.video-folder}" # 把视频文件夹目录，添加到静态资源目录列表`

### TranscodeConfig，用于控制转码的一些参数

java

 代码解读

复制代码

`package com.demo.ffmpeg; public class TranscodeConfig { 	private String poster;				// 截取封面的时间			HH:mm:ss.[SSS] 	private String tsSeconds;			// ts分片大小，单位是秒 	private String cutStart;			// 视频裁剪，开始时间		HH:mm:ss.[SSS] 	private String cutEnd;				// 视频裁剪，结束时间		HH:mm:ss.[SSS] 	public String getPoster() { 		return poster; 	} 	public void setPoster(String poster) { 		this.poster = poster; 	} 	public String getTsSeconds() { 		return tsSeconds; 	} 	public void setTsSeconds(String tsSeconds) { 		this.tsSeconds = tsSeconds; 	} 	public String getCutStart() { 		return cutStart; 	} 	public void setCutStart(String cutStart) { 		this.cutStart = cutStart; 	} 	public String getCutEnd() { 		return cutEnd; 	} 	public void setCutEnd(String cutEnd) { 		this.cutEnd = cutEnd; 	} 	@Override 	public String toString() { 		return "TranscodeConfig [poster=" + poster + ", tsSeconds=" + tsSeconds + ", cutStart=" + cutStart + ", cutEnd=" 				+ cutEnd + "]"; 	} }`

### MediaInfo，封装视频的一些基础信息

java

 代码解读

复制代码

`package com.demo.ffmpeg; import java.util.List; import com.google.gson.annotations.SerializedName; public class MediaInfo { 	public static class Format { 		@SerializedName("bit_rate") 		private String bitRate; 		public String getBitRate() { 			return bitRate; 		} 		public void setBitRate(String bitRate) { 			this.bitRate = bitRate; 		} 	} 	public static class Stream { 		@SerializedName("index") 		private int index; 		@SerializedName("codec_name") 		private String codecName; 		@SerializedName("codec_long_name") 		private String codecLongame; 		@SerializedName("profile") 		private String profile; 	} 	 	// ---------------------------------- 	@SerializedName("streams") 	private List<Stream> streams; 	@SerializedName("format") 	private Format format; 	public List<Stream> getStreams() { 		return streams; 	} 	public void setStreams(List<Stream> streams) { 		this.streams = streams; 	} 	public Format getFormat() { 		return format; 	} 	public void setFormat(Format format) { 		this.format = format; 	} }`

### FFmpegUtils，工具类封装FFmpeg的一些操作

java

 代码解读

复制代码

`package com.demo.ffmpeg; import java.io.BufferedReader; import java.io.File; import java.io.IOException; import java.io.InputStreamReader; import java.nio.charset.StandardCharsets; import java.nio.file.Files; import java.nio.file.Path; import java.nio.file.Paths; import java.nio.file.StandardOpenOption; import java.security.NoSuchAlgorithmException; import java.util.ArrayList; import java.util.List; import javax.crypto.KeyGenerator; import org.apache.commons.codec.binary.Hex; import org.slf4j.Logger; import org.slf4j.LoggerFactory; import org.springframework.util.StringUtils; import com.google.gson.Gson; public class FFmpegUtils { 	 	private static final Logger LOGGER = LoggerFactory.getLogger(FFmpegUtils.class); 	 	 	// 跨平台换行符 	private static final String LINE_SEPARATOR = System.getProperty("line.separator"); 	 	/** 	 * 生成随机16个字节的AESKEY 	 * @return 	 */ 	private static byte[] genAesKey ()  { 		try { 			KeyGenerator keyGenerator = KeyGenerator.getInstance("AES"); 			keyGenerator.init(128); 			return keyGenerator.generateKey().getEncoded(); 		} catch (NoSuchAlgorithmException e) { 			return null; 		} 	} 	 	/** 	 * 在指定的目录下生成key_info, key文件，返回key_info文件 	 * @param folder 	 * @throws IOException  	 */ 	private static Path genKeyInfo(String folder) throws IOException { 		// AES 密钥 		byte[] aesKey = genAesKey(); 		// AES 向量 		String iv = Hex.encodeHexString(genAesKey()); 		 		// key 文件写入 		Path keyFile = Paths.get(folder, "key"); 		Files.write(keyFile, aesKey, StandardOpenOption.CREATE, StandardOpenOption.TRUNCATE_EXISTING); 		// key_info 文件写入 		StringBuilder stringBuilder = new StringBuilder(); 		stringBuilder.append("key").append(LINE_SEPARATOR);					// m3u8加载key文件网络路径 		stringBuilder.append(keyFile.toString()).append(LINE_SEPARATOR);	// FFmeg加载key_info文件路径 		stringBuilder.append(iv);											// ASE 向量 		 		Path keyInfo = Paths.get(folder, "key_info"); 		 		Files.write(keyInfo, stringBuilder.toString().getBytes(), StandardOpenOption.CREATE, StandardOpenOption.TRUNCATE_EXISTING); 		 		return keyInfo; 	} 	 	/** 	 * 指定的目录下生成 master index.m3u8 文件 	 * @param fileName			master m3u8文件地址 	 * @param indexPath			访问子index.m3u8的路径 	 * @param bandWidth			流码率 	 * @throws IOException 	 */ 	private static void genIndex(String file, String indexPath, String bandWidth) throws IOException { 		StringBuilder stringBuilder = new StringBuilder(); 		stringBuilder.append("#EXTM3U").append(LINE_SEPARATOR); 		stringBuilder.append("#EXT-X-STREAM-INF:BANDWIDTH=" + bandWidth).append(LINE_SEPARATOR);  // 码率 		stringBuilder.append(indexPath); 		Files.write(Paths.get(file), stringBuilder.toString().getBytes(StandardCharsets.UTF_8), StandardOpenOption.CREATE, StandardOpenOption.TRUNCATE_EXISTING); 	} 	 	/** 	 * 转码视频为m3u8 	 * @param source				源视频 	 * @param destFolder			目标文件夹 	 * @param config				配置信息 	 * @throws IOException  	 * @throws InterruptedException  	 */ 	public static void transcodeToM3u8(String source, String destFolder, TranscodeConfig config) throws IOException, InterruptedException { 		 		// 判断源视频是否存在 		if (!Files.exists(Paths.get(source))) { 			throw new IllegalArgumentException("文件不存在：" + source); 		} 		 		// 创建工作目录 		Path workDir = Paths.get(destFolder, "ts"); 		Files.createDirectories(workDir); 		 		// 在工作目录生成KeyInfo文件 		Path keyInfo = genKeyInfo(workDir.toString()); 		 		// 构建命令 		List<String> commands = new ArrayList<>(); 		commands.add("ffmpeg");			 		commands.add("-i")						;commands.add(source);					// 源文件 		commands.add("-c:v")					;commands.add("libx264");				// 视频编码为H264 		commands.add("-c:a")					;commands.add("copy");					// 音频直接copy 		commands.add("-hls_key_info_file")		;commands.add(keyInfo.toString());		// 指定密钥文件路径 		commands.add("-hls_time")				;commands.add(config.getTsSeconds());	// ts切片大小 		commands.add("-hls_playlist_type")		;commands.add("vod");					// 点播模式 		commands.add("-hls_segment_filename")	;commands.add("%06d.ts");				// ts切片文件名称 		 		if (StringUtils.hasText(config.getCutStart())) { 			commands.add("-ss")					;commands.add(config.getCutStart());	// 开始时间 		} 		if (StringUtils.hasText(config.getCutEnd())) { 			commands.add("-to")					;commands.add(config.getCutEnd());		// 结束时间 		} 		commands.add("index.m3u8");														// 生成m3u8文件 		 		// 构建进程 		Process process = new ProcessBuilder() 			.command(commands) 			.directory(workDir.toFile()) 			.start() 			; 		 		// 读取进程标准输出 		new Thread(() -> { 			try (BufferedReader bufferedReader = new BufferedReader(new InputStreamReader(process.getInputStream()))) { 				String line = null; 				while ((line = bufferedReader.readLine()) != null) { 					LOGGER.info(line); 				} 			} catch (IOException e) { 			} 		}).start(); 		 		// 读取进程异常输出 		new Thread(() -> { 			try (BufferedReader bufferedReader = new BufferedReader(new InputStreamReader(process.getErrorStream()))) { 				String line = null; 				while ((line = bufferedReader.readLine()) != null) { 					LOGGER.info(line); 				} 			} catch (IOException e) { 			} 		}).start(); 		 		 		// 阻塞直到任务结束 		if (process.waitFor() != 0) { 			throw new RuntimeException("视频切片异常"); 		} 		 		// 切出封面 		if (!screenShots(source, String.join(File.separator, destFolder, "poster.jpg"), config.getPoster())) { 			throw new RuntimeException("封面截取异常"); 		} 		 		// 获取视频信息 		MediaInfo mediaInfo = getMediaInfo(source); 		if (mediaInfo == null) { 			throw new RuntimeException("获取媒体信息异常"); 		} 		 		// 生成index.m3u8文件 		genIndex(String.join(File.separator, destFolder, "index.m3u8"), "ts/index.m3u8", mediaInfo.getFormat().getBitRate()); 		 		// 删除keyInfo文件 		Files.delete(keyInfo); 	} 	 	/** 	 * 获取视频文件的媒体信息 	 * @param source 	 * @return 	 * @throws IOException 	 * @throws InterruptedException 	 */ 	public static MediaInfo getMediaInfo(String source) throws IOException, InterruptedException { 		List<String> commands = new ArrayList<>(); 		commands.add("ffprobe");	 		commands.add("-i")				;commands.add(source); 		commands.add("-show_format"); 		commands.add("-show_streams"); 		commands.add("-print_format")	;commands.add("json"); 		 		Process process = new ProcessBuilder(commands) 				.start(); 		  		MediaInfo mediaInfo = null; 		 		try (BufferedReader bufferedReader = new BufferedReader(new InputStreamReader(process.getInputStream()))) { 			mediaInfo = new Gson().fromJson(bufferedReader, MediaInfo.class); 		} catch (IOException e) { 			e.printStackTrace(); 		} 		 		if (process.waitFor() != 0) { 			return null; 		} 		 		return mediaInfo; 	} 	 	/** 	 * 截取视频的指定时间帧，生成图片文件 	 * @param source		源文件 	 * @param file			图片文件 	 * @param time			截图时间 HH:mm:ss.[SSS]		 	 * @throws IOException  	 * @throws InterruptedException  	 */ 	public static boolean screenShots(String source, String file, String time) throws IOException, InterruptedException { 		 		List<String> commands = new ArrayList<>(); 		commands.add("ffmpeg");	 		commands.add("-i")				;commands.add(source); 		commands.add("-ss")				;commands.add(time); 		commands.add("-y"); 		commands.add("-q:v")			;commands.add("1"); 		commands.add("-frames:v")		;commands.add("1"); 		commands.add("-f");				;commands.add("image2"); 		commands.add(file); 		 		Process process = new ProcessBuilder(commands) 					.start(); 		 		// 读取进程标准输出 		new Thread(() -> { 			try (BufferedReader bufferedReader = new BufferedReader(new InputStreamReader(process.getInputStream()))) { 				String line = null; 				while ((line = bufferedReader.readLine()) != null) { 					LOGGER.info(line); 				} 			} catch (IOException e) { 			} 		}).start(); 		 		// 读取进程异常输出 		new Thread(() -> { 			try (BufferedReader bufferedReader = new BufferedReader(new InputStreamReader(process.getErrorStream()))) { 				String line = null; 				while ((line = bufferedReader.readLine()) != null) { 					LOGGER.error(line); 				} 			} catch (IOException e) { 			} 		}).start(); 		 		return process.waitFor() == 0; 	} }`

### UploadController，执行转码操作

java

 代码解读

复制代码

`package com.demo.web.controller; import java.io.IOException; import java.nio.file.Files; import java.nio.file.Path; import java.nio.file.Paths; import java.time.LocalDate; import java.time.format.DateTimeFormatter; import java.util.HashMap; import java.util.Map; import org.slf4j.Logger; import org.slf4j.LoggerFactory; import org.springframework.beans.factory.annotation.Value; import org.springframework.http.HttpStatus; import org.springframework.http.ResponseEntity; import org.springframework.web.bind.annotation.PostMapping; import org.springframework.web.bind.annotation.RequestMapping; import org.springframework.web.bind.annotation.RequestPart; import org.springframework.web.bind.annotation.RestController; import org.springframework.web.multipart.MultipartFile; import com.demo.ffmpeg.FFmpegUtils; import com.demo.ffmpeg.TranscodeConfig; @RestController @RequestMapping("/upload") public class UploadController { 	 	private static final Logger LOGGER = LoggerFactory.getLogger(UploadController.class); 	 	@Value("${app.video-folder}") 	private String videoFolder; 	private Path tempDir = Paths.get(System.getProperty("java.io.tmpdir")); 	 	/** 	 * 上传视频进行切片处理，返回访问路径 	 * @param video 	 * @param transcodeConfig 	 * @return 	 * @throws IOException  	 */ 	@PostMapping 	public Object upload (@RequestPart(name = "file", required = true) MultipartFile video, 						@RequestPart(name = "config", required = true) TranscodeConfig transcodeConfig) throws IOException { 		 		LOGGER.info("文件信息：title={}, size={}", video.getOriginalFilename(), video.getSize()); 		LOGGER.info("转码配置：{}", transcodeConfig); 		 		// 原始文件名称，也就是视频的标题 		String title = video.getOriginalFilename(); 		 		// io到临时文件 		Path tempFile = tempDir.resolve(title); 		LOGGER.info("io到临时文件：{}", tempFile.toString()); 		 		try { 			 			video.transferTo(tempFile); 			 			// 删除后缀 			title = title.substring(0, title.lastIndexOf(".")); 			 			// 按照日期生成子目录 			String today = DateTimeFormatter.ofPattern("yyyyMMdd").format(LocalDate.now()); 			 			// 尝试创建视频目录 			Path targetFolder = Files.createDirectories(Paths.get(videoFolder, today, title)); 			 			LOGGER.info("创建文件夹目录：{}", targetFolder); 			Files.createDirectories(targetFolder); 			 			// 执行转码操作 			LOGGER.info("开始转码"); 			try { 				FFmpegUtils.transcodeToM3u8(tempFile.toString(), targetFolder.toString(), transcodeConfig); 			} catch (Exception e) { 				LOGGER.error("转码异常：{}", e.getMessage()); 				Map<String, Object> result = new HashMap<>(); 				result.put("success", false); 				result.put("message", e.getMessage()); 				return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(result); 			} 			 			// 封装结果 			Map<String, Object> videoInfo = new HashMap<>(); 			videoInfo.put("title", title); 			videoInfo.put("m3u8", String.join("/", "", today, title, "index.m3u8")); 			videoInfo.put("poster", String.join("/", "", today, title, "poster.jpg")); 			 			Map<String, Object> result = new HashMap<>(); 			result.put("success", true); 			result.put("data", videoInfo); 			return result; 		} finally { 			// 始终删除临时文件 			Files.delete(tempFile); 		} 	} }`

### index.html，客户端

html

 代码解读

复制代码

`<html lang="en">     <head>         <meta charset="UTF-8">         <title>Title</title>         <script src="https://cdn.jsdelivr.net/hls.js/latest/hls.min.js"></script>     </head>     <body>         选择转码文件： <input name="file" type="file" accept="video/*" onchange="upload(event)">         <hr/> 		<video id="video"  width="500" height="400" controls="controls"></video>     </body>     <script>         		const video = document.getElementById('video');     	         function upload (e){             let files = e.target.files             if (!files) {                 return             }                          // TODO 转码配置这里固定死了             var transCodeConfig = {             	poster: "00:00:00.001", // 截取第1毫秒作为封面             	tsSeconds: 15,				             	cutStart: "",             	cutEnd: ""             }                          // 执行上传             let formData = new FormData();             formData.append("file", files[0])             formData.append("config", new Blob([JSON.stringify(transCodeConfig)], {type: "application/json; charset=utf-8"}))             fetch('/upload', {                 method: 'POST',                 body: formData             })             .then(resp =>  resp.json())             .then(message => {             	if (message.success){             		// 设置封面             		video.poster = message.data.poster;             		             		// 渲染到播放器             		var hls = new Hls();         		    hls.loadSource(message.data.m3u8);         		    hls.attachMedia(video);             	} else {             		alert("转码异常，详情查看控制台");             		console.log(message.message);             	}             })             .catch(err => {             	alert("转码异常，详情查看控制台");                 throw err             })         }     </script> </html>`

### 使用

1.  在配置文件中，配置到本地视频目录后启动
2.  打开页面 `localhost`
3.  点击【选择文件】，选择一个视频文件进行上传，等待执行完毕（没有做加载动画）
4.  后端转码完成后，会自动把视频信息加载到播放器，此时可以手动点击播放按钮进行播放

可以打开控制台，查看上传进度，以及播放时的网络加载信息

* * *

首发： [springboot.io/t/topic/366…](https://link.juejin.cn?target=https%3A%2F%2Fspringboot.io%2Ft%2Ftopic%2F3669 "https://springboot.io/t/topic/3669")