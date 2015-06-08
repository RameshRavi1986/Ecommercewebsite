// Method of allowing calculated values for length units, i.e. width: calc(100%-3em) http://caniuse.com/#search=calc
// By @calvein

Modernizr.addTest('csscalc', function() {
    var prop = 'width:';
    var value = 'calc(10px);';
    var el = document.createElement('div');

    el.style.cssText = prop + Modernizr._prefixes.join(value + prop);

    return !!el.style.length;
});

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiIiwic291cmNlcyI6WyJtb2Rlcm5penIvZmVhdHVyZS1kZXRlY3RzL2Nzcy1jYWxjLmpzIl0sInNvdXJjZXNDb250ZW50IjpbIi8vIE1ldGhvZCBvZiBhbGxvd2luZyBjYWxjdWxhdGVkIHZhbHVlcyBmb3IgbGVuZ3RoIHVuaXRzLCBpLmUuIHdpZHRoOiBjYWxjKDEwMCUtM2VtKSBodHRwOi8vY2FuaXVzZS5jb20vI3NlYXJjaD1jYWxjXG4vLyBCeSBAY2FsdmVpblxuXG5Nb2Rlcm5penIuYWRkVGVzdCgnY3NzY2FsYycsIGZ1bmN0aW9uKCkge1xuICAgIHZhciBwcm9wID0gJ3dpZHRoOic7XG4gICAgdmFyIHZhbHVlID0gJ2NhbGMoMTBweCk7JztcbiAgICB2YXIgZWwgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcblxuICAgIGVsLnN0eWxlLmNzc1RleHQgPSBwcm9wICsgTW9kZXJuaXpyLl9wcmVmaXhlcy5qb2luKHZhbHVlICsgcHJvcCk7XG5cbiAgICByZXR1cm4gISFlbC5zdHlsZS5sZW5ndGg7XG59KTtcbiJdLCJmaWxlIjoibW9kZXJuaXpyL2ZlYXR1cmUtZGV0ZWN0cy9jc3MtY2FsYy5qcyIsInNvdXJjZVJvb3QiOiIvc291cmNlLyJ9