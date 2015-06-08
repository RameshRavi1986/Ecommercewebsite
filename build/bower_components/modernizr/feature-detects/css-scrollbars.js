// Stylable scrollbars detection
Modernizr.addTest('cssscrollbar', function() {

	var bool,

		styles = "#modernizr{overflow: scroll; width: 40px }#" +
			Modernizr._prefixes
				.join("scrollbar{width:0px}"+' #modernizr::')
				.split('#')
				.slice(1)
				.join('#') + "scrollbar{width:0px}";

	Modernizr.testStyles(styles, function(node) {
		bool = 'scrollWidth' in node && node.scrollWidth == 40;
	});

	return bool;

});

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiIiwic291cmNlcyI6WyJtb2Rlcm5penIvZmVhdHVyZS1kZXRlY3RzL2Nzcy1zY3JvbGxiYXJzLmpzIl0sInNvdXJjZXNDb250ZW50IjpbIi8vIFN0eWxhYmxlIHNjcm9sbGJhcnMgZGV0ZWN0aW9uXG5Nb2Rlcm5penIuYWRkVGVzdCgnY3Nzc2Nyb2xsYmFyJywgZnVuY3Rpb24oKSB7XG5cblx0dmFyIGJvb2wsXG5cblx0XHRzdHlsZXMgPSBcIiNtb2Rlcm5penJ7b3ZlcmZsb3c6IHNjcm9sbDsgd2lkdGg6IDQwcHggfSNcIiArXG5cdFx0XHRNb2Rlcm5penIuX3ByZWZpeGVzXG5cdFx0XHRcdC5qb2luKFwic2Nyb2xsYmFye3dpZHRoOjBweH1cIisnICNtb2Rlcm5penI6OicpXG5cdFx0XHRcdC5zcGxpdCgnIycpXG5cdFx0XHRcdC5zbGljZSgxKVxuXHRcdFx0XHQuam9pbignIycpICsgXCJzY3JvbGxiYXJ7d2lkdGg6MHB4fVwiO1xuXG5cdE1vZGVybml6ci50ZXN0U3R5bGVzKHN0eWxlcywgZnVuY3Rpb24obm9kZSkge1xuXHRcdGJvb2wgPSAnc2Nyb2xsV2lkdGgnIGluIG5vZGUgJiYgbm9kZS5zY3JvbGxXaWR0aCA9PSA0MDtcblx0fSk7XG5cblx0cmV0dXJuIGJvb2w7XG5cbn0pO1xuIl0sImZpbGUiOiJtb2Rlcm5penIvZmVhdHVyZS1kZXRlY3RzL2Nzcy1zY3JvbGxiYXJzLmpzIiwic291cmNlUm9vdCI6Ii9zb3VyY2UvIn0=