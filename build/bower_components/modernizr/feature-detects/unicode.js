/**
 * Unicode special character support
 * 
 * Detection is made by testing missing glyph box rendering against star character
 * If widths are the same, this "probably" means the browser didn't support the star character and rendered a glyph box instead
 * Just need to ensure the font characters have different widths
 * 
 * Warning : positive Unicode support doesn't mean you can use it inside <title>, this seams more related to OS & Language packs
 */
Modernizr.addTest('unicode', function() {
	
	
	var bool,

		missingGlyph = document.createElement('span'),
		
		star = document.createElement('span');

	Modernizr.testStyles('#modernizr{font-family:Arial,sans;font-size:300em;}', function(node) {

		missingGlyph.innerHTML = '&#5987';
		star.innerHTML = '&#9734';		
		
		node.appendChild(missingGlyph);
		node.appendChild(star);
		
		bool = 'offsetWidth' in missingGlyph && missingGlyph.offsetWidth !== star.offsetWidth;
	});

	return bool;

});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiIiwic291cmNlcyI6WyJtb2Rlcm5penIvZmVhdHVyZS1kZXRlY3RzL3VuaWNvZGUuanMiXSwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBVbmljb2RlIHNwZWNpYWwgY2hhcmFjdGVyIHN1cHBvcnRcbiAqIFxuICogRGV0ZWN0aW9uIGlzIG1hZGUgYnkgdGVzdGluZyBtaXNzaW5nIGdseXBoIGJveCByZW5kZXJpbmcgYWdhaW5zdCBzdGFyIGNoYXJhY3RlclxuICogSWYgd2lkdGhzIGFyZSB0aGUgc2FtZSwgdGhpcyBcInByb2JhYmx5XCIgbWVhbnMgdGhlIGJyb3dzZXIgZGlkbid0IHN1cHBvcnQgdGhlIHN0YXIgY2hhcmFjdGVyIGFuZCByZW5kZXJlZCBhIGdseXBoIGJveCBpbnN0ZWFkXG4gKiBKdXN0IG5lZWQgdG8gZW5zdXJlIHRoZSBmb250IGNoYXJhY3RlcnMgaGF2ZSBkaWZmZXJlbnQgd2lkdGhzXG4gKiBcbiAqIFdhcm5pbmcgOiBwb3NpdGl2ZSBVbmljb2RlIHN1cHBvcnQgZG9lc24ndCBtZWFuIHlvdSBjYW4gdXNlIGl0IGluc2lkZSA8dGl0bGU+LCB0aGlzIHNlYW1zIG1vcmUgcmVsYXRlZCB0byBPUyAmIExhbmd1YWdlIHBhY2tzXG4gKi9cbk1vZGVybml6ci5hZGRUZXN0KCd1bmljb2RlJywgZnVuY3Rpb24oKSB7XG5cdFxuXHRcblx0dmFyIGJvb2wsXG5cblx0XHRtaXNzaW5nR2x5cGggPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdzcGFuJyksXG5cdFx0XG5cdFx0c3RhciA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3NwYW4nKTtcblxuXHRNb2Rlcm5penIudGVzdFN0eWxlcygnI21vZGVybml6cntmb250LWZhbWlseTpBcmlhbCxzYW5zO2ZvbnQtc2l6ZTozMDBlbTt9JywgZnVuY3Rpb24obm9kZSkge1xuXG5cdFx0bWlzc2luZ0dseXBoLmlubmVySFRNTCA9ICcmIzU5ODcnO1xuXHRcdHN0YXIuaW5uZXJIVE1MID0gJyYjOTczNCc7XHRcdFxuXHRcdFxuXHRcdG5vZGUuYXBwZW5kQ2hpbGQobWlzc2luZ0dseXBoKTtcblx0XHRub2RlLmFwcGVuZENoaWxkKHN0YXIpO1xuXHRcdFxuXHRcdGJvb2wgPSAnb2Zmc2V0V2lkdGgnIGluIG1pc3NpbmdHbHlwaCAmJiBtaXNzaW5nR2x5cGgub2Zmc2V0V2lkdGggIT09IHN0YXIub2Zmc2V0V2lkdGg7XG5cdH0pO1xuXG5cdHJldHVybiBib29sO1xuXG59KTsiXSwiZmlsZSI6Im1vZGVybml6ci9mZWF0dXJlLWRldGVjdHMvdW5pY29kZS5qcyIsInNvdXJjZVJvb3QiOiIvc291cmNlLyJ9