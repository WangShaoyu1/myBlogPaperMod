---
author: "王宇"
title: "sw模版"
date: 五月23,2024
description: "pwa"
tags: ["pwa"]
ShowReadingTime: "12s"
weight: 532
---
没定稿

[?](#)

`const CACHE_VERSION =` `"v2024040522"``;`

`const blackList = [];`

`let lastSrcs;`

`const scriptReg = /\<script.*src=[``"'](?<src>[^"``']+)/gm;`

`const DURATION = 5000;`

`async` `function` `extractNewScripts() {`

  `const html = await fetch(``"/?_timestamp="` `+ Date.now()).then((resp) =>`

    `resp.text()`

  `);`

  `scriptReg.lastIndex = 0;`

  `let res = [];`

  `let match;`

  `while` `((match = scriptReg.exec(html))) {`

    `res.push(match.groups.src);`

  `}`

  `console.log(``'res'``, res)`

  `return` `res;`

`}`

`async` `function` `needUpdate() {`

  `const newScripts = await extractNewScripts();`

  `console.log(``'lastSrcs'``, lastSrcs)`

  `if` `(!lastSrcs) {`

    `lastSrcs = newScripts;`

    `return` `false``;`

  `}`

  `let result =` `false``;`

  `if` `(lastSrcs.length !== newScripts.length) {`

    `result =` `true``;`

  `}`

  `for` `(let i = 0; i < lastSrcs.length; i++) {`

    `if` `(lastSrcs[i] !== newScripts[i]) {`

      `result =` `true``;`

      `break``;`

    `}`

  `}`

  `lastSrcs = newScripts;`

  `return` `result;`

`}`

`function` `autoRefresh() {`

  `console.log(``"autoRefresh"``);`

  `setTimeout(async () => {`

    `const willUpdate = await needUpdate();`

    `console.log(``'willUpdate'``, willUpdate)`

    `if` `(willUpdate) {`

      `self.clients.matchAll().then(all => all.map(client => {`

        `client.postMessage(``'update'``)`

      `}))`

    `}` `else` `{`

      `autoRefresh();`

    `}`

  `}, DURATION);`

`}`

`// 缓存优先`

`function` `cacheFirstHandler(cacheResponse, event) {`

  `if` `(cacheResponse) {`

    `return` `cacheResponse;`

  `}`

  `return` `fetch(event.request).then((response) => {`

    `return` `caches.open(CACHE_VERSION).then((cache) => {`

      `cache.put(event.request, response.clone());`

      `return` `response;`

    `});`

  `});`

`}`

`function` `staleWhileRevalidateHandler(cacheResponse, event, name) {`

  `const fetchResponse = fetch(event.request).then((response) => {`

    `return` `caches`

      `.open(CACHE_VERSION)`

      `.then((cache) => {`

        `cache.put(name, response.clone());`

        `return` `response;`

      `})`

      `.cache(() => cacheResponse);`

  `});`

  `return` `cacheResponse || fetchResponse;`

`}`

`self.addEventListener(``"install"``, (event) => {`

  `console.log(``"install"``);`

  `self.skipWaiting();`

  `event.waitUntil(`

    `caches.open(CACHE_VERSION).then((cache) => {`

      `return` `cache.addAll([`

        `/** cacheList */`

      `]);`

    `})`

  `);`

`});`

`self.addEventListener(``"activate"``, (event) => {`

  `console.log(``"activate"``);`

  `autoRefresh();`

  `event.waitUntil(`

    `caches`

      `.keys()`

      `.then((cacheNames) => {`

        `console.log(``"cacheNames"``, cacheNames);`

        `return` `Promise.all(`

          `cacheNames`

            `.filter((cacheName) => {`

              `return` `cacheName !== CACHE_VERSION;`

            `})`

            `.map((cacheName) => {`

              `console.log(``"删除"``, cacheName);`

              `return` `caches.``delete``(cacheName);`

            `})`

        `);`

      `})`

      `.then((cache) => {`

        `return` `self.clients.matchAll().then((clients) => {`

          `if` `(clients?.length) {`

            `console.log(``"sw更新了！"``, cache);`

            `// clients.forEach(client => {`

            `//   clients.postMessage('sw:update')`

            `// })`

          `}`

        `});`

      `})`

  `);`

`});`

`self.addEventListener(``"fetch"``, (event) => {`

  `const { url, method, destination } = event.request;`

  `// console.log("event", event);`

  `// 不缓存带时间戳`

  `if` `(destination ===` `"image"` `&& url.includes(``"?v="``)) {`

    `return``;`

  `}`

  `// 不缓存第三方接口`

  `if` `(event.request.url.includes(``"/haigate/api"``)) {`

    `// event.respondWith(fetch(event.request));`

    `return``;`

  `}`

  `// 不缓存post接口`

  `if` `(method ===` `'POST'``) {`

    `return`

  `}`

  `event.respondWith(`

    `caches`

      `.match(event.request)`

      `.then((response) => {`

        `if` `(response) {`

          `return` `response;`

        `}`

        `const fetchRequest = event.request.clone()`

        `return` `fetch(fetchRequest).then((networkResponse) => {`

         `if` `(!networkResponse || networkResponse.status !== 200) {`

          `console.log(``'不缓存'``, networkResponse)`

          `return` `networkResponse`

         `}`

          `const responseToCache = networkResponse.clone()`

          `caches.open(CACHE_VERSION).then(cache => {`

            `console.log(``'缓存这个'``, event.request)`

            `cache.put(event.request, responseToCache)`

          `})`

          `return` `networkResponse`

        `});`

      `})`

      `.``catch``((e) => {`

        `console.log(``"error:"``, e);`

      `})`

  `);`

`});`

[Filter table data](#)[Create a pivot table](#)[Create a chart from data series](#)

[Configure buttons visibility](/users/tfac-settings.action)