/*
	Allan Lei https://github.com/allanlei
	
	Check adapted from https://github.com/brandonaaron/jquery-cssHooks/blob/master/bgpos.js
	
	Test: http://jsfiddle.net/allanlei/R8AYS/
*/
Modernizr.addTest('bgpositionxy', function() {
    return Modernizr.testStyles('#modernizr {background-position: 3px 5px;}', function(elem) {
        var cssStyleDeclaration = window.getComputedStyle ? getComputedStyle(elem, null) : elem.currentStyle;
        var xSupport = (cssStyleDeclaration.backgroundPositionX == '3px') || (cssStyleDeclaration['background-position-x'] == '3px');
        var ySupport = (cssStyleDeclaration.backgroundPositionY == '5px') || (cssStyleDeclaration['background-position-y'] == '5px');
        return xSupport && ySupport;
    });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiIiwic291cmNlcyI6WyJtb2Rlcm5penIvZmVhdHVyZS1kZXRlY3RzL2Nzcy1iYWNrZ3JvdW5kcG9zaXRpb24teHkuanMiXSwic291cmNlc0NvbnRlbnQiOlsiLypcblx0QWxsYW4gTGVpIGh0dHBzOi8vZ2l0aHViLmNvbS9hbGxhbmxlaVxuXHRcblx0Q2hlY2sgYWRhcHRlZCBmcm9tIGh0dHBzOi8vZ2l0aHViLmNvbS9icmFuZG9uYWFyb24vanF1ZXJ5LWNzc0hvb2tzL2Jsb2IvbWFzdGVyL2JncG9zLmpzXG5cdFxuXHRUZXN0OiBodHRwOi8vanNmaWRkbGUubmV0L2FsbGFubGVpL1I4QVlTL1xuKi9cbk1vZGVybml6ci5hZGRUZXN0KCdiZ3Bvc2l0aW9ueHknLCBmdW5jdGlvbigpIHtcbiAgICByZXR1cm4gTW9kZXJuaXpyLnRlc3RTdHlsZXMoJyNtb2Rlcm5penIge2JhY2tncm91bmQtcG9zaXRpb246IDNweCA1cHg7fScsIGZ1bmN0aW9uKGVsZW0pIHtcbiAgICAgICAgdmFyIGNzc1N0eWxlRGVjbGFyYXRpb24gPSB3aW5kb3cuZ2V0Q29tcHV0ZWRTdHlsZSA/IGdldENvbXB1dGVkU3R5bGUoZWxlbSwgbnVsbCkgOiBlbGVtLmN1cnJlbnRTdHlsZTtcbiAgICAgICAgdmFyIHhTdXBwb3J0ID0gKGNzc1N0eWxlRGVjbGFyYXRpb24uYmFja2dyb3VuZFBvc2l0aW9uWCA9PSAnM3B4JykgfHwgKGNzc1N0eWxlRGVjbGFyYXRpb25bJ2JhY2tncm91bmQtcG9zaXRpb24teCddID09ICczcHgnKTtcbiAgICAgICAgdmFyIHlTdXBwb3J0ID0gKGNzc1N0eWxlRGVjbGFyYXRpb24uYmFja2dyb3VuZFBvc2l0aW9uWSA9PSAnNXB4JykgfHwgKGNzc1N0eWxlRGVjbGFyYXRpb25bJ2JhY2tncm91bmQtcG9zaXRpb24teSddID09ICc1cHgnKTtcbiAgICAgICAgcmV0dXJuIHhTdXBwb3J0ICYmIHlTdXBwb3J0O1xuICAgIH0pO1xufSk7Il0sImZpbGUiOiJtb2Rlcm5penIvZmVhdHVyZS1kZXRlY3RzL2Nzcy1iYWNrZ3JvdW5kcG9zaXRpb24teHkuanMiLCJzb3VyY2VSb290IjoiL3NvdXJjZS8ifQ==