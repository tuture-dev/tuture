# Tuture

Tuture 是一个基于 Git 仓库、轻松且快速编写高质量技术教程的工具。

_其他语言版本_：[English](README.md)。

## 特色

Tuture 革新了技术教程写作的方式。

- **直接从真实的代码库中生成**：你的教程会真实地反映代码库。只需从一个 Git 仓库开始，搭建一个有趣的东西，并且写好提交信息，Tuture 就会把所有的精彩带到你的教程中。随着灵感的累积，你的代码库会成长，你的教程也会。

- **自动提取代码变化**：写教程最大的痛点之一便是要手动提取每一步骤中每个文件的代码变化。幸运的是，Tuture 会为你处理这个艰巨且容易出错的任务，因此你只需专注于书写优秀的教程。

- **用编程的方式写作**：在过去，写作更多的是一种随意并且个性化的过程。但是有了 Tuture，你可以用一种非常接近编程的方式来书写教程。整个教程可以完全被一个 YAML 文件确定下来，因此你只需填写所需的字段。

- **浏览器中炫酷的渲染**：由于 JavaScript 相关技术的快速发展，Tuture 完全能够将你的教程以一种优美且具有交互性的方式展现出来。

## 安装

确保你已经安装了 [Node.js](https://nodejs.org/) (>= 8.0.0) 和 [npm](https://www.npmjs.com/) (>= 5.0.0)。

> 你可能需要 `sudo` 权限来全局安装 npm 包。

- **通过 npm 安装**

```bash
$ npm i -g tuture tuture-cli
```

- **通过 yarn 安装**

```bash
$ yarn global add tuture tuture-cli
```

> 用 yarn 全局安装二进制可执行文件有时会失败（查看此 [issue](https://github.com/yarnpkg/yarn/issues/1321)），因此我们不推荐这种方法。如果你坚持要使用 yarn，可以通过 `export PATH="$PATH:$(yarn global bin)"` 来解决。

- **通过源代码安装**

将本仓库 clone 到本地后，执行以下命令安装：

```bash
$ npm i -g
```

## 文档

在[这里](https://github.com/tutureproject/docs)查看所有文档。

## 为何取名叫 Tuture？

Tutorials from the future. 来自未来的教程。

## 许可证

[MIT](LICENSE)。
