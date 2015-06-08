;(function ($, window, document, undefined) {
  'use strict';

  Foundation.libs.alert = {
    name : 'alert',

    version : '5.5.2',

    settings : {
      callback : function () {}
    },

    init : function (scope, method, options) {
      this.bindings(method, options);
    },

    events : function () {
      var self = this,
          S = this.S;

      $(this.scope).off('.alert').on('click.fndtn.alert', '[' + this.attr_name() + '] .close', function (e) {
        var alertBox = S(this).closest('[' + self.attr_name() + ']'),
            settings = alertBox.data(self.attr_name(true) + '-init') || self.settings;

        e.preventDefault();
        if (Modernizr.csstransitions) {
          alertBox.addClass('alert-close');
          alertBox.on('transitionend webkitTransitionEnd oTransitionEnd', function (e) {
            S(this).trigger('close.fndtn.alert').remove();
            settings.callback();
          });
        } else {
          alertBox.fadeOut(300, function () {
            S(this).trigger('close.fndtn.alert').remove();
            settings.callback();
          });
        }
      });
    },

    reflow : function () {}
  };
}(jQuery, window, window.document));

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiIiwic291cmNlcyI6WyJmb3VuZGF0aW9uL2pzL2ZvdW5kYXRpb24vZm91bmRhdGlvbi5hbGVydC5qcyJdLCJzb3VyY2VzQ29udGVudCI6WyI7KGZ1bmN0aW9uICgkLCB3aW5kb3csIGRvY3VtZW50LCB1bmRlZmluZWQpIHtcbiAgJ3VzZSBzdHJpY3QnO1xuXG4gIEZvdW5kYXRpb24ubGlicy5hbGVydCA9IHtcbiAgICBuYW1lIDogJ2FsZXJ0JyxcblxuICAgIHZlcnNpb24gOiAnNS41LjInLFxuXG4gICAgc2V0dGluZ3MgOiB7XG4gICAgICBjYWxsYmFjayA6IGZ1bmN0aW9uICgpIHt9XG4gICAgfSxcblxuICAgIGluaXQgOiBmdW5jdGlvbiAoc2NvcGUsIG1ldGhvZCwgb3B0aW9ucykge1xuICAgICAgdGhpcy5iaW5kaW5ncyhtZXRob2QsIG9wdGlvbnMpO1xuICAgIH0sXG5cbiAgICBldmVudHMgOiBmdW5jdGlvbiAoKSB7XG4gICAgICB2YXIgc2VsZiA9IHRoaXMsXG4gICAgICAgICAgUyA9IHRoaXMuUztcblxuICAgICAgJCh0aGlzLnNjb3BlKS5vZmYoJy5hbGVydCcpLm9uKCdjbGljay5mbmR0bi5hbGVydCcsICdbJyArIHRoaXMuYXR0cl9uYW1lKCkgKyAnXSAuY2xvc2UnLCBmdW5jdGlvbiAoZSkge1xuICAgICAgICB2YXIgYWxlcnRCb3ggPSBTKHRoaXMpLmNsb3Nlc3QoJ1snICsgc2VsZi5hdHRyX25hbWUoKSArICddJyksXG4gICAgICAgICAgICBzZXR0aW5ncyA9IGFsZXJ0Qm94LmRhdGEoc2VsZi5hdHRyX25hbWUodHJ1ZSkgKyAnLWluaXQnKSB8fCBzZWxmLnNldHRpbmdzO1xuXG4gICAgICAgIGUucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgaWYgKE1vZGVybml6ci5jc3N0cmFuc2l0aW9ucykge1xuICAgICAgICAgIGFsZXJ0Qm94LmFkZENsYXNzKCdhbGVydC1jbG9zZScpO1xuICAgICAgICAgIGFsZXJ0Qm94Lm9uKCd0cmFuc2l0aW9uZW5kIHdlYmtpdFRyYW5zaXRpb25FbmQgb1RyYW5zaXRpb25FbmQnLCBmdW5jdGlvbiAoZSkge1xuICAgICAgICAgICAgUyh0aGlzKS50cmlnZ2VyKCdjbG9zZS5mbmR0bi5hbGVydCcpLnJlbW92ZSgpO1xuICAgICAgICAgICAgc2V0dGluZ3MuY2FsbGJhY2soKTtcbiAgICAgICAgICB9KTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBhbGVydEJveC5mYWRlT3V0KDMwMCwgZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgUyh0aGlzKS50cmlnZ2VyKCdjbG9zZS5mbmR0bi5hbGVydCcpLnJlbW92ZSgpO1xuICAgICAgICAgICAgc2V0dGluZ3MuY2FsbGJhY2soKTtcbiAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgfSxcblxuICAgIHJlZmxvdyA6IGZ1bmN0aW9uICgpIHt9XG4gIH07XG59KGpRdWVyeSwgd2luZG93LCB3aW5kb3cuZG9jdW1lbnQpKTtcbiJdLCJmaWxlIjoiZm91bmRhdGlvbi9qcy9mb3VuZGF0aW9uL2ZvdW5kYXRpb24uYWxlcnQuanMiLCJzb3VyY2VSb290IjoiL3NvdXJjZS8ifQ==