// https://github.com/Modernizr/Modernizr/issues/572
// http://jsfiddle.net/glsee/JRmdq/8/
Modernizr.addTest('cssvminunit', function(){
    var bool;
    Modernizr.testStyles("#modernizr { width: 50vmin; }", function(elem, rule) {
        var one_vw = window.innerWidth/100,
            one_vh = window.innerHeight/100,
            compWidth = parseInt((window.getComputedStyle ?
                                  getComputedStyle(elem, null) :
                                  elem.currentStyle)['width'],10);
        bool = ( parseInt(Math.min(one_vw, one_vh)*50,10) == compWidth );
    });
    return bool;
});

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiIiwic291cmNlcyI6WyJtb2Rlcm5penIvZmVhdHVyZS1kZXRlY3RzL2Nzcy12bWludW5pdC5qcyJdLCJzb3VyY2VzQ29udGVudCI6WyIvLyBodHRwczovL2dpdGh1Yi5jb20vTW9kZXJuaXpyL01vZGVybml6ci9pc3N1ZXMvNTcyXG4vLyBodHRwOi8vanNmaWRkbGUubmV0L2dsc2VlL0pSbWRxLzgvXG5Nb2Rlcm5penIuYWRkVGVzdCgnY3Nzdm1pbnVuaXQnLCBmdW5jdGlvbigpe1xuICAgIHZhciBib29sO1xuICAgIE1vZGVybml6ci50ZXN0U3R5bGVzKFwiI21vZGVybml6ciB7IHdpZHRoOiA1MHZtaW47IH1cIiwgZnVuY3Rpb24oZWxlbSwgcnVsZSkge1xuICAgICAgICB2YXIgb25lX3Z3ID0gd2luZG93LmlubmVyV2lkdGgvMTAwLFxuICAgICAgICAgICAgb25lX3ZoID0gd2luZG93LmlubmVySGVpZ2h0LzEwMCxcbiAgICAgICAgICAgIGNvbXBXaWR0aCA9IHBhcnNlSW50KCh3aW5kb3cuZ2V0Q29tcHV0ZWRTdHlsZSA/XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZ2V0Q29tcHV0ZWRTdHlsZShlbGVtLCBudWxsKSA6XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZWxlbS5jdXJyZW50U3R5bGUpWyd3aWR0aCddLDEwKTtcbiAgICAgICAgYm9vbCA9ICggcGFyc2VJbnQoTWF0aC5taW4ob25lX3Z3LCBvbmVfdmgpKjUwLDEwKSA9PSBjb21wV2lkdGggKTtcbiAgICB9KTtcbiAgICByZXR1cm4gYm9vbDtcbn0pO1xuIl0sImZpbGUiOiJtb2Rlcm5penIvZmVhdHVyZS1kZXRlY3RzL2Nzcy12bWludW5pdC5qcyIsInNvdXJjZVJvb3QiOiIvc291cmNlLyJ9