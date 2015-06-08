

var myscript = document.createElement('script'),
    ref = document.getElementsByTagName('script')[0];

myscript.src = 'http://caniuse.com/jsonp.php?callback=caniusecb';

setTimeout(function(){
  ref.parentNode.insertBefore(myscript, ref);
}, 100);

// mapping Modernizr terms over to caniuse terms
var map = {
  audio : 'audio',
  borderimage : 'border-image',
  borderradius : 'border-radius',
  canvas : 'canvas',
  canvastext : 'canvas-text',
  cssanimations : 'css-animation',
  boxshadow : 'css-boxshadow',
  cssgradients : 'css-gradients',
  opacity : 'css-opacity',
  cssreflections : 'css-reflections',
  textshadow : 'css-textshadow',
  csstransitions : 'css-transitions',
  hsla : 'css3-colors',
  rgba : 'css3-colors',
  draganddrop : 'dragndrop',
  flexbox : 'flexbox',
  fontface : 'fontface',
  geolocation : 'geolocation',
  hashchange : 'hashchange',
  history : 'history',
  indexeddb : 'indexeddb',
  multiplebgs : 'multibackgrounds',
  csscolumns : 'multicolumn',
  localstorage : 'namevalue-storage',
  applicationcache : 'offline-apps',
  websqldatabase : 'sql-storage',
  svg : 'svg',
  touch : 'touch',
  csstransforms : 'transforms2d',
  csstransforms3d : 'transforms3d',
  video: 'video',
  webgl: 'webgl',
  websockets : 'websockets',
  webworkers : 'webworkers',
  postmessage : 'x-doc-messaging'
};

