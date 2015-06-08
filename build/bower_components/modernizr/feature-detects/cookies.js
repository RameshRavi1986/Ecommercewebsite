
// by tauren
// https://github.com/Modernizr/Modernizr/issues/191

Modernizr.addTest('cookies', function () {
  // Quick test if browser has cookieEnabled host property
  if (navigator.cookieEnabled) return true;
  // Create cookie
  document.cookie = "cookietest=1";
  var ret = document.cookie.indexOf("cookietest=") != -1;
  // Delete cookie
  document.cookie = "cookietest=1; expires=Thu, 01-Jan-1970 00:00:01 GMT";
  return ret;
});


//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiIiwic291cmNlcyI6WyJtb2Rlcm5penIvZmVhdHVyZS1kZXRlY3RzL2Nvb2tpZXMuanMiXSwic291cmNlc0NvbnRlbnQiOlsiXG4vLyBieSB0YXVyZW5cbi8vIGh0dHBzOi8vZ2l0aHViLmNvbS9Nb2Rlcm5penIvTW9kZXJuaXpyL2lzc3Vlcy8xOTFcblxuTW9kZXJuaXpyLmFkZFRlc3QoJ2Nvb2tpZXMnLCBmdW5jdGlvbiAoKSB7XG4gIC8vIFF1aWNrIHRlc3QgaWYgYnJvd3NlciBoYXMgY29va2llRW5hYmxlZCBob3N0IHByb3BlcnR5XG4gIGlmIChuYXZpZ2F0b3IuY29va2llRW5hYmxlZCkgcmV0dXJuIHRydWU7XG4gIC8vIENyZWF0ZSBjb29raWVcbiAgZG9jdW1lbnQuY29va2llID0gXCJjb29raWV0ZXN0PTFcIjtcbiAgdmFyIHJldCA9IGRvY3VtZW50LmNvb2tpZS5pbmRleE9mKFwiY29va2lldGVzdD1cIikgIT0gLTE7XG4gIC8vIERlbGV0ZSBjb29raWVcbiAgZG9jdW1lbnQuY29va2llID0gXCJjb29raWV0ZXN0PTE7IGV4cGlyZXM9VGh1LCAwMS1KYW4tMTk3MCAwMDowMDowMSBHTVRcIjtcbiAgcmV0dXJuIHJldDtcbn0pO1xuXG4iXSwiZmlsZSI6Im1vZGVybml6ci9mZWF0dXJlLWRldGVjdHMvY29va2llcy5qcyIsInNvdXJjZVJvb3QiOiIvc291cmNlLyJ9