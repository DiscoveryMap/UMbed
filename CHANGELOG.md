# Changelog
All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/)
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

## [0.0.4] - 2018-10-29
### Changed
- Moved logging methods into a new `Log` object plus fixed broken `fn()` method (née `currentFn()`) 
  which identifies the currently executing function name.
- Logging helper methods `debug()`, `warn()`, and `error()` methods now call respective
  `console` methods in browsers that support them.
- Additional fix for issue where `init()` callback could potentially execute before all
  prerequisite CSS & JS files had completely loaded (esp. when including JS as browser
  globals) by resolving all promises prior to calling `_inject()`.
- Fixed minor JS syntax warnings identified by JSHint.

### Added
- Internal `Log` class containing previous logging methods (as mentioned above), plus new
  `startTimer()` and `stopTimer()` methods for performance timing when `log_level` is set
  to `debug`.
- Added `package.json` and `Gruntfile.js` files for automating syntax validation with JSHint.

## [0.0.3] - 2018-10-13
### Changed
- Additional fix for issue where `init()` callback could potentially execute before all
  prerequisite CSS & JS files had completely loaded (esp. when including JS as browser
  globals) by resolving all promises prior to calling `_inject()`.

## [0.0.2] - 2018-06-14
### Added
- Internal `_log()` method for consistent logging (incl. calling function), plus internal
  `_info()`, `_warn()`, and `error()` helper methods.
- `log_level` option (`debug', `info', `warn`, or `error`) for `UMbed()` which sets the
  minimum level of log messages to show in the console (default: `warn`)
- `dependencies` option for `UMbed()` to specify prerequisites (in addition to hard-coding)
- Initial HTML [test files](test/) (currently only embed via browser globals)

### Changed
- Fix for `UMbed()` call queueing & syntax error introduced when adapted from DMIWebMapEmbed.js
- Fixed issue where `init()` callback could potentially execute before all prerequisite
  CSS & JS files had completely loaded (esp. when including JS as browser globals, i.e.
  no module loader available) by utilizing promises
- Updated README

## 0.0.1 - 2018-06-07
### Added
- This CHANGELOG file
- Initial README describing the project
- MIT license LICENSE file
- Initial version of src/UMbed.js adapted from Discovery Map International's
  DMIWebMapEmbed.js (by permission)

[Unreleased]: compare/0.0.4...HEAD
[0.0.4]: compare/0.0.3...0.0.4
[0.0.3]: compare/0.0.2...0.0.3
[0.0.2]: compare/0.0.1...0.0.2
