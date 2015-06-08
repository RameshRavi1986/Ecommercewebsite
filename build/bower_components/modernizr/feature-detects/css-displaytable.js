// display: table and table-cell test. (both are tested under one name "table-cell" )
// By @scottjehl

// all additional table display values are here: http://pastebin.com/Gk9PeVaQ though Scott has seen some IE false positives with that sort of weak detection.
// more testing neccessary perhaps.

Modernizr.addTest( "display-table",function(){
  
  var doc   = window.document,
      docElem = doc.documentElement,   
      parent  = doc.createElement( "div" ),
      child = doc.createElement( "div" ),
      childb  = doc.createElement( "div" ),
      ret;
  
  parent.style.cssText = "display: table";
  child.style.cssText = childb.style.cssText = "display: table-cell; padding: 10px";    
          
  parent.appendChild( child );
  parent.appendChild( childb );
  docElem.insertBefore( parent, docElem.firstChild );
  
  ret = child.offsetLeft < childb.offsetLeft;
  docElem.removeChild(parent);
  return ret; 
});


//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiIiwic291cmNlcyI6WyJtb2Rlcm5penIvZmVhdHVyZS1kZXRlY3RzL2Nzcy1kaXNwbGF5dGFibGUuanMiXSwic291cmNlc0NvbnRlbnQiOlsiLy8gZGlzcGxheTogdGFibGUgYW5kIHRhYmxlLWNlbGwgdGVzdC4gKGJvdGggYXJlIHRlc3RlZCB1bmRlciBvbmUgbmFtZSBcInRhYmxlLWNlbGxcIiApXG4vLyBCeSBAc2NvdHRqZWhsXG5cbi8vIGFsbCBhZGRpdGlvbmFsIHRhYmxlIGRpc3BsYXkgdmFsdWVzIGFyZSBoZXJlOiBodHRwOi8vcGFzdGViaW4uY29tL0drOVBlVmFRIHRob3VnaCBTY290dCBoYXMgc2VlbiBzb21lIElFIGZhbHNlIHBvc2l0aXZlcyB3aXRoIHRoYXQgc29ydCBvZiB3ZWFrIGRldGVjdGlvbi5cbi8vIG1vcmUgdGVzdGluZyBuZWNjZXNzYXJ5IHBlcmhhcHMuXG5cbk1vZGVybml6ci5hZGRUZXN0KCBcImRpc3BsYXktdGFibGVcIixmdW5jdGlvbigpe1xuICBcbiAgdmFyIGRvYyAgID0gd2luZG93LmRvY3VtZW50LFxuICAgICAgZG9jRWxlbSA9IGRvYy5kb2N1bWVudEVsZW1lbnQsICAgXG4gICAgICBwYXJlbnQgID0gZG9jLmNyZWF0ZUVsZW1lbnQoIFwiZGl2XCIgKSxcbiAgICAgIGNoaWxkID0gZG9jLmNyZWF0ZUVsZW1lbnQoIFwiZGl2XCIgKSxcbiAgICAgIGNoaWxkYiAgPSBkb2MuY3JlYXRlRWxlbWVudCggXCJkaXZcIiApLFxuICAgICAgcmV0O1xuICBcbiAgcGFyZW50LnN0eWxlLmNzc1RleHQgPSBcImRpc3BsYXk6IHRhYmxlXCI7XG4gIGNoaWxkLnN0eWxlLmNzc1RleHQgPSBjaGlsZGIuc3R5bGUuY3NzVGV4dCA9IFwiZGlzcGxheTogdGFibGUtY2VsbDsgcGFkZGluZzogMTBweFwiOyAgICBcbiAgICAgICAgICBcbiAgcGFyZW50LmFwcGVuZENoaWxkKCBjaGlsZCApO1xuICBwYXJlbnQuYXBwZW5kQ2hpbGQoIGNoaWxkYiApO1xuICBkb2NFbGVtLmluc2VydEJlZm9yZSggcGFyZW50LCBkb2NFbGVtLmZpcnN0Q2hpbGQgKTtcbiAgXG4gIHJldCA9IGNoaWxkLm9mZnNldExlZnQgPCBjaGlsZGIub2Zmc2V0TGVmdDtcbiAgZG9jRWxlbS5yZW1vdmVDaGlsZChwYXJlbnQpO1xuICByZXR1cm4gcmV0OyBcbn0pO1xuXG4iXSwiZmlsZSI6Im1vZGVybml6ci9mZWF0dXJlLWRldGVjdHMvY3NzLWRpc3BsYXl0YWJsZS5qcyIsInNvdXJjZVJvb3QiOiIvc291cmNlLyJ9