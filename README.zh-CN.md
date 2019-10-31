<p align="center"><a href="https://tuture.co" target="_blank" rel="noopener noreferrer"><img src="./media/logo.svg" alt="Tuture logo"></a></p>

# Tuture

Tuture 是一个基于 Git 仓库、轻松且快速编写高质量技术教程的工具。

_其他语言版本_：[English](README.md)。

## 特色

Tuture 革新了技术教程写作的方式。

- **直接从真实的代码库中生成**：你的教程会真实地反映代码库。只需从一个 Git 仓库开始，搭建一个有趣的东西，并且写好提交信息，Tuture 就会把所有的精彩带到你的教程中。随着灵感的累积，你的代码库会成长，你的教程也会。

- **自动提取代码变化**：写教程最大的痛点之一便是要手动提取每一步骤中每个文件的代码变化。幸运的是，Tuture 会为你处理这个艰巨且容易出错的任务，因此你只需专注于书写优秀的教程。

- **对着代码写教程**：对着你的代码去写一些东西显然更简单，思路更清晰。搭配完整的 Markdown 编辑功能和一系列方便的工具，书写优质技术文章从未如此有趣。

- **轻松分享你的教程**：只需一条命令，你的教程便可以构建成即可发表的 Markdown 文件。除此之外，我们还提供了专门的[平台](https://github.com/tutureproject/hub)来分享你的教程。

## 安装

确保你已经安装了 [Git](https://git-scm.com/)。你可以通过运行 `git version` 命令来检查是否已安装。如果未安装，请访问 Git [下载页面](https://git-scm.com/downloads)。

### 用包管理器安装

我们假定你已经安装好 [Node.js](https://nodejs.org/) (>= 8.0.0) 和 [npm](https://www.npmjs.com/) (>= 5.0.0)。

> 你可能需要 `sudo` 权限来全局安装 npm 包。

- **通过 npm 安装**

```bash
npm i -g tuture
```

- **通过 yarn 安装**

```bash
yarn global add tuture
```

> 用 yarn 全局安装二进制可执行文件有时会失败（查看此 [issue](https://github.com/yarnpkg/yarn/issues/1321)），因此我们不推荐这种方法。如果你坚持要使用 yarn，可以通过 `export PATH="$PATH:$(yarn global bin)"` 来解决。

### 下载开箱可用的可执行文件

1. 访问我们的 [GitHub release 页面](https://github.com/tutureproject/tuture/releases)，下载适合您机器运行的压缩包。

2. 将二进制可执行文件 `tuture` （在 Windows 上是 `tuture.exe`）解压缩。

3. 将此可执行文件添加到系统路径上去：

  - 对 Linux/macOS 用户，打开终端并进入到 tuture 可执行文件所在的路径：

  ```bash
  cd /path/to/tuture
  sudo mv tuture /usr/local/bin
  ```

  - 对 Windows 用户，只需将可执行文件以管理员身份添加到 `C:\Windows` 文件夹中。

4. 通过运行 `tuture --version` 命令确认 `tuture` 可执行文件安装成功。

### 通过源代码安装

将本仓库 clone 到本地后，进入到仓库根目录并执行以下命令安装：

```bash
# 安装所有依赖
npm i
# 构建编辑器和命令行工具
npm run build
# 全局安装 Tuture
npm i -g
```

## 文档

想要了解更多？请访问我们的[主页](https://tuture.co)查看所有文档。

## 为何取名叫 Tuture？

Tutorials from the future. 来自未来的教程。

## 许可证

[MIT](LICENSE)。
