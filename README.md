# UMbed.js

Universal embedding (U-M-BED) of JavaScript code in third party sites.

## Overview

_UMbed_ is a small JavaScript loader designed for embedding your JavaScript code in third party sites or environments, especially if you are using common JavaScript libraries which may already be loaded or cached in the target environment and you want to take advantage of that fact.

If you've developed a self-contained, stand-alone piece of JavaScript to be included in a third party site, implementing a [UMD](https://github.com/umdjs/umd) (Universal Module Descriptor) would be more appropriate and achieve the same result with far less overhead (esp. since many JavaScript tools will convert code to a UMD for you).

However, if you rely on common JavaScript libraries and/or modules, and need your code to load into environments which may be using any of many module loading methods (e.g. AMD, CommonJS, etc.), then _UMbed_ will bootstrap your code using any existing loader (or none) and existing modules/libraries (if present), ensuring that the requirements of your code are available prior to it running. It also usually requires very minimal code to be inserted into the target site, greatly improving both ease of embedding and performance.

## Features & Benefits

* Minified embed JavaScript code:
  * Small footprint & fast parsing
  * Easily pasted anywhere in HTML page(s)
  * Queues calls to `UMbed()` for execution if `UMbed.js` hasn't loaded yet (à la Google Analytics)
* Bootstrap loader takes advantage of any available module loader:
  * Includes required JavaScript files using any available module loader to prevent conflicts (e.g. [RequireJS Common Errors: Mismatched Anonymous Define() Modules…](http://requirejs.org/docs/errors.html#mismatch))
  * Loads all prerequisite resources asynchronously, reducing delays in page load & rendering
  * Specify prerequisite JavaScript modules, libraries, variables, and resources (incl. CSS) once
    * They'll automatically be translated for any module loader
    * You can even require that prerequisite variables exist
  * Ideal for use with large, popular JavaScript libraries
    * Take advantage of CDNs & browser caching
    * Reduce the size of your own code base to improve parsing performance
  * Only executes callback code upon completion of loading all prerequisite JavaScript
  * Supports JavaScript environments with or without module loaders:
    * Browser globals (i.e. no module loader)
    * [AMD](https://github.com/amdjs/amdjs-api/wiki/AMD) (e.g. [RequireJS](http://requirejs.org/))
    * [CommonJS](http://wiki.commonjs.org/wiki/CommonJS)-like (i.e. [Node.js](https://nodejs.org/api/modules.html))

## How to Get Started

_TBD_

## Resources

* https://github.com/browserify/browserify/issues/790#issuecomment-46636501
* http://requirejs.org/docs/errors.html#mismatch

## Copyright & Support

The original code for this project was developed under contract for [Discovery Map International](https://discoverymap.com/) and split out into an open source project under the MIT license by permission. See [LICENSE](LICENSE) for full details.

Discovery Map International does not have the resources necessary to provide support for this project. Volunteer support is provided by developers in their spare time, so any assistance in improving & maintaining the project is welcome (see [CONTRIBUTING](CONTRIBUTING.md)).