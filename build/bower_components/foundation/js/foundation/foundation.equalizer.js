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

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiIiwic291cmNlcyI6WyJmb3VuZGF0aW9uL2pzL2ZvdW5kYXRpb24vZm91bmRhdGlvbi5lcXVhbGl6ZXIuanMiXSwic291cmNlc0NvbnRlbnQiOlsiOyhmdW5jdGlvbiAoJCwgd2luZG93LCBkb2N1bWVudCwgdW5kZWZpbmVkKSB7XG4gICd1c2Ugc3RyaWN0JztcblxuICBGb3VuZGF0aW9uLmxpYnMuZXF1YWxpemVyID0ge1xuICAgIG5hbWUgOiAnZXF1YWxpemVyJyxcblxuICAgIHZlcnNpb24gOiAnNS41LjInLFxuXG4gICAgc2V0dGluZ3MgOiB7XG4gICAgICB1c2VfdGFsbGVzdCA6IHRydWUsXG4gICAgICBiZWZvcmVfaGVpZ2h0X2NoYW5nZSA6ICQubm9vcCxcbiAgICAgIGFmdGVyX2hlaWdodF9jaGFuZ2UgOiAkLm5vb3AsXG4gICAgICBlcXVhbGl6ZV9vbl9zdGFjayA6IGZhbHNlLFxuICAgICAgYWN0X29uX2hpZGRlbl9lbDogZmFsc2VcbiAgICB9LFxuXG4gICAgaW5pdCA6IGZ1bmN0aW9uIChzY29wZSwgbWV0aG9kLCBvcHRpb25zKSB7XG4gICAgICBGb3VuZGF0aW9uLmluaGVyaXQodGhpcywgJ2ltYWdlX2xvYWRlZCcpO1xuICAgICAgdGhpcy5iaW5kaW5ncyhtZXRob2QsIG9wdGlvbnMpO1xuICAgICAgdGhpcy5yZWZsb3coKTtcbiAgICB9LFxuXG4gICAgZXZlbnRzIDogZnVuY3Rpb24gKCkge1xuICAgICAgdGhpcy5TKHdpbmRvdykub2ZmKCcuZXF1YWxpemVyJykub24oJ3Jlc2l6ZS5mbmR0bi5lcXVhbGl6ZXInLCBmdW5jdGlvbiAoZSkge1xuICAgICAgICB0aGlzLnJlZmxvdygpO1xuICAgICAgfS5iaW5kKHRoaXMpKTtcbiAgICB9LFxuXG4gICAgZXF1YWxpemUgOiBmdW5jdGlvbiAoZXF1YWxpemVyKSB7XG4gICAgICB2YXIgaXNTdGFja2VkID0gZmFsc2UsXG4gICAgICAgICAgZ3JvdXAgPSBlcXVhbGl6ZXIuZGF0YSgnZXF1YWxpemVyJyksXG4gICAgICAgICAgc2V0dGluZ3MgPSBlcXVhbGl6ZXIuZGF0YSh0aGlzLmF0dHJfbmFtZSh0cnVlKSsnLWluaXQnKSB8fCB0aGlzLnNldHRpbmdzLFxuICAgICAgICAgIHZhbHMsXG4gICAgICAgICAgZmlyc3RUb3BPZmZzZXQ7XG5cbiAgICAgIGlmIChzZXR0aW5ncy5hY3Rfb25faGlkZGVuX2VsKSB7XG4gICAgICAgIHZhbHMgPSBncm91cCA/IGVxdWFsaXplci5maW5kKCdbJyt0aGlzLmF0dHJfbmFtZSgpKyctd2F0Y2g9XCInK2dyb3VwKydcIl0nKSA6IGVxdWFsaXplci5maW5kKCdbJyt0aGlzLmF0dHJfbmFtZSgpKyctd2F0Y2hdJyk7XG4gICAgICB9XG4gICAgICBlbHNlIHtcbiAgICAgICAgdmFscyA9IGdyb3VwID8gZXF1YWxpemVyLmZpbmQoJ1snK3RoaXMuYXR0cl9uYW1lKCkrJy13YXRjaD1cIicrZ3JvdXArJ1wiXTp2aXNpYmxlJykgOiBlcXVhbGl6ZXIuZmluZCgnWycrdGhpcy5hdHRyX25hbWUoKSsnLXdhdGNoXTp2aXNpYmxlJyk7XG4gICAgICB9XG4gICAgICBcbiAgICAgIGlmICh2YWxzLmxlbmd0aCA9PT0gMCkge1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG5cbiAgICAgIHNldHRpbmdzLmJlZm9yZV9oZWlnaHRfY2hhbmdlKCk7XG4gICAgICBlcXVhbGl6ZXIudHJpZ2dlcignYmVmb3JlLWhlaWdodC1jaGFuZ2UuZm5kdGguZXF1YWxpemVyJyk7XG4gICAgICB2YWxzLmhlaWdodCgnaW5oZXJpdCcpO1xuXG4gICAgICBpZiAoc2V0dGluZ3MuZXF1YWxpemVfb25fc3RhY2sgPT09IGZhbHNlKSB7XG4gICAgICAgIGZpcnN0VG9wT2Zmc2V0ID0gdmFscy5maXJzdCgpLm9mZnNldCgpLnRvcDtcbiAgICAgICAgdmFscy5lYWNoKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICBpZiAoJCh0aGlzKS5vZmZzZXQoKS50b3AgIT09IGZpcnN0VG9wT2Zmc2V0KSB7XG4gICAgICAgICAgICBpc1N0YWNrZWQgPSB0cnVlO1xuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgICAgIGlmIChpc1N0YWNrZWQpIHtcbiAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgdmFyIGhlaWdodHMgPSB2YWxzLm1hcChmdW5jdGlvbiAoKSB7IHJldHVybiAkKHRoaXMpLm91dGVySGVpZ2h0KGZhbHNlKSB9KS5nZXQoKTtcblxuICAgICAgaWYgKHNldHRpbmdzLnVzZV90YWxsZXN0KSB7XG4gICAgICAgIHZhciBtYXggPSBNYXRoLm1heC5hcHBseShudWxsLCBoZWlnaHRzKTtcbiAgICAgICAgdmFscy5jc3MoJ2hlaWdodCcsIG1heCk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB2YXIgbWluID0gTWF0aC5taW4uYXBwbHkobnVsbCwgaGVpZ2h0cyk7XG4gICAgICAgIHZhbHMuY3NzKCdoZWlnaHQnLCBtaW4pO1xuICAgICAgfVxuXG4gICAgICBzZXR0aW5ncy5hZnRlcl9oZWlnaHRfY2hhbmdlKCk7XG4gICAgICBlcXVhbGl6ZXIudHJpZ2dlcignYWZ0ZXItaGVpZ2h0LWNoYW5nZS5mbmR0bi5lcXVhbGl6ZXInKTtcbiAgICB9LFxuXG4gICAgcmVmbG93IDogZnVuY3Rpb24gKCkge1xuICAgICAgdmFyIHNlbGYgPSB0aGlzO1xuXG4gICAgICB0aGlzLlMoJ1snICsgdGhpcy5hdHRyX25hbWUoKSArICddJywgdGhpcy5zY29wZSkuZWFjaChmdW5jdGlvbiAoKSB7XG4gICAgICAgIHZhciAkZXFfdGFyZ2V0ID0gJCh0aGlzKSxcbiAgICAgICAgICAgIG1lZGlhX3F1ZXJ5ID0gJGVxX3RhcmdldC5kYXRhKCdlcXVhbGl6ZXItbXEnKSxcbiAgICAgICAgICAgIGlnbm9yZV9tZWRpYV9xdWVyeSA9IHRydWU7XG5cbiAgICAgICAgaWYgKG1lZGlhX3F1ZXJ5KSB7XG4gICAgICAgICAgbWVkaWFfcXVlcnkgPSAnaXNfJyArIG1lZGlhX3F1ZXJ5LnJlcGxhY2UoLy0vZywgJ18nKTtcbiAgICAgICAgICBpZiAoRm91bmRhdGlvbi51dGlscy5oYXNPd25Qcm9wZXJ0eShtZWRpYV9xdWVyeSkpIHtcbiAgICAgICAgICAgIGlnbm9yZV9tZWRpYV9xdWVyeSA9IGZhbHNlO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIHNlbGYuaW1hZ2VfbG9hZGVkKHNlbGYuUygnaW1nJywgdGhpcyksIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICBpZiAoaWdub3JlX21lZGlhX3F1ZXJ5IHx8IEZvdW5kYXRpb24udXRpbHNbbWVkaWFfcXVlcnldKCkpIHtcbiAgICAgICAgICAgIHNlbGYuZXF1YWxpemUoJGVxX3RhcmdldClcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdmFyIHZhbHMgPSAkZXFfdGFyZ2V0LmZpbmQoJ1snICsgc2VsZi5hdHRyX25hbWUoKSArICctd2F0Y2hdOnZpc2libGUnKTtcbiAgICAgICAgICAgIHZhbHMuY3NzKCdoZWlnaHQnLCAnYXV0bycpO1xuICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgICB9KTtcbiAgICB9XG4gIH07XG59KShqUXVlcnksIHdpbmRvdywgd2luZG93LmRvY3VtZW50KTtcbiJdLCJmaWxlIjoiZm91bmRhdGlvbi9qcy9mb3VuZGF0aW9uL2ZvdW5kYXRpb24uZXF1YWxpemVyLmpzIiwic291cmNlUm9vdCI6Ii9zb3VyY2UvIn0=