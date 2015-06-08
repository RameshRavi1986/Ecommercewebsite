/*
    https://developer.mozilla.org/en/CSS/background-position
    http://www.w3.org/TR/css3-background/#background-position

    Example: http://jsfiddle.net/Blink/bBXvt/
*/

(function() {

    var elem = document.createElement('a'),
        eStyle = elem.style,
        val = "right 10px bottom 10px";

    Modernizr.addTest('bgpositionshorthand', function(){
        eStyle.cssText = "background-position: " + val + ";";
        return (eStyle.backgroundPosition === val);
    });

}());

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiIiwic291cmNlcyI6WyJtb2Rlcm5penIvZmVhdHVyZS1kZXRlY3RzL2Nzcy1iYWNrZ3JvdW5kcG9zaXRpb24tc2hvcnRoYW5kLmpzIl0sInNvdXJjZXNDb250ZW50IjpbIi8qXG4gICAgaHR0cHM6Ly9kZXZlbG9wZXIubW96aWxsYS5vcmcvZW4vQ1NTL2JhY2tncm91bmQtcG9zaXRpb25cbiAgICBodHRwOi8vd3d3LnczLm9yZy9UUi9jc3MzLWJhY2tncm91bmQvI2JhY2tncm91bmQtcG9zaXRpb25cblxuICAgIEV4YW1wbGU6IGh0dHA6Ly9qc2ZpZGRsZS5uZXQvQmxpbmsvYkJYdnQvXG4qL1xuXG4oZnVuY3Rpb24oKSB7XG5cbiAgICB2YXIgZWxlbSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2EnKSxcbiAgICAgICAgZVN0eWxlID0gZWxlbS5zdHlsZSxcbiAgICAgICAgdmFsID0gXCJyaWdodCAxMHB4IGJvdHRvbSAxMHB4XCI7XG5cbiAgICBNb2Rlcm5penIuYWRkVGVzdCgnYmdwb3NpdGlvbnNob3J0aGFuZCcsIGZ1bmN0aW9uKCl7XG4gICAgICAgIGVTdHlsZS5jc3NUZXh0ID0gXCJiYWNrZ3JvdW5kLXBvc2l0aW9uOiBcIiArIHZhbCArIFwiO1wiO1xuICAgICAgICByZXR1cm4gKGVTdHlsZS5iYWNrZ3JvdW5kUG9zaXRpb24gPT09IHZhbCk7XG4gICAgfSk7XG5cbn0oKSk7XG4iXSwiZmlsZSI6Im1vZGVybml6ci9mZWF0dXJlLWRldGVjdHMvY3NzLWJhY2tncm91bmRwb3NpdGlvbi1zaG9ydGhhbmQuanMiLCJzb3VyY2VSb290IjoiL3NvdXJjZS8ifQ==