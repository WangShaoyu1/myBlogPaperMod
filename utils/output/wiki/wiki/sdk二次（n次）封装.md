---
author: "王宇"
title: "sdk二次（n次）封装"
date: 九月26,2023
description: "数字员工（H5）"
tags: ["数字员工（H5）"]
ShowReadingTime: "12s"
weight: 556
---
0905版本，基于上个版本，将虚拟人更底层能力抽取出来，UI和逻辑分离，包括class和Avatar.vue

Class
-----

### 虚拟人Class基础能力

1.  init：初始化虚拟人
2.  status： 状态"loading" | "idle" | "talking"
3.  getAnswers: 提问返回文本
4.  talk：播报文本
5.  listen：执行收音动作
6.  thiking：nlp思考中
7.  boring：触发无聊时动作，一般是没其他操作时，倒计时一定时间触发
8.  idle：打断动作、播报
9.  move：调用动作
10.  setBackground：设置2D背景，暂时没用，暂时是用css变量换背景

### 注意点

1.  所有操作都需要虚拟人异步加载完成才能进行，都需要判空特殊处理，方法较多，直接用proxy加方法白名单做统一拦截
2.  内部有talking的计时，方便后面操作太快来做拦截

  

### 计划优化点

*   异常提示比较重复、散乱，要做常量配置
*   配合语音识别，也是异步操作比较多，考虑rxjs管理异步操作

  

完整代码
----

  

**class**

