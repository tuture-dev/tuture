# Changelog

## 1.1.0

### New Features

- Add toolbar for markdown editor
- Add copy-to-clipboard function for each code block

### Improvements

`tuture-server` now fully supports dynamic port usage.

## 1.0.1

Bump version due to a historical mistake.

## 1.0.0

### New Features

Edit your tutorial just in browser!

- Smooth transition between edit and preview mode
- Full-fledged markdown support (Yes! We support image uploading)
- Move all steps into one page

### Improvements

- Ridiculously fast launch speed, due to our new SSR (Server-Side Rendering) architecture
- Syntax highlighting support for nearly all languages

## 0.3.1

Rename the global binary to `tuture-server`.

## 0.3.0

_This package has been renamed to **tuture**._

## 0.2.1

### New Features

- Add line number for code blocks

### Improvements

- Disable code emphasis when the entire diff file is newly added

### Bug Fixes

- Fix broken syntax highlight in some cases

## 0.2.0

### New Features

- Brand-new UI
- Add markdown support for writing explanations
- Add syntax highlighting (currently only HTML, CSS, JavaScript) for code blocks
- Reuse the same window when firing renderer for multiple times

### Breaking Changes

- Split view of diff is removed

### Bug Fixes

- Fix a bug where the page title would always be the default
