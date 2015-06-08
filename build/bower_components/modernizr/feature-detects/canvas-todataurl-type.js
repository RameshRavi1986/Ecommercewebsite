// canvas.toDataURL type support
// http://www.w3.org/TR/html5/the-canvas-element.html#dom-canvas-todataurl

// This test is asynchronous. Watch out.

(function () {

    if (!Modernizr.canvas) {
        return false;
    }

    var image = new Image(),
        canvas = document.createElement('canvas'),
        ctx = canvas.getContext('2d');

    image.onload = function() {
        ctx.drawImage(image, 0, 0);

        Modernizr.addTest('todataurljpeg', function() {
            return canvas.toDataURL('image/jpeg').indexOf('data:image/jpeg') === 0;
        });
        Modernizr.addTest('todataurlwebp', function() {
            return canvas.toDataURL('image/webp').indexOf('data:image/webp') === 0;
        });
    };

    image.src = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAACklEQVR4nGMAAQAABQABDQottAAAAABJRU5ErkJggg==';
}());

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiIiwic291cmNlcyI6WyJtb2Rlcm5penIvZmVhdHVyZS1kZXRlY3RzL2NhbnZhcy10b2RhdGF1cmwtdHlwZS5qcyJdLCJzb3VyY2VzQ29udGVudCI6WyIvLyBjYW52YXMudG9EYXRhVVJMIHR5cGUgc3VwcG9ydFxuLy8gaHR0cDovL3d3dy53My5vcmcvVFIvaHRtbDUvdGhlLWNhbnZhcy1lbGVtZW50Lmh0bWwjZG9tLWNhbnZhcy10b2RhdGF1cmxcblxuLy8gVGhpcyB0ZXN0IGlzIGFzeW5jaHJvbm91cy4gV2F0Y2ggb3V0LlxuXG4oZnVuY3Rpb24gKCkge1xuXG4gICAgaWYgKCFNb2Rlcm5penIuY2FudmFzKSB7XG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG5cbiAgICB2YXIgaW1hZ2UgPSBuZXcgSW1hZ2UoKSxcbiAgICAgICAgY2FudmFzID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnY2FudmFzJyksXG4gICAgICAgIGN0eCA9IGNhbnZhcy5nZXRDb250ZXh0KCcyZCcpO1xuXG4gICAgaW1hZ2Uub25sb2FkID0gZnVuY3Rpb24oKSB7XG4gICAgICAgIGN0eC5kcmF3SW1hZ2UoaW1hZ2UsIDAsIDApO1xuXG4gICAgICAgIE1vZGVybml6ci5hZGRUZXN0KCd0b2RhdGF1cmxqcGVnJywgZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICByZXR1cm4gY2FudmFzLnRvRGF0YVVSTCgnaW1hZ2UvanBlZycpLmluZGV4T2YoJ2RhdGE6aW1hZ2UvanBlZycpID09PSAwO1xuICAgICAgICB9KTtcbiAgICAgICAgTW9kZXJuaXpyLmFkZFRlc3QoJ3RvZGF0YXVybHdlYnAnLCBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIHJldHVybiBjYW52YXMudG9EYXRhVVJMKCdpbWFnZS93ZWJwJykuaW5kZXhPZignZGF0YTppbWFnZS93ZWJwJykgPT09IDA7XG4gICAgICAgIH0pO1xuICAgIH07XG5cbiAgICBpbWFnZS5zcmMgPSAnZGF0YTppbWFnZS9wbmc7YmFzZTY0LGlWQk9SdzBLR2dvQUFBQU5TVWhFVWdBQUFBRUFBQUFCQ0FZQUFBQWZGY1NKQUFBQUNrbEVRVlI0bkdNQUFRQUFCUUFCRFFvdHRBQUFBQUJKUlU1RXJrSmdnZz09Jztcbn0oKSk7XG4iXSwiZmlsZSI6Im1vZGVybml6ci9mZWF0dXJlLWRldGVjdHMvY2FudmFzLXRvZGF0YXVybC10eXBlLmpzIiwic291cmNlUm9vdCI6Ii9zb3VyY2UvIn0=