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

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiIiwic291cmNlcyI6WyJmb3VuZGF0aW9uL2pzL2ZvdW5kYXRpb24vZm91bmRhdGlvbi5zbGlkZXIuanMiXSwic291cmNlc0NvbnRlbnQiOlsiOyhmdW5jdGlvbiAoJCwgd2luZG93LCBkb2N1bWVudCwgdW5kZWZpbmVkKSB7XG4gICd1c2Ugc3RyaWN0JztcblxuICBGb3VuZGF0aW9uLmxpYnMuc2xpZGVyID0ge1xuICAgIG5hbWUgOiAnc2xpZGVyJyxcblxuICAgIHZlcnNpb24gOiAnNS41LjInLFxuXG4gICAgc2V0dGluZ3MgOiB7XG4gICAgICBzdGFydCA6IDAsXG4gICAgICBlbmQgOiAxMDAsXG4gICAgICBzdGVwIDogMSxcbiAgICAgIHByZWNpc2lvbiA6IG51bGwsXG4gICAgICBpbml0aWFsIDogbnVsbCxcbiAgICAgIGRpc3BsYXlfc2VsZWN0b3IgOiAnJyxcbiAgICAgIHZlcnRpY2FsIDogZmFsc2UsXG4gICAgICB0cmlnZ2VyX2lucHV0X2NoYW5nZSA6IGZhbHNlLFxuICAgICAgb25fY2hhbmdlIDogZnVuY3Rpb24gKCkge31cbiAgICB9LFxuXG4gICAgY2FjaGUgOiB7fSxcblxuICAgIGluaXQgOiBmdW5jdGlvbiAoc2NvcGUsIG1ldGhvZCwgb3B0aW9ucykge1xuICAgICAgRm91bmRhdGlvbi5pbmhlcml0KHRoaXMsICd0aHJvdHRsZScpO1xuICAgICAgdGhpcy5iaW5kaW5ncyhtZXRob2QsIG9wdGlvbnMpO1xuICAgICAgdGhpcy5yZWZsb3coKTtcbiAgICB9LFxuXG4gICAgZXZlbnRzIDogZnVuY3Rpb24gKCkge1xuICAgICAgdmFyIHNlbGYgPSB0aGlzO1xuXG4gICAgICAkKHRoaXMuc2NvcGUpXG4gICAgICAgIC5vZmYoJy5zbGlkZXInKVxuICAgICAgICAub24oJ21vdXNlZG93bi5mbmR0bi5zbGlkZXIgdG91Y2hzdGFydC5mbmR0bi5zbGlkZXIgcG9pbnRlcmRvd24uZm5kdG4uc2xpZGVyJyxcbiAgICAgICAgJ1snICsgc2VsZi5hdHRyX25hbWUoKSArICddOm5vdCguZGlzYWJsZWQsIFtkaXNhYmxlZF0pIC5yYW5nZS1zbGlkZXItaGFuZGxlJywgZnVuY3Rpb24gKGUpIHtcbiAgICAgICAgICBpZiAoIXNlbGYuY2FjaGUuYWN0aXZlKSB7XG4gICAgICAgICAgICBlLnByZXZlbnREZWZhdWx0KCk7XG4gICAgICAgICAgICBzZWxmLnNldF9hY3RpdmVfc2xpZGVyKCQoZS50YXJnZXQpKTtcbiAgICAgICAgICB9XG4gICAgICAgIH0pXG4gICAgICAgIC5vbignbW91c2Vtb3ZlLmZuZHRuLnNsaWRlciB0b3VjaG1vdmUuZm5kdG4uc2xpZGVyIHBvaW50ZXJtb3ZlLmZuZHRuLnNsaWRlcicsIGZ1bmN0aW9uIChlKSB7XG4gICAgICAgICAgaWYgKCEhc2VsZi5jYWNoZS5hY3RpdmUpIHtcbiAgICAgICAgICAgIGUucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgICAgIGlmICgkLmRhdGEoc2VsZi5jYWNoZS5hY3RpdmVbMF0sICdzZXR0aW5ncycpLnZlcnRpY2FsKSB7XG4gICAgICAgICAgICAgIHZhciBzY3JvbGxfb2Zmc2V0ID0gMDtcbiAgICAgICAgICAgICAgaWYgKCFlLnBhZ2VZKSB7XG4gICAgICAgICAgICAgICAgc2Nyb2xsX29mZnNldCA9IHdpbmRvdy5zY3JvbGxZO1xuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIHNlbGYuY2FsY3VsYXRlX3Bvc2l0aW9uKHNlbGYuY2FjaGUuYWN0aXZlLCBzZWxmLmdldF9jdXJzb3JfcG9zaXRpb24oZSwgJ3knKSArIHNjcm9sbF9vZmZzZXQpO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgc2VsZi5jYWxjdWxhdGVfcG9zaXRpb24oc2VsZi5jYWNoZS5hY3RpdmUsIHNlbGYuZ2V0X2N1cnNvcl9wb3NpdGlvbihlLCAneCcpKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgIH0pXG4gICAgICAgIC5vbignbW91c2V1cC5mbmR0bi5zbGlkZXIgdG91Y2hlbmQuZm5kdG4uc2xpZGVyIHBvaW50ZXJ1cC5mbmR0bi5zbGlkZXInLCBmdW5jdGlvbiAoZSkge1xuICAgICAgICAgIHNlbGYucmVtb3ZlX2FjdGl2ZV9zbGlkZXIoKTtcbiAgICAgICAgfSlcbiAgICAgICAgLm9uKCdjaGFuZ2UuZm5kdG4uc2xpZGVyJywgZnVuY3Rpb24gKGUpIHtcbiAgICAgICAgICBzZWxmLnNldHRpbmdzLm9uX2NoYW5nZSgpO1xuICAgICAgICB9KTtcblxuICAgICAgc2VsZi5TKHdpbmRvdylcbiAgICAgICAgLm9uKCdyZXNpemUuZm5kdG4uc2xpZGVyJywgc2VsZi50aHJvdHRsZShmdW5jdGlvbiAoZSkge1xuICAgICAgICAgIHNlbGYucmVmbG93KCk7XG4gICAgICAgIH0sIDMwMCkpO1xuXG4gICAgICAvLyB1cGRhdGUgc2xpZGVyIHZhbHVlIGFzIHVzZXJzIGNoYW5nZSBpbnB1dCB2YWx1ZVxuICAgICAgdGhpcy5TKCdbJyArIHRoaXMuYXR0cl9uYW1lKCkgKyAnXScpLmVhY2goZnVuY3Rpb24gKCkge1xuICAgICAgICB2YXIgc2xpZGVyID0gJCh0aGlzKSxcbiAgICAgICAgICAgIGhhbmRsZSA9IHNsaWRlci5jaGlsZHJlbignLnJhbmdlLXNsaWRlci1oYW5kbGUnKVswXSxcbiAgICAgICAgICAgIHNldHRpbmdzID0gc2VsZi5pbml0aWFsaXplX3NldHRpbmdzKGhhbmRsZSk7XG5cbiAgICAgICAgaWYgKHNldHRpbmdzLmRpc3BsYXlfc2VsZWN0b3IgIT0gJycpIHtcbiAgICAgICAgICAkKHNldHRpbmdzLmRpc3BsYXlfc2VsZWN0b3IpLmVhY2goZnVuY3Rpb24oKXtcbiAgICAgICAgICAgIGlmICh0aGlzLmhhc093blByb3BlcnR5KCd2YWx1ZScpKSB7XG4gICAgICAgICAgICAgICQodGhpcykuY2hhbmdlKGZ1bmN0aW9uKCl7XG4gICAgICAgICAgICAgICAgLy8gaXMgdGhlcmUgYSBiZXR0ZXIgd2F5IHRvIGRvIHRoaXM/XG4gICAgICAgICAgICAgICAgc2xpZGVyLmZvdW5kYXRpb24oXCJzbGlkZXJcIiwgXCJzZXRfdmFsdWVcIiwgJCh0aGlzKS52YWwoKSk7XG4gICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgICB9KTtcbiAgICB9LFxuXG4gICAgZ2V0X2N1cnNvcl9wb3NpdGlvbiA6IGZ1bmN0aW9uIChlLCB4eSkge1xuICAgICAgdmFyIHBhZ2VYWSA9ICdwYWdlJyArIHh5LnRvVXBwZXJDYXNlKCksXG4gICAgICAgICAgY2xpZW50WFkgPSAnY2xpZW50JyArIHh5LnRvVXBwZXJDYXNlKCksXG4gICAgICAgICAgcG9zaXRpb247XG5cbiAgICAgIGlmICh0eXBlb2YgZVtwYWdlWFldICE9PSAndW5kZWZpbmVkJykge1xuICAgICAgICBwb3NpdGlvbiA9IGVbcGFnZVhZXTtcbiAgICAgIH0gZWxzZSBpZiAodHlwZW9mIGUub3JpZ2luYWxFdmVudFtjbGllbnRYWV0gIT09ICd1bmRlZmluZWQnKSB7XG4gICAgICAgIHBvc2l0aW9uID0gZS5vcmlnaW5hbEV2ZW50W2NsaWVudFhZXTtcbiAgICAgIH0gZWxzZSBpZiAoZS5vcmlnaW5hbEV2ZW50LnRvdWNoZXMgJiYgZS5vcmlnaW5hbEV2ZW50LnRvdWNoZXNbMF0gJiYgdHlwZW9mIGUub3JpZ2luYWxFdmVudC50b3VjaGVzWzBdW2NsaWVudFhZXSAhPT0gJ3VuZGVmaW5lZCcpIHtcbiAgICAgICAgcG9zaXRpb24gPSBlLm9yaWdpbmFsRXZlbnQudG91Y2hlc1swXVtjbGllbnRYWV07XG4gICAgICB9IGVsc2UgaWYgKGUuY3VycmVudFBvaW50ICYmIHR5cGVvZiBlLmN1cnJlbnRQb2ludFt4eV0gIT09ICd1bmRlZmluZWQnKSB7XG4gICAgICAgIHBvc2l0aW9uID0gZS5jdXJyZW50UG9pbnRbeHldO1xuICAgICAgfVxuXG4gICAgICByZXR1cm4gcG9zaXRpb247XG4gICAgfSxcblxuICAgIHNldF9hY3RpdmVfc2xpZGVyIDogZnVuY3Rpb24gKCRoYW5kbGUpIHtcbiAgICAgIHRoaXMuY2FjaGUuYWN0aXZlID0gJGhhbmRsZTtcbiAgICB9LFxuXG4gICAgcmVtb3ZlX2FjdGl2ZV9zbGlkZXIgOiBmdW5jdGlvbiAoKSB7XG4gICAgICB0aGlzLmNhY2hlLmFjdGl2ZSA9IG51bGw7XG4gICAgfSxcblxuICAgIGNhbGN1bGF0ZV9wb3NpdGlvbiA6IGZ1bmN0aW9uICgkaGFuZGxlLCBjdXJzb3JfeCkge1xuICAgICAgdmFyIHNlbGYgPSB0aGlzLFxuICAgICAgICAgIHNldHRpbmdzID0gJC5kYXRhKCRoYW5kbGVbMF0sICdzZXR0aW5ncycpLFxuICAgICAgICAgIGhhbmRsZV9sID0gJC5kYXRhKCRoYW5kbGVbMF0sICdoYW5kbGVfbCcpLFxuICAgICAgICAgIGhhbmRsZV9vID0gJC5kYXRhKCRoYW5kbGVbMF0sICdoYW5kbGVfbycpLFxuICAgICAgICAgIGJhcl9sID0gJC5kYXRhKCRoYW5kbGVbMF0sICdiYXJfbCcpLFxuICAgICAgICAgIGJhcl9vID0gJC5kYXRhKCRoYW5kbGVbMF0sICdiYXJfbycpO1xuXG4gICAgICByZXF1ZXN0QW5pbWF0aW9uRnJhbWUoZnVuY3Rpb24gKCkge1xuICAgICAgICB2YXIgcGN0O1xuXG4gICAgICAgIGlmIChGb3VuZGF0aW9uLnJ0bCAmJiAhc2V0dGluZ3MudmVydGljYWwpIHtcbiAgICAgICAgICBwY3QgPSBzZWxmLmxpbWl0X3RvKCgoYmFyX28gKyBiYXJfbCAtIGN1cnNvcl94KSAvIGJhcl9sKSwgMCwgMSk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgcGN0ID0gc2VsZi5saW1pdF90bygoKGN1cnNvcl94IC0gYmFyX28pIC8gYmFyX2wpLCAwLCAxKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHBjdCA9IHNldHRpbmdzLnZlcnRpY2FsID8gMSAtIHBjdCA6IHBjdDtcblxuICAgICAgICB2YXIgbm9ybSA9IHNlbGYubm9ybWFsaXplZF92YWx1ZShwY3QsIHNldHRpbmdzLnN0YXJ0LCBzZXR0aW5ncy5lbmQsIHNldHRpbmdzLnN0ZXAsIHNldHRpbmdzLnByZWNpc2lvbik7XG5cbiAgICAgICAgc2VsZi5zZXRfdWkoJGhhbmRsZSwgbm9ybSk7XG4gICAgICB9KTtcbiAgICB9LFxuXG4gICAgc2V0X3VpIDogZnVuY3Rpb24gKCRoYW5kbGUsIHZhbHVlKSB7XG4gICAgICB2YXIgc2V0dGluZ3MgPSAkLmRhdGEoJGhhbmRsZVswXSwgJ3NldHRpbmdzJyksXG4gICAgICAgICAgaGFuZGxlX2wgPSAkLmRhdGEoJGhhbmRsZVswXSwgJ2hhbmRsZV9sJyksXG4gICAgICAgICAgYmFyX2wgPSAkLmRhdGEoJGhhbmRsZVswXSwgJ2Jhcl9sJyksXG4gICAgICAgICAgbm9ybV9wY3QgPSB0aGlzLm5vcm1hbGl6ZWRfcGVyY2VudGFnZSh2YWx1ZSwgc2V0dGluZ3Muc3RhcnQsIHNldHRpbmdzLmVuZCksXG4gICAgICAgICAgaGFuZGxlX29mZnNldCA9IG5vcm1fcGN0ICogKGJhcl9sIC0gaGFuZGxlX2wpIC0gMSxcbiAgICAgICAgICBwcm9ncmVzc19iYXJfbGVuZ3RoID0gbm9ybV9wY3QgKiAxMDAsXG4gICAgICAgICAgJGhhbmRsZV9wYXJlbnQgPSAkaGFuZGxlLnBhcmVudCgpLFxuICAgICAgICAgICRoaWRkZW5faW5wdXRzID0gJGhhbmRsZS5wYXJlbnQoKS5jaGlsZHJlbignaW5wdXRbdHlwZT1oaWRkZW5dJyk7XG5cbiAgICAgIGlmIChGb3VuZGF0aW9uLnJ0bCAmJiAhc2V0dGluZ3MudmVydGljYWwpIHtcbiAgICAgICAgaGFuZGxlX29mZnNldCA9IC1oYW5kbGVfb2Zmc2V0O1xuICAgICAgfVxuXG4gICAgICBoYW5kbGVfb2Zmc2V0ID0gc2V0dGluZ3MudmVydGljYWwgPyAtaGFuZGxlX29mZnNldCArIGJhcl9sIC0gaGFuZGxlX2wgKyAxIDogaGFuZGxlX29mZnNldDtcbiAgICAgIHRoaXMuc2V0X3RyYW5zbGF0ZSgkaGFuZGxlLCBoYW5kbGVfb2Zmc2V0LCBzZXR0aW5ncy52ZXJ0aWNhbCk7XG5cbiAgICAgIGlmIChzZXR0aW5ncy52ZXJ0aWNhbCkge1xuICAgICAgICAkaGFuZGxlLnNpYmxpbmdzKCcucmFuZ2Utc2xpZGVyLWFjdGl2ZS1zZWdtZW50JykuY3NzKCdoZWlnaHQnLCBwcm9ncmVzc19iYXJfbGVuZ3RoICsgJyUnKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgICRoYW5kbGUuc2libGluZ3MoJy5yYW5nZS1zbGlkZXItYWN0aXZlLXNlZ21lbnQnKS5jc3MoJ3dpZHRoJywgcHJvZ3Jlc3NfYmFyX2xlbmd0aCArICclJyk7XG4gICAgICB9XG5cbiAgICAgICRoYW5kbGVfcGFyZW50LmF0dHIodGhpcy5hdHRyX25hbWUoKSwgdmFsdWUpLnRyaWdnZXIoJ2NoYW5nZS5mbmR0bi5zbGlkZXInKTtcblxuICAgICAgJGhpZGRlbl9pbnB1dHMudmFsKHZhbHVlKTtcbiAgICAgIGlmIChzZXR0aW5ncy50cmlnZ2VyX2lucHV0X2NoYW5nZSkge1xuICAgICAgICAgICRoaWRkZW5faW5wdXRzLnRyaWdnZXIoJ2NoYW5nZS5mbmR0bi5zbGlkZXInKTtcbiAgICAgIH1cblxuICAgICAgaWYgKCEkaGFuZGxlWzBdLmhhc0F0dHJpYnV0ZSgnYXJpYS12YWx1ZW1pbicpKSB7XG4gICAgICAgICRoYW5kbGUuYXR0cih7XG4gICAgICAgICAgJ2FyaWEtdmFsdWVtaW4nIDogc2V0dGluZ3Muc3RhcnQsXG4gICAgICAgICAgJ2FyaWEtdmFsdWVtYXgnIDogc2V0dGluZ3MuZW5kXG4gICAgICAgIH0pO1xuICAgICAgfVxuICAgICAgJGhhbmRsZS5hdHRyKCdhcmlhLXZhbHVlbm93JywgdmFsdWUpO1xuXG4gICAgICBpZiAoc2V0dGluZ3MuZGlzcGxheV9zZWxlY3RvciAhPSAnJykge1xuICAgICAgICAkKHNldHRpbmdzLmRpc3BsYXlfc2VsZWN0b3IpLmVhY2goZnVuY3Rpb24gKCkge1xuICAgICAgICAgIGlmICh0aGlzLmhhc0F0dHJpYnV0ZSgndmFsdWUnKSkge1xuICAgICAgICAgICAgJCh0aGlzKS52YWwodmFsdWUpO1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAkKHRoaXMpLnRleHQodmFsdWUpO1xuICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgICB9XG5cbiAgICB9LFxuXG4gICAgbm9ybWFsaXplZF9wZXJjZW50YWdlIDogZnVuY3Rpb24gKHZhbCwgc3RhcnQsIGVuZCkge1xuICAgICAgcmV0dXJuIE1hdGgubWluKDEsICh2YWwgLSBzdGFydCkgLyAoZW5kIC0gc3RhcnQpKTtcbiAgICB9LFxuXG4gICAgbm9ybWFsaXplZF92YWx1ZSA6IGZ1bmN0aW9uICh2YWwsIHN0YXJ0LCBlbmQsIHN0ZXAsIHByZWNpc2lvbikge1xuICAgICAgdmFyIHJhbmdlID0gZW5kIC0gc3RhcnQsXG4gICAgICAgICAgcG9pbnQgPSB2YWwgKiByYW5nZSxcbiAgICAgICAgICBtb2QgPSAocG9pbnQgLSAocG9pbnQgJSBzdGVwKSkgLyBzdGVwLFxuICAgICAgICAgIHJlbSA9IHBvaW50ICUgc3RlcCxcbiAgICAgICAgICByb3VuZCA9ICggcmVtID49IHN0ZXAgKiAwLjUgPyBzdGVwIDogMCk7XG4gICAgICByZXR1cm4gKChtb2QgKiBzdGVwICsgcm91bmQpICsgc3RhcnQpLnRvRml4ZWQocHJlY2lzaW9uKTtcbiAgICB9LFxuXG4gICAgc2V0X3RyYW5zbGF0ZSA6IGZ1bmN0aW9uIChlbGUsIG9mZnNldCwgdmVydGljYWwpIHtcbiAgICAgIGlmICh2ZXJ0aWNhbCkge1xuICAgICAgICAkKGVsZSlcbiAgICAgICAgICAuY3NzKCctd2Via2l0LXRyYW5zZm9ybScsICd0cmFuc2xhdGVZKCcgKyBvZmZzZXQgKyAncHgpJylcbiAgICAgICAgICAuY3NzKCctbW96LXRyYW5zZm9ybScsICd0cmFuc2xhdGVZKCcgKyBvZmZzZXQgKyAncHgpJylcbiAgICAgICAgICAuY3NzKCctbXMtdHJhbnNmb3JtJywgJ3RyYW5zbGF0ZVkoJyArIG9mZnNldCArICdweCknKVxuICAgICAgICAgIC5jc3MoJy1vLXRyYW5zZm9ybScsICd0cmFuc2xhdGVZKCcgKyBvZmZzZXQgKyAncHgpJylcbiAgICAgICAgICAuY3NzKCd0cmFuc2Zvcm0nLCAndHJhbnNsYXRlWSgnICsgb2Zmc2V0ICsgJ3B4KScpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgJChlbGUpXG4gICAgICAgICAgLmNzcygnLXdlYmtpdC10cmFuc2Zvcm0nLCAndHJhbnNsYXRlWCgnICsgb2Zmc2V0ICsgJ3B4KScpXG4gICAgICAgICAgLmNzcygnLW1vei10cmFuc2Zvcm0nLCAndHJhbnNsYXRlWCgnICsgb2Zmc2V0ICsgJ3B4KScpXG4gICAgICAgICAgLmNzcygnLW1zLXRyYW5zZm9ybScsICd0cmFuc2xhdGVYKCcgKyBvZmZzZXQgKyAncHgpJylcbiAgICAgICAgICAuY3NzKCctby10cmFuc2Zvcm0nLCAndHJhbnNsYXRlWCgnICsgb2Zmc2V0ICsgJ3B4KScpXG4gICAgICAgICAgLmNzcygndHJhbnNmb3JtJywgJ3RyYW5zbGF0ZVgoJyArIG9mZnNldCArICdweCknKTtcbiAgICAgIH1cbiAgICB9LFxuXG4gICAgbGltaXRfdG8gOiBmdW5jdGlvbiAodmFsLCBtaW4sIG1heCkge1xuICAgICAgcmV0dXJuIE1hdGgubWluKE1hdGgubWF4KHZhbCwgbWluKSwgbWF4KTtcbiAgICB9LFxuXG4gICAgaW5pdGlhbGl6ZV9zZXR0aW5ncyA6IGZ1bmN0aW9uIChoYW5kbGUpIHtcbiAgICAgIHZhciBzZXR0aW5ncyA9ICQuZXh0ZW5kKHt9LCB0aGlzLnNldHRpbmdzLCB0aGlzLmRhdGFfb3B0aW9ucygkKGhhbmRsZSkucGFyZW50KCkpKSxcbiAgICAgICAgICBkZWNpbWFsX3BsYWNlc19tYXRjaF9yZXN1bHQ7XG5cbiAgICAgIGlmIChzZXR0aW5ncy5wcmVjaXNpb24gPT09IG51bGwpIHtcbiAgICAgICAgZGVjaW1hbF9wbGFjZXNfbWF0Y2hfcmVzdWx0ID0gKCcnICsgc2V0dGluZ3Muc3RlcCkubWF0Y2goL1xcLihbXFxkXSopLyk7XG4gICAgICAgIHNldHRpbmdzLnByZWNpc2lvbiA9IGRlY2ltYWxfcGxhY2VzX21hdGNoX3Jlc3VsdCAmJiBkZWNpbWFsX3BsYWNlc19tYXRjaF9yZXN1bHRbMV0gPyBkZWNpbWFsX3BsYWNlc19tYXRjaF9yZXN1bHRbMV0ubGVuZ3RoIDogMDtcbiAgICAgIH1cblxuICAgICAgaWYgKHNldHRpbmdzLnZlcnRpY2FsKSB7XG4gICAgICAgICQuZGF0YShoYW5kbGUsICdiYXJfbycsICQoaGFuZGxlKS5wYXJlbnQoKS5vZmZzZXQoKS50b3ApO1xuICAgICAgICAkLmRhdGEoaGFuZGxlLCAnYmFyX2wnLCAkKGhhbmRsZSkucGFyZW50KCkub3V0ZXJIZWlnaHQoKSk7XG4gICAgICAgICQuZGF0YShoYW5kbGUsICdoYW5kbGVfbycsICQoaGFuZGxlKS5vZmZzZXQoKS50b3ApO1xuICAgICAgICAkLmRhdGEoaGFuZGxlLCAnaGFuZGxlX2wnLCAkKGhhbmRsZSkub3V0ZXJIZWlnaHQoKSk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICAkLmRhdGEoaGFuZGxlLCAnYmFyX28nLCAkKGhhbmRsZSkucGFyZW50KCkub2Zmc2V0KCkubGVmdCk7XG4gICAgICAgICQuZGF0YShoYW5kbGUsICdiYXJfbCcsICQoaGFuZGxlKS5wYXJlbnQoKS5vdXRlcldpZHRoKCkpO1xuICAgICAgICAkLmRhdGEoaGFuZGxlLCAnaGFuZGxlX28nLCAkKGhhbmRsZSkub2Zmc2V0KCkubGVmdCk7XG4gICAgICAgICQuZGF0YShoYW5kbGUsICdoYW5kbGVfbCcsICQoaGFuZGxlKS5vdXRlcldpZHRoKCkpO1xuICAgICAgfVxuXG4gICAgICAkLmRhdGEoaGFuZGxlLCAnYmFyJywgJChoYW5kbGUpLnBhcmVudCgpKTtcbiAgICAgIHJldHVybiAkLmRhdGEoaGFuZGxlLCAnc2V0dGluZ3MnLCBzZXR0aW5ncyk7XG4gICAgfSxcblxuICAgIHNldF9pbml0aWFsX3Bvc2l0aW9uIDogZnVuY3Rpb24gKCRlbGUpIHtcbiAgICAgIHZhciBzZXR0aW5ncyA9ICQuZGF0YSgkZWxlLmNoaWxkcmVuKCcucmFuZ2Utc2xpZGVyLWhhbmRsZScpWzBdLCAnc2V0dGluZ3MnKSxcbiAgICAgICAgICBpbml0aWFsID0gKCh0eXBlb2Ygc2V0dGluZ3MuaW5pdGlhbCA9PSAnbnVtYmVyJyAmJiAhaXNOYU4oc2V0dGluZ3MuaW5pdGlhbCkpID8gc2V0dGluZ3MuaW5pdGlhbCA6IE1hdGguZmxvb3IoKHNldHRpbmdzLmVuZCAtIHNldHRpbmdzLnN0YXJ0KSAqIDAuNSAvIHNldHRpbmdzLnN0ZXApICogc2V0dGluZ3Muc3RlcCArIHNldHRpbmdzLnN0YXJ0KSxcbiAgICAgICAgICAkaGFuZGxlID0gJGVsZS5jaGlsZHJlbignLnJhbmdlLXNsaWRlci1oYW5kbGUnKTtcbiAgICAgIHRoaXMuc2V0X3VpKCRoYW5kbGUsIGluaXRpYWwpO1xuICAgIH0sXG5cbiAgICBzZXRfdmFsdWUgOiBmdW5jdGlvbiAodmFsdWUpIHtcbiAgICAgIHZhciBzZWxmID0gdGhpcztcbiAgICAgICQoJ1snICsgc2VsZi5hdHRyX25hbWUoKSArICddJywgdGhpcy5zY29wZSkuZWFjaChmdW5jdGlvbiAoKSB7XG4gICAgICAgICQodGhpcykuYXR0cihzZWxmLmF0dHJfbmFtZSgpLCB2YWx1ZSk7XG4gICAgICB9KTtcbiAgICAgIGlmICghISQodGhpcy5zY29wZSkuYXR0cihzZWxmLmF0dHJfbmFtZSgpKSkge1xuICAgICAgICAkKHRoaXMuc2NvcGUpLmF0dHIoc2VsZi5hdHRyX25hbWUoKSwgdmFsdWUpO1xuICAgICAgfVxuICAgICAgc2VsZi5yZWZsb3coKTtcbiAgICB9LFxuXG4gICAgcmVmbG93IDogZnVuY3Rpb24gKCkge1xuICAgICAgdmFyIHNlbGYgPSB0aGlzO1xuICAgICAgc2VsZi5TKCdbJyArIHRoaXMuYXR0cl9uYW1lKCkgKyAnXScpLmVhY2goZnVuY3Rpb24gKCkge1xuICAgICAgICB2YXIgaGFuZGxlID0gJCh0aGlzKS5jaGlsZHJlbignLnJhbmdlLXNsaWRlci1oYW5kbGUnKVswXSxcbiAgICAgICAgICAgIHZhbCA9ICQodGhpcykuYXR0cihzZWxmLmF0dHJfbmFtZSgpKTtcbiAgICAgICAgc2VsZi5pbml0aWFsaXplX3NldHRpbmdzKGhhbmRsZSk7XG5cbiAgICAgICAgaWYgKHZhbCkge1xuICAgICAgICAgIHNlbGYuc2V0X3VpKCQoaGFuZGxlKSwgcGFyc2VGbG9hdCh2YWwpKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBzZWxmLnNldF9pbml0aWFsX3Bvc2l0aW9uKCQodGhpcykpO1xuICAgICAgICB9XG4gICAgICB9KTtcbiAgICB9XG4gIH07XG5cbn0oalF1ZXJ5LCB3aW5kb3csIHdpbmRvdy5kb2N1bWVudCkpO1xuIl0sImZpbGUiOiJmb3VuZGF0aW9uL2pzL2ZvdW5kYXRpb24vZm91bmRhdGlvbi5zbGlkZXIuanMiLCJzb3VyY2VSb290IjoiL3NvdXJjZS8ifQ==