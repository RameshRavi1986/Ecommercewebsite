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

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiIiwic291cmNlcyI6WyJmb3VuZGF0aW9uL2pzL2ZvdW5kYXRpb24vZm91bmRhdGlvbi5pbnRlcmNoYW5nZS5qcyJdLCJzb3VyY2VzQ29udGVudCI6WyI7KGZ1bmN0aW9uICgkLCB3aW5kb3csIGRvY3VtZW50LCB1bmRlZmluZWQpIHtcbiAgJ3VzZSBzdHJpY3QnO1xuXG4gIEZvdW5kYXRpb24ubGlicy5pbnRlcmNoYW5nZSA9IHtcbiAgICBuYW1lIDogJ2ludGVyY2hhbmdlJyxcblxuICAgIHZlcnNpb24gOiAnNS41LjInLFxuXG4gICAgY2FjaGUgOiB7fSxcblxuICAgIGltYWdlc19sb2FkZWQgOiBmYWxzZSxcbiAgICBub2Rlc19sb2FkZWQgOiBmYWxzZSxcblxuICAgIHNldHRpbmdzIDoge1xuICAgICAgbG9hZF9hdHRyIDogJ2ludGVyY2hhbmdlJyxcblxuICAgICAgbmFtZWRfcXVlcmllcyA6IHtcbiAgICAgICAgJ2RlZmF1bHQnICAgICA6ICdvbmx5IHNjcmVlbicsXG4gICAgICAgICdzbWFsbCcgICAgICAgOiBGb3VuZGF0aW9uLm1lZGlhX3F1ZXJpZXNbJ3NtYWxsJ10sXG4gICAgICAgICdzbWFsbC1vbmx5JyAgOiBGb3VuZGF0aW9uLm1lZGlhX3F1ZXJpZXNbJ3NtYWxsLW9ubHknXSxcbiAgICAgICAgJ21lZGl1bScgICAgICA6IEZvdW5kYXRpb24ubWVkaWFfcXVlcmllc1snbWVkaXVtJ10sXG4gICAgICAgICdtZWRpdW0tb25seScgOiBGb3VuZGF0aW9uLm1lZGlhX3F1ZXJpZXNbJ21lZGl1bS1vbmx5J10sXG4gICAgICAgICdsYXJnZScgICAgICAgOiBGb3VuZGF0aW9uLm1lZGlhX3F1ZXJpZXNbJ2xhcmdlJ10sXG4gICAgICAgICdsYXJnZS1vbmx5JyAgOiBGb3VuZGF0aW9uLm1lZGlhX3F1ZXJpZXNbJ2xhcmdlLW9ubHknXSxcbiAgICAgICAgJ3hsYXJnZScgICAgICA6IEZvdW5kYXRpb24ubWVkaWFfcXVlcmllc1sneGxhcmdlJ10sXG4gICAgICAgICd4bGFyZ2Utb25seScgOiBGb3VuZGF0aW9uLm1lZGlhX3F1ZXJpZXNbJ3hsYXJnZS1vbmx5J10sXG4gICAgICAgICd4eGxhcmdlJyAgICAgOiBGb3VuZGF0aW9uLm1lZGlhX3F1ZXJpZXNbJ3h4bGFyZ2UnXSxcbiAgICAgICAgJ2xhbmRzY2FwZScgICA6ICdvbmx5IHNjcmVlbiBhbmQgKG9yaWVudGF0aW9uOiBsYW5kc2NhcGUpJyxcbiAgICAgICAgJ3BvcnRyYWl0JyAgICA6ICdvbmx5IHNjcmVlbiBhbmQgKG9yaWVudGF0aW9uOiBwb3J0cmFpdCknLFxuICAgICAgICAncmV0aW5hJyAgICAgIDogJ29ubHkgc2NyZWVuIGFuZCAoLXdlYmtpdC1taW4tZGV2aWNlLXBpeGVsLXJhdGlvOiAyKSwnICtcbiAgICAgICAgICAnb25seSBzY3JlZW4gYW5kIChtaW4tLW1vei1kZXZpY2UtcGl4ZWwtcmF0aW86IDIpLCcgK1xuICAgICAgICAgICdvbmx5IHNjcmVlbiBhbmQgKC1vLW1pbi1kZXZpY2UtcGl4ZWwtcmF0aW86IDIvMSksJyArXG4gICAgICAgICAgJ29ubHkgc2NyZWVuIGFuZCAobWluLWRldmljZS1waXhlbC1yYXRpbzogMiksJyArXG4gICAgICAgICAgJ29ubHkgc2NyZWVuIGFuZCAobWluLXJlc29sdXRpb246IDE5MmRwaSksJyArXG4gICAgICAgICAgJ29ubHkgc2NyZWVuIGFuZCAobWluLXJlc29sdXRpb246IDJkcHB4KSdcbiAgICAgIH0sXG5cbiAgICAgIGRpcmVjdGl2ZXMgOiB7XG4gICAgICAgIHJlcGxhY2UgOiBmdW5jdGlvbiAoZWwsIHBhdGgsIHRyaWdnZXIpIHtcbiAgICAgICAgICAvLyBUaGUgdHJpZ2dlciBhcmd1bWVudCwgaWYgY2FsbGVkIHdpdGhpbiB0aGUgZGlyZWN0aXZlLCBmaXJlc1xuICAgICAgICAgIC8vIGFuIGV2ZW50IG5hbWVkIGFmdGVyIHRoZSBkaXJlY3RpdmUgb24gdGhlIGVsZW1lbnQsIHBhc3NpbmdcbiAgICAgICAgICAvLyBhbnkgcGFyYW1ldGVycyBhbG9uZyB0byB0aGUgZXZlbnQgdGhhdCB5b3UgcGFzcyB0byB0cmlnZ2VyLlxuICAgICAgICAgIC8vXG4gICAgICAgICAgLy8gZXguIHRyaWdnZXIoKSwgdHJpZ2dlcihbYSwgYiwgY10pLCBvciB0cmlnZ2VyKGEsIGIsIGMpXG4gICAgICAgICAgLy9cbiAgICAgICAgICAvLyBUaGlzIGFsbG93cyB5b3UgdG8gYmluZCBhIGNhbGxiYWNrIGxpa2Ugc286XG4gICAgICAgICAgLy8gJCgnI2ludGVyY2hhbmdlQ29udGFpbmVyJykub24oJ3JlcGxhY2UnLCBmdW5jdGlvbiAoZSwgYSwgYiwgYykge1xuICAgICAgICAgIC8vICAgY29uc29sZS5sb2coJCh0aGlzKS5odG1sKCksIGEsIGIsIGMpO1xuICAgICAgICAgIC8vIH0pO1xuXG4gICAgICAgICAgaWYgKGVsICE9PSBudWxsICYmIC9JTUcvLnRlc3QoZWxbMF0ubm9kZU5hbWUpKSB7XG4gICAgICAgICAgICB2YXIgb3JpZ19wYXRoID0gZWxbMF0uc3JjO1xuXG4gICAgICAgICAgICBpZiAobmV3IFJlZ0V4cChwYXRoLCAnaScpLnRlc3Qob3JpZ19wYXRoKSkge1xuICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGVsLmF0dHIoXCJzcmNcIiwgcGF0aCk7XG5cbiAgICAgICAgICAgIHJldHVybiB0cmlnZ2VyKGVsWzBdLnNyYyk7XG4gICAgICAgICAgfVxuICAgICAgICAgIHZhciBsYXN0X3BhdGggPSBlbC5kYXRhKHRoaXMuZGF0YV9hdHRyICsgJy1sYXN0LXBhdGgnKSxcbiAgICAgICAgICAgICAgc2VsZiA9IHRoaXM7XG5cbiAgICAgICAgICBpZiAobGFzdF9wYXRoID09IHBhdGgpIHtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICB9XG5cbiAgICAgICAgICBpZiAoL1xcLihnaWZ8anBnfGpwZWd8dGlmZnxwbmcpKFs/I10uKik/L2kudGVzdChwYXRoKSkge1xuICAgICAgICAgICAgJChlbCkuY3NzKCdiYWNrZ3JvdW5kLWltYWdlJywgJ3VybCgnICsgcGF0aCArICcpJyk7XG4gICAgICAgICAgICBlbC5kYXRhKCdpbnRlcmNoYW5nZS1sYXN0LXBhdGgnLCBwYXRoKTtcbiAgICAgICAgICAgIHJldHVybiB0cmlnZ2VyKHBhdGgpO1xuICAgICAgICAgIH1cblxuICAgICAgICAgIHJldHVybiAkLmdldChwYXRoLCBmdW5jdGlvbiAocmVzcG9uc2UpIHtcbiAgICAgICAgICAgIGVsLmh0bWwocmVzcG9uc2UpO1xuICAgICAgICAgICAgZWwuZGF0YShzZWxmLmRhdGFfYXR0ciArICctbGFzdC1wYXRoJywgcGF0aCk7XG4gICAgICAgICAgICB0cmlnZ2VyKCk7XG4gICAgICAgICAgfSk7XG5cbiAgICAgICAgfVxuICAgICAgfVxuICAgIH0sXG5cbiAgICBpbml0IDogZnVuY3Rpb24gKHNjb3BlLCBtZXRob2QsIG9wdGlvbnMpIHtcbiAgICAgIEZvdW5kYXRpb24uaW5oZXJpdCh0aGlzLCAndGhyb3R0bGUgcmFuZG9tX3N0cicpO1xuXG4gICAgICB0aGlzLmRhdGFfYXR0ciA9IHRoaXMuc2V0X2RhdGFfYXR0cigpO1xuICAgICAgJC5leHRlbmQodHJ1ZSwgdGhpcy5zZXR0aW5ncywgbWV0aG9kLCBvcHRpb25zKTtcbiAgICAgIHRoaXMuYmluZGluZ3MobWV0aG9kLCBvcHRpb25zKTtcbiAgICAgIHRoaXMucmVmbG93KCk7XG4gICAgfSxcblxuICAgIGdldF9tZWRpYV9oYXNoIDogZnVuY3Rpb24gKCkge1xuICAgICAgICB2YXIgbWVkaWFIYXNoID0gJyc7XG4gICAgICAgIGZvciAodmFyIHF1ZXJ5TmFtZSBpbiB0aGlzLnNldHRpbmdzLm5hbWVkX3F1ZXJpZXMgKSB7XG4gICAgICAgICAgICBtZWRpYUhhc2ggKz0gbWF0Y2hNZWRpYSh0aGlzLnNldHRpbmdzLm5hbWVkX3F1ZXJpZXNbcXVlcnlOYW1lXSkubWF0Y2hlcy50b1N0cmluZygpO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBtZWRpYUhhc2g7XG4gICAgfSxcblxuICAgIGV2ZW50cyA6IGZ1bmN0aW9uICgpIHtcbiAgICAgIHZhciBzZWxmID0gdGhpcywgcHJldk1lZGlhSGFzaDtcblxuICAgICAgJCh3aW5kb3cpXG4gICAgICAgIC5vZmYoJy5pbnRlcmNoYW5nZScpXG4gICAgICAgIC5vbigncmVzaXplLmZuZHRuLmludGVyY2hhbmdlJywgc2VsZi50aHJvdHRsZShmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICB2YXIgY3Vyck1lZGlhSGFzaCA9IHNlbGYuZ2V0X21lZGlhX2hhc2goKTtcbiAgICAgICAgICAgIGlmIChjdXJyTWVkaWFIYXNoICE9PSBwcmV2TWVkaWFIYXNoKSB7XG4gICAgICAgICAgICAgICAgc2VsZi5yZXNpemUoKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHByZXZNZWRpYUhhc2ggPSBjdXJyTWVkaWFIYXNoO1xuICAgICAgICB9LCA1MCkpO1xuXG4gICAgICByZXR1cm4gdGhpcztcbiAgICB9LFxuXG4gICAgcmVzaXplIDogZnVuY3Rpb24gKCkge1xuICAgICAgdmFyIGNhY2hlID0gdGhpcy5jYWNoZTtcblxuICAgICAgaWYgKCF0aGlzLmltYWdlc19sb2FkZWQgfHwgIXRoaXMubm9kZXNfbG9hZGVkKSB7XG4gICAgICAgIHNldFRpbWVvdXQoJC5wcm94eSh0aGlzLnJlc2l6ZSwgdGhpcyksIDUwKTtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuXG4gICAgICBmb3IgKHZhciB1dWlkIGluIGNhY2hlKSB7XG4gICAgICAgIGlmIChjYWNoZS5oYXNPd25Qcm9wZXJ0eSh1dWlkKSkge1xuICAgICAgICAgIHZhciBwYXNzZWQgPSB0aGlzLnJlc3VsdHModXVpZCwgY2FjaGVbdXVpZF0pO1xuICAgICAgICAgIGlmIChwYXNzZWQpIHtcbiAgICAgICAgICAgIHRoaXMuc2V0dGluZ3MuZGlyZWN0aXZlc1twYXNzZWRcbiAgICAgICAgICAgICAgLnNjZW5hcmlvWzFdXS5jYWxsKHRoaXMsIHBhc3NlZC5lbCwgcGFzc2VkLnNjZW5hcmlvWzBdLCAoZnVuY3Rpb24gKHBhc3NlZCkge1xuICAgICAgICAgICAgICAgIGlmIChhcmd1bWVudHNbMF0gaW5zdGFuY2VvZiBBcnJheSkge1xuICAgICAgICAgICAgICAgICAgdmFyIGFyZ3MgPSBhcmd1bWVudHNbMF07XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgIHZhciBhcmdzID0gQXJyYXkucHJvdG90eXBlLnNsaWNlLmNhbGwoYXJndW1lbnRzLCAwKTtcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICByZXR1cm4gZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgICAgICBwYXNzZWQuZWwudHJpZ2dlcihwYXNzZWQuc2NlbmFyaW9bMV0sIGFyZ3MpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgfShwYXNzZWQpKSk7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9XG5cbiAgICB9LFxuXG4gICAgcmVzdWx0cyA6IGZ1bmN0aW9uICh1dWlkLCBzY2VuYXJpb3MpIHtcbiAgICAgIHZhciBjb3VudCA9IHNjZW5hcmlvcy5sZW5ndGg7XG5cbiAgICAgIGlmIChjb3VudCA+IDApIHtcbiAgICAgICAgdmFyIGVsID0gdGhpcy5TKCdbJyArIHRoaXMuYWRkX25hbWVzcGFjZSgnZGF0YS11dWlkJykgKyAnPVwiJyArIHV1aWQgKyAnXCJdJyk7XG5cbiAgICAgICAgd2hpbGUgKGNvdW50LS0pIHtcbiAgICAgICAgICB2YXIgbXEsIHJ1bGUgPSBzY2VuYXJpb3NbY291bnRdWzJdO1xuICAgICAgICAgIGlmICh0aGlzLnNldHRpbmdzLm5hbWVkX3F1ZXJpZXMuaGFzT3duUHJvcGVydHkocnVsZSkpIHtcbiAgICAgICAgICAgIG1xID0gbWF0Y2hNZWRpYSh0aGlzLnNldHRpbmdzLm5hbWVkX3F1ZXJpZXNbcnVsZV0pO1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBtcSA9IG1hdGNoTWVkaWEocnVsZSk7XG4gICAgICAgICAgfVxuICAgICAgICAgIGlmIChtcS5tYXRjaGVzKSB7XG4gICAgICAgICAgICByZXR1cm4ge2VsIDogZWwsIHNjZW5hcmlvIDogc2NlbmFyaW9zW2NvdW50XX07XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9LFxuXG4gICAgbG9hZCA6IGZ1bmN0aW9uICh0eXBlLCBmb3JjZV91cGRhdGUpIHtcbiAgICAgIGlmICh0eXBlb2YgdGhpc1snY2FjaGVkXycgKyB0eXBlXSA9PT0gJ3VuZGVmaW5lZCcgfHwgZm9yY2VfdXBkYXRlKSB7XG4gICAgICAgIHRoaXNbJ3VwZGF0ZV8nICsgdHlwZV0oKTtcbiAgICAgIH1cblxuICAgICAgcmV0dXJuIHRoaXNbJ2NhY2hlZF8nICsgdHlwZV07XG4gICAgfSxcblxuICAgIHVwZGF0ZV9pbWFnZXMgOiBmdW5jdGlvbiAoKSB7XG4gICAgICB2YXIgaW1hZ2VzID0gdGhpcy5TKCdpbWdbJyArIHRoaXMuZGF0YV9hdHRyICsgJ10nKSxcbiAgICAgICAgICBjb3VudCA9IGltYWdlcy5sZW5ndGgsXG4gICAgICAgICAgaSA9IGNvdW50LFxuICAgICAgICAgIGxvYWRlZF9jb3VudCA9IDAsXG4gICAgICAgICAgZGF0YV9hdHRyID0gdGhpcy5kYXRhX2F0dHI7XG5cbiAgICAgIHRoaXMuY2FjaGUgPSB7fTtcbiAgICAgIHRoaXMuY2FjaGVkX2ltYWdlcyA9IFtdO1xuICAgICAgdGhpcy5pbWFnZXNfbG9hZGVkID0gKGNvdW50ID09PSAwKTtcblxuICAgICAgd2hpbGUgKGktLSkge1xuICAgICAgICBsb2FkZWRfY291bnQrKztcbiAgICAgICAgaWYgKGltYWdlc1tpXSkge1xuICAgICAgICAgIHZhciBzdHIgPSBpbWFnZXNbaV0uZ2V0QXR0cmlidXRlKGRhdGFfYXR0cikgfHwgJyc7XG5cbiAgICAgICAgICBpZiAoc3RyLmxlbmd0aCA+IDApIHtcbiAgICAgICAgICAgIHRoaXMuY2FjaGVkX2ltYWdlcy5wdXNoKGltYWdlc1tpXSk7XG4gICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgaWYgKGxvYWRlZF9jb3VudCA9PT0gY291bnQpIHtcbiAgICAgICAgICB0aGlzLmltYWdlc19sb2FkZWQgPSB0cnVlO1xuICAgICAgICAgIHRoaXMuZW5oYW5jZSgnaW1hZ2VzJyk7XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfSxcblxuICAgIHVwZGF0ZV9ub2RlcyA6IGZ1bmN0aW9uICgpIHtcbiAgICAgIHZhciBub2RlcyA9IHRoaXMuUygnWycgKyB0aGlzLmRhdGFfYXR0ciArICddJykubm90KCdpbWcnKSxcbiAgICAgICAgICBjb3VudCA9IG5vZGVzLmxlbmd0aCxcbiAgICAgICAgICBpID0gY291bnQsXG4gICAgICAgICAgbG9hZGVkX2NvdW50ID0gMCxcbiAgICAgICAgICBkYXRhX2F0dHIgPSB0aGlzLmRhdGFfYXR0cjtcblxuICAgICAgdGhpcy5jYWNoZWRfbm9kZXMgPSBbXTtcbiAgICAgIHRoaXMubm9kZXNfbG9hZGVkID0gKGNvdW50ID09PSAwKTtcblxuICAgICAgd2hpbGUgKGktLSkge1xuICAgICAgICBsb2FkZWRfY291bnQrKztcbiAgICAgICAgdmFyIHN0ciA9IG5vZGVzW2ldLmdldEF0dHJpYnV0ZShkYXRhX2F0dHIpIHx8ICcnO1xuXG4gICAgICAgIGlmIChzdHIubGVuZ3RoID4gMCkge1xuICAgICAgICAgIHRoaXMuY2FjaGVkX25vZGVzLnB1c2gobm9kZXNbaV0pO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKGxvYWRlZF9jb3VudCA9PT0gY291bnQpIHtcbiAgICAgICAgICB0aGlzLm5vZGVzX2xvYWRlZCA9IHRydWU7XG4gICAgICAgICAgdGhpcy5lbmhhbmNlKCdub2RlcycpO1xuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIHJldHVybiB0aGlzO1xuICAgIH0sXG5cbiAgICBlbmhhbmNlIDogZnVuY3Rpb24gKHR5cGUpIHtcbiAgICAgIHZhciBpID0gdGhpc1snY2FjaGVkXycgKyB0eXBlXS5sZW5ndGg7XG5cbiAgICAgIHdoaWxlIChpLS0pIHtcbiAgICAgICAgdGhpcy5vYmplY3QoJCh0aGlzWydjYWNoZWRfJyArIHR5cGVdW2ldKSk7XG4gICAgICB9XG5cbiAgICAgIHJldHVybiAkKHdpbmRvdykudHJpZ2dlcigncmVzaXplLmZuZHRuLmludGVyY2hhbmdlJyk7XG4gICAgfSxcblxuICAgIGNvbnZlcnRfZGlyZWN0aXZlIDogZnVuY3Rpb24gKGRpcmVjdGl2ZSkge1xuXG4gICAgICB2YXIgdHJpbW1lZCA9IHRoaXMudHJpbShkaXJlY3RpdmUpO1xuXG4gICAgICBpZiAodHJpbW1lZC5sZW5ndGggPiAwKSB7XG4gICAgICAgIHJldHVybiB0cmltbWVkO1xuICAgICAgfVxuXG4gICAgICByZXR1cm4gJ3JlcGxhY2UnO1xuICAgIH0sXG5cbiAgICBwYXJzZV9zY2VuYXJpbyA6IGZ1bmN0aW9uIChzY2VuYXJpbykge1xuICAgICAgLy8gVGhpcyBsb2dpYyBoYWQgdG8gYmUgbWFkZSBtb3JlIGNvbXBsZXggc2luY2Ugc29tZSB1c2VycyB3ZXJlIHVzaW5nIGNvbW1hcyBpbiB0aGUgdXJsIHBhdGhcbiAgICAgIC8vIFNvIHdlIGNhbm5vdCBzaW1wbHkganVzdCBzcGxpdCBvbiBhIGNvbW1hXG5cbiAgICAgIHZhciBkaXJlY3RpdmVfbWF0Y2ggPSBzY2VuYXJpb1swXS5tYXRjaCgvKC4rKSxcXHMqKFxcdyspXFxzKiQvKSxcbiAgICAgIC8vIGdldHRpbmcgdGhlIG1xIGhhcyBnb3R0ZW4gYSBiaXQgY29tcGxpY2F0ZWQgc2luY2Ugd2Ugc3RhcnRlZCBhY2NvdW50aW5nIGZvciBzZXZlcmFsIHVzZSBjYXNlc1xuICAgICAgLy8gb2YgVVJMcy4gRm9yIG5vdyB3ZSdsbCBjb250aW51ZSB0byBtYXRjaCB0aGVzZSBzY2VuYXJpb3MsIGJ1dCB3ZSBtYXkgY29uc2lkZXIgaGF2aW5nIHRoZXNlIHNjZW5hcmlvc1xuICAgICAgLy8gYXMgbmVzdGVkIG9iamVjdHMgb3IgYXJyYXlzIGluIEY2LlxuICAgICAgLy8gcmVnZXg6IG1hdGNoIGV2ZXJ5dGhpbmcgYmVmb3JlIGNsb3NlIHBhcmVudGhlc2lzIGZvciBtcVxuICAgICAgbWVkaWFfcXVlcnkgICAgICAgICA9IHNjZW5hcmlvWzFdLm1hdGNoKC8oLiopXFwpLyk7XG5cbiAgICAgIGlmIChkaXJlY3RpdmVfbWF0Y2gpIHtcbiAgICAgICAgdmFyIHBhdGggID0gZGlyZWN0aXZlX21hdGNoWzFdLFxuICAgICAgICBkaXJlY3RpdmUgPSBkaXJlY3RpdmVfbWF0Y2hbMl07XG5cbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHZhciBjYWNoZWRfc3BsaXQgPSBzY2VuYXJpb1swXS5zcGxpdCgvLFxccyokLyksXG4gICAgICAgIHBhdGggICAgICAgICAgICAgPSBjYWNoZWRfc3BsaXRbMF0sXG4gICAgICAgIGRpcmVjdGl2ZSAgICAgICAgPSAnJztcbiAgICAgIH1cblxuICAgICAgcmV0dXJuIFt0aGlzLnRyaW0ocGF0aCksIHRoaXMuY29udmVydF9kaXJlY3RpdmUoZGlyZWN0aXZlKSwgdGhpcy50cmltKG1lZGlhX3F1ZXJ5WzFdKV07XG4gICAgfSxcblxuICAgIG9iamVjdCA6IGZ1bmN0aW9uIChlbCkge1xuICAgICAgdmFyIHJhd19hcnIgPSB0aGlzLnBhcnNlX2RhdGFfYXR0cihlbCksXG4gICAgICAgICAgc2NlbmFyaW9zID0gW10sXG4gICAgICAgICAgaSA9IHJhd19hcnIubGVuZ3RoO1xuXG4gICAgICBpZiAoaSA+IDApIHtcbiAgICAgICAgd2hpbGUgKGktLSkge1xuICAgICAgICAgIC8vIHNwbGl0IGFycmF5IGJldHdlZW4gY29tbWEgZGVsaW1pdGVkIGNvbnRlbnQgYW5kIG1xXG4gICAgICAgICAgLy8gcmVnZXg6IGNvbW1hLCBvcHRpb25hbCBzcGFjZSwgb3BlbiBwYXJlbnRoZXNpc1xuICAgICAgICAgIHZhciBzY2VuYXJpbyA9IHJhd19hcnJbaV0uc3BsaXQoLyxcXHM/XFwoLyk7XG5cbiAgICAgICAgICBpZiAoc2NlbmFyaW8ubGVuZ3RoID4gMSkge1xuICAgICAgICAgICAgdmFyIHBhcmFtcyA9IHRoaXMucGFyc2Vfc2NlbmFyaW8oc2NlbmFyaW8pO1xuICAgICAgICAgICAgc2NlbmFyaW9zLnB1c2gocGFyYW1zKTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgcmV0dXJuIHRoaXMuc3RvcmUoZWwsIHNjZW5hcmlvcyk7XG4gICAgfSxcblxuICAgIHN0b3JlIDogZnVuY3Rpb24gKGVsLCBzY2VuYXJpb3MpIHtcbiAgICAgIHZhciB1dWlkID0gdGhpcy5yYW5kb21fc3RyKCksXG4gICAgICAgICAgY3VycmVudF91dWlkID0gZWwuZGF0YSh0aGlzLmFkZF9uYW1lc3BhY2UoJ3V1aWQnLCB0cnVlKSk7XG5cbiAgICAgIGlmICh0aGlzLmNhY2hlW2N1cnJlbnRfdXVpZF0pIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuY2FjaGVbY3VycmVudF91dWlkXTtcbiAgICAgIH1cblxuICAgICAgZWwuYXR0cih0aGlzLmFkZF9uYW1lc3BhY2UoJ2RhdGEtdXVpZCcpLCB1dWlkKTtcbiAgICAgIHJldHVybiB0aGlzLmNhY2hlW3V1aWRdID0gc2NlbmFyaW9zO1xuICAgIH0sXG5cbiAgICB0cmltIDogZnVuY3Rpb24gKHN0cikge1xuXG4gICAgICBpZiAodHlwZW9mIHN0ciA9PT0gJ3N0cmluZycpIHtcbiAgICAgICAgcmV0dXJuICQudHJpbShzdHIpO1xuICAgICAgfVxuXG4gICAgICByZXR1cm4gc3RyO1xuICAgIH0sXG5cbiAgICBzZXRfZGF0YV9hdHRyIDogZnVuY3Rpb24gKGluaXQpIHtcbiAgICAgIGlmIChpbml0KSB7XG4gICAgICAgIGlmICh0aGlzLm5hbWVzcGFjZS5sZW5ndGggPiAwKSB7XG4gICAgICAgICAgcmV0dXJuIHRoaXMubmFtZXNwYWNlICsgJy0nICsgdGhpcy5zZXR0aW5ncy5sb2FkX2F0dHI7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gdGhpcy5zZXR0aW5ncy5sb2FkX2F0dHI7XG4gICAgICB9XG5cbiAgICAgIGlmICh0aGlzLm5hbWVzcGFjZS5sZW5ndGggPiAwKSB7XG4gICAgICAgIHJldHVybiAnZGF0YS0nICsgdGhpcy5uYW1lc3BhY2UgKyAnLScgKyB0aGlzLnNldHRpbmdzLmxvYWRfYXR0cjtcbiAgICAgIH1cblxuICAgICAgcmV0dXJuICdkYXRhLScgKyB0aGlzLnNldHRpbmdzLmxvYWRfYXR0cjtcbiAgICB9LFxuXG4gICAgcGFyc2VfZGF0YV9hdHRyIDogZnVuY3Rpb24gKGVsKSB7XG4gICAgICB2YXIgcmF3ID0gZWwuYXR0cih0aGlzLmF0dHJfbmFtZSgpKS5zcGxpdCgvXFxbKC4qPylcXF0vKSxcbiAgICAgICAgICBpID0gcmF3Lmxlbmd0aCxcbiAgICAgICAgICBvdXRwdXQgPSBbXTtcblxuICAgICAgd2hpbGUgKGktLSkge1xuICAgICAgICBpZiAocmF3W2ldLnJlcGxhY2UoL1tcXFdcXGRdKy8sICcnKS5sZW5ndGggPiA0KSB7XG4gICAgICAgICAgb3V0cHV0LnB1c2gocmF3W2ldKTtcbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICByZXR1cm4gb3V0cHV0O1xuICAgIH0sXG5cbiAgICByZWZsb3cgOiBmdW5jdGlvbiAoKSB7XG4gICAgICB0aGlzLmxvYWQoJ2ltYWdlcycsIHRydWUpO1xuICAgICAgdGhpcy5sb2FkKCdub2RlcycsIHRydWUpO1xuICAgIH1cblxuICB9O1xuXG59KGpRdWVyeSwgd2luZG93LCB3aW5kb3cuZG9jdW1lbnQpKTtcbiJdLCJmaWxlIjoiZm91bmRhdGlvbi9qcy9mb3VuZGF0aW9uL2ZvdW5kYXRpb24uaW50ZXJjaGFuZ2UuanMiLCJzb3VyY2VSb290IjoiL3NvdXJjZS8ifQ==