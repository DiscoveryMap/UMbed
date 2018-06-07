# UMbed

Universal embedding (U-M-BED) of JavaScript code in third party sites.

## Overview

_UMbed_ is a small JavaScript loader designed for embedding your JavaScript code in third party sites or environments, especially if you are using common JavaScript libraries which may already be loaded or cached in the target environment and you want to take advantage of that fact.

If you've developed a self-contained, stand-alone piece of JavaScript to be included in a third party site, implementing a [UMD](https://github.com/umdjs/umd) (Universal Module Descriptor) would be more appropriate and achieve the same result with far less overhead (esp. since many JavaScript tools will convert code to a UMD for you).

However, if you rely on common JavaScript libraries and/or modules, and need your code to load into environments which may be using any of many module loading methods (e.g. AMD, CommonJS, etc.), then _UMbed_ will bootstrap your code using any existing loader (or none) and existing modules/libraries (if present), ensuring that the requirements of your code are available prior to it running. It also usually requires very minimal code to be inserted into the target site, greatly improving both ease of embedding and performance.

Currently supported environments include:

* Web browsers w/o loaders (globals)
* [AMD](https://github.com/amdjs/amdjs-api/wiki/AMD)
* [CommonJS](http://wiki.commonjs.org/wiki/CommonJS)-like (i.e. [Node.js](https://nodejs.org/api/modules.html))

## How to Get Started

_TBD_

## Resources

_TBD_

## Copyright & Support

The original code for this project was developed under contract for [Discovery Map International](https://discoverymap.com/) and split out into an open source project under the MIT license by permission. See [LICENSE](LICENSE) for full details.

Discovery Map International does not have the resources necessary to provide support for this project. Volunteer support is provided by developers in their spare time, so any assistance in improving & maintaining the project is welcome (see [CONTRIBUTING](CONTRIBUTING.md)).