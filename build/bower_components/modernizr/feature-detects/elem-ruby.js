// Browser support test for the HTML5 <ruby>, <rt> and <rp> elements
// http://www.whatwg.org/specs/web-apps/current-work/multipage/text-level-semantics.html#the-ruby-element
//
// by @alrra

Modernizr.addTest('ruby', function () {

    var ruby = document.createElement('ruby'),
        rt = document.createElement('rt'),
        rp = document.createElement('rp'),
        docElement = document.documentElement,
        displayStyleProperty = 'display',
        fontSizeStyleProperty = 'fontSize'; // 'fontSize' - because it`s only used for IE6 and IE7

    ruby.appendChild(rp);
    ruby.appendChild(rt);
    docElement.appendChild(ruby);

    // browsers that support <ruby> hide the <rp> via "display:none"
    if ( getStyle(rp, displayStyleProperty) == 'none' ||                                                       // for non-IE browsers
    // but in IE browsers <rp> has "display:inline" so, the test needs other conditions:
        getStyle(ruby, displayStyleProperty) == 'ruby' && getStyle(rt, displayStyleProperty) == 'ruby-text' || // for IE8 & IE9
        getStyle(rp, fontSizeStyleProperty) == '6pt' && getStyle(rt, fontSizeStyleProperty) == '6pt' ) {       // for IE6 & IE7

        cleanUp();
        return true;

    } else {
        cleanUp();
        return false;
    }

    function getStyle( element, styleProperty ) {
        var result;

        if ( window.getComputedStyle ) {     // for non-IE browsers
            result = document.defaultView.getComputedStyle(element,null).getPropertyValue(styleProperty);
        } else if ( element.currentStyle ) { // for IE
            result = element.currentStyle[styleProperty];
        }

        return result;
    }

    function cleanUp() {
        docElement.removeChild(ruby);
        // the removed child node still exists in memory, so ...
        ruby = null;
        rt = null;
        rp = null;
    }

});

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiIiwic291cmNlcyI6WyJtb2Rlcm5penIvZmVhdHVyZS1kZXRlY3RzL2VsZW0tcnVieS5qcyJdLCJzb3VyY2VzQ29udGVudCI6WyIvLyBCcm93c2VyIHN1cHBvcnQgdGVzdCBmb3IgdGhlIEhUTUw1IDxydWJ5PiwgPHJ0PiBhbmQgPHJwPiBlbGVtZW50c1xuLy8gaHR0cDovL3d3dy53aGF0d2cub3JnL3NwZWNzL3dlYi1hcHBzL2N1cnJlbnQtd29yay9tdWx0aXBhZ2UvdGV4dC1sZXZlbC1zZW1hbnRpY3MuaHRtbCN0aGUtcnVieS1lbGVtZW50XG4vL1xuLy8gYnkgQGFscnJhXG5cbk1vZGVybml6ci5hZGRUZXN0KCdydWJ5JywgZnVuY3Rpb24gKCkge1xuXG4gICAgdmFyIHJ1YnkgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdydWJ5JyksXG4gICAgICAgIHJ0ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgncnQnKSxcbiAgICAgICAgcnAgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdycCcpLFxuICAgICAgICBkb2NFbGVtZW50ID0gZG9jdW1lbnQuZG9jdW1lbnRFbGVtZW50LFxuICAgICAgICBkaXNwbGF5U3R5bGVQcm9wZXJ0eSA9ICdkaXNwbGF5JyxcbiAgICAgICAgZm9udFNpemVTdHlsZVByb3BlcnR5ID0gJ2ZvbnRTaXplJzsgLy8gJ2ZvbnRTaXplJyAtIGJlY2F1c2UgaXRgcyBvbmx5IHVzZWQgZm9yIElFNiBhbmQgSUU3XG5cbiAgICBydWJ5LmFwcGVuZENoaWxkKHJwKTtcbiAgICBydWJ5LmFwcGVuZENoaWxkKHJ0KTtcbiAgICBkb2NFbGVtZW50LmFwcGVuZENoaWxkKHJ1YnkpO1xuXG4gICAgLy8gYnJvd3NlcnMgdGhhdCBzdXBwb3J0IDxydWJ5PiBoaWRlIHRoZSA8cnA+IHZpYSBcImRpc3BsYXk6bm9uZVwiXG4gICAgaWYgKCBnZXRTdHlsZShycCwgZGlzcGxheVN0eWxlUHJvcGVydHkpID09ICdub25lJyB8fCAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBmb3Igbm9uLUlFIGJyb3dzZXJzXG4gICAgLy8gYnV0IGluIElFIGJyb3dzZXJzIDxycD4gaGFzIFwiZGlzcGxheTppbmxpbmVcIiBzbywgdGhlIHRlc3QgbmVlZHMgb3RoZXIgY29uZGl0aW9uczpcbiAgICAgICAgZ2V0U3R5bGUocnVieSwgZGlzcGxheVN0eWxlUHJvcGVydHkpID09ICdydWJ5JyAmJiBnZXRTdHlsZShydCwgZGlzcGxheVN0eWxlUHJvcGVydHkpID09ICdydWJ5LXRleHQnIHx8IC8vIGZvciBJRTggJiBJRTlcbiAgICAgICAgZ2V0U3R5bGUocnAsIGZvbnRTaXplU3R5bGVQcm9wZXJ0eSkgPT0gJzZwdCcgJiYgZ2V0U3R5bGUocnQsIGZvbnRTaXplU3R5bGVQcm9wZXJ0eSkgPT0gJzZwdCcgKSB7ICAgICAgIC8vIGZvciBJRTYgJiBJRTdcblxuICAgICAgICBjbGVhblVwKCk7XG4gICAgICAgIHJldHVybiB0cnVlO1xuXG4gICAgfSBlbHNlIHtcbiAgICAgICAgY2xlYW5VcCgpO1xuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gZ2V0U3R5bGUoIGVsZW1lbnQsIHN0eWxlUHJvcGVydHkgKSB7XG4gICAgICAgIHZhciByZXN1bHQ7XG5cbiAgICAgICAgaWYgKCB3aW5kb3cuZ2V0Q29tcHV0ZWRTdHlsZSApIHsgICAgIC8vIGZvciBub24tSUUgYnJvd3NlcnNcbiAgICAgICAgICAgIHJlc3VsdCA9IGRvY3VtZW50LmRlZmF1bHRWaWV3LmdldENvbXB1dGVkU3R5bGUoZWxlbWVudCxudWxsKS5nZXRQcm9wZXJ0eVZhbHVlKHN0eWxlUHJvcGVydHkpO1xuICAgICAgICB9IGVsc2UgaWYgKCBlbGVtZW50LmN1cnJlbnRTdHlsZSApIHsgLy8gZm9yIElFXG4gICAgICAgICAgICByZXN1bHQgPSBlbGVtZW50LmN1cnJlbnRTdHlsZVtzdHlsZVByb3BlcnR5XTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiByZXN1bHQ7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gY2xlYW5VcCgpIHtcbiAgICAgICAgZG9jRWxlbWVudC5yZW1vdmVDaGlsZChydWJ5KTtcbiAgICAgICAgLy8gdGhlIHJlbW92ZWQgY2hpbGQgbm9kZSBzdGlsbCBleGlzdHMgaW4gbWVtb3J5LCBzbyAuLi5cbiAgICAgICAgcnVieSA9IG51bGw7XG4gICAgICAgIHJ0ID0gbnVsbDtcbiAgICAgICAgcnAgPSBudWxsO1xuICAgIH1cblxufSk7XG4iXSwiZmlsZSI6Im1vZGVybml6ci9mZWF0dXJlLWRldGVjdHMvZWxlbS1ydWJ5LmpzIiwic291cmNlUm9vdCI6Ii9zb3VyY2UvIn0=