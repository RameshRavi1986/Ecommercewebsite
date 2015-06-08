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

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiIiwic291cmNlcyI6WyJmb3VuZGF0aW9uL2pzL2ZvdW5kYXRpb24vZm91bmRhdGlvbi5jbGVhcmluZy5qcyJdLCJzb3VyY2VzQ29udGVudCI6WyI7KGZ1bmN0aW9uICgkLCB3aW5kb3csIGRvY3VtZW50LCB1bmRlZmluZWQpIHtcbiAgJ3VzZSBzdHJpY3QnO1xuXG4gIEZvdW5kYXRpb24ubGlicy5jbGVhcmluZyA9IHtcbiAgICBuYW1lIDogJ2NsZWFyaW5nJyxcblxuICAgIHZlcnNpb24gOiAnNS41LjInLFxuXG4gICAgc2V0dGluZ3MgOiB7XG4gICAgICB0ZW1wbGF0ZXMgOiB7XG4gICAgICAgIHZpZXdpbmcgOiAnPGEgaHJlZj1cIiNcIiBjbGFzcz1cImNsZWFyaW5nLWNsb3NlXCI+JnRpbWVzOzwvYT4nICtcbiAgICAgICAgICAnPGRpdiBjbGFzcz1cInZpc2libGUtaW1nXCIgc3R5bGU9XCJkaXNwbGF5OiBub25lXCI+PGRpdiBjbGFzcz1cImNsZWFyaW5nLXRvdWNoLWxhYmVsXCI+PC9kaXY+PGltZyBzcmM9XCJkYXRhOmltYWdlL2dpZjtiYXNlNjQsUjBsR09EbGhBUUFCQUFEL0FDd0FBQUFBQVFBQkFBQUNBRHMlM0RcIiBhbHQ9XCJcIiAvPicgK1xuICAgICAgICAgICc8cCBjbGFzcz1cImNsZWFyaW5nLWNhcHRpb25cIj48L3A+PGEgaHJlZj1cIiNcIiBjbGFzcz1cImNsZWFyaW5nLW1haW4tcHJldlwiPjxzcGFuPjwvc3Bhbj48L2E+JyArXG4gICAgICAgICAgJzxhIGhyZWY9XCIjXCIgY2xhc3M9XCJjbGVhcmluZy1tYWluLW5leHRcIj48c3Bhbj48L3NwYW4+PC9hPjwvZGl2PicgK1xuICAgICAgICAgICc8aW1nIGNsYXNzPVwiY2xlYXJpbmctcHJlbG9hZC1uZXh0XCIgc3R5bGU9XCJkaXNwbGF5OiBub25lXCIgc3JjPVwiZGF0YTppbWFnZS9naWY7YmFzZTY0LFIwbEdPRGxoQVFBQkFBRC9BQ3dBQUFBQUFRQUJBQUFDQURzJTNEXCIgYWx0PVwiXCIgLz4nICtcbiAgICAgICAgICAnPGltZyBjbGFzcz1cImNsZWFyaW5nLXByZWxvYWQtcHJldlwiIHN0eWxlPVwiZGlzcGxheTogbm9uZVwiIHNyYz1cImRhdGE6aW1hZ2UvZ2lmO2Jhc2U2NCxSMGxHT0RsaEFRQUJBQUQvQUN3QUFBQUFBUUFCQUFBQ0FEcyUzRFwiIGFsdD1cIlwiIC8+J1xuICAgICAgfSxcblxuICAgICAgLy8gY29tbWEgZGVsaW1pdGVkIGxpc3Qgb2Ygc2VsZWN0b3JzIHRoYXQsIG9uIGNsaWNrLCB3aWxsIGNsb3NlIGNsZWFyaW5nLFxuICAgICAgLy8gYWRkICdkaXYuY2xlYXJpbmctYmxhY2tvdXQsIGRpdi52aXNpYmxlLWltZycgdG8gY2xvc2Ugb24gYmFja2dyb3VuZCBjbGlja1xuICAgICAgY2xvc2Vfc2VsZWN0b3JzIDogJy5jbGVhcmluZy1jbG9zZSwgZGl2LmNsZWFyaW5nLWJsYWNrb3V0JyxcblxuICAgICAgLy8gRGVmYXVsdCB0byB0aGUgZW50aXJlIGxpIGVsZW1lbnQuXG4gICAgICBvcGVuX3NlbGVjdG9ycyA6ICcnLFxuXG4gICAgICAvLyBJbWFnZSB3aWxsIGJlIHNraXBwZWQgaW4gY2Fyb3VzZWwuXG4gICAgICBza2lwX3NlbGVjdG9yIDogJycsXG5cbiAgICAgIHRvdWNoX2xhYmVsIDogJycsXG5cbiAgICAgIC8vIGV2ZW50IGluaXRpYWxpemVycyBhbmQgbG9ja3NcbiAgICAgIGluaXQgOiBmYWxzZSxcbiAgICAgIGxvY2tlZCA6IGZhbHNlXG4gICAgfSxcblxuICAgIGluaXQgOiBmdW5jdGlvbiAoc2NvcGUsIG1ldGhvZCwgb3B0aW9ucykge1xuICAgICAgdmFyIHNlbGYgPSB0aGlzO1xuICAgICAgRm91bmRhdGlvbi5pbmhlcml0KHRoaXMsICd0aHJvdHRsZSBpbWFnZV9sb2FkZWQnKTtcblxuICAgICAgdGhpcy5iaW5kaW5ncyhtZXRob2QsIG9wdGlvbnMpO1xuXG4gICAgICBpZiAoc2VsZi5TKHRoaXMuc2NvcGUpLmlzKCdbJyArIHRoaXMuYXR0cl9uYW1lKCkgKyAnXScpKSB7XG4gICAgICAgIHRoaXMuYXNzZW1ibGUoc2VsZi5TKCdsaScsIHRoaXMuc2NvcGUpKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHNlbGYuUygnWycgKyB0aGlzLmF0dHJfbmFtZSgpICsgJ10nLCB0aGlzLnNjb3BlKS5lYWNoKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICBzZWxmLmFzc2VtYmxlKHNlbGYuUygnbGknLCB0aGlzKSk7XG4gICAgICAgIH0pO1xuICAgICAgfVxuICAgIH0sXG5cbiAgICBldmVudHMgOiBmdW5jdGlvbiAoc2NvcGUpIHtcbiAgICAgIHZhciBzZWxmID0gdGhpcyxcbiAgICAgICAgICBTID0gc2VsZi5TLFxuICAgICAgICAgICRzY3JvbGxfY29udGFpbmVyID0gJCgnLnNjcm9sbC1jb250YWluZXInKTtcblxuICAgICAgaWYgKCRzY3JvbGxfY29udGFpbmVyLmxlbmd0aCA+IDApIHtcbiAgICAgICAgdGhpcy5zY29wZSA9ICRzY3JvbGxfY29udGFpbmVyO1xuICAgICAgfVxuXG4gICAgICBTKHRoaXMuc2NvcGUpXG4gICAgICAgIC5vZmYoJy5jbGVhcmluZycpXG4gICAgICAgIC5vbignY2xpY2suZm5kdG4uY2xlYXJpbmcnLCAndWxbJyArIHRoaXMuYXR0cl9uYW1lKCkgKyAnXSBsaSAnICsgdGhpcy5zZXR0aW5ncy5vcGVuX3NlbGVjdG9ycyxcbiAgICAgICAgICBmdW5jdGlvbiAoZSwgY3VycmVudCwgdGFyZ2V0KSB7XG4gICAgICAgICAgICB2YXIgY3VycmVudCA9IGN1cnJlbnQgfHwgUyh0aGlzKSxcbiAgICAgICAgICAgICAgICB0YXJnZXQgPSB0YXJnZXQgfHwgY3VycmVudCxcbiAgICAgICAgICAgICAgICBuZXh0ID0gY3VycmVudC5uZXh0KCdsaScpLFxuICAgICAgICAgICAgICAgIHNldHRpbmdzID0gY3VycmVudC5jbG9zZXN0KCdbJyArIHNlbGYuYXR0cl9uYW1lKCkgKyAnXScpLmRhdGEoc2VsZi5hdHRyX25hbWUodHJ1ZSkgKyAnLWluaXQnKSxcbiAgICAgICAgICAgICAgICBpbWFnZSA9IFMoZS50YXJnZXQpO1xuXG4gICAgICAgICAgICBlLnByZXZlbnREZWZhdWx0KCk7XG5cbiAgICAgICAgICAgIGlmICghc2V0dGluZ3MpIHtcbiAgICAgICAgICAgICAgc2VsZi5pbml0KCk7XG4gICAgICAgICAgICAgIHNldHRpbmdzID0gY3VycmVudC5jbG9zZXN0KCdbJyArIHNlbGYuYXR0cl9uYW1lKCkgKyAnXScpLmRhdGEoc2VsZi5hdHRyX25hbWUodHJ1ZSkgKyAnLWluaXQnKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgLy8gaWYgY2xlYXJpbmcgaXMgb3BlbiBhbmQgdGhlIGN1cnJlbnQgaW1hZ2UgaXNcbiAgICAgICAgICAgIC8vIGNsaWNrZWQsIGdvIHRvIHRoZSBuZXh0IGltYWdlIGluIHNlcXVlbmNlXG4gICAgICAgICAgICBpZiAodGFyZ2V0Lmhhc0NsYXNzKCd2aXNpYmxlJykgJiZcbiAgICAgICAgICAgICAgY3VycmVudFswXSA9PT0gdGFyZ2V0WzBdICYmXG4gICAgICAgICAgICAgIG5leHQubGVuZ3RoID4gMCAmJiBzZWxmLmlzX29wZW4oY3VycmVudCkpIHtcbiAgICAgICAgICAgICAgdGFyZ2V0ID0gbmV4dDtcbiAgICAgICAgICAgICAgaW1hZ2UgPSBTKCdpbWcnLCB0YXJnZXQpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAvLyBzZXQgY3VycmVudCBhbmQgdGFyZ2V0IHRvIHRoZSBjbGlja2VkIGxpIGlmIG5vdCBvdGhlcndpc2UgZGVmaW5lZC5cbiAgICAgICAgICAgIHNlbGYub3BlbihpbWFnZSwgY3VycmVudCwgdGFyZ2V0KTtcbiAgICAgICAgICAgIHNlbGYudXBkYXRlX3BhZGRsZXModGFyZ2V0KTtcbiAgICAgICAgICB9KVxuXG4gICAgICAgIC5vbignY2xpY2suZm5kdG4uY2xlYXJpbmcnLCAnLmNsZWFyaW5nLW1haW4tbmV4dCcsXG4gICAgICAgICAgZnVuY3Rpb24gKGUpIHsgc2VsZi5uYXYoZSwgJ25leHQnKSB9KVxuICAgICAgICAub24oJ2NsaWNrLmZuZHRuLmNsZWFyaW5nJywgJy5jbGVhcmluZy1tYWluLXByZXYnLFxuICAgICAgICAgIGZ1bmN0aW9uIChlKSB7IHNlbGYubmF2KGUsICdwcmV2JykgfSlcbiAgICAgICAgLm9uKCdjbGljay5mbmR0bi5jbGVhcmluZycsIHRoaXMuc2V0dGluZ3MuY2xvc2Vfc2VsZWN0b3JzLFxuICAgICAgICAgIGZ1bmN0aW9uIChlKSB7IEZvdW5kYXRpb24ubGlicy5jbGVhcmluZy5jbG9zZShlLCB0aGlzKSB9KTtcblxuICAgICAgJChkb2N1bWVudCkub24oJ2tleWRvd24uZm5kdG4uY2xlYXJpbmcnLFxuICAgICAgICAgIGZ1bmN0aW9uIChlKSB7IHNlbGYua2V5ZG93bihlKSB9KTtcblxuICAgICAgUyh3aW5kb3cpLm9mZignLmNsZWFyaW5nJykub24oJ3Jlc2l6ZS5mbmR0bi5jbGVhcmluZycsXG4gICAgICAgIGZ1bmN0aW9uICgpIHsgc2VsZi5yZXNpemUoKSB9KTtcblxuICAgICAgdGhpcy5zd2lwZV9ldmVudHMoc2NvcGUpO1xuICAgIH0sXG5cbiAgICBzd2lwZV9ldmVudHMgOiBmdW5jdGlvbiAoc2NvcGUpIHtcbiAgICAgIHZhciBzZWxmID0gdGhpcyxcbiAgICAgIFMgPSBzZWxmLlM7XG5cbiAgICAgIFModGhpcy5zY29wZSlcbiAgICAgICAgLm9uKCd0b3VjaHN0YXJ0LmZuZHRuLmNsZWFyaW5nJywgJy52aXNpYmxlLWltZycsIGZ1bmN0aW9uIChlKSB7XG4gICAgICAgICAgaWYgKCFlLnRvdWNoZXMpIHsgZSA9IGUub3JpZ2luYWxFdmVudDsgfVxuICAgICAgICAgIHZhciBkYXRhID0ge1xuICAgICAgICAgICAgICAgIHN0YXJ0X3BhZ2VfeCA6IGUudG91Y2hlc1swXS5wYWdlWCxcbiAgICAgICAgICAgICAgICBzdGFydF9wYWdlX3kgOiBlLnRvdWNoZXNbMF0ucGFnZVksXG4gICAgICAgICAgICAgICAgc3RhcnRfdGltZSA6IChuZXcgRGF0ZSgpKS5nZXRUaW1lKCksXG4gICAgICAgICAgICAgICAgZGVsdGFfeCA6IDAsXG4gICAgICAgICAgICAgICAgaXNfc2Nyb2xsaW5nIDogdW5kZWZpbmVkXG4gICAgICAgICAgICAgIH07XG5cbiAgICAgICAgICBTKHRoaXMpLmRhdGEoJ3N3aXBlLXRyYW5zaXRpb24nLCBkYXRhKTtcbiAgICAgICAgICBlLnN0b3BQcm9wYWdhdGlvbigpO1xuICAgICAgICB9KVxuICAgICAgICAub24oJ3RvdWNobW92ZS5mbmR0bi5jbGVhcmluZycsICcudmlzaWJsZS1pbWcnLCBmdW5jdGlvbiAoZSkge1xuICAgICAgICAgIGlmICghZS50b3VjaGVzKSB7XG4gICAgICAgICAgICBlID0gZS5vcmlnaW5hbEV2ZW50O1xuICAgICAgICAgIH1cbiAgICAgICAgICAvLyBJZ25vcmUgcGluY2gvem9vbSBldmVudHNcbiAgICAgICAgICBpZiAoZS50b3VjaGVzLmxlbmd0aCA+IDEgfHwgZS5zY2FsZSAmJiBlLnNjYWxlICE9PSAxKSB7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgdmFyIGRhdGEgPSBTKHRoaXMpLmRhdGEoJ3N3aXBlLXRyYW5zaXRpb24nKTtcblxuICAgICAgICAgIGlmICh0eXBlb2YgZGF0YSA9PT0gJ3VuZGVmaW5lZCcpIHtcbiAgICAgICAgICAgIGRhdGEgPSB7fTtcbiAgICAgICAgICB9XG5cbiAgICAgICAgICBkYXRhLmRlbHRhX3ggPSBlLnRvdWNoZXNbMF0ucGFnZVggLSBkYXRhLnN0YXJ0X3BhZ2VfeDtcblxuICAgICAgICAgIGlmIChGb3VuZGF0aW9uLnJ0bCkge1xuICAgICAgICAgICAgZGF0YS5kZWx0YV94ID0gLWRhdGEuZGVsdGFfeDtcbiAgICAgICAgICB9XG5cbiAgICAgICAgICBpZiAodHlwZW9mIGRhdGEuaXNfc2Nyb2xsaW5nID09PSAndW5kZWZpbmVkJykge1xuICAgICAgICAgICAgZGF0YS5pc19zY3JvbGxpbmcgPSAhISggZGF0YS5pc19zY3JvbGxpbmcgfHwgTWF0aC5hYnMoZGF0YS5kZWx0YV94KSA8IE1hdGguYWJzKGUudG91Y2hlc1swXS5wYWdlWSAtIGRhdGEuc3RhcnRfcGFnZV95KSApO1xuICAgICAgICAgIH1cblxuICAgICAgICAgIGlmICghZGF0YS5pc19zY3JvbGxpbmcgJiYgIWRhdGEuYWN0aXZlKSB7XG4gICAgICAgICAgICBlLnByZXZlbnREZWZhdWx0KCk7XG4gICAgICAgICAgICB2YXIgZGlyZWN0aW9uID0gKGRhdGEuZGVsdGFfeCA8IDApID8gJ25leHQnIDogJ3ByZXYnO1xuICAgICAgICAgICAgZGF0YS5hY3RpdmUgPSB0cnVlO1xuICAgICAgICAgICAgc2VsZi5uYXYoZSwgZGlyZWN0aW9uKTtcbiAgICAgICAgICB9XG4gICAgICAgIH0pXG4gICAgICAgIC5vbigndG91Y2hlbmQuZm5kdG4uY2xlYXJpbmcnLCAnLnZpc2libGUtaW1nJywgZnVuY3Rpb24gKGUpIHtcbiAgICAgICAgICBTKHRoaXMpLmRhdGEoJ3N3aXBlLXRyYW5zaXRpb24nLCB7fSk7XG4gICAgICAgICAgZS5zdG9wUHJvcGFnYXRpb24oKTtcbiAgICAgICAgfSk7XG4gICAgfSxcblxuICAgIGFzc2VtYmxlIDogZnVuY3Rpb24gKCRsaSkge1xuICAgICAgdmFyICRlbCA9ICRsaS5wYXJlbnQoKTtcblxuICAgICAgaWYgKCRlbC5wYXJlbnQoKS5oYXNDbGFzcygnY2Fyb3VzZWwnKSkge1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG5cbiAgICAgICRlbC5hZnRlcignPGRpdiBpZD1cImZvdW5kYXRpb25DbGVhcmluZ0hvbGRlclwiPjwvZGl2PicpO1xuXG4gICAgICB2YXIgZ3JpZCA9ICRlbC5kZXRhY2goKSxcbiAgICAgICAgICBncmlkX291dGVySFRNTCA9ICcnO1xuXG4gICAgICBpZiAoZ3JpZFswXSA9PSBudWxsKSB7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGdyaWRfb3V0ZXJIVE1MID0gZ3JpZFswXS5vdXRlckhUTUw7XG4gICAgICB9XG5cbiAgICAgIHZhciBob2xkZXIgPSB0aGlzLlMoJyNmb3VuZGF0aW9uQ2xlYXJpbmdIb2xkZXInKSxcbiAgICAgICAgICBzZXR0aW5ncyA9ICRlbC5kYXRhKHRoaXMuYXR0cl9uYW1lKHRydWUpICsgJy1pbml0JyksXG4gICAgICAgICAgZGF0YSA9IHtcbiAgICAgICAgICAgIGdyaWQgOiAnPGRpdiBjbGFzcz1cImNhcm91c2VsXCI+JyArIGdyaWRfb3V0ZXJIVE1MICsgJzwvZGl2PicsXG4gICAgICAgICAgICB2aWV3aW5nIDogc2V0dGluZ3MudGVtcGxhdGVzLnZpZXdpbmdcbiAgICAgICAgICB9LFxuICAgICAgICAgIHdyYXBwZXIgPSAnPGRpdiBjbGFzcz1cImNsZWFyaW5nLWFzc2VtYmxlZFwiPjxkaXY+JyArIGRhdGEudmlld2luZyArXG4gICAgICAgICAgICBkYXRhLmdyaWQgKyAnPC9kaXY+PC9kaXY+JyxcbiAgICAgICAgICB0b3VjaF9sYWJlbCA9IHRoaXMuc2V0dGluZ3MudG91Y2hfbGFiZWw7XG5cbiAgICAgIGlmIChNb2Rlcm5penIudG91Y2gpIHtcbiAgICAgICAgd3JhcHBlciA9ICQod3JhcHBlcikuZmluZCgnLmNsZWFyaW5nLXRvdWNoLWxhYmVsJykuaHRtbCh0b3VjaF9sYWJlbCkuZW5kKCk7XG4gICAgICB9XG5cbiAgICAgIGhvbGRlci5hZnRlcih3cmFwcGVyKS5yZW1vdmUoKTtcbiAgICB9LFxuXG4gICAgb3BlbiA6IGZ1bmN0aW9uICgkaW1hZ2UsIGN1cnJlbnQsIHRhcmdldCkge1xuICAgICAgdmFyIHNlbGYgPSB0aGlzLFxuICAgICAgICAgIGJvZHkgPSAkKGRvY3VtZW50LmJvZHkpLFxuICAgICAgICAgIHJvb3QgPSB0YXJnZXQuY2xvc2VzdCgnLmNsZWFyaW5nLWFzc2VtYmxlZCcpLFxuICAgICAgICAgIGNvbnRhaW5lciA9IHNlbGYuUygnZGl2Jywgcm9vdCkuZmlyc3QoKSxcbiAgICAgICAgICB2aXNpYmxlX2ltYWdlID0gc2VsZi5TKCcudmlzaWJsZS1pbWcnLCBjb250YWluZXIpLFxuICAgICAgICAgIGltYWdlID0gc2VsZi5TKCdpbWcnLCB2aXNpYmxlX2ltYWdlKS5ub3QoJGltYWdlKSxcbiAgICAgICAgICBsYWJlbCA9IHNlbGYuUygnLmNsZWFyaW5nLXRvdWNoLWxhYmVsJywgY29udGFpbmVyKSxcbiAgICAgICAgICBlcnJvciA9IGZhbHNlLFxuICAgICAgICAgIGxvYWRlZCA9IHt9O1xuXG4gICAgICAvLyBFdmVudCB0byBkaXNhYmxlIHNjcm9sbGluZyBvbiB0b3VjaCBkZXZpY2VzIHdoZW4gQ2xlYXJpbmcgaXMgYWN0aXZhdGVkXG4gICAgICAkKCdib2R5Jykub24oJ3RvdWNobW92ZScsIGZ1bmN0aW9uIChlKSB7XG4gICAgICAgIGUucHJldmVudERlZmF1bHQoKTtcbiAgICAgIH0pO1xuXG4gICAgICBpbWFnZS5lcnJvcihmdW5jdGlvbiAoKSB7XG4gICAgICAgIGVycm9yID0gdHJ1ZTtcbiAgICAgIH0pO1xuXG4gICAgICBmdW5jdGlvbiBzdGFydExvYWQoKSB7XG4gICAgICAgIHNldFRpbWVvdXQoZnVuY3Rpb24gKCkge1xuICAgICAgICAgIHRoaXMuaW1hZ2VfbG9hZGVkKGltYWdlLCBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICBpZiAoaW1hZ2Uub3V0ZXJXaWR0aCgpID09PSAxICYmICFlcnJvcikge1xuICAgICAgICAgICAgICBzdGFydExvYWQuY2FsbCh0aGlzKTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgIGNiLmNhbGwodGhpcywgaW1hZ2UpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH0uYmluZCh0aGlzKSk7XG4gICAgICAgIH0uYmluZCh0aGlzKSwgMTAwKTtcbiAgICAgIH1cblxuICAgICAgZnVuY3Rpb24gY2IgKGltYWdlKSB7XG4gICAgICAgIHZhciAkaW1hZ2UgPSAkKGltYWdlKTtcbiAgICAgICAgJGltYWdlLmNzcygndmlzaWJpbGl0eScsICd2aXNpYmxlJyk7XG4gICAgICAgICRpbWFnZS50cmlnZ2VyKCdpbWFnZVZpc2libGUnKTtcbiAgICAgICAgLy8gdG9nZ2xlIHRoZSBnYWxsZXJ5XG4gICAgICAgIGJvZHkuY3NzKCdvdmVyZmxvdycsICdoaWRkZW4nKTtcbiAgICAgICAgcm9vdC5hZGRDbGFzcygnY2xlYXJpbmctYmxhY2tvdXQnKTtcbiAgICAgICAgY29udGFpbmVyLmFkZENsYXNzKCdjbGVhcmluZy1jb250YWluZXInKTtcbiAgICAgICAgdmlzaWJsZV9pbWFnZS5zaG93KCk7XG4gICAgICAgIHRoaXMuZml4X2hlaWdodCh0YXJnZXQpXG4gICAgICAgICAgLmNhcHRpb24oc2VsZi5TKCcuY2xlYXJpbmctY2FwdGlvbicsIHZpc2libGVfaW1hZ2UpLCBzZWxmLlMoJ2ltZycsIHRhcmdldCkpXG4gICAgICAgICAgLmNlbnRlcl9hbmRfbGFiZWwoaW1hZ2UsIGxhYmVsKVxuICAgICAgICAgIC5zaGlmdChjdXJyZW50LCB0YXJnZXQsIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIHRhcmdldC5jbG9zZXN0KCdsaScpLnNpYmxpbmdzKCkucmVtb3ZlQ2xhc3MoJ3Zpc2libGUnKTtcbiAgICAgICAgICAgIHRhcmdldC5jbG9zZXN0KCdsaScpLmFkZENsYXNzKCd2aXNpYmxlJyk7XG4gICAgICAgICAgfSk7XG4gICAgICAgIHZpc2libGVfaW1hZ2UudHJpZ2dlcignb3BlbmVkLmZuZHRuLmNsZWFyaW5nJylcbiAgICAgIH1cblxuICAgICAgaWYgKCF0aGlzLmxvY2tlZCgpKSB7XG4gICAgICAgIHZpc2libGVfaW1hZ2UudHJpZ2dlcignb3Blbi5mbmR0bi5jbGVhcmluZycpO1xuICAgICAgICAvLyBzZXQgdGhlIGltYWdlIHRvIHRoZSBzZWxlY3RlZCB0aHVtYm5haWxcbiAgICAgICAgbG9hZGVkID0gdGhpcy5sb2FkKCRpbWFnZSk7XG4gICAgICAgIGlmIChsb2FkZWQuaW50ZXJjaGFuZ2UpIHtcbiAgICAgICAgICBpbWFnZVxuICAgICAgICAgICAgLmF0dHIoJ2RhdGEtaW50ZXJjaGFuZ2UnLCBsb2FkZWQuaW50ZXJjaGFuZ2UpXG4gICAgICAgICAgICAuZm91bmRhdGlvbignaW50ZXJjaGFuZ2UnLCAncmVmbG93Jyk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgaW1hZ2VcbiAgICAgICAgICAgIC5hdHRyKCdzcmMnLCBsb2FkZWQuc3JjKVxuICAgICAgICAgICAgLmF0dHIoJ2RhdGEtaW50ZXJjaGFuZ2UnLCAnJyk7XG4gICAgICAgIH1cbiAgICAgICAgaW1hZ2UuY3NzKCd2aXNpYmlsaXR5JywgJ2hpZGRlbicpO1xuXG4gICAgICAgIHN0YXJ0TG9hZC5jYWxsKHRoaXMpO1xuICAgICAgfVxuICAgIH0sXG5cbiAgICBjbG9zZSA6IGZ1bmN0aW9uIChlLCBlbCkge1xuICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuXG4gICAgICB2YXIgcm9vdCA9IChmdW5jdGlvbiAodGFyZ2V0KSB7XG4gICAgICAgICAgICBpZiAoL2JsYWNrb3V0Ly50ZXN0KHRhcmdldC5zZWxlY3RvcikpIHtcbiAgICAgICAgICAgICAgcmV0dXJuIHRhcmdldDtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgIHJldHVybiB0YXJnZXQuY2xvc2VzdCgnLmNsZWFyaW5nLWJsYWNrb3V0Jyk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfSgkKGVsKSkpLFxuICAgICAgICAgIGJvZHkgPSAkKGRvY3VtZW50LmJvZHkpLCBjb250YWluZXIsIHZpc2libGVfaW1hZ2U7XG5cbiAgICAgIGlmIChlbCA9PT0gZS50YXJnZXQgJiYgcm9vdCkge1xuICAgICAgICBib2R5LmNzcygnb3ZlcmZsb3cnLCAnJyk7XG4gICAgICAgIGNvbnRhaW5lciA9ICQoJ2RpdicsIHJvb3QpLmZpcnN0KCk7XG4gICAgICAgIHZpc2libGVfaW1hZ2UgPSAkKCcudmlzaWJsZS1pbWcnLCBjb250YWluZXIpO1xuICAgICAgICB2aXNpYmxlX2ltYWdlLnRyaWdnZXIoJ2Nsb3NlLmZuZHRuLmNsZWFyaW5nJyk7XG4gICAgICAgIHRoaXMuc2V0dGluZ3MucHJldl9pbmRleCA9IDA7XG4gICAgICAgICQoJ3VsWycgKyB0aGlzLmF0dHJfbmFtZSgpICsgJ10nLCByb290KVxuICAgICAgICAgIC5hdHRyKCdzdHlsZScsICcnKS5jbG9zZXN0KCcuY2xlYXJpbmctYmxhY2tvdXQnKVxuICAgICAgICAgIC5yZW1vdmVDbGFzcygnY2xlYXJpbmctYmxhY2tvdXQnKTtcbiAgICAgICAgY29udGFpbmVyLnJlbW92ZUNsYXNzKCdjbGVhcmluZy1jb250YWluZXInKTtcbiAgICAgICAgdmlzaWJsZV9pbWFnZS5oaWRlKCk7XG4gICAgICAgIHZpc2libGVfaW1hZ2UudHJpZ2dlcignY2xvc2VkLmZuZHRuLmNsZWFyaW5nJyk7XG4gICAgICB9XG5cbiAgICAgIC8vIEV2ZW50IHRvIHJlLWVuYWJsZSBzY3JvbGxpbmcgb24gdG91Y2ggZGV2aWNlc1xuICAgICAgJCgnYm9keScpLm9mZigndG91Y2htb3ZlJyk7XG5cbiAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9LFxuXG4gICAgaXNfb3BlbiA6IGZ1bmN0aW9uIChjdXJyZW50KSB7XG4gICAgICByZXR1cm4gY3VycmVudC5wYXJlbnQoKS5wcm9wKCdzdHlsZScpLmxlbmd0aCA+IDA7XG4gICAgfSxcblxuICAgIGtleWRvd24gOiBmdW5jdGlvbiAoZSkge1xuICAgICAgdmFyIGNsZWFyaW5nID0gJCgnLmNsZWFyaW5nLWJsYWNrb3V0IHVsWycgKyB0aGlzLmF0dHJfbmFtZSgpICsgJ10nKSxcbiAgICAgICAgICBORVhUX0tFWSA9IHRoaXMucnRsID8gMzcgOiAzOSxcbiAgICAgICAgICBQUkVWX0tFWSA9IHRoaXMucnRsID8gMzkgOiAzNyxcbiAgICAgICAgICBFU0NfS0VZID0gMjc7XG5cbiAgICAgIGlmIChlLndoaWNoID09PSBORVhUX0tFWSkge1xuICAgICAgICB0aGlzLmdvKGNsZWFyaW5nLCAnbmV4dCcpO1xuICAgICAgfVxuICAgICAgaWYgKGUud2hpY2ggPT09IFBSRVZfS0VZKSB7XG4gICAgICAgIHRoaXMuZ28oY2xlYXJpbmcsICdwcmV2Jyk7XG4gICAgICB9XG4gICAgICBpZiAoZS53aGljaCA9PT0gRVNDX0tFWSkge1xuICAgICAgICB0aGlzLlMoJ2EuY2xlYXJpbmctY2xvc2UnKS50cmlnZ2VyKCdjbGljay5mbmR0bi5jbGVhcmluZycpO1xuICAgICAgfVxuICAgIH0sXG5cbiAgICBuYXYgOiBmdW5jdGlvbiAoZSwgZGlyZWN0aW9uKSB7XG4gICAgICB2YXIgY2xlYXJpbmcgPSAkKCd1bFsnICsgdGhpcy5hdHRyX25hbWUoKSArICddJywgJy5jbGVhcmluZy1ibGFja291dCcpO1xuXG4gICAgICBlLnByZXZlbnREZWZhdWx0KCk7XG4gICAgICB0aGlzLmdvKGNsZWFyaW5nLCBkaXJlY3Rpb24pO1xuICAgIH0sXG5cbiAgICByZXNpemUgOiBmdW5jdGlvbiAoKSB7XG4gICAgICB2YXIgaW1hZ2UgPSAkKCdpbWcnLCAnLmNsZWFyaW5nLWJsYWNrb3V0IC52aXNpYmxlLWltZycpLFxuICAgICAgICAgIGxhYmVsID0gJCgnLmNsZWFyaW5nLXRvdWNoLWxhYmVsJywgJy5jbGVhcmluZy1ibGFja291dCcpO1xuXG4gICAgICBpZiAoaW1hZ2UubGVuZ3RoKSB7XG4gICAgICAgIHRoaXMuY2VudGVyX2FuZF9sYWJlbChpbWFnZSwgbGFiZWwpO1xuICAgICAgICBpbWFnZS50cmlnZ2VyKCdyZXNpemVkLmZuZHRuLmNsZWFyaW5nJylcbiAgICAgIH1cbiAgICB9LFxuXG4gICAgLy8gdmlzdWFsIGFkanVzdG1lbnRzXG4gICAgZml4X2hlaWdodCA6IGZ1bmN0aW9uICh0YXJnZXQpIHtcbiAgICAgIHZhciBsaXMgPSB0YXJnZXQucGFyZW50KCkuY2hpbGRyZW4oKSxcbiAgICAgICAgICBzZWxmID0gdGhpcztcblxuICAgICAgbGlzLmVhY2goZnVuY3Rpb24gKCkge1xuICAgICAgICB2YXIgbGkgPSBzZWxmLlModGhpcyksXG4gICAgICAgICAgICBpbWFnZSA9IGxpLmZpbmQoJ2ltZycpO1xuXG4gICAgICAgIGlmIChsaS5oZWlnaHQoKSA+IGltYWdlLm91dGVySGVpZ2h0KCkpIHtcbiAgICAgICAgICBsaS5hZGRDbGFzcygnZml4LWhlaWdodCcpO1xuICAgICAgICB9XG4gICAgICB9KVxuICAgICAgLmNsb3Nlc3QoJ3VsJylcbiAgICAgIC53aWR0aChsaXMubGVuZ3RoICogMTAwICsgJyUnKTtcblxuICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfSxcblxuICAgIHVwZGF0ZV9wYWRkbGVzIDogZnVuY3Rpb24gKHRhcmdldCkge1xuICAgICAgdGFyZ2V0ID0gdGFyZ2V0LmNsb3Nlc3QoJ2xpJyk7XG4gICAgICB2YXIgdmlzaWJsZV9pbWFnZSA9IHRhcmdldFxuICAgICAgICAuY2xvc2VzdCgnLmNhcm91c2VsJylcbiAgICAgICAgLnNpYmxpbmdzKCcudmlzaWJsZS1pbWcnKTtcblxuICAgICAgaWYgKHRhcmdldC5uZXh0KCkubGVuZ3RoID4gMCkge1xuICAgICAgICB0aGlzLlMoJy5jbGVhcmluZy1tYWluLW5leHQnLCB2aXNpYmxlX2ltYWdlKS5yZW1vdmVDbGFzcygnZGlzYWJsZWQnKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHRoaXMuUygnLmNsZWFyaW5nLW1haW4tbmV4dCcsIHZpc2libGVfaW1hZ2UpLmFkZENsYXNzKCdkaXNhYmxlZCcpO1xuICAgICAgfVxuXG4gICAgICBpZiAodGFyZ2V0LnByZXYoKS5sZW5ndGggPiAwKSB7XG4gICAgICAgIHRoaXMuUygnLmNsZWFyaW5nLW1haW4tcHJldicsIHZpc2libGVfaW1hZ2UpLnJlbW92ZUNsYXNzKCdkaXNhYmxlZCcpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdGhpcy5TKCcuY2xlYXJpbmctbWFpbi1wcmV2JywgdmlzaWJsZV9pbWFnZSkuYWRkQ2xhc3MoJ2Rpc2FibGVkJyk7XG4gICAgICB9XG4gICAgfSxcblxuICAgIGNlbnRlcl9hbmRfbGFiZWwgOiBmdW5jdGlvbiAodGFyZ2V0LCBsYWJlbCkge1xuICAgICAgaWYgKCF0aGlzLnJ0bCAmJiBsYWJlbC5sZW5ndGggPiAwKSB7XG4gICAgICAgIGxhYmVsLmNzcyh7XG4gICAgICAgICAgbWFyZ2luTGVmdCA6IC0obGFiZWwub3V0ZXJXaWR0aCgpIC8gMiksXG4gICAgICAgICAgbWFyZ2luVG9wIDogLSh0YXJnZXQub3V0ZXJIZWlnaHQoKSAvIDIpLWxhYmVsLm91dGVySGVpZ2h0KCktMTBcbiAgICAgICAgfSk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBsYWJlbC5jc3Moe1xuICAgICAgICAgIG1hcmdpblJpZ2h0IDogLShsYWJlbC5vdXRlcldpZHRoKCkgLyAyKSxcbiAgICAgICAgICBtYXJnaW5Ub3AgOiAtKHRhcmdldC5vdXRlckhlaWdodCgpIC8gMiktbGFiZWwub3V0ZXJIZWlnaHQoKS0xMCxcbiAgICAgICAgICBsZWZ0OiAnYXV0bycsXG4gICAgICAgICAgcmlnaHQ6ICc1MCUnXG4gICAgICAgIH0pO1xuICAgICAgfVxuICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfSxcblxuICAgIC8vIGltYWdlIGxvYWRpbmcgYW5kIHByZWxvYWRpbmdcblxuICAgIGxvYWQgOiBmdW5jdGlvbiAoJGltYWdlKSB7XG4gICAgICB2YXIgaHJlZixcbiAgICAgICAgICBpbnRlcmNoYW5nZSxcbiAgICAgICAgICBjbG9zZXN0X2E7XG5cbiAgICAgIGlmICgkaW1hZ2VbMF0ubm9kZU5hbWUgPT09ICdBJykge1xuICAgICAgICBocmVmID0gJGltYWdlLmF0dHIoJ2hyZWYnKTtcbiAgICAgICAgaW50ZXJjaGFuZ2UgPSAkaW1hZ2UuZGF0YSgnY2xlYXJpbmctaW50ZXJjaGFuZ2UnKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGNsb3Nlc3RfYSA9ICRpbWFnZS5jbG9zZXN0KCdhJyk7XG4gICAgICAgIGhyZWYgPSBjbG9zZXN0X2EuYXR0cignaHJlZicpO1xuICAgICAgICBpbnRlcmNoYW5nZSA9IGNsb3Nlc3RfYS5kYXRhKCdjbGVhcmluZy1pbnRlcmNoYW5nZScpO1xuICAgICAgfVxuXG4gICAgICB0aGlzLnByZWxvYWQoJGltYWdlKTtcblxuICAgICAgcmV0dXJuIHtcbiAgICAgICAgJ3NyYyc6IGhyZWYgPyBocmVmIDogJGltYWdlLmF0dHIoJ3NyYycpLFxuICAgICAgICAnaW50ZXJjaGFuZ2UnOiBocmVmID8gaW50ZXJjaGFuZ2UgOiAkaW1hZ2UuZGF0YSgnY2xlYXJpbmctaW50ZXJjaGFuZ2UnKVxuICAgICAgfVxuICAgIH0sXG5cbiAgICBwcmVsb2FkIDogZnVuY3Rpb24gKCRpbWFnZSkge1xuICAgICAgdGhpc1xuICAgICAgICAuaW1nKCRpbWFnZS5jbG9zZXN0KCdsaScpLm5leHQoKSwgJ25leHQnKVxuICAgICAgICAuaW1nKCRpbWFnZS5jbG9zZXN0KCdsaScpLnByZXYoKSwgJ3ByZXYnKTtcbiAgICB9LFxuXG4gICAgaW1nIDogZnVuY3Rpb24gKGltZywgc2libGluZ190eXBlKSB7XG4gICAgICBpZiAoaW1nLmxlbmd0aCkge1xuICAgICAgICB2YXIgcHJlbG9hZF9pbWcgPSAkKCcuY2xlYXJpbmctcHJlbG9hZC0nICsgc2libGluZ190eXBlKSxcbiAgICAgICAgICAgIG5ld19hID0gdGhpcy5TKCdhJywgaW1nKSxcbiAgICAgICAgICAgIHNyYyxcbiAgICAgICAgICAgIGludGVyY2hhbmdlLFxuICAgICAgICAgICAgaW1hZ2U7XG5cbiAgICAgICAgaWYgKG5ld19hLmxlbmd0aCkge1xuICAgICAgICAgIHNyYyA9IG5ld19hLmF0dHIoJ2hyZWYnKTtcbiAgICAgICAgICBpbnRlcmNoYW5nZSA9IG5ld19hLmRhdGEoJ2NsZWFyaW5nLWludGVyY2hhbmdlJyk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgaW1hZ2UgPSB0aGlzLlMoJ2ltZycsIGltZyk7XG4gICAgICAgICAgc3JjID0gaW1hZ2UuYXR0cignc3JjJyk7XG4gICAgICAgICAgaW50ZXJjaGFuZ2UgPSBpbWFnZS5kYXRhKCdjbGVhcmluZy1pbnRlcmNoYW5nZScpO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKGludGVyY2hhbmdlKSB7XG4gICAgICAgICAgcHJlbG9hZF9pbWcuYXR0cignZGF0YS1pbnRlcmNoYW5nZScsIGludGVyY2hhbmdlKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBwcmVsb2FkX2ltZy5hdHRyKCdzcmMnLCBzcmMpO1xuICAgICAgICAgIHByZWxvYWRfaW1nLmF0dHIoJ2RhdGEtaW50ZXJjaGFuZ2UnLCAnJyk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIHJldHVybiB0aGlzO1xuICAgIH0sXG5cbiAgICAvLyBpbWFnZSBjYXB0aW9uXG5cbiAgICBjYXB0aW9uIDogZnVuY3Rpb24gKGNvbnRhaW5lciwgJGltYWdlKSB7XG4gICAgICB2YXIgY2FwdGlvbiA9ICRpbWFnZS5hdHRyKCdkYXRhLWNhcHRpb24nKTtcblxuICAgICAgaWYgKGNhcHRpb24pIHtcbiAgICAgICAgY29udGFpbmVyXG4gICAgICAgICAgLmh0bWwoY2FwdGlvbilcbiAgICAgICAgICAuc2hvdygpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgY29udGFpbmVyXG4gICAgICAgICAgLnRleHQoJycpXG4gICAgICAgICAgLmhpZGUoKTtcbiAgICAgIH1cbiAgICAgIHJldHVybiB0aGlzO1xuICAgIH0sXG5cbiAgICAvLyBkaXJlY3Rpb25hbCBtZXRob2RzXG5cbiAgICBnbyA6IGZ1bmN0aW9uICgkdWwsIGRpcmVjdGlvbikge1xuICAgICAgdmFyIGN1cnJlbnQgPSB0aGlzLlMoJy52aXNpYmxlJywgJHVsKSxcbiAgICAgICAgICB0YXJnZXQgPSBjdXJyZW50W2RpcmVjdGlvbl0oKTtcblxuICAgICAgLy8gQ2hlY2sgZm9yIHNraXAgc2VsZWN0b3IuXG4gICAgICBpZiAodGhpcy5zZXR0aW5ncy5za2lwX3NlbGVjdG9yICYmIHRhcmdldC5maW5kKHRoaXMuc2V0dGluZ3Muc2tpcF9zZWxlY3RvcikubGVuZ3RoICE9IDApIHtcbiAgICAgICAgdGFyZ2V0ID0gdGFyZ2V0W2RpcmVjdGlvbl0oKTtcbiAgICAgIH1cblxuICAgICAgaWYgKHRhcmdldC5sZW5ndGgpIHtcbiAgICAgICAgdGhpcy5TKCdpbWcnLCB0YXJnZXQpXG4gICAgICAgICAgLnRyaWdnZXIoJ2NsaWNrLmZuZHRuLmNsZWFyaW5nJywgW2N1cnJlbnQsIHRhcmdldF0pXG4gICAgICAgICAgLnRyaWdnZXIoJ2NoYW5nZS5mbmR0bi5jbGVhcmluZycpO1xuICAgICAgfVxuICAgIH0sXG5cbiAgICBzaGlmdCA6IGZ1bmN0aW9uIChjdXJyZW50LCB0YXJnZXQsIGNhbGxiYWNrKSB7XG4gICAgICB2YXIgY2xlYXJpbmcgPSB0YXJnZXQucGFyZW50KCksXG4gICAgICAgICAgb2xkX2luZGV4ID0gdGhpcy5zZXR0aW5ncy5wcmV2X2luZGV4IHx8IHRhcmdldC5pbmRleCgpLFxuICAgICAgICAgIGRpcmVjdGlvbiA9IHRoaXMuZGlyZWN0aW9uKGNsZWFyaW5nLCBjdXJyZW50LCB0YXJnZXQpLFxuICAgICAgICAgIGRpciA9IHRoaXMucnRsID8gJ3JpZ2h0JyA6ICdsZWZ0JyxcbiAgICAgICAgICBsZWZ0ID0gcGFyc2VJbnQoY2xlYXJpbmcuY3NzKCdsZWZ0JyksIDEwKSxcbiAgICAgICAgICB3aWR0aCA9IHRhcmdldC5vdXRlcldpZHRoKCksXG4gICAgICAgICAgc2tpcF9zaGlmdDtcblxuICAgICAgdmFyIGRpcl9vYmogPSB7fTtcblxuICAgICAgLy8gd2UgdXNlIGpRdWVyeSBhbmltYXRlIGluc3RlYWQgb2YgQ1NTIHRyYW5zaXRpb25zIGJlY2F1c2Ugd2VcbiAgICAgIC8vIG5lZWQgYSBjYWxsYmFjayB0byB1bmxvY2sgdGhlIG5leHQgYW5pbWF0aW9uXG4gICAgICAvLyBuZWVkcyBzdXBwb3J0IGZvciBSVEwgKipcbiAgICAgIGlmICh0YXJnZXQuaW5kZXgoKSAhPT0gb2xkX2luZGV4ICYmICEvc2tpcC8udGVzdChkaXJlY3Rpb24pKSB7XG4gICAgICAgIGlmICgvbGVmdC8udGVzdChkaXJlY3Rpb24pKSB7XG4gICAgICAgICAgdGhpcy5sb2NrKCk7XG4gICAgICAgICAgZGlyX29ialtkaXJdID0gbGVmdCArIHdpZHRoO1xuICAgICAgICAgIGNsZWFyaW5nLmFuaW1hdGUoZGlyX29iaiwgMzAwLCB0aGlzLnVubG9jaygpKTtcbiAgICAgICAgfSBlbHNlIGlmICgvcmlnaHQvLnRlc3QoZGlyZWN0aW9uKSkge1xuICAgICAgICAgIHRoaXMubG9jaygpO1xuICAgICAgICAgIGRpcl9vYmpbZGlyXSA9IGxlZnQgLSB3aWR0aDtcbiAgICAgICAgICBjbGVhcmluZy5hbmltYXRlKGRpcl9vYmosIDMwMCwgdGhpcy51bmxvY2soKSk7XG4gICAgICAgIH1cbiAgICAgIH0gZWxzZSBpZiAoL3NraXAvLnRlc3QoZGlyZWN0aW9uKSkge1xuICAgICAgICAvLyB0aGUgdGFyZ2V0IGltYWdlIGlzIG5vdCBhZGphY2VudCB0byB0aGUgY3VycmVudCBpbWFnZSwgc29cbiAgICAgICAgLy8gZG8gd2Ugc2Nyb2xsIHJpZ2h0IG9yIG5vdFxuICAgICAgICBza2lwX3NoaWZ0ID0gdGFyZ2V0LmluZGV4KCkgLSB0aGlzLnNldHRpbmdzLnVwX2NvdW50O1xuICAgICAgICB0aGlzLmxvY2soKTtcblxuICAgICAgICBpZiAoc2tpcF9zaGlmdCA+IDApIHtcbiAgICAgICAgICBkaXJfb2JqW2Rpcl0gPSAtKHNraXBfc2hpZnQgKiB3aWR0aCk7XG4gICAgICAgICAgY2xlYXJpbmcuYW5pbWF0ZShkaXJfb2JqLCAzMDAsIHRoaXMudW5sb2NrKCkpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIGRpcl9vYmpbZGlyXSA9IDA7XG4gICAgICAgICAgY2xlYXJpbmcuYW5pbWF0ZShkaXJfb2JqLCAzMDAsIHRoaXMudW5sb2NrKCkpO1xuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIGNhbGxiYWNrKCk7XG4gICAgfSxcblxuICAgIGRpcmVjdGlvbiA6IGZ1bmN0aW9uICgkZWwsIGN1cnJlbnQsIHRhcmdldCkge1xuICAgICAgdmFyIGxpcyA9IHRoaXMuUygnbGknLCAkZWwpLFxuICAgICAgICAgIGxpX3dpZHRoID0gbGlzLm91dGVyV2lkdGgoKSArIChsaXMub3V0ZXJXaWR0aCgpIC8gNCksXG4gICAgICAgICAgdXBfY291bnQgPSBNYXRoLmZsb29yKHRoaXMuUygnLmNsZWFyaW5nLWNvbnRhaW5lcicpLm91dGVyV2lkdGgoKSAvIGxpX3dpZHRoKSAtIDEsXG4gICAgICAgICAgdGFyZ2V0X2luZGV4ID0gbGlzLmluZGV4KHRhcmdldCksXG4gICAgICAgICAgcmVzcG9uc2U7XG5cbiAgICAgIHRoaXMuc2V0dGluZ3MudXBfY291bnQgPSB1cF9jb3VudDtcblxuICAgICAgaWYgKHRoaXMuYWRqYWNlbnQodGhpcy5zZXR0aW5ncy5wcmV2X2luZGV4LCB0YXJnZXRfaW5kZXgpKSB7XG4gICAgICAgIGlmICgodGFyZ2V0X2luZGV4ID4gdXBfY291bnQpICYmIHRhcmdldF9pbmRleCA+IHRoaXMuc2V0dGluZ3MucHJldl9pbmRleCkge1xuICAgICAgICAgIHJlc3BvbnNlID0gJ3JpZ2h0JztcbiAgICAgICAgfSBlbHNlIGlmICgodGFyZ2V0X2luZGV4ID4gdXBfY291bnQgLSAxKSAmJiB0YXJnZXRfaW5kZXggPD0gdGhpcy5zZXR0aW5ncy5wcmV2X2luZGV4KSB7XG4gICAgICAgICAgcmVzcG9uc2UgPSAnbGVmdCc7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgcmVzcG9uc2UgPSBmYWxzZTtcbiAgICAgICAgfVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgcmVzcG9uc2UgPSAnc2tpcCc7XG4gICAgICB9XG5cbiAgICAgIHRoaXMuc2V0dGluZ3MucHJldl9pbmRleCA9IHRhcmdldF9pbmRleDtcblxuICAgICAgcmV0dXJuIHJlc3BvbnNlO1xuICAgIH0sXG5cbiAgICBhZGphY2VudCA6IGZ1bmN0aW9uIChjdXJyZW50X2luZGV4LCB0YXJnZXRfaW5kZXgpIHtcbiAgICAgIGZvciAodmFyIGkgPSB0YXJnZXRfaW5kZXggKyAxOyBpID49IHRhcmdldF9pbmRleCAtIDE7IGktLSkge1xuICAgICAgICBpZiAoaSA9PT0gY3VycmVudF9pbmRleCkge1xuICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgfSxcblxuICAgIC8vIGxvY2sgbWFuYWdlbWVudFxuXG4gICAgbG9jayA6IGZ1bmN0aW9uICgpIHtcbiAgICAgIHRoaXMuc2V0dGluZ3MubG9ja2VkID0gdHJ1ZTtcbiAgICB9LFxuXG4gICAgdW5sb2NrIDogZnVuY3Rpb24gKCkge1xuICAgICAgdGhpcy5zZXR0aW5ncy5sb2NrZWQgPSBmYWxzZTtcbiAgICB9LFxuXG4gICAgbG9ja2VkIDogZnVuY3Rpb24gKCkge1xuICAgICAgcmV0dXJuIHRoaXMuc2V0dGluZ3MubG9ja2VkO1xuICAgIH0sXG5cbiAgICBvZmYgOiBmdW5jdGlvbiAoKSB7XG4gICAgICB0aGlzLlModGhpcy5zY29wZSkub2ZmKCcuZm5kdG4uY2xlYXJpbmcnKTtcbiAgICAgIHRoaXMuUyh3aW5kb3cpLm9mZignLmZuZHRuLmNsZWFyaW5nJyk7XG4gICAgfSxcblxuICAgIHJlZmxvdyA6IGZ1bmN0aW9uICgpIHtcbiAgICAgIHRoaXMuaW5pdCgpO1xuICAgIH1cbiAgfTtcblxufShqUXVlcnksIHdpbmRvdywgd2luZG93LmRvY3VtZW50KSk7XG4iXSwiZmlsZSI6ImZvdW5kYXRpb24vanMvZm91bmRhdGlvbi9mb3VuZGF0aW9uLmNsZWFyaW5nLmpzIiwic291cmNlUm9vdCI6Ii9zb3VyY2UvIn0=