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

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiIiwic291cmNlcyI6WyJmb3VuZGF0aW9uL2pzL2ZvdW5kYXRpb24vZm91bmRhdGlvbi5qb3lyaWRlLmpzIl0sInNvdXJjZXNDb250ZW50IjpbIjsoZnVuY3Rpb24gKCQsIHdpbmRvdywgZG9jdW1lbnQsIHVuZGVmaW5lZCkge1xuICAndXNlIHN0cmljdCc7XG5cbiAgdmFyIE1vZGVybml6ciA9IE1vZGVybml6ciB8fCBmYWxzZTtcblxuICBGb3VuZGF0aW9uLmxpYnMuam95cmlkZSA9IHtcbiAgICBuYW1lIDogJ2pveXJpZGUnLFxuXG4gICAgdmVyc2lvbiA6ICc1LjUuMicsXG5cbiAgICBkZWZhdWx0cyA6IHtcbiAgICAgIGV4cG9zZSAgICAgICAgICAgICAgICAgICA6IGZhbHNlLCAgICAgLy8gdHVybiBvbiBvciBvZmYgdGhlIGV4cG9zZSBmZWF0dXJlXG4gICAgICBtb2RhbCAgICAgICAgICAgICAgICAgICAgOiB0cnVlLCAgICAgIC8vIFdoZXRoZXIgdG8gY292ZXIgcGFnZSB3aXRoIG1vZGFsIGR1cmluZyB0aGUgdG91clxuICAgICAga2V5Ym9hcmQgICAgICAgICAgICAgICAgIDogdHJ1ZSwgICAgICAvLyBlbmFibGUgbGVmdCwgcmlnaHQgYW5kIGVzYyBrZXlzdHJva2VzXG4gICAgICB0aXBfbG9jYXRpb24gICAgICAgICAgICAgOiAnYm90dG9tJywgIC8vICd0b3AnIG9yICdib3R0b20nIGluIHJlbGF0aW9uIHRvIHBhcmVudFxuICAgICAgbnViX3Bvc2l0aW9uICAgICAgICAgICAgIDogJ2F1dG8nLCAgICAvLyBvdmVycmlkZSBvbiBhIHBlciB0b29sdGlwIGJhc2VzXG4gICAgICBzY3JvbGxfc3BlZWQgICAgICAgICAgICAgOiAxNTAwLCAgICAgIC8vIFBhZ2Ugc2Nyb2xsaW5nIHNwZWVkIGluIG1pbGxpc2Vjb25kcywgMCA9IG5vIHNjcm9sbCBhbmltYXRpb25cbiAgICAgIHNjcm9sbF9hbmltYXRpb24gICAgICAgICA6ICdsaW5lYXInLCAgLy8gc3VwcG9ydHMgJ3N3aW5nJyBhbmQgJ2xpbmVhcicsIGV4dGVuZCB3aXRoIGpRdWVyeSBVSS5cbiAgICAgIHRpbWVyICAgICAgICAgICAgICAgICAgICA6IDAsICAgICAgICAgLy8gMCA9IG5vIHRpbWVyICwgYWxsIG90aGVyIG51bWJlcnMgPSB0aW1lciBpbiBtaWxsaXNlY29uZHNcbiAgICAgIHN0YXJ0X3RpbWVyX29uX2NsaWNrICAgICA6IHRydWUsICAgICAgLy8gdHJ1ZSBvciBmYWxzZSAtIHRydWUgcmVxdWlyZXMgY2xpY2tpbmcgdGhlIGZpcnN0IGJ1dHRvbiBzdGFydCB0aGUgdGltZXJcbiAgICAgIHN0YXJ0X29mZnNldCAgICAgICAgICAgICA6IDAsICAgICAgICAgLy8gdGhlIGluZGV4IG9mIHRoZSB0b29sdGlwIHlvdSB3YW50IHRvIHN0YXJ0IG9uIChpbmRleCBvZiB0aGUgbGkpXG4gICAgICBuZXh0X2J1dHRvbiAgICAgICAgICAgICAgOiB0cnVlLCAgICAgIC8vIHRydWUgb3IgZmFsc2UgdG8gY29udHJvbCB3aGV0aGVyIGEgbmV4dCBidXR0b24gaXMgdXNlZFxuICAgICAgcHJldl9idXR0b24gICAgICAgICAgICAgIDogdHJ1ZSwgICAgICAvLyB0cnVlIG9yIGZhbHNlIHRvIGNvbnRyb2wgd2hldGhlciBhIHByZXYgYnV0dG9uIGlzIHVzZWRcbiAgICAgIHRpcF9hbmltYXRpb24gICAgICAgICAgICA6ICdmYWRlJywgICAgLy8gJ3BvcCcgb3IgJ2ZhZGUnIGluIGVhY2ggdGlwXG4gICAgICBwYXVzZV9hZnRlciAgICAgICAgICAgICAgOiBbXSwgICAgICAgIC8vIGFycmF5IG9mIGluZGV4ZXMgd2hlcmUgdG8gcGF1c2UgdGhlIHRvdXIgYWZ0ZXJcbiAgICAgIGV4cG9zZWQgICAgICAgICAgICAgICAgICA6IFtdLCAgICAgICAgLy8gYXJyYXkgb2YgZXhwb3NlIGVsZW1lbnRzXG4gICAgICB0aXBfYW5pbWF0aW9uX2ZhZGVfc3BlZWQgOiAzMDAsICAgICAgIC8vIHdoZW4gdGlwQW5pbWF0aW9uID0gJ2ZhZGUnIHRoaXMgaXMgc3BlZWQgaW4gbWlsbGlzZWNvbmRzIGZvciB0aGUgdHJhbnNpdGlvblxuICAgICAgY29va2llX21vbnN0ZXIgICAgICAgICAgIDogZmFsc2UsICAgICAvLyB0cnVlIG9yIGZhbHNlIHRvIGNvbnRyb2wgd2hldGhlciBjb29raWVzIGFyZSB1c2VkXG4gICAgICBjb29raWVfbmFtZSAgICAgICAgICAgICAgOiAnam95cmlkZScsIC8vIE5hbWUgdGhlIGNvb2tpZSB5b3UnbGwgdXNlXG4gICAgICBjb29raWVfZG9tYWluICAgICAgICAgICAgOiBmYWxzZSwgICAgIC8vIFdpbGwgdGhpcyBjb29raWUgYmUgYXR0YWNoZWQgdG8gYSBkb21haW4sIGllLiAnLm5vdGFibGVhcHAuY29tJ1xuICAgICAgY29va2llX2V4cGlyZXMgICAgICAgICAgIDogMzY1LCAgICAgICAvLyBzZXQgd2hlbiB5b3Ugd291bGQgbGlrZSB0aGUgY29va2llIHRvIGV4cGlyZS5cbiAgICAgIHRpcF9jb250YWluZXIgICAgICAgICAgICA6ICdib2R5JywgICAgLy8gV2hlcmUgd2lsbCB0aGUgdGlwIGJlIGF0dGFjaGVkXG4gICAgICBhYm9ydF9vbl9jbG9zZSAgICAgICAgICAgOiB0cnVlLCAgICAgIC8vIFdoZW4gdHJ1ZSwgdGhlIGNsb3NlIGV2ZW50IHdpbGwgbm90IGZpcmUgYW55IGNhbGxiYWNrXG4gICAgICB0aXBfbG9jYXRpb25fcGF0dGVybnMgICAgOiB7XG4gICAgICAgIHRvcCA6IFsnYm90dG9tJ10sXG4gICAgICAgIGJvdHRvbSA6IFtdLCAvLyBib3R0b20gc2hvdWxkIG5vdCBuZWVkIHRvIGJlIHJlcG9zaXRpb25lZFxuICAgICAgICBsZWZ0IDogWydyaWdodCcsICd0b3AnLCAnYm90dG9tJ10sXG4gICAgICAgIHJpZ2h0IDogWydsZWZ0JywgJ3RvcCcsICdib3R0b20nXVxuICAgICAgfSxcbiAgICAgIHBvc3RfcmlkZV9jYWxsYmFjayAgICAgOiBmdW5jdGlvbiAoKSB7fSwgICAgLy8gQSBtZXRob2QgdG8gY2FsbCBvbmNlIHRoZSB0b3VyIGNsb3NlcyAoY2FuY2VsZWQgb3IgY29tcGxldGUpXG4gICAgICBwb3N0X3N0ZXBfY2FsbGJhY2sgICAgIDogZnVuY3Rpb24gKCkge30sICAgIC8vIEEgbWV0aG9kIHRvIGNhbGwgYWZ0ZXIgZWFjaCBzdGVwXG4gICAgICBwcmVfc3RlcF9jYWxsYmFjayAgICAgIDogZnVuY3Rpb24gKCkge30sICAgIC8vIEEgbWV0aG9kIHRvIGNhbGwgYmVmb3JlIGVhY2ggc3RlcFxuICAgICAgcHJlX3JpZGVfY2FsbGJhY2sgICAgICA6IGZ1bmN0aW9uICgpIHt9LCAgICAvLyBBIG1ldGhvZCB0byBjYWxsIGJlZm9yZSB0aGUgdG91ciBzdGFydHMgKHBhc3NlZCBpbmRleCwgdGlwLCBhbmQgY2xvbmVkIGV4cG9zZWQgZWxlbWVudClcbiAgICAgIHBvc3RfZXhwb3NlX2NhbGxiYWNrICAgOiBmdW5jdGlvbiAoKSB7fSwgICAgLy8gQSBtZXRob2QgdG8gY2FsbCBhZnRlciBhbiBlbGVtZW50IGhhcyBiZWVuIGV4cG9zZWRcbiAgICAgIHRlbXBsYXRlIDogeyAvLyBIVE1MIHNlZ21lbnRzIGZvciB0aXAgbGF5b3V0XG4gICAgICAgIGxpbmsgICAgICAgICAgOiAnPGEgaHJlZj1cIiNjbG9zZVwiIGNsYXNzPVwiam95cmlkZS1jbG9zZS10aXBcIj4mdGltZXM7PC9hPicsXG4gICAgICAgIHRpbWVyICAgICAgICAgOiAnPGRpdiBjbGFzcz1cImpveXJpZGUtdGltZXItaW5kaWNhdG9yLXdyYXBcIj48c3BhbiBjbGFzcz1cImpveXJpZGUtdGltZXItaW5kaWNhdG9yXCI+PC9zcGFuPjwvZGl2PicsXG4gICAgICAgIHRpcCAgICAgICAgICAgOiAnPGRpdiBjbGFzcz1cImpveXJpZGUtdGlwLWd1aWRlXCI+PHNwYW4gY2xhc3M9XCJqb3lyaWRlLW51YlwiPjwvc3Bhbj48L2Rpdj4nLFxuICAgICAgICB3cmFwcGVyICAgICAgIDogJzxkaXYgY2xhc3M9XCJqb3lyaWRlLWNvbnRlbnQtd3JhcHBlclwiPjwvZGl2PicsXG4gICAgICAgIGJ1dHRvbiAgICAgICAgOiAnPGEgaHJlZj1cIiNcIiBjbGFzcz1cInNtYWxsIGJ1dHRvbiBqb3lyaWRlLW5leHQtdGlwXCI+PC9hPicsXG4gICAgICAgIHByZXZfYnV0dG9uICAgOiAnPGEgaHJlZj1cIiNcIiBjbGFzcz1cInNtYWxsIGJ1dHRvbiBqb3lyaWRlLXByZXYtdGlwXCI+PC9hPicsXG4gICAgICAgIG1vZGFsICAgICAgICAgOiAnPGRpdiBjbGFzcz1cImpveXJpZGUtbW9kYWwtYmdcIj48L2Rpdj4nLFxuICAgICAgICBleHBvc2UgICAgICAgIDogJzxkaXYgY2xhc3M9XCJqb3lyaWRlLWV4cG9zZS13cmFwcGVyXCI+PC9kaXY+JyxcbiAgICAgICAgZXhwb3NlX2NvdmVyICA6ICc8ZGl2IGNsYXNzPVwiam95cmlkZS1leHBvc2UtY292ZXJcIj48L2Rpdj4nXG4gICAgICB9LFxuICAgICAgZXhwb3NlX2FkZF9jbGFzcyA6ICcnIC8vIE9uZSBvciBtb3JlIHNwYWNlLXNlcGFyYXRlZCBjbGFzcyBuYW1lcyB0byBiZSBhZGRlZCB0byBleHBvc2VkIGVsZW1lbnRcbiAgICB9LFxuXG4gICAgaW5pdCA6IGZ1bmN0aW9uIChzY29wZSwgbWV0aG9kLCBvcHRpb25zKSB7XG4gICAgICBGb3VuZGF0aW9uLmluaGVyaXQodGhpcywgJ3Rocm90dGxlIHJhbmRvbV9zdHInKTtcblxuICAgICAgdGhpcy5zZXR0aW5ncyA9IHRoaXMuc2V0dGluZ3MgfHwgJC5leHRlbmQoe30sIHRoaXMuZGVmYXVsdHMsIChvcHRpb25zIHx8IG1ldGhvZCkpO1xuXG4gICAgICB0aGlzLmJpbmRpbmdzKG1ldGhvZCwgb3B0aW9ucylcbiAgICB9LFxuXG4gICAgZ29fbmV4dCA6IGZ1bmN0aW9uICgpIHtcbiAgICAgIGlmICh0aGlzLnNldHRpbmdzLiRsaS5uZXh0KCkubGVuZ3RoIDwgMSkge1xuICAgICAgICB0aGlzLmVuZCgpO1xuICAgICAgfSBlbHNlIGlmICh0aGlzLnNldHRpbmdzLnRpbWVyID4gMCkge1xuICAgICAgICBjbGVhclRpbWVvdXQodGhpcy5zZXR0aW5ncy5hdXRvbWF0ZSk7XG4gICAgICAgIHRoaXMuaGlkZSgpO1xuICAgICAgICB0aGlzLnNob3coKTtcbiAgICAgICAgdGhpcy5zdGFydFRpbWVyKCk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB0aGlzLmhpZGUoKTtcbiAgICAgICAgdGhpcy5zaG93KCk7XG4gICAgICB9XG4gICAgfSxcblxuICAgIGdvX3ByZXYgOiBmdW5jdGlvbiAoKSB7XG4gICAgICBpZiAodGhpcy5zZXR0aW5ncy4kbGkucHJldigpLmxlbmd0aCA8IDEpIHtcbiAgICAgICAgLy8gRG8gbm90aGluZyBpZiB0aGVyZSBhcmUgbm8gcHJldiBlbGVtZW50XG4gICAgICB9IGVsc2UgaWYgKHRoaXMuc2V0dGluZ3MudGltZXIgPiAwKSB7XG4gICAgICAgIGNsZWFyVGltZW91dCh0aGlzLnNldHRpbmdzLmF1dG9tYXRlKTtcbiAgICAgICAgdGhpcy5oaWRlKCk7XG4gICAgICAgIHRoaXMuc2hvdyhudWxsLCB0cnVlKTtcbiAgICAgICAgdGhpcy5zdGFydFRpbWVyKCk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB0aGlzLmhpZGUoKTtcbiAgICAgICAgdGhpcy5zaG93KG51bGwsIHRydWUpO1xuICAgICAgfVxuICAgIH0sXG5cbiAgICBldmVudHMgOiBmdW5jdGlvbiAoKSB7XG4gICAgICB2YXIgc2VsZiA9IHRoaXM7XG5cbiAgICAgICQodGhpcy5zY29wZSlcbiAgICAgICAgLm9mZignLmpveXJpZGUnKVxuICAgICAgICAub24oJ2NsaWNrLmZuZHRuLmpveXJpZGUnLCAnLmpveXJpZGUtbmV4dC10aXAsIC5qb3lyaWRlLW1vZGFsLWJnJywgZnVuY3Rpb24gKGUpIHtcbiAgICAgICAgICBlLnByZXZlbnREZWZhdWx0KCk7XG4gICAgICAgICAgdGhpcy5nb19uZXh0KClcbiAgICAgICAgfS5iaW5kKHRoaXMpKVxuICAgICAgICAub24oJ2NsaWNrLmZuZHRuLmpveXJpZGUnLCAnLmpveXJpZGUtcHJldi10aXAnLCBmdW5jdGlvbiAoZSkge1xuICAgICAgICAgIGUucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgICB0aGlzLmdvX3ByZXYoKTtcbiAgICAgICAgfS5iaW5kKHRoaXMpKVxuXG4gICAgICAgIC5vbignY2xpY2suZm5kdG4uam95cmlkZScsICcuam95cmlkZS1jbG9zZS10aXAnLCBmdW5jdGlvbiAoZSkge1xuICAgICAgICAgIGUucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgICB0aGlzLmVuZCh0aGlzLnNldHRpbmdzLmFib3J0X29uX2Nsb3NlKTtcbiAgICAgICAgfS5iaW5kKHRoaXMpKVxuXG4gICAgICAgIC5vbigna2V5dXAuZm5kdG4uam95cmlkZScsIGZ1bmN0aW9uIChlKSB7XG4gICAgICAgICAgLy8gRG9uJ3QgZG8gYW55dGhpbmcgaWYga2V5c3Ryb2tlcyBhcmUgZGlzYWJsZWRcbiAgICAgICAgICAvLyBvciBpZiB0aGUgam95cmlkZSBpcyBub3QgYmVpbmcgc2hvd25cbiAgICAgICAgICBpZiAoIXRoaXMuc2V0dGluZ3Mua2V5Ym9hcmQgfHwgIXRoaXMuc2V0dGluZ3MucmlkaW5nKSB7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgc3dpdGNoIChlLndoaWNoKSB7XG4gICAgICAgICAgICBjYXNlIDM5OiAvLyByaWdodCBhcnJvd1xuICAgICAgICAgICAgICBlLnByZXZlbnREZWZhdWx0KCk7XG4gICAgICAgICAgICAgIHRoaXMuZ29fbmV4dCgpO1xuICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIGNhc2UgMzc6IC8vIGxlZnQgYXJyb3dcbiAgICAgICAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgICAgICAgICB0aGlzLmdvX3ByZXYoKTtcbiAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICBjYXNlIDI3OiAvLyBlc2NhcGVcbiAgICAgICAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgICAgICAgICB0aGlzLmVuZCh0aGlzLnNldHRpbmdzLmFib3J0X29uX2Nsb3NlKTtcbiAgICAgICAgICB9XG4gICAgICAgIH0uYmluZCh0aGlzKSk7XG5cbiAgICAgICQod2luZG93KVxuICAgICAgICAub2ZmKCcuam95cmlkZScpXG4gICAgICAgIC5vbigncmVzaXplLmZuZHRuLmpveXJpZGUnLCBzZWxmLnRocm90dGxlKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICBpZiAoJCgnWycgKyBzZWxmLmF0dHJfbmFtZSgpICsgJ10nKS5sZW5ndGggPiAwICYmIHNlbGYuc2V0dGluZ3MuJG5leHRfdGlwICYmIHNlbGYuc2V0dGluZ3MucmlkaW5nKSB7XG4gICAgICAgICAgICBpZiAoc2VsZi5zZXR0aW5ncy5leHBvc2VkLmxlbmd0aCA+IDApIHtcbiAgICAgICAgICAgICAgdmFyICRlbHMgPSAkKHNlbGYuc2V0dGluZ3MuZXhwb3NlZCk7XG5cbiAgICAgICAgICAgICAgJGVscy5lYWNoKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICB2YXIgJHRoaXMgPSAkKHRoaXMpO1xuICAgICAgICAgICAgICAgIHNlbGYudW5fZXhwb3NlKCR0aGlzKTtcbiAgICAgICAgICAgICAgICBzZWxmLmV4cG9zZSgkdGhpcyk7XG4gICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBpZiAoc2VsZi5pc19waG9uZSgpKSB7XG4gICAgICAgICAgICAgIHNlbGYucG9zX3Bob25lKCk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICBzZWxmLnBvc19kZWZhdWx0KGZhbHNlKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgIH0sIDEwMCkpO1xuICAgIH0sXG5cbiAgICBzdGFydCA6IGZ1bmN0aW9uICgpIHtcbiAgICAgIHZhciBzZWxmID0gdGhpcyxcbiAgICAgICAgICAkdGhpcyA9ICQoJ1snICsgdGhpcy5hdHRyX25hbWUoKSArICddJywgdGhpcy5zY29wZSksXG4gICAgICAgICAgaW50ZWdlcl9zZXR0aW5ncyA9IFsndGltZXInLCAnc2Nyb2xsU3BlZWQnLCAnc3RhcnRPZmZzZXQnLCAndGlwQW5pbWF0aW9uRmFkZVNwZWVkJywgJ2Nvb2tpZUV4cGlyZXMnXSxcbiAgICAgICAgICBpbnRfc2V0dGluZ3NfY291bnQgPSBpbnRlZ2VyX3NldHRpbmdzLmxlbmd0aDtcblxuICAgICAgaWYgKCEkdGhpcy5sZW5ndGggPiAwKSB7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cblxuICAgICAgaWYgKCF0aGlzLnNldHRpbmdzLmluaXQpIHtcbiAgICAgICAgdGhpcy5ldmVudHMoKTtcbiAgICAgIH1cblxuICAgICAgdGhpcy5zZXR0aW5ncyA9ICR0aGlzLmRhdGEodGhpcy5hdHRyX25hbWUodHJ1ZSkgKyAnLWluaXQnKTtcblxuICAgICAgLy8gbm9uIGNvbmZpZ3VyZWFibGUgc2V0dGluZ3NcbiAgICAgIHRoaXMuc2V0dGluZ3MuJGNvbnRlbnRfZWwgPSAkdGhpcztcbiAgICAgIHRoaXMuc2V0dGluZ3MuJGJvZHkgPSAkKHRoaXMuc2V0dGluZ3MudGlwX2NvbnRhaW5lcik7XG4gICAgICB0aGlzLnNldHRpbmdzLmJvZHlfb2Zmc2V0ID0gJCh0aGlzLnNldHRpbmdzLnRpcF9jb250YWluZXIpLnBvc2l0aW9uKCk7XG4gICAgICB0aGlzLnNldHRpbmdzLiR0aXBfY29udGVudCA9IHRoaXMuc2V0dGluZ3MuJGNvbnRlbnRfZWwuZmluZCgnPiBsaScpO1xuICAgICAgdGhpcy5zZXR0aW5ncy5wYXVzZWQgPSBmYWxzZTtcbiAgICAgIHRoaXMuc2V0dGluZ3MuYXR0ZW1wdHMgPSAwO1xuICAgICAgdGhpcy5zZXR0aW5ncy5yaWRpbmcgPSB0cnVlO1xuXG4gICAgICAvLyBjYW4gd2UgY3JlYXRlIGNvb2tpZXM/XG4gICAgICBpZiAodHlwZW9mICQuY29va2llICE9PSAnZnVuY3Rpb24nKSB7XG4gICAgICAgIHRoaXMuc2V0dGluZ3MuY29va2llX21vbnN0ZXIgPSBmYWxzZTtcbiAgICAgIH1cblxuICAgICAgLy8gZ2VuZXJhdGUgdGhlIHRpcHMgYW5kIGluc2VydCBpbnRvIGRvbS5cbiAgICAgIGlmICghdGhpcy5zZXR0aW5ncy5jb29raWVfbW9uc3RlciB8fCB0aGlzLnNldHRpbmdzLmNvb2tpZV9tb25zdGVyICYmICEkLmNvb2tpZSh0aGlzLnNldHRpbmdzLmNvb2tpZV9uYW1lKSkge1xuICAgICAgICB0aGlzLnNldHRpbmdzLiR0aXBfY29udGVudC5lYWNoKGZ1bmN0aW9uIChpbmRleCkge1xuICAgICAgICAgIHZhciAkdGhpcyA9ICQodGhpcyk7XG4gICAgICAgICAgdGhpcy5zZXR0aW5ncyA9ICQuZXh0ZW5kKHt9LCBzZWxmLmRlZmF1bHRzLCBzZWxmLmRhdGFfb3B0aW9ucygkdGhpcykpO1xuXG4gICAgICAgICAgLy8gTWFrZSBzdXJlIHRoYXQgc2V0dGluZ3MgcGFyc2VkIGZyb20gZGF0YV9vcHRpb25zIGFyZSBpbnRlZ2VycyB3aGVyZSBuZWNlc3NhcnlcbiAgICAgICAgICB2YXIgaSA9IGludF9zZXR0aW5nc19jb3VudDtcbiAgICAgICAgICB3aGlsZSAoaS0tKSB7XG4gICAgICAgICAgICBzZWxmLnNldHRpbmdzW2ludGVnZXJfc2V0dGluZ3NbaV1dID0gcGFyc2VJbnQoc2VsZi5zZXR0aW5nc1tpbnRlZ2VyX3NldHRpbmdzW2ldXSwgMTApO1xuICAgICAgICAgIH1cbiAgICAgICAgICBzZWxmLmNyZWF0ZSh7JGxpIDogJHRoaXMsIGluZGV4IDogaW5kZXh9KTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgLy8gc2hvdyBmaXJzdCB0aXBcbiAgICAgICAgaWYgKCF0aGlzLnNldHRpbmdzLnN0YXJ0X3RpbWVyX29uX2NsaWNrICYmIHRoaXMuc2V0dGluZ3MudGltZXIgPiAwKSB7XG4gICAgICAgICAgdGhpcy5zaG93KCdpbml0Jyk7XG4gICAgICAgICAgdGhpcy5zdGFydFRpbWVyKCk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgdGhpcy5zaG93KCdpbml0Jyk7XG4gICAgICAgIH1cblxuICAgICAgfVxuICAgIH0sXG5cbiAgICByZXN1bWUgOiBmdW5jdGlvbiAoKSB7XG4gICAgICB0aGlzLnNldF9saSgpO1xuICAgICAgdGhpcy5zaG93KCk7XG4gICAgfSxcblxuICAgIHRpcF90ZW1wbGF0ZSA6IGZ1bmN0aW9uIChvcHRzKSB7XG4gICAgICB2YXIgJGJsYW5rLCBjb250ZW50O1xuXG4gICAgICBvcHRzLnRpcF9jbGFzcyA9IG9wdHMudGlwX2NsYXNzIHx8ICcnO1xuXG4gICAgICAkYmxhbmsgPSAkKHRoaXMuc2V0dGluZ3MudGVtcGxhdGUudGlwKS5hZGRDbGFzcyhvcHRzLnRpcF9jbGFzcyk7XG4gICAgICBjb250ZW50ID0gJC50cmltKCQob3B0cy5saSkuaHRtbCgpKSArXG4gICAgICAgIHRoaXMucHJldl9idXR0b25fdGV4dChvcHRzLnByZXZfYnV0dG9uX3RleHQsIG9wdHMuaW5kZXgpICtcbiAgICAgICAgdGhpcy5idXR0b25fdGV4dChvcHRzLmJ1dHRvbl90ZXh0KSArXG4gICAgICAgIHRoaXMuc2V0dGluZ3MudGVtcGxhdGUubGluayArXG4gICAgICAgIHRoaXMudGltZXJfaW5zdGFuY2Uob3B0cy5pbmRleCk7XG5cbiAgICAgICRibGFuay5hcHBlbmQoJCh0aGlzLnNldHRpbmdzLnRlbXBsYXRlLndyYXBwZXIpKTtcbiAgICAgICRibGFuay5maXJzdCgpLmF0dHIodGhpcy5hZGRfbmFtZXNwYWNlKCdkYXRhLWluZGV4JyksIG9wdHMuaW5kZXgpO1xuICAgICAgJCgnLmpveXJpZGUtY29udGVudC13cmFwcGVyJywgJGJsYW5rKS5hcHBlbmQoY29udGVudCk7XG5cbiAgICAgIHJldHVybiAkYmxhbmtbMF07XG4gICAgfSxcblxuICAgIHRpbWVyX2luc3RhbmNlIDogZnVuY3Rpb24gKGluZGV4KSB7XG4gICAgICB2YXIgdHh0O1xuXG4gICAgICBpZiAoKGluZGV4ID09PSAwICYmIHRoaXMuc2V0dGluZ3Muc3RhcnRfdGltZXJfb25fY2xpY2sgJiYgdGhpcy5zZXR0aW5ncy50aW1lciA+IDApIHx8IHRoaXMuc2V0dGluZ3MudGltZXIgPT09IDApIHtcbiAgICAgICAgdHh0ID0gJyc7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB0eHQgPSAkKHRoaXMuc2V0dGluZ3MudGVtcGxhdGUudGltZXIpWzBdLm91dGVySFRNTDtcbiAgICAgIH1cbiAgICAgIHJldHVybiB0eHQ7XG4gICAgfSxcblxuICAgIGJ1dHRvbl90ZXh0IDogZnVuY3Rpb24gKHR4dCkge1xuICAgICAgaWYgKHRoaXMuc2V0dGluZ3MudGlwX3NldHRpbmdzLm5leHRfYnV0dG9uKSB7XG4gICAgICAgIHR4dCA9ICQudHJpbSh0eHQpIHx8ICdOZXh0JztcbiAgICAgICAgdHh0ID0gJCh0aGlzLnNldHRpbmdzLnRlbXBsYXRlLmJ1dHRvbikuYXBwZW5kKHR4dClbMF0ub3V0ZXJIVE1MO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdHh0ID0gJyc7XG4gICAgICB9XG4gICAgICByZXR1cm4gdHh0O1xuICAgIH0sXG5cbiAgICBwcmV2X2J1dHRvbl90ZXh0IDogZnVuY3Rpb24gKHR4dCwgaWR4KSB7XG4gICAgICBpZiAodGhpcy5zZXR0aW5ncy50aXBfc2V0dGluZ3MucHJldl9idXR0b24pIHtcbiAgICAgICAgdHh0ID0gJC50cmltKHR4dCkgfHwgJ1ByZXZpb3VzJztcblxuICAgICAgICAvLyBBZGQgdGhlIGRpc2FibGVkIGNsYXNzIHRvIHRoZSBidXR0b24gaWYgaXQncyB0aGUgZmlyc3QgZWxlbWVudFxuICAgICAgICBpZiAoaWR4ID09IDApIHtcbiAgICAgICAgICB0eHQgPSAkKHRoaXMuc2V0dGluZ3MudGVtcGxhdGUucHJldl9idXR0b24pLmFwcGVuZCh0eHQpLmFkZENsYXNzKCdkaXNhYmxlZCcpWzBdLm91dGVySFRNTDtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICB0eHQgPSAkKHRoaXMuc2V0dGluZ3MudGVtcGxhdGUucHJldl9idXR0b24pLmFwcGVuZCh0eHQpWzBdLm91dGVySFRNTDtcbiAgICAgICAgfVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdHh0ID0gJyc7XG4gICAgICB9XG4gICAgICByZXR1cm4gdHh0O1xuICAgIH0sXG5cbiAgICBjcmVhdGUgOiBmdW5jdGlvbiAob3B0cykge1xuICAgICAgdGhpcy5zZXR0aW5ncy50aXBfc2V0dGluZ3MgPSAkLmV4dGVuZCh7fSwgdGhpcy5zZXR0aW5ncywgdGhpcy5kYXRhX29wdGlvbnMob3B0cy4kbGkpKTtcbiAgICAgIHZhciBidXR0b25UZXh0ID0gb3B0cy4kbGkuYXR0cih0aGlzLmFkZF9uYW1lc3BhY2UoJ2RhdGEtYnV0dG9uJykpIHx8IG9wdHMuJGxpLmF0dHIodGhpcy5hZGRfbmFtZXNwYWNlKCdkYXRhLXRleHQnKSksXG4gICAgICAgICAgcHJldkJ1dHRvblRleHQgPSBvcHRzLiRsaS5hdHRyKHRoaXMuYWRkX25hbWVzcGFjZSgnZGF0YS1idXR0b24tcHJldicpKSB8fCBvcHRzLiRsaS5hdHRyKHRoaXMuYWRkX25hbWVzcGFjZSgnZGF0YS1wcmV2LXRleHQnKSksXG4gICAgICAgIHRpcENsYXNzID0gb3B0cy4kbGkuYXR0cignY2xhc3MnKSxcbiAgICAgICAgJHRpcF9jb250ZW50ID0gJCh0aGlzLnRpcF90ZW1wbGF0ZSh7XG4gICAgICAgICAgdGlwX2NsYXNzIDogdGlwQ2xhc3MsXG4gICAgICAgICAgaW5kZXggOiBvcHRzLmluZGV4LFxuICAgICAgICAgIGJ1dHRvbl90ZXh0IDogYnV0dG9uVGV4dCxcbiAgICAgICAgICBwcmV2X2J1dHRvbl90ZXh0IDogcHJldkJ1dHRvblRleHQsXG4gICAgICAgICAgbGkgOiBvcHRzLiRsaVxuICAgICAgICB9KSk7XG5cbiAgICAgICQodGhpcy5zZXR0aW5ncy50aXBfY29udGFpbmVyKS5hcHBlbmQoJHRpcF9jb250ZW50KTtcbiAgICB9LFxuXG4gICAgc2hvdyA6IGZ1bmN0aW9uIChpbml0LCBpc19wcmV2KSB7XG4gICAgICB2YXIgJHRpbWVyID0gbnVsbDtcblxuICAgICAgLy8gYXJlIHdlIHBhdXNlZD9cbiAgICAgIGlmICh0aGlzLnNldHRpbmdzLiRsaSA9PT0gdW5kZWZpbmVkIHx8ICgkLmluQXJyYXkodGhpcy5zZXR0aW5ncy4kbGkuaW5kZXgoKSwgdGhpcy5zZXR0aW5ncy5wYXVzZV9hZnRlcikgPT09IC0xKSkge1xuXG4gICAgICAgIC8vIGRvbid0IGdvIHRvIHRoZSBuZXh0IGxpIGlmIHRoZSB0b3VyIHdhcyBwYXVzZWRcbiAgICAgICAgaWYgKHRoaXMuc2V0dGluZ3MucGF1c2VkKSB7XG4gICAgICAgICAgdGhpcy5zZXR0aW5ncy5wYXVzZWQgPSBmYWxzZTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICB0aGlzLnNldF9saShpbml0LCBpc19wcmV2KTtcbiAgICAgICAgfVxuXG4gICAgICAgIHRoaXMuc2V0dGluZ3MuYXR0ZW1wdHMgPSAwO1xuXG4gICAgICAgIGlmICh0aGlzLnNldHRpbmdzLiRsaS5sZW5ndGggJiYgdGhpcy5zZXR0aW5ncy4kdGFyZ2V0Lmxlbmd0aCA+IDApIHtcbiAgICAgICAgICBpZiAoaW5pdCkgeyAvL3J1biB3aGVuIHdlIGZpcnN0IHN0YXJ0XG4gICAgICAgICAgICB0aGlzLnNldHRpbmdzLnByZV9yaWRlX2NhbGxiYWNrKHRoaXMuc2V0dGluZ3MuJGxpLmluZGV4KCksIHRoaXMuc2V0dGluZ3MuJG5leHRfdGlwKTtcbiAgICAgICAgICAgIGlmICh0aGlzLnNldHRpbmdzLm1vZGFsKSB7XG4gICAgICAgICAgICAgIHRoaXMuc2hvd19tb2RhbCgpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cblxuICAgICAgICAgIHRoaXMuc2V0dGluZ3MucHJlX3N0ZXBfY2FsbGJhY2sodGhpcy5zZXR0aW5ncy4kbGkuaW5kZXgoKSwgdGhpcy5zZXR0aW5ncy4kbmV4dF90aXApO1xuXG4gICAgICAgICAgaWYgKHRoaXMuc2V0dGluZ3MubW9kYWwgJiYgdGhpcy5zZXR0aW5ncy5leHBvc2UpIHtcbiAgICAgICAgICAgIHRoaXMuZXhwb3NlKCk7XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgdGhpcy5zZXR0aW5ncy50aXBfc2V0dGluZ3MgPSAkLmV4dGVuZCh7fSwgdGhpcy5zZXR0aW5ncywgdGhpcy5kYXRhX29wdGlvbnModGhpcy5zZXR0aW5ncy4kbGkpKTtcblxuICAgICAgICAgIHRoaXMuc2V0dGluZ3MudGltZXIgPSBwYXJzZUludCh0aGlzLnNldHRpbmdzLnRpbWVyLCAxMCk7XG5cbiAgICAgICAgICB0aGlzLnNldHRpbmdzLnRpcF9zZXR0aW5ncy50aXBfbG9jYXRpb25fcGF0dGVybiA9IHRoaXMuc2V0dGluZ3MudGlwX2xvY2F0aW9uX3BhdHRlcm5zW3RoaXMuc2V0dGluZ3MudGlwX3NldHRpbmdzLnRpcF9sb2NhdGlvbl07XG5cbiAgICAgICAgICAvLyBzY3JvbGwgYW5kIGhpZGUgYmcgaWYgbm90IG1vZGFsXG4gICAgICAgICAgaWYgKCEvYm9keS9pLnRlc3QodGhpcy5zZXR0aW5ncy4kdGFyZ2V0LnNlbGVjdG9yKSkge1xuICAgICAgICAgICAgdmFyIGpveXJpZGVtb2RhbGJnID0gJCgnLmpveXJpZGUtbW9kYWwtYmcnKTtcbiAgICAgICAgICAgIGlmICgvcG9wL2kudGVzdCh0aGlzLnNldHRpbmdzLnRpcEFuaW1hdGlvbikpIHtcbiAgICAgICAgICAgICAgICBqb3lyaWRlbW9kYWxiZy5oaWRlKCk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIGpveXJpZGVtb2RhbGJnLmZhZGVPdXQodGhpcy5zZXR0aW5ncy50aXBBbmltYXRpb25GYWRlU3BlZWQpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgdGhpcy5zY3JvbGxfdG8oKTtcbiAgICAgICAgICB9XG5cbiAgICAgICAgICBpZiAodGhpcy5pc19waG9uZSgpKSB7XG4gICAgICAgICAgICB0aGlzLnBvc19waG9uZSh0cnVlKTtcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdGhpcy5wb3NfZGVmYXVsdCh0cnVlKTtcbiAgICAgICAgICB9XG5cbiAgICAgICAgICAkdGltZXIgPSB0aGlzLnNldHRpbmdzLiRuZXh0X3RpcC5maW5kKCcuam95cmlkZS10aW1lci1pbmRpY2F0b3InKTtcblxuICAgICAgICAgIGlmICgvcG9wL2kudGVzdCh0aGlzLnNldHRpbmdzLnRpcF9hbmltYXRpb24pKSB7XG5cbiAgICAgICAgICAgICR0aW1lci53aWR0aCgwKTtcblxuICAgICAgICAgICAgaWYgKHRoaXMuc2V0dGluZ3MudGltZXIgPiAwKSB7XG5cbiAgICAgICAgICAgICAgdGhpcy5zZXR0aW5ncy4kbmV4dF90aXAuc2hvdygpO1xuXG4gICAgICAgICAgICAgIHNldFRpbWVvdXQoZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgICR0aW1lci5hbmltYXRlKHtcbiAgICAgICAgICAgICAgICAgIHdpZHRoIDogJHRpbWVyLnBhcmVudCgpLndpZHRoKClcbiAgICAgICAgICAgICAgICB9LCB0aGlzLnNldHRpbmdzLnRpbWVyLCAnbGluZWFyJyk7XG4gICAgICAgICAgICAgIH0uYmluZCh0aGlzKSwgdGhpcy5zZXR0aW5ncy50aXBfYW5pbWF0aW9uX2ZhZGVfc3BlZWQpO1xuXG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICB0aGlzLnNldHRpbmdzLiRuZXh0X3RpcC5zaG93KCk7XG5cbiAgICAgICAgICAgIH1cblxuICAgICAgICAgIH0gZWxzZSBpZiAoL2ZhZGUvaS50ZXN0KHRoaXMuc2V0dGluZ3MudGlwX2FuaW1hdGlvbikpIHtcblxuICAgICAgICAgICAgJHRpbWVyLndpZHRoKDApO1xuXG4gICAgICAgICAgICBpZiAodGhpcy5zZXR0aW5ncy50aW1lciA+IDApIHtcblxuICAgICAgICAgICAgICB0aGlzLnNldHRpbmdzLiRuZXh0X3RpcFxuICAgICAgICAgICAgICAgIC5mYWRlSW4odGhpcy5zZXR0aW5ncy50aXBfYW5pbWF0aW9uX2ZhZGVfc3BlZWQpXG4gICAgICAgICAgICAgICAgLnNob3coKTtcblxuICAgICAgICAgICAgICBzZXRUaW1lb3V0KGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICAkdGltZXIuYW5pbWF0ZSh7XG4gICAgICAgICAgICAgICAgICB3aWR0aCA6ICR0aW1lci5wYXJlbnQoKS53aWR0aCgpXG4gICAgICAgICAgICAgICAgfSwgdGhpcy5zZXR0aW5ncy50aW1lciwgJ2xpbmVhcicpO1xuICAgICAgICAgICAgICB9LmJpbmQodGhpcyksIHRoaXMuc2V0dGluZ3MudGlwX2FuaW1hdGlvbl9mYWRlX3NwZWVkKTtcblxuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgdGhpcy5zZXR0aW5ncy4kbmV4dF90aXAuZmFkZUluKHRoaXMuc2V0dGluZ3MudGlwX2FuaW1hdGlvbl9mYWRlX3NwZWVkKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG5cbiAgICAgICAgICB0aGlzLnNldHRpbmdzLiRjdXJyZW50X3RpcCA9IHRoaXMuc2V0dGluZ3MuJG5leHRfdGlwO1xuXG4gICAgICAgIC8vIHNraXAgbm9uLWV4aXN0YW50IHRhcmdldHNcbiAgICAgICAgfSBlbHNlIGlmICh0aGlzLnNldHRpbmdzLiRsaSAmJiB0aGlzLnNldHRpbmdzLiR0YXJnZXQubGVuZ3RoIDwgMSkge1xuXG4gICAgICAgICAgdGhpcy5zaG93KGluaXQsIGlzX3ByZXYpO1xuXG4gICAgICAgIH0gZWxzZSB7XG5cbiAgICAgICAgICB0aGlzLmVuZCgpO1xuXG4gICAgICAgIH1cbiAgICAgIH0gZWxzZSB7XG5cbiAgICAgICAgdGhpcy5zZXR0aW5ncy5wYXVzZWQgPSB0cnVlO1xuXG4gICAgICB9XG5cbiAgICB9LFxuXG4gICAgaXNfcGhvbmUgOiBmdW5jdGlvbiAoKSB7XG4gICAgICByZXR1cm4gbWF0Y2hNZWRpYShGb3VuZGF0aW9uLm1lZGlhX3F1ZXJpZXMuc21hbGwpLm1hdGNoZXMgJiZcbiAgICAgICAgIW1hdGNoTWVkaWEoRm91bmRhdGlvbi5tZWRpYV9xdWVyaWVzLm1lZGl1bSkubWF0Y2hlcztcbiAgICB9LFxuXG4gICAgaGlkZSA6IGZ1bmN0aW9uICgpIHtcbiAgICAgIGlmICh0aGlzLnNldHRpbmdzLm1vZGFsICYmIHRoaXMuc2V0dGluZ3MuZXhwb3NlKSB7XG4gICAgICAgIHRoaXMudW5fZXhwb3NlKCk7XG4gICAgICB9XG5cbiAgICAgIGlmICghdGhpcy5zZXR0aW5ncy5tb2RhbCkge1xuICAgICAgICAkKCcuam95cmlkZS1tb2RhbC1iZycpLmhpZGUoKTtcbiAgICAgIH1cblxuICAgICAgLy8gUHJldmVudCBzY3JvbGwgYm91bmNpbmcuLi53YWl0IHRvIHJlbW92ZSBmcm9tIGxheW91dFxuICAgICAgdGhpcy5zZXR0aW5ncy4kY3VycmVudF90aXAuY3NzKCd2aXNpYmlsaXR5JywgJ2hpZGRlbicpO1xuICAgICAgc2V0VGltZW91dCgkLnByb3h5KGZ1bmN0aW9uICgpIHtcbiAgICAgICAgdGhpcy5oaWRlKCk7XG4gICAgICAgIHRoaXMuY3NzKCd2aXNpYmlsaXR5JywgJ3Zpc2libGUnKTtcbiAgICAgIH0sIHRoaXMuc2V0dGluZ3MuJGN1cnJlbnRfdGlwKSwgMCk7XG4gICAgICB0aGlzLnNldHRpbmdzLnBvc3Rfc3RlcF9jYWxsYmFjayh0aGlzLnNldHRpbmdzLiRsaS5pbmRleCgpLFxuICAgICAgICB0aGlzLnNldHRpbmdzLiRjdXJyZW50X3RpcCk7XG4gICAgfSxcblxuICAgIHNldF9saSA6IGZ1bmN0aW9uIChpbml0LCBpc19wcmV2KSB7XG4gICAgICBpZiAoaW5pdCkge1xuICAgICAgICB0aGlzLnNldHRpbmdzLiRsaSA9IHRoaXMuc2V0dGluZ3MuJHRpcF9jb250ZW50LmVxKHRoaXMuc2V0dGluZ3Muc3RhcnRfb2Zmc2V0KTtcbiAgICAgICAgdGhpcy5zZXRfbmV4dF90aXAoKTtcbiAgICAgICAgdGhpcy5zZXR0aW5ncy4kY3VycmVudF90aXAgPSB0aGlzLnNldHRpbmdzLiRuZXh0X3RpcDtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGlmIChpc19wcmV2KSB7XG4gICAgICAgICAgdGhpcy5zZXR0aW5ncy4kbGkgPSB0aGlzLnNldHRpbmdzLiRsaS5wcmV2KCk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgdGhpcy5zZXR0aW5ncy4kbGkgPSB0aGlzLnNldHRpbmdzLiRsaS5uZXh0KCk7XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5zZXRfbmV4dF90aXAoKTtcbiAgICAgIH1cblxuICAgICAgdGhpcy5zZXRfdGFyZ2V0KCk7XG4gICAgfSxcblxuICAgIHNldF9uZXh0X3RpcCA6IGZ1bmN0aW9uICgpIHtcbiAgICAgIHRoaXMuc2V0dGluZ3MuJG5leHRfdGlwID0gJCgnLmpveXJpZGUtdGlwLWd1aWRlJykuZXEodGhpcy5zZXR0aW5ncy4kbGkuaW5kZXgoKSk7XG4gICAgICB0aGlzLnNldHRpbmdzLiRuZXh0X3RpcC5kYXRhKCdjbG9zZWQnLCAnJyk7XG4gICAgfSxcblxuICAgIHNldF90YXJnZXQgOiBmdW5jdGlvbiAoKSB7XG4gICAgICB2YXIgY2wgPSB0aGlzLnNldHRpbmdzLiRsaS5hdHRyKHRoaXMuYWRkX25hbWVzcGFjZSgnZGF0YS1jbGFzcycpKSxcbiAgICAgICAgICBpZCA9IHRoaXMuc2V0dGluZ3MuJGxpLmF0dHIodGhpcy5hZGRfbmFtZXNwYWNlKCdkYXRhLWlkJykpLFxuICAgICAgICAgICRzZWwgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICBpZiAoaWQpIHtcbiAgICAgICAgICAgICAgcmV0dXJuICQoZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoaWQpKTtcbiAgICAgICAgICAgIH0gZWxzZSBpZiAoY2wpIHtcbiAgICAgICAgICAgICAgcmV0dXJuICQoJy4nICsgY2wpLmZpcnN0KCk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICByZXR1cm4gJCgnYm9keScpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH07XG5cbiAgICAgIHRoaXMuc2V0dGluZ3MuJHRhcmdldCA9ICRzZWwoKTtcbiAgICB9LFxuXG4gICAgc2Nyb2xsX3RvIDogZnVuY3Rpb24gKCkge1xuICAgICAgdmFyIHdpbmRvd19oYWxmLCB0aXBPZmZzZXQ7XG5cbiAgICAgIHdpbmRvd19oYWxmID0gJCh3aW5kb3cpLmhlaWdodCgpIC8gMjtcbiAgICAgIHRpcE9mZnNldCA9IE1hdGguY2VpbCh0aGlzLnNldHRpbmdzLiR0YXJnZXQub2Zmc2V0KCkudG9wIC0gd2luZG93X2hhbGYgKyB0aGlzLnNldHRpbmdzLiRuZXh0X3RpcC5vdXRlckhlaWdodCgpKTtcblxuICAgICAgaWYgKHRpcE9mZnNldCAhPSAwKSB7XG4gICAgICAgICQoJ2h0bWwsIGJvZHknKS5zdG9wKCkuYW5pbWF0ZSh7XG4gICAgICAgICAgc2Nyb2xsVG9wIDogdGlwT2Zmc2V0XG4gICAgICAgIH0sIHRoaXMuc2V0dGluZ3Muc2Nyb2xsX3NwZWVkLCAnc3dpbmcnKTtcbiAgICAgIH1cbiAgICB9LFxuXG4gICAgcGF1c2VkIDogZnVuY3Rpb24gKCkge1xuICAgICAgcmV0dXJuICgkLmluQXJyYXkoKHRoaXMuc2V0dGluZ3MuJGxpLmluZGV4KCkgKyAxKSwgdGhpcy5zZXR0aW5ncy5wYXVzZV9hZnRlcikgPT09IC0xKTtcbiAgICB9LFxuXG4gICAgcmVzdGFydCA6IGZ1bmN0aW9uICgpIHtcbiAgICAgIHRoaXMuaGlkZSgpO1xuICAgICAgdGhpcy5zZXR0aW5ncy4kbGkgPSB1bmRlZmluZWQ7XG4gICAgICB0aGlzLnNob3coJ2luaXQnKTtcbiAgICB9LFxuXG4gICAgcG9zX2RlZmF1bHQgOiBmdW5jdGlvbiAoaW5pdCkge1xuICAgICAgdmFyICRudWIgPSB0aGlzLnNldHRpbmdzLiRuZXh0X3RpcC5maW5kKCcuam95cmlkZS1udWInKSxcbiAgICAgICAgICBudWJfd2lkdGggPSBNYXRoLmNlaWwoJG51Yi5vdXRlcldpZHRoKCkgLyAyKSxcbiAgICAgICAgICBudWJfaGVpZ2h0ID0gTWF0aC5jZWlsKCRudWIub3V0ZXJIZWlnaHQoKSAvIDIpLFxuICAgICAgICAgIHRvZ2dsZSA9IGluaXQgfHwgZmFsc2U7XG5cbiAgICAgIC8vIHRpcCBtdXN0IG5vdCBiZSBcImRpc3BsYXk6IG5vbmVcIiB0byBjYWxjdWxhdGUgcG9zaXRpb25cbiAgICAgIGlmICh0b2dnbGUpIHtcbiAgICAgICAgdGhpcy5zZXR0aW5ncy4kbmV4dF90aXAuY3NzKCd2aXNpYmlsaXR5JywgJ2hpZGRlbicpO1xuICAgICAgICB0aGlzLnNldHRpbmdzLiRuZXh0X3RpcC5zaG93KCk7XG4gICAgICB9XG5cbiAgICAgIGlmICghL2JvZHkvaS50ZXN0KHRoaXMuc2V0dGluZ3MuJHRhcmdldC5zZWxlY3RvcikpIHtcbiAgICAgICAgICB2YXIgdG9wQWRqdXN0bWVudCA9IHRoaXMuc2V0dGluZ3MudGlwX3NldHRpbmdzLnRpcEFkanVzdG1lbnRZID8gcGFyc2VJbnQodGhpcy5zZXR0aW5ncy50aXBfc2V0dGluZ3MudGlwQWRqdXN0bWVudFkpIDogMCxcbiAgICAgICAgICAgICAgbGVmdEFkanVzdG1lbnQgPSB0aGlzLnNldHRpbmdzLnRpcF9zZXR0aW5ncy50aXBBZGp1c3RtZW50WCA/IHBhcnNlSW50KHRoaXMuc2V0dGluZ3MudGlwX3NldHRpbmdzLnRpcEFkanVzdG1lbnRYKSA6IDA7XG5cbiAgICAgICAgICBpZiAodGhpcy5ib3R0b20oKSkge1xuICAgICAgICAgICAgaWYgKHRoaXMucnRsKSB7XG4gICAgICAgICAgICAgIHRoaXMuc2V0dGluZ3MuJG5leHRfdGlwLmNzcyh7XG4gICAgICAgICAgICAgICAgdG9wIDogKHRoaXMuc2V0dGluZ3MuJHRhcmdldC5vZmZzZXQoKS50b3AgKyBudWJfaGVpZ2h0ICsgdGhpcy5zZXR0aW5ncy4kdGFyZ2V0Lm91dGVySGVpZ2h0KCkgKyB0b3BBZGp1c3RtZW50KSxcbiAgICAgICAgICAgICAgICBsZWZ0IDogdGhpcy5zZXR0aW5ncy4kdGFyZ2V0Lm9mZnNldCgpLmxlZnQgKyB0aGlzLnNldHRpbmdzLiR0YXJnZXQub3V0ZXJXaWR0aCgpIC0gdGhpcy5zZXR0aW5ncy4kbmV4dF90aXAub3V0ZXJXaWR0aCgpICsgbGVmdEFkanVzdG1lbnR9KTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgIHRoaXMuc2V0dGluZ3MuJG5leHRfdGlwLmNzcyh7XG4gICAgICAgICAgICAgICAgdG9wIDogKHRoaXMuc2V0dGluZ3MuJHRhcmdldC5vZmZzZXQoKS50b3AgKyBudWJfaGVpZ2h0ICsgdGhpcy5zZXR0aW5ncy4kdGFyZ2V0Lm91dGVySGVpZ2h0KCkgKyB0b3BBZGp1c3RtZW50KSxcbiAgICAgICAgICAgICAgICBsZWZ0IDogdGhpcy5zZXR0aW5ncy4kdGFyZ2V0Lm9mZnNldCgpLmxlZnQgKyBsZWZ0QWRqdXN0bWVudH0pO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICB0aGlzLm51Yl9wb3NpdGlvbigkbnViLCB0aGlzLnNldHRpbmdzLnRpcF9zZXR0aW5ncy5udWJfcG9zaXRpb24sICd0b3AnKTtcblxuICAgICAgICAgIH0gZWxzZSBpZiAodGhpcy50b3AoKSkge1xuICAgICAgICAgICAgaWYgKHRoaXMucnRsKSB7XG4gICAgICAgICAgICAgIHRoaXMuc2V0dGluZ3MuJG5leHRfdGlwLmNzcyh7XG4gICAgICAgICAgICAgICAgdG9wIDogKHRoaXMuc2V0dGluZ3MuJHRhcmdldC5vZmZzZXQoKS50b3AgLSB0aGlzLnNldHRpbmdzLiRuZXh0X3RpcC5vdXRlckhlaWdodCgpIC0gbnViX2hlaWdodCArIHRvcEFkanVzdG1lbnQpLFxuICAgICAgICAgICAgICAgIGxlZnQgOiB0aGlzLnNldHRpbmdzLiR0YXJnZXQub2Zmc2V0KCkubGVmdCArIHRoaXMuc2V0dGluZ3MuJHRhcmdldC5vdXRlcldpZHRoKCkgLSB0aGlzLnNldHRpbmdzLiRuZXh0X3RpcC5vdXRlcldpZHRoKCl9KTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgIHRoaXMuc2V0dGluZ3MuJG5leHRfdGlwLmNzcyh7XG4gICAgICAgICAgICAgICAgdG9wIDogKHRoaXMuc2V0dGluZ3MuJHRhcmdldC5vZmZzZXQoKS50b3AgLSB0aGlzLnNldHRpbmdzLiRuZXh0X3RpcC5vdXRlckhlaWdodCgpIC0gbnViX2hlaWdodCArIHRvcEFkanVzdG1lbnQpLFxuICAgICAgICAgICAgICAgIGxlZnQgOiB0aGlzLnNldHRpbmdzLiR0YXJnZXQub2Zmc2V0KCkubGVmdCArIGxlZnRBZGp1c3RtZW50fSk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHRoaXMubnViX3Bvc2l0aW9uKCRudWIsIHRoaXMuc2V0dGluZ3MudGlwX3NldHRpbmdzLm51Yl9wb3NpdGlvbiwgJ2JvdHRvbScpO1xuXG4gICAgICAgICAgfSBlbHNlIGlmICh0aGlzLnJpZ2h0KCkpIHtcblxuICAgICAgICAgICAgdGhpcy5zZXR0aW5ncy4kbmV4dF90aXAuY3NzKHtcbiAgICAgICAgICAgICAgdG9wIDogdGhpcy5zZXR0aW5ncy4kdGFyZ2V0Lm9mZnNldCgpLnRvcCArIHRvcEFkanVzdG1lbnQsXG4gICAgICAgICAgICAgIGxlZnQgOiAodGhpcy5zZXR0aW5ncy4kdGFyZ2V0Lm91dGVyV2lkdGgoKSArIHRoaXMuc2V0dGluZ3MuJHRhcmdldC5vZmZzZXQoKS5sZWZ0ICsgbnViX3dpZHRoICsgbGVmdEFkanVzdG1lbnQpfSk7XG5cbiAgICAgICAgICAgIHRoaXMubnViX3Bvc2l0aW9uKCRudWIsIHRoaXMuc2V0dGluZ3MudGlwX3NldHRpbmdzLm51Yl9wb3NpdGlvbiwgJ2xlZnQnKTtcblxuICAgICAgICAgIH0gZWxzZSBpZiAodGhpcy5sZWZ0KCkpIHtcblxuICAgICAgICAgICAgdGhpcy5zZXR0aW5ncy4kbmV4dF90aXAuY3NzKHtcbiAgICAgICAgICAgICAgdG9wIDogdGhpcy5zZXR0aW5ncy4kdGFyZ2V0Lm9mZnNldCgpLnRvcCArIHRvcEFkanVzdG1lbnQsXG4gICAgICAgICAgICAgIGxlZnQgOiAodGhpcy5zZXR0aW5ncy4kdGFyZ2V0Lm9mZnNldCgpLmxlZnQgLSB0aGlzLnNldHRpbmdzLiRuZXh0X3RpcC5vdXRlcldpZHRoKCkgLSBudWJfd2lkdGggKyBsZWZ0QWRqdXN0bWVudCl9KTtcblxuICAgICAgICAgICAgdGhpcy5udWJfcG9zaXRpb24oJG51YiwgdGhpcy5zZXR0aW5ncy50aXBfc2V0dGluZ3MubnViX3Bvc2l0aW9uLCAncmlnaHQnKTtcblxuICAgICAgICAgIH1cblxuICAgICAgICAgIGlmICghdGhpcy52aXNpYmxlKHRoaXMuY29ybmVycyh0aGlzLnNldHRpbmdzLiRuZXh0X3RpcCkpICYmIHRoaXMuc2V0dGluZ3MuYXR0ZW1wdHMgPCB0aGlzLnNldHRpbmdzLnRpcF9zZXR0aW5ncy50aXBfbG9jYXRpb25fcGF0dGVybi5sZW5ndGgpIHtcblxuICAgICAgICAgICAgJG51Yi5yZW1vdmVDbGFzcygnYm90dG9tJylcbiAgICAgICAgICAgICAgLnJlbW92ZUNsYXNzKCd0b3AnKVxuICAgICAgICAgICAgICAucmVtb3ZlQ2xhc3MoJ3JpZ2h0JylcbiAgICAgICAgICAgICAgLnJlbW92ZUNsYXNzKCdsZWZ0Jyk7XG5cbiAgICAgICAgICAgIHRoaXMuc2V0dGluZ3MudGlwX3NldHRpbmdzLnRpcF9sb2NhdGlvbiA9IHRoaXMuc2V0dGluZ3MudGlwX3NldHRpbmdzLnRpcF9sb2NhdGlvbl9wYXR0ZXJuW3RoaXMuc2V0dGluZ3MuYXR0ZW1wdHNdO1xuXG4gICAgICAgICAgICB0aGlzLnNldHRpbmdzLmF0dGVtcHRzKys7XG5cbiAgICAgICAgICAgIHRoaXMucG9zX2RlZmF1bHQoKTtcblxuICAgICAgICAgIH1cblxuICAgICAgfSBlbHNlIGlmICh0aGlzLnNldHRpbmdzLiRsaS5sZW5ndGgpIHtcblxuICAgICAgICB0aGlzLnBvc19tb2RhbCgkbnViKTtcblxuICAgICAgfVxuXG4gICAgICBpZiAodG9nZ2xlKSB7XG4gICAgICAgIHRoaXMuc2V0dGluZ3MuJG5leHRfdGlwLmhpZGUoKTtcbiAgICAgICAgdGhpcy5zZXR0aW5ncy4kbmV4dF90aXAuY3NzKCd2aXNpYmlsaXR5JywgJ3Zpc2libGUnKTtcbiAgICAgIH1cblxuICAgIH0sXG5cbiAgICBwb3NfcGhvbmUgOiBmdW5jdGlvbiAoaW5pdCkge1xuICAgICAgdmFyIHRpcF9oZWlnaHQgPSB0aGlzLnNldHRpbmdzLiRuZXh0X3RpcC5vdXRlckhlaWdodCgpLFxuICAgICAgICAgIHRpcF9vZmZzZXQgPSB0aGlzLnNldHRpbmdzLiRuZXh0X3RpcC5vZmZzZXQoKSxcbiAgICAgICAgICB0YXJnZXRfaGVpZ2h0ID0gdGhpcy5zZXR0aW5ncy4kdGFyZ2V0Lm91dGVySGVpZ2h0KCksXG4gICAgICAgICAgJG51YiA9ICQoJy5qb3lyaWRlLW51YicsIHRoaXMuc2V0dGluZ3MuJG5leHRfdGlwKSxcbiAgICAgICAgICBudWJfaGVpZ2h0ID0gTWF0aC5jZWlsKCRudWIub3V0ZXJIZWlnaHQoKSAvIDIpLFxuICAgICAgICAgIHRvZ2dsZSA9IGluaXQgfHwgZmFsc2U7XG5cbiAgICAgICRudWIucmVtb3ZlQ2xhc3MoJ2JvdHRvbScpXG4gICAgICAgIC5yZW1vdmVDbGFzcygndG9wJylcbiAgICAgICAgLnJlbW92ZUNsYXNzKCdyaWdodCcpXG4gICAgICAgIC5yZW1vdmVDbGFzcygnbGVmdCcpO1xuXG4gICAgICBpZiAodG9nZ2xlKSB7XG4gICAgICAgIHRoaXMuc2V0dGluZ3MuJG5leHRfdGlwLmNzcygndmlzaWJpbGl0eScsICdoaWRkZW4nKTtcbiAgICAgICAgdGhpcy5zZXR0aW5ncy4kbmV4dF90aXAuc2hvdygpO1xuICAgICAgfVxuXG4gICAgICBpZiAoIS9ib2R5L2kudGVzdCh0aGlzLnNldHRpbmdzLiR0YXJnZXQuc2VsZWN0b3IpKSB7XG5cbiAgICAgICAgaWYgKHRoaXMudG9wKCkpIHtcblxuICAgICAgICAgICAgdGhpcy5zZXR0aW5ncy4kbmV4dF90aXAub2Zmc2V0KHt0b3AgOiB0aGlzLnNldHRpbmdzLiR0YXJnZXQub2Zmc2V0KCkudG9wIC0gdGlwX2hlaWdodCAtIG51Yl9oZWlnaHR9KTtcbiAgICAgICAgICAgICRudWIuYWRkQ2xhc3MoJ2JvdHRvbScpO1xuXG4gICAgICAgIH0gZWxzZSB7XG5cbiAgICAgICAgICB0aGlzLnNldHRpbmdzLiRuZXh0X3RpcC5vZmZzZXQoe3RvcCA6IHRoaXMuc2V0dGluZ3MuJHRhcmdldC5vZmZzZXQoKS50b3AgKyB0YXJnZXRfaGVpZ2h0ICsgbnViX2hlaWdodH0pO1xuICAgICAgICAgICRudWIuYWRkQ2xhc3MoJ3RvcCcpO1xuXG4gICAgICAgIH1cblxuICAgICAgfSBlbHNlIGlmICh0aGlzLnNldHRpbmdzLiRsaS5sZW5ndGgpIHtcbiAgICAgICAgdGhpcy5wb3NfbW9kYWwoJG51Yik7XG4gICAgICB9XG5cbiAgICAgIGlmICh0b2dnbGUpIHtcbiAgICAgICAgdGhpcy5zZXR0aW5ncy4kbmV4dF90aXAuaGlkZSgpO1xuICAgICAgICB0aGlzLnNldHRpbmdzLiRuZXh0X3RpcC5jc3MoJ3Zpc2liaWxpdHknLCAndmlzaWJsZScpO1xuICAgICAgfVxuICAgIH0sXG5cbiAgICBwb3NfbW9kYWwgOiBmdW5jdGlvbiAoJG51Yikge1xuICAgICAgdGhpcy5jZW50ZXIoKTtcbiAgICAgICRudWIuaGlkZSgpO1xuXG4gICAgICB0aGlzLnNob3dfbW9kYWwoKTtcbiAgICB9LFxuXG4gICAgc2hvd19tb2RhbCA6IGZ1bmN0aW9uICgpIHtcbiAgICAgIGlmICghdGhpcy5zZXR0aW5ncy4kbmV4dF90aXAuZGF0YSgnY2xvc2VkJykpIHtcbiAgICAgICAgdmFyIGpveXJpZGVtb2RhbGJnID0gICQoJy5qb3lyaWRlLW1vZGFsLWJnJyk7XG4gICAgICAgIGlmIChqb3lyaWRlbW9kYWxiZy5sZW5ndGggPCAxKSB7XG4gICAgICAgICAgdmFyIGpveXJpZGVtb2RhbGJnID0gJCh0aGlzLnNldHRpbmdzLnRlbXBsYXRlLm1vZGFsKTtcbiAgICAgICAgICBqb3lyaWRlbW9kYWxiZy5hcHBlbmRUbygnYm9keScpO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKC9wb3AvaS50ZXN0KHRoaXMuc2V0dGluZ3MudGlwX2FuaW1hdGlvbikpIHtcbiAgICAgICAgICAgIGpveXJpZGVtb2RhbGJnLnNob3coKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGpveXJpZGVtb2RhbGJnLmZhZGVJbih0aGlzLnNldHRpbmdzLnRpcF9hbmltYXRpb25fZmFkZV9zcGVlZCk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9LFxuXG4gICAgZXhwb3NlIDogZnVuY3Rpb24gKCkge1xuICAgICAgdmFyIGV4cG9zZSxcbiAgICAgICAgICBleHBvc2VDb3ZlcixcbiAgICAgICAgICBlbCxcbiAgICAgICAgICBvcmlnQ1NTLFxuICAgICAgICAgIG9yaWdDbGFzc2VzLFxuICAgICAgICAgIHJhbmRJZCA9ICdleHBvc2UtJyArIHRoaXMucmFuZG9tX3N0cig2KTtcblxuICAgICAgaWYgKGFyZ3VtZW50cy5sZW5ndGggPiAwICYmIGFyZ3VtZW50c1swXSBpbnN0YW5jZW9mICQpIHtcbiAgICAgICAgZWwgPSBhcmd1bWVudHNbMF07XG4gICAgICB9IGVsc2UgaWYgKHRoaXMuc2V0dGluZ3MuJHRhcmdldCAmJiAhL2JvZHkvaS50ZXN0KHRoaXMuc2V0dGluZ3MuJHRhcmdldC5zZWxlY3RvcikpIHtcbiAgICAgICAgZWwgPSB0aGlzLnNldHRpbmdzLiR0YXJnZXQ7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICB9XG5cbiAgICAgIGlmIChlbC5sZW5ndGggPCAxKSB7XG4gICAgICAgIGlmICh3aW5kb3cuY29uc29sZSkge1xuICAgICAgICAgIGNvbnNvbGUuZXJyb3IoJ2VsZW1lbnQgbm90IHZhbGlkJywgZWwpO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgIH1cblxuICAgICAgZXhwb3NlID0gJCh0aGlzLnNldHRpbmdzLnRlbXBsYXRlLmV4cG9zZSk7XG4gICAgICB0aGlzLnNldHRpbmdzLiRib2R5LmFwcGVuZChleHBvc2UpO1xuICAgICAgZXhwb3NlLmNzcyh7XG4gICAgICAgIHRvcCA6IGVsLm9mZnNldCgpLnRvcCxcbiAgICAgICAgbGVmdCA6IGVsLm9mZnNldCgpLmxlZnQsXG4gICAgICAgIHdpZHRoIDogZWwub3V0ZXJXaWR0aCh0cnVlKSxcbiAgICAgICAgaGVpZ2h0IDogZWwub3V0ZXJIZWlnaHQodHJ1ZSlcbiAgICAgIH0pO1xuXG4gICAgICBleHBvc2VDb3ZlciA9ICQodGhpcy5zZXR0aW5ncy50ZW1wbGF0ZS5leHBvc2VfY292ZXIpO1xuXG4gICAgICBvcmlnQ1NTID0ge1xuICAgICAgICB6SW5kZXggOiBlbC5jc3MoJ3otaW5kZXgnKSxcbiAgICAgICAgcG9zaXRpb24gOiBlbC5jc3MoJ3Bvc2l0aW9uJylcbiAgICAgIH07XG5cbiAgICAgIG9yaWdDbGFzc2VzID0gZWwuYXR0cignY2xhc3MnKSA9PSBudWxsID8gJycgOiBlbC5hdHRyKCdjbGFzcycpO1xuXG4gICAgICBlbC5jc3MoJ3otaW5kZXgnLCBwYXJzZUludChleHBvc2UuY3NzKCd6LWluZGV4JykpICsgMSk7XG5cbiAgICAgIGlmIChvcmlnQ1NTLnBvc2l0aW9uID09ICdzdGF0aWMnKSB7XG4gICAgICAgIGVsLmNzcygncG9zaXRpb24nLCAncmVsYXRpdmUnKTtcbiAgICAgIH1cblxuICAgICAgZWwuZGF0YSgnZXhwb3NlLWNzcycsIG9yaWdDU1MpO1xuICAgICAgZWwuZGF0YSgnb3JpZy1jbGFzcycsIG9yaWdDbGFzc2VzKTtcbiAgICAgIGVsLmF0dHIoJ2NsYXNzJywgb3JpZ0NsYXNzZXMgKyAnICcgKyB0aGlzLnNldHRpbmdzLmV4cG9zZV9hZGRfY2xhc3MpO1xuXG4gICAgICBleHBvc2VDb3Zlci5jc3Moe1xuICAgICAgICB0b3AgOiBlbC5vZmZzZXQoKS50b3AsXG4gICAgICAgIGxlZnQgOiBlbC5vZmZzZXQoKS5sZWZ0LFxuICAgICAgICB3aWR0aCA6IGVsLm91dGVyV2lkdGgodHJ1ZSksXG4gICAgICAgIGhlaWdodCA6IGVsLm91dGVySGVpZ2h0KHRydWUpXG4gICAgICB9KTtcblxuICAgICAgaWYgKHRoaXMuc2V0dGluZ3MubW9kYWwpIHtcbiAgICAgICAgdGhpcy5zaG93X21vZGFsKCk7XG4gICAgICB9XG5cbiAgICAgIHRoaXMuc2V0dGluZ3MuJGJvZHkuYXBwZW5kKGV4cG9zZUNvdmVyKTtcbiAgICAgIGV4cG9zZS5hZGRDbGFzcyhyYW5kSWQpO1xuICAgICAgZXhwb3NlQ292ZXIuYWRkQ2xhc3MocmFuZElkKTtcbiAgICAgIGVsLmRhdGEoJ2V4cG9zZScsIHJhbmRJZCk7XG4gICAgICB0aGlzLnNldHRpbmdzLnBvc3RfZXhwb3NlX2NhbGxiYWNrKHRoaXMuc2V0dGluZ3MuJGxpLmluZGV4KCksIHRoaXMuc2V0dGluZ3MuJG5leHRfdGlwLCBlbCk7XG4gICAgICB0aGlzLmFkZF9leHBvc2VkKGVsKTtcbiAgICB9LFxuXG4gICAgdW5fZXhwb3NlIDogZnVuY3Rpb24gKCkge1xuICAgICAgdmFyIGV4cG9zZUlkLFxuICAgICAgICAgIGVsLFxuICAgICAgICAgIGV4cG9zZSxcbiAgICAgICAgICBvcmlnQ1NTLFxuICAgICAgICAgIG9yaWdDbGFzc2VzLFxuICAgICAgICAgIGNsZWFyQWxsID0gZmFsc2U7XG5cbiAgICAgIGlmIChhcmd1bWVudHMubGVuZ3RoID4gMCAmJiBhcmd1bWVudHNbMF0gaW5zdGFuY2VvZiAkKSB7XG4gICAgICAgIGVsID0gYXJndW1lbnRzWzBdO1xuICAgICAgfSBlbHNlIGlmICh0aGlzLnNldHRpbmdzLiR0YXJnZXQgJiYgIS9ib2R5L2kudGVzdCh0aGlzLnNldHRpbmdzLiR0YXJnZXQuc2VsZWN0b3IpKSB7XG4gICAgICAgIGVsID0gdGhpcy5zZXR0aW5ncy4kdGFyZ2V0O1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgfVxuXG4gICAgICBpZiAoZWwubGVuZ3RoIDwgMSkge1xuICAgICAgICBpZiAod2luZG93LmNvbnNvbGUpIHtcbiAgICAgICAgICBjb25zb2xlLmVycm9yKCdlbGVtZW50IG5vdCB2YWxpZCcsIGVsKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICB9XG5cbiAgICAgIGV4cG9zZUlkID0gZWwuZGF0YSgnZXhwb3NlJyk7XG4gICAgICBleHBvc2UgPSAkKCcuJyArIGV4cG9zZUlkKTtcblxuICAgICAgaWYgKGFyZ3VtZW50cy5sZW5ndGggPiAxKSB7XG4gICAgICAgIGNsZWFyQWxsID0gYXJndW1lbnRzWzFdO1xuICAgICAgfVxuXG4gICAgICBpZiAoY2xlYXJBbGwgPT09IHRydWUpIHtcbiAgICAgICAgJCgnLmpveXJpZGUtZXhwb3NlLXdyYXBwZXIsLmpveXJpZGUtZXhwb3NlLWNvdmVyJykucmVtb3ZlKCk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBleHBvc2UucmVtb3ZlKCk7XG4gICAgICB9XG5cbiAgICAgIG9yaWdDU1MgPSBlbC5kYXRhKCdleHBvc2UtY3NzJyk7XG5cbiAgICAgIGlmIChvcmlnQ1NTLnpJbmRleCA9PSAnYXV0bycpIHtcbiAgICAgICAgZWwuY3NzKCd6LWluZGV4JywgJycpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgZWwuY3NzKCd6LWluZGV4Jywgb3JpZ0NTUy56SW5kZXgpO1xuICAgICAgfVxuXG4gICAgICBpZiAob3JpZ0NTUy5wb3NpdGlvbiAhPSBlbC5jc3MoJ3Bvc2l0aW9uJykpIHtcbiAgICAgICAgaWYgKG9yaWdDU1MucG9zaXRpb24gPT0gJ3N0YXRpYycpIHsvLyB0aGlzIGlzIGRlZmF1bHQsIG5vIG5lZWQgdG8gc2V0IGl0LlxuICAgICAgICAgIGVsLmNzcygncG9zaXRpb24nLCAnJyk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgZWwuY3NzKCdwb3NpdGlvbicsIG9yaWdDU1MucG9zaXRpb24pO1xuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIG9yaWdDbGFzc2VzID0gZWwuZGF0YSgnb3JpZy1jbGFzcycpO1xuICAgICAgZWwuYXR0cignY2xhc3MnLCBvcmlnQ2xhc3Nlcyk7XG4gICAgICBlbC5yZW1vdmVEYXRhKCdvcmlnLWNsYXNzZXMnKTtcblxuICAgICAgZWwucmVtb3ZlRGF0YSgnZXhwb3NlJyk7XG4gICAgICBlbC5yZW1vdmVEYXRhKCdleHBvc2Utei1pbmRleCcpO1xuICAgICAgdGhpcy5yZW1vdmVfZXhwb3NlZChlbCk7XG4gICAgfSxcblxuICAgIGFkZF9leHBvc2VkIDogZnVuY3Rpb24gKGVsKSB7XG4gICAgICB0aGlzLnNldHRpbmdzLmV4cG9zZWQgPSB0aGlzLnNldHRpbmdzLmV4cG9zZWQgfHwgW107XG4gICAgICBpZiAoZWwgaW5zdGFuY2VvZiAkIHx8IHR5cGVvZiBlbCA9PT0gJ29iamVjdCcpIHtcbiAgICAgICAgdGhpcy5zZXR0aW5ncy5leHBvc2VkLnB1c2goZWxbMF0pO1xuICAgICAgfSBlbHNlIGlmICh0eXBlb2YgZWwgPT0gJ3N0cmluZycpIHtcbiAgICAgICAgdGhpcy5zZXR0aW5ncy5leHBvc2VkLnB1c2goZWwpO1xuICAgICAgfVxuICAgIH0sXG5cbiAgICByZW1vdmVfZXhwb3NlZCA6IGZ1bmN0aW9uIChlbCkge1xuICAgICAgdmFyIHNlYXJjaCwgaTtcbiAgICAgIGlmIChlbCBpbnN0YW5jZW9mICQpIHtcbiAgICAgICAgc2VhcmNoID0gZWxbMF1cbiAgICAgIH0gZWxzZSBpZiAodHlwZW9mIGVsID09ICdzdHJpbmcnKSB7XG4gICAgICAgIHNlYXJjaCA9IGVsO1xuICAgICAgfVxuXG4gICAgICB0aGlzLnNldHRpbmdzLmV4cG9zZWQgPSB0aGlzLnNldHRpbmdzLmV4cG9zZWQgfHwgW107XG4gICAgICBpID0gdGhpcy5zZXR0aW5ncy5leHBvc2VkLmxlbmd0aDtcblxuICAgICAgd2hpbGUgKGktLSkge1xuICAgICAgICBpZiAodGhpcy5zZXR0aW5ncy5leHBvc2VkW2ldID09IHNlYXJjaCkge1xuICAgICAgICAgIHRoaXMuc2V0dGluZ3MuZXhwb3NlZC5zcGxpY2UoaSwgMSk7XG4gICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfSxcblxuICAgIGNlbnRlciA6IGZ1bmN0aW9uICgpIHtcbiAgICAgIHZhciAkdyA9ICQod2luZG93KTtcblxuICAgICAgdGhpcy5zZXR0aW5ncy4kbmV4dF90aXAuY3NzKHtcbiAgICAgICAgdG9wIDogKCgoJHcuaGVpZ2h0KCkgLSB0aGlzLnNldHRpbmdzLiRuZXh0X3RpcC5vdXRlckhlaWdodCgpKSAvIDIpICsgJHcuc2Nyb2xsVG9wKCkpLFxuICAgICAgICBsZWZ0IDogKCgoJHcud2lkdGgoKSAtIHRoaXMuc2V0dGluZ3MuJG5leHRfdGlwLm91dGVyV2lkdGgoKSkgLyAyKSArICR3LnNjcm9sbExlZnQoKSlcbiAgICAgIH0pO1xuXG4gICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9LFxuXG4gICAgYm90dG9tIDogZnVuY3Rpb24gKCkge1xuICAgICAgcmV0dXJuIC9ib3R0b20vaS50ZXN0KHRoaXMuc2V0dGluZ3MudGlwX3NldHRpbmdzLnRpcF9sb2NhdGlvbik7XG4gICAgfSxcblxuICAgIHRvcCA6IGZ1bmN0aW9uICgpIHtcbiAgICAgIHJldHVybiAvdG9wL2kudGVzdCh0aGlzLnNldHRpbmdzLnRpcF9zZXR0aW5ncy50aXBfbG9jYXRpb24pO1xuICAgIH0sXG5cbiAgICByaWdodCA6IGZ1bmN0aW9uICgpIHtcbiAgICAgIHJldHVybiAvcmlnaHQvaS50ZXN0KHRoaXMuc2V0dGluZ3MudGlwX3NldHRpbmdzLnRpcF9sb2NhdGlvbik7XG4gICAgfSxcblxuICAgIGxlZnQgOiBmdW5jdGlvbiAoKSB7XG4gICAgICByZXR1cm4gL2xlZnQvaS50ZXN0KHRoaXMuc2V0dGluZ3MudGlwX3NldHRpbmdzLnRpcF9sb2NhdGlvbik7XG4gICAgfSxcblxuICAgIGNvcm5lcnMgOiBmdW5jdGlvbiAoZWwpIHtcbiAgICAgIHZhciB3ID0gJCh3aW5kb3cpLFxuICAgICAgICAgIHdpbmRvd19oYWxmID0gdy5oZWlnaHQoKSAvIDIsXG4gICAgICAgICAgLy91c2luZyB0aGlzIHRvIGNhbGN1bGF0ZSBzaW5jZSBzY3JvbGwgbWF5IG5vdCBoYXZlIGZpbmlzaGVkIHlldC5cbiAgICAgICAgICB0aXBPZmZzZXQgPSBNYXRoLmNlaWwodGhpcy5zZXR0aW5ncy4kdGFyZ2V0Lm9mZnNldCgpLnRvcCAtIHdpbmRvd19oYWxmICsgdGhpcy5zZXR0aW5ncy4kbmV4dF90aXAub3V0ZXJIZWlnaHQoKSksXG4gICAgICAgICAgcmlnaHQgPSB3LndpZHRoKCkgKyB3LnNjcm9sbExlZnQoKSxcbiAgICAgICAgICBvZmZzZXRCb3R0b20gPSAgdy5oZWlnaHQoKSArIHRpcE9mZnNldCxcbiAgICAgICAgICBib3R0b20gPSB3LmhlaWdodCgpICsgdy5zY3JvbGxUb3AoKSxcbiAgICAgICAgICB0b3AgPSB3LnNjcm9sbFRvcCgpO1xuXG4gICAgICBpZiAodGlwT2Zmc2V0IDwgdG9wKSB7XG4gICAgICAgIGlmICh0aXBPZmZzZXQgPCAwKSB7XG4gICAgICAgICAgdG9wID0gMDtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICB0b3AgPSB0aXBPZmZzZXQ7XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgaWYgKG9mZnNldEJvdHRvbSA+IGJvdHRvbSkge1xuICAgICAgICBib3R0b20gPSBvZmZzZXRCb3R0b207XG4gICAgICB9XG5cbiAgICAgIHJldHVybiBbXG4gICAgICAgIGVsLm9mZnNldCgpLnRvcCA8IHRvcCxcbiAgICAgICAgcmlnaHQgPCBlbC5vZmZzZXQoKS5sZWZ0ICsgZWwub3V0ZXJXaWR0aCgpLFxuICAgICAgICBib3R0b20gPCBlbC5vZmZzZXQoKS50b3AgKyBlbC5vdXRlckhlaWdodCgpLFxuICAgICAgICB3LnNjcm9sbExlZnQoKSA+IGVsLm9mZnNldCgpLmxlZnRcbiAgICAgIF07XG4gICAgfSxcblxuICAgIHZpc2libGUgOiBmdW5jdGlvbiAoaGlkZGVuX2Nvcm5lcnMpIHtcbiAgICAgIHZhciBpID0gaGlkZGVuX2Nvcm5lcnMubGVuZ3RoO1xuXG4gICAgICB3aGlsZSAoaS0tKSB7XG4gICAgICAgIGlmIChoaWRkZW5fY29ybmVyc1tpXSkge1xuICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9LFxuXG4gICAgbnViX3Bvc2l0aW9uIDogZnVuY3Rpb24gKG51YiwgcG9zLCBkZWYpIHtcbiAgICAgIGlmIChwb3MgPT09ICdhdXRvJykge1xuICAgICAgICBudWIuYWRkQ2xhc3MoZGVmKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIG51Yi5hZGRDbGFzcyhwb3MpO1xuICAgICAgfVxuICAgIH0sXG5cbiAgICBzdGFydFRpbWVyIDogZnVuY3Rpb24gKCkge1xuICAgICAgaWYgKHRoaXMuc2V0dGluZ3MuJGxpLmxlbmd0aCkge1xuICAgICAgICB0aGlzLnNldHRpbmdzLmF1dG9tYXRlID0gc2V0VGltZW91dChmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgdGhpcy5oaWRlKCk7XG4gICAgICAgICAgdGhpcy5zaG93KCk7XG4gICAgICAgICAgdGhpcy5zdGFydFRpbWVyKCk7XG4gICAgICAgIH0uYmluZCh0aGlzKSwgdGhpcy5zZXR0aW5ncy50aW1lcik7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBjbGVhclRpbWVvdXQodGhpcy5zZXR0aW5ncy5hdXRvbWF0ZSk7XG4gICAgICB9XG4gICAgfSxcblxuICAgIGVuZCA6IGZ1bmN0aW9uIChhYm9ydCkge1xuICAgICAgaWYgKHRoaXMuc2V0dGluZ3MuY29va2llX21vbnN0ZXIpIHtcbiAgICAgICAgJC5jb29raWUodGhpcy5zZXR0aW5ncy5jb29raWVfbmFtZSwgJ3JpZGRlbicsIHtleHBpcmVzIDogdGhpcy5zZXR0aW5ncy5jb29raWVfZXhwaXJlcywgZG9tYWluIDogdGhpcy5zZXR0aW5ncy5jb29raWVfZG9tYWlufSk7XG4gICAgICB9XG5cbiAgICAgIGlmICh0aGlzLnNldHRpbmdzLnRpbWVyID4gMCkge1xuICAgICAgICBjbGVhclRpbWVvdXQodGhpcy5zZXR0aW5ncy5hdXRvbWF0ZSk7XG4gICAgICB9XG5cbiAgICAgIGlmICh0aGlzLnNldHRpbmdzLm1vZGFsICYmIHRoaXMuc2V0dGluZ3MuZXhwb3NlKSB7XG4gICAgICAgIHRoaXMudW5fZXhwb3NlKCk7XG4gICAgICB9XG5cbiAgICAgIC8vIFVucGx1ZyBrZXlzdHJva2VzIGxpc3RlbmVyXG4gICAgICAkKHRoaXMuc2NvcGUpLm9mZigna2V5dXAuam95cmlkZScpXG5cbiAgICAgIHRoaXMuc2V0dGluZ3MuJG5leHRfdGlwLmRhdGEoJ2Nsb3NlZCcsIHRydWUpO1xuICAgICAgdGhpcy5zZXR0aW5ncy5yaWRpbmcgPSBmYWxzZTtcblxuICAgICAgJCgnLmpveXJpZGUtbW9kYWwtYmcnKS5oaWRlKCk7XG4gICAgICB0aGlzLnNldHRpbmdzLiRjdXJyZW50X3RpcC5oaWRlKCk7XG5cbiAgICAgIGlmICh0eXBlb2YgYWJvcnQgPT09ICd1bmRlZmluZWQnIHx8IGFib3J0ID09PSBmYWxzZSkge1xuICAgICAgICB0aGlzLnNldHRpbmdzLnBvc3Rfc3RlcF9jYWxsYmFjayh0aGlzLnNldHRpbmdzLiRsaS5pbmRleCgpLCB0aGlzLnNldHRpbmdzLiRjdXJyZW50X3RpcCk7XG4gICAgICAgIHRoaXMuc2V0dGluZ3MucG9zdF9yaWRlX2NhbGxiYWNrKHRoaXMuc2V0dGluZ3MuJGxpLmluZGV4KCksIHRoaXMuc2V0dGluZ3MuJGN1cnJlbnRfdGlwKTtcbiAgICAgIH1cblxuICAgICAgJCgnLmpveXJpZGUtdGlwLWd1aWRlJykucmVtb3ZlKCk7XG4gICAgfSxcblxuICAgIG9mZiA6IGZ1bmN0aW9uICgpIHtcbiAgICAgICQodGhpcy5zY29wZSkub2ZmKCcuam95cmlkZScpO1xuICAgICAgJCh3aW5kb3cpLm9mZignLmpveXJpZGUnKTtcbiAgICAgICQoJy5qb3lyaWRlLWNsb3NlLXRpcCwgLmpveXJpZGUtbmV4dC10aXAsIC5qb3lyaWRlLW1vZGFsLWJnJykub2ZmKCcuam95cmlkZScpO1xuICAgICAgJCgnLmpveXJpZGUtdGlwLWd1aWRlLCAuam95cmlkZS1tb2RhbC1iZycpLnJlbW92ZSgpO1xuICAgICAgY2xlYXJUaW1lb3V0KHRoaXMuc2V0dGluZ3MuYXV0b21hdGUpO1xuICAgICAgdGhpcy5zZXR0aW5ncyA9IHt9O1xuICAgIH0sXG5cbiAgICByZWZsb3cgOiBmdW5jdGlvbiAoKSB7fVxuICB9O1xufShqUXVlcnksIHdpbmRvdywgd2luZG93LmRvY3VtZW50KSk7XG4iXSwiZmlsZSI6ImZvdW5kYXRpb24vanMvZm91bmRhdGlvbi9mb3VuZGF0aW9uLmpveXJpZGUuanMiLCJzb3VyY2VSb290IjoiL3NvdXJjZS8ifQ==