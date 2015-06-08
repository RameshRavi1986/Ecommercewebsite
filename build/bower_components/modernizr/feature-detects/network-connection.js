// determining low-bandwidth via navigator.connection

// There are two iterations of the navigator.connection interface:

// The first is present in Android 2.2+ and only in the Browser (not WebView)
// : docs.phonegap.com/en/1.2.0/phonegap_connection_connection.md.html#connection.type
// : davidbcalhoun.com/2010/using-navigator-connection-android

// The second is specced at dev.w3.org/2009/dap/netinfo/ and perhaps landing in WebKit
// : bugs.webkit.org/show_bug.cgi?id=73528

// unknown devices are assumed as fast
// for more rigorous network testing, consider boomerang.js: github.com/bluesmoon/boomerang/

Modernizr.addTest('lowbandwidth', function() {

  var connection = navigator.connection || { type: 0 }; // polyfill

  return connection.type == 3 || // connection.CELL_2G
      connection.type == 4 || // connection.CELL_3G
      /^[23]g$/.test(connection.type); // string value in new spec
});

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiIiwic291cmNlcyI6WyJtb2Rlcm5penIvZmVhdHVyZS1kZXRlY3RzL25ldHdvcmstY29ubmVjdGlvbi5qcyJdLCJzb3VyY2VzQ29udGVudCI6WyIvLyBkZXRlcm1pbmluZyBsb3ctYmFuZHdpZHRoIHZpYSBuYXZpZ2F0b3IuY29ubmVjdGlvblxuXG4vLyBUaGVyZSBhcmUgdHdvIGl0ZXJhdGlvbnMgb2YgdGhlIG5hdmlnYXRvci5jb25uZWN0aW9uIGludGVyZmFjZTpcblxuLy8gVGhlIGZpcnN0IGlzIHByZXNlbnQgaW4gQW5kcm9pZCAyLjIrIGFuZCBvbmx5IGluIHRoZSBCcm93c2VyIChub3QgV2ViVmlldylcbi8vIDogZG9jcy5waG9uZWdhcC5jb20vZW4vMS4yLjAvcGhvbmVnYXBfY29ubmVjdGlvbl9jb25uZWN0aW9uLm1kLmh0bWwjY29ubmVjdGlvbi50eXBlXG4vLyA6IGRhdmlkYmNhbGhvdW4uY29tLzIwMTAvdXNpbmctbmF2aWdhdG9yLWNvbm5lY3Rpb24tYW5kcm9pZFxuXG4vLyBUaGUgc2Vjb25kIGlzIHNwZWNjZWQgYXQgZGV2LnczLm9yZy8yMDA5L2RhcC9uZXRpbmZvLyBhbmQgcGVyaGFwcyBsYW5kaW5nIGluIFdlYktpdFxuLy8gOiBidWdzLndlYmtpdC5vcmcvc2hvd19idWcuY2dpP2lkPTczNTI4XG5cbi8vIHVua25vd24gZGV2aWNlcyBhcmUgYXNzdW1lZCBhcyBmYXN0XG4vLyBmb3IgbW9yZSByaWdvcm91cyBuZXR3b3JrIHRlc3RpbmcsIGNvbnNpZGVyIGJvb21lcmFuZy5qczogZ2l0aHViLmNvbS9ibHVlc21vb24vYm9vbWVyYW5nL1xuXG5Nb2Rlcm5penIuYWRkVGVzdCgnbG93YmFuZHdpZHRoJywgZnVuY3Rpb24oKSB7XG5cbiAgdmFyIGNvbm5lY3Rpb24gPSBuYXZpZ2F0b3IuY29ubmVjdGlvbiB8fCB7IHR5cGU6IDAgfTsgLy8gcG9seWZpbGxcblxuICByZXR1cm4gY29ubmVjdGlvbi50eXBlID09IDMgfHwgLy8gY29ubmVjdGlvbi5DRUxMXzJHXG4gICAgICBjb25uZWN0aW9uLnR5cGUgPT0gNCB8fCAvLyBjb25uZWN0aW9uLkNFTExfM0dcbiAgICAgIC9eWzIzXWckLy50ZXN0KGNvbm5lY3Rpb24udHlwZSk7IC8vIHN0cmluZyB2YWx1ZSBpbiBuZXcgc3BlY1xufSk7XG4iXSwiZmlsZSI6Im1vZGVybml6ci9mZWF0dXJlLWRldGVjdHMvbmV0d29yay1jb25uZWN0aW9uLmpzIiwic291cmNlUm9vdCI6Ii9zb3VyY2UvIn0=