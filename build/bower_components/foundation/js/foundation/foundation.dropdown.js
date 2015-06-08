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

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiIiwic291cmNlcyI6WyJmb3VuZGF0aW9uL2pzL2ZvdW5kYXRpb24vZm91bmRhdGlvbi5kcm9wZG93bi5qcyJdLCJzb3VyY2VzQ29udGVudCI6WyI7KGZ1bmN0aW9uICgkLCB3aW5kb3csIGRvY3VtZW50LCB1bmRlZmluZWQpIHtcbiAgJ3VzZSBzdHJpY3QnO1xuXG4gIEZvdW5kYXRpb24ubGlicy5kcm9wZG93biA9IHtcbiAgICBuYW1lIDogJ2Ryb3Bkb3duJyxcblxuICAgIHZlcnNpb24gOiAnNS41LjInLFxuXG4gICAgc2V0dGluZ3MgOiB7XG4gICAgICBhY3RpdmVfY2xhc3MgOiAnb3BlbicsXG4gICAgICBkaXNhYmxlZF9jbGFzcyA6ICdkaXNhYmxlZCcsXG4gICAgICBtZWdhX2NsYXNzIDogJ21lZ2EnLFxuICAgICAgYWxpZ24gOiAnYm90dG9tJyxcbiAgICAgIGlzX2hvdmVyIDogZmFsc2UsXG4gICAgICBob3Zlcl90aW1lb3V0IDogMTUwLFxuICAgICAgb3BlbmVkIDogZnVuY3Rpb24gKCkge30sXG4gICAgICBjbG9zZWQgOiBmdW5jdGlvbiAoKSB7fVxuICAgIH0sXG5cbiAgICBpbml0IDogZnVuY3Rpb24gKHNjb3BlLCBtZXRob2QsIG9wdGlvbnMpIHtcbiAgICAgIEZvdW5kYXRpb24uaW5oZXJpdCh0aGlzLCAndGhyb3R0bGUnKTtcblxuICAgICAgJC5leHRlbmQodHJ1ZSwgdGhpcy5zZXR0aW5ncywgbWV0aG9kLCBvcHRpb25zKTtcbiAgICAgIHRoaXMuYmluZGluZ3MobWV0aG9kLCBvcHRpb25zKTtcbiAgICB9LFxuXG4gICAgZXZlbnRzIDogZnVuY3Rpb24gKHNjb3BlKSB7XG4gICAgICB2YXIgc2VsZiA9IHRoaXMsXG4gICAgICAgICAgUyA9IHNlbGYuUztcblxuICAgICAgUyh0aGlzLnNjb3BlKVxuICAgICAgICAub2ZmKCcuZHJvcGRvd24nKVxuICAgICAgICAub24oJ2NsaWNrLmZuZHRuLmRyb3Bkb3duJywgJ1snICsgdGhpcy5hdHRyX25hbWUoKSArICddJywgZnVuY3Rpb24gKGUpIHtcbiAgICAgICAgICB2YXIgc2V0dGluZ3MgPSBTKHRoaXMpLmRhdGEoc2VsZi5hdHRyX25hbWUodHJ1ZSkgKyAnLWluaXQnKSB8fCBzZWxmLnNldHRpbmdzO1xuICAgICAgICAgIGlmICghc2V0dGluZ3MuaXNfaG92ZXIgfHwgTW9kZXJuaXpyLnRvdWNoKSB7XG4gICAgICAgICAgICBlLnByZXZlbnREZWZhdWx0KCk7XG4gICAgICAgICAgICBpZiAoUyh0aGlzKS5wYXJlbnQoJ1tkYXRhLXJldmVhbC1pZF0nKS5sZW5ndGgpIHtcbiAgICAgICAgICAgICAgZS5zdG9wUHJvcGFnYXRpb24oKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHNlbGYudG9nZ2xlKCQodGhpcykpO1xuICAgICAgICAgIH1cbiAgICAgICAgfSlcbiAgICAgICAgLm9uKCdtb3VzZWVudGVyLmZuZHRuLmRyb3Bkb3duJywgJ1snICsgdGhpcy5hdHRyX25hbWUoKSArICddLCBbJyArIHRoaXMuYXR0cl9uYW1lKCkgKyAnLWNvbnRlbnRdJywgZnVuY3Rpb24gKGUpIHtcbiAgICAgICAgICB2YXIgJHRoaXMgPSBTKHRoaXMpLFxuICAgICAgICAgICAgICBkcm9wZG93bixcbiAgICAgICAgICAgICAgdGFyZ2V0O1xuXG4gICAgICAgICAgY2xlYXJUaW1lb3V0KHNlbGYudGltZW91dCk7XG5cbiAgICAgICAgICBpZiAoJHRoaXMuZGF0YShzZWxmLmRhdGFfYXR0cigpKSkge1xuICAgICAgICAgICAgZHJvcGRvd24gPSBTKCcjJyArICR0aGlzLmRhdGEoc2VsZi5kYXRhX2F0dHIoKSkpO1xuICAgICAgICAgICAgdGFyZ2V0ID0gJHRoaXM7XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGRyb3Bkb3duID0gJHRoaXM7XG4gICAgICAgICAgICB0YXJnZXQgPSBTKCdbJyArIHNlbGYuYXR0cl9uYW1lKCkgKyAnPVwiJyArIGRyb3Bkb3duLmF0dHIoJ2lkJykgKyAnXCJdJyk7XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgdmFyIHNldHRpbmdzID0gdGFyZ2V0LmRhdGEoc2VsZi5hdHRyX25hbWUodHJ1ZSkgKyAnLWluaXQnKSB8fCBzZWxmLnNldHRpbmdzO1xuXG4gICAgICAgICAgaWYgKFMoZS5jdXJyZW50VGFyZ2V0KS5kYXRhKHNlbGYuZGF0YV9hdHRyKCkpICYmIHNldHRpbmdzLmlzX2hvdmVyKSB7XG4gICAgICAgICAgICBzZWxmLmNsb3NlYWxsLmNhbGwoc2VsZik7XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgaWYgKHNldHRpbmdzLmlzX2hvdmVyKSB7XG4gICAgICAgICAgICBzZWxmLm9wZW4uYXBwbHkoc2VsZiwgW2Ryb3Bkb3duLCB0YXJnZXRdKTtcbiAgICAgICAgICB9XG4gICAgICAgIH0pXG4gICAgICAgIC5vbignbW91c2VsZWF2ZS5mbmR0bi5kcm9wZG93bicsICdbJyArIHRoaXMuYXR0cl9uYW1lKCkgKyAnXSwgWycgKyB0aGlzLmF0dHJfbmFtZSgpICsgJy1jb250ZW50XScsIGZ1bmN0aW9uIChlKSB7XG4gICAgICAgICAgdmFyICR0aGlzID0gUyh0aGlzKTtcbiAgICAgICAgICB2YXIgc2V0dGluZ3M7XG5cbiAgICAgICAgICBpZiAoJHRoaXMuZGF0YShzZWxmLmRhdGFfYXR0cigpKSkge1xuICAgICAgICAgICAgICBzZXR0aW5ncyA9ICR0aGlzLmRhdGEoc2VsZi5kYXRhX2F0dHIodHJ1ZSkgKyAnLWluaXQnKSB8fCBzZWxmLnNldHRpbmdzO1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgIHZhciB0YXJnZXQgICA9IFMoJ1snICsgc2VsZi5hdHRyX25hbWUoKSArICc9XCInICsgUyh0aGlzKS5hdHRyKCdpZCcpICsgJ1wiXScpLFxuICAgICAgICAgICAgICAgICAgc2V0dGluZ3MgPSB0YXJnZXQuZGF0YShzZWxmLmF0dHJfbmFtZSh0cnVlKSArICctaW5pdCcpIHx8IHNlbGYuc2V0dGluZ3M7XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgc2VsZi50aW1lb3V0ID0gc2V0VGltZW91dChmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICBpZiAoJHRoaXMuZGF0YShzZWxmLmRhdGFfYXR0cigpKSkge1xuICAgICAgICAgICAgICBpZiAoc2V0dGluZ3MuaXNfaG92ZXIpIHtcbiAgICAgICAgICAgICAgICBzZWxmLmNsb3NlLmNhbGwoc2VsZiwgUygnIycgKyAkdGhpcy5kYXRhKHNlbGYuZGF0YV9hdHRyKCkpKSk7XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgIGlmIChzZXR0aW5ncy5pc19ob3Zlcikge1xuICAgICAgICAgICAgICAgIHNlbGYuY2xvc2UuY2FsbChzZWxmLCAkdGhpcyk7XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9LmJpbmQodGhpcyksIHNldHRpbmdzLmhvdmVyX3RpbWVvdXQpO1xuICAgICAgICB9KVxuICAgICAgICAub24oJ2NsaWNrLmZuZHRuLmRyb3Bkb3duJywgZnVuY3Rpb24gKGUpIHtcbiAgICAgICAgICB2YXIgcGFyZW50ID0gUyhlLnRhcmdldCkuY2xvc2VzdCgnWycgKyBzZWxmLmF0dHJfbmFtZSgpICsgJy1jb250ZW50XScpO1xuICAgICAgICAgIHZhciBsaW5rcyAgPSBwYXJlbnQuZmluZCgnYScpO1xuXG4gICAgICAgICAgaWYgKGxpbmtzLmxlbmd0aCA+IDAgJiYgcGFyZW50LmF0dHIoJ2FyaWEtYXV0b2Nsb3NlJykgIT09ICdmYWxzZScpIHtcbiAgICAgICAgICAgICAgc2VsZi5jbG9zZS5jYWxsKHNlbGYsIFMoJ1snICsgc2VsZi5hdHRyX25hbWUoKSArICctY29udGVudF0nKSk7XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgaWYgKGUudGFyZ2V0ICE9PSBkb2N1bWVudCAmJiAhJC5jb250YWlucyhkb2N1bWVudC5kb2N1bWVudEVsZW1lbnQsIGUudGFyZ2V0KSkge1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgIH1cblxuICAgICAgICAgIGlmIChTKGUudGFyZ2V0KS5jbG9zZXN0KCdbJyArIHNlbGYuYXR0cl9uYW1lKCkgKyAnXScpLmxlbmd0aCA+IDApIHtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICB9XG5cbiAgICAgICAgICBpZiAoIShTKGUudGFyZ2V0KS5kYXRhKCdyZXZlYWxJZCcpKSAmJlxuICAgICAgICAgICAgKHBhcmVudC5sZW5ndGggPiAwICYmIChTKGUudGFyZ2V0KS5pcygnWycgKyBzZWxmLmF0dHJfbmFtZSgpICsgJy1jb250ZW50XScpIHx8XG4gICAgICAgICAgICAgICQuY29udGFpbnMocGFyZW50LmZpcnN0KClbMF0sIGUudGFyZ2V0KSkpKSB7XG4gICAgICAgICAgICBlLnN0b3BQcm9wYWdhdGlvbigpO1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgIH1cblxuICAgICAgICAgIHNlbGYuY2xvc2UuY2FsbChzZWxmLCBTKCdbJyArIHNlbGYuYXR0cl9uYW1lKCkgKyAnLWNvbnRlbnRdJykpO1xuICAgICAgICB9KVxuICAgICAgICAub24oJ29wZW5lZC5mbmR0bi5kcm9wZG93bicsICdbJyArIHNlbGYuYXR0cl9uYW1lKCkgKyAnLWNvbnRlbnRdJywgZnVuY3Rpb24gKCkge1xuICAgICAgICAgIHNlbGYuc2V0dGluZ3Mub3BlbmVkLmNhbGwodGhpcyk7XG4gICAgICAgIH0pXG4gICAgICAgIC5vbignY2xvc2VkLmZuZHRuLmRyb3Bkb3duJywgJ1snICsgc2VsZi5hdHRyX25hbWUoKSArICctY29udGVudF0nLCBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgc2VsZi5zZXR0aW5ncy5jbG9zZWQuY2FsbCh0aGlzKTtcbiAgICAgICAgfSk7XG5cbiAgICAgIFMod2luZG93KVxuICAgICAgICAub2ZmKCcuZHJvcGRvd24nKVxuICAgICAgICAub24oJ3Jlc2l6ZS5mbmR0bi5kcm9wZG93bicsIHNlbGYudGhyb3R0bGUoZnVuY3Rpb24gKCkge1xuICAgICAgICAgIHNlbGYucmVzaXplLmNhbGwoc2VsZik7XG4gICAgICAgIH0sIDUwKSk7XG5cbiAgICAgIHRoaXMucmVzaXplKCk7XG4gICAgfSxcblxuICAgIGNsb3NlIDogZnVuY3Rpb24gKGRyb3Bkb3duKSB7XG4gICAgICB2YXIgc2VsZiA9IHRoaXM7XG4gICAgICBkcm9wZG93bi5lYWNoKGZ1bmN0aW9uIChpZHgpIHtcbiAgICAgICAgdmFyIG9yaWdpbmFsX3RhcmdldCA9ICQoJ1snICsgc2VsZi5hdHRyX25hbWUoKSArICc9JyArIGRyb3Bkb3duW2lkeF0uaWQgKyAnXScpIHx8ICQoJ2FyaWEtY29udHJvbHM9JyArIGRyb3Bkb3duW2lkeF0uaWQgKyAnXScpO1xuICAgICAgICBvcmlnaW5hbF90YXJnZXQuYXR0cignYXJpYS1leHBhbmRlZCcsICdmYWxzZScpO1xuICAgICAgICBpZiAoc2VsZi5TKHRoaXMpLmhhc0NsYXNzKHNlbGYuc2V0dGluZ3MuYWN0aXZlX2NsYXNzKSkge1xuICAgICAgICAgIHNlbGYuUyh0aGlzKVxuICAgICAgICAgICAgLmNzcyhGb3VuZGF0aW9uLnJ0bCA/ICdyaWdodCcgOiAnbGVmdCcsICctOTk5OTlweCcpXG4gICAgICAgICAgICAuYXR0cignYXJpYS1oaWRkZW4nLCAndHJ1ZScpXG4gICAgICAgICAgICAucmVtb3ZlQ2xhc3Moc2VsZi5zZXR0aW5ncy5hY3RpdmVfY2xhc3MpXG4gICAgICAgICAgICAucHJldignWycgKyBzZWxmLmF0dHJfbmFtZSgpICsgJ10nKVxuICAgICAgICAgICAgLnJlbW92ZUNsYXNzKHNlbGYuc2V0dGluZ3MuYWN0aXZlX2NsYXNzKVxuICAgICAgICAgICAgLnJlbW92ZURhdGEoJ3RhcmdldCcpO1xuXG4gICAgICAgICAgc2VsZi5TKHRoaXMpLnRyaWdnZXIoJ2Nsb3NlZC5mbmR0bi5kcm9wZG93bicsIFtkcm9wZG93bl0pO1xuICAgICAgICB9XG4gICAgICB9KTtcbiAgICAgIGRyb3Bkb3duLnJlbW92ZUNsYXNzKCdmLW9wZW4tJyArIHRoaXMuYXR0cl9uYW1lKHRydWUpKTtcbiAgICB9LFxuXG4gICAgY2xvc2VhbGwgOiBmdW5jdGlvbiAoKSB7XG4gICAgICB2YXIgc2VsZiA9IHRoaXM7XG4gICAgICAkLmVhY2goc2VsZi5TKCcuZi1vcGVuLScgKyB0aGlzLmF0dHJfbmFtZSh0cnVlKSksIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgc2VsZi5jbG9zZS5jYWxsKHNlbGYsIHNlbGYuUyh0aGlzKSk7XG4gICAgICB9KTtcbiAgICB9LFxuXG4gICAgb3BlbiA6IGZ1bmN0aW9uIChkcm9wZG93biwgdGFyZ2V0KSB7XG4gICAgICB0aGlzXG4gICAgICAgIC5jc3MoZHJvcGRvd25cbiAgICAgICAgLmFkZENsYXNzKHRoaXMuc2V0dGluZ3MuYWN0aXZlX2NsYXNzKSwgdGFyZ2V0KTtcbiAgICAgIGRyb3Bkb3duLnByZXYoJ1snICsgdGhpcy5hdHRyX25hbWUoKSArICddJykuYWRkQ2xhc3ModGhpcy5zZXR0aW5ncy5hY3RpdmVfY2xhc3MpO1xuICAgICAgZHJvcGRvd24uZGF0YSgndGFyZ2V0JywgdGFyZ2V0LmdldCgwKSkudHJpZ2dlcignb3BlbmVkLmZuZHRuLmRyb3Bkb3duJywgW2Ryb3Bkb3duLCB0YXJnZXRdKTtcbiAgICAgIGRyb3Bkb3duLmF0dHIoJ2FyaWEtaGlkZGVuJywgJ2ZhbHNlJyk7XG4gICAgICB0YXJnZXQuYXR0cignYXJpYS1leHBhbmRlZCcsICd0cnVlJyk7XG4gICAgICBkcm9wZG93bi5mb2N1cygpO1xuICAgICAgZHJvcGRvd24uYWRkQ2xhc3MoJ2Ytb3Blbi0nICsgdGhpcy5hdHRyX25hbWUodHJ1ZSkpO1xuICAgIH0sXG5cbiAgICBkYXRhX2F0dHIgOiBmdW5jdGlvbiAoKSB7XG4gICAgICBpZiAodGhpcy5uYW1lc3BhY2UubGVuZ3RoID4gMCkge1xuICAgICAgICByZXR1cm4gdGhpcy5uYW1lc3BhY2UgKyAnLScgKyB0aGlzLm5hbWU7XG4gICAgICB9XG5cbiAgICAgIHJldHVybiB0aGlzLm5hbWU7XG4gICAgfSxcblxuICAgIHRvZ2dsZSA6IGZ1bmN0aW9uICh0YXJnZXQpIHtcbiAgICAgIGlmICh0YXJnZXQuaGFzQ2xhc3ModGhpcy5zZXR0aW5ncy5kaXNhYmxlZF9jbGFzcykpIHtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuICAgICAgdmFyIGRyb3Bkb3duID0gdGhpcy5TKCcjJyArIHRhcmdldC5kYXRhKHRoaXMuZGF0YV9hdHRyKCkpKTtcbiAgICAgIGlmIChkcm9wZG93bi5sZW5ndGggPT09IDApIHtcbiAgICAgICAgLy8gTm8gZHJvcGRvd24gZm91bmQsIG5vdCBjb250aW51aW5nXG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cblxuICAgICAgdGhpcy5jbG9zZS5jYWxsKHRoaXMsIHRoaXMuUygnWycgKyB0aGlzLmF0dHJfbmFtZSgpICsgJy1jb250ZW50XScpLm5vdChkcm9wZG93bikpO1xuXG4gICAgICBpZiAoZHJvcGRvd24uaGFzQ2xhc3ModGhpcy5zZXR0aW5ncy5hY3RpdmVfY2xhc3MpKSB7XG4gICAgICAgIHRoaXMuY2xvc2UuY2FsbCh0aGlzLCBkcm9wZG93bik7XG4gICAgICAgIGlmIChkcm9wZG93bi5kYXRhKCd0YXJnZXQnKSAhPT0gdGFyZ2V0LmdldCgwKSkge1xuICAgICAgICAgIHRoaXMub3Blbi5jYWxsKHRoaXMsIGRyb3Bkb3duLCB0YXJnZXQpO1xuICAgICAgICB9XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB0aGlzLm9wZW4uY2FsbCh0aGlzLCBkcm9wZG93biwgdGFyZ2V0KTtcbiAgICAgIH1cbiAgICB9LFxuXG4gICAgcmVzaXplIDogZnVuY3Rpb24gKCkge1xuICAgICAgdmFyIGRyb3Bkb3duID0gdGhpcy5TKCdbJyArIHRoaXMuYXR0cl9uYW1lKCkgKyAnLWNvbnRlbnRdLm9wZW4nKTtcbiAgICAgIHZhciB0YXJnZXQgPSAkKGRyb3Bkb3duLmRhdGEoXCJ0YXJnZXRcIikpO1xuXG4gICAgICBpZiAoZHJvcGRvd24ubGVuZ3RoICYmIHRhcmdldC5sZW5ndGgpIHtcbiAgICAgICAgdGhpcy5jc3MoZHJvcGRvd24sIHRhcmdldCk7XG4gICAgICB9XG4gICAgfSxcblxuICAgIGNzcyA6IGZ1bmN0aW9uIChkcm9wZG93biwgdGFyZ2V0KSB7XG4gICAgICB2YXIgbGVmdF9vZmZzZXQgPSBNYXRoLm1heCgodGFyZ2V0LndpZHRoKCkgLSBkcm9wZG93bi53aWR0aCgpKSAvIDIsIDgpLFxuICAgICAgICAgIHNldHRpbmdzID0gdGFyZ2V0LmRhdGEodGhpcy5hdHRyX25hbWUodHJ1ZSkgKyAnLWluaXQnKSB8fCB0aGlzLnNldHRpbmdzLFxuICAgICAgICAgIHBhcmVudE92ZXJmbG93ID0gZHJvcGRvd24ucGFyZW50KCkuY3NzKCdvdmVyZmxvdy15JykgfHwgZHJvcGRvd24ucGFyZW50KCkuY3NzKCdvdmVyZmxvdycpO1xuXG4gICAgICB0aGlzLmNsZWFyX2lkeCgpO1xuXG5cblxuICAgICAgaWYgKHRoaXMuc21hbGwoKSkge1xuICAgICAgICB2YXIgcCA9IHRoaXMuZGlycy5ib3R0b20uY2FsbChkcm9wZG93biwgdGFyZ2V0LCBzZXR0aW5ncyk7XG5cbiAgICAgICAgZHJvcGRvd24uYXR0cignc3R5bGUnLCAnJykucmVtb3ZlQ2xhc3MoJ2Ryb3AtbGVmdCBkcm9wLXJpZ2h0IGRyb3AtdG9wJykuY3NzKHtcbiAgICAgICAgICBwb3NpdGlvbiA6ICdhYnNvbHV0ZScsXG4gICAgICAgICAgd2lkdGggOiAnOTUlJyxcbiAgICAgICAgICAnbWF4LXdpZHRoJyA6ICdub25lJyxcbiAgICAgICAgICB0b3AgOiBwLnRvcFxuICAgICAgICB9KTtcblxuICAgICAgICBkcm9wZG93bi5jc3MoRm91bmRhdGlvbi5ydGwgPyAncmlnaHQnIDogJ2xlZnQnLCBsZWZ0X29mZnNldCk7XG4gICAgICB9XG4gICAgICAvLyBkZXRlY3QgaWYgZHJvcGRvd24gaXMgaW4gYW4gb3ZlcmZsb3cgY29udGFpbmVyXG4gICAgICBlbHNlIGlmIChwYXJlbnRPdmVyZmxvdyAhPT0gJ3Zpc2libGUnKSB7XG4gICAgICAgIHZhciBvZmZzZXQgPSB0YXJnZXRbMF0ub2Zmc2V0VG9wICsgdGFyZ2V0WzBdLm9mZnNldEhlaWdodDtcblxuICAgICAgICBkcm9wZG93bi5hdHRyKCdzdHlsZScsICcnKS5jc3Moe1xuICAgICAgICAgIHBvc2l0aW9uIDogJ2Fic29sdXRlJyxcbiAgICAgICAgICB0b3AgOiBvZmZzZXRcbiAgICAgICAgfSk7XG5cbiAgICAgICAgZHJvcGRvd24uY3NzKEZvdW5kYXRpb24ucnRsID8gJ3JpZ2h0JyA6ICdsZWZ0JywgbGVmdF9vZmZzZXQpO1xuICAgICAgfVxuICAgICAgZWxzZSB7XG5cbiAgICAgICAgdGhpcy5zdHlsZShkcm9wZG93biwgdGFyZ2V0LCBzZXR0aW5ncyk7XG4gICAgICB9XG5cbiAgICAgIHJldHVybiBkcm9wZG93bjtcbiAgICB9LFxuXG4gICAgc3R5bGUgOiBmdW5jdGlvbiAoZHJvcGRvd24sIHRhcmdldCwgc2V0dGluZ3MpIHtcbiAgICAgIHZhciBjc3MgPSAkLmV4dGVuZCh7cG9zaXRpb24gOiAnYWJzb2x1dGUnfSxcbiAgICAgICAgdGhpcy5kaXJzW3NldHRpbmdzLmFsaWduXS5jYWxsKGRyb3Bkb3duLCB0YXJnZXQsIHNldHRpbmdzKSk7XG5cbiAgICAgIGRyb3Bkb3duLmF0dHIoJ3N0eWxlJywgJycpLmNzcyhjc3MpO1xuICAgIH0sXG5cbiAgICAvLyByZXR1cm4gQ1NTIHByb3BlcnR5IG9iamVjdFxuICAgIC8vIGB0aGlzYCBpcyB0aGUgZHJvcGRvd25cbiAgICBkaXJzIDoge1xuICAgICAgLy8gQ2FsY3VsYXRlIHRhcmdldCBvZmZzZXRcbiAgICAgIF9iYXNlIDogZnVuY3Rpb24gKHQpIHtcbiAgICAgICAgdmFyIG9fcCA9IHRoaXMub2Zmc2V0UGFyZW50KCksXG4gICAgICAgICAgICBvID0gb19wLm9mZnNldCgpLFxuICAgICAgICAgICAgcCA9IHQub2Zmc2V0KCk7XG5cbiAgICAgICAgcC50b3AgLT0gby50b3A7XG4gICAgICAgIHAubGVmdCAtPSBvLmxlZnQ7XG5cbiAgICAgICAgLy9zZXQgc29tZSBmbGFncyBvbiB0aGUgcCBvYmplY3QgdG8gcGFzcyBhbG9uZ1xuICAgICAgICBwLm1pc3NSaWdodCA9IGZhbHNlO1xuICAgICAgICBwLm1pc3NUb3AgPSBmYWxzZTtcbiAgICAgICAgcC5taXNzTGVmdCA9IGZhbHNlO1xuICAgICAgICBwLmxlZnRSaWdodEZsYWcgPSBmYWxzZTtcblxuICAgICAgICAvL2xldHMgc2VlIGlmIHRoZSBwYW5lbCB3aWxsIGJlIG9mZiB0aGUgc2NyZWVuXG4gICAgICAgIC8vZ2V0IHRoZSBhY3R1YWwgd2lkdGggb2YgdGhlIHBhZ2UgYW5kIHN0b3JlIGl0XG4gICAgICAgIHZhciBhY3R1YWxCb2R5V2lkdGg7XG4gICAgICAgIGlmIChkb2N1bWVudC5nZXRFbGVtZW50c0J5Q2xhc3NOYW1lKCdyb3cnKVswXSkge1xuICAgICAgICAgIGFjdHVhbEJvZHlXaWR0aCA9IGRvY3VtZW50LmdldEVsZW1lbnRzQnlDbGFzc05hbWUoJ3JvdycpWzBdLmNsaWVudFdpZHRoO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIGFjdHVhbEJvZHlXaWR0aCA9IHdpbmRvdy5pbm5lcldpZHRoO1xuICAgICAgICB9XG5cbiAgICAgICAgdmFyIGFjdHVhbE1hcmdpbldpZHRoID0gKHdpbmRvdy5pbm5lcldpZHRoIC0gYWN0dWFsQm9keVdpZHRoKSAvIDI7XG4gICAgICAgIHZhciBhY3R1YWxCb3VuZGFyeSA9IGFjdHVhbEJvZHlXaWR0aDtcblxuICAgICAgICBpZiAoIXRoaXMuaGFzQ2xhc3MoJ21lZ2EnKSkge1xuICAgICAgICAgIC8vbWlzcyB0b3BcbiAgICAgICAgICBpZiAodC5vZmZzZXQoKS50b3AgPD0gdGhpcy5vdXRlckhlaWdodCgpKSB7XG4gICAgICAgICAgICBwLm1pc3NUb3AgPSB0cnVlO1xuICAgICAgICAgICAgYWN0dWFsQm91bmRhcnkgPSB3aW5kb3cuaW5uZXJXaWR0aCAtIGFjdHVhbE1hcmdpbldpZHRoO1xuICAgICAgICAgICAgcC5sZWZ0UmlnaHRGbGFnID0gdHJ1ZTtcbiAgICAgICAgICB9XG5cbiAgICAgICAgICAvL21pc3MgcmlnaHRcbiAgICAgICAgICBpZiAodC5vZmZzZXQoKS5sZWZ0ICsgdGhpcy5vdXRlcldpZHRoKCkgPiB0Lm9mZnNldCgpLmxlZnQgKyBhY3R1YWxNYXJnaW5XaWR0aCAmJiB0Lm9mZnNldCgpLmxlZnQgLSBhY3R1YWxNYXJnaW5XaWR0aCA+IHRoaXMub3V0ZXJXaWR0aCgpKSB7XG4gICAgICAgICAgICBwLm1pc3NSaWdodCA9IHRydWU7XG4gICAgICAgICAgICBwLm1pc3NMZWZ0ID0gZmFsc2U7XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgLy9taXNzIGxlZnRcbiAgICAgICAgICBpZiAodC5vZmZzZXQoKS5sZWZ0IC0gdGhpcy5vdXRlcldpZHRoKCkgPD0gMCkge1xuICAgICAgICAgICAgcC5taXNzTGVmdCA9IHRydWU7XG4gICAgICAgICAgICBwLm1pc3NSaWdodCA9IGZhbHNlO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBwO1xuICAgICAgfSxcblxuICAgICAgdG9wIDogZnVuY3Rpb24gKHQsIHMpIHtcbiAgICAgICAgdmFyIHNlbGYgPSBGb3VuZGF0aW9uLmxpYnMuZHJvcGRvd24sXG4gICAgICAgICAgICBwID0gc2VsZi5kaXJzLl9iYXNlLmNhbGwodGhpcywgdCk7XG5cbiAgICAgICAgdGhpcy5hZGRDbGFzcygnZHJvcC10b3AnKTtcblxuICAgICAgICBpZiAocC5taXNzVG9wID09IHRydWUpIHtcbiAgICAgICAgICBwLnRvcCA9IHAudG9wICsgdC5vdXRlckhlaWdodCgpICsgdGhpcy5vdXRlckhlaWdodCgpO1xuICAgICAgICAgIHRoaXMucmVtb3ZlQ2xhc3MoJ2Ryb3AtdG9wJyk7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAocC5taXNzUmlnaHQgPT0gdHJ1ZSkge1xuICAgICAgICAgIHAubGVmdCA9IHAubGVmdCAtIHRoaXMub3V0ZXJXaWR0aCgpICsgdC5vdXRlcldpZHRoKCk7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAodC5vdXRlcldpZHRoKCkgPCB0aGlzLm91dGVyV2lkdGgoKSB8fCBzZWxmLnNtYWxsKCkgfHwgdGhpcy5oYXNDbGFzcyhzLm1lZ2FfbWVudSkpIHtcbiAgICAgICAgICBzZWxmLmFkanVzdF9waXAodGhpcywgdCwgcywgcCk7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoRm91bmRhdGlvbi5ydGwpIHtcbiAgICAgICAgICByZXR1cm4ge2xlZnQgOiBwLmxlZnQgLSB0aGlzLm91dGVyV2lkdGgoKSArIHQub3V0ZXJXaWR0aCgpLFxuICAgICAgICAgICAgdG9wIDogcC50b3AgLSB0aGlzLm91dGVySGVpZ2h0KCl9O1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIHtsZWZ0IDogcC5sZWZ0LCB0b3AgOiBwLnRvcCAtIHRoaXMub3V0ZXJIZWlnaHQoKX07XG4gICAgICB9LFxuXG4gICAgICBib3R0b20gOiBmdW5jdGlvbiAodCwgcykge1xuICAgICAgICB2YXIgc2VsZiA9IEZvdW5kYXRpb24ubGlicy5kcm9wZG93bixcbiAgICAgICAgICAgIHAgPSBzZWxmLmRpcnMuX2Jhc2UuY2FsbCh0aGlzLCB0KTtcblxuICAgICAgICBpZiAocC5taXNzUmlnaHQgPT0gdHJ1ZSkge1xuICAgICAgICAgIHAubGVmdCA9IHAubGVmdCAtIHRoaXMub3V0ZXJXaWR0aCgpICsgdC5vdXRlcldpZHRoKCk7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAodC5vdXRlcldpZHRoKCkgPCB0aGlzLm91dGVyV2lkdGgoKSB8fCBzZWxmLnNtYWxsKCkgfHwgdGhpcy5oYXNDbGFzcyhzLm1lZ2FfbWVudSkpIHtcbiAgICAgICAgICBzZWxmLmFkanVzdF9waXAodGhpcywgdCwgcywgcCk7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoc2VsZi5ydGwpIHtcbiAgICAgICAgICByZXR1cm4ge2xlZnQgOiBwLmxlZnQgLSB0aGlzLm91dGVyV2lkdGgoKSArIHQub3V0ZXJXaWR0aCgpLCB0b3AgOiBwLnRvcCArIHQub3V0ZXJIZWlnaHQoKX07XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4ge2xlZnQgOiBwLmxlZnQsIHRvcCA6IHAudG9wICsgdC5vdXRlckhlaWdodCgpfTtcbiAgICAgIH0sXG5cbiAgICAgIGxlZnQgOiBmdW5jdGlvbiAodCwgcykge1xuICAgICAgICB2YXIgcCA9IEZvdW5kYXRpb24ubGlicy5kcm9wZG93bi5kaXJzLl9iYXNlLmNhbGwodGhpcywgdCk7XG5cbiAgICAgICAgdGhpcy5hZGRDbGFzcygnZHJvcC1sZWZ0Jyk7XG5cbiAgICAgICAgaWYgKHAubWlzc0xlZnQgPT0gdHJ1ZSkge1xuICAgICAgICAgIHAubGVmdCA9ICBwLmxlZnQgKyB0aGlzLm91dGVyV2lkdGgoKTtcbiAgICAgICAgICBwLnRvcCA9IHAudG9wICsgdC5vdXRlckhlaWdodCgpO1xuICAgICAgICAgIHRoaXMucmVtb3ZlQ2xhc3MoJ2Ryb3AtbGVmdCcpO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIHtsZWZ0IDogcC5sZWZ0IC0gdGhpcy5vdXRlcldpZHRoKCksIHRvcCA6IHAudG9wfTtcbiAgICAgIH0sXG5cbiAgICAgIHJpZ2h0IDogZnVuY3Rpb24gKHQsIHMpIHtcbiAgICAgICAgdmFyIHAgPSBGb3VuZGF0aW9uLmxpYnMuZHJvcGRvd24uZGlycy5fYmFzZS5jYWxsKHRoaXMsIHQpO1xuXG4gICAgICAgIHRoaXMuYWRkQ2xhc3MoJ2Ryb3AtcmlnaHQnKTtcblxuICAgICAgICBpZiAocC5taXNzUmlnaHQgPT0gdHJ1ZSkge1xuICAgICAgICAgIHAubGVmdCA9IHAubGVmdCAtIHRoaXMub3V0ZXJXaWR0aCgpO1xuICAgICAgICAgIHAudG9wID0gcC50b3AgKyB0Lm91dGVySGVpZ2h0KCk7XG4gICAgICAgICAgdGhpcy5yZW1vdmVDbGFzcygnZHJvcC1yaWdodCcpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHAudHJpZ2dlcmVkUmlnaHQgPSB0cnVlO1xuICAgICAgICB9XG5cbiAgICAgICAgdmFyIHNlbGYgPSBGb3VuZGF0aW9uLmxpYnMuZHJvcGRvd247XG5cbiAgICAgICAgaWYgKHQub3V0ZXJXaWR0aCgpIDwgdGhpcy5vdXRlcldpZHRoKCkgfHwgc2VsZi5zbWFsbCgpIHx8IHRoaXMuaGFzQ2xhc3Mocy5tZWdhX21lbnUpKSB7XG4gICAgICAgICAgc2VsZi5hZGp1c3RfcGlwKHRoaXMsIHQsIHMsIHApO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIHtsZWZ0IDogcC5sZWZ0ICsgdC5vdXRlcldpZHRoKCksIHRvcCA6IHAudG9wfTtcbiAgICAgIH1cbiAgICB9LFxuXG4gICAgLy8gSW5zZXJ0IHJ1bGUgdG8gc3R5bGUgcHN1ZWRvIGVsZW1lbnRzXG4gICAgYWRqdXN0X3BpcCA6IGZ1bmN0aW9uIChkcm9wZG93biwgdGFyZ2V0LCBzZXR0aW5ncywgcG9zaXRpb24pIHtcbiAgICAgIHZhciBzaGVldCA9IEZvdW5kYXRpb24uc3R5bGVzaGVldCxcbiAgICAgICAgICBwaXBfb2Zmc2V0X2Jhc2UgPSA4O1xuXG4gICAgICBpZiAoZHJvcGRvd24uaGFzQ2xhc3Moc2V0dGluZ3MubWVnYV9jbGFzcykpIHtcbiAgICAgICAgcGlwX29mZnNldF9iYXNlID0gcG9zaXRpb24ubGVmdCArICh0YXJnZXQub3V0ZXJXaWR0aCgpIC8gMikgLSA4O1xuICAgICAgfSBlbHNlIGlmICh0aGlzLnNtYWxsKCkpIHtcbiAgICAgICAgcGlwX29mZnNldF9iYXNlICs9IHBvc2l0aW9uLmxlZnQgLSA4O1xuICAgICAgfVxuXG4gICAgICB0aGlzLnJ1bGVfaWR4ID0gc2hlZXQuY3NzUnVsZXMubGVuZ3RoO1xuXG4gICAgICAvL2RlZmF1bHRcbiAgICAgIHZhciBzZWxfYmVmb3JlID0gJy5mLWRyb3Bkb3duLm9wZW46YmVmb3JlJyxcbiAgICAgICAgICBzZWxfYWZ0ZXIgID0gJy5mLWRyb3Bkb3duLm9wZW46YWZ0ZXInLFxuICAgICAgICAgIGNzc19iZWZvcmUgPSAnbGVmdDogJyArIHBpcF9vZmZzZXRfYmFzZSArICdweDsnLFxuICAgICAgICAgIGNzc19hZnRlciAgPSAnbGVmdDogJyArIChwaXBfb2Zmc2V0X2Jhc2UgLSAxKSArICdweDsnO1xuXG4gICAgICBpZiAocG9zaXRpb24ubWlzc1JpZ2h0ID09IHRydWUpIHtcbiAgICAgICAgcGlwX29mZnNldF9iYXNlID0gZHJvcGRvd24ub3V0ZXJXaWR0aCgpIC0gMjM7XG4gICAgICAgIHNlbF9iZWZvcmUgPSAnLmYtZHJvcGRvd24ub3BlbjpiZWZvcmUnLFxuICAgICAgICBzZWxfYWZ0ZXIgID0gJy5mLWRyb3Bkb3duLm9wZW46YWZ0ZXInLFxuICAgICAgICBjc3NfYmVmb3JlID0gJ2xlZnQ6ICcgKyBwaXBfb2Zmc2V0X2Jhc2UgKyAncHg7JyxcbiAgICAgICAgY3NzX2FmdGVyICA9ICdsZWZ0OiAnICsgKHBpcF9vZmZzZXRfYmFzZSAtIDEpICsgJ3B4Oyc7XG4gICAgICB9XG5cbiAgICAgIC8vanVzdCBhIGNhc2Ugd2hlcmUgcmlnaHQgaXMgZmlyZWQsIGJ1dCBpdHMgbm90IG1pc3NpbmcgcmlnaHRcbiAgICAgIGlmIChwb3NpdGlvbi50cmlnZ2VyZWRSaWdodCA9PSB0cnVlKSB7XG4gICAgICAgIHNlbF9iZWZvcmUgPSAnLmYtZHJvcGRvd24ub3BlbjpiZWZvcmUnLFxuICAgICAgICBzZWxfYWZ0ZXIgID0gJy5mLWRyb3Bkb3duLm9wZW46YWZ0ZXInLFxuICAgICAgICBjc3NfYmVmb3JlID0gJ2xlZnQ6LTEycHg7JyxcbiAgICAgICAgY3NzX2FmdGVyICA9ICdsZWZ0Oi0xNHB4Oyc7XG4gICAgICB9XG5cbiAgICAgIGlmIChzaGVldC5pbnNlcnRSdWxlKSB7XG4gICAgICAgIHNoZWV0Lmluc2VydFJ1bGUoW3NlbF9iZWZvcmUsICd7JywgY3NzX2JlZm9yZSwgJ30nXS5qb2luKCcgJyksIHRoaXMucnVsZV9pZHgpO1xuICAgICAgICBzaGVldC5pbnNlcnRSdWxlKFtzZWxfYWZ0ZXIsICd7JywgY3NzX2FmdGVyLCAnfSddLmpvaW4oJyAnKSwgdGhpcy5ydWxlX2lkeCArIDEpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgc2hlZXQuYWRkUnVsZShzZWxfYmVmb3JlLCBjc3NfYmVmb3JlLCB0aGlzLnJ1bGVfaWR4KTtcbiAgICAgICAgc2hlZXQuYWRkUnVsZShzZWxfYWZ0ZXIsIGNzc19hZnRlciwgdGhpcy5ydWxlX2lkeCArIDEpO1xuICAgICAgfVxuICAgIH0sXG5cbiAgICAvLyBSZW1vdmUgb2xkIGRyb3Bkb3duIHJ1bGUgaW5kZXhcbiAgICBjbGVhcl9pZHggOiBmdW5jdGlvbiAoKSB7XG4gICAgICB2YXIgc2hlZXQgPSBGb3VuZGF0aW9uLnN0eWxlc2hlZXQ7XG5cbiAgICAgIGlmICh0eXBlb2YgdGhpcy5ydWxlX2lkeCAhPT0gJ3VuZGVmaW5lZCcpIHtcbiAgICAgICAgc2hlZXQuZGVsZXRlUnVsZSh0aGlzLnJ1bGVfaWR4KTtcbiAgICAgICAgc2hlZXQuZGVsZXRlUnVsZSh0aGlzLnJ1bGVfaWR4KTtcbiAgICAgICAgZGVsZXRlIHRoaXMucnVsZV9pZHg7XG4gICAgICB9XG4gICAgfSxcblxuICAgIHNtYWxsIDogZnVuY3Rpb24gKCkge1xuICAgICAgcmV0dXJuIG1hdGNoTWVkaWEoRm91bmRhdGlvbi5tZWRpYV9xdWVyaWVzLnNtYWxsKS5tYXRjaGVzICYmXG4gICAgICAgICFtYXRjaE1lZGlhKEZvdW5kYXRpb24ubWVkaWFfcXVlcmllcy5tZWRpdW0pLm1hdGNoZXM7XG4gICAgfSxcblxuICAgIG9mZiA6IGZ1bmN0aW9uICgpIHtcbiAgICAgIHRoaXMuUyh0aGlzLnNjb3BlKS5vZmYoJy5mbmR0bi5kcm9wZG93bicpO1xuICAgICAgdGhpcy5TKCdodG1sLCBib2R5Jykub2ZmKCcuZm5kdG4uZHJvcGRvd24nKTtcbiAgICAgIHRoaXMuUyh3aW5kb3cpLm9mZignLmZuZHRuLmRyb3Bkb3duJyk7XG4gICAgICB0aGlzLlMoJ1tkYXRhLWRyb3Bkb3duLWNvbnRlbnRdJykub2ZmKCcuZm5kdG4uZHJvcGRvd24nKTtcbiAgICB9LFxuXG4gICAgcmVmbG93IDogZnVuY3Rpb24gKCkge31cbiAgfTtcbn0oalF1ZXJ5LCB3aW5kb3csIHdpbmRvdy5kb2N1bWVudCkpO1xuIl0sImZpbGUiOiJmb3VuZGF0aW9uL2pzL2ZvdW5kYXRpb24vZm91bmRhdGlvbi5kcm9wZG93bi5qcyIsInNvdXJjZVJvb3QiOiIvc291cmNlLyJ9