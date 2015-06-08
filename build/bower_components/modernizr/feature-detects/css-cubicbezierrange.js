// cubic-bezier values can't be > 1 for Webkit until bug #45761 (https://bugs.webkit.org/show_bug.cgi?id=45761) is fixed
// By @calvein

Modernizr.addTest('cubicbezierrange', function() {
    var el = document.createElement('div');
    el.style.cssText = Modernizr._prefixes.join('transition-timing-function' + ':cubic-bezier(1,0,0,1.1); ');
    return !!el.style.length;
});

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiIiwic291cmNlcyI6WyJtb2Rlcm5penIvZmVhdHVyZS1kZXRlY3RzL2Nzcy1jdWJpY2JlemllcnJhbmdlLmpzIl0sInNvdXJjZXNDb250ZW50IjpbIi8vIGN1YmljLWJlemllciB2YWx1ZXMgY2FuJ3QgYmUgPiAxIGZvciBXZWJraXQgdW50aWwgYnVnICM0NTc2MSAoaHR0cHM6Ly9idWdzLndlYmtpdC5vcmcvc2hvd19idWcuY2dpP2lkPTQ1NzYxKSBpcyBmaXhlZFxuLy8gQnkgQGNhbHZlaW5cblxuTW9kZXJuaXpyLmFkZFRlc3QoJ2N1YmljYmV6aWVycmFuZ2UnLCBmdW5jdGlvbigpIHtcbiAgICB2YXIgZWwgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcbiAgICBlbC5zdHlsZS5jc3NUZXh0ID0gTW9kZXJuaXpyLl9wcmVmaXhlcy5qb2luKCd0cmFuc2l0aW9uLXRpbWluZy1mdW5jdGlvbicgKyAnOmN1YmljLWJlemllcigxLDAsMCwxLjEpOyAnKTtcbiAgICByZXR1cm4gISFlbC5zdHlsZS5sZW5ndGg7XG59KTtcbiJdLCJmaWxlIjoibW9kZXJuaXpyL2ZlYXR1cmUtZGV0ZWN0cy9jc3MtY3ViaWNiZXppZXJyYW5nZS5qcyIsInNvdXJjZVJvb3QiOiIvc291cmNlLyJ9