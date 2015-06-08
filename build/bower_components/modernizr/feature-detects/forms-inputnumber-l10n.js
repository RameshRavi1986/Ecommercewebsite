// input[type="number"] localized input/output
// // Detects whether input type="number" is capable of receiving and
// // displaying localized numbers, e.g. with comma separator
// // https://bugs.webkit.org/show_bug.cgi?id=42484
// // Based on http://trac.webkit.org/browser/trunk/LayoutTests/fast/forms/script-tests/input-number-keyoperation.js?rev=80096#L9
// // By Peter Janes

Modernizr.addTest('localizedNumber', function() {
    var doc = document,
        el = document.createElement('div'),
        fake,
        root,
        input,
        diff;
    root = doc.body || (function() {
        var de = doc.documentElement;
        fake = true;
        return de.insertBefore(doc.createElement('body'), de.firstElementChild || de.firstChild);
    }());
    el.innerHTML = '<input type="number" value="1.0" step="0.1"/>';
    input = el.childNodes[0];
    root.appendChild(el);
    input.focus();
    try {
        doc.execCommand('InsertText', false, '1,1');
    } catch(e) { // prevent warnings in IE
    }
    diff = input.type === 'number' && input.valueAsNumber === 1.1 && input.checkValidity();
    root.removeChild(el);
    fake && root.parentNode.removeChild(root);
    return diff;
});

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiIiwic291cmNlcyI6WyJtb2Rlcm5penIvZmVhdHVyZS1kZXRlY3RzL2Zvcm1zLWlucHV0bnVtYmVyLWwxMG4uanMiXSwic291cmNlc0NvbnRlbnQiOlsiLy8gaW5wdXRbdHlwZT1cIm51bWJlclwiXSBsb2NhbGl6ZWQgaW5wdXQvb3V0cHV0XG4vLyAvLyBEZXRlY3RzIHdoZXRoZXIgaW5wdXQgdHlwZT1cIm51bWJlclwiIGlzIGNhcGFibGUgb2YgcmVjZWl2aW5nIGFuZFxuLy8gLy8gZGlzcGxheWluZyBsb2NhbGl6ZWQgbnVtYmVycywgZS5nLiB3aXRoIGNvbW1hIHNlcGFyYXRvclxuLy8gLy8gaHR0cHM6Ly9idWdzLndlYmtpdC5vcmcvc2hvd19idWcuY2dpP2lkPTQyNDg0XG4vLyAvLyBCYXNlZCBvbiBodHRwOi8vdHJhYy53ZWJraXQub3JnL2Jyb3dzZXIvdHJ1bmsvTGF5b3V0VGVzdHMvZmFzdC9mb3Jtcy9zY3JpcHQtdGVzdHMvaW5wdXQtbnVtYmVyLWtleW9wZXJhdGlvbi5qcz9yZXY9ODAwOTYjTDlcbi8vIC8vIEJ5IFBldGVyIEphbmVzXG5cbk1vZGVybml6ci5hZGRUZXN0KCdsb2NhbGl6ZWROdW1iZXInLCBmdW5jdGlvbigpIHtcbiAgICB2YXIgZG9jID0gZG9jdW1lbnQsXG4gICAgICAgIGVsID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2JyksXG4gICAgICAgIGZha2UsXG4gICAgICAgIHJvb3QsXG4gICAgICAgIGlucHV0LFxuICAgICAgICBkaWZmO1xuICAgIHJvb3QgPSBkb2MuYm9keSB8fCAoZnVuY3Rpb24oKSB7XG4gICAgICAgIHZhciBkZSA9IGRvYy5kb2N1bWVudEVsZW1lbnQ7XG4gICAgICAgIGZha2UgPSB0cnVlO1xuICAgICAgICByZXR1cm4gZGUuaW5zZXJ0QmVmb3JlKGRvYy5jcmVhdGVFbGVtZW50KCdib2R5JyksIGRlLmZpcnN0RWxlbWVudENoaWxkIHx8IGRlLmZpcnN0Q2hpbGQpO1xuICAgIH0oKSk7XG4gICAgZWwuaW5uZXJIVE1MID0gJzxpbnB1dCB0eXBlPVwibnVtYmVyXCIgdmFsdWU9XCIxLjBcIiBzdGVwPVwiMC4xXCIvPic7XG4gICAgaW5wdXQgPSBlbC5jaGlsZE5vZGVzWzBdO1xuICAgIHJvb3QuYXBwZW5kQ2hpbGQoZWwpO1xuICAgIGlucHV0LmZvY3VzKCk7XG4gICAgdHJ5IHtcbiAgICAgICAgZG9jLmV4ZWNDb21tYW5kKCdJbnNlcnRUZXh0JywgZmFsc2UsICcxLDEnKTtcbiAgICB9IGNhdGNoKGUpIHsgLy8gcHJldmVudCB3YXJuaW5ncyBpbiBJRVxuICAgIH1cbiAgICBkaWZmID0gaW5wdXQudHlwZSA9PT0gJ251bWJlcicgJiYgaW5wdXQudmFsdWVBc051bWJlciA9PT0gMS4xICYmIGlucHV0LmNoZWNrVmFsaWRpdHkoKTtcbiAgICByb290LnJlbW92ZUNoaWxkKGVsKTtcbiAgICBmYWtlICYmIHJvb3QucGFyZW50Tm9kZS5yZW1vdmVDaGlsZChyb290KTtcbiAgICByZXR1cm4gZGlmZjtcbn0pO1xuIl0sImZpbGUiOiJtb2Rlcm5penIvZmVhdHVyZS1kZXRlY3RzL2Zvcm1zLWlucHV0bnVtYmVyLWwxMG4uanMiLCJzb3VyY2VSb290IjoiL3NvdXJjZS8ifQ==