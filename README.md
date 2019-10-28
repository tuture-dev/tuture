# Tuture

![](https://github.com/tutureproject/tuture/workflows/Continuous%20Integration/badge.svg)

Tuture is a tool for writing high-quality tutorials with both ease and speed based on Git repositories.

_Read this in other languages_: [简体中文](README.zh-CN.md).

## Features

Tuture revolutionizes the way of writing tech tutorials.

- **Generated directly from a live codebase**: Your tutorial will be a faithful mirror of your code. Just start from a Git repo, build something interesting with nicely-written commit messages, and Tuture will bring all the good things to your tutorial. Your codebase will grow as more inspiration come in, so will your tutorial.

- **Automatic extraction of code diff**: One of the greatest pain point of writing tutorials is the daunting manual work of collecting code snippets of each changed file for each step. Fortunately, Tuture will handle this boring and error-prone work for you, so you can just focus on writing amazing tuturials.

- **Edit tutorials alongside your code**: It can be much clearer and easier to write something just next to your code. With full-fleged markdown support and a series of handy tools, writing high-quality tech posts has never been this fun.

## Installation

Make sure you have [Git](https://git-scm.com/) installed on your machine. You can check by running `git version`. If not, head to Git [downloads page](https://git-scm.com/downloads).

### Download ready-to-use binaries

1. Visit our [Github release page](https://github.com/tutureproject/tuture/releases) to download binary distribution suited to your machine.

2. Extract the binary file `tuture` (or `tuture.exe` on Windows).

3. Move the binary to your system path:

  - For Linux/macOS users, open your terminal and navigate to where the tuture binary resides:

  ```bash
  $ cd /path/to/tuture
  $ sudo mv tuture /usr/local/bin
  ```

  - For Windows users, simply move the binary to `C:\Windows` folder as Administrator.

4. Checkout whether `tuture` binary works by running `tuture --version`.

### Install with package managers

We assume that [Node.js](https://nodejs.org/) (>= 8.0.0) and [npm](https://www.npmjs.com/) (>= 5.0.0) are already avaiable.

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

### Install from source

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
