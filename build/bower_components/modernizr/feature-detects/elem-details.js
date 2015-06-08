// By @mathias, based on http://mths.be/axh
Modernizr.addTest('details', function() {
    var doc = document,
        el = doc.createElement('details'),
        fake,
        root,
        diff;
    if (!('open' in el)) { // return early if possible; thanks @aFarkas!
        return false;
    }
    root = doc.body || (function() {
        var de = doc.documentElement;
        fake = true;
        return de.insertBefore(doc.createElement('body'), de.firstElementChild || de.firstChild);
    }());
    el.innerHTML = '<summary>a</summary>b';
    el.style.display = 'block';
    root.appendChild(el);
    diff = el.offsetHeight;
    el.open = true;
    diff = diff != el.offsetHeight;
    root.removeChild(el);
    fake && root.parentNode.removeChild(root);
    return diff;
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiIiwic291cmNlcyI6WyJtb2Rlcm5penIvZmVhdHVyZS1kZXRlY3RzL2VsZW0tZGV0YWlscy5qcyJdLCJzb3VyY2VzQ29udGVudCI6WyIvLyBCeSBAbWF0aGlhcywgYmFzZWQgb24gaHR0cDovL210aHMuYmUvYXhoXG5Nb2Rlcm5penIuYWRkVGVzdCgnZGV0YWlscycsIGZ1bmN0aW9uKCkge1xuICAgIHZhciBkb2MgPSBkb2N1bWVudCxcbiAgICAgICAgZWwgPSBkb2MuY3JlYXRlRWxlbWVudCgnZGV0YWlscycpLFxuICAgICAgICBmYWtlLFxuICAgICAgICByb290LFxuICAgICAgICBkaWZmO1xuICAgIGlmICghKCdvcGVuJyBpbiBlbCkpIHsgLy8gcmV0dXJuIGVhcmx5IGlmIHBvc3NpYmxlOyB0aGFua3MgQGFGYXJrYXMhXG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG4gICAgcm9vdCA9IGRvYy5ib2R5IHx8IChmdW5jdGlvbigpIHtcbiAgICAgICAgdmFyIGRlID0gZG9jLmRvY3VtZW50RWxlbWVudDtcbiAgICAgICAgZmFrZSA9IHRydWU7XG4gICAgICAgIHJldHVybiBkZS5pbnNlcnRCZWZvcmUoZG9jLmNyZWF0ZUVsZW1lbnQoJ2JvZHknKSwgZGUuZmlyc3RFbGVtZW50Q2hpbGQgfHwgZGUuZmlyc3RDaGlsZCk7XG4gICAgfSgpKTtcbiAgICBlbC5pbm5lckhUTUwgPSAnPHN1bW1hcnk+YTwvc3VtbWFyeT5iJztcbiAgICBlbC5zdHlsZS5kaXNwbGF5ID0gJ2Jsb2NrJztcbiAgICByb290LmFwcGVuZENoaWxkKGVsKTtcbiAgICBkaWZmID0gZWwub2Zmc2V0SGVpZ2h0O1xuICAgIGVsLm9wZW4gPSB0cnVlO1xuICAgIGRpZmYgPSBkaWZmICE9IGVsLm9mZnNldEhlaWdodDtcbiAgICByb290LnJlbW92ZUNoaWxkKGVsKTtcbiAgICBmYWtlICYmIHJvb3QucGFyZW50Tm9kZS5yZW1vdmVDaGlsZChyb290KTtcbiAgICByZXR1cm4gZGlmZjtcbn0pOyJdLCJmaWxlIjoibW9kZXJuaXpyL2ZlYXR1cmUtZGV0ZWN0cy9lbGVtLWRldGFpbHMuanMiLCJzb3VyY2VSb290IjoiL3NvdXJjZS8ifQ==