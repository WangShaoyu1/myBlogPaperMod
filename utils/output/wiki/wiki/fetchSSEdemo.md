---
author: "王宇"
title: "fetchSSEdemo"
date: 三月07,2023
description: "chatGPT与OpenAI相关学习资料"
tags: ["chatGPT与OpenAI相关学习资料"]
ShowReadingTime: "12s"
weight: 513
---
stream配置为true时

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

`const eventSource =` `new` `EventSource(``'/sse'``);`

`eventSource.onmessage = (event) => {`

  `console.log(event.data);`

`};`

`eventSource.onerror = (error) => {`

  `console.error(error);`

`};`

`function` `fetchSSE(url) {`

  `return` `fetch(url, {`

    `headers: {`

      `'Accept'``:` `'text/event-stream'`

    `}`

  `});`

`}`

`fetchSSE(``'/sse'``)`

  `.then((response) => {`

    `const reader = response.body.getReader();`

    `const decoder =` `new` `TextDecoder(``'utf-8'``);`

    `let buffer =` `''``;`

    `reader.read().then(``function` `processResult(result) {`

      `if` `(result.done) {`

        `return``;`

      `}`

      `buffer += decoder.decode(result.value, {stream:` `true``});`

      `const events = buffer.split(``'\n\n'``);`

      `for` `(let i = 0; i < events.length - 1; i++) {`

        `const event =` `new` `Event(``'message'``);`

        `event.data = events[i];`

        `eventSource.dispatchEvent(event);`

      `}`

      `buffer = events[events.length - 1];`

      `return` `reader.read().then(processResult);`

    `});`

  `})`

  `.``catch``((error) => {`

    `console.error(error);`

  `});`

[Filter table data](#)[Create a pivot table](#)[Create a chart from data series](#)

[Configure buttons visibility](/users/tfac-settings.action)