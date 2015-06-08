
// developer.mozilla.org/en/CSS/pointer-events

// Test and project pages:
// ausi.github.com/Feature-detection-technique-for-pointer-events/
// github.com/ausi/Feature-detection-technique-for-pointer-events/wiki
// github.com/Modernizr/Modernizr/issues/80


Modernizr.addTest('pointerevents', function(){
    var element = document.createElement('x'),
        documentElement = document.documentElement,
        getComputedStyle = window.getComputedStyle,
        supports;
    if(!('pointerEvents' in element.style)){
        return false;
    }
    element.style.pointerEvents = 'auto';
    element.style.pointerEvents = 'x';
    documentElement.appendChild(element);
    supports = getComputedStyle &&
        getComputedStyle(element, '').pointerEvents === 'auto';
    documentElement.removeChild(element);
    return !!supports;
});

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiIiwic291cmNlcyI6WyJtb2Rlcm5penIvZmVhdHVyZS1kZXRlY3RzL2Nzcy1wb2ludGVyZXZlbnRzLmpzIl0sInNvdXJjZXNDb250ZW50IjpbIlxuLy8gZGV2ZWxvcGVyLm1vemlsbGEub3JnL2VuL0NTUy9wb2ludGVyLWV2ZW50c1xuXG4vLyBUZXN0IGFuZCBwcm9qZWN0IHBhZ2VzOlxuLy8gYXVzaS5naXRodWIuY29tL0ZlYXR1cmUtZGV0ZWN0aW9uLXRlY2huaXF1ZS1mb3ItcG9pbnRlci1ldmVudHMvXG4vLyBnaXRodWIuY29tL2F1c2kvRmVhdHVyZS1kZXRlY3Rpb24tdGVjaG5pcXVlLWZvci1wb2ludGVyLWV2ZW50cy93aWtpXG4vLyBnaXRodWIuY29tL01vZGVybml6ci9Nb2Rlcm5penIvaXNzdWVzLzgwXG5cblxuTW9kZXJuaXpyLmFkZFRlc3QoJ3BvaW50ZXJldmVudHMnLCBmdW5jdGlvbigpe1xuICAgIHZhciBlbGVtZW50ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgneCcpLFxuICAgICAgICBkb2N1bWVudEVsZW1lbnQgPSBkb2N1bWVudC5kb2N1bWVudEVsZW1lbnQsXG4gICAgICAgIGdldENvbXB1dGVkU3R5bGUgPSB3aW5kb3cuZ2V0Q29tcHV0ZWRTdHlsZSxcbiAgICAgICAgc3VwcG9ydHM7XG4gICAgaWYoISgncG9pbnRlckV2ZW50cycgaW4gZWxlbWVudC5zdHlsZSkpe1xuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuICAgIGVsZW1lbnQuc3R5bGUucG9pbnRlckV2ZW50cyA9ICdhdXRvJztcbiAgICBlbGVtZW50LnN0eWxlLnBvaW50ZXJFdmVudHMgPSAneCc7XG4gICAgZG9jdW1lbnRFbGVtZW50LmFwcGVuZENoaWxkKGVsZW1lbnQpO1xuICAgIHN1cHBvcnRzID0gZ2V0Q29tcHV0ZWRTdHlsZSAmJlxuICAgICAgICBnZXRDb21wdXRlZFN0eWxlKGVsZW1lbnQsICcnKS5wb2ludGVyRXZlbnRzID09PSAnYXV0byc7XG4gICAgZG9jdW1lbnRFbGVtZW50LnJlbW92ZUNoaWxkKGVsZW1lbnQpO1xuICAgIHJldHVybiAhIXN1cHBvcnRzO1xufSk7XG4iXSwiZmlsZSI6Im1vZGVybml6ci9mZWF0dXJlLWRldGVjdHMvY3NzLXBvaW50ZXJldmVudHMuanMiLCJzb3VyY2VSb290IjoiL3NvdXJjZS8ifQ==