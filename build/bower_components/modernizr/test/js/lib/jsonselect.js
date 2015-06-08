/*! Copyright (c) 2011, Lloyd Hilaiel, ISC License */
/*
 * This is the JSONSelect reference implementation, in javascript.
 */
(function(exports) {

    var // localize references
    toString = Object.prototype.toString;

    function jsonParse(str) {
      try {
          if(JSON && JSON.parse){
              return JSON.parse(str);
          }
          return (new Function("return " + str))();
      } catch(e) {
        te("ijs");
      }
    }

    // emitted error codes.
    var errorCodes = {
        "ijs": "invalid json string",
        "mpc": "multiple pseudo classes (:xxx) not allowed",
        "mepf": "malformed expression in pseudo-function",
        "nmi": "multiple ids not allowed",
        "se": "selector expected",
        "sra": "string required after '.'",
        "uc": "unrecognized char",
        "ujs": "unclosed json string",
        "upc": "unrecognized pseudo class"
    };

    // throw an error message
    function te(ec) {
        throw new Error(errorCodes[ec]);
    }

    // THE LEXER
    var toks = {
        psc: 1, // pseudo class
        psf: 2, // pseudo class function
        typ: 3, // type
        str: 4 // string
    };

    var pat = /^(?:([\r\n\t\ ]+)|([*.,>])|(string|boolean|null|array|object|number)|(:(?:root|first-child|last-child|only-child))|(:(?:nth-child|nth-last-child))|(:\w+)|(\"(?:[^\\]|\\[^\"])*\")|(\")|((?:[_a-zA-Z]|[^\0-\0177]|\\[^\r\n\f0-9a-fA-F])(?:[_a-zA-Z0-9\-]|[^\u0000-\u0177]|(?:\\[^\r\n\f0-9a-fA-F]))*))/;
    var exprPat = /^\s*\(\s*(?:([+\-]?)([0-9]*)n\s*(?:([+\-])\s*([0-9]))?|(odd|even)|([+\-]?[0-9]+))\s*\)/;
    var lex = function (str, off) {
        if (!off) off = 0;
        var m = pat.exec(str.substr(off));
        if (!m) return undefined;
        off+=m[0].length;
        var a;
        if (m[1]) a = [off, " "];
        else if (m[2]) a = [off, m[0]];
        else if (m[3]) a = [off, toks.typ, m[0]];
        else if (m[4]) a = [off, toks.psc, m[0]];
        else if (m[5]) a = [off, toks.psf, m[0]];
        else if (m[6]) te("upc");
        else if (m[7]) a = [off, toks.str, jsonParse(m[0])];
        else if (m[8]) te("ujs");
        else if (m[9]) a = [off, toks.str, m[0].replace(/\\([^\r\n\f0-9a-fA-F])/g,"$1")];
        return a;
    };

    // THE PARSER

    var parse = function (str) {
        var a = [], off = 0, am;

        while (true) {
            var s = parse_selector(str, off);
            a.push(s[1]);
            s = lex(str, off = s[0]);
            if (s && s[1] === " ") s = lex(str, off = s[0]);
            if (!s) break;
            // now we've parsed a selector, and have something else...
            if (s[1] === ">") {
                a.push(">");
                off = s[0];
            } else if (s[1] === ",") {
                if (am === undefined) am = [ ",", a ];
                else am.push(a);
                a = [];
                off = s[0];
            }
        }
        if (am) am.push(a);
        return am ? am : a;
    };

    var parse_selector = function(str, off) {
        var soff = off;
        var s = { };
        var l = lex(str, off);
        // skip space
        if (l && l[1] === " ") { soff = off = l[0]; l = lex(str, off); }
        if (l && l[1] === toks.typ) {
            s.type = l[2];
            l = lex(str, (off = l[0]));
        } else if (l && l[1] === "*") {
            // don't bother representing the universal sel, '*' in the
            // parse tree, cause it's the default
            l = lex(str, (off = l[0]));
        }

        // now support either an id or a pc
        while (true) {
            if (l === undefined) {
                break;
            } else if (l[1] === ".") {
                l = lex(str, (off = l[0]));
                if (!l || l[1] !== toks.str) te("sra");
                if (s.id) te("nmi");
                s.id = l[2];
            } else if (l[1] === toks.psc) {
                if (s.pc || s.pf) te("mpc");
                // collapse first-child and last-child into nth-child expressions
                if (l[2] === ":first-child") {
                    s.pf = ":nth-child";
                    s.a = 0;
                    s.b = 1;
                } else if (l[2] === ":last-child") {
                    s.pf = ":nth-last-child";
                    s.a = 0;
                    s.b = 1;
                } else {
                    s.pc = l[2];
                }
            } else if (l[1] === toks.psf) {
                if (s.pc || s.pf ) te("mpc");
                s.pf = l[2];
                var m = exprPat.exec(str.substr(l[0]));
                if (!m) te("mepf");
                if (m[5]) {
                    s.a = 2;
                    s.b = (m[5] === "odd") ? 1 : 0;
                } else if (m[6]) {
                    s.a = 0;
                    s.b = parseInt(m[6], 10);
                } else {
                    s.a = parseInt((m[1] ? m[1] : "+") + (m[2] ? m[2] : "1"),10);
                    s.b = m[3] ? parseInt(m[3] + m[4],10) : 0;
                }
                l[0] += m[0].length;
            } else {
                break;
            }
            l = lex(str, (off = l[0]));
        }

        // now if we didn't actually parse anything it's an error
        if (soff === off) te("se");

        return [off, s];
    };

    // THE EVALUATOR

    function isArray(o) {
        return Array.isArray ? Array.isArray(o) : 
          toString.call(o) === "[object Array]";
    }

    function mytypeof(o) {
        if (o === null) return "null";
        var to = typeof o;
        if (to === "object" && isArray(o)) to = "array";
        return to;
    }

    function mn(node, sel, id, num, tot) {
        var sels = [];
        var cs = (sel[0] === ">") ? sel[1] : sel[0];
        var m = true, mod;
        if (cs.type) m = m && (cs.type === mytypeof(node));
        if (cs.id)   m = m && (cs.id === id);
        if (m && cs.pf) {
            if (cs.pf === ":nth-last-child") num = tot - num;
            else num++;
            if (cs.a === 0) {
                m = cs.b === num;
            } else {
                mod = ((num - cs.b) % cs.a);

                m = (!mod && ((num*cs.a + cs.b) >= 0));
            }
        }

        // should we repeat this selector for descendants?
        if (sel[0] !== ">" && sel[0].pc !== ":root") sels.push(sel);

        if (m) {
            // is there a fragment that we should pass down?
            if (sel[0] === ">") { if (sel.length > 2) { m = false; sels.push(sel.slice(2)); } }
            else if (sel.length > 1) { m = false; sels.push(sel.slice(1)); }
        }

        return [m, sels];
    }

    function forEach(sel, obj, fun, id, num, tot) {
        var a = (sel[0] === ",") ? sel.slice(1) : [sel],
        a0 = [],
        call = false,
        i = 0, j = 0, l = 0, k, x;
        for (i = 0; i < a.length; i++) {
            x = mn(obj, a[i], id, num, tot);
            if (x[0]) {
                call = true;
            }
            for (j = 0; j < x[1].length; j++) {
                a0.push(x[1][j]);
            }
        }
        if (a0.length && typeof obj === "object") {
            if (a0.length >= 1) {
                a0.unshift(",");
            }
            if (isArray(obj)) {
                for (i = 0; i < obj.length; i++) {
                    forEach(a0, obj[i], fun, undefined, i, obj.length);
                }
            } else {
                // it's a shame to do this for :last-child and other
                // properties which count from the end when we don't
                // even know if they're present.  Also, the stream
                // parser is going to be pissed.
                l = 0;
                for (k in obj) {
                    if (obj.hasOwnProperty(k)) {
                        l++;
                    }
                }
                i = 0;
                for (k in obj) {
                    if (obj.hasOwnProperty(k)) {
                        forEach(a0, obj[k], fun, k, i++, l);
                    }
                }
            }
        }
        if (call && fun) {
            fun(obj);
        }
    }

    function match(sel, obj) {
        var a = [];
        forEach(sel, obj, function(x) {
            a.push(x);
        });
        return a;
    }

    function compile(sel) {
        return {
            sel: parse(sel),
            match: function(obj){
                return match(this.sel, obj);
            },
            forEach: function(obj, fun) {
                return forEach(this.sel, obj, fun);
            }
        };
    }

    exports._lex = lex;
    exports._parse = parse;
    exports.match = function (sel, obj) {
        return compile(sel).match(obj);
    };
    exports.forEach = function(sel, obj, fun) {
        return compile(sel).forEach(obj, fun);
    };
    exports.compile = compile;
})(typeof exports === "undefined" ? (window.JSONSelect = {}) : exports);


//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiIiwic291cmNlcyI6WyJtb2Rlcm5penIvdGVzdC9qcy9saWIvanNvbnNlbGVjdC5qcyJdLCJzb3VyY2VzQ29udGVudCI6WyIvKiEgQ29weXJpZ2h0IChjKSAyMDExLCBMbG95ZCBIaWxhaWVsLCBJU0MgTGljZW5zZSAqL1xuLypcbiAqIFRoaXMgaXMgdGhlIEpTT05TZWxlY3QgcmVmZXJlbmNlIGltcGxlbWVudGF0aW9uLCBpbiBqYXZhc2NyaXB0LlxuICovXG4oZnVuY3Rpb24oZXhwb3J0cykge1xuXG4gICAgdmFyIC8vIGxvY2FsaXplIHJlZmVyZW5jZXNcbiAgICB0b1N0cmluZyA9IE9iamVjdC5wcm90b3R5cGUudG9TdHJpbmc7XG5cbiAgICBmdW5jdGlvbiBqc29uUGFyc2Uoc3RyKSB7XG4gICAgICB0cnkge1xuICAgICAgICAgIGlmKEpTT04gJiYgSlNPTi5wYXJzZSl7XG4gICAgICAgICAgICAgIHJldHVybiBKU09OLnBhcnNlKHN0cik7XG4gICAgICAgICAgfVxuICAgICAgICAgIHJldHVybiAobmV3IEZ1bmN0aW9uKFwicmV0dXJuIFwiICsgc3RyKSkoKTtcbiAgICAgIH0gY2F0Y2goZSkge1xuICAgICAgICB0ZShcImlqc1wiKTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICAvLyBlbWl0dGVkIGVycm9yIGNvZGVzLlxuICAgIHZhciBlcnJvckNvZGVzID0ge1xuICAgICAgICBcImlqc1wiOiBcImludmFsaWQganNvbiBzdHJpbmdcIixcbiAgICAgICAgXCJtcGNcIjogXCJtdWx0aXBsZSBwc2V1ZG8gY2xhc3NlcyAoOnh4eCkgbm90IGFsbG93ZWRcIixcbiAgICAgICAgXCJtZXBmXCI6IFwibWFsZm9ybWVkIGV4cHJlc3Npb24gaW4gcHNldWRvLWZ1bmN0aW9uXCIsXG4gICAgICAgIFwibm1pXCI6IFwibXVsdGlwbGUgaWRzIG5vdCBhbGxvd2VkXCIsXG4gICAgICAgIFwic2VcIjogXCJzZWxlY3RvciBleHBlY3RlZFwiLFxuICAgICAgICBcInNyYVwiOiBcInN0cmluZyByZXF1aXJlZCBhZnRlciAnLidcIixcbiAgICAgICAgXCJ1Y1wiOiBcInVucmVjb2duaXplZCBjaGFyXCIsXG4gICAgICAgIFwidWpzXCI6IFwidW5jbG9zZWQganNvbiBzdHJpbmdcIixcbiAgICAgICAgXCJ1cGNcIjogXCJ1bnJlY29nbml6ZWQgcHNldWRvIGNsYXNzXCJcbiAgICB9O1xuXG4gICAgLy8gdGhyb3cgYW4gZXJyb3IgbWVzc2FnZVxuICAgIGZ1bmN0aW9uIHRlKGVjKSB7XG4gICAgICAgIHRocm93IG5ldyBFcnJvcihlcnJvckNvZGVzW2VjXSk7XG4gICAgfVxuXG4gICAgLy8gVEhFIExFWEVSXG4gICAgdmFyIHRva3MgPSB7XG4gICAgICAgIHBzYzogMSwgLy8gcHNldWRvIGNsYXNzXG4gICAgICAgIHBzZjogMiwgLy8gcHNldWRvIGNsYXNzIGZ1bmN0aW9uXG4gICAgICAgIHR5cDogMywgLy8gdHlwZVxuICAgICAgICBzdHI6IDQgLy8gc3RyaW5nXG4gICAgfTtcblxuICAgIHZhciBwYXQgPSAvXig/OihbXFxyXFxuXFx0XFwgXSspfChbKi4sPl0pfChzdHJpbmd8Ym9vbGVhbnxudWxsfGFycmF5fG9iamVjdHxudW1iZXIpfCg6KD86cm9vdHxmaXJzdC1jaGlsZHxsYXN0LWNoaWxkfG9ubHktY2hpbGQpKXwoOig/Om50aC1jaGlsZHxudGgtbGFzdC1jaGlsZCkpfCg6XFx3Kyl8KFxcXCIoPzpbXlxcXFxdfFxcXFxbXlxcXCJdKSpcXFwiKXwoXFxcIil8KCg/OltfYS16QS1aXXxbXlxcMC1cXDAxNzddfFxcXFxbXlxcclxcblxcZjAtOWEtZkEtRl0pKD86W19hLXpBLVowLTlcXC1dfFteXFx1MDAwMC1cXHUwMTc3XXwoPzpcXFxcW15cXHJcXG5cXGYwLTlhLWZBLUZdKSkqKSkvO1xuICAgIHZhciBleHByUGF0ID0gL15cXHMqXFwoXFxzKig/OihbK1xcLV0/KShbMC05XSopblxccyooPzooWytcXC1dKVxccyooWzAtOV0pKT98KG9kZHxldmVuKXwoWytcXC1dP1swLTldKykpXFxzKlxcKS87XG4gICAgdmFyIGxleCA9IGZ1bmN0aW9uIChzdHIsIG9mZikge1xuICAgICAgICBpZiAoIW9mZikgb2ZmID0gMDtcbiAgICAgICAgdmFyIG0gPSBwYXQuZXhlYyhzdHIuc3Vic3RyKG9mZikpO1xuICAgICAgICBpZiAoIW0pIHJldHVybiB1bmRlZmluZWQ7XG4gICAgICAgIG9mZis9bVswXS5sZW5ndGg7XG4gICAgICAgIHZhciBhO1xuICAgICAgICBpZiAobVsxXSkgYSA9IFtvZmYsIFwiIFwiXTtcbiAgICAgICAgZWxzZSBpZiAobVsyXSkgYSA9IFtvZmYsIG1bMF1dO1xuICAgICAgICBlbHNlIGlmIChtWzNdKSBhID0gW29mZiwgdG9rcy50eXAsIG1bMF1dO1xuICAgICAgICBlbHNlIGlmIChtWzRdKSBhID0gW29mZiwgdG9rcy5wc2MsIG1bMF1dO1xuICAgICAgICBlbHNlIGlmIChtWzVdKSBhID0gW29mZiwgdG9rcy5wc2YsIG1bMF1dO1xuICAgICAgICBlbHNlIGlmIChtWzZdKSB0ZShcInVwY1wiKTtcbiAgICAgICAgZWxzZSBpZiAobVs3XSkgYSA9IFtvZmYsIHRva3Muc3RyLCBqc29uUGFyc2UobVswXSldO1xuICAgICAgICBlbHNlIGlmIChtWzhdKSB0ZShcInVqc1wiKTtcbiAgICAgICAgZWxzZSBpZiAobVs5XSkgYSA9IFtvZmYsIHRva3Muc3RyLCBtWzBdLnJlcGxhY2UoL1xcXFwoW15cXHJcXG5cXGYwLTlhLWZBLUZdKS9nLFwiJDFcIildO1xuICAgICAgICByZXR1cm4gYTtcbiAgICB9O1xuXG4gICAgLy8gVEhFIFBBUlNFUlxuXG4gICAgdmFyIHBhcnNlID0gZnVuY3Rpb24gKHN0cikge1xuICAgICAgICB2YXIgYSA9IFtdLCBvZmYgPSAwLCBhbTtcblxuICAgICAgICB3aGlsZSAodHJ1ZSkge1xuICAgICAgICAgICAgdmFyIHMgPSBwYXJzZV9zZWxlY3RvcihzdHIsIG9mZik7XG4gICAgICAgICAgICBhLnB1c2goc1sxXSk7XG4gICAgICAgICAgICBzID0gbGV4KHN0ciwgb2ZmID0gc1swXSk7XG4gICAgICAgICAgICBpZiAocyAmJiBzWzFdID09PSBcIiBcIikgcyA9IGxleChzdHIsIG9mZiA9IHNbMF0pO1xuICAgICAgICAgICAgaWYgKCFzKSBicmVhaztcbiAgICAgICAgICAgIC8vIG5vdyB3ZSd2ZSBwYXJzZWQgYSBzZWxlY3RvciwgYW5kIGhhdmUgc29tZXRoaW5nIGVsc2UuLi5cbiAgICAgICAgICAgIGlmIChzWzFdID09PSBcIj5cIikge1xuICAgICAgICAgICAgICAgIGEucHVzaChcIj5cIik7XG4gICAgICAgICAgICAgICAgb2ZmID0gc1swXTtcbiAgICAgICAgICAgIH0gZWxzZSBpZiAoc1sxXSA9PT0gXCIsXCIpIHtcbiAgICAgICAgICAgICAgICBpZiAoYW0gPT09IHVuZGVmaW5lZCkgYW0gPSBbIFwiLFwiLCBhIF07XG4gICAgICAgICAgICAgICAgZWxzZSBhbS5wdXNoKGEpO1xuICAgICAgICAgICAgICAgIGEgPSBbXTtcbiAgICAgICAgICAgICAgICBvZmYgPSBzWzBdO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIGlmIChhbSkgYW0ucHVzaChhKTtcbiAgICAgICAgcmV0dXJuIGFtID8gYW0gOiBhO1xuICAgIH07XG5cbiAgICB2YXIgcGFyc2Vfc2VsZWN0b3IgPSBmdW5jdGlvbihzdHIsIG9mZikge1xuICAgICAgICB2YXIgc29mZiA9IG9mZjtcbiAgICAgICAgdmFyIHMgPSB7IH07XG4gICAgICAgIHZhciBsID0gbGV4KHN0ciwgb2ZmKTtcbiAgICAgICAgLy8gc2tpcCBzcGFjZVxuICAgICAgICBpZiAobCAmJiBsWzFdID09PSBcIiBcIikgeyBzb2ZmID0gb2ZmID0gbFswXTsgbCA9IGxleChzdHIsIG9mZik7IH1cbiAgICAgICAgaWYgKGwgJiYgbFsxXSA9PT0gdG9rcy50eXApIHtcbiAgICAgICAgICAgIHMudHlwZSA9IGxbMl07XG4gICAgICAgICAgICBsID0gbGV4KHN0ciwgKG9mZiA9IGxbMF0pKTtcbiAgICAgICAgfSBlbHNlIGlmIChsICYmIGxbMV0gPT09IFwiKlwiKSB7XG4gICAgICAgICAgICAvLyBkb24ndCBib3RoZXIgcmVwcmVzZW50aW5nIHRoZSB1bml2ZXJzYWwgc2VsLCAnKicgaW4gdGhlXG4gICAgICAgICAgICAvLyBwYXJzZSB0cmVlLCBjYXVzZSBpdCdzIHRoZSBkZWZhdWx0XG4gICAgICAgICAgICBsID0gbGV4KHN0ciwgKG9mZiA9IGxbMF0pKTtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIG5vdyBzdXBwb3J0IGVpdGhlciBhbiBpZCBvciBhIHBjXG4gICAgICAgIHdoaWxlICh0cnVlKSB7XG4gICAgICAgICAgICBpZiAobCA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICB9IGVsc2UgaWYgKGxbMV0gPT09IFwiLlwiKSB7XG4gICAgICAgICAgICAgICAgbCA9IGxleChzdHIsIChvZmYgPSBsWzBdKSk7XG4gICAgICAgICAgICAgICAgaWYgKCFsIHx8IGxbMV0gIT09IHRva3Muc3RyKSB0ZShcInNyYVwiKTtcbiAgICAgICAgICAgICAgICBpZiAocy5pZCkgdGUoXCJubWlcIik7XG4gICAgICAgICAgICAgICAgcy5pZCA9IGxbMl07XG4gICAgICAgICAgICB9IGVsc2UgaWYgKGxbMV0gPT09IHRva3MucHNjKSB7XG4gICAgICAgICAgICAgICAgaWYgKHMucGMgfHwgcy5wZikgdGUoXCJtcGNcIik7XG4gICAgICAgICAgICAgICAgLy8gY29sbGFwc2UgZmlyc3QtY2hpbGQgYW5kIGxhc3QtY2hpbGQgaW50byBudGgtY2hpbGQgZXhwcmVzc2lvbnNcbiAgICAgICAgICAgICAgICBpZiAobFsyXSA9PT0gXCI6Zmlyc3QtY2hpbGRcIikge1xuICAgICAgICAgICAgICAgICAgICBzLnBmID0gXCI6bnRoLWNoaWxkXCI7XG4gICAgICAgICAgICAgICAgICAgIHMuYSA9IDA7XG4gICAgICAgICAgICAgICAgICAgIHMuYiA9IDE7XG4gICAgICAgICAgICAgICAgfSBlbHNlIGlmIChsWzJdID09PSBcIjpsYXN0LWNoaWxkXCIpIHtcbiAgICAgICAgICAgICAgICAgICAgcy5wZiA9IFwiOm50aC1sYXN0LWNoaWxkXCI7XG4gICAgICAgICAgICAgICAgICAgIHMuYSA9IDA7XG4gICAgICAgICAgICAgICAgICAgIHMuYiA9IDE7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgcy5wYyA9IGxbMl07XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSBlbHNlIGlmIChsWzFdID09PSB0b2tzLnBzZikge1xuICAgICAgICAgICAgICAgIGlmIChzLnBjIHx8IHMucGYgKSB0ZShcIm1wY1wiKTtcbiAgICAgICAgICAgICAgICBzLnBmID0gbFsyXTtcbiAgICAgICAgICAgICAgICB2YXIgbSA9IGV4cHJQYXQuZXhlYyhzdHIuc3Vic3RyKGxbMF0pKTtcbiAgICAgICAgICAgICAgICBpZiAoIW0pIHRlKFwibWVwZlwiKTtcbiAgICAgICAgICAgICAgICBpZiAobVs1XSkge1xuICAgICAgICAgICAgICAgICAgICBzLmEgPSAyO1xuICAgICAgICAgICAgICAgICAgICBzLmIgPSAobVs1XSA9PT0gXCJvZGRcIikgPyAxIDogMDtcbiAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKG1bNl0pIHtcbiAgICAgICAgICAgICAgICAgICAgcy5hID0gMDtcbiAgICAgICAgICAgICAgICAgICAgcy5iID0gcGFyc2VJbnQobVs2XSwgMTApO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIHMuYSA9IHBhcnNlSW50KChtWzFdID8gbVsxXSA6IFwiK1wiKSArIChtWzJdID8gbVsyXSA6IFwiMVwiKSwxMCk7XG4gICAgICAgICAgICAgICAgICAgIHMuYiA9IG1bM10gPyBwYXJzZUludChtWzNdICsgbVs0XSwxMCkgOiAwO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBsWzBdICs9IG1bMF0ubGVuZ3RoO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGwgPSBsZXgoc3RyLCAob2ZmID0gbFswXSkpO1xuICAgICAgICB9XG5cbiAgICAgICAgLy8gbm93IGlmIHdlIGRpZG4ndCBhY3R1YWxseSBwYXJzZSBhbnl0aGluZyBpdCdzIGFuIGVycm9yXG4gICAgICAgIGlmIChzb2ZmID09PSBvZmYpIHRlKFwic2VcIik7XG5cbiAgICAgICAgcmV0dXJuIFtvZmYsIHNdO1xuICAgIH07XG5cbiAgICAvLyBUSEUgRVZBTFVBVE9SXG5cbiAgICBmdW5jdGlvbiBpc0FycmF5KG8pIHtcbiAgICAgICAgcmV0dXJuIEFycmF5LmlzQXJyYXkgPyBBcnJheS5pc0FycmF5KG8pIDogXG4gICAgICAgICAgdG9TdHJpbmcuY2FsbChvKSA9PT0gXCJbb2JqZWN0IEFycmF5XVwiO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIG15dHlwZW9mKG8pIHtcbiAgICAgICAgaWYgKG8gPT09IG51bGwpIHJldHVybiBcIm51bGxcIjtcbiAgICAgICAgdmFyIHRvID0gdHlwZW9mIG87XG4gICAgICAgIGlmICh0byA9PT0gXCJvYmplY3RcIiAmJiBpc0FycmF5KG8pKSB0byA9IFwiYXJyYXlcIjtcbiAgICAgICAgcmV0dXJuIHRvO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIG1uKG5vZGUsIHNlbCwgaWQsIG51bSwgdG90KSB7XG4gICAgICAgIHZhciBzZWxzID0gW107XG4gICAgICAgIHZhciBjcyA9IChzZWxbMF0gPT09IFwiPlwiKSA/IHNlbFsxXSA6IHNlbFswXTtcbiAgICAgICAgdmFyIG0gPSB0cnVlLCBtb2Q7XG4gICAgICAgIGlmIChjcy50eXBlKSBtID0gbSAmJiAoY3MudHlwZSA9PT0gbXl0eXBlb2Yobm9kZSkpO1xuICAgICAgICBpZiAoY3MuaWQpICAgbSA9IG0gJiYgKGNzLmlkID09PSBpZCk7XG4gICAgICAgIGlmIChtICYmIGNzLnBmKSB7XG4gICAgICAgICAgICBpZiAoY3MucGYgPT09IFwiOm50aC1sYXN0LWNoaWxkXCIpIG51bSA9IHRvdCAtIG51bTtcbiAgICAgICAgICAgIGVsc2UgbnVtKys7XG4gICAgICAgICAgICBpZiAoY3MuYSA9PT0gMCkge1xuICAgICAgICAgICAgICAgIG0gPSBjcy5iID09PSBudW07XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIG1vZCA9ICgobnVtIC0gY3MuYikgJSBjcy5hKTtcblxuICAgICAgICAgICAgICAgIG0gPSAoIW1vZCAmJiAoKG51bSpjcy5hICsgY3MuYikgPj0gMCkpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgLy8gc2hvdWxkIHdlIHJlcGVhdCB0aGlzIHNlbGVjdG9yIGZvciBkZXNjZW5kYW50cz9cbiAgICAgICAgaWYgKHNlbFswXSAhPT0gXCI+XCIgJiYgc2VsWzBdLnBjICE9PSBcIjpyb290XCIpIHNlbHMucHVzaChzZWwpO1xuXG4gICAgICAgIGlmIChtKSB7XG4gICAgICAgICAgICAvLyBpcyB0aGVyZSBhIGZyYWdtZW50IHRoYXQgd2Ugc2hvdWxkIHBhc3MgZG93bj9cbiAgICAgICAgICAgIGlmIChzZWxbMF0gPT09IFwiPlwiKSB7IGlmIChzZWwubGVuZ3RoID4gMikgeyBtID0gZmFsc2U7IHNlbHMucHVzaChzZWwuc2xpY2UoMikpOyB9IH1cbiAgICAgICAgICAgIGVsc2UgaWYgKHNlbC5sZW5ndGggPiAxKSB7IG0gPSBmYWxzZTsgc2Vscy5wdXNoKHNlbC5zbGljZSgxKSk7IH1cbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBbbSwgc2Vsc107XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gZm9yRWFjaChzZWwsIG9iaiwgZnVuLCBpZCwgbnVtLCB0b3QpIHtcbiAgICAgICAgdmFyIGEgPSAoc2VsWzBdID09PSBcIixcIikgPyBzZWwuc2xpY2UoMSkgOiBbc2VsXSxcbiAgICAgICAgYTAgPSBbXSxcbiAgICAgICAgY2FsbCA9IGZhbHNlLFxuICAgICAgICBpID0gMCwgaiA9IDAsIGwgPSAwLCBrLCB4O1xuICAgICAgICBmb3IgKGkgPSAwOyBpIDwgYS5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgeCA9IG1uKG9iaiwgYVtpXSwgaWQsIG51bSwgdG90KTtcbiAgICAgICAgICAgIGlmICh4WzBdKSB7XG4gICAgICAgICAgICAgICAgY2FsbCA9IHRydWU7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBmb3IgKGogPSAwOyBqIDwgeFsxXS5sZW5ndGg7IGorKykge1xuICAgICAgICAgICAgICAgIGEwLnB1c2goeFsxXVtqXSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgaWYgKGEwLmxlbmd0aCAmJiB0eXBlb2Ygb2JqID09PSBcIm9iamVjdFwiKSB7XG4gICAgICAgICAgICBpZiAoYTAubGVuZ3RoID49IDEpIHtcbiAgICAgICAgICAgICAgICBhMC51bnNoaWZ0KFwiLFwiKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmIChpc0FycmF5KG9iaikpIHtcbiAgICAgICAgICAgICAgICBmb3IgKGkgPSAwOyBpIDwgb2JqLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICAgICAgICAgIGZvckVhY2goYTAsIG9ialtpXSwgZnVuLCB1bmRlZmluZWQsIGksIG9iai5sZW5ndGgpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgLy8gaXQncyBhIHNoYW1lIHRvIGRvIHRoaXMgZm9yIDpsYXN0LWNoaWxkIGFuZCBvdGhlclxuICAgICAgICAgICAgICAgIC8vIHByb3BlcnRpZXMgd2hpY2ggY291bnQgZnJvbSB0aGUgZW5kIHdoZW4gd2UgZG9uJ3RcbiAgICAgICAgICAgICAgICAvLyBldmVuIGtub3cgaWYgdGhleSdyZSBwcmVzZW50LiAgQWxzbywgdGhlIHN0cmVhbVxuICAgICAgICAgICAgICAgIC8vIHBhcnNlciBpcyBnb2luZyB0byBiZSBwaXNzZWQuXG4gICAgICAgICAgICAgICAgbCA9IDA7XG4gICAgICAgICAgICAgICAgZm9yIChrIGluIG9iaikge1xuICAgICAgICAgICAgICAgICAgICBpZiAob2JqLmhhc093blByb3BlcnR5KGspKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBsKys7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgaSA9IDA7XG4gICAgICAgICAgICAgICAgZm9yIChrIGluIG9iaikge1xuICAgICAgICAgICAgICAgICAgICBpZiAob2JqLmhhc093blByb3BlcnR5KGspKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBmb3JFYWNoKGEwLCBvYmpba10sIGZ1biwgaywgaSsrLCBsKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBpZiAoY2FsbCAmJiBmdW4pIHtcbiAgICAgICAgICAgIGZ1bihvYmopO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gbWF0Y2goc2VsLCBvYmopIHtcbiAgICAgICAgdmFyIGEgPSBbXTtcbiAgICAgICAgZm9yRWFjaChzZWwsIG9iaiwgZnVuY3Rpb24oeCkge1xuICAgICAgICAgICAgYS5wdXNoKHgpO1xuICAgICAgICB9KTtcbiAgICAgICAgcmV0dXJuIGE7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gY29tcGlsZShzZWwpIHtcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgIHNlbDogcGFyc2Uoc2VsKSxcbiAgICAgICAgICAgIG1hdGNoOiBmdW5jdGlvbihvYmope1xuICAgICAgICAgICAgICAgIHJldHVybiBtYXRjaCh0aGlzLnNlbCwgb2JqKTtcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBmb3JFYWNoOiBmdW5jdGlvbihvYmosIGZ1bikge1xuICAgICAgICAgICAgICAgIHJldHVybiBmb3JFYWNoKHRoaXMuc2VsLCBvYmosIGZ1bik7XG4gICAgICAgICAgICB9XG4gICAgICAgIH07XG4gICAgfVxuXG4gICAgZXhwb3J0cy5fbGV4ID0gbGV4O1xuICAgIGV4cG9ydHMuX3BhcnNlID0gcGFyc2U7XG4gICAgZXhwb3J0cy5tYXRjaCA9IGZ1bmN0aW9uIChzZWwsIG9iaikge1xuICAgICAgICByZXR1cm4gY29tcGlsZShzZWwpLm1hdGNoKG9iaik7XG4gICAgfTtcbiAgICBleHBvcnRzLmZvckVhY2ggPSBmdW5jdGlvbihzZWwsIG9iaiwgZnVuKSB7XG4gICAgICAgIHJldHVybiBjb21waWxlKHNlbCkuZm9yRWFjaChvYmosIGZ1bik7XG4gICAgfTtcbiAgICBleHBvcnRzLmNvbXBpbGUgPSBjb21waWxlO1xufSkodHlwZW9mIGV4cG9ydHMgPT09IFwidW5kZWZpbmVkXCIgPyAod2luZG93LkpTT05TZWxlY3QgPSB7fSkgOiBleHBvcnRzKTtcblxuIl0sImZpbGUiOiJtb2Rlcm5penIvdGVzdC9qcy9saWIvanNvbnNlbGVjdC5qcyIsInNvdXJjZVJvb3QiOiIvc291cmNlLyJ9