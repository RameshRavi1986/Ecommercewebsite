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

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiIiwic291cmNlcyI6WyJmb3VuZGF0aW9uL2pzL2ZvdW5kYXRpb24vZm91bmRhdGlvbi50b29sdGlwLmpzIl0sInNvdXJjZXNDb250ZW50IjpbIjsoZnVuY3Rpb24gKCQsIHdpbmRvdywgZG9jdW1lbnQsIHVuZGVmaW5lZCkge1xuICAndXNlIHN0cmljdCc7XG5cbiAgRm91bmRhdGlvbi5saWJzLnRvb2x0aXAgPSB7XG4gICAgbmFtZSA6ICd0b29sdGlwJyxcblxuICAgIHZlcnNpb24gOiAnNS41LjInLFxuXG4gICAgc2V0dGluZ3MgOiB7XG4gICAgICBhZGRpdGlvbmFsX2luaGVyaXRhYmxlX2NsYXNzZXMgOiBbXSxcbiAgICAgIHRvb2x0aXBfY2xhc3MgOiAnLnRvb2x0aXAnLFxuICAgICAgYXBwZW5kX3RvIDogJ2JvZHknLFxuICAgICAgdG91Y2hfY2xvc2VfdGV4dCA6ICdUYXAgVG8gQ2xvc2UnLFxuICAgICAgZGlzYWJsZV9mb3JfdG91Y2ggOiBmYWxzZSxcbiAgICAgIGhvdmVyX2RlbGF5IDogMjAwLFxuICAgICAgc2hvd19vbiA6ICdhbGwnLFxuICAgICAgdGlwX3RlbXBsYXRlIDogZnVuY3Rpb24gKHNlbGVjdG9yLCBjb250ZW50KSB7XG4gICAgICAgIHJldHVybiAnPHNwYW4gZGF0YS1zZWxlY3Rvcj1cIicgKyBzZWxlY3RvciArICdcIiBpZD1cIicgKyBzZWxlY3RvciArICdcIiBjbGFzcz1cIidcbiAgICAgICAgICArIEZvdW5kYXRpb24ubGlicy50b29sdGlwLnNldHRpbmdzLnRvb2x0aXBfY2xhc3Muc3Vic3RyaW5nKDEpXG4gICAgICAgICAgKyAnXCIgcm9sZT1cInRvb2x0aXBcIj4nICsgY29udGVudCArICc8c3BhbiBjbGFzcz1cIm51YlwiPjwvc3Bhbj48L3NwYW4+JztcbiAgICAgIH1cbiAgICB9LFxuXG4gICAgY2FjaGUgOiB7fSxcblxuICAgIGluaXQgOiBmdW5jdGlvbiAoc2NvcGUsIG1ldGhvZCwgb3B0aW9ucykge1xuICAgICAgRm91bmRhdGlvbi5pbmhlcml0KHRoaXMsICdyYW5kb21fc3RyJyk7XG4gICAgICB0aGlzLmJpbmRpbmdzKG1ldGhvZCwgb3B0aW9ucyk7XG4gICAgfSxcblxuICAgIHNob3VsZF9zaG93IDogZnVuY3Rpb24gKHRhcmdldCwgdGlwKSB7XG4gICAgICB2YXIgc2V0dGluZ3MgPSAkLmV4dGVuZCh7fSwgdGhpcy5zZXR0aW5ncywgdGhpcy5kYXRhX29wdGlvbnModGFyZ2V0KSk7XG5cbiAgICAgIGlmIChzZXR0aW5ncy5zaG93X29uID09PSAnYWxsJykge1xuICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgIH0gZWxzZSBpZiAodGhpcy5zbWFsbCgpICYmIHNldHRpbmdzLnNob3dfb24gPT09ICdzbWFsbCcpIHtcbiAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICB9IGVsc2UgaWYgKHRoaXMubWVkaXVtKCkgJiYgc2V0dGluZ3Muc2hvd19vbiA9PT0gJ21lZGl1bScpIHtcbiAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICB9IGVsc2UgaWYgKHRoaXMubGFyZ2UoKSAmJiBzZXR0aW5ncy5zaG93X29uID09PSAnbGFyZ2UnKSB7XG4gICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgfVxuICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH0sXG5cbiAgICBtZWRpdW0gOiBmdW5jdGlvbiAoKSB7XG4gICAgICByZXR1cm4gbWF0Y2hNZWRpYShGb3VuZGF0aW9uLm1lZGlhX3F1ZXJpZXNbJ21lZGl1bSddKS5tYXRjaGVzO1xuICAgIH0sXG5cbiAgICBsYXJnZSA6IGZ1bmN0aW9uICgpIHtcbiAgICAgIHJldHVybiBtYXRjaE1lZGlhKEZvdW5kYXRpb24ubWVkaWFfcXVlcmllc1snbGFyZ2UnXSkubWF0Y2hlcztcbiAgICB9LFxuXG4gICAgZXZlbnRzIDogZnVuY3Rpb24gKGluc3RhbmNlKSB7XG4gICAgICB2YXIgc2VsZiA9IHRoaXMsXG4gICAgICAgICAgUyA9IHNlbGYuUztcblxuICAgICAgc2VsZi5jcmVhdGUodGhpcy5TKGluc3RhbmNlKSk7XG5cbiAgICAgIGZ1bmN0aW9uIF9zdGFydFNob3coZWx0LCAkdGhpcywgaW1tZWRpYXRlKSB7XG4gICAgICAgIGlmIChlbHQudGltZXIpIHtcbiAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoaW1tZWRpYXRlKSB7XG4gICAgICAgICAgZWx0LnRpbWVyID0gbnVsbDtcbiAgICAgICAgICBzZWxmLnNob3dUaXAoJHRoaXMpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIGVsdC50aW1lciA9IHNldFRpbWVvdXQoZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgZWx0LnRpbWVyID0gbnVsbDtcbiAgICAgICAgICAgIHNlbGYuc2hvd1RpcCgkdGhpcyk7XG4gICAgICAgICAgfS5iaW5kKGVsdCksIHNlbGYuc2V0dGluZ3MuaG92ZXJfZGVsYXkpO1xuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIGZ1bmN0aW9uIF9zdGFydEhpZGUoZWx0LCAkdGhpcykge1xuICAgICAgICBpZiAoZWx0LnRpbWVyKSB7XG4gICAgICAgICAgY2xlYXJUaW1lb3V0KGVsdC50aW1lcik7XG4gICAgICAgICAgZWx0LnRpbWVyID0gbnVsbDtcbiAgICAgICAgfVxuXG4gICAgICAgIHNlbGYuaGlkZSgkdGhpcyk7XG4gICAgICB9XG5cbiAgICAgICQodGhpcy5zY29wZSlcbiAgICAgICAgLm9mZignLnRvb2x0aXAnKVxuICAgICAgICAub24oJ21vdXNlZW50ZXIuZm5kdG4udG9vbHRpcCBtb3VzZWxlYXZlLmZuZHRuLnRvb2x0aXAgdG91Y2hzdGFydC5mbmR0bi50b29sdGlwIE1TUG9pbnRlckRvd24uZm5kdG4udG9vbHRpcCcsXG4gICAgICAgICAgJ1snICsgdGhpcy5hdHRyX25hbWUoKSArICddJywgZnVuY3Rpb24gKGUpIHtcbiAgICAgICAgICB2YXIgJHRoaXMgPSBTKHRoaXMpLFxuICAgICAgICAgICAgICBzZXR0aW5ncyA9ICQuZXh0ZW5kKHt9LCBzZWxmLnNldHRpbmdzLCBzZWxmLmRhdGFfb3B0aW9ucygkdGhpcykpLFxuICAgICAgICAgICAgICBpc190b3VjaCA9IGZhbHNlO1xuXG4gICAgICAgICAgaWYgKE1vZGVybml6ci50b3VjaCAmJiAvdG91Y2hzdGFydHxNU1BvaW50ZXJEb3duL2kudGVzdChlLnR5cGUpICYmIFMoZS50YXJnZXQpLmlzKCdhJykpIHtcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgICB9XG5cbiAgICAgICAgICBpZiAoL21vdXNlL2kudGVzdChlLnR5cGUpICYmIHNlbGYuaWVfdG91Y2goZSkpIHtcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgICB9XG4gICAgICAgICAgXG4gICAgICAgICAgaWYgKCR0aGlzLmhhc0NsYXNzKCdvcGVuJykpIHtcbiAgICAgICAgICAgIGlmIChNb2Rlcm5penIudG91Y2ggJiYgL3RvdWNoc3RhcnR8TVNQb2ludGVyRG93bi9pLnRlc3QoZS50eXBlKSkge1xuICAgICAgICAgICAgICBlLnByZXZlbnREZWZhdWx0KCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBzZWxmLmhpZGUoJHRoaXMpO1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBpZiAoc2V0dGluZ3MuZGlzYWJsZV9mb3JfdG91Y2ggJiYgTW9kZXJuaXpyLnRvdWNoICYmIC90b3VjaHN0YXJ0fE1TUG9pbnRlckRvd24vaS50ZXN0KGUudHlwZSkpIHtcbiAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgfSBlbHNlIGlmICghc2V0dGluZ3MuZGlzYWJsZV9mb3JfdG91Y2ggJiYgTW9kZXJuaXpyLnRvdWNoICYmIC90b3VjaHN0YXJ0fE1TUG9pbnRlckRvd24vaS50ZXN0KGUudHlwZSkpIHtcbiAgICAgICAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgICAgICAgICBTKHNldHRpbmdzLnRvb2x0aXBfY2xhc3MgKyAnLm9wZW4nKS5oaWRlKCk7XG4gICAgICAgICAgICAgIGlzX3RvdWNoID0gdHJ1ZTtcbiAgICAgICAgICAgICAgLy8gY2xvc2Ugb3RoZXIgb3BlbiB0b29sdGlwcyBvbiB0b3VjaFxuICAgICAgICAgICAgICBpZiAoJCgnLm9wZW5bJyArIHNlbGYuYXR0cl9uYW1lKCkgKyAnXScpLmxlbmd0aCA+IDApIHtcbiAgICAgICAgICAgICAgIHZhciBwcmV2T3BlbiA9IFMoJCgnLm9wZW5bJyArIHNlbGYuYXR0cl9uYW1lKCkgKyAnXScpWzBdKTtcbiAgICAgICAgICAgICAgIHNlbGYuaGlkZShwcmV2T3Blbik7XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgaWYgKC9lbnRlcnxvdmVyL2kudGVzdChlLnR5cGUpKSB7XG4gICAgICAgICAgICAgIF9zdGFydFNob3codGhpcywgJHRoaXMpO1xuXG4gICAgICAgICAgICB9IGVsc2UgaWYgKGUudHlwZSA9PT0gJ21vdXNlb3V0JyB8fCBlLnR5cGUgPT09ICdtb3VzZWxlYXZlJykge1xuICAgICAgICAgICAgICBfc3RhcnRIaWRlKHRoaXMsICR0aGlzKTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgIF9zdGFydFNob3codGhpcywgJHRoaXMsIHRydWUpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgfSlcbiAgICAgICAgLm9uKCdtb3VzZWxlYXZlLmZuZHRuLnRvb2x0aXAgdG91Y2hzdGFydC5mbmR0bi50b29sdGlwIE1TUG9pbnRlckRvd24uZm5kdG4udG9vbHRpcCcsICdbJyArIHRoaXMuYXR0cl9uYW1lKCkgKyAnXS5vcGVuJywgZnVuY3Rpb24gKGUpIHtcbiAgICAgICAgICBpZiAoL21vdXNlL2kudGVzdChlLnR5cGUpICYmIHNlbGYuaWVfdG91Y2goZSkpIHtcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgICB9XG5cbiAgICAgICAgICBpZiAoJCh0aGlzKS5kYXRhKCd0b29sdGlwLW9wZW4tZXZlbnQtdHlwZScpID09ICd0b3VjaCcgJiYgZS50eXBlID09ICdtb3VzZWxlYXZlJykge1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgIH0gZWxzZSBpZiAoJCh0aGlzKS5kYXRhKCd0b29sdGlwLW9wZW4tZXZlbnQtdHlwZScpID09ICdtb3VzZScgJiYgL01TUG9pbnRlckRvd258dG91Y2hzdGFydC9pLnRlc3QoZS50eXBlKSkge1xuICAgICAgICAgICAgc2VsZi5jb252ZXJ0X3RvX3RvdWNoKCQodGhpcykpO1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBfc3RhcnRIaWRlKHRoaXMsICQodGhpcykpO1xuICAgICAgICAgIH1cbiAgICAgICAgfSlcbiAgICAgICAgLm9uKCdET01Ob2RlUmVtb3ZlZCBET01BdHRyTW9kaWZpZWQnLCAnWycgKyB0aGlzLmF0dHJfbmFtZSgpICsgJ106bm90KGEpJywgZnVuY3Rpb24gKGUpIHtcbiAgICAgICAgICBfc3RhcnRIaWRlKHRoaXMsIFModGhpcykpO1xuICAgICAgICB9KTtcbiAgICB9LFxuXG4gICAgaWVfdG91Y2ggOiBmdW5jdGlvbiAoZSkge1xuICAgICAgLy8gSG93IGRvIEkgZGlzdGluZ3Vpc2ggYmV0d2VlbiBJRTExIGFuZCBXaW5kb3dzIFBob25lIDg/Pz8/P1xuICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH0sXG5cbiAgICBzaG93VGlwIDogZnVuY3Rpb24gKCR0YXJnZXQpIHtcbiAgICAgIHZhciAkdGlwID0gdGhpcy5nZXRUaXAoJHRhcmdldCk7XG4gICAgICBpZiAodGhpcy5zaG91bGRfc2hvdygkdGFyZ2V0LCAkdGlwKSkge1xuICAgICAgICByZXR1cm4gdGhpcy5zaG93KCR0YXJnZXQpO1xuICAgICAgfVxuICAgICAgcmV0dXJuO1xuICAgIH0sXG5cbiAgICBnZXRUaXAgOiBmdW5jdGlvbiAoJHRhcmdldCkge1xuICAgICAgdmFyIHNlbGVjdG9yID0gdGhpcy5zZWxlY3RvcigkdGFyZ2V0KSxcbiAgICAgICAgICBzZXR0aW5ncyA9ICQuZXh0ZW5kKHt9LCB0aGlzLnNldHRpbmdzLCB0aGlzLmRhdGFfb3B0aW9ucygkdGFyZ2V0KSksXG4gICAgICAgICAgdGlwID0gbnVsbDtcblxuICAgICAgaWYgKHNlbGVjdG9yKSB7XG4gICAgICAgIHRpcCA9IHRoaXMuUygnc3BhbltkYXRhLXNlbGVjdG9yPVwiJyArIHNlbGVjdG9yICsgJ1wiXScgKyBzZXR0aW5ncy50b29sdGlwX2NsYXNzKTtcbiAgICAgIH1cblxuICAgICAgcmV0dXJuICh0eXBlb2YgdGlwID09PSAnb2JqZWN0JykgPyB0aXAgOiBmYWxzZTtcbiAgICB9LFxuXG4gICAgc2VsZWN0b3IgOiBmdW5jdGlvbiAoJHRhcmdldCkge1xuICAgICAgdmFyIGRhdGFTZWxlY3RvciA9ICR0YXJnZXQuYXR0cih0aGlzLmF0dHJfbmFtZSgpKSB8fCAkdGFyZ2V0LmF0dHIoJ2RhdGEtc2VsZWN0b3InKTtcblxuICAgICAgaWYgKHR5cGVvZiBkYXRhU2VsZWN0b3IgIT0gJ3N0cmluZycpIHtcbiAgICAgICAgZGF0YVNlbGVjdG9yID0gdGhpcy5yYW5kb21fc3RyKDYpO1xuICAgICAgICAkdGFyZ2V0XG4gICAgICAgICAgLmF0dHIoJ2RhdGEtc2VsZWN0b3InLCBkYXRhU2VsZWN0b3IpXG4gICAgICAgICAgLmF0dHIoJ2FyaWEtZGVzY3JpYmVkYnknLCBkYXRhU2VsZWN0b3IpO1xuICAgICAgfVxuXG4gICAgICByZXR1cm4gZGF0YVNlbGVjdG9yO1xuICAgIH0sXG5cbiAgICBjcmVhdGUgOiBmdW5jdGlvbiAoJHRhcmdldCkge1xuICAgICAgdmFyIHNlbGYgPSB0aGlzLFxuICAgICAgICAgIHNldHRpbmdzID0gJC5leHRlbmQoe30sIHRoaXMuc2V0dGluZ3MsIHRoaXMuZGF0YV9vcHRpb25zKCR0YXJnZXQpKSxcbiAgICAgICAgICB0aXBfdGVtcGxhdGUgPSB0aGlzLnNldHRpbmdzLnRpcF90ZW1wbGF0ZTtcblxuICAgICAgaWYgKHR5cGVvZiBzZXR0aW5ncy50aXBfdGVtcGxhdGUgPT09ICdzdHJpbmcnICYmIHdpbmRvdy5oYXNPd25Qcm9wZXJ0eShzZXR0aW5ncy50aXBfdGVtcGxhdGUpKSB7XG4gICAgICAgIHRpcF90ZW1wbGF0ZSA9IHdpbmRvd1tzZXR0aW5ncy50aXBfdGVtcGxhdGVdO1xuICAgICAgfVxuXG4gICAgICB2YXIgJHRpcCA9ICQodGlwX3RlbXBsYXRlKHRoaXMuc2VsZWN0b3IoJHRhcmdldCksICQoJzxkaXY+PC9kaXY+JykuaHRtbCgkdGFyZ2V0LmF0dHIoJ3RpdGxlJykpLmh0bWwoKSkpLFxuICAgICAgICAgIGNsYXNzZXMgPSB0aGlzLmluaGVyaXRhYmxlX2NsYXNzZXMoJHRhcmdldCk7XG5cbiAgICAgICR0aXAuYWRkQ2xhc3MoY2xhc3NlcykuYXBwZW5kVG8oc2V0dGluZ3MuYXBwZW5kX3RvKTtcblxuICAgICAgaWYgKE1vZGVybml6ci50b3VjaCkge1xuICAgICAgICAkdGlwLmFwcGVuZCgnPHNwYW4gY2xhc3M9XCJ0YXAtdG8tY2xvc2VcIj4nICsgc2V0dGluZ3MudG91Y2hfY2xvc2VfdGV4dCArICc8L3NwYW4+Jyk7XG4gICAgICAgICR0aXAub24oJ3RvdWNoc3RhcnQuZm5kdG4udG9vbHRpcCBNU1BvaW50ZXJEb3duLmZuZHRuLnRvb2x0aXAnLCBmdW5jdGlvbiAoZSkge1xuICAgICAgICAgIHNlbGYuaGlkZSgkdGFyZ2V0KTtcbiAgICAgICAgfSk7XG4gICAgICB9XG5cbiAgICAgICR0YXJnZXQucmVtb3ZlQXR0cigndGl0bGUnKS5hdHRyKCd0aXRsZScsICcnKTtcbiAgICB9LFxuXG4gICAgcmVwb3NpdGlvbiA6IGZ1bmN0aW9uICh0YXJnZXQsIHRpcCwgY2xhc3Nlcykge1xuICAgICAgdmFyIHdpZHRoLCBudWIsIG51YkhlaWdodCwgbnViV2lkdGgsIGNvbHVtbiwgb2JqUG9zO1xuXG4gICAgICB0aXAuY3NzKCd2aXNpYmlsaXR5JywgJ2hpZGRlbicpLnNob3coKTtcblxuICAgICAgd2lkdGggPSB0YXJnZXQuZGF0YSgnd2lkdGgnKTtcbiAgICAgIG51YiA9IHRpcC5jaGlsZHJlbignLm51YicpO1xuICAgICAgbnViSGVpZ2h0ID0gbnViLm91dGVySGVpZ2h0KCk7XG4gICAgICBudWJXaWR0aCA9IG51Yi5vdXRlckhlaWdodCgpO1xuXG4gICAgICBpZiAodGhpcy5zbWFsbCgpKSB7XG4gICAgICAgIHRpcC5jc3Moeyd3aWR0aCcgOiAnMTAwJSd9KTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHRpcC5jc3Moeyd3aWR0aCcgOiAod2lkdGgpID8gd2lkdGggOiAnYXV0byd9KTtcbiAgICAgIH1cblxuICAgICAgb2JqUG9zID0gZnVuY3Rpb24gKG9iaiwgdG9wLCByaWdodCwgYm90dG9tLCBsZWZ0LCB3aWR0aCkge1xuICAgICAgICByZXR1cm4gb2JqLmNzcyh7XG4gICAgICAgICAgJ3RvcCcgOiAodG9wKSA/IHRvcCA6ICdhdXRvJyxcbiAgICAgICAgICAnYm90dG9tJyA6IChib3R0b20pID8gYm90dG9tIDogJ2F1dG8nLFxuICAgICAgICAgICdsZWZ0JyA6IChsZWZ0KSA/IGxlZnQgOiAnYXV0bycsXG4gICAgICAgICAgJ3JpZ2h0JyA6IChyaWdodCkgPyByaWdodCA6ICdhdXRvJ1xuICAgICAgICB9KS5lbmQoKTtcbiAgICAgIH07XG5cbiAgICAgIG9ialBvcyh0aXAsICh0YXJnZXQub2Zmc2V0KCkudG9wICsgdGFyZ2V0Lm91dGVySGVpZ2h0KCkgKyAxMCksICdhdXRvJywgJ2F1dG8nLCB0YXJnZXQub2Zmc2V0KCkubGVmdCk7XG5cbiAgICAgIGlmICh0aGlzLnNtYWxsKCkpIHtcbiAgICAgICAgb2JqUG9zKHRpcCwgKHRhcmdldC5vZmZzZXQoKS50b3AgKyB0YXJnZXQub3V0ZXJIZWlnaHQoKSArIDEwKSwgJ2F1dG8nLCAnYXV0bycsIDEyLjUsICQodGhpcy5zY29wZSkud2lkdGgoKSk7XG4gICAgICAgIHRpcC5hZGRDbGFzcygndGlwLW92ZXJyaWRlJyk7XG4gICAgICAgIG9ialBvcyhudWIsIC1udWJIZWlnaHQsICdhdXRvJywgJ2F1dG8nLCB0YXJnZXQub2Zmc2V0KCkubGVmdCk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB2YXIgbGVmdCA9IHRhcmdldC5vZmZzZXQoKS5sZWZ0O1xuICAgICAgICBpZiAoRm91bmRhdGlvbi5ydGwpIHtcbiAgICAgICAgICBudWIuYWRkQ2xhc3MoJ3J0bCcpO1xuICAgICAgICAgIGxlZnQgPSB0YXJnZXQub2Zmc2V0KCkubGVmdCArIHRhcmdldC5vdXRlcldpZHRoKCkgLSB0aXAub3V0ZXJXaWR0aCgpO1xuICAgICAgICB9XG5cbiAgICAgICAgb2JqUG9zKHRpcCwgKHRhcmdldC5vZmZzZXQoKS50b3AgKyB0YXJnZXQub3V0ZXJIZWlnaHQoKSArIDEwKSwgJ2F1dG8nLCAnYXV0bycsIGxlZnQpO1xuICAgICAgICAvLyByZXNldCBudWIgZnJvbSBzbWFsbCBzdHlsZXMsIGlmIHRoZXkndmUgYmVlbiBhcHBsaWVkXG4gICAgICAgIGlmIChudWIuYXR0cignc3R5bGUnKSkge1xuICAgICAgICAgIG51Yi5yZW1vdmVBdHRyKCdzdHlsZScpO1xuICAgICAgICB9XG4gICAgICAgIFxuICAgICAgICB0aXAucmVtb3ZlQ2xhc3MoJ3RpcC1vdmVycmlkZScpO1xuICAgICAgICBpZiAoY2xhc3NlcyAmJiBjbGFzc2VzLmluZGV4T2YoJ3RpcC10b3AnKSA+IC0xKSB7XG4gICAgICAgICAgaWYgKEZvdW5kYXRpb24ucnRsKSB7XG4gICAgICAgICAgICBudWIuYWRkQ2xhc3MoJ3J0bCcpO1xuICAgICAgICAgIH1cbiAgICAgICAgICBvYmpQb3ModGlwLCAodGFyZ2V0Lm9mZnNldCgpLnRvcCAtIHRpcC5vdXRlckhlaWdodCgpKSwgJ2F1dG8nLCAnYXV0bycsIGxlZnQpXG4gICAgICAgICAgICAucmVtb3ZlQ2xhc3MoJ3RpcC1vdmVycmlkZScpO1xuICAgICAgICB9IGVsc2UgaWYgKGNsYXNzZXMgJiYgY2xhc3Nlcy5pbmRleE9mKCd0aXAtbGVmdCcpID4gLTEpIHtcbiAgICAgICAgICBvYmpQb3ModGlwLCAodGFyZ2V0Lm9mZnNldCgpLnRvcCArICh0YXJnZXQub3V0ZXJIZWlnaHQoKSAvIDIpIC0gKHRpcC5vdXRlckhlaWdodCgpIC8gMikpLCAnYXV0bycsICdhdXRvJywgKHRhcmdldC5vZmZzZXQoKS5sZWZ0IC0gdGlwLm91dGVyV2lkdGgoKSAtIG51YkhlaWdodCkpXG4gICAgICAgICAgICAucmVtb3ZlQ2xhc3MoJ3RpcC1vdmVycmlkZScpO1xuICAgICAgICAgIG51Yi5yZW1vdmVDbGFzcygncnRsJyk7XG4gICAgICAgIH0gZWxzZSBpZiAoY2xhc3NlcyAmJiBjbGFzc2VzLmluZGV4T2YoJ3RpcC1yaWdodCcpID4gLTEpIHtcbiAgICAgICAgICBvYmpQb3ModGlwLCAodGFyZ2V0Lm9mZnNldCgpLnRvcCArICh0YXJnZXQub3V0ZXJIZWlnaHQoKSAvIDIpIC0gKHRpcC5vdXRlckhlaWdodCgpIC8gMikpLCAnYXV0bycsICdhdXRvJywgKHRhcmdldC5vZmZzZXQoKS5sZWZ0ICsgdGFyZ2V0Lm91dGVyV2lkdGgoKSArIG51YkhlaWdodCkpXG4gICAgICAgICAgICAucmVtb3ZlQ2xhc3MoJ3RpcC1vdmVycmlkZScpO1xuICAgICAgICAgIG51Yi5yZW1vdmVDbGFzcygncnRsJyk7XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgdGlwLmNzcygndmlzaWJpbGl0eScsICd2aXNpYmxlJykuaGlkZSgpO1xuICAgIH0sXG5cbiAgICBzbWFsbCA6IGZ1bmN0aW9uICgpIHtcbiAgICAgIHJldHVybiBtYXRjaE1lZGlhKEZvdW5kYXRpb24ubWVkaWFfcXVlcmllcy5zbWFsbCkubWF0Y2hlcyAmJlxuICAgICAgICAhbWF0Y2hNZWRpYShGb3VuZGF0aW9uLm1lZGlhX3F1ZXJpZXMubWVkaXVtKS5tYXRjaGVzO1xuICAgIH0sXG5cbiAgICBpbmhlcml0YWJsZV9jbGFzc2VzIDogZnVuY3Rpb24gKCR0YXJnZXQpIHtcbiAgICAgIHZhciBzZXR0aW5ncyA9ICQuZXh0ZW5kKHt9LCB0aGlzLnNldHRpbmdzLCB0aGlzLmRhdGFfb3B0aW9ucygkdGFyZ2V0KSksXG4gICAgICAgICAgaW5oZXJpdGFibGVzID0gWyd0aXAtdG9wJywgJ3RpcC1sZWZ0JywgJ3RpcC1ib3R0b20nLCAndGlwLXJpZ2h0JywgJ3JhZGl1cycsICdyb3VuZCddLmNvbmNhdChzZXR0aW5ncy5hZGRpdGlvbmFsX2luaGVyaXRhYmxlX2NsYXNzZXMpLFxuICAgICAgICAgIGNsYXNzZXMgPSAkdGFyZ2V0LmF0dHIoJ2NsYXNzJyksXG4gICAgICAgICAgZmlsdGVyZWQgPSBjbGFzc2VzID8gJC5tYXAoY2xhc3Nlcy5zcGxpdCgnICcpLCBmdW5jdGlvbiAoZWwsIGkpIHtcbiAgICAgICAgICAgIGlmICgkLmluQXJyYXkoZWwsIGluaGVyaXRhYmxlcykgIT09IC0xKSB7XG4gICAgICAgICAgICAgIHJldHVybiBlbDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9KS5qb2luKCcgJykgOiAnJztcblxuICAgICAgcmV0dXJuICQudHJpbShmaWx0ZXJlZCk7XG4gICAgfSxcblxuICAgIGNvbnZlcnRfdG9fdG91Y2ggOiBmdW5jdGlvbiAoJHRhcmdldCkge1xuICAgICAgdmFyIHNlbGYgPSB0aGlzLFxuICAgICAgICAgICR0aXAgPSBzZWxmLmdldFRpcCgkdGFyZ2V0KSxcbiAgICAgICAgICBzZXR0aW5ncyA9ICQuZXh0ZW5kKHt9LCBzZWxmLnNldHRpbmdzLCBzZWxmLmRhdGFfb3B0aW9ucygkdGFyZ2V0KSk7XG5cbiAgICAgIGlmICgkdGlwLmZpbmQoJy50YXAtdG8tY2xvc2UnKS5sZW5ndGggPT09IDApIHtcbiAgICAgICAgJHRpcC5hcHBlbmQoJzxzcGFuIGNsYXNzPVwidGFwLXRvLWNsb3NlXCI+JyArIHNldHRpbmdzLnRvdWNoX2Nsb3NlX3RleHQgKyAnPC9zcGFuPicpO1xuICAgICAgICAkdGlwLm9uKCdjbGljay5mbmR0bi50b29sdGlwLnRhcGNsb3NlIHRvdWNoc3RhcnQuZm5kdG4udG9vbHRpcC50YXBjbG9zZSBNU1BvaW50ZXJEb3duLmZuZHRuLnRvb2x0aXAudGFwY2xvc2UnLCBmdW5jdGlvbiAoZSkge1xuICAgICAgICAgIHNlbGYuaGlkZSgkdGFyZ2V0KTtcbiAgICAgICAgfSk7XG4gICAgICB9XG5cbiAgICAgICR0YXJnZXQuZGF0YSgndG9vbHRpcC1vcGVuLWV2ZW50LXR5cGUnLCAndG91Y2gnKTtcbiAgICB9LFxuXG4gICAgc2hvdyA6IGZ1bmN0aW9uICgkdGFyZ2V0KSB7XG4gICAgICB2YXIgJHRpcCA9IHRoaXMuZ2V0VGlwKCR0YXJnZXQpO1xuXG4gICAgICBpZiAoJHRhcmdldC5kYXRhKCd0b29sdGlwLW9wZW4tZXZlbnQtdHlwZScpID09ICd0b3VjaCcpIHtcbiAgICAgICAgdGhpcy5jb252ZXJ0X3RvX3RvdWNoKCR0YXJnZXQpO1xuICAgICAgfVxuXG4gICAgICB0aGlzLnJlcG9zaXRpb24oJHRhcmdldCwgJHRpcCwgJHRhcmdldC5hdHRyKCdjbGFzcycpKTtcbiAgICAgICR0YXJnZXQuYWRkQ2xhc3MoJ29wZW4nKTtcbiAgICAgICR0aXAuZmFkZUluKDE1MCk7XG4gICAgfSxcblxuICAgIGhpZGUgOiBmdW5jdGlvbiAoJHRhcmdldCkge1xuICAgICAgdmFyICR0aXAgPSB0aGlzLmdldFRpcCgkdGFyZ2V0KTtcbiAgICAgICR0aXAuZmFkZU91dCgxNTAsIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgJHRpcC5maW5kKCcudGFwLXRvLWNsb3NlJykucmVtb3ZlKCk7XG4gICAgICAgICR0aXAub2ZmKCdjbGljay5mbmR0bi50b29sdGlwLnRhcGNsb3NlIE1TUG9pbnRlckRvd24uZm5kdG4udGFwY2xvc2UnKTtcbiAgICAgICAgJHRhcmdldC5yZW1vdmVDbGFzcygnb3BlbicpO1xuICAgICAgfSk7XG4gICAgfSxcblxuICAgIG9mZiA6IGZ1bmN0aW9uICgpIHtcbiAgICAgIHZhciBzZWxmID0gdGhpcztcbiAgICAgIHRoaXMuUyh0aGlzLnNjb3BlKS5vZmYoJy5mbmR0bi50b29sdGlwJyk7XG4gICAgICB0aGlzLlModGhpcy5zZXR0aW5ncy50b29sdGlwX2NsYXNzKS5lYWNoKGZ1bmN0aW9uIChpKSB7XG4gICAgICAgICQoJ1snICsgc2VsZi5hdHRyX25hbWUoKSArICddJykuZXEoaSkuYXR0cigndGl0bGUnLCAkKHRoaXMpLnRleHQoKSk7XG4gICAgICB9KS5yZW1vdmUoKTtcbiAgICB9LFxuXG4gICAgcmVmbG93IDogZnVuY3Rpb24gKCkge31cbiAgfTtcbn0oalF1ZXJ5LCB3aW5kb3csIHdpbmRvdy5kb2N1bWVudCkpO1xuIl0sImZpbGUiOiJmb3VuZGF0aW9uL2pzL2ZvdW5kYXRpb24vZm91bmRhdGlvbi50b29sdGlwLmpzIiwic291cmNlUm9vdCI6Ii9zb3VyY2UvIn0=