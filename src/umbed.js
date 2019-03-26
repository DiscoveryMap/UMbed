/*
 * UMbed.js
 * 
 * Automates inclusion of required JS & CSS. Optimizes load order, conflict/error handling,
 * reporting, and supports use in AMD (e.g. RequireJS) and CommonJS-like environments.
 * 
 * Note: Implements UMD pattern (see <https://github.com/umdjs/umd/blob/master/templates/returnExportsGlobal.js>).
 * There is significant complexity added because this is also a CSS/JS loader.
 * 
 * Example:
 *
 * <script>
 *   (function(u,m,b,e,d,j,s){m[e]=m[e]||function(){(m[e].q=m[e].q||[]).push(arguments)};
 *   j=u.getElementsByTagName(b)[0];s=u.createElement(b);s.src=d;s.async=1;s.defer=1;j.parentNode.insertBefore(s,j);
 *   })(document,window,'script','UMbed','https://example.com/path/to/umbed.js');
 *   UMbed({
 *     container_id: 'umbed_target',
 *     container_css: "width: 50%; height: 50%;",
 *     init: function () {
 *       // some code
 *     }
 *   });
 * </script>
 * 
 * MIT License
 * 
 * Copyright (c) 2018 Discovery Map International
 * Copyright (c) 2018 Morgan T. Aldridge
 * 
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 * 
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 * 
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 * 
 */

