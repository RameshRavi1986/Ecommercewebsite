QUnit.begin = function() {
	console.log("Starting test suite");
	console.log("================================================\n");
};

QUnit.moduleDone = function(opts) {
	if(opts.failed === 0) {
		console.log("\u2714 All tests passed in '"+opts.name+"' module");
	} else {
		console.log("\u2716 "+ opts.failed +" tests failed in '"+opts.name+"' module");
	}
};

QUnit.done = function(opts) {
	console.log("\n================================================");
	console.log("Tests completed in "+opts.runtime+" milliseconds");
	console.log(opts.passed + " tests of "+opts.total+" passed, "+opts.failed+" failed.");
};

module('Basics', {
    setup:function() {
    },
    teardown:function() {
    }
});

test("globals set up", function() {

	ok(window.Modernizr, 'global modernizr object created');

});

test("bind is implemented", function() {

  ok(Function.prototype.bind, 'bind is a member of Function.prototype');

  var a = function(){
      return this.modernizr;
  };
  a = a.bind({modernizr: 'just awsome'});

  equal("just awsome", a(), 'bind works as expected');


  // thank you webkit layoutTests


  var result;

  function F(x, y)
  {
      result = this + " -> x:" + x + ", y:" + y;
  }

  G = F.bind("'a'", "'b'");
  H = G.bind("'Cannot rebind this!'", "'c'");

  G(1,2);
  equal(result, "\'a\' -> x:\'b\', y:1");
  H(1,2);
  equal(result, "\'a\' -> x:\'b\', y:\'c\'");

  var f = new F(1,2);
  equal(result, "[object Object] -> x:1, y:2");
  var g = new G(1,2);
  equal(result, "[object Object] -> x:\'b\', y:1");
  var h = new H(1,2);
  equal(result, "[object Object] -> x:\'b\', y:\'c\'");

  ok(f instanceof F, "f instanceof F");
  ok(g instanceof F, "g instanceof F");
  ok(h instanceof F, "h instanceof F");

  // Bound functions don't have a 'prototype' property.
  ok("prototype" in F, '"prototype" in F');

  // The object passed to bind as 'this' must be callable.
  raises(function(){
    Function.bind.call(undefined);
  });

  // Objects that allow call but not construct can be bound, but should throw if used with new.
  var abcAt = String.prototype.charAt.bind("abc");
  equal(abcAt(1), "b", 'Objects that allow call but not construct can be bound...');

  equal(1, Function.bind.length, 'it exists');


});



test("document.documentElement is valid and correct",1, function() {
	equal(document.documentElement,document.getElementsByTagName('html')[0]);
});


test("no-js class is gone.", function() {

	ok(!/(?:^|\s)no-js(?:^|\s)/.test(document.documentElement.className),
	   'no-js class is gone');

	ok(/(?:^|\s)js(?:^|\s)/.test(document.documentElement.className),
	   'html.js class is present');

	ok(/(?:^|\s)\+no-js(?:\s|$)/.test(document.documentElement.className),
	   'html.+no-js class is still present');

	ok(/(?:^|\s)no-js-(?:\s|$)/.test(document.documentElement.className),
	   'html.no-js- class is still present');

	ok(/(?:^|\s)i-has-no-js(?:\s|$)/.test(document.documentElement.className),
	   'html.i-has-no-js class is still present');

	if (document.querySelector){
	  ok(document.querySelector('html.js') == document.documentElement,
	     "document.querySelector('html.js') matches.");
	}
});

