function dumpModernizr(){
  var str = '';
  dumpModernizr.old = dumpModernizr.old || {};

    for (var prop in Modernizr) {

      // skip previously done ones.
      if (dumpModernizr.old[prop]) continue;
      else dumpModernizr.old[prop] = true;

      if (typeof Modernizr[prop] === 'function') continue;
      // skip unit test items
      if (/^test/.test(prop)) continue;

      if (~TEST.inputs.indexOf(prop)) {
        str += '<li><b>'+prop+'{}</b><ul>';
        for (var field in Modernizr[prop]) {
          str += '<li class="' + (Modernizr[prop][field] ? 'yes' : '') + '">' + field + ': ' + Modernizr[prop][field] + '</li>';
        }
        str += '</ul></li>';
      } else {
        str += '<li  id="'+prop+'" class="' + (Modernizr[prop] ? 'yes' : '') + '">' + prop + ': ' + Modernizr[prop] + '</li>';
      }
  }
  return str;
}


function grabFeatDetects(){
  // thx github.js
  $.getScript('https://api.github.com/repos/Modernizr/Modernizr/git/trees/master?recursive=1&callback=processTree');
}


function processTree(data){
  var filenames = [];

  for (var i = 0; i < data.data.tree.length; i++){
    var file = data.data.tree[i];
    var match = file.path.match(/^feature-detects\/(.*)/);
    if (!match) continue;

    var relpath = location.host == "modernizr.github.com" ?
                    '../modernizr-git/' : '../';

    filenames.push(relpath + match[0]);
  }

  var jqxhrs = filenames.map(function(filename){
    return jQuery.getScript(filename);
  });

  jQuery.when.apply(jQuery, jqxhrs).done(resultsToDOM);

}

function resultsToDOM(){

  var modOutput = document.createElement('div'),
      ref = document.getElementById('qunit-testresult') || document.getElementById('qunit-tests');

  modOutput.className = 'output';
  modOutput.innerHTML = dumpModernizr();

  ref.parentNode.insertBefore(modOutput, ref);

  // Modernizr object as text
  document.getElementsByTagName('textarea')[0].innerHTML = JSON.stringify(Modernizr);

}

