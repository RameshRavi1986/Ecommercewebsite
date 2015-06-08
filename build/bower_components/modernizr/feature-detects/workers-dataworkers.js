// by jussi-kalliokoski


// This test is asynchronous. Watch out.

// The test will potentially add garbage to console.

(function(){
  try {
    var data    = 'Modernizr',
        worker  = new Worker('data:text/javascript;base64,dGhpcy5vbm1lc3NhZ2U9ZnVuY3Rpb24oZSl7cG9zdE1lc3NhZ2UoZS5kYXRhKX0=');

    worker.onmessage = function(e) {
      worker.terminate();
      Modernizr.addTest('dataworkers', data === e.data);
      worker = null;
    };

    // Just in case...
    worker.onerror = function() {
      Modernizr.addTest('dataworkers', false);
      worker = null;
    };

    setTimeout(function() {
        Modernizr.addTest('dataworkers', false);
    }, 200);

    worker.postMessage(data);

  } catch (e) {
    Modernizr.addTest('dataworkers', false);
  }
}());

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiIiwic291cmNlcyI6WyJtb2Rlcm5penIvZmVhdHVyZS1kZXRlY3RzL3dvcmtlcnMtZGF0YXdvcmtlcnMuanMiXSwic291cmNlc0NvbnRlbnQiOlsiLy8gYnkganVzc2kta2FsbGlva29za2lcblxuXG4vLyBUaGlzIHRlc3QgaXMgYXN5bmNocm9ub3VzLiBXYXRjaCBvdXQuXG5cbi8vIFRoZSB0ZXN0IHdpbGwgcG90ZW50aWFsbHkgYWRkIGdhcmJhZ2UgdG8gY29uc29sZS5cblxuKGZ1bmN0aW9uKCl7XG4gIHRyeSB7XG4gICAgdmFyIGRhdGEgICAgPSAnTW9kZXJuaXpyJyxcbiAgICAgICAgd29ya2VyICA9IG5ldyBXb3JrZXIoJ2RhdGE6dGV4dC9qYXZhc2NyaXB0O2Jhc2U2NCxkR2hwY3k1dmJtMWxjM05oWjJVOVpuVnVZM1JwYjI0b1pTbDdjRzl6ZEUxbGMzTmhaMlVvWlM1a1lYUmhLWDA9Jyk7XG5cbiAgICB3b3JrZXIub25tZXNzYWdlID0gZnVuY3Rpb24oZSkge1xuICAgICAgd29ya2VyLnRlcm1pbmF0ZSgpO1xuICAgICAgTW9kZXJuaXpyLmFkZFRlc3QoJ2RhdGF3b3JrZXJzJywgZGF0YSA9PT0gZS5kYXRhKTtcbiAgICAgIHdvcmtlciA9IG51bGw7XG4gICAgfTtcblxuICAgIC8vIEp1c3QgaW4gY2FzZS4uLlxuICAgIHdvcmtlci5vbmVycm9yID0gZnVuY3Rpb24oKSB7XG4gICAgICBNb2Rlcm5penIuYWRkVGVzdCgnZGF0YXdvcmtlcnMnLCBmYWxzZSk7XG4gICAgICB3b3JrZXIgPSBudWxsO1xuICAgIH07XG5cbiAgICBzZXRUaW1lb3V0KGZ1bmN0aW9uKCkge1xuICAgICAgICBNb2Rlcm5penIuYWRkVGVzdCgnZGF0YXdvcmtlcnMnLCBmYWxzZSk7XG4gICAgfSwgMjAwKTtcblxuICAgIHdvcmtlci5wb3N0TWVzc2FnZShkYXRhKTtcblxuICB9IGNhdGNoIChlKSB7XG4gICAgTW9kZXJuaXpyLmFkZFRlc3QoJ2RhdGF3b3JrZXJzJywgZmFsc2UpO1xuICB9XG59KCkpO1xuIl0sImZpbGUiOiJtb2Rlcm5penIvZmVhdHVyZS1kZXRlY3RzL3dvcmtlcnMtZGF0YXdvcmtlcnMuanMiLCJzb3VyY2VSb290IjoiL3NvdXJjZS8ifQ==