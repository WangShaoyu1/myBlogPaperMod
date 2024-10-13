---
author: "王宇"
title: "rxjs优化异步状态"
date: 八月22,2024
description: "rxjs"
tags: ["rxjs"]
ShowReadingTime: "12s"
weight: 531
---
1\. 虚拟人拖动放手3秒后复位
================

难点：复位时间刚好到了，如果正在拖动也不能复位

  

**优化前**

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

`let moving =` `false``,`

  `movingTimer =` `null``;`

`const reset = () => {`

  `if` `(moving) {`

    `clearTimeout(movingTimer);`

  `}`

  `movingTimer = setTimeout(() => {`

    `if` `(moving) {`

      `// 还不能复位`

      `reset();`

      `moving =` `false``;`

      `return``;`

    `}`

    `// a?.stage?.reset();`

    `resetSize();`

    `movingTimer =` `null``;`

  `}, 3000);`

`};`

`const touchmove = () => {`

  `moving =` `true``;`

`};`

`const touchEnd = (e) => {`

  `console.log(``"touchEnd"``);`

  `moving =` `true``;`

  `reset();`

`};`

**优化后**

[?](#)

`const touchend$ = fromEvent(haihumanRef.value,` `"touchend"``).pipe(`

  `debounceTime(3000),`

`)`

`const touchmove$ = fromEvent(haihumanRef.value,` `"touchmove"``).pipe(`

  `switchMap(() => touchend$)` `// 旧写法：switchMapTo(touchend$)`

`).subscribe(resetSize)`

**更简短但没那么好的优化**

[?](#)

`const` `touchmove$ = fromEvent(haihumanRef.value,` `"touchmove"``)`

  `.pipe(debounceTime(``3000``))`

  `.subscribe(resetSize);`

只用了touchmove的防抖，但因为没用到touchend如果不松手也会触发订阅事件

1.1. 兼容pc端
----------

由于pc没touch事件，只能用mouse事件模拟，顺便做个兼容，利用merge合并两个数据流

[?](#)

`const touchend$ = fromEvent(haihumanRef.value,` `"touchend"``).pipe(`

  `debounceTime(3000)`

`);`

`const mobileMove$ = fromEvent(haihumanRef.value,` `"touchmove"``).pipe(`

  `switchMap(() => touchend$)`

`);`

`const mouseDown$ = fromEvent(haihumanRef.value,` `"mousedown"``);`

`const mouseUp$ = fromEvent(haihumanRef.value,` `"mouseup"``);`

`const mouseMove$ = fromEvent(haihumanRef.value,` `"mousemove"``);`

`const pcMove$ = mouseDown$.pipe(`

  `switchMap(() => mouseMove$.pipe(takeUntil(mouseUp$))),`

  `debounceTime(3000)`

`);`

`merge(pcMove$, mobileMove$).pipe(tap(resetSize)).subscribe();`

  

2\. 区分单击，双击事件
=============

**优化前**

[?](#)

`let clickNum = 1,`

  `clickTimer =` `null``,`

  `lastClickTime = 0;`

`// 兼容单击和双击`

`const dblClickHai = () => {`

  `let nowTime = Date.now();`

  `if` `(nowTime - lastClickTime < 300) {`

    `console.log(``"双击"``);`

    `move(moveList1);`

    `clickNum++;`

    `lastClickTime = 0;`

    `clickTimer && clearTimeout(clickTimer);`

  `}` `else` `{`

    `lastClickTime = nowTime;`

    `clickTimer = setTimeout(() => {`

      `console.log(``"单击"``);`

      `move(moveList0);`

      `if` `(clickNum > 1) {`

        `clickNum = 1;`

        `return``;`

      `}`

    `}, 300);`

  `}`

`};`

**优化后**

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

`import { asyncScheduler } from` `"rxjs/internal/scheduler/async"``;`

`const click$ = fromEvent(haihumanRef.value,` `"click"``);`

 `const throttle$ = click$.pipe(`

   `throttleTime(250, asyncScheduler, {`

     `leading:` `false``,` `// 是否在延迟开始前调用函数`

     `trailing:` `true``,` `// 是否在延迟开始后调用函数`

   `})`

 `);`

 `click$`

   `.pipe(`

     `buffer(throttle$),`

     `map((arr) => arr.length)`

   `)`

   `.subscribe((len) => {`

     `if` `(len < 2) {`

       `// 单击`

       `move(moveList0);`

     `}` `else` `{`

       `// 双击`

       `move(moveList1);`

     `}`

   `});`

  

3\. 一定时间内没识别内容
==============

**优化**

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

`const timerSource$ = timer(10 * 1000).pipe(`

  `filter(() => !text.value && ![``"CLOSING"``,` `"CLOSED"``].includes(status.value))`

`);`

 `// ws open后开始计时`

    `const subscription = timerSource$.subscribe(() => {`

      `subscription.unsubscribe();`

      `sayLast();`

    `});`

  

4\. 屏保里关闭按钮的碰撞运动
================

[?](#)

`let startCurrent = { x: 0, y: 0 };`

`let main;`

`let maxX = window.innerWidth;`

`let maxY = window.innerHeight;`

`let subscription;`

`let subscriptionTimer;`

`// 有direction参数就生成四条边的随机位置，否则生成屏幕里随机位置`

`const getBorderPos = (direction) => {`

  `const choices = [``"l"``,` `"r"``,` `"t"``,` `"b"``];` `// 左右上下`

  `const s = choices.filter((_) => _ !== direction);`

  `const _direction = s[Math.floor(Math.random() * s.length)];`

  `if` `(_direction ===` `"l"``) {`

    `return` `{`

      `x: 0,`

      `y: ~~(Math.random() * maxY),`

    `};`

  `}`

  `if` `(_direction ===` `"r"``) {`

    `return` `{`

      `x: maxX,`

      `y: ~~(Math.random() * maxY),`

    `};`

  `}`

  `if` `(_direction ===` `"t"``) {`

    `return` `{`

      `x: ~~(Math.random() * maxX),`

      `y: 0,`

    `};`

  `}`

  `if` `(_direction ===` `"b"``) {`

    `return` `{`

      `x: ~~(Math.random() * maxX),`

      `y: maxY,`

    `};`

  `}`

  `return` `{`

    `x: ~~(Math.random() * maxX),`

    `y: ~~(Math.random() * maxY),`

  `};`

`};`

`const getRandomPos = (origin) => {`

  `const leftOrRight = Math.random() < 0.5 ?` `"l"` `:` `"r"``;`

  `const topOrBottom = Math.random() < 0.5 ?` `"t"` `:` `"b"``;`

  `if` `(origin.x === 0) {`

    `return` `getBorderPos(``"l"``);`

  `}`

  `if` `(origin.y === 0) {`

    `return` `getBorderPos(``"t"``);`

  `}`

  `if` `(origin.x === maxX) {`

    `return` `getBorderPos(``"r"``);`

  `}`

  `return` `getBorderPos(``"b"``);`

`};`

`function` `tween(start, end, duration) {`

  `const diff = {`

    `x: end.x - start.x,`

    `y: end.y - start.y,`

  `};`

  `return` `animationFrames().pipe(`

    `map(({ elapsed }) => {`

      `return` `elapsed / duration;`

    `}),`

    `takeWhile((v) => v < 1),`

    `endWith(1),`

    `map((v) => ({`

      `x: v * diff.x + start.x,`

      `y: v * diff.y + start.y,`

    `}))`

  `);`

`}`

`const run = (startPos = { x: 0, y: 0 }) => {`

  `const endPos = getRandomPos(startPos);`

  `console.log(``"startPos"``, startPos);`

  `console.log(``"endPos"``, endPos);`

  `subscription = tween(`

    `startPos,`

    `endPos,`

    `5000 + Math.random() * 10000`

  `).subscribe({`

    `next: ({ x, y }) => {`

      ``main.style.transform = `translate3d(${x}px, ${y}px, 0)`;``

    `},`

    `complete: () => {`

      `run(endPos);`

    `},`

  `});`

`};`

`const emits = defineEmits(``"onClose"``);`

`const onClose = (isClick) => {`

  `emits(``"onClose"``, isClick);`

`};`

`onUnmounted(() => {`

  `subscription?.unsubscribe();`

  `subscriptionTimer?.unsubscribe();`

`});`

`onMounted(() => {`

  `main = document.querySelector(``".screensaver-close"``);`

  `maxX = window.innerWidth - main.offsetWidth;`

  `maxY = window.innerHeight - main.offsetHeight;`

  `run(getBorderPos());`

  `subscriptionTimer = timer(3 * 60 * 1000)`

    `.pipe(`

      `tap(() => {`

        `onClose();`

      `})`

    `)`

    `.subscribe();`

`});`

  

5\. 屏保退出逻辑
==========

进入屏保，假如没交互过（这里就以有没调用过click、touchmove为依据），就xxx秒后自动关闭。假如中途有交互过，就重新计时xxx秒

[?](#)

`const afterActionTime = 40 * 1000;` `// 交互后计时时间`

`const click$ = fromEvent(swiperRef.value,` `"click"``);`

`const touchmove$ = fromEvent(swiperRef.value,` `"touchmove"``);`

`const action$ = merge(click$, touchmove$);`

`const closeTime$ = timer(2 * 60 * 1000).pipe(map(() =>` `"close"``));`

`// 倒数关闭，如果中途有动过，再延迟40s`

`subscriptionTimer = race(closeTime$, action$)`

  `// .pipe(take(1))`

  `.subscribe((val) => {`

    `subscriptionTimer.unsubscribe();`

    `// 自动关闭`

    `if` `(val ===` `"close"``) {`

      `onClose();`

    `}` `else` `{`

      `// 有过交互，每一下都重置时间40s`

      `subscriptionTimer = merge(`

        `timer(afterActionTime).pipe(takeUntil(action$)),`

        `action$.pipe(debounceTime(afterActionTime))`

      `).subscribe(() => onClose());`

    `}`

  `});`

6\. 快捷提问每n秒更换
=============

通过修改index来更换一批批要显示的问题，想开始这个轮训逻辑的时候记得对grid$.subscribe()

[?](#)

`const grid$ = interval(10 * 1000).pipe(`

  `tap(() => {`

    `const newIndex = index.value + num;`

    `const diff = newIndex - len.value;`

    `index.value = diff >= 0 ? diff : newIndex;`

  `})`

`);`

7\. 多个外部事件重置回调函数
================

每次触发merge$流里的事件，都重置倒计时

subscribe函数支持马上执行参数，可以马上出发计时

[?](#)

`const timerSource$ = timer(15 * 1000);`

`const speechResult$ = fromEvent(document,` `"speechResult"``);`

`const wakeUp$ = fromEvent(document,` `"wakeUp"``);`

`const talk$ = fromEvent(document,` `"talk"``);`

`const click$ = fromEvent(document,` `"click"``);`

`const touchmove$ = fromEvent(document,` `"touchmove"``);`

`const merge$ = merge(speechResult$, wakeUp$, talk$, click$, touchmove$);`

`const subscribe = (immediate =` `false``) => {`

  `const immediateTrigger$ = immediate ? of(``null``) : of();`

  `subscription = merge(immediateTrigger$, merge$)`

    `.pipe(switchMap(() => timerSource$))`

    `.subscribe(() => {`

      `console.log(``"超时暂停拾音"``);`

      `stop();`

      `emits(``"onEnd"``);`

    `});`

`};`

[Filter table data](#)[Create a pivot table](#)[Create a chart from data series](#)

[Configure buttons visibility](/users/tfac-settings.action)