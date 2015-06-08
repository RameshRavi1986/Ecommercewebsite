// https://github.com/Modernizr/Modernizr/issues/572
// Similar to http://jsfiddle.net/FWeinb/etnYC/
Modernizr.addTest('cssvhunit', function() {
    var bool;
    Modernizr.testStyles("#modernizr { height: 50vh; }", function(elem, rule) {   
        var height = parseInt(window.innerHeight/2,10),
            compStyle = parseInt((window.getComputedStyle ?
                      getComputedStyle(elem, null) :
                      elem.currentStyle)["height"],10);
        
        bool= (compStyle == height);
    });
    return bool;
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiIiwic291cmNlcyI6WyJtb2Rlcm5penIvZmVhdHVyZS1kZXRlY3RzL2Nzcy12aHVuaXQuanMiXSwic291cmNlc0NvbnRlbnQiOlsiLy8gaHR0cHM6Ly9naXRodWIuY29tL01vZGVybml6ci9Nb2Rlcm5penIvaXNzdWVzLzU3MlxuLy8gU2ltaWxhciB0byBodHRwOi8vanNmaWRkbGUubmV0L0ZXZWluYi9ldG5ZQy9cbk1vZGVybml6ci5hZGRUZXN0KCdjc3N2aHVuaXQnLCBmdW5jdGlvbigpIHtcbiAgICB2YXIgYm9vbDtcbiAgICBNb2Rlcm5penIudGVzdFN0eWxlcyhcIiNtb2Rlcm5penIgeyBoZWlnaHQ6IDUwdmg7IH1cIiwgZnVuY3Rpb24oZWxlbSwgcnVsZSkgeyAgIFxuICAgICAgICB2YXIgaGVpZ2h0ID0gcGFyc2VJbnQod2luZG93LmlubmVySGVpZ2h0LzIsMTApLFxuICAgICAgICAgICAgY29tcFN0eWxlID0gcGFyc2VJbnQoKHdpbmRvdy5nZXRDb21wdXRlZFN0eWxlID9cbiAgICAgICAgICAgICAgICAgICAgICBnZXRDb21wdXRlZFN0eWxlKGVsZW0sIG51bGwpIDpcbiAgICAgICAgICAgICAgICAgICAgICBlbGVtLmN1cnJlbnRTdHlsZSlbXCJoZWlnaHRcIl0sMTApO1xuICAgICAgICBcbiAgICAgICAgYm9vbD0gKGNvbXBTdHlsZSA9PSBoZWlnaHQpO1xuICAgIH0pO1xuICAgIHJldHVybiBib29sO1xufSk7Il0sImZpbGUiOiJtb2Rlcm5penIvZmVhdHVyZS1kZXRlY3RzL2Nzcy12aHVuaXQuanMiLCJzb3VyY2VSb290IjoiL3NvdXJjZS8ifQ==