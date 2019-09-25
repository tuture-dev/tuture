# Installation

## Git

Tuture is based on the Git repositories for tutorial writing, so first make sure you have Git installed. If not, please visit [git-scm.com](https://git-scm.com/downloads) to download it. After that, run the following command in your terminal (console) to confirm the installation:

```
git version
```

If you get version info, move on.

## Download Ready-to-use Binaries

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

::: tip
For Linux/macOS users, here is the summary of commands (remember to copy the correct download link):

```bash
$ wget https://github.com/tutureproject/tuture/releases/download/[VERSION]/tuture-[OS]-[ARCH].tar.gz
$ tar -xzvf tuture-[OS]-[ARCH].tar.gz
$ sudo mv tuture /usr/local/bin
$ tuture --version
```
:::

You are done! Please continue reading [start-writing](./start-writing.md).

## Install from package managers

If [Node](https://nodejs.org) environment is already present, you can trivially install Tuture with package managers like [npm](https://www.npmjs.com/) or [yarn](https://yarnpkg.com).

::: warning
Node version should be above 8.0.0!
:::

```bash
$ npm i -g tuture
```

::: tip
You may need `sudo` (or "Run As Administrator" for Windows users) to install npm packages globally.
:::

Or if you prefer **yarn**:

```bash
$ yarn global add tuture
```

## Install From Source

If you want to be exposed to newest features or contribute to Tuture, installing from source is recommended. Clone our codebase from [GitHub](https://github.com/tutureproject/tuture), `cd` into the repository and install:

```bash
$ npm i -g
```
