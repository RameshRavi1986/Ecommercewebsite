// Requires a Modernizr build with `canvastext` included
// http://www.modernizr.com/download/#-canvas-canvastext
Modernizr.addTest('emoji', function() {
  if (!Modernizr.canvastext) return false;
  var node = document.createElement('canvas'),
      ctx = node.getContext('2d');
  ctx.textBaseline = 'top';
  ctx.font = '32px Arial';
  ctx.fillText('\ud83d\ude03', 0, 0); // "smiling face with open mouth" emoji
  return ctx.getImageData(16, 16, 1, 1).data[0] !== 0;
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiIiwic291cmNlcyI6WyJtb2Rlcm5penIvZmVhdHVyZS1kZXRlY3RzL2Vtb2ppLmpzIl0sInNvdXJjZXNDb250ZW50IjpbIi8vIFJlcXVpcmVzIGEgTW9kZXJuaXpyIGJ1aWxkIHdpdGggYGNhbnZhc3RleHRgIGluY2x1ZGVkXG4vLyBodHRwOi8vd3d3Lm1vZGVybml6ci5jb20vZG93bmxvYWQvIy1jYW52YXMtY2FudmFzdGV4dFxuTW9kZXJuaXpyLmFkZFRlc3QoJ2Vtb2ppJywgZnVuY3Rpb24oKSB7XG4gIGlmICghTW9kZXJuaXpyLmNhbnZhc3RleHQpIHJldHVybiBmYWxzZTtcbiAgdmFyIG5vZGUgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdjYW52YXMnKSxcbiAgICAgIGN0eCA9IG5vZGUuZ2V0Q29udGV4dCgnMmQnKTtcbiAgY3R4LnRleHRCYXNlbGluZSA9ICd0b3AnO1xuICBjdHguZm9udCA9ICczMnB4IEFyaWFsJztcbiAgY3R4LmZpbGxUZXh0KCdcXHVkODNkXFx1ZGUwMycsIDAsIDApOyAvLyBcInNtaWxpbmcgZmFjZSB3aXRoIG9wZW4gbW91dGhcIiBlbW9qaVxuICByZXR1cm4gY3R4LmdldEltYWdlRGF0YSgxNiwgMTYsIDEsIDEpLmRhdGFbMF0gIT09IDA7XG59KTsiXSwiZmlsZSI6Im1vZGVybml6ci9mZWF0dXJlLWRldGVjdHMvZW1vamkuanMiLCJzb3VyY2VSb290IjoiL3NvdXJjZS8ifQ==