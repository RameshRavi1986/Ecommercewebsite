/**
* Wait until the test condition is true or a timeout occurs. Useful for waiting
* on a server response or for a ui change (fadeIn, etc.) to occur.
*
* @param testFx javascript condition that evaluates to a boolean,
* it can be passed in as a string (e.g.: "1 == 1" or "$('#bar').is(':visible')" or
* as a callback function.
* @param onReady what to do when testFx condition is fulfilled,
* it can be passed in as a string (e.g.: "1 == 1" or "$('#bar').is(':visible')" or
* as a callback function.
* @param timeOutMillis the max amount of time to wait. If not specified, 3 sec is used.
*/
function waitFor(testFx, onReady, timeOutMillis) {
    var maxtimeOutMillis = timeOutMillis ? timeOutMillis : 3001, //< Default Max Timout is 3s
        start = new Date().getTime(),
        condition = false,
        interval = setInterval(function() {
            if ( (new Date().getTime() - start < maxtimeOutMillis) && !condition ) {
                // If not time-out yet and condition not yet fulfilled
                condition = (typeof(testFx) === "string" ? eval(testFx) : testFx()); //< defensive code
            } else {
                if(!condition) {
                    // If condition still not fulfilled (timeout but condition is 'false')
                    console.log("'waitFor()' timeout");
                    phantom.exit(1);
                } else {
                    // Condition fulfilled (timeout and/or condition is 'true')
                    typeof(onReady) === "string" ? eval(onReady) : onReady(); //< Do what it's supposed to do once the condition is fulfilled
                    clearInterval(interval); //< Stop this interval
                }
            }
        }, 100); //< repeat check every 250ms
};


if (phantom.args.length === 0 || phantom.args.length > 2) {
    console.log('Usage: run-qunit.js URL');
    phantom.exit();
}

var page = new WebPage();

// Route "console.log()" calls from within the Page context to the main Phantom context (i.e. current "this")
page.onConsoleMessage = function(msg) {
    console.log(msg);
};

