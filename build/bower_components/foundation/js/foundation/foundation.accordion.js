;(function ($, window, document, undefined) {
  'use strict';

  Foundation.libs.accordion = {
    name : 'accordion',

    version : '5.5.2',

    settings : {
      content_class : 'content',
      active_class : 'active',
      multi_expand : false,
      toggleable : true,
      callback : function () {}
    },

    init : function (scope, method, options) {
      this.bindings(method, options);
    },

    events : function (instance) {
      var self = this;
      var S = this.S;
      self.create(this.S(instance));

      S(this.scope)
      .off('.fndtn.accordion')
      .on('click.fndtn.accordion', '[' + this.attr_name() + '] > dd > a, [' + this.attr_name() + '] > li > a', function (e) {
        var accordion = S(this).closest('[' + self.attr_name() + ']'),
            groupSelector = self.attr_name() + '=' + accordion.attr(self.attr_name()),
            settings = accordion.data(self.attr_name(true) + '-init') || self.settings,
            target = S('#' + this.href.split('#')[1]),
            aunts = $('> dd, > li', accordion),
            siblings = aunts.children('.' + settings.content_class),
            active_content = siblings.filter('.' + settings.active_class);

        e.preventDefault();

        if (accordion.attr(self.attr_name())) {
          siblings = siblings.add('[' + groupSelector + '] dd > ' + '.' + settings.content_class + ', [' + groupSelector + '] li > ' + '.' + settings.content_class);
          aunts = aunts.add('[' + groupSelector + '] dd, [' + groupSelector + '] li');
        }

        if (settings.toggleable && target.is(active_content)) {
          target.parent('dd, li').toggleClass(settings.active_class, false);
          target.toggleClass(settings.active_class, false);
          S(this).attr('aria-expanded', function(i, attr){
              return attr === 'true' ? 'false' : 'true';
          });
          settings.callback(target);
          target.triggerHandler('toggled', [accordion]);
          accordion.triggerHandler('toggled', [target]);
          return;
        }

        if (!settings.multi_expand) {
          siblings.removeClass(settings.active_class);
          aunts.removeClass(settings.active_class);
          aunts.children('a').attr('aria-expanded','false');
        }

        target.addClass(settings.active_class).parent().addClass(settings.active_class);
        settings.callback(target);
        target.triggerHandler('toggled', [accordion]);
        accordion.triggerHandler('toggled', [target]);
        S(this).attr('aria-expanded','true');
      });
    },

    create: function($instance) {
      var self = this,
          accordion = $instance,
          aunts = $('> .accordion-navigation', accordion),
          settings = accordion.data(self.attr_name(true) + '-init') || self.settings;

      aunts.children('a').attr('aria-expanded','false');
      aunts.has('.' + settings.content_class + '.' + settings.active_class).children('a').attr('aria-expanded','true');

      if (settings.multi_expand) {
        $instance.attr('aria-multiselectable','true');
      }
    },

    off : function () {},

    reflow : function () {}
  };
}(jQuery, window, window.document));

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiIiwic291cmNlcyI6WyJmb3VuZGF0aW9uL2pzL2ZvdW5kYXRpb24vZm91bmRhdGlvbi5hY2NvcmRpb24uanMiXSwic291cmNlc0NvbnRlbnQiOlsiOyhmdW5jdGlvbiAoJCwgd2luZG93LCBkb2N1bWVudCwgdW5kZWZpbmVkKSB7XG4gICd1c2Ugc3RyaWN0JztcblxuICBGb3VuZGF0aW9uLmxpYnMuYWNjb3JkaW9uID0ge1xuICAgIG5hbWUgOiAnYWNjb3JkaW9uJyxcblxuICAgIHZlcnNpb24gOiAnNS41LjInLFxuXG4gICAgc2V0dGluZ3MgOiB7XG4gICAgICBjb250ZW50X2NsYXNzIDogJ2NvbnRlbnQnLFxuICAgICAgYWN0aXZlX2NsYXNzIDogJ2FjdGl2ZScsXG4gICAgICBtdWx0aV9leHBhbmQgOiBmYWxzZSxcbiAgICAgIHRvZ2dsZWFibGUgOiB0cnVlLFxuICAgICAgY2FsbGJhY2sgOiBmdW5jdGlvbiAoKSB7fVxuICAgIH0sXG5cbiAgICBpbml0IDogZnVuY3Rpb24gKHNjb3BlLCBtZXRob2QsIG9wdGlvbnMpIHtcbiAgICAgIHRoaXMuYmluZGluZ3MobWV0aG9kLCBvcHRpb25zKTtcbiAgICB9LFxuXG4gICAgZXZlbnRzIDogZnVuY3Rpb24gKGluc3RhbmNlKSB7XG4gICAgICB2YXIgc2VsZiA9IHRoaXM7XG4gICAgICB2YXIgUyA9IHRoaXMuUztcbiAgICAgIHNlbGYuY3JlYXRlKHRoaXMuUyhpbnN0YW5jZSkpO1xuXG4gICAgICBTKHRoaXMuc2NvcGUpXG4gICAgICAub2ZmKCcuZm5kdG4uYWNjb3JkaW9uJylcbiAgICAgIC5vbignY2xpY2suZm5kdG4uYWNjb3JkaW9uJywgJ1snICsgdGhpcy5hdHRyX25hbWUoKSArICddID4gZGQgPiBhLCBbJyArIHRoaXMuYXR0cl9uYW1lKCkgKyAnXSA+IGxpID4gYScsIGZ1bmN0aW9uIChlKSB7XG4gICAgICAgIHZhciBhY2NvcmRpb24gPSBTKHRoaXMpLmNsb3Nlc3QoJ1snICsgc2VsZi5hdHRyX25hbWUoKSArICddJyksXG4gICAgICAgICAgICBncm91cFNlbGVjdG9yID0gc2VsZi5hdHRyX25hbWUoKSArICc9JyArIGFjY29yZGlvbi5hdHRyKHNlbGYuYXR0cl9uYW1lKCkpLFxuICAgICAgICAgICAgc2V0dGluZ3MgPSBhY2NvcmRpb24uZGF0YShzZWxmLmF0dHJfbmFtZSh0cnVlKSArICctaW5pdCcpIHx8IHNlbGYuc2V0dGluZ3MsXG4gICAgICAgICAgICB0YXJnZXQgPSBTKCcjJyArIHRoaXMuaHJlZi5zcGxpdCgnIycpWzFdKSxcbiAgICAgICAgICAgIGF1bnRzID0gJCgnPiBkZCwgPiBsaScsIGFjY29yZGlvbiksXG4gICAgICAgICAgICBzaWJsaW5ncyA9IGF1bnRzLmNoaWxkcmVuKCcuJyArIHNldHRpbmdzLmNvbnRlbnRfY2xhc3MpLFxuICAgICAgICAgICAgYWN0aXZlX2NvbnRlbnQgPSBzaWJsaW5ncy5maWx0ZXIoJy4nICsgc2V0dGluZ3MuYWN0aXZlX2NsYXNzKTtcblxuICAgICAgICBlLnByZXZlbnREZWZhdWx0KCk7XG5cbiAgICAgICAgaWYgKGFjY29yZGlvbi5hdHRyKHNlbGYuYXR0cl9uYW1lKCkpKSB7XG4gICAgICAgICAgc2libGluZ3MgPSBzaWJsaW5ncy5hZGQoJ1snICsgZ3JvdXBTZWxlY3RvciArICddIGRkID4gJyArICcuJyArIHNldHRpbmdzLmNvbnRlbnRfY2xhc3MgKyAnLCBbJyArIGdyb3VwU2VsZWN0b3IgKyAnXSBsaSA+ICcgKyAnLicgKyBzZXR0aW5ncy5jb250ZW50X2NsYXNzKTtcbiAgICAgICAgICBhdW50cyA9IGF1bnRzLmFkZCgnWycgKyBncm91cFNlbGVjdG9yICsgJ10gZGQsIFsnICsgZ3JvdXBTZWxlY3RvciArICddIGxpJyk7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoc2V0dGluZ3MudG9nZ2xlYWJsZSAmJiB0YXJnZXQuaXMoYWN0aXZlX2NvbnRlbnQpKSB7XG4gICAgICAgICAgdGFyZ2V0LnBhcmVudCgnZGQsIGxpJykudG9nZ2xlQ2xhc3Moc2V0dGluZ3MuYWN0aXZlX2NsYXNzLCBmYWxzZSk7XG4gICAgICAgICAgdGFyZ2V0LnRvZ2dsZUNsYXNzKHNldHRpbmdzLmFjdGl2ZV9jbGFzcywgZmFsc2UpO1xuICAgICAgICAgIFModGhpcykuYXR0cignYXJpYS1leHBhbmRlZCcsIGZ1bmN0aW9uKGksIGF0dHIpe1xuICAgICAgICAgICAgICByZXR1cm4gYXR0ciA9PT0gJ3RydWUnID8gJ2ZhbHNlJyA6ICd0cnVlJztcbiAgICAgICAgICB9KTtcbiAgICAgICAgICBzZXR0aW5ncy5jYWxsYmFjayh0YXJnZXQpO1xuICAgICAgICAgIHRhcmdldC50cmlnZ2VySGFuZGxlcigndG9nZ2xlZCcsIFthY2NvcmRpb25dKTtcbiAgICAgICAgICBhY2NvcmRpb24udHJpZ2dlckhhbmRsZXIoJ3RvZ2dsZWQnLCBbdGFyZ2V0XSk7XG4gICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKCFzZXR0aW5ncy5tdWx0aV9leHBhbmQpIHtcbiAgICAgICAgICBzaWJsaW5ncy5yZW1vdmVDbGFzcyhzZXR0aW5ncy5hY3RpdmVfY2xhc3MpO1xuICAgICAgICAgIGF1bnRzLnJlbW92ZUNsYXNzKHNldHRpbmdzLmFjdGl2ZV9jbGFzcyk7XG4gICAgICAgICAgYXVudHMuY2hpbGRyZW4oJ2EnKS5hdHRyKCdhcmlhLWV4cGFuZGVkJywnZmFsc2UnKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHRhcmdldC5hZGRDbGFzcyhzZXR0aW5ncy5hY3RpdmVfY2xhc3MpLnBhcmVudCgpLmFkZENsYXNzKHNldHRpbmdzLmFjdGl2ZV9jbGFzcyk7XG4gICAgICAgIHNldHRpbmdzLmNhbGxiYWNrKHRhcmdldCk7XG4gICAgICAgIHRhcmdldC50cmlnZ2VySGFuZGxlcigndG9nZ2xlZCcsIFthY2NvcmRpb25dKTtcbiAgICAgICAgYWNjb3JkaW9uLnRyaWdnZXJIYW5kbGVyKCd0b2dnbGVkJywgW3RhcmdldF0pO1xuICAgICAgICBTKHRoaXMpLmF0dHIoJ2FyaWEtZXhwYW5kZWQnLCd0cnVlJyk7XG4gICAgICB9KTtcbiAgICB9LFxuXG4gICAgY3JlYXRlOiBmdW5jdGlvbigkaW5zdGFuY2UpIHtcbiAgICAgIHZhciBzZWxmID0gdGhpcyxcbiAgICAgICAgICBhY2NvcmRpb24gPSAkaW5zdGFuY2UsXG4gICAgICAgICAgYXVudHMgPSAkKCc+IC5hY2NvcmRpb24tbmF2aWdhdGlvbicsIGFjY29yZGlvbiksXG4gICAgICAgICAgc2V0dGluZ3MgPSBhY2NvcmRpb24uZGF0YShzZWxmLmF0dHJfbmFtZSh0cnVlKSArICctaW5pdCcpIHx8IHNlbGYuc2V0dGluZ3M7XG5cbiAgICAgIGF1bnRzLmNoaWxkcmVuKCdhJykuYXR0cignYXJpYS1leHBhbmRlZCcsJ2ZhbHNlJyk7XG4gICAgICBhdW50cy5oYXMoJy4nICsgc2V0dGluZ3MuY29udGVudF9jbGFzcyArICcuJyArIHNldHRpbmdzLmFjdGl2ZV9jbGFzcykuY2hpbGRyZW4oJ2EnKS5hdHRyKCdhcmlhLWV4cGFuZGVkJywndHJ1ZScpO1xuXG4gICAgICBpZiAoc2V0dGluZ3MubXVsdGlfZXhwYW5kKSB7XG4gICAgICAgICRpbnN0YW5jZS5hdHRyKCdhcmlhLW11bHRpc2VsZWN0YWJsZScsJ3RydWUnKTtcbiAgICAgIH1cbiAgICB9LFxuXG4gICAgb2ZmIDogZnVuY3Rpb24gKCkge30sXG5cbiAgICByZWZsb3cgOiBmdW5jdGlvbiAoKSB7fVxuICB9O1xufShqUXVlcnksIHdpbmRvdywgd2luZG93LmRvY3VtZW50KSk7XG4iXSwiZmlsZSI6ImZvdW5kYXRpb24vanMvZm91bmRhdGlvbi9mb3VuZGF0aW9uLmFjY29yZGlvbi5qcyIsInNvdXJjZVJvb3QiOiIvc291cmNlLyJ9