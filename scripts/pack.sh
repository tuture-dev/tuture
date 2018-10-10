#!/bin/bash

set -e -x

# cleaning outdated distributions.
rm -rf dist
mkdir dist

# packaging binaries with pkg.
npx pkg -t node8-linux-x64,node8-linux-x86,node8-macos-x64,node8-macos-x86,node8-win-x64,node8-win-x86 .

make_tarball() {
  binary=$1
  tarball_name=$2

  mv $binary tuture
  tar -czvf dist/$tarball_name tuture
  rm tuture
}

make_tarball tuture-linux-x64 tuture-linux-x64.tar.gz
make_tarball tuture-linux-x86 tuture-linux-x86.tar.gz
make_tarball tuture-macos-x64 tuture-macos-x64.tar.gz
make_tarball tuture-macos-x86 tuture-macos-x86.tar.gz
make_tarball tuture-win-x64.exe tuture-win-x64.tar.gz
make_tarball tuture-win-x86.exe tuture-win-x86.tar.gz
