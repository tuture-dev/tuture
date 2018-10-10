# Tuture

[![Build Status](https://travis-ci.com/tutureproject/tuture.svg?branch=master)](https://travis-ci.com/tutureproject/tuture/)

Tuture is a tool for writing high-quality tutorials with both ease and speed based on Git repositories.

_Read this in other languages_: [简体中文](README.zh-CN.md).

## Features

Tuture revolutionizes the way of writing tech tutorials.

- **Generated directly from a live codebase**: Your tutorial will be a faithful mirror of your code. Just start from a Git repo, build something interesting with nicely-written commit messages, and Tuture will bring all the good things to your tutorial. Your codebase will grow as more inspiration come in, so will your tutorial.

- **Automatic extraction of code diff**: One of the greatest pain point of writing tutorials is the daunting manual work of collecting code snippets of each changed file for each step. Fortunately, Tuture will handle this boring and error-prone work for you, so you can just focus on writing amazing tuturials.

- **Edit tutorials alongside your code**: It can be much clearer and easier to write something just next to your code. With full-fleged markdown support and a series of handy tools, writing high-quality tech posts has never been this fun.

- **Share your work in a breeze**: Sharing is one of the time-honored conventions within the geek community, which is fully valued and appreciated by Tuture. Fortunately, publishing your tutorials is just one command away (`tuture publish` and you are done). Come and visit [tuture.co](https://tuture.co) for tutorials written by you and others!

## Installation

Make sure you have [Git](https://git-scm.com/), [Node.js](https://nodejs.org/) (>= 8.0.0) and [npm](https://www.npmjs.com/) (>= 5.0.0) on your machine.

> You may need `sudo` to install npm packages globally.

- **install with npm**

```bash
$ npm i -g tuture
```

- **install with yarn**

```bash
$ yarn global add tuture
```

> Installing global binaries via yarn can fail sometimes (check out this [issue](https://github.com/yarnpkg/yarn/issues/1321)), so it's not recommended. But you can `export PATH="$PATH:$(yarn global bin)"` if you insist.

- **install from source**

Clone this repo to your machine, `cd` into the project root and run following command:

```bash
$ npm i -g
```

## Documentation

Learn more about Tuture [here](https://github.com/tutureproject/docs).

## Why this name, Tuture?

Tutorials from the future.

## License

Definitely [MIT](LICENSE).
