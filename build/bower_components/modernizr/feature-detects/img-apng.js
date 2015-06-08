// Animated PNG
// http://en.wikipedia.org/wiki/APNG
// By Addy Osmani
(function () {

    if (!Modernizr.canvas) return false;
    
    var image = new Image(),
        canvas = document.createElement('canvas'),
        ctx = canvas.getContext('2d');


    image.onload = function () {
        Modernizr.addTest('apng', function () {
            if (typeof canvas.getContext == 'undefined') {
                return false;
            } else {
                ctx.drawImage(image, 0, 0);
                return ctx.getImageData(0, 0, 1, 1).data[3] === 0;
            }
        });
    };

    image.src = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAACGFjVEwAAAABAAAAAcMq2TYAAAANSURBVAiZY2BgYPgPAAEEAQB9ssjfAAAAGmZjVEwAAAAAAAAAAQAAAAEAAAAAAAAAAAD6A+gBAbNU+2sAAAARZmRBVAAAAAEImWNgYGBgAAAABQAB6MzFdgAAAABJRU5ErkJggg==";

}());

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiIiwic291cmNlcyI6WyJtb2Rlcm5penIvZmVhdHVyZS1kZXRlY3RzL2ltZy1hcG5nLmpzIl0sInNvdXJjZXNDb250ZW50IjpbIi8vIEFuaW1hdGVkIFBOR1xuLy8gaHR0cDovL2VuLndpa2lwZWRpYS5vcmcvd2lraS9BUE5HXG4vLyBCeSBBZGR5IE9zbWFuaVxuKGZ1bmN0aW9uICgpIHtcblxuICAgIGlmICghTW9kZXJuaXpyLmNhbnZhcykgcmV0dXJuIGZhbHNlO1xuICAgIFxuICAgIHZhciBpbWFnZSA9IG5ldyBJbWFnZSgpLFxuICAgICAgICBjYW52YXMgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdjYW52YXMnKSxcbiAgICAgICAgY3R4ID0gY2FudmFzLmdldENvbnRleHQoJzJkJyk7XG5cblxuICAgIGltYWdlLm9ubG9hZCA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgTW9kZXJuaXpyLmFkZFRlc3QoJ2FwbmcnLCBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICBpZiAodHlwZW9mIGNhbnZhcy5nZXRDb250ZXh0ID09ICd1bmRlZmluZWQnKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBjdHguZHJhd0ltYWdlKGltYWdlLCAwLCAwKTtcbiAgICAgICAgICAgICAgICByZXR1cm4gY3R4LmdldEltYWdlRGF0YSgwLCAwLCAxLCAxKS5kYXRhWzNdID09PSAwO1xuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICB9O1xuXG4gICAgaW1hZ2Uuc3JjID0gXCJkYXRhOmltYWdlL3BuZztiYXNlNjQsaVZCT1J3MEtHZ29BQUFBTlNVaEVVZ0FBQUFFQUFBQUJDQVlBQUFBZkZjU0pBQUFBQ0dGalZFd0FBQUFCQUFBQUFjTXEyVFlBQUFBTlNVUkJWQWlaWTJCZ1lQZ1BBQUVFQVFCOXNzamZBQUFBR21aalZFd0FBQUFBQUFBQUFRQUFBQUVBQUFBQUFBQUFBQUQ2QStnQkFiTlUrMnNBQUFBUlptUkJWQUFBQUFFSW1XTmdZR0JnQUFBQUJRQUI2TXpGZGdBQUFBQkpSVTVFcmtKZ2dnPT1cIjtcblxufSgpKTtcbiJdLCJmaWxlIjoibW9kZXJuaXpyL2ZlYXR1cmUtZGV0ZWN0cy9pbWctYXBuZy5qcyIsInNvdXJjZVJvb3QiOiIvc291cmNlLyJ9