test('html shim worked', function(){
  expect(2);

  // the exact test we use in the script
  var elem = document.getElementsByTagName("section")[0];
  elem.id = "html5section";

  ok( elem.childNodes.length === 1 , 'unknown elements dont collapse');

  elem.style.color = 'red';
  ok( /red|#ff0000/i.test(elem.style.color), 'unknown elements are styleable')

});


module('Modernizr classes and bools', {
    setup:function() {
    },
    teardown:function() {
    }
});


test('html classes are looking good',function(){

  var classes = TEST.trim(document.documentElement.className).split(/\s+/);

  var modprops = Object.keys(Modernizr),
      newprops = modprops;

  // decrement for the properties that are private
  for (var i = -1, len = TEST.privates.length; ++i < len; ){
    var item = TEST.privates[i];
    equal(-1, TEST.inArray(item, classes), 'private Modernizr object '+ item +'should not have matching classes');
    equal(-1, TEST.inArray('no-' + item, classes), 'private Modernizr object no-'+item+' should not have matching classes');
  }

  // decrement for the non-boolean objects
//  for (var i = -1, len = TEST.inputs.length; ++i < len; ){
//    if (Modernizr[TEST.inputs[i]] != undefined) newprops--;
//  }

  // TODO decrement for the extraclasses

  // decrement for deprecated ones.
  $.each( TEST.deprecated, function(key, val){
    newprops.splice(  TEST.inArray(item, newprops), 1);
  });


  //equal(classes,newprops,'equal number of classes and global object props');

  if (classes.length !== newprops){
    //window.console && console.log(classes, newprops);

  }

  for (var i = 0, len = classes.length, aclass; i <len; i++){
    aclass = classes[i];

    // Skip js related classes.
    if (/^(?:js|\+no-js|no-js-|i-has-no-js)$/.test(aclass)) continue;

    if (aclass.indexOf('no-') === 0){
      aclass = aclass.replace('no-','');

      equal(Modernizr[aclass], false,
            aclass + ' is correctly false in the classes and object')

    } else {
      equal(Modernizr[aclass], true,
             aclass + ' is correctly true in the classes and object')
    }
  }


  for (var i = 0, len = classes.length, aclass; i <len; i++){
    equal(classes[i],classes[i].toLowerCase(),'all classes are lowerCase.');
  }

  // Remove fake no-js classes before test.
  var docElClass = document.documentElement.className;
  $.each(['\\+no-js', 'no-js-', 'i-has-no-js'], function(i, fakeClass) {
    docElClass = docElClass.replace(new RegExp('(^|\\s)' + fakeClass + '(\\s|$)', 'g'), '$1$2');
  });
  equal(/[^\s]no-/.test(docElClass), false, 'whitespace between all classes.');


})


test('Modernizr properties are looking good',function(){

  var count  = 0,
      nobool = TEST.API.concat(TEST.inputs)
                       .concat(TEST.audvid)
                       .concat(TEST.privates)
                       .concat(['textarea']); // due to forms-placeholder.js test

  for (var prop in window.Modernizr){
    if (Modernizr.hasOwnProperty(prop)){

      if (TEST.inArray(prop,nobool) >= 0) continue;

      ok(Modernizr[prop] === true || Modernizr[prop] === false,
        'Modernizr.'+prop+' is a straight up boolean');


      equal(prop,prop.toLowerCase(),'all properties are lowerCase.')
    }
  }
})



test('Modernizr.audio and Modernizr.video',function(){

  for (var i = -1, len = TEST.audvid.length; ++i < len;){
    var prop = TEST.audvid[i];

    if (Modernizr[prop].toString() == 'true'){

      ok(Modernizr[prop],                             'Modernizr.'+prop+' is truthy.');
      equal(Modernizr[prop] == true,true,            'Modernizr.'+prop+' is == true')
      equal(typeof Modernizr[prop] === 'object',true,'Moderizr.'+prop+' is truly an object');
      equal(Modernizr[prop] !== true,true,           'Modernizr.'+prop+' is !== true')

    } else {

      equal(Modernizr[prop] != true,true,            'Modernizr.'+prop+' is != true')
    }
  }


});


test('Modernizr results match expected values',function(){

  // i'm bringing over a few tests from inside Modernizr.js
  equal(!!document.createElement('canvas').getContext,Modernizr.canvas,'canvas test consistent');

  equal(!!window.Worker,Modernizr.webworkers,'web workers test consistent')

});



module('Modernizr\'s API methods', {
    setup:function() {
    },
    teardown:function() {
    }
});

test('Modernizr.addTest()',22,function(){

  var docEl = document.documentElement;


  Modernizr.addTest('testtrue',function(){
    return true;
  });

  Modernizr.addTest('testtruthy',function(){
    return 100;
  });

  Modernizr.addTest('testfalse',function(){
    return false;
  });

  Modernizr.addTest('testfalsy',function(){
    return undefined;
  });

  ok(docEl.className.indexOf(' testtrue') >= 0,'positive class added');
  equal(Modernizr.testtrue,true,'positive prop added');

  ok(docEl.className.indexOf(' testtruthy') >= 0,'positive class added');
  equal(Modernizr.testtruthy,100,'truthy value is not casted to straight boolean');

  ok(docEl.className.indexOf(' no-testfalse') >= 0,'negative class added');
  equal(Modernizr.testfalse,false,'negative prop added');

  ok(docEl.className.indexOf(' no-testfalsy') >= 0,'negative class added');
  equal(Modernizr.testfalsy,undefined,'falsy value is not casted to straight boolean');



  Modernizr.addTest('testcamelCase',function(){
     return true;
   });

  ok(docEl.className.indexOf(' testcamelCase') === -1,
     'camelCase test name toLowerCase()\'d');


  // okay new signature for this API! woo

  Modernizr.addTest('testboolfalse', false);

  ok(~docEl.className.indexOf(' no-testboolfalse'), 'Modernizr.addTest(feature, bool): negative class added');
  equal(Modernizr.testboolfalse, false, 'Modernizr.addTest(feature, bool): negative prop added');



  Modernizr.addTest('testbooltrue', true);

  ok(~docEl.className.indexOf(' testbooltrue'), 'Modernizr.addTest(feature, bool): positive class added');
  equal(Modernizr.testbooltrue, true, 'Modernizr.addTest(feature, bool): positive prop added');



  Modernizr.addTest({'testobjboolfalse': false,
                     'testobjbooltrue' : true   });

  ok(~docEl.className.indexOf(' no-testobjboolfalse'), 'Modernizr.addTest({feature: bool}): negative class added');
  equal(Modernizr.testobjboolfalse, false, 'Modernizr.addTest({feature: bool}): negative prop added');

  ok(~docEl.className.indexOf(' testobjbooltrue'), 'Modernizr.addTest({feature: bool}): positive class added');
  equal(Modernizr.testobjbooltrue, true, 'Modernizr.addTest({feature: bool}): positive prop added');




  Modernizr.addTest({'testobjfnfalse': function(){ return false },
                     'testobjfntrue' : function(){ return true }   });


  ok(~docEl.className.indexOf(' no-testobjfnfalse'), 'Modernizr.addTest({feature: bool}): negative class added');
  equal(Modernizr.testobjfnfalse, false, 'Modernizr.addTest({feature: bool}): negative prop added');

  ok(~docEl.className.indexOf(' testobjfntrue'), 'Modernizr.addTest({feature: bool}): positive class added');
  equal(Modernizr.testobjfntrue, true, 'Modernizr.addTest({feature: bool}): positive prop added');


  Modernizr
    .addTest('testchainone', true)
    .addTest({ testchaintwo: true })
    .addTest('testchainthree', function(){ return true; });

  ok( Modernizr.testchainone == Modernizr.testchaintwo == Modernizr.testchainthree, 'addTest is chainable');


}); // eo addTest





test('Modernizr.mq: media query testing',function(){

  var $html = $('html');
  $.mobile = {};

  // from jquery mobile

  $.mobile.media = (function() {
  	// TODO: use window.matchMedia once at least one UA implements it
  	var cache = {},
  		testDiv = $( "<div id='jquery-mediatest'>" ),
  		fakeBody = $( "<body>" ).append( testDiv );

  	return function( query ) {
  		if ( !( query in cache ) ) {
  			var styleBlock = document.createElement('style'),
          		cssrule = "@media " + query + " { #jquery-mediatest { position:absolute; } }";
  	        //must set type for IE!
  	        styleBlock.type = "text/css";
  	        if (styleBlock.styleSheet){
  	          styleBlock.styleSheet.cssText = cssrule;
  	        }
  	        else {
  	          styleBlock.appendChild(document.createTextNode(cssrule));
  	        }

  			$html.prepend( fakeBody ).prepend( styleBlock );
  			cache[ query ] = testDiv.css( "position" ) === "absolute";
  			fakeBody.add( styleBlock ).remove();
  		}
  		return cache[ query ];
  	};
  })();


  ok(Modernizr.mq,'Modernizr.mq() doesn\' freak out.');

  equal($.mobile.media('only screen'), Modernizr.mq('only screen'),'screen media query matches jQuery mobile\'s result');

  equal(Modernizr.mq('only all'), Modernizr.mq('only all'), 'Cache hit matches');


});




test('Modernizr.hasEvent()',function(){

  ok(typeof Modernizr.hasEvent == 'function','Modernizr.hasEvent() is a function');


  equal(Modernizr.hasEvent('click'), true,'click event is supported');

  equal(Modernizr.hasEvent('modernizrcustomevent'), false,'random event is definitely not supported');

  /* works fine in webkit but not gecko
  equal(  Modernizr.hasEvent('resize', window),
          !Modernizr.hasEvent('resize', document.createElement('div')),
          'Resize is supported in window but not a div, typically...');
  */

});





test('Modernizr.testStyles()',function(){

  equal(typeof Modernizr.testStyles, 'function','Modernizr.testStyles() is a function');

  var style = '#modernizr{ width: 9px; height: 4px; font-size: 0; color: papayawhip; }';

  Modernizr.testStyles(style, function(elem, rule){
      equal(style, rule, 'rule passsed back matches what i gave it.')
      equal(elem.offsetWidth, 9, 'width was set through the style');
      equal(elem.offsetHeight, 4, 'height was set through the style');
      equal(elem.id, 'modernizr', 'element is indeed the modernizr element');
  });

});


test('Modernizr._[properties]',function(){

  equal(6, Modernizr._prefixes.length, 'Modernizr._prefixes has 6 items');

  equal(4, Modernizr._domPrefixes.length, 'Modernizr.domPrefixes has 4 items');

});

test('Modernizr.testProp()',function(){

  equal(true, Modernizr.testProp('margin'), 'Everyone supports margin');

  equal(false, Modernizr.testProp('happiness'), 'Nobody supports the happiness style. :(');
  equal(true, Modernizr.testProp('fontSize'), 'Everyone supports fontSize');
  equal(false, Modernizr.testProp('font-size'), 'Nobody supports font-size');

  equal('pointerEvents' in  document.createElement('div').style,
         Modernizr.testProp('pointerEvents'),
         'results for `pointer-events` are consistent with a homegrown feature test');

});



test('Modernizr.testAllProps()',function(){

  equal(true, Modernizr.testAllProps('margin'), 'Everyone supports margin');

  equal(false, Modernizr.testAllProps('happiness'), 'Nobody supports the happiness style. :(');
  equal(true, Modernizr.testAllProps('fontSize'), 'Everyone supports fontSize');
  equal(false, Modernizr.testAllProps('font-size'), 'Nobody supports font-size');

  equal(Modernizr.csstransitions, Modernizr.testAllProps('transition'), 'Modernizr result matches API result: csstransitions');

  equal(Modernizr.csscolumns, Modernizr.testAllProps('columnCount'), 'Modernizr result matches API result: csscolumns')

});






test('Modernizr.prefixed() - css and DOM resolving', function(){
  // https://gist.github.com/523692

  function gimmePrefix(prop, obj){
    var prefixes = ['Moz','Khtml','Webkit','O','ms'],
        domPrefixes = ['moz','khtml','webkit','o','ms'],
        elem     = document.createElement('div'),
        upper    = prop.charAt(0).toUpperCase() + prop.slice(1);

    if(!obj) {
      if (prop in elem.style)
        return prop;

      for (var len = prefixes.length; len--; ){
        if ((prefixes[len] + upper)  in elem.style)
          return (prefixes[len] + upper);
      }
    } else {
      if (prop in obj)
        return prop;

      for (var len = domPrefixes.length; len--; ){
        if ((domPrefixes[len] + upper)  in obj)
          return (domPrefixes[len] + upper);
      }
    }


    return false;
  }

  var propArr = ['transition', 'backgroundSize', 'boxSizing', 'borderImage',
                 'borderRadius', 'boxShadow', 'columnCount'];

  var domPropArr = [{ 'prop': 'requestAnimationFrame',  'obj': window },
                    { 'prop': 'querySelectorAll',       'obj': document },
                    { 'prop': 'matchesSelector',        'obj': document.createElement('div') }];

  for (var i = -1, len = propArr.length; ++i < len; ){
    var prop = propArr[i];
    equal(Modernizr.prefixed(prop), gimmePrefix(prop), 'results for ' + prop + ' match the homebaked prefix finder');
  }

  for (var i = -1, len = domPropArr.length; ++i < len; ){
    var prop = domPropArr[i];
    ok(!!~Modernizr.prefixed(prop.prop, prop.obj, false).toString().indexOf(gimmePrefix(prop.prop, prop.obj)), 'results for ' + prop.prop + ' match the homebaked prefix finder');
  }




});


// FIXME: so a few of these are whitelisting for webkit. i'd like to improve that.
test('Modernizr.prefixed autobind', function(){

  var rAFName;

  // quick sniff to find the local rAF prefixed name.
  var vendors = ['ms', 'moz', 'webkit', 'o'];
  for(var x = 0; x < vendors.length && !rAFName; ++x) {
    rAFName = window[vendors[x]+'RequestAnimationFrame'] && vendors[x]+'RequestAnimationFrame';
  }

  if (rAFName){
    // rAF returns a function
    equal(
      'function',
      typeof Modernizr.prefixed('requestAnimationFrame', window),
      "Modernizr.prefixed('requestAnimationFrame', window) returns a function")

    // unless we false it to a string
    equal(
      rAFName,
      Modernizr.prefixed('requestAnimationFrame', window, false),
      "Modernizr.prefixed('requestAnimationFrame', window, false) returns a string (the prop name)")

  }

  if (document.body.webkitMatchesSelector || document.body.mozMatchesSelector){

    var fn = Modernizr.prefixed('matchesSelector', HTMLElement.prototype, document.body);

    //returns function
    equal(
      'function',
      typeof fn,
      "Modernizr.prefixed('matchesSelector', HTMLElement.prototype, document.body) returns a function");

      // fn scoping
    equal(
      true,
      fn('body'),
      "Modernizr.prefixed('matchesSelector', HTMLElement.prototype, document.body) is scoped to the body")

  }

  // Webkit only: are there other objects that are prefixed?
  if (window.webkitNotifications){
    // should be an object.

    equal(
      'object',
      typeof Modernizr.prefixed('Notifications', window),
      "Modernizr.prefixed('Notifications') returns an object");

  }

  // Webkit only:
  if (typeof document.webkitIsFullScreen !== 'undefined'){
    // boolean

    equal(
      'boolean',
      typeof Modernizr.prefixed('isFullScreen', document),
      "Modernizr.prefixed('isFullScreen') returns a boolean");
  }



  // Moz only:
  if (typeof document.mozFullScreen !== 'undefined'){
    // boolean

    equal(
      'boolean',
      typeof Modernizr.prefixed('fullScreen', document),
      "Modernizr.prefixed('fullScreen') returns a boolean");
  }


  // Webkit-only.. takes advantage of Webkit's mixed case of prefixes
  if (document.body.style.WebkitAnimation){
    // string

    equal(
      'string',
      typeof Modernizr.prefixed('animation', document.body.style),
      "Modernizr.prefixed('animation', document.body.style) returns value of that, as a string");

    equal(
      animationStyle.toLowerCase(),
      Modernizr.prefixed('animation', document.body.style, false).toLowerCase(),
      "Modernizr.prefixed('animation', document.body.style, false) returns the (case-normalized) name of the property: webkitanimation");

  }

  equal(
    false,
    Modernizr.prefixed('doSomethingAmazing$#$', window),
    "Modernizr.prefixed('doSomethingAmazing$#$', window) : Gobbledygook with prefixed(str,obj) returns false");

  equal(
    false,
    Modernizr.prefixed('doSomethingAmazing$#$', window, document.body),
    "Modernizr.prefixed('doSomethingAmazing$#$', window) : Gobbledygook with prefixed(str,obj, scope) returns false");


  equal(
    false,
    Modernizr.prefixed('doSomethingAmazing$#$', window, false),
    "Modernizr.prefixed('doSomethingAmazing$#$', window) : Gobbledygook with prefixed(str,obj, false) returns false");


});






//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiIiwic291cmNlcyI6WyJtb2Rlcm5penIvdGVzdC9qcy91bml0LmpzIl0sInNvdXJjZXNDb250ZW50IjpbIlFVbml0LmJlZ2luID0gZnVuY3Rpb24oKSB7XG5cdGNvbnNvbGUubG9nKFwiU3RhcnRpbmcgdGVzdCBzdWl0ZVwiKTtcblx0Y29uc29sZS5sb2coXCI9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cXG5cIik7XG59O1xuXG5RVW5pdC5tb2R1bGVEb25lID0gZnVuY3Rpb24ob3B0cykge1xuXHRpZihvcHRzLmZhaWxlZCA9PT0gMCkge1xuXHRcdGNvbnNvbGUubG9nKFwiXFx1MjcxNCBBbGwgdGVzdHMgcGFzc2VkIGluICdcIitvcHRzLm5hbWUrXCInIG1vZHVsZVwiKTtcblx0fSBlbHNlIHtcblx0XHRjb25zb2xlLmxvZyhcIlxcdTI3MTYgXCIrIG9wdHMuZmFpbGVkICtcIiB0ZXN0cyBmYWlsZWQgaW4gJ1wiK29wdHMubmFtZStcIicgbW9kdWxlXCIpO1xuXHR9XG59O1xuXG5RVW5pdC5kb25lID0gZnVuY3Rpb24ob3B0cykge1xuXHRjb25zb2xlLmxvZyhcIlxcbj09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVwiKTtcblx0Y29uc29sZS5sb2coXCJUZXN0cyBjb21wbGV0ZWQgaW4gXCIrb3B0cy5ydW50aW1lK1wiIG1pbGxpc2Vjb25kc1wiKTtcblx0Y29uc29sZS5sb2cob3B0cy5wYXNzZWQgKyBcIiB0ZXN0cyBvZiBcIitvcHRzLnRvdGFsK1wiIHBhc3NlZCwgXCIrb3B0cy5mYWlsZWQrXCIgZmFpbGVkLlwiKTtcbn07XG5cbm1vZHVsZSgnQmFzaWNzJywge1xuICAgIHNldHVwOmZ1bmN0aW9uKCkge1xuICAgIH0sXG4gICAgdGVhcmRvd246ZnVuY3Rpb24oKSB7XG4gICAgfVxufSk7XG5cbnRlc3QoXCJnbG9iYWxzIHNldCB1cFwiLCBmdW5jdGlvbigpIHtcblxuXHRvayh3aW5kb3cuTW9kZXJuaXpyLCAnZ2xvYmFsIG1vZGVybml6ciBvYmplY3QgY3JlYXRlZCcpO1xuXG59KTtcblxudGVzdChcImJpbmQgaXMgaW1wbGVtZW50ZWRcIiwgZnVuY3Rpb24oKSB7XG5cbiAgb2soRnVuY3Rpb24ucHJvdG90eXBlLmJpbmQsICdiaW5kIGlzIGEgbWVtYmVyIG9mIEZ1bmN0aW9uLnByb3RvdHlwZScpO1xuXG4gIHZhciBhID0gZnVuY3Rpb24oKXtcbiAgICAgIHJldHVybiB0aGlzLm1vZGVybml6cjtcbiAgfTtcbiAgYSA9IGEuYmluZCh7bW9kZXJuaXpyOiAnanVzdCBhd3NvbWUnfSk7XG5cbiAgZXF1YWwoXCJqdXN0IGF3c29tZVwiLCBhKCksICdiaW5kIHdvcmtzIGFzIGV4cGVjdGVkJyk7XG5cblxuICAvLyB0aGFuayB5b3Ugd2Via2l0IGxheW91dFRlc3RzXG5cblxuICB2YXIgcmVzdWx0O1xuXG4gIGZ1bmN0aW9uIEYoeCwgeSlcbiAge1xuICAgICAgcmVzdWx0ID0gdGhpcyArIFwiIC0+IHg6XCIgKyB4ICsgXCIsIHk6XCIgKyB5O1xuICB9XG5cbiAgRyA9IEYuYmluZChcIidhJ1wiLCBcIidiJ1wiKTtcbiAgSCA9IEcuYmluZChcIidDYW5ub3QgcmViaW5kIHRoaXMhJ1wiLCBcIidjJ1wiKTtcblxuICBHKDEsMik7XG4gIGVxdWFsKHJlc3VsdCwgXCJcXCdhXFwnIC0+IHg6XFwnYlxcJywgeToxXCIpO1xuICBIKDEsMik7XG4gIGVxdWFsKHJlc3VsdCwgXCJcXCdhXFwnIC0+IHg6XFwnYlxcJywgeTpcXCdjXFwnXCIpO1xuXG4gIHZhciBmID0gbmV3IEYoMSwyKTtcbiAgZXF1YWwocmVzdWx0LCBcIltvYmplY3QgT2JqZWN0XSAtPiB4OjEsIHk6MlwiKTtcbiAgdmFyIGcgPSBuZXcgRygxLDIpO1xuICBlcXVhbChyZXN1bHQsIFwiW29iamVjdCBPYmplY3RdIC0+IHg6XFwnYlxcJywgeToxXCIpO1xuICB2YXIgaCA9IG5ldyBIKDEsMik7XG4gIGVxdWFsKHJlc3VsdCwgXCJbb2JqZWN0IE9iamVjdF0gLT4geDpcXCdiXFwnLCB5OlxcJ2NcXCdcIik7XG5cbiAgb2soZiBpbnN0YW5jZW9mIEYsIFwiZiBpbnN0YW5jZW9mIEZcIik7XG4gIG9rKGcgaW5zdGFuY2VvZiBGLCBcImcgaW5zdGFuY2VvZiBGXCIpO1xuICBvayhoIGluc3RhbmNlb2YgRiwgXCJoIGluc3RhbmNlb2YgRlwiKTtcblxuICAvLyBCb3VuZCBmdW5jdGlvbnMgZG9uJ3QgaGF2ZSBhICdwcm90b3R5cGUnIHByb3BlcnR5LlxuICBvayhcInByb3RvdHlwZVwiIGluIEYsICdcInByb3RvdHlwZVwiIGluIEYnKTtcblxuICAvLyBUaGUgb2JqZWN0IHBhc3NlZCB0byBiaW5kIGFzICd0aGlzJyBtdXN0IGJlIGNhbGxhYmxlLlxuICByYWlzZXMoZnVuY3Rpb24oKXtcbiAgICBGdW5jdGlvbi5iaW5kLmNhbGwodW5kZWZpbmVkKTtcbiAgfSk7XG5cbiAgLy8gT2JqZWN0cyB0aGF0IGFsbG93IGNhbGwgYnV0IG5vdCBjb25zdHJ1Y3QgY2FuIGJlIGJvdW5kLCBidXQgc2hvdWxkIHRocm93IGlmIHVzZWQgd2l0aCBuZXcuXG4gIHZhciBhYmNBdCA9IFN0cmluZy5wcm90b3R5cGUuY2hhckF0LmJpbmQoXCJhYmNcIik7XG4gIGVxdWFsKGFiY0F0KDEpLCBcImJcIiwgJ09iamVjdHMgdGhhdCBhbGxvdyBjYWxsIGJ1dCBub3QgY29uc3RydWN0IGNhbiBiZSBib3VuZC4uLicpO1xuXG4gIGVxdWFsKDEsIEZ1bmN0aW9uLmJpbmQubGVuZ3RoLCAnaXQgZXhpc3RzJyk7XG5cblxufSk7XG5cblxuXG50ZXN0KFwiZG9jdW1lbnQuZG9jdW1lbnRFbGVtZW50IGlzIHZhbGlkIGFuZCBjb3JyZWN0XCIsMSwgZnVuY3Rpb24oKSB7XG5cdGVxdWFsKGRvY3VtZW50LmRvY3VtZW50RWxlbWVudCxkb2N1bWVudC5nZXRFbGVtZW50c0J5VGFnTmFtZSgnaHRtbCcpWzBdKTtcbn0pO1xuXG5cbnRlc3QoXCJuby1qcyBjbGFzcyBpcyBnb25lLlwiLCBmdW5jdGlvbigpIHtcblxuXHRvayghLyg/Ol58XFxzKW5vLWpzKD86XnxcXHMpLy50ZXN0KGRvY3VtZW50LmRvY3VtZW50RWxlbWVudC5jbGFzc05hbWUpLFxuXHQgICAnbm8tanMgY2xhc3MgaXMgZ29uZScpO1xuXG5cdG9rKC8oPzpefFxccylqcyg/Ol58XFxzKS8udGVzdChkb2N1bWVudC5kb2N1bWVudEVsZW1lbnQuY2xhc3NOYW1lKSxcblx0ICAgJ2h0bWwuanMgY2xhc3MgaXMgcHJlc2VudCcpO1xuXG5cdG9rKC8oPzpefFxccylcXCtuby1qcyg/Olxcc3wkKS8udGVzdChkb2N1bWVudC5kb2N1bWVudEVsZW1lbnQuY2xhc3NOYW1lKSxcblx0ICAgJ2h0bWwuK25vLWpzIGNsYXNzIGlzIHN0aWxsIHByZXNlbnQnKTtcblxuXHRvaygvKD86XnxcXHMpbm8tanMtKD86XFxzfCQpLy50ZXN0KGRvY3VtZW50LmRvY3VtZW50RWxlbWVudC5jbGFzc05hbWUpLFxuXHQgICAnaHRtbC5uby1qcy0gY2xhc3MgaXMgc3RpbGwgcHJlc2VudCcpO1xuXG5cdG9rKC8oPzpefFxccylpLWhhcy1uby1qcyg/Olxcc3wkKS8udGVzdChkb2N1bWVudC5kb2N1bWVudEVsZW1lbnQuY2xhc3NOYW1lKSxcblx0ICAgJ2h0bWwuaS1oYXMtbm8tanMgY2xhc3MgaXMgc3RpbGwgcHJlc2VudCcpO1xuXG5cdGlmIChkb2N1bWVudC5xdWVyeVNlbGVjdG9yKXtcblx0ICBvayhkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCdodG1sLmpzJykgPT0gZG9jdW1lbnQuZG9jdW1lbnRFbGVtZW50LFxuXHQgICAgIFwiZG9jdW1lbnQucXVlcnlTZWxlY3RvcignaHRtbC5qcycpIG1hdGNoZXMuXCIpO1xuXHR9XG59KTtcblxudGVzdCgnaHRtbCBzaGltIHdvcmtlZCcsIGZ1bmN0aW9uKCl7XG4gIGV4cGVjdCgyKTtcblxuICAvLyB0aGUgZXhhY3QgdGVzdCB3ZSB1c2UgaW4gdGhlIHNjcmlwdFxuICB2YXIgZWxlbSA9IGRvY3VtZW50LmdldEVsZW1lbnRzQnlUYWdOYW1lKFwic2VjdGlvblwiKVswXTtcbiAgZWxlbS5pZCA9IFwiaHRtbDVzZWN0aW9uXCI7XG5cbiAgb2soIGVsZW0uY2hpbGROb2Rlcy5sZW5ndGggPT09IDEgLCAndW5rbm93biBlbGVtZW50cyBkb250IGNvbGxhcHNlJyk7XG5cbiAgZWxlbS5zdHlsZS5jb2xvciA9ICdyZWQnO1xuICBvayggL3JlZHwjZmYwMDAwL2kudGVzdChlbGVtLnN0eWxlLmNvbG9yKSwgJ3Vua25vd24gZWxlbWVudHMgYXJlIHN0eWxlYWJsZScpXG5cbn0pO1xuXG5cbm1vZHVsZSgnTW9kZXJuaXpyIGNsYXNzZXMgYW5kIGJvb2xzJywge1xuICAgIHNldHVwOmZ1bmN0aW9uKCkge1xuICAgIH0sXG4gICAgdGVhcmRvd246ZnVuY3Rpb24oKSB7XG4gICAgfVxufSk7XG5cblxudGVzdCgnaHRtbCBjbGFzc2VzIGFyZSBsb29raW5nIGdvb2QnLGZ1bmN0aW9uKCl7XG5cbiAgdmFyIGNsYXNzZXMgPSBURVNULnRyaW0oZG9jdW1lbnQuZG9jdW1lbnRFbGVtZW50LmNsYXNzTmFtZSkuc3BsaXQoL1xccysvKTtcblxuICB2YXIgbW9kcHJvcHMgPSBPYmplY3Qua2V5cyhNb2Rlcm5penIpLFxuICAgICAgbmV3cHJvcHMgPSBtb2Rwcm9wcztcblxuICAvLyBkZWNyZW1lbnQgZm9yIHRoZSBwcm9wZXJ0aWVzIHRoYXQgYXJlIHByaXZhdGVcbiAgZm9yICh2YXIgaSA9IC0xLCBsZW4gPSBURVNULnByaXZhdGVzLmxlbmd0aDsgKytpIDwgbGVuOyApe1xuICAgIHZhciBpdGVtID0gVEVTVC5wcml2YXRlc1tpXTtcbiAgICBlcXVhbCgtMSwgVEVTVC5pbkFycmF5KGl0ZW0sIGNsYXNzZXMpLCAncHJpdmF0ZSBNb2Rlcm5penIgb2JqZWN0ICcrIGl0ZW0gKydzaG91bGQgbm90IGhhdmUgbWF0Y2hpbmcgY2xhc3NlcycpO1xuICAgIGVxdWFsKC0xLCBURVNULmluQXJyYXkoJ25vLScgKyBpdGVtLCBjbGFzc2VzKSwgJ3ByaXZhdGUgTW9kZXJuaXpyIG9iamVjdCBuby0nK2l0ZW0rJyBzaG91bGQgbm90IGhhdmUgbWF0Y2hpbmcgY2xhc3NlcycpO1xuICB9XG5cbiAgLy8gZGVjcmVtZW50IGZvciB0aGUgbm9uLWJvb2xlYW4gb2JqZWN0c1xuLy8gIGZvciAodmFyIGkgPSAtMSwgbGVuID0gVEVTVC5pbnB1dHMubGVuZ3RoOyArK2kgPCBsZW47ICl7XG4vLyAgICBpZiAoTW9kZXJuaXpyW1RFU1QuaW5wdXRzW2ldXSAhPSB1bmRlZmluZWQpIG5ld3Byb3BzLS07XG4vLyAgfVxuXG4gIC8vIFRPRE8gZGVjcmVtZW50IGZvciB0aGUgZXh0cmFjbGFzc2VzXG5cbiAgLy8gZGVjcmVtZW50IGZvciBkZXByZWNhdGVkIG9uZXMuXG4gICQuZWFjaCggVEVTVC5kZXByZWNhdGVkLCBmdW5jdGlvbihrZXksIHZhbCl7XG4gICAgbmV3cHJvcHMuc3BsaWNlKCAgVEVTVC5pbkFycmF5KGl0ZW0sIG5ld3Byb3BzKSwgMSk7XG4gIH0pO1xuXG5cbiAgLy9lcXVhbChjbGFzc2VzLG5ld3Byb3BzLCdlcXVhbCBudW1iZXIgb2YgY2xhc3NlcyBhbmQgZ2xvYmFsIG9iamVjdCBwcm9wcycpO1xuXG4gIGlmIChjbGFzc2VzLmxlbmd0aCAhPT0gbmV3cHJvcHMpe1xuICAgIC8vd2luZG93LmNvbnNvbGUgJiYgY29uc29sZS5sb2coY2xhc3NlcywgbmV3cHJvcHMpO1xuXG4gIH1cblxuICBmb3IgKHZhciBpID0gMCwgbGVuID0gY2xhc3Nlcy5sZW5ndGgsIGFjbGFzczsgaSA8bGVuOyBpKyspe1xuICAgIGFjbGFzcyA9IGNsYXNzZXNbaV07XG5cbiAgICAvLyBTa2lwIGpzIHJlbGF0ZWQgY2xhc3Nlcy5cbiAgICBpZiAoL14oPzpqc3xcXCtuby1qc3xuby1qcy18aS1oYXMtbm8tanMpJC8udGVzdChhY2xhc3MpKSBjb250aW51ZTtcblxuICAgIGlmIChhY2xhc3MuaW5kZXhPZignbm8tJykgPT09IDApe1xuICAgICAgYWNsYXNzID0gYWNsYXNzLnJlcGxhY2UoJ25vLScsJycpO1xuXG4gICAgICBlcXVhbChNb2Rlcm5penJbYWNsYXNzXSwgZmFsc2UsXG4gICAgICAgICAgICBhY2xhc3MgKyAnIGlzIGNvcnJlY3RseSBmYWxzZSBpbiB0aGUgY2xhc3NlcyBhbmQgb2JqZWN0JylcblxuICAgIH0gZWxzZSB7XG4gICAgICBlcXVhbChNb2Rlcm5penJbYWNsYXNzXSwgdHJ1ZSxcbiAgICAgICAgICAgICBhY2xhc3MgKyAnIGlzIGNvcnJlY3RseSB0cnVlIGluIHRoZSBjbGFzc2VzIGFuZCBvYmplY3QnKVxuICAgIH1cbiAgfVxuXG5cbiAgZm9yICh2YXIgaSA9IDAsIGxlbiA9IGNsYXNzZXMubGVuZ3RoLCBhY2xhc3M7IGkgPGxlbjsgaSsrKXtcbiAgICBlcXVhbChjbGFzc2VzW2ldLGNsYXNzZXNbaV0udG9Mb3dlckNhc2UoKSwnYWxsIGNsYXNzZXMgYXJlIGxvd2VyQ2FzZS4nKTtcbiAgfVxuXG4gIC8vIFJlbW92ZSBmYWtlIG5vLWpzIGNsYXNzZXMgYmVmb3JlIHRlc3QuXG4gIHZhciBkb2NFbENsYXNzID0gZG9jdW1lbnQuZG9jdW1lbnRFbGVtZW50LmNsYXNzTmFtZTtcbiAgJC5lYWNoKFsnXFxcXCtuby1qcycsICduby1qcy0nLCAnaS1oYXMtbm8tanMnXSwgZnVuY3Rpb24oaSwgZmFrZUNsYXNzKSB7XG4gICAgZG9jRWxDbGFzcyA9IGRvY0VsQ2xhc3MucmVwbGFjZShuZXcgUmVnRXhwKCcoXnxcXFxccyknICsgZmFrZUNsYXNzICsgJyhcXFxcc3wkKScsICdnJyksICckMSQyJyk7XG4gIH0pO1xuICBlcXVhbCgvW15cXHNdbm8tLy50ZXN0KGRvY0VsQ2xhc3MpLCBmYWxzZSwgJ3doaXRlc3BhY2UgYmV0d2VlbiBhbGwgY2xhc3Nlcy4nKTtcblxuXG59KVxuXG5cbnRlc3QoJ01vZGVybml6ciBwcm9wZXJ0aWVzIGFyZSBsb29raW5nIGdvb2QnLGZ1bmN0aW9uKCl7XG5cbiAgdmFyIGNvdW50ICA9IDAsXG4gICAgICBub2Jvb2wgPSBURVNULkFQSS5jb25jYXQoVEVTVC5pbnB1dHMpXG4gICAgICAgICAgICAgICAgICAgICAgIC5jb25jYXQoVEVTVC5hdWR2aWQpXG4gICAgICAgICAgICAgICAgICAgICAgIC5jb25jYXQoVEVTVC5wcml2YXRlcylcbiAgICAgICAgICAgICAgICAgICAgICAgLmNvbmNhdChbJ3RleHRhcmVhJ10pOyAvLyBkdWUgdG8gZm9ybXMtcGxhY2Vob2xkZXIuanMgdGVzdFxuXG4gIGZvciAodmFyIHByb3AgaW4gd2luZG93Lk1vZGVybml6cil7XG4gICAgaWYgKE1vZGVybml6ci5oYXNPd25Qcm9wZXJ0eShwcm9wKSl7XG5cbiAgICAgIGlmIChURVNULmluQXJyYXkocHJvcCxub2Jvb2wpID49IDApIGNvbnRpbnVlO1xuXG4gICAgICBvayhNb2Rlcm5penJbcHJvcF0gPT09IHRydWUgfHwgTW9kZXJuaXpyW3Byb3BdID09PSBmYWxzZSxcbiAgICAgICAgJ01vZGVybml6ci4nK3Byb3ArJyBpcyBhIHN0cmFpZ2h0IHVwIGJvb2xlYW4nKTtcblxuXG4gICAgICBlcXVhbChwcm9wLHByb3AudG9Mb3dlckNhc2UoKSwnYWxsIHByb3BlcnRpZXMgYXJlIGxvd2VyQ2FzZS4nKVxuICAgIH1cbiAgfVxufSlcblxuXG5cbnRlc3QoJ01vZGVybml6ci5hdWRpbyBhbmQgTW9kZXJuaXpyLnZpZGVvJyxmdW5jdGlvbigpe1xuXG4gIGZvciAodmFyIGkgPSAtMSwgbGVuID0gVEVTVC5hdWR2aWQubGVuZ3RoOyArK2kgPCBsZW47KXtcbiAgICB2YXIgcHJvcCA9IFRFU1QuYXVkdmlkW2ldO1xuXG4gICAgaWYgKE1vZGVybml6cltwcm9wXS50b1N0cmluZygpID09ICd0cnVlJyl7XG5cbiAgICAgIG9rKE1vZGVybml6cltwcm9wXSwgICAgICAgICAgICAgICAgICAgICAgICAgICAgICdNb2Rlcm5penIuJytwcm9wKycgaXMgdHJ1dGh5LicpO1xuICAgICAgZXF1YWwoTW9kZXJuaXpyW3Byb3BdID09IHRydWUsdHJ1ZSwgICAgICAgICAgICAnTW9kZXJuaXpyLicrcHJvcCsnIGlzID09IHRydWUnKVxuICAgICAgZXF1YWwodHlwZW9mIE1vZGVybml6cltwcm9wXSA9PT0gJ29iamVjdCcsdHJ1ZSwnTW9kZXJpenIuJytwcm9wKycgaXMgdHJ1bHkgYW4gb2JqZWN0Jyk7XG4gICAgICBlcXVhbChNb2Rlcm5penJbcHJvcF0gIT09IHRydWUsdHJ1ZSwgICAgICAgICAgICdNb2Rlcm5penIuJytwcm9wKycgaXMgIT09IHRydWUnKVxuXG4gICAgfSBlbHNlIHtcblxuICAgICAgZXF1YWwoTW9kZXJuaXpyW3Byb3BdICE9IHRydWUsdHJ1ZSwgICAgICAgICAgICAnTW9kZXJuaXpyLicrcHJvcCsnIGlzICE9IHRydWUnKVxuICAgIH1cbiAgfVxuXG5cbn0pO1xuXG5cbnRlc3QoJ01vZGVybml6ciByZXN1bHRzIG1hdGNoIGV4cGVjdGVkIHZhbHVlcycsZnVuY3Rpb24oKXtcblxuICAvLyBpJ20gYnJpbmdpbmcgb3ZlciBhIGZldyB0ZXN0cyBmcm9tIGluc2lkZSBNb2Rlcm5penIuanNcbiAgZXF1YWwoISFkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdjYW52YXMnKS5nZXRDb250ZXh0LE1vZGVybml6ci5jYW52YXMsJ2NhbnZhcyB0ZXN0IGNvbnNpc3RlbnQnKTtcblxuICBlcXVhbCghIXdpbmRvdy5Xb3JrZXIsTW9kZXJuaXpyLndlYndvcmtlcnMsJ3dlYiB3b3JrZXJzIHRlc3QgY29uc2lzdGVudCcpXG5cbn0pO1xuXG5cblxubW9kdWxlKCdNb2Rlcm5penJcXCdzIEFQSSBtZXRob2RzJywge1xuICAgIHNldHVwOmZ1bmN0aW9uKCkge1xuICAgIH0sXG4gICAgdGVhcmRvd246ZnVuY3Rpb24oKSB7XG4gICAgfVxufSk7XG5cbnRlc3QoJ01vZGVybml6ci5hZGRUZXN0KCknLDIyLGZ1bmN0aW9uKCl7XG5cbiAgdmFyIGRvY0VsID0gZG9jdW1lbnQuZG9jdW1lbnRFbGVtZW50O1xuXG5cbiAgTW9kZXJuaXpyLmFkZFRlc3QoJ3Rlc3R0cnVlJyxmdW5jdGlvbigpe1xuICAgIHJldHVybiB0cnVlO1xuICB9KTtcblxuICBNb2Rlcm5penIuYWRkVGVzdCgndGVzdHRydXRoeScsZnVuY3Rpb24oKXtcbiAgICByZXR1cm4gMTAwO1xuICB9KTtcblxuICBNb2Rlcm5penIuYWRkVGVzdCgndGVzdGZhbHNlJyxmdW5jdGlvbigpe1xuICAgIHJldHVybiBmYWxzZTtcbiAgfSk7XG5cbiAgTW9kZXJuaXpyLmFkZFRlc3QoJ3Rlc3RmYWxzeScsZnVuY3Rpb24oKXtcbiAgICByZXR1cm4gdW5kZWZpbmVkO1xuICB9KTtcblxuICBvayhkb2NFbC5jbGFzc05hbWUuaW5kZXhPZignIHRlc3R0cnVlJykgPj0gMCwncG9zaXRpdmUgY2xhc3MgYWRkZWQnKTtcbiAgZXF1YWwoTW9kZXJuaXpyLnRlc3R0cnVlLHRydWUsJ3Bvc2l0aXZlIHByb3AgYWRkZWQnKTtcblxuICBvayhkb2NFbC5jbGFzc05hbWUuaW5kZXhPZignIHRlc3R0cnV0aHknKSA+PSAwLCdwb3NpdGl2ZSBjbGFzcyBhZGRlZCcpO1xuICBlcXVhbChNb2Rlcm5penIudGVzdHRydXRoeSwxMDAsJ3RydXRoeSB2YWx1ZSBpcyBub3QgY2FzdGVkIHRvIHN0cmFpZ2h0IGJvb2xlYW4nKTtcblxuICBvayhkb2NFbC5jbGFzc05hbWUuaW5kZXhPZignIG5vLXRlc3RmYWxzZScpID49IDAsJ25lZ2F0aXZlIGNsYXNzIGFkZGVkJyk7XG4gIGVxdWFsKE1vZGVybml6ci50ZXN0ZmFsc2UsZmFsc2UsJ25lZ2F0aXZlIHByb3AgYWRkZWQnKTtcblxuICBvayhkb2NFbC5jbGFzc05hbWUuaW5kZXhPZignIG5vLXRlc3RmYWxzeScpID49IDAsJ25lZ2F0aXZlIGNsYXNzIGFkZGVkJyk7XG4gIGVxdWFsKE1vZGVybml6ci50ZXN0ZmFsc3ksdW5kZWZpbmVkLCdmYWxzeSB2YWx1ZSBpcyBub3QgY2FzdGVkIHRvIHN0cmFpZ2h0IGJvb2xlYW4nKTtcblxuXG5cbiAgTW9kZXJuaXpyLmFkZFRlc3QoJ3Rlc3RjYW1lbENhc2UnLGZ1bmN0aW9uKCl7XG4gICAgIHJldHVybiB0cnVlO1xuICAgfSk7XG5cbiAgb2soZG9jRWwuY2xhc3NOYW1lLmluZGV4T2YoJyB0ZXN0Y2FtZWxDYXNlJykgPT09IC0xLFxuICAgICAnY2FtZWxDYXNlIHRlc3QgbmFtZSB0b0xvd2VyQ2FzZSgpXFwnZCcpO1xuXG5cbiAgLy8gb2theSBuZXcgc2lnbmF0dXJlIGZvciB0aGlzIEFQSSEgd29vXG5cbiAgTW9kZXJuaXpyLmFkZFRlc3QoJ3Rlc3Rib29sZmFsc2UnLCBmYWxzZSk7XG5cbiAgb2sofmRvY0VsLmNsYXNzTmFtZS5pbmRleE9mKCcgbm8tdGVzdGJvb2xmYWxzZScpLCAnTW9kZXJuaXpyLmFkZFRlc3QoZmVhdHVyZSwgYm9vbCk6IG5lZ2F0aXZlIGNsYXNzIGFkZGVkJyk7XG4gIGVxdWFsKE1vZGVybml6ci50ZXN0Ym9vbGZhbHNlLCBmYWxzZSwgJ01vZGVybml6ci5hZGRUZXN0KGZlYXR1cmUsIGJvb2wpOiBuZWdhdGl2ZSBwcm9wIGFkZGVkJyk7XG5cblxuXG4gIE1vZGVybml6ci5hZGRUZXN0KCd0ZXN0Ym9vbHRydWUnLCB0cnVlKTtcblxuICBvayh+ZG9jRWwuY2xhc3NOYW1lLmluZGV4T2YoJyB0ZXN0Ym9vbHRydWUnKSwgJ01vZGVybml6ci5hZGRUZXN0KGZlYXR1cmUsIGJvb2wpOiBwb3NpdGl2ZSBjbGFzcyBhZGRlZCcpO1xuICBlcXVhbChNb2Rlcm5penIudGVzdGJvb2x0cnVlLCB0cnVlLCAnTW9kZXJuaXpyLmFkZFRlc3QoZmVhdHVyZSwgYm9vbCk6IHBvc2l0aXZlIHByb3AgYWRkZWQnKTtcblxuXG5cbiAgTW9kZXJuaXpyLmFkZFRlc3Qoeyd0ZXN0b2JqYm9vbGZhbHNlJzogZmFsc2UsXG4gICAgICAgICAgICAgICAgICAgICAndGVzdG9iamJvb2x0cnVlJyA6IHRydWUgICB9KTtcblxuICBvayh+ZG9jRWwuY2xhc3NOYW1lLmluZGV4T2YoJyBuby10ZXN0b2JqYm9vbGZhbHNlJyksICdNb2Rlcm5penIuYWRkVGVzdCh7ZmVhdHVyZTogYm9vbH0pOiBuZWdhdGl2ZSBjbGFzcyBhZGRlZCcpO1xuICBlcXVhbChNb2Rlcm5penIudGVzdG9iamJvb2xmYWxzZSwgZmFsc2UsICdNb2Rlcm5penIuYWRkVGVzdCh7ZmVhdHVyZTogYm9vbH0pOiBuZWdhdGl2ZSBwcm9wIGFkZGVkJyk7XG5cbiAgb2sofmRvY0VsLmNsYXNzTmFtZS5pbmRleE9mKCcgdGVzdG9iamJvb2x0cnVlJyksICdNb2Rlcm5penIuYWRkVGVzdCh7ZmVhdHVyZTogYm9vbH0pOiBwb3NpdGl2ZSBjbGFzcyBhZGRlZCcpO1xuICBlcXVhbChNb2Rlcm5penIudGVzdG9iamJvb2x0cnVlLCB0cnVlLCAnTW9kZXJuaXpyLmFkZFRlc3Qoe2ZlYXR1cmU6IGJvb2x9KTogcG9zaXRpdmUgcHJvcCBhZGRlZCcpO1xuXG5cblxuXG4gIE1vZGVybml6ci5hZGRUZXN0KHsndGVzdG9iamZuZmFsc2UnOiBmdW5jdGlvbigpeyByZXR1cm4gZmFsc2UgfSxcbiAgICAgICAgICAgICAgICAgICAgICd0ZXN0b2JqZm50cnVlJyA6IGZ1bmN0aW9uKCl7IHJldHVybiB0cnVlIH0gICB9KTtcblxuXG4gIG9rKH5kb2NFbC5jbGFzc05hbWUuaW5kZXhPZignIG5vLXRlc3RvYmpmbmZhbHNlJyksICdNb2Rlcm5penIuYWRkVGVzdCh7ZmVhdHVyZTogYm9vbH0pOiBuZWdhdGl2ZSBjbGFzcyBhZGRlZCcpO1xuICBlcXVhbChNb2Rlcm5penIudGVzdG9iamZuZmFsc2UsIGZhbHNlLCAnTW9kZXJuaXpyLmFkZFRlc3Qoe2ZlYXR1cmU6IGJvb2x9KTogbmVnYXRpdmUgcHJvcCBhZGRlZCcpO1xuXG4gIG9rKH5kb2NFbC5jbGFzc05hbWUuaW5kZXhPZignIHRlc3RvYmpmbnRydWUnKSwgJ01vZGVybml6ci5hZGRUZXN0KHtmZWF0dXJlOiBib29sfSk6IHBvc2l0aXZlIGNsYXNzIGFkZGVkJyk7XG4gIGVxdWFsKE1vZGVybml6ci50ZXN0b2JqZm50cnVlLCB0cnVlLCAnTW9kZXJuaXpyLmFkZFRlc3Qoe2ZlYXR1cmU6IGJvb2x9KTogcG9zaXRpdmUgcHJvcCBhZGRlZCcpO1xuXG5cbiAgTW9kZXJuaXpyXG4gICAgLmFkZFRlc3QoJ3Rlc3RjaGFpbm9uZScsIHRydWUpXG4gICAgLmFkZFRlc3QoeyB0ZXN0Y2hhaW50d286IHRydWUgfSlcbiAgICAuYWRkVGVzdCgndGVzdGNoYWludGhyZWUnLCBmdW5jdGlvbigpeyByZXR1cm4gdHJ1ZTsgfSk7XG5cbiAgb2soIE1vZGVybml6ci50ZXN0Y2hhaW5vbmUgPT0gTW9kZXJuaXpyLnRlc3RjaGFpbnR3byA9PSBNb2Rlcm5penIudGVzdGNoYWludGhyZWUsICdhZGRUZXN0IGlzIGNoYWluYWJsZScpO1xuXG5cbn0pOyAvLyBlbyBhZGRUZXN0XG5cblxuXG5cblxudGVzdCgnTW9kZXJuaXpyLm1xOiBtZWRpYSBxdWVyeSB0ZXN0aW5nJyxmdW5jdGlvbigpe1xuXG4gIHZhciAkaHRtbCA9ICQoJ2h0bWwnKTtcbiAgJC5tb2JpbGUgPSB7fTtcblxuICAvLyBmcm9tIGpxdWVyeSBtb2JpbGVcblxuICAkLm1vYmlsZS5tZWRpYSA9IChmdW5jdGlvbigpIHtcbiAgXHQvLyBUT0RPOiB1c2Ugd2luZG93Lm1hdGNoTWVkaWEgb25jZSBhdCBsZWFzdCBvbmUgVUEgaW1wbGVtZW50cyBpdFxuICBcdHZhciBjYWNoZSA9IHt9LFxuICBcdFx0dGVzdERpdiA9ICQoIFwiPGRpdiBpZD0nanF1ZXJ5LW1lZGlhdGVzdCc+XCIgKSxcbiAgXHRcdGZha2VCb2R5ID0gJCggXCI8Ym9keT5cIiApLmFwcGVuZCggdGVzdERpdiApO1xuXG4gIFx0cmV0dXJuIGZ1bmN0aW9uKCBxdWVyeSApIHtcbiAgXHRcdGlmICggISggcXVlcnkgaW4gY2FjaGUgKSApIHtcbiAgXHRcdFx0dmFyIHN0eWxlQmxvY2sgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdzdHlsZScpLFxuICAgICAgICAgIFx0XHRjc3NydWxlID0gXCJAbWVkaWEgXCIgKyBxdWVyeSArIFwiIHsgI2pxdWVyeS1tZWRpYXRlc3QgeyBwb3NpdGlvbjphYnNvbHV0ZTsgfSB9XCI7XG4gIFx0ICAgICAgICAvL211c3Qgc2V0IHR5cGUgZm9yIElFIVxuICBcdCAgICAgICAgc3R5bGVCbG9jay50eXBlID0gXCJ0ZXh0L2Nzc1wiO1xuICBcdCAgICAgICAgaWYgKHN0eWxlQmxvY2suc3R5bGVTaGVldCl7XG4gIFx0ICAgICAgICAgIHN0eWxlQmxvY2suc3R5bGVTaGVldC5jc3NUZXh0ID0gY3NzcnVsZTtcbiAgXHQgICAgICAgIH1cbiAgXHQgICAgICAgIGVsc2Uge1xuICBcdCAgICAgICAgICBzdHlsZUJsb2NrLmFwcGVuZENoaWxkKGRvY3VtZW50LmNyZWF0ZVRleHROb2RlKGNzc3J1bGUpKTtcbiAgXHQgICAgICAgIH1cblxuICBcdFx0XHQkaHRtbC5wcmVwZW5kKCBmYWtlQm9keSApLnByZXBlbmQoIHN0eWxlQmxvY2sgKTtcbiAgXHRcdFx0Y2FjaGVbIHF1ZXJ5IF0gPSB0ZXN0RGl2LmNzcyggXCJwb3NpdGlvblwiICkgPT09IFwiYWJzb2x1dGVcIjtcbiAgXHRcdFx0ZmFrZUJvZHkuYWRkKCBzdHlsZUJsb2NrICkucmVtb3ZlKCk7XG4gIFx0XHR9XG4gIFx0XHRyZXR1cm4gY2FjaGVbIHF1ZXJ5IF07XG4gIFx0fTtcbiAgfSkoKTtcblxuXG4gIG9rKE1vZGVybml6ci5tcSwnTW9kZXJuaXpyLm1xKCkgZG9lc25cXCcgZnJlYWsgb3V0LicpO1xuXG4gIGVxdWFsKCQubW9iaWxlLm1lZGlhKCdvbmx5IHNjcmVlbicpLCBNb2Rlcm5penIubXEoJ29ubHkgc2NyZWVuJyksJ3NjcmVlbiBtZWRpYSBxdWVyeSBtYXRjaGVzIGpRdWVyeSBtb2JpbGVcXCdzIHJlc3VsdCcpO1xuXG4gIGVxdWFsKE1vZGVybml6ci5tcSgnb25seSBhbGwnKSwgTW9kZXJuaXpyLm1xKCdvbmx5IGFsbCcpLCAnQ2FjaGUgaGl0IG1hdGNoZXMnKTtcblxuXG59KTtcblxuXG5cblxudGVzdCgnTW9kZXJuaXpyLmhhc0V2ZW50KCknLGZ1bmN0aW9uKCl7XG5cbiAgb2sodHlwZW9mIE1vZGVybml6ci5oYXNFdmVudCA9PSAnZnVuY3Rpb24nLCdNb2Rlcm5penIuaGFzRXZlbnQoKSBpcyBhIGZ1bmN0aW9uJyk7XG5cblxuICBlcXVhbChNb2Rlcm5penIuaGFzRXZlbnQoJ2NsaWNrJyksIHRydWUsJ2NsaWNrIGV2ZW50IGlzIHN1cHBvcnRlZCcpO1xuXG4gIGVxdWFsKE1vZGVybml6ci5oYXNFdmVudCgnbW9kZXJuaXpyY3VzdG9tZXZlbnQnKSwgZmFsc2UsJ3JhbmRvbSBldmVudCBpcyBkZWZpbml0ZWx5IG5vdCBzdXBwb3J0ZWQnKTtcblxuICAvKiB3b3JrcyBmaW5lIGluIHdlYmtpdCBidXQgbm90IGdlY2tvXG4gIGVxdWFsKCAgTW9kZXJuaXpyLmhhc0V2ZW50KCdyZXNpemUnLCB3aW5kb3cpLFxuICAgICAgICAgICFNb2Rlcm5penIuaGFzRXZlbnQoJ3Jlc2l6ZScsIGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpKSxcbiAgICAgICAgICAnUmVzaXplIGlzIHN1cHBvcnRlZCBpbiB3aW5kb3cgYnV0IG5vdCBhIGRpdiwgdHlwaWNhbGx5Li4uJyk7XG4gICovXG5cbn0pO1xuXG5cblxuXG5cbnRlc3QoJ01vZGVybml6ci50ZXN0U3R5bGVzKCknLGZ1bmN0aW9uKCl7XG5cbiAgZXF1YWwodHlwZW9mIE1vZGVybml6ci50ZXN0U3R5bGVzLCAnZnVuY3Rpb24nLCdNb2Rlcm5penIudGVzdFN0eWxlcygpIGlzIGEgZnVuY3Rpb24nKTtcblxuICB2YXIgc3R5bGUgPSAnI21vZGVybml6cnsgd2lkdGg6IDlweDsgaGVpZ2h0OiA0cHg7IGZvbnQtc2l6ZTogMDsgY29sb3I6IHBhcGF5YXdoaXA7IH0nO1xuXG4gIE1vZGVybml6ci50ZXN0U3R5bGVzKHN0eWxlLCBmdW5jdGlvbihlbGVtLCBydWxlKXtcbiAgICAgIGVxdWFsKHN0eWxlLCBydWxlLCAncnVsZSBwYXNzc2VkIGJhY2sgbWF0Y2hlcyB3aGF0IGkgZ2F2ZSBpdC4nKVxuICAgICAgZXF1YWwoZWxlbS5vZmZzZXRXaWR0aCwgOSwgJ3dpZHRoIHdhcyBzZXQgdGhyb3VnaCB0aGUgc3R5bGUnKTtcbiAgICAgIGVxdWFsKGVsZW0ub2Zmc2V0SGVpZ2h0LCA0LCAnaGVpZ2h0IHdhcyBzZXQgdGhyb3VnaCB0aGUgc3R5bGUnKTtcbiAgICAgIGVxdWFsKGVsZW0uaWQsICdtb2Rlcm5penInLCAnZWxlbWVudCBpcyBpbmRlZWQgdGhlIG1vZGVybml6ciBlbGVtZW50Jyk7XG4gIH0pO1xuXG59KTtcblxuXG50ZXN0KCdNb2Rlcm5penIuX1twcm9wZXJ0aWVzXScsZnVuY3Rpb24oKXtcblxuICBlcXVhbCg2LCBNb2Rlcm5penIuX3ByZWZpeGVzLmxlbmd0aCwgJ01vZGVybml6ci5fcHJlZml4ZXMgaGFzIDYgaXRlbXMnKTtcblxuICBlcXVhbCg0LCBNb2Rlcm5penIuX2RvbVByZWZpeGVzLmxlbmd0aCwgJ01vZGVybml6ci5kb21QcmVmaXhlcyBoYXMgNCBpdGVtcycpO1xuXG59KTtcblxudGVzdCgnTW9kZXJuaXpyLnRlc3RQcm9wKCknLGZ1bmN0aW9uKCl7XG5cbiAgZXF1YWwodHJ1ZSwgTW9kZXJuaXpyLnRlc3RQcm9wKCdtYXJnaW4nKSwgJ0V2ZXJ5b25lIHN1cHBvcnRzIG1hcmdpbicpO1xuXG4gIGVxdWFsKGZhbHNlLCBNb2Rlcm5penIudGVzdFByb3AoJ2hhcHBpbmVzcycpLCAnTm9ib2R5IHN1cHBvcnRzIHRoZSBoYXBwaW5lc3Mgc3R5bGUuIDooJyk7XG4gIGVxdWFsKHRydWUsIE1vZGVybml6ci50ZXN0UHJvcCgnZm9udFNpemUnKSwgJ0V2ZXJ5b25lIHN1cHBvcnRzIGZvbnRTaXplJyk7XG4gIGVxdWFsKGZhbHNlLCBNb2Rlcm5penIudGVzdFByb3AoJ2ZvbnQtc2l6ZScpLCAnTm9ib2R5IHN1cHBvcnRzIGZvbnQtc2l6ZScpO1xuXG4gIGVxdWFsKCdwb2ludGVyRXZlbnRzJyBpbiAgZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jykuc3R5bGUsXG4gICAgICAgICBNb2Rlcm5penIudGVzdFByb3AoJ3BvaW50ZXJFdmVudHMnKSxcbiAgICAgICAgICdyZXN1bHRzIGZvciBgcG9pbnRlci1ldmVudHNgIGFyZSBjb25zaXN0ZW50IHdpdGggYSBob21lZ3Jvd24gZmVhdHVyZSB0ZXN0Jyk7XG5cbn0pO1xuXG5cblxudGVzdCgnTW9kZXJuaXpyLnRlc3RBbGxQcm9wcygpJyxmdW5jdGlvbigpe1xuXG4gIGVxdWFsKHRydWUsIE1vZGVybml6ci50ZXN0QWxsUHJvcHMoJ21hcmdpbicpLCAnRXZlcnlvbmUgc3VwcG9ydHMgbWFyZ2luJyk7XG5cbiAgZXF1YWwoZmFsc2UsIE1vZGVybml6ci50ZXN0QWxsUHJvcHMoJ2hhcHBpbmVzcycpLCAnTm9ib2R5IHN1cHBvcnRzIHRoZSBoYXBwaW5lc3Mgc3R5bGUuIDooJyk7XG4gIGVxdWFsKHRydWUsIE1vZGVybml6ci50ZXN0QWxsUHJvcHMoJ2ZvbnRTaXplJyksICdFdmVyeW9uZSBzdXBwb3J0cyBmb250U2l6ZScpO1xuICBlcXVhbChmYWxzZSwgTW9kZXJuaXpyLnRlc3RBbGxQcm9wcygnZm9udC1zaXplJyksICdOb2JvZHkgc3VwcG9ydHMgZm9udC1zaXplJyk7XG5cbiAgZXF1YWwoTW9kZXJuaXpyLmNzc3RyYW5zaXRpb25zLCBNb2Rlcm5penIudGVzdEFsbFByb3BzKCd0cmFuc2l0aW9uJyksICdNb2Rlcm5penIgcmVzdWx0IG1hdGNoZXMgQVBJIHJlc3VsdDogY3NzdHJhbnNpdGlvbnMnKTtcblxuICBlcXVhbChNb2Rlcm5penIuY3NzY29sdW1ucywgTW9kZXJuaXpyLnRlc3RBbGxQcm9wcygnY29sdW1uQ291bnQnKSwgJ01vZGVybml6ciByZXN1bHQgbWF0Y2hlcyBBUEkgcmVzdWx0OiBjc3Njb2x1bW5zJylcblxufSk7XG5cblxuXG5cblxuXG50ZXN0KCdNb2Rlcm5penIucHJlZml4ZWQoKSAtIGNzcyBhbmQgRE9NIHJlc29sdmluZycsIGZ1bmN0aW9uKCl7XG4gIC8vIGh0dHBzOi8vZ2lzdC5naXRodWIuY29tLzUyMzY5MlxuXG4gIGZ1bmN0aW9uIGdpbW1lUHJlZml4KHByb3AsIG9iail7XG4gICAgdmFyIHByZWZpeGVzID0gWydNb3onLCdLaHRtbCcsJ1dlYmtpdCcsJ08nLCdtcyddLFxuICAgICAgICBkb21QcmVmaXhlcyA9IFsnbW96Jywna2h0bWwnLCd3ZWJraXQnLCdvJywnbXMnXSxcbiAgICAgICAgZWxlbSAgICAgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKSxcbiAgICAgICAgdXBwZXIgICAgPSBwcm9wLmNoYXJBdCgwKS50b1VwcGVyQ2FzZSgpICsgcHJvcC5zbGljZSgxKTtcblxuICAgIGlmKCFvYmopIHtcbiAgICAgIGlmIChwcm9wIGluIGVsZW0uc3R5bGUpXG4gICAgICAgIHJldHVybiBwcm9wO1xuXG4gICAgICBmb3IgKHZhciBsZW4gPSBwcmVmaXhlcy5sZW5ndGg7IGxlbi0tOyApe1xuICAgICAgICBpZiAoKHByZWZpeGVzW2xlbl0gKyB1cHBlcikgIGluIGVsZW0uc3R5bGUpXG4gICAgICAgICAgcmV0dXJuIChwcmVmaXhlc1tsZW5dICsgdXBwZXIpO1xuICAgICAgfVxuICAgIH0gZWxzZSB7XG4gICAgICBpZiAocHJvcCBpbiBvYmopXG4gICAgICAgIHJldHVybiBwcm9wO1xuXG4gICAgICBmb3IgKHZhciBsZW4gPSBkb21QcmVmaXhlcy5sZW5ndGg7IGxlbi0tOyApe1xuICAgICAgICBpZiAoKGRvbVByZWZpeGVzW2xlbl0gKyB1cHBlcikgIGluIG9iailcbiAgICAgICAgICByZXR1cm4gKGRvbVByZWZpeGVzW2xlbl0gKyB1cHBlcik7XG4gICAgICB9XG4gICAgfVxuXG5cbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cblxuICB2YXIgcHJvcEFyciA9IFsndHJhbnNpdGlvbicsICdiYWNrZ3JvdW5kU2l6ZScsICdib3hTaXppbmcnLCAnYm9yZGVySW1hZ2UnLFxuICAgICAgICAgICAgICAgICAnYm9yZGVyUmFkaXVzJywgJ2JveFNoYWRvdycsICdjb2x1bW5Db3VudCddO1xuXG4gIHZhciBkb21Qcm9wQXJyID0gW3sgJ3Byb3AnOiAncmVxdWVzdEFuaW1hdGlvbkZyYW1lJywgICdvYmonOiB3aW5kb3cgfSxcbiAgICAgICAgICAgICAgICAgICAgeyAncHJvcCc6ICdxdWVyeVNlbGVjdG9yQWxsJywgICAgICAgJ29iaic6IGRvY3VtZW50IH0sXG4gICAgICAgICAgICAgICAgICAgIHsgJ3Byb3AnOiAnbWF0Y2hlc1NlbGVjdG9yJywgICAgICAgICdvYmonOiBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKSB9XTtcblxuICBmb3IgKHZhciBpID0gLTEsIGxlbiA9IHByb3BBcnIubGVuZ3RoOyArK2kgPCBsZW47ICl7XG4gICAgdmFyIHByb3AgPSBwcm9wQXJyW2ldO1xuICAgIGVxdWFsKE1vZGVybml6ci5wcmVmaXhlZChwcm9wKSwgZ2ltbWVQcmVmaXgocHJvcCksICdyZXN1bHRzIGZvciAnICsgcHJvcCArICcgbWF0Y2ggdGhlIGhvbWViYWtlZCBwcmVmaXggZmluZGVyJyk7XG4gIH1cblxuICBmb3IgKHZhciBpID0gLTEsIGxlbiA9IGRvbVByb3BBcnIubGVuZ3RoOyArK2kgPCBsZW47ICl7XG4gICAgdmFyIHByb3AgPSBkb21Qcm9wQXJyW2ldO1xuICAgIG9rKCEhfk1vZGVybml6ci5wcmVmaXhlZChwcm9wLnByb3AsIHByb3Aub2JqLCBmYWxzZSkudG9TdHJpbmcoKS5pbmRleE9mKGdpbW1lUHJlZml4KHByb3AucHJvcCwgcHJvcC5vYmopKSwgJ3Jlc3VsdHMgZm9yICcgKyBwcm9wLnByb3AgKyAnIG1hdGNoIHRoZSBob21lYmFrZWQgcHJlZml4IGZpbmRlcicpO1xuICB9XG5cblxuXG5cbn0pO1xuXG5cbi8vIEZJWE1FOiBzbyBhIGZldyBvZiB0aGVzZSBhcmUgd2hpdGVsaXN0aW5nIGZvciB3ZWJraXQuIGknZCBsaWtlIHRvIGltcHJvdmUgdGhhdC5cbnRlc3QoJ01vZGVybml6ci5wcmVmaXhlZCBhdXRvYmluZCcsIGZ1bmN0aW9uKCl7XG5cbiAgdmFyIHJBRk5hbWU7XG5cbiAgLy8gcXVpY2sgc25pZmYgdG8gZmluZCB0aGUgbG9jYWwgckFGIHByZWZpeGVkIG5hbWUuXG4gIHZhciB2ZW5kb3JzID0gWydtcycsICdtb3onLCAnd2Via2l0JywgJ28nXTtcbiAgZm9yKHZhciB4ID0gMDsgeCA8IHZlbmRvcnMubGVuZ3RoICYmICFyQUZOYW1lOyArK3gpIHtcbiAgICByQUZOYW1lID0gd2luZG93W3ZlbmRvcnNbeF0rJ1JlcXVlc3RBbmltYXRpb25GcmFtZSddICYmIHZlbmRvcnNbeF0rJ1JlcXVlc3RBbmltYXRpb25GcmFtZSc7XG4gIH1cblxuICBpZiAockFGTmFtZSl7XG4gICAgLy8gckFGIHJldHVybnMgYSBmdW5jdGlvblxuICAgIGVxdWFsKFxuICAgICAgJ2Z1bmN0aW9uJyxcbiAgICAgIHR5cGVvZiBNb2Rlcm5penIucHJlZml4ZWQoJ3JlcXVlc3RBbmltYXRpb25GcmFtZScsIHdpbmRvdyksXG4gICAgICBcIk1vZGVybml6ci5wcmVmaXhlZCgncmVxdWVzdEFuaW1hdGlvbkZyYW1lJywgd2luZG93KSByZXR1cm5zIGEgZnVuY3Rpb25cIilcblxuICAgIC8vIHVubGVzcyB3ZSBmYWxzZSBpdCB0byBhIHN0cmluZ1xuICAgIGVxdWFsKFxuICAgICAgckFGTmFtZSxcbiAgICAgIE1vZGVybml6ci5wcmVmaXhlZCgncmVxdWVzdEFuaW1hdGlvbkZyYW1lJywgd2luZG93LCBmYWxzZSksXG4gICAgICBcIk1vZGVybml6ci5wcmVmaXhlZCgncmVxdWVzdEFuaW1hdGlvbkZyYW1lJywgd2luZG93LCBmYWxzZSkgcmV0dXJucyBhIHN0cmluZyAodGhlIHByb3AgbmFtZSlcIilcblxuICB9XG5cbiAgaWYgKGRvY3VtZW50LmJvZHkud2Via2l0TWF0Y2hlc1NlbGVjdG9yIHx8IGRvY3VtZW50LmJvZHkubW96TWF0Y2hlc1NlbGVjdG9yKXtcblxuICAgIHZhciBmbiA9IE1vZGVybml6ci5wcmVmaXhlZCgnbWF0Y2hlc1NlbGVjdG9yJywgSFRNTEVsZW1lbnQucHJvdG90eXBlLCBkb2N1bWVudC5ib2R5KTtcblxuICAgIC8vcmV0dXJucyBmdW5jdGlvblxuICAgIGVxdWFsKFxuICAgICAgJ2Z1bmN0aW9uJyxcbiAgICAgIHR5cGVvZiBmbixcbiAgICAgIFwiTW9kZXJuaXpyLnByZWZpeGVkKCdtYXRjaGVzU2VsZWN0b3InLCBIVE1MRWxlbWVudC5wcm90b3R5cGUsIGRvY3VtZW50LmJvZHkpIHJldHVybnMgYSBmdW5jdGlvblwiKTtcblxuICAgICAgLy8gZm4gc2NvcGluZ1xuICAgIGVxdWFsKFxuICAgICAgdHJ1ZSxcbiAgICAgIGZuKCdib2R5JyksXG4gICAgICBcIk1vZGVybml6ci5wcmVmaXhlZCgnbWF0Y2hlc1NlbGVjdG9yJywgSFRNTEVsZW1lbnQucHJvdG90eXBlLCBkb2N1bWVudC5ib2R5KSBpcyBzY29wZWQgdG8gdGhlIGJvZHlcIilcblxuICB9XG5cbiAgLy8gV2Via2l0IG9ubHk6IGFyZSB0aGVyZSBvdGhlciBvYmplY3RzIHRoYXQgYXJlIHByZWZpeGVkP1xuICBpZiAod2luZG93LndlYmtpdE5vdGlmaWNhdGlvbnMpe1xuICAgIC8vIHNob3VsZCBiZSBhbiBvYmplY3QuXG5cbiAgICBlcXVhbChcbiAgICAgICdvYmplY3QnLFxuICAgICAgdHlwZW9mIE1vZGVybml6ci5wcmVmaXhlZCgnTm90aWZpY2F0aW9ucycsIHdpbmRvdyksXG4gICAgICBcIk1vZGVybml6ci5wcmVmaXhlZCgnTm90aWZpY2F0aW9ucycpIHJldHVybnMgYW4gb2JqZWN0XCIpO1xuXG4gIH1cblxuICAvLyBXZWJraXQgb25seTpcbiAgaWYgKHR5cGVvZiBkb2N1bWVudC53ZWJraXRJc0Z1bGxTY3JlZW4gIT09ICd1bmRlZmluZWQnKXtcbiAgICAvLyBib29sZWFuXG5cbiAgICBlcXVhbChcbiAgICAgICdib29sZWFuJyxcbiAgICAgIHR5cGVvZiBNb2Rlcm5penIucHJlZml4ZWQoJ2lzRnVsbFNjcmVlbicsIGRvY3VtZW50KSxcbiAgICAgIFwiTW9kZXJuaXpyLnByZWZpeGVkKCdpc0Z1bGxTY3JlZW4nKSByZXR1cm5zIGEgYm9vbGVhblwiKTtcbiAgfVxuXG5cblxuICAvLyBNb3ogb25seTpcbiAgaWYgKHR5cGVvZiBkb2N1bWVudC5tb3pGdWxsU2NyZWVuICE9PSAndW5kZWZpbmVkJyl7XG4gICAgLy8gYm9vbGVhblxuXG4gICAgZXF1YWwoXG4gICAgICAnYm9vbGVhbicsXG4gICAgICB0eXBlb2YgTW9kZXJuaXpyLnByZWZpeGVkKCdmdWxsU2NyZWVuJywgZG9jdW1lbnQpLFxuICAgICAgXCJNb2Rlcm5penIucHJlZml4ZWQoJ2Z1bGxTY3JlZW4nKSByZXR1cm5zIGEgYm9vbGVhblwiKTtcbiAgfVxuXG5cbiAgLy8gV2Via2l0LW9ubHkuLiB0YWtlcyBhZHZhbnRhZ2Ugb2YgV2Via2l0J3MgbWl4ZWQgY2FzZSBvZiBwcmVmaXhlc1xuICBpZiAoZG9jdW1lbnQuYm9keS5zdHlsZS5XZWJraXRBbmltYXRpb24pe1xuICAgIC8vIHN0cmluZ1xuXG4gICAgZXF1YWwoXG4gICAgICAnc3RyaW5nJyxcbiAgICAgIHR5cGVvZiBNb2Rlcm5penIucHJlZml4ZWQoJ2FuaW1hdGlvbicsIGRvY3VtZW50LmJvZHkuc3R5bGUpLFxuICAgICAgXCJNb2Rlcm5penIucHJlZml4ZWQoJ2FuaW1hdGlvbicsIGRvY3VtZW50LmJvZHkuc3R5bGUpIHJldHVybnMgdmFsdWUgb2YgdGhhdCwgYXMgYSBzdHJpbmdcIik7XG5cbiAgICBlcXVhbChcbiAgICAgIGFuaW1hdGlvblN0eWxlLnRvTG93ZXJDYXNlKCksXG4gICAgICBNb2Rlcm5penIucHJlZml4ZWQoJ2FuaW1hdGlvbicsIGRvY3VtZW50LmJvZHkuc3R5bGUsIGZhbHNlKS50b0xvd2VyQ2FzZSgpLFxuICAgICAgXCJNb2Rlcm5penIucHJlZml4ZWQoJ2FuaW1hdGlvbicsIGRvY3VtZW50LmJvZHkuc3R5bGUsIGZhbHNlKSByZXR1cm5zIHRoZSAoY2FzZS1ub3JtYWxpemVkKSBuYW1lIG9mIHRoZSBwcm9wZXJ0eTogd2Via2l0YW5pbWF0aW9uXCIpO1xuXG4gIH1cblxuICBlcXVhbChcbiAgICBmYWxzZSxcbiAgICBNb2Rlcm5penIucHJlZml4ZWQoJ2RvU29tZXRoaW5nQW1hemluZyQjJCcsIHdpbmRvdyksXG4gICAgXCJNb2Rlcm5penIucHJlZml4ZWQoJ2RvU29tZXRoaW5nQW1hemluZyQjJCcsIHdpbmRvdykgOiBHb2JibGVkeWdvb2sgd2l0aCBwcmVmaXhlZChzdHIsb2JqKSByZXR1cm5zIGZhbHNlXCIpO1xuXG4gIGVxdWFsKFxuICAgIGZhbHNlLFxuICAgIE1vZGVybml6ci5wcmVmaXhlZCgnZG9Tb21ldGhpbmdBbWF6aW5nJCMkJywgd2luZG93LCBkb2N1bWVudC5ib2R5KSxcbiAgICBcIk1vZGVybml6ci5wcmVmaXhlZCgnZG9Tb21ldGhpbmdBbWF6aW5nJCMkJywgd2luZG93KSA6IEdvYmJsZWR5Z29vayB3aXRoIHByZWZpeGVkKHN0cixvYmosIHNjb3BlKSByZXR1cm5zIGZhbHNlXCIpO1xuXG5cbiAgZXF1YWwoXG4gICAgZmFsc2UsXG4gICAgTW9kZXJuaXpyLnByZWZpeGVkKCdkb1NvbWV0aGluZ0FtYXppbmckIyQnLCB3aW5kb3csIGZhbHNlKSxcbiAgICBcIk1vZGVybml6ci5wcmVmaXhlZCgnZG9Tb21ldGhpbmdBbWF6aW5nJCMkJywgd2luZG93KSA6IEdvYmJsZWR5Z29vayB3aXRoIHByZWZpeGVkKHN0cixvYmosIGZhbHNlKSByZXR1cm5zIGZhbHNlXCIpO1xuXG5cbn0pO1xuXG5cblxuXG5cbiJdLCJmaWxlIjoibW9kZXJuaXpyL3Rlc3QvanMvdW5pdC5qcyIsInNvdXJjZVJvb3QiOiIvc291cmNlLyJ9