// CSS Regions
// http://www.w3.org/TR/css3-regions/
// By: Mihai Balan

// We start with a CSS parser test then we check page geometry to see if it's affected by regions
// Later we might be able to retire the second part, as WebKit builds with the false positives die out

Modernizr.addTest('regions', function() {

	/* Get the 'flowFrom' property name available in the browser. Either default or vendor prefixed.
	If the property name can't be found we'll get Boolean 'false' and fail quickly */
	var flowFromProperty = Modernizr.prefixed("flowFrom"),
		flowIntoProperty = Modernizr.prefixed("flowInto");

	if (!flowFromProperty || !flowIntoProperty){
		return false;
	}

	/* If CSS parsing is there, try to determine if regions actually work. */
	var container		= document.createElement('div'),
		content			= document.createElement('div'),
		region			= document.createElement('div'),

	/* we create a random, unlikely to be generated flow number to make sure we don't
	clash with anything more vanilla, like 'flow', or 'article', or 'f1' */
	flowName = 'modernizr_flow_for_regions_check';

	/* First create a div with two adjacent divs inside it. The first will be the
	content, the second will be the region. To be able to distinguish between the two,
	we'll give the region a particular padding */
	content.innerText		= 'M';
	container.style.cssText	= 'top: 150px; left: 150px; padding: 0px;';
	region.style.cssText	= 'width: 50px; height: 50px; padding: 42px;';

	region.style[flowFromProperty] = flowName;
	container.appendChild(content);
	container.appendChild(region);
	document.documentElement.appendChild(container);

	/* Now compute the bounding client rect, before and after attempting to flow the
	content div in the region div. If regions are enabled, the after bounding rect
	should reflect the padding of the region div.*/
	var flowedRect, delta,
		plainRect = content.getBoundingClientRect();


	content.style[flowIntoProperty] = flowName;
	flowedRect = content.getBoundingClientRect();

	delta = flowedRect.left - plainRect.left;
	document.documentElement.removeChild(container);
	content = region = container = undefined;

	return (delta == 42);
});

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiIiwic291cmNlcyI6WyJtb2Rlcm5penIvZmVhdHVyZS1kZXRlY3RzL2Nzcy1yZWdpb25zLmpzIl0sInNvdXJjZXNDb250ZW50IjpbIi8vIENTUyBSZWdpb25zXG4vLyBodHRwOi8vd3d3LnczLm9yZy9UUi9jc3MzLXJlZ2lvbnMvXG4vLyBCeTogTWloYWkgQmFsYW5cblxuLy8gV2Ugc3RhcnQgd2l0aCBhIENTUyBwYXJzZXIgdGVzdCB0aGVuIHdlIGNoZWNrIHBhZ2UgZ2VvbWV0cnkgdG8gc2VlIGlmIGl0J3MgYWZmZWN0ZWQgYnkgcmVnaW9uc1xuLy8gTGF0ZXIgd2UgbWlnaHQgYmUgYWJsZSB0byByZXRpcmUgdGhlIHNlY29uZCBwYXJ0LCBhcyBXZWJLaXQgYnVpbGRzIHdpdGggdGhlIGZhbHNlIHBvc2l0aXZlcyBkaWUgb3V0XG5cbk1vZGVybml6ci5hZGRUZXN0KCdyZWdpb25zJywgZnVuY3Rpb24oKSB7XG5cblx0LyogR2V0IHRoZSAnZmxvd0Zyb20nIHByb3BlcnR5IG5hbWUgYXZhaWxhYmxlIGluIHRoZSBicm93c2VyLiBFaXRoZXIgZGVmYXVsdCBvciB2ZW5kb3IgcHJlZml4ZWQuXG5cdElmIHRoZSBwcm9wZXJ0eSBuYW1lIGNhbid0IGJlIGZvdW5kIHdlJ2xsIGdldCBCb29sZWFuICdmYWxzZScgYW5kIGZhaWwgcXVpY2tseSAqL1xuXHR2YXIgZmxvd0Zyb21Qcm9wZXJ0eSA9IE1vZGVybml6ci5wcmVmaXhlZChcImZsb3dGcm9tXCIpLFxuXHRcdGZsb3dJbnRvUHJvcGVydHkgPSBNb2Rlcm5penIucHJlZml4ZWQoXCJmbG93SW50b1wiKTtcblxuXHRpZiAoIWZsb3dGcm9tUHJvcGVydHkgfHwgIWZsb3dJbnRvUHJvcGVydHkpe1xuXHRcdHJldHVybiBmYWxzZTtcblx0fVxuXG5cdC8qIElmIENTUyBwYXJzaW5nIGlzIHRoZXJlLCB0cnkgdG8gZGV0ZXJtaW5lIGlmIHJlZ2lvbnMgYWN0dWFsbHkgd29yay4gKi9cblx0dmFyIGNvbnRhaW5lclx0XHQ9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpLFxuXHRcdGNvbnRlbnRcdFx0XHQ9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpLFxuXHRcdHJlZ2lvblx0XHRcdD0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2JyksXG5cblx0Lyogd2UgY3JlYXRlIGEgcmFuZG9tLCB1bmxpa2VseSB0byBiZSBnZW5lcmF0ZWQgZmxvdyBudW1iZXIgdG8gbWFrZSBzdXJlIHdlIGRvbid0XG5cdGNsYXNoIHdpdGggYW55dGhpbmcgbW9yZSB2YW5pbGxhLCBsaWtlICdmbG93Jywgb3IgJ2FydGljbGUnLCBvciAnZjEnICovXG5cdGZsb3dOYW1lID0gJ21vZGVybml6cl9mbG93X2Zvcl9yZWdpb25zX2NoZWNrJztcblxuXHQvKiBGaXJzdCBjcmVhdGUgYSBkaXYgd2l0aCB0d28gYWRqYWNlbnQgZGl2cyBpbnNpZGUgaXQuIFRoZSBmaXJzdCB3aWxsIGJlIHRoZVxuXHRjb250ZW50LCB0aGUgc2Vjb25kIHdpbGwgYmUgdGhlIHJlZ2lvbi4gVG8gYmUgYWJsZSB0byBkaXN0aW5ndWlzaCBiZXR3ZWVuIHRoZSB0d28sXG5cdHdlJ2xsIGdpdmUgdGhlIHJlZ2lvbiBhIHBhcnRpY3VsYXIgcGFkZGluZyAqL1xuXHRjb250ZW50LmlubmVyVGV4dFx0XHQ9ICdNJztcblx0Y29udGFpbmVyLnN0eWxlLmNzc1RleHRcdD0gJ3RvcDogMTUwcHg7IGxlZnQ6IDE1MHB4OyBwYWRkaW5nOiAwcHg7Jztcblx0cmVnaW9uLnN0eWxlLmNzc1RleHRcdD0gJ3dpZHRoOiA1MHB4OyBoZWlnaHQ6IDUwcHg7IHBhZGRpbmc6IDQycHg7JztcblxuXHRyZWdpb24uc3R5bGVbZmxvd0Zyb21Qcm9wZXJ0eV0gPSBmbG93TmFtZTtcblx0Y29udGFpbmVyLmFwcGVuZENoaWxkKGNvbnRlbnQpO1xuXHRjb250YWluZXIuYXBwZW5kQ2hpbGQocmVnaW9uKTtcblx0ZG9jdW1lbnQuZG9jdW1lbnRFbGVtZW50LmFwcGVuZENoaWxkKGNvbnRhaW5lcik7XG5cblx0LyogTm93IGNvbXB1dGUgdGhlIGJvdW5kaW5nIGNsaWVudCByZWN0LCBiZWZvcmUgYW5kIGFmdGVyIGF0dGVtcHRpbmcgdG8gZmxvdyB0aGVcblx0Y29udGVudCBkaXYgaW4gdGhlIHJlZ2lvbiBkaXYuIElmIHJlZ2lvbnMgYXJlIGVuYWJsZWQsIHRoZSBhZnRlciBib3VuZGluZyByZWN0XG5cdHNob3VsZCByZWZsZWN0IHRoZSBwYWRkaW5nIG9mIHRoZSByZWdpb24gZGl2LiovXG5cdHZhciBmbG93ZWRSZWN0LCBkZWx0YSxcblx0XHRwbGFpblJlY3QgPSBjb250ZW50LmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpO1xuXG5cblx0Y29udGVudC5zdHlsZVtmbG93SW50b1Byb3BlcnR5XSA9IGZsb3dOYW1lO1xuXHRmbG93ZWRSZWN0ID0gY29udGVudC5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKTtcblxuXHRkZWx0YSA9IGZsb3dlZFJlY3QubGVmdCAtIHBsYWluUmVjdC5sZWZ0O1xuXHRkb2N1bWVudC5kb2N1bWVudEVsZW1lbnQucmVtb3ZlQ2hpbGQoY29udGFpbmVyKTtcblx0Y29udGVudCA9IHJlZ2lvbiA9IGNvbnRhaW5lciA9IHVuZGVmaW5lZDtcblxuXHRyZXR1cm4gKGRlbHRhID09IDQyKTtcbn0pO1xuIl0sImZpbGUiOiJtb2Rlcm5penIvZmVhdHVyZS1kZXRlY3RzL2Nzcy1yZWdpb25zLmpzIiwic291cmNlUm9vdCI6Ii9zb3VyY2UvIn0=