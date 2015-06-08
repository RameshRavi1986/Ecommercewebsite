/*
 * Foundation Responsive Library
 * http://foundation.zurb.com
 * Copyright 2014, ZURB
 * Free to use under the MIT license.
 * http://www.opensource.org/licenses/mit-license.php
*/

(function ($, window, document, undefined) {
  'use strict';

  var header_helpers = function (class_array) {
    var i = class_array.length;
    var head = $('head');

    while (i--) {
      if (head.has('.' + class_array[i]).length === 0) {
        head.append('<meta class="' + class_array[i] + '" />');
      }
    }
  };

  header_helpers([
    'foundation-mq-small',
    'foundation-mq-small-only',
    'foundation-mq-medium',
    'foundation-mq-medium-only',
    'foundation-mq-large',
    'foundation-mq-large-only',
    'foundation-mq-xlarge',
    'foundation-mq-xlarge-only',
    'foundation-mq-xxlarge',
    'foundation-data-attribute-namespace']);

  // Enable FastClick if present

  $(function () {
    if (typeof FastClick !== 'undefined') {
      // Don't attach to body if undefined
      if (typeof document.body !== 'undefined') {
        FastClick.attach(document.body);
      }
    }
  });

  // private Fast Selector wrapper,
  // returns jQuery object. Only use where
  // getElementById is not available.
  var S = function (selector, context) {
    if (typeof selector === 'string') {
      if (context) {
        var cont;
        if (context.jquery) {
          cont = context[0];
          if (!cont) {
            return context;
          }
        } else {
          cont = context;
        }
        return $(cont.querySelectorAll(selector));
      }

      return $(document.querySelectorAll(selector));
    }

    return $(selector, context);
  };

  // Namespace functions.

  var attr_name = function (init) {
    var arr = [];
    if (!init) {
      arr.push('data');
    }
    if (this.namespace.length > 0) {
      arr.push(this.namespace);
    }
    arr.push(this.name);

    return arr.join('-');
  };

  var add_namespace = function (str) {
    var parts = str.split('-'),
        i = parts.length,
        arr = [];

    while (i--) {
      if (i !== 0) {
        arr.push(parts[i]);
      } else {
        if (this.namespace.length > 0) {
          arr.push(this.namespace, parts[i]);
        } else {
          arr.push(parts[i]);
        }
      }
    }

    return arr.reverse().join('-');
  };

  // Event binding and data-options updating.

  var bindings = function (method, options) {
    var self = this,
        bind = function(){
          var $this = S(this),
              should_bind_events = !$this.data(self.attr_name(true) + '-init');
          $this.data(self.attr_name(true) + '-init', $.extend({}, self.settings, (options || method), self.data_options($this)));

          if (should_bind_events) {
            self.events(this);
          }
        };

    if (S(this.scope).is('[' + this.attr_name() +']')) {
      bind.call(this.scope);
    } else {
      S('[' + this.attr_name() +']', this.scope).each(bind);
    }
    // # Patch to fix #5043 to move this *after* the if/else clause in order for Backbone and similar frameworks to have improved control over event binding and data-options updating.
    if (typeof method === 'string') {
      return this[method].call(this, options);
    }

  };

  var single_image_loaded = function (image, callback) {
    function loaded () {
      callback(image[0]);
    }

    function bindLoad () {
      this.one('load', loaded);

      if (/MSIE (\d+\.\d+);/.test(navigator.userAgent)) {
        var src = this.attr( 'src' ),
            param = src.match( /\?/ ) ? '&' : '?';

        param += 'random=' + (new Date()).getTime();
        this.attr('src', src + param);
      }
    }

    if (!image.attr('src')) {
      loaded();
      return;
    }

    if (image[0].complete || image[0].readyState === 4) {
      loaded();
    } else {
      bindLoad.call(image);
    }
  };

  /*! matchMedia() polyfill - Test a CSS media type/query in JS. Authors & copyright (c) 2012: Scott Jehl, Paul Irish, Nicholas Zakas, David Knight. Dual MIT/BSD license */

  window.matchMedia || (window.matchMedia = function() {
      "use strict";

      // For browsers that support matchMedium api such as IE 9 and webkit
      var styleMedia = (window.styleMedia || window.media);

      // For those that don't support matchMedium
      if (!styleMedia) {
          var style       = document.createElement('style'),
              script      = document.getElementsByTagName('script')[0],
              info        = null;

          style.type  = 'text/css';
          style.id    = 'matchmediajs-test';

          script.parentNode.insertBefore(style, script);

          // 'style.currentStyle' is used by IE <= 8 and 'window.getComputedStyle' for all other browsers
          info = ('getComputedStyle' in window) && window.getComputedStyle(style, null) || style.currentStyle;

          styleMedia = {
              matchMedium: function(media) {
                  var text = '@media ' + media + '{ #matchmediajs-test { width: 1px; } }';

                  // 'style.styleSheet' is used by IE <= 8 and 'style.textContent' for all other browsers
                  if (style.styleSheet) {
                      style.styleSheet.cssText = text;
                  } else {
                      style.textContent = text;
                  }

                  // Test if media query is true or false
                  return info.width === '1px';
              }
          };
      }

      return function(media) {
          return {
              matches: styleMedia.matchMedium(media || 'all'),
              media: media || 'all'
          };
      };
  }());

  /*
   * jquery.requestAnimationFrame
   * https://github.com/gnarf37/jquery-requestAnimationFrame
   * Requires jQuery 1.8+
   *
   * Copyright (c) 2012 Corey Frang
   * Licensed under the MIT license.
   */

  (function(jQuery) {


  // requestAnimationFrame polyfill adapted from Erik Möller
  // fixes from Paul Irish and Tino Zijdel
  // http://paulirish.com/2011/requestanimationframe-for-smart-animating/
  // http://my.opera.com/emoller/blog/2011/12/20/requestanimationframe-for-smart-er-animating

  var animating,
      lastTime = 0,
      vendors = ['webkit', 'moz'],
      requestAnimationFrame = window.requestAnimationFrame,
      cancelAnimationFrame = window.cancelAnimationFrame,
      jqueryFxAvailable = 'undefined' !== typeof jQuery.fx;

  for (; lastTime < vendors.length && !requestAnimationFrame; lastTime++) {
    requestAnimationFrame = window[ vendors[lastTime] + 'RequestAnimationFrame' ];
    cancelAnimationFrame = cancelAnimationFrame ||
      window[ vendors[lastTime] + 'CancelAnimationFrame' ] ||
      window[ vendors[lastTime] + 'CancelRequestAnimationFrame' ];
  }

  function raf() {
    if (animating) {
      requestAnimationFrame(raf);

      if (jqueryFxAvailable) {
        jQuery.fx.tick();
      }
    }
  }

  if (requestAnimationFrame) {
    // use rAF
    window.requestAnimationFrame = requestAnimationFrame;
    window.cancelAnimationFrame = cancelAnimationFrame;

    if (jqueryFxAvailable) {
      jQuery.fx.timer = function (timer) {
        if (timer() && jQuery.timers.push(timer) && !animating) {
          animating = true;
          raf();
        }
      };

      jQuery.fx.stop = function () {
        animating = false;
      };
    }
  } else {
    // polyfill
    window.requestAnimationFrame = function (callback) {
      var currTime = new Date().getTime(),
        timeToCall = Math.max(0, 16 - (currTime - lastTime)),
        id = window.setTimeout(function () {
          callback(currTime + timeToCall);
        }, timeToCall);
      lastTime = currTime + timeToCall;
      return id;
    };

    window.cancelAnimationFrame = function (id) {
      clearTimeout(id);
    };

  }

  }( $ ));

  function removeQuotes (string) {
    if (typeof string === 'string' || string instanceof String) {
      string = string.replace(/^['\\/"]+|(;\s?})+|['\\/"]+$/g, '');
    }

    return string;
  }

  window.Foundation = {
    name : 'Foundation',

    version : '5.5.2',

    media_queries : {
      'small'       : S('.foundation-mq-small').css('font-family').replace(/^[\/\\'"]+|(;\s?})+|[\/\\'"]+$/g, ''),
      'small-only'  : S('.foundation-mq-small-only').css('font-family').replace(/^[\/\\'"]+|(;\s?})+|[\/\\'"]+$/g, ''),
      'medium'      : S('.foundation-mq-medium').css('font-family').replace(/^[\/\\'"]+|(;\s?})+|[\/\\'"]+$/g, ''),
      'medium-only' : S('.foundation-mq-medium-only').css('font-family').replace(/^[\/\\'"]+|(;\s?})+|[\/\\'"]+$/g, ''),
      'large'       : S('.foundation-mq-large').css('font-family').replace(/^[\/\\'"]+|(;\s?})+|[\/\\'"]+$/g, ''),
      'large-only'  : S('.foundation-mq-large-only').css('font-family').replace(/^[\/\\'"]+|(;\s?})+|[\/\\'"]+$/g, ''),
      'xlarge'      : S('.foundation-mq-xlarge').css('font-family').replace(/^[\/\\'"]+|(;\s?})+|[\/\\'"]+$/g, ''),
      'xlarge-only' : S('.foundation-mq-xlarge-only').css('font-family').replace(/^[\/\\'"]+|(;\s?})+|[\/\\'"]+$/g, ''),
      'xxlarge'     : S('.foundation-mq-xxlarge').css('font-family').replace(/^[\/\\'"]+|(;\s?})+|[\/\\'"]+$/g, '')
    },

    stylesheet : $('<style></style>').appendTo('head')[0].sheet,

    global : {
      namespace : undefined
    },

    init : function (scope, libraries, method, options, response) {
      var args = [scope, method, options, response],
          responses = [];

      // check RTL
      this.rtl = /rtl/i.test(S('html').attr('dir'));

      // set foundation global scope
      this.scope = scope || this.scope;

      this.set_namespace();

      if (libraries && typeof libraries === 'string' && !/reflow/i.test(libraries)) {
        if (this.libs.hasOwnProperty(libraries)) {
          responses.push(this.init_lib(libraries, args));
        }
      } else {
        for (var lib in this.libs) {
          responses.push(this.init_lib(lib, libraries));
        }
      }

      S(window).load(function () {
        S(window)
          .trigger('resize.fndtn.clearing')
          .trigger('resize.fndtn.dropdown')
          .trigger('resize.fndtn.equalizer')
          .trigger('resize.fndtn.interchange')
          .trigger('resize.fndtn.joyride')
          .trigger('resize.fndtn.magellan')
          .trigger('resize.fndtn.topbar')
          .trigger('resize.fndtn.slider');
      });

      return scope;
    },

    init_lib : function (lib, args) {
      if (this.libs.hasOwnProperty(lib)) {
        this.patch(this.libs[lib]);

        if (args && args.hasOwnProperty(lib)) {
            if (typeof this.libs[lib].settings !== 'undefined') {
              $.extend(true, this.libs[lib].settings, args[lib]);
            } else if (typeof this.libs[lib].defaults !== 'undefined') {
              $.extend(true, this.libs[lib].defaults, args[lib]);
            }
          return this.libs[lib].init.apply(this.libs[lib], [this.scope, args[lib]]);
        }

        args = args instanceof Array ? args : new Array(args);
        return this.libs[lib].init.apply(this.libs[lib], args);
      }

      return function () {};
    },

    patch : function (lib) {
      lib.scope = this.scope;
      lib.namespace = this.global.namespace;
      lib.rtl = this.rtl;
      lib['data_options'] = this.utils.data_options;
      lib['attr_name'] = attr_name;
      lib['add_namespace'] = add_namespace;
      lib['bindings'] = bindings;
      lib['S'] = this.utils.S;
    },

    inherit : function (scope, methods) {
      var methods_arr = methods.split(' '),
          i = methods_arr.length;

      while (i--) {
        if (this.utils.hasOwnProperty(methods_arr[i])) {
          scope[methods_arr[i]] = this.utils[methods_arr[i]];
        }
      }
    },

    set_namespace : function () {

      // Description:
      //    Don't bother reading the namespace out of the meta tag
      //    if the namespace has been set globally in javascript
      //
      // Example:
      //    Foundation.global.namespace = 'my-namespace';
      // or make it an empty string:
      //    Foundation.global.namespace = '';
      //
      //

      // If the namespace has not been set (is undefined), try to read it out of the meta element.
      // Otherwise use the globally defined namespace, even if it's empty ('')
      var namespace = ( this.global.namespace === undefined ) ? $('.foundation-data-attribute-namespace').css('font-family') : this.global.namespace;

      // Finally, if the namsepace is either undefined or false, set it to an empty string.
      // Otherwise use the namespace value.
      this.global.namespace = ( namespace === undefined || /false/i.test(namespace) ) ? '' : namespace;
    },

    libs : {},

    // methods that can be inherited in libraries
    utils : {

      // Description:
      //    Fast Selector wrapper returns jQuery object. Only use where getElementById
      //    is not available.
      //
      // Arguments:
      //    Selector (String): CSS selector describing the element(s) to be
      //    returned as a jQuery object.
      //
      //    Scope (String): CSS selector describing the area to be searched. Default
      //    is document.
      //
      // Returns:
      //    Element (jQuery Object): jQuery object containing elements matching the
      //    selector within the scope.
      S : S,

      // Description:
      //    Executes a function a max of once every n milliseconds
      //
      // Arguments:
      //    Func (Function): Function to be throttled.
      //
      //    Delay (Integer): Function execution threshold in milliseconds.
      //
      // Returns:
      //    Lazy_function (Function): Function with throttling applied.
      throttle : function (func, delay) {
        var timer = null;

        return function () {
          var context = this, args = arguments;

          if (timer == null) {
            timer = setTimeout(function () {
              func.apply(context, args);
              timer = null;
            }, delay);
          }
        };
      },

      // Description:
      //    Executes a function when it stops being invoked for n seconds
      //    Modified version of _.debounce() http://underscorejs.org
      //
      // Arguments:
      //    Func (Function): Function to be debounced.
      //
      //    Delay (Integer): Function execution threshold in milliseconds.
      //
      //    Immediate (Bool): Whether the function should be called at the beginning
      //    of the delay instead of the end. Default is false.
      //
      // Returns:
      //    Lazy_function (Function): Function with debouncing applied.
      debounce : function (func, delay, immediate) {
        var timeout, result;
        return function () {
          var context = this, args = arguments;
          var later = function () {
            timeout = null;
            if (!immediate) {
              result = func.apply(context, args);
            }
          };
          var callNow = immediate && !timeout;
          clearTimeout(timeout);
          timeout = setTimeout(later, delay);
          if (callNow) {
            result = func.apply(context, args);
          }
          return result;
        };
      },

      // Description:
      //    Parses data-options attribute
      //
      // Arguments:
      //    El (jQuery Object): Element to be parsed.
      //
      // Returns:
      //    Options (Javascript Object): Contents of the element's data-options
      //    attribute.
      data_options : function (el, data_attr_name) {
        data_attr_name = data_attr_name || 'options';
        var opts = {}, ii, p, opts_arr,
            data_options = function (el) {
              var namespace = Foundation.global.namespace;

              if (namespace.length > 0) {
                return el.data(namespace + '-' + data_attr_name);
              }

              return el.data(data_attr_name);
            };

        var cached_options = data_options(el);

        if (typeof cached_options === 'object') {
          return cached_options;
        }

        opts_arr = (cached_options || ':').split(';');
        ii = opts_arr.length;

        function isNumber (o) {
          return !isNaN (o - 0) && o !== null && o !== '' && o !== false && o !== true;
        }

        function trim (str) {
          if (typeof str === 'string') {
            return $.trim(str);
          }
          return str;
        }

        while (ii--) {
          p = opts_arr[ii].split(':');
          p = [p[0], p.slice(1).join(':')];

          if (/true/i.test(p[1])) {
            p[1] = true;
          }
          if (/false/i.test(p[1])) {
            p[1] = false;
          }
          if (isNumber(p[1])) {
            if (p[1].indexOf('.') === -1) {
              p[1] = parseInt(p[1], 10);
            } else {
              p[1] = parseFloat(p[1]);
            }
          }

          if (p.length === 2 && p[0].length > 0) {
            opts[trim(p[0])] = trim(p[1]);
          }
        }

        return opts;
      },

      // Description:
      //    Adds JS-recognizable media queries
      //
      // Arguments:
      //    Media (String): Key string for the media query to be stored as in
      //    Foundation.media_queries
      //
      //    Class (String): Class name for the generated <meta> tag
      register_media : function (media, media_class) {
        if (Foundation.media_queries[media] === undefined) {
          $('head').append('<meta class="' + media_class + '"/>');
          Foundation.media_queries[media] = removeQuotes($('.' + media_class).css('font-family'));
        }
      },

      // Description:
      //    Add custom CSS within a JS-defined media query
      //
      // Arguments:
      //    Rule (String): CSS rule to be appended to the document.
      //
      //    Media (String): Optional media query string for the CSS rule to be
      //    nested under.
      add_custom_rule : function (rule, media) {
        if (media === undefined && Foundation.stylesheet) {
          Foundation.stylesheet.insertRule(rule, Foundation.stylesheet.cssRules.length);
        } else {
          var query = Foundation.media_queries[media];

          if (query !== undefined) {
            Foundation.stylesheet.insertRule('@media ' +
              Foundation.media_queries[media] + '{ ' + rule + ' }', Foundation.stylesheet.cssRules.length);
          }
        }
      },

      // Description:
      //    Performs a callback function when an image is fully loaded
      //
      // Arguments:
      //    Image (jQuery Object): Image(s) to check if loaded.
      //
      //    Callback (Function): Function to execute when image is fully loaded.
      image_loaded : function (images, callback) {
        var self = this,
            unloaded = images.length;

        function pictures_has_height(images) {
          var pictures_number = images.length;

          for (var i = pictures_number - 1; i >= 0; i--) {
            if(images.attr('height') === undefined) {
              return false;
            };
          };

          return true;
        }

        if (unloaded === 0 || pictures_has_height(images)) {
          callback(images);
        }

        images.each(function () {
          single_image_loaded(self.S(this), function () {
            unloaded -= 1;
            if (unloaded === 0) {
              callback(images);
            }
          });
        });
      },

      // Description:
      //    Returns a random, alphanumeric string
      //
      // Arguments:
      //    Length (Integer): Length of string to be generated. Defaults to random
      //    integer.
      //
      // Returns:
      //    Rand (String): Pseudo-random, alphanumeric string.
      random_str : function () {
        if (!this.fidx) {
          this.fidx = 0;
        }
        this.prefix = this.prefix || [(this.name || 'F'), (+new Date).toString(36)].join('-');

        return this.prefix + (this.fidx++).toString(36);
      },

      // Description:
      //    Helper for window.matchMedia
      //
      // Arguments:
      //    mq (String): Media query
      //
      // Returns:
      //    (Boolean): Whether the media query passes or not
      match : function (mq) {
        return window.matchMedia(mq).matches;
      },

      // Description:
      //    Helpers for checking Foundation default media queries with JS
      //
      // Returns:
      //    (Boolean): Whether the media query passes or not

      is_small_up : function () {
        return this.match(Foundation.media_queries.small);
      },

      is_medium_up : function () {
        return this.match(Foundation.media_queries.medium);
      },

      is_large_up : function () {
        return this.match(Foundation.media_queries.large);
      },

      is_xlarge_up : function () {
        return this.match(Foundation.media_queries.xlarge);
      },

      is_xxlarge_up : function () {
        return this.match(Foundation.media_queries.xxlarge);
      },

      is_small_only : function () {
        return !this.is_medium_up() && !this.is_large_up() && !this.is_xlarge_up() && !this.is_xxlarge_up();
      },

      is_medium_only : function () {
        return this.is_medium_up() && !this.is_large_up() && !this.is_xlarge_up() && !this.is_xxlarge_up();
      },

      is_large_only : function () {
        return this.is_medium_up() && this.is_large_up() && !this.is_xlarge_up() && !this.is_xxlarge_up();
      },

      is_xlarge_only : function () {
        return this.is_medium_up() && this.is_large_up() && this.is_xlarge_up() && !this.is_xxlarge_up();
      },

      is_xxlarge_only : function () {
        return this.is_medium_up() && this.is_large_up() && this.is_xlarge_up() && this.is_xxlarge_up();
      }
    }
  };

  $.fn.foundation = function () {
    var args = Array.prototype.slice.call(arguments, 0);

    return this.each(function () {
      Foundation.init.apply(Foundation, [this].concat(args));
      return this;
    });
  };

}(jQuery, window, window.document));

;(function ($, window, document, undefined) {
  'use strict';

  Foundation.libs.abide = {
    name : 'abide',

    version : '5.5.2',

    settings : {
      live_validate : true,
      validate_on_blur : true,
      // validate_on: 'tab', // tab (when user tabs between fields), change (input changes), manual (call custom events) 
      focus_on_invalid : true,
      error_labels : true, // labels with a for="inputId" will recieve an `error` class
      error_class : 'error',
      timeout : 1000,
      patterns : {
        alpha : /^[a-zA-Z]+$/,
        alpha_numeric : /^[a-zA-Z0-9]+$/,
        integer : /^[-+]?\d+$/,
        number : /^[-+]?\d*(?:[\.\,]\d+)?$/,

        // amex, visa, diners
        card : /^(?:4[0-9]{12}(?:[0-9]{3})?|5[1-5][0-9]{14}|6(?:011|5[0-9][0-9])[0-9]{12}|3[47][0-9]{13}|3(?:0[0-5]|[68][0-9])[0-9]{11}|(?:2131|1800|35\d{3})\d{11})$/,
        cvv : /^([0-9]){3,4}$/,

        // http://www.whatwg.org/specs/web-apps/current-work/multipage/states-of-the-type-attribute.html#valid-e-mail-address
        email : /^[a-zA-Z0-9.!#$%&'*+\/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+$/,

        // http://blogs.lse.ac.uk/lti/2008/04/23/a-regular-expression-to-match-any-url/
        url: /^(https?|ftp|file|ssh):\/\/([-;:&=\+\$,\w]+@{1})?([-A-Za-z0-9\.]+)+:?(\d+)?((\/[-\+~%\/\.\w]+)?\??([-\+=&;%@\.\w]+)?#?([\w]+)?)?/,
        // abc.de
        domain : /^([a-zA-Z0-9]([a-zA-Z0-9\-]{0,61}[a-zA-Z0-9])?\.)+[a-zA-Z]{2,8}$/,

        datetime : /^([0-2][0-9]{3})\-([0-1][0-9])\-([0-3][0-9])T([0-5][0-9])\:([0-5][0-9])\:([0-5][0-9])(Z|([\-\+]([0-1][0-9])\:00))$/,
        // YYYY-MM-DD
        date : /(?:19|20)[0-9]{2}-(?:(?:0[1-9]|1[0-2])-(?:0[1-9]|1[0-9]|2[0-9])|(?:(?!02)(?:0[1-9]|1[0-2])-(?:30))|(?:(?:0[13578]|1[02])-31))$/,
        // HH:MM:SS
        time : /^(0[0-9]|1[0-9]|2[0-3])(:[0-5][0-9]){2}$/,
        dateISO : /^\d{4}[\/\-]\d{1,2}[\/\-]\d{1,2}$/,
        // MM/DD/YYYY
        month_day_year : /^(0[1-9]|1[012])[- \/.](0[1-9]|[12][0-9]|3[01])[- \/.]\d{4}$/,
        // DD/MM/YYYY
        day_month_year : /^(0[1-9]|[12][0-9]|3[01])[- \/.](0[1-9]|1[012])[- \/.]\d{4}$/,

        // #FFF or #FFFFFF
        color : /^#?([a-fA-F0-9]{6}|[a-fA-F0-9]{3})$/
      },
      validators : {
        equalTo : function (el, required, parent) {
          var from  = document.getElementById(el.getAttribute(this.add_namespace('data-equalto'))).value,
              to    = el.value,
              valid = (from === to);

          return valid;
        }
      }
    },

    timer : null,

    init : function (scope, method, options) {
      this.bindings(method, options);
    },

    events : function (scope) {
      var self = this,
          form = self.S(scope).attr('novalidate', 'novalidate'),
          settings = form.data(this.attr_name(true) + '-init') || {};

      this.invalid_attr = this.add_namespace('data-invalid');

      function validate(originalSelf, e) {
        clearTimeout(self.timer);
        self.timer = setTimeout(function () {
          self.validate([originalSelf], e);
        }.bind(originalSelf), settings.timeout);
      }


      form
        .off('.abide')
        .on('submit.fndtn.abide', function (e) {
          var is_ajax = /ajax/i.test(self.S(this).attr(self.attr_name()));
          return self.validate(self.S(this).find('input, textarea, select').not(":hidden, [data-abide-ignore]").get(), e, is_ajax);
        })
        .on('validate.fndtn.abide', function (e) {
          if (settings.validate_on === 'manual') {
            self.validate([e.target], e);
          }
        })
        .on('reset', function (e) {
          return self.reset($(this), e);          
        })
        .find('input, textarea, select').not(":hidden, [data-abide-ignore]")
          .off('.abide')
          .on('blur.fndtn.abide change.fndtn.abide', function (e) {
            // old settings fallback
            // will be deprecated with F6 release
            if (settings.validate_on_blur && settings.validate_on_blur === true) {
              validate(this, e);
            }
            // new settings combining validate options into one setting
            if (settings.validate_on === 'change') {
              validate(this, e);
            }
          })
          .on('keydown.fndtn.abide', function (e) {
            // old settings fallback
            // will be deprecated with F6 release
            if (settings.live_validate && settings.live_validate === true && e.which != 9) {
              validate(this, e);
            }
            // new settings combining validate options into one setting
            if (settings.validate_on === 'tab' && e.which === 9) {
              validate(this, e);
            }
            else if (settings.validate_on === 'change') {
              validate(this, e);
            }
          })
          .on('focus', function (e) {
            if (navigator.userAgent.match(/iPad|iPhone|Android|BlackBerry|Windows Phone|webOS/i)) {
              $('html, body').animate({
                  scrollTop: $(e.target).offset().top
              }, 100);
            } 
          });
    },

    reset : function (form, e) {
      var self = this;
      form.removeAttr(self.invalid_attr);

      $('[' + self.invalid_attr + ']', form).removeAttr(self.invalid_attr);
      $('.' + self.settings.error_class, form).not('small').removeClass(self.settings.error_class);
      $(':input', form).not(':button, :submit, :reset, :hidden, [data-abide-ignore]').val('').removeAttr(self.invalid_attr);
    },

    validate : function (els, e, is_ajax) {
      var validations = this.parse_patterns(els),
          validation_count = validations.length,
          form = this.S(els[0]).closest('form'),
          submit_event = /submit/.test(e.type);

      // Has to count up to make sure the focus gets applied to the top error
      for (var i = 0; i < validation_count; i++) {
        if (!validations[i] && (submit_event || is_ajax)) {
          if (this.settings.focus_on_invalid) {
            els[i].focus();
          }
          form.trigger('invalid.fndtn.abide');
          this.S(els[i]).closest('form').attr(this.invalid_attr, '');
          return false;
        }
      }

      if (submit_event || is_ajax) {
        form.trigger('valid.fndtn.abide');
      }

      form.removeAttr(this.invalid_attr);

      if (is_ajax) {
        return false;
      }

      return true;
    },

    parse_patterns : function (els) {
      var i = els.length,
          el_patterns = [];

      while (i--) {
        el_patterns.push(this.pattern(els[i]));
      }

      return this.check_validation_and_apply_styles(el_patterns);
    },

    pattern : function (el) {
      var type = el.getAttribute('type'),
          required = typeof el.getAttribute('required') === 'string';

      var pattern = el.getAttribute('pattern') || '';

      if (this.settings.patterns.hasOwnProperty(pattern) && pattern.length > 0) {
        return [el, this.settings.patterns[pattern], required];
      } else if (pattern.length > 0) {
        return [el, new RegExp(pattern), required];
      }

      if (this.settings.patterns.hasOwnProperty(type)) {
        return [el, this.settings.patterns[type], required];
      }

      pattern = /.*/;

      return [el, pattern, required];
    },

    // TODO: Break this up into smaller methods, getting hard to read.
    check_validation_and_apply_styles : function (el_patterns) {
      var i = el_patterns.length,
          validations = [],
          form = this.S(el_patterns[0][0]).closest('[data-' + this.attr_name(true) + ']'),
          settings = form.data(this.attr_name(true) + '-init') || {};
      while (i--) {
        var el = el_patterns[i][0],
            required = el_patterns[i][2],
            value = el.value.trim(),
            direct_parent = this.S(el).parent(),
            validator = el.getAttribute(this.add_namespace('data-abide-validator')),
            is_radio = el.type === 'radio',
            is_checkbox = el.type === 'checkbox',
            label = this.S('label[for="' + el.getAttribute('id') + '"]'),
            valid_length = (required) ? (el.value.length > 0) : true,
            el_validations = [];

        var parent, valid;

        // support old way to do equalTo validations
        if (el.getAttribute(this.add_namespace('data-equalto'))) { validator = 'equalTo' }

        if (!direct_parent.is('label')) {
          parent = direct_parent;
        } else {
          parent = direct_parent.parent();
        }

        if (is_radio && required) {
          el_validations.push(this.valid_radio(el, required));
        } else if (is_checkbox && required) {
          el_validations.push(this.valid_checkbox(el, required));

        } else if (validator) {
          // Validate using each of the specified (space-delimited) validators.
          var validators = validator.split(' ');
          var last_valid = true, all_valid = true;
          for (var iv = 0; iv < validators.length; iv++) {
              valid = this.settings.validators[validators[iv]].apply(this, [el, required, parent])
              el_validations.push(valid);
              all_valid = valid && last_valid;
              last_valid = valid;
          }
          if (all_valid) {
              this.S(el).removeAttr(this.invalid_attr);
              parent.removeClass('error');
              if (label.length > 0 && this.settings.error_labels) {
                label.removeClass(this.settings.error_class).removeAttr('role');
              }
              $(el).triggerHandler('valid');
          } else {
              this.S(el).attr(this.invalid_attr, '');
              parent.addClass('error');
              if (label.length > 0 && this.settings.error_labels) {
                label.addClass(this.settings.error_class).attr('role', 'alert');
              }
              $(el).triggerHandler('invalid');
          }
        } else {

          if (el_patterns[i][1].test(value) && valid_length ||
            !required && el.value.length < 1 || $(el).attr('disabled')) {
            el_validations.push(true);
          } else {
            el_validations.push(false);
          }

          el_validations = [el_validations.every(function (valid) {return valid;})];
          if (el_validations[0]) {
            this.S(el).removeAttr(this.invalid_attr);
            el.setAttribute('aria-invalid', 'false');
            el.removeAttribute('aria-describedby');
            parent.removeClass(this.settings.error_class);
            if (label.length > 0 && this.settings.error_labels) {
              label.removeClass(this.settings.error_class).removeAttr('role');
            }
            $(el).triggerHandler('valid');
          } else {
            this.S(el).attr(this.invalid_attr, '');
            el.setAttribute('aria-invalid', 'true');

            // Try to find the error associated with the input
            var errorElem = parent.find('small.' + this.settings.error_class, 'span.' + this.settings.error_class);
            var errorID = errorElem.length > 0 ? errorElem[0].id : '';
            if (errorID.length > 0) {
              el.setAttribute('aria-describedby', errorID);
            }

            // el.setAttribute('aria-describedby', $(el).find('.error')[0].id);
            parent.addClass(this.settings.error_class);
            if (label.length > 0 && this.settings.error_labels) {
              label.addClass(this.settings.error_class).attr('role', 'alert');
            }
            $(el).triggerHandler('invalid');
          }
        }
        validations = validations.concat(el_validations);
      }
      return validations;
    },

    valid_checkbox : function (el, required) {
      var el = this.S(el),
          valid = (el.is(':checked') || !required || el.get(0).getAttribute('disabled'));

      if (valid) {
        el.removeAttr(this.invalid_attr).parent().removeClass(this.settings.error_class);
        $(el).triggerHandler('valid');
      } else {
        el.attr(this.invalid_attr, '').parent().addClass(this.settings.error_class);
        $(el).triggerHandler('invalid');
      }

      return valid;
    },

    valid_radio : function (el, required) {
      var name = el.getAttribute('name'),
          group = this.S(el).closest('[data-' + this.attr_name(true) + ']').find("[name='" + name + "']"),
          count = group.length,
          valid = false,
          disabled = false;

      // Has to count up to make sure the focus gets applied to the top error
        for (var i=0; i < count; i++) {
            if( group[i].getAttribute('disabled') ){
                disabled=true;
                valid=true;
            } else {
                if (group[i].checked){
                    valid = true;
                } else {
                    if( disabled ){
                        valid = false;
                    }
                }
            }
        }

      // Has to count up to make sure the focus gets applied to the top error
      for (var i = 0; i < count; i++) {
        if (valid) {
          this.S(group[i]).removeAttr(this.invalid_attr).parent().removeClass(this.settings.error_class);
          $(group[i]).triggerHandler('valid');
        } else {
          this.S(group[i]).attr(this.invalid_attr, '').parent().addClass(this.settings.error_class);
          $(group[i]).triggerHandler('invalid');
        }
      }

      return valid;
    },

    valid_equal : function (el, required, parent) {
      var from  = document.getElementById(el.getAttribute(this.add_namespace('data-equalto'))).value,
          to    = el.value,
          valid = (from === to);

      if (valid) {
        this.S(el).removeAttr(this.invalid_attr);
        parent.removeClass(this.settings.error_class);
        if (label.length > 0 && settings.error_labels) {
          label.removeClass(this.settings.error_class);
        }
      } else {
        this.S(el).attr(this.invalid_attr, '');
        parent.addClass(this.settings.error_class);
        if (label.length > 0 && settings.error_labels) {
          label.addClass(this.settings.error_class);
        }
      }

      return valid;
    },

    valid_oneof : function (el, required, parent, doNotValidateOthers) {
      var el = this.S(el),
        others = this.S('[' + this.add_namespace('data-oneof') + ']'),
        valid = others.filter(':checked').length > 0;

      if (valid) {
        el.removeAttr(this.invalid_attr).parent().removeClass(this.settings.error_class);
      } else {
        el.attr(this.invalid_attr, '').parent().addClass(this.settings.error_class);
      }

      if (!doNotValidateOthers) {
        var _this = this;
        others.each(function () {
          _this.valid_oneof.call(_this, this, null, null, true);
        });
      }

      return valid;
    },

    reflow : function(scope, options) {
      var self = this,
          form = self.S('[' + this.attr_name() + ']').attr('novalidate', 'novalidate');
          self.S(form).each(function (idx, el) {
            self.events(el);
          });
    }
  };
}(jQuery, window, window.document));

;(function ($, window, document, undefined) {
  'use strict';

  Foundation.libs.accordion = {
    name : 'accordion',

    version : '5.5.2',

    settings : {
      content_class : 'content',
      active_class : 'active',
      multi_expand : false,
      toggleable : true,
      callback : function () {}
    },

    init : function (scope, method, options) {
      this.bindings(method, options);
    },

    events : function (instance) {
      var self = this;
      var S = this.S;
      self.create(this.S(instance));

      S(this.scope)
      .off('.fndtn.accordion')
      .on('click.fndtn.accordion', '[' + this.attr_name() + '] > dd > a, [' + this.attr_name() + '] > li > a', function (e) {
        var accordion = S(this).closest('[' + self.attr_name() + ']'),
            groupSelector = self.attr_name() + '=' + accordion.attr(self.attr_name()),
            settings = accordion.data(self.attr_name(true) + '-init') || self.settings,
            target = S('#' + this.href.split('#')[1]),
            aunts = $('> dd, > li', accordion),
            siblings = aunts.children('.' + settings.content_class),
            active_content = siblings.filter('.' + settings.active_class);

        e.preventDefault();

        if (accordion.attr(self.attr_name())) {
          siblings = siblings.add('[' + groupSelector + '] dd > ' + '.' + settings.content_class + ', [' + groupSelector + '] li > ' + '.' + settings.content_class);
          aunts = aunts.add('[' + groupSelector + '] dd, [' + groupSelector + '] li');
        }

        if (settings.toggleable && target.is(active_content)) {
          target.parent('dd, li').toggleClass(settings.active_class, false);
          target.toggleClass(settings.active_class, false);
          S(this).attr('aria-expanded', function(i, attr){
              return attr === 'true' ? 'false' : 'true';
          });
          settings.callback(target);
          target.triggerHandler('toggled', [accordion]);
          accordion.triggerHandler('toggled', [target]);
          return;
        }

        if (!settings.multi_expand) {
          siblings.removeClass(settings.active_class);
          aunts.removeClass(settings.active_class);
          aunts.children('a').attr('aria-expanded','false');
        }

        target.addClass(settings.active_class).parent().addClass(settings.active_class);
        settings.callback(target);
        target.triggerHandler('toggled', [accordion]);
        accordion.triggerHandler('toggled', [target]);
        S(this).attr('aria-expanded','true');
      });
    },

    create: function($instance) {
      var self = this,
          accordion = $instance,
          aunts = $('> .accordion-navigation', accordion),
          settings = accordion.data(self.attr_name(true) + '-init') || self.settings;

      aunts.children('a').attr('aria-expanded','false');
      aunts.has('.' + settings.content_class + '.' + settings.active_class).children('a').attr('aria-expanded','true');

      if (settings.multi_expand) {
        $instance.attr('aria-multiselectable','true');
      }
    },

    off : function () {},

    reflow : function () {}
  };
}(jQuery, window, window.document));

;(function ($, window, document, undefined) {
  'use strict';

  Foundation.libs.alert = {
    name : 'alert',

    version : '5.5.2',

    settings : {
      callback : function () {}
    },

    init : function (scope, method, options) {
      this.bindings(method, options);
    },

    events : function () {
      var self = this,
          S = this.S;

      $(this.scope).off('.alert').on('click.fndtn.alert', '[' + this.attr_name() + '] .close', function (e) {
        var alertBox = S(this).closest('[' + self.attr_name() + ']'),
            settings = alertBox.data(self.attr_name(true) + '-init') || self.settings;

        e.preventDefault();
        if (Modernizr.csstransitions) {
          alertBox.addClass('alert-close');
          alertBox.on('transitionend webkitTransitionEnd oTransitionEnd', function (e) {
            S(this).trigger('close.fndtn.alert').remove();
            settings.callback();
          });
        } else {
          alertBox.fadeOut(300, function () {
            S(this).trigger('close.fndtn.alert').remove();
            settings.callback();
          });
        }
      });
    },

    reflow : function () {}
  };
}(jQuery, window, window.document));

;(function ($, window, document, undefined) {
  'use strict';

  Foundation.libs.clearing = {
    name : 'clearing',

    version : '5.5.2',

    settings : {
      templates : {
        viewing : '<a href="#" class="clearing-close">&times;</a>' +
          '<div class="visible-img" style="display: none"><div class="clearing-touch-label"></div><img src="data:image/gif;base64,R0lGODlhAQABAAD/ACwAAAAAAQABAAACADs%3D" alt="" />' +
          '<p class="clearing-caption"></p><a href="#" class="clearing-main-prev"><span></span></a>' +
          '<a href="#" class="clearing-main-next"><span></span></a></div>' +
          '<img class="clearing-preload-next" style="display: none" src="data:image/gif;base64,R0lGODlhAQABAAD/ACwAAAAAAQABAAACADs%3D" alt="" />' +
          '<img class="clearing-preload-prev" style="display: none" src="data:image/gif;base64,R0lGODlhAQABAAD/ACwAAAAAAQABAAACADs%3D" alt="" />'
      },

      // comma delimited list of selectors that, on click, will close clearing,
      // add 'div.clearing-blackout, div.visible-img' to close on background click
      close_selectors : '.clearing-close, div.clearing-blackout',

      // Default to the entire li element.
      open_selectors : '',

      // Image will be skipped in carousel.
      skip_selector : '',

      touch_label : '',

      // event initializers and locks
      init : false,
      locked : false
    },

    init : function (scope, method, options) {
      var self = this;
      Foundation.inherit(this, 'throttle image_loaded');

      this.bindings(method, options);

      if (self.S(this.scope).is('[' + this.attr_name() + ']')) {
        this.assemble(self.S('li', this.scope));
      } else {
        self.S('[' + this.attr_name() + ']', this.scope).each(function () {
          self.assemble(self.S('li', this));
        });
      }
    },

    events : function (scope) {
      var self = this,
          S = self.S,
          $scroll_container = $('.scroll-container');

      if ($scroll_container.length > 0) {
        this.scope = $scroll_container;
      }

      S(this.scope)
        .off('.clearing')
        .on('click.fndtn.clearing', 'ul[' + this.attr_name() + '] li ' + this.settings.open_selectors,
          function (e, current, target) {
            var current = current || S(this),
                target = target || current,
                next = current.next('li'),
                settings = current.closest('[' + self.attr_name() + ']').data(self.attr_name(true) + '-init'),
                image = S(e.target);

            e.preventDefault();

            if (!settings) {
              self.init();
              settings = current.closest('[' + self.attr_name() + ']').data(self.attr_name(true) + '-init');
            }

            // if clearing is open and the current image is
            // clicked, go to the next image in sequence
            if (target.hasClass('visible') &&
              current[0] === target[0] &&
              next.length > 0 && self.is_open(current)) {
              target = next;
              image = S('img', target);
            }

            // set current and target to the clicked li if not otherwise defined.
            self.open(image, current, target);
            self.update_paddles(target);
          })

        .on('click.fndtn.clearing', '.clearing-main-next',
          function (e) { self.nav(e, 'next') })
        .on('click.fndtn.clearing', '.clearing-main-prev',
          function (e) { self.nav(e, 'prev') })
        .on('click.fndtn.clearing', this.settings.close_selectors,
          function (e) { Foundation.libs.clearing.close(e, this) });

      $(document).on('keydown.fndtn.clearing',
          function (e) { self.keydown(e) });

      S(window).off('.clearing').on('resize.fndtn.clearing',
        function () { self.resize() });

      this.swipe_events(scope);
    },

    swipe_events : function (scope) {
      var self = this,
      S = self.S;

      S(this.scope)
        .on('touchstart.fndtn.clearing', '.visible-img', function (e) {
          if (!e.touches) { e = e.originalEvent; }
          var data = {
                start_page_x : e.touches[0].pageX,
                start_page_y : e.touches[0].pageY,
                start_time : (new Date()).getTime(),
                delta_x : 0,
                is_scrolling : undefined
              };

          S(this).data('swipe-transition', data);
          e.stopPropagation();
        })
        .on('touchmove.fndtn.clearing', '.visible-img', function (e) {
          if (!e.touches) {
            e = e.originalEvent;
          }
          // Ignore pinch/zoom events
          if (e.touches.length > 1 || e.scale && e.scale !== 1) {
            return;
          }

          var data = S(this).data('swipe-transition');

          if (typeof data === 'undefined') {
            data = {};
          }

          data.delta_x = e.touches[0].pageX - data.start_page_x;

          if (Foundation.rtl) {
            data.delta_x = -data.delta_x;
          }

          if (typeof data.is_scrolling === 'undefined') {
            data.is_scrolling = !!( data.is_scrolling || Math.abs(data.delta_x) < Math.abs(e.touches[0].pageY - data.start_page_y) );
          }

          if (!data.is_scrolling && !data.active) {
            e.preventDefault();
            var direction = (data.delta_x < 0) ? 'next' : 'prev';
            data.active = true;
            self.nav(e, direction);
          }
        })
        .on('touchend.fndtn.clearing', '.visible-img', function (e) {
          S(this).data('swipe-transition', {});
          e.stopPropagation();
        });
    },

    assemble : function ($li) {
      var $el = $li.parent();

      if ($el.parent().hasClass('carousel')) {
        return;
      }

      $el.after('<div id="foundationClearingHolder"></div>');

      var grid = $el.detach(),
          grid_outerHTML = '';

      if (grid[0] == null) {
        return;
      } else {
        grid_outerHTML = grid[0].outerHTML;
      }

      var holder = this.S('#foundationClearingHolder'),
          settings = $el.data(this.attr_name(true) + '-init'),
          data = {
            grid : '<div class="carousel">' + grid_outerHTML + '</div>',
            viewing : settings.templates.viewing
          },
          wrapper = '<div class="clearing-assembled"><div>' + data.viewing +
            data.grid + '</div></div>',
          touch_label = this.settings.touch_label;

      if (Modernizr.touch) {
        wrapper = $(wrapper).find('.clearing-touch-label').html(touch_label).end();
      }

      holder.after(wrapper).remove();
    },

    open : function ($image, current, target) {
      var self = this,
          body = $(document.body),
          root = target.closest('.clearing-assembled'),
          container = self.S('div', root).first(),
          visible_image = self.S('.visible-img', container),
          image = self.S('img', visible_image).not($image),
          label = self.S('.clearing-touch-label', container),
          error = false,
          loaded = {};

      // Event to disable scrolling on touch devices when Clearing is activated
      $('body').on('touchmove', function (e) {
        e.preventDefault();
      });

      image.error(function () {
        error = true;
      });

      function startLoad() {
        setTimeout(function () {
          this.image_loaded(image, function () {
            if (image.outerWidth() === 1 && !error) {
              startLoad.call(this);
            } else {
              cb.call(this, image);
            }
          }.bind(this));
        }.bind(this), 100);
      }

      function cb (image) {
        var $image = $(image);
        $image.css('visibility', 'visible');
        $image.trigger('imageVisible');
        // toggle the gallery
        body.css('overflow', 'hidden');
        root.addClass('clearing-blackout');
        container.addClass('clearing-container');
        visible_image.show();
        this.fix_height(target)
          .caption(self.S('.clearing-caption', visible_image), self.S('img', target))
          .center_and_label(image, label)
          .shift(current, target, function () {
            target.closest('li').siblings().removeClass('visible');
            target.closest('li').addClass('visible');
          });
        visible_image.trigger('opened.fndtn.clearing')
      }

      if (!this.locked()) {
        visible_image.trigger('open.fndtn.clearing');
        // set the image to the selected thumbnail
        loaded = this.load($image);
        if (loaded.interchange) {
          image
            .attr('data-interchange', loaded.interchange)
            .foundation('interchange', 'reflow');
        } else {
          image
            .attr('src', loaded.src)
            .attr('data-interchange', '');
        }
        image.css('visibility', 'hidden');

        startLoad.call(this);
      }
    },

    close : function (e, el) {
      e.preventDefault();

      var root = (function (target) {
            if (/blackout/.test(target.selector)) {
              return target;
            } else {
              return target.closest('.clearing-blackout');
            }
          }($(el))),
          body = $(document.body), container, visible_image;

      if (el === e.target && root) {
        body.css('overflow', '');
        container = $('div', root).first();
        visible_image = $('.visible-img', container);
        visible_image.trigger('close.fndtn.clearing');
        this.settings.prev_index = 0;
        $('ul[' + this.attr_name() + ']', root)
          .attr('style', '').closest('.clearing-blackout')
          .removeClass('clearing-blackout');
        container.removeClass('clearing-container');
        visible_image.hide();
        visible_image.trigger('closed.fndtn.clearing');
      }

      // Event to re-enable scrolling on touch devices
      $('body').off('touchmove');

      return false;
    },

    is_open : function (current) {
      return current.parent().prop('style').length > 0;
    },

    keydown : function (e) {
      var clearing = $('.clearing-blackout ul[' + this.attr_name() + ']'),
          NEXT_KEY = this.rtl ? 37 : 39,
          PREV_KEY = this.rtl ? 39 : 37,
          ESC_KEY = 27;

      if (e.which === NEXT_KEY) {
        this.go(clearing, 'next');
      }
      if (e.which === PREV_KEY) {
        this.go(clearing, 'prev');
      }
      if (e.which === ESC_KEY) {
        this.S('a.clearing-close').trigger('click.fndtn.clearing');
      }
    },

    nav : function (e, direction) {
      var clearing = $('ul[' + this.attr_name() + ']', '.clearing-blackout');

      e.preventDefault();
      this.go(clearing, direction);
    },

    resize : function () {
      var image = $('img', '.clearing-blackout .visible-img'),
          label = $('.clearing-touch-label', '.clearing-blackout');

      if (image.length) {
        this.center_and_label(image, label);
        image.trigger('resized.fndtn.clearing')
      }
    },

    // visual adjustments
    fix_height : function (target) {
      var lis = target.parent().children(),
          self = this;

      lis.each(function () {
        var li = self.S(this),
            image = li.find('img');

        if (li.height() > image.outerHeight()) {
          li.addClass('fix-height');
        }
      })
      .closest('ul')
      .width(lis.length * 100 + '%');

      return this;
    },

    update_paddles : function (target) {
      target = target.closest('li');
      var visible_image = target
        .closest('.carousel')
        .siblings('.visible-img');

      if (target.next().length > 0) {
        this.S('.clearing-main-next', visible_image).removeClass('disabled');
      } else {
        this.S('.clearing-main-next', visible_image).addClass('disabled');
      }

      if (target.prev().length > 0) {
        this.S('.clearing-main-prev', visible_image).removeClass('disabled');
      } else {
        this.S('.clearing-main-prev', visible_image).addClass('disabled');
      }
    },

    center_and_label : function (target, label) {
      if (!this.rtl && label.length > 0) {
        label.css({
          marginLeft : -(label.outerWidth() / 2),
          marginTop : -(target.outerHeight() / 2)-label.outerHeight()-10
        });
      } else {
        label.css({
          marginRight : -(label.outerWidth() / 2),
          marginTop : -(target.outerHeight() / 2)-label.outerHeight()-10,
          left: 'auto',
          right: '50%'
        });
      }
      return this;
    },

    // image loading and preloading

    load : function ($image) {
      var href,
          interchange,
          closest_a;

      if ($image[0].nodeName === 'A') {
        href = $image.attr('href');
        interchange = $image.data('clearing-interchange');
      } else {
        closest_a = $image.closest('a');
        href = closest_a.attr('href');
        interchange = closest_a.data('clearing-interchange');
      }

      this.preload($image);

      return {
        'src': href ? href : $image.attr('src'),
        'interchange': href ? interchange : $image.data('clearing-interchange')
      }
    },

    preload : function ($image) {
      this
        .img($image.closest('li').next(), 'next')
        .img($image.closest('li').prev(), 'prev');
    },

    img : function (img, sibling_type) {
      if (img.length) {
        var preload_img = $('.clearing-preload-' + sibling_type),
            new_a = this.S('a', img),
            src,
            interchange,
            image;

        if (new_a.length) {
          src = new_a.attr('href');
          interchange = new_a.data('clearing-interchange');
        } else {
          image = this.S('img', img);
          src = image.attr('src');
          interchange = image.data('clearing-interchange');
        }

        if (interchange) {
          preload_img.attr('data-interchange', interchange);
        } else {
          preload_img.attr('src', src);
          preload_img.attr('data-interchange', '');
        }
      }
      return this;
    },

    // image caption

    caption : function (container, $image) {
      var caption = $image.attr('data-caption');

      if (caption) {
        container
          .html(caption)
          .show();
      } else {
        container
          .text('')
          .hide();
      }
      return this;
    },

    // directional methods

    go : function ($ul, direction) {
      var current = this.S('.visible', $ul),
          target = current[direction]();

      // Check for skip selector.
      if (this.settings.skip_selector && target.find(this.settings.skip_selector).length != 0) {
        target = target[direction]();
      }

      if (target.length) {
        this.S('img', target)
          .trigger('click.fndtn.clearing', [current, target])
          .trigger('change.fndtn.clearing');
      }
    },

    shift : function (current, target, callback) {
      var clearing = target.parent(),
          old_index = this.settings.prev_index || target.index(),
          direction = this.direction(clearing, current, target),
          dir = this.rtl ? 'right' : 'left',
          left = parseInt(clearing.css('left'), 10),
          width = target.outerWidth(),
          skip_shift;

      var dir_obj = {};

      // we use jQuery animate instead of CSS transitions because we
      // need a callback to unlock the next animation
      // needs support for RTL **
      if (target.index() !== old_index && !/skip/.test(direction)) {
        if (/left/.test(direction)) {
          this.lock();
          dir_obj[dir] = left + width;
          clearing.animate(dir_obj, 300, this.unlock());
        } else if (/right/.test(direction)) {
          this.lock();
          dir_obj[dir] = left - width;
          clearing.animate(dir_obj, 300, this.unlock());
        }
      } else if (/skip/.test(direction)) {
        // the target image is not adjacent to the current image, so
        // do we scroll right or not
        skip_shift = target.index() - this.settings.up_count;
        this.lock();

        if (skip_shift > 0) {
          dir_obj[dir] = -(skip_shift * width);
          clearing.animate(dir_obj, 300, this.unlock());
        } else {
          dir_obj[dir] = 0;
          clearing.animate(dir_obj, 300, this.unlock());
        }
      }

      callback();
    },

    direction : function ($el, current, target) {
      var lis = this.S('li', $el),
          li_width = lis.outerWidth() + (lis.outerWidth() / 4),
          up_count = Math.floor(this.S('.clearing-container').outerWidth() / li_width) - 1,
          target_index = lis.index(target),
          response;

      this.settings.up_count = up_count;

      if (this.adjacent(this.settings.prev_index, target_index)) {
        if ((target_index > up_count) && target_index > this.settings.prev_index) {
          response = 'right';
        } else if ((target_index > up_count - 1) && target_index <= this.settings.prev_index) {
          response = 'left';
        } else {
          response = false;
        }
      } else {
        response = 'skip';
      }

      this.settings.prev_index = target_index;

      return response;
    },

    adjacent : function (current_index, target_index) {
      for (var i = target_index + 1; i >= target_index - 1; i--) {
        if (i === current_index) {
          return true;
        }
      }
      return false;
    },

    // lock management

    lock : function () {
      this.settings.locked = true;
    },

    unlock : function () {
      this.settings.locked = false;
    },

    locked : function () {
      return this.settings.locked;
    },

    off : function () {
      this.S(this.scope).off('.fndtn.clearing');
      this.S(window).off('.fndtn.clearing');
    },

    reflow : function () {
      this.init();
    }
  };

}(jQuery, window, window.document));

;(function ($, window, document, undefined) {
  'use strict';

  Foundation.libs.dropdown = {
    name : 'dropdown',

    version : '5.5.2',

    settings : {
      active_class : 'open',
      disabled_class : 'disabled',
      mega_class : 'mega',
      align : 'bottom',
      is_hover : false,
      hover_timeout : 150,
      opened : function () {},
      closed : function () {}
    },

    init : function (scope, method, options) {
      Foundation.inherit(this, 'throttle');

      $.extend(true, this.settings, method, options);
      this.bindings(method, options);
    },

    events : function (scope) {
      var self = this,
          S = self.S;

      S(this.scope)
        .off('.dropdown')
        .on('click.fndtn.dropdown', '[' + this.attr_name() + ']', function (e) {
          var settings = S(this).data(self.attr_name(true) + '-init') || self.settings;
          if (!settings.is_hover || Modernizr.touch) {
            e.preventDefault();
            if (S(this).parent('[data-reveal-id]').length) {
              e.stopPropagation();
            }
            self.toggle($(this));
          }
        })
        .on('mouseenter.fndtn.dropdown', '[' + this.attr_name() + '], [' + this.attr_name() + '-content]', function (e) {
          var $this = S(this),
              dropdown,
              target;

          clearTimeout(self.timeout);

          if ($this.data(self.data_attr())) {
            dropdown = S('#' + $this.data(self.data_attr()));
            target = $this;
          } else {
            dropdown = $this;
            target = S('[' + self.attr_name() + '="' + dropdown.attr('id') + '"]');
          }

          var settings = target.data(self.attr_name(true) + '-init') || self.settings;

          if (S(e.currentTarget).data(self.data_attr()) && settings.is_hover) {
            self.closeall.call(self);
          }

          if (settings.is_hover) {
            self.open.apply(self, [dropdown, target]);
          }
        })
        .on('mouseleave.fndtn.dropdown', '[' + this.attr_name() + '], [' + this.attr_name() + '-content]', function (e) {
          var $this = S(this);
          var settings;

          if ($this.data(self.data_attr())) {
              settings = $this.data(self.data_attr(true) + '-init') || self.settings;
          } else {
              var target   = S('[' + self.attr_name() + '="' + S(this).attr('id') + '"]'),
                  settings = target.data(self.attr_name(true) + '-init') || self.settings;
          }

          self.timeout = setTimeout(function () {
            if ($this.data(self.data_attr())) {
              if (settings.is_hover) {
                self.close.call(self, S('#' + $this.data(self.data_attr())));
              }
            } else {
              if (settings.is_hover) {
                self.close.call(self, $this);
              }
            }
          }.bind(this), settings.hover_timeout);
        })
        .on('click.fndtn.dropdown', function (e) {
          var parent = S(e.target).closest('[' + self.attr_name() + '-content]');
          var links  = parent.find('a');

          if (links.length > 0 && parent.attr('aria-autoclose') !== 'false') {
              self.close.call(self, S('[' + self.attr_name() + '-content]'));
          }

          if (e.target !== document && !$.contains(document.documentElement, e.target)) {
            return;
          }

          if (S(e.target).closest('[' + self.attr_name() + ']').length > 0) {
            return;
          }

          if (!(S(e.target).data('revealId')) &&
            (parent.length > 0 && (S(e.target).is('[' + self.attr_name() + '-content]') ||
              $.contains(parent.first()[0], e.target)))) {
            e.stopPropagation();
            return;
          }

          self.close.call(self, S('[' + self.attr_name() + '-content]'));
        })
        .on('opened.fndtn.dropdown', '[' + self.attr_name() + '-content]', function () {
          self.settings.opened.call(this);
        })
        .on('closed.fndtn.dropdown', '[' + self.attr_name() + '-content]', function () {
          self.settings.closed.call(this);
        });

      S(window)
        .off('.dropdown')
        .on('resize.fndtn.dropdown', self.throttle(function () {
          self.resize.call(self);
        }, 50));

      this.resize();
    },

    close : function (dropdown) {
      var self = this;
      dropdown.each(function (idx) {
        var original_target = $('[' + self.attr_name() + '=' + dropdown[idx].id + ']') || $('aria-controls=' + dropdown[idx].id + ']');
        original_target.attr('aria-expanded', 'false');
        if (self.S(this).hasClass(self.settings.active_class)) {
          self.S(this)
            .css(Foundation.rtl ? 'right' : 'left', '-99999px')
            .attr('aria-hidden', 'true')
            .removeClass(self.settings.active_class)
            .prev('[' + self.attr_name() + ']')
            .removeClass(self.settings.active_class)
            .removeData('target');

          self.S(this).trigger('closed.fndtn.dropdown', [dropdown]);
        }
      });
      dropdown.removeClass('f-open-' + this.attr_name(true));
    },

    closeall : function () {
      var self = this;
      $.each(self.S('.f-open-' + this.attr_name(true)), function () {
        self.close.call(self, self.S(this));
      });
    },

    open : function (dropdown, target) {
      this
        .css(dropdown
        .addClass(this.settings.active_class), target);
      dropdown.prev('[' + this.attr_name() + ']').addClass(this.settings.active_class);
      dropdown.data('target', target.get(0)).trigger('opened.fndtn.dropdown', [dropdown, target]);
      dropdown.attr('aria-hidden', 'false');
      target.attr('aria-expanded', 'true');
      dropdown.focus();
      dropdown.addClass('f-open-' + this.attr_name(true));
    },

    data_attr : function () {
      if (this.namespace.length > 0) {
        return this.namespace + '-' + this.name;
      }

      return this.name;
    },

    toggle : function (target) {
      if (target.hasClass(this.settings.disabled_class)) {
        return;
      }
      var dropdown = this.S('#' + target.data(this.data_attr()));
      if (dropdown.length === 0) {
        // No dropdown found, not continuing
        return;
      }

      this.close.call(this, this.S('[' + this.attr_name() + '-content]').not(dropdown));

      if (dropdown.hasClass(this.settings.active_class)) {
        this.close.call(this, dropdown);
        if (dropdown.data('target') !== target.get(0)) {
          this.open.call(this, dropdown, target);
        }
      } else {
        this.open.call(this, dropdown, target);
      }
    },

    resize : function () {
      var dropdown = this.S('[' + this.attr_name() + '-content].open');
      var target = $(dropdown.data("target"));

      if (dropdown.length && target.length) {
        this.css(dropdown, target);
      }
    },

    css : function (dropdown, target) {
      var left_offset = Math.max((target.width() - dropdown.width()) / 2, 8),
          settings = target.data(this.attr_name(true) + '-init') || this.settings,
          parentOverflow = dropdown.parent().css('overflow-y') || dropdown.parent().css('overflow');

      this.clear_idx();



      if (this.small()) {
        var p = this.dirs.bottom.call(dropdown, target, settings);

        dropdown.attr('style', '').removeClass('drop-left drop-right drop-top').css({
          position : 'absolute',
          width : '95%',
          'max-width' : 'none',
          top : p.top
        });

        dropdown.css(Foundation.rtl ? 'right' : 'left', left_offset);
      }
      // detect if dropdown is in an overflow container
      else if (parentOverflow !== 'visible') {
        var offset = target[0].offsetTop + target[0].offsetHeight;

        dropdown.attr('style', '').css({
          position : 'absolute',
          top : offset
        });

        dropdown.css(Foundation.rtl ? 'right' : 'left', left_offset);
      }
      else {

        this.style(dropdown, target, settings);
      }

      return dropdown;
    },

    style : function (dropdown, target, settings) {
      var css = $.extend({position : 'absolute'},
        this.dirs[settings.align].call(dropdown, target, settings));

      dropdown.attr('style', '').css(css);
    },

    // return CSS property object
    // `this` is the dropdown
    dirs : {
      // Calculate target offset
      _base : function (t) {
        var o_p = this.offsetParent(),
            o = o_p.offset(),
            p = t.offset();

        p.top -= o.top;
        p.left -= o.left;

        //set some flags on the p object to pass along
        p.missRight = false;
        p.missTop = false;
        p.missLeft = false;
        p.leftRightFlag = false;

        //lets see if the panel will be off the screen
        //get the actual width of the page and store it
        var actualBodyWidth;
        if (document.getElementsByClassName('row')[0]) {
          actualBodyWidth = document.getElementsByClassName('row')[0].clientWidth;
        } else {
          actualBodyWidth = window.innerWidth;
        }

        var actualMarginWidth = (window.innerWidth - actualBodyWidth) / 2;
        var actualBoundary = actualBodyWidth;

        if (!this.hasClass('mega')) {
          //miss top
          if (t.offset().top <= this.outerHeight()) {
            p.missTop = true;
            actualBoundary = window.innerWidth - actualMarginWidth;
            p.leftRightFlag = true;
          }

          //miss right
          if (t.offset().left + this.outerWidth() > t.offset().left + actualMarginWidth && t.offset().left - actualMarginWidth > this.outerWidth()) {
            p.missRight = true;
            p.missLeft = false;
          }

          //miss left
          if (t.offset().left - this.outerWidth() <= 0) {
            p.missLeft = true;
            p.missRight = false;
          }
        }

        return p;
      },

      top : function (t, s) {
        var self = Foundation.libs.dropdown,
            p = self.dirs._base.call(this, t);

        this.addClass('drop-top');

        if (p.missTop == true) {
          p.top = p.top + t.outerHeight() + this.outerHeight();
          this.removeClass('drop-top');
        }

        if (p.missRight == true) {
          p.left = p.left - this.outerWidth() + t.outerWidth();
        }

        if (t.outerWidth() < this.outerWidth() || self.small() || this.hasClass(s.mega_menu)) {
          self.adjust_pip(this, t, s, p);
        }

        if (Foundation.rtl) {
          return {left : p.left - this.outerWidth() + t.outerWidth(),
            top : p.top - this.outerHeight()};
        }

        return {left : p.left, top : p.top - this.outerHeight()};
      },

      bottom : function (t, s) {
        var self = Foundation.libs.dropdown,
            p = self.dirs._base.call(this, t);

        if (p.missRight == true) {
          p.left = p.left - this.outerWidth() + t.outerWidth();
        }

        if (t.outerWidth() < this.outerWidth() || self.small() || this.hasClass(s.mega_menu)) {
          self.adjust_pip(this, t, s, p);
        }

        if (self.rtl) {
          return {left : p.left - this.outerWidth() + t.outerWidth(), top : p.top + t.outerHeight()};
        }

        return {left : p.left, top : p.top + t.outerHeight()};
      },

      left : function (t, s) {
        var p = Foundation.libs.dropdown.dirs._base.call(this, t);

        this.addClass('drop-left');

        if (p.missLeft == true) {
          p.left =  p.left + this.outerWidth();
          p.top = p.top + t.outerHeight();
          this.removeClass('drop-left');
        }

        return {left : p.left - this.outerWidth(), top : p.top};
      },

      right : function (t, s) {
        var p = Foundation.libs.dropdown.dirs._base.call(this, t);

        this.addClass('drop-right');

        if (p.missRight == true) {
          p.left = p.left - this.outerWidth();
          p.top = p.top + t.outerHeight();
          this.removeClass('drop-right');
        } else {
          p.triggeredRight = true;
        }

        var self = Foundation.libs.dropdown;

        if (t.outerWidth() < this.outerWidth() || self.small() || this.hasClass(s.mega_menu)) {
          self.adjust_pip(this, t, s, p);
        }

        return {left : p.left + t.outerWidth(), top : p.top};
      }
    },

    // Insert rule to style psuedo elements
    adjust_pip : function (dropdown, target, settings, position) {
      var sheet = Foundation.stylesheet,
          pip_offset_base = 8;

      if (dropdown.hasClass(settings.mega_class)) {
        pip_offset_base = position.left + (target.outerWidth() / 2) - 8;
      } else if (this.small()) {
        pip_offset_base += position.left - 8;
      }

      this.rule_idx = sheet.cssRules.length;

      //default
      var sel_before = '.f-dropdown.open:before',
          sel_after  = '.f-dropdown.open:after',
          css_before = 'left: ' + pip_offset_base + 'px;',
          css_after  = 'left: ' + (pip_offset_base - 1) + 'px;';

      if (position.missRight == true) {
        pip_offset_base = dropdown.outerWidth() - 23;
        sel_before = '.f-dropdown.open:before',
        sel_after  = '.f-dropdown.open:after',
        css_before = 'left: ' + pip_offset_base + 'px;',
        css_after  = 'left: ' + (pip_offset_base - 1) + 'px;';
      }

      //just a case where right is fired, but its not missing right
      if (position.triggeredRight == true) {
        sel_before = '.f-dropdown.open:before',
        sel_after  = '.f-dropdown.open:after',
        css_before = 'left:-12px;',
        css_after  = 'left:-14px;';
      }

      if (sheet.insertRule) {
        sheet.insertRule([sel_before, '{', css_before, '}'].join(' '), this.rule_idx);
        sheet.insertRule([sel_after, '{', css_after, '}'].join(' '), this.rule_idx + 1);
      } else {
        sheet.addRule(sel_before, css_before, this.rule_idx);
        sheet.addRule(sel_after, css_after, this.rule_idx + 1);
      }
    },

    // Remove old dropdown rule index
    clear_idx : function () {
      var sheet = Foundation.stylesheet;

      if (typeof this.rule_idx !== 'undefined') {
        sheet.deleteRule(this.rule_idx);
        sheet.deleteRule(this.rule_idx);
        delete this.rule_idx;
      }
    },

    small : function () {
      return matchMedia(Foundation.media_queries.small).matches &&
        !matchMedia(Foundation.media_queries.medium).matches;
    },

    off : function () {
      this.S(this.scope).off('.fndtn.dropdown');
      this.S('html, body').off('.fndtn.dropdown');
      this.S(window).off('.fndtn.dropdown');
      this.S('[data-dropdown-content]').off('.fndtn.dropdown');
    },

    reflow : function () {}
  };
}(jQuery, window, window.document));

;(function ($, window, document, undefined) {
  'use strict';

  Foundation.libs.equalizer = {
    name : 'equalizer',

    version : '5.5.2',

    settings : {
      use_tallest : true,
      before_height_change : $.noop,
      after_height_change : $.noop,
      equalize_on_stack : false,
      act_on_hidden_el: false
    },

    init : function (scope, method, options) {
      Foundation.inherit(this, 'image_loaded');
      this.bindings(method, options);
      this.reflow();
    },

    events : function () {
      this.S(window).off('.equalizer').on('resize.fndtn.equalizer', function (e) {
        this.reflow();
      }.bind(this));
    },

    equalize : function (equalizer) {
      var isStacked = false,
          group = equalizer.data('equalizer'),
          settings = equalizer.data(this.attr_name(true)+'-init') || this.settings,
          vals,
          firstTopOffset;

      if (settings.act_on_hidden_el) {
        vals = group ? equalizer.find('['+this.attr_name()+'-watch="'+group+'"]') : equalizer.find('['+this.attr_name()+'-watch]');
      }
      else {
        vals = group ? equalizer.find('['+this.attr_name()+'-watch="'+group+'"]:visible') : equalizer.find('['+this.attr_name()+'-watch]:visible');
      }
      
      if (vals.length === 0) {
        return;
      }

      settings.before_height_change();
      equalizer.trigger('before-height-change.fndth.equalizer');
      vals.height('inherit');

      if (settings.equalize_on_stack === false) {
        firstTopOffset = vals.first().offset().top;
        vals.each(function () {
          if ($(this).offset().top !== firstTopOffset) {
            isStacked = true;
            return false;
          }
        });
        if (isStacked) {
          return;
        }
      }

      var heights = vals.map(function () { return $(this).outerHeight(false) }).get();

      if (settings.use_tallest) {
        var max = Math.max.apply(null, heights);
        vals.css('height', max);
      } else {
        var min = Math.min.apply(null, heights);
        vals.css('height', min);
      }

      settings.after_height_change();
      equalizer.trigger('after-height-change.fndtn.equalizer');
    },

    reflow : function () {
      var self = this;

      this.S('[' + this.attr_name() + ']', this.scope).each(function () {
        var $eq_target = $(this),
            media_query = $eq_target.data('equalizer-mq'),
            ignore_media_query = true;

        if (media_query) {
          media_query = 'is_' + media_query.replace(/-/g, '_');
          if (Foundation.utils.hasOwnProperty(media_query)) {
            ignore_media_query = false;
          }
        }

        self.image_loaded(self.S('img', this), function () {
          if (ignore_media_query || Foundation.utils[media_query]()) {
            self.equalize($eq_target)
          } else {
            var vals = $eq_target.find('[' + self.attr_name() + '-watch]:visible');
            vals.css('height', 'auto');
          }
        });
      });
    }
  };
})(jQuery, window, window.document);

;(function ($, window, document, undefined) {
  'use strict';

  Foundation.libs.interchange = {
    name : 'interchange',

    version : '5.5.2',

    cache : {},

    images_loaded : false,
    nodes_loaded : false,

    settings : {
      load_attr : 'interchange',

      named_queries : {
        'default'     : 'only screen',
        'small'       : Foundation.media_queries['small'],
        'small-only'  : Foundation.media_queries['small-only'],
        'medium'      : Foundation.media_queries['medium'],
        'medium-only' : Foundation.media_queries['medium-only'],
        'large'       : Foundation.media_queries['large'],
        'large-only'  : Foundation.media_queries['large-only'],
        'xlarge'      : Foundation.media_queries['xlarge'],
        'xlarge-only' : Foundation.media_queries['xlarge-only'],
        'xxlarge'     : Foundation.media_queries['xxlarge'],
        'landscape'   : 'only screen and (orientation: landscape)',
        'portrait'    : 'only screen and (orientation: portrait)',
        'retina'      : 'only screen and (-webkit-min-device-pixel-ratio: 2),' +
          'only screen and (min--moz-device-pixel-ratio: 2),' +
          'only screen and (-o-min-device-pixel-ratio: 2/1),' +
          'only screen and (min-device-pixel-ratio: 2),' +
          'only screen and (min-resolution: 192dpi),' +
          'only screen and (min-resolution: 2dppx)'
      },

      directives : {
        replace : function (el, path, trigger) {
          // The trigger argument, if called within the directive, fires
          // an event named after the directive on the element, passing
          // any parameters along to the event that you pass to trigger.
          //
          // ex. trigger(), trigger([a, b, c]), or trigger(a, b, c)
          //
          // This allows you to bind a callback like so:
          // $('#interchangeContainer').on('replace', function (e, a, b, c) {
          //   console.log($(this).html(), a, b, c);
          // });

          if (el !== null && /IMG/.test(el[0].nodeName)) {
            var orig_path = el[0].src;

            if (new RegExp(path, 'i').test(orig_path)) {
              return;
            }

            el.attr("src", path);

            return trigger(el[0].src);
          }
          var last_path = el.data(this.data_attr + '-last-path'),
              self = this;

          if (last_path == path) {
            return;
          }

          if (/\.(gif|jpg|jpeg|tiff|png)([?#].*)?/i.test(path)) {
            $(el).css('background-image', 'url(' + path + ')');
            el.data('interchange-last-path', path);
            return trigger(path);
          }

          return $.get(path, function (response) {
            el.html(response);
            el.data(self.data_attr + '-last-path', path);
            trigger();
          });

        }
      }
    },

    init : function (scope, method, options) {
      Foundation.inherit(this, 'throttle random_str');

      this.data_attr = this.set_data_attr();
      $.extend(true, this.settings, method, options);
      this.bindings(method, options);
      this.reflow();
    },

    get_media_hash : function () {
        var mediaHash = '';
        for (var queryName in this.settings.named_queries ) {
            mediaHash += matchMedia(this.settings.named_queries[queryName]).matches.toString();
        }
        return mediaHash;
    },

    events : function () {
      var self = this, prevMediaHash;

      $(window)
        .off('.interchange')
        .on('resize.fndtn.interchange', self.throttle(function () {
            var currMediaHash = self.get_media_hash();
            if (currMediaHash !== prevMediaHash) {
                self.resize();
            }
            prevMediaHash = currMediaHash;
        }, 50));

      return this;
    },

    resize : function () {
      var cache = this.cache;

      if (!this.images_loaded || !this.nodes_loaded) {
        setTimeout($.proxy(this.resize, this), 50);
        return;
      }

      for (var uuid in cache) {
        if (cache.hasOwnProperty(uuid)) {
          var passed = this.results(uuid, cache[uuid]);
          if (passed) {
            this.settings.directives[passed
              .scenario[1]].call(this, passed.el, passed.scenario[0], (function (passed) {
                if (arguments[0] instanceof Array) {
                  var args = arguments[0];
                } else {
                  var args = Array.prototype.slice.call(arguments, 0);
                }

                return function() {
                  passed.el.trigger(passed.scenario[1], args);
                }
              }(passed)));
          }
        }
      }

    },

    results : function (uuid, scenarios) {
      var count = scenarios.length;

      if (count > 0) {
        var el = this.S('[' + this.add_namespace('data-uuid') + '="' + uuid + '"]');

        while (count--) {
          var mq, rule = scenarios[count][2];
          if (this.settings.named_queries.hasOwnProperty(rule)) {
            mq = matchMedia(this.settings.named_queries[rule]);
          } else {
            mq = matchMedia(rule);
          }
          if (mq.matches) {
            return {el : el, scenario : scenarios[count]};
          }
        }
      }

      return false;
    },

    load : function (type, force_update) {
      if (typeof this['cached_' + type] === 'undefined' || force_update) {
        this['update_' + type]();
      }

      return this['cached_' + type];
    },

    update_images : function () {
      var images = this.S('img[' + this.data_attr + ']'),
          count = images.length,
          i = count,
          loaded_count = 0,
          data_attr = this.data_attr;

      this.cache = {};
      this.cached_images = [];
      this.images_loaded = (count === 0);

      while (i--) {
        loaded_count++;
        if (images[i]) {
          var str = images[i].getAttribute(data_attr) || '';

          if (str.length > 0) {
            this.cached_images.push(images[i]);
          }
        }

        if (loaded_count === count) {
          this.images_loaded = true;
          this.enhance('images');
        }
      }

      return this;
    },

    update_nodes : function () {
      var nodes = this.S('[' + this.data_attr + ']').not('img'),
          count = nodes.length,
          i = count,
          loaded_count = 0,
          data_attr = this.data_attr;

      this.cached_nodes = [];
      this.nodes_loaded = (count === 0);

      while (i--) {
        loaded_count++;
        var str = nodes[i].getAttribute(data_attr) || '';

        if (str.length > 0) {
          this.cached_nodes.push(nodes[i]);
        }

        if (loaded_count === count) {
          this.nodes_loaded = true;
          this.enhance('nodes');
        }
      }

      return this;
    },

    enhance : function (type) {
      var i = this['cached_' + type].length;

      while (i--) {
        this.object($(this['cached_' + type][i]));
      }

      return $(window).trigger('resize.fndtn.interchange');
    },

    convert_directive : function (directive) {

      var trimmed = this.trim(directive);

      if (trimmed.length > 0) {
        return trimmed;
      }

      return 'replace';
    },

    parse_scenario : function (scenario) {
      // This logic had to be made more complex since some users were using commas in the url path
      // So we cannot simply just split on a comma

      var directive_match = scenario[0].match(/(.+),\s*(\w+)\s*$/),
      // getting the mq has gotten a bit complicated since we started accounting for several use cases
      // of URLs. For now we'll continue to match these scenarios, but we may consider having these scenarios
      // as nested objects or arrays in F6.
      // regex: match everything before close parenthesis for mq
      media_query         = scenario[1].match(/(.*)\)/);

      if (directive_match) {
        var path  = directive_match[1],
        directive = directive_match[2];

      } else {
        var cached_split = scenario[0].split(/,\s*$/),
        path             = cached_split[0],
        directive        = '';
      }

      return [this.trim(path), this.convert_directive(directive), this.trim(media_query[1])];
    },

    object : function (el) {
      var raw_arr = this.parse_data_attr(el),
          scenarios = [],
          i = raw_arr.length;

      if (i > 0) {
        while (i--) {
          // split array between comma delimited content and mq
          // regex: comma, optional space, open parenthesis
          var scenario = raw_arr[i].split(/,\s?\(/);

          if (scenario.length > 1) {
            var params = this.parse_scenario(scenario);
            scenarios.push(params);
          }
        }
      }

      return this.store(el, scenarios);
    },

    store : function (el, scenarios) {
      var uuid = this.random_str(),
          current_uuid = el.data(this.add_namespace('uuid', true));

      if (this.cache[current_uuid]) {
        return this.cache[current_uuid];
      }

      el.attr(this.add_namespace('data-uuid'), uuid);
      return this.cache[uuid] = scenarios;
    },

    trim : function (str) {

      if (typeof str === 'string') {
        return $.trim(str);
      }

      return str;
    },

    set_data_attr : function (init) {
      if (init) {
        if (this.namespace.length > 0) {
          return this.namespace + '-' + this.settings.load_attr;
        }

        return this.settings.load_attr;
      }

      if (this.namespace.length > 0) {
        return 'data-' + this.namespace + '-' + this.settings.load_attr;
      }

      return 'data-' + this.settings.load_attr;
    },

    parse_data_attr : function (el) {
      var raw = el.attr(this.attr_name()).split(/\[(.*?)\]/),
          i = raw.length,
          output = [];

      while (i--) {
        if (raw[i].replace(/[\W\d]+/, '').length > 4) {
          output.push(raw[i]);
        }
      }

      return output;
    },

    reflow : function () {
      this.load('images', true);
      this.load('nodes', true);
    }

  };

}(jQuery, window, window.document));

;(function ($, window, document, undefined) {
  'use strict';

  var Modernizr = Modernizr || false;

  Foundation.libs.joyride = {
    name : 'joyride',

    version : '5.5.2',

    defaults : {
      expose                   : false,     // turn on or off the expose feature
      modal                    : true,      // Whether to cover page with modal during the tour
      keyboard                 : true,      // enable left, right and esc keystrokes
      tip_location             : 'bottom',  // 'top' or 'bottom' in relation to parent
      nub_position             : 'auto',    // override on a per tooltip bases
      scroll_speed             : 1500,      // Page scrolling speed in milliseconds, 0 = no scroll animation
      scroll_animation         : 'linear',  // supports 'swing' and 'linear', extend with jQuery UI.
      timer                    : 0,         // 0 = no timer , all other numbers = timer in milliseconds
      start_timer_on_click     : true,      // true or false - true requires clicking the first button start the timer
      start_offset             : 0,         // the index of the tooltip you want to start on (index of the li)
      next_button              : true,      // true or false to control whether a next button is used
      prev_button              : true,      // true or false to control whether a prev button is used
      tip_animation            : 'fade',    // 'pop' or 'fade' in each tip
      pause_after              : [],        // array of indexes where to pause the tour after
      exposed                  : [],        // array of expose elements
      tip_animation_fade_speed : 300,       // when tipAnimation = 'fade' this is speed in milliseconds for the transition
      cookie_monster           : false,     // true or false to control whether cookies are used
      cookie_name              : 'joyride', // Name the cookie you'll use
      cookie_domain            : false,     // Will this cookie be attached to a domain, ie. '.notableapp.com'
      cookie_expires           : 365,       // set when you would like the cookie to expire.
      tip_container            : 'body',    // Where will the tip be attached
      abort_on_close           : true,      // When true, the close event will not fire any callback
      tip_location_patterns    : {
        top : ['bottom'],
        bottom : [], // bottom should not need to be repositioned
        left : ['right', 'top', 'bottom'],
        right : ['left', 'top', 'bottom']
      },
      post_ride_callback     : function () {},    // A method to call once the tour closes (canceled or complete)
      post_step_callback     : function () {},    // A method to call after each step
      pre_step_callback      : function () {},    // A method to call before each step
      pre_ride_callback      : function () {},    // A method to call before the tour starts (passed index, tip, and cloned exposed element)
      post_expose_callback   : function () {},    // A method to call after an element has been exposed
      template : { // HTML segments for tip layout
        link          : '<a href="#close" class="joyride-close-tip">&times;</a>',
        timer         : '<div class="joyride-timer-indicator-wrap"><span class="joyride-timer-indicator"></span></div>',
        tip           : '<div class="joyride-tip-guide"><span class="joyride-nub"></span></div>',
        wrapper       : '<div class="joyride-content-wrapper"></div>',
        button        : '<a href="#" class="small button joyride-next-tip"></a>',
        prev_button   : '<a href="#" class="small button joyride-prev-tip"></a>',
        modal         : '<div class="joyride-modal-bg"></div>',
        expose        : '<div class="joyride-expose-wrapper"></div>',
        expose_cover  : '<div class="joyride-expose-cover"></div>'
      },
      expose_add_class : '' // One or more space-separated class names to be added to exposed element
    },

    init : function (scope, method, options) {
      Foundation.inherit(this, 'throttle random_str');

      this.settings = this.settings || $.extend({}, this.defaults, (options || method));

      this.bindings(method, options)
    },

    go_next : function () {
      if (this.settings.$li.next().length < 1) {
        this.end();
      } else if (this.settings.timer > 0) {
        clearTimeout(this.settings.automate);
        this.hide();
        this.show();
        this.startTimer();
      } else {
        this.hide();
        this.show();
      }
    },

    go_prev : function () {
      if (this.settings.$li.prev().length < 1) {
        // Do nothing if there are no prev element
      } else if (this.settings.timer > 0) {
        clearTimeout(this.settings.automate);
        this.hide();
        this.show(null, true);
        this.startTimer();
      } else {
        this.hide();
        this.show(null, true);
      }
    },

    events : function () {
      var self = this;

      $(this.scope)
        .off('.joyride')
        .on('click.fndtn.joyride', '.joyride-next-tip, .joyride-modal-bg', function (e) {
          e.preventDefault();
          this.go_next()
        }.bind(this))
        .on('click.fndtn.joyride', '.joyride-prev-tip', function (e) {
          e.preventDefault();
          this.go_prev();
        }.bind(this))

        .on('click.fndtn.joyride', '.joyride-close-tip', function (e) {
          e.preventDefault();
          this.end(this.settings.abort_on_close);
        }.bind(this))

        .on('keyup.fndtn.joyride', function (e) {
          // Don't do anything if keystrokes are disabled
          // or if the joyride is not being shown
          if (!this.settings.keyboard || !this.settings.riding) {
            return;
          }

          switch (e.which) {
            case 39: // right arrow
              e.preventDefault();
              this.go_next();
              break;
            case 37: // left arrow
              e.preventDefault();
              this.go_prev();
              break;
            case 27: // escape
              e.preventDefault();
              this.end(this.settings.abort_on_close);
          }
        }.bind(this));

      $(window)
        .off('.joyride')
        .on('resize.fndtn.joyride', self.throttle(function () {
          if ($('[' + self.attr_name() + ']').length > 0 && self.settings.$next_tip && self.settings.riding) {
            if (self.settings.exposed.length > 0) {
              var $els = $(self.settings.exposed);

              $els.each(function () {
                var $this = $(this);
                self.un_expose($this);
                self.expose($this);
              });
            }

            if (self.is_phone()) {
              self.pos_phone();
            } else {
              self.pos_default(false);
            }
          }
        }, 100));
    },

    start : function () {
      var self = this,
          $this = $('[' + this.attr_name() + ']', this.scope),
          integer_settings = ['timer', 'scrollSpeed', 'startOffset', 'tipAnimationFadeSpeed', 'cookieExpires'],
          int_settings_count = integer_settings.length;

      if (!$this.length > 0) {
        return;
      }

      if (!this.settings.init) {
        this.events();
      }

      this.settings = $this.data(this.attr_name(true) + '-init');

      // non configureable settings
      this.settings.$content_el = $this;
      this.settings.$body = $(this.settings.tip_container);
      this.settings.body_offset = $(this.settings.tip_container).position();
      this.settings.$tip_content = this.settings.$content_el.find('> li');
      this.settings.paused = false;
      this.settings.attempts = 0;
      this.settings.riding = true;

      // can we create cookies?
      if (typeof $.cookie !== 'function') {
        this.settings.cookie_monster = false;
      }

      // generate the tips and insert into dom.
      if (!this.settings.cookie_monster || this.settings.cookie_monster && !$.cookie(this.settings.cookie_name)) {
        this.settings.$tip_content.each(function (index) {
          var $this = $(this);
          this.settings = $.extend({}, self.defaults, self.data_options($this));

          // Make sure that settings parsed from data_options are integers where necessary
          var i = int_settings_count;
          while (i--) {
            self.settings[integer_settings[i]] = parseInt(self.settings[integer_settings[i]], 10);
          }
          self.create({$li : $this, index : index});
        });

        // show first tip
        if (!this.settings.start_timer_on_click && this.settings.timer > 0) {
          this.show('init');
          this.startTimer();
        } else {
          this.show('init');
        }

      }
    },

    resume : function () {
      this.set_li();
      this.show();
    },

    tip_template : function (opts) {
      var $blank, content;

      opts.tip_class = opts.tip_class || '';

      $blank = $(this.settings.template.tip).addClass(opts.tip_class);
      content = $.trim($(opts.li).html()) +
        this.prev_button_text(opts.prev_button_text, opts.index) +
        this.button_text(opts.button_text) +
        this.settings.template.link +
        this.timer_instance(opts.index);

      $blank.append($(this.settings.template.wrapper));
      $blank.first().attr(this.add_namespace('data-index'), opts.index);
      $('.joyride-content-wrapper', $blank).append(content);

      return $blank[0];
    },

    timer_instance : function (index) {
      var txt;

      if ((index === 0 && this.settings.start_timer_on_click && this.settings.timer > 0) || this.settings.timer === 0) {
        txt = '';
      } else {
        txt = $(this.settings.template.timer)[0].outerHTML;
      }
      return txt;
    },

    button_text : function (txt) {
      if (this.settings.tip_settings.next_button) {
        txt = $.trim(txt) || 'Next';
        txt = $(this.settings.template.button).append(txt)[0].outerHTML;
      } else {
        txt = '';
      }
      return txt;
    },

    prev_button_text : function (txt, idx) {
      if (this.settings.tip_settings.prev_button) {
        txt = $.trim(txt) || 'Previous';

        // Add the disabled class to the button if it's the first element
        if (idx == 0) {
          txt = $(this.settings.template.prev_button).append(txt).addClass('disabled')[0].outerHTML;
        } else {
          txt = $(this.settings.template.prev_button).append(txt)[0].outerHTML;
        }
      } else {
        txt = '';
      }
      return txt;
    },

    create : function (opts) {
      this.settings.tip_settings = $.extend({}, this.settings, this.data_options(opts.$li));
      var buttonText = opts.$li.attr(this.add_namespace('data-button')) || opts.$li.attr(this.add_namespace('data-text')),
          prevButtonText = opts.$li.attr(this.add_namespace('data-button-prev')) || opts.$li.attr(this.add_namespace('data-prev-text')),
        tipClass = opts.$li.attr('class'),
        $tip_content = $(this.tip_template({
          tip_class : tipClass,
          index : opts.index,
          button_text : buttonText,
          prev_button_text : prevButtonText,
          li : opts.$li
        }));

      $(this.settings.tip_container).append($tip_content);
    },

    show : function (init, is_prev) {
      var $timer = null;

      // are we paused?
      if (this.settings.$li === undefined || ($.inArray(this.settings.$li.index(), this.settings.pause_after) === -1)) {

        // don't go to the next li if the tour was paused
        if (this.settings.paused) {
          this.settings.paused = false;
        } else {
          this.set_li(init, is_prev);
        }

        this.settings.attempts = 0;

        if (this.settings.$li.length && this.settings.$target.length > 0) {
          if (init) { //run when we first start
            this.settings.pre_ride_callback(this.settings.$li.index(), this.settings.$next_tip);
            if (this.settings.modal) {
              this.show_modal();
            }
          }

          this.settings.pre_step_callback(this.settings.$li.index(), this.settings.$next_tip);

          if (this.settings.modal && this.settings.expose) {
            this.expose();
          }

          this.settings.tip_settings = $.extend({}, this.settings, this.data_options(this.settings.$li));

          this.settings.timer = parseInt(this.settings.timer, 10);

          this.settings.tip_settings.tip_location_pattern = this.settings.tip_location_patterns[this.settings.tip_settings.tip_location];

          // scroll and hide bg if not modal
          if (!/body/i.test(this.settings.$target.selector)) {
            var joyridemodalbg = $('.joyride-modal-bg');
            if (/pop/i.test(this.settings.tipAnimation)) {
                joyridemodalbg.hide();
            } else {
                joyridemodalbg.fadeOut(this.settings.tipAnimationFadeSpeed);
            }
            this.scroll_to();
          }

          if (this.is_phone()) {
            this.pos_phone(true);
          } else {
            this.pos_default(true);
          }

          $timer = this.settings.$next_tip.find('.joyride-timer-indicator');

          if (/pop/i.test(this.settings.tip_animation)) {

            $timer.width(0);

            if (this.settings.timer > 0) {

              this.settings.$next_tip.show();

              setTimeout(function () {
                $timer.animate({
                  width : $timer.parent().width()
                }, this.settings.timer, 'linear');
              }.bind(this), this.settings.tip_animation_fade_speed);

            } else {
              this.settings.$next_tip.show();

            }

          } else if (/fade/i.test(this.settings.tip_animation)) {

            $timer.width(0);

            if (this.settings.timer > 0) {

              this.settings.$next_tip
                .fadeIn(this.settings.tip_animation_fade_speed)
                .show();

              setTimeout(function () {
                $timer.animate({
                  width : $timer.parent().width()
                }, this.settings.timer, 'linear');
              }.bind(this), this.settings.tip_animation_fade_speed);

            } else {
              this.settings.$next_tip.fadeIn(this.settings.tip_animation_fade_speed);
            }
          }

          this.settings.$current_tip = this.settings.$next_tip;

        // skip non-existant targets
        } else if (this.settings.$li && this.settings.$target.length < 1) {

          this.show(init, is_prev);

        } else {

          this.end();

        }
      } else {

        this.settings.paused = true;

      }

    },

    is_phone : function () {
      return matchMedia(Foundation.media_queries.small).matches &&
        !matchMedia(Foundation.media_queries.medium).matches;
    },

    hide : function () {
      if (this.settings.modal && this.settings.expose) {
        this.un_expose();
      }

      if (!this.settings.modal) {
        $('.joyride-modal-bg').hide();
      }

      // Prevent scroll bouncing...wait to remove from layout
      this.settings.$current_tip.css('visibility', 'hidden');
      setTimeout($.proxy(function () {
        this.hide();
        this.css('visibility', 'visible');
      }, this.settings.$current_tip), 0);
      this.settings.post_step_callback(this.settings.$li.index(),
        this.settings.$current_tip);
    },

    set_li : function (init, is_prev) {
      if (init) {
        this.settings.$li = this.settings.$tip_content.eq(this.settings.start_offset);
        this.set_next_tip();
        this.settings.$current_tip = this.settings.$next_tip;
      } else {
        if (is_prev) {
          this.settings.$li = this.settings.$li.prev();
        } else {
          this.settings.$li = this.settings.$li.next();
        }
        this.set_next_tip();
      }

      this.set_target();
    },

    set_next_tip : function () {
      this.settings.$next_tip = $('.joyride-tip-guide').eq(this.settings.$li.index());
      this.settings.$next_tip.data('closed', '');
    },

    set_target : function () {
      var cl = this.settings.$li.attr(this.add_namespace('data-class')),
          id = this.settings.$li.attr(this.add_namespace('data-id')),
          $sel = function () {
            if (id) {
              return $(document.getElementById(id));
            } else if (cl) {
              return $('.' + cl).first();
            } else {
              return $('body');
            }
          };

      this.settings.$target = $sel();
    },

    scroll_to : function () {
      var window_half, tipOffset;

      window_half = $(window).height() / 2;
      tipOffset = Math.ceil(this.settings.$target.offset().top - window_half + this.settings.$next_tip.outerHeight());

      if (tipOffset != 0) {
        $('html, body').stop().animate({
          scrollTop : tipOffset
        }, this.settings.scroll_speed, 'swing');
      }
    },

    paused : function () {
      return ($.inArray((this.settings.$li.index() + 1), this.settings.pause_after) === -1);
    },

    restart : function () {
      this.hide();
      this.settings.$li = undefined;
      this.show('init');
    },

    pos_default : function (init) {
      var $nub = this.settings.$next_tip.find('.joyride-nub'),
          nub_width = Math.ceil($nub.outerWidth() / 2),
          nub_height = Math.ceil($nub.outerHeight() / 2),
          toggle = init || false;

      // tip must not be "display: none" to calculate position
      if (toggle) {
        this.settings.$next_tip.css('visibility', 'hidden');
        this.settings.$next_tip.show();
      }

      if (!/body/i.test(this.settings.$target.selector)) {
          var topAdjustment = this.settings.tip_settings.tipAdjustmentY ? parseInt(this.settings.tip_settings.tipAdjustmentY) : 0,
              leftAdjustment = this.settings.tip_settings.tipAdjustmentX ? parseInt(this.settings.tip_settings.tipAdjustmentX) : 0;

          if (this.bottom()) {
            if (this.rtl) {
              this.settings.$next_tip.css({
                top : (this.settings.$target.offset().top + nub_height + this.settings.$target.outerHeight() + topAdjustment),
                left : this.settings.$target.offset().left + this.settings.$target.outerWidth() - this.settings.$next_tip.outerWidth() + leftAdjustment});
            } else {
              this.settings.$next_tip.css({
                top : (this.settings.$target.offset().top + nub_height + this.settings.$target.outerHeight() + topAdjustment),
                left : this.settings.$target.offset().left + leftAdjustment});
            }

            this.nub_position($nub, this.settings.tip_settings.nub_position, 'top');

          } else if (this.top()) {
            if (this.rtl) {
              this.settings.$next_tip.css({
                top : (this.settings.$target.offset().top - this.settings.$next_tip.outerHeight() - nub_height + topAdjustment),
                left : this.settings.$target.offset().left + this.settings.$target.outerWidth() - this.settings.$next_tip.outerWidth()});
            } else {
              this.settings.$next_tip.css({
                top : (this.settings.$target.offset().top - this.settings.$next_tip.outerHeight() - nub_height + topAdjustment),
                left : this.settings.$target.offset().left + leftAdjustment});
            }

            this.nub_position($nub, this.settings.tip_settings.nub_position, 'bottom');

          } else if (this.right()) {

            this.settings.$next_tip.css({
              top : this.settings.$target.offset().top + topAdjustment,
              left : (this.settings.$target.outerWidth() + this.settings.$target.offset().left + nub_width + leftAdjustment)});

            this.nub_position($nub, this.settings.tip_settings.nub_position, 'left');

          } else if (this.left()) {

            this.settings.$next_tip.css({
              top : this.settings.$target.offset().top + topAdjustment,
              left : (this.settings.$target.offset().left - this.settings.$next_tip.outerWidth() - nub_width + leftAdjustment)});

            this.nub_position($nub, this.settings.tip_settings.nub_position, 'right');

          }

          if (!this.visible(this.corners(this.settings.$next_tip)) && this.settings.attempts < this.settings.tip_settings.tip_location_pattern.length) {

            $nub.removeClass('bottom')
              .removeClass('top')
              .removeClass('right')
              .removeClass('left');

            this.settings.tip_settings.tip_location = this.settings.tip_settings.tip_location_pattern[this.settings.attempts];

            this.settings.attempts++;

            this.pos_default();

          }

      } else if (this.settings.$li.length) {

        this.pos_modal($nub);

      }

      if (toggle) {
        this.settings.$next_tip.hide();
        this.settings.$next_tip.css('visibility', 'visible');
      }

    },

    pos_phone : function (init) {
      var tip_height = this.settings.$next_tip.outerHeight(),
          tip_offset = this.settings.$next_tip.offset(),
          target_height = this.settings.$target.outerHeight(),
          $nub = $('.joyride-nub', this.settings.$next_tip),
          nub_height = Math.ceil($nub.outerHeight() / 2),
          toggle = init || false;

      $nub.removeClass('bottom')
        .removeClass('top')
        .removeClass('right')
        .removeClass('left');

      if (toggle) {
        this.settings.$next_tip.css('visibility', 'hidden');
        this.settings.$next_tip.show();
      }

      if (!/body/i.test(this.settings.$target.selector)) {

        if (this.top()) {

            this.settings.$next_tip.offset({top : this.settings.$target.offset().top - tip_height - nub_height});
            $nub.addClass('bottom');

        } else {

          this.settings.$next_tip.offset({top : this.settings.$target.offset().top + target_height + nub_height});
          $nub.addClass('top');

        }

      } else if (this.settings.$li.length) {
        this.pos_modal($nub);
      }

      if (toggle) {
        this.settings.$next_tip.hide();
        this.settings.$next_tip.css('visibility', 'visible');
      }
    },

    pos_modal : function ($nub) {
      this.center();
      $nub.hide();

      this.show_modal();
    },

    show_modal : function () {
      if (!this.settings.$next_tip.data('closed')) {
        var joyridemodalbg =  $('.joyride-modal-bg');
        if (joyridemodalbg.length < 1) {
          var joyridemodalbg = $(this.settings.template.modal);
          joyridemodalbg.appendTo('body');
        }

        if (/pop/i.test(this.settings.tip_animation)) {
            joyridemodalbg.show();
        } else {
            joyridemodalbg.fadeIn(this.settings.tip_animation_fade_speed);
        }
      }
    },

    expose : function () {
      var expose,
          exposeCover,
          el,
          origCSS,
          origClasses,
          randId = 'expose-' + this.random_str(6);

      if (arguments.length > 0 && arguments[0] instanceof $) {
        el = arguments[0];
      } else if (this.settings.$target && !/body/i.test(this.settings.$target.selector)) {
        el = this.settings.$target;
      } else {
        return false;
      }

      if (el.length < 1) {
        if (window.console) {
          console.error('element not valid', el);
        }
        return false;
      }

      expose = $(this.settings.template.expose);
      this.settings.$body.append(expose);
      expose.css({
        top : el.offset().top,
        left : el.offset().left,
        width : el.outerWidth(true),
        height : el.outerHeight(true)
      });

      exposeCover = $(this.settings.template.expose_cover);

      origCSS = {
        zIndex : el.css('z-index'),
        position : el.css('position')
      };

      origClasses = el.attr('class') == null ? '' : el.attr('class');

      el.css('z-index', parseInt(expose.css('z-index')) + 1);

      if (origCSS.position == 'static') {
        el.css('position', 'relative');
      }

      el.data('expose-css', origCSS);
      el.data('orig-class', origClasses);
      el.attr('class', origClasses + ' ' + this.settings.expose_add_class);

      exposeCover.css({
        top : el.offset().top,
        left : el.offset().left,
        width : el.outerWidth(true),
        height : el.outerHeight(true)
      });

      if (this.settings.modal) {
        this.show_modal();
      }

      this.settings.$body.append(exposeCover);
      expose.addClass(randId);
      exposeCover.addClass(randId);
      el.data('expose', randId);
      this.settings.post_expose_callback(this.settings.$li.index(), this.settings.$next_tip, el);
      this.add_exposed(el);
    },

    un_expose : function () {
      var exposeId,
          el,
          expose,
          origCSS,
          origClasses,
          clearAll = false;

      if (arguments.length > 0 && arguments[0] instanceof $) {
        el = arguments[0];
      } else if (this.settings.$target && !/body/i.test(this.settings.$target.selector)) {
        el = this.settings.$target;
      } else {
        return false;
      }

      if (el.length < 1) {
        if (window.console) {
          console.error('element not valid', el);
        }
        return false;
      }

      exposeId = el.data('expose');
      expose = $('.' + exposeId);

      if (arguments.length > 1) {
        clearAll = arguments[1];
      }

      if (clearAll === true) {
        $('.joyride-expose-wrapper,.joyride-expose-cover').remove();
      } else {
        expose.remove();
      }

      origCSS = el.data('expose-css');

      if (origCSS.zIndex == 'auto') {
        el.css('z-index', '');
      } else {
        el.css('z-index', origCSS.zIndex);
      }

      if (origCSS.position != el.css('position')) {
        if (origCSS.position == 'static') {// this is default, no need to set it.
          el.css('position', '');
        } else {
          el.css('position', origCSS.position);
        }
      }

      origClasses = el.data('orig-class');
      el.attr('class', origClasses);
      el.removeData('orig-classes');

      el.removeData('expose');
      el.removeData('expose-z-index');
      this.remove_exposed(el);
    },

    add_exposed : function (el) {
      this.settings.exposed = this.settings.exposed || [];
      if (el instanceof $ || typeof el === 'object') {
        this.settings.exposed.push(el[0]);
      } else if (typeof el == 'string') {
        this.settings.exposed.push(el);
      }
    },

    remove_exposed : function (el) {
      var search, i;
      if (el instanceof $) {
        search = el[0]
      } else if (typeof el == 'string') {
        search = el;
      }

      this.settings.exposed = this.settings.exposed || [];
      i = this.settings.exposed.length;

      while (i--) {
        if (this.settings.exposed[i] == search) {
          this.settings.exposed.splice(i, 1);
          return;
        }
      }
    },

    center : function () {
      var $w = $(window);

      this.settings.$next_tip.css({
        top : ((($w.height() - this.settings.$next_tip.outerHeight()) / 2) + $w.scrollTop()),
        left : ((($w.width() - this.settings.$next_tip.outerWidth()) / 2) + $w.scrollLeft())
      });

      return true;
    },

    bottom : function () {
      return /bottom/i.test(this.settings.tip_settings.tip_location);
    },

    top : function () {
      return /top/i.test(this.settings.tip_settings.tip_location);
    },

    right : function () {
      return /right/i.test(this.settings.tip_settings.tip_location);
    },

    left : function () {
      return /left/i.test(this.settings.tip_settings.tip_location);
    },

    corners : function (el) {
      var w = $(window),
          window_half = w.height() / 2,
          //using this to calculate since scroll may not have finished yet.
          tipOffset = Math.ceil(this.settings.$target.offset().top - window_half + this.settings.$next_tip.outerHeight()),
          right = w.width() + w.scrollLeft(),
          offsetBottom =  w.height() + tipOffset,
          bottom = w.height() + w.scrollTop(),
          top = w.scrollTop();

      if (tipOffset < top) {
        if (tipOffset < 0) {
          top = 0;
        } else {
          top = tipOffset;
        }
      }

      if (offsetBottom > bottom) {
        bottom = offsetBottom;
      }

      return [
        el.offset().top < top,
        right < el.offset().left + el.outerWidth(),
        bottom < el.offset().top + el.outerHeight(),
        w.scrollLeft() > el.offset().left
      ];
    },

    visible : function (hidden_corners) {
      var i = hidden_corners.length;

      while (i--) {
        if (hidden_corners[i]) {
          return false;
        }
      }

      return true;
    },

    nub_position : function (nub, pos, def) {
      if (pos === 'auto') {
        nub.addClass(def);
      } else {
        nub.addClass(pos);
      }
    },

    startTimer : function () {
      if (this.settings.$li.length) {
        this.settings.automate = setTimeout(function () {
          this.hide();
          this.show();
          this.startTimer();
        }.bind(this), this.settings.timer);
      } else {
        clearTimeout(this.settings.automate);
      }
    },

    end : function (abort) {
      if (this.settings.cookie_monster) {
        $.cookie(this.settings.cookie_name, 'ridden', {expires : this.settings.cookie_expires, domain : this.settings.cookie_domain});
      }

      if (this.settings.timer > 0) {
        clearTimeout(this.settings.automate);
      }

      if (this.settings.modal && this.settings.expose) {
        this.un_expose();
      }

      // Unplug keystrokes listener
      $(this.scope).off('keyup.joyride')

      this.settings.$next_tip.data('closed', true);
      this.settings.riding = false;

      $('.joyride-modal-bg').hide();
      this.settings.$current_tip.hide();

      if (typeof abort === 'undefined' || abort === false) {
        this.settings.post_step_callback(this.settings.$li.index(), this.settings.$current_tip);
        this.settings.post_ride_callback(this.settings.$li.index(), this.settings.$current_tip);
      }

      $('.joyride-tip-guide').remove();
    },

    off : function () {
      $(this.scope).off('.joyride');
      $(window).off('.joyride');
      $('.joyride-close-tip, .joyride-next-tip, .joyride-modal-bg').off('.joyride');
      $('.joyride-tip-guide, .joyride-modal-bg').remove();
      clearTimeout(this.settings.automate);
      this.settings = {};
    },

    reflow : function () {}
  };
}(jQuery, window, window.document));

;(function ($, window, document, undefined) {
  'use strict';

  Foundation.libs['magellan-expedition'] = {
    name : 'magellan-expedition',

    version : '5.5.2',

    settings : {
      active_class : 'active',
      threshold : 0, // pixels from the top of the expedition for it to become fixes
      destination_threshold : 20, // pixels from the top of destination for it to be considered active
      throttle_delay : 30, // calculation throttling to increase framerate
      fixed_top : 0, // top distance in pixels assigend to the fixed element on scroll
      offset_by_height : true,  // whether to offset the destination by the expedition height. Usually you want this to be true, unless your expedition is on the side.
      duration : 700, // animation duration time
      easing : 'swing' // animation easing
    },

    init : function (scope, method, options) {
      Foundation.inherit(this, 'throttle');
      this.bindings(method, options);
    },

    events : function () {
      var self = this,
          S = self.S,
          settings = self.settings;

      // initialize expedition offset
      self.set_expedition_position();

      S(self.scope)
        .off('.magellan')
        .on('click.fndtn.magellan', '[' + self.add_namespace('data-magellan-arrival') + '] a[href*=#]', function (e) {
          var sameHost = ((this.hostname === location.hostname) || !this.hostname),
              samePath = self.filterPathname(location.pathname) === self.filterPathname(this.pathname),
              testHash = this.hash.replace(/(:|\.|\/)/g, '\\$1'),
              anchor = this;

          if (sameHost && samePath && testHash) {
            e.preventDefault();
            var expedition = $(this).closest('[' + self.attr_name() + ']'),
                settings = expedition.data('magellan-expedition-init'),
                hash = this.hash.split('#').join(''),
                target = $('a[name="' + hash + '"]');

            if (target.length === 0) {
              target = $('#' + hash);

            }

            // Account for expedition height if fixed position
            var scroll_top = target.offset().top - settings.destination_threshold + 1;
            if (settings.offset_by_height) {
              scroll_top = scroll_top - expedition.outerHeight();
            }
            $('html, body').stop().animate({
              'scrollTop' : scroll_top
            }, settings.duration, settings.easing, function () {
              if (history.pushState) {
                        history.pushState(null, null, anchor.pathname + '#' + hash);
              }
                    else {
                        location.hash = anchor.pathname + '#' + hash;
                    }
            });
          }
        })
        .on('scroll.fndtn.magellan', self.throttle(this.check_for_arrivals.bind(this), settings.throttle_delay));
    },

    check_for_arrivals : function () {
      var self = this;
      self.update_arrivals();
      self.update_expedition_positions();
    },

    set_expedition_position : function () {
      var self = this;
      $('[' + this.attr_name() + '=fixed]', self.scope).each(function (idx, el) {
        var expedition = $(this),
            settings = expedition.data('magellan-expedition-init'),
            styles = expedition.attr('styles'), // save styles
            top_offset, fixed_top;

        expedition.attr('style', '');
        top_offset = expedition.offset().top + settings.threshold;

        //set fixed-top by attribute
        fixed_top = parseInt(expedition.data('magellan-fixed-top'));
        if (!isNaN(fixed_top)) {
          self.settings.fixed_top = fixed_top;
        }

        expedition.data(self.data_attr('magellan-top-offset'), top_offset);
        expedition.attr('style', styles);
      });
    },

    update_expedition_positions : function () {
      var self = this,
          window_top_offset = $(window).scrollTop();

      $('[' + this.attr_name() + '=fixed]', self.scope).each(function () {
        var expedition = $(this),
            settings = expedition.data('magellan-expedition-init'),
            styles = expedition.attr('style'), // save styles
            top_offset = expedition.data('magellan-top-offset');

        //scroll to the top distance
        if (window_top_offset + self.settings.fixed_top >= top_offset) {
          // Placeholder allows height calculations to be consistent even when
          // appearing to switch between fixed/non-fixed placement
          var placeholder = expedition.prev('[' + self.add_namespace('data-magellan-expedition-clone') + ']');
          if (placeholder.length === 0) {
            placeholder = expedition.clone();
            placeholder.removeAttr(self.attr_name());
            placeholder.attr(self.add_namespace('data-magellan-expedition-clone'), '');
            expedition.before(placeholder);
          }
          expedition.css({position :'fixed', top : settings.fixed_top}).addClass('fixed');
        } else {
          expedition.prev('[' + self.add_namespace('data-magellan-expedition-clone') + ']').remove();
          expedition.attr('style', styles).css('position', '').css('top', '').removeClass('fixed');
        }
      });
    },

    update_arrivals : function () {
      var self = this,
          window_top_offset = $(window).scrollTop();

      $('[' + this.attr_name() + ']', self.scope).each(function () {
        var expedition = $(this),
            settings = expedition.data(self.attr_name(true) + '-init'),
            offsets = self.offsets(expedition, window_top_offset),
            arrivals = expedition.find('[' + self.add_namespace('data-magellan-arrival') + ']'),
            active_item = false;
        offsets.each(function (idx, item) {
          if (item.viewport_offset >= item.top_offset) {
            var arrivals = expedition.find('[' + self.add_namespace('data-magellan-arrival') + ']');
            arrivals.not(item.arrival).removeClass(settings.active_class);
            item.arrival.addClass(settings.active_class);
            active_item = true;
            return true;
          }
        });

        if (!active_item) {
          arrivals.removeClass(settings.active_class);
        }
      });
    },

    offsets : function (expedition, window_offset) {
      var self = this,
          settings = expedition.data(self.attr_name(true) + '-init'),
          viewport_offset = window_offset;

      return expedition.find('[' + self.add_namespace('data-magellan-arrival') + ']').map(function (idx, el) {
        var name = $(this).data(self.data_attr('magellan-arrival')),
            dest = $('[' + self.add_namespace('data-magellan-destination') + '=' + name + ']');
        if (dest.length > 0) {
          var top_offset = dest.offset().top - settings.destination_threshold;
          if (settings.offset_by_height) {
            top_offset = top_offset - expedition.outerHeight();
          }
          top_offset = Math.floor(top_offset);
          return {
            destination : dest,
            arrival : $(this),
            top_offset : top_offset,
            viewport_offset : viewport_offset
          }
        }
      }).sort(function (a, b) {
        if (a.top_offset < b.top_offset) {
          return -1;
        }
        if (a.top_offset > b.top_offset) {
          return 1;
        }
        return 0;
      });
    },

    data_attr : function (str) {
      if (this.namespace.length > 0) {
        return this.namespace + '-' + str;
      }

      return str;
    },

    off : function () {
      this.S(this.scope).off('.magellan');
      this.S(window).off('.magellan');
    },

    filterPathname : function (pathname) {
      pathname = pathname || '';
      return pathname
          .replace(/^\//,'')
          .replace(/(?:index|default).[a-zA-Z]{3,4}$/,'')
          .replace(/\/$/,'');
    },

    reflow : function () {
      var self = this;
      // remove placeholder expeditions used for height calculation purposes
      $('[' + self.add_namespace('data-magellan-expedition-clone') + ']', self.scope).remove();
    }
  };
}(jQuery, window, window.document));

;(function ($, window, document, undefined) {
  'use strict';

  Foundation.libs.offcanvas = {
    name : 'offcanvas',

    version : '5.5.2',

    settings : {
      open_method : 'move',
      close_on_click : false
    },

    init : function (scope, method, options) {
      this.bindings(method, options);
    },

    events : function () {
      var self = this,
          S = self.S,
          move_class = '',
          right_postfix = '',
          left_postfix = '';

      if (this.settings.open_method === 'move') {
        move_class = 'move-';
        right_postfix = 'right';
        left_postfix = 'left';
      } else if (this.settings.open_method === 'overlap_single') {
        move_class = 'offcanvas-overlap-';
        right_postfix = 'right';
        left_postfix = 'left';
      } else if (this.settings.open_method === 'overlap') {
        move_class = 'offcanvas-overlap';
      }

      S(this.scope).off('.offcanvas')
        .on('click.fndtn.offcanvas', '.left-off-canvas-toggle', function (e) {
          self.click_toggle_class(e, move_class + right_postfix);
          if (self.settings.open_method !== 'overlap') {
            S('.left-submenu').removeClass(move_class + right_postfix);
          }
          $('.left-off-canvas-toggle').attr('aria-expanded', 'true');
        })
        .on('click.fndtn.offcanvas', '.left-off-canvas-menu a', function (e) {
          var settings = self.get_settings(e);
          var parent = S(this).parent();

          if (settings.close_on_click && !parent.hasClass('has-submenu') && !parent.hasClass('back')) {
            self.hide.call(self, move_class + right_postfix, self.get_wrapper(e));
            parent.parent().removeClass(move_class + right_postfix);
          } else if (S(this).parent().hasClass('has-submenu')) {
            e.preventDefault();
            S(this).siblings('.left-submenu').toggleClass(move_class + right_postfix);
          } else if (parent.hasClass('back')) {
            e.preventDefault();
            parent.parent().removeClass(move_class + right_postfix);
          }
          $('.left-off-canvas-toggle').attr('aria-expanded', 'true');
        })
        .on('click.fndtn.offcanvas', '.right-off-canvas-toggle', function (e) {
          self.click_toggle_class(e, move_class + left_postfix);
          if (self.settings.open_method !== 'overlap') {
            S('.right-submenu').removeClass(move_class + left_postfix);
          }
          $('.right-off-canvas-toggle').attr('aria-expanded', 'true');
        })
        .on('click.fndtn.offcanvas', '.right-off-canvas-menu a', function (e) {
          var settings = self.get_settings(e);
          var parent = S(this).parent();

          if (settings.close_on_click && !parent.hasClass('has-submenu') && !parent.hasClass('back')) {
            self.hide.call(self, move_class + left_postfix, self.get_wrapper(e));
            parent.parent().removeClass(move_class + left_postfix);
          } else if (S(this).parent().hasClass('has-submenu')) {
            e.preventDefault();
            S(this).siblings('.right-submenu').toggleClass(move_class + left_postfix);
          } else if (parent.hasClass('back')) {
            e.preventDefault();
            parent.parent().removeClass(move_class + left_postfix);
          }
          $('.right-off-canvas-toggle').attr('aria-expanded', 'true');
        })
        .on('click.fndtn.offcanvas', '.exit-off-canvas', function (e) {
          self.click_remove_class(e, move_class + left_postfix);
          S('.right-submenu').removeClass(move_class + left_postfix);
          if (right_postfix) {
            self.click_remove_class(e, move_class + right_postfix);
            S('.left-submenu').removeClass(move_class + left_postfix);
          }
          $('.right-off-canvas-toggle').attr('aria-expanded', 'true');
        })
        .on('click.fndtn.offcanvas', '.exit-off-canvas', function (e) {
          self.click_remove_class(e, move_class + left_postfix);
          $('.left-off-canvas-toggle').attr('aria-expanded', 'false');
          if (right_postfix) {
            self.click_remove_class(e, move_class + right_postfix);
            $('.right-off-canvas-toggle').attr('aria-expanded', 'false');
          }
        });
    },

    toggle : function (class_name, $off_canvas) {
      $off_canvas = $off_canvas || this.get_wrapper();
      if ($off_canvas.is('.' + class_name)) {
        this.hide(class_name, $off_canvas);
      } else {
        this.show(class_name, $off_canvas);
      }
    },

    show : function (class_name, $off_canvas) {
      $off_canvas = $off_canvas || this.get_wrapper();
      $off_canvas.trigger('open.fndtn.offcanvas');
      $off_canvas.addClass(class_name);
    },

    hide : function (class_name, $off_canvas) {
      $off_canvas = $off_canvas || this.get_wrapper();
      $off_canvas.trigger('close.fndtn.offcanvas');
      $off_canvas.removeClass(class_name);
    },

    click_toggle_class : function (e, class_name) {
      e.preventDefault();
      var $off_canvas = this.get_wrapper(e);
      this.toggle(class_name, $off_canvas);
    },

    click_remove_class : function (e, class_name) {
      e.preventDefault();
      var $off_canvas = this.get_wrapper(e);
      this.hide(class_name, $off_canvas);
    },

    get_settings : function (e) {
      var offcanvas  = this.S(e.target).closest('[' + this.attr_name() + ']');
      return offcanvas.data(this.attr_name(true) + '-init') || this.settings;
    },

    get_wrapper : function (e) {
      var $off_canvas = this.S(e ? e.target : this.scope).closest('.off-canvas-wrap');

      if ($off_canvas.length === 0) {
        $off_canvas = this.S('.off-canvas-wrap');
      }
      return $off_canvas;
    },

    reflow : function () {}
  };
}(jQuery, window, window.document));

;(function ($, window, document, undefined) {
  'use strict';

  var noop = function () {};

  var Orbit = function (el, settings) {
    // Don't reinitialize plugin
    if (el.hasClass(settings.slides_container_class)) {
      return this;
    }

    var self = this,
        container,
        slides_container = el,
        number_container,
        bullets_container,
        timer_container,
        idx = 0,
        animate,
        timer,
        locked = false,
        adjust_height_after = false;

    self.slides = function () {
      return slides_container.children(settings.slide_selector);
    };

    self.slides().first().addClass(settings.active_slide_class);

    self.update_slide_number = function (index) {
      if (settings.slide_number) {
        number_container.find('span:first').text(parseInt(index) + 1);
        number_container.find('span:last').text(self.slides().length);
      }
      if (settings.bullets) {
        bullets_container.children().removeClass(settings.bullets_active_class);
        $(bullets_container.children().get(index)).addClass(settings.bullets_active_class);
      }
    };

    self.update_active_link = function (index) {
      var link = $('[data-orbit-link="' + self.slides().eq(index).attr('data-orbit-slide') + '"]');
      link.siblings().removeClass(settings.bullets_active_class);
      link.addClass(settings.bullets_active_class);
    };

    self.build_markup = function () {
      slides_container.wrap('<div class="' + settings.container_class + '"></div>');
      container = slides_container.parent();
      slides_container.addClass(settings.slides_container_class);

      if (settings.stack_on_small) {
        container.addClass(settings.stack_on_small_class);
      }

      if (settings.navigation_arrows) {
        container.append($('<a href="#"><span></span></a>').addClass(settings.prev_class));
        container.append($('<a href="#"><span></span></a>').addClass(settings.next_class));
      }

      if (settings.timer) {
        timer_container = $('<div>').addClass(settings.timer_container_class);
        timer_container.append('<span>');
        timer_container.append($('<div>').addClass(settings.timer_progress_class));
        timer_container.addClass(settings.timer_paused_class);
        container.append(timer_container);
      }

      if (settings.slide_number) {
        number_container = $('<div>').addClass(settings.slide_number_class);
        number_container.append('<span></span> ' + settings.slide_number_text + ' <span></span>');
        container.append(number_container);
      }

      if (settings.bullets) {
        bullets_container = $('<ol>').addClass(settings.bullets_container_class);
        container.append(bullets_container);
        bullets_container.wrap('<div class="orbit-bullets-container"></div>');
        self.slides().each(function (idx, el) {
          var bullet = $('<li>').attr('data-orbit-slide', idx).on('click', self.link_bullet);;
          bullets_container.append(bullet);
        });
      }

    };

    self._goto = function (next_idx, start_timer) {
      // if (locked) {return false;}
      if (next_idx === idx) {return false;}
      if (typeof timer === 'object') {timer.restart();}
      var slides = self.slides();

      var dir = 'next';
      locked = true;
      if (next_idx < idx) {dir = 'prev';}
      if (next_idx >= slides.length) {
        if (!settings.circular) {
          return false;
        }
        next_idx = 0;
      } else if (next_idx < 0) {
        if (!settings.circular) {
          return false;
        }
        next_idx = slides.length - 1;
      }

      var current = $(slides.get(idx));
      var next = $(slides.get(next_idx));

      current.css('zIndex', 2);
      current.removeClass(settings.active_slide_class);
      next.css('zIndex', 4).addClass(settings.active_slide_class);

      slides_container.trigger('before-slide-change.fndtn.orbit');
      settings.before_slide_change();
      self.update_active_link(next_idx);

      var callback = function () {
        var unlock = function () {
          idx = next_idx;
          locked = false;
          if (start_timer === true) {timer = self.create_timer(); timer.start();}
          self.update_slide_number(idx);
          slides_container.trigger('after-slide-change.fndtn.orbit', [{slide_number : idx, total_slides : slides.length}]);
          settings.after_slide_change(idx, slides.length);
        };
        if (slides_container.outerHeight() != next.outerHeight() && settings.variable_height) {
          slides_container.animate({'height': next.outerHeight()}, 250, 'linear', unlock);
        } else {
          unlock();
        }
      };

      if (slides.length === 1) {callback(); return false;}

      var start_animation = function () {
        if (dir === 'next') {animate.next(current, next, callback);}
        if (dir === 'prev') {animate.prev(current, next, callback);}
      };

      if (next.outerHeight() > slides_container.outerHeight() && settings.variable_height) {
        slides_container.animate({'height': next.outerHeight()}, 250, 'linear', start_animation);
      } else {
        start_animation();
      }
    };

    self.next = function (e) {
      e.stopImmediatePropagation();
      e.preventDefault();
      self._goto(idx + 1);
    };

    self.prev = function (e) {
      e.stopImmediatePropagation();
      e.preventDefault();
      self._goto(idx - 1);
    };

    self.link_custom = function (e) {
      e.preventDefault();
      var link = $(this).attr('data-orbit-link');
      if ((typeof link === 'string') && (link = $.trim(link)) != '') {
        var slide = container.find('[data-orbit-slide=' + link + ']');
        if (slide.index() != -1) {self._goto(slide.index());}
      }
    };

    self.link_bullet = function (e) {
      var index = $(this).attr('data-orbit-slide');
      if ((typeof index === 'string') && (index = $.trim(index)) != '') {
        if (isNaN(parseInt(index))) {
          var slide = container.find('[data-orbit-slide=' + index + ']');
          if (slide.index() != -1) {self._goto(slide.index() + 1);}
        } else {
          self._goto(parseInt(index));
        }
      }

    }

    self.timer_callback = function () {
      self._goto(idx + 1, true);
    }

    self.compute_dimensions = function () {
      var current = $(self.slides().get(idx));
      var h = current.outerHeight();
      if (!settings.variable_height) {
        self.slides().each(function(){
          if ($(this).outerHeight() > h) { h = $(this).outerHeight(); }
        });
      }
      slides_container.height(h);
    };

    self.create_timer = function () {
      var t = new Timer(
        container.find('.' + settings.timer_container_class),
        settings,
        self.timer_callback
      );
      return t;
    };

    self.stop_timer = function () {
      if (typeof timer === 'object') {
        timer.stop();
      }
    };

    self.toggle_timer = function () {
      var t = container.find('.' + settings.timer_container_class);
      if (t.hasClass(settings.timer_paused_class)) {
        if (typeof timer === 'undefined') {timer = self.create_timer();}
        timer.start();
      } else {
        if (typeof timer === 'object') {timer.stop();}
      }
    };

    self.init = function () {
      self.build_markup();
      if (settings.timer) {
        timer = self.create_timer();
        Foundation.utils.image_loaded(this.slides().children('img'), timer.start);
      }
      animate = new FadeAnimation(settings, slides_container);
      if (settings.animation === 'slide') {
        animate = new SlideAnimation(settings, slides_container);
      }

      container.on('click', '.' + settings.next_class, self.next);
      container.on('click', '.' + settings.prev_class, self.prev);

      if (settings.next_on_click) {
        container.on('click', '.' + settings.slides_container_class + ' [data-orbit-slide]', self.link_bullet);
      }

      container.on('click', self.toggle_timer);
      if (settings.swipe) {
        container.on('touchstart.fndtn.orbit', function (e) {
          if (!e.touches) {e = e.originalEvent;}
          var data = {
            start_page_x : e.touches[0].pageX,
            start_page_y : e.touches[0].pageY,
            start_time : (new Date()).getTime(),
            delta_x : 0,
            is_scrolling : undefined
          };
          container.data('swipe-transition', data);
          e.stopPropagation();
        })
        .on('touchmove.fndtn.orbit', function (e) {
          if (!e.touches) {
            e = e.originalEvent;
          }
          // Ignore pinch/zoom events
          if (e.touches.length > 1 || e.scale && e.scale !== 1) {
            return;
          }

          var data = container.data('swipe-transition');
          if (typeof data === 'undefined') {data = {};}

          data.delta_x = e.touches[0].pageX - data.start_page_x;

          if ( typeof data.is_scrolling === 'undefined') {
            data.is_scrolling = !!( data.is_scrolling || Math.abs(data.delta_x) < Math.abs(e.touches[0].pageY - data.start_page_y) );
          }

          if (!data.is_scrolling && !data.active) {
            e.preventDefault();
            var direction = (data.delta_x < 0) ? (idx + 1) : (idx - 1);
            data.active = true;
            self._goto(direction);
          }
        })
        .on('touchend.fndtn.orbit', function (e) {
          container.data('swipe-transition', {});
          e.stopPropagation();
        })
      }
      container.on('mouseenter.fndtn.orbit', function (e) {
        if (settings.timer && settings.pause_on_hover) {
          self.stop_timer();
        }
      })
      .on('mouseleave.fndtn.orbit', function (e) {
        if (settings.timer && settings.resume_on_mouseout) {
          timer.start();
        }
      });

      $(document).on('click', '[data-orbit-link]', self.link_custom);
      $(window).on('load resize', self.compute_dimensions);
      Foundation.utils.image_loaded(this.slides().children('img'), self.compute_dimensions);
      Foundation.utils.image_loaded(this.slides().children('img'), function () {
        container.prev('.' + settings.preloader_class).css('display', 'none');
        self.update_slide_number(0);
        self.update_active_link(0);
        slides_container.trigger('ready.fndtn.orbit');
      });
    };

    self.init();
  };

  var Timer = function (el, settings, callback) {
    var self = this,
        duration = settings.timer_speed,
        progress = el.find('.' + settings.timer_progress_class),
        start,
        timeout,
        left = -1;

    this.update_progress = function (w) {
      var new_progress = progress.clone();
      new_progress.attr('style', '');
      new_progress.css('width', w + '%');
      progress.replaceWith(new_progress);
      progress = new_progress;
    };

    this.restart = function () {
      clearTimeout(timeout);
      el.addClass(settings.timer_paused_class);
      left = -1;
      self.update_progress(0);
    };

    this.start = function () {
      if (!el.hasClass(settings.timer_paused_class)) {return true;}
      left = (left === -1) ? duration : left;
      el.removeClass(settings.timer_paused_class);
      start = new Date().getTime();
      progress.animate({'width' : '100%'}, left, 'linear');
      timeout = setTimeout(function () {
        self.restart();
        callback();
      }, left);
      el.trigger('timer-started.fndtn.orbit')
    };

    this.stop = function () {
      if (el.hasClass(settings.timer_paused_class)) {return true;}
      clearTimeout(timeout);
      el.addClass(settings.timer_paused_class);
      var end = new Date().getTime();
      left = left - (end - start);
      var w = 100 - ((left / duration) * 100);
      self.update_progress(w);
      el.trigger('timer-stopped.fndtn.orbit');
    };
  };

  var SlideAnimation = function (settings, container) {
    var duration = settings.animation_speed;
    var is_rtl = ($('html[dir=rtl]').length === 1);
    var margin = is_rtl ? 'marginRight' : 'marginLeft';
    var animMargin = {};
    animMargin[margin] = '0%';

    this.next = function (current, next, callback) {
      current.animate({marginLeft : '-100%'}, duration);
      next.animate(animMargin, duration, function () {
        current.css(margin, '100%');
        callback();
      });
    };

    this.prev = function (current, prev, callback) {
      current.animate({marginLeft : '100%'}, duration);
      prev.css(margin, '-100%');
      prev.animate(animMargin, duration, function () {
        current.css(margin, '100%');
        callback();
      });
    };
  };

  var FadeAnimation = function (settings, container) {
    var duration = settings.animation_speed;
    var is_rtl = ($('html[dir=rtl]').length === 1);
    var margin = is_rtl ? 'marginRight' : 'marginLeft';

    this.next = function (current, next, callback) {
      next.css({'margin' : '0%', 'opacity' : '0.01'});
      next.animate({'opacity' :'1'}, duration, 'linear', function () {
        current.css('margin', '100%');
        callback();
      });
    };

    this.prev = function (current, prev, callback) {
      prev.css({'margin' : '0%', 'opacity' : '0.01'});
      prev.animate({'opacity' : '1'}, duration, 'linear', function () {
        current.css('margin', '100%');
        callback();
      });
    };
  };

  Foundation.libs = Foundation.libs || {};

  Foundation.libs.orbit = {
    name : 'orbit',

    version : '5.5.2',

    settings : {
      animation : 'slide',
      timer_speed : 10000,
      pause_on_hover : true,
      resume_on_mouseout : false,
      next_on_click : true,
      animation_speed : 500,
      stack_on_small : false,
      navigation_arrows : true,
      slide_number : true,
      slide_number_text : 'of',
      container_class : 'orbit-container',
      stack_on_small_class : 'orbit-stack-on-small',
      next_class : 'orbit-next',
      prev_class : 'orbit-prev',
      timer_container_class : 'orbit-timer',
      timer_paused_class : 'paused',
      timer_progress_class : 'orbit-progress',
      slides_container_class : 'orbit-slides-container',
      preloader_class : 'preloader',
      slide_selector : '*',
      bullets_container_class : 'orbit-bullets',
      bullets_active_class : 'active',
      slide_number_class : 'orbit-slide-number',
      caption_class : 'orbit-caption',
      active_slide_class : 'active',
      orbit_transition_class : 'orbit-transitioning',
      bullets : true,
      circular : true,
      timer : true,
      variable_height : false,
      swipe : true,
      before_slide_change : noop,
      after_slide_change : noop
    },

    init : function (scope, method, options) {
      var self = this;
      this.bindings(method, options);
    },

    events : function (instance) {
      var orbit_instance = new Orbit(this.S(instance), this.S(instance).data('orbit-init'));
      this.S(instance).data(this.name + '-instance', orbit_instance);
    },

    reflow : function () {
      var self = this;

      if (self.S(self.scope).is('[data-orbit]')) {
        var $el = self.S(self.scope);
        var instance = $el.data(self.name + '-instance');
        instance.compute_dimensions();
      } else {
        self.S('[data-orbit]', self.scope).each(function (idx, el) {
          var $el = self.S(el);
          var opts = self.data_options($el);
          var instance = $el.data(self.name + '-instance');
          instance.compute_dimensions();
        });
      }
    }
  };

}(jQuery, window, window.document));

;(function ($, window, document, undefined) {
  'use strict';

  Foundation.libs.reveal = {
    name : 'reveal',

    version : '5.5.2',

    locked : false,

    settings : {
      animation : 'fadeAndPop',
      animation_speed : 250,
      close_on_background_click : true,
      close_on_esc : true,
      dismiss_modal_class : 'close-reveal-modal',
      multiple_opened : false,
      bg_class : 'reveal-modal-bg',
      root_element : 'body',
      open : function(){},
      opened : function(){},
      close : function(){},
      closed : function(){},
      on_ajax_error: $.noop,
      bg : $('.reveal-modal-bg'),
      css : {
        open : {
          'opacity' : 0,
          'visibility' : 'visible',
          'display' : 'block'
        },
        close : {
          'opacity' : 1,
          'visibility' : 'hidden',
          'display' : 'none'
        }
      }
    },

    init : function (scope, method, options) {
      $.extend(true, this.settings, method, options);
      this.bindings(method, options);
    },

    events : function (scope) {
      var self = this,
          S = self.S;

      S(this.scope)
        .off('.reveal')
        .on('click.fndtn.reveal', '[' + this.add_namespace('data-reveal-id') + ']:not([disabled])', function (e) {
          e.preventDefault();

          if (!self.locked) {
            var element = S(this),
                ajax = element.data(self.data_attr('reveal-ajax')),
                replaceContentSel = element.data(self.data_attr('reveal-replace-content'));

            self.locked = true;

            if (typeof ajax === 'undefined') {
              self.open.call(self, element);
            } else {
              var url = ajax === true ? element.attr('href') : ajax;
              self.open.call(self, element, {url : url}, { replaceContentSel : replaceContentSel });
            }
          }
        });

      S(document)
        .on('click.fndtn.reveal', this.close_targets(), function (e) {
          e.preventDefault();
          if (!self.locked) {
            var settings = S('[' + self.attr_name() + '].open').data(self.attr_name(true) + '-init') || self.settings,
                bg_clicked = S(e.target)[0] === S('.' + settings.bg_class)[0];

            if (bg_clicked) {
              if (settings.close_on_background_click) {
                e.stopPropagation();
              } else {
                return;
              }
            }

            self.locked = true;
            self.close.call(self, bg_clicked ? S('[' + self.attr_name() + '].open:not(.toback)') : S(this).closest('[' + self.attr_name() + ']'));
          }
        });

      if (S('[' + self.attr_name() + ']', this.scope).length > 0) {
        S(this.scope)
          // .off('.reveal')
          .on('open.fndtn.reveal', this.settings.open)
          .on('opened.fndtn.reveal', this.settings.opened)
          .on('opened.fndtn.reveal', this.open_video)
          .on('close.fndtn.reveal', this.settings.close)
          .on('closed.fndtn.reveal', this.settings.closed)
          .on('closed.fndtn.reveal', this.close_video);
      } else {
        S(this.scope)
          // .off('.reveal')
          .on('open.fndtn.reveal', '[' + self.attr_name() + ']', this.settings.open)
          .on('opened.fndtn.reveal', '[' + self.attr_name() + ']', this.settings.opened)
          .on('opened.fndtn.reveal', '[' + self.attr_name() + ']', this.open_video)
          .on('close.fndtn.reveal', '[' + self.attr_name() + ']', this.settings.close)
          .on('closed.fndtn.reveal', '[' + self.attr_name() + ']', this.settings.closed)
          .on('closed.fndtn.reveal', '[' + self.attr_name() + ']', this.close_video);
      }

      return true;
    },

    // PATCH #3: turning on key up capture only when a reveal window is open
    key_up_on : function (scope) {
      var self = this;

      // PATCH #1: fixing multiple keyup event trigger from single key press
      self.S('body').off('keyup.fndtn.reveal').on('keyup.fndtn.reveal', function ( event ) {
        var open_modal = self.S('[' + self.attr_name() + '].open'),
            settings = open_modal.data(self.attr_name(true) + '-init') || self.settings ;
        // PATCH #2: making sure that the close event can be called only while unlocked,
        //           so that multiple keyup.fndtn.reveal events don't prevent clean closing of the reveal window.
        if ( settings && event.which === 27  && settings.close_on_esc && !self.locked) { // 27 is the keycode for the Escape key
          self.close.call(self, open_modal);
        }
      });

      return true;
    },

    // PATCH #3: turning on key up capture only when a reveal window is open
    key_up_off : function (scope) {
      this.S('body').off('keyup.fndtn.reveal');
      return true;
    },

    open : function (target, ajax_settings) {
      var self = this,
          modal;

      if (target) {
        if (typeof target.selector !== 'undefined') {
          // Find the named node; only use the first one found, since the rest of the code assumes there's only one node
          modal = self.S('#' + target.data(self.data_attr('reveal-id'))).first();
        } else {
          modal = self.S(this.scope);

          ajax_settings = target;
        }
      } else {
        modal = self.S(this.scope);
      }

      var settings = modal.data(self.attr_name(true) + '-init');
      settings = settings || this.settings;


      if (modal.hasClass('open') && target.attr('data-reveal-id') == modal.attr('id')) {
        return self.close(modal);
      }

      if (!modal.hasClass('open')) {
        var open_modal = self.S('[' + self.attr_name() + '].open');

        if (typeof modal.data('css-top') === 'undefined') {
          modal.data('css-top', parseInt(modal.css('top'), 10))
            .data('offset', this.cache_offset(modal));
        }

        modal.attr('tabindex','0').attr('aria-hidden','false');

        this.key_up_on(modal);    // PATCH #3: turning on key up capture only when a reveal window is open

        // Prevent namespace event from triggering twice
        modal.on('open.fndtn.reveal', function(e) {
          if (e.namespace !== 'fndtn.reveal') return;
        });

        modal.on('open.fndtn.reveal').trigger('open.fndtn.reveal');

        if (open_modal.length < 1) {
          this.toggle_bg(modal, true);
        }

        if (typeof ajax_settings === 'string') {
          ajax_settings = {
            url : ajax_settings
          };
        }

        if (typeof ajax_settings === 'undefined' || !ajax_settings.url) {
          if (open_modal.length > 0) {
            if (settings.multiple_opened) {
              self.to_back(open_modal);
            } else {
              self.hide(open_modal, settings.css.close);
            }
          }

          this.show(modal, settings.css.open);
        } else {
          var old_success = typeof ajax_settings.success !== 'undefined' ? ajax_settings.success : null;
          $.extend(ajax_settings, {
            success : function (data, textStatus, jqXHR) {
              if ( $.isFunction(old_success) ) {
                var result = old_success(data, textStatus, jqXHR);
                if (typeof result == 'string') {
                  data = result;
                }
              }

              if (typeof options !== 'undefined' && typeof options.replaceContentSel !== 'undefined') {
                modal.find(options.replaceContentSel).html(data);
              } else {
                modal.html(data);
              }

              self.S(modal).foundation('section', 'reflow');
              self.S(modal).children().foundation();

              if (open_modal.length > 0) {
                if (settings.multiple_opened) {
                  self.to_back(open_modal);
                } else {
                  self.hide(open_modal, settings.css.close);
                }
              }
              self.show(modal, settings.css.open);
            }
          });

          // check for if user initalized with error callback
          if (settings.on_ajax_error !== $.noop) {
            $.extend(ajax_settings, {
              error : settings.on_ajax_error
            });
          }

          $.ajax(ajax_settings);
        }
      }
      self.S(window).trigger('resize');
    },

    close : function (modal) {
      var modal = modal && modal.length ? modal : this.S(this.scope),
          open_modals = this.S('[' + this.attr_name() + '].open'),
          settings = modal.data(this.attr_name(true) + '-init') || this.settings,
          self = this;

      if (open_modals.length > 0) {

        modal.removeAttr('tabindex','0').attr('aria-hidden','true');

        this.locked = true;
        this.key_up_off(modal);   // PATCH #3: turning on key up capture only when a reveal window is open

        modal.trigger('close.fndtn.reveal');

        if ((settings.multiple_opened && open_modals.length === 1) || !settings.multiple_opened || modal.length > 1) {
          self.toggle_bg(modal, false);
          self.to_front(modal);
        }

        if (settings.multiple_opened) {
          self.hide(modal, settings.css.close, settings);
          self.to_front($($.makeArray(open_modals).reverse()[1]));
        } else {
          self.hide(open_modals, settings.css.close, settings);
        }
      }
    },

    close_targets : function () {
      var base = '.' + this.settings.dismiss_modal_class;

      if (this.settings.close_on_background_click) {
        return base + ', .' + this.settings.bg_class;
      }

      return base;
    },

    toggle_bg : function (modal, state) {
      if (this.S('.' + this.settings.bg_class).length === 0) {
        this.settings.bg = $('<div />', {'class': this.settings.bg_class})
          .appendTo('body').hide();
      }

      var visible = this.settings.bg.filter(':visible').length > 0;
      if ( state != visible ) {
        if ( state == undefined ? visible : !state ) {
          this.hide(this.settings.bg);
        } else {
          this.show(this.settings.bg);
        }
      }
    },

    show : function (el, css) {
      // is modal
      if (css) {
        var settings = el.data(this.attr_name(true) + '-init') || this.settings,
            root_element = settings.root_element,
            context = this;

        if (el.parent(root_element).length === 0) {
          var placeholder = el.wrap('<div style="display: none;" />').parent();

          el.on('closed.fndtn.reveal.wrapped', function () {
            el.detach().appendTo(placeholder);
            el.unwrap().unbind('closed.fndtn.reveal.wrapped');
          });

          el.detach().appendTo(root_element);
        }

        var animData = getAnimationData(settings.animation);
        if (!animData.animate) {
          this.locked = false;
        }
        if (animData.pop) {
          css.top = $(window).scrollTop() - el.data('offset') + 'px';
          var end_css = {
            top: $(window).scrollTop() + el.data('css-top') + 'px',
            opacity: 1
          };

          return setTimeout(function () {
            return el
              .css(css)
              .animate(end_css, settings.animation_speed, 'linear', function () {
                context.locked = false;
                el.trigger('opened.fndtn.reveal');
              })
              .addClass('open');
          }, settings.animation_speed / 2);
        }

        if (animData.fade) {
          css.top = $(window).scrollTop() + el.data('css-top') + 'px';
          var end_css = {opacity: 1};

          return setTimeout(function () {
            return el
              .css(css)
              .animate(end_css, settings.animation_speed, 'linear', function () {
                context.locked = false;
                el.trigger('opened.fndtn.reveal');
              })
              .addClass('open');
          }, settings.animation_speed / 2);
        }

        return el.css(css).show().css({opacity : 1}).addClass('open').trigger('opened.fndtn.reveal');
      }

      var settings = this.settings;

      // should we animate the background?
      if (getAnimationData(settings.animation).fade) {
        return el.fadeIn(settings.animation_speed / 2);
      }

      this.locked = false;

      return el.show();
    },

    to_back : function(el) {
      el.addClass('toback');
    },

    to_front : function(el) {
      el.removeClass('toback');
    },

    hide : function (el, css) {
      // is modal
      if (css) {
        var settings = el.data(this.attr_name(true) + '-init'),
            context = this;
        settings = settings || this.settings;

        var animData = getAnimationData(settings.animation);
        if (!animData.animate) {
          this.locked = false;
        }
        if (animData.pop) {
          var end_css = {
            top: - $(window).scrollTop() - el.data('offset') + 'px',
            opacity: 0
          };

          return setTimeout(function () {
            return el
              .animate(end_css, settings.animation_speed, 'linear', function () {
                context.locked = false;
                el.css(css).trigger('closed.fndtn.reveal');
              })
              .removeClass('open');
          }, settings.animation_speed / 2);
        }

        if (animData.fade) {
          var end_css = {opacity : 0};

          return setTimeout(function () {
            return el
              .animate(end_css, settings.animation_speed, 'linear', function () {
                context.locked = false;
                el.css(css).trigger('closed.fndtn.reveal');
              })
              .removeClass('open');
          }, settings.animation_speed / 2);
        }

        return el.hide().css(css).removeClass('open').trigger('closed.fndtn.reveal');
      }

      var settings = this.settings;

      // should we animate the background?
      if (getAnimationData(settings.animation).fade) {
        return el.fadeOut(settings.animation_speed / 2);
      }

      return el.hide();
    },

    close_video : function (e) {
      var video = $('.flex-video', e.target),
          iframe = $('iframe', video);

      if (iframe.length > 0) {
        iframe.attr('data-src', iframe[0].src);
        iframe.attr('src', iframe.attr('src'));
        video.hide();
      }
    },

    open_video : function (e) {
      var video = $('.flex-video', e.target),
          iframe = video.find('iframe');

      if (iframe.length > 0) {
        var data_src = iframe.attr('data-src');
        if (typeof data_src === 'string') {
          iframe[0].src = iframe.attr('data-src');
        } else {
          var src = iframe[0].src;
          iframe[0].src = undefined;
          iframe[0].src = src;
        }
        video.show();
      }
    },

    data_attr : function (str) {
      if (this.namespace.length > 0) {
        return this.namespace + '-' + str;
      }

      return str;
    },

    cache_offset : function (modal) {
      var offset = modal.show().height() + parseInt(modal.css('top'), 10) + modal.scrollY;

      modal.hide();

      return offset;
    },

    off : function () {
      $(this.scope).off('.fndtn.reveal');
    },

    reflow : function () {}
  };

  /*
   * getAnimationData('popAndFade') // {animate: true,  pop: true,  fade: true}
   * getAnimationData('fade')       // {animate: true,  pop: false, fade: true}
   * getAnimationData('pop')        // {animate: true,  pop: true,  fade: false}
   * getAnimationData('foo')        // {animate: false, pop: false, fade: false}
   * getAnimationData(null)         // {animate: false, pop: false, fade: false}
   */
  function getAnimationData(str) {
    var fade = /fade/i.test(str);
    var pop = /pop/i.test(str);
    return {
      animate : fade || pop,
      pop : pop,
      fade : fade
    };
  }
}(jQuery, window, window.document));

;(function ($, window, document, undefined) {
  'use strict';

  Foundation.libs.slider = {
    name : 'slider',

    version : '5.5.2',

    settings : {
      start : 0,
      end : 100,
      step : 1,
      precision : null,
      initial : null,
      display_selector : '',
      vertical : false,
      trigger_input_change : false,
      on_change : function () {}
    },

    cache : {},

    init : function (scope, method, options) {
      Foundation.inherit(this, 'throttle');
      this.bindings(method, options);
      this.reflow();
    },

    events : function () {
      var self = this;

      $(this.scope)
        .off('.slider')
        .on('mousedown.fndtn.slider touchstart.fndtn.slider pointerdown.fndtn.slider',
        '[' + self.attr_name() + ']:not(.disabled, [disabled]) .range-slider-handle', function (e) {
          if (!self.cache.active) {
            e.preventDefault();
            self.set_active_slider($(e.target));
          }
        })
        .on('mousemove.fndtn.slider touchmove.fndtn.slider pointermove.fndtn.slider', function (e) {
          if (!!self.cache.active) {
            e.preventDefault();
            if ($.data(self.cache.active[0], 'settings').vertical) {
              var scroll_offset = 0;
              if (!e.pageY) {
                scroll_offset = window.scrollY;
              }
              self.calculate_position(self.cache.active, self.get_cursor_position(e, 'y') + scroll_offset);
            } else {
              self.calculate_position(self.cache.active, self.get_cursor_position(e, 'x'));
            }
          }
        })
        .on('mouseup.fndtn.slider touchend.fndtn.slider pointerup.fndtn.slider', function (e) {
          self.remove_active_slider();
        })
        .on('change.fndtn.slider', function (e) {
          self.settings.on_change();
        });

      self.S(window)
        .on('resize.fndtn.slider', self.throttle(function (e) {
          self.reflow();
        }, 300));

      // update slider value as users change input value
      this.S('[' + this.attr_name() + ']').each(function () {
        var slider = $(this),
            handle = slider.children('.range-slider-handle')[0],
            settings = self.initialize_settings(handle);

        if (settings.display_selector != '') {
          $(settings.display_selector).each(function(){
            if (this.hasOwnProperty('value')) {
              $(this).change(function(){
                // is there a better way to do this?
                slider.foundation("slider", "set_value", $(this).val());
              });
            }
          });
        }
      });
    },

    get_cursor_position : function (e, xy) {
      var pageXY = 'page' + xy.toUpperCase(),
          clientXY = 'client' + xy.toUpperCase(),
          position;

      if (typeof e[pageXY] !== 'undefined') {
        position = e[pageXY];
      } else if (typeof e.originalEvent[clientXY] !== 'undefined') {
        position = e.originalEvent[clientXY];
      } else if (e.originalEvent.touches && e.originalEvent.touches[0] && typeof e.originalEvent.touches[0][clientXY] !== 'undefined') {
        position = e.originalEvent.touches[0][clientXY];
      } else if (e.currentPoint && typeof e.currentPoint[xy] !== 'undefined') {
        position = e.currentPoint[xy];
      }

      return position;
    },

    set_active_slider : function ($handle) {
      this.cache.active = $handle;
    },

    remove_active_slider : function () {
      this.cache.active = null;
    },

    calculate_position : function ($handle, cursor_x) {
      var self = this,
          settings = $.data($handle[0], 'settings'),
          handle_l = $.data($handle[0], 'handle_l'),
          handle_o = $.data($handle[0], 'handle_o'),
          bar_l = $.data($handle[0], 'bar_l'),
          bar_o = $.data($handle[0], 'bar_o');

      requestAnimationFrame(function () {
        var pct;

        if (Foundation.rtl && !settings.vertical) {
          pct = self.limit_to(((bar_o + bar_l - cursor_x) / bar_l), 0, 1);
        } else {
          pct = self.limit_to(((cursor_x - bar_o) / bar_l), 0, 1);
        }

        pct = settings.vertical ? 1 - pct : pct;

        var norm = self.normalized_value(pct, settings.start, settings.end, settings.step, settings.precision);

        self.set_ui($handle, norm);
      });
    },

    set_ui : function ($handle, value) {
      var settings = $.data($handle[0], 'settings'),
          handle_l = $.data($handle[0], 'handle_l'),
          bar_l = $.data($handle[0], 'bar_l'),
          norm_pct = this.normalized_percentage(value, settings.start, settings.end),
          handle_offset = norm_pct * (bar_l - handle_l) - 1,
          progress_bar_length = norm_pct * 100,
          $handle_parent = $handle.parent(),
          $hidden_inputs = $handle.parent().children('input[type=hidden]');

      if (Foundation.rtl && !settings.vertical) {
        handle_offset = -handle_offset;
      }

      handle_offset = settings.vertical ? -handle_offset + bar_l - handle_l + 1 : handle_offset;
      this.set_translate($handle, handle_offset, settings.vertical);

      if (settings.vertical) {
        $handle.siblings('.range-slider-active-segment').css('height', progress_bar_length + '%');
      } else {
        $handle.siblings('.range-slider-active-segment').css('width', progress_bar_length + '%');
      }

      $handle_parent.attr(this.attr_name(), value).trigger('change.fndtn.slider');

      $hidden_inputs.val(value);
      if (settings.trigger_input_change) {
          $hidden_inputs.trigger('change.fndtn.slider');
      }

      if (!$handle[0].hasAttribute('aria-valuemin')) {
        $handle.attr({
          'aria-valuemin' : settings.start,
          'aria-valuemax' : settings.end
        });
      }
      $handle.attr('aria-valuenow', value);

      if (settings.display_selector != '') {
        $(settings.display_selector).each(function () {
          if (this.hasAttribute('value')) {
            $(this).val(value);
          } else {
            $(this).text(value);
          }
        });
      }

    },

    normalized_percentage : function (val, start, end) {
      return Math.min(1, (val - start) / (end - start));
    },

    normalized_value : function (val, start, end, step, precision) {
      var range = end - start,
          point = val * range,
          mod = (point - (point % step)) / step,
          rem = point % step,
          round = ( rem >= step * 0.5 ? step : 0);
      return ((mod * step + round) + start).toFixed(precision);
    },

    set_translate : function (ele, offset, vertical) {
      if (vertical) {
        $(ele)
          .css('-webkit-transform', 'translateY(' + offset + 'px)')
          .css('-moz-transform', 'translateY(' + offset + 'px)')
          .css('-ms-transform', 'translateY(' + offset + 'px)')
          .css('-o-transform', 'translateY(' + offset + 'px)')
          .css('transform', 'translateY(' + offset + 'px)');
      } else {
        $(ele)
          .css('-webkit-transform', 'translateX(' + offset + 'px)')
          .css('-moz-transform', 'translateX(' + offset + 'px)')
          .css('-ms-transform', 'translateX(' + offset + 'px)')
          .css('-o-transform', 'translateX(' + offset + 'px)')
          .css('transform', 'translateX(' + offset + 'px)');
      }
    },

    limit_to : function (val, min, max) {
      return Math.min(Math.max(val, min), max);
    },

    initialize_settings : function (handle) {
      var settings = $.extend({}, this.settings, this.data_options($(handle).parent())),
          decimal_places_match_result;

      if (settings.precision === null) {
        decimal_places_match_result = ('' + settings.step).match(/\.([\d]*)/);
        settings.precision = decimal_places_match_result && decimal_places_match_result[1] ? decimal_places_match_result[1].length : 0;
      }

      if (settings.vertical) {
        $.data(handle, 'bar_o', $(handle).parent().offset().top);
        $.data(handle, 'bar_l', $(handle).parent().outerHeight());
        $.data(handle, 'handle_o', $(handle).offset().top);
        $.data(handle, 'handle_l', $(handle).outerHeight());
      } else {
        $.data(handle, 'bar_o', $(handle).parent().offset().left);
        $.data(handle, 'bar_l', $(handle).parent().outerWidth());
        $.data(handle, 'handle_o', $(handle).offset().left);
        $.data(handle, 'handle_l', $(handle).outerWidth());
      }

      $.data(handle, 'bar', $(handle).parent());
      return $.data(handle, 'settings', settings);
    },

    set_initial_position : function ($ele) {
      var settings = $.data($ele.children('.range-slider-handle')[0], 'settings'),
          initial = ((typeof settings.initial == 'number' && !isNaN(settings.initial)) ? settings.initial : Math.floor((settings.end - settings.start) * 0.5 / settings.step) * settings.step + settings.start),
          $handle = $ele.children('.range-slider-handle');
      this.set_ui($handle, initial);
    },

    set_value : function (value) {
      var self = this;
      $('[' + self.attr_name() + ']', this.scope).each(function () {
        $(this).attr(self.attr_name(), value);
      });
      if (!!$(this.scope).attr(self.attr_name())) {
        $(this.scope).attr(self.attr_name(), value);
      }
      self.reflow();
    },

    reflow : function () {
      var self = this;
      self.S('[' + this.attr_name() + ']').each(function () {
        var handle = $(this).children('.range-slider-handle')[0],
            val = $(this).attr(self.attr_name());
        self.initialize_settings(handle);

        if (val) {
          self.set_ui($(handle), parseFloat(val));
        } else {
          self.set_initial_position($(this));
        }
      });
    }
  };

}(jQuery, window, window.document));

;(function ($, window, document, undefined) {
  'use strict';

  Foundation.libs.tab = {
    name : 'tab',

    version : '5.5.2',

    settings : {
      active_class : 'active',
      callback : function () {},
      deep_linking : false,
      scroll_to_content : true,
      is_hover : false
    },

    default_tab_hashes : [],

    init : function (scope, method, options) {
      var self = this,
          S = this.S;

	  // Store the default active tabs which will be referenced when the
	  // location hash is absent, as in the case of navigating the tabs and
	  // returning to the first viewing via the browser Back button.
	  S('[' + this.attr_name() + '] > .active > a', this.scope).each(function () {
	    self.default_tab_hashes.push(this.hash);
	  });

      // store the initial href, which is used to allow correct behaviour of the
      // browser back button when deep linking is turned on.
      self.entry_location = window.location.href;

      this.bindings(method, options);
      this.handle_location_hash_change();
    },

    events : function () {
      var self = this,
          S = this.S;

      var usual_tab_behavior =  function (e, target) {
          var settings = S(target).closest('[' + self.attr_name() + ']').data(self.attr_name(true) + '-init');
          if (!settings.is_hover || Modernizr.touch) {
            e.preventDefault();
            e.stopPropagation();
            self.toggle_active_tab(S(target).parent());
          }
        };

      S(this.scope)
        .off('.tab')
        // Key event: focus/tab key
        .on('keydown.fndtn.tab', '[' + this.attr_name() + '] > * > a', function(e) {
          var el = this;
          var keyCode = e.keyCode || e.which;
            // if user pressed tab key
            if (keyCode == 9) { 
              e.preventDefault();
              // TODO: Change usual_tab_behavior into accessibility function?
              usual_tab_behavior(e, el);
            } 
        })
        // Click event: tab title
        .on('click.fndtn.tab', '[' + this.attr_name() + '] > * > a', function(e) {
          var el = this;
          usual_tab_behavior(e, el);
        })
        // Hover event: tab title
        .on('mouseenter.fndtn.tab', '[' + this.attr_name() + '] > * > a', function (e) {
          var settings = S(this).closest('[' + self.attr_name() + ']').data(self.attr_name(true) + '-init');
          if (settings.is_hover) {
            self.toggle_active_tab(S(this).parent());
          }
        });

      // Location hash change event
      S(window).on('hashchange.fndtn.tab', function (e) {
        e.preventDefault();
        self.handle_location_hash_change();
      });
    },

    handle_location_hash_change : function () {

      var self = this,
          S = this.S;

      S('[' + this.attr_name() + ']', this.scope).each(function () {
        var settings = S(this).data(self.attr_name(true) + '-init');
        if (settings.deep_linking) {
          // Match the location hash to a label
          var hash;
          if (settings.scroll_to_content) {
            hash = self.scope.location.hash;
          } else {
            // prefix the hash to prevent anchor scrolling
            hash = self.scope.location.hash.replace('fndtn-', '');
          }
          if (hash != '') {
            // Check whether the location hash references a tab content div or
            // another element on the page (inside or outside the tab content div)
            var hash_element = S(hash);
            if (hash_element.hasClass('content') && hash_element.parent().hasClass('tabs-content')) {
              // Tab content div
              self.toggle_active_tab($('[' + self.attr_name() + '] > * > a[href=' + hash + ']').parent());
            } else {
              // Not the tab content div. If inside the tab content, find the
              // containing tab and toggle it as active.
              var hash_tab_container_id = hash_element.closest('.content').attr('id');
              if (hash_tab_container_id != undefined) {
                self.toggle_active_tab($('[' + self.attr_name() + '] > * > a[href=#' + hash_tab_container_id + ']').parent(), hash);
              }
            }
          } else {
            // Reference the default tab hashes which were initialized in the init function
            for (var ind = 0; ind < self.default_tab_hashes.length; ind++) {
              self.toggle_active_tab($('[' + self.attr_name() + '] > * > a[href=' + self.default_tab_hashes[ind] + ']').parent());
            }
          }
        }
       });
     },

    toggle_active_tab : function (tab, location_hash) {
      var self = this,
          S = self.S,
          tabs = tab.closest('[' + this.attr_name() + ']'),
          tab_link = tab.find('a'),
          anchor = tab.children('a').first(),
          target_hash = '#' + anchor.attr('href').split('#')[1],
          target = S(target_hash),
          siblings = tab.siblings(),
          settings = tabs.data(this.attr_name(true) + '-init'),
          interpret_keyup_action = function (e) {
            // Light modification of Heydon Pickering's Practical ARIA Examples: http://heydonworks.com/practical_aria_examples/js/a11y.js

            // define current, previous and next (possible) tabs

            var $original = $(this);
            var $prev = $(this).parents('li').prev().children('[role="tab"]');
            var $next = $(this).parents('li').next().children('[role="tab"]');
            var $target;

            // find the direction (prev or next)

            switch (e.keyCode) {
              case 37:
                $target = $prev;
                break;
              case 39:
                $target = $next;
                break;
              default:
                $target = false
                  break;
            }

            if ($target.length) {
              $original.attr({
                'tabindex' : '-1',
                'aria-selected' : null
              });
              $target.attr({
                'tabindex' : '0',
                'aria-selected' : true
              }).focus();
            }

            // Hide panels

            $('[role="tabpanel"]')
              .attr('aria-hidden', 'true');

            // Show panel which corresponds to target

            $('#' + $(document.activeElement).attr('href').substring(1))
              .attr('aria-hidden', null);

          },
          go_to_hash = function(hash) {
            // This function allows correct behaviour of the browser's back button when deep linking is enabled. Without it
            // the user would get continually redirected to the default hash.
            var is_entry_location = window.location.href === self.entry_location,
                default_hash = settings.scroll_to_content ? self.default_tab_hashes[0] : is_entry_location ? window.location.hash :'fndtn-' + self.default_tab_hashes[0].replace('#', '')

            if (!(is_entry_location && hash === default_hash)) {
              window.location.hash = hash;
            }
          };

      // allow usage of data-tab-content attribute instead of href
      if (anchor.data('tab-content')) {
        target_hash = '#' + anchor.data('tab-content').split('#')[1];
        target = S(target_hash);
      }

      if (settings.deep_linking) {

        if (settings.scroll_to_content) {

          // retain current hash to scroll to content
          go_to_hash(location_hash || target_hash);

          if (location_hash == undefined || location_hash == target_hash) {
            tab.parent()[0].scrollIntoView();
          } else {
            S(target_hash)[0].scrollIntoView();
          }
        } else {
          // prefix the hashes so that the browser doesn't scroll down
          if (location_hash != undefined) {
            go_to_hash('fndtn-' + location_hash.replace('#', ''));
          } else {
            go_to_hash('fndtn-' + target_hash.replace('#', ''));
          }
        }
      }

      // WARNING: The activation and deactivation of the tab content must
      // occur after the deep linking in order to properly refresh the browser
      // window (notably in Chrome).
      // Clean up multiple attr instances to done once
      tab.addClass(settings.active_class).triggerHandler('opened');
      tab_link.attr({'aria-selected' : 'true',  tabindex : 0});
      siblings.removeClass(settings.active_class)
      siblings.find('a').attr({'aria-selected' : 'false',  tabindex : -1});
      target.siblings().removeClass(settings.active_class).attr({'aria-hidden' : 'true',  tabindex : -1});
      target.addClass(settings.active_class).attr('aria-hidden', 'false').removeAttr('tabindex');
      settings.callback(tab);
      target.triggerHandler('toggled', [target]);
      tabs.triggerHandler('toggled', [tab]);

      tab_link.off('keydown').on('keydown', interpret_keyup_action );
    },

    data_attr : function (str) {
      if (this.namespace.length > 0) {
        return this.namespace + '-' + str;
      }

      return str;
    },

    off : function () {},

    reflow : function () {}
  };
}(jQuery, window, window.document));

;(function ($, window, document, undefined) {
  'use strict';

  Foundation.libs.tooltip = {
    name : 'tooltip',

    version : '5.5.2',

    settings : {
      additional_inheritable_classes : [],
      tooltip_class : '.tooltip',
      append_to : 'body',
      touch_close_text : 'Tap To Close',
      disable_for_touch : false,
      hover_delay : 200,
      show_on : 'all',
      tip_template : function (selector, content) {
        return '<span data-selector="' + selector + '" id="' + selector + '" class="'
          + Foundation.libs.tooltip.settings.tooltip_class.substring(1)
          + '" role="tooltip">' + content + '<span class="nub"></span></span>';
      }
    },

    cache : {},

    init : function (scope, method, options) {
      Foundation.inherit(this, 'random_str');
      this.bindings(method, options);
    },

    should_show : function (target, tip) {
      var settings = $.extend({}, this.settings, this.data_options(target));

      if (settings.show_on === 'all') {
        return true;
      } else if (this.small() && settings.show_on === 'small') {
        return true;
      } else if (this.medium() && settings.show_on === 'medium') {
        return true;
      } else if (this.large() && settings.show_on === 'large') {
        return true;
      }
      return false;
    },

    medium : function () {
      return matchMedia(Foundation.media_queries['medium']).matches;
    },

    large : function () {
      return matchMedia(Foundation.media_queries['large']).matches;
    },

    events : function (instance) {
      var self = this,
          S = self.S;

      self.create(this.S(instance));

      function _startShow(elt, $this, immediate) {
        if (elt.timer) {
          return;
        }

        if (immediate) {
          elt.timer = null;
          self.showTip($this);
        } else {
          elt.timer = setTimeout(function () {
            elt.timer = null;
            self.showTip($this);
          }.bind(elt), self.settings.hover_delay);
        }
      }

      function _startHide(elt, $this) {
        if (elt.timer) {
          clearTimeout(elt.timer);
          elt.timer = null;
        }

        self.hide($this);
      }

      $(this.scope)
        .off('.tooltip')
        .on('mouseenter.fndtn.tooltip mouseleave.fndtn.tooltip touchstart.fndtn.tooltip MSPointerDown.fndtn.tooltip',
          '[' + this.attr_name() + ']', function (e) {
          var $this = S(this),
              settings = $.extend({}, self.settings, self.data_options($this)),
              is_touch = false;

          if (Modernizr.touch && /touchstart|MSPointerDown/i.test(e.type) && S(e.target).is('a')) {
            return false;
          }

          if (/mouse/i.test(e.type) && self.ie_touch(e)) {
            return false;
          }
          
          if ($this.hasClass('open')) {
            if (Modernizr.touch && /touchstart|MSPointerDown/i.test(e.type)) {
              e.preventDefault();
            }
            self.hide($this);
          } else {
            if (settings.disable_for_touch && Modernizr.touch && /touchstart|MSPointerDown/i.test(e.type)) {
              return;
            } else if (!settings.disable_for_touch && Modernizr.touch && /touchstart|MSPointerDown/i.test(e.type)) {
              e.preventDefault();
              S(settings.tooltip_class + '.open').hide();
              is_touch = true;
              // close other open tooltips on touch
              if ($('.open[' + self.attr_name() + ']').length > 0) {
               var prevOpen = S($('.open[' + self.attr_name() + ']')[0]);
               self.hide(prevOpen);
              }
            }

            if (/enter|over/i.test(e.type)) {
              _startShow(this, $this);

            } else if (e.type === 'mouseout' || e.type === 'mouseleave') {
              _startHide(this, $this);
            } else {
              _startShow(this, $this, true);
            }
          }
        })
        .on('mouseleave.fndtn.tooltip touchstart.fndtn.tooltip MSPointerDown.fndtn.tooltip', '[' + this.attr_name() + '].open', function (e) {
          if (/mouse/i.test(e.type) && self.ie_touch(e)) {
            return false;
          }

          if ($(this).data('tooltip-open-event-type') == 'touch' && e.type == 'mouseleave') {
            return;
          } else if ($(this).data('tooltip-open-event-type') == 'mouse' && /MSPointerDown|touchstart/i.test(e.type)) {
            self.convert_to_touch($(this));
          } else {
            _startHide(this, $(this));
          }
        })
        .on('DOMNodeRemoved DOMAttrModified', '[' + this.attr_name() + ']:not(a)', function (e) {
          _startHide(this, S(this));
        });
    },

    ie_touch : function (e) {
      // How do I distinguish between IE11 and Windows Phone 8?????
      return false;
    },

    showTip : function ($target) {
      var $tip = this.getTip($target);
      if (this.should_show($target, $tip)) {
        return this.show($target);
      }
      return;
    },

    getTip : function ($target) {
      var selector = this.selector($target),
          settings = $.extend({}, this.settings, this.data_options($target)),
          tip = null;

      if (selector) {
        tip = this.S('span[data-selector="' + selector + '"]' + settings.tooltip_class);
      }

      return (typeof tip === 'object') ? tip : false;
    },

    selector : function ($target) {
      var dataSelector = $target.attr(this.attr_name()) || $target.attr('data-selector');

      if (typeof dataSelector != 'string') {
        dataSelector = this.random_str(6);
        $target
          .attr('data-selector', dataSelector)
          .attr('aria-describedby', dataSelector);
      }

      return dataSelector;
    },

    create : function ($target) {
      var self = this,
          settings = $.extend({}, this.settings, this.data_options($target)),
          tip_template = this.settings.tip_template;

      if (typeof settings.tip_template === 'string' && window.hasOwnProperty(settings.tip_template)) {
        tip_template = window[settings.tip_template];
      }

      var $tip = $(tip_template(this.selector($target), $('<div></div>').html($target.attr('title')).html())),
          classes = this.inheritable_classes($target);

      $tip.addClass(classes).appendTo(settings.append_to);

      if (Modernizr.touch) {
        $tip.append('<span class="tap-to-close">' + settings.touch_close_text + '</span>');
        $tip.on('touchstart.fndtn.tooltip MSPointerDown.fndtn.tooltip', function (e) {
          self.hide($target);
        });
      }

      $target.removeAttr('title').attr('title', '');
    },

    reposition : function (target, tip, classes) {
      var width, nub, nubHeight, nubWidth, column, objPos;

      tip.css('visibility', 'hidden').show();

      width = target.data('width');
      nub = tip.children('.nub');
      nubHeight = nub.outerHeight();
      nubWidth = nub.outerHeight();

      if (this.small()) {
        tip.css({'width' : '100%'});
      } else {
        tip.css({'width' : (width) ? width : 'auto'});
      }

      objPos = function (obj, top, right, bottom, left, width) {
        return obj.css({
          'top' : (top) ? top : 'auto',
          'bottom' : (bottom) ? bottom : 'auto',
          'left' : (left) ? left : 'auto',
          'right' : (right) ? right : 'auto'
        }).end();
      };

      objPos(tip, (target.offset().top + target.outerHeight() + 10), 'auto', 'auto', target.offset().left);

      if (this.small()) {
        objPos(tip, (target.offset().top + target.outerHeight() + 10), 'auto', 'auto', 12.5, $(this.scope).width());
        tip.addClass('tip-override');
        objPos(nub, -nubHeight, 'auto', 'auto', target.offset().left);
      } else {
        var left = target.offset().left;
        if (Foundation.rtl) {
          nub.addClass('rtl');
          left = target.offset().left + target.outerWidth() - tip.outerWidth();
        }

        objPos(tip, (target.offset().top + target.outerHeight() + 10), 'auto', 'auto', left);
        // reset nub from small styles, if they've been applied
        if (nub.attr('style')) {
          nub.removeAttr('style');
        }
        
        tip.removeClass('tip-override');
        if (classes && classes.indexOf('tip-top') > -1) {
          if (Foundation.rtl) {
            nub.addClass('rtl');
          }
          objPos(tip, (target.offset().top - tip.outerHeight()), 'auto', 'auto', left)
            .removeClass('tip-override');
        } else if (classes && classes.indexOf('tip-left') > -1) {
          objPos(tip, (target.offset().top + (target.outerHeight() / 2) - (tip.outerHeight() / 2)), 'auto', 'auto', (target.offset().left - tip.outerWidth() - nubHeight))
            .removeClass('tip-override');
          nub.removeClass('rtl');
        } else if (classes && classes.indexOf('tip-right') > -1) {
          objPos(tip, (target.offset().top + (target.outerHeight() / 2) - (tip.outerHeight() / 2)), 'auto', 'auto', (target.offset().left + target.outerWidth() + nubHeight))
            .removeClass('tip-override');
          nub.removeClass('rtl');
        }
      }

      tip.css('visibility', 'visible').hide();
    },

    small : function () {
      return matchMedia(Foundation.media_queries.small).matches &&
        !matchMedia(Foundation.media_queries.medium).matches;
    },

    inheritable_classes : function ($target) {
      var settings = $.extend({}, this.settings, this.data_options($target)),
          inheritables = ['tip-top', 'tip-left', 'tip-bottom', 'tip-right', 'radius', 'round'].concat(settings.additional_inheritable_classes),
          classes = $target.attr('class'),
          filtered = classes ? $.map(classes.split(' '), function (el, i) {
            if ($.inArray(el, inheritables) !== -1) {
              return el;
            }
          }).join(' ') : '';

      return $.trim(filtered);
    },

    convert_to_touch : function ($target) {
      var self = this,
          $tip = self.getTip($target),
          settings = $.extend({}, self.settings, self.data_options($target));

      if ($tip.find('.tap-to-close').length === 0) {
        $tip.append('<span class="tap-to-close">' + settings.touch_close_text + '</span>');
        $tip.on('click.fndtn.tooltip.tapclose touchstart.fndtn.tooltip.tapclose MSPointerDown.fndtn.tooltip.tapclose', function (e) {
          self.hide($target);
        });
      }

      $target.data('tooltip-open-event-type', 'touch');
    },

    show : function ($target) {
      var $tip = this.getTip($target);

      if ($target.data('tooltip-open-event-type') == 'touch') {
        this.convert_to_touch($target);
      }

      this.reposition($target, $tip, $target.attr('class'));
      $target.addClass('open');
      $tip.fadeIn(150);
    },

    hide : function ($target) {
      var $tip = this.getTip($target);
      $tip.fadeOut(150, function () {
        $tip.find('.tap-to-close').remove();
        $tip.off('click.fndtn.tooltip.tapclose MSPointerDown.fndtn.tapclose');
        $target.removeClass('open');
      });
    },

    off : function () {
      var self = this;
      this.S(this.scope).off('.fndtn.tooltip');
      this.S(this.settings.tooltip_class).each(function (i) {
        $('[' + self.attr_name() + ']').eq(i).attr('title', $(this).text());
      }).remove();
    },

    reflow : function () {}
  };
}(jQuery, window, window.document));

;(function ($, window, document, undefined) {
  'use strict';

  Foundation.libs.topbar = {
    name : 'topbar',

    version : '5.5.2',

    settings : {
      index : 0,
      start_offset : 0,
      sticky_class : 'sticky',
      custom_back_text : true,
      back_text : 'Back',
      mobile_show_parent_link : true,
      is_hover : true,
      scrolltop : true, // jump to top when sticky nav menu toggle is clicked
      sticky_on : 'all',
      dropdown_autoclose: true
    },

    init : function (section, method, options) {
      Foundation.inherit(this, 'add_custom_rule register_media throttle');
      var self = this;

      self.register_media('topbar', 'foundation-mq-topbar');

      this.bindings(method, options);

      self.S('[' + this.attr_name() + ']', this.scope).each(function () {
        var topbar = $(this),
            settings = topbar.data(self.attr_name(true) + '-init'),
            section = self.S('section, .top-bar-section', this);
        topbar.data('index', 0);
        var topbarContainer = topbar.parent();
        if (topbarContainer.hasClass('fixed') || self.is_sticky(topbar, topbarContainer, settings) ) {
          self.settings.sticky_class = settings.sticky_class;
          self.settings.sticky_topbar = topbar;
          topbar.data('height', topbarContainer.outerHeight());
          topbar.data('stickyoffset', topbarContainer.offset().top);
        } else {
          topbar.data('height', topbar.outerHeight());
        }

        if (!settings.assembled) {
          self.assemble(topbar);
        }

        if (settings.is_hover) {
          self.S('.has-dropdown', topbar).addClass('not-click');
        } else {
          self.S('.has-dropdown', topbar).removeClass('not-click');
        }

        // Pad body when sticky (scrolled) or fixed.
        self.add_custom_rule('.f-topbar-fixed { padding-top: ' + topbar.data('height') + 'px }');

        if (topbarContainer.hasClass('fixed')) {
          self.S('body').addClass('f-topbar-fixed');
        }
      });

    },

    is_sticky : function (topbar, topbarContainer, settings) {
      var sticky     = topbarContainer.hasClass(settings.sticky_class);
      var smallMatch = matchMedia(Foundation.media_queries.small).matches;
      var medMatch   = matchMedia(Foundation.media_queries.medium).matches;
      var lrgMatch   = matchMedia(Foundation.media_queries.large).matches;

      if (sticky && settings.sticky_on === 'all') {
        return true;
      }
      if (sticky && this.small() && settings.sticky_on.indexOf('small') !== -1) {
        if (smallMatch && !medMatch && !lrgMatch) { return true; }
      }
      if (sticky && this.medium() && settings.sticky_on.indexOf('medium') !== -1) {
        if (smallMatch && medMatch && !lrgMatch) { return true; }
      }
      if (sticky && this.large() && settings.sticky_on.indexOf('large') !== -1) {
        if (smallMatch && medMatch && lrgMatch) { return true; }
      }

       return false;
    },

    toggle : function (toggleEl) {
      var self = this,
          topbar;

      if (toggleEl) {
        topbar = self.S(toggleEl).closest('[' + this.attr_name() + ']');
      } else {
        topbar = self.S('[' + this.attr_name() + ']');
      }

      var settings = topbar.data(this.attr_name(true) + '-init');

      var section = self.S('section, .top-bar-section', topbar);

      if (self.breakpoint()) {
        if (!self.rtl) {
          section.css({left : '0%'});
          $('>.name', section).css({left : '100%'});
        } else {
          section.css({right : '0%'});
          $('>.name', section).css({right : '100%'});
        }

        self.S('li.moved', section).removeClass('moved');
        topbar.data('index', 0);

        topbar
          .toggleClass('expanded')
          .css('height', '');
      }

      if (settings.scrolltop) {
        if (!topbar.hasClass('expanded')) {
          if (topbar.hasClass('fixed')) {
            topbar.parent().addClass('fixed');
            topbar.removeClass('fixed');
            self.S('body').addClass('f-topbar-fixed');
          }
        } else if (topbar.parent().hasClass('fixed')) {
          if (settings.scrolltop) {
            topbar.parent().removeClass('fixed');
            topbar.addClass('fixed');
            self.S('body').removeClass('f-topbar-fixed');

            window.scrollTo(0, 0);
          } else {
            topbar.parent().removeClass('expanded');
          }
        }
      } else {
        if (self.is_sticky(topbar, topbar.parent(), settings)) {
          topbar.parent().addClass('fixed');
        }

        if (topbar.parent().hasClass('fixed')) {
          if (!topbar.hasClass('expanded')) {
            topbar.removeClass('fixed');
            topbar.parent().removeClass('expanded');
            self.update_sticky_positioning();
          } else {
            topbar.addClass('fixed');
            topbar.parent().addClass('expanded');
            self.S('body').addClass('f-topbar-fixed');
          }
        }
      }
    },

    timer : null,

    events : function (bar) {
      var self = this,
          S = this.S;

      S(this.scope)
        .off('.topbar')
        .on('click.fndtn.topbar', '[' + this.attr_name() + '] .toggle-topbar', function (e) {
          e.preventDefault();
          self.toggle(this);
        })
        .on('click.fndtn.topbar contextmenu.fndtn.topbar', '.top-bar .top-bar-section li a[href^="#"],[' + this.attr_name() + '] .top-bar-section li a[href^="#"]', function (e) {
            var li = $(this).closest('li'),
                topbar = li.closest('[' + self.attr_name() + ']'),
                settings = topbar.data(self.attr_name(true) + '-init');

            if (settings.dropdown_autoclose && settings.is_hover) {
              var hoverLi = $(this).closest('.hover');
              hoverLi.removeClass('hover');
            }
            if (self.breakpoint() && !li.hasClass('back') && !li.hasClass('has-dropdown')) {
              self.toggle();
            }

        })
        .on('click.fndtn.topbar', '[' + this.attr_name() + '] li.has-dropdown', function (e) {
          var li = S(this),
              target = S(e.target),
              topbar = li.closest('[' + self.attr_name() + ']'),
              settings = topbar.data(self.attr_name(true) + '-init');

          if (target.data('revealId')) {
            self.toggle();
            return;
          }

          if (self.breakpoint()) {
            return;
          }

          if (settings.is_hover && !Modernizr.touch) {
            return;
          }

          e.stopImmediatePropagation();

          if (li.hasClass('hover')) {
            li
              .removeClass('hover')
              .find('li')
              .removeClass('hover');

            li.parents('li.hover')
              .removeClass('hover');
          } else {
            li.addClass('hover');

            $(li).siblings().removeClass('hover');

            if (target[0].nodeName === 'A' && target.parent().hasClass('has-dropdown')) {
              e.preventDefault();
            }
          }
        })
        .on('click.fndtn.topbar', '[' + this.attr_name() + '] .has-dropdown>a', function (e) {
          if (self.breakpoint()) {

            e.preventDefault();

            var $this = S(this),
                topbar = $this.closest('[' + self.attr_name() + ']'),
                section = topbar.find('section, .top-bar-section'),
                dropdownHeight = $this.next('.dropdown').outerHeight(),
                $selectedLi = $this.closest('li');

            topbar.data('index', topbar.data('index') + 1);
            $selectedLi.addClass('moved');

            if (!self.rtl) {
              section.css({left : -(100 * topbar.data('index')) + '%'});
              section.find('>.name').css({left : 100 * topbar.data('index') + '%'});
            } else {
              section.css({right : -(100 * topbar.data('index')) + '%'});
              section.find('>.name').css({right : 100 * topbar.data('index') + '%'});
            }

            topbar.css('height', $this.siblings('ul').outerHeight(true) + topbar.data('height'));
          }
        });

      S(window).off('.topbar').on('resize.fndtn.topbar', self.throttle(function () {
          self.resize.call(self);
      }, 50)).trigger('resize.fndtn.topbar').load(function () {
          // Ensure that the offset is calculated after all of the pages resources have loaded
          S(this).trigger('resize.fndtn.topbar');
      });

      S('body').off('.topbar').on('click.fndtn.topbar', function (e) {
        var parent = S(e.target).closest('li').closest('li.hover');

        if (parent.length > 0) {
          return;
        }

        S('[' + self.attr_name() + '] li.hover').removeClass('hover');
      });

      // Go up a level on Click
      S(this.scope).on('click.fndtn.topbar', '[' + this.attr_name() + '] .has-dropdown .back', function (e) {
        e.preventDefault();

        var $this = S(this),
            topbar = $this.closest('[' + self.attr_name() + ']'),
            section = topbar.find('section, .top-bar-section'),
            settings = topbar.data(self.attr_name(true) + '-init'),
            $movedLi = $this.closest('li.moved'),
            $previousLevelUl = $movedLi.parent();

        topbar.data('index', topbar.data('index') - 1);

        if (!self.rtl) {
          section.css({left : -(100 * topbar.data('index')) + '%'});
          section.find('>.name').css({left : 100 * topbar.data('index') + '%'});
        } else {
          section.css({right : -(100 * topbar.data('index')) + '%'});
          section.find('>.name').css({right : 100 * topbar.data('index') + '%'});
        }

        if (topbar.data('index') === 0) {
          topbar.css('height', '');
        } else {
          topbar.css('height', $previousLevelUl.outerHeight(true) + topbar.data('height'));
        }

        setTimeout(function () {
          $movedLi.removeClass('moved');
        }, 300);
      });

      // Show dropdown menus when their items are focused
      S(this.scope).find('.dropdown a')
        .focus(function () {
          $(this).parents('.has-dropdown').addClass('hover');
        })
        .blur(function () {
          $(this).parents('.has-dropdown').removeClass('hover');
        });
    },

    resize : function () {
      var self = this;
      self.S('[' + this.attr_name() + ']').each(function () {
        var topbar = self.S(this),
            settings = topbar.data(self.attr_name(true) + '-init');

        var stickyContainer = topbar.parent('.' + self.settings.sticky_class);
        var stickyOffset;

        if (!self.breakpoint()) {
          var doToggle = topbar.hasClass('expanded');
          topbar
            .css('height', '')
            .removeClass('expanded')
            .find('li')
            .removeClass('hover');

            if (doToggle) {
              self.toggle(topbar);
            }
        }

        if (self.is_sticky(topbar, stickyContainer, settings)) {
          if (stickyContainer.hasClass('fixed')) {
            // Remove the fixed to allow for correct calculation of the offset.
            stickyContainer.removeClass('fixed');

            stickyOffset = stickyContainer.offset().top;
            if (self.S(document.body).hasClass('f-topbar-fixed')) {
              stickyOffset -= topbar.data('height');
            }

            topbar.data('stickyoffset', stickyOffset);
            stickyContainer.addClass('fixed');
          } else {
            stickyOffset = stickyContainer.offset().top;
            topbar.data('stickyoffset', stickyOffset);
          }
        }

      });
    },

    breakpoint : function () {
      return !matchMedia(Foundation.media_queries['topbar']).matches;
    },

    small : function () {
      return matchMedia(Foundation.media_queries['small']).matches;
    },

    medium : function () {
      return matchMedia(Foundation.media_queries['medium']).matches;
    },

    large : function () {
      return matchMedia(Foundation.media_queries['large']).matches;
    },

    assemble : function (topbar) {
      var self = this,
          settings = topbar.data(this.attr_name(true) + '-init'),
          section = self.S('section, .top-bar-section', topbar);

      // Pull element out of the DOM for manipulation
      section.detach();

      self.S('.has-dropdown>a', section).each(function () {
        var $link = self.S(this),
            $dropdown = $link.siblings('.dropdown'),
            url = $link.attr('href'),
            $titleLi;

        if (!$dropdown.find('.title.back').length) {

          if (settings.mobile_show_parent_link == true && url) {
            $titleLi = $('<li class="title back js-generated"><h5><a href="javascript:void(0)"></a></h5></li><li class="parent-link hide-for-medium-up"><a class="parent-link js-generated" href="' + url + '">' + $link.html() +'</a></li>');
          } else {
            $titleLi = $('<li class="title back js-generated"><h5><a href="javascript:void(0)"></a></h5>');
          }

          // Copy link to subnav
          if (settings.custom_back_text == true) {
            $('h5>a', $titleLi).html(settings.back_text);
          } else {
            $('h5>a', $titleLi).html('&laquo; ' + $link.html());
          }
          $dropdown.prepend($titleLi);
        }
      });

      // Put element back in the DOM
      section.appendTo(topbar);

      // check for sticky
      this.sticky();

      this.assembled(topbar);
    },

    assembled : function (topbar) {
      topbar.data(this.attr_name(true), $.extend({}, topbar.data(this.attr_name(true)), {assembled : true}));
    },

    height : function (ul) {
      var total = 0,
          self = this;

      $('> li', ul).each(function () {
        total += self.S(this).outerHeight(true);
      });

      return total;
    },

    sticky : function () {
      var self = this;

      this.S(window).on('scroll', function () {
        self.update_sticky_positioning();
      });
    },

    update_sticky_positioning : function () {
      var klass = '.' + this.settings.sticky_class,
          $window = this.S(window),
          self = this;

      if (self.settings.sticky_topbar && self.is_sticky(this.settings.sticky_topbar,this.settings.sticky_topbar.parent(), this.settings)) {
        var distance = this.settings.sticky_topbar.data('stickyoffset') + this.settings.start_offset;
        if (!self.S(klass).hasClass('expanded')) {
          if ($window.scrollTop() > (distance)) {
            if (!self.S(klass).hasClass('fixed')) {
              self.S(klass).addClass('fixed');
              self.S('body').addClass('f-topbar-fixed');
            }
          } else if ($window.scrollTop() <= distance) {
            if (self.S(klass).hasClass('fixed')) {
              self.S(klass).removeClass('fixed');
              self.S('body').removeClass('f-topbar-fixed');
            }
          }
        }
      }
    },

    off : function () {
      this.S(this.scope).off('.fndtn.topbar');
      this.S(window).off('.fndtn.topbar');
    },

    reflow : function () {}
  };
}(jQuery, window, window.document));

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiIiwic291cmNlcyI6WyJmb3VuZGF0aW9uL2pzL2ZvdW5kYXRpb24uanMiXSwic291cmNlc0NvbnRlbnQiOlsiLypcbiAqIEZvdW5kYXRpb24gUmVzcG9uc2l2ZSBMaWJyYXJ5XG4gKiBodHRwOi8vZm91bmRhdGlvbi56dXJiLmNvbVxuICogQ29weXJpZ2h0IDIwMTQsIFpVUkJcbiAqIEZyZWUgdG8gdXNlIHVuZGVyIHRoZSBNSVQgbGljZW5zZS5cbiAqIGh0dHA6Ly93d3cub3BlbnNvdXJjZS5vcmcvbGljZW5zZXMvbWl0LWxpY2Vuc2UucGhwXG4qL1xuXG4oZnVuY3Rpb24gKCQsIHdpbmRvdywgZG9jdW1lbnQsIHVuZGVmaW5lZCkge1xuICAndXNlIHN0cmljdCc7XG5cbiAgdmFyIGhlYWRlcl9oZWxwZXJzID0gZnVuY3Rpb24gKGNsYXNzX2FycmF5KSB7XG4gICAgdmFyIGkgPSBjbGFzc19hcnJheS5sZW5ndGg7XG4gICAgdmFyIGhlYWQgPSAkKCdoZWFkJyk7XG5cbiAgICB3aGlsZSAoaS0tKSB7XG4gICAgICBpZiAoaGVhZC5oYXMoJy4nICsgY2xhc3NfYXJyYXlbaV0pLmxlbmd0aCA9PT0gMCkge1xuICAgICAgICBoZWFkLmFwcGVuZCgnPG1ldGEgY2xhc3M9XCInICsgY2xhc3NfYXJyYXlbaV0gKyAnXCIgLz4nKTtcbiAgICAgIH1cbiAgICB9XG4gIH07XG5cbiAgaGVhZGVyX2hlbHBlcnMoW1xuICAgICdmb3VuZGF0aW9uLW1xLXNtYWxsJyxcbiAgICAnZm91bmRhdGlvbi1tcS1zbWFsbC1vbmx5JyxcbiAgICAnZm91bmRhdGlvbi1tcS1tZWRpdW0nLFxuICAgICdmb3VuZGF0aW9uLW1xLW1lZGl1bS1vbmx5JyxcbiAgICAnZm91bmRhdGlvbi1tcS1sYXJnZScsXG4gICAgJ2ZvdW5kYXRpb24tbXEtbGFyZ2Utb25seScsXG4gICAgJ2ZvdW5kYXRpb24tbXEteGxhcmdlJyxcbiAgICAnZm91bmRhdGlvbi1tcS14bGFyZ2Utb25seScsXG4gICAgJ2ZvdW5kYXRpb24tbXEteHhsYXJnZScsXG4gICAgJ2ZvdW5kYXRpb24tZGF0YS1hdHRyaWJ1dGUtbmFtZXNwYWNlJ10pO1xuXG4gIC8vIEVuYWJsZSBGYXN0Q2xpY2sgaWYgcHJlc2VudFxuXG4gICQoZnVuY3Rpb24gKCkge1xuICAgIGlmICh0eXBlb2YgRmFzdENsaWNrICE9PSAndW5kZWZpbmVkJykge1xuICAgICAgLy8gRG9uJ3QgYXR0YWNoIHRvIGJvZHkgaWYgdW5kZWZpbmVkXG4gICAgICBpZiAodHlwZW9mIGRvY3VtZW50LmJvZHkgIT09ICd1bmRlZmluZWQnKSB7XG4gICAgICAgIEZhc3RDbGljay5hdHRhY2goZG9jdW1lbnQuYm9keSk7XG4gICAgICB9XG4gICAgfVxuICB9KTtcblxuICAvLyBwcml2YXRlIEZhc3QgU2VsZWN0b3Igd3JhcHBlcixcbiAgLy8gcmV0dXJucyBqUXVlcnkgb2JqZWN0LiBPbmx5IHVzZSB3aGVyZVxuICAvLyBnZXRFbGVtZW50QnlJZCBpcyBub3QgYXZhaWxhYmxlLlxuICB2YXIgUyA9IGZ1bmN0aW9uIChzZWxlY3RvciwgY29udGV4dCkge1xuICAgIGlmICh0eXBlb2Ygc2VsZWN0b3IgPT09ICdzdHJpbmcnKSB7XG4gICAgICBpZiAoY29udGV4dCkge1xuICAgICAgICB2YXIgY29udDtcbiAgICAgICAgaWYgKGNvbnRleHQuanF1ZXJ5KSB7XG4gICAgICAgICAgY29udCA9IGNvbnRleHRbMF07XG4gICAgICAgICAgaWYgKCFjb250KSB7XG4gICAgICAgICAgICByZXR1cm4gY29udGV4dDtcbiAgICAgICAgICB9XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgY29udCA9IGNvbnRleHQ7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuICQoY29udC5xdWVyeVNlbGVjdG9yQWxsKHNlbGVjdG9yKSk7XG4gICAgICB9XG5cbiAgICAgIHJldHVybiAkKGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoc2VsZWN0b3IpKTtcbiAgICB9XG5cbiAgICByZXR1cm4gJChzZWxlY3RvciwgY29udGV4dCk7XG4gIH07XG5cbiAgLy8gTmFtZXNwYWNlIGZ1bmN0aW9ucy5cblxuICB2YXIgYXR0cl9uYW1lID0gZnVuY3Rpb24gKGluaXQpIHtcbiAgICB2YXIgYXJyID0gW107XG4gICAgaWYgKCFpbml0KSB7XG4gICAgICBhcnIucHVzaCgnZGF0YScpO1xuICAgIH1cbiAgICBpZiAodGhpcy5uYW1lc3BhY2UubGVuZ3RoID4gMCkge1xuICAgICAgYXJyLnB1c2godGhpcy5uYW1lc3BhY2UpO1xuICAgIH1cbiAgICBhcnIucHVzaCh0aGlzLm5hbWUpO1xuXG4gICAgcmV0dXJuIGFyci5qb2luKCctJyk7XG4gIH07XG5cbiAgdmFyIGFkZF9uYW1lc3BhY2UgPSBmdW5jdGlvbiAoc3RyKSB7XG4gICAgdmFyIHBhcnRzID0gc3RyLnNwbGl0KCctJyksXG4gICAgICAgIGkgPSBwYXJ0cy5sZW5ndGgsXG4gICAgICAgIGFyciA9IFtdO1xuXG4gICAgd2hpbGUgKGktLSkge1xuICAgICAgaWYgKGkgIT09IDApIHtcbiAgICAgICAgYXJyLnB1c2gocGFydHNbaV0pO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgaWYgKHRoaXMubmFtZXNwYWNlLmxlbmd0aCA+IDApIHtcbiAgICAgICAgICBhcnIucHVzaCh0aGlzLm5hbWVzcGFjZSwgcGFydHNbaV0pO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIGFyci5wdXNoKHBhcnRzW2ldKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cblxuICAgIHJldHVybiBhcnIucmV2ZXJzZSgpLmpvaW4oJy0nKTtcbiAgfTtcblxuICAvLyBFdmVudCBiaW5kaW5nIGFuZCBkYXRhLW9wdGlvbnMgdXBkYXRpbmcuXG5cbiAgdmFyIGJpbmRpbmdzID0gZnVuY3Rpb24gKG1ldGhvZCwgb3B0aW9ucykge1xuICAgIHZhciBzZWxmID0gdGhpcyxcbiAgICAgICAgYmluZCA9IGZ1bmN0aW9uKCl7XG4gICAgICAgICAgdmFyICR0aGlzID0gUyh0aGlzKSxcbiAgICAgICAgICAgICAgc2hvdWxkX2JpbmRfZXZlbnRzID0gISR0aGlzLmRhdGEoc2VsZi5hdHRyX25hbWUodHJ1ZSkgKyAnLWluaXQnKTtcbiAgICAgICAgICAkdGhpcy5kYXRhKHNlbGYuYXR0cl9uYW1lKHRydWUpICsgJy1pbml0JywgJC5leHRlbmQoe30sIHNlbGYuc2V0dGluZ3MsIChvcHRpb25zIHx8IG1ldGhvZCksIHNlbGYuZGF0YV9vcHRpb25zKCR0aGlzKSkpO1xuXG4gICAgICAgICAgaWYgKHNob3VsZF9iaW5kX2V2ZW50cykge1xuICAgICAgICAgICAgc2VsZi5ldmVudHModGhpcyk7XG4gICAgICAgICAgfVxuICAgICAgICB9O1xuXG4gICAgaWYgKFModGhpcy5zY29wZSkuaXMoJ1snICsgdGhpcy5hdHRyX25hbWUoKSArJ10nKSkge1xuICAgICAgYmluZC5jYWxsKHRoaXMuc2NvcGUpO1xuICAgIH0gZWxzZSB7XG4gICAgICBTKCdbJyArIHRoaXMuYXR0cl9uYW1lKCkgKyddJywgdGhpcy5zY29wZSkuZWFjaChiaW5kKTtcbiAgICB9XG4gICAgLy8gIyBQYXRjaCB0byBmaXggIzUwNDMgdG8gbW92ZSB0aGlzICphZnRlciogdGhlIGlmL2Vsc2UgY2xhdXNlIGluIG9yZGVyIGZvciBCYWNrYm9uZSBhbmQgc2ltaWxhciBmcmFtZXdvcmtzIHRvIGhhdmUgaW1wcm92ZWQgY29udHJvbCBvdmVyIGV2ZW50IGJpbmRpbmcgYW5kIGRhdGEtb3B0aW9ucyB1cGRhdGluZy5cbiAgICBpZiAodHlwZW9mIG1ldGhvZCA9PT0gJ3N0cmluZycpIHtcbiAgICAgIHJldHVybiB0aGlzW21ldGhvZF0uY2FsbCh0aGlzLCBvcHRpb25zKTtcbiAgICB9XG5cbiAgfTtcblxuICB2YXIgc2luZ2xlX2ltYWdlX2xvYWRlZCA9IGZ1bmN0aW9uIChpbWFnZSwgY2FsbGJhY2spIHtcbiAgICBmdW5jdGlvbiBsb2FkZWQgKCkge1xuICAgICAgY2FsbGJhY2soaW1hZ2VbMF0pO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIGJpbmRMb2FkICgpIHtcbiAgICAgIHRoaXMub25lKCdsb2FkJywgbG9hZGVkKTtcblxuICAgICAgaWYgKC9NU0lFIChcXGQrXFwuXFxkKyk7Ly50ZXN0KG5hdmlnYXRvci51c2VyQWdlbnQpKSB7XG4gICAgICAgIHZhciBzcmMgPSB0aGlzLmF0dHIoICdzcmMnICksXG4gICAgICAgICAgICBwYXJhbSA9IHNyYy5tYXRjaCggL1xcPy8gKSA/ICcmJyA6ICc/JztcblxuICAgICAgICBwYXJhbSArPSAncmFuZG9tPScgKyAobmV3IERhdGUoKSkuZ2V0VGltZSgpO1xuICAgICAgICB0aGlzLmF0dHIoJ3NyYycsIHNyYyArIHBhcmFtKTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICBpZiAoIWltYWdlLmF0dHIoJ3NyYycpKSB7XG4gICAgICBsb2FkZWQoKTtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBpZiAoaW1hZ2VbMF0uY29tcGxldGUgfHwgaW1hZ2VbMF0ucmVhZHlTdGF0ZSA9PT0gNCkge1xuICAgICAgbG9hZGVkKCk7XG4gICAgfSBlbHNlIHtcbiAgICAgIGJpbmRMb2FkLmNhbGwoaW1hZ2UpO1xuICAgIH1cbiAgfTtcblxuICAvKiEgbWF0Y2hNZWRpYSgpIHBvbHlmaWxsIC0gVGVzdCBhIENTUyBtZWRpYSB0eXBlL3F1ZXJ5IGluIEpTLiBBdXRob3JzICYgY29weXJpZ2h0IChjKSAyMDEyOiBTY290dCBKZWhsLCBQYXVsIElyaXNoLCBOaWNob2xhcyBaYWthcywgRGF2aWQgS25pZ2h0LiBEdWFsIE1JVC9CU0QgbGljZW5zZSAqL1xuXG4gIHdpbmRvdy5tYXRjaE1lZGlhIHx8ICh3aW5kb3cubWF0Y2hNZWRpYSA9IGZ1bmN0aW9uKCkge1xuICAgICAgXCJ1c2Ugc3RyaWN0XCI7XG5cbiAgICAgIC8vIEZvciBicm93c2VycyB0aGF0IHN1cHBvcnQgbWF0Y2hNZWRpdW0gYXBpIHN1Y2ggYXMgSUUgOSBhbmQgd2Via2l0XG4gICAgICB2YXIgc3R5bGVNZWRpYSA9ICh3aW5kb3cuc3R5bGVNZWRpYSB8fCB3aW5kb3cubWVkaWEpO1xuXG4gICAgICAvLyBGb3IgdGhvc2UgdGhhdCBkb24ndCBzdXBwb3J0IG1hdGNoTWVkaXVtXG4gICAgICBpZiAoIXN0eWxlTWVkaWEpIHtcbiAgICAgICAgICB2YXIgc3R5bGUgICAgICAgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdzdHlsZScpLFxuICAgICAgICAgICAgICBzY3JpcHQgICAgICA9IGRvY3VtZW50LmdldEVsZW1lbnRzQnlUYWdOYW1lKCdzY3JpcHQnKVswXSxcbiAgICAgICAgICAgICAgaW5mbyAgICAgICAgPSBudWxsO1xuXG4gICAgICAgICAgc3R5bGUudHlwZSAgPSAndGV4dC9jc3MnO1xuICAgICAgICAgIHN0eWxlLmlkICAgID0gJ21hdGNobWVkaWFqcy10ZXN0JztcblxuICAgICAgICAgIHNjcmlwdC5wYXJlbnROb2RlLmluc2VydEJlZm9yZShzdHlsZSwgc2NyaXB0KTtcblxuICAgICAgICAgIC8vICdzdHlsZS5jdXJyZW50U3R5bGUnIGlzIHVzZWQgYnkgSUUgPD0gOCBhbmQgJ3dpbmRvdy5nZXRDb21wdXRlZFN0eWxlJyBmb3IgYWxsIG90aGVyIGJyb3dzZXJzXG4gICAgICAgICAgaW5mbyA9ICgnZ2V0Q29tcHV0ZWRTdHlsZScgaW4gd2luZG93KSAmJiB3aW5kb3cuZ2V0Q29tcHV0ZWRTdHlsZShzdHlsZSwgbnVsbCkgfHwgc3R5bGUuY3VycmVudFN0eWxlO1xuXG4gICAgICAgICAgc3R5bGVNZWRpYSA9IHtcbiAgICAgICAgICAgICAgbWF0Y2hNZWRpdW06IGZ1bmN0aW9uKG1lZGlhKSB7XG4gICAgICAgICAgICAgICAgICB2YXIgdGV4dCA9ICdAbWVkaWEgJyArIG1lZGlhICsgJ3sgI21hdGNobWVkaWFqcy10ZXN0IHsgd2lkdGg6IDFweDsgfSB9JztcblxuICAgICAgICAgICAgICAgICAgLy8gJ3N0eWxlLnN0eWxlU2hlZXQnIGlzIHVzZWQgYnkgSUUgPD0gOCBhbmQgJ3N0eWxlLnRleHRDb250ZW50JyBmb3IgYWxsIG90aGVyIGJyb3dzZXJzXG4gICAgICAgICAgICAgICAgICBpZiAoc3R5bGUuc3R5bGVTaGVldCkge1xuICAgICAgICAgICAgICAgICAgICAgIHN0eWxlLnN0eWxlU2hlZXQuY3NzVGV4dCA9IHRleHQ7XG4gICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgIHN0eWxlLnRleHRDb250ZW50ID0gdGV4dDtcbiAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgICAgLy8gVGVzdCBpZiBtZWRpYSBxdWVyeSBpcyB0cnVlIG9yIGZhbHNlXG4gICAgICAgICAgICAgICAgICByZXR1cm4gaW5mby53aWR0aCA9PT0gJzFweCc7XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICB9O1xuICAgICAgfVxuXG4gICAgICByZXR1cm4gZnVuY3Rpb24obWVkaWEpIHtcbiAgICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgICBtYXRjaGVzOiBzdHlsZU1lZGlhLm1hdGNoTWVkaXVtKG1lZGlhIHx8ICdhbGwnKSxcbiAgICAgICAgICAgICAgbWVkaWE6IG1lZGlhIHx8ICdhbGwnXG4gICAgICAgICAgfTtcbiAgICAgIH07XG4gIH0oKSk7XG5cbiAgLypcbiAgICoganF1ZXJ5LnJlcXVlc3RBbmltYXRpb25GcmFtZVxuICAgKiBodHRwczovL2dpdGh1Yi5jb20vZ25hcmYzNy9qcXVlcnktcmVxdWVzdEFuaW1hdGlvbkZyYW1lXG4gICAqIFJlcXVpcmVzIGpRdWVyeSAxLjgrXG4gICAqXG4gICAqIENvcHlyaWdodCAoYykgMjAxMiBDb3JleSBGcmFuZ1xuICAgKiBMaWNlbnNlZCB1bmRlciB0aGUgTUlUIGxpY2Vuc2UuXG4gICAqL1xuXG4gIChmdW5jdGlvbihqUXVlcnkpIHtcblxuXG4gIC8vIHJlcXVlc3RBbmltYXRpb25GcmFtZSBwb2x5ZmlsbCBhZGFwdGVkIGZyb20gRXJpayBNw7ZsbGVyXG4gIC8vIGZpeGVzIGZyb20gUGF1bCBJcmlzaCBhbmQgVGlubyBaaWpkZWxcbiAgLy8gaHR0cDovL3BhdWxpcmlzaC5jb20vMjAxMS9yZXF1ZXN0YW5pbWF0aW9uZnJhbWUtZm9yLXNtYXJ0LWFuaW1hdGluZy9cbiAgLy8gaHR0cDovL215Lm9wZXJhLmNvbS9lbW9sbGVyL2Jsb2cvMjAxMS8xMi8yMC9yZXF1ZXN0YW5pbWF0aW9uZnJhbWUtZm9yLXNtYXJ0LWVyLWFuaW1hdGluZ1xuXG4gIHZhciBhbmltYXRpbmcsXG4gICAgICBsYXN0VGltZSA9IDAsXG4gICAgICB2ZW5kb3JzID0gWyd3ZWJraXQnLCAnbW96J10sXG4gICAgICByZXF1ZXN0QW5pbWF0aW9uRnJhbWUgPSB3aW5kb3cucmVxdWVzdEFuaW1hdGlvbkZyYW1lLFxuICAgICAgY2FuY2VsQW5pbWF0aW9uRnJhbWUgPSB3aW5kb3cuY2FuY2VsQW5pbWF0aW9uRnJhbWUsXG4gICAgICBqcXVlcnlGeEF2YWlsYWJsZSA9ICd1bmRlZmluZWQnICE9PSB0eXBlb2YgalF1ZXJ5LmZ4O1xuXG4gIGZvciAoOyBsYXN0VGltZSA8IHZlbmRvcnMubGVuZ3RoICYmICFyZXF1ZXN0QW5pbWF0aW9uRnJhbWU7IGxhc3RUaW1lKyspIHtcbiAgICByZXF1ZXN0QW5pbWF0aW9uRnJhbWUgPSB3aW5kb3dbIHZlbmRvcnNbbGFzdFRpbWVdICsgJ1JlcXVlc3RBbmltYXRpb25GcmFtZScgXTtcbiAgICBjYW5jZWxBbmltYXRpb25GcmFtZSA9IGNhbmNlbEFuaW1hdGlvbkZyYW1lIHx8XG4gICAgICB3aW5kb3dbIHZlbmRvcnNbbGFzdFRpbWVdICsgJ0NhbmNlbEFuaW1hdGlvbkZyYW1lJyBdIHx8XG4gICAgICB3aW5kb3dbIHZlbmRvcnNbbGFzdFRpbWVdICsgJ0NhbmNlbFJlcXVlc3RBbmltYXRpb25GcmFtZScgXTtcbiAgfVxuXG4gIGZ1bmN0aW9uIHJhZigpIHtcbiAgICBpZiAoYW5pbWF0aW5nKSB7XG4gICAgICByZXF1ZXN0QW5pbWF0aW9uRnJhbWUocmFmKTtcblxuICAgICAgaWYgKGpxdWVyeUZ4QXZhaWxhYmxlKSB7XG4gICAgICAgIGpRdWVyeS5meC50aWNrKCk7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgaWYgKHJlcXVlc3RBbmltYXRpb25GcmFtZSkge1xuICAgIC8vIHVzZSByQUZcbiAgICB3aW5kb3cucmVxdWVzdEFuaW1hdGlvbkZyYW1lID0gcmVxdWVzdEFuaW1hdGlvbkZyYW1lO1xuICAgIHdpbmRvdy5jYW5jZWxBbmltYXRpb25GcmFtZSA9IGNhbmNlbEFuaW1hdGlvbkZyYW1lO1xuXG4gICAgaWYgKGpxdWVyeUZ4QXZhaWxhYmxlKSB7XG4gICAgICBqUXVlcnkuZngudGltZXIgPSBmdW5jdGlvbiAodGltZXIpIHtcbiAgICAgICAgaWYgKHRpbWVyKCkgJiYgalF1ZXJ5LnRpbWVycy5wdXNoKHRpbWVyKSAmJiAhYW5pbWF0aW5nKSB7XG4gICAgICAgICAgYW5pbWF0aW5nID0gdHJ1ZTtcbiAgICAgICAgICByYWYoKTtcbiAgICAgICAgfVxuICAgICAgfTtcblxuICAgICAgalF1ZXJ5LmZ4LnN0b3AgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIGFuaW1hdGluZyA9IGZhbHNlO1xuICAgICAgfTtcbiAgICB9XG4gIH0gZWxzZSB7XG4gICAgLy8gcG9seWZpbGxcbiAgICB3aW5kb3cucmVxdWVzdEFuaW1hdGlvbkZyYW1lID0gZnVuY3Rpb24gKGNhbGxiYWNrKSB7XG4gICAgICB2YXIgY3VyclRpbWUgPSBuZXcgRGF0ZSgpLmdldFRpbWUoKSxcbiAgICAgICAgdGltZVRvQ2FsbCA9IE1hdGgubWF4KDAsIDE2IC0gKGN1cnJUaW1lIC0gbGFzdFRpbWUpKSxcbiAgICAgICAgaWQgPSB3aW5kb3cuc2V0VGltZW91dChmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgY2FsbGJhY2soY3VyclRpbWUgKyB0aW1lVG9DYWxsKTtcbiAgICAgICAgfSwgdGltZVRvQ2FsbCk7XG4gICAgICBsYXN0VGltZSA9IGN1cnJUaW1lICsgdGltZVRvQ2FsbDtcbiAgICAgIHJldHVybiBpZDtcbiAgICB9O1xuXG4gICAgd2luZG93LmNhbmNlbEFuaW1hdGlvbkZyYW1lID0gZnVuY3Rpb24gKGlkKSB7XG4gICAgICBjbGVhclRpbWVvdXQoaWQpO1xuICAgIH07XG5cbiAgfVxuXG4gIH0oICQgKSk7XG5cbiAgZnVuY3Rpb24gcmVtb3ZlUXVvdGVzIChzdHJpbmcpIHtcbiAgICBpZiAodHlwZW9mIHN0cmluZyA9PT0gJ3N0cmluZycgfHwgc3RyaW5nIGluc3RhbmNlb2YgU3RyaW5nKSB7XG4gICAgICBzdHJpbmcgPSBzdHJpbmcucmVwbGFjZSgvXlsnXFxcXC9cIl0rfCg7XFxzP30pK3xbJ1xcXFwvXCJdKyQvZywgJycpO1xuICAgIH1cblxuICAgIHJldHVybiBzdHJpbmc7XG4gIH1cblxuICB3aW5kb3cuRm91bmRhdGlvbiA9IHtcbiAgICBuYW1lIDogJ0ZvdW5kYXRpb24nLFxuXG4gICAgdmVyc2lvbiA6ICc1LjUuMicsXG5cbiAgICBtZWRpYV9xdWVyaWVzIDoge1xuICAgICAgJ3NtYWxsJyAgICAgICA6IFMoJy5mb3VuZGF0aW9uLW1xLXNtYWxsJykuY3NzKCdmb250LWZhbWlseScpLnJlcGxhY2UoL15bXFwvXFxcXCdcIl0rfCg7XFxzP30pK3xbXFwvXFxcXCdcIl0rJC9nLCAnJyksXG4gICAgICAnc21hbGwtb25seScgIDogUygnLmZvdW5kYXRpb24tbXEtc21hbGwtb25seScpLmNzcygnZm9udC1mYW1pbHknKS5yZXBsYWNlKC9eW1xcL1xcXFwnXCJdK3woO1xccz99KSt8W1xcL1xcXFwnXCJdKyQvZywgJycpLFxuICAgICAgJ21lZGl1bScgICAgICA6IFMoJy5mb3VuZGF0aW9uLW1xLW1lZGl1bScpLmNzcygnZm9udC1mYW1pbHknKS5yZXBsYWNlKC9eW1xcL1xcXFwnXCJdK3woO1xccz99KSt8W1xcL1xcXFwnXCJdKyQvZywgJycpLFxuICAgICAgJ21lZGl1bS1vbmx5JyA6IFMoJy5mb3VuZGF0aW9uLW1xLW1lZGl1bS1vbmx5JykuY3NzKCdmb250LWZhbWlseScpLnJlcGxhY2UoL15bXFwvXFxcXCdcIl0rfCg7XFxzP30pK3xbXFwvXFxcXCdcIl0rJC9nLCAnJyksXG4gICAgICAnbGFyZ2UnICAgICAgIDogUygnLmZvdW5kYXRpb24tbXEtbGFyZ2UnKS5jc3MoJ2ZvbnQtZmFtaWx5JykucmVwbGFjZSgvXltcXC9cXFxcJ1wiXSt8KDtcXHM/fSkrfFtcXC9cXFxcJ1wiXSskL2csICcnKSxcbiAgICAgICdsYXJnZS1vbmx5JyAgOiBTKCcuZm91bmRhdGlvbi1tcS1sYXJnZS1vbmx5JykuY3NzKCdmb250LWZhbWlseScpLnJlcGxhY2UoL15bXFwvXFxcXCdcIl0rfCg7XFxzP30pK3xbXFwvXFxcXCdcIl0rJC9nLCAnJyksXG4gICAgICAneGxhcmdlJyAgICAgIDogUygnLmZvdW5kYXRpb24tbXEteGxhcmdlJykuY3NzKCdmb250LWZhbWlseScpLnJlcGxhY2UoL15bXFwvXFxcXCdcIl0rfCg7XFxzP30pK3xbXFwvXFxcXCdcIl0rJC9nLCAnJyksXG4gICAgICAneGxhcmdlLW9ubHknIDogUygnLmZvdW5kYXRpb24tbXEteGxhcmdlLW9ubHknKS5jc3MoJ2ZvbnQtZmFtaWx5JykucmVwbGFjZSgvXltcXC9cXFxcJ1wiXSt8KDtcXHM/fSkrfFtcXC9cXFxcJ1wiXSskL2csICcnKSxcbiAgICAgICd4eGxhcmdlJyAgICAgOiBTKCcuZm91bmRhdGlvbi1tcS14eGxhcmdlJykuY3NzKCdmb250LWZhbWlseScpLnJlcGxhY2UoL15bXFwvXFxcXCdcIl0rfCg7XFxzP30pK3xbXFwvXFxcXCdcIl0rJC9nLCAnJylcbiAgICB9LFxuXG4gICAgc3R5bGVzaGVldCA6ICQoJzxzdHlsZT48L3N0eWxlPicpLmFwcGVuZFRvKCdoZWFkJylbMF0uc2hlZXQsXG5cbiAgICBnbG9iYWwgOiB7XG4gICAgICBuYW1lc3BhY2UgOiB1bmRlZmluZWRcbiAgICB9LFxuXG4gICAgaW5pdCA6IGZ1bmN0aW9uIChzY29wZSwgbGlicmFyaWVzLCBtZXRob2QsIG9wdGlvbnMsIHJlc3BvbnNlKSB7XG4gICAgICB2YXIgYXJncyA9IFtzY29wZSwgbWV0aG9kLCBvcHRpb25zLCByZXNwb25zZV0sXG4gICAgICAgICAgcmVzcG9uc2VzID0gW107XG5cbiAgICAgIC8vIGNoZWNrIFJUTFxuICAgICAgdGhpcy5ydGwgPSAvcnRsL2kudGVzdChTKCdodG1sJykuYXR0cignZGlyJykpO1xuXG4gICAgICAvLyBzZXQgZm91bmRhdGlvbiBnbG9iYWwgc2NvcGVcbiAgICAgIHRoaXMuc2NvcGUgPSBzY29wZSB8fCB0aGlzLnNjb3BlO1xuXG4gICAgICB0aGlzLnNldF9uYW1lc3BhY2UoKTtcblxuICAgICAgaWYgKGxpYnJhcmllcyAmJiB0eXBlb2YgbGlicmFyaWVzID09PSAnc3RyaW5nJyAmJiAhL3JlZmxvdy9pLnRlc3QobGlicmFyaWVzKSkge1xuICAgICAgICBpZiAodGhpcy5saWJzLmhhc093blByb3BlcnR5KGxpYnJhcmllcykpIHtcbiAgICAgICAgICByZXNwb25zZXMucHVzaCh0aGlzLmluaXRfbGliKGxpYnJhcmllcywgYXJncykpO1xuICAgICAgICB9XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBmb3IgKHZhciBsaWIgaW4gdGhpcy5saWJzKSB7XG4gICAgICAgICAgcmVzcG9uc2VzLnB1c2godGhpcy5pbml0X2xpYihsaWIsIGxpYnJhcmllcykpO1xuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIFMod2luZG93KS5sb2FkKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgUyh3aW5kb3cpXG4gICAgICAgICAgLnRyaWdnZXIoJ3Jlc2l6ZS5mbmR0bi5jbGVhcmluZycpXG4gICAgICAgICAgLnRyaWdnZXIoJ3Jlc2l6ZS5mbmR0bi5kcm9wZG93bicpXG4gICAgICAgICAgLnRyaWdnZXIoJ3Jlc2l6ZS5mbmR0bi5lcXVhbGl6ZXInKVxuICAgICAgICAgIC50cmlnZ2VyKCdyZXNpemUuZm5kdG4uaW50ZXJjaGFuZ2UnKVxuICAgICAgICAgIC50cmlnZ2VyKCdyZXNpemUuZm5kdG4uam95cmlkZScpXG4gICAgICAgICAgLnRyaWdnZXIoJ3Jlc2l6ZS5mbmR0bi5tYWdlbGxhbicpXG4gICAgICAgICAgLnRyaWdnZXIoJ3Jlc2l6ZS5mbmR0bi50b3BiYXInKVxuICAgICAgICAgIC50cmlnZ2VyKCdyZXNpemUuZm5kdG4uc2xpZGVyJyk7XG4gICAgICB9KTtcblxuICAgICAgcmV0dXJuIHNjb3BlO1xuICAgIH0sXG5cbiAgICBpbml0X2xpYiA6IGZ1bmN0aW9uIChsaWIsIGFyZ3MpIHtcbiAgICAgIGlmICh0aGlzLmxpYnMuaGFzT3duUHJvcGVydHkobGliKSkge1xuICAgICAgICB0aGlzLnBhdGNoKHRoaXMubGlic1tsaWJdKTtcblxuICAgICAgICBpZiAoYXJncyAmJiBhcmdzLmhhc093blByb3BlcnR5KGxpYikpIHtcbiAgICAgICAgICAgIGlmICh0eXBlb2YgdGhpcy5saWJzW2xpYl0uc2V0dGluZ3MgIT09ICd1bmRlZmluZWQnKSB7XG4gICAgICAgICAgICAgICQuZXh0ZW5kKHRydWUsIHRoaXMubGlic1tsaWJdLnNldHRpbmdzLCBhcmdzW2xpYl0pO1xuICAgICAgICAgICAgfSBlbHNlIGlmICh0eXBlb2YgdGhpcy5saWJzW2xpYl0uZGVmYXVsdHMgIT09ICd1bmRlZmluZWQnKSB7XG4gICAgICAgICAgICAgICQuZXh0ZW5kKHRydWUsIHRoaXMubGlic1tsaWJdLmRlZmF1bHRzLCBhcmdzW2xpYl0pO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIHJldHVybiB0aGlzLmxpYnNbbGliXS5pbml0LmFwcGx5KHRoaXMubGlic1tsaWJdLCBbdGhpcy5zY29wZSwgYXJnc1tsaWJdXSk7XG4gICAgICAgIH1cblxuICAgICAgICBhcmdzID0gYXJncyBpbnN0YW5jZW9mIEFycmF5ID8gYXJncyA6IG5ldyBBcnJheShhcmdzKTtcbiAgICAgICAgcmV0dXJuIHRoaXMubGlic1tsaWJdLmluaXQuYXBwbHkodGhpcy5saWJzW2xpYl0sIGFyZ3MpO1xuICAgICAgfVxuXG4gICAgICByZXR1cm4gZnVuY3Rpb24gKCkge307XG4gICAgfSxcblxuICAgIHBhdGNoIDogZnVuY3Rpb24gKGxpYikge1xuICAgICAgbGliLnNjb3BlID0gdGhpcy5zY29wZTtcbiAgICAgIGxpYi5uYW1lc3BhY2UgPSB0aGlzLmdsb2JhbC5uYW1lc3BhY2U7XG4gICAgICBsaWIucnRsID0gdGhpcy5ydGw7XG4gICAgICBsaWJbJ2RhdGFfb3B0aW9ucyddID0gdGhpcy51dGlscy5kYXRhX29wdGlvbnM7XG4gICAgICBsaWJbJ2F0dHJfbmFtZSddID0gYXR0cl9uYW1lO1xuICAgICAgbGliWydhZGRfbmFtZXNwYWNlJ10gPSBhZGRfbmFtZXNwYWNlO1xuICAgICAgbGliWydiaW5kaW5ncyddID0gYmluZGluZ3M7XG4gICAgICBsaWJbJ1MnXSA9IHRoaXMudXRpbHMuUztcbiAgICB9LFxuXG4gICAgaW5oZXJpdCA6IGZ1bmN0aW9uIChzY29wZSwgbWV0aG9kcykge1xuICAgICAgdmFyIG1ldGhvZHNfYXJyID0gbWV0aG9kcy5zcGxpdCgnICcpLFxuICAgICAgICAgIGkgPSBtZXRob2RzX2Fyci5sZW5ndGg7XG5cbiAgICAgIHdoaWxlIChpLS0pIHtcbiAgICAgICAgaWYgKHRoaXMudXRpbHMuaGFzT3duUHJvcGVydHkobWV0aG9kc19hcnJbaV0pKSB7XG4gICAgICAgICAgc2NvcGVbbWV0aG9kc19hcnJbaV1dID0gdGhpcy51dGlsc1ttZXRob2RzX2FycltpXV07XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9LFxuXG4gICAgc2V0X25hbWVzcGFjZSA6IGZ1bmN0aW9uICgpIHtcblxuICAgICAgLy8gRGVzY3JpcHRpb246XG4gICAgICAvLyAgICBEb24ndCBib3RoZXIgcmVhZGluZyB0aGUgbmFtZXNwYWNlIG91dCBvZiB0aGUgbWV0YSB0YWdcbiAgICAgIC8vICAgIGlmIHRoZSBuYW1lc3BhY2UgaGFzIGJlZW4gc2V0IGdsb2JhbGx5IGluIGphdmFzY3JpcHRcbiAgICAgIC8vXG4gICAgICAvLyBFeGFtcGxlOlxuICAgICAgLy8gICAgRm91bmRhdGlvbi5nbG9iYWwubmFtZXNwYWNlID0gJ215LW5hbWVzcGFjZSc7XG4gICAgICAvLyBvciBtYWtlIGl0IGFuIGVtcHR5IHN0cmluZzpcbiAgICAgIC8vICAgIEZvdW5kYXRpb24uZ2xvYmFsLm5hbWVzcGFjZSA9ICcnO1xuICAgICAgLy9cbiAgICAgIC8vXG5cbiAgICAgIC8vIElmIHRoZSBuYW1lc3BhY2UgaGFzIG5vdCBiZWVuIHNldCAoaXMgdW5kZWZpbmVkKSwgdHJ5IHRvIHJlYWQgaXQgb3V0IG9mIHRoZSBtZXRhIGVsZW1lbnQuXG4gICAgICAvLyBPdGhlcndpc2UgdXNlIHRoZSBnbG9iYWxseSBkZWZpbmVkIG5hbWVzcGFjZSwgZXZlbiBpZiBpdCdzIGVtcHR5ICgnJylcbiAgICAgIHZhciBuYW1lc3BhY2UgPSAoIHRoaXMuZ2xvYmFsLm5hbWVzcGFjZSA9PT0gdW5kZWZpbmVkICkgPyAkKCcuZm91bmRhdGlvbi1kYXRhLWF0dHJpYnV0ZS1uYW1lc3BhY2UnKS5jc3MoJ2ZvbnQtZmFtaWx5JykgOiB0aGlzLmdsb2JhbC5uYW1lc3BhY2U7XG5cbiAgICAgIC8vIEZpbmFsbHksIGlmIHRoZSBuYW1zZXBhY2UgaXMgZWl0aGVyIHVuZGVmaW5lZCBvciBmYWxzZSwgc2V0IGl0IHRvIGFuIGVtcHR5IHN0cmluZy5cbiAgICAgIC8vIE90aGVyd2lzZSB1c2UgdGhlIG5hbWVzcGFjZSB2YWx1ZS5cbiAgICAgIHRoaXMuZ2xvYmFsLm5hbWVzcGFjZSA9ICggbmFtZXNwYWNlID09PSB1bmRlZmluZWQgfHwgL2ZhbHNlL2kudGVzdChuYW1lc3BhY2UpICkgPyAnJyA6IG5hbWVzcGFjZTtcbiAgICB9LFxuXG4gICAgbGlicyA6IHt9LFxuXG4gICAgLy8gbWV0aG9kcyB0aGF0IGNhbiBiZSBpbmhlcml0ZWQgaW4gbGlicmFyaWVzXG4gICAgdXRpbHMgOiB7XG5cbiAgICAgIC8vIERlc2NyaXB0aW9uOlxuICAgICAgLy8gICAgRmFzdCBTZWxlY3RvciB3cmFwcGVyIHJldHVybnMgalF1ZXJ5IG9iamVjdC4gT25seSB1c2Ugd2hlcmUgZ2V0RWxlbWVudEJ5SWRcbiAgICAgIC8vICAgIGlzIG5vdCBhdmFpbGFibGUuXG4gICAgICAvL1xuICAgICAgLy8gQXJndW1lbnRzOlxuICAgICAgLy8gICAgU2VsZWN0b3IgKFN0cmluZyk6IENTUyBzZWxlY3RvciBkZXNjcmliaW5nIHRoZSBlbGVtZW50KHMpIHRvIGJlXG4gICAgICAvLyAgICByZXR1cm5lZCBhcyBhIGpRdWVyeSBvYmplY3QuXG4gICAgICAvL1xuICAgICAgLy8gICAgU2NvcGUgKFN0cmluZyk6IENTUyBzZWxlY3RvciBkZXNjcmliaW5nIHRoZSBhcmVhIHRvIGJlIHNlYXJjaGVkLiBEZWZhdWx0XG4gICAgICAvLyAgICBpcyBkb2N1bWVudC5cbiAgICAgIC8vXG4gICAgICAvLyBSZXR1cm5zOlxuICAgICAgLy8gICAgRWxlbWVudCAoalF1ZXJ5IE9iamVjdCk6IGpRdWVyeSBvYmplY3QgY29udGFpbmluZyBlbGVtZW50cyBtYXRjaGluZyB0aGVcbiAgICAgIC8vICAgIHNlbGVjdG9yIHdpdGhpbiB0aGUgc2NvcGUuXG4gICAgICBTIDogUyxcblxuICAgICAgLy8gRGVzY3JpcHRpb246XG4gICAgICAvLyAgICBFeGVjdXRlcyBhIGZ1bmN0aW9uIGEgbWF4IG9mIG9uY2UgZXZlcnkgbiBtaWxsaXNlY29uZHNcbiAgICAgIC8vXG4gICAgICAvLyBBcmd1bWVudHM6XG4gICAgICAvLyAgICBGdW5jIChGdW5jdGlvbik6IEZ1bmN0aW9uIHRvIGJlIHRocm90dGxlZC5cbiAgICAgIC8vXG4gICAgICAvLyAgICBEZWxheSAoSW50ZWdlcik6IEZ1bmN0aW9uIGV4ZWN1dGlvbiB0aHJlc2hvbGQgaW4gbWlsbGlzZWNvbmRzLlxuICAgICAgLy9cbiAgICAgIC8vIFJldHVybnM6XG4gICAgICAvLyAgICBMYXp5X2Z1bmN0aW9uIChGdW5jdGlvbik6IEZ1bmN0aW9uIHdpdGggdGhyb3R0bGluZyBhcHBsaWVkLlxuICAgICAgdGhyb3R0bGUgOiBmdW5jdGlvbiAoZnVuYywgZGVsYXkpIHtcbiAgICAgICAgdmFyIHRpbWVyID0gbnVsbDtcblxuICAgICAgICByZXR1cm4gZnVuY3Rpb24gKCkge1xuICAgICAgICAgIHZhciBjb250ZXh0ID0gdGhpcywgYXJncyA9IGFyZ3VtZW50cztcblxuICAgICAgICAgIGlmICh0aW1lciA9PSBudWxsKSB7XG4gICAgICAgICAgICB0aW1lciA9IHNldFRpbWVvdXQoZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICBmdW5jLmFwcGx5KGNvbnRleHQsIGFyZ3MpO1xuICAgICAgICAgICAgICB0aW1lciA9IG51bGw7XG4gICAgICAgICAgICB9LCBkZWxheSk7XG4gICAgICAgICAgfVxuICAgICAgICB9O1xuICAgICAgfSxcblxuICAgICAgLy8gRGVzY3JpcHRpb246XG4gICAgICAvLyAgICBFeGVjdXRlcyBhIGZ1bmN0aW9uIHdoZW4gaXQgc3RvcHMgYmVpbmcgaW52b2tlZCBmb3IgbiBzZWNvbmRzXG4gICAgICAvLyAgICBNb2RpZmllZCB2ZXJzaW9uIG9mIF8uZGVib3VuY2UoKSBodHRwOi8vdW5kZXJzY29yZWpzLm9yZ1xuICAgICAgLy9cbiAgICAgIC8vIEFyZ3VtZW50czpcbiAgICAgIC8vICAgIEZ1bmMgKEZ1bmN0aW9uKTogRnVuY3Rpb24gdG8gYmUgZGVib3VuY2VkLlxuICAgICAgLy9cbiAgICAgIC8vICAgIERlbGF5IChJbnRlZ2VyKTogRnVuY3Rpb24gZXhlY3V0aW9uIHRocmVzaG9sZCBpbiBtaWxsaXNlY29uZHMuXG4gICAgICAvL1xuICAgICAgLy8gICAgSW1tZWRpYXRlIChCb29sKTogV2hldGhlciB0aGUgZnVuY3Rpb24gc2hvdWxkIGJlIGNhbGxlZCBhdCB0aGUgYmVnaW5uaW5nXG4gICAgICAvLyAgICBvZiB0aGUgZGVsYXkgaW5zdGVhZCBvZiB0aGUgZW5kLiBEZWZhdWx0IGlzIGZhbHNlLlxuICAgICAgLy9cbiAgICAgIC8vIFJldHVybnM6XG4gICAgICAvLyAgICBMYXp5X2Z1bmN0aW9uIChGdW5jdGlvbik6IEZ1bmN0aW9uIHdpdGggZGVib3VuY2luZyBhcHBsaWVkLlxuICAgICAgZGVib3VuY2UgOiBmdW5jdGlvbiAoZnVuYywgZGVsYXksIGltbWVkaWF0ZSkge1xuICAgICAgICB2YXIgdGltZW91dCwgcmVzdWx0O1xuICAgICAgICByZXR1cm4gZnVuY3Rpb24gKCkge1xuICAgICAgICAgIHZhciBjb250ZXh0ID0gdGhpcywgYXJncyA9IGFyZ3VtZW50cztcbiAgICAgICAgICB2YXIgbGF0ZXIgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICB0aW1lb3V0ID0gbnVsbDtcbiAgICAgICAgICAgIGlmICghaW1tZWRpYXRlKSB7XG4gICAgICAgICAgICAgIHJlc3VsdCA9IGZ1bmMuYXBwbHkoY29udGV4dCwgYXJncyk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfTtcbiAgICAgICAgICB2YXIgY2FsbE5vdyA9IGltbWVkaWF0ZSAmJiAhdGltZW91dDtcbiAgICAgICAgICBjbGVhclRpbWVvdXQodGltZW91dCk7XG4gICAgICAgICAgdGltZW91dCA9IHNldFRpbWVvdXQobGF0ZXIsIGRlbGF5KTtcbiAgICAgICAgICBpZiAoY2FsbE5vdykge1xuICAgICAgICAgICAgcmVzdWx0ID0gZnVuYy5hcHBseShjb250ZXh0LCBhcmdzKTtcbiAgICAgICAgICB9XG4gICAgICAgICAgcmV0dXJuIHJlc3VsdDtcbiAgICAgICAgfTtcbiAgICAgIH0sXG5cbiAgICAgIC8vIERlc2NyaXB0aW9uOlxuICAgICAgLy8gICAgUGFyc2VzIGRhdGEtb3B0aW9ucyBhdHRyaWJ1dGVcbiAgICAgIC8vXG4gICAgICAvLyBBcmd1bWVudHM6XG4gICAgICAvLyAgICBFbCAoalF1ZXJ5IE9iamVjdCk6IEVsZW1lbnQgdG8gYmUgcGFyc2VkLlxuICAgICAgLy9cbiAgICAgIC8vIFJldHVybnM6XG4gICAgICAvLyAgICBPcHRpb25zIChKYXZhc2NyaXB0IE9iamVjdCk6IENvbnRlbnRzIG9mIHRoZSBlbGVtZW50J3MgZGF0YS1vcHRpb25zXG4gICAgICAvLyAgICBhdHRyaWJ1dGUuXG4gICAgICBkYXRhX29wdGlvbnMgOiBmdW5jdGlvbiAoZWwsIGRhdGFfYXR0cl9uYW1lKSB7XG4gICAgICAgIGRhdGFfYXR0cl9uYW1lID0gZGF0YV9hdHRyX25hbWUgfHwgJ29wdGlvbnMnO1xuICAgICAgICB2YXIgb3B0cyA9IHt9LCBpaSwgcCwgb3B0c19hcnIsXG4gICAgICAgICAgICBkYXRhX29wdGlvbnMgPSBmdW5jdGlvbiAoZWwpIHtcbiAgICAgICAgICAgICAgdmFyIG5hbWVzcGFjZSA9IEZvdW5kYXRpb24uZ2xvYmFsLm5hbWVzcGFjZTtcblxuICAgICAgICAgICAgICBpZiAobmFtZXNwYWNlLmxlbmd0aCA+IDApIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gZWwuZGF0YShuYW1lc3BhY2UgKyAnLScgKyBkYXRhX2F0dHJfbmFtZSk7XG4gICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICByZXR1cm4gZWwuZGF0YShkYXRhX2F0dHJfbmFtZSk7XG4gICAgICAgICAgICB9O1xuXG4gICAgICAgIHZhciBjYWNoZWRfb3B0aW9ucyA9IGRhdGFfb3B0aW9ucyhlbCk7XG5cbiAgICAgICAgaWYgKHR5cGVvZiBjYWNoZWRfb3B0aW9ucyA9PT0gJ29iamVjdCcpIHtcbiAgICAgICAgICByZXR1cm4gY2FjaGVkX29wdGlvbnM7XG4gICAgICAgIH1cblxuICAgICAgICBvcHRzX2FyciA9IChjYWNoZWRfb3B0aW9ucyB8fCAnOicpLnNwbGl0KCc7Jyk7XG4gICAgICAgIGlpID0gb3B0c19hcnIubGVuZ3RoO1xuXG4gICAgICAgIGZ1bmN0aW9uIGlzTnVtYmVyIChvKSB7XG4gICAgICAgICAgcmV0dXJuICFpc05hTiAobyAtIDApICYmIG8gIT09IG51bGwgJiYgbyAhPT0gJycgJiYgbyAhPT0gZmFsc2UgJiYgbyAhPT0gdHJ1ZTtcbiAgICAgICAgfVxuXG4gICAgICAgIGZ1bmN0aW9uIHRyaW0gKHN0cikge1xuICAgICAgICAgIGlmICh0eXBlb2Ygc3RyID09PSAnc3RyaW5nJykge1xuICAgICAgICAgICAgcmV0dXJuICQudHJpbShzdHIpO1xuICAgICAgICAgIH1cbiAgICAgICAgICByZXR1cm4gc3RyO1xuICAgICAgICB9XG5cbiAgICAgICAgd2hpbGUgKGlpLS0pIHtcbiAgICAgICAgICBwID0gb3B0c19hcnJbaWldLnNwbGl0KCc6Jyk7XG4gICAgICAgICAgcCA9IFtwWzBdLCBwLnNsaWNlKDEpLmpvaW4oJzonKV07XG5cbiAgICAgICAgICBpZiAoL3RydWUvaS50ZXN0KHBbMV0pKSB7XG4gICAgICAgICAgICBwWzFdID0gdHJ1ZTtcbiAgICAgICAgICB9XG4gICAgICAgICAgaWYgKC9mYWxzZS9pLnRlc3QocFsxXSkpIHtcbiAgICAgICAgICAgIHBbMV0gPSBmYWxzZTtcbiAgICAgICAgICB9XG4gICAgICAgICAgaWYgKGlzTnVtYmVyKHBbMV0pKSB7XG4gICAgICAgICAgICBpZiAocFsxXS5pbmRleE9mKCcuJykgPT09IC0xKSB7XG4gICAgICAgICAgICAgIHBbMV0gPSBwYXJzZUludChwWzFdLCAxMCk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICBwWzFdID0gcGFyc2VGbG9hdChwWzFdKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG5cbiAgICAgICAgICBpZiAocC5sZW5ndGggPT09IDIgJiYgcFswXS5sZW5ndGggPiAwKSB7XG4gICAgICAgICAgICBvcHRzW3RyaW0ocFswXSldID0gdHJpbShwWzFdKTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gb3B0cztcbiAgICAgIH0sXG5cbiAgICAgIC8vIERlc2NyaXB0aW9uOlxuICAgICAgLy8gICAgQWRkcyBKUy1yZWNvZ25pemFibGUgbWVkaWEgcXVlcmllc1xuICAgICAgLy9cbiAgICAgIC8vIEFyZ3VtZW50czpcbiAgICAgIC8vICAgIE1lZGlhIChTdHJpbmcpOiBLZXkgc3RyaW5nIGZvciB0aGUgbWVkaWEgcXVlcnkgdG8gYmUgc3RvcmVkIGFzIGluXG4gICAgICAvLyAgICBGb3VuZGF0aW9uLm1lZGlhX3F1ZXJpZXNcbiAgICAgIC8vXG4gICAgICAvLyAgICBDbGFzcyAoU3RyaW5nKTogQ2xhc3MgbmFtZSBmb3IgdGhlIGdlbmVyYXRlZCA8bWV0YT4gdGFnXG4gICAgICByZWdpc3Rlcl9tZWRpYSA6IGZ1bmN0aW9uIChtZWRpYSwgbWVkaWFfY2xhc3MpIHtcbiAgICAgICAgaWYgKEZvdW5kYXRpb24ubWVkaWFfcXVlcmllc1ttZWRpYV0gPT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICQoJ2hlYWQnKS5hcHBlbmQoJzxtZXRhIGNsYXNzPVwiJyArIG1lZGlhX2NsYXNzICsgJ1wiLz4nKTtcbiAgICAgICAgICBGb3VuZGF0aW9uLm1lZGlhX3F1ZXJpZXNbbWVkaWFdID0gcmVtb3ZlUXVvdGVzKCQoJy4nICsgbWVkaWFfY2xhc3MpLmNzcygnZm9udC1mYW1pbHknKSk7XG4gICAgICAgIH1cbiAgICAgIH0sXG5cbiAgICAgIC8vIERlc2NyaXB0aW9uOlxuICAgICAgLy8gICAgQWRkIGN1c3RvbSBDU1Mgd2l0aGluIGEgSlMtZGVmaW5lZCBtZWRpYSBxdWVyeVxuICAgICAgLy9cbiAgICAgIC8vIEFyZ3VtZW50czpcbiAgICAgIC8vICAgIFJ1bGUgKFN0cmluZyk6IENTUyBydWxlIHRvIGJlIGFwcGVuZGVkIHRvIHRoZSBkb2N1bWVudC5cbiAgICAgIC8vXG4gICAgICAvLyAgICBNZWRpYSAoU3RyaW5nKTogT3B0aW9uYWwgbWVkaWEgcXVlcnkgc3RyaW5nIGZvciB0aGUgQ1NTIHJ1bGUgdG8gYmVcbiAgICAgIC8vICAgIG5lc3RlZCB1bmRlci5cbiAgICAgIGFkZF9jdXN0b21fcnVsZSA6IGZ1bmN0aW9uIChydWxlLCBtZWRpYSkge1xuICAgICAgICBpZiAobWVkaWEgPT09IHVuZGVmaW5lZCAmJiBGb3VuZGF0aW9uLnN0eWxlc2hlZXQpIHtcbiAgICAgICAgICBGb3VuZGF0aW9uLnN0eWxlc2hlZXQuaW5zZXJ0UnVsZShydWxlLCBGb3VuZGF0aW9uLnN0eWxlc2hlZXQuY3NzUnVsZXMubGVuZ3RoKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICB2YXIgcXVlcnkgPSBGb3VuZGF0aW9uLm1lZGlhX3F1ZXJpZXNbbWVkaWFdO1xuXG4gICAgICAgICAgaWYgKHF1ZXJ5ICE9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgIEZvdW5kYXRpb24uc3R5bGVzaGVldC5pbnNlcnRSdWxlKCdAbWVkaWEgJyArXG4gICAgICAgICAgICAgIEZvdW5kYXRpb24ubWVkaWFfcXVlcmllc1ttZWRpYV0gKyAneyAnICsgcnVsZSArICcgfScsIEZvdW5kYXRpb24uc3R5bGVzaGVldC5jc3NSdWxlcy5sZW5ndGgpO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfSxcblxuICAgICAgLy8gRGVzY3JpcHRpb246XG4gICAgICAvLyAgICBQZXJmb3JtcyBhIGNhbGxiYWNrIGZ1bmN0aW9uIHdoZW4gYW4gaW1hZ2UgaXMgZnVsbHkgbG9hZGVkXG4gICAgICAvL1xuICAgICAgLy8gQXJndW1lbnRzOlxuICAgICAgLy8gICAgSW1hZ2UgKGpRdWVyeSBPYmplY3QpOiBJbWFnZShzKSB0byBjaGVjayBpZiBsb2FkZWQuXG4gICAgICAvL1xuICAgICAgLy8gICAgQ2FsbGJhY2sgKEZ1bmN0aW9uKTogRnVuY3Rpb24gdG8gZXhlY3V0ZSB3aGVuIGltYWdlIGlzIGZ1bGx5IGxvYWRlZC5cbiAgICAgIGltYWdlX2xvYWRlZCA6IGZ1bmN0aW9uIChpbWFnZXMsIGNhbGxiYWNrKSB7XG4gICAgICAgIHZhciBzZWxmID0gdGhpcyxcbiAgICAgICAgICAgIHVubG9hZGVkID0gaW1hZ2VzLmxlbmd0aDtcblxuICAgICAgICBmdW5jdGlvbiBwaWN0dXJlc19oYXNfaGVpZ2h0KGltYWdlcykge1xuICAgICAgICAgIHZhciBwaWN0dXJlc19udW1iZXIgPSBpbWFnZXMubGVuZ3RoO1xuXG4gICAgICAgICAgZm9yICh2YXIgaSA9IHBpY3R1cmVzX251bWJlciAtIDE7IGkgPj0gMDsgaS0tKSB7XG4gICAgICAgICAgICBpZihpbWFnZXMuYXR0cignaGVpZ2h0JykgPT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgICAgICB9O1xuICAgICAgICAgIH07XG5cbiAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmICh1bmxvYWRlZCA9PT0gMCB8fCBwaWN0dXJlc19oYXNfaGVpZ2h0KGltYWdlcykpIHtcbiAgICAgICAgICBjYWxsYmFjayhpbWFnZXMpO1xuICAgICAgICB9XG5cbiAgICAgICAgaW1hZ2VzLmVhY2goZnVuY3Rpb24gKCkge1xuICAgICAgICAgIHNpbmdsZV9pbWFnZV9sb2FkZWQoc2VsZi5TKHRoaXMpLCBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICB1bmxvYWRlZCAtPSAxO1xuICAgICAgICAgICAgaWYgKHVubG9hZGVkID09PSAwKSB7XG4gICAgICAgICAgICAgIGNhbGxiYWNrKGltYWdlcyk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfSk7XG4gICAgICAgIH0pO1xuICAgICAgfSxcblxuICAgICAgLy8gRGVzY3JpcHRpb246XG4gICAgICAvLyAgICBSZXR1cm5zIGEgcmFuZG9tLCBhbHBoYW51bWVyaWMgc3RyaW5nXG4gICAgICAvL1xuICAgICAgLy8gQXJndW1lbnRzOlxuICAgICAgLy8gICAgTGVuZ3RoIChJbnRlZ2VyKTogTGVuZ3RoIG9mIHN0cmluZyB0byBiZSBnZW5lcmF0ZWQuIERlZmF1bHRzIHRvIHJhbmRvbVxuICAgICAgLy8gICAgaW50ZWdlci5cbiAgICAgIC8vXG4gICAgICAvLyBSZXR1cm5zOlxuICAgICAgLy8gICAgUmFuZCAoU3RyaW5nKTogUHNldWRvLXJhbmRvbSwgYWxwaGFudW1lcmljIHN0cmluZy5cbiAgICAgIHJhbmRvbV9zdHIgOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgIGlmICghdGhpcy5maWR4KSB7XG4gICAgICAgICAgdGhpcy5maWR4ID0gMDtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLnByZWZpeCA9IHRoaXMucHJlZml4IHx8IFsodGhpcy5uYW1lIHx8ICdGJyksICgrbmV3IERhdGUpLnRvU3RyaW5nKDM2KV0uam9pbignLScpO1xuXG4gICAgICAgIHJldHVybiB0aGlzLnByZWZpeCArICh0aGlzLmZpZHgrKykudG9TdHJpbmcoMzYpO1xuICAgICAgfSxcblxuICAgICAgLy8gRGVzY3JpcHRpb246XG4gICAgICAvLyAgICBIZWxwZXIgZm9yIHdpbmRvdy5tYXRjaE1lZGlhXG4gICAgICAvL1xuICAgICAgLy8gQXJndW1lbnRzOlxuICAgICAgLy8gICAgbXEgKFN0cmluZyk6IE1lZGlhIHF1ZXJ5XG4gICAgICAvL1xuICAgICAgLy8gUmV0dXJuczpcbiAgICAgIC8vICAgIChCb29sZWFuKTogV2hldGhlciB0aGUgbWVkaWEgcXVlcnkgcGFzc2VzIG9yIG5vdFxuICAgICAgbWF0Y2ggOiBmdW5jdGlvbiAobXEpIHtcbiAgICAgICAgcmV0dXJuIHdpbmRvdy5tYXRjaE1lZGlhKG1xKS5tYXRjaGVzO1xuICAgICAgfSxcblxuICAgICAgLy8gRGVzY3JpcHRpb246XG4gICAgICAvLyAgICBIZWxwZXJzIGZvciBjaGVja2luZyBGb3VuZGF0aW9uIGRlZmF1bHQgbWVkaWEgcXVlcmllcyB3aXRoIEpTXG4gICAgICAvL1xuICAgICAgLy8gUmV0dXJuczpcbiAgICAgIC8vICAgIChCb29sZWFuKTogV2hldGhlciB0aGUgbWVkaWEgcXVlcnkgcGFzc2VzIG9yIG5vdFxuXG4gICAgICBpc19zbWFsbF91cCA6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMubWF0Y2goRm91bmRhdGlvbi5tZWRpYV9xdWVyaWVzLnNtYWxsKTtcbiAgICAgIH0sXG5cbiAgICAgIGlzX21lZGl1bV91cCA6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMubWF0Y2goRm91bmRhdGlvbi5tZWRpYV9xdWVyaWVzLm1lZGl1bSk7XG4gICAgICB9LFxuXG4gICAgICBpc19sYXJnZV91cCA6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMubWF0Y2goRm91bmRhdGlvbi5tZWRpYV9xdWVyaWVzLmxhcmdlKTtcbiAgICAgIH0sXG5cbiAgICAgIGlzX3hsYXJnZV91cCA6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMubWF0Y2goRm91bmRhdGlvbi5tZWRpYV9xdWVyaWVzLnhsYXJnZSk7XG4gICAgICB9LFxuXG4gICAgICBpc194eGxhcmdlX3VwIDogZnVuY3Rpb24gKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5tYXRjaChGb3VuZGF0aW9uLm1lZGlhX3F1ZXJpZXMueHhsYXJnZSk7XG4gICAgICB9LFxuXG4gICAgICBpc19zbWFsbF9vbmx5IDogZnVuY3Rpb24gKCkge1xuICAgICAgICByZXR1cm4gIXRoaXMuaXNfbWVkaXVtX3VwKCkgJiYgIXRoaXMuaXNfbGFyZ2VfdXAoKSAmJiAhdGhpcy5pc194bGFyZ2VfdXAoKSAmJiAhdGhpcy5pc194eGxhcmdlX3VwKCk7XG4gICAgICB9LFxuXG4gICAgICBpc19tZWRpdW1fb25seSA6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuaXNfbWVkaXVtX3VwKCkgJiYgIXRoaXMuaXNfbGFyZ2VfdXAoKSAmJiAhdGhpcy5pc194bGFyZ2VfdXAoKSAmJiAhdGhpcy5pc194eGxhcmdlX3VwKCk7XG4gICAgICB9LFxuXG4gICAgICBpc19sYXJnZV9vbmx5IDogZnVuY3Rpb24gKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5pc19tZWRpdW1fdXAoKSAmJiB0aGlzLmlzX2xhcmdlX3VwKCkgJiYgIXRoaXMuaXNfeGxhcmdlX3VwKCkgJiYgIXRoaXMuaXNfeHhsYXJnZV91cCgpO1xuICAgICAgfSxcblxuICAgICAgaXNfeGxhcmdlX29ubHkgOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLmlzX21lZGl1bV91cCgpICYmIHRoaXMuaXNfbGFyZ2VfdXAoKSAmJiB0aGlzLmlzX3hsYXJnZV91cCgpICYmICF0aGlzLmlzX3h4bGFyZ2VfdXAoKTtcbiAgICAgIH0sXG5cbiAgICAgIGlzX3h4bGFyZ2Vfb25seSA6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuaXNfbWVkaXVtX3VwKCkgJiYgdGhpcy5pc19sYXJnZV91cCgpICYmIHRoaXMuaXNfeGxhcmdlX3VwKCkgJiYgdGhpcy5pc194eGxhcmdlX3VwKCk7XG4gICAgICB9XG4gICAgfVxuICB9O1xuXG4gICQuZm4uZm91bmRhdGlvbiA9IGZ1bmN0aW9uICgpIHtcbiAgICB2YXIgYXJncyA9IEFycmF5LnByb3RvdHlwZS5zbGljZS5jYWxsKGFyZ3VtZW50cywgMCk7XG5cbiAgICByZXR1cm4gdGhpcy5lYWNoKGZ1bmN0aW9uICgpIHtcbiAgICAgIEZvdW5kYXRpb24uaW5pdC5hcHBseShGb3VuZGF0aW9uLCBbdGhpc10uY29uY2F0KGFyZ3MpKTtcbiAgICAgIHJldHVybiB0aGlzO1xuICAgIH0pO1xuICB9O1xuXG59KGpRdWVyeSwgd2luZG93LCB3aW5kb3cuZG9jdW1lbnQpKTtcblxuOyhmdW5jdGlvbiAoJCwgd2luZG93LCBkb2N1bWVudCwgdW5kZWZpbmVkKSB7XG4gICd1c2Ugc3RyaWN0JztcblxuICBGb3VuZGF0aW9uLmxpYnMuYWJpZGUgPSB7XG4gICAgbmFtZSA6ICdhYmlkZScsXG5cbiAgICB2ZXJzaW9uIDogJzUuNS4yJyxcblxuICAgIHNldHRpbmdzIDoge1xuICAgICAgbGl2ZV92YWxpZGF0ZSA6IHRydWUsXG4gICAgICB2YWxpZGF0ZV9vbl9ibHVyIDogdHJ1ZSxcbiAgICAgIC8vIHZhbGlkYXRlX29uOiAndGFiJywgLy8gdGFiICh3aGVuIHVzZXIgdGFicyBiZXR3ZWVuIGZpZWxkcyksIGNoYW5nZSAoaW5wdXQgY2hhbmdlcyksIG1hbnVhbCAoY2FsbCBjdXN0b20gZXZlbnRzKSBcbiAgICAgIGZvY3VzX29uX2ludmFsaWQgOiB0cnVlLFxuICAgICAgZXJyb3JfbGFiZWxzIDogdHJ1ZSwgLy8gbGFiZWxzIHdpdGggYSBmb3I9XCJpbnB1dElkXCIgd2lsbCByZWNpZXZlIGFuIGBlcnJvcmAgY2xhc3NcbiAgICAgIGVycm9yX2NsYXNzIDogJ2Vycm9yJyxcbiAgICAgIHRpbWVvdXQgOiAxMDAwLFxuICAgICAgcGF0dGVybnMgOiB7XG4gICAgICAgIGFscGhhIDogL15bYS16QS1aXSskLyxcbiAgICAgICAgYWxwaGFfbnVtZXJpYyA6IC9eW2EtekEtWjAtOV0rJC8sXG4gICAgICAgIGludGVnZXIgOiAvXlstK10/XFxkKyQvLFxuICAgICAgICBudW1iZXIgOiAvXlstK10/XFxkKig/OltcXC5cXCxdXFxkKyk/JC8sXG5cbiAgICAgICAgLy8gYW1leCwgdmlzYSwgZGluZXJzXG4gICAgICAgIGNhcmQgOiAvXig/OjRbMC05XXsxMn0oPzpbMC05XXszfSk/fDVbMS01XVswLTldezE0fXw2KD86MDExfDVbMC05XVswLTldKVswLTldezEyfXwzWzQ3XVswLTldezEzfXwzKD86MFswLTVdfFs2OF1bMC05XSlbMC05XXsxMX18KD86MjEzMXwxODAwfDM1XFxkezN9KVxcZHsxMX0pJC8sXG4gICAgICAgIGN2diA6IC9eKFswLTldKXszLDR9JC8sXG5cbiAgICAgICAgLy8gaHR0cDovL3d3dy53aGF0d2cub3JnL3NwZWNzL3dlYi1hcHBzL2N1cnJlbnQtd29yay9tdWx0aXBhZ2Uvc3RhdGVzLW9mLXRoZS10eXBlLWF0dHJpYnV0ZS5odG1sI3ZhbGlkLWUtbWFpbC1hZGRyZXNzXG4gICAgICAgIGVtYWlsIDogL15bYS16QS1aMC05LiEjJCUmJyorXFwvPT9eX2B7fH1+LV0rQFthLXpBLVowLTldKD86W2EtekEtWjAtOS1dezAsNjF9W2EtekEtWjAtOV0pPyg/OlxcLlthLXpBLVowLTldKD86W2EtekEtWjAtOS1dezAsNjF9W2EtekEtWjAtOV0pPykrJC8sXG5cbiAgICAgICAgLy8gaHR0cDovL2Jsb2dzLmxzZS5hYy51ay9sdGkvMjAwOC8wNC8yMy9hLXJlZ3VsYXItZXhwcmVzc2lvbi10by1tYXRjaC1hbnktdXJsL1xuICAgICAgICB1cmw6IC9eKGh0dHBzP3xmdHB8ZmlsZXxzc2gpOlxcL1xcLyhbLTs6Jj1cXCtcXCQsXFx3XStAezF9KT8oWy1BLVphLXowLTlcXC5dKykrOj8oXFxkKyk/KChcXC9bLVxcK34lXFwvXFwuXFx3XSspP1xcPz8oWy1cXCs9JjslQFxcLlxcd10rKT8jPyhbXFx3XSspPyk/LyxcbiAgICAgICAgLy8gYWJjLmRlXG4gICAgICAgIGRvbWFpbiA6IC9eKFthLXpBLVowLTldKFthLXpBLVowLTlcXC1dezAsNjF9W2EtekEtWjAtOV0pP1xcLikrW2EtekEtWl17Miw4fSQvLFxuXG4gICAgICAgIGRhdGV0aW1lIDogL14oWzAtMl1bMC05XXszfSlcXC0oWzAtMV1bMC05XSlcXC0oWzAtM11bMC05XSlUKFswLTVdWzAtOV0pXFw6KFswLTVdWzAtOV0pXFw6KFswLTVdWzAtOV0pKFp8KFtcXC1cXCtdKFswLTFdWzAtOV0pXFw6MDApKSQvLFxuICAgICAgICAvLyBZWVlZLU1NLUREXG4gICAgICAgIGRhdGUgOiAvKD86MTl8MjApWzAtOV17Mn0tKD86KD86MFsxLTldfDFbMC0yXSktKD86MFsxLTldfDFbMC05XXwyWzAtOV0pfCg/Oig/ITAyKSg/OjBbMS05XXwxWzAtMl0pLSg/OjMwKSl8KD86KD86MFsxMzU3OF18MVswMl0pLTMxKSkkLyxcbiAgICAgICAgLy8gSEg6TU06U1NcbiAgICAgICAgdGltZSA6IC9eKDBbMC05XXwxWzAtOV18MlswLTNdKSg6WzAtNV1bMC05XSl7Mn0kLyxcbiAgICAgICAgZGF0ZUlTTyA6IC9eXFxkezR9W1xcL1xcLV1cXGR7MSwyfVtcXC9cXC1dXFxkezEsMn0kLyxcbiAgICAgICAgLy8gTU0vREQvWVlZWVxuICAgICAgICBtb250aF9kYXlfeWVhciA6IC9eKDBbMS05XXwxWzAxMl0pWy0gXFwvLl0oMFsxLTldfFsxMl1bMC05XXwzWzAxXSlbLSBcXC8uXVxcZHs0fSQvLFxuICAgICAgICAvLyBERC9NTS9ZWVlZXG4gICAgICAgIGRheV9tb250aF95ZWFyIDogL14oMFsxLTldfFsxMl1bMC05XXwzWzAxXSlbLSBcXC8uXSgwWzEtOV18MVswMTJdKVstIFxcLy5dXFxkezR9JC8sXG5cbiAgICAgICAgLy8gI0ZGRiBvciAjRkZGRkZGXG4gICAgICAgIGNvbG9yIDogL14jPyhbYS1mQS1GMC05XXs2fXxbYS1mQS1GMC05XXszfSkkL1xuICAgICAgfSxcbiAgICAgIHZhbGlkYXRvcnMgOiB7XG4gICAgICAgIGVxdWFsVG8gOiBmdW5jdGlvbiAoZWwsIHJlcXVpcmVkLCBwYXJlbnQpIHtcbiAgICAgICAgICB2YXIgZnJvbSAgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChlbC5nZXRBdHRyaWJ1dGUodGhpcy5hZGRfbmFtZXNwYWNlKCdkYXRhLWVxdWFsdG8nKSkpLnZhbHVlLFxuICAgICAgICAgICAgICB0byAgICA9IGVsLnZhbHVlLFxuICAgICAgICAgICAgICB2YWxpZCA9IChmcm9tID09PSB0byk7XG5cbiAgICAgICAgICByZXR1cm4gdmFsaWQ7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9LFxuXG4gICAgdGltZXIgOiBudWxsLFxuXG4gICAgaW5pdCA6IGZ1bmN0aW9uIChzY29wZSwgbWV0aG9kLCBvcHRpb25zKSB7XG4gICAgICB0aGlzLmJpbmRpbmdzKG1ldGhvZCwgb3B0aW9ucyk7XG4gICAgfSxcblxuICAgIGV2ZW50cyA6IGZ1bmN0aW9uIChzY29wZSkge1xuICAgICAgdmFyIHNlbGYgPSB0aGlzLFxuICAgICAgICAgIGZvcm0gPSBzZWxmLlMoc2NvcGUpLmF0dHIoJ25vdmFsaWRhdGUnLCAnbm92YWxpZGF0ZScpLFxuICAgICAgICAgIHNldHRpbmdzID0gZm9ybS5kYXRhKHRoaXMuYXR0cl9uYW1lKHRydWUpICsgJy1pbml0JykgfHwge307XG5cbiAgICAgIHRoaXMuaW52YWxpZF9hdHRyID0gdGhpcy5hZGRfbmFtZXNwYWNlKCdkYXRhLWludmFsaWQnKTtcblxuICAgICAgZnVuY3Rpb24gdmFsaWRhdGUob3JpZ2luYWxTZWxmLCBlKSB7XG4gICAgICAgIGNsZWFyVGltZW91dChzZWxmLnRpbWVyKTtcbiAgICAgICAgc2VsZi50aW1lciA9IHNldFRpbWVvdXQoZnVuY3Rpb24gKCkge1xuICAgICAgICAgIHNlbGYudmFsaWRhdGUoW29yaWdpbmFsU2VsZl0sIGUpO1xuICAgICAgICB9LmJpbmQob3JpZ2luYWxTZWxmKSwgc2V0dGluZ3MudGltZW91dCk7XG4gICAgICB9XG5cblxuICAgICAgZm9ybVxuICAgICAgICAub2ZmKCcuYWJpZGUnKVxuICAgICAgICAub24oJ3N1Ym1pdC5mbmR0bi5hYmlkZScsIGZ1bmN0aW9uIChlKSB7XG4gICAgICAgICAgdmFyIGlzX2FqYXggPSAvYWpheC9pLnRlc3Qoc2VsZi5TKHRoaXMpLmF0dHIoc2VsZi5hdHRyX25hbWUoKSkpO1xuICAgICAgICAgIHJldHVybiBzZWxmLnZhbGlkYXRlKHNlbGYuUyh0aGlzKS5maW5kKCdpbnB1dCwgdGV4dGFyZWEsIHNlbGVjdCcpLm5vdChcIjpoaWRkZW4sIFtkYXRhLWFiaWRlLWlnbm9yZV1cIikuZ2V0KCksIGUsIGlzX2FqYXgpO1xuICAgICAgICB9KVxuICAgICAgICAub24oJ3ZhbGlkYXRlLmZuZHRuLmFiaWRlJywgZnVuY3Rpb24gKGUpIHtcbiAgICAgICAgICBpZiAoc2V0dGluZ3MudmFsaWRhdGVfb24gPT09ICdtYW51YWwnKSB7XG4gICAgICAgICAgICBzZWxmLnZhbGlkYXRlKFtlLnRhcmdldF0sIGUpO1xuICAgICAgICAgIH1cbiAgICAgICAgfSlcbiAgICAgICAgLm9uKCdyZXNldCcsIGZ1bmN0aW9uIChlKSB7XG4gICAgICAgICAgcmV0dXJuIHNlbGYucmVzZXQoJCh0aGlzKSwgZSk7ICAgICAgICAgIFxuICAgICAgICB9KVxuICAgICAgICAuZmluZCgnaW5wdXQsIHRleHRhcmVhLCBzZWxlY3QnKS5ub3QoXCI6aGlkZGVuLCBbZGF0YS1hYmlkZS1pZ25vcmVdXCIpXG4gICAgICAgICAgLm9mZignLmFiaWRlJylcbiAgICAgICAgICAub24oJ2JsdXIuZm5kdG4uYWJpZGUgY2hhbmdlLmZuZHRuLmFiaWRlJywgZnVuY3Rpb24gKGUpIHtcbiAgICAgICAgICAgIC8vIG9sZCBzZXR0aW5ncyBmYWxsYmFja1xuICAgICAgICAgICAgLy8gd2lsbCBiZSBkZXByZWNhdGVkIHdpdGggRjYgcmVsZWFzZVxuICAgICAgICAgICAgaWYgKHNldHRpbmdzLnZhbGlkYXRlX29uX2JsdXIgJiYgc2V0dGluZ3MudmFsaWRhdGVfb25fYmx1ciA9PT0gdHJ1ZSkge1xuICAgICAgICAgICAgICB2YWxpZGF0ZSh0aGlzLCBlKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIC8vIG5ldyBzZXR0aW5ncyBjb21iaW5pbmcgdmFsaWRhdGUgb3B0aW9ucyBpbnRvIG9uZSBzZXR0aW5nXG4gICAgICAgICAgICBpZiAoc2V0dGluZ3MudmFsaWRhdGVfb24gPT09ICdjaGFuZ2UnKSB7XG4gICAgICAgICAgICAgIHZhbGlkYXRlKHRoaXMsIGUpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH0pXG4gICAgICAgICAgLm9uKCdrZXlkb3duLmZuZHRuLmFiaWRlJywgZnVuY3Rpb24gKGUpIHtcbiAgICAgICAgICAgIC8vIG9sZCBzZXR0aW5ncyBmYWxsYmFja1xuICAgICAgICAgICAgLy8gd2lsbCBiZSBkZXByZWNhdGVkIHdpdGggRjYgcmVsZWFzZVxuICAgICAgICAgICAgaWYgKHNldHRpbmdzLmxpdmVfdmFsaWRhdGUgJiYgc2V0dGluZ3MubGl2ZV92YWxpZGF0ZSA9PT0gdHJ1ZSAmJiBlLndoaWNoICE9IDkpIHtcbiAgICAgICAgICAgICAgdmFsaWRhdGUodGhpcywgZSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICAvLyBuZXcgc2V0dGluZ3MgY29tYmluaW5nIHZhbGlkYXRlIG9wdGlvbnMgaW50byBvbmUgc2V0dGluZ1xuICAgICAgICAgICAgaWYgKHNldHRpbmdzLnZhbGlkYXRlX29uID09PSAndGFiJyAmJiBlLndoaWNoID09PSA5KSB7XG4gICAgICAgICAgICAgIHZhbGlkYXRlKHRoaXMsIGUpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSBpZiAoc2V0dGluZ3MudmFsaWRhdGVfb24gPT09ICdjaGFuZ2UnKSB7XG4gICAgICAgICAgICAgIHZhbGlkYXRlKHRoaXMsIGUpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH0pXG4gICAgICAgICAgLm9uKCdmb2N1cycsIGZ1bmN0aW9uIChlKSB7XG4gICAgICAgICAgICBpZiAobmF2aWdhdG9yLnVzZXJBZ2VudC5tYXRjaCgvaVBhZHxpUGhvbmV8QW5kcm9pZHxCbGFja0JlcnJ5fFdpbmRvd3MgUGhvbmV8d2ViT1MvaSkpIHtcbiAgICAgICAgICAgICAgJCgnaHRtbCwgYm9keScpLmFuaW1hdGUoe1xuICAgICAgICAgICAgICAgICAgc2Nyb2xsVG9wOiAkKGUudGFyZ2V0KS5vZmZzZXQoKS50b3BcbiAgICAgICAgICAgICAgfSwgMTAwKTtcbiAgICAgICAgICAgIH0gXG4gICAgICAgICAgfSk7XG4gICAgfSxcblxuICAgIHJlc2V0IDogZnVuY3Rpb24gKGZvcm0sIGUpIHtcbiAgICAgIHZhciBzZWxmID0gdGhpcztcbiAgICAgIGZvcm0ucmVtb3ZlQXR0cihzZWxmLmludmFsaWRfYXR0cik7XG5cbiAgICAgICQoJ1snICsgc2VsZi5pbnZhbGlkX2F0dHIgKyAnXScsIGZvcm0pLnJlbW92ZUF0dHIoc2VsZi5pbnZhbGlkX2F0dHIpO1xuICAgICAgJCgnLicgKyBzZWxmLnNldHRpbmdzLmVycm9yX2NsYXNzLCBmb3JtKS5ub3QoJ3NtYWxsJykucmVtb3ZlQ2xhc3Moc2VsZi5zZXR0aW5ncy5lcnJvcl9jbGFzcyk7XG4gICAgICAkKCc6aW5wdXQnLCBmb3JtKS5ub3QoJzpidXR0b24sIDpzdWJtaXQsIDpyZXNldCwgOmhpZGRlbiwgW2RhdGEtYWJpZGUtaWdub3JlXScpLnZhbCgnJykucmVtb3ZlQXR0cihzZWxmLmludmFsaWRfYXR0cik7XG4gICAgfSxcblxuICAgIHZhbGlkYXRlIDogZnVuY3Rpb24gKGVscywgZSwgaXNfYWpheCkge1xuICAgICAgdmFyIHZhbGlkYXRpb25zID0gdGhpcy5wYXJzZV9wYXR0ZXJucyhlbHMpLFxuICAgICAgICAgIHZhbGlkYXRpb25fY291bnQgPSB2YWxpZGF0aW9ucy5sZW5ndGgsXG4gICAgICAgICAgZm9ybSA9IHRoaXMuUyhlbHNbMF0pLmNsb3Nlc3QoJ2Zvcm0nKSxcbiAgICAgICAgICBzdWJtaXRfZXZlbnQgPSAvc3VibWl0Ly50ZXN0KGUudHlwZSk7XG5cbiAgICAgIC8vIEhhcyB0byBjb3VudCB1cCB0byBtYWtlIHN1cmUgdGhlIGZvY3VzIGdldHMgYXBwbGllZCB0byB0aGUgdG9wIGVycm9yXG4gICAgICBmb3IgKHZhciBpID0gMDsgaSA8IHZhbGlkYXRpb25fY291bnQ7IGkrKykge1xuICAgICAgICBpZiAoIXZhbGlkYXRpb25zW2ldICYmIChzdWJtaXRfZXZlbnQgfHwgaXNfYWpheCkpIHtcbiAgICAgICAgICBpZiAodGhpcy5zZXR0aW5ncy5mb2N1c19vbl9pbnZhbGlkKSB7XG4gICAgICAgICAgICBlbHNbaV0uZm9jdXMoKTtcbiAgICAgICAgICB9XG4gICAgICAgICAgZm9ybS50cmlnZ2VyKCdpbnZhbGlkLmZuZHRuLmFiaWRlJyk7XG4gICAgICAgICAgdGhpcy5TKGVsc1tpXSkuY2xvc2VzdCgnZm9ybScpLmF0dHIodGhpcy5pbnZhbGlkX2F0dHIsICcnKTtcbiAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgaWYgKHN1Ym1pdF9ldmVudCB8fCBpc19hamF4KSB7XG4gICAgICAgIGZvcm0udHJpZ2dlcigndmFsaWQuZm5kdG4uYWJpZGUnKTtcbiAgICAgIH1cblxuICAgICAgZm9ybS5yZW1vdmVBdHRyKHRoaXMuaW52YWxpZF9hdHRyKTtcblxuICAgICAgaWYgKGlzX2FqYXgpIHtcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgfVxuXG4gICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9LFxuXG4gICAgcGFyc2VfcGF0dGVybnMgOiBmdW5jdGlvbiAoZWxzKSB7XG4gICAgICB2YXIgaSA9IGVscy5sZW5ndGgsXG4gICAgICAgICAgZWxfcGF0dGVybnMgPSBbXTtcblxuICAgICAgd2hpbGUgKGktLSkge1xuICAgICAgICBlbF9wYXR0ZXJucy5wdXNoKHRoaXMucGF0dGVybihlbHNbaV0pKTtcbiAgICAgIH1cblxuICAgICAgcmV0dXJuIHRoaXMuY2hlY2tfdmFsaWRhdGlvbl9hbmRfYXBwbHlfc3R5bGVzKGVsX3BhdHRlcm5zKTtcbiAgICB9LFxuXG4gICAgcGF0dGVybiA6IGZ1bmN0aW9uIChlbCkge1xuICAgICAgdmFyIHR5cGUgPSBlbC5nZXRBdHRyaWJ1dGUoJ3R5cGUnKSxcbiAgICAgICAgICByZXF1aXJlZCA9IHR5cGVvZiBlbC5nZXRBdHRyaWJ1dGUoJ3JlcXVpcmVkJykgPT09ICdzdHJpbmcnO1xuXG4gICAgICB2YXIgcGF0dGVybiA9IGVsLmdldEF0dHJpYnV0ZSgncGF0dGVybicpIHx8ICcnO1xuXG4gICAgICBpZiAodGhpcy5zZXR0aW5ncy5wYXR0ZXJucy5oYXNPd25Qcm9wZXJ0eShwYXR0ZXJuKSAmJiBwYXR0ZXJuLmxlbmd0aCA+IDApIHtcbiAgICAgICAgcmV0dXJuIFtlbCwgdGhpcy5zZXR0aW5ncy5wYXR0ZXJuc1twYXR0ZXJuXSwgcmVxdWlyZWRdO1xuICAgICAgfSBlbHNlIGlmIChwYXR0ZXJuLmxlbmd0aCA+IDApIHtcbiAgICAgICAgcmV0dXJuIFtlbCwgbmV3IFJlZ0V4cChwYXR0ZXJuKSwgcmVxdWlyZWRdO1xuICAgICAgfVxuXG4gICAgICBpZiAodGhpcy5zZXR0aW5ncy5wYXR0ZXJucy5oYXNPd25Qcm9wZXJ0eSh0eXBlKSkge1xuICAgICAgICByZXR1cm4gW2VsLCB0aGlzLnNldHRpbmdzLnBhdHRlcm5zW3R5cGVdLCByZXF1aXJlZF07XG4gICAgICB9XG5cbiAgICAgIHBhdHRlcm4gPSAvLiovO1xuXG4gICAgICByZXR1cm4gW2VsLCBwYXR0ZXJuLCByZXF1aXJlZF07XG4gICAgfSxcblxuICAgIC8vIFRPRE86IEJyZWFrIHRoaXMgdXAgaW50byBzbWFsbGVyIG1ldGhvZHMsIGdldHRpbmcgaGFyZCB0byByZWFkLlxuICAgIGNoZWNrX3ZhbGlkYXRpb25fYW5kX2FwcGx5X3N0eWxlcyA6IGZ1bmN0aW9uIChlbF9wYXR0ZXJucykge1xuICAgICAgdmFyIGkgPSBlbF9wYXR0ZXJucy5sZW5ndGgsXG4gICAgICAgICAgdmFsaWRhdGlvbnMgPSBbXSxcbiAgICAgICAgICBmb3JtID0gdGhpcy5TKGVsX3BhdHRlcm5zWzBdWzBdKS5jbG9zZXN0KCdbZGF0YS0nICsgdGhpcy5hdHRyX25hbWUodHJ1ZSkgKyAnXScpLFxuICAgICAgICAgIHNldHRpbmdzID0gZm9ybS5kYXRhKHRoaXMuYXR0cl9uYW1lKHRydWUpICsgJy1pbml0JykgfHwge307XG4gICAgICB3aGlsZSAoaS0tKSB7XG4gICAgICAgIHZhciBlbCA9IGVsX3BhdHRlcm5zW2ldWzBdLFxuICAgICAgICAgICAgcmVxdWlyZWQgPSBlbF9wYXR0ZXJuc1tpXVsyXSxcbiAgICAgICAgICAgIHZhbHVlID0gZWwudmFsdWUudHJpbSgpLFxuICAgICAgICAgICAgZGlyZWN0X3BhcmVudCA9IHRoaXMuUyhlbCkucGFyZW50KCksXG4gICAgICAgICAgICB2YWxpZGF0b3IgPSBlbC5nZXRBdHRyaWJ1dGUodGhpcy5hZGRfbmFtZXNwYWNlKCdkYXRhLWFiaWRlLXZhbGlkYXRvcicpKSxcbiAgICAgICAgICAgIGlzX3JhZGlvID0gZWwudHlwZSA9PT0gJ3JhZGlvJyxcbiAgICAgICAgICAgIGlzX2NoZWNrYm94ID0gZWwudHlwZSA9PT0gJ2NoZWNrYm94JyxcbiAgICAgICAgICAgIGxhYmVsID0gdGhpcy5TKCdsYWJlbFtmb3I9XCInICsgZWwuZ2V0QXR0cmlidXRlKCdpZCcpICsgJ1wiXScpLFxuICAgICAgICAgICAgdmFsaWRfbGVuZ3RoID0gKHJlcXVpcmVkKSA/IChlbC52YWx1ZS5sZW5ndGggPiAwKSA6IHRydWUsXG4gICAgICAgICAgICBlbF92YWxpZGF0aW9ucyA9IFtdO1xuXG4gICAgICAgIHZhciBwYXJlbnQsIHZhbGlkO1xuXG4gICAgICAgIC8vIHN1cHBvcnQgb2xkIHdheSB0byBkbyBlcXVhbFRvIHZhbGlkYXRpb25zXG4gICAgICAgIGlmIChlbC5nZXRBdHRyaWJ1dGUodGhpcy5hZGRfbmFtZXNwYWNlKCdkYXRhLWVxdWFsdG8nKSkpIHsgdmFsaWRhdG9yID0gJ2VxdWFsVG8nIH1cblxuICAgICAgICBpZiAoIWRpcmVjdF9wYXJlbnQuaXMoJ2xhYmVsJykpIHtcbiAgICAgICAgICBwYXJlbnQgPSBkaXJlY3RfcGFyZW50O1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHBhcmVudCA9IGRpcmVjdF9wYXJlbnQucGFyZW50KCk7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoaXNfcmFkaW8gJiYgcmVxdWlyZWQpIHtcbiAgICAgICAgICBlbF92YWxpZGF0aW9ucy5wdXNoKHRoaXMudmFsaWRfcmFkaW8oZWwsIHJlcXVpcmVkKSk7XG4gICAgICAgIH0gZWxzZSBpZiAoaXNfY2hlY2tib3ggJiYgcmVxdWlyZWQpIHtcbiAgICAgICAgICBlbF92YWxpZGF0aW9ucy5wdXNoKHRoaXMudmFsaWRfY2hlY2tib3goZWwsIHJlcXVpcmVkKSk7XG5cbiAgICAgICAgfSBlbHNlIGlmICh2YWxpZGF0b3IpIHtcbiAgICAgICAgICAvLyBWYWxpZGF0ZSB1c2luZyBlYWNoIG9mIHRoZSBzcGVjaWZpZWQgKHNwYWNlLWRlbGltaXRlZCkgdmFsaWRhdG9ycy5cbiAgICAgICAgICB2YXIgdmFsaWRhdG9ycyA9IHZhbGlkYXRvci5zcGxpdCgnICcpO1xuICAgICAgICAgIHZhciBsYXN0X3ZhbGlkID0gdHJ1ZSwgYWxsX3ZhbGlkID0gdHJ1ZTtcbiAgICAgICAgICBmb3IgKHZhciBpdiA9IDA7IGl2IDwgdmFsaWRhdG9ycy5sZW5ndGg7IGl2KyspIHtcbiAgICAgICAgICAgICAgdmFsaWQgPSB0aGlzLnNldHRpbmdzLnZhbGlkYXRvcnNbdmFsaWRhdG9yc1tpdl1dLmFwcGx5KHRoaXMsIFtlbCwgcmVxdWlyZWQsIHBhcmVudF0pXG4gICAgICAgICAgICAgIGVsX3ZhbGlkYXRpb25zLnB1c2godmFsaWQpO1xuICAgICAgICAgICAgICBhbGxfdmFsaWQgPSB2YWxpZCAmJiBsYXN0X3ZhbGlkO1xuICAgICAgICAgICAgICBsYXN0X3ZhbGlkID0gdmFsaWQ7XG4gICAgICAgICAgfVxuICAgICAgICAgIGlmIChhbGxfdmFsaWQpIHtcbiAgICAgICAgICAgICAgdGhpcy5TKGVsKS5yZW1vdmVBdHRyKHRoaXMuaW52YWxpZF9hdHRyKTtcbiAgICAgICAgICAgICAgcGFyZW50LnJlbW92ZUNsYXNzKCdlcnJvcicpO1xuICAgICAgICAgICAgICBpZiAobGFiZWwubGVuZ3RoID4gMCAmJiB0aGlzLnNldHRpbmdzLmVycm9yX2xhYmVscykge1xuICAgICAgICAgICAgICAgIGxhYmVsLnJlbW92ZUNsYXNzKHRoaXMuc2V0dGluZ3MuZXJyb3JfY2xhc3MpLnJlbW92ZUF0dHIoJ3JvbGUnKTtcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAkKGVsKS50cmlnZ2VySGFuZGxlcigndmFsaWQnKTtcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICB0aGlzLlMoZWwpLmF0dHIodGhpcy5pbnZhbGlkX2F0dHIsICcnKTtcbiAgICAgICAgICAgICAgcGFyZW50LmFkZENsYXNzKCdlcnJvcicpO1xuICAgICAgICAgICAgICBpZiAobGFiZWwubGVuZ3RoID4gMCAmJiB0aGlzLnNldHRpbmdzLmVycm9yX2xhYmVscykge1xuICAgICAgICAgICAgICAgIGxhYmVsLmFkZENsYXNzKHRoaXMuc2V0dGluZ3MuZXJyb3JfY2xhc3MpLmF0dHIoJ3JvbGUnLCAnYWxlcnQnKTtcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAkKGVsKS50cmlnZ2VySGFuZGxlcignaW52YWxpZCcpO1xuICAgICAgICAgIH1cbiAgICAgICAgfSBlbHNlIHtcblxuICAgICAgICAgIGlmIChlbF9wYXR0ZXJuc1tpXVsxXS50ZXN0KHZhbHVlKSAmJiB2YWxpZF9sZW5ndGggfHxcbiAgICAgICAgICAgICFyZXF1aXJlZCAmJiBlbC52YWx1ZS5sZW5ndGggPCAxIHx8ICQoZWwpLmF0dHIoJ2Rpc2FibGVkJykpIHtcbiAgICAgICAgICAgIGVsX3ZhbGlkYXRpb25zLnB1c2godHJ1ZSk7XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGVsX3ZhbGlkYXRpb25zLnB1c2goZmFsc2UpO1xuICAgICAgICAgIH1cblxuICAgICAgICAgIGVsX3ZhbGlkYXRpb25zID0gW2VsX3ZhbGlkYXRpb25zLmV2ZXJ5KGZ1bmN0aW9uICh2YWxpZCkge3JldHVybiB2YWxpZDt9KV07XG4gICAgICAgICAgaWYgKGVsX3ZhbGlkYXRpb25zWzBdKSB7XG4gICAgICAgICAgICB0aGlzLlMoZWwpLnJlbW92ZUF0dHIodGhpcy5pbnZhbGlkX2F0dHIpO1xuICAgICAgICAgICAgZWwuc2V0QXR0cmlidXRlKCdhcmlhLWludmFsaWQnLCAnZmFsc2UnKTtcbiAgICAgICAgICAgIGVsLnJlbW92ZUF0dHJpYnV0ZSgnYXJpYS1kZXNjcmliZWRieScpO1xuICAgICAgICAgICAgcGFyZW50LnJlbW92ZUNsYXNzKHRoaXMuc2V0dGluZ3MuZXJyb3JfY2xhc3MpO1xuICAgICAgICAgICAgaWYgKGxhYmVsLmxlbmd0aCA+IDAgJiYgdGhpcy5zZXR0aW5ncy5lcnJvcl9sYWJlbHMpIHtcbiAgICAgICAgICAgICAgbGFiZWwucmVtb3ZlQ2xhc3ModGhpcy5zZXR0aW5ncy5lcnJvcl9jbGFzcykucmVtb3ZlQXR0cigncm9sZScpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgJChlbCkudHJpZ2dlckhhbmRsZXIoJ3ZhbGlkJyk7XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHRoaXMuUyhlbCkuYXR0cih0aGlzLmludmFsaWRfYXR0ciwgJycpO1xuICAgICAgICAgICAgZWwuc2V0QXR0cmlidXRlKCdhcmlhLWludmFsaWQnLCAndHJ1ZScpO1xuXG4gICAgICAgICAgICAvLyBUcnkgdG8gZmluZCB0aGUgZXJyb3IgYXNzb2NpYXRlZCB3aXRoIHRoZSBpbnB1dFxuICAgICAgICAgICAgdmFyIGVycm9yRWxlbSA9IHBhcmVudC5maW5kKCdzbWFsbC4nICsgdGhpcy5zZXR0aW5ncy5lcnJvcl9jbGFzcywgJ3NwYW4uJyArIHRoaXMuc2V0dGluZ3MuZXJyb3JfY2xhc3MpO1xuICAgICAgICAgICAgdmFyIGVycm9ySUQgPSBlcnJvckVsZW0ubGVuZ3RoID4gMCA/IGVycm9yRWxlbVswXS5pZCA6ICcnO1xuICAgICAgICAgICAgaWYgKGVycm9ySUQubGVuZ3RoID4gMCkge1xuICAgICAgICAgICAgICBlbC5zZXRBdHRyaWJ1dGUoJ2FyaWEtZGVzY3JpYmVkYnknLCBlcnJvcklEKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgLy8gZWwuc2V0QXR0cmlidXRlKCdhcmlhLWRlc2NyaWJlZGJ5JywgJChlbCkuZmluZCgnLmVycm9yJylbMF0uaWQpO1xuICAgICAgICAgICAgcGFyZW50LmFkZENsYXNzKHRoaXMuc2V0dGluZ3MuZXJyb3JfY2xhc3MpO1xuICAgICAgICAgICAgaWYgKGxhYmVsLmxlbmd0aCA+IDAgJiYgdGhpcy5zZXR0aW5ncy5lcnJvcl9sYWJlbHMpIHtcbiAgICAgICAgICAgICAgbGFiZWwuYWRkQ2xhc3ModGhpcy5zZXR0aW5ncy5lcnJvcl9jbGFzcykuYXR0cigncm9sZScsICdhbGVydCcpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgJChlbCkudHJpZ2dlckhhbmRsZXIoJ2ludmFsaWQnKTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgdmFsaWRhdGlvbnMgPSB2YWxpZGF0aW9ucy5jb25jYXQoZWxfdmFsaWRhdGlvbnMpO1xuICAgICAgfVxuICAgICAgcmV0dXJuIHZhbGlkYXRpb25zO1xuICAgIH0sXG5cbiAgICB2YWxpZF9jaGVja2JveCA6IGZ1bmN0aW9uIChlbCwgcmVxdWlyZWQpIHtcbiAgICAgIHZhciBlbCA9IHRoaXMuUyhlbCksXG4gICAgICAgICAgdmFsaWQgPSAoZWwuaXMoJzpjaGVja2VkJykgfHwgIXJlcXVpcmVkIHx8IGVsLmdldCgwKS5nZXRBdHRyaWJ1dGUoJ2Rpc2FibGVkJykpO1xuXG4gICAgICBpZiAodmFsaWQpIHtcbiAgICAgICAgZWwucmVtb3ZlQXR0cih0aGlzLmludmFsaWRfYXR0cikucGFyZW50KCkucmVtb3ZlQ2xhc3ModGhpcy5zZXR0aW5ncy5lcnJvcl9jbGFzcyk7XG4gICAgICAgICQoZWwpLnRyaWdnZXJIYW5kbGVyKCd2YWxpZCcpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgZWwuYXR0cih0aGlzLmludmFsaWRfYXR0ciwgJycpLnBhcmVudCgpLmFkZENsYXNzKHRoaXMuc2V0dGluZ3MuZXJyb3JfY2xhc3MpO1xuICAgICAgICAkKGVsKS50cmlnZ2VySGFuZGxlcignaW52YWxpZCcpO1xuICAgICAgfVxuXG4gICAgICByZXR1cm4gdmFsaWQ7XG4gICAgfSxcblxuICAgIHZhbGlkX3JhZGlvIDogZnVuY3Rpb24gKGVsLCByZXF1aXJlZCkge1xuICAgICAgdmFyIG5hbWUgPSBlbC5nZXRBdHRyaWJ1dGUoJ25hbWUnKSxcbiAgICAgICAgICBncm91cCA9IHRoaXMuUyhlbCkuY2xvc2VzdCgnW2RhdGEtJyArIHRoaXMuYXR0cl9uYW1lKHRydWUpICsgJ10nKS5maW5kKFwiW25hbWU9J1wiICsgbmFtZSArIFwiJ11cIiksXG4gICAgICAgICAgY291bnQgPSBncm91cC5sZW5ndGgsXG4gICAgICAgICAgdmFsaWQgPSBmYWxzZSxcbiAgICAgICAgICBkaXNhYmxlZCA9IGZhbHNlO1xuXG4gICAgICAvLyBIYXMgdG8gY291bnQgdXAgdG8gbWFrZSBzdXJlIHRoZSBmb2N1cyBnZXRzIGFwcGxpZWQgdG8gdGhlIHRvcCBlcnJvclxuICAgICAgICBmb3IgKHZhciBpPTA7IGkgPCBjb3VudDsgaSsrKSB7XG4gICAgICAgICAgICBpZiggZ3JvdXBbaV0uZ2V0QXR0cmlidXRlKCdkaXNhYmxlZCcpICl7XG4gICAgICAgICAgICAgICAgZGlzYWJsZWQ9dHJ1ZTtcbiAgICAgICAgICAgICAgICB2YWxpZD10cnVlO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBpZiAoZ3JvdXBbaV0uY2hlY2tlZCl7XG4gICAgICAgICAgICAgICAgICAgIHZhbGlkID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICBpZiggZGlzYWJsZWQgKXtcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhbGlkID0gZmFsc2U7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgLy8gSGFzIHRvIGNvdW50IHVwIHRvIG1ha2Ugc3VyZSB0aGUgZm9jdXMgZ2V0cyBhcHBsaWVkIHRvIHRoZSB0b3AgZXJyb3JcbiAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgY291bnQ7IGkrKykge1xuICAgICAgICBpZiAodmFsaWQpIHtcbiAgICAgICAgICB0aGlzLlMoZ3JvdXBbaV0pLnJlbW92ZUF0dHIodGhpcy5pbnZhbGlkX2F0dHIpLnBhcmVudCgpLnJlbW92ZUNsYXNzKHRoaXMuc2V0dGluZ3MuZXJyb3JfY2xhc3MpO1xuICAgICAgICAgICQoZ3JvdXBbaV0pLnRyaWdnZXJIYW5kbGVyKCd2YWxpZCcpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHRoaXMuUyhncm91cFtpXSkuYXR0cih0aGlzLmludmFsaWRfYXR0ciwgJycpLnBhcmVudCgpLmFkZENsYXNzKHRoaXMuc2V0dGluZ3MuZXJyb3JfY2xhc3MpO1xuICAgICAgICAgICQoZ3JvdXBbaV0pLnRyaWdnZXJIYW5kbGVyKCdpbnZhbGlkJyk7XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgcmV0dXJuIHZhbGlkO1xuICAgIH0sXG5cbiAgICB2YWxpZF9lcXVhbCA6IGZ1bmN0aW9uIChlbCwgcmVxdWlyZWQsIHBhcmVudCkge1xuICAgICAgdmFyIGZyb20gID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoZWwuZ2V0QXR0cmlidXRlKHRoaXMuYWRkX25hbWVzcGFjZSgnZGF0YS1lcXVhbHRvJykpKS52YWx1ZSxcbiAgICAgICAgICB0byAgICA9IGVsLnZhbHVlLFxuICAgICAgICAgIHZhbGlkID0gKGZyb20gPT09IHRvKTtcblxuICAgICAgaWYgKHZhbGlkKSB7XG4gICAgICAgIHRoaXMuUyhlbCkucmVtb3ZlQXR0cih0aGlzLmludmFsaWRfYXR0cik7XG4gICAgICAgIHBhcmVudC5yZW1vdmVDbGFzcyh0aGlzLnNldHRpbmdzLmVycm9yX2NsYXNzKTtcbiAgICAgICAgaWYgKGxhYmVsLmxlbmd0aCA+IDAgJiYgc2V0dGluZ3MuZXJyb3JfbGFiZWxzKSB7XG4gICAgICAgICAgbGFiZWwucmVtb3ZlQ2xhc3ModGhpcy5zZXR0aW5ncy5lcnJvcl9jbGFzcyk7XG4gICAgICAgIH1cbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHRoaXMuUyhlbCkuYXR0cih0aGlzLmludmFsaWRfYXR0ciwgJycpO1xuICAgICAgICBwYXJlbnQuYWRkQ2xhc3ModGhpcy5zZXR0aW5ncy5lcnJvcl9jbGFzcyk7XG4gICAgICAgIGlmIChsYWJlbC5sZW5ndGggPiAwICYmIHNldHRpbmdzLmVycm9yX2xhYmVscykge1xuICAgICAgICAgIGxhYmVsLmFkZENsYXNzKHRoaXMuc2V0dGluZ3MuZXJyb3JfY2xhc3MpO1xuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIHJldHVybiB2YWxpZDtcbiAgICB9LFxuXG4gICAgdmFsaWRfb25lb2YgOiBmdW5jdGlvbiAoZWwsIHJlcXVpcmVkLCBwYXJlbnQsIGRvTm90VmFsaWRhdGVPdGhlcnMpIHtcbiAgICAgIHZhciBlbCA9IHRoaXMuUyhlbCksXG4gICAgICAgIG90aGVycyA9IHRoaXMuUygnWycgKyB0aGlzLmFkZF9uYW1lc3BhY2UoJ2RhdGEtb25lb2YnKSArICddJyksXG4gICAgICAgIHZhbGlkID0gb3RoZXJzLmZpbHRlcignOmNoZWNrZWQnKS5sZW5ndGggPiAwO1xuXG4gICAgICBpZiAodmFsaWQpIHtcbiAgICAgICAgZWwucmVtb3ZlQXR0cih0aGlzLmludmFsaWRfYXR0cikucGFyZW50KCkucmVtb3ZlQ2xhc3ModGhpcy5zZXR0aW5ncy5lcnJvcl9jbGFzcyk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBlbC5hdHRyKHRoaXMuaW52YWxpZF9hdHRyLCAnJykucGFyZW50KCkuYWRkQ2xhc3ModGhpcy5zZXR0aW5ncy5lcnJvcl9jbGFzcyk7XG4gICAgICB9XG5cbiAgICAgIGlmICghZG9Ob3RWYWxpZGF0ZU90aGVycykge1xuICAgICAgICB2YXIgX3RoaXMgPSB0aGlzO1xuICAgICAgICBvdGhlcnMuZWFjaChmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgX3RoaXMudmFsaWRfb25lb2YuY2FsbChfdGhpcywgdGhpcywgbnVsbCwgbnVsbCwgdHJ1ZSk7XG4gICAgICAgIH0pO1xuICAgICAgfVxuXG4gICAgICByZXR1cm4gdmFsaWQ7XG4gICAgfSxcblxuICAgIHJlZmxvdyA6IGZ1bmN0aW9uKHNjb3BlLCBvcHRpb25zKSB7XG4gICAgICB2YXIgc2VsZiA9IHRoaXMsXG4gICAgICAgICAgZm9ybSA9IHNlbGYuUygnWycgKyB0aGlzLmF0dHJfbmFtZSgpICsgJ10nKS5hdHRyKCdub3ZhbGlkYXRlJywgJ25vdmFsaWRhdGUnKTtcbiAgICAgICAgICBzZWxmLlMoZm9ybSkuZWFjaChmdW5jdGlvbiAoaWR4LCBlbCkge1xuICAgICAgICAgICAgc2VsZi5ldmVudHMoZWwpO1xuICAgICAgICAgIH0pO1xuICAgIH1cbiAgfTtcbn0oalF1ZXJ5LCB3aW5kb3csIHdpbmRvdy5kb2N1bWVudCkpO1xuXG47KGZ1bmN0aW9uICgkLCB3aW5kb3csIGRvY3VtZW50LCB1bmRlZmluZWQpIHtcbiAgJ3VzZSBzdHJpY3QnO1xuXG4gIEZvdW5kYXRpb24ubGlicy5hY2NvcmRpb24gPSB7XG4gICAgbmFtZSA6ICdhY2NvcmRpb24nLFxuXG4gICAgdmVyc2lvbiA6ICc1LjUuMicsXG5cbiAgICBzZXR0aW5ncyA6IHtcbiAgICAgIGNvbnRlbnRfY2xhc3MgOiAnY29udGVudCcsXG4gICAgICBhY3RpdmVfY2xhc3MgOiAnYWN0aXZlJyxcbiAgICAgIG11bHRpX2V4cGFuZCA6IGZhbHNlLFxuICAgICAgdG9nZ2xlYWJsZSA6IHRydWUsXG4gICAgICBjYWxsYmFjayA6IGZ1bmN0aW9uICgpIHt9XG4gICAgfSxcblxuICAgIGluaXQgOiBmdW5jdGlvbiAoc2NvcGUsIG1ldGhvZCwgb3B0aW9ucykge1xuICAgICAgdGhpcy5iaW5kaW5ncyhtZXRob2QsIG9wdGlvbnMpO1xuICAgIH0sXG5cbiAgICBldmVudHMgOiBmdW5jdGlvbiAoaW5zdGFuY2UpIHtcbiAgICAgIHZhciBzZWxmID0gdGhpcztcbiAgICAgIHZhciBTID0gdGhpcy5TO1xuICAgICAgc2VsZi5jcmVhdGUodGhpcy5TKGluc3RhbmNlKSk7XG5cbiAgICAgIFModGhpcy5zY29wZSlcbiAgICAgIC5vZmYoJy5mbmR0bi5hY2NvcmRpb24nKVxuICAgICAgLm9uKCdjbGljay5mbmR0bi5hY2NvcmRpb24nLCAnWycgKyB0aGlzLmF0dHJfbmFtZSgpICsgJ10gPiBkZCA+IGEsIFsnICsgdGhpcy5hdHRyX25hbWUoKSArICddID4gbGkgPiBhJywgZnVuY3Rpb24gKGUpIHtcbiAgICAgICAgdmFyIGFjY29yZGlvbiA9IFModGhpcykuY2xvc2VzdCgnWycgKyBzZWxmLmF0dHJfbmFtZSgpICsgJ10nKSxcbiAgICAgICAgICAgIGdyb3VwU2VsZWN0b3IgPSBzZWxmLmF0dHJfbmFtZSgpICsgJz0nICsgYWNjb3JkaW9uLmF0dHIoc2VsZi5hdHRyX25hbWUoKSksXG4gICAgICAgICAgICBzZXR0aW5ncyA9IGFjY29yZGlvbi5kYXRhKHNlbGYuYXR0cl9uYW1lKHRydWUpICsgJy1pbml0JykgfHwgc2VsZi5zZXR0aW5ncyxcbiAgICAgICAgICAgIHRhcmdldCA9IFMoJyMnICsgdGhpcy5ocmVmLnNwbGl0KCcjJylbMV0pLFxuICAgICAgICAgICAgYXVudHMgPSAkKCc+IGRkLCA+IGxpJywgYWNjb3JkaW9uKSxcbiAgICAgICAgICAgIHNpYmxpbmdzID0gYXVudHMuY2hpbGRyZW4oJy4nICsgc2V0dGluZ3MuY29udGVudF9jbGFzcyksXG4gICAgICAgICAgICBhY3RpdmVfY29udGVudCA9IHNpYmxpbmdzLmZpbHRlcignLicgKyBzZXR0aW5ncy5hY3RpdmVfY2xhc3MpO1xuXG4gICAgICAgIGUucHJldmVudERlZmF1bHQoKTtcblxuICAgICAgICBpZiAoYWNjb3JkaW9uLmF0dHIoc2VsZi5hdHRyX25hbWUoKSkpIHtcbiAgICAgICAgICBzaWJsaW5ncyA9IHNpYmxpbmdzLmFkZCgnWycgKyBncm91cFNlbGVjdG9yICsgJ10gZGQgPiAnICsgJy4nICsgc2V0dGluZ3MuY29udGVudF9jbGFzcyArICcsIFsnICsgZ3JvdXBTZWxlY3RvciArICddIGxpID4gJyArICcuJyArIHNldHRpbmdzLmNvbnRlbnRfY2xhc3MpO1xuICAgICAgICAgIGF1bnRzID0gYXVudHMuYWRkKCdbJyArIGdyb3VwU2VsZWN0b3IgKyAnXSBkZCwgWycgKyBncm91cFNlbGVjdG9yICsgJ10gbGknKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChzZXR0aW5ncy50b2dnbGVhYmxlICYmIHRhcmdldC5pcyhhY3RpdmVfY29udGVudCkpIHtcbiAgICAgICAgICB0YXJnZXQucGFyZW50KCdkZCwgbGknKS50b2dnbGVDbGFzcyhzZXR0aW5ncy5hY3RpdmVfY2xhc3MsIGZhbHNlKTtcbiAgICAgICAgICB0YXJnZXQudG9nZ2xlQ2xhc3Moc2V0dGluZ3MuYWN0aXZlX2NsYXNzLCBmYWxzZSk7XG4gICAgICAgICAgUyh0aGlzKS5hdHRyKCdhcmlhLWV4cGFuZGVkJywgZnVuY3Rpb24oaSwgYXR0cil7XG4gICAgICAgICAgICAgIHJldHVybiBhdHRyID09PSAndHJ1ZScgPyAnZmFsc2UnIDogJ3RydWUnO1xuICAgICAgICAgIH0pO1xuICAgICAgICAgIHNldHRpbmdzLmNhbGxiYWNrKHRhcmdldCk7XG4gICAgICAgICAgdGFyZ2V0LnRyaWdnZXJIYW5kbGVyKCd0b2dnbGVkJywgW2FjY29yZGlvbl0pO1xuICAgICAgICAgIGFjY29yZGlvbi50cmlnZ2VySGFuZGxlcigndG9nZ2xlZCcsIFt0YXJnZXRdKTtcbiAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoIXNldHRpbmdzLm11bHRpX2V4cGFuZCkge1xuICAgICAgICAgIHNpYmxpbmdzLnJlbW92ZUNsYXNzKHNldHRpbmdzLmFjdGl2ZV9jbGFzcyk7XG4gICAgICAgICAgYXVudHMucmVtb3ZlQ2xhc3Moc2V0dGluZ3MuYWN0aXZlX2NsYXNzKTtcbiAgICAgICAgICBhdW50cy5jaGlsZHJlbignYScpLmF0dHIoJ2FyaWEtZXhwYW5kZWQnLCdmYWxzZScpO1xuICAgICAgICB9XG5cbiAgICAgICAgdGFyZ2V0LmFkZENsYXNzKHNldHRpbmdzLmFjdGl2ZV9jbGFzcykucGFyZW50KCkuYWRkQ2xhc3Moc2V0dGluZ3MuYWN0aXZlX2NsYXNzKTtcbiAgICAgICAgc2V0dGluZ3MuY2FsbGJhY2sodGFyZ2V0KTtcbiAgICAgICAgdGFyZ2V0LnRyaWdnZXJIYW5kbGVyKCd0b2dnbGVkJywgW2FjY29yZGlvbl0pO1xuICAgICAgICBhY2NvcmRpb24udHJpZ2dlckhhbmRsZXIoJ3RvZ2dsZWQnLCBbdGFyZ2V0XSk7XG4gICAgICAgIFModGhpcykuYXR0cignYXJpYS1leHBhbmRlZCcsJ3RydWUnKTtcbiAgICAgIH0pO1xuICAgIH0sXG5cbiAgICBjcmVhdGU6IGZ1bmN0aW9uKCRpbnN0YW5jZSkge1xuICAgICAgdmFyIHNlbGYgPSB0aGlzLFxuICAgICAgICAgIGFjY29yZGlvbiA9ICRpbnN0YW5jZSxcbiAgICAgICAgICBhdW50cyA9ICQoJz4gLmFjY29yZGlvbi1uYXZpZ2F0aW9uJywgYWNjb3JkaW9uKSxcbiAgICAgICAgICBzZXR0aW5ncyA9IGFjY29yZGlvbi5kYXRhKHNlbGYuYXR0cl9uYW1lKHRydWUpICsgJy1pbml0JykgfHwgc2VsZi5zZXR0aW5ncztcblxuICAgICAgYXVudHMuY2hpbGRyZW4oJ2EnKS5hdHRyKCdhcmlhLWV4cGFuZGVkJywnZmFsc2UnKTtcbiAgICAgIGF1bnRzLmhhcygnLicgKyBzZXR0aW5ncy5jb250ZW50X2NsYXNzICsgJy4nICsgc2V0dGluZ3MuYWN0aXZlX2NsYXNzKS5jaGlsZHJlbignYScpLmF0dHIoJ2FyaWEtZXhwYW5kZWQnLCd0cnVlJyk7XG5cbiAgICAgIGlmIChzZXR0aW5ncy5tdWx0aV9leHBhbmQpIHtcbiAgICAgICAgJGluc3RhbmNlLmF0dHIoJ2FyaWEtbXVsdGlzZWxlY3RhYmxlJywndHJ1ZScpO1xuICAgICAgfVxuICAgIH0sXG5cbiAgICBvZmYgOiBmdW5jdGlvbiAoKSB7fSxcblxuICAgIHJlZmxvdyA6IGZ1bmN0aW9uICgpIHt9XG4gIH07XG59KGpRdWVyeSwgd2luZG93LCB3aW5kb3cuZG9jdW1lbnQpKTtcblxuOyhmdW5jdGlvbiAoJCwgd2luZG93LCBkb2N1bWVudCwgdW5kZWZpbmVkKSB7XG4gICd1c2Ugc3RyaWN0JztcblxuICBGb3VuZGF0aW9uLmxpYnMuYWxlcnQgPSB7XG4gICAgbmFtZSA6ICdhbGVydCcsXG5cbiAgICB2ZXJzaW9uIDogJzUuNS4yJyxcblxuICAgIHNldHRpbmdzIDoge1xuICAgICAgY2FsbGJhY2sgOiBmdW5jdGlvbiAoKSB7fVxuICAgIH0sXG5cbiAgICBpbml0IDogZnVuY3Rpb24gKHNjb3BlLCBtZXRob2QsIG9wdGlvbnMpIHtcbiAgICAgIHRoaXMuYmluZGluZ3MobWV0aG9kLCBvcHRpb25zKTtcbiAgICB9LFxuXG4gICAgZXZlbnRzIDogZnVuY3Rpb24gKCkge1xuICAgICAgdmFyIHNlbGYgPSB0aGlzLFxuICAgICAgICAgIFMgPSB0aGlzLlM7XG5cbiAgICAgICQodGhpcy5zY29wZSkub2ZmKCcuYWxlcnQnKS5vbignY2xpY2suZm5kdG4uYWxlcnQnLCAnWycgKyB0aGlzLmF0dHJfbmFtZSgpICsgJ10gLmNsb3NlJywgZnVuY3Rpb24gKGUpIHtcbiAgICAgICAgdmFyIGFsZXJ0Qm94ID0gUyh0aGlzKS5jbG9zZXN0KCdbJyArIHNlbGYuYXR0cl9uYW1lKCkgKyAnXScpLFxuICAgICAgICAgICAgc2V0dGluZ3MgPSBhbGVydEJveC5kYXRhKHNlbGYuYXR0cl9uYW1lKHRydWUpICsgJy1pbml0JykgfHwgc2VsZi5zZXR0aW5ncztcblxuICAgICAgICBlLnByZXZlbnREZWZhdWx0KCk7XG4gICAgICAgIGlmIChNb2Rlcm5penIuY3NzdHJhbnNpdGlvbnMpIHtcbiAgICAgICAgICBhbGVydEJveC5hZGRDbGFzcygnYWxlcnQtY2xvc2UnKTtcbiAgICAgICAgICBhbGVydEJveC5vbigndHJhbnNpdGlvbmVuZCB3ZWJraXRUcmFuc2l0aW9uRW5kIG9UcmFuc2l0aW9uRW5kJywgZnVuY3Rpb24gKGUpIHtcbiAgICAgICAgICAgIFModGhpcykudHJpZ2dlcignY2xvc2UuZm5kdG4uYWxlcnQnKS5yZW1vdmUoKTtcbiAgICAgICAgICAgIHNldHRpbmdzLmNhbGxiYWNrKCk7XG4gICAgICAgICAgfSk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgYWxlcnRCb3guZmFkZU91dCgzMDAsIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIFModGhpcykudHJpZ2dlcignY2xvc2UuZm5kdG4uYWxlcnQnKS5yZW1vdmUoKTtcbiAgICAgICAgICAgIHNldHRpbmdzLmNhbGxiYWNrKCk7XG4gICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgIH0sXG5cbiAgICByZWZsb3cgOiBmdW5jdGlvbiAoKSB7fVxuICB9O1xufShqUXVlcnksIHdpbmRvdywgd2luZG93LmRvY3VtZW50KSk7XG5cbjsoZnVuY3Rpb24gKCQsIHdpbmRvdywgZG9jdW1lbnQsIHVuZGVmaW5lZCkge1xuICAndXNlIHN0cmljdCc7XG5cbiAgRm91bmRhdGlvbi5saWJzLmNsZWFyaW5nID0ge1xuICAgIG5hbWUgOiAnY2xlYXJpbmcnLFxuXG4gICAgdmVyc2lvbiA6ICc1LjUuMicsXG5cbiAgICBzZXR0aW5ncyA6IHtcbiAgICAgIHRlbXBsYXRlcyA6IHtcbiAgICAgICAgdmlld2luZyA6ICc8YSBocmVmPVwiI1wiIGNsYXNzPVwiY2xlYXJpbmctY2xvc2VcIj4mdGltZXM7PC9hPicgK1xuICAgICAgICAgICc8ZGl2IGNsYXNzPVwidmlzaWJsZS1pbWdcIiBzdHlsZT1cImRpc3BsYXk6IG5vbmVcIj48ZGl2IGNsYXNzPVwiY2xlYXJpbmctdG91Y2gtbGFiZWxcIj48L2Rpdj48aW1nIHNyYz1cImRhdGE6aW1hZ2UvZ2lmO2Jhc2U2NCxSMGxHT0RsaEFRQUJBQUQvQUN3QUFBQUFBUUFCQUFBQ0FEcyUzRFwiIGFsdD1cIlwiIC8+JyArXG4gICAgICAgICAgJzxwIGNsYXNzPVwiY2xlYXJpbmctY2FwdGlvblwiPjwvcD48YSBocmVmPVwiI1wiIGNsYXNzPVwiY2xlYXJpbmctbWFpbi1wcmV2XCI+PHNwYW4+PC9zcGFuPjwvYT4nICtcbiAgICAgICAgICAnPGEgaHJlZj1cIiNcIiBjbGFzcz1cImNsZWFyaW5nLW1haW4tbmV4dFwiPjxzcGFuPjwvc3Bhbj48L2E+PC9kaXY+JyArXG4gICAgICAgICAgJzxpbWcgY2xhc3M9XCJjbGVhcmluZy1wcmVsb2FkLW5leHRcIiBzdHlsZT1cImRpc3BsYXk6IG5vbmVcIiBzcmM9XCJkYXRhOmltYWdlL2dpZjtiYXNlNjQsUjBsR09EbGhBUUFCQUFEL0FDd0FBQUFBQVFBQkFBQUNBRHMlM0RcIiBhbHQ9XCJcIiAvPicgK1xuICAgICAgICAgICc8aW1nIGNsYXNzPVwiY2xlYXJpbmctcHJlbG9hZC1wcmV2XCIgc3R5bGU9XCJkaXNwbGF5OiBub25lXCIgc3JjPVwiZGF0YTppbWFnZS9naWY7YmFzZTY0LFIwbEdPRGxoQVFBQkFBRC9BQ3dBQUFBQUFRQUJBQUFDQURzJTNEXCIgYWx0PVwiXCIgLz4nXG4gICAgICB9LFxuXG4gICAgICAvLyBjb21tYSBkZWxpbWl0ZWQgbGlzdCBvZiBzZWxlY3RvcnMgdGhhdCwgb24gY2xpY2ssIHdpbGwgY2xvc2UgY2xlYXJpbmcsXG4gICAgICAvLyBhZGQgJ2Rpdi5jbGVhcmluZy1ibGFja291dCwgZGl2LnZpc2libGUtaW1nJyB0byBjbG9zZSBvbiBiYWNrZ3JvdW5kIGNsaWNrXG4gICAgICBjbG9zZV9zZWxlY3RvcnMgOiAnLmNsZWFyaW5nLWNsb3NlLCBkaXYuY2xlYXJpbmctYmxhY2tvdXQnLFxuXG4gICAgICAvLyBEZWZhdWx0IHRvIHRoZSBlbnRpcmUgbGkgZWxlbWVudC5cbiAgICAgIG9wZW5fc2VsZWN0b3JzIDogJycsXG5cbiAgICAgIC8vIEltYWdlIHdpbGwgYmUgc2tpcHBlZCBpbiBjYXJvdXNlbC5cbiAgICAgIHNraXBfc2VsZWN0b3IgOiAnJyxcblxuICAgICAgdG91Y2hfbGFiZWwgOiAnJyxcblxuICAgICAgLy8gZXZlbnQgaW5pdGlhbGl6ZXJzIGFuZCBsb2Nrc1xuICAgICAgaW5pdCA6IGZhbHNlLFxuICAgICAgbG9ja2VkIDogZmFsc2VcbiAgICB9LFxuXG4gICAgaW5pdCA6IGZ1bmN0aW9uIChzY29wZSwgbWV0aG9kLCBvcHRpb25zKSB7XG4gICAgICB2YXIgc2VsZiA9IHRoaXM7XG4gICAgICBGb3VuZGF0aW9uLmluaGVyaXQodGhpcywgJ3Rocm90dGxlIGltYWdlX2xvYWRlZCcpO1xuXG4gICAgICB0aGlzLmJpbmRpbmdzKG1ldGhvZCwgb3B0aW9ucyk7XG5cbiAgICAgIGlmIChzZWxmLlModGhpcy5zY29wZSkuaXMoJ1snICsgdGhpcy5hdHRyX25hbWUoKSArICddJykpIHtcbiAgICAgICAgdGhpcy5hc3NlbWJsZShzZWxmLlMoJ2xpJywgdGhpcy5zY29wZSkpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgc2VsZi5TKCdbJyArIHRoaXMuYXR0cl9uYW1lKCkgKyAnXScsIHRoaXMuc2NvcGUpLmVhY2goZnVuY3Rpb24gKCkge1xuICAgICAgICAgIHNlbGYuYXNzZW1ibGUoc2VsZi5TKCdsaScsIHRoaXMpKTtcbiAgICAgICAgfSk7XG4gICAgICB9XG4gICAgfSxcblxuICAgIGV2ZW50cyA6IGZ1bmN0aW9uIChzY29wZSkge1xuICAgICAgdmFyIHNlbGYgPSB0aGlzLFxuICAgICAgICAgIFMgPSBzZWxmLlMsXG4gICAgICAgICAgJHNjcm9sbF9jb250YWluZXIgPSAkKCcuc2Nyb2xsLWNvbnRhaW5lcicpO1xuXG4gICAgICBpZiAoJHNjcm9sbF9jb250YWluZXIubGVuZ3RoID4gMCkge1xuICAgICAgICB0aGlzLnNjb3BlID0gJHNjcm9sbF9jb250YWluZXI7XG4gICAgICB9XG5cbiAgICAgIFModGhpcy5zY29wZSlcbiAgICAgICAgLm9mZignLmNsZWFyaW5nJylcbiAgICAgICAgLm9uKCdjbGljay5mbmR0bi5jbGVhcmluZycsICd1bFsnICsgdGhpcy5hdHRyX25hbWUoKSArICddIGxpICcgKyB0aGlzLnNldHRpbmdzLm9wZW5fc2VsZWN0b3JzLFxuICAgICAgICAgIGZ1bmN0aW9uIChlLCBjdXJyZW50LCB0YXJnZXQpIHtcbiAgICAgICAgICAgIHZhciBjdXJyZW50ID0gY3VycmVudCB8fCBTKHRoaXMpLFxuICAgICAgICAgICAgICAgIHRhcmdldCA9IHRhcmdldCB8fCBjdXJyZW50LFxuICAgICAgICAgICAgICAgIG5leHQgPSBjdXJyZW50Lm5leHQoJ2xpJyksXG4gICAgICAgICAgICAgICAgc2V0dGluZ3MgPSBjdXJyZW50LmNsb3Nlc3QoJ1snICsgc2VsZi5hdHRyX25hbWUoKSArICddJykuZGF0YShzZWxmLmF0dHJfbmFtZSh0cnVlKSArICctaW5pdCcpLFxuICAgICAgICAgICAgICAgIGltYWdlID0gUyhlLnRhcmdldCk7XG5cbiAgICAgICAgICAgIGUucHJldmVudERlZmF1bHQoKTtcblxuICAgICAgICAgICAgaWYgKCFzZXR0aW5ncykge1xuICAgICAgICAgICAgICBzZWxmLmluaXQoKTtcbiAgICAgICAgICAgICAgc2V0dGluZ3MgPSBjdXJyZW50LmNsb3Nlc3QoJ1snICsgc2VsZi5hdHRyX25hbWUoKSArICddJykuZGF0YShzZWxmLmF0dHJfbmFtZSh0cnVlKSArICctaW5pdCcpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAvLyBpZiBjbGVhcmluZyBpcyBvcGVuIGFuZCB0aGUgY3VycmVudCBpbWFnZSBpc1xuICAgICAgICAgICAgLy8gY2xpY2tlZCwgZ28gdG8gdGhlIG5leHQgaW1hZ2UgaW4gc2VxdWVuY2VcbiAgICAgICAgICAgIGlmICh0YXJnZXQuaGFzQ2xhc3MoJ3Zpc2libGUnKSAmJlxuICAgICAgICAgICAgICBjdXJyZW50WzBdID09PSB0YXJnZXRbMF0gJiZcbiAgICAgICAgICAgICAgbmV4dC5sZW5ndGggPiAwICYmIHNlbGYuaXNfb3BlbihjdXJyZW50KSkge1xuICAgICAgICAgICAgICB0YXJnZXQgPSBuZXh0O1xuICAgICAgICAgICAgICBpbWFnZSA9IFMoJ2ltZycsIHRhcmdldCk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIC8vIHNldCBjdXJyZW50IGFuZCB0YXJnZXQgdG8gdGhlIGNsaWNrZWQgbGkgaWYgbm90IG90aGVyd2lzZSBkZWZpbmVkLlxuICAgICAgICAgICAgc2VsZi5vcGVuKGltYWdlLCBjdXJyZW50LCB0YXJnZXQpO1xuICAgICAgICAgICAgc2VsZi51cGRhdGVfcGFkZGxlcyh0YXJnZXQpO1xuICAgICAgICAgIH0pXG5cbiAgICAgICAgLm9uKCdjbGljay5mbmR0bi5jbGVhcmluZycsICcuY2xlYXJpbmctbWFpbi1uZXh0JyxcbiAgICAgICAgICBmdW5jdGlvbiAoZSkgeyBzZWxmLm5hdihlLCAnbmV4dCcpIH0pXG4gICAgICAgIC5vbignY2xpY2suZm5kdG4uY2xlYXJpbmcnLCAnLmNsZWFyaW5nLW1haW4tcHJldicsXG4gICAgICAgICAgZnVuY3Rpb24gKGUpIHsgc2VsZi5uYXYoZSwgJ3ByZXYnKSB9KVxuICAgICAgICAub24oJ2NsaWNrLmZuZHRuLmNsZWFyaW5nJywgdGhpcy5zZXR0aW5ncy5jbG9zZV9zZWxlY3RvcnMsXG4gICAgICAgICAgZnVuY3Rpb24gKGUpIHsgRm91bmRhdGlvbi5saWJzLmNsZWFyaW5nLmNsb3NlKGUsIHRoaXMpIH0pO1xuXG4gICAgICAkKGRvY3VtZW50KS5vbigna2V5ZG93bi5mbmR0bi5jbGVhcmluZycsXG4gICAgICAgICAgZnVuY3Rpb24gKGUpIHsgc2VsZi5rZXlkb3duKGUpIH0pO1xuXG4gICAgICBTKHdpbmRvdykub2ZmKCcuY2xlYXJpbmcnKS5vbigncmVzaXplLmZuZHRuLmNsZWFyaW5nJyxcbiAgICAgICAgZnVuY3Rpb24gKCkgeyBzZWxmLnJlc2l6ZSgpIH0pO1xuXG4gICAgICB0aGlzLnN3aXBlX2V2ZW50cyhzY29wZSk7XG4gICAgfSxcblxuICAgIHN3aXBlX2V2ZW50cyA6IGZ1bmN0aW9uIChzY29wZSkge1xuICAgICAgdmFyIHNlbGYgPSB0aGlzLFxuICAgICAgUyA9IHNlbGYuUztcblxuICAgICAgUyh0aGlzLnNjb3BlKVxuICAgICAgICAub24oJ3RvdWNoc3RhcnQuZm5kdG4uY2xlYXJpbmcnLCAnLnZpc2libGUtaW1nJywgZnVuY3Rpb24gKGUpIHtcbiAgICAgICAgICBpZiAoIWUudG91Y2hlcykgeyBlID0gZS5vcmlnaW5hbEV2ZW50OyB9XG4gICAgICAgICAgdmFyIGRhdGEgPSB7XG4gICAgICAgICAgICAgICAgc3RhcnRfcGFnZV94IDogZS50b3VjaGVzWzBdLnBhZ2VYLFxuICAgICAgICAgICAgICAgIHN0YXJ0X3BhZ2VfeSA6IGUudG91Y2hlc1swXS5wYWdlWSxcbiAgICAgICAgICAgICAgICBzdGFydF90aW1lIDogKG5ldyBEYXRlKCkpLmdldFRpbWUoKSxcbiAgICAgICAgICAgICAgICBkZWx0YV94IDogMCxcbiAgICAgICAgICAgICAgICBpc19zY3JvbGxpbmcgOiB1bmRlZmluZWRcbiAgICAgICAgICAgICAgfTtcblxuICAgICAgICAgIFModGhpcykuZGF0YSgnc3dpcGUtdHJhbnNpdGlvbicsIGRhdGEpO1xuICAgICAgICAgIGUuc3RvcFByb3BhZ2F0aW9uKCk7XG4gICAgICAgIH0pXG4gICAgICAgIC5vbigndG91Y2htb3ZlLmZuZHRuLmNsZWFyaW5nJywgJy52aXNpYmxlLWltZycsIGZ1bmN0aW9uIChlKSB7XG4gICAgICAgICAgaWYgKCFlLnRvdWNoZXMpIHtcbiAgICAgICAgICAgIGUgPSBlLm9yaWdpbmFsRXZlbnQ7XG4gICAgICAgICAgfVxuICAgICAgICAgIC8vIElnbm9yZSBwaW5jaC96b29tIGV2ZW50c1xuICAgICAgICAgIGlmIChlLnRvdWNoZXMubGVuZ3RoID4gMSB8fCBlLnNjYWxlICYmIGUuc2NhbGUgIT09IDEpIHtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICB9XG5cbiAgICAgICAgICB2YXIgZGF0YSA9IFModGhpcykuZGF0YSgnc3dpcGUtdHJhbnNpdGlvbicpO1xuXG4gICAgICAgICAgaWYgKHR5cGVvZiBkYXRhID09PSAndW5kZWZpbmVkJykge1xuICAgICAgICAgICAgZGF0YSA9IHt9O1xuICAgICAgICAgIH1cblxuICAgICAgICAgIGRhdGEuZGVsdGFfeCA9IGUudG91Y2hlc1swXS5wYWdlWCAtIGRhdGEuc3RhcnRfcGFnZV94O1xuXG4gICAgICAgICAgaWYgKEZvdW5kYXRpb24ucnRsKSB7XG4gICAgICAgICAgICBkYXRhLmRlbHRhX3ggPSAtZGF0YS5kZWx0YV94O1xuICAgICAgICAgIH1cblxuICAgICAgICAgIGlmICh0eXBlb2YgZGF0YS5pc19zY3JvbGxpbmcgPT09ICd1bmRlZmluZWQnKSB7XG4gICAgICAgICAgICBkYXRhLmlzX3Njcm9sbGluZyA9ICEhKCBkYXRhLmlzX3Njcm9sbGluZyB8fCBNYXRoLmFicyhkYXRhLmRlbHRhX3gpIDwgTWF0aC5hYnMoZS50b3VjaGVzWzBdLnBhZ2VZIC0gZGF0YS5zdGFydF9wYWdlX3kpICk7XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgaWYgKCFkYXRhLmlzX3Njcm9sbGluZyAmJiAhZGF0YS5hY3RpdmUpIHtcbiAgICAgICAgICAgIGUucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgICAgIHZhciBkaXJlY3Rpb24gPSAoZGF0YS5kZWx0YV94IDwgMCkgPyAnbmV4dCcgOiAncHJldic7XG4gICAgICAgICAgICBkYXRhLmFjdGl2ZSA9IHRydWU7XG4gICAgICAgICAgICBzZWxmLm5hdihlLCBkaXJlY3Rpb24pO1xuICAgICAgICAgIH1cbiAgICAgICAgfSlcbiAgICAgICAgLm9uKCd0b3VjaGVuZC5mbmR0bi5jbGVhcmluZycsICcudmlzaWJsZS1pbWcnLCBmdW5jdGlvbiAoZSkge1xuICAgICAgICAgIFModGhpcykuZGF0YSgnc3dpcGUtdHJhbnNpdGlvbicsIHt9KTtcbiAgICAgICAgICBlLnN0b3BQcm9wYWdhdGlvbigpO1xuICAgICAgICB9KTtcbiAgICB9LFxuXG4gICAgYXNzZW1ibGUgOiBmdW5jdGlvbiAoJGxpKSB7XG4gICAgICB2YXIgJGVsID0gJGxpLnBhcmVudCgpO1xuXG4gICAgICBpZiAoJGVsLnBhcmVudCgpLmhhc0NsYXNzKCdjYXJvdXNlbCcpKSB7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cblxuICAgICAgJGVsLmFmdGVyKCc8ZGl2IGlkPVwiZm91bmRhdGlvbkNsZWFyaW5nSG9sZGVyXCI+PC9kaXY+Jyk7XG5cbiAgICAgIHZhciBncmlkID0gJGVsLmRldGFjaCgpLFxuICAgICAgICAgIGdyaWRfb3V0ZXJIVE1MID0gJyc7XG5cbiAgICAgIGlmIChncmlkWzBdID09IG51bGwpIHtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgZ3JpZF9vdXRlckhUTUwgPSBncmlkWzBdLm91dGVySFRNTDtcbiAgICAgIH1cblxuICAgICAgdmFyIGhvbGRlciA9IHRoaXMuUygnI2ZvdW5kYXRpb25DbGVhcmluZ0hvbGRlcicpLFxuICAgICAgICAgIHNldHRpbmdzID0gJGVsLmRhdGEodGhpcy5hdHRyX25hbWUodHJ1ZSkgKyAnLWluaXQnKSxcbiAgICAgICAgICBkYXRhID0ge1xuICAgICAgICAgICAgZ3JpZCA6ICc8ZGl2IGNsYXNzPVwiY2Fyb3VzZWxcIj4nICsgZ3JpZF9vdXRlckhUTUwgKyAnPC9kaXY+JyxcbiAgICAgICAgICAgIHZpZXdpbmcgOiBzZXR0aW5ncy50ZW1wbGF0ZXMudmlld2luZ1xuICAgICAgICAgIH0sXG4gICAgICAgICAgd3JhcHBlciA9ICc8ZGl2IGNsYXNzPVwiY2xlYXJpbmctYXNzZW1ibGVkXCI+PGRpdj4nICsgZGF0YS52aWV3aW5nICtcbiAgICAgICAgICAgIGRhdGEuZ3JpZCArICc8L2Rpdj48L2Rpdj4nLFxuICAgICAgICAgIHRvdWNoX2xhYmVsID0gdGhpcy5zZXR0aW5ncy50b3VjaF9sYWJlbDtcblxuICAgICAgaWYgKE1vZGVybml6ci50b3VjaCkge1xuICAgICAgICB3cmFwcGVyID0gJCh3cmFwcGVyKS5maW5kKCcuY2xlYXJpbmctdG91Y2gtbGFiZWwnKS5odG1sKHRvdWNoX2xhYmVsKS5lbmQoKTtcbiAgICAgIH1cblxuICAgICAgaG9sZGVyLmFmdGVyKHdyYXBwZXIpLnJlbW92ZSgpO1xuICAgIH0sXG5cbiAgICBvcGVuIDogZnVuY3Rpb24gKCRpbWFnZSwgY3VycmVudCwgdGFyZ2V0KSB7XG4gICAgICB2YXIgc2VsZiA9IHRoaXMsXG4gICAgICAgICAgYm9keSA9ICQoZG9jdW1lbnQuYm9keSksXG4gICAgICAgICAgcm9vdCA9IHRhcmdldC5jbG9zZXN0KCcuY2xlYXJpbmctYXNzZW1ibGVkJyksXG4gICAgICAgICAgY29udGFpbmVyID0gc2VsZi5TKCdkaXYnLCByb290KS5maXJzdCgpLFxuICAgICAgICAgIHZpc2libGVfaW1hZ2UgPSBzZWxmLlMoJy52aXNpYmxlLWltZycsIGNvbnRhaW5lciksXG4gICAgICAgICAgaW1hZ2UgPSBzZWxmLlMoJ2ltZycsIHZpc2libGVfaW1hZ2UpLm5vdCgkaW1hZ2UpLFxuICAgICAgICAgIGxhYmVsID0gc2VsZi5TKCcuY2xlYXJpbmctdG91Y2gtbGFiZWwnLCBjb250YWluZXIpLFxuICAgICAgICAgIGVycm9yID0gZmFsc2UsXG4gICAgICAgICAgbG9hZGVkID0ge307XG5cbiAgICAgIC8vIEV2ZW50IHRvIGRpc2FibGUgc2Nyb2xsaW5nIG9uIHRvdWNoIGRldmljZXMgd2hlbiBDbGVhcmluZyBpcyBhY3RpdmF0ZWRcbiAgICAgICQoJ2JvZHknKS5vbigndG91Y2htb3ZlJywgZnVuY3Rpb24gKGUpIHtcbiAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgfSk7XG5cbiAgICAgIGltYWdlLmVycm9yKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgZXJyb3IgPSB0cnVlO1xuICAgICAgfSk7XG5cbiAgICAgIGZ1bmN0aW9uIHN0YXJ0TG9hZCgpIHtcbiAgICAgICAgc2V0VGltZW91dChmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgdGhpcy5pbWFnZV9sb2FkZWQoaW1hZ2UsIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIGlmIChpbWFnZS5vdXRlcldpZHRoKCkgPT09IDEgJiYgIWVycm9yKSB7XG4gICAgICAgICAgICAgIHN0YXJ0TG9hZC5jYWxsKHRoaXMpO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgY2IuY2FsbCh0aGlzLCBpbWFnZSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfS5iaW5kKHRoaXMpKTtcbiAgICAgICAgfS5iaW5kKHRoaXMpLCAxMDApO1xuICAgICAgfVxuXG4gICAgICBmdW5jdGlvbiBjYiAoaW1hZ2UpIHtcbiAgICAgICAgdmFyICRpbWFnZSA9ICQoaW1hZ2UpO1xuICAgICAgICAkaW1hZ2UuY3NzKCd2aXNpYmlsaXR5JywgJ3Zpc2libGUnKTtcbiAgICAgICAgJGltYWdlLnRyaWdnZXIoJ2ltYWdlVmlzaWJsZScpO1xuICAgICAgICAvLyB0b2dnbGUgdGhlIGdhbGxlcnlcbiAgICAgICAgYm9keS5jc3MoJ292ZXJmbG93JywgJ2hpZGRlbicpO1xuICAgICAgICByb290LmFkZENsYXNzKCdjbGVhcmluZy1ibGFja291dCcpO1xuICAgICAgICBjb250YWluZXIuYWRkQ2xhc3MoJ2NsZWFyaW5nLWNvbnRhaW5lcicpO1xuICAgICAgICB2aXNpYmxlX2ltYWdlLnNob3coKTtcbiAgICAgICAgdGhpcy5maXhfaGVpZ2h0KHRhcmdldClcbiAgICAgICAgICAuY2FwdGlvbihzZWxmLlMoJy5jbGVhcmluZy1jYXB0aW9uJywgdmlzaWJsZV9pbWFnZSksIHNlbGYuUygnaW1nJywgdGFyZ2V0KSlcbiAgICAgICAgICAuY2VudGVyX2FuZF9sYWJlbChpbWFnZSwgbGFiZWwpXG4gICAgICAgICAgLnNoaWZ0KGN1cnJlbnQsIHRhcmdldCwgZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgdGFyZ2V0LmNsb3Nlc3QoJ2xpJykuc2libGluZ3MoKS5yZW1vdmVDbGFzcygndmlzaWJsZScpO1xuICAgICAgICAgICAgdGFyZ2V0LmNsb3Nlc3QoJ2xpJykuYWRkQ2xhc3MoJ3Zpc2libGUnKTtcbiAgICAgICAgICB9KTtcbiAgICAgICAgdmlzaWJsZV9pbWFnZS50cmlnZ2VyKCdvcGVuZWQuZm5kdG4uY2xlYXJpbmcnKVxuICAgICAgfVxuXG4gICAgICBpZiAoIXRoaXMubG9ja2VkKCkpIHtcbiAgICAgICAgdmlzaWJsZV9pbWFnZS50cmlnZ2VyKCdvcGVuLmZuZHRuLmNsZWFyaW5nJyk7XG4gICAgICAgIC8vIHNldCB0aGUgaW1hZ2UgdG8gdGhlIHNlbGVjdGVkIHRodW1ibmFpbFxuICAgICAgICBsb2FkZWQgPSB0aGlzLmxvYWQoJGltYWdlKTtcbiAgICAgICAgaWYgKGxvYWRlZC5pbnRlcmNoYW5nZSkge1xuICAgICAgICAgIGltYWdlXG4gICAgICAgICAgICAuYXR0cignZGF0YS1pbnRlcmNoYW5nZScsIGxvYWRlZC5pbnRlcmNoYW5nZSlcbiAgICAgICAgICAgIC5mb3VuZGF0aW9uKCdpbnRlcmNoYW5nZScsICdyZWZsb3cnKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBpbWFnZVxuICAgICAgICAgICAgLmF0dHIoJ3NyYycsIGxvYWRlZC5zcmMpXG4gICAgICAgICAgICAuYXR0cignZGF0YS1pbnRlcmNoYW5nZScsICcnKTtcbiAgICAgICAgfVxuICAgICAgICBpbWFnZS5jc3MoJ3Zpc2liaWxpdHknLCAnaGlkZGVuJyk7XG5cbiAgICAgICAgc3RhcnRMb2FkLmNhbGwodGhpcyk7XG4gICAgICB9XG4gICAgfSxcblxuICAgIGNsb3NlIDogZnVuY3Rpb24gKGUsIGVsKSB7XG4gICAgICBlLnByZXZlbnREZWZhdWx0KCk7XG5cbiAgICAgIHZhciByb290ID0gKGZ1bmN0aW9uICh0YXJnZXQpIHtcbiAgICAgICAgICAgIGlmICgvYmxhY2tvdXQvLnRlc3QodGFyZ2V0LnNlbGVjdG9yKSkge1xuICAgICAgICAgICAgICByZXR1cm4gdGFyZ2V0O1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgcmV0dXJuIHRhcmdldC5jbG9zZXN0KCcuY2xlYXJpbmctYmxhY2tvdXQnKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9KCQoZWwpKSksXG4gICAgICAgICAgYm9keSA9ICQoZG9jdW1lbnQuYm9keSksIGNvbnRhaW5lciwgdmlzaWJsZV9pbWFnZTtcblxuICAgICAgaWYgKGVsID09PSBlLnRhcmdldCAmJiByb290KSB7XG4gICAgICAgIGJvZHkuY3NzKCdvdmVyZmxvdycsICcnKTtcbiAgICAgICAgY29udGFpbmVyID0gJCgnZGl2Jywgcm9vdCkuZmlyc3QoKTtcbiAgICAgICAgdmlzaWJsZV9pbWFnZSA9ICQoJy52aXNpYmxlLWltZycsIGNvbnRhaW5lcik7XG4gICAgICAgIHZpc2libGVfaW1hZ2UudHJpZ2dlcignY2xvc2UuZm5kdG4uY2xlYXJpbmcnKTtcbiAgICAgICAgdGhpcy5zZXR0aW5ncy5wcmV2X2luZGV4ID0gMDtcbiAgICAgICAgJCgndWxbJyArIHRoaXMuYXR0cl9uYW1lKCkgKyAnXScsIHJvb3QpXG4gICAgICAgICAgLmF0dHIoJ3N0eWxlJywgJycpLmNsb3Nlc3QoJy5jbGVhcmluZy1ibGFja291dCcpXG4gICAgICAgICAgLnJlbW92ZUNsYXNzKCdjbGVhcmluZy1ibGFja291dCcpO1xuICAgICAgICBjb250YWluZXIucmVtb3ZlQ2xhc3MoJ2NsZWFyaW5nLWNvbnRhaW5lcicpO1xuICAgICAgICB2aXNpYmxlX2ltYWdlLmhpZGUoKTtcbiAgICAgICAgdmlzaWJsZV9pbWFnZS50cmlnZ2VyKCdjbG9zZWQuZm5kdG4uY2xlYXJpbmcnKTtcbiAgICAgIH1cblxuICAgICAgLy8gRXZlbnQgdG8gcmUtZW5hYmxlIHNjcm9sbGluZyBvbiB0b3VjaCBkZXZpY2VzXG4gICAgICAkKCdib2R5Jykub2ZmKCd0b3VjaG1vdmUnKTtcblxuICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH0sXG5cbiAgICBpc19vcGVuIDogZnVuY3Rpb24gKGN1cnJlbnQpIHtcbiAgICAgIHJldHVybiBjdXJyZW50LnBhcmVudCgpLnByb3AoJ3N0eWxlJykubGVuZ3RoID4gMDtcbiAgICB9LFxuXG4gICAga2V5ZG93biA6IGZ1bmN0aW9uIChlKSB7XG4gICAgICB2YXIgY2xlYXJpbmcgPSAkKCcuY2xlYXJpbmctYmxhY2tvdXQgdWxbJyArIHRoaXMuYXR0cl9uYW1lKCkgKyAnXScpLFxuICAgICAgICAgIE5FWFRfS0VZID0gdGhpcy5ydGwgPyAzNyA6IDM5LFxuICAgICAgICAgIFBSRVZfS0VZID0gdGhpcy5ydGwgPyAzOSA6IDM3LFxuICAgICAgICAgIEVTQ19LRVkgPSAyNztcblxuICAgICAgaWYgKGUud2hpY2ggPT09IE5FWFRfS0VZKSB7XG4gICAgICAgIHRoaXMuZ28oY2xlYXJpbmcsICduZXh0Jyk7XG4gICAgICB9XG4gICAgICBpZiAoZS53aGljaCA9PT0gUFJFVl9LRVkpIHtcbiAgICAgICAgdGhpcy5nbyhjbGVhcmluZywgJ3ByZXYnKTtcbiAgICAgIH1cbiAgICAgIGlmIChlLndoaWNoID09PSBFU0NfS0VZKSB7XG4gICAgICAgIHRoaXMuUygnYS5jbGVhcmluZy1jbG9zZScpLnRyaWdnZXIoJ2NsaWNrLmZuZHRuLmNsZWFyaW5nJyk7XG4gICAgICB9XG4gICAgfSxcblxuICAgIG5hdiA6IGZ1bmN0aW9uIChlLCBkaXJlY3Rpb24pIHtcbiAgICAgIHZhciBjbGVhcmluZyA9ICQoJ3VsWycgKyB0aGlzLmF0dHJfbmFtZSgpICsgJ10nLCAnLmNsZWFyaW5nLWJsYWNrb3V0Jyk7XG5cbiAgICAgIGUucHJldmVudERlZmF1bHQoKTtcbiAgICAgIHRoaXMuZ28oY2xlYXJpbmcsIGRpcmVjdGlvbik7XG4gICAgfSxcblxuICAgIHJlc2l6ZSA6IGZ1bmN0aW9uICgpIHtcbiAgICAgIHZhciBpbWFnZSA9ICQoJ2ltZycsICcuY2xlYXJpbmctYmxhY2tvdXQgLnZpc2libGUtaW1nJyksXG4gICAgICAgICAgbGFiZWwgPSAkKCcuY2xlYXJpbmctdG91Y2gtbGFiZWwnLCAnLmNsZWFyaW5nLWJsYWNrb3V0Jyk7XG5cbiAgICAgIGlmIChpbWFnZS5sZW5ndGgpIHtcbiAgICAgICAgdGhpcy5jZW50ZXJfYW5kX2xhYmVsKGltYWdlLCBsYWJlbCk7XG4gICAgICAgIGltYWdlLnRyaWdnZXIoJ3Jlc2l6ZWQuZm5kdG4uY2xlYXJpbmcnKVxuICAgICAgfVxuICAgIH0sXG5cbiAgICAvLyB2aXN1YWwgYWRqdXN0bWVudHNcbiAgICBmaXhfaGVpZ2h0IDogZnVuY3Rpb24gKHRhcmdldCkge1xuICAgICAgdmFyIGxpcyA9IHRhcmdldC5wYXJlbnQoKS5jaGlsZHJlbigpLFxuICAgICAgICAgIHNlbGYgPSB0aGlzO1xuXG4gICAgICBsaXMuZWFjaChmdW5jdGlvbiAoKSB7XG4gICAgICAgIHZhciBsaSA9IHNlbGYuUyh0aGlzKSxcbiAgICAgICAgICAgIGltYWdlID0gbGkuZmluZCgnaW1nJyk7XG5cbiAgICAgICAgaWYgKGxpLmhlaWdodCgpID4gaW1hZ2Uub3V0ZXJIZWlnaHQoKSkge1xuICAgICAgICAgIGxpLmFkZENsYXNzKCdmaXgtaGVpZ2h0Jyk7XG4gICAgICAgIH1cbiAgICAgIH0pXG4gICAgICAuY2xvc2VzdCgndWwnKVxuICAgICAgLndpZHRoKGxpcy5sZW5ndGggKiAxMDAgKyAnJScpO1xuXG4gICAgICByZXR1cm4gdGhpcztcbiAgICB9LFxuXG4gICAgdXBkYXRlX3BhZGRsZXMgOiBmdW5jdGlvbiAodGFyZ2V0KSB7XG4gICAgICB0YXJnZXQgPSB0YXJnZXQuY2xvc2VzdCgnbGknKTtcbiAgICAgIHZhciB2aXNpYmxlX2ltYWdlID0gdGFyZ2V0XG4gICAgICAgIC5jbG9zZXN0KCcuY2Fyb3VzZWwnKVxuICAgICAgICAuc2libGluZ3MoJy52aXNpYmxlLWltZycpO1xuXG4gICAgICBpZiAodGFyZ2V0Lm5leHQoKS5sZW5ndGggPiAwKSB7XG4gICAgICAgIHRoaXMuUygnLmNsZWFyaW5nLW1haW4tbmV4dCcsIHZpc2libGVfaW1hZ2UpLnJlbW92ZUNsYXNzKCdkaXNhYmxlZCcpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdGhpcy5TKCcuY2xlYXJpbmctbWFpbi1uZXh0JywgdmlzaWJsZV9pbWFnZSkuYWRkQ2xhc3MoJ2Rpc2FibGVkJyk7XG4gICAgICB9XG5cbiAgICAgIGlmICh0YXJnZXQucHJldigpLmxlbmd0aCA+IDApIHtcbiAgICAgICAgdGhpcy5TKCcuY2xlYXJpbmctbWFpbi1wcmV2JywgdmlzaWJsZV9pbWFnZSkucmVtb3ZlQ2xhc3MoJ2Rpc2FibGVkJyk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB0aGlzLlMoJy5jbGVhcmluZy1tYWluLXByZXYnLCB2aXNpYmxlX2ltYWdlKS5hZGRDbGFzcygnZGlzYWJsZWQnKTtcbiAgICAgIH1cbiAgICB9LFxuXG4gICAgY2VudGVyX2FuZF9sYWJlbCA6IGZ1bmN0aW9uICh0YXJnZXQsIGxhYmVsKSB7XG4gICAgICBpZiAoIXRoaXMucnRsICYmIGxhYmVsLmxlbmd0aCA+IDApIHtcbiAgICAgICAgbGFiZWwuY3NzKHtcbiAgICAgICAgICBtYXJnaW5MZWZ0IDogLShsYWJlbC5vdXRlcldpZHRoKCkgLyAyKSxcbiAgICAgICAgICBtYXJnaW5Ub3AgOiAtKHRhcmdldC5vdXRlckhlaWdodCgpIC8gMiktbGFiZWwub3V0ZXJIZWlnaHQoKS0xMFxuICAgICAgICB9KTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGxhYmVsLmNzcyh7XG4gICAgICAgICAgbWFyZ2luUmlnaHQgOiAtKGxhYmVsLm91dGVyV2lkdGgoKSAvIDIpLFxuICAgICAgICAgIG1hcmdpblRvcCA6IC0odGFyZ2V0Lm91dGVySGVpZ2h0KCkgLyAyKS1sYWJlbC5vdXRlckhlaWdodCgpLTEwLFxuICAgICAgICAgIGxlZnQ6ICdhdXRvJyxcbiAgICAgICAgICByaWdodDogJzUwJSdcbiAgICAgICAgfSk7XG4gICAgICB9XG4gICAgICByZXR1cm4gdGhpcztcbiAgICB9LFxuXG4gICAgLy8gaW1hZ2UgbG9hZGluZyBhbmQgcHJlbG9hZGluZ1xuXG4gICAgbG9hZCA6IGZ1bmN0aW9uICgkaW1hZ2UpIHtcbiAgICAgIHZhciBocmVmLFxuICAgICAgICAgIGludGVyY2hhbmdlLFxuICAgICAgICAgIGNsb3Nlc3RfYTtcblxuICAgICAgaWYgKCRpbWFnZVswXS5ub2RlTmFtZSA9PT0gJ0EnKSB7XG4gICAgICAgIGhyZWYgPSAkaW1hZ2UuYXR0cignaHJlZicpO1xuICAgICAgICBpbnRlcmNoYW5nZSA9ICRpbWFnZS5kYXRhKCdjbGVhcmluZy1pbnRlcmNoYW5nZScpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgY2xvc2VzdF9hID0gJGltYWdlLmNsb3Nlc3QoJ2EnKTtcbiAgICAgICAgaHJlZiA9IGNsb3Nlc3RfYS5hdHRyKCdocmVmJyk7XG4gICAgICAgIGludGVyY2hhbmdlID0gY2xvc2VzdF9hLmRhdGEoJ2NsZWFyaW5nLWludGVyY2hhbmdlJyk7XG4gICAgICB9XG5cbiAgICAgIHRoaXMucHJlbG9hZCgkaW1hZ2UpO1xuXG4gICAgICByZXR1cm4ge1xuICAgICAgICAnc3JjJzogaHJlZiA/IGhyZWYgOiAkaW1hZ2UuYXR0cignc3JjJyksXG4gICAgICAgICdpbnRlcmNoYW5nZSc6IGhyZWYgPyBpbnRlcmNoYW5nZSA6ICRpbWFnZS5kYXRhKCdjbGVhcmluZy1pbnRlcmNoYW5nZScpXG4gICAgICB9XG4gICAgfSxcblxuICAgIHByZWxvYWQgOiBmdW5jdGlvbiAoJGltYWdlKSB7XG4gICAgICB0aGlzXG4gICAgICAgIC5pbWcoJGltYWdlLmNsb3Nlc3QoJ2xpJykubmV4dCgpLCAnbmV4dCcpXG4gICAgICAgIC5pbWcoJGltYWdlLmNsb3Nlc3QoJ2xpJykucHJldigpLCAncHJldicpO1xuICAgIH0sXG5cbiAgICBpbWcgOiBmdW5jdGlvbiAoaW1nLCBzaWJsaW5nX3R5cGUpIHtcbiAgICAgIGlmIChpbWcubGVuZ3RoKSB7XG4gICAgICAgIHZhciBwcmVsb2FkX2ltZyA9ICQoJy5jbGVhcmluZy1wcmVsb2FkLScgKyBzaWJsaW5nX3R5cGUpLFxuICAgICAgICAgICAgbmV3X2EgPSB0aGlzLlMoJ2EnLCBpbWcpLFxuICAgICAgICAgICAgc3JjLFxuICAgICAgICAgICAgaW50ZXJjaGFuZ2UsXG4gICAgICAgICAgICBpbWFnZTtcblxuICAgICAgICBpZiAobmV3X2EubGVuZ3RoKSB7XG4gICAgICAgICAgc3JjID0gbmV3X2EuYXR0cignaHJlZicpO1xuICAgICAgICAgIGludGVyY2hhbmdlID0gbmV3X2EuZGF0YSgnY2xlYXJpbmctaW50ZXJjaGFuZ2UnKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBpbWFnZSA9IHRoaXMuUygnaW1nJywgaW1nKTtcbiAgICAgICAgICBzcmMgPSBpbWFnZS5hdHRyKCdzcmMnKTtcbiAgICAgICAgICBpbnRlcmNoYW5nZSA9IGltYWdlLmRhdGEoJ2NsZWFyaW5nLWludGVyY2hhbmdlJyk7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoaW50ZXJjaGFuZ2UpIHtcbiAgICAgICAgICBwcmVsb2FkX2ltZy5hdHRyKCdkYXRhLWludGVyY2hhbmdlJywgaW50ZXJjaGFuZ2UpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHByZWxvYWRfaW1nLmF0dHIoJ3NyYycsIHNyYyk7XG4gICAgICAgICAgcHJlbG9hZF9pbWcuYXR0cignZGF0YS1pbnRlcmNoYW5nZScsICcnKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfSxcblxuICAgIC8vIGltYWdlIGNhcHRpb25cblxuICAgIGNhcHRpb24gOiBmdW5jdGlvbiAoY29udGFpbmVyLCAkaW1hZ2UpIHtcbiAgICAgIHZhciBjYXB0aW9uID0gJGltYWdlLmF0dHIoJ2RhdGEtY2FwdGlvbicpO1xuXG4gICAgICBpZiAoY2FwdGlvbikge1xuICAgICAgICBjb250YWluZXJcbiAgICAgICAgICAuaHRtbChjYXB0aW9uKVxuICAgICAgICAgIC5zaG93KCk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBjb250YWluZXJcbiAgICAgICAgICAudGV4dCgnJylcbiAgICAgICAgICAuaGlkZSgpO1xuICAgICAgfVxuICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfSxcblxuICAgIC8vIGRpcmVjdGlvbmFsIG1ldGhvZHNcblxuICAgIGdvIDogZnVuY3Rpb24gKCR1bCwgZGlyZWN0aW9uKSB7XG4gICAgICB2YXIgY3VycmVudCA9IHRoaXMuUygnLnZpc2libGUnLCAkdWwpLFxuICAgICAgICAgIHRhcmdldCA9IGN1cnJlbnRbZGlyZWN0aW9uXSgpO1xuXG4gICAgICAvLyBDaGVjayBmb3Igc2tpcCBzZWxlY3Rvci5cbiAgICAgIGlmICh0aGlzLnNldHRpbmdzLnNraXBfc2VsZWN0b3IgJiYgdGFyZ2V0LmZpbmQodGhpcy5zZXR0aW5ncy5za2lwX3NlbGVjdG9yKS5sZW5ndGggIT0gMCkge1xuICAgICAgICB0YXJnZXQgPSB0YXJnZXRbZGlyZWN0aW9uXSgpO1xuICAgICAgfVxuXG4gICAgICBpZiAodGFyZ2V0Lmxlbmd0aCkge1xuICAgICAgICB0aGlzLlMoJ2ltZycsIHRhcmdldClcbiAgICAgICAgICAudHJpZ2dlcignY2xpY2suZm5kdG4uY2xlYXJpbmcnLCBbY3VycmVudCwgdGFyZ2V0XSlcbiAgICAgICAgICAudHJpZ2dlcignY2hhbmdlLmZuZHRuLmNsZWFyaW5nJyk7XG4gICAgICB9XG4gICAgfSxcblxuICAgIHNoaWZ0IDogZnVuY3Rpb24gKGN1cnJlbnQsIHRhcmdldCwgY2FsbGJhY2spIHtcbiAgICAgIHZhciBjbGVhcmluZyA9IHRhcmdldC5wYXJlbnQoKSxcbiAgICAgICAgICBvbGRfaW5kZXggPSB0aGlzLnNldHRpbmdzLnByZXZfaW5kZXggfHwgdGFyZ2V0LmluZGV4KCksXG4gICAgICAgICAgZGlyZWN0aW9uID0gdGhpcy5kaXJlY3Rpb24oY2xlYXJpbmcsIGN1cnJlbnQsIHRhcmdldCksXG4gICAgICAgICAgZGlyID0gdGhpcy5ydGwgPyAncmlnaHQnIDogJ2xlZnQnLFxuICAgICAgICAgIGxlZnQgPSBwYXJzZUludChjbGVhcmluZy5jc3MoJ2xlZnQnKSwgMTApLFxuICAgICAgICAgIHdpZHRoID0gdGFyZ2V0Lm91dGVyV2lkdGgoKSxcbiAgICAgICAgICBza2lwX3NoaWZ0O1xuXG4gICAgICB2YXIgZGlyX29iaiA9IHt9O1xuXG4gICAgICAvLyB3ZSB1c2UgalF1ZXJ5IGFuaW1hdGUgaW5zdGVhZCBvZiBDU1MgdHJhbnNpdGlvbnMgYmVjYXVzZSB3ZVxuICAgICAgLy8gbmVlZCBhIGNhbGxiYWNrIHRvIHVubG9jayB0aGUgbmV4dCBhbmltYXRpb25cbiAgICAgIC8vIG5lZWRzIHN1cHBvcnQgZm9yIFJUTCAqKlxuICAgICAgaWYgKHRhcmdldC5pbmRleCgpICE9PSBvbGRfaW5kZXggJiYgIS9za2lwLy50ZXN0KGRpcmVjdGlvbikpIHtcbiAgICAgICAgaWYgKC9sZWZ0Ly50ZXN0KGRpcmVjdGlvbikpIHtcbiAgICAgICAgICB0aGlzLmxvY2soKTtcbiAgICAgICAgICBkaXJfb2JqW2Rpcl0gPSBsZWZ0ICsgd2lkdGg7XG4gICAgICAgICAgY2xlYXJpbmcuYW5pbWF0ZShkaXJfb2JqLCAzMDAsIHRoaXMudW5sb2NrKCkpO1xuICAgICAgICB9IGVsc2UgaWYgKC9yaWdodC8udGVzdChkaXJlY3Rpb24pKSB7XG4gICAgICAgICAgdGhpcy5sb2NrKCk7XG4gICAgICAgICAgZGlyX29ialtkaXJdID0gbGVmdCAtIHdpZHRoO1xuICAgICAgICAgIGNsZWFyaW5nLmFuaW1hdGUoZGlyX29iaiwgMzAwLCB0aGlzLnVubG9jaygpKTtcbiAgICAgICAgfVxuICAgICAgfSBlbHNlIGlmICgvc2tpcC8udGVzdChkaXJlY3Rpb24pKSB7XG4gICAgICAgIC8vIHRoZSB0YXJnZXQgaW1hZ2UgaXMgbm90IGFkamFjZW50IHRvIHRoZSBjdXJyZW50IGltYWdlLCBzb1xuICAgICAgICAvLyBkbyB3ZSBzY3JvbGwgcmlnaHQgb3Igbm90XG4gICAgICAgIHNraXBfc2hpZnQgPSB0YXJnZXQuaW5kZXgoKSAtIHRoaXMuc2V0dGluZ3MudXBfY291bnQ7XG4gICAgICAgIHRoaXMubG9jaygpO1xuXG4gICAgICAgIGlmIChza2lwX3NoaWZ0ID4gMCkge1xuICAgICAgICAgIGRpcl9vYmpbZGlyXSA9IC0oc2tpcF9zaGlmdCAqIHdpZHRoKTtcbiAgICAgICAgICBjbGVhcmluZy5hbmltYXRlKGRpcl9vYmosIDMwMCwgdGhpcy51bmxvY2soKSk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgZGlyX29ialtkaXJdID0gMDtcbiAgICAgICAgICBjbGVhcmluZy5hbmltYXRlKGRpcl9vYmosIDMwMCwgdGhpcy51bmxvY2soKSk7XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgY2FsbGJhY2soKTtcbiAgICB9LFxuXG4gICAgZGlyZWN0aW9uIDogZnVuY3Rpb24gKCRlbCwgY3VycmVudCwgdGFyZ2V0KSB7XG4gICAgICB2YXIgbGlzID0gdGhpcy5TKCdsaScsICRlbCksXG4gICAgICAgICAgbGlfd2lkdGggPSBsaXMub3V0ZXJXaWR0aCgpICsgKGxpcy5vdXRlcldpZHRoKCkgLyA0KSxcbiAgICAgICAgICB1cF9jb3VudCA9IE1hdGguZmxvb3IodGhpcy5TKCcuY2xlYXJpbmctY29udGFpbmVyJykub3V0ZXJXaWR0aCgpIC8gbGlfd2lkdGgpIC0gMSxcbiAgICAgICAgICB0YXJnZXRfaW5kZXggPSBsaXMuaW5kZXgodGFyZ2V0KSxcbiAgICAgICAgICByZXNwb25zZTtcblxuICAgICAgdGhpcy5zZXR0aW5ncy51cF9jb3VudCA9IHVwX2NvdW50O1xuXG4gICAgICBpZiAodGhpcy5hZGphY2VudCh0aGlzLnNldHRpbmdzLnByZXZfaW5kZXgsIHRhcmdldF9pbmRleCkpIHtcbiAgICAgICAgaWYgKCh0YXJnZXRfaW5kZXggPiB1cF9jb3VudCkgJiYgdGFyZ2V0X2luZGV4ID4gdGhpcy5zZXR0aW5ncy5wcmV2X2luZGV4KSB7XG4gICAgICAgICAgcmVzcG9uc2UgPSAncmlnaHQnO1xuICAgICAgICB9IGVsc2UgaWYgKCh0YXJnZXRfaW5kZXggPiB1cF9jb3VudCAtIDEpICYmIHRhcmdldF9pbmRleCA8PSB0aGlzLnNldHRpbmdzLnByZXZfaW5kZXgpIHtcbiAgICAgICAgICByZXNwb25zZSA9ICdsZWZ0JztcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICByZXNwb25zZSA9IGZhbHNlO1xuICAgICAgICB9XG4gICAgICB9IGVsc2Uge1xuICAgICAgICByZXNwb25zZSA9ICdza2lwJztcbiAgICAgIH1cblxuICAgICAgdGhpcy5zZXR0aW5ncy5wcmV2X2luZGV4ID0gdGFyZ2V0X2luZGV4O1xuXG4gICAgICByZXR1cm4gcmVzcG9uc2U7XG4gICAgfSxcblxuICAgIGFkamFjZW50IDogZnVuY3Rpb24gKGN1cnJlbnRfaW5kZXgsIHRhcmdldF9pbmRleCkge1xuICAgICAgZm9yICh2YXIgaSA9IHRhcmdldF9pbmRleCArIDE7IGkgPj0gdGFyZ2V0X2luZGV4IC0gMTsgaS0tKSB7XG4gICAgICAgIGlmIChpID09PSBjdXJyZW50X2luZGV4KSB7XG4gICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9LFxuXG4gICAgLy8gbG9jayBtYW5hZ2VtZW50XG5cbiAgICBsb2NrIDogZnVuY3Rpb24gKCkge1xuICAgICAgdGhpcy5zZXR0aW5ncy5sb2NrZWQgPSB0cnVlO1xuICAgIH0sXG5cbiAgICB1bmxvY2sgOiBmdW5jdGlvbiAoKSB7XG4gICAgICB0aGlzLnNldHRpbmdzLmxvY2tlZCA9IGZhbHNlO1xuICAgIH0sXG5cbiAgICBsb2NrZWQgOiBmdW5jdGlvbiAoKSB7XG4gICAgICByZXR1cm4gdGhpcy5zZXR0aW5ncy5sb2NrZWQ7XG4gICAgfSxcblxuICAgIG9mZiA6IGZ1bmN0aW9uICgpIHtcbiAgICAgIHRoaXMuUyh0aGlzLnNjb3BlKS5vZmYoJy5mbmR0bi5jbGVhcmluZycpO1xuICAgICAgdGhpcy5TKHdpbmRvdykub2ZmKCcuZm5kdG4uY2xlYXJpbmcnKTtcbiAgICB9LFxuXG4gICAgcmVmbG93IDogZnVuY3Rpb24gKCkge1xuICAgICAgdGhpcy5pbml0KCk7XG4gICAgfVxuICB9O1xuXG59KGpRdWVyeSwgd2luZG93LCB3aW5kb3cuZG9jdW1lbnQpKTtcblxuOyhmdW5jdGlvbiAoJCwgd2luZG93LCBkb2N1bWVudCwgdW5kZWZpbmVkKSB7XG4gICd1c2Ugc3RyaWN0JztcblxuICBGb3VuZGF0aW9uLmxpYnMuZHJvcGRvd24gPSB7XG4gICAgbmFtZSA6ICdkcm9wZG93bicsXG5cbiAgICB2ZXJzaW9uIDogJzUuNS4yJyxcblxuICAgIHNldHRpbmdzIDoge1xuICAgICAgYWN0aXZlX2NsYXNzIDogJ29wZW4nLFxuICAgICAgZGlzYWJsZWRfY2xhc3MgOiAnZGlzYWJsZWQnLFxuICAgICAgbWVnYV9jbGFzcyA6ICdtZWdhJyxcbiAgICAgIGFsaWduIDogJ2JvdHRvbScsXG4gICAgICBpc19ob3ZlciA6IGZhbHNlLFxuICAgICAgaG92ZXJfdGltZW91dCA6IDE1MCxcbiAgICAgIG9wZW5lZCA6IGZ1bmN0aW9uICgpIHt9LFxuICAgICAgY2xvc2VkIDogZnVuY3Rpb24gKCkge31cbiAgICB9LFxuXG4gICAgaW5pdCA6IGZ1bmN0aW9uIChzY29wZSwgbWV0aG9kLCBvcHRpb25zKSB7XG4gICAgICBGb3VuZGF0aW9uLmluaGVyaXQodGhpcywgJ3Rocm90dGxlJyk7XG5cbiAgICAgICQuZXh0ZW5kKHRydWUsIHRoaXMuc2V0dGluZ3MsIG1ldGhvZCwgb3B0aW9ucyk7XG4gICAgICB0aGlzLmJpbmRpbmdzKG1ldGhvZCwgb3B0aW9ucyk7XG4gICAgfSxcblxuICAgIGV2ZW50cyA6IGZ1bmN0aW9uIChzY29wZSkge1xuICAgICAgdmFyIHNlbGYgPSB0aGlzLFxuICAgICAgICAgIFMgPSBzZWxmLlM7XG5cbiAgICAgIFModGhpcy5zY29wZSlcbiAgICAgICAgLm9mZignLmRyb3Bkb3duJylcbiAgICAgICAgLm9uKCdjbGljay5mbmR0bi5kcm9wZG93bicsICdbJyArIHRoaXMuYXR0cl9uYW1lKCkgKyAnXScsIGZ1bmN0aW9uIChlKSB7XG4gICAgICAgICAgdmFyIHNldHRpbmdzID0gUyh0aGlzKS5kYXRhKHNlbGYuYXR0cl9uYW1lKHRydWUpICsgJy1pbml0JykgfHwgc2VsZi5zZXR0aW5ncztcbiAgICAgICAgICBpZiAoIXNldHRpbmdzLmlzX2hvdmVyIHx8IE1vZGVybml6ci50b3VjaCkge1xuICAgICAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgICAgICAgaWYgKFModGhpcykucGFyZW50KCdbZGF0YS1yZXZlYWwtaWRdJykubGVuZ3RoKSB7XG4gICAgICAgICAgICAgIGUuc3RvcFByb3BhZ2F0aW9uKCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBzZWxmLnRvZ2dsZSgkKHRoaXMpKTtcbiAgICAgICAgICB9XG4gICAgICAgIH0pXG4gICAgICAgIC5vbignbW91c2VlbnRlci5mbmR0bi5kcm9wZG93bicsICdbJyArIHRoaXMuYXR0cl9uYW1lKCkgKyAnXSwgWycgKyB0aGlzLmF0dHJfbmFtZSgpICsgJy1jb250ZW50XScsIGZ1bmN0aW9uIChlKSB7XG4gICAgICAgICAgdmFyICR0aGlzID0gUyh0aGlzKSxcbiAgICAgICAgICAgICAgZHJvcGRvd24sXG4gICAgICAgICAgICAgIHRhcmdldDtcblxuICAgICAgICAgIGNsZWFyVGltZW91dChzZWxmLnRpbWVvdXQpO1xuXG4gICAgICAgICAgaWYgKCR0aGlzLmRhdGEoc2VsZi5kYXRhX2F0dHIoKSkpIHtcbiAgICAgICAgICAgIGRyb3Bkb3duID0gUygnIycgKyAkdGhpcy5kYXRhKHNlbGYuZGF0YV9hdHRyKCkpKTtcbiAgICAgICAgICAgIHRhcmdldCA9ICR0aGlzO1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBkcm9wZG93biA9ICR0aGlzO1xuICAgICAgICAgICAgdGFyZ2V0ID0gUygnWycgKyBzZWxmLmF0dHJfbmFtZSgpICsgJz1cIicgKyBkcm9wZG93bi5hdHRyKCdpZCcpICsgJ1wiXScpO1xuICAgICAgICAgIH1cblxuICAgICAgICAgIHZhciBzZXR0aW5ncyA9IHRhcmdldC5kYXRhKHNlbGYuYXR0cl9uYW1lKHRydWUpICsgJy1pbml0JykgfHwgc2VsZi5zZXR0aW5ncztcblxuICAgICAgICAgIGlmIChTKGUuY3VycmVudFRhcmdldCkuZGF0YShzZWxmLmRhdGFfYXR0cigpKSAmJiBzZXR0aW5ncy5pc19ob3Zlcikge1xuICAgICAgICAgICAgc2VsZi5jbG9zZWFsbC5jYWxsKHNlbGYpO1xuICAgICAgICAgIH1cblxuICAgICAgICAgIGlmIChzZXR0aW5ncy5pc19ob3Zlcikge1xuICAgICAgICAgICAgc2VsZi5vcGVuLmFwcGx5KHNlbGYsIFtkcm9wZG93biwgdGFyZ2V0XSk7XG4gICAgICAgICAgfVxuICAgICAgICB9KVxuICAgICAgICAub24oJ21vdXNlbGVhdmUuZm5kdG4uZHJvcGRvd24nLCAnWycgKyB0aGlzLmF0dHJfbmFtZSgpICsgJ10sIFsnICsgdGhpcy5hdHRyX25hbWUoKSArICctY29udGVudF0nLCBmdW5jdGlvbiAoZSkge1xuICAgICAgICAgIHZhciAkdGhpcyA9IFModGhpcyk7XG4gICAgICAgICAgdmFyIHNldHRpbmdzO1xuXG4gICAgICAgICAgaWYgKCR0aGlzLmRhdGEoc2VsZi5kYXRhX2F0dHIoKSkpIHtcbiAgICAgICAgICAgICAgc2V0dGluZ3MgPSAkdGhpcy5kYXRhKHNlbGYuZGF0YV9hdHRyKHRydWUpICsgJy1pbml0JykgfHwgc2VsZi5zZXR0aW5ncztcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICB2YXIgdGFyZ2V0ICAgPSBTKCdbJyArIHNlbGYuYXR0cl9uYW1lKCkgKyAnPVwiJyArIFModGhpcykuYXR0cignaWQnKSArICdcIl0nKSxcbiAgICAgICAgICAgICAgICAgIHNldHRpbmdzID0gdGFyZ2V0LmRhdGEoc2VsZi5hdHRyX25hbWUodHJ1ZSkgKyAnLWluaXQnKSB8fCBzZWxmLnNldHRpbmdzO1xuICAgICAgICAgIH1cblxuICAgICAgICAgIHNlbGYudGltZW91dCA9IHNldFRpbWVvdXQoZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgaWYgKCR0aGlzLmRhdGEoc2VsZi5kYXRhX2F0dHIoKSkpIHtcbiAgICAgICAgICAgICAgaWYgKHNldHRpbmdzLmlzX2hvdmVyKSB7XG4gICAgICAgICAgICAgICAgc2VsZi5jbG9zZS5jYWxsKHNlbGYsIFMoJyMnICsgJHRoaXMuZGF0YShzZWxmLmRhdGFfYXR0cigpKSkpO1xuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICBpZiAoc2V0dGluZ3MuaXNfaG92ZXIpIHtcbiAgICAgICAgICAgICAgICBzZWxmLmNsb3NlLmNhbGwoc2VsZiwgJHRoaXMpO1xuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfS5iaW5kKHRoaXMpLCBzZXR0aW5ncy5ob3Zlcl90aW1lb3V0KTtcbiAgICAgICAgfSlcbiAgICAgICAgLm9uKCdjbGljay5mbmR0bi5kcm9wZG93bicsIGZ1bmN0aW9uIChlKSB7XG4gICAgICAgICAgdmFyIHBhcmVudCA9IFMoZS50YXJnZXQpLmNsb3Nlc3QoJ1snICsgc2VsZi5hdHRyX25hbWUoKSArICctY29udGVudF0nKTtcbiAgICAgICAgICB2YXIgbGlua3MgID0gcGFyZW50LmZpbmQoJ2EnKTtcblxuICAgICAgICAgIGlmIChsaW5rcy5sZW5ndGggPiAwICYmIHBhcmVudC5hdHRyKCdhcmlhLWF1dG9jbG9zZScpICE9PSAnZmFsc2UnKSB7XG4gICAgICAgICAgICAgIHNlbGYuY2xvc2UuY2FsbChzZWxmLCBTKCdbJyArIHNlbGYuYXR0cl9uYW1lKCkgKyAnLWNvbnRlbnRdJykpO1xuICAgICAgICAgIH1cblxuICAgICAgICAgIGlmIChlLnRhcmdldCAhPT0gZG9jdW1lbnQgJiYgISQuY29udGFpbnMoZG9jdW1lbnQuZG9jdW1lbnRFbGVtZW50LCBlLnRhcmdldCkpIHtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICB9XG5cbiAgICAgICAgICBpZiAoUyhlLnRhcmdldCkuY2xvc2VzdCgnWycgKyBzZWxmLmF0dHJfbmFtZSgpICsgJ10nKS5sZW5ndGggPiAwKSB7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgaWYgKCEoUyhlLnRhcmdldCkuZGF0YSgncmV2ZWFsSWQnKSkgJiZcbiAgICAgICAgICAgIChwYXJlbnQubGVuZ3RoID4gMCAmJiAoUyhlLnRhcmdldCkuaXMoJ1snICsgc2VsZi5hdHRyX25hbWUoKSArICctY29udGVudF0nKSB8fFxuICAgICAgICAgICAgICAkLmNvbnRhaW5zKHBhcmVudC5maXJzdCgpWzBdLCBlLnRhcmdldCkpKSkge1xuICAgICAgICAgICAgZS5zdG9wUHJvcGFnYXRpb24oKTtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICB9XG5cbiAgICAgICAgICBzZWxmLmNsb3NlLmNhbGwoc2VsZiwgUygnWycgKyBzZWxmLmF0dHJfbmFtZSgpICsgJy1jb250ZW50XScpKTtcbiAgICAgICAgfSlcbiAgICAgICAgLm9uKCdvcGVuZWQuZm5kdG4uZHJvcGRvd24nLCAnWycgKyBzZWxmLmF0dHJfbmFtZSgpICsgJy1jb250ZW50XScsIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICBzZWxmLnNldHRpbmdzLm9wZW5lZC5jYWxsKHRoaXMpO1xuICAgICAgICB9KVxuICAgICAgICAub24oJ2Nsb3NlZC5mbmR0bi5kcm9wZG93bicsICdbJyArIHNlbGYuYXR0cl9uYW1lKCkgKyAnLWNvbnRlbnRdJywgZnVuY3Rpb24gKCkge1xuICAgICAgICAgIHNlbGYuc2V0dGluZ3MuY2xvc2VkLmNhbGwodGhpcyk7XG4gICAgICAgIH0pO1xuXG4gICAgICBTKHdpbmRvdylcbiAgICAgICAgLm9mZignLmRyb3Bkb3duJylcbiAgICAgICAgLm9uKCdyZXNpemUuZm5kdG4uZHJvcGRvd24nLCBzZWxmLnRocm90dGxlKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICBzZWxmLnJlc2l6ZS5jYWxsKHNlbGYpO1xuICAgICAgICB9LCA1MCkpO1xuXG4gICAgICB0aGlzLnJlc2l6ZSgpO1xuICAgIH0sXG5cbiAgICBjbG9zZSA6IGZ1bmN0aW9uIChkcm9wZG93bikge1xuICAgICAgdmFyIHNlbGYgPSB0aGlzO1xuICAgICAgZHJvcGRvd24uZWFjaChmdW5jdGlvbiAoaWR4KSB7XG4gICAgICAgIHZhciBvcmlnaW5hbF90YXJnZXQgPSAkKCdbJyArIHNlbGYuYXR0cl9uYW1lKCkgKyAnPScgKyBkcm9wZG93bltpZHhdLmlkICsgJ10nKSB8fCAkKCdhcmlhLWNvbnRyb2xzPScgKyBkcm9wZG93bltpZHhdLmlkICsgJ10nKTtcbiAgICAgICAgb3JpZ2luYWxfdGFyZ2V0LmF0dHIoJ2FyaWEtZXhwYW5kZWQnLCAnZmFsc2UnKTtcbiAgICAgICAgaWYgKHNlbGYuUyh0aGlzKS5oYXNDbGFzcyhzZWxmLnNldHRpbmdzLmFjdGl2ZV9jbGFzcykpIHtcbiAgICAgICAgICBzZWxmLlModGhpcylcbiAgICAgICAgICAgIC5jc3MoRm91bmRhdGlvbi5ydGwgPyAncmlnaHQnIDogJ2xlZnQnLCAnLTk5OTk5cHgnKVxuICAgICAgICAgICAgLmF0dHIoJ2FyaWEtaGlkZGVuJywgJ3RydWUnKVxuICAgICAgICAgICAgLnJlbW92ZUNsYXNzKHNlbGYuc2V0dGluZ3MuYWN0aXZlX2NsYXNzKVxuICAgICAgICAgICAgLnByZXYoJ1snICsgc2VsZi5hdHRyX25hbWUoKSArICddJylcbiAgICAgICAgICAgIC5yZW1vdmVDbGFzcyhzZWxmLnNldHRpbmdzLmFjdGl2ZV9jbGFzcylcbiAgICAgICAgICAgIC5yZW1vdmVEYXRhKCd0YXJnZXQnKTtcblxuICAgICAgICAgIHNlbGYuUyh0aGlzKS50cmlnZ2VyKCdjbG9zZWQuZm5kdG4uZHJvcGRvd24nLCBbZHJvcGRvd25dKTtcbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgICBkcm9wZG93bi5yZW1vdmVDbGFzcygnZi1vcGVuLScgKyB0aGlzLmF0dHJfbmFtZSh0cnVlKSk7XG4gICAgfSxcblxuICAgIGNsb3NlYWxsIDogZnVuY3Rpb24gKCkge1xuICAgICAgdmFyIHNlbGYgPSB0aGlzO1xuICAgICAgJC5lYWNoKHNlbGYuUygnLmYtb3Blbi0nICsgdGhpcy5hdHRyX25hbWUodHJ1ZSkpLCBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHNlbGYuY2xvc2UuY2FsbChzZWxmLCBzZWxmLlModGhpcykpO1xuICAgICAgfSk7XG4gICAgfSxcblxuICAgIG9wZW4gOiBmdW5jdGlvbiAoZHJvcGRvd24sIHRhcmdldCkge1xuICAgICAgdGhpc1xuICAgICAgICAuY3NzKGRyb3Bkb3duXG4gICAgICAgIC5hZGRDbGFzcyh0aGlzLnNldHRpbmdzLmFjdGl2ZV9jbGFzcyksIHRhcmdldCk7XG4gICAgICBkcm9wZG93bi5wcmV2KCdbJyArIHRoaXMuYXR0cl9uYW1lKCkgKyAnXScpLmFkZENsYXNzKHRoaXMuc2V0dGluZ3MuYWN0aXZlX2NsYXNzKTtcbiAgICAgIGRyb3Bkb3duLmRhdGEoJ3RhcmdldCcsIHRhcmdldC5nZXQoMCkpLnRyaWdnZXIoJ29wZW5lZC5mbmR0bi5kcm9wZG93bicsIFtkcm9wZG93biwgdGFyZ2V0XSk7XG4gICAgICBkcm9wZG93bi5hdHRyKCdhcmlhLWhpZGRlbicsICdmYWxzZScpO1xuICAgICAgdGFyZ2V0LmF0dHIoJ2FyaWEtZXhwYW5kZWQnLCAndHJ1ZScpO1xuICAgICAgZHJvcGRvd24uZm9jdXMoKTtcbiAgICAgIGRyb3Bkb3duLmFkZENsYXNzKCdmLW9wZW4tJyArIHRoaXMuYXR0cl9uYW1lKHRydWUpKTtcbiAgICB9LFxuXG4gICAgZGF0YV9hdHRyIDogZnVuY3Rpb24gKCkge1xuICAgICAgaWYgKHRoaXMubmFtZXNwYWNlLmxlbmd0aCA+IDApIHtcbiAgICAgICAgcmV0dXJuIHRoaXMubmFtZXNwYWNlICsgJy0nICsgdGhpcy5uYW1lO1xuICAgICAgfVxuXG4gICAgICByZXR1cm4gdGhpcy5uYW1lO1xuICAgIH0sXG5cbiAgICB0b2dnbGUgOiBmdW5jdGlvbiAodGFyZ2V0KSB7XG4gICAgICBpZiAodGFyZ2V0Lmhhc0NsYXNzKHRoaXMuc2V0dGluZ3MuZGlzYWJsZWRfY2xhc3MpKSB7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cbiAgICAgIHZhciBkcm9wZG93biA9IHRoaXMuUygnIycgKyB0YXJnZXQuZGF0YSh0aGlzLmRhdGFfYXR0cigpKSk7XG4gICAgICBpZiAoZHJvcGRvd24ubGVuZ3RoID09PSAwKSB7XG4gICAgICAgIC8vIE5vIGRyb3Bkb3duIGZvdW5kLCBub3QgY29udGludWluZ1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG5cbiAgICAgIHRoaXMuY2xvc2UuY2FsbCh0aGlzLCB0aGlzLlMoJ1snICsgdGhpcy5hdHRyX25hbWUoKSArICctY29udGVudF0nKS5ub3QoZHJvcGRvd24pKTtcblxuICAgICAgaWYgKGRyb3Bkb3duLmhhc0NsYXNzKHRoaXMuc2V0dGluZ3MuYWN0aXZlX2NsYXNzKSkge1xuICAgICAgICB0aGlzLmNsb3NlLmNhbGwodGhpcywgZHJvcGRvd24pO1xuICAgICAgICBpZiAoZHJvcGRvd24uZGF0YSgndGFyZ2V0JykgIT09IHRhcmdldC5nZXQoMCkpIHtcbiAgICAgICAgICB0aGlzLm9wZW4uY2FsbCh0aGlzLCBkcm9wZG93biwgdGFyZ2V0KTtcbiAgICAgICAgfVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdGhpcy5vcGVuLmNhbGwodGhpcywgZHJvcGRvd24sIHRhcmdldCk7XG4gICAgICB9XG4gICAgfSxcblxuICAgIHJlc2l6ZSA6IGZ1bmN0aW9uICgpIHtcbiAgICAgIHZhciBkcm9wZG93biA9IHRoaXMuUygnWycgKyB0aGlzLmF0dHJfbmFtZSgpICsgJy1jb250ZW50XS5vcGVuJyk7XG4gICAgICB2YXIgdGFyZ2V0ID0gJChkcm9wZG93bi5kYXRhKFwidGFyZ2V0XCIpKTtcblxuICAgICAgaWYgKGRyb3Bkb3duLmxlbmd0aCAmJiB0YXJnZXQubGVuZ3RoKSB7XG4gICAgICAgIHRoaXMuY3NzKGRyb3Bkb3duLCB0YXJnZXQpO1xuICAgICAgfVxuICAgIH0sXG5cbiAgICBjc3MgOiBmdW5jdGlvbiAoZHJvcGRvd24sIHRhcmdldCkge1xuICAgICAgdmFyIGxlZnRfb2Zmc2V0ID0gTWF0aC5tYXgoKHRhcmdldC53aWR0aCgpIC0gZHJvcGRvd24ud2lkdGgoKSkgLyAyLCA4KSxcbiAgICAgICAgICBzZXR0aW5ncyA9IHRhcmdldC5kYXRhKHRoaXMuYXR0cl9uYW1lKHRydWUpICsgJy1pbml0JykgfHwgdGhpcy5zZXR0aW5ncyxcbiAgICAgICAgICBwYXJlbnRPdmVyZmxvdyA9IGRyb3Bkb3duLnBhcmVudCgpLmNzcygnb3ZlcmZsb3cteScpIHx8IGRyb3Bkb3duLnBhcmVudCgpLmNzcygnb3ZlcmZsb3cnKTtcblxuICAgICAgdGhpcy5jbGVhcl9pZHgoKTtcblxuXG5cbiAgICAgIGlmICh0aGlzLnNtYWxsKCkpIHtcbiAgICAgICAgdmFyIHAgPSB0aGlzLmRpcnMuYm90dG9tLmNhbGwoZHJvcGRvd24sIHRhcmdldCwgc2V0dGluZ3MpO1xuXG4gICAgICAgIGRyb3Bkb3duLmF0dHIoJ3N0eWxlJywgJycpLnJlbW92ZUNsYXNzKCdkcm9wLWxlZnQgZHJvcC1yaWdodCBkcm9wLXRvcCcpLmNzcyh7XG4gICAgICAgICAgcG9zaXRpb24gOiAnYWJzb2x1dGUnLFxuICAgICAgICAgIHdpZHRoIDogJzk1JScsXG4gICAgICAgICAgJ21heC13aWR0aCcgOiAnbm9uZScsXG4gICAgICAgICAgdG9wIDogcC50b3BcbiAgICAgICAgfSk7XG5cbiAgICAgICAgZHJvcGRvd24uY3NzKEZvdW5kYXRpb24ucnRsID8gJ3JpZ2h0JyA6ICdsZWZ0JywgbGVmdF9vZmZzZXQpO1xuICAgICAgfVxuICAgICAgLy8gZGV0ZWN0IGlmIGRyb3Bkb3duIGlzIGluIGFuIG92ZXJmbG93IGNvbnRhaW5lclxuICAgICAgZWxzZSBpZiAocGFyZW50T3ZlcmZsb3cgIT09ICd2aXNpYmxlJykge1xuICAgICAgICB2YXIgb2Zmc2V0ID0gdGFyZ2V0WzBdLm9mZnNldFRvcCArIHRhcmdldFswXS5vZmZzZXRIZWlnaHQ7XG5cbiAgICAgICAgZHJvcGRvd24uYXR0cignc3R5bGUnLCAnJykuY3NzKHtcbiAgICAgICAgICBwb3NpdGlvbiA6ICdhYnNvbHV0ZScsXG4gICAgICAgICAgdG9wIDogb2Zmc2V0XG4gICAgICAgIH0pO1xuXG4gICAgICAgIGRyb3Bkb3duLmNzcyhGb3VuZGF0aW9uLnJ0bCA/ICdyaWdodCcgOiAnbGVmdCcsIGxlZnRfb2Zmc2V0KTtcbiAgICAgIH1cbiAgICAgIGVsc2Uge1xuXG4gICAgICAgIHRoaXMuc3R5bGUoZHJvcGRvd24sIHRhcmdldCwgc2V0dGluZ3MpO1xuICAgICAgfVxuXG4gICAgICByZXR1cm4gZHJvcGRvd247XG4gICAgfSxcblxuICAgIHN0eWxlIDogZnVuY3Rpb24gKGRyb3Bkb3duLCB0YXJnZXQsIHNldHRpbmdzKSB7XG4gICAgICB2YXIgY3NzID0gJC5leHRlbmQoe3Bvc2l0aW9uIDogJ2Fic29sdXRlJ30sXG4gICAgICAgIHRoaXMuZGlyc1tzZXR0aW5ncy5hbGlnbl0uY2FsbChkcm9wZG93biwgdGFyZ2V0LCBzZXR0aW5ncykpO1xuXG4gICAgICBkcm9wZG93bi5hdHRyKCdzdHlsZScsICcnKS5jc3MoY3NzKTtcbiAgICB9LFxuXG4gICAgLy8gcmV0dXJuIENTUyBwcm9wZXJ0eSBvYmplY3RcbiAgICAvLyBgdGhpc2AgaXMgdGhlIGRyb3Bkb3duXG4gICAgZGlycyA6IHtcbiAgICAgIC8vIENhbGN1bGF0ZSB0YXJnZXQgb2Zmc2V0XG4gICAgICBfYmFzZSA6IGZ1bmN0aW9uICh0KSB7XG4gICAgICAgIHZhciBvX3AgPSB0aGlzLm9mZnNldFBhcmVudCgpLFxuICAgICAgICAgICAgbyA9IG9fcC5vZmZzZXQoKSxcbiAgICAgICAgICAgIHAgPSB0Lm9mZnNldCgpO1xuXG4gICAgICAgIHAudG9wIC09IG8udG9wO1xuICAgICAgICBwLmxlZnQgLT0gby5sZWZ0O1xuXG4gICAgICAgIC8vc2V0IHNvbWUgZmxhZ3Mgb24gdGhlIHAgb2JqZWN0IHRvIHBhc3MgYWxvbmdcbiAgICAgICAgcC5taXNzUmlnaHQgPSBmYWxzZTtcbiAgICAgICAgcC5taXNzVG9wID0gZmFsc2U7XG4gICAgICAgIHAubWlzc0xlZnQgPSBmYWxzZTtcbiAgICAgICAgcC5sZWZ0UmlnaHRGbGFnID0gZmFsc2U7XG5cbiAgICAgICAgLy9sZXRzIHNlZSBpZiB0aGUgcGFuZWwgd2lsbCBiZSBvZmYgdGhlIHNjcmVlblxuICAgICAgICAvL2dldCB0aGUgYWN0dWFsIHdpZHRoIG9mIHRoZSBwYWdlIGFuZCBzdG9yZSBpdFxuICAgICAgICB2YXIgYWN0dWFsQm9keVdpZHRoO1xuICAgICAgICBpZiAoZG9jdW1lbnQuZ2V0RWxlbWVudHNCeUNsYXNzTmFtZSgncm93JylbMF0pIHtcbiAgICAgICAgICBhY3R1YWxCb2R5V2lkdGggPSBkb2N1bWVudC5nZXRFbGVtZW50c0J5Q2xhc3NOYW1lKCdyb3cnKVswXS5jbGllbnRXaWR0aDtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBhY3R1YWxCb2R5V2lkdGggPSB3aW5kb3cuaW5uZXJXaWR0aDtcbiAgICAgICAgfVxuXG4gICAgICAgIHZhciBhY3R1YWxNYXJnaW5XaWR0aCA9ICh3aW5kb3cuaW5uZXJXaWR0aCAtIGFjdHVhbEJvZHlXaWR0aCkgLyAyO1xuICAgICAgICB2YXIgYWN0dWFsQm91bmRhcnkgPSBhY3R1YWxCb2R5V2lkdGg7XG5cbiAgICAgICAgaWYgKCF0aGlzLmhhc0NsYXNzKCdtZWdhJykpIHtcbiAgICAgICAgICAvL21pc3MgdG9wXG4gICAgICAgICAgaWYgKHQub2Zmc2V0KCkudG9wIDw9IHRoaXMub3V0ZXJIZWlnaHQoKSkge1xuICAgICAgICAgICAgcC5taXNzVG9wID0gdHJ1ZTtcbiAgICAgICAgICAgIGFjdHVhbEJvdW5kYXJ5ID0gd2luZG93LmlubmVyV2lkdGggLSBhY3R1YWxNYXJnaW5XaWR0aDtcbiAgICAgICAgICAgIHAubGVmdFJpZ2h0RmxhZyA9IHRydWU7XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgLy9taXNzIHJpZ2h0XG4gICAgICAgICAgaWYgKHQub2Zmc2V0KCkubGVmdCArIHRoaXMub3V0ZXJXaWR0aCgpID4gdC5vZmZzZXQoKS5sZWZ0ICsgYWN0dWFsTWFyZ2luV2lkdGggJiYgdC5vZmZzZXQoKS5sZWZ0IC0gYWN0dWFsTWFyZ2luV2lkdGggPiB0aGlzLm91dGVyV2lkdGgoKSkge1xuICAgICAgICAgICAgcC5taXNzUmlnaHQgPSB0cnVlO1xuICAgICAgICAgICAgcC5taXNzTGVmdCA9IGZhbHNlO1xuICAgICAgICAgIH1cblxuICAgICAgICAgIC8vbWlzcyBsZWZ0XG4gICAgICAgICAgaWYgKHQub2Zmc2V0KCkubGVmdCAtIHRoaXMub3V0ZXJXaWR0aCgpIDw9IDApIHtcbiAgICAgICAgICAgIHAubWlzc0xlZnQgPSB0cnVlO1xuICAgICAgICAgICAgcC5taXNzUmlnaHQgPSBmYWxzZTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gcDtcbiAgICAgIH0sXG5cbiAgICAgIHRvcCA6IGZ1bmN0aW9uICh0LCBzKSB7XG4gICAgICAgIHZhciBzZWxmID0gRm91bmRhdGlvbi5saWJzLmRyb3Bkb3duLFxuICAgICAgICAgICAgcCA9IHNlbGYuZGlycy5fYmFzZS5jYWxsKHRoaXMsIHQpO1xuXG4gICAgICAgIHRoaXMuYWRkQ2xhc3MoJ2Ryb3AtdG9wJyk7XG5cbiAgICAgICAgaWYgKHAubWlzc1RvcCA9PSB0cnVlKSB7XG4gICAgICAgICAgcC50b3AgPSBwLnRvcCArIHQub3V0ZXJIZWlnaHQoKSArIHRoaXMub3V0ZXJIZWlnaHQoKTtcbiAgICAgICAgICB0aGlzLnJlbW92ZUNsYXNzKCdkcm9wLXRvcCcpO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKHAubWlzc1JpZ2h0ID09IHRydWUpIHtcbiAgICAgICAgICBwLmxlZnQgPSBwLmxlZnQgLSB0aGlzLm91dGVyV2lkdGgoKSArIHQub3V0ZXJXaWR0aCgpO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKHQub3V0ZXJXaWR0aCgpIDwgdGhpcy5vdXRlcldpZHRoKCkgfHwgc2VsZi5zbWFsbCgpIHx8IHRoaXMuaGFzQ2xhc3Mocy5tZWdhX21lbnUpKSB7XG4gICAgICAgICAgc2VsZi5hZGp1c3RfcGlwKHRoaXMsIHQsIHMsIHApO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKEZvdW5kYXRpb24ucnRsKSB7XG4gICAgICAgICAgcmV0dXJuIHtsZWZ0IDogcC5sZWZ0IC0gdGhpcy5vdXRlcldpZHRoKCkgKyB0Lm91dGVyV2lkdGgoKSxcbiAgICAgICAgICAgIHRvcCA6IHAudG9wIC0gdGhpcy5vdXRlckhlaWdodCgpfTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiB7bGVmdCA6IHAubGVmdCwgdG9wIDogcC50b3AgLSB0aGlzLm91dGVySGVpZ2h0KCl9O1xuICAgICAgfSxcblxuICAgICAgYm90dG9tIDogZnVuY3Rpb24gKHQsIHMpIHtcbiAgICAgICAgdmFyIHNlbGYgPSBGb3VuZGF0aW9uLmxpYnMuZHJvcGRvd24sXG4gICAgICAgICAgICBwID0gc2VsZi5kaXJzLl9iYXNlLmNhbGwodGhpcywgdCk7XG5cbiAgICAgICAgaWYgKHAubWlzc1JpZ2h0ID09IHRydWUpIHtcbiAgICAgICAgICBwLmxlZnQgPSBwLmxlZnQgLSB0aGlzLm91dGVyV2lkdGgoKSArIHQub3V0ZXJXaWR0aCgpO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKHQub3V0ZXJXaWR0aCgpIDwgdGhpcy5vdXRlcldpZHRoKCkgfHwgc2VsZi5zbWFsbCgpIHx8IHRoaXMuaGFzQ2xhc3Mocy5tZWdhX21lbnUpKSB7XG4gICAgICAgICAgc2VsZi5hZGp1c3RfcGlwKHRoaXMsIHQsIHMsIHApO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKHNlbGYucnRsKSB7XG4gICAgICAgICAgcmV0dXJuIHtsZWZ0IDogcC5sZWZ0IC0gdGhpcy5vdXRlcldpZHRoKCkgKyB0Lm91dGVyV2lkdGgoKSwgdG9wIDogcC50b3AgKyB0Lm91dGVySGVpZ2h0KCl9O1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIHtsZWZ0IDogcC5sZWZ0LCB0b3AgOiBwLnRvcCArIHQub3V0ZXJIZWlnaHQoKX07XG4gICAgICB9LFxuXG4gICAgICBsZWZ0IDogZnVuY3Rpb24gKHQsIHMpIHtcbiAgICAgICAgdmFyIHAgPSBGb3VuZGF0aW9uLmxpYnMuZHJvcGRvd24uZGlycy5fYmFzZS5jYWxsKHRoaXMsIHQpO1xuXG4gICAgICAgIHRoaXMuYWRkQ2xhc3MoJ2Ryb3AtbGVmdCcpO1xuXG4gICAgICAgIGlmIChwLm1pc3NMZWZ0ID09IHRydWUpIHtcbiAgICAgICAgICBwLmxlZnQgPSAgcC5sZWZ0ICsgdGhpcy5vdXRlcldpZHRoKCk7XG4gICAgICAgICAgcC50b3AgPSBwLnRvcCArIHQub3V0ZXJIZWlnaHQoKTtcbiAgICAgICAgICB0aGlzLnJlbW92ZUNsYXNzKCdkcm9wLWxlZnQnKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiB7bGVmdCA6IHAubGVmdCAtIHRoaXMub3V0ZXJXaWR0aCgpLCB0b3AgOiBwLnRvcH07XG4gICAgICB9LFxuXG4gICAgICByaWdodCA6IGZ1bmN0aW9uICh0LCBzKSB7XG4gICAgICAgIHZhciBwID0gRm91bmRhdGlvbi5saWJzLmRyb3Bkb3duLmRpcnMuX2Jhc2UuY2FsbCh0aGlzLCB0KTtcblxuICAgICAgICB0aGlzLmFkZENsYXNzKCdkcm9wLXJpZ2h0Jyk7XG5cbiAgICAgICAgaWYgKHAubWlzc1JpZ2h0ID09IHRydWUpIHtcbiAgICAgICAgICBwLmxlZnQgPSBwLmxlZnQgLSB0aGlzLm91dGVyV2lkdGgoKTtcbiAgICAgICAgICBwLnRvcCA9IHAudG9wICsgdC5vdXRlckhlaWdodCgpO1xuICAgICAgICAgIHRoaXMucmVtb3ZlQ2xhc3MoJ2Ryb3AtcmlnaHQnKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBwLnRyaWdnZXJlZFJpZ2h0ID0gdHJ1ZTtcbiAgICAgICAgfVxuXG4gICAgICAgIHZhciBzZWxmID0gRm91bmRhdGlvbi5saWJzLmRyb3Bkb3duO1xuXG4gICAgICAgIGlmICh0Lm91dGVyV2lkdGgoKSA8IHRoaXMub3V0ZXJXaWR0aCgpIHx8IHNlbGYuc21hbGwoKSB8fCB0aGlzLmhhc0NsYXNzKHMubWVnYV9tZW51KSkge1xuICAgICAgICAgIHNlbGYuYWRqdXN0X3BpcCh0aGlzLCB0LCBzLCBwKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiB7bGVmdCA6IHAubGVmdCArIHQub3V0ZXJXaWR0aCgpLCB0b3AgOiBwLnRvcH07XG4gICAgICB9XG4gICAgfSxcblxuICAgIC8vIEluc2VydCBydWxlIHRvIHN0eWxlIHBzdWVkbyBlbGVtZW50c1xuICAgIGFkanVzdF9waXAgOiBmdW5jdGlvbiAoZHJvcGRvd24sIHRhcmdldCwgc2V0dGluZ3MsIHBvc2l0aW9uKSB7XG4gICAgICB2YXIgc2hlZXQgPSBGb3VuZGF0aW9uLnN0eWxlc2hlZXQsXG4gICAgICAgICAgcGlwX29mZnNldF9iYXNlID0gODtcblxuICAgICAgaWYgKGRyb3Bkb3duLmhhc0NsYXNzKHNldHRpbmdzLm1lZ2FfY2xhc3MpKSB7XG4gICAgICAgIHBpcF9vZmZzZXRfYmFzZSA9IHBvc2l0aW9uLmxlZnQgKyAodGFyZ2V0Lm91dGVyV2lkdGgoKSAvIDIpIC0gODtcbiAgICAgIH0gZWxzZSBpZiAodGhpcy5zbWFsbCgpKSB7XG4gICAgICAgIHBpcF9vZmZzZXRfYmFzZSArPSBwb3NpdGlvbi5sZWZ0IC0gODtcbiAgICAgIH1cblxuICAgICAgdGhpcy5ydWxlX2lkeCA9IHNoZWV0LmNzc1J1bGVzLmxlbmd0aDtcblxuICAgICAgLy9kZWZhdWx0XG4gICAgICB2YXIgc2VsX2JlZm9yZSA9ICcuZi1kcm9wZG93bi5vcGVuOmJlZm9yZScsXG4gICAgICAgICAgc2VsX2FmdGVyICA9ICcuZi1kcm9wZG93bi5vcGVuOmFmdGVyJyxcbiAgICAgICAgICBjc3NfYmVmb3JlID0gJ2xlZnQ6ICcgKyBwaXBfb2Zmc2V0X2Jhc2UgKyAncHg7JyxcbiAgICAgICAgICBjc3NfYWZ0ZXIgID0gJ2xlZnQ6ICcgKyAocGlwX29mZnNldF9iYXNlIC0gMSkgKyAncHg7JztcblxuICAgICAgaWYgKHBvc2l0aW9uLm1pc3NSaWdodCA9PSB0cnVlKSB7XG4gICAgICAgIHBpcF9vZmZzZXRfYmFzZSA9IGRyb3Bkb3duLm91dGVyV2lkdGgoKSAtIDIzO1xuICAgICAgICBzZWxfYmVmb3JlID0gJy5mLWRyb3Bkb3duLm9wZW46YmVmb3JlJyxcbiAgICAgICAgc2VsX2FmdGVyICA9ICcuZi1kcm9wZG93bi5vcGVuOmFmdGVyJyxcbiAgICAgICAgY3NzX2JlZm9yZSA9ICdsZWZ0OiAnICsgcGlwX29mZnNldF9iYXNlICsgJ3B4OycsXG4gICAgICAgIGNzc19hZnRlciAgPSAnbGVmdDogJyArIChwaXBfb2Zmc2V0X2Jhc2UgLSAxKSArICdweDsnO1xuICAgICAgfVxuXG4gICAgICAvL2p1c3QgYSBjYXNlIHdoZXJlIHJpZ2h0IGlzIGZpcmVkLCBidXQgaXRzIG5vdCBtaXNzaW5nIHJpZ2h0XG4gICAgICBpZiAocG9zaXRpb24udHJpZ2dlcmVkUmlnaHQgPT0gdHJ1ZSkge1xuICAgICAgICBzZWxfYmVmb3JlID0gJy5mLWRyb3Bkb3duLm9wZW46YmVmb3JlJyxcbiAgICAgICAgc2VsX2FmdGVyICA9ICcuZi1kcm9wZG93bi5vcGVuOmFmdGVyJyxcbiAgICAgICAgY3NzX2JlZm9yZSA9ICdsZWZ0Oi0xMnB4OycsXG4gICAgICAgIGNzc19hZnRlciAgPSAnbGVmdDotMTRweDsnO1xuICAgICAgfVxuXG4gICAgICBpZiAoc2hlZXQuaW5zZXJ0UnVsZSkge1xuICAgICAgICBzaGVldC5pbnNlcnRSdWxlKFtzZWxfYmVmb3JlLCAneycsIGNzc19iZWZvcmUsICd9J10uam9pbignICcpLCB0aGlzLnJ1bGVfaWR4KTtcbiAgICAgICAgc2hlZXQuaW5zZXJ0UnVsZShbc2VsX2FmdGVyLCAneycsIGNzc19hZnRlciwgJ30nXS5qb2luKCcgJyksIHRoaXMucnVsZV9pZHggKyAxKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHNoZWV0LmFkZFJ1bGUoc2VsX2JlZm9yZSwgY3NzX2JlZm9yZSwgdGhpcy5ydWxlX2lkeCk7XG4gICAgICAgIHNoZWV0LmFkZFJ1bGUoc2VsX2FmdGVyLCBjc3NfYWZ0ZXIsIHRoaXMucnVsZV9pZHggKyAxKTtcbiAgICAgIH1cbiAgICB9LFxuXG4gICAgLy8gUmVtb3ZlIG9sZCBkcm9wZG93biBydWxlIGluZGV4XG4gICAgY2xlYXJfaWR4IDogZnVuY3Rpb24gKCkge1xuICAgICAgdmFyIHNoZWV0ID0gRm91bmRhdGlvbi5zdHlsZXNoZWV0O1xuXG4gICAgICBpZiAodHlwZW9mIHRoaXMucnVsZV9pZHggIT09ICd1bmRlZmluZWQnKSB7XG4gICAgICAgIHNoZWV0LmRlbGV0ZVJ1bGUodGhpcy5ydWxlX2lkeCk7XG4gICAgICAgIHNoZWV0LmRlbGV0ZVJ1bGUodGhpcy5ydWxlX2lkeCk7XG4gICAgICAgIGRlbGV0ZSB0aGlzLnJ1bGVfaWR4O1xuICAgICAgfVxuICAgIH0sXG5cbiAgICBzbWFsbCA6IGZ1bmN0aW9uICgpIHtcbiAgICAgIHJldHVybiBtYXRjaE1lZGlhKEZvdW5kYXRpb24ubWVkaWFfcXVlcmllcy5zbWFsbCkubWF0Y2hlcyAmJlxuICAgICAgICAhbWF0Y2hNZWRpYShGb3VuZGF0aW9uLm1lZGlhX3F1ZXJpZXMubWVkaXVtKS5tYXRjaGVzO1xuICAgIH0sXG5cbiAgICBvZmYgOiBmdW5jdGlvbiAoKSB7XG4gICAgICB0aGlzLlModGhpcy5zY29wZSkub2ZmKCcuZm5kdG4uZHJvcGRvd24nKTtcbiAgICAgIHRoaXMuUygnaHRtbCwgYm9keScpLm9mZignLmZuZHRuLmRyb3Bkb3duJyk7XG4gICAgICB0aGlzLlMod2luZG93KS5vZmYoJy5mbmR0bi5kcm9wZG93bicpO1xuICAgICAgdGhpcy5TKCdbZGF0YS1kcm9wZG93bi1jb250ZW50XScpLm9mZignLmZuZHRuLmRyb3Bkb3duJyk7XG4gICAgfSxcblxuICAgIHJlZmxvdyA6IGZ1bmN0aW9uICgpIHt9XG4gIH07XG59KGpRdWVyeSwgd2luZG93LCB3aW5kb3cuZG9jdW1lbnQpKTtcblxuOyhmdW5jdGlvbiAoJCwgd2luZG93LCBkb2N1bWVudCwgdW5kZWZpbmVkKSB7XG4gICd1c2Ugc3RyaWN0JztcblxuICBGb3VuZGF0aW9uLmxpYnMuZXF1YWxpemVyID0ge1xuICAgIG5hbWUgOiAnZXF1YWxpemVyJyxcblxuICAgIHZlcnNpb24gOiAnNS41LjInLFxuXG4gICAgc2V0dGluZ3MgOiB7XG4gICAgICB1c2VfdGFsbGVzdCA6IHRydWUsXG4gICAgICBiZWZvcmVfaGVpZ2h0X2NoYW5nZSA6ICQubm9vcCxcbiAgICAgIGFmdGVyX2hlaWdodF9jaGFuZ2UgOiAkLm5vb3AsXG4gICAgICBlcXVhbGl6ZV9vbl9zdGFjayA6IGZhbHNlLFxuICAgICAgYWN0X29uX2hpZGRlbl9lbDogZmFsc2VcbiAgICB9LFxuXG4gICAgaW5pdCA6IGZ1bmN0aW9uIChzY29wZSwgbWV0aG9kLCBvcHRpb25zKSB7XG4gICAgICBGb3VuZGF0aW9uLmluaGVyaXQodGhpcywgJ2ltYWdlX2xvYWRlZCcpO1xuICAgICAgdGhpcy5iaW5kaW5ncyhtZXRob2QsIG9wdGlvbnMpO1xuICAgICAgdGhpcy5yZWZsb3coKTtcbiAgICB9LFxuXG4gICAgZXZlbnRzIDogZnVuY3Rpb24gKCkge1xuICAgICAgdGhpcy5TKHdpbmRvdykub2ZmKCcuZXF1YWxpemVyJykub24oJ3Jlc2l6ZS5mbmR0bi5lcXVhbGl6ZXInLCBmdW5jdGlvbiAoZSkge1xuICAgICAgICB0aGlzLnJlZmxvdygpO1xuICAgICAgfS5iaW5kKHRoaXMpKTtcbiAgICB9LFxuXG4gICAgZXF1YWxpemUgOiBmdW5jdGlvbiAoZXF1YWxpemVyKSB7XG4gICAgICB2YXIgaXNTdGFja2VkID0gZmFsc2UsXG4gICAgICAgICAgZ3JvdXAgPSBlcXVhbGl6ZXIuZGF0YSgnZXF1YWxpemVyJyksXG4gICAgICAgICAgc2V0dGluZ3MgPSBlcXVhbGl6ZXIuZGF0YSh0aGlzLmF0dHJfbmFtZSh0cnVlKSsnLWluaXQnKSB8fCB0aGlzLnNldHRpbmdzLFxuICAgICAgICAgIHZhbHMsXG4gICAgICAgICAgZmlyc3RUb3BPZmZzZXQ7XG5cbiAgICAgIGlmIChzZXR0aW5ncy5hY3Rfb25faGlkZGVuX2VsKSB7XG4gICAgICAgIHZhbHMgPSBncm91cCA/IGVxdWFsaXplci5maW5kKCdbJyt0aGlzLmF0dHJfbmFtZSgpKyctd2F0Y2g9XCInK2dyb3VwKydcIl0nKSA6IGVxdWFsaXplci5maW5kKCdbJyt0aGlzLmF0dHJfbmFtZSgpKyctd2F0Y2hdJyk7XG4gICAgICB9XG4gICAgICBlbHNlIHtcbiAgICAgICAgdmFscyA9IGdyb3VwID8gZXF1YWxpemVyLmZpbmQoJ1snK3RoaXMuYXR0cl9uYW1lKCkrJy13YXRjaD1cIicrZ3JvdXArJ1wiXTp2aXNpYmxlJykgOiBlcXVhbGl6ZXIuZmluZCgnWycrdGhpcy5hdHRyX25hbWUoKSsnLXdhdGNoXTp2aXNpYmxlJyk7XG4gICAgICB9XG4gICAgICBcbiAgICAgIGlmICh2YWxzLmxlbmd0aCA9PT0gMCkge1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG5cbiAgICAgIHNldHRpbmdzLmJlZm9yZV9oZWlnaHRfY2hhbmdlKCk7XG4gICAgICBlcXVhbGl6ZXIudHJpZ2dlcignYmVmb3JlLWhlaWdodC1jaGFuZ2UuZm5kdGguZXF1YWxpemVyJyk7XG4gICAgICB2YWxzLmhlaWdodCgnaW5oZXJpdCcpO1xuXG4gICAgICBpZiAoc2V0dGluZ3MuZXF1YWxpemVfb25fc3RhY2sgPT09IGZhbHNlKSB7XG4gICAgICAgIGZpcnN0VG9wT2Zmc2V0ID0gdmFscy5maXJzdCgpLm9mZnNldCgpLnRvcDtcbiAgICAgICAgdmFscy5lYWNoKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICBpZiAoJCh0aGlzKS5vZmZzZXQoKS50b3AgIT09IGZpcnN0VG9wT2Zmc2V0KSB7XG4gICAgICAgICAgICBpc1N0YWNrZWQgPSB0cnVlO1xuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgICAgIGlmIChpc1N0YWNrZWQpIHtcbiAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgdmFyIGhlaWdodHMgPSB2YWxzLm1hcChmdW5jdGlvbiAoKSB7IHJldHVybiAkKHRoaXMpLm91dGVySGVpZ2h0KGZhbHNlKSB9KS5nZXQoKTtcblxuICAgICAgaWYgKHNldHRpbmdzLnVzZV90YWxsZXN0KSB7XG4gICAgICAgIHZhciBtYXggPSBNYXRoLm1heC5hcHBseShudWxsLCBoZWlnaHRzKTtcbiAgICAgICAgdmFscy5jc3MoJ2hlaWdodCcsIG1heCk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB2YXIgbWluID0gTWF0aC5taW4uYXBwbHkobnVsbCwgaGVpZ2h0cyk7XG4gICAgICAgIHZhbHMuY3NzKCdoZWlnaHQnLCBtaW4pO1xuICAgICAgfVxuXG4gICAgICBzZXR0aW5ncy5hZnRlcl9oZWlnaHRfY2hhbmdlKCk7XG4gICAgICBlcXVhbGl6ZXIudHJpZ2dlcignYWZ0ZXItaGVpZ2h0LWNoYW5nZS5mbmR0bi5lcXVhbGl6ZXInKTtcbiAgICB9LFxuXG4gICAgcmVmbG93IDogZnVuY3Rpb24gKCkge1xuICAgICAgdmFyIHNlbGYgPSB0aGlzO1xuXG4gICAgICB0aGlzLlMoJ1snICsgdGhpcy5hdHRyX25hbWUoKSArICddJywgdGhpcy5zY29wZSkuZWFjaChmdW5jdGlvbiAoKSB7XG4gICAgICAgIHZhciAkZXFfdGFyZ2V0ID0gJCh0aGlzKSxcbiAgICAgICAgICAgIG1lZGlhX3F1ZXJ5ID0gJGVxX3RhcmdldC5kYXRhKCdlcXVhbGl6ZXItbXEnKSxcbiAgICAgICAgICAgIGlnbm9yZV9tZWRpYV9xdWVyeSA9IHRydWU7XG5cbiAgICAgICAgaWYgKG1lZGlhX3F1ZXJ5KSB7XG4gICAgICAgICAgbWVkaWFfcXVlcnkgPSAnaXNfJyArIG1lZGlhX3F1ZXJ5LnJlcGxhY2UoLy0vZywgJ18nKTtcbiAgICAgICAgICBpZiAoRm91bmRhdGlvbi51dGlscy5oYXNPd25Qcm9wZXJ0eShtZWRpYV9xdWVyeSkpIHtcbiAgICAgICAgICAgIGlnbm9yZV9tZWRpYV9xdWVyeSA9IGZhbHNlO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIHNlbGYuaW1hZ2VfbG9hZGVkKHNlbGYuUygnaW1nJywgdGhpcyksIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICBpZiAoaWdub3JlX21lZGlhX3F1ZXJ5IHx8IEZvdW5kYXRpb24udXRpbHNbbWVkaWFfcXVlcnldKCkpIHtcbiAgICAgICAgICAgIHNlbGYuZXF1YWxpemUoJGVxX3RhcmdldClcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdmFyIHZhbHMgPSAkZXFfdGFyZ2V0LmZpbmQoJ1snICsgc2VsZi5hdHRyX25hbWUoKSArICctd2F0Y2hdOnZpc2libGUnKTtcbiAgICAgICAgICAgIHZhbHMuY3NzKCdoZWlnaHQnLCAnYXV0bycpO1xuICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgICB9KTtcbiAgICB9XG4gIH07XG59KShqUXVlcnksIHdpbmRvdywgd2luZG93LmRvY3VtZW50KTtcblxuOyhmdW5jdGlvbiAoJCwgd2luZG93LCBkb2N1bWVudCwgdW5kZWZpbmVkKSB7XG4gICd1c2Ugc3RyaWN0JztcblxuICBGb3VuZGF0aW9uLmxpYnMuaW50ZXJjaGFuZ2UgPSB7XG4gICAgbmFtZSA6ICdpbnRlcmNoYW5nZScsXG5cbiAgICB2ZXJzaW9uIDogJzUuNS4yJyxcblxuICAgIGNhY2hlIDoge30sXG5cbiAgICBpbWFnZXNfbG9hZGVkIDogZmFsc2UsXG4gICAgbm9kZXNfbG9hZGVkIDogZmFsc2UsXG5cbiAgICBzZXR0aW5ncyA6IHtcbiAgICAgIGxvYWRfYXR0ciA6ICdpbnRlcmNoYW5nZScsXG5cbiAgICAgIG5hbWVkX3F1ZXJpZXMgOiB7XG4gICAgICAgICdkZWZhdWx0JyAgICAgOiAnb25seSBzY3JlZW4nLFxuICAgICAgICAnc21hbGwnICAgICAgIDogRm91bmRhdGlvbi5tZWRpYV9xdWVyaWVzWydzbWFsbCddLFxuICAgICAgICAnc21hbGwtb25seScgIDogRm91bmRhdGlvbi5tZWRpYV9xdWVyaWVzWydzbWFsbC1vbmx5J10sXG4gICAgICAgICdtZWRpdW0nICAgICAgOiBGb3VuZGF0aW9uLm1lZGlhX3F1ZXJpZXNbJ21lZGl1bSddLFxuICAgICAgICAnbWVkaXVtLW9ubHknIDogRm91bmRhdGlvbi5tZWRpYV9xdWVyaWVzWydtZWRpdW0tb25seSddLFxuICAgICAgICAnbGFyZ2UnICAgICAgIDogRm91bmRhdGlvbi5tZWRpYV9xdWVyaWVzWydsYXJnZSddLFxuICAgICAgICAnbGFyZ2Utb25seScgIDogRm91bmRhdGlvbi5tZWRpYV9xdWVyaWVzWydsYXJnZS1vbmx5J10sXG4gICAgICAgICd4bGFyZ2UnICAgICAgOiBGb3VuZGF0aW9uLm1lZGlhX3F1ZXJpZXNbJ3hsYXJnZSddLFxuICAgICAgICAneGxhcmdlLW9ubHknIDogRm91bmRhdGlvbi5tZWRpYV9xdWVyaWVzWyd4bGFyZ2Utb25seSddLFxuICAgICAgICAneHhsYXJnZScgICAgIDogRm91bmRhdGlvbi5tZWRpYV9xdWVyaWVzWyd4eGxhcmdlJ10sXG4gICAgICAgICdsYW5kc2NhcGUnICAgOiAnb25seSBzY3JlZW4gYW5kIChvcmllbnRhdGlvbjogbGFuZHNjYXBlKScsXG4gICAgICAgICdwb3J0cmFpdCcgICAgOiAnb25seSBzY3JlZW4gYW5kIChvcmllbnRhdGlvbjogcG9ydHJhaXQpJyxcbiAgICAgICAgJ3JldGluYScgICAgICA6ICdvbmx5IHNjcmVlbiBhbmQgKC13ZWJraXQtbWluLWRldmljZS1waXhlbC1yYXRpbzogMiksJyArXG4gICAgICAgICAgJ29ubHkgc2NyZWVuIGFuZCAobWluLS1tb3otZGV2aWNlLXBpeGVsLXJhdGlvOiAyKSwnICtcbiAgICAgICAgICAnb25seSBzY3JlZW4gYW5kICgtby1taW4tZGV2aWNlLXBpeGVsLXJhdGlvOiAyLzEpLCcgK1xuICAgICAgICAgICdvbmx5IHNjcmVlbiBhbmQgKG1pbi1kZXZpY2UtcGl4ZWwtcmF0aW86IDIpLCcgK1xuICAgICAgICAgICdvbmx5IHNjcmVlbiBhbmQgKG1pbi1yZXNvbHV0aW9uOiAxOTJkcGkpLCcgK1xuICAgICAgICAgICdvbmx5IHNjcmVlbiBhbmQgKG1pbi1yZXNvbHV0aW9uOiAyZHBweCknXG4gICAgICB9LFxuXG4gICAgICBkaXJlY3RpdmVzIDoge1xuICAgICAgICByZXBsYWNlIDogZnVuY3Rpb24gKGVsLCBwYXRoLCB0cmlnZ2VyKSB7XG4gICAgICAgICAgLy8gVGhlIHRyaWdnZXIgYXJndW1lbnQsIGlmIGNhbGxlZCB3aXRoaW4gdGhlIGRpcmVjdGl2ZSwgZmlyZXNcbiAgICAgICAgICAvLyBhbiBldmVudCBuYW1lZCBhZnRlciB0aGUgZGlyZWN0aXZlIG9uIHRoZSBlbGVtZW50LCBwYXNzaW5nXG4gICAgICAgICAgLy8gYW55IHBhcmFtZXRlcnMgYWxvbmcgdG8gdGhlIGV2ZW50IHRoYXQgeW91IHBhc3MgdG8gdHJpZ2dlci5cbiAgICAgICAgICAvL1xuICAgICAgICAgIC8vIGV4LiB0cmlnZ2VyKCksIHRyaWdnZXIoW2EsIGIsIGNdKSwgb3IgdHJpZ2dlcihhLCBiLCBjKVxuICAgICAgICAgIC8vXG4gICAgICAgICAgLy8gVGhpcyBhbGxvd3MgeW91IHRvIGJpbmQgYSBjYWxsYmFjayBsaWtlIHNvOlxuICAgICAgICAgIC8vICQoJyNpbnRlcmNoYW5nZUNvbnRhaW5lcicpLm9uKCdyZXBsYWNlJywgZnVuY3Rpb24gKGUsIGEsIGIsIGMpIHtcbiAgICAgICAgICAvLyAgIGNvbnNvbGUubG9nKCQodGhpcykuaHRtbCgpLCBhLCBiLCBjKTtcbiAgICAgICAgICAvLyB9KTtcblxuICAgICAgICAgIGlmIChlbCAhPT0gbnVsbCAmJiAvSU1HLy50ZXN0KGVsWzBdLm5vZGVOYW1lKSkge1xuICAgICAgICAgICAgdmFyIG9yaWdfcGF0aCA9IGVsWzBdLnNyYztcblxuICAgICAgICAgICAgaWYgKG5ldyBSZWdFeHAocGF0aCwgJ2knKS50ZXN0KG9yaWdfcGF0aCkpIHtcbiAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBlbC5hdHRyKFwic3JjXCIsIHBhdGgpO1xuXG4gICAgICAgICAgICByZXR1cm4gdHJpZ2dlcihlbFswXS5zcmMpO1xuICAgICAgICAgIH1cbiAgICAgICAgICB2YXIgbGFzdF9wYXRoID0gZWwuZGF0YSh0aGlzLmRhdGFfYXR0ciArICctbGFzdC1wYXRoJyksXG4gICAgICAgICAgICAgIHNlbGYgPSB0aGlzO1xuXG4gICAgICAgICAgaWYgKGxhc3RfcGF0aCA9PSBwYXRoKSB7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgaWYgKC9cXC4oZ2lmfGpwZ3xqcGVnfHRpZmZ8cG5nKShbPyNdLiopPy9pLnRlc3QocGF0aCkpIHtcbiAgICAgICAgICAgICQoZWwpLmNzcygnYmFja2dyb3VuZC1pbWFnZScsICd1cmwoJyArIHBhdGggKyAnKScpO1xuICAgICAgICAgICAgZWwuZGF0YSgnaW50ZXJjaGFuZ2UtbGFzdC1wYXRoJywgcGF0aCk7XG4gICAgICAgICAgICByZXR1cm4gdHJpZ2dlcihwYXRoKTtcbiAgICAgICAgICB9XG5cbiAgICAgICAgICByZXR1cm4gJC5nZXQocGF0aCwgZnVuY3Rpb24gKHJlc3BvbnNlKSB7XG4gICAgICAgICAgICBlbC5odG1sKHJlc3BvbnNlKTtcbiAgICAgICAgICAgIGVsLmRhdGEoc2VsZi5kYXRhX2F0dHIgKyAnLWxhc3QtcGF0aCcsIHBhdGgpO1xuICAgICAgICAgICAgdHJpZ2dlcigpO1xuICAgICAgICAgIH0pO1xuXG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9LFxuXG4gICAgaW5pdCA6IGZ1bmN0aW9uIChzY29wZSwgbWV0aG9kLCBvcHRpb25zKSB7XG4gICAgICBGb3VuZGF0aW9uLmluaGVyaXQodGhpcywgJ3Rocm90dGxlIHJhbmRvbV9zdHInKTtcblxuICAgICAgdGhpcy5kYXRhX2F0dHIgPSB0aGlzLnNldF9kYXRhX2F0dHIoKTtcbiAgICAgICQuZXh0ZW5kKHRydWUsIHRoaXMuc2V0dGluZ3MsIG1ldGhvZCwgb3B0aW9ucyk7XG4gICAgICB0aGlzLmJpbmRpbmdzKG1ldGhvZCwgb3B0aW9ucyk7XG4gICAgICB0aGlzLnJlZmxvdygpO1xuICAgIH0sXG5cbiAgICBnZXRfbWVkaWFfaGFzaCA6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgdmFyIG1lZGlhSGFzaCA9ICcnO1xuICAgICAgICBmb3IgKHZhciBxdWVyeU5hbWUgaW4gdGhpcy5zZXR0aW5ncy5uYW1lZF9xdWVyaWVzICkge1xuICAgICAgICAgICAgbWVkaWFIYXNoICs9IG1hdGNoTWVkaWEodGhpcy5zZXR0aW5ncy5uYW1lZF9xdWVyaWVzW3F1ZXJ5TmFtZV0pLm1hdGNoZXMudG9TdHJpbmcoKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gbWVkaWFIYXNoO1xuICAgIH0sXG5cbiAgICBldmVudHMgOiBmdW5jdGlvbiAoKSB7XG4gICAgICB2YXIgc2VsZiA9IHRoaXMsIHByZXZNZWRpYUhhc2g7XG5cbiAgICAgICQod2luZG93KVxuICAgICAgICAub2ZmKCcuaW50ZXJjaGFuZ2UnKVxuICAgICAgICAub24oJ3Jlc2l6ZS5mbmR0bi5pbnRlcmNoYW5nZScsIHNlbGYudGhyb3R0bGUoZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgdmFyIGN1cnJNZWRpYUhhc2ggPSBzZWxmLmdldF9tZWRpYV9oYXNoKCk7XG4gICAgICAgICAgICBpZiAoY3Vyck1lZGlhSGFzaCAhPT0gcHJldk1lZGlhSGFzaCkge1xuICAgICAgICAgICAgICAgIHNlbGYucmVzaXplKCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBwcmV2TWVkaWFIYXNoID0gY3Vyck1lZGlhSGFzaDtcbiAgICAgICAgfSwgNTApKTtcblxuICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfSxcblxuICAgIHJlc2l6ZSA6IGZ1bmN0aW9uICgpIHtcbiAgICAgIHZhciBjYWNoZSA9IHRoaXMuY2FjaGU7XG5cbiAgICAgIGlmICghdGhpcy5pbWFnZXNfbG9hZGVkIHx8ICF0aGlzLm5vZGVzX2xvYWRlZCkge1xuICAgICAgICBzZXRUaW1lb3V0KCQucHJveHkodGhpcy5yZXNpemUsIHRoaXMpLCA1MCk7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cblxuICAgICAgZm9yICh2YXIgdXVpZCBpbiBjYWNoZSkge1xuICAgICAgICBpZiAoY2FjaGUuaGFzT3duUHJvcGVydHkodXVpZCkpIHtcbiAgICAgICAgICB2YXIgcGFzc2VkID0gdGhpcy5yZXN1bHRzKHV1aWQsIGNhY2hlW3V1aWRdKTtcbiAgICAgICAgICBpZiAocGFzc2VkKSB7XG4gICAgICAgICAgICB0aGlzLnNldHRpbmdzLmRpcmVjdGl2ZXNbcGFzc2VkXG4gICAgICAgICAgICAgIC5zY2VuYXJpb1sxXV0uY2FsbCh0aGlzLCBwYXNzZWQuZWwsIHBhc3NlZC5zY2VuYXJpb1swXSwgKGZ1bmN0aW9uIChwYXNzZWQpIHtcbiAgICAgICAgICAgICAgICBpZiAoYXJndW1lbnRzWzBdIGluc3RhbmNlb2YgQXJyYXkpIHtcbiAgICAgICAgICAgICAgICAgIHZhciBhcmdzID0gYXJndW1lbnRzWzBdO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICB2YXIgYXJncyA9IEFycmF5LnByb3RvdHlwZS5zbGljZS5jYWxsKGFyZ3VtZW50cywgMCk7XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgcmV0dXJuIGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICAgICAgcGFzc2VkLmVsLnRyaWdnZXIocGFzc2VkLnNjZW5hcmlvWzFdLCBhcmdzKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIH0ocGFzc2VkKSkpO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgfSxcblxuICAgIHJlc3VsdHMgOiBmdW5jdGlvbiAodXVpZCwgc2NlbmFyaW9zKSB7XG4gICAgICB2YXIgY291bnQgPSBzY2VuYXJpb3MubGVuZ3RoO1xuXG4gICAgICBpZiAoY291bnQgPiAwKSB7XG4gICAgICAgIHZhciBlbCA9IHRoaXMuUygnWycgKyB0aGlzLmFkZF9uYW1lc3BhY2UoJ2RhdGEtdXVpZCcpICsgJz1cIicgKyB1dWlkICsgJ1wiXScpO1xuXG4gICAgICAgIHdoaWxlIChjb3VudC0tKSB7XG4gICAgICAgICAgdmFyIG1xLCBydWxlID0gc2NlbmFyaW9zW2NvdW50XVsyXTtcbiAgICAgICAgICBpZiAodGhpcy5zZXR0aW5ncy5uYW1lZF9xdWVyaWVzLmhhc093blByb3BlcnR5KHJ1bGUpKSB7XG4gICAgICAgICAgICBtcSA9IG1hdGNoTWVkaWEodGhpcy5zZXR0aW5ncy5uYW1lZF9xdWVyaWVzW3J1bGVdKTtcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgbXEgPSBtYXRjaE1lZGlhKHJ1bGUpO1xuICAgICAgICAgIH1cbiAgICAgICAgICBpZiAobXEubWF0Y2hlcykge1xuICAgICAgICAgICAgcmV0dXJuIHtlbCA6IGVsLCBzY2VuYXJpbyA6IHNjZW5hcmlvc1tjb3VudF19O1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgfSxcblxuICAgIGxvYWQgOiBmdW5jdGlvbiAodHlwZSwgZm9yY2VfdXBkYXRlKSB7XG4gICAgICBpZiAodHlwZW9mIHRoaXNbJ2NhY2hlZF8nICsgdHlwZV0gPT09ICd1bmRlZmluZWQnIHx8IGZvcmNlX3VwZGF0ZSkge1xuICAgICAgICB0aGlzWyd1cGRhdGVfJyArIHR5cGVdKCk7XG4gICAgICB9XG5cbiAgICAgIHJldHVybiB0aGlzWydjYWNoZWRfJyArIHR5cGVdO1xuICAgIH0sXG5cbiAgICB1cGRhdGVfaW1hZ2VzIDogZnVuY3Rpb24gKCkge1xuICAgICAgdmFyIGltYWdlcyA9IHRoaXMuUygnaW1nWycgKyB0aGlzLmRhdGFfYXR0ciArICddJyksXG4gICAgICAgICAgY291bnQgPSBpbWFnZXMubGVuZ3RoLFxuICAgICAgICAgIGkgPSBjb3VudCxcbiAgICAgICAgICBsb2FkZWRfY291bnQgPSAwLFxuICAgICAgICAgIGRhdGFfYXR0ciA9IHRoaXMuZGF0YV9hdHRyO1xuXG4gICAgICB0aGlzLmNhY2hlID0ge307XG4gICAgICB0aGlzLmNhY2hlZF9pbWFnZXMgPSBbXTtcbiAgICAgIHRoaXMuaW1hZ2VzX2xvYWRlZCA9IChjb3VudCA9PT0gMCk7XG5cbiAgICAgIHdoaWxlIChpLS0pIHtcbiAgICAgICAgbG9hZGVkX2NvdW50Kys7XG4gICAgICAgIGlmIChpbWFnZXNbaV0pIHtcbiAgICAgICAgICB2YXIgc3RyID0gaW1hZ2VzW2ldLmdldEF0dHJpYnV0ZShkYXRhX2F0dHIpIHx8ICcnO1xuXG4gICAgICAgICAgaWYgKHN0ci5sZW5ndGggPiAwKSB7XG4gICAgICAgICAgICB0aGlzLmNhY2hlZF9pbWFnZXMucHVzaChpbWFnZXNbaV0pO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChsb2FkZWRfY291bnQgPT09IGNvdW50KSB7XG4gICAgICAgICAgdGhpcy5pbWFnZXNfbG9hZGVkID0gdHJ1ZTtcbiAgICAgICAgICB0aGlzLmVuaGFuY2UoJ2ltYWdlcycpO1xuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIHJldHVybiB0aGlzO1xuICAgIH0sXG5cbiAgICB1cGRhdGVfbm9kZXMgOiBmdW5jdGlvbiAoKSB7XG4gICAgICB2YXIgbm9kZXMgPSB0aGlzLlMoJ1snICsgdGhpcy5kYXRhX2F0dHIgKyAnXScpLm5vdCgnaW1nJyksXG4gICAgICAgICAgY291bnQgPSBub2Rlcy5sZW5ndGgsXG4gICAgICAgICAgaSA9IGNvdW50LFxuICAgICAgICAgIGxvYWRlZF9jb3VudCA9IDAsXG4gICAgICAgICAgZGF0YV9hdHRyID0gdGhpcy5kYXRhX2F0dHI7XG5cbiAgICAgIHRoaXMuY2FjaGVkX25vZGVzID0gW107XG4gICAgICB0aGlzLm5vZGVzX2xvYWRlZCA9IChjb3VudCA9PT0gMCk7XG5cbiAgICAgIHdoaWxlIChpLS0pIHtcbiAgICAgICAgbG9hZGVkX2NvdW50Kys7XG4gICAgICAgIHZhciBzdHIgPSBub2Rlc1tpXS5nZXRBdHRyaWJ1dGUoZGF0YV9hdHRyKSB8fCAnJztcblxuICAgICAgICBpZiAoc3RyLmxlbmd0aCA+IDApIHtcbiAgICAgICAgICB0aGlzLmNhY2hlZF9ub2Rlcy5wdXNoKG5vZGVzW2ldKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChsb2FkZWRfY291bnQgPT09IGNvdW50KSB7XG4gICAgICAgICAgdGhpcy5ub2Rlc19sb2FkZWQgPSB0cnVlO1xuICAgICAgICAgIHRoaXMuZW5oYW5jZSgnbm9kZXMnKTtcbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICByZXR1cm4gdGhpcztcbiAgICB9LFxuXG4gICAgZW5oYW5jZSA6IGZ1bmN0aW9uICh0eXBlKSB7XG4gICAgICB2YXIgaSA9IHRoaXNbJ2NhY2hlZF8nICsgdHlwZV0ubGVuZ3RoO1xuXG4gICAgICB3aGlsZSAoaS0tKSB7XG4gICAgICAgIHRoaXMub2JqZWN0KCQodGhpc1snY2FjaGVkXycgKyB0eXBlXVtpXSkpO1xuICAgICAgfVxuXG4gICAgICByZXR1cm4gJCh3aW5kb3cpLnRyaWdnZXIoJ3Jlc2l6ZS5mbmR0bi5pbnRlcmNoYW5nZScpO1xuICAgIH0sXG5cbiAgICBjb252ZXJ0X2RpcmVjdGl2ZSA6IGZ1bmN0aW9uIChkaXJlY3RpdmUpIHtcblxuICAgICAgdmFyIHRyaW1tZWQgPSB0aGlzLnRyaW0oZGlyZWN0aXZlKTtcblxuICAgICAgaWYgKHRyaW1tZWQubGVuZ3RoID4gMCkge1xuICAgICAgICByZXR1cm4gdHJpbW1lZDtcbiAgICAgIH1cblxuICAgICAgcmV0dXJuICdyZXBsYWNlJztcbiAgICB9LFxuXG4gICAgcGFyc2Vfc2NlbmFyaW8gOiBmdW5jdGlvbiAoc2NlbmFyaW8pIHtcbiAgICAgIC8vIFRoaXMgbG9naWMgaGFkIHRvIGJlIG1hZGUgbW9yZSBjb21wbGV4IHNpbmNlIHNvbWUgdXNlcnMgd2VyZSB1c2luZyBjb21tYXMgaW4gdGhlIHVybCBwYXRoXG4gICAgICAvLyBTbyB3ZSBjYW5ub3Qgc2ltcGx5IGp1c3Qgc3BsaXQgb24gYSBjb21tYVxuXG4gICAgICB2YXIgZGlyZWN0aXZlX21hdGNoID0gc2NlbmFyaW9bMF0ubWF0Y2goLyguKyksXFxzKihcXHcrKVxccyokLyksXG4gICAgICAvLyBnZXR0aW5nIHRoZSBtcSBoYXMgZ290dGVuIGEgYml0IGNvbXBsaWNhdGVkIHNpbmNlIHdlIHN0YXJ0ZWQgYWNjb3VudGluZyBmb3Igc2V2ZXJhbCB1c2UgY2FzZXNcbiAgICAgIC8vIG9mIFVSTHMuIEZvciBub3cgd2UnbGwgY29udGludWUgdG8gbWF0Y2ggdGhlc2Ugc2NlbmFyaW9zLCBidXQgd2UgbWF5IGNvbnNpZGVyIGhhdmluZyB0aGVzZSBzY2VuYXJpb3NcbiAgICAgIC8vIGFzIG5lc3RlZCBvYmplY3RzIG9yIGFycmF5cyBpbiBGNi5cbiAgICAgIC8vIHJlZ2V4OiBtYXRjaCBldmVyeXRoaW5nIGJlZm9yZSBjbG9zZSBwYXJlbnRoZXNpcyBmb3IgbXFcbiAgICAgIG1lZGlhX3F1ZXJ5ICAgICAgICAgPSBzY2VuYXJpb1sxXS5tYXRjaCgvKC4qKVxcKS8pO1xuXG4gICAgICBpZiAoZGlyZWN0aXZlX21hdGNoKSB7XG4gICAgICAgIHZhciBwYXRoICA9IGRpcmVjdGl2ZV9tYXRjaFsxXSxcbiAgICAgICAgZGlyZWN0aXZlID0gZGlyZWN0aXZlX21hdGNoWzJdO1xuXG4gICAgICB9IGVsc2Uge1xuICAgICAgICB2YXIgY2FjaGVkX3NwbGl0ID0gc2NlbmFyaW9bMF0uc3BsaXQoLyxcXHMqJC8pLFxuICAgICAgICBwYXRoICAgICAgICAgICAgID0gY2FjaGVkX3NwbGl0WzBdLFxuICAgICAgICBkaXJlY3RpdmUgICAgICAgID0gJyc7XG4gICAgICB9XG5cbiAgICAgIHJldHVybiBbdGhpcy50cmltKHBhdGgpLCB0aGlzLmNvbnZlcnRfZGlyZWN0aXZlKGRpcmVjdGl2ZSksIHRoaXMudHJpbShtZWRpYV9xdWVyeVsxXSldO1xuICAgIH0sXG5cbiAgICBvYmplY3QgOiBmdW5jdGlvbiAoZWwpIHtcbiAgICAgIHZhciByYXdfYXJyID0gdGhpcy5wYXJzZV9kYXRhX2F0dHIoZWwpLFxuICAgICAgICAgIHNjZW5hcmlvcyA9IFtdLFxuICAgICAgICAgIGkgPSByYXdfYXJyLmxlbmd0aDtcblxuICAgICAgaWYgKGkgPiAwKSB7XG4gICAgICAgIHdoaWxlIChpLS0pIHtcbiAgICAgICAgICAvLyBzcGxpdCBhcnJheSBiZXR3ZWVuIGNvbW1hIGRlbGltaXRlZCBjb250ZW50IGFuZCBtcVxuICAgICAgICAgIC8vIHJlZ2V4OiBjb21tYSwgb3B0aW9uYWwgc3BhY2UsIG9wZW4gcGFyZW50aGVzaXNcbiAgICAgICAgICB2YXIgc2NlbmFyaW8gPSByYXdfYXJyW2ldLnNwbGl0KC8sXFxzP1xcKC8pO1xuXG4gICAgICAgICAgaWYgKHNjZW5hcmlvLmxlbmd0aCA+IDEpIHtcbiAgICAgICAgICAgIHZhciBwYXJhbXMgPSB0aGlzLnBhcnNlX3NjZW5hcmlvKHNjZW5hcmlvKTtcbiAgICAgICAgICAgIHNjZW5hcmlvcy5wdXNoKHBhcmFtcyk7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIHJldHVybiB0aGlzLnN0b3JlKGVsLCBzY2VuYXJpb3MpO1xuICAgIH0sXG5cbiAgICBzdG9yZSA6IGZ1bmN0aW9uIChlbCwgc2NlbmFyaW9zKSB7XG4gICAgICB2YXIgdXVpZCA9IHRoaXMucmFuZG9tX3N0cigpLFxuICAgICAgICAgIGN1cnJlbnRfdXVpZCA9IGVsLmRhdGEodGhpcy5hZGRfbmFtZXNwYWNlKCd1dWlkJywgdHJ1ZSkpO1xuXG4gICAgICBpZiAodGhpcy5jYWNoZVtjdXJyZW50X3V1aWRdKSB7XG4gICAgICAgIHJldHVybiB0aGlzLmNhY2hlW2N1cnJlbnRfdXVpZF07XG4gICAgICB9XG5cbiAgICAgIGVsLmF0dHIodGhpcy5hZGRfbmFtZXNwYWNlKCdkYXRhLXV1aWQnKSwgdXVpZCk7XG4gICAgICByZXR1cm4gdGhpcy5jYWNoZVt1dWlkXSA9IHNjZW5hcmlvcztcbiAgICB9LFxuXG4gICAgdHJpbSA6IGZ1bmN0aW9uIChzdHIpIHtcblxuICAgICAgaWYgKHR5cGVvZiBzdHIgPT09ICdzdHJpbmcnKSB7XG4gICAgICAgIHJldHVybiAkLnRyaW0oc3RyKTtcbiAgICAgIH1cblxuICAgICAgcmV0dXJuIHN0cjtcbiAgICB9LFxuXG4gICAgc2V0X2RhdGFfYXR0ciA6IGZ1bmN0aW9uIChpbml0KSB7XG4gICAgICBpZiAoaW5pdCkge1xuICAgICAgICBpZiAodGhpcy5uYW1lc3BhY2UubGVuZ3RoID4gMCkge1xuICAgICAgICAgIHJldHVybiB0aGlzLm5hbWVzcGFjZSArICctJyArIHRoaXMuc2V0dGluZ3MubG9hZF9hdHRyO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIHRoaXMuc2V0dGluZ3MubG9hZF9hdHRyO1xuICAgICAgfVxuXG4gICAgICBpZiAodGhpcy5uYW1lc3BhY2UubGVuZ3RoID4gMCkge1xuICAgICAgICByZXR1cm4gJ2RhdGEtJyArIHRoaXMubmFtZXNwYWNlICsgJy0nICsgdGhpcy5zZXR0aW5ncy5sb2FkX2F0dHI7XG4gICAgICB9XG5cbiAgICAgIHJldHVybiAnZGF0YS0nICsgdGhpcy5zZXR0aW5ncy5sb2FkX2F0dHI7XG4gICAgfSxcblxuICAgIHBhcnNlX2RhdGFfYXR0ciA6IGZ1bmN0aW9uIChlbCkge1xuICAgICAgdmFyIHJhdyA9IGVsLmF0dHIodGhpcy5hdHRyX25hbWUoKSkuc3BsaXQoL1xcWyguKj8pXFxdLyksXG4gICAgICAgICAgaSA9IHJhdy5sZW5ndGgsXG4gICAgICAgICAgb3V0cHV0ID0gW107XG5cbiAgICAgIHdoaWxlIChpLS0pIHtcbiAgICAgICAgaWYgKHJhd1tpXS5yZXBsYWNlKC9bXFxXXFxkXSsvLCAnJykubGVuZ3RoID4gNCkge1xuICAgICAgICAgIG91dHB1dC5wdXNoKHJhd1tpXSk7XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgcmV0dXJuIG91dHB1dDtcbiAgICB9LFxuXG4gICAgcmVmbG93IDogZnVuY3Rpb24gKCkge1xuICAgICAgdGhpcy5sb2FkKCdpbWFnZXMnLCB0cnVlKTtcbiAgICAgIHRoaXMubG9hZCgnbm9kZXMnLCB0cnVlKTtcbiAgICB9XG5cbiAgfTtcblxufShqUXVlcnksIHdpbmRvdywgd2luZG93LmRvY3VtZW50KSk7XG5cbjsoZnVuY3Rpb24gKCQsIHdpbmRvdywgZG9jdW1lbnQsIHVuZGVmaW5lZCkge1xuICAndXNlIHN0cmljdCc7XG5cbiAgdmFyIE1vZGVybml6ciA9IE1vZGVybml6ciB8fCBmYWxzZTtcblxuICBGb3VuZGF0aW9uLmxpYnMuam95cmlkZSA9IHtcbiAgICBuYW1lIDogJ2pveXJpZGUnLFxuXG4gICAgdmVyc2lvbiA6ICc1LjUuMicsXG5cbiAgICBkZWZhdWx0cyA6IHtcbiAgICAgIGV4cG9zZSAgICAgICAgICAgICAgICAgICA6IGZhbHNlLCAgICAgLy8gdHVybiBvbiBvciBvZmYgdGhlIGV4cG9zZSBmZWF0dXJlXG4gICAgICBtb2RhbCAgICAgICAgICAgICAgICAgICAgOiB0cnVlLCAgICAgIC8vIFdoZXRoZXIgdG8gY292ZXIgcGFnZSB3aXRoIG1vZGFsIGR1cmluZyB0aGUgdG91clxuICAgICAga2V5Ym9hcmQgICAgICAgICAgICAgICAgIDogdHJ1ZSwgICAgICAvLyBlbmFibGUgbGVmdCwgcmlnaHQgYW5kIGVzYyBrZXlzdHJva2VzXG4gICAgICB0aXBfbG9jYXRpb24gICAgICAgICAgICAgOiAnYm90dG9tJywgIC8vICd0b3AnIG9yICdib3R0b20nIGluIHJlbGF0aW9uIHRvIHBhcmVudFxuICAgICAgbnViX3Bvc2l0aW9uICAgICAgICAgICAgIDogJ2F1dG8nLCAgICAvLyBvdmVycmlkZSBvbiBhIHBlciB0b29sdGlwIGJhc2VzXG4gICAgICBzY3JvbGxfc3BlZWQgICAgICAgICAgICAgOiAxNTAwLCAgICAgIC8vIFBhZ2Ugc2Nyb2xsaW5nIHNwZWVkIGluIG1pbGxpc2Vjb25kcywgMCA9IG5vIHNjcm9sbCBhbmltYXRpb25cbiAgICAgIHNjcm9sbF9hbmltYXRpb24gICAgICAgICA6ICdsaW5lYXInLCAgLy8gc3VwcG9ydHMgJ3N3aW5nJyBhbmQgJ2xpbmVhcicsIGV4dGVuZCB3aXRoIGpRdWVyeSBVSS5cbiAgICAgIHRpbWVyICAgICAgICAgICAgICAgICAgICA6IDAsICAgICAgICAgLy8gMCA9IG5vIHRpbWVyICwgYWxsIG90aGVyIG51bWJlcnMgPSB0aW1lciBpbiBtaWxsaXNlY29uZHNcbiAgICAgIHN0YXJ0X3RpbWVyX29uX2NsaWNrICAgICA6IHRydWUsICAgICAgLy8gdHJ1ZSBvciBmYWxzZSAtIHRydWUgcmVxdWlyZXMgY2xpY2tpbmcgdGhlIGZpcnN0IGJ1dHRvbiBzdGFydCB0aGUgdGltZXJcbiAgICAgIHN0YXJ0X29mZnNldCAgICAgICAgICAgICA6IDAsICAgICAgICAgLy8gdGhlIGluZGV4IG9mIHRoZSB0b29sdGlwIHlvdSB3YW50IHRvIHN0YXJ0IG9uIChpbmRleCBvZiB0aGUgbGkpXG4gICAgICBuZXh0X2J1dHRvbiAgICAgICAgICAgICAgOiB0cnVlLCAgICAgIC8vIHRydWUgb3IgZmFsc2UgdG8gY29udHJvbCB3aGV0aGVyIGEgbmV4dCBidXR0b24gaXMgdXNlZFxuICAgICAgcHJldl9idXR0b24gICAgICAgICAgICAgIDogdHJ1ZSwgICAgICAvLyB0cnVlIG9yIGZhbHNlIHRvIGNvbnRyb2wgd2hldGhlciBhIHByZXYgYnV0dG9uIGlzIHVzZWRcbiAgICAgIHRpcF9hbmltYXRpb24gICAgICAgICAgICA6ICdmYWRlJywgICAgLy8gJ3BvcCcgb3IgJ2ZhZGUnIGluIGVhY2ggdGlwXG4gICAgICBwYXVzZV9hZnRlciAgICAgICAgICAgICAgOiBbXSwgICAgICAgIC8vIGFycmF5IG9mIGluZGV4ZXMgd2hlcmUgdG8gcGF1c2UgdGhlIHRvdXIgYWZ0ZXJcbiAgICAgIGV4cG9zZWQgICAgICAgICAgICAgICAgICA6IFtdLCAgICAgICAgLy8gYXJyYXkgb2YgZXhwb3NlIGVsZW1lbnRzXG4gICAgICB0aXBfYW5pbWF0aW9uX2ZhZGVfc3BlZWQgOiAzMDAsICAgICAgIC8vIHdoZW4gdGlwQW5pbWF0aW9uID0gJ2ZhZGUnIHRoaXMgaXMgc3BlZWQgaW4gbWlsbGlzZWNvbmRzIGZvciB0aGUgdHJhbnNpdGlvblxuICAgICAgY29va2llX21vbnN0ZXIgICAgICAgICAgIDogZmFsc2UsICAgICAvLyB0cnVlIG9yIGZhbHNlIHRvIGNvbnRyb2wgd2hldGhlciBjb29raWVzIGFyZSB1c2VkXG4gICAgICBjb29raWVfbmFtZSAgICAgICAgICAgICAgOiAnam95cmlkZScsIC8vIE5hbWUgdGhlIGNvb2tpZSB5b3UnbGwgdXNlXG4gICAgICBjb29raWVfZG9tYWluICAgICAgICAgICAgOiBmYWxzZSwgICAgIC8vIFdpbGwgdGhpcyBjb29raWUgYmUgYXR0YWNoZWQgdG8gYSBkb21haW4sIGllLiAnLm5vdGFibGVhcHAuY29tJ1xuICAgICAgY29va2llX2V4cGlyZXMgICAgICAgICAgIDogMzY1LCAgICAgICAvLyBzZXQgd2hlbiB5b3Ugd291bGQgbGlrZSB0aGUgY29va2llIHRvIGV4cGlyZS5cbiAgICAgIHRpcF9jb250YWluZXIgICAgICAgICAgICA6ICdib2R5JywgICAgLy8gV2hlcmUgd2lsbCB0aGUgdGlwIGJlIGF0dGFjaGVkXG4gICAgICBhYm9ydF9vbl9jbG9zZSAgICAgICAgICAgOiB0cnVlLCAgICAgIC8vIFdoZW4gdHJ1ZSwgdGhlIGNsb3NlIGV2ZW50IHdpbGwgbm90IGZpcmUgYW55IGNhbGxiYWNrXG4gICAgICB0aXBfbG9jYXRpb25fcGF0dGVybnMgICAgOiB7XG4gICAgICAgIHRvcCA6IFsnYm90dG9tJ10sXG4gICAgICAgIGJvdHRvbSA6IFtdLCAvLyBib3R0b20gc2hvdWxkIG5vdCBuZWVkIHRvIGJlIHJlcG9zaXRpb25lZFxuICAgICAgICBsZWZ0IDogWydyaWdodCcsICd0b3AnLCAnYm90dG9tJ10sXG4gICAgICAgIHJpZ2h0IDogWydsZWZ0JywgJ3RvcCcsICdib3R0b20nXVxuICAgICAgfSxcbiAgICAgIHBvc3RfcmlkZV9jYWxsYmFjayAgICAgOiBmdW5jdGlvbiAoKSB7fSwgICAgLy8gQSBtZXRob2QgdG8gY2FsbCBvbmNlIHRoZSB0b3VyIGNsb3NlcyAoY2FuY2VsZWQgb3IgY29tcGxldGUpXG4gICAgICBwb3N0X3N0ZXBfY2FsbGJhY2sgICAgIDogZnVuY3Rpb24gKCkge30sICAgIC8vIEEgbWV0aG9kIHRvIGNhbGwgYWZ0ZXIgZWFjaCBzdGVwXG4gICAgICBwcmVfc3RlcF9jYWxsYmFjayAgICAgIDogZnVuY3Rpb24gKCkge30sICAgIC8vIEEgbWV0aG9kIHRvIGNhbGwgYmVmb3JlIGVhY2ggc3RlcFxuICAgICAgcHJlX3JpZGVfY2FsbGJhY2sgICAgICA6IGZ1bmN0aW9uICgpIHt9LCAgICAvLyBBIG1ldGhvZCB0byBjYWxsIGJlZm9yZSB0aGUgdG91ciBzdGFydHMgKHBhc3NlZCBpbmRleCwgdGlwLCBhbmQgY2xvbmVkIGV4cG9zZWQgZWxlbWVudClcbiAgICAgIHBvc3RfZXhwb3NlX2NhbGxiYWNrICAgOiBmdW5jdGlvbiAoKSB7fSwgICAgLy8gQSBtZXRob2QgdG8gY2FsbCBhZnRlciBhbiBlbGVtZW50IGhhcyBiZWVuIGV4cG9zZWRcbiAgICAgIHRlbXBsYXRlIDogeyAvLyBIVE1MIHNlZ21lbnRzIGZvciB0aXAgbGF5b3V0XG4gICAgICAgIGxpbmsgICAgICAgICAgOiAnPGEgaHJlZj1cIiNjbG9zZVwiIGNsYXNzPVwiam95cmlkZS1jbG9zZS10aXBcIj4mdGltZXM7PC9hPicsXG4gICAgICAgIHRpbWVyICAgICAgICAgOiAnPGRpdiBjbGFzcz1cImpveXJpZGUtdGltZXItaW5kaWNhdG9yLXdyYXBcIj48c3BhbiBjbGFzcz1cImpveXJpZGUtdGltZXItaW5kaWNhdG9yXCI+PC9zcGFuPjwvZGl2PicsXG4gICAgICAgIHRpcCAgICAgICAgICAgOiAnPGRpdiBjbGFzcz1cImpveXJpZGUtdGlwLWd1aWRlXCI+PHNwYW4gY2xhc3M9XCJqb3lyaWRlLW51YlwiPjwvc3Bhbj48L2Rpdj4nLFxuICAgICAgICB3cmFwcGVyICAgICAgIDogJzxkaXYgY2xhc3M9XCJqb3lyaWRlLWNvbnRlbnQtd3JhcHBlclwiPjwvZGl2PicsXG4gICAgICAgIGJ1dHRvbiAgICAgICAgOiAnPGEgaHJlZj1cIiNcIiBjbGFzcz1cInNtYWxsIGJ1dHRvbiBqb3lyaWRlLW5leHQtdGlwXCI+PC9hPicsXG4gICAgICAgIHByZXZfYnV0dG9uICAgOiAnPGEgaHJlZj1cIiNcIiBjbGFzcz1cInNtYWxsIGJ1dHRvbiBqb3lyaWRlLXByZXYtdGlwXCI+PC9hPicsXG4gICAgICAgIG1vZGFsICAgICAgICAgOiAnPGRpdiBjbGFzcz1cImpveXJpZGUtbW9kYWwtYmdcIj48L2Rpdj4nLFxuICAgICAgICBleHBvc2UgICAgICAgIDogJzxkaXYgY2xhc3M9XCJqb3lyaWRlLWV4cG9zZS13cmFwcGVyXCI+PC9kaXY+JyxcbiAgICAgICAgZXhwb3NlX2NvdmVyICA6ICc8ZGl2IGNsYXNzPVwiam95cmlkZS1leHBvc2UtY292ZXJcIj48L2Rpdj4nXG4gICAgICB9LFxuICAgICAgZXhwb3NlX2FkZF9jbGFzcyA6ICcnIC8vIE9uZSBvciBtb3JlIHNwYWNlLXNlcGFyYXRlZCBjbGFzcyBuYW1lcyB0byBiZSBhZGRlZCB0byBleHBvc2VkIGVsZW1lbnRcbiAgICB9LFxuXG4gICAgaW5pdCA6IGZ1bmN0aW9uIChzY29wZSwgbWV0aG9kLCBvcHRpb25zKSB7XG4gICAgICBGb3VuZGF0aW9uLmluaGVyaXQodGhpcywgJ3Rocm90dGxlIHJhbmRvbV9zdHInKTtcblxuICAgICAgdGhpcy5zZXR0aW5ncyA9IHRoaXMuc2V0dGluZ3MgfHwgJC5leHRlbmQoe30sIHRoaXMuZGVmYXVsdHMsIChvcHRpb25zIHx8IG1ldGhvZCkpO1xuXG4gICAgICB0aGlzLmJpbmRpbmdzKG1ldGhvZCwgb3B0aW9ucylcbiAgICB9LFxuXG4gICAgZ29fbmV4dCA6IGZ1bmN0aW9uICgpIHtcbiAgICAgIGlmICh0aGlzLnNldHRpbmdzLiRsaS5uZXh0KCkubGVuZ3RoIDwgMSkge1xuICAgICAgICB0aGlzLmVuZCgpO1xuICAgICAgfSBlbHNlIGlmICh0aGlzLnNldHRpbmdzLnRpbWVyID4gMCkge1xuICAgICAgICBjbGVhclRpbWVvdXQodGhpcy5zZXR0aW5ncy5hdXRvbWF0ZSk7XG4gICAgICAgIHRoaXMuaGlkZSgpO1xuICAgICAgICB0aGlzLnNob3coKTtcbiAgICAgICAgdGhpcy5zdGFydFRpbWVyKCk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB0aGlzLmhpZGUoKTtcbiAgICAgICAgdGhpcy5zaG93KCk7XG4gICAgICB9XG4gICAgfSxcblxuICAgIGdvX3ByZXYgOiBmdW5jdGlvbiAoKSB7XG4gICAgICBpZiAodGhpcy5zZXR0aW5ncy4kbGkucHJldigpLmxlbmd0aCA8IDEpIHtcbiAgICAgICAgLy8gRG8gbm90aGluZyBpZiB0aGVyZSBhcmUgbm8gcHJldiBlbGVtZW50XG4gICAgICB9IGVsc2UgaWYgKHRoaXMuc2V0dGluZ3MudGltZXIgPiAwKSB7XG4gICAgICAgIGNsZWFyVGltZW91dCh0aGlzLnNldHRpbmdzLmF1dG9tYXRlKTtcbiAgICAgICAgdGhpcy5oaWRlKCk7XG4gICAgICAgIHRoaXMuc2hvdyhudWxsLCB0cnVlKTtcbiAgICAgICAgdGhpcy5zdGFydFRpbWVyKCk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB0aGlzLmhpZGUoKTtcbiAgICAgICAgdGhpcy5zaG93KG51bGwsIHRydWUpO1xuICAgICAgfVxuICAgIH0sXG5cbiAgICBldmVudHMgOiBmdW5jdGlvbiAoKSB7XG4gICAgICB2YXIgc2VsZiA9IHRoaXM7XG5cbiAgICAgICQodGhpcy5zY29wZSlcbiAgICAgICAgLm9mZignLmpveXJpZGUnKVxuICAgICAgICAub24oJ2NsaWNrLmZuZHRuLmpveXJpZGUnLCAnLmpveXJpZGUtbmV4dC10aXAsIC5qb3lyaWRlLW1vZGFsLWJnJywgZnVuY3Rpb24gKGUpIHtcbiAgICAgICAgICBlLnByZXZlbnREZWZhdWx0KCk7XG4gICAgICAgICAgdGhpcy5nb19uZXh0KClcbiAgICAgICAgfS5iaW5kKHRoaXMpKVxuICAgICAgICAub24oJ2NsaWNrLmZuZHRuLmpveXJpZGUnLCAnLmpveXJpZGUtcHJldi10aXAnLCBmdW5jdGlvbiAoZSkge1xuICAgICAgICAgIGUucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgICB0aGlzLmdvX3ByZXYoKTtcbiAgICAgICAgfS5iaW5kKHRoaXMpKVxuXG4gICAgICAgIC5vbignY2xpY2suZm5kdG4uam95cmlkZScsICcuam95cmlkZS1jbG9zZS10aXAnLCBmdW5jdGlvbiAoZSkge1xuICAgICAgICAgIGUucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgICB0aGlzLmVuZCh0aGlzLnNldHRpbmdzLmFib3J0X29uX2Nsb3NlKTtcbiAgICAgICAgfS5iaW5kKHRoaXMpKVxuXG4gICAgICAgIC5vbigna2V5dXAuZm5kdG4uam95cmlkZScsIGZ1bmN0aW9uIChlKSB7XG4gICAgICAgICAgLy8gRG9uJ3QgZG8gYW55dGhpbmcgaWYga2V5c3Ryb2tlcyBhcmUgZGlzYWJsZWRcbiAgICAgICAgICAvLyBvciBpZiB0aGUgam95cmlkZSBpcyBub3QgYmVpbmcgc2hvd25cbiAgICAgICAgICBpZiAoIXRoaXMuc2V0dGluZ3Mua2V5Ym9hcmQgfHwgIXRoaXMuc2V0dGluZ3MucmlkaW5nKSB7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgc3dpdGNoIChlLndoaWNoKSB7XG4gICAgICAgICAgICBjYXNlIDM5OiAvLyByaWdodCBhcnJvd1xuICAgICAgICAgICAgICBlLnByZXZlbnREZWZhdWx0KCk7XG4gICAgICAgICAgICAgIHRoaXMuZ29fbmV4dCgpO1xuICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIGNhc2UgMzc6IC8vIGxlZnQgYXJyb3dcbiAgICAgICAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgICAgICAgICB0aGlzLmdvX3ByZXYoKTtcbiAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICBjYXNlIDI3OiAvLyBlc2NhcGVcbiAgICAgICAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgICAgICAgICB0aGlzLmVuZCh0aGlzLnNldHRpbmdzLmFib3J0X29uX2Nsb3NlKTtcbiAgICAgICAgICB9XG4gICAgICAgIH0uYmluZCh0aGlzKSk7XG5cbiAgICAgICQod2luZG93KVxuICAgICAgICAub2ZmKCcuam95cmlkZScpXG4gICAgICAgIC5vbigncmVzaXplLmZuZHRuLmpveXJpZGUnLCBzZWxmLnRocm90dGxlKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICBpZiAoJCgnWycgKyBzZWxmLmF0dHJfbmFtZSgpICsgJ10nKS5sZW5ndGggPiAwICYmIHNlbGYuc2V0dGluZ3MuJG5leHRfdGlwICYmIHNlbGYuc2V0dGluZ3MucmlkaW5nKSB7XG4gICAgICAgICAgICBpZiAoc2VsZi5zZXR0aW5ncy5leHBvc2VkLmxlbmd0aCA+IDApIHtcbiAgICAgICAgICAgICAgdmFyICRlbHMgPSAkKHNlbGYuc2V0dGluZ3MuZXhwb3NlZCk7XG5cbiAgICAgICAgICAgICAgJGVscy5lYWNoKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICB2YXIgJHRoaXMgPSAkKHRoaXMpO1xuICAgICAgICAgICAgICAgIHNlbGYudW5fZXhwb3NlKCR0aGlzKTtcbiAgICAgICAgICAgICAgICBzZWxmLmV4cG9zZSgkdGhpcyk7XG4gICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBpZiAoc2VsZi5pc19waG9uZSgpKSB7XG4gICAgICAgICAgICAgIHNlbGYucG9zX3Bob25lKCk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICBzZWxmLnBvc19kZWZhdWx0KGZhbHNlKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgIH0sIDEwMCkpO1xuICAgIH0sXG5cbiAgICBzdGFydCA6IGZ1bmN0aW9uICgpIHtcbiAgICAgIHZhciBzZWxmID0gdGhpcyxcbiAgICAgICAgICAkdGhpcyA9ICQoJ1snICsgdGhpcy5hdHRyX25hbWUoKSArICddJywgdGhpcy5zY29wZSksXG4gICAgICAgICAgaW50ZWdlcl9zZXR0aW5ncyA9IFsndGltZXInLCAnc2Nyb2xsU3BlZWQnLCAnc3RhcnRPZmZzZXQnLCAndGlwQW5pbWF0aW9uRmFkZVNwZWVkJywgJ2Nvb2tpZUV4cGlyZXMnXSxcbiAgICAgICAgICBpbnRfc2V0dGluZ3NfY291bnQgPSBpbnRlZ2VyX3NldHRpbmdzLmxlbmd0aDtcblxuICAgICAgaWYgKCEkdGhpcy5sZW5ndGggPiAwKSB7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cblxuICAgICAgaWYgKCF0aGlzLnNldHRpbmdzLmluaXQpIHtcbiAgICAgICAgdGhpcy5ldmVudHMoKTtcbiAgICAgIH1cblxuICAgICAgdGhpcy5zZXR0aW5ncyA9ICR0aGlzLmRhdGEodGhpcy5hdHRyX25hbWUodHJ1ZSkgKyAnLWluaXQnKTtcblxuICAgICAgLy8gbm9uIGNvbmZpZ3VyZWFibGUgc2V0dGluZ3NcbiAgICAgIHRoaXMuc2V0dGluZ3MuJGNvbnRlbnRfZWwgPSAkdGhpcztcbiAgICAgIHRoaXMuc2V0dGluZ3MuJGJvZHkgPSAkKHRoaXMuc2V0dGluZ3MudGlwX2NvbnRhaW5lcik7XG4gICAgICB0aGlzLnNldHRpbmdzLmJvZHlfb2Zmc2V0ID0gJCh0aGlzLnNldHRpbmdzLnRpcF9jb250YWluZXIpLnBvc2l0aW9uKCk7XG4gICAgICB0aGlzLnNldHRpbmdzLiR0aXBfY29udGVudCA9IHRoaXMuc2V0dGluZ3MuJGNvbnRlbnRfZWwuZmluZCgnPiBsaScpO1xuICAgICAgdGhpcy5zZXR0aW5ncy5wYXVzZWQgPSBmYWxzZTtcbiAgICAgIHRoaXMuc2V0dGluZ3MuYXR0ZW1wdHMgPSAwO1xuICAgICAgdGhpcy5zZXR0aW5ncy5yaWRpbmcgPSB0cnVlO1xuXG4gICAgICAvLyBjYW4gd2UgY3JlYXRlIGNvb2tpZXM/XG4gICAgICBpZiAodHlwZW9mICQuY29va2llICE9PSAnZnVuY3Rpb24nKSB7XG4gICAgICAgIHRoaXMuc2V0dGluZ3MuY29va2llX21vbnN0ZXIgPSBmYWxzZTtcbiAgICAgIH1cblxuICAgICAgLy8gZ2VuZXJhdGUgdGhlIHRpcHMgYW5kIGluc2VydCBpbnRvIGRvbS5cbiAgICAgIGlmICghdGhpcy5zZXR0aW5ncy5jb29raWVfbW9uc3RlciB8fCB0aGlzLnNldHRpbmdzLmNvb2tpZV9tb25zdGVyICYmICEkLmNvb2tpZSh0aGlzLnNldHRpbmdzLmNvb2tpZV9uYW1lKSkge1xuICAgICAgICB0aGlzLnNldHRpbmdzLiR0aXBfY29udGVudC5lYWNoKGZ1bmN0aW9uIChpbmRleCkge1xuICAgICAgICAgIHZhciAkdGhpcyA9ICQodGhpcyk7XG4gICAgICAgICAgdGhpcy5zZXR0aW5ncyA9ICQuZXh0ZW5kKHt9LCBzZWxmLmRlZmF1bHRzLCBzZWxmLmRhdGFfb3B0aW9ucygkdGhpcykpO1xuXG4gICAgICAgICAgLy8gTWFrZSBzdXJlIHRoYXQgc2V0dGluZ3MgcGFyc2VkIGZyb20gZGF0YV9vcHRpb25zIGFyZSBpbnRlZ2VycyB3aGVyZSBuZWNlc3NhcnlcbiAgICAgICAgICB2YXIgaSA9IGludF9zZXR0aW5nc19jb3VudDtcbiAgICAgICAgICB3aGlsZSAoaS0tKSB7XG4gICAgICAgICAgICBzZWxmLnNldHRpbmdzW2ludGVnZXJfc2V0dGluZ3NbaV1dID0gcGFyc2VJbnQoc2VsZi5zZXR0aW5nc1tpbnRlZ2VyX3NldHRpbmdzW2ldXSwgMTApO1xuICAgICAgICAgIH1cbiAgICAgICAgICBzZWxmLmNyZWF0ZSh7JGxpIDogJHRoaXMsIGluZGV4IDogaW5kZXh9KTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgLy8gc2hvdyBmaXJzdCB0aXBcbiAgICAgICAgaWYgKCF0aGlzLnNldHRpbmdzLnN0YXJ0X3RpbWVyX29uX2NsaWNrICYmIHRoaXMuc2V0dGluZ3MudGltZXIgPiAwKSB7XG4gICAgICAgICAgdGhpcy5zaG93KCdpbml0Jyk7XG4gICAgICAgICAgdGhpcy5zdGFydFRpbWVyKCk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgdGhpcy5zaG93KCdpbml0Jyk7XG4gICAgICAgIH1cblxuICAgICAgfVxuICAgIH0sXG5cbiAgICByZXN1bWUgOiBmdW5jdGlvbiAoKSB7XG4gICAgICB0aGlzLnNldF9saSgpO1xuICAgICAgdGhpcy5zaG93KCk7XG4gICAgfSxcblxuICAgIHRpcF90ZW1wbGF0ZSA6IGZ1bmN0aW9uIChvcHRzKSB7XG4gICAgICB2YXIgJGJsYW5rLCBjb250ZW50O1xuXG4gICAgICBvcHRzLnRpcF9jbGFzcyA9IG9wdHMudGlwX2NsYXNzIHx8ICcnO1xuXG4gICAgICAkYmxhbmsgPSAkKHRoaXMuc2V0dGluZ3MudGVtcGxhdGUudGlwKS5hZGRDbGFzcyhvcHRzLnRpcF9jbGFzcyk7XG4gICAgICBjb250ZW50ID0gJC50cmltKCQob3B0cy5saSkuaHRtbCgpKSArXG4gICAgICAgIHRoaXMucHJldl9idXR0b25fdGV4dChvcHRzLnByZXZfYnV0dG9uX3RleHQsIG9wdHMuaW5kZXgpICtcbiAgICAgICAgdGhpcy5idXR0b25fdGV4dChvcHRzLmJ1dHRvbl90ZXh0KSArXG4gICAgICAgIHRoaXMuc2V0dGluZ3MudGVtcGxhdGUubGluayArXG4gICAgICAgIHRoaXMudGltZXJfaW5zdGFuY2Uob3B0cy5pbmRleCk7XG5cbiAgICAgICRibGFuay5hcHBlbmQoJCh0aGlzLnNldHRpbmdzLnRlbXBsYXRlLndyYXBwZXIpKTtcbiAgICAgICRibGFuay5maXJzdCgpLmF0dHIodGhpcy5hZGRfbmFtZXNwYWNlKCdkYXRhLWluZGV4JyksIG9wdHMuaW5kZXgpO1xuICAgICAgJCgnLmpveXJpZGUtY29udGVudC13cmFwcGVyJywgJGJsYW5rKS5hcHBlbmQoY29udGVudCk7XG5cbiAgICAgIHJldHVybiAkYmxhbmtbMF07XG4gICAgfSxcblxuICAgIHRpbWVyX2luc3RhbmNlIDogZnVuY3Rpb24gKGluZGV4KSB7XG4gICAgICB2YXIgdHh0O1xuXG4gICAgICBpZiAoKGluZGV4ID09PSAwICYmIHRoaXMuc2V0dGluZ3Muc3RhcnRfdGltZXJfb25fY2xpY2sgJiYgdGhpcy5zZXR0aW5ncy50aW1lciA+IDApIHx8IHRoaXMuc2V0dGluZ3MudGltZXIgPT09IDApIHtcbiAgICAgICAgdHh0ID0gJyc7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB0eHQgPSAkKHRoaXMuc2V0dGluZ3MudGVtcGxhdGUudGltZXIpWzBdLm91dGVySFRNTDtcbiAgICAgIH1cbiAgICAgIHJldHVybiB0eHQ7XG4gICAgfSxcblxuICAgIGJ1dHRvbl90ZXh0IDogZnVuY3Rpb24gKHR4dCkge1xuICAgICAgaWYgKHRoaXMuc2V0dGluZ3MudGlwX3NldHRpbmdzLm5leHRfYnV0dG9uKSB7XG4gICAgICAgIHR4dCA9ICQudHJpbSh0eHQpIHx8ICdOZXh0JztcbiAgICAgICAgdHh0ID0gJCh0aGlzLnNldHRpbmdzLnRlbXBsYXRlLmJ1dHRvbikuYXBwZW5kKHR4dClbMF0ub3V0ZXJIVE1MO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdHh0ID0gJyc7XG4gICAgICB9XG4gICAgICByZXR1cm4gdHh0O1xuICAgIH0sXG5cbiAgICBwcmV2X2J1dHRvbl90ZXh0IDogZnVuY3Rpb24gKHR4dCwgaWR4KSB7XG4gICAgICBpZiAodGhpcy5zZXR0aW5ncy50aXBfc2V0dGluZ3MucHJldl9idXR0b24pIHtcbiAgICAgICAgdHh0ID0gJC50cmltKHR4dCkgfHwgJ1ByZXZpb3VzJztcblxuICAgICAgICAvLyBBZGQgdGhlIGRpc2FibGVkIGNsYXNzIHRvIHRoZSBidXR0b24gaWYgaXQncyB0aGUgZmlyc3QgZWxlbWVudFxuICAgICAgICBpZiAoaWR4ID09IDApIHtcbiAgICAgICAgICB0eHQgPSAkKHRoaXMuc2V0dGluZ3MudGVtcGxhdGUucHJldl9idXR0b24pLmFwcGVuZCh0eHQpLmFkZENsYXNzKCdkaXNhYmxlZCcpWzBdLm91dGVySFRNTDtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICB0eHQgPSAkKHRoaXMuc2V0dGluZ3MudGVtcGxhdGUucHJldl9idXR0b24pLmFwcGVuZCh0eHQpWzBdLm91dGVySFRNTDtcbiAgICAgICAgfVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdHh0ID0gJyc7XG4gICAgICB9XG4gICAgICByZXR1cm4gdHh0O1xuICAgIH0sXG5cbiAgICBjcmVhdGUgOiBmdW5jdGlvbiAob3B0cykge1xuICAgICAgdGhpcy5zZXR0aW5ncy50aXBfc2V0dGluZ3MgPSAkLmV4dGVuZCh7fSwgdGhpcy5zZXR0aW5ncywgdGhpcy5kYXRhX29wdGlvbnMob3B0cy4kbGkpKTtcbiAgICAgIHZhciBidXR0b25UZXh0ID0gb3B0cy4kbGkuYXR0cih0aGlzLmFkZF9uYW1lc3BhY2UoJ2RhdGEtYnV0dG9uJykpIHx8IG9wdHMuJGxpLmF0dHIodGhpcy5hZGRfbmFtZXNwYWNlKCdkYXRhLXRleHQnKSksXG4gICAgICAgICAgcHJldkJ1dHRvblRleHQgPSBvcHRzLiRsaS5hdHRyKHRoaXMuYWRkX25hbWVzcGFjZSgnZGF0YS1idXR0b24tcHJldicpKSB8fCBvcHRzLiRsaS5hdHRyKHRoaXMuYWRkX25hbWVzcGFjZSgnZGF0YS1wcmV2LXRleHQnKSksXG4gICAgICAgIHRpcENsYXNzID0gb3B0cy4kbGkuYXR0cignY2xhc3MnKSxcbiAgICAgICAgJHRpcF9jb250ZW50ID0gJCh0aGlzLnRpcF90ZW1wbGF0ZSh7XG4gICAgICAgICAgdGlwX2NsYXNzIDogdGlwQ2xhc3MsXG4gICAgICAgICAgaW5kZXggOiBvcHRzLmluZGV4LFxuICAgICAgICAgIGJ1dHRvbl90ZXh0IDogYnV0dG9uVGV4dCxcbiAgICAgICAgICBwcmV2X2J1dHRvbl90ZXh0IDogcHJldkJ1dHRvblRleHQsXG4gICAgICAgICAgbGkgOiBvcHRzLiRsaVxuICAgICAgICB9KSk7XG5cbiAgICAgICQodGhpcy5zZXR0aW5ncy50aXBfY29udGFpbmVyKS5hcHBlbmQoJHRpcF9jb250ZW50KTtcbiAgICB9LFxuXG4gICAgc2hvdyA6IGZ1bmN0aW9uIChpbml0LCBpc19wcmV2KSB7XG4gICAgICB2YXIgJHRpbWVyID0gbnVsbDtcblxuICAgICAgLy8gYXJlIHdlIHBhdXNlZD9cbiAgICAgIGlmICh0aGlzLnNldHRpbmdzLiRsaSA9PT0gdW5kZWZpbmVkIHx8ICgkLmluQXJyYXkodGhpcy5zZXR0aW5ncy4kbGkuaW5kZXgoKSwgdGhpcy5zZXR0aW5ncy5wYXVzZV9hZnRlcikgPT09IC0xKSkge1xuXG4gICAgICAgIC8vIGRvbid0IGdvIHRvIHRoZSBuZXh0IGxpIGlmIHRoZSB0b3VyIHdhcyBwYXVzZWRcbiAgICAgICAgaWYgKHRoaXMuc2V0dGluZ3MucGF1c2VkKSB7XG4gICAgICAgICAgdGhpcy5zZXR0aW5ncy5wYXVzZWQgPSBmYWxzZTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICB0aGlzLnNldF9saShpbml0LCBpc19wcmV2KTtcbiAgICAgICAgfVxuXG4gICAgICAgIHRoaXMuc2V0dGluZ3MuYXR0ZW1wdHMgPSAwO1xuXG4gICAgICAgIGlmICh0aGlzLnNldHRpbmdzLiRsaS5sZW5ndGggJiYgdGhpcy5zZXR0aW5ncy4kdGFyZ2V0Lmxlbmd0aCA+IDApIHtcbiAgICAgICAgICBpZiAoaW5pdCkgeyAvL3J1biB3aGVuIHdlIGZpcnN0IHN0YXJ0XG4gICAgICAgICAgICB0aGlzLnNldHRpbmdzLnByZV9yaWRlX2NhbGxiYWNrKHRoaXMuc2V0dGluZ3MuJGxpLmluZGV4KCksIHRoaXMuc2V0dGluZ3MuJG5leHRfdGlwKTtcbiAgICAgICAgICAgIGlmICh0aGlzLnNldHRpbmdzLm1vZGFsKSB7XG4gICAgICAgICAgICAgIHRoaXMuc2hvd19tb2RhbCgpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cblxuICAgICAgICAgIHRoaXMuc2V0dGluZ3MucHJlX3N0ZXBfY2FsbGJhY2sodGhpcy5zZXR0aW5ncy4kbGkuaW5kZXgoKSwgdGhpcy5zZXR0aW5ncy4kbmV4dF90aXApO1xuXG4gICAgICAgICAgaWYgKHRoaXMuc2V0dGluZ3MubW9kYWwgJiYgdGhpcy5zZXR0aW5ncy5leHBvc2UpIHtcbiAgICAgICAgICAgIHRoaXMuZXhwb3NlKCk7XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgdGhpcy5zZXR0aW5ncy50aXBfc2V0dGluZ3MgPSAkLmV4dGVuZCh7fSwgdGhpcy5zZXR0aW5ncywgdGhpcy5kYXRhX29wdGlvbnModGhpcy5zZXR0aW5ncy4kbGkpKTtcblxuICAgICAgICAgIHRoaXMuc2V0dGluZ3MudGltZXIgPSBwYXJzZUludCh0aGlzLnNldHRpbmdzLnRpbWVyLCAxMCk7XG5cbiAgICAgICAgICB0aGlzLnNldHRpbmdzLnRpcF9zZXR0aW5ncy50aXBfbG9jYXRpb25fcGF0dGVybiA9IHRoaXMuc2V0dGluZ3MudGlwX2xvY2F0aW9uX3BhdHRlcm5zW3RoaXMuc2V0dGluZ3MudGlwX3NldHRpbmdzLnRpcF9sb2NhdGlvbl07XG5cbiAgICAgICAgICAvLyBzY3JvbGwgYW5kIGhpZGUgYmcgaWYgbm90IG1vZGFsXG4gICAgICAgICAgaWYgKCEvYm9keS9pLnRlc3QodGhpcy5zZXR0aW5ncy4kdGFyZ2V0LnNlbGVjdG9yKSkge1xuICAgICAgICAgICAgdmFyIGpveXJpZGVtb2RhbGJnID0gJCgnLmpveXJpZGUtbW9kYWwtYmcnKTtcbiAgICAgICAgICAgIGlmICgvcG9wL2kudGVzdCh0aGlzLnNldHRpbmdzLnRpcEFuaW1hdGlvbikpIHtcbiAgICAgICAgICAgICAgICBqb3lyaWRlbW9kYWxiZy5oaWRlKCk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIGpveXJpZGVtb2RhbGJnLmZhZGVPdXQodGhpcy5zZXR0aW5ncy50aXBBbmltYXRpb25GYWRlU3BlZWQpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgdGhpcy5zY3JvbGxfdG8oKTtcbiAgICAgICAgICB9XG5cbiAgICAgICAgICBpZiAodGhpcy5pc19waG9uZSgpKSB7XG4gICAgICAgICAgICB0aGlzLnBvc19waG9uZSh0cnVlKTtcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdGhpcy5wb3NfZGVmYXVsdCh0cnVlKTtcbiAgICAgICAgICB9XG5cbiAgICAgICAgICAkdGltZXIgPSB0aGlzLnNldHRpbmdzLiRuZXh0X3RpcC5maW5kKCcuam95cmlkZS10aW1lci1pbmRpY2F0b3InKTtcblxuICAgICAgICAgIGlmICgvcG9wL2kudGVzdCh0aGlzLnNldHRpbmdzLnRpcF9hbmltYXRpb24pKSB7XG5cbiAgICAgICAgICAgICR0aW1lci53aWR0aCgwKTtcblxuICAgICAgICAgICAgaWYgKHRoaXMuc2V0dGluZ3MudGltZXIgPiAwKSB7XG5cbiAgICAgICAgICAgICAgdGhpcy5zZXR0aW5ncy4kbmV4dF90aXAuc2hvdygpO1xuXG4gICAgICAgICAgICAgIHNldFRpbWVvdXQoZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgICR0aW1lci5hbmltYXRlKHtcbiAgICAgICAgICAgICAgICAgIHdpZHRoIDogJHRpbWVyLnBhcmVudCgpLndpZHRoKClcbiAgICAgICAgICAgICAgICB9LCB0aGlzLnNldHRpbmdzLnRpbWVyLCAnbGluZWFyJyk7XG4gICAgICAgICAgICAgIH0uYmluZCh0aGlzKSwgdGhpcy5zZXR0aW5ncy50aXBfYW5pbWF0aW9uX2ZhZGVfc3BlZWQpO1xuXG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICB0aGlzLnNldHRpbmdzLiRuZXh0X3RpcC5zaG93KCk7XG5cbiAgICAgICAgICAgIH1cblxuICAgICAgICAgIH0gZWxzZSBpZiAoL2ZhZGUvaS50ZXN0KHRoaXMuc2V0dGluZ3MudGlwX2FuaW1hdGlvbikpIHtcblxuICAgICAgICAgICAgJHRpbWVyLndpZHRoKDApO1xuXG4gICAgICAgICAgICBpZiAodGhpcy5zZXR0aW5ncy50aW1lciA+IDApIHtcblxuICAgICAgICAgICAgICB0aGlzLnNldHRpbmdzLiRuZXh0X3RpcFxuICAgICAgICAgICAgICAgIC5mYWRlSW4odGhpcy5zZXR0aW5ncy50aXBfYW5pbWF0aW9uX2ZhZGVfc3BlZWQpXG4gICAgICAgICAgICAgICAgLnNob3coKTtcblxuICAgICAgICAgICAgICBzZXRUaW1lb3V0KGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICAkdGltZXIuYW5pbWF0ZSh7XG4gICAgICAgICAgICAgICAgICB3aWR0aCA6ICR0aW1lci5wYXJlbnQoKS53aWR0aCgpXG4gICAgICAgICAgICAgICAgfSwgdGhpcy5zZXR0aW5ncy50aW1lciwgJ2xpbmVhcicpO1xuICAgICAgICAgICAgICB9LmJpbmQodGhpcyksIHRoaXMuc2V0dGluZ3MudGlwX2FuaW1hdGlvbl9mYWRlX3NwZWVkKTtcblxuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgdGhpcy5zZXR0aW5ncy4kbmV4dF90aXAuZmFkZUluKHRoaXMuc2V0dGluZ3MudGlwX2FuaW1hdGlvbl9mYWRlX3NwZWVkKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG5cbiAgICAgICAgICB0aGlzLnNldHRpbmdzLiRjdXJyZW50X3RpcCA9IHRoaXMuc2V0dGluZ3MuJG5leHRfdGlwO1xuXG4gICAgICAgIC8vIHNraXAgbm9uLWV4aXN0YW50IHRhcmdldHNcbiAgICAgICAgfSBlbHNlIGlmICh0aGlzLnNldHRpbmdzLiRsaSAmJiB0aGlzLnNldHRpbmdzLiR0YXJnZXQubGVuZ3RoIDwgMSkge1xuXG4gICAgICAgICAgdGhpcy5zaG93KGluaXQsIGlzX3ByZXYpO1xuXG4gICAgICAgIH0gZWxzZSB7XG5cbiAgICAgICAgICB0aGlzLmVuZCgpO1xuXG4gICAgICAgIH1cbiAgICAgIH0gZWxzZSB7XG5cbiAgICAgICAgdGhpcy5zZXR0aW5ncy5wYXVzZWQgPSB0cnVlO1xuXG4gICAgICB9XG5cbiAgICB9LFxuXG4gICAgaXNfcGhvbmUgOiBmdW5jdGlvbiAoKSB7XG4gICAgICByZXR1cm4gbWF0Y2hNZWRpYShGb3VuZGF0aW9uLm1lZGlhX3F1ZXJpZXMuc21hbGwpLm1hdGNoZXMgJiZcbiAgICAgICAgIW1hdGNoTWVkaWEoRm91bmRhdGlvbi5tZWRpYV9xdWVyaWVzLm1lZGl1bSkubWF0Y2hlcztcbiAgICB9LFxuXG4gICAgaGlkZSA6IGZ1bmN0aW9uICgpIHtcbiAgICAgIGlmICh0aGlzLnNldHRpbmdzLm1vZGFsICYmIHRoaXMuc2V0dGluZ3MuZXhwb3NlKSB7XG4gICAgICAgIHRoaXMudW5fZXhwb3NlKCk7XG4gICAgICB9XG5cbiAgICAgIGlmICghdGhpcy5zZXR0aW5ncy5tb2RhbCkge1xuICAgICAgICAkKCcuam95cmlkZS1tb2RhbC1iZycpLmhpZGUoKTtcbiAgICAgIH1cblxuICAgICAgLy8gUHJldmVudCBzY3JvbGwgYm91bmNpbmcuLi53YWl0IHRvIHJlbW92ZSBmcm9tIGxheW91dFxuICAgICAgdGhpcy5zZXR0aW5ncy4kY3VycmVudF90aXAuY3NzKCd2aXNpYmlsaXR5JywgJ2hpZGRlbicpO1xuICAgICAgc2V0VGltZW91dCgkLnByb3h5KGZ1bmN0aW9uICgpIHtcbiAgICAgICAgdGhpcy5oaWRlKCk7XG4gICAgICAgIHRoaXMuY3NzKCd2aXNpYmlsaXR5JywgJ3Zpc2libGUnKTtcbiAgICAgIH0sIHRoaXMuc2V0dGluZ3MuJGN1cnJlbnRfdGlwKSwgMCk7XG4gICAgICB0aGlzLnNldHRpbmdzLnBvc3Rfc3RlcF9jYWxsYmFjayh0aGlzLnNldHRpbmdzLiRsaS5pbmRleCgpLFxuICAgICAgICB0aGlzLnNldHRpbmdzLiRjdXJyZW50X3RpcCk7XG4gICAgfSxcblxuICAgIHNldF9saSA6IGZ1bmN0aW9uIChpbml0LCBpc19wcmV2KSB7XG4gICAgICBpZiAoaW5pdCkge1xuICAgICAgICB0aGlzLnNldHRpbmdzLiRsaSA9IHRoaXMuc2V0dGluZ3MuJHRpcF9jb250ZW50LmVxKHRoaXMuc2V0dGluZ3Muc3RhcnRfb2Zmc2V0KTtcbiAgICAgICAgdGhpcy5zZXRfbmV4dF90aXAoKTtcbiAgICAgICAgdGhpcy5zZXR0aW5ncy4kY3VycmVudF90aXAgPSB0aGlzLnNldHRpbmdzLiRuZXh0X3RpcDtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGlmIChpc19wcmV2KSB7XG4gICAgICAgICAgdGhpcy5zZXR0aW5ncy4kbGkgPSB0aGlzLnNldHRpbmdzLiRsaS5wcmV2KCk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgdGhpcy5zZXR0aW5ncy4kbGkgPSB0aGlzLnNldHRpbmdzLiRsaS5uZXh0KCk7XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5zZXRfbmV4dF90aXAoKTtcbiAgICAgIH1cblxuICAgICAgdGhpcy5zZXRfdGFyZ2V0KCk7XG4gICAgfSxcblxuICAgIHNldF9uZXh0X3RpcCA6IGZ1bmN0aW9uICgpIHtcbiAgICAgIHRoaXMuc2V0dGluZ3MuJG5leHRfdGlwID0gJCgnLmpveXJpZGUtdGlwLWd1aWRlJykuZXEodGhpcy5zZXR0aW5ncy4kbGkuaW5kZXgoKSk7XG4gICAgICB0aGlzLnNldHRpbmdzLiRuZXh0X3RpcC5kYXRhKCdjbG9zZWQnLCAnJyk7XG4gICAgfSxcblxuICAgIHNldF90YXJnZXQgOiBmdW5jdGlvbiAoKSB7XG4gICAgICB2YXIgY2wgPSB0aGlzLnNldHRpbmdzLiRsaS5hdHRyKHRoaXMuYWRkX25hbWVzcGFjZSgnZGF0YS1jbGFzcycpKSxcbiAgICAgICAgICBpZCA9IHRoaXMuc2V0dGluZ3MuJGxpLmF0dHIodGhpcy5hZGRfbmFtZXNwYWNlKCdkYXRhLWlkJykpLFxuICAgICAgICAgICRzZWwgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICBpZiAoaWQpIHtcbiAgICAgICAgICAgICAgcmV0dXJuICQoZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoaWQpKTtcbiAgICAgICAgICAgIH0gZWxzZSBpZiAoY2wpIHtcbiAgICAgICAgICAgICAgcmV0dXJuICQoJy4nICsgY2wpLmZpcnN0KCk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICByZXR1cm4gJCgnYm9keScpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH07XG5cbiAgICAgIHRoaXMuc2V0dGluZ3MuJHRhcmdldCA9ICRzZWwoKTtcbiAgICB9LFxuXG4gICAgc2Nyb2xsX3RvIDogZnVuY3Rpb24gKCkge1xuICAgICAgdmFyIHdpbmRvd19oYWxmLCB0aXBPZmZzZXQ7XG5cbiAgICAgIHdpbmRvd19oYWxmID0gJCh3aW5kb3cpLmhlaWdodCgpIC8gMjtcbiAgICAgIHRpcE9mZnNldCA9IE1hdGguY2VpbCh0aGlzLnNldHRpbmdzLiR0YXJnZXQub2Zmc2V0KCkudG9wIC0gd2luZG93X2hhbGYgKyB0aGlzLnNldHRpbmdzLiRuZXh0X3RpcC5vdXRlckhlaWdodCgpKTtcblxuICAgICAgaWYgKHRpcE9mZnNldCAhPSAwKSB7XG4gICAgICAgICQoJ2h0bWwsIGJvZHknKS5zdG9wKCkuYW5pbWF0ZSh7XG4gICAgICAgICAgc2Nyb2xsVG9wIDogdGlwT2Zmc2V0XG4gICAgICAgIH0sIHRoaXMuc2V0dGluZ3Muc2Nyb2xsX3NwZWVkLCAnc3dpbmcnKTtcbiAgICAgIH1cbiAgICB9LFxuXG4gICAgcGF1c2VkIDogZnVuY3Rpb24gKCkge1xuICAgICAgcmV0dXJuICgkLmluQXJyYXkoKHRoaXMuc2V0dGluZ3MuJGxpLmluZGV4KCkgKyAxKSwgdGhpcy5zZXR0aW5ncy5wYXVzZV9hZnRlcikgPT09IC0xKTtcbiAgICB9LFxuXG4gICAgcmVzdGFydCA6IGZ1bmN0aW9uICgpIHtcbiAgICAgIHRoaXMuaGlkZSgpO1xuICAgICAgdGhpcy5zZXR0aW5ncy4kbGkgPSB1bmRlZmluZWQ7XG4gICAgICB0aGlzLnNob3coJ2luaXQnKTtcbiAgICB9LFxuXG4gICAgcG9zX2RlZmF1bHQgOiBmdW5jdGlvbiAoaW5pdCkge1xuICAgICAgdmFyICRudWIgPSB0aGlzLnNldHRpbmdzLiRuZXh0X3RpcC5maW5kKCcuam95cmlkZS1udWInKSxcbiAgICAgICAgICBudWJfd2lkdGggPSBNYXRoLmNlaWwoJG51Yi5vdXRlcldpZHRoKCkgLyAyKSxcbiAgICAgICAgICBudWJfaGVpZ2h0ID0gTWF0aC5jZWlsKCRudWIub3V0ZXJIZWlnaHQoKSAvIDIpLFxuICAgICAgICAgIHRvZ2dsZSA9IGluaXQgfHwgZmFsc2U7XG5cbiAgICAgIC8vIHRpcCBtdXN0IG5vdCBiZSBcImRpc3BsYXk6IG5vbmVcIiB0byBjYWxjdWxhdGUgcG9zaXRpb25cbiAgICAgIGlmICh0b2dnbGUpIHtcbiAgICAgICAgdGhpcy5zZXR0aW5ncy4kbmV4dF90aXAuY3NzKCd2aXNpYmlsaXR5JywgJ2hpZGRlbicpO1xuICAgICAgICB0aGlzLnNldHRpbmdzLiRuZXh0X3RpcC5zaG93KCk7XG4gICAgICB9XG5cbiAgICAgIGlmICghL2JvZHkvaS50ZXN0KHRoaXMuc2V0dGluZ3MuJHRhcmdldC5zZWxlY3RvcikpIHtcbiAgICAgICAgICB2YXIgdG9wQWRqdXN0bWVudCA9IHRoaXMuc2V0dGluZ3MudGlwX3NldHRpbmdzLnRpcEFkanVzdG1lbnRZID8gcGFyc2VJbnQodGhpcy5zZXR0aW5ncy50aXBfc2V0dGluZ3MudGlwQWRqdXN0bWVudFkpIDogMCxcbiAgICAgICAgICAgICAgbGVmdEFkanVzdG1lbnQgPSB0aGlzLnNldHRpbmdzLnRpcF9zZXR0aW5ncy50aXBBZGp1c3RtZW50WCA/IHBhcnNlSW50KHRoaXMuc2V0dGluZ3MudGlwX3NldHRpbmdzLnRpcEFkanVzdG1lbnRYKSA6IDA7XG5cbiAgICAgICAgICBpZiAodGhpcy5ib3R0b20oKSkge1xuICAgICAgICAgICAgaWYgKHRoaXMucnRsKSB7XG4gICAgICAgICAgICAgIHRoaXMuc2V0dGluZ3MuJG5leHRfdGlwLmNzcyh7XG4gICAgICAgICAgICAgICAgdG9wIDogKHRoaXMuc2V0dGluZ3MuJHRhcmdldC5vZmZzZXQoKS50b3AgKyBudWJfaGVpZ2h0ICsgdGhpcy5zZXR0aW5ncy4kdGFyZ2V0Lm91dGVySGVpZ2h0KCkgKyB0b3BBZGp1c3RtZW50KSxcbiAgICAgICAgICAgICAgICBsZWZ0IDogdGhpcy5zZXR0aW5ncy4kdGFyZ2V0Lm9mZnNldCgpLmxlZnQgKyB0aGlzLnNldHRpbmdzLiR0YXJnZXQub3V0ZXJXaWR0aCgpIC0gdGhpcy5zZXR0aW5ncy4kbmV4dF90aXAub3V0ZXJXaWR0aCgpICsgbGVmdEFkanVzdG1lbnR9KTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgIHRoaXMuc2V0dGluZ3MuJG5leHRfdGlwLmNzcyh7XG4gICAgICAgICAgICAgICAgdG9wIDogKHRoaXMuc2V0dGluZ3MuJHRhcmdldC5vZmZzZXQoKS50b3AgKyBudWJfaGVpZ2h0ICsgdGhpcy5zZXR0aW5ncy4kdGFyZ2V0Lm91dGVySGVpZ2h0KCkgKyB0b3BBZGp1c3RtZW50KSxcbiAgICAgICAgICAgICAgICBsZWZ0IDogdGhpcy5zZXR0aW5ncy4kdGFyZ2V0Lm9mZnNldCgpLmxlZnQgKyBsZWZ0QWRqdXN0bWVudH0pO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICB0aGlzLm51Yl9wb3NpdGlvbigkbnViLCB0aGlzLnNldHRpbmdzLnRpcF9zZXR0aW5ncy5udWJfcG9zaXRpb24sICd0b3AnKTtcblxuICAgICAgICAgIH0gZWxzZSBpZiAodGhpcy50b3AoKSkge1xuICAgICAgICAgICAgaWYgKHRoaXMucnRsKSB7XG4gICAgICAgICAgICAgIHRoaXMuc2V0dGluZ3MuJG5leHRfdGlwLmNzcyh7XG4gICAgICAgICAgICAgICAgdG9wIDogKHRoaXMuc2V0dGluZ3MuJHRhcmdldC5vZmZzZXQoKS50b3AgLSB0aGlzLnNldHRpbmdzLiRuZXh0X3RpcC5vdXRlckhlaWdodCgpIC0gbnViX2hlaWdodCArIHRvcEFkanVzdG1lbnQpLFxuICAgICAgICAgICAgICAgIGxlZnQgOiB0aGlzLnNldHRpbmdzLiR0YXJnZXQub2Zmc2V0KCkubGVmdCArIHRoaXMuc2V0dGluZ3MuJHRhcmdldC5vdXRlcldpZHRoKCkgLSB0aGlzLnNldHRpbmdzLiRuZXh0X3RpcC5vdXRlcldpZHRoKCl9KTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgIHRoaXMuc2V0dGluZ3MuJG5leHRfdGlwLmNzcyh7XG4gICAgICAgICAgICAgICAgdG9wIDogKHRoaXMuc2V0dGluZ3MuJHRhcmdldC5vZmZzZXQoKS50b3AgLSB0aGlzLnNldHRpbmdzLiRuZXh0X3RpcC5vdXRlckhlaWdodCgpIC0gbnViX2hlaWdodCArIHRvcEFkanVzdG1lbnQpLFxuICAgICAgICAgICAgICAgIGxlZnQgOiB0aGlzLnNldHRpbmdzLiR0YXJnZXQub2Zmc2V0KCkubGVmdCArIGxlZnRBZGp1c3RtZW50fSk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHRoaXMubnViX3Bvc2l0aW9uKCRudWIsIHRoaXMuc2V0dGluZ3MudGlwX3NldHRpbmdzLm51Yl9wb3NpdGlvbiwgJ2JvdHRvbScpO1xuXG4gICAgICAgICAgfSBlbHNlIGlmICh0aGlzLnJpZ2h0KCkpIHtcblxuICAgICAgICAgICAgdGhpcy5zZXR0aW5ncy4kbmV4dF90aXAuY3NzKHtcbiAgICAgICAgICAgICAgdG9wIDogdGhpcy5zZXR0aW5ncy4kdGFyZ2V0Lm9mZnNldCgpLnRvcCArIHRvcEFkanVzdG1lbnQsXG4gICAgICAgICAgICAgIGxlZnQgOiAodGhpcy5zZXR0aW5ncy4kdGFyZ2V0Lm91dGVyV2lkdGgoKSArIHRoaXMuc2V0dGluZ3MuJHRhcmdldC5vZmZzZXQoKS5sZWZ0ICsgbnViX3dpZHRoICsgbGVmdEFkanVzdG1lbnQpfSk7XG5cbiAgICAgICAgICAgIHRoaXMubnViX3Bvc2l0aW9uKCRudWIsIHRoaXMuc2V0dGluZ3MudGlwX3NldHRpbmdzLm51Yl9wb3NpdGlvbiwgJ2xlZnQnKTtcblxuICAgICAgICAgIH0gZWxzZSBpZiAodGhpcy5sZWZ0KCkpIHtcblxuICAgICAgICAgICAgdGhpcy5zZXR0aW5ncy4kbmV4dF90aXAuY3NzKHtcbiAgICAgICAgICAgICAgdG9wIDogdGhpcy5zZXR0aW5ncy4kdGFyZ2V0Lm9mZnNldCgpLnRvcCArIHRvcEFkanVzdG1lbnQsXG4gICAgICAgICAgICAgIGxlZnQgOiAodGhpcy5zZXR0aW5ncy4kdGFyZ2V0Lm9mZnNldCgpLmxlZnQgLSB0aGlzLnNldHRpbmdzLiRuZXh0X3RpcC5vdXRlcldpZHRoKCkgLSBudWJfd2lkdGggKyBsZWZ0QWRqdXN0bWVudCl9KTtcblxuICAgICAgICAgICAgdGhpcy5udWJfcG9zaXRpb24oJG51YiwgdGhpcy5zZXR0aW5ncy50aXBfc2V0dGluZ3MubnViX3Bvc2l0aW9uLCAncmlnaHQnKTtcblxuICAgICAgICAgIH1cblxuICAgICAgICAgIGlmICghdGhpcy52aXNpYmxlKHRoaXMuY29ybmVycyh0aGlzLnNldHRpbmdzLiRuZXh0X3RpcCkpICYmIHRoaXMuc2V0dGluZ3MuYXR0ZW1wdHMgPCB0aGlzLnNldHRpbmdzLnRpcF9zZXR0aW5ncy50aXBfbG9jYXRpb25fcGF0dGVybi5sZW5ndGgpIHtcblxuICAgICAgICAgICAgJG51Yi5yZW1vdmVDbGFzcygnYm90dG9tJylcbiAgICAgICAgICAgICAgLnJlbW92ZUNsYXNzKCd0b3AnKVxuICAgICAgICAgICAgICAucmVtb3ZlQ2xhc3MoJ3JpZ2h0JylcbiAgICAgICAgICAgICAgLnJlbW92ZUNsYXNzKCdsZWZ0Jyk7XG5cbiAgICAgICAgICAgIHRoaXMuc2V0dGluZ3MudGlwX3NldHRpbmdzLnRpcF9sb2NhdGlvbiA9IHRoaXMuc2V0dGluZ3MudGlwX3NldHRpbmdzLnRpcF9sb2NhdGlvbl9wYXR0ZXJuW3RoaXMuc2V0dGluZ3MuYXR0ZW1wdHNdO1xuXG4gICAgICAgICAgICB0aGlzLnNldHRpbmdzLmF0dGVtcHRzKys7XG5cbiAgICAgICAgICAgIHRoaXMucG9zX2RlZmF1bHQoKTtcblxuICAgICAgICAgIH1cblxuICAgICAgfSBlbHNlIGlmICh0aGlzLnNldHRpbmdzLiRsaS5sZW5ndGgpIHtcblxuICAgICAgICB0aGlzLnBvc19tb2RhbCgkbnViKTtcblxuICAgICAgfVxuXG4gICAgICBpZiAodG9nZ2xlKSB7XG4gICAgICAgIHRoaXMuc2V0dGluZ3MuJG5leHRfdGlwLmhpZGUoKTtcbiAgICAgICAgdGhpcy5zZXR0aW5ncy4kbmV4dF90aXAuY3NzKCd2aXNpYmlsaXR5JywgJ3Zpc2libGUnKTtcbiAgICAgIH1cblxuICAgIH0sXG5cbiAgICBwb3NfcGhvbmUgOiBmdW5jdGlvbiAoaW5pdCkge1xuICAgICAgdmFyIHRpcF9oZWlnaHQgPSB0aGlzLnNldHRpbmdzLiRuZXh0X3RpcC5vdXRlckhlaWdodCgpLFxuICAgICAgICAgIHRpcF9vZmZzZXQgPSB0aGlzLnNldHRpbmdzLiRuZXh0X3RpcC5vZmZzZXQoKSxcbiAgICAgICAgICB0YXJnZXRfaGVpZ2h0ID0gdGhpcy5zZXR0aW5ncy4kdGFyZ2V0Lm91dGVySGVpZ2h0KCksXG4gICAgICAgICAgJG51YiA9ICQoJy5qb3lyaWRlLW51YicsIHRoaXMuc2V0dGluZ3MuJG5leHRfdGlwKSxcbiAgICAgICAgICBudWJfaGVpZ2h0ID0gTWF0aC5jZWlsKCRudWIub3V0ZXJIZWlnaHQoKSAvIDIpLFxuICAgICAgICAgIHRvZ2dsZSA9IGluaXQgfHwgZmFsc2U7XG5cbiAgICAgICRudWIucmVtb3ZlQ2xhc3MoJ2JvdHRvbScpXG4gICAgICAgIC5yZW1vdmVDbGFzcygndG9wJylcbiAgICAgICAgLnJlbW92ZUNsYXNzKCdyaWdodCcpXG4gICAgICAgIC5yZW1vdmVDbGFzcygnbGVmdCcpO1xuXG4gICAgICBpZiAodG9nZ2xlKSB7XG4gICAgICAgIHRoaXMuc2V0dGluZ3MuJG5leHRfdGlwLmNzcygndmlzaWJpbGl0eScsICdoaWRkZW4nKTtcbiAgICAgICAgdGhpcy5zZXR0aW5ncy4kbmV4dF90aXAuc2hvdygpO1xuICAgICAgfVxuXG4gICAgICBpZiAoIS9ib2R5L2kudGVzdCh0aGlzLnNldHRpbmdzLiR0YXJnZXQuc2VsZWN0b3IpKSB7XG5cbiAgICAgICAgaWYgKHRoaXMudG9wKCkpIHtcblxuICAgICAgICAgICAgdGhpcy5zZXR0aW5ncy4kbmV4dF90aXAub2Zmc2V0KHt0b3AgOiB0aGlzLnNldHRpbmdzLiR0YXJnZXQub2Zmc2V0KCkudG9wIC0gdGlwX2hlaWdodCAtIG51Yl9oZWlnaHR9KTtcbiAgICAgICAgICAgICRudWIuYWRkQ2xhc3MoJ2JvdHRvbScpO1xuXG4gICAgICAgIH0gZWxzZSB7XG5cbiAgICAgICAgICB0aGlzLnNldHRpbmdzLiRuZXh0X3RpcC5vZmZzZXQoe3RvcCA6IHRoaXMuc2V0dGluZ3MuJHRhcmdldC5vZmZzZXQoKS50b3AgKyB0YXJnZXRfaGVpZ2h0ICsgbnViX2hlaWdodH0pO1xuICAgICAgICAgICRudWIuYWRkQ2xhc3MoJ3RvcCcpO1xuXG4gICAgICAgIH1cblxuICAgICAgfSBlbHNlIGlmICh0aGlzLnNldHRpbmdzLiRsaS5sZW5ndGgpIHtcbiAgICAgICAgdGhpcy5wb3NfbW9kYWwoJG51Yik7XG4gICAgICB9XG5cbiAgICAgIGlmICh0b2dnbGUpIHtcbiAgICAgICAgdGhpcy5zZXR0aW5ncy4kbmV4dF90aXAuaGlkZSgpO1xuICAgICAgICB0aGlzLnNldHRpbmdzLiRuZXh0X3RpcC5jc3MoJ3Zpc2liaWxpdHknLCAndmlzaWJsZScpO1xuICAgICAgfVxuICAgIH0sXG5cbiAgICBwb3NfbW9kYWwgOiBmdW5jdGlvbiAoJG51Yikge1xuICAgICAgdGhpcy5jZW50ZXIoKTtcbiAgICAgICRudWIuaGlkZSgpO1xuXG4gICAgICB0aGlzLnNob3dfbW9kYWwoKTtcbiAgICB9LFxuXG4gICAgc2hvd19tb2RhbCA6IGZ1bmN0aW9uICgpIHtcbiAgICAgIGlmICghdGhpcy5zZXR0aW5ncy4kbmV4dF90aXAuZGF0YSgnY2xvc2VkJykpIHtcbiAgICAgICAgdmFyIGpveXJpZGVtb2RhbGJnID0gICQoJy5qb3lyaWRlLW1vZGFsLWJnJyk7XG4gICAgICAgIGlmIChqb3lyaWRlbW9kYWxiZy5sZW5ndGggPCAxKSB7XG4gICAgICAgICAgdmFyIGpveXJpZGVtb2RhbGJnID0gJCh0aGlzLnNldHRpbmdzLnRlbXBsYXRlLm1vZGFsKTtcbiAgICAgICAgICBqb3lyaWRlbW9kYWxiZy5hcHBlbmRUbygnYm9keScpO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKC9wb3AvaS50ZXN0KHRoaXMuc2V0dGluZ3MudGlwX2FuaW1hdGlvbikpIHtcbiAgICAgICAgICAgIGpveXJpZGVtb2RhbGJnLnNob3coKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGpveXJpZGVtb2RhbGJnLmZhZGVJbih0aGlzLnNldHRpbmdzLnRpcF9hbmltYXRpb25fZmFkZV9zcGVlZCk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9LFxuXG4gICAgZXhwb3NlIDogZnVuY3Rpb24gKCkge1xuICAgICAgdmFyIGV4cG9zZSxcbiAgICAgICAgICBleHBvc2VDb3ZlcixcbiAgICAgICAgICBlbCxcbiAgICAgICAgICBvcmlnQ1NTLFxuICAgICAgICAgIG9yaWdDbGFzc2VzLFxuICAgICAgICAgIHJhbmRJZCA9ICdleHBvc2UtJyArIHRoaXMucmFuZG9tX3N0cig2KTtcblxuICAgICAgaWYgKGFyZ3VtZW50cy5sZW5ndGggPiAwICYmIGFyZ3VtZW50c1swXSBpbnN0YW5jZW9mICQpIHtcbiAgICAgICAgZWwgPSBhcmd1bWVudHNbMF07XG4gICAgICB9IGVsc2UgaWYgKHRoaXMuc2V0dGluZ3MuJHRhcmdldCAmJiAhL2JvZHkvaS50ZXN0KHRoaXMuc2V0dGluZ3MuJHRhcmdldC5zZWxlY3RvcikpIHtcbiAgICAgICAgZWwgPSB0aGlzLnNldHRpbmdzLiR0YXJnZXQ7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICB9XG5cbiAgICAgIGlmIChlbC5sZW5ndGggPCAxKSB7XG4gICAgICAgIGlmICh3aW5kb3cuY29uc29sZSkge1xuICAgICAgICAgIGNvbnNvbGUuZXJyb3IoJ2VsZW1lbnQgbm90IHZhbGlkJywgZWwpO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgIH1cblxuICAgICAgZXhwb3NlID0gJCh0aGlzLnNldHRpbmdzLnRlbXBsYXRlLmV4cG9zZSk7XG4gICAgICB0aGlzLnNldHRpbmdzLiRib2R5LmFwcGVuZChleHBvc2UpO1xuICAgICAgZXhwb3NlLmNzcyh7XG4gICAgICAgIHRvcCA6IGVsLm9mZnNldCgpLnRvcCxcbiAgICAgICAgbGVmdCA6IGVsLm9mZnNldCgpLmxlZnQsXG4gICAgICAgIHdpZHRoIDogZWwub3V0ZXJXaWR0aCh0cnVlKSxcbiAgICAgICAgaGVpZ2h0IDogZWwub3V0ZXJIZWlnaHQodHJ1ZSlcbiAgICAgIH0pO1xuXG4gICAgICBleHBvc2VDb3ZlciA9ICQodGhpcy5zZXR0aW5ncy50ZW1wbGF0ZS5leHBvc2VfY292ZXIpO1xuXG4gICAgICBvcmlnQ1NTID0ge1xuICAgICAgICB6SW5kZXggOiBlbC5jc3MoJ3otaW5kZXgnKSxcbiAgICAgICAgcG9zaXRpb24gOiBlbC5jc3MoJ3Bvc2l0aW9uJylcbiAgICAgIH07XG5cbiAgICAgIG9yaWdDbGFzc2VzID0gZWwuYXR0cignY2xhc3MnKSA9PSBudWxsID8gJycgOiBlbC5hdHRyKCdjbGFzcycpO1xuXG4gICAgICBlbC5jc3MoJ3otaW5kZXgnLCBwYXJzZUludChleHBvc2UuY3NzKCd6LWluZGV4JykpICsgMSk7XG5cbiAgICAgIGlmIChvcmlnQ1NTLnBvc2l0aW9uID09ICdzdGF0aWMnKSB7XG4gICAgICAgIGVsLmNzcygncG9zaXRpb24nLCAncmVsYXRpdmUnKTtcbiAgICAgIH1cblxuICAgICAgZWwuZGF0YSgnZXhwb3NlLWNzcycsIG9yaWdDU1MpO1xuICAgICAgZWwuZGF0YSgnb3JpZy1jbGFzcycsIG9yaWdDbGFzc2VzKTtcbiAgICAgIGVsLmF0dHIoJ2NsYXNzJywgb3JpZ0NsYXNzZXMgKyAnICcgKyB0aGlzLnNldHRpbmdzLmV4cG9zZV9hZGRfY2xhc3MpO1xuXG4gICAgICBleHBvc2VDb3Zlci5jc3Moe1xuICAgICAgICB0b3AgOiBlbC5vZmZzZXQoKS50b3AsXG4gICAgICAgIGxlZnQgOiBlbC5vZmZzZXQoKS5sZWZ0LFxuICAgICAgICB3aWR0aCA6IGVsLm91dGVyV2lkdGgodHJ1ZSksXG4gICAgICAgIGhlaWdodCA6IGVsLm91dGVySGVpZ2h0KHRydWUpXG4gICAgICB9KTtcblxuICAgICAgaWYgKHRoaXMuc2V0dGluZ3MubW9kYWwpIHtcbiAgICAgICAgdGhpcy5zaG93X21vZGFsKCk7XG4gICAgICB9XG5cbiAgICAgIHRoaXMuc2V0dGluZ3MuJGJvZHkuYXBwZW5kKGV4cG9zZUNvdmVyKTtcbiAgICAgIGV4cG9zZS5hZGRDbGFzcyhyYW5kSWQpO1xuICAgICAgZXhwb3NlQ292ZXIuYWRkQ2xhc3MocmFuZElkKTtcbiAgICAgIGVsLmRhdGEoJ2V4cG9zZScsIHJhbmRJZCk7XG4gICAgICB0aGlzLnNldHRpbmdzLnBvc3RfZXhwb3NlX2NhbGxiYWNrKHRoaXMuc2V0dGluZ3MuJGxpLmluZGV4KCksIHRoaXMuc2V0dGluZ3MuJG5leHRfdGlwLCBlbCk7XG4gICAgICB0aGlzLmFkZF9leHBvc2VkKGVsKTtcbiAgICB9LFxuXG4gICAgdW5fZXhwb3NlIDogZnVuY3Rpb24gKCkge1xuICAgICAgdmFyIGV4cG9zZUlkLFxuICAgICAgICAgIGVsLFxuICAgICAgICAgIGV4cG9zZSxcbiAgICAgICAgICBvcmlnQ1NTLFxuICAgICAgICAgIG9yaWdDbGFzc2VzLFxuICAgICAgICAgIGNsZWFyQWxsID0gZmFsc2U7XG5cbiAgICAgIGlmIChhcmd1bWVudHMubGVuZ3RoID4gMCAmJiBhcmd1bWVudHNbMF0gaW5zdGFuY2VvZiAkKSB7XG4gICAgICAgIGVsID0gYXJndW1lbnRzWzBdO1xuICAgICAgfSBlbHNlIGlmICh0aGlzLnNldHRpbmdzLiR0YXJnZXQgJiYgIS9ib2R5L2kudGVzdCh0aGlzLnNldHRpbmdzLiR0YXJnZXQuc2VsZWN0b3IpKSB7XG4gICAgICAgIGVsID0gdGhpcy5zZXR0aW5ncy4kdGFyZ2V0O1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgfVxuXG4gICAgICBpZiAoZWwubGVuZ3RoIDwgMSkge1xuICAgICAgICBpZiAod2luZG93LmNvbnNvbGUpIHtcbiAgICAgICAgICBjb25zb2xlLmVycm9yKCdlbGVtZW50IG5vdCB2YWxpZCcsIGVsKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICB9XG5cbiAgICAgIGV4cG9zZUlkID0gZWwuZGF0YSgnZXhwb3NlJyk7XG4gICAgICBleHBvc2UgPSAkKCcuJyArIGV4cG9zZUlkKTtcblxuICAgICAgaWYgKGFyZ3VtZW50cy5sZW5ndGggPiAxKSB7XG4gICAgICAgIGNsZWFyQWxsID0gYXJndW1lbnRzWzFdO1xuICAgICAgfVxuXG4gICAgICBpZiAoY2xlYXJBbGwgPT09IHRydWUpIHtcbiAgICAgICAgJCgnLmpveXJpZGUtZXhwb3NlLXdyYXBwZXIsLmpveXJpZGUtZXhwb3NlLWNvdmVyJykucmVtb3ZlKCk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBleHBvc2UucmVtb3ZlKCk7XG4gICAgICB9XG5cbiAgICAgIG9yaWdDU1MgPSBlbC5kYXRhKCdleHBvc2UtY3NzJyk7XG5cbiAgICAgIGlmIChvcmlnQ1NTLnpJbmRleCA9PSAnYXV0bycpIHtcbiAgICAgICAgZWwuY3NzKCd6LWluZGV4JywgJycpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgZWwuY3NzKCd6LWluZGV4Jywgb3JpZ0NTUy56SW5kZXgpO1xuICAgICAgfVxuXG4gICAgICBpZiAob3JpZ0NTUy5wb3NpdGlvbiAhPSBlbC5jc3MoJ3Bvc2l0aW9uJykpIHtcbiAgICAgICAgaWYgKG9yaWdDU1MucG9zaXRpb24gPT0gJ3N0YXRpYycpIHsvLyB0aGlzIGlzIGRlZmF1bHQsIG5vIG5lZWQgdG8gc2V0IGl0LlxuICAgICAgICAgIGVsLmNzcygncG9zaXRpb24nLCAnJyk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgZWwuY3NzKCdwb3NpdGlvbicsIG9yaWdDU1MucG9zaXRpb24pO1xuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIG9yaWdDbGFzc2VzID0gZWwuZGF0YSgnb3JpZy1jbGFzcycpO1xuICAgICAgZWwuYXR0cignY2xhc3MnLCBvcmlnQ2xhc3Nlcyk7XG4gICAgICBlbC5yZW1vdmVEYXRhKCdvcmlnLWNsYXNzZXMnKTtcblxuICAgICAgZWwucmVtb3ZlRGF0YSgnZXhwb3NlJyk7XG4gICAgICBlbC5yZW1vdmVEYXRhKCdleHBvc2Utei1pbmRleCcpO1xuICAgICAgdGhpcy5yZW1vdmVfZXhwb3NlZChlbCk7XG4gICAgfSxcblxuICAgIGFkZF9leHBvc2VkIDogZnVuY3Rpb24gKGVsKSB7XG4gICAgICB0aGlzLnNldHRpbmdzLmV4cG9zZWQgPSB0aGlzLnNldHRpbmdzLmV4cG9zZWQgfHwgW107XG4gICAgICBpZiAoZWwgaW5zdGFuY2VvZiAkIHx8IHR5cGVvZiBlbCA9PT0gJ29iamVjdCcpIHtcbiAgICAgICAgdGhpcy5zZXR0aW5ncy5leHBvc2VkLnB1c2goZWxbMF0pO1xuICAgICAgfSBlbHNlIGlmICh0eXBlb2YgZWwgPT0gJ3N0cmluZycpIHtcbiAgICAgICAgdGhpcy5zZXR0aW5ncy5leHBvc2VkLnB1c2goZWwpO1xuICAgICAgfVxuICAgIH0sXG5cbiAgICByZW1vdmVfZXhwb3NlZCA6IGZ1bmN0aW9uIChlbCkge1xuICAgICAgdmFyIHNlYXJjaCwgaTtcbiAgICAgIGlmIChlbCBpbnN0YW5jZW9mICQpIHtcbiAgICAgICAgc2VhcmNoID0gZWxbMF1cbiAgICAgIH0gZWxzZSBpZiAodHlwZW9mIGVsID09ICdzdHJpbmcnKSB7XG4gICAgICAgIHNlYXJjaCA9IGVsO1xuICAgICAgfVxuXG4gICAgICB0aGlzLnNldHRpbmdzLmV4cG9zZWQgPSB0aGlzLnNldHRpbmdzLmV4cG9zZWQgfHwgW107XG4gICAgICBpID0gdGhpcy5zZXR0aW5ncy5leHBvc2VkLmxlbmd0aDtcblxuICAgICAgd2hpbGUgKGktLSkge1xuICAgICAgICBpZiAodGhpcy5zZXR0aW5ncy5leHBvc2VkW2ldID09IHNlYXJjaCkge1xuICAgICAgICAgIHRoaXMuc2V0dGluZ3MuZXhwb3NlZC5zcGxpY2UoaSwgMSk7XG4gICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfSxcblxuICAgIGNlbnRlciA6IGZ1bmN0aW9uICgpIHtcbiAgICAgIHZhciAkdyA9ICQod2luZG93KTtcblxuICAgICAgdGhpcy5zZXR0aW5ncy4kbmV4dF90aXAuY3NzKHtcbiAgICAgICAgdG9wIDogKCgoJHcuaGVpZ2h0KCkgLSB0aGlzLnNldHRpbmdzLiRuZXh0X3RpcC5vdXRlckhlaWdodCgpKSAvIDIpICsgJHcuc2Nyb2xsVG9wKCkpLFxuICAgICAgICBsZWZ0IDogKCgoJHcud2lkdGgoKSAtIHRoaXMuc2V0dGluZ3MuJG5leHRfdGlwLm91dGVyV2lkdGgoKSkgLyAyKSArICR3LnNjcm9sbExlZnQoKSlcbiAgICAgIH0pO1xuXG4gICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9LFxuXG4gICAgYm90dG9tIDogZnVuY3Rpb24gKCkge1xuICAgICAgcmV0dXJuIC9ib3R0b20vaS50ZXN0KHRoaXMuc2V0dGluZ3MudGlwX3NldHRpbmdzLnRpcF9sb2NhdGlvbik7XG4gICAgfSxcblxuICAgIHRvcCA6IGZ1bmN0aW9uICgpIHtcbiAgICAgIHJldHVybiAvdG9wL2kudGVzdCh0aGlzLnNldHRpbmdzLnRpcF9zZXR0aW5ncy50aXBfbG9jYXRpb24pO1xuICAgIH0sXG5cbiAgICByaWdodCA6IGZ1bmN0aW9uICgpIHtcbiAgICAgIHJldHVybiAvcmlnaHQvaS50ZXN0KHRoaXMuc2V0dGluZ3MudGlwX3NldHRpbmdzLnRpcF9sb2NhdGlvbik7XG4gICAgfSxcblxuICAgIGxlZnQgOiBmdW5jdGlvbiAoKSB7XG4gICAgICByZXR1cm4gL2xlZnQvaS50ZXN0KHRoaXMuc2V0dGluZ3MudGlwX3NldHRpbmdzLnRpcF9sb2NhdGlvbik7XG4gICAgfSxcblxuICAgIGNvcm5lcnMgOiBmdW5jdGlvbiAoZWwpIHtcbiAgICAgIHZhciB3ID0gJCh3aW5kb3cpLFxuICAgICAgICAgIHdpbmRvd19oYWxmID0gdy5oZWlnaHQoKSAvIDIsXG4gICAgICAgICAgLy91c2luZyB0aGlzIHRvIGNhbGN1bGF0ZSBzaW5jZSBzY3JvbGwgbWF5IG5vdCBoYXZlIGZpbmlzaGVkIHlldC5cbiAgICAgICAgICB0aXBPZmZzZXQgPSBNYXRoLmNlaWwodGhpcy5zZXR0aW5ncy4kdGFyZ2V0Lm9mZnNldCgpLnRvcCAtIHdpbmRvd19oYWxmICsgdGhpcy5zZXR0aW5ncy4kbmV4dF90aXAub3V0ZXJIZWlnaHQoKSksXG4gICAgICAgICAgcmlnaHQgPSB3LndpZHRoKCkgKyB3LnNjcm9sbExlZnQoKSxcbiAgICAgICAgICBvZmZzZXRCb3R0b20gPSAgdy5oZWlnaHQoKSArIHRpcE9mZnNldCxcbiAgICAgICAgICBib3R0b20gPSB3LmhlaWdodCgpICsgdy5zY3JvbGxUb3AoKSxcbiAgICAgICAgICB0b3AgPSB3LnNjcm9sbFRvcCgpO1xuXG4gICAgICBpZiAodGlwT2Zmc2V0IDwgdG9wKSB7XG4gICAgICAgIGlmICh0aXBPZmZzZXQgPCAwKSB7XG4gICAgICAgICAgdG9wID0gMDtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICB0b3AgPSB0aXBPZmZzZXQ7XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgaWYgKG9mZnNldEJvdHRvbSA+IGJvdHRvbSkge1xuICAgICAgICBib3R0b20gPSBvZmZzZXRCb3R0b207XG4gICAgICB9XG5cbiAgICAgIHJldHVybiBbXG4gICAgICAgIGVsLm9mZnNldCgpLnRvcCA8IHRvcCxcbiAgICAgICAgcmlnaHQgPCBlbC5vZmZzZXQoKS5sZWZ0ICsgZWwub3V0ZXJXaWR0aCgpLFxuICAgICAgICBib3R0b20gPCBlbC5vZmZzZXQoKS50b3AgKyBlbC5vdXRlckhlaWdodCgpLFxuICAgICAgICB3LnNjcm9sbExlZnQoKSA+IGVsLm9mZnNldCgpLmxlZnRcbiAgICAgIF07XG4gICAgfSxcblxuICAgIHZpc2libGUgOiBmdW5jdGlvbiAoaGlkZGVuX2Nvcm5lcnMpIHtcbiAgICAgIHZhciBpID0gaGlkZGVuX2Nvcm5lcnMubGVuZ3RoO1xuXG4gICAgICB3aGlsZSAoaS0tKSB7XG4gICAgICAgIGlmIChoaWRkZW5fY29ybmVyc1tpXSkge1xuICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9LFxuXG4gICAgbnViX3Bvc2l0aW9uIDogZnVuY3Rpb24gKG51YiwgcG9zLCBkZWYpIHtcbiAgICAgIGlmIChwb3MgPT09ICdhdXRvJykge1xuICAgICAgICBudWIuYWRkQ2xhc3MoZGVmKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIG51Yi5hZGRDbGFzcyhwb3MpO1xuICAgICAgfVxuICAgIH0sXG5cbiAgICBzdGFydFRpbWVyIDogZnVuY3Rpb24gKCkge1xuICAgICAgaWYgKHRoaXMuc2V0dGluZ3MuJGxpLmxlbmd0aCkge1xuICAgICAgICB0aGlzLnNldHRpbmdzLmF1dG9tYXRlID0gc2V0VGltZW91dChmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgdGhpcy5oaWRlKCk7XG4gICAgICAgICAgdGhpcy5zaG93KCk7XG4gICAgICAgICAgdGhpcy5zdGFydFRpbWVyKCk7XG4gICAgICAgIH0uYmluZCh0aGlzKSwgdGhpcy5zZXR0aW5ncy50aW1lcik7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBjbGVhclRpbWVvdXQodGhpcy5zZXR0aW5ncy5hdXRvbWF0ZSk7XG4gICAgICB9XG4gICAgfSxcblxuICAgIGVuZCA6IGZ1bmN0aW9uIChhYm9ydCkge1xuICAgICAgaWYgKHRoaXMuc2V0dGluZ3MuY29va2llX21vbnN0ZXIpIHtcbiAgICAgICAgJC5jb29raWUodGhpcy5zZXR0aW5ncy5jb29raWVfbmFtZSwgJ3JpZGRlbicsIHtleHBpcmVzIDogdGhpcy5zZXR0aW5ncy5jb29raWVfZXhwaXJlcywgZG9tYWluIDogdGhpcy5zZXR0aW5ncy5jb29raWVfZG9tYWlufSk7XG4gICAgICB9XG5cbiAgICAgIGlmICh0aGlzLnNldHRpbmdzLnRpbWVyID4gMCkge1xuICAgICAgICBjbGVhclRpbWVvdXQodGhpcy5zZXR0aW5ncy5hdXRvbWF0ZSk7XG4gICAgICB9XG5cbiAgICAgIGlmICh0aGlzLnNldHRpbmdzLm1vZGFsICYmIHRoaXMuc2V0dGluZ3MuZXhwb3NlKSB7XG4gICAgICAgIHRoaXMudW5fZXhwb3NlKCk7XG4gICAgICB9XG5cbiAgICAgIC8vIFVucGx1ZyBrZXlzdHJva2VzIGxpc3RlbmVyXG4gICAgICAkKHRoaXMuc2NvcGUpLm9mZigna2V5dXAuam95cmlkZScpXG5cbiAgICAgIHRoaXMuc2V0dGluZ3MuJG5leHRfdGlwLmRhdGEoJ2Nsb3NlZCcsIHRydWUpO1xuICAgICAgdGhpcy5zZXR0aW5ncy5yaWRpbmcgPSBmYWxzZTtcblxuICAgICAgJCgnLmpveXJpZGUtbW9kYWwtYmcnKS5oaWRlKCk7XG4gICAgICB0aGlzLnNldHRpbmdzLiRjdXJyZW50X3RpcC5oaWRlKCk7XG5cbiAgICAgIGlmICh0eXBlb2YgYWJvcnQgPT09ICd1bmRlZmluZWQnIHx8IGFib3J0ID09PSBmYWxzZSkge1xuICAgICAgICB0aGlzLnNldHRpbmdzLnBvc3Rfc3RlcF9jYWxsYmFjayh0aGlzLnNldHRpbmdzLiRsaS5pbmRleCgpLCB0aGlzLnNldHRpbmdzLiRjdXJyZW50X3RpcCk7XG4gICAgICAgIHRoaXMuc2V0dGluZ3MucG9zdF9yaWRlX2NhbGxiYWNrKHRoaXMuc2V0dGluZ3MuJGxpLmluZGV4KCksIHRoaXMuc2V0dGluZ3MuJGN1cnJlbnRfdGlwKTtcbiAgICAgIH1cblxuICAgICAgJCgnLmpveXJpZGUtdGlwLWd1aWRlJykucmVtb3ZlKCk7XG4gICAgfSxcblxuICAgIG9mZiA6IGZ1bmN0aW9uICgpIHtcbiAgICAgICQodGhpcy5zY29wZSkub2ZmKCcuam95cmlkZScpO1xuICAgICAgJCh3aW5kb3cpLm9mZignLmpveXJpZGUnKTtcbiAgICAgICQoJy5qb3lyaWRlLWNsb3NlLXRpcCwgLmpveXJpZGUtbmV4dC10aXAsIC5qb3lyaWRlLW1vZGFsLWJnJykub2ZmKCcuam95cmlkZScpO1xuICAgICAgJCgnLmpveXJpZGUtdGlwLWd1aWRlLCAuam95cmlkZS1tb2RhbC1iZycpLnJlbW92ZSgpO1xuICAgICAgY2xlYXJUaW1lb3V0KHRoaXMuc2V0dGluZ3MuYXV0b21hdGUpO1xuICAgICAgdGhpcy5zZXR0aW5ncyA9IHt9O1xuICAgIH0sXG5cbiAgICByZWZsb3cgOiBmdW5jdGlvbiAoKSB7fVxuICB9O1xufShqUXVlcnksIHdpbmRvdywgd2luZG93LmRvY3VtZW50KSk7XG5cbjsoZnVuY3Rpb24gKCQsIHdpbmRvdywgZG9jdW1lbnQsIHVuZGVmaW5lZCkge1xuICAndXNlIHN0cmljdCc7XG5cbiAgRm91bmRhdGlvbi5saWJzWydtYWdlbGxhbi1leHBlZGl0aW9uJ10gPSB7XG4gICAgbmFtZSA6ICdtYWdlbGxhbi1leHBlZGl0aW9uJyxcblxuICAgIHZlcnNpb24gOiAnNS41LjInLFxuXG4gICAgc2V0dGluZ3MgOiB7XG4gICAgICBhY3RpdmVfY2xhc3MgOiAnYWN0aXZlJyxcbiAgICAgIHRocmVzaG9sZCA6IDAsIC8vIHBpeGVscyBmcm9tIHRoZSB0b3Agb2YgdGhlIGV4cGVkaXRpb24gZm9yIGl0IHRvIGJlY29tZSBmaXhlc1xuICAgICAgZGVzdGluYXRpb25fdGhyZXNob2xkIDogMjAsIC8vIHBpeGVscyBmcm9tIHRoZSB0b3Agb2YgZGVzdGluYXRpb24gZm9yIGl0IHRvIGJlIGNvbnNpZGVyZWQgYWN0aXZlXG4gICAgICB0aHJvdHRsZV9kZWxheSA6IDMwLCAvLyBjYWxjdWxhdGlvbiB0aHJvdHRsaW5nIHRvIGluY3JlYXNlIGZyYW1lcmF0ZVxuICAgICAgZml4ZWRfdG9wIDogMCwgLy8gdG9wIGRpc3RhbmNlIGluIHBpeGVscyBhc3NpZ2VuZCB0byB0aGUgZml4ZWQgZWxlbWVudCBvbiBzY3JvbGxcbiAgICAgIG9mZnNldF9ieV9oZWlnaHQgOiB0cnVlLCAgLy8gd2hldGhlciB0byBvZmZzZXQgdGhlIGRlc3RpbmF0aW9uIGJ5IHRoZSBleHBlZGl0aW9uIGhlaWdodC4gVXN1YWxseSB5b3Ugd2FudCB0aGlzIHRvIGJlIHRydWUsIHVubGVzcyB5b3VyIGV4cGVkaXRpb24gaXMgb24gdGhlIHNpZGUuXG4gICAgICBkdXJhdGlvbiA6IDcwMCwgLy8gYW5pbWF0aW9uIGR1cmF0aW9uIHRpbWVcbiAgICAgIGVhc2luZyA6ICdzd2luZycgLy8gYW5pbWF0aW9uIGVhc2luZ1xuICAgIH0sXG5cbiAgICBpbml0IDogZnVuY3Rpb24gKHNjb3BlLCBtZXRob2QsIG9wdGlvbnMpIHtcbiAgICAgIEZvdW5kYXRpb24uaW5oZXJpdCh0aGlzLCAndGhyb3R0bGUnKTtcbiAgICAgIHRoaXMuYmluZGluZ3MobWV0aG9kLCBvcHRpb25zKTtcbiAgICB9LFxuXG4gICAgZXZlbnRzIDogZnVuY3Rpb24gKCkge1xuICAgICAgdmFyIHNlbGYgPSB0aGlzLFxuICAgICAgICAgIFMgPSBzZWxmLlMsXG4gICAgICAgICAgc2V0dGluZ3MgPSBzZWxmLnNldHRpbmdzO1xuXG4gICAgICAvLyBpbml0aWFsaXplIGV4cGVkaXRpb24gb2Zmc2V0XG4gICAgICBzZWxmLnNldF9leHBlZGl0aW9uX3Bvc2l0aW9uKCk7XG5cbiAgICAgIFMoc2VsZi5zY29wZSlcbiAgICAgICAgLm9mZignLm1hZ2VsbGFuJylcbiAgICAgICAgLm9uKCdjbGljay5mbmR0bi5tYWdlbGxhbicsICdbJyArIHNlbGYuYWRkX25hbWVzcGFjZSgnZGF0YS1tYWdlbGxhbi1hcnJpdmFsJykgKyAnXSBhW2hyZWYqPSNdJywgZnVuY3Rpb24gKGUpIHtcbiAgICAgICAgICB2YXIgc2FtZUhvc3QgPSAoKHRoaXMuaG9zdG5hbWUgPT09IGxvY2F0aW9uLmhvc3RuYW1lKSB8fCAhdGhpcy5ob3N0bmFtZSksXG4gICAgICAgICAgICAgIHNhbWVQYXRoID0gc2VsZi5maWx0ZXJQYXRobmFtZShsb2NhdGlvbi5wYXRobmFtZSkgPT09IHNlbGYuZmlsdGVyUGF0aG5hbWUodGhpcy5wYXRobmFtZSksXG4gICAgICAgICAgICAgIHRlc3RIYXNoID0gdGhpcy5oYXNoLnJlcGxhY2UoLyg6fFxcLnxcXC8pL2csICdcXFxcJDEnKSxcbiAgICAgICAgICAgICAgYW5jaG9yID0gdGhpcztcblxuICAgICAgICAgIGlmIChzYW1lSG9zdCAmJiBzYW1lUGF0aCAmJiB0ZXN0SGFzaCkge1xuICAgICAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgICAgICAgdmFyIGV4cGVkaXRpb24gPSAkKHRoaXMpLmNsb3Nlc3QoJ1snICsgc2VsZi5hdHRyX25hbWUoKSArICddJyksXG4gICAgICAgICAgICAgICAgc2V0dGluZ3MgPSBleHBlZGl0aW9uLmRhdGEoJ21hZ2VsbGFuLWV4cGVkaXRpb24taW5pdCcpLFxuICAgICAgICAgICAgICAgIGhhc2ggPSB0aGlzLmhhc2guc3BsaXQoJyMnKS5qb2luKCcnKSxcbiAgICAgICAgICAgICAgICB0YXJnZXQgPSAkKCdhW25hbWU9XCInICsgaGFzaCArICdcIl0nKTtcblxuICAgICAgICAgICAgaWYgKHRhcmdldC5sZW5ndGggPT09IDApIHtcbiAgICAgICAgICAgICAgdGFyZ2V0ID0gJCgnIycgKyBoYXNoKTtcblxuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAvLyBBY2NvdW50IGZvciBleHBlZGl0aW9uIGhlaWdodCBpZiBmaXhlZCBwb3NpdGlvblxuICAgICAgICAgICAgdmFyIHNjcm9sbF90b3AgPSB0YXJnZXQub2Zmc2V0KCkudG9wIC0gc2V0dGluZ3MuZGVzdGluYXRpb25fdGhyZXNob2xkICsgMTtcbiAgICAgICAgICAgIGlmIChzZXR0aW5ncy5vZmZzZXRfYnlfaGVpZ2h0KSB7XG4gICAgICAgICAgICAgIHNjcm9sbF90b3AgPSBzY3JvbGxfdG9wIC0gZXhwZWRpdGlvbi5vdXRlckhlaWdodCgpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgJCgnaHRtbCwgYm9keScpLnN0b3AoKS5hbmltYXRlKHtcbiAgICAgICAgICAgICAgJ3Njcm9sbFRvcCcgOiBzY3JvbGxfdG9wXG4gICAgICAgICAgICB9LCBzZXR0aW5ncy5kdXJhdGlvbiwgc2V0dGluZ3MuZWFzaW5nLCBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgIGlmIChoaXN0b3J5LnB1c2hTdGF0ZSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgaGlzdG9yeS5wdXNoU3RhdGUobnVsbCwgbnVsbCwgYW5jaG9yLnBhdGhuYW1lICsgJyMnICsgaGFzaCk7XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBsb2NhdGlvbi5oYXNoID0gYW5jaG9yLnBhdGhuYW1lICsgJyMnICsgaGFzaDtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgfVxuICAgICAgICB9KVxuICAgICAgICAub24oJ3Njcm9sbC5mbmR0bi5tYWdlbGxhbicsIHNlbGYudGhyb3R0bGUodGhpcy5jaGVja19mb3JfYXJyaXZhbHMuYmluZCh0aGlzKSwgc2V0dGluZ3MudGhyb3R0bGVfZGVsYXkpKTtcbiAgICB9LFxuXG4gICAgY2hlY2tfZm9yX2Fycml2YWxzIDogZnVuY3Rpb24gKCkge1xuICAgICAgdmFyIHNlbGYgPSB0aGlzO1xuICAgICAgc2VsZi51cGRhdGVfYXJyaXZhbHMoKTtcbiAgICAgIHNlbGYudXBkYXRlX2V4cGVkaXRpb25fcG9zaXRpb25zKCk7XG4gICAgfSxcblxuICAgIHNldF9leHBlZGl0aW9uX3Bvc2l0aW9uIDogZnVuY3Rpb24gKCkge1xuICAgICAgdmFyIHNlbGYgPSB0aGlzO1xuICAgICAgJCgnWycgKyB0aGlzLmF0dHJfbmFtZSgpICsgJz1maXhlZF0nLCBzZWxmLnNjb3BlKS5lYWNoKGZ1bmN0aW9uIChpZHgsIGVsKSB7XG4gICAgICAgIHZhciBleHBlZGl0aW9uID0gJCh0aGlzKSxcbiAgICAgICAgICAgIHNldHRpbmdzID0gZXhwZWRpdGlvbi5kYXRhKCdtYWdlbGxhbi1leHBlZGl0aW9uLWluaXQnKSxcbiAgICAgICAgICAgIHN0eWxlcyA9IGV4cGVkaXRpb24uYXR0cignc3R5bGVzJyksIC8vIHNhdmUgc3R5bGVzXG4gICAgICAgICAgICB0b3Bfb2Zmc2V0LCBmaXhlZF90b3A7XG5cbiAgICAgICAgZXhwZWRpdGlvbi5hdHRyKCdzdHlsZScsICcnKTtcbiAgICAgICAgdG9wX29mZnNldCA9IGV4cGVkaXRpb24ub2Zmc2V0KCkudG9wICsgc2V0dGluZ3MudGhyZXNob2xkO1xuXG4gICAgICAgIC8vc2V0IGZpeGVkLXRvcCBieSBhdHRyaWJ1dGVcbiAgICAgICAgZml4ZWRfdG9wID0gcGFyc2VJbnQoZXhwZWRpdGlvbi5kYXRhKCdtYWdlbGxhbi1maXhlZC10b3AnKSk7XG4gICAgICAgIGlmICghaXNOYU4oZml4ZWRfdG9wKSkge1xuICAgICAgICAgIHNlbGYuc2V0dGluZ3MuZml4ZWRfdG9wID0gZml4ZWRfdG9wO1xuICAgICAgICB9XG5cbiAgICAgICAgZXhwZWRpdGlvbi5kYXRhKHNlbGYuZGF0YV9hdHRyKCdtYWdlbGxhbi10b3Atb2Zmc2V0JyksIHRvcF9vZmZzZXQpO1xuICAgICAgICBleHBlZGl0aW9uLmF0dHIoJ3N0eWxlJywgc3R5bGVzKTtcbiAgICAgIH0pO1xuICAgIH0sXG5cbiAgICB1cGRhdGVfZXhwZWRpdGlvbl9wb3NpdGlvbnMgOiBmdW5jdGlvbiAoKSB7XG4gICAgICB2YXIgc2VsZiA9IHRoaXMsXG4gICAgICAgICAgd2luZG93X3RvcF9vZmZzZXQgPSAkKHdpbmRvdykuc2Nyb2xsVG9wKCk7XG5cbiAgICAgICQoJ1snICsgdGhpcy5hdHRyX25hbWUoKSArICc9Zml4ZWRdJywgc2VsZi5zY29wZSkuZWFjaChmdW5jdGlvbiAoKSB7XG4gICAgICAgIHZhciBleHBlZGl0aW9uID0gJCh0aGlzKSxcbiAgICAgICAgICAgIHNldHRpbmdzID0gZXhwZWRpdGlvbi5kYXRhKCdtYWdlbGxhbi1leHBlZGl0aW9uLWluaXQnKSxcbiAgICAgICAgICAgIHN0eWxlcyA9IGV4cGVkaXRpb24uYXR0cignc3R5bGUnKSwgLy8gc2F2ZSBzdHlsZXNcbiAgICAgICAgICAgIHRvcF9vZmZzZXQgPSBleHBlZGl0aW9uLmRhdGEoJ21hZ2VsbGFuLXRvcC1vZmZzZXQnKTtcblxuICAgICAgICAvL3Njcm9sbCB0byB0aGUgdG9wIGRpc3RhbmNlXG4gICAgICAgIGlmICh3aW5kb3dfdG9wX29mZnNldCArIHNlbGYuc2V0dGluZ3MuZml4ZWRfdG9wID49IHRvcF9vZmZzZXQpIHtcbiAgICAgICAgICAvLyBQbGFjZWhvbGRlciBhbGxvd3MgaGVpZ2h0IGNhbGN1bGF0aW9ucyB0byBiZSBjb25zaXN0ZW50IGV2ZW4gd2hlblxuICAgICAgICAgIC8vIGFwcGVhcmluZyB0byBzd2l0Y2ggYmV0d2VlbiBmaXhlZC9ub24tZml4ZWQgcGxhY2VtZW50XG4gICAgICAgICAgdmFyIHBsYWNlaG9sZGVyID0gZXhwZWRpdGlvbi5wcmV2KCdbJyArIHNlbGYuYWRkX25hbWVzcGFjZSgnZGF0YS1tYWdlbGxhbi1leHBlZGl0aW9uLWNsb25lJykgKyAnXScpO1xuICAgICAgICAgIGlmIChwbGFjZWhvbGRlci5sZW5ndGggPT09IDApIHtcbiAgICAgICAgICAgIHBsYWNlaG9sZGVyID0gZXhwZWRpdGlvbi5jbG9uZSgpO1xuICAgICAgICAgICAgcGxhY2Vob2xkZXIucmVtb3ZlQXR0cihzZWxmLmF0dHJfbmFtZSgpKTtcbiAgICAgICAgICAgIHBsYWNlaG9sZGVyLmF0dHIoc2VsZi5hZGRfbmFtZXNwYWNlKCdkYXRhLW1hZ2VsbGFuLWV4cGVkaXRpb24tY2xvbmUnKSwgJycpO1xuICAgICAgICAgICAgZXhwZWRpdGlvbi5iZWZvcmUocGxhY2Vob2xkZXIpO1xuICAgICAgICAgIH1cbiAgICAgICAgICBleHBlZGl0aW9uLmNzcyh7cG9zaXRpb24gOidmaXhlZCcsIHRvcCA6IHNldHRpbmdzLmZpeGVkX3RvcH0pLmFkZENsYXNzKCdmaXhlZCcpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIGV4cGVkaXRpb24ucHJldignWycgKyBzZWxmLmFkZF9uYW1lc3BhY2UoJ2RhdGEtbWFnZWxsYW4tZXhwZWRpdGlvbi1jbG9uZScpICsgJ10nKS5yZW1vdmUoKTtcbiAgICAgICAgICBleHBlZGl0aW9uLmF0dHIoJ3N0eWxlJywgc3R5bGVzKS5jc3MoJ3Bvc2l0aW9uJywgJycpLmNzcygndG9wJywgJycpLnJlbW92ZUNsYXNzKCdmaXhlZCcpO1xuICAgICAgICB9XG4gICAgICB9KTtcbiAgICB9LFxuXG4gICAgdXBkYXRlX2Fycml2YWxzIDogZnVuY3Rpb24gKCkge1xuICAgICAgdmFyIHNlbGYgPSB0aGlzLFxuICAgICAgICAgIHdpbmRvd190b3Bfb2Zmc2V0ID0gJCh3aW5kb3cpLnNjcm9sbFRvcCgpO1xuXG4gICAgICAkKCdbJyArIHRoaXMuYXR0cl9uYW1lKCkgKyAnXScsIHNlbGYuc2NvcGUpLmVhY2goZnVuY3Rpb24gKCkge1xuICAgICAgICB2YXIgZXhwZWRpdGlvbiA9ICQodGhpcyksXG4gICAgICAgICAgICBzZXR0aW5ncyA9IGV4cGVkaXRpb24uZGF0YShzZWxmLmF0dHJfbmFtZSh0cnVlKSArICctaW5pdCcpLFxuICAgICAgICAgICAgb2Zmc2V0cyA9IHNlbGYub2Zmc2V0cyhleHBlZGl0aW9uLCB3aW5kb3dfdG9wX29mZnNldCksXG4gICAgICAgICAgICBhcnJpdmFscyA9IGV4cGVkaXRpb24uZmluZCgnWycgKyBzZWxmLmFkZF9uYW1lc3BhY2UoJ2RhdGEtbWFnZWxsYW4tYXJyaXZhbCcpICsgJ10nKSxcbiAgICAgICAgICAgIGFjdGl2ZV9pdGVtID0gZmFsc2U7XG4gICAgICAgIG9mZnNldHMuZWFjaChmdW5jdGlvbiAoaWR4LCBpdGVtKSB7XG4gICAgICAgICAgaWYgKGl0ZW0udmlld3BvcnRfb2Zmc2V0ID49IGl0ZW0udG9wX29mZnNldCkge1xuICAgICAgICAgICAgdmFyIGFycml2YWxzID0gZXhwZWRpdGlvbi5maW5kKCdbJyArIHNlbGYuYWRkX25hbWVzcGFjZSgnZGF0YS1tYWdlbGxhbi1hcnJpdmFsJykgKyAnXScpO1xuICAgICAgICAgICAgYXJyaXZhbHMubm90KGl0ZW0uYXJyaXZhbCkucmVtb3ZlQ2xhc3Moc2V0dGluZ3MuYWN0aXZlX2NsYXNzKTtcbiAgICAgICAgICAgIGl0ZW0uYXJyaXZhbC5hZGRDbGFzcyhzZXR0aW5ncy5hY3RpdmVfY2xhc3MpO1xuICAgICAgICAgICAgYWN0aXZlX2l0ZW0gPSB0cnVlO1xuICAgICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgICAgfVxuICAgICAgICB9KTtcblxuICAgICAgICBpZiAoIWFjdGl2ZV9pdGVtKSB7XG4gICAgICAgICAgYXJyaXZhbHMucmVtb3ZlQ2xhc3Moc2V0dGluZ3MuYWN0aXZlX2NsYXNzKTtcbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgfSxcblxuICAgIG9mZnNldHMgOiBmdW5jdGlvbiAoZXhwZWRpdGlvbiwgd2luZG93X29mZnNldCkge1xuICAgICAgdmFyIHNlbGYgPSB0aGlzLFxuICAgICAgICAgIHNldHRpbmdzID0gZXhwZWRpdGlvbi5kYXRhKHNlbGYuYXR0cl9uYW1lKHRydWUpICsgJy1pbml0JyksXG4gICAgICAgICAgdmlld3BvcnRfb2Zmc2V0ID0gd2luZG93X29mZnNldDtcblxuICAgICAgcmV0dXJuIGV4cGVkaXRpb24uZmluZCgnWycgKyBzZWxmLmFkZF9uYW1lc3BhY2UoJ2RhdGEtbWFnZWxsYW4tYXJyaXZhbCcpICsgJ10nKS5tYXAoZnVuY3Rpb24gKGlkeCwgZWwpIHtcbiAgICAgICAgdmFyIG5hbWUgPSAkKHRoaXMpLmRhdGEoc2VsZi5kYXRhX2F0dHIoJ21hZ2VsbGFuLWFycml2YWwnKSksXG4gICAgICAgICAgICBkZXN0ID0gJCgnWycgKyBzZWxmLmFkZF9uYW1lc3BhY2UoJ2RhdGEtbWFnZWxsYW4tZGVzdGluYXRpb24nKSArICc9JyArIG5hbWUgKyAnXScpO1xuICAgICAgICBpZiAoZGVzdC5sZW5ndGggPiAwKSB7XG4gICAgICAgICAgdmFyIHRvcF9vZmZzZXQgPSBkZXN0Lm9mZnNldCgpLnRvcCAtIHNldHRpbmdzLmRlc3RpbmF0aW9uX3RocmVzaG9sZDtcbiAgICAgICAgICBpZiAoc2V0dGluZ3Mub2Zmc2V0X2J5X2hlaWdodCkge1xuICAgICAgICAgICAgdG9wX29mZnNldCA9IHRvcF9vZmZzZXQgLSBleHBlZGl0aW9uLm91dGVySGVpZ2h0KCk7XG4gICAgICAgICAgfVxuICAgICAgICAgIHRvcF9vZmZzZXQgPSBNYXRoLmZsb29yKHRvcF9vZmZzZXQpO1xuICAgICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICBkZXN0aW5hdGlvbiA6IGRlc3QsXG4gICAgICAgICAgICBhcnJpdmFsIDogJCh0aGlzKSxcbiAgICAgICAgICAgIHRvcF9vZmZzZXQgOiB0b3Bfb2Zmc2V0LFxuICAgICAgICAgICAgdmlld3BvcnRfb2Zmc2V0IDogdmlld3BvcnRfb2Zmc2V0XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9KS5zb3J0KGZ1bmN0aW9uIChhLCBiKSB7XG4gICAgICAgIGlmIChhLnRvcF9vZmZzZXQgPCBiLnRvcF9vZmZzZXQpIHtcbiAgICAgICAgICByZXR1cm4gLTE7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKGEudG9wX29mZnNldCA+IGIudG9wX29mZnNldCkge1xuICAgICAgICAgIHJldHVybiAxO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiAwO1xuICAgICAgfSk7XG4gICAgfSxcblxuICAgIGRhdGFfYXR0ciA6IGZ1bmN0aW9uIChzdHIpIHtcbiAgICAgIGlmICh0aGlzLm5hbWVzcGFjZS5sZW5ndGggPiAwKSB7XG4gICAgICAgIHJldHVybiB0aGlzLm5hbWVzcGFjZSArICctJyArIHN0cjtcbiAgICAgIH1cblxuICAgICAgcmV0dXJuIHN0cjtcbiAgICB9LFxuXG4gICAgb2ZmIDogZnVuY3Rpb24gKCkge1xuICAgICAgdGhpcy5TKHRoaXMuc2NvcGUpLm9mZignLm1hZ2VsbGFuJyk7XG4gICAgICB0aGlzLlMod2luZG93KS5vZmYoJy5tYWdlbGxhbicpO1xuICAgIH0sXG5cbiAgICBmaWx0ZXJQYXRobmFtZSA6IGZ1bmN0aW9uIChwYXRobmFtZSkge1xuICAgICAgcGF0aG5hbWUgPSBwYXRobmFtZSB8fCAnJztcbiAgICAgIHJldHVybiBwYXRobmFtZVxuICAgICAgICAgIC5yZXBsYWNlKC9eXFwvLywnJylcbiAgICAgICAgICAucmVwbGFjZSgvKD86aW5kZXh8ZGVmYXVsdCkuW2EtekEtWl17Myw0fSQvLCcnKVxuICAgICAgICAgIC5yZXBsYWNlKC9cXC8kLywnJyk7XG4gICAgfSxcblxuICAgIHJlZmxvdyA6IGZ1bmN0aW9uICgpIHtcbiAgICAgIHZhciBzZWxmID0gdGhpcztcbiAgICAgIC8vIHJlbW92ZSBwbGFjZWhvbGRlciBleHBlZGl0aW9ucyB1c2VkIGZvciBoZWlnaHQgY2FsY3VsYXRpb24gcHVycG9zZXNcbiAgICAgICQoJ1snICsgc2VsZi5hZGRfbmFtZXNwYWNlKCdkYXRhLW1hZ2VsbGFuLWV4cGVkaXRpb24tY2xvbmUnKSArICddJywgc2VsZi5zY29wZSkucmVtb3ZlKCk7XG4gICAgfVxuICB9O1xufShqUXVlcnksIHdpbmRvdywgd2luZG93LmRvY3VtZW50KSk7XG5cbjsoZnVuY3Rpb24gKCQsIHdpbmRvdywgZG9jdW1lbnQsIHVuZGVmaW5lZCkge1xuICAndXNlIHN0cmljdCc7XG5cbiAgRm91bmRhdGlvbi5saWJzLm9mZmNhbnZhcyA9IHtcbiAgICBuYW1lIDogJ29mZmNhbnZhcycsXG5cbiAgICB2ZXJzaW9uIDogJzUuNS4yJyxcblxuICAgIHNldHRpbmdzIDoge1xuICAgICAgb3Blbl9tZXRob2QgOiAnbW92ZScsXG4gICAgICBjbG9zZV9vbl9jbGljayA6IGZhbHNlXG4gICAgfSxcblxuICAgIGluaXQgOiBmdW5jdGlvbiAoc2NvcGUsIG1ldGhvZCwgb3B0aW9ucykge1xuICAgICAgdGhpcy5iaW5kaW5ncyhtZXRob2QsIG9wdGlvbnMpO1xuICAgIH0sXG5cbiAgICBldmVudHMgOiBmdW5jdGlvbiAoKSB7XG4gICAgICB2YXIgc2VsZiA9IHRoaXMsXG4gICAgICAgICAgUyA9IHNlbGYuUyxcbiAgICAgICAgICBtb3ZlX2NsYXNzID0gJycsXG4gICAgICAgICAgcmlnaHRfcG9zdGZpeCA9ICcnLFxuICAgICAgICAgIGxlZnRfcG9zdGZpeCA9ICcnO1xuXG4gICAgICBpZiAodGhpcy5zZXR0aW5ncy5vcGVuX21ldGhvZCA9PT0gJ21vdmUnKSB7XG4gICAgICAgIG1vdmVfY2xhc3MgPSAnbW92ZS0nO1xuICAgICAgICByaWdodF9wb3N0Zml4ID0gJ3JpZ2h0JztcbiAgICAgICAgbGVmdF9wb3N0Zml4ID0gJ2xlZnQnO1xuICAgICAgfSBlbHNlIGlmICh0aGlzLnNldHRpbmdzLm9wZW5fbWV0aG9kID09PSAnb3ZlcmxhcF9zaW5nbGUnKSB7XG4gICAgICAgIG1vdmVfY2xhc3MgPSAnb2ZmY2FudmFzLW92ZXJsYXAtJztcbiAgICAgICAgcmlnaHRfcG9zdGZpeCA9ICdyaWdodCc7XG4gICAgICAgIGxlZnRfcG9zdGZpeCA9ICdsZWZ0JztcbiAgICAgIH0gZWxzZSBpZiAodGhpcy5zZXR0aW5ncy5vcGVuX21ldGhvZCA9PT0gJ292ZXJsYXAnKSB7XG4gICAgICAgIG1vdmVfY2xhc3MgPSAnb2ZmY2FudmFzLW92ZXJsYXAnO1xuICAgICAgfVxuXG4gICAgICBTKHRoaXMuc2NvcGUpLm9mZignLm9mZmNhbnZhcycpXG4gICAgICAgIC5vbignY2xpY2suZm5kdG4ub2ZmY2FudmFzJywgJy5sZWZ0LW9mZi1jYW52YXMtdG9nZ2xlJywgZnVuY3Rpb24gKGUpIHtcbiAgICAgICAgICBzZWxmLmNsaWNrX3RvZ2dsZV9jbGFzcyhlLCBtb3ZlX2NsYXNzICsgcmlnaHRfcG9zdGZpeCk7XG4gICAgICAgICAgaWYgKHNlbGYuc2V0dGluZ3Mub3Blbl9tZXRob2QgIT09ICdvdmVybGFwJykge1xuICAgICAgICAgICAgUygnLmxlZnQtc3VibWVudScpLnJlbW92ZUNsYXNzKG1vdmVfY2xhc3MgKyByaWdodF9wb3N0Zml4KTtcbiAgICAgICAgICB9XG4gICAgICAgICAgJCgnLmxlZnQtb2ZmLWNhbnZhcy10b2dnbGUnKS5hdHRyKCdhcmlhLWV4cGFuZGVkJywgJ3RydWUnKTtcbiAgICAgICAgfSlcbiAgICAgICAgLm9uKCdjbGljay5mbmR0bi5vZmZjYW52YXMnLCAnLmxlZnQtb2ZmLWNhbnZhcy1tZW51IGEnLCBmdW5jdGlvbiAoZSkge1xuICAgICAgICAgIHZhciBzZXR0aW5ncyA9IHNlbGYuZ2V0X3NldHRpbmdzKGUpO1xuICAgICAgICAgIHZhciBwYXJlbnQgPSBTKHRoaXMpLnBhcmVudCgpO1xuXG4gICAgICAgICAgaWYgKHNldHRpbmdzLmNsb3NlX29uX2NsaWNrICYmICFwYXJlbnQuaGFzQ2xhc3MoJ2hhcy1zdWJtZW51JykgJiYgIXBhcmVudC5oYXNDbGFzcygnYmFjaycpKSB7XG4gICAgICAgICAgICBzZWxmLmhpZGUuY2FsbChzZWxmLCBtb3ZlX2NsYXNzICsgcmlnaHRfcG9zdGZpeCwgc2VsZi5nZXRfd3JhcHBlcihlKSk7XG4gICAgICAgICAgICBwYXJlbnQucGFyZW50KCkucmVtb3ZlQ2xhc3MobW92ZV9jbGFzcyArIHJpZ2h0X3Bvc3RmaXgpO1xuICAgICAgICAgIH0gZWxzZSBpZiAoUyh0aGlzKS5wYXJlbnQoKS5oYXNDbGFzcygnaGFzLXN1Ym1lbnUnKSkge1xuICAgICAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgICAgICAgUyh0aGlzKS5zaWJsaW5ncygnLmxlZnQtc3VibWVudScpLnRvZ2dsZUNsYXNzKG1vdmVfY2xhc3MgKyByaWdodF9wb3N0Zml4KTtcbiAgICAgICAgICB9IGVsc2UgaWYgKHBhcmVudC5oYXNDbGFzcygnYmFjaycpKSB7XG4gICAgICAgICAgICBlLnByZXZlbnREZWZhdWx0KCk7XG4gICAgICAgICAgICBwYXJlbnQucGFyZW50KCkucmVtb3ZlQ2xhc3MobW92ZV9jbGFzcyArIHJpZ2h0X3Bvc3RmaXgpO1xuICAgICAgICAgIH1cbiAgICAgICAgICAkKCcubGVmdC1vZmYtY2FudmFzLXRvZ2dsZScpLmF0dHIoJ2FyaWEtZXhwYW5kZWQnLCAndHJ1ZScpO1xuICAgICAgICB9KVxuICAgICAgICAub24oJ2NsaWNrLmZuZHRuLm9mZmNhbnZhcycsICcucmlnaHQtb2ZmLWNhbnZhcy10b2dnbGUnLCBmdW5jdGlvbiAoZSkge1xuICAgICAgICAgIHNlbGYuY2xpY2tfdG9nZ2xlX2NsYXNzKGUsIG1vdmVfY2xhc3MgKyBsZWZ0X3Bvc3RmaXgpO1xuICAgICAgICAgIGlmIChzZWxmLnNldHRpbmdzLm9wZW5fbWV0aG9kICE9PSAnb3ZlcmxhcCcpIHtcbiAgICAgICAgICAgIFMoJy5yaWdodC1zdWJtZW51JykucmVtb3ZlQ2xhc3MobW92ZV9jbGFzcyArIGxlZnRfcG9zdGZpeCk7XG4gICAgICAgICAgfVxuICAgICAgICAgICQoJy5yaWdodC1vZmYtY2FudmFzLXRvZ2dsZScpLmF0dHIoJ2FyaWEtZXhwYW5kZWQnLCAndHJ1ZScpO1xuICAgICAgICB9KVxuICAgICAgICAub24oJ2NsaWNrLmZuZHRuLm9mZmNhbnZhcycsICcucmlnaHQtb2ZmLWNhbnZhcy1tZW51IGEnLCBmdW5jdGlvbiAoZSkge1xuICAgICAgICAgIHZhciBzZXR0aW5ncyA9IHNlbGYuZ2V0X3NldHRpbmdzKGUpO1xuICAgICAgICAgIHZhciBwYXJlbnQgPSBTKHRoaXMpLnBhcmVudCgpO1xuXG4gICAgICAgICAgaWYgKHNldHRpbmdzLmNsb3NlX29uX2NsaWNrICYmICFwYXJlbnQuaGFzQ2xhc3MoJ2hhcy1zdWJtZW51JykgJiYgIXBhcmVudC5oYXNDbGFzcygnYmFjaycpKSB7XG4gICAgICAgICAgICBzZWxmLmhpZGUuY2FsbChzZWxmLCBtb3ZlX2NsYXNzICsgbGVmdF9wb3N0Zml4LCBzZWxmLmdldF93cmFwcGVyKGUpKTtcbiAgICAgICAgICAgIHBhcmVudC5wYXJlbnQoKS5yZW1vdmVDbGFzcyhtb3ZlX2NsYXNzICsgbGVmdF9wb3N0Zml4KTtcbiAgICAgICAgICB9IGVsc2UgaWYgKFModGhpcykucGFyZW50KCkuaGFzQ2xhc3MoJ2hhcy1zdWJtZW51JykpIHtcbiAgICAgICAgICAgIGUucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgICAgIFModGhpcykuc2libGluZ3MoJy5yaWdodC1zdWJtZW51JykudG9nZ2xlQ2xhc3MobW92ZV9jbGFzcyArIGxlZnRfcG9zdGZpeCk7XG4gICAgICAgICAgfSBlbHNlIGlmIChwYXJlbnQuaGFzQ2xhc3MoJ2JhY2snKSkge1xuICAgICAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgICAgICAgcGFyZW50LnBhcmVudCgpLnJlbW92ZUNsYXNzKG1vdmVfY2xhc3MgKyBsZWZ0X3Bvc3RmaXgpO1xuICAgICAgICAgIH1cbiAgICAgICAgICAkKCcucmlnaHQtb2ZmLWNhbnZhcy10b2dnbGUnKS5hdHRyKCdhcmlhLWV4cGFuZGVkJywgJ3RydWUnKTtcbiAgICAgICAgfSlcbiAgICAgICAgLm9uKCdjbGljay5mbmR0bi5vZmZjYW52YXMnLCAnLmV4aXQtb2ZmLWNhbnZhcycsIGZ1bmN0aW9uIChlKSB7XG4gICAgICAgICAgc2VsZi5jbGlja19yZW1vdmVfY2xhc3MoZSwgbW92ZV9jbGFzcyArIGxlZnRfcG9zdGZpeCk7XG4gICAgICAgICAgUygnLnJpZ2h0LXN1Ym1lbnUnKS5yZW1vdmVDbGFzcyhtb3ZlX2NsYXNzICsgbGVmdF9wb3N0Zml4KTtcbiAgICAgICAgICBpZiAocmlnaHRfcG9zdGZpeCkge1xuICAgICAgICAgICAgc2VsZi5jbGlja19yZW1vdmVfY2xhc3MoZSwgbW92ZV9jbGFzcyArIHJpZ2h0X3Bvc3RmaXgpO1xuICAgICAgICAgICAgUygnLmxlZnQtc3VibWVudScpLnJlbW92ZUNsYXNzKG1vdmVfY2xhc3MgKyBsZWZ0X3Bvc3RmaXgpO1xuICAgICAgICAgIH1cbiAgICAgICAgICAkKCcucmlnaHQtb2ZmLWNhbnZhcy10b2dnbGUnKS5hdHRyKCdhcmlhLWV4cGFuZGVkJywgJ3RydWUnKTtcbiAgICAgICAgfSlcbiAgICAgICAgLm9uKCdjbGljay5mbmR0bi5vZmZjYW52YXMnLCAnLmV4aXQtb2ZmLWNhbnZhcycsIGZ1bmN0aW9uIChlKSB7XG4gICAgICAgICAgc2VsZi5jbGlja19yZW1vdmVfY2xhc3MoZSwgbW92ZV9jbGFzcyArIGxlZnRfcG9zdGZpeCk7XG4gICAgICAgICAgJCgnLmxlZnQtb2ZmLWNhbnZhcy10b2dnbGUnKS5hdHRyKCdhcmlhLWV4cGFuZGVkJywgJ2ZhbHNlJyk7XG4gICAgICAgICAgaWYgKHJpZ2h0X3Bvc3RmaXgpIHtcbiAgICAgICAgICAgIHNlbGYuY2xpY2tfcmVtb3ZlX2NsYXNzKGUsIG1vdmVfY2xhc3MgKyByaWdodF9wb3N0Zml4KTtcbiAgICAgICAgICAgICQoJy5yaWdodC1vZmYtY2FudmFzLXRvZ2dsZScpLmF0dHIoJ2FyaWEtZXhwYW5kZWQnLCAnZmFsc2UnKTtcbiAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgIH0sXG5cbiAgICB0b2dnbGUgOiBmdW5jdGlvbiAoY2xhc3NfbmFtZSwgJG9mZl9jYW52YXMpIHtcbiAgICAgICRvZmZfY2FudmFzID0gJG9mZl9jYW52YXMgfHwgdGhpcy5nZXRfd3JhcHBlcigpO1xuICAgICAgaWYgKCRvZmZfY2FudmFzLmlzKCcuJyArIGNsYXNzX25hbWUpKSB7XG4gICAgICAgIHRoaXMuaGlkZShjbGFzc19uYW1lLCAkb2ZmX2NhbnZhcyk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB0aGlzLnNob3coY2xhc3NfbmFtZSwgJG9mZl9jYW52YXMpO1xuICAgICAgfVxuICAgIH0sXG5cbiAgICBzaG93IDogZnVuY3Rpb24gKGNsYXNzX25hbWUsICRvZmZfY2FudmFzKSB7XG4gICAgICAkb2ZmX2NhbnZhcyA9ICRvZmZfY2FudmFzIHx8IHRoaXMuZ2V0X3dyYXBwZXIoKTtcbiAgICAgICRvZmZfY2FudmFzLnRyaWdnZXIoJ29wZW4uZm5kdG4ub2ZmY2FudmFzJyk7XG4gICAgICAkb2ZmX2NhbnZhcy5hZGRDbGFzcyhjbGFzc19uYW1lKTtcbiAgICB9LFxuXG4gICAgaGlkZSA6IGZ1bmN0aW9uIChjbGFzc19uYW1lLCAkb2ZmX2NhbnZhcykge1xuICAgICAgJG9mZl9jYW52YXMgPSAkb2ZmX2NhbnZhcyB8fCB0aGlzLmdldF93cmFwcGVyKCk7XG4gICAgICAkb2ZmX2NhbnZhcy50cmlnZ2VyKCdjbG9zZS5mbmR0bi5vZmZjYW52YXMnKTtcbiAgICAgICRvZmZfY2FudmFzLnJlbW92ZUNsYXNzKGNsYXNzX25hbWUpO1xuICAgIH0sXG5cbiAgICBjbGlja190b2dnbGVfY2xhc3MgOiBmdW5jdGlvbiAoZSwgY2xhc3NfbmFtZSkge1xuICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgdmFyICRvZmZfY2FudmFzID0gdGhpcy5nZXRfd3JhcHBlcihlKTtcbiAgICAgIHRoaXMudG9nZ2xlKGNsYXNzX25hbWUsICRvZmZfY2FudmFzKTtcbiAgICB9LFxuXG4gICAgY2xpY2tfcmVtb3ZlX2NsYXNzIDogZnVuY3Rpb24gKGUsIGNsYXNzX25hbWUpIHtcbiAgICAgIGUucHJldmVudERlZmF1bHQoKTtcbiAgICAgIHZhciAkb2ZmX2NhbnZhcyA9IHRoaXMuZ2V0X3dyYXBwZXIoZSk7XG4gICAgICB0aGlzLmhpZGUoY2xhc3NfbmFtZSwgJG9mZl9jYW52YXMpO1xuICAgIH0sXG5cbiAgICBnZXRfc2V0dGluZ3MgOiBmdW5jdGlvbiAoZSkge1xuICAgICAgdmFyIG9mZmNhbnZhcyAgPSB0aGlzLlMoZS50YXJnZXQpLmNsb3Nlc3QoJ1snICsgdGhpcy5hdHRyX25hbWUoKSArICddJyk7XG4gICAgICByZXR1cm4gb2ZmY2FudmFzLmRhdGEodGhpcy5hdHRyX25hbWUodHJ1ZSkgKyAnLWluaXQnKSB8fCB0aGlzLnNldHRpbmdzO1xuICAgIH0sXG5cbiAgICBnZXRfd3JhcHBlciA6IGZ1bmN0aW9uIChlKSB7XG4gICAgICB2YXIgJG9mZl9jYW52YXMgPSB0aGlzLlMoZSA/IGUudGFyZ2V0IDogdGhpcy5zY29wZSkuY2xvc2VzdCgnLm9mZi1jYW52YXMtd3JhcCcpO1xuXG4gICAgICBpZiAoJG9mZl9jYW52YXMubGVuZ3RoID09PSAwKSB7XG4gICAgICAgICRvZmZfY2FudmFzID0gdGhpcy5TKCcub2ZmLWNhbnZhcy13cmFwJyk7XG4gICAgICB9XG4gICAgICByZXR1cm4gJG9mZl9jYW52YXM7XG4gICAgfSxcblxuICAgIHJlZmxvdyA6IGZ1bmN0aW9uICgpIHt9XG4gIH07XG59KGpRdWVyeSwgd2luZG93LCB3aW5kb3cuZG9jdW1lbnQpKTtcblxuOyhmdW5jdGlvbiAoJCwgd2luZG93LCBkb2N1bWVudCwgdW5kZWZpbmVkKSB7XG4gICd1c2Ugc3RyaWN0JztcblxuICB2YXIgbm9vcCA9IGZ1bmN0aW9uICgpIHt9O1xuXG4gIHZhciBPcmJpdCA9IGZ1bmN0aW9uIChlbCwgc2V0dGluZ3MpIHtcbiAgICAvLyBEb24ndCByZWluaXRpYWxpemUgcGx1Z2luXG4gICAgaWYgKGVsLmhhc0NsYXNzKHNldHRpbmdzLnNsaWRlc19jb250YWluZXJfY2xhc3MpKSB7XG4gICAgICByZXR1cm4gdGhpcztcbiAgICB9XG5cbiAgICB2YXIgc2VsZiA9IHRoaXMsXG4gICAgICAgIGNvbnRhaW5lcixcbiAgICAgICAgc2xpZGVzX2NvbnRhaW5lciA9IGVsLFxuICAgICAgICBudW1iZXJfY29udGFpbmVyLFxuICAgICAgICBidWxsZXRzX2NvbnRhaW5lcixcbiAgICAgICAgdGltZXJfY29udGFpbmVyLFxuICAgICAgICBpZHggPSAwLFxuICAgICAgICBhbmltYXRlLFxuICAgICAgICB0aW1lcixcbiAgICAgICAgbG9ja2VkID0gZmFsc2UsXG4gICAgICAgIGFkanVzdF9oZWlnaHRfYWZ0ZXIgPSBmYWxzZTtcblxuICAgIHNlbGYuc2xpZGVzID0gZnVuY3Rpb24gKCkge1xuICAgICAgcmV0dXJuIHNsaWRlc19jb250YWluZXIuY2hpbGRyZW4oc2V0dGluZ3Muc2xpZGVfc2VsZWN0b3IpO1xuICAgIH07XG5cbiAgICBzZWxmLnNsaWRlcygpLmZpcnN0KCkuYWRkQ2xhc3Moc2V0dGluZ3MuYWN0aXZlX3NsaWRlX2NsYXNzKTtcblxuICAgIHNlbGYudXBkYXRlX3NsaWRlX251bWJlciA9IGZ1bmN0aW9uIChpbmRleCkge1xuICAgICAgaWYgKHNldHRpbmdzLnNsaWRlX251bWJlcikge1xuICAgICAgICBudW1iZXJfY29udGFpbmVyLmZpbmQoJ3NwYW46Zmlyc3QnKS50ZXh0KHBhcnNlSW50KGluZGV4KSArIDEpO1xuICAgICAgICBudW1iZXJfY29udGFpbmVyLmZpbmQoJ3NwYW46bGFzdCcpLnRleHQoc2VsZi5zbGlkZXMoKS5sZW5ndGgpO1xuICAgICAgfVxuICAgICAgaWYgKHNldHRpbmdzLmJ1bGxldHMpIHtcbiAgICAgICAgYnVsbGV0c19jb250YWluZXIuY2hpbGRyZW4oKS5yZW1vdmVDbGFzcyhzZXR0aW5ncy5idWxsZXRzX2FjdGl2ZV9jbGFzcyk7XG4gICAgICAgICQoYnVsbGV0c19jb250YWluZXIuY2hpbGRyZW4oKS5nZXQoaW5kZXgpKS5hZGRDbGFzcyhzZXR0aW5ncy5idWxsZXRzX2FjdGl2ZV9jbGFzcyk7XG4gICAgICB9XG4gICAgfTtcblxuICAgIHNlbGYudXBkYXRlX2FjdGl2ZV9saW5rID0gZnVuY3Rpb24gKGluZGV4KSB7XG4gICAgICB2YXIgbGluayA9ICQoJ1tkYXRhLW9yYml0LWxpbms9XCInICsgc2VsZi5zbGlkZXMoKS5lcShpbmRleCkuYXR0cignZGF0YS1vcmJpdC1zbGlkZScpICsgJ1wiXScpO1xuICAgICAgbGluay5zaWJsaW5ncygpLnJlbW92ZUNsYXNzKHNldHRpbmdzLmJ1bGxldHNfYWN0aXZlX2NsYXNzKTtcbiAgICAgIGxpbmsuYWRkQ2xhc3Moc2V0dGluZ3MuYnVsbGV0c19hY3RpdmVfY2xhc3MpO1xuICAgIH07XG5cbiAgICBzZWxmLmJ1aWxkX21hcmt1cCA9IGZ1bmN0aW9uICgpIHtcbiAgICAgIHNsaWRlc19jb250YWluZXIud3JhcCgnPGRpdiBjbGFzcz1cIicgKyBzZXR0aW5ncy5jb250YWluZXJfY2xhc3MgKyAnXCI+PC9kaXY+Jyk7XG4gICAgICBjb250YWluZXIgPSBzbGlkZXNfY29udGFpbmVyLnBhcmVudCgpO1xuICAgICAgc2xpZGVzX2NvbnRhaW5lci5hZGRDbGFzcyhzZXR0aW5ncy5zbGlkZXNfY29udGFpbmVyX2NsYXNzKTtcblxuICAgICAgaWYgKHNldHRpbmdzLnN0YWNrX29uX3NtYWxsKSB7XG4gICAgICAgIGNvbnRhaW5lci5hZGRDbGFzcyhzZXR0aW5ncy5zdGFja19vbl9zbWFsbF9jbGFzcyk7XG4gICAgICB9XG5cbiAgICAgIGlmIChzZXR0aW5ncy5uYXZpZ2F0aW9uX2Fycm93cykge1xuICAgICAgICBjb250YWluZXIuYXBwZW5kKCQoJzxhIGhyZWY9XCIjXCI+PHNwYW4+PC9zcGFuPjwvYT4nKS5hZGRDbGFzcyhzZXR0aW5ncy5wcmV2X2NsYXNzKSk7XG4gICAgICAgIGNvbnRhaW5lci5hcHBlbmQoJCgnPGEgaHJlZj1cIiNcIj48c3Bhbj48L3NwYW4+PC9hPicpLmFkZENsYXNzKHNldHRpbmdzLm5leHRfY2xhc3MpKTtcbiAgICAgIH1cblxuICAgICAgaWYgKHNldHRpbmdzLnRpbWVyKSB7XG4gICAgICAgIHRpbWVyX2NvbnRhaW5lciA9ICQoJzxkaXY+JykuYWRkQ2xhc3Moc2V0dGluZ3MudGltZXJfY29udGFpbmVyX2NsYXNzKTtcbiAgICAgICAgdGltZXJfY29udGFpbmVyLmFwcGVuZCgnPHNwYW4+Jyk7XG4gICAgICAgIHRpbWVyX2NvbnRhaW5lci5hcHBlbmQoJCgnPGRpdj4nKS5hZGRDbGFzcyhzZXR0aW5ncy50aW1lcl9wcm9ncmVzc19jbGFzcykpO1xuICAgICAgICB0aW1lcl9jb250YWluZXIuYWRkQ2xhc3Moc2V0dGluZ3MudGltZXJfcGF1c2VkX2NsYXNzKTtcbiAgICAgICAgY29udGFpbmVyLmFwcGVuZCh0aW1lcl9jb250YWluZXIpO1xuICAgICAgfVxuXG4gICAgICBpZiAoc2V0dGluZ3Muc2xpZGVfbnVtYmVyKSB7XG4gICAgICAgIG51bWJlcl9jb250YWluZXIgPSAkKCc8ZGl2PicpLmFkZENsYXNzKHNldHRpbmdzLnNsaWRlX251bWJlcl9jbGFzcyk7XG4gICAgICAgIG51bWJlcl9jb250YWluZXIuYXBwZW5kKCc8c3Bhbj48L3NwYW4+ICcgKyBzZXR0aW5ncy5zbGlkZV9udW1iZXJfdGV4dCArICcgPHNwYW4+PC9zcGFuPicpO1xuICAgICAgICBjb250YWluZXIuYXBwZW5kKG51bWJlcl9jb250YWluZXIpO1xuICAgICAgfVxuXG4gICAgICBpZiAoc2V0dGluZ3MuYnVsbGV0cykge1xuICAgICAgICBidWxsZXRzX2NvbnRhaW5lciA9ICQoJzxvbD4nKS5hZGRDbGFzcyhzZXR0aW5ncy5idWxsZXRzX2NvbnRhaW5lcl9jbGFzcyk7XG4gICAgICAgIGNvbnRhaW5lci5hcHBlbmQoYnVsbGV0c19jb250YWluZXIpO1xuICAgICAgICBidWxsZXRzX2NvbnRhaW5lci53cmFwKCc8ZGl2IGNsYXNzPVwib3JiaXQtYnVsbGV0cy1jb250YWluZXJcIj48L2Rpdj4nKTtcbiAgICAgICAgc2VsZi5zbGlkZXMoKS5lYWNoKGZ1bmN0aW9uIChpZHgsIGVsKSB7XG4gICAgICAgICAgdmFyIGJ1bGxldCA9ICQoJzxsaT4nKS5hdHRyKCdkYXRhLW9yYml0LXNsaWRlJywgaWR4KS5vbignY2xpY2snLCBzZWxmLmxpbmtfYnVsbGV0KTs7XG4gICAgICAgICAgYnVsbGV0c19jb250YWluZXIuYXBwZW5kKGJ1bGxldCk7XG4gICAgICAgIH0pO1xuICAgICAgfVxuXG4gICAgfTtcblxuICAgIHNlbGYuX2dvdG8gPSBmdW5jdGlvbiAobmV4dF9pZHgsIHN0YXJ0X3RpbWVyKSB7XG4gICAgICAvLyBpZiAobG9ja2VkKSB7cmV0dXJuIGZhbHNlO31cbiAgICAgIGlmIChuZXh0X2lkeCA9PT0gaWR4KSB7cmV0dXJuIGZhbHNlO31cbiAgICAgIGlmICh0eXBlb2YgdGltZXIgPT09ICdvYmplY3QnKSB7dGltZXIucmVzdGFydCgpO31cbiAgICAgIHZhciBzbGlkZXMgPSBzZWxmLnNsaWRlcygpO1xuXG4gICAgICB2YXIgZGlyID0gJ25leHQnO1xuICAgICAgbG9ja2VkID0gdHJ1ZTtcbiAgICAgIGlmIChuZXh0X2lkeCA8IGlkeCkge2RpciA9ICdwcmV2Jzt9XG4gICAgICBpZiAobmV4dF9pZHggPj0gc2xpZGVzLmxlbmd0aCkge1xuICAgICAgICBpZiAoIXNldHRpbmdzLmNpcmN1bGFyKSB7XG4gICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICB9XG4gICAgICAgIG5leHRfaWR4ID0gMDtcbiAgICAgIH0gZWxzZSBpZiAobmV4dF9pZHggPCAwKSB7XG4gICAgICAgIGlmICghc2V0dGluZ3MuY2lyY3VsYXIpIHtcbiAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgIH1cbiAgICAgICAgbmV4dF9pZHggPSBzbGlkZXMubGVuZ3RoIC0gMTtcbiAgICAgIH1cblxuICAgICAgdmFyIGN1cnJlbnQgPSAkKHNsaWRlcy5nZXQoaWR4KSk7XG4gICAgICB2YXIgbmV4dCA9ICQoc2xpZGVzLmdldChuZXh0X2lkeCkpO1xuXG4gICAgICBjdXJyZW50LmNzcygnekluZGV4JywgMik7XG4gICAgICBjdXJyZW50LnJlbW92ZUNsYXNzKHNldHRpbmdzLmFjdGl2ZV9zbGlkZV9jbGFzcyk7XG4gICAgICBuZXh0LmNzcygnekluZGV4JywgNCkuYWRkQ2xhc3Moc2V0dGluZ3MuYWN0aXZlX3NsaWRlX2NsYXNzKTtcblxuICAgICAgc2xpZGVzX2NvbnRhaW5lci50cmlnZ2VyKCdiZWZvcmUtc2xpZGUtY2hhbmdlLmZuZHRuLm9yYml0Jyk7XG4gICAgICBzZXR0aW5ncy5iZWZvcmVfc2xpZGVfY2hhbmdlKCk7XG4gICAgICBzZWxmLnVwZGF0ZV9hY3RpdmVfbGluayhuZXh0X2lkeCk7XG5cbiAgICAgIHZhciBjYWxsYmFjayA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgdmFyIHVubG9jayA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICBpZHggPSBuZXh0X2lkeDtcbiAgICAgICAgICBsb2NrZWQgPSBmYWxzZTtcbiAgICAgICAgICBpZiAoc3RhcnRfdGltZXIgPT09IHRydWUpIHt0aW1lciA9IHNlbGYuY3JlYXRlX3RpbWVyKCk7IHRpbWVyLnN0YXJ0KCk7fVxuICAgICAgICAgIHNlbGYudXBkYXRlX3NsaWRlX251bWJlcihpZHgpO1xuICAgICAgICAgIHNsaWRlc19jb250YWluZXIudHJpZ2dlcignYWZ0ZXItc2xpZGUtY2hhbmdlLmZuZHRuLm9yYml0JywgW3tzbGlkZV9udW1iZXIgOiBpZHgsIHRvdGFsX3NsaWRlcyA6IHNsaWRlcy5sZW5ndGh9XSk7XG4gICAgICAgICAgc2V0dGluZ3MuYWZ0ZXJfc2xpZGVfY2hhbmdlKGlkeCwgc2xpZGVzLmxlbmd0aCk7XG4gICAgICAgIH07XG4gICAgICAgIGlmIChzbGlkZXNfY29udGFpbmVyLm91dGVySGVpZ2h0KCkgIT0gbmV4dC5vdXRlckhlaWdodCgpICYmIHNldHRpbmdzLnZhcmlhYmxlX2hlaWdodCkge1xuICAgICAgICAgIHNsaWRlc19jb250YWluZXIuYW5pbWF0ZSh7J2hlaWdodCc6IG5leHQub3V0ZXJIZWlnaHQoKX0sIDI1MCwgJ2xpbmVhcicsIHVubG9jayk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgdW5sb2NrKCk7XG4gICAgICAgIH1cbiAgICAgIH07XG5cbiAgICAgIGlmIChzbGlkZXMubGVuZ3RoID09PSAxKSB7Y2FsbGJhY2soKTsgcmV0dXJuIGZhbHNlO31cblxuICAgICAgdmFyIHN0YXJ0X2FuaW1hdGlvbiA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgaWYgKGRpciA9PT0gJ25leHQnKSB7YW5pbWF0ZS5uZXh0KGN1cnJlbnQsIG5leHQsIGNhbGxiYWNrKTt9XG4gICAgICAgIGlmIChkaXIgPT09ICdwcmV2Jykge2FuaW1hdGUucHJldihjdXJyZW50LCBuZXh0LCBjYWxsYmFjayk7fVxuICAgICAgfTtcblxuICAgICAgaWYgKG5leHQub3V0ZXJIZWlnaHQoKSA+IHNsaWRlc19jb250YWluZXIub3V0ZXJIZWlnaHQoKSAmJiBzZXR0aW5ncy52YXJpYWJsZV9oZWlnaHQpIHtcbiAgICAgICAgc2xpZGVzX2NvbnRhaW5lci5hbmltYXRlKHsnaGVpZ2h0JzogbmV4dC5vdXRlckhlaWdodCgpfSwgMjUwLCAnbGluZWFyJywgc3RhcnRfYW5pbWF0aW9uKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHN0YXJ0X2FuaW1hdGlvbigpO1xuICAgICAgfVxuICAgIH07XG5cbiAgICBzZWxmLm5leHQgPSBmdW5jdGlvbiAoZSkge1xuICAgICAgZS5zdG9wSW1tZWRpYXRlUHJvcGFnYXRpb24oKTtcbiAgICAgIGUucHJldmVudERlZmF1bHQoKTtcbiAgICAgIHNlbGYuX2dvdG8oaWR4ICsgMSk7XG4gICAgfTtcblxuICAgIHNlbGYucHJldiA9IGZ1bmN0aW9uIChlKSB7XG4gICAgICBlLnN0b3BJbW1lZGlhdGVQcm9wYWdhdGlvbigpO1xuICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgc2VsZi5fZ290byhpZHggLSAxKTtcbiAgICB9O1xuXG4gICAgc2VsZi5saW5rX2N1c3RvbSA9IGZ1bmN0aW9uIChlKSB7XG4gICAgICBlLnByZXZlbnREZWZhdWx0KCk7XG4gICAgICB2YXIgbGluayA9ICQodGhpcykuYXR0cignZGF0YS1vcmJpdC1saW5rJyk7XG4gICAgICBpZiAoKHR5cGVvZiBsaW5rID09PSAnc3RyaW5nJykgJiYgKGxpbmsgPSAkLnRyaW0obGluaykpICE9ICcnKSB7XG4gICAgICAgIHZhciBzbGlkZSA9IGNvbnRhaW5lci5maW5kKCdbZGF0YS1vcmJpdC1zbGlkZT0nICsgbGluayArICddJyk7XG4gICAgICAgIGlmIChzbGlkZS5pbmRleCgpICE9IC0xKSB7c2VsZi5fZ290byhzbGlkZS5pbmRleCgpKTt9XG4gICAgICB9XG4gICAgfTtcblxuICAgIHNlbGYubGlua19idWxsZXQgPSBmdW5jdGlvbiAoZSkge1xuICAgICAgdmFyIGluZGV4ID0gJCh0aGlzKS5hdHRyKCdkYXRhLW9yYml0LXNsaWRlJyk7XG4gICAgICBpZiAoKHR5cGVvZiBpbmRleCA9PT0gJ3N0cmluZycpICYmIChpbmRleCA9ICQudHJpbShpbmRleCkpICE9ICcnKSB7XG4gICAgICAgIGlmIChpc05hTihwYXJzZUludChpbmRleCkpKSB7XG4gICAgICAgICAgdmFyIHNsaWRlID0gY29udGFpbmVyLmZpbmQoJ1tkYXRhLW9yYml0LXNsaWRlPScgKyBpbmRleCArICddJyk7XG4gICAgICAgICAgaWYgKHNsaWRlLmluZGV4KCkgIT0gLTEpIHtzZWxmLl9nb3RvKHNsaWRlLmluZGV4KCkgKyAxKTt9XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgc2VsZi5fZ290byhwYXJzZUludChpbmRleCkpO1xuICAgICAgICB9XG4gICAgICB9XG5cbiAgICB9XG5cbiAgICBzZWxmLnRpbWVyX2NhbGxiYWNrID0gZnVuY3Rpb24gKCkge1xuICAgICAgc2VsZi5fZ290byhpZHggKyAxLCB0cnVlKTtcbiAgICB9XG5cbiAgICBzZWxmLmNvbXB1dGVfZGltZW5zaW9ucyA9IGZ1bmN0aW9uICgpIHtcbiAgICAgIHZhciBjdXJyZW50ID0gJChzZWxmLnNsaWRlcygpLmdldChpZHgpKTtcbiAgICAgIHZhciBoID0gY3VycmVudC5vdXRlckhlaWdodCgpO1xuICAgICAgaWYgKCFzZXR0aW5ncy52YXJpYWJsZV9oZWlnaHQpIHtcbiAgICAgICAgc2VsZi5zbGlkZXMoKS5lYWNoKGZ1bmN0aW9uKCl7XG4gICAgICAgICAgaWYgKCQodGhpcykub3V0ZXJIZWlnaHQoKSA+IGgpIHsgaCA9ICQodGhpcykub3V0ZXJIZWlnaHQoKTsgfVxuICAgICAgICB9KTtcbiAgICAgIH1cbiAgICAgIHNsaWRlc19jb250YWluZXIuaGVpZ2h0KGgpO1xuICAgIH07XG5cbiAgICBzZWxmLmNyZWF0ZV90aW1lciA9IGZ1bmN0aW9uICgpIHtcbiAgICAgIHZhciB0ID0gbmV3IFRpbWVyKFxuICAgICAgICBjb250YWluZXIuZmluZCgnLicgKyBzZXR0aW5ncy50aW1lcl9jb250YWluZXJfY2xhc3MpLFxuICAgICAgICBzZXR0aW5ncyxcbiAgICAgICAgc2VsZi50aW1lcl9jYWxsYmFja1xuICAgICAgKTtcbiAgICAgIHJldHVybiB0O1xuICAgIH07XG5cbiAgICBzZWxmLnN0b3BfdGltZXIgPSBmdW5jdGlvbiAoKSB7XG4gICAgICBpZiAodHlwZW9mIHRpbWVyID09PSAnb2JqZWN0Jykge1xuICAgICAgICB0aW1lci5zdG9wKCk7XG4gICAgICB9XG4gICAgfTtcblxuICAgIHNlbGYudG9nZ2xlX3RpbWVyID0gZnVuY3Rpb24gKCkge1xuICAgICAgdmFyIHQgPSBjb250YWluZXIuZmluZCgnLicgKyBzZXR0aW5ncy50aW1lcl9jb250YWluZXJfY2xhc3MpO1xuICAgICAgaWYgKHQuaGFzQ2xhc3Moc2V0dGluZ3MudGltZXJfcGF1c2VkX2NsYXNzKSkge1xuICAgICAgICBpZiAodHlwZW9mIHRpbWVyID09PSAndW5kZWZpbmVkJykge3RpbWVyID0gc2VsZi5jcmVhdGVfdGltZXIoKTt9XG4gICAgICAgIHRpbWVyLnN0YXJ0KCk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBpZiAodHlwZW9mIHRpbWVyID09PSAnb2JqZWN0Jykge3RpbWVyLnN0b3AoKTt9XG4gICAgICB9XG4gICAgfTtcblxuICAgIHNlbGYuaW5pdCA9IGZ1bmN0aW9uICgpIHtcbiAgICAgIHNlbGYuYnVpbGRfbWFya3VwKCk7XG4gICAgICBpZiAoc2V0dGluZ3MudGltZXIpIHtcbiAgICAgICAgdGltZXIgPSBzZWxmLmNyZWF0ZV90aW1lcigpO1xuICAgICAgICBGb3VuZGF0aW9uLnV0aWxzLmltYWdlX2xvYWRlZCh0aGlzLnNsaWRlcygpLmNoaWxkcmVuKCdpbWcnKSwgdGltZXIuc3RhcnQpO1xuICAgICAgfVxuICAgICAgYW5pbWF0ZSA9IG5ldyBGYWRlQW5pbWF0aW9uKHNldHRpbmdzLCBzbGlkZXNfY29udGFpbmVyKTtcbiAgICAgIGlmIChzZXR0aW5ncy5hbmltYXRpb24gPT09ICdzbGlkZScpIHtcbiAgICAgICAgYW5pbWF0ZSA9IG5ldyBTbGlkZUFuaW1hdGlvbihzZXR0aW5ncywgc2xpZGVzX2NvbnRhaW5lcik7XG4gICAgICB9XG5cbiAgICAgIGNvbnRhaW5lci5vbignY2xpY2snLCAnLicgKyBzZXR0aW5ncy5uZXh0X2NsYXNzLCBzZWxmLm5leHQpO1xuICAgICAgY29udGFpbmVyLm9uKCdjbGljaycsICcuJyArIHNldHRpbmdzLnByZXZfY2xhc3MsIHNlbGYucHJldik7XG5cbiAgICAgIGlmIChzZXR0aW5ncy5uZXh0X29uX2NsaWNrKSB7XG4gICAgICAgIGNvbnRhaW5lci5vbignY2xpY2snLCAnLicgKyBzZXR0aW5ncy5zbGlkZXNfY29udGFpbmVyX2NsYXNzICsgJyBbZGF0YS1vcmJpdC1zbGlkZV0nLCBzZWxmLmxpbmtfYnVsbGV0KTtcbiAgICAgIH1cblxuICAgICAgY29udGFpbmVyLm9uKCdjbGljaycsIHNlbGYudG9nZ2xlX3RpbWVyKTtcbiAgICAgIGlmIChzZXR0aW5ncy5zd2lwZSkge1xuICAgICAgICBjb250YWluZXIub24oJ3RvdWNoc3RhcnQuZm5kdG4ub3JiaXQnLCBmdW5jdGlvbiAoZSkge1xuICAgICAgICAgIGlmICghZS50b3VjaGVzKSB7ZSA9IGUub3JpZ2luYWxFdmVudDt9XG4gICAgICAgICAgdmFyIGRhdGEgPSB7XG4gICAgICAgICAgICBzdGFydF9wYWdlX3ggOiBlLnRvdWNoZXNbMF0ucGFnZVgsXG4gICAgICAgICAgICBzdGFydF9wYWdlX3kgOiBlLnRvdWNoZXNbMF0ucGFnZVksXG4gICAgICAgICAgICBzdGFydF90aW1lIDogKG5ldyBEYXRlKCkpLmdldFRpbWUoKSxcbiAgICAgICAgICAgIGRlbHRhX3ggOiAwLFxuICAgICAgICAgICAgaXNfc2Nyb2xsaW5nIDogdW5kZWZpbmVkXG4gICAgICAgICAgfTtcbiAgICAgICAgICBjb250YWluZXIuZGF0YSgnc3dpcGUtdHJhbnNpdGlvbicsIGRhdGEpO1xuICAgICAgICAgIGUuc3RvcFByb3BhZ2F0aW9uKCk7XG4gICAgICAgIH0pXG4gICAgICAgIC5vbigndG91Y2htb3ZlLmZuZHRuLm9yYml0JywgZnVuY3Rpb24gKGUpIHtcbiAgICAgICAgICBpZiAoIWUudG91Y2hlcykge1xuICAgICAgICAgICAgZSA9IGUub3JpZ2luYWxFdmVudDtcbiAgICAgICAgICB9XG4gICAgICAgICAgLy8gSWdub3JlIHBpbmNoL3pvb20gZXZlbnRzXG4gICAgICAgICAgaWYgKGUudG91Y2hlcy5sZW5ndGggPiAxIHx8IGUuc2NhbGUgJiYgZS5zY2FsZSAhPT0gMSkge1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgIH1cblxuICAgICAgICAgIHZhciBkYXRhID0gY29udGFpbmVyLmRhdGEoJ3N3aXBlLXRyYW5zaXRpb24nKTtcbiAgICAgICAgICBpZiAodHlwZW9mIGRhdGEgPT09ICd1bmRlZmluZWQnKSB7ZGF0YSA9IHt9O31cblxuICAgICAgICAgIGRhdGEuZGVsdGFfeCA9IGUudG91Y2hlc1swXS5wYWdlWCAtIGRhdGEuc3RhcnRfcGFnZV94O1xuXG4gICAgICAgICAgaWYgKCB0eXBlb2YgZGF0YS5pc19zY3JvbGxpbmcgPT09ICd1bmRlZmluZWQnKSB7XG4gICAgICAgICAgICBkYXRhLmlzX3Njcm9sbGluZyA9ICEhKCBkYXRhLmlzX3Njcm9sbGluZyB8fCBNYXRoLmFicyhkYXRhLmRlbHRhX3gpIDwgTWF0aC5hYnMoZS50b3VjaGVzWzBdLnBhZ2VZIC0gZGF0YS5zdGFydF9wYWdlX3kpICk7XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgaWYgKCFkYXRhLmlzX3Njcm9sbGluZyAmJiAhZGF0YS5hY3RpdmUpIHtcbiAgICAgICAgICAgIGUucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgICAgIHZhciBkaXJlY3Rpb24gPSAoZGF0YS5kZWx0YV94IDwgMCkgPyAoaWR4ICsgMSkgOiAoaWR4IC0gMSk7XG4gICAgICAgICAgICBkYXRhLmFjdGl2ZSA9IHRydWU7XG4gICAgICAgICAgICBzZWxmLl9nb3RvKGRpcmVjdGlvbik7XG4gICAgICAgICAgfVxuICAgICAgICB9KVxuICAgICAgICAub24oJ3RvdWNoZW5kLmZuZHRuLm9yYml0JywgZnVuY3Rpb24gKGUpIHtcbiAgICAgICAgICBjb250YWluZXIuZGF0YSgnc3dpcGUtdHJhbnNpdGlvbicsIHt9KTtcbiAgICAgICAgICBlLnN0b3BQcm9wYWdhdGlvbigpO1xuICAgICAgICB9KVxuICAgICAgfVxuICAgICAgY29udGFpbmVyLm9uKCdtb3VzZWVudGVyLmZuZHRuLm9yYml0JywgZnVuY3Rpb24gKGUpIHtcbiAgICAgICAgaWYgKHNldHRpbmdzLnRpbWVyICYmIHNldHRpbmdzLnBhdXNlX29uX2hvdmVyKSB7XG4gICAgICAgICAgc2VsZi5zdG9wX3RpbWVyKCk7XG4gICAgICAgIH1cbiAgICAgIH0pXG4gICAgICAub24oJ21vdXNlbGVhdmUuZm5kdG4ub3JiaXQnLCBmdW5jdGlvbiAoZSkge1xuICAgICAgICBpZiAoc2V0dGluZ3MudGltZXIgJiYgc2V0dGluZ3MucmVzdW1lX29uX21vdXNlb3V0KSB7XG4gICAgICAgICAgdGltZXIuc3RhcnQoKTtcbiAgICAgICAgfVxuICAgICAgfSk7XG5cbiAgICAgICQoZG9jdW1lbnQpLm9uKCdjbGljaycsICdbZGF0YS1vcmJpdC1saW5rXScsIHNlbGYubGlua19jdXN0b20pO1xuICAgICAgJCh3aW5kb3cpLm9uKCdsb2FkIHJlc2l6ZScsIHNlbGYuY29tcHV0ZV9kaW1lbnNpb25zKTtcbiAgICAgIEZvdW5kYXRpb24udXRpbHMuaW1hZ2VfbG9hZGVkKHRoaXMuc2xpZGVzKCkuY2hpbGRyZW4oJ2ltZycpLCBzZWxmLmNvbXB1dGVfZGltZW5zaW9ucyk7XG4gICAgICBGb3VuZGF0aW9uLnV0aWxzLmltYWdlX2xvYWRlZCh0aGlzLnNsaWRlcygpLmNoaWxkcmVuKCdpbWcnKSwgZnVuY3Rpb24gKCkge1xuICAgICAgICBjb250YWluZXIucHJldignLicgKyBzZXR0aW5ncy5wcmVsb2FkZXJfY2xhc3MpLmNzcygnZGlzcGxheScsICdub25lJyk7XG4gICAgICAgIHNlbGYudXBkYXRlX3NsaWRlX251bWJlcigwKTtcbiAgICAgICAgc2VsZi51cGRhdGVfYWN0aXZlX2xpbmsoMCk7XG4gICAgICAgIHNsaWRlc19jb250YWluZXIudHJpZ2dlcigncmVhZHkuZm5kdG4ub3JiaXQnKTtcbiAgICAgIH0pO1xuICAgIH07XG5cbiAgICBzZWxmLmluaXQoKTtcbiAgfTtcblxuICB2YXIgVGltZXIgPSBmdW5jdGlvbiAoZWwsIHNldHRpbmdzLCBjYWxsYmFjaykge1xuICAgIHZhciBzZWxmID0gdGhpcyxcbiAgICAgICAgZHVyYXRpb24gPSBzZXR0aW5ncy50aW1lcl9zcGVlZCxcbiAgICAgICAgcHJvZ3Jlc3MgPSBlbC5maW5kKCcuJyArIHNldHRpbmdzLnRpbWVyX3Byb2dyZXNzX2NsYXNzKSxcbiAgICAgICAgc3RhcnQsXG4gICAgICAgIHRpbWVvdXQsXG4gICAgICAgIGxlZnQgPSAtMTtcblxuICAgIHRoaXMudXBkYXRlX3Byb2dyZXNzID0gZnVuY3Rpb24gKHcpIHtcbiAgICAgIHZhciBuZXdfcHJvZ3Jlc3MgPSBwcm9ncmVzcy5jbG9uZSgpO1xuICAgICAgbmV3X3Byb2dyZXNzLmF0dHIoJ3N0eWxlJywgJycpO1xuICAgICAgbmV3X3Byb2dyZXNzLmNzcygnd2lkdGgnLCB3ICsgJyUnKTtcbiAgICAgIHByb2dyZXNzLnJlcGxhY2VXaXRoKG5ld19wcm9ncmVzcyk7XG4gICAgICBwcm9ncmVzcyA9IG5ld19wcm9ncmVzcztcbiAgICB9O1xuXG4gICAgdGhpcy5yZXN0YXJ0ID0gZnVuY3Rpb24gKCkge1xuICAgICAgY2xlYXJUaW1lb3V0KHRpbWVvdXQpO1xuICAgICAgZWwuYWRkQ2xhc3Moc2V0dGluZ3MudGltZXJfcGF1c2VkX2NsYXNzKTtcbiAgICAgIGxlZnQgPSAtMTtcbiAgICAgIHNlbGYudXBkYXRlX3Byb2dyZXNzKDApO1xuICAgIH07XG5cbiAgICB0aGlzLnN0YXJ0ID0gZnVuY3Rpb24gKCkge1xuICAgICAgaWYgKCFlbC5oYXNDbGFzcyhzZXR0aW5ncy50aW1lcl9wYXVzZWRfY2xhc3MpKSB7cmV0dXJuIHRydWU7fVxuICAgICAgbGVmdCA9IChsZWZ0ID09PSAtMSkgPyBkdXJhdGlvbiA6IGxlZnQ7XG4gICAgICBlbC5yZW1vdmVDbGFzcyhzZXR0aW5ncy50aW1lcl9wYXVzZWRfY2xhc3MpO1xuICAgICAgc3RhcnQgPSBuZXcgRGF0ZSgpLmdldFRpbWUoKTtcbiAgICAgIHByb2dyZXNzLmFuaW1hdGUoeyd3aWR0aCcgOiAnMTAwJSd9LCBsZWZ0LCAnbGluZWFyJyk7XG4gICAgICB0aW1lb3V0ID0gc2V0VGltZW91dChmdW5jdGlvbiAoKSB7XG4gICAgICAgIHNlbGYucmVzdGFydCgpO1xuICAgICAgICBjYWxsYmFjaygpO1xuICAgICAgfSwgbGVmdCk7XG4gICAgICBlbC50cmlnZ2VyKCd0aW1lci1zdGFydGVkLmZuZHRuLm9yYml0JylcbiAgICB9O1xuXG4gICAgdGhpcy5zdG9wID0gZnVuY3Rpb24gKCkge1xuICAgICAgaWYgKGVsLmhhc0NsYXNzKHNldHRpbmdzLnRpbWVyX3BhdXNlZF9jbGFzcykpIHtyZXR1cm4gdHJ1ZTt9XG4gICAgICBjbGVhclRpbWVvdXQodGltZW91dCk7XG4gICAgICBlbC5hZGRDbGFzcyhzZXR0aW5ncy50aW1lcl9wYXVzZWRfY2xhc3MpO1xuICAgICAgdmFyIGVuZCA9IG5ldyBEYXRlKCkuZ2V0VGltZSgpO1xuICAgICAgbGVmdCA9IGxlZnQgLSAoZW5kIC0gc3RhcnQpO1xuICAgICAgdmFyIHcgPSAxMDAgLSAoKGxlZnQgLyBkdXJhdGlvbikgKiAxMDApO1xuICAgICAgc2VsZi51cGRhdGVfcHJvZ3Jlc3Modyk7XG4gICAgICBlbC50cmlnZ2VyKCd0aW1lci1zdG9wcGVkLmZuZHRuLm9yYml0Jyk7XG4gICAgfTtcbiAgfTtcblxuICB2YXIgU2xpZGVBbmltYXRpb24gPSBmdW5jdGlvbiAoc2V0dGluZ3MsIGNvbnRhaW5lcikge1xuICAgIHZhciBkdXJhdGlvbiA9IHNldHRpbmdzLmFuaW1hdGlvbl9zcGVlZDtcbiAgICB2YXIgaXNfcnRsID0gKCQoJ2h0bWxbZGlyPXJ0bF0nKS5sZW5ndGggPT09IDEpO1xuICAgIHZhciBtYXJnaW4gPSBpc19ydGwgPyAnbWFyZ2luUmlnaHQnIDogJ21hcmdpbkxlZnQnO1xuICAgIHZhciBhbmltTWFyZ2luID0ge307XG4gICAgYW5pbU1hcmdpblttYXJnaW5dID0gJzAlJztcblxuICAgIHRoaXMubmV4dCA9IGZ1bmN0aW9uIChjdXJyZW50LCBuZXh0LCBjYWxsYmFjaykge1xuICAgICAgY3VycmVudC5hbmltYXRlKHttYXJnaW5MZWZ0IDogJy0xMDAlJ30sIGR1cmF0aW9uKTtcbiAgICAgIG5leHQuYW5pbWF0ZShhbmltTWFyZ2luLCBkdXJhdGlvbiwgZnVuY3Rpb24gKCkge1xuICAgICAgICBjdXJyZW50LmNzcyhtYXJnaW4sICcxMDAlJyk7XG4gICAgICAgIGNhbGxiYWNrKCk7XG4gICAgICB9KTtcbiAgICB9O1xuXG4gICAgdGhpcy5wcmV2ID0gZnVuY3Rpb24gKGN1cnJlbnQsIHByZXYsIGNhbGxiYWNrKSB7XG4gICAgICBjdXJyZW50LmFuaW1hdGUoe21hcmdpbkxlZnQgOiAnMTAwJSd9LCBkdXJhdGlvbik7XG4gICAgICBwcmV2LmNzcyhtYXJnaW4sICctMTAwJScpO1xuICAgICAgcHJldi5hbmltYXRlKGFuaW1NYXJnaW4sIGR1cmF0aW9uLCBmdW5jdGlvbiAoKSB7XG4gICAgICAgIGN1cnJlbnQuY3NzKG1hcmdpbiwgJzEwMCUnKTtcbiAgICAgICAgY2FsbGJhY2soKTtcbiAgICAgIH0pO1xuICAgIH07XG4gIH07XG5cbiAgdmFyIEZhZGVBbmltYXRpb24gPSBmdW5jdGlvbiAoc2V0dGluZ3MsIGNvbnRhaW5lcikge1xuICAgIHZhciBkdXJhdGlvbiA9IHNldHRpbmdzLmFuaW1hdGlvbl9zcGVlZDtcbiAgICB2YXIgaXNfcnRsID0gKCQoJ2h0bWxbZGlyPXJ0bF0nKS5sZW5ndGggPT09IDEpO1xuICAgIHZhciBtYXJnaW4gPSBpc19ydGwgPyAnbWFyZ2luUmlnaHQnIDogJ21hcmdpbkxlZnQnO1xuXG4gICAgdGhpcy5uZXh0ID0gZnVuY3Rpb24gKGN1cnJlbnQsIG5leHQsIGNhbGxiYWNrKSB7XG4gICAgICBuZXh0LmNzcyh7J21hcmdpbicgOiAnMCUnLCAnb3BhY2l0eScgOiAnMC4wMSd9KTtcbiAgICAgIG5leHQuYW5pbWF0ZSh7J29wYWNpdHknIDonMSd9LCBkdXJhdGlvbiwgJ2xpbmVhcicsIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgY3VycmVudC5jc3MoJ21hcmdpbicsICcxMDAlJyk7XG4gICAgICAgIGNhbGxiYWNrKCk7XG4gICAgICB9KTtcbiAgICB9O1xuXG4gICAgdGhpcy5wcmV2ID0gZnVuY3Rpb24gKGN1cnJlbnQsIHByZXYsIGNhbGxiYWNrKSB7XG4gICAgICBwcmV2LmNzcyh7J21hcmdpbicgOiAnMCUnLCAnb3BhY2l0eScgOiAnMC4wMSd9KTtcbiAgICAgIHByZXYuYW5pbWF0ZSh7J29wYWNpdHknIDogJzEnfSwgZHVyYXRpb24sICdsaW5lYXInLCBmdW5jdGlvbiAoKSB7XG4gICAgICAgIGN1cnJlbnQuY3NzKCdtYXJnaW4nLCAnMTAwJScpO1xuICAgICAgICBjYWxsYmFjaygpO1xuICAgICAgfSk7XG4gICAgfTtcbiAgfTtcblxuICBGb3VuZGF0aW9uLmxpYnMgPSBGb3VuZGF0aW9uLmxpYnMgfHwge307XG5cbiAgRm91bmRhdGlvbi5saWJzLm9yYml0ID0ge1xuICAgIG5hbWUgOiAnb3JiaXQnLFxuXG4gICAgdmVyc2lvbiA6ICc1LjUuMicsXG5cbiAgICBzZXR0aW5ncyA6IHtcbiAgICAgIGFuaW1hdGlvbiA6ICdzbGlkZScsXG4gICAgICB0aW1lcl9zcGVlZCA6IDEwMDAwLFxuICAgICAgcGF1c2Vfb25faG92ZXIgOiB0cnVlLFxuICAgICAgcmVzdW1lX29uX21vdXNlb3V0IDogZmFsc2UsXG4gICAgICBuZXh0X29uX2NsaWNrIDogdHJ1ZSxcbiAgICAgIGFuaW1hdGlvbl9zcGVlZCA6IDUwMCxcbiAgICAgIHN0YWNrX29uX3NtYWxsIDogZmFsc2UsXG4gICAgICBuYXZpZ2F0aW9uX2Fycm93cyA6IHRydWUsXG4gICAgICBzbGlkZV9udW1iZXIgOiB0cnVlLFxuICAgICAgc2xpZGVfbnVtYmVyX3RleHQgOiAnb2YnLFxuICAgICAgY29udGFpbmVyX2NsYXNzIDogJ29yYml0LWNvbnRhaW5lcicsXG4gICAgICBzdGFja19vbl9zbWFsbF9jbGFzcyA6ICdvcmJpdC1zdGFjay1vbi1zbWFsbCcsXG4gICAgICBuZXh0X2NsYXNzIDogJ29yYml0LW5leHQnLFxuICAgICAgcHJldl9jbGFzcyA6ICdvcmJpdC1wcmV2JyxcbiAgICAgIHRpbWVyX2NvbnRhaW5lcl9jbGFzcyA6ICdvcmJpdC10aW1lcicsXG4gICAgICB0aW1lcl9wYXVzZWRfY2xhc3MgOiAncGF1c2VkJyxcbiAgICAgIHRpbWVyX3Byb2dyZXNzX2NsYXNzIDogJ29yYml0LXByb2dyZXNzJyxcbiAgICAgIHNsaWRlc19jb250YWluZXJfY2xhc3MgOiAnb3JiaXQtc2xpZGVzLWNvbnRhaW5lcicsXG4gICAgICBwcmVsb2FkZXJfY2xhc3MgOiAncHJlbG9hZGVyJyxcbiAgICAgIHNsaWRlX3NlbGVjdG9yIDogJyonLFxuICAgICAgYnVsbGV0c19jb250YWluZXJfY2xhc3MgOiAnb3JiaXQtYnVsbGV0cycsXG4gICAgICBidWxsZXRzX2FjdGl2ZV9jbGFzcyA6ICdhY3RpdmUnLFxuICAgICAgc2xpZGVfbnVtYmVyX2NsYXNzIDogJ29yYml0LXNsaWRlLW51bWJlcicsXG4gICAgICBjYXB0aW9uX2NsYXNzIDogJ29yYml0LWNhcHRpb24nLFxuICAgICAgYWN0aXZlX3NsaWRlX2NsYXNzIDogJ2FjdGl2ZScsXG4gICAgICBvcmJpdF90cmFuc2l0aW9uX2NsYXNzIDogJ29yYml0LXRyYW5zaXRpb25pbmcnLFxuICAgICAgYnVsbGV0cyA6IHRydWUsXG4gICAgICBjaXJjdWxhciA6IHRydWUsXG4gICAgICB0aW1lciA6IHRydWUsXG4gICAgICB2YXJpYWJsZV9oZWlnaHQgOiBmYWxzZSxcbiAgICAgIHN3aXBlIDogdHJ1ZSxcbiAgICAgIGJlZm9yZV9zbGlkZV9jaGFuZ2UgOiBub29wLFxuICAgICAgYWZ0ZXJfc2xpZGVfY2hhbmdlIDogbm9vcFxuICAgIH0sXG5cbiAgICBpbml0IDogZnVuY3Rpb24gKHNjb3BlLCBtZXRob2QsIG9wdGlvbnMpIHtcbiAgICAgIHZhciBzZWxmID0gdGhpcztcbiAgICAgIHRoaXMuYmluZGluZ3MobWV0aG9kLCBvcHRpb25zKTtcbiAgICB9LFxuXG4gICAgZXZlbnRzIDogZnVuY3Rpb24gKGluc3RhbmNlKSB7XG4gICAgICB2YXIgb3JiaXRfaW5zdGFuY2UgPSBuZXcgT3JiaXQodGhpcy5TKGluc3RhbmNlKSwgdGhpcy5TKGluc3RhbmNlKS5kYXRhKCdvcmJpdC1pbml0JykpO1xuICAgICAgdGhpcy5TKGluc3RhbmNlKS5kYXRhKHRoaXMubmFtZSArICctaW5zdGFuY2UnLCBvcmJpdF9pbnN0YW5jZSk7XG4gICAgfSxcblxuICAgIHJlZmxvdyA6IGZ1bmN0aW9uICgpIHtcbiAgICAgIHZhciBzZWxmID0gdGhpcztcblxuICAgICAgaWYgKHNlbGYuUyhzZWxmLnNjb3BlKS5pcygnW2RhdGEtb3JiaXRdJykpIHtcbiAgICAgICAgdmFyICRlbCA9IHNlbGYuUyhzZWxmLnNjb3BlKTtcbiAgICAgICAgdmFyIGluc3RhbmNlID0gJGVsLmRhdGEoc2VsZi5uYW1lICsgJy1pbnN0YW5jZScpO1xuICAgICAgICBpbnN0YW5jZS5jb21wdXRlX2RpbWVuc2lvbnMoKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHNlbGYuUygnW2RhdGEtb3JiaXRdJywgc2VsZi5zY29wZSkuZWFjaChmdW5jdGlvbiAoaWR4LCBlbCkge1xuICAgICAgICAgIHZhciAkZWwgPSBzZWxmLlMoZWwpO1xuICAgICAgICAgIHZhciBvcHRzID0gc2VsZi5kYXRhX29wdGlvbnMoJGVsKTtcbiAgICAgICAgICB2YXIgaW5zdGFuY2UgPSAkZWwuZGF0YShzZWxmLm5hbWUgKyAnLWluc3RhbmNlJyk7XG4gICAgICAgICAgaW5zdGFuY2UuY29tcHV0ZV9kaW1lbnNpb25zKCk7XG4gICAgICAgIH0pO1xuICAgICAgfVxuICAgIH1cbiAgfTtcblxufShqUXVlcnksIHdpbmRvdywgd2luZG93LmRvY3VtZW50KSk7XG5cbjsoZnVuY3Rpb24gKCQsIHdpbmRvdywgZG9jdW1lbnQsIHVuZGVmaW5lZCkge1xuICAndXNlIHN0cmljdCc7XG5cbiAgRm91bmRhdGlvbi5saWJzLnJldmVhbCA9IHtcbiAgICBuYW1lIDogJ3JldmVhbCcsXG5cbiAgICB2ZXJzaW9uIDogJzUuNS4yJyxcblxuICAgIGxvY2tlZCA6IGZhbHNlLFxuXG4gICAgc2V0dGluZ3MgOiB7XG4gICAgICBhbmltYXRpb24gOiAnZmFkZUFuZFBvcCcsXG4gICAgICBhbmltYXRpb25fc3BlZWQgOiAyNTAsXG4gICAgICBjbG9zZV9vbl9iYWNrZ3JvdW5kX2NsaWNrIDogdHJ1ZSxcbiAgICAgIGNsb3NlX29uX2VzYyA6IHRydWUsXG4gICAgICBkaXNtaXNzX21vZGFsX2NsYXNzIDogJ2Nsb3NlLXJldmVhbC1tb2RhbCcsXG4gICAgICBtdWx0aXBsZV9vcGVuZWQgOiBmYWxzZSxcbiAgICAgIGJnX2NsYXNzIDogJ3JldmVhbC1tb2RhbC1iZycsXG4gICAgICByb290X2VsZW1lbnQgOiAnYm9keScsXG4gICAgICBvcGVuIDogZnVuY3Rpb24oKXt9LFxuICAgICAgb3BlbmVkIDogZnVuY3Rpb24oKXt9LFxuICAgICAgY2xvc2UgOiBmdW5jdGlvbigpe30sXG4gICAgICBjbG9zZWQgOiBmdW5jdGlvbigpe30sXG4gICAgICBvbl9hamF4X2Vycm9yOiAkLm5vb3AsXG4gICAgICBiZyA6ICQoJy5yZXZlYWwtbW9kYWwtYmcnKSxcbiAgICAgIGNzcyA6IHtcbiAgICAgICAgb3BlbiA6IHtcbiAgICAgICAgICAnb3BhY2l0eScgOiAwLFxuICAgICAgICAgICd2aXNpYmlsaXR5JyA6ICd2aXNpYmxlJyxcbiAgICAgICAgICAnZGlzcGxheScgOiAnYmxvY2snXG4gICAgICAgIH0sXG4gICAgICAgIGNsb3NlIDoge1xuICAgICAgICAgICdvcGFjaXR5JyA6IDEsXG4gICAgICAgICAgJ3Zpc2liaWxpdHknIDogJ2hpZGRlbicsXG4gICAgICAgICAgJ2Rpc3BsYXknIDogJ25vbmUnXG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9LFxuXG4gICAgaW5pdCA6IGZ1bmN0aW9uIChzY29wZSwgbWV0aG9kLCBvcHRpb25zKSB7XG4gICAgICAkLmV4dGVuZCh0cnVlLCB0aGlzLnNldHRpbmdzLCBtZXRob2QsIG9wdGlvbnMpO1xuICAgICAgdGhpcy5iaW5kaW5ncyhtZXRob2QsIG9wdGlvbnMpO1xuICAgIH0sXG5cbiAgICBldmVudHMgOiBmdW5jdGlvbiAoc2NvcGUpIHtcbiAgICAgIHZhciBzZWxmID0gdGhpcyxcbiAgICAgICAgICBTID0gc2VsZi5TO1xuXG4gICAgICBTKHRoaXMuc2NvcGUpXG4gICAgICAgIC5vZmYoJy5yZXZlYWwnKVxuICAgICAgICAub24oJ2NsaWNrLmZuZHRuLnJldmVhbCcsICdbJyArIHRoaXMuYWRkX25hbWVzcGFjZSgnZGF0YS1yZXZlYWwtaWQnKSArICddOm5vdChbZGlzYWJsZWRdKScsIGZ1bmN0aW9uIChlKSB7XG4gICAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuXG4gICAgICAgICAgaWYgKCFzZWxmLmxvY2tlZCkge1xuICAgICAgICAgICAgdmFyIGVsZW1lbnQgPSBTKHRoaXMpLFxuICAgICAgICAgICAgICAgIGFqYXggPSBlbGVtZW50LmRhdGEoc2VsZi5kYXRhX2F0dHIoJ3JldmVhbC1hamF4JykpLFxuICAgICAgICAgICAgICAgIHJlcGxhY2VDb250ZW50U2VsID0gZWxlbWVudC5kYXRhKHNlbGYuZGF0YV9hdHRyKCdyZXZlYWwtcmVwbGFjZS1jb250ZW50JykpO1xuXG4gICAgICAgICAgICBzZWxmLmxvY2tlZCA9IHRydWU7XG5cbiAgICAgICAgICAgIGlmICh0eXBlb2YgYWpheCA9PT0gJ3VuZGVmaW5lZCcpIHtcbiAgICAgICAgICAgICAgc2VsZi5vcGVuLmNhbGwoc2VsZiwgZWxlbWVudCk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICB2YXIgdXJsID0gYWpheCA9PT0gdHJ1ZSA/IGVsZW1lbnQuYXR0cignaHJlZicpIDogYWpheDtcbiAgICAgICAgICAgICAgc2VsZi5vcGVuLmNhbGwoc2VsZiwgZWxlbWVudCwge3VybCA6IHVybH0sIHsgcmVwbGFjZUNvbnRlbnRTZWwgOiByZXBsYWNlQ29udGVudFNlbCB9KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgIH0pO1xuXG4gICAgICBTKGRvY3VtZW50KVxuICAgICAgICAub24oJ2NsaWNrLmZuZHRuLnJldmVhbCcsIHRoaXMuY2xvc2VfdGFyZ2V0cygpLCBmdW5jdGlvbiAoZSkge1xuICAgICAgICAgIGUucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgICBpZiAoIXNlbGYubG9ja2VkKSB7XG4gICAgICAgICAgICB2YXIgc2V0dGluZ3MgPSBTKCdbJyArIHNlbGYuYXR0cl9uYW1lKCkgKyAnXS5vcGVuJykuZGF0YShzZWxmLmF0dHJfbmFtZSh0cnVlKSArICctaW5pdCcpIHx8IHNlbGYuc2V0dGluZ3MsXG4gICAgICAgICAgICAgICAgYmdfY2xpY2tlZCA9IFMoZS50YXJnZXQpWzBdID09PSBTKCcuJyArIHNldHRpbmdzLmJnX2NsYXNzKVswXTtcblxuICAgICAgICAgICAgaWYgKGJnX2NsaWNrZWQpIHtcbiAgICAgICAgICAgICAgaWYgKHNldHRpbmdzLmNsb3NlX29uX2JhY2tncm91bmRfY2xpY2spIHtcbiAgICAgICAgICAgICAgICBlLnN0b3BQcm9wYWdhdGlvbigpO1xuICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBzZWxmLmxvY2tlZCA9IHRydWU7XG4gICAgICAgICAgICBzZWxmLmNsb3NlLmNhbGwoc2VsZiwgYmdfY2xpY2tlZCA/IFMoJ1snICsgc2VsZi5hdHRyX25hbWUoKSArICddLm9wZW46bm90KC50b2JhY2spJykgOiBTKHRoaXMpLmNsb3Nlc3QoJ1snICsgc2VsZi5hdHRyX25hbWUoKSArICddJykpO1xuICAgICAgICAgIH1cbiAgICAgICAgfSk7XG5cbiAgICAgIGlmIChTKCdbJyArIHNlbGYuYXR0cl9uYW1lKCkgKyAnXScsIHRoaXMuc2NvcGUpLmxlbmd0aCA+IDApIHtcbiAgICAgICAgUyh0aGlzLnNjb3BlKVxuICAgICAgICAgIC8vIC5vZmYoJy5yZXZlYWwnKVxuICAgICAgICAgIC5vbignb3Blbi5mbmR0bi5yZXZlYWwnLCB0aGlzLnNldHRpbmdzLm9wZW4pXG4gICAgICAgICAgLm9uKCdvcGVuZWQuZm5kdG4ucmV2ZWFsJywgdGhpcy5zZXR0aW5ncy5vcGVuZWQpXG4gICAgICAgICAgLm9uKCdvcGVuZWQuZm5kdG4ucmV2ZWFsJywgdGhpcy5vcGVuX3ZpZGVvKVxuICAgICAgICAgIC5vbignY2xvc2UuZm5kdG4ucmV2ZWFsJywgdGhpcy5zZXR0aW5ncy5jbG9zZSlcbiAgICAgICAgICAub24oJ2Nsb3NlZC5mbmR0bi5yZXZlYWwnLCB0aGlzLnNldHRpbmdzLmNsb3NlZClcbiAgICAgICAgICAub24oJ2Nsb3NlZC5mbmR0bi5yZXZlYWwnLCB0aGlzLmNsb3NlX3ZpZGVvKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIFModGhpcy5zY29wZSlcbiAgICAgICAgICAvLyAub2ZmKCcucmV2ZWFsJylcbiAgICAgICAgICAub24oJ29wZW4uZm5kdG4ucmV2ZWFsJywgJ1snICsgc2VsZi5hdHRyX25hbWUoKSArICddJywgdGhpcy5zZXR0aW5ncy5vcGVuKVxuICAgICAgICAgIC5vbignb3BlbmVkLmZuZHRuLnJldmVhbCcsICdbJyArIHNlbGYuYXR0cl9uYW1lKCkgKyAnXScsIHRoaXMuc2V0dGluZ3Mub3BlbmVkKVxuICAgICAgICAgIC5vbignb3BlbmVkLmZuZHRuLnJldmVhbCcsICdbJyArIHNlbGYuYXR0cl9uYW1lKCkgKyAnXScsIHRoaXMub3Blbl92aWRlbylcbiAgICAgICAgICAub24oJ2Nsb3NlLmZuZHRuLnJldmVhbCcsICdbJyArIHNlbGYuYXR0cl9uYW1lKCkgKyAnXScsIHRoaXMuc2V0dGluZ3MuY2xvc2UpXG4gICAgICAgICAgLm9uKCdjbG9zZWQuZm5kdG4ucmV2ZWFsJywgJ1snICsgc2VsZi5hdHRyX25hbWUoKSArICddJywgdGhpcy5zZXR0aW5ncy5jbG9zZWQpXG4gICAgICAgICAgLm9uKCdjbG9zZWQuZm5kdG4ucmV2ZWFsJywgJ1snICsgc2VsZi5hdHRyX25hbWUoKSArICddJywgdGhpcy5jbG9zZV92aWRlbyk7XG4gICAgICB9XG5cbiAgICAgIHJldHVybiB0cnVlO1xuICAgIH0sXG5cbiAgICAvLyBQQVRDSCAjMzogdHVybmluZyBvbiBrZXkgdXAgY2FwdHVyZSBvbmx5IHdoZW4gYSByZXZlYWwgd2luZG93IGlzIG9wZW5cbiAgICBrZXlfdXBfb24gOiBmdW5jdGlvbiAoc2NvcGUpIHtcbiAgICAgIHZhciBzZWxmID0gdGhpcztcblxuICAgICAgLy8gUEFUQ0ggIzE6IGZpeGluZyBtdWx0aXBsZSBrZXl1cCBldmVudCB0cmlnZ2VyIGZyb20gc2luZ2xlIGtleSBwcmVzc1xuICAgICAgc2VsZi5TKCdib2R5Jykub2ZmKCdrZXl1cC5mbmR0bi5yZXZlYWwnKS5vbigna2V5dXAuZm5kdG4ucmV2ZWFsJywgZnVuY3Rpb24gKCBldmVudCApIHtcbiAgICAgICAgdmFyIG9wZW5fbW9kYWwgPSBzZWxmLlMoJ1snICsgc2VsZi5hdHRyX25hbWUoKSArICddLm9wZW4nKSxcbiAgICAgICAgICAgIHNldHRpbmdzID0gb3Blbl9tb2RhbC5kYXRhKHNlbGYuYXR0cl9uYW1lKHRydWUpICsgJy1pbml0JykgfHwgc2VsZi5zZXR0aW5ncyA7XG4gICAgICAgIC8vIFBBVENIICMyOiBtYWtpbmcgc3VyZSB0aGF0IHRoZSBjbG9zZSBldmVudCBjYW4gYmUgY2FsbGVkIG9ubHkgd2hpbGUgdW5sb2NrZWQsXG4gICAgICAgIC8vICAgICAgICAgICBzbyB0aGF0IG11bHRpcGxlIGtleXVwLmZuZHRuLnJldmVhbCBldmVudHMgZG9uJ3QgcHJldmVudCBjbGVhbiBjbG9zaW5nIG9mIHRoZSByZXZlYWwgd2luZG93LlxuICAgICAgICBpZiAoIHNldHRpbmdzICYmIGV2ZW50LndoaWNoID09PSAyNyAgJiYgc2V0dGluZ3MuY2xvc2Vfb25fZXNjICYmICFzZWxmLmxvY2tlZCkgeyAvLyAyNyBpcyB0aGUga2V5Y29kZSBmb3IgdGhlIEVzY2FwZSBrZXlcbiAgICAgICAgICBzZWxmLmNsb3NlLmNhbGwoc2VsZiwgb3Blbl9tb2RhbCk7XG4gICAgICAgIH1cbiAgICAgIH0pO1xuXG4gICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9LFxuXG4gICAgLy8gUEFUQ0ggIzM6IHR1cm5pbmcgb24ga2V5IHVwIGNhcHR1cmUgb25seSB3aGVuIGEgcmV2ZWFsIHdpbmRvdyBpcyBvcGVuXG4gICAga2V5X3VwX29mZiA6IGZ1bmN0aW9uIChzY29wZSkge1xuICAgICAgdGhpcy5TKCdib2R5Jykub2ZmKCdrZXl1cC5mbmR0bi5yZXZlYWwnKTtcbiAgICAgIHJldHVybiB0cnVlO1xuICAgIH0sXG5cbiAgICBvcGVuIDogZnVuY3Rpb24gKHRhcmdldCwgYWpheF9zZXR0aW5ncykge1xuICAgICAgdmFyIHNlbGYgPSB0aGlzLFxuICAgICAgICAgIG1vZGFsO1xuXG4gICAgICBpZiAodGFyZ2V0KSB7XG4gICAgICAgIGlmICh0eXBlb2YgdGFyZ2V0LnNlbGVjdG9yICE9PSAndW5kZWZpbmVkJykge1xuICAgICAgICAgIC8vIEZpbmQgdGhlIG5hbWVkIG5vZGU7IG9ubHkgdXNlIHRoZSBmaXJzdCBvbmUgZm91bmQsIHNpbmNlIHRoZSByZXN0IG9mIHRoZSBjb2RlIGFzc3VtZXMgdGhlcmUncyBvbmx5IG9uZSBub2RlXG4gICAgICAgICAgbW9kYWwgPSBzZWxmLlMoJyMnICsgdGFyZ2V0LmRhdGEoc2VsZi5kYXRhX2F0dHIoJ3JldmVhbC1pZCcpKSkuZmlyc3QoKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBtb2RhbCA9IHNlbGYuUyh0aGlzLnNjb3BlKTtcblxuICAgICAgICAgIGFqYXhfc2V0dGluZ3MgPSB0YXJnZXQ7XG4gICAgICAgIH1cbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIG1vZGFsID0gc2VsZi5TKHRoaXMuc2NvcGUpO1xuICAgICAgfVxuXG4gICAgICB2YXIgc2V0dGluZ3MgPSBtb2RhbC5kYXRhKHNlbGYuYXR0cl9uYW1lKHRydWUpICsgJy1pbml0Jyk7XG4gICAgICBzZXR0aW5ncyA9IHNldHRpbmdzIHx8IHRoaXMuc2V0dGluZ3M7XG5cblxuICAgICAgaWYgKG1vZGFsLmhhc0NsYXNzKCdvcGVuJykgJiYgdGFyZ2V0LmF0dHIoJ2RhdGEtcmV2ZWFsLWlkJykgPT0gbW9kYWwuYXR0cignaWQnKSkge1xuICAgICAgICByZXR1cm4gc2VsZi5jbG9zZShtb2RhbCk7XG4gICAgICB9XG5cbiAgICAgIGlmICghbW9kYWwuaGFzQ2xhc3MoJ29wZW4nKSkge1xuICAgICAgICB2YXIgb3Blbl9tb2RhbCA9IHNlbGYuUygnWycgKyBzZWxmLmF0dHJfbmFtZSgpICsgJ10ub3BlbicpO1xuXG4gICAgICAgIGlmICh0eXBlb2YgbW9kYWwuZGF0YSgnY3NzLXRvcCcpID09PSAndW5kZWZpbmVkJykge1xuICAgICAgICAgIG1vZGFsLmRhdGEoJ2Nzcy10b3AnLCBwYXJzZUludChtb2RhbC5jc3MoJ3RvcCcpLCAxMCkpXG4gICAgICAgICAgICAuZGF0YSgnb2Zmc2V0JywgdGhpcy5jYWNoZV9vZmZzZXQobW9kYWwpKTtcbiAgICAgICAgfVxuXG4gICAgICAgIG1vZGFsLmF0dHIoJ3RhYmluZGV4JywnMCcpLmF0dHIoJ2FyaWEtaGlkZGVuJywnZmFsc2UnKTtcblxuICAgICAgICB0aGlzLmtleV91cF9vbihtb2RhbCk7ICAgIC8vIFBBVENIICMzOiB0dXJuaW5nIG9uIGtleSB1cCBjYXB0dXJlIG9ubHkgd2hlbiBhIHJldmVhbCB3aW5kb3cgaXMgb3BlblxuXG4gICAgICAgIC8vIFByZXZlbnQgbmFtZXNwYWNlIGV2ZW50IGZyb20gdHJpZ2dlcmluZyB0d2ljZVxuICAgICAgICBtb2RhbC5vbignb3Blbi5mbmR0bi5yZXZlYWwnLCBmdW5jdGlvbihlKSB7XG4gICAgICAgICAgaWYgKGUubmFtZXNwYWNlICE9PSAnZm5kdG4ucmV2ZWFsJykgcmV0dXJuO1xuICAgICAgICB9KTtcblxuICAgICAgICBtb2RhbC5vbignb3Blbi5mbmR0bi5yZXZlYWwnKS50cmlnZ2VyKCdvcGVuLmZuZHRuLnJldmVhbCcpO1xuXG4gICAgICAgIGlmIChvcGVuX21vZGFsLmxlbmd0aCA8IDEpIHtcbiAgICAgICAgICB0aGlzLnRvZ2dsZV9iZyhtb2RhbCwgdHJ1ZSk7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAodHlwZW9mIGFqYXhfc2V0dGluZ3MgPT09ICdzdHJpbmcnKSB7XG4gICAgICAgICAgYWpheF9zZXR0aW5ncyA9IHtcbiAgICAgICAgICAgIHVybCA6IGFqYXhfc2V0dGluZ3NcbiAgICAgICAgICB9O1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKHR5cGVvZiBhamF4X3NldHRpbmdzID09PSAndW5kZWZpbmVkJyB8fCAhYWpheF9zZXR0aW5ncy51cmwpIHtcbiAgICAgICAgICBpZiAob3Blbl9tb2RhbC5sZW5ndGggPiAwKSB7XG4gICAgICAgICAgICBpZiAoc2V0dGluZ3MubXVsdGlwbGVfb3BlbmVkKSB7XG4gICAgICAgICAgICAgIHNlbGYudG9fYmFjayhvcGVuX21vZGFsKTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgIHNlbGYuaGlkZShvcGVuX21vZGFsLCBzZXR0aW5ncy5jc3MuY2xvc2UpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cblxuICAgICAgICAgIHRoaXMuc2hvdyhtb2RhbCwgc2V0dGluZ3MuY3NzLm9wZW4pO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHZhciBvbGRfc3VjY2VzcyA9IHR5cGVvZiBhamF4X3NldHRpbmdzLnN1Y2Nlc3MgIT09ICd1bmRlZmluZWQnID8gYWpheF9zZXR0aW5ncy5zdWNjZXNzIDogbnVsbDtcbiAgICAgICAgICAkLmV4dGVuZChhamF4X3NldHRpbmdzLCB7XG4gICAgICAgICAgICBzdWNjZXNzIDogZnVuY3Rpb24gKGRhdGEsIHRleHRTdGF0dXMsIGpxWEhSKSB7XG4gICAgICAgICAgICAgIGlmICggJC5pc0Z1bmN0aW9uKG9sZF9zdWNjZXNzKSApIHtcbiAgICAgICAgICAgICAgICB2YXIgcmVzdWx0ID0gb2xkX3N1Y2Nlc3MoZGF0YSwgdGV4dFN0YXR1cywganFYSFIpO1xuICAgICAgICAgICAgICAgIGlmICh0eXBlb2YgcmVzdWx0ID09ICdzdHJpbmcnKSB7XG4gICAgICAgICAgICAgICAgICBkYXRhID0gcmVzdWx0O1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgIGlmICh0eXBlb2Ygb3B0aW9ucyAhPT0gJ3VuZGVmaW5lZCcgJiYgdHlwZW9mIG9wdGlvbnMucmVwbGFjZUNvbnRlbnRTZWwgIT09ICd1bmRlZmluZWQnKSB7XG4gICAgICAgICAgICAgICAgbW9kYWwuZmluZChvcHRpb25zLnJlcGxhY2VDb250ZW50U2VsKS5odG1sKGRhdGEpO1xuICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIG1vZGFsLmh0bWwoZGF0YSk7XG4gICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICBzZWxmLlMobW9kYWwpLmZvdW5kYXRpb24oJ3NlY3Rpb24nLCAncmVmbG93Jyk7XG4gICAgICAgICAgICAgIHNlbGYuUyhtb2RhbCkuY2hpbGRyZW4oKS5mb3VuZGF0aW9uKCk7XG5cbiAgICAgICAgICAgICAgaWYgKG9wZW5fbW9kYWwubGVuZ3RoID4gMCkge1xuICAgICAgICAgICAgICAgIGlmIChzZXR0aW5ncy5tdWx0aXBsZV9vcGVuZWQpIHtcbiAgICAgICAgICAgICAgICAgIHNlbGYudG9fYmFjayhvcGVuX21vZGFsKTtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgc2VsZi5oaWRlKG9wZW5fbW9kYWwsIHNldHRpbmdzLmNzcy5jbG9zZSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIHNlbGYuc2hvdyhtb2RhbCwgc2V0dGluZ3MuY3NzLm9wZW4pO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgLy8gY2hlY2sgZm9yIGlmIHVzZXIgaW5pdGFsaXplZCB3aXRoIGVycm9yIGNhbGxiYWNrXG4gICAgICAgICAgaWYgKHNldHRpbmdzLm9uX2FqYXhfZXJyb3IgIT09ICQubm9vcCkge1xuICAgICAgICAgICAgJC5leHRlbmQoYWpheF9zZXR0aW5ncywge1xuICAgICAgICAgICAgICBlcnJvciA6IHNldHRpbmdzLm9uX2FqYXhfZXJyb3JcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgIH1cblxuICAgICAgICAgICQuYWpheChhamF4X3NldHRpbmdzKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgc2VsZi5TKHdpbmRvdykudHJpZ2dlcigncmVzaXplJyk7XG4gICAgfSxcblxuICAgIGNsb3NlIDogZnVuY3Rpb24gKG1vZGFsKSB7XG4gICAgICB2YXIgbW9kYWwgPSBtb2RhbCAmJiBtb2RhbC5sZW5ndGggPyBtb2RhbCA6IHRoaXMuUyh0aGlzLnNjb3BlKSxcbiAgICAgICAgICBvcGVuX21vZGFscyA9IHRoaXMuUygnWycgKyB0aGlzLmF0dHJfbmFtZSgpICsgJ10ub3BlbicpLFxuICAgICAgICAgIHNldHRpbmdzID0gbW9kYWwuZGF0YSh0aGlzLmF0dHJfbmFtZSh0cnVlKSArICctaW5pdCcpIHx8IHRoaXMuc2V0dGluZ3MsXG4gICAgICAgICAgc2VsZiA9IHRoaXM7XG5cbiAgICAgIGlmIChvcGVuX21vZGFscy5sZW5ndGggPiAwKSB7XG5cbiAgICAgICAgbW9kYWwucmVtb3ZlQXR0cigndGFiaW5kZXgnLCcwJykuYXR0cignYXJpYS1oaWRkZW4nLCd0cnVlJyk7XG5cbiAgICAgICAgdGhpcy5sb2NrZWQgPSB0cnVlO1xuICAgICAgICB0aGlzLmtleV91cF9vZmYobW9kYWwpOyAgIC8vIFBBVENIICMzOiB0dXJuaW5nIG9uIGtleSB1cCBjYXB0dXJlIG9ubHkgd2hlbiBhIHJldmVhbCB3aW5kb3cgaXMgb3BlblxuXG4gICAgICAgIG1vZGFsLnRyaWdnZXIoJ2Nsb3NlLmZuZHRuLnJldmVhbCcpO1xuXG4gICAgICAgIGlmICgoc2V0dGluZ3MubXVsdGlwbGVfb3BlbmVkICYmIG9wZW5fbW9kYWxzLmxlbmd0aCA9PT0gMSkgfHwgIXNldHRpbmdzLm11bHRpcGxlX29wZW5lZCB8fCBtb2RhbC5sZW5ndGggPiAxKSB7XG4gICAgICAgICAgc2VsZi50b2dnbGVfYmcobW9kYWwsIGZhbHNlKTtcbiAgICAgICAgICBzZWxmLnRvX2Zyb250KG1vZGFsKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChzZXR0aW5ncy5tdWx0aXBsZV9vcGVuZWQpIHtcbiAgICAgICAgICBzZWxmLmhpZGUobW9kYWwsIHNldHRpbmdzLmNzcy5jbG9zZSwgc2V0dGluZ3MpO1xuICAgICAgICAgIHNlbGYudG9fZnJvbnQoJCgkLm1ha2VBcnJheShvcGVuX21vZGFscykucmV2ZXJzZSgpWzFdKSk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgc2VsZi5oaWRlKG9wZW5fbW9kYWxzLCBzZXR0aW5ncy5jc3MuY2xvc2UsIHNldHRpbmdzKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH0sXG5cbiAgICBjbG9zZV90YXJnZXRzIDogZnVuY3Rpb24gKCkge1xuICAgICAgdmFyIGJhc2UgPSAnLicgKyB0aGlzLnNldHRpbmdzLmRpc21pc3NfbW9kYWxfY2xhc3M7XG5cbiAgICAgIGlmICh0aGlzLnNldHRpbmdzLmNsb3NlX29uX2JhY2tncm91bmRfY2xpY2spIHtcbiAgICAgICAgcmV0dXJuIGJhc2UgKyAnLCAuJyArIHRoaXMuc2V0dGluZ3MuYmdfY2xhc3M7XG4gICAgICB9XG5cbiAgICAgIHJldHVybiBiYXNlO1xuICAgIH0sXG5cbiAgICB0b2dnbGVfYmcgOiBmdW5jdGlvbiAobW9kYWwsIHN0YXRlKSB7XG4gICAgICBpZiAodGhpcy5TKCcuJyArIHRoaXMuc2V0dGluZ3MuYmdfY2xhc3MpLmxlbmd0aCA9PT0gMCkge1xuICAgICAgICB0aGlzLnNldHRpbmdzLmJnID0gJCgnPGRpdiAvPicsIHsnY2xhc3MnOiB0aGlzLnNldHRpbmdzLmJnX2NsYXNzfSlcbiAgICAgICAgICAuYXBwZW5kVG8oJ2JvZHknKS5oaWRlKCk7XG4gICAgICB9XG5cbiAgICAgIHZhciB2aXNpYmxlID0gdGhpcy5zZXR0aW5ncy5iZy5maWx0ZXIoJzp2aXNpYmxlJykubGVuZ3RoID4gMDtcbiAgICAgIGlmICggc3RhdGUgIT0gdmlzaWJsZSApIHtcbiAgICAgICAgaWYgKCBzdGF0ZSA9PSB1bmRlZmluZWQgPyB2aXNpYmxlIDogIXN0YXRlICkge1xuICAgICAgICAgIHRoaXMuaGlkZSh0aGlzLnNldHRpbmdzLmJnKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICB0aGlzLnNob3codGhpcy5zZXR0aW5ncy5iZyk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9LFxuXG4gICAgc2hvdyA6IGZ1bmN0aW9uIChlbCwgY3NzKSB7XG4gICAgICAvLyBpcyBtb2RhbFxuICAgICAgaWYgKGNzcykge1xuICAgICAgICB2YXIgc2V0dGluZ3MgPSBlbC5kYXRhKHRoaXMuYXR0cl9uYW1lKHRydWUpICsgJy1pbml0JykgfHwgdGhpcy5zZXR0aW5ncyxcbiAgICAgICAgICAgIHJvb3RfZWxlbWVudCA9IHNldHRpbmdzLnJvb3RfZWxlbWVudCxcbiAgICAgICAgICAgIGNvbnRleHQgPSB0aGlzO1xuXG4gICAgICAgIGlmIChlbC5wYXJlbnQocm9vdF9lbGVtZW50KS5sZW5ndGggPT09IDApIHtcbiAgICAgICAgICB2YXIgcGxhY2Vob2xkZXIgPSBlbC53cmFwKCc8ZGl2IHN0eWxlPVwiZGlzcGxheTogbm9uZTtcIiAvPicpLnBhcmVudCgpO1xuXG4gICAgICAgICAgZWwub24oJ2Nsb3NlZC5mbmR0bi5yZXZlYWwud3JhcHBlZCcsIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIGVsLmRldGFjaCgpLmFwcGVuZFRvKHBsYWNlaG9sZGVyKTtcbiAgICAgICAgICAgIGVsLnVud3JhcCgpLnVuYmluZCgnY2xvc2VkLmZuZHRuLnJldmVhbC53cmFwcGVkJyk7XG4gICAgICAgICAgfSk7XG5cbiAgICAgICAgICBlbC5kZXRhY2goKS5hcHBlbmRUbyhyb290X2VsZW1lbnQpO1xuICAgICAgICB9XG5cbiAgICAgICAgdmFyIGFuaW1EYXRhID0gZ2V0QW5pbWF0aW9uRGF0YShzZXR0aW5ncy5hbmltYXRpb24pO1xuICAgICAgICBpZiAoIWFuaW1EYXRhLmFuaW1hdGUpIHtcbiAgICAgICAgICB0aGlzLmxvY2tlZCA9IGZhbHNlO1xuICAgICAgICB9XG4gICAgICAgIGlmIChhbmltRGF0YS5wb3ApIHtcbiAgICAgICAgICBjc3MudG9wID0gJCh3aW5kb3cpLnNjcm9sbFRvcCgpIC0gZWwuZGF0YSgnb2Zmc2V0JykgKyAncHgnO1xuICAgICAgICAgIHZhciBlbmRfY3NzID0ge1xuICAgICAgICAgICAgdG9wOiAkKHdpbmRvdykuc2Nyb2xsVG9wKCkgKyBlbC5kYXRhKCdjc3MtdG9wJykgKyAncHgnLFxuICAgICAgICAgICAgb3BhY2l0eTogMVxuICAgICAgICAgIH07XG5cbiAgICAgICAgICByZXR1cm4gc2V0VGltZW91dChmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICByZXR1cm4gZWxcbiAgICAgICAgICAgICAgLmNzcyhjc3MpXG4gICAgICAgICAgICAgIC5hbmltYXRlKGVuZF9jc3MsIHNldHRpbmdzLmFuaW1hdGlvbl9zcGVlZCwgJ2xpbmVhcicsIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICBjb250ZXh0LmxvY2tlZCA9IGZhbHNlO1xuICAgICAgICAgICAgICAgIGVsLnRyaWdnZXIoJ29wZW5lZC5mbmR0bi5yZXZlYWwnKTtcbiAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgLmFkZENsYXNzKCdvcGVuJyk7XG4gICAgICAgICAgfSwgc2V0dGluZ3MuYW5pbWF0aW9uX3NwZWVkIC8gMik7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoYW5pbURhdGEuZmFkZSkge1xuICAgICAgICAgIGNzcy50b3AgPSAkKHdpbmRvdykuc2Nyb2xsVG9wKCkgKyBlbC5kYXRhKCdjc3MtdG9wJykgKyAncHgnO1xuICAgICAgICAgIHZhciBlbmRfY3NzID0ge29wYWNpdHk6IDF9O1xuXG4gICAgICAgICAgcmV0dXJuIHNldFRpbWVvdXQoZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgcmV0dXJuIGVsXG4gICAgICAgICAgICAgIC5jc3MoY3NzKVxuICAgICAgICAgICAgICAuYW5pbWF0ZShlbmRfY3NzLCBzZXR0aW5ncy5hbmltYXRpb25fc3BlZWQsICdsaW5lYXInLCBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgY29udGV4dC5sb2NrZWQgPSBmYWxzZTtcbiAgICAgICAgICAgICAgICBlbC50cmlnZ2VyKCdvcGVuZWQuZm5kdG4ucmV2ZWFsJyk7XG4gICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgIC5hZGRDbGFzcygnb3BlbicpO1xuICAgICAgICAgIH0sIHNldHRpbmdzLmFuaW1hdGlvbl9zcGVlZCAvIDIpO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIGVsLmNzcyhjc3MpLnNob3coKS5jc3Moe29wYWNpdHkgOiAxfSkuYWRkQ2xhc3MoJ29wZW4nKS50cmlnZ2VyKCdvcGVuZWQuZm5kdG4ucmV2ZWFsJyk7XG4gICAgICB9XG5cbiAgICAgIHZhciBzZXR0aW5ncyA9IHRoaXMuc2V0dGluZ3M7XG5cbiAgICAgIC8vIHNob3VsZCB3ZSBhbmltYXRlIHRoZSBiYWNrZ3JvdW5kP1xuICAgICAgaWYgKGdldEFuaW1hdGlvbkRhdGEoc2V0dGluZ3MuYW5pbWF0aW9uKS5mYWRlKSB7XG4gICAgICAgIHJldHVybiBlbC5mYWRlSW4oc2V0dGluZ3MuYW5pbWF0aW9uX3NwZWVkIC8gMik7XG4gICAgICB9XG5cbiAgICAgIHRoaXMubG9ja2VkID0gZmFsc2U7XG5cbiAgICAgIHJldHVybiBlbC5zaG93KCk7XG4gICAgfSxcblxuICAgIHRvX2JhY2sgOiBmdW5jdGlvbihlbCkge1xuICAgICAgZWwuYWRkQ2xhc3MoJ3RvYmFjaycpO1xuICAgIH0sXG5cbiAgICB0b19mcm9udCA6IGZ1bmN0aW9uKGVsKSB7XG4gICAgICBlbC5yZW1vdmVDbGFzcygndG9iYWNrJyk7XG4gICAgfSxcblxuICAgIGhpZGUgOiBmdW5jdGlvbiAoZWwsIGNzcykge1xuICAgICAgLy8gaXMgbW9kYWxcbiAgICAgIGlmIChjc3MpIHtcbiAgICAgICAgdmFyIHNldHRpbmdzID0gZWwuZGF0YSh0aGlzLmF0dHJfbmFtZSh0cnVlKSArICctaW5pdCcpLFxuICAgICAgICAgICAgY29udGV4dCA9IHRoaXM7XG4gICAgICAgIHNldHRpbmdzID0gc2V0dGluZ3MgfHwgdGhpcy5zZXR0aW5ncztcblxuICAgICAgICB2YXIgYW5pbURhdGEgPSBnZXRBbmltYXRpb25EYXRhKHNldHRpbmdzLmFuaW1hdGlvbik7XG4gICAgICAgIGlmICghYW5pbURhdGEuYW5pbWF0ZSkge1xuICAgICAgICAgIHRoaXMubG9ja2VkID0gZmFsc2U7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKGFuaW1EYXRhLnBvcCkge1xuICAgICAgICAgIHZhciBlbmRfY3NzID0ge1xuICAgICAgICAgICAgdG9wOiAtICQod2luZG93KS5zY3JvbGxUb3AoKSAtIGVsLmRhdGEoJ29mZnNldCcpICsgJ3B4JyxcbiAgICAgICAgICAgIG9wYWNpdHk6IDBcbiAgICAgICAgICB9O1xuXG4gICAgICAgICAgcmV0dXJuIHNldFRpbWVvdXQoZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgcmV0dXJuIGVsXG4gICAgICAgICAgICAgIC5hbmltYXRlKGVuZF9jc3MsIHNldHRpbmdzLmFuaW1hdGlvbl9zcGVlZCwgJ2xpbmVhcicsIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICBjb250ZXh0LmxvY2tlZCA9IGZhbHNlO1xuICAgICAgICAgICAgICAgIGVsLmNzcyhjc3MpLnRyaWdnZXIoJ2Nsb3NlZC5mbmR0bi5yZXZlYWwnKTtcbiAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgLnJlbW92ZUNsYXNzKCdvcGVuJyk7XG4gICAgICAgICAgfSwgc2V0dGluZ3MuYW5pbWF0aW9uX3NwZWVkIC8gMik7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoYW5pbURhdGEuZmFkZSkge1xuICAgICAgICAgIHZhciBlbmRfY3NzID0ge29wYWNpdHkgOiAwfTtcblxuICAgICAgICAgIHJldHVybiBzZXRUaW1lb3V0KGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIHJldHVybiBlbFxuICAgICAgICAgICAgICAuYW5pbWF0ZShlbmRfY3NzLCBzZXR0aW5ncy5hbmltYXRpb25fc3BlZWQsICdsaW5lYXInLCBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgY29udGV4dC5sb2NrZWQgPSBmYWxzZTtcbiAgICAgICAgICAgICAgICBlbC5jc3MoY3NzKS50cmlnZ2VyKCdjbG9zZWQuZm5kdG4ucmV2ZWFsJyk7XG4gICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgIC5yZW1vdmVDbGFzcygnb3BlbicpO1xuICAgICAgICAgIH0sIHNldHRpbmdzLmFuaW1hdGlvbl9zcGVlZCAvIDIpO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIGVsLmhpZGUoKS5jc3MoY3NzKS5yZW1vdmVDbGFzcygnb3BlbicpLnRyaWdnZXIoJ2Nsb3NlZC5mbmR0bi5yZXZlYWwnKTtcbiAgICAgIH1cblxuICAgICAgdmFyIHNldHRpbmdzID0gdGhpcy5zZXR0aW5ncztcblxuICAgICAgLy8gc2hvdWxkIHdlIGFuaW1hdGUgdGhlIGJhY2tncm91bmQ/XG4gICAgICBpZiAoZ2V0QW5pbWF0aW9uRGF0YShzZXR0aW5ncy5hbmltYXRpb24pLmZhZGUpIHtcbiAgICAgICAgcmV0dXJuIGVsLmZhZGVPdXQoc2V0dGluZ3MuYW5pbWF0aW9uX3NwZWVkIC8gMik7XG4gICAgICB9XG5cbiAgICAgIHJldHVybiBlbC5oaWRlKCk7XG4gICAgfSxcblxuICAgIGNsb3NlX3ZpZGVvIDogZnVuY3Rpb24gKGUpIHtcbiAgICAgIHZhciB2aWRlbyA9ICQoJy5mbGV4LXZpZGVvJywgZS50YXJnZXQpLFxuICAgICAgICAgIGlmcmFtZSA9ICQoJ2lmcmFtZScsIHZpZGVvKTtcblxuICAgICAgaWYgKGlmcmFtZS5sZW5ndGggPiAwKSB7XG4gICAgICAgIGlmcmFtZS5hdHRyKCdkYXRhLXNyYycsIGlmcmFtZVswXS5zcmMpO1xuICAgICAgICBpZnJhbWUuYXR0cignc3JjJywgaWZyYW1lLmF0dHIoJ3NyYycpKTtcbiAgICAgICAgdmlkZW8uaGlkZSgpO1xuICAgICAgfVxuICAgIH0sXG5cbiAgICBvcGVuX3ZpZGVvIDogZnVuY3Rpb24gKGUpIHtcbiAgICAgIHZhciB2aWRlbyA9ICQoJy5mbGV4LXZpZGVvJywgZS50YXJnZXQpLFxuICAgICAgICAgIGlmcmFtZSA9IHZpZGVvLmZpbmQoJ2lmcmFtZScpO1xuXG4gICAgICBpZiAoaWZyYW1lLmxlbmd0aCA+IDApIHtcbiAgICAgICAgdmFyIGRhdGFfc3JjID0gaWZyYW1lLmF0dHIoJ2RhdGEtc3JjJyk7XG4gICAgICAgIGlmICh0eXBlb2YgZGF0YV9zcmMgPT09ICdzdHJpbmcnKSB7XG4gICAgICAgICAgaWZyYW1lWzBdLnNyYyA9IGlmcmFtZS5hdHRyKCdkYXRhLXNyYycpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHZhciBzcmMgPSBpZnJhbWVbMF0uc3JjO1xuICAgICAgICAgIGlmcmFtZVswXS5zcmMgPSB1bmRlZmluZWQ7XG4gICAgICAgICAgaWZyYW1lWzBdLnNyYyA9IHNyYztcbiAgICAgICAgfVxuICAgICAgICB2aWRlby5zaG93KCk7XG4gICAgICB9XG4gICAgfSxcblxuICAgIGRhdGFfYXR0ciA6IGZ1bmN0aW9uIChzdHIpIHtcbiAgICAgIGlmICh0aGlzLm5hbWVzcGFjZS5sZW5ndGggPiAwKSB7XG4gICAgICAgIHJldHVybiB0aGlzLm5hbWVzcGFjZSArICctJyArIHN0cjtcbiAgICAgIH1cblxuICAgICAgcmV0dXJuIHN0cjtcbiAgICB9LFxuXG4gICAgY2FjaGVfb2Zmc2V0IDogZnVuY3Rpb24gKG1vZGFsKSB7XG4gICAgICB2YXIgb2Zmc2V0ID0gbW9kYWwuc2hvdygpLmhlaWdodCgpICsgcGFyc2VJbnQobW9kYWwuY3NzKCd0b3AnKSwgMTApICsgbW9kYWwuc2Nyb2xsWTtcblxuICAgICAgbW9kYWwuaGlkZSgpO1xuXG4gICAgICByZXR1cm4gb2Zmc2V0O1xuICAgIH0sXG5cbiAgICBvZmYgOiBmdW5jdGlvbiAoKSB7XG4gICAgICAkKHRoaXMuc2NvcGUpLm9mZignLmZuZHRuLnJldmVhbCcpO1xuICAgIH0sXG5cbiAgICByZWZsb3cgOiBmdW5jdGlvbiAoKSB7fVxuICB9O1xuXG4gIC8qXG4gICAqIGdldEFuaW1hdGlvbkRhdGEoJ3BvcEFuZEZhZGUnKSAvLyB7YW5pbWF0ZTogdHJ1ZSwgIHBvcDogdHJ1ZSwgIGZhZGU6IHRydWV9XG4gICAqIGdldEFuaW1hdGlvbkRhdGEoJ2ZhZGUnKSAgICAgICAvLyB7YW5pbWF0ZTogdHJ1ZSwgIHBvcDogZmFsc2UsIGZhZGU6IHRydWV9XG4gICAqIGdldEFuaW1hdGlvbkRhdGEoJ3BvcCcpICAgICAgICAvLyB7YW5pbWF0ZTogdHJ1ZSwgIHBvcDogdHJ1ZSwgIGZhZGU6IGZhbHNlfVxuICAgKiBnZXRBbmltYXRpb25EYXRhKCdmb28nKSAgICAgICAgLy8ge2FuaW1hdGU6IGZhbHNlLCBwb3A6IGZhbHNlLCBmYWRlOiBmYWxzZX1cbiAgICogZ2V0QW5pbWF0aW9uRGF0YShudWxsKSAgICAgICAgIC8vIHthbmltYXRlOiBmYWxzZSwgcG9wOiBmYWxzZSwgZmFkZTogZmFsc2V9XG4gICAqL1xuICBmdW5jdGlvbiBnZXRBbmltYXRpb25EYXRhKHN0cikge1xuICAgIHZhciBmYWRlID0gL2ZhZGUvaS50ZXN0KHN0cik7XG4gICAgdmFyIHBvcCA9IC9wb3AvaS50ZXN0KHN0cik7XG4gICAgcmV0dXJuIHtcbiAgICAgIGFuaW1hdGUgOiBmYWRlIHx8IHBvcCxcbiAgICAgIHBvcCA6IHBvcCxcbiAgICAgIGZhZGUgOiBmYWRlXG4gICAgfTtcbiAgfVxufShqUXVlcnksIHdpbmRvdywgd2luZG93LmRvY3VtZW50KSk7XG5cbjsoZnVuY3Rpb24gKCQsIHdpbmRvdywgZG9jdW1lbnQsIHVuZGVmaW5lZCkge1xuICAndXNlIHN0cmljdCc7XG5cbiAgRm91bmRhdGlvbi5saWJzLnNsaWRlciA9IHtcbiAgICBuYW1lIDogJ3NsaWRlcicsXG5cbiAgICB2ZXJzaW9uIDogJzUuNS4yJyxcblxuICAgIHNldHRpbmdzIDoge1xuICAgICAgc3RhcnQgOiAwLFxuICAgICAgZW5kIDogMTAwLFxuICAgICAgc3RlcCA6IDEsXG4gICAgICBwcmVjaXNpb24gOiBudWxsLFxuICAgICAgaW5pdGlhbCA6IG51bGwsXG4gICAgICBkaXNwbGF5X3NlbGVjdG9yIDogJycsXG4gICAgICB2ZXJ0aWNhbCA6IGZhbHNlLFxuICAgICAgdHJpZ2dlcl9pbnB1dF9jaGFuZ2UgOiBmYWxzZSxcbiAgICAgIG9uX2NoYW5nZSA6IGZ1bmN0aW9uICgpIHt9XG4gICAgfSxcblxuICAgIGNhY2hlIDoge30sXG5cbiAgICBpbml0IDogZnVuY3Rpb24gKHNjb3BlLCBtZXRob2QsIG9wdGlvbnMpIHtcbiAgICAgIEZvdW5kYXRpb24uaW5oZXJpdCh0aGlzLCAndGhyb3R0bGUnKTtcbiAgICAgIHRoaXMuYmluZGluZ3MobWV0aG9kLCBvcHRpb25zKTtcbiAgICAgIHRoaXMucmVmbG93KCk7XG4gICAgfSxcblxuICAgIGV2ZW50cyA6IGZ1bmN0aW9uICgpIHtcbiAgICAgIHZhciBzZWxmID0gdGhpcztcblxuICAgICAgJCh0aGlzLnNjb3BlKVxuICAgICAgICAub2ZmKCcuc2xpZGVyJylcbiAgICAgICAgLm9uKCdtb3VzZWRvd24uZm5kdG4uc2xpZGVyIHRvdWNoc3RhcnQuZm5kdG4uc2xpZGVyIHBvaW50ZXJkb3duLmZuZHRuLnNsaWRlcicsXG4gICAgICAgICdbJyArIHNlbGYuYXR0cl9uYW1lKCkgKyAnXTpub3QoLmRpc2FibGVkLCBbZGlzYWJsZWRdKSAucmFuZ2Utc2xpZGVyLWhhbmRsZScsIGZ1bmN0aW9uIChlKSB7XG4gICAgICAgICAgaWYgKCFzZWxmLmNhY2hlLmFjdGl2ZSkge1xuICAgICAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgICAgICAgc2VsZi5zZXRfYWN0aXZlX3NsaWRlcigkKGUudGFyZ2V0KSk7XG4gICAgICAgICAgfVxuICAgICAgICB9KVxuICAgICAgICAub24oJ21vdXNlbW92ZS5mbmR0bi5zbGlkZXIgdG91Y2htb3ZlLmZuZHRuLnNsaWRlciBwb2ludGVybW92ZS5mbmR0bi5zbGlkZXInLCBmdW5jdGlvbiAoZSkge1xuICAgICAgICAgIGlmICghIXNlbGYuY2FjaGUuYWN0aXZlKSB7XG4gICAgICAgICAgICBlLnByZXZlbnREZWZhdWx0KCk7XG4gICAgICAgICAgICBpZiAoJC5kYXRhKHNlbGYuY2FjaGUuYWN0aXZlWzBdLCAnc2V0dGluZ3MnKS52ZXJ0aWNhbCkge1xuICAgICAgICAgICAgICB2YXIgc2Nyb2xsX29mZnNldCA9IDA7XG4gICAgICAgICAgICAgIGlmICghZS5wYWdlWSkge1xuICAgICAgICAgICAgICAgIHNjcm9sbF9vZmZzZXQgPSB3aW5kb3cuc2Nyb2xsWTtcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICBzZWxmLmNhbGN1bGF0ZV9wb3NpdGlvbihzZWxmLmNhY2hlLmFjdGl2ZSwgc2VsZi5nZXRfY3Vyc29yX3Bvc2l0aW9uKGUsICd5JykgKyBzY3JvbGxfb2Zmc2V0KTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgIHNlbGYuY2FsY3VsYXRlX3Bvc2l0aW9uKHNlbGYuY2FjaGUuYWN0aXZlLCBzZWxmLmdldF9jdXJzb3JfcG9zaXRpb24oZSwgJ3gnKSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICB9KVxuICAgICAgICAub24oJ21vdXNldXAuZm5kdG4uc2xpZGVyIHRvdWNoZW5kLmZuZHRuLnNsaWRlciBwb2ludGVydXAuZm5kdG4uc2xpZGVyJywgZnVuY3Rpb24gKGUpIHtcbiAgICAgICAgICBzZWxmLnJlbW92ZV9hY3RpdmVfc2xpZGVyKCk7XG4gICAgICAgIH0pXG4gICAgICAgIC5vbignY2hhbmdlLmZuZHRuLnNsaWRlcicsIGZ1bmN0aW9uIChlKSB7XG4gICAgICAgICAgc2VsZi5zZXR0aW5ncy5vbl9jaGFuZ2UoKTtcbiAgICAgICAgfSk7XG5cbiAgICAgIHNlbGYuUyh3aW5kb3cpXG4gICAgICAgIC5vbigncmVzaXplLmZuZHRuLnNsaWRlcicsIHNlbGYudGhyb3R0bGUoZnVuY3Rpb24gKGUpIHtcbiAgICAgICAgICBzZWxmLnJlZmxvdygpO1xuICAgICAgICB9LCAzMDApKTtcblxuICAgICAgLy8gdXBkYXRlIHNsaWRlciB2YWx1ZSBhcyB1c2VycyBjaGFuZ2UgaW5wdXQgdmFsdWVcbiAgICAgIHRoaXMuUygnWycgKyB0aGlzLmF0dHJfbmFtZSgpICsgJ10nKS5lYWNoKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgdmFyIHNsaWRlciA9ICQodGhpcyksXG4gICAgICAgICAgICBoYW5kbGUgPSBzbGlkZXIuY2hpbGRyZW4oJy5yYW5nZS1zbGlkZXItaGFuZGxlJylbMF0sXG4gICAgICAgICAgICBzZXR0aW5ncyA9IHNlbGYuaW5pdGlhbGl6ZV9zZXR0aW5ncyhoYW5kbGUpO1xuXG4gICAgICAgIGlmIChzZXR0aW5ncy5kaXNwbGF5X3NlbGVjdG9yICE9ICcnKSB7XG4gICAgICAgICAgJChzZXR0aW5ncy5kaXNwbGF5X3NlbGVjdG9yKS5lYWNoKGZ1bmN0aW9uKCl7XG4gICAgICAgICAgICBpZiAodGhpcy5oYXNPd25Qcm9wZXJ0eSgndmFsdWUnKSkge1xuICAgICAgICAgICAgICAkKHRoaXMpLmNoYW5nZShmdW5jdGlvbigpe1xuICAgICAgICAgICAgICAgIC8vIGlzIHRoZXJlIGEgYmV0dGVyIHdheSB0byBkbyB0aGlzP1xuICAgICAgICAgICAgICAgIHNsaWRlci5mb3VuZGF0aW9uKFwic2xpZGVyXCIsIFwic2V0X3ZhbHVlXCIsICQodGhpcykudmFsKCkpO1xuICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgfSxcblxuICAgIGdldF9jdXJzb3JfcG9zaXRpb24gOiBmdW5jdGlvbiAoZSwgeHkpIHtcbiAgICAgIHZhciBwYWdlWFkgPSAncGFnZScgKyB4eS50b1VwcGVyQ2FzZSgpLFxuICAgICAgICAgIGNsaWVudFhZID0gJ2NsaWVudCcgKyB4eS50b1VwcGVyQ2FzZSgpLFxuICAgICAgICAgIHBvc2l0aW9uO1xuXG4gICAgICBpZiAodHlwZW9mIGVbcGFnZVhZXSAhPT0gJ3VuZGVmaW5lZCcpIHtcbiAgICAgICAgcG9zaXRpb24gPSBlW3BhZ2VYWV07XG4gICAgICB9IGVsc2UgaWYgKHR5cGVvZiBlLm9yaWdpbmFsRXZlbnRbY2xpZW50WFldICE9PSAndW5kZWZpbmVkJykge1xuICAgICAgICBwb3NpdGlvbiA9IGUub3JpZ2luYWxFdmVudFtjbGllbnRYWV07XG4gICAgICB9IGVsc2UgaWYgKGUub3JpZ2luYWxFdmVudC50b3VjaGVzICYmIGUub3JpZ2luYWxFdmVudC50b3VjaGVzWzBdICYmIHR5cGVvZiBlLm9yaWdpbmFsRXZlbnQudG91Y2hlc1swXVtjbGllbnRYWV0gIT09ICd1bmRlZmluZWQnKSB7XG4gICAgICAgIHBvc2l0aW9uID0gZS5vcmlnaW5hbEV2ZW50LnRvdWNoZXNbMF1bY2xpZW50WFldO1xuICAgICAgfSBlbHNlIGlmIChlLmN1cnJlbnRQb2ludCAmJiB0eXBlb2YgZS5jdXJyZW50UG9pbnRbeHldICE9PSAndW5kZWZpbmVkJykge1xuICAgICAgICBwb3NpdGlvbiA9IGUuY3VycmVudFBvaW50W3h5XTtcbiAgICAgIH1cblxuICAgICAgcmV0dXJuIHBvc2l0aW9uO1xuICAgIH0sXG5cbiAgICBzZXRfYWN0aXZlX3NsaWRlciA6IGZ1bmN0aW9uICgkaGFuZGxlKSB7XG4gICAgICB0aGlzLmNhY2hlLmFjdGl2ZSA9ICRoYW5kbGU7XG4gICAgfSxcblxuICAgIHJlbW92ZV9hY3RpdmVfc2xpZGVyIDogZnVuY3Rpb24gKCkge1xuICAgICAgdGhpcy5jYWNoZS5hY3RpdmUgPSBudWxsO1xuICAgIH0sXG5cbiAgICBjYWxjdWxhdGVfcG9zaXRpb24gOiBmdW5jdGlvbiAoJGhhbmRsZSwgY3Vyc29yX3gpIHtcbiAgICAgIHZhciBzZWxmID0gdGhpcyxcbiAgICAgICAgICBzZXR0aW5ncyA9ICQuZGF0YSgkaGFuZGxlWzBdLCAnc2V0dGluZ3MnKSxcbiAgICAgICAgICBoYW5kbGVfbCA9ICQuZGF0YSgkaGFuZGxlWzBdLCAnaGFuZGxlX2wnKSxcbiAgICAgICAgICBoYW5kbGVfbyA9ICQuZGF0YSgkaGFuZGxlWzBdLCAnaGFuZGxlX28nKSxcbiAgICAgICAgICBiYXJfbCA9ICQuZGF0YSgkaGFuZGxlWzBdLCAnYmFyX2wnKSxcbiAgICAgICAgICBiYXJfbyA9ICQuZGF0YSgkaGFuZGxlWzBdLCAnYmFyX28nKTtcblxuICAgICAgcmVxdWVzdEFuaW1hdGlvbkZyYW1lKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgdmFyIHBjdDtcblxuICAgICAgICBpZiAoRm91bmRhdGlvbi5ydGwgJiYgIXNldHRpbmdzLnZlcnRpY2FsKSB7XG4gICAgICAgICAgcGN0ID0gc2VsZi5saW1pdF90bygoKGJhcl9vICsgYmFyX2wgLSBjdXJzb3JfeCkgLyBiYXJfbCksIDAsIDEpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHBjdCA9IHNlbGYubGltaXRfdG8oKChjdXJzb3JfeCAtIGJhcl9vKSAvIGJhcl9sKSwgMCwgMSk7XG4gICAgICAgIH1cblxuICAgICAgICBwY3QgPSBzZXR0aW5ncy52ZXJ0aWNhbCA/IDEgLSBwY3QgOiBwY3Q7XG5cbiAgICAgICAgdmFyIG5vcm0gPSBzZWxmLm5vcm1hbGl6ZWRfdmFsdWUocGN0LCBzZXR0aW5ncy5zdGFydCwgc2V0dGluZ3MuZW5kLCBzZXR0aW5ncy5zdGVwLCBzZXR0aW5ncy5wcmVjaXNpb24pO1xuXG4gICAgICAgIHNlbGYuc2V0X3VpKCRoYW5kbGUsIG5vcm0pO1xuICAgICAgfSk7XG4gICAgfSxcblxuICAgIHNldF91aSA6IGZ1bmN0aW9uICgkaGFuZGxlLCB2YWx1ZSkge1xuICAgICAgdmFyIHNldHRpbmdzID0gJC5kYXRhKCRoYW5kbGVbMF0sICdzZXR0aW5ncycpLFxuICAgICAgICAgIGhhbmRsZV9sID0gJC5kYXRhKCRoYW5kbGVbMF0sICdoYW5kbGVfbCcpLFxuICAgICAgICAgIGJhcl9sID0gJC5kYXRhKCRoYW5kbGVbMF0sICdiYXJfbCcpLFxuICAgICAgICAgIG5vcm1fcGN0ID0gdGhpcy5ub3JtYWxpemVkX3BlcmNlbnRhZ2UodmFsdWUsIHNldHRpbmdzLnN0YXJ0LCBzZXR0aW5ncy5lbmQpLFxuICAgICAgICAgIGhhbmRsZV9vZmZzZXQgPSBub3JtX3BjdCAqIChiYXJfbCAtIGhhbmRsZV9sKSAtIDEsXG4gICAgICAgICAgcHJvZ3Jlc3NfYmFyX2xlbmd0aCA9IG5vcm1fcGN0ICogMTAwLFxuICAgICAgICAgICRoYW5kbGVfcGFyZW50ID0gJGhhbmRsZS5wYXJlbnQoKSxcbiAgICAgICAgICAkaGlkZGVuX2lucHV0cyA9ICRoYW5kbGUucGFyZW50KCkuY2hpbGRyZW4oJ2lucHV0W3R5cGU9aGlkZGVuXScpO1xuXG4gICAgICBpZiAoRm91bmRhdGlvbi5ydGwgJiYgIXNldHRpbmdzLnZlcnRpY2FsKSB7XG4gICAgICAgIGhhbmRsZV9vZmZzZXQgPSAtaGFuZGxlX29mZnNldDtcbiAgICAgIH1cblxuICAgICAgaGFuZGxlX29mZnNldCA9IHNldHRpbmdzLnZlcnRpY2FsID8gLWhhbmRsZV9vZmZzZXQgKyBiYXJfbCAtIGhhbmRsZV9sICsgMSA6IGhhbmRsZV9vZmZzZXQ7XG4gICAgICB0aGlzLnNldF90cmFuc2xhdGUoJGhhbmRsZSwgaGFuZGxlX29mZnNldCwgc2V0dGluZ3MudmVydGljYWwpO1xuXG4gICAgICBpZiAoc2V0dGluZ3MudmVydGljYWwpIHtcbiAgICAgICAgJGhhbmRsZS5zaWJsaW5ncygnLnJhbmdlLXNsaWRlci1hY3RpdmUtc2VnbWVudCcpLmNzcygnaGVpZ2h0JywgcHJvZ3Jlc3NfYmFyX2xlbmd0aCArICclJyk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICAkaGFuZGxlLnNpYmxpbmdzKCcucmFuZ2Utc2xpZGVyLWFjdGl2ZS1zZWdtZW50JykuY3NzKCd3aWR0aCcsIHByb2dyZXNzX2Jhcl9sZW5ndGggKyAnJScpO1xuICAgICAgfVxuXG4gICAgICAkaGFuZGxlX3BhcmVudC5hdHRyKHRoaXMuYXR0cl9uYW1lKCksIHZhbHVlKS50cmlnZ2VyKCdjaGFuZ2UuZm5kdG4uc2xpZGVyJyk7XG5cbiAgICAgICRoaWRkZW5faW5wdXRzLnZhbCh2YWx1ZSk7XG4gICAgICBpZiAoc2V0dGluZ3MudHJpZ2dlcl9pbnB1dF9jaGFuZ2UpIHtcbiAgICAgICAgICAkaGlkZGVuX2lucHV0cy50cmlnZ2VyKCdjaGFuZ2UuZm5kdG4uc2xpZGVyJyk7XG4gICAgICB9XG5cbiAgICAgIGlmICghJGhhbmRsZVswXS5oYXNBdHRyaWJ1dGUoJ2FyaWEtdmFsdWVtaW4nKSkge1xuICAgICAgICAkaGFuZGxlLmF0dHIoe1xuICAgICAgICAgICdhcmlhLXZhbHVlbWluJyA6IHNldHRpbmdzLnN0YXJ0LFxuICAgICAgICAgICdhcmlhLXZhbHVlbWF4JyA6IHNldHRpbmdzLmVuZFxuICAgICAgICB9KTtcbiAgICAgIH1cbiAgICAgICRoYW5kbGUuYXR0cignYXJpYS12YWx1ZW5vdycsIHZhbHVlKTtcblxuICAgICAgaWYgKHNldHRpbmdzLmRpc3BsYXlfc2VsZWN0b3IgIT0gJycpIHtcbiAgICAgICAgJChzZXR0aW5ncy5kaXNwbGF5X3NlbGVjdG9yKS5lYWNoKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICBpZiAodGhpcy5oYXNBdHRyaWJ1dGUoJ3ZhbHVlJykpIHtcbiAgICAgICAgICAgICQodGhpcykudmFsKHZhbHVlKTtcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgJCh0aGlzKS50ZXh0KHZhbHVlKTtcbiAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgICAgfVxuXG4gICAgfSxcblxuICAgIG5vcm1hbGl6ZWRfcGVyY2VudGFnZSA6IGZ1bmN0aW9uICh2YWwsIHN0YXJ0LCBlbmQpIHtcbiAgICAgIHJldHVybiBNYXRoLm1pbigxLCAodmFsIC0gc3RhcnQpIC8gKGVuZCAtIHN0YXJ0KSk7XG4gICAgfSxcblxuICAgIG5vcm1hbGl6ZWRfdmFsdWUgOiBmdW5jdGlvbiAodmFsLCBzdGFydCwgZW5kLCBzdGVwLCBwcmVjaXNpb24pIHtcbiAgICAgIHZhciByYW5nZSA9IGVuZCAtIHN0YXJ0LFxuICAgICAgICAgIHBvaW50ID0gdmFsICogcmFuZ2UsXG4gICAgICAgICAgbW9kID0gKHBvaW50IC0gKHBvaW50ICUgc3RlcCkpIC8gc3RlcCxcbiAgICAgICAgICByZW0gPSBwb2ludCAlIHN0ZXAsXG4gICAgICAgICAgcm91bmQgPSAoIHJlbSA+PSBzdGVwICogMC41ID8gc3RlcCA6IDApO1xuICAgICAgcmV0dXJuICgobW9kICogc3RlcCArIHJvdW5kKSArIHN0YXJ0KS50b0ZpeGVkKHByZWNpc2lvbik7XG4gICAgfSxcblxuICAgIHNldF90cmFuc2xhdGUgOiBmdW5jdGlvbiAoZWxlLCBvZmZzZXQsIHZlcnRpY2FsKSB7XG4gICAgICBpZiAodmVydGljYWwpIHtcbiAgICAgICAgJChlbGUpXG4gICAgICAgICAgLmNzcygnLXdlYmtpdC10cmFuc2Zvcm0nLCAndHJhbnNsYXRlWSgnICsgb2Zmc2V0ICsgJ3B4KScpXG4gICAgICAgICAgLmNzcygnLW1vei10cmFuc2Zvcm0nLCAndHJhbnNsYXRlWSgnICsgb2Zmc2V0ICsgJ3B4KScpXG4gICAgICAgICAgLmNzcygnLW1zLXRyYW5zZm9ybScsICd0cmFuc2xhdGVZKCcgKyBvZmZzZXQgKyAncHgpJylcbiAgICAgICAgICAuY3NzKCctby10cmFuc2Zvcm0nLCAndHJhbnNsYXRlWSgnICsgb2Zmc2V0ICsgJ3B4KScpXG4gICAgICAgICAgLmNzcygndHJhbnNmb3JtJywgJ3RyYW5zbGF0ZVkoJyArIG9mZnNldCArICdweCknKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgICQoZWxlKVxuICAgICAgICAgIC5jc3MoJy13ZWJraXQtdHJhbnNmb3JtJywgJ3RyYW5zbGF0ZVgoJyArIG9mZnNldCArICdweCknKVxuICAgICAgICAgIC5jc3MoJy1tb3otdHJhbnNmb3JtJywgJ3RyYW5zbGF0ZVgoJyArIG9mZnNldCArICdweCknKVxuICAgICAgICAgIC5jc3MoJy1tcy10cmFuc2Zvcm0nLCAndHJhbnNsYXRlWCgnICsgb2Zmc2V0ICsgJ3B4KScpXG4gICAgICAgICAgLmNzcygnLW8tdHJhbnNmb3JtJywgJ3RyYW5zbGF0ZVgoJyArIG9mZnNldCArICdweCknKVxuICAgICAgICAgIC5jc3MoJ3RyYW5zZm9ybScsICd0cmFuc2xhdGVYKCcgKyBvZmZzZXQgKyAncHgpJyk7XG4gICAgICB9XG4gICAgfSxcblxuICAgIGxpbWl0X3RvIDogZnVuY3Rpb24gKHZhbCwgbWluLCBtYXgpIHtcbiAgICAgIHJldHVybiBNYXRoLm1pbihNYXRoLm1heCh2YWwsIG1pbiksIG1heCk7XG4gICAgfSxcblxuICAgIGluaXRpYWxpemVfc2V0dGluZ3MgOiBmdW5jdGlvbiAoaGFuZGxlKSB7XG4gICAgICB2YXIgc2V0dGluZ3MgPSAkLmV4dGVuZCh7fSwgdGhpcy5zZXR0aW5ncywgdGhpcy5kYXRhX29wdGlvbnMoJChoYW5kbGUpLnBhcmVudCgpKSksXG4gICAgICAgICAgZGVjaW1hbF9wbGFjZXNfbWF0Y2hfcmVzdWx0O1xuXG4gICAgICBpZiAoc2V0dGluZ3MucHJlY2lzaW9uID09PSBudWxsKSB7XG4gICAgICAgIGRlY2ltYWxfcGxhY2VzX21hdGNoX3Jlc3VsdCA9ICgnJyArIHNldHRpbmdzLnN0ZXApLm1hdGNoKC9cXC4oW1xcZF0qKS8pO1xuICAgICAgICBzZXR0aW5ncy5wcmVjaXNpb24gPSBkZWNpbWFsX3BsYWNlc19tYXRjaF9yZXN1bHQgJiYgZGVjaW1hbF9wbGFjZXNfbWF0Y2hfcmVzdWx0WzFdID8gZGVjaW1hbF9wbGFjZXNfbWF0Y2hfcmVzdWx0WzFdLmxlbmd0aCA6IDA7XG4gICAgICB9XG5cbiAgICAgIGlmIChzZXR0aW5ncy52ZXJ0aWNhbCkge1xuICAgICAgICAkLmRhdGEoaGFuZGxlLCAnYmFyX28nLCAkKGhhbmRsZSkucGFyZW50KCkub2Zmc2V0KCkudG9wKTtcbiAgICAgICAgJC5kYXRhKGhhbmRsZSwgJ2Jhcl9sJywgJChoYW5kbGUpLnBhcmVudCgpLm91dGVySGVpZ2h0KCkpO1xuICAgICAgICAkLmRhdGEoaGFuZGxlLCAnaGFuZGxlX28nLCAkKGhhbmRsZSkub2Zmc2V0KCkudG9wKTtcbiAgICAgICAgJC5kYXRhKGhhbmRsZSwgJ2hhbmRsZV9sJywgJChoYW5kbGUpLm91dGVySGVpZ2h0KCkpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgJC5kYXRhKGhhbmRsZSwgJ2Jhcl9vJywgJChoYW5kbGUpLnBhcmVudCgpLm9mZnNldCgpLmxlZnQpO1xuICAgICAgICAkLmRhdGEoaGFuZGxlLCAnYmFyX2wnLCAkKGhhbmRsZSkucGFyZW50KCkub3V0ZXJXaWR0aCgpKTtcbiAgICAgICAgJC5kYXRhKGhhbmRsZSwgJ2hhbmRsZV9vJywgJChoYW5kbGUpLm9mZnNldCgpLmxlZnQpO1xuICAgICAgICAkLmRhdGEoaGFuZGxlLCAnaGFuZGxlX2wnLCAkKGhhbmRsZSkub3V0ZXJXaWR0aCgpKTtcbiAgICAgIH1cblxuICAgICAgJC5kYXRhKGhhbmRsZSwgJ2JhcicsICQoaGFuZGxlKS5wYXJlbnQoKSk7XG4gICAgICByZXR1cm4gJC5kYXRhKGhhbmRsZSwgJ3NldHRpbmdzJywgc2V0dGluZ3MpO1xuICAgIH0sXG5cbiAgICBzZXRfaW5pdGlhbF9wb3NpdGlvbiA6IGZ1bmN0aW9uICgkZWxlKSB7XG4gICAgICB2YXIgc2V0dGluZ3MgPSAkLmRhdGEoJGVsZS5jaGlsZHJlbignLnJhbmdlLXNsaWRlci1oYW5kbGUnKVswXSwgJ3NldHRpbmdzJyksXG4gICAgICAgICAgaW5pdGlhbCA9ICgodHlwZW9mIHNldHRpbmdzLmluaXRpYWwgPT0gJ251bWJlcicgJiYgIWlzTmFOKHNldHRpbmdzLmluaXRpYWwpKSA/IHNldHRpbmdzLmluaXRpYWwgOiBNYXRoLmZsb29yKChzZXR0aW5ncy5lbmQgLSBzZXR0aW5ncy5zdGFydCkgKiAwLjUgLyBzZXR0aW5ncy5zdGVwKSAqIHNldHRpbmdzLnN0ZXAgKyBzZXR0aW5ncy5zdGFydCksXG4gICAgICAgICAgJGhhbmRsZSA9ICRlbGUuY2hpbGRyZW4oJy5yYW5nZS1zbGlkZXItaGFuZGxlJyk7XG4gICAgICB0aGlzLnNldF91aSgkaGFuZGxlLCBpbml0aWFsKTtcbiAgICB9LFxuXG4gICAgc2V0X3ZhbHVlIDogZnVuY3Rpb24gKHZhbHVlKSB7XG4gICAgICB2YXIgc2VsZiA9IHRoaXM7XG4gICAgICAkKCdbJyArIHNlbGYuYXR0cl9uYW1lKCkgKyAnXScsIHRoaXMuc2NvcGUpLmVhY2goZnVuY3Rpb24gKCkge1xuICAgICAgICAkKHRoaXMpLmF0dHIoc2VsZi5hdHRyX25hbWUoKSwgdmFsdWUpO1xuICAgICAgfSk7XG4gICAgICBpZiAoISEkKHRoaXMuc2NvcGUpLmF0dHIoc2VsZi5hdHRyX25hbWUoKSkpIHtcbiAgICAgICAgJCh0aGlzLnNjb3BlKS5hdHRyKHNlbGYuYXR0cl9uYW1lKCksIHZhbHVlKTtcbiAgICAgIH1cbiAgICAgIHNlbGYucmVmbG93KCk7XG4gICAgfSxcblxuICAgIHJlZmxvdyA6IGZ1bmN0aW9uICgpIHtcbiAgICAgIHZhciBzZWxmID0gdGhpcztcbiAgICAgIHNlbGYuUygnWycgKyB0aGlzLmF0dHJfbmFtZSgpICsgJ10nKS5lYWNoKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgdmFyIGhhbmRsZSA9ICQodGhpcykuY2hpbGRyZW4oJy5yYW5nZS1zbGlkZXItaGFuZGxlJylbMF0sXG4gICAgICAgICAgICB2YWwgPSAkKHRoaXMpLmF0dHIoc2VsZi5hdHRyX25hbWUoKSk7XG4gICAgICAgIHNlbGYuaW5pdGlhbGl6ZV9zZXR0aW5ncyhoYW5kbGUpO1xuXG4gICAgICAgIGlmICh2YWwpIHtcbiAgICAgICAgICBzZWxmLnNldF91aSgkKGhhbmRsZSksIHBhcnNlRmxvYXQodmFsKSk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgc2VsZi5zZXRfaW5pdGlhbF9wb3NpdGlvbigkKHRoaXMpKTtcbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgfVxuICB9O1xuXG59KGpRdWVyeSwgd2luZG93LCB3aW5kb3cuZG9jdW1lbnQpKTtcblxuOyhmdW5jdGlvbiAoJCwgd2luZG93LCBkb2N1bWVudCwgdW5kZWZpbmVkKSB7XG4gICd1c2Ugc3RyaWN0JztcblxuICBGb3VuZGF0aW9uLmxpYnMudGFiID0ge1xuICAgIG5hbWUgOiAndGFiJyxcblxuICAgIHZlcnNpb24gOiAnNS41LjInLFxuXG4gICAgc2V0dGluZ3MgOiB7XG4gICAgICBhY3RpdmVfY2xhc3MgOiAnYWN0aXZlJyxcbiAgICAgIGNhbGxiYWNrIDogZnVuY3Rpb24gKCkge30sXG4gICAgICBkZWVwX2xpbmtpbmcgOiBmYWxzZSxcbiAgICAgIHNjcm9sbF90b19jb250ZW50IDogdHJ1ZSxcbiAgICAgIGlzX2hvdmVyIDogZmFsc2VcbiAgICB9LFxuXG4gICAgZGVmYXVsdF90YWJfaGFzaGVzIDogW10sXG5cbiAgICBpbml0IDogZnVuY3Rpb24gKHNjb3BlLCBtZXRob2QsIG9wdGlvbnMpIHtcbiAgICAgIHZhciBzZWxmID0gdGhpcyxcbiAgICAgICAgICBTID0gdGhpcy5TO1xuXG5cdCAgLy8gU3RvcmUgdGhlIGRlZmF1bHQgYWN0aXZlIHRhYnMgd2hpY2ggd2lsbCBiZSByZWZlcmVuY2VkIHdoZW4gdGhlXG5cdCAgLy8gbG9jYXRpb24gaGFzaCBpcyBhYnNlbnQsIGFzIGluIHRoZSBjYXNlIG9mIG5hdmlnYXRpbmcgdGhlIHRhYnMgYW5kXG5cdCAgLy8gcmV0dXJuaW5nIHRvIHRoZSBmaXJzdCB2aWV3aW5nIHZpYSB0aGUgYnJvd3NlciBCYWNrIGJ1dHRvbi5cblx0ICBTKCdbJyArIHRoaXMuYXR0cl9uYW1lKCkgKyAnXSA+IC5hY3RpdmUgPiBhJywgdGhpcy5zY29wZSkuZWFjaChmdW5jdGlvbiAoKSB7XG5cdCAgICBzZWxmLmRlZmF1bHRfdGFiX2hhc2hlcy5wdXNoKHRoaXMuaGFzaCk7XG5cdCAgfSk7XG5cbiAgICAgIC8vIHN0b3JlIHRoZSBpbml0aWFsIGhyZWYsIHdoaWNoIGlzIHVzZWQgdG8gYWxsb3cgY29ycmVjdCBiZWhhdmlvdXIgb2YgdGhlXG4gICAgICAvLyBicm93c2VyIGJhY2sgYnV0dG9uIHdoZW4gZGVlcCBsaW5raW5nIGlzIHR1cm5lZCBvbi5cbiAgICAgIHNlbGYuZW50cnlfbG9jYXRpb24gPSB3aW5kb3cubG9jYXRpb24uaHJlZjtcblxuICAgICAgdGhpcy5iaW5kaW5ncyhtZXRob2QsIG9wdGlvbnMpO1xuICAgICAgdGhpcy5oYW5kbGVfbG9jYXRpb25faGFzaF9jaGFuZ2UoKTtcbiAgICB9LFxuXG4gICAgZXZlbnRzIDogZnVuY3Rpb24gKCkge1xuICAgICAgdmFyIHNlbGYgPSB0aGlzLFxuICAgICAgICAgIFMgPSB0aGlzLlM7XG5cbiAgICAgIHZhciB1c3VhbF90YWJfYmVoYXZpb3IgPSAgZnVuY3Rpb24gKGUsIHRhcmdldCkge1xuICAgICAgICAgIHZhciBzZXR0aW5ncyA9IFModGFyZ2V0KS5jbG9zZXN0KCdbJyArIHNlbGYuYXR0cl9uYW1lKCkgKyAnXScpLmRhdGEoc2VsZi5hdHRyX25hbWUodHJ1ZSkgKyAnLWluaXQnKTtcbiAgICAgICAgICBpZiAoIXNldHRpbmdzLmlzX2hvdmVyIHx8IE1vZGVybml6ci50b3VjaCkge1xuICAgICAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgICAgICAgZS5zdG9wUHJvcGFnYXRpb24oKTtcbiAgICAgICAgICAgIHNlbGYudG9nZ2xlX2FjdGl2ZV90YWIoUyh0YXJnZXQpLnBhcmVudCgpKTtcbiAgICAgICAgICB9XG4gICAgICAgIH07XG5cbiAgICAgIFModGhpcy5zY29wZSlcbiAgICAgICAgLm9mZignLnRhYicpXG4gICAgICAgIC8vIEtleSBldmVudDogZm9jdXMvdGFiIGtleVxuICAgICAgICAub24oJ2tleWRvd24uZm5kdG4udGFiJywgJ1snICsgdGhpcy5hdHRyX25hbWUoKSArICddID4gKiA+IGEnLCBmdW5jdGlvbihlKSB7XG4gICAgICAgICAgdmFyIGVsID0gdGhpcztcbiAgICAgICAgICB2YXIga2V5Q29kZSA9IGUua2V5Q29kZSB8fCBlLndoaWNoO1xuICAgICAgICAgICAgLy8gaWYgdXNlciBwcmVzc2VkIHRhYiBrZXlcbiAgICAgICAgICAgIGlmIChrZXlDb2RlID09IDkpIHsgXG4gICAgICAgICAgICAgIGUucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgICAgICAgLy8gVE9ETzogQ2hhbmdlIHVzdWFsX3RhYl9iZWhhdmlvciBpbnRvIGFjY2Vzc2liaWxpdHkgZnVuY3Rpb24/XG4gICAgICAgICAgICAgIHVzdWFsX3RhYl9iZWhhdmlvcihlLCBlbCk7XG4gICAgICAgICAgICB9IFxuICAgICAgICB9KVxuICAgICAgICAvLyBDbGljayBldmVudDogdGFiIHRpdGxlXG4gICAgICAgIC5vbignY2xpY2suZm5kdG4udGFiJywgJ1snICsgdGhpcy5hdHRyX25hbWUoKSArICddID4gKiA+IGEnLCBmdW5jdGlvbihlKSB7XG4gICAgICAgICAgdmFyIGVsID0gdGhpcztcbiAgICAgICAgICB1c3VhbF90YWJfYmVoYXZpb3IoZSwgZWwpO1xuICAgICAgICB9KVxuICAgICAgICAvLyBIb3ZlciBldmVudDogdGFiIHRpdGxlXG4gICAgICAgIC5vbignbW91c2VlbnRlci5mbmR0bi50YWInLCAnWycgKyB0aGlzLmF0dHJfbmFtZSgpICsgJ10gPiAqID4gYScsIGZ1bmN0aW9uIChlKSB7XG4gICAgICAgICAgdmFyIHNldHRpbmdzID0gUyh0aGlzKS5jbG9zZXN0KCdbJyArIHNlbGYuYXR0cl9uYW1lKCkgKyAnXScpLmRhdGEoc2VsZi5hdHRyX25hbWUodHJ1ZSkgKyAnLWluaXQnKTtcbiAgICAgICAgICBpZiAoc2V0dGluZ3MuaXNfaG92ZXIpIHtcbiAgICAgICAgICAgIHNlbGYudG9nZ2xlX2FjdGl2ZV90YWIoUyh0aGlzKS5wYXJlbnQoKSk7XG4gICAgICAgICAgfVxuICAgICAgICB9KTtcblxuICAgICAgLy8gTG9jYXRpb24gaGFzaCBjaGFuZ2UgZXZlbnRcbiAgICAgIFMod2luZG93KS5vbignaGFzaGNoYW5nZS5mbmR0bi50YWInLCBmdW5jdGlvbiAoZSkge1xuICAgICAgICBlLnByZXZlbnREZWZhdWx0KCk7XG4gICAgICAgIHNlbGYuaGFuZGxlX2xvY2F0aW9uX2hhc2hfY2hhbmdlKCk7XG4gICAgICB9KTtcbiAgICB9LFxuXG4gICAgaGFuZGxlX2xvY2F0aW9uX2hhc2hfY2hhbmdlIDogZnVuY3Rpb24gKCkge1xuXG4gICAgICB2YXIgc2VsZiA9IHRoaXMsXG4gICAgICAgICAgUyA9IHRoaXMuUztcblxuICAgICAgUygnWycgKyB0aGlzLmF0dHJfbmFtZSgpICsgJ10nLCB0aGlzLnNjb3BlKS5lYWNoKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgdmFyIHNldHRpbmdzID0gUyh0aGlzKS5kYXRhKHNlbGYuYXR0cl9uYW1lKHRydWUpICsgJy1pbml0Jyk7XG4gICAgICAgIGlmIChzZXR0aW5ncy5kZWVwX2xpbmtpbmcpIHtcbiAgICAgICAgICAvLyBNYXRjaCB0aGUgbG9jYXRpb24gaGFzaCB0byBhIGxhYmVsXG4gICAgICAgICAgdmFyIGhhc2g7XG4gICAgICAgICAgaWYgKHNldHRpbmdzLnNjcm9sbF90b19jb250ZW50KSB7XG4gICAgICAgICAgICBoYXNoID0gc2VsZi5zY29wZS5sb2NhdGlvbi5oYXNoO1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAvLyBwcmVmaXggdGhlIGhhc2ggdG8gcHJldmVudCBhbmNob3Igc2Nyb2xsaW5nXG4gICAgICAgICAgICBoYXNoID0gc2VsZi5zY29wZS5sb2NhdGlvbi5oYXNoLnJlcGxhY2UoJ2ZuZHRuLScsICcnKTtcbiAgICAgICAgICB9XG4gICAgICAgICAgaWYgKGhhc2ggIT0gJycpIHtcbiAgICAgICAgICAgIC8vIENoZWNrIHdoZXRoZXIgdGhlIGxvY2F0aW9uIGhhc2ggcmVmZXJlbmNlcyBhIHRhYiBjb250ZW50IGRpdiBvclxuICAgICAgICAgICAgLy8gYW5vdGhlciBlbGVtZW50IG9uIHRoZSBwYWdlIChpbnNpZGUgb3Igb3V0c2lkZSB0aGUgdGFiIGNvbnRlbnQgZGl2KVxuICAgICAgICAgICAgdmFyIGhhc2hfZWxlbWVudCA9IFMoaGFzaCk7XG4gICAgICAgICAgICBpZiAoaGFzaF9lbGVtZW50Lmhhc0NsYXNzKCdjb250ZW50JykgJiYgaGFzaF9lbGVtZW50LnBhcmVudCgpLmhhc0NsYXNzKCd0YWJzLWNvbnRlbnQnKSkge1xuICAgICAgICAgICAgICAvLyBUYWIgY29udGVudCBkaXZcbiAgICAgICAgICAgICAgc2VsZi50b2dnbGVfYWN0aXZlX3RhYigkKCdbJyArIHNlbGYuYXR0cl9uYW1lKCkgKyAnXSA+ICogPiBhW2hyZWY9JyArIGhhc2ggKyAnXScpLnBhcmVudCgpKTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgIC8vIE5vdCB0aGUgdGFiIGNvbnRlbnQgZGl2LiBJZiBpbnNpZGUgdGhlIHRhYiBjb250ZW50LCBmaW5kIHRoZVxuICAgICAgICAgICAgICAvLyBjb250YWluaW5nIHRhYiBhbmQgdG9nZ2xlIGl0IGFzIGFjdGl2ZS5cbiAgICAgICAgICAgICAgdmFyIGhhc2hfdGFiX2NvbnRhaW5lcl9pZCA9IGhhc2hfZWxlbWVudC5jbG9zZXN0KCcuY29udGVudCcpLmF0dHIoJ2lkJyk7XG4gICAgICAgICAgICAgIGlmIChoYXNoX3RhYl9jb250YWluZXJfaWQgIT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICAgICAgc2VsZi50b2dnbGVfYWN0aXZlX3RhYigkKCdbJyArIHNlbGYuYXR0cl9uYW1lKCkgKyAnXSA+ICogPiBhW2hyZWY9IycgKyBoYXNoX3RhYl9jb250YWluZXJfaWQgKyAnXScpLnBhcmVudCgpLCBoYXNoKTtcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAvLyBSZWZlcmVuY2UgdGhlIGRlZmF1bHQgdGFiIGhhc2hlcyB3aGljaCB3ZXJlIGluaXRpYWxpemVkIGluIHRoZSBpbml0IGZ1bmN0aW9uXG4gICAgICAgICAgICBmb3IgKHZhciBpbmQgPSAwOyBpbmQgPCBzZWxmLmRlZmF1bHRfdGFiX2hhc2hlcy5sZW5ndGg7IGluZCsrKSB7XG4gICAgICAgICAgICAgIHNlbGYudG9nZ2xlX2FjdGl2ZV90YWIoJCgnWycgKyBzZWxmLmF0dHJfbmFtZSgpICsgJ10gPiAqID4gYVtocmVmPScgKyBzZWxmLmRlZmF1bHRfdGFiX2hhc2hlc1tpbmRdICsgJ10nKS5wYXJlbnQoKSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgfSk7XG4gICAgIH0sXG5cbiAgICB0b2dnbGVfYWN0aXZlX3RhYiA6IGZ1bmN0aW9uICh0YWIsIGxvY2F0aW9uX2hhc2gpIHtcbiAgICAgIHZhciBzZWxmID0gdGhpcyxcbiAgICAgICAgICBTID0gc2VsZi5TLFxuICAgICAgICAgIHRhYnMgPSB0YWIuY2xvc2VzdCgnWycgKyB0aGlzLmF0dHJfbmFtZSgpICsgJ10nKSxcbiAgICAgICAgICB0YWJfbGluayA9IHRhYi5maW5kKCdhJyksXG4gICAgICAgICAgYW5jaG9yID0gdGFiLmNoaWxkcmVuKCdhJykuZmlyc3QoKSxcbiAgICAgICAgICB0YXJnZXRfaGFzaCA9ICcjJyArIGFuY2hvci5hdHRyKCdocmVmJykuc3BsaXQoJyMnKVsxXSxcbiAgICAgICAgICB0YXJnZXQgPSBTKHRhcmdldF9oYXNoKSxcbiAgICAgICAgICBzaWJsaW5ncyA9IHRhYi5zaWJsaW5ncygpLFxuICAgICAgICAgIHNldHRpbmdzID0gdGFicy5kYXRhKHRoaXMuYXR0cl9uYW1lKHRydWUpICsgJy1pbml0JyksXG4gICAgICAgICAgaW50ZXJwcmV0X2tleXVwX2FjdGlvbiA9IGZ1bmN0aW9uIChlKSB7XG4gICAgICAgICAgICAvLyBMaWdodCBtb2RpZmljYXRpb24gb2YgSGV5ZG9uIFBpY2tlcmluZydzIFByYWN0aWNhbCBBUklBIEV4YW1wbGVzOiBodHRwOi8vaGV5ZG9ud29ya3MuY29tL3ByYWN0aWNhbF9hcmlhX2V4YW1wbGVzL2pzL2ExMXkuanNcblxuICAgICAgICAgICAgLy8gZGVmaW5lIGN1cnJlbnQsIHByZXZpb3VzIGFuZCBuZXh0IChwb3NzaWJsZSkgdGFic1xuXG4gICAgICAgICAgICB2YXIgJG9yaWdpbmFsID0gJCh0aGlzKTtcbiAgICAgICAgICAgIHZhciAkcHJldiA9ICQodGhpcykucGFyZW50cygnbGknKS5wcmV2KCkuY2hpbGRyZW4oJ1tyb2xlPVwidGFiXCJdJyk7XG4gICAgICAgICAgICB2YXIgJG5leHQgPSAkKHRoaXMpLnBhcmVudHMoJ2xpJykubmV4dCgpLmNoaWxkcmVuKCdbcm9sZT1cInRhYlwiXScpO1xuICAgICAgICAgICAgdmFyICR0YXJnZXQ7XG5cbiAgICAgICAgICAgIC8vIGZpbmQgdGhlIGRpcmVjdGlvbiAocHJldiBvciBuZXh0KVxuXG4gICAgICAgICAgICBzd2l0Y2ggKGUua2V5Q29kZSkge1xuICAgICAgICAgICAgICBjYXNlIDM3OlxuICAgICAgICAgICAgICAgICR0YXJnZXQgPSAkcHJldjtcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgY2FzZSAzOTpcbiAgICAgICAgICAgICAgICAkdGFyZ2V0ID0gJG5leHQ7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgIGRlZmF1bHQ6XG4gICAgICAgICAgICAgICAgJHRhcmdldCA9IGZhbHNlXG4gICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgaWYgKCR0YXJnZXQubGVuZ3RoKSB7XG4gICAgICAgICAgICAgICRvcmlnaW5hbC5hdHRyKHtcbiAgICAgICAgICAgICAgICAndGFiaW5kZXgnIDogJy0xJyxcbiAgICAgICAgICAgICAgICAnYXJpYS1zZWxlY3RlZCcgOiBudWxsXG4gICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAkdGFyZ2V0LmF0dHIoe1xuICAgICAgICAgICAgICAgICd0YWJpbmRleCcgOiAnMCcsXG4gICAgICAgICAgICAgICAgJ2FyaWEtc2VsZWN0ZWQnIDogdHJ1ZVxuICAgICAgICAgICAgICB9KS5mb2N1cygpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAvLyBIaWRlIHBhbmVsc1xuXG4gICAgICAgICAgICAkKCdbcm9sZT1cInRhYnBhbmVsXCJdJylcbiAgICAgICAgICAgICAgLmF0dHIoJ2FyaWEtaGlkZGVuJywgJ3RydWUnKTtcblxuICAgICAgICAgICAgLy8gU2hvdyBwYW5lbCB3aGljaCBjb3JyZXNwb25kcyB0byB0YXJnZXRcblxuICAgICAgICAgICAgJCgnIycgKyAkKGRvY3VtZW50LmFjdGl2ZUVsZW1lbnQpLmF0dHIoJ2hyZWYnKS5zdWJzdHJpbmcoMSkpXG4gICAgICAgICAgICAgIC5hdHRyKCdhcmlhLWhpZGRlbicsIG51bGwpO1xuXG4gICAgICAgICAgfSxcbiAgICAgICAgICBnb190b19oYXNoID0gZnVuY3Rpb24oaGFzaCkge1xuICAgICAgICAgICAgLy8gVGhpcyBmdW5jdGlvbiBhbGxvd3MgY29ycmVjdCBiZWhhdmlvdXIgb2YgdGhlIGJyb3dzZXIncyBiYWNrIGJ1dHRvbiB3aGVuIGRlZXAgbGlua2luZyBpcyBlbmFibGVkLiBXaXRob3V0IGl0XG4gICAgICAgICAgICAvLyB0aGUgdXNlciB3b3VsZCBnZXQgY29udGludWFsbHkgcmVkaXJlY3RlZCB0byB0aGUgZGVmYXVsdCBoYXNoLlxuICAgICAgICAgICAgdmFyIGlzX2VudHJ5X2xvY2F0aW9uID0gd2luZG93LmxvY2F0aW9uLmhyZWYgPT09IHNlbGYuZW50cnlfbG9jYXRpb24sXG4gICAgICAgICAgICAgICAgZGVmYXVsdF9oYXNoID0gc2V0dGluZ3Muc2Nyb2xsX3RvX2NvbnRlbnQgPyBzZWxmLmRlZmF1bHRfdGFiX2hhc2hlc1swXSA6IGlzX2VudHJ5X2xvY2F0aW9uID8gd2luZG93LmxvY2F0aW9uLmhhc2ggOidmbmR0bi0nICsgc2VsZi5kZWZhdWx0X3RhYl9oYXNoZXNbMF0ucmVwbGFjZSgnIycsICcnKVxuXG4gICAgICAgICAgICBpZiAoIShpc19lbnRyeV9sb2NhdGlvbiAmJiBoYXNoID09PSBkZWZhdWx0X2hhc2gpKSB7XG4gICAgICAgICAgICAgIHdpbmRvdy5sb2NhdGlvbi5oYXNoID0gaGFzaDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9O1xuXG4gICAgICAvLyBhbGxvdyB1c2FnZSBvZiBkYXRhLXRhYi1jb250ZW50IGF0dHJpYnV0ZSBpbnN0ZWFkIG9mIGhyZWZcbiAgICAgIGlmIChhbmNob3IuZGF0YSgndGFiLWNvbnRlbnQnKSkge1xuICAgICAgICB0YXJnZXRfaGFzaCA9ICcjJyArIGFuY2hvci5kYXRhKCd0YWItY29udGVudCcpLnNwbGl0KCcjJylbMV07XG4gICAgICAgIHRhcmdldCA9IFModGFyZ2V0X2hhc2gpO1xuICAgICAgfVxuXG4gICAgICBpZiAoc2V0dGluZ3MuZGVlcF9saW5raW5nKSB7XG5cbiAgICAgICAgaWYgKHNldHRpbmdzLnNjcm9sbF90b19jb250ZW50KSB7XG5cbiAgICAgICAgICAvLyByZXRhaW4gY3VycmVudCBoYXNoIHRvIHNjcm9sbCB0byBjb250ZW50XG4gICAgICAgICAgZ29fdG9faGFzaChsb2NhdGlvbl9oYXNoIHx8IHRhcmdldF9oYXNoKTtcblxuICAgICAgICAgIGlmIChsb2NhdGlvbl9oYXNoID09IHVuZGVmaW5lZCB8fCBsb2NhdGlvbl9oYXNoID09IHRhcmdldF9oYXNoKSB7XG4gICAgICAgICAgICB0YWIucGFyZW50KClbMF0uc2Nyb2xsSW50b1ZpZXcoKTtcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgUyh0YXJnZXRfaGFzaClbMF0uc2Nyb2xsSW50b1ZpZXcoKTtcbiAgICAgICAgICB9XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgLy8gcHJlZml4IHRoZSBoYXNoZXMgc28gdGhhdCB0aGUgYnJvd3NlciBkb2Vzbid0IHNjcm9sbCBkb3duXG4gICAgICAgICAgaWYgKGxvY2F0aW9uX2hhc2ggIT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICBnb190b19oYXNoKCdmbmR0bi0nICsgbG9jYXRpb25faGFzaC5yZXBsYWNlKCcjJywgJycpKTtcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgZ29fdG9faGFzaCgnZm5kdG4tJyArIHRhcmdldF9oYXNoLnJlcGxhY2UoJyMnLCAnJykpO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICAvLyBXQVJOSU5HOiBUaGUgYWN0aXZhdGlvbiBhbmQgZGVhY3RpdmF0aW9uIG9mIHRoZSB0YWIgY29udGVudCBtdXN0XG4gICAgICAvLyBvY2N1ciBhZnRlciB0aGUgZGVlcCBsaW5raW5nIGluIG9yZGVyIHRvIHByb3Blcmx5IHJlZnJlc2ggdGhlIGJyb3dzZXJcbiAgICAgIC8vIHdpbmRvdyAobm90YWJseSBpbiBDaHJvbWUpLlxuICAgICAgLy8gQ2xlYW4gdXAgbXVsdGlwbGUgYXR0ciBpbnN0YW5jZXMgdG8gZG9uZSBvbmNlXG4gICAgICB0YWIuYWRkQ2xhc3Moc2V0dGluZ3MuYWN0aXZlX2NsYXNzKS50cmlnZ2VySGFuZGxlcignb3BlbmVkJyk7XG4gICAgICB0YWJfbGluay5hdHRyKHsnYXJpYS1zZWxlY3RlZCcgOiAndHJ1ZScsICB0YWJpbmRleCA6IDB9KTtcbiAgICAgIHNpYmxpbmdzLnJlbW92ZUNsYXNzKHNldHRpbmdzLmFjdGl2ZV9jbGFzcylcbiAgICAgIHNpYmxpbmdzLmZpbmQoJ2EnKS5hdHRyKHsnYXJpYS1zZWxlY3RlZCcgOiAnZmFsc2UnLCAgdGFiaW5kZXggOiAtMX0pO1xuICAgICAgdGFyZ2V0LnNpYmxpbmdzKCkucmVtb3ZlQ2xhc3Moc2V0dGluZ3MuYWN0aXZlX2NsYXNzKS5hdHRyKHsnYXJpYS1oaWRkZW4nIDogJ3RydWUnLCAgdGFiaW5kZXggOiAtMX0pO1xuICAgICAgdGFyZ2V0LmFkZENsYXNzKHNldHRpbmdzLmFjdGl2ZV9jbGFzcykuYXR0cignYXJpYS1oaWRkZW4nLCAnZmFsc2UnKS5yZW1vdmVBdHRyKCd0YWJpbmRleCcpO1xuICAgICAgc2V0dGluZ3MuY2FsbGJhY2sodGFiKTtcbiAgICAgIHRhcmdldC50cmlnZ2VySGFuZGxlcigndG9nZ2xlZCcsIFt0YXJnZXRdKTtcbiAgICAgIHRhYnMudHJpZ2dlckhhbmRsZXIoJ3RvZ2dsZWQnLCBbdGFiXSk7XG5cbiAgICAgIHRhYl9saW5rLm9mZigna2V5ZG93bicpLm9uKCdrZXlkb3duJywgaW50ZXJwcmV0X2tleXVwX2FjdGlvbiApO1xuICAgIH0sXG5cbiAgICBkYXRhX2F0dHIgOiBmdW5jdGlvbiAoc3RyKSB7XG4gICAgICBpZiAodGhpcy5uYW1lc3BhY2UubGVuZ3RoID4gMCkge1xuICAgICAgICByZXR1cm4gdGhpcy5uYW1lc3BhY2UgKyAnLScgKyBzdHI7XG4gICAgICB9XG5cbiAgICAgIHJldHVybiBzdHI7XG4gICAgfSxcblxuICAgIG9mZiA6IGZ1bmN0aW9uICgpIHt9LFxuXG4gICAgcmVmbG93IDogZnVuY3Rpb24gKCkge31cbiAgfTtcbn0oalF1ZXJ5LCB3aW5kb3csIHdpbmRvdy5kb2N1bWVudCkpO1xuXG47KGZ1bmN0aW9uICgkLCB3aW5kb3csIGRvY3VtZW50LCB1bmRlZmluZWQpIHtcbiAgJ3VzZSBzdHJpY3QnO1xuXG4gIEZvdW5kYXRpb24ubGlicy50b29sdGlwID0ge1xuICAgIG5hbWUgOiAndG9vbHRpcCcsXG5cbiAgICB2ZXJzaW9uIDogJzUuNS4yJyxcblxuICAgIHNldHRpbmdzIDoge1xuICAgICAgYWRkaXRpb25hbF9pbmhlcml0YWJsZV9jbGFzc2VzIDogW10sXG4gICAgICB0b29sdGlwX2NsYXNzIDogJy50b29sdGlwJyxcbiAgICAgIGFwcGVuZF90byA6ICdib2R5JyxcbiAgICAgIHRvdWNoX2Nsb3NlX3RleHQgOiAnVGFwIFRvIENsb3NlJyxcbiAgICAgIGRpc2FibGVfZm9yX3RvdWNoIDogZmFsc2UsXG4gICAgICBob3Zlcl9kZWxheSA6IDIwMCxcbiAgICAgIHNob3dfb24gOiAnYWxsJyxcbiAgICAgIHRpcF90ZW1wbGF0ZSA6IGZ1bmN0aW9uIChzZWxlY3RvciwgY29udGVudCkge1xuICAgICAgICByZXR1cm4gJzxzcGFuIGRhdGEtc2VsZWN0b3I9XCInICsgc2VsZWN0b3IgKyAnXCIgaWQ9XCInICsgc2VsZWN0b3IgKyAnXCIgY2xhc3M9XCInXG4gICAgICAgICAgKyBGb3VuZGF0aW9uLmxpYnMudG9vbHRpcC5zZXR0aW5ncy50b29sdGlwX2NsYXNzLnN1YnN0cmluZygxKVxuICAgICAgICAgICsgJ1wiIHJvbGU9XCJ0b29sdGlwXCI+JyArIGNvbnRlbnQgKyAnPHNwYW4gY2xhc3M9XCJudWJcIj48L3NwYW4+PC9zcGFuPic7XG4gICAgICB9XG4gICAgfSxcblxuICAgIGNhY2hlIDoge30sXG5cbiAgICBpbml0IDogZnVuY3Rpb24gKHNjb3BlLCBtZXRob2QsIG9wdGlvbnMpIHtcbiAgICAgIEZvdW5kYXRpb24uaW5oZXJpdCh0aGlzLCAncmFuZG9tX3N0cicpO1xuICAgICAgdGhpcy5iaW5kaW5ncyhtZXRob2QsIG9wdGlvbnMpO1xuICAgIH0sXG5cbiAgICBzaG91bGRfc2hvdyA6IGZ1bmN0aW9uICh0YXJnZXQsIHRpcCkge1xuICAgICAgdmFyIHNldHRpbmdzID0gJC5leHRlbmQoe30sIHRoaXMuc2V0dGluZ3MsIHRoaXMuZGF0YV9vcHRpb25zKHRhcmdldCkpO1xuXG4gICAgICBpZiAoc2V0dGluZ3Muc2hvd19vbiA9PT0gJ2FsbCcpIHtcbiAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICB9IGVsc2UgaWYgKHRoaXMuc21hbGwoKSAmJiBzZXR0aW5ncy5zaG93X29uID09PSAnc21hbGwnKSB7XG4gICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgfSBlbHNlIGlmICh0aGlzLm1lZGl1bSgpICYmIHNldHRpbmdzLnNob3dfb24gPT09ICdtZWRpdW0nKSB7XG4gICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgfSBlbHNlIGlmICh0aGlzLmxhcmdlKCkgJiYgc2V0dGluZ3Muc2hvd19vbiA9PT0gJ2xhcmdlJykge1xuICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgIH1cbiAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9LFxuXG4gICAgbWVkaXVtIDogZnVuY3Rpb24gKCkge1xuICAgICAgcmV0dXJuIG1hdGNoTWVkaWEoRm91bmRhdGlvbi5tZWRpYV9xdWVyaWVzWydtZWRpdW0nXSkubWF0Y2hlcztcbiAgICB9LFxuXG4gICAgbGFyZ2UgOiBmdW5jdGlvbiAoKSB7XG4gICAgICByZXR1cm4gbWF0Y2hNZWRpYShGb3VuZGF0aW9uLm1lZGlhX3F1ZXJpZXNbJ2xhcmdlJ10pLm1hdGNoZXM7XG4gICAgfSxcblxuICAgIGV2ZW50cyA6IGZ1bmN0aW9uIChpbnN0YW5jZSkge1xuICAgICAgdmFyIHNlbGYgPSB0aGlzLFxuICAgICAgICAgIFMgPSBzZWxmLlM7XG5cbiAgICAgIHNlbGYuY3JlYXRlKHRoaXMuUyhpbnN0YW5jZSkpO1xuXG4gICAgICBmdW5jdGlvbiBfc3RhcnRTaG93KGVsdCwgJHRoaXMsIGltbWVkaWF0ZSkge1xuICAgICAgICBpZiAoZWx0LnRpbWVyKSB7XG4gICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKGltbWVkaWF0ZSkge1xuICAgICAgICAgIGVsdC50aW1lciA9IG51bGw7XG4gICAgICAgICAgc2VsZi5zaG93VGlwKCR0aGlzKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBlbHQudGltZXIgPSBzZXRUaW1lb3V0KGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIGVsdC50aW1lciA9IG51bGw7XG4gICAgICAgICAgICBzZWxmLnNob3dUaXAoJHRoaXMpO1xuICAgICAgICAgIH0uYmluZChlbHQpLCBzZWxmLnNldHRpbmdzLmhvdmVyX2RlbGF5KTtcbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICBmdW5jdGlvbiBfc3RhcnRIaWRlKGVsdCwgJHRoaXMpIHtcbiAgICAgICAgaWYgKGVsdC50aW1lcikge1xuICAgICAgICAgIGNsZWFyVGltZW91dChlbHQudGltZXIpO1xuICAgICAgICAgIGVsdC50aW1lciA9IG51bGw7XG4gICAgICAgIH1cblxuICAgICAgICBzZWxmLmhpZGUoJHRoaXMpO1xuICAgICAgfVxuXG4gICAgICAkKHRoaXMuc2NvcGUpXG4gICAgICAgIC5vZmYoJy50b29sdGlwJylcbiAgICAgICAgLm9uKCdtb3VzZWVudGVyLmZuZHRuLnRvb2x0aXAgbW91c2VsZWF2ZS5mbmR0bi50b29sdGlwIHRvdWNoc3RhcnQuZm5kdG4udG9vbHRpcCBNU1BvaW50ZXJEb3duLmZuZHRuLnRvb2x0aXAnLFxuICAgICAgICAgICdbJyArIHRoaXMuYXR0cl9uYW1lKCkgKyAnXScsIGZ1bmN0aW9uIChlKSB7XG4gICAgICAgICAgdmFyICR0aGlzID0gUyh0aGlzKSxcbiAgICAgICAgICAgICAgc2V0dGluZ3MgPSAkLmV4dGVuZCh7fSwgc2VsZi5zZXR0aW5ncywgc2VsZi5kYXRhX29wdGlvbnMoJHRoaXMpKSxcbiAgICAgICAgICAgICAgaXNfdG91Y2ggPSBmYWxzZTtcblxuICAgICAgICAgIGlmIChNb2Rlcm5penIudG91Y2ggJiYgL3RvdWNoc3RhcnR8TVNQb2ludGVyRG93bi9pLnRlc3QoZS50eXBlKSAmJiBTKGUudGFyZ2V0KS5pcygnYScpKSB7XG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgaWYgKC9tb3VzZS9pLnRlc3QoZS50eXBlKSAmJiBzZWxmLmllX3RvdWNoKGUpKSB7XG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgICAgfVxuICAgICAgICAgIFxuICAgICAgICAgIGlmICgkdGhpcy5oYXNDbGFzcygnb3BlbicpKSB7XG4gICAgICAgICAgICBpZiAoTW9kZXJuaXpyLnRvdWNoICYmIC90b3VjaHN0YXJ0fE1TUG9pbnRlckRvd24vaS50ZXN0KGUudHlwZSkpIHtcbiAgICAgICAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgc2VsZi5oaWRlKCR0aGlzKTtcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgaWYgKHNldHRpbmdzLmRpc2FibGVfZm9yX3RvdWNoICYmIE1vZGVybml6ci50b3VjaCAmJiAvdG91Y2hzdGFydHxNU1BvaW50ZXJEb3duL2kudGVzdChlLnR5cGUpKSB7XG4gICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgIH0gZWxzZSBpZiAoIXNldHRpbmdzLmRpc2FibGVfZm9yX3RvdWNoICYmIE1vZGVybml6ci50b3VjaCAmJiAvdG91Y2hzdGFydHxNU1BvaW50ZXJEb3duL2kudGVzdChlLnR5cGUpKSB7XG4gICAgICAgICAgICAgIGUucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgICAgICAgUyhzZXR0aW5ncy50b29sdGlwX2NsYXNzICsgJy5vcGVuJykuaGlkZSgpO1xuICAgICAgICAgICAgICBpc190b3VjaCA9IHRydWU7XG4gICAgICAgICAgICAgIC8vIGNsb3NlIG90aGVyIG9wZW4gdG9vbHRpcHMgb24gdG91Y2hcbiAgICAgICAgICAgICAgaWYgKCQoJy5vcGVuWycgKyBzZWxmLmF0dHJfbmFtZSgpICsgJ10nKS5sZW5ndGggPiAwKSB7XG4gICAgICAgICAgICAgICB2YXIgcHJldk9wZW4gPSBTKCQoJy5vcGVuWycgKyBzZWxmLmF0dHJfbmFtZSgpICsgJ10nKVswXSk7XG4gICAgICAgICAgICAgICBzZWxmLmhpZGUocHJldk9wZW4pO1xuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGlmICgvZW50ZXJ8b3Zlci9pLnRlc3QoZS50eXBlKSkge1xuICAgICAgICAgICAgICBfc3RhcnRTaG93KHRoaXMsICR0aGlzKTtcblxuICAgICAgICAgICAgfSBlbHNlIGlmIChlLnR5cGUgPT09ICdtb3VzZW91dCcgfHwgZS50eXBlID09PSAnbW91c2VsZWF2ZScpIHtcbiAgICAgICAgICAgICAgX3N0YXJ0SGlkZSh0aGlzLCAkdGhpcyk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICBfc3RhcnRTaG93KHRoaXMsICR0aGlzLCB0cnVlKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgIH0pXG4gICAgICAgIC5vbignbW91c2VsZWF2ZS5mbmR0bi50b29sdGlwIHRvdWNoc3RhcnQuZm5kdG4udG9vbHRpcCBNU1BvaW50ZXJEb3duLmZuZHRuLnRvb2x0aXAnLCAnWycgKyB0aGlzLmF0dHJfbmFtZSgpICsgJ10ub3BlbicsIGZ1bmN0aW9uIChlKSB7XG4gICAgICAgICAgaWYgKC9tb3VzZS9pLnRlc3QoZS50eXBlKSAmJiBzZWxmLmllX3RvdWNoKGUpKSB7XG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgaWYgKCQodGhpcykuZGF0YSgndG9vbHRpcC1vcGVuLWV2ZW50LXR5cGUnKSA9PSAndG91Y2gnICYmIGUudHlwZSA9PSAnbW91c2VsZWF2ZScpIHtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICB9IGVsc2UgaWYgKCQodGhpcykuZGF0YSgndG9vbHRpcC1vcGVuLWV2ZW50LXR5cGUnKSA9PSAnbW91c2UnICYmIC9NU1BvaW50ZXJEb3dufHRvdWNoc3RhcnQvaS50ZXN0KGUudHlwZSkpIHtcbiAgICAgICAgICAgIHNlbGYuY29udmVydF90b190b3VjaCgkKHRoaXMpKTtcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgX3N0YXJ0SGlkZSh0aGlzLCAkKHRoaXMpKTtcbiAgICAgICAgICB9XG4gICAgICAgIH0pXG4gICAgICAgIC5vbignRE9NTm9kZVJlbW92ZWQgRE9NQXR0ck1vZGlmaWVkJywgJ1snICsgdGhpcy5hdHRyX25hbWUoKSArICddOm5vdChhKScsIGZ1bmN0aW9uIChlKSB7XG4gICAgICAgICAgX3N0YXJ0SGlkZSh0aGlzLCBTKHRoaXMpKTtcbiAgICAgICAgfSk7XG4gICAgfSxcblxuICAgIGllX3RvdWNoIDogZnVuY3Rpb24gKGUpIHtcbiAgICAgIC8vIEhvdyBkbyBJIGRpc3Rpbmd1aXNoIGJldHdlZW4gSUUxMSBhbmQgV2luZG93cyBQaG9uZSA4Pz8/Pz9cbiAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9LFxuXG4gICAgc2hvd1RpcCA6IGZ1bmN0aW9uICgkdGFyZ2V0KSB7XG4gICAgICB2YXIgJHRpcCA9IHRoaXMuZ2V0VGlwKCR0YXJnZXQpO1xuICAgICAgaWYgKHRoaXMuc2hvdWxkX3Nob3coJHRhcmdldCwgJHRpcCkpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuc2hvdygkdGFyZ2V0KTtcbiAgICAgIH1cbiAgICAgIHJldHVybjtcbiAgICB9LFxuXG4gICAgZ2V0VGlwIDogZnVuY3Rpb24gKCR0YXJnZXQpIHtcbiAgICAgIHZhciBzZWxlY3RvciA9IHRoaXMuc2VsZWN0b3IoJHRhcmdldCksXG4gICAgICAgICAgc2V0dGluZ3MgPSAkLmV4dGVuZCh7fSwgdGhpcy5zZXR0aW5ncywgdGhpcy5kYXRhX29wdGlvbnMoJHRhcmdldCkpLFxuICAgICAgICAgIHRpcCA9IG51bGw7XG5cbiAgICAgIGlmIChzZWxlY3Rvcikge1xuICAgICAgICB0aXAgPSB0aGlzLlMoJ3NwYW5bZGF0YS1zZWxlY3Rvcj1cIicgKyBzZWxlY3RvciArICdcIl0nICsgc2V0dGluZ3MudG9vbHRpcF9jbGFzcyk7XG4gICAgICB9XG5cbiAgICAgIHJldHVybiAodHlwZW9mIHRpcCA9PT0gJ29iamVjdCcpID8gdGlwIDogZmFsc2U7XG4gICAgfSxcblxuICAgIHNlbGVjdG9yIDogZnVuY3Rpb24gKCR0YXJnZXQpIHtcbiAgICAgIHZhciBkYXRhU2VsZWN0b3IgPSAkdGFyZ2V0LmF0dHIodGhpcy5hdHRyX25hbWUoKSkgfHwgJHRhcmdldC5hdHRyKCdkYXRhLXNlbGVjdG9yJyk7XG5cbiAgICAgIGlmICh0eXBlb2YgZGF0YVNlbGVjdG9yICE9ICdzdHJpbmcnKSB7XG4gICAgICAgIGRhdGFTZWxlY3RvciA9IHRoaXMucmFuZG9tX3N0cig2KTtcbiAgICAgICAgJHRhcmdldFxuICAgICAgICAgIC5hdHRyKCdkYXRhLXNlbGVjdG9yJywgZGF0YVNlbGVjdG9yKVxuICAgICAgICAgIC5hdHRyKCdhcmlhLWRlc2NyaWJlZGJ5JywgZGF0YVNlbGVjdG9yKTtcbiAgICAgIH1cblxuICAgICAgcmV0dXJuIGRhdGFTZWxlY3RvcjtcbiAgICB9LFxuXG4gICAgY3JlYXRlIDogZnVuY3Rpb24gKCR0YXJnZXQpIHtcbiAgICAgIHZhciBzZWxmID0gdGhpcyxcbiAgICAgICAgICBzZXR0aW5ncyA9ICQuZXh0ZW5kKHt9LCB0aGlzLnNldHRpbmdzLCB0aGlzLmRhdGFfb3B0aW9ucygkdGFyZ2V0KSksXG4gICAgICAgICAgdGlwX3RlbXBsYXRlID0gdGhpcy5zZXR0aW5ncy50aXBfdGVtcGxhdGU7XG5cbiAgICAgIGlmICh0eXBlb2Ygc2V0dGluZ3MudGlwX3RlbXBsYXRlID09PSAnc3RyaW5nJyAmJiB3aW5kb3cuaGFzT3duUHJvcGVydHkoc2V0dGluZ3MudGlwX3RlbXBsYXRlKSkge1xuICAgICAgICB0aXBfdGVtcGxhdGUgPSB3aW5kb3dbc2V0dGluZ3MudGlwX3RlbXBsYXRlXTtcbiAgICAgIH1cblxuICAgICAgdmFyICR0aXAgPSAkKHRpcF90ZW1wbGF0ZSh0aGlzLnNlbGVjdG9yKCR0YXJnZXQpLCAkKCc8ZGl2PjwvZGl2PicpLmh0bWwoJHRhcmdldC5hdHRyKCd0aXRsZScpKS5odG1sKCkpKSxcbiAgICAgICAgICBjbGFzc2VzID0gdGhpcy5pbmhlcml0YWJsZV9jbGFzc2VzKCR0YXJnZXQpO1xuXG4gICAgICAkdGlwLmFkZENsYXNzKGNsYXNzZXMpLmFwcGVuZFRvKHNldHRpbmdzLmFwcGVuZF90byk7XG5cbiAgICAgIGlmIChNb2Rlcm5penIudG91Y2gpIHtcbiAgICAgICAgJHRpcC5hcHBlbmQoJzxzcGFuIGNsYXNzPVwidGFwLXRvLWNsb3NlXCI+JyArIHNldHRpbmdzLnRvdWNoX2Nsb3NlX3RleHQgKyAnPC9zcGFuPicpO1xuICAgICAgICAkdGlwLm9uKCd0b3VjaHN0YXJ0LmZuZHRuLnRvb2x0aXAgTVNQb2ludGVyRG93bi5mbmR0bi50b29sdGlwJywgZnVuY3Rpb24gKGUpIHtcbiAgICAgICAgICBzZWxmLmhpZGUoJHRhcmdldCk7XG4gICAgICAgIH0pO1xuICAgICAgfVxuXG4gICAgICAkdGFyZ2V0LnJlbW92ZUF0dHIoJ3RpdGxlJykuYXR0cigndGl0bGUnLCAnJyk7XG4gICAgfSxcblxuICAgIHJlcG9zaXRpb24gOiBmdW5jdGlvbiAodGFyZ2V0LCB0aXAsIGNsYXNzZXMpIHtcbiAgICAgIHZhciB3aWR0aCwgbnViLCBudWJIZWlnaHQsIG51YldpZHRoLCBjb2x1bW4sIG9ialBvcztcblxuICAgICAgdGlwLmNzcygndmlzaWJpbGl0eScsICdoaWRkZW4nKS5zaG93KCk7XG5cbiAgICAgIHdpZHRoID0gdGFyZ2V0LmRhdGEoJ3dpZHRoJyk7XG4gICAgICBudWIgPSB0aXAuY2hpbGRyZW4oJy5udWInKTtcbiAgICAgIG51YkhlaWdodCA9IG51Yi5vdXRlckhlaWdodCgpO1xuICAgICAgbnViV2lkdGggPSBudWIub3V0ZXJIZWlnaHQoKTtcblxuICAgICAgaWYgKHRoaXMuc21hbGwoKSkge1xuICAgICAgICB0aXAuY3NzKHsnd2lkdGgnIDogJzEwMCUnfSk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB0aXAuY3NzKHsnd2lkdGgnIDogKHdpZHRoKSA/IHdpZHRoIDogJ2F1dG8nfSk7XG4gICAgICB9XG5cbiAgICAgIG9ialBvcyA9IGZ1bmN0aW9uIChvYmosIHRvcCwgcmlnaHQsIGJvdHRvbSwgbGVmdCwgd2lkdGgpIHtcbiAgICAgICAgcmV0dXJuIG9iai5jc3Moe1xuICAgICAgICAgICd0b3AnIDogKHRvcCkgPyB0b3AgOiAnYXV0bycsXG4gICAgICAgICAgJ2JvdHRvbScgOiAoYm90dG9tKSA/IGJvdHRvbSA6ICdhdXRvJyxcbiAgICAgICAgICAnbGVmdCcgOiAobGVmdCkgPyBsZWZ0IDogJ2F1dG8nLFxuICAgICAgICAgICdyaWdodCcgOiAocmlnaHQpID8gcmlnaHQgOiAnYXV0bydcbiAgICAgICAgfSkuZW5kKCk7XG4gICAgICB9O1xuXG4gICAgICBvYmpQb3ModGlwLCAodGFyZ2V0Lm9mZnNldCgpLnRvcCArIHRhcmdldC5vdXRlckhlaWdodCgpICsgMTApLCAnYXV0bycsICdhdXRvJywgdGFyZ2V0Lm9mZnNldCgpLmxlZnQpO1xuXG4gICAgICBpZiAodGhpcy5zbWFsbCgpKSB7XG4gICAgICAgIG9ialBvcyh0aXAsICh0YXJnZXQub2Zmc2V0KCkudG9wICsgdGFyZ2V0Lm91dGVySGVpZ2h0KCkgKyAxMCksICdhdXRvJywgJ2F1dG8nLCAxMi41LCAkKHRoaXMuc2NvcGUpLndpZHRoKCkpO1xuICAgICAgICB0aXAuYWRkQ2xhc3MoJ3RpcC1vdmVycmlkZScpO1xuICAgICAgICBvYmpQb3MobnViLCAtbnViSGVpZ2h0LCAnYXV0bycsICdhdXRvJywgdGFyZ2V0Lm9mZnNldCgpLmxlZnQpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdmFyIGxlZnQgPSB0YXJnZXQub2Zmc2V0KCkubGVmdDtcbiAgICAgICAgaWYgKEZvdW5kYXRpb24ucnRsKSB7XG4gICAgICAgICAgbnViLmFkZENsYXNzKCdydGwnKTtcbiAgICAgICAgICBsZWZ0ID0gdGFyZ2V0Lm9mZnNldCgpLmxlZnQgKyB0YXJnZXQub3V0ZXJXaWR0aCgpIC0gdGlwLm91dGVyV2lkdGgoKTtcbiAgICAgICAgfVxuXG4gICAgICAgIG9ialBvcyh0aXAsICh0YXJnZXQub2Zmc2V0KCkudG9wICsgdGFyZ2V0Lm91dGVySGVpZ2h0KCkgKyAxMCksICdhdXRvJywgJ2F1dG8nLCBsZWZ0KTtcbiAgICAgICAgLy8gcmVzZXQgbnViIGZyb20gc21hbGwgc3R5bGVzLCBpZiB0aGV5J3ZlIGJlZW4gYXBwbGllZFxuICAgICAgICBpZiAobnViLmF0dHIoJ3N0eWxlJykpIHtcbiAgICAgICAgICBudWIucmVtb3ZlQXR0cignc3R5bGUnKTtcbiAgICAgICAgfVxuICAgICAgICBcbiAgICAgICAgdGlwLnJlbW92ZUNsYXNzKCd0aXAtb3ZlcnJpZGUnKTtcbiAgICAgICAgaWYgKGNsYXNzZXMgJiYgY2xhc3Nlcy5pbmRleE9mKCd0aXAtdG9wJykgPiAtMSkge1xuICAgICAgICAgIGlmIChGb3VuZGF0aW9uLnJ0bCkge1xuICAgICAgICAgICAgbnViLmFkZENsYXNzKCdydGwnKTtcbiAgICAgICAgICB9XG4gICAgICAgICAgb2JqUG9zKHRpcCwgKHRhcmdldC5vZmZzZXQoKS50b3AgLSB0aXAub3V0ZXJIZWlnaHQoKSksICdhdXRvJywgJ2F1dG8nLCBsZWZ0KVxuICAgICAgICAgICAgLnJlbW92ZUNsYXNzKCd0aXAtb3ZlcnJpZGUnKTtcbiAgICAgICAgfSBlbHNlIGlmIChjbGFzc2VzICYmIGNsYXNzZXMuaW5kZXhPZigndGlwLWxlZnQnKSA+IC0xKSB7XG4gICAgICAgICAgb2JqUG9zKHRpcCwgKHRhcmdldC5vZmZzZXQoKS50b3AgKyAodGFyZ2V0Lm91dGVySGVpZ2h0KCkgLyAyKSAtICh0aXAub3V0ZXJIZWlnaHQoKSAvIDIpKSwgJ2F1dG8nLCAnYXV0bycsICh0YXJnZXQub2Zmc2V0KCkubGVmdCAtIHRpcC5vdXRlcldpZHRoKCkgLSBudWJIZWlnaHQpKVxuICAgICAgICAgICAgLnJlbW92ZUNsYXNzKCd0aXAtb3ZlcnJpZGUnKTtcbiAgICAgICAgICBudWIucmVtb3ZlQ2xhc3MoJ3J0bCcpO1xuICAgICAgICB9IGVsc2UgaWYgKGNsYXNzZXMgJiYgY2xhc3Nlcy5pbmRleE9mKCd0aXAtcmlnaHQnKSA+IC0xKSB7XG4gICAgICAgICAgb2JqUG9zKHRpcCwgKHRhcmdldC5vZmZzZXQoKS50b3AgKyAodGFyZ2V0Lm91dGVySGVpZ2h0KCkgLyAyKSAtICh0aXAub3V0ZXJIZWlnaHQoKSAvIDIpKSwgJ2F1dG8nLCAnYXV0bycsICh0YXJnZXQub2Zmc2V0KCkubGVmdCArIHRhcmdldC5vdXRlcldpZHRoKCkgKyBudWJIZWlnaHQpKVxuICAgICAgICAgICAgLnJlbW92ZUNsYXNzKCd0aXAtb3ZlcnJpZGUnKTtcbiAgICAgICAgICBudWIucmVtb3ZlQ2xhc3MoJ3J0bCcpO1xuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIHRpcC5jc3MoJ3Zpc2liaWxpdHknLCAndmlzaWJsZScpLmhpZGUoKTtcbiAgICB9LFxuXG4gICAgc21hbGwgOiBmdW5jdGlvbiAoKSB7XG4gICAgICByZXR1cm4gbWF0Y2hNZWRpYShGb3VuZGF0aW9uLm1lZGlhX3F1ZXJpZXMuc21hbGwpLm1hdGNoZXMgJiZcbiAgICAgICAgIW1hdGNoTWVkaWEoRm91bmRhdGlvbi5tZWRpYV9xdWVyaWVzLm1lZGl1bSkubWF0Y2hlcztcbiAgICB9LFxuXG4gICAgaW5oZXJpdGFibGVfY2xhc3NlcyA6IGZ1bmN0aW9uICgkdGFyZ2V0KSB7XG4gICAgICB2YXIgc2V0dGluZ3MgPSAkLmV4dGVuZCh7fSwgdGhpcy5zZXR0aW5ncywgdGhpcy5kYXRhX29wdGlvbnMoJHRhcmdldCkpLFxuICAgICAgICAgIGluaGVyaXRhYmxlcyA9IFsndGlwLXRvcCcsICd0aXAtbGVmdCcsICd0aXAtYm90dG9tJywgJ3RpcC1yaWdodCcsICdyYWRpdXMnLCAncm91bmQnXS5jb25jYXQoc2V0dGluZ3MuYWRkaXRpb25hbF9pbmhlcml0YWJsZV9jbGFzc2VzKSxcbiAgICAgICAgICBjbGFzc2VzID0gJHRhcmdldC5hdHRyKCdjbGFzcycpLFxuICAgICAgICAgIGZpbHRlcmVkID0gY2xhc3NlcyA/ICQubWFwKGNsYXNzZXMuc3BsaXQoJyAnKSwgZnVuY3Rpb24gKGVsLCBpKSB7XG4gICAgICAgICAgICBpZiAoJC5pbkFycmF5KGVsLCBpbmhlcml0YWJsZXMpICE9PSAtMSkge1xuICAgICAgICAgICAgICByZXR1cm4gZWw7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfSkuam9pbignICcpIDogJyc7XG5cbiAgICAgIHJldHVybiAkLnRyaW0oZmlsdGVyZWQpO1xuICAgIH0sXG5cbiAgICBjb252ZXJ0X3RvX3RvdWNoIDogZnVuY3Rpb24gKCR0YXJnZXQpIHtcbiAgICAgIHZhciBzZWxmID0gdGhpcyxcbiAgICAgICAgICAkdGlwID0gc2VsZi5nZXRUaXAoJHRhcmdldCksXG4gICAgICAgICAgc2V0dGluZ3MgPSAkLmV4dGVuZCh7fSwgc2VsZi5zZXR0aW5ncywgc2VsZi5kYXRhX29wdGlvbnMoJHRhcmdldCkpO1xuXG4gICAgICBpZiAoJHRpcC5maW5kKCcudGFwLXRvLWNsb3NlJykubGVuZ3RoID09PSAwKSB7XG4gICAgICAgICR0aXAuYXBwZW5kKCc8c3BhbiBjbGFzcz1cInRhcC10by1jbG9zZVwiPicgKyBzZXR0aW5ncy50b3VjaF9jbG9zZV90ZXh0ICsgJzwvc3Bhbj4nKTtcbiAgICAgICAgJHRpcC5vbignY2xpY2suZm5kdG4udG9vbHRpcC50YXBjbG9zZSB0b3VjaHN0YXJ0LmZuZHRuLnRvb2x0aXAudGFwY2xvc2UgTVNQb2ludGVyRG93bi5mbmR0bi50b29sdGlwLnRhcGNsb3NlJywgZnVuY3Rpb24gKGUpIHtcbiAgICAgICAgICBzZWxmLmhpZGUoJHRhcmdldCk7XG4gICAgICAgIH0pO1xuICAgICAgfVxuXG4gICAgICAkdGFyZ2V0LmRhdGEoJ3Rvb2x0aXAtb3Blbi1ldmVudC10eXBlJywgJ3RvdWNoJyk7XG4gICAgfSxcblxuICAgIHNob3cgOiBmdW5jdGlvbiAoJHRhcmdldCkge1xuICAgICAgdmFyICR0aXAgPSB0aGlzLmdldFRpcCgkdGFyZ2V0KTtcblxuICAgICAgaWYgKCR0YXJnZXQuZGF0YSgndG9vbHRpcC1vcGVuLWV2ZW50LXR5cGUnKSA9PSAndG91Y2gnKSB7XG4gICAgICAgIHRoaXMuY29udmVydF90b190b3VjaCgkdGFyZ2V0KTtcbiAgICAgIH1cblxuICAgICAgdGhpcy5yZXBvc2l0aW9uKCR0YXJnZXQsICR0aXAsICR0YXJnZXQuYXR0cignY2xhc3MnKSk7XG4gICAgICAkdGFyZ2V0LmFkZENsYXNzKCdvcGVuJyk7XG4gICAgICAkdGlwLmZhZGVJbigxNTApO1xuICAgIH0sXG5cbiAgICBoaWRlIDogZnVuY3Rpb24gKCR0YXJnZXQpIHtcbiAgICAgIHZhciAkdGlwID0gdGhpcy5nZXRUaXAoJHRhcmdldCk7XG4gICAgICAkdGlwLmZhZGVPdXQoMTUwLCBmdW5jdGlvbiAoKSB7XG4gICAgICAgICR0aXAuZmluZCgnLnRhcC10by1jbG9zZScpLnJlbW92ZSgpO1xuICAgICAgICAkdGlwLm9mZignY2xpY2suZm5kdG4udG9vbHRpcC50YXBjbG9zZSBNU1BvaW50ZXJEb3duLmZuZHRuLnRhcGNsb3NlJyk7XG4gICAgICAgICR0YXJnZXQucmVtb3ZlQ2xhc3MoJ29wZW4nKTtcbiAgICAgIH0pO1xuICAgIH0sXG5cbiAgICBvZmYgOiBmdW5jdGlvbiAoKSB7XG4gICAgICB2YXIgc2VsZiA9IHRoaXM7XG4gICAgICB0aGlzLlModGhpcy5zY29wZSkub2ZmKCcuZm5kdG4udG9vbHRpcCcpO1xuICAgICAgdGhpcy5TKHRoaXMuc2V0dGluZ3MudG9vbHRpcF9jbGFzcykuZWFjaChmdW5jdGlvbiAoaSkge1xuICAgICAgICAkKCdbJyArIHNlbGYuYXR0cl9uYW1lKCkgKyAnXScpLmVxKGkpLmF0dHIoJ3RpdGxlJywgJCh0aGlzKS50ZXh0KCkpO1xuICAgICAgfSkucmVtb3ZlKCk7XG4gICAgfSxcblxuICAgIHJlZmxvdyA6IGZ1bmN0aW9uICgpIHt9XG4gIH07XG59KGpRdWVyeSwgd2luZG93LCB3aW5kb3cuZG9jdW1lbnQpKTtcblxuOyhmdW5jdGlvbiAoJCwgd2luZG93LCBkb2N1bWVudCwgdW5kZWZpbmVkKSB7XG4gICd1c2Ugc3RyaWN0JztcblxuICBGb3VuZGF0aW9uLmxpYnMudG9wYmFyID0ge1xuICAgIG5hbWUgOiAndG9wYmFyJyxcblxuICAgIHZlcnNpb24gOiAnNS41LjInLFxuXG4gICAgc2V0dGluZ3MgOiB7XG4gICAgICBpbmRleCA6IDAsXG4gICAgICBzdGFydF9vZmZzZXQgOiAwLFxuICAgICAgc3RpY2t5X2NsYXNzIDogJ3N0aWNreScsXG4gICAgICBjdXN0b21fYmFja190ZXh0IDogdHJ1ZSxcbiAgICAgIGJhY2tfdGV4dCA6ICdCYWNrJyxcbiAgICAgIG1vYmlsZV9zaG93X3BhcmVudF9saW5rIDogdHJ1ZSxcbiAgICAgIGlzX2hvdmVyIDogdHJ1ZSxcbiAgICAgIHNjcm9sbHRvcCA6IHRydWUsIC8vIGp1bXAgdG8gdG9wIHdoZW4gc3RpY2t5IG5hdiBtZW51IHRvZ2dsZSBpcyBjbGlja2VkXG4gICAgICBzdGlja3lfb24gOiAnYWxsJyxcbiAgICAgIGRyb3Bkb3duX2F1dG9jbG9zZTogdHJ1ZVxuICAgIH0sXG5cbiAgICBpbml0IDogZnVuY3Rpb24gKHNlY3Rpb24sIG1ldGhvZCwgb3B0aW9ucykge1xuICAgICAgRm91bmRhdGlvbi5pbmhlcml0KHRoaXMsICdhZGRfY3VzdG9tX3J1bGUgcmVnaXN0ZXJfbWVkaWEgdGhyb3R0bGUnKTtcbiAgICAgIHZhciBzZWxmID0gdGhpcztcblxuICAgICAgc2VsZi5yZWdpc3Rlcl9tZWRpYSgndG9wYmFyJywgJ2ZvdW5kYXRpb24tbXEtdG9wYmFyJyk7XG5cbiAgICAgIHRoaXMuYmluZGluZ3MobWV0aG9kLCBvcHRpb25zKTtcblxuICAgICAgc2VsZi5TKCdbJyArIHRoaXMuYXR0cl9uYW1lKCkgKyAnXScsIHRoaXMuc2NvcGUpLmVhY2goZnVuY3Rpb24gKCkge1xuICAgICAgICB2YXIgdG9wYmFyID0gJCh0aGlzKSxcbiAgICAgICAgICAgIHNldHRpbmdzID0gdG9wYmFyLmRhdGEoc2VsZi5hdHRyX25hbWUodHJ1ZSkgKyAnLWluaXQnKSxcbiAgICAgICAgICAgIHNlY3Rpb24gPSBzZWxmLlMoJ3NlY3Rpb24sIC50b3AtYmFyLXNlY3Rpb24nLCB0aGlzKTtcbiAgICAgICAgdG9wYmFyLmRhdGEoJ2luZGV4JywgMCk7XG4gICAgICAgIHZhciB0b3BiYXJDb250YWluZXIgPSB0b3BiYXIucGFyZW50KCk7XG4gICAgICAgIGlmICh0b3BiYXJDb250YWluZXIuaGFzQ2xhc3MoJ2ZpeGVkJykgfHwgc2VsZi5pc19zdGlja3kodG9wYmFyLCB0b3BiYXJDb250YWluZXIsIHNldHRpbmdzKSApIHtcbiAgICAgICAgICBzZWxmLnNldHRpbmdzLnN0aWNreV9jbGFzcyA9IHNldHRpbmdzLnN0aWNreV9jbGFzcztcbiAgICAgICAgICBzZWxmLnNldHRpbmdzLnN0aWNreV90b3BiYXIgPSB0b3BiYXI7XG4gICAgICAgICAgdG9wYmFyLmRhdGEoJ2hlaWdodCcsIHRvcGJhckNvbnRhaW5lci5vdXRlckhlaWdodCgpKTtcbiAgICAgICAgICB0b3BiYXIuZGF0YSgnc3RpY2t5b2Zmc2V0JywgdG9wYmFyQ29udGFpbmVyLm9mZnNldCgpLnRvcCk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgdG9wYmFyLmRhdGEoJ2hlaWdodCcsIHRvcGJhci5vdXRlckhlaWdodCgpKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmICghc2V0dGluZ3MuYXNzZW1ibGVkKSB7XG4gICAgICAgICAgc2VsZi5hc3NlbWJsZSh0b3BiYXIpO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKHNldHRpbmdzLmlzX2hvdmVyKSB7XG4gICAgICAgICAgc2VsZi5TKCcuaGFzLWRyb3Bkb3duJywgdG9wYmFyKS5hZGRDbGFzcygnbm90LWNsaWNrJyk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgc2VsZi5TKCcuaGFzLWRyb3Bkb3duJywgdG9wYmFyKS5yZW1vdmVDbGFzcygnbm90LWNsaWNrJyk7XG4gICAgICAgIH1cblxuICAgICAgICAvLyBQYWQgYm9keSB3aGVuIHN0aWNreSAoc2Nyb2xsZWQpIG9yIGZpeGVkLlxuICAgICAgICBzZWxmLmFkZF9jdXN0b21fcnVsZSgnLmYtdG9wYmFyLWZpeGVkIHsgcGFkZGluZy10b3A6ICcgKyB0b3BiYXIuZGF0YSgnaGVpZ2h0JykgKyAncHggfScpO1xuXG4gICAgICAgIGlmICh0b3BiYXJDb250YWluZXIuaGFzQ2xhc3MoJ2ZpeGVkJykpIHtcbiAgICAgICAgICBzZWxmLlMoJ2JvZHknKS5hZGRDbGFzcygnZi10b3BiYXItZml4ZWQnKTtcbiAgICAgICAgfVxuICAgICAgfSk7XG5cbiAgICB9LFxuXG4gICAgaXNfc3RpY2t5IDogZnVuY3Rpb24gKHRvcGJhciwgdG9wYmFyQ29udGFpbmVyLCBzZXR0aW5ncykge1xuICAgICAgdmFyIHN0aWNreSAgICAgPSB0b3BiYXJDb250YWluZXIuaGFzQ2xhc3Moc2V0dGluZ3Muc3RpY2t5X2NsYXNzKTtcbiAgICAgIHZhciBzbWFsbE1hdGNoID0gbWF0Y2hNZWRpYShGb3VuZGF0aW9uLm1lZGlhX3F1ZXJpZXMuc21hbGwpLm1hdGNoZXM7XG4gICAgICB2YXIgbWVkTWF0Y2ggICA9IG1hdGNoTWVkaWEoRm91bmRhdGlvbi5tZWRpYV9xdWVyaWVzLm1lZGl1bSkubWF0Y2hlcztcbiAgICAgIHZhciBscmdNYXRjaCAgID0gbWF0Y2hNZWRpYShGb3VuZGF0aW9uLm1lZGlhX3F1ZXJpZXMubGFyZ2UpLm1hdGNoZXM7XG5cbiAgICAgIGlmIChzdGlja3kgJiYgc2V0dGluZ3Muc3RpY2t5X29uID09PSAnYWxsJykge1xuICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgIH1cbiAgICAgIGlmIChzdGlja3kgJiYgdGhpcy5zbWFsbCgpICYmIHNldHRpbmdzLnN0aWNreV9vbi5pbmRleE9mKCdzbWFsbCcpICE9PSAtMSkge1xuICAgICAgICBpZiAoc21hbGxNYXRjaCAmJiAhbWVkTWF0Y2ggJiYgIWxyZ01hdGNoKSB7IHJldHVybiB0cnVlOyB9XG4gICAgICB9XG4gICAgICBpZiAoc3RpY2t5ICYmIHRoaXMubWVkaXVtKCkgJiYgc2V0dGluZ3Muc3RpY2t5X29uLmluZGV4T2YoJ21lZGl1bScpICE9PSAtMSkge1xuICAgICAgICBpZiAoc21hbGxNYXRjaCAmJiBtZWRNYXRjaCAmJiAhbHJnTWF0Y2gpIHsgcmV0dXJuIHRydWU7IH1cbiAgICAgIH1cbiAgICAgIGlmIChzdGlja3kgJiYgdGhpcy5sYXJnZSgpICYmIHNldHRpbmdzLnN0aWNreV9vbi5pbmRleE9mKCdsYXJnZScpICE9PSAtMSkge1xuICAgICAgICBpZiAoc21hbGxNYXRjaCAmJiBtZWRNYXRjaCAmJiBscmdNYXRjaCkgeyByZXR1cm4gdHJ1ZTsgfVxuICAgICAgfVxuXG4gICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH0sXG5cbiAgICB0b2dnbGUgOiBmdW5jdGlvbiAodG9nZ2xlRWwpIHtcbiAgICAgIHZhciBzZWxmID0gdGhpcyxcbiAgICAgICAgICB0b3BiYXI7XG5cbiAgICAgIGlmICh0b2dnbGVFbCkge1xuICAgICAgICB0b3BiYXIgPSBzZWxmLlModG9nZ2xlRWwpLmNsb3Nlc3QoJ1snICsgdGhpcy5hdHRyX25hbWUoKSArICddJyk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB0b3BiYXIgPSBzZWxmLlMoJ1snICsgdGhpcy5hdHRyX25hbWUoKSArICddJyk7XG4gICAgICB9XG5cbiAgICAgIHZhciBzZXR0aW5ncyA9IHRvcGJhci5kYXRhKHRoaXMuYXR0cl9uYW1lKHRydWUpICsgJy1pbml0Jyk7XG5cbiAgICAgIHZhciBzZWN0aW9uID0gc2VsZi5TKCdzZWN0aW9uLCAudG9wLWJhci1zZWN0aW9uJywgdG9wYmFyKTtcblxuICAgICAgaWYgKHNlbGYuYnJlYWtwb2ludCgpKSB7XG4gICAgICAgIGlmICghc2VsZi5ydGwpIHtcbiAgICAgICAgICBzZWN0aW9uLmNzcyh7bGVmdCA6ICcwJSd9KTtcbiAgICAgICAgICAkKCc+Lm5hbWUnLCBzZWN0aW9uKS5jc3Moe2xlZnQgOiAnMTAwJSd9KTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBzZWN0aW9uLmNzcyh7cmlnaHQgOiAnMCUnfSk7XG4gICAgICAgICAgJCgnPi5uYW1lJywgc2VjdGlvbikuY3NzKHtyaWdodCA6ICcxMDAlJ30pO1xuICAgICAgICB9XG5cbiAgICAgICAgc2VsZi5TKCdsaS5tb3ZlZCcsIHNlY3Rpb24pLnJlbW92ZUNsYXNzKCdtb3ZlZCcpO1xuICAgICAgICB0b3BiYXIuZGF0YSgnaW5kZXgnLCAwKTtcblxuICAgICAgICB0b3BiYXJcbiAgICAgICAgICAudG9nZ2xlQ2xhc3MoJ2V4cGFuZGVkJylcbiAgICAgICAgICAuY3NzKCdoZWlnaHQnLCAnJyk7XG4gICAgICB9XG5cbiAgICAgIGlmIChzZXR0aW5ncy5zY3JvbGx0b3ApIHtcbiAgICAgICAgaWYgKCF0b3BiYXIuaGFzQ2xhc3MoJ2V4cGFuZGVkJykpIHtcbiAgICAgICAgICBpZiAodG9wYmFyLmhhc0NsYXNzKCdmaXhlZCcpKSB7XG4gICAgICAgICAgICB0b3BiYXIucGFyZW50KCkuYWRkQ2xhc3MoJ2ZpeGVkJyk7XG4gICAgICAgICAgICB0b3BiYXIucmVtb3ZlQ2xhc3MoJ2ZpeGVkJyk7XG4gICAgICAgICAgICBzZWxmLlMoJ2JvZHknKS5hZGRDbGFzcygnZi10b3BiYXItZml4ZWQnKTtcbiAgICAgICAgICB9XG4gICAgICAgIH0gZWxzZSBpZiAodG9wYmFyLnBhcmVudCgpLmhhc0NsYXNzKCdmaXhlZCcpKSB7XG4gICAgICAgICAgaWYgKHNldHRpbmdzLnNjcm9sbHRvcCkge1xuICAgICAgICAgICAgdG9wYmFyLnBhcmVudCgpLnJlbW92ZUNsYXNzKCdmaXhlZCcpO1xuICAgICAgICAgICAgdG9wYmFyLmFkZENsYXNzKCdmaXhlZCcpO1xuICAgICAgICAgICAgc2VsZi5TKCdib2R5JykucmVtb3ZlQ2xhc3MoJ2YtdG9wYmFyLWZpeGVkJyk7XG5cbiAgICAgICAgICAgIHdpbmRvdy5zY3JvbGxUbygwLCAwKTtcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdG9wYmFyLnBhcmVudCgpLnJlbW92ZUNsYXNzKCdleHBhbmRlZCcpO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgaWYgKHNlbGYuaXNfc3RpY2t5KHRvcGJhciwgdG9wYmFyLnBhcmVudCgpLCBzZXR0aW5ncykpIHtcbiAgICAgICAgICB0b3BiYXIucGFyZW50KCkuYWRkQ2xhc3MoJ2ZpeGVkJyk7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAodG9wYmFyLnBhcmVudCgpLmhhc0NsYXNzKCdmaXhlZCcpKSB7XG4gICAgICAgICAgaWYgKCF0b3BiYXIuaGFzQ2xhc3MoJ2V4cGFuZGVkJykpIHtcbiAgICAgICAgICAgIHRvcGJhci5yZW1vdmVDbGFzcygnZml4ZWQnKTtcbiAgICAgICAgICAgIHRvcGJhci5wYXJlbnQoKS5yZW1vdmVDbGFzcygnZXhwYW5kZWQnKTtcbiAgICAgICAgICAgIHNlbGYudXBkYXRlX3N0aWNreV9wb3NpdGlvbmluZygpO1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB0b3BiYXIuYWRkQ2xhc3MoJ2ZpeGVkJyk7XG4gICAgICAgICAgICB0b3BiYXIucGFyZW50KCkuYWRkQ2xhc3MoJ2V4cGFuZGVkJyk7XG4gICAgICAgICAgICBzZWxmLlMoJ2JvZHknKS5hZGRDbGFzcygnZi10b3BiYXItZml4ZWQnKTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9LFxuXG4gICAgdGltZXIgOiBudWxsLFxuXG4gICAgZXZlbnRzIDogZnVuY3Rpb24gKGJhcikge1xuICAgICAgdmFyIHNlbGYgPSB0aGlzLFxuICAgICAgICAgIFMgPSB0aGlzLlM7XG5cbiAgICAgIFModGhpcy5zY29wZSlcbiAgICAgICAgLm9mZignLnRvcGJhcicpXG4gICAgICAgIC5vbignY2xpY2suZm5kdG4udG9wYmFyJywgJ1snICsgdGhpcy5hdHRyX25hbWUoKSArICddIC50b2dnbGUtdG9wYmFyJywgZnVuY3Rpb24gKGUpIHtcbiAgICAgICAgICBlLnByZXZlbnREZWZhdWx0KCk7XG4gICAgICAgICAgc2VsZi50b2dnbGUodGhpcyk7XG4gICAgICAgIH0pXG4gICAgICAgIC5vbignY2xpY2suZm5kdG4udG9wYmFyIGNvbnRleHRtZW51LmZuZHRuLnRvcGJhcicsICcudG9wLWJhciAudG9wLWJhci1zZWN0aW9uIGxpIGFbaHJlZl49XCIjXCJdLFsnICsgdGhpcy5hdHRyX25hbWUoKSArICddIC50b3AtYmFyLXNlY3Rpb24gbGkgYVtocmVmXj1cIiNcIl0nLCBmdW5jdGlvbiAoZSkge1xuICAgICAgICAgICAgdmFyIGxpID0gJCh0aGlzKS5jbG9zZXN0KCdsaScpLFxuICAgICAgICAgICAgICAgIHRvcGJhciA9IGxpLmNsb3Nlc3QoJ1snICsgc2VsZi5hdHRyX25hbWUoKSArICddJyksXG4gICAgICAgICAgICAgICAgc2V0dGluZ3MgPSB0b3BiYXIuZGF0YShzZWxmLmF0dHJfbmFtZSh0cnVlKSArICctaW5pdCcpO1xuXG4gICAgICAgICAgICBpZiAoc2V0dGluZ3MuZHJvcGRvd25fYXV0b2Nsb3NlICYmIHNldHRpbmdzLmlzX2hvdmVyKSB7XG4gICAgICAgICAgICAgIHZhciBob3ZlckxpID0gJCh0aGlzKS5jbG9zZXN0KCcuaG92ZXInKTtcbiAgICAgICAgICAgICAgaG92ZXJMaS5yZW1vdmVDbGFzcygnaG92ZXInKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmIChzZWxmLmJyZWFrcG9pbnQoKSAmJiAhbGkuaGFzQ2xhc3MoJ2JhY2snKSAmJiAhbGkuaGFzQ2xhc3MoJ2hhcy1kcm9wZG93bicpKSB7XG4gICAgICAgICAgICAgIHNlbGYudG9nZ2xlKCk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgfSlcbiAgICAgICAgLm9uKCdjbGljay5mbmR0bi50b3BiYXInLCAnWycgKyB0aGlzLmF0dHJfbmFtZSgpICsgJ10gbGkuaGFzLWRyb3Bkb3duJywgZnVuY3Rpb24gKGUpIHtcbiAgICAgICAgICB2YXIgbGkgPSBTKHRoaXMpLFxuICAgICAgICAgICAgICB0YXJnZXQgPSBTKGUudGFyZ2V0KSxcbiAgICAgICAgICAgICAgdG9wYmFyID0gbGkuY2xvc2VzdCgnWycgKyBzZWxmLmF0dHJfbmFtZSgpICsgJ10nKSxcbiAgICAgICAgICAgICAgc2V0dGluZ3MgPSB0b3BiYXIuZGF0YShzZWxmLmF0dHJfbmFtZSh0cnVlKSArICctaW5pdCcpO1xuXG4gICAgICAgICAgaWYgKHRhcmdldC5kYXRhKCdyZXZlYWxJZCcpKSB7XG4gICAgICAgICAgICBzZWxmLnRvZ2dsZSgpO1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgIH1cblxuICAgICAgICAgIGlmIChzZWxmLmJyZWFrcG9pbnQoKSkge1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgIH1cblxuICAgICAgICAgIGlmIChzZXR0aW5ncy5pc19ob3ZlciAmJiAhTW9kZXJuaXpyLnRvdWNoKSB7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgZS5zdG9wSW1tZWRpYXRlUHJvcGFnYXRpb24oKTtcblxuICAgICAgICAgIGlmIChsaS5oYXNDbGFzcygnaG92ZXInKSkge1xuICAgICAgICAgICAgbGlcbiAgICAgICAgICAgICAgLnJlbW92ZUNsYXNzKCdob3ZlcicpXG4gICAgICAgICAgICAgIC5maW5kKCdsaScpXG4gICAgICAgICAgICAgIC5yZW1vdmVDbGFzcygnaG92ZXInKTtcblxuICAgICAgICAgICAgbGkucGFyZW50cygnbGkuaG92ZXInKVxuICAgICAgICAgICAgICAucmVtb3ZlQ2xhc3MoJ2hvdmVyJyk7XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGxpLmFkZENsYXNzKCdob3ZlcicpO1xuXG4gICAgICAgICAgICAkKGxpKS5zaWJsaW5ncygpLnJlbW92ZUNsYXNzKCdob3ZlcicpO1xuXG4gICAgICAgICAgICBpZiAodGFyZ2V0WzBdLm5vZGVOYW1lID09PSAnQScgJiYgdGFyZ2V0LnBhcmVudCgpLmhhc0NsYXNzKCdoYXMtZHJvcGRvd24nKSkge1xuICAgICAgICAgICAgICBlLnByZXZlbnREZWZhdWx0KCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICB9KVxuICAgICAgICAub24oJ2NsaWNrLmZuZHRuLnRvcGJhcicsICdbJyArIHRoaXMuYXR0cl9uYW1lKCkgKyAnXSAuaGFzLWRyb3Bkb3duPmEnLCBmdW5jdGlvbiAoZSkge1xuICAgICAgICAgIGlmIChzZWxmLmJyZWFrcG9pbnQoKSkge1xuXG4gICAgICAgICAgICBlLnByZXZlbnREZWZhdWx0KCk7XG5cbiAgICAgICAgICAgIHZhciAkdGhpcyA9IFModGhpcyksXG4gICAgICAgICAgICAgICAgdG9wYmFyID0gJHRoaXMuY2xvc2VzdCgnWycgKyBzZWxmLmF0dHJfbmFtZSgpICsgJ10nKSxcbiAgICAgICAgICAgICAgICBzZWN0aW9uID0gdG9wYmFyLmZpbmQoJ3NlY3Rpb24sIC50b3AtYmFyLXNlY3Rpb24nKSxcbiAgICAgICAgICAgICAgICBkcm9wZG93bkhlaWdodCA9ICR0aGlzLm5leHQoJy5kcm9wZG93bicpLm91dGVySGVpZ2h0KCksXG4gICAgICAgICAgICAgICAgJHNlbGVjdGVkTGkgPSAkdGhpcy5jbG9zZXN0KCdsaScpO1xuXG4gICAgICAgICAgICB0b3BiYXIuZGF0YSgnaW5kZXgnLCB0b3BiYXIuZGF0YSgnaW5kZXgnKSArIDEpO1xuICAgICAgICAgICAgJHNlbGVjdGVkTGkuYWRkQ2xhc3MoJ21vdmVkJyk7XG5cbiAgICAgICAgICAgIGlmICghc2VsZi5ydGwpIHtcbiAgICAgICAgICAgICAgc2VjdGlvbi5jc3Moe2xlZnQgOiAtKDEwMCAqIHRvcGJhci5kYXRhKCdpbmRleCcpKSArICclJ30pO1xuICAgICAgICAgICAgICBzZWN0aW9uLmZpbmQoJz4ubmFtZScpLmNzcyh7bGVmdCA6IDEwMCAqIHRvcGJhci5kYXRhKCdpbmRleCcpICsgJyUnfSk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICBzZWN0aW9uLmNzcyh7cmlnaHQgOiAtKDEwMCAqIHRvcGJhci5kYXRhKCdpbmRleCcpKSArICclJ30pO1xuICAgICAgICAgICAgICBzZWN0aW9uLmZpbmQoJz4ubmFtZScpLmNzcyh7cmlnaHQgOiAxMDAgKiB0b3BiYXIuZGF0YSgnaW5kZXgnKSArICclJ30pO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICB0b3BiYXIuY3NzKCdoZWlnaHQnLCAkdGhpcy5zaWJsaW5ncygndWwnKS5vdXRlckhlaWdodCh0cnVlKSArIHRvcGJhci5kYXRhKCdoZWlnaHQnKSk7XG4gICAgICAgICAgfVxuICAgICAgICB9KTtcblxuICAgICAgUyh3aW5kb3cpLm9mZignLnRvcGJhcicpLm9uKCdyZXNpemUuZm5kdG4udG9wYmFyJywgc2VsZi50aHJvdHRsZShmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgc2VsZi5yZXNpemUuY2FsbChzZWxmKTtcbiAgICAgIH0sIDUwKSkudHJpZ2dlcigncmVzaXplLmZuZHRuLnRvcGJhcicpLmxvYWQoZnVuY3Rpb24gKCkge1xuICAgICAgICAgIC8vIEVuc3VyZSB0aGF0IHRoZSBvZmZzZXQgaXMgY2FsY3VsYXRlZCBhZnRlciBhbGwgb2YgdGhlIHBhZ2VzIHJlc291cmNlcyBoYXZlIGxvYWRlZFxuICAgICAgICAgIFModGhpcykudHJpZ2dlcigncmVzaXplLmZuZHRuLnRvcGJhcicpO1xuICAgICAgfSk7XG5cbiAgICAgIFMoJ2JvZHknKS5vZmYoJy50b3BiYXInKS5vbignY2xpY2suZm5kdG4udG9wYmFyJywgZnVuY3Rpb24gKGUpIHtcbiAgICAgICAgdmFyIHBhcmVudCA9IFMoZS50YXJnZXQpLmNsb3Nlc3QoJ2xpJykuY2xvc2VzdCgnbGkuaG92ZXInKTtcblxuICAgICAgICBpZiAocGFyZW50Lmxlbmd0aCA+IDApIHtcbiAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cblxuICAgICAgICBTKCdbJyArIHNlbGYuYXR0cl9uYW1lKCkgKyAnXSBsaS5ob3ZlcicpLnJlbW92ZUNsYXNzKCdob3ZlcicpO1xuICAgICAgfSk7XG5cbiAgICAgIC8vIEdvIHVwIGEgbGV2ZWwgb24gQ2xpY2tcbiAgICAgIFModGhpcy5zY29wZSkub24oJ2NsaWNrLmZuZHRuLnRvcGJhcicsICdbJyArIHRoaXMuYXR0cl9uYW1lKCkgKyAnXSAuaGFzLWRyb3Bkb3duIC5iYWNrJywgZnVuY3Rpb24gKGUpIHtcbiAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuXG4gICAgICAgIHZhciAkdGhpcyA9IFModGhpcyksXG4gICAgICAgICAgICB0b3BiYXIgPSAkdGhpcy5jbG9zZXN0KCdbJyArIHNlbGYuYXR0cl9uYW1lKCkgKyAnXScpLFxuICAgICAgICAgICAgc2VjdGlvbiA9IHRvcGJhci5maW5kKCdzZWN0aW9uLCAudG9wLWJhci1zZWN0aW9uJyksXG4gICAgICAgICAgICBzZXR0aW5ncyA9IHRvcGJhci5kYXRhKHNlbGYuYXR0cl9uYW1lKHRydWUpICsgJy1pbml0JyksXG4gICAgICAgICAgICAkbW92ZWRMaSA9ICR0aGlzLmNsb3Nlc3QoJ2xpLm1vdmVkJyksXG4gICAgICAgICAgICAkcHJldmlvdXNMZXZlbFVsID0gJG1vdmVkTGkucGFyZW50KCk7XG5cbiAgICAgICAgdG9wYmFyLmRhdGEoJ2luZGV4JywgdG9wYmFyLmRhdGEoJ2luZGV4JykgLSAxKTtcblxuICAgICAgICBpZiAoIXNlbGYucnRsKSB7XG4gICAgICAgICAgc2VjdGlvbi5jc3Moe2xlZnQgOiAtKDEwMCAqIHRvcGJhci5kYXRhKCdpbmRleCcpKSArICclJ30pO1xuICAgICAgICAgIHNlY3Rpb24uZmluZCgnPi5uYW1lJykuY3NzKHtsZWZ0IDogMTAwICogdG9wYmFyLmRhdGEoJ2luZGV4JykgKyAnJSd9KTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBzZWN0aW9uLmNzcyh7cmlnaHQgOiAtKDEwMCAqIHRvcGJhci5kYXRhKCdpbmRleCcpKSArICclJ30pO1xuICAgICAgICAgIHNlY3Rpb24uZmluZCgnPi5uYW1lJykuY3NzKHtyaWdodCA6IDEwMCAqIHRvcGJhci5kYXRhKCdpbmRleCcpICsgJyUnfSk7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAodG9wYmFyLmRhdGEoJ2luZGV4JykgPT09IDApIHtcbiAgICAgICAgICB0b3BiYXIuY3NzKCdoZWlnaHQnLCAnJyk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgdG9wYmFyLmNzcygnaGVpZ2h0JywgJHByZXZpb3VzTGV2ZWxVbC5vdXRlckhlaWdodCh0cnVlKSArIHRvcGJhci5kYXRhKCdoZWlnaHQnKSk7XG4gICAgICAgIH1cblxuICAgICAgICBzZXRUaW1lb3V0KGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAkbW92ZWRMaS5yZW1vdmVDbGFzcygnbW92ZWQnKTtcbiAgICAgICAgfSwgMzAwKTtcbiAgICAgIH0pO1xuXG4gICAgICAvLyBTaG93IGRyb3Bkb3duIG1lbnVzIHdoZW4gdGhlaXIgaXRlbXMgYXJlIGZvY3VzZWRcbiAgICAgIFModGhpcy5zY29wZSkuZmluZCgnLmRyb3Bkb3duIGEnKVxuICAgICAgICAuZm9jdXMoZnVuY3Rpb24gKCkge1xuICAgICAgICAgICQodGhpcykucGFyZW50cygnLmhhcy1kcm9wZG93bicpLmFkZENsYXNzKCdob3ZlcicpO1xuICAgICAgICB9KVxuICAgICAgICAuYmx1cihmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgJCh0aGlzKS5wYXJlbnRzKCcuaGFzLWRyb3Bkb3duJykucmVtb3ZlQ2xhc3MoJ2hvdmVyJyk7XG4gICAgICAgIH0pO1xuICAgIH0sXG5cbiAgICByZXNpemUgOiBmdW5jdGlvbiAoKSB7XG4gICAgICB2YXIgc2VsZiA9IHRoaXM7XG4gICAgICBzZWxmLlMoJ1snICsgdGhpcy5hdHRyX25hbWUoKSArICddJykuZWFjaChmdW5jdGlvbiAoKSB7XG4gICAgICAgIHZhciB0b3BiYXIgPSBzZWxmLlModGhpcyksXG4gICAgICAgICAgICBzZXR0aW5ncyA9IHRvcGJhci5kYXRhKHNlbGYuYXR0cl9uYW1lKHRydWUpICsgJy1pbml0Jyk7XG5cbiAgICAgICAgdmFyIHN0aWNreUNvbnRhaW5lciA9IHRvcGJhci5wYXJlbnQoJy4nICsgc2VsZi5zZXR0aW5ncy5zdGlja3lfY2xhc3MpO1xuICAgICAgICB2YXIgc3RpY2t5T2Zmc2V0O1xuXG4gICAgICAgIGlmICghc2VsZi5icmVha3BvaW50KCkpIHtcbiAgICAgICAgICB2YXIgZG9Ub2dnbGUgPSB0b3BiYXIuaGFzQ2xhc3MoJ2V4cGFuZGVkJyk7XG4gICAgICAgICAgdG9wYmFyXG4gICAgICAgICAgICAuY3NzKCdoZWlnaHQnLCAnJylcbiAgICAgICAgICAgIC5yZW1vdmVDbGFzcygnZXhwYW5kZWQnKVxuICAgICAgICAgICAgLmZpbmQoJ2xpJylcbiAgICAgICAgICAgIC5yZW1vdmVDbGFzcygnaG92ZXInKTtcblxuICAgICAgICAgICAgaWYgKGRvVG9nZ2xlKSB7XG4gICAgICAgICAgICAgIHNlbGYudG9nZ2xlKHRvcGJhcik7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoc2VsZi5pc19zdGlja3kodG9wYmFyLCBzdGlja3lDb250YWluZXIsIHNldHRpbmdzKSkge1xuICAgICAgICAgIGlmIChzdGlja3lDb250YWluZXIuaGFzQ2xhc3MoJ2ZpeGVkJykpIHtcbiAgICAgICAgICAgIC8vIFJlbW92ZSB0aGUgZml4ZWQgdG8gYWxsb3cgZm9yIGNvcnJlY3QgY2FsY3VsYXRpb24gb2YgdGhlIG9mZnNldC5cbiAgICAgICAgICAgIHN0aWNreUNvbnRhaW5lci5yZW1vdmVDbGFzcygnZml4ZWQnKTtcblxuICAgICAgICAgICAgc3RpY2t5T2Zmc2V0ID0gc3RpY2t5Q29udGFpbmVyLm9mZnNldCgpLnRvcDtcbiAgICAgICAgICAgIGlmIChzZWxmLlMoZG9jdW1lbnQuYm9keSkuaGFzQ2xhc3MoJ2YtdG9wYmFyLWZpeGVkJykpIHtcbiAgICAgICAgICAgICAgc3RpY2t5T2Zmc2V0IC09IHRvcGJhci5kYXRhKCdoZWlnaHQnKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgdG9wYmFyLmRhdGEoJ3N0aWNreW9mZnNldCcsIHN0aWNreU9mZnNldCk7XG4gICAgICAgICAgICBzdGlja3lDb250YWluZXIuYWRkQ2xhc3MoJ2ZpeGVkJyk7XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHN0aWNreU9mZnNldCA9IHN0aWNreUNvbnRhaW5lci5vZmZzZXQoKS50b3A7XG4gICAgICAgICAgICB0b3BiYXIuZGF0YSgnc3RpY2t5b2Zmc2V0Jywgc3RpY2t5T2Zmc2V0KTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgfSk7XG4gICAgfSxcblxuICAgIGJyZWFrcG9pbnQgOiBmdW5jdGlvbiAoKSB7XG4gICAgICByZXR1cm4gIW1hdGNoTWVkaWEoRm91bmRhdGlvbi5tZWRpYV9xdWVyaWVzWyd0b3BiYXInXSkubWF0Y2hlcztcbiAgICB9LFxuXG4gICAgc21hbGwgOiBmdW5jdGlvbiAoKSB7XG4gICAgICByZXR1cm4gbWF0Y2hNZWRpYShGb3VuZGF0aW9uLm1lZGlhX3F1ZXJpZXNbJ3NtYWxsJ10pLm1hdGNoZXM7XG4gICAgfSxcblxuICAgIG1lZGl1bSA6IGZ1bmN0aW9uICgpIHtcbiAgICAgIHJldHVybiBtYXRjaE1lZGlhKEZvdW5kYXRpb24ubWVkaWFfcXVlcmllc1snbWVkaXVtJ10pLm1hdGNoZXM7XG4gICAgfSxcblxuICAgIGxhcmdlIDogZnVuY3Rpb24gKCkge1xuICAgICAgcmV0dXJuIG1hdGNoTWVkaWEoRm91bmRhdGlvbi5tZWRpYV9xdWVyaWVzWydsYXJnZSddKS5tYXRjaGVzO1xuICAgIH0sXG5cbiAgICBhc3NlbWJsZSA6IGZ1bmN0aW9uICh0b3BiYXIpIHtcbiAgICAgIHZhciBzZWxmID0gdGhpcyxcbiAgICAgICAgICBzZXR0aW5ncyA9IHRvcGJhci5kYXRhKHRoaXMuYXR0cl9uYW1lKHRydWUpICsgJy1pbml0JyksXG4gICAgICAgICAgc2VjdGlvbiA9IHNlbGYuUygnc2VjdGlvbiwgLnRvcC1iYXItc2VjdGlvbicsIHRvcGJhcik7XG5cbiAgICAgIC8vIFB1bGwgZWxlbWVudCBvdXQgb2YgdGhlIERPTSBmb3IgbWFuaXB1bGF0aW9uXG4gICAgICBzZWN0aW9uLmRldGFjaCgpO1xuXG4gICAgICBzZWxmLlMoJy5oYXMtZHJvcGRvd24+YScsIHNlY3Rpb24pLmVhY2goZnVuY3Rpb24gKCkge1xuICAgICAgICB2YXIgJGxpbmsgPSBzZWxmLlModGhpcyksXG4gICAgICAgICAgICAkZHJvcGRvd24gPSAkbGluay5zaWJsaW5ncygnLmRyb3Bkb3duJyksXG4gICAgICAgICAgICB1cmwgPSAkbGluay5hdHRyKCdocmVmJyksXG4gICAgICAgICAgICAkdGl0bGVMaTtcblxuICAgICAgICBpZiAoISRkcm9wZG93bi5maW5kKCcudGl0bGUuYmFjaycpLmxlbmd0aCkge1xuXG4gICAgICAgICAgaWYgKHNldHRpbmdzLm1vYmlsZV9zaG93X3BhcmVudF9saW5rID09IHRydWUgJiYgdXJsKSB7XG4gICAgICAgICAgICAkdGl0bGVMaSA9ICQoJzxsaSBjbGFzcz1cInRpdGxlIGJhY2sganMtZ2VuZXJhdGVkXCI+PGg1PjxhIGhyZWY9XCJqYXZhc2NyaXB0OnZvaWQoMClcIj48L2E+PC9oNT48L2xpPjxsaSBjbGFzcz1cInBhcmVudC1saW5rIGhpZGUtZm9yLW1lZGl1bS11cFwiPjxhIGNsYXNzPVwicGFyZW50LWxpbmsganMtZ2VuZXJhdGVkXCIgaHJlZj1cIicgKyB1cmwgKyAnXCI+JyArICRsaW5rLmh0bWwoKSArJzwvYT48L2xpPicpO1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAkdGl0bGVMaSA9ICQoJzxsaSBjbGFzcz1cInRpdGxlIGJhY2sganMtZ2VuZXJhdGVkXCI+PGg1PjxhIGhyZWY9XCJqYXZhc2NyaXB0OnZvaWQoMClcIj48L2E+PC9oNT4nKTtcbiAgICAgICAgICB9XG5cbiAgICAgICAgICAvLyBDb3B5IGxpbmsgdG8gc3VibmF2XG4gICAgICAgICAgaWYgKHNldHRpbmdzLmN1c3RvbV9iYWNrX3RleHQgPT0gdHJ1ZSkge1xuICAgICAgICAgICAgJCgnaDU+YScsICR0aXRsZUxpKS5odG1sKHNldHRpbmdzLmJhY2tfdGV4dCk7XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICQoJ2g1PmEnLCAkdGl0bGVMaSkuaHRtbCgnJmxhcXVvOyAnICsgJGxpbmsuaHRtbCgpKTtcbiAgICAgICAgICB9XG4gICAgICAgICAgJGRyb3Bkb3duLnByZXBlbmQoJHRpdGxlTGkpO1xuICAgICAgICB9XG4gICAgICB9KTtcblxuICAgICAgLy8gUHV0IGVsZW1lbnQgYmFjayBpbiB0aGUgRE9NXG4gICAgICBzZWN0aW9uLmFwcGVuZFRvKHRvcGJhcik7XG5cbiAgICAgIC8vIGNoZWNrIGZvciBzdGlja3lcbiAgICAgIHRoaXMuc3RpY2t5KCk7XG5cbiAgICAgIHRoaXMuYXNzZW1ibGVkKHRvcGJhcik7XG4gICAgfSxcblxuICAgIGFzc2VtYmxlZCA6IGZ1bmN0aW9uICh0b3BiYXIpIHtcbiAgICAgIHRvcGJhci5kYXRhKHRoaXMuYXR0cl9uYW1lKHRydWUpLCAkLmV4dGVuZCh7fSwgdG9wYmFyLmRhdGEodGhpcy5hdHRyX25hbWUodHJ1ZSkpLCB7YXNzZW1ibGVkIDogdHJ1ZX0pKTtcbiAgICB9LFxuXG4gICAgaGVpZ2h0IDogZnVuY3Rpb24gKHVsKSB7XG4gICAgICB2YXIgdG90YWwgPSAwLFxuICAgICAgICAgIHNlbGYgPSB0aGlzO1xuXG4gICAgICAkKCc+IGxpJywgdWwpLmVhY2goZnVuY3Rpb24gKCkge1xuICAgICAgICB0b3RhbCArPSBzZWxmLlModGhpcykub3V0ZXJIZWlnaHQodHJ1ZSk7XG4gICAgICB9KTtcblxuICAgICAgcmV0dXJuIHRvdGFsO1xuICAgIH0sXG5cbiAgICBzdGlja3kgOiBmdW5jdGlvbiAoKSB7XG4gICAgICB2YXIgc2VsZiA9IHRoaXM7XG5cbiAgICAgIHRoaXMuUyh3aW5kb3cpLm9uKCdzY3JvbGwnLCBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHNlbGYudXBkYXRlX3N0aWNreV9wb3NpdGlvbmluZygpO1xuICAgICAgfSk7XG4gICAgfSxcblxuICAgIHVwZGF0ZV9zdGlja3lfcG9zaXRpb25pbmcgOiBmdW5jdGlvbiAoKSB7XG4gICAgICB2YXIga2xhc3MgPSAnLicgKyB0aGlzLnNldHRpbmdzLnN0aWNreV9jbGFzcyxcbiAgICAgICAgICAkd2luZG93ID0gdGhpcy5TKHdpbmRvdyksXG4gICAgICAgICAgc2VsZiA9IHRoaXM7XG5cbiAgICAgIGlmIChzZWxmLnNldHRpbmdzLnN0aWNreV90b3BiYXIgJiYgc2VsZi5pc19zdGlja3kodGhpcy5zZXR0aW5ncy5zdGlja3lfdG9wYmFyLHRoaXMuc2V0dGluZ3Muc3RpY2t5X3RvcGJhci5wYXJlbnQoKSwgdGhpcy5zZXR0aW5ncykpIHtcbiAgICAgICAgdmFyIGRpc3RhbmNlID0gdGhpcy5zZXR0aW5ncy5zdGlja3lfdG9wYmFyLmRhdGEoJ3N0aWNreW9mZnNldCcpICsgdGhpcy5zZXR0aW5ncy5zdGFydF9vZmZzZXQ7XG4gICAgICAgIGlmICghc2VsZi5TKGtsYXNzKS5oYXNDbGFzcygnZXhwYW5kZWQnKSkge1xuICAgICAgICAgIGlmICgkd2luZG93LnNjcm9sbFRvcCgpID4gKGRpc3RhbmNlKSkge1xuICAgICAgICAgICAgaWYgKCFzZWxmLlMoa2xhc3MpLmhhc0NsYXNzKCdmaXhlZCcpKSB7XG4gICAgICAgICAgICAgIHNlbGYuUyhrbGFzcykuYWRkQ2xhc3MoJ2ZpeGVkJyk7XG4gICAgICAgICAgICAgIHNlbGYuUygnYm9keScpLmFkZENsYXNzKCdmLXRvcGJhci1maXhlZCcpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH0gZWxzZSBpZiAoJHdpbmRvdy5zY3JvbGxUb3AoKSA8PSBkaXN0YW5jZSkge1xuICAgICAgICAgICAgaWYgKHNlbGYuUyhrbGFzcykuaGFzQ2xhc3MoJ2ZpeGVkJykpIHtcbiAgICAgICAgICAgICAgc2VsZi5TKGtsYXNzKS5yZW1vdmVDbGFzcygnZml4ZWQnKTtcbiAgICAgICAgICAgICAgc2VsZi5TKCdib2R5JykucmVtb3ZlQ2xhc3MoJ2YtdG9wYmFyLWZpeGVkJyk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9XG4gICAgfSxcblxuICAgIG9mZiA6IGZ1bmN0aW9uICgpIHtcbiAgICAgIHRoaXMuUyh0aGlzLnNjb3BlKS5vZmYoJy5mbmR0bi50b3BiYXInKTtcbiAgICAgIHRoaXMuUyh3aW5kb3cpLm9mZignLmZuZHRuLnRvcGJhcicpO1xuICAgIH0sXG5cbiAgICByZWZsb3cgOiBmdW5jdGlvbiAoKSB7fVxuICB9O1xufShqUXVlcnksIHdpbmRvdywgd2luZG93LmRvY3VtZW50KSk7XG4iXSwiZmlsZSI6ImZvdW5kYXRpb24vanMvZm91bmRhdGlvbi5qcyIsInNvdXJjZVJvb3QiOiIvc291cmNlLyJ9