(function (root) {
  if ((root.UMbed === undefined) || ((typeof root.UMbed === 'function') && (root.UMbed.q !== undefined))) {
    /*
     * if the embed code injected a placeholder function to queue UMbed() calls, save any
     * queued UMbed calls for processing after creating the real function
     */
    var queued;
    if ((typeof root.UMbed === 'function') && (root.UMbed.q !== undefined) && Array.isArray(root.UMbed.q) && (root.UMbed.q.length > 0)) {
      queued = root.UMbed.q;
    }

    var Log = function (options) {
      var self = this;

      function _functionName(fn) {
        if ((fn === undefined) || (fn === null)) { return; }
        if (fn.name) {
          return fn.name;
        } else {
          var result = /^function\s+([\w\$]+)\s*\(/.exec(fn.toString());
          return result ? result[1] : 'anonymous';
        }
      }

      function _logLevelToInt(name) {
        switch (name) {
          case 'debug':
            return 0;
          case 'info':
            return 1;
          case 'warn':
            return 2;
          case 'error':
            return 3;
          case 'none':
            return 4;
          default:
            return undefined;
        }
      }

      function _logLevelToString(name) {
        switch (name) {
          case 'debug':
            return 'DEBUG';
          case 'info':
            return 'INFO';
          case 'warn':
            return 'WARNING';
          case 'error':
            return 'ERROR';
          default:
            return '';
        }
      }

      self.init = function (options) {
        // Log levels: 'debug', 'info', 'warn', 'error', 'none'
        options = extend({
          log_level: "warn",
          log_context: ""
        }, options);
        self._level = options.log_level;
        self._context = options.log_context;
      };

      self.fn = function () {
        try {
          return _functionName(arguments.callee.caller);
        } catch(e) {
          var s = new Error().stack.split('\n');
          var m = /(^[^@]+)@/.exec(s[1]);
          return ((s.length > 1) && m && (m.length > 1)) ? m[1] : '';
        }
      };

      self.log = function (level, message, fn) {
        if ((level === undefined) || (_logLevelToInt(self._level) > _logLevelToInt(level))) { return; }
        var out = (self._context ? (self._context + ' ') : '') + _logLevelToString(level) + (fn ? (' in ' + fn + '()') : '') + ': ' + message;
        if (console[level] && (typeof console[level] === 'function')) {
          console[level](out);
        } else {
          console.log(out);
        }
      };

      self.debug = function (message, fn) {
        self.log('debug', message, fn);
      };

      self.info = function (message, fn) {
        self.log('info', message, fn);
      };

      self.warn = function (message, fn) {
        self.log('warn', message, fn);
      };

      self.error = function (message, fn) {
        self.log('error', message, fn);
      };

      self.startTimer = function (label) {
        if (self._level == 'debug' && console.time && (typeof console.time === 'function')) {
          console.time(label);
        }
      };

      self.stopTimer = function (label) {
        if (self._level == 'debug' && console.timeEnd && (typeof console.timeEnd === 'function')) {
          console.timeEnd(label);
        }
      };

      self.init(options);

      return self;
    };

    root.UMbed = function (options) {
      var self = this;

      // Logging
      if ((typeof options === 'object') && !options.log_context) {
        options.log_context = "UMbed";
      }
      var _log = new Log(options);

      _log.startTimer(options.log_context);

      /* Dependencies Format:
       * 'mod' - UMD (AMD/CommonJS) module name for this requirement (optional)
       * 'obj' - Global JavaScript variable expected to be instantiated by this requirement, showing that it is loaded & ready (optional)
       * 'js'  - Array of JavaScript files that comprise this requirement and should be loaded (optional; if no 'mod' attribute is specified, will always load as normal JS script)
       * 'css' - Array of CSS files for this requirement and should be loaded (optional)
       */
      var _dependencies = [];
      if ((typeof options === 'object') && options.dependencies) {
        _pushDependencies(options.dependencies);
      }

      // AMD (RequireJS, et al)
      if ((typeof define === 'function') && define.amd) {
        _includeDependencies(true).then(function () {
          require(_amdDependencies(), function () {
            _amdSetGlobals(arguments);
            _inject(options);
          });
        });
      // CommonJS-like (Node, et al)
      } else if ((typeof module === 'object') && module.exports) {
        _includeDependencies(true).then(function () {
          _requireDependencies();
          _inject(options);
        });
      // Browser globals
      } else {
        _includeDependencies().then(function () {
          _inject(options);
        });
      }

      function _inject(options) {
        var fn = _log.fn();
        _log.startTimer(fn);

        // default options
        options = extend({
          container_id: undefined,
          container_css: undefined
        }, options);

        // container_id is required
        if (!options.container_id) {
          _log.error("'requires a valid container_id! Unable to proceed.", fn);
          _log.stopTimer(fn);
          return;
        }

        // look for our target element
        var embed = root.document.getElementById(options.container_id);
        if ((embed === undefined) || (embed === null)) {
          _log.error("couldn't find element to attach to! Unable to proceed.", fn);
          _log.stopTimer(fn);
          return;
        }

        // apply container_css to target element, if provided
        if (options.container_css !== undefined) {
          if (typeof options.container_css === 'object') {
            for (var property in options.container_css) {
              embed.style[property] = options.container_css[property];
            }
          } else if (typeof options.container_css === 'string') {
            embed.style = options.container_css;
          } else {
            _log.error("invalid container_css value!", fn);
          }
        }

        // ensure all required variables are available
        if (!_dependencies.every(function (d) {
          if ((d.obj !== undefined) && (_nestedProperty(root, d.obj) === undefined)) {
              _log.error("couldn't find required variable 'window." + d.obj + "'!", fn);
              return false;
            } else {
              return true;
            }
          })) {
          _log.error("can't find one or more required objects! Cannot proceed.", fn);
          _log.stopTimer(fn);
          return;
        }

        // run any provided initialization callback
        if (typeof options.init === 'function') {
          _log.info("calling init() callback...", fn);
          options.init();
        }

        _log.stopTimer(fn);
      }

      // Loader Helper Functions

      function _pushDependencies(dependencies) {
        if ((dependencies === undefined) || !Array.isArray(dependencies)) {
          return;
        }
        dependencies.forEach(function (d) {
          if ((typeof d !== 'object') || (Object.keys(['js', 'css']) < 1)) {
            _log.warn("couldn't add a dependency as it had neither 'js' or 'css' key!", _log.fn());
            return;
          }
          _dependencies.push(d);
        });
      }

      function _includeDependencies(noJSModules) {
        var fn = _log.fn();
        _log.startTimer(fn);

        noJSModules = (typeof noJSModules === undefined) ? false : noJSModules;
        var includes = root.document.createDocumentFragment();
        var promises = [];

        _dependencies.forEach(function (d) {
          // include dependency's CSS file(s), unless already included
          if ((d.css !== undefined) && Array.isArray(d.css)) {
            d.css.forEach(function (url) {
              var versionedURL = _versionedURL(url, d.vers);
              if (_includesCSS(versionedURL)) {
                _log.warn("CSS file '" + versionedURL + "' is already included! Will not include it for this dependency.", fn);
              } else {
                _log.info("Inserting CSS file '" + versionedURL + "' LINK element.", fn);
                promises.push(_includeCSS(versionedURL, includes));
              }
            });
          }

          // include dependency's JS file(s), unless global already exists or JS file is already included
          // does the global variable already exist?
          if ((d.obj !== undefined) && (_nestedProperty(root, d.obj) !== undefined)) {
            _log.warn("global variable '" + d.obj + "' already exists! Will not include JS for this dependency.", fn);
          } else if ((d.js !== undefined) && Array.isArray(d.js)) {
            d.js.forEach(function (url) {
              var versionedURL = _versionedURL(url, d.vers);
              if (_includesJS(versionedURL)) {
                _log.warn("JS file '" + versionedURL + "' is already included! Will not include it for this dependency.", fn);
              } else if ((d.mod !== undefined) && noJSModules) {
                _log.info("JS file '" + versionedURL + "' is specified to be loaded as a module as opposed to a SCRIPT element. Skipping SCRIPT element creation.", fn);
              } else {
                _log.info("inserting JS file '" + versionedURL + "' SCRIPT element.", fn);
                promises.push(_includeJS(versionedURL, includes));
              }
            });
          }
        });

        // inject all dependencies' elements into HEAD at once, because performance/efficiency
        var result;
        if (includes.children.length > 0) {
          _log.info("inserting " + includes.children.length + " element(s) into document HEAD.", fn);
          root.document.getElementsByTagName('head')[0].appendChild(includes);
          result = Promise.all(promises).then(function() {
            _log.info("all injected CSS/JS files loaded successfully.", fn);
            _log.stopTimer(fn);
          }, function (err) {
            _log.error("one or more injected CSS/JS files failed to load!", fn);
            _log.stopTimer(fn);
          });
        } else {
          _log.warn("did not insert any elements into document HEAD.", fn);
          result = Promise.resolve();
          _log.stopTimer(fn);
        }

        return result;
      }

      function _amdDependencies() {
        var fn = _log.fn();
        _log.startTimer(fn);

        var deps = [];
        var config = {paths: {}};
        var shims = {};
        _dependencies.forEach(function (d) {
          if ((d.mod !== undefined) && (d.js !== undefined) && Array.isArray(d.js)) {
            _log.info("preparing dependency for '" + d.mod + "' module...", fn);
            deps.push(d.mod);
            config.paths[d.mod] = [];
            d.js.forEach(function (url) {
              var path = _pathForURL(_versionedURL(url, d.vers), 'js');
              _log.info("adding '" + d.mod + "' module config path: '" + path + "'", fn);
              config.paths[d.mod].push(path);
            });
            if ((d.shim !== undefined) && (d.shim == true) && (d.obj !== undefined)) {
              shims[d.mod] = {};
              shims[d.mod].exports = d.obj;
            }
          }
        });
        if (Object.keys(shims).length > 0) {
          config.shim = shims;
        }
        require.config(config);

        _log.stopTimer(fn);
        return deps;
      }

      function _amdSetGlobals(args) {
        var fn = _log.fn();
        _log.startTimer(fn);

        var i = 0;
        _dependencies.forEach(function (d) {
          if ((d.mod !== undefined) && (d.js !== undefined) && Array.isArray(d.js) && (d.obj !== undefined) && (i < args.length)) {
            _log.info("setting global variable '" + d.obj + "' for '" + d.mod + "' module...", fn);
            root[d.obj] = args[i];
            i++;
          }
        });

        _log.stopTimer(fn);
      }

      function _requireDependencies() {
        var fn = _log.fn();
        _log.startTimer(fn);

        _dependencies.forEach(function (d) {
          if ((d.mod !== undefined) && (d.js !== undefined) && Array.isArray(d.js)) {
            d.js.forEach(function (path) {
              if (d.obj !== undefined) {
                root[d.obj] = require(_versionedURL(path, d.vers));
              } else {
                require(_versionedURL(path, d.vers));
              }
            });
          }
        });

        _log.stopTimer(fn);
      }

      function _includeCSS(path, parent) {
        var fn = _log.fn();
        _log.startTimer(fn + "-" + path);

        var link = root.document.createElement('link');
        link.rel = "stylesheet";
        link.media = "screen";
        link.href = path;
        parent.appendChild(link);

        return new Promise(function (resolve, reject) {
          link.onload = function () {
            _log.info("browser has completed loading injected CSS file '" + path + "'.", fn);
            _log.stopTimer(fn + "-" + path);
            resolve();
          };
        });
      }

      function _includeJS(path, parent) {
        var fn = _log.fn();
        _log.startTimer(fn + "-" + path);

        var script = root.document.createElement('script');
        script.src = path;
        script.async = 1;
        script.defer = 1;
        parent.appendChild(script);

        return new Promise(function (resolve, reject) {
          script.onload = function () {
            _log.info("browser has completed loading injected JS file '" + path + "'.", fn);
            _log.stopTimer(fn + "-" + path);
            resolve();
          };
        });
      }

      function _includesCSS(url) {
        return Array.from(root.document.getElementsByTagName('link')).some(function (e) {
          return _urlEndsWith(e.href, _filenameForURL(url, 'css'));
        });
      }

      function _includesJS(url) {
        return Array.from(root.document.getElementsByTagName('script')).some(function (e) {
          return _urlEndsWith(e.src, _filenameForURL(url, 'js'));
        });
      }

      function _versionedURL(url, version) {
        return url.replace(/{vers}/g, version);
      }

      function _filenameForURL(url, ext) {
        if (url === undefined) { return null; }
        var matches = url.match(new RegExp('\/([^\/]*\.' + ext + ')$', 'i'));
        return (matches !== null) ? matches[1] : null;
      }

      function _pathForURL(url, ext) {
        if (url === undefined) { return null; }
        return url.replace(new RegExp('\.' + ext + '$'), '');
      }

      function _urlEndsWith(url, filename) {
        if ((url === undefined) || (url === null) || (url === '') || (filename === undefined ) || (filename === null) || (filename === '')) {
          return false;
        }
        return (new RegExp(filename.replace(/\./g, '\.') + '$')).test(url);
      }

      function _nestedProperty(obj, prop) {
        if (obj === undefined) { return; }
        var pos = prop.indexOf('.');
        return (pos < 0) ? obj[prop] : _nestedProperty(obj[prop.substring(0, pos)], prop.substring(pos + 1));
      }

      _log.stopTimer(options.log_context);
    };

    // Execute any queued calls to UMbed().
    if ((queued !== undefined) && Array.isArray(queued)) {
      while (queued.length > 0) {
        UMbed.apply(null, queued.pop());
      }
    }
  }

  // Misc Helper Functions

  /*! extend.js | (c) 2017 Chris Ferdinandi, (c) 2018 Morgan Aldridge | MIT License | http://github.com/morgant/extend */
  /**
   * Merge two or more objects together into the first object. Same method signature as jQuery.extend().
   * @param {Boolean}  deep     If true, do a deep (or recursive) merge [optional]
   * @param {Object}   target   The target object to be merged into & modified
   * @param {Object}   objects  The object(s) to merge into the target object
   * @returns {Object}          Target object with merged values from object(s)
   */
  function extend() {
    var target;
    var deep = false;
    var i = 0;
    var length = arguments.length;

    // Check if a deep merge
    if ( Object.prototype.toString.call( arguments[0] ) === '[object Boolean]' ) {
      deep = arguments[0];
      i++;
    }

    // Get the target object
    if ( ( length - i >= 1 ) && ( Object.prototype.toString.call( arguments[i] ) === '[object Object]' ) ) {
      target = arguments[i];
      i++;
    }

    // Merge the object into the extended object
    var merge = function ( obj ) {
      for ( var prop in obj ) {
        if ( Object.prototype.hasOwnProperty.call( obj, prop ) ) {
          // If deep merge and property is an object, merge properties
          if ( deep && Object.prototype.toString.call(obj[prop]) === '[object Object]' ) {
            target[prop] = extend( true, target[prop], obj[prop] );
          } else {
            target[prop] = obj[prop];
          }
        }
      }
    };

    // Loop through each object and conduct a merge
    for ( ; i < length; i++ ) {
      var obj = arguments[i];
      merge(obj);
    }

    return target;
  }
})(typeof self !== 'undefined' ? self : this);
