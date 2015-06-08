/**
 * QUnit v1.9.0 - A JavaScript Unit Testing Framework
 *
 * http://docs.jquery.com/QUnit
 *
 * Copyright (c) 2012 John Resig, Jörn Zaefferer
 * Dual licensed under the MIT (MIT-LICENSE.txt)
 * or GPL (GPL-LICENSE.txt) licenses.
 */

(function( window ) {

var QUnit,
	config,
	onErrorFnPrev,
	testId = 0,
	fileName = (sourceFromStacktrace( 0 ) || "" ).replace(/(:\d+)+\)?/, "").replace(/.+\//, ""),
	toString = Object.prototype.toString,
	hasOwn = Object.prototype.hasOwnProperty,
	defined = {
	setTimeout: typeof window.setTimeout !== "undefined",
	sessionStorage: (function() {
		var x = "qunit-test-string";
		try {
			sessionStorage.setItem( x, x );
			sessionStorage.removeItem( x );
			return true;
		} catch( e ) {
			return false;
		}
	}())
};

function Test( settings ) {
	extend( this, settings );
	this.assertions = [];
	this.testNumber = ++Test.count;
}

Test.count = 0;

Test.prototype = {
	init: function() {
		var a, b, li,
        tests = id( "qunit-tests" );

		if ( tests ) {
			b = document.createElement( "strong" );
			b.innerHTML = this.name;

			// `a` initialized at top of scope
			a = document.createElement( "a" );
			a.innerHTML = "Rerun";
			a.href = QUnit.url({ testNumber: this.testNumber });

			li = document.createElement( "li" );
			li.appendChild( b );
			li.appendChild( a );
			li.className = "running";
			li.id = this.id = "qunit-test-output" + testId++;

			tests.appendChild( li );
		}
	},
	setup: function() {
		if ( this.module !== config.previousModule ) {
			if ( config.previousModule ) {
				runLoggingCallbacks( "moduleDone", QUnit, {
					name: config.previousModule,
					failed: config.moduleStats.bad,
					passed: config.moduleStats.all - config.moduleStats.bad,
					total: config.moduleStats.all
				});
			}
			config.previousModule = this.module;
			config.moduleStats = { all: 0, bad: 0 };
			runLoggingCallbacks( "moduleStart", QUnit, {
				name: this.module
			});
		} else if ( config.autorun ) {
			runLoggingCallbacks( "moduleStart", QUnit, {
				name: this.module
			});
		}

		config.current = this;

		this.testEnvironment = extend({
			setup: function() {},
			teardown: function() {}
		}, this.moduleTestEnvironment );

		runLoggingCallbacks( "testStart", QUnit, {
			name: this.testName,
			module: this.module
		});

		// allow utility functions to access the current test environment
		// TODO why??
		QUnit.current_testEnvironment = this.testEnvironment;

		if ( !config.pollution ) {
			saveGlobal();
		}
		if ( config.notrycatch ) {
			this.testEnvironment.setup.call( this.testEnvironment );
			return;
		}
		try {
			this.testEnvironment.setup.call( this.testEnvironment );
		} catch( e ) {
			QUnit.pushFailure( "Setup failed on " + this.testName + ": " + e.message, extractStacktrace( e, 1 ) );
		}
	},
	run: function() {
		config.current = this;

		var running = id( "qunit-testresult" );

		if ( running ) {
			running.innerHTML = "Running: <br/>" + this.name;
		}

		if ( this.async ) {
			QUnit.stop();
		}

		if ( config.notrycatch ) {
			this.callback.call( this.testEnvironment, QUnit.assert );
			return;
		}

		try {
			this.callback.call( this.testEnvironment, QUnit.assert );
		} catch( e ) {
			QUnit.pushFailure( "Died on test #" + (this.assertions.length + 1) + " " + this.stack + ": " + e.message, extractStacktrace( e, 0 ) );
			// else next test will carry the responsibility
			saveGlobal();

			// Restart the tests if they're blocking
			if ( config.blocking ) {
				QUnit.start();
			}
		}
	},
	teardown: function() {
		config.current = this;
		if ( config.notrycatch ) {
			this.testEnvironment.teardown.call( this.testEnvironment );
			return;
		} else {
			try {
				this.testEnvironment.teardown.call( this.testEnvironment );
			} catch( e ) {
				QUnit.pushFailure( "Teardown failed on " + this.testName + ": " + e.message, extractStacktrace( e, 1 ) );
			}
		}
		checkPollution();
	},
	finish: function() {
		config.current = this;
		if ( config.requireExpects && this.expected == null ) {
			QUnit.pushFailure( "Expected number of assertions to be defined, but expect() was not called.", this.stack );
		} else if ( this.expected != null && this.expected != this.assertions.length ) {
			QUnit.pushFailure( "Expected " + this.expected + " assertions, but " + this.assertions.length + " were run", this.stack );
		} else if ( this.expected == null && !this.assertions.length ) {
			QUnit.pushFailure( "Expected at least one assertion, but none were run - call expect(0) to accept zero assertions.", this.stack );
		}

		var assertion, a, b, i, li, ol,
			test = this,
			good = 0,
			bad = 0,
			tests = id( "qunit-tests" );

		config.stats.all += this.assertions.length;
		config.moduleStats.all += this.assertions.length;

		if ( tests ) {
			ol = document.createElement( "ol" );

			for ( i = 0; i < this.assertions.length; i++ ) {
				assertion = this.assertions[i];

				li = document.createElement( "li" );
				li.className = assertion.result ? "pass" : "fail";
				li.innerHTML = assertion.message || ( assertion.result ? "okay" : "failed" );
				ol.appendChild( li );

				if ( assertion.result ) {
					good++;
				} else {
					bad++;
					config.stats.bad++;
					config.moduleStats.bad++;
				}
			}

			// store result when possible
			if ( QUnit.config.reorder && defined.sessionStorage ) {
				if ( bad ) {
					sessionStorage.setItem( "qunit-test-" + this.module + "-" + this.testName, bad );
				} else {
					sessionStorage.removeItem( "qunit-test-" + this.module + "-" + this.testName );
				}
			}

			if ( bad === 0 ) {
				ol.style.display = "none";
			}

			// `b` initialized at top of scope
			b = document.createElement( "strong" );
			b.innerHTML = this.name + " <b class='counts'>(<b class='failed'>" + bad + "</b>, <b class='passed'>" + good + "</b>, " + this.assertions.length + ")</b>";

			addEvent(b, "click", function() {
				var next = b.nextSibling.nextSibling,
					display = next.style.display;
				next.style.display = display === "none" ? "block" : "none";
			});

			addEvent(b, "dblclick", function( e ) {
				var target = e && e.target ? e.target : window.event.srcElement;
				if ( target.nodeName.toLowerCase() == "span" || target.nodeName.toLowerCase() == "b" ) {
					target = target.parentNode;
				}
				if ( window.location && target.nodeName.toLowerCase() === "strong" ) {
					window.location = QUnit.url({ testNumber: test.testNumber });
				}
			});

			// `li` initialized at top of scope
			li = id( this.id );
			li.className = bad ? "fail" : "pass";
			li.removeChild( li.firstChild );
			a = li.firstChild;
			li.appendChild( b );
			li.appendChild ( a );
			li.appendChild( ol );

		} else {
			for ( i = 0; i < this.assertions.length; i++ ) {
				if ( !this.assertions[i].result ) {
					bad++;
					config.stats.bad++;
					config.moduleStats.bad++;
				}
			}
		}

		runLoggingCallbacks( "testDone", QUnit, {
			name: this.testName,
			module: this.module,
			failed: bad,
			passed: this.assertions.length - bad,
			total: this.assertions.length
		});

		QUnit.reset();

		config.current = undefined;
	},

	queue: function() {
		var bad,
			test = this;

		synchronize(function() {
			test.init();
		});
		function run() {
			// each of these can by async
			synchronize(function() {
				test.setup();
			});
			synchronize(function() {
				test.run();
			});
			synchronize(function() {
				test.teardown();
			});
			synchronize(function() {
				test.finish();
			});
		}

		// `bad` initialized at top of scope
		// defer when previous test run passed, if storage is available
		bad = QUnit.config.reorder && defined.sessionStorage &&
						+sessionStorage.getItem( "qunit-test-" + this.module + "-" + this.testName );

		if ( bad ) {
			run();
		} else {
			synchronize( run, true );
		}
	}
};

// Root QUnit object.
// `QUnit` initialized at top of scope
QUnit = {

	// call on start of module test to prepend name to all tests
	module: function( name, testEnvironment ) {
		config.currentModule = name;
		config.currentModuleTestEnviroment = testEnvironment;
	},

	asyncTest: function( testName, expected, callback ) {
		if ( arguments.length === 2 ) {
			callback = expected;
			expected = null;
		}

		QUnit.test( testName, expected, callback, true );
	},

	test: function( testName, expected, callback, async ) {
		var test,
			name = "<span class='test-name'>" + escapeInnerText( testName ) + "</span>";

		if ( arguments.length === 2 ) {
			callback = expected;
			expected = null;
		}

		if ( config.currentModule ) {
			name = "<span class='module-name'>" + config.currentModule + "</span>: " + name;
		}

		test = new Test({
			name: name,
			testName: testName,
			expected: expected,
			async: async,
			callback: callback,
			module: config.currentModule,
			moduleTestEnvironment: config.currentModuleTestEnviroment,
			stack: sourceFromStacktrace( 2 )
		});

		if ( !validTest( test ) ) {
			return;
		}

		test.queue();
	},

	// Specify the number of expected assertions to gurantee that failed test (no assertions are run at all) don't slip through.
	expect: function( asserts ) {
		config.current.expected = asserts;
	},

	start: function( count ) {
		config.semaphore -= count || 1;
		// don't start until equal number of stop-calls
		if ( config.semaphore > 0 ) {
			return;
		}
		// ignore if start is called more often then stop
		if ( config.semaphore < 0 ) {
			config.semaphore = 0;
		}
		// A slight delay, to avoid any current callbacks
		if ( defined.setTimeout ) {
			window.setTimeout(function() {
				if ( config.semaphore > 0 ) {
					return;
				}
				if ( config.timeout ) {
					clearTimeout( config.timeout );
				}

				config.blocking = false;
				process( true );
			}, 13);
		} else {
			config.blocking = false;
			process( true );
		}
	},

	stop: function( count ) {
		config.semaphore += count || 1;
		config.blocking = true;

		if ( config.testTimeout && defined.setTimeout ) {
			clearTimeout( config.timeout );
			config.timeout = window.setTimeout(function() {
				QUnit.ok( false, "Test timed out" );
				config.semaphore = 1;
				QUnit.start();
			}, config.testTimeout );
		}
	}
};

// Asssert helpers
// All of these must call either QUnit.push() or manually do:
// - runLoggingCallbacks( "log", .. );
// - config.current.assertions.push({ .. });
QUnit.assert = {
	/**
	 * Asserts rough true-ish result.
	 * @name ok
	 * @function
	 * @example ok( "asdfasdf".length > 5, "There must be at least 5 chars" );
	 */
	ok: function( result, msg ) {
		if ( !config.current ) {
			throw new Error( "ok() assertion outside test context, was " + sourceFromStacktrace(2) );
		}
		result = !!result;

		var source,
			details = {
				result: result,
				message: msg
			};

		msg = escapeInnerText( msg || (result ? "okay" : "failed" ) );
		msg = "<span class='test-message'>" + msg + "</span>";

		if ( !result ) {
			source = sourceFromStacktrace( 2 );
			if ( source ) {
				details.source = source;
				msg += "<table><tr class='test-source'><th>Source: </th><td><pre>" + escapeInnerText( source ) + "</pre></td></tr></table>";
			}
		}
		runLoggingCallbacks( "log", QUnit, details );
		config.current.assertions.push({
			result: result,
			message: msg
		});
	},

	/**
	 * Assert that the first two arguments are equal, with an optional message.
	 * Prints out both actual and expected values.
	 * @name equal
	 * @function
	 * @example equal( format( "Received {0} bytes.", 2), "Received 2 bytes.", "format() replaces {0} with next argument" );
	 */
	equal: function( actual, expected, message ) {
		QUnit.push( expected == actual, actual, expected, message );
	},

	/**
	 * @name notEqual
	 * @function
	 */
	notEqual: function( actual, expected, message ) {
		QUnit.push( expected != actual, actual, expected, message );
	},

	/**
	 * @name deepEqual
	 * @function
	 */
	deepEqual: function( actual, expected, message ) {
		QUnit.push( QUnit.equiv(actual, expected), actual, expected, message );
	},

	/**
	 * @name notDeepEqual
	 * @function
	 */
	notDeepEqual: function( actual, expected, message ) {
		QUnit.push( !QUnit.equiv(actual, expected), actual, expected, message );
	},

	/**
	 * @name strictEqual
	 * @function
	 */
	strictEqual: function( actual, expected, message ) {
		QUnit.push( expected === actual, actual, expected, message );
	},

	/**
	 * @name notStrictEqual
	 * @function
	 */
	notStrictEqual: function( actual, expected, message ) {
		QUnit.push( expected !== actual, actual, expected, message );
	},

	throws: function( block, expected, message ) {
		var actual,
			ok = false;

		// 'expected' is optional
		if ( typeof expected === "string" ) {
			message = expected;
			expected = null;
		}

		config.current.ignoreGlobalErrors = true;
		try {
			block.call( config.current.testEnvironment );
		} catch (e) {
			actual = e;
		}
		config.current.ignoreGlobalErrors = false;

		if ( actual ) {
			// we don't want to validate thrown error
			if ( !expected ) {
				ok = true;
			// expected is a regexp
			} else if ( QUnit.objectType( expected ) === "regexp" ) {
				ok = expected.test( actual );
			// expected is a constructor
			} else if ( actual instanceof expected ) {
				ok = true;
			// expected is a validation function which returns true is validation passed
			} else if ( expected.call( {}, actual ) === true ) {
				ok = true;
			}

			QUnit.push( ok, actual, null, message );
		} else {
			QUnit.pushFailure( message, null, 'No exception was thrown.' );
		}
	}
};

/**
 * @deprecate since 1.8.0
 * Kept assertion helpers in root for backwards compatibility
 */
extend( QUnit, QUnit.assert );

/**
 * @deprecated since 1.9.0
 * Kept global "raises()" for backwards compatibility
 */
QUnit.raises = QUnit.assert.throws;

/**
 * @deprecated since 1.0.0, replaced with error pushes since 1.3.0
 * Kept to avoid TypeErrors for undefined methods.
 */
QUnit.equals = function() {
	QUnit.push( false, false, false, "QUnit.equals has been deprecated since 2009 (e88049a0), use QUnit.equal instead" );
};
QUnit.same = function() {
	QUnit.push( false, false, false, "QUnit.same has been deprecated since 2009 (e88049a0), use QUnit.deepEqual instead" );
};

// We want access to the constructor's prototype
(function() {
	function F() {}
	F.prototype = QUnit;
	QUnit = new F();
	// Make F QUnit's constructor so that we can add to the prototype later
	QUnit.constructor = F;
}());

/**
 * Config object: Maintain internal state
 * Later exposed as QUnit.config
 * `config` initialized at top of scope
 */
config = {
	// The queue of tests to run
	queue: [],

	// block until document ready
	blocking: true,

	// when enabled, show only failing tests
	// gets persisted through sessionStorage and can be changed in UI via checkbox
	hidepassed: false,

	// by default, run previously failed tests first
	// very useful in combination with "Hide passed tests" checked
	reorder: true,

	// by default, modify document.title when suite is done
	altertitle: true,

	// when enabled, all tests must call expect()
	requireExpects: false,

	// add checkboxes that are persisted in the query-string
	// when enabled, the id is set to `true` as a `QUnit.config` property
	urlConfig: [
		{
			id: "noglobals",
			label: "Check for Globals",
			tooltip: "Enabling this will test if any test introduces new properties on the `window` object. Stored as query-strings."
		},
		{
			id: "notrycatch",
			label: "No try-catch",
			tooltip: "Enabling this will run tests outside of a try-catch block. Makes debugging exceptions in IE reasonable. Stored as query-strings."
		}
	],

	// logging callback queues
	begin: [],
	done: [],
	log: [],
	testStart: [],
	testDone: [],
	moduleStart: [],
	moduleDone: []
};

// Initialize more QUnit.config and QUnit.urlParams
(function() {
	var i,
		location = window.location || { search: "", protocol: "file:" },
		params = location.search.slice( 1 ).split( "&" ),
		length = params.length,
		urlParams = {},
		current;

	if ( params[ 0 ] ) {
		for ( i = 0; i < length; i++ ) {
			current = params[ i ].split( "=" );
			current[ 0 ] = decodeURIComponent( current[ 0 ] );
			// allow just a key to turn on a flag, e.g., test.html?noglobals
			current[ 1 ] = current[ 1 ] ? decodeURIComponent( current[ 1 ] ) : true;
			urlParams[ current[ 0 ] ] = current[ 1 ];
		}
	}

	QUnit.urlParams = urlParams;

	// String search anywhere in moduleName+testName
	config.filter = urlParams.filter;

	// Exact match of the module name
	config.module = urlParams.module;

	config.testNumber = parseInt( urlParams.testNumber, 10 ) || null;

	// Figure out if we're running the tests from a server or not
	QUnit.isLocal = location.protocol === "file:";
}());

// Export global variables, unless an 'exports' object exists,
// in that case we assume we're in CommonJS (dealt with on the bottom of the script)
if ( typeof exports === "undefined" ) {
	extend( window, QUnit );

	// Expose QUnit object
	window.QUnit = QUnit;
}

// Extend QUnit object,
// these after set here because they should not be exposed as global functions
extend( QUnit, {
	config: config,

	// Initialize the configuration options
	init: function() {
		extend( config, {
			stats: { all: 0, bad: 0 },
			moduleStats: { all: 0, bad: 0 },
			started: +new Date(),
			updateRate: 1000,
			blocking: false,
			autostart: true,
			autorun: false,
			filter: "",
			queue: [],
			semaphore: 0
		});

		var tests, banner, result,
			qunit = id( "qunit" );

		if ( qunit ) {
			qunit.innerHTML =
				"<h1 id='qunit-header'>" + escapeInnerText( document.title ) + "</h1>" +
				"<h2 id='qunit-banner'></h2>" +
				"<div id='qunit-testrunner-toolbar'></div>" +
				"<h2 id='qunit-userAgent'></h2>" +
				"<ol id='qunit-tests'></ol>";
		}

		tests = id( "qunit-tests" );
		banner = id( "qunit-banner" );
		result = id( "qunit-testresult" );

		if ( tests ) {
			tests.innerHTML = "";
		}

		if ( banner ) {
			banner.className = "";
		}

		if ( result ) {
			result.parentNode.removeChild( result );
		}

		if ( tests ) {
			result = document.createElement( "p" );
			result.id = "qunit-testresult";
			result.className = "result";
			tests.parentNode.insertBefore( result, tests );
			result.innerHTML = "Running...<br/>&nbsp;";
		}
	},

	// Resets the test setup. Useful for tests that modify the DOM.
	// If jQuery is available, uses jQuery's html(), otherwise just innerHTML.
	reset: function() {
		var fixture;

		if ( window.jQuery ) {
			jQuery( "#qunit-fixture" ).html( config.fixture );
		} else {
			fixture = id( "qunit-fixture" );
			if ( fixture ) {
				fixture.innerHTML = config.fixture;
			}
		}
	},

	// Trigger an event on an element.
	// @example triggerEvent( document.body, "click" );
	triggerEvent: function( elem, type, event ) {
		if ( document.createEvent ) {
			event = document.createEvent( "MouseEvents" );
			event.initMouseEvent(type, true, true, elem.ownerDocument.defaultView,
				0, 0, 0, 0, 0, false, false, false, false, 0, null);

			elem.dispatchEvent( event );
		} else if ( elem.fireEvent ) {
			elem.fireEvent( "on" + type );
		}
	},

	// Safe object type checking
	is: function( type, obj ) {
		return QUnit.objectType( obj ) == type;
	},

	objectType: function( obj ) {
		if ( typeof obj === "undefined" ) {
				return "undefined";
		// consider: typeof null === object
		}
		if ( obj === null ) {
				return "null";
		}

		var type = toString.call( obj ).match(/^\[object\s(.*)\]$/)[1] || "";

		switch ( type ) {
			case "Number":
				if ( isNaN(obj) ) {
					return "nan";
				}
				return "number";
			case "String":
			case "Boolean":
			case "Array":
			case "Date":
			case "RegExp":
			case "Function":
				return type.toLowerCase();
		}
		if ( typeof obj === "object" ) {
			return "object";
		}
		return undefined;
	},

	push: function( result, actual, expected, message ) {
		if ( !config.current ) {
			throw new Error( "assertion outside test context, was " + sourceFromStacktrace() );
		}

		var output, source,
			details = {
				result: result,
				message: message,
				actual: actual,
				expected: expected
			};

		message = escapeInnerText( message ) || ( result ? "okay" : "failed" );
		message = "<span class='test-message'>" + message + "</span>";
		output = message;

		if ( !result ) {
			expected = escapeInnerText( QUnit.jsDump.parse(expected) );
			actual = escapeInnerText( QUnit.jsDump.parse(actual) );
			output += "<table><tr class='test-expected'><th>Expected: </th><td><pre>" + expected + "</pre></td></tr>";

			if ( actual != expected ) {
				output += "<tr class='test-actual'><th>Result: </th><td><pre>" + actual + "</pre></td></tr>";
				output += "<tr class='test-diff'><th>Diff: </th><td><pre>" + QUnit.diff( expected, actual ) + "</pre></td></tr>";
			}

			source = sourceFromStacktrace();

			if ( source ) {
				details.source = source;
				output += "<tr class='test-source'><th>Source: </th><td><pre>" + escapeInnerText( source ) + "</pre></td></tr>";
			}

			output += "</table>";
		}

		runLoggingCallbacks( "log", QUnit, details );

		config.current.assertions.push({
			result: !!result,
			message: output
		});
	},

	pushFailure: function( message, source, actual ) {
		if ( !config.current ) {
			throw new Error( "pushFailure() assertion outside test context, was " + sourceFromStacktrace(2) );
		}

		var output,
			details = {
				result: false,
				message: message
			};

		message = escapeInnerText( message ) || "error";
		message = "<span class='test-message'>" + message + "</span>";
		output = message;

		output += "<table>";

		if ( actual ) {
			output += "<tr class='test-actual'><th>Result: </th><td><pre>" + escapeInnerText( actual ) + "</pre></td></tr>";
		}

		if ( source ) {
			details.source = source;
			output += "<tr class='test-source'><th>Source: </th><td><pre>" + escapeInnerText( source ) + "</pre></td></tr>";
		}

		output += "</table>";

		runLoggingCallbacks( "log", QUnit, details );

		config.current.assertions.push({
			result: false,
			message: output
		});
	},

	url: function( params ) {
		params = extend( extend( {}, QUnit.urlParams ), params );
		var key,
			querystring = "?";

		for ( key in params ) {
			if ( !hasOwn.call( params, key ) ) {
				continue;
			}
			querystring += encodeURIComponent( key ) + "=" +
				encodeURIComponent( params[ key ] ) + "&";
		}
		return window.location.pathname + querystring.slice( 0, -1 );
	},

	extend: extend,
	id: id,
	addEvent: addEvent
	// load, equiv, jsDump, diff: Attached later
});

/**
 * @deprecated: Created for backwards compatibility with test runner that set the hook function
 * into QUnit.{hook}, instead of invoking it and passing the hook function.
 * QUnit.constructor is set to the empty F() above so that we can add to it's prototype here.
 * Doing this allows us to tell if the following methods have been overwritten on the actual
 * QUnit object.
 */
extend( QUnit.constructor.prototype, {

	// Logging callbacks; all receive a single argument with the listed properties
	// run test/logs.html for any related changes
	begin: registerLoggingCallback( "begin" ),

	// done: { failed, passed, total, runtime }
	done: registerLoggingCallback( "done" ),

	// log: { result, actual, expected, message }
	log: registerLoggingCallback( "log" ),

	// testStart: { name }
	testStart: registerLoggingCallback( "testStart" ),

	// testDone: { name, failed, passed, total }
	testDone: registerLoggingCallback( "testDone" ),

	// moduleStart: { name }
	moduleStart: registerLoggingCallback( "moduleStart" ),

	// moduleDone: { name, failed, passed, total }
	moduleDone: registerLoggingCallback( "moduleDone" )
});

if ( typeof document === "undefined" || document.readyState === "complete" ) {
	config.autorun = true;
}

QUnit.load = function() {
	runLoggingCallbacks( "begin", QUnit, {} );

	// Initialize the config, saving the execution queue
	var banner, filter, i, label, len, main, ol, toolbar, userAgent, val, urlConfigCheckboxes,
		urlConfigHtml = "",
		oldconfig = extend( {}, config );

	QUnit.init();
	extend(config, oldconfig);

	config.blocking = false;

	len = config.urlConfig.length;

	for ( i = 0; i < len; i++ ) {
		val = config.urlConfig[i];
		if ( typeof val === "string" ) {
			val = {
				id: val,
				label: val,
				tooltip: "[no tooltip available]"
			};
		}
		config[ val.id ] = QUnit.urlParams[ val.id ];
		urlConfigHtml += "<input id='qunit-urlconfig-" + val.id + "' name='" + val.id + "' type='checkbox'" + ( config[ val.id ] ? " checked='checked'" : "" ) + " title='" + val.tooltip + "'><label for='qunit-urlconfig-" + val.id + "' title='" + val.tooltip + "'>" + val.label + "</label>";
	}

	// `userAgent` initialized at top of scope
	userAgent = id( "qunit-userAgent" );
	if ( userAgent ) {
		userAgent.innerHTML = navigator.userAgent;
	}

	// `banner` initialized at top of scope
	banner = id( "qunit-header" );
	if ( banner ) {
		banner.innerHTML = "<a href='" + QUnit.url({ filter: undefined, module: undefined, testNumber: undefined }) + "'>" + banner.innerHTML + "</a> ";
	}

	// `toolbar` initialized at top of scope
	toolbar = id( "qunit-testrunner-toolbar" );
	if ( toolbar ) {
		// `filter` initialized at top of scope
		filter = document.createElement( "input" );
		filter.type = "checkbox";
		filter.id = "qunit-filter-pass";

		addEvent( filter, "click", function() {
			var tmp,
				ol = document.getElementById( "qunit-tests" );

			if ( filter.checked ) {
				ol.className = ol.className + " hidepass";
			} else {
				tmp = " " + ol.className.replace( /[\n\t\r]/g, " " ) + " ";
				ol.className = tmp.replace( / hidepass /, " " );
			}
			if ( defined.sessionStorage ) {
				if (filter.checked) {
					sessionStorage.setItem( "qunit-filter-passed-tests", "true" );
				} else {
					sessionStorage.removeItem( "qunit-filter-passed-tests" );
				}
			}
		});

		if ( config.hidepassed || defined.sessionStorage && sessionStorage.getItem( "qunit-filter-passed-tests" ) ) {
			filter.checked = true;
			// `ol` initialized at top of scope
			ol = document.getElementById( "qunit-tests" );
			ol.className = ol.className + " hidepass";
		}
		toolbar.appendChild( filter );

		// `label` initialized at top of scope
		label = document.createElement( "label" );
		label.setAttribute( "for", "qunit-filter-pass" );
		label.setAttribute( "title", "Only show tests and assertons that fail. Stored in sessionStorage." );
		label.innerHTML = "Hide passed tests";
		toolbar.appendChild( label );

		urlConfigCheckboxes = document.createElement( 'span' );
		urlConfigCheckboxes.innerHTML = urlConfigHtml;
		addEvent( urlConfigCheckboxes, "change", function( event ) {
			var params = {};
			params[ event.target.name ] = event.target.checked ? true : undefined;
			window.location = QUnit.url( params );
		});
		toolbar.appendChild( urlConfigCheckboxes );
	}

	// `main` initialized at top of scope
	main = id( "qunit-fixture" );
	if ( main ) {
		config.fixture = main.innerHTML;
	}

	if ( config.autostart ) {
		QUnit.start();
	}
};

addEvent( window, "load", QUnit.load );

// `onErrorFnPrev` initialized at top of scope
// Preserve other handlers
onErrorFnPrev = window.onerror;

// Cover uncaught exceptions
// Returning true will surpress the default browser handler,
// returning false will let it run.
window.onerror = function ( error, filePath, linerNr ) {
	var ret = false;
	if ( onErrorFnPrev ) {
		ret = onErrorFnPrev( error, filePath, linerNr );
	}

	// Treat return value as window.onerror itself does,
	// Only do our handling if not surpressed.
	if ( ret !== true ) {
		if ( QUnit.config.current ) {
			if ( QUnit.config.current.ignoreGlobalErrors ) {
				return true;
			}
			QUnit.pushFailure( error, filePath + ":" + linerNr );
		} else {
			QUnit.test( "global failure", function() {
				QUnit.pushFailure( error, filePath + ":" + linerNr );
			});
		}
		return false;
	}

	return ret;
};

function done() {
	config.autorun = true;

	// Log the last module results
	if ( config.currentModule ) {
		runLoggingCallbacks( "moduleDone", QUnit, {
			name: config.currentModule,
			failed: config.moduleStats.bad,
			passed: config.moduleStats.all - config.moduleStats.bad,
			total: config.moduleStats.all
		});
	}

	var i, key,
		banner = id( "qunit-banner" ),
		tests = id( "qunit-tests" ),
		runtime = +new Date() - config.started,
		passed = config.stats.all - config.stats.bad,
		html = [
			"Tests completed in ",
			runtime,
			" milliseconds.<br/>",
			"<span class='passed'>",
			passed,
			"</span> tests of <span class='total'>",
			config.stats.all,
			"</span> passed, <span class='failed'>",
			config.stats.bad,
			"</span> failed."
		].join( "" );

	if ( banner ) {
		banner.className = ( config.stats.bad ? "qunit-fail" : "qunit-pass" );
	}

	if ( tests ) {
		id( "qunit-testresult" ).innerHTML = html;
	}

	if ( config.altertitle && typeof document !== "undefined" && document.title ) {
		// show ✖ for good, ✔ for bad suite result in title
		// use escape sequences in case file gets loaded with non-utf-8-charset
		document.title = [
			( config.stats.bad ? "\u2716" : "\u2714" ),
			document.title.replace( /^[\u2714\u2716] /i, "" )
		].join( " " );
	}

	// clear own sessionStorage items if all tests passed
	if ( config.reorder && defined.sessionStorage && config.stats.bad === 0 ) {
		// `key` & `i` initialized at top of scope
		for ( i = 0; i < sessionStorage.length; i++ ) {
			key = sessionStorage.key( i++ );
			if ( key.indexOf( "qunit-test-" ) === 0 ) {
				sessionStorage.removeItem( key );
			}
		}
	}

	runLoggingCallbacks( "done", QUnit, {
		failed: config.stats.bad,
		passed: passed,
		total: config.stats.all,
		runtime: runtime
	});
}

/** @return Boolean: true if this test should be ran */
function validTest( test ) {
	var include,
		filter = config.filter && config.filter.toLowerCase(),
		module = config.module && config.module.toLowerCase(),
		fullName = (test.module + ": " + test.testName).toLowerCase();

	if ( config.testNumber ) {
		return test.testNumber === config.testNumber;
	}

	if ( module && ( !test.module || test.module.toLowerCase() !== module ) ) {
		return false;
	}

	if ( !filter ) {
		return true;
	}

	include = filter.charAt( 0 ) !== "!";
	if ( !include ) {
		filter = filter.slice( 1 );
	}

	// If the filter matches, we need to honour include
	if ( fullName.indexOf( filter ) !== -1 ) {
		return include;
	}

	// Otherwise, do the opposite
	return !include;
}

// so far supports only Firefox, Chrome and Opera (buggy), Safari (for real exceptions)
// Later Safari and IE10 are supposed to support error.stack as well
// See also https://developer.mozilla.org/en/JavaScript/Reference/Global_Objects/Error/Stack
function extractStacktrace( e, offset ) {
	offset = offset === undefined ? 3 : offset;

	var stack, include, i, regex;

	if ( e.stacktrace ) {
		// Opera
		return e.stacktrace.split( "\n" )[ offset + 3 ];
	} else if ( e.stack ) {
		// Firefox, Chrome
		stack = e.stack.split( "\n" );
		if (/^error$/i.test( stack[0] ) ) {
			stack.shift();
		}
		if ( fileName ) {
			include = [];
			for ( i = offset; i < stack.length; i++ ) {
				if ( stack[ i ].indexOf( fileName ) != -1 ) {
					break;
				}
				include.push( stack[ i ] );
			}
			if ( include.length ) {
				return include.join( "\n" );
			}
		}
		return stack[ offset ];
	} else if ( e.sourceURL ) {
		// Safari, PhantomJS
		// hopefully one day Safari provides actual stacktraces
		// exclude useless self-reference for generated Error objects
		if ( /qunit.js$/.test( e.sourceURL ) ) {
			return;
		}
		// for actual exceptions, this is useful
		return e.sourceURL + ":" + e.line;
	}
}
function sourceFromStacktrace( offset ) {
	try {
		throw new Error();
	} catch ( e ) {
		return extractStacktrace( e, offset );
	}
}

function escapeInnerText( s ) {
	if ( !s ) {
		return "";
	}
	s = s + "";
	return s.replace( /[\&<>]/g, function( s ) {
		switch( s ) {
			case "&": return "&amp;";
			case "<": return "&lt;";
			case ">": return "&gt;";
			default: return s;
		}
	});
}

function synchronize( callback, last ) {
	config.queue.push( callback );

	if ( config.autorun && !config.blocking ) {
		process( last );
	}
}

function process( last ) {
	function next() {
		process( last );
	}
	var start = new Date().getTime();
	config.depth = config.depth ? config.depth + 1 : 1;

	while ( config.queue.length && !config.blocking ) {
		if ( !defined.setTimeout || config.updateRate <= 0 || ( ( new Date().getTime() - start ) < config.updateRate ) ) {
			config.queue.shift()();
		} else {
			window.setTimeout( next, 13 );
			break;
		}
	}
	config.depth--;
	if ( last && !config.blocking && !config.queue.length && config.depth === 0 ) {
		done();
	}
}

function saveGlobal() {
	config.pollution = [];

	if ( config.noglobals ) {
		for ( var key in window ) {
			// in Opera sometimes DOM element ids show up here, ignore them
			if ( !hasOwn.call( window, key ) || /^qunit-test-output/.test( key ) ) {
				continue;
			}
			config.pollution.push( key );
		}
	}
}

function checkPollution( name ) {
	var newGlobals,
		deletedGlobals,
		old = config.pollution;

	saveGlobal();

	newGlobals = diff( config.pollution, old );
	if ( newGlobals.length > 0 ) {
		QUnit.pushFailure( "Introduced global variable(s): " + newGlobals.join(", ") );
	}

	deletedGlobals = diff( old, config.pollution );
	if ( deletedGlobals.length > 0 ) {
		QUnit.pushFailure( "Deleted global variable(s): " + deletedGlobals.join(", ") );
	}
}

// returns a new Array with the elements that are in a but not in b
function diff( a, b ) {
	var i, j,
		result = a.slice();

	for ( i = 0; i < result.length; i++ ) {
		for ( j = 0; j < b.length; j++ ) {
			if ( result[i] === b[j] ) {
				result.splice( i, 1 );
				i--;
				break;
			}
		}
	}
	return result;
}

function extend( a, b ) {
	for ( var prop in b ) {
		if ( b[ prop ] === undefined ) {
			delete a[ prop ];

		// Avoid "Member not found" error in IE8 caused by setting window.constructor
		} else if ( prop !== "constructor" || a !== window ) {
			a[ prop ] = b[ prop ];
		}
	}

	return a;
}

function addEvent( elem, type, fn ) {
	if ( elem.addEventListener ) {
		elem.addEventListener( type, fn, false );
	} else if ( elem.attachEvent ) {
		elem.attachEvent( "on" + type, fn );
	} else {
		fn();
	}
}

function id( name ) {
	return !!( typeof document !== "undefined" && document && document.getElementById ) &&
		document.getElementById( name );
}

function registerLoggingCallback( key ) {
	return function( callback ) {
		config[key].push( callback );
	};
}

// Supports deprecated method of completely overwriting logging callbacks
function runLoggingCallbacks( key, scope, args ) {
	//debugger;
	var i, callbacks;
	if ( QUnit.hasOwnProperty( key ) ) {
		QUnit[ key ].call(scope, args );
	} else {
		callbacks = config[ key ];
		for ( i = 0; i < callbacks.length; i++ ) {
			callbacks[ i ].call( scope, args );
		}
	}
}

// Test for equality any JavaScript type.
// Author: Philippe Rathé <prathe@gmail.com>
QUnit.equiv = (function() {

	// Call the o related callback with the given arguments.
	function bindCallbacks( o, callbacks, args ) {
		var prop = QUnit.objectType( o );
		if ( prop ) {
			if ( QUnit.objectType( callbacks[ prop ] ) === "function" ) {
				return callbacks[ prop ].apply( callbacks, args );
			} else {
				return callbacks[ prop ]; // or undefined
			}
		}
	}

	// the real equiv function
	var innerEquiv,
		// stack to decide between skip/abort functions
		callers = [],
		// stack to avoiding loops from circular referencing
		parents = [],

		getProto = Object.getPrototypeOf || function ( obj ) {
			return obj.__proto__;
		},
		callbacks = (function () {

			// for string, boolean, number and null
			function useStrictEquality( b, a ) {
				if ( b instanceof a.constructor || a instanceof b.constructor ) {
					// to catch short annotaion VS 'new' annotation of a
					// declaration
					// e.g. var i = 1;
					// var j = new Number(1);
					return a == b;
				} else {
					return a === b;
				}
			}

			return {
				"string": useStrictEquality,
				"boolean": useStrictEquality,
				"number": useStrictEquality,
				"null": useStrictEquality,
				"undefined": useStrictEquality,

				"nan": function( b ) {
					return isNaN( b );
				},

				"date": function( b, a ) {
					return QUnit.objectType( b ) === "date" && a.valueOf() === b.valueOf();
				},

				"regexp": function( b, a ) {
					return QUnit.objectType( b ) === "regexp" &&
						// the regex itself
						a.source === b.source &&
						// and its modifers
						a.global === b.global &&
						// (gmi) ...
						a.ignoreCase === b.ignoreCase &&
						a.multiline === b.multiline;
				},

				// - skip when the property is a method of an instance (OOP)
				// - abort otherwise,
				// initial === would have catch identical references anyway
				"function": function() {
					var caller = callers[callers.length - 1];
					return caller !== Object && typeof caller !== "undefined";
				},

				"array": function( b, a ) {
					var i, j, len, loop;

					// b could be an object literal here
					if ( QUnit.objectType( b ) !== "array" ) {
						return false;
					}

					len = a.length;
					if ( len !== b.length ) {
						// safe and faster
						return false;
					}

					// track reference to avoid circular references
					parents.push( a );
					for ( i = 0; i < len; i++ ) {
						loop = false;
						for ( j = 0; j < parents.length; j++ ) {
							if ( parents[j] === a[i] ) {
								loop = true;// dont rewalk array
							}
						}
						if ( !loop && !innerEquiv(a[i], b[i]) ) {
							parents.pop();
							return false;
						}
					}
					parents.pop();
					return true;
				},

				"object": function( b, a ) {
					var i, j, loop,
						// Default to true
						eq = true,
						aProperties = [],
						bProperties = [];

					// comparing constructors is more strict than using
					// instanceof
					if ( a.constructor !== b.constructor ) {
						// Allow objects with no prototype to be equivalent to
						// objects with Object as their constructor.
						if ( !(( getProto(a) === null && getProto(b) === Object.prototype ) ||
							( getProto(b) === null && getProto(a) === Object.prototype ) ) ) {
								return false;
						}
					}

					// stack constructor before traversing properties
					callers.push( a.constructor );
					// track reference to avoid circular references
					parents.push( a );

					for ( i in a ) { // be strict: don't ensures hasOwnProperty
									// and go deep
						loop = false;
						for ( j = 0; j < parents.length; j++ ) {
							if ( parents[j] === a[i] ) {
								// don't go down the same path twice
								loop = true;
							}
						}
						aProperties.push(i); // collect a's properties

						if (!loop && !innerEquiv( a[i], b[i] ) ) {
							eq = false;
							break;
						}
					}

					callers.pop(); // unstack, we are done
					parents.pop();

					for ( i in b ) {
						bProperties.push( i ); // collect b's properties
					}

					// Ensures identical properties name
					return eq && innerEquiv( aProperties.sort(), bProperties.sort() );
				}
			};
		}());

	innerEquiv = function() { // can take multiple arguments
		var args = [].slice.apply( arguments );
		if ( args.length < 2 ) {
			return true; // end transition
		}

		return (function( a, b ) {
			if ( a === b ) {
				return true; // catch the most you can
			} else if ( a === null || b === null || typeof a === "undefined" ||
					typeof b === "undefined" ||
					QUnit.objectType(a) !== QUnit.objectType(b) ) {
				return false; // don't lose time with error prone cases
			} else {
				return bindCallbacks(a, callbacks, [ b, a ]);
			}

			// apply transition with (1..n) arguments
		}( args[0], args[1] ) && arguments.callee.apply( this, args.splice(1, args.length - 1 )) );
	};

	return innerEquiv;
}());

/**
 * jsDump Copyright (c) 2008 Ariel Flesler - aflesler(at)gmail(dot)com |
 * http://flesler.blogspot.com Licensed under BSD
 * (http://www.opensource.org/licenses/bsd-license.php) Date: 5/15/2008
 *
 * @projectDescription Advanced and extensible data dumping for Javascript.
 * @version 1.0.0
 * @author Ariel Flesler
 * @link {http://flesler.blogspot.com/2008/05/jsdump-pretty-dump-of-any-javascript.html}
 */
QUnit.jsDump = (function() {
	function quote( str ) {
		return '"' + str.toString().replace( /"/g, '\\"' ) + '"';
	}
	function literal( o ) {
		return o + "";
	}
	function join( pre, arr, post ) {
		var s = jsDump.separator(),
			base = jsDump.indent(),
			inner = jsDump.indent(1);
		if ( arr.join ) {
			arr = arr.join( "," + s + inner );
		}
		if ( !arr ) {
			return pre + post;
		}
		return [ pre, inner + arr, base + post ].join(s);
	}
	function array( arr, stack ) {
		var i = arr.length, ret = new Array(i);
		this.up();
		while ( i-- ) {
			ret[i] = this.parse( arr[i] , undefined , stack);
		}
		this.down();
		return join( "[", ret, "]" );
	}

	var reName = /^function (\w+)/,
		jsDump = {
			parse: function( obj, type, stack ) { //type is used mostly internally, you can fix a (custom)type in advance
				stack = stack || [ ];
				var inStack, res,
					parser = this.parsers[ type || this.typeOf(obj) ];

				type = typeof parser;
				inStack = inArray( obj, stack );

				if ( inStack != -1 ) {
					return "recursion(" + (inStack - stack.length) + ")";
				}
				//else
				if ( type == "function" )  {
					stack.push( obj );
					res = parser.call( this, obj, stack );
					stack.pop();
					return res;
				}
				// else
				return ( type == "string" ) ? parser : this.parsers.error;
			},
			typeOf: function( obj ) {
				var type;
				if ( obj === null ) {
					type = "null";
				} else if ( typeof obj === "undefined" ) {
					type = "undefined";
				} else if ( QUnit.is( "regexp", obj) ) {
					type = "regexp";
				} else if ( QUnit.is( "date", obj) ) {
					type = "date";
				} else if ( QUnit.is( "function", obj) ) {
					type = "function";
				} else if ( typeof obj.setInterval !== undefined && typeof obj.document !== "undefined" && typeof obj.nodeType === "undefined" ) {
					type = "window";
				} else if ( obj.nodeType === 9 ) {
					type = "document";
				} else if ( obj.nodeType ) {
					type = "node";
				} else if (
					// native arrays
					toString.call( obj ) === "[object Array]" ||
					// NodeList objects
					( typeof obj.length === "number" && typeof obj.item !== "undefined" && ( obj.length ? obj.item(0) === obj[0] : ( obj.item( 0 ) === null && typeof obj[0] === "undefined" ) ) )
				) {
					type = "array";
				} else {
					type = typeof obj;
				}
				return type;
			},
			separator: function() {
				return this.multiline ?	this.HTML ? "<br />" : "\n" : this.HTML ? "&nbsp;" : " ";
			},
			indent: function( extra ) {// extra can be a number, shortcut for increasing-calling-decreasing
				if ( !this.multiline ) {
					return "";
				}
				var chr = this.indentChar;
				if ( this.HTML ) {
					chr = chr.replace( /\t/g, "   " ).replace( / /g, "&nbsp;" );
				}
				return new Array( this._depth_ + (extra||0) ).join(chr);
			},
			up: function( a ) {
				this._depth_ += a || 1;
			},
			down: function( a ) {
				this._depth_ -= a || 1;
			},
			setParser: function( name, parser ) {
				this.parsers[name] = parser;
			},
			// The next 3 are exposed so you can use them
			quote: quote,
			literal: literal,
			join: join,
			//
			_depth_: 1,
			// This is the list of parsers, to modify them, use jsDump.setParser
			parsers: {
				window: "[Window]",
				document: "[Document]",
				error: "[ERROR]", //when no parser is found, shouldn"t happen
				unknown: "[Unknown]",
				"null": "null",
				"undefined": "undefined",
				"function": function( fn ) {
					var ret = "function",
						name = "name" in fn ? fn.name : (reName.exec(fn) || [])[1];//functions never have name in IE

					if ( name ) {
						ret += " " + name;
					}
					ret += "( ";

					ret = [ ret, QUnit.jsDump.parse( fn, "functionArgs" ), "){" ].join( "" );
					return join( ret, QUnit.jsDump.parse(fn,"functionCode" ), "}" );
				},
				array: array,
				nodelist: array,
				"arguments": array,
				object: function( map, stack ) {
					var ret = [ ], keys, key, val, i;
					QUnit.jsDump.up();
					if ( Object.keys ) {
						keys = Object.keys( map );
					} else {
						keys = [];
						for ( key in map ) {
							keys.push( key );
						}
					}
					keys.sort();
					for ( i = 0; i < keys.length; i++ ) {
						key = keys[ i ];
						val = map[ key ];
						ret.push( QUnit.jsDump.parse( key, "key" ) + ": " + QUnit.jsDump.parse( val, undefined, stack ) );
					}
					QUnit.jsDump.down();
					return join( "{", ret, "}" );
				},
				node: function( node ) {
					var a, val,
						open = QUnit.jsDump.HTML ? "&lt;" : "<",
						close = QUnit.jsDump.HTML ? "&gt;" : ">",
						tag = node.nodeName.toLowerCase(),
						ret = open + tag;

					for ( a in QUnit.jsDump.DOMAttrs ) {
						val = node[ QUnit.jsDump.DOMAttrs[a] ];
						if ( val ) {
							ret += " " + a + "=" + QUnit.jsDump.parse( val, "attribute" );
						}
					}
					return ret + close + open + "/" + tag + close;
				},
				functionArgs: function( fn ) {//function calls it internally, it's the arguments part of the function
					var args,
						l = fn.length;

					if ( !l ) {
						return "";
					}

					args = new Array(l);
					while ( l-- ) {
						args[l] = String.fromCharCode(97+l);//97 is 'a'
					}
					return " " + args.join( ", " ) + " ";
				},
				key: quote, //object calls it internally, the key part of an item in a map
				functionCode: "[code]", //function calls it internally, it's the content of the function
				attribute: quote, //node calls it internally, it's an html attribute value
				string: quote,
				date: quote,
				regexp: literal, //regex
				number: literal,
				"boolean": literal
			},
			DOMAttrs: {
				//attributes to dump from nodes, name=>realName
				id: "id",
				name: "name",
				"class": "className"
			},
			HTML: false,//if true, entities are escaped ( <, >, \t, space and \n )
			indentChar: "  ",//indentation unit
			multiline: true //if true, items in a collection, are separated by a \n, else just a space.
		};

	return jsDump;
}());

// from Sizzle.js
function getText( elems ) {
	var i, elem,
		ret = "";

	for ( i = 0; elems[i]; i++ ) {
		elem = elems[i];

		// Get the text from text nodes and CDATA nodes
		if ( elem.nodeType === 3 || elem.nodeType === 4 ) {
			ret += elem.nodeValue;

		// Traverse everything else, except comment nodes
		} else if ( elem.nodeType !== 8 ) {
			ret += getText( elem.childNodes );
		}
	}

	return ret;
}

// from jquery.js
function inArray( elem, array ) {
	if ( array.indexOf ) {
		return array.indexOf( elem );
	}

	for ( var i = 0, length = array.length; i < length; i++ ) {
		if ( array[ i ] === elem ) {
			return i;
		}
	}

	return -1;
}

/*
 * Javascript Diff Algorithm
 *  By John Resig (http://ejohn.org/)
 *  Modified by Chu Alan "sprite"
 *
 * Released under the MIT license.
 *
 * More Info:
 *  http://ejohn.org/projects/javascript-diff-algorithm/
 *
 * Usage: QUnit.diff(expected, actual)
 *
 * QUnit.diff( "the quick brown fox jumped over", "the quick fox jumps over" ) == "the  quick <del>brown </del> fox <del>jumped </del><ins>jumps </ins> over"
 */
QUnit.diff = (function() {
	function diff( o, n ) {
		var i,
			ns = {},
			os = {};

		for ( i = 0; i < n.length; i++ ) {
			if ( ns[ n[i] ] == null ) {
				ns[ n[i] ] = {
					rows: [],
					o: null
				};
			}
			ns[ n[i] ].rows.push( i );
		}

		for ( i = 0; i < o.length; i++ ) {
			if ( os[ o[i] ] == null ) {
				os[ o[i] ] = {
					rows: [],
					n: null
				};
			}
			os[ o[i] ].rows.push( i );
		}

		for ( i in ns ) {
			if ( !hasOwn.call( ns, i ) ) {
				continue;
			}
			if ( ns[i].rows.length == 1 && typeof os[i] != "undefined" && os[i].rows.length == 1 ) {
				n[ ns[i].rows[0] ] = {
					text: n[ ns[i].rows[0] ],
					row: os[i].rows[0]
				};
				o[ os[i].rows[0] ] = {
					text: o[ os[i].rows[0] ],
					row: ns[i].rows[0]
				};
			}
		}

		for ( i = 0; i < n.length - 1; i++ ) {
			if ( n[i].text != null && n[ i + 1 ].text == null && n[i].row + 1 < o.length && o[ n[i].row + 1 ].text == null &&
						n[ i + 1 ] == o[ n[i].row + 1 ] ) {

				n[ i + 1 ] = {
					text: n[ i + 1 ],
					row: n[i].row + 1
				};
				o[ n[i].row + 1 ] = {
					text: o[ n[i].row + 1 ],
					row: i + 1
				};
			}
		}

		for ( i = n.length - 1; i > 0; i-- ) {
			if ( n[i].text != null && n[ i - 1 ].text == null && n[i].row > 0 && o[ n[i].row - 1 ].text == null &&
						n[ i - 1 ] == o[ n[i].row - 1 ]) {

				n[ i - 1 ] = {
					text: n[ i - 1 ],
					row: n[i].row - 1
				};
				o[ n[i].row - 1 ] = {
					text: o[ n[i].row - 1 ],
					row: i - 1
				};
			}
		}

		return {
			o: o,
			n: n
		};
	}

	return function( o, n ) {
		o = o.replace( /\s+$/, "" );
		n = n.replace( /\s+$/, "" );

		var i, pre,
			str = "",
			out = diff( o === "" ? [] : o.split(/\s+/), n === "" ? [] : n.split(/\s+/) ),
			oSpace = o.match(/\s+/g),
			nSpace = n.match(/\s+/g);

		if ( oSpace == null ) {
			oSpace = [ " " ];
		}
		else {
			oSpace.push( " " );
		}

		if ( nSpace == null ) {
			nSpace = [ " " ];
		}
		else {
			nSpace.push( " " );
		}

		if ( out.n.length === 0 ) {
			for ( i = 0; i < out.o.length; i++ ) {
				str += "<del>" + out.o[i] + oSpace[i] + "</del>";
			}
		}
		else {
			if ( out.n[0].text == null ) {
				for ( n = 0; n < out.o.length && out.o[n].text == null; n++ ) {
					str += "<del>" + out.o[n] + oSpace[n] + "</del>";
				}
			}

			for ( i = 0; i < out.n.length; i++ ) {
				if (out.n[i].text == null) {
					str += "<ins>" + out.n[i] + nSpace[i] + "</ins>";
				}
				else {
					// `pre` initialized at top of scope
					pre = "";

					for ( n = out.n[i].row + 1; n < out.o.length && out.o[n].text == null; n++ ) {
						pre += "<del>" + out.o[n] + oSpace[n] + "</del>";
					}
					str += " " + out.n[i].text + nSpace[i] + pre;
				}
			}
		}

		return str;
	};
}());

// for CommonJS enviroments, export everything
if ( typeof exports !== "undefined" ) {
	extend(exports, QUnit);
}

// get at whatever the global object is, like window in browsers
}( (function() {return this;}.call()) ));

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiIiwic291cmNlcyI6WyJtb2Rlcm5penIvdGVzdC9xdW5pdC9xdW5pdC5qcyJdLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIFFVbml0IHYxLjkuMCAtIEEgSmF2YVNjcmlwdCBVbml0IFRlc3RpbmcgRnJhbWV3b3JrXG4gKlxuICogaHR0cDovL2RvY3MuanF1ZXJ5LmNvbS9RVW5pdFxuICpcbiAqIENvcHlyaWdodCAoYykgMjAxMiBKb2huIFJlc2lnLCBKw7ZybiBaYWVmZmVyZXJcbiAqIER1YWwgbGljZW5zZWQgdW5kZXIgdGhlIE1JVCAoTUlULUxJQ0VOU0UudHh0KVxuICogb3IgR1BMIChHUEwtTElDRU5TRS50eHQpIGxpY2Vuc2VzLlxuICovXG5cbihmdW5jdGlvbiggd2luZG93ICkge1xuXG52YXIgUVVuaXQsXG5cdGNvbmZpZyxcblx0b25FcnJvckZuUHJldixcblx0dGVzdElkID0gMCxcblx0ZmlsZU5hbWUgPSAoc291cmNlRnJvbVN0YWNrdHJhY2UoIDAgKSB8fCBcIlwiICkucmVwbGFjZSgvKDpcXGQrKStcXCk/LywgXCJcIikucmVwbGFjZSgvLitcXC8vLCBcIlwiKSxcblx0dG9TdHJpbmcgPSBPYmplY3QucHJvdG90eXBlLnRvU3RyaW5nLFxuXHRoYXNPd24gPSBPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LFxuXHRkZWZpbmVkID0ge1xuXHRzZXRUaW1lb3V0OiB0eXBlb2Ygd2luZG93LnNldFRpbWVvdXQgIT09IFwidW5kZWZpbmVkXCIsXG5cdHNlc3Npb25TdG9yYWdlOiAoZnVuY3Rpb24oKSB7XG5cdFx0dmFyIHggPSBcInF1bml0LXRlc3Qtc3RyaW5nXCI7XG5cdFx0dHJ5IHtcblx0XHRcdHNlc3Npb25TdG9yYWdlLnNldEl0ZW0oIHgsIHggKTtcblx0XHRcdHNlc3Npb25TdG9yYWdlLnJlbW92ZUl0ZW0oIHggKTtcblx0XHRcdHJldHVybiB0cnVlO1xuXHRcdH0gY2F0Y2goIGUgKSB7XG5cdFx0XHRyZXR1cm4gZmFsc2U7XG5cdFx0fVxuXHR9KCkpXG59O1xuXG5mdW5jdGlvbiBUZXN0KCBzZXR0aW5ncyApIHtcblx0ZXh0ZW5kKCB0aGlzLCBzZXR0aW5ncyApO1xuXHR0aGlzLmFzc2VydGlvbnMgPSBbXTtcblx0dGhpcy50ZXN0TnVtYmVyID0gKytUZXN0LmNvdW50O1xufVxuXG5UZXN0LmNvdW50ID0gMDtcblxuVGVzdC5wcm90b3R5cGUgPSB7XG5cdGluaXQ6IGZ1bmN0aW9uKCkge1xuXHRcdHZhciBhLCBiLCBsaSxcbiAgICAgICAgdGVzdHMgPSBpZCggXCJxdW5pdC10ZXN0c1wiICk7XG5cblx0XHRpZiAoIHRlc3RzICkge1xuXHRcdFx0YiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoIFwic3Ryb25nXCIgKTtcblx0XHRcdGIuaW5uZXJIVE1MID0gdGhpcy5uYW1lO1xuXG5cdFx0XHQvLyBgYWAgaW5pdGlhbGl6ZWQgYXQgdG9wIG9mIHNjb3BlXG5cdFx0XHRhID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCggXCJhXCIgKTtcblx0XHRcdGEuaW5uZXJIVE1MID0gXCJSZXJ1blwiO1xuXHRcdFx0YS5ocmVmID0gUVVuaXQudXJsKHsgdGVzdE51bWJlcjogdGhpcy50ZXN0TnVtYmVyIH0pO1xuXG5cdFx0XHRsaSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoIFwibGlcIiApO1xuXHRcdFx0bGkuYXBwZW5kQ2hpbGQoIGIgKTtcblx0XHRcdGxpLmFwcGVuZENoaWxkKCBhICk7XG5cdFx0XHRsaS5jbGFzc05hbWUgPSBcInJ1bm5pbmdcIjtcblx0XHRcdGxpLmlkID0gdGhpcy5pZCA9IFwicXVuaXQtdGVzdC1vdXRwdXRcIiArIHRlc3RJZCsrO1xuXG5cdFx0XHR0ZXN0cy5hcHBlbmRDaGlsZCggbGkgKTtcblx0XHR9XG5cdH0sXG5cdHNldHVwOiBmdW5jdGlvbigpIHtcblx0XHRpZiAoIHRoaXMubW9kdWxlICE9PSBjb25maWcucHJldmlvdXNNb2R1bGUgKSB7XG5cdFx0XHRpZiAoIGNvbmZpZy5wcmV2aW91c01vZHVsZSApIHtcblx0XHRcdFx0cnVuTG9nZ2luZ0NhbGxiYWNrcyggXCJtb2R1bGVEb25lXCIsIFFVbml0LCB7XG5cdFx0XHRcdFx0bmFtZTogY29uZmlnLnByZXZpb3VzTW9kdWxlLFxuXHRcdFx0XHRcdGZhaWxlZDogY29uZmlnLm1vZHVsZVN0YXRzLmJhZCxcblx0XHRcdFx0XHRwYXNzZWQ6IGNvbmZpZy5tb2R1bGVTdGF0cy5hbGwgLSBjb25maWcubW9kdWxlU3RhdHMuYmFkLFxuXHRcdFx0XHRcdHRvdGFsOiBjb25maWcubW9kdWxlU3RhdHMuYWxsXG5cdFx0XHRcdH0pO1xuXHRcdFx0fVxuXHRcdFx0Y29uZmlnLnByZXZpb3VzTW9kdWxlID0gdGhpcy5tb2R1bGU7XG5cdFx0XHRjb25maWcubW9kdWxlU3RhdHMgPSB7IGFsbDogMCwgYmFkOiAwIH07XG5cdFx0XHRydW5Mb2dnaW5nQ2FsbGJhY2tzKCBcIm1vZHVsZVN0YXJ0XCIsIFFVbml0LCB7XG5cdFx0XHRcdG5hbWU6IHRoaXMubW9kdWxlXG5cdFx0XHR9KTtcblx0XHR9IGVsc2UgaWYgKCBjb25maWcuYXV0b3J1biApIHtcblx0XHRcdHJ1bkxvZ2dpbmdDYWxsYmFja3MoIFwibW9kdWxlU3RhcnRcIiwgUVVuaXQsIHtcblx0XHRcdFx0bmFtZTogdGhpcy5tb2R1bGVcblx0XHRcdH0pO1xuXHRcdH1cblxuXHRcdGNvbmZpZy5jdXJyZW50ID0gdGhpcztcblxuXHRcdHRoaXMudGVzdEVudmlyb25tZW50ID0gZXh0ZW5kKHtcblx0XHRcdHNldHVwOiBmdW5jdGlvbigpIHt9LFxuXHRcdFx0dGVhcmRvd246IGZ1bmN0aW9uKCkge31cblx0XHR9LCB0aGlzLm1vZHVsZVRlc3RFbnZpcm9ubWVudCApO1xuXG5cdFx0cnVuTG9nZ2luZ0NhbGxiYWNrcyggXCJ0ZXN0U3RhcnRcIiwgUVVuaXQsIHtcblx0XHRcdG5hbWU6IHRoaXMudGVzdE5hbWUsXG5cdFx0XHRtb2R1bGU6IHRoaXMubW9kdWxlXG5cdFx0fSk7XG5cblx0XHQvLyBhbGxvdyB1dGlsaXR5IGZ1bmN0aW9ucyB0byBhY2Nlc3MgdGhlIGN1cnJlbnQgdGVzdCBlbnZpcm9ubWVudFxuXHRcdC8vIFRPRE8gd2h5Pz9cblx0XHRRVW5pdC5jdXJyZW50X3Rlc3RFbnZpcm9ubWVudCA9IHRoaXMudGVzdEVudmlyb25tZW50O1xuXG5cdFx0aWYgKCAhY29uZmlnLnBvbGx1dGlvbiApIHtcblx0XHRcdHNhdmVHbG9iYWwoKTtcblx0XHR9XG5cdFx0aWYgKCBjb25maWcubm90cnljYXRjaCApIHtcblx0XHRcdHRoaXMudGVzdEVudmlyb25tZW50LnNldHVwLmNhbGwoIHRoaXMudGVzdEVudmlyb25tZW50ICk7XG5cdFx0XHRyZXR1cm47XG5cdFx0fVxuXHRcdHRyeSB7XG5cdFx0XHR0aGlzLnRlc3RFbnZpcm9ubWVudC5zZXR1cC5jYWxsKCB0aGlzLnRlc3RFbnZpcm9ubWVudCApO1xuXHRcdH0gY2F0Y2goIGUgKSB7XG5cdFx0XHRRVW5pdC5wdXNoRmFpbHVyZSggXCJTZXR1cCBmYWlsZWQgb24gXCIgKyB0aGlzLnRlc3ROYW1lICsgXCI6IFwiICsgZS5tZXNzYWdlLCBleHRyYWN0U3RhY2t0cmFjZSggZSwgMSApICk7XG5cdFx0fVxuXHR9LFxuXHRydW46IGZ1bmN0aW9uKCkge1xuXHRcdGNvbmZpZy5jdXJyZW50ID0gdGhpcztcblxuXHRcdHZhciBydW5uaW5nID0gaWQoIFwicXVuaXQtdGVzdHJlc3VsdFwiICk7XG5cblx0XHRpZiAoIHJ1bm5pbmcgKSB7XG5cdFx0XHRydW5uaW5nLmlubmVySFRNTCA9IFwiUnVubmluZzogPGJyLz5cIiArIHRoaXMubmFtZTtcblx0XHR9XG5cblx0XHRpZiAoIHRoaXMuYXN5bmMgKSB7XG5cdFx0XHRRVW5pdC5zdG9wKCk7XG5cdFx0fVxuXG5cdFx0aWYgKCBjb25maWcubm90cnljYXRjaCApIHtcblx0XHRcdHRoaXMuY2FsbGJhY2suY2FsbCggdGhpcy50ZXN0RW52aXJvbm1lbnQsIFFVbml0LmFzc2VydCApO1xuXHRcdFx0cmV0dXJuO1xuXHRcdH1cblxuXHRcdHRyeSB7XG5cdFx0XHR0aGlzLmNhbGxiYWNrLmNhbGwoIHRoaXMudGVzdEVudmlyb25tZW50LCBRVW5pdC5hc3NlcnQgKTtcblx0XHR9IGNhdGNoKCBlICkge1xuXHRcdFx0UVVuaXQucHVzaEZhaWx1cmUoIFwiRGllZCBvbiB0ZXN0ICNcIiArICh0aGlzLmFzc2VydGlvbnMubGVuZ3RoICsgMSkgKyBcIiBcIiArIHRoaXMuc3RhY2sgKyBcIjogXCIgKyBlLm1lc3NhZ2UsIGV4dHJhY3RTdGFja3RyYWNlKCBlLCAwICkgKTtcblx0XHRcdC8vIGVsc2UgbmV4dCB0ZXN0IHdpbGwgY2FycnkgdGhlIHJlc3BvbnNpYmlsaXR5XG5cdFx0XHRzYXZlR2xvYmFsKCk7XG5cblx0XHRcdC8vIFJlc3RhcnQgdGhlIHRlc3RzIGlmIHRoZXkncmUgYmxvY2tpbmdcblx0XHRcdGlmICggY29uZmlnLmJsb2NraW5nICkge1xuXHRcdFx0XHRRVW5pdC5zdGFydCgpO1xuXHRcdFx0fVxuXHRcdH1cblx0fSxcblx0dGVhcmRvd246IGZ1bmN0aW9uKCkge1xuXHRcdGNvbmZpZy5jdXJyZW50ID0gdGhpcztcblx0XHRpZiAoIGNvbmZpZy5ub3RyeWNhdGNoICkge1xuXHRcdFx0dGhpcy50ZXN0RW52aXJvbm1lbnQudGVhcmRvd24uY2FsbCggdGhpcy50ZXN0RW52aXJvbm1lbnQgKTtcblx0XHRcdHJldHVybjtcblx0XHR9IGVsc2Uge1xuXHRcdFx0dHJ5IHtcblx0XHRcdFx0dGhpcy50ZXN0RW52aXJvbm1lbnQudGVhcmRvd24uY2FsbCggdGhpcy50ZXN0RW52aXJvbm1lbnQgKTtcblx0XHRcdH0gY2F0Y2goIGUgKSB7XG5cdFx0XHRcdFFVbml0LnB1c2hGYWlsdXJlKCBcIlRlYXJkb3duIGZhaWxlZCBvbiBcIiArIHRoaXMudGVzdE5hbWUgKyBcIjogXCIgKyBlLm1lc3NhZ2UsIGV4dHJhY3RTdGFja3RyYWNlKCBlLCAxICkgKTtcblx0XHRcdH1cblx0XHR9XG5cdFx0Y2hlY2tQb2xsdXRpb24oKTtcblx0fSxcblx0ZmluaXNoOiBmdW5jdGlvbigpIHtcblx0XHRjb25maWcuY3VycmVudCA9IHRoaXM7XG5cdFx0aWYgKCBjb25maWcucmVxdWlyZUV4cGVjdHMgJiYgdGhpcy5leHBlY3RlZCA9PSBudWxsICkge1xuXHRcdFx0UVVuaXQucHVzaEZhaWx1cmUoIFwiRXhwZWN0ZWQgbnVtYmVyIG9mIGFzc2VydGlvbnMgdG8gYmUgZGVmaW5lZCwgYnV0IGV4cGVjdCgpIHdhcyBub3QgY2FsbGVkLlwiLCB0aGlzLnN0YWNrICk7XG5cdFx0fSBlbHNlIGlmICggdGhpcy5leHBlY3RlZCAhPSBudWxsICYmIHRoaXMuZXhwZWN0ZWQgIT0gdGhpcy5hc3NlcnRpb25zLmxlbmd0aCApIHtcblx0XHRcdFFVbml0LnB1c2hGYWlsdXJlKCBcIkV4cGVjdGVkIFwiICsgdGhpcy5leHBlY3RlZCArIFwiIGFzc2VydGlvbnMsIGJ1dCBcIiArIHRoaXMuYXNzZXJ0aW9ucy5sZW5ndGggKyBcIiB3ZXJlIHJ1blwiLCB0aGlzLnN0YWNrICk7XG5cdFx0fSBlbHNlIGlmICggdGhpcy5leHBlY3RlZCA9PSBudWxsICYmICF0aGlzLmFzc2VydGlvbnMubGVuZ3RoICkge1xuXHRcdFx0UVVuaXQucHVzaEZhaWx1cmUoIFwiRXhwZWN0ZWQgYXQgbGVhc3Qgb25lIGFzc2VydGlvbiwgYnV0IG5vbmUgd2VyZSBydW4gLSBjYWxsIGV4cGVjdCgwKSB0byBhY2NlcHQgemVybyBhc3NlcnRpb25zLlwiLCB0aGlzLnN0YWNrICk7XG5cdFx0fVxuXG5cdFx0dmFyIGFzc2VydGlvbiwgYSwgYiwgaSwgbGksIG9sLFxuXHRcdFx0dGVzdCA9IHRoaXMsXG5cdFx0XHRnb29kID0gMCxcblx0XHRcdGJhZCA9IDAsXG5cdFx0XHR0ZXN0cyA9IGlkKCBcInF1bml0LXRlc3RzXCIgKTtcblxuXHRcdGNvbmZpZy5zdGF0cy5hbGwgKz0gdGhpcy5hc3NlcnRpb25zLmxlbmd0aDtcblx0XHRjb25maWcubW9kdWxlU3RhdHMuYWxsICs9IHRoaXMuYXNzZXJ0aW9ucy5sZW5ndGg7XG5cblx0XHRpZiAoIHRlc3RzICkge1xuXHRcdFx0b2wgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCBcIm9sXCIgKTtcblxuXHRcdFx0Zm9yICggaSA9IDA7IGkgPCB0aGlzLmFzc2VydGlvbnMubGVuZ3RoOyBpKysgKSB7XG5cdFx0XHRcdGFzc2VydGlvbiA9IHRoaXMuYXNzZXJ0aW9uc1tpXTtcblxuXHRcdFx0XHRsaSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoIFwibGlcIiApO1xuXHRcdFx0XHRsaS5jbGFzc05hbWUgPSBhc3NlcnRpb24ucmVzdWx0ID8gXCJwYXNzXCIgOiBcImZhaWxcIjtcblx0XHRcdFx0bGkuaW5uZXJIVE1MID0gYXNzZXJ0aW9uLm1lc3NhZ2UgfHwgKCBhc3NlcnRpb24ucmVzdWx0ID8gXCJva2F5XCIgOiBcImZhaWxlZFwiICk7XG5cdFx0XHRcdG9sLmFwcGVuZENoaWxkKCBsaSApO1xuXG5cdFx0XHRcdGlmICggYXNzZXJ0aW9uLnJlc3VsdCApIHtcblx0XHRcdFx0XHRnb29kKys7XG5cdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0YmFkKys7XG5cdFx0XHRcdFx0Y29uZmlnLnN0YXRzLmJhZCsrO1xuXHRcdFx0XHRcdGNvbmZpZy5tb2R1bGVTdGF0cy5iYWQrKztcblx0XHRcdFx0fVxuXHRcdFx0fVxuXG5cdFx0XHQvLyBzdG9yZSByZXN1bHQgd2hlbiBwb3NzaWJsZVxuXHRcdFx0aWYgKCBRVW5pdC5jb25maWcucmVvcmRlciAmJiBkZWZpbmVkLnNlc3Npb25TdG9yYWdlICkge1xuXHRcdFx0XHRpZiAoIGJhZCApIHtcblx0XHRcdFx0XHRzZXNzaW9uU3RvcmFnZS5zZXRJdGVtKCBcInF1bml0LXRlc3QtXCIgKyB0aGlzLm1vZHVsZSArIFwiLVwiICsgdGhpcy50ZXN0TmFtZSwgYmFkICk7XG5cdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0c2Vzc2lvblN0b3JhZ2UucmVtb3ZlSXRlbSggXCJxdW5pdC10ZXN0LVwiICsgdGhpcy5tb2R1bGUgKyBcIi1cIiArIHRoaXMudGVzdE5hbWUgKTtcblx0XHRcdFx0fVxuXHRcdFx0fVxuXG5cdFx0XHRpZiAoIGJhZCA9PT0gMCApIHtcblx0XHRcdFx0b2wuc3R5bGUuZGlzcGxheSA9IFwibm9uZVwiO1xuXHRcdFx0fVxuXG5cdFx0XHQvLyBgYmAgaW5pdGlhbGl6ZWQgYXQgdG9wIG9mIHNjb3BlXG5cdFx0XHRiID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCggXCJzdHJvbmdcIiApO1xuXHRcdFx0Yi5pbm5lckhUTUwgPSB0aGlzLm5hbWUgKyBcIiA8YiBjbGFzcz0nY291bnRzJz4oPGIgY2xhc3M9J2ZhaWxlZCc+XCIgKyBiYWQgKyBcIjwvYj4sIDxiIGNsYXNzPSdwYXNzZWQnPlwiICsgZ29vZCArIFwiPC9iPiwgXCIgKyB0aGlzLmFzc2VydGlvbnMubGVuZ3RoICsgXCIpPC9iPlwiO1xuXG5cdFx0XHRhZGRFdmVudChiLCBcImNsaWNrXCIsIGZ1bmN0aW9uKCkge1xuXHRcdFx0XHR2YXIgbmV4dCA9IGIubmV4dFNpYmxpbmcubmV4dFNpYmxpbmcsXG5cdFx0XHRcdFx0ZGlzcGxheSA9IG5leHQuc3R5bGUuZGlzcGxheTtcblx0XHRcdFx0bmV4dC5zdHlsZS5kaXNwbGF5ID0gZGlzcGxheSA9PT0gXCJub25lXCIgPyBcImJsb2NrXCIgOiBcIm5vbmVcIjtcblx0XHRcdH0pO1xuXG5cdFx0XHRhZGRFdmVudChiLCBcImRibGNsaWNrXCIsIGZ1bmN0aW9uKCBlICkge1xuXHRcdFx0XHR2YXIgdGFyZ2V0ID0gZSAmJiBlLnRhcmdldCA/IGUudGFyZ2V0IDogd2luZG93LmV2ZW50LnNyY0VsZW1lbnQ7XG5cdFx0XHRcdGlmICggdGFyZ2V0Lm5vZGVOYW1lLnRvTG93ZXJDYXNlKCkgPT0gXCJzcGFuXCIgfHwgdGFyZ2V0Lm5vZGVOYW1lLnRvTG93ZXJDYXNlKCkgPT0gXCJiXCIgKSB7XG5cdFx0XHRcdFx0dGFyZ2V0ID0gdGFyZ2V0LnBhcmVudE5vZGU7XG5cdFx0XHRcdH1cblx0XHRcdFx0aWYgKCB3aW5kb3cubG9jYXRpb24gJiYgdGFyZ2V0Lm5vZGVOYW1lLnRvTG93ZXJDYXNlKCkgPT09IFwic3Ryb25nXCIgKSB7XG5cdFx0XHRcdFx0d2luZG93LmxvY2F0aW9uID0gUVVuaXQudXJsKHsgdGVzdE51bWJlcjogdGVzdC50ZXN0TnVtYmVyIH0pO1xuXHRcdFx0XHR9XG5cdFx0XHR9KTtcblxuXHRcdFx0Ly8gYGxpYCBpbml0aWFsaXplZCBhdCB0b3Agb2Ygc2NvcGVcblx0XHRcdGxpID0gaWQoIHRoaXMuaWQgKTtcblx0XHRcdGxpLmNsYXNzTmFtZSA9IGJhZCA/IFwiZmFpbFwiIDogXCJwYXNzXCI7XG5cdFx0XHRsaS5yZW1vdmVDaGlsZCggbGkuZmlyc3RDaGlsZCApO1xuXHRcdFx0YSA9IGxpLmZpcnN0Q2hpbGQ7XG5cdFx0XHRsaS5hcHBlbmRDaGlsZCggYiApO1xuXHRcdFx0bGkuYXBwZW5kQ2hpbGQgKCBhICk7XG5cdFx0XHRsaS5hcHBlbmRDaGlsZCggb2wgKTtcblxuXHRcdH0gZWxzZSB7XG5cdFx0XHRmb3IgKCBpID0gMDsgaSA8IHRoaXMuYXNzZXJ0aW9ucy5sZW5ndGg7IGkrKyApIHtcblx0XHRcdFx0aWYgKCAhdGhpcy5hc3NlcnRpb25zW2ldLnJlc3VsdCApIHtcblx0XHRcdFx0XHRiYWQrKztcblx0XHRcdFx0XHRjb25maWcuc3RhdHMuYmFkKys7XG5cdFx0XHRcdFx0Y29uZmlnLm1vZHVsZVN0YXRzLmJhZCsrO1xuXHRcdFx0XHR9XG5cdFx0XHR9XG5cdFx0fVxuXG5cdFx0cnVuTG9nZ2luZ0NhbGxiYWNrcyggXCJ0ZXN0RG9uZVwiLCBRVW5pdCwge1xuXHRcdFx0bmFtZTogdGhpcy50ZXN0TmFtZSxcblx0XHRcdG1vZHVsZTogdGhpcy5tb2R1bGUsXG5cdFx0XHRmYWlsZWQ6IGJhZCxcblx0XHRcdHBhc3NlZDogdGhpcy5hc3NlcnRpb25zLmxlbmd0aCAtIGJhZCxcblx0XHRcdHRvdGFsOiB0aGlzLmFzc2VydGlvbnMubGVuZ3RoXG5cdFx0fSk7XG5cblx0XHRRVW5pdC5yZXNldCgpO1xuXG5cdFx0Y29uZmlnLmN1cnJlbnQgPSB1bmRlZmluZWQ7XG5cdH0sXG5cblx0cXVldWU6IGZ1bmN0aW9uKCkge1xuXHRcdHZhciBiYWQsXG5cdFx0XHR0ZXN0ID0gdGhpcztcblxuXHRcdHN5bmNocm9uaXplKGZ1bmN0aW9uKCkge1xuXHRcdFx0dGVzdC5pbml0KCk7XG5cdFx0fSk7XG5cdFx0ZnVuY3Rpb24gcnVuKCkge1xuXHRcdFx0Ly8gZWFjaCBvZiB0aGVzZSBjYW4gYnkgYXN5bmNcblx0XHRcdHN5bmNocm9uaXplKGZ1bmN0aW9uKCkge1xuXHRcdFx0XHR0ZXN0LnNldHVwKCk7XG5cdFx0XHR9KTtcblx0XHRcdHN5bmNocm9uaXplKGZ1bmN0aW9uKCkge1xuXHRcdFx0XHR0ZXN0LnJ1bigpO1xuXHRcdFx0fSk7XG5cdFx0XHRzeW5jaHJvbml6ZShmdW5jdGlvbigpIHtcblx0XHRcdFx0dGVzdC50ZWFyZG93bigpO1xuXHRcdFx0fSk7XG5cdFx0XHRzeW5jaHJvbml6ZShmdW5jdGlvbigpIHtcblx0XHRcdFx0dGVzdC5maW5pc2goKTtcblx0XHRcdH0pO1xuXHRcdH1cblxuXHRcdC8vIGBiYWRgIGluaXRpYWxpemVkIGF0IHRvcCBvZiBzY29wZVxuXHRcdC8vIGRlZmVyIHdoZW4gcHJldmlvdXMgdGVzdCBydW4gcGFzc2VkLCBpZiBzdG9yYWdlIGlzIGF2YWlsYWJsZVxuXHRcdGJhZCA9IFFVbml0LmNvbmZpZy5yZW9yZGVyICYmIGRlZmluZWQuc2Vzc2lvblN0b3JhZ2UgJiZcblx0XHRcdFx0XHRcdCtzZXNzaW9uU3RvcmFnZS5nZXRJdGVtKCBcInF1bml0LXRlc3QtXCIgKyB0aGlzLm1vZHVsZSArIFwiLVwiICsgdGhpcy50ZXN0TmFtZSApO1xuXG5cdFx0aWYgKCBiYWQgKSB7XG5cdFx0XHRydW4oKTtcblx0XHR9IGVsc2Uge1xuXHRcdFx0c3luY2hyb25pemUoIHJ1biwgdHJ1ZSApO1xuXHRcdH1cblx0fVxufTtcblxuLy8gUm9vdCBRVW5pdCBvYmplY3QuXG4vLyBgUVVuaXRgIGluaXRpYWxpemVkIGF0IHRvcCBvZiBzY29wZVxuUVVuaXQgPSB7XG5cblx0Ly8gY2FsbCBvbiBzdGFydCBvZiBtb2R1bGUgdGVzdCB0byBwcmVwZW5kIG5hbWUgdG8gYWxsIHRlc3RzXG5cdG1vZHVsZTogZnVuY3Rpb24oIG5hbWUsIHRlc3RFbnZpcm9ubWVudCApIHtcblx0XHRjb25maWcuY3VycmVudE1vZHVsZSA9IG5hbWU7XG5cdFx0Y29uZmlnLmN1cnJlbnRNb2R1bGVUZXN0RW52aXJvbWVudCA9IHRlc3RFbnZpcm9ubWVudDtcblx0fSxcblxuXHRhc3luY1Rlc3Q6IGZ1bmN0aW9uKCB0ZXN0TmFtZSwgZXhwZWN0ZWQsIGNhbGxiYWNrICkge1xuXHRcdGlmICggYXJndW1lbnRzLmxlbmd0aCA9PT0gMiApIHtcblx0XHRcdGNhbGxiYWNrID0gZXhwZWN0ZWQ7XG5cdFx0XHRleHBlY3RlZCA9IG51bGw7XG5cdFx0fVxuXG5cdFx0UVVuaXQudGVzdCggdGVzdE5hbWUsIGV4cGVjdGVkLCBjYWxsYmFjaywgdHJ1ZSApO1xuXHR9LFxuXG5cdHRlc3Q6IGZ1bmN0aW9uKCB0ZXN0TmFtZSwgZXhwZWN0ZWQsIGNhbGxiYWNrLCBhc3luYyApIHtcblx0XHR2YXIgdGVzdCxcblx0XHRcdG5hbWUgPSBcIjxzcGFuIGNsYXNzPSd0ZXN0LW5hbWUnPlwiICsgZXNjYXBlSW5uZXJUZXh0KCB0ZXN0TmFtZSApICsgXCI8L3NwYW4+XCI7XG5cblx0XHRpZiAoIGFyZ3VtZW50cy5sZW5ndGggPT09IDIgKSB7XG5cdFx0XHRjYWxsYmFjayA9IGV4cGVjdGVkO1xuXHRcdFx0ZXhwZWN0ZWQgPSBudWxsO1xuXHRcdH1cblxuXHRcdGlmICggY29uZmlnLmN1cnJlbnRNb2R1bGUgKSB7XG5cdFx0XHRuYW1lID0gXCI8c3BhbiBjbGFzcz0nbW9kdWxlLW5hbWUnPlwiICsgY29uZmlnLmN1cnJlbnRNb2R1bGUgKyBcIjwvc3Bhbj46IFwiICsgbmFtZTtcblx0XHR9XG5cblx0XHR0ZXN0ID0gbmV3IFRlc3Qoe1xuXHRcdFx0bmFtZTogbmFtZSxcblx0XHRcdHRlc3ROYW1lOiB0ZXN0TmFtZSxcblx0XHRcdGV4cGVjdGVkOiBleHBlY3RlZCxcblx0XHRcdGFzeW5jOiBhc3luYyxcblx0XHRcdGNhbGxiYWNrOiBjYWxsYmFjayxcblx0XHRcdG1vZHVsZTogY29uZmlnLmN1cnJlbnRNb2R1bGUsXG5cdFx0XHRtb2R1bGVUZXN0RW52aXJvbm1lbnQ6IGNvbmZpZy5jdXJyZW50TW9kdWxlVGVzdEVudmlyb21lbnQsXG5cdFx0XHRzdGFjazogc291cmNlRnJvbVN0YWNrdHJhY2UoIDIgKVxuXHRcdH0pO1xuXG5cdFx0aWYgKCAhdmFsaWRUZXN0KCB0ZXN0ICkgKSB7XG5cdFx0XHRyZXR1cm47XG5cdFx0fVxuXG5cdFx0dGVzdC5xdWV1ZSgpO1xuXHR9LFxuXG5cdC8vIFNwZWNpZnkgdGhlIG51bWJlciBvZiBleHBlY3RlZCBhc3NlcnRpb25zIHRvIGd1cmFudGVlIHRoYXQgZmFpbGVkIHRlc3QgKG5vIGFzc2VydGlvbnMgYXJlIHJ1biBhdCBhbGwpIGRvbid0IHNsaXAgdGhyb3VnaC5cblx0ZXhwZWN0OiBmdW5jdGlvbiggYXNzZXJ0cyApIHtcblx0XHRjb25maWcuY3VycmVudC5leHBlY3RlZCA9IGFzc2VydHM7XG5cdH0sXG5cblx0c3RhcnQ6IGZ1bmN0aW9uKCBjb3VudCApIHtcblx0XHRjb25maWcuc2VtYXBob3JlIC09IGNvdW50IHx8IDE7XG5cdFx0Ly8gZG9uJ3Qgc3RhcnQgdW50aWwgZXF1YWwgbnVtYmVyIG9mIHN0b3AtY2FsbHNcblx0XHRpZiAoIGNvbmZpZy5zZW1hcGhvcmUgPiAwICkge1xuXHRcdFx0cmV0dXJuO1xuXHRcdH1cblx0XHQvLyBpZ25vcmUgaWYgc3RhcnQgaXMgY2FsbGVkIG1vcmUgb2Z0ZW4gdGhlbiBzdG9wXG5cdFx0aWYgKCBjb25maWcuc2VtYXBob3JlIDwgMCApIHtcblx0XHRcdGNvbmZpZy5zZW1hcGhvcmUgPSAwO1xuXHRcdH1cblx0XHQvLyBBIHNsaWdodCBkZWxheSwgdG8gYXZvaWQgYW55IGN1cnJlbnQgY2FsbGJhY2tzXG5cdFx0aWYgKCBkZWZpbmVkLnNldFRpbWVvdXQgKSB7XG5cdFx0XHR3aW5kb3cuc2V0VGltZW91dChmdW5jdGlvbigpIHtcblx0XHRcdFx0aWYgKCBjb25maWcuc2VtYXBob3JlID4gMCApIHtcblx0XHRcdFx0XHRyZXR1cm47XG5cdFx0XHRcdH1cblx0XHRcdFx0aWYgKCBjb25maWcudGltZW91dCApIHtcblx0XHRcdFx0XHRjbGVhclRpbWVvdXQoIGNvbmZpZy50aW1lb3V0ICk7XG5cdFx0XHRcdH1cblxuXHRcdFx0XHRjb25maWcuYmxvY2tpbmcgPSBmYWxzZTtcblx0XHRcdFx0cHJvY2VzcyggdHJ1ZSApO1xuXHRcdFx0fSwgMTMpO1xuXHRcdH0gZWxzZSB7XG5cdFx0XHRjb25maWcuYmxvY2tpbmcgPSBmYWxzZTtcblx0XHRcdHByb2Nlc3MoIHRydWUgKTtcblx0XHR9XG5cdH0sXG5cblx0c3RvcDogZnVuY3Rpb24oIGNvdW50ICkge1xuXHRcdGNvbmZpZy5zZW1hcGhvcmUgKz0gY291bnQgfHwgMTtcblx0XHRjb25maWcuYmxvY2tpbmcgPSB0cnVlO1xuXG5cdFx0aWYgKCBjb25maWcudGVzdFRpbWVvdXQgJiYgZGVmaW5lZC5zZXRUaW1lb3V0ICkge1xuXHRcdFx0Y2xlYXJUaW1lb3V0KCBjb25maWcudGltZW91dCApO1xuXHRcdFx0Y29uZmlnLnRpbWVvdXQgPSB3aW5kb3cuc2V0VGltZW91dChmdW5jdGlvbigpIHtcblx0XHRcdFx0UVVuaXQub2soIGZhbHNlLCBcIlRlc3QgdGltZWQgb3V0XCIgKTtcblx0XHRcdFx0Y29uZmlnLnNlbWFwaG9yZSA9IDE7XG5cdFx0XHRcdFFVbml0LnN0YXJ0KCk7XG5cdFx0XHR9LCBjb25maWcudGVzdFRpbWVvdXQgKTtcblx0XHR9XG5cdH1cbn07XG5cbi8vIEFzc3NlcnQgaGVscGVyc1xuLy8gQWxsIG9mIHRoZXNlIG11c3QgY2FsbCBlaXRoZXIgUVVuaXQucHVzaCgpIG9yIG1hbnVhbGx5IGRvOlxuLy8gLSBydW5Mb2dnaW5nQ2FsbGJhY2tzKCBcImxvZ1wiLCAuLiApO1xuLy8gLSBjb25maWcuY3VycmVudC5hc3NlcnRpb25zLnB1c2goeyAuLiB9KTtcblFVbml0LmFzc2VydCA9IHtcblx0LyoqXG5cdCAqIEFzc2VydHMgcm91Z2ggdHJ1ZS1pc2ggcmVzdWx0LlxuXHQgKiBAbmFtZSBva1xuXHQgKiBAZnVuY3Rpb25cblx0ICogQGV4YW1wbGUgb2soIFwiYXNkZmFzZGZcIi5sZW5ndGggPiA1LCBcIlRoZXJlIG11c3QgYmUgYXQgbGVhc3QgNSBjaGFyc1wiICk7XG5cdCAqL1xuXHRvazogZnVuY3Rpb24oIHJlc3VsdCwgbXNnICkge1xuXHRcdGlmICggIWNvbmZpZy5jdXJyZW50ICkge1xuXHRcdFx0dGhyb3cgbmV3IEVycm9yKCBcIm9rKCkgYXNzZXJ0aW9uIG91dHNpZGUgdGVzdCBjb250ZXh0LCB3YXMgXCIgKyBzb3VyY2VGcm9tU3RhY2t0cmFjZSgyKSApO1xuXHRcdH1cblx0XHRyZXN1bHQgPSAhIXJlc3VsdDtcblxuXHRcdHZhciBzb3VyY2UsXG5cdFx0XHRkZXRhaWxzID0ge1xuXHRcdFx0XHRyZXN1bHQ6IHJlc3VsdCxcblx0XHRcdFx0bWVzc2FnZTogbXNnXG5cdFx0XHR9O1xuXG5cdFx0bXNnID0gZXNjYXBlSW5uZXJUZXh0KCBtc2cgfHwgKHJlc3VsdCA/IFwib2theVwiIDogXCJmYWlsZWRcIiApICk7XG5cdFx0bXNnID0gXCI8c3BhbiBjbGFzcz0ndGVzdC1tZXNzYWdlJz5cIiArIG1zZyArIFwiPC9zcGFuPlwiO1xuXG5cdFx0aWYgKCAhcmVzdWx0ICkge1xuXHRcdFx0c291cmNlID0gc291cmNlRnJvbVN0YWNrdHJhY2UoIDIgKTtcblx0XHRcdGlmICggc291cmNlICkge1xuXHRcdFx0XHRkZXRhaWxzLnNvdXJjZSA9IHNvdXJjZTtcblx0XHRcdFx0bXNnICs9IFwiPHRhYmxlPjx0ciBjbGFzcz0ndGVzdC1zb3VyY2UnPjx0aD5Tb3VyY2U6IDwvdGg+PHRkPjxwcmU+XCIgKyBlc2NhcGVJbm5lclRleHQoIHNvdXJjZSApICsgXCI8L3ByZT48L3RkPjwvdHI+PC90YWJsZT5cIjtcblx0XHRcdH1cblx0XHR9XG5cdFx0cnVuTG9nZ2luZ0NhbGxiYWNrcyggXCJsb2dcIiwgUVVuaXQsIGRldGFpbHMgKTtcblx0XHRjb25maWcuY3VycmVudC5hc3NlcnRpb25zLnB1c2goe1xuXHRcdFx0cmVzdWx0OiByZXN1bHQsXG5cdFx0XHRtZXNzYWdlOiBtc2dcblx0XHR9KTtcblx0fSxcblxuXHQvKipcblx0ICogQXNzZXJ0IHRoYXQgdGhlIGZpcnN0IHR3byBhcmd1bWVudHMgYXJlIGVxdWFsLCB3aXRoIGFuIG9wdGlvbmFsIG1lc3NhZ2UuXG5cdCAqIFByaW50cyBvdXQgYm90aCBhY3R1YWwgYW5kIGV4cGVjdGVkIHZhbHVlcy5cblx0ICogQG5hbWUgZXF1YWxcblx0ICogQGZ1bmN0aW9uXG5cdCAqIEBleGFtcGxlIGVxdWFsKCBmb3JtYXQoIFwiUmVjZWl2ZWQgezB9IGJ5dGVzLlwiLCAyKSwgXCJSZWNlaXZlZCAyIGJ5dGVzLlwiLCBcImZvcm1hdCgpIHJlcGxhY2VzIHswfSB3aXRoIG5leHQgYXJndW1lbnRcIiApO1xuXHQgKi9cblx0ZXF1YWw6IGZ1bmN0aW9uKCBhY3R1YWwsIGV4cGVjdGVkLCBtZXNzYWdlICkge1xuXHRcdFFVbml0LnB1c2goIGV4cGVjdGVkID09IGFjdHVhbCwgYWN0dWFsLCBleHBlY3RlZCwgbWVzc2FnZSApO1xuXHR9LFxuXG5cdC8qKlxuXHQgKiBAbmFtZSBub3RFcXVhbFxuXHQgKiBAZnVuY3Rpb25cblx0ICovXG5cdG5vdEVxdWFsOiBmdW5jdGlvbiggYWN0dWFsLCBleHBlY3RlZCwgbWVzc2FnZSApIHtcblx0XHRRVW5pdC5wdXNoKCBleHBlY3RlZCAhPSBhY3R1YWwsIGFjdHVhbCwgZXhwZWN0ZWQsIG1lc3NhZ2UgKTtcblx0fSxcblxuXHQvKipcblx0ICogQG5hbWUgZGVlcEVxdWFsXG5cdCAqIEBmdW5jdGlvblxuXHQgKi9cblx0ZGVlcEVxdWFsOiBmdW5jdGlvbiggYWN0dWFsLCBleHBlY3RlZCwgbWVzc2FnZSApIHtcblx0XHRRVW5pdC5wdXNoKCBRVW5pdC5lcXVpdihhY3R1YWwsIGV4cGVjdGVkKSwgYWN0dWFsLCBleHBlY3RlZCwgbWVzc2FnZSApO1xuXHR9LFxuXG5cdC8qKlxuXHQgKiBAbmFtZSBub3REZWVwRXF1YWxcblx0ICogQGZ1bmN0aW9uXG5cdCAqL1xuXHRub3REZWVwRXF1YWw6IGZ1bmN0aW9uKCBhY3R1YWwsIGV4cGVjdGVkLCBtZXNzYWdlICkge1xuXHRcdFFVbml0LnB1c2goICFRVW5pdC5lcXVpdihhY3R1YWwsIGV4cGVjdGVkKSwgYWN0dWFsLCBleHBlY3RlZCwgbWVzc2FnZSApO1xuXHR9LFxuXG5cdC8qKlxuXHQgKiBAbmFtZSBzdHJpY3RFcXVhbFxuXHQgKiBAZnVuY3Rpb25cblx0ICovXG5cdHN0cmljdEVxdWFsOiBmdW5jdGlvbiggYWN0dWFsLCBleHBlY3RlZCwgbWVzc2FnZSApIHtcblx0XHRRVW5pdC5wdXNoKCBleHBlY3RlZCA9PT0gYWN0dWFsLCBhY3R1YWwsIGV4cGVjdGVkLCBtZXNzYWdlICk7XG5cdH0sXG5cblx0LyoqXG5cdCAqIEBuYW1lIG5vdFN0cmljdEVxdWFsXG5cdCAqIEBmdW5jdGlvblxuXHQgKi9cblx0bm90U3RyaWN0RXF1YWw6IGZ1bmN0aW9uKCBhY3R1YWwsIGV4cGVjdGVkLCBtZXNzYWdlICkge1xuXHRcdFFVbml0LnB1c2goIGV4cGVjdGVkICE9PSBhY3R1YWwsIGFjdHVhbCwgZXhwZWN0ZWQsIG1lc3NhZ2UgKTtcblx0fSxcblxuXHR0aHJvd3M6IGZ1bmN0aW9uKCBibG9jaywgZXhwZWN0ZWQsIG1lc3NhZ2UgKSB7XG5cdFx0dmFyIGFjdHVhbCxcblx0XHRcdG9rID0gZmFsc2U7XG5cblx0XHQvLyAnZXhwZWN0ZWQnIGlzIG9wdGlvbmFsXG5cdFx0aWYgKCB0eXBlb2YgZXhwZWN0ZWQgPT09IFwic3RyaW5nXCIgKSB7XG5cdFx0XHRtZXNzYWdlID0gZXhwZWN0ZWQ7XG5cdFx0XHRleHBlY3RlZCA9IG51bGw7XG5cdFx0fVxuXG5cdFx0Y29uZmlnLmN1cnJlbnQuaWdub3JlR2xvYmFsRXJyb3JzID0gdHJ1ZTtcblx0XHR0cnkge1xuXHRcdFx0YmxvY2suY2FsbCggY29uZmlnLmN1cnJlbnQudGVzdEVudmlyb25tZW50ICk7XG5cdFx0fSBjYXRjaCAoZSkge1xuXHRcdFx0YWN0dWFsID0gZTtcblx0XHR9XG5cdFx0Y29uZmlnLmN1cnJlbnQuaWdub3JlR2xvYmFsRXJyb3JzID0gZmFsc2U7XG5cblx0XHRpZiAoIGFjdHVhbCApIHtcblx0XHRcdC8vIHdlIGRvbid0IHdhbnQgdG8gdmFsaWRhdGUgdGhyb3duIGVycm9yXG5cdFx0XHRpZiAoICFleHBlY3RlZCApIHtcblx0XHRcdFx0b2sgPSB0cnVlO1xuXHRcdFx0Ly8gZXhwZWN0ZWQgaXMgYSByZWdleHBcblx0XHRcdH0gZWxzZSBpZiAoIFFVbml0Lm9iamVjdFR5cGUoIGV4cGVjdGVkICkgPT09IFwicmVnZXhwXCIgKSB7XG5cdFx0XHRcdG9rID0gZXhwZWN0ZWQudGVzdCggYWN0dWFsICk7XG5cdFx0XHQvLyBleHBlY3RlZCBpcyBhIGNvbnN0cnVjdG9yXG5cdFx0XHR9IGVsc2UgaWYgKCBhY3R1YWwgaW5zdGFuY2VvZiBleHBlY3RlZCApIHtcblx0XHRcdFx0b2sgPSB0cnVlO1xuXHRcdFx0Ly8gZXhwZWN0ZWQgaXMgYSB2YWxpZGF0aW9uIGZ1bmN0aW9uIHdoaWNoIHJldHVybnMgdHJ1ZSBpcyB2YWxpZGF0aW9uIHBhc3NlZFxuXHRcdFx0fSBlbHNlIGlmICggZXhwZWN0ZWQuY2FsbCgge30sIGFjdHVhbCApID09PSB0cnVlICkge1xuXHRcdFx0XHRvayA9IHRydWU7XG5cdFx0XHR9XG5cblx0XHRcdFFVbml0LnB1c2goIG9rLCBhY3R1YWwsIG51bGwsIG1lc3NhZ2UgKTtcblx0XHR9IGVsc2Uge1xuXHRcdFx0UVVuaXQucHVzaEZhaWx1cmUoIG1lc3NhZ2UsIG51bGwsICdObyBleGNlcHRpb24gd2FzIHRocm93bi4nICk7XG5cdFx0fVxuXHR9XG59O1xuXG4vKipcbiAqIEBkZXByZWNhdGUgc2luY2UgMS44LjBcbiAqIEtlcHQgYXNzZXJ0aW9uIGhlbHBlcnMgaW4gcm9vdCBmb3IgYmFja3dhcmRzIGNvbXBhdGliaWxpdHlcbiAqL1xuZXh0ZW5kKCBRVW5pdCwgUVVuaXQuYXNzZXJ0ICk7XG5cbi8qKlxuICogQGRlcHJlY2F0ZWQgc2luY2UgMS45LjBcbiAqIEtlcHQgZ2xvYmFsIFwicmFpc2VzKClcIiBmb3IgYmFja3dhcmRzIGNvbXBhdGliaWxpdHlcbiAqL1xuUVVuaXQucmFpc2VzID0gUVVuaXQuYXNzZXJ0LnRocm93cztcblxuLyoqXG4gKiBAZGVwcmVjYXRlZCBzaW5jZSAxLjAuMCwgcmVwbGFjZWQgd2l0aCBlcnJvciBwdXNoZXMgc2luY2UgMS4zLjBcbiAqIEtlcHQgdG8gYXZvaWQgVHlwZUVycm9ycyBmb3IgdW5kZWZpbmVkIG1ldGhvZHMuXG4gKi9cblFVbml0LmVxdWFscyA9IGZ1bmN0aW9uKCkge1xuXHRRVW5pdC5wdXNoKCBmYWxzZSwgZmFsc2UsIGZhbHNlLCBcIlFVbml0LmVxdWFscyBoYXMgYmVlbiBkZXByZWNhdGVkIHNpbmNlIDIwMDkgKGU4ODA0OWEwKSwgdXNlIFFVbml0LmVxdWFsIGluc3RlYWRcIiApO1xufTtcblFVbml0LnNhbWUgPSBmdW5jdGlvbigpIHtcblx0UVVuaXQucHVzaCggZmFsc2UsIGZhbHNlLCBmYWxzZSwgXCJRVW5pdC5zYW1lIGhhcyBiZWVuIGRlcHJlY2F0ZWQgc2luY2UgMjAwOSAoZTg4MDQ5YTApLCB1c2UgUVVuaXQuZGVlcEVxdWFsIGluc3RlYWRcIiApO1xufTtcblxuLy8gV2Ugd2FudCBhY2Nlc3MgdG8gdGhlIGNvbnN0cnVjdG9yJ3MgcHJvdG90eXBlXG4oZnVuY3Rpb24oKSB7XG5cdGZ1bmN0aW9uIEYoKSB7fVxuXHRGLnByb3RvdHlwZSA9IFFVbml0O1xuXHRRVW5pdCA9IG5ldyBGKCk7XG5cdC8vIE1ha2UgRiBRVW5pdCdzIGNvbnN0cnVjdG9yIHNvIHRoYXQgd2UgY2FuIGFkZCB0byB0aGUgcHJvdG90eXBlIGxhdGVyXG5cdFFVbml0LmNvbnN0cnVjdG9yID0gRjtcbn0oKSk7XG5cbi8qKlxuICogQ29uZmlnIG9iamVjdDogTWFpbnRhaW4gaW50ZXJuYWwgc3RhdGVcbiAqIExhdGVyIGV4cG9zZWQgYXMgUVVuaXQuY29uZmlnXG4gKiBgY29uZmlnYCBpbml0aWFsaXplZCBhdCB0b3Agb2Ygc2NvcGVcbiAqL1xuY29uZmlnID0ge1xuXHQvLyBUaGUgcXVldWUgb2YgdGVzdHMgdG8gcnVuXG5cdHF1ZXVlOiBbXSxcblxuXHQvLyBibG9jayB1bnRpbCBkb2N1bWVudCByZWFkeVxuXHRibG9ja2luZzogdHJ1ZSxcblxuXHQvLyB3aGVuIGVuYWJsZWQsIHNob3cgb25seSBmYWlsaW5nIHRlc3RzXG5cdC8vIGdldHMgcGVyc2lzdGVkIHRocm91Z2ggc2Vzc2lvblN0b3JhZ2UgYW5kIGNhbiBiZSBjaGFuZ2VkIGluIFVJIHZpYSBjaGVja2JveFxuXHRoaWRlcGFzc2VkOiBmYWxzZSxcblxuXHQvLyBieSBkZWZhdWx0LCBydW4gcHJldmlvdXNseSBmYWlsZWQgdGVzdHMgZmlyc3Rcblx0Ly8gdmVyeSB1c2VmdWwgaW4gY29tYmluYXRpb24gd2l0aCBcIkhpZGUgcGFzc2VkIHRlc3RzXCIgY2hlY2tlZFxuXHRyZW9yZGVyOiB0cnVlLFxuXG5cdC8vIGJ5IGRlZmF1bHQsIG1vZGlmeSBkb2N1bWVudC50aXRsZSB3aGVuIHN1aXRlIGlzIGRvbmVcblx0YWx0ZXJ0aXRsZTogdHJ1ZSxcblxuXHQvLyB3aGVuIGVuYWJsZWQsIGFsbCB0ZXN0cyBtdXN0IGNhbGwgZXhwZWN0KClcblx0cmVxdWlyZUV4cGVjdHM6IGZhbHNlLFxuXG5cdC8vIGFkZCBjaGVja2JveGVzIHRoYXQgYXJlIHBlcnNpc3RlZCBpbiB0aGUgcXVlcnktc3RyaW5nXG5cdC8vIHdoZW4gZW5hYmxlZCwgdGhlIGlkIGlzIHNldCB0byBgdHJ1ZWAgYXMgYSBgUVVuaXQuY29uZmlnYCBwcm9wZXJ0eVxuXHR1cmxDb25maWc6IFtcblx0XHR7XG5cdFx0XHRpZDogXCJub2dsb2JhbHNcIixcblx0XHRcdGxhYmVsOiBcIkNoZWNrIGZvciBHbG9iYWxzXCIsXG5cdFx0XHR0b29sdGlwOiBcIkVuYWJsaW5nIHRoaXMgd2lsbCB0ZXN0IGlmIGFueSB0ZXN0IGludHJvZHVjZXMgbmV3IHByb3BlcnRpZXMgb24gdGhlIGB3aW5kb3dgIG9iamVjdC4gU3RvcmVkIGFzIHF1ZXJ5LXN0cmluZ3MuXCJcblx0XHR9LFxuXHRcdHtcblx0XHRcdGlkOiBcIm5vdHJ5Y2F0Y2hcIixcblx0XHRcdGxhYmVsOiBcIk5vIHRyeS1jYXRjaFwiLFxuXHRcdFx0dG9vbHRpcDogXCJFbmFibGluZyB0aGlzIHdpbGwgcnVuIHRlc3RzIG91dHNpZGUgb2YgYSB0cnktY2F0Y2ggYmxvY2suIE1ha2VzIGRlYnVnZ2luZyBleGNlcHRpb25zIGluIElFIHJlYXNvbmFibGUuIFN0b3JlZCBhcyBxdWVyeS1zdHJpbmdzLlwiXG5cdFx0fVxuXHRdLFxuXG5cdC8vIGxvZ2dpbmcgY2FsbGJhY2sgcXVldWVzXG5cdGJlZ2luOiBbXSxcblx0ZG9uZTogW10sXG5cdGxvZzogW10sXG5cdHRlc3RTdGFydDogW10sXG5cdHRlc3REb25lOiBbXSxcblx0bW9kdWxlU3RhcnQ6IFtdLFxuXHRtb2R1bGVEb25lOiBbXVxufTtcblxuLy8gSW5pdGlhbGl6ZSBtb3JlIFFVbml0LmNvbmZpZyBhbmQgUVVuaXQudXJsUGFyYW1zXG4oZnVuY3Rpb24oKSB7XG5cdHZhciBpLFxuXHRcdGxvY2F0aW9uID0gd2luZG93LmxvY2F0aW9uIHx8IHsgc2VhcmNoOiBcIlwiLCBwcm90b2NvbDogXCJmaWxlOlwiIH0sXG5cdFx0cGFyYW1zID0gbG9jYXRpb24uc2VhcmNoLnNsaWNlKCAxICkuc3BsaXQoIFwiJlwiICksXG5cdFx0bGVuZ3RoID0gcGFyYW1zLmxlbmd0aCxcblx0XHR1cmxQYXJhbXMgPSB7fSxcblx0XHRjdXJyZW50O1xuXG5cdGlmICggcGFyYW1zWyAwIF0gKSB7XG5cdFx0Zm9yICggaSA9IDA7IGkgPCBsZW5ndGg7IGkrKyApIHtcblx0XHRcdGN1cnJlbnQgPSBwYXJhbXNbIGkgXS5zcGxpdCggXCI9XCIgKTtcblx0XHRcdGN1cnJlbnRbIDAgXSA9IGRlY29kZVVSSUNvbXBvbmVudCggY3VycmVudFsgMCBdICk7XG5cdFx0XHQvLyBhbGxvdyBqdXN0IGEga2V5IHRvIHR1cm4gb24gYSBmbGFnLCBlLmcuLCB0ZXN0Lmh0bWw/bm9nbG9iYWxzXG5cdFx0XHRjdXJyZW50WyAxIF0gPSBjdXJyZW50WyAxIF0gPyBkZWNvZGVVUklDb21wb25lbnQoIGN1cnJlbnRbIDEgXSApIDogdHJ1ZTtcblx0XHRcdHVybFBhcmFtc1sgY3VycmVudFsgMCBdIF0gPSBjdXJyZW50WyAxIF07XG5cdFx0fVxuXHR9XG5cblx0UVVuaXQudXJsUGFyYW1zID0gdXJsUGFyYW1zO1xuXG5cdC8vIFN0cmluZyBzZWFyY2ggYW55d2hlcmUgaW4gbW9kdWxlTmFtZSt0ZXN0TmFtZVxuXHRjb25maWcuZmlsdGVyID0gdXJsUGFyYW1zLmZpbHRlcjtcblxuXHQvLyBFeGFjdCBtYXRjaCBvZiB0aGUgbW9kdWxlIG5hbWVcblx0Y29uZmlnLm1vZHVsZSA9IHVybFBhcmFtcy5tb2R1bGU7XG5cblx0Y29uZmlnLnRlc3ROdW1iZXIgPSBwYXJzZUludCggdXJsUGFyYW1zLnRlc3ROdW1iZXIsIDEwICkgfHwgbnVsbDtcblxuXHQvLyBGaWd1cmUgb3V0IGlmIHdlJ3JlIHJ1bm5pbmcgdGhlIHRlc3RzIGZyb20gYSBzZXJ2ZXIgb3Igbm90XG5cdFFVbml0LmlzTG9jYWwgPSBsb2NhdGlvbi5wcm90b2NvbCA9PT0gXCJmaWxlOlwiO1xufSgpKTtcblxuLy8gRXhwb3J0IGdsb2JhbCB2YXJpYWJsZXMsIHVubGVzcyBhbiAnZXhwb3J0cycgb2JqZWN0IGV4aXN0cyxcbi8vIGluIHRoYXQgY2FzZSB3ZSBhc3N1bWUgd2UncmUgaW4gQ29tbW9uSlMgKGRlYWx0IHdpdGggb24gdGhlIGJvdHRvbSBvZiB0aGUgc2NyaXB0KVxuaWYgKCB0eXBlb2YgZXhwb3J0cyA9PT0gXCJ1bmRlZmluZWRcIiApIHtcblx0ZXh0ZW5kKCB3aW5kb3csIFFVbml0ICk7XG5cblx0Ly8gRXhwb3NlIFFVbml0IG9iamVjdFxuXHR3aW5kb3cuUVVuaXQgPSBRVW5pdDtcbn1cblxuLy8gRXh0ZW5kIFFVbml0IG9iamVjdCxcbi8vIHRoZXNlIGFmdGVyIHNldCBoZXJlIGJlY2F1c2UgdGhleSBzaG91bGQgbm90IGJlIGV4cG9zZWQgYXMgZ2xvYmFsIGZ1bmN0aW9uc1xuZXh0ZW5kKCBRVW5pdCwge1xuXHRjb25maWc6IGNvbmZpZyxcblxuXHQvLyBJbml0aWFsaXplIHRoZSBjb25maWd1cmF0aW9uIG9wdGlvbnNcblx0aW5pdDogZnVuY3Rpb24oKSB7XG5cdFx0ZXh0ZW5kKCBjb25maWcsIHtcblx0XHRcdHN0YXRzOiB7IGFsbDogMCwgYmFkOiAwIH0sXG5cdFx0XHRtb2R1bGVTdGF0czogeyBhbGw6IDAsIGJhZDogMCB9LFxuXHRcdFx0c3RhcnRlZDogK25ldyBEYXRlKCksXG5cdFx0XHR1cGRhdGVSYXRlOiAxMDAwLFxuXHRcdFx0YmxvY2tpbmc6IGZhbHNlLFxuXHRcdFx0YXV0b3N0YXJ0OiB0cnVlLFxuXHRcdFx0YXV0b3J1bjogZmFsc2UsXG5cdFx0XHRmaWx0ZXI6IFwiXCIsXG5cdFx0XHRxdWV1ZTogW10sXG5cdFx0XHRzZW1hcGhvcmU6IDBcblx0XHR9KTtcblxuXHRcdHZhciB0ZXN0cywgYmFubmVyLCByZXN1bHQsXG5cdFx0XHRxdW5pdCA9IGlkKCBcInF1bml0XCIgKTtcblxuXHRcdGlmICggcXVuaXQgKSB7XG5cdFx0XHRxdW5pdC5pbm5lckhUTUwgPVxuXHRcdFx0XHRcIjxoMSBpZD0ncXVuaXQtaGVhZGVyJz5cIiArIGVzY2FwZUlubmVyVGV4dCggZG9jdW1lbnQudGl0bGUgKSArIFwiPC9oMT5cIiArXG5cdFx0XHRcdFwiPGgyIGlkPSdxdW5pdC1iYW5uZXInPjwvaDI+XCIgK1xuXHRcdFx0XHRcIjxkaXYgaWQ9J3F1bml0LXRlc3RydW5uZXItdG9vbGJhcic+PC9kaXY+XCIgK1xuXHRcdFx0XHRcIjxoMiBpZD0ncXVuaXQtdXNlckFnZW50Jz48L2gyPlwiICtcblx0XHRcdFx0XCI8b2wgaWQ9J3F1bml0LXRlc3RzJz48L29sPlwiO1xuXHRcdH1cblxuXHRcdHRlc3RzID0gaWQoIFwicXVuaXQtdGVzdHNcIiApO1xuXHRcdGJhbm5lciA9IGlkKCBcInF1bml0LWJhbm5lclwiICk7XG5cdFx0cmVzdWx0ID0gaWQoIFwicXVuaXQtdGVzdHJlc3VsdFwiICk7XG5cblx0XHRpZiAoIHRlc3RzICkge1xuXHRcdFx0dGVzdHMuaW5uZXJIVE1MID0gXCJcIjtcblx0XHR9XG5cblx0XHRpZiAoIGJhbm5lciApIHtcblx0XHRcdGJhbm5lci5jbGFzc05hbWUgPSBcIlwiO1xuXHRcdH1cblxuXHRcdGlmICggcmVzdWx0ICkge1xuXHRcdFx0cmVzdWx0LnBhcmVudE5vZGUucmVtb3ZlQ2hpbGQoIHJlc3VsdCApO1xuXHRcdH1cblxuXHRcdGlmICggdGVzdHMgKSB7XG5cdFx0XHRyZXN1bHQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCBcInBcIiApO1xuXHRcdFx0cmVzdWx0LmlkID0gXCJxdW5pdC10ZXN0cmVzdWx0XCI7XG5cdFx0XHRyZXN1bHQuY2xhc3NOYW1lID0gXCJyZXN1bHRcIjtcblx0XHRcdHRlc3RzLnBhcmVudE5vZGUuaW5zZXJ0QmVmb3JlKCByZXN1bHQsIHRlc3RzICk7XG5cdFx0XHRyZXN1bHQuaW5uZXJIVE1MID0gXCJSdW5uaW5nLi4uPGJyLz4mbmJzcDtcIjtcblx0XHR9XG5cdH0sXG5cblx0Ly8gUmVzZXRzIHRoZSB0ZXN0IHNldHVwLiBVc2VmdWwgZm9yIHRlc3RzIHRoYXQgbW9kaWZ5IHRoZSBET00uXG5cdC8vIElmIGpRdWVyeSBpcyBhdmFpbGFibGUsIHVzZXMgalF1ZXJ5J3MgaHRtbCgpLCBvdGhlcndpc2UganVzdCBpbm5lckhUTUwuXG5cdHJlc2V0OiBmdW5jdGlvbigpIHtcblx0XHR2YXIgZml4dHVyZTtcblxuXHRcdGlmICggd2luZG93LmpRdWVyeSApIHtcblx0XHRcdGpRdWVyeSggXCIjcXVuaXQtZml4dHVyZVwiICkuaHRtbCggY29uZmlnLmZpeHR1cmUgKTtcblx0XHR9IGVsc2Uge1xuXHRcdFx0Zml4dHVyZSA9IGlkKCBcInF1bml0LWZpeHR1cmVcIiApO1xuXHRcdFx0aWYgKCBmaXh0dXJlICkge1xuXHRcdFx0XHRmaXh0dXJlLmlubmVySFRNTCA9IGNvbmZpZy5maXh0dXJlO1xuXHRcdFx0fVxuXHRcdH1cblx0fSxcblxuXHQvLyBUcmlnZ2VyIGFuIGV2ZW50IG9uIGFuIGVsZW1lbnQuXG5cdC8vIEBleGFtcGxlIHRyaWdnZXJFdmVudCggZG9jdW1lbnQuYm9keSwgXCJjbGlja1wiICk7XG5cdHRyaWdnZXJFdmVudDogZnVuY3Rpb24oIGVsZW0sIHR5cGUsIGV2ZW50ICkge1xuXHRcdGlmICggZG9jdW1lbnQuY3JlYXRlRXZlbnQgKSB7XG5cdFx0XHRldmVudCA9IGRvY3VtZW50LmNyZWF0ZUV2ZW50KCBcIk1vdXNlRXZlbnRzXCIgKTtcblx0XHRcdGV2ZW50LmluaXRNb3VzZUV2ZW50KHR5cGUsIHRydWUsIHRydWUsIGVsZW0ub3duZXJEb2N1bWVudC5kZWZhdWx0Vmlldyxcblx0XHRcdFx0MCwgMCwgMCwgMCwgMCwgZmFsc2UsIGZhbHNlLCBmYWxzZSwgZmFsc2UsIDAsIG51bGwpO1xuXG5cdFx0XHRlbGVtLmRpc3BhdGNoRXZlbnQoIGV2ZW50ICk7XG5cdFx0fSBlbHNlIGlmICggZWxlbS5maXJlRXZlbnQgKSB7XG5cdFx0XHRlbGVtLmZpcmVFdmVudCggXCJvblwiICsgdHlwZSApO1xuXHRcdH1cblx0fSxcblxuXHQvLyBTYWZlIG9iamVjdCB0eXBlIGNoZWNraW5nXG5cdGlzOiBmdW5jdGlvbiggdHlwZSwgb2JqICkge1xuXHRcdHJldHVybiBRVW5pdC5vYmplY3RUeXBlKCBvYmogKSA9PSB0eXBlO1xuXHR9LFxuXG5cdG9iamVjdFR5cGU6IGZ1bmN0aW9uKCBvYmogKSB7XG5cdFx0aWYgKCB0eXBlb2Ygb2JqID09PSBcInVuZGVmaW5lZFwiICkge1xuXHRcdFx0XHRyZXR1cm4gXCJ1bmRlZmluZWRcIjtcblx0XHQvLyBjb25zaWRlcjogdHlwZW9mIG51bGwgPT09IG9iamVjdFxuXHRcdH1cblx0XHRpZiAoIG9iaiA9PT0gbnVsbCApIHtcblx0XHRcdFx0cmV0dXJuIFwibnVsbFwiO1xuXHRcdH1cblxuXHRcdHZhciB0eXBlID0gdG9TdHJpbmcuY2FsbCggb2JqICkubWF0Y2goL15cXFtvYmplY3RcXHMoLiopXFxdJC8pWzFdIHx8IFwiXCI7XG5cblx0XHRzd2l0Y2ggKCB0eXBlICkge1xuXHRcdFx0Y2FzZSBcIk51bWJlclwiOlxuXHRcdFx0XHRpZiAoIGlzTmFOKG9iaikgKSB7XG5cdFx0XHRcdFx0cmV0dXJuIFwibmFuXCI7XG5cdFx0XHRcdH1cblx0XHRcdFx0cmV0dXJuIFwibnVtYmVyXCI7XG5cdFx0XHRjYXNlIFwiU3RyaW5nXCI6XG5cdFx0XHRjYXNlIFwiQm9vbGVhblwiOlxuXHRcdFx0Y2FzZSBcIkFycmF5XCI6XG5cdFx0XHRjYXNlIFwiRGF0ZVwiOlxuXHRcdFx0Y2FzZSBcIlJlZ0V4cFwiOlxuXHRcdFx0Y2FzZSBcIkZ1bmN0aW9uXCI6XG5cdFx0XHRcdHJldHVybiB0eXBlLnRvTG93ZXJDYXNlKCk7XG5cdFx0fVxuXHRcdGlmICggdHlwZW9mIG9iaiA9PT0gXCJvYmplY3RcIiApIHtcblx0XHRcdHJldHVybiBcIm9iamVjdFwiO1xuXHRcdH1cblx0XHRyZXR1cm4gdW5kZWZpbmVkO1xuXHR9LFxuXG5cdHB1c2g6IGZ1bmN0aW9uKCByZXN1bHQsIGFjdHVhbCwgZXhwZWN0ZWQsIG1lc3NhZ2UgKSB7XG5cdFx0aWYgKCAhY29uZmlnLmN1cnJlbnQgKSB7XG5cdFx0XHR0aHJvdyBuZXcgRXJyb3IoIFwiYXNzZXJ0aW9uIG91dHNpZGUgdGVzdCBjb250ZXh0LCB3YXMgXCIgKyBzb3VyY2VGcm9tU3RhY2t0cmFjZSgpICk7XG5cdFx0fVxuXG5cdFx0dmFyIG91dHB1dCwgc291cmNlLFxuXHRcdFx0ZGV0YWlscyA9IHtcblx0XHRcdFx0cmVzdWx0OiByZXN1bHQsXG5cdFx0XHRcdG1lc3NhZ2U6IG1lc3NhZ2UsXG5cdFx0XHRcdGFjdHVhbDogYWN0dWFsLFxuXHRcdFx0XHRleHBlY3RlZDogZXhwZWN0ZWRcblx0XHRcdH07XG5cblx0XHRtZXNzYWdlID0gZXNjYXBlSW5uZXJUZXh0KCBtZXNzYWdlICkgfHwgKCByZXN1bHQgPyBcIm9rYXlcIiA6IFwiZmFpbGVkXCIgKTtcblx0XHRtZXNzYWdlID0gXCI8c3BhbiBjbGFzcz0ndGVzdC1tZXNzYWdlJz5cIiArIG1lc3NhZ2UgKyBcIjwvc3Bhbj5cIjtcblx0XHRvdXRwdXQgPSBtZXNzYWdlO1xuXG5cdFx0aWYgKCAhcmVzdWx0ICkge1xuXHRcdFx0ZXhwZWN0ZWQgPSBlc2NhcGVJbm5lclRleHQoIFFVbml0LmpzRHVtcC5wYXJzZShleHBlY3RlZCkgKTtcblx0XHRcdGFjdHVhbCA9IGVzY2FwZUlubmVyVGV4dCggUVVuaXQuanNEdW1wLnBhcnNlKGFjdHVhbCkgKTtcblx0XHRcdG91dHB1dCArPSBcIjx0YWJsZT48dHIgY2xhc3M9J3Rlc3QtZXhwZWN0ZWQnPjx0aD5FeHBlY3RlZDogPC90aD48dGQ+PHByZT5cIiArIGV4cGVjdGVkICsgXCI8L3ByZT48L3RkPjwvdHI+XCI7XG5cblx0XHRcdGlmICggYWN0dWFsICE9IGV4cGVjdGVkICkge1xuXHRcdFx0XHRvdXRwdXQgKz0gXCI8dHIgY2xhc3M9J3Rlc3QtYWN0dWFsJz48dGg+UmVzdWx0OiA8L3RoPjx0ZD48cHJlPlwiICsgYWN0dWFsICsgXCI8L3ByZT48L3RkPjwvdHI+XCI7XG5cdFx0XHRcdG91dHB1dCArPSBcIjx0ciBjbGFzcz0ndGVzdC1kaWZmJz48dGg+RGlmZjogPC90aD48dGQ+PHByZT5cIiArIFFVbml0LmRpZmYoIGV4cGVjdGVkLCBhY3R1YWwgKSArIFwiPC9wcmU+PC90ZD48L3RyPlwiO1xuXHRcdFx0fVxuXG5cdFx0XHRzb3VyY2UgPSBzb3VyY2VGcm9tU3RhY2t0cmFjZSgpO1xuXG5cdFx0XHRpZiAoIHNvdXJjZSApIHtcblx0XHRcdFx0ZGV0YWlscy5zb3VyY2UgPSBzb3VyY2U7XG5cdFx0XHRcdG91dHB1dCArPSBcIjx0ciBjbGFzcz0ndGVzdC1zb3VyY2UnPjx0aD5Tb3VyY2U6IDwvdGg+PHRkPjxwcmU+XCIgKyBlc2NhcGVJbm5lclRleHQoIHNvdXJjZSApICsgXCI8L3ByZT48L3RkPjwvdHI+XCI7XG5cdFx0XHR9XG5cblx0XHRcdG91dHB1dCArPSBcIjwvdGFibGU+XCI7XG5cdFx0fVxuXG5cdFx0cnVuTG9nZ2luZ0NhbGxiYWNrcyggXCJsb2dcIiwgUVVuaXQsIGRldGFpbHMgKTtcblxuXHRcdGNvbmZpZy5jdXJyZW50LmFzc2VydGlvbnMucHVzaCh7XG5cdFx0XHRyZXN1bHQ6ICEhcmVzdWx0LFxuXHRcdFx0bWVzc2FnZTogb3V0cHV0XG5cdFx0fSk7XG5cdH0sXG5cblx0cHVzaEZhaWx1cmU6IGZ1bmN0aW9uKCBtZXNzYWdlLCBzb3VyY2UsIGFjdHVhbCApIHtcblx0XHRpZiAoICFjb25maWcuY3VycmVudCApIHtcblx0XHRcdHRocm93IG5ldyBFcnJvciggXCJwdXNoRmFpbHVyZSgpIGFzc2VydGlvbiBvdXRzaWRlIHRlc3QgY29udGV4dCwgd2FzIFwiICsgc291cmNlRnJvbVN0YWNrdHJhY2UoMikgKTtcblx0XHR9XG5cblx0XHR2YXIgb3V0cHV0LFxuXHRcdFx0ZGV0YWlscyA9IHtcblx0XHRcdFx0cmVzdWx0OiBmYWxzZSxcblx0XHRcdFx0bWVzc2FnZTogbWVzc2FnZVxuXHRcdFx0fTtcblxuXHRcdG1lc3NhZ2UgPSBlc2NhcGVJbm5lclRleHQoIG1lc3NhZ2UgKSB8fCBcImVycm9yXCI7XG5cdFx0bWVzc2FnZSA9IFwiPHNwYW4gY2xhc3M9J3Rlc3QtbWVzc2FnZSc+XCIgKyBtZXNzYWdlICsgXCI8L3NwYW4+XCI7XG5cdFx0b3V0cHV0ID0gbWVzc2FnZTtcblxuXHRcdG91dHB1dCArPSBcIjx0YWJsZT5cIjtcblxuXHRcdGlmICggYWN0dWFsICkge1xuXHRcdFx0b3V0cHV0ICs9IFwiPHRyIGNsYXNzPSd0ZXN0LWFjdHVhbCc+PHRoPlJlc3VsdDogPC90aD48dGQ+PHByZT5cIiArIGVzY2FwZUlubmVyVGV4dCggYWN0dWFsICkgKyBcIjwvcHJlPjwvdGQ+PC90cj5cIjtcblx0XHR9XG5cblx0XHRpZiAoIHNvdXJjZSApIHtcblx0XHRcdGRldGFpbHMuc291cmNlID0gc291cmNlO1xuXHRcdFx0b3V0cHV0ICs9IFwiPHRyIGNsYXNzPSd0ZXN0LXNvdXJjZSc+PHRoPlNvdXJjZTogPC90aD48dGQ+PHByZT5cIiArIGVzY2FwZUlubmVyVGV4dCggc291cmNlICkgKyBcIjwvcHJlPjwvdGQ+PC90cj5cIjtcblx0XHR9XG5cblx0XHRvdXRwdXQgKz0gXCI8L3RhYmxlPlwiO1xuXG5cdFx0cnVuTG9nZ2luZ0NhbGxiYWNrcyggXCJsb2dcIiwgUVVuaXQsIGRldGFpbHMgKTtcblxuXHRcdGNvbmZpZy5jdXJyZW50LmFzc2VydGlvbnMucHVzaCh7XG5cdFx0XHRyZXN1bHQ6IGZhbHNlLFxuXHRcdFx0bWVzc2FnZTogb3V0cHV0XG5cdFx0fSk7XG5cdH0sXG5cblx0dXJsOiBmdW5jdGlvbiggcGFyYW1zICkge1xuXHRcdHBhcmFtcyA9IGV4dGVuZCggZXh0ZW5kKCB7fSwgUVVuaXQudXJsUGFyYW1zICksIHBhcmFtcyApO1xuXHRcdHZhciBrZXksXG5cdFx0XHRxdWVyeXN0cmluZyA9IFwiP1wiO1xuXG5cdFx0Zm9yICgga2V5IGluIHBhcmFtcyApIHtcblx0XHRcdGlmICggIWhhc093bi5jYWxsKCBwYXJhbXMsIGtleSApICkge1xuXHRcdFx0XHRjb250aW51ZTtcblx0XHRcdH1cblx0XHRcdHF1ZXJ5c3RyaW5nICs9IGVuY29kZVVSSUNvbXBvbmVudCgga2V5ICkgKyBcIj1cIiArXG5cdFx0XHRcdGVuY29kZVVSSUNvbXBvbmVudCggcGFyYW1zWyBrZXkgXSApICsgXCImXCI7XG5cdFx0fVxuXHRcdHJldHVybiB3aW5kb3cubG9jYXRpb24ucGF0aG5hbWUgKyBxdWVyeXN0cmluZy5zbGljZSggMCwgLTEgKTtcblx0fSxcblxuXHRleHRlbmQ6IGV4dGVuZCxcblx0aWQ6IGlkLFxuXHRhZGRFdmVudDogYWRkRXZlbnRcblx0Ly8gbG9hZCwgZXF1aXYsIGpzRHVtcCwgZGlmZjogQXR0YWNoZWQgbGF0ZXJcbn0pO1xuXG4vKipcbiAqIEBkZXByZWNhdGVkOiBDcmVhdGVkIGZvciBiYWNrd2FyZHMgY29tcGF0aWJpbGl0eSB3aXRoIHRlc3QgcnVubmVyIHRoYXQgc2V0IHRoZSBob29rIGZ1bmN0aW9uXG4gKiBpbnRvIFFVbml0Lntob29rfSwgaW5zdGVhZCBvZiBpbnZva2luZyBpdCBhbmQgcGFzc2luZyB0aGUgaG9vayBmdW5jdGlvbi5cbiAqIFFVbml0LmNvbnN0cnVjdG9yIGlzIHNldCB0byB0aGUgZW1wdHkgRigpIGFib3ZlIHNvIHRoYXQgd2UgY2FuIGFkZCB0byBpdCdzIHByb3RvdHlwZSBoZXJlLlxuICogRG9pbmcgdGhpcyBhbGxvd3MgdXMgdG8gdGVsbCBpZiB0aGUgZm9sbG93aW5nIG1ldGhvZHMgaGF2ZSBiZWVuIG92ZXJ3cml0dGVuIG9uIHRoZSBhY3R1YWxcbiAqIFFVbml0IG9iamVjdC5cbiAqL1xuZXh0ZW5kKCBRVW5pdC5jb25zdHJ1Y3Rvci5wcm90b3R5cGUsIHtcblxuXHQvLyBMb2dnaW5nIGNhbGxiYWNrczsgYWxsIHJlY2VpdmUgYSBzaW5nbGUgYXJndW1lbnQgd2l0aCB0aGUgbGlzdGVkIHByb3BlcnRpZXNcblx0Ly8gcnVuIHRlc3QvbG9ncy5odG1sIGZvciBhbnkgcmVsYXRlZCBjaGFuZ2VzXG5cdGJlZ2luOiByZWdpc3RlckxvZ2dpbmdDYWxsYmFjayggXCJiZWdpblwiICksXG5cblx0Ly8gZG9uZTogeyBmYWlsZWQsIHBhc3NlZCwgdG90YWwsIHJ1bnRpbWUgfVxuXHRkb25lOiByZWdpc3RlckxvZ2dpbmdDYWxsYmFjayggXCJkb25lXCIgKSxcblxuXHQvLyBsb2c6IHsgcmVzdWx0LCBhY3R1YWwsIGV4cGVjdGVkLCBtZXNzYWdlIH1cblx0bG9nOiByZWdpc3RlckxvZ2dpbmdDYWxsYmFjayggXCJsb2dcIiApLFxuXG5cdC8vIHRlc3RTdGFydDogeyBuYW1lIH1cblx0dGVzdFN0YXJ0OiByZWdpc3RlckxvZ2dpbmdDYWxsYmFjayggXCJ0ZXN0U3RhcnRcIiApLFxuXG5cdC8vIHRlc3REb25lOiB7IG5hbWUsIGZhaWxlZCwgcGFzc2VkLCB0b3RhbCB9XG5cdHRlc3REb25lOiByZWdpc3RlckxvZ2dpbmdDYWxsYmFjayggXCJ0ZXN0RG9uZVwiICksXG5cblx0Ly8gbW9kdWxlU3RhcnQ6IHsgbmFtZSB9XG5cdG1vZHVsZVN0YXJ0OiByZWdpc3RlckxvZ2dpbmdDYWxsYmFjayggXCJtb2R1bGVTdGFydFwiICksXG5cblx0Ly8gbW9kdWxlRG9uZTogeyBuYW1lLCBmYWlsZWQsIHBhc3NlZCwgdG90YWwgfVxuXHRtb2R1bGVEb25lOiByZWdpc3RlckxvZ2dpbmdDYWxsYmFjayggXCJtb2R1bGVEb25lXCIgKVxufSk7XG5cbmlmICggdHlwZW9mIGRvY3VtZW50ID09PSBcInVuZGVmaW5lZFwiIHx8IGRvY3VtZW50LnJlYWR5U3RhdGUgPT09IFwiY29tcGxldGVcIiApIHtcblx0Y29uZmlnLmF1dG9ydW4gPSB0cnVlO1xufVxuXG5RVW5pdC5sb2FkID0gZnVuY3Rpb24oKSB7XG5cdHJ1bkxvZ2dpbmdDYWxsYmFja3MoIFwiYmVnaW5cIiwgUVVuaXQsIHt9ICk7XG5cblx0Ly8gSW5pdGlhbGl6ZSB0aGUgY29uZmlnLCBzYXZpbmcgdGhlIGV4ZWN1dGlvbiBxdWV1ZVxuXHR2YXIgYmFubmVyLCBmaWx0ZXIsIGksIGxhYmVsLCBsZW4sIG1haW4sIG9sLCB0b29sYmFyLCB1c2VyQWdlbnQsIHZhbCwgdXJsQ29uZmlnQ2hlY2tib3hlcyxcblx0XHR1cmxDb25maWdIdG1sID0gXCJcIixcblx0XHRvbGRjb25maWcgPSBleHRlbmQoIHt9LCBjb25maWcgKTtcblxuXHRRVW5pdC5pbml0KCk7XG5cdGV4dGVuZChjb25maWcsIG9sZGNvbmZpZyk7XG5cblx0Y29uZmlnLmJsb2NraW5nID0gZmFsc2U7XG5cblx0bGVuID0gY29uZmlnLnVybENvbmZpZy5sZW5ndGg7XG5cblx0Zm9yICggaSA9IDA7IGkgPCBsZW47IGkrKyApIHtcblx0XHR2YWwgPSBjb25maWcudXJsQ29uZmlnW2ldO1xuXHRcdGlmICggdHlwZW9mIHZhbCA9PT0gXCJzdHJpbmdcIiApIHtcblx0XHRcdHZhbCA9IHtcblx0XHRcdFx0aWQ6IHZhbCxcblx0XHRcdFx0bGFiZWw6IHZhbCxcblx0XHRcdFx0dG9vbHRpcDogXCJbbm8gdG9vbHRpcCBhdmFpbGFibGVdXCJcblx0XHRcdH07XG5cdFx0fVxuXHRcdGNvbmZpZ1sgdmFsLmlkIF0gPSBRVW5pdC51cmxQYXJhbXNbIHZhbC5pZCBdO1xuXHRcdHVybENvbmZpZ0h0bWwgKz0gXCI8aW5wdXQgaWQ9J3F1bml0LXVybGNvbmZpZy1cIiArIHZhbC5pZCArIFwiJyBuYW1lPSdcIiArIHZhbC5pZCArIFwiJyB0eXBlPSdjaGVja2JveCdcIiArICggY29uZmlnWyB2YWwuaWQgXSA/IFwiIGNoZWNrZWQ9J2NoZWNrZWQnXCIgOiBcIlwiICkgKyBcIiB0aXRsZT0nXCIgKyB2YWwudG9vbHRpcCArIFwiJz48bGFiZWwgZm9yPSdxdW5pdC11cmxjb25maWctXCIgKyB2YWwuaWQgKyBcIicgdGl0bGU9J1wiICsgdmFsLnRvb2x0aXAgKyBcIic+XCIgKyB2YWwubGFiZWwgKyBcIjwvbGFiZWw+XCI7XG5cdH1cblxuXHQvLyBgdXNlckFnZW50YCBpbml0aWFsaXplZCBhdCB0b3Agb2Ygc2NvcGVcblx0dXNlckFnZW50ID0gaWQoIFwicXVuaXQtdXNlckFnZW50XCIgKTtcblx0aWYgKCB1c2VyQWdlbnQgKSB7XG5cdFx0dXNlckFnZW50LmlubmVySFRNTCA9IG5hdmlnYXRvci51c2VyQWdlbnQ7XG5cdH1cblxuXHQvLyBgYmFubmVyYCBpbml0aWFsaXplZCBhdCB0b3Agb2Ygc2NvcGVcblx0YmFubmVyID0gaWQoIFwicXVuaXQtaGVhZGVyXCIgKTtcblx0aWYgKCBiYW5uZXIgKSB7XG5cdFx0YmFubmVyLmlubmVySFRNTCA9IFwiPGEgaHJlZj0nXCIgKyBRVW5pdC51cmwoeyBmaWx0ZXI6IHVuZGVmaW5lZCwgbW9kdWxlOiB1bmRlZmluZWQsIHRlc3ROdW1iZXI6IHVuZGVmaW5lZCB9KSArIFwiJz5cIiArIGJhbm5lci5pbm5lckhUTUwgKyBcIjwvYT4gXCI7XG5cdH1cblxuXHQvLyBgdG9vbGJhcmAgaW5pdGlhbGl6ZWQgYXQgdG9wIG9mIHNjb3BlXG5cdHRvb2xiYXIgPSBpZCggXCJxdW5pdC10ZXN0cnVubmVyLXRvb2xiYXJcIiApO1xuXHRpZiAoIHRvb2xiYXIgKSB7XG5cdFx0Ly8gYGZpbHRlcmAgaW5pdGlhbGl6ZWQgYXQgdG9wIG9mIHNjb3BlXG5cdFx0ZmlsdGVyID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCggXCJpbnB1dFwiICk7XG5cdFx0ZmlsdGVyLnR5cGUgPSBcImNoZWNrYm94XCI7XG5cdFx0ZmlsdGVyLmlkID0gXCJxdW5pdC1maWx0ZXItcGFzc1wiO1xuXG5cdFx0YWRkRXZlbnQoIGZpbHRlciwgXCJjbGlja1wiLCBmdW5jdGlvbigpIHtcblx0XHRcdHZhciB0bXAsXG5cdFx0XHRcdG9sID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoIFwicXVuaXQtdGVzdHNcIiApO1xuXG5cdFx0XHRpZiAoIGZpbHRlci5jaGVja2VkICkge1xuXHRcdFx0XHRvbC5jbGFzc05hbWUgPSBvbC5jbGFzc05hbWUgKyBcIiBoaWRlcGFzc1wiO1xuXHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0dG1wID0gXCIgXCIgKyBvbC5jbGFzc05hbWUucmVwbGFjZSggL1tcXG5cXHRcXHJdL2csIFwiIFwiICkgKyBcIiBcIjtcblx0XHRcdFx0b2wuY2xhc3NOYW1lID0gdG1wLnJlcGxhY2UoIC8gaGlkZXBhc3MgLywgXCIgXCIgKTtcblx0XHRcdH1cblx0XHRcdGlmICggZGVmaW5lZC5zZXNzaW9uU3RvcmFnZSApIHtcblx0XHRcdFx0aWYgKGZpbHRlci5jaGVja2VkKSB7XG5cdFx0XHRcdFx0c2Vzc2lvblN0b3JhZ2Uuc2V0SXRlbSggXCJxdW5pdC1maWx0ZXItcGFzc2VkLXRlc3RzXCIsIFwidHJ1ZVwiICk7XG5cdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0c2Vzc2lvblN0b3JhZ2UucmVtb3ZlSXRlbSggXCJxdW5pdC1maWx0ZXItcGFzc2VkLXRlc3RzXCIgKTtcblx0XHRcdFx0fVxuXHRcdFx0fVxuXHRcdH0pO1xuXG5cdFx0aWYgKCBjb25maWcuaGlkZXBhc3NlZCB8fCBkZWZpbmVkLnNlc3Npb25TdG9yYWdlICYmIHNlc3Npb25TdG9yYWdlLmdldEl0ZW0oIFwicXVuaXQtZmlsdGVyLXBhc3NlZC10ZXN0c1wiICkgKSB7XG5cdFx0XHRmaWx0ZXIuY2hlY2tlZCA9IHRydWU7XG5cdFx0XHQvLyBgb2xgIGluaXRpYWxpemVkIGF0IHRvcCBvZiBzY29wZVxuXHRcdFx0b2wgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCggXCJxdW5pdC10ZXN0c1wiICk7XG5cdFx0XHRvbC5jbGFzc05hbWUgPSBvbC5jbGFzc05hbWUgKyBcIiBoaWRlcGFzc1wiO1xuXHRcdH1cblx0XHR0b29sYmFyLmFwcGVuZENoaWxkKCBmaWx0ZXIgKTtcblxuXHRcdC8vIGBsYWJlbGAgaW5pdGlhbGl6ZWQgYXQgdG9wIG9mIHNjb3BlXG5cdFx0bGFiZWwgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCBcImxhYmVsXCIgKTtcblx0XHRsYWJlbC5zZXRBdHRyaWJ1dGUoIFwiZm9yXCIsIFwicXVuaXQtZmlsdGVyLXBhc3NcIiApO1xuXHRcdGxhYmVsLnNldEF0dHJpYnV0ZSggXCJ0aXRsZVwiLCBcIk9ubHkgc2hvdyB0ZXN0cyBhbmQgYXNzZXJ0b25zIHRoYXQgZmFpbC4gU3RvcmVkIGluIHNlc3Npb25TdG9yYWdlLlwiICk7XG5cdFx0bGFiZWwuaW5uZXJIVE1MID0gXCJIaWRlIHBhc3NlZCB0ZXN0c1wiO1xuXHRcdHRvb2xiYXIuYXBwZW5kQ2hpbGQoIGxhYmVsICk7XG5cblx0XHR1cmxDb25maWdDaGVja2JveGVzID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCggJ3NwYW4nICk7XG5cdFx0dXJsQ29uZmlnQ2hlY2tib3hlcy5pbm5lckhUTUwgPSB1cmxDb25maWdIdG1sO1xuXHRcdGFkZEV2ZW50KCB1cmxDb25maWdDaGVja2JveGVzLCBcImNoYW5nZVwiLCBmdW5jdGlvbiggZXZlbnQgKSB7XG5cdFx0XHR2YXIgcGFyYW1zID0ge307XG5cdFx0XHRwYXJhbXNbIGV2ZW50LnRhcmdldC5uYW1lIF0gPSBldmVudC50YXJnZXQuY2hlY2tlZCA/IHRydWUgOiB1bmRlZmluZWQ7XG5cdFx0XHR3aW5kb3cubG9jYXRpb24gPSBRVW5pdC51cmwoIHBhcmFtcyApO1xuXHRcdH0pO1xuXHRcdHRvb2xiYXIuYXBwZW5kQ2hpbGQoIHVybENvbmZpZ0NoZWNrYm94ZXMgKTtcblx0fVxuXG5cdC8vIGBtYWluYCBpbml0aWFsaXplZCBhdCB0b3Agb2Ygc2NvcGVcblx0bWFpbiA9IGlkKCBcInF1bml0LWZpeHR1cmVcIiApO1xuXHRpZiAoIG1haW4gKSB7XG5cdFx0Y29uZmlnLmZpeHR1cmUgPSBtYWluLmlubmVySFRNTDtcblx0fVxuXG5cdGlmICggY29uZmlnLmF1dG9zdGFydCApIHtcblx0XHRRVW5pdC5zdGFydCgpO1xuXHR9XG59O1xuXG5hZGRFdmVudCggd2luZG93LCBcImxvYWRcIiwgUVVuaXQubG9hZCApO1xuXG4vLyBgb25FcnJvckZuUHJldmAgaW5pdGlhbGl6ZWQgYXQgdG9wIG9mIHNjb3BlXG4vLyBQcmVzZXJ2ZSBvdGhlciBoYW5kbGVyc1xub25FcnJvckZuUHJldiA9IHdpbmRvdy5vbmVycm9yO1xuXG4vLyBDb3ZlciB1bmNhdWdodCBleGNlcHRpb25zXG4vLyBSZXR1cm5pbmcgdHJ1ZSB3aWxsIHN1cnByZXNzIHRoZSBkZWZhdWx0IGJyb3dzZXIgaGFuZGxlcixcbi8vIHJldHVybmluZyBmYWxzZSB3aWxsIGxldCBpdCBydW4uXG53aW5kb3cub25lcnJvciA9IGZ1bmN0aW9uICggZXJyb3IsIGZpbGVQYXRoLCBsaW5lck5yICkge1xuXHR2YXIgcmV0ID0gZmFsc2U7XG5cdGlmICggb25FcnJvckZuUHJldiApIHtcblx0XHRyZXQgPSBvbkVycm9yRm5QcmV2KCBlcnJvciwgZmlsZVBhdGgsIGxpbmVyTnIgKTtcblx0fVxuXG5cdC8vIFRyZWF0IHJldHVybiB2YWx1ZSBhcyB3aW5kb3cub25lcnJvciBpdHNlbGYgZG9lcyxcblx0Ly8gT25seSBkbyBvdXIgaGFuZGxpbmcgaWYgbm90IHN1cnByZXNzZWQuXG5cdGlmICggcmV0ICE9PSB0cnVlICkge1xuXHRcdGlmICggUVVuaXQuY29uZmlnLmN1cnJlbnQgKSB7XG5cdFx0XHRpZiAoIFFVbml0LmNvbmZpZy5jdXJyZW50Lmlnbm9yZUdsb2JhbEVycm9ycyApIHtcblx0XHRcdFx0cmV0dXJuIHRydWU7XG5cdFx0XHR9XG5cdFx0XHRRVW5pdC5wdXNoRmFpbHVyZSggZXJyb3IsIGZpbGVQYXRoICsgXCI6XCIgKyBsaW5lck5yICk7XG5cdFx0fSBlbHNlIHtcblx0XHRcdFFVbml0LnRlc3QoIFwiZ2xvYmFsIGZhaWx1cmVcIiwgZnVuY3Rpb24oKSB7XG5cdFx0XHRcdFFVbml0LnB1c2hGYWlsdXJlKCBlcnJvciwgZmlsZVBhdGggKyBcIjpcIiArIGxpbmVyTnIgKTtcblx0XHRcdH0pO1xuXHRcdH1cblx0XHRyZXR1cm4gZmFsc2U7XG5cdH1cblxuXHRyZXR1cm4gcmV0O1xufTtcblxuZnVuY3Rpb24gZG9uZSgpIHtcblx0Y29uZmlnLmF1dG9ydW4gPSB0cnVlO1xuXG5cdC8vIExvZyB0aGUgbGFzdCBtb2R1bGUgcmVzdWx0c1xuXHRpZiAoIGNvbmZpZy5jdXJyZW50TW9kdWxlICkge1xuXHRcdHJ1bkxvZ2dpbmdDYWxsYmFja3MoIFwibW9kdWxlRG9uZVwiLCBRVW5pdCwge1xuXHRcdFx0bmFtZTogY29uZmlnLmN1cnJlbnRNb2R1bGUsXG5cdFx0XHRmYWlsZWQ6IGNvbmZpZy5tb2R1bGVTdGF0cy5iYWQsXG5cdFx0XHRwYXNzZWQ6IGNvbmZpZy5tb2R1bGVTdGF0cy5hbGwgLSBjb25maWcubW9kdWxlU3RhdHMuYmFkLFxuXHRcdFx0dG90YWw6IGNvbmZpZy5tb2R1bGVTdGF0cy5hbGxcblx0XHR9KTtcblx0fVxuXG5cdHZhciBpLCBrZXksXG5cdFx0YmFubmVyID0gaWQoIFwicXVuaXQtYmFubmVyXCIgKSxcblx0XHR0ZXN0cyA9IGlkKCBcInF1bml0LXRlc3RzXCIgKSxcblx0XHRydW50aW1lID0gK25ldyBEYXRlKCkgLSBjb25maWcuc3RhcnRlZCxcblx0XHRwYXNzZWQgPSBjb25maWcuc3RhdHMuYWxsIC0gY29uZmlnLnN0YXRzLmJhZCxcblx0XHRodG1sID0gW1xuXHRcdFx0XCJUZXN0cyBjb21wbGV0ZWQgaW4gXCIsXG5cdFx0XHRydW50aW1lLFxuXHRcdFx0XCIgbWlsbGlzZWNvbmRzLjxici8+XCIsXG5cdFx0XHRcIjxzcGFuIGNsYXNzPSdwYXNzZWQnPlwiLFxuXHRcdFx0cGFzc2VkLFxuXHRcdFx0XCI8L3NwYW4+IHRlc3RzIG9mIDxzcGFuIGNsYXNzPSd0b3RhbCc+XCIsXG5cdFx0XHRjb25maWcuc3RhdHMuYWxsLFxuXHRcdFx0XCI8L3NwYW4+IHBhc3NlZCwgPHNwYW4gY2xhc3M9J2ZhaWxlZCc+XCIsXG5cdFx0XHRjb25maWcuc3RhdHMuYmFkLFxuXHRcdFx0XCI8L3NwYW4+IGZhaWxlZC5cIlxuXHRcdF0uam9pbiggXCJcIiApO1xuXG5cdGlmICggYmFubmVyICkge1xuXHRcdGJhbm5lci5jbGFzc05hbWUgPSAoIGNvbmZpZy5zdGF0cy5iYWQgPyBcInF1bml0LWZhaWxcIiA6IFwicXVuaXQtcGFzc1wiICk7XG5cdH1cblxuXHRpZiAoIHRlc3RzICkge1xuXHRcdGlkKCBcInF1bml0LXRlc3RyZXN1bHRcIiApLmlubmVySFRNTCA9IGh0bWw7XG5cdH1cblxuXHRpZiAoIGNvbmZpZy5hbHRlcnRpdGxlICYmIHR5cGVvZiBkb2N1bWVudCAhPT0gXCJ1bmRlZmluZWRcIiAmJiBkb2N1bWVudC50aXRsZSApIHtcblx0XHQvLyBzaG93IOKcliBmb3IgZ29vZCwg4pyUIGZvciBiYWQgc3VpdGUgcmVzdWx0IGluIHRpdGxlXG5cdFx0Ly8gdXNlIGVzY2FwZSBzZXF1ZW5jZXMgaW4gY2FzZSBmaWxlIGdldHMgbG9hZGVkIHdpdGggbm9uLXV0Zi04LWNoYXJzZXRcblx0XHRkb2N1bWVudC50aXRsZSA9IFtcblx0XHRcdCggY29uZmlnLnN0YXRzLmJhZCA/IFwiXFx1MjcxNlwiIDogXCJcXHUyNzE0XCIgKSxcblx0XHRcdGRvY3VtZW50LnRpdGxlLnJlcGxhY2UoIC9eW1xcdTI3MTRcXHUyNzE2XSAvaSwgXCJcIiApXG5cdFx0XS5qb2luKCBcIiBcIiApO1xuXHR9XG5cblx0Ly8gY2xlYXIgb3duIHNlc3Npb25TdG9yYWdlIGl0ZW1zIGlmIGFsbCB0ZXN0cyBwYXNzZWRcblx0aWYgKCBjb25maWcucmVvcmRlciAmJiBkZWZpbmVkLnNlc3Npb25TdG9yYWdlICYmIGNvbmZpZy5zdGF0cy5iYWQgPT09IDAgKSB7XG5cdFx0Ly8gYGtleWAgJiBgaWAgaW5pdGlhbGl6ZWQgYXQgdG9wIG9mIHNjb3BlXG5cdFx0Zm9yICggaSA9IDA7IGkgPCBzZXNzaW9uU3RvcmFnZS5sZW5ndGg7IGkrKyApIHtcblx0XHRcdGtleSA9IHNlc3Npb25TdG9yYWdlLmtleSggaSsrICk7XG5cdFx0XHRpZiAoIGtleS5pbmRleE9mKCBcInF1bml0LXRlc3QtXCIgKSA9PT0gMCApIHtcblx0XHRcdFx0c2Vzc2lvblN0b3JhZ2UucmVtb3ZlSXRlbSgga2V5ICk7XG5cdFx0XHR9XG5cdFx0fVxuXHR9XG5cblx0cnVuTG9nZ2luZ0NhbGxiYWNrcyggXCJkb25lXCIsIFFVbml0LCB7XG5cdFx0ZmFpbGVkOiBjb25maWcuc3RhdHMuYmFkLFxuXHRcdHBhc3NlZDogcGFzc2VkLFxuXHRcdHRvdGFsOiBjb25maWcuc3RhdHMuYWxsLFxuXHRcdHJ1bnRpbWU6IHJ1bnRpbWVcblx0fSk7XG59XG5cbi8qKiBAcmV0dXJuIEJvb2xlYW46IHRydWUgaWYgdGhpcyB0ZXN0IHNob3VsZCBiZSByYW4gKi9cbmZ1bmN0aW9uIHZhbGlkVGVzdCggdGVzdCApIHtcblx0dmFyIGluY2x1ZGUsXG5cdFx0ZmlsdGVyID0gY29uZmlnLmZpbHRlciAmJiBjb25maWcuZmlsdGVyLnRvTG93ZXJDYXNlKCksXG5cdFx0bW9kdWxlID0gY29uZmlnLm1vZHVsZSAmJiBjb25maWcubW9kdWxlLnRvTG93ZXJDYXNlKCksXG5cdFx0ZnVsbE5hbWUgPSAodGVzdC5tb2R1bGUgKyBcIjogXCIgKyB0ZXN0LnRlc3ROYW1lKS50b0xvd2VyQ2FzZSgpO1xuXG5cdGlmICggY29uZmlnLnRlc3ROdW1iZXIgKSB7XG5cdFx0cmV0dXJuIHRlc3QudGVzdE51bWJlciA9PT0gY29uZmlnLnRlc3ROdW1iZXI7XG5cdH1cblxuXHRpZiAoIG1vZHVsZSAmJiAoICF0ZXN0Lm1vZHVsZSB8fCB0ZXN0Lm1vZHVsZS50b0xvd2VyQ2FzZSgpICE9PSBtb2R1bGUgKSApIHtcblx0XHRyZXR1cm4gZmFsc2U7XG5cdH1cblxuXHRpZiAoICFmaWx0ZXIgKSB7XG5cdFx0cmV0dXJuIHRydWU7XG5cdH1cblxuXHRpbmNsdWRlID0gZmlsdGVyLmNoYXJBdCggMCApICE9PSBcIiFcIjtcblx0aWYgKCAhaW5jbHVkZSApIHtcblx0XHRmaWx0ZXIgPSBmaWx0ZXIuc2xpY2UoIDEgKTtcblx0fVxuXG5cdC8vIElmIHRoZSBmaWx0ZXIgbWF0Y2hlcywgd2UgbmVlZCB0byBob25vdXIgaW5jbHVkZVxuXHRpZiAoIGZ1bGxOYW1lLmluZGV4T2YoIGZpbHRlciApICE9PSAtMSApIHtcblx0XHRyZXR1cm4gaW5jbHVkZTtcblx0fVxuXG5cdC8vIE90aGVyd2lzZSwgZG8gdGhlIG9wcG9zaXRlXG5cdHJldHVybiAhaW5jbHVkZTtcbn1cblxuLy8gc28gZmFyIHN1cHBvcnRzIG9ubHkgRmlyZWZveCwgQ2hyb21lIGFuZCBPcGVyYSAoYnVnZ3kpLCBTYWZhcmkgKGZvciByZWFsIGV4Y2VwdGlvbnMpXG4vLyBMYXRlciBTYWZhcmkgYW5kIElFMTAgYXJlIHN1cHBvc2VkIHRvIHN1cHBvcnQgZXJyb3Iuc3RhY2sgYXMgd2VsbFxuLy8gU2VlIGFsc28gaHR0cHM6Ly9kZXZlbG9wZXIubW96aWxsYS5vcmcvZW4vSmF2YVNjcmlwdC9SZWZlcmVuY2UvR2xvYmFsX09iamVjdHMvRXJyb3IvU3RhY2tcbmZ1bmN0aW9uIGV4dHJhY3RTdGFja3RyYWNlKCBlLCBvZmZzZXQgKSB7XG5cdG9mZnNldCA9IG9mZnNldCA9PT0gdW5kZWZpbmVkID8gMyA6IG9mZnNldDtcblxuXHR2YXIgc3RhY2ssIGluY2x1ZGUsIGksIHJlZ2V4O1xuXG5cdGlmICggZS5zdGFja3RyYWNlICkge1xuXHRcdC8vIE9wZXJhXG5cdFx0cmV0dXJuIGUuc3RhY2t0cmFjZS5zcGxpdCggXCJcXG5cIiApWyBvZmZzZXQgKyAzIF07XG5cdH0gZWxzZSBpZiAoIGUuc3RhY2sgKSB7XG5cdFx0Ly8gRmlyZWZveCwgQ2hyb21lXG5cdFx0c3RhY2sgPSBlLnN0YWNrLnNwbGl0KCBcIlxcblwiICk7XG5cdFx0aWYgKC9eZXJyb3IkL2kudGVzdCggc3RhY2tbMF0gKSApIHtcblx0XHRcdHN0YWNrLnNoaWZ0KCk7XG5cdFx0fVxuXHRcdGlmICggZmlsZU5hbWUgKSB7XG5cdFx0XHRpbmNsdWRlID0gW107XG5cdFx0XHRmb3IgKCBpID0gb2Zmc2V0OyBpIDwgc3RhY2subGVuZ3RoOyBpKysgKSB7XG5cdFx0XHRcdGlmICggc3RhY2tbIGkgXS5pbmRleE9mKCBmaWxlTmFtZSApICE9IC0xICkge1xuXHRcdFx0XHRcdGJyZWFrO1xuXHRcdFx0XHR9XG5cdFx0XHRcdGluY2x1ZGUucHVzaCggc3RhY2tbIGkgXSApO1xuXHRcdFx0fVxuXHRcdFx0aWYgKCBpbmNsdWRlLmxlbmd0aCApIHtcblx0XHRcdFx0cmV0dXJuIGluY2x1ZGUuam9pbiggXCJcXG5cIiApO1xuXHRcdFx0fVxuXHRcdH1cblx0XHRyZXR1cm4gc3RhY2tbIG9mZnNldCBdO1xuXHR9IGVsc2UgaWYgKCBlLnNvdXJjZVVSTCApIHtcblx0XHQvLyBTYWZhcmksIFBoYW50b21KU1xuXHRcdC8vIGhvcGVmdWxseSBvbmUgZGF5IFNhZmFyaSBwcm92aWRlcyBhY3R1YWwgc3RhY2t0cmFjZXNcblx0XHQvLyBleGNsdWRlIHVzZWxlc3Mgc2VsZi1yZWZlcmVuY2UgZm9yIGdlbmVyYXRlZCBFcnJvciBvYmplY3RzXG5cdFx0aWYgKCAvcXVuaXQuanMkLy50ZXN0KCBlLnNvdXJjZVVSTCApICkge1xuXHRcdFx0cmV0dXJuO1xuXHRcdH1cblx0XHQvLyBmb3IgYWN0dWFsIGV4Y2VwdGlvbnMsIHRoaXMgaXMgdXNlZnVsXG5cdFx0cmV0dXJuIGUuc291cmNlVVJMICsgXCI6XCIgKyBlLmxpbmU7XG5cdH1cbn1cbmZ1bmN0aW9uIHNvdXJjZUZyb21TdGFja3RyYWNlKCBvZmZzZXQgKSB7XG5cdHRyeSB7XG5cdFx0dGhyb3cgbmV3IEVycm9yKCk7XG5cdH0gY2F0Y2ggKCBlICkge1xuXHRcdHJldHVybiBleHRyYWN0U3RhY2t0cmFjZSggZSwgb2Zmc2V0ICk7XG5cdH1cbn1cblxuZnVuY3Rpb24gZXNjYXBlSW5uZXJUZXh0KCBzICkge1xuXHRpZiAoICFzICkge1xuXHRcdHJldHVybiBcIlwiO1xuXHR9XG5cdHMgPSBzICsgXCJcIjtcblx0cmV0dXJuIHMucmVwbGFjZSggL1tcXCY8Pl0vZywgZnVuY3Rpb24oIHMgKSB7XG5cdFx0c3dpdGNoKCBzICkge1xuXHRcdFx0Y2FzZSBcIiZcIjogcmV0dXJuIFwiJmFtcDtcIjtcblx0XHRcdGNhc2UgXCI8XCI6IHJldHVybiBcIiZsdDtcIjtcblx0XHRcdGNhc2UgXCI+XCI6IHJldHVybiBcIiZndDtcIjtcblx0XHRcdGRlZmF1bHQ6IHJldHVybiBzO1xuXHRcdH1cblx0fSk7XG59XG5cbmZ1bmN0aW9uIHN5bmNocm9uaXplKCBjYWxsYmFjaywgbGFzdCApIHtcblx0Y29uZmlnLnF1ZXVlLnB1c2goIGNhbGxiYWNrICk7XG5cblx0aWYgKCBjb25maWcuYXV0b3J1biAmJiAhY29uZmlnLmJsb2NraW5nICkge1xuXHRcdHByb2Nlc3MoIGxhc3QgKTtcblx0fVxufVxuXG5mdW5jdGlvbiBwcm9jZXNzKCBsYXN0ICkge1xuXHRmdW5jdGlvbiBuZXh0KCkge1xuXHRcdHByb2Nlc3MoIGxhc3QgKTtcblx0fVxuXHR2YXIgc3RhcnQgPSBuZXcgRGF0ZSgpLmdldFRpbWUoKTtcblx0Y29uZmlnLmRlcHRoID0gY29uZmlnLmRlcHRoID8gY29uZmlnLmRlcHRoICsgMSA6IDE7XG5cblx0d2hpbGUgKCBjb25maWcucXVldWUubGVuZ3RoICYmICFjb25maWcuYmxvY2tpbmcgKSB7XG5cdFx0aWYgKCAhZGVmaW5lZC5zZXRUaW1lb3V0IHx8IGNvbmZpZy51cGRhdGVSYXRlIDw9IDAgfHwgKCAoIG5ldyBEYXRlKCkuZ2V0VGltZSgpIC0gc3RhcnQgKSA8IGNvbmZpZy51cGRhdGVSYXRlICkgKSB7XG5cdFx0XHRjb25maWcucXVldWUuc2hpZnQoKSgpO1xuXHRcdH0gZWxzZSB7XG5cdFx0XHR3aW5kb3cuc2V0VGltZW91dCggbmV4dCwgMTMgKTtcblx0XHRcdGJyZWFrO1xuXHRcdH1cblx0fVxuXHRjb25maWcuZGVwdGgtLTtcblx0aWYgKCBsYXN0ICYmICFjb25maWcuYmxvY2tpbmcgJiYgIWNvbmZpZy5xdWV1ZS5sZW5ndGggJiYgY29uZmlnLmRlcHRoID09PSAwICkge1xuXHRcdGRvbmUoKTtcblx0fVxufVxuXG5mdW5jdGlvbiBzYXZlR2xvYmFsKCkge1xuXHRjb25maWcucG9sbHV0aW9uID0gW107XG5cblx0aWYgKCBjb25maWcubm9nbG9iYWxzICkge1xuXHRcdGZvciAoIHZhciBrZXkgaW4gd2luZG93ICkge1xuXHRcdFx0Ly8gaW4gT3BlcmEgc29tZXRpbWVzIERPTSBlbGVtZW50IGlkcyBzaG93IHVwIGhlcmUsIGlnbm9yZSB0aGVtXG5cdFx0XHRpZiAoICFoYXNPd24uY2FsbCggd2luZG93LCBrZXkgKSB8fCAvXnF1bml0LXRlc3Qtb3V0cHV0Ly50ZXN0KCBrZXkgKSApIHtcblx0XHRcdFx0Y29udGludWU7XG5cdFx0XHR9XG5cdFx0XHRjb25maWcucG9sbHV0aW9uLnB1c2goIGtleSApO1xuXHRcdH1cblx0fVxufVxuXG5mdW5jdGlvbiBjaGVja1BvbGx1dGlvbiggbmFtZSApIHtcblx0dmFyIG5ld0dsb2JhbHMsXG5cdFx0ZGVsZXRlZEdsb2JhbHMsXG5cdFx0b2xkID0gY29uZmlnLnBvbGx1dGlvbjtcblxuXHRzYXZlR2xvYmFsKCk7XG5cblx0bmV3R2xvYmFscyA9IGRpZmYoIGNvbmZpZy5wb2xsdXRpb24sIG9sZCApO1xuXHRpZiAoIG5ld0dsb2JhbHMubGVuZ3RoID4gMCApIHtcblx0XHRRVW5pdC5wdXNoRmFpbHVyZSggXCJJbnRyb2R1Y2VkIGdsb2JhbCB2YXJpYWJsZShzKTogXCIgKyBuZXdHbG9iYWxzLmpvaW4oXCIsIFwiKSApO1xuXHR9XG5cblx0ZGVsZXRlZEdsb2JhbHMgPSBkaWZmKCBvbGQsIGNvbmZpZy5wb2xsdXRpb24gKTtcblx0aWYgKCBkZWxldGVkR2xvYmFscy5sZW5ndGggPiAwICkge1xuXHRcdFFVbml0LnB1c2hGYWlsdXJlKCBcIkRlbGV0ZWQgZ2xvYmFsIHZhcmlhYmxlKHMpOiBcIiArIGRlbGV0ZWRHbG9iYWxzLmpvaW4oXCIsIFwiKSApO1xuXHR9XG59XG5cbi8vIHJldHVybnMgYSBuZXcgQXJyYXkgd2l0aCB0aGUgZWxlbWVudHMgdGhhdCBhcmUgaW4gYSBidXQgbm90IGluIGJcbmZ1bmN0aW9uIGRpZmYoIGEsIGIgKSB7XG5cdHZhciBpLCBqLFxuXHRcdHJlc3VsdCA9IGEuc2xpY2UoKTtcblxuXHRmb3IgKCBpID0gMDsgaSA8IHJlc3VsdC5sZW5ndGg7IGkrKyApIHtcblx0XHRmb3IgKCBqID0gMDsgaiA8IGIubGVuZ3RoOyBqKysgKSB7XG5cdFx0XHRpZiAoIHJlc3VsdFtpXSA9PT0gYltqXSApIHtcblx0XHRcdFx0cmVzdWx0LnNwbGljZSggaSwgMSApO1xuXHRcdFx0XHRpLS07XG5cdFx0XHRcdGJyZWFrO1xuXHRcdFx0fVxuXHRcdH1cblx0fVxuXHRyZXR1cm4gcmVzdWx0O1xufVxuXG5mdW5jdGlvbiBleHRlbmQoIGEsIGIgKSB7XG5cdGZvciAoIHZhciBwcm9wIGluIGIgKSB7XG5cdFx0aWYgKCBiWyBwcm9wIF0gPT09IHVuZGVmaW5lZCApIHtcblx0XHRcdGRlbGV0ZSBhWyBwcm9wIF07XG5cblx0XHQvLyBBdm9pZCBcIk1lbWJlciBub3QgZm91bmRcIiBlcnJvciBpbiBJRTggY2F1c2VkIGJ5IHNldHRpbmcgd2luZG93LmNvbnN0cnVjdG9yXG5cdFx0fSBlbHNlIGlmICggcHJvcCAhPT0gXCJjb25zdHJ1Y3RvclwiIHx8IGEgIT09IHdpbmRvdyApIHtcblx0XHRcdGFbIHByb3AgXSA9IGJbIHByb3AgXTtcblx0XHR9XG5cdH1cblxuXHRyZXR1cm4gYTtcbn1cblxuZnVuY3Rpb24gYWRkRXZlbnQoIGVsZW0sIHR5cGUsIGZuICkge1xuXHRpZiAoIGVsZW0uYWRkRXZlbnRMaXN0ZW5lciApIHtcblx0XHRlbGVtLmFkZEV2ZW50TGlzdGVuZXIoIHR5cGUsIGZuLCBmYWxzZSApO1xuXHR9IGVsc2UgaWYgKCBlbGVtLmF0dGFjaEV2ZW50ICkge1xuXHRcdGVsZW0uYXR0YWNoRXZlbnQoIFwib25cIiArIHR5cGUsIGZuICk7XG5cdH0gZWxzZSB7XG5cdFx0Zm4oKTtcblx0fVxufVxuXG5mdW5jdGlvbiBpZCggbmFtZSApIHtcblx0cmV0dXJuICEhKCB0eXBlb2YgZG9jdW1lbnQgIT09IFwidW5kZWZpbmVkXCIgJiYgZG9jdW1lbnQgJiYgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQgKSAmJlxuXHRcdGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCBuYW1lICk7XG59XG5cbmZ1bmN0aW9uIHJlZ2lzdGVyTG9nZ2luZ0NhbGxiYWNrKCBrZXkgKSB7XG5cdHJldHVybiBmdW5jdGlvbiggY2FsbGJhY2sgKSB7XG5cdFx0Y29uZmlnW2tleV0ucHVzaCggY2FsbGJhY2sgKTtcblx0fTtcbn1cblxuLy8gU3VwcG9ydHMgZGVwcmVjYXRlZCBtZXRob2Qgb2YgY29tcGxldGVseSBvdmVyd3JpdGluZyBsb2dnaW5nIGNhbGxiYWNrc1xuZnVuY3Rpb24gcnVuTG9nZ2luZ0NhbGxiYWNrcygga2V5LCBzY29wZSwgYXJncyApIHtcblx0Ly9kZWJ1Z2dlcjtcblx0dmFyIGksIGNhbGxiYWNrcztcblx0aWYgKCBRVW5pdC5oYXNPd25Qcm9wZXJ0eSgga2V5ICkgKSB7XG5cdFx0UVVuaXRbIGtleSBdLmNhbGwoc2NvcGUsIGFyZ3MgKTtcblx0fSBlbHNlIHtcblx0XHRjYWxsYmFja3MgPSBjb25maWdbIGtleSBdO1xuXHRcdGZvciAoIGkgPSAwOyBpIDwgY2FsbGJhY2tzLmxlbmd0aDsgaSsrICkge1xuXHRcdFx0Y2FsbGJhY2tzWyBpIF0uY2FsbCggc2NvcGUsIGFyZ3MgKTtcblx0XHR9XG5cdH1cbn1cblxuLy8gVGVzdCBmb3IgZXF1YWxpdHkgYW55IEphdmFTY3JpcHQgdHlwZS5cbi8vIEF1dGhvcjogUGhpbGlwcGUgUmF0aMOpIDxwcmF0aGVAZ21haWwuY29tPlxuUVVuaXQuZXF1aXYgPSAoZnVuY3Rpb24oKSB7XG5cblx0Ly8gQ2FsbCB0aGUgbyByZWxhdGVkIGNhbGxiYWNrIHdpdGggdGhlIGdpdmVuIGFyZ3VtZW50cy5cblx0ZnVuY3Rpb24gYmluZENhbGxiYWNrcyggbywgY2FsbGJhY2tzLCBhcmdzICkge1xuXHRcdHZhciBwcm9wID0gUVVuaXQub2JqZWN0VHlwZSggbyApO1xuXHRcdGlmICggcHJvcCApIHtcblx0XHRcdGlmICggUVVuaXQub2JqZWN0VHlwZSggY2FsbGJhY2tzWyBwcm9wIF0gKSA9PT0gXCJmdW5jdGlvblwiICkge1xuXHRcdFx0XHRyZXR1cm4gY2FsbGJhY2tzWyBwcm9wIF0uYXBwbHkoIGNhbGxiYWNrcywgYXJncyApO1xuXHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0cmV0dXJuIGNhbGxiYWNrc1sgcHJvcCBdOyAvLyBvciB1bmRlZmluZWRcblx0XHRcdH1cblx0XHR9XG5cdH1cblxuXHQvLyB0aGUgcmVhbCBlcXVpdiBmdW5jdGlvblxuXHR2YXIgaW5uZXJFcXVpdixcblx0XHQvLyBzdGFjayB0byBkZWNpZGUgYmV0d2VlbiBza2lwL2Fib3J0IGZ1bmN0aW9uc1xuXHRcdGNhbGxlcnMgPSBbXSxcblx0XHQvLyBzdGFjayB0byBhdm9pZGluZyBsb29wcyBmcm9tIGNpcmN1bGFyIHJlZmVyZW5jaW5nXG5cdFx0cGFyZW50cyA9IFtdLFxuXG5cdFx0Z2V0UHJvdG8gPSBPYmplY3QuZ2V0UHJvdG90eXBlT2YgfHwgZnVuY3Rpb24gKCBvYmogKSB7XG5cdFx0XHRyZXR1cm4gb2JqLl9fcHJvdG9fXztcblx0XHR9LFxuXHRcdGNhbGxiYWNrcyA9IChmdW5jdGlvbiAoKSB7XG5cblx0XHRcdC8vIGZvciBzdHJpbmcsIGJvb2xlYW4sIG51bWJlciBhbmQgbnVsbFxuXHRcdFx0ZnVuY3Rpb24gdXNlU3RyaWN0RXF1YWxpdHkoIGIsIGEgKSB7XG5cdFx0XHRcdGlmICggYiBpbnN0YW5jZW9mIGEuY29uc3RydWN0b3IgfHwgYSBpbnN0YW5jZW9mIGIuY29uc3RydWN0b3IgKSB7XG5cdFx0XHRcdFx0Ly8gdG8gY2F0Y2ggc2hvcnQgYW5ub3RhaW9uIFZTICduZXcnIGFubm90YXRpb24gb2YgYVxuXHRcdFx0XHRcdC8vIGRlY2xhcmF0aW9uXG5cdFx0XHRcdFx0Ly8gZS5nLiB2YXIgaSA9IDE7XG5cdFx0XHRcdFx0Ly8gdmFyIGogPSBuZXcgTnVtYmVyKDEpO1xuXHRcdFx0XHRcdHJldHVybiBhID09IGI7XG5cdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0cmV0dXJuIGEgPT09IGI7XG5cdFx0XHRcdH1cblx0XHRcdH1cblxuXHRcdFx0cmV0dXJuIHtcblx0XHRcdFx0XCJzdHJpbmdcIjogdXNlU3RyaWN0RXF1YWxpdHksXG5cdFx0XHRcdFwiYm9vbGVhblwiOiB1c2VTdHJpY3RFcXVhbGl0eSxcblx0XHRcdFx0XCJudW1iZXJcIjogdXNlU3RyaWN0RXF1YWxpdHksXG5cdFx0XHRcdFwibnVsbFwiOiB1c2VTdHJpY3RFcXVhbGl0eSxcblx0XHRcdFx0XCJ1bmRlZmluZWRcIjogdXNlU3RyaWN0RXF1YWxpdHksXG5cblx0XHRcdFx0XCJuYW5cIjogZnVuY3Rpb24oIGIgKSB7XG5cdFx0XHRcdFx0cmV0dXJuIGlzTmFOKCBiICk7XG5cdFx0XHRcdH0sXG5cblx0XHRcdFx0XCJkYXRlXCI6IGZ1bmN0aW9uKCBiLCBhICkge1xuXHRcdFx0XHRcdHJldHVybiBRVW5pdC5vYmplY3RUeXBlKCBiICkgPT09IFwiZGF0ZVwiICYmIGEudmFsdWVPZigpID09PSBiLnZhbHVlT2YoKTtcblx0XHRcdFx0fSxcblxuXHRcdFx0XHRcInJlZ2V4cFwiOiBmdW5jdGlvbiggYiwgYSApIHtcblx0XHRcdFx0XHRyZXR1cm4gUVVuaXQub2JqZWN0VHlwZSggYiApID09PSBcInJlZ2V4cFwiICYmXG5cdFx0XHRcdFx0XHQvLyB0aGUgcmVnZXggaXRzZWxmXG5cdFx0XHRcdFx0XHRhLnNvdXJjZSA9PT0gYi5zb3VyY2UgJiZcblx0XHRcdFx0XHRcdC8vIGFuZCBpdHMgbW9kaWZlcnNcblx0XHRcdFx0XHRcdGEuZ2xvYmFsID09PSBiLmdsb2JhbCAmJlxuXHRcdFx0XHRcdFx0Ly8gKGdtaSkgLi4uXG5cdFx0XHRcdFx0XHRhLmlnbm9yZUNhc2UgPT09IGIuaWdub3JlQ2FzZSAmJlxuXHRcdFx0XHRcdFx0YS5tdWx0aWxpbmUgPT09IGIubXVsdGlsaW5lO1xuXHRcdFx0XHR9LFxuXG5cdFx0XHRcdC8vIC0gc2tpcCB3aGVuIHRoZSBwcm9wZXJ0eSBpcyBhIG1ldGhvZCBvZiBhbiBpbnN0YW5jZSAoT09QKVxuXHRcdFx0XHQvLyAtIGFib3J0IG90aGVyd2lzZSxcblx0XHRcdFx0Ly8gaW5pdGlhbCA9PT0gd291bGQgaGF2ZSBjYXRjaCBpZGVudGljYWwgcmVmZXJlbmNlcyBhbnl3YXlcblx0XHRcdFx0XCJmdW5jdGlvblwiOiBmdW5jdGlvbigpIHtcblx0XHRcdFx0XHR2YXIgY2FsbGVyID0gY2FsbGVyc1tjYWxsZXJzLmxlbmd0aCAtIDFdO1xuXHRcdFx0XHRcdHJldHVybiBjYWxsZXIgIT09IE9iamVjdCAmJiB0eXBlb2YgY2FsbGVyICE9PSBcInVuZGVmaW5lZFwiO1xuXHRcdFx0XHR9LFxuXG5cdFx0XHRcdFwiYXJyYXlcIjogZnVuY3Rpb24oIGIsIGEgKSB7XG5cdFx0XHRcdFx0dmFyIGksIGosIGxlbiwgbG9vcDtcblxuXHRcdFx0XHRcdC8vIGIgY291bGQgYmUgYW4gb2JqZWN0IGxpdGVyYWwgaGVyZVxuXHRcdFx0XHRcdGlmICggUVVuaXQub2JqZWN0VHlwZSggYiApICE9PSBcImFycmF5XCIgKSB7XG5cdFx0XHRcdFx0XHRyZXR1cm4gZmFsc2U7XG5cdFx0XHRcdFx0fVxuXG5cdFx0XHRcdFx0bGVuID0gYS5sZW5ndGg7XG5cdFx0XHRcdFx0aWYgKCBsZW4gIT09IGIubGVuZ3RoICkge1xuXHRcdFx0XHRcdFx0Ly8gc2FmZSBhbmQgZmFzdGVyXG5cdFx0XHRcdFx0XHRyZXR1cm4gZmFsc2U7XG5cdFx0XHRcdFx0fVxuXG5cdFx0XHRcdFx0Ly8gdHJhY2sgcmVmZXJlbmNlIHRvIGF2b2lkIGNpcmN1bGFyIHJlZmVyZW5jZXNcblx0XHRcdFx0XHRwYXJlbnRzLnB1c2goIGEgKTtcblx0XHRcdFx0XHRmb3IgKCBpID0gMDsgaSA8IGxlbjsgaSsrICkge1xuXHRcdFx0XHRcdFx0bG9vcCA9IGZhbHNlO1xuXHRcdFx0XHRcdFx0Zm9yICggaiA9IDA7IGogPCBwYXJlbnRzLmxlbmd0aDsgaisrICkge1xuXHRcdFx0XHRcdFx0XHRpZiAoIHBhcmVudHNbal0gPT09IGFbaV0gKSB7XG5cdFx0XHRcdFx0XHRcdFx0bG9vcCA9IHRydWU7Ly8gZG9udCByZXdhbGsgYXJyYXlcblx0XHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0aWYgKCAhbG9vcCAmJiAhaW5uZXJFcXVpdihhW2ldLCBiW2ldKSApIHtcblx0XHRcdFx0XHRcdFx0cGFyZW50cy5wb3AoKTtcblx0XHRcdFx0XHRcdFx0cmV0dXJuIGZhbHNlO1xuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdH1cblx0XHRcdFx0XHRwYXJlbnRzLnBvcCgpO1xuXHRcdFx0XHRcdHJldHVybiB0cnVlO1xuXHRcdFx0XHR9LFxuXG5cdFx0XHRcdFwib2JqZWN0XCI6IGZ1bmN0aW9uKCBiLCBhICkge1xuXHRcdFx0XHRcdHZhciBpLCBqLCBsb29wLFxuXHRcdFx0XHRcdFx0Ly8gRGVmYXVsdCB0byB0cnVlXG5cdFx0XHRcdFx0XHRlcSA9IHRydWUsXG5cdFx0XHRcdFx0XHRhUHJvcGVydGllcyA9IFtdLFxuXHRcdFx0XHRcdFx0YlByb3BlcnRpZXMgPSBbXTtcblxuXHRcdFx0XHRcdC8vIGNvbXBhcmluZyBjb25zdHJ1Y3RvcnMgaXMgbW9yZSBzdHJpY3QgdGhhbiB1c2luZ1xuXHRcdFx0XHRcdC8vIGluc3RhbmNlb2Zcblx0XHRcdFx0XHRpZiAoIGEuY29uc3RydWN0b3IgIT09IGIuY29uc3RydWN0b3IgKSB7XG5cdFx0XHRcdFx0XHQvLyBBbGxvdyBvYmplY3RzIHdpdGggbm8gcHJvdG90eXBlIHRvIGJlIGVxdWl2YWxlbnQgdG9cblx0XHRcdFx0XHRcdC8vIG9iamVjdHMgd2l0aCBPYmplY3QgYXMgdGhlaXIgY29uc3RydWN0b3IuXG5cdFx0XHRcdFx0XHRpZiAoICEoKCBnZXRQcm90byhhKSA9PT0gbnVsbCAmJiBnZXRQcm90byhiKSA9PT0gT2JqZWN0LnByb3RvdHlwZSApIHx8XG5cdFx0XHRcdFx0XHRcdCggZ2V0UHJvdG8oYikgPT09IG51bGwgJiYgZ2V0UHJvdG8oYSkgPT09IE9iamVjdC5wcm90b3R5cGUgKSApICkge1xuXHRcdFx0XHRcdFx0XHRcdHJldHVybiBmYWxzZTtcblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHR9XG5cblx0XHRcdFx0XHQvLyBzdGFjayBjb25zdHJ1Y3RvciBiZWZvcmUgdHJhdmVyc2luZyBwcm9wZXJ0aWVzXG5cdFx0XHRcdFx0Y2FsbGVycy5wdXNoKCBhLmNvbnN0cnVjdG9yICk7XG5cdFx0XHRcdFx0Ly8gdHJhY2sgcmVmZXJlbmNlIHRvIGF2b2lkIGNpcmN1bGFyIHJlZmVyZW5jZXNcblx0XHRcdFx0XHRwYXJlbnRzLnB1c2goIGEgKTtcblxuXHRcdFx0XHRcdGZvciAoIGkgaW4gYSApIHsgLy8gYmUgc3RyaWN0OiBkb24ndCBlbnN1cmVzIGhhc093blByb3BlcnR5XG5cdFx0XHRcdFx0XHRcdFx0XHQvLyBhbmQgZ28gZGVlcFxuXHRcdFx0XHRcdFx0bG9vcCA9IGZhbHNlO1xuXHRcdFx0XHRcdFx0Zm9yICggaiA9IDA7IGogPCBwYXJlbnRzLmxlbmd0aDsgaisrICkge1xuXHRcdFx0XHRcdFx0XHRpZiAoIHBhcmVudHNbal0gPT09IGFbaV0gKSB7XG5cdFx0XHRcdFx0XHRcdFx0Ly8gZG9uJ3QgZ28gZG93biB0aGUgc2FtZSBwYXRoIHR3aWNlXG5cdFx0XHRcdFx0XHRcdFx0bG9vcCA9IHRydWU7XG5cdFx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdGFQcm9wZXJ0aWVzLnB1c2goaSk7IC8vIGNvbGxlY3QgYSdzIHByb3BlcnRpZXNcblxuXHRcdFx0XHRcdFx0aWYgKCFsb29wICYmICFpbm5lckVxdWl2KCBhW2ldLCBiW2ldICkgKSB7XG5cdFx0XHRcdFx0XHRcdGVxID0gZmFsc2U7XG5cdFx0XHRcdFx0XHRcdGJyZWFrO1xuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdH1cblxuXHRcdFx0XHRcdGNhbGxlcnMucG9wKCk7IC8vIHVuc3RhY2ssIHdlIGFyZSBkb25lXG5cdFx0XHRcdFx0cGFyZW50cy5wb3AoKTtcblxuXHRcdFx0XHRcdGZvciAoIGkgaW4gYiApIHtcblx0XHRcdFx0XHRcdGJQcm9wZXJ0aWVzLnB1c2goIGkgKTsgLy8gY29sbGVjdCBiJ3MgcHJvcGVydGllc1xuXHRcdFx0XHRcdH1cblxuXHRcdFx0XHRcdC8vIEVuc3VyZXMgaWRlbnRpY2FsIHByb3BlcnRpZXMgbmFtZVxuXHRcdFx0XHRcdHJldHVybiBlcSAmJiBpbm5lckVxdWl2KCBhUHJvcGVydGllcy5zb3J0KCksIGJQcm9wZXJ0aWVzLnNvcnQoKSApO1xuXHRcdFx0XHR9XG5cdFx0XHR9O1xuXHRcdH0oKSk7XG5cblx0aW5uZXJFcXVpdiA9IGZ1bmN0aW9uKCkgeyAvLyBjYW4gdGFrZSBtdWx0aXBsZSBhcmd1bWVudHNcblx0XHR2YXIgYXJncyA9IFtdLnNsaWNlLmFwcGx5KCBhcmd1bWVudHMgKTtcblx0XHRpZiAoIGFyZ3MubGVuZ3RoIDwgMiApIHtcblx0XHRcdHJldHVybiB0cnVlOyAvLyBlbmQgdHJhbnNpdGlvblxuXHRcdH1cblxuXHRcdHJldHVybiAoZnVuY3Rpb24oIGEsIGIgKSB7XG5cdFx0XHRpZiAoIGEgPT09IGIgKSB7XG5cdFx0XHRcdHJldHVybiB0cnVlOyAvLyBjYXRjaCB0aGUgbW9zdCB5b3UgY2FuXG5cdFx0XHR9IGVsc2UgaWYgKCBhID09PSBudWxsIHx8IGIgPT09IG51bGwgfHwgdHlwZW9mIGEgPT09IFwidW5kZWZpbmVkXCIgfHxcblx0XHRcdFx0XHR0eXBlb2YgYiA9PT0gXCJ1bmRlZmluZWRcIiB8fFxuXHRcdFx0XHRcdFFVbml0Lm9iamVjdFR5cGUoYSkgIT09IFFVbml0Lm9iamVjdFR5cGUoYikgKSB7XG5cdFx0XHRcdHJldHVybiBmYWxzZTsgLy8gZG9uJ3QgbG9zZSB0aW1lIHdpdGggZXJyb3IgcHJvbmUgY2FzZXNcblx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdHJldHVybiBiaW5kQ2FsbGJhY2tzKGEsIGNhbGxiYWNrcywgWyBiLCBhIF0pO1xuXHRcdFx0fVxuXG5cdFx0XHQvLyBhcHBseSB0cmFuc2l0aW9uIHdpdGggKDEuLm4pIGFyZ3VtZW50c1xuXHRcdH0oIGFyZ3NbMF0sIGFyZ3NbMV0gKSAmJiBhcmd1bWVudHMuY2FsbGVlLmFwcGx5KCB0aGlzLCBhcmdzLnNwbGljZSgxLCBhcmdzLmxlbmd0aCAtIDEgKSkgKTtcblx0fTtcblxuXHRyZXR1cm4gaW5uZXJFcXVpdjtcbn0oKSk7XG5cbi8qKlxuICoganNEdW1wIENvcHlyaWdodCAoYykgMjAwOCBBcmllbCBGbGVzbGVyIC0gYWZsZXNsZXIoYXQpZ21haWwoZG90KWNvbSB8XG4gKiBodHRwOi8vZmxlc2xlci5ibG9nc3BvdC5jb20gTGljZW5zZWQgdW5kZXIgQlNEXG4gKiAoaHR0cDovL3d3dy5vcGVuc291cmNlLm9yZy9saWNlbnNlcy9ic2QtbGljZW5zZS5waHApIERhdGU6IDUvMTUvMjAwOFxuICpcbiAqIEBwcm9qZWN0RGVzY3JpcHRpb24gQWR2YW5jZWQgYW5kIGV4dGVuc2libGUgZGF0YSBkdW1waW5nIGZvciBKYXZhc2NyaXB0LlxuICogQHZlcnNpb24gMS4wLjBcbiAqIEBhdXRob3IgQXJpZWwgRmxlc2xlclxuICogQGxpbmsge2h0dHA6Ly9mbGVzbGVyLmJsb2dzcG90LmNvbS8yMDA4LzA1L2pzZHVtcC1wcmV0dHktZHVtcC1vZi1hbnktamF2YXNjcmlwdC5odG1sfVxuICovXG5RVW5pdC5qc0R1bXAgPSAoZnVuY3Rpb24oKSB7XG5cdGZ1bmN0aW9uIHF1b3RlKCBzdHIgKSB7XG5cdFx0cmV0dXJuICdcIicgKyBzdHIudG9TdHJpbmcoKS5yZXBsYWNlKCAvXCIvZywgJ1xcXFxcIicgKSArICdcIic7XG5cdH1cblx0ZnVuY3Rpb24gbGl0ZXJhbCggbyApIHtcblx0XHRyZXR1cm4gbyArIFwiXCI7XG5cdH1cblx0ZnVuY3Rpb24gam9pbiggcHJlLCBhcnIsIHBvc3QgKSB7XG5cdFx0dmFyIHMgPSBqc0R1bXAuc2VwYXJhdG9yKCksXG5cdFx0XHRiYXNlID0ganNEdW1wLmluZGVudCgpLFxuXHRcdFx0aW5uZXIgPSBqc0R1bXAuaW5kZW50KDEpO1xuXHRcdGlmICggYXJyLmpvaW4gKSB7XG5cdFx0XHRhcnIgPSBhcnIuam9pbiggXCIsXCIgKyBzICsgaW5uZXIgKTtcblx0XHR9XG5cdFx0aWYgKCAhYXJyICkge1xuXHRcdFx0cmV0dXJuIHByZSArIHBvc3Q7XG5cdFx0fVxuXHRcdHJldHVybiBbIHByZSwgaW5uZXIgKyBhcnIsIGJhc2UgKyBwb3N0IF0uam9pbihzKTtcblx0fVxuXHRmdW5jdGlvbiBhcnJheSggYXJyLCBzdGFjayApIHtcblx0XHR2YXIgaSA9IGFyci5sZW5ndGgsIHJldCA9IG5ldyBBcnJheShpKTtcblx0XHR0aGlzLnVwKCk7XG5cdFx0d2hpbGUgKCBpLS0gKSB7XG5cdFx0XHRyZXRbaV0gPSB0aGlzLnBhcnNlKCBhcnJbaV0gLCB1bmRlZmluZWQgLCBzdGFjayk7XG5cdFx0fVxuXHRcdHRoaXMuZG93bigpO1xuXHRcdHJldHVybiBqb2luKCBcIltcIiwgcmV0LCBcIl1cIiApO1xuXHR9XG5cblx0dmFyIHJlTmFtZSA9IC9eZnVuY3Rpb24gKFxcdyspLyxcblx0XHRqc0R1bXAgPSB7XG5cdFx0XHRwYXJzZTogZnVuY3Rpb24oIG9iaiwgdHlwZSwgc3RhY2sgKSB7IC8vdHlwZSBpcyB1c2VkIG1vc3RseSBpbnRlcm5hbGx5LCB5b3UgY2FuIGZpeCBhIChjdXN0b20pdHlwZSBpbiBhZHZhbmNlXG5cdFx0XHRcdHN0YWNrID0gc3RhY2sgfHwgWyBdO1xuXHRcdFx0XHR2YXIgaW5TdGFjaywgcmVzLFxuXHRcdFx0XHRcdHBhcnNlciA9IHRoaXMucGFyc2Vyc1sgdHlwZSB8fCB0aGlzLnR5cGVPZihvYmopIF07XG5cblx0XHRcdFx0dHlwZSA9IHR5cGVvZiBwYXJzZXI7XG5cdFx0XHRcdGluU3RhY2sgPSBpbkFycmF5KCBvYmosIHN0YWNrICk7XG5cblx0XHRcdFx0aWYgKCBpblN0YWNrICE9IC0xICkge1xuXHRcdFx0XHRcdHJldHVybiBcInJlY3Vyc2lvbihcIiArIChpblN0YWNrIC0gc3RhY2subGVuZ3RoKSArIFwiKVwiO1xuXHRcdFx0XHR9XG5cdFx0XHRcdC8vZWxzZVxuXHRcdFx0XHRpZiAoIHR5cGUgPT0gXCJmdW5jdGlvblwiICkgIHtcblx0XHRcdFx0XHRzdGFjay5wdXNoKCBvYmogKTtcblx0XHRcdFx0XHRyZXMgPSBwYXJzZXIuY2FsbCggdGhpcywgb2JqLCBzdGFjayApO1xuXHRcdFx0XHRcdHN0YWNrLnBvcCgpO1xuXHRcdFx0XHRcdHJldHVybiByZXM7XG5cdFx0XHRcdH1cblx0XHRcdFx0Ly8gZWxzZVxuXHRcdFx0XHRyZXR1cm4gKCB0eXBlID09IFwic3RyaW5nXCIgKSA/IHBhcnNlciA6IHRoaXMucGFyc2Vycy5lcnJvcjtcblx0XHRcdH0sXG5cdFx0XHR0eXBlT2Y6IGZ1bmN0aW9uKCBvYmogKSB7XG5cdFx0XHRcdHZhciB0eXBlO1xuXHRcdFx0XHRpZiAoIG9iaiA9PT0gbnVsbCApIHtcblx0XHRcdFx0XHR0eXBlID0gXCJudWxsXCI7XG5cdFx0XHRcdH0gZWxzZSBpZiAoIHR5cGVvZiBvYmogPT09IFwidW5kZWZpbmVkXCIgKSB7XG5cdFx0XHRcdFx0dHlwZSA9IFwidW5kZWZpbmVkXCI7XG5cdFx0XHRcdH0gZWxzZSBpZiAoIFFVbml0LmlzKCBcInJlZ2V4cFwiLCBvYmopICkge1xuXHRcdFx0XHRcdHR5cGUgPSBcInJlZ2V4cFwiO1xuXHRcdFx0XHR9IGVsc2UgaWYgKCBRVW5pdC5pcyggXCJkYXRlXCIsIG9iaikgKSB7XG5cdFx0XHRcdFx0dHlwZSA9IFwiZGF0ZVwiO1xuXHRcdFx0XHR9IGVsc2UgaWYgKCBRVW5pdC5pcyggXCJmdW5jdGlvblwiLCBvYmopICkge1xuXHRcdFx0XHRcdHR5cGUgPSBcImZ1bmN0aW9uXCI7XG5cdFx0XHRcdH0gZWxzZSBpZiAoIHR5cGVvZiBvYmouc2V0SW50ZXJ2YWwgIT09IHVuZGVmaW5lZCAmJiB0eXBlb2Ygb2JqLmRvY3VtZW50ICE9PSBcInVuZGVmaW5lZFwiICYmIHR5cGVvZiBvYmoubm9kZVR5cGUgPT09IFwidW5kZWZpbmVkXCIgKSB7XG5cdFx0XHRcdFx0dHlwZSA9IFwid2luZG93XCI7XG5cdFx0XHRcdH0gZWxzZSBpZiAoIG9iai5ub2RlVHlwZSA9PT0gOSApIHtcblx0XHRcdFx0XHR0eXBlID0gXCJkb2N1bWVudFwiO1xuXHRcdFx0XHR9IGVsc2UgaWYgKCBvYmoubm9kZVR5cGUgKSB7XG5cdFx0XHRcdFx0dHlwZSA9IFwibm9kZVwiO1xuXHRcdFx0XHR9IGVsc2UgaWYgKFxuXHRcdFx0XHRcdC8vIG5hdGl2ZSBhcnJheXNcblx0XHRcdFx0XHR0b1N0cmluZy5jYWxsKCBvYmogKSA9PT0gXCJbb2JqZWN0IEFycmF5XVwiIHx8XG5cdFx0XHRcdFx0Ly8gTm9kZUxpc3Qgb2JqZWN0c1xuXHRcdFx0XHRcdCggdHlwZW9mIG9iai5sZW5ndGggPT09IFwibnVtYmVyXCIgJiYgdHlwZW9mIG9iai5pdGVtICE9PSBcInVuZGVmaW5lZFwiICYmICggb2JqLmxlbmd0aCA/IG9iai5pdGVtKDApID09PSBvYmpbMF0gOiAoIG9iai5pdGVtKCAwICkgPT09IG51bGwgJiYgdHlwZW9mIG9ialswXSA9PT0gXCJ1bmRlZmluZWRcIiApICkgKVxuXHRcdFx0XHQpIHtcblx0XHRcdFx0XHR0eXBlID0gXCJhcnJheVwiO1xuXHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdHR5cGUgPSB0eXBlb2Ygb2JqO1xuXHRcdFx0XHR9XG5cdFx0XHRcdHJldHVybiB0eXBlO1xuXHRcdFx0fSxcblx0XHRcdHNlcGFyYXRvcjogZnVuY3Rpb24oKSB7XG5cdFx0XHRcdHJldHVybiB0aGlzLm11bHRpbGluZSA/XHR0aGlzLkhUTUwgPyBcIjxiciAvPlwiIDogXCJcXG5cIiA6IHRoaXMuSFRNTCA/IFwiJm5ic3A7XCIgOiBcIiBcIjtcblx0XHRcdH0sXG5cdFx0XHRpbmRlbnQ6IGZ1bmN0aW9uKCBleHRyYSApIHsvLyBleHRyYSBjYW4gYmUgYSBudW1iZXIsIHNob3J0Y3V0IGZvciBpbmNyZWFzaW5nLWNhbGxpbmctZGVjcmVhc2luZ1xuXHRcdFx0XHRpZiAoICF0aGlzLm11bHRpbGluZSApIHtcblx0XHRcdFx0XHRyZXR1cm4gXCJcIjtcblx0XHRcdFx0fVxuXHRcdFx0XHR2YXIgY2hyID0gdGhpcy5pbmRlbnRDaGFyO1xuXHRcdFx0XHRpZiAoIHRoaXMuSFRNTCApIHtcblx0XHRcdFx0XHRjaHIgPSBjaHIucmVwbGFjZSggL1xcdC9nLCBcIiAgIFwiICkucmVwbGFjZSggLyAvZywgXCImbmJzcDtcIiApO1xuXHRcdFx0XHR9XG5cdFx0XHRcdHJldHVybiBuZXcgQXJyYXkoIHRoaXMuX2RlcHRoXyArIChleHRyYXx8MCkgKS5qb2luKGNocik7XG5cdFx0XHR9LFxuXHRcdFx0dXA6IGZ1bmN0aW9uKCBhICkge1xuXHRcdFx0XHR0aGlzLl9kZXB0aF8gKz0gYSB8fCAxO1xuXHRcdFx0fSxcblx0XHRcdGRvd246IGZ1bmN0aW9uKCBhICkge1xuXHRcdFx0XHR0aGlzLl9kZXB0aF8gLT0gYSB8fCAxO1xuXHRcdFx0fSxcblx0XHRcdHNldFBhcnNlcjogZnVuY3Rpb24oIG5hbWUsIHBhcnNlciApIHtcblx0XHRcdFx0dGhpcy5wYXJzZXJzW25hbWVdID0gcGFyc2VyO1xuXHRcdFx0fSxcblx0XHRcdC8vIFRoZSBuZXh0IDMgYXJlIGV4cG9zZWQgc28geW91IGNhbiB1c2UgdGhlbVxuXHRcdFx0cXVvdGU6IHF1b3RlLFxuXHRcdFx0bGl0ZXJhbDogbGl0ZXJhbCxcblx0XHRcdGpvaW46IGpvaW4sXG5cdFx0XHQvL1xuXHRcdFx0X2RlcHRoXzogMSxcblx0XHRcdC8vIFRoaXMgaXMgdGhlIGxpc3Qgb2YgcGFyc2VycywgdG8gbW9kaWZ5IHRoZW0sIHVzZSBqc0R1bXAuc2V0UGFyc2VyXG5cdFx0XHRwYXJzZXJzOiB7XG5cdFx0XHRcdHdpbmRvdzogXCJbV2luZG93XVwiLFxuXHRcdFx0XHRkb2N1bWVudDogXCJbRG9jdW1lbnRdXCIsXG5cdFx0XHRcdGVycm9yOiBcIltFUlJPUl1cIiwgLy93aGVuIG5vIHBhcnNlciBpcyBmb3VuZCwgc2hvdWxkblwidCBoYXBwZW5cblx0XHRcdFx0dW5rbm93bjogXCJbVW5rbm93bl1cIixcblx0XHRcdFx0XCJudWxsXCI6IFwibnVsbFwiLFxuXHRcdFx0XHRcInVuZGVmaW5lZFwiOiBcInVuZGVmaW5lZFwiLFxuXHRcdFx0XHRcImZ1bmN0aW9uXCI6IGZ1bmN0aW9uKCBmbiApIHtcblx0XHRcdFx0XHR2YXIgcmV0ID0gXCJmdW5jdGlvblwiLFxuXHRcdFx0XHRcdFx0bmFtZSA9IFwibmFtZVwiIGluIGZuID8gZm4ubmFtZSA6IChyZU5hbWUuZXhlYyhmbikgfHwgW10pWzFdOy8vZnVuY3Rpb25zIG5ldmVyIGhhdmUgbmFtZSBpbiBJRVxuXG5cdFx0XHRcdFx0aWYgKCBuYW1lICkge1xuXHRcdFx0XHRcdFx0cmV0ICs9IFwiIFwiICsgbmFtZTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0cmV0ICs9IFwiKCBcIjtcblxuXHRcdFx0XHRcdHJldCA9IFsgcmV0LCBRVW5pdC5qc0R1bXAucGFyc2UoIGZuLCBcImZ1bmN0aW9uQXJnc1wiICksIFwiKXtcIiBdLmpvaW4oIFwiXCIgKTtcblx0XHRcdFx0XHRyZXR1cm4gam9pbiggcmV0LCBRVW5pdC5qc0R1bXAucGFyc2UoZm4sXCJmdW5jdGlvbkNvZGVcIiApLCBcIn1cIiApO1xuXHRcdFx0XHR9LFxuXHRcdFx0XHRhcnJheTogYXJyYXksXG5cdFx0XHRcdG5vZGVsaXN0OiBhcnJheSxcblx0XHRcdFx0XCJhcmd1bWVudHNcIjogYXJyYXksXG5cdFx0XHRcdG9iamVjdDogZnVuY3Rpb24oIG1hcCwgc3RhY2sgKSB7XG5cdFx0XHRcdFx0dmFyIHJldCA9IFsgXSwga2V5cywga2V5LCB2YWwsIGk7XG5cdFx0XHRcdFx0UVVuaXQuanNEdW1wLnVwKCk7XG5cdFx0XHRcdFx0aWYgKCBPYmplY3Qua2V5cyApIHtcblx0XHRcdFx0XHRcdGtleXMgPSBPYmplY3Qua2V5cyggbWFwICk7XG5cdFx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHRcdGtleXMgPSBbXTtcblx0XHRcdFx0XHRcdGZvciAoIGtleSBpbiBtYXAgKSB7XG5cdFx0XHRcdFx0XHRcdGtleXMucHVzaCgga2V5ICk7XG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHRcdGtleXMuc29ydCgpO1xuXHRcdFx0XHRcdGZvciAoIGkgPSAwOyBpIDwga2V5cy5sZW5ndGg7IGkrKyApIHtcblx0XHRcdFx0XHRcdGtleSA9IGtleXNbIGkgXTtcblx0XHRcdFx0XHRcdHZhbCA9IG1hcFsga2V5IF07XG5cdFx0XHRcdFx0XHRyZXQucHVzaCggUVVuaXQuanNEdW1wLnBhcnNlKCBrZXksIFwia2V5XCIgKSArIFwiOiBcIiArIFFVbml0LmpzRHVtcC5wYXJzZSggdmFsLCB1bmRlZmluZWQsIHN0YWNrICkgKTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0UVVuaXQuanNEdW1wLmRvd24oKTtcblx0XHRcdFx0XHRyZXR1cm4gam9pbiggXCJ7XCIsIHJldCwgXCJ9XCIgKTtcblx0XHRcdFx0fSxcblx0XHRcdFx0bm9kZTogZnVuY3Rpb24oIG5vZGUgKSB7XG5cdFx0XHRcdFx0dmFyIGEsIHZhbCxcblx0XHRcdFx0XHRcdG9wZW4gPSBRVW5pdC5qc0R1bXAuSFRNTCA/IFwiJmx0O1wiIDogXCI8XCIsXG5cdFx0XHRcdFx0XHRjbG9zZSA9IFFVbml0LmpzRHVtcC5IVE1MID8gXCImZ3Q7XCIgOiBcIj5cIixcblx0XHRcdFx0XHRcdHRhZyA9IG5vZGUubm9kZU5hbWUudG9Mb3dlckNhc2UoKSxcblx0XHRcdFx0XHRcdHJldCA9IG9wZW4gKyB0YWc7XG5cblx0XHRcdFx0XHRmb3IgKCBhIGluIFFVbml0LmpzRHVtcC5ET01BdHRycyApIHtcblx0XHRcdFx0XHRcdHZhbCA9IG5vZGVbIFFVbml0LmpzRHVtcC5ET01BdHRyc1thXSBdO1xuXHRcdFx0XHRcdFx0aWYgKCB2YWwgKSB7XG5cdFx0XHRcdFx0XHRcdHJldCArPSBcIiBcIiArIGEgKyBcIj1cIiArIFFVbml0LmpzRHVtcC5wYXJzZSggdmFsLCBcImF0dHJpYnV0ZVwiICk7XG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHRcdHJldHVybiByZXQgKyBjbG9zZSArIG9wZW4gKyBcIi9cIiArIHRhZyArIGNsb3NlO1xuXHRcdFx0XHR9LFxuXHRcdFx0XHRmdW5jdGlvbkFyZ3M6IGZ1bmN0aW9uKCBmbiApIHsvL2Z1bmN0aW9uIGNhbGxzIGl0IGludGVybmFsbHksIGl0J3MgdGhlIGFyZ3VtZW50cyBwYXJ0IG9mIHRoZSBmdW5jdGlvblxuXHRcdFx0XHRcdHZhciBhcmdzLFxuXHRcdFx0XHRcdFx0bCA9IGZuLmxlbmd0aDtcblxuXHRcdFx0XHRcdGlmICggIWwgKSB7XG5cdFx0XHRcdFx0XHRyZXR1cm4gXCJcIjtcblx0XHRcdFx0XHR9XG5cblx0XHRcdFx0XHRhcmdzID0gbmV3IEFycmF5KGwpO1xuXHRcdFx0XHRcdHdoaWxlICggbC0tICkge1xuXHRcdFx0XHRcdFx0YXJnc1tsXSA9IFN0cmluZy5mcm9tQ2hhckNvZGUoOTcrbCk7Ly85NyBpcyAnYSdcblx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0cmV0dXJuIFwiIFwiICsgYXJncy5qb2luKCBcIiwgXCIgKSArIFwiIFwiO1xuXHRcdFx0XHR9LFxuXHRcdFx0XHRrZXk6IHF1b3RlLCAvL29iamVjdCBjYWxscyBpdCBpbnRlcm5hbGx5LCB0aGUga2V5IHBhcnQgb2YgYW4gaXRlbSBpbiBhIG1hcFxuXHRcdFx0XHRmdW5jdGlvbkNvZGU6IFwiW2NvZGVdXCIsIC8vZnVuY3Rpb24gY2FsbHMgaXQgaW50ZXJuYWxseSwgaXQncyB0aGUgY29udGVudCBvZiB0aGUgZnVuY3Rpb25cblx0XHRcdFx0YXR0cmlidXRlOiBxdW90ZSwgLy9ub2RlIGNhbGxzIGl0IGludGVybmFsbHksIGl0J3MgYW4gaHRtbCBhdHRyaWJ1dGUgdmFsdWVcblx0XHRcdFx0c3RyaW5nOiBxdW90ZSxcblx0XHRcdFx0ZGF0ZTogcXVvdGUsXG5cdFx0XHRcdHJlZ2V4cDogbGl0ZXJhbCwgLy9yZWdleFxuXHRcdFx0XHRudW1iZXI6IGxpdGVyYWwsXG5cdFx0XHRcdFwiYm9vbGVhblwiOiBsaXRlcmFsXG5cdFx0XHR9LFxuXHRcdFx0RE9NQXR0cnM6IHtcblx0XHRcdFx0Ly9hdHRyaWJ1dGVzIHRvIGR1bXAgZnJvbSBub2RlcywgbmFtZT0+cmVhbE5hbWVcblx0XHRcdFx0aWQ6IFwiaWRcIixcblx0XHRcdFx0bmFtZTogXCJuYW1lXCIsXG5cdFx0XHRcdFwiY2xhc3NcIjogXCJjbGFzc05hbWVcIlxuXHRcdFx0fSxcblx0XHRcdEhUTUw6IGZhbHNlLC8vaWYgdHJ1ZSwgZW50aXRpZXMgYXJlIGVzY2FwZWQgKCA8LCA+LCBcXHQsIHNwYWNlIGFuZCBcXG4gKVxuXHRcdFx0aW5kZW50Q2hhcjogXCIgIFwiLC8vaW5kZW50YXRpb24gdW5pdFxuXHRcdFx0bXVsdGlsaW5lOiB0cnVlIC8vaWYgdHJ1ZSwgaXRlbXMgaW4gYSBjb2xsZWN0aW9uLCBhcmUgc2VwYXJhdGVkIGJ5IGEgXFxuLCBlbHNlIGp1c3QgYSBzcGFjZS5cblx0XHR9O1xuXG5cdHJldHVybiBqc0R1bXA7XG59KCkpO1xuXG4vLyBmcm9tIFNpenpsZS5qc1xuZnVuY3Rpb24gZ2V0VGV4dCggZWxlbXMgKSB7XG5cdHZhciBpLCBlbGVtLFxuXHRcdHJldCA9IFwiXCI7XG5cblx0Zm9yICggaSA9IDA7IGVsZW1zW2ldOyBpKysgKSB7XG5cdFx0ZWxlbSA9IGVsZW1zW2ldO1xuXG5cdFx0Ly8gR2V0IHRoZSB0ZXh0IGZyb20gdGV4dCBub2RlcyBhbmQgQ0RBVEEgbm9kZXNcblx0XHRpZiAoIGVsZW0ubm9kZVR5cGUgPT09IDMgfHwgZWxlbS5ub2RlVHlwZSA9PT0gNCApIHtcblx0XHRcdHJldCArPSBlbGVtLm5vZGVWYWx1ZTtcblxuXHRcdC8vIFRyYXZlcnNlIGV2ZXJ5dGhpbmcgZWxzZSwgZXhjZXB0IGNvbW1lbnQgbm9kZXNcblx0XHR9IGVsc2UgaWYgKCBlbGVtLm5vZGVUeXBlICE9PSA4ICkge1xuXHRcdFx0cmV0ICs9IGdldFRleHQoIGVsZW0uY2hpbGROb2RlcyApO1xuXHRcdH1cblx0fVxuXG5cdHJldHVybiByZXQ7XG59XG5cbi8vIGZyb20ganF1ZXJ5LmpzXG5mdW5jdGlvbiBpbkFycmF5KCBlbGVtLCBhcnJheSApIHtcblx0aWYgKCBhcnJheS5pbmRleE9mICkge1xuXHRcdHJldHVybiBhcnJheS5pbmRleE9mKCBlbGVtICk7XG5cdH1cblxuXHRmb3IgKCB2YXIgaSA9IDAsIGxlbmd0aCA9IGFycmF5Lmxlbmd0aDsgaSA8IGxlbmd0aDsgaSsrICkge1xuXHRcdGlmICggYXJyYXlbIGkgXSA9PT0gZWxlbSApIHtcblx0XHRcdHJldHVybiBpO1xuXHRcdH1cblx0fVxuXG5cdHJldHVybiAtMTtcbn1cblxuLypcbiAqIEphdmFzY3JpcHQgRGlmZiBBbGdvcml0aG1cbiAqICBCeSBKb2huIFJlc2lnIChodHRwOi8vZWpvaG4ub3JnLylcbiAqICBNb2RpZmllZCBieSBDaHUgQWxhbiBcInNwcml0ZVwiXG4gKlxuICogUmVsZWFzZWQgdW5kZXIgdGhlIE1JVCBsaWNlbnNlLlxuICpcbiAqIE1vcmUgSW5mbzpcbiAqICBodHRwOi8vZWpvaG4ub3JnL3Byb2plY3RzL2phdmFzY3JpcHQtZGlmZi1hbGdvcml0aG0vXG4gKlxuICogVXNhZ2U6IFFVbml0LmRpZmYoZXhwZWN0ZWQsIGFjdHVhbClcbiAqXG4gKiBRVW5pdC5kaWZmKCBcInRoZSBxdWljayBicm93biBmb3gganVtcGVkIG92ZXJcIiwgXCJ0aGUgcXVpY2sgZm94IGp1bXBzIG92ZXJcIiApID09IFwidGhlICBxdWljayA8ZGVsPmJyb3duIDwvZGVsPiBmb3ggPGRlbD5qdW1wZWQgPC9kZWw+PGlucz5qdW1wcyA8L2lucz4gb3ZlclwiXG4gKi9cblFVbml0LmRpZmYgPSAoZnVuY3Rpb24oKSB7XG5cdGZ1bmN0aW9uIGRpZmYoIG8sIG4gKSB7XG5cdFx0dmFyIGksXG5cdFx0XHRucyA9IHt9LFxuXHRcdFx0b3MgPSB7fTtcblxuXHRcdGZvciAoIGkgPSAwOyBpIDwgbi5sZW5ndGg7IGkrKyApIHtcblx0XHRcdGlmICggbnNbIG5baV0gXSA9PSBudWxsICkge1xuXHRcdFx0XHRuc1sgbltpXSBdID0ge1xuXHRcdFx0XHRcdHJvd3M6IFtdLFxuXHRcdFx0XHRcdG86IG51bGxcblx0XHRcdFx0fTtcblx0XHRcdH1cblx0XHRcdG5zWyBuW2ldIF0ucm93cy5wdXNoKCBpICk7XG5cdFx0fVxuXG5cdFx0Zm9yICggaSA9IDA7IGkgPCBvLmxlbmd0aDsgaSsrICkge1xuXHRcdFx0aWYgKCBvc1sgb1tpXSBdID09IG51bGwgKSB7XG5cdFx0XHRcdG9zWyBvW2ldIF0gPSB7XG5cdFx0XHRcdFx0cm93czogW10sXG5cdFx0XHRcdFx0bjogbnVsbFxuXHRcdFx0XHR9O1xuXHRcdFx0fVxuXHRcdFx0b3NbIG9baV0gXS5yb3dzLnB1c2goIGkgKTtcblx0XHR9XG5cblx0XHRmb3IgKCBpIGluIG5zICkge1xuXHRcdFx0aWYgKCAhaGFzT3duLmNhbGwoIG5zLCBpICkgKSB7XG5cdFx0XHRcdGNvbnRpbnVlO1xuXHRcdFx0fVxuXHRcdFx0aWYgKCBuc1tpXS5yb3dzLmxlbmd0aCA9PSAxICYmIHR5cGVvZiBvc1tpXSAhPSBcInVuZGVmaW5lZFwiICYmIG9zW2ldLnJvd3MubGVuZ3RoID09IDEgKSB7XG5cdFx0XHRcdG5bIG5zW2ldLnJvd3NbMF0gXSA9IHtcblx0XHRcdFx0XHR0ZXh0OiBuWyBuc1tpXS5yb3dzWzBdIF0sXG5cdFx0XHRcdFx0cm93OiBvc1tpXS5yb3dzWzBdXG5cdFx0XHRcdH07XG5cdFx0XHRcdG9bIG9zW2ldLnJvd3NbMF0gXSA9IHtcblx0XHRcdFx0XHR0ZXh0OiBvWyBvc1tpXS5yb3dzWzBdIF0sXG5cdFx0XHRcdFx0cm93OiBuc1tpXS5yb3dzWzBdXG5cdFx0XHRcdH07XG5cdFx0XHR9XG5cdFx0fVxuXG5cdFx0Zm9yICggaSA9IDA7IGkgPCBuLmxlbmd0aCAtIDE7IGkrKyApIHtcblx0XHRcdGlmICggbltpXS50ZXh0ICE9IG51bGwgJiYgblsgaSArIDEgXS50ZXh0ID09IG51bGwgJiYgbltpXS5yb3cgKyAxIDwgby5sZW5ndGggJiYgb1sgbltpXS5yb3cgKyAxIF0udGV4dCA9PSBudWxsICYmXG5cdFx0XHRcdFx0XHRuWyBpICsgMSBdID09IG9bIG5baV0ucm93ICsgMSBdICkge1xuXG5cdFx0XHRcdG5bIGkgKyAxIF0gPSB7XG5cdFx0XHRcdFx0dGV4dDogblsgaSArIDEgXSxcblx0XHRcdFx0XHRyb3c6IG5baV0ucm93ICsgMVxuXHRcdFx0XHR9O1xuXHRcdFx0XHRvWyBuW2ldLnJvdyArIDEgXSA9IHtcblx0XHRcdFx0XHR0ZXh0OiBvWyBuW2ldLnJvdyArIDEgXSxcblx0XHRcdFx0XHRyb3c6IGkgKyAxXG5cdFx0XHRcdH07XG5cdFx0XHR9XG5cdFx0fVxuXG5cdFx0Zm9yICggaSA9IG4ubGVuZ3RoIC0gMTsgaSA+IDA7IGktLSApIHtcblx0XHRcdGlmICggbltpXS50ZXh0ICE9IG51bGwgJiYgblsgaSAtIDEgXS50ZXh0ID09IG51bGwgJiYgbltpXS5yb3cgPiAwICYmIG9bIG5baV0ucm93IC0gMSBdLnRleHQgPT0gbnVsbCAmJlxuXHRcdFx0XHRcdFx0blsgaSAtIDEgXSA9PSBvWyBuW2ldLnJvdyAtIDEgXSkge1xuXG5cdFx0XHRcdG5bIGkgLSAxIF0gPSB7XG5cdFx0XHRcdFx0dGV4dDogblsgaSAtIDEgXSxcblx0XHRcdFx0XHRyb3c6IG5baV0ucm93IC0gMVxuXHRcdFx0XHR9O1xuXHRcdFx0XHRvWyBuW2ldLnJvdyAtIDEgXSA9IHtcblx0XHRcdFx0XHR0ZXh0OiBvWyBuW2ldLnJvdyAtIDEgXSxcblx0XHRcdFx0XHRyb3c6IGkgLSAxXG5cdFx0XHRcdH07XG5cdFx0XHR9XG5cdFx0fVxuXG5cdFx0cmV0dXJuIHtcblx0XHRcdG86IG8sXG5cdFx0XHRuOiBuXG5cdFx0fTtcblx0fVxuXG5cdHJldHVybiBmdW5jdGlvbiggbywgbiApIHtcblx0XHRvID0gby5yZXBsYWNlKCAvXFxzKyQvLCBcIlwiICk7XG5cdFx0biA9IG4ucmVwbGFjZSggL1xccyskLywgXCJcIiApO1xuXG5cdFx0dmFyIGksIHByZSxcblx0XHRcdHN0ciA9IFwiXCIsXG5cdFx0XHRvdXQgPSBkaWZmKCBvID09PSBcIlwiID8gW10gOiBvLnNwbGl0KC9cXHMrLyksIG4gPT09IFwiXCIgPyBbXSA6IG4uc3BsaXQoL1xccysvKSApLFxuXHRcdFx0b1NwYWNlID0gby5tYXRjaCgvXFxzKy9nKSxcblx0XHRcdG5TcGFjZSA9IG4ubWF0Y2goL1xccysvZyk7XG5cblx0XHRpZiAoIG9TcGFjZSA9PSBudWxsICkge1xuXHRcdFx0b1NwYWNlID0gWyBcIiBcIiBdO1xuXHRcdH1cblx0XHRlbHNlIHtcblx0XHRcdG9TcGFjZS5wdXNoKCBcIiBcIiApO1xuXHRcdH1cblxuXHRcdGlmICggblNwYWNlID09IG51bGwgKSB7XG5cdFx0XHRuU3BhY2UgPSBbIFwiIFwiIF07XG5cdFx0fVxuXHRcdGVsc2Uge1xuXHRcdFx0blNwYWNlLnB1c2goIFwiIFwiICk7XG5cdFx0fVxuXG5cdFx0aWYgKCBvdXQubi5sZW5ndGggPT09IDAgKSB7XG5cdFx0XHRmb3IgKCBpID0gMDsgaSA8IG91dC5vLmxlbmd0aDsgaSsrICkge1xuXHRcdFx0XHRzdHIgKz0gXCI8ZGVsPlwiICsgb3V0Lm9baV0gKyBvU3BhY2VbaV0gKyBcIjwvZGVsPlwiO1xuXHRcdFx0fVxuXHRcdH1cblx0XHRlbHNlIHtcblx0XHRcdGlmICggb3V0Lm5bMF0udGV4dCA9PSBudWxsICkge1xuXHRcdFx0XHRmb3IgKCBuID0gMDsgbiA8IG91dC5vLmxlbmd0aCAmJiBvdXQub1tuXS50ZXh0ID09IG51bGw7IG4rKyApIHtcblx0XHRcdFx0XHRzdHIgKz0gXCI8ZGVsPlwiICsgb3V0Lm9bbl0gKyBvU3BhY2Vbbl0gKyBcIjwvZGVsPlwiO1xuXHRcdFx0XHR9XG5cdFx0XHR9XG5cblx0XHRcdGZvciAoIGkgPSAwOyBpIDwgb3V0Lm4ubGVuZ3RoOyBpKysgKSB7XG5cdFx0XHRcdGlmIChvdXQubltpXS50ZXh0ID09IG51bGwpIHtcblx0XHRcdFx0XHRzdHIgKz0gXCI8aW5zPlwiICsgb3V0Lm5baV0gKyBuU3BhY2VbaV0gKyBcIjwvaW5zPlwiO1xuXHRcdFx0XHR9XG5cdFx0XHRcdGVsc2Uge1xuXHRcdFx0XHRcdC8vIGBwcmVgIGluaXRpYWxpemVkIGF0IHRvcCBvZiBzY29wZVxuXHRcdFx0XHRcdHByZSA9IFwiXCI7XG5cblx0XHRcdFx0XHRmb3IgKCBuID0gb3V0Lm5baV0ucm93ICsgMTsgbiA8IG91dC5vLmxlbmd0aCAmJiBvdXQub1tuXS50ZXh0ID09IG51bGw7IG4rKyApIHtcblx0XHRcdFx0XHRcdHByZSArPSBcIjxkZWw+XCIgKyBvdXQub1tuXSArIG9TcGFjZVtuXSArIFwiPC9kZWw+XCI7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHRcdHN0ciArPSBcIiBcIiArIG91dC5uW2ldLnRleHQgKyBuU3BhY2VbaV0gKyBwcmU7XG5cdFx0XHRcdH1cblx0XHRcdH1cblx0XHR9XG5cblx0XHRyZXR1cm4gc3RyO1xuXHR9O1xufSgpKTtcblxuLy8gZm9yIENvbW1vbkpTIGVudmlyb21lbnRzLCBleHBvcnQgZXZlcnl0aGluZ1xuaWYgKCB0eXBlb2YgZXhwb3J0cyAhPT0gXCJ1bmRlZmluZWRcIiApIHtcblx0ZXh0ZW5kKGV4cG9ydHMsIFFVbml0KTtcbn1cblxuLy8gZ2V0IGF0IHdoYXRldmVyIHRoZSBnbG9iYWwgb2JqZWN0IGlzLCBsaWtlIHdpbmRvdyBpbiBicm93c2Vyc1xufSggKGZ1bmN0aW9uKCkge3JldHVybiB0aGlzO30uY2FsbCgpKSApKTtcbiJdLCJmaWxlIjoibW9kZXJuaXpyL3Rlc3QvcXVuaXQvcXVuaXQuanMiLCJzb3VyY2VSb290IjoiL3NvdXJjZS8ifQ==