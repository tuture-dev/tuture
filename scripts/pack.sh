#!/bin/bash

set -e -x

# cleaning outdated distributions.
rm -rf dist
mkdir dist

# packaging binaries with pkg.
npx pkg -t node12-linux-x64,node12-macos-x64,node12-win-x64 .

make_zip() {
  binary=$1
  target=$2

  mv $binary tuture
  zip -r dist/$target tuture
  rm tuture
}

make_win_zip() {
  binary=$1
  target=$2

  # we have to keep .exe suffix here.
  mv $binary tuture.exe
  zip -r dist/$target tuture.exe
  rm tuture.exe
}

make_zip tuture-linux tuture-linux.zip
make_zip tuture-macos tuture-macos.zip
make_win_zip tuture-win.exe tuture-windows.zip
