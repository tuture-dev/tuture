# Tuture Renderer

[![Build Status](https://travis-ci.com/tutureproject/renderer.svg?branch=master)](https://travis-ci.com/tutureproject/renderer/)

这是 [Tuture](https://github.com/tutureproject/tuture) 官方的支持的默认渲染器。

## 特点

tuture-renderer 将 **tuture.yml** 文件的内容以一种直观、有序、合理的方式呈现在 Web 页面上。

- **它是独立的，也是依赖的。**tuture-renderer 作为一个独立的 npm 模块，它可以单独安装并在符合条件的情况下（我们将在后面提及）使用。同时，它作为 Tuture 内置的默认渲染器，通过 `tuture up` 命令也能调用 tuture-renderer 来将你通过 `tuture init` 生成的**tuture.yml** 文件解析并渲染在 Web 页面上。
- **它是极易扩展的。** 我们后续将会基于 tuture-renderer 的整体架构，抽离出一套可扩展的组件库，它会随着互联网教程渲染的需求的变化而不断迭代、改进。
- **它是可复用的。** tuture-renderer 将会被支持可方便集成到现有业务网站上，与 Tuture 的协同工作，为团队内部撰写教程，渲染教程，传播团队文化和知识借力。
- **它是开放的。** tuture-renderer 是一个完全开源的工具。我们非常欢迎对 tuture-renderer 感兴趣的朋友为它的成长贡献自己的一份力量，为互联网技术知识的传播贡献自己的一份力量。

## 安装

确保你已经安装了 [Node.js](http://nodejs.org/) (>= 8.0.0) 和 [npm](https://www.npmjs.com/) (>= 5.0.0)。

- **通过 npm 安装**

```shell
$ npm i -g tuture-renderer
```

- **通过源代码安装**

将本仓库 clone 到本地后，进入到仓库下，执行以下命令安装：

```shell
$ npm i -g
```

## 如何使用

tuture-renderer 它必须在一个 Tuture 仓库下使用，即必须在执行了 `tuture init` 的仓库下使用。具体详情请参考 [Tuture](https://github.com/tutureproject/tuture) 说明。

一旦我们拥有了以上符合条件的仓库。那么我们我们有两种方式来使用 tuture-renderer：

- 直接在命令行运行 `tuture-renderer` 命令。

```shell
$ tuture-renderer
```

- 在命令行中运行 `tuture up` 命令，`tuture up` 会在内部调用 `tuture-renderer` 命令。

```shell
$ tuture up
```

运行命令之后，tuture-renderer 将会打开浏览器窗口，渲染 Tuture 仓库下 **tuture.yml** 以及 **diff** 文件的内容。通过修改 **tuture.yml** ，然后保存，浏览器会自动刷新并重新渲染你的内容。
