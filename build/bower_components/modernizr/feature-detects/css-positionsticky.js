// Sticky positioning - constrains an element to be positioned inside the
// intersection of its container box, and the viewport.
Modernizr.addTest('csspositionsticky', function () {

    var prop = 'position:';
    var value = 'sticky';
    var el = document.createElement('modernizr');
    var mStyle = el.style;

    mStyle.cssText = prop + Modernizr._prefixes.join(value + ';' + prop).slice(0, -prop.length);

    return mStyle.position.indexOf(value) !== -1;
});

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiIiwic291cmNlcyI6WyJtb2Rlcm5penIvZmVhdHVyZS1kZXRlY3RzL2Nzcy1wb3NpdGlvbnN0aWNreS5qcyJdLCJzb3VyY2VzQ29udGVudCI6WyIvLyBTdGlja3kgcG9zaXRpb25pbmcgLSBjb25zdHJhaW5zIGFuIGVsZW1lbnQgdG8gYmUgcG9zaXRpb25lZCBpbnNpZGUgdGhlXG4vLyBpbnRlcnNlY3Rpb24gb2YgaXRzIGNvbnRhaW5lciBib3gsIGFuZCB0aGUgdmlld3BvcnQuXG5Nb2Rlcm5penIuYWRkVGVzdCgnY3NzcG9zaXRpb25zdGlja3knLCBmdW5jdGlvbiAoKSB7XG5cbiAgICB2YXIgcHJvcCA9ICdwb3NpdGlvbjonO1xuICAgIHZhciB2YWx1ZSA9ICdzdGlja3knO1xuICAgIHZhciBlbCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ21vZGVybml6cicpO1xuICAgIHZhciBtU3R5bGUgPSBlbC5zdHlsZTtcblxuICAgIG1TdHlsZS5jc3NUZXh0ID0gcHJvcCArIE1vZGVybml6ci5fcHJlZml4ZXMuam9pbih2YWx1ZSArICc7JyArIHByb3ApLnNsaWNlKDAsIC1wcm9wLmxlbmd0aCk7XG5cbiAgICByZXR1cm4gbVN0eWxlLnBvc2l0aW9uLmluZGV4T2YodmFsdWUpICE9PSAtMTtcbn0pO1xuIl0sImZpbGUiOiJtb2Rlcm5penIvZmVhdHVyZS1kZXRlY3RzL2Nzcy1wb3NpdGlvbnN0aWNreS5qcyIsInNvdXJjZVJvb3QiOiIvc291cmNlLyJ9