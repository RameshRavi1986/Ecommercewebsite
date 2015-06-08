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

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiIiwic291cmNlcyI6WyJmb3VuZGF0aW9uL2pzL2ZvdW5kYXRpb24vZm91bmRhdGlvbi5vcmJpdC5qcyJdLCJzb3VyY2VzQ29udGVudCI6WyI7KGZ1bmN0aW9uICgkLCB3aW5kb3csIGRvY3VtZW50LCB1bmRlZmluZWQpIHtcbiAgJ3VzZSBzdHJpY3QnO1xuXG4gIHZhciBub29wID0gZnVuY3Rpb24gKCkge307XG5cbiAgdmFyIE9yYml0ID0gZnVuY3Rpb24gKGVsLCBzZXR0aW5ncykge1xuICAgIC8vIERvbid0IHJlaW5pdGlhbGl6ZSBwbHVnaW5cbiAgICBpZiAoZWwuaGFzQ2xhc3Moc2V0dGluZ3Muc2xpZGVzX2NvbnRhaW5lcl9jbGFzcykpIHtcbiAgICAgIHJldHVybiB0aGlzO1xuICAgIH1cblxuICAgIHZhciBzZWxmID0gdGhpcyxcbiAgICAgICAgY29udGFpbmVyLFxuICAgICAgICBzbGlkZXNfY29udGFpbmVyID0gZWwsXG4gICAgICAgIG51bWJlcl9jb250YWluZXIsXG4gICAgICAgIGJ1bGxldHNfY29udGFpbmVyLFxuICAgICAgICB0aW1lcl9jb250YWluZXIsXG4gICAgICAgIGlkeCA9IDAsXG4gICAgICAgIGFuaW1hdGUsXG4gICAgICAgIHRpbWVyLFxuICAgICAgICBsb2NrZWQgPSBmYWxzZSxcbiAgICAgICAgYWRqdXN0X2hlaWdodF9hZnRlciA9IGZhbHNlO1xuXG4gICAgc2VsZi5zbGlkZXMgPSBmdW5jdGlvbiAoKSB7XG4gICAgICByZXR1cm4gc2xpZGVzX2NvbnRhaW5lci5jaGlsZHJlbihzZXR0aW5ncy5zbGlkZV9zZWxlY3Rvcik7XG4gICAgfTtcblxuICAgIHNlbGYuc2xpZGVzKCkuZmlyc3QoKS5hZGRDbGFzcyhzZXR0aW5ncy5hY3RpdmVfc2xpZGVfY2xhc3MpO1xuXG4gICAgc2VsZi51cGRhdGVfc2xpZGVfbnVtYmVyID0gZnVuY3Rpb24gKGluZGV4KSB7XG4gICAgICBpZiAoc2V0dGluZ3Muc2xpZGVfbnVtYmVyKSB7XG4gICAgICAgIG51bWJlcl9jb250YWluZXIuZmluZCgnc3BhbjpmaXJzdCcpLnRleHQocGFyc2VJbnQoaW5kZXgpICsgMSk7XG4gICAgICAgIG51bWJlcl9jb250YWluZXIuZmluZCgnc3BhbjpsYXN0JykudGV4dChzZWxmLnNsaWRlcygpLmxlbmd0aCk7XG4gICAgICB9XG4gICAgICBpZiAoc2V0dGluZ3MuYnVsbGV0cykge1xuICAgICAgICBidWxsZXRzX2NvbnRhaW5lci5jaGlsZHJlbigpLnJlbW92ZUNsYXNzKHNldHRpbmdzLmJ1bGxldHNfYWN0aXZlX2NsYXNzKTtcbiAgICAgICAgJChidWxsZXRzX2NvbnRhaW5lci5jaGlsZHJlbigpLmdldChpbmRleCkpLmFkZENsYXNzKHNldHRpbmdzLmJ1bGxldHNfYWN0aXZlX2NsYXNzKTtcbiAgICAgIH1cbiAgICB9O1xuXG4gICAgc2VsZi51cGRhdGVfYWN0aXZlX2xpbmsgPSBmdW5jdGlvbiAoaW5kZXgpIHtcbiAgICAgIHZhciBsaW5rID0gJCgnW2RhdGEtb3JiaXQtbGluaz1cIicgKyBzZWxmLnNsaWRlcygpLmVxKGluZGV4KS5hdHRyKCdkYXRhLW9yYml0LXNsaWRlJykgKyAnXCJdJyk7XG4gICAgICBsaW5rLnNpYmxpbmdzKCkucmVtb3ZlQ2xhc3Moc2V0dGluZ3MuYnVsbGV0c19hY3RpdmVfY2xhc3MpO1xuICAgICAgbGluay5hZGRDbGFzcyhzZXR0aW5ncy5idWxsZXRzX2FjdGl2ZV9jbGFzcyk7XG4gICAgfTtcblxuICAgIHNlbGYuYnVpbGRfbWFya3VwID0gZnVuY3Rpb24gKCkge1xuICAgICAgc2xpZGVzX2NvbnRhaW5lci53cmFwKCc8ZGl2IGNsYXNzPVwiJyArIHNldHRpbmdzLmNvbnRhaW5lcl9jbGFzcyArICdcIj48L2Rpdj4nKTtcbiAgICAgIGNvbnRhaW5lciA9IHNsaWRlc19jb250YWluZXIucGFyZW50KCk7XG4gICAgICBzbGlkZXNfY29udGFpbmVyLmFkZENsYXNzKHNldHRpbmdzLnNsaWRlc19jb250YWluZXJfY2xhc3MpO1xuXG4gICAgICBpZiAoc2V0dGluZ3Muc3RhY2tfb25fc21hbGwpIHtcbiAgICAgICAgY29udGFpbmVyLmFkZENsYXNzKHNldHRpbmdzLnN0YWNrX29uX3NtYWxsX2NsYXNzKTtcbiAgICAgIH1cblxuICAgICAgaWYgKHNldHRpbmdzLm5hdmlnYXRpb25fYXJyb3dzKSB7XG4gICAgICAgIGNvbnRhaW5lci5hcHBlbmQoJCgnPGEgaHJlZj1cIiNcIj48c3Bhbj48L3NwYW4+PC9hPicpLmFkZENsYXNzKHNldHRpbmdzLnByZXZfY2xhc3MpKTtcbiAgICAgICAgY29udGFpbmVyLmFwcGVuZCgkKCc8YSBocmVmPVwiI1wiPjxzcGFuPjwvc3Bhbj48L2E+JykuYWRkQ2xhc3Moc2V0dGluZ3MubmV4dF9jbGFzcykpO1xuICAgICAgfVxuXG4gICAgICBpZiAoc2V0dGluZ3MudGltZXIpIHtcbiAgICAgICAgdGltZXJfY29udGFpbmVyID0gJCgnPGRpdj4nKS5hZGRDbGFzcyhzZXR0aW5ncy50aW1lcl9jb250YWluZXJfY2xhc3MpO1xuICAgICAgICB0aW1lcl9jb250YWluZXIuYXBwZW5kKCc8c3Bhbj4nKTtcbiAgICAgICAgdGltZXJfY29udGFpbmVyLmFwcGVuZCgkKCc8ZGl2PicpLmFkZENsYXNzKHNldHRpbmdzLnRpbWVyX3Byb2dyZXNzX2NsYXNzKSk7XG4gICAgICAgIHRpbWVyX2NvbnRhaW5lci5hZGRDbGFzcyhzZXR0aW5ncy50aW1lcl9wYXVzZWRfY2xhc3MpO1xuICAgICAgICBjb250YWluZXIuYXBwZW5kKHRpbWVyX2NvbnRhaW5lcik7XG4gICAgICB9XG5cbiAgICAgIGlmIChzZXR0aW5ncy5zbGlkZV9udW1iZXIpIHtcbiAgICAgICAgbnVtYmVyX2NvbnRhaW5lciA9ICQoJzxkaXY+JykuYWRkQ2xhc3Moc2V0dGluZ3Muc2xpZGVfbnVtYmVyX2NsYXNzKTtcbiAgICAgICAgbnVtYmVyX2NvbnRhaW5lci5hcHBlbmQoJzxzcGFuPjwvc3Bhbj4gJyArIHNldHRpbmdzLnNsaWRlX251bWJlcl90ZXh0ICsgJyA8c3Bhbj48L3NwYW4+Jyk7XG4gICAgICAgIGNvbnRhaW5lci5hcHBlbmQobnVtYmVyX2NvbnRhaW5lcik7XG4gICAgICB9XG5cbiAgICAgIGlmIChzZXR0aW5ncy5idWxsZXRzKSB7XG4gICAgICAgIGJ1bGxldHNfY29udGFpbmVyID0gJCgnPG9sPicpLmFkZENsYXNzKHNldHRpbmdzLmJ1bGxldHNfY29udGFpbmVyX2NsYXNzKTtcbiAgICAgICAgY29udGFpbmVyLmFwcGVuZChidWxsZXRzX2NvbnRhaW5lcik7XG4gICAgICAgIGJ1bGxldHNfY29udGFpbmVyLndyYXAoJzxkaXYgY2xhc3M9XCJvcmJpdC1idWxsZXRzLWNvbnRhaW5lclwiPjwvZGl2PicpO1xuICAgICAgICBzZWxmLnNsaWRlcygpLmVhY2goZnVuY3Rpb24gKGlkeCwgZWwpIHtcbiAgICAgICAgICB2YXIgYnVsbGV0ID0gJCgnPGxpPicpLmF0dHIoJ2RhdGEtb3JiaXQtc2xpZGUnLCBpZHgpLm9uKCdjbGljaycsIHNlbGYubGlua19idWxsZXQpOztcbiAgICAgICAgICBidWxsZXRzX2NvbnRhaW5lci5hcHBlbmQoYnVsbGV0KTtcbiAgICAgICAgfSk7XG4gICAgICB9XG5cbiAgICB9O1xuXG4gICAgc2VsZi5fZ290byA9IGZ1bmN0aW9uIChuZXh0X2lkeCwgc3RhcnRfdGltZXIpIHtcbiAgICAgIC8vIGlmIChsb2NrZWQpIHtyZXR1cm4gZmFsc2U7fVxuICAgICAgaWYgKG5leHRfaWR4ID09PSBpZHgpIHtyZXR1cm4gZmFsc2U7fVxuICAgICAgaWYgKHR5cGVvZiB0aW1lciA9PT0gJ29iamVjdCcpIHt0aW1lci5yZXN0YXJ0KCk7fVxuICAgICAgdmFyIHNsaWRlcyA9IHNlbGYuc2xpZGVzKCk7XG5cbiAgICAgIHZhciBkaXIgPSAnbmV4dCc7XG4gICAgICBsb2NrZWQgPSB0cnVlO1xuICAgICAgaWYgKG5leHRfaWR4IDwgaWR4KSB7ZGlyID0gJ3ByZXYnO31cbiAgICAgIGlmIChuZXh0X2lkeCA+PSBzbGlkZXMubGVuZ3RoKSB7XG4gICAgICAgIGlmICghc2V0dGluZ3MuY2lyY3VsYXIpIHtcbiAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgIH1cbiAgICAgICAgbmV4dF9pZHggPSAwO1xuICAgICAgfSBlbHNlIGlmIChuZXh0X2lkeCA8IDApIHtcbiAgICAgICAgaWYgKCFzZXR0aW5ncy5jaXJjdWxhcikge1xuICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgfVxuICAgICAgICBuZXh0X2lkeCA9IHNsaWRlcy5sZW5ndGggLSAxO1xuICAgICAgfVxuXG4gICAgICB2YXIgY3VycmVudCA9ICQoc2xpZGVzLmdldChpZHgpKTtcbiAgICAgIHZhciBuZXh0ID0gJChzbGlkZXMuZ2V0KG5leHRfaWR4KSk7XG5cbiAgICAgIGN1cnJlbnQuY3NzKCd6SW5kZXgnLCAyKTtcbiAgICAgIGN1cnJlbnQucmVtb3ZlQ2xhc3Moc2V0dGluZ3MuYWN0aXZlX3NsaWRlX2NsYXNzKTtcbiAgICAgIG5leHQuY3NzKCd6SW5kZXgnLCA0KS5hZGRDbGFzcyhzZXR0aW5ncy5hY3RpdmVfc2xpZGVfY2xhc3MpO1xuXG4gICAgICBzbGlkZXNfY29udGFpbmVyLnRyaWdnZXIoJ2JlZm9yZS1zbGlkZS1jaGFuZ2UuZm5kdG4ub3JiaXQnKTtcbiAgICAgIHNldHRpbmdzLmJlZm9yZV9zbGlkZV9jaGFuZ2UoKTtcbiAgICAgIHNlbGYudXBkYXRlX2FjdGl2ZV9saW5rKG5leHRfaWR4KTtcblxuICAgICAgdmFyIGNhbGxiYWNrID0gZnVuY3Rpb24gKCkge1xuICAgICAgICB2YXIgdW5sb2NrID0gZnVuY3Rpb24gKCkge1xuICAgICAgICAgIGlkeCA9IG5leHRfaWR4O1xuICAgICAgICAgIGxvY2tlZCA9IGZhbHNlO1xuICAgICAgICAgIGlmIChzdGFydF90aW1lciA9PT0gdHJ1ZSkge3RpbWVyID0gc2VsZi5jcmVhdGVfdGltZXIoKTsgdGltZXIuc3RhcnQoKTt9XG4gICAgICAgICAgc2VsZi51cGRhdGVfc2xpZGVfbnVtYmVyKGlkeCk7XG4gICAgICAgICAgc2xpZGVzX2NvbnRhaW5lci50cmlnZ2VyKCdhZnRlci1zbGlkZS1jaGFuZ2UuZm5kdG4ub3JiaXQnLCBbe3NsaWRlX251bWJlciA6IGlkeCwgdG90YWxfc2xpZGVzIDogc2xpZGVzLmxlbmd0aH1dKTtcbiAgICAgICAgICBzZXR0aW5ncy5hZnRlcl9zbGlkZV9jaGFuZ2UoaWR4LCBzbGlkZXMubGVuZ3RoKTtcbiAgICAgICAgfTtcbiAgICAgICAgaWYgKHNsaWRlc19jb250YWluZXIub3V0ZXJIZWlnaHQoKSAhPSBuZXh0Lm91dGVySGVpZ2h0KCkgJiYgc2V0dGluZ3MudmFyaWFibGVfaGVpZ2h0KSB7XG4gICAgICAgICAgc2xpZGVzX2NvbnRhaW5lci5hbmltYXRlKHsnaGVpZ2h0JzogbmV4dC5vdXRlckhlaWdodCgpfSwgMjUwLCAnbGluZWFyJywgdW5sb2NrKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICB1bmxvY2soKTtcbiAgICAgICAgfVxuICAgICAgfTtcblxuICAgICAgaWYgKHNsaWRlcy5sZW5ndGggPT09IDEpIHtjYWxsYmFjaygpOyByZXR1cm4gZmFsc2U7fVxuXG4gICAgICB2YXIgc3RhcnRfYW5pbWF0aW9uID0gZnVuY3Rpb24gKCkge1xuICAgICAgICBpZiAoZGlyID09PSAnbmV4dCcpIHthbmltYXRlLm5leHQoY3VycmVudCwgbmV4dCwgY2FsbGJhY2spO31cbiAgICAgICAgaWYgKGRpciA9PT0gJ3ByZXYnKSB7YW5pbWF0ZS5wcmV2KGN1cnJlbnQsIG5leHQsIGNhbGxiYWNrKTt9XG4gICAgICB9O1xuXG4gICAgICBpZiAobmV4dC5vdXRlckhlaWdodCgpID4gc2xpZGVzX2NvbnRhaW5lci5vdXRlckhlaWdodCgpICYmIHNldHRpbmdzLnZhcmlhYmxlX2hlaWdodCkge1xuICAgICAgICBzbGlkZXNfY29udGFpbmVyLmFuaW1hdGUoeydoZWlnaHQnOiBuZXh0Lm91dGVySGVpZ2h0KCl9LCAyNTAsICdsaW5lYXInLCBzdGFydF9hbmltYXRpb24pO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgc3RhcnRfYW5pbWF0aW9uKCk7XG4gICAgICB9XG4gICAgfTtcblxuICAgIHNlbGYubmV4dCA9IGZ1bmN0aW9uIChlKSB7XG4gICAgICBlLnN0b3BJbW1lZGlhdGVQcm9wYWdhdGlvbigpO1xuICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgc2VsZi5fZ290byhpZHggKyAxKTtcbiAgICB9O1xuXG4gICAgc2VsZi5wcmV2ID0gZnVuY3Rpb24gKGUpIHtcbiAgICAgIGUuc3RvcEltbWVkaWF0ZVByb3BhZ2F0aW9uKCk7XG4gICAgICBlLnByZXZlbnREZWZhdWx0KCk7XG4gICAgICBzZWxmLl9nb3RvKGlkeCAtIDEpO1xuICAgIH07XG5cbiAgICBzZWxmLmxpbmtfY3VzdG9tID0gZnVuY3Rpb24gKGUpIHtcbiAgICAgIGUucHJldmVudERlZmF1bHQoKTtcbiAgICAgIHZhciBsaW5rID0gJCh0aGlzKS5hdHRyKCdkYXRhLW9yYml0LWxpbmsnKTtcbiAgICAgIGlmICgodHlwZW9mIGxpbmsgPT09ICdzdHJpbmcnKSAmJiAobGluayA9ICQudHJpbShsaW5rKSkgIT0gJycpIHtcbiAgICAgICAgdmFyIHNsaWRlID0gY29udGFpbmVyLmZpbmQoJ1tkYXRhLW9yYml0LXNsaWRlPScgKyBsaW5rICsgJ10nKTtcbiAgICAgICAgaWYgKHNsaWRlLmluZGV4KCkgIT0gLTEpIHtzZWxmLl9nb3RvKHNsaWRlLmluZGV4KCkpO31cbiAgICAgIH1cbiAgICB9O1xuXG4gICAgc2VsZi5saW5rX2J1bGxldCA9IGZ1bmN0aW9uIChlKSB7XG4gICAgICB2YXIgaW5kZXggPSAkKHRoaXMpLmF0dHIoJ2RhdGEtb3JiaXQtc2xpZGUnKTtcbiAgICAgIGlmICgodHlwZW9mIGluZGV4ID09PSAnc3RyaW5nJykgJiYgKGluZGV4ID0gJC50cmltKGluZGV4KSkgIT0gJycpIHtcbiAgICAgICAgaWYgKGlzTmFOKHBhcnNlSW50KGluZGV4KSkpIHtcbiAgICAgICAgICB2YXIgc2xpZGUgPSBjb250YWluZXIuZmluZCgnW2RhdGEtb3JiaXQtc2xpZGU9JyArIGluZGV4ICsgJ10nKTtcbiAgICAgICAgICBpZiAoc2xpZGUuaW5kZXgoKSAhPSAtMSkge3NlbGYuX2dvdG8oc2xpZGUuaW5kZXgoKSArIDEpO31cbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBzZWxmLl9nb3RvKHBhcnNlSW50KGluZGV4KSk7XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgIH1cblxuICAgIHNlbGYudGltZXJfY2FsbGJhY2sgPSBmdW5jdGlvbiAoKSB7XG4gICAgICBzZWxmLl9nb3RvKGlkeCArIDEsIHRydWUpO1xuICAgIH1cblxuICAgIHNlbGYuY29tcHV0ZV9kaW1lbnNpb25zID0gZnVuY3Rpb24gKCkge1xuICAgICAgdmFyIGN1cnJlbnQgPSAkKHNlbGYuc2xpZGVzKCkuZ2V0KGlkeCkpO1xuICAgICAgdmFyIGggPSBjdXJyZW50Lm91dGVySGVpZ2h0KCk7XG4gICAgICBpZiAoIXNldHRpbmdzLnZhcmlhYmxlX2hlaWdodCkge1xuICAgICAgICBzZWxmLnNsaWRlcygpLmVhY2goZnVuY3Rpb24oKXtcbiAgICAgICAgICBpZiAoJCh0aGlzKS5vdXRlckhlaWdodCgpID4gaCkgeyBoID0gJCh0aGlzKS5vdXRlckhlaWdodCgpOyB9XG4gICAgICAgIH0pO1xuICAgICAgfVxuICAgICAgc2xpZGVzX2NvbnRhaW5lci5oZWlnaHQoaCk7XG4gICAgfTtcblxuICAgIHNlbGYuY3JlYXRlX3RpbWVyID0gZnVuY3Rpb24gKCkge1xuICAgICAgdmFyIHQgPSBuZXcgVGltZXIoXG4gICAgICAgIGNvbnRhaW5lci5maW5kKCcuJyArIHNldHRpbmdzLnRpbWVyX2NvbnRhaW5lcl9jbGFzcyksXG4gICAgICAgIHNldHRpbmdzLFxuICAgICAgICBzZWxmLnRpbWVyX2NhbGxiYWNrXG4gICAgICApO1xuICAgICAgcmV0dXJuIHQ7XG4gICAgfTtcblxuICAgIHNlbGYuc3RvcF90aW1lciA9IGZ1bmN0aW9uICgpIHtcbiAgICAgIGlmICh0eXBlb2YgdGltZXIgPT09ICdvYmplY3QnKSB7XG4gICAgICAgIHRpbWVyLnN0b3AoKTtcbiAgICAgIH1cbiAgICB9O1xuXG4gICAgc2VsZi50b2dnbGVfdGltZXIgPSBmdW5jdGlvbiAoKSB7XG4gICAgICB2YXIgdCA9IGNvbnRhaW5lci5maW5kKCcuJyArIHNldHRpbmdzLnRpbWVyX2NvbnRhaW5lcl9jbGFzcyk7XG4gICAgICBpZiAodC5oYXNDbGFzcyhzZXR0aW5ncy50aW1lcl9wYXVzZWRfY2xhc3MpKSB7XG4gICAgICAgIGlmICh0eXBlb2YgdGltZXIgPT09ICd1bmRlZmluZWQnKSB7dGltZXIgPSBzZWxmLmNyZWF0ZV90aW1lcigpO31cbiAgICAgICAgdGltZXIuc3RhcnQoKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGlmICh0eXBlb2YgdGltZXIgPT09ICdvYmplY3QnKSB7dGltZXIuc3RvcCgpO31cbiAgICAgIH1cbiAgICB9O1xuXG4gICAgc2VsZi5pbml0ID0gZnVuY3Rpb24gKCkge1xuICAgICAgc2VsZi5idWlsZF9tYXJrdXAoKTtcbiAgICAgIGlmIChzZXR0aW5ncy50aW1lcikge1xuICAgICAgICB0aW1lciA9IHNlbGYuY3JlYXRlX3RpbWVyKCk7XG4gICAgICAgIEZvdW5kYXRpb24udXRpbHMuaW1hZ2VfbG9hZGVkKHRoaXMuc2xpZGVzKCkuY2hpbGRyZW4oJ2ltZycpLCB0aW1lci5zdGFydCk7XG4gICAgICB9XG4gICAgICBhbmltYXRlID0gbmV3IEZhZGVBbmltYXRpb24oc2V0dGluZ3MsIHNsaWRlc19jb250YWluZXIpO1xuICAgICAgaWYgKHNldHRpbmdzLmFuaW1hdGlvbiA9PT0gJ3NsaWRlJykge1xuICAgICAgICBhbmltYXRlID0gbmV3IFNsaWRlQW5pbWF0aW9uKHNldHRpbmdzLCBzbGlkZXNfY29udGFpbmVyKTtcbiAgICAgIH1cblxuICAgICAgY29udGFpbmVyLm9uKCdjbGljaycsICcuJyArIHNldHRpbmdzLm5leHRfY2xhc3MsIHNlbGYubmV4dCk7XG4gICAgICBjb250YWluZXIub24oJ2NsaWNrJywgJy4nICsgc2V0dGluZ3MucHJldl9jbGFzcywgc2VsZi5wcmV2KTtcblxuICAgICAgaWYgKHNldHRpbmdzLm5leHRfb25fY2xpY2spIHtcbiAgICAgICAgY29udGFpbmVyLm9uKCdjbGljaycsICcuJyArIHNldHRpbmdzLnNsaWRlc19jb250YWluZXJfY2xhc3MgKyAnIFtkYXRhLW9yYml0LXNsaWRlXScsIHNlbGYubGlua19idWxsZXQpO1xuICAgICAgfVxuXG4gICAgICBjb250YWluZXIub24oJ2NsaWNrJywgc2VsZi50b2dnbGVfdGltZXIpO1xuICAgICAgaWYgKHNldHRpbmdzLnN3aXBlKSB7XG4gICAgICAgIGNvbnRhaW5lci5vbigndG91Y2hzdGFydC5mbmR0bi5vcmJpdCcsIGZ1bmN0aW9uIChlKSB7XG4gICAgICAgICAgaWYgKCFlLnRvdWNoZXMpIHtlID0gZS5vcmlnaW5hbEV2ZW50O31cbiAgICAgICAgICB2YXIgZGF0YSA9IHtcbiAgICAgICAgICAgIHN0YXJ0X3BhZ2VfeCA6IGUudG91Y2hlc1swXS5wYWdlWCxcbiAgICAgICAgICAgIHN0YXJ0X3BhZ2VfeSA6IGUudG91Y2hlc1swXS5wYWdlWSxcbiAgICAgICAgICAgIHN0YXJ0X3RpbWUgOiAobmV3IERhdGUoKSkuZ2V0VGltZSgpLFxuICAgICAgICAgICAgZGVsdGFfeCA6IDAsXG4gICAgICAgICAgICBpc19zY3JvbGxpbmcgOiB1bmRlZmluZWRcbiAgICAgICAgICB9O1xuICAgICAgICAgIGNvbnRhaW5lci5kYXRhKCdzd2lwZS10cmFuc2l0aW9uJywgZGF0YSk7XG4gICAgICAgICAgZS5zdG9wUHJvcGFnYXRpb24oKTtcbiAgICAgICAgfSlcbiAgICAgICAgLm9uKCd0b3VjaG1vdmUuZm5kdG4ub3JiaXQnLCBmdW5jdGlvbiAoZSkge1xuICAgICAgICAgIGlmICghZS50b3VjaGVzKSB7XG4gICAgICAgICAgICBlID0gZS5vcmlnaW5hbEV2ZW50O1xuICAgICAgICAgIH1cbiAgICAgICAgICAvLyBJZ25vcmUgcGluY2gvem9vbSBldmVudHNcbiAgICAgICAgICBpZiAoZS50b3VjaGVzLmxlbmd0aCA+IDEgfHwgZS5zY2FsZSAmJiBlLnNjYWxlICE9PSAxKSB7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgdmFyIGRhdGEgPSBjb250YWluZXIuZGF0YSgnc3dpcGUtdHJhbnNpdGlvbicpO1xuICAgICAgICAgIGlmICh0eXBlb2YgZGF0YSA9PT0gJ3VuZGVmaW5lZCcpIHtkYXRhID0ge307fVxuXG4gICAgICAgICAgZGF0YS5kZWx0YV94ID0gZS50b3VjaGVzWzBdLnBhZ2VYIC0gZGF0YS5zdGFydF9wYWdlX3g7XG5cbiAgICAgICAgICBpZiAoIHR5cGVvZiBkYXRhLmlzX3Njcm9sbGluZyA9PT0gJ3VuZGVmaW5lZCcpIHtcbiAgICAgICAgICAgIGRhdGEuaXNfc2Nyb2xsaW5nID0gISEoIGRhdGEuaXNfc2Nyb2xsaW5nIHx8IE1hdGguYWJzKGRhdGEuZGVsdGFfeCkgPCBNYXRoLmFicyhlLnRvdWNoZXNbMF0ucGFnZVkgLSBkYXRhLnN0YXJ0X3BhZ2VfeSkgKTtcbiAgICAgICAgICB9XG5cbiAgICAgICAgICBpZiAoIWRhdGEuaXNfc2Nyb2xsaW5nICYmICFkYXRhLmFjdGl2ZSkge1xuICAgICAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgICAgICAgdmFyIGRpcmVjdGlvbiA9IChkYXRhLmRlbHRhX3ggPCAwKSA/IChpZHggKyAxKSA6IChpZHggLSAxKTtcbiAgICAgICAgICAgIGRhdGEuYWN0aXZlID0gdHJ1ZTtcbiAgICAgICAgICAgIHNlbGYuX2dvdG8oZGlyZWN0aW9uKTtcbiAgICAgICAgICB9XG4gICAgICAgIH0pXG4gICAgICAgIC5vbigndG91Y2hlbmQuZm5kdG4ub3JiaXQnLCBmdW5jdGlvbiAoZSkge1xuICAgICAgICAgIGNvbnRhaW5lci5kYXRhKCdzd2lwZS10cmFuc2l0aW9uJywge30pO1xuICAgICAgICAgIGUuc3RvcFByb3BhZ2F0aW9uKCk7XG4gICAgICAgIH0pXG4gICAgICB9XG4gICAgICBjb250YWluZXIub24oJ21vdXNlZW50ZXIuZm5kdG4ub3JiaXQnLCBmdW5jdGlvbiAoZSkge1xuICAgICAgICBpZiAoc2V0dGluZ3MudGltZXIgJiYgc2V0dGluZ3MucGF1c2Vfb25faG92ZXIpIHtcbiAgICAgICAgICBzZWxmLnN0b3BfdGltZXIoKTtcbiAgICAgICAgfVxuICAgICAgfSlcbiAgICAgIC5vbignbW91c2VsZWF2ZS5mbmR0bi5vcmJpdCcsIGZ1bmN0aW9uIChlKSB7XG4gICAgICAgIGlmIChzZXR0aW5ncy50aW1lciAmJiBzZXR0aW5ncy5yZXN1bWVfb25fbW91c2VvdXQpIHtcbiAgICAgICAgICB0aW1lci5zdGFydCgpO1xuICAgICAgICB9XG4gICAgICB9KTtcblxuICAgICAgJChkb2N1bWVudCkub24oJ2NsaWNrJywgJ1tkYXRhLW9yYml0LWxpbmtdJywgc2VsZi5saW5rX2N1c3RvbSk7XG4gICAgICAkKHdpbmRvdykub24oJ2xvYWQgcmVzaXplJywgc2VsZi5jb21wdXRlX2RpbWVuc2lvbnMpO1xuICAgICAgRm91bmRhdGlvbi51dGlscy5pbWFnZV9sb2FkZWQodGhpcy5zbGlkZXMoKS5jaGlsZHJlbignaW1nJyksIHNlbGYuY29tcHV0ZV9kaW1lbnNpb25zKTtcbiAgICAgIEZvdW5kYXRpb24udXRpbHMuaW1hZ2VfbG9hZGVkKHRoaXMuc2xpZGVzKCkuY2hpbGRyZW4oJ2ltZycpLCBmdW5jdGlvbiAoKSB7XG4gICAgICAgIGNvbnRhaW5lci5wcmV2KCcuJyArIHNldHRpbmdzLnByZWxvYWRlcl9jbGFzcykuY3NzKCdkaXNwbGF5JywgJ25vbmUnKTtcbiAgICAgICAgc2VsZi51cGRhdGVfc2xpZGVfbnVtYmVyKDApO1xuICAgICAgICBzZWxmLnVwZGF0ZV9hY3RpdmVfbGluaygwKTtcbiAgICAgICAgc2xpZGVzX2NvbnRhaW5lci50cmlnZ2VyKCdyZWFkeS5mbmR0bi5vcmJpdCcpO1xuICAgICAgfSk7XG4gICAgfTtcblxuICAgIHNlbGYuaW5pdCgpO1xuICB9O1xuXG4gIHZhciBUaW1lciA9IGZ1bmN0aW9uIChlbCwgc2V0dGluZ3MsIGNhbGxiYWNrKSB7XG4gICAgdmFyIHNlbGYgPSB0aGlzLFxuICAgICAgICBkdXJhdGlvbiA9IHNldHRpbmdzLnRpbWVyX3NwZWVkLFxuICAgICAgICBwcm9ncmVzcyA9IGVsLmZpbmQoJy4nICsgc2V0dGluZ3MudGltZXJfcHJvZ3Jlc3NfY2xhc3MpLFxuICAgICAgICBzdGFydCxcbiAgICAgICAgdGltZW91dCxcbiAgICAgICAgbGVmdCA9IC0xO1xuXG4gICAgdGhpcy51cGRhdGVfcHJvZ3Jlc3MgPSBmdW5jdGlvbiAodykge1xuICAgICAgdmFyIG5ld19wcm9ncmVzcyA9IHByb2dyZXNzLmNsb25lKCk7XG4gICAgICBuZXdfcHJvZ3Jlc3MuYXR0cignc3R5bGUnLCAnJyk7XG4gICAgICBuZXdfcHJvZ3Jlc3MuY3NzKCd3aWR0aCcsIHcgKyAnJScpO1xuICAgICAgcHJvZ3Jlc3MucmVwbGFjZVdpdGgobmV3X3Byb2dyZXNzKTtcbiAgICAgIHByb2dyZXNzID0gbmV3X3Byb2dyZXNzO1xuICAgIH07XG5cbiAgICB0aGlzLnJlc3RhcnQgPSBmdW5jdGlvbiAoKSB7XG4gICAgICBjbGVhclRpbWVvdXQodGltZW91dCk7XG4gICAgICBlbC5hZGRDbGFzcyhzZXR0aW5ncy50aW1lcl9wYXVzZWRfY2xhc3MpO1xuICAgICAgbGVmdCA9IC0xO1xuICAgICAgc2VsZi51cGRhdGVfcHJvZ3Jlc3MoMCk7XG4gICAgfTtcblxuICAgIHRoaXMuc3RhcnQgPSBmdW5jdGlvbiAoKSB7XG4gICAgICBpZiAoIWVsLmhhc0NsYXNzKHNldHRpbmdzLnRpbWVyX3BhdXNlZF9jbGFzcykpIHtyZXR1cm4gdHJ1ZTt9XG4gICAgICBsZWZ0ID0gKGxlZnQgPT09IC0xKSA/IGR1cmF0aW9uIDogbGVmdDtcbiAgICAgIGVsLnJlbW92ZUNsYXNzKHNldHRpbmdzLnRpbWVyX3BhdXNlZF9jbGFzcyk7XG4gICAgICBzdGFydCA9IG5ldyBEYXRlKCkuZ2V0VGltZSgpO1xuICAgICAgcHJvZ3Jlc3MuYW5pbWF0ZSh7J3dpZHRoJyA6ICcxMDAlJ30sIGxlZnQsICdsaW5lYXInKTtcbiAgICAgIHRpbWVvdXQgPSBzZXRUaW1lb3V0KGZ1bmN0aW9uICgpIHtcbiAgICAgICAgc2VsZi5yZXN0YXJ0KCk7XG4gICAgICAgIGNhbGxiYWNrKCk7XG4gICAgICB9LCBsZWZ0KTtcbiAgICAgIGVsLnRyaWdnZXIoJ3RpbWVyLXN0YXJ0ZWQuZm5kdG4ub3JiaXQnKVxuICAgIH07XG5cbiAgICB0aGlzLnN0b3AgPSBmdW5jdGlvbiAoKSB7XG4gICAgICBpZiAoZWwuaGFzQ2xhc3Moc2V0dGluZ3MudGltZXJfcGF1c2VkX2NsYXNzKSkge3JldHVybiB0cnVlO31cbiAgICAgIGNsZWFyVGltZW91dCh0aW1lb3V0KTtcbiAgICAgIGVsLmFkZENsYXNzKHNldHRpbmdzLnRpbWVyX3BhdXNlZF9jbGFzcyk7XG4gICAgICB2YXIgZW5kID0gbmV3IERhdGUoKS5nZXRUaW1lKCk7XG4gICAgICBsZWZ0ID0gbGVmdCAtIChlbmQgLSBzdGFydCk7XG4gICAgICB2YXIgdyA9IDEwMCAtICgobGVmdCAvIGR1cmF0aW9uKSAqIDEwMCk7XG4gICAgICBzZWxmLnVwZGF0ZV9wcm9ncmVzcyh3KTtcbiAgICAgIGVsLnRyaWdnZXIoJ3RpbWVyLXN0b3BwZWQuZm5kdG4ub3JiaXQnKTtcbiAgICB9O1xuICB9O1xuXG4gIHZhciBTbGlkZUFuaW1hdGlvbiA9IGZ1bmN0aW9uIChzZXR0aW5ncywgY29udGFpbmVyKSB7XG4gICAgdmFyIGR1cmF0aW9uID0gc2V0dGluZ3MuYW5pbWF0aW9uX3NwZWVkO1xuICAgIHZhciBpc19ydGwgPSAoJCgnaHRtbFtkaXI9cnRsXScpLmxlbmd0aCA9PT0gMSk7XG4gICAgdmFyIG1hcmdpbiA9IGlzX3J0bCA/ICdtYXJnaW5SaWdodCcgOiAnbWFyZ2luTGVmdCc7XG4gICAgdmFyIGFuaW1NYXJnaW4gPSB7fTtcbiAgICBhbmltTWFyZ2luW21hcmdpbl0gPSAnMCUnO1xuXG4gICAgdGhpcy5uZXh0ID0gZnVuY3Rpb24gKGN1cnJlbnQsIG5leHQsIGNhbGxiYWNrKSB7XG4gICAgICBjdXJyZW50LmFuaW1hdGUoe21hcmdpbkxlZnQgOiAnLTEwMCUnfSwgZHVyYXRpb24pO1xuICAgICAgbmV4dC5hbmltYXRlKGFuaW1NYXJnaW4sIGR1cmF0aW9uLCBmdW5jdGlvbiAoKSB7XG4gICAgICAgIGN1cnJlbnQuY3NzKG1hcmdpbiwgJzEwMCUnKTtcbiAgICAgICAgY2FsbGJhY2soKTtcbiAgICAgIH0pO1xuICAgIH07XG5cbiAgICB0aGlzLnByZXYgPSBmdW5jdGlvbiAoY3VycmVudCwgcHJldiwgY2FsbGJhY2spIHtcbiAgICAgIGN1cnJlbnQuYW5pbWF0ZSh7bWFyZ2luTGVmdCA6ICcxMDAlJ30sIGR1cmF0aW9uKTtcbiAgICAgIHByZXYuY3NzKG1hcmdpbiwgJy0xMDAlJyk7XG4gICAgICBwcmV2LmFuaW1hdGUoYW5pbU1hcmdpbiwgZHVyYXRpb24sIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgY3VycmVudC5jc3MobWFyZ2luLCAnMTAwJScpO1xuICAgICAgICBjYWxsYmFjaygpO1xuICAgICAgfSk7XG4gICAgfTtcbiAgfTtcblxuICB2YXIgRmFkZUFuaW1hdGlvbiA9IGZ1bmN0aW9uIChzZXR0aW5ncywgY29udGFpbmVyKSB7XG4gICAgdmFyIGR1cmF0aW9uID0gc2V0dGluZ3MuYW5pbWF0aW9uX3NwZWVkO1xuICAgIHZhciBpc19ydGwgPSAoJCgnaHRtbFtkaXI9cnRsXScpLmxlbmd0aCA9PT0gMSk7XG4gICAgdmFyIG1hcmdpbiA9IGlzX3J0bCA/ICdtYXJnaW5SaWdodCcgOiAnbWFyZ2luTGVmdCc7XG5cbiAgICB0aGlzLm5leHQgPSBmdW5jdGlvbiAoY3VycmVudCwgbmV4dCwgY2FsbGJhY2spIHtcbiAgICAgIG5leHQuY3NzKHsnbWFyZ2luJyA6ICcwJScsICdvcGFjaXR5JyA6ICcwLjAxJ30pO1xuICAgICAgbmV4dC5hbmltYXRlKHsnb3BhY2l0eScgOicxJ30sIGR1cmF0aW9uLCAnbGluZWFyJywgZnVuY3Rpb24gKCkge1xuICAgICAgICBjdXJyZW50LmNzcygnbWFyZ2luJywgJzEwMCUnKTtcbiAgICAgICAgY2FsbGJhY2soKTtcbiAgICAgIH0pO1xuICAgIH07XG5cbiAgICB0aGlzLnByZXYgPSBmdW5jdGlvbiAoY3VycmVudCwgcHJldiwgY2FsbGJhY2spIHtcbiAgICAgIHByZXYuY3NzKHsnbWFyZ2luJyA6ICcwJScsICdvcGFjaXR5JyA6ICcwLjAxJ30pO1xuICAgICAgcHJldi5hbmltYXRlKHsnb3BhY2l0eScgOiAnMSd9LCBkdXJhdGlvbiwgJ2xpbmVhcicsIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgY3VycmVudC5jc3MoJ21hcmdpbicsICcxMDAlJyk7XG4gICAgICAgIGNhbGxiYWNrKCk7XG4gICAgICB9KTtcbiAgICB9O1xuICB9O1xuXG4gIEZvdW5kYXRpb24ubGlicyA9IEZvdW5kYXRpb24ubGlicyB8fCB7fTtcblxuICBGb3VuZGF0aW9uLmxpYnMub3JiaXQgPSB7XG4gICAgbmFtZSA6ICdvcmJpdCcsXG5cbiAgICB2ZXJzaW9uIDogJzUuNS4yJyxcblxuICAgIHNldHRpbmdzIDoge1xuICAgICAgYW5pbWF0aW9uIDogJ3NsaWRlJyxcbiAgICAgIHRpbWVyX3NwZWVkIDogMTAwMDAsXG4gICAgICBwYXVzZV9vbl9ob3ZlciA6IHRydWUsXG4gICAgICByZXN1bWVfb25fbW91c2VvdXQgOiBmYWxzZSxcbiAgICAgIG5leHRfb25fY2xpY2sgOiB0cnVlLFxuICAgICAgYW5pbWF0aW9uX3NwZWVkIDogNTAwLFxuICAgICAgc3RhY2tfb25fc21hbGwgOiBmYWxzZSxcbiAgICAgIG5hdmlnYXRpb25fYXJyb3dzIDogdHJ1ZSxcbiAgICAgIHNsaWRlX251bWJlciA6IHRydWUsXG4gICAgICBzbGlkZV9udW1iZXJfdGV4dCA6ICdvZicsXG4gICAgICBjb250YWluZXJfY2xhc3MgOiAnb3JiaXQtY29udGFpbmVyJyxcbiAgICAgIHN0YWNrX29uX3NtYWxsX2NsYXNzIDogJ29yYml0LXN0YWNrLW9uLXNtYWxsJyxcbiAgICAgIG5leHRfY2xhc3MgOiAnb3JiaXQtbmV4dCcsXG4gICAgICBwcmV2X2NsYXNzIDogJ29yYml0LXByZXYnLFxuICAgICAgdGltZXJfY29udGFpbmVyX2NsYXNzIDogJ29yYml0LXRpbWVyJyxcbiAgICAgIHRpbWVyX3BhdXNlZF9jbGFzcyA6ICdwYXVzZWQnLFxuICAgICAgdGltZXJfcHJvZ3Jlc3NfY2xhc3MgOiAnb3JiaXQtcHJvZ3Jlc3MnLFxuICAgICAgc2xpZGVzX2NvbnRhaW5lcl9jbGFzcyA6ICdvcmJpdC1zbGlkZXMtY29udGFpbmVyJyxcbiAgICAgIHByZWxvYWRlcl9jbGFzcyA6ICdwcmVsb2FkZXInLFxuICAgICAgc2xpZGVfc2VsZWN0b3IgOiAnKicsXG4gICAgICBidWxsZXRzX2NvbnRhaW5lcl9jbGFzcyA6ICdvcmJpdC1idWxsZXRzJyxcbiAgICAgIGJ1bGxldHNfYWN0aXZlX2NsYXNzIDogJ2FjdGl2ZScsXG4gICAgICBzbGlkZV9udW1iZXJfY2xhc3MgOiAnb3JiaXQtc2xpZGUtbnVtYmVyJyxcbiAgICAgIGNhcHRpb25fY2xhc3MgOiAnb3JiaXQtY2FwdGlvbicsXG4gICAgICBhY3RpdmVfc2xpZGVfY2xhc3MgOiAnYWN0aXZlJyxcbiAgICAgIG9yYml0X3RyYW5zaXRpb25fY2xhc3MgOiAnb3JiaXQtdHJhbnNpdGlvbmluZycsXG4gICAgICBidWxsZXRzIDogdHJ1ZSxcbiAgICAgIGNpcmN1bGFyIDogdHJ1ZSxcbiAgICAgIHRpbWVyIDogdHJ1ZSxcbiAgICAgIHZhcmlhYmxlX2hlaWdodCA6IGZhbHNlLFxuICAgICAgc3dpcGUgOiB0cnVlLFxuICAgICAgYmVmb3JlX3NsaWRlX2NoYW5nZSA6IG5vb3AsXG4gICAgICBhZnRlcl9zbGlkZV9jaGFuZ2UgOiBub29wXG4gICAgfSxcblxuICAgIGluaXQgOiBmdW5jdGlvbiAoc2NvcGUsIG1ldGhvZCwgb3B0aW9ucykge1xuICAgICAgdmFyIHNlbGYgPSB0aGlzO1xuICAgICAgdGhpcy5iaW5kaW5ncyhtZXRob2QsIG9wdGlvbnMpO1xuICAgIH0sXG5cbiAgICBldmVudHMgOiBmdW5jdGlvbiAoaW5zdGFuY2UpIHtcbiAgICAgIHZhciBvcmJpdF9pbnN0YW5jZSA9IG5ldyBPcmJpdCh0aGlzLlMoaW5zdGFuY2UpLCB0aGlzLlMoaW5zdGFuY2UpLmRhdGEoJ29yYml0LWluaXQnKSk7XG4gICAgICB0aGlzLlMoaW5zdGFuY2UpLmRhdGEodGhpcy5uYW1lICsgJy1pbnN0YW5jZScsIG9yYml0X2luc3RhbmNlKTtcbiAgICB9LFxuXG4gICAgcmVmbG93IDogZnVuY3Rpb24gKCkge1xuICAgICAgdmFyIHNlbGYgPSB0aGlzO1xuXG4gICAgICBpZiAoc2VsZi5TKHNlbGYuc2NvcGUpLmlzKCdbZGF0YS1vcmJpdF0nKSkge1xuICAgICAgICB2YXIgJGVsID0gc2VsZi5TKHNlbGYuc2NvcGUpO1xuICAgICAgICB2YXIgaW5zdGFuY2UgPSAkZWwuZGF0YShzZWxmLm5hbWUgKyAnLWluc3RhbmNlJyk7XG4gICAgICAgIGluc3RhbmNlLmNvbXB1dGVfZGltZW5zaW9ucygpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgc2VsZi5TKCdbZGF0YS1vcmJpdF0nLCBzZWxmLnNjb3BlKS5lYWNoKGZ1bmN0aW9uIChpZHgsIGVsKSB7XG4gICAgICAgICAgdmFyICRlbCA9IHNlbGYuUyhlbCk7XG4gICAgICAgICAgdmFyIG9wdHMgPSBzZWxmLmRhdGFfb3B0aW9ucygkZWwpO1xuICAgICAgICAgIHZhciBpbnN0YW5jZSA9ICRlbC5kYXRhKHNlbGYubmFtZSArICctaW5zdGFuY2UnKTtcbiAgICAgICAgICBpbnN0YW5jZS5jb21wdXRlX2RpbWVuc2lvbnMoKTtcbiAgICAgICAgfSk7XG4gICAgICB9XG4gICAgfVxuICB9O1xuXG59KGpRdWVyeSwgd2luZG93LCB3aW5kb3cuZG9jdW1lbnQpKTtcbiJdLCJmaWxlIjoiZm91bmRhdGlvbi9qcy9mb3VuZGF0aW9uL2ZvdW5kYXRpb24ub3JiaXQuanMiLCJzb3VyY2VSb290IjoiL3NvdXJjZS8ifQ==