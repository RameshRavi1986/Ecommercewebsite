
// dataset API for data-* attributes
// test by @phiggins42

Modernizr.addTest('dataset', function(){
  var n = document.createElement("div");
  n.setAttribute("data-a-b", "c");
  return !!(n.dataset && n.dataset.aB === "c");
});

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiIiwic291cmNlcyI6WyJtb2Rlcm5penIvZmVhdHVyZS1kZXRlY3RzL2RvbS1kYXRhc2V0LmpzIl0sInNvdXJjZXNDb250ZW50IjpbIlxuLy8gZGF0YXNldCBBUEkgZm9yIGRhdGEtKiBhdHRyaWJ1dGVzXG4vLyB0ZXN0IGJ5IEBwaGlnZ2luczQyXG5cbk1vZGVybml6ci5hZGRUZXN0KCdkYXRhc2V0JywgZnVuY3Rpb24oKXtcbiAgdmFyIG4gPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiZGl2XCIpO1xuICBuLnNldEF0dHJpYnV0ZShcImRhdGEtYS1iXCIsIFwiY1wiKTtcbiAgcmV0dXJuICEhKG4uZGF0YXNldCAmJiBuLmRhdGFzZXQuYUIgPT09IFwiY1wiKTtcbn0pO1xuIl0sImZpbGUiOiJtb2Rlcm5penIvZmVhdHVyZS1kZXRlY3RzL2RvbS1kYXRhc2V0LmpzIiwic291cmNlUm9vdCI6Ii9zb3VyY2UvIn0=