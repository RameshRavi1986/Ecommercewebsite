
// Avoid `console` errors in browsers that lack a console
if (!(window.console && console.log)) {
    (function() {
        var noop = function() {};
        var methods = ['assert', 'clear', 'count', 'debug', 'dir', 'dirxml', 'error', 'exception', 'group', 'groupCollapsed', 'groupEnd', 'info', 'log', 'markTimeline', 'profile', 'profileEnd', 'markTimeline', 'table', 'time', 'timeEnd', 'timeStamp', 'trace', 'warn'];
        var length = methods.length;
        var console = window.console = {};
        while (length--) {
            console[methods[length]] = noop;
        }
    }());
}

// test helper object
window.TEST = {
  // note some unique members of the Modernizr object
  inputs    : ['input','inputtypes', 'textarea'],
  audvid    : ['video','audio'],
  API       : ['addTest', 'mq', 'hasEvent', 'testProp', 'testAllProps', 'testStyles', '_prefixes', '_domPrefixes', '_cssomPrefixes', 'prefixed'],
  extraclass: ['js'],
  privates  : ['_enableHTML5','_version','_fontfaceready'],
  deprecated : [
                { oldish : 'crosswindowmessaging', newish : 'postmessage'},
                { oldish : 'historymanagement', newish : 'history'},
              ],

  // utility methods
  inArray: function(elem, array) {
      if (array.indexOf) {
          return array.indexOf(elem);
      }
      for (var i = 0, length = array.length; i < length; i++) {
          if (array[i] === elem) {
              return i;
          }
      }
      return -1;
  },
  trim : function(str){
    return str.replace(/^\s*/, "").replace(/\s*$/, "");
  }
};


//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiIiwic291cmNlcyI6WyJtb2Rlcm5penIvdGVzdC9qcy9zZXR1cC5qcyJdLCJzb3VyY2VzQ29udGVudCI6WyJcbi8vIEF2b2lkIGBjb25zb2xlYCBlcnJvcnMgaW4gYnJvd3NlcnMgdGhhdCBsYWNrIGEgY29uc29sZVxuaWYgKCEod2luZG93LmNvbnNvbGUgJiYgY29uc29sZS5sb2cpKSB7XG4gICAgKGZ1bmN0aW9uKCkge1xuICAgICAgICB2YXIgbm9vcCA9IGZ1bmN0aW9uKCkge307XG4gICAgICAgIHZhciBtZXRob2RzID0gWydhc3NlcnQnLCAnY2xlYXInLCAnY291bnQnLCAnZGVidWcnLCAnZGlyJywgJ2RpcnhtbCcsICdlcnJvcicsICdleGNlcHRpb24nLCAnZ3JvdXAnLCAnZ3JvdXBDb2xsYXBzZWQnLCAnZ3JvdXBFbmQnLCAnaW5mbycsICdsb2cnLCAnbWFya1RpbWVsaW5lJywgJ3Byb2ZpbGUnLCAncHJvZmlsZUVuZCcsICdtYXJrVGltZWxpbmUnLCAndGFibGUnLCAndGltZScsICd0aW1lRW5kJywgJ3RpbWVTdGFtcCcsICd0cmFjZScsICd3YXJuJ107XG4gICAgICAgIHZhciBsZW5ndGggPSBtZXRob2RzLmxlbmd0aDtcbiAgICAgICAgdmFyIGNvbnNvbGUgPSB3aW5kb3cuY29uc29sZSA9IHt9O1xuICAgICAgICB3aGlsZSAobGVuZ3RoLS0pIHtcbiAgICAgICAgICAgIGNvbnNvbGVbbWV0aG9kc1tsZW5ndGhdXSA9IG5vb3A7XG4gICAgICAgIH1cbiAgICB9KCkpO1xufVxuXG4vLyB0ZXN0IGhlbHBlciBvYmplY3RcbndpbmRvdy5URVNUID0ge1xuICAvLyBub3RlIHNvbWUgdW5pcXVlIG1lbWJlcnMgb2YgdGhlIE1vZGVybml6ciBvYmplY3RcbiAgaW5wdXRzICAgIDogWydpbnB1dCcsJ2lucHV0dHlwZXMnLCAndGV4dGFyZWEnXSxcbiAgYXVkdmlkICAgIDogWyd2aWRlbycsJ2F1ZGlvJ10sXG4gIEFQSSAgICAgICA6IFsnYWRkVGVzdCcsICdtcScsICdoYXNFdmVudCcsICd0ZXN0UHJvcCcsICd0ZXN0QWxsUHJvcHMnLCAndGVzdFN0eWxlcycsICdfcHJlZml4ZXMnLCAnX2RvbVByZWZpeGVzJywgJ19jc3NvbVByZWZpeGVzJywgJ3ByZWZpeGVkJ10sXG4gIGV4dHJhY2xhc3M6IFsnanMnXSxcbiAgcHJpdmF0ZXMgIDogWydfZW5hYmxlSFRNTDUnLCdfdmVyc2lvbicsJ19mb250ZmFjZXJlYWR5J10sXG4gIGRlcHJlY2F0ZWQgOiBbXG4gICAgICAgICAgICAgICAgeyBvbGRpc2ggOiAnY3Jvc3N3aW5kb3dtZXNzYWdpbmcnLCBuZXdpc2ggOiAncG9zdG1lc3NhZ2UnfSxcbiAgICAgICAgICAgICAgICB7IG9sZGlzaCA6ICdoaXN0b3J5bWFuYWdlbWVudCcsIG5ld2lzaCA6ICdoaXN0b3J5J30sXG4gICAgICAgICAgICAgIF0sXG5cbiAgLy8gdXRpbGl0eSBtZXRob2RzXG4gIGluQXJyYXk6IGZ1bmN0aW9uKGVsZW0sIGFycmF5KSB7XG4gICAgICBpZiAoYXJyYXkuaW5kZXhPZikge1xuICAgICAgICAgIHJldHVybiBhcnJheS5pbmRleE9mKGVsZW0pO1xuICAgICAgfVxuICAgICAgZm9yICh2YXIgaSA9IDAsIGxlbmd0aCA9IGFycmF5Lmxlbmd0aDsgaSA8IGxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgaWYgKGFycmF5W2ldID09PSBlbGVtKSB7XG4gICAgICAgICAgICAgIHJldHVybiBpO1xuICAgICAgICAgIH1cbiAgICAgIH1cbiAgICAgIHJldHVybiAtMTtcbiAgfSxcbiAgdHJpbSA6IGZ1bmN0aW9uKHN0cil7XG4gICAgcmV0dXJuIHN0ci5yZXBsYWNlKC9eXFxzKi8sIFwiXCIpLnJlcGxhY2UoL1xccyokLywgXCJcIik7XG4gIH1cbn07XG5cbiJdLCJmaWxlIjoibW9kZXJuaXpyL3Rlc3QvanMvc2V0dXAuanMiLCJzb3VyY2VSb290IjoiL3NvdXJjZS8ifQ==