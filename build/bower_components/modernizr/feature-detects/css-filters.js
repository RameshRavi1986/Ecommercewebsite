// https://github.com/Modernizr/Modernizr/issues/615
// documentMode is needed for false positives in oldIE, please see issue above
Modernizr.addTest('cssfilters', function() {
    var el = document.createElement('div');
    el.style.cssText = Modernizr._prefixes.join('filter' + ':blur(2px); ');
    return !!el.style.length && ((document.documentMode === undefined || document.documentMode > 9));
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiIiwic291cmNlcyI6WyJtb2Rlcm5penIvZmVhdHVyZS1kZXRlY3RzL2Nzcy1maWx0ZXJzLmpzIl0sInNvdXJjZXNDb250ZW50IjpbIi8vIGh0dHBzOi8vZ2l0aHViLmNvbS9Nb2Rlcm5penIvTW9kZXJuaXpyL2lzc3Vlcy82MTVcbi8vIGRvY3VtZW50TW9kZSBpcyBuZWVkZWQgZm9yIGZhbHNlIHBvc2l0aXZlcyBpbiBvbGRJRSwgcGxlYXNlIHNlZSBpc3N1ZSBhYm92ZVxuTW9kZXJuaXpyLmFkZFRlc3QoJ2Nzc2ZpbHRlcnMnLCBmdW5jdGlvbigpIHtcbiAgICB2YXIgZWwgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcbiAgICBlbC5zdHlsZS5jc3NUZXh0ID0gTW9kZXJuaXpyLl9wcmVmaXhlcy5qb2luKCdmaWx0ZXInICsgJzpibHVyKDJweCk7ICcpO1xuICAgIHJldHVybiAhIWVsLnN0eWxlLmxlbmd0aCAmJiAoKGRvY3VtZW50LmRvY3VtZW50TW9kZSA9PT0gdW5kZWZpbmVkIHx8IGRvY3VtZW50LmRvY3VtZW50TW9kZSA+IDkpKTtcbn0pOyJdLCJmaWxlIjoibW9kZXJuaXpyL2ZlYXR1cmUtZGV0ZWN0cy9jc3MtZmlsdGVycy5qcyIsInNvdXJjZVJvb3QiOiIvc291cmNlLyJ9