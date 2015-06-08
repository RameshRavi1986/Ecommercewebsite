// by jussi-kalliokoski


// This test is asynchronous. Watch out.

// The test will potentially add garbage to console.

(function(){
  try {
    // we're avoiding using Modernizr._domPrefixes as the prefix capitalization on
    // these guys are notoriously peculiar.
    var BlobBuilder = window.MozBlobBuilder || window.WebKitBlobBuilder || window.MSBlobBuilder || window.OBlobBuilder || window.BlobBuilder;
    var URL         = window.MozURL || window.webkitURL || window.MSURL || window.OURL || window.URL;
    var data    = 'Modernizr',
        blob,
        bb,
        worker,
        url,
        timeout,
        scriptText = 'this.onmessage=function(e){postMessage(e.data)}';

    try {
      blob = new Blob([scriptText], {type:'text/javascript'});
    } catch(e) {
      // we'll fall back to the deprecated BlobBuilder
    }
    if (!blob) {
      bb = new BlobBuilder();
      bb.append(scriptText);
      blob = bb.getBlob();
    }

    url = URL.createObjectURL(blob);
    worker = new Worker(url);

    worker.onmessage = function(e) {
      Modernizr.addTest('blobworkers', data === e.data);
      cleanup();
    };

    // Just in case...
    worker.onerror = fail;
    timeout = setTimeout(fail, 200);

    worker.postMessage(data);
  } catch (e) {
    fail();
  }

  function fail() {
    Modernizr.addTest('blobworkers', false);
    cleanup();
  }

  function cleanup() {
    if (url) {
      URL.revokeObjectURL(url);
    }
    if (worker) {
      worker.terminate();
    }
    if (timeout) {
      clearTimeout(timeout);
    }
  }
}());

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiIiwic291cmNlcyI6WyJtb2Rlcm5penIvZmVhdHVyZS1kZXRlY3RzL3dvcmtlcnMtYmxvYndvcmtlcnMuanMiXSwic291cmNlc0NvbnRlbnQiOlsiLy8gYnkganVzc2kta2FsbGlva29za2lcblxuXG4vLyBUaGlzIHRlc3QgaXMgYXN5bmNocm9ub3VzLiBXYXRjaCBvdXQuXG5cbi8vIFRoZSB0ZXN0IHdpbGwgcG90ZW50aWFsbHkgYWRkIGdhcmJhZ2UgdG8gY29uc29sZS5cblxuKGZ1bmN0aW9uKCl7XG4gIHRyeSB7XG4gICAgLy8gd2UncmUgYXZvaWRpbmcgdXNpbmcgTW9kZXJuaXpyLl9kb21QcmVmaXhlcyBhcyB0aGUgcHJlZml4IGNhcGl0YWxpemF0aW9uIG9uXG4gICAgLy8gdGhlc2UgZ3V5cyBhcmUgbm90b3Jpb3VzbHkgcGVjdWxpYXIuXG4gICAgdmFyIEJsb2JCdWlsZGVyID0gd2luZG93Lk1vekJsb2JCdWlsZGVyIHx8IHdpbmRvdy5XZWJLaXRCbG9iQnVpbGRlciB8fCB3aW5kb3cuTVNCbG9iQnVpbGRlciB8fCB3aW5kb3cuT0Jsb2JCdWlsZGVyIHx8IHdpbmRvdy5CbG9iQnVpbGRlcjtcbiAgICB2YXIgVVJMICAgICAgICAgPSB3aW5kb3cuTW96VVJMIHx8IHdpbmRvdy53ZWJraXRVUkwgfHwgd2luZG93Lk1TVVJMIHx8IHdpbmRvdy5PVVJMIHx8IHdpbmRvdy5VUkw7XG4gICAgdmFyIGRhdGEgICAgPSAnTW9kZXJuaXpyJyxcbiAgICAgICAgYmxvYixcbiAgICAgICAgYmIsXG4gICAgICAgIHdvcmtlcixcbiAgICAgICAgdXJsLFxuICAgICAgICB0aW1lb3V0LFxuICAgICAgICBzY3JpcHRUZXh0ID0gJ3RoaXMub25tZXNzYWdlPWZ1bmN0aW9uKGUpe3Bvc3RNZXNzYWdlKGUuZGF0YSl9JztcblxuICAgIHRyeSB7XG4gICAgICBibG9iID0gbmV3IEJsb2IoW3NjcmlwdFRleHRdLCB7dHlwZTondGV4dC9qYXZhc2NyaXB0J30pO1xuICAgIH0gY2F0Y2goZSkge1xuICAgICAgLy8gd2UnbGwgZmFsbCBiYWNrIHRvIHRoZSBkZXByZWNhdGVkIEJsb2JCdWlsZGVyXG4gICAgfVxuICAgIGlmICghYmxvYikge1xuICAgICAgYmIgPSBuZXcgQmxvYkJ1aWxkZXIoKTtcbiAgICAgIGJiLmFwcGVuZChzY3JpcHRUZXh0KTtcbiAgICAgIGJsb2IgPSBiYi5nZXRCbG9iKCk7XG4gICAgfVxuXG4gICAgdXJsID0gVVJMLmNyZWF0ZU9iamVjdFVSTChibG9iKTtcbiAgICB3b3JrZXIgPSBuZXcgV29ya2VyKHVybCk7XG5cbiAgICB3b3JrZXIub25tZXNzYWdlID0gZnVuY3Rpb24oZSkge1xuICAgICAgTW9kZXJuaXpyLmFkZFRlc3QoJ2Jsb2J3b3JrZXJzJywgZGF0YSA9PT0gZS5kYXRhKTtcbiAgICAgIGNsZWFudXAoKTtcbiAgICB9O1xuXG4gICAgLy8gSnVzdCBpbiBjYXNlLi4uXG4gICAgd29ya2VyLm9uZXJyb3IgPSBmYWlsO1xuICAgIHRpbWVvdXQgPSBzZXRUaW1lb3V0KGZhaWwsIDIwMCk7XG5cbiAgICB3b3JrZXIucG9zdE1lc3NhZ2UoZGF0YSk7XG4gIH0gY2F0Y2ggKGUpIHtcbiAgICBmYWlsKCk7XG4gIH1cblxuICBmdW5jdGlvbiBmYWlsKCkge1xuICAgIE1vZGVybml6ci5hZGRUZXN0KCdibG9id29ya2VycycsIGZhbHNlKTtcbiAgICBjbGVhbnVwKCk7XG4gIH1cblxuICBmdW5jdGlvbiBjbGVhbnVwKCkge1xuICAgIGlmICh1cmwpIHtcbiAgICAgIFVSTC5yZXZva2VPYmplY3RVUkwodXJsKTtcbiAgICB9XG4gICAgaWYgKHdvcmtlcikge1xuICAgICAgd29ya2VyLnRlcm1pbmF0ZSgpO1xuICAgIH1cbiAgICBpZiAodGltZW91dCkge1xuICAgICAgY2xlYXJUaW1lb3V0KHRpbWVvdXQpO1xuICAgIH1cbiAgfVxufSgpKTtcbiJdLCJmaWxlIjoibW9kZXJuaXpyL2ZlYXR1cmUtZGV0ZWN0cy93b3JrZXJzLWJsb2J3b3JrZXJzLmpzIiwic291cmNlUm9vdCI6Ii9zb3VyY2UvIn0=