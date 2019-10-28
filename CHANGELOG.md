# Changelog

## 2.0.0

### What's New

- Add support for hexo post building
- Add support for splitting tutorials
- Add fully-fledged configuration system (via **.tuturerc** and **.tutureignore**)
- Enable serving assets/images with GitHub
- Remove **login** and **publish** command
- Delicately adjusted editor UI

### Bug Fixes

- Fix editor display when there are no commits
- Fix image upload in editor
- Fix undesired generation of tuture-error.log

## 1.4.0

### New Features

- Add i18n (internationalization) support

## 1.3.1

### Improvements

- Add hint for adding tutorial description
- Open new browser window for links

### Bug Fixes

- Fix crashing problem when no topics given

## 1.3.0

### New Features

= `description` and `topics` for each tutorial are added

- You can now edit titles of the tutorial and each step

### Improvements

- Save tutorial right after finishing a single explanation area
- Size of images is now carefully adjusted
- Enable syntax highlighting for code blocks within markdown
- Copying code will now only include added lines

### Bug Fixes

- Fix content sidebar clicking and scrolling issue
- Fix incorrect line number of code blocks
- Fix browser not open issue when calling `tuture-server`
- Ignore `outdated` steps by default

## 1.2.1

### Bug Fixes

Fix bug of Save/Edit button not working.

## 1.2.0

### New Features

- Add right sidebar for managing changed files within a step easily
- Updated UI with delicate responsive design

### Improvements

- Personalized placeholder for "Add Explain" buttons
- Cute icons for markdown editor toolbar
- Add tooltip after "Adding to Clipboard"
- Add favicon

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