[?](#)

1

2

3

4

5

6

7

8

9

10

11

12

13

14

15

16

17

18

19

20

21

22

23

24

25

26

27

28

29

30

31

32

33

34

35

36

37

38

39

40

41

42

43

44

45

46

47

48

49

50

51

52

53

54

55

56

57

58

59

60

61

62

63

64

65

66

67

68

69

70

71

72

73

74

75

76

77

78

79

80

81

82

83

84

85

86

87

88

89

90

91

92

93

94

95

96

97

98

99

100

101

102

103

104

105

106

107

108

109

110

111

112

113

114

115

116

117

118

119

120

121

122

123

124

125

126

127

128

129

130

131

132

133

134

135

136

137

138

139

140

141

142

143

144

145

`import { Avatar } from` `"./haihuman.module.js"``;`

`import { userId } from` `"@/storage/user"``;`

`import showMsg from` `"@/utils/showMsg"``;`

`class AvatarH5 {`

  `appId: string;`

  `appKey: string;`

  `appSecret: string;`

  `avatarId: string;`

  `instance: any;`

  `status:` `"loading"` `|` `"idle"` `|` `"talking"``;`

  `timer: NodeJS.Timer;`

  `talkTime?: number;`

  `constructor() {`

    `this``.appId =` `"6006805041792430"``;`

    `this``.appKey =` `"TTZ92YT1mSDRLSGs5Mv1bMYJ"``;`

    `this``.appSecret =` `"qBHOHn8OUHc17ulW756E2YmcpuMVqNnh"``;`

    `this``.avatarId =` `"11100020000282450000000000000000"``;`

    `this``.status =` `"loading"``;`

    `this``.timer =` `null``;`

    `this``.talkTime = void 0;`

  `}`

  `init(cbs) {`

    `console.log(``"init"``, userId.value);`

    `this``.instance =` `new` `Avatar(`

      `this``.avatarId,`

      `"v1.0"``,`

      `"wandemei.glb"``,`

      `"haihuman"``,`

      `""``,`

      `{`

        `locale:` `"cn"``,`

        `userId: userId.value,` `// 用户唯一标识`

        `prefabs: [{ type:` `"ani"``, name:` `"human_idle"` `}],` `// 预加载动画资源`

      `}`

    `);`

    `this``.instance.init(``this``.appId,` `this``.appKey,` `this``.appSecret, {`

      `...cbs,`

      `onEndOfChat: () => {`

        `cbs?.onEndOfChat();`

        `this``.talkTime = void 0;`

        `clearTimeout(``this``.timer);`

      `},`

    `});`

  `}`

  `getAnswers(text, callback, errorFn, timeout = 30000) {`

    `console.log(``'getAnswers text'``, text, callback)`

    `this``.instance.chat.getAnswers(`

      `text,`

      `callback,`

      `(e) => {`

        `errorFn?.(e);`

        `this``.talkTime = void 0;`

        `clearTimeout(``this``.timer);`

      `},`

      `timeout`

    `);`

  `}`

  `talk(text) {`

    `this``.idle();`

    `this``.instance.chat.talk(`

      `text,`

      `"read"``,`

      `0,`

      `() => console.log(``"talk success"``),`

      `() => {`

        `showMsg(``"当前网络较差，请稍后再试"``, 1000);`

        `console.log(``"talk fail"``);`

      `},`

      `10 * 1000`

    `);`

    `this``.status =` `"talking"``;`

    `this``.talkTime = 0;`

    `clearTimeout(``this``.timer);`

    `let _this =` `this``;`

    `function` `count() {`

      `if` `(_this.talkTime >= 2) {`

        `_this.talkTime = void 0`

        `clearTimeout(_this.timer);`

        `return`

      `}`

      `_this.talkTime++;`

      `_this.timer = setTimeout(count, 1000);`

    `}`

    `count();`

  `}`

  `getStatus() {`

    `return` `this``.status;`

  `}`

  `setStatus(_status) {`

    `this``.status = _status;`

  `}`

  `// 收音动作`

  `listen() {`

    `this``.instance.engine.move(`

      `Math.random() > 0.5 ?` `"human_listen"` `:` `"human_response"``,`

      `false``,`

      `Date.now()`

    `);`

  `}`

  `// 等待服务器动作`

  `think() {`

    `this``.instance.engine.move(`

      `Math.random() > 0.5 ?` `"human_thinking"` `:` `"human_confused"``,`

      `false``,`

      `Date.now()`

    `);`

  `}`

  `// 待命动作`

  `boring() {`

    `if` `([``"idle"``].includes(``this``.getStatus())) {`

      `this``.instance.engine.move(`

        `Math.random() > 0.5 ?` `"human_hello"` `:` `"human_niuyiniu"``,`

        `false``,`

        `Date.now()`

      `);`

    `}`

  `}`

  `idle() {`

    `this``.talkTime = 0;`

    `clearTimeout(``this``.timer);`

    `this``.instance.idle();`

  `}`

  `setBackground(url) {`

    `this``.instance.stage.setBackground2D(url);`

  `}`

`}`

`export` `default` `AvatarH5;`

`// export const avatar = new AvatarH5();`

`export const avatar =` `new` `Proxy(``new` `AvatarH5(), {`

  `get(target, propKey, receiver) {`

    `if` `(`

      `typeof` `target[propKey] ===` `"function"` `&&`

      `![``"init"``,` `"setStatus"``].includes(propKey)`

    `) {`

      `if` `(!target.instance || target.instance?.state ===` `"loading"``) {`

        `return` `() => {`

          `alert(``"虚拟人加载中，请稍等"``);`

        `};`

      `}`

    `}`

    `return` `Reflect.get(target, propKey, receiver);`

  `},`

`});`

Avatar.vue
----------

### 功能

在class基础上增加业务逻辑

1.  判断话术类型，做相应回答和后续交互
2.  增加了手势动画，单击、双击、长按、滑动、复位，包括一些随机动画

[?](#)

1

2

3

4

5

6

7

8

9

10

11

12

13

14

15

16

17

18

19

20

21

22

23

24

25

26

27

28

29

30

31

32

33

34

35

36

37

38

39

40

41

42

43

44

45

46

47

48

49

50

51

52

53

54

55

56

57

58

59

60

61

62

63

64

65

66

67

68

69

70

71

72

73

74

75

76

77

78

79

80

81

82

83

84

85

86

87

88

89

90

91

92

93

94

95

96

97

98

99

100

101

102

103

104

105

106

107

108

109

110

111

112

113

114

115

116

117

118

119

120

121

122

123

124

125

126

127

128

129

130

131

132

133

134

135

136

137

138

139

140

141

142

143

144

145

146

147

148

149

150

151

152

153

154

155

156

157

158

159

160

161

162

163

164

165

166

167

168

169

170

171

172

173

174

175

176

177

178

179

180

181

182

183

184

185

186

187

188

189

190

191

192

193

194

195

196

197

198

199

200

201

202

203

204

205

206

207

208

209

210

211

212

213

214

215

216

217

218

219

220

221

222

223

224

225

226

227

228

229

230

231

232

233

234

235

236

237

238

239

240

241

242

243

244

245

246

247

248

249

250

251

252

253

254

255

256

257

258

259

260

261

262

263

264

265

266

267

268

269

270

271

272

273

274

275

276

277

278

279

280

281

282

283

284

285

286

287

288

289

290

291

292

293

294

295

296

297

298

299

300

301

302

303

304

305

306

307

308

309

310

311

312

313

314

315

316

317

318

319

320

321

322

323

324

325

326

327

328

329

330

331

332

`<script setup>`

`import { ref, onMounted } from` `"vue"``;`

`import { Avatar } from` `"./haihuman.module.js"``;`

`import { useDebounceFn, onLongPress } from` `"@vueuse/core"``;`

`import { userId } from` `"@/storage/user"``;`

`import { avatar } from` `"./class"``;`

`import showMsg from` `"@/utils/showMsg"``;`

`import { getSimilarity } from` `"@/utils"``;`

`// let status = "idle";`

`let a;`

`const props = defineProps([``"onReady"``]);`

`const haihumanRef = ref(``null``);`

`/**`

 `* Sdk loading callback`

 `* called while assets loading`

 `*/`

`const onProgress = (progress) => {`

  `// console.log(progress / 100)`

`};`

`/**`

 `* Sdk loading callback`

 `* called as assets loaded and stage ready`

 `*/`

`const onReady = () => {`

  `a = avatar.instance;`

  `avatar.setStatus(``"idle"``);`

  `if` `(a.model) {`

    `a.model.position.y = -1.2;`

    `a.model.position.x = 0;`

    `a.model.scale.set(2.5, 2.5, 2.5);`

    `a.stage.clearGround();`

    `a.stage.controls.enableZoom =` `false``;`

    `// a.stage.controls.enableDamping = false`

    `a.stage.controls.enablePan =` `false``;`

  `}`

  `// if (a.speechRecognizer) {`

  `//   a.speechRecognizer.setOnChange((text) => {`

  `//     console.log(text);`

  `//   });`

  `// }`

  `props?.onReady?.(a);`

  `window.addEventListener(``"visibilitychange"``, () => {`

    `if` `(document.hidden) {`

      `a.idle();`

    `}` `else` `{`

      `a.engine?.move(``"human_hello"``,` `false``, Date.now());`

      `avatar.setStatus(``"idle"``);`

    `}`

  `});`

`};`

`/**`

 `* Sdk render callback`

 `* called every frame`

 `*/`

`const onRender = (delta) => {};`

`const onError = (e) => {`

  `console.error(``"avatar error:"``, e);`

`};`

`// 全局talk完成`

`const onEndOfChat = () => {`

  `console.log(``"onEndOfChat"``);`

  `avatar.setStatus(``"idle"``);`

  `// 移除所有speaker里的speaking`

  `// document.querySelector('.conversation-container-body')`

  `// let nodeList = document.querySelectorAll('.conversation-container-body .conversation-list .official .speaker.speaking')`

  `// Array.prototype.forEach.call(nodeList, el => {`

  `//   el.classList.remove('speaking')`

  `// })`

`};`

`const cbs = { onProgress, onReady, onRender, onError, onEndOfChat };`

`onMounted(() => {`

  `avatar.init(cbs);`

`});`

`const createA = (options, ans) =>`

  `Object.keys(options)`

    ``.map((_) => `<a class=```"goInstruct"`  ``data-ans=${ans}>${_}</a>`)``

    `.join(``""``);`

`// 创建指令选项`

`const instruction = (_obj) => {`

  `return` `{`

    ``showText: `${_obj.text}${createA(_obj.options, _obj.ans)}`,``

    ``readText: `${_obj.text}`,``

  `};`

`};`

`// 创建富文本a标签`

`const createRich = (_obj) => {`

  `return` `` `<a class= ```"goToLesson"` `href=${_obj.href ||` `""```}>${_obj.text}</a>`;``

`};`

`// // 切换背景`

`// const setBackground = (url) => {`

`//   a.stage.setBackground2D(url);`

`// };`

`// 创建再问一次`

`const createRedo = (question) => {`

  `return` `` `<a class= ```"goToRedo"` ``data-ques=${question}><span></span>再问一次</a>`;``

`};`

`// 创建“去反馈”`

`const createFeedBack = (tag) => {`

  `let res =` `""``;`

  `if` `(tag?.code ===` `"h5_ptyy_wdc_useful"``) {`

    `return` `JSON.parse(tag?.succeed_answer)?.value;`

  `}`

  `if` `(tag?.code ===` `"h5_ptyy_wdc_useless"``) {`

    `return` `` `${JSON.parse(tag?.succeed_answer)?.value.replace( ``

      `"去反馈＞"``,`

      `'<a class="goFeedback">去反馈></a>'`

    ``)}`;``

  `}`

  `return` `` `未知错误`; ``

`};`

`defineExpose({`

  `getAnswers: (text, callback, errorFn, timeout = 30000) => {`

    `avatar.getAnswers(`

      `text,`

      `async (answers) => {`

        `console.log(``"answers:"``, answers);`

        `let showText, readText;`

        `if` `(answers.length) {`

          `let as = answers.join(``""``);`

          `let tag = answers[0]?.tag;`

          `let res;`

          `// 指令库`

          `if` `(tag?.service ===` `"Instruction_library"``) {`

            `console.log(``"指令库"``);`

            `try` `{`

              `const succeed_answer = JSON.parse(tag?.succeed_answer);`

              `console.log(``"succeed_answer"``, succeed_answer);`

              `let succeed_answer_value = succeed_answer.value`

                `.replaceAll(``"["``,` `"{"``)`

                `.replaceAll(``"]"``,` `"}"``)`

                `?.replaceAll(``"\n"``,` `""``);`

              `// 直接命中反馈`

              `if` `(`

                `[``"h5_ptyy_wdc_useful"``,` `"h5_ptyy_wdc_useless"``].includes(`

                  `tag?.code`

                `)`

              `) {`

                `console.log(``"反馈"``);`

                `showText = createFeedBack(tag);`

                `readText = showText.replace(`

                  `'<a class="goFeedback">去反馈></a>'``,`

                  `"去反馈"`

                `);`

              `}` `else` `{`

                `let value = JSON.parse(succeed_answer_value);`

                `console.log(``"succeed_answer_value"``, succeed_answer_value);`

                `// 命中回答`

                `if` `(answers[0]?.text ===` `"DEFAULT"``) {`

                  `if` `(tag?.isMulti ===` `"false"` `&& tag?.isEnd ==` `"true"``) {`

                    `// 文本+超链接`

                    `// 不带选项`

                    `if` `(value?.text &&` `typeof` `value.text ===` `"string"``) {`

                      `showText = value.text.replace(`

                        `value.replace,`

                        `createRich({`

                          `text: value.replace,`

                          `href: value.href,`

                        `})`

                      `);`

                      `readText = value.text;`

                    `}` `else` `{`

                      `// 直达追问回答`

                      `console.log(``"直达追问回答"``, value);`

                      `let key = text.replace(tag?.intent,` `""``);`

                      `let _value = value[key];`

                      `// 没匹配到`

                      `if` `(!_value) {`

                        `let m = 0,`

                          `k;`

                        `for` `(let k` `in` `value) {`

                          `console.log(``'k, key'``, k, key)`

                          `const p = getSimilarity(k, key);`

                          `console.log(``'p'``, p)`

                          `if` `(p > m) {`

                            `m = p;`

                            `_value = value[k];`

                          `}`

                        `}`

                      `}`

                      `console.log(``"tag"``, tag);`

                      `console.log(``"_value"``, _value);`

                      `showText = _value?.replace`

                        `? _value.text.replace(`

                            `_value.replace,`

                            `createRich({`

                              `text: _value.replace,`

                              `href: _value.href,`

                            `})`

                          `)`

                        `: _value.text;`

                      `// showText = _value.text;`

                      `readText = _value.text;`

                    `}`

                  `}`

                `}` `else` `{`

                  `// 追问失败`

                  `if` `(`

                    `JSON.parse(tag?.continue_failed_answer).value ===`

                    `tag?.answer`

                  `) {`

                    `console.log(``"追问失败"``);`

                    `showText = readText = tag.answer;`

                    `readText = tag.answer;`

                    ``showText = `${tag.answer}<div>${createRedo(text)}</div>`;``

                  `}` `else` `{`

                    `// 问题`

                    `as = {`

                      `text: answers[0]?.text,`

                      `ans: tag?.intent,`

                      `options: value,`

                    `};`

                    `res = instruction(as);`

                    `showText = res.showText;`

                    `readText = res.readText;`

                    `// .replace(/<(a+)[^>]*>/g, "")`

                    `// .replace(/<\/a>/g, "")`

                    `// .replace(/\>/, "");`

                  `}`

                `}`

              `}`

            `}` `catch` `(error) {`

              `console.error(error);`

            `}`

          `}`

          `// FAQ`

          `else` `if` `(tag?.service ===` `"FAQ_Library"``) {`

            `console.log(``"faq"``);`

            `try` `{`

              `res = answers?.map((_) => _.text).join(``""``);`

              `const reg = /\[(.*?)\]|\((.*?)\)/g;` `// 匹配(xxx=xxx)出来`

              `const matchs = res.match(reg);`

              `// 有富文本内容`

              `if` `(matchs?.length) {`

                `showText = res.replace(reg, (match) => {`

                  `const info = match.slice(1, match.length - 1).split(``"="``);`

                  `return` `` `<a class= ```"goToLesson"` `href=${info`

                    `.slice(1)`

                    `.join(``"="```)}>${info[0]}</a>`;``

                `});`

                `readText = res.replace(reg,` `""``);`

              `}` `else` `{`

                `showText = readText = res;`

              `}`

            `}` `catch` `(error) {`

              `console.error(error);`

            `}`

          `}`

          `// 闲聊`

          `else` `{`

            `as = answers?.map((_) => _.text).join(``""``);`

            `showText = readText = as;`

          `}`

          `console.log(``"最终showText"``, showText);`

          `console.log(``"最终readText"``, readText);`

          `if` `(``typeof` `callback ===` `"function"``) {`

            `as = await callback?.(showText, readText, tag);`

          `}`

          `// 正在读的先停了,不然后续都会没声音`

          `avatar.idle();`

          `avatar.talk(as,` `"read"``);`

        `}`

      `},`

      `async (e) => {`

        `// 超时也能进这里`

        `const as = await errorFn?.(e);`

        `if` `(``typeof` `as ===` `"string"``) {`

          `avatar.idle();`

          `avatar.talk(as,` `"read"``);`

        `}`

      `},`

      `timeout,`

      `(e) => {`

        `console.error(``"超时"``, e);`

      `}`

    `);`

  `},`

  `talk: (text) => {`

    `avatar.talk(text);`

    `avatar.setStatus(``"talking"``);`

  `},`

  `getStatus: () => avatar.status,`

  `listen: (params) => avatar.listen(params),`

  `think: (params) => avatar.think(params),`

  `boring: (params) => avatar.boring(params),`

  `idle: () => avatar?.idle(),`

  `// setBackground,`

`});`

`const moveList0 = [`

  `"human_baishui"``,`

  `"human_feiwen"``,`

  `"human_pain"``,`

  `"human_shakehead"``,`

  `"human_tramplefeet"``,`

  `"human_stagger"``,`

`];`

`const moveList1 = [``"human_ballet"``,` `"human_dance"``,` `"human_mechanicaldance"``];`

`const moveList2 = [`

  `"human_lookaround"``,`

  `"human_clickonrightfoot"``,`

  `"human_eatfull"``,`

  `"human_hungry"``,`

`];`

`let clickNum = 1,`

  `clickTimer =` `null``,`

  `lastClickTim`

[Filter table data](#)[Create a pivot table](#)[Create a chart from data series](#)

[Configure buttons visibility](/users/tfac-settings.action)