window.caniusecb = function(scriptdata) {

  window.doo = scriptdata;

  // quit if JSONSelect didn't make it.
  if (!window.JSONSelect) return;

  var testdata     = scriptdata.data,

      // parse the current UA with uaparser
      ua           = uaparse(navigator.userAgent),

      // match the UA from uaparser into the browser used by caniuse
      browserKey   = JSONSelect.match('.agents .browser', scriptdata).indexOf(ua.family),
      currBrowser  = Object.keys(scriptdata.agents)[browserKey];

  // So Phantom doesn't kill the caniuse.com matching exit out as it's useless anyway within PhantomJS
  if(navigator.userAgent.indexOf("PhantomJS") != -1) {
    return;
  }

  // translate 'y' 'n' or 'a' into a boolean that Modernizr uses
  function bool(ciuresult){
    if (ciuresult == 'y' || ciuresult == 'a') return true;
    // 'p' is for polyfill
    if (ciuresult == 'n' || ciuresult == 'p') return false;
    throw 'unknown return value from can i use';
  }

  function testify(o){

    var ciubool = bool(o.ciuresult);

    // caniuse says audio/video are yes/no, Modernizr has more detail which we'll dumb down.
    if (~TEST.audvid.indexOf(o.feature))
      o.result = !!o.result;

    // if caniuse gave us a 'partial', lets let it pass with a note.
    if (o.ciuresult == 'a'){
      return ok(true,
        o.browser + o.version + ': Caniuse reported partial support for ' + o.ciufeature +
        '. So.. Modernizr\'s ' + o.result + ' is good enough...'
      );
    }


    // change the *documented* false positives
    if ((o.feature == 'textshadow' && o.browser == 'firefox' && o.version == 3)
        && ciubool == false
    ) {
      ciubool = o.fp = true;
    }

    // where we actually do most our assertions
    equal(o.result, ciubool,
      o.browser + o.version + ': Caniuse result for ' + o.ciufeature +
      ' matches Modernizr\'s ' + (o.fp ? '*false positive*' : 'result') + ' for ' + o.feature
    );
  }


  module('caniuse.com data matches', {
      setup:function() {
      },
      teardown:function() {
      }
  });


  test("we match caniuse data", function() {

    for (var feature in Modernizr){

      var ciufeatname = map[feature];

      if (ciufeatname === undefined) continue;

      var ciufeatdata = testdata[ciufeatname];

      if (ciufeatdata === undefined) throw 'unknown key of caniusedata';

      // get results for this feature for all versions of this browser
      var browserResults = ciufeatdata.stats[currBrowser];

      // let's get our versions in order..
      var minorver   = ua.minor &&                                  // caniuse doesn't use two digit minors
                       ua.minor.toString().replace(/(\d)\d$/,'$1'), // but opera does.

          majorminor = (ua.major + '.' + minorver)
                          // opera gets grouped in some cases by caniuse
                          .replace(/(9\.(6|5))/ , ua.family == 'opera' ? '9.5-9.6'   : "$1")
                          .replace(/(10\.(0|1))/, ua.family == 'opera' ? '10.0-10.1' : "$1"),

          mmResult   = browserResults[majorminor],
          mResult    = browserResults[ua.major];


      // check it against the major.minor: eg. FF 3.6
      if (mmResult && mmResult != 'u'){ // 'y' 'n' or 'a'

        // data ends w/ ` x` if its still prefixed in the imp
        mmResult = mmResult.replace(' x','');

        // match it against our data.
        testify({ feature     : feature
                , ciufeature  : ciufeatname
                , result      : Modernizr[feature]
                , ciuresult   : mmResult
                , browser     : currBrowser
                , version     : majorminor
        });

        continue; // don't check the major version
      }

      // check it against just the major version: eg. FF 3
      if (mResult){

        // unknown support from caniuse... He would probably like to know our data, though!
        if (mResult == 'u') continue;

        // data ends w/ ` x` if its still prefixed in the imp
        mResult = mResult.replace(' x','');

        testify({ feature     : feature
                , ciufeature  : ciufeatname
                , result      : Modernizr[feature]
                , ciuresult   : mResult
                , browser     : currBrowser
                , version     : ua.major
        });


      }

    } // for in loop

  }); // eo test()


}; // eo caniusecallback()

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiIiwic291cmNlcyI6WyJtb2Rlcm5penIvdGVzdC9qcy91bml0LWNhbml1c2UuanMiXSwic291cmNlc0NvbnRlbnQiOlsiXG5cbnZhciBteXNjcmlwdCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3NjcmlwdCcpLFxuICAgIHJlZiA9IGRvY3VtZW50LmdldEVsZW1lbnRzQnlUYWdOYW1lKCdzY3JpcHQnKVswXTtcblxubXlzY3JpcHQuc3JjID0gJ2h0dHA6Ly9jYW5pdXNlLmNvbS9qc29ucC5waHA/Y2FsbGJhY2s9Y2FuaXVzZWNiJztcblxuc2V0VGltZW91dChmdW5jdGlvbigpe1xuICByZWYucGFyZW50Tm9kZS5pbnNlcnRCZWZvcmUobXlzY3JpcHQsIHJlZik7XG59LCAxMDApO1xuXG4vLyBtYXBwaW5nIE1vZGVybml6ciB0ZXJtcyBvdmVyIHRvIGNhbml1c2UgdGVybXNcbnZhciBtYXAgPSB7XG4gIGF1ZGlvIDogJ2F1ZGlvJyxcbiAgYm9yZGVyaW1hZ2UgOiAnYm9yZGVyLWltYWdlJyxcbiAgYm9yZGVycmFkaXVzIDogJ2JvcmRlci1yYWRpdXMnLFxuICBjYW52YXMgOiAnY2FudmFzJyxcbiAgY2FudmFzdGV4dCA6ICdjYW52YXMtdGV4dCcsXG4gIGNzc2FuaW1hdGlvbnMgOiAnY3NzLWFuaW1hdGlvbicsXG4gIGJveHNoYWRvdyA6ICdjc3MtYm94c2hhZG93JyxcbiAgY3NzZ3JhZGllbnRzIDogJ2Nzcy1ncmFkaWVudHMnLFxuICBvcGFjaXR5IDogJ2Nzcy1vcGFjaXR5JyxcbiAgY3NzcmVmbGVjdGlvbnMgOiAnY3NzLXJlZmxlY3Rpb25zJyxcbiAgdGV4dHNoYWRvdyA6ICdjc3MtdGV4dHNoYWRvdycsXG4gIGNzc3RyYW5zaXRpb25zIDogJ2Nzcy10cmFuc2l0aW9ucycsXG4gIGhzbGEgOiAnY3NzMy1jb2xvcnMnLFxuICByZ2JhIDogJ2NzczMtY29sb3JzJyxcbiAgZHJhZ2FuZGRyb3AgOiAnZHJhZ25kcm9wJyxcbiAgZmxleGJveCA6ICdmbGV4Ym94JyxcbiAgZm9udGZhY2UgOiAnZm9udGZhY2UnLFxuICBnZW9sb2NhdGlvbiA6ICdnZW9sb2NhdGlvbicsXG4gIGhhc2hjaGFuZ2UgOiAnaGFzaGNoYW5nZScsXG4gIGhpc3RvcnkgOiAnaGlzdG9yeScsXG4gIGluZGV4ZWRkYiA6ICdpbmRleGVkZGInLFxuICBtdWx0aXBsZWJncyA6ICdtdWx0aWJhY2tncm91bmRzJyxcbiAgY3NzY29sdW1ucyA6ICdtdWx0aWNvbHVtbicsXG4gIGxvY2Fsc3RvcmFnZSA6ICduYW1ldmFsdWUtc3RvcmFnZScsXG4gIGFwcGxpY2F0aW9uY2FjaGUgOiAnb2ZmbGluZS1hcHBzJyxcbiAgd2Vic3FsZGF0YWJhc2UgOiAnc3FsLXN0b3JhZ2UnLFxuICBzdmcgOiAnc3ZnJyxcbiAgdG91Y2ggOiAndG91Y2gnLFxuICBjc3N0cmFuc2Zvcm1zIDogJ3RyYW5zZm9ybXMyZCcsXG4gIGNzc3RyYW5zZm9ybXMzZCA6ICd0cmFuc2Zvcm1zM2QnLFxuICB2aWRlbzogJ3ZpZGVvJyxcbiAgd2ViZ2w6ICd3ZWJnbCcsXG4gIHdlYnNvY2tldHMgOiAnd2Vic29ja2V0cycsXG4gIHdlYndvcmtlcnMgOiAnd2Vid29ya2VycycsXG4gIHBvc3RtZXNzYWdlIDogJ3gtZG9jLW1lc3NhZ2luZydcbn07XG5cbndpbmRvdy5jYW5pdXNlY2IgPSBmdW5jdGlvbihzY3JpcHRkYXRhKSB7XG5cbiAgd2luZG93LmRvbyA9IHNjcmlwdGRhdGE7XG5cbiAgLy8gcXVpdCBpZiBKU09OU2VsZWN0IGRpZG4ndCBtYWtlIGl0LlxuICBpZiAoIXdpbmRvdy5KU09OU2VsZWN0KSByZXR1cm47XG5cbiAgdmFyIHRlc3RkYXRhICAgICA9IHNjcmlwdGRhdGEuZGF0YSxcblxuICAgICAgLy8gcGFyc2UgdGhlIGN1cnJlbnQgVUEgd2l0aCB1YXBhcnNlclxuICAgICAgdWEgICAgICAgICAgID0gdWFwYXJzZShuYXZpZ2F0b3IudXNlckFnZW50KSxcblxuICAgICAgLy8gbWF0Y2ggdGhlIFVBIGZyb20gdWFwYXJzZXIgaW50byB0aGUgYnJvd3NlciB1c2VkIGJ5IGNhbml1c2VcbiAgICAgIGJyb3dzZXJLZXkgICA9IEpTT05TZWxlY3QubWF0Y2goJy5hZ2VudHMgLmJyb3dzZXInLCBzY3JpcHRkYXRhKS5pbmRleE9mKHVhLmZhbWlseSksXG4gICAgICBjdXJyQnJvd3NlciAgPSBPYmplY3Qua2V5cyhzY3JpcHRkYXRhLmFnZW50cylbYnJvd3NlcktleV07XG5cbiAgLy8gU28gUGhhbnRvbSBkb2Vzbid0IGtpbGwgdGhlIGNhbml1c2UuY29tIG1hdGNoaW5nIGV4aXQgb3V0IGFzIGl0J3MgdXNlbGVzcyBhbnl3YXkgd2l0aGluIFBoYW50b21KU1xuICBpZihuYXZpZ2F0b3IudXNlckFnZW50LmluZGV4T2YoXCJQaGFudG9tSlNcIikgIT0gLTEpIHtcbiAgICByZXR1cm47XG4gIH1cblxuICAvLyB0cmFuc2xhdGUgJ3knICduJyBvciAnYScgaW50byBhIGJvb2xlYW4gdGhhdCBNb2Rlcm5penIgdXNlc1xuICBmdW5jdGlvbiBib29sKGNpdXJlc3VsdCl7XG4gICAgaWYgKGNpdXJlc3VsdCA9PSAneScgfHwgY2l1cmVzdWx0ID09ICdhJykgcmV0dXJuIHRydWU7XG4gICAgLy8gJ3AnIGlzIGZvciBwb2x5ZmlsbFxuICAgIGlmIChjaXVyZXN1bHQgPT0gJ24nIHx8IGNpdXJlc3VsdCA9PSAncCcpIHJldHVybiBmYWxzZTtcbiAgICB0aHJvdyAndW5rbm93biByZXR1cm4gdmFsdWUgZnJvbSBjYW4gaSB1c2UnO1xuICB9XG5cbiAgZnVuY3Rpb24gdGVzdGlmeShvKXtcblxuICAgIHZhciBjaXVib29sID0gYm9vbChvLmNpdXJlc3VsdCk7XG5cbiAgICAvLyBjYW5pdXNlIHNheXMgYXVkaW8vdmlkZW8gYXJlIHllcy9ubywgTW9kZXJuaXpyIGhhcyBtb3JlIGRldGFpbCB3aGljaCB3ZSdsbCBkdW1iIGRvd24uXG4gICAgaWYgKH5URVNULmF1ZHZpZC5pbmRleE9mKG8uZmVhdHVyZSkpXG4gICAgICBvLnJlc3VsdCA9ICEhby5yZXN1bHQ7XG5cbiAgICAvLyBpZiBjYW5pdXNlIGdhdmUgdXMgYSAncGFydGlhbCcsIGxldHMgbGV0IGl0IHBhc3Mgd2l0aCBhIG5vdGUuXG4gICAgaWYgKG8uY2l1cmVzdWx0ID09ICdhJyl7XG4gICAgICByZXR1cm4gb2sodHJ1ZSxcbiAgICAgICAgby5icm93c2VyICsgby52ZXJzaW9uICsgJzogQ2FuaXVzZSByZXBvcnRlZCBwYXJ0aWFsIHN1cHBvcnQgZm9yICcgKyBvLmNpdWZlYXR1cmUgK1xuICAgICAgICAnLiBTby4uIE1vZGVybml6clxcJ3MgJyArIG8ucmVzdWx0ICsgJyBpcyBnb29kIGVub3VnaC4uLidcbiAgICAgICk7XG4gICAgfVxuXG5cbiAgICAvLyBjaGFuZ2UgdGhlICpkb2N1bWVudGVkKiBmYWxzZSBwb3NpdGl2ZXNcbiAgICBpZiAoKG8uZmVhdHVyZSA9PSAndGV4dHNoYWRvdycgJiYgby5icm93c2VyID09ICdmaXJlZm94JyAmJiBvLnZlcnNpb24gPT0gMylcbiAgICAgICAgJiYgY2l1Ym9vbCA9PSBmYWxzZVxuICAgICkge1xuICAgICAgY2l1Ym9vbCA9IG8uZnAgPSB0cnVlO1xuICAgIH1cblxuICAgIC8vIHdoZXJlIHdlIGFjdHVhbGx5IGRvIG1vc3Qgb3VyIGFzc2VydGlvbnNcbiAgICBlcXVhbChvLnJlc3VsdCwgY2l1Ym9vbCxcbiAgICAgIG8uYnJvd3NlciArIG8udmVyc2lvbiArICc6IENhbml1c2UgcmVzdWx0IGZvciAnICsgby5jaXVmZWF0dXJlICtcbiAgICAgICcgbWF0Y2hlcyBNb2Rlcm5penJcXCdzICcgKyAoby5mcCA/ICcqZmFsc2UgcG9zaXRpdmUqJyA6ICdyZXN1bHQnKSArICcgZm9yICcgKyBvLmZlYXR1cmVcbiAgICApO1xuICB9XG5cblxuICBtb2R1bGUoJ2Nhbml1c2UuY29tIGRhdGEgbWF0Y2hlcycsIHtcbiAgICAgIHNldHVwOmZ1bmN0aW9uKCkge1xuICAgICAgfSxcbiAgICAgIHRlYXJkb3duOmZ1bmN0aW9uKCkge1xuICAgICAgfVxuICB9KTtcblxuXG4gIHRlc3QoXCJ3ZSBtYXRjaCBjYW5pdXNlIGRhdGFcIiwgZnVuY3Rpb24oKSB7XG5cbiAgICBmb3IgKHZhciBmZWF0dXJlIGluIE1vZGVybml6cil7XG5cbiAgICAgIHZhciBjaXVmZWF0bmFtZSA9IG1hcFtmZWF0dXJlXTtcblxuICAgICAgaWYgKGNpdWZlYXRuYW1lID09PSB1bmRlZmluZWQpIGNvbnRpbnVlO1xuXG4gICAgICB2YXIgY2l1ZmVhdGRhdGEgPSB0ZXN0ZGF0YVtjaXVmZWF0bmFtZV07XG5cbiAgICAgIGlmIChjaXVmZWF0ZGF0YSA9PT0gdW5kZWZpbmVkKSB0aHJvdyAndW5rbm93biBrZXkgb2YgY2FuaXVzZWRhdGEnO1xuXG4gICAgICAvLyBnZXQgcmVzdWx0cyBmb3IgdGhpcyBmZWF0dXJlIGZvciBhbGwgdmVyc2lvbnMgb2YgdGhpcyBicm93c2VyXG4gICAgICB2YXIgYnJvd3NlclJlc3VsdHMgPSBjaXVmZWF0ZGF0YS5zdGF0c1tjdXJyQnJvd3Nlcl07XG5cbiAgICAgIC8vIGxldCdzIGdldCBvdXIgdmVyc2lvbnMgaW4gb3JkZXIuLlxuICAgICAgdmFyIG1pbm9ydmVyICAgPSB1YS5taW5vciAmJiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBjYW5pdXNlIGRvZXNuJ3QgdXNlIHR3byBkaWdpdCBtaW5vcnNcbiAgICAgICAgICAgICAgICAgICAgICAgdWEubWlub3IudG9TdHJpbmcoKS5yZXBsYWNlKC8oXFxkKVxcZCQvLCckMScpLCAvLyBidXQgb3BlcmEgZG9lcy5cblxuICAgICAgICAgIG1ham9ybWlub3IgPSAodWEubWFqb3IgKyAnLicgKyBtaW5vcnZlcilcbiAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gb3BlcmEgZ2V0cyBncm91cGVkIGluIHNvbWUgY2FzZXMgYnkgY2FuaXVzZVxuICAgICAgICAgICAgICAgICAgICAgICAgICAucmVwbGFjZSgvKDlcXC4oNnw1KSkvICwgdWEuZmFtaWx5ID09ICdvcGVyYScgPyAnOS41LTkuNicgICA6IFwiJDFcIilcbiAgICAgICAgICAgICAgICAgICAgICAgICAgLnJlcGxhY2UoLygxMFxcLigwfDEpKS8sIHVhLmZhbWlseSA9PSAnb3BlcmEnID8gJzEwLjAtMTAuMScgOiBcIiQxXCIpLFxuXG4gICAgICAgICAgbW1SZXN1bHQgICA9IGJyb3dzZXJSZXN1bHRzW21ham9ybWlub3JdLFxuICAgICAgICAgIG1SZXN1bHQgICAgPSBicm93c2VyUmVzdWx0c1t1YS5tYWpvcl07XG5cblxuICAgICAgLy8gY2hlY2sgaXQgYWdhaW5zdCB0aGUgbWFqb3IubWlub3I6IGVnLiBGRiAzLjZcbiAgICAgIGlmIChtbVJlc3VsdCAmJiBtbVJlc3VsdCAhPSAndScpeyAvLyAneScgJ24nIG9yICdhJ1xuXG4gICAgICAgIC8vIGRhdGEgZW5kcyB3LyBgIHhgIGlmIGl0cyBzdGlsbCBwcmVmaXhlZCBpbiB0aGUgaW1wXG4gICAgICAgIG1tUmVzdWx0ID0gbW1SZXN1bHQucmVwbGFjZSgnIHgnLCcnKTtcblxuICAgICAgICAvLyBtYXRjaCBpdCBhZ2FpbnN0IG91ciBkYXRhLlxuICAgICAgICB0ZXN0aWZ5KHsgZmVhdHVyZSAgICAgOiBmZWF0dXJlXG4gICAgICAgICAgICAgICAgLCBjaXVmZWF0dXJlICA6IGNpdWZlYXRuYW1lXG4gICAgICAgICAgICAgICAgLCByZXN1bHQgICAgICA6IE1vZGVybml6cltmZWF0dXJlXVxuICAgICAgICAgICAgICAgICwgY2l1cmVzdWx0ICAgOiBtbVJlc3VsdFxuICAgICAgICAgICAgICAgICwgYnJvd3NlciAgICAgOiBjdXJyQnJvd3NlclxuICAgICAgICAgICAgICAgICwgdmVyc2lvbiAgICAgOiBtYWpvcm1pbm9yXG4gICAgICAgIH0pO1xuXG4gICAgICAgIGNvbnRpbnVlOyAvLyBkb24ndCBjaGVjayB0aGUgbWFqb3IgdmVyc2lvblxuICAgICAgfVxuXG4gICAgICAvLyBjaGVjayBpdCBhZ2FpbnN0IGp1c3QgdGhlIG1ham9yIHZlcnNpb246IGVnLiBGRiAzXG4gICAgICBpZiAobVJlc3VsdCl7XG5cbiAgICAgICAgLy8gdW5rbm93biBzdXBwb3J0IGZyb20gY2FuaXVzZS4uLiBIZSB3b3VsZCBwcm9iYWJseSBsaWtlIHRvIGtub3cgb3VyIGRhdGEsIHRob3VnaCFcbiAgICAgICAgaWYgKG1SZXN1bHQgPT0gJ3UnKSBjb250aW51ZTtcblxuICAgICAgICAvLyBkYXRhIGVuZHMgdy8gYCB4YCBpZiBpdHMgc3RpbGwgcHJlZml4ZWQgaW4gdGhlIGltcFxuICAgICAgICBtUmVzdWx0ID0gbVJlc3VsdC5yZXBsYWNlKCcgeCcsJycpO1xuXG4gICAgICAgIHRlc3RpZnkoeyBmZWF0dXJlICAgICA6IGZlYXR1cmVcbiAgICAgICAgICAgICAgICAsIGNpdWZlYXR1cmUgIDogY2l1ZmVhdG5hbWVcbiAgICAgICAgICAgICAgICAsIHJlc3VsdCAgICAgIDogTW9kZXJuaXpyW2ZlYXR1cmVdXG4gICAgICAgICAgICAgICAgLCBjaXVyZXN1bHQgICA6IG1SZXN1bHRcbiAgICAgICAgICAgICAgICAsIGJyb3dzZXIgICAgIDogY3VyckJyb3dzZXJcbiAgICAgICAgICAgICAgICAsIHZlcnNpb24gICAgIDogdWEubWFqb3JcbiAgICAgICAgfSk7XG5cblxuICAgICAgfVxuXG4gICAgfSAvLyBmb3IgaW4gbG9vcFxuXG4gIH0pOyAvLyBlbyB0ZXN0KClcblxuXG59OyAvLyBlbyBjYW5pdXNlY2FsbGJhY2soKVxuIl0sImZpbGUiOiJtb2Rlcm5penIvdGVzdC9qcy91bml0LWNhbml1c2UuanMiLCJzb3VyY2VSb290IjoiL3NvdXJjZS8ifQ==