page.open(phantom.args[0], function(status){
    if (status !== "success") {
        console.log("Unable to access network");
        phantom.exit();
    } else {
        waitFor(function(){
            return page.evaluate(function(){
                var el = document.getElementById('qunit-testresult');
                if (el && el.innerText.match('completed')) {
                    return true;
                }
                return false;
            });
        }, function(){
            var failedNum = page.evaluate(function(){
                var el = document.getElementById('qunit-testresult');
                try {
                    return el.getElementsByClassName('failed')[0].innerHTML;
                } catch (e) { }
                return 10000;
            });
            phantom.exit((parseInt(failedNum, 10) > 0) ? 1 : 0);
        });
    }
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiIiwic291cmNlcyI6WyJtb2Rlcm5penIvdGVzdC9xdW5pdC9ydW4tcXVuaXQuanMiXSwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4qIFdhaXQgdW50aWwgdGhlIHRlc3QgY29uZGl0aW9uIGlzIHRydWUgb3IgYSB0aW1lb3V0IG9jY3Vycy4gVXNlZnVsIGZvciB3YWl0aW5nXG4qIG9uIGEgc2VydmVyIHJlc3BvbnNlIG9yIGZvciBhIHVpIGNoYW5nZSAoZmFkZUluLCBldGMuKSB0byBvY2N1ci5cbipcbiogQHBhcmFtIHRlc3RGeCBqYXZhc2NyaXB0IGNvbmRpdGlvbiB0aGF0IGV2YWx1YXRlcyB0byBhIGJvb2xlYW4sXG4qIGl0IGNhbiBiZSBwYXNzZWQgaW4gYXMgYSBzdHJpbmcgKGUuZy46IFwiMSA9PSAxXCIgb3IgXCIkKCcjYmFyJykuaXMoJzp2aXNpYmxlJylcIiBvclxuKiBhcyBhIGNhbGxiYWNrIGZ1bmN0aW9uLlxuKiBAcGFyYW0gb25SZWFkeSB3aGF0IHRvIGRvIHdoZW4gdGVzdEZ4IGNvbmRpdGlvbiBpcyBmdWxmaWxsZWQsXG4qIGl0IGNhbiBiZSBwYXNzZWQgaW4gYXMgYSBzdHJpbmcgKGUuZy46IFwiMSA9PSAxXCIgb3IgXCIkKCcjYmFyJykuaXMoJzp2aXNpYmxlJylcIiBvclxuKiBhcyBhIGNhbGxiYWNrIGZ1bmN0aW9uLlxuKiBAcGFyYW0gdGltZU91dE1pbGxpcyB0aGUgbWF4IGFtb3VudCBvZiB0aW1lIHRvIHdhaXQuIElmIG5vdCBzcGVjaWZpZWQsIDMgc2VjIGlzIHVzZWQuXG4qL1xuZnVuY3Rpb24gd2FpdEZvcih0ZXN0RngsIG9uUmVhZHksIHRpbWVPdXRNaWxsaXMpIHtcbiAgICB2YXIgbWF4dGltZU91dE1pbGxpcyA9IHRpbWVPdXRNaWxsaXMgPyB0aW1lT3V0TWlsbGlzIDogMzAwMSwgLy88IERlZmF1bHQgTWF4IFRpbW91dCBpcyAzc1xuICAgICAgICBzdGFydCA9IG5ldyBEYXRlKCkuZ2V0VGltZSgpLFxuICAgICAgICBjb25kaXRpb24gPSBmYWxzZSxcbiAgICAgICAgaW50ZXJ2YWwgPSBzZXRJbnRlcnZhbChmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIGlmICggKG5ldyBEYXRlKCkuZ2V0VGltZSgpIC0gc3RhcnQgPCBtYXh0aW1lT3V0TWlsbGlzKSAmJiAhY29uZGl0aW9uICkge1xuICAgICAgICAgICAgICAgIC8vIElmIG5vdCB0aW1lLW91dCB5ZXQgYW5kIGNvbmRpdGlvbiBub3QgeWV0IGZ1bGZpbGxlZFxuICAgICAgICAgICAgICAgIGNvbmRpdGlvbiA9ICh0eXBlb2YodGVzdEZ4KSA9PT0gXCJzdHJpbmdcIiA/IGV2YWwodGVzdEZ4KSA6IHRlc3RGeCgpKTsgLy88IGRlZmVuc2l2ZSBjb2RlXG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIGlmKCFjb25kaXRpb24pIHtcbiAgICAgICAgICAgICAgICAgICAgLy8gSWYgY29uZGl0aW9uIHN0aWxsIG5vdCBmdWxmaWxsZWQgKHRpbWVvdXQgYnV0IGNvbmRpdGlvbiBpcyAnZmFsc2UnKVxuICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcIid3YWl0Rm9yKCknIHRpbWVvdXRcIik7XG4gICAgICAgICAgICAgICAgICAgIHBoYW50b20uZXhpdCgxKTtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAvLyBDb25kaXRpb24gZnVsZmlsbGVkICh0aW1lb3V0IGFuZC9vciBjb25kaXRpb24gaXMgJ3RydWUnKVxuICAgICAgICAgICAgICAgICAgICB0eXBlb2Yob25SZWFkeSkgPT09IFwic3RyaW5nXCIgPyBldmFsKG9uUmVhZHkpIDogb25SZWFkeSgpOyAvLzwgRG8gd2hhdCBpdCdzIHN1cHBvc2VkIHRvIGRvIG9uY2UgdGhlIGNvbmRpdGlvbiBpcyBmdWxmaWxsZWRcbiAgICAgICAgICAgICAgICAgICAgY2xlYXJJbnRlcnZhbChpbnRlcnZhbCk7IC8vPCBTdG9wIHRoaXMgaW50ZXJ2YWxcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH0sIDEwMCk7IC8vPCByZXBlYXQgY2hlY2sgZXZlcnkgMjUwbXNcbn07XG5cblxuaWYgKHBoYW50b20uYXJncy5sZW5ndGggPT09IDAgfHwgcGhhbnRvbS5hcmdzLmxlbmd0aCA+IDIpIHtcbiAgICBjb25zb2xlLmxvZygnVXNhZ2U6IHJ1bi1xdW5pdC5qcyBVUkwnKTtcbiAgICBwaGFudG9tLmV4aXQoKTtcbn1cblxudmFyIHBhZ2UgPSBuZXcgV2ViUGFnZSgpO1xuXG4vLyBSb3V0ZSBcImNvbnNvbGUubG9nKClcIiBjYWxscyBmcm9tIHdpdGhpbiB0aGUgUGFnZSBjb250ZXh0IHRvIHRoZSBtYWluIFBoYW50b20gY29udGV4dCAoaS5lLiBjdXJyZW50IFwidGhpc1wiKVxucGFnZS5vbkNvbnNvbGVNZXNzYWdlID0gZnVuY3Rpb24obXNnKSB7XG4gICAgY29uc29sZS5sb2cobXNnKTtcbn07XG5cbnBhZ2Uub3BlbihwaGFudG9tLmFyZ3NbMF0sIGZ1bmN0aW9uKHN0YXR1cyl7XG4gICAgaWYgKHN0YXR1cyAhPT0gXCJzdWNjZXNzXCIpIHtcbiAgICAgICAgY29uc29sZS5sb2coXCJVbmFibGUgdG8gYWNjZXNzIG5ldHdvcmtcIik7XG4gICAgICAgIHBoYW50b20uZXhpdCgpO1xuICAgIH0gZWxzZSB7XG4gICAgICAgIHdhaXRGb3IoZnVuY3Rpb24oKXtcbiAgICAgICAgICAgIHJldHVybiBwYWdlLmV2YWx1YXRlKGZ1bmN0aW9uKCl7XG4gICAgICAgICAgICAgICAgdmFyIGVsID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3F1bml0LXRlc3RyZXN1bHQnKTtcbiAgICAgICAgICAgICAgICBpZiAoZWwgJiYgZWwuaW5uZXJUZXh0Lm1hdGNoKCdjb21wbGV0ZWQnKSkge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH0sIGZ1bmN0aW9uKCl7XG4gICAgICAgICAgICB2YXIgZmFpbGVkTnVtID0gcGFnZS5ldmFsdWF0ZShmdW5jdGlvbigpe1xuICAgICAgICAgICAgICAgIHZhciBlbCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdxdW5pdC10ZXN0cmVzdWx0Jyk7XG4gICAgICAgICAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGVsLmdldEVsZW1lbnRzQnlDbGFzc05hbWUoJ2ZhaWxlZCcpWzBdLmlubmVySFRNTDtcbiAgICAgICAgICAgICAgICB9IGNhdGNoIChlKSB7IH1cbiAgICAgICAgICAgICAgICByZXR1cm4gMTAwMDA7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIHBoYW50b20uZXhpdCgocGFyc2VJbnQoZmFpbGVkTnVtLCAxMCkgPiAwKSA/IDEgOiAwKTtcbiAgICAgICAgfSk7XG4gICAgfVxufSk7Il0sImZpbGUiOiJtb2Rlcm5penIvdGVzdC9xdW5pdC9ydW4tcXVuaXQuanMiLCJzb3VyY2VSb290IjoiL3NvdXJjZS8ifQ==