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

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiIiwic291cmNlcyI6WyJmb3VuZGF0aW9uL2pzL2ZvdW5kYXRpb24vZm91bmRhdGlvbi5yZXZlYWwuanMiXSwic291cmNlc0NvbnRlbnQiOlsiOyhmdW5jdGlvbiAoJCwgd2luZG93LCBkb2N1bWVudCwgdW5kZWZpbmVkKSB7XG4gICd1c2Ugc3RyaWN0JztcblxuICBGb3VuZGF0aW9uLmxpYnMucmV2ZWFsID0ge1xuICAgIG5hbWUgOiAncmV2ZWFsJyxcblxuICAgIHZlcnNpb24gOiAnNS41LjInLFxuXG4gICAgbG9ja2VkIDogZmFsc2UsXG5cbiAgICBzZXR0aW5ncyA6IHtcbiAgICAgIGFuaW1hdGlvbiA6ICdmYWRlQW5kUG9wJyxcbiAgICAgIGFuaW1hdGlvbl9zcGVlZCA6IDI1MCxcbiAgICAgIGNsb3NlX29uX2JhY2tncm91bmRfY2xpY2sgOiB0cnVlLFxuICAgICAgY2xvc2Vfb25fZXNjIDogdHJ1ZSxcbiAgICAgIGRpc21pc3NfbW9kYWxfY2xhc3MgOiAnY2xvc2UtcmV2ZWFsLW1vZGFsJyxcbiAgICAgIG11bHRpcGxlX29wZW5lZCA6IGZhbHNlLFxuICAgICAgYmdfY2xhc3MgOiAncmV2ZWFsLW1vZGFsLWJnJyxcbiAgICAgIHJvb3RfZWxlbWVudCA6ICdib2R5JyxcbiAgICAgIG9wZW4gOiBmdW5jdGlvbigpe30sXG4gICAgICBvcGVuZWQgOiBmdW5jdGlvbigpe30sXG4gICAgICBjbG9zZSA6IGZ1bmN0aW9uKCl7fSxcbiAgICAgIGNsb3NlZCA6IGZ1bmN0aW9uKCl7fSxcbiAgICAgIG9uX2FqYXhfZXJyb3I6ICQubm9vcCxcbiAgICAgIGJnIDogJCgnLnJldmVhbC1tb2RhbC1iZycpLFxuICAgICAgY3NzIDoge1xuICAgICAgICBvcGVuIDoge1xuICAgICAgICAgICdvcGFjaXR5JyA6IDAsXG4gICAgICAgICAgJ3Zpc2liaWxpdHknIDogJ3Zpc2libGUnLFxuICAgICAgICAgICdkaXNwbGF5JyA6ICdibG9jaydcbiAgICAgICAgfSxcbiAgICAgICAgY2xvc2UgOiB7XG4gICAgICAgICAgJ29wYWNpdHknIDogMSxcbiAgICAgICAgICAndmlzaWJpbGl0eScgOiAnaGlkZGVuJyxcbiAgICAgICAgICAnZGlzcGxheScgOiAnbm9uZSdcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH0sXG5cbiAgICBpbml0IDogZnVuY3Rpb24gKHNjb3BlLCBtZXRob2QsIG9wdGlvbnMpIHtcbiAgICAgICQuZXh0ZW5kKHRydWUsIHRoaXMuc2V0dGluZ3MsIG1ldGhvZCwgb3B0aW9ucyk7XG4gICAgICB0aGlzLmJpbmRpbmdzKG1ldGhvZCwgb3B0aW9ucyk7XG4gICAgfSxcblxuICAgIGV2ZW50cyA6IGZ1bmN0aW9uIChzY29wZSkge1xuICAgICAgdmFyIHNlbGYgPSB0aGlzLFxuICAgICAgICAgIFMgPSBzZWxmLlM7XG5cbiAgICAgIFModGhpcy5zY29wZSlcbiAgICAgICAgLm9mZignLnJldmVhbCcpXG4gICAgICAgIC5vbignY2xpY2suZm5kdG4ucmV2ZWFsJywgJ1snICsgdGhpcy5hZGRfbmFtZXNwYWNlKCdkYXRhLXJldmVhbC1pZCcpICsgJ106bm90KFtkaXNhYmxlZF0pJywgZnVuY3Rpb24gKGUpIHtcbiAgICAgICAgICBlLnByZXZlbnREZWZhdWx0KCk7XG5cbiAgICAgICAgICBpZiAoIXNlbGYubG9ja2VkKSB7XG4gICAgICAgICAgICB2YXIgZWxlbWVudCA9IFModGhpcyksXG4gICAgICAgICAgICAgICAgYWpheCA9IGVsZW1lbnQuZGF0YShzZWxmLmRhdGFfYXR0cigncmV2ZWFsLWFqYXgnKSksXG4gICAgICAgICAgICAgICAgcmVwbGFjZUNvbnRlbnRTZWwgPSBlbGVtZW50LmRhdGEoc2VsZi5kYXRhX2F0dHIoJ3JldmVhbC1yZXBsYWNlLWNvbnRlbnQnKSk7XG5cbiAgICAgICAgICAgIHNlbGYubG9ja2VkID0gdHJ1ZTtcblxuICAgICAgICAgICAgaWYgKHR5cGVvZiBhamF4ID09PSAndW5kZWZpbmVkJykge1xuICAgICAgICAgICAgICBzZWxmLm9wZW4uY2FsbChzZWxmLCBlbGVtZW50KTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgIHZhciB1cmwgPSBhamF4ID09PSB0cnVlID8gZWxlbWVudC5hdHRyKCdocmVmJykgOiBhamF4O1xuICAgICAgICAgICAgICBzZWxmLm9wZW4uY2FsbChzZWxmLCBlbGVtZW50LCB7dXJsIDogdXJsfSwgeyByZXBsYWNlQ29udGVudFNlbCA6IHJlcGxhY2VDb250ZW50U2VsIH0pO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgfSk7XG5cbiAgICAgIFMoZG9jdW1lbnQpXG4gICAgICAgIC5vbignY2xpY2suZm5kdG4ucmV2ZWFsJywgdGhpcy5jbG9zZV90YXJnZXRzKCksIGZ1bmN0aW9uIChlKSB7XG4gICAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgICAgIGlmICghc2VsZi5sb2NrZWQpIHtcbiAgICAgICAgICAgIHZhciBzZXR0aW5ncyA9IFMoJ1snICsgc2VsZi5hdHRyX25hbWUoKSArICddLm9wZW4nKS5kYXRhKHNlbGYuYXR0cl9uYW1lKHRydWUpICsgJy1pbml0JykgfHwgc2VsZi5zZXR0aW5ncyxcbiAgICAgICAgICAgICAgICBiZ19jbGlja2VkID0gUyhlLnRhcmdldClbMF0gPT09IFMoJy4nICsgc2V0dGluZ3MuYmdfY2xhc3MpWzBdO1xuXG4gICAgICAgICAgICBpZiAoYmdfY2xpY2tlZCkge1xuICAgICAgICAgICAgICBpZiAoc2V0dGluZ3MuY2xvc2Vfb25fYmFja2dyb3VuZF9jbGljaykge1xuICAgICAgICAgICAgICAgIGUuc3RvcFByb3BhZ2F0aW9uKCk7XG4gICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHNlbGYubG9ja2VkID0gdHJ1ZTtcbiAgICAgICAgICAgIHNlbGYuY2xvc2UuY2FsbChzZWxmLCBiZ19jbGlja2VkID8gUygnWycgKyBzZWxmLmF0dHJfbmFtZSgpICsgJ10ub3Blbjpub3QoLnRvYmFjayknKSA6IFModGhpcykuY2xvc2VzdCgnWycgKyBzZWxmLmF0dHJfbmFtZSgpICsgJ10nKSk7XG4gICAgICAgICAgfVxuICAgICAgICB9KTtcblxuICAgICAgaWYgKFMoJ1snICsgc2VsZi5hdHRyX25hbWUoKSArICddJywgdGhpcy5zY29wZSkubGVuZ3RoID4gMCkge1xuICAgICAgICBTKHRoaXMuc2NvcGUpXG4gICAgICAgICAgLy8gLm9mZignLnJldmVhbCcpXG4gICAgICAgICAgLm9uKCdvcGVuLmZuZHRuLnJldmVhbCcsIHRoaXMuc2V0dGluZ3Mub3BlbilcbiAgICAgICAgICAub24oJ29wZW5lZC5mbmR0bi5yZXZlYWwnLCB0aGlzLnNldHRpbmdzLm9wZW5lZClcbiAgICAgICAgICAub24oJ29wZW5lZC5mbmR0bi5yZXZlYWwnLCB0aGlzLm9wZW5fdmlkZW8pXG4gICAgICAgICAgLm9uKCdjbG9zZS5mbmR0bi5yZXZlYWwnLCB0aGlzLnNldHRpbmdzLmNsb3NlKVxuICAgICAgICAgIC5vbignY2xvc2VkLmZuZHRuLnJldmVhbCcsIHRoaXMuc2V0dGluZ3MuY2xvc2VkKVxuICAgICAgICAgIC5vbignY2xvc2VkLmZuZHRuLnJldmVhbCcsIHRoaXMuY2xvc2VfdmlkZW8pO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgUyh0aGlzLnNjb3BlKVxuICAgICAgICAgIC8vIC5vZmYoJy5yZXZlYWwnKVxuICAgICAgICAgIC5vbignb3Blbi5mbmR0bi5yZXZlYWwnLCAnWycgKyBzZWxmLmF0dHJfbmFtZSgpICsgJ10nLCB0aGlzLnNldHRpbmdzLm9wZW4pXG4gICAgICAgICAgLm9uKCdvcGVuZWQuZm5kdG4ucmV2ZWFsJywgJ1snICsgc2VsZi5hdHRyX25hbWUoKSArICddJywgdGhpcy5zZXR0aW5ncy5vcGVuZWQpXG4gICAgICAgICAgLm9uKCdvcGVuZWQuZm5kdG4ucmV2ZWFsJywgJ1snICsgc2VsZi5hdHRyX25hbWUoKSArICddJywgdGhpcy5vcGVuX3ZpZGVvKVxuICAgICAgICAgIC5vbignY2xvc2UuZm5kdG4ucmV2ZWFsJywgJ1snICsgc2VsZi5hdHRyX25hbWUoKSArICddJywgdGhpcy5zZXR0aW5ncy5jbG9zZSlcbiAgICAgICAgICAub24oJ2Nsb3NlZC5mbmR0bi5yZXZlYWwnLCAnWycgKyBzZWxmLmF0dHJfbmFtZSgpICsgJ10nLCB0aGlzLnNldHRpbmdzLmNsb3NlZClcbiAgICAgICAgICAub24oJ2Nsb3NlZC5mbmR0bi5yZXZlYWwnLCAnWycgKyBzZWxmLmF0dHJfbmFtZSgpICsgJ10nLCB0aGlzLmNsb3NlX3ZpZGVvKTtcbiAgICAgIH1cblxuICAgICAgcmV0dXJuIHRydWU7XG4gICAgfSxcblxuICAgIC8vIFBBVENIICMzOiB0dXJuaW5nIG9uIGtleSB1cCBjYXB0dXJlIG9ubHkgd2hlbiBhIHJldmVhbCB3aW5kb3cgaXMgb3BlblxuICAgIGtleV91cF9vbiA6IGZ1bmN0aW9uIChzY29wZSkge1xuICAgICAgdmFyIHNlbGYgPSB0aGlzO1xuXG4gICAgICAvLyBQQVRDSCAjMTogZml4aW5nIG11bHRpcGxlIGtleXVwIGV2ZW50IHRyaWdnZXIgZnJvbSBzaW5nbGUga2V5IHByZXNzXG4gICAgICBzZWxmLlMoJ2JvZHknKS5vZmYoJ2tleXVwLmZuZHRuLnJldmVhbCcpLm9uKCdrZXl1cC5mbmR0bi5yZXZlYWwnLCBmdW5jdGlvbiAoIGV2ZW50ICkge1xuICAgICAgICB2YXIgb3Blbl9tb2RhbCA9IHNlbGYuUygnWycgKyBzZWxmLmF0dHJfbmFtZSgpICsgJ10ub3BlbicpLFxuICAgICAgICAgICAgc2V0dGluZ3MgPSBvcGVuX21vZGFsLmRhdGEoc2VsZi5hdHRyX25hbWUodHJ1ZSkgKyAnLWluaXQnKSB8fCBzZWxmLnNldHRpbmdzIDtcbiAgICAgICAgLy8gUEFUQ0ggIzI6IG1ha2luZyBzdXJlIHRoYXQgdGhlIGNsb3NlIGV2ZW50IGNhbiBiZSBjYWxsZWQgb25seSB3aGlsZSB1bmxvY2tlZCxcbiAgICAgICAgLy8gICAgICAgICAgIHNvIHRoYXQgbXVsdGlwbGUga2V5dXAuZm5kdG4ucmV2ZWFsIGV2ZW50cyBkb24ndCBwcmV2ZW50IGNsZWFuIGNsb3Npbmcgb2YgdGhlIHJldmVhbCB3aW5kb3cuXG4gICAgICAgIGlmICggc2V0dGluZ3MgJiYgZXZlbnQud2hpY2ggPT09IDI3ICAmJiBzZXR0aW5ncy5jbG9zZV9vbl9lc2MgJiYgIXNlbGYubG9ja2VkKSB7IC8vIDI3IGlzIHRoZSBrZXljb2RlIGZvciB0aGUgRXNjYXBlIGtleVxuICAgICAgICAgIHNlbGYuY2xvc2UuY2FsbChzZWxmLCBvcGVuX21vZGFsKTtcbiAgICAgICAgfVxuICAgICAgfSk7XG5cbiAgICAgIHJldHVybiB0cnVlO1xuICAgIH0sXG5cbiAgICAvLyBQQVRDSCAjMzogdHVybmluZyBvbiBrZXkgdXAgY2FwdHVyZSBvbmx5IHdoZW4gYSByZXZlYWwgd2luZG93IGlzIG9wZW5cbiAgICBrZXlfdXBfb2ZmIDogZnVuY3Rpb24gKHNjb3BlKSB7XG4gICAgICB0aGlzLlMoJ2JvZHknKS5vZmYoJ2tleXVwLmZuZHRuLnJldmVhbCcpO1xuICAgICAgcmV0dXJuIHRydWU7XG4gICAgfSxcblxuICAgIG9wZW4gOiBmdW5jdGlvbiAodGFyZ2V0LCBhamF4X3NldHRpbmdzKSB7XG4gICAgICB2YXIgc2VsZiA9IHRoaXMsXG4gICAgICAgICAgbW9kYWw7XG5cbiAgICAgIGlmICh0YXJnZXQpIHtcbiAgICAgICAgaWYgKHR5cGVvZiB0YXJnZXQuc2VsZWN0b3IgIT09ICd1bmRlZmluZWQnKSB7XG4gICAgICAgICAgLy8gRmluZCB0aGUgbmFtZWQgbm9kZTsgb25seSB1c2UgdGhlIGZpcnN0IG9uZSBmb3VuZCwgc2luY2UgdGhlIHJlc3Qgb2YgdGhlIGNvZGUgYXNzdW1lcyB0aGVyZSdzIG9ubHkgb25lIG5vZGVcbiAgICAgICAgICBtb2RhbCA9IHNlbGYuUygnIycgKyB0YXJnZXQuZGF0YShzZWxmLmRhdGFfYXR0cigncmV2ZWFsLWlkJykpKS5maXJzdCgpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIG1vZGFsID0gc2VsZi5TKHRoaXMuc2NvcGUpO1xuXG4gICAgICAgICAgYWpheF9zZXR0aW5ncyA9IHRhcmdldDtcbiAgICAgICAgfVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgbW9kYWwgPSBzZWxmLlModGhpcy5zY29wZSk7XG4gICAgICB9XG5cbiAgICAgIHZhciBzZXR0aW5ncyA9IG1vZGFsLmRhdGEoc2VsZi5hdHRyX25hbWUodHJ1ZSkgKyAnLWluaXQnKTtcbiAgICAgIHNldHRpbmdzID0gc2V0dGluZ3MgfHwgdGhpcy5zZXR0aW5ncztcblxuXG4gICAgICBpZiAobW9kYWwuaGFzQ2xhc3MoJ29wZW4nKSAmJiB0YXJnZXQuYXR0cignZGF0YS1yZXZlYWwtaWQnKSA9PSBtb2RhbC5hdHRyKCdpZCcpKSB7XG4gICAgICAgIHJldHVybiBzZWxmLmNsb3NlKG1vZGFsKTtcbiAgICAgIH1cblxuICAgICAgaWYgKCFtb2RhbC5oYXNDbGFzcygnb3BlbicpKSB7XG4gICAgICAgIHZhciBvcGVuX21vZGFsID0gc2VsZi5TKCdbJyArIHNlbGYuYXR0cl9uYW1lKCkgKyAnXS5vcGVuJyk7XG5cbiAgICAgICAgaWYgKHR5cGVvZiBtb2RhbC5kYXRhKCdjc3MtdG9wJykgPT09ICd1bmRlZmluZWQnKSB7XG4gICAgICAgICAgbW9kYWwuZGF0YSgnY3NzLXRvcCcsIHBhcnNlSW50KG1vZGFsLmNzcygndG9wJyksIDEwKSlcbiAgICAgICAgICAgIC5kYXRhKCdvZmZzZXQnLCB0aGlzLmNhY2hlX29mZnNldChtb2RhbCkpO1xuICAgICAgICB9XG5cbiAgICAgICAgbW9kYWwuYXR0cigndGFiaW5kZXgnLCcwJykuYXR0cignYXJpYS1oaWRkZW4nLCdmYWxzZScpO1xuXG4gICAgICAgIHRoaXMua2V5X3VwX29uKG1vZGFsKTsgICAgLy8gUEFUQ0ggIzM6IHR1cm5pbmcgb24ga2V5IHVwIGNhcHR1cmUgb25seSB3aGVuIGEgcmV2ZWFsIHdpbmRvdyBpcyBvcGVuXG5cbiAgICAgICAgLy8gUHJldmVudCBuYW1lc3BhY2UgZXZlbnQgZnJvbSB0cmlnZ2VyaW5nIHR3aWNlXG4gICAgICAgIG1vZGFsLm9uKCdvcGVuLmZuZHRuLnJldmVhbCcsIGZ1bmN0aW9uKGUpIHtcbiAgICAgICAgICBpZiAoZS5uYW1lc3BhY2UgIT09ICdmbmR0bi5yZXZlYWwnKSByZXR1cm47XG4gICAgICAgIH0pO1xuXG4gICAgICAgIG1vZGFsLm9uKCdvcGVuLmZuZHRuLnJldmVhbCcpLnRyaWdnZXIoJ29wZW4uZm5kdG4ucmV2ZWFsJyk7XG5cbiAgICAgICAgaWYgKG9wZW5fbW9kYWwubGVuZ3RoIDwgMSkge1xuICAgICAgICAgIHRoaXMudG9nZ2xlX2JnKG1vZGFsLCB0cnVlKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmICh0eXBlb2YgYWpheF9zZXR0aW5ncyA9PT0gJ3N0cmluZycpIHtcbiAgICAgICAgICBhamF4X3NldHRpbmdzID0ge1xuICAgICAgICAgICAgdXJsIDogYWpheF9zZXR0aW5nc1xuICAgICAgICAgIH07XG4gICAgICAgIH1cblxuICAgICAgICBpZiAodHlwZW9mIGFqYXhfc2V0dGluZ3MgPT09ICd1bmRlZmluZWQnIHx8ICFhamF4X3NldHRpbmdzLnVybCkge1xuICAgICAgICAgIGlmIChvcGVuX21vZGFsLmxlbmd0aCA+IDApIHtcbiAgICAgICAgICAgIGlmIChzZXR0aW5ncy5tdWx0aXBsZV9vcGVuZWQpIHtcbiAgICAgICAgICAgICAgc2VsZi50b19iYWNrKG9wZW5fbW9kYWwpO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgc2VsZi5oaWRlKG9wZW5fbW9kYWwsIHNldHRpbmdzLmNzcy5jbG9zZSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgdGhpcy5zaG93KG1vZGFsLCBzZXR0aW5ncy5jc3Mub3Blbik7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgdmFyIG9sZF9zdWNjZXNzID0gdHlwZW9mIGFqYXhfc2V0dGluZ3Muc3VjY2VzcyAhPT0gJ3VuZGVmaW5lZCcgPyBhamF4X3NldHRpbmdzLnN1Y2Nlc3MgOiBudWxsO1xuICAgICAgICAgICQuZXh0ZW5kKGFqYXhfc2V0dGluZ3MsIHtcbiAgICAgICAgICAgIHN1Y2Nlc3MgOiBmdW5jdGlvbiAoZGF0YSwgdGV4dFN0YXR1cywganFYSFIpIHtcbiAgICAgICAgICAgICAgaWYgKCAkLmlzRnVuY3Rpb24ob2xkX3N1Y2Nlc3MpICkge1xuICAgICAgICAgICAgICAgIHZhciByZXN1bHQgPSBvbGRfc3VjY2VzcyhkYXRhLCB0ZXh0U3RhdHVzLCBqcVhIUik7XG4gICAgICAgICAgICAgICAgaWYgKHR5cGVvZiByZXN1bHQgPT0gJ3N0cmluZycpIHtcbiAgICAgICAgICAgICAgICAgIGRhdGEgPSByZXN1bHQ7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgaWYgKHR5cGVvZiBvcHRpb25zICE9PSAndW5kZWZpbmVkJyAmJiB0eXBlb2Ygb3B0aW9ucy5yZXBsYWNlQ29udGVudFNlbCAhPT0gJ3VuZGVmaW5lZCcpIHtcbiAgICAgICAgICAgICAgICBtb2RhbC5maW5kKG9wdGlvbnMucmVwbGFjZUNvbnRlbnRTZWwpLmh0bWwoZGF0YSk7XG4gICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgbW9kYWwuaHRtbChkYXRhKTtcbiAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgIHNlbGYuUyhtb2RhbCkuZm91bmRhdGlvbignc2VjdGlvbicsICdyZWZsb3cnKTtcbiAgICAgICAgICAgICAgc2VsZi5TKG1vZGFsKS5jaGlsZHJlbigpLmZvdW5kYXRpb24oKTtcblxuICAgICAgICAgICAgICBpZiAob3Blbl9tb2RhbC5sZW5ndGggPiAwKSB7XG4gICAgICAgICAgICAgICAgaWYgKHNldHRpbmdzLm11bHRpcGxlX29wZW5lZCkge1xuICAgICAgICAgICAgICAgICAgc2VsZi50b19iYWNrKG9wZW5fbW9kYWwpO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICBzZWxmLmhpZGUob3Blbl9tb2RhbCwgc2V0dGluZ3MuY3NzLmNsb3NlKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgc2VsZi5zaG93KG1vZGFsLCBzZXR0aW5ncy5jc3Mub3Blbik7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfSk7XG5cbiAgICAgICAgICAvLyBjaGVjayBmb3IgaWYgdXNlciBpbml0YWxpemVkIHdpdGggZXJyb3IgY2FsbGJhY2tcbiAgICAgICAgICBpZiAoc2V0dGluZ3Mub25fYWpheF9lcnJvciAhPT0gJC5ub29wKSB7XG4gICAgICAgICAgICAkLmV4dGVuZChhamF4X3NldHRpbmdzLCB7XG4gICAgICAgICAgICAgIGVycm9yIDogc2V0dGluZ3Mub25fYWpheF9lcnJvclxuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgJC5hamF4KGFqYXhfc2V0dGluZ3MpO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgICBzZWxmLlMod2luZG93KS50cmlnZ2VyKCdyZXNpemUnKTtcbiAgICB9LFxuXG4gICAgY2xvc2UgOiBmdW5jdGlvbiAobW9kYWwpIHtcbiAgICAgIHZhciBtb2RhbCA9IG1vZGFsICYmIG1vZGFsLmxlbmd0aCA/IG1vZGFsIDogdGhpcy5TKHRoaXMuc2NvcGUpLFxuICAgICAgICAgIG9wZW5fbW9kYWxzID0gdGhpcy5TKCdbJyArIHRoaXMuYXR0cl9uYW1lKCkgKyAnXS5vcGVuJyksXG4gICAgICAgICAgc2V0dGluZ3MgPSBtb2RhbC5kYXRhKHRoaXMuYXR0cl9uYW1lKHRydWUpICsgJy1pbml0JykgfHwgdGhpcy5zZXR0aW5ncyxcbiAgICAgICAgICBzZWxmID0gdGhpcztcblxuICAgICAgaWYgKG9wZW5fbW9kYWxzLmxlbmd0aCA+IDApIHtcblxuICAgICAgICBtb2RhbC5yZW1vdmVBdHRyKCd0YWJpbmRleCcsJzAnKS5hdHRyKCdhcmlhLWhpZGRlbicsJ3RydWUnKTtcblxuICAgICAgICB0aGlzLmxvY2tlZCA9IHRydWU7XG4gICAgICAgIHRoaXMua2V5X3VwX29mZihtb2RhbCk7ICAgLy8gUEFUQ0ggIzM6IHR1cm5pbmcgb24ga2V5IHVwIGNhcHR1cmUgb25seSB3aGVuIGEgcmV2ZWFsIHdpbmRvdyBpcyBvcGVuXG5cbiAgICAgICAgbW9kYWwudHJpZ2dlcignY2xvc2UuZm5kdG4ucmV2ZWFsJyk7XG5cbiAgICAgICAgaWYgKChzZXR0aW5ncy5tdWx0aXBsZV9vcGVuZWQgJiYgb3Blbl9tb2RhbHMubGVuZ3RoID09PSAxKSB8fCAhc2V0dGluZ3MubXVsdGlwbGVfb3BlbmVkIHx8IG1vZGFsLmxlbmd0aCA+IDEpIHtcbiAgICAgICAgICBzZWxmLnRvZ2dsZV9iZyhtb2RhbCwgZmFsc2UpO1xuICAgICAgICAgIHNlbGYudG9fZnJvbnQobW9kYWwpO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKHNldHRpbmdzLm11bHRpcGxlX29wZW5lZCkge1xuICAgICAgICAgIHNlbGYuaGlkZShtb2RhbCwgc2V0dGluZ3MuY3NzLmNsb3NlLCBzZXR0aW5ncyk7XG4gICAgICAgICAgc2VsZi50b19mcm9udCgkKCQubWFrZUFycmF5KG9wZW5fbW9kYWxzKS5yZXZlcnNlKClbMV0pKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBzZWxmLmhpZGUob3Blbl9tb2RhbHMsIHNldHRpbmdzLmNzcy5jbG9zZSwgc2V0dGluZ3MpO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfSxcblxuICAgIGNsb3NlX3RhcmdldHMgOiBmdW5jdGlvbiAoKSB7XG4gICAgICB2YXIgYmFzZSA9ICcuJyArIHRoaXMuc2V0dGluZ3MuZGlzbWlzc19tb2RhbF9jbGFzcztcblxuICAgICAgaWYgKHRoaXMuc2V0dGluZ3MuY2xvc2Vfb25fYmFja2dyb3VuZF9jbGljaykge1xuICAgICAgICByZXR1cm4gYmFzZSArICcsIC4nICsgdGhpcy5zZXR0aW5ncy5iZ19jbGFzcztcbiAgICAgIH1cblxuICAgICAgcmV0dXJuIGJhc2U7XG4gICAgfSxcblxuICAgIHRvZ2dsZV9iZyA6IGZ1bmN0aW9uIChtb2RhbCwgc3RhdGUpIHtcbiAgICAgIGlmICh0aGlzLlMoJy4nICsgdGhpcy5zZXR0aW5ncy5iZ19jbGFzcykubGVuZ3RoID09PSAwKSB7XG4gICAgICAgIHRoaXMuc2V0dGluZ3MuYmcgPSAkKCc8ZGl2IC8+JywgeydjbGFzcyc6IHRoaXMuc2V0dGluZ3MuYmdfY2xhc3N9KVxuICAgICAgICAgIC5hcHBlbmRUbygnYm9keScpLmhpZGUoKTtcbiAgICAgIH1cblxuICAgICAgdmFyIHZpc2libGUgPSB0aGlzLnNldHRpbmdzLmJnLmZpbHRlcignOnZpc2libGUnKS5sZW5ndGggPiAwO1xuICAgICAgaWYgKCBzdGF0ZSAhPSB2aXNpYmxlICkge1xuICAgICAgICBpZiAoIHN0YXRlID09IHVuZGVmaW5lZCA/IHZpc2libGUgOiAhc3RhdGUgKSB7XG4gICAgICAgICAgdGhpcy5oaWRlKHRoaXMuc2V0dGluZ3MuYmcpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHRoaXMuc2hvdyh0aGlzLnNldHRpbmdzLmJnKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH0sXG5cbiAgICBzaG93IDogZnVuY3Rpb24gKGVsLCBjc3MpIHtcbiAgICAgIC8vIGlzIG1vZGFsXG4gICAgICBpZiAoY3NzKSB7XG4gICAgICAgIHZhciBzZXR0aW5ncyA9IGVsLmRhdGEodGhpcy5hdHRyX25hbWUodHJ1ZSkgKyAnLWluaXQnKSB8fCB0aGlzLnNldHRpbmdzLFxuICAgICAgICAgICAgcm9vdF9lbGVtZW50ID0gc2V0dGluZ3Mucm9vdF9lbGVtZW50LFxuICAgICAgICAgICAgY29udGV4dCA9IHRoaXM7XG5cbiAgICAgICAgaWYgKGVsLnBhcmVudChyb290X2VsZW1lbnQpLmxlbmd0aCA9PT0gMCkge1xuICAgICAgICAgIHZhciBwbGFjZWhvbGRlciA9IGVsLndyYXAoJzxkaXYgc3R5bGU9XCJkaXNwbGF5OiBub25lO1wiIC8+JykucGFyZW50KCk7XG5cbiAgICAgICAgICBlbC5vbignY2xvc2VkLmZuZHRuLnJldmVhbC53cmFwcGVkJywgZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgZWwuZGV0YWNoKCkuYXBwZW5kVG8ocGxhY2Vob2xkZXIpO1xuICAgICAgICAgICAgZWwudW53cmFwKCkudW5iaW5kKCdjbG9zZWQuZm5kdG4ucmV2ZWFsLndyYXBwZWQnKTtcbiAgICAgICAgICB9KTtcblxuICAgICAgICAgIGVsLmRldGFjaCgpLmFwcGVuZFRvKHJvb3RfZWxlbWVudCk7XG4gICAgICAgIH1cblxuICAgICAgICB2YXIgYW5pbURhdGEgPSBnZXRBbmltYXRpb25EYXRhKHNldHRpbmdzLmFuaW1hdGlvbik7XG4gICAgICAgIGlmICghYW5pbURhdGEuYW5pbWF0ZSkge1xuICAgICAgICAgIHRoaXMubG9ja2VkID0gZmFsc2U7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKGFuaW1EYXRhLnBvcCkge1xuICAgICAgICAgIGNzcy50b3AgPSAkKHdpbmRvdykuc2Nyb2xsVG9wKCkgLSBlbC5kYXRhKCdvZmZzZXQnKSArICdweCc7XG4gICAgICAgICAgdmFyIGVuZF9jc3MgPSB7XG4gICAgICAgICAgICB0b3A6ICQod2luZG93KS5zY3JvbGxUb3AoKSArIGVsLmRhdGEoJ2Nzcy10b3AnKSArICdweCcsXG4gICAgICAgICAgICBvcGFjaXR5OiAxXG4gICAgICAgICAgfTtcblxuICAgICAgICAgIHJldHVybiBzZXRUaW1lb3V0KGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIHJldHVybiBlbFxuICAgICAgICAgICAgICAuY3NzKGNzcylcbiAgICAgICAgICAgICAgLmFuaW1hdGUoZW5kX2Nzcywgc2V0dGluZ3MuYW5pbWF0aW9uX3NwZWVkLCAnbGluZWFyJywgZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgIGNvbnRleHQubG9ja2VkID0gZmFsc2U7XG4gICAgICAgICAgICAgICAgZWwudHJpZ2dlcignb3BlbmVkLmZuZHRuLnJldmVhbCcpO1xuICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICAuYWRkQ2xhc3MoJ29wZW4nKTtcbiAgICAgICAgICB9LCBzZXR0aW5ncy5hbmltYXRpb25fc3BlZWQgLyAyKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChhbmltRGF0YS5mYWRlKSB7XG4gICAgICAgICAgY3NzLnRvcCA9ICQod2luZG93KS5zY3JvbGxUb3AoKSArIGVsLmRhdGEoJ2Nzcy10b3AnKSArICdweCc7XG4gICAgICAgICAgdmFyIGVuZF9jc3MgPSB7b3BhY2l0eTogMX07XG5cbiAgICAgICAgICByZXR1cm4gc2V0VGltZW91dChmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICByZXR1cm4gZWxcbiAgICAgICAgICAgICAgLmNzcyhjc3MpXG4gICAgICAgICAgICAgIC5hbmltYXRlKGVuZF9jc3MsIHNldHRpbmdzLmFuaW1hdGlvbl9zcGVlZCwgJ2xpbmVhcicsIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICBjb250ZXh0LmxvY2tlZCA9IGZhbHNlO1xuICAgICAgICAgICAgICAgIGVsLnRyaWdnZXIoJ29wZW5lZC5mbmR0bi5yZXZlYWwnKTtcbiAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgLmFkZENsYXNzKCdvcGVuJyk7XG4gICAgICAgICAgfSwgc2V0dGluZ3MuYW5pbWF0aW9uX3NwZWVkIC8gMik7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gZWwuY3NzKGNzcykuc2hvdygpLmNzcyh7b3BhY2l0eSA6IDF9KS5hZGRDbGFzcygnb3BlbicpLnRyaWdnZXIoJ29wZW5lZC5mbmR0bi5yZXZlYWwnKTtcbiAgICAgIH1cblxuICAgICAgdmFyIHNldHRpbmdzID0gdGhpcy5zZXR0aW5ncztcblxuICAgICAgLy8gc2hvdWxkIHdlIGFuaW1hdGUgdGhlIGJhY2tncm91bmQ/XG4gICAgICBpZiAoZ2V0QW5pbWF0aW9uRGF0YShzZXR0aW5ncy5hbmltYXRpb24pLmZhZGUpIHtcbiAgICAgICAgcmV0dXJuIGVsLmZhZGVJbihzZXR0aW5ncy5hbmltYXRpb25fc3BlZWQgLyAyKTtcbiAgICAgIH1cblxuICAgICAgdGhpcy5sb2NrZWQgPSBmYWxzZTtcblxuICAgICAgcmV0dXJuIGVsLnNob3coKTtcbiAgICB9LFxuXG4gICAgdG9fYmFjayA6IGZ1bmN0aW9uKGVsKSB7XG4gICAgICBlbC5hZGRDbGFzcygndG9iYWNrJyk7XG4gICAgfSxcblxuICAgIHRvX2Zyb250IDogZnVuY3Rpb24oZWwpIHtcbiAgICAgIGVsLnJlbW92ZUNsYXNzKCd0b2JhY2snKTtcbiAgICB9LFxuXG4gICAgaGlkZSA6IGZ1bmN0aW9uIChlbCwgY3NzKSB7XG4gICAgICAvLyBpcyBtb2RhbFxuICAgICAgaWYgKGNzcykge1xuICAgICAgICB2YXIgc2V0dGluZ3MgPSBlbC5kYXRhKHRoaXMuYXR0cl9uYW1lKHRydWUpICsgJy1pbml0JyksXG4gICAgICAgICAgICBjb250ZXh0ID0gdGhpcztcbiAgICAgICAgc2V0dGluZ3MgPSBzZXR0aW5ncyB8fCB0aGlzLnNldHRpbmdzO1xuXG4gICAgICAgIHZhciBhbmltRGF0YSA9IGdldEFuaW1hdGlvbkRhdGEoc2V0dGluZ3MuYW5pbWF0aW9uKTtcbiAgICAgICAgaWYgKCFhbmltRGF0YS5hbmltYXRlKSB7XG4gICAgICAgICAgdGhpcy5sb2NrZWQgPSBmYWxzZTtcbiAgICAgICAgfVxuICAgICAgICBpZiAoYW5pbURhdGEucG9wKSB7XG4gICAgICAgICAgdmFyIGVuZF9jc3MgPSB7XG4gICAgICAgICAgICB0b3A6IC0gJCh3aW5kb3cpLnNjcm9sbFRvcCgpIC0gZWwuZGF0YSgnb2Zmc2V0JykgKyAncHgnLFxuICAgICAgICAgICAgb3BhY2l0eTogMFxuICAgICAgICAgIH07XG5cbiAgICAgICAgICByZXR1cm4gc2V0VGltZW91dChmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICByZXR1cm4gZWxcbiAgICAgICAgICAgICAgLmFuaW1hdGUoZW5kX2Nzcywgc2V0dGluZ3MuYW5pbWF0aW9uX3NwZWVkLCAnbGluZWFyJywgZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgIGNvbnRleHQubG9ja2VkID0gZmFsc2U7XG4gICAgICAgICAgICAgICAgZWwuY3NzKGNzcykudHJpZ2dlcignY2xvc2VkLmZuZHRuLnJldmVhbCcpO1xuICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICAucmVtb3ZlQ2xhc3MoJ29wZW4nKTtcbiAgICAgICAgICB9LCBzZXR0aW5ncy5hbmltYXRpb25fc3BlZWQgLyAyKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChhbmltRGF0YS5mYWRlKSB7XG4gICAgICAgICAgdmFyIGVuZF9jc3MgPSB7b3BhY2l0eSA6IDB9O1xuXG4gICAgICAgICAgcmV0dXJuIHNldFRpbWVvdXQoZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgcmV0dXJuIGVsXG4gICAgICAgICAgICAgIC5hbmltYXRlKGVuZF9jc3MsIHNldHRpbmdzLmFuaW1hdGlvbl9zcGVlZCwgJ2xpbmVhcicsIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICBjb250ZXh0LmxvY2tlZCA9IGZhbHNlO1xuICAgICAgICAgICAgICAgIGVsLmNzcyhjc3MpLnRyaWdnZXIoJ2Nsb3NlZC5mbmR0bi5yZXZlYWwnKTtcbiAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgLnJlbW92ZUNsYXNzKCdvcGVuJyk7XG4gICAgICAgICAgfSwgc2V0dGluZ3MuYW5pbWF0aW9uX3NwZWVkIC8gMik7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gZWwuaGlkZSgpLmNzcyhjc3MpLnJlbW92ZUNsYXNzKCdvcGVuJykudHJpZ2dlcignY2xvc2VkLmZuZHRuLnJldmVhbCcpO1xuICAgICAgfVxuXG4gICAgICB2YXIgc2V0dGluZ3MgPSB0aGlzLnNldHRpbmdzO1xuXG4gICAgICAvLyBzaG91bGQgd2UgYW5pbWF0ZSB0aGUgYmFja2dyb3VuZD9cbiAgICAgIGlmIChnZXRBbmltYXRpb25EYXRhKHNldHRpbmdzLmFuaW1hdGlvbikuZmFkZSkge1xuICAgICAgICByZXR1cm4gZWwuZmFkZU91dChzZXR0aW5ncy5hbmltYXRpb25fc3BlZWQgLyAyKTtcbiAgICAgIH1cblxuICAgICAgcmV0dXJuIGVsLmhpZGUoKTtcbiAgICB9LFxuXG4gICAgY2xvc2VfdmlkZW8gOiBmdW5jdGlvbiAoZSkge1xuICAgICAgdmFyIHZpZGVvID0gJCgnLmZsZXgtdmlkZW8nLCBlLnRhcmdldCksXG4gICAgICAgICAgaWZyYW1lID0gJCgnaWZyYW1lJywgdmlkZW8pO1xuXG4gICAgICBpZiAoaWZyYW1lLmxlbmd0aCA+IDApIHtcbiAgICAgICAgaWZyYW1lLmF0dHIoJ2RhdGEtc3JjJywgaWZyYW1lWzBdLnNyYyk7XG4gICAgICAgIGlmcmFtZS5hdHRyKCdzcmMnLCBpZnJhbWUuYXR0cignc3JjJykpO1xuICAgICAgICB2aWRlby5oaWRlKCk7XG4gICAgICB9XG4gICAgfSxcblxuICAgIG9wZW5fdmlkZW8gOiBmdW5jdGlvbiAoZSkge1xuICAgICAgdmFyIHZpZGVvID0gJCgnLmZsZXgtdmlkZW8nLCBlLnRhcmdldCksXG4gICAgICAgICAgaWZyYW1lID0gdmlkZW8uZmluZCgnaWZyYW1lJyk7XG5cbiAgICAgIGlmIChpZnJhbWUubGVuZ3RoID4gMCkge1xuICAgICAgICB2YXIgZGF0YV9zcmMgPSBpZnJhbWUuYXR0cignZGF0YS1zcmMnKTtcbiAgICAgICAgaWYgKHR5cGVvZiBkYXRhX3NyYyA9PT0gJ3N0cmluZycpIHtcbiAgICAgICAgICBpZnJhbWVbMF0uc3JjID0gaWZyYW1lLmF0dHIoJ2RhdGEtc3JjJyk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgdmFyIHNyYyA9IGlmcmFtZVswXS5zcmM7XG4gICAgICAgICAgaWZyYW1lWzBdLnNyYyA9IHVuZGVmaW5lZDtcbiAgICAgICAgICBpZnJhbWVbMF0uc3JjID0gc3JjO1xuICAgICAgICB9XG4gICAgICAgIHZpZGVvLnNob3coKTtcbiAgICAgIH1cbiAgICB9LFxuXG4gICAgZGF0YV9hdHRyIDogZnVuY3Rpb24gKHN0cikge1xuICAgICAgaWYgKHRoaXMubmFtZXNwYWNlLmxlbmd0aCA+IDApIHtcbiAgICAgICAgcmV0dXJuIHRoaXMubmFtZXNwYWNlICsgJy0nICsgc3RyO1xuICAgICAgfVxuXG4gICAgICByZXR1cm4gc3RyO1xuICAgIH0sXG5cbiAgICBjYWNoZV9vZmZzZXQgOiBmdW5jdGlvbiAobW9kYWwpIHtcbiAgICAgIHZhciBvZmZzZXQgPSBtb2RhbC5zaG93KCkuaGVpZ2h0KCkgKyBwYXJzZUludChtb2RhbC5jc3MoJ3RvcCcpLCAxMCkgKyBtb2RhbC5zY3JvbGxZO1xuXG4gICAgICBtb2RhbC5oaWRlKCk7XG5cbiAgICAgIHJldHVybiBvZmZzZXQ7XG4gICAgfSxcblxuICAgIG9mZiA6IGZ1bmN0aW9uICgpIHtcbiAgICAgICQodGhpcy5zY29wZSkub2ZmKCcuZm5kdG4ucmV2ZWFsJyk7XG4gICAgfSxcblxuICAgIHJlZmxvdyA6IGZ1bmN0aW9uICgpIHt9XG4gIH07XG5cbiAgLypcbiAgICogZ2V0QW5pbWF0aW9uRGF0YSgncG9wQW5kRmFkZScpIC8vIHthbmltYXRlOiB0cnVlLCAgcG9wOiB0cnVlLCAgZmFkZTogdHJ1ZX1cbiAgICogZ2V0QW5pbWF0aW9uRGF0YSgnZmFkZScpICAgICAgIC8vIHthbmltYXRlOiB0cnVlLCAgcG9wOiBmYWxzZSwgZmFkZTogdHJ1ZX1cbiAgICogZ2V0QW5pbWF0aW9uRGF0YSgncG9wJykgICAgICAgIC8vIHthbmltYXRlOiB0cnVlLCAgcG9wOiB0cnVlLCAgZmFkZTogZmFsc2V9XG4gICAqIGdldEFuaW1hdGlvbkRhdGEoJ2ZvbycpICAgICAgICAvLyB7YW5pbWF0ZTogZmFsc2UsIHBvcDogZmFsc2UsIGZhZGU6IGZhbHNlfVxuICAgKiBnZXRBbmltYXRpb25EYXRhKG51bGwpICAgICAgICAgLy8ge2FuaW1hdGU6IGZhbHNlLCBwb3A6IGZhbHNlLCBmYWRlOiBmYWxzZX1cbiAgICovXG4gIGZ1bmN0aW9uIGdldEFuaW1hdGlvbkRhdGEoc3RyKSB7XG4gICAgdmFyIGZhZGUgPSAvZmFkZS9pLnRlc3Qoc3RyKTtcbiAgICB2YXIgcG9wID0gL3BvcC9pLnRlc3Qoc3RyKTtcbiAgICByZXR1cm4ge1xuICAgICAgYW5pbWF0ZSA6IGZhZGUgfHwgcG9wLFxuICAgICAgcG9wIDogcG9wLFxuICAgICAgZmFkZSA6IGZhZGVcbiAgICB9O1xuICB9XG59KGpRdWVyeSwgd2luZG93LCB3aW5kb3cuZG9jdW1lbnQpKTtcbiJdLCJmaWxlIjoiZm91bmRhdGlvbi9qcy9mb3VuZGF0aW9uL2ZvdW5kYXRpb24ucmV2ZWFsLmpzIiwic291cmNlUm9vdCI6Ii9zb3VyY2UvIn0=