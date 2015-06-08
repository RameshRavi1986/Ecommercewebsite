// https://github.com/kangax/detect-global

// tweaked to run without a UI.

(function () {
    function getPropertyDescriptors(object) {
      var props = { };
      for (var prop in object) {
        
        // nerfing for firefox who goes crazy over some objects like sessionStorage
        try {
          
          props[prop] = {
            type:  typeof object[prop],
            value: object[prop]
          };
          
        } catch(e){
          props[prop] = {}; 
        }
      }
      return props;
    }
    
    function getCleanWindow() {
      var elIframe = document.createElement('iframe');
      elIframe.style.display = 'none';
      
      var ref = document.getElementsByTagName('script')[0];
      ref.parentNode.insertBefore(elIframe, ref);
      
      elIframe.src = 'about:blank';
      return elIframe.contentWindow;
    }
    
    function appendControl(el, name) {
      var elCheckbox = document.createElement('input');
      elCheckbox.type = 'checkbox';
      elCheckbox.checked = true;
      elCheckbox.id = '__' + name;
      
      var elLabel = document.createElement('label');
      elLabel.htmlFor = '__' + name;
      elLabel.innerHTML = 'Exclude ' + name + ' properties?';
      elLabel.style.marginLeft = '0.5em';
      
      var elWrapper = document.createElement('p');
      elWrapper.style.marginBottom = '0.5em';
      
      elWrapper.appendChild(elCheckbox);
      elWrapper.appendChild(elLabel);

      el.appendChild(elWrapper);
    }
    
    function appendAnalyze(el) {
      var elAnalyze = document.createElement('button');
      elAnalyze.id = '__analyze';
      elAnalyze.innerHTML = 'Analyze';
      elAnalyze.style.marginTop = '1em';
      el.appendChild(elAnalyze);
    }
    
    function appendCancel(el) {
      var elCancel = document.createElement('a');
      elCancel.href = '#';
      elCancel.innerHTML = 'Cancel';
      elCancel.style.cssText = 'color:#eee;margin-left:0.5em;';
      elCancel.onclick = function() {
        el.parentNode.removeChild(el);
        return false; 
      };
      el.appendChild(elCancel);
    }
    
    function initConfigPopup() {
      var el = document.createElement('div');
      
      el.style.cssText =  'position:fixed; left:10px; top:10px; width:300px; background:rgba(50,50,50,0.9);' +
                          '-moz-border-radius:10px; padding:1em; color: #eee; text-align: left;' +
                          'font-family: "Helvetica Neue", Verdana, Arial, sans serif; z-index: 99999;';
      
      for (var prop in propSets) {
        appendControl(el, prop);
      }
      
      appendAnalyze(el);
      appendCancel(el);
      
      var ref = document.getElementsByTagName('script')[0];
      ref.parentNode.insertBefore(el, ref);
    }
    
    function getPropsCount(object) {
      var count = 0;
      for (var prop in object) {
        count++;
      }
      return count;
    }
    
    function shouldDeleteProperty(propToCheck) {
      for (var prop in propSets) {
        var elCheckbox = document.getElementById('__' + prop);
        var isPropInSet = propSets[prop].indexOf(propToCheck) > -1;
        if (isPropInSet && (elCheckbox ? elCheckbox.checked : true) ) {
          return true;
        }
      }
    }
    
    function analyze() {
      var global = (function(){ return this; })(),
          globalProps = getPropertyDescriptors(global),
          cleanWindow = getCleanWindow();
          
      for (var prop in cleanWindow) {
        if (globalProps[prop]) {
          delete globalProps[prop];
        }
      }
      for (var prop in globalProps) {
        if (shouldDeleteProperty(prop)) {
          delete globalProps[prop];
        }
      }
      
      window.__globalsCount = getPropsCount(globalProps);
      window.__globals      = globalProps;
      
      window.console && console.log('Total number of global properties: ' + __globalsCount);
      window.console && console.dir(__globals);
    }
    
    var propSets = {
      'Prototype':        '$$ $A $F $H $R $break $continue $w Abstract Ajax Class Enumerable Element Field Form ' +
                          'Hash Insertion ObjectRange PeriodicalExecuter Position Prototype Selector Template Toggle Try'.split(' '),
                        
      'Scriptaculous':    'Autocompleter Builder Control Draggable Draggables Droppables Effect Sortable SortableObserver Sound Scriptaculous'.split(' '),
      'Firebug':          'loadFirebugConsole console _getFirebugConsoleElement _FirebugConsole _FirebugCommandLine _firebug'.split(' '),
      'Mozilla':          'Components XPCNativeWrapper XPCSafeJSObjectWrapper getInterface netscape GetWeakReference GeckoActiveXObject'.split(' '),
      'GoogleAnalytics':  'gaJsHost gaGlobal _gat _gaq pageTracker'.split(' '),
      'lazyGlobals':      'onhashchange'.split(' ')
    };
    
    // initConfigPopup(); // disable because we're going UI-less.
    
    var analyzeElem = document.getElementById('__analyze');
    analyzeElem && (analyzeElem.onclick = analyze);
    
    analyze(); // and assign total added globals to window.__globalsCount
    
})();
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiIiwic291cmNlcyI6WyJtb2Rlcm5penIvdGVzdC9qcy9saWIvZGV0ZWN0LWdsb2JhbC5qcyJdLCJzb3VyY2VzQ29udGVudCI6WyIvLyBodHRwczovL2dpdGh1Yi5jb20va2FuZ2F4L2RldGVjdC1nbG9iYWxcblxuLy8gdHdlYWtlZCB0byBydW4gd2l0aG91dCBhIFVJLlxuXG4oZnVuY3Rpb24gKCkge1xuICAgIGZ1bmN0aW9uIGdldFByb3BlcnR5RGVzY3JpcHRvcnMob2JqZWN0KSB7XG4gICAgICB2YXIgcHJvcHMgPSB7IH07XG4gICAgICBmb3IgKHZhciBwcm9wIGluIG9iamVjdCkge1xuICAgICAgICBcbiAgICAgICAgLy8gbmVyZmluZyBmb3IgZmlyZWZveCB3aG8gZ29lcyBjcmF6eSBvdmVyIHNvbWUgb2JqZWN0cyBsaWtlIHNlc3Npb25TdG9yYWdlXG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgXG4gICAgICAgICAgcHJvcHNbcHJvcF0gPSB7XG4gICAgICAgICAgICB0eXBlOiAgdHlwZW9mIG9iamVjdFtwcm9wXSxcbiAgICAgICAgICAgIHZhbHVlOiBvYmplY3RbcHJvcF1cbiAgICAgICAgICB9O1xuICAgICAgICAgIFxuICAgICAgICB9IGNhdGNoKGUpe1xuICAgICAgICAgIHByb3BzW3Byb3BdID0ge307IFxuICAgICAgICB9XG4gICAgICB9XG4gICAgICByZXR1cm4gcHJvcHM7XG4gICAgfVxuICAgIFxuICAgIGZ1bmN0aW9uIGdldENsZWFuV2luZG93KCkge1xuICAgICAgdmFyIGVsSWZyYW1lID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnaWZyYW1lJyk7XG4gICAgICBlbElmcmFtZS5zdHlsZS5kaXNwbGF5ID0gJ25vbmUnO1xuICAgICAgXG4gICAgICB2YXIgcmVmID0gZG9jdW1lbnQuZ2V0RWxlbWVudHNCeVRhZ05hbWUoJ3NjcmlwdCcpWzBdO1xuICAgICAgcmVmLnBhcmVudE5vZGUuaW5zZXJ0QmVmb3JlKGVsSWZyYW1lLCByZWYpO1xuICAgICAgXG4gICAgICBlbElmcmFtZS5zcmMgPSAnYWJvdXQ6YmxhbmsnO1xuICAgICAgcmV0dXJuIGVsSWZyYW1lLmNvbnRlbnRXaW5kb3c7XG4gICAgfVxuICAgIFxuICAgIGZ1bmN0aW9uIGFwcGVuZENvbnRyb2woZWwsIG5hbWUpIHtcbiAgICAgIHZhciBlbENoZWNrYm94ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnaW5wdXQnKTtcbiAgICAgIGVsQ2hlY2tib3gudHlwZSA9ICdjaGVja2JveCc7XG4gICAgICBlbENoZWNrYm94LmNoZWNrZWQgPSB0cnVlO1xuICAgICAgZWxDaGVja2JveC5pZCA9ICdfXycgKyBuYW1lO1xuICAgICAgXG4gICAgICB2YXIgZWxMYWJlbCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2xhYmVsJyk7XG4gICAgICBlbExhYmVsLmh0bWxGb3IgPSAnX18nICsgbmFtZTtcbiAgICAgIGVsTGFiZWwuaW5uZXJIVE1MID0gJ0V4Y2x1ZGUgJyArIG5hbWUgKyAnIHByb3BlcnRpZXM/JztcbiAgICAgIGVsTGFiZWwuc3R5bGUubWFyZ2luTGVmdCA9ICcwLjVlbSc7XG4gICAgICBcbiAgICAgIHZhciBlbFdyYXBwZXIgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdwJyk7XG4gICAgICBlbFdyYXBwZXIuc3R5bGUubWFyZ2luQm90dG9tID0gJzAuNWVtJztcbiAgICAgIFxuICAgICAgZWxXcmFwcGVyLmFwcGVuZENoaWxkKGVsQ2hlY2tib3gpO1xuICAgICAgZWxXcmFwcGVyLmFwcGVuZENoaWxkKGVsTGFiZWwpO1xuXG4gICAgICBlbC5hcHBlbmRDaGlsZChlbFdyYXBwZXIpO1xuICAgIH1cbiAgICBcbiAgICBmdW5jdGlvbiBhcHBlbmRBbmFseXplKGVsKSB7XG4gICAgICB2YXIgZWxBbmFseXplID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnYnV0dG9uJyk7XG4gICAgICBlbEFuYWx5emUuaWQgPSAnX19hbmFseXplJztcbiAgICAgIGVsQW5hbHl6ZS5pbm5lckhUTUwgPSAnQW5hbHl6ZSc7XG4gICAgICBlbEFuYWx5emUuc3R5bGUubWFyZ2luVG9wID0gJzFlbSc7XG4gICAgICBlbC5hcHBlbmRDaGlsZChlbEFuYWx5emUpO1xuICAgIH1cbiAgICBcbiAgICBmdW5jdGlvbiBhcHBlbmRDYW5jZWwoZWwpIHtcbiAgICAgIHZhciBlbENhbmNlbCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2EnKTtcbiAgICAgIGVsQ2FuY2VsLmhyZWYgPSAnIyc7XG4gICAgICBlbENhbmNlbC5pbm5lckhUTUwgPSAnQ2FuY2VsJztcbiAgICAgIGVsQ2FuY2VsLnN0eWxlLmNzc1RleHQgPSAnY29sb3I6I2VlZTttYXJnaW4tbGVmdDowLjVlbTsnO1xuICAgICAgZWxDYW5jZWwub25jbGljayA9IGZ1bmN0aW9uKCkge1xuICAgICAgICBlbC5wYXJlbnROb2RlLnJlbW92ZUNoaWxkKGVsKTtcbiAgICAgICAgcmV0dXJuIGZhbHNlOyBcbiAgICAgIH07XG4gICAgICBlbC5hcHBlbmRDaGlsZChlbENhbmNlbCk7XG4gICAgfVxuICAgIFxuICAgIGZ1bmN0aW9uIGluaXRDb25maWdQb3B1cCgpIHtcbiAgICAgIHZhciBlbCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuICAgICAgXG4gICAgICBlbC5zdHlsZS5jc3NUZXh0ID0gICdwb3NpdGlvbjpmaXhlZDsgbGVmdDoxMHB4OyB0b3A6MTBweDsgd2lkdGg6MzAwcHg7IGJhY2tncm91bmQ6cmdiYSg1MCw1MCw1MCwwLjkpOycgK1xuICAgICAgICAgICAgICAgICAgICAgICAgICAnLW1vei1ib3JkZXItcmFkaXVzOjEwcHg7IHBhZGRpbmc6MWVtOyBjb2xvcjogI2VlZTsgdGV4dC1hbGlnbjogbGVmdDsnICtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgJ2ZvbnQtZmFtaWx5OiBcIkhlbHZldGljYSBOZXVlXCIsIFZlcmRhbmEsIEFyaWFsLCBzYW5zIHNlcmlmOyB6LWluZGV4OiA5OTk5OTsnO1xuICAgICAgXG4gICAgICBmb3IgKHZhciBwcm9wIGluIHByb3BTZXRzKSB7XG4gICAgICAgIGFwcGVuZENvbnRyb2woZWwsIHByb3ApO1xuICAgICAgfVxuICAgICAgXG4gICAgICBhcHBlbmRBbmFseXplKGVsKTtcbiAgICAgIGFwcGVuZENhbmNlbChlbCk7XG4gICAgICBcbiAgICAgIHZhciByZWYgPSBkb2N1bWVudC5nZXRFbGVtZW50c0J5VGFnTmFtZSgnc2NyaXB0JylbMF07XG4gICAgICByZWYucGFyZW50Tm9kZS5pbnNlcnRCZWZvcmUoZWwsIHJlZik7XG4gICAgfVxuICAgIFxuICAgIGZ1bmN0aW9uIGdldFByb3BzQ291bnQob2JqZWN0KSB7XG4gICAgICB2YXIgY291bnQgPSAwO1xuICAgICAgZm9yICh2YXIgcHJvcCBpbiBvYmplY3QpIHtcbiAgICAgICAgY291bnQrKztcbiAgICAgIH1cbiAgICAgIHJldHVybiBjb3VudDtcbiAgICB9XG4gICAgXG4gICAgZnVuY3Rpb24gc2hvdWxkRGVsZXRlUHJvcGVydHkocHJvcFRvQ2hlY2spIHtcbiAgICAgIGZvciAodmFyIHByb3AgaW4gcHJvcFNldHMpIHtcbiAgICAgICAgdmFyIGVsQ2hlY2tib3ggPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnX18nICsgcHJvcCk7XG4gICAgICAgIHZhciBpc1Byb3BJblNldCA9IHByb3BTZXRzW3Byb3BdLmluZGV4T2YocHJvcFRvQ2hlY2spID4gLTE7XG4gICAgICAgIGlmIChpc1Byb3BJblNldCAmJiAoZWxDaGVja2JveCA/IGVsQ2hlY2tib3guY2hlY2tlZCA6IHRydWUpICkge1xuICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICAgIFxuICAgIGZ1bmN0aW9uIGFuYWx5emUoKSB7XG4gICAgICB2YXIgZ2xvYmFsID0gKGZ1bmN0aW9uKCl7IHJldHVybiB0aGlzOyB9KSgpLFxuICAgICAgICAgIGdsb2JhbFByb3BzID0gZ2V0UHJvcGVydHlEZXNjcmlwdG9ycyhnbG9iYWwpLFxuICAgICAgICAgIGNsZWFuV2luZG93ID0gZ2V0Q2xlYW5XaW5kb3coKTtcbiAgICAgICAgICBcbiAgICAgIGZvciAodmFyIHByb3AgaW4gY2xlYW5XaW5kb3cpIHtcbiAgICAgICAgaWYgKGdsb2JhbFByb3BzW3Byb3BdKSB7XG4gICAgICAgICAgZGVsZXRlIGdsb2JhbFByb3BzW3Byb3BdO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgICBmb3IgKHZhciBwcm9wIGluIGdsb2JhbFByb3BzKSB7XG4gICAgICAgIGlmIChzaG91bGREZWxldGVQcm9wZXJ0eShwcm9wKSkge1xuICAgICAgICAgIGRlbGV0ZSBnbG9iYWxQcm9wc1twcm9wXTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgXG4gICAgICB3aW5kb3cuX19nbG9iYWxzQ291bnQgPSBnZXRQcm9wc0NvdW50KGdsb2JhbFByb3BzKTtcbiAgICAgIHdpbmRvdy5fX2dsb2JhbHMgICAgICA9IGdsb2JhbFByb3BzO1xuICAgICAgXG4gICAgICB3aW5kb3cuY29uc29sZSAmJiBjb25zb2xlLmxvZygnVG90YWwgbnVtYmVyIG9mIGdsb2JhbCBwcm9wZXJ0aWVzOiAnICsgX19nbG9iYWxzQ291bnQpO1xuICAgICAgd2luZG93LmNvbnNvbGUgJiYgY29uc29sZS5kaXIoX19nbG9iYWxzKTtcbiAgICB9XG4gICAgXG4gICAgdmFyIHByb3BTZXRzID0ge1xuICAgICAgJ1Byb3RvdHlwZSc6ICAgICAgICAnJCQgJEEgJEYgJEggJFIgJGJyZWFrICRjb250aW51ZSAkdyBBYnN0cmFjdCBBamF4IENsYXNzIEVudW1lcmFibGUgRWxlbWVudCBGaWVsZCBGb3JtICcgK1xuICAgICAgICAgICAgICAgICAgICAgICAgICAnSGFzaCBJbnNlcnRpb24gT2JqZWN0UmFuZ2UgUGVyaW9kaWNhbEV4ZWN1dGVyIFBvc2l0aW9uIFByb3RvdHlwZSBTZWxlY3RvciBUZW1wbGF0ZSBUb2dnbGUgVHJ5Jy5zcGxpdCgnICcpLFxuICAgICAgICAgICAgICAgICAgICAgICAgXG4gICAgICAnU2NyaXB0YWN1bG91cyc6ICAgICdBdXRvY29tcGxldGVyIEJ1aWxkZXIgQ29udHJvbCBEcmFnZ2FibGUgRHJhZ2dhYmxlcyBEcm9wcGFibGVzIEVmZmVjdCBTb3J0YWJsZSBTb3J0YWJsZU9ic2VydmVyIFNvdW5kIFNjcmlwdGFjdWxvdXMnLnNwbGl0KCcgJyksXG4gICAgICAnRmlyZWJ1Zyc6ICAgICAgICAgICdsb2FkRmlyZWJ1Z0NvbnNvbGUgY29uc29sZSBfZ2V0RmlyZWJ1Z0NvbnNvbGVFbGVtZW50IF9GaXJlYnVnQ29uc29sZSBfRmlyZWJ1Z0NvbW1hbmRMaW5lIF9maXJlYnVnJy5zcGxpdCgnICcpLFxuICAgICAgJ01vemlsbGEnOiAgICAgICAgICAnQ29tcG9uZW50cyBYUENOYXRpdmVXcmFwcGVyIFhQQ1NhZmVKU09iamVjdFdyYXBwZXIgZ2V0SW50ZXJmYWNlIG5ldHNjYXBlIEdldFdlYWtSZWZlcmVuY2UgR2Vja29BY3RpdmVYT2JqZWN0Jy5zcGxpdCgnICcpLFxuICAgICAgJ0dvb2dsZUFuYWx5dGljcyc6ICAnZ2FKc0hvc3QgZ2FHbG9iYWwgX2dhdCBfZ2FxIHBhZ2VUcmFja2VyJy5zcGxpdCgnICcpLFxuICAgICAgJ2xhenlHbG9iYWxzJzogICAgICAnb25oYXNoY2hhbmdlJy5zcGxpdCgnICcpXG4gICAgfTtcbiAgICBcbiAgICAvLyBpbml0Q29uZmlnUG9wdXAoKTsgLy8gZGlzYWJsZSBiZWNhdXNlIHdlJ3JlIGdvaW5nIFVJLWxlc3MuXG4gICAgXG4gICAgdmFyIGFuYWx5emVFbGVtID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ19fYW5hbHl6ZScpO1xuICAgIGFuYWx5emVFbGVtICYmIChhbmFseXplRWxlbS5vbmNsaWNrID0gYW5hbHl6ZSk7XG4gICAgXG4gICAgYW5hbHl6ZSgpOyAvLyBhbmQgYXNzaWduIHRvdGFsIGFkZGVkIGdsb2JhbHMgdG8gd2luZG93Ll9fZ2xvYmFsc0NvdW50XG4gICAgXG59KSgpOyJdLCJmaWxlIjoibW9kZXJuaXpyL3Rlc3QvanMvbGliL2RldGVjdC1nbG9iYWwuanMiLCJzb3VyY2VSb290IjoiL3NvdXJjZS8ifQ==