/* uno    */ resultsToDOM();
/* dos    */ grabFeatDetects();
/* tres   */ setTimeout(resultsToDOM,  5e3);
/* quatro */ setTimeout(resultsToDOM, 15e3);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiIiwic291cmNlcyI6WyJtb2Rlcm5penIvdGVzdC9qcy9kdW1wZGF0YS5qcyJdLCJzb3VyY2VzQ29udGVudCI6WyJmdW5jdGlvbiBkdW1wTW9kZXJuaXpyKCl7XG4gIHZhciBzdHIgPSAnJztcbiAgZHVtcE1vZGVybml6ci5vbGQgPSBkdW1wTW9kZXJuaXpyLm9sZCB8fCB7fTtcblxuICAgIGZvciAodmFyIHByb3AgaW4gTW9kZXJuaXpyKSB7XG5cbiAgICAgIC8vIHNraXAgcHJldmlvdXNseSBkb25lIG9uZXMuXG4gICAgICBpZiAoZHVtcE1vZGVybml6ci5vbGRbcHJvcF0pIGNvbnRpbnVlO1xuICAgICAgZWxzZSBkdW1wTW9kZXJuaXpyLm9sZFtwcm9wXSA9IHRydWU7XG5cbiAgICAgIGlmICh0eXBlb2YgTW9kZXJuaXpyW3Byb3BdID09PSAnZnVuY3Rpb24nKSBjb250aW51ZTtcbiAgICAgIC8vIHNraXAgdW5pdCB0ZXN0IGl0ZW1zXG4gICAgICBpZiAoL150ZXN0Ly50ZXN0KHByb3ApKSBjb250aW51ZTtcblxuICAgICAgaWYgKH5URVNULmlucHV0cy5pbmRleE9mKHByb3ApKSB7XG4gICAgICAgIHN0ciArPSAnPGxpPjxiPicrcHJvcCsne308L2I+PHVsPic7XG4gICAgICAgIGZvciAodmFyIGZpZWxkIGluIE1vZGVybml6cltwcm9wXSkge1xuICAgICAgICAgIHN0ciArPSAnPGxpIGNsYXNzPVwiJyArIChNb2Rlcm5penJbcHJvcF1bZmllbGRdID8gJ3llcycgOiAnJykgKyAnXCI+JyArIGZpZWxkICsgJzogJyArIE1vZGVybml6cltwcm9wXVtmaWVsZF0gKyAnPC9saT4nO1xuICAgICAgICB9XG4gICAgICAgIHN0ciArPSAnPC91bD48L2xpPic7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBzdHIgKz0gJzxsaSAgaWQ9XCInK3Byb3ArJ1wiIGNsYXNzPVwiJyArIChNb2Rlcm5penJbcHJvcF0gPyAneWVzJyA6ICcnKSArICdcIj4nICsgcHJvcCArICc6ICcgKyBNb2Rlcm5penJbcHJvcF0gKyAnPC9saT4nO1xuICAgICAgfVxuICB9XG4gIHJldHVybiBzdHI7XG59XG5cblxuZnVuY3Rpb24gZ3JhYkZlYXREZXRlY3RzKCl7XG4gIC8vIHRoeCBnaXRodWIuanNcbiAgJC5nZXRTY3JpcHQoJ2h0dHBzOi8vYXBpLmdpdGh1Yi5jb20vcmVwb3MvTW9kZXJuaXpyL01vZGVybml6ci9naXQvdHJlZXMvbWFzdGVyP3JlY3Vyc2l2ZT0xJmNhbGxiYWNrPXByb2Nlc3NUcmVlJyk7XG59XG5cblxuZnVuY3Rpb24gcHJvY2Vzc1RyZWUoZGF0YSl7XG4gIHZhciBmaWxlbmFtZXMgPSBbXTtcblxuICBmb3IgKHZhciBpID0gMDsgaSA8IGRhdGEuZGF0YS50cmVlLmxlbmd0aDsgaSsrKXtcbiAgICB2YXIgZmlsZSA9IGRhdGEuZGF0YS50cmVlW2ldO1xuICAgIHZhciBtYXRjaCA9IGZpbGUucGF0aC5tYXRjaCgvXmZlYXR1cmUtZGV0ZWN0c1xcLyguKikvKTtcbiAgICBpZiAoIW1hdGNoKSBjb250aW51ZTtcblxuICAgIHZhciByZWxwYXRoID0gbG9jYXRpb24uaG9zdCA9PSBcIm1vZGVybml6ci5naXRodWIuY29tXCIgP1xuICAgICAgICAgICAgICAgICAgICAnLi4vbW9kZXJuaXpyLWdpdC8nIDogJy4uLyc7XG5cbiAgICBmaWxlbmFtZXMucHVzaChyZWxwYXRoICsgbWF0Y2hbMF0pO1xuICB9XG5cbiAgdmFyIGpxeGhycyA9IGZpbGVuYW1lcy5tYXAoZnVuY3Rpb24oZmlsZW5hbWUpe1xuICAgIHJldHVybiBqUXVlcnkuZ2V0U2NyaXB0KGZpbGVuYW1lKTtcbiAgfSk7XG5cbiAgalF1ZXJ5LndoZW4uYXBwbHkoalF1ZXJ5LCBqcXhocnMpLmRvbmUocmVzdWx0c1RvRE9NKTtcblxufVxuXG5mdW5jdGlvbiByZXN1bHRzVG9ET00oKXtcblxuICB2YXIgbW9kT3V0cHV0ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2JyksXG4gICAgICByZWYgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgncXVuaXQtdGVzdHJlc3VsdCcpIHx8IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdxdW5pdC10ZXN0cycpO1xuXG4gIG1vZE91dHB1dC5jbGFzc05hbWUgPSAnb3V0cHV0JztcbiAgbW9kT3V0cHV0LmlubmVySFRNTCA9IGR1bXBNb2Rlcm5penIoKTtcblxuICByZWYucGFyZW50Tm9kZS5pbnNlcnRCZWZvcmUobW9kT3V0cHV0LCByZWYpO1xuXG4gIC8vIE1vZGVybml6ciBvYmplY3QgYXMgdGV4dFxuICBkb2N1bWVudC5nZXRFbGVtZW50c0J5VGFnTmFtZSgndGV4dGFyZWEnKVswXS5pbm5lckhUTUwgPSBKU09OLnN0cmluZ2lmeShNb2Rlcm5penIpO1xuXG59XG5cbi8qIHVubyAgICAqLyByZXN1bHRzVG9ET00oKTtcbi8qIGRvcyAgICAqLyBncmFiRmVhdERldGVjdHMoKTtcbi8qIHRyZXMgICAqLyBzZXRUaW1lb3V0KHJlc3VsdHNUb0RPTSwgIDVlMyk7XG4vKiBxdWF0cm8gKi8gc2V0VGltZW91dChyZXN1bHRzVG9ET00sIDE1ZTMpO1xuIl0sImZpbGUiOiJtb2Rlcm5penIvdGVzdC9qcy9kdW1wZGF0YS5qcyIsInNvdXJjZVJvb3QiOiIvc291cmNlLyJ9