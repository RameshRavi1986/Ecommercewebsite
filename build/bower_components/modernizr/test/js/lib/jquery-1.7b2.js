/*!
 * jQuery JavaScript Library v1.7b2
 * http://jquery.com/
 *
 * Copyright 2011, John Resig
 * Dual licensed under the MIT or GPL Version 2 licenses.
 * http://jquery.org/license
 *
 * Includes Sizzle.js
 * http://sizzlejs.com/
 * Copyright 2011, The Dojo Foundation
 * Released under the MIT, BSD, and GPL Licenses.
 *
 * Date: Thu Oct 13 21:12:55 2011 -0400
 */
(function( window, undefined ) {

// Use the correct document accordingly with window argument (sandbox)
var document = window.document,
	navigator = window.navigator,
	location = window.location;
var jQuery = (function() {

// Define a local copy of jQuery
var jQuery = function( selector, context ) {
		// The jQuery object is actually just the init constructor 'enhanced'
		return new jQuery.fn.init( selector, context, rootjQuery );
	},

	// Map over jQuery in case of overwrite
	_jQuery = window.jQuery,

	// Map over the $ in case of overwrite
	_$ = window.$,

	// A central reference to the root jQuery(document)
	rootjQuery,

	// A simple way to check for HTML strings or ID strings
	// Prioritize #id over <tag> to avoid XSS via location.hash (#9521)
	quickExpr = /^(?:[^#<]*(<[\w\W]+>)[^>]*$|#([\w\-]*)$)/,

	// Check if a string has a non-whitespace character in it
	rnotwhite = /\S/,

	// Used for trimming whitespace
	trimLeft = /^\s+/,
	trimRight = /\s+$/,

	// Check for digits
	rdigit = /\d/,

	// Match a standalone tag
	rsingleTag = /^<(\w+)\s*\/?>(?:<\/\1>)?$/,

	// JSON RegExp
	rvalidchars = /^[\],:{}\s]*$/,
	rvalidescape = /\\(?:["\\\/bfnrt]|u[0-9a-fA-F]{4})/g,
	rvalidtokens = /"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g,
	rvalidbraces = /(?:^|:|,)(?:\s*\[)+/g,

	// Useragent RegExp
	rwebkit = /(webkit)[ \/]([\w.]+)/,
	ropera = /(opera)(?:.*version)?[ \/]([\w.]+)/,
	rmsie = /(msie) ([\w.]+)/,
	rmozilla = /(mozilla)(?:.*? rv:([\w.]+))?/,

	// Matches dashed string for camelizing
	rdashAlpha = /-([a-z]|[0-9])/ig,
	rmsPrefix = /^-ms-/,

	// Used by jQuery.camelCase as callback to replace()
	fcamelCase = function( all, letter ) {
		return ( letter + "" ).toUpperCase();
	},

	// Keep a UserAgent string for use with jQuery.browser
	userAgent = navigator.userAgent,

	// For matching the engine and version of the browser
	browserMatch,

	// The deferred used on DOM ready
	readyList,

	// The ready event handler
	DOMContentLoaded,

	// Save a reference to some core methods
	toString = Object.prototype.toString,
	hasOwn = Object.prototype.hasOwnProperty,
	push = Array.prototype.push,
	slice = Array.prototype.slice,
	trim = String.prototype.trim,
	indexOf = Array.prototype.indexOf,

	// [[Class]] -> type pairs
	class2type = {};

jQuery.fn = jQuery.prototype = {
	constructor: jQuery,
	init: function( selector, context, rootjQuery ) {
		var match, elem, ret, doc;

		// Handle $(""), $(null), or $(undefined)
		if ( !selector ) {
			return this;
		}

		// Handle $(DOMElement)
		if ( selector.nodeType ) {
			this.context = this[0] = selector;
			this.length = 1;
			return this;
		}

		// The body element only exists once, optimize finding it
		if ( selector === "body" && !context && document.body ) {
			this.context = document;
			this[0] = document.body;
			this.selector = selector;
			this.length = 1;
			return this;
		}

		// Handle HTML strings
		if ( typeof selector === "string" ) {
			// Are we dealing with HTML string or an ID?
			if ( selector.charAt(0) === "<" && selector.charAt( selector.length - 1 ) === ">" && selector.length >= 3 ) {
				// Assume that strings that start and end with <> are HTML and skip the regex check
				match = [ null, selector, null ];

			} else {
				match = quickExpr.exec( selector );
			}

			// Verify a match, and that no context was specified for #id
			if ( match && (match[1] || !context) ) {

				// HANDLE: $(html) -> $(array)
				if ( match[1] ) {
					context = context instanceof jQuery ? context[0] : context;
					doc = (context ? context.ownerDocument || context : document);

					// If a single string is passed in and it's a single tag
					// just do a createElement and skip the rest
					ret = rsingleTag.exec( selector );

					if ( ret ) {
						if ( jQuery.isPlainObject( context ) ) {
							selector = [ document.createElement( ret[1] ) ];
							jQuery.fn.attr.call( selector, context, true );

						} else {
							selector = [ doc.createElement( ret[1] ) ];
						}

					} else {
						ret = jQuery.buildFragment( [ match[1] ], [ doc ] );
						selector = (ret.cacheable ? jQuery.clone(ret.fragment) : ret.fragment).childNodes;
					}

					return jQuery.merge( this, selector );

				// HANDLE: $("#id")
				} else {
					elem = document.getElementById( match[2] );

					// Check parentNode to catch when Blackberry 4.6 returns
					// nodes that are no longer in the document #6963
					if ( elem && elem.parentNode ) {
						// Handle the case where IE and Opera return items
						// by name instead of ID
						if ( elem.id !== match[2] ) {
							return rootjQuery.find( selector );
						}

						// Otherwise, we inject the element directly into the jQuery object
						this.length = 1;
						this[0] = elem;
					}

					this.context = document;
					this.selector = selector;
					return this;
				}

			// HANDLE: $(expr, $(...))
			} else if ( !context || context.jquery ) {
				return (context || rootjQuery).find( selector );

			// HANDLE: $(expr, context)
			// (which is just equivalent to: $(context).find(expr)
			} else {
				return this.constructor( context ).find( selector );
			}

		// HANDLE: $(function)
		// Shortcut for document ready
		} else if ( jQuery.isFunction( selector ) ) {
			return rootjQuery.ready( selector );
		}

		if (selector.selector !== undefined) {
			this.selector = selector.selector;
			this.context = selector.context;
		}

		return jQuery.makeArray( selector, this );
	},

	// Start with an empty selector
	selector: "",

	// The current version of jQuery being used
	jquery: "1.7b2",

	// The default length of a jQuery object is 0
	length: 0,

	// The number of elements contained in the matched element set
	size: function() {
		return this.length;
	},

	toArray: function() {
		return slice.call( this, 0 );
	},

	// Get the Nth element in the matched element set OR
	// Get the whole matched element set as a clean array
	get: function( num ) {
		return num == null ?

			// Return a 'clean' array
			this.toArray() :

			// Return just the object
			( num < 0 ? this[ this.length + num ] : this[ num ] );
	},

	// Take an array of elements and push it onto the stack
	// (returning the new matched element set)
	pushStack: function( elems, name, selector ) {
		// Build a new jQuery matched element set
		var ret = this.constructor();

		if ( jQuery.isArray( elems ) ) {
			push.apply( ret, elems );

		} else {
			jQuery.merge( ret, elems );
		}

		// Add the old object onto the stack (as a reference)
		ret.prevObject = this;

		ret.context = this.context;

		if ( name === "find" ) {
			ret.selector = this.selector + (this.selector ? " " : "") + selector;
		} else if ( name ) {
			ret.selector = this.selector + "." + name + "(" + selector + ")";
		}

		// Return the newly-formed element set
		return ret;
	},

	// Execute a callback for every element in the matched set.
	// (You can seed the arguments with an array of args, but this is
	// only used internally.)
	each: function( callback, args ) {
		return jQuery.each( this, callback, args );
	},

	ready: function( fn ) {
		// Attach the listeners
		jQuery.bindReady();

		// Add the callback
		readyList.add( fn );

		return this;
	},

	eq: function( i ) {
		return i === -1 ?
			this.slice( i ) :
			this.slice( i, +i + 1 );
	},

	first: function() {
		return this.eq( 0 );
	},

	last: function() {
		return this.eq( -1 );
	},

	slice: function() {
		return this.pushStack( slice.apply( this, arguments ),
			"slice", slice.call(arguments).join(",") );
	},

	map: function( callback ) {
		return this.pushStack( jQuery.map(this, function( elem, i ) {
			return callback.call( elem, i, elem );
		}));
	},

	end: function() {
		return this.prevObject || this.constructor(null);
	},

	// For internal use only.
	// Behaves like an Array's method, not like a jQuery method.
	push: push,
	sort: [].sort,
	splice: [].splice
};

// Give the init function the jQuery prototype for later instantiation
jQuery.fn.init.prototype = jQuery.fn;

jQuery.extend = jQuery.fn.extend = function() {
	var options, name, src, copy, copyIsArray, clone,
		target = arguments[0] || {},
		i = 1,
		length = arguments.length,
		deep = false;

	// Handle a deep copy situation
	if ( typeof target === "boolean" ) {
		deep = target;
		target = arguments[1] || {};
		// skip the boolean and the target
		i = 2;
	}

	// Handle case when target is a string or something (possible in deep copy)
	if ( typeof target !== "object" && !jQuery.isFunction(target) ) {
		target = {};
	}

	// extend jQuery itself if only one argument is passed
	if ( length === i ) {
		target = this;
		--i;
	}

	for ( ; i < length; i++ ) {
		// Only deal with non-null/undefined values
		if ( (options = arguments[ i ]) != null ) {
			// Extend the base object
			for ( name in options ) {
				src = target[ name ];
				copy = options[ name ];

				// Prevent never-ending loop
				if ( target === copy ) {
					continue;
				}

				// Recurse if we're merging plain objects or arrays
				if ( deep && copy && ( jQuery.isPlainObject(copy) || (copyIsArray = jQuery.isArray(copy)) ) ) {
					if ( copyIsArray ) {
						copyIsArray = false;
						clone = src && jQuery.isArray(src) ? src : [];

					} else {
						clone = src && jQuery.isPlainObject(src) ? src : {};
					}

					// Never move original objects, clone them
					target[ name ] = jQuery.extend( deep, clone, copy );

				// Don't bring in undefined values
				} else if ( copy !== undefined ) {
					target[ name ] = copy;
				}
			}
		}
	}

	// Return the modified object
	return target;
};

jQuery.extend({
	noConflict: function( deep ) {
		if ( window.$ === jQuery ) {
			window.$ = _$;
		}

		if ( deep && window.jQuery === jQuery ) {
			window.jQuery = _jQuery;
		}

		return jQuery;
	},

	// Is the DOM ready to be used? Set to true once it occurs.
	isReady: false,

	// A counter to track how many items to wait for before
	// the ready event fires. See #6781
	readyWait: 1,

	// Hold (or release) the ready event
	holdReady: function( hold ) {
		if ( hold ) {
			jQuery.readyWait++;
		} else {
			jQuery.ready( true );
		}
	},

	// Handle when the DOM is ready
	ready: function( wait ) {
		// Either a released hold or an DOMready/load event and not yet ready
		if ( (wait === true && !--jQuery.readyWait) || (wait !== true && !jQuery.isReady) ) {
			// Make sure body exists, at least, in case IE gets a little overzealous (ticket #5443).
			if ( !document.body ) {
				return setTimeout( jQuery.ready, 1 );
			}

			// Remember that the DOM is ready
			jQuery.isReady = true;

			// If a normal DOM Ready event fired, decrement, and wait if need be
			if ( wait !== true && --jQuery.readyWait > 0 ) {
				return;
			}

			// If there are functions bound, to execute
			readyList.fireWith( document, [ jQuery ] );

			// Trigger any bound ready events
			if ( jQuery.fn.trigger ) {
				jQuery( document ).trigger( "ready" ).unbind( "ready" );
			}
		}
	},

	bindReady: function() {
		if ( readyList ) {
			return;
		}

		readyList = jQuery.Callbacks( "once memory" );

		// Catch cases where $(document).ready() is called after the
		// browser event has already occurred.
		if ( document.readyState === "complete" ) {
			// Handle it asynchronously to allow scripts the opportunity to delay ready
			return setTimeout( jQuery.ready, 1 );
		}

		// Mozilla, Opera and webkit nightlies currently support this event
		if ( document.addEventListener ) {
			// Use the handy event callback
			document.addEventListener( "DOMContentLoaded", DOMContentLoaded, false );

			// A fallback to window.onload, that will always work
			window.addEventListener( "load", jQuery.ready, false );

		// If IE event model is used
		} else if ( document.attachEvent ) {
			// ensure firing before onload,
			// maybe late but safe also for iframes
			document.attachEvent( "onreadystatechange", DOMContentLoaded );

			// A fallback to window.onload, that will always work
			window.attachEvent( "onload", jQuery.ready );

			// If IE and not a frame
			// continually check to see if the document is ready
			var toplevel = false;

			try {
				toplevel = window.frameElement == null;
			} catch(e) {}

			if ( document.documentElement.doScroll && toplevel ) {
				doScrollCheck();
			}
		}
	},

	// See test/unit/core.js for details concerning isFunction.
	// Since version 1.3, DOM methods and functions like alert
	// aren't supported. They return false on IE (#2968).
	isFunction: function( obj ) {
		return jQuery.type(obj) === "function";
	},

	isArray: Array.isArray || function( obj ) {
		return jQuery.type(obj) === "array";
	},

	// A crude way of determining if an object is a window
	isWindow: function( obj ) {
		return obj && typeof obj === "object" && "setInterval" in obj;
	},

	isNumeric: function( obj ) {
		return obj != null && rdigit.test( obj ) && !isNaN( obj );
	},

	type: function( obj ) {
		return obj == null ?
			String( obj ) :
			class2type[ toString.call(obj) ] || "object";
	},

	isPlainObject: function( obj ) {
		// Must be an Object.
		// Because of IE, we also have to check the presence of the constructor property.
		// Make sure that DOM nodes and window objects don't pass through, as well
		if ( !obj || jQuery.type(obj) !== "object" || obj.nodeType || jQuery.isWindow( obj ) ) {
			return false;
		}

		try {
			// Not own constructor property must be Object
			if ( obj.constructor &&
				!hasOwn.call(obj, "constructor") &&
				!hasOwn.call(obj.constructor.prototype, "isPrototypeOf") ) {
				return false;
			}
		} catch ( e ) {
			// IE8,9 Will throw exceptions on certain host objects #9897
			return false;
		}

		// Own properties are enumerated firstly, so to speed up,
		// if last one is own, then all properties are own.

		var key;
		for ( key in obj ) {}

		return key === undefined || hasOwn.call( obj, key );
	},

	isEmptyObject: function( obj ) {
		for ( var name in obj ) {
			return false;
		}
		return true;
	},

	error: function( msg ) {
		throw msg;
	},

	parseJSON: function( data ) {
		if ( typeof data !== "string" || !data ) {
			return null;
		}

		// Make sure leading/trailing whitespace is removed (IE can't handle it)
		data = jQuery.trim( data );

		// Attempt to parse using the native JSON parser first
		if ( window.JSON && window.JSON.parse ) {
			return window.JSON.parse( data );
		}

		// Make sure the incoming data is actual JSON
		// Logic borrowed from http://json.org/json2.js
		if ( rvalidchars.test( data.replace( rvalidescape, "@" )
			.replace( rvalidtokens, "]" )
			.replace( rvalidbraces, "")) ) {

			return (new Function( "return " + data ))();

		}
		jQuery.error( "Invalid JSON: " + data );
	},

	// Cross-browser xml parsing
	parseXML: function( data ) {
		var xml, tmp;
		try {
			if ( window.DOMParser ) { // Standard
				tmp = new DOMParser();
				xml = tmp.parseFromString( data , "text/xml" );
			} else { // IE
				xml = new ActiveXObject( "Microsoft.XMLDOM" );
				xml.async = "false";
				xml.loadXML( data );
			}
		} catch( e ) {
			xml = undefined;
		}
		if ( !xml || !xml.documentElement || xml.getElementsByTagName( "parsererror" ).length ) {
			jQuery.error( "Invalid XML: " + data );
		}
		return xml;
	},

	noop: function() {},

	// Evaluates a script in a global context
	// Workarounds based on findings by Jim Driscoll
	// http://weblogs.java.net/blog/driscoll/archive/2009/09/08/eval-javascript-global-context
	globalEval: function( data ) {
		if ( data && rnotwhite.test( data ) ) {
			// We use execScript on Internet Explorer
			// We use an anonymous function so that context is window
			// rather than jQuery in Firefox
			( window.execScript || function( data ) {
				window[ "eval" ].call( window, data );
			} )( data );
		}
	},

	// Convert dashed to camelCase; used by the css and data modules
	// Microsoft forgot to hump their vendor prefix (#9572)
	camelCase: function( string ) {
		return string.replace( rmsPrefix, "ms-" ).replace( rdashAlpha, fcamelCase );
	},

	nodeName: function( elem, name ) {
		return elem.nodeName && elem.nodeName.toUpperCase() === name.toUpperCase();
	},

	// args is for internal usage only
	each: function( object, callback, args ) {
		var name, i = 0,
			length = object.length,
			isObj = length === undefined || jQuery.isFunction( object );

		if ( args ) {
			if ( isObj ) {
				for ( name in object ) {
					if ( callback.apply( object[ name ], args ) === false ) {
						break;
					}
				}
			} else {
				for ( ; i < length; ) {
					if ( callback.apply( object[ i++ ], args ) === false ) {
						break;
					}
				}
			}

		// A special, fast, case for the most common use of each
		} else {
			if ( isObj ) {
				for ( name in object ) {
					if ( callback.call( object[ name ], name, object[ name ] ) === false ) {
						break;
					}
				}
			} else {
				for ( ; i < length; ) {
					if ( callback.call( object[ i ], i, object[ i++ ] ) === false ) {
						break;
					}
				}
			}
		}

		return object;
	},

	// Use native String.trim function wherever possible
	trim: trim ?
		function( text ) {
			return text == null ?
				"" :
				trim.call( text );
		} :

		// Otherwise use our own trimming functionality
		function( text ) {
			return text == null ?
				"" :
				text.toString().replace( trimLeft, "" ).replace( trimRight, "" );
		},

	// results is for internal usage only
	makeArray: function( array, results ) {
		var ret = results || [];

		if ( array != null ) {
			// The window, strings (and functions) also have 'length'
			// The extra typeof function check is to prevent crashes
			// in Safari 2 (See: #3039)
			// Tweaked logic slightly to handle Blackberry 4.7 RegExp issues #6930
			var type = jQuery.type( array );

			if ( array.length == null || type === "string" || type === "function" || type === "regexp" || jQuery.isWindow( array ) ) {
				push.call( ret, array );
			} else {
				jQuery.merge( ret, array );
			}
		}

		return ret;
	},

	inArray: function( elem, array, i ) {
		var len;

		if ( array ) {
			if ( indexOf ) {
				return indexOf.call( array, elem, i );
			}

			len = array.length;
			i = i ? i < 0 ? Math.max( 0, len + i ) : i : 0;

			for ( ; i < len; i++ ) {
				// Skip accessing in sparse arrays
				if ( i in array && array[ i ] === elem ) {
					return i;
				}
			}
		}

		return -1;
	},

	merge: function( first, second ) {
		var i = first.length,
			j = 0;

		if ( typeof second.length === "number" ) {
			for ( var l = second.length; j < l; j++ ) {
				first[ i++ ] = second[ j ];
			}

		} else {
			while ( second[j] !== undefined ) {
				first[ i++ ] = second[ j++ ];
			}
		}

		first.length = i;

		return first;
	},

	grep: function( elems, callback, inv ) {
		var ret = [], retVal;
		inv = !!inv;

		// Go through the array, only saving the items
		// that pass the validator function
		for ( var i = 0, length = elems.length; i < length; i++ ) {
			retVal = !!callback( elems[ i ], i );
			if ( inv !== retVal ) {
				ret.push( elems[ i ] );
			}
		}

		return ret;
	},

	// arg is for internal usage only
	map: function( elems, callback, arg ) {
		var value, key, ret = [],
			i = 0,
			length = elems.length,
			// jquery objects are treated as arrays
			isArray = elems instanceof jQuery || length !== undefined && typeof length === "number" && ( ( length > 0 && elems[ 0 ] && elems[ length -1 ] ) || length === 0 || jQuery.isArray( elems ) ) ;

		// Go through the array, translating each of the items to their
		if ( isArray ) {
			for ( ; i < length; i++ ) {
				value = callback( elems[ i ], i, arg );

				if ( value != null ) {
					ret[ ret.length ] = value;
				}
			}

		// Go through every key on the object,
		} else {
			for ( key in elems ) {
				value = callback( elems[ key ], key, arg );

				if ( value != null ) {
					ret[ ret.length ] = value;
				}
			}
		}

		// Flatten any nested arrays
		return ret.concat.apply( [], ret );
	},

	// A global GUID counter for objects
	guid: 1,

	// Bind a function to a context, optionally partially applying any
	// arguments.
	proxy: function( fn, context ) {
		if ( typeof context === "string" ) {
			var tmp = fn[ context ];
			context = fn;
			fn = tmp;
		}

		// Quick check to determine if target is callable, in the spec
		// this throws a TypeError, but we will just return undefined.
		if ( !jQuery.isFunction( fn ) ) {
			return undefined;
		}

		// Simulated bind
		var args = slice.call( arguments, 2 ),
			proxy = function() {
				return fn.apply( context, args.concat( slice.call( arguments ) ) );
			};

		// Set the guid of unique handler to the same of original handler, so it can be removed
		proxy.guid = fn.guid = fn.guid || proxy.guid || jQuery.guid++;

		return proxy;
	},

	// Mutifunctional method to get and set values to a collection
	// The value/s can optionally be executed if it's a function
	access: function( elems, key, value, exec, fn, pass ) {
		var length = elems.length;

		// Setting many attributes
		if ( typeof key === "object" ) {
			for ( var k in key ) {
				jQuery.access( elems, k, key[k], exec, fn, value );
			}
			return elems;
		}

		// Setting one attribute
		if ( value !== undefined ) {
			// Optionally, function values get executed if exec is true
			exec = !pass && exec && jQuery.isFunction(value);

			for ( var i = 0; i < length; i++ ) {
				fn( elems[i], key, exec ? value.call( elems[i], i, fn( elems[i], key ) ) : value, pass );
			}

			return elems;
		}

		// Getting an attribute
		return length ? fn( elems[0], key ) : undefined;
	},

	now: function() {
		return (new Date()).getTime();
	},

	// Use of jQuery.browser is frowned upon.
	// More details: http://docs.jquery.com/Utilities/jQuery.browser
	uaMatch: function( ua ) {
		ua = ua.toLowerCase();

		var match = rwebkit.exec( ua ) ||
			ropera.exec( ua ) ||
			rmsie.exec( ua ) ||
			ua.indexOf("compatible") < 0 && rmozilla.exec( ua ) ||
			[];

		return { browser: match[1] || "", version: match[2] || "0" };
	},

	sub: function() {
		function jQuerySub( selector, context ) {
			return new jQuerySub.fn.init( selector, context );
		}
		jQuery.extend( true, jQuerySub, this );
		jQuerySub.superclass = this;
		jQuerySub.fn = jQuerySub.prototype = this();
		jQuerySub.fn.constructor = jQuerySub;
		jQuerySub.sub = this.sub;
		jQuerySub.fn.init = function init( selector, context ) {
			if ( context && context instanceof jQuery && !(context instanceof jQuerySub) ) {
				context = jQuerySub( context );
			}

			return jQuery.fn.init.call( this, selector, context, rootjQuerySub );
		};
		jQuerySub.fn.init.prototype = jQuerySub.fn;
		var rootjQuerySub = jQuerySub(document);
		return jQuerySub;
	},

	browser: {}
});

// Populate the class2type map
jQuery.each("Boolean Number String Function Array Date RegExp Object".split(" "), function(i, name) {
	class2type[ "[object " + name + "]" ] = name.toLowerCase();
});

browserMatch = jQuery.uaMatch( userAgent );
if ( browserMatch.browser ) {
	jQuery.browser[ browserMatch.browser ] = true;
	jQuery.browser.version = browserMatch.version;
}

// Deprecated, use jQuery.browser.webkit instead
if ( jQuery.browser.webkit ) {
	jQuery.browser.safari = true;
}

// IE doesn't match non-breaking spaces with \s
if ( rnotwhite.test( "\xA0" ) ) {
	trimLeft = /^[\s\xA0]+/;
	trimRight = /[\s\xA0]+$/;
}

// All jQuery objects should point back to these
rootjQuery = jQuery(document);

// Cleanup functions for the document ready method
if ( document.addEventListener ) {
	DOMContentLoaded = function() {
		document.removeEventListener( "DOMContentLoaded", DOMContentLoaded, false );
		jQuery.ready();
	};

} else if ( document.attachEvent ) {
	DOMContentLoaded = function() {
		// Make sure body exists, at least, in case IE gets a little overzealous (ticket #5443).
		if ( document.readyState === "complete" ) {
			document.detachEvent( "onreadystatechange", DOMContentLoaded );
			jQuery.ready();
		}
	};
}

// The DOM ready check for Internet Explorer
function doScrollCheck() {
	if ( jQuery.isReady ) {
		return;
	}

	try {
		// If IE is used, use the trick by Diego Perini
		// http://javascript.nwbox.com/IEContentLoaded/
		document.documentElement.doScroll("left");
	} catch(e) {
		setTimeout( doScrollCheck, 1 );
		return;
	}

	// and execute any waiting functions
	jQuery.ready();
}

// Expose jQuery as an AMD module, but only for AMD loaders that
// understand the issues with loading multiple versions of jQuery
// in a page that all might call define(). The loader will indicate
// they have special allowances for multiple jQuery versions by
// specifying define.amd.jQuery = true. Register as a named module,
// since jQuery can be concatenated with other files that may use define,
// but not use a proper concatenation script that understands anonymous
// AMD modules. A named AMD is safest and most robust way to register.
// Lowercase jquery is used because AMD module names are derived from
// file names, and jQuery is normally delivered in a lowercase file name.
if ( typeof define === "function" && define.amd && define.amd.jQuery ) {
	define( "jquery", [], function () { return jQuery; } );
}

return jQuery;

})();


// String to Object flags format cache
var flagsCache = {};

// Convert String-formatted flags into Object-formatted ones and store in cache
function createFlags( flags ) {
	var object = flagsCache[ flags ] = {},
		i, length;
	flags = flags.split( /\s+/ );
	for ( i = 0, length = flags.length; i < length; i++ ) {
		object[ flags[i] ] = true;
	}
	return object;
}

/*
 * Create a callback list using the following parameters:
 *
 *	flags:	an optional list of space-separated flags that will change how
 *			the callback list behaves
 *
 * By default a callback list will act like an event callback list and can be
 * "fired" multiple times.
 *
 * Possible flags:
 *
 *	once:			will ensure the callback list can only be fired once (like a Deferred)
 *
 *	memory:			will keep track of previous values and will call any callback added
 *					after the list has been fired right away with the latest "memorized"
 *					values (like a Deferred)
 *
 *	unique:			will ensure a callback can only be added once (no duplicate in the list)
 *
 *	stopOnFalse:	interrupt callings when a callback returns false
 *
 */
jQuery.Callbacks = function( flags ) {

	// Convert flags from String-formatted to Object-formatted
	// (we check in cache first)
	flags = flags ? ( flagsCache[ flags ] || createFlags( flags ) ) : {};

	var // Actual callback list
		list = [],
		// Stack of fire calls for repeatable lists
		stack = [],
		// Last fire value (for non-forgettable lists)
		memory,
		// Flag to know if list is currently firing
		firing,
		// First callback to fire (used internally by add and fireWith)
		firingStart,
		// End of the loop when firing
		firingLength,
		// Index of currently firing callback (modified by remove if needed)
		firingIndex,
		// Add one or several callbacks to the list
		add = function( args ) {
			var i,
				length,
				elem,
				type,
				actual;
			for ( i = 0, length = args.length; i < length; i++ ) {
				elem = args[ i ];
				type = jQuery.type( elem );
				if ( type === "array" ) {
					// Inspect recursively
					add( elem );
				} else if ( type === "function" ) {
					// Add if not in unique mode and callback is not in
					if ( !flags.unique || !self.has( elem ) ) {
						list.push( elem );
					}
				}
			}
		},
		// Fire callbacks
		fire = function( context, args ) {
			args = args || [];
			memory = !flags.memory || [ context, args ];
			firing = true;
			firingIndex = firingStart || 0;
			firingStart = 0;
			firingLength = list.length;
			for ( ; list && firingIndex < firingLength; firingIndex++ ) {
				if ( list[ firingIndex ].apply( context, args ) === false && flags.stopOnFalse ) {
					memory = true; // Mark as halted
					break;
				}
			}
			firing = false;
			if ( list ) {
				if ( !flags.once ) {
					if ( stack && stack.length ) {
						memory = stack.shift();
						self.fireWith( memory[ 0 ], memory[ 1 ] );
					}
				} else if ( memory === true ) {
					self.disable();
				} else {
					list = [];
				}
			}
		},
		// Actual Callbacks object
		self = {
			// Add a callback or a collection of callbacks to the list
			add: function() {
				if ( list ) {
					var length = list.length;
					add( arguments );
					// Do we need to add the callbacks to the
					// current firing batch?
					if ( firing ) {
						firingLength = list.length;
					// With memory, if we're not firing then
					// we should call right away, unless previous
					// firing was halted (stopOnFalse)
					} else if ( memory && memory !== true ) {
						firingStart = length;
						fire( memory[ 0 ], memory[ 1 ] );
					}
				}
				return this;
			},
			// Remove a callback from the list
			remove: function() {
				if ( list ) {
					var args = arguments,
						argIndex = 0,
						argLength = args.length;
					for ( ; argIndex < argLength ; argIndex++ ) {
						for ( var i = 0; i < list.length; i++ ) {
							if ( args[ argIndex ] === list[ i ] ) {
								// Handle firingIndex and firingLength
								if ( firing ) {
									if ( i <= firingLength ) {
										firingLength--;
										if ( i <= firingIndex ) {
											firingIndex--;
										}
									}
								}
								// Remove the element
								list.splice( i--, 1 );
								// If we have some unicity property then
								// we only need to do this once
								if ( flags.unique ) {
									break;
								}
							}
						}
					}
				}
				return this;
			},
			// Control if a given callback is in the list
			has: function( fn ) {
				if ( list ) {
					var i = 0,
						length = list.length;
					for ( ; i < length; i++ ) {
						if ( fn === list[ i ] ) {
							return true;
						}
					}
				}
				return false;
			},
			// Remove all callbacks from the list
			empty: function() {
				list = [];
				return this;
			},
			// Have the list do nothing anymore
			disable: function() {
				list = stack = memory = undefined;
				return this;
			},
			// Is it disabled?
			disabled: function() {
				return !list;
			},
			// Lock the list in its current state
			lock: function() {
				stack = undefined;
				if ( !memory || memory === true ) {
					self.disable();
				}
				return this;
			},
			// Is it locked?
			locked: function() {
				return !stack;
			},
			// Call all callbacks with the given context and arguments
			fireWith: function( context, args ) {
				if ( stack ) {
					if ( firing ) {
						if ( !flags.once ) {
							stack.push( [ context, args ] );
						}
					} else if ( !( flags.once && memory ) ) {
						fire( context, args );
					}
				}
				return this;
			},
			// Call all the callbacks with the given arguments
			fire: function() {
				self.fireWith( this, arguments );
				return this;
			},
			// To know if the callbacks have already been called at least once
			fired: function() {
				return !!memory;
			}
		};

	return self;
};




var // Static reference to slice
	sliceDeferred = [].slice;

jQuery.extend({

	Deferred: function( func ) {
		var doneList = jQuery.Callbacks( "once memory" ),
			failList = jQuery.Callbacks( "once memory" ),
			progressList = jQuery.Callbacks( "memory" ),
			state = "pending",
			lists = {
				resolve: doneList,
				reject: failList,
				notify: progressList
			},
			promise = {
				done: doneList.add,
				fail: failList.add,
				progress: progressList.add,

				state: function() {
					return state;
				},

				// Deprecated
				isResolved: doneList.fired,
				isRejected: failList.fired,

				then: function( doneCallbacks, failCallbacks, progressCallbacks ) {
					deferred.done( doneCallbacks ).fail( failCallbacks ).progress( progressCallbacks );
					return this;
				},
				always: function() {
					return deferred.done.apply( deferred, arguments ).fail.apply( deferred, arguments );
				},
				pipe: function( fnDone, fnFail, fnProgress ) {
					return jQuery.Deferred(function( newDefer ) {
						jQuery.each( {
							done: [ fnDone, "resolve" ],
							fail: [ fnFail, "reject" ],
							progress: [ fnProgress, "notify" ]
						}, function( handler, data ) {
							var fn = data[ 0 ],
								action = data[ 1 ],
								returned;
							if ( jQuery.isFunction( fn ) ) {
								deferred[ handler ](function() {
									returned = fn.apply( this, arguments );
									if ( returned && jQuery.isFunction( returned.promise ) ) {
										returned.promise().then( newDefer.resolve, newDefer.reject, newDefer.notify );
									} else {
										newDefer[ action + "With" ]( this === deferred ? newDefer : this, [ returned ] );
									}
								});
							} else {
								deferred[ handler ]( newDefer[ action ] );
							}
						});
					}).promise();
				},
				// Get a promise for this deferred
				// If obj is provided, the promise aspect is added to the object
				promise: function( obj ) {
					if ( obj == null ) {
						obj = promise;
					} else {
						for( var key in promise ) {
							obj[ key ] = promise[ key ];
						}
					}
					return obj;
				}
			},
			deferred = promise.promise({}),
			key;

		for ( key in lists ) {
			deferred[ key ] = lists[ key ].fire;
			deferred[ key + "With" ] = lists[ key ].fireWith;
		}

		// Handle state
		deferred.done( function() {
			state = "resolved";
		}, failList.disable, progressList.lock ).fail( function() {
			state = "rejected";
		}, doneList.disable, progressList.lock );

		// Call given func if any
		if ( func ) {
			func.call( deferred, deferred );
		}

		// All done!
		return deferred;
	},

	// Deferred helper
	when: function( firstParam ) {
		var args = sliceDeferred.call( arguments, 0 ),
			i = 0,
			length = args.length,
			pValues = new Array( length ),
			count = length,
			pCount = length,
			deferred = length <= 1 && firstParam && jQuery.isFunction( firstParam.promise ) ?
				firstParam :
				jQuery.Deferred(),
			promise = deferred.promise();
		function resolveFunc( i ) {
			return function( value ) {
				args[ i ] = arguments.length > 1 ? sliceDeferred.call( arguments, 0 ) : value;
				if ( !( --count ) ) {
					deferred.resolveWith( deferred, args );
				}
			};
		}
		function progressFunc( i ) {
			return function( value ) {
				pValues[ i ] = arguments.length > 1 ? sliceDeferred.call( arguments, 0 ) : value;
				deferred.notifyWith( promise, pValues );
			};
		}
		if ( length > 1 ) {
			for( ; i < length; i++ ) {
				if ( args[ i ] && args[ i ].promise && jQuery.isFunction( args[ i ].promise ) ) {
					args[ i ].promise().then( resolveFunc(i), deferred.reject, progressFunc(i) );
				} else {
					--count;
				}
			}
			if ( !count ) {
				deferred.resolveWith( deferred, args );
			}
		} else if ( deferred !== firstParam ) {
			deferred.resolveWith( deferred, length ? [ firstParam ] : [] );
		}
		return promise;
	}
});




jQuery.support = (function() {

	var div = document.createElement( "div" ),
		documentElement = document.documentElement,
		all,
		a,
		select,
		opt,
		input,
		marginDiv,
		support,
		fragment,
		body,
		testElementParent,
		testElement,
		testElementStyle,
		tds,
		events,
		eventName,
		i,
		isSupported,
		offsetSupport;

	// Preliminary tests
	div.setAttribute("className", "t");
	div.innerHTML = "   <link/><table></table><a href='/a' style='top:1px;float:left;opacity:.55;'>a</a><input type='checkbox'/><nav></nav>";


	all = div.getElementsByTagName( "*" );
	a = div.getElementsByTagName( "a" )[ 0 ];

	// Can't get basic test support
	if ( !all || !all.length || !a ) {
		return {};
	}

	// First batch of supports tests
	select = document.createElement( "select" );
	opt = select.appendChild( document.createElement("option") );
	input = div.getElementsByTagName( "input" )[ 0 ];

	support = {
		// IE strips leading whitespace when .innerHTML is used
		leadingWhitespace: ( div.firstChild.nodeType === 3 ),

		// Make sure that tbody elements aren't automatically inserted
		// IE will insert them into empty tables
		tbody: !div.getElementsByTagName( "tbody" ).length,

		// Make sure that link elements get serialized correctly by innerHTML
		// This requires a wrapper element in IE
		htmlSerialize: !!div.getElementsByTagName( "link" ).length,

		// Get the style information from getAttribute
		// (IE uses .cssText instead)
		style: /top/.test( a.getAttribute("style") ),

		// Make sure that URLs aren't manipulated
		// (IE normalizes it by default)
		hrefNormalized: ( a.getAttribute( "href" ) === "/a" ),

		// Make sure that element opacity exists
		// (IE uses filter instead)
		// Use a regex to work around a WebKit issue. See #5145
		opacity: /^0.55/.test( a.style.opacity ),

		// Verify style float existence
		// (IE uses styleFloat instead of cssFloat)
		cssFloat: !!a.style.cssFloat,

		// Make sure unknown elements (like HTML5 elems) are handled appropriately
		unknownElems: !!div.getElementsByTagName( "nav" ).length,

		// Make sure that if no value is specified for a checkbox
		// that it defaults to "on".
		// (WebKit defaults to "" instead)
		checkOn: ( input.value === "on" ),

		// Make sure that a selected-by-default option has a working selected property.
		// (WebKit defaults to false instead of true, IE too, if it's in an optgroup)
		optSelected: opt.selected,

		// Test setAttribute on camelCase class. If it works, we need attrFixes when doing get/setAttribute (ie6/7)
		getSetAttribute: div.className !== "t",

		// Will be defined later
		submitBubbles: true,
		changeBubbles: true,
		focusinBubbles: false,
		deleteExpando: true,
		noCloneEvent: true,
		inlineBlockNeedsLayout: false,
		shrinkWrapBlocks: false,
		reliableMarginRight: true
	};

	// Make sure checked status is properly cloned
	input.checked = true;
	support.noCloneChecked = input.cloneNode( true ).checked;

	// Make sure that the options inside disabled selects aren't marked as disabled
	// (WebKit marks them as disabled)
	select.disabled = true;
	support.optDisabled = !opt.disabled;

	// Test to see if it's possible to delete an expando from an element
	// Fails in Internet Explorer
	try {
		delete div.test;
	} catch( e ) {
		support.deleteExpando = false;
	}

	if ( !div.addEventListener && div.attachEvent && div.fireEvent ) {
		div.attachEvent( "onclick", function() {
			// Cloning a node shouldn't copy over any
			// bound event handlers (IE does this)
			support.noCloneEvent = false;
		});
		div.cloneNode( true ).fireEvent( "onclick" );
	}

	// Check if a radio maintains its value
	// after being appended to the DOM
	input = document.createElement("input");
	input.value = "t";
	input.setAttribute("type", "radio");
	support.radioValue = input.value === "t";

	input.setAttribute("checked", "checked");
	div.appendChild( input );
	fragment = document.createDocumentFragment();
	fragment.appendChild( div.firstChild );

	// WebKit doesn't clone checked state correctly in fragments
	support.checkClone = fragment.cloneNode( true ).cloneNode( true ).lastChild.checked;

	div.innerHTML = "";

	// Figure out if the W3C box model works as expected
	div.style.width = div.style.paddingLeft = "1px";

	// We don't want to do body-related feature tests on frameset
	// documents, which lack a body. So we use
	// document.getElementsByTagName("body")[0], which is undefined in
	// frameset documents, while document.body isn’t. (7398)
	body = document.getElementsByTagName("body")[ 0 ];
	// We use our own, invisible, body unless the body is already present
	// in which case we use a div (#9239)
	testElement = document.createElement( body ? "div" : "body" );
	testElementStyle = {
		visibility: "hidden",
		width: 0,
		height: 0,
		border: 0,
		margin: 0,
		background: "none"
	};
	if ( body ) {
		jQuery.extend( testElementStyle, {
			position: "absolute",
			left: "-999px",
			top: "-999px"
		});
	}
	for ( i in testElementStyle ) {
		testElement.style[ i ] = testElementStyle[ i ];
	}
	testElement.appendChild( div );
	testElementParent = body || documentElement;
	testElementParent.insertBefore( testElement, testElementParent.firstChild );

	// Check if a disconnected checkbox will retain its checked
	// value of true after appended to the DOM (IE6/7)
	support.appendChecked = input.checked;

	support.boxModel = div.offsetWidth === 2;

	if ( "zoom" in div.style ) {
		// Check if natively block-level elements act like inline-block
		// elements when setting their display to 'inline' and giving
		// them layout
		// (IE < 8 does this)
		div.style.display = "inline";
		div.style.zoom = 1;
		support.inlineBlockNeedsLayout = ( div.offsetWidth === 2 );

		// Check if elements with layout shrink-wrap their children
		// (IE 6 does this)
		div.style.display = "";
		div.innerHTML = "<div style='width:4px;'></div>";
		support.shrinkWrapBlocks = ( div.offsetWidth !== 2 );
	}

	div.innerHTML = "<table><tr><td style='padding:0;border:0;display:none'></td><td>t</td></tr></table>";
	tds = div.getElementsByTagName( "td" );

	// Check if table cells still have offsetWidth/Height when they are set
	// to display:none and there are still other visible table cells in a
	// table row; if so, offsetWidth/Height are not reliable for use when
	// determining if an element has been hidden directly using
	// display:none (it is still safe to use offsets if a parent element is
	// hidden; don safety goggles and see bug #4512 for more information).
	// (only IE 8 fails this test)
	isSupported = ( tds[ 0 ].offsetHeight === 0 );

	tds[ 0 ].style.display = "";
	tds[ 1 ].style.display = "none";

	// Check if empty table cells still have offsetWidth/Height
	// (IE < 8 fail this test)
	support.reliableHiddenOffsets = isSupported && ( tds[ 0 ].offsetHeight === 0 );
	div.innerHTML = "";

	// Check if div with explicit width and no margin-right incorrectly
	// gets computed margin-right based on width of container. For more
	// info see bug #3333
	// Fails in WebKit before Feb 2011 nightlies
	// WebKit Bug 13343 - getComputedStyle returns wrong value for margin-right
	if ( document.defaultView && document.defaultView.getComputedStyle ) {
		marginDiv = document.createElement( "div" );
		marginDiv.style.width = "0";
		marginDiv.style.marginRight = "0";
		div.appendChild( marginDiv );
		support.reliableMarginRight =
			( parseInt( ( document.defaultView.getComputedStyle( marginDiv, null ) || { marginRight: 0 } ).marginRight, 10 ) || 0 ) === 0;
	}

	// Remove the body element we added
	testElement.innerHTML = "";

	// Technique from Juriy Zaytsev
	// http://perfectionkills.com/detecting-event-support-without-browser-sniffing/
	// We only care about the case where non-standard event systems
	// are used, namely in IE. Short-circuiting here helps us to
	// avoid an eval call (in setAttribute) which can cause CSP
	// to go haywire. See: https://developer.mozilla.org/en/Security/CSP
	if ( div.attachEvent ) {
		for( i in {
			submit: 1,
			change: 1,
			focusin: 1
		} ) {
			eventName = "on" + i;
			isSupported = ( eventName in div );
			if ( !isSupported ) {
				div.setAttribute( eventName, "return;" );
				isSupported = ( typeof div[ eventName ] === "function" );
			}
			support[ i + "Bubbles" ] = isSupported;
		}
	}

	// Determine fixed-position support early
	testElement.style.position = "static";
	testElement.style.top = "0px";
	testElement.style.marginTop = "1px";
	offsetSupport = (function( body, container ) {

		var outer, inner, table, td, supports,
			bodyMarginTop = parseFloat( body.style.marginTop ) || 0,
			ptlm = "position:absolute;top:0;left:0;width:1px;height:1px;margin:0;",
			style = "style='" + ptlm + "border:5px solid #000;padding:0;'",
			html = "<div " + style + "><div></div></div>" +
							"<table " + style + " cellpadding='0' cellspacing='0'>" +
							"<tr><td></td></tr></table>";

		container.style.cssText = ptlm + "border:0;visibility:hidden";

		container.innerHTML = html;
		body.insertBefore( container, body.firstChild );
		outer = container.firstChild;
		inner = outer.firstChild;
		td = outer.nextSibling.firstChild.firstChild;

		supports = {
			doesNotAddBorder: (inner.offsetTop !== 5),
			doesAddBorderForTableAndCells: (td.offsetTop === 5)
		};

		inner.style.position = "fixed";
		inner.style.top = "20px";

		// safari subtracts parent border width here which is 5px
		supports.supportsFixedPosition = (inner.offsetTop === 20 || inner.offsetTop === 15);
		inner.style.position = inner.style.top = "";

		outer.style.overflow = "hidden";
		outer.style.position = "relative";

		supports.subtractsBorderForOverflowNotVisible = (inner.offsetTop === -5);
		supports.doesNotIncludeMarginInBodyOffset = (body.offsetTop !== bodyMarginTop);

		return supports;

	})( testElement, div );

	jQuery.extend( support, offsetSupport );
	testElementParent.removeChild( testElement );

	// Null connected elements to avoid leaks in IE
	testElement = fragment = select = opt = body = marginDiv = div = input = null;

	return support;
})();

// Keep track of boxModel
jQuery.boxModel = jQuery.support.boxModel;




var rbrace = /^(?:\{.*\}|\[.*\])$/,
	rmultiDash = /([A-Z])/g;

jQuery.extend({
	cache: {},

	// Please use with caution
	uuid: 0,

	// Unique for each copy of jQuery on the page
	// Non-digits removed to match rinlinejQuery
	expando: "jQuery" + ( jQuery.fn.jquery + Math.random() ).replace( /\D/g, "" ),

	// The following elements throw uncatchable exceptions if you
	// attempt to add expando properties to them.
	noData: {
		"embed": true,
		// Ban all objects except for Flash (which handle expandos)
		"object": "clsid:D27CDB6E-AE6D-11cf-96B8-444553540000",
		"applet": true
	},

	hasData: function( elem ) {
		elem = elem.nodeType ? jQuery.cache[ elem[jQuery.expando] ] : elem[ jQuery.expando ];
		return !!elem && !isEmptyDataObject( elem );
	},

	data: function( elem, name, data, pvt /* Internal Use Only */ ) {
		if ( !jQuery.acceptData( elem ) ) {
			return;
		}

		var thisCache, ret,
			internalKey = jQuery.expando,
			getByName = typeof name === "string",

			// We have to handle DOM nodes and JS objects differently because IE6-7
			// can't GC object references properly across the DOM-JS boundary
			isNode = elem.nodeType,

			// Only DOM nodes need the global jQuery cache; JS object data is
			// attached directly to the object so GC can occur automatically
			cache = isNode ? jQuery.cache : elem,

			// Only defining an ID for JS objects if its cache already exists allows
			// the code to shortcut on the same path as a DOM node with no cache
			id = isNode ? elem[ jQuery.expando ] : elem[ jQuery.expando ] && jQuery.expando;

		// Avoid doing any more work than we need to when trying to get data on an
		// object that has no data at all
		if ( (!id || !cache[id] || (!pvt && !cache[id].data)) && getByName && data === undefined ) {
			return;
		}

		if ( !id ) {
			// Only DOM nodes need a new unique ID for each element since their data
			// ends up in the global cache
			if ( isNode ) {
				elem[ jQuery.expando ] = id = ++jQuery.uuid;
			} else {
				id = jQuery.expando;
			}
		}

		if ( !cache[ id ] ) {
			cache[ id ] = {};

			// Avoids exposing jQuery metadata on plain JS objects when the object 
			// is serialized using JSON.stringify
			if ( !isNode ) {
				cache[ id ].toJSON = jQuery.noop;
			}
		}

		// An object can be passed to jQuery.data instead of a key/value pair; this gets
		// shallow copied over onto the existing cache
		if ( typeof name === "object" || typeof name === "function" ) {
			if ( pvt ) {
				cache[ id ] = jQuery.extend( cache[ id ], name );
			} else {
				cache[ id ].data = jQuery.extend( cache[ id ].data, name );
			}
		}

		thisCache = cache[ id ];

		// jQuery data() is stored in a separate object inside the object's internal data
		// cache in order to avoid key collisions between internal data and user-defined
		// data.
		if ( !pvt ) {
			if ( !thisCache.data ) {
				thisCache.data = {};
			}

			thisCache = thisCache.data;
		}

		if ( data !== undefined ) {
			thisCache[ jQuery.camelCase( name ) ] = data;
		}

		// TODO: This is a hack for 1.5 ONLY. It will be removed in 1.6. Users should
		// not attempt to inspect the internal events object using jQuery.data, as this
		// internal data object is undocumented and subject to change.
		if ( name === "events" && !thisCache[name] ) {
			return thisCache[ internalKey ] && thisCache[ internalKey ].events;
		}

		// Check for both converted-to-camel and non-converted data property names
		// If a data property was specified
		if ( getByName ) {

			// First Try to find as-is property data
			ret = thisCache[ name ];

			// Test for null|undefined property data
			if ( ret == null ) {

				// Try to find the camelCased property
				ret = thisCache[ jQuery.camelCase( name ) ];
			}
		} else {
			ret = thisCache;
		}

		return ret;
	},

	removeData: function( elem, name, pvt /* Internal Use Only */ ) {
		if ( !jQuery.acceptData( elem ) ) {
			return;
		}

		var thisCache, i, l,

			// Reference to internal data cache key
			internalKey = jQuery.expando,

			isNode = elem.nodeType,

			// See jQuery.data for more information
			cache = isNode ? jQuery.cache : elem,

			// See jQuery.data for more information
			id = isNode ? elem[ jQuery.expando ] : jQuery.expando;

		// If there is already no cache entry for this object, there is no
		// purpose in continuing
		if ( !cache[ id ] ) {
			return;
		}

		if ( name ) {

			thisCache = pvt ? cache[ id ] : cache[ id ].data;

			if ( thisCache ) {

				// Support space separated names
				if ( jQuery.isArray( name ) ) {
					name = name;
				} else if ( name in thisCache ) {
					name = [ name ];
				} else {

					// split the camel cased version by spaces
					name = jQuery.camelCase( name );
					if ( name in thisCache ) {
						name = [ name ];
					} else {
						name = name.split( " " );
					}
				}

				for ( i = 0, l = name.length; i < l; i++ ) {
					delete thisCache[ name[i] ];
				}

				// If there is no data left in the cache, we want to continue
				// and let the cache object itself get destroyed
				if ( !( pvt ? isEmptyDataObject : jQuery.isEmptyObject )( thisCache ) ) {
					return;
				}
			}
		}

		// See jQuery.data for more information
		if ( !pvt ) {
			delete cache[ id ].data;

			// Don't destroy the parent cache unless the internal data object
			// had been the only thing left in it
			if ( !isEmptyDataObject(cache[ id ]) ) {
				return;
			}
		}

		// Browsers that fail expando deletion also refuse to delete expandos on
		// the window, but it will allow it on all other JS objects; other browsers
		// don't care
		// Ensure that `cache` is not a window object #10080
		if ( jQuery.support.deleteExpando || !cache.setInterval ) {
			delete cache[ id ];
		} else {
			cache[ id ] = null;
		}

		// We destroyed the cache and need to eliminate the expando on the node to avoid
		// false lookups in the cache for entries that no longer exist
		if ( isNode ) {
			// IE does not allow us to delete expando properties from nodes,
			// nor does it have a removeAttribute function on Document nodes;
			// we must handle all of these cases
			if ( jQuery.support.deleteExpando ) {
				delete elem[ jQuery.expando ];
			} else if ( elem.removeAttribute ) {
				elem.removeAttribute( jQuery.expando );
			} else {
				elem[ jQuery.expando ] = null;
			}
		}
	},

	// For internal use only.
	_data: function( elem, name, data ) {
		return jQuery.data( elem, name, data, true );
	},

	// A method for determining if a DOM node can handle the data expando
	acceptData: function( elem ) {
		if ( elem.nodeName ) {
			var match = jQuery.noData[ elem.nodeName.toLowerCase() ];

			if ( match ) {
				return !(match === true || elem.getAttribute("classid") !== match);
			}
		}

		return true;
	}
});

jQuery.fn.extend({
	data: function( key, value ) {
		var parts, attr, name,
			data = null;

		if ( typeof key === "undefined" ) {
			if ( this.length ) {
				data = jQuery.data( this[0] );

				if ( this[0].nodeType === 1 && !jQuery._data( this[0], "parsedAttrs" ) ) {
					attr = this[0].attributes;
					for ( var i = 0, l = attr.length; i < l; i++ ) {
						name = attr[i].name;

						if ( name.indexOf( "data-" ) === 0 ) {
							name = jQuery.camelCase( name.substring(5) );

							dataAttr( this[0], name, data[ name ] );
						}
					}
					jQuery._data( this[0], "parsedAttrs", true );
				}
			}

			return data;

		} else if ( typeof key === "object" ) {
			return this.each(function() {
				jQuery.data( this, key );
			});
		}

		parts = key.split(".");
		parts[1] = parts[1] ? "." + parts[1] : "";

		if ( value === undefined ) {
			data = this.triggerHandler("getData" + parts[1] + "!", [parts[0]]);

			// Try to fetch any internally stored data first
			if ( data === undefined && this.length ) {
				data = jQuery.data( this[0], key );
				data = dataAttr( this[0], key, data );
			}

			return data === undefined && parts[1] ?
				this.data( parts[0] ) :
				data;

		} else {
			return this.each(function() {
				var $this = jQuery( this ),
					args = [ parts[0], value ];

				$this.triggerHandler( "setData" + parts[1] + "!", args );
				jQuery.data( this, key, value );
				$this.triggerHandler( "changeData" + parts[1] + "!", args );
			});
		}
	},

	removeData: function( key ) {
		return this.each(function() {
			jQuery.removeData( this, key );
		});
	}
});

function dataAttr( elem, key, data ) {
	// If nothing was found internally, try to fetch any
	// data from the HTML5 data-* attribute
	if ( data === undefined && elem.nodeType === 1 ) {

		var name = "data-" + key.replace( rmultiDash, "-$1" ).toLowerCase();

		data = elem.getAttribute( name );

		if ( typeof data === "string" ) {
			try {
				data = data === "true" ? true :
				data === "false" ? false :
				data === "null" ? null :
				jQuery.isNumeric( data ) ? parseFloat( data ) :
					rbrace.test( data ) ? jQuery.parseJSON( data ) :
					data;
			} catch( e ) {}

			// Make sure we set the data so it isn't changed later
			jQuery.data( elem, key, data );

		} else {
			data = undefined;
		}
	}

	return data;
}

// checks a cache object for emptiness
function isEmptyDataObject( obj ) {
	for ( var name in obj ) {

		// if the public data object is empty, the private is still empty
		if ( name === "data" && jQuery.isEmptyObject( obj[name] ) ) {
			continue;
		}
		if ( name !== "toJSON" ) {
			return false;
		}
	}

	return true;
}




function handleQueueMarkDefer( elem, type, src ) {
	var deferDataKey = type + "defer",
		queueDataKey = type + "queue",
		markDataKey = type + "mark",
		defer = jQuery._data( elem, deferDataKey );
	if ( defer &&
		( src === "queue" || !jQuery._data(elem, queueDataKey) ) &&
		( src === "mark" || !jQuery._data(elem, markDataKey) ) ) {
		// Give room for hard-coded callbacks to fire first
		// and eventually mark/queue something else on the element
		setTimeout( function() {
			if ( !jQuery._data( elem, queueDataKey ) &&
				!jQuery._data( elem, markDataKey ) ) {
				jQuery.removeData( elem, deferDataKey, true );
				defer.fire();
			}
		}, 0 );
	}
}

jQuery.extend({

	_mark: function( elem, type ) {
		if ( elem ) {
			type = (type || "fx") + "mark";
			jQuery._data( elem, type, (jQuery._data( elem, type ) || 0) + 1 );
		}
	},

	_unmark: function( force, elem, type ) {
		if ( force !== true ) {
			type = elem;
			elem = force;
			force = false;
		}
		if ( elem ) {
			type = type || "fx";
			var key = type + "mark",
				count = force ? 0 : ( (jQuery._data( elem, key ) || 1) - 1 );
			if ( count ) {
				jQuery._data( elem, key, count );
			} else {
				jQuery.removeData( elem, key, true );
				handleQueueMarkDefer( elem, type, "mark" );
			}
		}
	},

	queue: function( elem, type, data ) {
		var q;
		if ( elem ) {
			type = (type || "fx") + "queue";
			q = jQuery._data( elem, type );

			// Speed up dequeue by getting out quickly if this is just a lookup
			if ( data ) {
				if ( !q || jQuery.isArray(data) ) {
					q = jQuery._data( elem, type, jQuery.makeArray(data) );
				} else {
					q.push( data );
				}
			}
			return q || [];
		}
	},

	dequeue: function( elem, type ) {
		type = type || "fx";

		var queue = jQuery.queue( elem, type ),
			fn = queue.shift(),
			runner = {};

		// If the fx queue is dequeued, always remove the progress sentinel
		if ( fn === "inprogress" ) {
			fn = queue.shift();
		}

		if ( fn ) {
			// Add a progress sentinel to prevent the fx queue from being
			// automatically dequeued
			if ( type === "fx" ) {
				queue.unshift( "inprogress" );
			}

			jQuery._data( elem, type + ".run", runner );
			fn.call( elem, function() {
				jQuery.dequeue( elem, type );
			}, runner );
		}

		if ( !queue.length ) {
			jQuery.removeData( elem, type + "queue " + type + ".run", true );
			handleQueueMarkDefer( elem, type, "queue" );
		}
	}
});

jQuery.fn.extend({
	queue: function( type, data ) {
		if ( typeof type !== "string" ) {
			data = type;
			type = "fx";
		}

		if ( data === undefined ) {
			return jQuery.queue( this[0], type );
		}
		return this.each(function() {
			var queue = jQuery.queue( this, type, data );

			if ( type === "fx" && queue[0] !== "inprogress" ) {
				jQuery.dequeue( this, type );
			}
		});
	},
	dequeue: function( type ) {
		return this.each(function() {
			jQuery.dequeue( this, type );
		});
	},
	// Based off of the plugin by Clint Helfers, with permission.
	// http://blindsignals.com/index.php/2009/07/jquery-delay/
	delay: function( time, type ) {
		time = jQuery.fx ? jQuery.fx.speeds[ time ] || time : time;
		type = type || "fx";

		return this.queue( type, function( next, runner ) {
			var timeout = setTimeout( next, time );
			runner.stop = function() {
				clearTimeout( timeout );
			};
		});
	},
	clearQueue: function( type ) {
		return this.queue( type || "fx", [] );
	},
	// Get a promise resolved when queues of a certain type
	// are emptied (fx is the type by default)
	promise: function( type, object ) {
		if ( typeof type !== "string" ) {
			object = type;
			type = undefined;
		}
		type = type || "fx";
		var defer = jQuery.Deferred(),
			elements = this,
			i = elements.length,
			count = 1,
			deferDataKey = type + "defer",
			queueDataKey = type + "queue",
			markDataKey = type + "mark",
			tmp;
		function resolve() {
			if ( !( --count ) ) {
				defer.resolveWith( elements, [ elements ] );
			}
		}
		while( i-- ) {
			if (( tmp = jQuery.data( elements[ i ], deferDataKey, undefined, true ) ||
					( jQuery.data( elements[ i ], queueDataKey, undefined, true ) ||
						jQuery.data( elements[ i ], markDataKey, undefined, true ) ) &&
					jQuery.data( elements[ i ], deferDataKey, jQuery.Callbacks( "once memory" ), true ) )) {
				count++;
				tmp.add( resolve );
			}
		}
		resolve();
		return defer.promise();
	}
});




var rclass = /[\n\t\r]/g,
	rspace = /\s+/,
	rreturn = /\r/g,
	rtype = /^(?:button|input)$/i,
	rfocusable = /^(?:button|input|object|select|textarea)$/i,
	rclickable = /^a(?:rea)?$/i,
	rboolean = /^(?:autofocus|autoplay|async|checked|controls|defer|disabled|hidden|loop|multiple|open|readonly|required|scoped|selected)$/i,
	nodeHook, boolHook, fixSpecified;

jQuery.fn.extend({
	attr: function( name, value ) {
		return jQuery.access( this, name, value, true, jQuery.attr );
	},

	removeAttr: function( name ) {
		return this.each(function() {
			jQuery.removeAttr( this, name );
		});
	},

	prop: function( name, value ) {
		return jQuery.access( this, name, value, true, jQuery.prop );
	},

	removeProp: function( name ) {
		name = jQuery.propFix[ name ] || name;
		return this.each(function() {
			// try/catch handles cases where IE balks (such as removing a property on window)
			try {
				this[ name ] = undefined;
				delete this[ name ];
			} catch( e ) {}
		});
	},

	addClass: function( value ) {
		var classNames, i, l, elem,
			setClass, c, cl;

		if ( jQuery.isFunction( value ) ) {
			return this.each(function( j ) {
				jQuery( this ).addClass( value.call(this, j, this.className) );
			});
		}

		if ( value && typeof value === "string" ) {
			classNames = value.split( rspace );

			for ( i = 0, l = this.length; i < l; i++ ) {
				elem = this[ i ];

				if ( elem.nodeType === 1 ) {
					if ( !elem.className && classNames.length === 1 ) {
						elem.className = value;

					} else {
						setClass = " " + elem.className + " ";

						for ( c = 0, cl = classNames.length; c < cl; c++ ) {
							if ( !~setClass.indexOf( " " + classNames[ c ] + " " ) ) {
								setClass += classNames[ c ] + " ";
							}
						}
						elem.className = jQuery.trim( setClass );
					}
				}
			}
		}

		return this;
	},

	removeClass: function( value ) {
		var classNames, i, l, elem, className, c, cl;

		if ( jQuery.isFunction( value ) ) {
			return this.each(function( j ) {
				jQuery( this ).removeClass( value.call(this, j, this.className) );
			});
		}

		if ( (value && typeof value === "string") || value === undefined ) {
			classNames = (value || "").split( rspace );

			for ( i = 0, l = this.length; i < l; i++ ) {
				elem = this[ i ];

				if ( elem.nodeType === 1 && elem.className ) {
					if ( value ) {
						className = (" " + elem.className + " ").replace( rclass, " " );
						for ( c = 0, cl = classNames.length; c < cl; c++ ) {
							className = className.replace(" " + classNames[ c ] + " ", " ");
						}
						elem.className = jQuery.trim( className );

					} else {
						elem.className = "";
					}
				}
			}
		}

		return this;
	},

	toggleClass: function( value, stateVal ) {
		var type = typeof value,
			isBool = typeof stateVal === "boolean";

		if ( jQuery.isFunction( value ) ) {
			return this.each(function( i ) {
				jQuery( this ).toggleClass( value.call(this, i, this.className, stateVal), stateVal );
			});
		}

		return this.each(function() {
			if ( type === "string" ) {
				// toggle individual class names
				var className,
					i = 0,
					self = jQuery( this ),
					state = stateVal,
					classNames = value.split( rspace );

				while ( (className = classNames[ i++ ]) ) {
					// check each className given, space seperated list
					state = isBool ? state : !self.hasClass( className );
					self[ state ? "addClass" : "removeClass" ]( className );
				}

			} else if ( type === "undefined" || type === "boolean" ) {
				if ( this.className ) {
					// store className if set
					jQuery._data( this, "__className__", this.className );
				}

				// toggle whole className
				this.className = this.className || value === false ? "" : jQuery._data( this, "__className__" ) || "";
			}
		});
	},

	hasClass: function( selector ) {
		var className = " " + selector + " ";
		for ( var i = 0, l = this.length; i < l; i++ ) {
			if ( this[i].nodeType === 1 && (" " + this[i].className + " ").replace(rclass, " ").indexOf( className ) > -1 ) {
				return true;
			}
		}

		return false;
	},

	val: function( value ) {
		var hooks, ret,
			elem = this[0];

		if ( !arguments.length ) {
			if ( elem ) {
				hooks = jQuery.valHooks[ elem.nodeName.toLowerCase() ] || jQuery.valHooks[ elem.type ];

				if ( hooks && "get" in hooks && (ret = hooks.get( elem, "value" )) !== undefined ) {
					return ret;
				}

				ret = elem.value;

				return typeof ret === "string" ?
					// handle most common string cases
					ret.replace(rreturn, "") :
					// handle cases where value is null/undef or number
					ret == null ? "" : ret;
			}

			return undefined;
		}

		var isFunction = jQuery.isFunction( value );

		return this.each(function( i ) {
			var self = jQuery(this), val;

			if ( this.nodeType !== 1 ) {
				return;
			}

			if ( isFunction ) {
				val = value.call( this, i, self.val() );
			} else {
				val = value;
			}

			// Treat null/undefined as ""; convert numbers to string
			if ( val == null ) {
				val = "";
			} else if ( typeof val === "number" ) {
				val += "";
			} else if ( jQuery.isArray( val ) ) {
				val = jQuery.map(val, function ( value ) {
					return value == null ? "" : value + "";
				});
			}

			hooks = jQuery.valHooks[ this.nodeName.toLowerCase() ] || jQuery.valHooks[ this.type ];

			// If set returns undefined, fall back to normal setting
			if ( !hooks || !("set" in hooks) || hooks.set( this, val, "value" ) === undefined ) {
				this.value = val;
			}
		});
	}
});

jQuery.extend({
	valHooks: {
		option: {
			get: function( elem ) {
				// attributes.value is undefined in Blackberry 4.7 but
				// uses .value. See #6932
				var val = elem.attributes.value;
				return !val || val.specified ? elem.value : elem.text;
			}
		},
		select: {
			get: function( elem ) {
				var value,
					index = elem.selectedIndex,
					values = [],
					options = elem.options,
					one = elem.type === "select-one";

				// Nothing was selected
				if ( index < 0 ) {
					return null;
				}

				// Loop through all the selected options
				for ( var i = one ? index : 0, max = one ? index + 1 : options.length; i < max; i++ ) {
					var option = options[ i ];

					// Don't return options that are disabled or in a disabled optgroup
					if ( option.selected && (jQuery.support.optDisabled ? !option.disabled : option.getAttribute("disabled") === null) &&
							(!option.parentNode.disabled || !jQuery.nodeName( option.parentNode, "optgroup" )) ) {

						// Get the specific value for the option
						value = jQuery( option ).val();

						// We don't need an array for one selects
						if ( one ) {
							return value;
						}

						// Multi-Selects return an array
						values.push( value );
					}
				}

				// Fixes Bug #2551 -- select.val() broken in IE after form.reset()
				if ( one && !values.length && options.length ) {
					return jQuery( options[ index ] ).val();
				}

				return values;
			},

			set: function( elem, value ) {
				var values = jQuery.makeArray( value );

				jQuery(elem).find("option").each(function() {
					this.selected = jQuery.inArray( jQuery(this).val(), values ) >= 0;
				});

				if ( !values.length ) {
					elem.selectedIndex = -1;
				}
				return values;
			}
		}
	},

	attrFn: {
		val: true,
		css: true,
		html: true,
		text: true,
		data: true,
		width: true,
		height: true,
		offset: true
	},

	attr: function( elem, name, value, pass ) {
		var nType = elem.nodeType;

		// don't get/set attributes on text, comment and attribute nodes
		if ( !elem || nType === 3 || nType === 8 || nType === 2 ) {
			return undefined;
		}

		if ( pass && name in jQuery.attrFn ) {
			return jQuery( elem )[ name ]( value );
		}

		// Fallback to prop when attributes are not supported
		if ( !("getAttribute" in elem) ) {
			return jQuery.prop( elem, name, value );
		}

		var ret, hooks,
			notxml = nType !== 1 || !jQuery.isXMLDoc( elem );

		// Normalize the name if needed
		if ( notxml ) {
			name = name.toLowerCase();
			hooks = jQuery.attrHooks[ name ] || (rboolean.test( name ) ? boolHook : nodeHook);
		}

		if ( value !== undefined ) {

			if ( value === null ) {
				jQuery.removeAttr( elem, name );
				return undefined;

			} else if ( hooks && "set" in hooks && notxml && (ret = hooks.set( elem, value, name )) !== undefined ) {
				return ret;

			} else {
				elem.setAttribute( name, "" + value );
				return value;
			}

		} else if ( hooks && "get" in hooks && notxml && (ret = hooks.get( elem, name )) !== null ) {
			return ret;

		} else {

			ret = elem.getAttribute( name );

			// Non-existent attributes return null, we normalize to undefined
			return ret === null ?
				undefined :
				ret;
		}
	},

	removeAttr: function( elem, value ) {
		var propName, attrNames, name, l,
			i = 0;

		if ( elem.nodeType === 1 ) {
			attrNames = (value || "").split( rspace );
			l = attrNames.length;

			for ( ; i < l; i++ ) {
				name = attrNames[ i ].toLowerCase();

				// See #9699 for explanation of this approach (setting first, then removal)
				jQuery.attr( elem, name, "" );
				elem.removeAttribute( name );

				// Set corresponding property to false for boolean attributes
				if ( rboolean.test( name ) && (propName = jQuery.propFix[ name ] || name) in elem ) {
					elem[ propName ] = false;
				}
			}
		}
	},

	attrHooks: {
		type: {
			set: function( elem, value ) {
				// We can't allow the type property to be changed (since it causes problems in IE)
				if ( rtype.test( elem.nodeName ) && elem.parentNode ) {
					jQuery.error( "type property can't be changed" );
				} else if ( !jQuery.support.radioValue && value === "radio" && jQuery.nodeName(elem, "input") ) {
					// Setting the type on a radio button after the value resets the value in IE6-9
					// Reset value to it's default in case type is set after value
					// This is for element creation
					var val = elem.value;
					elem.setAttribute( "type", value );
					if ( val ) {
						elem.value = val;
					}
					return value;
				}
			}
		},
		// Use the value property for back compat
		// Use the nodeHook for button elements in IE6/7 (#1954)
		value: {
			get: function( elem, name ) {
				if ( nodeHook && jQuery.nodeName( elem, "button" ) ) {
					return nodeHook.get( elem, name );
				}
				return name in elem ?
					elem.value :
					null;
			},
			set: function( elem, value, name ) {
				if ( nodeHook && jQuery.nodeName( elem, "button" ) ) {
					return nodeHook.set( elem, value, name );
				}
				// Does not return so that setAttribute is also used
				elem.value = value;
			}
		}
	},

	propFix: {
		tabindex: "tabIndex",
		readonly: "readOnly",
		"for": "htmlFor",
		"class": "className",
		maxlength: "maxLength",
		cellspacing: "cellSpacing",
		cellpadding: "cellPadding",
		rowspan: "rowSpan",
		colspan: "colSpan",
		usemap: "useMap",
		frameborder: "frameBorder",
		contenteditable: "contentEditable"
	},

	prop: function( elem, name, value ) {
		var nType = elem.nodeType;

		// don't get/set properties on text, comment and attribute nodes
		if ( !elem || nType === 3 || nType === 8 || nType === 2 ) {
			return undefined;
		}

		var ret, hooks,
			notxml = nType !== 1 || !jQuery.isXMLDoc( elem );

		if ( notxml ) {
			// Fix name and attach hooks
			name = jQuery.propFix[ name ] || name;
			hooks = jQuery.propHooks[ name ];
		}

		if ( value !== undefined ) {
			if ( hooks && "set" in hooks && (ret = hooks.set( elem, value, name )) !== undefined ) {
				return ret;

			} else {
				return (elem[ name ] = value);
			}

		} else {
			if ( hooks && "get" in hooks && (ret = hooks.get( elem, name )) !== null ) {
				return ret;

			} else {
				return elem[ name ];
			}
		}
	},

	propHooks: {
		tabIndex: {
			get: function( elem ) {
				// elem.tabIndex doesn't always return the correct value when it hasn't been explicitly set
				// http://fluidproject.org/blog/2008/01/09/getting-setting-and-removing-tabindex-values-with-javascript/
				var attributeNode = elem.getAttributeNode("tabindex");

				return attributeNode && attributeNode.specified ?
					parseInt( attributeNode.value, 10 ) :
					rfocusable.test( elem.nodeName ) || rclickable.test( elem.nodeName ) && elem.href ?
						0 :
						undefined;
			}
		}
	}
});

// Add the tabIndex propHook to attrHooks for back-compat (different case is intentional)
jQuery.attrHooks.tabindex = jQuery.propHooks.tabIndex;

// Hook for boolean attributes
boolHook = {
	get: function( elem, name ) {
		// Align boolean attributes with corresponding properties
		// Fall back to attribute presence where some booleans are not supported
		var attrNode,
			property = jQuery.prop( elem, name );
		return property === true || typeof property !== "boolean" && ( attrNode = elem.getAttributeNode(name) ) && attrNode.nodeValue !== false ?
			name.toLowerCase() :
			undefined;
	},
	set: function( elem, value, name ) {
		var propName;
		if ( value === false ) {
			// Remove boolean attributes when set to false
			jQuery.removeAttr( elem, name );
		} else {
			// value is true since we know at this point it's type boolean and not false
			// Set boolean attributes to the same name and set the DOM property
			propName = jQuery.propFix[ name ] || name;
			if ( propName in elem ) {
				// Only set the IDL specifically if it already exists on the element
				elem[ propName ] = true;
			}

			elem.setAttribute( name, name.toLowerCase() );
		}
		return name;
	}
};

// IE6/7 do not support getting/setting some attributes with get/setAttribute
if ( !jQuery.support.getSetAttribute ) {

	fixSpecified = {
		name: true,
		id: true
	};

	// Use this for any attribute in IE6/7
	// This fixes almost every IE6/7 issue
	nodeHook = jQuery.valHooks.button = {
		get: function( elem, name ) {
			var ret;
			ret = elem.getAttributeNode( name );
			return ret && (fixSpecified[ name ] ? ret.nodeValue !== "" : ret.specified) ?
				ret.nodeValue :
				undefined;
		},
		set: function( elem, value, name ) {
			// Set the existing or create a new attribute node
			var ret = elem.getAttributeNode( name );
			if ( !ret ) {
				ret = document.createAttribute( name );
				elem.setAttributeNode( ret );
			}
			return (ret.nodeValue = value + "");
		}
	};

	// Apply the nodeHook to tabindex
	jQuery.attrHooks.tabindex.set = nodeHook.set;

	// Set width and height to auto instead of 0 on empty string( Bug #8150 )
	// This is for removals
	jQuery.each([ "width", "height" ], function( i, name ) {
		jQuery.attrHooks[ name ] = jQuery.extend( jQuery.attrHooks[ name ], {
			set: function( elem, value ) {
				if ( value === "" ) {
					elem.setAttribute( name, "auto" );
					return value;
				}
			}
		});
	});

	// Set contenteditable to false on removals(#10429)
	// Setting to empty string throws an error as an invalid value
	jQuery.attrHooks.contenteditable = {
		get: nodeHook.get,
		set: function( elem, value, name ) {
			if ( value === "" ) {
				value = "false";
			}
			nodeHook.set( elem, value, name );
		}
	};
}


// Some attributes require a special call on IE
if ( !jQuery.support.hrefNormalized ) {
	jQuery.each([ "href", "src", "width", "height" ], function( i, name ) {
		jQuery.attrHooks[ name ] = jQuery.extend( jQuery.attrHooks[ name ], {
			get: function( elem ) {
				var ret = elem.getAttribute( name, 2 );
				return ret === null ? undefined : ret;
			}
		});
	});
}

if ( !jQuery.support.style ) {
	jQuery.attrHooks.style = {
		get: function( elem ) {
			// Return undefined in the case of empty string
			// Normalize to lowercase since IE uppercases css property names
			return elem.style.cssText.toLowerCase() || undefined;
		},
		set: function( elem, value ) {
			return (elem.style.cssText = "" + value);
		}
	};
}

// Safari mis-reports the default selected property of an option
// Accessing the parent's selectedIndex property fixes it
if ( !jQuery.support.optSelected ) {
	jQuery.propHooks.selected = jQuery.extend( jQuery.propHooks.selected, {
		get: function( elem ) {
			var parent = elem.parentNode;

			if ( parent ) {
				parent.selectedIndex;

				// Make sure that it also works with optgroups, see #5701
				if ( parent.parentNode ) {
					parent.parentNode.selectedIndex;
				}
			}
			return null;
		}
	});
}

// Radios and checkboxes getter/setter
if ( !jQuery.support.checkOn ) {
	jQuery.each([ "radio", "checkbox" ], function() {
		jQuery.valHooks[ this ] = {
			get: function( elem ) {
				// Handle the case where in Webkit "" is returned instead of "on" if a value isn't specified
				return elem.getAttribute("value") === null ? "on" : elem.value;
			}
		};
	});
}
jQuery.each([ "radio", "checkbox" ], function() {
	jQuery.valHooks[ this ] = jQuery.extend( jQuery.valHooks[ this ], {
		set: function( elem, value ) {
			if ( jQuery.isArray( value ) ) {
				return (elem.checked = jQuery.inArray( jQuery(elem).val(), value ) >= 0);
			}
		}
	});
});




var rnamespaces = /\.(.*)$/,
	rformElems = /^(?:textarea|input|select)$/i,
	rperiod = /\./g,
	rspaces = / /g,
	rescape = /[^\w\s.|`]/g,
	rtypenamespace = /^([^\.]*)?(?:\.(.+))?$/,
	rhoverHack = /\bhover(\.\S+)?/,
	rkeyEvent = /^key/,
	rmouseEvent = /^(?:mouse|contextmenu)|click/,
	rquickIs = /^([\w\-]+)?(?:#([\w\-]+))?(?:\.([\w\-]+))?(?:\[([\w+\-]+)=["']?([\w\-]*)["']?\])?$/,
	quickParse = function( selector ) {
		var quick = rquickIs.exec( selector );
		if ( quick ) {
			//   0  1    2   3      4         5
			// [ _, tag, id, class, attrName, attrValue ]
			quick[1] = ( quick[1] || "" ).toLowerCase();
			quick[3] = quick[3] && new RegExp( "\\b" + quick[3] + "\\b" );
		}
		return quick;
	},
	quickIs = function( elem, m ) {
		return (
			(!m[1] || elem.nodeName.toLowerCase() === m[1]) &&
			(!m[2] || elem.id === m[2]) &&
			(!m[3] || m[3].test( elem.className )) &&
			(!m[4] || elem.getAttribute( m[4] ) == m[5])
		);
	};

/*
 * Helper functions for managing events -- not part of the public interface.
 * Props to Dean Edwards' addEvent library for many of the ideas.
 */
jQuery.event = {

	add: function( elem, types, handler, data, selector ) {

		var elemData, eventHandle, events,
			t, tns, type, namespaces, handleObj,
			handleObjIn, quick, handlers, special;

		// Don't attach events to noData or text/comment nodes (allow plain objects tho)
		if ( elem.nodeType === 3 || elem.nodeType === 8 || !types || !handler || !(elemData = jQuery._data( elem )) ) {
			return;
		}

		// Caller can pass in an object of custom data in lieu of the handler
		if ( handler.handler ) {
			handleObjIn = handler;
			handler = handleObjIn.handler;
		}

		// Make sure that the handler has a unique ID, used to find/remove it later
		if ( !handler.guid ) {
			handler.guid = jQuery.guid++;
		}

		// Init the element's event structure and main handler, if this is the first
		events = elemData.events;
		if ( !events ) {
			elemData.events = events = {};
		}
		eventHandle = elemData.handle;
		if ( !eventHandle ) {
			elemData.handle = eventHandle = function( e ) {
				// Discard the second event of a jQuery.event.trigger() and
				// when an event is called after a page has unloaded
				return typeof jQuery !== "undefined" && (!e || jQuery.event.triggered !== e.type) ?
					jQuery.event.handle.apply( eventHandle.elem, arguments ) :
					undefined;
			};
			// Add elem as a property of the handle fn to prevent a memory leak with IE non-native events
			eventHandle.elem = elem;
		}

		// Handle multiple events separated by a space
		// jQuery(...).bind("mouseover mouseout", fn);
		types = types.replace( rhoverHack, "mouseover$1 mouseout$1" ).split( " " );
		for ( t = 0; t < types.length; t++ ) {

			tns = rtypenamespace.exec( types[t] ) || [];
			type = tns[1];
			namespaces = (tns[2] || "").split( "." ).sort();

			// If event changes its type, use the special event handlers for the changed type
			special = jQuery.event.special[ type ] || {};

			// If selector defined, determine special event api type, otherwise given type
			type = ( selector ? special.delegateType : special.bindType ) || type;

			// Update special based on newly reset type
			special = jQuery.event.special[ type ] || {};

			// handleObj is passed to all event handlers
			handleObj = jQuery.extend({
				type: type,
				origType: tns[1],
				data: data,
				handler: handler,
				guid: handler.guid,
				selector: selector,
				namespace: namespaces.join(".")
			}, handleObjIn );

			// Delegated event; pre-analyze selector so it's processed quickly on event dispatch
			if ( selector ) {
				handleObj.quick = quickParse( selector );
				if ( !handleObj.quick && jQuery.expr.match.POS.test( selector ) ) {
					handleObj.isPositional = true;
				}
			}

			// Init the event handler queue if we're the first
			handlers = events[ type ];
			if ( !handlers ) {
				handlers = events[ type ] = [];
				handlers.delegateCount = 0;

				// Only use addEventListener/attachEvent if the special events handler returns false
				if ( !special.setup || special.setup.call( elem, data, namespaces, eventHandle ) === false ) {
					// Bind the global event handler to the element
					if ( elem.addEventListener ) {
						elem.addEventListener( type, eventHandle, false );

					} else if ( elem.attachEvent ) {
						elem.attachEvent( "on" + type, eventHandle );
					}
				}
			}

			if ( special.add ) {
				special.add.call( elem, handleObj );

				if ( !handleObj.handler.guid ) {
					handleObj.handler.guid = handler.guid;
				}
			}

			// Add to the element's handler list, delegates in front
			if ( selector ) {
				handlers.splice( handlers.delegateCount++, 0, handleObj );
			} else {
				handlers.push( handleObj );
			}

			// Keep track of which events have ever been used, for event optimization
			jQuery.event.global[ type ] = true;
		}

		// Nullify elem to prevent memory leaks in IE
		elem = null;
	},

	global: {},

	// Detach an event or set of events from an element
	remove: function( elem, types, handler, selector ) {

		var elemData = jQuery.hasData( elem ) && jQuery._data( elem ),
			t, tns, type, namespaces, origCount,
			j, events, special, handle, eventType, handleObj;

		if ( !elemData || !(events = elemData.events) ) {
			return;
		}

		// For removal, types can be an Event object
		if ( types && types.type && types.handler ) {
			handler = types.handler;
			types = types.type;
			selector = types.selector;
		}

		// Once for each type.namespace in types; type may be omitted
		types = (types || "").replace( rhoverHack, "mouseover$1 mouseout$1" ).split(" ");
		for ( t = 0; t < types.length; t++ ) {
			tns = rtypenamespace.exec( types[t] ) || [];
			type = tns[1];
			namespaces = tns[2];

			// Unbind all events (on this namespace, if provided) for the element
			if ( !type ) {
				namespaces = namespaces? "." + namespaces : "";
				for ( j in events ) {
					jQuery.event.remove( elem, j + namespaces, handler, selector );
				}
				return;
			}

			special = jQuery.event.special[ type ] || {};
			type = ( selector? special.delegateType : special.bindType ) || type;
			eventType = events[ type ] || [];
			origCount = eventType.length;
			namespaces = namespaces ? new RegExp("(^|\\.)" + namespaces.split(".").sort().join("\\.(?:.*\\.)?") + "(\\.|$)") : null;

			// Only need to loop for special events or selective removal
			if ( handler || namespaces || selector || special.remove ) {
				for ( j = 0; j < eventType.length; j++ ) {
					handleObj = eventType[ j ];

					if ( !handler || handler.guid === handleObj.guid ) {
						if ( !namespaces || namespaces.test( handleObj.namespace ) ) {
							if ( !selector || selector === handleObj.selector || selector === "**" && handleObj.selector ) {
								eventType.splice( j--, 1 );

								if ( handleObj.selector ) {
									eventType.delegateCount--;
								}
								if ( special.remove ) {
									special.remove.call( elem, handleObj );
								}
							}
						}
					}
				}
			} else {
				// Removing all events
				eventType.length = 0;
			}

			// Remove generic event handler if we removed something and no more handlers exist
			// (avoids potential for endless recursion during removal of special event handlers)
			if ( eventType.length === 0 && origCount !== eventType.length ) {
				if ( !special.teardown || special.teardown.call( elem, namespaces ) === false ) {
					jQuery.removeEvent( elem, type, elemData.handle );
				}

				delete events[ type ];
			}
		}

		// Remove the expando if it's no longer used
		if ( jQuery.isEmptyObject( events ) ) {
			handle = elemData.handle;
			if ( handle ) {
				handle.elem = null;
			}

			// removeData also checks for emptiness and clears the expando if empty
			// so use it instead of delete
			jQuery.removeData( elem, [ "events", "handle" ], true );
		}
	},

	// Events that are safe to short-circuit if no handlers are attached.
	// Native DOM events should not be added, they may have inline handlers.
	customEvent: {
		"getData": true,
		"setData": true,
		"changeData": true
	},

	trigger: function( event, data, elem, onlyHandlers ) {
		// Don't do events on text and comment nodes
		if ( elem && (elem.nodeType === 3 || elem.nodeType === 8) ) {
			return;
		}

		// Event object or event type
		var type = event.type || event,
			namespaces = [],
			cache, exclusive, i, cur, old, ontype, special, handle, eventPath, bubbleType;

		if ( type.indexOf( "!" ) >= 0 ) {
			// Exclusive events trigger only for the exact event (no namespaces)
			type = type.slice(0, -1);
			exclusive = true;
		}

		if ( type.indexOf( "." ) >= 0 ) {
			// Namespaced trigger; create a regexp to match event type in handle()
			namespaces = type.split(".");
			type = namespaces.shift();
			namespaces.sort();
		}

		if ( (!elem || jQuery.event.customEvent[ type ]) && !jQuery.event.global[ type ] ) {
			// No jQuery handlers for this event type, and it can't have inline handlers
			return;
		}

		// Caller can pass in an Event, Object, or just an event type string
		event = typeof event === "object" ?
			// jQuery.Event object
			event[ jQuery.expando ] ? event :
			// Object literal
			new jQuery.Event( type, event ) :
			// Just the event type (string)
			new jQuery.Event( type );

		event.type = type;
		event.isTrigger = true;
		event.exclusive = exclusive;
		event.namespace = namespaces.join( "." );
		event.namespace_re = event.namespace? new RegExp("(^|\\.)" + namespaces.join("\\.(?:.*\\.)?") + "(\\.|$)") : null;
		ontype = type.indexOf( ":" ) < 0 ? "on" + type : "";

		// triggerHandler() and global events don't bubble or run the default action
		if ( onlyHandlers || !elem ) {
			event.preventDefault();
		}

		// Handle a global trigger
		if ( !elem ) {

			// TODO: Stop taunting the data cache; remove global events and always attach to document
			cache = jQuery.cache;
			event.stopPropagation();
			for ( i in cache ) {
				if ( cache[ i ].events && cache[ i ].events[ type ] ) {
					jQuery.event.trigger( event, data, cache[ i ].handle.elem );
				}
			}
			return;
		}

		// Clean up the event in case it is being reused
		event.result = undefined;
		if ( !event.target ) {
			event.target = elem;
		}

		// Clone any incoming data and prepend the event, creating the handler arg list
		data = data != null ? jQuery.makeArray( data ) : [];
		data.unshift( event );

		// Allow special events to draw outside the lines
		special = jQuery.event.special[ type ] || {};
		if ( special.trigger && special.trigger.apply( elem, data ) === false ) {
			return;
		}

		// Determine event propagation path in advance, per W3C events spec (#9951)
		// Bubble up to document, then to window; watch for a global ownerDocument var (#9724)
		eventPath = [[ elem, special.bindType || type ]];
		if ( !onlyHandlers && !special.noBubble && !jQuery.isWindow( elem ) ) {

			bubbleType = special.delegateType || type;
			old = null;
			for ( cur = elem.parentNode; cur; cur = cur.parentNode ) {
				eventPath.push([ cur, bubbleType ]);
				old = cur;
			}

			// Only add window if we got to document (e.g., not plain obj or detached DOM)
			if ( old && old === elem.ownerDocument ) {
				eventPath.push([ old.defaultView || old.parentWindow || window, bubbleType ]);
			}
		}

		// Fire handlers on the event path
		for ( i = 0; i < eventPath.length; i++ ) {

			cur = eventPath[i][0];
			event.type = eventPath[i][1];

			handle = (jQuery._data( cur, "events" ) || {})[ event.type ] && jQuery._data( cur, "handle" );
			if ( handle ) {
				handle.apply( cur, data );
			}
			handle = ontype && cur[ ontype ];
			if ( handle && jQuery.acceptData( cur ) ) {
				handle.apply( cur, data );
			}

			if ( event.isPropagationStopped() ) {
				break;
			}
		}
		event.type = type;

		// If nobody prevented the default action, do it now
		if ( !event.isDefaultPrevented() ) {

			if ( (!special._default || special._default.call( elem.ownerDocument, event, data ) === false) &&
				!(type === "click" && jQuery.nodeName( elem, "a" )) && jQuery.acceptData( elem ) ) {

				// Call a native DOM method on the target with the same name name as the event.
				// Can't use an .isFunction() check here because IE6/7 fails that test.
				// Don't do default actions on window, that's where global variables be (#6170)
				// IE<9 dies on focus/blur to hidden element (#1486)
				if ( ontype && elem[ type ] && ((type !== "focus" && type !== "blur") || event.target.offsetWidth !== 0) && !jQuery.isWindow( elem ) ) {

					// Don't re-trigger an onFOO event when we call its FOO() method
					old = elem[ ontype ];

					if ( old ) {
						elem[ ontype ] = null;
					}

					// Prevent re-triggering of the same event, since we already bubbled it above
					jQuery.event.triggered = type;
					elem[ type ]();
					jQuery.event.triggered = undefined;

					if ( old ) {
						elem[ ontype ] = old;
					}
				}
			}
		}

		return event.result;
	},

	handle: function( event ) {

		// Make a writable jQuery.Event from the native event object
		event = jQuery.event.fix( event || window.event );

		var handlers = ((jQuery._data( this, "events" ) || {})[ event.type ] || []),
			delegateCount = handlers.delegateCount,
			args = [].slice.call( arguments, 0 ),
			handlerQueue = [],
			i, cur, selMatch, matches, handleObj, sel, hit, related;

		// Use the fix-ed jQuery.Event rather than the (read-only) native event
		args[0] = event;

		// Determine handlers that should run if there are delegated events
		// Avoid disabled elements in IE (#6911) and non-left-click bubbling in Firefox (#3861)
		if ( delegateCount && !event.target.disabled && !(event.button && event.type === "click") ) {

			for ( cur = event.target; cur != this; cur = cur.parentNode || this ) {
				selMatch = {};
				matches = [];
				for ( i = 0; i < delegateCount; i++ ) {
					handleObj = handlers[ i ];
					sel = handleObj.selector;
					hit = selMatch[ sel ];

					if ( handleObj.isPositional ) {
						// Since .is() does not work for positionals; see http://jsfiddle.net/eJ4yd/3/
						hit = ( hit || (selMatch[ sel ] = jQuery( sel )) ).index( cur ) >= 0;
					} else if ( hit === undefined ) {
						hit = selMatch[ sel ] = ( handleObj.quick ? quickIs( cur, handleObj.quick ) : jQuery( cur ).is( sel ) );
					}
					if ( hit ) {
						matches.push( handleObj );
					}
				}
				if ( matches.length ) {
					handlerQueue.push({ elem: cur, matches: matches });
				}
			}
		}

		// Copy the remaining (bound) handlers in case they're changed
		handlers = handlers.slice( delegateCount );

		// Run delegates first; they may want to stop propagation beneath us
		event.delegateTarget = this;
		for ( i = 0; i < handlerQueue.length && !event.isPropagationStopped(); i++ ) {
			matched = handlerQueue[ i ];
			dispatch( matched.elem, event, matched.matches, args );
		}
		delete event.delegateTarget;

		// Run non-delegated handlers for this level
		if ( handlers.length ) {
			dispatch( this, event, handlers, args );
		}

		return event.result;
	},

	// Includes some event props shared by KeyEvent and MouseEvent
	// *** attrChange attrName relatedNode srcElement  are not normalized, non-W3C, deprecated, will be removed in 1.8 ***
	props: "attrChange attrName relatedNode srcElement altKey bubbles cancelable ctrlKey currentTarget eventPhase metaKey relatedTarget shiftKey target timeStamp view which".split(" "),

	fixHooks: {},

	keyHooks: {
		props: "char charCode key keyCode".split(" "),
		filter: function( event, original ) {

			// Add which for key events
			if ( event.which == null ) {
				event.which = original.charCode != null ? original.charCode : original.keyCode;
			}

			return event;
		}
	},

	mouseHooks: {
		props: "button buttons clientX clientY fromElement layerX layerY offsetX offsetY pageX pageY screenX screenY toElement wheelDelta".split(" "),
		filter: function( event, original ) {
			var eventDoc, doc, body,
				button = original.button,
				fromElement = original.fromElement;

			// Calculate pageX/Y if missing and clientX/Y available
			if ( event.pageX == null && original.clientX != null ) {
				eventDoc = event.target.ownerDocument || document;
				doc = eventDoc.documentElement;
				body = eventDoc.body;

				event.pageX = original.clientX + (doc && doc.scrollLeft || body && body.scrollLeft || 0) - (doc && doc.clientLeft || body && body.clientLeft || 0);
				event.pageY = original.clientY + (doc && doc.scrollTop  || body && body.scrollTop  || 0) - (doc && doc.clientTop  || body && body.clientTop  || 0);
			}

			// Add relatedTarget, if necessary
			if ( !event.relatedTarget && fromElement ) {
				event.relatedTarget = fromElement === event.target ? original.toElement : fromElement;
			}

			// Add which for click: 1 === left; 2 === middle; 3 === right
			// Note: button is not normalized, so don't use it
			if ( !event.which && button !== undefined ) {
				event.which = ( button & 1 ? 1 : ( button & 2 ? 3 : ( button & 4 ? 2 : 0 ) ) );
			}

			return event;
		}
	},

	fix: function( event ) {
		if ( event[ jQuery.expando ] ) {
			return event;
		}

		// Create a writable copy of the event object and normalize some properties
		var i, prop,
			originalEvent = event,
			fixHook = jQuery.event.fixHooks[ event.type ] || {},
			copy = fixHook.props ? this.props.concat( fixHook.props ) : this.props;

		event = jQuery.Event( originalEvent );

		for ( i = copy.length; i; ) {
			prop = copy[ --i ];
			event[ prop ] = originalEvent[ prop ];
		}

		// Fix target property, if necessary (#1925, IE 6/7/8 & Safari2)
		if ( !event.target ) {
			event.target = originalEvent.srcElement || document;
		}

		// Target should not be a text node (#504, Safari)
		if ( event.target.nodeType === 3 ) {
			event.target = event.target.parentNode;
		}

		// For mouse/key events; add metaKey if it's not there (#3368, IE6/7/8)
		if ( event.metaKey === undefined ) {
			event.metaKey = event.ctrlKey;
		}

		return fixHook.filter? fixHook.filter( event, originalEvent ) : event;
	},

	special: {
		ready: {
			// Make sure the ready event is setup
			setup: jQuery.bindReady
		},

		focus: {
			delegateType: "focusin",
			noBubble: true
		},
		blur: {
			delegateType: "focusout",
			noBubble: true
		},

		beforeunload: {
			setup: function( data, namespaces, eventHandle ) {
				// We only want to do this special case on windows
				if ( jQuery.isWindow( this ) ) {
					this.onbeforeunload = eventHandle;
				}
			},

			teardown: function( namespaces, eventHandle ) {
				if ( this.onbeforeunload === eventHandle ) {
					this.onbeforeunload = null;
				}
			}
		}
	},

	simulate: function( type, elem, event, bubble ) {
		// Piggyback on a donor event to simulate a different one.
		// Fake originalEvent to avoid donor's stopPropagation, but if the
		// simulated event prevents default then we do the same on the donor.
		var e = jQuery.extend(
			new jQuery.Event(),
			event,
			{ type: type,
				isSimulated: true,
				originalEvent: {}
			}
		);
		if ( bubble ) {
			jQuery.event.trigger( e, null, elem );
		} else {
			jQuery.event.handle.call( elem, e );
		}
		if ( e.isDefaultPrevented() ) {
			event.preventDefault();
		}
	}
};

// Run jQuery handler functions; called from jQuery.event.handle
function dispatch( target, event, handlers, args ) {
	var run_all = !event.exclusive && !event.namespace,
		specialHandle = ( jQuery.event.special[ event.type ] || {} ).handle,
		j, handleObj, ret;

	event.currentTarget = target;
	for ( j = 0; j < handlers.length && !event.isImmediatePropagationStopped(); j++ ) {
		handleObj = handlers[ j ];

		// Triggered event must either 1) be non-exclusive and have no namespace, or
		// 2) have namespace(s) a subset or equal to those in the bound event (both can have no namespace).
		if ( run_all || (!event.namespace && !handleObj.namespace) || event.namespace_re && event.namespace_re.test( handleObj.namespace ) ) {

			// Pass in a reference to the handler function itself
			// So that we can later remove it
			event.handler = handleObj.handler;
			event.data = handleObj.data;
			event.handleObj = handleObj;

			ret = ( specialHandle || handleObj.handler ).apply( target, args );

			if ( ret !== undefined ) {
				event.result = ret;
				if ( ret === false ) {
					event.preventDefault();
					event.stopPropagation();
				}
			}
		}
	}
}

jQuery.removeEvent = document.removeEventListener ?
	function( elem, type, handle ) {
		if ( elem.removeEventListener ) {
			elem.removeEventListener( type, handle, false );
		}
	} :
	function( elem, type, handle ) {
		if ( elem.detachEvent ) {
			elem.detachEvent( "on" + type, handle );
		}
	};

jQuery.Event = function( src, props ) {
	// Allow instantiation without the 'new' keyword
	if ( !(this instanceof jQuery.Event) ) {
		return new jQuery.Event( src, props );
	}

	// Event object
	if ( src && src.type ) {
		this.originalEvent = src;
		this.type = src.type;

		// Events bubbling up the document may have been marked as prevented
		// by a handler lower down the tree; reflect the correct value.
		this.isDefaultPrevented = ( src.defaultPrevented || src.returnValue === false ||
			src.getPreventDefault && src.getPreventDefault() ) ? returnTrue : returnFalse;

	// Event type
	} else {
		this.type = src;
	}

	// Put explicitly provided properties onto the event object
	if ( props ) {
		jQuery.extend( this, props );
	}

	// Create a timestamp if incoming event doesn't have one
	this.timeStamp = src && src.timeStamp || jQuery.now();

	// Mark it as fixed
	this[ jQuery.expando ] = true;
};

function returnFalse() {
	return false;
}
function returnTrue() {
	return true;
}

// jQuery.Event is based on DOM3 Events as specified by the ECMAScript Language Binding
// http://www.w3.org/TR/2003/WD-DOM-Level-3-Events-20030331/ecma-script-binding.html
jQuery.Event.prototype = {
	preventDefault: function() {
		this.isDefaultPrevented = returnTrue;

		var e = this.originalEvent;
		if ( !e ) {
			return;
		}

		// if preventDefault exists run it on the original event
		if ( e.preventDefault ) {
			e.preventDefault();

		// otherwise set the returnValue property of the original event to false (IE)
		} else {
			e.returnValue = false;
		}
	},
	stopPropagation: function() {
		this.isPropagationStopped = returnTrue;

		var e = this.originalEvent;
		if ( !e ) {
			return;
		}
		// if stopPropagation exists run it on the original event
		if ( e.stopPropagation ) {
			e.stopPropagation();
		}
		// otherwise set the cancelBubble property of the original event to true (IE)
		e.cancelBubble = true;
	},
	stopImmediatePropagation: function() {
		this.isImmediatePropagationStopped = returnTrue;
		this.stopPropagation();
	},
	isDefaultPrevented: returnFalse,
	isPropagationStopped: returnFalse,
	isImmediatePropagationStopped: returnFalse
};

// Create mouseenter/leave events using mouseover/out and event-time checks
jQuery.each({
	mouseenter: "mouseover",
	mouseleave: "mouseout"
}, function( orig, fix ) {
	jQuery.event.special[ orig ] = jQuery.event.special[ fix ] = {
		delegateType: fix,
		bindType: fix,

		handle: function( event ) {
			var target = this,
				related = event.relatedTarget,
				handleObj = event.handleObj,
				selector = handleObj.selector,
				oldType, ret;

			// For a real mouseover/out, always call the handler; for
			// mousenter/leave call the handler if related is outside the target.
			// NB: No relatedTarget if the mouse left/entered the browser window
			if ( !related || handleObj.origType === event.type || (related !== target && !jQuery.contains( target, related )) ) {
				oldType = event.type;
				event.type = handleObj.origType;
				ret = handleObj.handler.apply( this, arguments );
				event.type = oldType;
			}
			return ret;
		}
	};
});

// IE submit delegation
if ( !jQuery.support.submitBubbles ) {

	jQuery.event.special.submit = {
		setup: function() {
			// Only need this for delegated form submit events
			if ( jQuery.nodeName( this, "form" ) ) {
				return false;
			}

			// Lazy-add a submit handler when a descendant form may potentially be submitted
			jQuery.event.add( this, "click._submit keypress._submit", function( e ) {
				// Node name check avoids a VML-related crash in IE (#9807)
				var elem = e.target,
					form = jQuery.nodeName( elem, "input" ) || jQuery.nodeName( elem, "button" ) ? elem.form : undefined;
				if ( form && !form._submit_attached ) {
					jQuery.event.add( form, "submit._submit", function( event ) {
						// Form was submitted, bubble the event up the tree
						if ( this.parentNode ) {
							jQuery.event.simulate( "submit", this.parentNode, event, true );
						}
					});
					form._submit_attached = true;
				}
			});
			// return undefined since we don't need an event listener
		},

		teardown: function() {
			// Only need this for delegated form submit events
			if ( jQuery.nodeName( this, "form" ) ) {
				return false;
			}

			// Remove delegated handlers; cleanData eventually reaps submit handlers attached above
			jQuery.event.remove( this, "._submit" );
		}
	};
}

// IE change delegation and checkbox/radio fix
if ( !jQuery.support.changeBubbles ) {

	jQuery.event.special.change = {

		setup: function() {

			if ( rformElems.test( this.nodeName ) ) {
				// IE doesn't fire change on a check/radio until blur; trigger it on click
				// after a propertychange. Eat the blur-change in special.change.handle.
				// This still fires onchange a second time for check/radio after blur.
				if ( this.type === "checkbox" || this.type === "radio" ) {
					jQuery.event.add( this, "propertychange._change", function( event ) {
						if ( event.originalEvent.propertyName === "checked" ) {
							this._just_changed = true;
						}
					});
					jQuery.event.add( this, "click._change", function( event ) {
						if ( this._just_changed ) {
							this._just_changed = false;
							jQuery.event.simulate( "change", this, event, true );
						}
					});
				}
				return false;
			}
			// Delegated event; lazy-add a change handler on descendant inputs
			jQuery.event.add( this, "beforeactivate._change", function( e ) {
				var elem = e.target;

				if ( rformElems.test( elem.nodeName ) && !elem._change_attached ) {
					jQuery.event.add( elem, "change._change", function( event ) {
						if ( this.parentNode && !event.isSimulated ) {
							jQuery.event.simulate( "change", this.parentNode, event, true );
						}
					});
					elem._change_attached = true;
				}
			});
		},

		handle: function( event ) {
			var elem = event.target;

			// Swallow native change events from checkbox/radio, we already triggered them above
			if ( this !== elem || event.isSimulated || event.isTrigger || (elem.type !== "radio" && elem.type !== "checkbox") ) {
				return event.handleObj.handler.apply( this, arguments );
			}
		},

		teardown: function() {
			jQuery.event.remove( this, "._change" );

			return rformElems.test( this.nodeName );
		}
	};
}

// Create "bubbling" focus and blur events
if ( !jQuery.support.focusinBubbles ) {
	jQuery.each({ focus: "focusin", blur: "focusout" }, function( orig, fix ) {

		// Attach a single capturing handler while someone wants focusin/focusout
		var attaches = 0,
			handler = function( event ) {
				jQuery.event.simulate( fix, event.target, jQuery.event.fix( event ), true );
			};

		jQuery.event.special[ fix ] = {
			setup: function() {
				if ( attaches++ === 0 ) {
					document.addEventListener( orig, handler, true );
				}
			},
			teardown: function() {
				if ( --attaches === 0 ) {
					document.removeEventListener( orig, handler, true );
				}
			}
		};
	});
}

jQuery.fn.extend({

	on: function( types, selector, data, fn, /*INTERNAL*/ one ) {
		var origFn, type;

		// Types can be a map of types/handlers
		if ( typeof types === "object" ) {
			// ( types-Object, selector, data )
			if ( typeof selector !== "string" ) {
				// ( types-Object, data )
				data = selector;
				selector = undefined;
			}
			for ( type in types ) {
				this.on( type, selector, data, types[ type ], one );
			}
			return this;
		}

		if ( data == null && fn == null ) {
			// ( types, fn )
			fn = selector;
			data = selector = undefined;
		} else if ( fn == null ) {
			if ( typeof selector === "string" ) {
				// ( types, selector, fn )
				fn = data;
				data = undefined;
			} else {
				// ( types, data, fn )
				fn = data;
				data = selector;
				selector = undefined;
			}
		}
		if ( fn === false ) {
			fn = returnFalse;
		} else if ( !fn ) {
			return this;
		}

		if ( one === 1 ) {
			origFn = fn;
			fn = function( event ) {
				jQuery.event.remove( event.delegateTarget || this, event );
				return origFn.apply( this, arguments );
			};
			// Use same guid so caller can remove using origFn
			fn.guid = origFn.guid || ( origFn.guid = jQuery.guid++ );
		}
		return this.each( function() {
			jQuery.event.add( this, types, fn, data, selector );
		});
	},
	one: function( types, selector, data, fn ) {
		return this.on.call( this, types, selector, data, fn, 1 );
	},
	off: function( types, selector, fn ) {
		if ( types && types.preventDefault ) {
			// ( event )  native or jQuery.Event
			return this.off( types.type, types.handler, types.selector );
		}
		if ( typeof types === "object" ) {
			// ( types-object [, selector] )
			for ( var type in types ) {
				this.off( type, selector, types[ type ] );
			}
			return this;
		}
		if ( selector === false || typeof selector === "function" ) {
			// ( types [, fn] )
			fn = selector;
			selector = undefined;
		}
		if ( fn === false ) {
			fn = returnFalse;
		}
		return this.each(function() {
			jQuery.event.remove( this, types, fn, selector );
		});
	},

	bind: function( types, data, fn ) {
		return this.on( types, null, data, fn );
	},
	unbind: function( types, fn ) {
		return this.off( types, null, fn );
	},

	live: function( types, data, fn ) {
		jQuery( this.context ).on( types, this.selector, data, fn );
		return this;
	},
	die: function( types, fn ) {
		jQuery( this.context ).off( types, this.selector || "**", fn );
		return this;
	},

	delegate: function( selector, types, data, fn ) {
		return this.on( types, selector, data, fn );
	},
	undelegate: function( selector, types, fn ) {
		// ( namespace ) or ( selector, types [, fn] )
		return arguments.length == 1? this.off( selector, "**" ) : this.off( types, selector, fn );
	},

	trigger: function( type, data ) {
		return this.each(function() {
			jQuery.event.trigger( type, data, this );
		});
	},
	triggerHandler: function( type, data ) {
		if ( this[0] ) {
			return jQuery.event.trigger( type, data, this[0], true );
		}
	},

	toggle: function( fn ) {
		// Save reference to arguments for access in closure
		var args = arguments,
			guid = fn.guid || jQuery.guid++,
			i = 0,
			toggler = function( event ) {
				// Figure out which function to execute
				var lastToggle = ( jQuery._data( this, "lastToggle" + fn.guid ) || 0 ) % i;
				jQuery._data( this, "lastToggle" + fn.guid, lastToggle + 1 );

				// Make sure that clicks stop
				event.preventDefault();

				// and execute the function
				return args[ lastToggle ].apply( this, arguments ) || false;
			};

		// link all the functions, so any of them can unbind this click handler
		toggler.guid = guid;
		while ( i < args.length ) {
			args[ i++ ].guid = guid;
		}

		return this.click( toggler );
	},

	hover: function( fnOver, fnOut ) {
		return this.mouseenter( fnOver ).mouseleave( fnOut || fnOver );
	}
});

jQuery.each( ("blur focus focusin focusout load resize scroll unload click dblclick " +
	"mousedown mouseup mousemove mouseover mouseout mouseenter mouseleave " +
	"change select submit keydown keypress keyup error contextmenu").split(" "), function( i, name ) {

	// Handle event binding
	jQuery.fn[ name ] = function( data, fn ) {
		if ( fn == null ) {
			fn = data;
			data = null;
		}

		return arguments.length > 0 ?
			this.bind( name, data, fn ) :
			this.trigger( name );
	};

	if ( jQuery.attrFn ) {
		jQuery.attrFn[ name ] = true;
	}

	if ( rkeyEvent.test( name ) ) {
		jQuery.event.fixHooks[ name ] = jQuery.event.keyHooks;
	}

	if ( rmouseEvent.test( name ) ) {
		jQuery.event.fixHooks[ name ] = jQuery.event.mouseHooks;
	}
});



/*!
 * Sizzle CSS Selector Engine
 *  Copyright 2011, The Dojo Foundation
 *  Released under the MIT, BSD, and GPL Licenses.
 *  More information: http://sizzlejs.com/
 */
(function(){

var chunker = /((?:\((?:\([^()]+\)|[^()]+)+\)|\[(?:\[[^\[\]]*\]|['"][^'"]*['"]|[^\[\]'"]+)+\]|\\.|[^ >+~,(\[\\]+)+|[>+~])(\s*,\s*)?((?:.|\r|\n)*)/g,
	expando = "sizcache" + (Math.random() + '').replace('.', ''),
	done = 0,
	toString = Object.prototype.toString,
	hasDuplicate = false,
	baseHasDuplicate = true,
	rBackslash = /\\/g,
	rReturn = /\r\n/g,
	rNonWord = /\W/;

// Here we check if the JavaScript engine is using some sort of
// optimization where it does not always call our comparision
// function. If that is the case, discard the hasDuplicate value.
//   Thus far that includes Google Chrome.
[0, 0].sort(function() {
	baseHasDuplicate = false;
	return 0;
});

var Sizzle = function( selector, context, results, seed ) {
	results = results || [];
	context = context || document;

	var origContext = context;

	if ( context.nodeType !== 1 && context.nodeType !== 9 ) {
		return [];
	}
	
	if ( !selector || typeof selector !== "string" ) {
		return results;
	}

	var m, set, checkSet, extra, ret, cur, pop, i,
		prune = true,
		contextXML = Sizzle.isXML( context ),
		parts = [],
		soFar = selector;
	
	// Reset the position of the chunker regexp (start from head)
	do {
		chunker.exec( "" );
		m = chunker.exec( soFar );

		if ( m ) {
			soFar = m[3];
		
			parts.push( m[1] );
		
			if ( m[2] ) {
				extra = m[3];
				break;
			}
		}
	} while ( m );

	if ( parts.length > 1 && origPOS.exec( selector ) ) {

		if ( parts.length === 2 && Expr.relative[ parts[0] ] ) {
			set = posProcess( parts[0] + parts[1], context, seed );

		} else {
			set = Expr.relative[ parts[0] ] ?
				[ context ] :
				Sizzle( parts.shift(), context );

			while ( parts.length ) {
				selector = parts.shift();

				if ( Expr.relative[ selector ] ) {
					selector += parts.shift();
				}
				
				set = posProcess( selector, set, seed );
			}
		}

	} else {
		// Take a shortcut and set the context if the root selector is an ID
		// (but not if it'll be faster if the inner selector is an ID)
		if ( !seed && parts.length > 1 && context.nodeType === 9 && !contextXML &&
				Expr.match.ID.test(parts[0]) && !Expr.match.ID.test(parts[parts.length - 1]) ) {

			ret = Sizzle.find( parts.shift(), context, contextXML );
			context = ret.expr ?
				Sizzle.filter( ret.expr, ret.set )[0] :
				ret.set[0];
		}

		if ( context ) {
			ret = seed ?
				{ expr: parts.pop(), set: makeArray(seed) } :
				Sizzle.find( parts.pop(), parts.length === 1 && (parts[0] === "~" || parts[0] === "+") && context.parentNode ? context.parentNode : context, contextXML );

			set = ret.expr ?
				Sizzle.filter( ret.expr, ret.set ) :
				ret.set;

			if ( parts.length > 0 ) {
				checkSet = makeArray( set );

			} else {
				prune = false;
			}

			while ( parts.length ) {
				cur = parts.pop();
				pop = cur;

				if ( !Expr.relative[ cur ] ) {
					cur = "";
				} else {
					pop = parts.pop();
				}

				if ( pop == null ) {
					pop = context;
				}

				Expr.relative[ cur ]( checkSet, pop, contextXML );
			}

		} else {
			checkSet = parts = [];
		}
	}

	if ( !checkSet ) {
		checkSet = set;
	}

	if ( !checkSet ) {
		Sizzle.error( cur || selector );
	}

	if ( toString.call(checkSet) === "[object Array]" ) {
		if ( !prune ) {
			results.push.apply( results, checkSet );

		} else if ( context && context.nodeType === 1 ) {
			for ( i = 0; checkSet[i] != null; i++ ) {
				if ( checkSet[i] && (checkSet[i] === true || checkSet[i].nodeType === 1 && Sizzle.contains(context, checkSet[i])) ) {
					results.push( set[i] );
				}
			}

		} else {
			for ( i = 0; checkSet[i] != null; i++ ) {
				if ( checkSet[i] && checkSet[i].nodeType === 1 ) {
					results.push( set[i] );
				}
			}
		}

	} else {
		makeArray( checkSet, results );
	}

	if ( extra ) {
		Sizzle( extra, origContext, results, seed );
		Sizzle.uniqueSort( results );
	}

	return results;
};

Sizzle.uniqueSort = function( results ) {
	if ( sortOrder ) {
		hasDuplicate = baseHasDuplicate;
		results.sort( sortOrder );

		if ( hasDuplicate ) {
			for ( var i = 1; i < results.length; i++ ) {
				if ( results[i] === results[ i - 1 ] ) {
					results.splice( i--, 1 );
				}
			}
		}
	}

	return results;
};

Sizzle.matches = function( expr, set ) {
	return Sizzle( expr, null, null, set );
};

Sizzle.matchesSelector = function( node, expr ) {
	return Sizzle( expr, null, null, [node] ).length > 0;
};

Sizzle.find = function( expr, context, isXML ) {
	var set, i, len, match, type, left;

	if ( !expr ) {
		return [];
	}

	for ( i = 0, len = Expr.order.length; i < len; i++ ) {
		type = Expr.order[i];
		
		if ( (match = Expr.leftMatch[ type ].exec( expr )) ) {
			left = match[1];
			match.splice( 1, 1 );

			if ( left.substr( left.length - 1 ) !== "\\" ) {
				match[1] = (match[1] || "").replace( rBackslash, "" );
				set = Expr.find[ type ]( match, context, isXML );

				if ( set != null ) {
					expr = expr.replace( Expr.match[ type ], "" );
					break;
				}
			}
		}
	}

	if ( !set ) {
		set = typeof context.getElementsByTagName !== "undefined" ?
			context.getElementsByTagName( "*" ) :
			[];
	}

	return { set: set, expr: expr };
};

Sizzle.filter = function( expr, set, inplace, not ) {
	var match, anyFound,
		type, found, item, filter, left,
		i, pass,
		old = expr,
		result = [],
		curLoop = set,
		isXMLFilter = set && set[0] && Sizzle.isXML( set[0] );

	while ( expr && set.length ) {
		for ( type in Expr.filter ) {
			if ( (match = Expr.leftMatch[ type ].exec( expr )) != null && match[2] ) {
				filter = Expr.filter[ type ];
				left = match[1];

				anyFound = false;

				match.splice(1,1);

				if ( left.substr( left.length - 1 ) === "\\" ) {
					continue;
				}

				if ( curLoop === result ) {
					result = [];
				}

				if ( Expr.preFilter[ type ] ) {
					match = Expr.preFilter[ type ]( match, curLoop, inplace, result, not, isXMLFilter );

					if ( !match ) {
						anyFound = found = true;

					} else if ( match === true ) {
						continue;
					}
				}

				if ( match ) {
					for ( i = 0; (item = curLoop[i]) != null; i++ ) {
						if ( item ) {
							found = filter( item, match, i, curLoop );
							pass = not ^ found;

							if ( inplace && found != null ) {
								if ( pass ) {
									anyFound = true;

								} else {
									curLoop[i] = false;
								}

							} else if ( pass ) {
								result.push( item );
								anyFound = true;
							}
						}
					}
				}

				if ( found !== undefined ) {
					if ( !inplace ) {
						curLoop = result;
					}

					expr = expr.replace( Expr.match[ type ], "" );

					if ( !anyFound ) {
						return [];
					}

					break;
				}
			}
		}

		// Improper expression
		if ( expr === old ) {
			if ( anyFound == null ) {
				Sizzle.error( expr );

			} else {
				break;
			}
		}

		old = expr;
	}

	return curLoop;
};

Sizzle.error = function( msg ) {
	throw "Syntax error, unrecognized expression: " + msg;
};

/**
 * Utility function for retreiving the text value of an array of DOM nodes
 * @param {Array|Element} elem
 */
var getText = Sizzle.getText = function( elem ) {
    var i, node,
		nodeType = elem.nodeType,
		ret = "";

	if ( nodeType ) {
		if ( nodeType === 1 ) {
			// Use textContent || innerText for elements
			if ( typeof elem.textContent === 'string' ) {
				return elem.textContent;
			} else if ( typeof elem.innerText === 'string' ) {
				// Replace IE's carriage returns
				return elem.innerText.replace( rReturn, '' );
			} else {
				// Traverse it's children
				for ( elem = elem.firstChild; elem; elem = elem.nextSibling) {
					ret += getText( elem );
				}
			}
		} else if ( nodeType === 3 || nodeType === 4 ) {
			return elem.nodeValue;
		}
	} else {

		// If no nodeType, this is expected to be an array
		for ( i = 0; (node = elem[i]); i++ ) {
			// Do not traverse comment nodes
			if ( node.nodeType !== 8 ) {
				ret += getText( node );
			}
		}
	}
	return ret;
};

var Expr = Sizzle.selectors = {
	order: [ "ID", "NAME", "TAG" ],

	match: {
		ID: /#((?:[\w\u00c0-\uFFFF\-]|\\.)+)/,
		CLASS: /\.((?:[\w\u00c0-\uFFFF\-]|\\.)+)/,
		NAME: /\[name=['"]*((?:[\w\u00c0-\uFFFF\-]|\\.)+)['"]*\]/,
		ATTR: /\[\s*((?:[\w\u00c0-\uFFFF\-]|\\.)+)\s*(?:(\S?=)\s*(?:(['"])(.*?)\3|(#?(?:[\w\u00c0-\uFFFF\-]|\\.)*)|)|)\s*\]/,
		TAG: /^((?:[\w\u00c0-\uFFFF\*\-]|\\.)+)/,
		CHILD: /:(only|nth|last|first)-child(?:\(\s*(even|odd|(?:[+\-]?\d+|(?:[+\-]?\d*)?n\s*(?:[+\-]\s*\d+)?))\s*\))?/,
		POS: /:(nth|eq|gt|lt|first|last|even|odd)(?:\((\d*)\))?(?=[^\-]|$)/,
		PSEUDO: /:((?:[\w\u00c0-\uFFFF\-]|\\.)+)(?:\((['"]?)((?:\([^\)]+\)|[^\(\)]*)+)\2\))?/
	},

	leftMatch: {},

	attrMap: {
		"class": "className",
		"for": "htmlFor"
	},

	attrHandle: {
		href: function( elem ) {
			return elem.getAttribute( "href" );
		},
		type: function( elem ) {
			return elem.getAttribute( "type" );
		}
	},

	relative: {
		"+": function(checkSet, part){
			var isPartStr = typeof part === "string",
				isTag = isPartStr && !rNonWord.test( part ),
				isPartStrNotTag = isPartStr && !isTag;

			if ( isTag ) {
				part = part.toLowerCase();
			}

			for ( var i = 0, l = checkSet.length, elem; i < l; i++ ) {
				if ( (elem = checkSet[i]) ) {
					while ( (elem = elem.previousSibling) && elem.nodeType !== 1 ) {}

					checkSet[i] = isPartStrNotTag || elem && elem.nodeName.toLowerCase() === part ?
						elem || false :
						elem === part;
				}
			}

			if ( isPartStrNotTag ) {
				Sizzle.filter( part, checkSet, true );
			}
		},

		">": function( checkSet, part ) {
			var elem,
				isPartStr = typeof part === "string",
				i = 0,
				l = checkSet.length;

			if ( isPartStr && !rNonWord.test( part ) ) {
				part = part.toLowerCase();

				for ( ; i < l; i++ ) {
					elem = checkSet[i];

					if ( elem ) {
						var parent = elem.parentNode;
						checkSet[i] = parent.nodeName.toLowerCase() === part ? parent : false;
					}
				}

			} else {
				for ( ; i < l; i++ ) {
					elem = checkSet[i];

					if ( elem ) {
						checkSet[i] = isPartStr ?
							elem.parentNode :
							elem.parentNode === part;
					}
				}

				if ( isPartStr ) {
					Sizzle.filter( part, checkSet, true );
				}
			}
		},

		"": function(checkSet, part, isXML){
			var nodeCheck,
				doneName = done++,
				checkFn = dirCheck;

			if ( typeof part === "string" && !rNonWord.test( part ) ) {
				part = part.toLowerCase();
				nodeCheck = part;
				checkFn = dirNodeCheck;
			}

			checkFn( "parentNode", part, doneName, checkSet, nodeCheck, isXML );
		},

		"~": function( checkSet, part, isXML ) {
			var nodeCheck,
				doneName = done++,
				checkFn = dirCheck;

			if ( typeof part === "string" && !rNonWord.test( part ) ) {
				part = part.toLowerCase();
				nodeCheck = part;
				checkFn = dirNodeCheck;
			}

			checkFn( "previousSibling", part, doneName, checkSet, nodeCheck, isXML );
		}
	},

	find: {
		ID: function( match, context, isXML ) {
			if ( typeof context.getElementById !== "undefined" && !isXML ) {
				var m = context.getElementById(match[1]);
				// Check parentNode to catch when Blackberry 4.6 returns
				// nodes that are no longer in the document #6963
				return m && m.parentNode ? [m] : [];
			}
		},

		NAME: function( match, context ) {
			if ( typeof context.getElementsByName !== "undefined" ) {
				var ret = [],
					results = context.getElementsByName( match[1] );

				for ( var i = 0, l = results.length; i < l; i++ ) {
					if ( results[i].getAttribute("name") === match[1] ) {
						ret.push( results[i] );
					}
				}

				return ret.length === 0 ? null : ret;
			}
		},

		TAG: function( match, context ) {
			if ( typeof context.getElementsByTagName !== "undefined" ) {
				return context.getElementsByTagName( match[1] );
			}
		}
	},
	preFilter: {
		CLASS: function( match, curLoop, inplace, result, not, isXML ) {
			match = " " + match[1].replace( rBackslash, "" ) + " ";

			if ( isXML ) {
				return match;
			}

			for ( var i = 0, elem; (elem = curLoop[i]) != null; i++ ) {
				if ( elem ) {
					if ( not ^ (elem.className && (" " + elem.className + " ").replace(/[\t\n\r]/g, " ").indexOf(match) >= 0) ) {
						if ( !inplace ) {
							result.push( elem );
						}

					} else if ( inplace ) {
						curLoop[i] = false;
					}
				}
			}

			return false;
		},

		ID: function( match ) {
			return match[1].replace( rBackslash, "" );
		},

		TAG: function( match, curLoop ) {
			return match[1].replace( rBackslash, "" ).toLowerCase();
		},

		CHILD: function( match ) {
			if ( match[1] === "nth" ) {
				if ( !match[2] ) {
					Sizzle.error( match[0] );
				}

				match[2] = match[2].replace(/^\+|\s*/g, '');

				// parse equations like 'even', 'odd', '5', '2n', '3n+2', '4n-1', '-n+6'
				var test = /(-?)(\d*)(?:n([+\-]?\d*))?/.exec(
					match[2] === "even" && "2n" || match[2] === "odd" && "2n+1" ||
					!/\D/.test( match[2] ) && "0n+" + match[2] || match[2]);

				// calculate the numbers (first)n+(last) including if they are negative
				match[2] = (test[1] + (test[2] || 1)) - 0;
				match[3] = test[3] - 0;
			}
			else if ( match[2] ) {
				Sizzle.error( match[0] );
			}

			// TODO: Move to normal caching system
			match[0] = done++;

			return match;
		},

		ATTR: function( match, curLoop, inplace, result, not, isXML ) {
			var name = match[1] = match[1].replace( rBackslash, "" );
			
			if ( !isXML && Expr.attrMap[name] ) {
				match[1] = Expr.attrMap[name];
			}

			// Handle if an un-quoted value was used
			match[4] = ( match[4] || match[5] || "" ).replace( rBackslash, "" );

			if ( match[2] === "~=" ) {
				match[4] = " " + match[4] + " ";
			}

			return match;
		},

		PSEUDO: function( match, curLoop, inplace, result, not ) {
			if ( match[1] === "not" ) {
				// If we're dealing with a complex expression, or a simple one
				if ( ( chunker.exec(match[3]) || "" ).length > 1 || /^\w/.test(match[3]) ) {
					match[3] = Sizzle(match[3], null, null, curLoop);

				} else {
					var ret = Sizzle.filter(match[3], curLoop, inplace, true ^ not);

					if ( !inplace ) {
						result.push.apply( result, ret );
					}

					return false;
				}

			} else if ( Expr.match.POS.test( match[0] ) || Expr.match.CHILD.test( match[0] ) ) {
				return true;
			}
			
			return match;
		},

		POS: function( match ) {
			match.unshift( true );

			return match;
		}
	},
	
	filters: {
		enabled: function( elem ) {
			return elem.disabled === false && elem.type !== "hidden";
		},

		disabled: function( elem ) {
			return elem.disabled === true;
		},

		checked: function( elem ) {
			return elem.checked === true;
		},
		
		selected: function( elem ) {
			// Accessing this property makes selected-by-default
			// options in Safari work properly
			if ( elem.parentNode ) {
				elem.parentNode.selectedIndex;
			}
			
			return elem.selected === true;
		},

		parent: function( elem ) {
			return !!elem.firstChild;
		},

		empty: function( elem ) {
			return !elem.firstChild;
		},

		has: function( elem, i, match ) {
			return !!Sizzle( match[3], elem ).length;
		},

		header: function( elem ) {
			return (/h\d/i).test( elem.nodeName );
		},

		text: function( elem ) {
			var attr = elem.getAttribute( "type" ), type = elem.type;
			// IE6 and 7 will map elem.type to 'text' for new HTML5 types (search, etc) 
			// use getAttribute instead to test this case
			return elem.nodeName.toLowerCase() === "input" && "text" === type && ( attr === type || attr === null );
		},

		radio: function( elem ) {
			return elem.nodeName.toLowerCase() === "input" && "radio" === elem.type;
		},

		checkbox: function( elem ) {
			return elem.nodeName.toLowerCase() === "input" && "checkbox" === elem.type;
		},

		file: function( elem ) {
			return elem.nodeName.toLowerCase() === "input" && "file" === elem.type;
		},

		password: function( elem ) {
			return elem.nodeName.toLowerCase() === "input" && "password" === elem.type;
		},

		submit: function( elem ) {
			var name = elem.nodeName.toLowerCase();
			return (name === "input" || name === "button") && "submit" === elem.type;
		},

		image: function( elem ) {
			return elem.nodeName.toLowerCase() === "input" && "image" === elem.type;
		},

		reset: function( elem ) {
			var name = elem.nodeName.toLowerCase();
			return (name === "input" || name === "button") && "reset" === elem.type;
		},

		button: function( elem ) {
			var name = elem.nodeName.toLowerCase();
			return name === "input" && "button" === elem.type || name === "button";
		},

		input: function( elem ) {
			return (/input|select|textarea|button/i).test( elem.nodeName );
		},

		focus: function( elem ) {
			return elem === elem.ownerDocument.activeElement;
		}
	},
	setFilters: {
		first: function( elem, i ) {
			return i === 0;
		},

		last: function( elem, i, match, array ) {
			return i === array.length - 1;
		},

		even: function( elem, i ) {
			return i % 2 === 0;
		},

		odd: function( elem, i ) {
			return i % 2 === 1;
		},

		lt: function( elem, i, match ) {
			return i < match[3] - 0;
		},

		gt: function( elem, i, match ) {
			return i > match[3] - 0;
		},

		nth: function( elem, i, match ) {
			return match[3] - 0 === i;
		},

		eq: function( elem, i, match ) {
			return match[3] - 0 === i;
		}
	},
	filter: {
		PSEUDO: function( elem, match, i, array ) {
			var name = match[1],
				filter = Expr.filters[ name ];

			if ( filter ) {
				return filter( elem, i, match, array );

			} else if ( name === "contains" ) {
				return (elem.textContent || elem.innerText || getText([ elem ]) || "").indexOf(match[3]) >= 0;

			} else if ( name === "not" ) {
				var not = match[3];

				for ( var j = 0, l = not.length; j < l; j++ ) {
					if ( not[j] === elem ) {
						return false;
					}
				}

				return true;

			} else {
				Sizzle.error( name );
			}
		},

		CHILD: function( elem, match ) {
			var first, last,
				doneName, parent, cache,
				count, diff,
				type = match[1],
				node = elem;

			switch ( type ) {
				case "only":
				case "first":
					while ( (node = node.previousSibling) )	 {
						if ( node.nodeType === 1 ) { 
							return false; 
						}
					}

					if ( type === "first" ) { 
						return true; 
					}

					node = elem;

				case "last":
					while ( (node = node.nextSibling) )	 {
						if ( node.nodeType === 1 ) { 
							return false; 
						}
					}

					return true;

				case "nth":
					first = match[2];
					last = match[3];

					if ( first === 1 && last === 0 ) {
						return true;
					}
					
					doneName = match[0];
					parent = elem.parentNode;
	
					if ( parent && (parent[ expando ] !== doneName || !elem.nodeIndex) ) {
						count = 0;
						
						for ( node = parent.firstChild; node; node = node.nextSibling ) {
							if ( node.nodeType === 1 ) {
								node.nodeIndex = ++count;
							}
						} 

						parent[ expando ] = doneName;
					}
					
					diff = elem.nodeIndex - last;

					if ( first === 0 ) {
						return diff === 0;

					} else {
						return ( diff % first === 0 && diff / first >= 0 );
					}
			}
		},

		ID: function( elem, match ) {
			return elem.nodeType === 1 && elem.getAttribute("id") === match;
		},

		TAG: function( elem, match ) {
			return (match === "*" && elem.nodeType === 1) || !!elem.nodeName && elem.nodeName.toLowerCase() === match;
		},
		
		CLASS: function( elem, match ) {
			return (" " + (elem.className || elem.getAttribute("class")) + " ")
				.indexOf( match ) > -1;
		},

		ATTR: function( elem, match ) {
			var name = match[1],
				result = Sizzle.attr ?
					Sizzle.attr( elem, name ) :
					Expr.attrHandle[ name ] ?
					Expr.attrHandle[ name ]( elem ) :
					elem[ name ] != null ?
						elem[ name ] :
						elem.getAttribute( name ),
				value = result + "",
				type = match[2],
				check = match[4];

			return result == null ?
				type === "!=" :
				!type && Sizzle.attr ?
				result != null :
				type === "=" ?
				value === check :
				type === "*=" ?
				value.indexOf(check) >= 0 :
				type === "~=" ?
				(" " + value + " ").indexOf(check) >= 0 :
				!check ?
				value && result !== false :
				type === "!=" ?
				value !== check :
				type === "^=" ?
				value.indexOf(check) === 0 :
				type === "$=" ?
				value.substr(value.length - check.length) === check :
				type === "|=" ?
				value === check || value.substr(0, check.length + 1) === check + "-" :
				false;
		},

		POS: function( elem, match, i, array ) {
			var name = match[2],
				filter = Expr.setFilters[ name ];

			if ( filter ) {
				return filter( elem, i, match, array );
			}
		}
	}
};

var origPOS = Expr.match.POS,
	fescape = function(all, num){
		return "\\" + (num - 0 + 1);
	};

for ( var type in Expr.match ) {
	Expr.match[ type ] = new RegExp( Expr.match[ type ].source + (/(?![^\[]*\])(?![^\(]*\))/.source) );
	Expr.leftMatch[ type ] = new RegExp( /(^(?:.|\r|\n)*?)/.source + Expr.match[ type ].source.replace(/\\(\d+)/g, fescape) );
}

var makeArray = function( array, results ) {
	array = Array.prototype.slice.call( array, 0 );

	if ( results ) {
		results.push.apply( results, array );
		return results;
	}
	
	return array;
};

// Perform a simple check to determine if the browser is capable of
// converting a NodeList to an array using builtin methods.
// Also verifies that the returned array holds DOM nodes
// (which is not the case in the Blackberry browser)
try {
	Array.prototype.slice.call( document.documentElement.childNodes, 0 )[0].nodeType;

// Provide a fallback method if it does not work
} catch( e ) {
	makeArray = function( array, results ) {
		var i = 0,
			ret = results || [];

		if ( toString.call(array) === "[object Array]" ) {
			Array.prototype.push.apply( ret, array );

		} else {
			if ( typeof array.length === "number" ) {
				for ( var l = array.length; i < l; i++ ) {
					ret.push( array[i] );
				}

			} else {
				for ( ; array[i]; i++ ) {
					ret.push( array[i] );
				}
			}
		}

		return ret;
	};
}

var sortOrder, siblingCheck;

if ( document.documentElement.compareDocumentPosition ) {
	sortOrder = function( a, b ) {
		if ( a === b ) {
			hasDuplicate = true;
			return 0;
		}

		if ( !a.compareDocumentPosition || !b.compareDocumentPosition ) {
			return a.compareDocumentPosition ? -1 : 1;
		}

		return a.compareDocumentPosition(b) & 4 ? -1 : 1;
	};

} else {
	sortOrder = function( a, b ) {
		// The nodes are identical, we can exit early
		if ( a === b ) {
			hasDuplicate = true;
			return 0;

		// Fallback to using sourceIndex (in IE) if it's available on both nodes
		} else if ( a.sourceIndex && b.sourceIndex ) {
			return a.sourceIndex - b.sourceIndex;
		}

		var al, bl,
			ap = [],
			bp = [],
			aup = a.parentNode,
			bup = b.parentNode,
			cur = aup;

		// If the nodes are siblings (or identical) we can do a quick check
		if ( aup === bup ) {
			return siblingCheck( a, b );

		// If no parents were found then the nodes are disconnected
		} else if ( !aup ) {
			return -1;

		} else if ( !bup ) {
			return 1;
		}

		// Otherwise they're somewhere else in the tree so we need
		// to build up a full list of the parentNodes for comparison
		while ( cur ) {
			ap.unshift( cur );
			cur = cur.parentNode;
		}

		cur = bup;

		while ( cur ) {
			bp.unshift( cur );
			cur = cur.parentNode;
		}

		al = ap.length;
		bl = bp.length;

		// Start walking down the tree looking for a discrepancy
		for ( var i = 0; i < al && i < bl; i++ ) {
			if ( ap[i] !== bp[i] ) {
				return siblingCheck( ap[i], bp[i] );
			}
		}

		// We ended someplace up the tree so do a sibling check
		return i === al ?
			siblingCheck( a, bp[i], -1 ) :
			siblingCheck( ap[i], b, 1 );
	};

	siblingCheck = function( a, b, ret ) {
		if ( a === b ) {
			return ret;
		}

		var cur = a.nextSibling;

		while ( cur ) {
			if ( cur === b ) {
				return -1;
			}

			cur = cur.nextSibling;
		}

		return 1;
	};
}

// Check to see if the browser returns elements by name when
// querying by getElementById (and provide a workaround)
(function(){
	// We're going to inject a fake input element with a specified name
	var form = document.createElement("div"),
		id = "script" + (new Date()).getTime(),
		root = document.documentElement;

	form.innerHTML = "<a name='" + id + "'/>";

	// Inject it into the root element, check its status, and remove it quickly
	root.insertBefore( form, root.firstChild );

	// The workaround has to do additional checks after a getElementById
	// Which slows things down for other browsers (hence the branching)
	if ( document.getElementById( id ) ) {
		Expr.find.ID = function( match, context, isXML ) {
			if ( typeof context.getElementById !== "undefined" && !isXML ) {
				var m = context.getElementById(match[1]);

				return m ?
					m.id === match[1] || typeof m.getAttributeNode !== "undefined" && m.getAttributeNode("id").nodeValue === match[1] ?
						[m] :
						undefined :
					[];
			}
		};

		Expr.filter.ID = function( elem, match ) {
			var node = typeof elem.getAttributeNode !== "undefined" && elem.getAttributeNode("id");

			return elem.nodeType === 1 && node && node.nodeValue === match;
		};
	}

	root.removeChild( form );

	// release memory in IE
	root = form = null;
})();

(function(){
	// Check to see if the browser returns only elements
	// when doing getElementsByTagName("*")

	// Create a fake element
	var div = document.createElement("div");
	div.appendChild( document.createComment("") );

	// Make sure no comments are found
	if ( div.getElementsByTagName("*").length > 0 ) {
		Expr.find.TAG = function( match, context ) {
			var results = context.getElementsByTagName( match[1] );

			// Filter out possible comments
			if ( match[1] === "*" ) {
				var tmp = [];

				for ( var i = 0; results[i]; i++ ) {
					if ( results[i].nodeType === 1 ) {
						tmp.push( results[i] );
					}
				}

				results = tmp;
			}

			return results;
		};
	}

	// Check to see if an attribute returns normalized href attributes
	div.innerHTML = "<a href='#'></a>";

	if ( div.firstChild && typeof div.firstChild.getAttribute !== "undefined" &&
			div.firstChild.getAttribute("href") !== "#" ) {

		Expr.attrHandle.href = function( elem ) {
			return elem.getAttribute( "href", 2 );
		};
	}

	// release memory in IE
	div = null;
})();

if ( document.querySelectorAll ) {
	(function(){
		var oldSizzle = Sizzle,
			div = document.createElement("div"),
			id = "__sizzle__";

		div.innerHTML = "<p class='TEST'></p>";

		// Safari can't handle uppercase or unicode characters when
		// in quirks mode.
		if ( div.querySelectorAll && div.querySelectorAll(".TEST").length === 0 ) {
			return;
		}
	
		Sizzle = function( query, context, extra, seed ) {
			context = context || document;

			// Only use querySelectorAll on non-XML documents
			// (ID selectors don't work in non-HTML documents)
			if ( !seed && !Sizzle.isXML(context) ) {
				// See if we find a selector to speed up
				var match = /^(\w+$)|^\.([\w\-]+$)|^#([\w\-]+$)/.exec( query );
				
				if ( match && (context.nodeType === 1 || context.nodeType === 9) ) {
					// Speed-up: Sizzle("TAG")
					if ( match[1] ) {
						return makeArray( context.getElementsByTagName( query ), extra );
					
					// Speed-up: Sizzle(".CLASS")
					} else if ( match[2] && Expr.find.CLASS && context.getElementsByClassName ) {
						return makeArray( context.getElementsByClassName( match[2] ), extra );
					}
				}
				
				if ( context.nodeType === 9 ) {
					// Speed-up: Sizzle("body")
					// The body element only exists once, optimize finding it
					if ( query === "body" && context.body ) {
						return makeArray( [ context.body ], extra );
						
					// Speed-up: Sizzle("#ID")
					} else if ( match && match[3] ) {
						var elem = context.getElementById( match[3] );

						// Check parentNode to catch when Blackberry 4.6 returns
						// nodes that are no longer in the document #6963
						if ( elem && elem.parentNode ) {
							// Handle the case where IE and Opera return items
							// by name instead of ID
							if ( elem.id === match[3] ) {
								return makeArray( [ elem ], extra );
							}
							
						} else {
							return makeArray( [], extra );
						}
					}
					
					try {
						return makeArray( context.querySelectorAll(query), extra );
					} catch(qsaError) {}

				// qSA works strangely on Element-rooted queries
				// We can work around this by specifying an extra ID on the root
				// and working up from there (Thanks to Andrew Dupont for the technique)
				// IE 8 doesn't work on object elements
				} else if ( context.nodeType === 1 && context.nodeName.toLowerCase() !== "object" ) {
					var oldContext = context,
						old = context.getAttribute( "id" ),
						nid = old || id,
						hasParent = context.parentNode,
						relativeHierarchySelector = /^\s*[+~]/.test( query );

					if ( !old ) {
						context.setAttribute( "id", nid );
					} else {
						nid = nid.replace( /'/g, "\\$&" );
					}
					if ( relativeHierarchySelector && hasParent ) {
						context = context.parentNode;
					}

					try {
						if ( !relativeHierarchySelector || hasParent ) {
							return makeArray( context.querySelectorAll( "[id='" + nid + "'] " + query ), extra );
						}

					} catch(pseudoError) {
					} finally {
						if ( !old ) {
							oldContext.removeAttribute( "id" );
						}
					}
				}
			}
		
			return oldSizzle(query, context, extra, seed);
		};

		for ( var prop in oldSizzle ) {
			Sizzle[ prop ] = oldSizzle[ prop ];
		}

		// release memory in IE
		div = null;
	})();
}

(function(){
	var html = document.documentElement,
		matches = html.matchesSelector || html.mozMatchesSelector || html.webkitMatchesSelector || html.msMatchesSelector;

	if ( matches ) {
		// Check to see if it's possible to do matchesSelector
		// on a disconnected node (IE 9 fails this)
		var disconnectedMatch = !matches.call( document.createElement( "div" ), "div" ),
			pseudoWorks = false;

		try {
			// This should fail with an exception
			// Gecko does not error, returns false instead
			matches.call( document.documentElement, "[test!='']:sizzle" );
	
		} catch( pseudoError ) {
			pseudoWorks = true;
		}

		Sizzle.matchesSelector = function( node, expr ) {
			// Make sure that attribute selectors are quoted
			expr = expr.replace(/\=\s*([^'"\]]*)\s*\]/g, "='$1']");

			if ( !Sizzle.isXML( node ) ) {
				try { 
					if ( pseudoWorks || !Expr.match.PSEUDO.test( expr ) && !/!=/.test( expr ) ) {
						var ret = matches.call( node, expr );

						// IE 9's matchesSelector returns false on disconnected nodes
						if ( ret || !disconnectedMatch ||
								// As well, disconnected nodes are said to be in a document
								// fragment in IE 9, so check for that
								node.document && node.document.nodeType !== 11 ) {
							return ret;
						}
					}
				} catch(e) {}
			}

			return Sizzle(expr, null, null, [node]).length > 0;
		};
	}
})();

(function(){
	var div = document.createElement("div");

	div.innerHTML = "<div class='test e'></div><div class='test'></div>";

	// Opera can't find a second classname (in 9.6)
	// Also, make sure that getElementsByClassName actually exists
	if ( !div.getElementsByClassName || div.getElementsByClassName("e").length === 0 ) {
		return;
	}

	// Safari caches class attributes, doesn't catch changes (in 3.2)
	div.lastChild.className = "e";

	if ( div.getElementsByClassName("e").length === 1 ) {
		return;
	}
	
	Expr.order.splice(1, 0, "CLASS");
	Expr.find.CLASS = function( match, context, isXML ) {
		if ( typeof context.getElementsByClassName !== "undefined" && !isXML ) {
			return context.getElementsByClassName(match[1]);
		}
	};

	// release memory in IE
	div = null;
})();

function dirNodeCheck( dir, cur, doneName, checkSet, nodeCheck, isXML ) {
	for ( var i = 0, l = checkSet.length; i < l; i++ ) {
		var elem = checkSet[i];

		if ( elem ) {
			var match = false;

			elem = elem[dir];

			while ( elem ) {
				if ( elem[ expando ] === doneName ) {
					match = checkSet[elem.sizset];
					break;
				}

				if ( elem.nodeType === 1 && !isXML ){
					elem[ expando ] = doneName;
					elem.sizset = i;
				}

				if ( elem.nodeName.toLowerCase() === cur ) {
					match = elem;
					break;
				}

				elem = elem[dir];
			}

			checkSet[i] = match;
		}
	}
}

function dirCheck( dir, cur, doneName, checkSet, nodeCheck, isXML ) {
	for ( var i = 0, l = checkSet.length; i < l; i++ ) {
		var elem = checkSet[i];

		if ( elem ) {
			var match = false;
			
			elem = elem[dir];

			while ( elem ) {
				if ( elem[ expando ] === doneName ) {
					match = checkSet[elem.sizset];
					break;
				}

				if ( elem.nodeType === 1 ) {
					if ( !isXML ) {
						elem[ expando ] = doneName;
						elem.sizset = i;
					}

					if ( typeof cur !== "string" ) {
						if ( elem === cur ) {
							match = true;
							break;
						}

					} else if ( Sizzle.filter( cur, [elem] ).length > 0 ) {
						match = elem;
						break;
					}
				}

				elem = elem[dir];
			}

			checkSet[i] = match;
		}
	}
}

if ( document.documentElement.contains ) {
	Sizzle.contains = function( a, b ) {
		return a !== b && (a.contains ? a.contains(b) : true);
	};

} else if ( document.documentElement.compareDocumentPosition ) {
	Sizzle.contains = function( a, b ) {
		return !!(a.compareDocumentPosition(b) & 16);
	};

} else {
	Sizzle.contains = function() {
		return false;
	};
}

Sizzle.isXML = function( elem ) {
	// documentElement is verified for cases where it doesn't yet exist
	// (such as loading iframes in IE - #4833) 
	var documentElement = (elem ? elem.ownerDocument || elem : 0).documentElement;

	return documentElement ? documentElement.nodeName !== "HTML" : false;
};

var posProcess = function( selector, context, seed ) {
	var match,
		tmpSet = [],
		later = "",
		root = context.nodeType ? [context] : context;

	// Position selectors must be done after the filter
	// And so must :not(positional) so we move all PSEUDOs to the end
	while ( (match = Expr.match.PSEUDO.exec( selector )) ) {
		later += match[0];
		selector = selector.replace( Expr.match.PSEUDO, "" );
	}

	selector = Expr.relative[selector] ? selector + "*" : selector;

	for ( var i = 0, l = root.length; i < l; i++ ) {
		Sizzle( selector, root[i], tmpSet, seed );
	}

	return Sizzle.filter( later, tmpSet );
};

// EXPOSE
// Override sizzle attribute retrieval
Sizzle.attr = jQuery.attr;
Sizzle.selectors.attrMap = {};
jQuery.find = Sizzle;
jQuery.expr = Sizzle.selectors;
jQuery.expr[":"] = jQuery.expr.filters;
jQuery.unique = Sizzle.uniqueSort;
jQuery.text = Sizzle.getText;
jQuery.isXMLDoc = Sizzle.isXML;
jQuery.contains = Sizzle.contains;


})();


var runtil = /Until$/,
	rparentsprev = /^(?:parents|prevUntil|prevAll)/,
	// Note: This RegExp should be improved, or likely pulled from Sizzle
	rmultiselector = /,/,
	isSimple = /^.[^:#\[\.,]*$/,
	slice = Array.prototype.slice,
	POS = jQuery.expr.match.POS,
	// methods guaranteed to produce a unique set when starting from a unique set
	guaranteedUnique = {
		children: true,
		contents: true,
		next: true,
		prev: true
	};

jQuery.fn.extend({
	find: function( selector ) {
		var self = this,
			i, l;

		if ( typeof selector !== "string" ) {
			return jQuery( selector ).filter(function() {
				for ( i = 0, l = self.length; i < l; i++ ) {
					if ( jQuery.contains( self[ i ], this ) ) {
						return true;
					}
				}
			});
		}

		var ret = this.pushStack( "", "find", selector ),
			length, n, r;

		for ( i = 0, l = this.length; i < l; i++ ) {
			length = ret.length;
			jQuery.find( selector, this[i], ret );

			if ( i > 0 ) {
				// Make sure that the results are unique
				for ( n = length; n < ret.length; n++ ) {
					for ( r = 0; r < length; r++ ) {
						if ( ret[r] === ret[n] ) {
							ret.splice(n--, 1);
							break;
						}
					}
				}
			}
		}

		return ret;
	},

	has: function( target ) {
		var targets = jQuery( target );
		return this.filter(function() {
			for ( var i = 0, l = targets.length; i < l; i++ ) {
				if ( jQuery.contains( this, targets[i] ) ) {
					return true;
				}
			}
		});
	},

	not: function( selector ) {
		return this.pushStack( winnow(this, selector, false), "not", selector);
	},

	filter: function( selector ) {
		return this.pushStack( winnow(this, selector, true), "filter", selector );
	},

	is: function( selector ) {
		return !!selector && ( 
			typeof selector === "string" ?
				// If this is a positional selector, check membership in the returned set
				// so $("p:first").is("p:last") won't return true for a doc with two "p".
				POS.test( selector ) ? 
					jQuery( selector, this.context ).index( this[0] ) >= 0 :
					jQuery.filter( selector, this ).length > 0 :
				this.filter( selector ).length > 0 );
	},

	closest: function( selectors, context ) {
		var ret = [], i, l, cur = this[0];
		
		// Array (deprecated as of jQuery 1.7)
		if ( jQuery.isArray( selectors ) ) {
			var level = 1;

			while ( cur && cur.ownerDocument && cur !== context ) {
				for ( i = 0; i < selectors.length; i++ ) {

					if ( jQuery( cur ).is( selectors[ i ] ) ) {
						ret.push({ selector: selectors[ i ], elem: cur, level: level });
					}
				}

				cur = cur.parentNode;
				level++;
			}

			return ret;
		}

		// String
		var pos = POS.test( selectors ) || typeof selectors !== "string" ?
				jQuery( selectors, context || this.context ) :
				0;

		for ( i = 0, l = this.length; i < l; i++ ) {
			cur = this[i];

			while ( cur ) {
				if ( pos ? pos.index(cur) > -1 : jQuery.find.matchesSelector(cur, selectors) ) {
					ret.push( cur );
					break;

				} else {
					cur = cur.parentNode;
					if ( !cur || !cur.ownerDocument || cur === context || cur.nodeType === 11 ) {
						break;
					}
				}
			}
		}

		ret = ret.length > 1 ? jQuery.unique( ret ) : ret;

		return this.pushStack( ret, "closest", selectors );
	},

	// Determine the position of an element within
	// the matched set of elements
	index: function( elem ) {

		// No argument, return index in parent
		if ( !elem ) {
			return ( this[0] && this[0].parentNode ) ? this.prevAll().length : -1;
		}

		// index in selector
		if ( typeof elem === "string" ) {
			return jQuery.inArray( this[0], jQuery( elem ) );
		}

		// Locate the position of the desired element
		return jQuery.inArray(
			// If it receives a jQuery object, the first element is used
			elem.jquery ? elem[0] : elem, this );
	},

	add: function( selector, context ) {
		var set = typeof selector === "string" ?
				jQuery( selector, context ) :
				jQuery.makeArray( selector && selector.nodeType ? [ selector ] : selector ),
			all = jQuery.merge( this.get(), set );

		return this.pushStack( isDisconnected( set[0] ) || isDisconnected( all[0] ) ?
			all :
			jQuery.unique( all ) );
	},

	andSelf: function() {
		return this.add( this.prevObject );
	}
});

// A painfully simple check to see if an element is disconnected
// from a document (should be improved, where feasible).
function isDisconnected( node ) {
	return !node || !node.parentNode || node.parentNode.nodeType === 11;
}

jQuery.each({
	parent: function( elem ) {
		var parent = elem.parentNode;
		return parent && parent.nodeType !== 11 ? parent : null;
	},
	parents: function( elem ) {
		return jQuery.dir( elem, "parentNode" );
	},
	parentsUntil: function( elem, i, until ) {
		return jQuery.dir( elem, "parentNode", until );
	},
	next: function( elem ) {
		return jQuery.nth( elem, 2, "nextSibling" );
	},
	prev: function( elem ) {
		return jQuery.nth( elem, 2, "previousSibling" );
	},
	nextAll: function( elem ) {
		return jQuery.dir( elem, "nextSibling" );
	},
	prevAll: function( elem ) {
		return jQuery.dir( elem, "previousSibling" );
	},
	nextUntil: function( elem, i, until ) {
		return jQuery.dir( elem, "nextSibling", until );
	},
	prevUntil: function( elem, i, until ) {
		return jQuery.dir( elem, "previousSibling", until );
	},
	siblings: function( elem ) {
		return jQuery.sibling( elem.parentNode.firstChild, elem );
	},
	children: function( elem ) {
		return jQuery.sibling( elem.firstChild );
	},
	contents: function( elem ) {
		return jQuery.nodeName( elem, "iframe" ) ?
			elem.contentDocument || elem.contentWindow.document :
			jQuery.makeArray( elem.childNodes );
	}
}, function( name, fn ) {
	jQuery.fn[ name ] = function( until, selector ) {
		var ret = jQuery.map( this, fn, until ),
			// The variable 'args' was introduced in
			// https://github.com/jquery/jquery/commit/52a0238
			// to work around a bug in Chrome 10 (Dev) and should be removed when the bug is fixed.
			// http://code.google.com/p/v8/issues/detail?id=1050
			args = slice.call(arguments);

		if ( !runtil.test( name ) ) {
			selector = until;
		}

		if ( selector && typeof selector === "string" ) {
			ret = jQuery.filter( selector, ret );
		}

		ret = this.length > 1 && !guaranteedUnique[ name ] ? jQuery.unique( ret ) : ret;

		if ( (this.length > 1 || rmultiselector.test( selector )) && rparentsprev.test( name ) ) {
			ret = ret.reverse();
		}

		return this.pushStack( ret, name, args.join(",") );
	};
});

jQuery.extend({
	filter: function( expr, elems, not ) {
		if ( not ) {
			expr = ":not(" + expr + ")";
		}

		return elems.length === 1 ?
			jQuery.find.matchesSelector(elems[0], expr) ? [ elems[0] ] : [] :
			jQuery.find.matches(expr, elems);
	},

	dir: function( elem, dir, until ) {
		var matched = [],
			cur = elem[ dir ];

		while ( cur && cur.nodeType !== 9 && (until === undefined || cur.nodeType !== 1 || !jQuery( cur ).is( until )) ) {
			if ( cur.nodeType === 1 ) {
				matched.push( cur );
			}
			cur = cur[dir];
		}
		return matched;
	},

	nth: function( cur, result, dir, elem ) {
		result = result || 1;
		var num = 0;

		for ( ; cur; cur = cur[dir] ) {
			if ( cur.nodeType === 1 && ++num === result ) {
				break;
			}
		}

		return cur;
	},

	sibling: function( n, elem ) {
		var r = [];

		for ( ; n; n = n.nextSibling ) {
			if ( n.nodeType === 1 && n !== elem ) {
				r.push( n );
			}
		}

		return r;
	}
});

// Implement the identical functionality for filter and not
function winnow( elements, qualifier, keep ) {

	// Can't pass null or undefined to indexOf in Firefox 4
	// Set to 0 to skip string check
	qualifier = qualifier || 0;

	if ( jQuery.isFunction( qualifier ) ) {
		return jQuery.grep(elements, function( elem, i ) {
			var retVal = !!qualifier.call( elem, i, elem );
			return retVal === keep;
		});

	} else if ( qualifier.nodeType ) {
		return jQuery.grep(elements, function( elem, i ) {
			return (elem === qualifier) === keep;
		});

	} else if ( typeof qualifier === "string" ) {
		var filtered = jQuery.grep(elements, function( elem ) {
			return elem.nodeType === 1;
		});

		if ( isSimple.test( qualifier ) ) {
			return jQuery.filter(qualifier, filtered, !keep);
		} else {
			qualifier = jQuery.filter( qualifier, filtered );
		}
	}

	return jQuery.grep(elements, function( elem, i ) {
		return (jQuery.inArray( elem, qualifier ) >= 0) === keep;
	});
}




function createSafeFragment( document ) {
	var nodeNames = (
		"abbr article aside audio canvas datalist details figcaption figure footer " +
		"header hgroup mark meter nav output progress section summary time video"
	).split( " " ),
	safeFrag = document.createDocumentFragment();

	if ( safeFrag.createElement ) {
		while ( nodeNames.length ) {
			safeFrag.createElement(
				nodeNames.pop()
			);
		}
	}
	return safeFrag;
}

var rinlinejQuery = / jQuery\d+="(?:\d+|null)"/g,
	rleadingWhitespace = /^\s+/,
	rxhtmlTag = /<(?!area|br|col|embed|hr|img|input|link|meta|param)(([\w:]+)[^>]*)\/>/ig,
	rtagName = /<([\w:]+)/,
	rtbody = /<tbody/i,
	rhtml = /<|&#?\w+;/,
	rnoInnerhtml = /<(?:script|style)/i,
	rnocache = /<(?:script|object|embed|option|style)/i,
	// checked="checked" or checked
	rchecked = /checked\s*(?:[^=]|=\s*.checked.)/i,
	rscriptType = /\/(java|ecma)script/i,
	rcleanScript = /^\s*<!(?:\[CDATA\[|\-\-)/,
	wrapMap = {
		option: [ 1, "<select multiple='multiple'>", "</select>" ],
		legend: [ 1, "<fieldset>", "</fieldset>" ],
		thead: [ 1, "<table>", "</table>" ],
		tr: [ 2, "<table><tbody>", "</tbody></table>" ],
		td: [ 3, "<table><tbody><tr>", "</tr></tbody></table>" ],
		col: [ 2, "<table><tbody></tbody><colgroup>", "</colgroup></table>" ],
		area: [ 1, "<map>", "</map>" ],
		_default: [ 0, "", "" ]
	},
	safeFragment = createSafeFragment( document );

wrapMap.optgroup = wrapMap.option;
wrapMap.tbody = wrapMap.tfoot = wrapMap.colgroup = wrapMap.caption = wrapMap.thead;
wrapMap.th = wrapMap.td;

// IE can't serialize <link> and <script> tags normally
if ( !jQuery.support.htmlSerialize ) {
	wrapMap._default = [ 1, "div<div>", "</div>" ];
}

jQuery.fn.extend({
	text: function( text ) {
		if ( jQuery.isFunction(text) ) {
			return this.each(function(i) {
				var self = jQuery( this );

				self.text( text.call(this, i, self.text()) );
			});
		}

		if ( typeof text !== "object" && text !== undefined ) {
			return this.empty().append( (this[0] && this[0].ownerDocument || document).createTextNode( text ) );
		}

		return jQuery.text( this );
	},

	wrapAll: function( html ) {
		if ( jQuery.isFunction( html ) ) {
			return this.each(function(i) {
				jQuery(this).wrapAll( html.call(this, i) );
			});
		}

		if ( this[0] ) {
			// The elements to wrap the target around
			var wrap = jQuery( html, this[0].ownerDocument ).eq(0).clone(true);

			if ( this[0].parentNode ) {
				wrap.insertBefore( this[0] );
			}

			wrap.map(function() {
				var elem = this;

				while ( elem.firstChild && elem.firstChild.nodeType === 1 ) {
					elem = elem.firstChild;
				}

				return elem;
			}).append( this );
		}

		return this;
	},

	wrapInner: function( html ) {
		if ( jQuery.isFunction( html ) ) {
			return this.each(function(i) {
				jQuery(this).wrapInner( html.call(this, i) );
			});
		}

		return this.each(function() {
			var self = jQuery( this ),
				contents = self.contents();

			if ( contents.length ) {
				contents.wrapAll( html );

			} else {
				self.append( html );
			}
		});
	},

	wrap: function( html ) {
		return this.each(function() {
			jQuery( this ).wrapAll( html );
		});
	},

	unwrap: function() {
		return this.parent().each(function() {
			if ( !jQuery.nodeName( this, "body" ) ) {
				jQuery( this ).replaceWith( this.childNodes );
			}
		}).end();
	},

	append: function() {
		return this.domManip(arguments, true, function( elem ) {
			if ( this.nodeType === 1 ) {
				this.appendChild( elem );
			}
		});
	},

	prepend: function() {
		return this.domManip(arguments, true, function( elem ) {
			if ( this.nodeType === 1 ) {
				this.insertBefore( elem, this.firstChild );
			}
		});
	},

	before: function() {
		if ( this[0] && this[0].parentNode ) {
			return this.domManip(arguments, false, function( elem ) {
				this.parentNode.insertBefore( elem, this );
			});
		} else if ( arguments.length ) {
			var set = jQuery(arguments[0]);
			set.push.apply( set, this.toArray() );
			return this.pushStack( set, "before", arguments );
		}
	},

	after: function() {
		if ( this[0] && this[0].parentNode ) {
			return this.domManip(arguments, false, function( elem ) {
				this.parentNode.insertBefore( elem, this.nextSibling );
			});
		} else if ( arguments.length ) {
			var set = this.pushStack( this, "after", arguments );
			set.push.apply( set, jQuery(arguments[0]).toArray() );
			return set;
		}
	},

	// keepData is for internal use only--do not document
	remove: function( selector, keepData ) {
		for ( var i = 0, elem; (elem = this[i]) != null; i++ ) {
			if ( !selector || jQuery.filter( selector, [ elem ] ).length ) {
				if ( !keepData && elem.nodeType === 1 ) {
					jQuery.cleanData( elem.getElementsByTagName("*") );
					jQuery.cleanData( [ elem ] );
				}

				if ( elem.parentNode ) {
					elem.parentNode.removeChild( elem );
				}
			}
		}

		return this;
	},

	empty: function() {
		for ( var i = 0, elem; (elem = this[i]) != null; i++ ) {
			// Remove element nodes and prevent memory leaks
			if ( elem.nodeType === 1 ) {
				jQuery.cleanData( elem.getElementsByTagName("*") );
			}

			// Remove any remaining nodes
			while ( elem.firstChild ) {
				elem.removeChild( elem.firstChild );
			}
		}

		return this;
	},

	clone: function( dataAndEvents, deepDataAndEvents ) {
		dataAndEvents = dataAndEvents == null ? false : dataAndEvents;
		deepDataAndEvents = deepDataAndEvents == null ? dataAndEvents : deepDataAndEvents;

		return this.map( function () {
			return jQuery.clone( this, dataAndEvents, deepDataAndEvents );
		});
	},

	html: function( value ) {
		if ( value === undefined ) {
			return this[0] && this[0].nodeType === 1 ?
				this[0].innerHTML.replace(rinlinejQuery, "") :
				null;

		// See if we can take a shortcut and just use innerHTML
		} else if ( typeof value === "string" && !rnoInnerhtml.test( value ) &&
			(jQuery.support.leadingWhitespace || !rleadingWhitespace.test( value )) &&
			!wrapMap[ (rtagName.exec( value ) || ["", ""])[1].toLowerCase() ] ) {

			value = value.replace(rxhtmlTag, "<$1></$2>");

			try {
				for ( var i = 0, l = this.length; i < l; i++ ) {
					// Remove element nodes and prevent memory leaks
					if ( this[i].nodeType === 1 ) {
						jQuery.cleanData( this[i].getElementsByTagName("*") );
						this[i].innerHTML = value;
					}
				}

			// If using innerHTML throws an exception, use the fallback method
			} catch(e) {
				this.empty().append( value );
			}

		} else if ( jQuery.isFunction( value ) ) {
			this.each(function(i){
				var self = jQuery( this );

				self.html( value.call(this, i, self.html()) );
			});

		} else {
			this.empty().append( value );
		}

		return this;
	},

	replaceWith: function( value ) {
		if ( this[0] && this[0].parentNode ) {
			// Make sure that the elements are removed from the DOM before they are inserted
			// this can help fix replacing a parent with child elements
			if ( jQuery.isFunction( value ) ) {
				return this.each(function(i) {
					var self = jQuery(this), old = self.html();
					self.replaceWith( value.call( this, i, old ) );
				});
			}

			if ( typeof value !== "string" ) {
				value = jQuery( value ).detach();
			}

			return this.each(function() {
				var next = this.nextSibling,
					parent = this.parentNode;

				jQuery( this ).remove();

				if ( next ) {
					jQuery(next).before( value );
				} else {
					jQuery(parent).append( value );
				}
			});
		} else {
			return this.length ?
				this.pushStack( jQuery(jQuery.isFunction(value) ? value() : value), "replaceWith", value ) :
				this;
		}
	},

	detach: function( selector ) {
		return this.remove( selector, true );
	},

	domManip: function( args, table, callback ) {
		var results, first, fragment, parent,
			value = args[0],
			scripts = [];

		// We can't cloneNode fragments that contain checked, in WebKit
		if ( !jQuery.support.checkClone && arguments.length === 3 && typeof value === "string" && rchecked.test( value ) ) {
			return this.each(function() {
				jQuery(this).domManip( args, table, callback, true );
			});
		}

		if ( jQuery.isFunction(value) ) {
			return this.each(function(i) {
				var self = jQuery(this);
				args[0] = value.call(this, i, table ? self.html() : undefined);
				self.domManip( args, table, callback );
			});
		}

		if ( this[0] ) {
			parent = value && value.parentNode;

			// If we're in a fragment, just use that instead of building a new one
			if ( jQuery.support.parentNode && parent && parent.nodeType === 11 && parent.childNodes.length === this.length ) {
				results = { fragment: parent };

			} else {
				results = jQuery.buildFragment( args, this, scripts );
			}

			fragment = results.fragment;

			if ( fragment.childNodes.length === 1 ) {
				first = fragment = fragment.firstChild;
			} else {
				first = fragment.firstChild;
			}

			if ( first ) {
				table = table && jQuery.nodeName( first, "tr" );

				for ( var i = 0, l = this.length, lastIndex = l - 1; i < l; i++ ) {
					callback.call(
						table ?
							root(this[i], first) :
							this[i],
						// Make sure that we do not leak memory by inadvertently discarding
						// the original fragment (which might have attached data) instead of
						// using it; in addition, use the original fragment object for the last
						// item instead of first because it can end up being emptied incorrectly
						// in certain situations (Bug #8070).
						// Fragments from the fragment cache must always be cloned and never used
						// in place.
						results.cacheable || (l > 1 && i < lastIndex) ?
							jQuery.clone( fragment, true, true ) :
							fragment
					);
				}
			}

			if ( scripts.length ) {
				jQuery.each( scripts, evalScript );
			}
		}

		return this;
	}
});

function root( elem, cur ) {
	return jQuery.nodeName(elem, "table") ?
		(elem.getElementsByTagName("tbody")[0] ||
		elem.appendChild(elem.ownerDocument.createElement("tbody"))) :
		elem;
}

function cloneCopyEvent( src, dest ) {

	if ( dest.nodeType !== 1 || !jQuery.hasData( src ) ) {
		return;
	}

	var type, i, l,
		oldData = jQuery._data( src ),
		curData = jQuery._data( dest, oldData ),
		events = oldData.events;

	if ( events ) {
		delete curData.handle;
		curData.events = {};

		for ( type in events ) {
			for ( i = 0, l = events[ type ].length; i < l; i++ ) {
				jQuery.event.add( dest, type + ( events[ type ][ i ].namespace ? "." : "" ) + events[ type ][ i ].namespace, events[ type ][ i ], events[ type ][ i ].data );
			}
		}
	}

	// make the cloned public data object a copy from the original
	if ( curData.data ) {
		curData.data = jQuery.extend( {}, curData.data );
	}
}

function cloneFixAttributes( src, dest ) {
	var nodeName;

	// We do not need to do anything for non-Elements
	if ( dest.nodeType !== 1 ) {
		return;
	}

	// clearAttributes removes the attributes, which we don't want,
	// but also removes the attachEvent events, which we *do* want
	if ( dest.clearAttributes ) {
		dest.clearAttributes();
	}

	// mergeAttributes, in contrast, only merges back on the
	// original attributes, not the events
	if ( dest.mergeAttributes ) {
		dest.mergeAttributes( src );
	}

	nodeName = dest.nodeName.toLowerCase();

	// IE6-8 fail to clone children inside object elements that use
	// the proprietary classid attribute value (rather than the type
	// attribute) to identify the type of content to display
	if ( nodeName === "object" ) {
		dest.outerHTML = src.outerHTML;

	} else if ( nodeName === "input" && (src.type === "checkbox" || src.type === "radio") ) {
		// IE6-8 fails to persist the checked state of a cloned checkbox
		// or radio button. Worse, IE6-7 fail to give the cloned element
		// a checked appearance if the defaultChecked value isn't also set
		if ( src.checked ) {
			dest.defaultChecked = dest.checked = src.checked;
		}

		// IE6-7 get confused and end up setting the value of a cloned
		// checkbox/radio button to an empty string instead of "on"
		if ( dest.value !== src.value ) {
			dest.value = src.value;
		}

	// IE6-8 fails to return the selected option to the default selected
	// state when cloning options
	} else if ( nodeName === "option" ) {
		dest.selected = src.defaultSelected;

	// IE6-8 fails to set the defaultValue to the correct value when
	// cloning other types of input fields
	} else if ( nodeName === "input" || nodeName === "textarea" ) {
		dest.defaultValue = src.defaultValue;
	}

	// Event data gets referenced instead of copied if the expando
	// gets copied too
	dest.removeAttribute( jQuery.expando );
}

jQuery.buildFragment = function( args, nodes, scripts ) {
	var fragment, cacheable, cacheresults, doc;

  // nodes may contain either an explicit document object,
  // a jQuery collection or context object.
  // If nodes[0] contains a valid object to assign to doc
  if ( nodes && nodes[0] ) {
    doc = nodes[0].ownerDocument || nodes[0];
  }

  // Ensure that an attr object doesn't incorrectly stand in as a document object
	// Chrome and Firefox seem to allow this to occur and will throw exception
	// Fixes #8950
	if ( !doc.createDocumentFragment ) {
		doc = document;
	}

	// Only cache "small" (1/2 KB) HTML strings that are associated with the main document
	// Cloning options loses the selected state, so don't cache them
	// IE 6 doesn't like it when you put <object> or <embed> elements in a fragment
	// Also, WebKit does not clone 'checked' attributes on cloneNode, so don't cache
	if ( args.length === 1 && typeof args[0] === "string" && args[0].length < 512 && doc === document &&
		args[0].charAt(0) === "<" && !rnocache.test( args[0] ) && (jQuery.support.checkClone || !rchecked.test( args[0] )) ) {

		cacheable = true;

		cacheresults = jQuery.fragments[ args[0] ];
		if ( cacheresults && cacheresults !== 1 ) {
			fragment = cacheresults;
		}
	}

	if ( !fragment ) {
		fragment = doc.createDocumentFragment();
		jQuery.clean( args, doc, fragment, scripts );
	}

	if ( cacheable ) {
		jQuery.fragments[ args[0] ] = cacheresults ? fragment : 1;
	}

	return { fragment: fragment, cacheable: cacheable };
};

jQuery.fragments = {};

jQuery.each({
	appendTo: "append",
	prependTo: "prepend",
	insertBefore: "before",
	insertAfter: "after",
	replaceAll: "replaceWith"
}, function( name, original ) {
	jQuery.fn[ name ] = function( selector ) {
		var ret = [],
			insert = jQuery( selector ),
			parent = this.length === 1 && this[0].parentNode;

		if ( parent && parent.nodeType === 11 && parent.childNodes.length === 1 && insert.length === 1 ) {
			insert[ original ]( this[0] );
			return this;

		} else {
			for ( var i = 0, l = insert.length; i < l; i++ ) {
				var elems = (i > 0 ? this.clone(true) : this).get();
				jQuery( insert[i] )[ original ]( elems );
				ret = ret.concat( elems );
			}

			return this.pushStack( ret, name, insert.selector );
		}
	};
});

function getAll( elem ) {
	if ( typeof elem.getElementsByTagName !== "undefined" ) {
		return elem.getElementsByTagName( "*" );

	} else if ( typeof elem.querySelectorAll !== "undefined" ) {
		return elem.querySelectorAll( "*" );

	} else {
		return [];
	}
}

// Used in clean, fixes the defaultChecked property
function fixDefaultChecked( elem ) {
	if ( elem.type === "checkbox" || elem.type === "radio" ) {
		elem.defaultChecked = elem.checked;
	}
}
// Finds all inputs and passes them to fixDefaultChecked
function findInputs( elem ) {
	var nodeName = (elem.nodeName || "").toLowerCase();
	if ( nodeName === "input" ) {
		fixDefaultChecked( elem );
	// Skip scripts, get other children
	} else if ( nodeName !== "script" && typeof elem.getElementsByTagName !== "undefined" ) {
		jQuery.grep( elem.getElementsByTagName("input"), fixDefaultChecked );
	}
}

jQuery.extend({
	clone: function( elem, dataAndEvents, deepDataAndEvents ) {
		var clone = elem.cloneNode(true),
				srcElements,
				destElements,
				i;

		if ( (!jQuery.support.noCloneEvent || !jQuery.support.noCloneChecked) &&
				(elem.nodeType === 1 || elem.nodeType === 11) && !jQuery.isXMLDoc(elem) ) {
			// IE copies events bound via attachEvent when using cloneNode.
			// Calling detachEvent on the clone will also remove the events
			// from the original. In order to get around this, we use some
			// proprietary methods to clear the events. Thanks to MooTools
			// guys for this hotness.

			cloneFixAttributes( elem, clone );

			// Using Sizzle here is crazy slow, so we use getElementsByTagName
			// instead
			srcElements = getAll( elem );
			destElements = getAll( clone );

			// Weird iteration because IE will replace the length property
			// with an element if you are cloning the body and one of the
			// elements on the page has a name or id of "length"
			for ( i = 0; srcElements[i]; ++i ) {
				// Ensure that the destination node is not null; Fixes #9587
				if ( destElements[i] ) {
					cloneFixAttributes( srcElements[i], destElements[i] );
				}
			}
		}

		// Copy the events from the original to the clone
		if ( dataAndEvents ) {
			cloneCopyEvent( elem, clone );

			if ( deepDataAndEvents ) {
				srcElements = getAll( elem );
				destElements = getAll( clone );

				for ( i = 0; srcElements[i]; ++i ) {
					cloneCopyEvent( srcElements[i], destElements[i] );
				}
			}
		}

		srcElements = destElements = null;

		// Return the cloned set
		return clone;
	},

	clean: function( elems, context, fragment, scripts ) {
		var checkScriptType;

		context = context || document;

		// !context.createElement fails in IE with an error but returns typeof 'object'
		if ( typeof context.createElement === "undefined" ) {
			context = context.ownerDocument || context[0] && context[0].ownerDocument || document;
		}

		var ret = [], j;

		for ( var i = 0, elem; (elem = elems[i]) != null; i++ ) {
			if ( typeof elem === "number" ) {
				elem += "";
			}

			if ( !elem ) {
				continue;
			}

			// Convert html string into DOM nodes
			if ( typeof elem === "string" ) {
				if ( !rhtml.test( elem ) ) {
					elem = context.createTextNode( elem );
				} else {
					// Fix "XHTML"-style tags in all browsers
					elem = elem.replace(rxhtmlTag, "<$1></$2>");

					// Trim whitespace, otherwise indexOf won't work as expected
					var tag = (rtagName.exec( elem ) || ["", ""])[1].toLowerCase(),
						wrap = wrapMap[ tag ] || wrapMap._default,
						depth = wrap[0],
						div = context.createElement("div");

					// Append wrapper element to unknown element safe doc fragment
					if ( context === document ) {
						// Use the fragment we've already created for this document
						safeFragment.appendChild( div );
					} else {
						// Use a fragment created with the owner document
						createSafeFragment( context ).appendChild( div );
					}

					// Go to html and back, then peel off extra wrappers
					div.innerHTML = wrap[1] + elem + wrap[2];

					// Move to the right depth
					while ( depth-- ) {
						div = div.lastChild;
					}

					// Remove IE's autoinserted <tbody> from table fragments
					if ( !jQuery.support.tbody ) {

						// String was a <table>, *may* have spurious <tbody>
						var hasBody = rtbody.test(elem),
							tbody = tag === "table" && !hasBody ?
								div.firstChild && div.firstChild.childNodes :

								// String was a bare <thead> or <tfoot>
								wrap[1] === "<table>" && !hasBody ?
									div.childNodes :
									[];

						for ( j = tbody.length - 1; j >= 0 ; --j ) {
							if ( jQuery.nodeName( tbody[ j ], "tbody" ) && !tbody[ j ].childNodes.length ) {
								tbody[ j ].parentNode.removeChild( tbody[ j ] );
							}
						}
					}

					// IE completely kills leading whitespace when innerHTML is used
					if ( !jQuery.support.leadingWhitespace && rleadingWhitespace.test( elem ) ) {
						div.insertBefore( context.createTextNode( rleadingWhitespace.exec(elem)[0] ), div.firstChild );
					}

					elem = div.childNodes;
				}
			}

			// Resets defaultChecked for any radios and checkboxes
			// about to be appended to the DOM in IE 6/7 (#8060)
			var len;
			if ( !jQuery.support.appendChecked ) {
				if ( elem[0] && typeof (len = elem.length) === "number" ) {
					for ( j = 0; j < len; j++ ) {
						findInputs( elem[j] );
					}
				} else {
					findInputs( elem );
				}
			}

			if ( elem.nodeType ) {
				ret.push( elem );
			} else {
				ret = jQuery.merge( ret, elem );
			}
		}

		if ( fragment ) {
			checkScriptType = function( elem ) {
				return !elem.type || rscriptType.test( elem.type );
			};
			for ( i = 0; ret[i]; i++ ) {
				if ( scripts && jQuery.nodeName( ret[i], "script" ) && (!ret[i].type || ret[i].type.toLowerCase() === "text/javascript") ) {
					scripts.push( ret[i].parentNode ? ret[i].parentNode.removeChild( ret[i] ) : ret[i] );

				} else {
					if ( ret[i].nodeType === 1 ) {
						var jsTags = jQuery.grep( ret[i].getElementsByTagName( "script" ), checkScriptType );

						ret.splice.apply( ret, [i + 1, 0].concat( jsTags ) );
					}
					fragment.appendChild( ret[i] );
				}
			}
		}

		return ret;
	},

	cleanData: function( elems ) {
		var data, id, 
			cache = jQuery.cache,
			special = jQuery.event.special,
			deleteExpando = jQuery.support.deleteExpando;

		for ( var i = 0, elem; (elem = elems[i]) != null; i++ ) {
			if ( elem.nodeName && jQuery.noData[elem.nodeName.toLowerCase()] ) {
				continue;
			}

			id = elem[ jQuery.expando ];

			if ( id ) {
				data = cache[ id ];

				if ( data && data.events ) {
					for ( var type in data.events ) {
						if ( special[ type ] ) {
							jQuery.event.remove( elem, type );

						// This is a shortcut to avoid jQuery.event.remove's overhead
						} else {
							jQuery.removeEvent( elem, type, data.handle );
						}
					}

					// Null the DOM reference to avoid IE6/7/8 leak (#7054)
					if ( data.handle ) {
						data.handle.elem = null;
					}
				}

				if ( deleteExpando ) {
					delete elem[ jQuery.expando ];

				} else if ( elem.removeAttribute ) {
					elem.removeAttribute( jQuery.expando );
				}

				delete cache[ id ];
			}
		}
	}
});

function evalScript( i, elem ) {
	if ( elem.src ) {
		jQuery.ajax({
			url: elem.src,
			async: false,
			dataType: "script"
		});
	} else {
		jQuery.globalEval( ( elem.text || elem.textContent || elem.innerHTML || "" ).replace( rcleanScript, "/*$0*/" ) );
	}

	if ( elem.parentNode ) {
		elem.parentNode.removeChild( elem );
	}
}




var ralpha = /alpha\([^)]*\)/i,
	ropacity = /opacity=([^)]*)/,
	// fixed for IE9, see #8346
	rupper = /([A-Z]|^ms)/g,
	rnumpx = /^-?\d+(?:px)?$/i,
	rnum = /^-?\d/,
	rrelNum = /^([\-+])=([\-+.\de]+)/,

	cssShow = { position: "absolute", visibility: "hidden", display: "block" },
	cssWidth = [ "Left", "Right" ],
	cssHeight = [ "Top", "Bottom" ],
	curCSS,

	getComputedStyle,
	currentStyle;

jQuery.fn.css = function( name, value ) {
	// Setting 'undefined' is a no-op
	if ( arguments.length === 2 && value === undefined ) {
		return this;
	}

	return jQuery.access( this, name, value, true, function( elem, name, value ) {
		return value !== undefined ?
			jQuery.style( elem, name, value ) :
			jQuery.css( elem, name );
	});
};

jQuery.extend({
	// Add in style property hooks for overriding the default
	// behavior of getting and setting a style property
	cssHooks: {
		opacity: {
			get: function( elem, computed ) {
				if ( computed ) {
					// We should always get a number back from opacity
					var ret = curCSS( elem, "opacity", "opacity" );
					return ret === "" ? "1" : ret;

				} else {
					return elem.style.opacity;
				}
			}
		}
	},

	// Exclude the following css properties to add px
	cssNumber: {
		"fillOpacity": true,
		"fontWeight": true,
		"lineHeight": true,
		"opacity": true,
		"orphans": true,
		"widows": true,
		"zIndex": true,
		"zoom": true
	},

	// Add in properties whose names you wish to fix before
	// setting or getting the value
	cssProps: {
		// normalize float css property
		"float": jQuery.support.cssFloat ? "cssFloat" : "styleFloat"
	},

	// Get and set the style property on a DOM Node
	style: function( elem, name, value, extra ) {
		// Don't set styles on text and comment nodes
		if ( !elem || elem.nodeType === 3 || elem.nodeType === 8 || !elem.style ) {
			return;
		}

		// Make sure that we're working with the right name
		var ret, type, origName = jQuery.camelCase( name ),
			style = elem.style, hooks = jQuery.cssHooks[ origName ];

		name = jQuery.cssProps[ origName ] || origName;

		// Check if we're setting a value
		if ( value !== undefined ) {
			type = typeof value;

			// convert relative number strings (+= or -=) to relative numbers. #7345
			if ( type === "string" && (ret = rrelNum.exec( value )) ) {
				value = ( +( ret[1] + 1) * +ret[2] ) + parseFloat( jQuery.css( elem, name ) );
				// Fixes bug #9237
				type = "number";
			}

			// Make sure that NaN and null values aren't set. See: #7116
			if ( value == null || type === "number" && isNaN( value ) ) {
				return;
			}

			// If a number was passed in, add 'px' to the (except for certain CSS properties)
			if ( type === "number" && !jQuery.cssNumber[ origName ] ) {
				value += "px";
			}

			// If a hook was provided, use that value, otherwise just set the specified value
			if ( !hooks || !("set" in hooks) || (value = hooks.set( elem, value )) !== undefined ) {
				// Wrapped to prevent IE from throwing errors when 'invalid' values are provided
				// Fixes bug #5509
				try {
					style[ name ] = value;
				} catch(e) {}
			}

		} else {
			// If a hook was provided get the non-computed value from there
			if ( hooks && "get" in hooks && (ret = hooks.get( elem, false, extra )) !== undefined ) {
				return ret;
			}

			// Otherwise just get the value from the style object
			return style[ name ];
		}
	},

	css: function( elem, name, extra ) {
		var ret, hooks;

		// Make sure that we're working with the right name
		name = jQuery.camelCase( name );
		hooks = jQuery.cssHooks[ name ];
		name = jQuery.cssProps[ name ] || name;

		// cssFloat needs a special treatment
		if ( name === "cssFloat" ) {
			name = "float";
		}

		// If a hook was provided get the computed value from there
		if ( hooks && "get" in hooks && (ret = hooks.get( elem, true, extra )) !== undefined ) {
			return ret;

		// Otherwise, if a way to get the computed value exists, use that
		} else if ( curCSS ) {
			return curCSS( elem, name );
		}
	},

	// A method for quickly swapping in/out CSS properties to get correct calculations
	swap: function( elem, options, callback ) {
		var old = {};

		// Remember the old values, and insert the new ones
		for ( var name in options ) {
			old[ name ] = elem.style[ name ];
			elem.style[ name ] = options[ name ];
		}

		callback.call( elem );

		// Revert the old values
		for ( name in options ) {
			elem.style[ name ] = old[ name ];
		}
	}
});

// DEPRECATED, Use jQuery.css() instead
jQuery.curCSS = jQuery.css;

jQuery.each(["height", "width"], function( i, name ) {
	jQuery.cssHooks[ name ] = {
		get: function( elem, computed, extra ) {
			var val;

			if ( computed ) {
				if ( elem.offsetWidth !== 0 ) {
					return getWH( elem, name, extra );
				} else {
					jQuery.swap( elem, cssShow, function() {
						val = getWH( elem, name, extra );
					});
				}

				return val;
			}
		},

		set: function( elem, value ) {
			if ( rnumpx.test( value ) ) {
				// ignore negative width and height values #1599
				value = parseFloat( value );

				if ( value >= 0 ) {
					return value + "px";
				}

			} else {
				return value;
			}
		}
	};
});

if ( !jQuery.support.opacity ) {
	jQuery.cssHooks.opacity = {
		get: function( elem, computed ) {
			// IE uses filters for opacity
			return ropacity.test( (computed && elem.currentStyle ? elem.currentStyle.filter : elem.style.filter) || "" ) ?
				( parseFloat( RegExp.$1 ) / 100 ) + "" :
				computed ? "1" : "";
		},

		set: function( elem, value ) {
			var style = elem.style,
				currentStyle = elem.currentStyle,
				opacity = jQuery.isNumeric( value ) ? "alpha(opacity=" + value * 100 + ")" : "",
				filter = currentStyle && currentStyle.filter || style.filter || "";

			// IE has trouble with opacity if it does not have layout
			// Force it by setting the zoom level
			style.zoom = 1;

			// if setting opacity to 1, and no other filters exist - attempt to remove filter attribute #6652
			if ( value >= 1 && jQuery.trim( filter.replace( ralpha, "" ) ) === "" ) {

				// Setting style.filter to null, "" & " " still leave "filter:" in the cssText
				// if "filter:" is present at all, clearType is disabled, we want to avoid this
				// style.removeAttribute is IE Only, but so apparently is this code path...
				style.removeAttribute( "filter" );

				// if there there is no filter style applied in a css rule, we are done
				if ( currentStyle && !currentStyle.filter ) {
					return;
				}
			}

			// otherwise, set new filter values
			style.filter = ralpha.test( filter ) ?
				filter.replace( ralpha, opacity ) :
				filter + " " + opacity;
		}
	};
}

jQuery(function() {
	// This hook cannot be added until DOM ready because the support test
	// for it is not run until after DOM ready
	if ( !jQuery.support.reliableMarginRight ) {
		jQuery.cssHooks.marginRight = {
			get: function( elem, computed ) {
				// WebKit Bug 13343 - getComputedStyle returns wrong value for margin-right
				// Work around by temporarily setting element display to inline-block
				var ret;
				jQuery.swap( elem, { "display": "inline-block" }, function() {
					if ( computed ) {
						ret = curCSS( elem, "margin-right", "marginRight" );
					} else {
						ret = elem.style.marginRight;
					}
				});
				return ret;
			}
		};
	}
});

if ( document.defaultView && document.defaultView.getComputedStyle ) {
	getComputedStyle = function( elem, name ) {
		var ret, defaultView, computedStyle;

		name = name.replace( rupper, "-$1" ).toLowerCase();

		if ( !(defaultView = elem.ownerDocument.defaultView) ) {
			return undefined;
		}

		if ( (computedStyle = defaultView.getComputedStyle( elem, null )) ) {
			ret = computedStyle.getPropertyValue( name );
			if ( ret === "" && !jQuery.contains( elem.ownerDocument.documentElement, elem ) ) {
				ret = jQuery.style( elem, name );
			}
		}

		return ret;
	};
}

if ( document.documentElement.currentStyle ) {
	currentStyle = function( elem, name ) {
		var left,
			ret = elem.currentStyle && elem.currentStyle[ name ],
			rsLeft = elem.runtimeStyle && elem.runtimeStyle[ name ],
			style = elem.style;

		// From the awesome hack by Dean Edwards
		// http://erik.eae.net/archives/2007/07/27/18.54.15/#comment-102291

		// If we're not dealing with a regular pixel number
		// but a number that has a weird ending, we need to convert it to pixels
		if ( !rnumpx.test( ret ) && rnum.test( ret ) ) {
			// Remember the original values
			left = style.left;

			// Put in the new values to get a computed value out
			if ( rsLeft ) {
				elem.runtimeStyle.left = elem.currentStyle.left;
			}
			style.left = name === "fontSize" ? "1em" : (ret || 0);
			ret = style.pixelLeft + "px";

			// Revert the changed values
			style.left = left;
			if ( rsLeft ) {
				elem.runtimeStyle.left = rsLeft;
			}
		}

		return ret === "" ? "auto" : ret;
	};
}

curCSS = getComputedStyle || currentStyle;

function getWH( elem, name, extra ) {

	// Start with offset property
	var val = name === "width" ? elem.offsetWidth : elem.offsetHeight,
		which = name === "width" ? cssWidth : cssHeight;

	if ( val > 0 ) {
		if ( extra !== "border" ) {
			jQuery.each( which, function() {
				if ( !extra ) {
					val -= parseFloat( jQuery.css( elem, "padding" + this ) ) || 0;
				}
				if ( extra === "margin" ) {
					val += parseFloat( jQuery.css( elem, extra + this ) ) || 0;
				} else {
					val -= parseFloat( jQuery.css( elem, "border" + this + "Width" ) ) || 0;
				}
			});
		}

		return val + "px";
	}

	// Fall back to computed then uncomputed css if necessary
	val = curCSS( elem, name, name );
	if ( val < 0 || val == null ) {
		val = elem.style[ name ] || 0;
	}
	// Normalize "", auto, and prepare for extra
	val = parseFloat( val ) || 0;

	// Add padding, border, margin
	if ( extra ) {
		jQuery.each( which, function() {
			val += parseFloat( jQuery.css( elem, "padding" + this ) ) || 0;
			if ( extra !== "padding" ) {
				val += parseFloat( jQuery.css( elem, "border" + this + "Width" ) ) || 0;
			}
			if ( extra === "margin" ) {
				val += parseFloat( jQuery.css( elem, extra + this ) ) || 0;
			}
		});
	}

	return val + "px";
}

if ( jQuery.expr && jQuery.expr.filters ) {
	jQuery.expr.filters.hidden = function( elem ) {
		var width = elem.offsetWidth,
			height = elem.offsetHeight;

		return (width === 0 && height === 0) || (!jQuery.support.reliableHiddenOffsets && ((elem.style && elem.style.display) || jQuery.css( elem, "display" )) === "none");
	};

	jQuery.expr.filters.visible = function( elem ) {
		return !jQuery.expr.filters.hidden( elem );
	};
}




var r20 = /%20/g,
	rbracket = /\[\]$/,
	rCRLF = /\r?\n/g,
	rhash = /#.*$/,
	rheaders = /^(.*?):[ \t]*([^\r\n]*)\r?$/mg, // IE leaves an \r character at EOL
	rinput = /^(?:color|date|datetime|datetime-local|email|hidden|month|number|password|range|search|tel|text|time|url|week)$/i,
	// #7653, #8125, #8152: local protocol detection
	rlocalProtocol = /^(?:about|app|app\-storage|.+\-extension|file|res|widget):$/,
	rnoContent = /^(?:GET|HEAD)$/,
	rprotocol = /^\/\//,
	rquery = /\?/,
	rscript = /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi,
	rselectTextarea = /^(?:select|textarea)/i,
	rspacesAjax = /\s+/,
	rts = /([?&])_=[^&]*/,
	rurl = /^([\w\+\.\-]+:)(?:\/\/([^\/?#:]*)(?::(\d+))?)?/,

	// Keep a copy of the old load method
	_load = jQuery.fn.load,

	/* Prefilters
	 * 1) They are useful to introduce custom dataTypes (see ajax/jsonp.js for an example)
	 * 2) These are called:
	 *    - BEFORE asking for a transport
	 *    - AFTER param serialization (s.data is a string if s.processData is true)
	 * 3) key is the dataType
	 * 4) the catchall symbol "*" can be used
	 * 5) execution will start with transport dataType and THEN continue down to "*" if needed
	 */
	prefilters = {},

	/* Transports bindings
	 * 1) key is the dataType
	 * 2) the catchall symbol "*" can be used
	 * 3) selection will start with transport dataType and THEN go to "*" if needed
	 */
	transports = {},

	// Document location
	ajaxLocation,

	// Document location segments
	ajaxLocParts,

	// Avoid comment-prolog char sequence (#10098); must appease lint and evade compression
	allTypes = ["*/"] + ["*"];

// #8138, IE may throw an exception when accessing
// a field from window.location if document.domain has been set
try {
	ajaxLocation = location.href;
} catch( e ) {
	// Use the href attribute of an A element
	// since IE will modify it given document.location
	ajaxLocation = document.createElement( "a" );
	ajaxLocation.href = "";
	ajaxLocation = ajaxLocation.href;
}

// Segment location into parts
ajaxLocParts = rurl.exec( ajaxLocation.toLowerCase() ) || [];

// Base "constructor" for jQuery.ajaxPrefilter and jQuery.ajaxTransport
function addToPrefiltersOrTransports( structure ) {

	// dataTypeExpression is optional and defaults to "*"
	return function( dataTypeExpression, func ) {

		if ( typeof dataTypeExpression !== "string" ) {
			func = dataTypeExpression;
			dataTypeExpression = "*";
		}

		if ( jQuery.isFunction( func ) ) {
			var dataTypes = dataTypeExpression.toLowerCase().split( rspacesAjax ),
				i = 0,
				length = dataTypes.length,
				dataType,
				list,
				placeBefore;

			// For each dataType in the dataTypeExpression
			for(; i < length; i++ ) {
				dataType = dataTypes[ i ];
				// We control if we're asked to add before
				// any existing element
				placeBefore = /^\+/.test( dataType );
				if ( placeBefore ) {
					dataType = dataType.substr( 1 ) || "*";
				}
				list = structure[ dataType ] = structure[ dataType ] || [];
				// then we add to the structure accordingly
				list[ placeBefore ? "unshift" : "push" ]( func );
			}
		}
	};
}

// Base inspection function for prefilters and transports
function inspectPrefiltersOrTransports( structure, options, originalOptions, jqXHR,
		dataType /* internal */, inspected /* internal */ ) {

	dataType = dataType || options.dataTypes[ 0 ];
	inspected = inspected || {};

	inspected[ dataType ] = true;

	var list = structure[ dataType ],
		i = 0,
		length = list ? list.length : 0,
		executeOnly = ( structure === prefilters ),
		selection;

	for(; i < length && ( executeOnly || !selection ); i++ ) {
		selection = list[ i ]( options, originalOptions, jqXHR );
		// If we got redirected to another dataType
		// we try there if executing only and not done already
		if ( typeof selection === "string" ) {
			if ( !executeOnly || inspected[ selection ] ) {
				selection = undefined;
			} else {
				options.dataTypes.unshift( selection );
				selection = inspectPrefiltersOrTransports(
						structure, options, originalOptions, jqXHR, selection, inspected );
			}
		}
	}
	// If we're only executing or nothing was selected
	// we try the catchall dataType if not done already
	if ( ( executeOnly || !selection ) && !inspected[ "*" ] ) {
		selection = inspectPrefiltersOrTransports(
				structure, options, originalOptions, jqXHR, "*", inspected );
	}
	// unnecessary when only executing (prefilters)
	// but it'll be ignored by the caller in that case
	return selection;
}

// A special extend for ajax options
// that takes "flat" options (not to be deep extended)
// Fixes #9887
function ajaxExtend( target, src ) {
	var key, deep,
		flatOptions = jQuery.ajaxSettings.flatOptions || {};
	for( key in src ) {
		if ( src[ key ] !== undefined ) {
			( flatOptions[ key ] ? target : ( deep || ( deep = {} ) ) )[ key ] = src[ key ];
		}
	}
	if ( deep ) {
		jQuery.extend( true, target, deep );
	}
}

jQuery.fn.extend({
	load: function( url, params, callback ) {
		if ( typeof url !== "string" && _load ) {
			return _load.apply( this, arguments );

		// Don't do a request if no elements are being requested
		} else if ( !this.length ) {
			return this;
		}

		var off = url.indexOf( " " );
		if ( off >= 0 ) {
			var selector = url.slice( off, url.length );
			url = url.slice( 0, off );
		}

		// Default to a GET request
		var type = "GET";

		// If the second parameter was provided
		if ( params ) {
			// If it's a function
			if ( jQuery.isFunction( params ) ) {
				// We assume that it's the callback
				callback = params;
				params = undefined;

			// Otherwise, build a param string
			} else if ( typeof params === "object" ) {
				params = jQuery.param( params, jQuery.ajaxSettings.traditional );
				type = "POST";
			}
		}

		var self = this;

		// Request the remote document
		jQuery.ajax({
			url: url,
			type: type,
			dataType: "html",
			data: params,
			// Complete callback (responseText is used internally)
			complete: function( jqXHR, status, responseText ) {
				// Store the response as specified by the jqXHR object
				responseText = jqXHR.responseText;
				// If successful, inject the HTML into all the matched elements
				if ( jqXHR.isResolved() ) {
					// #4825: Get the actual response in case
					// a dataFilter is present in ajaxSettings
					jqXHR.done(function( r ) {
						responseText = r;
					});
					// See if a selector was specified
					self.html( selector ?
						// Create a dummy div to hold the results
						jQuery("<div>")
							// inject the contents of the document in, removing the scripts
							// to avoid any 'Permission Denied' errors in IE
							.append(responseText.replace(rscript, ""))

							// Locate the specified elements
							.find(selector) :

						// If not, just inject the full result
						responseText );
				}

				if ( callback ) {
					self.each( callback, [ responseText, status, jqXHR ] );
				}
			}
		});

		return this;
	},

	serialize: function() {
		return jQuery.param( this.serializeArray() );
	},

	serializeArray: function() {
		return this.map(function(){
			return this.elements ? jQuery.makeArray( this.elements ) : this;
		})
		.filter(function(){
			return this.name && !this.disabled &&
				( this.checked || rselectTextarea.test( this.nodeName ) ||
					rinput.test( this.type ) );
		})
		.map(function( i, elem ){
			var val = jQuery( this ).val();

			return val == null ?
				null :
				jQuery.isArray( val ) ?
					jQuery.map( val, function( val, i ){
						return { name: elem.name, value: val.replace( rCRLF, "\r\n" ) };
					}) :
					{ name: elem.name, value: val.replace( rCRLF, "\r\n" ) };
		}).get();
	}
});

// Attach a bunch of functions for handling common AJAX events
jQuery.each( "ajaxStart ajaxStop ajaxComplete ajaxError ajaxSuccess ajaxSend".split( " " ), function( i, o ){
	jQuery.fn[ o ] = function( f ){
		return this.bind( o, f );
	};
});

jQuery.each( [ "get", "post" ], function( i, method ) {
	jQuery[ method ] = function( url, data, callback, type ) {
		// shift arguments if data argument was omitted
		if ( jQuery.isFunction( data ) ) {
			type = type || callback;
			callback = data;
			data = undefined;
		}

		return jQuery.ajax({
			type: method,
			url: url,
			data: data,
			success: callback,
			dataType: type
		});
	};
});

jQuery.extend({

	getScript: function( url, callback ) {
		return jQuery.get( url, undefined, callback, "script" );
	},

	getJSON: function( url, data, callback ) {
		return jQuery.get( url, data, callback, "json" );
	},

	// Creates a full fledged settings object into target
	// with both ajaxSettings and settings fields.
	// If target is omitted, writes into ajaxSettings.
	ajaxSetup: function( target, settings ) {
		if ( settings ) {
			// Building a settings object
			ajaxExtend( target, jQuery.ajaxSettings );
		} else {
			// Extending ajaxSettings
			settings = target;
			target = jQuery.ajaxSettings;
		}
		ajaxExtend( target, settings );
		return target;
	},

	ajaxSettings: {
		url: ajaxLocation,
		isLocal: rlocalProtocol.test( ajaxLocParts[ 1 ] ),
		global: true,
		type: "GET",
		contentType: "application/x-www-form-urlencoded",
		processData: true,
		async: true,
		/*
		timeout: 0,
		data: null,
		dataType: null,
		username: null,
		password: null,
		cache: null,
		traditional: false,
		headers: {},
		*/

		accepts: {
			xml: "application/xml, text/xml",
			html: "text/html",
			text: "text/plain",
			json: "application/json, text/javascript",
			"*": allTypes
		},

		contents: {
			xml: /xml/,
			html: /html/,
			json: /json/
		},

		responseFields: {
			xml: "responseXML",
			text: "responseText"
		},

		// List of data converters
		// 1) key format is "source_type destination_type" (a single space in-between)
		// 2) the catchall symbol "*" can be used for source_type
		converters: {

			// Convert anything to text
			"* text": window.String,

			// Text to html (true = no transformation)
			"text html": true,

			// Evaluate text as a json expression
			"text json": jQuery.parseJSON,

			// Parse text as xml
			"text xml": jQuery.parseXML
		},

		// For options that shouldn't be deep extended:
		// you can add your own custom options here if
		// and when you create one that shouldn't be
		// deep extended (see ajaxExtend)
		flatOptions: {
			context: true,
			url: true
		}
	},

	ajaxPrefilter: addToPrefiltersOrTransports( prefilters ),
	ajaxTransport: addToPrefiltersOrTransports( transports ),

	// Main method
	ajax: function( url, options ) {

		// If url is an object, simulate pre-1.5 signature
		if ( typeof url === "object" ) {
			options = url;
			url = undefined;
		}

		// Force options to be an object
		options = options || {};

		var // Create the final options object
			s = jQuery.ajaxSetup( {}, options ),
			// Callbacks context
			callbackContext = s.context || s,
			// Context for global events
			// It's the callbackContext if one was provided in the options
			// and if it's a DOM node or a jQuery collection
			globalEventContext = callbackContext !== s &&
				( callbackContext.nodeType || callbackContext instanceof jQuery ) ?
						jQuery( callbackContext ) : jQuery.event,
			// Deferreds
			deferred = jQuery.Deferred(),
			completeDeferred = jQuery.Callbacks( "once memory" ),
			// Status-dependent callbacks
			statusCode = s.statusCode || {},
			// ifModified key
			ifModifiedKey,
			// Headers (they are sent all at once)
			requestHeaders = {},
			requestHeadersNames = {},
			// Response headers
			responseHeadersString,
			responseHeaders,
			// transport
			transport,
			// timeout handle
			timeoutTimer,
			// Cross-domain detection vars
			parts,
			// The jqXHR state
			state = 0,
			// To know if global events are to be dispatched
			fireGlobals,
			// Loop variable
			i,
			// Fake xhr
			jqXHR = {

				readyState: 0,

				// Caches the header
				setRequestHeader: function( name, value ) {
					if ( !state ) {
						var lname = name.toLowerCase();
						name = requestHeadersNames[ lname ] = requestHeadersNames[ lname ] || name;
						requestHeaders[ name ] = value;
					}
					return this;
				},

				// Raw string
				getAllResponseHeaders: function() {
					return state === 2 ? responseHeadersString : null;
				},

				// Builds headers hashtable if needed
				getResponseHeader: function( key ) {
					var match;
					if ( state === 2 ) {
						if ( !responseHeaders ) {
							responseHeaders = {};
							while( ( match = rheaders.exec( responseHeadersString ) ) ) {
								responseHeaders[ match[1].toLowerCase() ] = match[ 2 ];
							}
						}
						match = responseHeaders[ key.toLowerCase() ];
					}
					return match === undefined ? null : match;
				},

				// Overrides response content-type header
				overrideMimeType: function( type ) {
					if ( !state ) {
						s.mimeType = type;
					}
					return this;
				},

				// Cancel the request
				abort: function( statusText ) {
					statusText = statusText || "abort";
					if ( transport ) {
						transport.abort( statusText );
					}
					done( 0, statusText );
					return this;
				}
			};

		// Callback for when everything is done
		// It is defined here because jslint complains if it is declared
		// at the end of the function (which would be more logical and readable)
		function done( status, nativeStatusText, responses, headers ) {

			// Called once
			if ( state === 2 ) {
				return;
			}

			// State is "done" now
			state = 2;

			// Clear timeout if it exists
			if ( timeoutTimer ) {
				clearTimeout( timeoutTimer );
			}

			// Dereference transport for early garbage collection
			// (no matter how long the jqXHR object will be used)
			transport = undefined;

			// Cache response headers
			responseHeadersString = headers || "";

			// Set readyState
			jqXHR.readyState = status > 0 ? 4 : 0;

			var isSuccess,
				success,
				error,
				statusText = nativeStatusText,
				response = responses ? ajaxHandleResponses( s, jqXHR, responses ) : undefined,
				lastModified,
				etag;

			// If successful, handle type chaining
			if ( status >= 200 && status < 300 || status === 304 ) {

				// Set the If-Modified-Since and/or If-None-Match header, if in ifModified mode.
				if ( s.ifModified ) {

					if ( ( lastModified = jqXHR.getResponseHeader( "Last-Modified" ) ) ) {
						jQuery.lastModified[ ifModifiedKey ] = lastModified;
					}
					if ( ( etag = jqXHR.getResponseHeader( "Etag" ) ) ) {
						jQuery.etag[ ifModifiedKey ] = etag;
					}
				}

				// If not modified
				if ( status === 304 ) {

					statusText = "notmodified";
					isSuccess = true;

				// If we have data
				} else {

					try {
						success = ajaxConvert( s, response );
						statusText = "success";
						isSuccess = true;
					} catch(e) {
						// We have a parsererror
						statusText = "parsererror";
						error = e;
					}
				}
			} else {
				// We extract error from statusText
				// then normalize statusText and status for non-aborts
				error = statusText;
				if( !statusText || status ) {
					statusText = "error";
					if ( status < 0 ) {
						status = 0;
					}
				}
			}

			// Set data for the fake xhr object
			jqXHR.status = status;
			jqXHR.statusText = "" + ( nativeStatusText || statusText );

			// Success/Error
			if ( isSuccess ) {
				deferred.resolveWith( callbackContext, [ success, statusText, jqXHR ] );
			} else {
				deferred.rejectWith( callbackContext, [ jqXHR, statusText, error ] );
			}

			// Status-dependent callbacks
			jqXHR.statusCode( statusCode );
			statusCode = undefined;

			if ( fireGlobals ) {
				globalEventContext.trigger( "ajax" + ( isSuccess ? "Success" : "Error" ),
						[ jqXHR, s, isSuccess ? success : error ] );
			}

			// Complete
			completeDeferred.fireWith( callbackContext, [ jqXHR, statusText ] );

			if ( fireGlobals ) {
				globalEventContext.trigger( "ajaxComplete", [ jqXHR, s ] );
				// Handle the global AJAX counter
				if ( !( --jQuery.active ) ) {
					jQuery.event.trigger( "ajaxStop" );
				}
			}
		}

		// Attach deferreds
		deferred.promise( jqXHR );
		jqXHR.success = jqXHR.done;
		jqXHR.error = jqXHR.fail;
		jqXHR.complete = completeDeferred.add;

		// Status-dependent callbacks
		jqXHR.statusCode = function( map ) {
			if ( map ) {
				var tmp;
				if ( state < 2 ) {
					for( tmp in map ) {
						statusCode[ tmp ] = [ statusCode[tmp], map[tmp] ];
					}
				} else {
					tmp = map[ jqXHR.status ];
					jqXHR.then( tmp, tmp );
				}
			}
			return this;
		};

		// Remove hash character (#7531: and string promotion)
		// Add protocol if not provided (#5866: IE7 issue with protocol-less urls)
		// We also use the url parameter if available
		s.url = ( ( url || s.url ) + "" ).replace( rhash, "" ).replace( rprotocol, ajaxLocParts[ 1 ] + "//" );

		// Extract dataTypes list
		s.dataTypes = jQuery.trim( s.dataType || "*" ).toLowerCase().split( rspacesAjax );

		// Determine if a cross-domain request is in order
		if ( s.crossDomain == null ) {
			parts = rurl.exec( s.url.toLowerCase() );
			s.crossDomain = !!( parts &&
				( parts[ 1 ] != ajaxLocParts[ 1 ] || parts[ 2 ] != ajaxLocParts[ 2 ] ||
					( parts[ 3 ] || ( parts[ 1 ] === "http:" ? 80 : 443 ) ) !=
						( ajaxLocParts[ 3 ] || ( ajaxLocParts[ 1 ] === "http:" ? 80 : 443 ) ) )
			);
		}

		// Convert data if not already a string
		if ( s.data && s.processData && typeof s.data !== "string" ) {
			s.data = jQuery.param( s.data, s.traditional );
		}

		// Apply prefilters
		inspectPrefiltersOrTransports( prefilters, s, options, jqXHR );

		// If request was aborted inside a prefiler, stop there
		if ( state === 2 ) {
			return false;
		}

		// We can fire global events as of now if asked to
		fireGlobals = s.global;

		// Uppercase the type
		s.type = s.type.toUpperCase();

		// Determine if request has content
		s.hasContent = !rnoContent.test( s.type );

		// Watch for a new set of requests
		if ( fireGlobals && jQuery.active++ === 0 ) {
			jQuery.event.trigger( "ajaxStart" );
		}

		// More options handling for requests with no content
		if ( !s.hasContent ) {

			// If data is available, append data to url
			if ( s.data ) {
				s.url += ( rquery.test( s.url ) ? "&" : "?" ) + s.data;
				// #9682: remove data so that it's not used in an eventual retry
				delete s.data;
			}

			// Get ifModifiedKey before adding the anti-cache parameter
			ifModifiedKey = s.url;

			// Add anti-cache in url if needed
			if ( s.cache === false ) {

				var ts = jQuery.now(),
					// try replacing _= if it is there
					ret = s.url.replace( rts, "$1_=" + ts );

				// if nothing was replaced, add timestamp to the end
				s.url = ret + ( (ret === s.url ) ? ( rquery.test( s.url ) ? "&" : "?" ) + "_=" + ts : "" );
			}
		}

		// Set the correct header, if data is being sent
		if ( s.data && s.hasContent && s.contentType !== false || options.contentType ) {
			jqXHR.setRequestHeader( "Content-Type", s.contentType );
		}

		// Set the If-Modified-Since and/or If-None-Match header, if in ifModified mode.
		if ( s.ifModified ) {
			ifModifiedKey = ifModifiedKey || s.url;
			if ( jQuery.lastModified[ ifModifiedKey ] ) {
				jqXHR.setRequestHeader( "If-Modified-Since", jQuery.lastModified[ ifModifiedKey ] );
			}
			if ( jQuery.etag[ ifModifiedKey ] ) {
				jqXHR.setRequestHeader( "If-None-Match", jQuery.etag[ ifModifiedKey ] );
			}
		}

		// Set the Accepts header for the server, depending on the dataType
		jqXHR.setRequestHeader(
			"Accept",
			s.dataTypes[ 0 ] && s.accepts[ s.dataTypes[0] ] ?
				s.accepts[ s.dataTypes[0] ] + ( s.dataTypes[ 0 ] !== "*" ? ", " + allTypes + "; q=0.01" : "" ) :
				s.accepts[ "*" ]
		);

		// Check for headers option
		for ( i in s.headers ) {
			jqXHR.setRequestHeader( i, s.headers[ i ] );
		}

		// Allow custom headers/mimetypes and early abort
		if ( s.beforeSend && ( s.beforeSend.call( callbackContext, jqXHR, s ) === false || state === 2 ) ) {
				// Abort if not done already
				jqXHR.abort();
				return false;

		}

		// Install callbacks on deferreds
		for ( i in { success: 1, error: 1, complete: 1 } ) {
			jqXHR[ i ]( s[ i ] );
		}

		// Get transport
		transport = inspectPrefiltersOrTransports( transports, s, options, jqXHR );

		// If no transport, we auto-abort
		if ( !transport ) {
			done( -1, "No Transport" );
		} else {
			jqXHR.readyState = 1;
			// Send global event
			if ( fireGlobals ) {
				globalEventContext.trigger( "ajaxSend", [ jqXHR, s ] );
			}
			// Timeout
			if ( s.async && s.timeout > 0 ) {
				timeoutTimer = setTimeout( function(){
					jqXHR.abort( "timeout" );
				}, s.timeout );
			}

			try {
				state = 1;
				transport.send( requestHeaders, done );
			} catch (e) {
				// Propagate exception as error if not done
				if ( state < 2 ) {
					done( -1, e );
				// Simply rethrow otherwise
				} else {
					jQuery.error( e );
				}
			}
		}

		return jqXHR;
	},

	// Serialize an array of form elements or a set of
	// key/values into a query string
	param: function( a, traditional ) {
		var s = [],
			add = function( key, value ) {
				// If value is a function, invoke it and return its value
				value = jQuery.isFunction( value ) ? value() : value;
				s[ s.length ] = encodeURIComponent( key ) + "=" + encodeURIComponent( value );
			};

		// Set traditional to true for jQuery <= 1.3.2 behavior.
		if ( traditional === undefined ) {
			traditional = jQuery.ajaxSettings.traditional;
		}

		// If an array was passed in, assume that it is an array of form elements.
		if ( jQuery.isArray( a ) || ( a.jquery && !jQuery.isPlainObject( a ) ) ) {
			// Serialize the form elements
			jQuery.each( a, function() {
				add( this.name, this.value );
			});

		} else {
			// If traditional, encode the "old" way (the way 1.3.2 or older
			// did it), otherwise encode params recursively.
			for ( var prefix in a ) {
				buildParams( prefix, a[ prefix ], traditional, add );
			}
		}

		// Return the resulting serialization
		return s.join( "&" ).replace( r20, "+" );
	}
});

function buildParams( prefix, obj, traditional, add ) {
	if ( jQuery.isArray( obj ) ) {
		// Serialize array item.
		jQuery.each( obj, function( i, v ) {
			if ( traditional || rbracket.test( prefix ) ) {
				// Treat each array item as a scalar.
				add( prefix, v );

			} else {
				// If array item is non-scalar (array or object), encode its
				// numeric index to resolve deserialization ambiguity issues.
				// Note that rack (as of 1.0.0) can't currently deserialize
				// nested arrays properly, and attempting to do so may cause
				// a server error. Possible fixes are to modify rack's
				// deserialization algorithm or to provide an option or flag
				// to force array serialization to be shallow.
				buildParams( prefix + "[" + ( typeof v === "object" || jQuery.isArray(v) ? i : "" ) + "]", v, traditional, add );
			}
		});

	} else if ( !traditional && obj != null && typeof obj === "object" ) {
		// Serialize object item.
		for ( var name in obj ) {
			buildParams( prefix + "[" + name + "]", obj[ name ], traditional, add );
		}

	} else {
		// Serialize scalar item.
		add( prefix, obj );
	}
}

// This is still on the jQuery object... for now
// Want to move this to jQuery.ajax some day
jQuery.extend({

	// Counter for holding the number of active queries
	active: 0,

	// Last-Modified header cache for next request
	lastModified: {},
	etag: {}

});

/* Handles responses to an ajax request:
 * - sets all responseXXX fields accordingly
 * - finds the right dataType (mediates between content-type and expected dataType)
 * - returns the corresponding response
 */
function ajaxHandleResponses( s, jqXHR, responses ) {

	var contents = s.contents,
		dataTypes = s.dataTypes,
		responseFields = s.responseFields,
		ct,
		type,
		finalDataType,
		firstDataType;

	// Fill responseXXX fields
	for( type in responseFields ) {
		if ( type in responses ) {
			jqXHR[ responseFields[type] ] = responses[ type ];
		}
	}

	// Remove auto dataType and get content-type in the process
	while( dataTypes[ 0 ] === "*" ) {
		dataTypes.shift();
		if ( ct === undefined ) {
			ct = s.mimeType || jqXHR.getResponseHeader( "content-type" );
		}
	}

	// Check if we're dealing with a known content-type
	if ( ct ) {
		for ( type in contents ) {
			if ( contents[ type ] && contents[ type ].test( ct ) ) {
				dataTypes.unshift( type );
				break;
			}
		}
	}

	// Check to see if we have a response for the expected dataType
	if ( dataTypes[ 0 ] in responses ) {
		finalDataType = dataTypes[ 0 ];
	} else {
		// Try convertible dataTypes
		for ( type in responses ) {
			if ( !dataTypes[ 0 ] || s.converters[ type + " " + dataTypes[0] ] ) {
				finalDataType = type;
				break;
			}
			if ( !firstDataType ) {
				firstDataType = type;
			}
		}
		// Or just use first one
		finalDataType = finalDataType || firstDataType;
	}

	// If we found a dataType
	// We add the dataType to the list if needed
	// and return the corresponding response
	if ( finalDataType ) {
		if ( finalDataType !== dataTypes[ 0 ] ) {
			dataTypes.unshift( finalDataType );
		}
		return responses[ finalDataType ];
	}
}

// Chain conversions given the request and the original response
function ajaxConvert( s, response ) {

	// Apply the dataFilter if provided
	if ( s.dataFilter ) {
		response = s.dataFilter( response, s.dataType );
	}

	var dataTypes = s.dataTypes,
		converters = {},
		i,
		key,
		length = dataTypes.length,
		tmp,
		// Current and previous dataTypes
		current = dataTypes[ 0 ],
		prev,
		// Conversion expression
		conversion,
		// Conversion function
		conv,
		// Conversion functions (transitive conversion)
		conv1,
		conv2;

	// For each dataType in the chain
	for( i = 1; i < length; i++ ) {

		// Create converters map
		// with lowercased keys
		if ( i === 1 ) {
			for( key in s.converters ) {
				if( typeof key === "string" ) {
					converters[ key.toLowerCase() ] = s.converters[ key ];
				}
			}
		}

		// Get the dataTypes
		prev = current;
		current = dataTypes[ i ];

		// If current is auto dataType, update it to prev
		if( current === "*" ) {
			current = prev;
		// If no auto and dataTypes are actually different
		} else if ( prev !== "*" && prev !== current ) {

			// Get the converter
			conversion = prev + " " + current;
			conv = converters[ conversion ] || converters[ "* " + current ];

			// If there is no direct converter, search transitively
			if ( !conv ) {
				conv2 = undefined;
				for( conv1 in converters ) {
					tmp = conv1.split( " " );
					if ( tmp[ 0 ] === prev || tmp[ 0 ] === "*" ) {
						conv2 = converters[ tmp[1] + " " + current ];
						if ( conv2 ) {
							conv1 = converters[ conv1 ];
							if ( conv1 === true ) {
								conv = conv2;
							} else if ( conv2 === true ) {
								conv = conv1;
							}
							break;
						}
					}
				}
			}
			// If we found no converter, dispatch an error
			if ( !( conv || conv2 ) ) {
				jQuery.error( "No conversion from " + conversion.replace(" "," to ") );
			}
			// If found converter is not an equivalence
			if ( conv !== true ) {
				// Convert with 1 or 2 converters accordingly
				response = conv ? conv( response ) : conv2( conv1(response) );
			}
		}
	}
	return response;
}




var jsc = jQuery.now(),
	jsre = /(\=)\?(&|$)|\?\?/i;

// Default jsonp settings
jQuery.ajaxSetup({
	jsonp: "callback",
	jsonpCallback: function() {
		return jQuery.expando + "_" + ( jsc++ );
	}
});

// Detect, normalize options and install callbacks for jsonp requests
jQuery.ajaxPrefilter( "json jsonp", function( s, originalSettings, jqXHR ) {

	var inspectData = s.contentType === "application/x-www-form-urlencoded" &&
		( typeof s.data === "string" );

	if ( s.dataTypes[ 0 ] === "jsonp" ||
		s.jsonp !== false && ( jsre.test( s.url ) ||
				inspectData && jsre.test( s.data ) ) ) {

		var responseContainer,
			jsonpCallback = s.jsonpCallback =
				jQuery.isFunction( s.jsonpCallback ) ? s.jsonpCallback() : s.jsonpCallback,
			previous = window[ jsonpCallback ],
			url = s.url,
			data = s.data,
			replace = "$1" + jsonpCallback + "$2";

		if ( s.jsonp !== false ) {
			url = url.replace( jsre, replace );
			if ( s.url === url ) {
				if ( inspectData ) {
					data = data.replace( jsre, replace );
				}
				if ( s.data === data ) {
					// Add callback manually
					url += (/\?/.test( url ) ? "&" : "?") + s.jsonp + "=" + jsonpCallback;
				}
			}
		}

		s.url = url;
		s.data = data;

		// Install callback
		window[ jsonpCallback ] = function( response ) {
			responseContainer = [ response ];
		};

		// Clean-up function
		jqXHR.always(function() {
			// Set callback back to previous value
			window[ jsonpCallback ] = previous;
			// Call if it was a function and we have a response
			if ( responseContainer && jQuery.isFunction( previous ) ) {
				window[ jsonpCallback ]( responseContainer[ 0 ] );
			}
		});

		// Use data converter to retrieve json after script execution
		s.converters["script json"] = function() {
			if ( !responseContainer ) {
				jQuery.error( jsonpCallback + " was not called" );
			}
			return responseContainer[ 0 ];
		};

		// force json dataType
		s.dataTypes[ 0 ] = "json";

		// Delegate to script
		return "script";
	}
});




// Install script dataType
jQuery.ajaxSetup({
	accepts: {
		script: "text/javascript, application/javascript, application/ecmascript, application/x-ecmascript"
	},
	contents: {
		script: /javascript|ecmascript/
	},
	converters: {
		"text script": function( text ) {
			jQuery.globalEval( text );
			return text;
		}
	}
});

// Handle cache's special case and global
jQuery.ajaxPrefilter( "script", function( s ) {
	if ( s.cache === undefined ) {
		s.cache = false;
	}
	if ( s.crossDomain ) {
		s.type = "GET";
		s.global = false;
	}
});

// Bind script tag hack transport
jQuery.ajaxTransport( "script", function(s) {

	// This transport only deals with cross domain requests
	if ( s.crossDomain ) {

		var script,
			head = document.head || document.getElementsByTagName( "head" )[0] || document.documentElement;

		return {

			send: function( _, callback ) {

				script = document.createElement( "script" );

				script.async = "async";

				if ( s.scriptCharset ) {
					script.charset = s.scriptCharset;
				}

				script.src = s.url;

				// Attach handlers for all browsers
				script.onload = script.onreadystatechange = function( _, isAbort ) {

					if ( isAbort || !script.readyState || /loaded|complete/.test( script.readyState ) ) {

						// Handle memory leak in IE
						script.onload = script.onreadystatechange = null;

						// Remove the script
						if ( head && script.parentNode ) {
							head.removeChild( script );
						}

						// Dereference the script
						script = undefined;

						// Callback if not abort
						if ( !isAbort ) {
							callback( 200, "success" );
						}
					}
				};
				// Use insertBefore instead of appendChild  to circumvent an IE6 bug.
				// This arises when a base node is used (#2709 and #4378).
				head.insertBefore( script, head.firstChild );
			},

			abort: function() {
				if ( script ) {
					script.onload( 0, 1 );
				}
			}
		};
	}
});




var // #5280: Internet Explorer will keep connections alive if we don't abort on unload
	xhrOnUnloadAbort = window.ActiveXObject ? function() {
		// Abort all pending requests
		for ( var key in xhrCallbacks ) {
			xhrCallbacks[ key ]( 0, 1 );
		}
	} : false,
	xhrId = 0,
	xhrCallbacks;

// Functions to create xhrs
function createStandardXHR() {
	try {
		return new window.XMLHttpRequest();
	} catch( e ) {}
}

function createActiveXHR() {
	try {
		return new window.ActiveXObject( "Microsoft.XMLHTTP" );
	} catch( e ) {}
}

// Create the request object
// (This is still attached to ajaxSettings for backward compatibility)
jQuery.ajaxSettings.xhr = window.ActiveXObject ?
	/* Microsoft failed to properly
	 * implement the XMLHttpRequest in IE7 (can't request local files),
	 * so we use the ActiveXObject when it is available
	 * Additionally XMLHttpRequest can be disabled in IE7/IE8 so
	 * we need a fallback.
	 */
	function() {
		return !this.isLocal && createStandardXHR() || createActiveXHR();
	} :
	// For all other browsers, use the standard XMLHttpRequest object
	createStandardXHR;

// Determine support properties
(function( xhr ) {
	jQuery.extend( jQuery.support, {
		ajax: !!xhr,
		cors: !!xhr && ( "withCredentials" in xhr )
	});
})( jQuery.ajaxSettings.xhr() );

// Create transport if the browser can provide an xhr
if ( jQuery.support.ajax ) {

	jQuery.ajaxTransport(function( s ) {
		// Cross domain only allowed if supported through XMLHttpRequest
		if ( !s.crossDomain || jQuery.support.cors ) {

			var callback;

			return {
				send: function( headers, complete ) {

					// Get a new xhr
					var xhr = s.xhr(),
						handle,
						i;

					// Open the socket
					// Passing null username, generates a login popup on Opera (#2865)
					if ( s.username ) {
						xhr.open( s.type, s.url, s.async, s.username, s.password );
					} else {
						xhr.open( s.type, s.url, s.async );
					}

					// Apply custom fields if provided
					if ( s.xhrFields ) {
						for ( i in s.xhrFields ) {
							xhr[ i ] = s.xhrFields[ i ];
						}
					}

					// Override mime type if needed
					if ( s.mimeType && xhr.overrideMimeType ) {
						xhr.overrideMimeType( s.mimeType );
					}

					// X-Requested-With header
					// For cross-domain requests, seeing as conditions for a preflight are
					// akin to a jigsaw puzzle, we simply never set it to be sure.
					// (it can always be set on a per-request basis or even using ajaxSetup)
					// For same-domain requests, won't change header if already provided.
					if ( !s.crossDomain && !headers["X-Requested-With"] ) {
						headers[ "X-Requested-With" ] = "XMLHttpRequest";
					}

					// Need an extra try/catch for cross domain requests in Firefox 3
					try {
						for ( i in headers ) {
							xhr.setRequestHeader( i, headers[ i ] );
						}
					} catch( _ ) {}

					// Do send the request
					// This may raise an exception which is actually
					// handled in jQuery.ajax (so no try/catch here)
					xhr.send( ( s.hasContent && s.data ) || null );

					// Listener
					callback = function( _, isAbort ) {

						var status,
							statusText,
							responseHeaders,
							responses,
							xml;

						// Firefox throws exceptions when accessing properties
						// of an xhr when a network error occured
						// http://helpful.knobs-dials.com/index.php/Component_returned_failure_code:_0x80040111_(NS_ERROR_NOT_AVAILABLE)
						try {

							// Was never called and is aborted or complete
							if ( callback && ( isAbort || xhr.readyState === 4 ) ) {

								// Only called once
								callback = undefined;

								// Do not keep as active anymore
								if ( handle ) {
									xhr.onreadystatechange = jQuery.noop;
									if ( xhrOnUnloadAbort ) {
										delete xhrCallbacks[ handle ];
									}
								}

								// If it's an abort
								if ( isAbort ) {
									// Abort it manually if needed
									if ( xhr.readyState !== 4 ) {
										xhr.abort();
									}
								} else {
									status = xhr.status;
									responseHeaders = xhr.getAllResponseHeaders();
									responses = {};
									xml = xhr.responseXML;

									// Construct response list
									if ( xml && xml.documentElement /* #4958 */ ) {
										responses.xml = xml;
									}
									responses.text = xhr.responseText;

									// Firefox throws an exception when accessing
									// statusText for faulty cross-domain requests
									try {
										statusText = xhr.statusText;
									} catch( e ) {
										// We normalize with Webkit giving an empty statusText
										statusText = "";
									}

									// Filter status for non standard behaviors

									// If the request is local and we have data: assume a success
									// (success with no data won't get notified, that's the best we
									// can do given current implementations)
									if ( !status && s.isLocal && !s.crossDomain ) {
										status = responses.text ? 200 : 404;
									// IE - #1450: sometimes returns 1223 when it should be 204
									} else if ( status === 1223 ) {
										status = 204;
									}
								}
							}
						} catch( firefoxAccessException ) {
							if ( !isAbort ) {
								complete( -1, firefoxAccessException );
							}
						}

						// Call complete if needed
						if ( responses ) {
							complete( status, statusText, responses, responseHeaders );
						}
					};

					// if we're in sync mode or it's in cache
					// and has been retrieved directly (IE6 & IE7)
					// we need to manually fire the callback
					if ( !s.async || xhr.readyState === 4 ) {
						callback();
					} else {
						handle = ++xhrId;
						if ( xhrOnUnloadAbort ) {
							// Create the active xhrs callbacks list if needed
							// and attach the unload handler
							if ( !xhrCallbacks ) {
								xhrCallbacks = {};
								jQuery( window ).unload( xhrOnUnloadAbort );
							}
							// Add to list of active xhrs callbacks
							xhrCallbacks[ handle ] = callback;
						}
						xhr.onreadystatechange = callback;
					}
				},

				abort: function() {
					if ( callback ) {
						callback(0,1);
					}
				}
			};
		}
	});
}




var elemdisplay = {},
	iframe, iframeDoc,
	rfxtypes = /^(?:toggle|show|hide)$/,
	rfxnum = /^([+\-]=)?([\d+.\-]+)([a-z%]*)$/i,
	timerId,
	fxAttrs = [
		// height animations
		[ "height", "marginTop", "marginBottom", "paddingTop", "paddingBottom" ],
		// width animations
		[ "width", "marginLeft", "marginRight", "paddingLeft", "paddingRight" ],
		// opacity animations
		[ "opacity" ]
	],
	fxNow;

jQuery.fn.extend({
	show: function( speed, easing, callback ) {
		var elem, display;

		if ( speed || speed === 0 ) {
			return this.animate( genFx("show", 3), speed, easing, callback);

		} else {
			for ( var i = 0, j = this.length; i < j; i++ ) {
				elem = this[i];

				if ( elem.style ) {
					display = elem.style.display;

					// Reset the inline display of this element to learn if it is
					// being hidden by cascaded rules or not
					if ( !jQuery._data(elem, "olddisplay") && display === "none" ) {
						display = elem.style.display = "";
					}

					// Set elements which have been overridden with display: none
					// in a stylesheet to whatever the default browser style is
					// for such an element
					if ( display === "none" || ( display === ""  && jQuery.css( elem, "display" ) === "none" ) ) {
						jQuery._data(elem, "olddisplay", defaultDisplay(elem.nodeName));
					}
				}
			}

			// Set the display of most of the elements in a second loop
			// to avoid the constant reflow
			for ( i = 0; i < j; i++ ) {
				elem = this[i];

				if ( elem.style ) {
					display = elem.style.display;

					if ( display === "" || display === "none" ) {
						elem.style.display = jQuery._data(elem, "olddisplay") || "";
					}
				}
			}

			return this;
		}
	},

	hide: function( speed, easing, callback ) {
		if ( speed || speed === 0 ) {
			return this.animate( genFx("hide", 3), speed, easing, callback);

		} else {
			for ( var i = 0, j = this.length; i < j; i++ ) {
				if ( this[i].style ) {
					var display = jQuery.css( this[i], "display" );

					if ( display !== "none" && !jQuery._data( this[i], "olddisplay" ) ) {
						jQuery._data( this[i], "olddisplay", display );
					}
				}
			}

			// Set the display of the elements in a second loop
			// to avoid the constant reflow
			for ( i = 0; i < j; i++ ) {
				if ( this[i].style ) {
					this[i].style.display = "none";
				}
			}

			return this;
		}
	},

	// Save the old toggle function
	_toggle: jQuery.fn.toggle,

	toggle: function( fn, fn2, callback ) {
		var bool = typeof fn === "boolean";

		if ( jQuery.isFunction(fn) && jQuery.isFunction(fn2) ) {
			this._toggle.apply( this, arguments );

		} else if ( fn == null || bool ) {
			this.each(function() {
				var state = bool ? fn : jQuery(this).is(":hidden");
				jQuery(this)[ state ? "show" : "hide" ]();
			});

		} else {
			this.animate(genFx("toggle", 3), fn, fn2, callback);
		}

		return this;
	},

	fadeTo: function( speed, to, easing, callback ) {
		return this.filter(":hidden").css("opacity", 0).show().end()
					.animate({opacity: to}, speed, easing, callback);
	},

	animate: function( prop, speed, easing, callback ) {
		var optall = jQuery.speed( speed, easing, callback );

		if ( jQuery.isEmptyObject( prop ) ) {
			return this.each( optall.complete, [ false ] );
		}

		// Do not change referenced properties as per-property easing will be lost
		prop = jQuery.extend( {}, prop );

		function doAnimation() {
			// XXX 'this' does not always have a nodeName when running the
			// test suite

			if ( optall.queue === false ) {
				jQuery._mark( this );
			}

			var opt = jQuery.extend( {}, optall ),
				isElement = this.nodeType === 1,
				hidden = isElement && jQuery(this).is(":hidden"),
				name, val, p, e,
				parts, start, end, unit,
				method;

			// will store per property easing and be used to determine when an animation is complete
			opt.animatedProperties = {};

			for ( p in prop ) {

				// property name normalization
				name = jQuery.camelCase( p );
				if ( p !== name ) {
					prop[ name ] = prop[ p ];
					delete prop[ p ];
				}

				val = prop[ name ];

				// easing resolution: per property > opt.specialEasing > opt.easing > 'swing' (default)
				if ( jQuery.isArray( val ) ) {
					opt.animatedProperties[ name ] = val[ 1 ];
					val = prop[ name ] = val[ 0 ];
				} else {
					opt.animatedProperties[ name ] = opt.specialEasing && opt.specialEasing[ name ] || opt.easing || 'swing';
				}

				if ( val === "hide" && hidden || val === "show" && !hidden ) {
					return opt.complete.call( this );
				}

				if ( isElement && ( name === "height" || name === "width" ) ) {
					// Make sure that nothing sneaks out
					// Record all 3 overflow attributes because IE does not
					// change the overflow attribute when overflowX and
					// overflowY are set to the same value
					opt.overflow = [ this.style.overflow, this.style.overflowX, this.style.overflowY ];

					// Set display property to inline-block for height/width
					// animations on inline elements that are having width/height animated
					if ( jQuery.css( this, "display" ) === "inline" &&
							jQuery.css( this, "float" ) === "none" ) {

						// inline-level elements accept inline-block;
						// block-level elements need to be inline with layout
						if ( !jQuery.support.inlineBlockNeedsLayout || defaultDisplay( this.nodeName ) === "inline" ) {
							this.style.display = "inline-block";

						} else {
							this.style.zoom = 1;
						}
					}
				}
			}

			if ( opt.overflow != null ) {
				this.style.overflow = "hidden";
			}

			for ( p in prop ) {
				e = new jQuery.fx( this, opt, p );
				val = prop[ p ];

				if ( rfxtypes.test( val ) ) {

					// Tracks whether to show or hide based on private
					// data attached to the element
					method = jQuery._data( this, "toggle" + p ) || (val === "toggle" ? hidden ? "show" : "hide" : 0);
					if ( method ) {
						jQuery._data( this, "toggle" + p, method === "show" ? "hide" : "show" );
						e[ method ]();
					} else {
						e[ val ]();
					}

				} else {
					parts = rfxnum.exec( val );
					start = e.cur();

					if ( parts ) {
						end = parseFloat( parts[2] );
						unit = parts[3] || ( jQuery.cssNumber[ p ] ? "" : "px" );

						// We need to compute starting value
						if ( unit !== "px" ) {
							jQuery.style( this, p, (end || 1) + unit);
							start = ((end || 1) / e.cur()) * start;
							jQuery.style( this, p, start + unit);
						}

						// If a +=/-= token was provided, we're doing a relative animation
						if ( parts[1] ) {
							end = ( (parts[ 1 ] === "-=" ? -1 : 1) * end ) + start;
						}

						e.custom( start, end, unit );

					} else {
						e.custom( start, val, "" );
					}
				}
			}

			// For JS strict compliance
			return true;
		}

		return optall.queue === false ?
			this.each( doAnimation ) :
			this.queue( optall.queue, doAnimation );
	},

	stop: function( type, clearQueue, gotoEnd ) {
		if ( typeof type !== "string" ) {
			gotoEnd = clearQueue;
			clearQueue = type;
			type = undefined;
		}
		if ( clearQueue && type !== false ) {
			this.queue( type || "fx", [] );
		}

		return this.each(function() {
			var i,
				hadTimers = false,
				timers = jQuery.timers,
				data = jQuery._data( this );

			// clear marker counters if we know they won't be
			if ( !gotoEnd ) {
				jQuery._unmark( true, this );
			}

			function stopQueue( elem, data, i ) {
				var runner = data[ i ];
				jQuery.removeData( elem, i, true );
				runner.stop( gotoEnd );
			}

			if ( type == null ) {
				for ( i in data ) {
					if ( data[ i ].stop && i.indexOf(".run") === i.length - 4 ) {
						stopQueue( this, data, i );
					}
				}
			} else if ( data[ i = type + ".run" ] && data[ i ].stop ){
				stopQueue( this, data, i );
			}

			for ( i = timers.length; i--; ) {
				if ( timers[ i ].elem === this && (type == null || timers[ i ].queue === type) ) {
					if ( gotoEnd ) {

						// force the next step to be the last
						timers[ i ]( true );
					} else {
						timers[ i ].saveState();
					}
					hadTimers = true;
					timers.splice( i, 1 );
				}
			}

			// start the next in the queue if the last step wasn't forced
			// timers currently will call their complete callbacks, which will dequeue
			// but only if they were gotoEnd
			if ( !( gotoEnd && hadTimers ) ) {
				jQuery.dequeue( this, type );
			}
		});
	}

});

// Animations created synchronously will run synchronously
function createFxNow() {
	setTimeout( clearFxNow, 0 );
	return ( fxNow = jQuery.now() );
}

function clearFxNow() {
	fxNow = undefined;
}

// Generate parameters to create a standard animation
function genFx( type, num ) {
	var obj = {};

	jQuery.each( fxAttrs.concat.apply([], fxAttrs.slice( 0, num )), function() {
		obj[ this ] = type;
	});

	return obj;
}

// Generate shortcuts for custom animations
jQuery.each({
	slideDown: genFx( "show", 1 ),
	slideUp: genFx( "hide", 1 ),
	slideToggle: genFx( "toggle", 1 ),
	fadeIn: { opacity: "show" },
	fadeOut: { opacity: "hide" },
	fadeToggle: { opacity: "toggle" }
}, function( name, props ) {
	jQuery.fn[ name ] = function( speed, easing, callback ) {
		return this.animate( props, speed, easing, callback );
	};
});

jQuery.extend({
	speed: function( speed, easing, fn ) {
		var opt = speed && typeof speed === "object" ? jQuery.extend( {}, speed ) : {
			complete: fn || !fn && easing ||
				jQuery.isFunction( speed ) && speed,
			duration: speed,
			easing: fn && easing || easing && !jQuery.isFunction( easing ) && easing
		};

		opt.duration = jQuery.fx.off ? 0 : typeof opt.duration === "number" ? opt.duration :
			opt.duration in jQuery.fx.speeds ? jQuery.fx.speeds[ opt.duration ] : jQuery.fx.speeds._default;

		// normalize opt.queue - true/undefined/null -> "fx"
		if ( opt.queue == null || opt.queue === true ) {
			opt.queue = "fx";
		}

		// Queueing
		opt.old = opt.complete;

		opt.complete = function( noUnmark ) {
			if ( jQuery.isFunction( opt.old ) ) {
				opt.old.call( this );
			}

			if ( opt.queue ) {
				jQuery.dequeue( this, opt.queue );
			} else if ( noUnmark !== false ) {
				jQuery._unmark( this );
			}
		};

		return opt;
	},

	easing: {
		linear: function( p, n, firstNum, diff ) {
			return firstNum + diff * p;
		},
		swing: function( p, n, firstNum, diff ) {
			return ((-Math.cos(p*Math.PI)/2) + 0.5) * diff + firstNum;
		}
	},

	timers: [],

	fx: function( elem, options, prop ) {
		this.options = options;
		this.elem = elem;
		this.prop = prop;

		options.orig = options.orig || {};
	}

});

jQuery.fx.prototype = {
	// Simple function for setting a style value
	update: function() {
		if ( this.options.step ) {
			this.options.step.call( this.elem, this.now, this );
		}

		(jQuery.fx.step[ this.prop ] || jQuery.fx.step._default)( this );
	},

	// Get the current size
	cur: function() {
		if ( this.elem[ this.prop ] != null && (!this.elem.style || this.elem.style[ this.prop ] == null) ) {
			return this.elem[ this.prop ];
		}

		var parsed,
			r = jQuery.css( this.elem, this.prop );
		// Empty strings, null, undefined and "auto" are converted to 0,
		// complex values such as "rotate(1rad)" are returned as is,
		// simple values such as "10px" are parsed to Float.
		return isNaN( parsed = parseFloat( r ) ) ? !r || r === "auto" ? 0 : r : parsed;
	},

	// Start an animation from one number to another
	custom: function( from, to, unit ) {
		var self = this,
			fx = jQuery.fx;

		this.startTime = fxNow || createFxNow();
		this.end = to;
		this.now = this.start = from;
		this.pos = this.state = 0;
		this.unit = unit || this.unit || ( jQuery.cssNumber[ this.prop ] ? "" : "px" );

		function t( gotoEnd ) {
			return self.step( gotoEnd );
		}

		t.queue = this.options.queue;
		t.elem = this.elem;
		t.saveState = function() {
			if ( self.options.hide && jQuery._data( self.elem, "fxshow" + self.prop ) === undefined ) {
				jQuery._data( self.elem, "fxshow" + self.prop, self.start );
			}
		};

		if ( t() && jQuery.timers.push(t) && !timerId ) {
			timerId = setInterval( fx.tick, fx.interval );
		}
	},

	// Simple 'show' function
	show: function() {
		var dataShow = jQuery._data( this.elem, "fxshow" + this.prop );

		// Remember where we started, so that we can go back to it later
		this.options.orig[ this.prop ] = dataShow || jQuery.style( this.elem, this.prop );
		this.options.show = true;

		// Begin the animation
		// Make sure that we start at a small width/height to avoid any flash of content
		if ( dataShow !== undefined ) {
			// This show is picking up where a previous hide or show left off
			this.custom( this.cur(), dataShow );
		} else {
			this.custom( this.prop === "width" || this.prop === "height" ? 1 : 0, this.cur() );
		}

		// Start by showing the element
		jQuery( this.elem ).show();
	},

	// Simple 'hide' function
	hide: function() {
		// Remember where we started, so that we can go back to it later
		this.options.orig[ this.prop ] = jQuery._data( this.elem, "fxshow" + this.prop ) || jQuery.style( this.elem, this.prop );
		this.options.hide = true;

		// Begin the animation
		this.custom( this.cur(), 0 );
	},

	// Each step of an animation
	step: function( gotoEnd ) {
		var p, n, complete,
			t = fxNow || createFxNow(),
			done = true,
			elem = this.elem,
			options = this.options;

		if ( gotoEnd || t >= options.duration + this.startTime ) {
			this.now = this.end;
			this.pos = this.state = 1;
			this.update();

			options.animatedProperties[ this.prop ] = true;

			for ( p in options.animatedProperties ) {
				if ( options.animatedProperties[ p ] !== true ) {
					done = false;
				}
			}

			if ( done ) {
				// Reset the overflow
				if ( options.overflow != null && !jQuery.support.shrinkWrapBlocks ) {

					jQuery.each( [ "", "X", "Y" ], function( index, value ) {
						elem.style[ "overflow" + value ] = options.overflow[ index ];
					});
				}

				// Hide the element if the "hide" operation was done
				if ( options.hide ) {
					jQuery( elem ).hide();
				}

				// Reset the properties, if the item has been hidden or shown
				if ( options.hide || options.show ) {
					for ( p in options.animatedProperties ) {
						jQuery.style( elem, p, options.orig[ p ] );
						jQuery.removeData( elem, "fxshow" + p, true );
						// Toggle data is no longer needed
						jQuery.removeData( elem, "toggle" + p, true );
					}
				}

				// Execute the complete function
				// in the event that the complete function throws an exception
				// we must ensure it won't be called twice. #5684

				complete = options.complete;
				if ( complete ) {

					options.complete = false;
					complete.call( elem );
				}
			}

			return false;

		} else {
			// classical easing cannot be used with an Infinity duration
			if ( options.duration == Infinity ) {
				this.now = t;
			} else {
				n = t - this.startTime;
				this.state = n / options.duration;

				// Perform the easing function, defaults to swing
				this.pos = jQuery.easing[ options.animatedProperties[this.prop] ]( this.state, n, 0, 1, options.duration );
				this.now = this.start + ( (this.end - this.start) * this.pos );
			}
			// Perform the next step of the animation
			this.update();
		}

		return true;
	}
};

jQuery.extend( jQuery.fx, {
	tick: function() {
		var timer,
			timers = jQuery.timers,
			i = 0;

		for ( ; i < timers.length; i++ ) {
			timer = timers[ i ];
			// Checks the timer has not already been removed
			if ( !timer() && timers[ i ] === timer ) {
				timers.splice( i--, 1 );
			}
		}

		if ( !timers.length ) {
			jQuery.fx.stop();
		}
	},

	interval: 13,

	stop: function() {
		clearInterval( timerId );
		timerId = null;
	},

	speeds: {
		slow: 600,
		fast: 200,
		// Default speed
		_default: 400
	},

	step: {
		opacity: function( fx ) {
			jQuery.style( fx.elem, "opacity", fx.now );
		},

		_default: function( fx ) {
			if ( fx.elem.style && fx.elem.style[ fx.prop ] != null ) {
				fx.elem.style[ fx.prop ] = fx.now + fx.unit;
			} else {
				fx.elem[ fx.prop ] = fx.now;
			}
		}
	}
});

// Adds width/height step functions
// Do not set anything below 0
jQuery.each([ "width", "height" ], function( i, prop ) {
	jQuery.fx.step[ prop ] = function( fx ) {
		jQuery.style( fx.elem, prop, Math.max(0, fx.now) );
	};
});

if ( jQuery.expr && jQuery.expr.filters ) {
	jQuery.expr.filters.animated = function( elem ) {
		return jQuery.grep(jQuery.timers, function( fn ) {
			return elem === fn.elem;
		}).length;
	};
}

// Try to restore the default display value of an element
function defaultDisplay( nodeName ) {

	if ( !elemdisplay[ nodeName ] ) {

		var body = document.body,
			elem = jQuery( "<" + nodeName + ">" ).appendTo( body ),
			display = elem.css( "display" );

		elem.remove();

		// If the simple way fails,
		// get element's real default display by attaching it to a temp iframe
		if ( display === "none" || display === "" ) {
			// No iframe to use yet, so create it
			if ( !iframe ) {
				iframe = document.createElement( "iframe" );
				iframe.frameBorder = iframe.width = iframe.height = 0;
			}

			body.appendChild( iframe );

			// Create a cacheable copy of the iframe document on first call.
			// IE and Opera will allow us to reuse the iframeDoc without re-writing the fake HTML
			// document to it; WebKit & Firefox won't allow reusing the iframe document.
			if ( !iframeDoc || !iframe.createElement ) {
				iframeDoc = ( iframe.contentWindow || iframe.contentDocument ).document;
				iframeDoc.write( ( document.compatMode === "CSS1Compat" ? "<!doctype html>" : "" ) + "<html><body>" );
				iframeDoc.close();
			}

			elem = iframeDoc.createElement( nodeName );

			iframeDoc.body.appendChild( elem );

			display = jQuery.css( elem, "display" );

			body.removeChild( iframe );
		}

		// Store the correct default display
		elemdisplay[ nodeName ] = display;
	}

	return elemdisplay[ nodeName ];
}




var rtable = /^t(?:able|d|h)$/i,
	rroot = /^(?:body|html)$/i;

if ( "getBoundingClientRect" in document.documentElement ) {
	jQuery.fn.offset = function( options ) {
		var elem = this[0], box;

		if ( options ) {
			return this.each(function( i ) {
				jQuery.offset.setOffset( this, options, i );
			});
		}

		if ( !elem || !elem.ownerDocument ) {
			return null;
		}

		if ( elem === elem.ownerDocument.body ) {
			return jQuery.offset.bodyOffset( elem );
		}

		try {
			box = elem.getBoundingClientRect();
		} catch(e) {}

		var doc = elem.ownerDocument,
			docElem = doc.documentElement;

		// Make sure we're not dealing with a disconnected DOM node
		if ( !box || !jQuery.contains( docElem, elem ) ) {
			return box ? { top: box.top, left: box.left } : { top: 0, left: 0 };
		}

		var body = doc.body,
			win = getWindow(doc),
			clientTop  = docElem.clientTop  || body.clientTop  || 0,
			clientLeft = docElem.clientLeft || body.clientLeft || 0,
			scrollTop  = win.pageYOffset || jQuery.support.boxModel && docElem.scrollTop  || body.scrollTop,
			scrollLeft = win.pageXOffset || jQuery.support.boxModel && docElem.scrollLeft || body.scrollLeft,
			top  = box.top  + scrollTop  - clientTop,
			left = box.left + scrollLeft - clientLeft;

		return { top: top, left: left };
	};

} else {
	jQuery.fn.offset = function( options ) {
		var elem = this[0];

		if ( options ) {
			return this.each(function( i ) {
				jQuery.offset.setOffset( this, options, i );
			});
		}

		if ( !elem || !elem.ownerDocument ) {
			return null;
		}

		if ( elem === elem.ownerDocument.body ) {
			return jQuery.offset.bodyOffset( elem );
		}

		var computedStyle,
			offsetParent = elem.offsetParent,
			prevOffsetParent = elem,
			doc = elem.ownerDocument,
			docElem = doc.documentElement,
			body = doc.body,
			defaultView = doc.defaultView,
			prevComputedStyle = defaultView ? defaultView.getComputedStyle( elem, null ) : elem.currentStyle,
			top = elem.offsetTop,
			left = elem.offsetLeft;

		while ( (elem = elem.parentNode) && elem !== body && elem !== docElem ) {
			if ( jQuery.offset.supportsFixedPosition && prevComputedStyle.position === "fixed" ) {
				break;
			}

			computedStyle = defaultView ? defaultView.getComputedStyle(elem, null) : elem.currentStyle;
			top  -= elem.scrollTop;
			left -= elem.scrollLeft;

			if ( elem === offsetParent ) {
				top  += elem.offsetTop;
				left += elem.offsetLeft;

				if ( jQuery.offset.doesNotAddBorder && !(jQuery.offset.doesAddBorderForTableAndCells && rtable.test(elem.nodeName)) ) {
					top  += parseFloat( computedStyle.borderTopWidth  ) || 0;
					left += parseFloat( computedStyle.borderLeftWidth ) || 0;
				}

				prevOffsetParent = offsetParent;
				offsetParent = elem.offsetParent;
			}

			if ( jQuery.offset.subtractsBorderForOverflowNotVisible && computedStyle.overflow !== "visible" ) {
				top  += parseFloat( computedStyle.borderTopWidth  ) || 0;
				left += parseFloat( computedStyle.borderLeftWidth ) || 0;
			}

			prevComputedStyle = computedStyle;
		}

		if ( prevComputedStyle.position === "relative" || prevComputedStyle.position === "static" ) {
			top  += body.offsetTop;
			left += body.offsetLeft;
		}

		if ( jQuery.offset.supportsFixedPosition && prevComputedStyle.position === "fixed" ) {
			top  += Math.max( docElem.scrollTop, body.scrollTop );
			left += Math.max( docElem.scrollLeft, body.scrollLeft );
		}

		return { top: top, left: left };
	};
}

jQuery.offset = {};

jQuery.each(
	( "doesAddBorderForTableAndCells doesNotAddBorder " +
		"doesNotIncludeMarginInBodyOffset subtractsBorderForOverflowNotVisible " +
		"supportsFixedPosition" ).split(" "), function( i, prop ) {

	jQuery.offset[ prop ] = jQuery.support[ prop ];
});

jQuery.extend( jQuery.offset, {

	bodyOffset: function( body ) {
		var top = body.offsetTop,
			left = body.offsetLeft;

		if ( jQuery.offset.doesNotIncludeMarginInBodyOffset ) {
			top  += parseFloat( jQuery.css(body, "marginTop") ) || 0;
			left += parseFloat( jQuery.css(body, "marginLeft") ) || 0;
		}

		return { top: top, left: left };
	},

	setOffset: function( elem, options, i ) {
		var position = jQuery.css( elem, "position" );

		// set position first, in-case top/left are set even on static elem
		if ( position === "static" ) {
			elem.style.position = "relative";
		}

		var curElem = jQuery( elem ),
			curOffset = curElem.offset(),
			curCSSTop = jQuery.css( elem, "top" ),
			curCSSLeft = jQuery.css( elem, "left" ),
			calculatePosition = (position === "absolute" || position === "fixed") && jQuery.inArray("auto", [curCSSTop, curCSSLeft]) > -1,
			props = {}, curPosition = {}, curTop, curLeft;

		// need to be able to calculate position if either top or left is auto and position is either absolute or fixed
		if ( calculatePosition ) {
			curPosition = curElem.position();
			curTop = curPosition.top;
			curLeft = curPosition.left;
		} else {
			curTop = parseFloat( curCSSTop ) || 0;
			curLeft = parseFloat( curCSSLeft ) || 0;
		}

		if ( jQuery.isFunction( options ) ) {
			options = options.call( elem, i, curOffset );
		}

		if (options.top != null) {
			props.top = (options.top - curOffset.top) + curTop;
		}
		if (options.left != null) {
			props.left = (options.left - curOffset.left) + curLeft;
		}

		if ( "using" in options ) {
			options.using.call( elem, props );
		} else {
			curElem.css( props );
		}
	}
});


jQuery.fn.extend({

	position: function() {
		if ( !this[0] ) {
			return null;
		}

		var elem = this[0],

		// Get *real* offsetParent
		offsetParent = this.offsetParent(),

		// Get correct offsets
		offset       = this.offset(),
		parentOffset = rroot.test(offsetParent[0].nodeName) ? { top: 0, left: 0 } : offsetParent.offset();

		// Subtract element margins
		// note: when an element has margin: auto the offsetLeft and marginLeft
		// are the same in Safari causing offset.left to incorrectly be 0
		offset.top  -= parseFloat( jQuery.css(elem, "marginTop") ) || 0;
		offset.left -= parseFloat( jQuery.css(elem, "marginLeft") ) || 0;

		// Add offsetParent borders
		parentOffset.top  += parseFloat( jQuery.css(offsetParent[0], "borderTopWidth") ) || 0;
		parentOffset.left += parseFloat( jQuery.css(offsetParent[0], "borderLeftWidth") ) || 0;

		// Subtract the two offsets
		return {
			top:  offset.top  - parentOffset.top,
			left: offset.left - parentOffset.left
		};
	},

	offsetParent: function() {
		return this.map(function() {
			var offsetParent = this.offsetParent || document.body;
			while ( offsetParent && (!rroot.test(offsetParent.nodeName) && jQuery.css(offsetParent, "position") === "static") ) {
				offsetParent = offsetParent.offsetParent;
			}
			return offsetParent;
		});
	}
});


// Create scrollLeft and scrollTop methods
jQuery.each( ["Left", "Top"], function( i, name ) {
	var method = "scroll" + name;

	jQuery.fn[ method ] = function( val ) {
		var elem, win;

		if ( val === undefined ) {
			elem = this[ 0 ];

			if ( !elem ) {
				return null;
			}

			win = getWindow( elem );

			// Return the scroll offset
			return win ? ("pageXOffset" in win) ? win[ i ? "pageYOffset" : "pageXOffset" ] :
				jQuery.support.boxModel && win.document.documentElement[ method ] ||
					win.document.body[ method ] :
				elem[ method ];
		}

		// Set the scroll offset
		return this.each(function() {
			win = getWindow( this );

			if ( win ) {
				win.scrollTo(
					!i ? val : jQuery( win ).scrollLeft(),
					 i ? val : jQuery( win ).scrollTop()
				);

			} else {
				this[ method ] = val;
			}
		});
	};
});

function getWindow( elem ) {
	return jQuery.isWindow( elem ) ?
		elem :
		elem.nodeType === 9 ?
			elem.defaultView || elem.parentWindow :
			false;
}




// Create width, height, innerHeight, innerWidth, outerHeight and outerWidth methods
jQuery.each([ "Height", "Width" ], function( i, name ) {

	var type = name.toLowerCase();

	// innerHeight and innerWidth
	jQuery.fn[ "inner" + name ] = function() {
		var elem = this[0];
		return elem ?
			elem.style ?
			parseFloat( jQuery.css( elem, type, "padding" ) ) :
			this[ type ]() :
			null;
	};

	// outerHeight and outerWidth
	jQuery.fn[ "outer" + name ] = function( margin ) {
		var elem = this[0];
		return elem ?
			elem.style ?
			parseFloat( jQuery.css( elem, type, margin ? "margin" : "border" ) ) :
			this[ type ]() :
			null;
	};

	jQuery.fn[ type ] = function( size ) {
		// Get window width or height
		var elem = this[0];
		if ( !elem ) {
			return size == null ? null : this;
		}

		if ( jQuery.isFunction( size ) ) {
			return this.each(function( i ) {
				var self = jQuery( this );
				self[ type ]( size.call( this, i, self[ type ]() ) );
			});
		}

		if ( jQuery.isWindow( elem ) ) {
			// Everyone else use document.documentElement or document.body depending on Quirks vs Standards mode
			// 3rd condition allows Nokia support, as it supports the docElem prop but not CSS1Compat
			var docElemProp = elem.document.documentElement[ "client" + name ],
				body = elem.document.body;
			return elem.document.compatMode === "CSS1Compat" && docElemProp ||
				body && body[ "client" + name ] || docElemProp;

		// Get document width or height
		} else if ( elem.nodeType === 9 ) {
			// Either scroll[Width/Height] or offset[Width/Height], whichever is greater
			return Math.max(
				elem.documentElement["client" + name],
				elem.body["scroll" + name], elem.documentElement["scroll" + name],
				elem.body["offset" + name], elem.documentElement["offset" + name]
			);

		// Get or set width or height on the element
		} else if ( size === undefined ) {
			var orig = jQuery.css( elem, type ),
				ret = parseFloat( orig );

			return jQuery.isNumeric( ret ) ? ret : orig;

		// Set the width or height on the element (default to pixels if value is unitless)
		} else {
			return this.css( type, typeof size === "string" ? size : size + "px" );
		}
	};

});


// Expose jQuery to the global object
window.jQuery = window.$ = jQuery;
})(window);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiIiwic291cmNlcyI6WyJtb2Rlcm5penIvdGVzdC9qcy9saWIvanF1ZXJ5LTEuN2IyLmpzIl0sInNvdXJjZXNDb250ZW50IjpbIi8qIVxuICogalF1ZXJ5IEphdmFTY3JpcHQgTGlicmFyeSB2MS43YjJcbiAqIGh0dHA6Ly9qcXVlcnkuY29tL1xuICpcbiAqIENvcHlyaWdodCAyMDExLCBKb2huIFJlc2lnXG4gKiBEdWFsIGxpY2Vuc2VkIHVuZGVyIHRoZSBNSVQgb3IgR1BMIFZlcnNpb24gMiBsaWNlbnNlcy5cbiAqIGh0dHA6Ly9qcXVlcnkub3JnL2xpY2Vuc2VcbiAqXG4gKiBJbmNsdWRlcyBTaXp6bGUuanNcbiAqIGh0dHA6Ly9zaXp6bGVqcy5jb20vXG4gKiBDb3B5cmlnaHQgMjAxMSwgVGhlIERvam8gRm91bmRhdGlvblxuICogUmVsZWFzZWQgdW5kZXIgdGhlIE1JVCwgQlNELCBhbmQgR1BMIExpY2Vuc2VzLlxuICpcbiAqIERhdGU6IFRodSBPY3QgMTMgMjE6MTI6NTUgMjAxMSAtMDQwMFxuICovXG4oZnVuY3Rpb24oIHdpbmRvdywgdW5kZWZpbmVkICkge1xuXG4vLyBVc2UgdGhlIGNvcnJlY3QgZG9jdW1lbnQgYWNjb3JkaW5nbHkgd2l0aCB3aW5kb3cgYXJndW1lbnQgKHNhbmRib3gpXG52YXIgZG9jdW1lbnQgPSB3aW5kb3cuZG9jdW1lbnQsXG5cdG5hdmlnYXRvciA9IHdpbmRvdy5uYXZpZ2F0b3IsXG5cdGxvY2F0aW9uID0gd2luZG93LmxvY2F0aW9uO1xudmFyIGpRdWVyeSA9IChmdW5jdGlvbigpIHtcblxuLy8gRGVmaW5lIGEgbG9jYWwgY29weSBvZiBqUXVlcnlcbnZhciBqUXVlcnkgPSBmdW5jdGlvbiggc2VsZWN0b3IsIGNvbnRleHQgKSB7XG5cdFx0Ly8gVGhlIGpRdWVyeSBvYmplY3QgaXMgYWN0dWFsbHkganVzdCB0aGUgaW5pdCBjb25zdHJ1Y3RvciAnZW5oYW5jZWQnXG5cdFx0cmV0dXJuIG5ldyBqUXVlcnkuZm4uaW5pdCggc2VsZWN0b3IsIGNvbnRleHQsIHJvb3RqUXVlcnkgKTtcblx0fSxcblxuXHQvLyBNYXAgb3ZlciBqUXVlcnkgaW4gY2FzZSBvZiBvdmVyd3JpdGVcblx0X2pRdWVyeSA9IHdpbmRvdy5qUXVlcnksXG5cblx0Ly8gTWFwIG92ZXIgdGhlICQgaW4gY2FzZSBvZiBvdmVyd3JpdGVcblx0XyQgPSB3aW5kb3cuJCxcblxuXHQvLyBBIGNlbnRyYWwgcmVmZXJlbmNlIHRvIHRoZSByb290IGpRdWVyeShkb2N1bWVudClcblx0cm9vdGpRdWVyeSxcblxuXHQvLyBBIHNpbXBsZSB3YXkgdG8gY2hlY2sgZm9yIEhUTUwgc3RyaW5ncyBvciBJRCBzdHJpbmdzXG5cdC8vIFByaW9yaXRpemUgI2lkIG92ZXIgPHRhZz4gdG8gYXZvaWQgWFNTIHZpYSBsb2NhdGlvbi5oYXNoICgjOTUyMSlcblx0cXVpY2tFeHByID0gL14oPzpbXiM8XSooPFtcXHdcXFddKz4pW14+XSokfCMoW1xcd1xcLV0qKSQpLyxcblxuXHQvLyBDaGVjayBpZiBhIHN0cmluZyBoYXMgYSBub24td2hpdGVzcGFjZSBjaGFyYWN0ZXIgaW4gaXRcblx0cm5vdHdoaXRlID0gL1xcUy8sXG5cblx0Ly8gVXNlZCBmb3IgdHJpbW1pbmcgd2hpdGVzcGFjZVxuXHR0cmltTGVmdCA9IC9eXFxzKy8sXG5cdHRyaW1SaWdodCA9IC9cXHMrJC8sXG5cblx0Ly8gQ2hlY2sgZm9yIGRpZ2l0c1xuXHRyZGlnaXQgPSAvXFxkLyxcblxuXHQvLyBNYXRjaCBhIHN0YW5kYWxvbmUgdGFnXG5cdHJzaW5nbGVUYWcgPSAvXjwoXFx3KylcXHMqXFwvPz4oPzo8XFwvXFwxPik/JC8sXG5cblx0Ly8gSlNPTiBSZWdFeHBcblx0cnZhbGlkY2hhcnMgPSAvXltcXF0sOnt9XFxzXSokLyxcblx0cnZhbGlkZXNjYXBlID0gL1xcXFwoPzpbXCJcXFxcXFwvYmZucnRdfHVbMC05YS1mQS1GXXs0fSkvZyxcblx0cnZhbGlkdG9rZW5zID0gL1wiW15cIlxcXFxcXG5cXHJdKlwifHRydWV8ZmFsc2V8bnVsbHwtP1xcZCsoPzpcXC5cXGQqKT8oPzpbZUVdWytcXC1dP1xcZCspPy9nLFxuXHRydmFsaWRicmFjZXMgPSAvKD86Xnw6fCwpKD86XFxzKlxcWykrL2csXG5cblx0Ly8gVXNlcmFnZW50IFJlZ0V4cFxuXHRyd2Via2l0ID0gLyh3ZWJraXQpWyBcXC9dKFtcXHcuXSspLyxcblx0cm9wZXJhID0gLyhvcGVyYSkoPzouKnZlcnNpb24pP1sgXFwvXShbXFx3Ll0rKS8sXG5cdHJtc2llID0gLyhtc2llKSAoW1xcdy5dKykvLFxuXHRybW96aWxsYSA9IC8obW96aWxsYSkoPzouKj8gcnY6KFtcXHcuXSspKT8vLFxuXG5cdC8vIE1hdGNoZXMgZGFzaGVkIHN0cmluZyBmb3IgY2FtZWxpemluZ1xuXHRyZGFzaEFscGhhID0gLy0oW2Etel18WzAtOV0pL2lnLFxuXHRybXNQcmVmaXggPSAvXi1tcy0vLFxuXG5cdC8vIFVzZWQgYnkgalF1ZXJ5LmNhbWVsQ2FzZSBhcyBjYWxsYmFjayB0byByZXBsYWNlKClcblx0ZmNhbWVsQ2FzZSA9IGZ1bmN0aW9uKCBhbGwsIGxldHRlciApIHtcblx0XHRyZXR1cm4gKCBsZXR0ZXIgKyBcIlwiICkudG9VcHBlckNhc2UoKTtcblx0fSxcblxuXHQvLyBLZWVwIGEgVXNlckFnZW50IHN0cmluZyBmb3IgdXNlIHdpdGggalF1ZXJ5LmJyb3dzZXJcblx0dXNlckFnZW50ID0gbmF2aWdhdG9yLnVzZXJBZ2VudCxcblxuXHQvLyBGb3IgbWF0Y2hpbmcgdGhlIGVuZ2luZSBhbmQgdmVyc2lvbiBvZiB0aGUgYnJvd3NlclxuXHRicm93c2VyTWF0Y2gsXG5cblx0Ly8gVGhlIGRlZmVycmVkIHVzZWQgb24gRE9NIHJlYWR5XG5cdHJlYWR5TGlzdCxcblxuXHQvLyBUaGUgcmVhZHkgZXZlbnQgaGFuZGxlclxuXHRET01Db250ZW50TG9hZGVkLFxuXG5cdC8vIFNhdmUgYSByZWZlcmVuY2UgdG8gc29tZSBjb3JlIG1ldGhvZHNcblx0dG9TdHJpbmcgPSBPYmplY3QucHJvdG90eXBlLnRvU3RyaW5nLFxuXHRoYXNPd24gPSBPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LFxuXHRwdXNoID0gQXJyYXkucHJvdG90eXBlLnB1c2gsXG5cdHNsaWNlID0gQXJyYXkucHJvdG90eXBlLnNsaWNlLFxuXHR0cmltID0gU3RyaW5nLnByb3RvdHlwZS50cmltLFxuXHRpbmRleE9mID0gQXJyYXkucHJvdG90eXBlLmluZGV4T2YsXG5cblx0Ly8gW1tDbGFzc11dIC0+IHR5cGUgcGFpcnNcblx0Y2xhc3MydHlwZSA9IHt9O1xuXG5qUXVlcnkuZm4gPSBqUXVlcnkucHJvdG90eXBlID0ge1xuXHRjb25zdHJ1Y3RvcjogalF1ZXJ5LFxuXHRpbml0OiBmdW5jdGlvbiggc2VsZWN0b3IsIGNvbnRleHQsIHJvb3RqUXVlcnkgKSB7XG5cdFx0dmFyIG1hdGNoLCBlbGVtLCByZXQsIGRvYztcblxuXHRcdC8vIEhhbmRsZSAkKFwiXCIpLCAkKG51bGwpLCBvciAkKHVuZGVmaW5lZClcblx0XHRpZiAoICFzZWxlY3RvciApIHtcblx0XHRcdHJldHVybiB0aGlzO1xuXHRcdH1cblxuXHRcdC8vIEhhbmRsZSAkKERPTUVsZW1lbnQpXG5cdFx0aWYgKCBzZWxlY3Rvci5ub2RlVHlwZSApIHtcblx0XHRcdHRoaXMuY29udGV4dCA9IHRoaXNbMF0gPSBzZWxlY3Rvcjtcblx0XHRcdHRoaXMubGVuZ3RoID0gMTtcblx0XHRcdHJldHVybiB0aGlzO1xuXHRcdH1cblxuXHRcdC8vIFRoZSBib2R5IGVsZW1lbnQgb25seSBleGlzdHMgb25jZSwgb3B0aW1pemUgZmluZGluZyBpdFxuXHRcdGlmICggc2VsZWN0b3IgPT09IFwiYm9keVwiICYmICFjb250ZXh0ICYmIGRvY3VtZW50LmJvZHkgKSB7XG5cdFx0XHR0aGlzLmNvbnRleHQgPSBkb2N1bWVudDtcblx0XHRcdHRoaXNbMF0gPSBkb2N1bWVudC5ib2R5O1xuXHRcdFx0dGhpcy5zZWxlY3RvciA9IHNlbGVjdG9yO1xuXHRcdFx0dGhpcy5sZW5ndGggPSAxO1xuXHRcdFx0cmV0dXJuIHRoaXM7XG5cdFx0fVxuXG5cdFx0Ly8gSGFuZGxlIEhUTUwgc3RyaW5nc1xuXHRcdGlmICggdHlwZW9mIHNlbGVjdG9yID09PSBcInN0cmluZ1wiICkge1xuXHRcdFx0Ly8gQXJlIHdlIGRlYWxpbmcgd2l0aCBIVE1MIHN0cmluZyBvciBhbiBJRD9cblx0XHRcdGlmICggc2VsZWN0b3IuY2hhckF0KDApID09PSBcIjxcIiAmJiBzZWxlY3Rvci5jaGFyQXQoIHNlbGVjdG9yLmxlbmd0aCAtIDEgKSA9PT0gXCI+XCIgJiYgc2VsZWN0b3IubGVuZ3RoID49IDMgKSB7XG5cdFx0XHRcdC8vIEFzc3VtZSB0aGF0IHN0cmluZ3MgdGhhdCBzdGFydCBhbmQgZW5kIHdpdGggPD4gYXJlIEhUTUwgYW5kIHNraXAgdGhlIHJlZ2V4IGNoZWNrXG5cdFx0XHRcdG1hdGNoID0gWyBudWxsLCBzZWxlY3RvciwgbnVsbCBdO1xuXG5cdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRtYXRjaCA9IHF1aWNrRXhwci5leGVjKCBzZWxlY3RvciApO1xuXHRcdFx0fVxuXG5cdFx0XHQvLyBWZXJpZnkgYSBtYXRjaCwgYW5kIHRoYXQgbm8gY29udGV4dCB3YXMgc3BlY2lmaWVkIGZvciAjaWRcblx0XHRcdGlmICggbWF0Y2ggJiYgKG1hdGNoWzFdIHx8ICFjb250ZXh0KSApIHtcblxuXHRcdFx0XHQvLyBIQU5ETEU6ICQoaHRtbCkgLT4gJChhcnJheSlcblx0XHRcdFx0aWYgKCBtYXRjaFsxXSApIHtcblx0XHRcdFx0XHRjb250ZXh0ID0gY29udGV4dCBpbnN0YW5jZW9mIGpRdWVyeSA/IGNvbnRleHRbMF0gOiBjb250ZXh0O1xuXHRcdFx0XHRcdGRvYyA9IChjb250ZXh0ID8gY29udGV4dC5vd25lckRvY3VtZW50IHx8IGNvbnRleHQgOiBkb2N1bWVudCk7XG5cblx0XHRcdFx0XHQvLyBJZiBhIHNpbmdsZSBzdHJpbmcgaXMgcGFzc2VkIGluIGFuZCBpdCdzIGEgc2luZ2xlIHRhZ1xuXHRcdFx0XHRcdC8vIGp1c3QgZG8gYSBjcmVhdGVFbGVtZW50IGFuZCBza2lwIHRoZSByZXN0XG5cdFx0XHRcdFx0cmV0ID0gcnNpbmdsZVRhZy5leGVjKCBzZWxlY3RvciApO1xuXG5cdFx0XHRcdFx0aWYgKCByZXQgKSB7XG5cdFx0XHRcdFx0XHRpZiAoIGpRdWVyeS5pc1BsYWluT2JqZWN0KCBjb250ZXh0ICkgKSB7XG5cdFx0XHRcdFx0XHRcdHNlbGVjdG9yID0gWyBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCByZXRbMV0gKSBdO1xuXHRcdFx0XHRcdFx0XHRqUXVlcnkuZm4uYXR0ci5jYWxsKCBzZWxlY3RvciwgY29udGV4dCwgdHJ1ZSApO1xuXG5cdFx0XHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdFx0XHRzZWxlY3RvciA9IFsgZG9jLmNyZWF0ZUVsZW1lbnQoIHJldFsxXSApIF07XG5cdFx0XHRcdFx0XHR9XG5cblx0XHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdFx0cmV0ID0galF1ZXJ5LmJ1aWxkRnJhZ21lbnQoIFsgbWF0Y2hbMV0gXSwgWyBkb2MgXSApO1xuXHRcdFx0XHRcdFx0c2VsZWN0b3IgPSAocmV0LmNhY2hlYWJsZSA/IGpRdWVyeS5jbG9uZShyZXQuZnJhZ21lbnQpIDogcmV0LmZyYWdtZW50KS5jaGlsZE5vZGVzO1xuXHRcdFx0XHRcdH1cblxuXHRcdFx0XHRcdHJldHVybiBqUXVlcnkubWVyZ2UoIHRoaXMsIHNlbGVjdG9yICk7XG5cblx0XHRcdFx0Ly8gSEFORExFOiAkKFwiI2lkXCIpXG5cdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0ZWxlbSA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCBtYXRjaFsyXSApO1xuXG5cdFx0XHRcdFx0Ly8gQ2hlY2sgcGFyZW50Tm9kZSB0byBjYXRjaCB3aGVuIEJsYWNrYmVycnkgNC42IHJldHVybnNcblx0XHRcdFx0XHQvLyBub2RlcyB0aGF0IGFyZSBubyBsb25nZXIgaW4gdGhlIGRvY3VtZW50ICM2OTYzXG5cdFx0XHRcdFx0aWYgKCBlbGVtICYmIGVsZW0ucGFyZW50Tm9kZSApIHtcblx0XHRcdFx0XHRcdC8vIEhhbmRsZSB0aGUgY2FzZSB3aGVyZSBJRSBhbmQgT3BlcmEgcmV0dXJuIGl0ZW1zXG5cdFx0XHRcdFx0XHQvLyBieSBuYW1lIGluc3RlYWQgb2YgSURcblx0XHRcdFx0XHRcdGlmICggZWxlbS5pZCAhPT0gbWF0Y2hbMl0gKSB7XG5cdFx0XHRcdFx0XHRcdHJldHVybiByb290alF1ZXJ5LmZpbmQoIHNlbGVjdG9yICk7XG5cdFx0XHRcdFx0XHR9XG5cblx0XHRcdFx0XHRcdC8vIE90aGVyd2lzZSwgd2UgaW5qZWN0IHRoZSBlbGVtZW50IGRpcmVjdGx5IGludG8gdGhlIGpRdWVyeSBvYmplY3Rcblx0XHRcdFx0XHRcdHRoaXMubGVuZ3RoID0gMTtcblx0XHRcdFx0XHRcdHRoaXNbMF0gPSBlbGVtO1xuXHRcdFx0XHRcdH1cblxuXHRcdFx0XHRcdHRoaXMuY29udGV4dCA9IGRvY3VtZW50O1xuXHRcdFx0XHRcdHRoaXMuc2VsZWN0b3IgPSBzZWxlY3Rvcjtcblx0XHRcdFx0XHRyZXR1cm4gdGhpcztcblx0XHRcdFx0fVxuXG5cdFx0XHQvLyBIQU5ETEU6ICQoZXhwciwgJCguLi4pKVxuXHRcdFx0fSBlbHNlIGlmICggIWNvbnRleHQgfHwgY29udGV4dC5qcXVlcnkgKSB7XG5cdFx0XHRcdHJldHVybiAoY29udGV4dCB8fCByb290alF1ZXJ5KS5maW5kKCBzZWxlY3RvciApO1xuXG5cdFx0XHQvLyBIQU5ETEU6ICQoZXhwciwgY29udGV4dClcblx0XHRcdC8vICh3aGljaCBpcyBqdXN0IGVxdWl2YWxlbnQgdG86ICQoY29udGV4dCkuZmluZChleHByKVxuXHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0cmV0dXJuIHRoaXMuY29uc3RydWN0b3IoIGNvbnRleHQgKS5maW5kKCBzZWxlY3RvciApO1xuXHRcdFx0fVxuXG5cdFx0Ly8gSEFORExFOiAkKGZ1bmN0aW9uKVxuXHRcdC8vIFNob3J0Y3V0IGZvciBkb2N1bWVudCByZWFkeVxuXHRcdH0gZWxzZSBpZiAoIGpRdWVyeS5pc0Z1bmN0aW9uKCBzZWxlY3RvciApICkge1xuXHRcdFx0cmV0dXJuIHJvb3RqUXVlcnkucmVhZHkoIHNlbGVjdG9yICk7XG5cdFx0fVxuXG5cdFx0aWYgKHNlbGVjdG9yLnNlbGVjdG9yICE9PSB1bmRlZmluZWQpIHtcblx0XHRcdHRoaXMuc2VsZWN0b3IgPSBzZWxlY3Rvci5zZWxlY3Rvcjtcblx0XHRcdHRoaXMuY29udGV4dCA9IHNlbGVjdG9yLmNvbnRleHQ7XG5cdFx0fVxuXG5cdFx0cmV0dXJuIGpRdWVyeS5tYWtlQXJyYXkoIHNlbGVjdG9yLCB0aGlzICk7XG5cdH0sXG5cblx0Ly8gU3RhcnQgd2l0aCBhbiBlbXB0eSBzZWxlY3RvclxuXHRzZWxlY3RvcjogXCJcIixcblxuXHQvLyBUaGUgY3VycmVudCB2ZXJzaW9uIG9mIGpRdWVyeSBiZWluZyB1c2VkXG5cdGpxdWVyeTogXCIxLjdiMlwiLFxuXG5cdC8vIFRoZSBkZWZhdWx0IGxlbmd0aCBvZiBhIGpRdWVyeSBvYmplY3QgaXMgMFxuXHRsZW5ndGg6IDAsXG5cblx0Ly8gVGhlIG51bWJlciBvZiBlbGVtZW50cyBjb250YWluZWQgaW4gdGhlIG1hdGNoZWQgZWxlbWVudCBzZXRcblx0c2l6ZTogZnVuY3Rpb24oKSB7XG5cdFx0cmV0dXJuIHRoaXMubGVuZ3RoO1xuXHR9LFxuXG5cdHRvQXJyYXk6IGZ1bmN0aW9uKCkge1xuXHRcdHJldHVybiBzbGljZS5jYWxsKCB0aGlzLCAwICk7XG5cdH0sXG5cblx0Ly8gR2V0IHRoZSBOdGggZWxlbWVudCBpbiB0aGUgbWF0Y2hlZCBlbGVtZW50IHNldCBPUlxuXHQvLyBHZXQgdGhlIHdob2xlIG1hdGNoZWQgZWxlbWVudCBzZXQgYXMgYSBjbGVhbiBhcnJheVxuXHRnZXQ6IGZ1bmN0aW9uKCBudW0gKSB7XG5cdFx0cmV0dXJuIG51bSA9PSBudWxsID9cblxuXHRcdFx0Ly8gUmV0dXJuIGEgJ2NsZWFuJyBhcnJheVxuXHRcdFx0dGhpcy50b0FycmF5KCkgOlxuXG5cdFx0XHQvLyBSZXR1cm4ganVzdCB0aGUgb2JqZWN0XG5cdFx0XHQoIG51bSA8IDAgPyB0aGlzWyB0aGlzLmxlbmd0aCArIG51bSBdIDogdGhpc1sgbnVtIF0gKTtcblx0fSxcblxuXHQvLyBUYWtlIGFuIGFycmF5IG9mIGVsZW1lbnRzIGFuZCBwdXNoIGl0IG9udG8gdGhlIHN0YWNrXG5cdC8vIChyZXR1cm5pbmcgdGhlIG5ldyBtYXRjaGVkIGVsZW1lbnQgc2V0KVxuXHRwdXNoU3RhY2s6IGZ1bmN0aW9uKCBlbGVtcywgbmFtZSwgc2VsZWN0b3IgKSB7XG5cdFx0Ly8gQnVpbGQgYSBuZXcgalF1ZXJ5IG1hdGNoZWQgZWxlbWVudCBzZXRcblx0XHR2YXIgcmV0ID0gdGhpcy5jb25zdHJ1Y3RvcigpO1xuXG5cdFx0aWYgKCBqUXVlcnkuaXNBcnJheSggZWxlbXMgKSApIHtcblx0XHRcdHB1c2guYXBwbHkoIHJldCwgZWxlbXMgKTtcblxuXHRcdH0gZWxzZSB7XG5cdFx0XHRqUXVlcnkubWVyZ2UoIHJldCwgZWxlbXMgKTtcblx0XHR9XG5cblx0XHQvLyBBZGQgdGhlIG9sZCBvYmplY3Qgb250byB0aGUgc3RhY2sgKGFzIGEgcmVmZXJlbmNlKVxuXHRcdHJldC5wcmV2T2JqZWN0ID0gdGhpcztcblxuXHRcdHJldC5jb250ZXh0ID0gdGhpcy5jb250ZXh0O1xuXG5cdFx0aWYgKCBuYW1lID09PSBcImZpbmRcIiApIHtcblx0XHRcdHJldC5zZWxlY3RvciA9IHRoaXMuc2VsZWN0b3IgKyAodGhpcy5zZWxlY3RvciA/IFwiIFwiIDogXCJcIikgKyBzZWxlY3Rvcjtcblx0XHR9IGVsc2UgaWYgKCBuYW1lICkge1xuXHRcdFx0cmV0LnNlbGVjdG9yID0gdGhpcy5zZWxlY3RvciArIFwiLlwiICsgbmFtZSArIFwiKFwiICsgc2VsZWN0b3IgKyBcIilcIjtcblx0XHR9XG5cblx0XHQvLyBSZXR1cm4gdGhlIG5ld2x5LWZvcm1lZCBlbGVtZW50IHNldFxuXHRcdHJldHVybiByZXQ7XG5cdH0sXG5cblx0Ly8gRXhlY3V0ZSBhIGNhbGxiYWNrIGZvciBldmVyeSBlbGVtZW50IGluIHRoZSBtYXRjaGVkIHNldC5cblx0Ly8gKFlvdSBjYW4gc2VlZCB0aGUgYXJndW1lbnRzIHdpdGggYW4gYXJyYXkgb2YgYXJncywgYnV0IHRoaXMgaXNcblx0Ly8gb25seSB1c2VkIGludGVybmFsbHkuKVxuXHRlYWNoOiBmdW5jdGlvbiggY2FsbGJhY2ssIGFyZ3MgKSB7XG5cdFx0cmV0dXJuIGpRdWVyeS5lYWNoKCB0aGlzLCBjYWxsYmFjaywgYXJncyApO1xuXHR9LFxuXG5cdHJlYWR5OiBmdW5jdGlvbiggZm4gKSB7XG5cdFx0Ly8gQXR0YWNoIHRoZSBsaXN0ZW5lcnNcblx0XHRqUXVlcnkuYmluZFJlYWR5KCk7XG5cblx0XHQvLyBBZGQgdGhlIGNhbGxiYWNrXG5cdFx0cmVhZHlMaXN0LmFkZCggZm4gKTtcblxuXHRcdHJldHVybiB0aGlzO1xuXHR9LFxuXG5cdGVxOiBmdW5jdGlvbiggaSApIHtcblx0XHRyZXR1cm4gaSA9PT0gLTEgP1xuXHRcdFx0dGhpcy5zbGljZSggaSApIDpcblx0XHRcdHRoaXMuc2xpY2UoIGksICtpICsgMSApO1xuXHR9LFxuXG5cdGZpcnN0OiBmdW5jdGlvbigpIHtcblx0XHRyZXR1cm4gdGhpcy5lcSggMCApO1xuXHR9LFxuXG5cdGxhc3Q6IGZ1bmN0aW9uKCkge1xuXHRcdHJldHVybiB0aGlzLmVxKCAtMSApO1xuXHR9LFxuXG5cdHNsaWNlOiBmdW5jdGlvbigpIHtcblx0XHRyZXR1cm4gdGhpcy5wdXNoU3RhY2soIHNsaWNlLmFwcGx5KCB0aGlzLCBhcmd1bWVudHMgKSxcblx0XHRcdFwic2xpY2VcIiwgc2xpY2UuY2FsbChhcmd1bWVudHMpLmpvaW4oXCIsXCIpICk7XG5cdH0sXG5cblx0bWFwOiBmdW5jdGlvbiggY2FsbGJhY2sgKSB7XG5cdFx0cmV0dXJuIHRoaXMucHVzaFN0YWNrKCBqUXVlcnkubWFwKHRoaXMsIGZ1bmN0aW9uKCBlbGVtLCBpICkge1xuXHRcdFx0cmV0dXJuIGNhbGxiYWNrLmNhbGwoIGVsZW0sIGksIGVsZW0gKTtcblx0XHR9KSk7XG5cdH0sXG5cblx0ZW5kOiBmdW5jdGlvbigpIHtcblx0XHRyZXR1cm4gdGhpcy5wcmV2T2JqZWN0IHx8IHRoaXMuY29uc3RydWN0b3IobnVsbCk7XG5cdH0sXG5cblx0Ly8gRm9yIGludGVybmFsIHVzZSBvbmx5LlxuXHQvLyBCZWhhdmVzIGxpa2UgYW4gQXJyYXkncyBtZXRob2QsIG5vdCBsaWtlIGEgalF1ZXJ5IG1ldGhvZC5cblx0cHVzaDogcHVzaCxcblx0c29ydDogW10uc29ydCxcblx0c3BsaWNlOiBbXS5zcGxpY2Vcbn07XG5cbi8vIEdpdmUgdGhlIGluaXQgZnVuY3Rpb24gdGhlIGpRdWVyeSBwcm90b3R5cGUgZm9yIGxhdGVyIGluc3RhbnRpYXRpb25cbmpRdWVyeS5mbi5pbml0LnByb3RvdHlwZSA9IGpRdWVyeS5mbjtcblxualF1ZXJ5LmV4dGVuZCA9IGpRdWVyeS5mbi5leHRlbmQgPSBmdW5jdGlvbigpIHtcblx0dmFyIG9wdGlvbnMsIG5hbWUsIHNyYywgY29weSwgY29weUlzQXJyYXksIGNsb25lLFxuXHRcdHRhcmdldCA9IGFyZ3VtZW50c1swXSB8fCB7fSxcblx0XHRpID0gMSxcblx0XHRsZW5ndGggPSBhcmd1bWVudHMubGVuZ3RoLFxuXHRcdGRlZXAgPSBmYWxzZTtcblxuXHQvLyBIYW5kbGUgYSBkZWVwIGNvcHkgc2l0dWF0aW9uXG5cdGlmICggdHlwZW9mIHRhcmdldCA9PT0gXCJib29sZWFuXCIgKSB7XG5cdFx0ZGVlcCA9IHRhcmdldDtcblx0XHR0YXJnZXQgPSBhcmd1bWVudHNbMV0gfHwge307XG5cdFx0Ly8gc2tpcCB0aGUgYm9vbGVhbiBhbmQgdGhlIHRhcmdldFxuXHRcdGkgPSAyO1xuXHR9XG5cblx0Ly8gSGFuZGxlIGNhc2Ugd2hlbiB0YXJnZXQgaXMgYSBzdHJpbmcgb3Igc29tZXRoaW5nIChwb3NzaWJsZSBpbiBkZWVwIGNvcHkpXG5cdGlmICggdHlwZW9mIHRhcmdldCAhPT0gXCJvYmplY3RcIiAmJiAhalF1ZXJ5LmlzRnVuY3Rpb24odGFyZ2V0KSApIHtcblx0XHR0YXJnZXQgPSB7fTtcblx0fVxuXG5cdC8vIGV4dGVuZCBqUXVlcnkgaXRzZWxmIGlmIG9ubHkgb25lIGFyZ3VtZW50IGlzIHBhc3NlZFxuXHRpZiAoIGxlbmd0aCA9PT0gaSApIHtcblx0XHR0YXJnZXQgPSB0aGlzO1xuXHRcdC0taTtcblx0fVxuXG5cdGZvciAoIDsgaSA8IGxlbmd0aDsgaSsrICkge1xuXHRcdC8vIE9ubHkgZGVhbCB3aXRoIG5vbi1udWxsL3VuZGVmaW5lZCB2YWx1ZXNcblx0XHRpZiAoIChvcHRpb25zID0gYXJndW1lbnRzWyBpIF0pICE9IG51bGwgKSB7XG5cdFx0XHQvLyBFeHRlbmQgdGhlIGJhc2Ugb2JqZWN0XG5cdFx0XHRmb3IgKCBuYW1lIGluIG9wdGlvbnMgKSB7XG5cdFx0XHRcdHNyYyA9IHRhcmdldFsgbmFtZSBdO1xuXHRcdFx0XHRjb3B5ID0gb3B0aW9uc1sgbmFtZSBdO1xuXG5cdFx0XHRcdC8vIFByZXZlbnQgbmV2ZXItZW5kaW5nIGxvb3Bcblx0XHRcdFx0aWYgKCB0YXJnZXQgPT09IGNvcHkgKSB7XG5cdFx0XHRcdFx0Y29udGludWU7XG5cdFx0XHRcdH1cblxuXHRcdFx0XHQvLyBSZWN1cnNlIGlmIHdlJ3JlIG1lcmdpbmcgcGxhaW4gb2JqZWN0cyBvciBhcnJheXNcblx0XHRcdFx0aWYgKCBkZWVwICYmIGNvcHkgJiYgKCBqUXVlcnkuaXNQbGFpbk9iamVjdChjb3B5KSB8fCAoY29weUlzQXJyYXkgPSBqUXVlcnkuaXNBcnJheShjb3B5KSkgKSApIHtcblx0XHRcdFx0XHRpZiAoIGNvcHlJc0FycmF5ICkge1xuXHRcdFx0XHRcdFx0Y29weUlzQXJyYXkgPSBmYWxzZTtcblx0XHRcdFx0XHRcdGNsb25lID0gc3JjICYmIGpRdWVyeS5pc0FycmF5KHNyYykgPyBzcmMgOiBbXTtcblxuXHRcdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0XHRjbG9uZSA9IHNyYyAmJiBqUXVlcnkuaXNQbGFpbk9iamVjdChzcmMpID8gc3JjIDoge307XG5cdFx0XHRcdFx0fVxuXG5cdFx0XHRcdFx0Ly8gTmV2ZXIgbW92ZSBvcmlnaW5hbCBvYmplY3RzLCBjbG9uZSB0aGVtXG5cdFx0XHRcdFx0dGFyZ2V0WyBuYW1lIF0gPSBqUXVlcnkuZXh0ZW5kKCBkZWVwLCBjbG9uZSwgY29weSApO1xuXG5cdFx0XHRcdC8vIERvbid0IGJyaW5nIGluIHVuZGVmaW5lZCB2YWx1ZXNcblx0XHRcdFx0fSBlbHNlIGlmICggY29weSAhPT0gdW5kZWZpbmVkICkge1xuXHRcdFx0XHRcdHRhcmdldFsgbmFtZSBdID0gY29weTtcblx0XHRcdFx0fVxuXHRcdFx0fVxuXHRcdH1cblx0fVxuXG5cdC8vIFJldHVybiB0aGUgbW9kaWZpZWQgb2JqZWN0XG5cdHJldHVybiB0YXJnZXQ7XG59O1xuXG5qUXVlcnkuZXh0ZW5kKHtcblx0bm9Db25mbGljdDogZnVuY3Rpb24oIGRlZXAgKSB7XG5cdFx0aWYgKCB3aW5kb3cuJCA9PT0galF1ZXJ5ICkge1xuXHRcdFx0d2luZG93LiQgPSBfJDtcblx0XHR9XG5cblx0XHRpZiAoIGRlZXAgJiYgd2luZG93LmpRdWVyeSA9PT0galF1ZXJ5ICkge1xuXHRcdFx0d2luZG93LmpRdWVyeSA9IF9qUXVlcnk7XG5cdFx0fVxuXG5cdFx0cmV0dXJuIGpRdWVyeTtcblx0fSxcblxuXHQvLyBJcyB0aGUgRE9NIHJlYWR5IHRvIGJlIHVzZWQ/IFNldCB0byB0cnVlIG9uY2UgaXQgb2NjdXJzLlxuXHRpc1JlYWR5OiBmYWxzZSxcblxuXHQvLyBBIGNvdW50ZXIgdG8gdHJhY2sgaG93IG1hbnkgaXRlbXMgdG8gd2FpdCBmb3IgYmVmb3JlXG5cdC8vIHRoZSByZWFkeSBldmVudCBmaXJlcy4gU2VlICM2NzgxXG5cdHJlYWR5V2FpdDogMSxcblxuXHQvLyBIb2xkIChvciByZWxlYXNlKSB0aGUgcmVhZHkgZXZlbnRcblx0aG9sZFJlYWR5OiBmdW5jdGlvbiggaG9sZCApIHtcblx0XHRpZiAoIGhvbGQgKSB7XG5cdFx0XHRqUXVlcnkucmVhZHlXYWl0Kys7XG5cdFx0fSBlbHNlIHtcblx0XHRcdGpRdWVyeS5yZWFkeSggdHJ1ZSApO1xuXHRcdH1cblx0fSxcblxuXHQvLyBIYW5kbGUgd2hlbiB0aGUgRE9NIGlzIHJlYWR5XG5cdHJlYWR5OiBmdW5jdGlvbiggd2FpdCApIHtcblx0XHQvLyBFaXRoZXIgYSByZWxlYXNlZCBob2xkIG9yIGFuIERPTXJlYWR5L2xvYWQgZXZlbnQgYW5kIG5vdCB5ZXQgcmVhZHlcblx0XHRpZiAoICh3YWl0ID09PSB0cnVlICYmICEtLWpRdWVyeS5yZWFkeVdhaXQpIHx8ICh3YWl0ICE9PSB0cnVlICYmICFqUXVlcnkuaXNSZWFkeSkgKSB7XG5cdFx0XHQvLyBNYWtlIHN1cmUgYm9keSBleGlzdHMsIGF0IGxlYXN0LCBpbiBjYXNlIElFIGdldHMgYSBsaXR0bGUgb3ZlcnplYWxvdXMgKHRpY2tldCAjNTQ0MykuXG5cdFx0XHRpZiAoICFkb2N1bWVudC5ib2R5ICkge1xuXHRcdFx0XHRyZXR1cm4gc2V0VGltZW91dCggalF1ZXJ5LnJlYWR5LCAxICk7XG5cdFx0XHR9XG5cblx0XHRcdC8vIFJlbWVtYmVyIHRoYXQgdGhlIERPTSBpcyByZWFkeVxuXHRcdFx0alF1ZXJ5LmlzUmVhZHkgPSB0cnVlO1xuXG5cdFx0XHQvLyBJZiBhIG5vcm1hbCBET00gUmVhZHkgZXZlbnQgZmlyZWQsIGRlY3JlbWVudCwgYW5kIHdhaXQgaWYgbmVlZCBiZVxuXHRcdFx0aWYgKCB3YWl0ICE9PSB0cnVlICYmIC0talF1ZXJ5LnJlYWR5V2FpdCA+IDAgKSB7XG5cdFx0XHRcdHJldHVybjtcblx0XHRcdH1cblxuXHRcdFx0Ly8gSWYgdGhlcmUgYXJlIGZ1bmN0aW9ucyBib3VuZCwgdG8gZXhlY3V0ZVxuXHRcdFx0cmVhZHlMaXN0LmZpcmVXaXRoKCBkb2N1bWVudCwgWyBqUXVlcnkgXSApO1xuXG5cdFx0XHQvLyBUcmlnZ2VyIGFueSBib3VuZCByZWFkeSBldmVudHNcblx0XHRcdGlmICggalF1ZXJ5LmZuLnRyaWdnZXIgKSB7XG5cdFx0XHRcdGpRdWVyeSggZG9jdW1lbnQgKS50cmlnZ2VyKCBcInJlYWR5XCIgKS51bmJpbmQoIFwicmVhZHlcIiApO1xuXHRcdFx0fVxuXHRcdH1cblx0fSxcblxuXHRiaW5kUmVhZHk6IGZ1bmN0aW9uKCkge1xuXHRcdGlmICggcmVhZHlMaXN0ICkge1xuXHRcdFx0cmV0dXJuO1xuXHRcdH1cblxuXHRcdHJlYWR5TGlzdCA9IGpRdWVyeS5DYWxsYmFja3MoIFwib25jZSBtZW1vcnlcIiApO1xuXG5cdFx0Ly8gQ2F0Y2ggY2FzZXMgd2hlcmUgJChkb2N1bWVudCkucmVhZHkoKSBpcyBjYWxsZWQgYWZ0ZXIgdGhlXG5cdFx0Ly8gYnJvd3NlciBldmVudCBoYXMgYWxyZWFkeSBvY2N1cnJlZC5cblx0XHRpZiAoIGRvY3VtZW50LnJlYWR5U3RhdGUgPT09IFwiY29tcGxldGVcIiApIHtcblx0XHRcdC8vIEhhbmRsZSBpdCBhc3luY2hyb25vdXNseSB0byBhbGxvdyBzY3JpcHRzIHRoZSBvcHBvcnR1bml0eSB0byBkZWxheSByZWFkeVxuXHRcdFx0cmV0dXJuIHNldFRpbWVvdXQoIGpRdWVyeS5yZWFkeSwgMSApO1xuXHRcdH1cblxuXHRcdC8vIE1vemlsbGEsIE9wZXJhIGFuZCB3ZWJraXQgbmlnaHRsaWVzIGN1cnJlbnRseSBzdXBwb3J0IHRoaXMgZXZlbnRcblx0XHRpZiAoIGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIgKSB7XG5cdFx0XHQvLyBVc2UgdGhlIGhhbmR5IGV2ZW50IGNhbGxiYWNrXG5cdFx0XHRkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKCBcIkRPTUNvbnRlbnRMb2FkZWRcIiwgRE9NQ29udGVudExvYWRlZCwgZmFsc2UgKTtcblxuXHRcdFx0Ly8gQSBmYWxsYmFjayB0byB3aW5kb3cub25sb2FkLCB0aGF0IHdpbGwgYWx3YXlzIHdvcmtcblx0XHRcdHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKCBcImxvYWRcIiwgalF1ZXJ5LnJlYWR5LCBmYWxzZSApO1xuXG5cdFx0Ly8gSWYgSUUgZXZlbnQgbW9kZWwgaXMgdXNlZFxuXHRcdH0gZWxzZSBpZiAoIGRvY3VtZW50LmF0dGFjaEV2ZW50ICkge1xuXHRcdFx0Ly8gZW5zdXJlIGZpcmluZyBiZWZvcmUgb25sb2FkLFxuXHRcdFx0Ly8gbWF5YmUgbGF0ZSBidXQgc2FmZSBhbHNvIGZvciBpZnJhbWVzXG5cdFx0XHRkb2N1bWVudC5hdHRhY2hFdmVudCggXCJvbnJlYWR5c3RhdGVjaGFuZ2VcIiwgRE9NQ29udGVudExvYWRlZCApO1xuXG5cdFx0XHQvLyBBIGZhbGxiYWNrIHRvIHdpbmRvdy5vbmxvYWQsIHRoYXQgd2lsbCBhbHdheXMgd29ya1xuXHRcdFx0d2luZG93LmF0dGFjaEV2ZW50KCBcIm9ubG9hZFwiLCBqUXVlcnkucmVhZHkgKTtcblxuXHRcdFx0Ly8gSWYgSUUgYW5kIG5vdCBhIGZyYW1lXG5cdFx0XHQvLyBjb250aW51YWxseSBjaGVjayB0byBzZWUgaWYgdGhlIGRvY3VtZW50IGlzIHJlYWR5XG5cdFx0XHR2YXIgdG9wbGV2ZWwgPSBmYWxzZTtcblxuXHRcdFx0dHJ5IHtcblx0XHRcdFx0dG9wbGV2ZWwgPSB3aW5kb3cuZnJhbWVFbGVtZW50ID09IG51bGw7XG5cdFx0XHR9IGNhdGNoKGUpIHt9XG5cblx0XHRcdGlmICggZG9jdW1lbnQuZG9jdW1lbnRFbGVtZW50LmRvU2Nyb2xsICYmIHRvcGxldmVsICkge1xuXHRcdFx0XHRkb1Njcm9sbENoZWNrKCk7XG5cdFx0XHR9XG5cdFx0fVxuXHR9LFxuXG5cdC8vIFNlZSB0ZXN0L3VuaXQvY29yZS5qcyBmb3IgZGV0YWlscyBjb25jZXJuaW5nIGlzRnVuY3Rpb24uXG5cdC8vIFNpbmNlIHZlcnNpb24gMS4zLCBET00gbWV0aG9kcyBhbmQgZnVuY3Rpb25zIGxpa2UgYWxlcnRcblx0Ly8gYXJlbid0IHN1cHBvcnRlZC4gVGhleSByZXR1cm4gZmFsc2Ugb24gSUUgKCMyOTY4KS5cblx0aXNGdW5jdGlvbjogZnVuY3Rpb24oIG9iaiApIHtcblx0XHRyZXR1cm4galF1ZXJ5LnR5cGUob2JqKSA9PT0gXCJmdW5jdGlvblwiO1xuXHR9LFxuXG5cdGlzQXJyYXk6IEFycmF5LmlzQXJyYXkgfHwgZnVuY3Rpb24oIG9iaiApIHtcblx0XHRyZXR1cm4galF1ZXJ5LnR5cGUob2JqKSA9PT0gXCJhcnJheVwiO1xuXHR9LFxuXG5cdC8vIEEgY3J1ZGUgd2F5IG9mIGRldGVybWluaW5nIGlmIGFuIG9iamVjdCBpcyBhIHdpbmRvd1xuXHRpc1dpbmRvdzogZnVuY3Rpb24oIG9iaiApIHtcblx0XHRyZXR1cm4gb2JqICYmIHR5cGVvZiBvYmogPT09IFwib2JqZWN0XCIgJiYgXCJzZXRJbnRlcnZhbFwiIGluIG9iajtcblx0fSxcblxuXHRpc051bWVyaWM6IGZ1bmN0aW9uKCBvYmogKSB7XG5cdFx0cmV0dXJuIG9iaiAhPSBudWxsICYmIHJkaWdpdC50ZXN0KCBvYmogKSAmJiAhaXNOYU4oIG9iaiApO1xuXHR9LFxuXG5cdHR5cGU6IGZ1bmN0aW9uKCBvYmogKSB7XG5cdFx0cmV0dXJuIG9iaiA9PSBudWxsID9cblx0XHRcdFN0cmluZyggb2JqICkgOlxuXHRcdFx0Y2xhc3MydHlwZVsgdG9TdHJpbmcuY2FsbChvYmopIF0gfHwgXCJvYmplY3RcIjtcblx0fSxcblxuXHRpc1BsYWluT2JqZWN0OiBmdW5jdGlvbiggb2JqICkge1xuXHRcdC8vIE11c3QgYmUgYW4gT2JqZWN0LlxuXHRcdC8vIEJlY2F1c2Ugb2YgSUUsIHdlIGFsc28gaGF2ZSB0byBjaGVjayB0aGUgcHJlc2VuY2Ugb2YgdGhlIGNvbnN0cnVjdG9yIHByb3BlcnR5LlxuXHRcdC8vIE1ha2Ugc3VyZSB0aGF0IERPTSBub2RlcyBhbmQgd2luZG93IG9iamVjdHMgZG9uJ3QgcGFzcyB0aHJvdWdoLCBhcyB3ZWxsXG5cdFx0aWYgKCAhb2JqIHx8IGpRdWVyeS50eXBlKG9iaikgIT09IFwib2JqZWN0XCIgfHwgb2JqLm5vZGVUeXBlIHx8IGpRdWVyeS5pc1dpbmRvdyggb2JqICkgKSB7XG5cdFx0XHRyZXR1cm4gZmFsc2U7XG5cdFx0fVxuXG5cdFx0dHJ5IHtcblx0XHRcdC8vIE5vdCBvd24gY29uc3RydWN0b3IgcHJvcGVydHkgbXVzdCBiZSBPYmplY3Rcblx0XHRcdGlmICggb2JqLmNvbnN0cnVjdG9yICYmXG5cdFx0XHRcdCFoYXNPd24uY2FsbChvYmosIFwiY29uc3RydWN0b3JcIikgJiZcblx0XHRcdFx0IWhhc093bi5jYWxsKG9iai5jb25zdHJ1Y3Rvci5wcm90b3R5cGUsIFwiaXNQcm90b3R5cGVPZlwiKSApIHtcblx0XHRcdFx0cmV0dXJuIGZhbHNlO1xuXHRcdFx0fVxuXHRcdH0gY2F0Y2ggKCBlICkge1xuXHRcdFx0Ly8gSUU4LDkgV2lsbCB0aHJvdyBleGNlcHRpb25zIG9uIGNlcnRhaW4gaG9zdCBvYmplY3RzICM5ODk3XG5cdFx0XHRyZXR1cm4gZmFsc2U7XG5cdFx0fVxuXG5cdFx0Ly8gT3duIHByb3BlcnRpZXMgYXJlIGVudW1lcmF0ZWQgZmlyc3RseSwgc28gdG8gc3BlZWQgdXAsXG5cdFx0Ly8gaWYgbGFzdCBvbmUgaXMgb3duLCB0aGVuIGFsbCBwcm9wZXJ0aWVzIGFyZSBvd24uXG5cblx0XHR2YXIga2V5O1xuXHRcdGZvciAoIGtleSBpbiBvYmogKSB7fVxuXG5cdFx0cmV0dXJuIGtleSA9PT0gdW5kZWZpbmVkIHx8IGhhc093bi5jYWxsKCBvYmosIGtleSApO1xuXHR9LFxuXG5cdGlzRW1wdHlPYmplY3Q6IGZ1bmN0aW9uKCBvYmogKSB7XG5cdFx0Zm9yICggdmFyIG5hbWUgaW4gb2JqICkge1xuXHRcdFx0cmV0dXJuIGZhbHNlO1xuXHRcdH1cblx0XHRyZXR1cm4gdHJ1ZTtcblx0fSxcblxuXHRlcnJvcjogZnVuY3Rpb24oIG1zZyApIHtcblx0XHR0aHJvdyBtc2c7XG5cdH0sXG5cblx0cGFyc2VKU09OOiBmdW5jdGlvbiggZGF0YSApIHtcblx0XHRpZiAoIHR5cGVvZiBkYXRhICE9PSBcInN0cmluZ1wiIHx8ICFkYXRhICkge1xuXHRcdFx0cmV0dXJuIG51bGw7XG5cdFx0fVxuXG5cdFx0Ly8gTWFrZSBzdXJlIGxlYWRpbmcvdHJhaWxpbmcgd2hpdGVzcGFjZSBpcyByZW1vdmVkIChJRSBjYW4ndCBoYW5kbGUgaXQpXG5cdFx0ZGF0YSA9IGpRdWVyeS50cmltKCBkYXRhICk7XG5cblx0XHQvLyBBdHRlbXB0IHRvIHBhcnNlIHVzaW5nIHRoZSBuYXRpdmUgSlNPTiBwYXJzZXIgZmlyc3Rcblx0XHRpZiAoIHdpbmRvdy5KU09OICYmIHdpbmRvdy5KU09OLnBhcnNlICkge1xuXHRcdFx0cmV0dXJuIHdpbmRvdy5KU09OLnBhcnNlKCBkYXRhICk7XG5cdFx0fVxuXG5cdFx0Ly8gTWFrZSBzdXJlIHRoZSBpbmNvbWluZyBkYXRhIGlzIGFjdHVhbCBKU09OXG5cdFx0Ly8gTG9naWMgYm9ycm93ZWQgZnJvbSBodHRwOi8vanNvbi5vcmcvanNvbjIuanNcblx0XHRpZiAoIHJ2YWxpZGNoYXJzLnRlc3QoIGRhdGEucmVwbGFjZSggcnZhbGlkZXNjYXBlLCBcIkBcIiApXG5cdFx0XHQucmVwbGFjZSggcnZhbGlkdG9rZW5zLCBcIl1cIiApXG5cdFx0XHQucmVwbGFjZSggcnZhbGlkYnJhY2VzLCBcIlwiKSkgKSB7XG5cblx0XHRcdHJldHVybiAobmV3IEZ1bmN0aW9uKCBcInJldHVybiBcIiArIGRhdGEgKSkoKTtcblxuXHRcdH1cblx0XHRqUXVlcnkuZXJyb3IoIFwiSW52YWxpZCBKU09OOiBcIiArIGRhdGEgKTtcblx0fSxcblxuXHQvLyBDcm9zcy1icm93c2VyIHhtbCBwYXJzaW5nXG5cdHBhcnNlWE1MOiBmdW5jdGlvbiggZGF0YSApIHtcblx0XHR2YXIgeG1sLCB0bXA7XG5cdFx0dHJ5IHtcblx0XHRcdGlmICggd2luZG93LkRPTVBhcnNlciApIHsgLy8gU3RhbmRhcmRcblx0XHRcdFx0dG1wID0gbmV3IERPTVBhcnNlcigpO1xuXHRcdFx0XHR4bWwgPSB0bXAucGFyc2VGcm9tU3RyaW5nKCBkYXRhICwgXCJ0ZXh0L3htbFwiICk7XG5cdFx0XHR9IGVsc2UgeyAvLyBJRVxuXHRcdFx0XHR4bWwgPSBuZXcgQWN0aXZlWE9iamVjdCggXCJNaWNyb3NvZnQuWE1MRE9NXCIgKTtcblx0XHRcdFx0eG1sLmFzeW5jID0gXCJmYWxzZVwiO1xuXHRcdFx0XHR4bWwubG9hZFhNTCggZGF0YSApO1xuXHRcdFx0fVxuXHRcdH0gY2F0Y2goIGUgKSB7XG5cdFx0XHR4bWwgPSB1bmRlZmluZWQ7XG5cdFx0fVxuXHRcdGlmICggIXhtbCB8fCAheG1sLmRvY3VtZW50RWxlbWVudCB8fCB4bWwuZ2V0RWxlbWVudHNCeVRhZ05hbWUoIFwicGFyc2VyZXJyb3JcIiApLmxlbmd0aCApIHtcblx0XHRcdGpRdWVyeS5lcnJvciggXCJJbnZhbGlkIFhNTDogXCIgKyBkYXRhICk7XG5cdFx0fVxuXHRcdHJldHVybiB4bWw7XG5cdH0sXG5cblx0bm9vcDogZnVuY3Rpb24oKSB7fSxcblxuXHQvLyBFdmFsdWF0ZXMgYSBzY3JpcHQgaW4gYSBnbG9iYWwgY29udGV4dFxuXHQvLyBXb3JrYXJvdW5kcyBiYXNlZCBvbiBmaW5kaW5ncyBieSBKaW0gRHJpc2NvbGxcblx0Ly8gaHR0cDovL3dlYmxvZ3MuamF2YS5uZXQvYmxvZy9kcmlzY29sbC9hcmNoaXZlLzIwMDkvMDkvMDgvZXZhbC1qYXZhc2NyaXB0LWdsb2JhbC1jb250ZXh0XG5cdGdsb2JhbEV2YWw6IGZ1bmN0aW9uKCBkYXRhICkge1xuXHRcdGlmICggZGF0YSAmJiBybm90d2hpdGUudGVzdCggZGF0YSApICkge1xuXHRcdFx0Ly8gV2UgdXNlIGV4ZWNTY3JpcHQgb24gSW50ZXJuZXQgRXhwbG9yZXJcblx0XHRcdC8vIFdlIHVzZSBhbiBhbm9ueW1vdXMgZnVuY3Rpb24gc28gdGhhdCBjb250ZXh0IGlzIHdpbmRvd1xuXHRcdFx0Ly8gcmF0aGVyIHRoYW4galF1ZXJ5IGluIEZpcmVmb3hcblx0XHRcdCggd2luZG93LmV4ZWNTY3JpcHQgfHwgZnVuY3Rpb24oIGRhdGEgKSB7XG5cdFx0XHRcdHdpbmRvd1sgXCJldmFsXCIgXS5jYWxsKCB3aW5kb3csIGRhdGEgKTtcblx0XHRcdH0gKSggZGF0YSApO1xuXHRcdH1cblx0fSxcblxuXHQvLyBDb252ZXJ0IGRhc2hlZCB0byBjYW1lbENhc2U7IHVzZWQgYnkgdGhlIGNzcyBhbmQgZGF0YSBtb2R1bGVzXG5cdC8vIE1pY3Jvc29mdCBmb3Jnb3QgdG8gaHVtcCB0aGVpciB2ZW5kb3IgcHJlZml4ICgjOTU3Milcblx0Y2FtZWxDYXNlOiBmdW5jdGlvbiggc3RyaW5nICkge1xuXHRcdHJldHVybiBzdHJpbmcucmVwbGFjZSggcm1zUHJlZml4LCBcIm1zLVwiICkucmVwbGFjZSggcmRhc2hBbHBoYSwgZmNhbWVsQ2FzZSApO1xuXHR9LFxuXG5cdG5vZGVOYW1lOiBmdW5jdGlvbiggZWxlbSwgbmFtZSApIHtcblx0XHRyZXR1cm4gZWxlbS5ub2RlTmFtZSAmJiBlbGVtLm5vZGVOYW1lLnRvVXBwZXJDYXNlKCkgPT09IG5hbWUudG9VcHBlckNhc2UoKTtcblx0fSxcblxuXHQvLyBhcmdzIGlzIGZvciBpbnRlcm5hbCB1c2FnZSBvbmx5XG5cdGVhY2g6IGZ1bmN0aW9uKCBvYmplY3QsIGNhbGxiYWNrLCBhcmdzICkge1xuXHRcdHZhciBuYW1lLCBpID0gMCxcblx0XHRcdGxlbmd0aCA9IG9iamVjdC5sZW5ndGgsXG5cdFx0XHRpc09iaiA9IGxlbmd0aCA9PT0gdW5kZWZpbmVkIHx8IGpRdWVyeS5pc0Z1bmN0aW9uKCBvYmplY3QgKTtcblxuXHRcdGlmICggYXJncyApIHtcblx0XHRcdGlmICggaXNPYmogKSB7XG5cdFx0XHRcdGZvciAoIG5hbWUgaW4gb2JqZWN0ICkge1xuXHRcdFx0XHRcdGlmICggY2FsbGJhY2suYXBwbHkoIG9iamVjdFsgbmFtZSBdLCBhcmdzICkgPT09IGZhbHNlICkge1xuXHRcdFx0XHRcdFx0YnJlYWs7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9XG5cdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRmb3IgKCA7IGkgPCBsZW5ndGg7ICkge1xuXHRcdFx0XHRcdGlmICggY2FsbGJhY2suYXBwbHkoIG9iamVjdFsgaSsrIF0sIGFyZ3MgKSA9PT0gZmFsc2UgKSB7XG5cdFx0XHRcdFx0XHRicmVhaztcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH1cblx0XHRcdH1cblxuXHRcdC8vIEEgc3BlY2lhbCwgZmFzdCwgY2FzZSBmb3IgdGhlIG1vc3QgY29tbW9uIHVzZSBvZiBlYWNoXG5cdFx0fSBlbHNlIHtcblx0XHRcdGlmICggaXNPYmogKSB7XG5cdFx0XHRcdGZvciAoIG5hbWUgaW4gb2JqZWN0ICkge1xuXHRcdFx0XHRcdGlmICggY2FsbGJhY2suY2FsbCggb2JqZWN0WyBuYW1lIF0sIG5hbWUsIG9iamVjdFsgbmFtZSBdICkgPT09IGZhbHNlICkge1xuXHRcdFx0XHRcdFx0YnJlYWs7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9XG5cdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRmb3IgKCA7IGkgPCBsZW5ndGg7ICkge1xuXHRcdFx0XHRcdGlmICggY2FsbGJhY2suY2FsbCggb2JqZWN0WyBpIF0sIGksIG9iamVjdFsgaSsrIF0gKSA9PT0gZmFsc2UgKSB7XG5cdFx0XHRcdFx0XHRicmVhaztcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH1cblx0XHRcdH1cblx0XHR9XG5cblx0XHRyZXR1cm4gb2JqZWN0O1xuXHR9LFxuXG5cdC8vIFVzZSBuYXRpdmUgU3RyaW5nLnRyaW0gZnVuY3Rpb24gd2hlcmV2ZXIgcG9zc2libGVcblx0dHJpbTogdHJpbSA/XG5cdFx0ZnVuY3Rpb24oIHRleHQgKSB7XG5cdFx0XHRyZXR1cm4gdGV4dCA9PSBudWxsID9cblx0XHRcdFx0XCJcIiA6XG5cdFx0XHRcdHRyaW0uY2FsbCggdGV4dCApO1xuXHRcdH0gOlxuXG5cdFx0Ly8gT3RoZXJ3aXNlIHVzZSBvdXIgb3duIHRyaW1taW5nIGZ1bmN0aW9uYWxpdHlcblx0XHRmdW5jdGlvbiggdGV4dCApIHtcblx0XHRcdHJldHVybiB0ZXh0ID09IG51bGwgP1xuXHRcdFx0XHRcIlwiIDpcblx0XHRcdFx0dGV4dC50b1N0cmluZygpLnJlcGxhY2UoIHRyaW1MZWZ0LCBcIlwiICkucmVwbGFjZSggdHJpbVJpZ2h0LCBcIlwiICk7XG5cdFx0fSxcblxuXHQvLyByZXN1bHRzIGlzIGZvciBpbnRlcm5hbCB1c2FnZSBvbmx5XG5cdG1ha2VBcnJheTogZnVuY3Rpb24oIGFycmF5LCByZXN1bHRzICkge1xuXHRcdHZhciByZXQgPSByZXN1bHRzIHx8IFtdO1xuXG5cdFx0aWYgKCBhcnJheSAhPSBudWxsICkge1xuXHRcdFx0Ly8gVGhlIHdpbmRvdywgc3RyaW5ncyAoYW5kIGZ1bmN0aW9ucykgYWxzbyBoYXZlICdsZW5ndGgnXG5cdFx0XHQvLyBUaGUgZXh0cmEgdHlwZW9mIGZ1bmN0aW9uIGNoZWNrIGlzIHRvIHByZXZlbnQgY3Jhc2hlc1xuXHRcdFx0Ly8gaW4gU2FmYXJpIDIgKFNlZTogIzMwMzkpXG5cdFx0XHQvLyBUd2Vha2VkIGxvZ2ljIHNsaWdodGx5IHRvIGhhbmRsZSBCbGFja2JlcnJ5IDQuNyBSZWdFeHAgaXNzdWVzICM2OTMwXG5cdFx0XHR2YXIgdHlwZSA9IGpRdWVyeS50eXBlKCBhcnJheSApO1xuXG5cdFx0XHRpZiAoIGFycmF5Lmxlbmd0aCA9PSBudWxsIHx8IHR5cGUgPT09IFwic3RyaW5nXCIgfHwgdHlwZSA9PT0gXCJmdW5jdGlvblwiIHx8IHR5cGUgPT09IFwicmVnZXhwXCIgfHwgalF1ZXJ5LmlzV2luZG93KCBhcnJheSApICkge1xuXHRcdFx0XHRwdXNoLmNhbGwoIHJldCwgYXJyYXkgKTtcblx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdGpRdWVyeS5tZXJnZSggcmV0LCBhcnJheSApO1xuXHRcdFx0fVxuXHRcdH1cblxuXHRcdHJldHVybiByZXQ7XG5cdH0sXG5cblx0aW5BcnJheTogZnVuY3Rpb24oIGVsZW0sIGFycmF5LCBpICkge1xuXHRcdHZhciBsZW47XG5cblx0XHRpZiAoIGFycmF5ICkge1xuXHRcdFx0aWYgKCBpbmRleE9mICkge1xuXHRcdFx0XHRyZXR1cm4gaW5kZXhPZi5jYWxsKCBhcnJheSwgZWxlbSwgaSApO1xuXHRcdFx0fVxuXG5cdFx0XHRsZW4gPSBhcnJheS5sZW5ndGg7XG5cdFx0XHRpID0gaSA/IGkgPCAwID8gTWF0aC5tYXgoIDAsIGxlbiArIGkgKSA6IGkgOiAwO1xuXG5cdFx0XHRmb3IgKCA7IGkgPCBsZW47IGkrKyApIHtcblx0XHRcdFx0Ly8gU2tpcCBhY2Nlc3NpbmcgaW4gc3BhcnNlIGFycmF5c1xuXHRcdFx0XHRpZiAoIGkgaW4gYXJyYXkgJiYgYXJyYXlbIGkgXSA9PT0gZWxlbSApIHtcblx0XHRcdFx0XHRyZXR1cm4gaTtcblx0XHRcdFx0fVxuXHRcdFx0fVxuXHRcdH1cblxuXHRcdHJldHVybiAtMTtcblx0fSxcblxuXHRtZXJnZTogZnVuY3Rpb24oIGZpcnN0LCBzZWNvbmQgKSB7XG5cdFx0dmFyIGkgPSBmaXJzdC5sZW5ndGgsXG5cdFx0XHRqID0gMDtcblxuXHRcdGlmICggdHlwZW9mIHNlY29uZC5sZW5ndGggPT09IFwibnVtYmVyXCIgKSB7XG5cdFx0XHRmb3IgKCB2YXIgbCA9IHNlY29uZC5sZW5ndGg7IGogPCBsOyBqKysgKSB7XG5cdFx0XHRcdGZpcnN0WyBpKysgXSA9IHNlY29uZFsgaiBdO1xuXHRcdFx0fVxuXG5cdFx0fSBlbHNlIHtcblx0XHRcdHdoaWxlICggc2Vjb25kW2pdICE9PSB1bmRlZmluZWQgKSB7XG5cdFx0XHRcdGZpcnN0WyBpKysgXSA9IHNlY29uZFsgaisrIF07XG5cdFx0XHR9XG5cdFx0fVxuXG5cdFx0Zmlyc3QubGVuZ3RoID0gaTtcblxuXHRcdHJldHVybiBmaXJzdDtcblx0fSxcblxuXHRncmVwOiBmdW5jdGlvbiggZWxlbXMsIGNhbGxiYWNrLCBpbnYgKSB7XG5cdFx0dmFyIHJldCA9IFtdLCByZXRWYWw7XG5cdFx0aW52ID0gISFpbnY7XG5cblx0XHQvLyBHbyB0aHJvdWdoIHRoZSBhcnJheSwgb25seSBzYXZpbmcgdGhlIGl0ZW1zXG5cdFx0Ly8gdGhhdCBwYXNzIHRoZSB2YWxpZGF0b3IgZnVuY3Rpb25cblx0XHRmb3IgKCB2YXIgaSA9IDAsIGxlbmd0aCA9IGVsZW1zLmxlbmd0aDsgaSA8IGxlbmd0aDsgaSsrICkge1xuXHRcdFx0cmV0VmFsID0gISFjYWxsYmFjayggZWxlbXNbIGkgXSwgaSApO1xuXHRcdFx0aWYgKCBpbnYgIT09IHJldFZhbCApIHtcblx0XHRcdFx0cmV0LnB1c2goIGVsZW1zWyBpIF0gKTtcblx0XHRcdH1cblx0XHR9XG5cblx0XHRyZXR1cm4gcmV0O1xuXHR9LFxuXG5cdC8vIGFyZyBpcyBmb3IgaW50ZXJuYWwgdXNhZ2Ugb25seVxuXHRtYXA6IGZ1bmN0aW9uKCBlbGVtcywgY2FsbGJhY2ssIGFyZyApIHtcblx0XHR2YXIgdmFsdWUsIGtleSwgcmV0ID0gW10sXG5cdFx0XHRpID0gMCxcblx0XHRcdGxlbmd0aCA9IGVsZW1zLmxlbmd0aCxcblx0XHRcdC8vIGpxdWVyeSBvYmplY3RzIGFyZSB0cmVhdGVkIGFzIGFycmF5c1xuXHRcdFx0aXNBcnJheSA9IGVsZW1zIGluc3RhbmNlb2YgalF1ZXJ5IHx8IGxlbmd0aCAhPT0gdW5kZWZpbmVkICYmIHR5cGVvZiBsZW5ndGggPT09IFwibnVtYmVyXCIgJiYgKCAoIGxlbmd0aCA+IDAgJiYgZWxlbXNbIDAgXSAmJiBlbGVtc1sgbGVuZ3RoIC0xIF0gKSB8fCBsZW5ndGggPT09IDAgfHwgalF1ZXJ5LmlzQXJyYXkoIGVsZW1zICkgKSA7XG5cblx0XHQvLyBHbyB0aHJvdWdoIHRoZSBhcnJheSwgdHJhbnNsYXRpbmcgZWFjaCBvZiB0aGUgaXRlbXMgdG8gdGhlaXJcblx0XHRpZiAoIGlzQXJyYXkgKSB7XG5cdFx0XHRmb3IgKCA7IGkgPCBsZW5ndGg7IGkrKyApIHtcblx0XHRcdFx0dmFsdWUgPSBjYWxsYmFjayggZWxlbXNbIGkgXSwgaSwgYXJnICk7XG5cblx0XHRcdFx0aWYgKCB2YWx1ZSAhPSBudWxsICkge1xuXHRcdFx0XHRcdHJldFsgcmV0Lmxlbmd0aCBdID0gdmFsdWU7XG5cdFx0XHRcdH1cblx0XHRcdH1cblxuXHRcdC8vIEdvIHRocm91Z2ggZXZlcnkga2V5IG9uIHRoZSBvYmplY3QsXG5cdFx0fSBlbHNlIHtcblx0XHRcdGZvciAoIGtleSBpbiBlbGVtcyApIHtcblx0XHRcdFx0dmFsdWUgPSBjYWxsYmFjayggZWxlbXNbIGtleSBdLCBrZXksIGFyZyApO1xuXG5cdFx0XHRcdGlmICggdmFsdWUgIT0gbnVsbCApIHtcblx0XHRcdFx0XHRyZXRbIHJldC5sZW5ndGggXSA9IHZhbHVlO1xuXHRcdFx0XHR9XG5cdFx0XHR9XG5cdFx0fVxuXG5cdFx0Ly8gRmxhdHRlbiBhbnkgbmVzdGVkIGFycmF5c1xuXHRcdHJldHVybiByZXQuY29uY2F0LmFwcGx5KCBbXSwgcmV0ICk7XG5cdH0sXG5cblx0Ly8gQSBnbG9iYWwgR1VJRCBjb3VudGVyIGZvciBvYmplY3RzXG5cdGd1aWQ6IDEsXG5cblx0Ly8gQmluZCBhIGZ1bmN0aW9uIHRvIGEgY29udGV4dCwgb3B0aW9uYWxseSBwYXJ0aWFsbHkgYXBwbHlpbmcgYW55XG5cdC8vIGFyZ3VtZW50cy5cblx0cHJveHk6IGZ1bmN0aW9uKCBmbiwgY29udGV4dCApIHtcblx0XHRpZiAoIHR5cGVvZiBjb250ZXh0ID09PSBcInN0cmluZ1wiICkge1xuXHRcdFx0dmFyIHRtcCA9IGZuWyBjb250ZXh0IF07XG5cdFx0XHRjb250ZXh0ID0gZm47XG5cdFx0XHRmbiA9IHRtcDtcblx0XHR9XG5cblx0XHQvLyBRdWljayBjaGVjayB0byBkZXRlcm1pbmUgaWYgdGFyZ2V0IGlzIGNhbGxhYmxlLCBpbiB0aGUgc3BlY1xuXHRcdC8vIHRoaXMgdGhyb3dzIGEgVHlwZUVycm9yLCBidXQgd2Ugd2lsbCBqdXN0IHJldHVybiB1bmRlZmluZWQuXG5cdFx0aWYgKCAhalF1ZXJ5LmlzRnVuY3Rpb24oIGZuICkgKSB7XG5cdFx0XHRyZXR1cm4gdW5kZWZpbmVkO1xuXHRcdH1cblxuXHRcdC8vIFNpbXVsYXRlZCBiaW5kXG5cdFx0dmFyIGFyZ3MgPSBzbGljZS5jYWxsKCBhcmd1bWVudHMsIDIgKSxcblx0XHRcdHByb3h5ID0gZnVuY3Rpb24oKSB7XG5cdFx0XHRcdHJldHVybiBmbi5hcHBseSggY29udGV4dCwgYXJncy5jb25jYXQoIHNsaWNlLmNhbGwoIGFyZ3VtZW50cyApICkgKTtcblx0XHRcdH07XG5cblx0XHQvLyBTZXQgdGhlIGd1aWQgb2YgdW5pcXVlIGhhbmRsZXIgdG8gdGhlIHNhbWUgb2Ygb3JpZ2luYWwgaGFuZGxlciwgc28gaXQgY2FuIGJlIHJlbW92ZWRcblx0XHRwcm94eS5ndWlkID0gZm4uZ3VpZCA9IGZuLmd1aWQgfHwgcHJveHkuZ3VpZCB8fCBqUXVlcnkuZ3VpZCsrO1xuXG5cdFx0cmV0dXJuIHByb3h5O1xuXHR9LFxuXG5cdC8vIE11dGlmdW5jdGlvbmFsIG1ldGhvZCB0byBnZXQgYW5kIHNldCB2YWx1ZXMgdG8gYSBjb2xsZWN0aW9uXG5cdC8vIFRoZSB2YWx1ZS9zIGNhbiBvcHRpb25hbGx5IGJlIGV4ZWN1dGVkIGlmIGl0J3MgYSBmdW5jdGlvblxuXHRhY2Nlc3M6IGZ1bmN0aW9uKCBlbGVtcywga2V5LCB2YWx1ZSwgZXhlYywgZm4sIHBhc3MgKSB7XG5cdFx0dmFyIGxlbmd0aCA9IGVsZW1zLmxlbmd0aDtcblxuXHRcdC8vIFNldHRpbmcgbWFueSBhdHRyaWJ1dGVzXG5cdFx0aWYgKCB0eXBlb2Yga2V5ID09PSBcIm9iamVjdFwiICkge1xuXHRcdFx0Zm9yICggdmFyIGsgaW4ga2V5ICkge1xuXHRcdFx0XHRqUXVlcnkuYWNjZXNzKCBlbGVtcywgaywga2V5W2tdLCBleGVjLCBmbiwgdmFsdWUgKTtcblx0XHRcdH1cblx0XHRcdHJldHVybiBlbGVtcztcblx0XHR9XG5cblx0XHQvLyBTZXR0aW5nIG9uZSBhdHRyaWJ1dGVcblx0XHRpZiAoIHZhbHVlICE9PSB1bmRlZmluZWQgKSB7XG5cdFx0XHQvLyBPcHRpb25hbGx5LCBmdW5jdGlvbiB2YWx1ZXMgZ2V0IGV4ZWN1dGVkIGlmIGV4ZWMgaXMgdHJ1ZVxuXHRcdFx0ZXhlYyA9ICFwYXNzICYmIGV4ZWMgJiYgalF1ZXJ5LmlzRnVuY3Rpb24odmFsdWUpO1xuXG5cdFx0XHRmb3IgKCB2YXIgaSA9IDA7IGkgPCBsZW5ndGg7IGkrKyApIHtcblx0XHRcdFx0Zm4oIGVsZW1zW2ldLCBrZXksIGV4ZWMgPyB2YWx1ZS5jYWxsKCBlbGVtc1tpXSwgaSwgZm4oIGVsZW1zW2ldLCBrZXkgKSApIDogdmFsdWUsIHBhc3MgKTtcblx0XHRcdH1cblxuXHRcdFx0cmV0dXJuIGVsZW1zO1xuXHRcdH1cblxuXHRcdC8vIEdldHRpbmcgYW4gYXR0cmlidXRlXG5cdFx0cmV0dXJuIGxlbmd0aCA/IGZuKCBlbGVtc1swXSwga2V5ICkgOiB1bmRlZmluZWQ7XG5cdH0sXG5cblx0bm93OiBmdW5jdGlvbigpIHtcblx0XHRyZXR1cm4gKG5ldyBEYXRlKCkpLmdldFRpbWUoKTtcblx0fSxcblxuXHQvLyBVc2Ugb2YgalF1ZXJ5LmJyb3dzZXIgaXMgZnJvd25lZCB1cG9uLlxuXHQvLyBNb3JlIGRldGFpbHM6IGh0dHA6Ly9kb2NzLmpxdWVyeS5jb20vVXRpbGl0aWVzL2pRdWVyeS5icm93c2VyXG5cdHVhTWF0Y2g6IGZ1bmN0aW9uKCB1YSApIHtcblx0XHR1YSA9IHVhLnRvTG93ZXJDYXNlKCk7XG5cblx0XHR2YXIgbWF0Y2ggPSByd2Via2l0LmV4ZWMoIHVhICkgfHxcblx0XHRcdHJvcGVyYS5leGVjKCB1YSApIHx8XG5cdFx0XHRybXNpZS5leGVjKCB1YSApIHx8XG5cdFx0XHR1YS5pbmRleE9mKFwiY29tcGF0aWJsZVwiKSA8IDAgJiYgcm1vemlsbGEuZXhlYyggdWEgKSB8fFxuXHRcdFx0W107XG5cblx0XHRyZXR1cm4geyBicm93c2VyOiBtYXRjaFsxXSB8fCBcIlwiLCB2ZXJzaW9uOiBtYXRjaFsyXSB8fCBcIjBcIiB9O1xuXHR9LFxuXG5cdHN1YjogZnVuY3Rpb24oKSB7XG5cdFx0ZnVuY3Rpb24galF1ZXJ5U3ViKCBzZWxlY3RvciwgY29udGV4dCApIHtcblx0XHRcdHJldHVybiBuZXcgalF1ZXJ5U3ViLmZuLmluaXQoIHNlbGVjdG9yLCBjb250ZXh0ICk7XG5cdFx0fVxuXHRcdGpRdWVyeS5leHRlbmQoIHRydWUsIGpRdWVyeVN1YiwgdGhpcyApO1xuXHRcdGpRdWVyeVN1Yi5zdXBlcmNsYXNzID0gdGhpcztcblx0XHRqUXVlcnlTdWIuZm4gPSBqUXVlcnlTdWIucHJvdG90eXBlID0gdGhpcygpO1xuXHRcdGpRdWVyeVN1Yi5mbi5jb25zdHJ1Y3RvciA9IGpRdWVyeVN1Yjtcblx0XHRqUXVlcnlTdWIuc3ViID0gdGhpcy5zdWI7XG5cdFx0alF1ZXJ5U3ViLmZuLmluaXQgPSBmdW5jdGlvbiBpbml0KCBzZWxlY3RvciwgY29udGV4dCApIHtcblx0XHRcdGlmICggY29udGV4dCAmJiBjb250ZXh0IGluc3RhbmNlb2YgalF1ZXJ5ICYmICEoY29udGV4dCBpbnN0YW5jZW9mIGpRdWVyeVN1YikgKSB7XG5cdFx0XHRcdGNvbnRleHQgPSBqUXVlcnlTdWIoIGNvbnRleHQgKTtcblx0XHRcdH1cblxuXHRcdFx0cmV0dXJuIGpRdWVyeS5mbi5pbml0LmNhbGwoIHRoaXMsIHNlbGVjdG9yLCBjb250ZXh0LCByb290alF1ZXJ5U3ViICk7XG5cdFx0fTtcblx0XHRqUXVlcnlTdWIuZm4uaW5pdC5wcm90b3R5cGUgPSBqUXVlcnlTdWIuZm47XG5cdFx0dmFyIHJvb3RqUXVlcnlTdWIgPSBqUXVlcnlTdWIoZG9jdW1lbnQpO1xuXHRcdHJldHVybiBqUXVlcnlTdWI7XG5cdH0sXG5cblx0YnJvd3Nlcjoge31cbn0pO1xuXG4vLyBQb3B1bGF0ZSB0aGUgY2xhc3MydHlwZSBtYXBcbmpRdWVyeS5lYWNoKFwiQm9vbGVhbiBOdW1iZXIgU3RyaW5nIEZ1bmN0aW9uIEFycmF5IERhdGUgUmVnRXhwIE9iamVjdFwiLnNwbGl0KFwiIFwiKSwgZnVuY3Rpb24oaSwgbmFtZSkge1xuXHRjbGFzczJ0eXBlWyBcIltvYmplY3QgXCIgKyBuYW1lICsgXCJdXCIgXSA9IG5hbWUudG9Mb3dlckNhc2UoKTtcbn0pO1xuXG5icm93c2VyTWF0Y2ggPSBqUXVlcnkudWFNYXRjaCggdXNlckFnZW50ICk7XG5pZiAoIGJyb3dzZXJNYXRjaC5icm93c2VyICkge1xuXHRqUXVlcnkuYnJvd3NlclsgYnJvd3Nlck1hdGNoLmJyb3dzZXIgXSA9IHRydWU7XG5cdGpRdWVyeS5icm93c2VyLnZlcnNpb24gPSBicm93c2VyTWF0Y2gudmVyc2lvbjtcbn1cblxuLy8gRGVwcmVjYXRlZCwgdXNlIGpRdWVyeS5icm93c2VyLndlYmtpdCBpbnN0ZWFkXG5pZiAoIGpRdWVyeS5icm93c2VyLndlYmtpdCApIHtcblx0alF1ZXJ5LmJyb3dzZXIuc2FmYXJpID0gdHJ1ZTtcbn1cblxuLy8gSUUgZG9lc24ndCBtYXRjaCBub24tYnJlYWtpbmcgc3BhY2VzIHdpdGggXFxzXG5pZiAoIHJub3R3aGl0ZS50ZXN0KCBcIlxceEEwXCIgKSApIHtcblx0dHJpbUxlZnQgPSAvXltcXHNcXHhBMF0rLztcblx0dHJpbVJpZ2h0ID0gL1tcXHNcXHhBMF0rJC87XG59XG5cbi8vIEFsbCBqUXVlcnkgb2JqZWN0cyBzaG91bGQgcG9pbnQgYmFjayB0byB0aGVzZVxucm9vdGpRdWVyeSA9IGpRdWVyeShkb2N1bWVudCk7XG5cbi8vIENsZWFudXAgZnVuY3Rpb25zIGZvciB0aGUgZG9jdW1lbnQgcmVhZHkgbWV0aG9kXG5pZiAoIGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIgKSB7XG5cdERPTUNvbnRlbnRMb2FkZWQgPSBmdW5jdGlvbigpIHtcblx0XHRkb2N1bWVudC5yZW1vdmVFdmVudExpc3RlbmVyKCBcIkRPTUNvbnRlbnRMb2FkZWRcIiwgRE9NQ29udGVudExvYWRlZCwgZmFsc2UgKTtcblx0XHRqUXVlcnkucmVhZHkoKTtcblx0fTtcblxufSBlbHNlIGlmICggZG9jdW1lbnQuYXR0YWNoRXZlbnQgKSB7XG5cdERPTUNvbnRlbnRMb2FkZWQgPSBmdW5jdGlvbigpIHtcblx0XHQvLyBNYWtlIHN1cmUgYm9keSBleGlzdHMsIGF0IGxlYXN0LCBpbiBjYXNlIElFIGdldHMgYSBsaXR0bGUgb3ZlcnplYWxvdXMgKHRpY2tldCAjNTQ0MykuXG5cdFx0aWYgKCBkb2N1bWVudC5yZWFkeVN0YXRlID09PSBcImNvbXBsZXRlXCIgKSB7XG5cdFx0XHRkb2N1bWVudC5kZXRhY2hFdmVudCggXCJvbnJlYWR5c3RhdGVjaGFuZ2VcIiwgRE9NQ29udGVudExvYWRlZCApO1xuXHRcdFx0alF1ZXJ5LnJlYWR5KCk7XG5cdFx0fVxuXHR9O1xufVxuXG4vLyBUaGUgRE9NIHJlYWR5IGNoZWNrIGZvciBJbnRlcm5ldCBFeHBsb3JlclxuZnVuY3Rpb24gZG9TY3JvbGxDaGVjaygpIHtcblx0aWYgKCBqUXVlcnkuaXNSZWFkeSApIHtcblx0XHRyZXR1cm47XG5cdH1cblxuXHR0cnkge1xuXHRcdC8vIElmIElFIGlzIHVzZWQsIHVzZSB0aGUgdHJpY2sgYnkgRGllZ28gUGVyaW5pXG5cdFx0Ly8gaHR0cDovL2phdmFzY3JpcHQubndib3guY29tL0lFQ29udGVudExvYWRlZC9cblx0XHRkb2N1bWVudC5kb2N1bWVudEVsZW1lbnQuZG9TY3JvbGwoXCJsZWZ0XCIpO1xuXHR9IGNhdGNoKGUpIHtcblx0XHRzZXRUaW1lb3V0KCBkb1Njcm9sbENoZWNrLCAxICk7XG5cdFx0cmV0dXJuO1xuXHR9XG5cblx0Ly8gYW5kIGV4ZWN1dGUgYW55IHdhaXRpbmcgZnVuY3Rpb25zXG5cdGpRdWVyeS5yZWFkeSgpO1xufVxuXG4vLyBFeHBvc2UgalF1ZXJ5IGFzIGFuIEFNRCBtb2R1bGUsIGJ1dCBvbmx5IGZvciBBTUQgbG9hZGVycyB0aGF0XG4vLyB1bmRlcnN0YW5kIHRoZSBpc3N1ZXMgd2l0aCBsb2FkaW5nIG11bHRpcGxlIHZlcnNpb25zIG9mIGpRdWVyeVxuLy8gaW4gYSBwYWdlIHRoYXQgYWxsIG1pZ2h0IGNhbGwgZGVmaW5lKCkuIFRoZSBsb2FkZXIgd2lsbCBpbmRpY2F0ZVxuLy8gdGhleSBoYXZlIHNwZWNpYWwgYWxsb3dhbmNlcyBmb3IgbXVsdGlwbGUgalF1ZXJ5IHZlcnNpb25zIGJ5XG4vLyBzcGVjaWZ5aW5nIGRlZmluZS5hbWQualF1ZXJ5ID0gdHJ1ZS4gUmVnaXN0ZXIgYXMgYSBuYW1lZCBtb2R1bGUsXG4vLyBzaW5jZSBqUXVlcnkgY2FuIGJlIGNvbmNhdGVuYXRlZCB3aXRoIG90aGVyIGZpbGVzIHRoYXQgbWF5IHVzZSBkZWZpbmUsXG4vLyBidXQgbm90IHVzZSBhIHByb3BlciBjb25jYXRlbmF0aW9uIHNjcmlwdCB0aGF0IHVuZGVyc3RhbmRzIGFub255bW91c1xuLy8gQU1EIG1vZHVsZXMuIEEgbmFtZWQgQU1EIGlzIHNhZmVzdCBhbmQgbW9zdCByb2J1c3Qgd2F5IHRvIHJlZ2lzdGVyLlxuLy8gTG93ZXJjYXNlIGpxdWVyeSBpcyB1c2VkIGJlY2F1c2UgQU1EIG1vZHVsZSBuYW1lcyBhcmUgZGVyaXZlZCBmcm9tXG4vLyBmaWxlIG5hbWVzLCBhbmQgalF1ZXJ5IGlzIG5vcm1hbGx5IGRlbGl2ZXJlZCBpbiBhIGxvd2VyY2FzZSBmaWxlIG5hbWUuXG5pZiAoIHR5cGVvZiBkZWZpbmUgPT09IFwiZnVuY3Rpb25cIiAmJiBkZWZpbmUuYW1kICYmIGRlZmluZS5hbWQualF1ZXJ5ICkge1xuXHRkZWZpbmUoIFwianF1ZXJ5XCIsIFtdLCBmdW5jdGlvbiAoKSB7IHJldHVybiBqUXVlcnk7IH0gKTtcbn1cblxucmV0dXJuIGpRdWVyeTtcblxufSkoKTtcblxuXG4vLyBTdHJpbmcgdG8gT2JqZWN0IGZsYWdzIGZvcm1hdCBjYWNoZVxudmFyIGZsYWdzQ2FjaGUgPSB7fTtcblxuLy8gQ29udmVydCBTdHJpbmctZm9ybWF0dGVkIGZsYWdzIGludG8gT2JqZWN0LWZvcm1hdHRlZCBvbmVzIGFuZCBzdG9yZSBpbiBjYWNoZVxuZnVuY3Rpb24gY3JlYXRlRmxhZ3MoIGZsYWdzICkge1xuXHR2YXIgb2JqZWN0ID0gZmxhZ3NDYWNoZVsgZmxhZ3MgXSA9IHt9LFxuXHRcdGksIGxlbmd0aDtcblx0ZmxhZ3MgPSBmbGFncy5zcGxpdCggL1xccysvICk7XG5cdGZvciAoIGkgPSAwLCBsZW5ndGggPSBmbGFncy5sZW5ndGg7IGkgPCBsZW5ndGg7IGkrKyApIHtcblx0XHRvYmplY3RbIGZsYWdzW2ldIF0gPSB0cnVlO1xuXHR9XG5cdHJldHVybiBvYmplY3Q7XG59XG5cbi8qXG4gKiBDcmVhdGUgYSBjYWxsYmFjayBsaXN0IHVzaW5nIHRoZSBmb2xsb3dpbmcgcGFyYW1ldGVyczpcbiAqXG4gKlx0ZmxhZ3M6XHRhbiBvcHRpb25hbCBsaXN0IG9mIHNwYWNlLXNlcGFyYXRlZCBmbGFncyB0aGF0IHdpbGwgY2hhbmdlIGhvd1xuICpcdFx0XHR0aGUgY2FsbGJhY2sgbGlzdCBiZWhhdmVzXG4gKlxuICogQnkgZGVmYXVsdCBhIGNhbGxiYWNrIGxpc3Qgd2lsbCBhY3QgbGlrZSBhbiBldmVudCBjYWxsYmFjayBsaXN0IGFuZCBjYW4gYmVcbiAqIFwiZmlyZWRcIiBtdWx0aXBsZSB0aW1lcy5cbiAqXG4gKiBQb3NzaWJsZSBmbGFnczpcbiAqXG4gKlx0b25jZTpcdFx0XHR3aWxsIGVuc3VyZSB0aGUgY2FsbGJhY2sgbGlzdCBjYW4gb25seSBiZSBmaXJlZCBvbmNlIChsaWtlIGEgRGVmZXJyZWQpXG4gKlxuICpcdG1lbW9yeTpcdFx0XHR3aWxsIGtlZXAgdHJhY2sgb2YgcHJldmlvdXMgdmFsdWVzIGFuZCB3aWxsIGNhbGwgYW55IGNhbGxiYWNrIGFkZGVkXG4gKlx0XHRcdFx0XHRhZnRlciB0aGUgbGlzdCBoYXMgYmVlbiBmaXJlZCByaWdodCBhd2F5IHdpdGggdGhlIGxhdGVzdCBcIm1lbW9yaXplZFwiXG4gKlx0XHRcdFx0XHR2YWx1ZXMgKGxpa2UgYSBEZWZlcnJlZClcbiAqXG4gKlx0dW5pcXVlOlx0XHRcdHdpbGwgZW5zdXJlIGEgY2FsbGJhY2sgY2FuIG9ubHkgYmUgYWRkZWQgb25jZSAobm8gZHVwbGljYXRlIGluIHRoZSBsaXN0KVxuICpcbiAqXHRzdG9wT25GYWxzZTpcdGludGVycnVwdCBjYWxsaW5ncyB3aGVuIGEgY2FsbGJhY2sgcmV0dXJucyBmYWxzZVxuICpcbiAqL1xualF1ZXJ5LkNhbGxiYWNrcyA9IGZ1bmN0aW9uKCBmbGFncyApIHtcblxuXHQvLyBDb252ZXJ0IGZsYWdzIGZyb20gU3RyaW5nLWZvcm1hdHRlZCB0byBPYmplY3QtZm9ybWF0dGVkXG5cdC8vICh3ZSBjaGVjayBpbiBjYWNoZSBmaXJzdClcblx0ZmxhZ3MgPSBmbGFncyA/ICggZmxhZ3NDYWNoZVsgZmxhZ3MgXSB8fCBjcmVhdGVGbGFncyggZmxhZ3MgKSApIDoge307XG5cblx0dmFyIC8vIEFjdHVhbCBjYWxsYmFjayBsaXN0XG5cdFx0bGlzdCA9IFtdLFxuXHRcdC8vIFN0YWNrIG9mIGZpcmUgY2FsbHMgZm9yIHJlcGVhdGFibGUgbGlzdHNcblx0XHRzdGFjayA9IFtdLFxuXHRcdC8vIExhc3QgZmlyZSB2YWx1ZSAoZm9yIG5vbi1mb3JnZXR0YWJsZSBsaXN0cylcblx0XHRtZW1vcnksXG5cdFx0Ly8gRmxhZyB0byBrbm93IGlmIGxpc3QgaXMgY3VycmVudGx5IGZpcmluZ1xuXHRcdGZpcmluZyxcblx0XHQvLyBGaXJzdCBjYWxsYmFjayB0byBmaXJlICh1c2VkIGludGVybmFsbHkgYnkgYWRkIGFuZCBmaXJlV2l0aClcblx0XHRmaXJpbmdTdGFydCxcblx0XHQvLyBFbmQgb2YgdGhlIGxvb3Agd2hlbiBmaXJpbmdcblx0XHRmaXJpbmdMZW5ndGgsXG5cdFx0Ly8gSW5kZXggb2YgY3VycmVudGx5IGZpcmluZyBjYWxsYmFjayAobW9kaWZpZWQgYnkgcmVtb3ZlIGlmIG5lZWRlZClcblx0XHRmaXJpbmdJbmRleCxcblx0XHQvLyBBZGQgb25lIG9yIHNldmVyYWwgY2FsbGJhY2tzIHRvIHRoZSBsaXN0XG5cdFx0YWRkID0gZnVuY3Rpb24oIGFyZ3MgKSB7XG5cdFx0XHR2YXIgaSxcblx0XHRcdFx0bGVuZ3RoLFxuXHRcdFx0XHRlbGVtLFxuXHRcdFx0XHR0eXBlLFxuXHRcdFx0XHRhY3R1YWw7XG5cdFx0XHRmb3IgKCBpID0gMCwgbGVuZ3RoID0gYXJncy5sZW5ndGg7IGkgPCBsZW5ndGg7IGkrKyApIHtcblx0XHRcdFx0ZWxlbSA9IGFyZ3NbIGkgXTtcblx0XHRcdFx0dHlwZSA9IGpRdWVyeS50eXBlKCBlbGVtICk7XG5cdFx0XHRcdGlmICggdHlwZSA9PT0gXCJhcnJheVwiICkge1xuXHRcdFx0XHRcdC8vIEluc3BlY3QgcmVjdXJzaXZlbHlcblx0XHRcdFx0XHRhZGQoIGVsZW0gKTtcblx0XHRcdFx0fSBlbHNlIGlmICggdHlwZSA9PT0gXCJmdW5jdGlvblwiICkge1xuXHRcdFx0XHRcdC8vIEFkZCBpZiBub3QgaW4gdW5pcXVlIG1vZGUgYW5kIGNhbGxiYWNrIGlzIG5vdCBpblxuXHRcdFx0XHRcdGlmICggIWZsYWdzLnVuaXF1ZSB8fCAhc2VsZi5oYXMoIGVsZW0gKSApIHtcblx0XHRcdFx0XHRcdGxpc3QucHVzaCggZWxlbSApO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0fVxuXHRcdFx0fVxuXHRcdH0sXG5cdFx0Ly8gRmlyZSBjYWxsYmFja3Ncblx0XHRmaXJlID0gZnVuY3Rpb24oIGNvbnRleHQsIGFyZ3MgKSB7XG5cdFx0XHRhcmdzID0gYXJncyB8fCBbXTtcblx0XHRcdG1lbW9yeSA9ICFmbGFncy5tZW1vcnkgfHwgWyBjb250ZXh0LCBhcmdzIF07XG5cdFx0XHRmaXJpbmcgPSB0cnVlO1xuXHRcdFx0ZmlyaW5nSW5kZXggPSBmaXJpbmdTdGFydCB8fCAwO1xuXHRcdFx0ZmlyaW5nU3RhcnQgPSAwO1xuXHRcdFx0ZmlyaW5nTGVuZ3RoID0gbGlzdC5sZW5ndGg7XG5cdFx0XHRmb3IgKCA7IGxpc3QgJiYgZmlyaW5nSW5kZXggPCBmaXJpbmdMZW5ndGg7IGZpcmluZ0luZGV4KysgKSB7XG5cdFx0XHRcdGlmICggbGlzdFsgZmlyaW5nSW5kZXggXS5hcHBseSggY29udGV4dCwgYXJncyApID09PSBmYWxzZSAmJiBmbGFncy5zdG9wT25GYWxzZSApIHtcblx0XHRcdFx0XHRtZW1vcnkgPSB0cnVlOyAvLyBNYXJrIGFzIGhhbHRlZFxuXHRcdFx0XHRcdGJyZWFrO1xuXHRcdFx0XHR9XG5cdFx0XHR9XG5cdFx0XHRmaXJpbmcgPSBmYWxzZTtcblx0XHRcdGlmICggbGlzdCApIHtcblx0XHRcdFx0aWYgKCAhZmxhZ3Mub25jZSApIHtcblx0XHRcdFx0XHRpZiAoIHN0YWNrICYmIHN0YWNrLmxlbmd0aCApIHtcblx0XHRcdFx0XHRcdG1lbW9yeSA9IHN0YWNrLnNoaWZ0KCk7XG5cdFx0XHRcdFx0XHRzZWxmLmZpcmVXaXRoKCBtZW1vcnlbIDAgXSwgbWVtb3J5WyAxIF0gKTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH0gZWxzZSBpZiAoIG1lbW9yeSA9PT0gdHJ1ZSApIHtcblx0XHRcdFx0XHRzZWxmLmRpc2FibGUoKTtcblx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHRsaXN0ID0gW107XG5cdFx0XHRcdH1cblx0XHRcdH1cblx0XHR9LFxuXHRcdC8vIEFjdHVhbCBDYWxsYmFja3Mgb2JqZWN0XG5cdFx0c2VsZiA9IHtcblx0XHRcdC8vIEFkZCBhIGNhbGxiYWNrIG9yIGEgY29sbGVjdGlvbiBvZiBjYWxsYmFja3MgdG8gdGhlIGxpc3Rcblx0XHRcdGFkZDogZnVuY3Rpb24oKSB7XG5cdFx0XHRcdGlmICggbGlzdCApIHtcblx0XHRcdFx0XHR2YXIgbGVuZ3RoID0gbGlzdC5sZW5ndGg7XG5cdFx0XHRcdFx0YWRkKCBhcmd1bWVudHMgKTtcblx0XHRcdFx0XHQvLyBEbyB3ZSBuZWVkIHRvIGFkZCB0aGUgY2FsbGJhY2tzIHRvIHRoZVxuXHRcdFx0XHRcdC8vIGN1cnJlbnQgZmlyaW5nIGJhdGNoP1xuXHRcdFx0XHRcdGlmICggZmlyaW5nICkge1xuXHRcdFx0XHRcdFx0ZmlyaW5nTGVuZ3RoID0gbGlzdC5sZW5ndGg7XG5cdFx0XHRcdFx0Ly8gV2l0aCBtZW1vcnksIGlmIHdlJ3JlIG5vdCBmaXJpbmcgdGhlblxuXHRcdFx0XHRcdC8vIHdlIHNob3VsZCBjYWxsIHJpZ2h0IGF3YXksIHVubGVzcyBwcmV2aW91c1xuXHRcdFx0XHRcdC8vIGZpcmluZyB3YXMgaGFsdGVkIChzdG9wT25GYWxzZSlcblx0XHRcdFx0XHR9IGVsc2UgaWYgKCBtZW1vcnkgJiYgbWVtb3J5ICE9PSB0cnVlICkge1xuXHRcdFx0XHRcdFx0ZmlyaW5nU3RhcnQgPSBsZW5ndGg7XG5cdFx0XHRcdFx0XHRmaXJlKCBtZW1vcnlbIDAgXSwgbWVtb3J5WyAxIF0gKTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH1cblx0XHRcdFx0cmV0dXJuIHRoaXM7XG5cdFx0XHR9LFxuXHRcdFx0Ly8gUmVtb3ZlIGEgY2FsbGJhY2sgZnJvbSB0aGUgbGlzdFxuXHRcdFx0cmVtb3ZlOiBmdW5jdGlvbigpIHtcblx0XHRcdFx0aWYgKCBsaXN0ICkge1xuXHRcdFx0XHRcdHZhciBhcmdzID0gYXJndW1lbnRzLFxuXHRcdFx0XHRcdFx0YXJnSW5kZXggPSAwLFxuXHRcdFx0XHRcdFx0YXJnTGVuZ3RoID0gYXJncy5sZW5ndGg7XG5cdFx0XHRcdFx0Zm9yICggOyBhcmdJbmRleCA8IGFyZ0xlbmd0aCA7IGFyZ0luZGV4KysgKSB7XG5cdFx0XHRcdFx0XHRmb3IgKCB2YXIgaSA9IDA7IGkgPCBsaXN0Lmxlbmd0aDsgaSsrICkge1xuXHRcdFx0XHRcdFx0XHRpZiAoIGFyZ3NbIGFyZ0luZGV4IF0gPT09IGxpc3RbIGkgXSApIHtcblx0XHRcdFx0XHRcdFx0XHQvLyBIYW5kbGUgZmlyaW5nSW5kZXggYW5kIGZpcmluZ0xlbmd0aFxuXHRcdFx0XHRcdFx0XHRcdGlmICggZmlyaW5nICkge1xuXHRcdFx0XHRcdFx0XHRcdFx0aWYgKCBpIDw9IGZpcmluZ0xlbmd0aCApIHtcblx0XHRcdFx0XHRcdFx0XHRcdFx0ZmlyaW5nTGVuZ3RoLS07XG5cdFx0XHRcdFx0XHRcdFx0XHRcdGlmICggaSA8PSBmaXJpbmdJbmRleCApIHtcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRmaXJpbmdJbmRleC0tO1xuXHRcdFx0XHRcdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0XHRcdC8vIFJlbW92ZSB0aGUgZWxlbWVudFxuXHRcdFx0XHRcdFx0XHRcdGxpc3Quc3BsaWNlKCBpLS0sIDEgKTtcblx0XHRcdFx0XHRcdFx0XHQvLyBJZiB3ZSBoYXZlIHNvbWUgdW5pY2l0eSBwcm9wZXJ0eSB0aGVuXG5cdFx0XHRcdFx0XHRcdFx0Ly8gd2Ugb25seSBuZWVkIHRvIGRvIHRoaXMgb25jZVxuXHRcdFx0XHRcdFx0XHRcdGlmICggZmxhZ3MudW5pcXVlICkge1xuXHRcdFx0XHRcdFx0XHRcdFx0YnJlYWs7XG5cdFx0XHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9XG5cdFx0XHRcdHJldHVybiB0aGlzO1xuXHRcdFx0fSxcblx0XHRcdC8vIENvbnRyb2wgaWYgYSBnaXZlbiBjYWxsYmFjayBpcyBpbiB0aGUgbGlzdFxuXHRcdFx0aGFzOiBmdW5jdGlvbiggZm4gKSB7XG5cdFx0XHRcdGlmICggbGlzdCApIHtcblx0XHRcdFx0XHR2YXIgaSA9IDAsXG5cdFx0XHRcdFx0XHRsZW5ndGggPSBsaXN0Lmxlbmd0aDtcblx0XHRcdFx0XHRmb3IgKCA7IGkgPCBsZW5ndGg7IGkrKyApIHtcblx0XHRcdFx0XHRcdGlmICggZm4gPT09IGxpc3RbIGkgXSApIHtcblx0XHRcdFx0XHRcdFx0cmV0dXJuIHRydWU7XG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9XG5cdFx0XHRcdHJldHVybiBmYWxzZTtcblx0XHRcdH0sXG5cdFx0XHQvLyBSZW1vdmUgYWxsIGNhbGxiYWNrcyBmcm9tIHRoZSBsaXN0XG5cdFx0XHRlbXB0eTogZnVuY3Rpb24oKSB7XG5cdFx0XHRcdGxpc3QgPSBbXTtcblx0XHRcdFx0cmV0dXJuIHRoaXM7XG5cdFx0XHR9LFxuXHRcdFx0Ly8gSGF2ZSB0aGUgbGlzdCBkbyBub3RoaW5nIGFueW1vcmVcblx0XHRcdGRpc2FibGU6IGZ1bmN0aW9uKCkge1xuXHRcdFx0XHRsaXN0ID0gc3RhY2sgPSBtZW1vcnkgPSB1bmRlZmluZWQ7XG5cdFx0XHRcdHJldHVybiB0aGlzO1xuXHRcdFx0fSxcblx0XHRcdC8vIElzIGl0IGRpc2FibGVkP1xuXHRcdFx0ZGlzYWJsZWQ6IGZ1bmN0aW9uKCkge1xuXHRcdFx0XHRyZXR1cm4gIWxpc3Q7XG5cdFx0XHR9LFxuXHRcdFx0Ly8gTG9jayB0aGUgbGlzdCBpbiBpdHMgY3VycmVudCBzdGF0ZVxuXHRcdFx0bG9jazogZnVuY3Rpb24oKSB7XG5cdFx0XHRcdHN0YWNrID0gdW5kZWZpbmVkO1xuXHRcdFx0XHRpZiAoICFtZW1vcnkgfHwgbWVtb3J5ID09PSB0cnVlICkge1xuXHRcdFx0XHRcdHNlbGYuZGlzYWJsZSgpO1xuXHRcdFx0XHR9XG5cdFx0XHRcdHJldHVybiB0aGlzO1xuXHRcdFx0fSxcblx0XHRcdC8vIElzIGl0IGxvY2tlZD9cblx0XHRcdGxvY2tlZDogZnVuY3Rpb24oKSB7XG5cdFx0XHRcdHJldHVybiAhc3RhY2s7XG5cdFx0XHR9LFxuXHRcdFx0Ly8gQ2FsbCBhbGwgY2FsbGJhY2tzIHdpdGggdGhlIGdpdmVuIGNvbnRleHQgYW5kIGFyZ3VtZW50c1xuXHRcdFx0ZmlyZVdpdGg6IGZ1bmN0aW9uKCBjb250ZXh0LCBhcmdzICkge1xuXHRcdFx0XHRpZiAoIHN0YWNrICkge1xuXHRcdFx0XHRcdGlmICggZmlyaW5nICkge1xuXHRcdFx0XHRcdFx0aWYgKCAhZmxhZ3Mub25jZSApIHtcblx0XHRcdFx0XHRcdFx0c3RhY2sucHVzaCggWyBjb250ZXh0LCBhcmdzIF0gKTtcblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHR9IGVsc2UgaWYgKCAhKCBmbGFncy5vbmNlICYmIG1lbW9yeSApICkge1xuXHRcdFx0XHRcdFx0ZmlyZSggY29udGV4dCwgYXJncyApO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0fVxuXHRcdFx0XHRyZXR1cm4gdGhpcztcblx0XHRcdH0sXG5cdFx0XHQvLyBDYWxsIGFsbCB0aGUgY2FsbGJhY2tzIHdpdGggdGhlIGdpdmVuIGFyZ3VtZW50c1xuXHRcdFx0ZmlyZTogZnVuY3Rpb24oKSB7XG5cdFx0XHRcdHNlbGYuZmlyZVdpdGgoIHRoaXMsIGFyZ3VtZW50cyApO1xuXHRcdFx0XHRyZXR1cm4gdGhpcztcblx0XHRcdH0sXG5cdFx0XHQvLyBUbyBrbm93IGlmIHRoZSBjYWxsYmFja3MgaGF2ZSBhbHJlYWR5IGJlZW4gY2FsbGVkIGF0IGxlYXN0IG9uY2Vcblx0XHRcdGZpcmVkOiBmdW5jdGlvbigpIHtcblx0XHRcdFx0cmV0dXJuICEhbWVtb3J5O1xuXHRcdFx0fVxuXHRcdH07XG5cblx0cmV0dXJuIHNlbGY7XG59O1xuXG5cblxuXG52YXIgLy8gU3RhdGljIHJlZmVyZW5jZSB0byBzbGljZVxuXHRzbGljZURlZmVycmVkID0gW10uc2xpY2U7XG5cbmpRdWVyeS5leHRlbmQoe1xuXG5cdERlZmVycmVkOiBmdW5jdGlvbiggZnVuYyApIHtcblx0XHR2YXIgZG9uZUxpc3QgPSBqUXVlcnkuQ2FsbGJhY2tzKCBcIm9uY2UgbWVtb3J5XCIgKSxcblx0XHRcdGZhaWxMaXN0ID0galF1ZXJ5LkNhbGxiYWNrcyggXCJvbmNlIG1lbW9yeVwiICksXG5cdFx0XHRwcm9ncmVzc0xpc3QgPSBqUXVlcnkuQ2FsbGJhY2tzKCBcIm1lbW9yeVwiICksXG5cdFx0XHRzdGF0ZSA9IFwicGVuZGluZ1wiLFxuXHRcdFx0bGlzdHMgPSB7XG5cdFx0XHRcdHJlc29sdmU6IGRvbmVMaXN0LFxuXHRcdFx0XHRyZWplY3Q6IGZhaWxMaXN0LFxuXHRcdFx0XHRub3RpZnk6IHByb2dyZXNzTGlzdFxuXHRcdFx0fSxcblx0XHRcdHByb21pc2UgPSB7XG5cdFx0XHRcdGRvbmU6IGRvbmVMaXN0LmFkZCxcblx0XHRcdFx0ZmFpbDogZmFpbExpc3QuYWRkLFxuXHRcdFx0XHRwcm9ncmVzczogcHJvZ3Jlc3NMaXN0LmFkZCxcblxuXHRcdFx0XHRzdGF0ZTogZnVuY3Rpb24oKSB7XG5cdFx0XHRcdFx0cmV0dXJuIHN0YXRlO1xuXHRcdFx0XHR9LFxuXG5cdFx0XHRcdC8vIERlcHJlY2F0ZWRcblx0XHRcdFx0aXNSZXNvbHZlZDogZG9uZUxpc3QuZmlyZWQsXG5cdFx0XHRcdGlzUmVqZWN0ZWQ6IGZhaWxMaXN0LmZpcmVkLFxuXG5cdFx0XHRcdHRoZW46IGZ1bmN0aW9uKCBkb25lQ2FsbGJhY2tzLCBmYWlsQ2FsbGJhY2tzLCBwcm9ncmVzc0NhbGxiYWNrcyApIHtcblx0XHRcdFx0XHRkZWZlcnJlZC5kb25lKCBkb25lQ2FsbGJhY2tzICkuZmFpbCggZmFpbENhbGxiYWNrcyApLnByb2dyZXNzKCBwcm9ncmVzc0NhbGxiYWNrcyApO1xuXHRcdFx0XHRcdHJldHVybiB0aGlzO1xuXHRcdFx0XHR9LFxuXHRcdFx0XHRhbHdheXM6IGZ1bmN0aW9uKCkge1xuXHRcdFx0XHRcdHJldHVybiBkZWZlcnJlZC5kb25lLmFwcGx5KCBkZWZlcnJlZCwgYXJndW1lbnRzICkuZmFpbC5hcHBseSggZGVmZXJyZWQsIGFyZ3VtZW50cyApO1xuXHRcdFx0XHR9LFxuXHRcdFx0XHRwaXBlOiBmdW5jdGlvbiggZm5Eb25lLCBmbkZhaWwsIGZuUHJvZ3Jlc3MgKSB7XG5cdFx0XHRcdFx0cmV0dXJuIGpRdWVyeS5EZWZlcnJlZChmdW5jdGlvbiggbmV3RGVmZXIgKSB7XG5cdFx0XHRcdFx0XHRqUXVlcnkuZWFjaCgge1xuXHRcdFx0XHRcdFx0XHRkb25lOiBbIGZuRG9uZSwgXCJyZXNvbHZlXCIgXSxcblx0XHRcdFx0XHRcdFx0ZmFpbDogWyBmbkZhaWwsIFwicmVqZWN0XCIgXSxcblx0XHRcdFx0XHRcdFx0cHJvZ3Jlc3M6IFsgZm5Qcm9ncmVzcywgXCJub3RpZnlcIiBdXG5cdFx0XHRcdFx0XHR9LCBmdW5jdGlvbiggaGFuZGxlciwgZGF0YSApIHtcblx0XHRcdFx0XHRcdFx0dmFyIGZuID0gZGF0YVsgMCBdLFxuXHRcdFx0XHRcdFx0XHRcdGFjdGlvbiA9IGRhdGFbIDEgXSxcblx0XHRcdFx0XHRcdFx0XHRyZXR1cm5lZDtcblx0XHRcdFx0XHRcdFx0aWYgKCBqUXVlcnkuaXNGdW5jdGlvbiggZm4gKSApIHtcblx0XHRcdFx0XHRcdFx0XHRkZWZlcnJlZFsgaGFuZGxlciBdKGZ1bmN0aW9uKCkge1xuXHRcdFx0XHRcdFx0XHRcdFx0cmV0dXJuZWQgPSBmbi5hcHBseSggdGhpcywgYXJndW1lbnRzICk7XG5cdFx0XHRcdFx0XHRcdFx0XHRpZiAoIHJldHVybmVkICYmIGpRdWVyeS5pc0Z1bmN0aW9uKCByZXR1cm5lZC5wcm9taXNlICkgKSB7XG5cdFx0XHRcdFx0XHRcdFx0XHRcdHJldHVybmVkLnByb21pc2UoKS50aGVuKCBuZXdEZWZlci5yZXNvbHZlLCBuZXdEZWZlci5yZWplY3QsIG5ld0RlZmVyLm5vdGlmeSApO1xuXHRcdFx0XHRcdFx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHRcdFx0XHRcdFx0bmV3RGVmZXJbIGFjdGlvbiArIFwiV2l0aFwiIF0oIHRoaXMgPT09IGRlZmVycmVkID8gbmV3RGVmZXIgOiB0aGlzLCBbIHJldHVybmVkIF0gKTtcblx0XHRcdFx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdFx0XHR9KTtcblx0XHRcdFx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHRcdFx0XHRkZWZlcnJlZFsgaGFuZGxlciBdKCBuZXdEZWZlclsgYWN0aW9uIF0gKTtcblx0XHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0fSk7XG5cdFx0XHRcdFx0fSkucHJvbWlzZSgpO1xuXHRcdFx0XHR9LFxuXHRcdFx0XHQvLyBHZXQgYSBwcm9taXNlIGZvciB0aGlzIGRlZmVycmVkXG5cdFx0XHRcdC8vIElmIG9iaiBpcyBwcm92aWRlZCwgdGhlIHByb21pc2UgYXNwZWN0IGlzIGFkZGVkIHRvIHRoZSBvYmplY3Rcblx0XHRcdFx0cHJvbWlzZTogZnVuY3Rpb24oIG9iaiApIHtcblx0XHRcdFx0XHRpZiAoIG9iaiA9PSBudWxsICkge1xuXHRcdFx0XHRcdFx0b2JqID0gcHJvbWlzZTtcblx0XHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdFx0Zm9yKCB2YXIga2V5IGluIHByb21pc2UgKSB7XG5cdFx0XHRcdFx0XHRcdG9ialsga2V5IF0gPSBwcm9taXNlWyBrZXkgXTtcblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0cmV0dXJuIG9iajtcblx0XHRcdFx0fVxuXHRcdFx0fSxcblx0XHRcdGRlZmVycmVkID0gcHJvbWlzZS5wcm9taXNlKHt9KSxcblx0XHRcdGtleTtcblxuXHRcdGZvciAoIGtleSBpbiBsaXN0cyApIHtcblx0XHRcdGRlZmVycmVkWyBrZXkgXSA9IGxpc3RzWyBrZXkgXS5maXJlO1xuXHRcdFx0ZGVmZXJyZWRbIGtleSArIFwiV2l0aFwiIF0gPSBsaXN0c1sga2V5IF0uZmlyZVdpdGg7XG5cdFx0fVxuXG5cdFx0Ly8gSGFuZGxlIHN0YXRlXG5cdFx0ZGVmZXJyZWQuZG9uZSggZnVuY3Rpb24oKSB7XG5cdFx0XHRzdGF0ZSA9IFwicmVzb2x2ZWRcIjtcblx0XHR9LCBmYWlsTGlzdC5kaXNhYmxlLCBwcm9ncmVzc0xpc3QubG9jayApLmZhaWwoIGZ1bmN0aW9uKCkge1xuXHRcdFx0c3RhdGUgPSBcInJlamVjdGVkXCI7XG5cdFx0fSwgZG9uZUxpc3QuZGlzYWJsZSwgcHJvZ3Jlc3NMaXN0LmxvY2sgKTtcblxuXHRcdC8vIENhbGwgZ2l2ZW4gZnVuYyBpZiBhbnlcblx0XHRpZiAoIGZ1bmMgKSB7XG5cdFx0XHRmdW5jLmNhbGwoIGRlZmVycmVkLCBkZWZlcnJlZCApO1xuXHRcdH1cblxuXHRcdC8vIEFsbCBkb25lIVxuXHRcdHJldHVybiBkZWZlcnJlZDtcblx0fSxcblxuXHQvLyBEZWZlcnJlZCBoZWxwZXJcblx0d2hlbjogZnVuY3Rpb24oIGZpcnN0UGFyYW0gKSB7XG5cdFx0dmFyIGFyZ3MgPSBzbGljZURlZmVycmVkLmNhbGwoIGFyZ3VtZW50cywgMCApLFxuXHRcdFx0aSA9IDAsXG5cdFx0XHRsZW5ndGggPSBhcmdzLmxlbmd0aCxcblx0XHRcdHBWYWx1ZXMgPSBuZXcgQXJyYXkoIGxlbmd0aCApLFxuXHRcdFx0Y291bnQgPSBsZW5ndGgsXG5cdFx0XHRwQ291bnQgPSBsZW5ndGgsXG5cdFx0XHRkZWZlcnJlZCA9IGxlbmd0aCA8PSAxICYmIGZpcnN0UGFyYW0gJiYgalF1ZXJ5LmlzRnVuY3Rpb24oIGZpcnN0UGFyYW0ucHJvbWlzZSApID9cblx0XHRcdFx0Zmlyc3RQYXJhbSA6XG5cdFx0XHRcdGpRdWVyeS5EZWZlcnJlZCgpLFxuXHRcdFx0cHJvbWlzZSA9IGRlZmVycmVkLnByb21pc2UoKTtcblx0XHRmdW5jdGlvbiByZXNvbHZlRnVuYyggaSApIHtcblx0XHRcdHJldHVybiBmdW5jdGlvbiggdmFsdWUgKSB7XG5cdFx0XHRcdGFyZ3NbIGkgXSA9IGFyZ3VtZW50cy5sZW5ndGggPiAxID8gc2xpY2VEZWZlcnJlZC5jYWxsKCBhcmd1bWVudHMsIDAgKSA6IHZhbHVlO1xuXHRcdFx0XHRpZiAoICEoIC0tY291bnQgKSApIHtcblx0XHRcdFx0XHRkZWZlcnJlZC5yZXNvbHZlV2l0aCggZGVmZXJyZWQsIGFyZ3MgKTtcblx0XHRcdFx0fVxuXHRcdFx0fTtcblx0XHR9XG5cdFx0ZnVuY3Rpb24gcHJvZ3Jlc3NGdW5jKCBpICkge1xuXHRcdFx0cmV0dXJuIGZ1bmN0aW9uKCB2YWx1ZSApIHtcblx0XHRcdFx0cFZhbHVlc1sgaSBdID0gYXJndW1lbnRzLmxlbmd0aCA+IDEgPyBzbGljZURlZmVycmVkLmNhbGwoIGFyZ3VtZW50cywgMCApIDogdmFsdWU7XG5cdFx0XHRcdGRlZmVycmVkLm5vdGlmeVdpdGgoIHByb21pc2UsIHBWYWx1ZXMgKTtcblx0XHRcdH07XG5cdFx0fVxuXHRcdGlmICggbGVuZ3RoID4gMSApIHtcblx0XHRcdGZvciggOyBpIDwgbGVuZ3RoOyBpKysgKSB7XG5cdFx0XHRcdGlmICggYXJnc1sgaSBdICYmIGFyZ3NbIGkgXS5wcm9taXNlICYmIGpRdWVyeS5pc0Z1bmN0aW9uKCBhcmdzWyBpIF0ucHJvbWlzZSApICkge1xuXHRcdFx0XHRcdGFyZ3NbIGkgXS5wcm9taXNlKCkudGhlbiggcmVzb2x2ZUZ1bmMoaSksIGRlZmVycmVkLnJlamVjdCwgcHJvZ3Jlc3NGdW5jKGkpICk7XG5cdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0LS1jb3VudDtcblx0XHRcdFx0fVxuXHRcdFx0fVxuXHRcdFx0aWYgKCAhY291bnQgKSB7XG5cdFx0XHRcdGRlZmVycmVkLnJlc29sdmVXaXRoKCBkZWZlcnJlZCwgYXJncyApO1xuXHRcdFx0fVxuXHRcdH0gZWxzZSBpZiAoIGRlZmVycmVkICE9PSBmaXJzdFBhcmFtICkge1xuXHRcdFx0ZGVmZXJyZWQucmVzb2x2ZVdpdGgoIGRlZmVycmVkLCBsZW5ndGggPyBbIGZpcnN0UGFyYW0gXSA6IFtdICk7XG5cdFx0fVxuXHRcdHJldHVybiBwcm9taXNlO1xuXHR9XG59KTtcblxuXG5cblxualF1ZXJ5LnN1cHBvcnQgPSAoZnVuY3Rpb24oKSB7XG5cblx0dmFyIGRpdiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoIFwiZGl2XCIgKSxcblx0XHRkb2N1bWVudEVsZW1lbnQgPSBkb2N1bWVudC5kb2N1bWVudEVsZW1lbnQsXG5cdFx0YWxsLFxuXHRcdGEsXG5cdFx0c2VsZWN0LFxuXHRcdG9wdCxcblx0XHRpbnB1dCxcblx0XHRtYXJnaW5EaXYsXG5cdFx0c3VwcG9ydCxcblx0XHRmcmFnbWVudCxcblx0XHRib2R5LFxuXHRcdHRlc3RFbGVtZW50UGFyZW50LFxuXHRcdHRlc3RFbGVtZW50LFxuXHRcdHRlc3RFbGVtZW50U3R5bGUsXG5cdFx0dGRzLFxuXHRcdGV2ZW50cyxcblx0XHRldmVudE5hbWUsXG5cdFx0aSxcblx0XHRpc1N1cHBvcnRlZCxcblx0XHRvZmZzZXRTdXBwb3J0O1xuXG5cdC8vIFByZWxpbWluYXJ5IHRlc3RzXG5cdGRpdi5zZXRBdHRyaWJ1dGUoXCJjbGFzc05hbWVcIiwgXCJ0XCIpO1xuXHRkaXYuaW5uZXJIVE1MID0gXCIgICA8bGluay8+PHRhYmxlPjwvdGFibGU+PGEgaHJlZj0nL2EnIHN0eWxlPSd0b3A6MXB4O2Zsb2F0OmxlZnQ7b3BhY2l0eTouNTU7Jz5hPC9hPjxpbnB1dCB0eXBlPSdjaGVja2JveCcvPjxuYXY+PC9uYXY+XCI7XG5cblxuXHRhbGwgPSBkaXYuZ2V0RWxlbWVudHNCeVRhZ05hbWUoIFwiKlwiICk7XG5cdGEgPSBkaXYuZ2V0RWxlbWVudHNCeVRhZ05hbWUoIFwiYVwiIClbIDAgXTtcblxuXHQvLyBDYW4ndCBnZXQgYmFzaWMgdGVzdCBzdXBwb3J0XG5cdGlmICggIWFsbCB8fCAhYWxsLmxlbmd0aCB8fCAhYSApIHtcblx0XHRyZXR1cm4ge307XG5cdH1cblxuXHQvLyBGaXJzdCBiYXRjaCBvZiBzdXBwb3J0cyB0ZXN0c1xuXHRzZWxlY3QgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCBcInNlbGVjdFwiICk7XG5cdG9wdCA9IHNlbGVjdC5hcHBlbmRDaGlsZCggZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcIm9wdGlvblwiKSApO1xuXHRpbnB1dCA9IGRpdi5nZXRFbGVtZW50c0J5VGFnTmFtZSggXCJpbnB1dFwiIClbIDAgXTtcblxuXHRzdXBwb3J0ID0ge1xuXHRcdC8vIElFIHN0cmlwcyBsZWFkaW5nIHdoaXRlc3BhY2Ugd2hlbiAuaW5uZXJIVE1MIGlzIHVzZWRcblx0XHRsZWFkaW5nV2hpdGVzcGFjZTogKCBkaXYuZmlyc3RDaGlsZC5ub2RlVHlwZSA9PT0gMyApLFxuXG5cdFx0Ly8gTWFrZSBzdXJlIHRoYXQgdGJvZHkgZWxlbWVudHMgYXJlbid0IGF1dG9tYXRpY2FsbHkgaW5zZXJ0ZWRcblx0XHQvLyBJRSB3aWxsIGluc2VydCB0aGVtIGludG8gZW1wdHkgdGFibGVzXG5cdFx0dGJvZHk6ICFkaXYuZ2V0RWxlbWVudHNCeVRhZ05hbWUoIFwidGJvZHlcIiApLmxlbmd0aCxcblxuXHRcdC8vIE1ha2Ugc3VyZSB0aGF0IGxpbmsgZWxlbWVudHMgZ2V0IHNlcmlhbGl6ZWQgY29ycmVjdGx5IGJ5IGlubmVySFRNTFxuXHRcdC8vIFRoaXMgcmVxdWlyZXMgYSB3cmFwcGVyIGVsZW1lbnQgaW4gSUVcblx0XHRodG1sU2VyaWFsaXplOiAhIWRpdi5nZXRFbGVtZW50c0J5VGFnTmFtZSggXCJsaW5rXCIgKS5sZW5ndGgsXG5cblx0XHQvLyBHZXQgdGhlIHN0eWxlIGluZm9ybWF0aW9uIGZyb20gZ2V0QXR0cmlidXRlXG5cdFx0Ly8gKElFIHVzZXMgLmNzc1RleHQgaW5zdGVhZClcblx0XHRzdHlsZTogL3RvcC8udGVzdCggYS5nZXRBdHRyaWJ1dGUoXCJzdHlsZVwiKSApLFxuXG5cdFx0Ly8gTWFrZSBzdXJlIHRoYXQgVVJMcyBhcmVuJ3QgbWFuaXB1bGF0ZWRcblx0XHQvLyAoSUUgbm9ybWFsaXplcyBpdCBieSBkZWZhdWx0KVxuXHRcdGhyZWZOb3JtYWxpemVkOiAoIGEuZ2V0QXR0cmlidXRlKCBcImhyZWZcIiApID09PSBcIi9hXCIgKSxcblxuXHRcdC8vIE1ha2Ugc3VyZSB0aGF0IGVsZW1lbnQgb3BhY2l0eSBleGlzdHNcblx0XHQvLyAoSUUgdXNlcyBmaWx0ZXIgaW5zdGVhZClcblx0XHQvLyBVc2UgYSByZWdleCB0byB3b3JrIGFyb3VuZCBhIFdlYktpdCBpc3N1ZS4gU2VlICM1MTQ1XG5cdFx0b3BhY2l0eTogL14wLjU1Ly50ZXN0KCBhLnN0eWxlLm9wYWNpdHkgKSxcblxuXHRcdC8vIFZlcmlmeSBzdHlsZSBmbG9hdCBleGlzdGVuY2Vcblx0XHQvLyAoSUUgdXNlcyBzdHlsZUZsb2F0IGluc3RlYWQgb2YgY3NzRmxvYXQpXG5cdFx0Y3NzRmxvYXQ6ICEhYS5zdHlsZS5jc3NGbG9hdCxcblxuXHRcdC8vIE1ha2Ugc3VyZSB1bmtub3duIGVsZW1lbnRzIChsaWtlIEhUTUw1IGVsZW1zKSBhcmUgaGFuZGxlZCBhcHByb3ByaWF0ZWx5XG5cdFx0dW5rbm93bkVsZW1zOiAhIWRpdi5nZXRFbGVtZW50c0J5VGFnTmFtZSggXCJuYXZcIiApLmxlbmd0aCxcblxuXHRcdC8vIE1ha2Ugc3VyZSB0aGF0IGlmIG5vIHZhbHVlIGlzIHNwZWNpZmllZCBmb3IgYSBjaGVja2JveFxuXHRcdC8vIHRoYXQgaXQgZGVmYXVsdHMgdG8gXCJvblwiLlxuXHRcdC8vIChXZWJLaXQgZGVmYXVsdHMgdG8gXCJcIiBpbnN0ZWFkKVxuXHRcdGNoZWNrT246ICggaW5wdXQudmFsdWUgPT09IFwib25cIiApLFxuXG5cdFx0Ly8gTWFrZSBzdXJlIHRoYXQgYSBzZWxlY3RlZC1ieS1kZWZhdWx0IG9wdGlvbiBoYXMgYSB3b3JraW5nIHNlbGVjdGVkIHByb3BlcnR5LlxuXHRcdC8vIChXZWJLaXQgZGVmYXVsdHMgdG8gZmFsc2UgaW5zdGVhZCBvZiB0cnVlLCBJRSB0b28sIGlmIGl0J3MgaW4gYW4gb3B0Z3JvdXApXG5cdFx0b3B0U2VsZWN0ZWQ6IG9wdC5zZWxlY3RlZCxcblxuXHRcdC8vIFRlc3Qgc2V0QXR0cmlidXRlIG9uIGNhbWVsQ2FzZSBjbGFzcy4gSWYgaXQgd29ya3MsIHdlIG5lZWQgYXR0ckZpeGVzIHdoZW4gZG9pbmcgZ2V0L3NldEF0dHJpYnV0ZSAoaWU2LzcpXG5cdFx0Z2V0U2V0QXR0cmlidXRlOiBkaXYuY2xhc3NOYW1lICE9PSBcInRcIixcblxuXHRcdC8vIFdpbGwgYmUgZGVmaW5lZCBsYXRlclxuXHRcdHN1Ym1pdEJ1YmJsZXM6IHRydWUsXG5cdFx0Y2hhbmdlQnViYmxlczogdHJ1ZSxcblx0XHRmb2N1c2luQnViYmxlczogZmFsc2UsXG5cdFx0ZGVsZXRlRXhwYW5kbzogdHJ1ZSxcblx0XHRub0Nsb25lRXZlbnQ6IHRydWUsXG5cdFx0aW5saW5lQmxvY2tOZWVkc0xheW91dDogZmFsc2UsXG5cdFx0c2hyaW5rV3JhcEJsb2NrczogZmFsc2UsXG5cdFx0cmVsaWFibGVNYXJnaW5SaWdodDogdHJ1ZVxuXHR9O1xuXG5cdC8vIE1ha2Ugc3VyZSBjaGVja2VkIHN0YXR1cyBpcyBwcm9wZXJseSBjbG9uZWRcblx0aW5wdXQuY2hlY2tlZCA9IHRydWU7XG5cdHN1cHBvcnQubm9DbG9uZUNoZWNrZWQgPSBpbnB1dC5jbG9uZU5vZGUoIHRydWUgKS5jaGVja2VkO1xuXG5cdC8vIE1ha2Ugc3VyZSB0aGF0IHRoZSBvcHRpb25zIGluc2lkZSBkaXNhYmxlZCBzZWxlY3RzIGFyZW4ndCBtYXJrZWQgYXMgZGlzYWJsZWRcblx0Ly8gKFdlYktpdCBtYXJrcyB0aGVtIGFzIGRpc2FibGVkKVxuXHRzZWxlY3QuZGlzYWJsZWQgPSB0cnVlO1xuXHRzdXBwb3J0Lm9wdERpc2FibGVkID0gIW9wdC5kaXNhYmxlZDtcblxuXHQvLyBUZXN0IHRvIHNlZSBpZiBpdCdzIHBvc3NpYmxlIHRvIGRlbGV0ZSBhbiBleHBhbmRvIGZyb20gYW4gZWxlbWVudFxuXHQvLyBGYWlscyBpbiBJbnRlcm5ldCBFeHBsb3JlclxuXHR0cnkge1xuXHRcdGRlbGV0ZSBkaXYudGVzdDtcblx0fSBjYXRjaCggZSApIHtcblx0XHRzdXBwb3J0LmRlbGV0ZUV4cGFuZG8gPSBmYWxzZTtcblx0fVxuXG5cdGlmICggIWRpdi5hZGRFdmVudExpc3RlbmVyICYmIGRpdi5hdHRhY2hFdmVudCAmJiBkaXYuZmlyZUV2ZW50ICkge1xuXHRcdGRpdi5hdHRhY2hFdmVudCggXCJvbmNsaWNrXCIsIGZ1bmN0aW9uKCkge1xuXHRcdFx0Ly8gQ2xvbmluZyBhIG5vZGUgc2hvdWxkbid0IGNvcHkgb3ZlciBhbnlcblx0XHRcdC8vIGJvdW5kIGV2ZW50IGhhbmRsZXJzIChJRSBkb2VzIHRoaXMpXG5cdFx0XHRzdXBwb3J0Lm5vQ2xvbmVFdmVudCA9IGZhbHNlO1xuXHRcdH0pO1xuXHRcdGRpdi5jbG9uZU5vZGUoIHRydWUgKS5maXJlRXZlbnQoIFwib25jbGlja1wiICk7XG5cdH1cblxuXHQvLyBDaGVjayBpZiBhIHJhZGlvIG1haW50YWlucyBpdHMgdmFsdWVcblx0Ly8gYWZ0ZXIgYmVpbmcgYXBwZW5kZWQgdG8gdGhlIERPTVxuXHRpbnB1dCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJpbnB1dFwiKTtcblx0aW5wdXQudmFsdWUgPSBcInRcIjtcblx0aW5wdXQuc2V0QXR0cmlidXRlKFwidHlwZVwiLCBcInJhZGlvXCIpO1xuXHRzdXBwb3J0LnJhZGlvVmFsdWUgPSBpbnB1dC52YWx1ZSA9PT0gXCJ0XCI7XG5cblx0aW5wdXQuc2V0QXR0cmlidXRlKFwiY2hlY2tlZFwiLCBcImNoZWNrZWRcIik7XG5cdGRpdi5hcHBlbmRDaGlsZCggaW5wdXQgKTtcblx0ZnJhZ21lbnQgPSBkb2N1bWVudC5jcmVhdGVEb2N1bWVudEZyYWdtZW50KCk7XG5cdGZyYWdtZW50LmFwcGVuZENoaWxkKCBkaXYuZmlyc3RDaGlsZCApO1xuXG5cdC8vIFdlYktpdCBkb2Vzbid0IGNsb25lIGNoZWNrZWQgc3RhdGUgY29ycmVjdGx5IGluIGZyYWdtZW50c1xuXHRzdXBwb3J0LmNoZWNrQ2xvbmUgPSBmcmFnbWVudC5jbG9uZU5vZGUoIHRydWUgKS5jbG9uZU5vZGUoIHRydWUgKS5sYXN0Q2hpbGQuY2hlY2tlZDtcblxuXHRkaXYuaW5uZXJIVE1MID0gXCJcIjtcblxuXHQvLyBGaWd1cmUgb3V0IGlmIHRoZSBXM0MgYm94IG1vZGVsIHdvcmtzIGFzIGV4cGVjdGVkXG5cdGRpdi5zdHlsZS53aWR0aCA9IGRpdi5zdHlsZS5wYWRkaW5nTGVmdCA9IFwiMXB4XCI7XG5cblx0Ly8gV2UgZG9uJ3Qgd2FudCB0byBkbyBib2R5LXJlbGF0ZWQgZmVhdHVyZSB0ZXN0cyBvbiBmcmFtZXNldFxuXHQvLyBkb2N1bWVudHMsIHdoaWNoIGxhY2sgYSBib2R5LiBTbyB3ZSB1c2Vcblx0Ly8gZG9jdW1lbnQuZ2V0RWxlbWVudHNCeVRhZ05hbWUoXCJib2R5XCIpWzBdLCB3aGljaCBpcyB1bmRlZmluZWQgaW5cblx0Ly8gZnJhbWVzZXQgZG9jdW1lbnRzLCB3aGlsZSBkb2N1bWVudC5ib2R5IGlzbuKAmXQuICg3Mzk4KVxuXHRib2R5ID0gZG9jdW1lbnQuZ2V0RWxlbWVudHNCeVRhZ05hbWUoXCJib2R5XCIpWyAwIF07XG5cdC8vIFdlIHVzZSBvdXIgb3duLCBpbnZpc2libGUsIGJvZHkgdW5sZXNzIHRoZSBib2R5IGlzIGFscmVhZHkgcHJlc2VudFxuXHQvLyBpbiB3aGljaCBjYXNlIHdlIHVzZSBhIGRpdiAoIzkyMzkpXG5cdHRlc3RFbGVtZW50ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCggYm9keSA/IFwiZGl2XCIgOiBcImJvZHlcIiApO1xuXHR0ZXN0RWxlbWVudFN0eWxlID0ge1xuXHRcdHZpc2liaWxpdHk6IFwiaGlkZGVuXCIsXG5cdFx0d2lkdGg6IDAsXG5cdFx0aGVpZ2h0OiAwLFxuXHRcdGJvcmRlcjogMCxcblx0XHRtYXJnaW46IDAsXG5cdFx0YmFja2dyb3VuZDogXCJub25lXCJcblx0fTtcblx0aWYgKCBib2R5ICkge1xuXHRcdGpRdWVyeS5leHRlbmQoIHRlc3RFbGVtZW50U3R5bGUsIHtcblx0XHRcdHBvc2l0aW9uOiBcImFic29sdXRlXCIsXG5cdFx0XHRsZWZ0OiBcIi05OTlweFwiLFxuXHRcdFx0dG9wOiBcIi05OTlweFwiXG5cdFx0fSk7XG5cdH1cblx0Zm9yICggaSBpbiB0ZXN0RWxlbWVudFN0eWxlICkge1xuXHRcdHRlc3RFbGVtZW50LnN0eWxlWyBpIF0gPSB0ZXN0RWxlbWVudFN0eWxlWyBpIF07XG5cdH1cblx0dGVzdEVsZW1lbnQuYXBwZW5kQ2hpbGQoIGRpdiApO1xuXHR0ZXN0RWxlbWVudFBhcmVudCA9IGJvZHkgfHwgZG9jdW1lbnRFbGVtZW50O1xuXHR0ZXN0RWxlbWVudFBhcmVudC5pbnNlcnRCZWZvcmUoIHRlc3RFbGVtZW50LCB0ZXN0RWxlbWVudFBhcmVudC5maXJzdENoaWxkICk7XG5cblx0Ly8gQ2hlY2sgaWYgYSBkaXNjb25uZWN0ZWQgY2hlY2tib3ggd2lsbCByZXRhaW4gaXRzIGNoZWNrZWRcblx0Ly8gdmFsdWUgb2YgdHJ1ZSBhZnRlciBhcHBlbmRlZCB0byB0aGUgRE9NIChJRTYvNylcblx0c3VwcG9ydC5hcHBlbmRDaGVja2VkID0gaW5wdXQuY2hlY2tlZDtcblxuXHRzdXBwb3J0LmJveE1vZGVsID0gZGl2Lm9mZnNldFdpZHRoID09PSAyO1xuXG5cdGlmICggXCJ6b29tXCIgaW4gZGl2LnN0eWxlICkge1xuXHRcdC8vIENoZWNrIGlmIG5hdGl2ZWx5IGJsb2NrLWxldmVsIGVsZW1lbnRzIGFjdCBsaWtlIGlubGluZS1ibG9ja1xuXHRcdC8vIGVsZW1lbnRzIHdoZW4gc2V0dGluZyB0aGVpciBkaXNwbGF5IHRvICdpbmxpbmUnIGFuZCBnaXZpbmdcblx0XHQvLyB0aGVtIGxheW91dFxuXHRcdC8vIChJRSA8IDggZG9lcyB0aGlzKVxuXHRcdGRpdi5zdHlsZS5kaXNwbGF5ID0gXCJpbmxpbmVcIjtcblx0XHRkaXYuc3R5bGUuem9vbSA9IDE7XG5cdFx0c3VwcG9ydC5pbmxpbmVCbG9ja05lZWRzTGF5b3V0ID0gKCBkaXYub2Zmc2V0V2lkdGggPT09IDIgKTtcblxuXHRcdC8vIENoZWNrIGlmIGVsZW1lbnRzIHdpdGggbGF5b3V0IHNocmluay13cmFwIHRoZWlyIGNoaWxkcmVuXG5cdFx0Ly8gKElFIDYgZG9lcyB0aGlzKVxuXHRcdGRpdi5zdHlsZS5kaXNwbGF5ID0gXCJcIjtcblx0XHRkaXYuaW5uZXJIVE1MID0gXCI8ZGl2IHN0eWxlPSd3aWR0aDo0cHg7Jz48L2Rpdj5cIjtcblx0XHRzdXBwb3J0LnNocmlua1dyYXBCbG9ja3MgPSAoIGRpdi5vZmZzZXRXaWR0aCAhPT0gMiApO1xuXHR9XG5cblx0ZGl2LmlubmVySFRNTCA9IFwiPHRhYmxlPjx0cj48dGQgc3R5bGU9J3BhZGRpbmc6MDtib3JkZXI6MDtkaXNwbGF5Om5vbmUnPjwvdGQ+PHRkPnQ8L3RkPjwvdHI+PC90YWJsZT5cIjtcblx0dGRzID0gZGl2LmdldEVsZW1lbnRzQnlUYWdOYW1lKCBcInRkXCIgKTtcblxuXHQvLyBDaGVjayBpZiB0YWJsZSBjZWxscyBzdGlsbCBoYXZlIG9mZnNldFdpZHRoL0hlaWdodCB3aGVuIHRoZXkgYXJlIHNldFxuXHQvLyB0byBkaXNwbGF5Om5vbmUgYW5kIHRoZXJlIGFyZSBzdGlsbCBvdGhlciB2aXNpYmxlIHRhYmxlIGNlbGxzIGluIGFcblx0Ly8gdGFibGUgcm93OyBpZiBzbywgb2Zmc2V0V2lkdGgvSGVpZ2h0IGFyZSBub3QgcmVsaWFibGUgZm9yIHVzZSB3aGVuXG5cdC8vIGRldGVybWluaW5nIGlmIGFuIGVsZW1lbnQgaGFzIGJlZW4gaGlkZGVuIGRpcmVjdGx5IHVzaW5nXG5cdC8vIGRpc3BsYXk6bm9uZSAoaXQgaXMgc3RpbGwgc2FmZSB0byB1c2Ugb2Zmc2V0cyBpZiBhIHBhcmVudCBlbGVtZW50IGlzXG5cdC8vIGhpZGRlbjsgZG9uIHNhZmV0eSBnb2dnbGVzIGFuZCBzZWUgYnVnICM0NTEyIGZvciBtb3JlIGluZm9ybWF0aW9uKS5cblx0Ly8gKG9ubHkgSUUgOCBmYWlscyB0aGlzIHRlc3QpXG5cdGlzU3VwcG9ydGVkID0gKCB0ZHNbIDAgXS5vZmZzZXRIZWlnaHQgPT09IDAgKTtcblxuXHR0ZHNbIDAgXS5zdHlsZS5kaXNwbGF5ID0gXCJcIjtcblx0dGRzWyAxIF0uc3R5bGUuZGlzcGxheSA9IFwibm9uZVwiO1xuXG5cdC8vIENoZWNrIGlmIGVtcHR5IHRhYmxlIGNlbGxzIHN0aWxsIGhhdmUgb2Zmc2V0V2lkdGgvSGVpZ2h0XG5cdC8vIChJRSA8IDggZmFpbCB0aGlzIHRlc3QpXG5cdHN1cHBvcnQucmVsaWFibGVIaWRkZW5PZmZzZXRzID0gaXNTdXBwb3J0ZWQgJiYgKCB0ZHNbIDAgXS5vZmZzZXRIZWlnaHQgPT09IDAgKTtcblx0ZGl2LmlubmVySFRNTCA9IFwiXCI7XG5cblx0Ly8gQ2hlY2sgaWYgZGl2IHdpdGggZXhwbGljaXQgd2lkdGggYW5kIG5vIG1hcmdpbi1yaWdodCBpbmNvcnJlY3RseVxuXHQvLyBnZXRzIGNvbXB1dGVkIG1hcmdpbi1yaWdodCBiYXNlZCBvbiB3aWR0aCBvZiBjb250YWluZXIuIEZvciBtb3JlXG5cdC8vIGluZm8gc2VlIGJ1ZyAjMzMzM1xuXHQvLyBGYWlscyBpbiBXZWJLaXQgYmVmb3JlIEZlYiAyMDExIG5pZ2h0bGllc1xuXHQvLyBXZWJLaXQgQnVnIDEzMzQzIC0gZ2V0Q29tcHV0ZWRTdHlsZSByZXR1cm5zIHdyb25nIHZhbHVlIGZvciBtYXJnaW4tcmlnaHRcblx0aWYgKCBkb2N1bWVudC5kZWZhdWx0VmlldyAmJiBkb2N1bWVudC5kZWZhdWx0Vmlldy5nZXRDb21wdXRlZFN0eWxlICkge1xuXHRcdG1hcmdpbkRpdiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoIFwiZGl2XCIgKTtcblx0XHRtYXJnaW5EaXYuc3R5bGUud2lkdGggPSBcIjBcIjtcblx0XHRtYXJnaW5EaXYuc3R5bGUubWFyZ2luUmlnaHQgPSBcIjBcIjtcblx0XHRkaXYuYXBwZW5kQ2hpbGQoIG1hcmdpbkRpdiApO1xuXHRcdHN1cHBvcnQucmVsaWFibGVNYXJnaW5SaWdodCA9XG5cdFx0XHQoIHBhcnNlSW50KCAoIGRvY3VtZW50LmRlZmF1bHRWaWV3LmdldENvbXB1dGVkU3R5bGUoIG1hcmdpbkRpdiwgbnVsbCApIHx8IHsgbWFyZ2luUmlnaHQ6IDAgfSApLm1hcmdpblJpZ2h0LCAxMCApIHx8IDAgKSA9PT0gMDtcblx0fVxuXG5cdC8vIFJlbW92ZSB0aGUgYm9keSBlbGVtZW50IHdlIGFkZGVkXG5cdHRlc3RFbGVtZW50LmlubmVySFRNTCA9IFwiXCI7XG5cblx0Ly8gVGVjaG5pcXVlIGZyb20gSnVyaXkgWmF5dHNldlxuXHQvLyBodHRwOi8vcGVyZmVjdGlvbmtpbGxzLmNvbS9kZXRlY3RpbmctZXZlbnQtc3VwcG9ydC13aXRob3V0LWJyb3dzZXItc25pZmZpbmcvXG5cdC8vIFdlIG9ubHkgY2FyZSBhYm91dCB0aGUgY2FzZSB3aGVyZSBub24tc3RhbmRhcmQgZXZlbnQgc3lzdGVtc1xuXHQvLyBhcmUgdXNlZCwgbmFtZWx5IGluIElFLiBTaG9ydC1jaXJjdWl0aW5nIGhlcmUgaGVscHMgdXMgdG9cblx0Ly8gYXZvaWQgYW4gZXZhbCBjYWxsIChpbiBzZXRBdHRyaWJ1dGUpIHdoaWNoIGNhbiBjYXVzZSBDU1Bcblx0Ly8gdG8gZ28gaGF5d2lyZS4gU2VlOiBodHRwczovL2RldmVsb3Blci5tb3ppbGxhLm9yZy9lbi9TZWN1cml0eS9DU1Bcblx0aWYgKCBkaXYuYXR0YWNoRXZlbnQgKSB7XG5cdFx0Zm9yKCBpIGluIHtcblx0XHRcdHN1Ym1pdDogMSxcblx0XHRcdGNoYW5nZTogMSxcblx0XHRcdGZvY3VzaW46IDFcblx0XHR9ICkge1xuXHRcdFx0ZXZlbnROYW1lID0gXCJvblwiICsgaTtcblx0XHRcdGlzU3VwcG9ydGVkID0gKCBldmVudE5hbWUgaW4gZGl2ICk7XG5cdFx0XHRpZiAoICFpc1N1cHBvcnRlZCApIHtcblx0XHRcdFx0ZGl2LnNldEF0dHJpYnV0ZSggZXZlbnROYW1lLCBcInJldHVybjtcIiApO1xuXHRcdFx0XHRpc1N1cHBvcnRlZCA9ICggdHlwZW9mIGRpdlsgZXZlbnROYW1lIF0gPT09IFwiZnVuY3Rpb25cIiApO1xuXHRcdFx0fVxuXHRcdFx0c3VwcG9ydFsgaSArIFwiQnViYmxlc1wiIF0gPSBpc1N1cHBvcnRlZDtcblx0XHR9XG5cdH1cblxuXHQvLyBEZXRlcm1pbmUgZml4ZWQtcG9zaXRpb24gc3VwcG9ydCBlYXJseVxuXHR0ZXN0RWxlbWVudC5zdHlsZS5wb3NpdGlvbiA9IFwic3RhdGljXCI7XG5cdHRlc3RFbGVtZW50LnN0eWxlLnRvcCA9IFwiMHB4XCI7XG5cdHRlc3RFbGVtZW50LnN0eWxlLm1hcmdpblRvcCA9IFwiMXB4XCI7XG5cdG9mZnNldFN1cHBvcnQgPSAoZnVuY3Rpb24oIGJvZHksIGNvbnRhaW5lciApIHtcblxuXHRcdHZhciBvdXRlciwgaW5uZXIsIHRhYmxlLCB0ZCwgc3VwcG9ydHMsXG5cdFx0XHRib2R5TWFyZ2luVG9wID0gcGFyc2VGbG9hdCggYm9keS5zdHlsZS5tYXJnaW5Ub3AgKSB8fCAwLFxuXHRcdFx0cHRsbSA9IFwicG9zaXRpb246YWJzb2x1dGU7dG9wOjA7bGVmdDowO3dpZHRoOjFweDtoZWlnaHQ6MXB4O21hcmdpbjowO1wiLFxuXHRcdFx0c3R5bGUgPSBcInN0eWxlPSdcIiArIHB0bG0gKyBcImJvcmRlcjo1cHggc29saWQgIzAwMDtwYWRkaW5nOjA7J1wiLFxuXHRcdFx0aHRtbCA9IFwiPGRpdiBcIiArIHN0eWxlICsgXCI+PGRpdj48L2Rpdj48L2Rpdj5cIiArXG5cdFx0XHRcdFx0XHRcdFwiPHRhYmxlIFwiICsgc3R5bGUgKyBcIiBjZWxscGFkZGluZz0nMCcgY2VsbHNwYWNpbmc9JzAnPlwiICtcblx0XHRcdFx0XHRcdFx0XCI8dHI+PHRkPjwvdGQ+PC90cj48L3RhYmxlPlwiO1xuXG5cdFx0Y29udGFpbmVyLnN0eWxlLmNzc1RleHQgPSBwdGxtICsgXCJib3JkZXI6MDt2aXNpYmlsaXR5OmhpZGRlblwiO1xuXG5cdFx0Y29udGFpbmVyLmlubmVySFRNTCA9IGh0bWw7XG5cdFx0Ym9keS5pbnNlcnRCZWZvcmUoIGNvbnRhaW5lciwgYm9keS5maXJzdENoaWxkICk7XG5cdFx0b3V0ZXIgPSBjb250YWluZXIuZmlyc3RDaGlsZDtcblx0XHRpbm5lciA9IG91dGVyLmZpcnN0Q2hpbGQ7XG5cdFx0dGQgPSBvdXRlci5uZXh0U2libGluZy5maXJzdENoaWxkLmZpcnN0Q2hpbGQ7XG5cblx0XHRzdXBwb3J0cyA9IHtcblx0XHRcdGRvZXNOb3RBZGRCb3JkZXI6IChpbm5lci5vZmZzZXRUb3AgIT09IDUpLFxuXHRcdFx0ZG9lc0FkZEJvcmRlckZvclRhYmxlQW5kQ2VsbHM6ICh0ZC5vZmZzZXRUb3AgPT09IDUpXG5cdFx0fTtcblxuXHRcdGlubmVyLnN0eWxlLnBvc2l0aW9uID0gXCJmaXhlZFwiO1xuXHRcdGlubmVyLnN0eWxlLnRvcCA9IFwiMjBweFwiO1xuXG5cdFx0Ly8gc2FmYXJpIHN1YnRyYWN0cyBwYXJlbnQgYm9yZGVyIHdpZHRoIGhlcmUgd2hpY2ggaXMgNXB4XG5cdFx0c3VwcG9ydHMuc3VwcG9ydHNGaXhlZFBvc2l0aW9uID0gKGlubmVyLm9mZnNldFRvcCA9PT0gMjAgfHwgaW5uZXIub2Zmc2V0VG9wID09PSAxNSk7XG5cdFx0aW5uZXIuc3R5bGUucG9zaXRpb24gPSBpbm5lci5zdHlsZS50b3AgPSBcIlwiO1xuXG5cdFx0b3V0ZXIuc3R5bGUub3ZlcmZsb3cgPSBcImhpZGRlblwiO1xuXHRcdG91dGVyLnN0eWxlLnBvc2l0aW9uID0gXCJyZWxhdGl2ZVwiO1xuXG5cdFx0c3VwcG9ydHMuc3VidHJhY3RzQm9yZGVyRm9yT3ZlcmZsb3dOb3RWaXNpYmxlID0gKGlubmVyLm9mZnNldFRvcCA9PT0gLTUpO1xuXHRcdHN1cHBvcnRzLmRvZXNOb3RJbmNsdWRlTWFyZ2luSW5Cb2R5T2Zmc2V0ID0gKGJvZHkub2Zmc2V0VG9wICE9PSBib2R5TWFyZ2luVG9wKTtcblxuXHRcdHJldHVybiBzdXBwb3J0cztcblxuXHR9KSggdGVzdEVsZW1lbnQsIGRpdiApO1xuXG5cdGpRdWVyeS5leHRlbmQoIHN1cHBvcnQsIG9mZnNldFN1cHBvcnQgKTtcblx0dGVzdEVsZW1lbnRQYXJlbnQucmVtb3ZlQ2hpbGQoIHRlc3RFbGVtZW50ICk7XG5cblx0Ly8gTnVsbCBjb25uZWN0ZWQgZWxlbWVudHMgdG8gYXZvaWQgbGVha3MgaW4gSUVcblx0dGVzdEVsZW1lbnQgPSBmcmFnbWVudCA9IHNlbGVjdCA9IG9wdCA9IGJvZHkgPSBtYXJnaW5EaXYgPSBkaXYgPSBpbnB1dCA9IG51bGw7XG5cblx0cmV0dXJuIHN1cHBvcnQ7XG59KSgpO1xuXG4vLyBLZWVwIHRyYWNrIG9mIGJveE1vZGVsXG5qUXVlcnkuYm94TW9kZWwgPSBqUXVlcnkuc3VwcG9ydC5ib3hNb2RlbDtcblxuXG5cblxudmFyIHJicmFjZSA9IC9eKD86XFx7LipcXH18XFxbLipcXF0pJC8sXG5cdHJtdWx0aURhc2ggPSAvKFtBLVpdKS9nO1xuXG5qUXVlcnkuZXh0ZW5kKHtcblx0Y2FjaGU6IHt9LFxuXG5cdC8vIFBsZWFzZSB1c2Ugd2l0aCBjYXV0aW9uXG5cdHV1aWQ6IDAsXG5cblx0Ly8gVW5pcXVlIGZvciBlYWNoIGNvcHkgb2YgalF1ZXJ5IG9uIHRoZSBwYWdlXG5cdC8vIE5vbi1kaWdpdHMgcmVtb3ZlZCB0byBtYXRjaCByaW5saW5lalF1ZXJ5XG5cdGV4cGFuZG86IFwialF1ZXJ5XCIgKyAoIGpRdWVyeS5mbi5qcXVlcnkgKyBNYXRoLnJhbmRvbSgpICkucmVwbGFjZSggL1xcRC9nLCBcIlwiICksXG5cblx0Ly8gVGhlIGZvbGxvd2luZyBlbGVtZW50cyB0aHJvdyB1bmNhdGNoYWJsZSBleGNlcHRpb25zIGlmIHlvdVxuXHQvLyBhdHRlbXB0IHRvIGFkZCBleHBhbmRvIHByb3BlcnRpZXMgdG8gdGhlbS5cblx0bm9EYXRhOiB7XG5cdFx0XCJlbWJlZFwiOiB0cnVlLFxuXHRcdC8vIEJhbiBhbGwgb2JqZWN0cyBleGNlcHQgZm9yIEZsYXNoICh3aGljaCBoYW5kbGUgZXhwYW5kb3MpXG5cdFx0XCJvYmplY3RcIjogXCJjbHNpZDpEMjdDREI2RS1BRTZELTExY2YtOTZCOC00NDQ1NTM1NDAwMDBcIixcblx0XHRcImFwcGxldFwiOiB0cnVlXG5cdH0sXG5cblx0aGFzRGF0YTogZnVuY3Rpb24oIGVsZW0gKSB7XG5cdFx0ZWxlbSA9IGVsZW0ubm9kZVR5cGUgPyBqUXVlcnkuY2FjaGVbIGVsZW1balF1ZXJ5LmV4cGFuZG9dIF0gOiBlbGVtWyBqUXVlcnkuZXhwYW5kbyBdO1xuXHRcdHJldHVybiAhIWVsZW0gJiYgIWlzRW1wdHlEYXRhT2JqZWN0KCBlbGVtICk7XG5cdH0sXG5cblx0ZGF0YTogZnVuY3Rpb24oIGVsZW0sIG5hbWUsIGRhdGEsIHB2dCAvKiBJbnRlcm5hbCBVc2UgT25seSAqLyApIHtcblx0XHRpZiAoICFqUXVlcnkuYWNjZXB0RGF0YSggZWxlbSApICkge1xuXHRcdFx0cmV0dXJuO1xuXHRcdH1cblxuXHRcdHZhciB0aGlzQ2FjaGUsIHJldCxcblx0XHRcdGludGVybmFsS2V5ID0galF1ZXJ5LmV4cGFuZG8sXG5cdFx0XHRnZXRCeU5hbWUgPSB0eXBlb2YgbmFtZSA9PT0gXCJzdHJpbmdcIixcblxuXHRcdFx0Ly8gV2UgaGF2ZSB0byBoYW5kbGUgRE9NIG5vZGVzIGFuZCBKUyBvYmplY3RzIGRpZmZlcmVudGx5IGJlY2F1c2UgSUU2LTdcblx0XHRcdC8vIGNhbid0IEdDIG9iamVjdCByZWZlcmVuY2VzIHByb3Blcmx5IGFjcm9zcyB0aGUgRE9NLUpTIGJvdW5kYXJ5XG5cdFx0XHRpc05vZGUgPSBlbGVtLm5vZGVUeXBlLFxuXG5cdFx0XHQvLyBPbmx5IERPTSBub2RlcyBuZWVkIHRoZSBnbG9iYWwgalF1ZXJ5IGNhY2hlOyBKUyBvYmplY3QgZGF0YSBpc1xuXHRcdFx0Ly8gYXR0YWNoZWQgZGlyZWN0bHkgdG8gdGhlIG9iamVjdCBzbyBHQyBjYW4gb2NjdXIgYXV0b21hdGljYWxseVxuXHRcdFx0Y2FjaGUgPSBpc05vZGUgPyBqUXVlcnkuY2FjaGUgOiBlbGVtLFxuXG5cdFx0XHQvLyBPbmx5IGRlZmluaW5nIGFuIElEIGZvciBKUyBvYmplY3RzIGlmIGl0cyBjYWNoZSBhbHJlYWR5IGV4aXN0cyBhbGxvd3Ncblx0XHRcdC8vIHRoZSBjb2RlIHRvIHNob3J0Y3V0IG9uIHRoZSBzYW1lIHBhdGggYXMgYSBET00gbm9kZSB3aXRoIG5vIGNhY2hlXG5cdFx0XHRpZCA9IGlzTm9kZSA/IGVsZW1bIGpRdWVyeS5leHBhbmRvIF0gOiBlbGVtWyBqUXVlcnkuZXhwYW5kbyBdICYmIGpRdWVyeS5leHBhbmRvO1xuXG5cdFx0Ly8gQXZvaWQgZG9pbmcgYW55IG1vcmUgd29yayB0aGFuIHdlIG5lZWQgdG8gd2hlbiB0cnlpbmcgdG8gZ2V0IGRhdGEgb24gYW5cblx0XHQvLyBvYmplY3QgdGhhdCBoYXMgbm8gZGF0YSBhdCBhbGxcblx0XHRpZiAoICghaWQgfHwgIWNhY2hlW2lkXSB8fCAoIXB2dCAmJiAhY2FjaGVbaWRdLmRhdGEpKSAmJiBnZXRCeU5hbWUgJiYgZGF0YSA9PT0gdW5kZWZpbmVkICkge1xuXHRcdFx0cmV0dXJuO1xuXHRcdH1cblxuXHRcdGlmICggIWlkICkge1xuXHRcdFx0Ly8gT25seSBET00gbm9kZXMgbmVlZCBhIG5ldyB1bmlxdWUgSUQgZm9yIGVhY2ggZWxlbWVudCBzaW5jZSB0aGVpciBkYXRhXG5cdFx0XHQvLyBlbmRzIHVwIGluIHRoZSBnbG9iYWwgY2FjaGVcblx0XHRcdGlmICggaXNOb2RlICkge1xuXHRcdFx0XHRlbGVtWyBqUXVlcnkuZXhwYW5kbyBdID0gaWQgPSArK2pRdWVyeS51dWlkO1xuXHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0aWQgPSBqUXVlcnkuZXhwYW5kbztcblx0XHRcdH1cblx0XHR9XG5cblx0XHRpZiAoICFjYWNoZVsgaWQgXSApIHtcblx0XHRcdGNhY2hlWyBpZCBdID0ge307XG5cblx0XHRcdC8vIEF2b2lkcyBleHBvc2luZyBqUXVlcnkgbWV0YWRhdGEgb24gcGxhaW4gSlMgb2JqZWN0cyB3aGVuIHRoZSBvYmplY3QgXG5cdFx0XHQvLyBpcyBzZXJpYWxpemVkIHVzaW5nIEpTT04uc3RyaW5naWZ5XG5cdFx0XHRpZiAoICFpc05vZGUgKSB7XG5cdFx0XHRcdGNhY2hlWyBpZCBdLnRvSlNPTiA9IGpRdWVyeS5ub29wO1xuXHRcdFx0fVxuXHRcdH1cblxuXHRcdC8vIEFuIG9iamVjdCBjYW4gYmUgcGFzc2VkIHRvIGpRdWVyeS5kYXRhIGluc3RlYWQgb2YgYSBrZXkvdmFsdWUgcGFpcjsgdGhpcyBnZXRzXG5cdFx0Ly8gc2hhbGxvdyBjb3BpZWQgb3ZlciBvbnRvIHRoZSBleGlzdGluZyBjYWNoZVxuXHRcdGlmICggdHlwZW9mIG5hbWUgPT09IFwib2JqZWN0XCIgfHwgdHlwZW9mIG5hbWUgPT09IFwiZnVuY3Rpb25cIiApIHtcblx0XHRcdGlmICggcHZ0ICkge1xuXHRcdFx0XHRjYWNoZVsgaWQgXSA9IGpRdWVyeS5leHRlbmQoIGNhY2hlWyBpZCBdLCBuYW1lICk7XG5cdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRjYWNoZVsgaWQgXS5kYXRhID0galF1ZXJ5LmV4dGVuZCggY2FjaGVbIGlkIF0uZGF0YSwgbmFtZSApO1xuXHRcdFx0fVxuXHRcdH1cblxuXHRcdHRoaXNDYWNoZSA9IGNhY2hlWyBpZCBdO1xuXG5cdFx0Ly8galF1ZXJ5IGRhdGEoKSBpcyBzdG9yZWQgaW4gYSBzZXBhcmF0ZSBvYmplY3QgaW5zaWRlIHRoZSBvYmplY3QncyBpbnRlcm5hbCBkYXRhXG5cdFx0Ly8gY2FjaGUgaW4gb3JkZXIgdG8gYXZvaWQga2V5IGNvbGxpc2lvbnMgYmV0d2VlbiBpbnRlcm5hbCBkYXRhIGFuZCB1c2VyLWRlZmluZWRcblx0XHQvLyBkYXRhLlxuXHRcdGlmICggIXB2dCApIHtcblx0XHRcdGlmICggIXRoaXNDYWNoZS5kYXRhICkge1xuXHRcdFx0XHR0aGlzQ2FjaGUuZGF0YSA9IHt9O1xuXHRcdFx0fVxuXG5cdFx0XHR0aGlzQ2FjaGUgPSB0aGlzQ2FjaGUuZGF0YTtcblx0XHR9XG5cblx0XHRpZiAoIGRhdGEgIT09IHVuZGVmaW5lZCApIHtcblx0XHRcdHRoaXNDYWNoZVsgalF1ZXJ5LmNhbWVsQ2FzZSggbmFtZSApIF0gPSBkYXRhO1xuXHRcdH1cblxuXHRcdC8vIFRPRE86IFRoaXMgaXMgYSBoYWNrIGZvciAxLjUgT05MWS4gSXQgd2lsbCBiZSByZW1vdmVkIGluIDEuNi4gVXNlcnMgc2hvdWxkXG5cdFx0Ly8gbm90IGF0dGVtcHQgdG8gaW5zcGVjdCB0aGUgaW50ZXJuYWwgZXZlbnRzIG9iamVjdCB1c2luZyBqUXVlcnkuZGF0YSwgYXMgdGhpc1xuXHRcdC8vIGludGVybmFsIGRhdGEgb2JqZWN0IGlzIHVuZG9jdW1lbnRlZCBhbmQgc3ViamVjdCB0byBjaGFuZ2UuXG5cdFx0aWYgKCBuYW1lID09PSBcImV2ZW50c1wiICYmICF0aGlzQ2FjaGVbbmFtZV0gKSB7XG5cdFx0XHRyZXR1cm4gdGhpc0NhY2hlWyBpbnRlcm5hbEtleSBdICYmIHRoaXNDYWNoZVsgaW50ZXJuYWxLZXkgXS5ldmVudHM7XG5cdFx0fVxuXG5cdFx0Ly8gQ2hlY2sgZm9yIGJvdGggY29udmVydGVkLXRvLWNhbWVsIGFuZCBub24tY29udmVydGVkIGRhdGEgcHJvcGVydHkgbmFtZXNcblx0XHQvLyBJZiBhIGRhdGEgcHJvcGVydHkgd2FzIHNwZWNpZmllZFxuXHRcdGlmICggZ2V0QnlOYW1lICkge1xuXG5cdFx0XHQvLyBGaXJzdCBUcnkgdG8gZmluZCBhcy1pcyBwcm9wZXJ0eSBkYXRhXG5cdFx0XHRyZXQgPSB0aGlzQ2FjaGVbIG5hbWUgXTtcblxuXHRcdFx0Ly8gVGVzdCBmb3IgbnVsbHx1bmRlZmluZWQgcHJvcGVydHkgZGF0YVxuXHRcdFx0aWYgKCByZXQgPT0gbnVsbCApIHtcblxuXHRcdFx0XHQvLyBUcnkgdG8gZmluZCB0aGUgY2FtZWxDYXNlZCBwcm9wZXJ0eVxuXHRcdFx0XHRyZXQgPSB0aGlzQ2FjaGVbIGpRdWVyeS5jYW1lbENhc2UoIG5hbWUgKSBdO1xuXHRcdFx0fVxuXHRcdH0gZWxzZSB7XG5cdFx0XHRyZXQgPSB0aGlzQ2FjaGU7XG5cdFx0fVxuXG5cdFx0cmV0dXJuIHJldDtcblx0fSxcblxuXHRyZW1vdmVEYXRhOiBmdW5jdGlvbiggZWxlbSwgbmFtZSwgcHZ0IC8qIEludGVybmFsIFVzZSBPbmx5ICovICkge1xuXHRcdGlmICggIWpRdWVyeS5hY2NlcHREYXRhKCBlbGVtICkgKSB7XG5cdFx0XHRyZXR1cm47XG5cdFx0fVxuXG5cdFx0dmFyIHRoaXNDYWNoZSwgaSwgbCxcblxuXHRcdFx0Ly8gUmVmZXJlbmNlIHRvIGludGVybmFsIGRhdGEgY2FjaGUga2V5XG5cdFx0XHRpbnRlcm5hbEtleSA9IGpRdWVyeS5leHBhbmRvLFxuXG5cdFx0XHRpc05vZGUgPSBlbGVtLm5vZGVUeXBlLFxuXG5cdFx0XHQvLyBTZWUgalF1ZXJ5LmRhdGEgZm9yIG1vcmUgaW5mb3JtYXRpb25cblx0XHRcdGNhY2hlID0gaXNOb2RlID8galF1ZXJ5LmNhY2hlIDogZWxlbSxcblxuXHRcdFx0Ly8gU2VlIGpRdWVyeS5kYXRhIGZvciBtb3JlIGluZm9ybWF0aW9uXG5cdFx0XHRpZCA9IGlzTm9kZSA/IGVsZW1bIGpRdWVyeS5leHBhbmRvIF0gOiBqUXVlcnkuZXhwYW5kbztcblxuXHRcdC8vIElmIHRoZXJlIGlzIGFscmVhZHkgbm8gY2FjaGUgZW50cnkgZm9yIHRoaXMgb2JqZWN0LCB0aGVyZSBpcyBub1xuXHRcdC8vIHB1cnBvc2UgaW4gY29udGludWluZ1xuXHRcdGlmICggIWNhY2hlWyBpZCBdICkge1xuXHRcdFx0cmV0dXJuO1xuXHRcdH1cblxuXHRcdGlmICggbmFtZSApIHtcblxuXHRcdFx0dGhpc0NhY2hlID0gcHZ0ID8gY2FjaGVbIGlkIF0gOiBjYWNoZVsgaWQgXS5kYXRhO1xuXG5cdFx0XHRpZiAoIHRoaXNDYWNoZSApIHtcblxuXHRcdFx0XHQvLyBTdXBwb3J0IHNwYWNlIHNlcGFyYXRlZCBuYW1lc1xuXHRcdFx0XHRpZiAoIGpRdWVyeS5pc0FycmF5KCBuYW1lICkgKSB7XG5cdFx0XHRcdFx0bmFtZSA9IG5hbWU7XG5cdFx0XHRcdH0gZWxzZSBpZiAoIG5hbWUgaW4gdGhpc0NhY2hlICkge1xuXHRcdFx0XHRcdG5hbWUgPSBbIG5hbWUgXTtcblx0XHRcdFx0fSBlbHNlIHtcblxuXHRcdFx0XHRcdC8vIHNwbGl0IHRoZSBjYW1lbCBjYXNlZCB2ZXJzaW9uIGJ5IHNwYWNlc1xuXHRcdFx0XHRcdG5hbWUgPSBqUXVlcnkuY2FtZWxDYXNlKCBuYW1lICk7XG5cdFx0XHRcdFx0aWYgKCBuYW1lIGluIHRoaXNDYWNoZSApIHtcblx0XHRcdFx0XHRcdG5hbWUgPSBbIG5hbWUgXTtcblx0XHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdFx0bmFtZSA9IG5hbWUuc3BsaXQoIFwiIFwiICk7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9XG5cblx0XHRcdFx0Zm9yICggaSA9IDAsIGwgPSBuYW1lLmxlbmd0aDsgaSA8IGw7IGkrKyApIHtcblx0XHRcdFx0XHRkZWxldGUgdGhpc0NhY2hlWyBuYW1lW2ldIF07XG5cdFx0XHRcdH1cblxuXHRcdFx0XHQvLyBJZiB0aGVyZSBpcyBubyBkYXRhIGxlZnQgaW4gdGhlIGNhY2hlLCB3ZSB3YW50IHRvIGNvbnRpbnVlXG5cdFx0XHRcdC8vIGFuZCBsZXQgdGhlIGNhY2hlIG9iamVjdCBpdHNlbGYgZ2V0IGRlc3Ryb3llZFxuXHRcdFx0XHRpZiAoICEoIHB2dCA/IGlzRW1wdHlEYXRhT2JqZWN0IDogalF1ZXJ5LmlzRW1wdHlPYmplY3QgKSggdGhpc0NhY2hlICkgKSB7XG5cdFx0XHRcdFx0cmV0dXJuO1xuXHRcdFx0XHR9XG5cdFx0XHR9XG5cdFx0fVxuXG5cdFx0Ly8gU2VlIGpRdWVyeS5kYXRhIGZvciBtb3JlIGluZm9ybWF0aW9uXG5cdFx0aWYgKCAhcHZ0ICkge1xuXHRcdFx0ZGVsZXRlIGNhY2hlWyBpZCBdLmRhdGE7XG5cblx0XHRcdC8vIERvbid0IGRlc3Ryb3kgdGhlIHBhcmVudCBjYWNoZSB1bmxlc3MgdGhlIGludGVybmFsIGRhdGEgb2JqZWN0XG5cdFx0XHQvLyBoYWQgYmVlbiB0aGUgb25seSB0aGluZyBsZWZ0IGluIGl0XG5cdFx0XHRpZiAoICFpc0VtcHR5RGF0YU9iamVjdChjYWNoZVsgaWQgXSkgKSB7XG5cdFx0XHRcdHJldHVybjtcblx0XHRcdH1cblx0XHR9XG5cblx0XHQvLyBCcm93c2VycyB0aGF0IGZhaWwgZXhwYW5kbyBkZWxldGlvbiBhbHNvIHJlZnVzZSB0byBkZWxldGUgZXhwYW5kb3Mgb25cblx0XHQvLyB0aGUgd2luZG93LCBidXQgaXQgd2lsbCBhbGxvdyBpdCBvbiBhbGwgb3RoZXIgSlMgb2JqZWN0czsgb3RoZXIgYnJvd3NlcnNcblx0XHQvLyBkb24ndCBjYXJlXG5cdFx0Ly8gRW5zdXJlIHRoYXQgYGNhY2hlYCBpcyBub3QgYSB3aW5kb3cgb2JqZWN0ICMxMDA4MFxuXHRcdGlmICggalF1ZXJ5LnN1cHBvcnQuZGVsZXRlRXhwYW5kbyB8fCAhY2FjaGUuc2V0SW50ZXJ2YWwgKSB7XG5cdFx0XHRkZWxldGUgY2FjaGVbIGlkIF07XG5cdFx0fSBlbHNlIHtcblx0XHRcdGNhY2hlWyBpZCBdID0gbnVsbDtcblx0XHR9XG5cblx0XHQvLyBXZSBkZXN0cm95ZWQgdGhlIGNhY2hlIGFuZCBuZWVkIHRvIGVsaW1pbmF0ZSB0aGUgZXhwYW5kbyBvbiB0aGUgbm9kZSB0byBhdm9pZFxuXHRcdC8vIGZhbHNlIGxvb2t1cHMgaW4gdGhlIGNhY2hlIGZvciBlbnRyaWVzIHRoYXQgbm8gbG9uZ2VyIGV4aXN0XG5cdFx0aWYgKCBpc05vZGUgKSB7XG5cdFx0XHQvLyBJRSBkb2VzIG5vdCBhbGxvdyB1cyB0byBkZWxldGUgZXhwYW5kbyBwcm9wZXJ0aWVzIGZyb20gbm9kZXMsXG5cdFx0XHQvLyBub3IgZG9lcyBpdCBoYXZlIGEgcmVtb3ZlQXR0cmlidXRlIGZ1bmN0aW9uIG9uIERvY3VtZW50IG5vZGVzO1xuXHRcdFx0Ly8gd2UgbXVzdCBoYW5kbGUgYWxsIG9mIHRoZXNlIGNhc2VzXG5cdFx0XHRpZiAoIGpRdWVyeS5zdXBwb3J0LmRlbGV0ZUV4cGFuZG8gKSB7XG5cdFx0XHRcdGRlbGV0ZSBlbGVtWyBqUXVlcnkuZXhwYW5kbyBdO1xuXHRcdFx0fSBlbHNlIGlmICggZWxlbS5yZW1vdmVBdHRyaWJ1dGUgKSB7XG5cdFx0XHRcdGVsZW0ucmVtb3ZlQXR0cmlidXRlKCBqUXVlcnkuZXhwYW5kbyApO1xuXHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0ZWxlbVsgalF1ZXJ5LmV4cGFuZG8gXSA9IG51bGw7XG5cdFx0XHR9XG5cdFx0fVxuXHR9LFxuXG5cdC8vIEZvciBpbnRlcm5hbCB1c2Ugb25seS5cblx0X2RhdGE6IGZ1bmN0aW9uKCBlbGVtLCBuYW1lLCBkYXRhICkge1xuXHRcdHJldHVybiBqUXVlcnkuZGF0YSggZWxlbSwgbmFtZSwgZGF0YSwgdHJ1ZSApO1xuXHR9LFxuXG5cdC8vIEEgbWV0aG9kIGZvciBkZXRlcm1pbmluZyBpZiBhIERPTSBub2RlIGNhbiBoYW5kbGUgdGhlIGRhdGEgZXhwYW5kb1xuXHRhY2NlcHREYXRhOiBmdW5jdGlvbiggZWxlbSApIHtcblx0XHRpZiAoIGVsZW0ubm9kZU5hbWUgKSB7XG5cdFx0XHR2YXIgbWF0Y2ggPSBqUXVlcnkubm9EYXRhWyBlbGVtLm5vZGVOYW1lLnRvTG93ZXJDYXNlKCkgXTtcblxuXHRcdFx0aWYgKCBtYXRjaCApIHtcblx0XHRcdFx0cmV0dXJuICEobWF0Y2ggPT09IHRydWUgfHwgZWxlbS5nZXRBdHRyaWJ1dGUoXCJjbGFzc2lkXCIpICE9PSBtYXRjaCk7XG5cdFx0XHR9XG5cdFx0fVxuXG5cdFx0cmV0dXJuIHRydWU7XG5cdH1cbn0pO1xuXG5qUXVlcnkuZm4uZXh0ZW5kKHtcblx0ZGF0YTogZnVuY3Rpb24oIGtleSwgdmFsdWUgKSB7XG5cdFx0dmFyIHBhcnRzLCBhdHRyLCBuYW1lLFxuXHRcdFx0ZGF0YSA9IG51bGw7XG5cblx0XHRpZiAoIHR5cGVvZiBrZXkgPT09IFwidW5kZWZpbmVkXCIgKSB7XG5cdFx0XHRpZiAoIHRoaXMubGVuZ3RoICkge1xuXHRcdFx0XHRkYXRhID0galF1ZXJ5LmRhdGEoIHRoaXNbMF0gKTtcblxuXHRcdFx0XHRpZiAoIHRoaXNbMF0ubm9kZVR5cGUgPT09IDEgJiYgIWpRdWVyeS5fZGF0YSggdGhpc1swXSwgXCJwYXJzZWRBdHRyc1wiICkgKSB7XG5cdFx0XHRcdFx0YXR0ciA9IHRoaXNbMF0uYXR0cmlidXRlcztcblx0XHRcdFx0XHRmb3IgKCB2YXIgaSA9IDAsIGwgPSBhdHRyLmxlbmd0aDsgaSA8IGw7IGkrKyApIHtcblx0XHRcdFx0XHRcdG5hbWUgPSBhdHRyW2ldLm5hbWU7XG5cblx0XHRcdFx0XHRcdGlmICggbmFtZS5pbmRleE9mKCBcImRhdGEtXCIgKSA9PT0gMCApIHtcblx0XHRcdFx0XHRcdFx0bmFtZSA9IGpRdWVyeS5jYW1lbENhc2UoIG5hbWUuc3Vic3RyaW5nKDUpICk7XG5cblx0XHRcdFx0XHRcdFx0ZGF0YUF0dHIoIHRoaXNbMF0sIG5hbWUsIGRhdGFbIG5hbWUgXSApO1xuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdH1cblx0XHRcdFx0XHRqUXVlcnkuX2RhdGEoIHRoaXNbMF0sIFwicGFyc2VkQXR0cnNcIiwgdHJ1ZSApO1xuXHRcdFx0XHR9XG5cdFx0XHR9XG5cblx0XHRcdHJldHVybiBkYXRhO1xuXG5cdFx0fSBlbHNlIGlmICggdHlwZW9mIGtleSA9PT0gXCJvYmplY3RcIiApIHtcblx0XHRcdHJldHVybiB0aGlzLmVhY2goZnVuY3Rpb24oKSB7XG5cdFx0XHRcdGpRdWVyeS5kYXRhKCB0aGlzLCBrZXkgKTtcblx0XHRcdH0pO1xuXHRcdH1cblxuXHRcdHBhcnRzID0ga2V5LnNwbGl0KFwiLlwiKTtcblx0XHRwYXJ0c1sxXSA9IHBhcnRzWzFdID8gXCIuXCIgKyBwYXJ0c1sxXSA6IFwiXCI7XG5cblx0XHRpZiAoIHZhbHVlID09PSB1bmRlZmluZWQgKSB7XG5cdFx0XHRkYXRhID0gdGhpcy50cmlnZ2VySGFuZGxlcihcImdldERhdGFcIiArIHBhcnRzWzFdICsgXCIhXCIsIFtwYXJ0c1swXV0pO1xuXG5cdFx0XHQvLyBUcnkgdG8gZmV0Y2ggYW55IGludGVybmFsbHkgc3RvcmVkIGRhdGEgZmlyc3Rcblx0XHRcdGlmICggZGF0YSA9PT0gdW5kZWZpbmVkICYmIHRoaXMubGVuZ3RoICkge1xuXHRcdFx0XHRkYXRhID0galF1ZXJ5LmRhdGEoIHRoaXNbMF0sIGtleSApO1xuXHRcdFx0XHRkYXRhID0gZGF0YUF0dHIoIHRoaXNbMF0sIGtleSwgZGF0YSApO1xuXHRcdFx0fVxuXG5cdFx0XHRyZXR1cm4gZGF0YSA9PT0gdW5kZWZpbmVkICYmIHBhcnRzWzFdID9cblx0XHRcdFx0dGhpcy5kYXRhKCBwYXJ0c1swXSApIDpcblx0XHRcdFx0ZGF0YTtcblxuXHRcdH0gZWxzZSB7XG5cdFx0XHRyZXR1cm4gdGhpcy5lYWNoKGZ1bmN0aW9uKCkge1xuXHRcdFx0XHR2YXIgJHRoaXMgPSBqUXVlcnkoIHRoaXMgKSxcblx0XHRcdFx0XHRhcmdzID0gWyBwYXJ0c1swXSwgdmFsdWUgXTtcblxuXHRcdFx0XHQkdGhpcy50cmlnZ2VySGFuZGxlciggXCJzZXREYXRhXCIgKyBwYXJ0c1sxXSArIFwiIVwiLCBhcmdzICk7XG5cdFx0XHRcdGpRdWVyeS5kYXRhKCB0aGlzLCBrZXksIHZhbHVlICk7XG5cdFx0XHRcdCR0aGlzLnRyaWdnZXJIYW5kbGVyKCBcImNoYW5nZURhdGFcIiArIHBhcnRzWzFdICsgXCIhXCIsIGFyZ3MgKTtcblx0XHRcdH0pO1xuXHRcdH1cblx0fSxcblxuXHRyZW1vdmVEYXRhOiBmdW5jdGlvbigga2V5ICkge1xuXHRcdHJldHVybiB0aGlzLmVhY2goZnVuY3Rpb24oKSB7XG5cdFx0XHRqUXVlcnkucmVtb3ZlRGF0YSggdGhpcywga2V5ICk7XG5cdFx0fSk7XG5cdH1cbn0pO1xuXG5mdW5jdGlvbiBkYXRhQXR0ciggZWxlbSwga2V5LCBkYXRhICkge1xuXHQvLyBJZiBub3RoaW5nIHdhcyBmb3VuZCBpbnRlcm5hbGx5LCB0cnkgdG8gZmV0Y2ggYW55XG5cdC8vIGRhdGEgZnJvbSB0aGUgSFRNTDUgZGF0YS0qIGF0dHJpYnV0ZVxuXHRpZiAoIGRhdGEgPT09IHVuZGVmaW5lZCAmJiBlbGVtLm5vZGVUeXBlID09PSAxICkge1xuXG5cdFx0dmFyIG5hbWUgPSBcImRhdGEtXCIgKyBrZXkucmVwbGFjZSggcm11bHRpRGFzaCwgXCItJDFcIiApLnRvTG93ZXJDYXNlKCk7XG5cblx0XHRkYXRhID0gZWxlbS5nZXRBdHRyaWJ1dGUoIG5hbWUgKTtcblxuXHRcdGlmICggdHlwZW9mIGRhdGEgPT09IFwic3RyaW5nXCIgKSB7XG5cdFx0XHR0cnkge1xuXHRcdFx0XHRkYXRhID0gZGF0YSA9PT0gXCJ0cnVlXCIgPyB0cnVlIDpcblx0XHRcdFx0ZGF0YSA9PT0gXCJmYWxzZVwiID8gZmFsc2UgOlxuXHRcdFx0XHRkYXRhID09PSBcIm51bGxcIiA/IG51bGwgOlxuXHRcdFx0XHRqUXVlcnkuaXNOdW1lcmljKCBkYXRhICkgPyBwYXJzZUZsb2F0KCBkYXRhICkgOlxuXHRcdFx0XHRcdHJicmFjZS50ZXN0KCBkYXRhICkgPyBqUXVlcnkucGFyc2VKU09OKCBkYXRhICkgOlxuXHRcdFx0XHRcdGRhdGE7XG5cdFx0XHR9IGNhdGNoKCBlICkge31cblxuXHRcdFx0Ly8gTWFrZSBzdXJlIHdlIHNldCB0aGUgZGF0YSBzbyBpdCBpc24ndCBjaGFuZ2VkIGxhdGVyXG5cdFx0XHRqUXVlcnkuZGF0YSggZWxlbSwga2V5LCBkYXRhICk7XG5cblx0XHR9IGVsc2Uge1xuXHRcdFx0ZGF0YSA9IHVuZGVmaW5lZDtcblx0XHR9XG5cdH1cblxuXHRyZXR1cm4gZGF0YTtcbn1cblxuLy8gY2hlY2tzIGEgY2FjaGUgb2JqZWN0IGZvciBlbXB0aW5lc3NcbmZ1bmN0aW9uIGlzRW1wdHlEYXRhT2JqZWN0KCBvYmogKSB7XG5cdGZvciAoIHZhciBuYW1lIGluIG9iaiApIHtcblxuXHRcdC8vIGlmIHRoZSBwdWJsaWMgZGF0YSBvYmplY3QgaXMgZW1wdHksIHRoZSBwcml2YXRlIGlzIHN0aWxsIGVtcHR5XG5cdFx0aWYgKCBuYW1lID09PSBcImRhdGFcIiAmJiBqUXVlcnkuaXNFbXB0eU9iamVjdCggb2JqW25hbWVdICkgKSB7XG5cdFx0XHRjb250aW51ZTtcblx0XHR9XG5cdFx0aWYgKCBuYW1lICE9PSBcInRvSlNPTlwiICkge1xuXHRcdFx0cmV0dXJuIGZhbHNlO1xuXHRcdH1cblx0fVxuXG5cdHJldHVybiB0cnVlO1xufVxuXG5cblxuXG5mdW5jdGlvbiBoYW5kbGVRdWV1ZU1hcmtEZWZlciggZWxlbSwgdHlwZSwgc3JjICkge1xuXHR2YXIgZGVmZXJEYXRhS2V5ID0gdHlwZSArIFwiZGVmZXJcIixcblx0XHRxdWV1ZURhdGFLZXkgPSB0eXBlICsgXCJxdWV1ZVwiLFxuXHRcdG1hcmtEYXRhS2V5ID0gdHlwZSArIFwibWFya1wiLFxuXHRcdGRlZmVyID0galF1ZXJ5Ll9kYXRhKCBlbGVtLCBkZWZlckRhdGFLZXkgKTtcblx0aWYgKCBkZWZlciAmJlxuXHRcdCggc3JjID09PSBcInF1ZXVlXCIgfHwgIWpRdWVyeS5fZGF0YShlbGVtLCBxdWV1ZURhdGFLZXkpICkgJiZcblx0XHQoIHNyYyA9PT0gXCJtYXJrXCIgfHwgIWpRdWVyeS5fZGF0YShlbGVtLCBtYXJrRGF0YUtleSkgKSApIHtcblx0XHQvLyBHaXZlIHJvb20gZm9yIGhhcmQtY29kZWQgY2FsbGJhY2tzIHRvIGZpcmUgZmlyc3Rcblx0XHQvLyBhbmQgZXZlbnR1YWxseSBtYXJrL3F1ZXVlIHNvbWV0aGluZyBlbHNlIG9uIHRoZSBlbGVtZW50XG5cdFx0c2V0VGltZW91dCggZnVuY3Rpb24oKSB7XG5cdFx0XHRpZiAoICFqUXVlcnkuX2RhdGEoIGVsZW0sIHF1ZXVlRGF0YUtleSApICYmXG5cdFx0XHRcdCFqUXVlcnkuX2RhdGEoIGVsZW0sIG1hcmtEYXRhS2V5ICkgKSB7XG5cdFx0XHRcdGpRdWVyeS5yZW1vdmVEYXRhKCBlbGVtLCBkZWZlckRhdGFLZXksIHRydWUgKTtcblx0XHRcdFx0ZGVmZXIuZmlyZSgpO1xuXHRcdFx0fVxuXHRcdH0sIDAgKTtcblx0fVxufVxuXG5qUXVlcnkuZXh0ZW5kKHtcblxuXHRfbWFyazogZnVuY3Rpb24oIGVsZW0sIHR5cGUgKSB7XG5cdFx0aWYgKCBlbGVtICkge1xuXHRcdFx0dHlwZSA9ICh0eXBlIHx8IFwiZnhcIikgKyBcIm1hcmtcIjtcblx0XHRcdGpRdWVyeS5fZGF0YSggZWxlbSwgdHlwZSwgKGpRdWVyeS5fZGF0YSggZWxlbSwgdHlwZSApIHx8IDApICsgMSApO1xuXHRcdH1cblx0fSxcblxuXHRfdW5tYXJrOiBmdW5jdGlvbiggZm9yY2UsIGVsZW0sIHR5cGUgKSB7XG5cdFx0aWYgKCBmb3JjZSAhPT0gdHJ1ZSApIHtcblx0XHRcdHR5cGUgPSBlbGVtO1xuXHRcdFx0ZWxlbSA9IGZvcmNlO1xuXHRcdFx0Zm9yY2UgPSBmYWxzZTtcblx0XHR9XG5cdFx0aWYgKCBlbGVtICkge1xuXHRcdFx0dHlwZSA9IHR5cGUgfHwgXCJmeFwiO1xuXHRcdFx0dmFyIGtleSA9IHR5cGUgKyBcIm1hcmtcIixcblx0XHRcdFx0Y291bnQgPSBmb3JjZSA/IDAgOiAoIChqUXVlcnkuX2RhdGEoIGVsZW0sIGtleSApIHx8IDEpIC0gMSApO1xuXHRcdFx0aWYgKCBjb3VudCApIHtcblx0XHRcdFx0alF1ZXJ5Ll9kYXRhKCBlbGVtLCBrZXksIGNvdW50ICk7XG5cdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRqUXVlcnkucmVtb3ZlRGF0YSggZWxlbSwga2V5LCB0cnVlICk7XG5cdFx0XHRcdGhhbmRsZVF1ZXVlTWFya0RlZmVyKCBlbGVtLCB0eXBlLCBcIm1hcmtcIiApO1xuXHRcdFx0fVxuXHRcdH1cblx0fSxcblxuXHRxdWV1ZTogZnVuY3Rpb24oIGVsZW0sIHR5cGUsIGRhdGEgKSB7XG5cdFx0dmFyIHE7XG5cdFx0aWYgKCBlbGVtICkge1xuXHRcdFx0dHlwZSA9ICh0eXBlIHx8IFwiZnhcIikgKyBcInF1ZXVlXCI7XG5cdFx0XHRxID0galF1ZXJ5Ll9kYXRhKCBlbGVtLCB0eXBlICk7XG5cblx0XHRcdC8vIFNwZWVkIHVwIGRlcXVldWUgYnkgZ2V0dGluZyBvdXQgcXVpY2tseSBpZiB0aGlzIGlzIGp1c3QgYSBsb29rdXBcblx0XHRcdGlmICggZGF0YSApIHtcblx0XHRcdFx0aWYgKCAhcSB8fCBqUXVlcnkuaXNBcnJheShkYXRhKSApIHtcblx0XHRcdFx0XHRxID0galF1ZXJ5Ll9kYXRhKCBlbGVtLCB0eXBlLCBqUXVlcnkubWFrZUFycmF5KGRhdGEpICk7XG5cdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0cS5wdXNoKCBkYXRhICk7XG5cdFx0XHRcdH1cblx0XHRcdH1cblx0XHRcdHJldHVybiBxIHx8IFtdO1xuXHRcdH1cblx0fSxcblxuXHRkZXF1ZXVlOiBmdW5jdGlvbiggZWxlbSwgdHlwZSApIHtcblx0XHR0eXBlID0gdHlwZSB8fCBcImZ4XCI7XG5cblx0XHR2YXIgcXVldWUgPSBqUXVlcnkucXVldWUoIGVsZW0sIHR5cGUgKSxcblx0XHRcdGZuID0gcXVldWUuc2hpZnQoKSxcblx0XHRcdHJ1bm5lciA9IHt9O1xuXG5cdFx0Ly8gSWYgdGhlIGZ4IHF1ZXVlIGlzIGRlcXVldWVkLCBhbHdheXMgcmVtb3ZlIHRoZSBwcm9ncmVzcyBzZW50aW5lbFxuXHRcdGlmICggZm4gPT09IFwiaW5wcm9ncmVzc1wiICkge1xuXHRcdFx0Zm4gPSBxdWV1ZS5zaGlmdCgpO1xuXHRcdH1cblxuXHRcdGlmICggZm4gKSB7XG5cdFx0XHQvLyBBZGQgYSBwcm9ncmVzcyBzZW50aW5lbCB0byBwcmV2ZW50IHRoZSBmeCBxdWV1ZSBmcm9tIGJlaW5nXG5cdFx0XHQvLyBhdXRvbWF0aWNhbGx5IGRlcXVldWVkXG5cdFx0XHRpZiAoIHR5cGUgPT09IFwiZnhcIiApIHtcblx0XHRcdFx0cXVldWUudW5zaGlmdCggXCJpbnByb2dyZXNzXCIgKTtcblx0XHRcdH1cblxuXHRcdFx0alF1ZXJ5Ll9kYXRhKCBlbGVtLCB0eXBlICsgXCIucnVuXCIsIHJ1bm5lciApO1xuXHRcdFx0Zm4uY2FsbCggZWxlbSwgZnVuY3Rpb24oKSB7XG5cdFx0XHRcdGpRdWVyeS5kZXF1ZXVlKCBlbGVtLCB0eXBlICk7XG5cdFx0XHR9LCBydW5uZXIgKTtcblx0XHR9XG5cblx0XHRpZiAoICFxdWV1ZS5sZW5ndGggKSB7XG5cdFx0XHRqUXVlcnkucmVtb3ZlRGF0YSggZWxlbSwgdHlwZSArIFwicXVldWUgXCIgKyB0eXBlICsgXCIucnVuXCIsIHRydWUgKTtcblx0XHRcdGhhbmRsZVF1ZXVlTWFya0RlZmVyKCBlbGVtLCB0eXBlLCBcInF1ZXVlXCIgKTtcblx0XHR9XG5cdH1cbn0pO1xuXG5qUXVlcnkuZm4uZXh0ZW5kKHtcblx0cXVldWU6IGZ1bmN0aW9uKCB0eXBlLCBkYXRhICkge1xuXHRcdGlmICggdHlwZW9mIHR5cGUgIT09IFwic3RyaW5nXCIgKSB7XG5cdFx0XHRkYXRhID0gdHlwZTtcblx0XHRcdHR5cGUgPSBcImZ4XCI7XG5cdFx0fVxuXG5cdFx0aWYgKCBkYXRhID09PSB1bmRlZmluZWQgKSB7XG5cdFx0XHRyZXR1cm4galF1ZXJ5LnF1ZXVlKCB0aGlzWzBdLCB0eXBlICk7XG5cdFx0fVxuXHRcdHJldHVybiB0aGlzLmVhY2goZnVuY3Rpb24oKSB7XG5cdFx0XHR2YXIgcXVldWUgPSBqUXVlcnkucXVldWUoIHRoaXMsIHR5cGUsIGRhdGEgKTtcblxuXHRcdFx0aWYgKCB0eXBlID09PSBcImZ4XCIgJiYgcXVldWVbMF0gIT09IFwiaW5wcm9ncmVzc1wiICkge1xuXHRcdFx0XHRqUXVlcnkuZGVxdWV1ZSggdGhpcywgdHlwZSApO1xuXHRcdFx0fVxuXHRcdH0pO1xuXHR9LFxuXHRkZXF1ZXVlOiBmdW5jdGlvbiggdHlwZSApIHtcblx0XHRyZXR1cm4gdGhpcy5lYWNoKGZ1bmN0aW9uKCkge1xuXHRcdFx0alF1ZXJ5LmRlcXVldWUoIHRoaXMsIHR5cGUgKTtcblx0XHR9KTtcblx0fSxcblx0Ly8gQmFzZWQgb2ZmIG9mIHRoZSBwbHVnaW4gYnkgQ2xpbnQgSGVsZmVycywgd2l0aCBwZXJtaXNzaW9uLlxuXHQvLyBodHRwOi8vYmxpbmRzaWduYWxzLmNvbS9pbmRleC5waHAvMjAwOS8wNy9qcXVlcnktZGVsYXkvXG5cdGRlbGF5OiBmdW5jdGlvbiggdGltZSwgdHlwZSApIHtcblx0XHR0aW1lID0galF1ZXJ5LmZ4ID8galF1ZXJ5LmZ4LnNwZWVkc1sgdGltZSBdIHx8IHRpbWUgOiB0aW1lO1xuXHRcdHR5cGUgPSB0eXBlIHx8IFwiZnhcIjtcblxuXHRcdHJldHVybiB0aGlzLnF1ZXVlKCB0eXBlLCBmdW5jdGlvbiggbmV4dCwgcnVubmVyICkge1xuXHRcdFx0dmFyIHRpbWVvdXQgPSBzZXRUaW1lb3V0KCBuZXh0LCB0aW1lICk7XG5cdFx0XHRydW5uZXIuc3RvcCA9IGZ1bmN0aW9uKCkge1xuXHRcdFx0XHRjbGVhclRpbWVvdXQoIHRpbWVvdXQgKTtcblx0XHRcdH07XG5cdFx0fSk7XG5cdH0sXG5cdGNsZWFyUXVldWU6IGZ1bmN0aW9uKCB0eXBlICkge1xuXHRcdHJldHVybiB0aGlzLnF1ZXVlKCB0eXBlIHx8IFwiZnhcIiwgW10gKTtcblx0fSxcblx0Ly8gR2V0IGEgcHJvbWlzZSByZXNvbHZlZCB3aGVuIHF1ZXVlcyBvZiBhIGNlcnRhaW4gdHlwZVxuXHQvLyBhcmUgZW1wdGllZCAoZnggaXMgdGhlIHR5cGUgYnkgZGVmYXVsdClcblx0cHJvbWlzZTogZnVuY3Rpb24oIHR5cGUsIG9iamVjdCApIHtcblx0XHRpZiAoIHR5cGVvZiB0eXBlICE9PSBcInN0cmluZ1wiICkge1xuXHRcdFx0b2JqZWN0ID0gdHlwZTtcblx0XHRcdHR5cGUgPSB1bmRlZmluZWQ7XG5cdFx0fVxuXHRcdHR5cGUgPSB0eXBlIHx8IFwiZnhcIjtcblx0XHR2YXIgZGVmZXIgPSBqUXVlcnkuRGVmZXJyZWQoKSxcblx0XHRcdGVsZW1lbnRzID0gdGhpcyxcblx0XHRcdGkgPSBlbGVtZW50cy5sZW5ndGgsXG5cdFx0XHRjb3VudCA9IDEsXG5cdFx0XHRkZWZlckRhdGFLZXkgPSB0eXBlICsgXCJkZWZlclwiLFxuXHRcdFx0cXVldWVEYXRhS2V5ID0gdHlwZSArIFwicXVldWVcIixcblx0XHRcdG1hcmtEYXRhS2V5ID0gdHlwZSArIFwibWFya1wiLFxuXHRcdFx0dG1wO1xuXHRcdGZ1bmN0aW9uIHJlc29sdmUoKSB7XG5cdFx0XHRpZiAoICEoIC0tY291bnQgKSApIHtcblx0XHRcdFx0ZGVmZXIucmVzb2x2ZVdpdGgoIGVsZW1lbnRzLCBbIGVsZW1lbnRzIF0gKTtcblx0XHRcdH1cblx0XHR9XG5cdFx0d2hpbGUoIGktLSApIHtcblx0XHRcdGlmICgoIHRtcCA9IGpRdWVyeS5kYXRhKCBlbGVtZW50c1sgaSBdLCBkZWZlckRhdGFLZXksIHVuZGVmaW5lZCwgdHJ1ZSApIHx8XG5cdFx0XHRcdFx0KCBqUXVlcnkuZGF0YSggZWxlbWVudHNbIGkgXSwgcXVldWVEYXRhS2V5LCB1bmRlZmluZWQsIHRydWUgKSB8fFxuXHRcdFx0XHRcdFx0alF1ZXJ5LmRhdGEoIGVsZW1lbnRzWyBpIF0sIG1hcmtEYXRhS2V5LCB1bmRlZmluZWQsIHRydWUgKSApICYmXG5cdFx0XHRcdFx0alF1ZXJ5LmRhdGEoIGVsZW1lbnRzWyBpIF0sIGRlZmVyRGF0YUtleSwgalF1ZXJ5LkNhbGxiYWNrcyggXCJvbmNlIG1lbW9yeVwiICksIHRydWUgKSApKSB7XG5cdFx0XHRcdGNvdW50Kys7XG5cdFx0XHRcdHRtcC5hZGQoIHJlc29sdmUgKTtcblx0XHRcdH1cblx0XHR9XG5cdFx0cmVzb2x2ZSgpO1xuXHRcdHJldHVybiBkZWZlci5wcm9taXNlKCk7XG5cdH1cbn0pO1xuXG5cblxuXG52YXIgcmNsYXNzID0gL1tcXG5cXHRcXHJdL2csXG5cdHJzcGFjZSA9IC9cXHMrLyxcblx0cnJldHVybiA9IC9cXHIvZyxcblx0cnR5cGUgPSAvXig/OmJ1dHRvbnxpbnB1dCkkL2ksXG5cdHJmb2N1c2FibGUgPSAvXig/OmJ1dHRvbnxpbnB1dHxvYmplY3R8c2VsZWN0fHRleHRhcmVhKSQvaSxcblx0cmNsaWNrYWJsZSA9IC9eYSg/OnJlYSk/JC9pLFxuXHRyYm9vbGVhbiA9IC9eKD86YXV0b2ZvY3VzfGF1dG9wbGF5fGFzeW5jfGNoZWNrZWR8Y29udHJvbHN8ZGVmZXJ8ZGlzYWJsZWR8aGlkZGVufGxvb3B8bXVsdGlwbGV8b3BlbnxyZWFkb25seXxyZXF1aXJlZHxzY29wZWR8c2VsZWN0ZWQpJC9pLFxuXHRub2RlSG9vaywgYm9vbEhvb2ssIGZpeFNwZWNpZmllZDtcblxualF1ZXJ5LmZuLmV4dGVuZCh7XG5cdGF0dHI6IGZ1bmN0aW9uKCBuYW1lLCB2YWx1ZSApIHtcblx0XHRyZXR1cm4galF1ZXJ5LmFjY2VzcyggdGhpcywgbmFtZSwgdmFsdWUsIHRydWUsIGpRdWVyeS5hdHRyICk7XG5cdH0sXG5cblx0cmVtb3ZlQXR0cjogZnVuY3Rpb24oIG5hbWUgKSB7XG5cdFx0cmV0dXJuIHRoaXMuZWFjaChmdW5jdGlvbigpIHtcblx0XHRcdGpRdWVyeS5yZW1vdmVBdHRyKCB0aGlzLCBuYW1lICk7XG5cdFx0fSk7XG5cdH0sXG5cblx0cHJvcDogZnVuY3Rpb24oIG5hbWUsIHZhbHVlICkge1xuXHRcdHJldHVybiBqUXVlcnkuYWNjZXNzKCB0aGlzLCBuYW1lLCB2YWx1ZSwgdHJ1ZSwgalF1ZXJ5LnByb3AgKTtcblx0fSxcblxuXHRyZW1vdmVQcm9wOiBmdW5jdGlvbiggbmFtZSApIHtcblx0XHRuYW1lID0galF1ZXJ5LnByb3BGaXhbIG5hbWUgXSB8fCBuYW1lO1xuXHRcdHJldHVybiB0aGlzLmVhY2goZnVuY3Rpb24oKSB7XG5cdFx0XHQvLyB0cnkvY2F0Y2ggaGFuZGxlcyBjYXNlcyB3aGVyZSBJRSBiYWxrcyAoc3VjaCBhcyByZW1vdmluZyBhIHByb3BlcnR5IG9uIHdpbmRvdylcblx0XHRcdHRyeSB7XG5cdFx0XHRcdHRoaXNbIG5hbWUgXSA9IHVuZGVmaW5lZDtcblx0XHRcdFx0ZGVsZXRlIHRoaXNbIG5hbWUgXTtcblx0XHRcdH0gY2F0Y2goIGUgKSB7fVxuXHRcdH0pO1xuXHR9LFxuXG5cdGFkZENsYXNzOiBmdW5jdGlvbiggdmFsdWUgKSB7XG5cdFx0dmFyIGNsYXNzTmFtZXMsIGksIGwsIGVsZW0sXG5cdFx0XHRzZXRDbGFzcywgYywgY2w7XG5cblx0XHRpZiAoIGpRdWVyeS5pc0Z1bmN0aW9uKCB2YWx1ZSApICkge1xuXHRcdFx0cmV0dXJuIHRoaXMuZWFjaChmdW5jdGlvbiggaiApIHtcblx0XHRcdFx0alF1ZXJ5KCB0aGlzICkuYWRkQ2xhc3MoIHZhbHVlLmNhbGwodGhpcywgaiwgdGhpcy5jbGFzc05hbWUpICk7XG5cdFx0XHR9KTtcblx0XHR9XG5cblx0XHRpZiAoIHZhbHVlICYmIHR5cGVvZiB2YWx1ZSA9PT0gXCJzdHJpbmdcIiApIHtcblx0XHRcdGNsYXNzTmFtZXMgPSB2YWx1ZS5zcGxpdCggcnNwYWNlICk7XG5cblx0XHRcdGZvciAoIGkgPSAwLCBsID0gdGhpcy5sZW5ndGg7IGkgPCBsOyBpKysgKSB7XG5cdFx0XHRcdGVsZW0gPSB0aGlzWyBpIF07XG5cblx0XHRcdFx0aWYgKCBlbGVtLm5vZGVUeXBlID09PSAxICkge1xuXHRcdFx0XHRcdGlmICggIWVsZW0uY2xhc3NOYW1lICYmIGNsYXNzTmFtZXMubGVuZ3RoID09PSAxICkge1xuXHRcdFx0XHRcdFx0ZWxlbS5jbGFzc05hbWUgPSB2YWx1ZTtcblxuXHRcdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0XHRzZXRDbGFzcyA9IFwiIFwiICsgZWxlbS5jbGFzc05hbWUgKyBcIiBcIjtcblxuXHRcdFx0XHRcdFx0Zm9yICggYyA9IDAsIGNsID0gY2xhc3NOYW1lcy5sZW5ndGg7IGMgPCBjbDsgYysrICkge1xuXHRcdFx0XHRcdFx0XHRpZiAoICF+c2V0Q2xhc3MuaW5kZXhPZiggXCIgXCIgKyBjbGFzc05hbWVzWyBjIF0gKyBcIiBcIiApICkge1xuXHRcdFx0XHRcdFx0XHRcdHNldENsYXNzICs9IGNsYXNzTmFtZXNbIGMgXSArIFwiIFwiO1xuXHRcdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHRlbGVtLmNsYXNzTmFtZSA9IGpRdWVyeS50cmltKCBzZXRDbGFzcyApO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0fVxuXHRcdFx0fVxuXHRcdH1cblxuXHRcdHJldHVybiB0aGlzO1xuXHR9LFxuXG5cdHJlbW92ZUNsYXNzOiBmdW5jdGlvbiggdmFsdWUgKSB7XG5cdFx0dmFyIGNsYXNzTmFtZXMsIGksIGwsIGVsZW0sIGNsYXNzTmFtZSwgYywgY2w7XG5cblx0XHRpZiAoIGpRdWVyeS5pc0Z1bmN0aW9uKCB2YWx1ZSApICkge1xuXHRcdFx0cmV0dXJuIHRoaXMuZWFjaChmdW5jdGlvbiggaiApIHtcblx0XHRcdFx0alF1ZXJ5KCB0aGlzICkucmVtb3ZlQ2xhc3MoIHZhbHVlLmNhbGwodGhpcywgaiwgdGhpcy5jbGFzc05hbWUpICk7XG5cdFx0XHR9KTtcblx0XHR9XG5cblx0XHRpZiAoICh2YWx1ZSAmJiB0eXBlb2YgdmFsdWUgPT09IFwic3RyaW5nXCIpIHx8IHZhbHVlID09PSB1bmRlZmluZWQgKSB7XG5cdFx0XHRjbGFzc05hbWVzID0gKHZhbHVlIHx8IFwiXCIpLnNwbGl0KCByc3BhY2UgKTtcblxuXHRcdFx0Zm9yICggaSA9IDAsIGwgPSB0aGlzLmxlbmd0aDsgaSA8IGw7IGkrKyApIHtcblx0XHRcdFx0ZWxlbSA9IHRoaXNbIGkgXTtcblxuXHRcdFx0XHRpZiAoIGVsZW0ubm9kZVR5cGUgPT09IDEgJiYgZWxlbS5jbGFzc05hbWUgKSB7XG5cdFx0XHRcdFx0aWYgKCB2YWx1ZSApIHtcblx0XHRcdFx0XHRcdGNsYXNzTmFtZSA9IChcIiBcIiArIGVsZW0uY2xhc3NOYW1lICsgXCIgXCIpLnJlcGxhY2UoIHJjbGFzcywgXCIgXCIgKTtcblx0XHRcdFx0XHRcdGZvciAoIGMgPSAwLCBjbCA9IGNsYXNzTmFtZXMubGVuZ3RoOyBjIDwgY2w7IGMrKyApIHtcblx0XHRcdFx0XHRcdFx0Y2xhc3NOYW1lID0gY2xhc3NOYW1lLnJlcGxhY2UoXCIgXCIgKyBjbGFzc05hbWVzWyBjIF0gKyBcIiBcIiwgXCIgXCIpO1xuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0ZWxlbS5jbGFzc05hbWUgPSBqUXVlcnkudHJpbSggY2xhc3NOYW1lICk7XG5cblx0XHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdFx0ZWxlbS5jbGFzc05hbWUgPSBcIlwiO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0fVxuXHRcdFx0fVxuXHRcdH1cblxuXHRcdHJldHVybiB0aGlzO1xuXHR9LFxuXG5cdHRvZ2dsZUNsYXNzOiBmdW5jdGlvbiggdmFsdWUsIHN0YXRlVmFsICkge1xuXHRcdHZhciB0eXBlID0gdHlwZW9mIHZhbHVlLFxuXHRcdFx0aXNCb29sID0gdHlwZW9mIHN0YXRlVmFsID09PSBcImJvb2xlYW5cIjtcblxuXHRcdGlmICggalF1ZXJ5LmlzRnVuY3Rpb24oIHZhbHVlICkgKSB7XG5cdFx0XHRyZXR1cm4gdGhpcy5lYWNoKGZ1bmN0aW9uKCBpICkge1xuXHRcdFx0XHRqUXVlcnkoIHRoaXMgKS50b2dnbGVDbGFzcyggdmFsdWUuY2FsbCh0aGlzLCBpLCB0aGlzLmNsYXNzTmFtZSwgc3RhdGVWYWwpLCBzdGF0ZVZhbCApO1xuXHRcdFx0fSk7XG5cdFx0fVxuXG5cdFx0cmV0dXJuIHRoaXMuZWFjaChmdW5jdGlvbigpIHtcblx0XHRcdGlmICggdHlwZSA9PT0gXCJzdHJpbmdcIiApIHtcblx0XHRcdFx0Ly8gdG9nZ2xlIGluZGl2aWR1YWwgY2xhc3MgbmFtZXNcblx0XHRcdFx0dmFyIGNsYXNzTmFtZSxcblx0XHRcdFx0XHRpID0gMCxcblx0XHRcdFx0XHRzZWxmID0galF1ZXJ5KCB0aGlzICksXG5cdFx0XHRcdFx0c3RhdGUgPSBzdGF0ZVZhbCxcblx0XHRcdFx0XHRjbGFzc05hbWVzID0gdmFsdWUuc3BsaXQoIHJzcGFjZSApO1xuXG5cdFx0XHRcdHdoaWxlICggKGNsYXNzTmFtZSA9IGNsYXNzTmFtZXNbIGkrKyBdKSApIHtcblx0XHRcdFx0XHQvLyBjaGVjayBlYWNoIGNsYXNzTmFtZSBnaXZlbiwgc3BhY2Ugc2VwZXJhdGVkIGxpc3Rcblx0XHRcdFx0XHRzdGF0ZSA9IGlzQm9vbCA/IHN0YXRlIDogIXNlbGYuaGFzQ2xhc3MoIGNsYXNzTmFtZSApO1xuXHRcdFx0XHRcdHNlbGZbIHN0YXRlID8gXCJhZGRDbGFzc1wiIDogXCJyZW1vdmVDbGFzc1wiIF0oIGNsYXNzTmFtZSApO1xuXHRcdFx0XHR9XG5cblx0XHRcdH0gZWxzZSBpZiAoIHR5cGUgPT09IFwidW5kZWZpbmVkXCIgfHwgdHlwZSA9PT0gXCJib29sZWFuXCIgKSB7XG5cdFx0XHRcdGlmICggdGhpcy5jbGFzc05hbWUgKSB7XG5cdFx0XHRcdFx0Ly8gc3RvcmUgY2xhc3NOYW1lIGlmIHNldFxuXHRcdFx0XHRcdGpRdWVyeS5fZGF0YSggdGhpcywgXCJfX2NsYXNzTmFtZV9fXCIsIHRoaXMuY2xhc3NOYW1lICk7XG5cdFx0XHRcdH1cblxuXHRcdFx0XHQvLyB0b2dnbGUgd2hvbGUgY2xhc3NOYW1lXG5cdFx0XHRcdHRoaXMuY2xhc3NOYW1lID0gdGhpcy5jbGFzc05hbWUgfHwgdmFsdWUgPT09IGZhbHNlID8gXCJcIiA6IGpRdWVyeS5fZGF0YSggdGhpcywgXCJfX2NsYXNzTmFtZV9fXCIgKSB8fCBcIlwiO1xuXHRcdFx0fVxuXHRcdH0pO1xuXHR9LFxuXG5cdGhhc0NsYXNzOiBmdW5jdGlvbiggc2VsZWN0b3IgKSB7XG5cdFx0dmFyIGNsYXNzTmFtZSA9IFwiIFwiICsgc2VsZWN0b3IgKyBcIiBcIjtcblx0XHRmb3IgKCB2YXIgaSA9IDAsIGwgPSB0aGlzLmxlbmd0aDsgaSA8IGw7IGkrKyApIHtcblx0XHRcdGlmICggdGhpc1tpXS5ub2RlVHlwZSA9PT0gMSAmJiAoXCIgXCIgKyB0aGlzW2ldLmNsYXNzTmFtZSArIFwiIFwiKS5yZXBsYWNlKHJjbGFzcywgXCIgXCIpLmluZGV4T2YoIGNsYXNzTmFtZSApID4gLTEgKSB7XG5cdFx0XHRcdHJldHVybiB0cnVlO1xuXHRcdFx0fVxuXHRcdH1cblxuXHRcdHJldHVybiBmYWxzZTtcblx0fSxcblxuXHR2YWw6IGZ1bmN0aW9uKCB2YWx1ZSApIHtcblx0XHR2YXIgaG9va3MsIHJldCxcblx0XHRcdGVsZW0gPSB0aGlzWzBdO1xuXG5cdFx0aWYgKCAhYXJndW1lbnRzLmxlbmd0aCApIHtcblx0XHRcdGlmICggZWxlbSApIHtcblx0XHRcdFx0aG9va3MgPSBqUXVlcnkudmFsSG9va3NbIGVsZW0ubm9kZU5hbWUudG9Mb3dlckNhc2UoKSBdIHx8IGpRdWVyeS52YWxIb29rc1sgZWxlbS50eXBlIF07XG5cblx0XHRcdFx0aWYgKCBob29rcyAmJiBcImdldFwiIGluIGhvb2tzICYmIChyZXQgPSBob29rcy5nZXQoIGVsZW0sIFwidmFsdWVcIiApKSAhPT0gdW5kZWZpbmVkICkge1xuXHRcdFx0XHRcdHJldHVybiByZXQ7XG5cdFx0XHRcdH1cblxuXHRcdFx0XHRyZXQgPSBlbGVtLnZhbHVlO1xuXG5cdFx0XHRcdHJldHVybiB0eXBlb2YgcmV0ID09PSBcInN0cmluZ1wiID9cblx0XHRcdFx0XHQvLyBoYW5kbGUgbW9zdCBjb21tb24gc3RyaW5nIGNhc2VzXG5cdFx0XHRcdFx0cmV0LnJlcGxhY2UocnJldHVybiwgXCJcIikgOlxuXHRcdFx0XHRcdC8vIGhhbmRsZSBjYXNlcyB3aGVyZSB2YWx1ZSBpcyBudWxsL3VuZGVmIG9yIG51bWJlclxuXHRcdFx0XHRcdHJldCA9PSBudWxsID8gXCJcIiA6IHJldDtcblx0XHRcdH1cblxuXHRcdFx0cmV0dXJuIHVuZGVmaW5lZDtcblx0XHR9XG5cblx0XHR2YXIgaXNGdW5jdGlvbiA9IGpRdWVyeS5pc0Z1bmN0aW9uKCB2YWx1ZSApO1xuXG5cdFx0cmV0dXJuIHRoaXMuZWFjaChmdW5jdGlvbiggaSApIHtcblx0XHRcdHZhciBzZWxmID0galF1ZXJ5KHRoaXMpLCB2YWw7XG5cblx0XHRcdGlmICggdGhpcy5ub2RlVHlwZSAhPT0gMSApIHtcblx0XHRcdFx0cmV0dXJuO1xuXHRcdFx0fVxuXG5cdFx0XHRpZiAoIGlzRnVuY3Rpb24gKSB7XG5cdFx0XHRcdHZhbCA9IHZhbHVlLmNhbGwoIHRoaXMsIGksIHNlbGYudmFsKCkgKTtcblx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdHZhbCA9IHZhbHVlO1xuXHRcdFx0fVxuXG5cdFx0XHQvLyBUcmVhdCBudWxsL3VuZGVmaW5lZCBhcyBcIlwiOyBjb252ZXJ0IG51bWJlcnMgdG8gc3RyaW5nXG5cdFx0XHRpZiAoIHZhbCA9PSBudWxsICkge1xuXHRcdFx0XHR2YWwgPSBcIlwiO1xuXHRcdFx0fSBlbHNlIGlmICggdHlwZW9mIHZhbCA9PT0gXCJudW1iZXJcIiApIHtcblx0XHRcdFx0dmFsICs9IFwiXCI7XG5cdFx0XHR9IGVsc2UgaWYgKCBqUXVlcnkuaXNBcnJheSggdmFsICkgKSB7XG5cdFx0XHRcdHZhbCA9IGpRdWVyeS5tYXAodmFsLCBmdW5jdGlvbiAoIHZhbHVlICkge1xuXHRcdFx0XHRcdHJldHVybiB2YWx1ZSA9PSBudWxsID8gXCJcIiA6IHZhbHVlICsgXCJcIjtcblx0XHRcdFx0fSk7XG5cdFx0XHR9XG5cblx0XHRcdGhvb2tzID0galF1ZXJ5LnZhbEhvb2tzWyB0aGlzLm5vZGVOYW1lLnRvTG93ZXJDYXNlKCkgXSB8fCBqUXVlcnkudmFsSG9va3NbIHRoaXMudHlwZSBdO1xuXG5cdFx0XHQvLyBJZiBzZXQgcmV0dXJucyB1bmRlZmluZWQsIGZhbGwgYmFjayB0byBub3JtYWwgc2V0dGluZ1xuXHRcdFx0aWYgKCAhaG9va3MgfHwgIShcInNldFwiIGluIGhvb2tzKSB8fCBob29rcy5zZXQoIHRoaXMsIHZhbCwgXCJ2YWx1ZVwiICkgPT09IHVuZGVmaW5lZCApIHtcblx0XHRcdFx0dGhpcy52YWx1ZSA9IHZhbDtcblx0XHRcdH1cblx0XHR9KTtcblx0fVxufSk7XG5cbmpRdWVyeS5leHRlbmQoe1xuXHR2YWxIb29rczoge1xuXHRcdG9wdGlvbjoge1xuXHRcdFx0Z2V0OiBmdW5jdGlvbiggZWxlbSApIHtcblx0XHRcdFx0Ly8gYXR0cmlidXRlcy52YWx1ZSBpcyB1bmRlZmluZWQgaW4gQmxhY2tiZXJyeSA0LjcgYnV0XG5cdFx0XHRcdC8vIHVzZXMgLnZhbHVlLiBTZWUgIzY5MzJcblx0XHRcdFx0dmFyIHZhbCA9IGVsZW0uYXR0cmlidXRlcy52YWx1ZTtcblx0XHRcdFx0cmV0dXJuICF2YWwgfHwgdmFsLnNwZWNpZmllZCA/IGVsZW0udmFsdWUgOiBlbGVtLnRleHQ7XG5cdFx0XHR9XG5cdFx0fSxcblx0XHRzZWxlY3Q6IHtcblx0XHRcdGdldDogZnVuY3Rpb24oIGVsZW0gKSB7XG5cdFx0XHRcdHZhciB2YWx1ZSxcblx0XHRcdFx0XHRpbmRleCA9IGVsZW0uc2VsZWN0ZWRJbmRleCxcblx0XHRcdFx0XHR2YWx1ZXMgPSBbXSxcblx0XHRcdFx0XHRvcHRpb25zID0gZWxlbS5vcHRpb25zLFxuXHRcdFx0XHRcdG9uZSA9IGVsZW0udHlwZSA9PT0gXCJzZWxlY3Qtb25lXCI7XG5cblx0XHRcdFx0Ly8gTm90aGluZyB3YXMgc2VsZWN0ZWRcblx0XHRcdFx0aWYgKCBpbmRleCA8IDAgKSB7XG5cdFx0XHRcdFx0cmV0dXJuIG51bGw7XG5cdFx0XHRcdH1cblxuXHRcdFx0XHQvLyBMb29wIHRocm91Z2ggYWxsIHRoZSBzZWxlY3RlZCBvcHRpb25zXG5cdFx0XHRcdGZvciAoIHZhciBpID0gb25lID8gaW5kZXggOiAwLCBtYXggPSBvbmUgPyBpbmRleCArIDEgOiBvcHRpb25zLmxlbmd0aDsgaSA8IG1heDsgaSsrICkge1xuXHRcdFx0XHRcdHZhciBvcHRpb24gPSBvcHRpb25zWyBpIF07XG5cblx0XHRcdFx0XHQvLyBEb24ndCByZXR1cm4gb3B0aW9ucyB0aGF0IGFyZSBkaXNhYmxlZCBvciBpbiBhIGRpc2FibGVkIG9wdGdyb3VwXG5cdFx0XHRcdFx0aWYgKCBvcHRpb24uc2VsZWN0ZWQgJiYgKGpRdWVyeS5zdXBwb3J0Lm9wdERpc2FibGVkID8gIW9wdGlvbi5kaXNhYmxlZCA6IG9wdGlvbi5nZXRBdHRyaWJ1dGUoXCJkaXNhYmxlZFwiKSA9PT0gbnVsbCkgJiZcblx0XHRcdFx0XHRcdFx0KCFvcHRpb24ucGFyZW50Tm9kZS5kaXNhYmxlZCB8fCAhalF1ZXJ5Lm5vZGVOYW1lKCBvcHRpb24ucGFyZW50Tm9kZSwgXCJvcHRncm91cFwiICkpICkge1xuXG5cdFx0XHRcdFx0XHQvLyBHZXQgdGhlIHNwZWNpZmljIHZhbHVlIGZvciB0aGUgb3B0aW9uXG5cdFx0XHRcdFx0XHR2YWx1ZSA9IGpRdWVyeSggb3B0aW9uICkudmFsKCk7XG5cblx0XHRcdFx0XHRcdC8vIFdlIGRvbid0IG5lZWQgYW4gYXJyYXkgZm9yIG9uZSBzZWxlY3RzXG5cdFx0XHRcdFx0XHRpZiAoIG9uZSApIHtcblx0XHRcdFx0XHRcdFx0cmV0dXJuIHZhbHVlO1xuXHRcdFx0XHRcdFx0fVxuXG5cdFx0XHRcdFx0XHQvLyBNdWx0aS1TZWxlY3RzIHJldHVybiBhbiBhcnJheVxuXHRcdFx0XHRcdFx0dmFsdWVzLnB1c2goIHZhbHVlICk7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9XG5cblx0XHRcdFx0Ly8gRml4ZXMgQnVnICMyNTUxIC0tIHNlbGVjdC52YWwoKSBicm9rZW4gaW4gSUUgYWZ0ZXIgZm9ybS5yZXNldCgpXG5cdFx0XHRcdGlmICggb25lICYmICF2YWx1ZXMubGVuZ3RoICYmIG9wdGlvbnMubGVuZ3RoICkge1xuXHRcdFx0XHRcdHJldHVybiBqUXVlcnkoIG9wdGlvbnNbIGluZGV4IF0gKS52YWwoKTtcblx0XHRcdFx0fVxuXG5cdFx0XHRcdHJldHVybiB2YWx1ZXM7XG5cdFx0XHR9LFxuXG5cdFx0XHRzZXQ6IGZ1bmN0aW9uKCBlbGVtLCB2YWx1ZSApIHtcblx0XHRcdFx0dmFyIHZhbHVlcyA9IGpRdWVyeS5tYWtlQXJyYXkoIHZhbHVlICk7XG5cblx0XHRcdFx0alF1ZXJ5KGVsZW0pLmZpbmQoXCJvcHRpb25cIikuZWFjaChmdW5jdGlvbigpIHtcblx0XHRcdFx0XHR0aGlzLnNlbGVjdGVkID0galF1ZXJ5LmluQXJyYXkoIGpRdWVyeSh0aGlzKS52YWwoKSwgdmFsdWVzICkgPj0gMDtcblx0XHRcdFx0fSk7XG5cblx0XHRcdFx0aWYgKCAhdmFsdWVzLmxlbmd0aCApIHtcblx0XHRcdFx0XHRlbGVtLnNlbGVjdGVkSW5kZXggPSAtMTtcblx0XHRcdFx0fVxuXHRcdFx0XHRyZXR1cm4gdmFsdWVzO1xuXHRcdFx0fVxuXHRcdH1cblx0fSxcblxuXHRhdHRyRm46IHtcblx0XHR2YWw6IHRydWUsXG5cdFx0Y3NzOiB0cnVlLFxuXHRcdGh0bWw6IHRydWUsXG5cdFx0dGV4dDogdHJ1ZSxcblx0XHRkYXRhOiB0cnVlLFxuXHRcdHdpZHRoOiB0cnVlLFxuXHRcdGhlaWdodDogdHJ1ZSxcblx0XHRvZmZzZXQ6IHRydWVcblx0fSxcblxuXHRhdHRyOiBmdW5jdGlvbiggZWxlbSwgbmFtZSwgdmFsdWUsIHBhc3MgKSB7XG5cdFx0dmFyIG5UeXBlID0gZWxlbS5ub2RlVHlwZTtcblxuXHRcdC8vIGRvbid0IGdldC9zZXQgYXR0cmlidXRlcyBvbiB0ZXh0LCBjb21tZW50IGFuZCBhdHRyaWJ1dGUgbm9kZXNcblx0XHRpZiAoICFlbGVtIHx8IG5UeXBlID09PSAzIHx8IG5UeXBlID09PSA4IHx8IG5UeXBlID09PSAyICkge1xuXHRcdFx0cmV0dXJuIHVuZGVmaW5lZDtcblx0XHR9XG5cblx0XHRpZiAoIHBhc3MgJiYgbmFtZSBpbiBqUXVlcnkuYXR0ckZuICkge1xuXHRcdFx0cmV0dXJuIGpRdWVyeSggZWxlbSApWyBuYW1lIF0oIHZhbHVlICk7XG5cdFx0fVxuXG5cdFx0Ly8gRmFsbGJhY2sgdG8gcHJvcCB3aGVuIGF0dHJpYnV0ZXMgYXJlIG5vdCBzdXBwb3J0ZWRcblx0XHRpZiAoICEoXCJnZXRBdHRyaWJ1dGVcIiBpbiBlbGVtKSApIHtcblx0XHRcdHJldHVybiBqUXVlcnkucHJvcCggZWxlbSwgbmFtZSwgdmFsdWUgKTtcblx0XHR9XG5cblx0XHR2YXIgcmV0LCBob29rcyxcblx0XHRcdG5vdHhtbCA9IG5UeXBlICE9PSAxIHx8ICFqUXVlcnkuaXNYTUxEb2MoIGVsZW0gKTtcblxuXHRcdC8vIE5vcm1hbGl6ZSB0aGUgbmFtZSBpZiBuZWVkZWRcblx0XHRpZiAoIG5vdHhtbCApIHtcblx0XHRcdG5hbWUgPSBuYW1lLnRvTG93ZXJDYXNlKCk7XG5cdFx0XHRob29rcyA9IGpRdWVyeS5hdHRySG9va3NbIG5hbWUgXSB8fCAocmJvb2xlYW4udGVzdCggbmFtZSApID8gYm9vbEhvb2sgOiBub2RlSG9vayk7XG5cdFx0fVxuXG5cdFx0aWYgKCB2YWx1ZSAhPT0gdW5kZWZpbmVkICkge1xuXG5cdFx0XHRpZiAoIHZhbHVlID09PSBudWxsICkge1xuXHRcdFx0XHRqUXVlcnkucmVtb3ZlQXR0ciggZWxlbSwgbmFtZSApO1xuXHRcdFx0XHRyZXR1cm4gdW5kZWZpbmVkO1xuXG5cdFx0XHR9IGVsc2UgaWYgKCBob29rcyAmJiBcInNldFwiIGluIGhvb2tzICYmIG5vdHhtbCAmJiAocmV0ID0gaG9va3Muc2V0KCBlbGVtLCB2YWx1ZSwgbmFtZSApKSAhPT0gdW5kZWZpbmVkICkge1xuXHRcdFx0XHRyZXR1cm4gcmV0O1xuXG5cdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRlbGVtLnNldEF0dHJpYnV0ZSggbmFtZSwgXCJcIiArIHZhbHVlICk7XG5cdFx0XHRcdHJldHVybiB2YWx1ZTtcblx0XHRcdH1cblxuXHRcdH0gZWxzZSBpZiAoIGhvb2tzICYmIFwiZ2V0XCIgaW4gaG9va3MgJiYgbm90eG1sICYmIChyZXQgPSBob29rcy5nZXQoIGVsZW0sIG5hbWUgKSkgIT09IG51bGwgKSB7XG5cdFx0XHRyZXR1cm4gcmV0O1xuXG5cdFx0fSBlbHNlIHtcblxuXHRcdFx0cmV0ID0gZWxlbS5nZXRBdHRyaWJ1dGUoIG5hbWUgKTtcblxuXHRcdFx0Ly8gTm9uLWV4aXN0ZW50IGF0dHJpYnV0ZXMgcmV0dXJuIG51bGwsIHdlIG5vcm1hbGl6ZSB0byB1bmRlZmluZWRcblx0XHRcdHJldHVybiByZXQgPT09IG51bGwgP1xuXHRcdFx0XHR1bmRlZmluZWQgOlxuXHRcdFx0XHRyZXQ7XG5cdFx0fVxuXHR9LFxuXG5cdHJlbW92ZUF0dHI6IGZ1bmN0aW9uKCBlbGVtLCB2YWx1ZSApIHtcblx0XHR2YXIgcHJvcE5hbWUsIGF0dHJOYW1lcywgbmFtZSwgbCxcblx0XHRcdGkgPSAwO1xuXG5cdFx0aWYgKCBlbGVtLm5vZGVUeXBlID09PSAxICkge1xuXHRcdFx0YXR0ck5hbWVzID0gKHZhbHVlIHx8IFwiXCIpLnNwbGl0KCByc3BhY2UgKTtcblx0XHRcdGwgPSBhdHRyTmFtZXMubGVuZ3RoO1xuXG5cdFx0XHRmb3IgKCA7IGkgPCBsOyBpKysgKSB7XG5cdFx0XHRcdG5hbWUgPSBhdHRyTmFtZXNbIGkgXS50b0xvd2VyQ2FzZSgpO1xuXG5cdFx0XHRcdC8vIFNlZSAjOTY5OSBmb3IgZXhwbGFuYXRpb24gb2YgdGhpcyBhcHByb2FjaCAoc2V0dGluZyBmaXJzdCwgdGhlbiByZW1vdmFsKVxuXHRcdFx0XHRqUXVlcnkuYXR0ciggZWxlbSwgbmFtZSwgXCJcIiApO1xuXHRcdFx0XHRlbGVtLnJlbW92ZUF0dHJpYnV0ZSggbmFtZSApO1xuXG5cdFx0XHRcdC8vIFNldCBjb3JyZXNwb25kaW5nIHByb3BlcnR5IHRvIGZhbHNlIGZvciBib29sZWFuIGF0dHJpYnV0ZXNcblx0XHRcdFx0aWYgKCByYm9vbGVhbi50ZXN0KCBuYW1lICkgJiYgKHByb3BOYW1lID0galF1ZXJ5LnByb3BGaXhbIG5hbWUgXSB8fCBuYW1lKSBpbiBlbGVtICkge1xuXHRcdFx0XHRcdGVsZW1bIHByb3BOYW1lIF0gPSBmYWxzZTtcblx0XHRcdFx0fVxuXHRcdFx0fVxuXHRcdH1cblx0fSxcblxuXHRhdHRySG9va3M6IHtcblx0XHR0eXBlOiB7XG5cdFx0XHRzZXQ6IGZ1bmN0aW9uKCBlbGVtLCB2YWx1ZSApIHtcblx0XHRcdFx0Ly8gV2UgY2FuJ3QgYWxsb3cgdGhlIHR5cGUgcHJvcGVydHkgdG8gYmUgY2hhbmdlZCAoc2luY2UgaXQgY2F1c2VzIHByb2JsZW1zIGluIElFKVxuXHRcdFx0XHRpZiAoIHJ0eXBlLnRlc3QoIGVsZW0ubm9kZU5hbWUgKSAmJiBlbGVtLnBhcmVudE5vZGUgKSB7XG5cdFx0XHRcdFx0alF1ZXJ5LmVycm9yKCBcInR5cGUgcHJvcGVydHkgY2FuJ3QgYmUgY2hhbmdlZFwiICk7XG5cdFx0XHRcdH0gZWxzZSBpZiAoICFqUXVlcnkuc3VwcG9ydC5yYWRpb1ZhbHVlICYmIHZhbHVlID09PSBcInJhZGlvXCIgJiYgalF1ZXJ5Lm5vZGVOYW1lKGVsZW0sIFwiaW5wdXRcIikgKSB7XG5cdFx0XHRcdFx0Ly8gU2V0dGluZyB0aGUgdHlwZSBvbiBhIHJhZGlvIGJ1dHRvbiBhZnRlciB0aGUgdmFsdWUgcmVzZXRzIHRoZSB2YWx1ZSBpbiBJRTYtOVxuXHRcdFx0XHRcdC8vIFJlc2V0IHZhbHVlIHRvIGl0J3MgZGVmYXVsdCBpbiBjYXNlIHR5cGUgaXMgc2V0IGFmdGVyIHZhbHVlXG5cdFx0XHRcdFx0Ly8gVGhpcyBpcyBmb3IgZWxlbWVudCBjcmVhdGlvblxuXHRcdFx0XHRcdHZhciB2YWwgPSBlbGVtLnZhbHVlO1xuXHRcdFx0XHRcdGVsZW0uc2V0QXR0cmlidXRlKCBcInR5cGVcIiwgdmFsdWUgKTtcblx0XHRcdFx0XHRpZiAoIHZhbCApIHtcblx0XHRcdFx0XHRcdGVsZW0udmFsdWUgPSB2YWw7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHRcdHJldHVybiB2YWx1ZTtcblx0XHRcdFx0fVxuXHRcdFx0fVxuXHRcdH0sXG5cdFx0Ly8gVXNlIHRoZSB2YWx1ZSBwcm9wZXJ0eSBmb3IgYmFjayBjb21wYXRcblx0XHQvLyBVc2UgdGhlIG5vZGVIb29rIGZvciBidXR0b24gZWxlbWVudHMgaW4gSUU2LzcgKCMxOTU0KVxuXHRcdHZhbHVlOiB7XG5cdFx0XHRnZXQ6IGZ1bmN0aW9uKCBlbGVtLCBuYW1lICkge1xuXHRcdFx0XHRpZiAoIG5vZGVIb29rICYmIGpRdWVyeS5ub2RlTmFtZSggZWxlbSwgXCJidXR0b25cIiApICkge1xuXHRcdFx0XHRcdHJldHVybiBub2RlSG9vay5nZXQoIGVsZW0sIG5hbWUgKTtcblx0XHRcdFx0fVxuXHRcdFx0XHRyZXR1cm4gbmFtZSBpbiBlbGVtID9cblx0XHRcdFx0XHRlbGVtLnZhbHVlIDpcblx0XHRcdFx0XHRudWxsO1xuXHRcdFx0fSxcblx0XHRcdHNldDogZnVuY3Rpb24oIGVsZW0sIHZhbHVlLCBuYW1lICkge1xuXHRcdFx0XHRpZiAoIG5vZGVIb29rICYmIGpRdWVyeS5ub2RlTmFtZSggZWxlbSwgXCJidXR0b25cIiApICkge1xuXHRcdFx0XHRcdHJldHVybiBub2RlSG9vay5zZXQoIGVsZW0sIHZhbHVlLCBuYW1lICk7XG5cdFx0XHRcdH1cblx0XHRcdFx0Ly8gRG9lcyBub3QgcmV0dXJuIHNvIHRoYXQgc2V0QXR0cmlidXRlIGlzIGFsc28gdXNlZFxuXHRcdFx0XHRlbGVtLnZhbHVlID0gdmFsdWU7XG5cdFx0XHR9XG5cdFx0fVxuXHR9LFxuXG5cdHByb3BGaXg6IHtcblx0XHR0YWJpbmRleDogXCJ0YWJJbmRleFwiLFxuXHRcdHJlYWRvbmx5OiBcInJlYWRPbmx5XCIsXG5cdFx0XCJmb3JcIjogXCJodG1sRm9yXCIsXG5cdFx0XCJjbGFzc1wiOiBcImNsYXNzTmFtZVwiLFxuXHRcdG1heGxlbmd0aDogXCJtYXhMZW5ndGhcIixcblx0XHRjZWxsc3BhY2luZzogXCJjZWxsU3BhY2luZ1wiLFxuXHRcdGNlbGxwYWRkaW5nOiBcImNlbGxQYWRkaW5nXCIsXG5cdFx0cm93c3BhbjogXCJyb3dTcGFuXCIsXG5cdFx0Y29sc3BhbjogXCJjb2xTcGFuXCIsXG5cdFx0dXNlbWFwOiBcInVzZU1hcFwiLFxuXHRcdGZyYW1lYm9yZGVyOiBcImZyYW1lQm9yZGVyXCIsXG5cdFx0Y29udGVudGVkaXRhYmxlOiBcImNvbnRlbnRFZGl0YWJsZVwiXG5cdH0sXG5cblx0cHJvcDogZnVuY3Rpb24oIGVsZW0sIG5hbWUsIHZhbHVlICkge1xuXHRcdHZhciBuVHlwZSA9IGVsZW0ubm9kZVR5cGU7XG5cblx0XHQvLyBkb24ndCBnZXQvc2V0IHByb3BlcnRpZXMgb24gdGV4dCwgY29tbWVudCBhbmQgYXR0cmlidXRlIG5vZGVzXG5cdFx0aWYgKCAhZWxlbSB8fCBuVHlwZSA9PT0gMyB8fCBuVHlwZSA9PT0gOCB8fCBuVHlwZSA9PT0gMiApIHtcblx0XHRcdHJldHVybiB1bmRlZmluZWQ7XG5cdFx0fVxuXG5cdFx0dmFyIHJldCwgaG9va3MsXG5cdFx0XHRub3R4bWwgPSBuVHlwZSAhPT0gMSB8fCAhalF1ZXJ5LmlzWE1MRG9jKCBlbGVtICk7XG5cblx0XHRpZiAoIG5vdHhtbCApIHtcblx0XHRcdC8vIEZpeCBuYW1lIGFuZCBhdHRhY2ggaG9va3Ncblx0XHRcdG5hbWUgPSBqUXVlcnkucHJvcEZpeFsgbmFtZSBdIHx8IG5hbWU7XG5cdFx0XHRob29rcyA9IGpRdWVyeS5wcm9wSG9va3NbIG5hbWUgXTtcblx0XHR9XG5cblx0XHRpZiAoIHZhbHVlICE9PSB1bmRlZmluZWQgKSB7XG5cdFx0XHRpZiAoIGhvb2tzICYmIFwic2V0XCIgaW4gaG9va3MgJiYgKHJldCA9IGhvb2tzLnNldCggZWxlbSwgdmFsdWUsIG5hbWUgKSkgIT09IHVuZGVmaW5lZCApIHtcblx0XHRcdFx0cmV0dXJuIHJldDtcblxuXHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0cmV0dXJuIChlbGVtWyBuYW1lIF0gPSB2YWx1ZSk7XG5cdFx0XHR9XG5cblx0XHR9IGVsc2Uge1xuXHRcdFx0aWYgKCBob29rcyAmJiBcImdldFwiIGluIGhvb2tzICYmIChyZXQgPSBob29rcy5nZXQoIGVsZW0sIG5hbWUgKSkgIT09IG51bGwgKSB7XG5cdFx0XHRcdHJldHVybiByZXQ7XG5cblx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdHJldHVybiBlbGVtWyBuYW1lIF07XG5cdFx0XHR9XG5cdFx0fVxuXHR9LFxuXG5cdHByb3BIb29rczoge1xuXHRcdHRhYkluZGV4OiB7XG5cdFx0XHRnZXQ6IGZ1bmN0aW9uKCBlbGVtICkge1xuXHRcdFx0XHQvLyBlbGVtLnRhYkluZGV4IGRvZXNuJ3QgYWx3YXlzIHJldHVybiB0aGUgY29ycmVjdCB2YWx1ZSB3aGVuIGl0IGhhc24ndCBiZWVuIGV4cGxpY2l0bHkgc2V0XG5cdFx0XHRcdC8vIGh0dHA6Ly9mbHVpZHByb2plY3Qub3JnL2Jsb2cvMjAwOC8wMS8wOS9nZXR0aW5nLXNldHRpbmctYW5kLXJlbW92aW5nLXRhYmluZGV4LXZhbHVlcy13aXRoLWphdmFzY3JpcHQvXG5cdFx0XHRcdHZhciBhdHRyaWJ1dGVOb2RlID0gZWxlbS5nZXRBdHRyaWJ1dGVOb2RlKFwidGFiaW5kZXhcIik7XG5cblx0XHRcdFx0cmV0dXJuIGF0dHJpYnV0ZU5vZGUgJiYgYXR0cmlidXRlTm9kZS5zcGVjaWZpZWQgP1xuXHRcdFx0XHRcdHBhcnNlSW50KCBhdHRyaWJ1dGVOb2RlLnZhbHVlLCAxMCApIDpcblx0XHRcdFx0XHRyZm9jdXNhYmxlLnRlc3QoIGVsZW0ubm9kZU5hbWUgKSB8fCByY2xpY2thYmxlLnRlc3QoIGVsZW0ubm9kZU5hbWUgKSAmJiBlbGVtLmhyZWYgP1xuXHRcdFx0XHRcdFx0MCA6XG5cdFx0XHRcdFx0XHR1bmRlZmluZWQ7XG5cdFx0XHR9XG5cdFx0fVxuXHR9XG59KTtcblxuLy8gQWRkIHRoZSB0YWJJbmRleCBwcm9wSG9vayB0byBhdHRySG9va3MgZm9yIGJhY2stY29tcGF0IChkaWZmZXJlbnQgY2FzZSBpcyBpbnRlbnRpb25hbClcbmpRdWVyeS5hdHRySG9va3MudGFiaW5kZXggPSBqUXVlcnkucHJvcEhvb2tzLnRhYkluZGV4O1xuXG4vLyBIb29rIGZvciBib29sZWFuIGF0dHJpYnV0ZXNcbmJvb2xIb29rID0ge1xuXHRnZXQ6IGZ1bmN0aW9uKCBlbGVtLCBuYW1lICkge1xuXHRcdC8vIEFsaWduIGJvb2xlYW4gYXR0cmlidXRlcyB3aXRoIGNvcnJlc3BvbmRpbmcgcHJvcGVydGllc1xuXHRcdC8vIEZhbGwgYmFjayB0byBhdHRyaWJ1dGUgcHJlc2VuY2Ugd2hlcmUgc29tZSBib29sZWFucyBhcmUgbm90IHN1cHBvcnRlZFxuXHRcdHZhciBhdHRyTm9kZSxcblx0XHRcdHByb3BlcnR5ID0galF1ZXJ5LnByb3AoIGVsZW0sIG5hbWUgKTtcblx0XHRyZXR1cm4gcHJvcGVydHkgPT09IHRydWUgfHwgdHlwZW9mIHByb3BlcnR5ICE9PSBcImJvb2xlYW5cIiAmJiAoIGF0dHJOb2RlID0gZWxlbS5nZXRBdHRyaWJ1dGVOb2RlKG5hbWUpICkgJiYgYXR0ck5vZGUubm9kZVZhbHVlICE9PSBmYWxzZSA/XG5cdFx0XHRuYW1lLnRvTG93ZXJDYXNlKCkgOlxuXHRcdFx0dW5kZWZpbmVkO1xuXHR9LFxuXHRzZXQ6IGZ1bmN0aW9uKCBlbGVtLCB2YWx1ZSwgbmFtZSApIHtcblx0XHR2YXIgcHJvcE5hbWU7XG5cdFx0aWYgKCB2YWx1ZSA9PT0gZmFsc2UgKSB7XG5cdFx0XHQvLyBSZW1vdmUgYm9vbGVhbiBhdHRyaWJ1dGVzIHdoZW4gc2V0IHRvIGZhbHNlXG5cdFx0XHRqUXVlcnkucmVtb3ZlQXR0ciggZWxlbSwgbmFtZSApO1xuXHRcdH0gZWxzZSB7XG5cdFx0XHQvLyB2YWx1ZSBpcyB0cnVlIHNpbmNlIHdlIGtub3cgYXQgdGhpcyBwb2ludCBpdCdzIHR5cGUgYm9vbGVhbiBhbmQgbm90IGZhbHNlXG5cdFx0XHQvLyBTZXQgYm9vbGVhbiBhdHRyaWJ1dGVzIHRvIHRoZSBzYW1lIG5hbWUgYW5kIHNldCB0aGUgRE9NIHByb3BlcnR5XG5cdFx0XHRwcm9wTmFtZSA9IGpRdWVyeS5wcm9wRml4WyBuYW1lIF0gfHwgbmFtZTtcblx0XHRcdGlmICggcHJvcE5hbWUgaW4gZWxlbSApIHtcblx0XHRcdFx0Ly8gT25seSBzZXQgdGhlIElETCBzcGVjaWZpY2FsbHkgaWYgaXQgYWxyZWFkeSBleGlzdHMgb24gdGhlIGVsZW1lbnRcblx0XHRcdFx0ZWxlbVsgcHJvcE5hbWUgXSA9IHRydWU7XG5cdFx0XHR9XG5cblx0XHRcdGVsZW0uc2V0QXR0cmlidXRlKCBuYW1lLCBuYW1lLnRvTG93ZXJDYXNlKCkgKTtcblx0XHR9XG5cdFx0cmV0dXJuIG5hbWU7XG5cdH1cbn07XG5cbi8vIElFNi83IGRvIG5vdCBzdXBwb3J0IGdldHRpbmcvc2V0dGluZyBzb21lIGF0dHJpYnV0ZXMgd2l0aCBnZXQvc2V0QXR0cmlidXRlXG5pZiAoICFqUXVlcnkuc3VwcG9ydC5nZXRTZXRBdHRyaWJ1dGUgKSB7XG5cblx0Zml4U3BlY2lmaWVkID0ge1xuXHRcdG5hbWU6IHRydWUsXG5cdFx0aWQ6IHRydWVcblx0fTtcblxuXHQvLyBVc2UgdGhpcyBmb3IgYW55IGF0dHJpYnV0ZSBpbiBJRTYvN1xuXHQvLyBUaGlzIGZpeGVzIGFsbW9zdCBldmVyeSBJRTYvNyBpc3N1ZVxuXHRub2RlSG9vayA9IGpRdWVyeS52YWxIb29rcy5idXR0b24gPSB7XG5cdFx0Z2V0OiBmdW5jdGlvbiggZWxlbSwgbmFtZSApIHtcblx0XHRcdHZhciByZXQ7XG5cdFx0XHRyZXQgPSBlbGVtLmdldEF0dHJpYnV0ZU5vZGUoIG5hbWUgKTtcblx0XHRcdHJldHVybiByZXQgJiYgKGZpeFNwZWNpZmllZFsgbmFtZSBdID8gcmV0Lm5vZGVWYWx1ZSAhPT0gXCJcIiA6IHJldC5zcGVjaWZpZWQpID9cblx0XHRcdFx0cmV0Lm5vZGVWYWx1ZSA6XG5cdFx0XHRcdHVuZGVmaW5lZDtcblx0XHR9LFxuXHRcdHNldDogZnVuY3Rpb24oIGVsZW0sIHZhbHVlLCBuYW1lICkge1xuXHRcdFx0Ly8gU2V0IHRoZSBleGlzdGluZyBvciBjcmVhdGUgYSBuZXcgYXR0cmlidXRlIG5vZGVcblx0XHRcdHZhciByZXQgPSBlbGVtLmdldEF0dHJpYnV0ZU5vZGUoIG5hbWUgKTtcblx0XHRcdGlmICggIXJldCApIHtcblx0XHRcdFx0cmV0ID0gZG9jdW1lbnQuY3JlYXRlQXR0cmlidXRlKCBuYW1lICk7XG5cdFx0XHRcdGVsZW0uc2V0QXR0cmlidXRlTm9kZSggcmV0ICk7XG5cdFx0XHR9XG5cdFx0XHRyZXR1cm4gKHJldC5ub2RlVmFsdWUgPSB2YWx1ZSArIFwiXCIpO1xuXHRcdH1cblx0fTtcblxuXHQvLyBBcHBseSB0aGUgbm9kZUhvb2sgdG8gdGFiaW5kZXhcblx0alF1ZXJ5LmF0dHJIb29rcy50YWJpbmRleC5zZXQgPSBub2RlSG9vay5zZXQ7XG5cblx0Ly8gU2V0IHdpZHRoIGFuZCBoZWlnaHQgdG8gYXV0byBpbnN0ZWFkIG9mIDAgb24gZW1wdHkgc3RyaW5nKCBCdWcgIzgxNTAgKVxuXHQvLyBUaGlzIGlzIGZvciByZW1vdmFsc1xuXHRqUXVlcnkuZWFjaChbIFwid2lkdGhcIiwgXCJoZWlnaHRcIiBdLCBmdW5jdGlvbiggaSwgbmFtZSApIHtcblx0XHRqUXVlcnkuYXR0ckhvb2tzWyBuYW1lIF0gPSBqUXVlcnkuZXh0ZW5kKCBqUXVlcnkuYXR0ckhvb2tzWyBuYW1lIF0sIHtcblx0XHRcdHNldDogZnVuY3Rpb24oIGVsZW0sIHZhbHVlICkge1xuXHRcdFx0XHRpZiAoIHZhbHVlID09PSBcIlwiICkge1xuXHRcdFx0XHRcdGVsZW0uc2V0QXR0cmlidXRlKCBuYW1lLCBcImF1dG9cIiApO1xuXHRcdFx0XHRcdHJldHVybiB2YWx1ZTtcblx0XHRcdFx0fVxuXHRcdFx0fVxuXHRcdH0pO1xuXHR9KTtcblxuXHQvLyBTZXQgY29udGVudGVkaXRhYmxlIHRvIGZhbHNlIG9uIHJlbW92YWxzKCMxMDQyOSlcblx0Ly8gU2V0dGluZyB0byBlbXB0eSBzdHJpbmcgdGhyb3dzIGFuIGVycm9yIGFzIGFuIGludmFsaWQgdmFsdWVcblx0alF1ZXJ5LmF0dHJIb29rcy5jb250ZW50ZWRpdGFibGUgPSB7XG5cdFx0Z2V0OiBub2RlSG9vay5nZXQsXG5cdFx0c2V0OiBmdW5jdGlvbiggZWxlbSwgdmFsdWUsIG5hbWUgKSB7XG5cdFx0XHRpZiAoIHZhbHVlID09PSBcIlwiICkge1xuXHRcdFx0XHR2YWx1ZSA9IFwiZmFsc2VcIjtcblx0XHRcdH1cblx0XHRcdG5vZGVIb29rLnNldCggZWxlbSwgdmFsdWUsIG5hbWUgKTtcblx0XHR9XG5cdH07XG59XG5cblxuLy8gU29tZSBhdHRyaWJ1dGVzIHJlcXVpcmUgYSBzcGVjaWFsIGNhbGwgb24gSUVcbmlmICggIWpRdWVyeS5zdXBwb3J0LmhyZWZOb3JtYWxpemVkICkge1xuXHRqUXVlcnkuZWFjaChbIFwiaHJlZlwiLCBcInNyY1wiLCBcIndpZHRoXCIsIFwiaGVpZ2h0XCIgXSwgZnVuY3Rpb24oIGksIG5hbWUgKSB7XG5cdFx0alF1ZXJ5LmF0dHJIb29rc1sgbmFtZSBdID0galF1ZXJ5LmV4dGVuZCggalF1ZXJ5LmF0dHJIb29rc1sgbmFtZSBdLCB7XG5cdFx0XHRnZXQ6IGZ1bmN0aW9uKCBlbGVtICkge1xuXHRcdFx0XHR2YXIgcmV0ID0gZWxlbS5nZXRBdHRyaWJ1dGUoIG5hbWUsIDIgKTtcblx0XHRcdFx0cmV0dXJuIHJldCA9PT0gbnVsbCA/IHVuZGVmaW5lZCA6IHJldDtcblx0XHRcdH1cblx0XHR9KTtcblx0fSk7XG59XG5cbmlmICggIWpRdWVyeS5zdXBwb3J0LnN0eWxlICkge1xuXHRqUXVlcnkuYXR0ckhvb2tzLnN0eWxlID0ge1xuXHRcdGdldDogZnVuY3Rpb24oIGVsZW0gKSB7XG5cdFx0XHQvLyBSZXR1cm4gdW5kZWZpbmVkIGluIHRoZSBjYXNlIG9mIGVtcHR5IHN0cmluZ1xuXHRcdFx0Ly8gTm9ybWFsaXplIHRvIGxvd2VyY2FzZSBzaW5jZSBJRSB1cHBlcmNhc2VzIGNzcyBwcm9wZXJ0eSBuYW1lc1xuXHRcdFx0cmV0dXJuIGVsZW0uc3R5bGUuY3NzVGV4dC50b0xvd2VyQ2FzZSgpIHx8IHVuZGVmaW5lZDtcblx0XHR9LFxuXHRcdHNldDogZnVuY3Rpb24oIGVsZW0sIHZhbHVlICkge1xuXHRcdFx0cmV0dXJuIChlbGVtLnN0eWxlLmNzc1RleHQgPSBcIlwiICsgdmFsdWUpO1xuXHRcdH1cblx0fTtcbn1cblxuLy8gU2FmYXJpIG1pcy1yZXBvcnRzIHRoZSBkZWZhdWx0IHNlbGVjdGVkIHByb3BlcnR5IG9mIGFuIG9wdGlvblxuLy8gQWNjZXNzaW5nIHRoZSBwYXJlbnQncyBzZWxlY3RlZEluZGV4IHByb3BlcnR5IGZpeGVzIGl0XG5pZiAoICFqUXVlcnkuc3VwcG9ydC5vcHRTZWxlY3RlZCApIHtcblx0alF1ZXJ5LnByb3BIb29rcy5zZWxlY3RlZCA9IGpRdWVyeS5leHRlbmQoIGpRdWVyeS5wcm9wSG9va3Muc2VsZWN0ZWQsIHtcblx0XHRnZXQ6IGZ1bmN0aW9uKCBlbGVtICkge1xuXHRcdFx0dmFyIHBhcmVudCA9IGVsZW0ucGFyZW50Tm9kZTtcblxuXHRcdFx0aWYgKCBwYXJlbnQgKSB7XG5cdFx0XHRcdHBhcmVudC5zZWxlY3RlZEluZGV4O1xuXG5cdFx0XHRcdC8vIE1ha2Ugc3VyZSB0aGF0IGl0IGFsc28gd29ya3Mgd2l0aCBvcHRncm91cHMsIHNlZSAjNTcwMVxuXHRcdFx0XHRpZiAoIHBhcmVudC5wYXJlbnROb2RlICkge1xuXHRcdFx0XHRcdHBhcmVudC5wYXJlbnROb2RlLnNlbGVjdGVkSW5kZXg7XG5cdFx0XHRcdH1cblx0XHRcdH1cblx0XHRcdHJldHVybiBudWxsO1xuXHRcdH1cblx0fSk7XG59XG5cbi8vIFJhZGlvcyBhbmQgY2hlY2tib3hlcyBnZXR0ZXIvc2V0dGVyXG5pZiAoICFqUXVlcnkuc3VwcG9ydC5jaGVja09uICkge1xuXHRqUXVlcnkuZWFjaChbIFwicmFkaW9cIiwgXCJjaGVja2JveFwiIF0sIGZ1bmN0aW9uKCkge1xuXHRcdGpRdWVyeS52YWxIb29rc1sgdGhpcyBdID0ge1xuXHRcdFx0Z2V0OiBmdW5jdGlvbiggZWxlbSApIHtcblx0XHRcdFx0Ly8gSGFuZGxlIHRoZSBjYXNlIHdoZXJlIGluIFdlYmtpdCBcIlwiIGlzIHJldHVybmVkIGluc3RlYWQgb2YgXCJvblwiIGlmIGEgdmFsdWUgaXNuJ3Qgc3BlY2lmaWVkXG5cdFx0XHRcdHJldHVybiBlbGVtLmdldEF0dHJpYnV0ZShcInZhbHVlXCIpID09PSBudWxsID8gXCJvblwiIDogZWxlbS52YWx1ZTtcblx0XHRcdH1cblx0XHR9O1xuXHR9KTtcbn1cbmpRdWVyeS5lYWNoKFsgXCJyYWRpb1wiLCBcImNoZWNrYm94XCIgXSwgZnVuY3Rpb24oKSB7XG5cdGpRdWVyeS52YWxIb29rc1sgdGhpcyBdID0galF1ZXJ5LmV4dGVuZCggalF1ZXJ5LnZhbEhvb2tzWyB0aGlzIF0sIHtcblx0XHRzZXQ6IGZ1bmN0aW9uKCBlbGVtLCB2YWx1ZSApIHtcblx0XHRcdGlmICggalF1ZXJ5LmlzQXJyYXkoIHZhbHVlICkgKSB7XG5cdFx0XHRcdHJldHVybiAoZWxlbS5jaGVja2VkID0galF1ZXJ5LmluQXJyYXkoIGpRdWVyeShlbGVtKS52YWwoKSwgdmFsdWUgKSA+PSAwKTtcblx0XHRcdH1cblx0XHR9XG5cdH0pO1xufSk7XG5cblxuXG5cbnZhciBybmFtZXNwYWNlcyA9IC9cXC4oLiopJC8sXG5cdHJmb3JtRWxlbXMgPSAvXig/OnRleHRhcmVhfGlucHV0fHNlbGVjdCkkL2ksXG5cdHJwZXJpb2QgPSAvXFwuL2csXG5cdHJzcGFjZXMgPSAvIC9nLFxuXHRyZXNjYXBlID0gL1teXFx3XFxzLnxgXS9nLFxuXHRydHlwZW5hbWVzcGFjZSA9IC9eKFteXFwuXSopPyg/OlxcLiguKykpPyQvLFxuXHRyaG92ZXJIYWNrID0gL1xcYmhvdmVyKFxcLlxcUyspPy8sXG5cdHJrZXlFdmVudCA9IC9ea2V5Lyxcblx0cm1vdXNlRXZlbnQgPSAvXig/Om1vdXNlfGNvbnRleHRtZW51KXxjbGljay8sXG5cdHJxdWlja0lzID0gL14oW1xcd1xcLV0rKT8oPzojKFtcXHdcXC1dKykpPyg/OlxcLihbXFx3XFwtXSspKT8oPzpcXFsoW1xcdytcXC1dKyk9W1wiJ10/KFtcXHdcXC1dKilbXCInXT9cXF0pPyQvLFxuXHRxdWlja1BhcnNlID0gZnVuY3Rpb24oIHNlbGVjdG9yICkge1xuXHRcdHZhciBxdWljayA9IHJxdWlja0lzLmV4ZWMoIHNlbGVjdG9yICk7XG5cdFx0aWYgKCBxdWljayApIHtcblx0XHRcdC8vICAgMCAgMSAgICAyICAgMyAgICAgIDQgICAgICAgICA1XG5cdFx0XHQvLyBbIF8sIHRhZywgaWQsIGNsYXNzLCBhdHRyTmFtZSwgYXR0clZhbHVlIF1cblx0XHRcdHF1aWNrWzFdID0gKCBxdWlja1sxXSB8fCBcIlwiICkudG9Mb3dlckNhc2UoKTtcblx0XHRcdHF1aWNrWzNdID0gcXVpY2tbM10gJiYgbmV3IFJlZ0V4cCggXCJcXFxcYlwiICsgcXVpY2tbM10gKyBcIlxcXFxiXCIgKTtcblx0XHR9XG5cdFx0cmV0dXJuIHF1aWNrO1xuXHR9LFxuXHRxdWlja0lzID0gZnVuY3Rpb24oIGVsZW0sIG0gKSB7XG5cdFx0cmV0dXJuIChcblx0XHRcdCghbVsxXSB8fCBlbGVtLm5vZGVOYW1lLnRvTG93ZXJDYXNlKCkgPT09IG1bMV0pICYmXG5cdFx0XHQoIW1bMl0gfHwgZWxlbS5pZCA9PT0gbVsyXSkgJiZcblx0XHRcdCghbVszXSB8fCBtWzNdLnRlc3QoIGVsZW0uY2xhc3NOYW1lICkpICYmXG5cdFx0XHQoIW1bNF0gfHwgZWxlbS5nZXRBdHRyaWJ1dGUoIG1bNF0gKSA9PSBtWzVdKVxuXHRcdCk7XG5cdH07XG5cbi8qXG4gKiBIZWxwZXIgZnVuY3Rpb25zIGZvciBtYW5hZ2luZyBldmVudHMgLS0gbm90IHBhcnQgb2YgdGhlIHB1YmxpYyBpbnRlcmZhY2UuXG4gKiBQcm9wcyB0byBEZWFuIEVkd2FyZHMnIGFkZEV2ZW50IGxpYnJhcnkgZm9yIG1hbnkgb2YgdGhlIGlkZWFzLlxuICovXG5qUXVlcnkuZXZlbnQgPSB7XG5cblx0YWRkOiBmdW5jdGlvbiggZWxlbSwgdHlwZXMsIGhhbmRsZXIsIGRhdGEsIHNlbGVjdG9yICkge1xuXG5cdFx0dmFyIGVsZW1EYXRhLCBldmVudEhhbmRsZSwgZXZlbnRzLFxuXHRcdFx0dCwgdG5zLCB0eXBlLCBuYW1lc3BhY2VzLCBoYW5kbGVPYmosXG5cdFx0XHRoYW5kbGVPYmpJbiwgcXVpY2ssIGhhbmRsZXJzLCBzcGVjaWFsO1xuXG5cdFx0Ly8gRG9uJ3QgYXR0YWNoIGV2ZW50cyB0byBub0RhdGEgb3IgdGV4dC9jb21tZW50IG5vZGVzIChhbGxvdyBwbGFpbiBvYmplY3RzIHRobylcblx0XHRpZiAoIGVsZW0ubm9kZVR5cGUgPT09IDMgfHwgZWxlbS5ub2RlVHlwZSA9PT0gOCB8fCAhdHlwZXMgfHwgIWhhbmRsZXIgfHwgIShlbGVtRGF0YSA9IGpRdWVyeS5fZGF0YSggZWxlbSApKSApIHtcblx0XHRcdHJldHVybjtcblx0XHR9XG5cblx0XHQvLyBDYWxsZXIgY2FuIHBhc3MgaW4gYW4gb2JqZWN0IG9mIGN1c3RvbSBkYXRhIGluIGxpZXUgb2YgdGhlIGhhbmRsZXJcblx0XHRpZiAoIGhhbmRsZXIuaGFuZGxlciApIHtcblx0XHRcdGhhbmRsZU9iakluID0gaGFuZGxlcjtcblx0XHRcdGhhbmRsZXIgPSBoYW5kbGVPYmpJbi5oYW5kbGVyO1xuXHRcdH1cblxuXHRcdC8vIE1ha2Ugc3VyZSB0aGF0IHRoZSBoYW5kbGVyIGhhcyBhIHVuaXF1ZSBJRCwgdXNlZCB0byBmaW5kL3JlbW92ZSBpdCBsYXRlclxuXHRcdGlmICggIWhhbmRsZXIuZ3VpZCApIHtcblx0XHRcdGhhbmRsZXIuZ3VpZCA9IGpRdWVyeS5ndWlkKys7XG5cdFx0fVxuXG5cdFx0Ly8gSW5pdCB0aGUgZWxlbWVudCdzIGV2ZW50IHN0cnVjdHVyZSBhbmQgbWFpbiBoYW5kbGVyLCBpZiB0aGlzIGlzIHRoZSBmaXJzdFxuXHRcdGV2ZW50cyA9IGVsZW1EYXRhLmV2ZW50cztcblx0XHRpZiAoICFldmVudHMgKSB7XG5cdFx0XHRlbGVtRGF0YS5ldmVudHMgPSBldmVudHMgPSB7fTtcblx0XHR9XG5cdFx0ZXZlbnRIYW5kbGUgPSBlbGVtRGF0YS5oYW5kbGU7XG5cdFx0aWYgKCAhZXZlbnRIYW5kbGUgKSB7XG5cdFx0XHRlbGVtRGF0YS5oYW5kbGUgPSBldmVudEhhbmRsZSA9IGZ1bmN0aW9uKCBlICkge1xuXHRcdFx0XHQvLyBEaXNjYXJkIHRoZSBzZWNvbmQgZXZlbnQgb2YgYSBqUXVlcnkuZXZlbnQudHJpZ2dlcigpIGFuZFxuXHRcdFx0XHQvLyB3aGVuIGFuIGV2ZW50IGlzIGNhbGxlZCBhZnRlciBhIHBhZ2UgaGFzIHVubG9hZGVkXG5cdFx0XHRcdHJldHVybiB0eXBlb2YgalF1ZXJ5ICE9PSBcInVuZGVmaW5lZFwiICYmICghZSB8fCBqUXVlcnkuZXZlbnQudHJpZ2dlcmVkICE9PSBlLnR5cGUpID9cblx0XHRcdFx0XHRqUXVlcnkuZXZlbnQuaGFuZGxlLmFwcGx5KCBldmVudEhhbmRsZS5lbGVtLCBhcmd1bWVudHMgKSA6XG5cdFx0XHRcdFx0dW5kZWZpbmVkO1xuXHRcdFx0fTtcblx0XHRcdC8vIEFkZCBlbGVtIGFzIGEgcHJvcGVydHkgb2YgdGhlIGhhbmRsZSBmbiB0byBwcmV2ZW50IGEgbWVtb3J5IGxlYWsgd2l0aCBJRSBub24tbmF0aXZlIGV2ZW50c1xuXHRcdFx0ZXZlbnRIYW5kbGUuZWxlbSA9IGVsZW07XG5cdFx0fVxuXG5cdFx0Ly8gSGFuZGxlIG11bHRpcGxlIGV2ZW50cyBzZXBhcmF0ZWQgYnkgYSBzcGFjZVxuXHRcdC8vIGpRdWVyeSguLi4pLmJpbmQoXCJtb3VzZW92ZXIgbW91c2VvdXRcIiwgZm4pO1xuXHRcdHR5cGVzID0gdHlwZXMucmVwbGFjZSggcmhvdmVySGFjaywgXCJtb3VzZW92ZXIkMSBtb3VzZW91dCQxXCIgKS5zcGxpdCggXCIgXCIgKTtcblx0XHRmb3IgKCB0ID0gMDsgdCA8IHR5cGVzLmxlbmd0aDsgdCsrICkge1xuXG5cdFx0XHR0bnMgPSBydHlwZW5hbWVzcGFjZS5leGVjKCB0eXBlc1t0XSApIHx8IFtdO1xuXHRcdFx0dHlwZSA9IHRuc1sxXTtcblx0XHRcdG5hbWVzcGFjZXMgPSAodG5zWzJdIHx8IFwiXCIpLnNwbGl0KCBcIi5cIiApLnNvcnQoKTtcblxuXHRcdFx0Ly8gSWYgZXZlbnQgY2hhbmdlcyBpdHMgdHlwZSwgdXNlIHRoZSBzcGVjaWFsIGV2ZW50IGhhbmRsZXJzIGZvciB0aGUgY2hhbmdlZCB0eXBlXG5cdFx0XHRzcGVjaWFsID0galF1ZXJ5LmV2ZW50LnNwZWNpYWxbIHR5cGUgXSB8fCB7fTtcblxuXHRcdFx0Ly8gSWYgc2VsZWN0b3IgZGVmaW5lZCwgZGV0ZXJtaW5lIHNwZWNpYWwgZXZlbnQgYXBpIHR5cGUsIG90aGVyd2lzZSBnaXZlbiB0eXBlXG5cdFx0XHR0eXBlID0gKCBzZWxlY3RvciA/IHNwZWNpYWwuZGVsZWdhdGVUeXBlIDogc3BlY2lhbC5iaW5kVHlwZSApIHx8IHR5cGU7XG5cblx0XHRcdC8vIFVwZGF0ZSBzcGVjaWFsIGJhc2VkIG9uIG5ld2x5IHJlc2V0IHR5cGVcblx0XHRcdHNwZWNpYWwgPSBqUXVlcnkuZXZlbnQuc3BlY2lhbFsgdHlwZSBdIHx8IHt9O1xuXG5cdFx0XHQvLyBoYW5kbGVPYmogaXMgcGFzc2VkIHRvIGFsbCBldmVudCBoYW5kbGVyc1xuXHRcdFx0aGFuZGxlT2JqID0galF1ZXJ5LmV4dGVuZCh7XG5cdFx0XHRcdHR5cGU6IHR5cGUsXG5cdFx0XHRcdG9yaWdUeXBlOiB0bnNbMV0sXG5cdFx0XHRcdGRhdGE6IGRhdGEsXG5cdFx0XHRcdGhhbmRsZXI6IGhhbmRsZXIsXG5cdFx0XHRcdGd1aWQ6IGhhbmRsZXIuZ3VpZCxcblx0XHRcdFx0c2VsZWN0b3I6IHNlbGVjdG9yLFxuXHRcdFx0XHRuYW1lc3BhY2U6IG5hbWVzcGFjZXMuam9pbihcIi5cIilcblx0XHRcdH0sIGhhbmRsZU9iakluICk7XG5cblx0XHRcdC8vIERlbGVnYXRlZCBldmVudDsgcHJlLWFuYWx5emUgc2VsZWN0b3Igc28gaXQncyBwcm9jZXNzZWQgcXVpY2tseSBvbiBldmVudCBkaXNwYXRjaFxuXHRcdFx0aWYgKCBzZWxlY3RvciApIHtcblx0XHRcdFx0aGFuZGxlT2JqLnF1aWNrID0gcXVpY2tQYXJzZSggc2VsZWN0b3IgKTtcblx0XHRcdFx0aWYgKCAhaGFuZGxlT2JqLnF1aWNrICYmIGpRdWVyeS5leHByLm1hdGNoLlBPUy50ZXN0KCBzZWxlY3RvciApICkge1xuXHRcdFx0XHRcdGhhbmRsZU9iai5pc1Bvc2l0aW9uYWwgPSB0cnVlO1xuXHRcdFx0XHR9XG5cdFx0XHR9XG5cblx0XHRcdC8vIEluaXQgdGhlIGV2ZW50IGhhbmRsZXIgcXVldWUgaWYgd2UncmUgdGhlIGZpcnN0XG5cdFx0XHRoYW5kbGVycyA9IGV2ZW50c1sgdHlwZSBdO1xuXHRcdFx0aWYgKCAhaGFuZGxlcnMgKSB7XG5cdFx0XHRcdGhhbmRsZXJzID0gZXZlbnRzWyB0eXBlIF0gPSBbXTtcblx0XHRcdFx0aGFuZGxlcnMuZGVsZWdhdGVDb3VudCA9IDA7XG5cblx0XHRcdFx0Ly8gT25seSB1c2UgYWRkRXZlbnRMaXN0ZW5lci9hdHRhY2hFdmVudCBpZiB0aGUgc3BlY2lhbCBldmVudHMgaGFuZGxlciByZXR1cm5zIGZhbHNlXG5cdFx0XHRcdGlmICggIXNwZWNpYWwuc2V0dXAgfHwgc3BlY2lhbC5zZXR1cC5jYWxsKCBlbGVtLCBkYXRhLCBuYW1lc3BhY2VzLCBldmVudEhhbmRsZSApID09PSBmYWxzZSApIHtcblx0XHRcdFx0XHQvLyBCaW5kIHRoZSBnbG9iYWwgZXZlbnQgaGFuZGxlciB0byB0aGUgZWxlbWVudFxuXHRcdFx0XHRcdGlmICggZWxlbS5hZGRFdmVudExpc3RlbmVyICkge1xuXHRcdFx0XHRcdFx0ZWxlbS5hZGRFdmVudExpc3RlbmVyKCB0eXBlLCBldmVudEhhbmRsZSwgZmFsc2UgKTtcblxuXHRcdFx0XHRcdH0gZWxzZSBpZiAoIGVsZW0uYXR0YWNoRXZlbnQgKSB7XG5cdFx0XHRcdFx0XHRlbGVtLmF0dGFjaEV2ZW50KCBcIm9uXCIgKyB0eXBlLCBldmVudEhhbmRsZSApO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0fVxuXHRcdFx0fVxuXG5cdFx0XHRpZiAoIHNwZWNpYWwuYWRkICkge1xuXHRcdFx0XHRzcGVjaWFsLmFkZC5jYWxsKCBlbGVtLCBoYW5kbGVPYmogKTtcblxuXHRcdFx0XHRpZiAoICFoYW5kbGVPYmouaGFuZGxlci5ndWlkICkge1xuXHRcdFx0XHRcdGhhbmRsZU9iai5oYW5kbGVyLmd1aWQgPSBoYW5kbGVyLmd1aWQ7XG5cdFx0XHRcdH1cblx0XHRcdH1cblxuXHRcdFx0Ly8gQWRkIHRvIHRoZSBlbGVtZW50J3MgaGFuZGxlciBsaXN0LCBkZWxlZ2F0ZXMgaW4gZnJvbnRcblx0XHRcdGlmICggc2VsZWN0b3IgKSB7XG5cdFx0XHRcdGhhbmRsZXJzLnNwbGljZSggaGFuZGxlcnMuZGVsZWdhdGVDb3VudCsrLCAwLCBoYW5kbGVPYmogKTtcblx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdGhhbmRsZXJzLnB1c2goIGhhbmRsZU9iaiApO1xuXHRcdFx0fVxuXG5cdFx0XHQvLyBLZWVwIHRyYWNrIG9mIHdoaWNoIGV2ZW50cyBoYXZlIGV2ZXIgYmVlbiB1c2VkLCBmb3IgZXZlbnQgb3B0aW1pemF0aW9uXG5cdFx0XHRqUXVlcnkuZXZlbnQuZ2xvYmFsWyB0eXBlIF0gPSB0cnVlO1xuXHRcdH1cblxuXHRcdC8vIE51bGxpZnkgZWxlbSB0byBwcmV2ZW50IG1lbW9yeSBsZWFrcyBpbiBJRVxuXHRcdGVsZW0gPSBudWxsO1xuXHR9LFxuXG5cdGdsb2JhbDoge30sXG5cblx0Ly8gRGV0YWNoIGFuIGV2ZW50IG9yIHNldCBvZiBldmVudHMgZnJvbSBhbiBlbGVtZW50XG5cdHJlbW92ZTogZnVuY3Rpb24oIGVsZW0sIHR5cGVzLCBoYW5kbGVyLCBzZWxlY3RvciApIHtcblxuXHRcdHZhciBlbGVtRGF0YSA9IGpRdWVyeS5oYXNEYXRhKCBlbGVtICkgJiYgalF1ZXJ5Ll9kYXRhKCBlbGVtICksXG5cdFx0XHR0LCB0bnMsIHR5cGUsIG5hbWVzcGFjZXMsIG9yaWdDb3VudCxcblx0XHRcdGosIGV2ZW50cywgc3BlY2lhbCwgaGFuZGxlLCBldmVudFR5cGUsIGhhbmRsZU9iajtcblxuXHRcdGlmICggIWVsZW1EYXRhIHx8ICEoZXZlbnRzID0gZWxlbURhdGEuZXZlbnRzKSApIHtcblx0XHRcdHJldHVybjtcblx0XHR9XG5cblx0XHQvLyBGb3IgcmVtb3ZhbCwgdHlwZXMgY2FuIGJlIGFuIEV2ZW50IG9iamVjdFxuXHRcdGlmICggdHlwZXMgJiYgdHlwZXMudHlwZSAmJiB0eXBlcy5oYW5kbGVyICkge1xuXHRcdFx0aGFuZGxlciA9IHR5cGVzLmhhbmRsZXI7XG5cdFx0XHR0eXBlcyA9IHR5cGVzLnR5cGU7XG5cdFx0XHRzZWxlY3RvciA9IHR5cGVzLnNlbGVjdG9yO1xuXHRcdH1cblxuXHRcdC8vIE9uY2UgZm9yIGVhY2ggdHlwZS5uYW1lc3BhY2UgaW4gdHlwZXM7IHR5cGUgbWF5IGJlIG9taXR0ZWRcblx0XHR0eXBlcyA9ICh0eXBlcyB8fCBcIlwiKS5yZXBsYWNlKCByaG92ZXJIYWNrLCBcIm1vdXNlb3ZlciQxIG1vdXNlb3V0JDFcIiApLnNwbGl0KFwiIFwiKTtcblx0XHRmb3IgKCB0ID0gMDsgdCA8IHR5cGVzLmxlbmd0aDsgdCsrICkge1xuXHRcdFx0dG5zID0gcnR5cGVuYW1lc3BhY2UuZXhlYyggdHlwZXNbdF0gKSB8fCBbXTtcblx0XHRcdHR5cGUgPSB0bnNbMV07XG5cdFx0XHRuYW1lc3BhY2VzID0gdG5zWzJdO1xuXG5cdFx0XHQvLyBVbmJpbmQgYWxsIGV2ZW50cyAob24gdGhpcyBuYW1lc3BhY2UsIGlmIHByb3ZpZGVkKSBmb3IgdGhlIGVsZW1lbnRcblx0XHRcdGlmICggIXR5cGUgKSB7XG5cdFx0XHRcdG5hbWVzcGFjZXMgPSBuYW1lc3BhY2VzPyBcIi5cIiArIG5hbWVzcGFjZXMgOiBcIlwiO1xuXHRcdFx0XHRmb3IgKCBqIGluIGV2ZW50cyApIHtcblx0XHRcdFx0XHRqUXVlcnkuZXZlbnQucmVtb3ZlKCBlbGVtLCBqICsgbmFtZXNwYWNlcywgaGFuZGxlciwgc2VsZWN0b3IgKTtcblx0XHRcdFx0fVxuXHRcdFx0XHRyZXR1cm47XG5cdFx0XHR9XG5cblx0XHRcdHNwZWNpYWwgPSBqUXVlcnkuZXZlbnQuc3BlY2lhbFsgdHlwZSBdIHx8IHt9O1xuXHRcdFx0dHlwZSA9ICggc2VsZWN0b3I/IHNwZWNpYWwuZGVsZWdhdGVUeXBlIDogc3BlY2lhbC5iaW5kVHlwZSApIHx8IHR5cGU7XG5cdFx0XHRldmVudFR5cGUgPSBldmVudHNbIHR5cGUgXSB8fCBbXTtcblx0XHRcdG9yaWdDb3VudCA9IGV2ZW50VHlwZS5sZW5ndGg7XG5cdFx0XHRuYW1lc3BhY2VzID0gbmFtZXNwYWNlcyA/IG5ldyBSZWdFeHAoXCIoXnxcXFxcLilcIiArIG5hbWVzcGFjZXMuc3BsaXQoXCIuXCIpLnNvcnQoKS5qb2luKFwiXFxcXC4oPzouKlxcXFwuKT9cIikgKyBcIihcXFxcLnwkKVwiKSA6IG51bGw7XG5cblx0XHRcdC8vIE9ubHkgbmVlZCB0byBsb29wIGZvciBzcGVjaWFsIGV2ZW50cyBvciBzZWxlY3RpdmUgcmVtb3ZhbFxuXHRcdFx0aWYgKCBoYW5kbGVyIHx8IG5hbWVzcGFjZXMgfHwgc2VsZWN0b3IgfHwgc3BlY2lhbC5yZW1vdmUgKSB7XG5cdFx0XHRcdGZvciAoIGogPSAwOyBqIDwgZXZlbnRUeXBlLmxlbmd0aDsgaisrICkge1xuXHRcdFx0XHRcdGhhbmRsZU9iaiA9IGV2ZW50VHlwZVsgaiBdO1xuXG5cdFx0XHRcdFx0aWYgKCAhaGFuZGxlciB8fCBoYW5kbGVyLmd1aWQgPT09IGhhbmRsZU9iai5ndWlkICkge1xuXHRcdFx0XHRcdFx0aWYgKCAhbmFtZXNwYWNlcyB8fCBuYW1lc3BhY2VzLnRlc3QoIGhhbmRsZU9iai5uYW1lc3BhY2UgKSApIHtcblx0XHRcdFx0XHRcdFx0aWYgKCAhc2VsZWN0b3IgfHwgc2VsZWN0b3IgPT09IGhhbmRsZU9iai5zZWxlY3RvciB8fCBzZWxlY3RvciA9PT0gXCIqKlwiICYmIGhhbmRsZU9iai5zZWxlY3RvciApIHtcblx0XHRcdFx0XHRcdFx0XHRldmVudFR5cGUuc3BsaWNlKCBqLS0sIDEgKTtcblxuXHRcdFx0XHRcdFx0XHRcdGlmICggaGFuZGxlT2JqLnNlbGVjdG9yICkge1xuXHRcdFx0XHRcdFx0XHRcdFx0ZXZlbnRUeXBlLmRlbGVnYXRlQ291bnQtLTtcblx0XHRcdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHRcdFx0aWYgKCBzcGVjaWFsLnJlbW92ZSApIHtcblx0XHRcdFx0XHRcdFx0XHRcdHNwZWNpYWwucmVtb3ZlLmNhbGwoIGVsZW0sIGhhbmRsZU9iaiApO1xuXHRcdFx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdH1cblx0XHRcdFx0fVxuXHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0Ly8gUmVtb3ZpbmcgYWxsIGV2ZW50c1xuXHRcdFx0XHRldmVudFR5cGUubGVuZ3RoID0gMDtcblx0XHRcdH1cblxuXHRcdFx0Ly8gUmVtb3ZlIGdlbmVyaWMgZXZlbnQgaGFuZGxlciBpZiB3ZSByZW1vdmVkIHNvbWV0aGluZyBhbmQgbm8gbW9yZSBoYW5kbGVycyBleGlzdFxuXHRcdFx0Ly8gKGF2b2lkcyBwb3RlbnRpYWwgZm9yIGVuZGxlc3MgcmVjdXJzaW9uIGR1cmluZyByZW1vdmFsIG9mIHNwZWNpYWwgZXZlbnQgaGFuZGxlcnMpXG5cdFx0XHRpZiAoIGV2ZW50VHlwZS5sZW5ndGggPT09IDAgJiYgb3JpZ0NvdW50ICE9PSBldmVudFR5cGUubGVuZ3RoICkge1xuXHRcdFx0XHRpZiAoICFzcGVjaWFsLnRlYXJkb3duIHx8IHNwZWNpYWwudGVhcmRvd24uY2FsbCggZWxlbSwgbmFtZXNwYWNlcyApID09PSBmYWxzZSApIHtcblx0XHRcdFx0XHRqUXVlcnkucmVtb3ZlRXZlbnQoIGVsZW0sIHR5cGUsIGVsZW1EYXRhLmhhbmRsZSApO1xuXHRcdFx0XHR9XG5cblx0XHRcdFx0ZGVsZXRlIGV2ZW50c1sgdHlwZSBdO1xuXHRcdFx0fVxuXHRcdH1cblxuXHRcdC8vIFJlbW92ZSB0aGUgZXhwYW5kbyBpZiBpdCdzIG5vIGxvbmdlciB1c2VkXG5cdFx0aWYgKCBqUXVlcnkuaXNFbXB0eU9iamVjdCggZXZlbnRzICkgKSB7XG5cdFx0XHRoYW5kbGUgPSBlbGVtRGF0YS5oYW5kbGU7XG5cdFx0XHRpZiAoIGhhbmRsZSApIHtcblx0XHRcdFx0aGFuZGxlLmVsZW0gPSBudWxsO1xuXHRcdFx0fVxuXG5cdFx0XHQvLyByZW1vdmVEYXRhIGFsc28gY2hlY2tzIGZvciBlbXB0aW5lc3MgYW5kIGNsZWFycyB0aGUgZXhwYW5kbyBpZiBlbXB0eVxuXHRcdFx0Ly8gc28gdXNlIGl0IGluc3RlYWQgb2YgZGVsZXRlXG5cdFx0XHRqUXVlcnkucmVtb3ZlRGF0YSggZWxlbSwgWyBcImV2ZW50c1wiLCBcImhhbmRsZVwiIF0sIHRydWUgKTtcblx0XHR9XG5cdH0sXG5cblx0Ly8gRXZlbnRzIHRoYXQgYXJlIHNhZmUgdG8gc2hvcnQtY2lyY3VpdCBpZiBubyBoYW5kbGVycyBhcmUgYXR0YWNoZWQuXG5cdC8vIE5hdGl2ZSBET00gZXZlbnRzIHNob3VsZCBub3QgYmUgYWRkZWQsIHRoZXkgbWF5IGhhdmUgaW5saW5lIGhhbmRsZXJzLlxuXHRjdXN0b21FdmVudDoge1xuXHRcdFwiZ2V0RGF0YVwiOiB0cnVlLFxuXHRcdFwic2V0RGF0YVwiOiB0cnVlLFxuXHRcdFwiY2hhbmdlRGF0YVwiOiB0cnVlXG5cdH0sXG5cblx0dHJpZ2dlcjogZnVuY3Rpb24oIGV2ZW50LCBkYXRhLCBlbGVtLCBvbmx5SGFuZGxlcnMgKSB7XG5cdFx0Ly8gRG9uJ3QgZG8gZXZlbnRzIG9uIHRleHQgYW5kIGNvbW1lbnQgbm9kZXNcblx0XHRpZiAoIGVsZW0gJiYgKGVsZW0ubm9kZVR5cGUgPT09IDMgfHwgZWxlbS5ub2RlVHlwZSA9PT0gOCkgKSB7XG5cdFx0XHRyZXR1cm47XG5cdFx0fVxuXG5cdFx0Ly8gRXZlbnQgb2JqZWN0IG9yIGV2ZW50IHR5cGVcblx0XHR2YXIgdHlwZSA9IGV2ZW50LnR5cGUgfHwgZXZlbnQsXG5cdFx0XHRuYW1lc3BhY2VzID0gW10sXG5cdFx0XHRjYWNoZSwgZXhjbHVzaXZlLCBpLCBjdXIsIG9sZCwgb250eXBlLCBzcGVjaWFsLCBoYW5kbGUsIGV2ZW50UGF0aCwgYnViYmxlVHlwZTtcblxuXHRcdGlmICggdHlwZS5pbmRleE9mKCBcIiFcIiApID49IDAgKSB7XG5cdFx0XHQvLyBFeGNsdXNpdmUgZXZlbnRzIHRyaWdnZXIgb25seSBmb3IgdGhlIGV4YWN0IGV2ZW50IChubyBuYW1lc3BhY2VzKVxuXHRcdFx0dHlwZSA9IHR5cGUuc2xpY2UoMCwgLTEpO1xuXHRcdFx0ZXhjbHVzaXZlID0gdHJ1ZTtcblx0XHR9XG5cblx0XHRpZiAoIHR5cGUuaW5kZXhPZiggXCIuXCIgKSA+PSAwICkge1xuXHRcdFx0Ly8gTmFtZXNwYWNlZCB0cmlnZ2VyOyBjcmVhdGUgYSByZWdleHAgdG8gbWF0Y2ggZXZlbnQgdHlwZSBpbiBoYW5kbGUoKVxuXHRcdFx0bmFtZXNwYWNlcyA9IHR5cGUuc3BsaXQoXCIuXCIpO1xuXHRcdFx0dHlwZSA9IG5hbWVzcGFjZXMuc2hpZnQoKTtcblx0XHRcdG5hbWVzcGFjZXMuc29ydCgpO1xuXHRcdH1cblxuXHRcdGlmICggKCFlbGVtIHx8IGpRdWVyeS5ldmVudC5jdXN0b21FdmVudFsgdHlwZSBdKSAmJiAhalF1ZXJ5LmV2ZW50Lmdsb2JhbFsgdHlwZSBdICkge1xuXHRcdFx0Ly8gTm8galF1ZXJ5IGhhbmRsZXJzIGZvciB0aGlzIGV2ZW50IHR5cGUsIGFuZCBpdCBjYW4ndCBoYXZlIGlubGluZSBoYW5kbGVyc1xuXHRcdFx0cmV0dXJuO1xuXHRcdH1cblxuXHRcdC8vIENhbGxlciBjYW4gcGFzcyBpbiBhbiBFdmVudCwgT2JqZWN0LCBvciBqdXN0IGFuIGV2ZW50IHR5cGUgc3RyaW5nXG5cdFx0ZXZlbnQgPSB0eXBlb2YgZXZlbnQgPT09IFwib2JqZWN0XCIgP1xuXHRcdFx0Ly8galF1ZXJ5LkV2ZW50IG9iamVjdFxuXHRcdFx0ZXZlbnRbIGpRdWVyeS5leHBhbmRvIF0gPyBldmVudCA6XG5cdFx0XHQvLyBPYmplY3QgbGl0ZXJhbFxuXHRcdFx0bmV3IGpRdWVyeS5FdmVudCggdHlwZSwgZXZlbnQgKSA6XG5cdFx0XHQvLyBKdXN0IHRoZSBldmVudCB0eXBlIChzdHJpbmcpXG5cdFx0XHRuZXcgalF1ZXJ5LkV2ZW50KCB0eXBlICk7XG5cblx0XHRldmVudC50eXBlID0gdHlwZTtcblx0XHRldmVudC5pc1RyaWdnZXIgPSB0cnVlO1xuXHRcdGV2ZW50LmV4Y2x1c2l2ZSA9IGV4Y2x1c2l2ZTtcblx0XHRldmVudC5uYW1lc3BhY2UgPSBuYW1lc3BhY2VzLmpvaW4oIFwiLlwiICk7XG5cdFx0ZXZlbnQubmFtZXNwYWNlX3JlID0gZXZlbnQubmFtZXNwYWNlPyBuZXcgUmVnRXhwKFwiKF58XFxcXC4pXCIgKyBuYW1lc3BhY2VzLmpvaW4oXCJcXFxcLig/Oi4qXFxcXC4pP1wiKSArIFwiKFxcXFwufCQpXCIpIDogbnVsbDtcblx0XHRvbnR5cGUgPSB0eXBlLmluZGV4T2YoIFwiOlwiICkgPCAwID8gXCJvblwiICsgdHlwZSA6IFwiXCI7XG5cblx0XHQvLyB0cmlnZ2VySGFuZGxlcigpIGFuZCBnbG9iYWwgZXZlbnRzIGRvbid0IGJ1YmJsZSBvciBydW4gdGhlIGRlZmF1bHQgYWN0aW9uXG5cdFx0aWYgKCBvbmx5SGFuZGxlcnMgfHwgIWVsZW0gKSB7XG5cdFx0XHRldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuXHRcdH1cblxuXHRcdC8vIEhhbmRsZSBhIGdsb2JhbCB0cmlnZ2VyXG5cdFx0aWYgKCAhZWxlbSApIHtcblxuXHRcdFx0Ly8gVE9ETzogU3RvcCB0YXVudGluZyB0aGUgZGF0YSBjYWNoZTsgcmVtb3ZlIGdsb2JhbCBldmVudHMgYW5kIGFsd2F5cyBhdHRhY2ggdG8gZG9jdW1lbnRcblx0XHRcdGNhY2hlID0galF1ZXJ5LmNhY2hlO1xuXHRcdFx0ZXZlbnQuc3RvcFByb3BhZ2F0aW9uKCk7XG5cdFx0XHRmb3IgKCBpIGluIGNhY2hlICkge1xuXHRcdFx0XHRpZiAoIGNhY2hlWyBpIF0uZXZlbnRzICYmIGNhY2hlWyBpIF0uZXZlbnRzWyB0eXBlIF0gKSB7XG5cdFx0XHRcdFx0alF1ZXJ5LmV2ZW50LnRyaWdnZXIoIGV2ZW50LCBkYXRhLCBjYWNoZVsgaSBdLmhhbmRsZS5lbGVtICk7XG5cdFx0XHRcdH1cblx0XHRcdH1cblx0XHRcdHJldHVybjtcblx0XHR9XG5cblx0XHQvLyBDbGVhbiB1cCB0aGUgZXZlbnQgaW4gY2FzZSBpdCBpcyBiZWluZyByZXVzZWRcblx0XHRldmVudC5yZXN1bHQgPSB1bmRlZmluZWQ7XG5cdFx0aWYgKCAhZXZlbnQudGFyZ2V0ICkge1xuXHRcdFx0ZXZlbnQudGFyZ2V0ID0gZWxlbTtcblx0XHR9XG5cblx0XHQvLyBDbG9uZSBhbnkgaW5jb21pbmcgZGF0YSBhbmQgcHJlcGVuZCB0aGUgZXZlbnQsIGNyZWF0aW5nIHRoZSBoYW5kbGVyIGFyZyBsaXN0XG5cdFx0ZGF0YSA9IGRhdGEgIT0gbnVsbCA/IGpRdWVyeS5tYWtlQXJyYXkoIGRhdGEgKSA6IFtdO1xuXHRcdGRhdGEudW5zaGlmdCggZXZlbnQgKTtcblxuXHRcdC8vIEFsbG93IHNwZWNpYWwgZXZlbnRzIHRvIGRyYXcgb3V0c2lkZSB0aGUgbGluZXNcblx0XHRzcGVjaWFsID0galF1ZXJ5LmV2ZW50LnNwZWNpYWxbIHR5cGUgXSB8fCB7fTtcblx0XHRpZiAoIHNwZWNpYWwudHJpZ2dlciAmJiBzcGVjaWFsLnRyaWdnZXIuYXBwbHkoIGVsZW0sIGRhdGEgKSA9PT0gZmFsc2UgKSB7XG5cdFx0XHRyZXR1cm47XG5cdFx0fVxuXG5cdFx0Ly8gRGV0ZXJtaW5lIGV2ZW50IHByb3BhZ2F0aW9uIHBhdGggaW4gYWR2YW5jZSwgcGVyIFczQyBldmVudHMgc3BlYyAoIzk5NTEpXG5cdFx0Ly8gQnViYmxlIHVwIHRvIGRvY3VtZW50LCB0aGVuIHRvIHdpbmRvdzsgd2F0Y2ggZm9yIGEgZ2xvYmFsIG93bmVyRG9jdW1lbnQgdmFyICgjOTcyNClcblx0XHRldmVudFBhdGggPSBbWyBlbGVtLCBzcGVjaWFsLmJpbmRUeXBlIHx8IHR5cGUgXV07XG5cdFx0aWYgKCAhb25seUhhbmRsZXJzICYmICFzcGVjaWFsLm5vQnViYmxlICYmICFqUXVlcnkuaXNXaW5kb3coIGVsZW0gKSApIHtcblxuXHRcdFx0YnViYmxlVHlwZSA9IHNwZWNpYWwuZGVsZWdhdGVUeXBlIHx8IHR5cGU7XG5cdFx0XHRvbGQgPSBudWxsO1xuXHRcdFx0Zm9yICggY3VyID0gZWxlbS5wYXJlbnROb2RlOyBjdXI7IGN1ciA9IGN1ci5wYXJlbnROb2RlICkge1xuXHRcdFx0XHRldmVudFBhdGgucHVzaChbIGN1ciwgYnViYmxlVHlwZSBdKTtcblx0XHRcdFx0b2xkID0gY3VyO1xuXHRcdFx0fVxuXG5cdFx0XHQvLyBPbmx5IGFkZCB3aW5kb3cgaWYgd2UgZ290IHRvIGRvY3VtZW50IChlLmcuLCBub3QgcGxhaW4gb2JqIG9yIGRldGFjaGVkIERPTSlcblx0XHRcdGlmICggb2xkICYmIG9sZCA9PT0gZWxlbS5vd25lckRvY3VtZW50ICkge1xuXHRcdFx0XHRldmVudFBhdGgucHVzaChbIG9sZC5kZWZhdWx0VmlldyB8fCBvbGQucGFyZW50V2luZG93IHx8IHdpbmRvdywgYnViYmxlVHlwZSBdKTtcblx0XHRcdH1cblx0XHR9XG5cblx0XHQvLyBGaXJlIGhhbmRsZXJzIG9uIHRoZSBldmVudCBwYXRoXG5cdFx0Zm9yICggaSA9IDA7IGkgPCBldmVudFBhdGgubGVuZ3RoOyBpKysgKSB7XG5cblx0XHRcdGN1ciA9IGV2ZW50UGF0aFtpXVswXTtcblx0XHRcdGV2ZW50LnR5cGUgPSBldmVudFBhdGhbaV1bMV07XG5cblx0XHRcdGhhbmRsZSA9IChqUXVlcnkuX2RhdGEoIGN1ciwgXCJldmVudHNcIiApIHx8IHt9KVsgZXZlbnQudHlwZSBdICYmIGpRdWVyeS5fZGF0YSggY3VyLCBcImhhbmRsZVwiICk7XG5cdFx0XHRpZiAoIGhhbmRsZSApIHtcblx0XHRcdFx0aGFuZGxlLmFwcGx5KCBjdXIsIGRhdGEgKTtcblx0XHRcdH1cblx0XHRcdGhhbmRsZSA9IG9udHlwZSAmJiBjdXJbIG9udHlwZSBdO1xuXHRcdFx0aWYgKCBoYW5kbGUgJiYgalF1ZXJ5LmFjY2VwdERhdGEoIGN1ciApICkge1xuXHRcdFx0XHRoYW5kbGUuYXBwbHkoIGN1ciwgZGF0YSApO1xuXHRcdFx0fVxuXG5cdFx0XHRpZiAoIGV2ZW50LmlzUHJvcGFnYXRpb25TdG9wcGVkKCkgKSB7XG5cdFx0XHRcdGJyZWFrO1xuXHRcdFx0fVxuXHRcdH1cblx0XHRldmVudC50eXBlID0gdHlwZTtcblxuXHRcdC8vIElmIG5vYm9keSBwcmV2ZW50ZWQgdGhlIGRlZmF1bHQgYWN0aW9uLCBkbyBpdCBub3dcblx0XHRpZiAoICFldmVudC5pc0RlZmF1bHRQcmV2ZW50ZWQoKSApIHtcblxuXHRcdFx0aWYgKCAoIXNwZWNpYWwuX2RlZmF1bHQgfHwgc3BlY2lhbC5fZGVmYXVsdC5jYWxsKCBlbGVtLm93bmVyRG9jdW1lbnQsIGV2ZW50LCBkYXRhICkgPT09IGZhbHNlKSAmJlxuXHRcdFx0XHQhKHR5cGUgPT09IFwiY2xpY2tcIiAmJiBqUXVlcnkubm9kZU5hbWUoIGVsZW0sIFwiYVwiICkpICYmIGpRdWVyeS5hY2NlcHREYXRhKCBlbGVtICkgKSB7XG5cblx0XHRcdFx0Ly8gQ2FsbCBhIG5hdGl2ZSBET00gbWV0aG9kIG9uIHRoZSB0YXJnZXQgd2l0aCB0aGUgc2FtZSBuYW1lIG5hbWUgYXMgdGhlIGV2ZW50LlxuXHRcdFx0XHQvLyBDYW4ndCB1c2UgYW4gLmlzRnVuY3Rpb24oKSBjaGVjayBoZXJlIGJlY2F1c2UgSUU2LzcgZmFpbHMgdGhhdCB0ZXN0LlxuXHRcdFx0XHQvLyBEb24ndCBkbyBkZWZhdWx0IGFjdGlvbnMgb24gd2luZG93LCB0aGF0J3Mgd2hlcmUgZ2xvYmFsIHZhcmlhYmxlcyBiZSAoIzYxNzApXG5cdFx0XHRcdC8vIElFPDkgZGllcyBvbiBmb2N1cy9ibHVyIHRvIGhpZGRlbiBlbGVtZW50ICgjMTQ4Nilcblx0XHRcdFx0aWYgKCBvbnR5cGUgJiYgZWxlbVsgdHlwZSBdICYmICgodHlwZSAhPT0gXCJmb2N1c1wiICYmIHR5cGUgIT09IFwiYmx1clwiKSB8fCBldmVudC50YXJnZXQub2Zmc2V0V2lkdGggIT09IDApICYmICFqUXVlcnkuaXNXaW5kb3coIGVsZW0gKSApIHtcblxuXHRcdFx0XHRcdC8vIERvbid0IHJlLXRyaWdnZXIgYW4gb25GT08gZXZlbnQgd2hlbiB3ZSBjYWxsIGl0cyBGT08oKSBtZXRob2Rcblx0XHRcdFx0XHRvbGQgPSBlbGVtWyBvbnR5cGUgXTtcblxuXHRcdFx0XHRcdGlmICggb2xkICkge1xuXHRcdFx0XHRcdFx0ZWxlbVsgb250eXBlIF0gPSBudWxsO1xuXHRcdFx0XHRcdH1cblxuXHRcdFx0XHRcdC8vIFByZXZlbnQgcmUtdHJpZ2dlcmluZyBvZiB0aGUgc2FtZSBldmVudCwgc2luY2Ugd2UgYWxyZWFkeSBidWJibGVkIGl0IGFib3ZlXG5cdFx0XHRcdFx0alF1ZXJ5LmV2ZW50LnRyaWdnZXJlZCA9IHR5cGU7XG5cdFx0XHRcdFx0ZWxlbVsgdHlwZSBdKCk7XG5cdFx0XHRcdFx0alF1ZXJ5LmV2ZW50LnRyaWdnZXJlZCA9IHVuZGVmaW5lZDtcblxuXHRcdFx0XHRcdGlmICggb2xkICkge1xuXHRcdFx0XHRcdFx0ZWxlbVsgb250eXBlIF0gPSBvbGQ7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9XG5cdFx0XHR9XG5cdFx0fVxuXG5cdFx0cmV0dXJuIGV2ZW50LnJlc3VsdDtcblx0fSxcblxuXHRoYW5kbGU6IGZ1bmN0aW9uKCBldmVudCApIHtcblxuXHRcdC8vIE1ha2UgYSB3cml0YWJsZSBqUXVlcnkuRXZlbnQgZnJvbSB0aGUgbmF0aXZlIGV2ZW50IG9iamVjdFxuXHRcdGV2ZW50ID0galF1ZXJ5LmV2ZW50LmZpeCggZXZlbnQgfHwgd2luZG93LmV2ZW50ICk7XG5cblx0XHR2YXIgaGFuZGxlcnMgPSAoKGpRdWVyeS5fZGF0YSggdGhpcywgXCJldmVudHNcIiApIHx8IHt9KVsgZXZlbnQudHlwZSBdIHx8IFtdKSxcblx0XHRcdGRlbGVnYXRlQ291bnQgPSBoYW5kbGVycy5kZWxlZ2F0ZUNvdW50LFxuXHRcdFx0YXJncyA9IFtdLnNsaWNlLmNhbGwoIGFyZ3VtZW50cywgMCApLFxuXHRcdFx0aGFuZGxlclF1ZXVlID0gW10sXG5cdFx0XHRpLCBjdXIsIHNlbE1hdGNoLCBtYXRjaGVzLCBoYW5kbGVPYmosIHNlbCwgaGl0LCByZWxhdGVkO1xuXG5cdFx0Ly8gVXNlIHRoZSBmaXgtZWQgalF1ZXJ5LkV2ZW50IHJhdGhlciB0aGFuIHRoZSAocmVhZC1vbmx5KSBuYXRpdmUgZXZlbnRcblx0XHRhcmdzWzBdID0gZXZlbnQ7XG5cblx0XHQvLyBEZXRlcm1pbmUgaGFuZGxlcnMgdGhhdCBzaG91bGQgcnVuIGlmIHRoZXJlIGFyZSBkZWxlZ2F0ZWQgZXZlbnRzXG5cdFx0Ly8gQXZvaWQgZGlzYWJsZWQgZWxlbWVudHMgaW4gSUUgKCM2OTExKSBhbmQgbm9uLWxlZnQtY2xpY2sgYnViYmxpbmcgaW4gRmlyZWZveCAoIzM4NjEpXG5cdFx0aWYgKCBkZWxlZ2F0ZUNvdW50ICYmICFldmVudC50YXJnZXQuZGlzYWJsZWQgJiYgIShldmVudC5idXR0b24gJiYgZXZlbnQudHlwZSA9PT0gXCJjbGlja1wiKSApIHtcblxuXHRcdFx0Zm9yICggY3VyID0gZXZlbnQudGFyZ2V0OyBjdXIgIT0gdGhpczsgY3VyID0gY3VyLnBhcmVudE5vZGUgfHwgdGhpcyApIHtcblx0XHRcdFx0c2VsTWF0Y2ggPSB7fTtcblx0XHRcdFx0bWF0Y2hlcyA9IFtdO1xuXHRcdFx0XHRmb3IgKCBpID0gMDsgaSA8IGRlbGVnYXRlQ291bnQ7IGkrKyApIHtcblx0XHRcdFx0XHRoYW5kbGVPYmogPSBoYW5kbGVyc1sgaSBdO1xuXHRcdFx0XHRcdHNlbCA9IGhhbmRsZU9iai5zZWxlY3Rvcjtcblx0XHRcdFx0XHRoaXQgPSBzZWxNYXRjaFsgc2VsIF07XG5cblx0XHRcdFx0XHRpZiAoIGhhbmRsZU9iai5pc1Bvc2l0aW9uYWwgKSB7XG5cdFx0XHRcdFx0XHQvLyBTaW5jZSAuaXMoKSBkb2VzIG5vdCB3b3JrIGZvciBwb3NpdGlvbmFsczsgc2VlIGh0dHA6Ly9qc2ZpZGRsZS5uZXQvZUo0eWQvMy9cblx0XHRcdFx0XHRcdGhpdCA9ICggaGl0IHx8IChzZWxNYXRjaFsgc2VsIF0gPSBqUXVlcnkoIHNlbCApKSApLmluZGV4KCBjdXIgKSA+PSAwO1xuXHRcdFx0XHRcdH0gZWxzZSBpZiAoIGhpdCA9PT0gdW5kZWZpbmVkICkge1xuXHRcdFx0XHRcdFx0aGl0ID0gc2VsTWF0Y2hbIHNlbCBdID0gKCBoYW5kbGVPYmoucXVpY2sgPyBxdWlja0lzKCBjdXIsIGhhbmRsZU9iai5xdWljayApIDogalF1ZXJ5KCBjdXIgKS5pcyggc2VsICkgKTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0aWYgKCBoaXQgKSB7XG5cdFx0XHRcdFx0XHRtYXRjaGVzLnB1c2goIGhhbmRsZU9iaiApO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0fVxuXHRcdFx0XHRpZiAoIG1hdGNoZXMubGVuZ3RoICkge1xuXHRcdFx0XHRcdGhhbmRsZXJRdWV1ZS5wdXNoKHsgZWxlbTogY3VyLCBtYXRjaGVzOiBtYXRjaGVzIH0pO1xuXHRcdFx0XHR9XG5cdFx0XHR9XG5cdFx0fVxuXG5cdFx0Ly8gQ29weSB0aGUgcmVtYWluaW5nIChib3VuZCkgaGFuZGxlcnMgaW4gY2FzZSB0aGV5J3JlIGNoYW5nZWRcblx0XHRoYW5kbGVycyA9IGhhbmRsZXJzLnNsaWNlKCBkZWxlZ2F0ZUNvdW50ICk7XG5cblx0XHQvLyBSdW4gZGVsZWdhdGVzIGZpcnN0OyB0aGV5IG1heSB3YW50IHRvIHN0b3AgcHJvcGFnYXRpb24gYmVuZWF0aCB1c1xuXHRcdGV2ZW50LmRlbGVnYXRlVGFyZ2V0ID0gdGhpcztcblx0XHRmb3IgKCBpID0gMDsgaSA8IGhhbmRsZXJRdWV1ZS5sZW5ndGggJiYgIWV2ZW50LmlzUHJvcGFnYXRpb25TdG9wcGVkKCk7IGkrKyApIHtcblx0XHRcdG1hdGNoZWQgPSBoYW5kbGVyUXVldWVbIGkgXTtcblx0XHRcdGRpc3BhdGNoKCBtYXRjaGVkLmVsZW0sIGV2ZW50LCBtYXRjaGVkLm1hdGNoZXMsIGFyZ3MgKTtcblx0XHR9XG5cdFx0ZGVsZXRlIGV2ZW50LmRlbGVnYXRlVGFyZ2V0O1xuXG5cdFx0Ly8gUnVuIG5vbi1kZWxlZ2F0ZWQgaGFuZGxlcnMgZm9yIHRoaXMgbGV2ZWxcblx0XHRpZiAoIGhhbmRsZXJzLmxlbmd0aCApIHtcblx0XHRcdGRpc3BhdGNoKCB0aGlzLCBldmVudCwgaGFuZGxlcnMsIGFyZ3MgKTtcblx0XHR9XG5cblx0XHRyZXR1cm4gZXZlbnQucmVzdWx0O1xuXHR9LFxuXG5cdC8vIEluY2x1ZGVzIHNvbWUgZXZlbnQgcHJvcHMgc2hhcmVkIGJ5IEtleUV2ZW50IGFuZCBNb3VzZUV2ZW50XG5cdC8vICoqKiBhdHRyQ2hhbmdlIGF0dHJOYW1lIHJlbGF0ZWROb2RlIHNyY0VsZW1lbnQgIGFyZSBub3Qgbm9ybWFsaXplZCwgbm9uLVczQywgZGVwcmVjYXRlZCwgd2lsbCBiZSByZW1vdmVkIGluIDEuOCAqKipcblx0cHJvcHM6IFwiYXR0ckNoYW5nZSBhdHRyTmFtZSByZWxhdGVkTm9kZSBzcmNFbGVtZW50IGFsdEtleSBidWJibGVzIGNhbmNlbGFibGUgY3RybEtleSBjdXJyZW50VGFyZ2V0IGV2ZW50UGhhc2UgbWV0YUtleSByZWxhdGVkVGFyZ2V0IHNoaWZ0S2V5IHRhcmdldCB0aW1lU3RhbXAgdmlldyB3aGljaFwiLnNwbGl0KFwiIFwiKSxcblxuXHRmaXhIb29rczoge30sXG5cblx0a2V5SG9va3M6IHtcblx0XHRwcm9wczogXCJjaGFyIGNoYXJDb2RlIGtleSBrZXlDb2RlXCIuc3BsaXQoXCIgXCIpLFxuXHRcdGZpbHRlcjogZnVuY3Rpb24oIGV2ZW50LCBvcmlnaW5hbCApIHtcblxuXHRcdFx0Ly8gQWRkIHdoaWNoIGZvciBrZXkgZXZlbnRzXG5cdFx0XHRpZiAoIGV2ZW50LndoaWNoID09IG51bGwgKSB7XG5cdFx0XHRcdGV2ZW50LndoaWNoID0gb3JpZ2luYWwuY2hhckNvZGUgIT0gbnVsbCA/IG9yaWdpbmFsLmNoYXJDb2RlIDogb3JpZ2luYWwua2V5Q29kZTtcblx0XHRcdH1cblxuXHRcdFx0cmV0dXJuIGV2ZW50O1xuXHRcdH1cblx0fSxcblxuXHRtb3VzZUhvb2tzOiB7XG5cdFx0cHJvcHM6IFwiYnV0dG9uIGJ1dHRvbnMgY2xpZW50WCBjbGllbnRZIGZyb21FbGVtZW50IGxheWVyWCBsYXllclkgb2Zmc2V0WCBvZmZzZXRZIHBhZ2VYIHBhZ2VZIHNjcmVlblggc2NyZWVuWSB0b0VsZW1lbnQgd2hlZWxEZWx0YVwiLnNwbGl0KFwiIFwiKSxcblx0XHRmaWx0ZXI6IGZ1bmN0aW9uKCBldmVudCwgb3JpZ2luYWwgKSB7XG5cdFx0XHR2YXIgZXZlbnREb2MsIGRvYywgYm9keSxcblx0XHRcdFx0YnV0dG9uID0gb3JpZ2luYWwuYnV0dG9uLFxuXHRcdFx0XHRmcm9tRWxlbWVudCA9IG9yaWdpbmFsLmZyb21FbGVtZW50O1xuXG5cdFx0XHQvLyBDYWxjdWxhdGUgcGFnZVgvWSBpZiBtaXNzaW5nIGFuZCBjbGllbnRYL1kgYXZhaWxhYmxlXG5cdFx0XHRpZiAoIGV2ZW50LnBhZ2VYID09IG51bGwgJiYgb3JpZ2luYWwuY2xpZW50WCAhPSBudWxsICkge1xuXHRcdFx0XHRldmVudERvYyA9IGV2ZW50LnRhcmdldC5vd25lckRvY3VtZW50IHx8IGRvY3VtZW50O1xuXHRcdFx0XHRkb2MgPSBldmVudERvYy5kb2N1bWVudEVsZW1lbnQ7XG5cdFx0XHRcdGJvZHkgPSBldmVudERvYy5ib2R5O1xuXG5cdFx0XHRcdGV2ZW50LnBhZ2VYID0gb3JpZ2luYWwuY2xpZW50WCArIChkb2MgJiYgZG9jLnNjcm9sbExlZnQgfHwgYm9keSAmJiBib2R5LnNjcm9sbExlZnQgfHwgMCkgLSAoZG9jICYmIGRvYy5jbGllbnRMZWZ0IHx8IGJvZHkgJiYgYm9keS5jbGllbnRMZWZ0IHx8IDApO1xuXHRcdFx0XHRldmVudC5wYWdlWSA9IG9yaWdpbmFsLmNsaWVudFkgKyAoZG9jICYmIGRvYy5zY3JvbGxUb3AgIHx8IGJvZHkgJiYgYm9keS5zY3JvbGxUb3AgIHx8IDApIC0gKGRvYyAmJiBkb2MuY2xpZW50VG9wICB8fCBib2R5ICYmIGJvZHkuY2xpZW50VG9wICB8fCAwKTtcblx0XHRcdH1cblxuXHRcdFx0Ly8gQWRkIHJlbGF0ZWRUYXJnZXQsIGlmIG5lY2Vzc2FyeVxuXHRcdFx0aWYgKCAhZXZlbnQucmVsYXRlZFRhcmdldCAmJiBmcm9tRWxlbWVudCApIHtcblx0XHRcdFx0ZXZlbnQucmVsYXRlZFRhcmdldCA9IGZyb21FbGVtZW50ID09PSBldmVudC50YXJnZXQgPyBvcmlnaW5hbC50b0VsZW1lbnQgOiBmcm9tRWxlbWVudDtcblx0XHRcdH1cblxuXHRcdFx0Ly8gQWRkIHdoaWNoIGZvciBjbGljazogMSA9PT0gbGVmdDsgMiA9PT0gbWlkZGxlOyAzID09PSByaWdodFxuXHRcdFx0Ly8gTm90ZTogYnV0dG9uIGlzIG5vdCBub3JtYWxpemVkLCBzbyBkb24ndCB1c2UgaXRcblx0XHRcdGlmICggIWV2ZW50LndoaWNoICYmIGJ1dHRvbiAhPT0gdW5kZWZpbmVkICkge1xuXHRcdFx0XHRldmVudC53aGljaCA9ICggYnV0dG9uICYgMSA/IDEgOiAoIGJ1dHRvbiAmIDIgPyAzIDogKCBidXR0b24gJiA0ID8gMiA6IDAgKSApICk7XG5cdFx0XHR9XG5cblx0XHRcdHJldHVybiBldmVudDtcblx0XHR9XG5cdH0sXG5cblx0Zml4OiBmdW5jdGlvbiggZXZlbnQgKSB7XG5cdFx0aWYgKCBldmVudFsgalF1ZXJ5LmV4cGFuZG8gXSApIHtcblx0XHRcdHJldHVybiBldmVudDtcblx0XHR9XG5cblx0XHQvLyBDcmVhdGUgYSB3cml0YWJsZSBjb3B5IG9mIHRoZSBldmVudCBvYmplY3QgYW5kIG5vcm1hbGl6ZSBzb21lIHByb3BlcnRpZXNcblx0XHR2YXIgaSwgcHJvcCxcblx0XHRcdG9yaWdpbmFsRXZlbnQgPSBldmVudCxcblx0XHRcdGZpeEhvb2sgPSBqUXVlcnkuZXZlbnQuZml4SG9va3NbIGV2ZW50LnR5cGUgXSB8fCB7fSxcblx0XHRcdGNvcHkgPSBmaXhIb29rLnByb3BzID8gdGhpcy5wcm9wcy5jb25jYXQoIGZpeEhvb2sucHJvcHMgKSA6IHRoaXMucHJvcHM7XG5cblx0XHRldmVudCA9IGpRdWVyeS5FdmVudCggb3JpZ2luYWxFdmVudCApO1xuXG5cdFx0Zm9yICggaSA9IGNvcHkubGVuZ3RoOyBpOyApIHtcblx0XHRcdHByb3AgPSBjb3B5WyAtLWkgXTtcblx0XHRcdGV2ZW50WyBwcm9wIF0gPSBvcmlnaW5hbEV2ZW50WyBwcm9wIF07XG5cdFx0fVxuXG5cdFx0Ly8gRml4IHRhcmdldCBwcm9wZXJ0eSwgaWYgbmVjZXNzYXJ5ICgjMTkyNSwgSUUgNi83LzggJiBTYWZhcmkyKVxuXHRcdGlmICggIWV2ZW50LnRhcmdldCApIHtcblx0XHRcdGV2ZW50LnRhcmdldCA9IG9yaWdpbmFsRXZlbnQuc3JjRWxlbWVudCB8fCBkb2N1bWVudDtcblx0XHR9XG5cblx0XHQvLyBUYXJnZXQgc2hvdWxkIG5vdCBiZSBhIHRleHQgbm9kZSAoIzUwNCwgU2FmYXJpKVxuXHRcdGlmICggZXZlbnQudGFyZ2V0Lm5vZGVUeXBlID09PSAzICkge1xuXHRcdFx0ZXZlbnQudGFyZ2V0ID0gZXZlbnQudGFyZ2V0LnBhcmVudE5vZGU7XG5cdFx0fVxuXG5cdFx0Ly8gRm9yIG1vdXNlL2tleSBldmVudHM7IGFkZCBtZXRhS2V5IGlmIGl0J3Mgbm90IHRoZXJlICgjMzM2OCwgSUU2LzcvOClcblx0XHRpZiAoIGV2ZW50Lm1ldGFLZXkgPT09IHVuZGVmaW5lZCApIHtcblx0XHRcdGV2ZW50Lm1ldGFLZXkgPSBldmVudC5jdHJsS2V5O1xuXHRcdH1cblxuXHRcdHJldHVybiBmaXhIb29rLmZpbHRlcj8gZml4SG9vay5maWx0ZXIoIGV2ZW50LCBvcmlnaW5hbEV2ZW50ICkgOiBldmVudDtcblx0fSxcblxuXHRzcGVjaWFsOiB7XG5cdFx0cmVhZHk6IHtcblx0XHRcdC8vIE1ha2Ugc3VyZSB0aGUgcmVhZHkgZXZlbnQgaXMgc2V0dXBcblx0XHRcdHNldHVwOiBqUXVlcnkuYmluZFJlYWR5XG5cdFx0fSxcblxuXHRcdGZvY3VzOiB7XG5cdFx0XHRkZWxlZ2F0ZVR5cGU6IFwiZm9jdXNpblwiLFxuXHRcdFx0bm9CdWJibGU6IHRydWVcblx0XHR9LFxuXHRcdGJsdXI6IHtcblx0XHRcdGRlbGVnYXRlVHlwZTogXCJmb2N1c291dFwiLFxuXHRcdFx0bm9CdWJibGU6IHRydWVcblx0XHR9LFxuXG5cdFx0YmVmb3JldW5sb2FkOiB7XG5cdFx0XHRzZXR1cDogZnVuY3Rpb24oIGRhdGEsIG5hbWVzcGFjZXMsIGV2ZW50SGFuZGxlICkge1xuXHRcdFx0XHQvLyBXZSBvbmx5IHdhbnQgdG8gZG8gdGhpcyBzcGVjaWFsIGNhc2Ugb24gd2luZG93c1xuXHRcdFx0XHRpZiAoIGpRdWVyeS5pc1dpbmRvdyggdGhpcyApICkge1xuXHRcdFx0XHRcdHRoaXMub25iZWZvcmV1bmxvYWQgPSBldmVudEhhbmRsZTtcblx0XHRcdFx0fVxuXHRcdFx0fSxcblxuXHRcdFx0dGVhcmRvd246IGZ1bmN0aW9uKCBuYW1lc3BhY2VzLCBldmVudEhhbmRsZSApIHtcblx0XHRcdFx0aWYgKCB0aGlzLm9uYmVmb3JldW5sb2FkID09PSBldmVudEhhbmRsZSApIHtcblx0XHRcdFx0XHR0aGlzLm9uYmVmb3JldW5sb2FkID0gbnVsbDtcblx0XHRcdFx0fVxuXHRcdFx0fVxuXHRcdH1cblx0fSxcblxuXHRzaW11bGF0ZTogZnVuY3Rpb24oIHR5cGUsIGVsZW0sIGV2ZW50LCBidWJibGUgKSB7XG5cdFx0Ly8gUGlnZ3liYWNrIG9uIGEgZG9ub3IgZXZlbnQgdG8gc2ltdWxhdGUgYSBkaWZmZXJlbnQgb25lLlxuXHRcdC8vIEZha2Ugb3JpZ2luYWxFdmVudCB0byBhdm9pZCBkb25vcidzIHN0b3BQcm9wYWdhdGlvbiwgYnV0IGlmIHRoZVxuXHRcdC8vIHNpbXVsYXRlZCBldmVudCBwcmV2ZW50cyBkZWZhdWx0IHRoZW4gd2UgZG8gdGhlIHNhbWUgb24gdGhlIGRvbm9yLlxuXHRcdHZhciBlID0galF1ZXJ5LmV4dGVuZChcblx0XHRcdG5ldyBqUXVlcnkuRXZlbnQoKSxcblx0XHRcdGV2ZW50LFxuXHRcdFx0eyB0eXBlOiB0eXBlLFxuXHRcdFx0XHRpc1NpbXVsYXRlZDogdHJ1ZSxcblx0XHRcdFx0b3JpZ2luYWxFdmVudDoge31cblx0XHRcdH1cblx0XHQpO1xuXHRcdGlmICggYnViYmxlICkge1xuXHRcdFx0alF1ZXJ5LmV2ZW50LnRyaWdnZXIoIGUsIG51bGwsIGVsZW0gKTtcblx0XHR9IGVsc2Uge1xuXHRcdFx0alF1ZXJ5LmV2ZW50LmhhbmRsZS5jYWxsKCBlbGVtLCBlICk7XG5cdFx0fVxuXHRcdGlmICggZS5pc0RlZmF1bHRQcmV2ZW50ZWQoKSApIHtcblx0XHRcdGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG5cdFx0fVxuXHR9XG59O1xuXG4vLyBSdW4galF1ZXJ5IGhhbmRsZXIgZnVuY3Rpb25zOyBjYWxsZWQgZnJvbSBqUXVlcnkuZXZlbnQuaGFuZGxlXG5mdW5jdGlvbiBkaXNwYXRjaCggdGFyZ2V0LCBldmVudCwgaGFuZGxlcnMsIGFyZ3MgKSB7XG5cdHZhciBydW5fYWxsID0gIWV2ZW50LmV4Y2x1c2l2ZSAmJiAhZXZlbnQubmFtZXNwYWNlLFxuXHRcdHNwZWNpYWxIYW5kbGUgPSAoIGpRdWVyeS5ldmVudC5zcGVjaWFsWyBldmVudC50eXBlIF0gfHwge30gKS5oYW5kbGUsXG5cdFx0aiwgaGFuZGxlT2JqLCByZXQ7XG5cblx0ZXZlbnQuY3VycmVudFRhcmdldCA9IHRhcmdldDtcblx0Zm9yICggaiA9IDA7IGogPCBoYW5kbGVycy5sZW5ndGggJiYgIWV2ZW50LmlzSW1tZWRpYXRlUHJvcGFnYXRpb25TdG9wcGVkKCk7IGorKyApIHtcblx0XHRoYW5kbGVPYmogPSBoYW5kbGVyc1sgaiBdO1xuXG5cdFx0Ly8gVHJpZ2dlcmVkIGV2ZW50IG11c3QgZWl0aGVyIDEpIGJlIG5vbi1leGNsdXNpdmUgYW5kIGhhdmUgbm8gbmFtZXNwYWNlLCBvclxuXHRcdC8vIDIpIGhhdmUgbmFtZXNwYWNlKHMpIGEgc3Vic2V0IG9yIGVxdWFsIHRvIHRob3NlIGluIHRoZSBib3VuZCBldmVudCAoYm90aCBjYW4gaGF2ZSBubyBuYW1lc3BhY2UpLlxuXHRcdGlmICggcnVuX2FsbCB8fCAoIWV2ZW50Lm5hbWVzcGFjZSAmJiAhaGFuZGxlT2JqLm5hbWVzcGFjZSkgfHwgZXZlbnQubmFtZXNwYWNlX3JlICYmIGV2ZW50Lm5hbWVzcGFjZV9yZS50ZXN0KCBoYW5kbGVPYmoubmFtZXNwYWNlICkgKSB7XG5cblx0XHRcdC8vIFBhc3MgaW4gYSByZWZlcmVuY2UgdG8gdGhlIGhhbmRsZXIgZnVuY3Rpb24gaXRzZWxmXG5cdFx0XHQvLyBTbyB0aGF0IHdlIGNhbiBsYXRlciByZW1vdmUgaXRcblx0XHRcdGV2ZW50LmhhbmRsZXIgPSBoYW5kbGVPYmouaGFuZGxlcjtcblx0XHRcdGV2ZW50LmRhdGEgPSBoYW5kbGVPYmouZGF0YTtcblx0XHRcdGV2ZW50LmhhbmRsZU9iaiA9IGhhbmRsZU9iajtcblxuXHRcdFx0cmV0ID0gKCBzcGVjaWFsSGFuZGxlIHx8IGhhbmRsZU9iai5oYW5kbGVyICkuYXBwbHkoIHRhcmdldCwgYXJncyApO1xuXG5cdFx0XHRpZiAoIHJldCAhPT0gdW5kZWZpbmVkICkge1xuXHRcdFx0XHRldmVudC5yZXN1bHQgPSByZXQ7XG5cdFx0XHRcdGlmICggcmV0ID09PSBmYWxzZSApIHtcblx0XHRcdFx0XHRldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuXHRcdFx0XHRcdGV2ZW50LnN0b3BQcm9wYWdhdGlvbigpO1xuXHRcdFx0XHR9XG5cdFx0XHR9XG5cdFx0fVxuXHR9XG59XG5cbmpRdWVyeS5yZW1vdmVFdmVudCA9IGRvY3VtZW50LnJlbW92ZUV2ZW50TGlzdGVuZXIgP1xuXHRmdW5jdGlvbiggZWxlbSwgdHlwZSwgaGFuZGxlICkge1xuXHRcdGlmICggZWxlbS5yZW1vdmVFdmVudExpc3RlbmVyICkge1xuXHRcdFx0ZWxlbS5yZW1vdmVFdmVudExpc3RlbmVyKCB0eXBlLCBoYW5kbGUsIGZhbHNlICk7XG5cdFx0fVxuXHR9IDpcblx0ZnVuY3Rpb24oIGVsZW0sIHR5cGUsIGhhbmRsZSApIHtcblx0XHRpZiAoIGVsZW0uZGV0YWNoRXZlbnQgKSB7XG5cdFx0XHRlbGVtLmRldGFjaEV2ZW50KCBcIm9uXCIgKyB0eXBlLCBoYW5kbGUgKTtcblx0XHR9XG5cdH07XG5cbmpRdWVyeS5FdmVudCA9IGZ1bmN0aW9uKCBzcmMsIHByb3BzICkge1xuXHQvLyBBbGxvdyBpbnN0YW50aWF0aW9uIHdpdGhvdXQgdGhlICduZXcnIGtleXdvcmRcblx0aWYgKCAhKHRoaXMgaW5zdGFuY2VvZiBqUXVlcnkuRXZlbnQpICkge1xuXHRcdHJldHVybiBuZXcgalF1ZXJ5LkV2ZW50KCBzcmMsIHByb3BzICk7XG5cdH1cblxuXHQvLyBFdmVudCBvYmplY3Rcblx0aWYgKCBzcmMgJiYgc3JjLnR5cGUgKSB7XG5cdFx0dGhpcy5vcmlnaW5hbEV2ZW50ID0gc3JjO1xuXHRcdHRoaXMudHlwZSA9IHNyYy50eXBlO1xuXG5cdFx0Ly8gRXZlbnRzIGJ1YmJsaW5nIHVwIHRoZSBkb2N1bWVudCBtYXkgaGF2ZSBiZWVuIG1hcmtlZCBhcyBwcmV2ZW50ZWRcblx0XHQvLyBieSBhIGhhbmRsZXIgbG93ZXIgZG93biB0aGUgdHJlZTsgcmVmbGVjdCB0aGUgY29ycmVjdCB2YWx1ZS5cblx0XHR0aGlzLmlzRGVmYXVsdFByZXZlbnRlZCA9ICggc3JjLmRlZmF1bHRQcmV2ZW50ZWQgfHwgc3JjLnJldHVyblZhbHVlID09PSBmYWxzZSB8fFxuXHRcdFx0c3JjLmdldFByZXZlbnREZWZhdWx0ICYmIHNyYy5nZXRQcmV2ZW50RGVmYXVsdCgpICkgPyByZXR1cm5UcnVlIDogcmV0dXJuRmFsc2U7XG5cblx0Ly8gRXZlbnQgdHlwZVxuXHR9IGVsc2Uge1xuXHRcdHRoaXMudHlwZSA9IHNyYztcblx0fVxuXG5cdC8vIFB1dCBleHBsaWNpdGx5IHByb3ZpZGVkIHByb3BlcnRpZXMgb250byB0aGUgZXZlbnQgb2JqZWN0XG5cdGlmICggcHJvcHMgKSB7XG5cdFx0alF1ZXJ5LmV4dGVuZCggdGhpcywgcHJvcHMgKTtcblx0fVxuXG5cdC8vIENyZWF0ZSBhIHRpbWVzdGFtcCBpZiBpbmNvbWluZyBldmVudCBkb2Vzbid0IGhhdmUgb25lXG5cdHRoaXMudGltZVN0YW1wID0gc3JjICYmIHNyYy50aW1lU3RhbXAgfHwgalF1ZXJ5Lm5vdygpO1xuXG5cdC8vIE1hcmsgaXQgYXMgZml4ZWRcblx0dGhpc1sgalF1ZXJ5LmV4cGFuZG8gXSA9IHRydWU7XG59O1xuXG5mdW5jdGlvbiByZXR1cm5GYWxzZSgpIHtcblx0cmV0dXJuIGZhbHNlO1xufVxuZnVuY3Rpb24gcmV0dXJuVHJ1ZSgpIHtcblx0cmV0dXJuIHRydWU7XG59XG5cbi8vIGpRdWVyeS5FdmVudCBpcyBiYXNlZCBvbiBET00zIEV2ZW50cyBhcyBzcGVjaWZpZWQgYnkgdGhlIEVDTUFTY3JpcHQgTGFuZ3VhZ2UgQmluZGluZ1xuLy8gaHR0cDovL3d3dy53My5vcmcvVFIvMjAwMy9XRC1ET00tTGV2ZWwtMy1FdmVudHMtMjAwMzAzMzEvZWNtYS1zY3JpcHQtYmluZGluZy5odG1sXG5qUXVlcnkuRXZlbnQucHJvdG90eXBlID0ge1xuXHRwcmV2ZW50RGVmYXVsdDogZnVuY3Rpb24oKSB7XG5cdFx0dGhpcy5pc0RlZmF1bHRQcmV2ZW50ZWQgPSByZXR1cm5UcnVlO1xuXG5cdFx0dmFyIGUgPSB0aGlzLm9yaWdpbmFsRXZlbnQ7XG5cdFx0aWYgKCAhZSApIHtcblx0XHRcdHJldHVybjtcblx0XHR9XG5cblx0XHQvLyBpZiBwcmV2ZW50RGVmYXVsdCBleGlzdHMgcnVuIGl0IG9uIHRoZSBvcmlnaW5hbCBldmVudFxuXHRcdGlmICggZS5wcmV2ZW50RGVmYXVsdCApIHtcblx0XHRcdGUucHJldmVudERlZmF1bHQoKTtcblxuXHRcdC8vIG90aGVyd2lzZSBzZXQgdGhlIHJldHVyblZhbHVlIHByb3BlcnR5IG9mIHRoZSBvcmlnaW5hbCBldmVudCB0byBmYWxzZSAoSUUpXG5cdFx0fSBlbHNlIHtcblx0XHRcdGUucmV0dXJuVmFsdWUgPSBmYWxzZTtcblx0XHR9XG5cdH0sXG5cdHN0b3BQcm9wYWdhdGlvbjogZnVuY3Rpb24oKSB7XG5cdFx0dGhpcy5pc1Byb3BhZ2F0aW9uU3RvcHBlZCA9IHJldHVyblRydWU7XG5cblx0XHR2YXIgZSA9IHRoaXMub3JpZ2luYWxFdmVudDtcblx0XHRpZiAoICFlICkge1xuXHRcdFx0cmV0dXJuO1xuXHRcdH1cblx0XHQvLyBpZiBzdG9wUHJvcGFnYXRpb24gZXhpc3RzIHJ1biBpdCBvbiB0aGUgb3JpZ2luYWwgZXZlbnRcblx0XHRpZiAoIGUuc3RvcFByb3BhZ2F0aW9uICkge1xuXHRcdFx0ZS5zdG9wUHJvcGFnYXRpb24oKTtcblx0XHR9XG5cdFx0Ly8gb3RoZXJ3aXNlIHNldCB0aGUgY2FuY2VsQnViYmxlIHByb3BlcnR5IG9mIHRoZSBvcmlnaW5hbCBldmVudCB0byB0cnVlIChJRSlcblx0XHRlLmNhbmNlbEJ1YmJsZSA9IHRydWU7XG5cdH0sXG5cdHN0b3BJbW1lZGlhdGVQcm9wYWdhdGlvbjogZnVuY3Rpb24oKSB7XG5cdFx0dGhpcy5pc0ltbWVkaWF0ZVByb3BhZ2F0aW9uU3RvcHBlZCA9IHJldHVyblRydWU7XG5cdFx0dGhpcy5zdG9wUHJvcGFnYXRpb24oKTtcblx0fSxcblx0aXNEZWZhdWx0UHJldmVudGVkOiByZXR1cm5GYWxzZSxcblx0aXNQcm9wYWdhdGlvblN0b3BwZWQ6IHJldHVybkZhbHNlLFxuXHRpc0ltbWVkaWF0ZVByb3BhZ2F0aW9uU3RvcHBlZDogcmV0dXJuRmFsc2Vcbn07XG5cbi8vIENyZWF0ZSBtb3VzZWVudGVyL2xlYXZlIGV2ZW50cyB1c2luZyBtb3VzZW92ZXIvb3V0IGFuZCBldmVudC10aW1lIGNoZWNrc1xualF1ZXJ5LmVhY2goe1xuXHRtb3VzZWVudGVyOiBcIm1vdXNlb3ZlclwiLFxuXHRtb3VzZWxlYXZlOiBcIm1vdXNlb3V0XCJcbn0sIGZ1bmN0aW9uKCBvcmlnLCBmaXggKSB7XG5cdGpRdWVyeS5ldmVudC5zcGVjaWFsWyBvcmlnIF0gPSBqUXVlcnkuZXZlbnQuc3BlY2lhbFsgZml4IF0gPSB7XG5cdFx0ZGVsZWdhdGVUeXBlOiBmaXgsXG5cdFx0YmluZFR5cGU6IGZpeCxcblxuXHRcdGhhbmRsZTogZnVuY3Rpb24oIGV2ZW50ICkge1xuXHRcdFx0dmFyIHRhcmdldCA9IHRoaXMsXG5cdFx0XHRcdHJlbGF0ZWQgPSBldmVudC5yZWxhdGVkVGFyZ2V0LFxuXHRcdFx0XHRoYW5kbGVPYmogPSBldmVudC5oYW5kbGVPYmosXG5cdFx0XHRcdHNlbGVjdG9yID0gaGFuZGxlT2JqLnNlbGVjdG9yLFxuXHRcdFx0XHRvbGRUeXBlLCByZXQ7XG5cblx0XHRcdC8vIEZvciBhIHJlYWwgbW91c2VvdmVyL291dCwgYWx3YXlzIGNhbGwgdGhlIGhhbmRsZXI7IGZvclxuXHRcdFx0Ly8gbW91c2VudGVyL2xlYXZlIGNhbGwgdGhlIGhhbmRsZXIgaWYgcmVsYXRlZCBpcyBvdXRzaWRlIHRoZSB0YXJnZXQuXG5cdFx0XHQvLyBOQjogTm8gcmVsYXRlZFRhcmdldCBpZiB0aGUgbW91c2UgbGVmdC9lbnRlcmVkIHRoZSBicm93c2VyIHdpbmRvd1xuXHRcdFx0aWYgKCAhcmVsYXRlZCB8fCBoYW5kbGVPYmoub3JpZ1R5cGUgPT09IGV2ZW50LnR5cGUgfHwgKHJlbGF0ZWQgIT09IHRhcmdldCAmJiAhalF1ZXJ5LmNvbnRhaW5zKCB0YXJnZXQsIHJlbGF0ZWQgKSkgKSB7XG5cdFx0XHRcdG9sZFR5cGUgPSBldmVudC50eXBlO1xuXHRcdFx0XHRldmVudC50eXBlID0gaGFuZGxlT2JqLm9yaWdUeXBlO1xuXHRcdFx0XHRyZXQgPSBoYW5kbGVPYmouaGFuZGxlci5hcHBseSggdGhpcywgYXJndW1lbnRzICk7XG5cdFx0XHRcdGV2ZW50LnR5cGUgPSBvbGRUeXBlO1xuXHRcdFx0fVxuXHRcdFx0cmV0dXJuIHJldDtcblx0XHR9XG5cdH07XG59KTtcblxuLy8gSUUgc3VibWl0IGRlbGVnYXRpb25cbmlmICggIWpRdWVyeS5zdXBwb3J0LnN1Ym1pdEJ1YmJsZXMgKSB7XG5cblx0alF1ZXJ5LmV2ZW50LnNwZWNpYWwuc3VibWl0ID0ge1xuXHRcdHNldHVwOiBmdW5jdGlvbigpIHtcblx0XHRcdC8vIE9ubHkgbmVlZCB0aGlzIGZvciBkZWxlZ2F0ZWQgZm9ybSBzdWJtaXQgZXZlbnRzXG5cdFx0XHRpZiAoIGpRdWVyeS5ub2RlTmFtZSggdGhpcywgXCJmb3JtXCIgKSApIHtcblx0XHRcdFx0cmV0dXJuIGZhbHNlO1xuXHRcdFx0fVxuXG5cdFx0XHQvLyBMYXp5LWFkZCBhIHN1Ym1pdCBoYW5kbGVyIHdoZW4gYSBkZXNjZW5kYW50IGZvcm0gbWF5IHBvdGVudGlhbGx5IGJlIHN1Ym1pdHRlZFxuXHRcdFx0alF1ZXJ5LmV2ZW50LmFkZCggdGhpcywgXCJjbGljay5fc3VibWl0IGtleXByZXNzLl9zdWJtaXRcIiwgZnVuY3Rpb24oIGUgKSB7XG5cdFx0XHRcdC8vIE5vZGUgbmFtZSBjaGVjayBhdm9pZHMgYSBWTUwtcmVsYXRlZCBjcmFzaCBpbiBJRSAoIzk4MDcpXG5cdFx0XHRcdHZhciBlbGVtID0gZS50YXJnZXQsXG5cdFx0XHRcdFx0Zm9ybSA9IGpRdWVyeS5ub2RlTmFtZSggZWxlbSwgXCJpbnB1dFwiICkgfHwgalF1ZXJ5Lm5vZGVOYW1lKCBlbGVtLCBcImJ1dHRvblwiICkgPyBlbGVtLmZvcm0gOiB1bmRlZmluZWQ7XG5cdFx0XHRcdGlmICggZm9ybSAmJiAhZm9ybS5fc3VibWl0X2F0dGFjaGVkICkge1xuXHRcdFx0XHRcdGpRdWVyeS5ldmVudC5hZGQoIGZvcm0sIFwic3VibWl0Ll9zdWJtaXRcIiwgZnVuY3Rpb24oIGV2ZW50ICkge1xuXHRcdFx0XHRcdFx0Ly8gRm9ybSB3YXMgc3VibWl0dGVkLCBidWJibGUgdGhlIGV2ZW50IHVwIHRoZSB0cmVlXG5cdFx0XHRcdFx0XHRpZiAoIHRoaXMucGFyZW50Tm9kZSApIHtcblx0XHRcdFx0XHRcdFx0alF1ZXJ5LmV2ZW50LnNpbXVsYXRlKCBcInN1Ym1pdFwiLCB0aGlzLnBhcmVudE5vZGUsIGV2ZW50LCB0cnVlICk7XG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0fSk7XG5cdFx0XHRcdFx0Zm9ybS5fc3VibWl0X2F0dGFjaGVkID0gdHJ1ZTtcblx0XHRcdFx0fVxuXHRcdFx0fSk7XG5cdFx0XHQvLyByZXR1cm4gdW5kZWZpbmVkIHNpbmNlIHdlIGRvbid0IG5lZWQgYW4gZXZlbnQgbGlzdGVuZXJcblx0XHR9LFxuXG5cdFx0dGVhcmRvd246IGZ1bmN0aW9uKCkge1xuXHRcdFx0Ly8gT25seSBuZWVkIHRoaXMgZm9yIGRlbGVnYXRlZCBmb3JtIHN1Ym1pdCBldmVudHNcblx0XHRcdGlmICggalF1ZXJ5Lm5vZGVOYW1lKCB0aGlzLCBcImZvcm1cIiApICkge1xuXHRcdFx0XHRyZXR1cm4gZmFsc2U7XG5cdFx0XHR9XG5cblx0XHRcdC8vIFJlbW92ZSBkZWxlZ2F0ZWQgaGFuZGxlcnM7IGNsZWFuRGF0YSBldmVudHVhbGx5IHJlYXBzIHN1Ym1pdCBoYW5kbGVycyBhdHRhY2hlZCBhYm92ZVxuXHRcdFx0alF1ZXJ5LmV2ZW50LnJlbW92ZSggdGhpcywgXCIuX3N1Ym1pdFwiICk7XG5cdFx0fVxuXHR9O1xufVxuXG4vLyBJRSBjaGFuZ2UgZGVsZWdhdGlvbiBhbmQgY2hlY2tib3gvcmFkaW8gZml4XG5pZiAoICFqUXVlcnkuc3VwcG9ydC5jaGFuZ2VCdWJibGVzICkge1xuXG5cdGpRdWVyeS5ldmVudC5zcGVjaWFsLmNoYW5nZSA9IHtcblxuXHRcdHNldHVwOiBmdW5jdGlvbigpIHtcblxuXHRcdFx0aWYgKCByZm9ybUVsZW1zLnRlc3QoIHRoaXMubm9kZU5hbWUgKSApIHtcblx0XHRcdFx0Ly8gSUUgZG9lc24ndCBmaXJlIGNoYW5nZSBvbiBhIGNoZWNrL3JhZGlvIHVudGlsIGJsdXI7IHRyaWdnZXIgaXQgb24gY2xpY2tcblx0XHRcdFx0Ly8gYWZ0ZXIgYSBwcm9wZXJ0eWNoYW5nZS4gRWF0IHRoZSBibHVyLWNoYW5nZSBpbiBzcGVjaWFsLmNoYW5nZS5oYW5kbGUuXG5cdFx0XHRcdC8vIFRoaXMgc3RpbGwgZmlyZXMgb25jaGFuZ2UgYSBzZWNvbmQgdGltZSBmb3IgY2hlY2svcmFkaW8gYWZ0ZXIgYmx1ci5cblx0XHRcdFx0aWYgKCB0aGlzLnR5cGUgPT09IFwiY2hlY2tib3hcIiB8fCB0aGlzLnR5cGUgPT09IFwicmFkaW9cIiApIHtcblx0XHRcdFx0XHRqUXVlcnkuZXZlbnQuYWRkKCB0aGlzLCBcInByb3BlcnR5Y2hhbmdlLl9jaGFuZ2VcIiwgZnVuY3Rpb24oIGV2ZW50ICkge1xuXHRcdFx0XHRcdFx0aWYgKCBldmVudC5vcmlnaW5hbEV2ZW50LnByb3BlcnR5TmFtZSA9PT0gXCJjaGVja2VkXCIgKSB7XG5cdFx0XHRcdFx0XHRcdHRoaXMuX2p1c3RfY2hhbmdlZCA9IHRydWU7XG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0fSk7XG5cdFx0XHRcdFx0alF1ZXJ5LmV2ZW50LmFkZCggdGhpcywgXCJjbGljay5fY2hhbmdlXCIsIGZ1bmN0aW9uKCBldmVudCApIHtcblx0XHRcdFx0XHRcdGlmICggdGhpcy5fanVzdF9jaGFuZ2VkICkge1xuXHRcdFx0XHRcdFx0XHR0aGlzLl9qdXN0X2NoYW5nZWQgPSBmYWxzZTtcblx0XHRcdFx0XHRcdFx0alF1ZXJ5LmV2ZW50LnNpbXVsYXRlKCBcImNoYW5nZVwiLCB0aGlzLCBldmVudCwgdHJ1ZSApO1xuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdH0pO1xuXHRcdFx0XHR9XG5cdFx0XHRcdHJldHVybiBmYWxzZTtcblx0XHRcdH1cblx0XHRcdC8vIERlbGVnYXRlZCBldmVudDsgbGF6eS1hZGQgYSBjaGFuZ2UgaGFuZGxlciBvbiBkZXNjZW5kYW50IGlucHV0c1xuXHRcdFx0alF1ZXJ5LmV2ZW50LmFkZCggdGhpcywgXCJiZWZvcmVhY3RpdmF0ZS5fY2hhbmdlXCIsIGZ1bmN0aW9uKCBlICkge1xuXHRcdFx0XHR2YXIgZWxlbSA9IGUudGFyZ2V0O1xuXG5cdFx0XHRcdGlmICggcmZvcm1FbGVtcy50ZXN0KCBlbGVtLm5vZGVOYW1lICkgJiYgIWVsZW0uX2NoYW5nZV9hdHRhY2hlZCApIHtcblx0XHRcdFx0XHRqUXVlcnkuZXZlbnQuYWRkKCBlbGVtLCBcImNoYW5nZS5fY2hhbmdlXCIsIGZ1bmN0aW9uKCBldmVudCApIHtcblx0XHRcdFx0XHRcdGlmICggdGhpcy5wYXJlbnROb2RlICYmICFldmVudC5pc1NpbXVsYXRlZCApIHtcblx0XHRcdFx0XHRcdFx0alF1ZXJ5LmV2ZW50LnNpbXVsYXRlKCBcImNoYW5nZVwiLCB0aGlzLnBhcmVudE5vZGUsIGV2ZW50LCB0cnVlICk7XG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0fSk7XG5cdFx0XHRcdFx0ZWxlbS5fY2hhbmdlX2F0dGFjaGVkID0gdHJ1ZTtcblx0XHRcdFx0fVxuXHRcdFx0fSk7XG5cdFx0fSxcblxuXHRcdGhhbmRsZTogZnVuY3Rpb24oIGV2ZW50ICkge1xuXHRcdFx0dmFyIGVsZW0gPSBldmVudC50YXJnZXQ7XG5cblx0XHRcdC8vIFN3YWxsb3cgbmF0aXZlIGNoYW5nZSBldmVudHMgZnJvbSBjaGVja2JveC9yYWRpbywgd2UgYWxyZWFkeSB0cmlnZ2VyZWQgdGhlbSBhYm92ZVxuXHRcdFx0aWYgKCB0aGlzICE9PSBlbGVtIHx8IGV2ZW50LmlzU2ltdWxhdGVkIHx8IGV2ZW50LmlzVHJpZ2dlciB8fCAoZWxlbS50eXBlICE9PSBcInJhZGlvXCIgJiYgZWxlbS50eXBlICE9PSBcImNoZWNrYm94XCIpICkge1xuXHRcdFx0XHRyZXR1cm4gZXZlbnQuaGFuZGxlT2JqLmhhbmRsZXIuYXBwbHkoIHRoaXMsIGFyZ3VtZW50cyApO1xuXHRcdFx0fVxuXHRcdH0sXG5cblx0XHR0ZWFyZG93bjogZnVuY3Rpb24oKSB7XG5cdFx0XHRqUXVlcnkuZXZlbnQucmVtb3ZlKCB0aGlzLCBcIi5fY2hhbmdlXCIgKTtcblxuXHRcdFx0cmV0dXJuIHJmb3JtRWxlbXMudGVzdCggdGhpcy5ub2RlTmFtZSApO1xuXHRcdH1cblx0fTtcbn1cblxuLy8gQ3JlYXRlIFwiYnViYmxpbmdcIiBmb2N1cyBhbmQgYmx1ciBldmVudHNcbmlmICggIWpRdWVyeS5zdXBwb3J0LmZvY3VzaW5CdWJibGVzICkge1xuXHRqUXVlcnkuZWFjaCh7IGZvY3VzOiBcImZvY3VzaW5cIiwgYmx1cjogXCJmb2N1c291dFwiIH0sIGZ1bmN0aW9uKCBvcmlnLCBmaXggKSB7XG5cblx0XHQvLyBBdHRhY2ggYSBzaW5nbGUgY2FwdHVyaW5nIGhhbmRsZXIgd2hpbGUgc29tZW9uZSB3YW50cyBmb2N1c2luL2ZvY3Vzb3V0XG5cdFx0dmFyIGF0dGFjaGVzID0gMCxcblx0XHRcdGhhbmRsZXIgPSBmdW5jdGlvbiggZXZlbnQgKSB7XG5cdFx0XHRcdGpRdWVyeS5ldmVudC5zaW11bGF0ZSggZml4LCBldmVudC50YXJnZXQsIGpRdWVyeS5ldmVudC5maXgoIGV2ZW50ICksIHRydWUgKTtcblx0XHRcdH07XG5cblx0XHRqUXVlcnkuZXZlbnQuc3BlY2lhbFsgZml4IF0gPSB7XG5cdFx0XHRzZXR1cDogZnVuY3Rpb24oKSB7XG5cdFx0XHRcdGlmICggYXR0YWNoZXMrKyA9PT0gMCApIHtcblx0XHRcdFx0XHRkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKCBvcmlnLCBoYW5kbGVyLCB0cnVlICk7XG5cdFx0XHRcdH1cblx0XHRcdH0sXG5cdFx0XHR0ZWFyZG93bjogZnVuY3Rpb24oKSB7XG5cdFx0XHRcdGlmICggLS1hdHRhY2hlcyA9PT0gMCApIHtcblx0XHRcdFx0XHRkb2N1bWVudC5yZW1vdmVFdmVudExpc3RlbmVyKCBvcmlnLCBoYW5kbGVyLCB0cnVlICk7XG5cdFx0XHRcdH1cblx0XHRcdH1cblx0XHR9O1xuXHR9KTtcbn1cblxualF1ZXJ5LmZuLmV4dGVuZCh7XG5cblx0b246IGZ1bmN0aW9uKCB0eXBlcywgc2VsZWN0b3IsIGRhdGEsIGZuLCAvKklOVEVSTkFMKi8gb25lICkge1xuXHRcdHZhciBvcmlnRm4sIHR5cGU7XG5cblx0XHQvLyBUeXBlcyBjYW4gYmUgYSBtYXAgb2YgdHlwZXMvaGFuZGxlcnNcblx0XHRpZiAoIHR5cGVvZiB0eXBlcyA9PT0gXCJvYmplY3RcIiApIHtcblx0XHRcdC8vICggdHlwZXMtT2JqZWN0LCBzZWxlY3RvciwgZGF0YSApXG5cdFx0XHRpZiAoIHR5cGVvZiBzZWxlY3RvciAhPT0gXCJzdHJpbmdcIiApIHtcblx0XHRcdFx0Ly8gKCB0eXBlcy1PYmplY3QsIGRhdGEgKVxuXHRcdFx0XHRkYXRhID0gc2VsZWN0b3I7XG5cdFx0XHRcdHNlbGVjdG9yID0gdW5kZWZpbmVkO1xuXHRcdFx0fVxuXHRcdFx0Zm9yICggdHlwZSBpbiB0eXBlcyApIHtcblx0XHRcdFx0dGhpcy5vbiggdHlwZSwgc2VsZWN0b3IsIGRhdGEsIHR5cGVzWyB0eXBlIF0sIG9uZSApO1xuXHRcdFx0fVxuXHRcdFx0cmV0dXJuIHRoaXM7XG5cdFx0fVxuXG5cdFx0aWYgKCBkYXRhID09IG51bGwgJiYgZm4gPT0gbnVsbCApIHtcblx0XHRcdC8vICggdHlwZXMsIGZuIClcblx0XHRcdGZuID0gc2VsZWN0b3I7XG5cdFx0XHRkYXRhID0gc2VsZWN0b3IgPSB1bmRlZmluZWQ7XG5cdFx0fSBlbHNlIGlmICggZm4gPT0gbnVsbCApIHtcblx0XHRcdGlmICggdHlwZW9mIHNlbGVjdG9yID09PSBcInN0cmluZ1wiICkge1xuXHRcdFx0XHQvLyAoIHR5cGVzLCBzZWxlY3RvciwgZm4gKVxuXHRcdFx0XHRmbiA9IGRhdGE7XG5cdFx0XHRcdGRhdGEgPSB1bmRlZmluZWQ7XG5cdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHQvLyAoIHR5cGVzLCBkYXRhLCBmbiApXG5cdFx0XHRcdGZuID0gZGF0YTtcblx0XHRcdFx0ZGF0YSA9IHNlbGVjdG9yO1xuXHRcdFx0XHRzZWxlY3RvciA9IHVuZGVmaW5lZDtcblx0XHRcdH1cblx0XHR9XG5cdFx0aWYgKCBmbiA9PT0gZmFsc2UgKSB7XG5cdFx0XHRmbiA9IHJldHVybkZhbHNlO1xuXHRcdH0gZWxzZSBpZiAoICFmbiApIHtcblx0XHRcdHJldHVybiB0aGlzO1xuXHRcdH1cblxuXHRcdGlmICggb25lID09PSAxICkge1xuXHRcdFx0b3JpZ0ZuID0gZm47XG5cdFx0XHRmbiA9IGZ1bmN0aW9uKCBldmVudCApIHtcblx0XHRcdFx0alF1ZXJ5LmV2ZW50LnJlbW92ZSggZXZlbnQuZGVsZWdhdGVUYXJnZXQgfHwgdGhpcywgZXZlbnQgKTtcblx0XHRcdFx0cmV0dXJuIG9yaWdGbi5hcHBseSggdGhpcywgYXJndW1lbnRzICk7XG5cdFx0XHR9O1xuXHRcdFx0Ly8gVXNlIHNhbWUgZ3VpZCBzbyBjYWxsZXIgY2FuIHJlbW92ZSB1c2luZyBvcmlnRm5cblx0XHRcdGZuLmd1aWQgPSBvcmlnRm4uZ3VpZCB8fCAoIG9yaWdGbi5ndWlkID0galF1ZXJ5Lmd1aWQrKyApO1xuXHRcdH1cblx0XHRyZXR1cm4gdGhpcy5lYWNoKCBmdW5jdGlvbigpIHtcblx0XHRcdGpRdWVyeS5ldmVudC5hZGQoIHRoaXMsIHR5cGVzLCBmbiwgZGF0YSwgc2VsZWN0b3IgKTtcblx0XHR9KTtcblx0fSxcblx0b25lOiBmdW5jdGlvbiggdHlwZXMsIHNlbGVjdG9yLCBkYXRhLCBmbiApIHtcblx0XHRyZXR1cm4gdGhpcy5vbi5jYWxsKCB0aGlzLCB0eXBlcywgc2VsZWN0b3IsIGRhdGEsIGZuLCAxICk7XG5cdH0sXG5cdG9mZjogZnVuY3Rpb24oIHR5cGVzLCBzZWxlY3RvciwgZm4gKSB7XG5cdFx0aWYgKCB0eXBlcyAmJiB0eXBlcy5wcmV2ZW50RGVmYXVsdCApIHtcblx0XHRcdC8vICggZXZlbnQgKSAgbmF0aXZlIG9yIGpRdWVyeS5FdmVudFxuXHRcdFx0cmV0dXJuIHRoaXMub2ZmKCB0eXBlcy50eXBlLCB0eXBlcy5oYW5kbGVyLCB0eXBlcy5zZWxlY3RvciApO1xuXHRcdH1cblx0XHRpZiAoIHR5cGVvZiB0eXBlcyA9PT0gXCJvYmplY3RcIiApIHtcblx0XHRcdC8vICggdHlwZXMtb2JqZWN0IFssIHNlbGVjdG9yXSApXG5cdFx0XHRmb3IgKCB2YXIgdHlwZSBpbiB0eXBlcyApIHtcblx0XHRcdFx0dGhpcy5vZmYoIHR5cGUsIHNlbGVjdG9yLCB0eXBlc1sgdHlwZSBdICk7XG5cdFx0XHR9XG5cdFx0XHRyZXR1cm4gdGhpcztcblx0XHR9XG5cdFx0aWYgKCBzZWxlY3RvciA9PT0gZmFsc2UgfHwgdHlwZW9mIHNlbGVjdG9yID09PSBcImZ1bmN0aW9uXCIgKSB7XG5cdFx0XHQvLyAoIHR5cGVzIFssIGZuXSApXG5cdFx0XHRmbiA9IHNlbGVjdG9yO1xuXHRcdFx0c2VsZWN0b3IgPSB1bmRlZmluZWQ7XG5cdFx0fVxuXHRcdGlmICggZm4gPT09IGZhbHNlICkge1xuXHRcdFx0Zm4gPSByZXR1cm5GYWxzZTtcblx0XHR9XG5cdFx0cmV0dXJuIHRoaXMuZWFjaChmdW5jdGlvbigpIHtcblx0XHRcdGpRdWVyeS5ldmVudC5yZW1vdmUoIHRoaXMsIHR5cGVzLCBmbiwgc2VsZWN0b3IgKTtcblx0XHR9KTtcblx0fSxcblxuXHRiaW5kOiBmdW5jdGlvbiggdHlwZXMsIGRhdGEsIGZuICkge1xuXHRcdHJldHVybiB0aGlzLm9uKCB0eXBlcywgbnVsbCwgZGF0YSwgZm4gKTtcblx0fSxcblx0dW5iaW5kOiBmdW5jdGlvbiggdHlwZXMsIGZuICkge1xuXHRcdHJldHVybiB0aGlzLm9mZiggdHlwZXMsIG51bGwsIGZuICk7XG5cdH0sXG5cblx0bGl2ZTogZnVuY3Rpb24oIHR5cGVzLCBkYXRhLCBmbiApIHtcblx0XHRqUXVlcnkoIHRoaXMuY29udGV4dCApLm9uKCB0eXBlcywgdGhpcy5zZWxlY3RvciwgZGF0YSwgZm4gKTtcblx0XHRyZXR1cm4gdGhpcztcblx0fSxcblx0ZGllOiBmdW5jdGlvbiggdHlwZXMsIGZuICkge1xuXHRcdGpRdWVyeSggdGhpcy5jb250ZXh0ICkub2ZmKCB0eXBlcywgdGhpcy5zZWxlY3RvciB8fCBcIioqXCIsIGZuICk7XG5cdFx0cmV0dXJuIHRoaXM7XG5cdH0sXG5cblx0ZGVsZWdhdGU6IGZ1bmN0aW9uKCBzZWxlY3RvciwgdHlwZXMsIGRhdGEsIGZuICkge1xuXHRcdHJldHVybiB0aGlzLm9uKCB0eXBlcywgc2VsZWN0b3IsIGRhdGEsIGZuICk7XG5cdH0sXG5cdHVuZGVsZWdhdGU6IGZ1bmN0aW9uKCBzZWxlY3RvciwgdHlwZXMsIGZuICkge1xuXHRcdC8vICggbmFtZXNwYWNlICkgb3IgKCBzZWxlY3RvciwgdHlwZXMgWywgZm5dIClcblx0XHRyZXR1cm4gYXJndW1lbnRzLmxlbmd0aCA9PSAxPyB0aGlzLm9mZiggc2VsZWN0b3IsIFwiKipcIiApIDogdGhpcy5vZmYoIHR5cGVzLCBzZWxlY3RvciwgZm4gKTtcblx0fSxcblxuXHR0cmlnZ2VyOiBmdW5jdGlvbiggdHlwZSwgZGF0YSApIHtcblx0XHRyZXR1cm4gdGhpcy5lYWNoKGZ1bmN0aW9uKCkge1xuXHRcdFx0alF1ZXJ5LmV2ZW50LnRyaWdnZXIoIHR5cGUsIGRhdGEsIHRoaXMgKTtcblx0XHR9KTtcblx0fSxcblx0dHJpZ2dlckhhbmRsZXI6IGZ1bmN0aW9uKCB0eXBlLCBkYXRhICkge1xuXHRcdGlmICggdGhpc1swXSApIHtcblx0XHRcdHJldHVybiBqUXVlcnkuZXZlbnQudHJpZ2dlciggdHlwZSwgZGF0YSwgdGhpc1swXSwgdHJ1ZSApO1xuXHRcdH1cblx0fSxcblxuXHR0b2dnbGU6IGZ1bmN0aW9uKCBmbiApIHtcblx0XHQvLyBTYXZlIHJlZmVyZW5jZSB0byBhcmd1bWVudHMgZm9yIGFjY2VzcyBpbiBjbG9zdXJlXG5cdFx0dmFyIGFyZ3MgPSBhcmd1bWVudHMsXG5cdFx0XHRndWlkID0gZm4uZ3VpZCB8fCBqUXVlcnkuZ3VpZCsrLFxuXHRcdFx0aSA9IDAsXG5cdFx0XHR0b2dnbGVyID0gZnVuY3Rpb24oIGV2ZW50ICkge1xuXHRcdFx0XHQvLyBGaWd1cmUgb3V0IHdoaWNoIGZ1bmN0aW9uIHRvIGV4ZWN1dGVcblx0XHRcdFx0dmFyIGxhc3RUb2dnbGUgPSAoIGpRdWVyeS5fZGF0YSggdGhpcywgXCJsYXN0VG9nZ2xlXCIgKyBmbi5ndWlkICkgfHwgMCApICUgaTtcblx0XHRcdFx0alF1ZXJ5Ll9kYXRhKCB0aGlzLCBcImxhc3RUb2dnbGVcIiArIGZuLmd1aWQsIGxhc3RUb2dnbGUgKyAxICk7XG5cblx0XHRcdFx0Ly8gTWFrZSBzdXJlIHRoYXQgY2xpY2tzIHN0b3Bcblx0XHRcdFx0ZXZlbnQucHJldmVudERlZmF1bHQoKTtcblxuXHRcdFx0XHQvLyBhbmQgZXhlY3V0ZSB0aGUgZnVuY3Rpb25cblx0XHRcdFx0cmV0dXJuIGFyZ3NbIGxhc3RUb2dnbGUgXS5hcHBseSggdGhpcywgYXJndW1lbnRzICkgfHwgZmFsc2U7XG5cdFx0XHR9O1xuXG5cdFx0Ly8gbGluayBhbGwgdGhlIGZ1bmN0aW9ucywgc28gYW55IG9mIHRoZW0gY2FuIHVuYmluZCB0aGlzIGNsaWNrIGhhbmRsZXJcblx0XHR0b2dnbGVyLmd1aWQgPSBndWlkO1xuXHRcdHdoaWxlICggaSA8IGFyZ3MubGVuZ3RoICkge1xuXHRcdFx0YXJnc1sgaSsrIF0uZ3VpZCA9IGd1aWQ7XG5cdFx0fVxuXG5cdFx0cmV0dXJuIHRoaXMuY2xpY2soIHRvZ2dsZXIgKTtcblx0fSxcblxuXHRob3ZlcjogZnVuY3Rpb24oIGZuT3ZlciwgZm5PdXQgKSB7XG5cdFx0cmV0dXJuIHRoaXMubW91c2VlbnRlciggZm5PdmVyICkubW91c2VsZWF2ZSggZm5PdXQgfHwgZm5PdmVyICk7XG5cdH1cbn0pO1xuXG5qUXVlcnkuZWFjaCggKFwiYmx1ciBmb2N1cyBmb2N1c2luIGZvY3Vzb3V0IGxvYWQgcmVzaXplIHNjcm9sbCB1bmxvYWQgY2xpY2sgZGJsY2xpY2sgXCIgK1xuXHRcIm1vdXNlZG93biBtb3VzZXVwIG1vdXNlbW92ZSBtb3VzZW92ZXIgbW91c2VvdXQgbW91c2VlbnRlciBtb3VzZWxlYXZlIFwiICtcblx0XCJjaGFuZ2Ugc2VsZWN0IHN1Ym1pdCBrZXlkb3duIGtleXByZXNzIGtleXVwIGVycm9yIGNvbnRleHRtZW51XCIpLnNwbGl0KFwiIFwiKSwgZnVuY3Rpb24oIGksIG5hbWUgKSB7XG5cblx0Ly8gSGFuZGxlIGV2ZW50IGJpbmRpbmdcblx0alF1ZXJ5LmZuWyBuYW1lIF0gPSBmdW5jdGlvbiggZGF0YSwgZm4gKSB7XG5cdFx0aWYgKCBmbiA9PSBudWxsICkge1xuXHRcdFx0Zm4gPSBkYXRhO1xuXHRcdFx0ZGF0YSA9IG51bGw7XG5cdFx0fVxuXG5cdFx0cmV0dXJuIGFyZ3VtZW50cy5sZW5ndGggPiAwID9cblx0XHRcdHRoaXMuYmluZCggbmFtZSwgZGF0YSwgZm4gKSA6XG5cdFx0XHR0aGlzLnRyaWdnZXIoIG5hbWUgKTtcblx0fTtcblxuXHRpZiAoIGpRdWVyeS5hdHRyRm4gKSB7XG5cdFx0alF1ZXJ5LmF0dHJGblsgbmFtZSBdID0gdHJ1ZTtcblx0fVxuXG5cdGlmICggcmtleUV2ZW50LnRlc3QoIG5hbWUgKSApIHtcblx0XHRqUXVlcnkuZXZlbnQuZml4SG9va3NbIG5hbWUgXSA9IGpRdWVyeS5ldmVudC5rZXlIb29rcztcblx0fVxuXG5cdGlmICggcm1vdXNlRXZlbnQudGVzdCggbmFtZSApICkge1xuXHRcdGpRdWVyeS5ldmVudC5maXhIb29rc1sgbmFtZSBdID0galF1ZXJ5LmV2ZW50Lm1vdXNlSG9va3M7XG5cdH1cbn0pO1xuXG5cblxuLyohXG4gKiBTaXp6bGUgQ1NTIFNlbGVjdG9yIEVuZ2luZVxuICogIENvcHlyaWdodCAyMDExLCBUaGUgRG9qbyBGb3VuZGF0aW9uXG4gKiAgUmVsZWFzZWQgdW5kZXIgdGhlIE1JVCwgQlNELCBhbmQgR1BMIExpY2Vuc2VzLlxuICogIE1vcmUgaW5mb3JtYXRpb246IGh0dHA6Ly9zaXp6bGVqcy5jb20vXG4gKi9cbihmdW5jdGlvbigpe1xuXG52YXIgY2h1bmtlciA9IC8oKD86XFwoKD86XFwoW14oKV0rXFwpfFteKCldKykrXFwpfFxcWyg/OlxcW1teXFxbXFxdXSpcXF18WydcIl1bXidcIl0qWydcIl18W15cXFtcXF0nXCJdKykrXFxdfFxcXFwufFteID4rfiwoXFxbXFxcXF0rKSt8Wz4rfl0pKFxccyosXFxzKik/KCg/Oi58XFxyfFxcbikqKS9nLFxuXHRleHBhbmRvID0gXCJzaXpjYWNoZVwiICsgKE1hdGgucmFuZG9tKCkgKyAnJykucmVwbGFjZSgnLicsICcnKSxcblx0ZG9uZSA9IDAsXG5cdHRvU3RyaW5nID0gT2JqZWN0LnByb3RvdHlwZS50b1N0cmluZyxcblx0aGFzRHVwbGljYXRlID0gZmFsc2UsXG5cdGJhc2VIYXNEdXBsaWNhdGUgPSB0cnVlLFxuXHRyQmFja3NsYXNoID0gL1xcXFwvZyxcblx0clJldHVybiA9IC9cXHJcXG4vZyxcblx0ck5vbldvcmQgPSAvXFxXLztcblxuLy8gSGVyZSB3ZSBjaGVjayBpZiB0aGUgSmF2YVNjcmlwdCBlbmdpbmUgaXMgdXNpbmcgc29tZSBzb3J0IG9mXG4vLyBvcHRpbWl6YXRpb24gd2hlcmUgaXQgZG9lcyBub3QgYWx3YXlzIGNhbGwgb3VyIGNvbXBhcmlzaW9uXG4vLyBmdW5jdGlvbi4gSWYgdGhhdCBpcyB0aGUgY2FzZSwgZGlzY2FyZCB0aGUgaGFzRHVwbGljYXRlIHZhbHVlLlxuLy8gICBUaHVzIGZhciB0aGF0IGluY2x1ZGVzIEdvb2dsZSBDaHJvbWUuXG5bMCwgMF0uc29ydChmdW5jdGlvbigpIHtcblx0YmFzZUhhc0R1cGxpY2F0ZSA9IGZhbHNlO1xuXHRyZXR1cm4gMDtcbn0pO1xuXG52YXIgU2l6emxlID0gZnVuY3Rpb24oIHNlbGVjdG9yLCBjb250ZXh0LCByZXN1bHRzLCBzZWVkICkge1xuXHRyZXN1bHRzID0gcmVzdWx0cyB8fCBbXTtcblx0Y29udGV4dCA9IGNvbnRleHQgfHwgZG9jdW1lbnQ7XG5cblx0dmFyIG9yaWdDb250ZXh0ID0gY29udGV4dDtcblxuXHRpZiAoIGNvbnRleHQubm9kZVR5cGUgIT09IDEgJiYgY29udGV4dC5ub2RlVHlwZSAhPT0gOSApIHtcblx0XHRyZXR1cm4gW107XG5cdH1cblx0XG5cdGlmICggIXNlbGVjdG9yIHx8IHR5cGVvZiBzZWxlY3RvciAhPT0gXCJzdHJpbmdcIiApIHtcblx0XHRyZXR1cm4gcmVzdWx0cztcblx0fVxuXG5cdHZhciBtLCBzZXQsIGNoZWNrU2V0LCBleHRyYSwgcmV0LCBjdXIsIHBvcCwgaSxcblx0XHRwcnVuZSA9IHRydWUsXG5cdFx0Y29udGV4dFhNTCA9IFNpenpsZS5pc1hNTCggY29udGV4dCApLFxuXHRcdHBhcnRzID0gW10sXG5cdFx0c29GYXIgPSBzZWxlY3Rvcjtcblx0XG5cdC8vIFJlc2V0IHRoZSBwb3NpdGlvbiBvZiB0aGUgY2h1bmtlciByZWdleHAgKHN0YXJ0IGZyb20gaGVhZClcblx0ZG8ge1xuXHRcdGNodW5rZXIuZXhlYyggXCJcIiApO1xuXHRcdG0gPSBjaHVua2VyLmV4ZWMoIHNvRmFyICk7XG5cblx0XHRpZiAoIG0gKSB7XG5cdFx0XHRzb0ZhciA9IG1bM107XG5cdFx0XG5cdFx0XHRwYXJ0cy5wdXNoKCBtWzFdICk7XG5cdFx0XG5cdFx0XHRpZiAoIG1bMl0gKSB7XG5cdFx0XHRcdGV4dHJhID0gbVszXTtcblx0XHRcdFx0YnJlYWs7XG5cdFx0XHR9XG5cdFx0fVxuXHR9IHdoaWxlICggbSApO1xuXG5cdGlmICggcGFydHMubGVuZ3RoID4gMSAmJiBvcmlnUE9TLmV4ZWMoIHNlbGVjdG9yICkgKSB7XG5cblx0XHRpZiAoIHBhcnRzLmxlbmd0aCA9PT0gMiAmJiBFeHByLnJlbGF0aXZlWyBwYXJ0c1swXSBdICkge1xuXHRcdFx0c2V0ID0gcG9zUHJvY2VzcyggcGFydHNbMF0gKyBwYXJ0c1sxXSwgY29udGV4dCwgc2VlZCApO1xuXG5cdFx0fSBlbHNlIHtcblx0XHRcdHNldCA9IEV4cHIucmVsYXRpdmVbIHBhcnRzWzBdIF0gP1xuXHRcdFx0XHRbIGNvbnRleHQgXSA6XG5cdFx0XHRcdFNpenpsZSggcGFydHMuc2hpZnQoKSwgY29udGV4dCApO1xuXG5cdFx0XHR3aGlsZSAoIHBhcnRzLmxlbmd0aCApIHtcblx0XHRcdFx0c2VsZWN0b3IgPSBwYXJ0cy5zaGlmdCgpO1xuXG5cdFx0XHRcdGlmICggRXhwci5yZWxhdGl2ZVsgc2VsZWN0b3IgXSApIHtcblx0XHRcdFx0XHRzZWxlY3RvciArPSBwYXJ0cy5zaGlmdCgpO1xuXHRcdFx0XHR9XG5cdFx0XHRcdFxuXHRcdFx0XHRzZXQgPSBwb3NQcm9jZXNzKCBzZWxlY3Rvciwgc2V0LCBzZWVkICk7XG5cdFx0XHR9XG5cdFx0fVxuXG5cdH0gZWxzZSB7XG5cdFx0Ly8gVGFrZSBhIHNob3J0Y3V0IGFuZCBzZXQgdGhlIGNvbnRleHQgaWYgdGhlIHJvb3Qgc2VsZWN0b3IgaXMgYW4gSURcblx0XHQvLyAoYnV0IG5vdCBpZiBpdCdsbCBiZSBmYXN0ZXIgaWYgdGhlIGlubmVyIHNlbGVjdG9yIGlzIGFuIElEKVxuXHRcdGlmICggIXNlZWQgJiYgcGFydHMubGVuZ3RoID4gMSAmJiBjb250ZXh0Lm5vZGVUeXBlID09PSA5ICYmICFjb250ZXh0WE1MICYmXG5cdFx0XHRcdEV4cHIubWF0Y2guSUQudGVzdChwYXJ0c1swXSkgJiYgIUV4cHIubWF0Y2guSUQudGVzdChwYXJ0c1twYXJ0cy5sZW5ndGggLSAxXSkgKSB7XG5cblx0XHRcdHJldCA9IFNpenpsZS5maW5kKCBwYXJ0cy5zaGlmdCgpLCBjb250ZXh0LCBjb250ZXh0WE1MICk7XG5cdFx0XHRjb250ZXh0ID0gcmV0LmV4cHIgP1xuXHRcdFx0XHRTaXp6bGUuZmlsdGVyKCByZXQuZXhwciwgcmV0LnNldCApWzBdIDpcblx0XHRcdFx0cmV0LnNldFswXTtcblx0XHR9XG5cblx0XHRpZiAoIGNvbnRleHQgKSB7XG5cdFx0XHRyZXQgPSBzZWVkID9cblx0XHRcdFx0eyBleHByOiBwYXJ0cy5wb3AoKSwgc2V0OiBtYWtlQXJyYXkoc2VlZCkgfSA6XG5cdFx0XHRcdFNpenpsZS5maW5kKCBwYXJ0cy5wb3AoKSwgcGFydHMubGVuZ3RoID09PSAxICYmIChwYXJ0c1swXSA9PT0gXCJ+XCIgfHwgcGFydHNbMF0gPT09IFwiK1wiKSAmJiBjb250ZXh0LnBhcmVudE5vZGUgPyBjb250ZXh0LnBhcmVudE5vZGUgOiBjb250ZXh0LCBjb250ZXh0WE1MICk7XG5cblx0XHRcdHNldCA9IHJldC5leHByID9cblx0XHRcdFx0U2l6emxlLmZpbHRlciggcmV0LmV4cHIsIHJldC5zZXQgKSA6XG5cdFx0XHRcdHJldC5zZXQ7XG5cblx0XHRcdGlmICggcGFydHMubGVuZ3RoID4gMCApIHtcblx0XHRcdFx0Y2hlY2tTZXQgPSBtYWtlQXJyYXkoIHNldCApO1xuXG5cdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRwcnVuZSA9IGZhbHNlO1xuXHRcdFx0fVxuXG5cdFx0XHR3aGlsZSAoIHBhcnRzLmxlbmd0aCApIHtcblx0XHRcdFx0Y3VyID0gcGFydHMucG9wKCk7XG5cdFx0XHRcdHBvcCA9IGN1cjtcblxuXHRcdFx0XHRpZiAoICFFeHByLnJlbGF0aXZlWyBjdXIgXSApIHtcblx0XHRcdFx0XHRjdXIgPSBcIlwiO1xuXHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdHBvcCA9IHBhcnRzLnBvcCgpO1xuXHRcdFx0XHR9XG5cblx0XHRcdFx0aWYgKCBwb3AgPT0gbnVsbCApIHtcblx0XHRcdFx0XHRwb3AgPSBjb250ZXh0O1xuXHRcdFx0XHR9XG5cblx0XHRcdFx0RXhwci5yZWxhdGl2ZVsgY3VyIF0oIGNoZWNrU2V0LCBwb3AsIGNvbnRleHRYTUwgKTtcblx0XHRcdH1cblxuXHRcdH0gZWxzZSB7XG5cdFx0XHRjaGVja1NldCA9IHBhcnRzID0gW107XG5cdFx0fVxuXHR9XG5cblx0aWYgKCAhY2hlY2tTZXQgKSB7XG5cdFx0Y2hlY2tTZXQgPSBzZXQ7XG5cdH1cblxuXHRpZiAoICFjaGVja1NldCApIHtcblx0XHRTaXp6bGUuZXJyb3IoIGN1ciB8fCBzZWxlY3RvciApO1xuXHR9XG5cblx0aWYgKCB0b1N0cmluZy5jYWxsKGNoZWNrU2V0KSA9PT0gXCJbb2JqZWN0IEFycmF5XVwiICkge1xuXHRcdGlmICggIXBydW5lICkge1xuXHRcdFx0cmVzdWx0cy5wdXNoLmFwcGx5KCByZXN1bHRzLCBjaGVja1NldCApO1xuXG5cdFx0fSBlbHNlIGlmICggY29udGV4dCAmJiBjb250ZXh0Lm5vZGVUeXBlID09PSAxICkge1xuXHRcdFx0Zm9yICggaSA9IDA7IGNoZWNrU2V0W2ldICE9IG51bGw7IGkrKyApIHtcblx0XHRcdFx0aWYgKCBjaGVja1NldFtpXSAmJiAoY2hlY2tTZXRbaV0gPT09IHRydWUgfHwgY2hlY2tTZXRbaV0ubm9kZVR5cGUgPT09IDEgJiYgU2l6emxlLmNvbnRhaW5zKGNvbnRleHQsIGNoZWNrU2V0W2ldKSkgKSB7XG5cdFx0XHRcdFx0cmVzdWx0cy5wdXNoKCBzZXRbaV0gKTtcblx0XHRcdFx0fVxuXHRcdFx0fVxuXG5cdFx0fSBlbHNlIHtcblx0XHRcdGZvciAoIGkgPSAwOyBjaGVja1NldFtpXSAhPSBudWxsOyBpKysgKSB7XG5cdFx0XHRcdGlmICggY2hlY2tTZXRbaV0gJiYgY2hlY2tTZXRbaV0ubm9kZVR5cGUgPT09IDEgKSB7XG5cdFx0XHRcdFx0cmVzdWx0cy5wdXNoKCBzZXRbaV0gKTtcblx0XHRcdFx0fVxuXHRcdFx0fVxuXHRcdH1cblxuXHR9IGVsc2Uge1xuXHRcdG1ha2VBcnJheSggY2hlY2tTZXQsIHJlc3VsdHMgKTtcblx0fVxuXG5cdGlmICggZXh0cmEgKSB7XG5cdFx0U2l6emxlKCBleHRyYSwgb3JpZ0NvbnRleHQsIHJlc3VsdHMsIHNlZWQgKTtcblx0XHRTaXp6bGUudW5pcXVlU29ydCggcmVzdWx0cyApO1xuXHR9XG5cblx0cmV0dXJuIHJlc3VsdHM7XG59O1xuXG5TaXp6bGUudW5pcXVlU29ydCA9IGZ1bmN0aW9uKCByZXN1bHRzICkge1xuXHRpZiAoIHNvcnRPcmRlciApIHtcblx0XHRoYXNEdXBsaWNhdGUgPSBiYXNlSGFzRHVwbGljYXRlO1xuXHRcdHJlc3VsdHMuc29ydCggc29ydE9yZGVyICk7XG5cblx0XHRpZiAoIGhhc0R1cGxpY2F0ZSApIHtcblx0XHRcdGZvciAoIHZhciBpID0gMTsgaSA8IHJlc3VsdHMubGVuZ3RoOyBpKysgKSB7XG5cdFx0XHRcdGlmICggcmVzdWx0c1tpXSA9PT0gcmVzdWx0c1sgaSAtIDEgXSApIHtcblx0XHRcdFx0XHRyZXN1bHRzLnNwbGljZSggaS0tLCAxICk7XG5cdFx0XHRcdH1cblx0XHRcdH1cblx0XHR9XG5cdH1cblxuXHRyZXR1cm4gcmVzdWx0cztcbn07XG5cblNpenpsZS5tYXRjaGVzID0gZnVuY3Rpb24oIGV4cHIsIHNldCApIHtcblx0cmV0dXJuIFNpenpsZSggZXhwciwgbnVsbCwgbnVsbCwgc2V0ICk7XG59O1xuXG5TaXp6bGUubWF0Y2hlc1NlbGVjdG9yID0gZnVuY3Rpb24oIG5vZGUsIGV4cHIgKSB7XG5cdHJldHVybiBTaXp6bGUoIGV4cHIsIG51bGwsIG51bGwsIFtub2RlXSApLmxlbmd0aCA+IDA7XG59O1xuXG5TaXp6bGUuZmluZCA9IGZ1bmN0aW9uKCBleHByLCBjb250ZXh0LCBpc1hNTCApIHtcblx0dmFyIHNldCwgaSwgbGVuLCBtYXRjaCwgdHlwZSwgbGVmdDtcblxuXHRpZiAoICFleHByICkge1xuXHRcdHJldHVybiBbXTtcblx0fVxuXG5cdGZvciAoIGkgPSAwLCBsZW4gPSBFeHByLm9yZGVyLmxlbmd0aDsgaSA8IGxlbjsgaSsrICkge1xuXHRcdHR5cGUgPSBFeHByLm9yZGVyW2ldO1xuXHRcdFxuXHRcdGlmICggKG1hdGNoID0gRXhwci5sZWZ0TWF0Y2hbIHR5cGUgXS5leGVjKCBleHByICkpICkge1xuXHRcdFx0bGVmdCA9IG1hdGNoWzFdO1xuXHRcdFx0bWF0Y2guc3BsaWNlKCAxLCAxICk7XG5cblx0XHRcdGlmICggbGVmdC5zdWJzdHIoIGxlZnQubGVuZ3RoIC0gMSApICE9PSBcIlxcXFxcIiApIHtcblx0XHRcdFx0bWF0Y2hbMV0gPSAobWF0Y2hbMV0gfHwgXCJcIikucmVwbGFjZSggckJhY2tzbGFzaCwgXCJcIiApO1xuXHRcdFx0XHRzZXQgPSBFeHByLmZpbmRbIHR5cGUgXSggbWF0Y2gsIGNvbnRleHQsIGlzWE1MICk7XG5cblx0XHRcdFx0aWYgKCBzZXQgIT0gbnVsbCApIHtcblx0XHRcdFx0XHRleHByID0gZXhwci5yZXBsYWNlKCBFeHByLm1hdGNoWyB0eXBlIF0sIFwiXCIgKTtcblx0XHRcdFx0XHRicmVhaztcblx0XHRcdFx0fVxuXHRcdFx0fVxuXHRcdH1cblx0fVxuXG5cdGlmICggIXNldCApIHtcblx0XHRzZXQgPSB0eXBlb2YgY29udGV4dC5nZXRFbGVtZW50c0J5VGFnTmFtZSAhPT0gXCJ1bmRlZmluZWRcIiA/XG5cdFx0XHRjb250ZXh0LmdldEVsZW1lbnRzQnlUYWdOYW1lKCBcIipcIiApIDpcblx0XHRcdFtdO1xuXHR9XG5cblx0cmV0dXJuIHsgc2V0OiBzZXQsIGV4cHI6IGV4cHIgfTtcbn07XG5cblNpenpsZS5maWx0ZXIgPSBmdW5jdGlvbiggZXhwciwgc2V0LCBpbnBsYWNlLCBub3QgKSB7XG5cdHZhciBtYXRjaCwgYW55Rm91bmQsXG5cdFx0dHlwZSwgZm91bmQsIGl0ZW0sIGZpbHRlciwgbGVmdCxcblx0XHRpLCBwYXNzLFxuXHRcdG9sZCA9IGV4cHIsXG5cdFx0cmVzdWx0ID0gW10sXG5cdFx0Y3VyTG9vcCA9IHNldCxcblx0XHRpc1hNTEZpbHRlciA9IHNldCAmJiBzZXRbMF0gJiYgU2l6emxlLmlzWE1MKCBzZXRbMF0gKTtcblxuXHR3aGlsZSAoIGV4cHIgJiYgc2V0Lmxlbmd0aCApIHtcblx0XHRmb3IgKCB0eXBlIGluIEV4cHIuZmlsdGVyICkge1xuXHRcdFx0aWYgKCAobWF0Y2ggPSBFeHByLmxlZnRNYXRjaFsgdHlwZSBdLmV4ZWMoIGV4cHIgKSkgIT0gbnVsbCAmJiBtYXRjaFsyXSApIHtcblx0XHRcdFx0ZmlsdGVyID0gRXhwci5maWx0ZXJbIHR5cGUgXTtcblx0XHRcdFx0bGVmdCA9IG1hdGNoWzFdO1xuXG5cdFx0XHRcdGFueUZvdW5kID0gZmFsc2U7XG5cblx0XHRcdFx0bWF0Y2guc3BsaWNlKDEsMSk7XG5cblx0XHRcdFx0aWYgKCBsZWZ0LnN1YnN0ciggbGVmdC5sZW5ndGggLSAxICkgPT09IFwiXFxcXFwiICkge1xuXHRcdFx0XHRcdGNvbnRpbnVlO1xuXHRcdFx0XHR9XG5cblx0XHRcdFx0aWYgKCBjdXJMb29wID09PSByZXN1bHQgKSB7XG5cdFx0XHRcdFx0cmVzdWx0ID0gW107XG5cdFx0XHRcdH1cblxuXHRcdFx0XHRpZiAoIEV4cHIucHJlRmlsdGVyWyB0eXBlIF0gKSB7XG5cdFx0XHRcdFx0bWF0Y2ggPSBFeHByLnByZUZpbHRlclsgdHlwZSBdKCBtYXRjaCwgY3VyTG9vcCwgaW5wbGFjZSwgcmVzdWx0LCBub3QsIGlzWE1MRmlsdGVyICk7XG5cblx0XHRcdFx0XHRpZiAoICFtYXRjaCApIHtcblx0XHRcdFx0XHRcdGFueUZvdW5kID0gZm91bmQgPSB0cnVlO1xuXG5cdFx0XHRcdFx0fSBlbHNlIGlmICggbWF0Y2ggPT09IHRydWUgKSB7XG5cdFx0XHRcdFx0XHRjb250aW51ZTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH1cblxuXHRcdFx0XHRpZiAoIG1hdGNoICkge1xuXHRcdFx0XHRcdGZvciAoIGkgPSAwOyAoaXRlbSA9IGN1ckxvb3BbaV0pICE9IG51bGw7IGkrKyApIHtcblx0XHRcdFx0XHRcdGlmICggaXRlbSApIHtcblx0XHRcdFx0XHRcdFx0Zm91bmQgPSBmaWx0ZXIoIGl0ZW0sIG1hdGNoLCBpLCBjdXJMb29wICk7XG5cdFx0XHRcdFx0XHRcdHBhc3MgPSBub3QgXiBmb3VuZDtcblxuXHRcdFx0XHRcdFx0XHRpZiAoIGlucGxhY2UgJiYgZm91bmQgIT0gbnVsbCApIHtcblx0XHRcdFx0XHRcdFx0XHRpZiAoIHBhc3MgKSB7XG5cdFx0XHRcdFx0XHRcdFx0XHRhbnlGb3VuZCA9IHRydWU7XG5cblx0XHRcdFx0XHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdFx0XHRcdFx0Y3VyTG9vcFtpXSA9IGZhbHNlO1xuXHRcdFx0XHRcdFx0XHRcdH1cblxuXHRcdFx0XHRcdFx0XHR9IGVsc2UgaWYgKCBwYXNzICkge1xuXHRcdFx0XHRcdFx0XHRcdHJlc3VsdC5wdXNoKCBpdGVtICk7XG5cdFx0XHRcdFx0XHRcdFx0YW55Rm91bmQgPSB0cnVlO1xuXHRcdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9XG5cblx0XHRcdFx0aWYgKCBmb3VuZCAhPT0gdW5kZWZpbmVkICkge1xuXHRcdFx0XHRcdGlmICggIWlucGxhY2UgKSB7XG5cdFx0XHRcdFx0XHRjdXJMb29wID0gcmVzdWx0O1xuXHRcdFx0XHRcdH1cblxuXHRcdFx0XHRcdGV4cHIgPSBleHByLnJlcGxhY2UoIEV4cHIubWF0Y2hbIHR5cGUgXSwgXCJcIiApO1xuXG5cdFx0XHRcdFx0aWYgKCAhYW55Rm91bmQgKSB7XG5cdFx0XHRcdFx0XHRyZXR1cm4gW107XG5cdFx0XHRcdFx0fVxuXG5cdFx0XHRcdFx0YnJlYWs7XG5cdFx0XHRcdH1cblx0XHRcdH1cblx0XHR9XG5cblx0XHQvLyBJbXByb3BlciBleHByZXNzaW9uXG5cdFx0aWYgKCBleHByID09PSBvbGQgKSB7XG5cdFx0XHRpZiAoIGFueUZvdW5kID09IG51bGwgKSB7XG5cdFx0XHRcdFNpenpsZS5lcnJvciggZXhwciApO1xuXG5cdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRicmVhaztcblx0XHRcdH1cblx0XHR9XG5cblx0XHRvbGQgPSBleHByO1xuXHR9XG5cblx0cmV0dXJuIGN1ckxvb3A7XG59O1xuXG5TaXp6bGUuZXJyb3IgPSBmdW5jdGlvbiggbXNnICkge1xuXHR0aHJvdyBcIlN5bnRheCBlcnJvciwgdW5yZWNvZ25pemVkIGV4cHJlc3Npb246IFwiICsgbXNnO1xufTtcblxuLyoqXG4gKiBVdGlsaXR5IGZ1bmN0aW9uIGZvciByZXRyZWl2aW5nIHRoZSB0ZXh0IHZhbHVlIG9mIGFuIGFycmF5IG9mIERPTSBub2Rlc1xuICogQHBhcmFtIHtBcnJheXxFbGVtZW50fSBlbGVtXG4gKi9cbnZhciBnZXRUZXh0ID0gU2l6emxlLmdldFRleHQgPSBmdW5jdGlvbiggZWxlbSApIHtcbiAgICB2YXIgaSwgbm9kZSxcblx0XHRub2RlVHlwZSA9IGVsZW0ubm9kZVR5cGUsXG5cdFx0cmV0ID0gXCJcIjtcblxuXHRpZiAoIG5vZGVUeXBlICkge1xuXHRcdGlmICggbm9kZVR5cGUgPT09IDEgKSB7XG5cdFx0XHQvLyBVc2UgdGV4dENvbnRlbnQgfHwgaW5uZXJUZXh0IGZvciBlbGVtZW50c1xuXHRcdFx0aWYgKCB0eXBlb2YgZWxlbS50ZXh0Q29udGVudCA9PT0gJ3N0cmluZycgKSB7XG5cdFx0XHRcdHJldHVybiBlbGVtLnRleHRDb250ZW50O1xuXHRcdFx0fSBlbHNlIGlmICggdHlwZW9mIGVsZW0uaW5uZXJUZXh0ID09PSAnc3RyaW5nJyApIHtcblx0XHRcdFx0Ly8gUmVwbGFjZSBJRSdzIGNhcnJpYWdlIHJldHVybnNcblx0XHRcdFx0cmV0dXJuIGVsZW0uaW5uZXJUZXh0LnJlcGxhY2UoIHJSZXR1cm4sICcnICk7XG5cdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHQvLyBUcmF2ZXJzZSBpdCdzIGNoaWxkcmVuXG5cdFx0XHRcdGZvciAoIGVsZW0gPSBlbGVtLmZpcnN0Q2hpbGQ7IGVsZW07IGVsZW0gPSBlbGVtLm5leHRTaWJsaW5nKSB7XG5cdFx0XHRcdFx0cmV0ICs9IGdldFRleHQoIGVsZW0gKTtcblx0XHRcdFx0fVxuXHRcdFx0fVxuXHRcdH0gZWxzZSBpZiAoIG5vZGVUeXBlID09PSAzIHx8IG5vZGVUeXBlID09PSA0ICkge1xuXHRcdFx0cmV0dXJuIGVsZW0ubm9kZVZhbHVlO1xuXHRcdH1cblx0fSBlbHNlIHtcblxuXHRcdC8vIElmIG5vIG5vZGVUeXBlLCB0aGlzIGlzIGV4cGVjdGVkIHRvIGJlIGFuIGFycmF5XG5cdFx0Zm9yICggaSA9IDA7IChub2RlID0gZWxlbVtpXSk7IGkrKyApIHtcblx0XHRcdC8vIERvIG5vdCB0cmF2ZXJzZSBjb21tZW50IG5vZGVzXG5cdFx0XHRpZiAoIG5vZGUubm9kZVR5cGUgIT09IDggKSB7XG5cdFx0XHRcdHJldCArPSBnZXRUZXh0KCBub2RlICk7XG5cdFx0XHR9XG5cdFx0fVxuXHR9XG5cdHJldHVybiByZXQ7XG59O1xuXG52YXIgRXhwciA9IFNpenpsZS5zZWxlY3RvcnMgPSB7XG5cdG9yZGVyOiBbIFwiSURcIiwgXCJOQU1FXCIsIFwiVEFHXCIgXSxcblxuXHRtYXRjaDoge1xuXHRcdElEOiAvIygoPzpbXFx3XFx1MDBjMC1cXHVGRkZGXFwtXXxcXFxcLikrKS8sXG5cdFx0Q0xBU1M6IC9cXC4oKD86W1xcd1xcdTAwYzAtXFx1RkZGRlxcLV18XFxcXC4pKykvLFxuXHRcdE5BTUU6IC9cXFtuYW1lPVsnXCJdKigoPzpbXFx3XFx1MDBjMC1cXHVGRkZGXFwtXXxcXFxcLikrKVsnXCJdKlxcXS8sXG5cdFx0QVRUUjogL1xcW1xccyooKD86W1xcd1xcdTAwYzAtXFx1RkZGRlxcLV18XFxcXC4pKylcXHMqKD86KFxcUz89KVxccyooPzooWydcIl0pKC4qPylcXDN8KCM/KD86W1xcd1xcdTAwYzAtXFx1RkZGRlxcLV18XFxcXC4pKil8KXwpXFxzKlxcXS8sXG5cdFx0VEFHOiAvXigoPzpbXFx3XFx1MDBjMC1cXHVGRkZGXFwqXFwtXXxcXFxcLikrKS8sXG5cdFx0Q0hJTEQ6IC86KG9ubHl8bnRofGxhc3R8Zmlyc3QpLWNoaWxkKD86XFwoXFxzKihldmVufG9kZHwoPzpbK1xcLV0/XFxkK3woPzpbK1xcLV0/XFxkKik/blxccyooPzpbK1xcLV1cXHMqXFxkKyk/KSlcXHMqXFwpKT8vLFxuXHRcdFBPUzogLzoobnRofGVxfGd0fGx0fGZpcnN0fGxhc3R8ZXZlbnxvZGQpKD86XFwoKFxcZCopXFwpKT8oPz1bXlxcLV18JCkvLFxuXHRcdFBTRVVETzogLzooKD86W1xcd1xcdTAwYzAtXFx1RkZGRlxcLV18XFxcXC4pKykoPzpcXCgoWydcIl0/KSgoPzpcXChbXlxcKV0rXFwpfFteXFwoXFwpXSopKylcXDJcXCkpPy9cblx0fSxcblxuXHRsZWZ0TWF0Y2g6IHt9LFxuXG5cdGF0dHJNYXA6IHtcblx0XHRcImNsYXNzXCI6IFwiY2xhc3NOYW1lXCIsXG5cdFx0XCJmb3JcIjogXCJodG1sRm9yXCJcblx0fSxcblxuXHRhdHRySGFuZGxlOiB7XG5cdFx0aHJlZjogZnVuY3Rpb24oIGVsZW0gKSB7XG5cdFx0XHRyZXR1cm4gZWxlbS5nZXRBdHRyaWJ1dGUoIFwiaHJlZlwiICk7XG5cdFx0fSxcblx0XHR0eXBlOiBmdW5jdGlvbiggZWxlbSApIHtcblx0XHRcdHJldHVybiBlbGVtLmdldEF0dHJpYnV0ZSggXCJ0eXBlXCIgKTtcblx0XHR9XG5cdH0sXG5cblx0cmVsYXRpdmU6IHtcblx0XHRcIitcIjogZnVuY3Rpb24oY2hlY2tTZXQsIHBhcnQpe1xuXHRcdFx0dmFyIGlzUGFydFN0ciA9IHR5cGVvZiBwYXJ0ID09PSBcInN0cmluZ1wiLFxuXHRcdFx0XHRpc1RhZyA9IGlzUGFydFN0ciAmJiAhck5vbldvcmQudGVzdCggcGFydCApLFxuXHRcdFx0XHRpc1BhcnRTdHJOb3RUYWcgPSBpc1BhcnRTdHIgJiYgIWlzVGFnO1xuXG5cdFx0XHRpZiAoIGlzVGFnICkge1xuXHRcdFx0XHRwYXJ0ID0gcGFydC50b0xvd2VyQ2FzZSgpO1xuXHRcdFx0fVxuXG5cdFx0XHRmb3IgKCB2YXIgaSA9IDAsIGwgPSBjaGVja1NldC5sZW5ndGgsIGVsZW07IGkgPCBsOyBpKysgKSB7XG5cdFx0XHRcdGlmICggKGVsZW0gPSBjaGVja1NldFtpXSkgKSB7XG5cdFx0XHRcdFx0d2hpbGUgKCAoZWxlbSA9IGVsZW0ucHJldmlvdXNTaWJsaW5nKSAmJiBlbGVtLm5vZGVUeXBlICE9PSAxICkge31cblxuXHRcdFx0XHRcdGNoZWNrU2V0W2ldID0gaXNQYXJ0U3RyTm90VGFnIHx8IGVsZW0gJiYgZWxlbS5ub2RlTmFtZS50b0xvd2VyQ2FzZSgpID09PSBwYXJ0ID9cblx0XHRcdFx0XHRcdGVsZW0gfHwgZmFsc2UgOlxuXHRcdFx0XHRcdFx0ZWxlbSA9PT0gcGFydDtcblx0XHRcdFx0fVxuXHRcdFx0fVxuXG5cdFx0XHRpZiAoIGlzUGFydFN0ck5vdFRhZyApIHtcblx0XHRcdFx0U2l6emxlLmZpbHRlciggcGFydCwgY2hlY2tTZXQsIHRydWUgKTtcblx0XHRcdH1cblx0XHR9LFxuXG5cdFx0XCI+XCI6IGZ1bmN0aW9uKCBjaGVja1NldCwgcGFydCApIHtcblx0XHRcdHZhciBlbGVtLFxuXHRcdFx0XHRpc1BhcnRTdHIgPSB0eXBlb2YgcGFydCA9PT0gXCJzdHJpbmdcIixcblx0XHRcdFx0aSA9IDAsXG5cdFx0XHRcdGwgPSBjaGVja1NldC5sZW5ndGg7XG5cblx0XHRcdGlmICggaXNQYXJ0U3RyICYmICFyTm9uV29yZC50ZXN0KCBwYXJ0ICkgKSB7XG5cdFx0XHRcdHBhcnQgPSBwYXJ0LnRvTG93ZXJDYXNlKCk7XG5cblx0XHRcdFx0Zm9yICggOyBpIDwgbDsgaSsrICkge1xuXHRcdFx0XHRcdGVsZW0gPSBjaGVja1NldFtpXTtcblxuXHRcdFx0XHRcdGlmICggZWxlbSApIHtcblx0XHRcdFx0XHRcdHZhciBwYXJlbnQgPSBlbGVtLnBhcmVudE5vZGU7XG5cdFx0XHRcdFx0XHRjaGVja1NldFtpXSA9IHBhcmVudC5ub2RlTmFtZS50b0xvd2VyQ2FzZSgpID09PSBwYXJ0ID8gcGFyZW50IDogZmFsc2U7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9XG5cblx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdGZvciAoIDsgaSA8IGw7IGkrKyApIHtcblx0XHRcdFx0XHRlbGVtID0gY2hlY2tTZXRbaV07XG5cblx0XHRcdFx0XHRpZiAoIGVsZW0gKSB7XG5cdFx0XHRcdFx0XHRjaGVja1NldFtpXSA9IGlzUGFydFN0ciA/XG5cdFx0XHRcdFx0XHRcdGVsZW0ucGFyZW50Tm9kZSA6XG5cdFx0XHRcdFx0XHRcdGVsZW0ucGFyZW50Tm9kZSA9PT0gcGFydDtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH1cblxuXHRcdFx0XHRpZiAoIGlzUGFydFN0ciApIHtcblx0XHRcdFx0XHRTaXp6bGUuZmlsdGVyKCBwYXJ0LCBjaGVja1NldCwgdHJ1ZSApO1xuXHRcdFx0XHR9XG5cdFx0XHR9XG5cdFx0fSxcblxuXHRcdFwiXCI6IGZ1bmN0aW9uKGNoZWNrU2V0LCBwYXJ0LCBpc1hNTCl7XG5cdFx0XHR2YXIgbm9kZUNoZWNrLFxuXHRcdFx0XHRkb25lTmFtZSA9IGRvbmUrKyxcblx0XHRcdFx0Y2hlY2tGbiA9IGRpckNoZWNrO1xuXG5cdFx0XHRpZiAoIHR5cGVvZiBwYXJ0ID09PSBcInN0cmluZ1wiICYmICFyTm9uV29yZC50ZXN0KCBwYXJ0ICkgKSB7XG5cdFx0XHRcdHBhcnQgPSBwYXJ0LnRvTG93ZXJDYXNlKCk7XG5cdFx0XHRcdG5vZGVDaGVjayA9IHBhcnQ7XG5cdFx0XHRcdGNoZWNrRm4gPSBkaXJOb2RlQ2hlY2s7XG5cdFx0XHR9XG5cblx0XHRcdGNoZWNrRm4oIFwicGFyZW50Tm9kZVwiLCBwYXJ0LCBkb25lTmFtZSwgY2hlY2tTZXQsIG5vZGVDaGVjaywgaXNYTUwgKTtcblx0XHR9LFxuXG5cdFx0XCJ+XCI6IGZ1bmN0aW9uKCBjaGVja1NldCwgcGFydCwgaXNYTUwgKSB7XG5cdFx0XHR2YXIgbm9kZUNoZWNrLFxuXHRcdFx0XHRkb25lTmFtZSA9IGRvbmUrKyxcblx0XHRcdFx0Y2hlY2tGbiA9IGRpckNoZWNrO1xuXG5cdFx0XHRpZiAoIHR5cGVvZiBwYXJ0ID09PSBcInN0cmluZ1wiICYmICFyTm9uV29yZC50ZXN0KCBwYXJ0ICkgKSB7XG5cdFx0XHRcdHBhcnQgPSBwYXJ0LnRvTG93ZXJDYXNlKCk7XG5cdFx0XHRcdG5vZGVDaGVjayA9IHBhcnQ7XG5cdFx0XHRcdGNoZWNrRm4gPSBkaXJOb2RlQ2hlY2s7XG5cdFx0XHR9XG5cblx0XHRcdGNoZWNrRm4oIFwicHJldmlvdXNTaWJsaW5nXCIsIHBhcnQsIGRvbmVOYW1lLCBjaGVja1NldCwgbm9kZUNoZWNrLCBpc1hNTCApO1xuXHRcdH1cblx0fSxcblxuXHRmaW5kOiB7XG5cdFx0SUQ6IGZ1bmN0aW9uKCBtYXRjaCwgY29udGV4dCwgaXNYTUwgKSB7XG5cdFx0XHRpZiAoIHR5cGVvZiBjb250ZXh0LmdldEVsZW1lbnRCeUlkICE9PSBcInVuZGVmaW5lZFwiICYmICFpc1hNTCApIHtcblx0XHRcdFx0dmFyIG0gPSBjb250ZXh0LmdldEVsZW1lbnRCeUlkKG1hdGNoWzFdKTtcblx0XHRcdFx0Ly8gQ2hlY2sgcGFyZW50Tm9kZSB0byBjYXRjaCB3aGVuIEJsYWNrYmVycnkgNC42IHJldHVybnNcblx0XHRcdFx0Ly8gbm9kZXMgdGhhdCBhcmUgbm8gbG9uZ2VyIGluIHRoZSBkb2N1bWVudCAjNjk2M1xuXHRcdFx0XHRyZXR1cm4gbSAmJiBtLnBhcmVudE5vZGUgPyBbbV0gOiBbXTtcblx0XHRcdH1cblx0XHR9LFxuXG5cdFx0TkFNRTogZnVuY3Rpb24oIG1hdGNoLCBjb250ZXh0ICkge1xuXHRcdFx0aWYgKCB0eXBlb2YgY29udGV4dC5nZXRFbGVtZW50c0J5TmFtZSAhPT0gXCJ1bmRlZmluZWRcIiApIHtcblx0XHRcdFx0dmFyIHJldCA9IFtdLFxuXHRcdFx0XHRcdHJlc3VsdHMgPSBjb250ZXh0LmdldEVsZW1lbnRzQnlOYW1lKCBtYXRjaFsxXSApO1xuXG5cdFx0XHRcdGZvciAoIHZhciBpID0gMCwgbCA9IHJlc3VsdHMubGVuZ3RoOyBpIDwgbDsgaSsrICkge1xuXHRcdFx0XHRcdGlmICggcmVzdWx0c1tpXS5nZXRBdHRyaWJ1dGUoXCJuYW1lXCIpID09PSBtYXRjaFsxXSApIHtcblx0XHRcdFx0XHRcdHJldC5wdXNoKCByZXN1bHRzW2ldICk7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9XG5cblx0XHRcdFx0cmV0dXJuIHJldC5sZW5ndGggPT09IDAgPyBudWxsIDogcmV0O1xuXHRcdFx0fVxuXHRcdH0sXG5cblx0XHRUQUc6IGZ1bmN0aW9uKCBtYXRjaCwgY29udGV4dCApIHtcblx0XHRcdGlmICggdHlwZW9mIGNvbnRleHQuZ2V0RWxlbWVudHNCeVRhZ05hbWUgIT09IFwidW5kZWZpbmVkXCIgKSB7XG5cdFx0XHRcdHJldHVybiBjb250ZXh0LmdldEVsZW1lbnRzQnlUYWdOYW1lKCBtYXRjaFsxXSApO1xuXHRcdFx0fVxuXHRcdH1cblx0fSxcblx0cHJlRmlsdGVyOiB7XG5cdFx0Q0xBU1M6IGZ1bmN0aW9uKCBtYXRjaCwgY3VyTG9vcCwgaW5wbGFjZSwgcmVzdWx0LCBub3QsIGlzWE1MICkge1xuXHRcdFx0bWF0Y2ggPSBcIiBcIiArIG1hdGNoWzFdLnJlcGxhY2UoIHJCYWNrc2xhc2gsIFwiXCIgKSArIFwiIFwiO1xuXG5cdFx0XHRpZiAoIGlzWE1MICkge1xuXHRcdFx0XHRyZXR1cm4gbWF0Y2g7XG5cdFx0XHR9XG5cblx0XHRcdGZvciAoIHZhciBpID0gMCwgZWxlbTsgKGVsZW0gPSBjdXJMb29wW2ldKSAhPSBudWxsOyBpKysgKSB7XG5cdFx0XHRcdGlmICggZWxlbSApIHtcblx0XHRcdFx0XHRpZiAoIG5vdCBeIChlbGVtLmNsYXNzTmFtZSAmJiAoXCIgXCIgKyBlbGVtLmNsYXNzTmFtZSArIFwiIFwiKS5yZXBsYWNlKC9bXFx0XFxuXFxyXS9nLCBcIiBcIikuaW5kZXhPZihtYXRjaCkgPj0gMCkgKSB7XG5cdFx0XHRcdFx0XHRpZiAoICFpbnBsYWNlICkge1xuXHRcdFx0XHRcdFx0XHRyZXN1bHQucHVzaCggZWxlbSApO1xuXHRcdFx0XHRcdFx0fVxuXG5cdFx0XHRcdFx0fSBlbHNlIGlmICggaW5wbGFjZSApIHtcblx0XHRcdFx0XHRcdGN1ckxvb3BbaV0gPSBmYWxzZTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH1cblx0XHRcdH1cblxuXHRcdFx0cmV0dXJuIGZhbHNlO1xuXHRcdH0sXG5cblx0XHRJRDogZnVuY3Rpb24oIG1hdGNoICkge1xuXHRcdFx0cmV0dXJuIG1hdGNoWzFdLnJlcGxhY2UoIHJCYWNrc2xhc2gsIFwiXCIgKTtcblx0XHR9LFxuXG5cdFx0VEFHOiBmdW5jdGlvbiggbWF0Y2gsIGN1ckxvb3AgKSB7XG5cdFx0XHRyZXR1cm4gbWF0Y2hbMV0ucmVwbGFjZSggckJhY2tzbGFzaCwgXCJcIiApLnRvTG93ZXJDYXNlKCk7XG5cdFx0fSxcblxuXHRcdENISUxEOiBmdW5jdGlvbiggbWF0Y2ggKSB7XG5cdFx0XHRpZiAoIG1hdGNoWzFdID09PSBcIm50aFwiICkge1xuXHRcdFx0XHRpZiAoICFtYXRjaFsyXSApIHtcblx0XHRcdFx0XHRTaXp6bGUuZXJyb3IoIG1hdGNoWzBdICk7XG5cdFx0XHRcdH1cblxuXHRcdFx0XHRtYXRjaFsyXSA9IG1hdGNoWzJdLnJlcGxhY2UoL15cXCt8XFxzKi9nLCAnJyk7XG5cblx0XHRcdFx0Ly8gcGFyc2UgZXF1YXRpb25zIGxpa2UgJ2V2ZW4nLCAnb2RkJywgJzUnLCAnMm4nLCAnM24rMicsICc0bi0xJywgJy1uKzYnXG5cdFx0XHRcdHZhciB0ZXN0ID0gLygtPykoXFxkKikoPzpuKFsrXFwtXT9cXGQqKSk/Ly5leGVjKFxuXHRcdFx0XHRcdG1hdGNoWzJdID09PSBcImV2ZW5cIiAmJiBcIjJuXCIgfHwgbWF0Y2hbMl0gPT09IFwib2RkXCIgJiYgXCIybisxXCIgfHxcblx0XHRcdFx0XHQhL1xcRC8udGVzdCggbWF0Y2hbMl0gKSAmJiBcIjBuK1wiICsgbWF0Y2hbMl0gfHwgbWF0Y2hbMl0pO1xuXG5cdFx0XHRcdC8vIGNhbGN1bGF0ZSB0aGUgbnVtYmVycyAoZmlyc3QpbisobGFzdCkgaW5jbHVkaW5nIGlmIHRoZXkgYXJlIG5lZ2F0aXZlXG5cdFx0XHRcdG1hdGNoWzJdID0gKHRlc3RbMV0gKyAodGVzdFsyXSB8fCAxKSkgLSAwO1xuXHRcdFx0XHRtYXRjaFszXSA9IHRlc3RbM10gLSAwO1xuXHRcdFx0fVxuXHRcdFx0ZWxzZSBpZiAoIG1hdGNoWzJdICkge1xuXHRcdFx0XHRTaXp6bGUuZXJyb3IoIG1hdGNoWzBdICk7XG5cdFx0XHR9XG5cblx0XHRcdC8vIFRPRE86IE1vdmUgdG8gbm9ybWFsIGNhY2hpbmcgc3lzdGVtXG5cdFx0XHRtYXRjaFswXSA9IGRvbmUrKztcblxuXHRcdFx0cmV0dXJuIG1hdGNoO1xuXHRcdH0sXG5cblx0XHRBVFRSOiBmdW5jdGlvbiggbWF0Y2gsIGN1ckxvb3AsIGlucGxhY2UsIHJlc3VsdCwgbm90LCBpc1hNTCApIHtcblx0XHRcdHZhciBuYW1lID0gbWF0Y2hbMV0gPSBtYXRjaFsxXS5yZXBsYWNlKCByQmFja3NsYXNoLCBcIlwiICk7XG5cdFx0XHRcblx0XHRcdGlmICggIWlzWE1MICYmIEV4cHIuYXR0ck1hcFtuYW1lXSApIHtcblx0XHRcdFx0bWF0Y2hbMV0gPSBFeHByLmF0dHJNYXBbbmFtZV07XG5cdFx0XHR9XG5cblx0XHRcdC8vIEhhbmRsZSBpZiBhbiB1bi1xdW90ZWQgdmFsdWUgd2FzIHVzZWRcblx0XHRcdG1hdGNoWzRdID0gKCBtYXRjaFs0XSB8fCBtYXRjaFs1XSB8fCBcIlwiICkucmVwbGFjZSggckJhY2tzbGFzaCwgXCJcIiApO1xuXG5cdFx0XHRpZiAoIG1hdGNoWzJdID09PSBcIn49XCIgKSB7XG5cdFx0XHRcdG1hdGNoWzRdID0gXCIgXCIgKyBtYXRjaFs0XSArIFwiIFwiO1xuXHRcdFx0fVxuXG5cdFx0XHRyZXR1cm4gbWF0Y2g7XG5cdFx0fSxcblxuXHRcdFBTRVVETzogZnVuY3Rpb24oIG1hdGNoLCBjdXJMb29wLCBpbnBsYWNlLCByZXN1bHQsIG5vdCApIHtcblx0XHRcdGlmICggbWF0Y2hbMV0gPT09IFwibm90XCIgKSB7XG5cdFx0XHRcdC8vIElmIHdlJ3JlIGRlYWxpbmcgd2l0aCBhIGNvbXBsZXggZXhwcmVzc2lvbiwgb3IgYSBzaW1wbGUgb25lXG5cdFx0XHRcdGlmICggKCBjaHVua2VyLmV4ZWMobWF0Y2hbM10pIHx8IFwiXCIgKS5sZW5ndGggPiAxIHx8IC9eXFx3Ly50ZXN0KG1hdGNoWzNdKSApIHtcblx0XHRcdFx0XHRtYXRjaFszXSA9IFNpenpsZShtYXRjaFszXSwgbnVsbCwgbnVsbCwgY3VyTG9vcCk7XG5cblx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHR2YXIgcmV0ID0gU2l6emxlLmZpbHRlcihtYXRjaFszXSwgY3VyTG9vcCwgaW5wbGFjZSwgdHJ1ZSBeIG5vdCk7XG5cblx0XHRcdFx0XHRpZiAoICFpbnBsYWNlICkge1xuXHRcdFx0XHRcdFx0cmVzdWx0LnB1c2guYXBwbHkoIHJlc3VsdCwgcmV0ICk7XG5cdFx0XHRcdFx0fVxuXG5cdFx0XHRcdFx0cmV0dXJuIGZhbHNlO1xuXHRcdFx0XHR9XG5cblx0XHRcdH0gZWxzZSBpZiAoIEV4cHIubWF0Y2guUE9TLnRlc3QoIG1hdGNoWzBdICkgfHwgRXhwci5tYXRjaC5DSElMRC50ZXN0KCBtYXRjaFswXSApICkge1xuXHRcdFx0XHRyZXR1cm4gdHJ1ZTtcblx0XHRcdH1cblx0XHRcdFxuXHRcdFx0cmV0dXJuIG1hdGNoO1xuXHRcdH0sXG5cblx0XHRQT1M6IGZ1bmN0aW9uKCBtYXRjaCApIHtcblx0XHRcdG1hdGNoLnVuc2hpZnQoIHRydWUgKTtcblxuXHRcdFx0cmV0dXJuIG1hdGNoO1xuXHRcdH1cblx0fSxcblx0XG5cdGZpbHRlcnM6IHtcblx0XHRlbmFibGVkOiBmdW5jdGlvbiggZWxlbSApIHtcblx0XHRcdHJldHVybiBlbGVtLmRpc2FibGVkID09PSBmYWxzZSAmJiBlbGVtLnR5cGUgIT09IFwiaGlkZGVuXCI7XG5cdFx0fSxcblxuXHRcdGRpc2FibGVkOiBmdW5jdGlvbiggZWxlbSApIHtcblx0XHRcdHJldHVybiBlbGVtLmRpc2FibGVkID09PSB0cnVlO1xuXHRcdH0sXG5cblx0XHRjaGVja2VkOiBmdW5jdGlvbiggZWxlbSApIHtcblx0XHRcdHJldHVybiBlbGVtLmNoZWNrZWQgPT09IHRydWU7XG5cdFx0fSxcblx0XHRcblx0XHRzZWxlY3RlZDogZnVuY3Rpb24oIGVsZW0gKSB7XG5cdFx0XHQvLyBBY2Nlc3NpbmcgdGhpcyBwcm9wZXJ0eSBtYWtlcyBzZWxlY3RlZC1ieS1kZWZhdWx0XG5cdFx0XHQvLyBvcHRpb25zIGluIFNhZmFyaSB3b3JrIHByb3Blcmx5XG5cdFx0XHRpZiAoIGVsZW0ucGFyZW50Tm9kZSApIHtcblx0XHRcdFx0ZWxlbS5wYXJlbnROb2RlLnNlbGVjdGVkSW5kZXg7XG5cdFx0XHR9XG5cdFx0XHRcblx0XHRcdHJldHVybiBlbGVtLnNlbGVjdGVkID09PSB0cnVlO1xuXHRcdH0sXG5cblx0XHRwYXJlbnQ6IGZ1bmN0aW9uKCBlbGVtICkge1xuXHRcdFx0cmV0dXJuICEhZWxlbS5maXJzdENoaWxkO1xuXHRcdH0sXG5cblx0XHRlbXB0eTogZnVuY3Rpb24oIGVsZW0gKSB7XG5cdFx0XHRyZXR1cm4gIWVsZW0uZmlyc3RDaGlsZDtcblx0XHR9LFxuXG5cdFx0aGFzOiBmdW5jdGlvbiggZWxlbSwgaSwgbWF0Y2ggKSB7XG5cdFx0XHRyZXR1cm4gISFTaXp6bGUoIG1hdGNoWzNdLCBlbGVtICkubGVuZ3RoO1xuXHRcdH0sXG5cblx0XHRoZWFkZXI6IGZ1bmN0aW9uKCBlbGVtICkge1xuXHRcdFx0cmV0dXJuICgvaFxcZC9pKS50ZXN0KCBlbGVtLm5vZGVOYW1lICk7XG5cdFx0fSxcblxuXHRcdHRleHQ6IGZ1bmN0aW9uKCBlbGVtICkge1xuXHRcdFx0dmFyIGF0dHIgPSBlbGVtLmdldEF0dHJpYnV0ZSggXCJ0eXBlXCIgKSwgdHlwZSA9IGVsZW0udHlwZTtcblx0XHRcdC8vIElFNiBhbmQgNyB3aWxsIG1hcCBlbGVtLnR5cGUgdG8gJ3RleHQnIGZvciBuZXcgSFRNTDUgdHlwZXMgKHNlYXJjaCwgZXRjKSBcblx0XHRcdC8vIHVzZSBnZXRBdHRyaWJ1dGUgaW5zdGVhZCB0byB0ZXN0IHRoaXMgY2FzZVxuXHRcdFx0cmV0dXJuIGVsZW0ubm9kZU5hbWUudG9Mb3dlckNhc2UoKSA9PT0gXCJpbnB1dFwiICYmIFwidGV4dFwiID09PSB0eXBlICYmICggYXR0ciA9PT0gdHlwZSB8fCBhdHRyID09PSBudWxsICk7XG5cdFx0fSxcblxuXHRcdHJhZGlvOiBmdW5jdGlvbiggZWxlbSApIHtcblx0XHRcdHJldHVybiBlbGVtLm5vZGVOYW1lLnRvTG93ZXJDYXNlKCkgPT09IFwiaW5wdXRcIiAmJiBcInJhZGlvXCIgPT09IGVsZW0udHlwZTtcblx0XHR9LFxuXG5cdFx0Y2hlY2tib3g6IGZ1bmN0aW9uKCBlbGVtICkge1xuXHRcdFx0cmV0dXJuIGVsZW0ubm9kZU5hbWUudG9Mb3dlckNhc2UoKSA9PT0gXCJpbnB1dFwiICYmIFwiY2hlY2tib3hcIiA9PT0gZWxlbS50eXBlO1xuXHRcdH0sXG5cblx0XHRmaWxlOiBmdW5jdGlvbiggZWxlbSApIHtcblx0XHRcdHJldHVybiBlbGVtLm5vZGVOYW1lLnRvTG93ZXJDYXNlKCkgPT09IFwiaW5wdXRcIiAmJiBcImZpbGVcIiA9PT0gZWxlbS50eXBlO1xuXHRcdH0sXG5cblx0XHRwYXNzd29yZDogZnVuY3Rpb24oIGVsZW0gKSB7XG5cdFx0XHRyZXR1cm4gZWxlbS5ub2RlTmFtZS50b0xvd2VyQ2FzZSgpID09PSBcImlucHV0XCIgJiYgXCJwYXNzd29yZFwiID09PSBlbGVtLnR5cGU7XG5cdFx0fSxcblxuXHRcdHN1Ym1pdDogZnVuY3Rpb24oIGVsZW0gKSB7XG5cdFx0XHR2YXIgbmFtZSA9IGVsZW0ubm9kZU5hbWUudG9Mb3dlckNhc2UoKTtcblx0XHRcdHJldHVybiAobmFtZSA9PT0gXCJpbnB1dFwiIHx8IG5hbWUgPT09IFwiYnV0dG9uXCIpICYmIFwic3VibWl0XCIgPT09IGVsZW0udHlwZTtcblx0XHR9LFxuXG5cdFx0aW1hZ2U6IGZ1bmN0aW9uKCBlbGVtICkge1xuXHRcdFx0cmV0dXJuIGVsZW0ubm9kZU5hbWUudG9Mb3dlckNhc2UoKSA9PT0gXCJpbnB1dFwiICYmIFwiaW1hZ2VcIiA9PT0gZWxlbS50eXBlO1xuXHRcdH0sXG5cblx0XHRyZXNldDogZnVuY3Rpb24oIGVsZW0gKSB7XG5cdFx0XHR2YXIgbmFtZSA9IGVsZW0ubm9kZU5hbWUudG9Mb3dlckNhc2UoKTtcblx0XHRcdHJldHVybiAobmFtZSA9PT0gXCJpbnB1dFwiIHx8IG5hbWUgPT09IFwiYnV0dG9uXCIpICYmIFwicmVzZXRcIiA9PT0gZWxlbS50eXBlO1xuXHRcdH0sXG5cblx0XHRidXR0b246IGZ1bmN0aW9uKCBlbGVtICkge1xuXHRcdFx0dmFyIG5hbWUgPSBlbGVtLm5vZGVOYW1lLnRvTG93ZXJDYXNlKCk7XG5cdFx0XHRyZXR1cm4gbmFtZSA9PT0gXCJpbnB1dFwiICYmIFwiYnV0dG9uXCIgPT09IGVsZW0udHlwZSB8fCBuYW1lID09PSBcImJ1dHRvblwiO1xuXHRcdH0sXG5cblx0XHRpbnB1dDogZnVuY3Rpb24oIGVsZW0gKSB7XG5cdFx0XHRyZXR1cm4gKC9pbnB1dHxzZWxlY3R8dGV4dGFyZWF8YnV0dG9uL2kpLnRlc3QoIGVsZW0ubm9kZU5hbWUgKTtcblx0XHR9LFxuXG5cdFx0Zm9jdXM6IGZ1bmN0aW9uKCBlbGVtICkge1xuXHRcdFx0cmV0dXJuIGVsZW0gPT09IGVsZW0ub3duZXJEb2N1bWVudC5hY3RpdmVFbGVtZW50O1xuXHRcdH1cblx0fSxcblx0c2V0RmlsdGVyczoge1xuXHRcdGZpcnN0OiBmdW5jdGlvbiggZWxlbSwgaSApIHtcblx0XHRcdHJldHVybiBpID09PSAwO1xuXHRcdH0sXG5cblx0XHRsYXN0OiBmdW5jdGlvbiggZWxlbSwgaSwgbWF0Y2gsIGFycmF5ICkge1xuXHRcdFx0cmV0dXJuIGkgPT09IGFycmF5Lmxlbmd0aCAtIDE7XG5cdFx0fSxcblxuXHRcdGV2ZW46IGZ1bmN0aW9uKCBlbGVtLCBpICkge1xuXHRcdFx0cmV0dXJuIGkgJSAyID09PSAwO1xuXHRcdH0sXG5cblx0XHRvZGQ6IGZ1bmN0aW9uKCBlbGVtLCBpICkge1xuXHRcdFx0cmV0dXJuIGkgJSAyID09PSAxO1xuXHRcdH0sXG5cblx0XHRsdDogZnVuY3Rpb24oIGVsZW0sIGksIG1hdGNoICkge1xuXHRcdFx0cmV0dXJuIGkgPCBtYXRjaFszXSAtIDA7XG5cdFx0fSxcblxuXHRcdGd0OiBmdW5jdGlvbiggZWxlbSwgaSwgbWF0Y2ggKSB7XG5cdFx0XHRyZXR1cm4gaSA+IG1hdGNoWzNdIC0gMDtcblx0XHR9LFxuXG5cdFx0bnRoOiBmdW5jdGlvbiggZWxlbSwgaSwgbWF0Y2ggKSB7XG5cdFx0XHRyZXR1cm4gbWF0Y2hbM10gLSAwID09PSBpO1xuXHRcdH0sXG5cblx0XHRlcTogZnVuY3Rpb24oIGVsZW0sIGksIG1hdGNoICkge1xuXHRcdFx0cmV0dXJuIG1hdGNoWzNdIC0gMCA9PT0gaTtcblx0XHR9XG5cdH0sXG5cdGZpbHRlcjoge1xuXHRcdFBTRVVETzogZnVuY3Rpb24oIGVsZW0sIG1hdGNoLCBpLCBhcnJheSApIHtcblx0XHRcdHZhciBuYW1lID0gbWF0Y2hbMV0sXG5cdFx0XHRcdGZpbHRlciA9IEV4cHIuZmlsdGVyc1sgbmFtZSBdO1xuXG5cdFx0XHRpZiAoIGZpbHRlciApIHtcblx0XHRcdFx0cmV0dXJuIGZpbHRlciggZWxlbSwgaSwgbWF0Y2gsIGFycmF5ICk7XG5cblx0XHRcdH0gZWxzZSBpZiAoIG5hbWUgPT09IFwiY29udGFpbnNcIiApIHtcblx0XHRcdFx0cmV0dXJuIChlbGVtLnRleHRDb250ZW50IHx8IGVsZW0uaW5uZXJUZXh0IHx8IGdldFRleHQoWyBlbGVtIF0pIHx8IFwiXCIpLmluZGV4T2YobWF0Y2hbM10pID49IDA7XG5cblx0XHRcdH0gZWxzZSBpZiAoIG5hbWUgPT09IFwibm90XCIgKSB7XG5cdFx0XHRcdHZhciBub3QgPSBtYXRjaFszXTtcblxuXHRcdFx0XHRmb3IgKCB2YXIgaiA9IDAsIGwgPSBub3QubGVuZ3RoOyBqIDwgbDsgaisrICkge1xuXHRcdFx0XHRcdGlmICggbm90W2pdID09PSBlbGVtICkge1xuXHRcdFx0XHRcdFx0cmV0dXJuIGZhbHNlO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0fVxuXG5cdFx0XHRcdHJldHVybiB0cnVlO1xuXG5cdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRTaXp6bGUuZXJyb3IoIG5hbWUgKTtcblx0XHRcdH1cblx0XHR9LFxuXG5cdFx0Q0hJTEQ6IGZ1bmN0aW9uKCBlbGVtLCBtYXRjaCApIHtcblx0XHRcdHZhciBmaXJzdCwgbGFzdCxcblx0XHRcdFx0ZG9uZU5hbWUsIHBhcmVudCwgY2FjaGUsXG5cdFx0XHRcdGNvdW50LCBkaWZmLFxuXHRcdFx0XHR0eXBlID0gbWF0Y2hbMV0sXG5cdFx0XHRcdG5vZGUgPSBlbGVtO1xuXG5cdFx0XHRzd2l0Y2ggKCB0eXBlICkge1xuXHRcdFx0XHRjYXNlIFwib25seVwiOlxuXHRcdFx0XHRjYXNlIFwiZmlyc3RcIjpcblx0XHRcdFx0XHR3aGlsZSAoIChub2RlID0gbm9kZS5wcmV2aW91c1NpYmxpbmcpIClcdCB7XG5cdFx0XHRcdFx0XHRpZiAoIG5vZGUubm9kZVR5cGUgPT09IDEgKSB7IFxuXHRcdFx0XHRcdFx0XHRyZXR1cm4gZmFsc2U7IFxuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdH1cblxuXHRcdFx0XHRcdGlmICggdHlwZSA9PT0gXCJmaXJzdFwiICkgeyBcblx0XHRcdFx0XHRcdHJldHVybiB0cnVlOyBcblx0XHRcdFx0XHR9XG5cblx0XHRcdFx0XHRub2RlID0gZWxlbTtcblxuXHRcdFx0XHRjYXNlIFwibGFzdFwiOlxuXHRcdFx0XHRcdHdoaWxlICggKG5vZGUgPSBub2RlLm5leHRTaWJsaW5nKSApXHQge1xuXHRcdFx0XHRcdFx0aWYgKCBub2RlLm5vZGVUeXBlID09PSAxICkgeyBcblx0XHRcdFx0XHRcdFx0cmV0dXJuIGZhbHNlOyBcblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHR9XG5cblx0XHRcdFx0XHRyZXR1cm4gdHJ1ZTtcblxuXHRcdFx0XHRjYXNlIFwibnRoXCI6XG5cdFx0XHRcdFx0Zmlyc3QgPSBtYXRjaFsyXTtcblx0XHRcdFx0XHRsYXN0ID0gbWF0Y2hbM107XG5cblx0XHRcdFx0XHRpZiAoIGZpcnN0ID09PSAxICYmIGxhc3QgPT09IDAgKSB7XG5cdFx0XHRcdFx0XHRyZXR1cm4gdHJ1ZTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XG5cdFx0XHRcdFx0ZG9uZU5hbWUgPSBtYXRjaFswXTtcblx0XHRcdFx0XHRwYXJlbnQgPSBlbGVtLnBhcmVudE5vZGU7XG5cdFxuXHRcdFx0XHRcdGlmICggcGFyZW50ICYmIChwYXJlbnRbIGV4cGFuZG8gXSAhPT0gZG9uZU5hbWUgfHwgIWVsZW0ubm9kZUluZGV4KSApIHtcblx0XHRcdFx0XHRcdGNvdW50ID0gMDtcblx0XHRcdFx0XHRcdFxuXHRcdFx0XHRcdFx0Zm9yICggbm9kZSA9IHBhcmVudC5maXJzdENoaWxkOyBub2RlOyBub2RlID0gbm9kZS5uZXh0U2libGluZyApIHtcblx0XHRcdFx0XHRcdFx0aWYgKCBub2RlLm5vZGVUeXBlID09PSAxICkge1xuXHRcdFx0XHRcdFx0XHRcdG5vZGUubm9kZUluZGV4ID0gKytjb3VudDtcblx0XHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0fSBcblxuXHRcdFx0XHRcdFx0cGFyZW50WyBleHBhbmRvIF0gPSBkb25lTmFtZTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XG5cdFx0XHRcdFx0ZGlmZiA9IGVsZW0ubm9kZUluZGV4IC0gbGFzdDtcblxuXHRcdFx0XHRcdGlmICggZmlyc3QgPT09IDAgKSB7XG5cdFx0XHRcdFx0XHRyZXR1cm4gZGlmZiA9PT0gMDtcblxuXHRcdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0XHRyZXR1cm4gKCBkaWZmICUgZmlyc3QgPT09IDAgJiYgZGlmZiAvIGZpcnN0ID49IDAgKTtcblx0XHRcdFx0XHR9XG5cdFx0XHR9XG5cdFx0fSxcblxuXHRcdElEOiBmdW5jdGlvbiggZWxlbSwgbWF0Y2ggKSB7XG5cdFx0XHRyZXR1cm4gZWxlbS5ub2RlVHlwZSA9PT0gMSAmJiBlbGVtLmdldEF0dHJpYnV0ZShcImlkXCIpID09PSBtYXRjaDtcblx0XHR9LFxuXG5cdFx0VEFHOiBmdW5jdGlvbiggZWxlbSwgbWF0Y2ggKSB7XG5cdFx0XHRyZXR1cm4gKG1hdGNoID09PSBcIipcIiAmJiBlbGVtLm5vZGVUeXBlID09PSAxKSB8fCAhIWVsZW0ubm9kZU5hbWUgJiYgZWxlbS5ub2RlTmFtZS50b0xvd2VyQ2FzZSgpID09PSBtYXRjaDtcblx0XHR9LFxuXHRcdFxuXHRcdENMQVNTOiBmdW5jdGlvbiggZWxlbSwgbWF0Y2ggKSB7XG5cdFx0XHRyZXR1cm4gKFwiIFwiICsgKGVsZW0uY2xhc3NOYW1lIHx8IGVsZW0uZ2V0QXR0cmlidXRlKFwiY2xhc3NcIikpICsgXCIgXCIpXG5cdFx0XHRcdC5pbmRleE9mKCBtYXRjaCApID4gLTE7XG5cdFx0fSxcblxuXHRcdEFUVFI6IGZ1bmN0aW9uKCBlbGVtLCBtYXRjaCApIHtcblx0XHRcdHZhciBuYW1lID0gbWF0Y2hbMV0sXG5cdFx0XHRcdHJlc3VsdCA9IFNpenpsZS5hdHRyID9cblx0XHRcdFx0XHRTaXp6bGUuYXR0ciggZWxlbSwgbmFtZSApIDpcblx0XHRcdFx0XHRFeHByLmF0dHJIYW5kbGVbIG5hbWUgXSA/XG5cdFx0XHRcdFx0RXhwci5hdHRySGFuZGxlWyBuYW1lIF0oIGVsZW0gKSA6XG5cdFx0XHRcdFx0ZWxlbVsgbmFtZSBdICE9IG51bGwgP1xuXHRcdFx0XHRcdFx0ZWxlbVsgbmFtZSBdIDpcblx0XHRcdFx0XHRcdGVsZW0uZ2V0QXR0cmlidXRlKCBuYW1lICksXG5cdFx0XHRcdHZhbHVlID0gcmVzdWx0ICsgXCJcIixcblx0XHRcdFx0dHlwZSA9IG1hdGNoWzJdLFxuXHRcdFx0XHRjaGVjayA9IG1hdGNoWzRdO1xuXG5cdFx0XHRyZXR1cm4gcmVzdWx0ID09IG51bGwgP1xuXHRcdFx0XHR0eXBlID09PSBcIiE9XCIgOlxuXHRcdFx0XHQhdHlwZSAmJiBTaXp6bGUuYXR0ciA/XG5cdFx0XHRcdHJlc3VsdCAhPSBudWxsIDpcblx0XHRcdFx0dHlwZSA9PT0gXCI9XCIgP1xuXHRcdFx0XHR2YWx1ZSA9PT0gY2hlY2sgOlxuXHRcdFx0XHR0eXBlID09PSBcIio9XCIgP1xuXHRcdFx0XHR2YWx1ZS5pbmRleE9mKGNoZWNrKSA+PSAwIDpcblx0XHRcdFx0dHlwZSA9PT0gXCJ+PVwiID9cblx0XHRcdFx0KFwiIFwiICsgdmFsdWUgKyBcIiBcIikuaW5kZXhPZihjaGVjaykgPj0gMCA6XG5cdFx0XHRcdCFjaGVjayA/XG5cdFx0XHRcdHZhbHVlICYmIHJlc3VsdCAhPT0gZmFsc2UgOlxuXHRcdFx0XHR0eXBlID09PSBcIiE9XCIgP1xuXHRcdFx0XHR2YWx1ZSAhPT0gY2hlY2sgOlxuXHRcdFx0XHR0eXBlID09PSBcIl49XCIgP1xuXHRcdFx0XHR2YWx1ZS5pbmRleE9mKGNoZWNrKSA9PT0gMCA6XG5cdFx0XHRcdHR5cGUgPT09IFwiJD1cIiA/XG5cdFx0XHRcdHZhbHVlLnN1YnN0cih2YWx1ZS5sZW5ndGggLSBjaGVjay5sZW5ndGgpID09PSBjaGVjayA6XG5cdFx0XHRcdHR5cGUgPT09IFwifD1cIiA/XG5cdFx0XHRcdHZhbHVlID09PSBjaGVjayB8fCB2YWx1ZS5zdWJzdHIoMCwgY2hlY2subGVuZ3RoICsgMSkgPT09IGNoZWNrICsgXCItXCIgOlxuXHRcdFx0XHRmYWxzZTtcblx0XHR9LFxuXG5cdFx0UE9TOiBmdW5jdGlvbiggZWxlbSwgbWF0Y2gsIGksIGFycmF5ICkge1xuXHRcdFx0dmFyIG5hbWUgPSBtYXRjaFsyXSxcblx0XHRcdFx0ZmlsdGVyID0gRXhwci5zZXRGaWx0ZXJzWyBuYW1lIF07XG5cblx0XHRcdGlmICggZmlsdGVyICkge1xuXHRcdFx0XHRyZXR1cm4gZmlsdGVyKCBlbGVtLCBpLCBtYXRjaCwgYXJyYXkgKTtcblx0XHRcdH1cblx0XHR9XG5cdH1cbn07XG5cbnZhciBvcmlnUE9TID0gRXhwci5tYXRjaC5QT1MsXG5cdGZlc2NhcGUgPSBmdW5jdGlvbihhbGwsIG51bSl7XG5cdFx0cmV0dXJuIFwiXFxcXFwiICsgKG51bSAtIDAgKyAxKTtcblx0fTtcblxuZm9yICggdmFyIHR5cGUgaW4gRXhwci5tYXRjaCApIHtcblx0RXhwci5tYXRjaFsgdHlwZSBdID0gbmV3IFJlZ0V4cCggRXhwci5tYXRjaFsgdHlwZSBdLnNvdXJjZSArICgvKD8hW15cXFtdKlxcXSkoPyFbXlxcKF0qXFwpKS8uc291cmNlKSApO1xuXHRFeHByLmxlZnRNYXRjaFsgdHlwZSBdID0gbmV3IFJlZ0V4cCggLyheKD86LnxcXHJ8XFxuKSo/KS8uc291cmNlICsgRXhwci5tYXRjaFsgdHlwZSBdLnNvdXJjZS5yZXBsYWNlKC9cXFxcKFxcZCspL2csIGZlc2NhcGUpICk7XG59XG5cbnZhciBtYWtlQXJyYXkgPSBmdW5jdGlvbiggYXJyYXksIHJlc3VsdHMgKSB7XG5cdGFycmF5ID0gQXJyYXkucHJvdG90eXBlLnNsaWNlLmNhbGwoIGFycmF5LCAwICk7XG5cblx0aWYgKCByZXN1bHRzICkge1xuXHRcdHJlc3VsdHMucHVzaC5hcHBseSggcmVzdWx0cywgYXJyYXkgKTtcblx0XHRyZXR1cm4gcmVzdWx0cztcblx0fVxuXHRcblx0cmV0dXJuIGFycmF5O1xufTtcblxuLy8gUGVyZm9ybSBhIHNpbXBsZSBjaGVjayB0byBkZXRlcm1pbmUgaWYgdGhlIGJyb3dzZXIgaXMgY2FwYWJsZSBvZlxuLy8gY29udmVydGluZyBhIE5vZGVMaXN0IHRvIGFuIGFycmF5IHVzaW5nIGJ1aWx0aW4gbWV0aG9kcy5cbi8vIEFsc28gdmVyaWZpZXMgdGhhdCB0aGUgcmV0dXJuZWQgYXJyYXkgaG9sZHMgRE9NIG5vZGVzXG4vLyAod2hpY2ggaXMgbm90IHRoZSBjYXNlIGluIHRoZSBCbGFja2JlcnJ5IGJyb3dzZXIpXG50cnkge1xuXHRBcnJheS5wcm90b3R5cGUuc2xpY2UuY2FsbCggZG9jdW1lbnQuZG9jdW1lbnRFbGVtZW50LmNoaWxkTm9kZXMsIDAgKVswXS5ub2RlVHlwZTtcblxuLy8gUHJvdmlkZSBhIGZhbGxiYWNrIG1ldGhvZCBpZiBpdCBkb2VzIG5vdCB3b3JrXG59IGNhdGNoKCBlICkge1xuXHRtYWtlQXJyYXkgPSBmdW5jdGlvbiggYXJyYXksIHJlc3VsdHMgKSB7XG5cdFx0dmFyIGkgPSAwLFxuXHRcdFx0cmV0ID0gcmVzdWx0cyB8fCBbXTtcblxuXHRcdGlmICggdG9TdHJpbmcuY2FsbChhcnJheSkgPT09IFwiW29iamVjdCBBcnJheV1cIiApIHtcblx0XHRcdEFycmF5LnByb3RvdHlwZS5wdXNoLmFwcGx5KCByZXQsIGFycmF5ICk7XG5cblx0XHR9IGVsc2Uge1xuXHRcdFx0aWYgKCB0eXBlb2YgYXJyYXkubGVuZ3RoID09PSBcIm51bWJlclwiICkge1xuXHRcdFx0XHRmb3IgKCB2YXIgbCA9IGFycmF5Lmxlbmd0aDsgaSA8IGw7IGkrKyApIHtcblx0XHRcdFx0XHRyZXQucHVzaCggYXJyYXlbaV0gKTtcblx0XHRcdFx0fVxuXG5cdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRmb3IgKCA7IGFycmF5W2ldOyBpKysgKSB7XG5cdFx0XHRcdFx0cmV0LnB1c2goIGFycmF5W2ldICk7XG5cdFx0XHRcdH1cblx0XHRcdH1cblx0XHR9XG5cblx0XHRyZXR1cm4gcmV0O1xuXHR9O1xufVxuXG52YXIgc29ydE9yZGVyLCBzaWJsaW5nQ2hlY2s7XG5cbmlmICggZG9jdW1lbnQuZG9jdW1lbnRFbGVtZW50LmNvbXBhcmVEb2N1bWVudFBvc2l0aW9uICkge1xuXHRzb3J0T3JkZXIgPSBmdW5jdGlvbiggYSwgYiApIHtcblx0XHRpZiAoIGEgPT09IGIgKSB7XG5cdFx0XHRoYXNEdXBsaWNhdGUgPSB0cnVlO1xuXHRcdFx0cmV0dXJuIDA7XG5cdFx0fVxuXG5cdFx0aWYgKCAhYS5jb21wYXJlRG9jdW1lbnRQb3NpdGlvbiB8fCAhYi5jb21wYXJlRG9jdW1lbnRQb3NpdGlvbiApIHtcblx0XHRcdHJldHVybiBhLmNvbXBhcmVEb2N1bWVudFBvc2l0aW9uID8gLTEgOiAxO1xuXHRcdH1cblxuXHRcdHJldHVybiBhLmNvbXBhcmVEb2N1bWVudFBvc2l0aW9uKGIpICYgNCA/IC0xIDogMTtcblx0fTtcblxufSBlbHNlIHtcblx0c29ydE9yZGVyID0gZnVuY3Rpb24oIGEsIGIgKSB7XG5cdFx0Ly8gVGhlIG5vZGVzIGFyZSBpZGVudGljYWwsIHdlIGNhbiBleGl0IGVhcmx5XG5cdFx0aWYgKCBhID09PSBiICkge1xuXHRcdFx0aGFzRHVwbGljYXRlID0gdHJ1ZTtcblx0XHRcdHJldHVybiAwO1xuXG5cdFx0Ly8gRmFsbGJhY2sgdG8gdXNpbmcgc291cmNlSW5kZXggKGluIElFKSBpZiBpdCdzIGF2YWlsYWJsZSBvbiBib3RoIG5vZGVzXG5cdFx0fSBlbHNlIGlmICggYS5zb3VyY2VJbmRleCAmJiBiLnNvdXJjZUluZGV4ICkge1xuXHRcdFx0cmV0dXJuIGEuc291cmNlSW5kZXggLSBiLnNvdXJjZUluZGV4O1xuXHRcdH1cblxuXHRcdHZhciBhbCwgYmwsXG5cdFx0XHRhcCA9IFtdLFxuXHRcdFx0YnAgPSBbXSxcblx0XHRcdGF1cCA9IGEucGFyZW50Tm9kZSxcblx0XHRcdGJ1cCA9IGIucGFyZW50Tm9kZSxcblx0XHRcdGN1ciA9IGF1cDtcblxuXHRcdC8vIElmIHRoZSBub2RlcyBhcmUgc2libGluZ3MgKG9yIGlkZW50aWNhbCkgd2UgY2FuIGRvIGEgcXVpY2sgY2hlY2tcblx0XHRpZiAoIGF1cCA9PT0gYnVwICkge1xuXHRcdFx0cmV0dXJuIHNpYmxpbmdDaGVjayggYSwgYiApO1xuXG5cdFx0Ly8gSWYgbm8gcGFyZW50cyB3ZXJlIGZvdW5kIHRoZW4gdGhlIG5vZGVzIGFyZSBkaXNjb25uZWN0ZWRcblx0XHR9IGVsc2UgaWYgKCAhYXVwICkge1xuXHRcdFx0cmV0dXJuIC0xO1xuXG5cdFx0fSBlbHNlIGlmICggIWJ1cCApIHtcblx0XHRcdHJldHVybiAxO1xuXHRcdH1cblxuXHRcdC8vIE90aGVyd2lzZSB0aGV5J3JlIHNvbWV3aGVyZSBlbHNlIGluIHRoZSB0cmVlIHNvIHdlIG5lZWRcblx0XHQvLyB0byBidWlsZCB1cCBhIGZ1bGwgbGlzdCBvZiB0aGUgcGFyZW50Tm9kZXMgZm9yIGNvbXBhcmlzb25cblx0XHR3aGlsZSAoIGN1ciApIHtcblx0XHRcdGFwLnVuc2hpZnQoIGN1ciApO1xuXHRcdFx0Y3VyID0gY3VyLnBhcmVudE5vZGU7XG5cdFx0fVxuXG5cdFx0Y3VyID0gYnVwO1xuXG5cdFx0d2hpbGUgKCBjdXIgKSB7XG5cdFx0XHRicC51bnNoaWZ0KCBjdXIgKTtcblx0XHRcdGN1ciA9IGN1ci5wYXJlbnROb2RlO1xuXHRcdH1cblxuXHRcdGFsID0gYXAubGVuZ3RoO1xuXHRcdGJsID0gYnAubGVuZ3RoO1xuXG5cdFx0Ly8gU3RhcnQgd2Fsa2luZyBkb3duIHRoZSB0cmVlIGxvb2tpbmcgZm9yIGEgZGlzY3JlcGFuY3lcblx0XHRmb3IgKCB2YXIgaSA9IDA7IGkgPCBhbCAmJiBpIDwgYmw7IGkrKyApIHtcblx0XHRcdGlmICggYXBbaV0gIT09IGJwW2ldICkge1xuXHRcdFx0XHRyZXR1cm4gc2libGluZ0NoZWNrKCBhcFtpXSwgYnBbaV0gKTtcblx0XHRcdH1cblx0XHR9XG5cblx0XHQvLyBXZSBlbmRlZCBzb21lcGxhY2UgdXAgdGhlIHRyZWUgc28gZG8gYSBzaWJsaW5nIGNoZWNrXG5cdFx0cmV0dXJuIGkgPT09IGFsID9cblx0XHRcdHNpYmxpbmdDaGVjayggYSwgYnBbaV0sIC0xICkgOlxuXHRcdFx0c2libGluZ0NoZWNrKCBhcFtpXSwgYiwgMSApO1xuXHR9O1xuXG5cdHNpYmxpbmdDaGVjayA9IGZ1bmN0aW9uKCBhLCBiLCByZXQgKSB7XG5cdFx0aWYgKCBhID09PSBiICkge1xuXHRcdFx0cmV0dXJuIHJldDtcblx0XHR9XG5cblx0XHR2YXIgY3VyID0gYS5uZXh0U2libGluZztcblxuXHRcdHdoaWxlICggY3VyICkge1xuXHRcdFx0aWYgKCBjdXIgPT09IGIgKSB7XG5cdFx0XHRcdHJldHVybiAtMTtcblx0XHRcdH1cblxuXHRcdFx0Y3VyID0gY3VyLm5leHRTaWJsaW5nO1xuXHRcdH1cblxuXHRcdHJldHVybiAxO1xuXHR9O1xufVxuXG4vLyBDaGVjayB0byBzZWUgaWYgdGhlIGJyb3dzZXIgcmV0dXJucyBlbGVtZW50cyBieSBuYW1lIHdoZW5cbi8vIHF1ZXJ5aW5nIGJ5IGdldEVsZW1lbnRCeUlkIChhbmQgcHJvdmlkZSBhIHdvcmthcm91bmQpXG4oZnVuY3Rpb24oKXtcblx0Ly8gV2UncmUgZ29pbmcgdG8gaW5qZWN0IGEgZmFrZSBpbnB1dCBlbGVtZW50IHdpdGggYSBzcGVjaWZpZWQgbmFtZVxuXHR2YXIgZm9ybSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIiksXG5cdFx0aWQgPSBcInNjcmlwdFwiICsgKG5ldyBEYXRlKCkpLmdldFRpbWUoKSxcblx0XHRyb290ID0gZG9jdW1lbnQuZG9jdW1lbnRFbGVtZW50O1xuXG5cdGZvcm0uaW5uZXJIVE1MID0gXCI8YSBuYW1lPSdcIiArIGlkICsgXCInLz5cIjtcblxuXHQvLyBJbmplY3QgaXQgaW50byB0aGUgcm9vdCBlbGVtZW50LCBjaGVjayBpdHMgc3RhdHVzLCBhbmQgcmVtb3ZlIGl0IHF1aWNrbHlcblx0cm9vdC5pbnNlcnRCZWZvcmUoIGZvcm0sIHJvb3QuZmlyc3RDaGlsZCApO1xuXG5cdC8vIFRoZSB3b3JrYXJvdW5kIGhhcyB0byBkbyBhZGRpdGlvbmFsIGNoZWNrcyBhZnRlciBhIGdldEVsZW1lbnRCeUlkXG5cdC8vIFdoaWNoIHNsb3dzIHRoaW5ncyBkb3duIGZvciBvdGhlciBicm93c2VycyAoaGVuY2UgdGhlIGJyYW5jaGluZylcblx0aWYgKCBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCggaWQgKSApIHtcblx0XHRFeHByLmZpbmQuSUQgPSBmdW5jdGlvbiggbWF0Y2gsIGNvbnRleHQsIGlzWE1MICkge1xuXHRcdFx0aWYgKCB0eXBlb2YgY29udGV4dC5nZXRFbGVtZW50QnlJZCAhPT0gXCJ1bmRlZmluZWRcIiAmJiAhaXNYTUwgKSB7XG5cdFx0XHRcdHZhciBtID0gY29udGV4dC5nZXRFbGVtZW50QnlJZChtYXRjaFsxXSk7XG5cblx0XHRcdFx0cmV0dXJuIG0gP1xuXHRcdFx0XHRcdG0uaWQgPT09IG1hdGNoWzFdIHx8IHR5cGVvZiBtLmdldEF0dHJpYnV0ZU5vZGUgIT09IFwidW5kZWZpbmVkXCIgJiYgbS5nZXRBdHRyaWJ1dGVOb2RlKFwiaWRcIikubm9kZVZhbHVlID09PSBtYXRjaFsxXSA/XG5cdFx0XHRcdFx0XHRbbV0gOlxuXHRcdFx0XHRcdFx0dW5kZWZpbmVkIDpcblx0XHRcdFx0XHRbXTtcblx0XHRcdH1cblx0XHR9O1xuXG5cdFx0RXhwci5maWx0ZXIuSUQgPSBmdW5jdGlvbiggZWxlbSwgbWF0Y2ggKSB7XG5cdFx0XHR2YXIgbm9kZSA9IHR5cGVvZiBlbGVtLmdldEF0dHJpYnV0ZU5vZGUgIT09IFwidW5kZWZpbmVkXCIgJiYgZWxlbS5nZXRBdHRyaWJ1dGVOb2RlKFwiaWRcIik7XG5cblx0XHRcdHJldHVybiBlbGVtLm5vZGVUeXBlID09PSAxICYmIG5vZGUgJiYgbm9kZS5ub2RlVmFsdWUgPT09IG1hdGNoO1xuXHRcdH07XG5cdH1cblxuXHRyb290LnJlbW92ZUNoaWxkKCBmb3JtICk7XG5cblx0Ly8gcmVsZWFzZSBtZW1vcnkgaW4gSUVcblx0cm9vdCA9IGZvcm0gPSBudWxsO1xufSkoKTtcblxuKGZ1bmN0aW9uKCl7XG5cdC8vIENoZWNrIHRvIHNlZSBpZiB0aGUgYnJvd3NlciByZXR1cm5zIG9ubHkgZWxlbWVudHNcblx0Ly8gd2hlbiBkb2luZyBnZXRFbGVtZW50c0J5VGFnTmFtZShcIipcIilcblxuXHQvLyBDcmVhdGUgYSBmYWtlIGVsZW1lbnRcblx0dmFyIGRpdiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIik7XG5cdGRpdi5hcHBlbmRDaGlsZCggZG9jdW1lbnQuY3JlYXRlQ29tbWVudChcIlwiKSApO1xuXG5cdC8vIE1ha2Ugc3VyZSBubyBjb21tZW50cyBhcmUgZm91bmRcblx0aWYgKCBkaXYuZ2V0RWxlbWVudHNCeVRhZ05hbWUoXCIqXCIpLmxlbmd0aCA+IDAgKSB7XG5cdFx0RXhwci5maW5kLlRBRyA9IGZ1bmN0aW9uKCBtYXRjaCwgY29udGV4dCApIHtcblx0XHRcdHZhciByZXN1bHRzID0gY29udGV4dC5nZXRFbGVtZW50c0J5VGFnTmFtZSggbWF0Y2hbMV0gKTtcblxuXHRcdFx0Ly8gRmlsdGVyIG91dCBwb3NzaWJsZSBjb21tZW50c1xuXHRcdFx0aWYgKCBtYXRjaFsxXSA9PT0gXCIqXCIgKSB7XG5cdFx0XHRcdHZhciB0bXAgPSBbXTtcblxuXHRcdFx0XHRmb3IgKCB2YXIgaSA9IDA7IHJlc3VsdHNbaV07IGkrKyApIHtcblx0XHRcdFx0XHRpZiAoIHJlc3VsdHNbaV0ubm9kZVR5cGUgPT09IDEgKSB7XG5cdFx0XHRcdFx0XHR0bXAucHVzaCggcmVzdWx0c1tpXSApO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0fVxuXG5cdFx0XHRcdHJlc3VsdHMgPSB0bXA7XG5cdFx0XHR9XG5cblx0XHRcdHJldHVybiByZXN1bHRzO1xuXHRcdH07XG5cdH1cblxuXHQvLyBDaGVjayB0byBzZWUgaWYgYW4gYXR0cmlidXRlIHJldHVybnMgbm9ybWFsaXplZCBocmVmIGF0dHJpYnV0ZXNcblx0ZGl2LmlubmVySFRNTCA9IFwiPGEgaHJlZj0nIyc+PC9hPlwiO1xuXG5cdGlmICggZGl2LmZpcnN0Q2hpbGQgJiYgdHlwZW9mIGRpdi5maXJzdENoaWxkLmdldEF0dHJpYnV0ZSAhPT0gXCJ1bmRlZmluZWRcIiAmJlxuXHRcdFx0ZGl2LmZpcnN0Q2hpbGQuZ2V0QXR0cmlidXRlKFwiaHJlZlwiKSAhPT0gXCIjXCIgKSB7XG5cblx0XHRFeHByLmF0dHJIYW5kbGUuaHJlZiA9IGZ1bmN0aW9uKCBlbGVtICkge1xuXHRcdFx0cmV0dXJuIGVsZW0uZ2V0QXR0cmlidXRlKCBcImhyZWZcIiwgMiApO1xuXHRcdH07XG5cdH1cblxuXHQvLyByZWxlYXNlIG1lbW9yeSBpbiBJRVxuXHRkaXYgPSBudWxsO1xufSkoKTtcblxuaWYgKCBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsICkge1xuXHQoZnVuY3Rpb24oKXtcblx0XHR2YXIgb2xkU2l6emxlID0gU2l6emxlLFxuXHRcdFx0ZGl2ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImRpdlwiKSxcblx0XHRcdGlkID0gXCJfX3NpenpsZV9fXCI7XG5cblx0XHRkaXYuaW5uZXJIVE1MID0gXCI8cCBjbGFzcz0nVEVTVCc+PC9wPlwiO1xuXG5cdFx0Ly8gU2FmYXJpIGNhbid0IGhhbmRsZSB1cHBlcmNhc2Ugb3IgdW5pY29kZSBjaGFyYWN0ZXJzIHdoZW5cblx0XHQvLyBpbiBxdWlya3MgbW9kZS5cblx0XHRpZiAoIGRpdi5xdWVyeVNlbGVjdG9yQWxsICYmIGRpdi5xdWVyeVNlbGVjdG9yQWxsKFwiLlRFU1RcIikubGVuZ3RoID09PSAwICkge1xuXHRcdFx0cmV0dXJuO1xuXHRcdH1cblx0XG5cdFx0U2l6emxlID0gZnVuY3Rpb24oIHF1ZXJ5LCBjb250ZXh0LCBleHRyYSwgc2VlZCApIHtcblx0XHRcdGNvbnRleHQgPSBjb250ZXh0IHx8IGRvY3VtZW50O1xuXG5cdFx0XHQvLyBPbmx5IHVzZSBxdWVyeVNlbGVjdG9yQWxsIG9uIG5vbi1YTUwgZG9jdW1lbnRzXG5cdFx0XHQvLyAoSUQgc2VsZWN0b3JzIGRvbid0IHdvcmsgaW4gbm9uLUhUTUwgZG9jdW1lbnRzKVxuXHRcdFx0aWYgKCAhc2VlZCAmJiAhU2l6emxlLmlzWE1MKGNvbnRleHQpICkge1xuXHRcdFx0XHQvLyBTZWUgaWYgd2UgZmluZCBhIHNlbGVjdG9yIHRvIHNwZWVkIHVwXG5cdFx0XHRcdHZhciBtYXRjaCA9IC9eKFxcdyskKXxeXFwuKFtcXHdcXC1dKyQpfF4jKFtcXHdcXC1dKyQpLy5leGVjKCBxdWVyeSApO1xuXHRcdFx0XHRcblx0XHRcdFx0aWYgKCBtYXRjaCAmJiAoY29udGV4dC5ub2RlVHlwZSA9PT0gMSB8fCBjb250ZXh0Lm5vZGVUeXBlID09PSA5KSApIHtcblx0XHRcdFx0XHQvLyBTcGVlZC11cDogU2l6emxlKFwiVEFHXCIpXG5cdFx0XHRcdFx0aWYgKCBtYXRjaFsxXSApIHtcblx0XHRcdFx0XHRcdHJldHVybiBtYWtlQXJyYXkoIGNvbnRleHQuZ2V0RWxlbWVudHNCeVRhZ05hbWUoIHF1ZXJ5ICksIGV4dHJhICk7XG5cdFx0XHRcdFx0XG5cdFx0XHRcdFx0Ly8gU3BlZWQtdXA6IFNpenpsZShcIi5DTEFTU1wiKVxuXHRcdFx0XHRcdH0gZWxzZSBpZiAoIG1hdGNoWzJdICYmIEV4cHIuZmluZC5DTEFTUyAmJiBjb250ZXh0LmdldEVsZW1lbnRzQnlDbGFzc05hbWUgKSB7XG5cdFx0XHRcdFx0XHRyZXR1cm4gbWFrZUFycmF5KCBjb250ZXh0LmdldEVsZW1lbnRzQnlDbGFzc05hbWUoIG1hdGNoWzJdICksIGV4dHJhICk7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9XG5cdFx0XHRcdFxuXHRcdFx0XHRpZiAoIGNvbnRleHQubm9kZVR5cGUgPT09IDkgKSB7XG5cdFx0XHRcdFx0Ly8gU3BlZWQtdXA6IFNpenpsZShcImJvZHlcIilcblx0XHRcdFx0XHQvLyBUaGUgYm9keSBlbGVtZW50IG9ubHkgZXhpc3RzIG9uY2UsIG9wdGltaXplIGZpbmRpbmcgaXRcblx0XHRcdFx0XHRpZiAoIHF1ZXJ5ID09PSBcImJvZHlcIiAmJiBjb250ZXh0LmJvZHkgKSB7XG5cdFx0XHRcdFx0XHRyZXR1cm4gbWFrZUFycmF5KCBbIGNvbnRleHQuYm9keSBdLCBleHRyYSApO1xuXHRcdFx0XHRcdFx0XG5cdFx0XHRcdFx0Ly8gU3BlZWQtdXA6IFNpenpsZShcIiNJRFwiKVxuXHRcdFx0XHRcdH0gZWxzZSBpZiAoIG1hdGNoICYmIG1hdGNoWzNdICkge1xuXHRcdFx0XHRcdFx0dmFyIGVsZW0gPSBjb250ZXh0LmdldEVsZW1lbnRCeUlkKCBtYXRjaFszXSApO1xuXG5cdFx0XHRcdFx0XHQvLyBDaGVjayBwYXJlbnROb2RlIHRvIGNhdGNoIHdoZW4gQmxhY2tiZXJyeSA0LjYgcmV0dXJuc1xuXHRcdFx0XHRcdFx0Ly8gbm9kZXMgdGhhdCBhcmUgbm8gbG9uZ2VyIGluIHRoZSBkb2N1bWVudCAjNjk2M1xuXHRcdFx0XHRcdFx0aWYgKCBlbGVtICYmIGVsZW0ucGFyZW50Tm9kZSApIHtcblx0XHRcdFx0XHRcdFx0Ly8gSGFuZGxlIHRoZSBjYXNlIHdoZXJlIElFIGFuZCBPcGVyYSByZXR1cm4gaXRlbXNcblx0XHRcdFx0XHRcdFx0Ly8gYnkgbmFtZSBpbnN0ZWFkIG9mIElEXG5cdFx0XHRcdFx0XHRcdGlmICggZWxlbS5pZCA9PT0gbWF0Y2hbM10gKSB7XG5cdFx0XHRcdFx0XHRcdFx0cmV0dXJuIG1ha2VBcnJheSggWyBlbGVtIF0sIGV4dHJhICk7XG5cdFx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdFx0XG5cdFx0XHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdFx0XHRyZXR1cm4gbWFrZUFycmF5KCBbXSwgZXh0cmEgKTtcblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XG5cdFx0XHRcdFx0dHJ5IHtcblx0XHRcdFx0XHRcdHJldHVybiBtYWtlQXJyYXkoIGNvbnRleHQucXVlcnlTZWxlY3RvckFsbChxdWVyeSksIGV4dHJhICk7XG5cdFx0XHRcdFx0fSBjYXRjaChxc2FFcnJvcikge31cblxuXHRcdFx0XHQvLyBxU0Egd29ya3Mgc3RyYW5nZWx5IG9uIEVsZW1lbnQtcm9vdGVkIHF1ZXJpZXNcblx0XHRcdFx0Ly8gV2UgY2FuIHdvcmsgYXJvdW5kIHRoaXMgYnkgc3BlY2lmeWluZyBhbiBleHRyYSBJRCBvbiB0aGUgcm9vdFxuXHRcdFx0XHQvLyBhbmQgd29ya2luZyB1cCBmcm9tIHRoZXJlIChUaGFua3MgdG8gQW5kcmV3IER1cG9udCBmb3IgdGhlIHRlY2huaXF1ZSlcblx0XHRcdFx0Ly8gSUUgOCBkb2Vzbid0IHdvcmsgb24gb2JqZWN0IGVsZW1lbnRzXG5cdFx0XHRcdH0gZWxzZSBpZiAoIGNvbnRleHQubm9kZVR5cGUgPT09IDEgJiYgY29udGV4dC5ub2RlTmFtZS50b0xvd2VyQ2FzZSgpICE9PSBcIm9iamVjdFwiICkge1xuXHRcdFx0XHRcdHZhciBvbGRDb250ZXh0ID0gY29udGV4dCxcblx0XHRcdFx0XHRcdG9sZCA9IGNvbnRleHQuZ2V0QXR0cmlidXRlKCBcImlkXCIgKSxcblx0XHRcdFx0XHRcdG5pZCA9IG9sZCB8fCBpZCxcblx0XHRcdFx0XHRcdGhhc1BhcmVudCA9IGNvbnRleHQucGFyZW50Tm9kZSxcblx0XHRcdFx0XHRcdHJlbGF0aXZlSGllcmFyY2h5U2VsZWN0b3IgPSAvXlxccypbK35dLy50ZXN0KCBxdWVyeSApO1xuXG5cdFx0XHRcdFx0aWYgKCAhb2xkICkge1xuXHRcdFx0XHRcdFx0Y29udGV4dC5zZXRBdHRyaWJ1dGUoIFwiaWRcIiwgbmlkICk7XG5cdFx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHRcdG5pZCA9IG5pZC5yZXBsYWNlKCAvJy9nLCBcIlxcXFwkJlwiICk7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHRcdGlmICggcmVsYXRpdmVIaWVyYXJjaHlTZWxlY3RvciAmJiBoYXNQYXJlbnQgKSB7XG5cdFx0XHRcdFx0XHRjb250ZXh0ID0gY29udGV4dC5wYXJlbnROb2RlO1xuXHRcdFx0XHRcdH1cblxuXHRcdFx0XHRcdHRyeSB7XG5cdFx0XHRcdFx0XHRpZiAoICFyZWxhdGl2ZUhpZXJhcmNoeVNlbGVjdG9yIHx8IGhhc1BhcmVudCApIHtcblx0XHRcdFx0XHRcdFx0cmV0dXJuIG1ha2VBcnJheSggY29udGV4dC5xdWVyeVNlbGVjdG9yQWxsKCBcIltpZD0nXCIgKyBuaWQgKyBcIiddIFwiICsgcXVlcnkgKSwgZXh0cmEgKTtcblx0XHRcdFx0XHRcdH1cblxuXHRcdFx0XHRcdH0gY2F0Y2gocHNldWRvRXJyb3IpIHtcblx0XHRcdFx0XHR9IGZpbmFsbHkge1xuXHRcdFx0XHRcdFx0aWYgKCAhb2xkICkge1xuXHRcdFx0XHRcdFx0XHRvbGRDb250ZXh0LnJlbW92ZUF0dHJpYnV0ZSggXCJpZFwiICk7XG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9XG5cdFx0XHR9XG5cdFx0XG5cdFx0XHRyZXR1cm4gb2xkU2l6emxlKHF1ZXJ5LCBjb250ZXh0LCBleHRyYSwgc2VlZCk7XG5cdFx0fTtcblxuXHRcdGZvciAoIHZhciBwcm9wIGluIG9sZFNpenpsZSApIHtcblx0XHRcdFNpenpsZVsgcHJvcCBdID0gb2xkU2l6emxlWyBwcm9wIF07XG5cdFx0fVxuXG5cdFx0Ly8gcmVsZWFzZSBtZW1vcnkgaW4gSUVcblx0XHRkaXYgPSBudWxsO1xuXHR9KSgpO1xufVxuXG4oZnVuY3Rpb24oKXtcblx0dmFyIGh0bWwgPSBkb2N1bWVudC5kb2N1bWVudEVsZW1lbnQsXG5cdFx0bWF0Y2hlcyA9IGh0bWwubWF0Y2hlc1NlbGVjdG9yIHx8IGh0bWwubW96TWF0Y2hlc1NlbGVjdG9yIHx8IGh0bWwud2Via2l0TWF0Y2hlc1NlbGVjdG9yIHx8IGh0bWwubXNNYXRjaGVzU2VsZWN0b3I7XG5cblx0aWYgKCBtYXRjaGVzICkge1xuXHRcdC8vIENoZWNrIHRvIHNlZSBpZiBpdCdzIHBvc3NpYmxlIHRvIGRvIG1hdGNoZXNTZWxlY3RvclxuXHRcdC8vIG9uIGEgZGlzY29ubmVjdGVkIG5vZGUgKElFIDkgZmFpbHMgdGhpcylcblx0XHR2YXIgZGlzY29ubmVjdGVkTWF0Y2ggPSAhbWF0Y2hlcy5jYWxsKCBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCBcImRpdlwiICksIFwiZGl2XCIgKSxcblx0XHRcdHBzZXVkb1dvcmtzID0gZmFsc2U7XG5cblx0XHR0cnkge1xuXHRcdFx0Ly8gVGhpcyBzaG91bGQgZmFpbCB3aXRoIGFuIGV4Y2VwdGlvblxuXHRcdFx0Ly8gR2Vja28gZG9lcyBub3QgZXJyb3IsIHJldHVybnMgZmFsc2UgaW5zdGVhZFxuXHRcdFx0bWF0Y2hlcy5jYWxsKCBkb2N1bWVudC5kb2N1bWVudEVsZW1lbnQsIFwiW3Rlc3QhPScnXTpzaXp6bGVcIiApO1xuXHRcblx0XHR9IGNhdGNoKCBwc2V1ZG9FcnJvciApIHtcblx0XHRcdHBzZXVkb1dvcmtzID0gdHJ1ZTtcblx0XHR9XG5cblx0XHRTaXp6bGUubWF0Y2hlc1NlbGVjdG9yID0gZnVuY3Rpb24oIG5vZGUsIGV4cHIgKSB7XG5cdFx0XHQvLyBNYWtlIHN1cmUgdGhhdCBhdHRyaWJ1dGUgc2VsZWN0b3JzIGFyZSBxdW90ZWRcblx0XHRcdGV4cHIgPSBleHByLnJlcGxhY2UoL1xcPVxccyooW14nXCJcXF1dKilcXHMqXFxdL2csIFwiPSckMSddXCIpO1xuXG5cdFx0XHRpZiAoICFTaXp6bGUuaXNYTUwoIG5vZGUgKSApIHtcblx0XHRcdFx0dHJ5IHsgXG5cdFx0XHRcdFx0aWYgKCBwc2V1ZG9Xb3JrcyB8fCAhRXhwci5tYXRjaC5QU0VVRE8udGVzdCggZXhwciApICYmICEvIT0vLnRlc3QoIGV4cHIgKSApIHtcblx0XHRcdFx0XHRcdHZhciByZXQgPSBtYXRjaGVzLmNhbGwoIG5vZGUsIGV4cHIgKTtcblxuXHRcdFx0XHRcdFx0Ly8gSUUgOSdzIG1hdGNoZXNTZWxlY3RvciByZXR1cm5zIGZhbHNlIG9uIGRpc2Nvbm5lY3RlZCBub2Rlc1xuXHRcdFx0XHRcdFx0aWYgKCByZXQgfHwgIWRpc2Nvbm5lY3RlZE1hdGNoIHx8XG5cdFx0XHRcdFx0XHRcdFx0Ly8gQXMgd2VsbCwgZGlzY29ubmVjdGVkIG5vZGVzIGFyZSBzYWlkIHRvIGJlIGluIGEgZG9jdW1lbnRcblx0XHRcdFx0XHRcdFx0XHQvLyBmcmFnbWVudCBpbiBJRSA5LCBzbyBjaGVjayBmb3IgdGhhdFxuXHRcdFx0XHRcdFx0XHRcdG5vZGUuZG9jdW1lbnQgJiYgbm9kZS5kb2N1bWVudC5ub2RlVHlwZSAhPT0gMTEgKSB7XG5cdFx0XHRcdFx0XHRcdHJldHVybiByZXQ7XG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9IGNhdGNoKGUpIHt9XG5cdFx0XHR9XG5cblx0XHRcdHJldHVybiBTaXp6bGUoZXhwciwgbnVsbCwgbnVsbCwgW25vZGVdKS5sZW5ndGggPiAwO1xuXHRcdH07XG5cdH1cbn0pKCk7XG5cbihmdW5jdGlvbigpe1xuXHR2YXIgZGl2ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImRpdlwiKTtcblxuXHRkaXYuaW5uZXJIVE1MID0gXCI8ZGl2IGNsYXNzPSd0ZXN0IGUnPjwvZGl2PjxkaXYgY2xhc3M9J3Rlc3QnPjwvZGl2PlwiO1xuXG5cdC8vIE9wZXJhIGNhbid0IGZpbmQgYSBzZWNvbmQgY2xhc3NuYW1lIChpbiA5LjYpXG5cdC8vIEFsc28sIG1ha2Ugc3VyZSB0aGF0IGdldEVsZW1lbnRzQnlDbGFzc05hbWUgYWN0dWFsbHkgZXhpc3RzXG5cdGlmICggIWRpdi5nZXRFbGVtZW50c0J5Q2xhc3NOYW1lIHx8IGRpdi5nZXRFbGVtZW50c0J5Q2xhc3NOYW1lKFwiZVwiKS5sZW5ndGggPT09IDAgKSB7XG5cdFx0cmV0dXJuO1xuXHR9XG5cblx0Ly8gU2FmYXJpIGNhY2hlcyBjbGFzcyBhdHRyaWJ1dGVzLCBkb2Vzbid0IGNhdGNoIGNoYW5nZXMgKGluIDMuMilcblx0ZGl2Lmxhc3RDaGlsZC5jbGFzc05hbWUgPSBcImVcIjtcblxuXHRpZiAoIGRpdi5nZXRFbGVtZW50c0J5Q2xhc3NOYW1lKFwiZVwiKS5sZW5ndGggPT09IDEgKSB7XG5cdFx0cmV0dXJuO1xuXHR9XG5cdFxuXHRFeHByLm9yZGVyLnNwbGljZSgxLCAwLCBcIkNMQVNTXCIpO1xuXHRFeHByLmZpbmQuQ0xBU1MgPSBmdW5jdGlvbiggbWF0Y2gsIGNvbnRleHQsIGlzWE1MICkge1xuXHRcdGlmICggdHlwZW9mIGNvbnRleHQuZ2V0RWxlbWVudHNCeUNsYXNzTmFtZSAhPT0gXCJ1bmRlZmluZWRcIiAmJiAhaXNYTUwgKSB7XG5cdFx0XHRyZXR1cm4gY29udGV4dC5nZXRFbGVtZW50c0J5Q2xhc3NOYW1lKG1hdGNoWzFdKTtcblx0XHR9XG5cdH07XG5cblx0Ly8gcmVsZWFzZSBtZW1vcnkgaW4gSUVcblx0ZGl2ID0gbnVsbDtcbn0pKCk7XG5cbmZ1bmN0aW9uIGRpck5vZGVDaGVjayggZGlyLCBjdXIsIGRvbmVOYW1lLCBjaGVja1NldCwgbm9kZUNoZWNrLCBpc1hNTCApIHtcblx0Zm9yICggdmFyIGkgPSAwLCBsID0gY2hlY2tTZXQubGVuZ3RoOyBpIDwgbDsgaSsrICkge1xuXHRcdHZhciBlbGVtID0gY2hlY2tTZXRbaV07XG5cblx0XHRpZiAoIGVsZW0gKSB7XG5cdFx0XHR2YXIgbWF0Y2ggPSBmYWxzZTtcblxuXHRcdFx0ZWxlbSA9IGVsZW1bZGlyXTtcblxuXHRcdFx0d2hpbGUgKCBlbGVtICkge1xuXHRcdFx0XHRpZiAoIGVsZW1bIGV4cGFuZG8gXSA9PT0gZG9uZU5hbWUgKSB7XG5cdFx0XHRcdFx0bWF0Y2ggPSBjaGVja1NldFtlbGVtLnNpenNldF07XG5cdFx0XHRcdFx0YnJlYWs7XG5cdFx0XHRcdH1cblxuXHRcdFx0XHRpZiAoIGVsZW0ubm9kZVR5cGUgPT09IDEgJiYgIWlzWE1MICl7XG5cdFx0XHRcdFx0ZWxlbVsgZXhwYW5kbyBdID0gZG9uZU5hbWU7XG5cdFx0XHRcdFx0ZWxlbS5zaXpzZXQgPSBpO1xuXHRcdFx0XHR9XG5cblx0XHRcdFx0aWYgKCBlbGVtLm5vZGVOYW1lLnRvTG93ZXJDYXNlKCkgPT09IGN1ciApIHtcblx0XHRcdFx0XHRtYXRjaCA9IGVsZW07XG5cdFx0XHRcdFx0YnJlYWs7XG5cdFx0XHRcdH1cblxuXHRcdFx0XHRlbGVtID0gZWxlbVtkaXJdO1xuXHRcdFx0fVxuXG5cdFx0XHRjaGVja1NldFtpXSA9IG1hdGNoO1xuXHRcdH1cblx0fVxufVxuXG5mdW5jdGlvbiBkaXJDaGVjayggZGlyLCBjdXIsIGRvbmVOYW1lLCBjaGVja1NldCwgbm9kZUNoZWNrLCBpc1hNTCApIHtcblx0Zm9yICggdmFyIGkgPSAwLCBsID0gY2hlY2tTZXQubGVuZ3RoOyBpIDwgbDsgaSsrICkge1xuXHRcdHZhciBlbGVtID0gY2hlY2tTZXRbaV07XG5cblx0XHRpZiAoIGVsZW0gKSB7XG5cdFx0XHR2YXIgbWF0Y2ggPSBmYWxzZTtcblx0XHRcdFxuXHRcdFx0ZWxlbSA9IGVsZW1bZGlyXTtcblxuXHRcdFx0d2hpbGUgKCBlbGVtICkge1xuXHRcdFx0XHRpZiAoIGVsZW1bIGV4cGFuZG8gXSA9PT0gZG9uZU5hbWUgKSB7XG5cdFx0XHRcdFx0bWF0Y2ggPSBjaGVja1NldFtlbGVtLnNpenNldF07XG5cdFx0XHRcdFx0YnJlYWs7XG5cdFx0XHRcdH1cblxuXHRcdFx0XHRpZiAoIGVsZW0ubm9kZVR5cGUgPT09IDEgKSB7XG5cdFx0XHRcdFx0aWYgKCAhaXNYTUwgKSB7XG5cdFx0XHRcdFx0XHRlbGVtWyBleHBhbmRvIF0gPSBkb25lTmFtZTtcblx0XHRcdFx0XHRcdGVsZW0uc2l6c2V0ID0gaTtcblx0XHRcdFx0XHR9XG5cblx0XHRcdFx0XHRpZiAoIHR5cGVvZiBjdXIgIT09IFwic3RyaW5nXCIgKSB7XG5cdFx0XHRcdFx0XHRpZiAoIGVsZW0gPT09IGN1ciApIHtcblx0XHRcdFx0XHRcdFx0bWF0Y2ggPSB0cnVlO1xuXHRcdFx0XHRcdFx0XHRicmVhaztcblx0XHRcdFx0XHRcdH1cblxuXHRcdFx0XHRcdH0gZWxzZSBpZiAoIFNpenpsZS5maWx0ZXIoIGN1ciwgW2VsZW1dICkubGVuZ3RoID4gMCApIHtcblx0XHRcdFx0XHRcdG1hdGNoID0gZWxlbTtcblx0XHRcdFx0XHRcdGJyZWFrO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0fVxuXG5cdFx0XHRcdGVsZW0gPSBlbGVtW2Rpcl07XG5cdFx0XHR9XG5cblx0XHRcdGNoZWNrU2V0W2ldID0gbWF0Y2g7XG5cdFx0fVxuXHR9XG59XG5cbmlmICggZG9jdW1lbnQuZG9jdW1lbnRFbGVtZW50LmNvbnRhaW5zICkge1xuXHRTaXp6bGUuY29udGFpbnMgPSBmdW5jdGlvbiggYSwgYiApIHtcblx0XHRyZXR1cm4gYSAhPT0gYiAmJiAoYS5jb250YWlucyA/IGEuY29udGFpbnMoYikgOiB0cnVlKTtcblx0fTtcblxufSBlbHNlIGlmICggZG9jdW1lbnQuZG9jdW1lbnRFbGVtZW50LmNvbXBhcmVEb2N1bWVudFBvc2l0aW9uICkge1xuXHRTaXp6bGUuY29udGFpbnMgPSBmdW5jdGlvbiggYSwgYiApIHtcblx0XHRyZXR1cm4gISEoYS5jb21wYXJlRG9jdW1lbnRQb3NpdGlvbihiKSAmIDE2KTtcblx0fTtcblxufSBlbHNlIHtcblx0U2l6emxlLmNvbnRhaW5zID0gZnVuY3Rpb24oKSB7XG5cdFx0cmV0dXJuIGZhbHNlO1xuXHR9O1xufVxuXG5TaXp6bGUuaXNYTUwgPSBmdW5jdGlvbiggZWxlbSApIHtcblx0Ly8gZG9jdW1lbnRFbGVtZW50IGlzIHZlcmlmaWVkIGZvciBjYXNlcyB3aGVyZSBpdCBkb2Vzbid0IHlldCBleGlzdFxuXHQvLyAoc3VjaCBhcyBsb2FkaW5nIGlmcmFtZXMgaW4gSUUgLSAjNDgzMykgXG5cdHZhciBkb2N1bWVudEVsZW1lbnQgPSAoZWxlbSA/IGVsZW0ub3duZXJEb2N1bWVudCB8fCBlbGVtIDogMCkuZG9jdW1lbnRFbGVtZW50O1xuXG5cdHJldHVybiBkb2N1bWVudEVsZW1lbnQgPyBkb2N1bWVudEVsZW1lbnQubm9kZU5hbWUgIT09IFwiSFRNTFwiIDogZmFsc2U7XG59O1xuXG52YXIgcG9zUHJvY2VzcyA9IGZ1bmN0aW9uKCBzZWxlY3RvciwgY29udGV4dCwgc2VlZCApIHtcblx0dmFyIG1hdGNoLFxuXHRcdHRtcFNldCA9IFtdLFxuXHRcdGxhdGVyID0gXCJcIixcblx0XHRyb290ID0gY29udGV4dC5ub2RlVHlwZSA/IFtjb250ZXh0XSA6IGNvbnRleHQ7XG5cblx0Ly8gUG9zaXRpb24gc2VsZWN0b3JzIG11c3QgYmUgZG9uZSBhZnRlciB0aGUgZmlsdGVyXG5cdC8vIEFuZCBzbyBtdXN0IDpub3QocG9zaXRpb25hbCkgc28gd2UgbW92ZSBhbGwgUFNFVURPcyB0byB0aGUgZW5kXG5cdHdoaWxlICggKG1hdGNoID0gRXhwci5tYXRjaC5QU0VVRE8uZXhlYyggc2VsZWN0b3IgKSkgKSB7XG5cdFx0bGF0ZXIgKz0gbWF0Y2hbMF07XG5cdFx0c2VsZWN0b3IgPSBzZWxlY3Rvci5yZXBsYWNlKCBFeHByLm1hdGNoLlBTRVVETywgXCJcIiApO1xuXHR9XG5cblx0c2VsZWN0b3IgPSBFeHByLnJlbGF0aXZlW3NlbGVjdG9yXSA/IHNlbGVjdG9yICsgXCIqXCIgOiBzZWxlY3RvcjtcblxuXHRmb3IgKCB2YXIgaSA9IDAsIGwgPSByb290Lmxlbmd0aDsgaSA8IGw7IGkrKyApIHtcblx0XHRTaXp6bGUoIHNlbGVjdG9yLCByb290W2ldLCB0bXBTZXQsIHNlZWQgKTtcblx0fVxuXG5cdHJldHVybiBTaXp6bGUuZmlsdGVyKCBsYXRlciwgdG1wU2V0ICk7XG59O1xuXG4vLyBFWFBPU0Vcbi8vIE92ZXJyaWRlIHNpenpsZSBhdHRyaWJ1dGUgcmV0cmlldmFsXG5TaXp6bGUuYXR0ciA9IGpRdWVyeS5hdHRyO1xuU2l6emxlLnNlbGVjdG9ycy5hdHRyTWFwID0ge307XG5qUXVlcnkuZmluZCA9IFNpenpsZTtcbmpRdWVyeS5leHByID0gU2l6emxlLnNlbGVjdG9ycztcbmpRdWVyeS5leHByW1wiOlwiXSA9IGpRdWVyeS5leHByLmZpbHRlcnM7XG5qUXVlcnkudW5pcXVlID0gU2l6emxlLnVuaXF1ZVNvcnQ7XG5qUXVlcnkudGV4dCA9IFNpenpsZS5nZXRUZXh0O1xualF1ZXJ5LmlzWE1MRG9jID0gU2l6emxlLmlzWE1MO1xualF1ZXJ5LmNvbnRhaW5zID0gU2l6emxlLmNvbnRhaW5zO1xuXG5cbn0pKCk7XG5cblxudmFyIHJ1bnRpbCA9IC9VbnRpbCQvLFxuXHRycGFyZW50c3ByZXYgPSAvXig/OnBhcmVudHN8cHJldlVudGlsfHByZXZBbGwpLyxcblx0Ly8gTm90ZTogVGhpcyBSZWdFeHAgc2hvdWxkIGJlIGltcHJvdmVkLCBvciBsaWtlbHkgcHVsbGVkIGZyb20gU2l6emxlXG5cdHJtdWx0aXNlbGVjdG9yID0gLywvLFxuXHRpc1NpbXBsZSA9IC9eLlteOiNcXFtcXC4sXSokLyxcblx0c2xpY2UgPSBBcnJheS5wcm90b3R5cGUuc2xpY2UsXG5cdFBPUyA9IGpRdWVyeS5leHByLm1hdGNoLlBPUyxcblx0Ly8gbWV0aG9kcyBndWFyYW50ZWVkIHRvIHByb2R1Y2UgYSB1bmlxdWUgc2V0IHdoZW4gc3RhcnRpbmcgZnJvbSBhIHVuaXF1ZSBzZXRcblx0Z3VhcmFudGVlZFVuaXF1ZSA9IHtcblx0XHRjaGlsZHJlbjogdHJ1ZSxcblx0XHRjb250ZW50czogdHJ1ZSxcblx0XHRuZXh0OiB0cnVlLFxuXHRcdHByZXY6IHRydWVcblx0fTtcblxualF1ZXJ5LmZuLmV4dGVuZCh7XG5cdGZpbmQ6IGZ1bmN0aW9uKCBzZWxlY3RvciApIHtcblx0XHR2YXIgc2VsZiA9IHRoaXMsXG5cdFx0XHRpLCBsO1xuXG5cdFx0aWYgKCB0eXBlb2Ygc2VsZWN0b3IgIT09IFwic3RyaW5nXCIgKSB7XG5cdFx0XHRyZXR1cm4galF1ZXJ5KCBzZWxlY3RvciApLmZpbHRlcihmdW5jdGlvbigpIHtcblx0XHRcdFx0Zm9yICggaSA9IDAsIGwgPSBzZWxmLmxlbmd0aDsgaSA8IGw7IGkrKyApIHtcblx0XHRcdFx0XHRpZiAoIGpRdWVyeS5jb250YWlucyggc2VsZlsgaSBdLCB0aGlzICkgKSB7XG5cdFx0XHRcdFx0XHRyZXR1cm4gdHJ1ZTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH1cblx0XHRcdH0pO1xuXHRcdH1cblxuXHRcdHZhciByZXQgPSB0aGlzLnB1c2hTdGFjayggXCJcIiwgXCJmaW5kXCIsIHNlbGVjdG9yICksXG5cdFx0XHRsZW5ndGgsIG4sIHI7XG5cblx0XHRmb3IgKCBpID0gMCwgbCA9IHRoaXMubGVuZ3RoOyBpIDwgbDsgaSsrICkge1xuXHRcdFx0bGVuZ3RoID0gcmV0Lmxlbmd0aDtcblx0XHRcdGpRdWVyeS5maW5kKCBzZWxlY3RvciwgdGhpc1tpXSwgcmV0ICk7XG5cblx0XHRcdGlmICggaSA+IDAgKSB7XG5cdFx0XHRcdC8vIE1ha2Ugc3VyZSB0aGF0IHRoZSByZXN1bHRzIGFyZSB1bmlxdWVcblx0XHRcdFx0Zm9yICggbiA9IGxlbmd0aDsgbiA8IHJldC5sZW5ndGg7IG4rKyApIHtcblx0XHRcdFx0XHRmb3IgKCByID0gMDsgciA8IGxlbmd0aDsgcisrICkge1xuXHRcdFx0XHRcdFx0aWYgKCByZXRbcl0gPT09IHJldFtuXSApIHtcblx0XHRcdFx0XHRcdFx0cmV0LnNwbGljZShuLS0sIDEpO1xuXHRcdFx0XHRcdFx0XHRicmVhaztcblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHR9XG5cdFx0XHRcdH1cblx0XHRcdH1cblx0XHR9XG5cblx0XHRyZXR1cm4gcmV0O1xuXHR9LFxuXG5cdGhhczogZnVuY3Rpb24oIHRhcmdldCApIHtcblx0XHR2YXIgdGFyZ2V0cyA9IGpRdWVyeSggdGFyZ2V0ICk7XG5cdFx0cmV0dXJuIHRoaXMuZmlsdGVyKGZ1bmN0aW9uKCkge1xuXHRcdFx0Zm9yICggdmFyIGkgPSAwLCBsID0gdGFyZ2V0cy5sZW5ndGg7IGkgPCBsOyBpKysgKSB7XG5cdFx0XHRcdGlmICggalF1ZXJ5LmNvbnRhaW5zKCB0aGlzLCB0YXJnZXRzW2ldICkgKSB7XG5cdFx0XHRcdFx0cmV0dXJuIHRydWU7XG5cdFx0XHRcdH1cblx0XHRcdH1cblx0XHR9KTtcblx0fSxcblxuXHRub3Q6IGZ1bmN0aW9uKCBzZWxlY3RvciApIHtcblx0XHRyZXR1cm4gdGhpcy5wdXNoU3RhY2soIHdpbm5vdyh0aGlzLCBzZWxlY3RvciwgZmFsc2UpLCBcIm5vdFwiLCBzZWxlY3Rvcik7XG5cdH0sXG5cblx0ZmlsdGVyOiBmdW5jdGlvbiggc2VsZWN0b3IgKSB7XG5cdFx0cmV0dXJuIHRoaXMucHVzaFN0YWNrKCB3aW5ub3codGhpcywgc2VsZWN0b3IsIHRydWUpLCBcImZpbHRlclwiLCBzZWxlY3RvciApO1xuXHR9LFxuXG5cdGlzOiBmdW5jdGlvbiggc2VsZWN0b3IgKSB7XG5cdFx0cmV0dXJuICEhc2VsZWN0b3IgJiYgKCBcblx0XHRcdHR5cGVvZiBzZWxlY3RvciA9PT0gXCJzdHJpbmdcIiA/XG5cdFx0XHRcdC8vIElmIHRoaXMgaXMgYSBwb3NpdGlvbmFsIHNlbGVjdG9yLCBjaGVjayBtZW1iZXJzaGlwIGluIHRoZSByZXR1cm5lZCBzZXRcblx0XHRcdFx0Ly8gc28gJChcInA6Zmlyc3RcIikuaXMoXCJwOmxhc3RcIikgd29uJ3QgcmV0dXJuIHRydWUgZm9yIGEgZG9jIHdpdGggdHdvIFwicFwiLlxuXHRcdFx0XHRQT1MudGVzdCggc2VsZWN0b3IgKSA/IFxuXHRcdFx0XHRcdGpRdWVyeSggc2VsZWN0b3IsIHRoaXMuY29udGV4dCApLmluZGV4KCB0aGlzWzBdICkgPj0gMCA6XG5cdFx0XHRcdFx0alF1ZXJ5LmZpbHRlciggc2VsZWN0b3IsIHRoaXMgKS5sZW5ndGggPiAwIDpcblx0XHRcdFx0dGhpcy5maWx0ZXIoIHNlbGVjdG9yICkubGVuZ3RoID4gMCApO1xuXHR9LFxuXG5cdGNsb3Nlc3Q6IGZ1bmN0aW9uKCBzZWxlY3RvcnMsIGNvbnRleHQgKSB7XG5cdFx0dmFyIHJldCA9IFtdLCBpLCBsLCBjdXIgPSB0aGlzWzBdO1xuXHRcdFxuXHRcdC8vIEFycmF5IChkZXByZWNhdGVkIGFzIG9mIGpRdWVyeSAxLjcpXG5cdFx0aWYgKCBqUXVlcnkuaXNBcnJheSggc2VsZWN0b3JzICkgKSB7XG5cdFx0XHR2YXIgbGV2ZWwgPSAxO1xuXG5cdFx0XHR3aGlsZSAoIGN1ciAmJiBjdXIub3duZXJEb2N1bWVudCAmJiBjdXIgIT09IGNvbnRleHQgKSB7XG5cdFx0XHRcdGZvciAoIGkgPSAwOyBpIDwgc2VsZWN0b3JzLmxlbmd0aDsgaSsrICkge1xuXG5cdFx0XHRcdFx0aWYgKCBqUXVlcnkoIGN1ciApLmlzKCBzZWxlY3RvcnNbIGkgXSApICkge1xuXHRcdFx0XHRcdFx0cmV0LnB1c2goeyBzZWxlY3Rvcjogc2VsZWN0b3JzWyBpIF0sIGVsZW06IGN1ciwgbGV2ZWw6IGxldmVsIH0pO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0fVxuXG5cdFx0XHRcdGN1ciA9IGN1ci5wYXJlbnROb2RlO1xuXHRcdFx0XHRsZXZlbCsrO1xuXHRcdFx0fVxuXG5cdFx0XHRyZXR1cm4gcmV0O1xuXHRcdH1cblxuXHRcdC8vIFN0cmluZ1xuXHRcdHZhciBwb3MgPSBQT1MudGVzdCggc2VsZWN0b3JzICkgfHwgdHlwZW9mIHNlbGVjdG9ycyAhPT0gXCJzdHJpbmdcIiA/XG5cdFx0XHRcdGpRdWVyeSggc2VsZWN0b3JzLCBjb250ZXh0IHx8IHRoaXMuY29udGV4dCApIDpcblx0XHRcdFx0MDtcblxuXHRcdGZvciAoIGkgPSAwLCBsID0gdGhpcy5sZW5ndGg7IGkgPCBsOyBpKysgKSB7XG5cdFx0XHRjdXIgPSB0aGlzW2ldO1xuXG5cdFx0XHR3aGlsZSAoIGN1ciApIHtcblx0XHRcdFx0aWYgKCBwb3MgPyBwb3MuaW5kZXgoY3VyKSA+IC0xIDogalF1ZXJ5LmZpbmQubWF0Y2hlc1NlbGVjdG9yKGN1ciwgc2VsZWN0b3JzKSApIHtcblx0XHRcdFx0XHRyZXQucHVzaCggY3VyICk7XG5cdFx0XHRcdFx0YnJlYWs7XG5cblx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHRjdXIgPSBjdXIucGFyZW50Tm9kZTtcblx0XHRcdFx0XHRpZiAoICFjdXIgfHwgIWN1ci5vd25lckRvY3VtZW50IHx8IGN1ciA9PT0gY29udGV4dCB8fCBjdXIubm9kZVR5cGUgPT09IDExICkge1xuXHRcdFx0XHRcdFx0YnJlYWs7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9XG5cdFx0XHR9XG5cdFx0fVxuXG5cdFx0cmV0ID0gcmV0Lmxlbmd0aCA+IDEgPyBqUXVlcnkudW5pcXVlKCByZXQgKSA6IHJldDtcblxuXHRcdHJldHVybiB0aGlzLnB1c2hTdGFjayggcmV0LCBcImNsb3Nlc3RcIiwgc2VsZWN0b3JzICk7XG5cdH0sXG5cblx0Ly8gRGV0ZXJtaW5lIHRoZSBwb3NpdGlvbiBvZiBhbiBlbGVtZW50IHdpdGhpblxuXHQvLyB0aGUgbWF0Y2hlZCBzZXQgb2YgZWxlbWVudHNcblx0aW5kZXg6IGZ1bmN0aW9uKCBlbGVtICkge1xuXG5cdFx0Ly8gTm8gYXJndW1lbnQsIHJldHVybiBpbmRleCBpbiBwYXJlbnRcblx0XHRpZiAoICFlbGVtICkge1xuXHRcdFx0cmV0dXJuICggdGhpc1swXSAmJiB0aGlzWzBdLnBhcmVudE5vZGUgKSA/IHRoaXMucHJldkFsbCgpLmxlbmd0aCA6IC0xO1xuXHRcdH1cblxuXHRcdC8vIGluZGV4IGluIHNlbGVjdG9yXG5cdFx0aWYgKCB0eXBlb2YgZWxlbSA9PT0gXCJzdHJpbmdcIiApIHtcblx0XHRcdHJldHVybiBqUXVlcnkuaW5BcnJheSggdGhpc1swXSwgalF1ZXJ5KCBlbGVtICkgKTtcblx0XHR9XG5cblx0XHQvLyBMb2NhdGUgdGhlIHBvc2l0aW9uIG9mIHRoZSBkZXNpcmVkIGVsZW1lbnRcblx0XHRyZXR1cm4galF1ZXJ5LmluQXJyYXkoXG5cdFx0XHQvLyBJZiBpdCByZWNlaXZlcyBhIGpRdWVyeSBvYmplY3QsIHRoZSBmaXJzdCBlbGVtZW50IGlzIHVzZWRcblx0XHRcdGVsZW0uanF1ZXJ5ID8gZWxlbVswXSA6IGVsZW0sIHRoaXMgKTtcblx0fSxcblxuXHRhZGQ6IGZ1bmN0aW9uKCBzZWxlY3RvciwgY29udGV4dCApIHtcblx0XHR2YXIgc2V0ID0gdHlwZW9mIHNlbGVjdG9yID09PSBcInN0cmluZ1wiID9cblx0XHRcdFx0alF1ZXJ5KCBzZWxlY3RvciwgY29udGV4dCApIDpcblx0XHRcdFx0alF1ZXJ5Lm1ha2VBcnJheSggc2VsZWN0b3IgJiYgc2VsZWN0b3Iubm9kZVR5cGUgPyBbIHNlbGVjdG9yIF0gOiBzZWxlY3RvciApLFxuXHRcdFx0YWxsID0galF1ZXJ5Lm1lcmdlKCB0aGlzLmdldCgpLCBzZXQgKTtcblxuXHRcdHJldHVybiB0aGlzLnB1c2hTdGFjayggaXNEaXNjb25uZWN0ZWQoIHNldFswXSApIHx8IGlzRGlzY29ubmVjdGVkKCBhbGxbMF0gKSA/XG5cdFx0XHRhbGwgOlxuXHRcdFx0alF1ZXJ5LnVuaXF1ZSggYWxsICkgKTtcblx0fSxcblxuXHRhbmRTZWxmOiBmdW5jdGlvbigpIHtcblx0XHRyZXR1cm4gdGhpcy5hZGQoIHRoaXMucHJldk9iamVjdCApO1xuXHR9XG59KTtcblxuLy8gQSBwYWluZnVsbHkgc2ltcGxlIGNoZWNrIHRvIHNlZSBpZiBhbiBlbGVtZW50IGlzIGRpc2Nvbm5lY3RlZFxuLy8gZnJvbSBhIGRvY3VtZW50IChzaG91bGQgYmUgaW1wcm92ZWQsIHdoZXJlIGZlYXNpYmxlKS5cbmZ1bmN0aW9uIGlzRGlzY29ubmVjdGVkKCBub2RlICkge1xuXHRyZXR1cm4gIW5vZGUgfHwgIW5vZGUucGFyZW50Tm9kZSB8fCBub2RlLnBhcmVudE5vZGUubm9kZVR5cGUgPT09IDExO1xufVxuXG5qUXVlcnkuZWFjaCh7XG5cdHBhcmVudDogZnVuY3Rpb24oIGVsZW0gKSB7XG5cdFx0dmFyIHBhcmVudCA9IGVsZW0ucGFyZW50Tm9kZTtcblx0XHRyZXR1cm4gcGFyZW50ICYmIHBhcmVudC5ub2RlVHlwZSAhPT0gMTEgPyBwYXJlbnQgOiBudWxsO1xuXHR9LFxuXHRwYXJlbnRzOiBmdW5jdGlvbiggZWxlbSApIHtcblx0XHRyZXR1cm4galF1ZXJ5LmRpciggZWxlbSwgXCJwYXJlbnROb2RlXCIgKTtcblx0fSxcblx0cGFyZW50c1VudGlsOiBmdW5jdGlvbiggZWxlbSwgaSwgdW50aWwgKSB7XG5cdFx0cmV0dXJuIGpRdWVyeS5kaXIoIGVsZW0sIFwicGFyZW50Tm9kZVwiLCB1bnRpbCApO1xuXHR9LFxuXHRuZXh0OiBmdW5jdGlvbiggZWxlbSApIHtcblx0XHRyZXR1cm4galF1ZXJ5Lm50aCggZWxlbSwgMiwgXCJuZXh0U2libGluZ1wiICk7XG5cdH0sXG5cdHByZXY6IGZ1bmN0aW9uKCBlbGVtICkge1xuXHRcdHJldHVybiBqUXVlcnkubnRoKCBlbGVtLCAyLCBcInByZXZpb3VzU2libGluZ1wiICk7XG5cdH0sXG5cdG5leHRBbGw6IGZ1bmN0aW9uKCBlbGVtICkge1xuXHRcdHJldHVybiBqUXVlcnkuZGlyKCBlbGVtLCBcIm5leHRTaWJsaW5nXCIgKTtcblx0fSxcblx0cHJldkFsbDogZnVuY3Rpb24oIGVsZW0gKSB7XG5cdFx0cmV0dXJuIGpRdWVyeS5kaXIoIGVsZW0sIFwicHJldmlvdXNTaWJsaW5nXCIgKTtcblx0fSxcblx0bmV4dFVudGlsOiBmdW5jdGlvbiggZWxlbSwgaSwgdW50aWwgKSB7XG5cdFx0cmV0dXJuIGpRdWVyeS5kaXIoIGVsZW0sIFwibmV4dFNpYmxpbmdcIiwgdW50aWwgKTtcblx0fSxcblx0cHJldlVudGlsOiBmdW5jdGlvbiggZWxlbSwgaSwgdW50aWwgKSB7XG5cdFx0cmV0dXJuIGpRdWVyeS5kaXIoIGVsZW0sIFwicHJldmlvdXNTaWJsaW5nXCIsIHVudGlsICk7XG5cdH0sXG5cdHNpYmxpbmdzOiBmdW5jdGlvbiggZWxlbSApIHtcblx0XHRyZXR1cm4galF1ZXJ5LnNpYmxpbmcoIGVsZW0ucGFyZW50Tm9kZS5maXJzdENoaWxkLCBlbGVtICk7XG5cdH0sXG5cdGNoaWxkcmVuOiBmdW5jdGlvbiggZWxlbSApIHtcblx0XHRyZXR1cm4galF1ZXJ5LnNpYmxpbmcoIGVsZW0uZmlyc3RDaGlsZCApO1xuXHR9LFxuXHRjb250ZW50czogZnVuY3Rpb24oIGVsZW0gKSB7XG5cdFx0cmV0dXJuIGpRdWVyeS5ub2RlTmFtZSggZWxlbSwgXCJpZnJhbWVcIiApID9cblx0XHRcdGVsZW0uY29udGVudERvY3VtZW50IHx8IGVsZW0uY29udGVudFdpbmRvdy5kb2N1bWVudCA6XG5cdFx0XHRqUXVlcnkubWFrZUFycmF5KCBlbGVtLmNoaWxkTm9kZXMgKTtcblx0fVxufSwgZnVuY3Rpb24oIG5hbWUsIGZuICkge1xuXHRqUXVlcnkuZm5bIG5hbWUgXSA9IGZ1bmN0aW9uKCB1bnRpbCwgc2VsZWN0b3IgKSB7XG5cdFx0dmFyIHJldCA9IGpRdWVyeS5tYXAoIHRoaXMsIGZuLCB1bnRpbCApLFxuXHRcdFx0Ly8gVGhlIHZhcmlhYmxlICdhcmdzJyB3YXMgaW50cm9kdWNlZCBpblxuXHRcdFx0Ly8gaHR0cHM6Ly9naXRodWIuY29tL2pxdWVyeS9qcXVlcnkvY29tbWl0LzUyYTAyMzhcblx0XHRcdC8vIHRvIHdvcmsgYXJvdW5kIGEgYnVnIGluIENocm9tZSAxMCAoRGV2KSBhbmQgc2hvdWxkIGJlIHJlbW92ZWQgd2hlbiB0aGUgYnVnIGlzIGZpeGVkLlxuXHRcdFx0Ly8gaHR0cDovL2NvZGUuZ29vZ2xlLmNvbS9wL3Y4L2lzc3Vlcy9kZXRhaWw/aWQ9MTA1MFxuXHRcdFx0YXJncyA9IHNsaWNlLmNhbGwoYXJndW1lbnRzKTtcblxuXHRcdGlmICggIXJ1bnRpbC50ZXN0KCBuYW1lICkgKSB7XG5cdFx0XHRzZWxlY3RvciA9IHVudGlsO1xuXHRcdH1cblxuXHRcdGlmICggc2VsZWN0b3IgJiYgdHlwZW9mIHNlbGVjdG9yID09PSBcInN0cmluZ1wiICkge1xuXHRcdFx0cmV0ID0galF1ZXJ5LmZpbHRlciggc2VsZWN0b3IsIHJldCApO1xuXHRcdH1cblxuXHRcdHJldCA9IHRoaXMubGVuZ3RoID4gMSAmJiAhZ3VhcmFudGVlZFVuaXF1ZVsgbmFtZSBdID8galF1ZXJ5LnVuaXF1ZSggcmV0ICkgOiByZXQ7XG5cblx0XHRpZiAoICh0aGlzLmxlbmd0aCA+IDEgfHwgcm11bHRpc2VsZWN0b3IudGVzdCggc2VsZWN0b3IgKSkgJiYgcnBhcmVudHNwcmV2LnRlc3QoIG5hbWUgKSApIHtcblx0XHRcdHJldCA9IHJldC5yZXZlcnNlKCk7XG5cdFx0fVxuXG5cdFx0cmV0dXJuIHRoaXMucHVzaFN0YWNrKCByZXQsIG5hbWUsIGFyZ3Muam9pbihcIixcIikgKTtcblx0fTtcbn0pO1xuXG5qUXVlcnkuZXh0ZW5kKHtcblx0ZmlsdGVyOiBmdW5jdGlvbiggZXhwciwgZWxlbXMsIG5vdCApIHtcblx0XHRpZiAoIG5vdCApIHtcblx0XHRcdGV4cHIgPSBcIjpub3QoXCIgKyBleHByICsgXCIpXCI7XG5cdFx0fVxuXG5cdFx0cmV0dXJuIGVsZW1zLmxlbmd0aCA9PT0gMSA/XG5cdFx0XHRqUXVlcnkuZmluZC5tYXRjaGVzU2VsZWN0b3IoZWxlbXNbMF0sIGV4cHIpID8gWyBlbGVtc1swXSBdIDogW10gOlxuXHRcdFx0alF1ZXJ5LmZpbmQubWF0Y2hlcyhleHByLCBlbGVtcyk7XG5cdH0sXG5cblx0ZGlyOiBmdW5jdGlvbiggZWxlbSwgZGlyLCB1bnRpbCApIHtcblx0XHR2YXIgbWF0Y2hlZCA9IFtdLFxuXHRcdFx0Y3VyID0gZWxlbVsgZGlyIF07XG5cblx0XHR3aGlsZSAoIGN1ciAmJiBjdXIubm9kZVR5cGUgIT09IDkgJiYgKHVudGlsID09PSB1bmRlZmluZWQgfHwgY3VyLm5vZGVUeXBlICE9PSAxIHx8ICFqUXVlcnkoIGN1ciApLmlzKCB1bnRpbCApKSApIHtcblx0XHRcdGlmICggY3VyLm5vZGVUeXBlID09PSAxICkge1xuXHRcdFx0XHRtYXRjaGVkLnB1c2goIGN1ciApO1xuXHRcdFx0fVxuXHRcdFx0Y3VyID0gY3VyW2Rpcl07XG5cdFx0fVxuXHRcdHJldHVybiBtYXRjaGVkO1xuXHR9LFxuXG5cdG50aDogZnVuY3Rpb24oIGN1ciwgcmVzdWx0LCBkaXIsIGVsZW0gKSB7XG5cdFx0cmVzdWx0ID0gcmVzdWx0IHx8IDE7XG5cdFx0dmFyIG51bSA9IDA7XG5cblx0XHRmb3IgKCA7IGN1cjsgY3VyID0gY3VyW2Rpcl0gKSB7XG5cdFx0XHRpZiAoIGN1ci5ub2RlVHlwZSA9PT0gMSAmJiArK251bSA9PT0gcmVzdWx0ICkge1xuXHRcdFx0XHRicmVhaztcblx0XHRcdH1cblx0XHR9XG5cblx0XHRyZXR1cm4gY3VyO1xuXHR9LFxuXG5cdHNpYmxpbmc6IGZ1bmN0aW9uKCBuLCBlbGVtICkge1xuXHRcdHZhciByID0gW107XG5cblx0XHRmb3IgKCA7IG47IG4gPSBuLm5leHRTaWJsaW5nICkge1xuXHRcdFx0aWYgKCBuLm5vZGVUeXBlID09PSAxICYmIG4gIT09IGVsZW0gKSB7XG5cdFx0XHRcdHIucHVzaCggbiApO1xuXHRcdFx0fVxuXHRcdH1cblxuXHRcdHJldHVybiByO1xuXHR9XG59KTtcblxuLy8gSW1wbGVtZW50IHRoZSBpZGVudGljYWwgZnVuY3Rpb25hbGl0eSBmb3IgZmlsdGVyIGFuZCBub3RcbmZ1bmN0aW9uIHdpbm5vdyggZWxlbWVudHMsIHF1YWxpZmllciwga2VlcCApIHtcblxuXHQvLyBDYW4ndCBwYXNzIG51bGwgb3IgdW5kZWZpbmVkIHRvIGluZGV4T2YgaW4gRmlyZWZveCA0XG5cdC8vIFNldCB0byAwIHRvIHNraXAgc3RyaW5nIGNoZWNrXG5cdHF1YWxpZmllciA9IHF1YWxpZmllciB8fCAwO1xuXG5cdGlmICggalF1ZXJ5LmlzRnVuY3Rpb24oIHF1YWxpZmllciApICkge1xuXHRcdHJldHVybiBqUXVlcnkuZ3JlcChlbGVtZW50cywgZnVuY3Rpb24oIGVsZW0sIGkgKSB7XG5cdFx0XHR2YXIgcmV0VmFsID0gISFxdWFsaWZpZXIuY2FsbCggZWxlbSwgaSwgZWxlbSApO1xuXHRcdFx0cmV0dXJuIHJldFZhbCA9PT0ga2VlcDtcblx0XHR9KTtcblxuXHR9IGVsc2UgaWYgKCBxdWFsaWZpZXIubm9kZVR5cGUgKSB7XG5cdFx0cmV0dXJuIGpRdWVyeS5ncmVwKGVsZW1lbnRzLCBmdW5jdGlvbiggZWxlbSwgaSApIHtcblx0XHRcdHJldHVybiAoZWxlbSA9PT0gcXVhbGlmaWVyKSA9PT0ga2VlcDtcblx0XHR9KTtcblxuXHR9IGVsc2UgaWYgKCB0eXBlb2YgcXVhbGlmaWVyID09PSBcInN0cmluZ1wiICkge1xuXHRcdHZhciBmaWx0ZXJlZCA9IGpRdWVyeS5ncmVwKGVsZW1lbnRzLCBmdW5jdGlvbiggZWxlbSApIHtcblx0XHRcdHJldHVybiBlbGVtLm5vZGVUeXBlID09PSAxO1xuXHRcdH0pO1xuXG5cdFx0aWYgKCBpc1NpbXBsZS50ZXN0KCBxdWFsaWZpZXIgKSApIHtcblx0XHRcdHJldHVybiBqUXVlcnkuZmlsdGVyKHF1YWxpZmllciwgZmlsdGVyZWQsICFrZWVwKTtcblx0XHR9IGVsc2Uge1xuXHRcdFx0cXVhbGlmaWVyID0galF1ZXJ5LmZpbHRlciggcXVhbGlmaWVyLCBmaWx0ZXJlZCApO1xuXHRcdH1cblx0fVxuXG5cdHJldHVybiBqUXVlcnkuZ3JlcChlbGVtZW50cywgZnVuY3Rpb24oIGVsZW0sIGkgKSB7XG5cdFx0cmV0dXJuIChqUXVlcnkuaW5BcnJheSggZWxlbSwgcXVhbGlmaWVyICkgPj0gMCkgPT09IGtlZXA7XG5cdH0pO1xufVxuXG5cblxuXG5mdW5jdGlvbiBjcmVhdGVTYWZlRnJhZ21lbnQoIGRvY3VtZW50ICkge1xuXHR2YXIgbm9kZU5hbWVzID0gKFxuXHRcdFwiYWJiciBhcnRpY2xlIGFzaWRlIGF1ZGlvIGNhbnZhcyBkYXRhbGlzdCBkZXRhaWxzIGZpZ2NhcHRpb24gZmlndXJlIGZvb3RlciBcIiArXG5cdFx0XCJoZWFkZXIgaGdyb3VwIG1hcmsgbWV0ZXIgbmF2IG91dHB1dCBwcm9ncmVzcyBzZWN0aW9uIHN1bW1hcnkgdGltZSB2aWRlb1wiXG5cdCkuc3BsaXQoIFwiIFwiICksXG5cdHNhZmVGcmFnID0gZG9jdW1lbnQuY3JlYXRlRG9jdW1lbnRGcmFnbWVudCgpO1xuXG5cdGlmICggc2FmZUZyYWcuY3JlYXRlRWxlbWVudCApIHtcblx0XHR3aGlsZSAoIG5vZGVOYW1lcy5sZW5ndGggKSB7XG5cdFx0XHRzYWZlRnJhZy5jcmVhdGVFbGVtZW50KFxuXHRcdFx0XHRub2RlTmFtZXMucG9wKClcblx0XHRcdCk7XG5cdFx0fVxuXHR9XG5cdHJldHVybiBzYWZlRnJhZztcbn1cblxudmFyIHJpbmxpbmVqUXVlcnkgPSAvIGpRdWVyeVxcZCs9XCIoPzpcXGQrfG51bGwpXCIvZyxcblx0cmxlYWRpbmdXaGl0ZXNwYWNlID0gL15cXHMrLyxcblx0cnhodG1sVGFnID0gLzwoPyFhcmVhfGJyfGNvbHxlbWJlZHxocnxpbWd8aW5wdXR8bGlua3xtZXRhfHBhcmFtKSgoW1xcdzpdKylbXj5dKilcXC8+L2lnLFxuXHRydGFnTmFtZSA9IC88KFtcXHc6XSspLyxcblx0cnRib2R5ID0gLzx0Ym9keS9pLFxuXHRyaHRtbCA9IC88fCYjP1xcdys7Lyxcblx0cm5vSW5uZXJodG1sID0gLzwoPzpzY3JpcHR8c3R5bGUpL2ksXG5cdHJub2NhY2hlID0gLzwoPzpzY3JpcHR8b2JqZWN0fGVtYmVkfG9wdGlvbnxzdHlsZSkvaSxcblx0Ly8gY2hlY2tlZD1cImNoZWNrZWRcIiBvciBjaGVja2VkXG5cdHJjaGVja2VkID0gL2NoZWNrZWRcXHMqKD86W149XXw9XFxzKi5jaGVja2VkLikvaSxcblx0cnNjcmlwdFR5cGUgPSAvXFwvKGphdmF8ZWNtYSlzY3JpcHQvaSxcblx0cmNsZWFuU2NyaXB0ID0gL15cXHMqPCEoPzpcXFtDREFUQVxcW3xcXC1cXC0pLyxcblx0d3JhcE1hcCA9IHtcblx0XHRvcHRpb246IFsgMSwgXCI8c2VsZWN0IG11bHRpcGxlPSdtdWx0aXBsZSc+XCIsIFwiPC9zZWxlY3Q+XCIgXSxcblx0XHRsZWdlbmQ6IFsgMSwgXCI8ZmllbGRzZXQ+XCIsIFwiPC9maWVsZHNldD5cIiBdLFxuXHRcdHRoZWFkOiBbIDEsIFwiPHRhYmxlPlwiLCBcIjwvdGFibGU+XCIgXSxcblx0XHR0cjogWyAyLCBcIjx0YWJsZT48dGJvZHk+XCIsIFwiPC90Ym9keT48L3RhYmxlPlwiIF0sXG5cdFx0dGQ6IFsgMywgXCI8dGFibGU+PHRib2R5Pjx0cj5cIiwgXCI8L3RyPjwvdGJvZHk+PC90YWJsZT5cIiBdLFxuXHRcdGNvbDogWyAyLCBcIjx0YWJsZT48dGJvZHk+PC90Ym9keT48Y29sZ3JvdXA+XCIsIFwiPC9jb2xncm91cD48L3RhYmxlPlwiIF0sXG5cdFx0YXJlYTogWyAxLCBcIjxtYXA+XCIsIFwiPC9tYXA+XCIgXSxcblx0XHRfZGVmYXVsdDogWyAwLCBcIlwiLCBcIlwiIF1cblx0fSxcblx0c2FmZUZyYWdtZW50ID0gY3JlYXRlU2FmZUZyYWdtZW50KCBkb2N1bWVudCApO1xuXG53cmFwTWFwLm9wdGdyb3VwID0gd3JhcE1hcC5vcHRpb247XG53cmFwTWFwLnRib2R5ID0gd3JhcE1hcC50Zm9vdCA9IHdyYXBNYXAuY29sZ3JvdXAgPSB3cmFwTWFwLmNhcHRpb24gPSB3cmFwTWFwLnRoZWFkO1xud3JhcE1hcC50aCA9IHdyYXBNYXAudGQ7XG5cbi8vIElFIGNhbid0IHNlcmlhbGl6ZSA8bGluaz4gYW5kIDxzY3JpcHQ+IHRhZ3Mgbm9ybWFsbHlcbmlmICggIWpRdWVyeS5zdXBwb3J0Lmh0bWxTZXJpYWxpemUgKSB7XG5cdHdyYXBNYXAuX2RlZmF1bHQgPSBbIDEsIFwiZGl2PGRpdj5cIiwgXCI8L2Rpdj5cIiBdO1xufVxuXG5qUXVlcnkuZm4uZXh0ZW5kKHtcblx0dGV4dDogZnVuY3Rpb24oIHRleHQgKSB7XG5cdFx0aWYgKCBqUXVlcnkuaXNGdW5jdGlvbih0ZXh0KSApIHtcblx0XHRcdHJldHVybiB0aGlzLmVhY2goZnVuY3Rpb24oaSkge1xuXHRcdFx0XHR2YXIgc2VsZiA9IGpRdWVyeSggdGhpcyApO1xuXG5cdFx0XHRcdHNlbGYudGV4dCggdGV4dC5jYWxsKHRoaXMsIGksIHNlbGYudGV4dCgpKSApO1xuXHRcdFx0fSk7XG5cdFx0fVxuXG5cdFx0aWYgKCB0eXBlb2YgdGV4dCAhPT0gXCJvYmplY3RcIiAmJiB0ZXh0ICE9PSB1bmRlZmluZWQgKSB7XG5cdFx0XHRyZXR1cm4gdGhpcy5lbXB0eSgpLmFwcGVuZCggKHRoaXNbMF0gJiYgdGhpc1swXS5vd25lckRvY3VtZW50IHx8IGRvY3VtZW50KS5jcmVhdGVUZXh0Tm9kZSggdGV4dCApICk7XG5cdFx0fVxuXG5cdFx0cmV0dXJuIGpRdWVyeS50ZXh0KCB0aGlzICk7XG5cdH0sXG5cblx0d3JhcEFsbDogZnVuY3Rpb24oIGh0bWwgKSB7XG5cdFx0aWYgKCBqUXVlcnkuaXNGdW5jdGlvbiggaHRtbCApICkge1xuXHRcdFx0cmV0dXJuIHRoaXMuZWFjaChmdW5jdGlvbihpKSB7XG5cdFx0XHRcdGpRdWVyeSh0aGlzKS53cmFwQWxsKCBodG1sLmNhbGwodGhpcywgaSkgKTtcblx0XHRcdH0pO1xuXHRcdH1cblxuXHRcdGlmICggdGhpc1swXSApIHtcblx0XHRcdC8vIFRoZSBlbGVtZW50cyB0byB3cmFwIHRoZSB0YXJnZXQgYXJvdW5kXG5cdFx0XHR2YXIgd3JhcCA9IGpRdWVyeSggaHRtbCwgdGhpc1swXS5vd25lckRvY3VtZW50ICkuZXEoMCkuY2xvbmUodHJ1ZSk7XG5cblx0XHRcdGlmICggdGhpc1swXS5wYXJlbnROb2RlICkge1xuXHRcdFx0XHR3cmFwLmluc2VydEJlZm9yZSggdGhpc1swXSApO1xuXHRcdFx0fVxuXG5cdFx0XHR3cmFwLm1hcChmdW5jdGlvbigpIHtcblx0XHRcdFx0dmFyIGVsZW0gPSB0aGlzO1xuXG5cdFx0XHRcdHdoaWxlICggZWxlbS5maXJzdENoaWxkICYmIGVsZW0uZmlyc3RDaGlsZC5ub2RlVHlwZSA9PT0gMSApIHtcblx0XHRcdFx0XHRlbGVtID0gZWxlbS5maXJzdENoaWxkO1xuXHRcdFx0XHR9XG5cblx0XHRcdFx0cmV0dXJuIGVsZW07XG5cdFx0XHR9KS5hcHBlbmQoIHRoaXMgKTtcblx0XHR9XG5cblx0XHRyZXR1cm4gdGhpcztcblx0fSxcblxuXHR3cmFwSW5uZXI6IGZ1bmN0aW9uKCBodG1sICkge1xuXHRcdGlmICggalF1ZXJ5LmlzRnVuY3Rpb24oIGh0bWwgKSApIHtcblx0XHRcdHJldHVybiB0aGlzLmVhY2goZnVuY3Rpb24oaSkge1xuXHRcdFx0XHRqUXVlcnkodGhpcykud3JhcElubmVyKCBodG1sLmNhbGwodGhpcywgaSkgKTtcblx0XHRcdH0pO1xuXHRcdH1cblxuXHRcdHJldHVybiB0aGlzLmVhY2goZnVuY3Rpb24oKSB7XG5cdFx0XHR2YXIgc2VsZiA9IGpRdWVyeSggdGhpcyApLFxuXHRcdFx0XHRjb250ZW50cyA9IHNlbGYuY29udGVudHMoKTtcblxuXHRcdFx0aWYgKCBjb250ZW50cy5sZW5ndGggKSB7XG5cdFx0XHRcdGNvbnRlbnRzLndyYXBBbGwoIGh0bWwgKTtcblxuXHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0c2VsZi5hcHBlbmQoIGh0bWwgKTtcblx0XHRcdH1cblx0XHR9KTtcblx0fSxcblxuXHR3cmFwOiBmdW5jdGlvbiggaHRtbCApIHtcblx0XHRyZXR1cm4gdGhpcy5lYWNoKGZ1bmN0aW9uKCkge1xuXHRcdFx0alF1ZXJ5KCB0aGlzICkud3JhcEFsbCggaHRtbCApO1xuXHRcdH0pO1xuXHR9LFxuXG5cdHVud3JhcDogZnVuY3Rpb24oKSB7XG5cdFx0cmV0dXJuIHRoaXMucGFyZW50KCkuZWFjaChmdW5jdGlvbigpIHtcblx0XHRcdGlmICggIWpRdWVyeS5ub2RlTmFtZSggdGhpcywgXCJib2R5XCIgKSApIHtcblx0XHRcdFx0alF1ZXJ5KCB0aGlzICkucmVwbGFjZVdpdGgoIHRoaXMuY2hpbGROb2RlcyApO1xuXHRcdFx0fVxuXHRcdH0pLmVuZCgpO1xuXHR9LFxuXG5cdGFwcGVuZDogZnVuY3Rpb24oKSB7XG5cdFx0cmV0dXJuIHRoaXMuZG9tTWFuaXAoYXJndW1lbnRzLCB0cnVlLCBmdW5jdGlvbiggZWxlbSApIHtcblx0XHRcdGlmICggdGhpcy5ub2RlVHlwZSA9PT0gMSApIHtcblx0XHRcdFx0dGhpcy5hcHBlbmRDaGlsZCggZWxlbSApO1xuXHRcdFx0fVxuXHRcdH0pO1xuXHR9LFxuXG5cdHByZXBlbmQ6IGZ1bmN0aW9uKCkge1xuXHRcdHJldHVybiB0aGlzLmRvbU1hbmlwKGFyZ3VtZW50cywgdHJ1ZSwgZnVuY3Rpb24oIGVsZW0gKSB7XG5cdFx0XHRpZiAoIHRoaXMubm9kZVR5cGUgPT09IDEgKSB7XG5cdFx0XHRcdHRoaXMuaW5zZXJ0QmVmb3JlKCBlbGVtLCB0aGlzLmZpcnN0Q2hpbGQgKTtcblx0XHRcdH1cblx0XHR9KTtcblx0fSxcblxuXHRiZWZvcmU6IGZ1bmN0aW9uKCkge1xuXHRcdGlmICggdGhpc1swXSAmJiB0aGlzWzBdLnBhcmVudE5vZGUgKSB7XG5cdFx0XHRyZXR1cm4gdGhpcy5kb21NYW5pcChhcmd1bWVudHMsIGZhbHNlLCBmdW5jdGlvbiggZWxlbSApIHtcblx0XHRcdFx0dGhpcy5wYXJlbnROb2RlLmluc2VydEJlZm9yZSggZWxlbSwgdGhpcyApO1xuXHRcdFx0fSk7XG5cdFx0fSBlbHNlIGlmICggYXJndW1lbnRzLmxlbmd0aCApIHtcblx0XHRcdHZhciBzZXQgPSBqUXVlcnkoYXJndW1lbnRzWzBdKTtcblx0XHRcdHNldC5wdXNoLmFwcGx5KCBzZXQsIHRoaXMudG9BcnJheSgpICk7XG5cdFx0XHRyZXR1cm4gdGhpcy5wdXNoU3RhY2soIHNldCwgXCJiZWZvcmVcIiwgYXJndW1lbnRzICk7XG5cdFx0fVxuXHR9LFxuXG5cdGFmdGVyOiBmdW5jdGlvbigpIHtcblx0XHRpZiAoIHRoaXNbMF0gJiYgdGhpc1swXS5wYXJlbnROb2RlICkge1xuXHRcdFx0cmV0dXJuIHRoaXMuZG9tTWFuaXAoYXJndW1lbnRzLCBmYWxzZSwgZnVuY3Rpb24oIGVsZW0gKSB7XG5cdFx0XHRcdHRoaXMucGFyZW50Tm9kZS5pbnNlcnRCZWZvcmUoIGVsZW0sIHRoaXMubmV4dFNpYmxpbmcgKTtcblx0XHRcdH0pO1xuXHRcdH0gZWxzZSBpZiAoIGFyZ3VtZW50cy5sZW5ndGggKSB7XG5cdFx0XHR2YXIgc2V0ID0gdGhpcy5wdXNoU3RhY2soIHRoaXMsIFwiYWZ0ZXJcIiwgYXJndW1lbnRzICk7XG5cdFx0XHRzZXQucHVzaC5hcHBseSggc2V0LCBqUXVlcnkoYXJndW1lbnRzWzBdKS50b0FycmF5KCkgKTtcblx0XHRcdHJldHVybiBzZXQ7XG5cdFx0fVxuXHR9LFxuXG5cdC8vIGtlZXBEYXRhIGlzIGZvciBpbnRlcm5hbCB1c2Ugb25seS0tZG8gbm90IGRvY3VtZW50XG5cdHJlbW92ZTogZnVuY3Rpb24oIHNlbGVjdG9yLCBrZWVwRGF0YSApIHtcblx0XHRmb3IgKCB2YXIgaSA9IDAsIGVsZW07IChlbGVtID0gdGhpc1tpXSkgIT0gbnVsbDsgaSsrICkge1xuXHRcdFx0aWYgKCAhc2VsZWN0b3IgfHwgalF1ZXJ5LmZpbHRlciggc2VsZWN0b3IsIFsgZWxlbSBdICkubGVuZ3RoICkge1xuXHRcdFx0XHRpZiAoICFrZWVwRGF0YSAmJiBlbGVtLm5vZGVUeXBlID09PSAxICkge1xuXHRcdFx0XHRcdGpRdWVyeS5jbGVhbkRhdGEoIGVsZW0uZ2V0RWxlbWVudHNCeVRhZ05hbWUoXCIqXCIpICk7XG5cdFx0XHRcdFx0alF1ZXJ5LmNsZWFuRGF0YSggWyBlbGVtIF0gKTtcblx0XHRcdFx0fVxuXG5cdFx0XHRcdGlmICggZWxlbS5wYXJlbnROb2RlICkge1xuXHRcdFx0XHRcdGVsZW0ucGFyZW50Tm9kZS5yZW1vdmVDaGlsZCggZWxlbSApO1xuXHRcdFx0XHR9XG5cdFx0XHR9XG5cdFx0fVxuXG5cdFx0cmV0dXJuIHRoaXM7XG5cdH0sXG5cblx0ZW1wdHk6IGZ1bmN0aW9uKCkge1xuXHRcdGZvciAoIHZhciBpID0gMCwgZWxlbTsgKGVsZW0gPSB0aGlzW2ldKSAhPSBudWxsOyBpKysgKSB7XG5cdFx0XHQvLyBSZW1vdmUgZWxlbWVudCBub2RlcyBhbmQgcHJldmVudCBtZW1vcnkgbGVha3Ncblx0XHRcdGlmICggZWxlbS5ub2RlVHlwZSA9PT0gMSApIHtcblx0XHRcdFx0alF1ZXJ5LmNsZWFuRGF0YSggZWxlbS5nZXRFbGVtZW50c0J5VGFnTmFtZShcIipcIikgKTtcblx0XHRcdH1cblxuXHRcdFx0Ly8gUmVtb3ZlIGFueSByZW1haW5pbmcgbm9kZXNcblx0XHRcdHdoaWxlICggZWxlbS5maXJzdENoaWxkICkge1xuXHRcdFx0XHRlbGVtLnJlbW92ZUNoaWxkKCBlbGVtLmZpcnN0Q2hpbGQgKTtcblx0XHRcdH1cblx0XHR9XG5cblx0XHRyZXR1cm4gdGhpcztcblx0fSxcblxuXHRjbG9uZTogZnVuY3Rpb24oIGRhdGFBbmRFdmVudHMsIGRlZXBEYXRhQW5kRXZlbnRzICkge1xuXHRcdGRhdGFBbmRFdmVudHMgPSBkYXRhQW5kRXZlbnRzID09IG51bGwgPyBmYWxzZSA6IGRhdGFBbmRFdmVudHM7XG5cdFx0ZGVlcERhdGFBbmRFdmVudHMgPSBkZWVwRGF0YUFuZEV2ZW50cyA9PSBudWxsID8gZGF0YUFuZEV2ZW50cyA6IGRlZXBEYXRhQW5kRXZlbnRzO1xuXG5cdFx0cmV0dXJuIHRoaXMubWFwKCBmdW5jdGlvbiAoKSB7XG5cdFx0XHRyZXR1cm4galF1ZXJ5LmNsb25lKCB0aGlzLCBkYXRhQW5kRXZlbnRzLCBkZWVwRGF0YUFuZEV2ZW50cyApO1xuXHRcdH0pO1xuXHR9LFxuXG5cdGh0bWw6IGZ1bmN0aW9uKCB2YWx1ZSApIHtcblx0XHRpZiAoIHZhbHVlID09PSB1bmRlZmluZWQgKSB7XG5cdFx0XHRyZXR1cm4gdGhpc1swXSAmJiB0aGlzWzBdLm5vZGVUeXBlID09PSAxID9cblx0XHRcdFx0dGhpc1swXS5pbm5lckhUTUwucmVwbGFjZShyaW5saW5lalF1ZXJ5LCBcIlwiKSA6XG5cdFx0XHRcdG51bGw7XG5cblx0XHQvLyBTZWUgaWYgd2UgY2FuIHRha2UgYSBzaG9ydGN1dCBhbmQganVzdCB1c2UgaW5uZXJIVE1MXG5cdFx0fSBlbHNlIGlmICggdHlwZW9mIHZhbHVlID09PSBcInN0cmluZ1wiICYmICFybm9Jbm5lcmh0bWwudGVzdCggdmFsdWUgKSAmJlxuXHRcdFx0KGpRdWVyeS5zdXBwb3J0LmxlYWRpbmdXaGl0ZXNwYWNlIHx8ICFybGVhZGluZ1doaXRlc3BhY2UudGVzdCggdmFsdWUgKSkgJiZcblx0XHRcdCF3cmFwTWFwWyAocnRhZ05hbWUuZXhlYyggdmFsdWUgKSB8fCBbXCJcIiwgXCJcIl0pWzFdLnRvTG93ZXJDYXNlKCkgXSApIHtcblxuXHRcdFx0dmFsdWUgPSB2YWx1ZS5yZXBsYWNlKHJ4aHRtbFRhZywgXCI8JDE+PC8kMj5cIik7XG5cblx0XHRcdHRyeSB7XG5cdFx0XHRcdGZvciAoIHZhciBpID0gMCwgbCA9IHRoaXMubGVuZ3RoOyBpIDwgbDsgaSsrICkge1xuXHRcdFx0XHRcdC8vIFJlbW92ZSBlbGVtZW50IG5vZGVzIGFuZCBwcmV2ZW50IG1lbW9yeSBsZWFrc1xuXHRcdFx0XHRcdGlmICggdGhpc1tpXS5ub2RlVHlwZSA9PT0gMSApIHtcblx0XHRcdFx0XHRcdGpRdWVyeS5jbGVhbkRhdGEoIHRoaXNbaV0uZ2V0RWxlbWVudHNCeVRhZ05hbWUoXCIqXCIpICk7XG5cdFx0XHRcdFx0XHR0aGlzW2ldLmlubmVySFRNTCA9IHZhbHVlO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0fVxuXG5cdFx0XHQvLyBJZiB1c2luZyBpbm5lckhUTUwgdGhyb3dzIGFuIGV4Y2VwdGlvbiwgdXNlIHRoZSBmYWxsYmFjayBtZXRob2Rcblx0XHRcdH0gY2F0Y2goZSkge1xuXHRcdFx0XHR0aGlzLmVtcHR5KCkuYXBwZW5kKCB2YWx1ZSApO1xuXHRcdFx0fVxuXG5cdFx0fSBlbHNlIGlmICggalF1ZXJ5LmlzRnVuY3Rpb24oIHZhbHVlICkgKSB7XG5cdFx0XHR0aGlzLmVhY2goZnVuY3Rpb24oaSl7XG5cdFx0XHRcdHZhciBzZWxmID0galF1ZXJ5KCB0aGlzICk7XG5cblx0XHRcdFx0c2VsZi5odG1sKCB2YWx1ZS5jYWxsKHRoaXMsIGksIHNlbGYuaHRtbCgpKSApO1xuXHRcdFx0fSk7XG5cblx0XHR9IGVsc2Uge1xuXHRcdFx0dGhpcy5lbXB0eSgpLmFwcGVuZCggdmFsdWUgKTtcblx0XHR9XG5cblx0XHRyZXR1cm4gdGhpcztcblx0fSxcblxuXHRyZXBsYWNlV2l0aDogZnVuY3Rpb24oIHZhbHVlICkge1xuXHRcdGlmICggdGhpc1swXSAmJiB0aGlzWzBdLnBhcmVudE5vZGUgKSB7XG5cdFx0XHQvLyBNYWtlIHN1cmUgdGhhdCB0aGUgZWxlbWVudHMgYXJlIHJlbW92ZWQgZnJvbSB0aGUgRE9NIGJlZm9yZSB0aGV5IGFyZSBpbnNlcnRlZFxuXHRcdFx0Ly8gdGhpcyBjYW4gaGVscCBmaXggcmVwbGFjaW5nIGEgcGFyZW50IHdpdGggY2hpbGQgZWxlbWVudHNcblx0XHRcdGlmICggalF1ZXJ5LmlzRnVuY3Rpb24oIHZhbHVlICkgKSB7XG5cdFx0XHRcdHJldHVybiB0aGlzLmVhY2goZnVuY3Rpb24oaSkge1xuXHRcdFx0XHRcdHZhciBzZWxmID0galF1ZXJ5KHRoaXMpLCBvbGQgPSBzZWxmLmh0bWwoKTtcblx0XHRcdFx0XHRzZWxmLnJlcGxhY2VXaXRoKCB2YWx1ZS5jYWxsKCB0aGlzLCBpLCBvbGQgKSApO1xuXHRcdFx0XHR9KTtcblx0XHRcdH1cblxuXHRcdFx0aWYgKCB0eXBlb2YgdmFsdWUgIT09IFwic3RyaW5nXCIgKSB7XG5cdFx0XHRcdHZhbHVlID0galF1ZXJ5KCB2YWx1ZSApLmRldGFjaCgpO1xuXHRcdFx0fVxuXG5cdFx0XHRyZXR1cm4gdGhpcy5lYWNoKGZ1bmN0aW9uKCkge1xuXHRcdFx0XHR2YXIgbmV4dCA9IHRoaXMubmV4dFNpYmxpbmcsXG5cdFx0XHRcdFx0cGFyZW50ID0gdGhpcy5wYXJlbnROb2RlO1xuXG5cdFx0XHRcdGpRdWVyeSggdGhpcyApLnJlbW92ZSgpO1xuXG5cdFx0XHRcdGlmICggbmV4dCApIHtcblx0XHRcdFx0XHRqUXVlcnkobmV4dCkuYmVmb3JlKCB2YWx1ZSApO1xuXHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdGpRdWVyeShwYXJlbnQpLmFwcGVuZCggdmFsdWUgKTtcblx0XHRcdFx0fVxuXHRcdFx0fSk7XG5cdFx0fSBlbHNlIHtcblx0XHRcdHJldHVybiB0aGlzLmxlbmd0aCA/XG5cdFx0XHRcdHRoaXMucHVzaFN0YWNrKCBqUXVlcnkoalF1ZXJ5LmlzRnVuY3Rpb24odmFsdWUpID8gdmFsdWUoKSA6IHZhbHVlKSwgXCJyZXBsYWNlV2l0aFwiLCB2YWx1ZSApIDpcblx0XHRcdFx0dGhpcztcblx0XHR9XG5cdH0sXG5cblx0ZGV0YWNoOiBmdW5jdGlvbiggc2VsZWN0b3IgKSB7XG5cdFx0cmV0dXJuIHRoaXMucmVtb3ZlKCBzZWxlY3RvciwgdHJ1ZSApO1xuXHR9LFxuXG5cdGRvbU1hbmlwOiBmdW5jdGlvbiggYXJncywgdGFibGUsIGNhbGxiYWNrICkge1xuXHRcdHZhciByZXN1bHRzLCBmaXJzdCwgZnJhZ21lbnQsIHBhcmVudCxcblx0XHRcdHZhbHVlID0gYXJnc1swXSxcblx0XHRcdHNjcmlwdHMgPSBbXTtcblxuXHRcdC8vIFdlIGNhbid0IGNsb25lTm9kZSBmcmFnbWVudHMgdGhhdCBjb250YWluIGNoZWNrZWQsIGluIFdlYktpdFxuXHRcdGlmICggIWpRdWVyeS5zdXBwb3J0LmNoZWNrQ2xvbmUgJiYgYXJndW1lbnRzLmxlbmd0aCA9PT0gMyAmJiB0eXBlb2YgdmFsdWUgPT09IFwic3RyaW5nXCIgJiYgcmNoZWNrZWQudGVzdCggdmFsdWUgKSApIHtcblx0XHRcdHJldHVybiB0aGlzLmVhY2goZnVuY3Rpb24oKSB7XG5cdFx0XHRcdGpRdWVyeSh0aGlzKS5kb21NYW5pcCggYXJncywgdGFibGUsIGNhbGxiYWNrLCB0cnVlICk7XG5cdFx0XHR9KTtcblx0XHR9XG5cblx0XHRpZiAoIGpRdWVyeS5pc0Z1bmN0aW9uKHZhbHVlKSApIHtcblx0XHRcdHJldHVybiB0aGlzLmVhY2goZnVuY3Rpb24oaSkge1xuXHRcdFx0XHR2YXIgc2VsZiA9IGpRdWVyeSh0aGlzKTtcblx0XHRcdFx0YXJnc1swXSA9IHZhbHVlLmNhbGwodGhpcywgaSwgdGFibGUgPyBzZWxmLmh0bWwoKSA6IHVuZGVmaW5lZCk7XG5cdFx0XHRcdHNlbGYuZG9tTWFuaXAoIGFyZ3MsIHRhYmxlLCBjYWxsYmFjayApO1xuXHRcdFx0fSk7XG5cdFx0fVxuXG5cdFx0aWYgKCB0aGlzWzBdICkge1xuXHRcdFx0cGFyZW50ID0gdmFsdWUgJiYgdmFsdWUucGFyZW50Tm9kZTtcblxuXHRcdFx0Ly8gSWYgd2UncmUgaW4gYSBmcmFnbWVudCwganVzdCB1c2UgdGhhdCBpbnN0ZWFkIG9mIGJ1aWxkaW5nIGEgbmV3IG9uZVxuXHRcdFx0aWYgKCBqUXVlcnkuc3VwcG9ydC5wYXJlbnROb2RlICYmIHBhcmVudCAmJiBwYXJlbnQubm9kZVR5cGUgPT09IDExICYmIHBhcmVudC5jaGlsZE5vZGVzLmxlbmd0aCA9PT0gdGhpcy5sZW5ndGggKSB7XG5cdFx0XHRcdHJlc3VsdHMgPSB7IGZyYWdtZW50OiBwYXJlbnQgfTtcblxuXHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0cmVzdWx0cyA9IGpRdWVyeS5idWlsZEZyYWdtZW50KCBhcmdzLCB0aGlzLCBzY3JpcHRzICk7XG5cdFx0XHR9XG5cblx0XHRcdGZyYWdtZW50ID0gcmVzdWx0cy5mcmFnbWVudDtcblxuXHRcdFx0aWYgKCBmcmFnbWVudC5jaGlsZE5vZGVzLmxlbmd0aCA9PT0gMSApIHtcblx0XHRcdFx0Zmlyc3QgPSBmcmFnbWVudCA9IGZyYWdtZW50LmZpcnN0Q2hpbGQ7XG5cdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRmaXJzdCA9IGZyYWdtZW50LmZpcnN0Q2hpbGQ7XG5cdFx0XHR9XG5cblx0XHRcdGlmICggZmlyc3QgKSB7XG5cdFx0XHRcdHRhYmxlID0gdGFibGUgJiYgalF1ZXJ5Lm5vZGVOYW1lKCBmaXJzdCwgXCJ0clwiICk7XG5cblx0XHRcdFx0Zm9yICggdmFyIGkgPSAwLCBsID0gdGhpcy5sZW5ndGgsIGxhc3RJbmRleCA9IGwgLSAxOyBpIDwgbDsgaSsrICkge1xuXHRcdFx0XHRcdGNhbGxiYWNrLmNhbGwoXG5cdFx0XHRcdFx0XHR0YWJsZSA/XG5cdFx0XHRcdFx0XHRcdHJvb3QodGhpc1tpXSwgZmlyc3QpIDpcblx0XHRcdFx0XHRcdFx0dGhpc1tpXSxcblx0XHRcdFx0XHRcdC8vIE1ha2Ugc3VyZSB0aGF0IHdlIGRvIG5vdCBsZWFrIG1lbW9yeSBieSBpbmFkdmVydGVudGx5IGRpc2NhcmRpbmdcblx0XHRcdFx0XHRcdC8vIHRoZSBvcmlnaW5hbCBmcmFnbWVudCAod2hpY2ggbWlnaHQgaGF2ZSBhdHRhY2hlZCBkYXRhKSBpbnN0ZWFkIG9mXG5cdFx0XHRcdFx0XHQvLyB1c2luZyBpdDsgaW4gYWRkaXRpb24sIHVzZSB0aGUgb3JpZ2luYWwgZnJhZ21lbnQgb2JqZWN0IGZvciB0aGUgbGFzdFxuXHRcdFx0XHRcdFx0Ly8gaXRlbSBpbnN0ZWFkIG9mIGZpcnN0IGJlY2F1c2UgaXQgY2FuIGVuZCB1cCBiZWluZyBlbXB0aWVkIGluY29ycmVjdGx5XG5cdFx0XHRcdFx0XHQvLyBpbiBjZXJ0YWluIHNpdHVhdGlvbnMgKEJ1ZyAjODA3MCkuXG5cdFx0XHRcdFx0XHQvLyBGcmFnbWVudHMgZnJvbSB0aGUgZnJhZ21lbnQgY2FjaGUgbXVzdCBhbHdheXMgYmUgY2xvbmVkIGFuZCBuZXZlciB1c2VkXG5cdFx0XHRcdFx0XHQvLyBpbiBwbGFjZS5cblx0XHRcdFx0XHRcdHJlc3VsdHMuY2FjaGVhYmxlIHx8IChsID4gMSAmJiBpIDwgbGFzdEluZGV4KSA/XG5cdFx0XHRcdFx0XHRcdGpRdWVyeS5jbG9uZSggZnJhZ21lbnQsIHRydWUsIHRydWUgKSA6XG5cdFx0XHRcdFx0XHRcdGZyYWdtZW50XG5cdFx0XHRcdFx0KTtcblx0XHRcdFx0fVxuXHRcdFx0fVxuXG5cdFx0XHRpZiAoIHNjcmlwdHMubGVuZ3RoICkge1xuXHRcdFx0XHRqUXVlcnkuZWFjaCggc2NyaXB0cywgZXZhbFNjcmlwdCApO1xuXHRcdFx0fVxuXHRcdH1cblxuXHRcdHJldHVybiB0aGlzO1xuXHR9XG59KTtcblxuZnVuY3Rpb24gcm9vdCggZWxlbSwgY3VyICkge1xuXHRyZXR1cm4galF1ZXJ5Lm5vZGVOYW1lKGVsZW0sIFwidGFibGVcIikgP1xuXHRcdChlbGVtLmdldEVsZW1lbnRzQnlUYWdOYW1lKFwidGJvZHlcIilbMF0gfHxcblx0XHRlbGVtLmFwcGVuZENoaWxkKGVsZW0ub3duZXJEb2N1bWVudC5jcmVhdGVFbGVtZW50KFwidGJvZHlcIikpKSA6XG5cdFx0ZWxlbTtcbn1cblxuZnVuY3Rpb24gY2xvbmVDb3B5RXZlbnQoIHNyYywgZGVzdCApIHtcblxuXHRpZiAoIGRlc3Qubm9kZVR5cGUgIT09IDEgfHwgIWpRdWVyeS5oYXNEYXRhKCBzcmMgKSApIHtcblx0XHRyZXR1cm47XG5cdH1cblxuXHR2YXIgdHlwZSwgaSwgbCxcblx0XHRvbGREYXRhID0galF1ZXJ5Ll9kYXRhKCBzcmMgKSxcblx0XHRjdXJEYXRhID0galF1ZXJ5Ll9kYXRhKCBkZXN0LCBvbGREYXRhICksXG5cdFx0ZXZlbnRzID0gb2xkRGF0YS5ldmVudHM7XG5cblx0aWYgKCBldmVudHMgKSB7XG5cdFx0ZGVsZXRlIGN1ckRhdGEuaGFuZGxlO1xuXHRcdGN1ckRhdGEuZXZlbnRzID0ge307XG5cblx0XHRmb3IgKCB0eXBlIGluIGV2ZW50cyApIHtcblx0XHRcdGZvciAoIGkgPSAwLCBsID0gZXZlbnRzWyB0eXBlIF0ubGVuZ3RoOyBpIDwgbDsgaSsrICkge1xuXHRcdFx0XHRqUXVlcnkuZXZlbnQuYWRkKCBkZXN0LCB0eXBlICsgKCBldmVudHNbIHR5cGUgXVsgaSBdLm5hbWVzcGFjZSA/IFwiLlwiIDogXCJcIiApICsgZXZlbnRzWyB0eXBlIF1bIGkgXS5uYW1lc3BhY2UsIGV2ZW50c1sgdHlwZSBdWyBpIF0sIGV2ZW50c1sgdHlwZSBdWyBpIF0uZGF0YSApO1xuXHRcdFx0fVxuXHRcdH1cblx0fVxuXG5cdC8vIG1ha2UgdGhlIGNsb25lZCBwdWJsaWMgZGF0YSBvYmplY3QgYSBjb3B5IGZyb20gdGhlIG9yaWdpbmFsXG5cdGlmICggY3VyRGF0YS5kYXRhICkge1xuXHRcdGN1ckRhdGEuZGF0YSA9IGpRdWVyeS5leHRlbmQoIHt9LCBjdXJEYXRhLmRhdGEgKTtcblx0fVxufVxuXG5mdW5jdGlvbiBjbG9uZUZpeEF0dHJpYnV0ZXMoIHNyYywgZGVzdCApIHtcblx0dmFyIG5vZGVOYW1lO1xuXG5cdC8vIFdlIGRvIG5vdCBuZWVkIHRvIGRvIGFueXRoaW5nIGZvciBub24tRWxlbWVudHNcblx0aWYgKCBkZXN0Lm5vZGVUeXBlICE9PSAxICkge1xuXHRcdHJldHVybjtcblx0fVxuXG5cdC8vIGNsZWFyQXR0cmlidXRlcyByZW1vdmVzIHRoZSBhdHRyaWJ1dGVzLCB3aGljaCB3ZSBkb24ndCB3YW50LFxuXHQvLyBidXQgYWxzbyByZW1vdmVzIHRoZSBhdHRhY2hFdmVudCBldmVudHMsIHdoaWNoIHdlICpkbyogd2FudFxuXHRpZiAoIGRlc3QuY2xlYXJBdHRyaWJ1dGVzICkge1xuXHRcdGRlc3QuY2xlYXJBdHRyaWJ1dGVzKCk7XG5cdH1cblxuXHQvLyBtZXJnZUF0dHJpYnV0ZXMsIGluIGNvbnRyYXN0LCBvbmx5IG1lcmdlcyBiYWNrIG9uIHRoZVxuXHQvLyBvcmlnaW5hbCBhdHRyaWJ1dGVzLCBub3QgdGhlIGV2ZW50c1xuXHRpZiAoIGRlc3QubWVyZ2VBdHRyaWJ1dGVzICkge1xuXHRcdGRlc3QubWVyZ2VBdHRyaWJ1dGVzKCBzcmMgKTtcblx0fVxuXG5cdG5vZGVOYW1lID0gZGVzdC5ub2RlTmFtZS50b0xvd2VyQ2FzZSgpO1xuXG5cdC8vIElFNi04IGZhaWwgdG8gY2xvbmUgY2hpbGRyZW4gaW5zaWRlIG9iamVjdCBlbGVtZW50cyB0aGF0IHVzZVxuXHQvLyB0aGUgcHJvcHJpZXRhcnkgY2xhc3NpZCBhdHRyaWJ1dGUgdmFsdWUgKHJhdGhlciB0aGFuIHRoZSB0eXBlXG5cdC8vIGF0dHJpYnV0ZSkgdG8gaWRlbnRpZnkgdGhlIHR5cGUgb2YgY29udGVudCB0byBkaXNwbGF5XG5cdGlmICggbm9kZU5hbWUgPT09IFwib2JqZWN0XCIgKSB7XG5cdFx0ZGVzdC5vdXRlckhUTUwgPSBzcmMub3V0ZXJIVE1MO1xuXG5cdH0gZWxzZSBpZiAoIG5vZGVOYW1lID09PSBcImlucHV0XCIgJiYgKHNyYy50eXBlID09PSBcImNoZWNrYm94XCIgfHwgc3JjLnR5cGUgPT09IFwicmFkaW9cIikgKSB7XG5cdFx0Ly8gSUU2LTggZmFpbHMgdG8gcGVyc2lzdCB0aGUgY2hlY2tlZCBzdGF0ZSBvZiBhIGNsb25lZCBjaGVja2JveFxuXHRcdC8vIG9yIHJhZGlvIGJ1dHRvbi4gV29yc2UsIElFNi03IGZhaWwgdG8gZ2l2ZSB0aGUgY2xvbmVkIGVsZW1lbnRcblx0XHQvLyBhIGNoZWNrZWQgYXBwZWFyYW5jZSBpZiB0aGUgZGVmYXVsdENoZWNrZWQgdmFsdWUgaXNuJ3QgYWxzbyBzZXRcblx0XHRpZiAoIHNyYy5jaGVja2VkICkge1xuXHRcdFx0ZGVzdC5kZWZhdWx0Q2hlY2tlZCA9IGRlc3QuY2hlY2tlZCA9IHNyYy5jaGVja2VkO1xuXHRcdH1cblxuXHRcdC8vIElFNi03IGdldCBjb25mdXNlZCBhbmQgZW5kIHVwIHNldHRpbmcgdGhlIHZhbHVlIG9mIGEgY2xvbmVkXG5cdFx0Ly8gY2hlY2tib3gvcmFkaW8gYnV0dG9uIHRvIGFuIGVtcHR5IHN0cmluZyBpbnN0ZWFkIG9mIFwib25cIlxuXHRcdGlmICggZGVzdC52YWx1ZSAhPT0gc3JjLnZhbHVlICkge1xuXHRcdFx0ZGVzdC52YWx1ZSA9IHNyYy52YWx1ZTtcblx0XHR9XG5cblx0Ly8gSUU2LTggZmFpbHMgdG8gcmV0dXJuIHRoZSBzZWxlY3RlZCBvcHRpb24gdG8gdGhlIGRlZmF1bHQgc2VsZWN0ZWRcblx0Ly8gc3RhdGUgd2hlbiBjbG9uaW5nIG9wdGlvbnNcblx0fSBlbHNlIGlmICggbm9kZU5hbWUgPT09IFwib3B0aW9uXCIgKSB7XG5cdFx0ZGVzdC5zZWxlY3RlZCA9IHNyYy5kZWZhdWx0U2VsZWN0ZWQ7XG5cblx0Ly8gSUU2LTggZmFpbHMgdG8gc2V0IHRoZSBkZWZhdWx0VmFsdWUgdG8gdGhlIGNvcnJlY3QgdmFsdWUgd2hlblxuXHQvLyBjbG9uaW5nIG90aGVyIHR5cGVzIG9mIGlucHV0IGZpZWxkc1xuXHR9IGVsc2UgaWYgKCBub2RlTmFtZSA9PT0gXCJpbnB1dFwiIHx8IG5vZGVOYW1lID09PSBcInRleHRhcmVhXCIgKSB7XG5cdFx0ZGVzdC5kZWZhdWx0VmFsdWUgPSBzcmMuZGVmYXVsdFZhbHVlO1xuXHR9XG5cblx0Ly8gRXZlbnQgZGF0YSBnZXRzIHJlZmVyZW5jZWQgaW5zdGVhZCBvZiBjb3BpZWQgaWYgdGhlIGV4cGFuZG9cblx0Ly8gZ2V0cyBjb3BpZWQgdG9vXG5cdGRlc3QucmVtb3ZlQXR0cmlidXRlKCBqUXVlcnkuZXhwYW5kbyApO1xufVxuXG5qUXVlcnkuYnVpbGRGcmFnbWVudCA9IGZ1bmN0aW9uKCBhcmdzLCBub2Rlcywgc2NyaXB0cyApIHtcblx0dmFyIGZyYWdtZW50LCBjYWNoZWFibGUsIGNhY2hlcmVzdWx0cywgZG9jO1xuXG4gIC8vIG5vZGVzIG1heSBjb250YWluIGVpdGhlciBhbiBleHBsaWNpdCBkb2N1bWVudCBvYmplY3QsXG4gIC8vIGEgalF1ZXJ5IGNvbGxlY3Rpb24gb3IgY29udGV4dCBvYmplY3QuXG4gIC8vIElmIG5vZGVzWzBdIGNvbnRhaW5zIGEgdmFsaWQgb2JqZWN0IHRvIGFzc2lnbiB0byBkb2NcbiAgaWYgKCBub2RlcyAmJiBub2Rlc1swXSApIHtcbiAgICBkb2MgPSBub2Rlc1swXS5vd25lckRvY3VtZW50IHx8IG5vZGVzWzBdO1xuICB9XG5cbiAgLy8gRW5zdXJlIHRoYXQgYW4gYXR0ciBvYmplY3QgZG9lc24ndCBpbmNvcnJlY3RseSBzdGFuZCBpbiBhcyBhIGRvY3VtZW50IG9iamVjdFxuXHQvLyBDaHJvbWUgYW5kIEZpcmVmb3ggc2VlbSB0byBhbGxvdyB0aGlzIHRvIG9jY3VyIGFuZCB3aWxsIHRocm93IGV4Y2VwdGlvblxuXHQvLyBGaXhlcyAjODk1MFxuXHRpZiAoICFkb2MuY3JlYXRlRG9jdW1lbnRGcmFnbWVudCApIHtcblx0XHRkb2MgPSBkb2N1bWVudDtcblx0fVxuXG5cdC8vIE9ubHkgY2FjaGUgXCJzbWFsbFwiICgxLzIgS0IpIEhUTUwgc3RyaW5ncyB0aGF0IGFyZSBhc3NvY2lhdGVkIHdpdGggdGhlIG1haW4gZG9jdW1lbnRcblx0Ly8gQ2xvbmluZyBvcHRpb25zIGxvc2VzIHRoZSBzZWxlY3RlZCBzdGF0ZSwgc28gZG9uJ3QgY2FjaGUgdGhlbVxuXHQvLyBJRSA2IGRvZXNuJ3QgbGlrZSBpdCB3aGVuIHlvdSBwdXQgPG9iamVjdD4gb3IgPGVtYmVkPiBlbGVtZW50cyBpbiBhIGZyYWdtZW50XG5cdC8vIEFsc28sIFdlYktpdCBkb2VzIG5vdCBjbG9uZSAnY2hlY2tlZCcgYXR0cmlidXRlcyBvbiBjbG9uZU5vZGUsIHNvIGRvbid0IGNhY2hlXG5cdGlmICggYXJncy5sZW5ndGggPT09IDEgJiYgdHlwZW9mIGFyZ3NbMF0gPT09IFwic3RyaW5nXCIgJiYgYXJnc1swXS5sZW5ndGggPCA1MTIgJiYgZG9jID09PSBkb2N1bWVudCAmJlxuXHRcdGFyZ3NbMF0uY2hhckF0KDApID09PSBcIjxcIiAmJiAhcm5vY2FjaGUudGVzdCggYXJnc1swXSApICYmIChqUXVlcnkuc3VwcG9ydC5jaGVja0Nsb25lIHx8ICFyY2hlY2tlZC50ZXN0KCBhcmdzWzBdICkpICkge1xuXG5cdFx0Y2FjaGVhYmxlID0gdHJ1ZTtcblxuXHRcdGNhY2hlcmVzdWx0cyA9IGpRdWVyeS5mcmFnbWVudHNbIGFyZ3NbMF0gXTtcblx0XHRpZiAoIGNhY2hlcmVzdWx0cyAmJiBjYWNoZXJlc3VsdHMgIT09IDEgKSB7XG5cdFx0XHRmcmFnbWVudCA9IGNhY2hlcmVzdWx0cztcblx0XHR9XG5cdH1cblxuXHRpZiAoICFmcmFnbWVudCApIHtcblx0XHRmcmFnbWVudCA9IGRvYy5jcmVhdGVEb2N1bWVudEZyYWdtZW50KCk7XG5cdFx0alF1ZXJ5LmNsZWFuKCBhcmdzLCBkb2MsIGZyYWdtZW50LCBzY3JpcHRzICk7XG5cdH1cblxuXHRpZiAoIGNhY2hlYWJsZSApIHtcblx0XHRqUXVlcnkuZnJhZ21lbnRzWyBhcmdzWzBdIF0gPSBjYWNoZXJlc3VsdHMgPyBmcmFnbWVudCA6IDE7XG5cdH1cblxuXHRyZXR1cm4geyBmcmFnbWVudDogZnJhZ21lbnQsIGNhY2hlYWJsZTogY2FjaGVhYmxlIH07XG59O1xuXG5qUXVlcnkuZnJhZ21lbnRzID0ge307XG5cbmpRdWVyeS5lYWNoKHtcblx0YXBwZW5kVG86IFwiYXBwZW5kXCIsXG5cdHByZXBlbmRUbzogXCJwcmVwZW5kXCIsXG5cdGluc2VydEJlZm9yZTogXCJiZWZvcmVcIixcblx0aW5zZXJ0QWZ0ZXI6IFwiYWZ0ZXJcIixcblx0cmVwbGFjZUFsbDogXCJyZXBsYWNlV2l0aFwiXG59LCBmdW5jdGlvbiggbmFtZSwgb3JpZ2luYWwgKSB7XG5cdGpRdWVyeS5mblsgbmFtZSBdID0gZnVuY3Rpb24oIHNlbGVjdG9yICkge1xuXHRcdHZhciByZXQgPSBbXSxcblx0XHRcdGluc2VydCA9IGpRdWVyeSggc2VsZWN0b3IgKSxcblx0XHRcdHBhcmVudCA9IHRoaXMubGVuZ3RoID09PSAxICYmIHRoaXNbMF0ucGFyZW50Tm9kZTtcblxuXHRcdGlmICggcGFyZW50ICYmIHBhcmVudC5ub2RlVHlwZSA9PT0gMTEgJiYgcGFyZW50LmNoaWxkTm9kZXMubGVuZ3RoID09PSAxICYmIGluc2VydC5sZW5ndGggPT09IDEgKSB7XG5cdFx0XHRpbnNlcnRbIG9yaWdpbmFsIF0oIHRoaXNbMF0gKTtcblx0XHRcdHJldHVybiB0aGlzO1xuXG5cdFx0fSBlbHNlIHtcblx0XHRcdGZvciAoIHZhciBpID0gMCwgbCA9IGluc2VydC5sZW5ndGg7IGkgPCBsOyBpKysgKSB7XG5cdFx0XHRcdHZhciBlbGVtcyA9IChpID4gMCA/IHRoaXMuY2xvbmUodHJ1ZSkgOiB0aGlzKS5nZXQoKTtcblx0XHRcdFx0alF1ZXJ5KCBpbnNlcnRbaV0gKVsgb3JpZ2luYWwgXSggZWxlbXMgKTtcblx0XHRcdFx0cmV0ID0gcmV0LmNvbmNhdCggZWxlbXMgKTtcblx0XHRcdH1cblxuXHRcdFx0cmV0dXJuIHRoaXMucHVzaFN0YWNrKCByZXQsIG5hbWUsIGluc2VydC5zZWxlY3RvciApO1xuXHRcdH1cblx0fTtcbn0pO1xuXG5mdW5jdGlvbiBnZXRBbGwoIGVsZW0gKSB7XG5cdGlmICggdHlwZW9mIGVsZW0uZ2V0RWxlbWVudHNCeVRhZ05hbWUgIT09IFwidW5kZWZpbmVkXCIgKSB7XG5cdFx0cmV0dXJuIGVsZW0uZ2V0RWxlbWVudHNCeVRhZ05hbWUoIFwiKlwiICk7XG5cblx0fSBlbHNlIGlmICggdHlwZW9mIGVsZW0ucXVlcnlTZWxlY3RvckFsbCAhPT0gXCJ1bmRlZmluZWRcIiApIHtcblx0XHRyZXR1cm4gZWxlbS5xdWVyeVNlbGVjdG9yQWxsKCBcIipcIiApO1xuXG5cdH0gZWxzZSB7XG5cdFx0cmV0dXJuIFtdO1xuXHR9XG59XG5cbi8vIFVzZWQgaW4gY2xlYW4sIGZpeGVzIHRoZSBkZWZhdWx0Q2hlY2tlZCBwcm9wZXJ0eVxuZnVuY3Rpb24gZml4RGVmYXVsdENoZWNrZWQoIGVsZW0gKSB7XG5cdGlmICggZWxlbS50eXBlID09PSBcImNoZWNrYm94XCIgfHwgZWxlbS50eXBlID09PSBcInJhZGlvXCIgKSB7XG5cdFx0ZWxlbS5kZWZhdWx0Q2hlY2tlZCA9IGVsZW0uY2hlY2tlZDtcblx0fVxufVxuLy8gRmluZHMgYWxsIGlucHV0cyBhbmQgcGFzc2VzIHRoZW0gdG8gZml4RGVmYXVsdENoZWNrZWRcbmZ1bmN0aW9uIGZpbmRJbnB1dHMoIGVsZW0gKSB7XG5cdHZhciBub2RlTmFtZSA9IChlbGVtLm5vZGVOYW1lIHx8IFwiXCIpLnRvTG93ZXJDYXNlKCk7XG5cdGlmICggbm9kZU5hbWUgPT09IFwiaW5wdXRcIiApIHtcblx0XHRmaXhEZWZhdWx0Q2hlY2tlZCggZWxlbSApO1xuXHQvLyBTa2lwIHNjcmlwdHMsIGdldCBvdGhlciBjaGlsZHJlblxuXHR9IGVsc2UgaWYgKCBub2RlTmFtZSAhPT0gXCJzY3JpcHRcIiAmJiB0eXBlb2YgZWxlbS5nZXRFbGVtZW50c0J5VGFnTmFtZSAhPT0gXCJ1bmRlZmluZWRcIiApIHtcblx0XHRqUXVlcnkuZ3JlcCggZWxlbS5nZXRFbGVtZW50c0J5VGFnTmFtZShcImlucHV0XCIpLCBmaXhEZWZhdWx0Q2hlY2tlZCApO1xuXHR9XG59XG5cbmpRdWVyeS5leHRlbmQoe1xuXHRjbG9uZTogZnVuY3Rpb24oIGVsZW0sIGRhdGFBbmRFdmVudHMsIGRlZXBEYXRhQW5kRXZlbnRzICkge1xuXHRcdHZhciBjbG9uZSA9IGVsZW0uY2xvbmVOb2RlKHRydWUpLFxuXHRcdFx0XHRzcmNFbGVtZW50cyxcblx0XHRcdFx0ZGVzdEVsZW1lbnRzLFxuXHRcdFx0XHRpO1xuXG5cdFx0aWYgKCAoIWpRdWVyeS5zdXBwb3J0Lm5vQ2xvbmVFdmVudCB8fCAhalF1ZXJ5LnN1cHBvcnQubm9DbG9uZUNoZWNrZWQpICYmXG5cdFx0XHRcdChlbGVtLm5vZGVUeXBlID09PSAxIHx8IGVsZW0ubm9kZVR5cGUgPT09IDExKSAmJiAhalF1ZXJ5LmlzWE1MRG9jKGVsZW0pICkge1xuXHRcdFx0Ly8gSUUgY29waWVzIGV2ZW50cyBib3VuZCB2aWEgYXR0YWNoRXZlbnQgd2hlbiB1c2luZyBjbG9uZU5vZGUuXG5cdFx0XHQvLyBDYWxsaW5nIGRldGFjaEV2ZW50IG9uIHRoZSBjbG9uZSB3aWxsIGFsc28gcmVtb3ZlIHRoZSBldmVudHNcblx0XHRcdC8vIGZyb20gdGhlIG9yaWdpbmFsLiBJbiBvcmRlciB0byBnZXQgYXJvdW5kIHRoaXMsIHdlIHVzZSBzb21lXG5cdFx0XHQvLyBwcm9wcmlldGFyeSBtZXRob2RzIHRvIGNsZWFyIHRoZSBldmVudHMuIFRoYW5rcyB0byBNb29Ub29sc1xuXHRcdFx0Ly8gZ3V5cyBmb3IgdGhpcyBob3RuZXNzLlxuXG5cdFx0XHRjbG9uZUZpeEF0dHJpYnV0ZXMoIGVsZW0sIGNsb25lICk7XG5cblx0XHRcdC8vIFVzaW5nIFNpenpsZSBoZXJlIGlzIGNyYXp5IHNsb3csIHNvIHdlIHVzZSBnZXRFbGVtZW50c0J5VGFnTmFtZVxuXHRcdFx0Ly8gaW5zdGVhZFxuXHRcdFx0c3JjRWxlbWVudHMgPSBnZXRBbGwoIGVsZW0gKTtcblx0XHRcdGRlc3RFbGVtZW50cyA9IGdldEFsbCggY2xvbmUgKTtcblxuXHRcdFx0Ly8gV2VpcmQgaXRlcmF0aW9uIGJlY2F1c2UgSUUgd2lsbCByZXBsYWNlIHRoZSBsZW5ndGggcHJvcGVydHlcblx0XHRcdC8vIHdpdGggYW4gZWxlbWVudCBpZiB5b3UgYXJlIGNsb25pbmcgdGhlIGJvZHkgYW5kIG9uZSBvZiB0aGVcblx0XHRcdC8vIGVsZW1lbnRzIG9uIHRoZSBwYWdlIGhhcyBhIG5hbWUgb3IgaWQgb2YgXCJsZW5ndGhcIlxuXHRcdFx0Zm9yICggaSA9IDA7IHNyY0VsZW1lbnRzW2ldOyArK2kgKSB7XG5cdFx0XHRcdC8vIEVuc3VyZSB0aGF0IHRoZSBkZXN0aW5hdGlvbiBub2RlIGlzIG5vdCBudWxsOyBGaXhlcyAjOTU4N1xuXHRcdFx0XHRpZiAoIGRlc3RFbGVtZW50c1tpXSApIHtcblx0XHRcdFx0XHRjbG9uZUZpeEF0dHJpYnV0ZXMoIHNyY0VsZW1lbnRzW2ldLCBkZXN0RWxlbWVudHNbaV0gKTtcblx0XHRcdFx0fVxuXHRcdFx0fVxuXHRcdH1cblxuXHRcdC8vIENvcHkgdGhlIGV2ZW50cyBmcm9tIHRoZSBvcmlnaW5hbCB0byB0aGUgY2xvbmVcblx0XHRpZiAoIGRhdGFBbmRFdmVudHMgKSB7XG5cdFx0XHRjbG9uZUNvcHlFdmVudCggZWxlbSwgY2xvbmUgKTtcblxuXHRcdFx0aWYgKCBkZWVwRGF0YUFuZEV2ZW50cyApIHtcblx0XHRcdFx0c3JjRWxlbWVudHMgPSBnZXRBbGwoIGVsZW0gKTtcblx0XHRcdFx0ZGVzdEVsZW1lbnRzID0gZ2V0QWxsKCBjbG9uZSApO1xuXG5cdFx0XHRcdGZvciAoIGkgPSAwOyBzcmNFbGVtZW50c1tpXTsgKytpICkge1xuXHRcdFx0XHRcdGNsb25lQ29weUV2ZW50KCBzcmNFbGVtZW50c1tpXSwgZGVzdEVsZW1lbnRzW2ldICk7XG5cdFx0XHRcdH1cblx0XHRcdH1cblx0XHR9XG5cblx0XHRzcmNFbGVtZW50cyA9IGRlc3RFbGVtZW50cyA9IG51bGw7XG5cblx0XHQvLyBSZXR1cm4gdGhlIGNsb25lZCBzZXRcblx0XHRyZXR1cm4gY2xvbmU7XG5cdH0sXG5cblx0Y2xlYW46IGZ1bmN0aW9uKCBlbGVtcywgY29udGV4dCwgZnJhZ21lbnQsIHNjcmlwdHMgKSB7XG5cdFx0dmFyIGNoZWNrU2NyaXB0VHlwZTtcblxuXHRcdGNvbnRleHQgPSBjb250ZXh0IHx8IGRvY3VtZW50O1xuXG5cdFx0Ly8gIWNvbnRleHQuY3JlYXRlRWxlbWVudCBmYWlscyBpbiBJRSB3aXRoIGFuIGVycm9yIGJ1dCByZXR1cm5zIHR5cGVvZiAnb2JqZWN0J1xuXHRcdGlmICggdHlwZW9mIGNvbnRleHQuY3JlYXRlRWxlbWVudCA9PT0gXCJ1bmRlZmluZWRcIiApIHtcblx0XHRcdGNvbnRleHQgPSBjb250ZXh0Lm93bmVyRG9jdW1lbnQgfHwgY29udGV4dFswXSAmJiBjb250ZXh0WzBdLm93bmVyRG9jdW1lbnQgfHwgZG9jdW1lbnQ7XG5cdFx0fVxuXG5cdFx0dmFyIHJldCA9IFtdLCBqO1xuXG5cdFx0Zm9yICggdmFyIGkgPSAwLCBlbGVtOyAoZWxlbSA9IGVsZW1zW2ldKSAhPSBudWxsOyBpKysgKSB7XG5cdFx0XHRpZiAoIHR5cGVvZiBlbGVtID09PSBcIm51bWJlclwiICkge1xuXHRcdFx0XHRlbGVtICs9IFwiXCI7XG5cdFx0XHR9XG5cblx0XHRcdGlmICggIWVsZW0gKSB7XG5cdFx0XHRcdGNvbnRpbnVlO1xuXHRcdFx0fVxuXG5cdFx0XHQvLyBDb252ZXJ0IGh0bWwgc3RyaW5nIGludG8gRE9NIG5vZGVzXG5cdFx0XHRpZiAoIHR5cGVvZiBlbGVtID09PSBcInN0cmluZ1wiICkge1xuXHRcdFx0XHRpZiAoICFyaHRtbC50ZXN0KCBlbGVtICkgKSB7XG5cdFx0XHRcdFx0ZWxlbSA9IGNvbnRleHQuY3JlYXRlVGV4dE5vZGUoIGVsZW0gKTtcblx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHQvLyBGaXggXCJYSFRNTFwiLXN0eWxlIHRhZ3MgaW4gYWxsIGJyb3dzZXJzXG5cdFx0XHRcdFx0ZWxlbSA9IGVsZW0ucmVwbGFjZShyeGh0bWxUYWcsIFwiPCQxPjwvJDI+XCIpO1xuXG5cdFx0XHRcdFx0Ly8gVHJpbSB3aGl0ZXNwYWNlLCBvdGhlcndpc2UgaW5kZXhPZiB3b24ndCB3b3JrIGFzIGV4cGVjdGVkXG5cdFx0XHRcdFx0dmFyIHRhZyA9IChydGFnTmFtZS5leGVjKCBlbGVtICkgfHwgW1wiXCIsIFwiXCJdKVsxXS50b0xvd2VyQ2FzZSgpLFxuXHRcdFx0XHRcdFx0d3JhcCA9IHdyYXBNYXBbIHRhZyBdIHx8IHdyYXBNYXAuX2RlZmF1bHQsXG5cdFx0XHRcdFx0XHRkZXB0aCA9IHdyYXBbMF0sXG5cdFx0XHRcdFx0XHRkaXYgPSBjb250ZXh0LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIik7XG5cblx0XHRcdFx0XHQvLyBBcHBlbmQgd3JhcHBlciBlbGVtZW50IHRvIHVua25vd24gZWxlbWVudCBzYWZlIGRvYyBmcmFnbWVudFxuXHRcdFx0XHRcdGlmICggY29udGV4dCA9PT0gZG9jdW1lbnQgKSB7XG5cdFx0XHRcdFx0XHQvLyBVc2UgdGhlIGZyYWdtZW50IHdlJ3ZlIGFscmVhZHkgY3JlYXRlZCBmb3IgdGhpcyBkb2N1bWVudFxuXHRcdFx0XHRcdFx0c2FmZUZyYWdtZW50LmFwcGVuZENoaWxkKCBkaXYgKTtcblx0XHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdFx0Ly8gVXNlIGEgZnJhZ21lbnQgY3JlYXRlZCB3aXRoIHRoZSBvd25lciBkb2N1bWVudFxuXHRcdFx0XHRcdFx0Y3JlYXRlU2FmZUZyYWdtZW50KCBjb250ZXh0ICkuYXBwZW5kQ2hpbGQoIGRpdiApO1xuXHRcdFx0XHRcdH1cblxuXHRcdFx0XHRcdC8vIEdvIHRvIGh0bWwgYW5kIGJhY2ssIHRoZW4gcGVlbCBvZmYgZXh0cmEgd3JhcHBlcnNcblx0XHRcdFx0XHRkaXYuaW5uZXJIVE1MID0gd3JhcFsxXSArIGVsZW0gKyB3cmFwWzJdO1xuXG5cdFx0XHRcdFx0Ly8gTW92ZSB0byB0aGUgcmlnaHQgZGVwdGhcblx0XHRcdFx0XHR3aGlsZSAoIGRlcHRoLS0gKSB7XG5cdFx0XHRcdFx0XHRkaXYgPSBkaXYubGFzdENoaWxkO1xuXHRcdFx0XHRcdH1cblxuXHRcdFx0XHRcdC8vIFJlbW92ZSBJRSdzIGF1dG9pbnNlcnRlZCA8dGJvZHk+IGZyb20gdGFibGUgZnJhZ21lbnRzXG5cdFx0XHRcdFx0aWYgKCAhalF1ZXJ5LnN1cHBvcnQudGJvZHkgKSB7XG5cblx0XHRcdFx0XHRcdC8vIFN0cmluZyB3YXMgYSA8dGFibGU+LCAqbWF5KiBoYXZlIHNwdXJpb3VzIDx0Ym9keT5cblx0XHRcdFx0XHRcdHZhciBoYXNCb2R5ID0gcnRib2R5LnRlc3QoZWxlbSksXG5cdFx0XHRcdFx0XHRcdHRib2R5ID0gdGFnID09PSBcInRhYmxlXCIgJiYgIWhhc0JvZHkgP1xuXHRcdFx0XHRcdFx0XHRcdGRpdi5maXJzdENoaWxkICYmIGRpdi5maXJzdENoaWxkLmNoaWxkTm9kZXMgOlxuXG5cdFx0XHRcdFx0XHRcdFx0Ly8gU3RyaW5nIHdhcyBhIGJhcmUgPHRoZWFkPiBvciA8dGZvb3Q+XG5cdFx0XHRcdFx0XHRcdFx0d3JhcFsxXSA9PT0gXCI8dGFibGU+XCIgJiYgIWhhc0JvZHkgP1xuXHRcdFx0XHRcdFx0XHRcdFx0ZGl2LmNoaWxkTm9kZXMgOlxuXHRcdFx0XHRcdFx0XHRcdFx0W107XG5cblx0XHRcdFx0XHRcdGZvciAoIGogPSB0Ym9keS5sZW5ndGggLSAxOyBqID49IDAgOyAtLWogKSB7XG5cdFx0XHRcdFx0XHRcdGlmICggalF1ZXJ5Lm5vZGVOYW1lKCB0Ym9keVsgaiBdLCBcInRib2R5XCIgKSAmJiAhdGJvZHlbIGogXS5jaGlsZE5vZGVzLmxlbmd0aCApIHtcblx0XHRcdFx0XHRcdFx0XHR0Ym9keVsgaiBdLnBhcmVudE5vZGUucmVtb3ZlQ2hpbGQoIHRib2R5WyBqIF0gKTtcblx0XHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdH1cblxuXHRcdFx0XHRcdC8vIElFIGNvbXBsZXRlbHkga2lsbHMgbGVhZGluZyB3aGl0ZXNwYWNlIHdoZW4gaW5uZXJIVE1MIGlzIHVzZWRcblx0XHRcdFx0XHRpZiAoICFqUXVlcnkuc3VwcG9ydC5sZWFkaW5nV2hpdGVzcGFjZSAmJiBybGVhZGluZ1doaXRlc3BhY2UudGVzdCggZWxlbSApICkge1xuXHRcdFx0XHRcdFx0ZGl2Lmluc2VydEJlZm9yZSggY29udGV4dC5jcmVhdGVUZXh0Tm9kZSggcmxlYWRpbmdXaGl0ZXNwYWNlLmV4ZWMoZWxlbSlbMF0gKSwgZGl2LmZpcnN0Q2hpbGQgKTtcblx0XHRcdFx0XHR9XG5cblx0XHRcdFx0XHRlbGVtID0gZGl2LmNoaWxkTm9kZXM7XG5cdFx0XHRcdH1cblx0XHRcdH1cblxuXHRcdFx0Ly8gUmVzZXRzIGRlZmF1bHRDaGVja2VkIGZvciBhbnkgcmFkaW9zIGFuZCBjaGVja2JveGVzXG5cdFx0XHQvLyBhYm91dCB0byBiZSBhcHBlbmRlZCB0byB0aGUgRE9NIGluIElFIDYvNyAoIzgwNjApXG5cdFx0XHR2YXIgbGVuO1xuXHRcdFx0aWYgKCAhalF1ZXJ5LnN1cHBvcnQuYXBwZW5kQ2hlY2tlZCApIHtcblx0XHRcdFx0aWYgKCBlbGVtWzBdICYmIHR5cGVvZiAobGVuID0gZWxlbS5sZW5ndGgpID09PSBcIm51bWJlclwiICkge1xuXHRcdFx0XHRcdGZvciAoIGogPSAwOyBqIDwgbGVuOyBqKysgKSB7XG5cdFx0XHRcdFx0XHRmaW5kSW5wdXRzKCBlbGVtW2pdICk7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdGZpbmRJbnB1dHMoIGVsZW0gKTtcblx0XHRcdFx0fVxuXHRcdFx0fVxuXG5cdFx0XHRpZiAoIGVsZW0ubm9kZVR5cGUgKSB7XG5cdFx0XHRcdHJldC5wdXNoKCBlbGVtICk7XG5cdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRyZXQgPSBqUXVlcnkubWVyZ2UoIHJldCwgZWxlbSApO1xuXHRcdFx0fVxuXHRcdH1cblxuXHRcdGlmICggZnJhZ21lbnQgKSB7XG5cdFx0XHRjaGVja1NjcmlwdFR5cGUgPSBmdW5jdGlvbiggZWxlbSApIHtcblx0XHRcdFx0cmV0dXJuICFlbGVtLnR5cGUgfHwgcnNjcmlwdFR5cGUudGVzdCggZWxlbS50eXBlICk7XG5cdFx0XHR9O1xuXHRcdFx0Zm9yICggaSA9IDA7IHJldFtpXTsgaSsrICkge1xuXHRcdFx0XHRpZiAoIHNjcmlwdHMgJiYgalF1ZXJ5Lm5vZGVOYW1lKCByZXRbaV0sIFwic2NyaXB0XCIgKSAmJiAoIXJldFtpXS50eXBlIHx8IHJldFtpXS50eXBlLnRvTG93ZXJDYXNlKCkgPT09IFwidGV4dC9qYXZhc2NyaXB0XCIpICkge1xuXHRcdFx0XHRcdHNjcmlwdHMucHVzaCggcmV0W2ldLnBhcmVudE5vZGUgPyByZXRbaV0ucGFyZW50Tm9kZS5yZW1vdmVDaGlsZCggcmV0W2ldICkgOiByZXRbaV0gKTtcblxuXHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdGlmICggcmV0W2ldLm5vZGVUeXBlID09PSAxICkge1xuXHRcdFx0XHRcdFx0dmFyIGpzVGFncyA9IGpRdWVyeS5ncmVwKCByZXRbaV0uZ2V0RWxlbWVudHNCeVRhZ05hbWUoIFwic2NyaXB0XCIgKSwgY2hlY2tTY3JpcHRUeXBlICk7XG5cblx0XHRcdFx0XHRcdHJldC5zcGxpY2UuYXBwbHkoIHJldCwgW2kgKyAxLCAwXS5jb25jYXQoIGpzVGFncyApICk7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHRcdGZyYWdtZW50LmFwcGVuZENoaWxkKCByZXRbaV0gKTtcblx0XHRcdFx0fVxuXHRcdFx0fVxuXHRcdH1cblxuXHRcdHJldHVybiByZXQ7XG5cdH0sXG5cblx0Y2xlYW5EYXRhOiBmdW5jdGlvbiggZWxlbXMgKSB7XG5cdFx0dmFyIGRhdGEsIGlkLCBcblx0XHRcdGNhY2hlID0galF1ZXJ5LmNhY2hlLFxuXHRcdFx0c3BlY2lhbCA9IGpRdWVyeS5ldmVudC5zcGVjaWFsLFxuXHRcdFx0ZGVsZXRlRXhwYW5kbyA9IGpRdWVyeS5zdXBwb3J0LmRlbGV0ZUV4cGFuZG87XG5cblx0XHRmb3IgKCB2YXIgaSA9IDAsIGVsZW07IChlbGVtID0gZWxlbXNbaV0pICE9IG51bGw7IGkrKyApIHtcblx0XHRcdGlmICggZWxlbS5ub2RlTmFtZSAmJiBqUXVlcnkubm9EYXRhW2VsZW0ubm9kZU5hbWUudG9Mb3dlckNhc2UoKV0gKSB7XG5cdFx0XHRcdGNvbnRpbnVlO1xuXHRcdFx0fVxuXG5cdFx0XHRpZCA9IGVsZW1bIGpRdWVyeS5leHBhbmRvIF07XG5cblx0XHRcdGlmICggaWQgKSB7XG5cdFx0XHRcdGRhdGEgPSBjYWNoZVsgaWQgXTtcblxuXHRcdFx0XHRpZiAoIGRhdGEgJiYgZGF0YS5ldmVudHMgKSB7XG5cdFx0XHRcdFx0Zm9yICggdmFyIHR5cGUgaW4gZGF0YS5ldmVudHMgKSB7XG5cdFx0XHRcdFx0XHRpZiAoIHNwZWNpYWxbIHR5cGUgXSApIHtcblx0XHRcdFx0XHRcdFx0alF1ZXJ5LmV2ZW50LnJlbW92ZSggZWxlbSwgdHlwZSApO1xuXG5cdFx0XHRcdFx0XHQvLyBUaGlzIGlzIGEgc2hvcnRjdXQgdG8gYXZvaWQgalF1ZXJ5LmV2ZW50LnJlbW92ZSdzIG92ZXJoZWFkXG5cdFx0XHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdFx0XHRqUXVlcnkucmVtb3ZlRXZlbnQoIGVsZW0sIHR5cGUsIGRhdGEuaGFuZGxlICk7XG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0fVxuXG5cdFx0XHRcdFx0Ly8gTnVsbCB0aGUgRE9NIHJlZmVyZW5jZSB0byBhdm9pZCBJRTYvNy84IGxlYWsgKCM3MDU0KVxuXHRcdFx0XHRcdGlmICggZGF0YS5oYW5kbGUgKSB7XG5cdFx0XHRcdFx0XHRkYXRhLmhhbmRsZS5lbGVtID0gbnVsbDtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH1cblxuXHRcdFx0XHRpZiAoIGRlbGV0ZUV4cGFuZG8gKSB7XG5cdFx0XHRcdFx0ZGVsZXRlIGVsZW1bIGpRdWVyeS5leHBhbmRvIF07XG5cblx0XHRcdFx0fSBlbHNlIGlmICggZWxlbS5yZW1vdmVBdHRyaWJ1dGUgKSB7XG5cdFx0XHRcdFx0ZWxlbS5yZW1vdmVBdHRyaWJ1dGUoIGpRdWVyeS5leHBhbmRvICk7XG5cdFx0XHRcdH1cblxuXHRcdFx0XHRkZWxldGUgY2FjaGVbIGlkIF07XG5cdFx0XHR9XG5cdFx0fVxuXHR9XG59KTtcblxuZnVuY3Rpb24gZXZhbFNjcmlwdCggaSwgZWxlbSApIHtcblx0aWYgKCBlbGVtLnNyYyApIHtcblx0XHRqUXVlcnkuYWpheCh7XG5cdFx0XHR1cmw6IGVsZW0uc3JjLFxuXHRcdFx0YXN5bmM6IGZhbHNlLFxuXHRcdFx0ZGF0YVR5cGU6IFwic2NyaXB0XCJcblx0XHR9KTtcblx0fSBlbHNlIHtcblx0XHRqUXVlcnkuZ2xvYmFsRXZhbCggKCBlbGVtLnRleHQgfHwgZWxlbS50ZXh0Q29udGVudCB8fCBlbGVtLmlubmVySFRNTCB8fCBcIlwiICkucmVwbGFjZSggcmNsZWFuU2NyaXB0LCBcIi8qJDAqL1wiICkgKTtcblx0fVxuXG5cdGlmICggZWxlbS5wYXJlbnROb2RlICkge1xuXHRcdGVsZW0ucGFyZW50Tm9kZS5yZW1vdmVDaGlsZCggZWxlbSApO1xuXHR9XG59XG5cblxuXG5cbnZhciByYWxwaGEgPSAvYWxwaGFcXChbXildKlxcKS9pLFxuXHRyb3BhY2l0eSA9IC9vcGFjaXR5PShbXildKikvLFxuXHQvLyBmaXhlZCBmb3IgSUU5LCBzZWUgIzgzNDZcblx0cnVwcGVyID0gLyhbQS1aXXxebXMpL2csXG5cdHJudW1weCA9IC9eLT9cXGQrKD86cHgpPyQvaSxcblx0cm51bSA9IC9eLT9cXGQvLFxuXHRycmVsTnVtID0gL14oW1xcLStdKT0oW1xcLSsuXFxkZV0rKS8sXG5cblx0Y3NzU2hvdyA9IHsgcG9zaXRpb246IFwiYWJzb2x1dGVcIiwgdmlzaWJpbGl0eTogXCJoaWRkZW5cIiwgZGlzcGxheTogXCJibG9ja1wiIH0sXG5cdGNzc1dpZHRoID0gWyBcIkxlZnRcIiwgXCJSaWdodFwiIF0sXG5cdGNzc0hlaWdodCA9IFsgXCJUb3BcIiwgXCJCb3R0b21cIiBdLFxuXHRjdXJDU1MsXG5cblx0Z2V0Q29tcHV0ZWRTdHlsZSxcblx0Y3VycmVudFN0eWxlO1xuXG5qUXVlcnkuZm4uY3NzID0gZnVuY3Rpb24oIG5hbWUsIHZhbHVlICkge1xuXHQvLyBTZXR0aW5nICd1bmRlZmluZWQnIGlzIGEgbm8tb3Bcblx0aWYgKCBhcmd1bWVudHMubGVuZ3RoID09PSAyICYmIHZhbHVlID09PSB1bmRlZmluZWQgKSB7XG5cdFx0cmV0dXJuIHRoaXM7XG5cdH1cblxuXHRyZXR1cm4galF1ZXJ5LmFjY2VzcyggdGhpcywgbmFtZSwgdmFsdWUsIHRydWUsIGZ1bmN0aW9uKCBlbGVtLCBuYW1lLCB2YWx1ZSApIHtcblx0XHRyZXR1cm4gdmFsdWUgIT09IHVuZGVmaW5lZCA/XG5cdFx0XHRqUXVlcnkuc3R5bGUoIGVsZW0sIG5hbWUsIHZhbHVlICkgOlxuXHRcdFx0alF1ZXJ5LmNzcyggZWxlbSwgbmFtZSApO1xuXHR9KTtcbn07XG5cbmpRdWVyeS5leHRlbmQoe1xuXHQvLyBBZGQgaW4gc3R5bGUgcHJvcGVydHkgaG9va3MgZm9yIG92ZXJyaWRpbmcgdGhlIGRlZmF1bHRcblx0Ly8gYmVoYXZpb3Igb2YgZ2V0dGluZyBhbmQgc2V0dGluZyBhIHN0eWxlIHByb3BlcnR5XG5cdGNzc0hvb2tzOiB7XG5cdFx0b3BhY2l0eToge1xuXHRcdFx0Z2V0OiBmdW5jdGlvbiggZWxlbSwgY29tcHV0ZWQgKSB7XG5cdFx0XHRcdGlmICggY29tcHV0ZWQgKSB7XG5cdFx0XHRcdFx0Ly8gV2Ugc2hvdWxkIGFsd2F5cyBnZXQgYSBudW1iZXIgYmFjayBmcm9tIG9wYWNpdHlcblx0XHRcdFx0XHR2YXIgcmV0ID0gY3VyQ1NTKCBlbGVtLCBcIm9wYWNpdHlcIiwgXCJvcGFjaXR5XCIgKTtcblx0XHRcdFx0XHRyZXR1cm4gcmV0ID09PSBcIlwiID8gXCIxXCIgOiByZXQ7XG5cblx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHRyZXR1cm4gZWxlbS5zdHlsZS5vcGFjaXR5O1xuXHRcdFx0XHR9XG5cdFx0XHR9XG5cdFx0fVxuXHR9LFxuXG5cdC8vIEV4Y2x1ZGUgdGhlIGZvbGxvd2luZyBjc3MgcHJvcGVydGllcyB0byBhZGQgcHhcblx0Y3NzTnVtYmVyOiB7XG5cdFx0XCJmaWxsT3BhY2l0eVwiOiB0cnVlLFxuXHRcdFwiZm9udFdlaWdodFwiOiB0cnVlLFxuXHRcdFwibGluZUhlaWdodFwiOiB0cnVlLFxuXHRcdFwib3BhY2l0eVwiOiB0cnVlLFxuXHRcdFwib3JwaGFuc1wiOiB0cnVlLFxuXHRcdFwid2lkb3dzXCI6IHRydWUsXG5cdFx0XCJ6SW5kZXhcIjogdHJ1ZSxcblx0XHRcInpvb21cIjogdHJ1ZVxuXHR9LFxuXG5cdC8vIEFkZCBpbiBwcm9wZXJ0aWVzIHdob3NlIG5hbWVzIHlvdSB3aXNoIHRvIGZpeCBiZWZvcmVcblx0Ly8gc2V0dGluZyBvciBnZXR0aW5nIHRoZSB2YWx1ZVxuXHRjc3NQcm9wczoge1xuXHRcdC8vIG5vcm1hbGl6ZSBmbG9hdCBjc3MgcHJvcGVydHlcblx0XHRcImZsb2F0XCI6IGpRdWVyeS5zdXBwb3J0LmNzc0Zsb2F0ID8gXCJjc3NGbG9hdFwiIDogXCJzdHlsZUZsb2F0XCJcblx0fSxcblxuXHQvLyBHZXQgYW5kIHNldCB0aGUgc3R5bGUgcHJvcGVydHkgb24gYSBET00gTm9kZVxuXHRzdHlsZTogZnVuY3Rpb24oIGVsZW0sIG5hbWUsIHZhbHVlLCBleHRyYSApIHtcblx0XHQvLyBEb24ndCBzZXQgc3R5bGVzIG9uIHRleHQgYW5kIGNvbW1lbnQgbm9kZXNcblx0XHRpZiAoICFlbGVtIHx8IGVsZW0ubm9kZVR5cGUgPT09IDMgfHwgZWxlbS5ub2RlVHlwZSA9PT0gOCB8fCAhZWxlbS5zdHlsZSApIHtcblx0XHRcdHJldHVybjtcblx0XHR9XG5cblx0XHQvLyBNYWtlIHN1cmUgdGhhdCB3ZSdyZSB3b3JraW5nIHdpdGggdGhlIHJpZ2h0IG5hbWVcblx0XHR2YXIgcmV0LCB0eXBlLCBvcmlnTmFtZSA9IGpRdWVyeS5jYW1lbENhc2UoIG5hbWUgKSxcblx0XHRcdHN0eWxlID0gZWxlbS5zdHlsZSwgaG9va3MgPSBqUXVlcnkuY3NzSG9va3NbIG9yaWdOYW1lIF07XG5cblx0XHRuYW1lID0galF1ZXJ5LmNzc1Byb3BzWyBvcmlnTmFtZSBdIHx8IG9yaWdOYW1lO1xuXG5cdFx0Ly8gQ2hlY2sgaWYgd2UncmUgc2V0dGluZyBhIHZhbHVlXG5cdFx0aWYgKCB2YWx1ZSAhPT0gdW5kZWZpbmVkICkge1xuXHRcdFx0dHlwZSA9IHR5cGVvZiB2YWx1ZTtcblxuXHRcdFx0Ly8gY29udmVydCByZWxhdGl2ZSBudW1iZXIgc3RyaW5ncyAoKz0gb3IgLT0pIHRvIHJlbGF0aXZlIG51bWJlcnMuICM3MzQ1XG5cdFx0XHRpZiAoIHR5cGUgPT09IFwic3RyaW5nXCIgJiYgKHJldCA9IHJyZWxOdW0uZXhlYyggdmFsdWUgKSkgKSB7XG5cdFx0XHRcdHZhbHVlID0gKCArKCByZXRbMV0gKyAxKSAqICtyZXRbMl0gKSArIHBhcnNlRmxvYXQoIGpRdWVyeS5jc3MoIGVsZW0sIG5hbWUgKSApO1xuXHRcdFx0XHQvLyBGaXhlcyBidWcgIzkyMzdcblx0XHRcdFx0dHlwZSA9IFwibnVtYmVyXCI7XG5cdFx0XHR9XG5cblx0XHRcdC8vIE1ha2Ugc3VyZSB0aGF0IE5hTiBhbmQgbnVsbCB2YWx1ZXMgYXJlbid0IHNldC4gU2VlOiAjNzExNlxuXHRcdFx0aWYgKCB2YWx1ZSA9PSBudWxsIHx8IHR5cGUgPT09IFwibnVtYmVyXCIgJiYgaXNOYU4oIHZhbHVlICkgKSB7XG5cdFx0XHRcdHJldHVybjtcblx0XHRcdH1cblxuXHRcdFx0Ly8gSWYgYSBudW1iZXIgd2FzIHBhc3NlZCBpbiwgYWRkICdweCcgdG8gdGhlIChleGNlcHQgZm9yIGNlcnRhaW4gQ1NTIHByb3BlcnRpZXMpXG5cdFx0XHRpZiAoIHR5cGUgPT09IFwibnVtYmVyXCIgJiYgIWpRdWVyeS5jc3NOdW1iZXJbIG9yaWdOYW1lIF0gKSB7XG5cdFx0XHRcdHZhbHVlICs9IFwicHhcIjtcblx0XHRcdH1cblxuXHRcdFx0Ly8gSWYgYSBob29rIHdhcyBwcm92aWRlZCwgdXNlIHRoYXQgdmFsdWUsIG90aGVyd2lzZSBqdXN0IHNldCB0aGUgc3BlY2lmaWVkIHZhbHVlXG5cdFx0XHRpZiAoICFob29rcyB8fCAhKFwic2V0XCIgaW4gaG9va3MpIHx8ICh2YWx1ZSA9IGhvb2tzLnNldCggZWxlbSwgdmFsdWUgKSkgIT09IHVuZGVmaW5lZCApIHtcblx0XHRcdFx0Ly8gV3JhcHBlZCB0byBwcmV2ZW50IElFIGZyb20gdGhyb3dpbmcgZXJyb3JzIHdoZW4gJ2ludmFsaWQnIHZhbHVlcyBhcmUgcHJvdmlkZWRcblx0XHRcdFx0Ly8gRml4ZXMgYnVnICM1NTA5XG5cdFx0XHRcdHRyeSB7XG5cdFx0XHRcdFx0c3R5bGVbIG5hbWUgXSA9IHZhbHVlO1xuXHRcdFx0XHR9IGNhdGNoKGUpIHt9XG5cdFx0XHR9XG5cblx0XHR9IGVsc2Uge1xuXHRcdFx0Ly8gSWYgYSBob29rIHdhcyBwcm92aWRlZCBnZXQgdGhlIG5vbi1jb21wdXRlZCB2YWx1ZSBmcm9tIHRoZXJlXG5cdFx0XHRpZiAoIGhvb2tzICYmIFwiZ2V0XCIgaW4gaG9va3MgJiYgKHJldCA9IGhvb2tzLmdldCggZWxlbSwgZmFsc2UsIGV4dHJhICkpICE9PSB1bmRlZmluZWQgKSB7XG5cdFx0XHRcdHJldHVybiByZXQ7XG5cdFx0XHR9XG5cblx0XHRcdC8vIE90aGVyd2lzZSBqdXN0IGdldCB0aGUgdmFsdWUgZnJvbSB0aGUgc3R5bGUgb2JqZWN0XG5cdFx0XHRyZXR1cm4gc3R5bGVbIG5hbWUgXTtcblx0XHR9XG5cdH0sXG5cblx0Y3NzOiBmdW5jdGlvbiggZWxlbSwgbmFtZSwgZXh0cmEgKSB7XG5cdFx0dmFyIHJldCwgaG9va3M7XG5cblx0XHQvLyBNYWtlIHN1cmUgdGhhdCB3ZSdyZSB3b3JraW5nIHdpdGggdGhlIHJpZ2h0IG5hbWVcblx0XHRuYW1lID0galF1ZXJ5LmNhbWVsQ2FzZSggbmFtZSApO1xuXHRcdGhvb2tzID0galF1ZXJ5LmNzc0hvb2tzWyBuYW1lIF07XG5cdFx0bmFtZSA9IGpRdWVyeS5jc3NQcm9wc1sgbmFtZSBdIHx8IG5hbWU7XG5cblx0XHQvLyBjc3NGbG9hdCBuZWVkcyBhIHNwZWNpYWwgdHJlYXRtZW50XG5cdFx0aWYgKCBuYW1lID09PSBcImNzc0Zsb2F0XCIgKSB7XG5cdFx0XHRuYW1lID0gXCJmbG9hdFwiO1xuXHRcdH1cblxuXHRcdC8vIElmIGEgaG9vayB3YXMgcHJvdmlkZWQgZ2V0IHRoZSBjb21wdXRlZCB2YWx1ZSBmcm9tIHRoZXJlXG5cdFx0aWYgKCBob29rcyAmJiBcImdldFwiIGluIGhvb2tzICYmIChyZXQgPSBob29rcy5nZXQoIGVsZW0sIHRydWUsIGV4dHJhICkpICE9PSB1bmRlZmluZWQgKSB7XG5cdFx0XHRyZXR1cm4gcmV0O1xuXG5cdFx0Ly8gT3RoZXJ3aXNlLCBpZiBhIHdheSB0byBnZXQgdGhlIGNvbXB1dGVkIHZhbHVlIGV4aXN0cywgdXNlIHRoYXRcblx0XHR9IGVsc2UgaWYgKCBjdXJDU1MgKSB7XG5cdFx0XHRyZXR1cm4gY3VyQ1NTKCBlbGVtLCBuYW1lICk7XG5cdFx0fVxuXHR9LFxuXG5cdC8vIEEgbWV0aG9kIGZvciBxdWlja2x5IHN3YXBwaW5nIGluL291dCBDU1MgcHJvcGVydGllcyB0byBnZXQgY29ycmVjdCBjYWxjdWxhdGlvbnNcblx0c3dhcDogZnVuY3Rpb24oIGVsZW0sIG9wdGlvbnMsIGNhbGxiYWNrICkge1xuXHRcdHZhciBvbGQgPSB7fTtcblxuXHRcdC8vIFJlbWVtYmVyIHRoZSBvbGQgdmFsdWVzLCBhbmQgaW5zZXJ0IHRoZSBuZXcgb25lc1xuXHRcdGZvciAoIHZhciBuYW1lIGluIG9wdGlvbnMgKSB7XG5cdFx0XHRvbGRbIG5hbWUgXSA9IGVsZW0uc3R5bGVbIG5hbWUgXTtcblx0XHRcdGVsZW0uc3R5bGVbIG5hbWUgXSA9IG9wdGlvbnNbIG5hbWUgXTtcblx0XHR9XG5cblx0XHRjYWxsYmFjay5jYWxsKCBlbGVtICk7XG5cblx0XHQvLyBSZXZlcnQgdGhlIG9sZCB2YWx1ZXNcblx0XHRmb3IgKCBuYW1lIGluIG9wdGlvbnMgKSB7XG5cdFx0XHRlbGVtLnN0eWxlWyBuYW1lIF0gPSBvbGRbIG5hbWUgXTtcblx0XHR9XG5cdH1cbn0pO1xuXG4vLyBERVBSRUNBVEVELCBVc2UgalF1ZXJ5LmNzcygpIGluc3RlYWRcbmpRdWVyeS5jdXJDU1MgPSBqUXVlcnkuY3NzO1xuXG5qUXVlcnkuZWFjaChbXCJoZWlnaHRcIiwgXCJ3aWR0aFwiXSwgZnVuY3Rpb24oIGksIG5hbWUgKSB7XG5cdGpRdWVyeS5jc3NIb29rc1sgbmFtZSBdID0ge1xuXHRcdGdldDogZnVuY3Rpb24oIGVsZW0sIGNvbXB1dGVkLCBleHRyYSApIHtcblx0XHRcdHZhciB2YWw7XG5cblx0XHRcdGlmICggY29tcHV0ZWQgKSB7XG5cdFx0XHRcdGlmICggZWxlbS5vZmZzZXRXaWR0aCAhPT0gMCApIHtcblx0XHRcdFx0XHRyZXR1cm4gZ2V0V0goIGVsZW0sIG5hbWUsIGV4dHJhICk7XG5cdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0alF1ZXJ5LnN3YXAoIGVsZW0sIGNzc1Nob3csIGZ1bmN0aW9uKCkge1xuXHRcdFx0XHRcdFx0dmFsID0gZ2V0V0goIGVsZW0sIG5hbWUsIGV4dHJhICk7XG5cdFx0XHRcdFx0fSk7XG5cdFx0XHRcdH1cblxuXHRcdFx0XHRyZXR1cm4gdmFsO1xuXHRcdFx0fVxuXHRcdH0sXG5cblx0XHRzZXQ6IGZ1bmN0aW9uKCBlbGVtLCB2YWx1ZSApIHtcblx0XHRcdGlmICggcm51bXB4LnRlc3QoIHZhbHVlICkgKSB7XG5cdFx0XHRcdC8vIGlnbm9yZSBuZWdhdGl2ZSB3aWR0aCBhbmQgaGVpZ2h0IHZhbHVlcyAjMTU5OVxuXHRcdFx0XHR2YWx1ZSA9IHBhcnNlRmxvYXQoIHZhbHVlICk7XG5cblx0XHRcdFx0aWYgKCB2YWx1ZSA+PSAwICkge1xuXHRcdFx0XHRcdHJldHVybiB2YWx1ZSArIFwicHhcIjtcblx0XHRcdFx0fVxuXG5cdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRyZXR1cm4gdmFsdWU7XG5cdFx0XHR9XG5cdFx0fVxuXHR9O1xufSk7XG5cbmlmICggIWpRdWVyeS5zdXBwb3J0Lm9wYWNpdHkgKSB7XG5cdGpRdWVyeS5jc3NIb29rcy5vcGFjaXR5ID0ge1xuXHRcdGdldDogZnVuY3Rpb24oIGVsZW0sIGNvbXB1dGVkICkge1xuXHRcdFx0Ly8gSUUgdXNlcyBmaWx0ZXJzIGZvciBvcGFjaXR5XG5cdFx0XHRyZXR1cm4gcm9wYWNpdHkudGVzdCggKGNvbXB1dGVkICYmIGVsZW0uY3VycmVudFN0eWxlID8gZWxlbS5jdXJyZW50U3R5bGUuZmlsdGVyIDogZWxlbS5zdHlsZS5maWx0ZXIpIHx8IFwiXCIgKSA/XG5cdFx0XHRcdCggcGFyc2VGbG9hdCggUmVnRXhwLiQxICkgLyAxMDAgKSArIFwiXCIgOlxuXHRcdFx0XHRjb21wdXRlZCA/IFwiMVwiIDogXCJcIjtcblx0XHR9LFxuXG5cdFx0c2V0OiBmdW5jdGlvbiggZWxlbSwgdmFsdWUgKSB7XG5cdFx0XHR2YXIgc3R5bGUgPSBlbGVtLnN0eWxlLFxuXHRcdFx0XHRjdXJyZW50U3R5bGUgPSBlbGVtLmN1cnJlbnRTdHlsZSxcblx0XHRcdFx0b3BhY2l0eSA9IGpRdWVyeS5pc051bWVyaWMoIHZhbHVlICkgPyBcImFscGhhKG9wYWNpdHk9XCIgKyB2YWx1ZSAqIDEwMCArIFwiKVwiIDogXCJcIixcblx0XHRcdFx0ZmlsdGVyID0gY3VycmVudFN0eWxlICYmIGN1cnJlbnRTdHlsZS5maWx0ZXIgfHwgc3R5bGUuZmlsdGVyIHx8IFwiXCI7XG5cblx0XHRcdC8vIElFIGhhcyB0cm91YmxlIHdpdGggb3BhY2l0eSBpZiBpdCBkb2VzIG5vdCBoYXZlIGxheW91dFxuXHRcdFx0Ly8gRm9yY2UgaXQgYnkgc2V0dGluZyB0aGUgem9vbSBsZXZlbFxuXHRcdFx0c3R5bGUuem9vbSA9IDE7XG5cblx0XHRcdC8vIGlmIHNldHRpbmcgb3BhY2l0eSB0byAxLCBhbmQgbm8gb3RoZXIgZmlsdGVycyBleGlzdCAtIGF0dGVtcHQgdG8gcmVtb3ZlIGZpbHRlciBhdHRyaWJ1dGUgIzY2NTJcblx0XHRcdGlmICggdmFsdWUgPj0gMSAmJiBqUXVlcnkudHJpbSggZmlsdGVyLnJlcGxhY2UoIHJhbHBoYSwgXCJcIiApICkgPT09IFwiXCIgKSB7XG5cblx0XHRcdFx0Ly8gU2V0dGluZyBzdHlsZS5maWx0ZXIgdG8gbnVsbCwgXCJcIiAmIFwiIFwiIHN0aWxsIGxlYXZlIFwiZmlsdGVyOlwiIGluIHRoZSBjc3NUZXh0XG5cdFx0XHRcdC8vIGlmIFwiZmlsdGVyOlwiIGlzIHByZXNlbnQgYXQgYWxsLCBjbGVhclR5cGUgaXMgZGlzYWJsZWQsIHdlIHdhbnQgdG8gYXZvaWQgdGhpc1xuXHRcdFx0XHQvLyBzdHlsZS5yZW1vdmVBdHRyaWJ1dGUgaXMgSUUgT25seSwgYnV0IHNvIGFwcGFyZW50bHkgaXMgdGhpcyBjb2RlIHBhdGguLi5cblx0XHRcdFx0c3R5bGUucmVtb3ZlQXR0cmlidXRlKCBcImZpbHRlclwiICk7XG5cblx0XHRcdFx0Ly8gaWYgdGhlcmUgdGhlcmUgaXMgbm8gZmlsdGVyIHN0eWxlIGFwcGxpZWQgaW4gYSBjc3MgcnVsZSwgd2UgYXJlIGRvbmVcblx0XHRcdFx0aWYgKCBjdXJyZW50U3R5bGUgJiYgIWN1cnJlbnRTdHlsZS5maWx0ZXIgKSB7XG5cdFx0XHRcdFx0cmV0dXJuO1xuXHRcdFx0XHR9XG5cdFx0XHR9XG5cblx0XHRcdC8vIG90aGVyd2lzZSwgc2V0IG5ldyBmaWx0ZXIgdmFsdWVzXG5cdFx0XHRzdHlsZS5maWx0ZXIgPSByYWxwaGEudGVzdCggZmlsdGVyICkgP1xuXHRcdFx0XHRmaWx0ZXIucmVwbGFjZSggcmFscGhhLCBvcGFjaXR5ICkgOlxuXHRcdFx0XHRmaWx0ZXIgKyBcIiBcIiArIG9wYWNpdHk7XG5cdFx0fVxuXHR9O1xufVxuXG5qUXVlcnkoZnVuY3Rpb24oKSB7XG5cdC8vIFRoaXMgaG9vayBjYW5ub3QgYmUgYWRkZWQgdW50aWwgRE9NIHJlYWR5IGJlY2F1c2UgdGhlIHN1cHBvcnQgdGVzdFxuXHQvLyBmb3IgaXQgaXMgbm90IHJ1biB1bnRpbCBhZnRlciBET00gcmVhZHlcblx0aWYgKCAhalF1ZXJ5LnN1cHBvcnQucmVsaWFibGVNYXJnaW5SaWdodCApIHtcblx0XHRqUXVlcnkuY3NzSG9va3MubWFyZ2luUmlnaHQgPSB7XG5cdFx0XHRnZXQ6IGZ1bmN0aW9uKCBlbGVtLCBjb21wdXRlZCApIHtcblx0XHRcdFx0Ly8gV2ViS2l0IEJ1ZyAxMzM0MyAtIGdldENvbXB1dGVkU3R5bGUgcmV0dXJucyB3cm9uZyB2YWx1ZSBmb3IgbWFyZ2luLXJpZ2h0XG5cdFx0XHRcdC8vIFdvcmsgYXJvdW5kIGJ5IHRlbXBvcmFyaWx5IHNldHRpbmcgZWxlbWVudCBkaXNwbGF5IHRvIGlubGluZS1ibG9ja1xuXHRcdFx0XHR2YXIgcmV0O1xuXHRcdFx0XHRqUXVlcnkuc3dhcCggZWxlbSwgeyBcImRpc3BsYXlcIjogXCJpbmxpbmUtYmxvY2tcIiB9LCBmdW5jdGlvbigpIHtcblx0XHRcdFx0XHRpZiAoIGNvbXB1dGVkICkge1xuXHRcdFx0XHRcdFx0cmV0ID0gY3VyQ1NTKCBlbGVtLCBcIm1hcmdpbi1yaWdodFwiLCBcIm1hcmdpblJpZ2h0XCIgKTtcblx0XHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdFx0cmV0ID0gZWxlbS5zdHlsZS5tYXJnaW5SaWdodDtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH0pO1xuXHRcdFx0XHRyZXR1cm4gcmV0O1xuXHRcdFx0fVxuXHRcdH07XG5cdH1cbn0pO1xuXG5pZiAoIGRvY3VtZW50LmRlZmF1bHRWaWV3ICYmIGRvY3VtZW50LmRlZmF1bHRWaWV3LmdldENvbXB1dGVkU3R5bGUgKSB7XG5cdGdldENvbXB1dGVkU3R5bGUgPSBmdW5jdGlvbiggZWxlbSwgbmFtZSApIHtcblx0XHR2YXIgcmV0LCBkZWZhdWx0VmlldywgY29tcHV0ZWRTdHlsZTtcblxuXHRcdG5hbWUgPSBuYW1lLnJlcGxhY2UoIHJ1cHBlciwgXCItJDFcIiApLnRvTG93ZXJDYXNlKCk7XG5cblx0XHRpZiAoICEoZGVmYXVsdFZpZXcgPSBlbGVtLm93bmVyRG9jdW1lbnQuZGVmYXVsdFZpZXcpICkge1xuXHRcdFx0cmV0dXJuIHVuZGVmaW5lZDtcblx0XHR9XG5cblx0XHRpZiAoIChjb21wdXRlZFN0eWxlID0gZGVmYXVsdFZpZXcuZ2V0Q29tcHV0ZWRTdHlsZSggZWxlbSwgbnVsbCApKSApIHtcblx0XHRcdHJldCA9IGNvbXB1dGVkU3R5bGUuZ2V0UHJvcGVydHlWYWx1ZSggbmFtZSApO1xuXHRcdFx0aWYgKCByZXQgPT09IFwiXCIgJiYgIWpRdWVyeS5jb250YWlucyggZWxlbS5vd25lckRvY3VtZW50LmRvY3VtZW50RWxlbWVudCwgZWxlbSApICkge1xuXHRcdFx0XHRyZXQgPSBqUXVlcnkuc3R5bGUoIGVsZW0sIG5hbWUgKTtcblx0XHRcdH1cblx0XHR9XG5cblx0XHRyZXR1cm4gcmV0O1xuXHR9O1xufVxuXG5pZiAoIGRvY3VtZW50LmRvY3VtZW50RWxlbWVudC5jdXJyZW50U3R5bGUgKSB7XG5cdGN1cnJlbnRTdHlsZSA9IGZ1bmN0aW9uKCBlbGVtLCBuYW1lICkge1xuXHRcdHZhciBsZWZ0LFxuXHRcdFx0cmV0ID0gZWxlbS5jdXJyZW50U3R5bGUgJiYgZWxlbS5jdXJyZW50U3R5bGVbIG5hbWUgXSxcblx0XHRcdHJzTGVmdCA9IGVsZW0ucnVudGltZVN0eWxlICYmIGVsZW0ucnVudGltZVN0eWxlWyBuYW1lIF0sXG5cdFx0XHRzdHlsZSA9IGVsZW0uc3R5bGU7XG5cblx0XHQvLyBGcm9tIHRoZSBhd2Vzb21lIGhhY2sgYnkgRGVhbiBFZHdhcmRzXG5cdFx0Ly8gaHR0cDovL2VyaWsuZWFlLm5ldC9hcmNoaXZlcy8yMDA3LzA3LzI3LzE4LjU0LjE1LyNjb21tZW50LTEwMjI5MVxuXG5cdFx0Ly8gSWYgd2UncmUgbm90IGRlYWxpbmcgd2l0aCBhIHJlZ3VsYXIgcGl4ZWwgbnVtYmVyXG5cdFx0Ly8gYnV0IGEgbnVtYmVyIHRoYXQgaGFzIGEgd2VpcmQgZW5kaW5nLCB3ZSBuZWVkIHRvIGNvbnZlcnQgaXQgdG8gcGl4ZWxzXG5cdFx0aWYgKCAhcm51bXB4LnRlc3QoIHJldCApICYmIHJudW0udGVzdCggcmV0ICkgKSB7XG5cdFx0XHQvLyBSZW1lbWJlciB0aGUgb3JpZ2luYWwgdmFsdWVzXG5cdFx0XHRsZWZ0ID0gc3R5bGUubGVmdDtcblxuXHRcdFx0Ly8gUHV0IGluIHRoZSBuZXcgdmFsdWVzIHRvIGdldCBhIGNvbXB1dGVkIHZhbHVlIG91dFxuXHRcdFx0aWYgKCByc0xlZnQgKSB7XG5cdFx0XHRcdGVsZW0ucnVudGltZVN0eWxlLmxlZnQgPSBlbGVtLmN1cnJlbnRTdHlsZS5sZWZ0O1xuXHRcdFx0fVxuXHRcdFx0c3R5bGUubGVmdCA9IG5hbWUgPT09IFwiZm9udFNpemVcIiA/IFwiMWVtXCIgOiAocmV0IHx8IDApO1xuXHRcdFx0cmV0ID0gc3R5bGUucGl4ZWxMZWZ0ICsgXCJweFwiO1xuXG5cdFx0XHQvLyBSZXZlcnQgdGhlIGNoYW5nZWQgdmFsdWVzXG5cdFx0XHRzdHlsZS5sZWZ0ID0gbGVmdDtcblx0XHRcdGlmICggcnNMZWZ0ICkge1xuXHRcdFx0XHRlbGVtLnJ1bnRpbWVTdHlsZS5sZWZ0ID0gcnNMZWZ0O1xuXHRcdFx0fVxuXHRcdH1cblxuXHRcdHJldHVybiByZXQgPT09IFwiXCIgPyBcImF1dG9cIiA6IHJldDtcblx0fTtcbn1cblxuY3VyQ1NTID0gZ2V0Q29tcHV0ZWRTdHlsZSB8fCBjdXJyZW50U3R5bGU7XG5cbmZ1bmN0aW9uIGdldFdIKCBlbGVtLCBuYW1lLCBleHRyYSApIHtcblxuXHQvLyBTdGFydCB3aXRoIG9mZnNldCBwcm9wZXJ0eVxuXHR2YXIgdmFsID0gbmFtZSA9PT0gXCJ3aWR0aFwiID8gZWxlbS5vZmZzZXRXaWR0aCA6IGVsZW0ub2Zmc2V0SGVpZ2h0LFxuXHRcdHdoaWNoID0gbmFtZSA9PT0gXCJ3aWR0aFwiID8gY3NzV2lkdGggOiBjc3NIZWlnaHQ7XG5cblx0aWYgKCB2YWwgPiAwICkge1xuXHRcdGlmICggZXh0cmEgIT09IFwiYm9yZGVyXCIgKSB7XG5cdFx0XHRqUXVlcnkuZWFjaCggd2hpY2gsIGZ1bmN0aW9uKCkge1xuXHRcdFx0XHRpZiAoICFleHRyYSApIHtcblx0XHRcdFx0XHR2YWwgLT0gcGFyc2VGbG9hdCggalF1ZXJ5LmNzcyggZWxlbSwgXCJwYWRkaW5nXCIgKyB0aGlzICkgKSB8fCAwO1xuXHRcdFx0XHR9XG5cdFx0XHRcdGlmICggZXh0cmEgPT09IFwibWFyZ2luXCIgKSB7XG5cdFx0XHRcdFx0dmFsICs9IHBhcnNlRmxvYXQoIGpRdWVyeS5jc3MoIGVsZW0sIGV4dHJhICsgdGhpcyApICkgfHwgMDtcblx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHR2YWwgLT0gcGFyc2VGbG9hdCggalF1ZXJ5LmNzcyggZWxlbSwgXCJib3JkZXJcIiArIHRoaXMgKyBcIldpZHRoXCIgKSApIHx8IDA7XG5cdFx0XHRcdH1cblx0XHRcdH0pO1xuXHRcdH1cblxuXHRcdHJldHVybiB2YWwgKyBcInB4XCI7XG5cdH1cblxuXHQvLyBGYWxsIGJhY2sgdG8gY29tcHV0ZWQgdGhlbiB1bmNvbXB1dGVkIGNzcyBpZiBuZWNlc3Nhcnlcblx0dmFsID0gY3VyQ1NTKCBlbGVtLCBuYW1lLCBuYW1lICk7XG5cdGlmICggdmFsIDwgMCB8fCB2YWwgPT0gbnVsbCApIHtcblx0XHR2YWwgPSBlbGVtLnN0eWxlWyBuYW1lIF0gfHwgMDtcblx0fVxuXHQvLyBOb3JtYWxpemUgXCJcIiwgYXV0bywgYW5kIHByZXBhcmUgZm9yIGV4dHJhXG5cdHZhbCA9IHBhcnNlRmxvYXQoIHZhbCApIHx8IDA7XG5cblx0Ly8gQWRkIHBhZGRpbmcsIGJvcmRlciwgbWFyZ2luXG5cdGlmICggZXh0cmEgKSB7XG5cdFx0alF1ZXJ5LmVhY2goIHdoaWNoLCBmdW5jdGlvbigpIHtcblx0XHRcdHZhbCArPSBwYXJzZUZsb2F0KCBqUXVlcnkuY3NzKCBlbGVtLCBcInBhZGRpbmdcIiArIHRoaXMgKSApIHx8IDA7XG5cdFx0XHRpZiAoIGV4dHJhICE9PSBcInBhZGRpbmdcIiApIHtcblx0XHRcdFx0dmFsICs9IHBhcnNlRmxvYXQoIGpRdWVyeS5jc3MoIGVsZW0sIFwiYm9yZGVyXCIgKyB0aGlzICsgXCJXaWR0aFwiICkgKSB8fCAwO1xuXHRcdFx0fVxuXHRcdFx0aWYgKCBleHRyYSA9PT0gXCJtYXJnaW5cIiApIHtcblx0XHRcdFx0dmFsICs9IHBhcnNlRmxvYXQoIGpRdWVyeS5jc3MoIGVsZW0sIGV4dHJhICsgdGhpcyApICkgfHwgMDtcblx0XHRcdH1cblx0XHR9KTtcblx0fVxuXG5cdHJldHVybiB2YWwgKyBcInB4XCI7XG59XG5cbmlmICggalF1ZXJ5LmV4cHIgJiYgalF1ZXJ5LmV4cHIuZmlsdGVycyApIHtcblx0alF1ZXJ5LmV4cHIuZmlsdGVycy5oaWRkZW4gPSBmdW5jdGlvbiggZWxlbSApIHtcblx0XHR2YXIgd2lkdGggPSBlbGVtLm9mZnNldFdpZHRoLFxuXHRcdFx0aGVpZ2h0ID0gZWxlbS5vZmZzZXRIZWlnaHQ7XG5cblx0XHRyZXR1cm4gKHdpZHRoID09PSAwICYmIGhlaWdodCA9PT0gMCkgfHwgKCFqUXVlcnkuc3VwcG9ydC5yZWxpYWJsZUhpZGRlbk9mZnNldHMgJiYgKChlbGVtLnN0eWxlICYmIGVsZW0uc3R5bGUuZGlzcGxheSkgfHwgalF1ZXJ5LmNzcyggZWxlbSwgXCJkaXNwbGF5XCIgKSkgPT09IFwibm9uZVwiKTtcblx0fTtcblxuXHRqUXVlcnkuZXhwci5maWx0ZXJzLnZpc2libGUgPSBmdW5jdGlvbiggZWxlbSApIHtcblx0XHRyZXR1cm4gIWpRdWVyeS5leHByLmZpbHRlcnMuaGlkZGVuKCBlbGVtICk7XG5cdH07XG59XG5cblxuXG5cbnZhciByMjAgPSAvJTIwL2csXG5cdHJicmFja2V0ID0gL1xcW1xcXSQvLFxuXHRyQ1JMRiA9IC9cXHI/XFxuL2csXG5cdHJoYXNoID0gLyMuKiQvLFxuXHRyaGVhZGVycyA9IC9eKC4qPyk6WyBcXHRdKihbXlxcclxcbl0qKVxccj8kL21nLCAvLyBJRSBsZWF2ZXMgYW4gXFxyIGNoYXJhY3RlciBhdCBFT0xcblx0cmlucHV0ID0gL14oPzpjb2xvcnxkYXRlfGRhdGV0aW1lfGRhdGV0aW1lLWxvY2FsfGVtYWlsfGhpZGRlbnxtb250aHxudW1iZXJ8cGFzc3dvcmR8cmFuZ2V8c2VhcmNofHRlbHx0ZXh0fHRpbWV8dXJsfHdlZWspJC9pLFxuXHQvLyAjNzY1MywgIzgxMjUsICM4MTUyOiBsb2NhbCBwcm90b2NvbCBkZXRlY3Rpb25cblx0cmxvY2FsUHJvdG9jb2wgPSAvXig/OmFib3V0fGFwcHxhcHBcXC1zdG9yYWdlfC4rXFwtZXh0ZW5zaW9ufGZpbGV8cmVzfHdpZGdldCk6JC8sXG5cdHJub0NvbnRlbnQgPSAvXig/OkdFVHxIRUFEKSQvLFxuXHRycHJvdG9jb2wgPSAvXlxcL1xcLy8sXG5cdHJxdWVyeSA9IC9cXD8vLFxuXHRyc2NyaXB0ID0gLzxzY3JpcHRcXGJbXjxdKig/Oig/ITxcXC9zY3JpcHQ+KTxbXjxdKikqPFxcL3NjcmlwdD4vZ2ksXG5cdHJzZWxlY3RUZXh0YXJlYSA9IC9eKD86c2VsZWN0fHRleHRhcmVhKS9pLFxuXHRyc3BhY2VzQWpheCA9IC9cXHMrLyxcblx0cnRzID0gLyhbPyZdKV89W14mXSovLFxuXHRydXJsID0gL14oW1xcd1xcK1xcLlxcLV0rOikoPzpcXC9cXC8oW15cXC8/IzpdKikoPzo6KFxcZCspKT8pPy8sXG5cblx0Ly8gS2VlcCBhIGNvcHkgb2YgdGhlIG9sZCBsb2FkIG1ldGhvZFxuXHRfbG9hZCA9IGpRdWVyeS5mbi5sb2FkLFxuXG5cdC8qIFByZWZpbHRlcnNcblx0ICogMSkgVGhleSBhcmUgdXNlZnVsIHRvIGludHJvZHVjZSBjdXN0b20gZGF0YVR5cGVzIChzZWUgYWpheC9qc29ucC5qcyBmb3IgYW4gZXhhbXBsZSlcblx0ICogMikgVGhlc2UgYXJlIGNhbGxlZDpcblx0ICogICAgLSBCRUZPUkUgYXNraW5nIGZvciBhIHRyYW5zcG9ydFxuXHQgKiAgICAtIEFGVEVSIHBhcmFtIHNlcmlhbGl6YXRpb24gKHMuZGF0YSBpcyBhIHN0cmluZyBpZiBzLnByb2Nlc3NEYXRhIGlzIHRydWUpXG5cdCAqIDMpIGtleSBpcyB0aGUgZGF0YVR5cGVcblx0ICogNCkgdGhlIGNhdGNoYWxsIHN5bWJvbCBcIipcIiBjYW4gYmUgdXNlZFxuXHQgKiA1KSBleGVjdXRpb24gd2lsbCBzdGFydCB3aXRoIHRyYW5zcG9ydCBkYXRhVHlwZSBhbmQgVEhFTiBjb250aW51ZSBkb3duIHRvIFwiKlwiIGlmIG5lZWRlZFxuXHQgKi9cblx0cHJlZmlsdGVycyA9IHt9LFxuXG5cdC8qIFRyYW5zcG9ydHMgYmluZGluZ3Ncblx0ICogMSkga2V5IGlzIHRoZSBkYXRhVHlwZVxuXHQgKiAyKSB0aGUgY2F0Y2hhbGwgc3ltYm9sIFwiKlwiIGNhbiBiZSB1c2VkXG5cdCAqIDMpIHNlbGVjdGlvbiB3aWxsIHN0YXJ0IHdpdGggdHJhbnNwb3J0IGRhdGFUeXBlIGFuZCBUSEVOIGdvIHRvIFwiKlwiIGlmIG5lZWRlZFxuXHQgKi9cblx0dHJhbnNwb3J0cyA9IHt9LFxuXG5cdC8vIERvY3VtZW50IGxvY2F0aW9uXG5cdGFqYXhMb2NhdGlvbixcblxuXHQvLyBEb2N1bWVudCBsb2NhdGlvbiBzZWdtZW50c1xuXHRhamF4TG9jUGFydHMsXG5cblx0Ly8gQXZvaWQgY29tbWVudC1wcm9sb2cgY2hhciBzZXF1ZW5jZSAoIzEwMDk4KTsgbXVzdCBhcHBlYXNlIGxpbnQgYW5kIGV2YWRlIGNvbXByZXNzaW9uXG5cdGFsbFR5cGVzID0gW1wiKi9cIl0gKyBbXCIqXCJdO1xuXG4vLyAjODEzOCwgSUUgbWF5IHRocm93IGFuIGV4Y2VwdGlvbiB3aGVuIGFjY2Vzc2luZ1xuLy8gYSBmaWVsZCBmcm9tIHdpbmRvdy5sb2NhdGlvbiBpZiBkb2N1bWVudC5kb21haW4gaGFzIGJlZW4gc2V0XG50cnkge1xuXHRhamF4TG9jYXRpb24gPSBsb2NhdGlvbi5ocmVmO1xufSBjYXRjaCggZSApIHtcblx0Ly8gVXNlIHRoZSBocmVmIGF0dHJpYnV0ZSBvZiBhbiBBIGVsZW1lbnRcblx0Ly8gc2luY2UgSUUgd2lsbCBtb2RpZnkgaXQgZ2l2ZW4gZG9jdW1lbnQubG9jYXRpb25cblx0YWpheExvY2F0aW9uID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCggXCJhXCIgKTtcblx0YWpheExvY2F0aW9uLmhyZWYgPSBcIlwiO1xuXHRhamF4TG9jYXRpb24gPSBhamF4TG9jYXRpb24uaHJlZjtcbn1cblxuLy8gU2VnbWVudCBsb2NhdGlvbiBpbnRvIHBhcnRzXG5hamF4TG9jUGFydHMgPSBydXJsLmV4ZWMoIGFqYXhMb2NhdGlvbi50b0xvd2VyQ2FzZSgpICkgfHwgW107XG5cbi8vIEJhc2UgXCJjb25zdHJ1Y3RvclwiIGZvciBqUXVlcnkuYWpheFByZWZpbHRlciBhbmQgalF1ZXJ5LmFqYXhUcmFuc3BvcnRcbmZ1bmN0aW9uIGFkZFRvUHJlZmlsdGVyc09yVHJhbnNwb3J0cyggc3RydWN0dXJlICkge1xuXG5cdC8vIGRhdGFUeXBlRXhwcmVzc2lvbiBpcyBvcHRpb25hbCBhbmQgZGVmYXVsdHMgdG8gXCIqXCJcblx0cmV0dXJuIGZ1bmN0aW9uKCBkYXRhVHlwZUV4cHJlc3Npb24sIGZ1bmMgKSB7XG5cblx0XHRpZiAoIHR5cGVvZiBkYXRhVHlwZUV4cHJlc3Npb24gIT09IFwic3RyaW5nXCIgKSB7XG5cdFx0XHRmdW5jID0gZGF0YVR5cGVFeHByZXNzaW9uO1xuXHRcdFx0ZGF0YVR5cGVFeHByZXNzaW9uID0gXCIqXCI7XG5cdFx0fVxuXG5cdFx0aWYgKCBqUXVlcnkuaXNGdW5jdGlvbiggZnVuYyApICkge1xuXHRcdFx0dmFyIGRhdGFUeXBlcyA9IGRhdGFUeXBlRXhwcmVzc2lvbi50b0xvd2VyQ2FzZSgpLnNwbGl0KCByc3BhY2VzQWpheCApLFxuXHRcdFx0XHRpID0gMCxcblx0XHRcdFx0bGVuZ3RoID0gZGF0YVR5cGVzLmxlbmd0aCxcblx0XHRcdFx0ZGF0YVR5cGUsXG5cdFx0XHRcdGxpc3QsXG5cdFx0XHRcdHBsYWNlQmVmb3JlO1xuXG5cdFx0XHQvLyBGb3IgZWFjaCBkYXRhVHlwZSBpbiB0aGUgZGF0YVR5cGVFeHByZXNzaW9uXG5cdFx0XHRmb3IoOyBpIDwgbGVuZ3RoOyBpKysgKSB7XG5cdFx0XHRcdGRhdGFUeXBlID0gZGF0YVR5cGVzWyBpIF07XG5cdFx0XHRcdC8vIFdlIGNvbnRyb2wgaWYgd2UncmUgYXNrZWQgdG8gYWRkIGJlZm9yZVxuXHRcdFx0XHQvLyBhbnkgZXhpc3RpbmcgZWxlbWVudFxuXHRcdFx0XHRwbGFjZUJlZm9yZSA9IC9eXFwrLy50ZXN0KCBkYXRhVHlwZSApO1xuXHRcdFx0XHRpZiAoIHBsYWNlQmVmb3JlICkge1xuXHRcdFx0XHRcdGRhdGFUeXBlID0gZGF0YVR5cGUuc3Vic3RyKCAxICkgfHwgXCIqXCI7XG5cdFx0XHRcdH1cblx0XHRcdFx0bGlzdCA9IHN0cnVjdHVyZVsgZGF0YVR5cGUgXSA9IHN0cnVjdHVyZVsgZGF0YVR5cGUgXSB8fCBbXTtcblx0XHRcdFx0Ly8gdGhlbiB3ZSBhZGQgdG8gdGhlIHN0cnVjdHVyZSBhY2NvcmRpbmdseVxuXHRcdFx0XHRsaXN0WyBwbGFjZUJlZm9yZSA/IFwidW5zaGlmdFwiIDogXCJwdXNoXCIgXSggZnVuYyApO1xuXHRcdFx0fVxuXHRcdH1cblx0fTtcbn1cblxuLy8gQmFzZSBpbnNwZWN0aW9uIGZ1bmN0aW9uIGZvciBwcmVmaWx0ZXJzIGFuZCB0cmFuc3BvcnRzXG5mdW5jdGlvbiBpbnNwZWN0UHJlZmlsdGVyc09yVHJhbnNwb3J0cyggc3RydWN0dXJlLCBvcHRpb25zLCBvcmlnaW5hbE9wdGlvbnMsIGpxWEhSLFxuXHRcdGRhdGFUeXBlIC8qIGludGVybmFsICovLCBpbnNwZWN0ZWQgLyogaW50ZXJuYWwgKi8gKSB7XG5cblx0ZGF0YVR5cGUgPSBkYXRhVHlwZSB8fCBvcHRpb25zLmRhdGFUeXBlc1sgMCBdO1xuXHRpbnNwZWN0ZWQgPSBpbnNwZWN0ZWQgfHwge307XG5cblx0aW5zcGVjdGVkWyBkYXRhVHlwZSBdID0gdHJ1ZTtcblxuXHR2YXIgbGlzdCA9IHN0cnVjdHVyZVsgZGF0YVR5cGUgXSxcblx0XHRpID0gMCxcblx0XHRsZW5ndGggPSBsaXN0ID8gbGlzdC5sZW5ndGggOiAwLFxuXHRcdGV4ZWN1dGVPbmx5ID0gKCBzdHJ1Y3R1cmUgPT09IHByZWZpbHRlcnMgKSxcblx0XHRzZWxlY3Rpb247XG5cblx0Zm9yKDsgaSA8IGxlbmd0aCAmJiAoIGV4ZWN1dGVPbmx5IHx8ICFzZWxlY3Rpb24gKTsgaSsrICkge1xuXHRcdHNlbGVjdGlvbiA9IGxpc3RbIGkgXSggb3B0aW9ucywgb3JpZ2luYWxPcHRpb25zLCBqcVhIUiApO1xuXHRcdC8vIElmIHdlIGdvdCByZWRpcmVjdGVkIHRvIGFub3RoZXIgZGF0YVR5cGVcblx0XHQvLyB3ZSB0cnkgdGhlcmUgaWYgZXhlY3V0aW5nIG9ubHkgYW5kIG5vdCBkb25lIGFscmVhZHlcblx0XHRpZiAoIHR5cGVvZiBzZWxlY3Rpb24gPT09IFwic3RyaW5nXCIgKSB7XG5cdFx0XHRpZiAoICFleGVjdXRlT25seSB8fCBpbnNwZWN0ZWRbIHNlbGVjdGlvbiBdICkge1xuXHRcdFx0XHRzZWxlY3Rpb24gPSB1bmRlZmluZWQ7XG5cdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRvcHRpb25zLmRhdGFUeXBlcy51bnNoaWZ0KCBzZWxlY3Rpb24gKTtcblx0XHRcdFx0c2VsZWN0aW9uID0gaW5zcGVjdFByZWZpbHRlcnNPclRyYW5zcG9ydHMoXG5cdFx0XHRcdFx0XHRzdHJ1Y3R1cmUsIG9wdGlvbnMsIG9yaWdpbmFsT3B0aW9ucywganFYSFIsIHNlbGVjdGlvbiwgaW5zcGVjdGVkICk7XG5cdFx0XHR9XG5cdFx0fVxuXHR9XG5cdC8vIElmIHdlJ3JlIG9ubHkgZXhlY3V0aW5nIG9yIG5vdGhpbmcgd2FzIHNlbGVjdGVkXG5cdC8vIHdlIHRyeSB0aGUgY2F0Y2hhbGwgZGF0YVR5cGUgaWYgbm90IGRvbmUgYWxyZWFkeVxuXHRpZiAoICggZXhlY3V0ZU9ubHkgfHwgIXNlbGVjdGlvbiApICYmICFpbnNwZWN0ZWRbIFwiKlwiIF0gKSB7XG5cdFx0c2VsZWN0aW9uID0gaW5zcGVjdFByZWZpbHRlcnNPclRyYW5zcG9ydHMoXG5cdFx0XHRcdHN0cnVjdHVyZSwgb3B0aW9ucywgb3JpZ2luYWxPcHRpb25zLCBqcVhIUiwgXCIqXCIsIGluc3BlY3RlZCApO1xuXHR9XG5cdC8vIHVubmVjZXNzYXJ5IHdoZW4gb25seSBleGVjdXRpbmcgKHByZWZpbHRlcnMpXG5cdC8vIGJ1dCBpdCdsbCBiZSBpZ25vcmVkIGJ5IHRoZSBjYWxsZXIgaW4gdGhhdCBjYXNlXG5cdHJldHVybiBzZWxlY3Rpb247XG59XG5cbi8vIEEgc3BlY2lhbCBleHRlbmQgZm9yIGFqYXggb3B0aW9uc1xuLy8gdGhhdCB0YWtlcyBcImZsYXRcIiBvcHRpb25zIChub3QgdG8gYmUgZGVlcCBleHRlbmRlZClcbi8vIEZpeGVzICM5ODg3XG5mdW5jdGlvbiBhamF4RXh0ZW5kKCB0YXJnZXQsIHNyYyApIHtcblx0dmFyIGtleSwgZGVlcCxcblx0XHRmbGF0T3B0aW9ucyA9IGpRdWVyeS5hamF4U2V0dGluZ3MuZmxhdE9wdGlvbnMgfHwge307XG5cdGZvcigga2V5IGluIHNyYyApIHtcblx0XHRpZiAoIHNyY1sga2V5IF0gIT09IHVuZGVmaW5lZCApIHtcblx0XHRcdCggZmxhdE9wdGlvbnNbIGtleSBdID8gdGFyZ2V0IDogKCBkZWVwIHx8ICggZGVlcCA9IHt9ICkgKSApWyBrZXkgXSA9IHNyY1sga2V5IF07XG5cdFx0fVxuXHR9XG5cdGlmICggZGVlcCApIHtcblx0XHRqUXVlcnkuZXh0ZW5kKCB0cnVlLCB0YXJnZXQsIGRlZXAgKTtcblx0fVxufVxuXG5qUXVlcnkuZm4uZXh0ZW5kKHtcblx0bG9hZDogZnVuY3Rpb24oIHVybCwgcGFyYW1zLCBjYWxsYmFjayApIHtcblx0XHRpZiAoIHR5cGVvZiB1cmwgIT09IFwic3RyaW5nXCIgJiYgX2xvYWQgKSB7XG5cdFx0XHRyZXR1cm4gX2xvYWQuYXBwbHkoIHRoaXMsIGFyZ3VtZW50cyApO1xuXG5cdFx0Ly8gRG9uJ3QgZG8gYSByZXF1ZXN0IGlmIG5vIGVsZW1lbnRzIGFyZSBiZWluZyByZXF1ZXN0ZWRcblx0XHR9IGVsc2UgaWYgKCAhdGhpcy5sZW5ndGggKSB7XG5cdFx0XHRyZXR1cm4gdGhpcztcblx0XHR9XG5cblx0XHR2YXIgb2ZmID0gdXJsLmluZGV4T2YoIFwiIFwiICk7XG5cdFx0aWYgKCBvZmYgPj0gMCApIHtcblx0XHRcdHZhciBzZWxlY3RvciA9IHVybC5zbGljZSggb2ZmLCB1cmwubGVuZ3RoICk7XG5cdFx0XHR1cmwgPSB1cmwuc2xpY2UoIDAsIG9mZiApO1xuXHRcdH1cblxuXHRcdC8vIERlZmF1bHQgdG8gYSBHRVQgcmVxdWVzdFxuXHRcdHZhciB0eXBlID0gXCJHRVRcIjtcblxuXHRcdC8vIElmIHRoZSBzZWNvbmQgcGFyYW1ldGVyIHdhcyBwcm92aWRlZFxuXHRcdGlmICggcGFyYW1zICkge1xuXHRcdFx0Ly8gSWYgaXQncyBhIGZ1bmN0aW9uXG5cdFx0XHRpZiAoIGpRdWVyeS5pc0Z1bmN0aW9uKCBwYXJhbXMgKSApIHtcblx0XHRcdFx0Ly8gV2UgYXNzdW1lIHRoYXQgaXQncyB0aGUgY2FsbGJhY2tcblx0XHRcdFx0Y2FsbGJhY2sgPSBwYXJhbXM7XG5cdFx0XHRcdHBhcmFtcyA9IHVuZGVmaW5lZDtcblxuXHRcdFx0Ly8gT3RoZXJ3aXNlLCBidWlsZCBhIHBhcmFtIHN0cmluZ1xuXHRcdFx0fSBlbHNlIGlmICggdHlwZW9mIHBhcmFtcyA9PT0gXCJvYmplY3RcIiApIHtcblx0XHRcdFx0cGFyYW1zID0galF1ZXJ5LnBhcmFtKCBwYXJhbXMsIGpRdWVyeS5hamF4U2V0dGluZ3MudHJhZGl0aW9uYWwgKTtcblx0XHRcdFx0dHlwZSA9IFwiUE9TVFwiO1xuXHRcdFx0fVxuXHRcdH1cblxuXHRcdHZhciBzZWxmID0gdGhpcztcblxuXHRcdC8vIFJlcXVlc3QgdGhlIHJlbW90ZSBkb2N1bWVudFxuXHRcdGpRdWVyeS5hamF4KHtcblx0XHRcdHVybDogdXJsLFxuXHRcdFx0dHlwZTogdHlwZSxcblx0XHRcdGRhdGFUeXBlOiBcImh0bWxcIixcblx0XHRcdGRhdGE6IHBhcmFtcyxcblx0XHRcdC8vIENvbXBsZXRlIGNhbGxiYWNrIChyZXNwb25zZVRleHQgaXMgdXNlZCBpbnRlcm5hbGx5KVxuXHRcdFx0Y29tcGxldGU6IGZ1bmN0aW9uKCBqcVhIUiwgc3RhdHVzLCByZXNwb25zZVRleHQgKSB7XG5cdFx0XHRcdC8vIFN0b3JlIHRoZSByZXNwb25zZSBhcyBzcGVjaWZpZWQgYnkgdGhlIGpxWEhSIG9iamVjdFxuXHRcdFx0XHRyZXNwb25zZVRleHQgPSBqcVhIUi5yZXNwb25zZVRleHQ7XG5cdFx0XHRcdC8vIElmIHN1Y2Nlc3NmdWwsIGluamVjdCB0aGUgSFRNTCBpbnRvIGFsbCB0aGUgbWF0Y2hlZCBlbGVtZW50c1xuXHRcdFx0XHRpZiAoIGpxWEhSLmlzUmVzb2x2ZWQoKSApIHtcblx0XHRcdFx0XHQvLyAjNDgyNTogR2V0IHRoZSBhY3R1YWwgcmVzcG9uc2UgaW4gY2FzZVxuXHRcdFx0XHRcdC8vIGEgZGF0YUZpbHRlciBpcyBwcmVzZW50IGluIGFqYXhTZXR0aW5nc1xuXHRcdFx0XHRcdGpxWEhSLmRvbmUoZnVuY3Rpb24oIHIgKSB7XG5cdFx0XHRcdFx0XHRyZXNwb25zZVRleHQgPSByO1xuXHRcdFx0XHRcdH0pO1xuXHRcdFx0XHRcdC8vIFNlZSBpZiBhIHNlbGVjdG9yIHdhcyBzcGVjaWZpZWRcblx0XHRcdFx0XHRzZWxmLmh0bWwoIHNlbGVjdG9yID9cblx0XHRcdFx0XHRcdC8vIENyZWF0ZSBhIGR1bW15IGRpdiB0byBob2xkIHRoZSByZXN1bHRzXG5cdFx0XHRcdFx0XHRqUXVlcnkoXCI8ZGl2PlwiKVxuXHRcdFx0XHRcdFx0XHQvLyBpbmplY3QgdGhlIGNvbnRlbnRzIG9mIHRoZSBkb2N1bWVudCBpbiwgcmVtb3ZpbmcgdGhlIHNjcmlwdHNcblx0XHRcdFx0XHRcdFx0Ly8gdG8gYXZvaWQgYW55ICdQZXJtaXNzaW9uIERlbmllZCcgZXJyb3JzIGluIElFXG5cdFx0XHRcdFx0XHRcdC5hcHBlbmQocmVzcG9uc2VUZXh0LnJlcGxhY2UocnNjcmlwdCwgXCJcIikpXG5cblx0XHRcdFx0XHRcdFx0Ly8gTG9jYXRlIHRoZSBzcGVjaWZpZWQgZWxlbWVudHNcblx0XHRcdFx0XHRcdFx0LmZpbmQoc2VsZWN0b3IpIDpcblxuXHRcdFx0XHRcdFx0Ly8gSWYgbm90LCBqdXN0IGluamVjdCB0aGUgZnVsbCByZXN1bHRcblx0XHRcdFx0XHRcdHJlc3BvbnNlVGV4dCApO1xuXHRcdFx0XHR9XG5cblx0XHRcdFx0aWYgKCBjYWxsYmFjayApIHtcblx0XHRcdFx0XHRzZWxmLmVhY2goIGNhbGxiYWNrLCBbIHJlc3BvbnNlVGV4dCwgc3RhdHVzLCBqcVhIUiBdICk7XG5cdFx0XHRcdH1cblx0XHRcdH1cblx0XHR9KTtcblxuXHRcdHJldHVybiB0aGlzO1xuXHR9LFxuXG5cdHNlcmlhbGl6ZTogZnVuY3Rpb24oKSB7XG5cdFx0cmV0dXJuIGpRdWVyeS5wYXJhbSggdGhpcy5zZXJpYWxpemVBcnJheSgpICk7XG5cdH0sXG5cblx0c2VyaWFsaXplQXJyYXk6IGZ1bmN0aW9uKCkge1xuXHRcdHJldHVybiB0aGlzLm1hcChmdW5jdGlvbigpe1xuXHRcdFx0cmV0dXJuIHRoaXMuZWxlbWVudHMgPyBqUXVlcnkubWFrZUFycmF5KCB0aGlzLmVsZW1lbnRzICkgOiB0aGlzO1xuXHRcdH0pXG5cdFx0LmZpbHRlcihmdW5jdGlvbigpe1xuXHRcdFx0cmV0dXJuIHRoaXMubmFtZSAmJiAhdGhpcy5kaXNhYmxlZCAmJlxuXHRcdFx0XHQoIHRoaXMuY2hlY2tlZCB8fCByc2VsZWN0VGV4dGFyZWEudGVzdCggdGhpcy5ub2RlTmFtZSApIHx8XG5cdFx0XHRcdFx0cmlucHV0LnRlc3QoIHRoaXMudHlwZSApICk7XG5cdFx0fSlcblx0XHQubWFwKGZ1bmN0aW9uKCBpLCBlbGVtICl7XG5cdFx0XHR2YXIgdmFsID0galF1ZXJ5KCB0aGlzICkudmFsKCk7XG5cblx0XHRcdHJldHVybiB2YWwgPT0gbnVsbCA/XG5cdFx0XHRcdG51bGwgOlxuXHRcdFx0XHRqUXVlcnkuaXNBcnJheSggdmFsICkgP1xuXHRcdFx0XHRcdGpRdWVyeS5tYXAoIHZhbCwgZnVuY3Rpb24oIHZhbCwgaSApe1xuXHRcdFx0XHRcdFx0cmV0dXJuIHsgbmFtZTogZWxlbS5uYW1lLCB2YWx1ZTogdmFsLnJlcGxhY2UoIHJDUkxGLCBcIlxcclxcblwiICkgfTtcblx0XHRcdFx0XHR9KSA6XG5cdFx0XHRcdFx0eyBuYW1lOiBlbGVtLm5hbWUsIHZhbHVlOiB2YWwucmVwbGFjZSggckNSTEYsIFwiXFxyXFxuXCIgKSB9O1xuXHRcdH0pLmdldCgpO1xuXHR9XG59KTtcblxuLy8gQXR0YWNoIGEgYnVuY2ggb2YgZnVuY3Rpb25zIGZvciBoYW5kbGluZyBjb21tb24gQUpBWCBldmVudHNcbmpRdWVyeS5lYWNoKCBcImFqYXhTdGFydCBhamF4U3RvcCBhamF4Q29tcGxldGUgYWpheEVycm9yIGFqYXhTdWNjZXNzIGFqYXhTZW5kXCIuc3BsaXQoIFwiIFwiICksIGZ1bmN0aW9uKCBpLCBvICl7XG5cdGpRdWVyeS5mblsgbyBdID0gZnVuY3Rpb24oIGYgKXtcblx0XHRyZXR1cm4gdGhpcy5iaW5kKCBvLCBmICk7XG5cdH07XG59KTtcblxualF1ZXJ5LmVhY2goIFsgXCJnZXRcIiwgXCJwb3N0XCIgXSwgZnVuY3Rpb24oIGksIG1ldGhvZCApIHtcblx0alF1ZXJ5WyBtZXRob2QgXSA9IGZ1bmN0aW9uKCB1cmwsIGRhdGEsIGNhbGxiYWNrLCB0eXBlICkge1xuXHRcdC8vIHNoaWZ0IGFyZ3VtZW50cyBpZiBkYXRhIGFyZ3VtZW50IHdhcyBvbWl0dGVkXG5cdFx0aWYgKCBqUXVlcnkuaXNGdW5jdGlvbiggZGF0YSApICkge1xuXHRcdFx0dHlwZSA9IHR5cGUgfHwgY2FsbGJhY2s7XG5cdFx0XHRjYWxsYmFjayA9IGRhdGE7XG5cdFx0XHRkYXRhID0gdW5kZWZpbmVkO1xuXHRcdH1cblxuXHRcdHJldHVybiBqUXVlcnkuYWpheCh7XG5cdFx0XHR0eXBlOiBtZXRob2QsXG5cdFx0XHR1cmw6IHVybCxcblx0XHRcdGRhdGE6IGRhdGEsXG5cdFx0XHRzdWNjZXNzOiBjYWxsYmFjayxcblx0XHRcdGRhdGFUeXBlOiB0eXBlXG5cdFx0fSk7XG5cdH07XG59KTtcblxualF1ZXJ5LmV4dGVuZCh7XG5cblx0Z2V0U2NyaXB0OiBmdW5jdGlvbiggdXJsLCBjYWxsYmFjayApIHtcblx0XHRyZXR1cm4galF1ZXJ5LmdldCggdXJsLCB1bmRlZmluZWQsIGNhbGxiYWNrLCBcInNjcmlwdFwiICk7XG5cdH0sXG5cblx0Z2V0SlNPTjogZnVuY3Rpb24oIHVybCwgZGF0YSwgY2FsbGJhY2sgKSB7XG5cdFx0cmV0dXJuIGpRdWVyeS5nZXQoIHVybCwgZGF0YSwgY2FsbGJhY2ssIFwianNvblwiICk7XG5cdH0sXG5cblx0Ly8gQ3JlYXRlcyBhIGZ1bGwgZmxlZGdlZCBzZXR0aW5ncyBvYmplY3QgaW50byB0YXJnZXRcblx0Ly8gd2l0aCBib3RoIGFqYXhTZXR0aW5ncyBhbmQgc2V0dGluZ3MgZmllbGRzLlxuXHQvLyBJZiB0YXJnZXQgaXMgb21pdHRlZCwgd3JpdGVzIGludG8gYWpheFNldHRpbmdzLlxuXHRhamF4U2V0dXA6IGZ1bmN0aW9uKCB0YXJnZXQsIHNldHRpbmdzICkge1xuXHRcdGlmICggc2V0dGluZ3MgKSB7XG5cdFx0XHQvLyBCdWlsZGluZyBhIHNldHRpbmdzIG9iamVjdFxuXHRcdFx0YWpheEV4dGVuZCggdGFyZ2V0LCBqUXVlcnkuYWpheFNldHRpbmdzICk7XG5cdFx0fSBlbHNlIHtcblx0XHRcdC8vIEV4dGVuZGluZyBhamF4U2V0dGluZ3Ncblx0XHRcdHNldHRpbmdzID0gdGFyZ2V0O1xuXHRcdFx0dGFyZ2V0ID0galF1ZXJ5LmFqYXhTZXR0aW5ncztcblx0XHR9XG5cdFx0YWpheEV4dGVuZCggdGFyZ2V0LCBzZXR0aW5ncyApO1xuXHRcdHJldHVybiB0YXJnZXQ7XG5cdH0sXG5cblx0YWpheFNldHRpbmdzOiB7XG5cdFx0dXJsOiBhamF4TG9jYXRpb24sXG5cdFx0aXNMb2NhbDogcmxvY2FsUHJvdG9jb2wudGVzdCggYWpheExvY1BhcnRzWyAxIF0gKSxcblx0XHRnbG9iYWw6IHRydWUsXG5cdFx0dHlwZTogXCJHRVRcIixcblx0XHRjb250ZW50VHlwZTogXCJhcHBsaWNhdGlvbi94LXd3dy1mb3JtLXVybGVuY29kZWRcIixcblx0XHRwcm9jZXNzRGF0YTogdHJ1ZSxcblx0XHRhc3luYzogdHJ1ZSxcblx0XHQvKlxuXHRcdHRpbWVvdXQ6IDAsXG5cdFx0ZGF0YTogbnVsbCxcblx0XHRkYXRhVHlwZTogbnVsbCxcblx0XHR1c2VybmFtZTogbnVsbCxcblx0XHRwYXNzd29yZDogbnVsbCxcblx0XHRjYWNoZTogbnVsbCxcblx0XHR0cmFkaXRpb25hbDogZmFsc2UsXG5cdFx0aGVhZGVyczoge30sXG5cdFx0Ki9cblxuXHRcdGFjY2VwdHM6IHtcblx0XHRcdHhtbDogXCJhcHBsaWNhdGlvbi94bWwsIHRleHQveG1sXCIsXG5cdFx0XHRodG1sOiBcInRleHQvaHRtbFwiLFxuXHRcdFx0dGV4dDogXCJ0ZXh0L3BsYWluXCIsXG5cdFx0XHRqc29uOiBcImFwcGxpY2F0aW9uL2pzb24sIHRleHQvamF2YXNjcmlwdFwiLFxuXHRcdFx0XCIqXCI6IGFsbFR5cGVzXG5cdFx0fSxcblxuXHRcdGNvbnRlbnRzOiB7XG5cdFx0XHR4bWw6IC94bWwvLFxuXHRcdFx0aHRtbDogL2h0bWwvLFxuXHRcdFx0anNvbjogL2pzb24vXG5cdFx0fSxcblxuXHRcdHJlc3BvbnNlRmllbGRzOiB7XG5cdFx0XHR4bWw6IFwicmVzcG9uc2VYTUxcIixcblx0XHRcdHRleHQ6IFwicmVzcG9uc2VUZXh0XCJcblx0XHR9LFxuXG5cdFx0Ly8gTGlzdCBvZiBkYXRhIGNvbnZlcnRlcnNcblx0XHQvLyAxKSBrZXkgZm9ybWF0IGlzIFwic291cmNlX3R5cGUgZGVzdGluYXRpb25fdHlwZVwiIChhIHNpbmdsZSBzcGFjZSBpbi1iZXR3ZWVuKVxuXHRcdC8vIDIpIHRoZSBjYXRjaGFsbCBzeW1ib2wgXCIqXCIgY2FuIGJlIHVzZWQgZm9yIHNvdXJjZV90eXBlXG5cdFx0Y29udmVydGVyczoge1xuXG5cdFx0XHQvLyBDb252ZXJ0IGFueXRoaW5nIHRvIHRleHRcblx0XHRcdFwiKiB0ZXh0XCI6IHdpbmRvdy5TdHJpbmcsXG5cblx0XHRcdC8vIFRleHQgdG8gaHRtbCAodHJ1ZSA9IG5vIHRyYW5zZm9ybWF0aW9uKVxuXHRcdFx0XCJ0ZXh0IGh0bWxcIjogdHJ1ZSxcblxuXHRcdFx0Ly8gRXZhbHVhdGUgdGV4dCBhcyBhIGpzb24gZXhwcmVzc2lvblxuXHRcdFx0XCJ0ZXh0IGpzb25cIjogalF1ZXJ5LnBhcnNlSlNPTixcblxuXHRcdFx0Ly8gUGFyc2UgdGV4dCBhcyB4bWxcblx0XHRcdFwidGV4dCB4bWxcIjogalF1ZXJ5LnBhcnNlWE1MXG5cdFx0fSxcblxuXHRcdC8vIEZvciBvcHRpb25zIHRoYXQgc2hvdWxkbid0IGJlIGRlZXAgZXh0ZW5kZWQ6XG5cdFx0Ly8geW91IGNhbiBhZGQgeW91ciBvd24gY3VzdG9tIG9wdGlvbnMgaGVyZSBpZlxuXHRcdC8vIGFuZCB3aGVuIHlvdSBjcmVhdGUgb25lIHRoYXQgc2hvdWxkbid0IGJlXG5cdFx0Ly8gZGVlcCBleHRlbmRlZCAoc2VlIGFqYXhFeHRlbmQpXG5cdFx0ZmxhdE9wdGlvbnM6IHtcblx0XHRcdGNvbnRleHQ6IHRydWUsXG5cdFx0XHR1cmw6IHRydWVcblx0XHR9XG5cdH0sXG5cblx0YWpheFByZWZpbHRlcjogYWRkVG9QcmVmaWx0ZXJzT3JUcmFuc3BvcnRzKCBwcmVmaWx0ZXJzICksXG5cdGFqYXhUcmFuc3BvcnQ6IGFkZFRvUHJlZmlsdGVyc09yVHJhbnNwb3J0cyggdHJhbnNwb3J0cyApLFxuXG5cdC8vIE1haW4gbWV0aG9kXG5cdGFqYXg6IGZ1bmN0aW9uKCB1cmwsIG9wdGlvbnMgKSB7XG5cblx0XHQvLyBJZiB1cmwgaXMgYW4gb2JqZWN0LCBzaW11bGF0ZSBwcmUtMS41IHNpZ25hdHVyZVxuXHRcdGlmICggdHlwZW9mIHVybCA9PT0gXCJvYmplY3RcIiApIHtcblx0XHRcdG9wdGlvbnMgPSB1cmw7XG5cdFx0XHR1cmwgPSB1bmRlZmluZWQ7XG5cdFx0fVxuXG5cdFx0Ly8gRm9yY2Ugb3B0aW9ucyB0byBiZSBhbiBvYmplY3Rcblx0XHRvcHRpb25zID0gb3B0aW9ucyB8fCB7fTtcblxuXHRcdHZhciAvLyBDcmVhdGUgdGhlIGZpbmFsIG9wdGlvbnMgb2JqZWN0XG5cdFx0XHRzID0galF1ZXJ5LmFqYXhTZXR1cCgge30sIG9wdGlvbnMgKSxcblx0XHRcdC8vIENhbGxiYWNrcyBjb250ZXh0XG5cdFx0XHRjYWxsYmFja0NvbnRleHQgPSBzLmNvbnRleHQgfHwgcyxcblx0XHRcdC8vIENvbnRleHQgZm9yIGdsb2JhbCBldmVudHNcblx0XHRcdC8vIEl0J3MgdGhlIGNhbGxiYWNrQ29udGV4dCBpZiBvbmUgd2FzIHByb3ZpZGVkIGluIHRoZSBvcHRpb25zXG5cdFx0XHQvLyBhbmQgaWYgaXQncyBhIERPTSBub2RlIG9yIGEgalF1ZXJ5IGNvbGxlY3Rpb25cblx0XHRcdGdsb2JhbEV2ZW50Q29udGV4dCA9IGNhbGxiYWNrQ29udGV4dCAhPT0gcyAmJlxuXHRcdFx0XHQoIGNhbGxiYWNrQ29udGV4dC5ub2RlVHlwZSB8fCBjYWxsYmFja0NvbnRleHQgaW5zdGFuY2VvZiBqUXVlcnkgKSA/XG5cdFx0XHRcdFx0XHRqUXVlcnkoIGNhbGxiYWNrQ29udGV4dCApIDogalF1ZXJ5LmV2ZW50LFxuXHRcdFx0Ly8gRGVmZXJyZWRzXG5cdFx0XHRkZWZlcnJlZCA9IGpRdWVyeS5EZWZlcnJlZCgpLFxuXHRcdFx0Y29tcGxldGVEZWZlcnJlZCA9IGpRdWVyeS5DYWxsYmFja3MoIFwib25jZSBtZW1vcnlcIiApLFxuXHRcdFx0Ly8gU3RhdHVzLWRlcGVuZGVudCBjYWxsYmFja3Ncblx0XHRcdHN0YXR1c0NvZGUgPSBzLnN0YXR1c0NvZGUgfHwge30sXG5cdFx0XHQvLyBpZk1vZGlmaWVkIGtleVxuXHRcdFx0aWZNb2RpZmllZEtleSxcblx0XHRcdC8vIEhlYWRlcnMgKHRoZXkgYXJlIHNlbnQgYWxsIGF0IG9uY2UpXG5cdFx0XHRyZXF1ZXN0SGVhZGVycyA9IHt9LFxuXHRcdFx0cmVxdWVzdEhlYWRlcnNOYW1lcyA9IHt9LFxuXHRcdFx0Ly8gUmVzcG9uc2UgaGVhZGVyc1xuXHRcdFx0cmVzcG9uc2VIZWFkZXJzU3RyaW5nLFxuXHRcdFx0cmVzcG9uc2VIZWFkZXJzLFxuXHRcdFx0Ly8gdHJhbnNwb3J0XG5cdFx0XHR0cmFuc3BvcnQsXG5cdFx0XHQvLyB0aW1lb3V0IGhhbmRsZVxuXHRcdFx0dGltZW91dFRpbWVyLFxuXHRcdFx0Ly8gQ3Jvc3MtZG9tYWluIGRldGVjdGlvbiB2YXJzXG5cdFx0XHRwYXJ0cyxcblx0XHRcdC8vIFRoZSBqcVhIUiBzdGF0ZVxuXHRcdFx0c3RhdGUgPSAwLFxuXHRcdFx0Ly8gVG8ga25vdyBpZiBnbG9iYWwgZXZlbnRzIGFyZSB0byBiZSBkaXNwYXRjaGVkXG5cdFx0XHRmaXJlR2xvYmFscyxcblx0XHRcdC8vIExvb3AgdmFyaWFibGVcblx0XHRcdGksXG5cdFx0XHQvLyBGYWtlIHhoclxuXHRcdFx0anFYSFIgPSB7XG5cblx0XHRcdFx0cmVhZHlTdGF0ZTogMCxcblxuXHRcdFx0XHQvLyBDYWNoZXMgdGhlIGhlYWRlclxuXHRcdFx0XHRzZXRSZXF1ZXN0SGVhZGVyOiBmdW5jdGlvbiggbmFtZSwgdmFsdWUgKSB7XG5cdFx0XHRcdFx0aWYgKCAhc3RhdGUgKSB7XG5cdFx0XHRcdFx0XHR2YXIgbG5hbWUgPSBuYW1lLnRvTG93ZXJDYXNlKCk7XG5cdFx0XHRcdFx0XHRuYW1lID0gcmVxdWVzdEhlYWRlcnNOYW1lc1sgbG5hbWUgXSA9IHJlcXVlc3RIZWFkZXJzTmFtZXNbIGxuYW1lIF0gfHwgbmFtZTtcblx0XHRcdFx0XHRcdHJlcXVlc3RIZWFkZXJzWyBuYW1lIF0gPSB2YWx1ZTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0cmV0dXJuIHRoaXM7XG5cdFx0XHRcdH0sXG5cblx0XHRcdFx0Ly8gUmF3IHN0cmluZ1xuXHRcdFx0XHRnZXRBbGxSZXNwb25zZUhlYWRlcnM6IGZ1bmN0aW9uKCkge1xuXHRcdFx0XHRcdHJldHVybiBzdGF0ZSA9PT0gMiA/IHJlc3BvbnNlSGVhZGVyc1N0cmluZyA6IG51bGw7XG5cdFx0XHRcdH0sXG5cblx0XHRcdFx0Ly8gQnVpbGRzIGhlYWRlcnMgaGFzaHRhYmxlIGlmIG5lZWRlZFxuXHRcdFx0XHRnZXRSZXNwb25zZUhlYWRlcjogZnVuY3Rpb24oIGtleSApIHtcblx0XHRcdFx0XHR2YXIgbWF0Y2g7XG5cdFx0XHRcdFx0aWYgKCBzdGF0ZSA9PT0gMiApIHtcblx0XHRcdFx0XHRcdGlmICggIXJlc3BvbnNlSGVhZGVycyApIHtcblx0XHRcdFx0XHRcdFx0cmVzcG9uc2VIZWFkZXJzID0ge307XG5cdFx0XHRcdFx0XHRcdHdoaWxlKCAoIG1hdGNoID0gcmhlYWRlcnMuZXhlYyggcmVzcG9uc2VIZWFkZXJzU3RyaW5nICkgKSApIHtcblx0XHRcdFx0XHRcdFx0XHRyZXNwb25zZUhlYWRlcnNbIG1hdGNoWzFdLnRvTG93ZXJDYXNlKCkgXSA9IG1hdGNoWyAyIF07XG5cdFx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdG1hdGNoID0gcmVzcG9uc2VIZWFkZXJzWyBrZXkudG9Mb3dlckNhc2UoKSBdO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0XHRyZXR1cm4gbWF0Y2ggPT09IHVuZGVmaW5lZCA/IG51bGwgOiBtYXRjaDtcblx0XHRcdFx0fSxcblxuXHRcdFx0XHQvLyBPdmVycmlkZXMgcmVzcG9uc2UgY29udGVudC10eXBlIGhlYWRlclxuXHRcdFx0XHRvdmVycmlkZU1pbWVUeXBlOiBmdW5jdGlvbiggdHlwZSApIHtcblx0XHRcdFx0XHRpZiAoICFzdGF0ZSApIHtcblx0XHRcdFx0XHRcdHMubWltZVR5cGUgPSB0eXBlO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0XHRyZXR1cm4gdGhpcztcblx0XHRcdFx0fSxcblxuXHRcdFx0XHQvLyBDYW5jZWwgdGhlIHJlcXVlc3Rcblx0XHRcdFx0YWJvcnQ6IGZ1bmN0aW9uKCBzdGF0dXNUZXh0ICkge1xuXHRcdFx0XHRcdHN0YXR1c1RleHQgPSBzdGF0dXNUZXh0IHx8IFwiYWJvcnRcIjtcblx0XHRcdFx0XHRpZiAoIHRyYW5zcG9ydCApIHtcblx0XHRcdFx0XHRcdHRyYW5zcG9ydC5hYm9ydCggc3RhdHVzVGV4dCApO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0XHRkb25lKCAwLCBzdGF0dXNUZXh0ICk7XG5cdFx0XHRcdFx0cmV0dXJuIHRoaXM7XG5cdFx0XHRcdH1cblx0XHRcdH07XG5cblx0XHQvLyBDYWxsYmFjayBmb3Igd2hlbiBldmVyeXRoaW5nIGlzIGRvbmVcblx0XHQvLyBJdCBpcyBkZWZpbmVkIGhlcmUgYmVjYXVzZSBqc2xpbnQgY29tcGxhaW5zIGlmIGl0IGlzIGRlY2xhcmVkXG5cdFx0Ly8gYXQgdGhlIGVuZCBvZiB0aGUgZnVuY3Rpb24gKHdoaWNoIHdvdWxkIGJlIG1vcmUgbG9naWNhbCBhbmQgcmVhZGFibGUpXG5cdFx0ZnVuY3Rpb24gZG9uZSggc3RhdHVzLCBuYXRpdmVTdGF0dXNUZXh0LCByZXNwb25zZXMsIGhlYWRlcnMgKSB7XG5cblx0XHRcdC8vIENhbGxlZCBvbmNlXG5cdFx0XHRpZiAoIHN0YXRlID09PSAyICkge1xuXHRcdFx0XHRyZXR1cm47XG5cdFx0XHR9XG5cblx0XHRcdC8vIFN0YXRlIGlzIFwiZG9uZVwiIG5vd1xuXHRcdFx0c3RhdGUgPSAyO1xuXG5cdFx0XHQvLyBDbGVhciB0aW1lb3V0IGlmIGl0IGV4aXN0c1xuXHRcdFx0aWYgKCB0aW1lb3V0VGltZXIgKSB7XG5cdFx0XHRcdGNsZWFyVGltZW91dCggdGltZW91dFRpbWVyICk7XG5cdFx0XHR9XG5cblx0XHRcdC8vIERlcmVmZXJlbmNlIHRyYW5zcG9ydCBmb3IgZWFybHkgZ2FyYmFnZSBjb2xsZWN0aW9uXG5cdFx0XHQvLyAobm8gbWF0dGVyIGhvdyBsb25nIHRoZSBqcVhIUiBvYmplY3Qgd2lsbCBiZSB1c2VkKVxuXHRcdFx0dHJhbnNwb3J0ID0gdW5kZWZpbmVkO1xuXG5cdFx0XHQvLyBDYWNoZSByZXNwb25zZSBoZWFkZXJzXG5cdFx0XHRyZXNwb25zZUhlYWRlcnNTdHJpbmcgPSBoZWFkZXJzIHx8IFwiXCI7XG5cblx0XHRcdC8vIFNldCByZWFkeVN0YXRlXG5cdFx0XHRqcVhIUi5yZWFkeVN0YXRlID0gc3RhdHVzID4gMCA/IDQgOiAwO1xuXG5cdFx0XHR2YXIgaXNTdWNjZXNzLFxuXHRcdFx0XHRzdWNjZXNzLFxuXHRcdFx0XHRlcnJvcixcblx0XHRcdFx0c3RhdHVzVGV4dCA9IG5hdGl2ZVN0YXR1c1RleHQsXG5cdFx0XHRcdHJlc3BvbnNlID0gcmVzcG9uc2VzID8gYWpheEhhbmRsZVJlc3BvbnNlcyggcywganFYSFIsIHJlc3BvbnNlcyApIDogdW5kZWZpbmVkLFxuXHRcdFx0XHRsYXN0TW9kaWZpZWQsXG5cdFx0XHRcdGV0YWc7XG5cblx0XHRcdC8vIElmIHN1Y2Nlc3NmdWwsIGhhbmRsZSB0eXBlIGNoYWluaW5nXG5cdFx0XHRpZiAoIHN0YXR1cyA+PSAyMDAgJiYgc3RhdHVzIDwgMzAwIHx8IHN0YXR1cyA9PT0gMzA0ICkge1xuXG5cdFx0XHRcdC8vIFNldCB0aGUgSWYtTW9kaWZpZWQtU2luY2UgYW5kL29yIElmLU5vbmUtTWF0Y2ggaGVhZGVyLCBpZiBpbiBpZk1vZGlmaWVkIG1vZGUuXG5cdFx0XHRcdGlmICggcy5pZk1vZGlmaWVkICkge1xuXG5cdFx0XHRcdFx0aWYgKCAoIGxhc3RNb2RpZmllZCA9IGpxWEhSLmdldFJlc3BvbnNlSGVhZGVyKCBcIkxhc3QtTW9kaWZpZWRcIiApICkgKSB7XG5cdFx0XHRcdFx0XHRqUXVlcnkubGFzdE1vZGlmaWVkWyBpZk1vZGlmaWVkS2V5IF0gPSBsYXN0TW9kaWZpZWQ7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHRcdGlmICggKCBldGFnID0ganFYSFIuZ2V0UmVzcG9uc2VIZWFkZXIoIFwiRXRhZ1wiICkgKSApIHtcblx0XHRcdFx0XHRcdGpRdWVyeS5ldGFnWyBpZk1vZGlmaWVkS2V5IF0gPSBldGFnO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0fVxuXG5cdFx0XHRcdC8vIElmIG5vdCBtb2RpZmllZFxuXHRcdFx0XHRpZiAoIHN0YXR1cyA9PT0gMzA0ICkge1xuXG5cdFx0XHRcdFx0c3RhdHVzVGV4dCA9IFwibm90bW9kaWZpZWRcIjtcblx0XHRcdFx0XHRpc1N1Y2Nlc3MgPSB0cnVlO1xuXG5cdFx0XHRcdC8vIElmIHdlIGhhdmUgZGF0YVxuXHRcdFx0XHR9IGVsc2Uge1xuXG5cdFx0XHRcdFx0dHJ5IHtcblx0XHRcdFx0XHRcdHN1Y2Nlc3MgPSBhamF4Q29udmVydCggcywgcmVzcG9uc2UgKTtcblx0XHRcdFx0XHRcdHN0YXR1c1RleHQgPSBcInN1Y2Nlc3NcIjtcblx0XHRcdFx0XHRcdGlzU3VjY2VzcyA9IHRydWU7XG5cdFx0XHRcdFx0fSBjYXRjaChlKSB7XG5cdFx0XHRcdFx0XHQvLyBXZSBoYXZlIGEgcGFyc2VyZXJyb3Jcblx0XHRcdFx0XHRcdHN0YXR1c1RleHQgPSBcInBhcnNlcmVycm9yXCI7XG5cdFx0XHRcdFx0XHRlcnJvciA9IGU7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9XG5cdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHQvLyBXZSBleHRyYWN0IGVycm9yIGZyb20gc3RhdHVzVGV4dFxuXHRcdFx0XHQvLyB0aGVuIG5vcm1hbGl6ZSBzdGF0dXNUZXh0IGFuZCBzdGF0dXMgZm9yIG5vbi1hYm9ydHNcblx0XHRcdFx0ZXJyb3IgPSBzdGF0dXNUZXh0O1xuXHRcdFx0XHRpZiggIXN0YXR1c1RleHQgfHwgc3RhdHVzICkge1xuXHRcdFx0XHRcdHN0YXR1c1RleHQgPSBcImVycm9yXCI7XG5cdFx0XHRcdFx0aWYgKCBzdGF0dXMgPCAwICkge1xuXHRcdFx0XHRcdFx0c3RhdHVzID0gMDtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH1cblx0XHRcdH1cblxuXHRcdFx0Ly8gU2V0IGRhdGEgZm9yIHRoZSBmYWtlIHhociBvYmplY3Rcblx0XHRcdGpxWEhSLnN0YXR1cyA9IHN0YXR1cztcblx0XHRcdGpxWEhSLnN0YXR1c1RleHQgPSBcIlwiICsgKCBuYXRpdmVTdGF0dXNUZXh0IHx8IHN0YXR1c1RleHQgKTtcblxuXHRcdFx0Ly8gU3VjY2Vzcy9FcnJvclxuXHRcdFx0aWYgKCBpc1N1Y2Nlc3MgKSB7XG5cdFx0XHRcdGRlZmVycmVkLnJlc29sdmVXaXRoKCBjYWxsYmFja0NvbnRleHQsIFsgc3VjY2Vzcywgc3RhdHVzVGV4dCwganFYSFIgXSApO1xuXHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0ZGVmZXJyZWQucmVqZWN0V2l0aCggY2FsbGJhY2tDb250ZXh0LCBbIGpxWEhSLCBzdGF0dXNUZXh0LCBlcnJvciBdICk7XG5cdFx0XHR9XG5cblx0XHRcdC8vIFN0YXR1cy1kZXBlbmRlbnQgY2FsbGJhY2tzXG5cdFx0XHRqcVhIUi5zdGF0dXNDb2RlKCBzdGF0dXNDb2RlICk7XG5cdFx0XHRzdGF0dXNDb2RlID0gdW5kZWZpbmVkO1xuXG5cdFx0XHRpZiAoIGZpcmVHbG9iYWxzICkge1xuXHRcdFx0XHRnbG9iYWxFdmVudENvbnRleHQudHJpZ2dlciggXCJhamF4XCIgKyAoIGlzU3VjY2VzcyA/IFwiU3VjY2Vzc1wiIDogXCJFcnJvclwiICksXG5cdFx0XHRcdFx0XHRbIGpxWEhSLCBzLCBpc1N1Y2Nlc3MgPyBzdWNjZXNzIDogZXJyb3IgXSApO1xuXHRcdFx0fVxuXG5cdFx0XHQvLyBDb21wbGV0ZVxuXHRcdFx0Y29tcGxldGVEZWZlcnJlZC5maXJlV2l0aCggY2FsbGJhY2tDb250ZXh0LCBbIGpxWEhSLCBzdGF0dXNUZXh0IF0gKTtcblxuXHRcdFx0aWYgKCBmaXJlR2xvYmFscyApIHtcblx0XHRcdFx0Z2xvYmFsRXZlbnRDb250ZXh0LnRyaWdnZXIoIFwiYWpheENvbXBsZXRlXCIsIFsganFYSFIsIHMgXSApO1xuXHRcdFx0XHQvLyBIYW5kbGUgdGhlIGdsb2JhbCBBSkFYIGNvdW50ZXJcblx0XHRcdFx0aWYgKCAhKCAtLWpRdWVyeS5hY3RpdmUgKSApIHtcblx0XHRcdFx0XHRqUXVlcnkuZXZlbnQudHJpZ2dlciggXCJhamF4U3RvcFwiICk7XG5cdFx0XHRcdH1cblx0XHRcdH1cblx0XHR9XG5cblx0XHQvLyBBdHRhY2ggZGVmZXJyZWRzXG5cdFx0ZGVmZXJyZWQucHJvbWlzZSgganFYSFIgKTtcblx0XHRqcVhIUi5zdWNjZXNzID0ganFYSFIuZG9uZTtcblx0XHRqcVhIUi5lcnJvciA9IGpxWEhSLmZhaWw7XG5cdFx0anFYSFIuY29tcGxldGUgPSBjb21wbGV0ZURlZmVycmVkLmFkZDtcblxuXHRcdC8vIFN0YXR1cy1kZXBlbmRlbnQgY2FsbGJhY2tzXG5cdFx0anFYSFIuc3RhdHVzQ29kZSA9IGZ1bmN0aW9uKCBtYXAgKSB7XG5cdFx0XHRpZiAoIG1hcCApIHtcblx0XHRcdFx0dmFyIHRtcDtcblx0XHRcdFx0aWYgKCBzdGF0ZSA8IDIgKSB7XG5cdFx0XHRcdFx0Zm9yKCB0bXAgaW4gbWFwICkge1xuXHRcdFx0XHRcdFx0c3RhdHVzQ29kZVsgdG1wIF0gPSBbIHN0YXR1c0NvZGVbdG1wXSwgbWFwW3RtcF0gXTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0dG1wID0gbWFwWyBqcVhIUi5zdGF0dXMgXTtcblx0XHRcdFx0XHRqcVhIUi50aGVuKCB0bXAsIHRtcCApO1xuXHRcdFx0XHR9XG5cdFx0XHR9XG5cdFx0XHRyZXR1cm4gdGhpcztcblx0XHR9O1xuXG5cdFx0Ly8gUmVtb3ZlIGhhc2ggY2hhcmFjdGVyICgjNzUzMTogYW5kIHN0cmluZyBwcm9tb3Rpb24pXG5cdFx0Ly8gQWRkIHByb3RvY29sIGlmIG5vdCBwcm92aWRlZCAoIzU4NjY6IElFNyBpc3N1ZSB3aXRoIHByb3RvY29sLWxlc3MgdXJscylcblx0XHQvLyBXZSBhbHNvIHVzZSB0aGUgdXJsIHBhcmFtZXRlciBpZiBhdmFpbGFibGVcblx0XHRzLnVybCA9ICggKCB1cmwgfHwgcy51cmwgKSArIFwiXCIgKS5yZXBsYWNlKCByaGFzaCwgXCJcIiApLnJlcGxhY2UoIHJwcm90b2NvbCwgYWpheExvY1BhcnRzWyAxIF0gKyBcIi8vXCIgKTtcblxuXHRcdC8vIEV4dHJhY3QgZGF0YVR5cGVzIGxpc3Rcblx0XHRzLmRhdGFUeXBlcyA9IGpRdWVyeS50cmltKCBzLmRhdGFUeXBlIHx8IFwiKlwiICkudG9Mb3dlckNhc2UoKS5zcGxpdCggcnNwYWNlc0FqYXggKTtcblxuXHRcdC8vIERldGVybWluZSBpZiBhIGNyb3NzLWRvbWFpbiByZXF1ZXN0IGlzIGluIG9yZGVyXG5cdFx0aWYgKCBzLmNyb3NzRG9tYWluID09IG51bGwgKSB7XG5cdFx0XHRwYXJ0cyA9IHJ1cmwuZXhlYyggcy51cmwudG9Mb3dlckNhc2UoKSApO1xuXHRcdFx0cy5jcm9zc0RvbWFpbiA9ICEhKCBwYXJ0cyAmJlxuXHRcdFx0XHQoIHBhcnRzWyAxIF0gIT0gYWpheExvY1BhcnRzWyAxIF0gfHwgcGFydHNbIDIgXSAhPSBhamF4TG9jUGFydHNbIDIgXSB8fFxuXHRcdFx0XHRcdCggcGFydHNbIDMgXSB8fCAoIHBhcnRzWyAxIF0gPT09IFwiaHR0cDpcIiA/IDgwIDogNDQzICkgKSAhPVxuXHRcdFx0XHRcdFx0KCBhamF4TG9jUGFydHNbIDMgXSB8fCAoIGFqYXhMb2NQYXJ0c1sgMSBdID09PSBcImh0dHA6XCIgPyA4MCA6IDQ0MyApICkgKVxuXHRcdFx0KTtcblx0XHR9XG5cblx0XHQvLyBDb252ZXJ0IGRhdGEgaWYgbm90IGFscmVhZHkgYSBzdHJpbmdcblx0XHRpZiAoIHMuZGF0YSAmJiBzLnByb2Nlc3NEYXRhICYmIHR5cGVvZiBzLmRhdGEgIT09IFwic3RyaW5nXCIgKSB7XG5cdFx0XHRzLmRhdGEgPSBqUXVlcnkucGFyYW0oIHMuZGF0YSwgcy50cmFkaXRpb25hbCApO1xuXHRcdH1cblxuXHRcdC8vIEFwcGx5IHByZWZpbHRlcnNcblx0XHRpbnNwZWN0UHJlZmlsdGVyc09yVHJhbnNwb3J0cyggcHJlZmlsdGVycywgcywgb3B0aW9ucywganFYSFIgKTtcblxuXHRcdC8vIElmIHJlcXVlc3Qgd2FzIGFib3J0ZWQgaW5zaWRlIGEgcHJlZmlsZXIsIHN0b3AgdGhlcmVcblx0XHRpZiAoIHN0YXRlID09PSAyICkge1xuXHRcdFx0cmV0dXJuIGZhbHNlO1xuXHRcdH1cblxuXHRcdC8vIFdlIGNhbiBmaXJlIGdsb2JhbCBldmVudHMgYXMgb2Ygbm93IGlmIGFza2VkIHRvXG5cdFx0ZmlyZUdsb2JhbHMgPSBzLmdsb2JhbDtcblxuXHRcdC8vIFVwcGVyY2FzZSB0aGUgdHlwZVxuXHRcdHMudHlwZSA9IHMudHlwZS50b1VwcGVyQ2FzZSgpO1xuXG5cdFx0Ly8gRGV0ZXJtaW5lIGlmIHJlcXVlc3QgaGFzIGNvbnRlbnRcblx0XHRzLmhhc0NvbnRlbnQgPSAhcm5vQ29udGVudC50ZXN0KCBzLnR5cGUgKTtcblxuXHRcdC8vIFdhdGNoIGZvciBhIG5ldyBzZXQgb2YgcmVxdWVzdHNcblx0XHRpZiAoIGZpcmVHbG9iYWxzICYmIGpRdWVyeS5hY3RpdmUrKyA9PT0gMCApIHtcblx0XHRcdGpRdWVyeS5ldmVudC50cmlnZ2VyKCBcImFqYXhTdGFydFwiICk7XG5cdFx0fVxuXG5cdFx0Ly8gTW9yZSBvcHRpb25zIGhhbmRsaW5nIGZvciByZXF1ZXN0cyB3aXRoIG5vIGNvbnRlbnRcblx0XHRpZiAoICFzLmhhc0NvbnRlbnQgKSB7XG5cblx0XHRcdC8vIElmIGRhdGEgaXMgYXZhaWxhYmxlLCBhcHBlbmQgZGF0YSB0byB1cmxcblx0XHRcdGlmICggcy5kYXRhICkge1xuXHRcdFx0XHRzLnVybCArPSAoIHJxdWVyeS50ZXN0KCBzLnVybCApID8gXCImXCIgOiBcIj9cIiApICsgcy5kYXRhO1xuXHRcdFx0XHQvLyAjOTY4MjogcmVtb3ZlIGRhdGEgc28gdGhhdCBpdCdzIG5vdCB1c2VkIGluIGFuIGV2ZW50dWFsIHJldHJ5XG5cdFx0XHRcdGRlbGV0ZSBzLmRhdGE7XG5cdFx0XHR9XG5cblx0XHRcdC8vIEdldCBpZk1vZGlmaWVkS2V5IGJlZm9yZSBhZGRpbmcgdGhlIGFudGktY2FjaGUgcGFyYW1ldGVyXG5cdFx0XHRpZk1vZGlmaWVkS2V5ID0gcy51cmw7XG5cblx0XHRcdC8vIEFkZCBhbnRpLWNhY2hlIGluIHVybCBpZiBuZWVkZWRcblx0XHRcdGlmICggcy5jYWNoZSA9PT0gZmFsc2UgKSB7XG5cblx0XHRcdFx0dmFyIHRzID0galF1ZXJ5Lm5vdygpLFxuXHRcdFx0XHRcdC8vIHRyeSByZXBsYWNpbmcgXz0gaWYgaXQgaXMgdGhlcmVcblx0XHRcdFx0XHRyZXQgPSBzLnVybC5yZXBsYWNlKCBydHMsIFwiJDFfPVwiICsgdHMgKTtcblxuXHRcdFx0XHQvLyBpZiBub3RoaW5nIHdhcyByZXBsYWNlZCwgYWRkIHRpbWVzdGFtcCB0byB0aGUgZW5kXG5cdFx0XHRcdHMudXJsID0gcmV0ICsgKCAocmV0ID09PSBzLnVybCApID8gKCBycXVlcnkudGVzdCggcy51cmwgKSA/IFwiJlwiIDogXCI/XCIgKSArIFwiXz1cIiArIHRzIDogXCJcIiApO1xuXHRcdFx0fVxuXHRcdH1cblxuXHRcdC8vIFNldCB0aGUgY29ycmVjdCBoZWFkZXIsIGlmIGRhdGEgaXMgYmVpbmcgc2VudFxuXHRcdGlmICggcy5kYXRhICYmIHMuaGFzQ29udGVudCAmJiBzLmNvbnRlbnRUeXBlICE9PSBmYWxzZSB8fCBvcHRpb25zLmNvbnRlbnRUeXBlICkge1xuXHRcdFx0anFYSFIuc2V0UmVxdWVzdEhlYWRlciggXCJDb250ZW50LVR5cGVcIiwgcy5jb250ZW50VHlwZSApO1xuXHRcdH1cblxuXHRcdC8vIFNldCB0aGUgSWYtTW9kaWZpZWQtU2luY2UgYW5kL29yIElmLU5vbmUtTWF0Y2ggaGVhZGVyLCBpZiBpbiBpZk1vZGlmaWVkIG1vZGUuXG5cdFx0aWYgKCBzLmlmTW9kaWZpZWQgKSB7XG5cdFx0XHRpZk1vZGlmaWVkS2V5ID0gaWZNb2RpZmllZEtleSB8fCBzLnVybDtcblx0XHRcdGlmICggalF1ZXJ5Lmxhc3RNb2RpZmllZFsgaWZNb2RpZmllZEtleSBdICkge1xuXHRcdFx0XHRqcVhIUi5zZXRSZXF1ZXN0SGVhZGVyKCBcIklmLU1vZGlmaWVkLVNpbmNlXCIsIGpRdWVyeS5sYXN0TW9kaWZpZWRbIGlmTW9kaWZpZWRLZXkgXSApO1xuXHRcdFx0fVxuXHRcdFx0aWYgKCBqUXVlcnkuZXRhZ1sgaWZNb2RpZmllZEtleSBdICkge1xuXHRcdFx0XHRqcVhIUi5zZXRSZXF1ZXN0SGVhZGVyKCBcIklmLU5vbmUtTWF0Y2hcIiwgalF1ZXJ5LmV0YWdbIGlmTW9kaWZpZWRLZXkgXSApO1xuXHRcdFx0fVxuXHRcdH1cblxuXHRcdC8vIFNldCB0aGUgQWNjZXB0cyBoZWFkZXIgZm9yIHRoZSBzZXJ2ZXIsIGRlcGVuZGluZyBvbiB0aGUgZGF0YVR5cGVcblx0XHRqcVhIUi5zZXRSZXF1ZXN0SGVhZGVyKFxuXHRcdFx0XCJBY2NlcHRcIixcblx0XHRcdHMuZGF0YVR5cGVzWyAwIF0gJiYgcy5hY2NlcHRzWyBzLmRhdGFUeXBlc1swXSBdID9cblx0XHRcdFx0cy5hY2NlcHRzWyBzLmRhdGFUeXBlc1swXSBdICsgKCBzLmRhdGFUeXBlc1sgMCBdICE9PSBcIipcIiA/IFwiLCBcIiArIGFsbFR5cGVzICsgXCI7IHE9MC4wMVwiIDogXCJcIiApIDpcblx0XHRcdFx0cy5hY2NlcHRzWyBcIipcIiBdXG5cdFx0KTtcblxuXHRcdC8vIENoZWNrIGZvciBoZWFkZXJzIG9wdGlvblxuXHRcdGZvciAoIGkgaW4gcy5oZWFkZXJzICkge1xuXHRcdFx0anFYSFIuc2V0UmVxdWVzdEhlYWRlciggaSwgcy5oZWFkZXJzWyBpIF0gKTtcblx0XHR9XG5cblx0XHQvLyBBbGxvdyBjdXN0b20gaGVhZGVycy9taW1ldHlwZXMgYW5kIGVhcmx5IGFib3J0XG5cdFx0aWYgKCBzLmJlZm9yZVNlbmQgJiYgKCBzLmJlZm9yZVNlbmQuY2FsbCggY2FsbGJhY2tDb250ZXh0LCBqcVhIUiwgcyApID09PSBmYWxzZSB8fCBzdGF0ZSA9PT0gMiApICkge1xuXHRcdFx0XHQvLyBBYm9ydCBpZiBub3QgZG9uZSBhbHJlYWR5XG5cdFx0XHRcdGpxWEhSLmFib3J0KCk7XG5cdFx0XHRcdHJldHVybiBmYWxzZTtcblxuXHRcdH1cblxuXHRcdC8vIEluc3RhbGwgY2FsbGJhY2tzIG9uIGRlZmVycmVkc1xuXHRcdGZvciAoIGkgaW4geyBzdWNjZXNzOiAxLCBlcnJvcjogMSwgY29tcGxldGU6IDEgfSApIHtcblx0XHRcdGpxWEhSWyBpIF0oIHNbIGkgXSApO1xuXHRcdH1cblxuXHRcdC8vIEdldCB0cmFuc3BvcnRcblx0XHR0cmFuc3BvcnQgPSBpbnNwZWN0UHJlZmlsdGVyc09yVHJhbnNwb3J0cyggdHJhbnNwb3J0cywgcywgb3B0aW9ucywganFYSFIgKTtcblxuXHRcdC8vIElmIG5vIHRyYW5zcG9ydCwgd2UgYXV0by1hYm9ydFxuXHRcdGlmICggIXRyYW5zcG9ydCApIHtcblx0XHRcdGRvbmUoIC0xLCBcIk5vIFRyYW5zcG9ydFwiICk7XG5cdFx0fSBlbHNlIHtcblx0XHRcdGpxWEhSLnJlYWR5U3RhdGUgPSAxO1xuXHRcdFx0Ly8gU2VuZCBnbG9iYWwgZXZlbnRcblx0XHRcdGlmICggZmlyZUdsb2JhbHMgKSB7XG5cdFx0XHRcdGdsb2JhbEV2ZW50Q29udGV4dC50cmlnZ2VyKCBcImFqYXhTZW5kXCIsIFsganFYSFIsIHMgXSApO1xuXHRcdFx0fVxuXHRcdFx0Ly8gVGltZW91dFxuXHRcdFx0aWYgKCBzLmFzeW5jICYmIHMudGltZW91dCA+IDAgKSB7XG5cdFx0XHRcdHRpbWVvdXRUaW1lciA9IHNldFRpbWVvdXQoIGZ1bmN0aW9uKCl7XG5cdFx0XHRcdFx0anFYSFIuYWJvcnQoIFwidGltZW91dFwiICk7XG5cdFx0XHRcdH0sIHMudGltZW91dCApO1xuXHRcdFx0fVxuXG5cdFx0XHR0cnkge1xuXHRcdFx0XHRzdGF0ZSA9IDE7XG5cdFx0XHRcdHRyYW5zcG9ydC5zZW5kKCByZXF1ZXN0SGVhZGVycywgZG9uZSApO1xuXHRcdFx0fSBjYXRjaCAoZSkge1xuXHRcdFx0XHQvLyBQcm9wYWdhdGUgZXhjZXB0aW9uIGFzIGVycm9yIGlmIG5vdCBkb25lXG5cdFx0XHRcdGlmICggc3RhdGUgPCAyICkge1xuXHRcdFx0XHRcdGRvbmUoIC0xLCBlICk7XG5cdFx0XHRcdC8vIFNpbXBseSByZXRocm93IG90aGVyd2lzZVxuXHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdGpRdWVyeS5lcnJvciggZSApO1xuXHRcdFx0XHR9XG5cdFx0XHR9XG5cdFx0fVxuXG5cdFx0cmV0dXJuIGpxWEhSO1xuXHR9LFxuXG5cdC8vIFNlcmlhbGl6ZSBhbiBhcnJheSBvZiBmb3JtIGVsZW1lbnRzIG9yIGEgc2V0IG9mXG5cdC8vIGtleS92YWx1ZXMgaW50byBhIHF1ZXJ5IHN0cmluZ1xuXHRwYXJhbTogZnVuY3Rpb24oIGEsIHRyYWRpdGlvbmFsICkge1xuXHRcdHZhciBzID0gW10sXG5cdFx0XHRhZGQgPSBmdW5jdGlvbigga2V5LCB2YWx1ZSApIHtcblx0XHRcdFx0Ly8gSWYgdmFsdWUgaXMgYSBmdW5jdGlvbiwgaW52b2tlIGl0IGFuZCByZXR1cm4gaXRzIHZhbHVlXG5cdFx0XHRcdHZhbHVlID0galF1ZXJ5LmlzRnVuY3Rpb24oIHZhbHVlICkgPyB2YWx1ZSgpIDogdmFsdWU7XG5cdFx0XHRcdHNbIHMubGVuZ3RoIF0gPSBlbmNvZGVVUklDb21wb25lbnQoIGtleSApICsgXCI9XCIgKyBlbmNvZGVVUklDb21wb25lbnQoIHZhbHVlICk7XG5cdFx0XHR9O1xuXG5cdFx0Ly8gU2V0IHRyYWRpdGlvbmFsIHRvIHRydWUgZm9yIGpRdWVyeSA8PSAxLjMuMiBiZWhhdmlvci5cblx0XHRpZiAoIHRyYWRpdGlvbmFsID09PSB1bmRlZmluZWQgKSB7XG5cdFx0XHR0cmFkaXRpb25hbCA9IGpRdWVyeS5hamF4U2V0dGluZ3MudHJhZGl0aW9uYWw7XG5cdFx0fVxuXG5cdFx0Ly8gSWYgYW4gYXJyYXkgd2FzIHBhc3NlZCBpbiwgYXNzdW1lIHRoYXQgaXQgaXMgYW4gYXJyYXkgb2YgZm9ybSBlbGVtZW50cy5cblx0XHRpZiAoIGpRdWVyeS5pc0FycmF5KCBhICkgfHwgKCBhLmpxdWVyeSAmJiAhalF1ZXJ5LmlzUGxhaW5PYmplY3QoIGEgKSApICkge1xuXHRcdFx0Ly8gU2VyaWFsaXplIHRoZSBmb3JtIGVsZW1lbnRzXG5cdFx0XHRqUXVlcnkuZWFjaCggYSwgZnVuY3Rpb24oKSB7XG5cdFx0XHRcdGFkZCggdGhpcy5uYW1lLCB0aGlzLnZhbHVlICk7XG5cdFx0XHR9KTtcblxuXHRcdH0gZWxzZSB7XG5cdFx0XHQvLyBJZiB0cmFkaXRpb25hbCwgZW5jb2RlIHRoZSBcIm9sZFwiIHdheSAodGhlIHdheSAxLjMuMiBvciBvbGRlclxuXHRcdFx0Ly8gZGlkIGl0KSwgb3RoZXJ3aXNlIGVuY29kZSBwYXJhbXMgcmVjdXJzaXZlbHkuXG5cdFx0XHRmb3IgKCB2YXIgcHJlZml4IGluIGEgKSB7XG5cdFx0XHRcdGJ1aWxkUGFyYW1zKCBwcmVmaXgsIGFbIHByZWZpeCBdLCB0cmFkaXRpb25hbCwgYWRkICk7XG5cdFx0XHR9XG5cdFx0fVxuXG5cdFx0Ly8gUmV0dXJuIHRoZSByZXN1bHRpbmcgc2VyaWFsaXphdGlvblxuXHRcdHJldHVybiBzLmpvaW4oIFwiJlwiICkucmVwbGFjZSggcjIwLCBcIitcIiApO1xuXHR9XG59KTtcblxuZnVuY3Rpb24gYnVpbGRQYXJhbXMoIHByZWZpeCwgb2JqLCB0cmFkaXRpb25hbCwgYWRkICkge1xuXHRpZiAoIGpRdWVyeS5pc0FycmF5KCBvYmogKSApIHtcblx0XHQvLyBTZXJpYWxpemUgYXJyYXkgaXRlbS5cblx0XHRqUXVlcnkuZWFjaCggb2JqLCBmdW5jdGlvbiggaSwgdiApIHtcblx0XHRcdGlmICggdHJhZGl0aW9uYWwgfHwgcmJyYWNrZXQudGVzdCggcHJlZml4ICkgKSB7XG5cdFx0XHRcdC8vIFRyZWF0IGVhY2ggYXJyYXkgaXRlbSBhcyBhIHNjYWxhci5cblx0XHRcdFx0YWRkKCBwcmVmaXgsIHYgKTtcblxuXHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0Ly8gSWYgYXJyYXkgaXRlbSBpcyBub24tc2NhbGFyIChhcnJheSBvciBvYmplY3QpLCBlbmNvZGUgaXRzXG5cdFx0XHRcdC8vIG51bWVyaWMgaW5kZXggdG8gcmVzb2x2ZSBkZXNlcmlhbGl6YXRpb24gYW1iaWd1aXR5IGlzc3Vlcy5cblx0XHRcdFx0Ly8gTm90ZSB0aGF0IHJhY2sgKGFzIG9mIDEuMC4wKSBjYW4ndCBjdXJyZW50bHkgZGVzZXJpYWxpemVcblx0XHRcdFx0Ly8gbmVzdGVkIGFycmF5cyBwcm9wZXJseSwgYW5kIGF0dGVtcHRpbmcgdG8gZG8gc28gbWF5IGNhdXNlXG5cdFx0XHRcdC8vIGEgc2VydmVyIGVycm9yLiBQb3NzaWJsZSBmaXhlcyBhcmUgdG8gbW9kaWZ5IHJhY2snc1xuXHRcdFx0XHQvLyBkZXNlcmlhbGl6YXRpb24gYWxnb3JpdGhtIG9yIHRvIHByb3ZpZGUgYW4gb3B0aW9uIG9yIGZsYWdcblx0XHRcdFx0Ly8gdG8gZm9yY2UgYXJyYXkgc2VyaWFsaXphdGlvbiB0byBiZSBzaGFsbG93LlxuXHRcdFx0XHRidWlsZFBhcmFtcyggcHJlZml4ICsgXCJbXCIgKyAoIHR5cGVvZiB2ID09PSBcIm9iamVjdFwiIHx8IGpRdWVyeS5pc0FycmF5KHYpID8gaSA6IFwiXCIgKSArIFwiXVwiLCB2LCB0cmFkaXRpb25hbCwgYWRkICk7XG5cdFx0XHR9XG5cdFx0fSk7XG5cblx0fSBlbHNlIGlmICggIXRyYWRpdGlvbmFsICYmIG9iaiAhPSBudWxsICYmIHR5cGVvZiBvYmogPT09IFwib2JqZWN0XCIgKSB7XG5cdFx0Ly8gU2VyaWFsaXplIG9iamVjdCBpdGVtLlxuXHRcdGZvciAoIHZhciBuYW1lIGluIG9iaiApIHtcblx0XHRcdGJ1aWxkUGFyYW1zKCBwcmVmaXggKyBcIltcIiArIG5hbWUgKyBcIl1cIiwgb2JqWyBuYW1lIF0sIHRyYWRpdGlvbmFsLCBhZGQgKTtcblx0XHR9XG5cblx0fSBlbHNlIHtcblx0XHQvLyBTZXJpYWxpemUgc2NhbGFyIGl0ZW0uXG5cdFx0YWRkKCBwcmVmaXgsIG9iaiApO1xuXHR9XG59XG5cbi8vIFRoaXMgaXMgc3RpbGwgb24gdGhlIGpRdWVyeSBvYmplY3QuLi4gZm9yIG5vd1xuLy8gV2FudCB0byBtb3ZlIHRoaXMgdG8galF1ZXJ5LmFqYXggc29tZSBkYXlcbmpRdWVyeS5leHRlbmQoe1xuXG5cdC8vIENvdW50ZXIgZm9yIGhvbGRpbmcgdGhlIG51bWJlciBvZiBhY3RpdmUgcXVlcmllc1xuXHRhY3RpdmU6IDAsXG5cblx0Ly8gTGFzdC1Nb2RpZmllZCBoZWFkZXIgY2FjaGUgZm9yIG5leHQgcmVxdWVzdFxuXHRsYXN0TW9kaWZpZWQ6IHt9LFxuXHRldGFnOiB7fVxuXG59KTtcblxuLyogSGFuZGxlcyByZXNwb25zZXMgdG8gYW4gYWpheCByZXF1ZXN0OlxuICogLSBzZXRzIGFsbCByZXNwb25zZVhYWCBmaWVsZHMgYWNjb3JkaW5nbHlcbiAqIC0gZmluZHMgdGhlIHJpZ2h0IGRhdGFUeXBlIChtZWRpYXRlcyBiZXR3ZWVuIGNvbnRlbnQtdHlwZSBhbmQgZXhwZWN0ZWQgZGF0YVR5cGUpXG4gKiAtIHJldHVybnMgdGhlIGNvcnJlc3BvbmRpbmcgcmVzcG9uc2VcbiAqL1xuZnVuY3Rpb24gYWpheEhhbmRsZVJlc3BvbnNlcyggcywganFYSFIsIHJlc3BvbnNlcyApIHtcblxuXHR2YXIgY29udGVudHMgPSBzLmNvbnRlbnRzLFxuXHRcdGRhdGFUeXBlcyA9IHMuZGF0YVR5cGVzLFxuXHRcdHJlc3BvbnNlRmllbGRzID0gcy5yZXNwb25zZUZpZWxkcyxcblx0XHRjdCxcblx0XHR0eXBlLFxuXHRcdGZpbmFsRGF0YVR5cGUsXG5cdFx0Zmlyc3REYXRhVHlwZTtcblxuXHQvLyBGaWxsIHJlc3BvbnNlWFhYIGZpZWxkc1xuXHRmb3IoIHR5cGUgaW4gcmVzcG9uc2VGaWVsZHMgKSB7XG5cdFx0aWYgKCB0eXBlIGluIHJlc3BvbnNlcyApIHtcblx0XHRcdGpxWEhSWyByZXNwb25zZUZpZWxkc1t0eXBlXSBdID0gcmVzcG9uc2VzWyB0eXBlIF07XG5cdFx0fVxuXHR9XG5cblx0Ly8gUmVtb3ZlIGF1dG8gZGF0YVR5cGUgYW5kIGdldCBjb250ZW50LXR5cGUgaW4gdGhlIHByb2Nlc3Ncblx0d2hpbGUoIGRhdGFUeXBlc1sgMCBdID09PSBcIipcIiApIHtcblx0XHRkYXRhVHlwZXMuc2hpZnQoKTtcblx0XHRpZiAoIGN0ID09PSB1bmRlZmluZWQgKSB7XG5cdFx0XHRjdCA9IHMubWltZVR5cGUgfHwganFYSFIuZ2V0UmVzcG9uc2VIZWFkZXIoIFwiY29udGVudC10eXBlXCIgKTtcblx0XHR9XG5cdH1cblxuXHQvLyBDaGVjayBpZiB3ZSdyZSBkZWFsaW5nIHdpdGggYSBrbm93biBjb250ZW50LXR5cGVcblx0aWYgKCBjdCApIHtcblx0XHRmb3IgKCB0eXBlIGluIGNvbnRlbnRzICkge1xuXHRcdFx0aWYgKCBjb250ZW50c1sgdHlwZSBdICYmIGNvbnRlbnRzWyB0eXBlIF0udGVzdCggY3QgKSApIHtcblx0XHRcdFx0ZGF0YVR5cGVzLnVuc2hpZnQoIHR5cGUgKTtcblx0XHRcdFx0YnJlYWs7XG5cdFx0XHR9XG5cdFx0fVxuXHR9XG5cblx0Ly8gQ2hlY2sgdG8gc2VlIGlmIHdlIGhhdmUgYSByZXNwb25zZSBmb3IgdGhlIGV4cGVjdGVkIGRhdGFUeXBlXG5cdGlmICggZGF0YVR5cGVzWyAwIF0gaW4gcmVzcG9uc2VzICkge1xuXHRcdGZpbmFsRGF0YVR5cGUgPSBkYXRhVHlwZXNbIDAgXTtcblx0fSBlbHNlIHtcblx0XHQvLyBUcnkgY29udmVydGlibGUgZGF0YVR5cGVzXG5cdFx0Zm9yICggdHlwZSBpbiByZXNwb25zZXMgKSB7XG5cdFx0XHRpZiAoICFkYXRhVHlwZXNbIDAgXSB8fCBzLmNvbnZlcnRlcnNbIHR5cGUgKyBcIiBcIiArIGRhdGFUeXBlc1swXSBdICkge1xuXHRcdFx0XHRmaW5hbERhdGFUeXBlID0gdHlwZTtcblx0XHRcdFx0YnJlYWs7XG5cdFx0XHR9XG5cdFx0XHRpZiAoICFmaXJzdERhdGFUeXBlICkge1xuXHRcdFx0XHRmaXJzdERhdGFUeXBlID0gdHlwZTtcblx0XHRcdH1cblx0XHR9XG5cdFx0Ly8gT3IganVzdCB1c2UgZmlyc3Qgb25lXG5cdFx0ZmluYWxEYXRhVHlwZSA9IGZpbmFsRGF0YVR5cGUgfHwgZmlyc3REYXRhVHlwZTtcblx0fVxuXG5cdC8vIElmIHdlIGZvdW5kIGEgZGF0YVR5cGVcblx0Ly8gV2UgYWRkIHRoZSBkYXRhVHlwZSB0byB0aGUgbGlzdCBpZiBuZWVkZWRcblx0Ly8gYW5kIHJldHVybiB0aGUgY29ycmVzcG9uZGluZyByZXNwb25zZVxuXHRpZiAoIGZpbmFsRGF0YVR5cGUgKSB7XG5cdFx0aWYgKCBmaW5hbERhdGFUeXBlICE9PSBkYXRhVHlwZXNbIDAgXSApIHtcblx0XHRcdGRhdGFUeXBlcy51bnNoaWZ0KCBmaW5hbERhdGFUeXBlICk7XG5cdFx0fVxuXHRcdHJldHVybiByZXNwb25zZXNbIGZpbmFsRGF0YVR5cGUgXTtcblx0fVxufVxuXG4vLyBDaGFpbiBjb252ZXJzaW9ucyBnaXZlbiB0aGUgcmVxdWVzdCBhbmQgdGhlIG9yaWdpbmFsIHJlc3BvbnNlXG5mdW5jdGlvbiBhamF4Q29udmVydCggcywgcmVzcG9uc2UgKSB7XG5cblx0Ly8gQXBwbHkgdGhlIGRhdGFGaWx0ZXIgaWYgcHJvdmlkZWRcblx0aWYgKCBzLmRhdGFGaWx0ZXIgKSB7XG5cdFx0cmVzcG9uc2UgPSBzLmRhdGFGaWx0ZXIoIHJlc3BvbnNlLCBzLmRhdGFUeXBlICk7XG5cdH1cblxuXHR2YXIgZGF0YVR5cGVzID0gcy5kYXRhVHlwZXMsXG5cdFx0Y29udmVydGVycyA9IHt9LFxuXHRcdGksXG5cdFx0a2V5LFxuXHRcdGxlbmd0aCA9IGRhdGFUeXBlcy5sZW5ndGgsXG5cdFx0dG1wLFxuXHRcdC8vIEN1cnJlbnQgYW5kIHByZXZpb3VzIGRhdGFUeXBlc1xuXHRcdGN1cnJlbnQgPSBkYXRhVHlwZXNbIDAgXSxcblx0XHRwcmV2LFxuXHRcdC8vIENvbnZlcnNpb24gZXhwcmVzc2lvblxuXHRcdGNvbnZlcnNpb24sXG5cdFx0Ly8gQ29udmVyc2lvbiBmdW5jdGlvblxuXHRcdGNvbnYsXG5cdFx0Ly8gQ29udmVyc2lvbiBmdW5jdGlvbnMgKHRyYW5zaXRpdmUgY29udmVyc2lvbilcblx0XHRjb252MSxcblx0XHRjb252MjtcblxuXHQvLyBGb3IgZWFjaCBkYXRhVHlwZSBpbiB0aGUgY2hhaW5cblx0Zm9yKCBpID0gMTsgaSA8IGxlbmd0aDsgaSsrICkge1xuXG5cdFx0Ly8gQ3JlYXRlIGNvbnZlcnRlcnMgbWFwXG5cdFx0Ly8gd2l0aCBsb3dlcmNhc2VkIGtleXNcblx0XHRpZiAoIGkgPT09IDEgKSB7XG5cdFx0XHRmb3IoIGtleSBpbiBzLmNvbnZlcnRlcnMgKSB7XG5cdFx0XHRcdGlmKCB0eXBlb2Yga2V5ID09PSBcInN0cmluZ1wiICkge1xuXHRcdFx0XHRcdGNvbnZlcnRlcnNbIGtleS50b0xvd2VyQ2FzZSgpIF0gPSBzLmNvbnZlcnRlcnNbIGtleSBdO1xuXHRcdFx0XHR9XG5cdFx0XHR9XG5cdFx0fVxuXG5cdFx0Ly8gR2V0IHRoZSBkYXRhVHlwZXNcblx0XHRwcmV2ID0gY3VycmVudDtcblx0XHRjdXJyZW50ID0gZGF0YVR5cGVzWyBpIF07XG5cblx0XHQvLyBJZiBjdXJyZW50IGlzIGF1dG8gZGF0YVR5cGUsIHVwZGF0ZSBpdCB0byBwcmV2XG5cdFx0aWYoIGN1cnJlbnQgPT09IFwiKlwiICkge1xuXHRcdFx0Y3VycmVudCA9IHByZXY7XG5cdFx0Ly8gSWYgbm8gYXV0byBhbmQgZGF0YVR5cGVzIGFyZSBhY3R1YWxseSBkaWZmZXJlbnRcblx0XHR9IGVsc2UgaWYgKCBwcmV2ICE9PSBcIipcIiAmJiBwcmV2ICE9PSBjdXJyZW50ICkge1xuXG5cdFx0XHQvLyBHZXQgdGhlIGNvbnZlcnRlclxuXHRcdFx0Y29udmVyc2lvbiA9IHByZXYgKyBcIiBcIiArIGN1cnJlbnQ7XG5cdFx0XHRjb252ID0gY29udmVydGVyc1sgY29udmVyc2lvbiBdIHx8IGNvbnZlcnRlcnNbIFwiKiBcIiArIGN1cnJlbnQgXTtcblxuXHRcdFx0Ly8gSWYgdGhlcmUgaXMgbm8gZGlyZWN0IGNvbnZlcnRlciwgc2VhcmNoIHRyYW5zaXRpdmVseVxuXHRcdFx0aWYgKCAhY29udiApIHtcblx0XHRcdFx0Y29udjIgPSB1bmRlZmluZWQ7XG5cdFx0XHRcdGZvciggY29udjEgaW4gY29udmVydGVycyApIHtcblx0XHRcdFx0XHR0bXAgPSBjb252MS5zcGxpdCggXCIgXCIgKTtcblx0XHRcdFx0XHRpZiAoIHRtcFsgMCBdID09PSBwcmV2IHx8IHRtcFsgMCBdID09PSBcIipcIiApIHtcblx0XHRcdFx0XHRcdGNvbnYyID0gY29udmVydGVyc1sgdG1wWzFdICsgXCIgXCIgKyBjdXJyZW50IF07XG5cdFx0XHRcdFx0XHRpZiAoIGNvbnYyICkge1xuXHRcdFx0XHRcdFx0XHRjb252MSA9IGNvbnZlcnRlcnNbIGNvbnYxIF07XG5cdFx0XHRcdFx0XHRcdGlmICggY29udjEgPT09IHRydWUgKSB7XG5cdFx0XHRcdFx0XHRcdFx0Y29udiA9IGNvbnYyO1xuXHRcdFx0XHRcdFx0XHR9IGVsc2UgaWYgKCBjb252MiA9PT0gdHJ1ZSApIHtcblx0XHRcdFx0XHRcdFx0XHRjb252ID0gY29udjE7XG5cdFx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdFx0YnJlYWs7XG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9XG5cdFx0XHR9XG5cdFx0XHQvLyBJZiB3ZSBmb3VuZCBubyBjb252ZXJ0ZXIsIGRpc3BhdGNoIGFuIGVycm9yXG5cdFx0XHRpZiAoICEoIGNvbnYgfHwgY29udjIgKSApIHtcblx0XHRcdFx0alF1ZXJ5LmVycm9yKCBcIk5vIGNvbnZlcnNpb24gZnJvbSBcIiArIGNvbnZlcnNpb24ucmVwbGFjZShcIiBcIixcIiB0byBcIikgKTtcblx0XHRcdH1cblx0XHRcdC8vIElmIGZvdW5kIGNvbnZlcnRlciBpcyBub3QgYW4gZXF1aXZhbGVuY2Vcblx0XHRcdGlmICggY29udiAhPT0gdHJ1ZSApIHtcblx0XHRcdFx0Ly8gQ29udmVydCB3aXRoIDEgb3IgMiBjb252ZXJ0ZXJzIGFjY29yZGluZ2x5XG5cdFx0XHRcdHJlc3BvbnNlID0gY29udiA/IGNvbnYoIHJlc3BvbnNlICkgOiBjb252MiggY29udjEocmVzcG9uc2UpICk7XG5cdFx0XHR9XG5cdFx0fVxuXHR9XG5cdHJldHVybiByZXNwb25zZTtcbn1cblxuXG5cblxudmFyIGpzYyA9IGpRdWVyeS5ub3coKSxcblx0anNyZSA9IC8oXFw9KVxcPygmfCQpfFxcP1xcPy9pO1xuXG4vLyBEZWZhdWx0IGpzb25wIHNldHRpbmdzXG5qUXVlcnkuYWpheFNldHVwKHtcblx0anNvbnA6IFwiY2FsbGJhY2tcIixcblx0anNvbnBDYWxsYmFjazogZnVuY3Rpb24oKSB7XG5cdFx0cmV0dXJuIGpRdWVyeS5leHBhbmRvICsgXCJfXCIgKyAoIGpzYysrICk7XG5cdH1cbn0pO1xuXG4vLyBEZXRlY3QsIG5vcm1hbGl6ZSBvcHRpb25zIGFuZCBpbnN0YWxsIGNhbGxiYWNrcyBmb3IganNvbnAgcmVxdWVzdHNcbmpRdWVyeS5hamF4UHJlZmlsdGVyKCBcImpzb24ganNvbnBcIiwgZnVuY3Rpb24oIHMsIG9yaWdpbmFsU2V0dGluZ3MsIGpxWEhSICkge1xuXG5cdHZhciBpbnNwZWN0RGF0YSA9IHMuY29udGVudFR5cGUgPT09IFwiYXBwbGljYXRpb24veC13d3ctZm9ybS11cmxlbmNvZGVkXCIgJiZcblx0XHQoIHR5cGVvZiBzLmRhdGEgPT09IFwic3RyaW5nXCIgKTtcblxuXHRpZiAoIHMuZGF0YVR5cGVzWyAwIF0gPT09IFwianNvbnBcIiB8fFxuXHRcdHMuanNvbnAgIT09IGZhbHNlICYmICgganNyZS50ZXN0KCBzLnVybCApIHx8XG5cdFx0XHRcdGluc3BlY3REYXRhICYmIGpzcmUudGVzdCggcy5kYXRhICkgKSApIHtcblxuXHRcdHZhciByZXNwb25zZUNvbnRhaW5lcixcblx0XHRcdGpzb25wQ2FsbGJhY2sgPSBzLmpzb25wQ2FsbGJhY2sgPVxuXHRcdFx0XHRqUXVlcnkuaXNGdW5jdGlvbiggcy5qc29ucENhbGxiYWNrICkgPyBzLmpzb25wQ2FsbGJhY2soKSA6IHMuanNvbnBDYWxsYmFjayxcblx0XHRcdHByZXZpb3VzID0gd2luZG93WyBqc29ucENhbGxiYWNrIF0sXG5cdFx0XHR1cmwgPSBzLnVybCxcblx0XHRcdGRhdGEgPSBzLmRhdGEsXG5cdFx0XHRyZXBsYWNlID0gXCIkMVwiICsganNvbnBDYWxsYmFjayArIFwiJDJcIjtcblxuXHRcdGlmICggcy5qc29ucCAhPT0gZmFsc2UgKSB7XG5cdFx0XHR1cmwgPSB1cmwucmVwbGFjZSgganNyZSwgcmVwbGFjZSApO1xuXHRcdFx0aWYgKCBzLnVybCA9PT0gdXJsICkge1xuXHRcdFx0XHRpZiAoIGluc3BlY3REYXRhICkge1xuXHRcdFx0XHRcdGRhdGEgPSBkYXRhLnJlcGxhY2UoIGpzcmUsIHJlcGxhY2UgKTtcblx0XHRcdFx0fVxuXHRcdFx0XHRpZiAoIHMuZGF0YSA9PT0gZGF0YSApIHtcblx0XHRcdFx0XHQvLyBBZGQgY2FsbGJhY2sgbWFudWFsbHlcblx0XHRcdFx0XHR1cmwgKz0gKC9cXD8vLnRlc3QoIHVybCApID8gXCImXCIgOiBcIj9cIikgKyBzLmpzb25wICsgXCI9XCIgKyBqc29ucENhbGxiYWNrO1xuXHRcdFx0XHR9XG5cdFx0XHR9XG5cdFx0fVxuXG5cdFx0cy51cmwgPSB1cmw7XG5cdFx0cy5kYXRhID0gZGF0YTtcblxuXHRcdC8vIEluc3RhbGwgY2FsbGJhY2tcblx0XHR3aW5kb3dbIGpzb25wQ2FsbGJhY2sgXSA9IGZ1bmN0aW9uKCByZXNwb25zZSApIHtcblx0XHRcdHJlc3BvbnNlQ29udGFpbmVyID0gWyByZXNwb25zZSBdO1xuXHRcdH07XG5cblx0XHQvLyBDbGVhbi11cCBmdW5jdGlvblxuXHRcdGpxWEhSLmFsd2F5cyhmdW5jdGlvbigpIHtcblx0XHRcdC8vIFNldCBjYWxsYmFjayBiYWNrIHRvIHByZXZpb3VzIHZhbHVlXG5cdFx0XHR3aW5kb3dbIGpzb25wQ2FsbGJhY2sgXSA9IHByZXZpb3VzO1xuXHRcdFx0Ly8gQ2FsbCBpZiBpdCB3YXMgYSBmdW5jdGlvbiBhbmQgd2UgaGF2ZSBhIHJlc3BvbnNlXG5cdFx0XHRpZiAoIHJlc3BvbnNlQ29udGFpbmVyICYmIGpRdWVyeS5pc0Z1bmN0aW9uKCBwcmV2aW91cyApICkge1xuXHRcdFx0XHR3aW5kb3dbIGpzb25wQ2FsbGJhY2sgXSggcmVzcG9uc2VDb250YWluZXJbIDAgXSApO1xuXHRcdFx0fVxuXHRcdH0pO1xuXG5cdFx0Ly8gVXNlIGRhdGEgY29udmVydGVyIHRvIHJldHJpZXZlIGpzb24gYWZ0ZXIgc2NyaXB0IGV4ZWN1dGlvblxuXHRcdHMuY29udmVydGVyc1tcInNjcmlwdCBqc29uXCJdID0gZnVuY3Rpb24oKSB7XG5cdFx0XHRpZiAoICFyZXNwb25zZUNvbnRhaW5lciApIHtcblx0XHRcdFx0alF1ZXJ5LmVycm9yKCBqc29ucENhbGxiYWNrICsgXCIgd2FzIG5vdCBjYWxsZWRcIiApO1xuXHRcdFx0fVxuXHRcdFx0cmV0dXJuIHJlc3BvbnNlQ29udGFpbmVyWyAwIF07XG5cdFx0fTtcblxuXHRcdC8vIGZvcmNlIGpzb24gZGF0YVR5cGVcblx0XHRzLmRhdGFUeXBlc1sgMCBdID0gXCJqc29uXCI7XG5cblx0XHQvLyBEZWxlZ2F0ZSB0byBzY3JpcHRcblx0XHRyZXR1cm4gXCJzY3JpcHRcIjtcblx0fVxufSk7XG5cblxuXG5cbi8vIEluc3RhbGwgc2NyaXB0IGRhdGFUeXBlXG5qUXVlcnkuYWpheFNldHVwKHtcblx0YWNjZXB0czoge1xuXHRcdHNjcmlwdDogXCJ0ZXh0L2phdmFzY3JpcHQsIGFwcGxpY2F0aW9uL2phdmFzY3JpcHQsIGFwcGxpY2F0aW9uL2VjbWFzY3JpcHQsIGFwcGxpY2F0aW9uL3gtZWNtYXNjcmlwdFwiXG5cdH0sXG5cdGNvbnRlbnRzOiB7XG5cdFx0c2NyaXB0OiAvamF2YXNjcmlwdHxlY21hc2NyaXB0L1xuXHR9LFxuXHRjb252ZXJ0ZXJzOiB7XG5cdFx0XCJ0ZXh0IHNjcmlwdFwiOiBmdW5jdGlvbiggdGV4dCApIHtcblx0XHRcdGpRdWVyeS5nbG9iYWxFdmFsKCB0ZXh0ICk7XG5cdFx0XHRyZXR1cm4gdGV4dDtcblx0XHR9XG5cdH1cbn0pO1xuXG4vLyBIYW5kbGUgY2FjaGUncyBzcGVjaWFsIGNhc2UgYW5kIGdsb2JhbFxualF1ZXJ5LmFqYXhQcmVmaWx0ZXIoIFwic2NyaXB0XCIsIGZ1bmN0aW9uKCBzICkge1xuXHRpZiAoIHMuY2FjaGUgPT09IHVuZGVmaW5lZCApIHtcblx0XHRzLmNhY2hlID0gZmFsc2U7XG5cdH1cblx0aWYgKCBzLmNyb3NzRG9tYWluICkge1xuXHRcdHMudHlwZSA9IFwiR0VUXCI7XG5cdFx0cy5nbG9iYWwgPSBmYWxzZTtcblx0fVxufSk7XG5cbi8vIEJpbmQgc2NyaXB0IHRhZyBoYWNrIHRyYW5zcG9ydFxualF1ZXJ5LmFqYXhUcmFuc3BvcnQoIFwic2NyaXB0XCIsIGZ1bmN0aW9uKHMpIHtcblxuXHQvLyBUaGlzIHRyYW5zcG9ydCBvbmx5IGRlYWxzIHdpdGggY3Jvc3MgZG9tYWluIHJlcXVlc3RzXG5cdGlmICggcy5jcm9zc0RvbWFpbiApIHtcblxuXHRcdHZhciBzY3JpcHQsXG5cdFx0XHRoZWFkID0gZG9jdW1lbnQuaGVhZCB8fCBkb2N1bWVudC5nZXRFbGVtZW50c0J5VGFnTmFtZSggXCJoZWFkXCIgKVswXSB8fCBkb2N1bWVudC5kb2N1bWVudEVsZW1lbnQ7XG5cblx0XHRyZXR1cm4ge1xuXG5cdFx0XHRzZW5kOiBmdW5jdGlvbiggXywgY2FsbGJhY2sgKSB7XG5cblx0XHRcdFx0c2NyaXB0ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCggXCJzY3JpcHRcIiApO1xuXG5cdFx0XHRcdHNjcmlwdC5hc3luYyA9IFwiYXN5bmNcIjtcblxuXHRcdFx0XHRpZiAoIHMuc2NyaXB0Q2hhcnNldCApIHtcblx0XHRcdFx0XHRzY3JpcHQuY2hhcnNldCA9IHMuc2NyaXB0Q2hhcnNldDtcblx0XHRcdFx0fVxuXG5cdFx0XHRcdHNjcmlwdC5zcmMgPSBzLnVybDtcblxuXHRcdFx0XHQvLyBBdHRhY2ggaGFuZGxlcnMgZm9yIGFsbCBicm93c2Vyc1xuXHRcdFx0XHRzY3JpcHQub25sb2FkID0gc2NyaXB0Lm9ucmVhZHlzdGF0ZWNoYW5nZSA9IGZ1bmN0aW9uKCBfLCBpc0Fib3J0ICkge1xuXG5cdFx0XHRcdFx0aWYgKCBpc0Fib3J0IHx8ICFzY3JpcHQucmVhZHlTdGF0ZSB8fCAvbG9hZGVkfGNvbXBsZXRlLy50ZXN0KCBzY3JpcHQucmVhZHlTdGF0ZSApICkge1xuXG5cdFx0XHRcdFx0XHQvLyBIYW5kbGUgbWVtb3J5IGxlYWsgaW4gSUVcblx0XHRcdFx0XHRcdHNjcmlwdC5vbmxvYWQgPSBzY3JpcHQub25yZWFkeXN0YXRlY2hhbmdlID0gbnVsbDtcblxuXHRcdFx0XHRcdFx0Ly8gUmVtb3ZlIHRoZSBzY3JpcHRcblx0XHRcdFx0XHRcdGlmICggaGVhZCAmJiBzY3JpcHQucGFyZW50Tm9kZSApIHtcblx0XHRcdFx0XHRcdFx0aGVhZC5yZW1vdmVDaGlsZCggc2NyaXB0ICk7XG5cdFx0XHRcdFx0XHR9XG5cblx0XHRcdFx0XHRcdC8vIERlcmVmZXJlbmNlIHRoZSBzY3JpcHRcblx0XHRcdFx0XHRcdHNjcmlwdCA9IHVuZGVmaW5lZDtcblxuXHRcdFx0XHRcdFx0Ly8gQ2FsbGJhY2sgaWYgbm90IGFib3J0XG5cdFx0XHRcdFx0XHRpZiAoICFpc0Fib3J0ICkge1xuXHRcdFx0XHRcdFx0XHRjYWxsYmFjayggMjAwLCBcInN1Y2Nlc3NcIiApO1xuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdH1cblx0XHRcdFx0fTtcblx0XHRcdFx0Ly8gVXNlIGluc2VydEJlZm9yZSBpbnN0ZWFkIG9mIGFwcGVuZENoaWxkICB0byBjaXJjdW12ZW50IGFuIElFNiBidWcuXG5cdFx0XHRcdC8vIFRoaXMgYXJpc2VzIHdoZW4gYSBiYXNlIG5vZGUgaXMgdXNlZCAoIzI3MDkgYW5kICM0Mzc4KS5cblx0XHRcdFx0aGVhZC5pbnNlcnRCZWZvcmUoIHNjcmlwdCwgaGVhZC5maXJzdENoaWxkICk7XG5cdFx0XHR9LFxuXG5cdFx0XHRhYm9ydDogZnVuY3Rpb24oKSB7XG5cdFx0XHRcdGlmICggc2NyaXB0ICkge1xuXHRcdFx0XHRcdHNjcmlwdC5vbmxvYWQoIDAsIDEgKTtcblx0XHRcdFx0fVxuXHRcdFx0fVxuXHRcdH07XG5cdH1cbn0pO1xuXG5cblxuXG52YXIgLy8gIzUyODA6IEludGVybmV0IEV4cGxvcmVyIHdpbGwga2VlcCBjb25uZWN0aW9ucyBhbGl2ZSBpZiB3ZSBkb24ndCBhYm9ydCBvbiB1bmxvYWRcblx0eGhyT25VbmxvYWRBYm9ydCA9IHdpbmRvdy5BY3RpdmVYT2JqZWN0ID8gZnVuY3Rpb24oKSB7XG5cdFx0Ly8gQWJvcnQgYWxsIHBlbmRpbmcgcmVxdWVzdHNcblx0XHRmb3IgKCB2YXIga2V5IGluIHhockNhbGxiYWNrcyApIHtcblx0XHRcdHhockNhbGxiYWNrc1sga2V5IF0oIDAsIDEgKTtcblx0XHR9XG5cdH0gOiBmYWxzZSxcblx0eGhySWQgPSAwLFxuXHR4aHJDYWxsYmFja3M7XG5cbi8vIEZ1bmN0aW9ucyB0byBjcmVhdGUgeGhyc1xuZnVuY3Rpb24gY3JlYXRlU3RhbmRhcmRYSFIoKSB7XG5cdHRyeSB7XG5cdFx0cmV0dXJuIG5ldyB3aW5kb3cuWE1MSHR0cFJlcXVlc3QoKTtcblx0fSBjYXRjaCggZSApIHt9XG59XG5cbmZ1bmN0aW9uIGNyZWF0ZUFjdGl2ZVhIUigpIHtcblx0dHJ5IHtcblx0XHRyZXR1cm4gbmV3IHdpbmRvdy5BY3RpdmVYT2JqZWN0KCBcIk1pY3Jvc29mdC5YTUxIVFRQXCIgKTtcblx0fSBjYXRjaCggZSApIHt9XG59XG5cbi8vIENyZWF0ZSB0aGUgcmVxdWVzdCBvYmplY3Rcbi8vIChUaGlzIGlzIHN0aWxsIGF0dGFjaGVkIHRvIGFqYXhTZXR0aW5ncyBmb3IgYmFja3dhcmQgY29tcGF0aWJpbGl0eSlcbmpRdWVyeS5hamF4U2V0dGluZ3MueGhyID0gd2luZG93LkFjdGl2ZVhPYmplY3QgP1xuXHQvKiBNaWNyb3NvZnQgZmFpbGVkIHRvIHByb3Blcmx5XG5cdCAqIGltcGxlbWVudCB0aGUgWE1MSHR0cFJlcXVlc3QgaW4gSUU3IChjYW4ndCByZXF1ZXN0IGxvY2FsIGZpbGVzKSxcblx0ICogc28gd2UgdXNlIHRoZSBBY3RpdmVYT2JqZWN0IHdoZW4gaXQgaXMgYXZhaWxhYmxlXG5cdCAqIEFkZGl0aW9uYWxseSBYTUxIdHRwUmVxdWVzdCBjYW4gYmUgZGlzYWJsZWQgaW4gSUU3L0lFOCBzb1xuXHQgKiB3ZSBuZWVkIGEgZmFsbGJhY2suXG5cdCAqL1xuXHRmdW5jdGlvbigpIHtcblx0XHRyZXR1cm4gIXRoaXMuaXNMb2NhbCAmJiBjcmVhdGVTdGFuZGFyZFhIUigpIHx8IGNyZWF0ZUFjdGl2ZVhIUigpO1xuXHR9IDpcblx0Ly8gRm9yIGFsbCBvdGhlciBicm93c2VycywgdXNlIHRoZSBzdGFuZGFyZCBYTUxIdHRwUmVxdWVzdCBvYmplY3Rcblx0Y3JlYXRlU3RhbmRhcmRYSFI7XG5cbi8vIERldGVybWluZSBzdXBwb3J0IHByb3BlcnRpZXNcbihmdW5jdGlvbiggeGhyICkge1xuXHRqUXVlcnkuZXh0ZW5kKCBqUXVlcnkuc3VwcG9ydCwge1xuXHRcdGFqYXg6ICEheGhyLFxuXHRcdGNvcnM6ICEheGhyICYmICggXCJ3aXRoQ3JlZGVudGlhbHNcIiBpbiB4aHIgKVxuXHR9KTtcbn0pKCBqUXVlcnkuYWpheFNldHRpbmdzLnhocigpICk7XG5cbi8vIENyZWF0ZSB0cmFuc3BvcnQgaWYgdGhlIGJyb3dzZXIgY2FuIHByb3ZpZGUgYW4geGhyXG5pZiAoIGpRdWVyeS5zdXBwb3J0LmFqYXggKSB7XG5cblx0alF1ZXJ5LmFqYXhUcmFuc3BvcnQoZnVuY3Rpb24oIHMgKSB7XG5cdFx0Ly8gQ3Jvc3MgZG9tYWluIG9ubHkgYWxsb3dlZCBpZiBzdXBwb3J0ZWQgdGhyb3VnaCBYTUxIdHRwUmVxdWVzdFxuXHRcdGlmICggIXMuY3Jvc3NEb21haW4gfHwgalF1ZXJ5LnN1cHBvcnQuY29ycyApIHtcblxuXHRcdFx0dmFyIGNhbGxiYWNrO1xuXG5cdFx0XHRyZXR1cm4ge1xuXHRcdFx0XHRzZW5kOiBmdW5jdGlvbiggaGVhZGVycywgY29tcGxldGUgKSB7XG5cblx0XHRcdFx0XHQvLyBHZXQgYSBuZXcgeGhyXG5cdFx0XHRcdFx0dmFyIHhociA9IHMueGhyKCksXG5cdFx0XHRcdFx0XHRoYW5kbGUsXG5cdFx0XHRcdFx0XHRpO1xuXG5cdFx0XHRcdFx0Ly8gT3BlbiB0aGUgc29ja2V0XG5cdFx0XHRcdFx0Ly8gUGFzc2luZyBudWxsIHVzZXJuYW1lLCBnZW5lcmF0ZXMgYSBsb2dpbiBwb3B1cCBvbiBPcGVyYSAoIzI4NjUpXG5cdFx0XHRcdFx0aWYgKCBzLnVzZXJuYW1lICkge1xuXHRcdFx0XHRcdFx0eGhyLm9wZW4oIHMudHlwZSwgcy51cmwsIHMuYXN5bmMsIHMudXNlcm5hbWUsIHMucGFzc3dvcmQgKTtcblx0XHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdFx0eGhyLm9wZW4oIHMudHlwZSwgcy51cmwsIHMuYXN5bmMgKTtcblx0XHRcdFx0XHR9XG5cblx0XHRcdFx0XHQvLyBBcHBseSBjdXN0b20gZmllbGRzIGlmIHByb3ZpZGVkXG5cdFx0XHRcdFx0aWYgKCBzLnhockZpZWxkcyApIHtcblx0XHRcdFx0XHRcdGZvciAoIGkgaW4gcy54aHJGaWVsZHMgKSB7XG5cdFx0XHRcdFx0XHRcdHhoclsgaSBdID0gcy54aHJGaWVsZHNbIGkgXTtcblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHR9XG5cblx0XHRcdFx0XHQvLyBPdmVycmlkZSBtaW1lIHR5cGUgaWYgbmVlZGVkXG5cdFx0XHRcdFx0aWYgKCBzLm1pbWVUeXBlICYmIHhoci5vdmVycmlkZU1pbWVUeXBlICkge1xuXHRcdFx0XHRcdFx0eGhyLm92ZXJyaWRlTWltZVR5cGUoIHMubWltZVR5cGUgKTtcblx0XHRcdFx0XHR9XG5cblx0XHRcdFx0XHQvLyBYLVJlcXVlc3RlZC1XaXRoIGhlYWRlclxuXHRcdFx0XHRcdC8vIEZvciBjcm9zcy1kb21haW4gcmVxdWVzdHMsIHNlZWluZyBhcyBjb25kaXRpb25zIGZvciBhIHByZWZsaWdodCBhcmVcblx0XHRcdFx0XHQvLyBha2luIHRvIGEgamlnc2F3IHB1enpsZSwgd2Ugc2ltcGx5IG5ldmVyIHNldCBpdCB0byBiZSBzdXJlLlxuXHRcdFx0XHRcdC8vIChpdCBjYW4gYWx3YXlzIGJlIHNldCBvbiBhIHBlci1yZXF1ZXN0IGJhc2lzIG9yIGV2ZW4gdXNpbmcgYWpheFNldHVwKVxuXHRcdFx0XHRcdC8vIEZvciBzYW1lLWRvbWFpbiByZXF1ZXN0cywgd29uJ3QgY2hhbmdlIGhlYWRlciBpZiBhbHJlYWR5IHByb3ZpZGVkLlxuXHRcdFx0XHRcdGlmICggIXMuY3Jvc3NEb21haW4gJiYgIWhlYWRlcnNbXCJYLVJlcXVlc3RlZC1XaXRoXCJdICkge1xuXHRcdFx0XHRcdFx0aGVhZGVyc1sgXCJYLVJlcXVlc3RlZC1XaXRoXCIgXSA9IFwiWE1MSHR0cFJlcXVlc3RcIjtcblx0XHRcdFx0XHR9XG5cblx0XHRcdFx0XHQvLyBOZWVkIGFuIGV4dHJhIHRyeS9jYXRjaCBmb3IgY3Jvc3MgZG9tYWluIHJlcXVlc3RzIGluIEZpcmVmb3ggM1xuXHRcdFx0XHRcdHRyeSB7XG5cdFx0XHRcdFx0XHRmb3IgKCBpIGluIGhlYWRlcnMgKSB7XG5cdFx0XHRcdFx0XHRcdHhoci5zZXRSZXF1ZXN0SGVhZGVyKCBpLCBoZWFkZXJzWyBpIF0gKTtcblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHR9IGNhdGNoKCBfICkge31cblxuXHRcdFx0XHRcdC8vIERvIHNlbmQgdGhlIHJlcXVlc3Rcblx0XHRcdFx0XHQvLyBUaGlzIG1heSByYWlzZSBhbiBleGNlcHRpb24gd2hpY2ggaXMgYWN0dWFsbHlcblx0XHRcdFx0XHQvLyBoYW5kbGVkIGluIGpRdWVyeS5hamF4IChzbyBubyB0cnkvY2F0Y2ggaGVyZSlcblx0XHRcdFx0XHR4aHIuc2VuZCggKCBzLmhhc0NvbnRlbnQgJiYgcy5kYXRhICkgfHwgbnVsbCApO1xuXG5cdFx0XHRcdFx0Ly8gTGlzdGVuZXJcblx0XHRcdFx0XHRjYWxsYmFjayA9IGZ1bmN0aW9uKCBfLCBpc0Fib3J0ICkge1xuXG5cdFx0XHRcdFx0XHR2YXIgc3RhdHVzLFxuXHRcdFx0XHRcdFx0XHRzdGF0dXNUZXh0LFxuXHRcdFx0XHRcdFx0XHRyZXNwb25zZUhlYWRlcnMsXG5cdFx0XHRcdFx0XHRcdHJlc3BvbnNlcyxcblx0XHRcdFx0XHRcdFx0eG1sO1xuXG5cdFx0XHRcdFx0XHQvLyBGaXJlZm94IHRocm93cyBleGNlcHRpb25zIHdoZW4gYWNjZXNzaW5nIHByb3BlcnRpZXNcblx0XHRcdFx0XHRcdC8vIG9mIGFuIHhociB3aGVuIGEgbmV0d29yayBlcnJvciBvY2N1cmVkXG5cdFx0XHRcdFx0XHQvLyBodHRwOi8vaGVscGZ1bC5rbm9icy1kaWFscy5jb20vaW5kZXgucGhwL0NvbXBvbmVudF9yZXR1cm5lZF9mYWlsdXJlX2NvZGU6XzB4ODAwNDAxMTFfKE5TX0VSUk9SX05PVF9BVkFJTEFCTEUpXG5cdFx0XHRcdFx0XHR0cnkge1xuXG5cdFx0XHRcdFx0XHRcdC8vIFdhcyBuZXZlciBjYWxsZWQgYW5kIGlzIGFib3J0ZWQgb3IgY29tcGxldGVcblx0XHRcdFx0XHRcdFx0aWYgKCBjYWxsYmFjayAmJiAoIGlzQWJvcnQgfHwgeGhyLnJlYWR5U3RhdGUgPT09IDQgKSApIHtcblxuXHRcdFx0XHRcdFx0XHRcdC8vIE9ubHkgY2FsbGVkIG9uY2Vcblx0XHRcdFx0XHRcdFx0XHRjYWxsYmFjayA9IHVuZGVmaW5lZDtcblxuXHRcdFx0XHRcdFx0XHRcdC8vIERvIG5vdCBrZWVwIGFzIGFjdGl2ZSBhbnltb3JlXG5cdFx0XHRcdFx0XHRcdFx0aWYgKCBoYW5kbGUgKSB7XG5cdFx0XHRcdFx0XHRcdFx0XHR4aHIub25yZWFkeXN0YXRlY2hhbmdlID0galF1ZXJ5Lm5vb3A7XG5cdFx0XHRcdFx0XHRcdFx0XHRpZiAoIHhock9uVW5sb2FkQWJvcnQgKSB7XG5cdFx0XHRcdFx0XHRcdFx0XHRcdGRlbGV0ZSB4aHJDYWxsYmFja3NbIGhhbmRsZSBdO1xuXHRcdFx0XHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0XHRcdH1cblxuXHRcdFx0XHRcdFx0XHRcdC8vIElmIGl0J3MgYW4gYWJvcnRcblx0XHRcdFx0XHRcdFx0XHRpZiAoIGlzQWJvcnQgKSB7XG5cdFx0XHRcdFx0XHRcdFx0XHQvLyBBYm9ydCBpdCBtYW51YWxseSBpZiBuZWVkZWRcblx0XHRcdFx0XHRcdFx0XHRcdGlmICggeGhyLnJlYWR5U3RhdGUgIT09IDQgKSB7XG5cdFx0XHRcdFx0XHRcdFx0XHRcdHhoci5hYm9ydCgpO1xuXHRcdFx0XHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0XHRcdFx0XHRzdGF0dXMgPSB4aHIuc3RhdHVzO1xuXHRcdFx0XHRcdFx0XHRcdFx0cmVzcG9uc2VIZWFkZXJzID0geGhyLmdldEFsbFJlc3BvbnNlSGVhZGVycygpO1xuXHRcdFx0XHRcdFx0XHRcdFx0cmVzcG9uc2VzID0ge307XG5cdFx0XHRcdFx0XHRcdFx0XHR4bWwgPSB4aHIucmVzcG9uc2VYTUw7XG5cblx0XHRcdFx0XHRcdFx0XHRcdC8vIENvbnN0cnVjdCByZXNwb25zZSBsaXN0XG5cdFx0XHRcdFx0XHRcdFx0XHRpZiAoIHhtbCAmJiB4bWwuZG9jdW1lbnRFbGVtZW50IC8qICM0OTU4ICovICkge1xuXHRcdFx0XHRcdFx0XHRcdFx0XHRyZXNwb25zZXMueG1sID0geG1sO1xuXHRcdFx0XHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0XHRcdFx0cmVzcG9uc2VzLnRleHQgPSB4aHIucmVzcG9uc2VUZXh0O1xuXG5cdFx0XHRcdFx0XHRcdFx0XHQvLyBGaXJlZm94IHRocm93cyBhbiBleGNlcHRpb24gd2hlbiBhY2Nlc3Npbmdcblx0XHRcdFx0XHRcdFx0XHRcdC8vIHN0YXR1c1RleHQgZm9yIGZhdWx0eSBjcm9zcy1kb21haW4gcmVxdWVzdHNcblx0XHRcdFx0XHRcdFx0XHRcdHRyeSB7XG5cdFx0XHRcdFx0XHRcdFx0XHRcdHN0YXR1c1RleHQgPSB4aHIuc3RhdHVzVGV4dDtcblx0XHRcdFx0XHRcdFx0XHRcdH0gY2F0Y2goIGUgKSB7XG5cdFx0XHRcdFx0XHRcdFx0XHRcdC8vIFdlIG5vcm1hbGl6ZSB3aXRoIFdlYmtpdCBnaXZpbmcgYW4gZW1wdHkgc3RhdHVzVGV4dFxuXHRcdFx0XHRcdFx0XHRcdFx0XHRzdGF0dXNUZXh0ID0gXCJcIjtcblx0XHRcdFx0XHRcdFx0XHRcdH1cblxuXHRcdFx0XHRcdFx0XHRcdFx0Ly8gRmlsdGVyIHN0YXR1cyBmb3Igbm9uIHN0YW5kYXJkIGJlaGF2aW9yc1xuXG5cdFx0XHRcdFx0XHRcdFx0XHQvLyBJZiB0aGUgcmVxdWVzdCBpcyBsb2NhbCBhbmQgd2UgaGF2ZSBkYXRhOiBhc3N1bWUgYSBzdWNjZXNzXG5cdFx0XHRcdFx0XHRcdFx0XHQvLyAoc3VjY2VzcyB3aXRoIG5vIGRhdGEgd29uJ3QgZ2V0IG5vdGlmaWVkLCB0aGF0J3MgdGhlIGJlc3Qgd2Vcblx0XHRcdFx0XHRcdFx0XHRcdC8vIGNhbiBkbyBnaXZlbiBjdXJyZW50IGltcGxlbWVudGF0aW9ucylcblx0XHRcdFx0XHRcdFx0XHRcdGlmICggIXN0YXR1cyAmJiBzLmlzTG9jYWwgJiYgIXMuY3Jvc3NEb21haW4gKSB7XG5cdFx0XHRcdFx0XHRcdFx0XHRcdHN0YXR1cyA9IHJlc3BvbnNlcy50ZXh0ID8gMjAwIDogNDA0O1xuXHRcdFx0XHRcdFx0XHRcdFx0Ly8gSUUgLSAjMTQ1MDogc29tZXRpbWVzIHJldHVybnMgMTIyMyB3aGVuIGl0IHNob3VsZCBiZSAyMDRcblx0XHRcdFx0XHRcdFx0XHRcdH0gZWxzZSBpZiAoIHN0YXR1cyA9PT0gMTIyMyApIHtcblx0XHRcdFx0XHRcdFx0XHRcdFx0c3RhdHVzID0gMjA0O1xuXHRcdFx0XHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0fSBjYXRjaCggZmlyZWZveEFjY2Vzc0V4Y2VwdGlvbiApIHtcblx0XHRcdFx0XHRcdFx0aWYgKCAhaXNBYm9ydCApIHtcblx0XHRcdFx0XHRcdFx0XHRjb21wbGV0ZSggLTEsIGZpcmVmb3hBY2Nlc3NFeGNlcHRpb24gKTtcblx0XHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0fVxuXG5cdFx0XHRcdFx0XHQvLyBDYWxsIGNvbXBsZXRlIGlmIG5lZWRlZFxuXHRcdFx0XHRcdFx0aWYgKCByZXNwb25zZXMgKSB7XG5cdFx0XHRcdFx0XHRcdGNvbXBsZXRlKCBzdGF0dXMsIHN0YXR1c1RleHQsIHJlc3BvbnNlcywgcmVzcG9uc2VIZWFkZXJzICk7XG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0fTtcblxuXHRcdFx0XHRcdC8vIGlmIHdlJ3JlIGluIHN5bmMgbW9kZSBvciBpdCdzIGluIGNhY2hlXG5cdFx0XHRcdFx0Ly8gYW5kIGhhcyBiZWVuIHJldHJpZXZlZCBkaXJlY3RseSAoSUU2ICYgSUU3KVxuXHRcdFx0XHRcdC8vIHdlIG5lZWQgdG8gbWFudWFsbHkgZmlyZSB0aGUgY2FsbGJhY2tcblx0XHRcdFx0XHRpZiAoICFzLmFzeW5jIHx8IHhoci5yZWFkeVN0YXRlID09PSA0ICkge1xuXHRcdFx0XHRcdFx0Y2FsbGJhY2soKTtcblx0XHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdFx0aGFuZGxlID0gKyt4aHJJZDtcblx0XHRcdFx0XHRcdGlmICggeGhyT25VbmxvYWRBYm9ydCApIHtcblx0XHRcdFx0XHRcdFx0Ly8gQ3JlYXRlIHRoZSBhY3RpdmUgeGhycyBjYWxsYmFja3MgbGlzdCBpZiBuZWVkZWRcblx0XHRcdFx0XHRcdFx0Ly8gYW5kIGF0dGFjaCB0aGUgdW5sb2FkIGhhbmRsZXJcblx0XHRcdFx0XHRcdFx0aWYgKCAheGhyQ2FsbGJhY2tzICkge1xuXHRcdFx0XHRcdFx0XHRcdHhockNhbGxiYWNrcyA9IHt9O1xuXHRcdFx0XHRcdFx0XHRcdGpRdWVyeSggd2luZG93ICkudW5sb2FkKCB4aHJPblVubG9hZEFib3J0ICk7XG5cdFx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdFx0Ly8gQWRkIHRvIGxpc3Qgb2YgYWN0aXZlIHhocnMgY2FsbGJhY2tzXG5cdFx0XHRcdFx0XHRcdHhockNhbGxiYWNrc1sgaGFuZGxlIF0gPSBjYWxsYmFjaztcblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdHhoci5vbnJlYWR5c3RhdGVjaGFuZ2UgPSBjYWxsYmFjaztcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH0sXG5cblx0XHRcdFx0YWJvcnQ6IGZ1bmN0aW9uKCkge1xuXHRcdFx0XHRcdGlmICggY2FsbGJhY2sgKSB7XG5cdFx0XHRcdFx0XHRjYWxsYmFjaygwLDEpO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0fVxuXHRcdFx0fTtcblx0XHR9XG5cdH0pO1xufVxuXG5cblxuXG52YXIgZWxlbWRpc3BsYXkgPSB7fSxcblx0aWZyYW1lLCBpZnJhbWVEb2MsXG5cdHJmeHR5cGVzID0gL14oPzp0b2dnbGV8c2hvd3xoaWRlKSQvLFxuXHRyZnhudW0gPSAvXihbK1xcLV09KT8oW1xcZCsuXFwtXSspKFthLXolXSopJC9pLFxuXHR0aW1lcklkLFxuXHRmeEF0dHJzID0gW1xuXHRcdC8vIGhlaWdodCBhbmltYXRpb25zXG5cdFx0WyBcImhlaWdodFwiLCBcIm1hcmdpblRvcFwiLCBcIm1hcmdpbkJvdHRvbVwiLCBcInBhZGRpbmdUb3BcIiwgXCJwYWRkaW5nQm90dG9tXCIgXSxcblx0XHQvLyB3aWR0aCBhbmltYXRpb25zXG5cdFx0WyBcIndpZHRoXCIsIFwibWFyZ2luTGVmdFwiLCBcIm1hcmdpblJpZ2h0XCIsIFwicGFkZGluZ0xlZnRcIiwgXCJwYWRkaW5nUmlnaHRcIiBdLFxuXHRcdC8vIG9wYWNpdHkgYW5pbWF0aW9uc1xuXHRcdFsgXCJvcGFjaXR5XCIgXVxuXHRdLFxuXHRmeE5vdztcblxualF1ZXJ5LmZuLmV4dGVuZCh7XG5cdHNob3c6IGZ1bmN0aW9uKCBzcGVlZCwgZWFzaW5nLCBjYWxsYmFjayApIHtcblx0XHR2YXIgZWxlbSwgZGlzcGxheTtcblxuXHRcdGlmICggc3BlZWQgfHwgc3BlZWQgPT09IDAgKSB7XG5cdFx0XHRyZXR1cm4gdGhpcy5hbmltYXRlKCBnZW5GeChcInNob3dcIiwgMyksIHNwZWVkLCBlYXNpbmcsIGNhbGxiYWNrKTtcblxuXHRcdH0gZWxzZSB7XG5cdFx0XHRmb3IgKCB2YXIgaSA9IDAsIGogPSB0aGlzLmxlbmd0aDsgaSA8IGo7IGkrKyApIHtcblx0XHRcdFx0ZWxlbSA9IHRoaXNbaV07XG5cblx0XHRcdFx0aWYgKCBlbGVtLnN0eWxlICkge1xuXHRcdFx0XHRcdGRpc3BsYXkgPSBlbGVtLnN0eWxlLmRpc3BsYXk7XG5cblx0XHRcdFx0XHQvLyBSZXNldCB0aGUgaW5saW5lIGRpc3BsYXkgb2YgdGhpcyBlbGVtZW50IHRvIGxlYXJuIGlmIGl0IGlzXG5cdFx0XHRcdFx0Ly8gYmVpbmcgaGlkZGVuIGJ5IGNhc2NhZGVkIHJ1bGVzIG9yIG5vdFxuXHRcdFx0XHRcdGlmICggIWpRdWVyeS5fZGF0YShlbGVtLCBcIm9sZGRpc3BsYXlcIikgJiYgZGlzcGxheSA9PT0gXCJub25lXCIgKSB7XG5cdFx0XHRcdFx0XHRkaXNwbGF5ID0gZWxlbS5zdHlsZS5kaXNwbGF5ID0gXCJcIjtcblx0XHRcdFx0XHR9XG5cblx0XHRcdFx0XHQvLyBTZXQgZWxlbWVudHMgd2hpY2ggaGF2ZSBiZWVuIG92ZXJyaWRkZW4gd2l0aCBkaXNwbGF5OiBub25lXG5cdFx0XHRcdFx0Ly8gaW4gYSBzdHlsZXNoZWV0IHRvIHdoYXRldmVyIHRoZSBkZWZhdWx0IGJyb3dzZXIgc3R5bGUgaXNcblx0XHRcdFx0XHQvLyBmb3Igc3VjaCBhbiBlbGVtZW50XG5cdFx0XHRcdFx0aWYgKCBkaXNwbGF5ID09PSBcIm5vbmVcIiB8fCAoIGRpc3BsYXkgPT09IFwiXCIgICYmIGpRdWVyeS5jc3MoIGVsZW0sIFwiZGlzcGxheVwiICkgPT09IFwibm9uZVwiICkgKSB7XG5cdFx0XHRcdFx0XHRqUXVlcnkuX2RhdGEoZWxlbSwgXCJvbGRkaXNwbGF5XCIsIGRlZmF1bHREaXNwbGF5KGVsZW0ubm9kZU5hbWUpKTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH1cblx0XHRcdH1cblxuXHRcdFx0Ly8gU2V0IHRoZSBkaXNwbGF5IG9mIG1vc3Qgb2YgdGhlIGVsZW1lbnRzIGluIGEgc2Vjb25kIGxvb3Bcblx0XHRcdC8vIHRvIGF2b2lkIHRoZSBjb25zdGFudCByZWZsb3dcblx0XHRcdGZvciAoIGkgPSAwOyBpIDwgajsgaSsrICkge1xuXHRcdFx0XHRlbGVtID0gdGhpc1tpXTtcblxuXHRcdFx0XHRpZiAoIGVsZW0uc3R5bGUgKSB7XG5cdFx0XHRcdFx0ZGlzcGxheSA9IGVsZW0uc3R5bGUuZGlzcGxheTtcblxuXHRcdFx0XHRcdGlmICggZGlzcGxheSA9PT0gXCJcIiB8fCBkaXNwbGF5ID09PSBcIm5vbmVcIiApIHtcblx0XHRcdFx0XHRcdGVsZW0uc3R5bGUuZGlzcGxheSA9IGpRdWVyeS5fZGF0YShlbGVtLCBcIm9sZGRpc3BsYXlcIikgfHwgXCJcIjtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH1cblx0XHRcdH1cblxuXHRcdFx0cmV0dXJuIHRoaXM7XG5cdFx0fVxuXHR9LFxuXG5cdGhpZGU6IGZ1bmN0aW9uKCBzcGVlZCwgZWFzaW5nLCBjYWxsYmFjayApIHtcblx0XHRpZiAoIHNwZWVkIHx8IHNwZWVkID09PSAwICkge1xuXHRcdFx0cmV0dXJuIHRoaXMuYW5pbWF0ZSggZ2VuRngoXCJoaWRlXCIsIDMpLCBzcGVlZCwgZWFzaW5nLCBjYWxsYmFjayk7XG5cblx0XHR9IGVsc2Uge1xuXHRcdFx0Zm9yICggdmFyIGkgPSAwLCBqID0gdGhpcy5sZW5ndGg7IGkgPCBqOyBpKysgKSB7XG5cdFx0XHRcdGlmICggdGhpc1tpXS5zdHlsZSApIHtcblx0XHRcdFx0XHR2YXIgZGlzcGxheSA9IGpRdWVyeS5jc3MoIHRoaXNbaV0sIFwiZGlzcGxheVwiICk7XG5cblx0XHRcdFx0XHRpZiAoIGRpc3BsYXkgIT09IFwibm9uZVwiICYmICFqUXVlcnkuX2RhdGEoIHRoaXNbaV0sIFwib2xkZGlzcGxheVwiICkgKSB7XG5cdFx0XHRcdFx0XHRqUXVlcnkuX2RhdGEoIHRoaXNbaV0sIFwib2xkZGlzcGxheVwiLCBkaXNwbGF5ICk7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9XG5cdFx0XHR9XG5cblx0XHRcdC8vIFNldCB0aGUgZGlzcGxheSBvZiB0aGUgZWxlbWVudHMgaW4gYSBzZWNvbmQgbG9vcFxuXHRcdFx0Ly8gdG8gYXZvaWQgdGhlIGNvbnN0YW50IHJlZmxvd1xuXHRcdFx0Zm9yICggaSA9IDA7IGkgPCBqOyBpKysgKSB7XG5cdFx0XHRcdGlmICggdGhpc1tpXS5zdHlsZSApIHtcblx0XHRcdFx0XHR0aGlzW2ldLnN0eWxlLmRpc3BsYXkgPSBcIm5vbmVcIjtcblx0XHRcdFx0fVxuXHRcdFx0fVxuXG5cdFx0XHRyZXR1cm4gdGhpcztcblx0XHR9XG5cdH0sXG5cblx0Ly8gU2F2ZSB0aGUgb2xkIHRvZ2dsZSBmdW5jdGlvblxuXHRfdG9nZ2xlOiBqUXVlcnkuZm4udG9nZ2xlLFxuXG5cdHRvZ2dsZTogZnVuY3Rpb24oIGZuLCBmbjIsIGNhbGxiYWNrICkge1xuXHRcdHZhciBib29sID0gdHlwZW9mIGZuID09PSBcImJvb2xlYW5cIjtcblxuXHRcdGlmICggalF1ZXJ5LmlzRnVuY3Rpb24oZm4pICYmIGpRdWVyeS5pc0Z1bmN0aW9uKGZuMikgKSB7XG5cdFx0XHR0aGlzLl90b2dnbGUuYXBwbHkoIHRoaXMsIGFyZ3VtZW50cyApO1xuXG5cdFx0fSBlbHNlIGlmICggZm4gPT0gbnVsbCB8fCBib29sICkge1xuXHRcdFx0dGhpcy5lYWNoKGZ1bmN0aW9uKCkge1xuXHRcdFx0XHR2YXIgc3RhdGUgPSBib29sID8gZm4gOiBqUXVlcnkodGhpcykuaXMoXCI6aGlkZGVuXCIpO1xuXHRcdFx0XHRqUXVlcnkodGhpcylbIHN0YXRlID8gXCJzaG93XCIgOiBcImhpZGVcIiBdKCk7XG5cdFx0XHR9KTtcblxuXHRcdH0gZWxzZSB7XG5cdFx0XHR0aGlzLmFuaW1hdGUoZ2VuRngoXCJ0b2dnbGVcIiwgMyksIGZuLCBmbjIsIGNhbGxiYWNrKTtcblx0XHR9XG5cblx0XHRyZXR1cm4gdGhpcztcblx0fSxcblxuXHRmYWRlVG86IGZ1bmN0aW9uKCBzcGVlZCwgdG8sIGVhc2luZywgY2FsbGJhY2sgKSB7XG5cdFx0cmV0dXJuIHRoaXMuZmlsdGVyKFwiOmhpZGRlblwiKS5jc3MoXCJvcGFjaXR5XCIsIDApLnNob3coKS5lbmQoKVxuXHRcdFx0XHRcdC5hbmltYXRlKHtvcGFjaXR5OiB0b30sIHNwZWVkLCBlYXNpbmcsIGNhbGxiYWNrKTtcblx0fSxcblxuXHRhbmltYXRlOiBmdW5jdGlvbiggcHJvcCwgc3BlZWQsIGVhc2luZywgY2FsbGJhY2sgKSB7XG5cdFx0dmFyIG9wdGFsbCA9IGpRdWVyeS5zcGVlZCggc3BlZWQsIGVhc2luZywgY2FsbGJhY2sgKTtcblxuXHRcdGlmICggalF1ZXJ5LmlzRW1wdHlPYmplY3QoIHByb3AgKSApIHtcblx0XHRcdHJldHVybiB0aGlzLmVhY2goIG9wdGFsbC5jb21wbGV0ZSwgWyBmYWxzZSBdICk7XG5cdFx0fVxuXG5cdFx0Ly8gRG8gbm90IGNoYW5nZSByZWZlcmVuY2VkIHByb3BlcnRpZXMgYXMgcGVyLXByb3BlcnR5IGVhc2luZyB3aWxsIGJlIGxvc3Rcblx0XHRwcm9wID0galF1ZXJ5LmV4dGVuZCgge30sIHByb3AgKTtcblxuXHRcdGZ1bmN0aW9uIGRvQW5pbWF0aW9uKCkge1xuXHRcdFx0Ly8gWFhYICd0aGlzJyBkb2VzIG5vdCBhbHdheXMgaGF2ZSBhIG5vZGVOYW1lIHdoZW4gcnVubmluZyB0aGVcblx0XHRcdC8vIHRlc3Qgc3VpdGVcblxuXHRcdFx0aWYgKCBvcHRhbGwucXVldWUgPT09IGZhbHNlICkge1xuXHRcdFx0XHRqUXVlcnkuX21hcmsoIHRoaXMgKTtcblx0XHRcdH1cblxuXHRcdFx0dmFyIG9wdCA9IGpRdWVyeS5leHRlbmQoIHt9LCBvcHRhbGwgKSxcblx0XHRcdFx0aXNFbGVtZW50ID0gdGhpcy5ub2RlVHlwZSA9PT0gMSxcblx0XHRcdFx0aGlkZGVuID0gaXNFbGVtZW50ICYmIGpRdWVyeSh0aGlzKS5pcyhcIjpoaWRkZW5cIiksXG5cdFx0XHRcdG5hbWUsIHZhbCwgcCwgZSxcblx0XHRcdFx0cGFydHMsIHN0YXJ0LCBlbmQsIHVuaXQsXG5cdFx0XHRcdG1ldGhvZDtcblxuXHRcdFx0Ly8gd2lsbCBzdG9yZSBwZXIgcHJvcGVydHkgZWFzaW5nIGFuZCBiZSB1c2VkIHRvIGRldGVybWluZSB3aGVuIGFuIGFuaW1hdGlvbiBpcyBjb21wbGV0ZVxuXHRcdFx0b3B0LmFuaW1hdGVkUHJvcGVydGllcyA9IHt9O1xuXG5cdFx0XHRmb3IgKCBwIGluIHByb3AgKSB7XG5cblx0XHRcdFx0Ly8gcHJvcGVydHkgbmFtZSBub3JtYWxpemF0aW9uXG5cdFx0XHRcdG5hbWUgPSBqUXVlcnkuY2FtZWxDYXNlKCBwICk7XG5cdFx0XHRcdGlmICggcCAhPT0gbmFtZSApIHtcblx0XHRcdFx0XHRwcm9wWyBuYW1lIF0gPSBwcm9wWyBwIF07XG5cdFx0XHRcdFx0ZGVsZXRlIHByb3BbIHAgXTtcblx0XHRcdFx0fVxuXG5cdFx0XHRcdHZhbCA9IHByb3BbIG5hbWUgXTtcblxuXHRcdFx0XHQvLyBlYXNpbmcgcmVzb2x1dGlvbjogcGVyIHByb3BlcnR5ID4gb3B0LnNwZWNpYWxFYXNpbmcgPiBvcHQuZWFzaW5nID4gJ3N3aW5nJyAoZGVmYXVsdClcblx0XHRcdFx0aWYgKCBqUXVlcnkuaXNBcnJheSggdmFsICkgKSB7XG5cdFx0XHRcdFx0b3B0LmFuaW1hdGVkUHJvcGVydGllc1sgbmFtZSBdID0gdmFsWyAxIF07XG5cdFx0XHRcdFx0dmFsID0gcHJvcFsgbmFtZSBdID0gdmFsWyAwIF07XG5cdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0b3B0LmFuaW1hdGVkUHJvcGVydGllc1sgbmFtZSBdID0gb3B0LnNwZWNpYWxFYXNpbmcgJiYgb3B0LnNwZWNpYWxFYXNpbmdbIG5hbWUgXSB8fCBvcHQuZWFzaW5nIHx8ICdzd2luZyc7XG5cdFx0XHRcdH1cblxuXHRcdFx0XHRpZiAoIHZhbCA9PT0gXCJoaWRlXCIgJiYgaGlkZGVuIHx8IHZhbCA9PT0gXCJzaG93XCIgJiYgIWhpZGRlbiApIHtcblx0XHRcdFx0XHRyZXR1cm4gb3B0LmNvbXBsZXRlLmNhbGwoIHRoaXMgKTtcblx0XHRcdFx0fVxuXG5cdFx0XHRcdGlmICggaXNFbGVtZW50ICYmICggbmFtZSA9PT0gXCJoZWlnaHRcIiB8fCBuYW1lID09PSBcIndpZHRoXCIgKSApIHtcblx0XHRcdFx0XHQvLyBNYWtlIHN1cmUgdGhhdCBub3RoaW5nIHNuZWFrcyBvdXRcblx0XHRcdFx0XHQvLyBSZWNvcmQgYWxsIDMgb3ZlcmZsb3cgYXR0cmlidXRlcyBiZWNhdXNlIElFIGRvZXMgbm90XG5cdFx0XHRcdFx0Ly8gY2hhbmdlIHRoZSBvdmVyZmxvdyBhdHRyaWJ1dGUgd2hlbiBvdmVyZmxvd1ggYW5kXG5cdFx0XHRcdFx0Ly8gb3ZlcmZsb3dZIGFyZSBzZXQgdG8gdGhlIHNhbWUgdmFsdWVcblx0XHRcdFx0XHRvcHQub3ZlcmZsb3cgPSBbIHRoaXMuc3R5bGUub3ZlcmZsb3csIHRoaXMuc3R5bGUub3ZlcmZsb3dYLCB0aGlzLnN0eWxlLm92ZXJmbG93WSBdO1xuXG5cdFx0XHRcdFx0Ly8gU2V0IGRpc3BsYXkgcHJvcGVydHkgdG8gaW5saW5lLWJsb2NrIGZvciBoZWlnaHQvd2lkdGhcblx0XHRcdFx0XHQvLyBhbmltYXRpb25zIG9uIGlubGluZSBlbGVtZW50cyB0aGF0IGFyZSBoYXZpbmcgd2lkdGgvaGVpZ2h0IGFuaW1hdGVkXG5cdFx0XHRcdFx0aWYgKCBqUXVlcnkuY3NzKCB0aGlzLCBcImRpc3BsYXlcIiApID09PSBcImlubGluZVwiICYmXG5cdFx0XHRcdFx0XHRcdGpRdWVyeS5jc3MoIHRoaXMsIFwiZmxvYXRcIiApID09PSBcIm5vbmVcIiApIHtcblxuXHRcdFx0XHRcdFx0Ly8gaW5saW5lLWxldmVsIGVsZW1lbnRzIGFjY2VwdCBpbmxpbmUtYmxvY2s7XG5cdFx0XHRcdFx0XHQvLyBibG9jay1sZXZlbCBlbGVtZW50cyBuZWVkIHRvIGJlIGlubGluZSB3aXRoIGxheW91dFxuXHRcdFx0XHRcdFx0aWYgKCAhalF1ZXJ5LnN1cHBvcnQuaW5saW5lQmxvY2tOZWVkc0xheW91dCB8fCBkZWZhdWx0RGlzcGxheSggdGhpcy5ub2RlTmFtZSApID09PSBcImlubGluZVwiICkge1xuXHRcdFx0XHRcdFx0XHR0aGlzLnN0eWxlLmRpc3BsYXkgPSBcImlubGluZS1ibG9ja1wiO1xuXG5cdFx0XHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdFx0XHR0aGlzLnN0eWxlLnpvb20gPSAxO1xuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdH1cblx0XHRcdFx0fVxuXHRcdFx0fVxuXG5cdFx0XHRpZiAoIG9wdC5vdmVyZmxvdyAhPSBudWxsICkge1xuXHRcdFx0XHR0aGlzLnN0eWxlLm92ZXJmbG93ID0gXCJoaWRkZW5cIjtcblx0XHRcdH1cblxuXHRcdFx0Zm9yICggcCBpbiBwcm9wICkge1xuXHRcdFx0XHRlID0gbmV3IGpRdWVyeS5meCggdGhpcywgb3B0LCBwICk7XG5cdFx0XHRcdHZhbCA9IHByb3BbIHAgXTtcblxuXHRcdFx0XHRpZiAoIHJmeHR5cGVzLnRlc3QoIHZhbCApICkge1xuXG5cdFx0XHRcdFx0Ly8gVHJhY2tzIHdoZXRoZXIgdG8gc2hvdyBvciBoaWRlIGJhc2VkIG9uIHByaXZhdGVcblx0XHRcdFx0XHQvLyBkYXRhIGF0dGFjaGVkIHRvIHRoZSBlbGVtZW50XG5cdFx0XHRcdFx0bWV0aG9kID0galF1ZXJ5Ll9kYXRhKCB0aGlzLCBcInRvZ2dsZVwiICsgcCApIHx8ICh2YWwgPT09IFwidG9nZ2xlXCIgPyBoaWRkZW4gPyBcInNob3dcIiA6IFwiaGlkZVwiIDogMCk7XG5cdFx0XHRcdFx0aWYgKCBtZXRob2QgKSB7XG5cdFx0XHRcdFx0XHRqUXVlcnkuX2RhdGEoIHRoaXMsIFwidG9nZ2xlXCIgKyBwLCBtZXRob2QgPT09IFwic2hvd1wiID8gXCJoaWRlXCIgOiBcInNob3dcIiApO1xuXHRcdFx0XHRcdFx0ZVsgbWV0aG9kIF0oKTtcblx0XHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdFx0ZVsgdmFsIF0oKTtcblx0XHRcdFx0XHR9XG5cblx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHRwYXJ0cyA9IHJmeG51bS5leGVjKCB2YWwgKTtcblx0XHRcdFx0XHRzdGFydCA9IGUuY3VyKCk7XG5cblx0XHRcdFx0XHRpZiAoIHBhcnRzICkge1xuXHRcdFx0XHRcdFx0ZW5kID0gcGFyc2VGbG9hdCggcGFydHNbMl0gKTtcblx0XHRcdFx0XHRcdHVuaXQgPSBwYXJ0c1szXSB8fCAoIGpRdWVyeS5jc3NOdW1iZXJbIHAgXSA/IFwiXCIgOiBcInB4XCIgKTtcblxuXHRcdFx0XHRcdFx0Ly8gV2UgbmVlZCB0byBjb21wdXRlIHN0YXJ0aW5nIHZhbHVlXG5cdFx0XHRcdFx0XHRpZiAoIHVuaXQgIT09IFwicHhcIiApIHtcblx0XHRcdFx0XHRcdFx0alF1ZXJ5LnN0eWxlKCB0aGlzLCBwLCAoZW5kIHx8IDEpICsgdW5pdCk7XG5cdFx0XHRcdFx0XHRcdHN0YXJ0ID0gKChlbmQgfHwgMSkgLyBlLmN1cigpKSAqIHN0YXJ0O1xuXHRcdFx0XHRcdFx0XHRqUXVlcnkuc3R5bGUoIHRoaXMsIHAsIHN0YXJ0ICsgdW5pdCk7XG5cdFx0XHRcdFx0XHR9XG5cblx0XHRcdFx0XHRcdC8vIElmIGEgKz0vLT0gdG9rZW4gd2FzIHByb3ZpZGVkLCB3ZSdyZSBkb2luZyBhIHJlbGF0aXZlIGFuaW1hdGlvblxuXHRcdFx0XHRcdFx0aWYgKCBwYXJ0c1sxXSApIHtcblx0XHRcdFx0XHRcdFx0ZW5kID0gKCAocGFydHNbIDEgXSA9PT0gXCItPVwiID8gLTEgOiAxKSAqIGVuZCApICsgc3RhcnQ7XG5cdFx0XHRcdFx0XHR9XG5cblx0XHRcdFx0XHRcdGUuY3VzdG9tKCBzdGFydCwgZW5kLCB1bml0ICk7XG5cblx0XHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdFx0ZS5jdXN0b20oIHN0YXJ0LCB2YWwsIFwiXCIgKTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH1cblx0XHRcdH1cblxuXHRcdFx0Ly8gRm9yIEpTIHN0cmljdCBjb21wbGlhbmNlXG5cdFx0XHRyZXR1cm4gdHJ1ZTtcblx0XHR9XG5cblx0XHRyZXR1cm4gb3B0YWxsLnF1ZXVlID09PSBmYWxzZSA/XG5cdFx0XHR0aGlzLmVhY2goIGRvQW5pbWF0aW9uICkgOlxuXHRcdFx0dGhpcy5xdWV1ZSggb3B0YWxsLnF1ZXVlLCBkb0FuaW1hdGlvbiApO1xuXHR9LFxuXG5cdHN0b3A6IGZ1bmN0aW9uKCB0eXBlLCBjbGVhclF1ZXVlLCBnb3RvRW5kICkge1xuXHRcdGlmICggdHlwZW9mIHR5cGUgIT09IFwic3RyaW5nXCIgKSB7XG5cdFx0XHRnb3RvRW5kID0gY2xlYXJRdWV1ZTtcblx0XHRcdGNsZWFyUXVldWUgPSB0eXBlO1xuXHRcdFx0dHlwZSA9IHVuZGVmaW5lZDtcblx0XHR9XG5cdFx0aWYgKCBjbGVhclF1ZXVlICYmIHR5cGUgIT09IGZhbHNlICkge1xuXHRcdFx0dGhpcy5xdWV1ZSggdHlwZSB8fCBcImZ4XCIsIFtdICk7XG5cdFx0fVxuXG5cdFx0cmV0dXJuIHRoaXMuZWFjaChmdW5jdGlvbigpIHtcblx0XHRcdHZhciBpLFxuXHRcdFx0XHRoYWRUaW1lcnMgPSBmYWxzZSxcblx0XHRcdFx0dGltZXJzID0galF1ZXJ5LnRpbWVycyxcblx0XHRcdFx0ZGF0YSA9IGpRdWVyeS5fZGF0YSggdGhpcyApO1xuXG5cdFx0XHQvLyBjbGVhciBtYXJrZXIgY291bnRlcnMgaWYgd2Uga25vdyB0aGV5IHdvbid0IGJlXG5cdFx0XHRpZiAoICFnb3RvRW5kICkge1xuXHRcdFx0XHRqUXVlcnkuX3VubWFyayggdHJ1ZSwgdGhpcyApO1xuXHRcdFx0fVxuXG5cdFx0XHRmdW5jdGlvbiBzdG9wUXVldWUoIGVsZW0sIGRhdGEsIGkgKSB7XG5cdFx0XHRcdHZhciBydW5uZXIgPSBkYXRhWyBpIF07XG5cdFx0XHRcdGpRdWVyeS5yZW1vdmVEYXRhKCBlbGVtLCBpLCB0cnVlICk7XG5cdFx0XHRcdHJ1bm5lci5zdG9wKCBnb3RvRW5kICk7XG5cdFx0XHR9XG5cblx0XHRcdGlmICggdHlwZSA9PSBudWxsICkge1xuXHRcdFx0XHRmb3IgKCBpIGluIGRhdGEgKSB7XG5cdFx0XHRcdFx0aWYgKCBkYXRhWyBpIF0uc3RvcCAmJiBpLmluZGV4T2YoXCIucnVuXCIpID09PSBpLmxlbmd0aCAtIDQgKSB7XG5cdFx0XHRcdFx0XHRzdG9wUXVldWUoIHRoaXMsIGRhdGEsIGkgKTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH1cblx0XHRcdH0gZWxzZSBpZiAoIGRhdGFbIGkgPSB0eXBlICsgXCIucnVuXCIgXSAmJiBkYXRhWyBpIF0uc3RvcCApe1xuXHRcdFx0XHRzdG9wUXVldWUoIHRoaXMsIGRhdGEsIGkgKTtcblx0XHRcdH1cblxuXHRcdFx0Zm9yICggaSA9IHRpbWVycy5sZW5ndGg7IGktLTsgKSB7XG5cdFx0XHRcdGlmICggdGltZXJzWyBpIF0uZWxlbSA9PT0gdGhpcyAmJiAodHlwZSA9PSBudWxsIHx8IHRpbWVyc1sgaSBdLnF1ZXVlID09PSB0eXBlKSApIHtcblx0XHRcdFx0XHRpZiAoIGdvdG9FbmQgKSB7XG5cblx0XHRcdFx0XHRcdC8vIGZvcmNlIHRoZSBuZXh0IHN0ZXAgdG8gYmUgdGhlIGxhc3Rcblx0XHRcdFx0XHRcdHRpbWVyc1sgaSBdKCB0cnVlICk7XG5cdFx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHRcdHRpbWVyc1sgaSBdLnNhdmVTdGF0ZSgpO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0XHRoYWRUaW1lcnMgPSB0cnVlO1xuXHRcdFx0XHRcdHRpbWVycy5zcGxpY2UoIGksIDEgKTtcblx0XHRcdFx0fVxuXHRcdFx0fVxuXG5cdFx0XHQvLyBzdGFydCB0aGUgbmV4dCBpbiB0aGUgcXVldWUgaWYgdGhlIGxhc3Qgc3RlcCB3YXNuJ3QgZm9yY2VkXG5cdFx0XHQvLyB0aW1lcnMgY3VycmVudGx5IHdpbGwgY2FsbCB0aGVpciBjb21wbGV0ZSBjYWxsYmFja3MsIHdoaWNoIHdpbGwgZGVxdWV1ZVxuXHRcdFx0Ly8gYnV0IG9ubHkgaWYgdGhleSB3ZXJlIGdvdG9FbmRcblx0XHRcdGlmICggISggZ290b0VuZCAmJiBoYWRUaW1lcnMgKSApIHtcblx0XHRcdFx0alF1ZXJ5LmRlcXVldWUoIHRoaXMsIHR5cGUgKTtcblx0XHRcdH1cblx0XHR9KTtcblx0fVxuXG59KTtcblxuLy8gQW5pbWF0aW9ucyBjcmVhdGVkIHN5bmNocm9ub3VzbHkgd2lsbCBydW4gc3luY2hyb25vdXNseVxuZnVuY3Rpb24gY3JlYXRlRnhOb3coKSB7XG5cdHNldFRpbWVvdXQoIGNsZWFyRnhOb3csIDAgKTtcblx0cmV0dXJuICggZnhOb3cgPSBqUXVlcnkubm93KCkgKTtcbn1cblxuZnVuY3Rpb24gY2xlYXJGeE5vdygpIHtcblx0ZnhOb3cgPSB1bmRlZmluZWQ7XG59XG5cbi8vIEdlbmVyYXRlIHBhcmFtZXRlcnMgdG8gY3JlYXRlIGEgc3RhbmRhcmQgYW5pbWF0aW9uXG5mdW5jdGlvbiBnZW5GeCggdHlwZSwgbnVtICkge1xuXHR2YXIgb2JqID0ge307XG5cblx0alF1ZXJ5LmVhY2goIGZ4QXR0cnMuY29uY2F0LmFwcGx5KFtdLCBmeEF0dHJzLnNsaWNlKCAwLCBudW0gKSksIGZ1bmN0aW9uKCkge1xuXHRcdG9ialsgdGhpcyBdID0gdHlwZTtcblx0fSk7XG5cblx0cmV0dXJuIG9iajtcbn1cblxuLy8gR2VuZXJhdGUgc2hvcnRjdXRzIGZvciBjdXN0b20gYW5pbWF0aW9uc1xualF1ZXJ5LmVhY2goe1xuXHRzbGlkZURvd246IGdlbkZ4KCBcInNob3dcIiwgMSApLFxuXHRzbGlkZVVwOiBnZW5GeCggXCJoaWRlXCIsIDEgKSxcblx0c2xpZGVUb2dnbGU6IGdlbkZ4KCBcInRvZ2dsZVwiLCAxICksXG5cdGZhZGVJbjogeyBvcGFjaXR5OiBcInNob3dcIiB9LFxuXHRmYWRlT3V0OiB7IG9wYWNpdHk6IFwiaGlkZVwiIH0sXG5cdGZhZGVUb2dnbGU6IHsgb3BhY2l0eTogXCJ0b2dnbGVcIiB9XG59LCBmdW5jdGlvbiggbmFtZSwgcHJvcHMgKSB7XG5cdGpRdWVyeS5mblsgbmFtZSBdID0gZnVuY3Rpb24oIHNwZWVkLCBlYXNpbmcsIGNhbGxiYWNrICkge1xuXHRcdHJldHVybiB0aGlzLmFuaW1hdGUoIHByb3BzLCBzcGVlZCwgZWFzaW5nLCBjYWxsYmFjayApO1xuXHR9O1xufSk7XG5cbmpRdWVyeS5leHRlbmQoe1xuXHRzcGVlZDogZnVuY3Rpb24oIHNwZWVkLCBlYXNpbmcsIGZuICkge1xuXHRcdHZhciBvcHQgPSBzcGVlZCAmJiB0eXBlb2Ygc3BlZWQgPT09IFwib2JqZWN0XCIgPyBqUXVlcnkuZXh0ZW5kKCB7fSwgc3BlZWQgKSA6IHtcblx0XHRcdGNvbXBsZXRlOiBmbiB8fCAhZm4gJiYgZWFzaW5nIHx8XG5cdFx0XHRcdGpRdWVyeS5pc0Z1bmN0aW9uKCBzcGVlZCApICYmIHNwZWVkLFxuXHRcdFx0ZHVyYXRpb246IHNwZWVkLFxuXHRcdFx0ZWFzaW5nOiBmbiAmJiBlYXNpbmcgfHwgZWFzaW5nICYmICFqUXVlcnkuaXNGdW5jdGlvbiggZWFzaW5nICkgJiYgZWFzaW5nXG5cdFx0fTtcblxuXHRcdG9wdC5kdXJhdGlvbiA9IGpRdWVyeS5meC5vZmYgPyAwIDogdHlwZW9mIG9wdC5kdXJhdGlvbiA9PT0gXCJudW1iZXJcIiA/IG9wdC5kdXJhdGlvbiA6XG5cdFx0XHRvcHQuZHVyYXRpb24gaW4galF1ZXJ5LmZ4LnNwZWVkcyA/IGpRdWVyeS5meC5zcGVlZHNbIG9wdC5kdXJhdGlvbiBdIDogalF1ZXJ5LmZ4LnNwZWVkcy5fZGVmYXVsdDtcblxuXHRcdC8vIG5vcm1hbGl6ZSBvcHQucXVldWUgLSB0cnVlL3VuZGVmaW5lZC9udWxsIC0+IFwiZnhcIlxuXHRcdGlmICggb3B0LnF1ZXVlID09IG51bGwgfHwgb3B0LnF1ZXVlID09PSB0cnVlICkge1xuXHRcdFx0b3B0LnF1ZXVlID0gXCJmeFwiO1xuXHRcdH1cblxuXHRcdC8vIFF1ZXVlaW5nXG5cdFx0b3B0Lm9sZCA9IG9wdC5jb21wbGV0ZTtcblxuXHRcdG9wdC5jb21wbGV0ZSA9IGZ1bmN0aW9uKCBub1VubWFyayApIHtcblx0XHRcdGlmICggalF1ZXJ5LmlzRnVuY3Rpb24oIG9wdC5vbGQgKSApIHtcblx0XHRcdFx0b3B0Lm9sZC5jYWxsKCB0aGlzICk7XG5cdFx0XHR9XG5cblx0XHRcdGlmICggb3B0LnF1ZXVlICkge1xuXHRcdFx0XHRqUXVlcnkuZGVxdWV1ZSggdGhpcywgb3B0LnF1ZXVlICk7XG5cdFx0XHR9IGVsc2UgaWYgKCBub1VubWFyayAhPT0gZmFsc2UgKSB7XG5cdFx0XHRcdGpRdWVyeS5fdW5tYXJrKCB0aGlzICk7XG5cdFx0XHR9XG5cdFx0fTtcblxuXHRcdHJldHVybiBvcHQ7XG5cdH0sXG5cblx0ZWFzaW5nOiB7XG5cdFx0bGluZWFyOiBmdW5jdGlvbiggcCwgbiwgZmlyc3ROdW0sIGRpZmYgKSB7XG5cdFx0XHRyZXR1cm4gZmlyc3ROdW0gKyBkaWZmICogcDtcblx0XHR9LFxuXHRcdHN3aW5nOiBmdW5jdGlvbiggcCwgbiwgZmlyc3ROdW0sIGRpZmYgKSB7XG5cdFx0XHRyZXR1cm4gKCgtTWF0aC5jb3MocCpNYXRoLlBJKS8yKSArIDAuNSkgKiBkaWZmICsgZmlyc3ROdW07XG5cdFx0fVxuXHR9LFxuXG5cdHRpbWVyczogW10sXG5cblx0Zng6IGZ1bmN0aW9uKCBlbGVtLCBvcHRpb25zLCBwcm9wICkge1xuXHRcdHRoaXMub3B0aW9ucyA9IG9wdGlvbnM7XG5cdFx0dGhpcy5lbGVtID0gZWxlbTtcblx0XHR0aGlzLnByb3AgPSBwcm9wO1xuXG5cdFx0b3B0aW9ucy5vcmlnID0gb3B0aW9ucy5vcmlnIHx8IHt9O1xuXHR9XG5cbn0pO1xuXG5qUXVlcnkuZngucHJvdG90eXBlID0ge1xuXHQvLyBTaW1wbGUgZnVuY3Rpb24gZm9yIHNldHRpbmcgYSBzdHlsZSB2YWx1ZVxuXHR1cGRhdGU6IGZ1bmN0aW9uKCkge1xuXHRcdGlmICggdGhpcy5vcHRpb25zLnN0ZXAgKSB7XG5cdFx0XHR0aGlzLm9wdGlvbnMuc3RlcC5jYWxsKCB0aGlzLmVsZW0sIHRoaXMubm93LCB0aGlzICk7XG5cdFx0fVxuXG5cdFx0KGpRdWVyeS5meC5zdGVwWyB0aGlzLnByb3AgXSB8fCBqUXVlcnkuZnguc3RlcC5fZGVmYXVsdCkoIHRoaXMgKTtcblx0fSxcblxuXHQvLyBHZXQgdGhlIGN1cnJlbnQgc2l6ZVxuXHRjdXI6IGZ1bmN0aW9uKCkge1xuXHRcdGlmICggdGhpcy5lbGVtWyB0aGlzLnByb3AgXSAhPSBudWxsICYmICghdGhpcy5lbGVtLnN0eWxlIHx8IHRoaXMuZWxlbS5zdHlsZVsgdGhpcy5wcm9wIF0gPT0gbnVsbCkgKSB7XG5cdFx0XHRyZXR1cm4gdGhpcy5lbGVtWyB0aGlzLnByb3AgXTtcblx0XHR9XG5cblx0XHR2YXIgcGFyc2VkLFxuXHRcdFx0ciA9IGpRdWVyeS5jc3MoIHRoaXMuZWxlbSwgdGhpcy5wcm9wICk7XG5cdFx0Ly8gRW1wdHkgc3RyaW5ncywgbnVsbCwgdW5kZWZpbmVkIGFuZCBcImF1dG9cIiBhcmUgY29udmVydGVkIHRvIDAsXG5cdFx0Ly8gY29tcGxleCB2YWx1ZXMgc3VjaCBhcyBcInJvdGF0ZSgxcmFkKVwiIGFyZSByZXR1cm5lZCBhcyBpcyxcblx0XHQvLyBzaW1wbGUgdmFsdWVzIHN1Y2ggYXMgXCIxMHB4XCIgYXJlIHBhcnNlZCB0byBGbG9hdC5cblx0XHRyZXR1cm4gaXNOYU4oIHBhcnNlZCA9IHBhcnNlRmxvYXQoIHIgKSApID8gIXIgfHwgciA9PT0gXCJhdXRvXCIgPyAwIDogciA6IHBhcnNlZDtcblx0fSxcblxuXHQvLyBTdGFydCBhbiBhbmltYXRpb24gZnJvbSBvbmUgbnVtYmVyIHRvIGFub3RoZXJcblx0Y3VzdG9tOiBmdW5jdGlvbiggZnJvbSwgdG8sIHVuaXQgKSB7XG5cdFx0dmFyIHNlbGYgPSB0aGlzLFxuXHRcdFx0ZnggPSBqUXVlcnkuZng7XG5cblx0XHR0aGlzLnN0YXJ0VGltZSA9IGZ4Tm93IHx8IGNyZWF0ZUZ4Tm93KCk7XG5cdFx0dGhpcy5lbmQgPSB0bztcblx0XHR0aGlzLm5vdyA9IHRoaXMuc3RhcnQgPSBmcm9tO1xuXHRcdHRoaXMucG9zID0gdGhpcy5zdGF0ZSA9IDA7XG5cdFx0dGhpcy51bml0ID0gdW5pdCB8fCB0aGlzLnVuaXQgfHwgKCBqUXVlcnkuY3NzTnVtYmVyWyB0aGlzLnByb3AgXSA/IFwiXCIgOiBcInB4XCIgKTtcblxuXHRcdGZ1bmN0aW9uIHQoIGdvdG9FbmQgKSB7XG5cdFx0XHRyZXR1cm4gc2VsZi5zdGVwKCBnb3RvRW5kICk7XG5cdFx0fVxuXG5cdFx0dC5xdWV1ZSA9IHRoaXMub3B0aW9ucy5xdWV1ZTtcblx0XHR0LmVsZW0gPSB0aGlzLmVsZW07XG5cdFx0dC5zYXZlU3RhdGUgPSBmdW5jdGlvbigpIHtcblx0XHRcdGlmICggc2VsZi5vcHRpb25zLmhpZGUgJiYgalF1ZXJ5Ll9kYXRhKCBzZWxmLmVsZW0sIFwiZnhzaG93XCIgKyBzZWxmLnByb3AgKSA9PT0gdW5kZWZpbmVkICkge1xuXHRcdFx0XHRqUXVlcnkuX2RhdGEoIHNlbGYuZWxlbSwgXCJmeHNob3dcIiArIHNlbGYucHJvcCwgc2VsZi5zdGFydCApO1xuXHRcdFx0fVxuXHRcdH07XG5cblx0XHRpZiAoIHQoKSAmJiBqUXVlcnkudGltZXJzLnB1c2godCkgJiYgIXRpbWVySWQgKSB7XG5cdFx0XHR0aW1lcklkID0gc2V0SW50ZXJ2YWwoIGZ4LnRpY2ssIGZ4LmludGVydmFsICk7XG5cdFx0fVxuXHR9LFxuXG5cdC8vIFNpbXBsZSAnc2hvdycgZnVuY3Rpb25cblx0c2hvdzogZnVuY3Rpb24oKSB7XG5cdFx0dmFyIGRhdGFTaG93ID0galF1ZXJ5Ll9kYXRhKCB0aGlzLmVsZW0sIFwiZnhzaG93XCIgKyB0aGlzLnByb3AgKTtcblxuXHRcdC8vIFJlbWVtYmVyIHdoZXJlIHdlIHN0YXJ0ZWQsIHNvIHRoYXQgd2UgY2FuIGdvIGJhY2sgdG8gaXQgbGF0ZXJcblx0XHR0aGlzLm9wdGlvbnMub3JpZ1sgdGhpcy5wcm9wIF0gPSBkYXRhU2hvdyB8fCBqUXVlcnkuc3R5bGUoIHRoaXMuZWxlbSwgdGhpcy5wcm9wICk7XG5cdFx0dGhpcy5vcHRpb25zLnNob3cgPSB0cnVlO1xuXG5cdFx0Ly8gQmVnaW4gdGhlIGFuaW1hdGlvblxuXHRcdC8vIE1ha2Ugc3VyZSB0aGF0IHdlIHN0YXJ0IGF0IGEgc21hbGwgd2lkdGgvaGVpZ2h0IHRvIGF2b2lkIGFueSBmbGFzaCBvZiBjb250ZW50XG5cdFx0aWYgKCBkYXRhU2hvdyAhPT0gdW5kZWZpbmVkICkge1xuXHRcdFx0Ly8gVGhpcyBzaG93IGlzIHBpY2tpbmcgdXAgd2hlcmUgYSBwcmV2aW91cyBoaWRlIG9yIHNob3cgbGVmdCBvZmZcblx0XHRcdHRoaXMuY3VzdG9tKCB0aGlzLmN1cigpLCBkYXRhU2hvdyApO1xuXHRcdH0gZWxzZSB7XG5cdFx0XHR0aGlzLmN1c3RvbSggdGhpcy5wcm9wID09PSBcIndpZHRoXCIgfHwgdGhpcy5wcm9wID09PSBcImhlaWdodFwiID8gMSA6IDAsIHRoaXMuY3VyKCkgKTtcblx0XHR9XG5cblx0XHQvLyBTdGFydCBieSBzaG93aW5nIHRoZSBlbGVtZW50XG5cdFx0alF1ZXJ5KCB0aGlzLmVsZW0gKS5zaG93KCk7XG5cdH0sXG5cblx0Ly8gU2ltcGxlICdoaWRlJyBmdW5jdGlvblxuXHRoaWRlOiBmdW5jdGlvbigpIHtcblx0XHQvLyBSZW1lbWJlciB3aGVyZSB3ZSBzdGFydGVkLCBzbyB0aGF0IHdlIGNhbiBnbyBiYWNrIHRvIGl0IGxhdGVyXG5cdFx0dGhpcy5vcHRpb25zLm9yaWdbIHRoaXMucHJvcCBdID0galF1ZXJ5Ll9kYXRhKCB0aGlzLmVsZW0sIFwiZnhzaG93XCIgKyB0aGlzLnByb3AgKSB8fCBqUXVlcnkuc3R5bGUoIHRoaXMuZWxlbSwgdGhpcy5wcm9wICk7XG5cdFx0dGhpcy5vcHRpb25zLmhpZGUgPSB0cnVlO1xuXG5cdFx0Ly8gQmVnaW4gdGhlIGFuaW1hdGlvblxuXHRcdHRoaXMuY3VzdG9tKCB0aGlzLmN1cigpLCAwICk7XG5cdH0sXG5cblx0Ly8gRWFjaCBzdGVwIG9mIGFuIGFuaW1hdGlvblxuXHRzdGVwOiBmdW5jdGlvbiggZ290b0VuZCApIHtcblx0XHR2YXIgcCwgbiwgY29tcGxldGUsXG5cdFx0XHR0ID0gZnhOb3cgfHwgY3JlYXRlRnhOb3coKSxcblx0XHRcdGRvbmUgPSB0cnVlLFxuXHRcdFx0ZWxlbSA9IHRoaXMuZWxlbSxcblx0XHRcdG9wdGlvbnMgPSB0aGlzLm9wdGlvbnM7XG5cblx0XHRpZiAoIGdvdG9FbmQgfHwgdCA+PSBvcHRpb25zLmR1cmF0aW9uICsgdGhpcy5zdGFydFRpbWUgKSB7XG5cdFx0XHR0aGlzLm5vdyA9IHRoaXMuZW5kO1xuXHRcdFx0dGhpcy5wb3MgPSB0aGlzLnN0YXRlID0gMTtcblx0XHRcdHRoaXMudXBkYXRlKCk7XG5cblx0XHRcdG9wdGlvbnMuYW5pbWF0ZWRQcm9wZXJ0aWVzWyB0aGlzLnByb3AgXSA9IHRydWU7XG5cblx0XHRcdGZvciAoIHAgaW4gb3B0aW9ucy5hbmltYXRlZFByb3BlcnRpZXMgKSB7XG5cdFx0XHRcdGlmICggb3B0aW9ucy5hbmltYXRlZFByb3BlcnRpZXNbIHAgXSAhPT0gdHJ1ZSApIHtcblx0XHRcdFx0XHRkb25lID0gZmFsc2U7XG5cdFx0XHRcdH1cblx0XHRcdH1cblxuXHRcdFx0aWYgKCBkb25lICkge1xuXHRcdFx0XHQvLyBSZXNldCB0aGUgb3ZlcmZsb3dcblx0XHRcdFx0aWYgKCBvcHRpb25zLm92ZXJmbG93ICE9IG51bGwgJiYgIWpRdWVyeS5zdXBwb3J0LnNocmlua1dyYXBCbG9ja3MgKSB7XG5cblx0XHRcdFx0XHRqUXVlcnkuZWFjaCggWyBcIlwiLCBcIlhcIiwgXCJZXCIgXSwgZnVuY3Rpb24oIGluZGV4LCB2YWx1ZSApIHtcblx0XHRcdFx0XHRcdGVsZW0uc3R5bGVbIFwib3ZlcmZsb3dcIiArIHZhbHVlIF0gPSBvcHRpb25zLm92ZXJmbG93WyBpbmRleCBdO1xuXHRcdFx0XHRcdH0pO1xuXHRcdFx0XHR9XG5cblx0XHRcdFx0Ly8gSGlkZSB0aGUgZWxlbWVudCBpZiB0aGUgXCJoaWRlXCIgb3BlcmF0aW9uIHdhcyBkb25lXG5cdFx0XHRcdGlmICggb3B0aW9ucy5oaWRlICkge1xuXHRcdFx0XHRcdGpRdWVyeSggZWxlbSApLmhpZGUoKTtcblx0XHRcdFx0fVxuXG5cdFx0XHRcdC8vIFJlc2V0IHRoZSBwcm9wZXJ0aWVzLCBpZiB0aGUgaXRlbSBoYXMgYmVlbiBoaWRkZW4gb3Igc2hvd25cblx0XHRcdFx0aWYgKCBvcHRpb25zLmhpZGUgfHwgb3B0aW9ucy5zaG93ICkge1xuXHRcdFx0XHRcdGZvciAoIHAgaW4gb3B0aW9ucy5hbmltYXRlZFByb3BlcnRpZXMgKSB7XG5cdFx0XHRcdFx0XHRqUXVlcnkuc3R5bGUoIGVsZW0sIHAsIG9wdGlvbnMub3JpZ1sgcCBdICk7XG5cdFx0XHRcdFx0XHRqUXVlcnkucmVtb3ZlRGF0YSggZWxlbSwgXCJmeHNob3dcIiArIHAsIHRydWUgKTtcblx0XHRcdFx0XHRcdC8vIFRvZ2dsZSBkYXRhIGlzIG5vIGxvbmdlciBuZWVkZWRcblx0XHRcdFx0XHRcdGpRdWVyeS5yZW1vdmVEYXRhKCBlbGVtLCBcInRvZ2dsZVwiICsgcCwgdHJ1ZSApO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0fVxuXG5cdFx0XHRcdC8vIEV4ZWN1dGUgdGhlIGNvbXBsZXRlIGZ1bmN0aW9uXG5cdFx0XHRcdC8vIGluIHRoZSBldmVudCB0aGF0IHRoZSBjb21wbGV0ZSBmdW5jdGlvbiB0aHJvd3MgYW4gZXhjZXB0aW9uXG5cdFx0XHRcdC8vIHdlIG11c3QgZW5zdXJlIGl0IHdvbid0IGJlIGNhbGxlZCB0d2ljZS4gIzU2ODRcblxuXHRcdFx0XHRjb21wbGV0ZSA9IG9wdGlvbnMuY29tcGxldGU7XG5cdFx0XHRcdGlmICggY29tcGxldGUgKSB7XG5cblx0XHRcdFx0XHRvcHRpb25zLmNvbXBsZXRlID0gZmFsc2U7XG5cdFx0XHRcdFx0Y29tcGxldGUuY2FsbCggZWxlbSApO1xuXHRcdFx0XHR9XG5cdFx0XHR9XG5cblx0XHRcdHJldHVybiBmYWxzZTtcblxuXHRcdH0gZWxzZSB7XG5cdFx0XHQvLyBjbGFzc2ljYWwgZWFzaW5nIGNhbm5vdCBiZSB1c2VkIHdpdGggYW4gSW5maW5pdHkgZHVyYXRpb25cblx0XHRcdGlmICggb3B0aW9ucy5kdXJhdGlvbiA9PSBJbmZpbml0eSApIHtcblx0XHRcdFx0dGhpcy5ub3cgPSB0O1xuXHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0biA9IHQgLSB0aGlzLnN0YXJ0VGltZTtcblx0XHRcdFx0dGhpcy5zdGF0ZSA9IG4gLyBvcHRpb25zLmR1cmF0aW9uO1xuXG5cdFx0XHRcdC8vIFBlcmZvcm0gdGhlIGVhc2luZyBmdW5jdGlvbiwgZGVmYXVsdHMgdG8gc3dpbmdcblx0XHRcdFx0dGhpcy5wb3MgPSBqUXVlcnkuZWFzaW5nWyBvcHRpb25zLmFuaW1hdGVkUHJvcGVydGllc1t0aGlzLnByb3BdIF0oIHRoaXMuc3RhdGUsIG4sIDAsIDEsIG9wdGlvbnMuZHVyYXRpb24gKTtcblx0XHRcdFx0dGhpcy5ub3cgPSB0aGlzLnN0YXJ0ICsgKCAodGhpcy5lbmQgLSB0aGlzLnN0YXJ0KSAqIHRoaXMucG9zICk7XG5cdFx0XHR9XG5cdFx0XHQvLyBQZXJmb3JtIHRoZSBuZXh0IHN0ZXAgb2YgdGhlIGFuaW1hdGlvblxuXHRcdFx0dGhpcy51cGRhdGUoKTtcblx0XHR9XG5cblx0XHRyZXR1cm4gdHJ1ZTtcblx0fVxufTtcblxualF1ZXJ5LmV4dGVuZCggalF1ZXJ5LmZ4LCB7XG5cdHRpY2s6IGZ1bmN0aW9uKCkge1xuXHRcdHZhciB0aW1lcixcblx0XHRcdHRpbWVycyA9IGpRdWVyeS50aW1lcnMsXG5cdFx0XHRpID0gMDtcblxuXHRcdGZvciAoIDsgaSA8IHRpbWVycy5sZW5ndGg7IGkrKyApIHtcblx0XHRcdHRpbWVyID0gdGltZXJzWyBpIF07XG5cdFx0XHQvLyBDaGVja3MgdGhlIHRpbWVyIGhhcyBub3QgYWxyZWFkeSBiZWVuIHJlbW92ZWRcblx0XHRcdGlmICggIXRpbWVyKCkgJiYgdGltZXJzWyBpIF0gPT09IHRpbWVyICkge1xuXHRcdFx0XHR0aW1lcnMuc3BsaWNlKCBpLS0sIDEgKTtcblx0XHRcdH1cblx0XHR9XG5cblx0XHRpZiAoICF0aW1lcnMubGVuZ3RoICkge1xuXHRcdFx0alF1ZXJ5LmZ4LnN0b3AoKTtcblx0XHR9XG5cdH0sXG5cblx0aW50ZXJ2YWw6IDEzLFxuXG5cdHN0b3A6IGZ1bmN0aW9uKCkge1xuXHRcdGNsZWFySW50ZXJ2YWwoIHRpbWVySWQgKTtcblx0XHR0aW1lcklkID0gbnVsbDtcblx0fSxcblxuXHRzcGVlZHM6IHtcblx0XHRzbG93OiA2MDAsXG5cdFx0ZmFzdDogMjAwLFxuXHRcdC8vIERlZmF1bHQgc3BlZWRcblx0XHRfZGVmYXVsdDogNDAwXG5cdH0sXG5cblx0c3RlcDoge1xuXHRcdG9wYWNpdHk6IGZ1bmN0aW9uKCBmeCApIHtcblx0XHRcdGpRdWVyeS5zdHlsZSggZnguZWxlbSwgXCJvcGFjaXR5XCIsIGZ4Lm5vdyApO1xuXHRcdH0sXG5cblx0XHRfZGVmYXVsdDogZnVuY3Rpb24oIGZ4ICkge1xuXHRcdFx0aWYgKCBmeC5lbGVtLnN0eWxlICYmIGZ4LmVsZW0uc3R5bGVbIGZ4LnByb3AgXSAhPSBudWxsICkge1xuXHRcdFx0XHRmeC5lbGVtLnN0eWxlWyBmeC5wcm9wIF0gPSBmeC5ub3cgKyBmeC51bml0O1xuXHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0ZnguZWxlbVsgZngucHJvcCBdID0gZngubm93O1xuXHRcdFx0fVxuXHRcdH1cblx0fVxufSk7XG5cbi8vIEFkZHMgd2lkdGgvaGVpZ2h0IHN0ZXAgZnVuY3Rpb25zXG4vLyBEbyBub3Qgc2V0IGFueXRoaW5nIGJlbG93IDBcbmpRdWVyeS5lYWNoKFsgXCJ3aWR0aFwiLCBcImhlaWdodFwiIF0sIGZ1bmN0aW9uKCBpLCBwcm9wICkge1xuXHRqUXVlcnkuZnguc3RlcFsgcHJvcCBdID0gZnVuY3Rpb24oIGZ4ICkge1xuXHRcdGpRdWVyeS5zdHlsZSggZnguZWxlbSwgcHJvcCwgTWF0aC5tYXgoMCwgZngubm93KSApO1xuXHR9O1xufSk7XG5cbmlmICggalF1ZXJ5LmV4cHIgJiYgalF1ZXJ5LmV4cHIuZmlsdGVycyApIHtcblx0alF1ZXJ5LmV4cHIuZmlsdGVycy5hbmltYXRlZCA9IGZ1bmN0aW9uKCBlbGVtICkge1xuXHRcdHJldHVybiBqUXVlcnkuZ3JlcChqUXVlcnkudGltZXJzLCBmdW5jdGlvbiggZm4gKSB7XG5cdFx0XHRyZXR1cm4gZWxlbSA9PT0gZm4uZWxlbTtcblx0XHR9KS5sZW5ndGg7XG5cdH07XG59XG5cbi8vIFRyeSB0byByZXN0b3JlIHRoZSBkZWZhdWx0IGRpc3BsYXkgdmFsdWUgb2YgYW4gZWxlbWVudFxuZnVuY3Rpb24gZGVmYXVsdERpc3BsYXkoIG5vZGVOYW1lICkge1xuXG5cdGlmICggIWVsZW1kaXNwbGF5WyBub2RlTmFtZSBdICkge1xuXG5cdFx0dmFyIGJvZHkgPSBkb2N1bWVudC5ib2R5LFxuXHRcdFx0ZWxlbSA9IGpRdWVyeSggXCI8XCIgKyBub2RlTmFtZSArIFwiPlwiICkuYXBwZW5kVG8oIGJvZHkgKSxcblx0XHRcdGRpc3BsYXkgPSBlbGVtLmNzcyggXCJkaXNwbGF5XCIgKTtcblxuXHRcdGVsZW0ucmVtb3ZlKCk7XG5cblx0XHQvLyBJZiB0aGUgc2ltcGxlIHdheSBmYWlscyxcblx0XHQvLyBnZXQgZWxlbWVudCdzIHJlYWwgZGVmYXVsdCBkaXNwbGF5IGJ5IGF0dGFjaGluZyBpdCB0byBhIHRlbXAgaWZyYW1lXG5cdFx0aWYgKCBkaXNwbGF5ID09PSBcIm5vbmVcIiB8fCBkaXNwbGF5ID09PSBcIlwiICkge1xuXHRcdFx0Ly8gTm8gaWZyYW1lIHRvIHVzZSB5ZXQsIHNvIGNyZWF0ZSBpdFxuXHRcdFx0aWYgKCAhaWZyYW1lICkge1xuXHRcdFx0XHRpZnJhbWUgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCBcImlmcmFtZVwiICk7XG5cdFx0XHRcdGlmcmFtZS5mcmFtZUJvcmRlciA9IGlmcmFtZS53aWR0aCA9IGlmcmFtZS5oZWlnaHQgPSAwO1xuXHRcdFx0fVxuXG5cdFx0XHRib2R5LmFwcGVuZENoaWxkKCBpZnJhbWUgKTtcblxuXHRcdFx0Ly8gQ3JlYXRlIGEgY2FjaGVhYmxlIGNvcHkgb2YgdGhlIGlmcmFtZSBkb2N1bWVudCBvbiBmaXJzdCBjYWxsLlxuXHRcdFx0Ly8gSUUgYW5kIE9wZXJhIHdpbGwgYWxsb3cgdXMgdG8gcmV1c2UgdGhlIGlmcmFtZURvYyB3aXRob3V0IHJlLXdyaXRpbmcgdGhlIGZha2UgSFRNTFxuXHRcdFx0Ly8gZG9jdW1lbnQgdG8gaXQ7IFdlYktpdCAmIEZpcmVmb3ggd29uJ3QgYWxsb3cgcmV1c2luZyB0aGUgaWZyYW1lIGRvY3VtZW50LlxuXHRcdFx0aWYgKCAhaWZyYW1lRG9jIHx8ICFpZnJhbWUuY3JlYXRlRWxlbWVudCApIHtcblx0XHRcdFx0aWZyYW1lRG9jID0gKCBpZnJhbWUuY29udGVudFdpbmRvdyB8fCBpZnJhbWUuY29udGVudERvY3VtZW50ICkuZG9jdW1lbnQ7XG5cdFx0XHRcdGlmcmFtZURvYy53cml0ZSggKCBkb2N1bWVudC5jb21wYXRNb2RlID09PSBcIkNTUzFDb21wYXRcIiA/IFwiPCFkb2N0eXBlIGh0bWw+XCIgOiBcIlwiICkgKyBcIjxodG1sPjxib2R5PlwiICk7XG5cdFx0XHRcdGlmcmFtZURvYy5jbG9zZSgpO1xuXHRcdFx0fVxuXG5cdFx0XHRlbGVtID0gaWZyYW1lRG9jLmNyZWF0ZUVsZW1lbnQoIG5vZGVOYW1lICk7XG5cblx0XHRcdGlmcmFtZURvYy5ib2R5LmFwcGVuZENoaWxkKCBlbGVtICk7XG5cblx0XHRcdGRpc3BsYXkgPSBqUXVlcnkuY3NzKCBlbGVtLCBcImRpc3BsYXlcIiApO1xuXG5cdFx0XHRib2R5LnJlbW92ZUNoaWxkKCBpZnJhbWUgKTtcblx0XHR9XG5cblx0XHQvLyBTdG9yZSB0aGUgY29ycmVjdCBkZWZhdWx0IGRpc3BsYXlcblx0XHRlbGVtZGlzcGxheVsgbm9kZU5hbWUgXSA9IGRpc3BsYXk7XG5cdH1cblxuXHRyZXR1cm4gZWxlbWRpc3BsYXlbIG5vZGVOYW1lIF07XG59XG5cblxuXG5cbnZhciBydGFibGUgPSAvXnQoPzphYmxlfGR8aCkkL2ksXG5cdHJyb290ID0gL14oPzpib2R5fGh0bWwpJC9pO1xuXG5pZiAoIFwiZ2V0Qm91bmRpbmdDbGllbnRSZWN0XCIgaW4gZG9jdW1lbnQuZG9jdW1lbnRFbGVtZW50ICkge1xuXHRqUXVlcnkuZm4ub2Zmc2V0ID0gZnVuY3Rpb24oIG9wdGlvbnMgKSB7XG5cdFx0dmFyIGVsZW0gPSB0aGlzWzBdLCBib3g7XG5cblx0XHRpZiAoIG9wdGlvbnMgKSB7XG5cdFx0XHRyZXR1cm4gdGhpcy5lYWNoKGZ1bmN0aW9uKCBpICkge1xuXHRcdFx0XHRqUXVlcnkub2Zmc2V0LnNldE9mZnNldCggdGhpcywgb3B0aW9ucywgaSApO1xuXHRcdFx0fSk7XG5cdFx0fVxuXG5cdFx0aWYgKCAhZWxlbSB8fCAhZWxlbS5vd25lckRvY3VtZW50ICkge1xuXHRcdFx0cmV0dXJuIG51bGw7XG5cdFx0fVxuXG5cdFx0aWYgKCBlbGVtID09PSBlbGVtLm93bmVyRG9jdW1lbnQuYm9keSApIHtcblx0XHRcdHJldHVybiBqUXVlcnkub2Zmc2V0LmJvZHlPZmZzZXQoIGVsZW0gKTtcblx0XHR9XG5cblx0XHR0cnkge1xuXHRcdFx0Ym94ID0gZWxlbS5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKTtcblx0XHR9IGNhdGNoKGUpIHt9XG5cblx0XHR2YXIgZG9jID0gZWxlbS5vd25lckRvY3VtZW50LFxuXHRcdFx0ZG9jRWxlbSA9IGRvYy5kb2N1bWVudEVsZW1lbnQ7XG5cblx0XHQvLyBNYWtlIHN1cmUgd2UncmUgbm90IGRlYWxpbmcgd2l0aCBhIGRpc2Nvbm5lY3RlZCBET00gbm9kZVxuXHRcdGlmICggIWJveCB8fCAhalF1ZXJ5LmNvbnRhaW5zKCBkb2NFbGVtLCBlbGVtICkgKSB7XG5cdFx0XHRyZXR1cm4gYm94ID8geyB0b3A6IGJveC50b3AsIGxlZnQ6IGJveC5sZWZ0IH0gOiB7IHRvcDogMCwgbGVmdDogMCB9O1xuXHRcdH1cblxuXHRcdHZhciBib2R5ID0gZG9jLmJvZHksXG5cdFx0XHR3aW4gPSBnZXRXaW5kb3coZG9jKSxcblx0XHRcdGNsaWVudFRvcCAgPSBkb2NFbGVtLmNsaWVudFRvcCAgfHwgYm9keS5jbGllbnRUb3AgIHx8IDAsXG5cdFx0XHRjbGllbnRMZWZ0ID0gZG9jRWxlbS5jbGllbnRMZWZ0IHx8IGJvZHkuY2xpZW50TGVmdCB8fCAwLFxuXHRcdFx0c2Nyb2xsVG9wICA9IHdpbi5wYWdlWU9mZnNldCB8fCBqUXVlcnkuc3VwcG9ydC5ib3hNb2RlbCAmJiBkb2NFbGVtLnNjcm9sbFRvcCAgfHwgYm9keS5zY3JvbGxUb3AsXG5cdFx0XHRzY3JvbGxMZWZ0ID0gd2luLnBhZ2VYT2Zmc2V0IHx8IGpRdWVyeS5zdXBwb3J0LmJveE1vZGVsICYmIGRvY0VsZW0uc2Nyb2xsTGVmdCB8fCBib2R5LnNjcm9sbExlZnQsXG5cdFx0XHR0b3AgID0gYm94LnRvcCAgKyBzY3JvbGxUb3AgIC0gY2xpZW50VG9wLFxuXHRcdFx0bGVmdCA9IGJveC5sZWZ0ICsgc2Nyb2xsTGVmdCAtIGNsaWVudExlZnQ7XG5cblx0XHRyZXR1cm4geyB0b3A6IHRvcCwgbGVmdDogbGVmdCB9O1xuXHR9O1xuXG59IGVsc2Uge1xuXHRqUXVlcnkuZm4ub2Zmc2V0ID0gZnVuY3Rpb24oIG9wdGlvbnMgKSB7XG5cdFx0dmFyIGVsZW0gPSB0aGlzWzBdO1xuXG5cdFx0aWYgKCBvcHRpb25zICkge1xuXHRcdFx0cmV0dXJuIHRoaXMuZWFjaChmdW5jdGlvbiggaSApIHtcblx0XHRcdFx0alF1ZXJ5Lm9mZnNldC5zZXRPZmZzZXQoIHRoaXMsIG9wdGlvbnMsIGkgKTtcblx0XHRcdH0pO1xuXHRcdH1cblxuXHRcdGlmICggIWVsZW0gfHwgIWVsZW0ub3duZXJEb2N1bWVudCApIHtcblx0XHRcdHJldHVybiBudWxsO1xuXHRcdH1cblxuXHRcdGlmICggZWxlbSA9PT0gZWxlbS5vd25lckRvY3VtZW50LmJvZHkgKSB7XG5cdFx0XHRyZXR1cm4galF1ZXJ5Lm9mZnNldC5ib2R5T2Zmc2V0KCBlbGVtICk7XG5cdFx0fVxuXG5cdFx0dmFyIGNvbXB1dGVkU3R5bGUsXG5cdFx0XHRvZmZzZXRQYXJlbnQgPSBlbGVtLm9mZnNldFBhcmVudCxcblx0XHRcdHByZXZPZmZzZXRQYXJlbnQgPSBlbGVtLFxuXHRcdFx0ZG9jID0gZWxlbS5vd25lckRvY3VtZW50LFxuXHRcdFx0ZG9jRWxlbSA9IGRvYy5kb2N1bWVudEVsZW1lbnQsXG5cdFx0XHRib2R5ID0gZG9jLmJvZHksXG5cdFx0XHRkZWZhdWx0VmlldyA9IGRvYy5kZWZhdWx0Vmlldyxcblx0XHRcdHByZXZDb21wdXRlZFN0eWxlID0gZGVmYXVsdFZpZXcgPyBkZWZhdWx0Vmlldy5nZXRDb21wdXRlZFN0eWxlKCBlbGVtLCBudWxsICkgOiBlbGVtLmN1cnJlbnRTdHlsZSxcblx0XHRcdHRvcCA9IGVsZW0ub2Zmc2V0VG9wLFxuXHRcdFx0bGVmdCA9IGVsZW0ub2Zmc2V0TGVmdDtcblxuXHRcdHdoaWxlICggKGVsZW0gPSBlbGVtLnBhcmVudE5vZGUpICYmIGVsZW0gIT09IGJvZHkgJiYgZWxlbSAhPT0gZG9jRWxlbSApIHtcblx0XHRcdGlmICggalF1ZXJ5Lm9mZnNldC5zdXBwb3J0c0ZpeGVkUG9zaXRpb24gJiYgcHJldkNvbXB1dGVkU3R5bGUucG9zaXRpb24gPT09IFwiZml4ZWRcIiApIHtcblx0XHRcdFx0YnJlYWs7XG5cdFx0XHR9XG5cblx0XHRcdGNvbXB1dGVkU3R5bGUgPSBkZWZhdWx0VmlldyA/IGRlZmF1bHRWaWV3LmdldENvbXB1dGVkU3R5bGUoZWxlbSwgbnVsbCkgOiBlbGVtLmN1cnJlbnRTdHlsZTtcblx0XHRcdHRvcCAgLT0gZWxlbS5zY3JvbGxUb3A7XG5cdFx0XHRsZWZ0IC09IGVsZW0uc2Nyb2xsTGVmdDtcblxuXHRcdFx0aWYgKCBlbGVtID09PSBvZmZzZXRQYXJlbnQgKSB7XG5cdFx0XHRcdHRvcCAgKz0gZWxlbS5vZmZzZXRUb3A7XG5cdFx0XHRcdGxlZnQgKz0gZWxlbS5vZmZzZXRMZWZ0O1xuXG5cdFx0XHRcdGlmICggalF1ZXJ5Lm9mZnNldC5kb2VzTm90QWRkQm9yZGVyICYmICEoalF1ZXJ5Lm9mZnNldC5kb2VzQWRkQm9yZGVyRm9yVGFibGVBbmRDZWxscyAmJiBydGFibGUudGVzdChlbGVtLm5vZGVOYW1lKSkgKSB7XG5cdFx0XHRcdFx0dG9wICArPSBwYXJzZUZsb2F0KCBjb21wdXRlZFN0eWxlLmJvcmRlclRvcFdpZHRoICApIHx8IDA7XG5cdFx0XHRcdFx0bGVmdCArPSBwYXJzZUZsb2F0KCBjb21wdXRlZFN0eWxlLmJvcmRlckxlZnRXaWR0aCApIHx8IDA7XG5cdFx0XHRcdH1cblxuXHRcdFx0XHRwcmV2T2Zmc2V0UGFyZW50ID0gb2Zmc2V0UGFyZW50O1xuXHRcdFx0XHRvZmZzZXRQYXJlbnQgPSBlbGVtLm9mZnNldFBhcmVudDtcblx0XHRcdH1cblxuXHRcdFx0aWYgKCBqUXVlcnkub2Zmc2V0LnN1YnRyYWN0c0JvcmRlckZvck92ZXJmbG93Tm90VmlzaWJsZSAmJiBjb21wdXRlZFN0eWxlLm92ZXJmbG93ICE9PSBcInZpc2libGVcIiApIHtcblx0XHRcdFx0dG9wICArPSBwYXJzZUZsb2F0KCBjb21wdXRlZFN0eWxlLmJvcmRlclRvcFdpZHRoICApIHx8IDA7XG5cdFx0XHRcdGxlZnQgKz0gcGFyc2VGbG9hdCggY29tcHV0ZWRTdHlsZS5ib3JkZXJMZWZ0V2lkdGggKSB8fCAwO1xuXHRcdFx0fVxuXG5cdFx0XHRwcmV2Q29tcHV0ZWRTdHlsZSA9IGNvbXB1dGVkU3R5bGU7XG5cdFx0fVxuXG5cdFx0aWYgKCBwcmV2Q29tcHV0ZWRTdHlsZS5wb3NpdGlvbiA9PT0gXCJyZWxhdGl2ZVwiIHx8IHByZXZDb21wdXRlZFN0eWxlLnBvc2l0aW9uID09PSBcInN0YXRpY1wiICkge1xuXHRcdFx0dG9wICArPSBib2R5Lm9mZnNldFRvcDtcblx0XHRcdGxlZnQgKz0gYm9keS5vZmZzZXRMZWZ0O1xuXHRcdH1cblxuXHRcdGlmICggalF1ZXJ5Lm9mZnNldC5zdXBwb3J0c0ZpeGVkUG9zaXRpb24gJiYgcHJldkNvbXB1dGVkU3R5bGUucG9zaXRpb24gPT09IFwiZml4ZWRcIiApIHtcblx0XHRcdHRvcCAgKz0gTWF0aC5tYXgoIGRvY0VsZW0uc2Nyb2xsVG9wLCBib2R5LnNjcm9sbFRvcCApO1xuXHRcdFx0bGVmdCArPSBNYXRoLm1heCggZG9jRWxlbS5zY3JvbGxMZWZ0LCBib2R5LnNjcm9sbExlZnQgKTtcblx0XHR9XG5cblx0XHRyZXR1cm4geyB0b3A6IHRvcCwgbGVmdDogbGVmdCB9O1xuXHR9O1xufVxuXG5qUXVlcnkub2Zmc2V0ID0ge307XG5cbmpRdWVyeS5lYWNoKFxuXHQoIFwiZG9lc0FkZEJvcmRlckZvclRhYmxlQW5kQ2VsbHMgZG9lc05vdEFkZEJvcmRlciBcIiArXG5cdFx0XCJkb2VzTm90SW5jbHVkZU1hcmdpbkluQm9keU9mZnNldCBzdWJ0cmFjdHNCb3JkZXJGb3JPdmVyZmxvd05vdFZpc2libGUgXCIgK1xuXHRcdFwic3VwcG9ydHNGaXhlZFBvc2l0aW9uXCIgKS5zcGxpdChcIiBcIiksIGZ1bmN0aW9uKCBpLCBwcm9wICkge1xuXG5cdGpRdWVyeS5vZmZzZXRbIHByb3AgXSA9IGpRdWVyeS5zdXBwb3J0WyBwcm9wIF07XG59KTtcblxualF1ZXJ5LmV4dGVuZCggalF1ZXJ5Lm9mZnNldCwge1xuXG5cdGJvZHlPZmZzZXQ6IGZ1bmN0aW9uKCBib2R5ICkge1xuXHRcdHZhciB0b3AgPSBib2R5Lm9mZnNldFRvcCxcblx0XHRcdGxlZnQgPSBib2R5Lm9mZnNldExlZnQ7XG5cblx0XHRpZiAoIGpRdWVyeS5vZmZzZXQuZG9lc05vdEluY2x1ZGVNYXJnaW5JbkJvZHlPZmZzZXQgKSB7XG5cdFx0XHR0b3AgICs9IHBhcnNlRmxvYXQoIGpRdWVyeS5jc3MoYm9keSwgXCJtYXJnaW5Ub3BcIikgKSB8fCAwO1xuXHRcdFx0bGVmdCArPSBwYXJzZUZsb2F0KCBqUXVlcnkuY3NzKGJvZHksIFwibWFyZ2luTGVmdFwiKSApIHx8IDA7XG5cdFx0fVxuXG5cdFx0cmV0dXJuIHsgdG9wOiB0b3AsIGxlZnQ6IGxlZnQgfTtcblx0fSxcblxuXHRzZXRPZmZzZXQ6IGZ1bmN0aW9uKCBlbGVtLCBvcHRpb25zLCBpICkge1xuXHRcdHZhciBwb3NpdGlvbiA9IGpRdWVyeS5jc3MoIGVsZW0sIFwicG9zaXRpb25cIiApO1xuXG5cdFx0Ly8gc2V0IHBvc2l0aW9uIGZpcnN0LCBpbi1jYXNlIHRvcC9sZWZ0IGFyZSBzZXQgZXZlbiBvbiBzdGF0aWMgZWxlbVxuXHRcdGlmICggcG9zaXRpb24gPT09IFwic3RhdGljXCIgKSB7XG5cdFx0XHRlbGVtLnN0eWxlLnBvc2l0aW9uID0gXCJyZWxhdGl2ZVwiO1xuXHRcdH1cblxuXHRcdHZhciBjdXJFbGVtID0galF1ZXJ5KCBlbGVtICksXG5cdFx0XHRjdXJPZmZzZXQgPSBjdXJFbGVtLm9mZnNldCgpLFxuXHRcdFx0Y3VyQ1NTVG9wID0galF1ZXJ5LmNzcyggZWxlbSwgXCJ0b3BcIiApLFxuXHRcdFx0Y3VyQ1NTTGVmdCA9IGpRdWVyeS5jc3MoIGVsZW0sIFwibGVmdFwiICksXG5cdFx0XHRjYWxjdWxhdGVQb3NpdGlvbiA9IChwb3NpdGlvbiA9PT0gXCJhYnNvbHV0ZVwiIHx8IHBvc2l0aW9uID09PSBcImZpeGVkXCIpICYmIGpRdWVyeS5pbkFycmF5KFwiYXV0b1wiLCBbY3VyQ1NTVG9wLCBjdXJDU1NMZWZ0XSkgPiAtMSxcblx0XHRcdHByb3BzID0ge30sIGN1clBvc2l0aW9uID0ge30sIGN1clRvcCwgY3VyTGVmdDtcblxuXHRcdC8vIG5lZWQgdG8gYmUgYWJsZSB0byBjYWxjdWxhdGUgcG9zaXRpb24gaWYgZWl0aGVyIHRvcCBvciBsZWZ0IGlzIGF1dG8gYW5kIHBvc2l0aW9uIGlzIGVpdGhlciBhYnNvbHV0ZSBvciBmaXhlZFxuXHRcdGlmICggY2FsY3VsYXRlUG9zaXRpb24gKSB7XG5cdFx0XHRjdXJQb3NpdGlvbiA9IGN1ckVsZW0ucG9zaXRpb24oKTtcblx0XHRcdGN1clRvcCA9IGN1clBvc2l0aW9uLnRvcDtcblx0XHRcdGN1ckxlZnQgPSBjdXJQb3NpdGlvbi5sZWZ0O1xuXHRcdH0gZWxzZSB7XG5cdFx0XHRjdXJUb3AgPSBwYXJzZUZsb2F0KCBjdXJDU1NUb3AgKSB8fCAwO1xuXHRcdFx0Y3VyTGVmdCA9IHBhcnNlRmxvYXQoIGN1ckNTU0xlZnQgKSB8fCAwO1xuXHRcdH1cblxuXHRcdGlmICggalF1ZXJ5LmlzRnVuY3Rpb24oIG9wdGlvbnMgKSApIHtcblx0XHRcdG9wdGlvbnMgPSBvcHRpb25zLmNhbGwoIGVsZW0sIGksIGN1ck9mZnNldCApO1xuXHRcdH1cblxuXHRcdGlmIChvcHRpb25zLnRvcCAhPSBudWxsKSB7XG5cdFx0XHRwcm9wcy50b3AgPSAob3B0aW9ucy50b3AgLSBjdXJPZmZzZXQudG9wKSArIGN1clRvcDtcblx0XHR9XG5cdFx0aWYgKG9wdGlvbnMubGVmdCAhPSBudWxsKSB7XG5cdFx0XHRwcm9wcy5sZWZ0ID0gKG9wdGlvbnMubGVmdCAtIGN1ck9mZnNldC5sZWZ0KSArIGN1ckxlZnQ7XG5cdFx0fVxuXG5cdFx0aWYgKCBcInVzaW5nXCIgaW4gb3B0aW9ucyApIHtcblx0XHRcdG9wdGlvbnMudXNpbmcuY2FsbCggZWxlbSwgcHJvcHMgKTtcblx0XHR9IGVsc2Uge1xuXHRcdFx0Y3VyRWxlbS5jc3MoIHByb3BzICk7XG5cdFx0fVxuXHR9XG59KTtcblxuXG5qUXVlcnkuZm4uZXh0ZW5kKHtcblxuXHRwb3NpdGlvbjogZnVuY3Rpb24oKSB7XG5cdFx0aWYgKCAhdGhpc1swXSApIHtcblx0XHRcdHJldHVybiBudWxsO1xuXHRcdH1cblxuXHRcdHZhciBlbGVtID0gdGhpc1swXSxcblxuXHRcdC8vIEdldCAqcmVhbCogb2Zmc2V0UGFyZW50XG5cdFx0b2Zmc2V0UGFyZW50ID0gdGhpcy5vZmZzZXRQYXJlbnQoKSxcblxuXHRcdC8vIEdldCBjb3JyZWN0IG9mZnNldHNcblx0XHRvZmZzZXQgICAgICAgPSB0aGlzLm9mZnNldCgpLFxuXHRcdHBhcmVudE9mZnNldCA9IHJyb290LnRlc3Qob2Zmc2V0UGFyZW50WzBdLm5vZGVOYW1lKSA/IHsgdG9wOiAwLCBsZWZ0OiAwIH0gOiBvZmZzZXRQYXJlbnQub2Zmc2V0KCk7XG5cblx0XHQvLyBTdWJ0cmFjdCBlbGVtZW50IG1hcmdpbnNcblx0XHQvLyBub3RlOiB3aGVuIGFuIGVsZW1lbnQgaGFzIG1hcmdpbjogYXV0byB0aGUgb2Zmc2V0TGVmdCBhbmQgbWFyZ2luTGVmdFxuXHRcdC8vIGFyZSB0aGUgc2FtZSBpbiBTYWZhcmkgY2F1c2luZyBvZmZzZXQubGVmdCB0byBpbmNvcnJlY3RseSBiZSAwXG5cdFx0b2Zmc2V0LnRvcCAgLT0gcGFyc2VGbG9hdCggalF1ZXJ5LmNzcyhlbGVtLCBcIm1hcmdpblRvcFwiKSApIHx8IDA7XG5cdFx0b2Zmc2V0LmxlZnQgLT0gcGFyc2VGbG9hdCggalF1ZXJ5LmNzcyhlbGVtLCBcIm1hcmdpbkxlZnRcIikgKSB8fCAwO1xuXG5cdFx0Ly8gQWRkIG9mZnNldFBhcmVudCBib3JkZXJzXG5cdFx0cGFyZW50T2Zmc2V0LnRvcCAgKz0gcGFyc2VGbG9hdCggalF1ZXJ5LmNzcyhvZmZzZXRQYXJlbnRbMF0sIFwiYm9yZGVyVG9wV2lkdGhcIikgKSB8fCAwO1xuXHRcdHBhcmVudE9mZnNldC5sZWZ0ICs9IHBhcnNlRmxvYXQoIGpRdWVyeS5jc3Mob2Zmc2V0UGFyZW50WzBdLCBcImJvcmRlckxlZnRXaWR0aFwiKSApIHx8IDA7XG5cblx0XHQvLyBTdWJ0cmFjdCB0aGUgdHdvIG9mZnNldHNcblx0XHRyZXR1cm4ge1xuXHRcdFx0dG9wOiAgb2Zmc2V0LnRvcCAgLSBwYXJlbnRPZmZzZXQudG9wLFxuXHRcdFx0bGVmdDogb2Zmc2V0LmxlZnQgLSBwYXJlbnRPZmZzZXQubGVmdFxuXHRcdH07XG5cdH0sXG5cblx0b2Zmc2V0UGFyZW50OiBmdW5jdGlvbigpIHtcblx0XHRyZXR1cm4gdGhpcy5tYXAoZnVuY3Rpb24oKSB7XG5cdFx0XHR2YXIgb2Zmc2V0UGFyZW50ID0gdGhpcy5vZmZzZXRQYXJlbnQgfHwgZG9jdW1lbnQuYm9keTtcblx0XHRcdHdoaWxlICggb2Zmc2V0UGFyZW50ICYmICghcnJvb3QudGVzdChvZmZzZXRQYXJlbnQubm9kZU5hbWUpICYmIGpRdWVyeS5jc3Mob2Zmc2V0UGFyZW50LCBcInBvc2l0aW9uXCIpID09PSBcInN0YXRpY1wiKSApIHtcblx0XHRcdFx0b2Zmc2V0UGFyZW50ID0gb2Zmc2V0UGFyZW50Lm9mZnNldFBhcmVudDtcblx0XHRcdH1cblx0XHRcdHJldHVybiBvZmZzZXRQYXJlbnQ7XG5cdFx0fSk7XG5cdH1cbn0pO1xuXG5cbi8vIENyZWF0ZSBzY3JvbGxMZWZ0IGFuZCBzY3JvbGxUb3AgbWV0aG9kc1xualF1ZXJ5LmVhY2goIFtcIkxlZnRcIiwgXCJUb3BcIl0sIGZ1bmN0aW9uKCBpLCBuYW1lICkge1xuXHR2YXIgbWV0aG9kID0gXCJzY3JvbGxcIiArIG5hbWU7XG5cblx0alF1ZXJ5LmZuWyBtZXRob2QgXSA9IGZ1bmN0aW9uKCB2YWwgKSB7XG5cdFx0dmFyIGVsZW0sIHdpbjtcblxuXHRcdGlmICggdmFsID09PSB1bmRlZmluZWQgKSB7XG5cdFx0XHRlbGVtID0gdGhpc1sgMCBdO1xuXG5cdFx0XHRpZiAoICFlbGVtICkge1xuXHRcdFx0XHRyZXR1cm4gbnVsbDtcblx0XHRcdH1cblxuXHRcdFx0d2luID0gZ2V0V2luZG93KCBlbGVtICk7XG5cblx0XHRcdC8vIFJldHVybiB0aGUgc2Nyb2xsIG9mZnNldFxuXHRcdFx0cmV0dXJuIHdpbiA/IChcInBhZ2VYT2Zmc2V0XCIgaW4gd2luKSA/IHdpblsgaSA/IFwicGFnZVlPZmZzZXRcIiA6IFwicGFnZVhPZmZzZXRcIiBdIDpcblx0XHRcdFx0alF1ZXJ5LnN1cHBvcnQuYm94TW9kZWwgJiYgd2luLmRvY3VtZW50LmRvY3VtZW50RWxlbWVudFsgbWV0aG9kIF0gfHxcblx0XHRcdFx0XHR3aW4uZG9jdW1lbnQuYm9keVsgbWV0aG9kIF0gOlxuXHRcdFx0XHRlbGVtWyBtZXRob2QgXTtcblx0XHR9XG5cblx0XHQvLyBTZXQgdGhlIHNjcm9sbCBvZmZzZXRcblx0XHRyZXR1cm4gdGhpcy5lYWNoKGZ1bmN0aW9uKCkge1xuXHRcdFx0d2luID0gZ2V0V2luZG93KCB0aGlzICk7XG5cblx0XHRcdGlmICggd2luICkge1xuXHRcdFx0XHR3aW4uc2Nyb2xsVG8oXG5cdFx0XHRcdFx0IWkgPyB2YWwgOiBqUXVlcnkoIHdpbiApLnNjcm9sbExlZnQoKSxcblx0XHRcdFx0XHQgaSA/IHZhbCA6IGpRdWVyeSggd2luICkuc2Nyb2xsVG9wKClcblx0XHRcdFx0KTtcblxuXHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0dGhpc1sgbWV0aG9kIF0gPSB2YWw7XG5cdFx0XHR9XG5cdFx0fSk7XG5cdH07XG59KTtcblxuZnVuY3Rpb24gZ2V0V2luZG93KCBlbGVtICkge1xuXHRyZXR1cm4galF1ZXJ5LmlzV2luZG93KCBlbGVtICkgP1xuXHRcdGVsZW0gOlxuXHRcdGVsZW0ubm9kZVR5cGUgPT09IDkgP1xuXHRcdFx0ZWxlbS5kZWZhdWx0VmlldyB8fCBlbGVtLnBhcmVudFdpbmRvdyA6XG5cdFx0XHRmYWxzZTtcbn1cblxuXG5cblxuLy8gQ3JlYXRlIHdpZHRoLCBoZWlnaHQsIGlubmVySGVpZ2h0LCBpbm5lcldpZHRoLCBvdXRlckhlaWdodCBhbmQgb3V0ZXJXaWR0aCBtZXRob2RzXG5qUXVlcnkuZWFjaChbIFwiSGVpZ2h0XCIsIFwiV2lkdGhcIiBdLCBmdW5jdGlvbiggaSwgbmFtZSApIHtcblxuXHR2YXIgdHlwZSA9IG5hbWUudG9Mb3dlckNhc2UoKTtcblxuXHQvLyBpbm5lckhlaWdodCBhbmQgaW5uZXJXaWR0aFxuXHRqUXVlcnkuZm5bIFwiaW5uZXJcIiArIG5hbWUgXSA9IGZ1bmN0aW9uKCkge1xuXHRcdHZhciBlbGVtID0gdGhpc1swXTtcblx0XHRyZXR1cm4gZWxlbSA/XG5cdFx0XHRlbGVtLnN0eWxlID9cblx0XHRcdHBhcnNlRmxvYXQoIGpRdWVyeS5jc3MoIGVsZW0sIHR5cGUsIFwicGFkZGluZ1wiICkgKSA6XG5cdFx0XHR0aGlzWyB0eXBlIF0oKSA6XG5cdFx0XHRudWxsO1xuXHR9O1xuXG5cdC8vIG91dGVySGVpZ2h0IGFuZCBvdXRlcldpZHRoXG5cdGpRdWVyeS5mblsgXCJvdXRlclwiICsgbmFtZSBdID0gZnVuY3Rpb24oIG1hcmdpbiApIHtcblx0XHR2YXIgZWxlbSA9IHRoaXNbMF07XG5cdFx0cmV0dXJuIGVsZW0gP1xuXHRcdFx0ZWxlbS5zdHlsZSA/XG5cdFx0XHRwYXJzZUZsb2F0KCBqUXVlcnkuY3NzKCBlbGVtLCB0eXBlLCBtYXJnaW4gPyBcIm1hcmdpblwiIDogXCJib3JkZXJcIiApICkgOlxuXHRcdFx0dGhpc1sgdHlwZSBdKCkgOlxuXHRcdFx0bnVsbDtcblx0fTtcblxuXHRqUXVlcnkuZm5bIHR5cGUgXSA9IGZ1bmN0aW9uKCBzaXplICkge1xuXHRcdC8vIEdldCB3aW5kb3cgd2lkdGggb3IgaGVpZ2h0XG5cdFx0dmFyIGVsZW0gPSB0aGlzWzBdO1xuXHRcdGlmICggIWVsZW0gKSB7XG5cdFx0XHRyZXR1cm4gc2l6ZSA9PSBudWxsID8gbnVsbCA6IHRoaXM7XG5cdFx0fVxuXG5cdFx0aWYgKCBqUXVlcnkuaXNGdW5jdGlvbiggc2l6ZSApICkge1xuXHRcdFx0cmV0dXJuIHRoaXMuZWFjaChmdW5jdGlvbiggaSApIHtcblx0XHRcdFx0dmFyIHNlbGYgPSBqUXVlcnkoIHRoaXMgKTtcblx0XHRcdFx0c2VsZlsgdHlwZSBdKCBzaXplLmNhbGwoIHRoaXMsIGksIHNlbGZbIHR5cGUgXSgpICkgKTtcblx0XHRcdH0pO1xuXHRcdH1cblxuXHRcdGlmICggalF1ZXJ5LmlzV2luZG93KCBlbGVtICkgKSB7XG5cdFx0XHQvLyBFdmVyeW9uZSBlbHNlIHVzZSBkb2N1bWVudC5kb2N1bWVudEVsZW1lbnQgb3IgZG9jdW1lbnQuYm9keSBkZXBlbmRpbmcgb24gUXVpcmtzIHZzIFN0YW5kYXJkcyBtb2RlXG5cdFx0XHQvLyAzcmQgY29uZGl0aW9uIGFsbG93cyBOb2tpYSBzdXBwb3J0LCBhcyBpdCBzdXBwb3J0cyB0aGUgZG9jRWxlbSBwcm9wIGJ1dCBub3QgQ1NTMUNvbXBhdFxuXHRcdFx0dmFyIGRvY0VsZW1Qcm9wID0gZWxlbS5kb2N1bWVudC5kb2N1bWVudEVsZW1lbnRbIFwiY2xpZW50XCIgKyBuYW1lIF0sXG5cdFx0XHRcdGJvZHkgPSBlbGVtLmRvY3VtZW50LmJvZHk7XG5cdFx0XHRyZXR1cm4gZWxlbS5kb2N1bWVudC5jb21wYXRNb2RlID09PSBcIkNTUzFDb21wYXRcIiAmJiBkb2NFbGVtUHJvcCB8fFxuXHRcdFx0XHRib2R5ICYmIGJvZHlbIFwiY2xpZW50XCIgKyBuYW1lIF0gfHwgZG9jRWxlbVByb3A7XG5cblx0XHQvLyBHZXQgZG9jdW1lbnQgd2lkdGggb3IgaGVpZ2h0XG5cdFx0fSBlbHNlIGlmICggZWxlbS5ub2RlVHlwZSA9PT0gOSApIHtcblx0XHRcdC8vIEVpdGhlciBzY3JvbGxbV2lkdGgvSGVpZ2h0XSBvciBvZmZzZXRbV2lkdGgvSGVpZ2h0XSwgd2hpY2hldmVyIGlzIGdyZWF0ZXJcblx0XHRcdHJldHVybiBNYXRoLm1heChcblx0XHRcdFx0ZWxlbS5kb2N1bWVudEVsZW1lbnRbXCJjbGllbnRcIiArIG5hbWVdLFxuXHRcdFx0XHRlbGVtLmJvZHlbXCJzY3JvbGxcIiArIG5hbWVdLCBlbGVtLmRvY3VtZW50RWxlbWVudFtcInNjcm9sbFwiICsgbmFtZV0sXG5cdFx0XHRcdGVsZW0uYm9keVtcIm9mZnNldFwiICsgbmFtZV0sIGVsZW0uZG9jdW1lbnRFbGVtZW50W1wib2Zmc2V0XCIgKyBuYW1lXVxuXHRcdFx0KTtcblxuXHRcdC8vIEdldCBvciBzZXQgd2lkdGggb3IgaGVpZ2h0IG9uIHRoZSBlbGVtZW50XG5cdFx0fSBlbHNlIGlmICggc2l6ZSA9PT0gdW5kZWZpbmVkICkge1xuXHRcdFx0dmFyIG9yaWcgPSBqUXVlcnkuY3NzKCBlbGVtLCB0eXBlICksXG5cdFx0XHRcdHJldCA9IHBhcnNlRmxvYXQoIG9yaWcgKTtcblxuXHRcdFx0cmV0dXJuIGpRdWVyeS5pc051bWVyaWMoIHJldCApID8gcmV0IDogb3JpZztcblxuXHRcdC8vIFNldCB0aGUgd2lkdGggb3IgaGVpZ2h0IG9uIHRoZSBlbGVtZW50IChkZWZhdWx0IHRvIHBpeGVscyBpZiB2YWx1ZSBpcyB1bml0bGVzcylcblx0XHR9IGVsc2Uge1xuXHRcdFx0cmV0dXJuIHRoaXMuY3NzKCB0eXBlLCB0eXBlb2Ygc2l6ZSA9PT0gXCJzdHJpbmdcIiA/IHNpemUgOiBzaXplICsgXCJweFwiICk7XG5cdFx0fVxuXHR9O1xuXG59KTtcblxuXG4vLyBFeHBvc2UgalF1ZXJ5IHRvIHRoZSBnbG9iYWwgb2JqZWN0XG53aW5kb3cualF1ZXJ5ID0gd2luZG93LiQgPSBqUXVlcnk7XG59KSh3aW5kb3cpO1xuIl0sImZpbGUiOiJtb2Rlcm5penIvdGVzdC9qcy9saWIvanF1ZXJ5LTEuN2IyLmpzIiwic291cmNlUm9vdCI6Ii9zb3VyY2UvIn0=