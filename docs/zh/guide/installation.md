# 安装

## Git

图雀基于 Git 仓库进行教程写作，因此首先要确保 Git 安装成功。如果没有安装过，请访问 [git-scm.com](https://git-scm.com/downloads) 下载。安装完成后，在终端（控制台）中运行以下命令以确认安装成功：

```
git version
```

如果能够成功显示版本信息，则说明已安装成功！

## 下载开箱可用的可执行文件

1. 访问我们的 [GitHub release 页面](https://github.com/tutureproject/tuture/releases)，下载适合您机器运行的压缩包。

2. 将二进制可执行文件 `tuture` （在 Windows 上是 `tuture.exe`）解压缩。

3. 将此可执行文件添加到系统路径上去：

  - 对 Linux/macOS 用户，打开终端并进入到 tuture 可执行文件所在的路径：

  ```bash
  $ cd /path/to/tuture
  $ sudo mv tuture /usr/local/bin
  ```

  - 对 Windows 用户，只需将可执行文件以管理员身份添加到 `C:\Windows` 文件夹中。

4. 通过运行 `tuture --version` 命令确认 `tuture` 可执行文件安装成功。

::: tip 提示
对于 Linux/macOS 用户，以下是所有命令的总结（记得复制正确的下载链接）：

```bash
$ wget https://github.com/tutureproject/tuture/releases/download/[VERSION]/tuture-[OS]-[ARCH].tar.gz
$ tar -xzvf tuture-[OS]-[ARCH].tar.gz
$ sudo mv tuture /usr/local/bin
$ tuture --version
```
:::

大功告成！请继续阅读[开始写作](./start-writing.md)。

## 用包管理器安装

如果已经有了 [Node](https://nodejs.org) 环境，你便可以直接通过 [npm](https://www.npmjs.com/)  或 [yarn](https://yarnpkg.com) 这样的包管理器来安装 Tuture。

::: warning 警告
请确保下载并安装的 Node 版本不小于 8.0.0！
:::

```bash
$ npm i -g tuture
```

::: tip 提示
你可能需要 `sudo`（对于 Windows 用户来说是管理员身份）来全局安装 npm 包。
:::

如果你偏爱 [yarn](https://yarnpkg.com) 安装：

```bash
$ yarn global add tuture
```

## 从源代码安装

如果你想要体验最新的功能或是想要为 Tuture 贡献源代码，那么推荐从源代码安装。首先请访问 [tuture](https://github.com/tutureproject/tuture) 的 GitHub 仓库并 clone 到本地，进入仓库后进行安装：

```bash
$ npm i -g
```
