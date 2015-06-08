// code.google.com/speed/webp/
// by rich bradshaw, ryan seddon, and paul irish


// This test is asynchronous. Watch out.

(function(){

  var image = new Image();

  image.onerror = function() {
      Modernizr.addTest('webp', false);
  };  
  image.onload = function() {
      Modernizr.addTest('webp', function() { return image.width == 1; });
  };

  image.src = 'data:image/webp;base64,UklGRiwAAABXRUJQVlA4ICAAAAAUAgCdASoBAAEAL/3+/3+CAB/AAAFzrNsAAP5QAAAAAA==';

}());
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiIiwic291cmNlcyI6WyJtb2Rlcm5penIvZmVhdHVyZS1kZXRlY3RzL2ltZy13ZWJwLmpzIl0sInNvdXJjZXNDb250ZW50IjpbIi8vIGNvZGUuZ29vZ2xlLmNvbS9zcGVlZC93ZWJwL1xuLy8gYnkgcmljaCBicmFkc2hhdywgcnlhbiBzZWRkb24sIGFuZCBwYXVsIGlyaXNoXG5cblxuLy8gVGhpcyB0ZXN0IGlzIGFzeW5jaHJvbm91cy4gV2F0Y2ggb3V0LlxuXG4oZnVuY3Rpb24oKXtcblxuICB2YXIgaW1hZ2UgPSBuZXcgSW1hZ2UoKTtcblxuICBpbWFnZS5vbmVycm9yID0gZnVuY3Rpb24oKSB7XG4gICAgICBNb2Rlcm5penIuYWRkVGVzdCgnd2VicCcsIGZhbHNlKTtcbiAgfTsgIFxuICBpbWFnZS5vbmxvYWQgPSBmdW5jdGlvbigpIHtcbiAgICAgIE1vZGVybml6ci5hZGRUZXN0KCd3ZWJwJywgZnVuY3Rpb24oKSB7IHJldHVybiBpbWFnZS53aWR0aCA9PSAxOyB9KTtcbiAgfTtcblxuICBpbWFnZS5zcmMgPSAnZGF0YTppbWFnZS93ZWJwO2Jhc2U2NCxVa2xHUml3QUFBQlhSVUpRVmxBNElDQUFBQUFVQWdDZEFTb0JBQUVBTC8zKy8zK0NBQi9BQUFGenJOc0FBUDVRQUFBQUFBPT0nO1xuXG59KCkpOyJdLCJmaWxlIjoibW9kZXJuaXpyL2ZlYXR1cmUtZGV0ZWN0cy9pbWctd2VicC5qcyIsInNvdXJjZVJvb3QiOiIvc291cmNlLyJ9