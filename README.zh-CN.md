# Tuture

Tuture 是一个基于 Git 仓库、轻松且快速编写高质量技术教程的工具。

_其他语言版本_：[English](README.md)。

## 特色

Tuture 革新了技术教程写作的方式。

- **直接从真实的代码库中生成**：你的教程会真实地反映代码库。只需从一个 Git 仓库开始，搭建一个有趣的东西，并且写好提交信息，Tuture 就会把所有的精彩带到你的教程中。随着灵感的累积，你的代码库会成长，你的教程也会。

- **自动提取代码变化**：写教程最大的痛点之一便是要手动提取每一步骤中每个文件的代码变化。幸运的是，Tuture 会为你处理这个艰巨且容易出错的任务，因此你只需专注于书写优秀的教程。

- **对着代码写教程**：对着你的代码去写一些东西显然更简单，思路更清晰。搭配完整的 Markdown 编辑功能和一系列方便的工具，书写优质技术文章从未如此有趣。

- **轻松分享你的作品**：分享精神是极客社区历史悠久的传统之一，而 Tuture 完全重视和欣赏这一点。幸运的是，只需一句命令即可发布你的教程（`tuture publish` 然后就搞定了）。访问 [tuture.co](https://tuture.co) 来看看你和其他人写的教程吧！

## 安装

确保你已经安装了 [Git](https://git-scm.com/), [Node.js](https://nodejs.org/) (>= 8.0.0) 和 [npm](https://www.npmjs.com/) (>= 5.0.0)。

> 你可能需要 `sudo` 权限来全局安装 npm 包。

- **通过 npm 安装**

```bash
$ npm i -g tuture
```

- **通过 yarn 安装**

```bash
$ yarn global add tuture
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
