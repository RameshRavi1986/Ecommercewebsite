/*
 * Test for SubPixel Font Rendering
 * (to infer if GDI or DirectWrite is used on Windows)
 * Authors: @derSchepp, @gerritvanaaken, @rodneyrehm, @yatil, @ryanseddon
 * Web: https://github.com/gerritvanaaken/subpixeldetect
 */
Modernizr.addTest('subpixelfont', function() {
    var bool,
        styles = "#modernizr{position: absolute; top: -10em; visibility:hidden; font: normal 10px arial;}#subpixel{float: left; font-size: 33.3333%;}";
    
    // see https://github.com/Modernizr/Modernizr/blob/master/modernizr.js#L97
    Modernizr.testStyles(styles, function(elem) {
        var subpixel = elem.firstChild;

        subpixel.innerHTML = 'This is a text written in Arial';

        bool = window.getComputedStyle ?
            window.getComputedStyle(subpixel, null).getPropertyValue("width") !== '44px'
            : false;
    }, 1, ['subpixel']);

    return bool;
});

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiIiwic291cmNlcyI6WyJtb2Rlcm5penIvZmVhdHVyZS1kZXRlY3RzL2Nzcy1zdWJwaXhlbGZvbnQuanMiXSwic291cmNlc0NvbnRlbnQiOlsiLypcbiAqIFRlc3QgZm9yIFN1YlBpeGVsIEZvbnQgUmVuZGVyaW5nXG4gKiAodG8gaW5mZXIgaWYgR0RJIG9yIERpcmVjdFdyaXRlIGlzIHVzZWQgb24gV2luZG93cylcbiAqIEF1dGhvcnM6IEBkZXJTY2hlcHAsIEBnZXJyaXR2YW5hYWtlbiwgQHJvZG5leXJlaG0sIEB5YXRpbCwgQHJ5YW5zZWRkb25cbiAqIFdlYjogaHR0cHM6Ly9naXRodWIuY29tL2dlcnJpdHZhbmFha2VuL3N1YnBpeGVsZGV0ZWN0XG4gKi9cbk1vZGVybml6ci5hZGRUZXN0KCdzdWJwaXhlbGZvbnQnLCBmdW5jdGlvbigpIHtcbiAgICB2YXIgYm9vbCxcbiAgICAgICAgc3R5bGVzID0gXCIjbW9kZXJuaXpye3Bvc2l0aW9uOiBhYnNvbHV0ZTsgdG9wOiAtMTBlbTsgdmlzaWJpbGl0eTpoaWRkZW47IGZvbnQ6IG5vcm1hbCAxMHB4IGFyaWFsO30jc3VicGl4ZWx7ZmxvYXQ6IGxlZnQ7IGZvbnQtc2l6ZTogMzMuMzMzMyU7fVwiO1xuICAgIFxuICAgIC8vIHNlZSBodHRwczovL2dpdGh1Yi5jb20vTW9kZXJuaXpyL01vZGVybml6ci9ibG9iL21hc3Rlci9tb2Rlcm5penIuanMjTDk3XG4gICAgTW9kZXJuaXpyLnRlc3RTdHlsZXMoc3R5bGVzLCBmdW5jdGlvbihlbGVtKSB7XG4gICAgICAgIHZhciBzdWJwaXhlbCA9IGVsZW0uZmlyc3RDaGlsZDtcblxuICAgICAgICBzdWJwaXhlbC5pbm5lckhUTUwgPSAnVGhpcyBpcyBhIHRleHQgd3JpdHRlbiBpbiBBcmlhbCc7XG5cbiAgICAgICAgYm9vbCA9IHdpbmRvdy5nZXRDb21wdXRlZFN0eWxlID9cbiAgICAgICAgICAgIHdpbmRvdy5nZXRDb21wdXRlZFN0eWxlKHN1YnBpeGVsLCBudWxsKS5nZXRQcm9wZXJ0eVZhbHVlKFwid2lkdGhcIikgIT09ICc0NHB4J1xuICAgICAgICAgICAgOiBmYWxzZTtcbiAgICB9LCAxLCBbJ3N1YnBpeGVsJ10pO1xuXG4gICAgcmV0dXJuIGJvb2w7XG59KTtcbiJdLCJmaWxlIjoibW9kZXJuaXpyL2ZlYXR1cmUtZGV0ZWN0cy9jc3Mtc3VicGl4ZWxmb250LmpzIiwic291cmNlUm9vdCI6Ii9zb3VyY2UvIn0=