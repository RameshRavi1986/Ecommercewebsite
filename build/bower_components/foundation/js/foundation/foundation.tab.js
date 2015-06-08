;(function ($, window, document, undefined) {
  'use strict';

  Foundation.libs.tab = {
    name : 'tab',

    version : '5.5.2',

    settings : {
      active_class : 'active',
      callback : function () {},
      deep_linking : false,
      scroll_to_content : true,
      is_hover : false
    },

    default_tab_hashes : [],

    init : function (scope, method, options) {
      var self = this,
          S = this.S;

	  // Store the default active tabs which will be referenced when the
	  // location hash is absent, as in the case of navigating the tabs and
	  // returning to the first viewing via the browser Back button.
	  S('[' + this.attr_name() + '] > .active > a', this.scope).each(function () {
	    self.default_tab_hashes.push(this.hash);
	  });

      // store the initial href, which is used to allow correct behaviour of the
      // browser back button when deep linking is turned on.
      self.entry_location = window.location.href;

      this.bindings(method, options);
      this.handle_location_hash_change();
    },

    events : function () {
      var self = this,
          S = this.S;

      var usual_tab_behavior =  function (e, target) {
          var settings = S(target).closest('[' + self.attr_name() + ']').data(self.attr_name(true) + '-init');
          if (!settings.is_hover || Modernizr.touch) {
            e.preventDefault();
            e.stopPropagation();
            self.toggle_active_tab(S(target).parent());
          }
        };

      S(this.scope)
        .off('.tab')
        // Key event: focus/tab key
        .on('keydown.fndtn.tab', '[' + this.attr_name() + '] > * > a', function(e) {
          var el = this;
          var keyCode = e.keyCode || e.which;
            // if user pressed tab key
            if (keyCode == 9) { 
              e.preventDefault();
              // TODO: Change usual_tab_behavior into accessibility function?
              usual_tab_behavior(e, el);
            } 
        })
        // Click event: tab title
        .on('click.fndtn.tab', '[' + this.attr_name() + '] > * > a', function(e) {
          var el = this;
          usual_tab_behavior(e, el);
        })
        // Hover event: tab title
        .on('mouseenter.fndtn.tab', '[' + this.attr_name() + '] > * > a', function (e) {
          var settings = S(this).closest('[' + self.attr_name() + ']').data(self.attr_name(true) + '-init');
          if (settings.is_hover) {
            self.toggle_active_tab(S(this).parent());
          }
        });

      // Location hash change event
      S(window).on('hashchange.fndtn.tab', function (e) {
        e.preventDefault();
        self.handle_location_hash_change();
      });
    },

    handle_location_hash_change : function () {

      var self = this,
          S = this.S;

      S('[' + this.attr_name() + ']', this.scope).each(function () {
        var settings = S(this).data(self.attr_name(true) + '-init');
        if (settings.deep_linking) {
          // Match the location hash to a label
          var hash;
          if (settings.scroll_to_content) {
            hash = self.scope.location.hash;
          } else {
            // prefix the hash to prevent anchor scrolling
            hash = self.scope.location.hash.replace('fndtn-', '');
          }
          if (hash != '') {
            // Check whether the location hash references a tab content div or
            // another element on the page (inside or outside the tab content div)
            var hash_element = S(hash);
            if (hash_element.hasClass('content') && hash_element.parent().hasClass('tabs-content')) {
              // Tab content div
              self.toggle_active_tab($('[' + self.attr_name() + '] > * > a[href=' + hash + ']').parent());
            } else {
              // Not the tab content div. If inside the tab content, find the
              // containing tab and toggle it as active.
              var hash_tab_container_id = hash_element.closest('.content').attr('id');
              if (hash_tab_container_id != undefined) {
                self.toggle_active_tab($('[' + self.attr_name() + '] > * > a[href=#' + hash_tab_container_id + ']').parent(), hash);
              }
            }
          } else {
            // Reference the default tab hashes which were initialized in the init function
            for (var ind = 0; ind < self.default_tab_hashes.length; ind++) {
              self.toggle_active_tab($('[' + self.attr_name() + '] > * > a[href=' + self.default_tab_hashes[ind] + ']').parent());
            }
          }
        }
       });
     },

    toggle_active_tab : function (tab, location_hash) {
      var self = this,
          S = self.S,
          tabs = tab.closest('[' + this.attr_name() + ']'),
          tab_link = tab.find('a'),
          anchor = tab.children('a').first(),
          target_hash = '#' + anchor.attr('href').split('#')[1],
          target = S(target_hash),
          siblings = tab.siblings(),
          settings = tabs.data(this.attr_name(true) + '-init'),
          interpret_keyup_action = function (e) {
            // Light modification of Heydon Pickering's Practical ARIA Examples: http://heydonworks.com/practical_aria_examples/js/a11y.js

            // define current, previous and next (possible) tabs

            var $original = $(this);
            var $prev = $(this).parents('li').prev().children('[role="tab"]');
            var $next = $(this).parents('li').next().children('[role="tab"]');
            var $target;

            // find the direction (prev or next)

            switch (e.keyCode) {
              case 37:
                $target = $prev;
                break;
              case 39:
                $target = $next;
                break;
              default:
                $target = false
                  break;
            }

            if ($target.length) {
              $original.attr({
                'tabindex' : '-1',
                'aria-selected' : null
              });
              $target.attr({
                'tabindex' : '0',
                'aria-selected' : true
              }).focus();
            }

            // Hide panels

            $('[role="tabpanel"]')
              .attr('aria-hidden', 'true');

            // Show panel which corresponds to target

            $('#' + $(document.activeElement).attr('href').substring(1))
              .attr('aria-hidden', null);

          },
          go_to_hash = function(hash) {
            // This function allows correct behaviour of the browser's back button when deep linking is enabled. Without it
            // the user would get continually redirected to the default hash.
            var is_entry_location = window.location.href === self.entry_location,
                default_hash = settings.scroll_to_content ? self.default_tab_hashes[0] : is_entry_location ? window.location.hash :'fndtn-' + self.default_tab_hashes[0].replace('#', '')

            if (!(is_entry_location && hash === default_hash)) {
              window.location.hash = hash;
            }
          };

      // allow usage of data-tab-content attribute instead of href
      if (anchor.data('tab-content')) {
        target_hash = '#' + anchor.data('tab-content').split('#')[1];
        target = S(target_hash);
      }

      if (settings.deep_linking) {

        if (settings.scroll_to_content) {

          // retain current hash to scroll to content
          go_to_hash(location_hash || target_hash);

          if (location_hash == undefined || location_hash == target_hash) {
            tab.parent()[0].scrollIntoView();
          } else {
            S(target_hash)[0].scrollIntoView();
          }
        } else {
          // prefix the hashes so that the browser doesn't scroll down
          if (location_hash != undefined) {
            go_to_hash('fndtn-' + location_hash.replace('#', ''));
          } else {
            go_to_hash('fndtn-' + target_hash.replace('#', ''));
          }
        }
      }

      // WARNING: The activation and deactivation of the tab content must
      // occur after the deep linking in order to properly refresh the browser
      // window (notably in Chrome).
      // Clean up multiple attr instances to done once
      tab.addClass(settings.active_class).triggerHandler('opened');
      tab_link.attr({'aria-selected' : 'true',  tabindex : 0});
      siblings.removeClass(settings.active_class)
      siblings.find('a').attr({'aria-selected' : 'false',  tabindex : -1});
      target.siblings().removeClass(settings.active_class).attr({'aria-hidden' : 'true',  tabindex : -1});
      target.addClass(settings.active_class).attr('aria-hidden', 'false').removeAttr('tabindex');
      settings.callback(tab);
      target.triggerHandler('toggled', [target]);
      tabs.triggerHandler('toggled', [tab]);

      tab_link.off('keydown').on('keydown', interpret_keyup_action );
    },

    data_attr : function (str) {
      if (this.namespace.length > 0) {
        return this.namespace + '-' + str;
      }

      return str;
    },

    off : function () {},

    reflow : function () {}
  };
}(jQuery, window, window.document));

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiIiwic291cmNlcyI6WyJmb3VuZGF0aW9uL2pzL2ZvdW5kYXRpb24vZm91bmRhdGlvbi50YWIuanMiXSwic291cmNlc0NvbnRlbnQiOlsiOyhmdW5jdGlvbiAoJCwgd2luZG93LCBkb2N1bWVudCwgdW5kZWZpbmVkKSB7XG4gICd1c2Ugc3RyaWN0JztcblxuICBGb3VuZGF0aW9uLmxpYnMudGFiID0ge1xuICAgIG5hbWUgOiAndGFiJyxcblxuICAgIHZlcnNpb24gOiAnNS41LjInLFxuXG4gICAgc2V0dGluZ3MgOiB7XG4gICAgICBhY3RpdmVfY2xhc3MgOiAnYWN0aXZlJyxcbiAgICAgIGNhbGxiYWNrIDogZnVuY3Rpb24gKCkge30sXG4gICAgICBkZWVwX2xpbmtpbmcgOiBmYWxzZSxcbiAgICAgIHNjcm9sbF90b19jb250ZW50IDogdHJ1ZSxcbiAgICAgIGlzX2hvdmVyIDogZmFsc2VcbiAgICB9LFxuXG4gICAgZGVmYXVsdF90YWJfaGFzaGVzIDogW10sXG5cbiAgICBpbml0IDogZnVuY3Rpb24gKHNjb3BlLCBtZXRob2QsIG9wdGlvbnMpIHtcbiAgICAgIHZhciBzZWxmID0gdGhpcyxcbiAgICAgICAgICBTID0gdGhpcy5TO1xuXG5cdCAgLy8gU3RvcmUgdGhlIGRlZmF1bHQgYWN0aXZlIHRhYnMgd2hpY2ggd2lsbCBiZSByZWZlcmVuY2VkIHdoZW4gdGhlXG5cdCAgLy8gbG9jYXRpb24gaGFzaCBpcyBhYnNlbnQsIGFzIGluIHRoZSBjYXNlIG9mIG5hdmlnYXRpbmcgdGhlIHRhYnMgYW5kXG5cdCAgLy8gcmV0dXJuaW5nIHRvIHRoZSBmaXJzdCB2aWV3aW5nIHZpYSB0aGUgYnJvd3NlciBCYWNrIGJ1dHRvbi5cblx0ICBTKCdbJyArIHRoaXMuYXR0cl9uYW1lKCkgKyAnXSA+IC5hY3RpdmUgPiBhJywgdGhpcy5zY29wZSkuZWFjaChmdW5jdGlvbiAoKSB7XG5cdCAgICBzZWxmLmRlZmF1bHRfdGFiX2hhc2hlcy5wdXNoKHRoaXMuaGFzaCk7XG5cdCAgfSk7XG5cbiAgICAgIC8vIHN0b3JlIHRoZSBpbml0aWFsIGhyZWYsIHdoaWNoIGlzIHVzZWQgdG8gYWxsb3cgY29ycmVjdCBiZWhhdmlvdXIgb2YgdGhlXG4gICAgICAvLyBicm93c2VyIGJhY2sgYnV0dG9uIHdoZW4gZGVlcCBsaW5raW5nIGlzIHR1cm5lZCBvbi5cbiAgICAgIHNlbGYuZW50cnlfbG9jYXRpb24gPSB3aW5kb3cubG9jYXRpb24uaHJlZjtcblxuICAgICAgdGhpcy5iaW5kaW5ncyhtZXRob2QsIG9wdGlvbnMpO1xuICAgICAgdGhpcy5oYW5kbGVfbG9jYXRpb25faGFzaF9jaGFuZ2UoKTtcbiAgICB9LFxuXG4gICAgZXZlbnRzIDogZnVuY3Rpb24gKCkge1xuICAgICAgdmFyIHNlbGYgPSB0aGlzLFxuICAgICAgICAgIFMgPSB0aGlzLlM7XG5cbiAgICAgIHZhciB1c3VhbF90YWJfYmVoYXZpb3IgPSAgZnVuY3Rpb24gKGUsIHRhcmdldCkge1xuICAgICAgICAgIHZhciBzZXR0aW5ncyA9IFModGFyZ2V0KS5jbG9zZXN0KCdbJyArIHNlbGYuYXR0cl9uYW1lKCkgKyAnXScpLmRhdGEoc2VsZi5hdHRyX25hbWUodHJ1ZSkgKyAnLWluaXQnKTtcbiAgICAgICAgICBpZiAoIXNldHRpbmdzLmlzX2hvdmVyIHx8IE1vZGVybml6ci50b3VjaCkge1xuICAgICAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgICAgICAgZS5zdG9wUHJvcGFnYXRpb24oKTtcbiAgICAgICAgICAgIHNlbGYudG9nZ2xlX2FjdGl2ZV90YWIoUyh0YXJnZXQpLnBhcmVudCgpKTtcbiAgICAgICAgICB9XG4gICAgICAgIH07XG5cbiAgICAgIFModGhpcy5zY29wZSlcbiAgICAgICAgLm9mZignLnRhYicpXG4gICAgICAgIC8vIEtleSBldmVudDogZm9jdXMvdGFiIGtleVxuICAgICAgICAub24oJ2tleWRvd24uZm5kdG4udGFiJywgJ1snICsgdGhpcy5hdHRyX25hbWUoKSArICddID4gKiA+IGEnLCBmdW5jdGlvbihlKSB7XG4gICAgICAgICAgdmFyIGVsID0gdGhpcztcbiAgICAgICAgICB2YXIga2V5Q29kZSA9IGUua2V5Q29kZSB8fCBlLndoaWNoO1xuICAgICAgICAgICAgLy8gaWYgdXNlciBwcmVzc2VkIHRhYiBrZXlcbiAgICAgICAgICAgIGlmIChrZXlDb2RlID09IDkpIHsgXG4gICAgICAgICAgICAgIGUucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgICAgICAgLy8gVE9ETzogQ2hhbmdlIHVzdWFsX3RhYl9iZWhhdmlvciBpbnRvIGFjY2Vzc2liaWxpdHkgZnVuY3Rpb24/XG4gICAgICAgICAgICAgIHVzdWFsX3RhYl9iZWhhdmlvcihlLCBlbCk7XG4gICAgICAgICAgICB9IFxuICAgICAgICB9KVxuICAgICAgICAvLyBDbGljayBldmVudDogdGFiIHRpdGxlXG4gICAgICAgIC5vbignY2xpY2suZm5kdG4udGFiJywgJ1snICsgdGhpcy5hdHRyX25hbWUoKSArICddID4gKiA+IGEnLCBmdW5jdGlvbihlKSB7XG4gICAgICAgICAgdmFyIGVsID0gdGhpcztcbiAgICAgICAgICB1c3VhbF90YWJfYmVoYXZpb3IoZSwgZWwpO1xuICAgICAgICB9KVxuICAgICAgICAvLyBIb3ZlciBldmVudDogdGFiIHRpdGxlXG4gICAgICAgIC5vbignbW91c2VlbnRlci5mbmR0bi50YWInLCAnWycgKyB0aGlzLmF0dHJfbmFtZSgpICsgJ10gPiAqID4gYScsIGZ1bmN0aW9uIChlKSB7XG4gICAgICAgICAgdmFyIHNldHRpbmdzID0gUyh0aGlzKS5jbG9zZXN0KCdbJyArIHNlbGYuYXR0cl9uYW1lKCkgKyAnXScpLmRhdGEoc2VsZi5hdHRyX25hbWUodHJ1ZSkgKyAnLWluaXQnKTtcbiAgICAgICAgICBpZiAoc2V0dGluZ3MuaXNfaG92ZXIpIHtcbiAgICAgICAgICAgIHNlbGYudG9nZ2xlX2FjdGl2ZV90YWIoUyh0aGlzKS5wYXJlbnQoKSk7XG4gICAgICAgICAgfVxuICAgICAgICB9KTtcblxuICAgICAgLy8gTG9jYXRpb24gaGFzaCBjaGFuZ2UgZXZlbnRcbiAgICAgIFMod2luZG93KS5vbignaGFzaGNoYW5nZS5mbmR0bi50YWInLCBmdW5jdGlvbiAoZSkge1xuICAgICAgICBlLnByZXZlbnREZWZhdWx0KCk7XG4gICAgICAgIHNlbGYuaGFuZGxlX2xvY2F0aW9uX2hhc2hfY2hhbmdlKCk7XG4gICAgICB9KTtcbiAgICB9LFxuXG4gICAgaGFuZGxlX2xvY2F0aW9uX2hhc2hfY2hhbmdlIDogZnVuY3Rpb24gKCkge1xuXG4gICAgICB2YXIgc2VsZiA9IHRoaXMsXG4gICAgICAgICAgUyA9IHRoaXMuUztcblxuICAgICAgUygnWycgKyB0aGlzLmF0dHJfbmFtZSgpICsgJ10nLCB0aGlzLnNjb3BlKS5lYWNoKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgdmFyIHNldHRpbmdzID0gUyh0aGlzKS5kYXRhKHNlbGYuYXR0cl9uYW1lKHRydWUpICsgJy1pbml0Jyk7XG4gICAgICAgIGlmIChzZXR0aW5ncy5kZWVwX2xpbmtpbmcpIHtcbiAgICAgICAgICAvLyBNYXRjaCB0aGUgbG9jYXRpb24gaGFzaCB0byBhIGxhYmVsXG4gICAgICAgICAgdmFyIGhhc2g7XG4gICAgICAgICAgaWYgKHNldHRpbmdzLnNjcm9sbF90b19jb250ZW50KSB7XG4gICAgICAgICAgICBoYXNoID0gc2VsZi5zY29wZS5sb2NhdGlvbi5oYXNoO1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAvLyBwcmVmaXggdGhlIGhhc2ggdG8gcHJldmVudCBhbmNob3Igc2Nyb2xsaW5nXG4gICAgICAgICAgICBoYXNoID0gc2VsZi5zY29wZS5sb2NhdGlvbi5oYXNoLnJlcGxhY2UoJ2ZuZHRuLScsICcnKTtcbiAgICAgICAgICB9XG4gICAgICAgICAgaWYgKGhhc2ggIT0gJycpIHtcbiAgICAgICAgICAgIC8vIENoZWNrIHdoZXRoZXIgdGhlIGxvY2F0aW9uIGhhc2ggcmVmZXJlbmNlcyBhIHRhYiBjb250ZW50IGRpdiBvclxuICAgICAgICAgICAgLy8gYW5vdGhlciBlbGVtZW50IG9uIHRoZSBwYWdlIChpbnNpZGUgb3Igb3V0c2lkZSB0aGUgdGFiIGNvbnRlbnQgZGl2KVxuICAgICAgICAgICAgdmFyIGhhc2hfZWxlbWVudCA9IFMoaGFzaCk7XG4gICAgICAgICAgICBpZiAoaGFzaF9lbGVtZW50Lmhhc0NsYXNzKCdjb250ZW50JykgJiYgaGFzaF9lbGVtZW50LnBhcmVudCgpLmhhc0NsYXNzKCd0YWJzLWNvbnRlbnQnKSkge1xuICAgICAgICAgICAgICAvLyBUYWIgY29udGVudCBkaXZcbiAgICAgICAgICAgICAgc2VsZi50b2dnbGVfYWN0aXZlX3RhYigkKCdbJyArIHNlbGYuYXR0cl9uYW1lKCkgKyAnXSA+ICogPiBhW2hyZWY9JyArIGhhc2ggKyAnXScpLnBhcmVudCgpKTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgIC8vIE5vdCB0aGUgdGFiIGNvbnRlbnQgZGl2LiBJZiBpbnNpZGUgdGhlIHRhYiBjb250ZW50LCBmaW5kIHRoZVxuICAgICAgICAgICAgICAvLyBjb250YWluaW5nIHRhYiBhbmQgdG9nZ2xlIGl0IGFzIGFjdGl2ZS5cbiAgICAgICAgICAgICAgdmFyIGhhc2hfdGFiX2NvbnRhaW5lcl9pZCA9IGhhc2hfZWxlbWVudC5jbG9zZXN0KCcuY29udGVudCcpLmF0dHIoJ2lkJyk7XG4gICAgICAgICAgICAgIGlmIChoYXNoX3RhYl9jb250YWluZXJfaWQgIT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICAgICAgc2VsZi50b2dnbGVfYWN0aXZlX3RhYigkKCdbJyArIHNlbGYuYXR0cl9uYW1lKCkgKyAnXSA+ICogPiBhW2hyZWY9IycgKyBoYXNoX3RhYl9jb250YWluZXJfaWQgKyAnXScpLnBhcmVudCgpLCBoYXNoKTtcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAvLyBSZWZlcmVuY2UgdGhlIGRlZmF1bHQgdGFiIGhhc2hlcyB3aGljaCB3ZXJlIGluaXRpYWxpemVkIGluIHRoZSBpbml0IGZ1bmN0aW9uXG4gICAgICAgICAgICBmb3IgKHZhciBpbmQgPSAwOyBpbmQgPCBzZWxmLmRlZmF1bHRfdGFiX2hhc2hlcy5sZW5ndGg7IGluZCsrKSB7XG4gICAgICAgICAgICAgIHNlbGYudG9nZ2xlX2FjdGl2ZV90YWIoJCgnWycgKyBzZWxmLmF0dHJfbmFtZSgpICsgJ10gPiAqID4gYVtocmVmPScgKyBzZWxmLmRlZmF1bHRfdGFiX2hhc2hlc1tpbmRdICsgJ10nKS5wYXJlbnQoKSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgfSk7XG4gICAgIH0sXG5cbiAgICB0b2dnbGVfYWN0aXZlX3RhYiA6IGZ1bmN0aW9uICh0YWIsIGxvY2F0aW9uX2hhc2gpIHtcbiAgICAgIHZhciBzZWxmID0gdGhpcyxcbiAgICAgICAgICBTID0gc2VsZi5TLFxuICAgICAgICAgIHRhYnMgPSB0YWIuY2xvc2VzdCgnWycgKyB0aGlzLmF0dHJfbmFtZSgpICsgJ10nKSxcbiAgICAgICAgICB0YWJfbGluayA9IHRhYi5maW5kKCdhJyksXG4gICAgICAgICAgYW5jaG9yID0gdGFiLmNoaWxkcmVuKCdhJykuZmlyc3QoKSxcbiAgICAgICAgICB0YXJnZXRfaGFzaCA9ICcjJyArIGFuY2hvci5hdHRyKCdocmVmJykuc3BsaXQoJyMnKVsxXSxcbiAgICAgICAgICB0YXJnZXQgPSBTKHRhcmdldF9oYXNoKSxcbiAgICAgICAgICBzaWJsaW5ncyA9IHRhYi5zaWJsaW5ncygpLFxuICAgICAgICAgIHNldHRpbmdzID0gdGFicy5kYXRhKHRoaXMuYXR0cl9uYW1lKHRydWUpICsgJy1pbml0JyksXG4gICAgICAgICAgaW50ZXJwcmV0X2tleXVwX2FjdGlvbiA9IGZ1bmN0aW9uIChlKSB7XG4gICAgICAgICAgICAvLyBMaWdodCBtb2RpZmljYXRpb24gb2YgSGV5ZG9uIFBpY2tlcmluZydzIFByYWN0aWNhbCBBUklBIEV4YW1wbGVzOiBodHRwOi8vaGV5ZG9ud29ya3MuY29tL3ByYWN0aWNhbF9hcmlhX2V4YW1wbGVzL2pzL2ExMXkuanNcblxuICAgICAgICAgICAgLy8gZGVmaW5lIGN1cnJlbnQsIHByZXZpb3VzIGFuZCBuZXh0IChwb3NzaWJsZSkgdGFic1xuXG4gICAgICAgICAgICB2YXIgJG9yaWdpbmFsID0gJCh0aGlzKTtcbiAgICAgICAgICAgIHZhciAkcHJldiA9ICQodGhpcykucGFyZW50cygnbGknKS5wcmV2KCkuY2hpbGRyZW4oJ1tyb2xlPVwidGFiXCJdJyk7XG4gICAgICAgICAgICB2YXIgJG5leHQgPSAkKHRoaXMpLnBhcmVudHMoJ2xpJykubmV4dCgpLmNoaWxkcmVuKCdbcm9sZT1cInRhYlwiXScpO1xuICAgICAgICAgICAgdmFyICR0YXJnZXQ7XG5cbiAgICAgICAgICAgIC8vIGZpbmQgdGhlIGRpcmVjdGlvbiAocHJldiBvciBuZXh0KVxuXG4gICAgICAgICAgICBzd2l0Y2ggKGUua2V5Q29kZSkge1xuICAgICAgICAgICAgICBjYXNlIDM3OlxuICAgICAgICAgICAgICAgICR0YXJnZXQgPSAkcHJldjtcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgY2FzZSAzOTpcbiAgICAgICAgICAgICAgICAkdGFyZ2V0ID0gJG5leHQ7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgIGRlZmF1bHQ6XG4gICAgICAgICAgICAgICAgJHRhcmdldCA9IGZhbHNlXG4gICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgaWYgKCR0YXJnZXQubGVuZ3RoKSB7XG4gICAgICAgICAgICAgICRvcmlnaW5hbC5hdHRyKHtcbiAgICAgICAgICAgICAgICAndGFiaW5kZXgnIDogJy0xJyxcbiAgICAgICAgICAgICAgICAnYXJpYS1zZWxlY3RlZCcgOiBudWxsXG4gICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAkdGFyZ2V0LmF0dHIoe1xuICAgICAgICAgICAgICAgICd0YWJpbmRleCcgOiAnMCcsXG4gICAgICAgICAgICAgICAgJ2FyaWEtc2VsZWN0ZWQnIDogdHJ1ZVxuICAgICAgICAgICAgICB9KS5mb2N1cygpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAvLyBIaWRlIHBhbmVsc1xuXG4gICAgICAgICAgICAkKCdbcm9sZT1cInRhYnBhbmVsXCJdJylcbiAgICAgICAgICAgICAgLmF0dHIoJ2FyaWEtaGlkZGVuJywgJ3RydWUnKTtcblxuICAgICAgICAgICAgLy8gU2hvdyBwYW5lbCB3aGljaCBjb3JyZXNwb25kcyB0byB0YXJnZXRcblxuICAgICAgICAgICAgJCgnIycgKyAkKGRvY3VtZW50LmFjdGl2ZUVsZW1lbnQpLmF0dHIoJ2hyZWYnKS5zdWJzdHJpbmcoMSkpXG4gICAgICAgICAgICAgIC5hdHRyKCdhcmlhLWhpZGRlbicsIG51bGwpO1xuXG4gICAgICAgICAgfSxcbiAgICAgICAgICBnb190b19oYXNoID0gZnVuY3Rpb24oaGFzaCkge1xuICAgICAgICAgICAgLy8gVGhpcyBmdW5jdGlvbiBhbGxvd3MgY29ycmVjdCBiZWhhdmlvdXIgb2YgdGhlIGJyb3dzZXIncyBiYWNrIGJ1dHRvbiB3aGVuIGRlZXAgbGlua2luZyBpcyBlbmFibGVkLiBXaXRob3V0IGl0XG4gICAgICAgICAgICAvLyB0aGUgdXNlciB3b3VsZCBnZXQgY29udGludWFsbHkgcmVkaXJlY3RlZCB0byB0aGUgZGVmYXVsdCBoYXNoLlxuICAgICAgICAgICAgdmFyIGlzX2VudHJ5X2xvY2F0aW9uID0gd2luZG93LmxvY2F0aW9uLmhyZWYgPT09IHNlbGYuZW50cnlfbG9jYXRpb24sXG4gICAgICAgICAgICAgICAgZGVmYXVsdF9oYXNoID0gc2V0dGluZ3Muc2Nyb2xsX3RvX2NvbnRlbnQgPyBzZWxmLmRlZmF1bHRfdGFiX2hhc2hlc1swXSA6IGlzX2VudHJ5X2xvY2F0aW9uID8gd2luZG93LmxvY2F0aW9uLmhhc2ggOidmbmR0bi0nICsgc2VsZi5kZWZhdWx0X3RhYl9oYXNoZXNbMF0ucmVwbGFjZSgnIycsICcnKVxuXG4gICAgICAgICAgICBpZiAoIShpc19lbnRyeV9sb2NhdGlvbiAmJiBoYXNoID09PSBkZWZhdWx0X2hhc2gpKSB7XG4gICAgICAgICAgICAgIHdpbmRvdy5sb2NhdGlvbi5oYXNoID0gaGFzaDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9O1xuXG4gICAgICAvLyBhbGxvdyB1c2FnZSBvZiBkYXRhLXRhYi1jb250ZW50IGF0dHJpYnV0ZSBpbnN0ZWFkIG9mIGhyZWZcbiAgICAgIGlmIChhbmNob3IuZGF0YSgndGFiLWNvbnRlbnQnKSkge1xuICAgICAgICB0YXJnZXRfaGFzaCA9ICcjJyArIGFuY2hvci5kYXRhKCd0YWItY29udGVudCcpLnNwbGl0KCcjJylbMV07XG4gICAgICAgIHRhcmdldCA9IFModGFyZ2V0X2hhc2gpO1xuICAgICAgfVxuXG4gICAgICBpZiAoc2V0dGluZ3MuZGVlcF9saW5raW5nKSB7XG5cbiAgICAgICAgaWYgKHNldHRpbmdzLnNjcm9sbF90b19jb250ZW50KSB7XG5cbiAgICAgICAgICAvLyByZXRhaW4gY3VycmVudCBoYXNoIHRvIHNjcm9sbCB0byBjb250ZW50XG4gICAgICAgICAgZ29fdG9faGFzaChsb2NhdGlvbl9oYXNoIHx8IHRhcmdldF9oYXNoKTtcblxuICAgICAgICAgIGlmIChsb2NhdGlvbl9oYXNoID09IHVuZGVmaW5lZCB8fCBsb2NhdGlvbl9oYXNoID09IHRhcmdldF9oYXNoKSB7XG4gICAgICAgICAgICB0YWIucGFyZW50KClbMF0uc2Nyb2xsSW50b1ZpZXcoKTtcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgUyh0YXJnZXRfaGFzaClbMF0uc2Nyb2xsSW50b1ZpZXcoKTtcbiAgICAgICAgICB9XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgLy8gcHJlZml4IHRoZSBoYXNoZXMgc28gdGhhdCB0aGUgYnJvd3NlciBkb2Vzbid0IHNjcm9sbCBkb3duXG4gICAgICAgICAgaWYgKGxvY2F0aW9uX2hhc2ggIT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICBnb190b19oYXNoKCdmbmR0bi0nICsgbG9jYXRpb25faGFzaC5yZXBsYWNlKCcjJywgJycpKTtcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgZ29fdG9faGFzaCgnZm5kdG4tJyArIHRhcmdldF9oYXNoLnJlcGxhY2UoJyMnLCAnJykpO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICAvLyBXQVJOSU5HOiBUaGUgYWN0aXZhdGlvbiBhbmQgZGVhY3RpdmF0aW9uIG9mIHRoZSB0YWIgY29udGVudCBtdXN0XG4gICAgICAvLyBvY2N1ciBhZnRlciB0aGUgZGVlcCBsaW5raW5nIGluIG9yZGVyIHRvIHByb3Blcmx5IHJlZnJlc2ggdGhlIGJyb3dzZXJcbiAgICAgIC8vIHdpbmRvdyAobm90YWJseSBpbiBDaHJvbWUpLlxuICAgICAgLy8gQ2xlYW4gdXAgbXVsdGlwbGUgYXR0ciBpbnN0YW5jZXMgdG8gZG9uZSBvbmNlXG4gICAgICB0YWIuYWRkQ2xhc3Moc2V0dGluZ3MuYWN0aXZlX2NsYXNzKS50cmlnZ2VySGFuZGxlcignb3BlbmVkJyk7XG4gICAgICB0YWJfbGluay5hdHRyKHsnYXJpYS1zZWxlY3RlZCcgOiAndHJ1ZScsICB0YWJpbmRleCA6IDB9KTtcbiAgICAgIHNpYmxpbmdzLnJlbW92ZUNsYXNzKHNldHRpbmdzLmFjdGl2ZV9jbGFzcylcbiAgICAgIHNpYmxpbmdzLmZpbmQoJ2EnKS5hdHRyKHsnYXJpYS1zZWxlY3RlZCcgOiAnZmFsc2UnLCAgdGFiaW5kZXggOiAtMX0pO1xuICAgICAgdGFyZ2V0LnNpYmxpbmdzKCkucmVtb3ZlQ2xhc3Moc2V0dGluZ3MuYWN0aXZlX2NsYXNzKS5hdHRyKHsnYXJpYS1oaWRkZW4nIDogJ3RydWUnLCAgdGFiaW5kZXggOiAtMX0pO1xuICAgICAgdGFyZ2V0LmFkZENsYXNzKHNldHRpbmdzLmFjdGl2ZV9jbGFzcykuYXR0cignYXJpYS1oaWRkZW4nLCAnZmFsc2UnKS5yZW1vdmVBdHRyKCd0YWJpbmRleCcpO1xuICAgICAgc2V0dGluZ3MuY2FsbGJhY2sodGFiKTtcbiAgICAgIHRhcmdldC50cmlnZ2VySGFuZGxlcigndG9nZ2xlZCcsIFt0YXJnZXRdKTtcbiAgICAgIHRhYnMudHJpZ2dlckhhbmRsZXIoJ3RvZ2dsZWQnLCBbdGFiXSk7XG5cbiAgICAgIHRhYl9saW5rLm9mZigna2V5ZG93bicpLm9uKCdrZXlkb3duJywgaW50ZXJwcmV0X2tleXVwX2FjdGlvbiApO1xuICAgIH0sXG5cbiAgICBkYXRhX2F0dHIgOiBmdW5jdGlvbiAoc3RyKSB7XG4gICAgICBpZiAodGhpcy5uYW1lc3BhY2UubGVuZ3RoID4gMCkge1xuICAgICAgICByZXR1cm4gdGhpcy5uYW1lc3BhY2UgKyAnLScgKyBzdHI7XG4gICAgICB9XG5cbiAgICAgIHJldHVybiBzdHI7XG4gICAgfSxcblxuICAgIG9mZiA6IGZ1bmN0aW9uICgpIHt9LFxuXG4gICAgcmVmbG93IDogZnVuY3Rpb24gKCkge31cbiAgfTtcbn0oalF1ZXJ5LCB3aW5kb3csIHdpbmRvdy5kb2N1bWVudCkpO1xuIl0sImZpbGUiOiJmb3VuZGF0aW9uL2pzL2ZvdW5kYXRpb24vZm91bmRhdGlvbi50YWIuanMiLCJzb3VyY2VSb290IjoiL3NvdXJjZS8ifQ==