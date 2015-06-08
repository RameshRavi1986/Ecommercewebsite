
// Grab the WebGL extensions currently supported and add to the Modernizr.webgl object
// spec: www.khronos.org/registry/webgl/specs/latest/#5.13.14

// based on code from ilmari heikkinen
// code.google.com/p/graphics-detect/source/browse/js/detect.js


(function(){

    if (!Modernizr.webgl) return;

    var canvas, ctx, exts;

    try {
        canvas  = document.createElement('canvas');
        ctx     = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
        exts    = ctx.getSupportedExtensions();
    }
    catch (e) {
        return;
    }

    if (ctx === undefined) {
        Modernizr.webgl = new Boolean(false);
    }
    else {
        Modernizr.webgl = new Boolean(true);
    }


    for (var i = -1, len = exts.length; ++i < len; ){
        Modernizr.webgl[exts[i]] = true;
    }

    // hack for addressing modernizr testsuite failures. sorry.
    if (window.TEST && TEST.audvid){
        TEST.audvid.push('webgl');
    }

    canvas = undefined;
})();
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiIiwic291cmNlcyI6WyJtb2Rlcm5penIvZmVhdHVyZS1kZXRlY3RzL3dlYmdsLWV4dGVuc2lvbnMuanMiXSwic291cmNlc0NvbnRlbnQiOlsiXG4vLyBHcmFiIHRoZSBXZWJHTCBleHRlbnNpb25zIGN1cnJlbnRseSBzdXBwb3J0ZWQgYW5kIGFkZCB0byB0aGUgTW9kZXJuaXpyLndlYmdsIG9iamVjdFxuLy8gc3BlYzogd3d3Lmtocm9ub3Mub3JnL3JlZ2lzdHJ5L3dlYmdsL3NwZWNzL2xhdGVzdC8jNS4xMy4xNFxuXG4vLyBiYXNlZCBvbiBjb2RlIGZyb20gaWxtYXJpIGhlaWtraW5lblxuLy8gY29kZS5nb29nbGUuY29tL3AvZ3JhcGhpY3MtZGV0ZWN0L3NvdXJjZS9icm93c2UvanMvZGV0ZWN0LmpzXG5cblxuKGZ1bmN0aW9uKCl7XG5cbiAgICBpZiAoIU1vZGVybml6ci53ZWJnbCkgcmV0dXJuO1xuXG4gICAgdmFyIGNhbnZhcywgY3R4LCBleHRzO1xuXG4gICAgdHJ5IHtcbiAgICAgICAgY2FudmFzICA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2NhbnZhcycpO1xuICAgICAgICBjdHggICAgID0gY2FudmFzLmdldENvbnRleHQoJ3dlYmdsJykgfHwgY2FudmFzLmdldENvbnRleHQoJ2V4cGVyaW1lbnRhbC13ZWJnbCcpO1xuICAgICAgICBleHRzICAgID0gY3R4LmdldFN1cHBvcnRlZEV4dGVuc2lvbnMoKTtcbiAgICB9XG4gICAgY2F0Y2ggKGUpIHtcbiAgICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIGlmIChjdHggPT09IHVuZGVmaW5lZCkge1xuICAgICAgICBNb2Rlcm5penIud2ViZ2wgPSBuZXcgQm9vbGVhbihmYWxzZSk7XG4gICAgfVxuICAgIGVsc2Uge1xuICAgICAgICBNb2Rlcm5penIud2ViZ2wgPSBuZXcgQm9vbGVhbih0cnVlKTtcbiAgICB9XG5cblxuICAgIGZvciAodmFyIGkgPSAtMSwgbGVuID0gZXh0cy5sZW5ndGg7ICsraSA8IGxlbjsgKXtcbiAgICAgICAgTW9kZXJuaXpyLndlYmdsW2V4dHNbaV1dID0gdHJ1ZTtcbiAgICB9XG5cbiAgICAvLyBoYWNrIGZvciBhZGRyZXNzaW5nIG1vZGVybml6ciB0ZXN0c3VpdGUgZmFpbHVyZXMuIHNvcnJ5LlxuICAgIGlmICh3aW5kb3cuVEVTVCAmJiBURVNULmF1ZHZpZCl7XG4gICAgICAgIFRFU1QuYXVkdmlkLnB1c2goJ3dlYmdsJyk7XG4gICAgfVxuXG4gICAgY2FudmFzID0gdW5kZWZpbmVkO1xufSkoKTsiXSwiZmlsZSI6Im1vZGVybml6ci9mZWF0dXJlLWRldGVjdHMvd2ViZ2wtZXh0ZW5zaW9ucy5qcyIsInNvdXJjZVJvb3QiOiIvc291cmNlLyJ9