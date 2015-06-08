// Detect support for svg filters - http://www.w3.org/TR/SVG11/filters.html.
// Should fail in Safari: http://stackoverflow.com/questions/9739955/feature-detecting-support-for-svg-filters.
// detect by erik dahlstrom

Modernizr.addTest('svgfilters', function(){
	var result = false;
    try {
      result = typeof SVGFEColorMatrixElement !== undefined &&
               SVGFEColorMatrixElement.SVG_FECOLORMATRIX_TYPE_SATURATE == 2;
    }
    catch(e) {}
    return result;
});

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiIiwic291cmNlcyI6WyJtb2Rlcm5penIvZmVhdHVyZS1kZXRlY3RzL3N2Zy1maWx0ZXJzLmpzIl0sInNvdXJjZXNDb250ZW50IjpbIi8vIERldGVjdCBzdXBwb3J0IGZvciBzdmcgZmlsdGVycyAtIGh0dHA6Ly93d3cudzMub3JnL1RSL1NWRzExL2ZpbHRlcnMuaHRtbC5cbi8vIFNob3VsZCBmYWlsIGluIFNhZmFyaTogaHR0cDovL3N0YWNrb3ZlcmZsb3cuY29tL3F1ZXN0aW9ucy85NzM5OTU1L2ZlYXR1cmUtZGV0ZWN0aW5nLXN1cHBvcnQtZm9yLXN2Zy1maWx0ZXJzLlxuLy8gZGV0ZWN0IGJ5IGVyaWsgZGFobHN0cm9tXG5cbk1vZGVybml6ci5hZGRUZXN0KCdzdmdmaWx0ZXJzJywgZnVuY3Rpb24oKXtcblx0dmFyIHJlc3VsdCA9IGZhbHNlO1xuICAgIHRyeSB7XG4gICAgICByZXN1bHQgPSB0eXBlb2YgU1ZHRkVDb2xvck1hdHJpeEVsZW1lbnQgIT09IHVuZGVmaW5lZCAmJlxuICAgICAgICAgICAgICAgU1ZHRkVDb2xvck1hdHJpeEVsZW1lbnQuU1ZHX0ZFQ09MT1JNQVRSSVhfVFlQRV9TQVRVUkFURSA9PSAyO1xuICAgIH1cbiAgICBjYXRjaChlKSB7fVxuICAgIHJldHVybiByZXN1bHQ7XG59KTtcbiJdLCJmaWxlIjoibW9kZXJuaXpyL2ZlYXR1cmUtZGV0ZWN0cy9zdmctZmlsdGVycy5qcyIsInNvdXJjZVJvb3QiOiIvc291cmNlLyJ9