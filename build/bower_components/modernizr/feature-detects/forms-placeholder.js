// testing for placeholder attribute in inputs and textareas
// re-using Modernizr.input if available

Modernizr.addTest('placeholder', function(){

  return !!( 'placeholder' in ( Modernizr.input    || document.createElement('input')    ) && 
             'placeholder' in ( Modernizr.textarea || document.createElement('textarea') )
           );

});

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiIiwic291cmNlcyI6WyJtb2Rlcm5penIvZmVhdHVyZS1kZXRlY3RzL2Zvcm1zLXBsYWNlaG9sZGVyLmpzIl0sInNvdXJjZXNDb250ZW50IjpbIi8vIHRlc3RpbmcgZm9yIHBsYWNlaG9sZGVyIGF0dHJpYnV0ZSBpbiBpbnB1dHMgYW5kIHRleHRhcmVhc1xuLy8gcmUtdXNpbmcgTW9kZXJuaXpyLmlucHV0IGlmIGF2YWlsYWJsZVxuXG5Nb2Rlcm5penIuYWRkVGVzdCgncGxhY2Vob2xkZXInLCBmdW5jdGlvbigpe1xuXG4gIHJldHVybiAhISggJ3BsYWNlaG9sZGVyJyBpbiAoIE1vZGVybml6ci5pbnB1dCAgICB8fCBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdpbnB1dCcpICAgICkgJiYgXG4gICAgICAgICAgICAgJ3BsYWNlaG9sZGVyJyBpbiAoIE1vZGVybml6ci50ZXh0YXJlYSB8fCBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCd0ZXh0YXJlYScpIClcbiAgICAgICAgICAgKTtcblxufSk7XG4iXSwiZmlsZSI6Im1vZGVybml6ci9mZWF0dXJlLWRldGVjdHMvZm9ybXMtcGxhY2Vob2xkZXIuanMiLCJzb3VyY2VSb290IjoiL3NvdXJjZS8ifQ==