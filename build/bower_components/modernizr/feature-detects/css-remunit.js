
// test by github.com/nsfmc

// "The 'rem' unit ('root em') is relative to the computed
// value of the 'font-size' value of the root element."
// http://www.w3.org/TR/css3-values/#relative0
// you can test by checking if the prop was ditched

// http://snook.ca/archives/html_and_css/font-size-with-rem

Modernizr.addTest('cssremunit', function(){

  var div = document.createElement('div');
  try {
    div.style.fontSize = '3rem';
  } catch(er){}
  return (/rem/).test(div.style.fontSize);

});

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiIiwic291cmNlcyI6WyJtb2Rlcm5penIvZmVhdHVyZS1kZXRlY3RzL2Nzcy1yZW11bml0LmpzIl0sInNvdXJjZXNDb250ZW50IjpbIlxuLy8gdGVzdCBieSBnaXRodWIuY29tL25zZm1jXG5cbi8vIFwiVGhlICdyZW0nIHVuaXQgKCdyb290IGVtJykgaXMgcmVsYXRpdmUgdG8gdGhlIGNvbXB1dGVkXG4vLyB2YWx1ZSBvZiB0aGUgJ2ZvbnQtc2l6ZScgdmFsdWUgb2YgdGhlIHJvb3QgZWxlbWVudC5cIlxuLy8gaHR0cDovL3d3dy53My5vcmcvVFIvY3NzMy12YWx1ZXMvI3JlbGF0aXZlMFxuLy8geW91IGNhbiB0ZXN0IGJ5IGNoZWNraW5nIGlmIHRoZSBwcm9wIHdhcyBkaXRjaGVkXG5cbi8vIGh0dHA6Ly9zbm9vay5jYS9hcmNoaXZlcy9odG1sX2FuZF9jc3MvZm9udC1zaXplLXdpdGgtcmVtXG5cbk1vZGVybml6ci5hZGRUZXN0KCdjc3NyZW11bml0JywgZnVuY3Rpb24oKXtcblxuICB2YXIgZGl2ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG4gIHRyeSB7XG4gICAgZGl2LnN0eWxlLmZvbnRTaXplID0gJzNyZW0nO1xuICB9IGNhdGNoKGVyKXt9XG4gIHJldHVybiAoL3JlbS8pLnRlc3QoZGl2LnN0eWxlLmZvbnRTaXplKTtcblxufSk7XG4iXSwiZmlsZSI6Im1vZGVybml6ci9mZWF0dXJlLWRldGVjdHMvY3NzLXJlbXVuaXQuanMiLCJzb3VyY2VSb290IjoiL3NvdXJjZS8ifQ==