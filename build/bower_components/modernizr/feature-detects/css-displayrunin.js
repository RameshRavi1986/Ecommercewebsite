
// by alanhogan

// https://github.com/Modernizr/Modernizr/issues/198
// http://css-tricks.com/596-run-in/



Modernizr.testStyles(' #modernizr { display: run-in; } ', function(elem, rule){ 

  var ret = (window.getComputedStyle ?
         getComputedStyle(elem, null).getPropertyValue('display') :
         elem.currentStyle['display']);

  Modernizr.addTest('display-runin', ret == 'run-in');

});


//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiIiwic291cmNlcyI6WyJtb2Rlcm5penIvZmVhdHVyZS1kZXRlY3RzL2Nzcy1kaXNwbGF5cnVuaW4uanMiXSwic291cmNlc0NvbnRlbnQiOlsiXG4vLyBieSBhbGFuaG9nYW5cblxuLy8gaHR0cHM6Ly9naXRodWIuY29tL01vZGVybml6ci9Nb2Rlcm5penIvaXNzdWVzLzE5OFxuLy8gaHR0cDovL2Nzcy10cmlja3MuY29tLzU5Ni1ydW4taW4vXG5cblxuXG5Nb2Rlcm5penIudGVzdFN0eWxlcygnICNtb2Rlcm5penIgeyBkaXNwbGF5OiBydW4taW47IH0gJywgZnVuY3Rpb24oZWxlbSwgcnVsZSl7IFxuXG4gIHZhciByZXQgPSAod2luZG93LmdldENvbXB1dGVkU3R5bGUgP1xuICAgICAgICAgZ2V0Q29tcHV0ZWRTdHlsZShlbGVtLCBudWxsKS5nZXRQcm9wZXJ0eVZhbHVlKCdkaXNwbGF5JykgOlxuICAgICAgICAgZWxlbS5jdXJyZW50U3R5bGVbJ2Rpc3BsYXknXSk7XG5cbiAgTW9kZXJuaXpyLmFkZFRlc3QoJ2Rpc3BsYXktcnVuaW4nLCByZXQgPT0gJ3J1bi1pbicpO1xuXG59KTtcblxuIl0sImZpbGUiOiJtb2Rlcm5penIvZmVhdHVyZS1kZXRlY3RzL2Nzcy1kaXNwbGF5cnVuaW4uanMiLCJzb3VyY2VSb290IjoiL3NvdXJjZS8ifQ==