// by james a rosen.
// https://github.com/Modernizr/Modernizr/issues/258

Modernizr.addTest('createelement-attrs', function() {
  try {
    return document.createElement("<input name='test' />").getAttribute('name') == 'test';
  } catch(e) {
    return false;
  }
});


//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiIiwic291cmNlcyI6WyJtb2Rlcm5penIvZmVhdHVyZS1kZXRlY3RzL2RvbS1jcmVhdGVFbGVtZW50LWF0dHJzLmpzIl0sInNvdXJjZXNDb250ZW50IjpbIi8vIGJ5IGphbWVzIGEgcm9zZW4uXG4vLyBodHRwczovL2dpdGh1Yi5jb20vTW9kZXJuaXpyL01vZGVybml6ci9pc3N1ZXMvMjU4XG5cbk1vZGVybml6ci5hZGRUZXN0KCdjcmVhdGVlbGVtZW50LWF0dHJzJywgZnVuY3Rpb24oKSB7XG4gIHRyeSB7XG4gICAgcmV0dXJuIGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCI8aW5wdXQgbmFtZT0ndGVzdCcgLz5cIikuZ2V0QXR0cmlidXRlKCduYW1lJykgPT0gJ3Rlc3QnO1xuICB9IGNhdGNoKGUpIHtcbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cbn0pO1xuXG4iXSwiZmlsZSI6Im1vZGVybml6ci9mZWF0dXJlLWRldGVjdHMvZG9tLWNyZWF0ZUVsZW1lbnQtYXR0cnMuanMiLCJzb3VyY2VSb290IjoiL3NvdXJjZS8ifQ==