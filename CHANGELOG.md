# Changelog
All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/)
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]
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

[Unreleased]: compare/0.0.1...HEAD
