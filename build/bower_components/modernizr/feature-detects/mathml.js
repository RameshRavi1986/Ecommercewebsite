// MathML
// http://www.w3.org/Math/ 
// By Addy Osmani
// Based on work by Davide (@dpvc) and David (@davidcarlisle)
// in https://github.com/mathjax/MathJax/issues/182

Modernizr.addTest('mathml', function(){
	var hasMathML = false;
	if ( document.createElementNS ) {
	var ns = "http://www.w3.org/1998/Math/MathML",
	    div = document.createElement("div");
	    div.style.position = "absolute"; 
	var mfrac = div.appendChild(document.createElementNS(ns,"math"))
	               .appendChild(document.createElementNS(ns,"mfrac"));
	mfrac.appendChild(document.createElementNS(ns,"mi"))
	     .appendChild(document.createTextNode("xx"));
	mfrac.appendChild(document.createElementNS(ns,"mi"))
	     .appendChild(document.createTextNode("yy"));
	document.body.appendChild(div);
	hasMathML = div.offsetHeight > div.offsetWidth;
	}
	return hasMathML;
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiIiwic291cmNlcyI6WyJtb2Rlcm5penIvZmVhdHVyZS1kZXRlY3RzL21hdGhtbC5qcyJdLCJzb3VyY2VzQ29udGVudCI6WyIvLyBNYXRoTUxcbi8vIGh0dHA6Ly93d3cudzMub3JnL01hdGgvIFxuLy8gQnkgQWRkeSBPc21hbmlcbi8vIEJhc2VkIG9uIHdvcmsgYnkgRGF2aWRlIChAZHB2YykgYW5kIERhdmlkIChAZGF2aWRjYXJsaXNsZSlcbi8vIGluIGh0dHBzOi8vZ2l0aHViLmNvbS9tYXRoamF4L01hdGhKYXgvaXNzdWVzLzE4MlxuXG5Nb2Rlcm5penIuYWRkVGVzdCgnbWF0aG1sJywgZnVuY3Rpb24oKXtcblx0dmFyIGhhc01hdGhNTCA9IGZhbHNlO1xuXHRpZiAoIGRvY3VtZW50LmNyZWF0ZUVsZW1lbnROUyApIHtcblx0dmFyIG5zID0gXCJodHRwOi8vd3d3LnczLm9yZy8xOTk4L01hdGgvTWF0aE1MXCIsXG5cdCAgICBkaXYgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiZGl2XCIpO1xuXHQgICAgZGl2LnN0eWxlLnBvc2l0aW9uID0gXCJhYnNvbHV0ZVwiOyBcblx0dmFyIG1mcmFjID0gZGl2LmFwcGVuZENoaWxkKGRvY3VtZW50LmNyZWF0ZUVsZW1lbnROUyhucyxcIm1hdGhcIikpXG5cdCAgICAgICAgICAgICAgIC5hcHBlbmRDaGlsZChkb2N1bWVudC5jcmVhdGVFbGVtZW50TlMobnMsXCJtZnJhY1wiKSk7XG5cdG1mcmFjLmFwcGVuZENoaWxkKGRvY3VtZW50LmNyZWF0ZUVsZW1lbnROUyhucyxcIm1pXCIpKVxuXHQgICAgIC5hcHBlbmRDaGlsZChkb2N1bWVudC5jcmVhdGVUZXh0Tm9kZShcInh4XCIpKTtcblx0bWZyYWMuYXBwZW5kQ2hpbGQoZG9jdW1lbnQuY3JlYXRlRWxlbWVudE5TKG5zLFwibWlcIikpXG5cdCAgICAgLmFwcGVuZENoaWxkKGRvY3VtZW50LmNyZWF0ZVRleHROb2RlKFwieXlcIikpO1xuXHRkb2N1bWVudC5ib2R5LmFwcGVuZENoaWxkKGRpdik7XG5cdGhhc01hdGhNTCA9IGRpdi5vZmZzZXRIZWlnaHQgPiBkaXYub2Zmc2V0V2lkdGg7XG5cdH1cblx0cmV0dXJuIGhhc01hdGhNTDtcbn0pOyJdLCJmaWxlIjoibW9kZXJuaXpyL2ZlYXR1cmUtZGV0ZWN0cy9tYXRobWwuanMiLCJzb3VyY2VSb290IjoiL3NvdXJjZS8ifQ==