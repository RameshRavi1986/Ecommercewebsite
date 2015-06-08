/* see http://davidnewton.ca/the-current-state-of-hyphenation-on-the-web
   http://davidnewton.ca/demos/hyphenation/test.html


There are three tests:
   1. csshyphens      - tests hyphens:auto actually adds hyphens to text
   2. softhyphens     - tests that &shy; does its job
   3. softhyphensfind - tests that in-browser Find functionality still works correctly with &shy;

These tests currently require document.body to be present

Hyphenation is language specific, sometimes.
  See for more details: http://code.google.com/p/hyphenator/source/diff?spec=svn975&r=975&format=side&path=/trunk/Hyphenator.js#sc_svn975_313

If loading Hyphenator.js via Modernizr.load, be cautious of issue 158: http://code.google.com/p/hyphenator/issues/detail?id=158

More details at https://github.com/Modernizr/Modernizr/issues/312

*/

(function() {

	if (!document.body){
		window.console && console.warn('document.body doesn\'t exist. Modernizr hyphens test needs it.');
		return;
	}

	// functional test of adding hyphens:auto
	function test_hyphens_css() {
		try {
			/* create a div container and a span within that
			 * these have to be appended to document.body, otherwise some browsers can give false negative */
			var div = document.createElement('div'),
				span = document.createElement('span'),
				divStyle = div.style,
				spanHeight = 0,
				spanWidth = 0,
				result = false,
				firstChild = document.body.firstElementChild || document.body.firstChild;

			div.appendChild(span);
			span.innerHTML = 'Bacon ipsum dolor sit amet jerky velit in culpa hamburger et. Laborum dolor proident, enim dolore duis commodo et strip steak. Salami anim et, veniam consectetur dolore qui tenderloin jowl velit sirloin. Et ad culpa, fatback cillum jowl ball tip ham hock nulla short ribs pariatur aute. Pig pancetta ham bresaola, ut boudin nostrud commodo flank esse cow tongue culpa. Pork belly bresaola enim pig, ea consectetur nisi. Fugiat officia turkey, ea cow jowl pariatur ullamco proident do laborum velit sausage. Magna biltong sint tri-tip commodo sed bacon, esse proident aliquip. Ullamco ham sint fugiat, velit in enim sed mollit nulla cow ut adipisicing nostrud consectetur. Proident dolore beef ribs, laborum nostrud meatball ea laboris rump cupidatat labore culpa. Shankle minim beef, velit sint cupidatat fugiat tenderloin pig et ball tip. Ut cow fatback salami, bacon ball tip et in shank strip steak bresaola. In ut pork belly sed mollit tri-tip magna culpa veniam, short ribs qui in andouille ham consequat. Dolore bacon t-bone, velit short ribs enim strip steak nulla. Voluptate labore ut, biltong swine irure jerky. Cupidatat excepteur aliquip salami dolore. Ball tip strip steak in pork dolor. Ad in esse biltong. Dolore tenderloin exercitation ad pork loin t-bone, dolore in chicken ball tip qui pig. Ut culpa tongue, sint ribeye dolore ex shank voluptate hamburger. Jowl et tempor, boudin pork chop labore ham hock drumstick consectetur tri-tip elit swine meatball chicken ground round. Proident shankle mollit dolore. Shoulder ut duis t-bone quis reprehenderit. Meatloaf dolore minim strip steak, laboris ea aute bacon beef ribs elit shank in veniam drumstick qui. Ex laboris meatball cow tongue pork belly. Ea ball tip reprehenderit pig, sed fatback boudin dolore flank aliquip laboris eu quis. Beef ribs duis beef, cow corned beef adipisicing commodo nisi deserunt exercitation. Cillum dolor t-bone spare ribs, ham hock est sirloin. Brisket irure meatloaf in, boudin pork belly sirloin ball tip. Sirloin sint irure nisi nostrud aliqua. Nostrud nulla aute, enim officia culpa ham hock. Aliqua reprehenderit dolore sunt nostrud sausage, ea boudin pork loin ut t-bone ham tempor. Tri-tip et pancetta drumstick laborum. Ham hock magna do nostrud in proident. Ex ground round fatback, venison non ribeye in.';

			document.body.insertBefore(div, firstChild);

			/* get size of unhyphenated text */
			divStyle.cssText = 'position:absolute;top:0;left:0;width:5em;text-align:justify;text-justification:newspaper;';
			spanHeight = span.offsetHeight;
			spanWidth = span.offsetWidth;

			/* compare size with hyphenated text */
			divStyle.cssText = 'position:absolute;top:0;left:0;width:5em;text-align:justify;'+
												 'text-justification:newspaper;'+
												 Modernizr._prefixes.join('hyphens:auto; ');

			result = (span.offsetHeight != spanHeight || span.offsetWidth != spanWidth);

			/* results and cleanup */
			document.body.removeChild(div);
			div.removeChild(span);

			return result;
		} catch(e) {
			return false;
		}
	}

	// for the softhyphens test
	function test_hyphens(delimiter, testWidth) {
		try {
			/* create a div container and a span within that
			 * these have to be appended to document.body, otherwise some browsers can give false negative */
			var div = document.createElement('div'),
				span = document.createElement('span'),
				divStyle = div.style,
				spanSize = 0,
				result = false,
				result1 = false,
				result2 = false,
				firstChild = document.body.firstElementChild || document.body.firstChild;

			divStyle.cssText = 'position:absolute;top:0;left:0;overflow:visible;width:1.25em;';
			div.appendChild(span);
			document.body.insertBefore(div, firstChild);


			/* get height of unwrapped text */
			span.innerHTML = 'mm';
			spanSize = span.offsetHeight;

			/* compare height w/ delimiter, to see if it wraps to new line */
			span.innerHTML = 'm' + delimiter + 'm';
			result1 = (span.offsetHeight > spanSize);

			/* if we're testing the width too (i.e. for soft-hyphen, not zws),
			 * this is because tested Blackberry devices will wrap the text but not display the hyphen */
			if (testWidth) {
				/* get width of wrapped, non-hyphenated text */
				span.innerHTML = 'm<br />m';
				spanSize = span.offsetWidth;

				/* compare width w/ wrapped w/ delimiter to see if hyphen is present */
				span.innerHTML = 'm' + delimiter + 'm';
				result2 = (span.offsetWidth > spanSize);
			} else {
				result2 = true;
			}

			/* results and cleanup */
			if (result1 === true && result2 === true) { result = true; }
			document.body.removeChild(div);
			div.removeChild(span);

			return result;
		} catch(e) {
			return false;
		}
	}

	// testing if in-browser Find functionality will work on hyphenated text
	function test_hyphens_find(delimiter) {
		try {
			/* create a dummy input for resetting selection location, and a div container
			 * these have to be appended to document.body, otherwise some browsers can give false negative
			 * div container gets the doubled testword, separated by the delimiter
			 * Note: giving a width to div gives false positive in iOS Safari */
			var dummy = document.createElement('input'),
				div = document.createElement('div'),
				testword = 'lebowski',
				result = false,
				textrange,
				firstChild = document.body.firstElementChild || document.body.firstChild;

			div.innerHTML = testword + delimiter + testword;

			document.body.insertBefore(div, firstChild);
			document.body.insertBefore(dummy, div);


			/* reset the selection to the dummy input element, i.e. BEFORE the div container
			 *   stackoverflow.com/questions/499126/jquery-set-cursor-position-in-text-area */
			if (dummy.setSelectionRange) {
				dummy.focus();
				dummy.setSelectionRange(0,0);
			} else if (dummy.createTextRange) {
				textrange = dummy.createTextRange();
				textrange.collapse(true);
				textrange.moveEnd('character', 0);
				textrange.moveStart('character', 0);
				textrange.select();
			}

			/* try to find the doubled testword, without the delimiter */
			if (window.find) {
				result = window.find(testword + testword);
			} else {
				try {
					textrange = window.self.document.body.createTextRange();
					result = textrange.findText(testword + testword);
				} catch(e) {
					result = false;
				}
			}

			document.body.removeChild(div);
			document.body.removeChild(dummy);

			return result;
		} catch(e) {
			return false;
		}
	}

	Modernizr.addTest("csshyphens", function() {

		if (!Modernizr.testAllProps('hyphens')) return false;

		/* Chrome lies about its hyphens support so we need a more robust test
				crbug.com/107111
		*/
		try {
			return test_hyphens_css();
		} catch(e) {
			return false;
		}
	});

	Modernizr.addTest("softhyphens", function() {
		try {
			// use numeric entity instead of &shy; in case it's XHTML
			return test_hyphens('&#173;', true) && test_hyphens('&#8203;', false);
		} catch(e) {
			return false;
		}
	});

	Modernizr.addTest("softhyphensfind", function() {
		try {
			return test_hyphens_find('&#173;') && test_hyphens_find('&#8203;');
		} catch(e) {
			return false;
		}
	});

})();

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiIiwic291cmNlcyI6WyJtb2Rlcm5penIvZmVhdHVyZS1kZXRlY3RzL2Nzcy1oeXBoZW5zLmpzIl0sInNvdXJjZXNDb250ZW50IjpbIi8qIHNlZSBodHRwOi8vZGF2aWRuZXd0b24uY2EvdGhlLWN1cnJlbnQtc3RhdGUtb2YtaHlwaGVuYXRpb24tb24tdGhlLXdlYlxuICAgaHR0cDovL2RhdmlkbmV3dG9uLmNhL2RlbW9zL2h5cGhlbmF0aW9uL3Rlc3QuaHRtbFxuXG5cblRoZXJlIGFyZSB0aHJlZSB0ZXN0czpcbiAgIDEuIGNzc2h5cGhlbnMgICAgICAtIHRlc3RzIGh5cGhlbnM6YXV0byBhY3R1YWxseSBhZGRzIGh5cGhlbnMgdG8gdGV4dFxuICAgMi4gc29mdGh5cGhlbnMgICAgIC0gdGVzdHMgdGhhdCAmc2h5OyBkb2VzIGl0cyBqb2JcbiAgIDMuIHNvZnRoeXBoZW5zZmluZCAtIHRlc3RzIHRoYXQgaW4tYnJvd3NlciBGaW5kIGZ1bmN0aW9uYWxpdHkgc3RpbGwgd29ya3MgY29ycmVjdGx5IHdpdGggJnNoeTtcblxuVGhlc2UgdGVzdHMgY3VycmVudGx5IHJlcXVpcmUgZG9jdW1lbnQuYm9keSB0byBiZSBwcmVzZW50XG5cbkh5cGhlbmF0aW9uIGlzIGxhbmd1YWdlIHNwZWNpZmljLCBzb21ldGltZXMuXG4gIFNlZSBmb3IgbW9yZSBkZXRhaWxzOiBodHRwOi8vY29kZS5nb29nbGUuY29tL3AvaHlwaGVuYXRvci9zb3VyY2UvZGlmZj9zcGVjPXN2bjk3NSZyPTk3NSZmb3JtYXQ9c2lkZSZwYXRoPS90cnVuay9IeXBoZW5hdG9yLmpzI3NjX3N2bjk3NV8zMTNcblxuSWYgbG9hZGluZyBIeXBoZW5hdG9yLmpzIHZpYSBNb2Rlcm5penIubG9hZCwgYmUgY2F1dGlvdXMgb2YgaXNzdWUgMTU4OiBodHRwOi8vY29kZS5nb29nbGUuY29tL3AvaHlwaGVuYXRvci9pc3N1ZXMvZGV0YWlsP2lkPTE1OFxuXG5Nb3JlIGRldGFpbHMgYXQgaHR0cHM6Ly9naXRodWIuY29tL01vZGVybml6ci9Nb2Rlcm5penIvaXNzdWVzLzMxMlxuXG4qL1xuXG4oZnVuY3Rpb24oKSB7XG5cblx0aWYgKCFkb2N1bWVudC5ib2R5KXtcblx0XHR3aW5kb3cuY29uc29sZSAmJiBjb25zb2xlLndhcm4oJ2RvY3VtZW50LmJvZHkgZG9lc25cXCd0IGV4aXN0LiBNb2Rlcm5penIgaHlwaGVucyB0ZXN0IG5lZWRzIGl0LicpO1xuXHRcdHJldHVybjtcblx0fVxuXG5cdC8vIGZ1bmN0aW9uYWwgdGVzdCBvZiBhZGRpbmcgaHlwaGVuczphdXRvXG5cdGZ1bmN0aW9uIHRlc3RfaHlwaGVuc19jc3MoKSB7XG5cdFx0dHJ5IHtcblx0XHRcdC8qIGNyZWF0ZSBhIGRpdiBjb250YWluZXIgYW5kIGEgc3BhbiB3aXRoaW4gdGhhdFxuXHRcdFx0ICogdGhlc2UgaGF2ZSB0byBiZSBhcHBlbmRlZCB0byBkb2N1bWVudC5ib2R5LCBvdGhlcndpc2Ugc29tZSBicm93c2VycyBjYW4gZ2l2ZSBmYWxzZSBuZWdhdGl2ZSAqL1xuXHRcdFx0dmFyIGRpdiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpLFxuXHRcdFx0XHRzcGFuID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnc3BhbicpLFxuXHRcdFx0XHRkaXZTdHlsZSA9IGRpdi5zdHlsZSxcblx0XHRcdFx0c3BhbkhlaWdodCA9IDAsXG5cdFx0XHRcdHNwYW5XaWR0aCA9IDAsXG5cdFx0XHRcdHJlc3VsdCA9IGZhbHNlLFxuXHRcdFx0XHRmaXJzdENoaWxkID0gZG9jdW1lbnQuYm9keS5maXJzdEVsZW1lbnRDaGlsZCB8fCBkb2N1bWVudC5ib2R5LmZpcnN0Q2hpbGQ7XG5cblx0XHRcdGRpdi5hcHBlbmRDaGlsZChzcGFuKTtcblx0XHRcdHNwYW4uaW5uZXJIVE1MID0gJ0JhY29uIGlwc3VtIGRvbG9yIHNpdCBhbWV0IGplcmt5IHZlbGl0IGluIGN1bHBhIGhhbWJ1cmdlciBldC4gTGFib3J1bSBkb2xvciBwcm9pZGVudCwgZW5pbSBkb2xvcmUgZHVpcyBjb21tb2RvIGV0IHN0cmlwIHN0ZWFrLiBTYWxhbWkgYW5pbSBldCwgdmVuaWFtIGNvbnNlY3RldHVyIGRvbG9yZSBxdWkgdGVuZGVybG9pbiBqb3dsIHZlbGl0IHNpcmxvaW4uIEV0IGFkIGN1bHBhLCBmYXRiYWNrIGNpbGx1bSBqb3dsIGJhbGwgdGlwIGhhbSBob2NrIG51bGxhIHNob3J0IHJpYnMgcGFyaWF0dXIgYXV0ZS4gUGlnIHBhbmNldHRhIGhhbSBicmVzYW9sYSwgdXQgYm91ZGluIG5vc3RydWQgY29tbW9kbyBmbGFuayBlc3NlIGNvdyB0b25ndWUgY3VscGEuIFBvcmsgYmVsbHkgYnJlc2FvbGEgZW5pbSBwaWcsIGVhIGNvbnNlY3RldHVyIG5pc2kuIEZ1Z2lhdCBvZmZpY2lhIHR1cmtleSwgZWEgY293IGpvd2wgcGFyaWF0dXIgdWxsYW1jbyBwcm9pZGVudCBkbyBsYWJvcnVtIHZlbGl0IHNhdXNhZ2UuIE1hZ25hIGJpbHRvbmcgc2ludCB0cmktdGlwIGNvbW1vZG8gc2VkIGJhY29uLCBlc3NlIHByb2lkZW50IGFsaXF1aXAuIFVsbGFtY28gaGFtIHNpbnQgZnVnaWF0LCB2ZWxpdCBpbiBlbmltIHNlZCBtb2xsaXQgbnVsbGEgY293IHV0IGFkaXBpc2ljaW5nIG5vc3RydWQgY29uc2VjdGV0dXIuIFByb2lkZW50IGRvbG9yZSBiZWVmIHJpYnMsIGxhYm9ydW0gbm9zdHJ1ZCBtZWF0YmFsbCBlYSBsYWJvcmlzIHJ1bXAgY3VwaWRhdGF0IGxhYm9yZSBjdWxwYS4gU2hhbmtsZSBtaW5pbSBiZWVmLCB2ZWxpdCBzaW50IGN1cGlkYXRhdCBmdWdpYXQgdGVuZGVybG9pbiBwaWcgZXQgYmFsbCB0aXAuIFV0IGNvdyBmYXRiYWNrIHNhbGFtaSwgYmFjb24gYmFsbCB0aXAgZXQgaW4gc2hhbmsgc3RyaXAgc3RlYWsgYnJlc2FvbGEuIEluIHV0IHBvcmsgYmVsbHkgc2VkIG1vbGxpdCB0cmktdGlwIG1hZ25hIGN1bHBhIHZlbmlhbSwgc2hvcnQgcmlicyBxdWkgaW4gYW5kb3VpbGxlIGhhbSBjb25zZXF1YXQuIERvbG9yZSBiYWNvbiB0LWJvbmUsIHZlbGl0IHNob3J0IHJpYnMgZW5pbSBzdHJpcCBzdGVhayBudWxsYS4gVm9sdXB0YXRlIGxhYm9yZSB1dCwgYmlsdG9uZyBzd2luZSBpcnVyZSBqZXJreS4gQ3VwaWRhdGF0IGV4Y2VwdGV1ciBhbGlxdWlwIHNhbGFtaSBkb2xvcmUuIEJhbGwgdGlwIHN0cmlwIHN0ZWFrIGluIHBvcmsgZG9sb3IuIEFkIGluIGVzc2UgYmlsdG9uZy4gRG9sb3JlIHRlbmRlcmxvaW4gZXhlcmNpdGF0aW9uIGFkIHBvcmsgbG9pbiB0LWJvbmUsIGRvbG9yZSBpbiBjaGlja2VuIGJhbGwgdGlwIHF1aSBwaWcuIFV0IGN1bHBhIHRvbmd1ZSwgc2ludCByaWJleWUgZG9sb3JlIGV4IHNoYW5rIHZvbHVwdGF0ZSBoYW1idXJnZXIuIEpvd2wgZXQgdGVtcG9yLCBib3VkaW4gcG9yayBjaG9wIGxhYm9yZSBoYW0gaG9jayBkcnVtc3RpY2sgY29uc2VjdGV0dXIgdHJpLXRpcCBlbGl0IHN3aW5lIG1lYXRiYWxsIGNoaWNrZW4gZ3JvdW5kIHJvdW5kLiBQcm9pZGVudCBzaGFua2xlIG1vbGxpdCBkb2xvcmUuIFNob3VsZGVyIHV0IGR1aXMgdC1ib25lIHF1aXMgcmVwcmVoZW5kZXJpdC4gTWVhdGxvYWYgZG9sb3JlIG1pbmltIHN0cmlwIHN0ZWFrLCBsYWJvcmlzIGVhIGF1dGUgYmFjb24gYmVlZiByaWJzIGVsaXQgc2hhbmsgaW4gdmVuaWFtIGRydW1zdGljayBxdWkuIEV4IGxhYm9yaXMgbWVhdGJhbGwgY293IHRvbmd1ZSBwb3JrIGJlbGx5LiBFYSBiYWxsIHRpcCByZXByZWhlbmRlcml0IHBpZywgc2VkIGZhdGJhY2sgYm91ZGluIGRvbG9yZSBmbGFuayBhbGlxdWlwIGxhYm9yaXMgZXUgcXVpcy4gQmVlZiByaWJzIGR1aXMgYmVlZiwgY293IGNvcm5lZCBiZWVmIGFkaXBpc2ljaW5nIGNvbW1vZG8gbmlzaSBkZXNlcnVudCBleGVyY2l0YXRpb24uIENpbGx1bSBkb2xvciB0LWJvbmUgc3BhcmUgcmlicywgaGFtIGhvY2sgZXN0IHNpcmxvaW4uIEJyaXNrZXQgaXJ1cmUgbWVhdGxvYWYgaW4sIGJvdWRpbiBwb3JrIGJlbGx5IHNpcmxvaW4gYmFsbCB0aXAuIFNpcmxvaW4gc2ludCBpcnVyZSBuaXNpIG5vc3RydWQgYWxpcXVhLiBOb3N0cnVkIG51bGxhIGF1dGUsIGVuaW0gb2ZmaWNpYSBjdWxwYSBoYW0gaG9jay4gQWxpcXVhIHJlcHJlaGVuZGVyaXQgZG9sb3JlIHN1bnQgbm9zdHJ1ZCBzYXVzYWdlLCBlYSBib3VkaW4gcG9yayBsb2luIHV0IHQtYm9uZSBoYW0gdGVtcG9yLiBUcmktdGlwIGV0IHBhbmNldHRhIGRydW1zdGljayBsYWJvcnVtLiBIYW0gaG9jayBtYWduYSBkbyBub3N0cnVkIGluIHByb2lkZW50LiBFeCBncm91bmQgcm91bmQgZmF0YmFjaywgdmVuaXNvbiBub24gcmliZXllIGluLic7XG5cblx0XHRcdGRvY3VtZW50LmJvZHkuaW5zZXJ0QmVmb3JlKGRpdiwgZmlyc3RDaGlsZCk7XG5cblx0XHRcdC8qIGdldCBzaXplIG9mIHVuaHlwaGVuYXRlZCB0ZXh0ICovXG5cdFx0XHRkaXZTdHlsZS5jc3NUZXh0ID0gJ3Bvc2l0aW9uOmFic29sdXRlO3RvcDowO2xlZnQ6MDt3aWR0aDo1ZW07dGV4dC1hbGlnbjpqdXN0aWZ5O3RleHQtanVzdGlmaWNhdGlvbjpuZXdzcGFwZXI7Jztcblx0XHRcdHNwYW5IZWlnaHQgPSBzcGFuLm9mZnNldEhlaWdodDtcblx0XHRcdHNwYW5XaWR0aCA9IHNwYW4ub2Zmc2V0V2lkdGg7XG5cblx0XHRcdC8qIGNvbXBhcmUgc2l6ZSB3aXRoIGh5cGhlbmF0ZWQgdGV4dCAqL1xuXHRcdFx0ZGl2U3R5bGUuY3NzVGV4dCA9ICdwb3NpdGlvbjphYnNvbHV0ZTt0b3A6MDtsZWZ0OjA7d2lkdGg6NWVtO3RleHQtYWxpZ246anVzdGlmeTsnK1xuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0ICd0ZXh0LWp1c3RpZmljYXRpb246bmV3c3BhcGVyOycrXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHQgTW9kZXJuaXpyLl9wcmVmaXhlcy5qb2luKCdoeXBoZW5zOmF1dG87ICcpO1xuXG5cdFx0XHRyZXN1bHQgPSAoc3Bhbi5vZmZzZXRIZWlnaHQgIT0gc3BhbkhlaWdodCB8fCBzcGFuLm9mZnNldFdpZHRoICE9IHNwYW5XaWR0aCk7XG5cblx0XHRcdC8qIHJlc3VsdHMgYW5kIGNsZWFudXAgKi9cblx0XHRcdGRvY3VtZW50LmJvZHkucmVtb3ZlQ2hpbGQoZGl2KTtcblx0XHRcdGRpdi5yZW1vdmVDaGlsZChzcGFuKTtcblxuXHRcdFx0cmV0dXJuIHJlc3VsdDtcblx0XHR9IGNhdGNoKGUpIHtcblx0XHRcdHJldHVybiBmYWxzZTtcblx0XHR9XG5cdH1cblxuXHQvLyBmb3IgdGhlIHNvZnRoeXBoZW5zIHRlc3Rcblx0ZnVuY3Rpb24gdGVzdF9oeXBoZW5zKGRlbGltaXRlciwgdGVzdFdpZHRoKSB7XG5cdFx0dHJ5IHtcblx0XHRcdC8qIGNyZWF0ZSBhIGRpdiBjb250YWluZXIgYW5kIGEgc3BhbiB3aXRoaW4gdGhhdFxuXHRcdFx0ICogdGhlc2UgaGF2ZSB0byBiZSBhcHBlbmRlZCB0byBkb2N1bWVudC5ib2R5LCBvdGhlcndpc2Ugc29tZSBicm93c2VycyBjYW4gZ2l2ZSBmYWxzZSBuZWdhdGl2ZSAqL1xuXHRcdFx0dmFyIGRpdiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpLFxuXHRcdFx0XHRzcGFuID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnc3BhbicpLFxuXHRcdFx0XHRkaXZTdHlsZSA9IGRpdi5zdHlsZSxcblx0XHRcdFx0c3BhblNpemUgPSAwLFxuXHRcdFx0XHRyZXN1bHQgPSBmYWxzZSxcblx0XHRcdFx0cmVzdWx0MSA9IGZhbHNlLFxuXHRcdFx0XHRyZXN1bHQyID0gZmFsc2UsXG5cdFx0XHRcdGZpcnN0Q2hpbGQgPSBkb2N1bWVudC5ib2R5LmZpcnN0RWxlbWVudENoaWxkIHx8IGRvY3VtZW50LmJvZHkuZmlyc3RDaGlsZDtcblxuXHRcdFx0ZGl2U3R5bGUuY3NzVGV4dCA9ICdwb3NpdGlvbjphYnNvbHV0ZTt0b3A6MDtsZWZ0OjA7b3ZlcmZsb3c6dmlzaWJsZTt3aWR0aDoxLjI1ZW07Jztcblx0XHRcdGRpdi5hcHBlbmRDaGlsZChzcGFuKTtcblx0XHRcdGRvY3VtZW50LmJvZHkuaW5zZXJ0QmVmb3JlKGRpdiwgZmlyc3RDaGlsZCk7XG5cblxuXHRcdFx0LyogZ2V0IGhlaWdodCBvZiB1bndyYXBwZWQgdGV4dCAqL1xuXHRcdFx0c3Bhbi5pbm5lckhUTUwgPSAnbW0nO1xuXHRcdFx0c3BhblNpemUgPSBzcGFuLm9mZnNldEhlaWdodDtcblxuXHRcdFx0LyogY29tcGFyZSBoZWlnaHQgdy8gZGVsaW1pdGVyLCB0byBzZWUgaWYgaXQgd3JhcHMgdG8gbmV3IGxpbmUgKi9cblx0XHRcdHNwYW4uaW5uZXJIVE1MID0gJ20nICsgZGVsaW1pdGVyICsgJ20nO1xuXHRcdFx0cmVzdWx0MSA9IChzcGFuLm9mZnNldEhlaWdodCA+IHNwYW5TaXplKTtcblxuXHRcdFx0LyogaWYgd2UncmUgdGVzdGluZyB0aGUgd2lkdGggdG9vIChpLmUuIGZvciBzb2Z0LWh5cGhlbiwgbm90IHp3cyksXG5cdFx0XHQgKiB0aGlzIGlzIGJlY2F1c2UgdGVzdGVkIEJsYWNrYmVycnkgZGV2aWNlcyB3aWxsIHdyYXAgdGhlIHRleHQgYnV0IG5vdCBkaXNwbGF5IHRoZSBoeXBoZW4gKi9cblx0XHRcdGlmICh0ZXN0V2lkdGgpIHtcblx0XHRcdFx0LyogZ2V0IHdpZHRoIG9mIHdyYXBwZWQsIG5vbi1oeXBoZW5hdGVkIHRleHQgKi9cblx0XHRcdFx0c3Bhbi5pbm5lckhUTUwgPSAnbTxiciAvPm0nO1xuXHRcdFx0XHRzcGFuU2l6ZSA9IHNwYW4ub2Zmc2V0V2lkdGg7XG5cblx0XHRcdFx0LyogY29tcGFyZSB3aWR0aCB3LyB3cmFwcGVkIHcvIGRlbGltaXRlciB0byBzZWUgaWYgaHlwaGVuIGlzIHByZXNlbnQgKi9cblx0XHRcdFx0c3Bhbi5pbm5lckhUTUwgPSAnbScgKyBkZWxpbWl0ZXIgKyAnbSc7XG5cdFx0XHRcdHJlc3VsdDIgPSAoc3Bhbi5vZmZzZXRXaWR0aCA+IHNwYW5TaXplKTtcblx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdHJlc3VsdDIgPSB0cnVlO1xuXHRcdFx0fVxuXG5cdFx0XHQvKiByZXN1bHRzIGFuZCBjbGVhbnVwICovXG5cdFx0XHRpZiAocmVzdWx0MSA9PT0gdHJ1ZSAmJiByZXN1bHQyID09PSB0cnVlKSB7IHJlc3VsdCA9IHRydWU7IH1cblx0XHRcdGRvY3VtZW50LmJvZHkucmVtb3ZlQ2hpbGQoZGl2KTtcblx0XHRcdGRpdi5yZW1vdmVDaGlsZChzcGFuKTtcblxuXHRcdFx0cmV0dXJuIHJlc3VsdDtcblx0XHR9IGNhdGNoKGUpIHtcblx0XHRcdHJldHVybiBmYWxzZTtcblx0XHR9XG5cdH1cblxuXHQvLyB0ZXN0aW5nIGlmIGluLWJyb3dzZXIgRmluZCBmdW5jdGlvbmFsaXR5IHdpbGwgd29yayBvbiBoeXBoZW5hdGVkIHRleHRcblx0ZnVuY3Rpb24gdGVzdF9oeXBoZW5zX2ZpbmQoZGVsaW1pdGVyKSB7XG5cdFx0dHJ5IHtcblx0XHRcdC8qIGNyZWF0ZSBhIGR1bW15IGlucHV0IGZvciByZXNldHRpbmcgc2VsZWN0aW9uIGxvY2F0aW9uLCBhbmQgYSBkaXYgY29udGFpbmVyXG5cdFx0XHQgKiB0aGVzZSBoYXZlIHRvIGJlIGFwcGVuZGVkIHRvIGRvY3VtZW50LmJvZHksIG90aGVyd2lzZSBzb21lIGJyb3dzZXJzIGNhbiBnaXZlIGZhbHNlIG5lZ2F0aXZlXG5cdFx0XHQgKiBkaXYgY29udGFpbmVyIGdldHMgdGhlIGRvdWJsZWQgdGVzdHdvcmQsIHNlcGFyYXRlZCBieSB0aGUgZGVsaW1pdGVyXG5cdFx0XHQgKiBOb3RlOiBnaXZpbmcgYSB3aWR0aCB0byBkaXYgZ2l2ZXMgZmFsc2UgcG9zaXRpdmUgaW4gaU9TIFNhZmFyaSAqL1xuXHRcdFx0dmFyIGR1bW15ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnaW5wdXQnKSxcblx0XHRcdFx0ZGl2ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2JyksXG5cdFx0XHRcdHRlc3R3b3JkID0gJ2xlYm93c2tpJyxcblx0XHRcdFx0cmVzdWx0ID0gZmFsc2UsXG5cdFx0XHRcdHRleHRyYW5nZSxcblx0XHRcdFx0Zmlyc3RDaGlsZCA9IGRvY3VtZW50LmJvZHkuZmlyc3RFbGVtZW50Q2hpbGQgfHwgZG9jdW1lbnQuYm9keS5maXJzdENoaWxkO1xuXG5cdFx0XHRkaXYuaW5uZXJIVE1MID0gdGVzdHdvcmQgKyBkZWxpbWl0ZXIgKyB0ZXN0d29yZDtcblxuXHRcdFx0ZG9jdW1lbnQuYm9keS5pbnNlcnRCZWZvcmUoZGl2LCBmaXJzdENoaWxkKTtcblx0XHRcdGRvY3VtZW50LmJvZHkuaW5zZXJ0QmVmb3JlKGR1bW15LCBkaXYpO1xuXG5cblx0XHRcdC8qIHJlc2V0IHRoZSBzZWxlY3Rpb24gdG8gdGhlIGR1bW15IGlucHV0IGVsZW1lbnQsIGkuZS4gQkVGT1JFIHRoZSBkaXYgY29udGFpbmVyXG5cdFx0XHQgKiAgIHN0YWNrb3ZlcmZsb3cuY29tL3F1ZXN0aW9ucy80OTkxMjYvanF1ZXJ5LXNldC1jdXJzb3ItcG9zaXRpb24taW4tdGV4dC1hcmVhICovXG5cdFx0XHRpZiAoZHVtbXkuc2V0U2VsZWN0aW9uUmFuZ2UpIHtcblx0XHRcdFx0ZHVtbXkuZm9jdXMoKTtcblx0XHRcdFx0ZHVtbXkuc2V0U2VsZWN0aW9uUmFuZ2UoMCwwKTtcblx0XHRcdH0gZWxzZSBpZiAoZHVtbXkuY3JlYXRlVGV4dFJhbmdlKSB7XG5cdFx0XHRcdHRleHRyYW5nZSA9IGR1bW15LmNyZWF0ZVRleHRSYW5nZSgpO1xuXHRcdFx0XHR0ZXh0cmFuZ2UuY29sbGFwc2UodHJ1ZSk7XG5cdFx0XHRcdHRleHRyYW5nZS5tb3ZlRW5kKCdjaGFyYWN0ZXInLCAwKTtcblx0XHRcdFx0dGV4dHJhbmdlLm1vdmVTdGFydCgnY2hhcmFjdGVyJywgMCk7XG5cdFx0XHRcdHRleHRyYW5nZS5zZWxlY3QoKTtcblx0XHRcdH1cblxuXHRcdFx0LyogdHJ5IHRvIGZpbmQgdGhlIGRvdWJsZWQgdGVzdHdvcmQsIHdpdGhvdXQgdGhlIGRlbGltaXRlciAqL1xuXHRcdFx0aWYgKHdpbmRvdy5maW5kKSB7XG5cdFx0XHRcdHJlc3VsdCA9IHdpbmRvdy5maW5kKHRlc3R3b3JkICsgdGVzdHdvcmQpO1xuXHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0dHJ5IHtcblx0XHRcdFx0XHR0ZXh0cmFuZ2UgPSB3aW5kb3cuc2VsZi5kb2N1bWVudC5ib2R5LmNyZWF0ZVRleHRSYW5nZSgpO1xuXHRcdFx0XHRcdHJlc3VsdCA9IHRleHRyYW5nZS5maW5kVGV4dCh0ZXN0d29yZCArIHRlc3R3b3JkKTtcblx0XHRcdFx0fSBjYXRjaChlKSB7XG5cdFx0XHRcdFx0cmVzdWx0ID0gZmFsc2U7XG5cdFx0XHRcdH1cblx0XHRcdH1cblxuXHRcdFx0ZG9jdW1lbnQuYm9keS5yZW1vdmVDaGlsZChkaXYpO1xuXHRcdFx0ZG9jdW1lbnQuYm9keS5yZW1vdmVDaGlsZChkdW1teSk7XG5cblx0XHRcdHJldHVybiByZXN1bHQ7XG5cdFx0fSBjYXRjaChlKSB7XG5cdFx0XHRyZXR1cm4gZmFsc2U7XG5cdFx0fVxuXHR9XG5cblx0TW9kZXJuaXpyLmFkZFRlc3QoXCJjc3NoeXBoZW5zXCIsIGZ1bmN0aW9uKCkge1xuXG5cdFx0aWYgKCFNb2Rlcm5penIudGVzdEFsbFByb3BzKCdoeXBoZW5zJykpIHJldHVybiBmYWxzZTtcblxuXHRcdC8qIENocm9tZSBsaWVzIGFib3V0IGl0cyBoeXBoZW5zIHN1cHBvcnQgc28gd2UgbmVlZCBhIG1vcmUgcm9idXN0IHRlc3Rcblx0XHRcdFx0Y3JidWcuY29tLzEwNzExMVxuXHRcdCovXG5cdFx0dHJ5IHtcblx0XHRcdHJldHVybiB0ZXN0X2h5cGhlbnNfY3NzKCk7XG5cdFx0fSBjYXRjaChlKSB7XG5cdFx0XHRyZXR1cm4gZmFsc2U7XG5cdFx0fVxuXHR9KTtcblxuXHRNb2Rlcm5penIuYWRkVGVzdChcInNvZnRoeXBoZW5zXCIsIGZ1bmN0aW9uKCkge1xuXHRcdHRyeSB7XG5cdFx0XHQvLyB1c2UgbnVtZXJpYyBlbnRpdHkgaW5zdGVhZCBvZiAmc2h5OyBpbiBjYXNlIGl0J3MgWEhUTUxcblx0XHRcdHJldHVybiB0ZXN0X2h5cGhlbnMoJyYjMTczOycsIHRydWUpICYmIHRlc3RfaHlwaGVucygnJiM4MjAzOycsIGZhbHNlKTtcblx0XHR9IGNhdGNoKGUpIHtcblx0XHRcdHJldHVybiBmYWxzZTtcblx0XHR9XG5cdH0pO1xuXG5cdE1vZGVybml6ci5hZGRUZXN0KFwic29mdGh5cGhlbnNmaW5kXCIsIGZ1bmN0aW9uKCkge1xuXHRcdHRyeSB7XG5cdFx0XHRyZXR1cm4gdGVzdF9oeXBoZW5zX2ZpbmQoJyYjMTczOycpICYmIHRlc3RfaHlwaGVuc19maW5kKCcmIzgyMDM7Jyk7XG5cdFx0fSBjYXRjaChlKSB7XG5cdFx0XHRyZXR1cm4gZmFsc2U7XG5cdFx0fVxuXHR9KTtcblxufSkoKTtcbiJdLCJmaWxlIjoibW9kZXJuaXpyL2ZlYXR1cmUtZGV0ZWN0cy9jc3MtaHlwaGVucy5qcyIsInNvdXJjZVJvb3QiOiIvc291cmNlLyJ9