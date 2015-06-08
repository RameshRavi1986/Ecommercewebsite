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

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiIiwic291cmNlcyI6WyJmb3VuZGF0aW9uL2pzL2ZvdW5kYXRpb24vZm91bmRhdGlvbi5tYWdlbGxhbi5qcyJdLCJzb3VyY2VzQ29udGVudCI6WyI7KGZ1bmN0aW9uICgkLCB3aW5kb3csIGRvY3VtZW50LCB1bmRlZmluZWQpIHtcbiAgJ3VzZSBzdHJpY3QnO1xuXG4gIEZvdW5kYXRpb24ubGlic1snbWFnZWxsYW4tZXhwZWRpdGlvbiddID0ge1xuICAgIG5hbWUgOiAnbWFnZWxsYW4tZXhwZWRpdGlvbicsXG5cbiAgICB2ZXJzaW9uIDogJzUuNS4yJyxcblxuICAgIHNldHRpbmdzIDoge1xuICAgICAgYWN0aXZlX2NsYXNzIDogJ2FjdGl2ZScsXG4gICAgICB0aHJlc2hvbGQgOiAwLCAvLyBwaXhlbHMgZnJvbSB0aGUgdG9wIG9mIHRoZSBleHBlZGl0aW9uIGZvciBpdCB0byBiZWNvbWUgZml4ZXNcbiAgICAgIGRlc3RpbmF0aW9uX3RocmVzaG9sZCA6IDIwLCAvLyBwaXhlbHMgZnJvbSB0aGUgdG9wIG9mIGRlc3RpbmF0aW9uIGZvciBpdCB0byBiZSBjb25zaWRlcmVkIGFjdGl2ZVxuICAgICAgdGhyb3R0bGVfZGVsYXkgOiAzMCwgLy8gY2FsY3VsYXRpb24gdGhyb3R0bGluZyB0byBpbmNyZWFzZSBmcmFtZXJhdGVcbiAgICAgIGZpeGVkX3RvcCA6IDAsIC8vIHRvcCBkaXN0YW5jZSBpbiBwaXhlbHMgYXNzaWdlbmQgdG8gdGhlIGZpeGVkIGVsZW1lbnQgb24gc2Nyb2xsXG4gICAgICBvZmZzZXRfYnlfaGVpZ2h0IDogdHJ1ZSwgIC8vIHdoZXRoZXIgdG8gb2Zmc2V0IHRoZSBkZXN0aW5hdGlvbiBieSB0aGUgZXhwZWRpdGlvbiBoZWlnaHQuIFVzdWFsbHkgeW91IHdhbnQgdGhpcyB0byBiZSB0cnVlLCB1bmxlc3MgeW91ciBleHBlZGl0aW9uIGlzIG9uIHRoZSBzaWRlLlxuICAgICAgZHVyYXRpb24gOiA3MDAsIC8vIGFuaW1hdGlvbiBkdXJhdGlvbiB0aW1lXG4gICAgICBlYXNpbmcgOiAnc3dpbmcnIC8vIGFuaW1hdGlvbiBlYXNpbmdcbiAgICB9LFxuXG4gICAgaW5pdCA6IGZ1bmN0aW9uIChzY29wZSwgbWV0aG9kLCBvcHRpb25zKSB7XG4gICAgICBGb3VuZGF0aW9uLmluaGVyaXQodGhpcywgJ3Rocm90dGxlJyk7XG4gICAgICB0aGlzLmJpbmRpbmdzKG1ldGhvZCwgb3B0aW9ucyk7XG4gICAgfSxcblxuICAgIGV2ZW50cyA6IGZ1bmN0aW9uICgpIHtcbiAgICAgIHZhciBzZWxmID0gdGhpcyxcbiAgICAgICAgICBTID0gc2VsZi5TLFxuICAgICAgICAgIHNldHRpbmdzID0gc2VsZi5zZXR0aW5ncztcblxuICAgICAgLy8gaW5pdGlhbGl6ZSBleHBlZGl0aW9uIG9mZnNldFxuICAgICAgc2VsZi5zZXRfZXhwZWRpdGlvbl9wb3NpdGlvbigpO1xuXG4gICAgICBTKHNlbGYuc2NvcGUpXG4gICAgICAgIC5vZmYoJy5tYWdlbGxhbicpXG4gICAgICAgIC5vbignY2xpY2suZm5kdG4ubWFnZWxsYW4nLCAnWycgKyBzZWxmLmFkZF9uYW1lc3BhY2UoJ2RhdGEtbWFnZWxsYW4tYXJyaXZhbCcpICsgJ10gYVtocmVmKj0jXScsIGZ1bmN0aW9uIChlKSB7XG4gICAgICAgICAgdmFyIHNhbWVIb3N0ID0gKCh0aGlzLmhvc3RuYW1lID09PSBsb2NhdGlvbi5ob3N0bmFtZSkgfHwgIXRoaXMuaG9zdG5hbWUpLFxuICAgICAgICAgICAgICBzYW1lUGF0aCA9IHNlbGYuZmlsdGVyUGF0aG5hbWUobG9jYXRpb24ucGF0aG5hbWUpID09PSBzZWxmLmZpbHRlclBhdGhuYW1lKHRoaXMucGF0aG5hbWUpLFxuICAgICAgICAgICAgICB0ZXN0SGFzaCA9IHRoaXMuaGFzaC5yZXBsYWNlKC8oOnxcXC58XFwvKS9nLCAnXFxcXCQxJyksXG4gICAgICAgICAgICAgIGFuY2hvciA9IHRoaXM7XG5cbiAgICAgICAgICBpZiAoc2FtZUhvc3QgJiYgc2FtZVBhdGggJiYgdGVzdEhhc2gpIHtcbiAgICAgICAgICAgIGUucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgICAgIHZhciBleHBlZGl0aW9uID0gJCh0aGlzKS5jbG9zZXN0KCdbJyArIHNlbGYuYXR0cl9uYW1lKCkgKyAnXScpLFxuICAgICAgICAgICAgICAgIHNldHRpbmdzID0gZXhwZWRpdGlvbi5kYXRhKCdtYWdlbGxhbi1leHBlZGl0aW9uLWluaXQnKSxcbiAgICAgICAgICAgICAgICBoYXNoID0gdGhpcy5oYXNoLnNwbGl0KCcjJykuam9pbignJyksXG4gICAgICAgICAgICAgICAgdGFyZ2V0ID0gJCgnYVtuYW1lPVwiJyArIGhhc2ggKyAnXCJdJyk7XG5cbiAgICAgICAgICAgIGlmICh0YXJnZXQubGVuZ3RoID09PSAwKSB7XG4gICAgICAgICAgICAgIHRhcmdldCA9ICQoJyMnICsgaGFzaCk7XG5cbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgLy8gQWNjb3VudCBmb3IgZXhwZWRpdGlvbiBoZWlnaHQgaWYgZml4ZWQgcG9zaXRpb25cbiAgICAgICAgICAgIHZhciBzY3JvbGxfdG9wID0gdGFyZ2V0Lm9mZnNldCgpLnRvcCAtIHNldHRpbmdzLmRlc3RpbmF0aW9uX3RocmVzaG9sZCArIDE7XG4gICAgICAgICAgICBpZiAoc2V0dGluZ3Mub2Zmc2V0X2J5X2hlaWdodCkge1xuICAgICAgICAgICAgICBzY3JvbGxfdG9wID0gc2Nyb2xsX3RvcCAtIGV4cGVkaXRpb24ub3V0ZXJIZWlnaHQoKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgICQoJ2h0bWwsIGJvZHknKS5zdG9wKCkuYW5pbWF0ZSh7XG4gICAgICAgICAgICAgICdzY3JvbGxUb3AnIDogc2Nyb2xsX3RvcFxuICAgICAgICAgICAgfSwgc2V0dGluZ3MuZHVyYXRpb24sIHNldHRpbmdzLmVhc2luZywgZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICBpZiAoaGlzdG9yeS5wdXNoU3RhdGUpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGhpc3RvcnkucHVzaFN0YXRlKG51bGwsIG51bGwsIGFuY2hvci5wYXRobmFtZSArICcjJyArIGhhc2gpO1xuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgbG9jYXRpb24uaGFzaCA9IGFuY2hvci5wYXRobmFtZSArICcjJyArIGhhc2g7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgIH1cbiAgICAgICAgfSlcbiAgICAgICAgLm9uKCdzY3JvbGwuZm5kdG4ubWFnZWxsYW4nLCBzZWxmLnRocm90dGxlKHRoaXMuY2hlY2tfZm9yX2Fycml2YWxzLmJpbmQodGhpcyksIHNldHRpbmdzLnRocm90dGxlX2RlbGF5KSk7XG4gICAgfSxcblxuICAgIGNoZWNrX2Zvcl9hcnJpdmFscyA6IGZ1bmN0aW9uICgpIHtcbiAgICAgIHZhciBzZWxmID0gdGhpcztcbiAgICAgIHNlbGYudXBkYXRlX2Fycml2YWxzKCk7XG4gICAgICBzZWxmLnVwZGF0ZV9leHBlZGl0aW9uX3Bvc2l0aW9ucygpO1xuICAgIH0sXG5cbiAgICBzZXRfZXhwZWRpdGlvbl9wb3NpdGlvbiA6IGZ1bmN0aW9uICgpIHtcbiAgICAgIHZhciBzZWxmID0gdGhpcztcbiAgICAgICQoJ1snICsgdGhpcy5hdHRyX25hbWUoKSArICc9Zml4ZWRdJywgc2VsZi5zY29wZSkuZWFjaChmdW5jdGlvbiAoaWR4LCBlbCkge1xuICAgICAgICB2YXIgZXhwZWRpdGlvbiA9ICQodGhpcyksXG4gICAgICAgICAgICBzZXR0aW5ncyA9IGV4cGVkaXRpb24uZGF0YSgnbWFnZWxsYW4tZXhwZWRpdGlvbi1pbml0JyksXG4gICAgICAgICAgICBzdHlsZXMgPSBleHBlZGl0aW9uLmF0dHIoJ3N0eWxlcycpLCAvLyBzYXZlIHN0eWxlc1xuICAgICAgICAgICAgdG9wX29mZnNldCwgZml4ZWRfdG9wO1xuXG4gICAgICAgIGV4cGVkaXRpb24uYXR0cignc3R5bGUnLCAnJyk7XG4gICAgICAgIHRvcF9vZmZzZXQgPSBleHBlZGl0aW9uLm9mZnNldCgpLnRvcCArIHNldHRpbmdzLnRocmVzaG9sZDtcblxuICAgICAgICAvL3NldCBmaXhlZC10b3AgYnkgYXR0cmlidXRlXG4gICAgICAgIGZpeGVkX3RvcCA9IHBhcnNlSW50KGV4cGVkaXRpb24uZGF0YSgnbWFnZWxsYW4tZml4ZWQtdG9wJykpO1xuICAgICAgICBpZiAoIWlzTmFOKGZpeGVkX3RvcCkpIHtcbiAgICAgICAgICBzZWxmLnNldHRpbmdzLmZpeGVkX3RvcCA9IGZpeGVkX3RvcDtcbiAgICAgICAgfVxuXG4gICAgICAgIGV4cGVkaXRpb24uZGF0YShzZWxmLmRhdGFfYXR0cignbWFnZWxsYW4tdG9wLW9mZnNldCcpLCB0b3Bfb2Zmc2V0KTtcbiAgICAgICAgZXhwZWRpdGlvbi5hdHRyKCdzdHlsZScsIHN0eWxlcyk7XG4gICAgICB9KTtcbiAgICB9LFxuXG4gICAgdXBkYXRlX2V4cGVkaXRpb25fcG9zaXRpb25zIDogZnVuY3Rpb24gKCkge1xuICAgICAgdmFyIHNlbGYgPSB0aGlzLFxuICAgICAgICAgIHdpbmRvd190b3Bfb2Zmc2V0ID0gJCh3aW5kb3cpLnNjcm9sbFRvcCgpO1xuXG4gICAgICAkKCdbJyArIHRoaXMuYXR0cl9uYW1lKCkgKyAnPWZpeGVkXScsIHNlbGYuc2NvcGUpLmVhY2goZnVuY3Rpb24gKCkge1xuICAgICAgICB2YXIgZXhwZWRpdGlvbiA9ICQodGhpcyksXG4gICAgICAgICAgICBzZXR0aW5ncyA9IGV4cGVkaXRpb24uZGF0YSgnbWFnZWxsYW4tZXhwZWRpdGlvbi1pbml0JyksXG4gICAgICAgICAgICBzdHlsZXMgPSBleHBlZGl0aW9uLmF0dHIoJ3N0eWxlJyksIC8vIHNhdmUgc3R5bGVzXG4gICAgICAgICAgICB0b3Bfb2Zmc2V0ID0gZXhwZWRpdGlvbi5kYXRhKCdtYWdlbGxhbi10b3Atb2Zmc2V0Jyk7XG5cbiAgICAgICAgLy9zY3JvbGwgdG8gdGhlIHRvcCBkaXN0YW5jZVxuICAgICAgICBpZiAod2luZG93X3RvcF9vZmZzZXQgKyBzZWxmLnNldHRpbmdzLmZpeGVkX3RvcCA+PSB0b3Bfb2Zmc2V0KSB7XG4gICAgICAgICAgLy8gUGxhY2Vob2xkZXIgYWxsb3dzIGhlaWdodCBjYWxjdWxhdGlvbnMgdG8gYmUgY29uc2lzdGVudCBldmVuIHdoZW5cbiAgICAgICAgICAvLyBhcHBlYXJpbmcgdG8gc3dpdGNoIGJldHdlZW4gZml4ZWQvbm9uLWZpeGVkIHBsYWNlbWVudFxuICAgICAgICAgIHZhciBwbGFjZWhvbGRlciA9IGV4cGVkaXRpb24ucHJldignWycgKyBzZWxmLmFkZF9uYW1lc3BhY2UoJ2RhdGEtbWFnZWxsYW4tZXhwZWRpdGlvbi1jbG9uZScpICsgJ10nKTtcbiAgICAgICAgICBpZiAocGxhY2Vob2xkZXIubGVuZ3RoID09PSAwKSB7XG4gICAgICAgICAgICBwbGFjZWhvbGRlciA9IGV4cGVkaXRpb24uY2xvbmUoKTtcbiAgICAgICAgICAgIHBsYWNlaG9sZGVyLnJlbW92ZUF0dHIoc2VsZi5hdHRyX25hbWUoKSk7XG4gICAgICAgICAgICBwbGFjZWhvbGRlci5hdHRyKHNlbGYuYWRkX25hbWVzcGFjZSgnZGF0YS1tYWdlbGxhbi1leHBlZGl0aW9uLWNsb25lJyksICcnKTtcbiAgICAgICAgICAgIGV4cGVkaXRpb24uYmVmb3JlKHBsYWNlaG9sZGVyKTtcbiAgICAgICAgICB9XG4gICAgICAgICAgZXhwZWRpdGlvbi5jc3Moe3Bvc2l0aW9uIDonZml4ZWQnLCB0b3AgOiBzZXR0aW5ncy5maXhlZF90b3B9KS5hZGRDbGFzcygnZml4ZWQnKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBleHBlZGl0aW9uLnByZXYoJ1snICsgc2VsZi5hZGRfbmFtZXNwYWNlKCdkYXRhLW1hZ2VsbGFuLWV4cGVkaXRpb24tY2xvbmUnKSArICddJykucmVtb3ZlKCk7XG4gICAgICAgICAgZXhwZWRpdGlvbi5hdHRyKCdzdHlsZScsIHN0eWxlcykuY3NzKCdwb3NpdGlvbicsICcnKS5jc3MoJ3RvcCcsICcnKS5yZW1vdmVDbGFzcygnZml4ZWQnKTtcbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgfSxcblxuICAgIHVwZGF0ZV9hcnJpdmFscyA6IGZ1bmN0aW9uICgpIHtcbiAgICAgIHZhciBzZWxmID0gdGhpcyxcbiAgICAgICAgICB3aW5kb3dfdG9wX29mZnNldCA9ICQod2luZG93KS5zY3JvbGxUb3AoKTtcblxuICAgICAgJCgnWycgKyB0aGlzLmF0dHJfbmFtZSgpICsgJ10nLCBzZWxmLnNjb3BlKS5lYWNoKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgdmFyIGV4cGVkaXRpb24gPSAkKHRoaXMpLFxuICAgICAgICAgICAgc2V0dGluZ3MgPSBleHBlZGl0aW9uLmRhdGEoc2VsZi5hdHRyX25hbWUodHJ1ZSkgKyAnLWluaXQnKSxcbiAgICAgICAgICAgIG9mZnNldHMgPSBzZWxmLm9mZnNldHMoZXhwZWRpdGlvbiwgd2luZG93X3RvcF9vZmZzZXQpLFxuICAgICAgICAgICAgYXJyaXZhbHMgPSBleHBlZGl0aW9uLmZpbmQoJ1snICsgc2VsZi5hZGRfbmFtZXNwYWNlKCdkYXRhLW1hZ2VsbGFuLWFycml2YWwnKSArICddJyksXG4gICAgICAgICAgICBhY3RpdmVfaXRlbSA9IGZhbHNlO1xuICAgICAgICBvZmZzZXRzLmVhY2goZnVuY3Rpb24gKGlkeCwgaXRlbSkge1xuICAgICAgICAgIGlmIChpdGVtLnZpZXdwb3J0X29mZnNldCA+PSBpdGVtLnRvcF9vZmZzZXQpIHtcbiAgICAgICAgICAgIHZhciBhcnJpdmFscyA9IGV4cGVkaXRpb24uZmluZCgnWycgKyBzZWxmLmFkZF9uYW1lc3BhY2UoJ2RhdGEtbWFnZWxsYW4tYXJyaXZhbCcpICsgJ10nKTtcbiAgICAgICAgICAgIGFycml2YWxzLm5vdChpdGVtLmFycml2YWwpLnJlbW92ZUNsYXNzKHNldHRpbmdzLmFjdGl2ZV9jbGFzcyk7XG4gICAgICAgICAgICBpdGVtLmFycml2YWwuYWRkQ2xhc3Moc2V0dGluZ3MuYWN0aXZlX2NsYXNzKTtcbiAgICAgICAgICAgIGFjdGl2ZV9pdGVtID0gdHJ1ZTtcbiAgICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICAgIH1cbiAgICAgICAgfSk7XG5cbiAgICAgICAgaWYgKCFhY3RpdmVfaXRlbSkge1xuICAgICAgICAgIGFycml2YWxzLnJlbW92ZUNsYXNzKHNldHRpbmdzLmFjdGl2ZV9jbGFzcyk7XG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgIH0sXG5cbiAgICBvZmZzZXRzIDogZnVuY3Rpb24gKGV4cGVkaXRpb24sIHdpbmRvd19vZmZzZXQpIHtcbiAgICAgIHZhciBzZWxmID0gdGhpcyxcbiAgICAgICAgICBzZXR0aW5ncyA9IGV4cGVkaXRpb24uZGF0YShzZWxmLmF0dHJfbmFtZSh0cnVlKSArICctaW5pdCcpLFxuICAgICAgICAgIHZpZXdwb3J0X29mZnNldCA9IHdpbmRvd19vZmZzZXQ7XG5cbiAgICAgIHJldHVybiBleHBlZGl0aW9uLmZpbmQoJ1snICsgc2VsZi5hZGRfbmFtZXNwYWNlKCdkYXRhLW1hZ2VsbGFuLWFycml2YWwnKSArICddJykubWFwKGZ1bmN0aW9uIChpZHgsIGVsKSB7XG4gICAgICAgIHZhciBuYW1lID0gJCh0aGlzKS5kYXRhKHNlbGYuZGF0YV9hdHRyKCdtYWdlbGxhbi1hcnJpdmFsJykpLFxuICAgICAgICAgICAgZGVzdCA9ICQoJ1snICsgc2VsZi5hZGRfbmFtZXNwYWNlKCdkYXRhLW1hZ2VsbGFuLWRlc3RpbmF0aW9uJykgKyAnPScgKyBuYW1lICsgJ10nKTtcbiAgICAgICAgaWYgKGRlc3QubGVuZ3RoID4gMCkge1xuICAgICAgICAgIHZhciB0b3Bfb2Zmc2V0ID0gZGVzdC5vZmZzZXQoKS50b3AgLSBzZXR0aW5ncy5kZXN0aW5hdGlvbl90aHJlc2hvbGQ7XG4gICAgICAgICAgaWYgKHNldHRpbmdzLm9mZnNldF9ieV9oZWlnaHQpIHtcbiAgICAgICAgICAgIHRvcF9vZmZzZXQgPSB0b3Bfb2Zmc2V0IC0gZXhwZWRpdGlvbi5vdXRlckhlaWdodCgpO1xuICAgICAgICAgIH1cbiAgICAgICAgICB0b3Bfb2Zmc2V0ID0gTWF0aC5mbG9vcih0b3Bfb2Zmc2V0KTtcbiAgICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgZGVzdGluYXRpb24gOiBkZXN0LFxuICAgICAgICAgICAgYXJyaXZhbCA6ICQodGhpcyksXG4gICAgICAgICAgICB0b3Bfb2Zmc2V0IDogdG9wX29mZnNldCxcbiAgICAgICAgICAgIHZpZXdwb3J0X29mZnNldCA6IHZpZXdwb3J0X29mZnNldFxuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfSkuc29ydChmdW5jdGlvbiAoYSwgYikge1xuICAgICAgICBpZiAoYS50b3Bfb2Zmc2V0IDwgYi50b3Bfb2Zmc2V0KSB7XG4gICAgICAgICAgcmV0dXJuIC0xO1xuICAgICAgICB9XG4gICAgICAgIGlmIChhLnRvcF9vZmZzZXQgPiBiLnRvcF9vZmZzZXQpIHtcbiAgICAgICAgICByZXR1cm4gMTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gMDtcbiAgICAgIH0pO1xuICAgIH0sXG5cbiAgICBkYXRhX2F0dHIgOiBmdW5jdGlvbiAoc3RyKSB7XG4gICAgICBpZiAodGhpcy5uYW1lc3BhY2UubGVuZ3RoID4gMCkge1xuICAgICAgICByZXR1cm4gdGhpcy5uYW1lc3BhY2UgKyAnLScgKyBzdHI7XG4gICAgICB9XG5cbiAgICAgIHJldHVybiBzdHI7XG4gICAgfSxcblxuICAgIG9mZiA6IGZ1bmN0aW9uICgpIHtcbiAgICAgIHRoaXMuUyh0aGlzLnNjb3BlKS5vZmYoJy5tYWdlbGxhbicpO1xuICAgICAgdGhpcy5TKHdpbmRvdykub2ZmKCcubWFnZWxsYW4nKTtcbiAgICB9LFxuXG4gICAgZmlsdGVyUGF0aG5hbWUgOiBmdW5jdGlvbiAocGF0aG5hbWUpIHtcbiAgICAgIHBhdGhuYW1lID0gcGF0aG5hbWUgfHwgJyc7XG4gICAgICByZXR1cm4gcGF0aG5hbWVcbiAgICAgICAgICAucmVwbGFjZSgvXlxcLy8sJycpXG4gICAgICAgICAgLnJlcGxhY2UoLyg/OmluZGV4fGRlZmF1bHQpLlthLXpBLVpdezMsNH0kLywnJylcbiAgICAgICAgICAucmVwbGFjZSgvXFwvJC8sJycpO1xuICAgIH0sXG5cbiAgICByZWZsb3cgOiBmdW5jdGlvbiAoKSB7XG4gICAgICB2YXIgc2VsZiA9IHRoaXM7XG4gICAgICAvLyByZW1vdmUgcGxhY2Vob2xkZXIgZXhwZWRpdGlvbnMgdXNlZCBmb3IgaGVpZ2h0IGNhbGN1bGF0aW9uIHB1cnBvc2VzXG4gICAgICAkKCdbJyArIHNlbGYuYWRkX25hbWVzcGFjZSgnZGF0YS1tYWdlbGxhbi1leHBlZGl0aW9uLWNsb25lJykgKyAnXScsIHNlbGYuc2NvcGUpLnJlbW92ZSgpO1xuICAgIH1cbiAgfTtcbn0oalF1ZXJ5LCB3aW5kb3csIHdpbmRvdy5kb2N1bWVudCkpO1xuIl0sImZpbGUiOiJmb3VuZGF0aW9uL2pzL2ZvdW5kYXRpb24vZm91bmRhdGlvbi5tYWdlbGxhbi5qcyIsInNvdXJjZVJvb3QiOiIvc291cmNlLyJ9