// developer.mozilla.org/en/CSS/background-repeat

// test page: jsbin.com/uzesun/
// http://jsfiddle.net/ryanseddon/yMLTQ/6/    

(function(){


function getBgRepeatValue(elem){
    return (window.getComputedStyle ?
             getComputedStyle(elem, null).getPropertyValue('background') :
             elem.currentStyle['background']);
}
  

Modernizr.testStyles(' #modernizr { background-repeat: round; } ', function(elem, rule){ 

  Modernizr.addTest('bgrepeatround', getBgRepeatValue(elem) == 'round');

});



Modernizr.testStyles(' #modernizr { background-repeat: space; } ', function(elem, rule){ 

  Modernizr.addTest('bgrepeatspace', getBgRepeatValue(elem) == 'space');

});


})();

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiIiwic291cmNlcyI6WyJtb2Rlcm5penIvZmVhdHVyZS1kZXRlY3RzL2Nzcy1iYWNrZ3JvdW5kcmVwZWF0LmpzIl0sInNvdXJjZXNDb250ZW50IjpbIi8vIGRldmVsb3Blci5tb3ppbGxhLm9yZy9lbi9DU1MvYmFja2dyb3VuZC1yZXBlYXRcblxuLy8gdGVzdCBwYWdlOiBqc2Jpbi5jb20vdXplc3VuL1xuLy8gaHR0cDovL2pzZmlkZGxlLm5ldC9yeWFuc2VkZG9uL3lNTFRRLzYvICAgIFxuXG4oZnVuY3Rpb24oKXtcblxuXG5mdW5jdGlvbiBnZXRCZ1JlcGVhdFZhbHVlKGVsZW0pe1xuICAgIHJldHVybiAod2luZG93LmdldENvbXB1dGVkU3R5bGUgP1xuICAgICAgICAgICAgIGdldENvbXB1dGVkU3R5bGUoZWxlbSwgbnVsbCkuZ2V0UHJvcGVydHlWYWx1ZSgnYmFja2dyb3VuZCcpIDpcbiAgICAgICAgICAgICBlbGVtLmN1cnJlbnRTdHlsZVsnYmFja2dyb3VuZCddKTtcbn1cbiAgXG5cbk1vZGVybml6ci50ZXN0U3R5bGVzKCcgI21vZGVybml6ciB7IGJhY2tncm91bmQtcmVwZWF0OiByb3VuZDsgfSAnLCBmdW5jdGlvbihlbGVtLCBydWxlKXsgXG5cbiAgTW9kZXJuaXpyLmFkZFRlc3QoJ2JncmVwZWF0cm91bmQnLCBnZXRCZ1JlcGVhdFZhbHVlKGVsZW0pID09ICdyb3VuZCcpO1xuXG59KTtcblxuXG5cbk1vZGVybml6ci50ZXN0U3R5bGVzKCcgI21vZGVybml6ciB7IGJhY2tncm91bmQtcmVwZWF0OiBzcGFjZTsgfSAnLCBmdW5jdGlvbihlbGVtLCBydWxlKXsgXG5cbiAgTW9kZXJuaXpyLmFkZFRlc3QoJ2JncmVwZWF0c3BhY2UnLCBnZXRCZ1JlcGVhdFZhbHVlKGVsZW0pID09ICdzcGFjZScpO1xuXG59KTtcblxuXG59KSgpO1xuIl0sImZpbGUiOiJtb2Rlcm5penIvZmVhdHVyZS1kZXRlY3RzL2Nzcy1iYWNrZ3JvdW5kcmVwZWF0LmpzIiwic291cmNlUm9vdCI6Ii9zb3VyY2UvIn0=