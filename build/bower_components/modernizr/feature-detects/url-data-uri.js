// data uri test.
// https://github.com/Modernizr/Modernizr/issues/14

// This test is asynchronous. Watch out.


// in IE7 in HTTPS this can cause a Mixed Content security popup. 
//  github.com/Modernizr/Modernizr/issues/362
// To avoid that you can create a new iframe and inject this.. perhaps..


(function(){

  var datauri = new Image();


  datauri.onerror = function() {
      Modernizr.addTest('datauri', function () { return false; });
  };  
  datauri.onload = function() {
      Modernizr.addTest('datauri', function () { return (datauri.width == 1 && datauri.height == 1); });
  };

  datauri.src = "data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///ywAAAAAAQABAAACAUwAOw==";

})();

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiIiwic291cmNlcyI6WyJtb2Rlcm5penIvZmVhdHVyZS1kZXRlY3RzL3VybC1kYXRhLXVyaS5qcyJdLCJzb3VyY2VzQ29udGVudCI6WyIvLyBkYXRhIHVyaSB0ZXN0LlxuLy8gaHR0cHM6Ly9naXRodWIuY29tL01vZGVybml6ci9Nb2Rlcm5penIvaXNzdWVzLzE0XG5cbi8vIFRoaXMgdGVzdCBpcyBhc3luY2hyb25vdXMuIFdhdGNoIG91dC5cblxuXG4vLyBpbiBJRTcgaW4gSFRUUFMgdGhpcyBjYW4gY2F1c2UgYSBNaXhlZCBDb250ZW50IHNlY3VyaXR5IHBvcHVwLiBcbi8vICBnaXRodWIuY29tL01vZGVybml6ci9Nb2Rlcm5penIvaXNzdWVzLzM2MlxuLy8gVG8gYXZvaWQgdGhhdCB5b3UgY2FuIGNyZWF0ZSBhIG5ldyBpZnJhbWUgYW5kIGluamVjdCB0aGlzLi4gcGVyaGFwcy4uXG5cblxuKGZ1bmN0aW9uKCl7XG5cbiAgdmFyIGRhdGF1cmkgPSBuZXcgSW1hZ2UoKTtcblxuXG4gIGRhdGF1cmkub25lcnJvciA9IGZ1bmN0aW9uKCkge1xuICAgICAgTW9kZXJuaXpyLmFkZFRlc3QoJ2RhdGF1cmknLCBmdW5jdGlvbiAoKSB7IHJldHVybiBmYWxzZTsgfSk7XG4gIH07ICBcbiAgZGF0YXVyaS5vbmxvYWQgPSBmdW5jdGlvbigpIHtcbiAgICAgIE1vZGVybml6ci5hZGRUZXN0KCdkYXRhdXJpJywgZnVuY3Rpb24gKCkgeyByZXR1cm4gKGRhdGF1cmkud2lkdGggPT0gMSAmJiBkYXRhdXJpLmhlaWdodCA9PSAxKTsgfSk7XG4gIH07XG5cbiAgZGF0YXVyaS5zcmMgPSBcImRhdGE6aW1hZ2UvZ2lmO2Jhc2U2NCxSMGxHT0RsaEFRQUJBSUFBQUFBQUFQLy8veXdBQUFBQUFRQUJBQUFDQVV3QU93PT1cIjtcblxufSkoKTtcbiJdLCJmaWxlIjoibW9kZXJuaXpyL2ZlYXR1cmUtZGV0ZWN0cy91cmwtZGF0YS11cmkuanMiLCJzb3VyY2VSb290IjoiL3NvdXJjZS8ifQ==