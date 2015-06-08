
// binaryType is truthy if there is support.. returns "blob" in new-ish chrome.
// plus.google.com/115535723976198353696/posts/ERN6zYozENV
// github.com/Modernizr/Modernizr/issues/370

Modernizr.addTest('websocketsbinary', function() {
  var protocol = 'https:'==location.protocol?'wss':'ws',
  protoBin;

  if('WebSocket' in window) {
    if( protoBin = 'binaryType' in WebSocket.prototype ) {
      return protoBin;
    }
    try {
      return !!(new WebSocket(protocol+'://.').binaryType);
    } catch (e){}
  }

  return false;
});

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiIiwic291cmNlcyI6WyJtb2Rlcm5penIvZmVhdHVyZS1kZXRlY3RzL3dlYnNvY2tldHMtYmluYXJ5LmpzIl0sInNvdXJjZXNDb250ZW50IjpbIlxuLy8gYmluYXJ5VHlwZSBpcyB0cnV0aHkgaWYgdGhlcmUgaXMgc3VwcG9ydC4uIHJldHVybnMgXCJibG9iXCIgaW4gbmV3LWlzaCBjaHJvbWUuXG4vLyBwbHVzLmdvb2dsZS5jb20vMTE1NTM1NzIzOTc2MTk4MzUzNjk2L3Bvc3RzL0VSTjZ6WW96RU5WXG4vLyBnaXRodWIuY29tL01vZGVybml6ci9Nb2Rlcm5penIvaXNzdWVzLzM3MFxuXG5Nb2Rlcm5penIuYWRkVGVzdCgnd2Vic29ja2V0c2JpbmFyeScsIGZ1bmN0aW9uKCkge1xuICB2YXIgcHJvdG9jb2wgPSAnaHR0cHM6Jz09bG9jYXRpb24ucHJvdG9jb2w/J3dzcyc6J3dzJyxcbiAgcHJvdG9CaW47XG5cbiAgaWYoJ1dlYlNvY2tldCcgaW4gd2luZG93KSB7XG4gICAgaWYoIHByb3RvQmluID0gJ2JpbmFyeVR5cGUnIGluIFdlYlNvY2tldC5wcm90b3R5cGUgKSB7XG4gICAgICByZXR1cm4gcHJvdG9CaW47XG4gICAgfVxuICAgIHRyeSB7XG4gICAgICByZXR1cm4gISEobmV3IFdlYlNvY2tldChwcm90b2NvbCsnOi8vLicpLmJpbmFyeVR5cGUpO1xuICAgIH0gY2F0Y2ggKGUpe31cbiAgfVxuXG4gIHJldHVybiBmYWxzZTtcbn0pO1xuIl0sImZpbGUiOiJtb2Rlcm5penIvZmVhdHVyZS1kZXRlY3RzL3dlYnNvY2tldHMtYmluYXJ5LmpzIiwic291cmNlUm9vdCI6Ii9zb3VyY2UvIn0=