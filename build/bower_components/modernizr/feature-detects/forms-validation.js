// This implementation only tests support for interactive form validation.
// To check validation for a specific type or a specific other constraint,
// the test can be combined: 
//    - Modernizr.inputtypes.numer && Modernizr.formvalidation (browser supports rangeOverflow, typeMismatch etc. for type=number)
//    - Modernizr.input.required && Modernizr.formvalidation (browser supports valueMissing)
//
(function(document, Modernizr){


  Modernizr.formvalidationapi = false;
  Modernizr.formvalidationmessage = false;

  Modernizr.addTest('formvalidation', function() {
    var form = document.createElement('form');
    if ( !('checkValidity' in form) || !('addEventListener' in form) ) {
      return false;
    }
    if ('reportValidity' in form) {
      return true;
    }
    var invalidFired = false;
    var input;

    Modernizr.formvalidationapi =  true;

    // Prevent form from being submitted
    form.addEventListener('submit', function(e) {
      //Opera does not validate form, if submit is prevented
      if ( !window.opera ) {
        e.preventDefault();
      }
      e.stopPropagation();
    }, false);

    // Calling form.submit() doesn't trigger interactive validation,
    // use a submit button instead
    //older opera browsers need a name attribute
    form.innerHTML = '<input name="modTest" required><button></button>';

    Modernizr.testStyles('#modernizr form{position:absolute;top:-99999em}', function( node ) {
      node.appendChild(form);

      input = form.getElementsByTagName('input')[0];

      // Record whether "invalid" event is fired
      input.addEventListener('invalid', function(e) {
        invalidFired = true;
        e.preventDefault();
        e.stopPropagation();
      }, false);

      //Opera does not fully support the validationMessage property
      Modernizr.formvalidationmessage = !!input.validationMessage;

      // Submit form by clicking submit button
      form.getElementsByTagName('button')[0].click();
    });

    return invalidFired;
  });

})(document, window.Modernizr);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiIiwic291cmNlcyI6WyJtb2Rlcm5penIvZmVhdHVyZS1kZXRlY3RzL2Zvcm1zLXZhbGlkYXRpb24uanMiXSwic291cmNlc0NvbnRlbnQiOlsiLy8gVGhpcyBpbXBsZW1lbnRhdGlvbiBvbmx5IHRlc3RzIHN1cHBvcnQgZm9yIGludGVyYWN0aXZlIGZvcm0gdmFsaWRhdGlvbi5cbi8vIFRvIGNoZWNrIHZhbGlkYXRpb24gZm9yIGEgc3BlY2lmaWMgdHlwZSBvciBhIHNwZWNpZmljIG90aGVyIGNvbnN0cmFpbnQsXG4vLyB0aGUgdGVzdCBjYW4gYmUgY29tYmluZWQ6IFxuLy8gICAgLSBNb2Rlcm5penIuaW5wdXR0eXBlcy5udW1lciAmJiBNb2Rlcm5penIuZm9ybXZhbGlkYXRpb24gKGJyb3dzZXIgc3VwcG9ydHMgcmFuZ2VPdmVyZmxvdywgdHlwZU1pc21hdGNoIGV0Yy4gZm9yIHR5cGU9bnVtYmVyKVxuLy8gICAgLSBNb2Rlcm5penIuaW5wdXQucmVxdWlyZWQgJiYgTW9kZXJuaXpyLmZvcm12YWxpZGF0aW9uIChicm93c2VyIHN1cHBvcnRzIHZhbHVlTWlzc2luZylcbi8vXG4oZnVuY3Rpb24oZG9jdW1lbnQsIE1vZGVybml6cil7XG5cblxuICBNb2Rlcm5penIuZm9ybXZhbGlkYXRpb25hcGkgPSBmYWxzZTtcbiAgTW9kZXJuaXpyLmZvcm12YWxpZGF0aW9ubWVzc2FnZSA9IGZhbHNlO1xuXG4gIE1vZGVybml6ci5hZGRUZXN0KCdmb3JtdmFsaWRhdGlvbicsIGZ1bmN0aW9uKCkge1xuICAgIHZhciBmb3JtID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZm9ybScpO1xuICAgIGlmICggISgnY2hlY2tWYWxpZGl0eScgaW4gZm9ybSkgfHwgISgnYWRkRXZlbnRMaXN0ZW5lcicgaW4gZm9ybSkgKSB7XG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuICAgIGlmICgncmVwb3J0VmFsaWRpdHknIGluIGZvcm0pIHtcbiAgICAgIHJldHVybiB0cnVlO1xuICAgIH1cbiAgICB2YXIgaW52YWxpZEZpcmVkID0gZmFsc2U7XG4gICAgdmFyIGlucHV0O1xuXG4gICAgTW9kZXJuaXpyLmZvcm12YWxpZGF0aW9uYXBpID0gIHRydWU7XG5cbiAgICAvLyBQcmV2ZW50IGZvcm0gZnJvbSBiZWluZyBzdWJtaXR0ZWRcbiAgICBmb3JtLmFkZEV2ZW50TGlzdGVuZXIoJ3N1Ym1pdCcsIGZ1bmN0aW9uKGUpIHtcbiAgICAgIC8vT3BlcmEgZG9lcyBub3QgdmFsaWRhdGUgZm9ybSwgaWYgc3VibWl0IGlzIHByZXZlbnRlZFxuICAgICAgaWYgKCAhd2luZG93Lm9wZXJhICkge1xuICAgICAgICBlLnByZXZlbnREZWZhdWx0KCk7XG4gICAgICB9XG4gICAgICBlLnN0b3BQcm9wYWdhdGlvbigpO1xuICAgIH0sIGZhbHNlKTtcblxuICAgIC8vIENhbGxpbmcgZm9ybS5zdWJtaXQoKSBkb2Vzbid0IHRyaWdnZXIgaW50ZXJhY3RpdmUgdmFsaWRhdGlvbixcbiAgICAvLyB1c2UgYSBzdWJtaXQgYnV0dG9uIGluc3RlYWRcbiAgICAvL29sZGVyIG9wZXJhIGJyb3dzZXJzIG5lZWQgYSBuYW1lIGF0dHJpYnV0ZVxuICAgIGZvcm0uaW5uZXJIVE1MID0gJzxpbnB1dCBuYW1lPVwibW9kVGVzdFwiIHJlcXVpcmVkPjxidXR0b24+PC9idXR0b24+JztcblxuICAgIE1vZGVybml6ci50ZXN0U3R5bGVzKCcjbW9kZXJuaXpyIGZvcm17cG9zaXRpb246YWJzb2x1dGU7dG9wOi05OTk5OWVtfScsIGZ1bmN0aW9uKCBub2RlICkge1xuICAgICAgbm9kZS5hcHBlbmRDaGlsZChmb3JtKTtcblxuICAgICAgaW5wdXQgPSBmb3JtLmdldEVsZW1lbnRzQnlUYWdOYW1lKCdpbnB1dCcpWzBdO1xuXG4gICAgICAvLyBSZWNvcmQgd2hldGhlciBcImludmFsaWRcIiBldmVudCBpcyBmaXJlZFxuICAgICAgaW5wdXQuYWRkRXZlbnRMaXN0ZW5lcignaW52YWxpZCcsIGZ1bmN0aW9uKGUpIHtcbiAgICAgICAgaW52YWxpZEZpcmVkID0gdHJ1ZTtcbiAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgICBlLnN0b3BQcm9wYWdhdGlvbigpO1xuICAgICAgfSwgZmFsc2UpO1xuXG4gICAgICAvL09wZXJhIGRvZXMgbm90IGZ1bGx5IHN1cHBvcnQgdGhlIHZhbGlkYXRpb25NZXNzYWdlIHByb3BlcnR5XG4gICAgICBNb2Rlcm5penIuZm9ybXZhbGlkYXRpb25tZXNzYWdlID0gISFpbnB1dC52YWxpZGF0aW9uTWVzc2FnZTtcblxuICAgICAgLy8gU3VibWl0IGZvcm0gYnkgY2xpY2tpbmcgc3VibWl0IGJ1dHRvblxuICAgICAgZm9ybS5nZXRFbGVtZW50c0J5VGFnTmFtZSgnYnV0dG9uJylbMF0uY2xpY2soKTtcbiAgICB9KTtcblxuICAgIHJldHVybiBpbnZhbGlkRmlyZWQ7XG4gIH0pO1xuXG59KShkb2N1bWVudCwgd2luZG93Lk1vZGVybml6cik7XG4iXSwiZmlsZSI6Im1vZGVybml6ci9mZWF0dXJlLWRldGVjdHMvZm9ybXMtdmFsaWRhdGlvbi5qcyIsInNvdXJjZVJvb3QiOiIvc291cmNlLyJ9