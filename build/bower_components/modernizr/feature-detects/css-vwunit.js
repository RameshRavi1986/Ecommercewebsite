// https://github.com/Modernizr/Modernizr/issues/572
// http://jsfiddle.net/FWeinb/etnYC/
Modernizr.addTest('cssvwunit', function(){
    var bool;
    Modernizr.testStyles("#modernizr { width: 50vw; }", function(elem, rule) {
        var width = parseInt(window.innerWidth/2,10),
            compStyle = parseInt((window.getComputedStyle ?
                      getComputedStyle(elem, null) :
                      elem.currentStyle)["width"],10);
        
        bool= (compStyle == width);
    });
    return bool;
});

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiIiwic291cmNlcyI6WyJtb2Rlcm5penIvZmVhdHVyZS1kZXRlY3RzL2Nzcy12d3VuaXQuanMiXSwic291cmNlc0NvbnRlbnQiOlsiLy8gaHR0cHM6Ly9naXRodWIuY29tL01vZGVybml6ci9Nb2Rlcm5penIvaXNzdWVzLzU3MlxuLy8gaHR0cDovL2pzZmlkZGxlLm5ldC9GV2VpbmIvZXRuWUMvXG5Nb2Rlcm5penIuYWRkVGVzdCgnY3Nzdnd1bml0JywgZnVuY3Rpb24oKXtcbiAgICB2YXIgYm9vbDtcbiAgICBNb2Rlcm5penIudGVzdFN0eWxlcyhcIiNtb2Rlcm5penIgeyB3aWR0aDogNTB2dzsgfVwiLCBmdW5jdGlvbihlbGVtLCBydWxlKSB7XG4gICAgICAgIHZhciB3aWR0aCA9IHBhcnNlSW50KHdpbmRvdy5pbm5lcldpZHRoLzIsMTApLFxuICAgICAgICAgICAgY29tcFN0eWxlID0gcGFyc2VJbnQoKHdpbmRvdy5nZXRDb21wdXRlZFN0eWxlID9cbiAgICAgICAgICAgICAgICAgICAgICBnZXRDb21wdXRlZFN0eWxlKGVsZW0sIG51bGwpIDpcbiAgICAgICAgICAgICAgICAgICAgICBlbGVtLmN1cnJlbnRTdHlsZSlbXCJ3aWR0aFwiXSwxMCk7XG4gICAgICAgIFxuICAgICAgICBib29sPSAoY29tcFN0eWxlID09IHdpZHRoKTtcbiAgICB9KTtcbiAgICByZXR1cm4gYm9vbDtcbn0pO1xuIl0sImZpbGUiOiJtb2Rlcm5penIvZmVhdHVyZS1kZXRlY3RzL2Nzcy12d3VuaXQuanMiLCJzb3VyY2VSb290IjoiL3NvdXJjZS8ifQ==