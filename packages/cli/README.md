@tuture/cli
===========

CLI for Tuture

[![oclif](https://img.shields.io/badge/cli-oclif-brightgreen.svg)](https://oclif.io)
[![Version](https://img.shields.io/npm/v/@tuture/cli.svg)](https://npmjs.org/package/@tuture/cli)
[![Downloads/week](https://img.shields.io/npm/dw/@tuture/cli.svg)](https://npmjs.org/package/@tuture/cli)
[![License](https://img.shields.io/npm/l/@tuture/cli.svg)](https://github.com//cli/blob/master/package.json)

<!-- toc -->
* [Usage](#usage)
* [Commands](#commands)
<!-- tocstop -->
# Usage
<!-- usage -->
```sh-session
$ npm install -g @tuture/cli
$ tuture COMMAND
running command...
$ tuture (-v|--version|version)
@tuture/cli/0.0.2 darwin-x64 node-v12.10.0
$ tuture --help [COMMAND]
USAGE
  $ tuture COMMAND
...
```
<!-- usagestop -->
# Commands
<!-- commands -->
* [`tuture build`](#tuture-build)
* [`tuture commit`](#tuture-commit)
* [`tuture destroy`](#tuture-destroy)
* [`tuture help [COMMAND]`](#tuture-help-command)
* [`tuture init`](#tuture-init)
* [`tuture pull`](#tuture-pull)
* [`tuture push`](#tuture-push)
* [`tuture reload`](#tuture-reload)
* [`tuture sync`](#tuture-sync)
* [`tuture up`](#tuture-up)

## `tuture build`

Build tutorial into a markdown document

```
USAGE
  $ tuture build

OPTIONS
  -h, --help     show CLI help
  -o, --out=out  name of output directory
  --hexo         hexo compatibility mode
```

## `tuture commit`

Commit your tutorial to VCS (Git)

```
USAGE
  $ tuture commit

OPTIONS
  -h, --help             show CLI help
  -m, --message=message  commit message
```

## `tuture destroy`

Delete all tuture files

```
USAGE
  $ tuture destroy

OPTIONS
  -f, --force  destroy without confirmation
  -h, --help   show CLI help
```

## `tuture help [COMMAND]`

display help for tuture

```
USAGE
  $ tuture help [COMMAND]

ARGUMENTS
  COMMAND  command to show help for

OPTIONS
  --all  see all commands in CLI
```

_See code: [@oclif/plugin-help](https://github.com/oclif/plugin-help/blob/v2.2.3/src/commands/help.ts)_

## `tuture init`

Initialize a tuture tutorial

```
USAGE
  $ tuture init

OPTIONS
  -h, --help  show CLI help
  -y, --yes   do not ask for prompts
```

## `tuture pull`

Pull the remote tuture branch to local

```
USAGE
  $ tuture pull

OPTIONS
  -h, --help           show CLI help
  -r, --remote=remote  name of remote to pull
```

## `tuture push`

Push the tuture branch to remote

```
USAGE
  $ tuture push

OPTIONS
  -h, --help           show CLI help
  -r, --remote=remote  name of remote to push
```

## `tuture reload`

Update workspace with latest commit history

```
USAGE
  $ tuture reload

OPTIONS
  -h, --help  show CLI help
```

## `tuture sync`

Synchronize workspace with local/remote branch

```
USAGE
  $ tuture sync

OPTIONS
  -h, --help             show CLI help
  -m, --message=message  commit message
  --configureRemotes     configure remotes before synchronization
  --continue             continue synchronization after resolving conflicts
  --noPull               do not pull from remote
  --noPush               do not push to remote
```

## `tuture up`

Render and edit tutorial in browser

```
USAGE
  $ tuture up

OPTIONS
  -h, --help       show CLI help
  -p, --port=port  which port to use for editor server
```
<!-- commandsstop -->
