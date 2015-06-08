

// Detects whether input type="file" is available on the platform
// E.g. iOS < 6 and some android version don't support this

//  It's useful if you want to hide the upload feature of your app on devices that
//  don't support it (iphone, ipad, etc).

Modernizr.addTest('fileinput', function() {
    var elem = document.createElement('input');
    elem.type = 'file';
    return !elem.disabled;
});

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiIiwic291cmNlcyI6WyJtb2Rlcm5penIvZmVhdHVyZS1kZXRlY3RzL2Zvcm1zLWZpbGVpbnB1dC5qcyJdLCJzb3VyY2VzQ29udGVudCI6WyJcblxuLy8gRGV0ZWN0cyB3aGV0aGVyIGlucHV0IHR5cGU9XCJmaWxlXCIgaXMgYXZhaWxhYmxlIG9uIHRoZSBwbGF0Zm9ybVxuLy8gRS5nLiBpT1MgPCA2IGFuZCBzb21lIGFuZHJvaWQgdmVyc2lvbiBkb24ndCBzdXBwb3J0IHRoaXNcblxuLy8gIEl0J3MgdXNlZnVsIGlmIHlvdSB3YW50IHRvIGhpZGUgdGhlIHVwbG9hZCBmZWF0dXJlIG9mIHlvdXIgYXBwIG9uIGRldmljZXMgdGhhdFxuLy8gIGRvbid0IHN1cHBvcnQgaXQgKGlwaG9uZSwgaXBhZCwgZXRjKS5cblxuTW9kZXJuaXpyLmFkZFRlc3QoJ2ZpbGVpbnB1dCcsIGZ1bmN0aW9uKCkge1xuICAgIHZhciBlbGVtID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnaW5wdXQnKTtcbiAgICBlbGVtLnR5cGUgPSAnZmlsZSc7XG4gICAgcmV0dXJuICFlbGVtLmRpc2FibGVkO1xufSk7XG4iXSwiZmlsZSI6Im1vZGVybml6ci9mZWF0dXJlLWRldGVjdHMvZm9ybXMtZmlsZWlucHV0LmpzIiwic291cmNlUm9vdCI6Ii9zb3VyY2UvIn0=