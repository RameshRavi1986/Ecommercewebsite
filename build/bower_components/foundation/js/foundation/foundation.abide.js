;(function ($, window, document, undefined) {
  'use strict';

  Foundation.libs.abide = {
    name : 'abide',

    version : '5.5.2',

    settings : {
      live_validate : true,
      validate_on_blur : true,
      // validate_on: 'tab', // tab (when user tabs between fields), change (input changes), manual (call custom events) 
      focus_on_invalid : true,
      error_labels : true, // labels with a for="inputId" will recieve an `error` class
      error_class : 'error',
      timeout : 1000,
      patterns : {
        alpha : /^[a-zA-Z]+$/,
        alpha_numeric : /^[a-zA-Z0-9]+$/,
        integer : /^[-+]?\d+$/,
        number : /^[-+]?\d*(?:[\.\,]\d+)?$/,

        // amex, visa, diners
        card : /^(?:4[0-9]{12}(?:[0-9]{3})?|5[1-5][0-9]{14}|6(?:011|5[0-9][0-9])[0-9]{12}|3[47][0-9]{13}|3(?:0[0-5]|[68][0-9])[0-9]{11}|(?:2131|1800|35\d{3})\d{11})$/,
        cvv : /^([0-9]){3,4}$/,

        // http://www.whatwg.org/specs/web-apps/current-work/multipage/states-of-the-type-attribute.html#valid-e-mail-address
        email : /^[a-zA-Z0-9.!#$%&'*+\/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+$/,

        // http://blogs.lse.ac.uk/lti/2008/04/23/a-regular-expression-to-match-any-url/
        url: /^(https?|ftp|file|ssh):\/\/([-;:&=\+\$,\w]+@{1})?([-A-Za-z0-9\.]+)+:?(\d+)?((\/[-\+~%\/\.\w]+)?\??([-\+=&;%@\.\w]+)?#?([\w]+)?)?/,
        // abc.de
        domain : /^([a-zA-Z0-9]([a-zA-Z0-9\-]{0,61}[a-zA-Z0-9])?\.)+[a-zA-Z]{2,8}$/,

        datetime : /^([0-2][0-9]{3})\-([0-1][0-9])\-([0-3][0-9])T([0-5][0-9])\:([0-5][0-9])\:([0-5][0-9])(Z|([\-\+]([0-1][0-9])\:00))$/,
        // YYYY-MM-DD
        date : /(?:19|20)[0-9]{2}-(?:(?:0[1-9]|1[0-2])-(?:0[1-9]|1[0-9]|2[0-9])|(?:(?!02)(?:0[1-9]|1[0-2])-(?:30))|(?:(?:0[13578]|1[02])-31))$/,
        // HH:MM:SS
        time : /^(0[0-9]|1[0-9]|2[0-3])(:[0-5][0-9]){2}$/,
        dateISO : /^\d{4}[\/\-]\d{1,2}[\/\-]\d{1,2}$/,
        // MM/DD/YYYY
        month_day_year : /^(0[1-9]|1[012])[- \/.](0[1-9]|[12][0-9]|3[01])[- \/.]\d{4}$/,
        // DD/MM/YYYY
        day_month_year : /^(0[1-9]|[12][0-9]|3[01])[- \/.](0[1-9]|1[012])[- \/.]\d{4}$/,

        // #FFF or #FFFFFF
        color : /^#?([a-fA-F0-9]{6}|[a-fA-F0-9]{3})$/
      },
      validators : {
        equalTo : function (el, required, parent) {
          var from  = document.getElementById(el.getAttribute(this.add_namespace('data-equalto'))).value,
              to    = el.value,
              valid = (from === to);

          return valid;
        }
      }
    },

    timer : null,

    init : function (scope, method, options) {
      this.bindings(method, options);
    },

    events : function (scope) {
      var self = this,
          form = self.S(scope).attr('novalidate', 'novalidate'),
          settings = form.data(this.attr_name(true) + '-init') || {};

      this.invalid_attr = this.add_namespace('data-invalid');

      function validate(originalSelf, e) {
        clearTimeout(self.timer);
        self.timer = setTimeout(function () {
          self.validate([originalSelf], e);
        }.bind(originalSelf), settings.timeout);
      }


      form
        .off('.abide')
        .on('submit.fndtn.abide', function (e) {
          var is_ajax = /ajax/i.test(self.S(this).attr(self.attr_name()));
          return self.validate(self.S(this).find('input, textarea, select').not(":hidden, [data-abide-ignore]").get(), e, is_ajax);
        })
        .on('validate.fndtn.abide', function (e) {
          if (settings.validate_on === 'manual') {
            self.validate([e.target], e);
          }
        })
        .on('reset', function (e) {
          return self.reset($(this), e);          
        })
        .find('input, textarea, select').not(":hidden, [data-abide-ignore]")
          .off('.abide')
          .on('blur.fndtn.abide change.fndtn.abide', function (e) {
            // old settings fallback
            // will be deprecated with F6 release
            if (settings.validate_on_blur && settings.validate_on_blur === true) {
              validate(this, e);
            }
            // new settings combining validate options into one setting
            if (settings.validate_on === 'change') {
              validate(this, e);
            }
          })
          .on('keydown.fndtn.abide', function (e) {
            // old settings fallback
            // will be deprecated with F6 release
            if (settings.live_validate && settings.live_validate === true && e.which != 9) {
              validate(this, e);
            }
            // new settings combining validate options into one setting
            if (settings.validate_on === 'tab' && e.which === 9) {
              validate(this, e);
            }
            else if (settings.validate_on === 'change') {
              validate(this, e);
            }
          })
          .on('focus', function (e) {
            if (navigator.userAgent.match(/iPad|iPhone|Android|BlackBerry|Windows Phone|webOS/i)) {
              $('html, body').animate({
                  scrollTop: $(e.target).offset().top
              }, 100);
            } 
          });
    },

    reset : function (form, e) {
      var self = this;
      form.removeAttr(self.invalid_attr);

      $('[' + self.invalid_attr + ']', form).removeAttr(self.invalid_attr);
      $('.' + self.settings.error_class, form).not('small').removeClass(self.settings.error_class);
      $(':input', form).not(':button, :submit, :reset, :hidden, [data-abide-ignore]').val('').removeAttr(self.invalid_attr);
    },

    validate : function (els, e, is_ajax) {
      var validations = this.parse_patterns(els),
          validation_count = validations.length,
          form = this.S(els[0]).closest('form'),
          submit_event = /submit/.test(e.type);

      // Has to count up to make sure the focus gets applied to the top error
      for (var i = 0; i < validation_count; i++) {
        if (!validations[i] && (submit_event || is_ajax)) {
          if (this.settings.focus_on_invalid) {
            els[i].focus();
          }
          form.trigger('invalid.fndtn.abide');
          this.S(els[i]).closest('form').attr(this.invalid_attr, '');
          return false;
        }
      }

      if (submit_event || is_ajax) {
        form.trigger('valid.fndtn.abide');
      }

      form.removeAttr(this.invalid_attr);

      if (is_ajax) {
        return false;
      }

      return true;
    },

    parse_patterns : function (els) {
      var i = els.length,
          el_patterns = [];

      while (i--) {
        el_patterns.push(this.pattern(els[i]));
      }

      return this.check_validation_and_apply_styles(el_patterns);
    },

    pattern : function (el) {
      var type = el.getAttribute('type'),
          required = typeof el.getAttribute('required') === 'string';

      var pattern = el.getAttribute('pattern') || '';

      if (this.settings.patterns.hasOwnProperty(pattern) && pattern.length > 0) {
        return [el, this.settings.patterns[pattern], required];
      } else if (pattern.length > 0) {
        return [el, new RegExp(pattern), required];
      }

      if (this.settings.patterns.hasOwnProperty(type)) {
        return [el, this.settings.patterns[type], required];
      }

      pattern = /.*/;

      return [el, pattern, required];
    },

    // TODO: Break this up into smaller methods, getting hard to read.
    check_validation_and_apply_styles : function (el_patterns) {
      var i = el_patterns.length,
          validations = [],
          form = this.S(el_patterns[0][0]).closest('[data-' + this.attr_name(true) + ']'),
          settings = form.data(this.attr_name(true) + '-init') || {};
      while (i--) {
        var el = el_patterns[i][0],
            required = el_patterns[i][2],
            value = el.value.trim(),
            direct_parent = this.S(el).parent(),
            validator = el.getAttribute(this.add_namespace('data-abide-validator')),
            is_radio = el.type === 'radio',
            is_checkbox = el.type === 'checkbox',
            label = this.S('label[for="' + el.getAttribute('id') + '"]'),
            valid_length = (required) ? (el.value.length > 0) : true,
            el_validations = [];

        var parent, valid;

        // support old way to do equalTo validations
        if (el.getAttribute(this.add_namespace('data-equalto'))) { validator = 'equalTo' }

        if (!direct_parent.is('label')) {
          parent = direct_parent;
        } else {
          parent = direct_parent.parent();
        }

        if (is_radio && required) {
          el_validations.push(this.valid_radio(el, required));
        } else if (is_checkbox && required) {
          el_validations.push(this.valid_checkbox(el, required));

        } else if (validator) {
          // Validate using each of the specified (space-delimited) validators.
          var validators = validator.split(' ');
          var last_valid = true, all_valid = true;
          for (var iv = 0; iv < validators.length; iv++) {
              valid = this.settings.validators[validators[iv]].apply(this, [el, required, parent])
              el_validations.push(valid);
              all_valid = valid && last_valid;
              last_valid = valid;
          }
          if (all_valid) {
              this.S(el).removeAttr(this.invalid_attr);
              parent.removeClass('error');
              if (label.length > 0 && this.settings.error_labels) {
                label.removeClass(this.settings.error_class).removeAttr('role');
              }
              $(el).triggerHandler('valid');
          } else {
              this.S(el).attr(this.invalid_attr, '');
              parent.addClass('error');
              if (label.length > 0 && this.settings.error_labels) {
                label.addClass(this.settings.error_class).attr('role', 'alert');
              }
              $(el).triggerHandler('invalid');
          }
        } else {

          if (el_patterns[i][1].test(value) && valid_length ||
            !required && el.value.length < 1 || $(el).attr('disabled')) {
            el_validations.push(true);
          } else {
            el_validations.push(false);
          }

          el_validations = [el_validations.every(function (valid) {return valid;})];
          if (el_validations[0]) {
            this.S(el).removeAttr(this.invalid_attr);
            el.setAttribute('aria-invalid', 'false');
            el.removeAttribute('aria-describedby');
            parent.removeClass(this.settings.error_class);
            if (label.length > 0 && this.settings.error_labels) {
              label.removeClass(this.settings.error_class).removeAttr('role');
            }
            $(el).triggerHandler('valid');
          } else {
            this.S(el).attr(this.invalid_attr, '');
            el.setAttribute('aria-invalid', 'true');

            // Try to find the error associated with the input
            var errorElem = parent.find('small.' + this.settings.error_class, 'span.' + this.settings.error_class);
            var errorID = errorElem.length > 0 ? errorElem[0].id : '';
            if (errorID.length > 0) {
              el.setAttribute('aria-describedby', errorID);
            }

            // el.setAttribute('aria-describedby', $(el).find('.error')[0].id);
            parent.addClass(this.settings.error_class);
            if (label.length > 0 && this.settings.error_labels) {
              label.addClass(this.settings.error_class).attr('role', 'alert');
            }
            $(el).triggerHandler('invalid');
          }
        }
        validations = validations.concat(el_validations);
      }
      return validations;
    },

    valid_checkbox : function (el, required) {
      var el = this.S(el),
          valid = (el.is(':checked') || !required || el.get(0).getAttribute('disabled'));

      if (valid) {
        el.removeAttr(this.invalid_attr).parent().removeClass(this.settings.error_class);
        $(el).triggerHandler('valid');
      } else {
        el.attr(this.invalid_attr, '').parent().addClass(this.settings.error_class);
        $(el).triggerHandler('invalid');
      }

      return valid;
    },

    valid_radio : function (el, required) {
      var name = el.getAttribute('name'),
          group = this.S(el).closest('[data-' + this.attr_name(true) + ']').find("[name='" + name + "']"),
          count = group.length,
          valid = false,
          disabled = false;

      // Has to count up to make sure the focus gets applied to the top error
        for (var i=0; i < count; i++) {
            if( group[i].getAttribute('disabled') ){
                disabled=true;
                valid=true;
            } else {
                if (group[i].checked){
                    valid = true;
                } else {
                    if( disabled ){
                        valid = false;
                    }
                }
            }
        }

      // Has to count up to make sure the focus gets applied to the top error
      for (var i = 0; i < count; i++) {
        if (valid) {
          this.S(group[i]).removeAttr(this.invalid_attr).parent().removeClass(this.settings.error_class);
          $(group[i]).triggerHandler('valid');
        } else {
          this.S(group[i]).attr(this.invalid_attr, '').parent().addClass(this.settings.error_class);
          $(group[i]).triggerHandler('invalid');
        }
      }

      return valid;
    },

    valid_equal : function (el, required, parent) {
      var from  = document.getElementById(el.getAttribute(this.add_namespace('data-equalto'))).value,
          to    = el.value,
          valid = (from === to);

      if (valid) {
        this.S(el).removeAttr(this.invalid_attr);
        parent.removeClass(this.settings.error_class);
        if (label.length > 0 && settings.error_labels) {
          label.removeClass(this.settings.error_class);
        }
      } else {
        this.S(el).attr(this.invalid_attr, '');
        parent.addClass(this.settings.error_class);
        if (label.length > 0 && settings.error_labels) {
          label.addClass(this.settings.error_class);
        }
      }

      return valid;
    },

    valid_oneof : function (el, required, parent, doNotValidateOthers) {
      var el = this.S(el),
        others = this.S('[' + this.add_namespace('data-oneof') + ']'),
        valid = others.filter(':checked').length > 0;

      if (valid) {
        el.removeAttr(this.invalid_attr).parent().removeClass(this.settings.error_class);
      } else {
        el.attr(this.invalid_attr, '').parent().addClass(this.settings.error_class);
      }

      if (!doNotValidateOthers) {
        var _this = this;
        others.each(function () {
          _this.valid_oneof.call(_this, this, null, null, true);
        });
      }

      return valid;
    },

    reflow : function(scope, options) {
      var self = this,
          form = self.S('[' + this.attr_name() + ']').attr('novalidate', 'novalidate');
          self.S(form).each(function (idx, el) {
            self.events(el);
          });
    }
  };
}(jQuery, window, window.document));

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiIiwic291cmNlcyI6WyJmb3VuZGF0aW9uL2pzL2ZvdW5kYXRpb24vZm91bmRhdGlvbi5hYmlkZS5qcyJdLCJzb3VyY2VzQ29udGVudCI6WyI7KGZ1bmN0aW9uICgkLCB3aW5kb3csIGRvY3VtZW50LCB1bmRlZmluZWQpIHtcbiAgJ3VzZSBzdHJpY3QnO1xuXG4gIEZvdW5kYXRpb24ubGlicy5hYmlkZSA9IHtcbiAgICBuYW1lIDogJ2FiaWRlJyxcblxuICAgIHZlcnNpb24gOiAnNS41LjInLFxuXG4gICAgc2V0dGluZ3MgOiB7XG4gICAgICBsaXZlX3ZhbGlkYXRlIDogdHJ1ZSxcbiAgICAgIHZhbGlkYXRlX29uX2JsdXIgOiB0cnVlLFxuICAgICAgLy8gdmFsaWRhdGVfb246ICd0YWInLCAvLyB0YWIgKHdoZW4gdXNlciB0YWJzIGJldHdlZW4gZmllbGRzKSwgY2hhbmdlIChpbnB1dCBjaGFuZ2VzKSwgbWFudWFsIChjYWxsIGN1c3RvbSBldmVudHMpIFxuICAgICAgZm9jdXNfb25faW52YWxpZCA6IHRydWUsXG4gICAgICBlcnJvcl9sYWJlbHMgOiB0cnVlLCAvLyBsYWJlbHMgd2l0aCBhIGZvcj1cImlucHV0SWRcIiB3aWxsIHJlY2lldmUgYW4gYGVycm9yYCBjbGFzc1xuICAgICAgZXJyb3JfY2xhc3MgOiAnZXJyb3InLFxuICAgICAgdGltZW91dCA6IDEwMDAsXG4gICAgICBwYXR0ZXJucyA6IHtcbiAgICAgICAgYWxwaGEgOiAvXlthLXpBLVpdKyQvLFxuICAgICAgICBhbHBoYV9udW1lcmljIDogL15bYS16QS1aMC05XSskLyxcbiAgICAgICAgaW50ZWdlciA6IC9eWy0rXT9cXGQrJC8sXG4gICAgICAgIG51bWJlciA6IC9eWy0rXT9cXGQqKD86W1xcLlxcLF1cXGQrKT8kLyxcblxuICAgICAgICAvLyBhbWV4LCB2aXNhLCBkaW5lcnNcbiAgICAgICAgY2FyZCA6IC9eKD86NFswLTldezEyfSg/OlswLTldezN9KT98NVsxLTVdWzAtOV17MTR9fDYoPzowMTF8NVswLTldWzAtOV0pWzAtOV17MTJ9fDNbNDddWzAtOV17MTN9fDMoPzowWzAtNV18WzY4XVswLTldKVswLTldezExfXwoPzoyMTMxfDE4MDB8MzVcXGR7M30pXFxkezExfSkkLyxcbiAgICAgICAgY3Z2IDogL14oWzAtOV0pezMsNH0kLyxcblxuICAgICAgICAvLyBodHRwOi8vd3d3LndoYXR3Zy5vcmcvc3BlY3Mvd2ViLWFwcHMvY3VycmVudC13b3JrL211bHRpcGFnZS9zdGF0ZXMtb2YtdGhlLXR5cGUtYXR0cmlidXRlLmh0bWwjdmFsaWQtZS1tYWlsLWFkZHJlc3NcbiAgICAgICAgZW1haWwgOiAvXlthLXpBLVowLTkuISMkJSYnKitcXC89P15fYHt8fX4tXStAW2EtekEtWjAtOV0oPzpbYS16QS1aMC05LV17MCw2MX1bYS16QS1aMC05XSk/KD86XFwuW2EtekEtWjAtOV0oPzpbYS16QS1aMC05LV17MCw2MX1bYS16QS1aMC05XSk/KSskLyxcblxuICAgICAgICAvLyBodHRwOi8vYmxvZ3MubHNlLmFjLnVrL2x0aS8yMDA4LzA0LzIzL2EtcmVndWxhci1leHByZXNzaW9uLXRvLW1hdGNoLWFueS11cmwvXG4gICAgICAgIHVybDogL14oaHR0cHM/fGZ0cHxmaWxlfHNzaCk6XFwvXFwvKFstOzomPVxcK1xcJCxcXHddK0B7MX0pPyhbLUEtWmEtejAtOVxcLl0rKSs6PyhcXGQrKT8oKFxcL1stXFwrfiVcXC9cXC5cXHddKyk/XFw/PyhbLVxcKz0mOyVAXFwuXFx3XSspPyM/KFtcXHddKyk/KT8vLFxuICAgICAgICAvLyBhYmMuZGVcbiAgICAgICAgZG9tYWluIDogL14oW2EtekEtWjAtOV0oW2EtekEtWjAtOVxcLV17MCw2MX1bYS16QS1aMC05XSk/XFwuKStbYS16QS1aXXsyLDh9JC8sXG5cbiAgICAgICAgZGF0ZXRpbWUgOiAvXihbMC0yXVswLTldezN9KVxcLShbMC0xXVswLTldKVxcLShbMC0zXVswLTldKVQoWzAtNV1bMC05XSlcXDooWzAtNV1bMC05XSlcXDooWzAtNV1bMC05XSkoWnwoW1xcLVxcK10oWzAtMV1bMC05XSlcXDowMCkpJC8sXG4gICAgICAgIC8vIFlZWVktTU0tRERcbiAgICAgICAgZGF0ZSA6IC8oPzoxOXwyMClbMC05XXsyfS0oPzooPzowWzEtOV18MVswLTJdKS0oPzowWzEtOV18MVswLTldfDJbMC05XSl8KD86KD8hMDIpKD86MFsxLTldfDFbMC0yXSktKD86MzApKXwoPzooPzowWzEzNTc4XXwxWzAyXSktMzEpKSQvLFxuICAgICAgICAvLyBISDpNTTpTU1xuICAgICAgICB0aW1lIDogL14oMFswLTldfDFbMC05XXwyWzAtM10pKDpbMC01XVswLTldKXsyfSQvLFxuICAgICAgICBkYXRlSVNPIDogL15cXGR7NH1bXFwvXFwtXVxcZHsxLDJ9W1xcL1xcLV1cXGR7MSwyfSQvLFxuICAgICAgICAvLyBNTS9ERC9ZWVlZXG4gICAgICAgIG1vbnRoX2RheV95ZWFyIDogL14oMFsxLTldfDFbMDEyXSlbLSBcXC8uXSgwWzEtOV18WzEyXVswLTldfDNbMDFdKVstIFxcLy5dXFxkezR9JC8sXG4gICAgICAgIC8vIEREL01NL1lZWVlcbiAgICAgICAgZGF5X21vbnRoX3llYXIgOiAvXigwWzEtOV18WzEyXVswLTldfDNbMDFdKVstIFxcLy5dKDBbMS05XXwxWzAxMl0pWy0gXFwvLl1cXGR7NH0kLyxcblxuICAgICAgICAvLyAjRkZGIG9yICNGRkZGRkZcbiAgICAgICAgY29sb3IgOiAvXiM/KFthLWZBLUYwLTldezZ9fFthLWZBLUYwLTldezN9KSQvXG4gICAgICB9LFxuICAgICAgdmFsaWRhdG9ycyA6IHtcbiAgICAgICAgZXF1YWxUbyA6IGZ1bmN0aW9uIChlbCwgcmVxdWlyZWQsIHBhcmVudCkge1xuICAgICAgICAgIHZhciBmcm9tICA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKGVsLmdldEF0dHJpYnV0ZSh0aGlzLmFkZF9uYW1lc3BhY2UoJ2RhdGEtZXF1YWx0bycpKSkudmFsdWUsXG4gICAgICAgICAgICAgIHRvICAgID0gZWwudmFsdWUsXG4gICAgICAgICAgICAgIHZhbGlkID0gKGZyb20gPT09IHRvKTtcblxuICAgICAgICAgIHJldHVybiB2YWxpZDtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH0sXG5cbiAgICB0aW1lciA6IG51bGwsXG5cbiAgICBpbml0IDogZnVuY3Rpb24gKHNjb3BlLCBtZXRob2QsIG9wdGlvbnMpIHtcbiAgICAgIHRoaXMuYmluZGluZ3MobWV0aG9kLCBvcHRpb25zKTtcbiAgICB9LFxuXG4gICAgZXZlbnRzIDogZnVuY3Rpb24gKHNjb3BlKSB7XG4gICAgICB2YXIgc2VsZiA9IHRoaXMsXG4gICAgICAgICAgZm9ybSA9IHNlbGYuUyhzY29wZSkuYXR0cignbm92YWxpZGF0ZScsICdub3ZhbGlkYXRlJyksXG4gICAgICAgICAgc2V0dGluZ3MgPSBmb3JtLmRhdGEodGhpcy5hdHRyX25hbWUodHJ1ZSkgKyAnLWluaXQnKSB8fCB7fTtcblxuICAgICAgdGhpcy5pbnZhbGlkX2F0dHIgPSB0aGlzLmFkZF9uYW1lc3BhY2UoJ2RhdGEtaW52YWxpZCcpO1xuXG4gICAgICBmdW5jdGlvbiB2YWxpZGF0ZShvcmlnaW5hbFNlbGYsIGUpIHtcbiAgICAgICAgY2xlYXJUaW1lb3V0KHNlbGYudGltZXIpO1xuICAgICAgICBzZWxmLnRpbWVyID0gc2V0VGltZW91dChmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgc2VsZi52YWxpZGF0ZShbb3JpZ2luYWxTZWxmXSwgZSk7XG4gICAgICAgIH0uYmluZChvcmlnaW5hbFNlbGYpLCBzZXR0aW5ncy50aW1lb3V0KTtcbiAgICAgIH1cblxuXG4gICAgICBmb3JtXG4gICAgICAgIC5vZmYoJy5hYmlkZScpXG4gICAgICAgIC5vbignc3VibWl0LmZuZHRuLmFiaWRlJywgZnVuY3Rpb24gKGUpIHtcbiAgICAgICAgICB2YXIgaXNfYWpheCA9IC9hamF4L2kudGVzdChzZWxmLlModGhpcykuYXR0cihzZWxmLmF0dHJfbmFtZSgpKSk7XG4gICAgICAgICAgcmV0dXJuIHNlbGYudmFsaWRhdGUoc2VsZi5TKHRoaXMpLmZpbmQoJ2lucHV0LCB0ZXh0YXJlYSwgc2VsZWN0Jykubm90KFwiOmhpZGRlbiwgW2RhdGEtYWJpZGUtaWdub3JlXVwiKS5nZXQoKSwgZSwgaXNfYWpheCk7XG4gICAgICAgIH0pXG4gICAgICAgIC5vbigndmFsaWRhdGUuZm5kdG4uYWJpZGUnLCBmdW5jdGlvbiAoZSkge1xuICAgICAgICAgIGlmIChzZXR0aW5ncy52YWxpZGF0ZV9vbiA9PT0gJ21hbnVhbCcpIHtcbiAgICAgICAgICAgIHNlbGYudmFsaWRhdGUoW2UudGFyZ2V0XSwgZSk7XG4gICAgICAgICAgfVxuICAgICAgICB9KVxuICAgICAgICAub24oJ3Jlc2V0JywgZnVuY3Rpb24gKGUpIHtcbiAgICAgICAgICByZXR1cm4gc2VsZi5yZXNldCgkKHRoaXMpLCBlKTsgICAgICAgICAgXG4gICAgICAgIH0pXG4gICAgICAgIC5maW5kKCdpbnB1dCwgdGV4dGFyZWEsIHNlbGVjdCcpLm5vdChcIjpoaWRkZW4sIFtkYXRhLWFiaWRlLWlnbm9yZV1cIilcbiAgICAgICAgICAub2ZmKCcuYWJpZGUnKVxuICAgICAgICAgIC5vbignYmx1ci5mbmR0bi5hYmlkZSBjaGFuZ2UuZm5kdG4uYWJpZGUnLCBmdW5jdGlvbiAoZSkge1xuICAgICAgICAgICAgLy8gb2xkIHNldHRpbmdzIGZhbGxiYWNrXG4gICAgICAgICAgICAvLyB3aWxsIGJlIGRlcHJlY2F0ZWQgd2l0aCBGNiByZWxlYXNlXG4gICAgICAgICAgICBpZiAoc2V0dGluZ3MudmFsaWRhdGVfb25fYmx1ciAmJiBzZXR0aW5ncy52YWxpZGF0ZV9vbl9ibHVyID09PSB0cnVlKSB7XG4gICAgICAgICAgICAgIHZhbGlkYXRlKHRoaXMsIGUpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgLy8gbmV3IHNldHRpbmdzIGNvbWJpbmluZyB2YWxpZGF0ZSBvcHRpb25zIGludG8gb25lIHNldHRpbmdcbiAgICAgICAgICAgIGlmIChzZXR0aW5ncy52YWxpZGF0ZV9vbiA9PT0gJ2NoYW5nZScpIHtcbiAgICAgICAgICAgICAgdmFsaWRhdGUodGhpcywgZSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfSlcbiAgICAgICAgICAub24oJ2tleWRvd24uZm5kdG4uYWJpZGUnLCBmdW5jdGlvbiAoZSkge1xuICAgICAgICAgICAgLy8gb2xkIHNldHRpbmdzIGZhbGxiYWNrXG4gICAgICAgICAgICAvLyB3aWxsIGJlIGRlcHJlY2F0ZWQgd2l0aCBGNiByZWxlYXNlXG4gICAgICAgICAgICBpZiAoc2V0dGluZ3MubGl2ZV92YWxpZGF0ZSAmJiBzZXR0aW5ncy5saXZlX3ZhbGlkYXRlID09PSB0cnVlICYmIGUud2hpY2ggIT0gOSkge1xuICAgICAgICAgICAgICB2YWxpZGF0ZSh0aGlzLCBlKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIC8vIG5ldyBzZXR0aW5ncyBjb21iaW5pbmcgdmFsaWRhdGUgb3B0aW9ucyBpbnRvIG9uZSBzZXR0aW5nXG4gICAgICAgICAgICBpZiAoc2V0dGluZ3MudmFsaWRhdGVfb24gPT09ICd0YWInICYmIGUud2hpY2ggPT09IDkpIHtcbiAgICAgICAgICAgICAgdmFsaWRhdGUodGhpcywgZSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlIGlmIChzZXR0aW5ncy52YWxpZGF0ZV9vbiA9PT0gJ2NoYW5nZScpIHtcbiAgICAgICAgICAgICAgdmFsaWRhdGUodGhpcywgZSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfSlcbiAgICAgICAgICAub24oJ2ZvY3VzJywgZnVuY3Rpb24gKGUpIHtcbiAgICAgICAgICAgIGlmIChuYXZpZ2F0b3IudXNlckFnZW50Lm1hdGNoKC9pUGFkfGlQaG9uZXxBbmRyb2lkfEJsYWNrQmVycnl8V2luZG93cyBQaG9uZXx3ZWJPUy9pKSkge1xuICAgICAgICAgICAgICAkKCdodG1sLCBib2R5JykuYW5pbWF0ZSh7XG4gICAgICAgICAgICAgICAgICBzY3JvbGxUb3A6ICQoZS50YXJnZXQpLm9mZnNldCgpLnRvcFxuICAgICAgICAgICAgICB9LCAxMDApO1xuICAgICAgICAgICAgfSBcbiAgICAgICAgICB9KTtcbiAgICB9LFxuXG4gICAgcmVzZXQgOiBmdW5jdGlvbiAoZm9ybSwgZSkge1xuICAgICAgdmFyIHNlbGYgPSB0aGlzO1xuICAgICAgZm9ybS5yZW1vdmVBdHRyKHNlbGYuaW52YWxpZF9hdHRyKTtcblxuICAgICAgJCgnWycgKyBzZWxmLmludmFsaWRfYXR0ciArICddJywgZm9ybSkucmVtb3ZlQXR0cihzZWxmLmludmFsaWRfYXR0cik7XG4gICAgICAkKCcuJyArIHNlbGYuc2V0dGluZ3MuZXJyb3JfY2xhc3MsIGZvcm0pLm5vdCgnc21hbGwnKS5yZW1vdmVDbGFzcyhzZWxmLnNldHRpbmdzLmVycm9yX2NsYXNzKTtcbiAgICAgICQoJzppbnB1dCcsIGZvcm0pLm5vdCgnOmJ1dHRvbiwgOnN1Ym1pdCwgOnJlc2V0LCA6aGlkZGVuLCBbZGF0YS1hYmlkZS1pZ25vcmVdJykudmFsKCcnKS5yZW1vdmVBdHRyKHNlbGYuaW52YWxpZF9hdHRyKTtcbiAgICB9LFxuXG4gICAgdmFsaWRhdGUgOiBmdW5jdGlvbiAoZWxzLCBlLCBpc19hamF4KSB7XG4gICAgICB2YXIgdmFsaWRhdGlvbnMgPSB0aGlzLnBhcnNlX3BhdHRlcm5zKGVscyksXG4gICAgICAgICAgdmFsaWRhdGlvbl9jb3VudCA9IHZhbGlkYXRpb25zLmxlbmd0aCxcbiAgICAgICAgICBmb3JtID0gdGhpcy5TKGVsc1swXSkuY2xvc2VzdCgnZm9ybScpLFxuICAgICAgICAgIHN1Ym1pdF9ldmVudCA9IC9zdWJtaXQvLnRlc3QoZS50eXBlKTtcblxuICAgICAgLy8gSGFzIHRvIGNvdW50IHVwIHRvIG1ha2Ugc3VyZSB0aGUgZm9jdXMgZ2V0cyBhcHBsaWVkIHRvIHRoZSB0b3AgZXJyb3JcbiAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgdmFsaWRhdGlvbl9jb3VudDsgaSsrKSB7XG4gICAgICAgIGlmICghdmFsaWRhdGlvbnNbaV0gJiYgKHN1Ym1pdF9ldmVudCB8fCBpc19hamF4KSkge1xuICAgICAgICAgIGlmICh0aGlzLnNldHRpbmdzLmZvY3VzX29uX2ludmFsaWQpIHtcbiAgICAgICAgICAgIGVsc1tpXS5mb2N1cygpO1xuICAgICAgICAgIH1cbiAgICAgICAgICBmb3JtLnRyaWdnZXIoJ2ludmFsaWQuZm5kdG4uYWJpZGUnKTtcbiAgICAgICAgICB0aGlzLlMoZWxzW2ldKS5jbG9zZXN0KCdmb3JtJykuYXR0cih0aGlzLmludmFsaWRfYXR0ciwgJycpO1xuICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICBpZiAoc3VibWl0X2V2ZW50IHx8IGlzX2FqYXgpIHtcbiAgICAgICAgZm9ybS50cmlnZ2VyKCd2YWxpZC5mbmR0bi5hYmlkZScpO1xuICAgICAgfVxuXG4gICAgICBmb3JtLnJlbW92ZUF0dHIodGhpcy5pbnZhbGlkX2F0dHIpO1xuXG4gICAgICBpZiAoaXNfYWpheCkge1xuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICB9XG5cbiAgICAgIHJldHVybiB0cnVlO1xuICAgIH0sXG5cbiAgICBwYXJzZV9wYXR0ZXJucyA6IGZ1bmN0aW9uIChlbHMpIHtcbiAgICAgIHZhciBpID0gZWxzLmxlbmd0aCxcbiAgICAgICAgICBlbF9wYXR0ZXJucyA9IFtdO1xuXG4gICAgICB3aGlsZSAoaS0tKSB7XG4gICAgICAgIGVsX3BhdHRlcm5zLnB1c2godGhpcy5wYXR0ZXJuKGVsc1tpXSkpO1xuICAgICAgfVxuXG4gICAgICByZXR1cm4gdGhpcy5jaGVja192YWxpZGF0aW9uX2FuZF9hcHBseV9zdHlsZXMoZWxfcGF0dGVybnMpO1xuICAgIH0sXG5cbiAgICBwYXR0ZXJuIDogZnVuY3Rpb24gKGVsKSB7XG4gICAgICB2YXIgdHlwZSA9IGVsLmdldEF0dHJpYnV0ZSgndHlwZScpLFxuICAgICAgICAgIHJlcXVpcmVkID0gdHlwZW9mIGVsLmdldEF0dHJpYnV0ZSgncmVxdWlyZWQnKSA9PT0gJ3N0cmluZyc7XG5cbiAgICAgIHZhciBwYXR0ZXJuID0gZWwuZ2V0QXR0cmlidXRlKCdwYXR0ZXJuJykgfHwgJyc7XG5cbiAgICAgIGlmICh0aGlzLnNldHRpbmdzLnBhdHRlcm5zLmhhc093blByb3BlcnR5KHBhdHRlcm4pICYmIHBhdHRlcm4ubGVuZ3RoID4gMCkge1xuICAgICAgICByZXR1cm4gW2VsLCB0aGlzLnNldHRpbmdzLnBhdHRlcm5zW3BhdHRlcm5dLCByZXF1aXJlZF07XG4gICAgICB9IGVsc2UgaWYgKHBhdHRlcm4ubGVuZ3RoID4gMCkge1xuICAgICAgICByZXR1cm4gW2VsLCBuZXcgUmVnRXhwKHBhdHRlcm4pLCByZXF1aXJlZF07XG4gICAgICB9XG5cbiAgICAgIGlmICh0aGlzLnNldHRpbmdzLnBhdHRlcm5zLmhhc093blByb3BlcnR5KHR5cGUpKSB7XG4gICAgICAgIHJldHVybiBbZWwsIHRoaXMuc2V0dGluZ3MucGF0dGVybnNbdHlwZV0sIHJlcXVpcmVkXTtcbiAgICAgIH1cblxuICAgICAgcGF0dGVybiA9IC8uKi87XG5cbiAgICAgIHJldHVybiBbZWwsIHBhdHRlcm4sIHJlcXVpcmVkXTtcbiAgICB9LFxuXG4gICAgLy8gVE9ETzogQnJlYWsgdGhpcyB1cCBpbnRvIHNtYWxsZXIgbWV0aG9kcywgZ2V0dGluZyBoYXJkIHRvIHJlYWQuXG4gICAgY2hlY2tfdmFsaWRhdGlvbl9hbmRfYXBwbHlfc3R5bGVzIDogZnVuY3Rpb24gKGVsX3BhdHRlcm5zKSB7XG4gICAgICB2YXIgaSA9IGVsX3BhdHRlcm5zLmxlbmd0aCxcbiAgICAgICAgICB2YWxpZGF0aW9ucyA9IFtdLFxuICAgICAgICAgIGZvcm0gPSB0aGlzLlMoZWxfcGF0dGVybnNbMF1bMF0pLmNsb3Nlc3QoJ1tkYXRhLScgKyB0aGlzLmF0dHJfbmFtZSh0cnVlKSArICddJyksXG4gICAgICAgICAgc2V0dGluZ3MgPSBmb3JtLmRhdGEodGhpcy5hdHRyX25hbWUodHJ1ZSkgKyAnLWluaXQnKSB8fCB7fTtcbiAgICAgIHdoaWxlIChpLS0pIHtcbiAgICAgICAgdmFyIGVsID0gZWxfcGF0dGVybnNbaV1bMF0sXG4gICAgICAgICAgICByZXF1aXJlZCA9IGVsX3BhdHRlcm5zW2ldWzJdLFxuICAgICAgICAgICAgdmFsdWUgPSBlbC52YWx1ZS50cmltKCksXG4gICAgICAgICAgICBkaXJlY3RfcGFyZW50ID0gdGhpcy5TKGVsKS5wYXJlbnQoKSxcbiAgICAgICAgICAgIHZhbGlkYXRvciA9IGVsLmdldEF0dHJpYnV0ZSh0aGlzLmFkZF9uYW1lc3BhY2UoJ2RhdGEtYWJpZGUtdmFsaWRhdG9yJykpLFxuICAgICAgICAgICAgaXNfcmFkaW8gPSBlbC50eXBlID09PSAncmFkaW8nLFxuICAgICAgICAgICAgaXNfY2hlY2tib3ggPSBlbC50eXBlID09PSAnY2hlY2tib3gnLFxuICAgICAgICAgICAgbGFiZWwgPSB0aGlzLlMoJ2xhYmVsW2Zvcj1cIicgKyBlbC5nZXRBdHRyaWJ1dGUoJ2lkJykgKyAnXCJdJyksXG4gICAgICAgICAgICB2YWxpZF9sZW5ndGggPSAocmVxdWlyZWQpID8gKGVsLnZhbHVlLmxlbmd0aCA+IDApIDogdHJ1ZSxcbiAgICAgICAgICAgIGVsX3ZhbGlkYXRpb25zID0gW107XG5cbiAgICAgICAgdmFyIHBhcmVudCwgdmFsaWQ7XG5cbiAgICAgICAgLy8gc3VwcG9ydCBvbGQgd2F5IHRvIGRvIGVxdWFsVG8gdmFsaWRhdGlvbnNcbiAgICAgICAgaWYgKGVsLmdldEF0dHJpYnV0ZSh0aGlzLmFkZF9uYW1lc3BhY2UoJ2RhdGEtZXF1YWx0bycpKSkgeyB2YWxpZGF0b3IgPSAnZXF1YWxUbycgfVxuXG4gICAgICAgIGlmICghZGlyZWN0X3BhcmVudC5pcygnbGFiZWwnKSkge1xuICAgICAgICAgIHBhcmVudCA9IGRpcmVjdF9wYXJlbnQ7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgcGFyZW50ID0gZGlyZWN0X3BhcmVudC5wYXJlbnQoKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChpc19yYWRpbyAmJiByZXF1aXJlZCkge1xuICAgICAgICAgIGVsX3ZhbGlkYXRpb25zLnB1c2godGhpcy52YWxpZF9yYWRpbyhlbCwgcmVxdWlyZWQpKTtcbiAgICAgICAgfSBlbHNlIGlmIChpc19jaGVja2JveCAmJiByZXF1aXJlZCkge1xuICAgICAgICAgIGVsX3ZhbGlkYXRpb25zLnB1c2godGhpcy52YWxpZF9jaGVja2JveChlbCwgcmVxdWlyZWQpKTtcblxuICAgICAgICB9IGVsc2UgaWYgKHZhbGlkYXRvcikge1xuICAgICAgICAgIC8vIFZhbGlkYXRlIHVzaW5nIGVhY2ggb2YgdGhlIHNwZWNpZmllZCAoc3BhY2UtZGVsaW1pdGVkKSB2YWxpZGF0b3JzLlxuICAgICAgICAgIHZhciB2YWxpZGF0b3JzID0gdmFsaWRhdG9yLnNwbGl0KCcgJyk7XG4gICAgICAgICAgdmFyIGxhc3RfdmFsaWQgPSB0cnVlLCBhbGxfdmFsaWQgPSB0cnVlO1xuICAgICAgICAgIGZvciAodmFyIGl2ID0gMDsgaXYgPCB2YWxpZGF0b3JzLmxlbmd0aDsgaXYrKykge1xuICAgICAgICAgICAgICB2YWxpZCA9IHRoaXMuc2V0dGluZ3MudmFsaWRhdG9yc1t2YWxpZGF0b3JzW2l2XV0uYXBwbHkodGhpcywgW2VsLCByZXF1aXJlZCwgcGFyZW50XSlcbiAgICAgICAgICAgICAgZWxfdmFsaWRhdGlvbnMucHVzaCh2YWxpZCk7XG4gICAgICAgICAgICAgIGFsbF92YWxpZCA9IHZhbGlkICYmIGxhc3RfdmFsaWQ7XG4gICAgICAgICAgICAgIGxhc3RfdmFsaWQgPSB2YWxpZDtcbiAgICAgICAgICB9XG4gICAgICAgICAgaWYgKGFsbF92YWxpZCkge1xuICAgICAgICAgICAgICB0aGlzLlMoZWwpLnJlbW92ZUF0dHIodGhpcy5pbnZhbGlkX2F0dHIpO1xuICAgICAgICAgICAgICBwYXJlbnQucmVtb3ZlQ2xhc3MoJ2Vycm9yJyk7XG4gICAgICAgICAgICAgIGlmIChsYWJlbC5sZW5ndGggPiAwICYmIHRoaXMuc2V0dGluZ3MuZXJyb3JfbGFiZWxzKSB7XG4gICAgICAgICAgICAgICAgbGFiZWwucmVtb3ZlQ2xhc3ModGhpcy5zZXR0aW5ncy5lcnJvcl9jbGFzcykucmVtb3ZlQXR0cigncm9sZScpO1xuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICQoZWwpLnRyaWdnZXJIYW5kbGVyKCd2YWxpZCcpO1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgIHRoaXMuUyhlbCkuYXR0cih0aGlzLmludmFsaWRfYXR0ciwgJycpO1xuICAgICAgICAgICAgICBwYXJlbnQuYWRkQ2xhc3MoJ2Vycm9yJyk7XG4gICAgICAgICAgICAgIGlmIChsYWJlbC5sZW5ndGggPiAwICYmIHRoaXMuc2V0dGluZ3MuZXJyb3JfbGFiZWxzKSB7XG4gICAgICAgICAgICAgICAgbGFiZWwuYWRkQ2xhc3ModGhpcy5zZXR0aW5ncy5lcnJvcl9jbGFzcykuYXR0cigncm9sZScsICdhbGVydCcpO1xuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICQoZWwpLnRyaWdnZXJIYW5kbGVyKCdpbnZhbGlkJyk7XG4gICAgICAgICAgfVxuICAgICAgICB9IGVsc2Uge1xuXG4gICAgICAgICAgaWYgKGVsX3BhdHRlcm5zW2ldWzFdLnRlc3QodmFsdWUpICYmIHZhbGlkX2xlbmd0aCB8fFxuICAgICAgICAgICAgIXJlcXVpcmVkICYmIGVsLnZhbHVlLmxlbmd0aCA8IDEgfHwgJChlbCkuYXR0cignZGlzYWJsZWQnKSkge1xuICAgICAgICAgICAgZWxfdmFsaWRhdGlvbnMucHVzaCh0cnVlKTtcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgZWxfdmFsaWRhdGlvbnMucHVzaChmYWxzZSk7XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgZWxfdmFsaWRhdGlvbnMgPSBbZWxfdmFsaWRhdGlvbnMuZXZlcnkoZnVuY3Rpb24gKHZhbGlkKSB7cmV0dXJuIHZhbGlkO30pXTtcbiAgICAgICAgICBpZiAoZWxfdmFsaWRhdGlvbnNbMF0pIHtcbiAgICAgICAgICAgIHRoaXMuUyhlbCkucmVtb3ZlQXR0cih0aGlzLmludmFsaWRfYXR0cik7XG4gICAgICAgICAgICBlbC5zZXRBdHRyaWJ1dGUoJ2FyaWEtaW52YWxpZCcsICdmYWxzZScpO1xuICAgICAgICAgICAgZWwucmVtb3ZlQXR0cmlidXRlKCdhcmlhLWRlc2NyaWJlZGJ5Jyk7XG4gICAgICAgICAgICBwYXJlbnQucmVtb3ZlQ2xhc3ModGhpcy5zZXR0aW5ncy5lcnJvcl9jbGFzcyk7XG4gICAgICAgICAgICBpZiAobGFiZWwubGVuZ3RoID4gMCAmJiB0aGlzLnNldHRpbmdzLmVycm9yX2xhYmVscykge1xuICAgICAgICAgICAgICBsYWJlbC5yZW1vdmVDbGFzcyh0aGlzLnNldHRpbmdzLmVycm9yX2NsYXNzKS5yZW1vdmVBdHRyKCdyb2xlJyk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICAkKGVsKS50cmlnZ2VySGFuZGxlcigndmFsaWQnKTtcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdGhpcy5TKGVsKS5hdHRyKHRoaXMuaW52YWxpZF9hdHRyLCAnJyk7XG4gICAgICAgICAgICBlbC5zZXRBdHRyaWJ1dGUoJ2FyaWEtaW52YWxpZCcsICd0cnVlJyk7XG5cbiAgICAgICAgICAgIC8vIFRyeSB0byBmaW5kIHRoZSBlcnJvciBhc3NvY2lhdGVkIHdpdGggdGhlIGlucHV0XG4gICAgICAgICAgICB2YXIgZXJyb3JFbGVtID0gcGFyZW50LmZpbmQoJ3NtYWxsLicgKyB0aGlzLnNldHRpbmdzLmVycm9yX2NsYXNzLCAnc3Bhbi4nICsgdGhpcy5zZXR0aW5ncy5lcnJvcl9jbGFzcyk7XG4gICAgICAgICAgICB2YXIgZXJyb3JJRCA9IGVycm9yRWxlbS5sZW5ndGggPiAwID8gZXJyb3JFbGVtWzBdLmlkIDogJyc7XG4gICAgICAgICAgICBpZiAoZXJyb3JJRC5sZW5ndGggPiAwKSB7XG4gICAgICAgICAgICAgIGVsLnNldEF0dHJpYnV0ZSgnYXJpYS1kZXNjcmliZWRieScsIGVycm9ySUQpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAvLyBlbC5zZXRBdHRyaWJ1dGUoJ2FyaWEtZGVzY3JpYmVkYnknLCAkKGVsKS5maW5kKCcuZXJyb3InKVswXS5pZCk7XG4gICAgICAgICAgICBwYXJlbnQuYWRkQ2xhc3ModGhpcy5zZXR0aW5ncy5lcnJvcl9jbGFzcyk7XG4gICAgICAgICAgICBpZiAobGFiZWwubGVuZ3RoID4gMCAmJiB0aGlzLnNldHRpbmdzLmVycm9yX2xhYmVscykge1xuICAgICAgICAgICAgICBsYWJlbC5hZGRDbGFzcyh0aGlzLnNldHRpbmdzLmVycm9yX2NsYXNzKS5hdHRyKCdyb2xlJywgJ2FsZXJ0Jyk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICAkKGVsKS50cmlnZ2VySGFuZGxlcignaW52YWxpZCcpO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICB2YWxpZGF0aW9ucyA9IHZhbGlkYXRpb25zLmNvbmNhdChlbF92YWxpZGF0aW9ucyk7XG4gICAgICB9XG4gICAgICByZXR1cm4gdmFsaWRhdGlvbnM7XG4gICAgfSxcblxuICAgIHZhbGlkX2NoZWNrYm94IDogZnVuY3Rpb24gKGVsLCByZXF1aXJlZCkge1xuICAgICAgdmFyIGVsID0gdGhpcy5TKGVsKSxcbiAgICAgICAgICB2YWxpZCA9IChlbC5pcygnOmNoZWNrZWQnKSB8fCAhcmVxdWlyZWQgfHwgZWwuZ2V0KDApLmdldEF0dHJpYnV0ZSgnZGlzYWJsZWQnKSk7XG5cbiAgICAgIGlmICh2YWxpZCkge1xuICAgICAgICBlbC5yZW1vdmVBdHRyKHRoaXMuaW52YWxpZF9hdHRyKS5wYXJlbnQoKS5yZW1vdmVDbGFzcyh0aGlzLnNldHRpbmdzLmVycm9yX2NsYXNzKTtcbiAgICAgICAgJChlbCkudHJpZ2dlckhhbmRsZXIoJ3ZhbGlkJyk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBlbC5hdHRyKHRoaXMuaW52YWxpZF9hdHRyLCAnJykucGFyZW50KCkuYWRkQ2xhc3ModGhpcy5zZXR0aW5ncy5lcnJvcl9jbGFzcyk7XG4gICAgICAgICQoZWwpLnRyaWdnZXJIYW5kbGVyKCdpbnZhbGlkJyk7XG4gICAgICB9XG5cbiAgICAgIHJldHVybiB2YWxpZDtcbiAgICB9LFxuXG4gICAgdmFsaWRfcmFkaW8gOiBmdW5jdGlvbiAoZWwsIHJlcXVpcmVkKSB7XG4gICAgICB2YXIgbmFtZSA9IGVsLmdldEF0dHJpYnV0ZSgnbmFtZScpLFxuICAgICAgICAgIGdyb3VwID0gdGhpcy5TKGVsKS5jbG9zZXN0KCdbZGF0YS0nICsgdGhpcy5hdHRyX25hbWUodHJ1ZSkgKyAnXScpLmZpbmQoXCJbbmFtZT0nXCIgKyBuYW1lICsgXCInXVwiKSxcbiAgICAgICAgICBjb3VudCA9IGdyb3VwLmxlbmd0aCxcbiAgICAgICAgICB2YWxpZCA9IGZhbHNlLFxuICAgICAgICAgIGRpc2FibGVkID0gZmFsc2U7XG5cbiAgICAgIC8vIEhhcyB0byBjb3VudCB1cCB0byBtYWtlIHN1cmUgdGhlIGZvY3VzIGdldHMgYXBwbGllZCB0byB0aGUgdG9wIGVycm9yXG4gICAgICAgIGZvciAodmFyIGk9MDsgaSA8IGNvdW50OyBpKyspIHtcbiAgICAgICAgICAgIGlmKCBncm91cFtpXS5nZXRBdHRyaWJ1dGUoJ2Rpc2FibGVkJykgKXtcbiAgICAgICAgICAgICAgICBkaXNhYmxlZD10cnVlO1xuICAgICAgICAgICAgICAgIHZhbGlkPXRydWU7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIGlmIChncm91cFtpXS5jaGVja2VkKXtcbiAgICAgICAgICAgICAgICAgICAgdmFsaWQgPSB0cnVlO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIGlmKCBkaXNhYmxlZCApe1xuICAgICAgICAgICAgICAgICAgICAgICAgdmFsaWQgPSBmYWxzZTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAvLyBIYXMgdG8gY291bnQgdXAgdG8gbWFrZSBzdXJlIHRoZSBmb2N1cyBnZXRzIGFwcGxpZWQgdG8gdGhlIHRvcCBlcnJvclxuICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBjb3VudDsgaSsrKSB7XG4gICAgICAgIGlmICh2YWxpZCkge1xuICAgICAgICAgIHRoaXMuUyhncm91cFtpXSkucmVtb3ZlQXR0cih0aGlzLmludmFsaWRfYXR0cikucGFyZW50KCkucmVtb3ZlQ2xhc3ModGhpcy5zZXR0aW5ncy5lcnJvcl9jbGFzcyk7XG4gICAgICAgICAgJChncm91cFtpXSkudHJpZ2dlckhhbmRsZXIoJ3ZhbGlkJyk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgdGhpcy5TKGdyb3VwW2ldKS5hdHRyKHRoaXMuaW52YWxpZF9hdHRyLCAnJykucGFyZW50KCkuYWRkQ2xhc3ModGhpcy5zZXR0aW5ncy5lcnJvcl9jbGFzcyk7XG4gICAgICAgICAgJChncm91cFtpXSkudHJpZ2dlckhhbmRsZXIoJ2ludmFsaWQnKTtcbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICByZXR1cm4gdmFsaWQ7XG4gICAgfSxcblxuICAgIHZhbGlkX2VxdWFsIDogZnVuY3Rpb24gKGVsLCByZXF1aXJlZCwgcGFyZW50KSB7XG4gICAgICB2YXIgZnJvbSAgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChlbC5nZXRBdHRyaWJ1dGUodGhpcy5hZGRfbmFtZXNwYWNlKCdkYXRhLWVxdWFsdG8nKSkpLnZhbHVlLFxuICAgICAgICAgIHRvICAgID0gZWwudmFsdWUsXG4gICAgICAgICAgdmFsaWQgPSAoZnJvbSA9PT0gdG8pO1xuXG4gICAgICBpZiAodmFsaWQpIHtcbiAgICAgICAgdGhpcy5TKGVsKS5yZW1vdmVBdHRyKHRoaXMuaW52YWxpZF9hdHRyKTtcbiAgICAgICAgcGFyZW50LnJlbW92ZUNsYXNzKHRoaXMuc2V0dGluZ3MuZXJyb3JfY2xhc3MpO1xuICAgICAgICBpZiAobGFiZWwubGVuZ3RoID4gMCAmJiBzZXR0aW5ncy5lcnJvcl9sYWJlbHMpIHtcbiAgICAgICAgICBsYWJlbC5yZW1vdmVDbGFzcyh0aGlzLnNldHRpbmdzLmVycm9yX2NsYXNzKTtcbiAgICAgICAgfVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdGhpcy5TKGVsKS5hdHRyKHRoaXMuaW52YWxpZF9hdHRyLCAnJyk7XG4gICAgICAgIHBhcmVudC5hZGRDbGFzcyh0aGlzLnNldHRpbmdzLmVycm9yX2NsYXNzKTtcbiAgICAgICAgaWYgKGxhYmVsLmxlbmd0aCA+IDAgJiYgc2V0dGluZ3MuZXJyb3JfbGFiZWxzKSB7XG4gICAgICAgICAgbGFiZWwuYWRkQ2xhc3ModGhpcy5zZXR0aW5ncy5lcnJvcl9jbGFzcyk7XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgcmV0dXJuIHZhbGlkO1xuICAgIH0sXG5cbiAgICB2YWxpZF9vbmVvZiA6IGZ1bmN0aW9uIChlbCwgcmVxdWlyZWQsIHBhcmVudCwgZG9Ob3RWYWxpZGF0ZU90aGVycykge1xuICAgICAgdmFyIGVsID0gdGhpcy5TKGVsKSxcbiAgICAgICAgb3RoZXJzID0gdGhpcy5TKCdbJyArIHRoaXMuYWRkX25hbWVzcGFjZSgnZGF0YS1vbmVvZicpICsgJ10nKSxcbiAgICAgICAgdmFsaWQgPSBvdGhlcnMuZmlsdGVyKCc6Y2hlY2tlZCcpLmxlbmd0aCA+IDA7XG5cbiAgICAgIGlmICh2YWxpZCkge1xuICAgICAgICBlbC5yZW1vdmVBdHRyKHRoaXMuaW52YWxpZF9hdHRyKS5wYXJlbnQoKS5yZW1vdmVDbGFzcyh0aGlzLnNldHRpbmdzLmVycm9yX2NsYXNzKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGVsLmF0dHIodGhpcy5pbnZhbGlkX2F0dHIsICcnKS5wYXJlbnQoKS5hZGRDbGFzcyh0aGlzLnNldHRpbmdzLmVycm9yX2NsYXNzKTtcbiAgICAgIH1cblxuICAgICAgaWYgKCFkb05vdFZhbGlkYXRlT3RoZXJzKSB7XG4gICAgICAgIHZhciBfdGhpcyA9IHRoaXM7XG4gICAgICAgIG90aGVycy5lYWNoKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICBfdGhpcy52YWxpZF9vbmVvZi5jYWxsKF90aGlzLCB0aGlzLCBudWxsLCBudWxsLCB0cnVlKTtcbiAgICAgICAgfSk7XG4gICAgICB9XG5cbiAgICAgIHJldHVybiB2YWxpZDtcbiAgICB9LFxuXG4gICAgcmVmbG93IDogZnVuY3Rpb24oc2NvcGUsIG9wdGlvbnMpIHtcbiAgICAgIHZhciBzZWxmID0gdGhpcyxcbiAgICAgICAgICBmb3JtID0gc2VsZi5TKCdbJyArIHRoaXMuYXR0cl9uYW1lKCkgKyAnXScpLmF0dHIoJ25vdmFsaWRhdGUnLCAnbm92YWxpZGF0ZScpO1xuICAgICAgICAgIHNlbGYuUyhmb3JtKS5lYWNoKGZ1bmN0aW9uIChpZHgsIGVsKSB7XG4gICAgICAgICAgICBzZWxmLmV2ZW50cyhlbCk7XG4gICAgICAgICAgfSk7XG4gICAgfVxuICB9O1xufShqUXVlcnksIHdpbmRvdywgd2luZG93LmRvY3VtZW50KSk7XG4iXSwiZmlsZSI6ImZvdW5kYXRpb24vanMvZm91bmRhdGlvbi9mb3VuZGF0aW9uLmFiaWRlLmpzIiwic291cmNlUm9vdCI6Ii9zb3VyY2UvIn0=