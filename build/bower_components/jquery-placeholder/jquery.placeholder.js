/*! http://mths.be/placeholder v2.0.9 by @mathias */
(function(factory) {
	if (typeof define === 'function' && define.amd) {
		// AMD
		define(['jquery'], factory);
	} else {
		// Browser globals
		factory(jQuery);
	}
}(function($) {

	// Opera Mini v7 doesn’t support placeholder although its DOM seems to indicate so
	var isOperaMini = Object.prototype.toString.call(window.operamini) == '[object OperaMini]';
	var isInputSupported = 'placeholder' in document.createElement('input') && !isOperaMini;
	var isTextareaSupported = 'placeholder' in document.createElement('textarea') && !isOperaMini;
	var valHooks = $.valHooks;
	var propHooks = $.propHooks;
	var hooks;
	var placeholder;

	if (isInputSupported && isTextareaSupported) {

		placeholder = $.fn.placeholder = function() {
			return this;
		};

		placeholder.input = placeholder.textarea = true;

	} else {

		placeholder = $.fn.placeholder = function() {
			var $this = this;
			$this
				.filter((isInputSupported ? 'textarea' : ':input') + '[placeholder]')
				.not('.placeholder')
				.bind({
					'focus.placeholder': clearPlaceholder,
					'blur.placeholder': setPlaceholder
				})
				.data('placeholder-enabled', true)
				.trigger('blur.placeholder');
			return $this;
		};

		placeholder.input = isInputSupported;
		placeholder.textarea = isTextareaSupported;

		hooks = {
			'get': function(element) {
				var $element = $(element);

				var $passwordInput = $element.data('placeholder-password');
				if ($passwordInput) {
					return $passwordInput[0].value;
				}

				return $element.data('placeholder-enabled') && $element.hasClass('placeholder') ? '' : element.value;
			},
			'set': function(element, value) {
				var $element = $(element);

				var $passwordInput = $element.data('placeholder-password');
				if ($passwordInput) {
					return $passwordInput[0].value = value;
				}

				if (!$element.data('placeholder-enabled')) {
					return element.value = value;
				}
				if (value === '') {
					element.value = value;
					// Issue #56: Setting the placeholder causes problems if the element continues to have focus.
					if (element != safeActiveElement()) {
						// We can't use `triggerHandler` here because of dummy text/password inputs :(
						setPlaceholder.call(element);
					}
				} else if ($element.hasClass('placeholder')) {
					clearPlaceholder.call(element, true, value) || (element.value = value);
				} else {
					element.value = value;
				}
				// `set` can not return `undefined`; see http://jsapi.info/jquery/1.7.1/val#L2363
				return $element;
			}
		};

		if (!isInputSupported) {
			valHooks.input = hooks;
			propHooks.value = hooks;
		}
		if (!isTextareaSupported) {
			valHooks.textarea = hooks;
			propHooks.value = hooks;
		}

		$(function() {
			// Look for forms
			$(document).delegate('form', 'submit.placeholder', function() {
				// Clear the placeholder values so they don't get submitted
				var $inputs = $('.placeholder', this).each(clearPlaceholder);
				setTimeout(function() {
					$inputs.each(setPlaceholder);
				}, 10);
			});
		});

		// Clear placeholder values upon page reload
		$(window).bind('beforeunload.placeholder', function() {
			$('.placeholder').each(function() {
				this.value = '';
			});
		});

	}

	function args(elem) {
		// Return an object of element attributes
		var newAttrs = {};
		var rinlinejQuery = /^jQuery\d+$/;
		$.each(elem.attributes, function(i, attr) {
			if (attr.specified && !rinlinejQuery.test(attr.name)) {
				newAttrs[attr.name] = attr.value;
			}
		});
		return newAttrs;
	}

	function clearPlaceholder(event, value) {
		var input = this;
		var $input = $(input);
		if (input.value == $input.attr('placeholder') && $input.hasClass('placeholder')) {
			if ($input.data('placeholder-password')) {
				$input = $input.hide().nextAll('input[type="password"]:first').show().attr('id', $input.removeAttr('id').data('placeholder-id'));
				// If `clearPlaceholder` was called from `$.valHooks.input.set`
				if (event === true) {
					return $input[0].value = value;
				}
				$input.focus();
			} else {
				input.value = '';
				$input.removeClass('placeholder');
				input == safeActiveElement() && input.select();
			}
		}
	}

	function setPlaceholder() {
		var $replacement;
		var input = this;
		var $input = $(input);
		var id = this.id;
		if (input.value === '') {
			if (input.type === 'password') {
				if (!$input.data('placeholder-textinput')) {
					try {
						$replacement = $input.clone().attr({ 'type': 'text' });
					} catch(e) {
						$replacement = $('<input>').attr($.extend(args(this), { 'type': 'text' }));
					}
					$replacement
						.removeAttr('name')
						.data({
							'placeholder-password': $input,
							'placeholder-id': id
						})
						.bind('focus.placeholder', clearPlaceholder);
					$input
						.data({
							'placeholder-textinput': $replacement,
							'placeholder-id': id
						})
						.before($replacement);
				}
				$input = $input.removeAttr('id').hide().prevAll('input[type="text"]:first').attr('id', id).show();
				// Note: `$input[0] != input` now!
			}
			$input.addClass('placeholder');
			$input[0].value = $input.attr('placeholder');
		} else {
			$input.removeClass('placeholder');
		}
	}

	function safeActiveElement() {
		// Avoid IE9 `document.activeElement` of death
		// https://github.com/mathiasbynens/jquery-placeholder/pull/99
		try {
			return document.activeElement;
		} catch (exception) {}
	}

}));

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiIiwic291cmNlcyI6WyJqcXVlcnktcGxhY2Vob2xkZXIvanF1ZXJ5LnBsYWNlaG9sZGVyLmpzIl0sInNvdXJjZXNDb250ZW50IjpbIi8qISBodHRwOi8vbXRocy5iZS9wbGFjZWhvbGRlciB2Mi4wLjkgYnkgQG1hdGhpYXMgKi9cbihmdW5jdGlvbihmYWN0b3J5KSB7XG5cdGlmICh0eXBlb2YgZGVmaW5lID09PSAnZnVuY3Rpb24nICYmIGRlZmluZS5hbWQpIHtcblx0XHQvLyBBTURcblx0XHRkZWZpbmUoWydqcXVlcnknXSwgZmFjdG9yeSk7XG5cdH0gZWxzZSB7XG5cdFx0Ly8gQnJvd3NlciBnbG9iYWxzXG5cdFx0ZmFjdG9yeShqUXVlcnkpO1xuXHR9XG59KGZ1bmN0aW9uKCQpIHtcblxuXHQvLyBPcGVyYSBNaW5pIHY3IGRvZXNu4oCZdCBzdXBwb3J0IHBsYWNlaG9sZGVyIGFsdGhvdWdoIGl0cyBET00gc2VlbXMgdG8gaW5kaWNhdGUgc29cblx0dmFyIGlzT3BlcmFNaW5pID0gT2JqZWN0LnByb3RvdHlwZS50b1N0cmluZy5jYWxsKHdpbmRvdy5vcGVyYW1pbmkpID09ICdbb2JqZWN0IE9wZXJhTWluaV0nO1xuXHR2YXIgaXNJbnB1dFN1cHBvcnRlZCA9ICdwbGFjZWhvbGRlcicgaW4gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnaW5wdXQnKSAmJiAhaXNPcGVyYU1pbmk7XG5cdHZhciBpc1RleHRhcmVhU3VwcG9ydGVkID0gJ3BsYWNlaG9sZGVyJyBpbiBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCd0ZXh0YXJlYScpICYmICFpc09wZXJhTWluaTtcblx0dmFyIHZhbEhvb2tzID0gJC52YWxIb29rcztcblx0dmFyIHByb3BIb29rcyA9ICQucHJvcEhvb2tzO1xuXHR2YXIgaG9va3M7XG5cdHZhciBwbGFjZWhvbGRlcjtcblxuXHRpZiAoaXNJbnB1dFN1cHBvcnRlZCAmJiBpc1RleHRhcmVhU3VwcG9ydGVkKSB7XG5cblx0XHRwbGFjZWhvbGRlciA9ICQuZm4ucGxhY2Vob2xkZXIgPSBmdW5jdGlvbigpIHtcblx0XHRcdHJldHVybiB0aGlzO1xuXHRcdH07XG5cblx0XHRwbGFjZWhvbGRlci5pbnB1dCA9IHBsYWNlaG9sZGVyLnRleHRhcmVhID0gdHJ1ZTtcblxuXHR9IGVsc2Uge1xuXG5cdFx0cGxhY2Vob2xkZXIgPSAkLmZuLnBsYWNlaG9sZGVyID0gZnVuY3Rpb24oKSB7XG5cdFx0XHR2YXIgJHRoaXMgPSB0aGlzO1xuXHRcdFx0JHRoaXNcblx0XHRcdFx0LmZpbHRlcigoaXNJbnB1dFN1cHBvcnRlZCA/ICd0ZXh0YXJlYScgOiAnOmlucHV0JykgKyAnW3BsYWNlaG9sZGVyXScpXG5cdFx0XHRcdC5ub3QoJy5wbGFjZWhvbGRlcicpXG5cdFx0XHRcdC5iaW5kKHtcblx0XHRcdFx0XHQnZm9jdXMucGxhY2Vob2xkZXInOiBjbGVhclBsYWNlaG9sZGVyLFxuXHRcdFx0XHRcdCdibHVyLnBsYWNlaG9sZGVyJzogc2V0UGxhY2Vob2xkZXJcblx0XHRcdFx0fSlcblx0XHRcdFx0LmRhdGEoJ3BsYWNlaG9sZGVyLWVuYWJsZWQnLCB0cnVlKVxuXHRcdFx0XHQudHJpZ2dlcignYmx1ci5wbGFjZWhvbGRlcicpO1xuXHRcdFx0cmV0dXJuICR0aGlzO1xuXHRcdH07XG5cblx0XHRwbGFjZWhvbGRlci5pbnB1dCA9IGlzSW5wdXRTdXBwb3J0ZWQ7XG5cdFx0cGxhY2Vob2xkZXIudGV4dGFyZWEgPSBpc1RleHRhcmVhU3VwcG9ydGVkO1xuXG5cdFx0aG9va3MgPSB7XG5cdFx0XHQnZ2V0JzogZnVuY3Rpb24oZWxlbWVudCkge1xuXHRcdFx0XHR2YXIgJGVsZW1lbnQgPSAkKGVsZW1lbnQpO1xuXG5cdFx0XHRcdHZhciAkcGFzc3dvcmRJbnB1dCA9ICRlbGVtZW50LmRhdGEoJ3BsYWNlaG9sZGVyLXBhc3N3b3JkJyk7XG5cdFx0XHRcdGlmICgkcGFzc3dvcmRJbnB1dCkge1xuXHRcdFx0XHRcdHJldHVybiAkcGFzc3dvcmRJbnB1dFswXS52YWx1ZTtcblx0XHRcdFx0fVxuXG5cdFx0XHRcdHJldHVybiAkZWxlbWVudC5kYXRhKCdwbGFjZWhvbGRlci1lbmFibGVkJykgJiYgJGVsZW1lbnQuaGFzQ2xhc3MoJ3BsYWNlaG9sZGVyJykgPyAnJyA6IGVsZW1lbnQudmFsdWU7XG5cdFx0XHR9LFxuXHRcdFx0J3NldCc6IGZ1bmN0aW9uKGVsZW1lbnQsIHZhbHVlKSB7XG5cdFx0XHRcdHZhciAkZWxlbWVudCA9ICQoZWxlbWVudCk7XG5cblx0XHRcdFx0dmFyICRwYXNzd29yZElucHV0ID0gJGVsZW1lbnQuZGF0YSgncGxhY2Vob2xkZXItcGFzc3dvcmQnKTtcblx0XHRcdFx0aWYgKCRwYXNzd29yZElucHV0KSB7XG5cdFx0XHRcdFx0cmV0dXJuICRwYXNzd29yZElucHV0WzBdLnZhbHVlID0gdmFsdWU7XG5cdFx0XHRcdH1cblxuXHRcdFx0XHRpZiAoISRlbGVtZW50LmRhdGEoJ3BsYWNlaG9sZGVyLWVuYWJsZWQnKSkge1xuXHRcdFx0XHRcdHJldHVybiBlbGVtZW50LnZhbHVlID0gdmFsdWU7XG5cdFx0XHRcdH1cblx0XHRcdFx0aWYgKHZhbHVlID09PSAnJykge1xuXHRcdFx0XHRcdGVsZW1lbnQudmFsdWUgPSB2YWx1ZTtcblx0XHRcdFx0XHQvLyBJc3N1ZSAjNTY6IFNldHRpbmcgdGhlIHBsYWNlaG9sZGVyIGNhdXNlcyBwcm9ibGVtcyBpZiB0aGUgZWxlbWVudCBjb250aW51ZXMgdG8gaGF2ZSBmb2N1cy5cblx0XHRcdFx0XHRpZiAoZWxlbWVudCAhPSBzYWZlQWN0aXZlRWxlbWVudCgpKSB7XG5cdFx0XHRcdFx0XHQvLyBXZSBjYW4ndCB1c2UgYHRyaWdnZXJIYW5kbGVyYCBoZXJlIGJlY2F1c2Ugb2YgZHVtbXkgdGV4dC9wYXNzd29yZCBpbnB1dHMgOihcblx0XHRcdFx0XHRcdHNldFBsYWNlaG9sZGVyLmNhbGwoZWxlbWVudCk7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9IGVsc2UgaWYgKCRlbGVtZW50Lmhhc0NsYXNzKCdwbGFjZWhvbGRlcicpKSB7XG5cdFx0XHRcdFx0Y2xlYXJQbGFjZWhvbGRlci5jYWxsKGVsZW1lbnQsIHRydWUsIHZhbHVlKSB8fCAoZWxlbWVudC52YWx1ZSA9IHZhbHVlKTtcblx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHRlbGVtZW50LnZhbHVlID0gdmFsdWU7XG5cdFx0XHRcdH1cblx0XHRcdFx0Ly8gYHNldGAgY2FuIG5vdCByZXR1cm4gYHVuZGVmaW5lZGA7IHNlZSBodHRwOi8vanNhcGkuaW5mby9qcXVlcnkvMS43LjEvdmFsI0wyMzYzXG5cdFx0XHRcdHJldHVybiAkZWxlbWVudDtcblx0XHRcdH1cblx0XHR9O1xuXG5cdFx0aWYgKCFpc0lucHV0U3VwcG9ydGVkKSB7XG5cdFx0XHR2YWxIb29rcy5pbnB1dCA9IGhvb2tzO1xuXHRcdFx0cHJvcEhvb2tzLnZhbHVlID0gaG9va3M7XG5cdFx0fVxuXHRcdGlmICghaXNUZXh0YXJlYVN1cHBvcnRlZCkge1xuXHRcdFx0dmFsSG9va3MudGV4dGFyZWEgPSBob29rcztcblx0XHRcdHByb3BIb29rcy52YWx1ZSA9IGhvb2tzO1xuXHRcdH1cblxuXHRcdCQoZnVuY3Rpb24oKSB7XG5cdFx0XHQvLyBMb29rIGZvciBmb3Jtc1xuXHRcdFx0JChkb2N1bWVudCkuZGVsZWdhdGUoJ2Zvcm0nLCAnc3VibWl0LnBsYWNlaG9sZGVyJywgZnVuY3Rpb24oKSB7XG5cdFx0XHRcdC8vIENsZWFyIHRoZSBwbGFjZWhvbGRlciB2YWx1ZXMgc28gdGhleSBkb24ndCBnZXQgc3VibWl0dGVkXG5cdFx0XHRcdHZhciAkaW5wdXRzID0gJCgnLnBsYWNlaG9sZGVyJywgdGhpcykuZWFjaChjbGVhclBsYWNlaG9sZGVyKTtcblx0XHRcdFx0c2V0VGltZW91dChmdW5jdGlvbigpIHtcblx0XHRcdFx0XHQkaW5wdXRzLmVhY2goc2V0UGxhY2Vob2xkZXIpO1xuXHRcdFx0XHR9LCAxMCk7XG5cdFx0XHR9KTtcblx0XHR9KTtcblxuXHRcdC8vIENsZWFyIHBsYWNlaG9sZGVyIHZhbHVlcyB1cG9uIHBhZ2UgcmVsb2FkXG5cdFx0JCh3aW5kb3cpLmJpbmQoJ2JlZm9yZXVubG9hZC5wbGFjZWhvbGRlcicsIGZ1bmN0aW9uKCkge1xuXHRcdFx0JCgnLnBsYWNlaG9sZGVyJykuZWFjaChmdW5jdGlvbigpIHtcblx0XHRcdFx0dGhpcy52YWx1ZSA9ICcnO1xuXHRcdFx0fSk7XG5cdFx0fSk7XG5cblx0fVxuXG5cdGZ1bmN0aW9uIGFyZ3MoZWxlbSkge1xuXHRcdC8vIFJldHVybiBhbiBvYmplY3Qgb2YgZWxlbWVudCBhdHRyaWJ1dGVzXG5cdFx0dmFyIG5ld0F0dHJzID0ge307XG5cdFx0dmFyIHJpbmxpbmVqUXVlcnkgPSAvXmpRdWVyeVxcZCskLztcblx0XHQkLmVhY2goZWxlbS5hdHRyaWJ1dGVzLCBmdW5jdGlvbihpLCBhdHRyKSB7XG5cdFx0XHRpZiAoYXR0ci5zcGVjaWZpZWQgJiYgIXJpbmxpbmVqUXVlcnkudGVzdChhdHRyLm5hbWUpKSB7XG5cdFx0XHRcdG5ld0F0dHJzW2F0dHIubmFtZV0gPSBhdHRyLnZhbHVlO1xuXHRcdFx0fVxuXHRcdH0pO1xuXHRcdHJldHVybiBuZXdBdHRycztcblx0fVxuXG5cdGZ1bmN0aW9uIGNsZWFyUGxhY2Vob2xkZXIoZXZlbnQsIHZhbHVlKSB7XG5cdFx0dmFyIGlucHV0ID0gdGhpcztcblx0XHR2YXIgJGlucHV0ID0gJChpbnB1dCk7XG5cdFx0aWYgKGlucHV0LnZhbHVlID09ICRpbnB1dC5hdHRyKCdwbGFjZWhvbGRlcicpICYmICRpbnB1dC5oYXNDbGFzcygncGxhY2Vob2xkZXInKSkge1xuXHRcdFx0aWYgKCRpbnB1dC5kYXRhKCdwbGFjZWhvbGRlci1wYXNzd29yZCcpKSB7XG5cdFx0XHRcdCRpbnB1dCA9ICRpbnB1dC5oaWRlKCkubmV4dEFsbCgnaW5wdXRbdHlwZT1cInBhc3N3b3JkXCJdOmZpcnN0Jykuc2hvdygpLmF0dHIoJ2lkJywgJGlucHV0LnJlbW92ZUF0dHIoJ2lkJykuZGF0YSgncGxhY2Vob2xkZXItaWQnKSk7XG5cdFx0XHRcdC8vIElmIGBjbGVhclBsYWNlaG9sZGVyYCB3YXMgY2FsbGVkIGZyb20gYCQudmFsSG9va3MuaW5wdXQuc2V0YFxuXHRcdFx0XHRpZiAoZXZlbnQgPT09IHRydWUpIHtcblx0XHRcdFx0XHRyZXR1cm4gJGlucHV0WzBdLnZhbHVlID0gdmFsdWU7XG5cdFx0XHRcdH1cblx0XHRcdFx0JGlucHV0LmZvY3VzKCk7XG5cdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRpbnB1dC52YWx1ZSA9ICcnO1xuXHRcdFx0XHQkaW5wdXQucmVtb3ZlQ2xhc3MoJ3BsYWNlaG9sZGVyJyk7XG5cdFx0XHRcdGlucHV0ID09IHNhZmVBY3RpdmVFbGVtZW50KCkgJiYgaW5wdXQuc2VsZWN0KCk7XG5cdFx0XHR9XG5cdFx0fVxuXHR9XG5cblx0ZnVuY3Rpb24gc2V0UGxhY2Vob2xkZXIoKSB7XG5cdFx0dmFyICRyZXBsYWNlbWVudDtcblx0XHR2YXIgaW5wdXQgPSB0aGlzO1xuXHRcdHZhciAkaW5wdXQgPSAkKGlucHV0KTtcblx0XHR2YXIgaWQgPSB0aGlzLmlkO1xuXHRcdGlmIChpbnB1dC52YWx1ZSA9PT0gJycpIHtcblx0XHRcdGlmIChpbnB1dC50eXBlID09PSAncGFzc3dvcmQnKSB7XG5cdFx0XHRcdGlmICghJGlucHV0LmRhdGEoJ3BsYWNlaG9sZGVyLXRleHRpbnB1dCcpKSB7XG5cdFx0XHRcdFx0dHJ5IHtcblx0XHRcdFx0XHRcdCRyZXBsYWNlbWVudCA9ICRpbnB1dC5jbG9uZSgpLmF0dHIoeyAndHlwZSc6ICd0ZXh0JyB9KTtcblx0XHRcdFx0XHR9IGNhdGNoKGUpIHtcblx0XHRcdFx0XHRcdCRyZXBsYWNlbWVudCA9ICQoJzxpbnB1dD4nKS5hdHRyKCQuZXh0ZW5kKGFyZ3ModGhpcyksIHsgJ3R5cGUnOiAndGV4dCcgfSkpO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0XHQkcmVwbGFjZW1lbnRcblx0XHRcdFx0XHRcdC5yZW1vdmVBdHRyKCduYW1lJylcblx0XHRcdFx0XHRcdC5kYXRhKHtcblx0XHRcdFx0XHRcdFx0J3BsYWNlaG9sZGVyLXBhc3N3b3JkJzogJGlucHV0LFxuXHRcdFx0XHRcdFx0XHQncGxhY2Vob2xkZXItaWQnOiBpZFxuXHRcdFx0XHRcdFx0fSlcblx0XHRcdFx0XHRcdC5iaW5kKCdmb2N1cy5wbGFjZWhvbGRlcicsIGNsZWFyUGxhY2Vob2xkZXIpO1xuXHRcdFx0XHRcdCRpbnB1dFxuXHRcdFx0XHRcdFx0LmRhdGEoe1xuXHRcdFx0XHRcdFx0XHQncGxhY2Vob2xkZXItdGV4dGlucHV0JzogJHJlcGxhY2VtZW50LFxuXHRcdFx0XHRcdFx0XHQncGxhY2Vob2xkZXItaWQnOiBpZFxuXHRcdFx0XHRcdFx0fSlcblx0XHRcdFx0XHRcdC5iZWZvcmUoJHJlcGxhY2VtZW50KTtcblx0XHRcdFx0fVxuXHRcdFx0XHQkaW5wdXQgPSAkaW5wdXQucmVtb3ZlQXR0cignaWQnKS5oaWRlKCkucHJldkFsbCgnaW5wdXRbdHlwZT1cInRleHRcIl06Zmlyc3QnKS5hdHRyKCdpZCcsIGlkKS5zaG93KCk7XG5cdFx0XHRcdC8vIE5vdGU6IGAkaW5wdXRbMF0gIT0gaW5wdXRgIG5vdyFcblx0XHRcdH1cblx0XHRcdCRpbnB1dC5hZGRDbGFzcygncGxhY2Vob2xkZXInKTtcblx0XHRcdCRpbnB1dFswXS52YWx1ZSA9ICRpbnB1dC5hdHRyKCdwbGFjZWhvbGRlcicpO1xuXHRcdH0gZWxzZSB7XG5cdFx0XHQkaW5wdXQucmVtb3ZlQ2xhc3MoJ3BsYWNlaG9sZGVyJyk7XG5cdFx0fVxuXHR9XG5cblx0ZnVuY3Rpb24gc2FmZUFjdGl2ZUVsZW1lbnQoKSB7XG5cdFx0Ly8gQXZvaWQgSUU5IGBkb2N1bWVudC5hY3RpdmVFbGVtZW50YCBvZiBkZWF0aFxuXHRcdC8vIGh0dHBzOi8vZ2l0aHViLmNvbS9tYXRoaWFzYnluZW5zL2pxdWVyeS1wbGFjZWhvbGRlci9wdWxsLzk5XG5cdFx0dHJ5IHtcblx0XHRcdHJldHVybiBkb2N1bWVudC5hY3RpdmVFbGVtZW50O1xuXHRcdH0gY2F0Y2ggKGV4Y2VwdGlvbikge31cblx0fVxuXG59KSk7XG4iXSwiZmlsZSI6ImpxdWVyeS1wbGFjZWhvbGRlci9qcXVlcnkucGxhY2Vob2xkZXIuanMiLCJzb3VyY2VSb290IjoiL3NvdXJjZS8ifQ==