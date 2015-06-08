// Detects whether input form="form_id" is available on the platform
// E.g. IE 10 (and below), don't support this
Modernizr.addTest("formattribute", function() {
	var form = document.createElement("form"),
		input = document.createElement("input"),
		div = document.createElement("div"),
		id = "formtest"+(new Date().getTime()),
		attr,
		bool = false;

		form.id = id;

	//IE6/7 confuses the form idl attribute and the form content attribute
	if(document.createAttribute){
		attr = document.createAttribute("form");
		attr.nodeValue = id;
		input.setAttributeNode(attr);
		div.appendChild(form);
		div.appendChild(input);

		document.documentElement.appendChild(div);

		bool = form.elements.length === 1 && input.form == form;

		div.parentNode.removeChild(div);
	}

	return bool;
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiIiwic291cmNlcyI6WyJtb2Rlcm5penIvZmVhdHVyZS1kZXRlY3RzL2Zvcm1zLWZvcm1hdHRyaWJ1dGUuanMiXSwic291cmNlc0NvbnRlbnQiOlsiLy8gRGV0ZWN0cyB3aGV0aGVyIGlucHV0IGZvcm09XCJmb3JtX2lkXCIgaXMgYXZhaWxhYmxlIG9uIHRoZSBwbGF0Zm9ybVxuLy8gRS5nLiBJRSAxMCAoYW5kIGJlbG93KSwgZG9uJ3Qgc3VwcG9ydCB0aGlzXG5Nb2Rlcm5penIuYWRkVGVzdChcImZvcm1hdHRyaWJ1dGVcIiwgZnVuY3Rpb24oKSB7XG5cdHZhciBmb3JtID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImZvcm1cIiksXG5cdFx0aW5wdXQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiaW5wdXRcIiksXG5cdFx0ZGl2ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImRpdlwiKSxcblx0XHRpZCA9IFwiZm9ybXRlc3RcIisobmV3IERhdGUoKS5nZXRUaW1lKCkpLFxuXHRcdGF0dHIsXG5cdFx0Ym9vbCA9IGZhbHNlO1xuXG5cdFx0Zm9ybS5pZCA9IGlkO1xuXG5cdC8vSUU2LzcgY29uZnVzZXMgdGhlIGZvcm0gaWRsIGF0dHJpYnV0ZSBhbmQgdGhlIGZvcm0gY29udGVudCBhdHRyaWJ1dGVcblx0aWYoZG9jdW1lbnQuY3JlYXRlQXR0cmlidXRlKXtcblx0XHRhdHRyID0gZG9jdW1lbnQuY3JlYXRlQXR0cmlidXRlKFwiZm9ybVwiKTtcblx0XHRhdHRyLm5vZGVWYWx1ZSA9IGlkO1xuXHRcdGlucHV0LnNldEF0dHJpYnV0ZU5vZGUoYXR0cik7XG5cdFx0ZGl2LmFwcGVuZENoaWxkKGZvcm0pO1xuXHRcdGRpdi5hcHBlbmRDaGlsZChpbnB1dCk7XG5cblx0XHRkb2N1bWVudC5kb2N1bWVudEVsZW1lbnQuYXBwZW5kQ2hpbGQoZGl2KTtcblxuXHRcdGJvb2wgPSBmb3JtLmVsZW1lbnRzLmxlbmd0aCA9PT0gMSAmJiBpbnB1dC5mb3JtID09IGZvcm07XG5cblx0XHRkaXYucGFyZW50Tm9kZS5yZW1vdmVDaGlsZChkaXYpO1xuXHR9XG5cblx0cmV0dXJuIGJvb2w7XG59KTsiXSwiZmlsZSI6Im1vZGVybml6ci9mZWF0dXJlLWRldGVjdHMvZm9ybXMtZm9ybWF0dHJpYnV0ZS5qcyIsInNvdXJjZVJvb3QiOiIvc291cmNlLyJ9