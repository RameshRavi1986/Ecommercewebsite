// uaparser by lindsey simon,
// ported to node by tobie
// https://github.com/tobie/ua-parser/

// browserized by paul irish

(function(exports){

  exports.uaparse = parse;
  
  function parse(ua) {
    for (var i=0; i < parsers.length; i++) {
      var result = parsers[i](ua);
      if (result) { return result; }
    }
    return new UserAgent();
  }

  function UserAgent(family) {
    this.family = family || 'Other';
  }

  UserAgent.prototype.toVersionString = function() {
    var output = '';
    if (this.major != null) {
      output += this.major;
      if (this.minor != null) {
        output += '.' + this.minor;
        if (this.patch != null) {
          output += '.' + this.patch;
        }
      }
    }
    return output;
  };

  UserAgent.prototype.toString = function() {
    var suffix = this.toVersionString();
    if (suffix) { suffix = ' ' + suffix; }
    return this.family + suffix;
  };
  
  
  var regexes = [
      {"pattern":"^(Opera)/(\\d+)\\.(\\d+) \\(Nintendo Wii",
       "v1_replacement":null,
       "family_replacement":"Wii"},
      {"pattern":"(Namoroka|Shiretoko|Minefield)/(\\d+)\\.(\\d+)\\.(\\d+(?:pre)?)",
       "v1_replacement":null,
       "family_replacement":"Firefox ($1)"},
      {"pattern":"(Namoroka|Shiretoko|Minefield)/(\\d+)\\.(\\d+)([ab]\\d+[a-z]*)?",
       "v1_replacement":null,
       "family_replacement":"Firefox ($1)"},
      {"pattern":"(SeaMonkey|Fennec|Camino)/(\\d+)\\.(\\d+)([ab]?\\d+[a-z]*)",
       "v1_replacement":null,
       "family_replacement":null},
      {"pattern":"(Flock)/(\\d+)\\.(\\d+)(b\\d+?)",
       "v1_replacement":null,
       "family_replacement":null},
      {"pattern":"(Fennec)/(\\d+)\\.(\\d+)(pre)",
       "v1_replacement":null,
       "family_replacement":null},
      {"pattern":"(Navigator)/(\\d+)\\.(\\d+)\\.(\\d+)",
       "v1_replacement":null,
       "family_replacement":"Netscape"},
      {"pattern":"(Navigator)/(\\d+)\\.(\\d+)([ab]\\d+)",
       "v1_replacement":null,
       "family_replacement":"Netscape"},
      {"pattern":"(Netscape6)/(\\d+)\\.(\\d+)\\.(\\d+)",
       "v1_replacement":null,
       "family_replacement":"Netscape"},
      {"pattern":"(MyIBrow)/(\\d+)\\.(\\d+)",
       "v1_replacement":null,
       "family_replacement":"My Internet Browser"},
      {"pattern":"(Firefox).*Tablet browser (\\d+)\\.(\\d+)\\.(\\d+)",
       "v1_replacement":null,
       "family_replacement":"MicroB"},
      {"pattern":"(Opera)/9.80.*Version\\/(\\d+)\\.(\\d+)(?:\\.(\\d+))?",
       "v1_replacement":null,
       "family_replacement":null},
      {"pattern":"(Firefox)/(\\d+)\\.(\\d+)\\.(\\d+(?:pre)?) \\(Swiftfox\\)",
       "v1_replacement":null,
       "family_replacement":"Swiftfox"},
      {"pattern":"(Firefox)/(\\d+)\\.(\\d+)([ab]\\d+[a-z]*)? \\(Swiftfox\\)",
       "v1_replacement":null,
       "family_replacement":"Swiftfox"},
      {"pattern":"(konqueror)/(\\d+)\\.(\\d+)\\.(\\d+)",
       "v1_replacement":null,
       "family_replacement":"Konqueror"},
      {"pattern":"(Jasmine|ANTGalio|Midori|Fresco|Lobo|Maxthon|Lynx|OmniWeb|Dillo|Camino|Demeter|Fluid|Fennec|Shiira|Sunrise|Chrome|Flock|Netscape|Lunascape|Epiphany|WebPilot|Vodafone|NetFront|Konqueror|SeaMonkey|Kazehakase|Vienna|Iceape|Iceweasel|IceWeasel|Iron|K-Meleon|Sleipnir|Galeon|GranParadiso|Opera Mini|iCab|NetNewsWire|Iron|Iris)/(\\d+)\\.(\\d+)\\.(\\d+)",
       "v1_replacement":null,
       "family_replacement":null},
      {"pattern":"(Bolt|Jasmine|Maxthon|Lynx|Arora|IBrowse|Dillo|Camino|Shiira|Fennec|Phoenix|Chrome|Flock|Netscape|Lunascape|Epiphany|WebPilot|Opera Mini|Opera|Vodafone|NetFront|Konqueror|SeaMonkey|Kazehakase|Vienna|Iceape|Iceweasel|IceWeasel|Iron|K-Meleon|Sleipnir|Galeon|GranParadiso|iCab|NetNewsWire|Iron|Space Bison|Stainless|Orca)/(\\d+)\\.(\\d+)",
       "v1_replacement":null,
       "family_replacement":null},
      {"pattern":"(iRider|Crazy Browser|SkipStone|iCab|Lunascape|Sleipnir|Maemo Browser) (\\d+)\\.(\\d+)\\.(\\d+)",
       "v1_replacement":null,
       "family_replacement":null},
      {"pattern":"(iCab|Lunascape|Opera|Android) (\\d+)\\.(\\d+)",
       "v1_replacement":null,
       "family_replacement":null},
      {"pattern":"(IEMobile) (\\d+)\\.(\\d+)",
       "v1_replacement":null,
       "family_replacement":"IE Mobile"},
      {"pattern":"(Firefox)/(\\d+)\\.(\\d+)\\.(\\d+)",
       "v1_replacement":null,
       "family_replacement":null},
      {"pattern":"(Firefox)/(\\d+)\\.(\\d+)(pre|[ab]\\d+[a-z]*)?",
       "v1_replacement":null,
       "family_replacement":null},
      {"pattern":"(Obigo|OBIGO)[^\\d]*(\\d+)(?:.(\\d+))?",
       "v1_replacement":null,
       "family_replacement":"Obigo"},
      {"pattern":"(MAXTHON|Maxthon) (\\d+)\\.(\\d+)",
       "v1_replacement":null,
       "family_replacement":"Maxthon"},
      {"pattern":"(Maxthon|MyIE2|Uzbl|Shiira)",
       "v1_replacement":"0",
       "family_replacement":null},
      {"pattern":"(PLAYSTATION) (\\d+)",
       "v1_replacement":null,
       "family_replacement":"PlayStation"},
      {"pattern":"(PlayStation Portable)[^\\d]+(\\d+).(\\d+)",
       "v1_replacement":null,
       "family_replacement":null},
      {"pattern":"(BrowseX) \\((\\d+)\\.(\\d+)\\.(\\d+)",
       "v1_replacement":null,
       "family_replacement":null},
      {"pattern":"(Opera)/(\\d+)\\.(\\d+).*Opera Mobi",
       "v1_replacement":null,
       "family_replacement":"Opera Mobile"},
      {"pattern":"(POLARIS)/(\\d+)\\.(\\d+)",
       "v1_replacement":null,
       "family_replacement":"Polaris"},
      {"pattern":"(BonEcho)/(\\d+)\\.(\\d+)\\.(\\d+)",
       "v1_replacement":null,
       "family_replacement":"Bon Echo"},
      {"pattern":"(iPhone) OS (\\d+)_(\\d+)(?:_(\\d+))?",
       "v1_replacement":null,
       "family_replacement":null},
      {"pattern":"(Avant)",
       "v1_replacement":"1",
       "family_replacement":null},
      {"pattern":"(Nokia)[EN]?(\\d+)",
       "v1_replacement":null,
       "family_replacement":null},
      {"pattern":"(Black[bB]erry)(\\d+)",
       "v1_replacement":null,
       "family_replacement":"Blackberry"},
      {"pattern":"(OmniWeb)/v(\\d+)\\.(\\d+)",
       "v1_replacement":null,
       "family_replacement":null},
      {"pattern":"(Blazer)/(\\d+)\\.(\\d+)",
       "v1_replacement":null,
       "family_replacement":"Palm Blazer"},
      {"pattern":"(Pre)/(\\d+)\\.(\\d+)",
       "v1_replacement":null,
       "family_replacement":"Palm Pre"},
      {"pattern":"(Links) \\((\\d+)\\.(\\d+)",
       "v1_replacement":null,
       "family_replacement":null},
      {"pattern":"(QtWeb) Internet Browser/(\\d+)\\.(\\d+)",
       "v1_replacement":null,
       "family_replacement":null},
      {"pattern":"(Version)/(\\d+)\\.(\\d+)(?:\\.(\\d+))?.*Safari/",
       "v1_replacement":null,
       "family_replacement":"Safari"},
      {"pattern":"(OLPC)/Update(\\d+)\\.(\\d+)",
       "v1_replacement":null,
       "family_replacement":null},
      {"pattern":"(OLPC)/Update()\\.(\\d+)",
       "v1_replacement":"0",
       "family_replacement":null},
      {"pattern":"(SamsungSGHi560)",
       "v1_replacement":null,
       "family_replacement":"Samsung SGHi560"},
      {"pattern":"^(SonyEricssonK800i)",
       "v1_replacement":null,
       "family_replacement":"Sony Ericsson K800i"},
      {"pattern":"(Teleca Q7)",
       "v1_replacement":null,
       "family_replacement":null},
      {"pattern":"(MSIE) (\\d+)\\.(\\d+)",
       "v1_replacement":null,
       "family_replacement":"IE"}

  ];
  
  var parsers = regexes.map(function(obj) {
    var regexp = new RegExp(obj.pattern),
        famRep = obj.family_replacement,
        v1Rep = obj.v1_replacement;

    function parser(ua) {
      var m = ua.match(regexp);

      if (!m) { return null; }

      var familly = famRep ? famRep.replace('$1', m[1]) : m[1];

      var obj = new UserAgent(familly);
      obj.major = parseInt(v1Rep ? v1Rep : m[2]);
      obj.minor = m[3] ? parseInt(m[3]) : null;
      obj.patch = m[4] ? parseInt(m[4]) : null;

      return obj;
    }

    return parser;
  });
  
  
})(window);



//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiIiwic291cmNlcyI6WyJtb2Rlcm5penIvdGVzdC9qcy9saWIvdWFwYXJzZXIuanMiXSwic291cmNlc0NvbnRlbnQiOlsiLy8gdWFwYXJzZXIgYnkgbGluZHNleSBzaW1vbixcbi8vIHBvcnRlZCB0byBub2RlIGJ5IHRvYmllXG4vLyBodHRwczovL2dpdGh1Yi5jb20vdG9iaWUvdWEtcGFyc2VyL1xuXG4vLyBicm93c2VyaXplZCBieSBwYXVsIGlyaXNoXG5cbihmdW5jdGlvbihleHBvcnRzKXtcblxuICBleHBvcnRzLnVhcGFyc2UgPSBwYXJzZTtcbiAgXG4gIGZ1bmN0aW9uIHBhcnNlKHVhKSB7XG4gICAgZm9yICh2YXIgaT0wOyBpIDwgcGFyc2Vycy5sZW5ndGg7IGkrKykge1xuICAgICAgdmFyIHJlc3VsdCA9IHBhcnNlcnNbaV0odWEpO1xuICAgICAgaWYgKHJlc3VsdCkgeyByZXR1cm4gcmVzdWx0OyB9XG4gICAgfVxuICAgIHJldHVybiBuZXcgVXNlckFnZW50KCk7XG4gIH1cblxuICBmdW5jdGlvbiBVc2VyQWdlbnQoZmFtaWx5KSB7XG4gICAgdGhpcy5mYW1pbHkgPSBmYW1pbHkgfHwgJ090aGVyJztcbiAgfVxuXG4gIFVzZXJBZ2VudC5wcm90b3R5cGUudG9WZXJzaW9uU3RyaW5nID0gZnVuY3Rpb24oKSB7XG4gICAgdmFyIG91dHB1dCA9ICcnO1xuICAgIGlmICh0aGlzLm1ham9yICE9IG51bGwpIHtcbiAgICAgIG91dHB1dCArPSB0aGlzLm1ham9yO1xuICAgICAgaWYgKHRoaXMubWlub3IgIT0gbnVsbCkge1xuICAgICAgICBvdXRwdXQgKz0gJy4nICsgdGhpcy5taW5vcjtcbiAgICAgICAgaWYgKHRoaXMucGF0Y2ggIT0gbnVsbCkge1xuICAgICAgICAgIG91dHB1dCArPSAnLicgKyB0aGlzLnBhdGNoO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiBvdXRwdXQ7XG4gIH07XG5cbiAgVXNlckFnZW50LnByb3RvdHlwZS50b1N0cmluZyA9IGZ1bmN0aW9uKCkge1xuICAgIHZhciBzdWZmaXggPSB0aGlzLnRvVmVyc2lvblN0cmluZygpO1xuICAgIGlmIChzdWZmaXgpIHsgc3VmZml4ID0gJyAnICsgc3VmZml4OyB9XG4gICAgcmV0dXJuIHRoaXMuZmFtaWx5ICsgc3VmZml4O1xuICB9O1xuICBcbiAgXG4gIHZhciByZWdleGVzID0gW1xuICAgICAge1wicGF0dGVyblwiOlwiXihPcGVyYSkvKFxcXFxkKylcXFxcLihcXFxcZCspIFxcXFwoTmludGVuZG8gV2lpXCIsXG4gICAgICAgXCJ2MV9yZXBsYWNlbWVudFwiOm51bGwsXG4gICAgICAgXCJmYW1pbHlfcmVwbGFjZW1lbnRcIjpcIldpaVwifSxcbiAgICAgIHtcInBhdHRlcm5cIjpcIihOYW1vcm9rYXxTaGlyZXRva298TWluZWZpZWxkKS8oXFxcXGQrKVxcXFwuKFxcXFxkKylcXFxcLihcXFxcZCsoPzpwcmUpPylcIixcbiAgICAgICBcInYxX3JlcGxhY2VtZW50XCI6bnVsbCxcbiAgICAgICBcImZhbWlseV9yZXBsYWNlbWVudFwiOlwiRmlyZWZveCAoJDEpXCJ9LFxuICAgICAge1wicGF0dGVyblwiOlwiKE5hbW9yb2thfFNoaXJldG9rb3xNaW5lZmllbGQpLyhcXFxcZCspXFxcXC4oXFxcXGQrKShbYWJdXFxcXGQrW2Etel0qKT9cIixcbiAgICAgICBcInYxX3JlcGxhY2VtZW50XCI6bnVsbCxcbiAgICAgICBcImZhbWlseV9yZXBsYWNlbWVudFwiOlwiRmlyZWZveCAoJDEpXCJ9LFxuICAgICAge1wicGF0dGVyblwiOlwiKFNlYU1vbmtleXxGZW5uZWN8Q2FtaW5vKS8oXFxcXGQrKVxcXFwuKFxcXFxkKykoW2FiXT9cXFxcZCtbYS16XSopXCIsXG4gICAgICAgXCJ2MV9yZXBsYWNlbWVudFwiOm51bGwsXG4gICAgICAgXCJmYW1pbHlfcmVwbGFjZW1lbnRcIjpudWxsfSxcbiAgICAgIHtcInBhdHRlcm5cIjpcIihGbG9jaykvKFxcXFxkKylcXFxcLihcXFxcZCspKGJcXFxcZCs/KVwiLFxuICAgICAgIFwidjFfcmVwbGFjZW1lbnRcIjpudWxsLFxuICAgICAgIFwiZmFtaWx5X3JlcGxhY2VtZW50XCI6bnVsbH0sXG4gICAgICB7XCJwYXR0ZXJuXCI6XCIoRmVubmVjKS8oXFxcXGQrKVxcXFwuKFxcXFxkKykocHJlKVwiLFxuICAgICAgIFwidjFfcmVwbGFjZW1lbnRcIjpudWxsLFxuICAgICAgIFwiZmFtaWx5X3JlcGxhY2VtZW50XCI6bnVsbH0sXG4gICAgICB7XCJwYXR0ZXJuXCI6XCIoTmF2aWdhdG9yKS8oXFxcXGQrKVxcXFwuKFxcXFxkKylcXFxcLihcXFxcZCspXCIsXG4gICAgICAgXCJ2MV9yZXBsYWNlbWVudFwiOm51bGwsXG4gICAgICAgXCJmYW1pbHlfcmVwbGFjZW1lbnRcIjpcIk5ldHNjYXBlXCJ9LFxuICAgICAge1wicGF0dGVyblwiOlwiKE5hdmlnYXRvcikvKFxcXFxkKylcXFxcLihcXFxcZCspKFthYl1cXFxcZCspXCIsXG4gICAgICAgXCJ2MV9yZXBsYWNlbWVudFwiOm51bGwsXG4gICAgICAgXCJmYW1pbHlfcmVwbGFjZW1lbnRcIjpcIk5ldHNjYXBlXCJ9LFxuICAgICAge1wicGF0dGVyblwiOlwiKE5ldHNjYXBlNikvKFxcXFxkKylcXFxcLihcXFxcZCspXFxcXC4oXFxcXGQrKVwiLFxuICAgICAgIFwidjFfcmVwbGFjZW1lbnRcIjpudWxsLFxuICAgICAgIFwiZmFtaWx5X3JlcGxhY2VtZW50XCI6XCJOZXRzY2FwZVwifSxcbiAgICAgIHtcInBhdHRlcm5cIjpcIihNeUlCcm93KS8oXFxcXGQrKVxcXFwuKFxcXFxkKylcIixcbiAgICAgICBcInYxX3JlcGxhY2VtZW50XCI6bnVsbCxcbiAgICAgICBcImZhbWlseV9yZXBsYWNlbWVudFwiOlwiTXkgSW50ZXJuZXQgQnJvd3NlclwifSxcbiAgICAgIHtcInBhdHRlcm5cIjpcIihGaXJlZm94KS4qVGFibGV0IGJyb3dzZXIgKFxcXFxkKylcXFxcLihcXFxcZCspXFxcXC4oXFxcXGQrKVwiLFxuICAgICAgIFwidjFfcmVwbGFjZW1lbnRcIjpudWxsLFxuICAgICAgIFwiZmFtaWx5X3JlcGxhY2VtZW50XCI6XCJNaWNyb0JcIn0sXG4gICAgICB7XCJwYXR0ZXJuXCI6XCIoT3BlcmEpLzkuODAuKlZlcnNpb25cXFxcLyhcXFxcZCspXFxcXC4oXFxcXGQrKSg/OlxcXFwuKFxcXFxkKykpP1wiLFxuICAgICAgIFwidjFfcmVwbGFjZW1lbnRcIjpudWxsLFxuICAgICAgIFwiZmFtaWx5X3JlcGxhY2VtZW50XCI6bnVsbH0sXG4gICAgICB7XCJwYXR0ZXJuXCI6XCIoRmlyZWZveCkvKFxcXFxkKylcXFxcLihcXFxcZCspXFxcXC4oXFxcXGQrKD86cHJlKT8pIFxcXFwoU3dpZnRmb3hcXFxcKVwiLFxuICAgICAgIFwidjFfcmVwbGFjZW1lbnRcIjpudWxsLFxuICAgICAgIFwiZmFtaWx5X3JlcGxhY2VtZW50XCI6XCJTd2lmdGZveFwifSxcbiAgICAgIHtcInBhdHRlcm5cIjpcIihGaXJlZm94KS8oXFxcXGQrKVxcXFwuKFxcXFxkKykoW2FiXVxcXFxkK1thLXpdKik/IFxcXFwoU3dpZnRmb3hcXFxcKVwiLFxuICAgICAgIFwidjFfcmVwbGFjZW1lbnRcIjpudWxsLFxuICAgICAgIFwiZmFtaWx5X3JlcGxhY2VtZW50XCI6XCJTd2lmdGZveFwifSxcbiAgICAgIHtcInBhdHRlcm5cIjpcIihrb25xdWVyb3IpLyhcXFxcZCspXFxcXC4oXFxcXGQrKVxcXFwuKFxcXFxkKylcIixcbiAgICAgICBcInYxX3JlcGxhY2VtZW50XCI6bnVsbCxcbiAgICAgICBcImZhbWlseV9yZXBsYWNlbWVudFwiOlwiS29ucXVlcm9yXCJ9LFxuICAgICAge1wicGF0dGVyblwiOlwiKEphc21pbmV8QU5UR2FsaW98TWlkb3JpfEZyZXNjb3xMb2JvfE1heHRob258THlueHxPbW5pV2VifERpbGxvfENhbWlub3xEZW1ldGVyfEZsdWlkfEZlbm5lY3xTaGlpcmF8U3VucmlzZXxDaHJvbWV8RmxvY2t8TmV0c2NhcGV8THVuYXNjYXBlfEVwaXBoYW55fFdlYlBpbG90fFZvZGFmb25lfE5ldEZyb250fEtvbnF1ZXJvcnxTZWFNb25rZXl8S2F6ZWhha2FzZXxWaWVubmF8SWNlYXBlfEljZXdlYXNlbHxJY2VXZWFzZWx8SXJvbnxLLU1lbGVvbnxTbGVpcG5pcnxHYWxlb258R3JhblBhcmFkaXNvfE9wZXJhIE1pbml8aUNhYnxOZXROZXdzV2lyZXxJcm9ufElyaXMpLyhcXFxcZCspXFxcXC4oXFxcXGQrKVxcXFwuKFxcXFxkKylcIixcbiAgICAgICBcInYxX3JlcGxhY2VtZW50XCI6bnVsbCxcbiAgICAgICBcImZhbWlseV9yZXBsYWNlbWVudFwiOm51bGx9LFxuICAgICAge1wicGF0dGVyblwiOlwiKEJvbHR8SmFzbWluZXxNYXh0aG9ufEx5bnh8QXJvcmF8SUJyb3dzZXxEaWxsb3xDYW1pbm98U2hpaXJhfEZlbm5lY3xQaG9lbml4fENocm9tZXxGbG9ja3xOZXRzY2FwZXxMdW5hc2NhcGV8RXBpcGhhbnl8V2ViUGlsb3R8T3BlcmEgTWluaXxPcGVyYXxWb2RhZm9uZXxOZXRGcm9udHxLb25xdWVyb3J8U2VhTW9ua2V5fEthemVoYWthc2V8Vmllbm5hfEljZWFwZXxJY2V3ZWFzZWx8SWNlV2Vhc2VsfElyb258Sy1NZWxlb258U2xlaXBuaXJ8R2FsZW9ufEdyYW5QYXJhZGlzb3xpQ2FifE5ldE5ld3NXaXJlfElyb258U3BhY2UgQmlzb258U3RhaW5sZXNzfE9yY2EpLyhcXFxcZCspXFxcXC4oXFxcXGQrKVwiLFxuICAgICAgIFwidjFfcmVwbGFjZW1lbnRcIjpudWxsLFxuICAgICAgIFwiZmFtaWx5X3JlcGxhY2VtZW50XCI6bnVsbH0sXG4gICAgICB7XCJwYXR0ZXJuXCI6XCIoaVJpZGVyfENyYXp5IEJyb3dzZXJ8U2tpcFN0b25lfGlDYWJ8THVuYXNjYXBlfFNsZWlwbmlyfE1hZW1vIEJyb3dzZXIpIChcXFxcZCspXFxcXC4oXFxcXGQrKVxcXFwuKFxcXFxkKylcIixcbiAgICAgICBcInYxX3JlcGxhY2VtZW50XCI6bnVsbCxcbiAgICAgICBcImZhbWlseV9yZXBsYWNlbWVudFwiOm51bGx9LFxuICAgICAge1wicGF0dGVyblwiOlwiKGlDYWJ8THVuYXNjYXBlfE9wZXJhfEFuZHJvaWQpIChcXFxcZCspXFxcXC4oXFxcXGQrKVwiLFxuICAgICAgIFwidjFfcmVwbGFjZW1lbnRcIjpudWxsLFxuICAgICAgIFwiZmFtaWx5X3JlcGxhY2VtZW50XCI6bnVsbH0sXG4gICAgICB7XCJwYXR0ZXJuXCI6XCIoSUVNb2JpbGUpIChcXFxcZCspXFxcXC4oXFxcXGQrKVwiLFxuICAgICAgIFwidjFfcmVwbGFjZW1lbnRcIjpudWxsLFxuICAgICAgIFwiZmFtaWx5X3JlcGxhY2VtZW50XCI6XCJJRSBNb2JpbGVcIn0sXG4gICAgICB7XCJwYXR0ZXJuXCI6XCIoRmlyZWZveCkvKFxcXFxkKylcXFxcLihcXFxcZCspXFxcXC4oXFxcXGQrKVwiLFxuICAgICAgIFwidjFfcmVwbGFjZW1lbnRcIjpudWxsLFxuICAgICAgIFwiZmFtaWx5X3JlcGxhY2VtZW50XCI6bnVsbH0sXG4gICAgICB7XCJwYXR0ZXJuXCI6XCIoRmlyZWZveCkvKFxcXFxkKylcXFxcLihcXFxcZCspKHByZXxbYWJdXFxcXGQrW2Etel0qKT9cIixcbiAgICAgICBcInYxX3JlcGxhY2VtZW50XCI6bnVsbCxcbiAgICAgICBcImZhbWlseV9yZXBsYWNlbWVudFwiOm51bGx9LFxuICAgICAge1wicGF0dGVyblwiOlwiKE9iaWdvfE9CSUdPKVteXFxcXGRdKihcXFxcZCspKD86LihcXFxcZCspKT9cIixcbiAgICAgICBcInYxX3JlcGxhY2VtZW50XCI6bnVsbCxcbiAgICAgICBcImZhbWlseV9yZXBsYWNlbWVudFwiOlwiT2JpZ29cIn0sXG4gICAgICB7XCJwYXR0ZXJuXCI6XCIoTUFYVEhPTnxNYXh0aG9uKSAoXFxcXGQrKVxcXFwuKFxcXFxkKylcIixcbiAgICAgICBcInYxX3JlcGxhY2VtZW50XCI6bnVsbCxcbiAgICAgICBcImZhbWlseV9yZXBsYWNlbWVudFwiOlwiTWF4dGhvblwifSxcbiAgICAgIHtcInBhdHRlcm5cIjpcIihNYXh0aG9ufE15SUUyfFV6Ymx8U2hpaXJhKVwiLFxuICAgICAgIFwidjFfcmVwbGFjZW1lbnRcIjpcIjBcIixcbiAgICAgICBcImZhbWlseV9yZXBsYWNlbWVudFwiOm51bGx9LFxuICAgICAge1wicGF0dGVyblwiOlwiKFBMQVlTVEFUSU9OKSAoXFxcXGQrKVwiLFxuICAgICAgIFwidjFfcmVwbGFjZW1lbnRcIjpudWxsLFxuICAgICAgIFwiZmFtaWx5X3JlcGxhY2VtZW50XCI6XCJQbGF5U3RhdGlvblwifSxcbiAgICAgIHtcInBhdHRlcm5cIjpcIihQbGF5U3RhdGlvbiBQb3J0YWJsZSlbXlxcXFxkXSsoXFxcXGQrKS4oXFxcXGQrKVwiLFxuICAgICAgIFwidjFfcmVwbGFjZW1lbnRcIjpudWxsLFxuICAgICAgIFwiZmFtaWx5X3JlcGxhY2VtZW50XCI6bnVsbH0sXG4gICAgICB7XCJwYXR0ZXJuXCI6XCIoQnJvd3NlWCkgXFxcXCgoXFxcXGQrKVxcXFwuKFxcXFxkKylcXFxcLihcXFxcZCspXCIsXG4gICAgICAgXCJ2MV9yZXBsYWNlbWVudFwiOm51bGwsXG4gICAgICAgXCJmYW1pbHlfcmVwbGFjZW1lbnRcIjpudWxsfSxcbiAgICAgIHtcInBhdHRlcm5cIjpcIihPcGVyYSkvKFxcXFxkKylcXFxcLihcXFxcZCspLipPcGVyYSBNb2JpXCIsXG4gICAgICAgXCJ2MV9yZXBsYWNlbWVudFwiOm51bGwsXG4gICAgICAgXCJmYW1pbHlfcmVwbGFjZW1lbnRcIjpcIk9wZXJhIE1vYmlsZVwifSxcbiAgICAgIHtcInBhdHRlcm5cIjpcIihQT0xBUklTKS8oXFxcXGQrKVxcXFwuKFxcXFxkKylcIixcbiAgICAgICBcInYxX3JlcGxhY2VtZW50XCI6bnVsbCxcbiAgICAgICBcImZhbWlseV9yZXBsYWNlbWVudFwiOlwiUG9sYXJpc1wifSxcbiAgICAgIHtcInBhdHRlcm5cIjpcIihCb25FY2hvKS8oXFxcXGQrKVxcXFwuKFxcXFxkKylcXFxcLihcXFxcZCspXCIsXG4gICAgICAgXCJ2MV9yZXBsYWNlbWVudFwiOm51bGwsXG4gICAgICAgXCJmYW1pbHlfcmVwbGFjZW1lbnRcIjpcIkJvbiBFY2hvXCJ9LFxuICAgICAge1wicGF0dGVyblwiOlwiKGlQaG9uZSkgT1MgKFxcXFxkKylfKFxcXFxkKykoPzpfKFxcXFxkKykpP1wiLFxuICAgICAgIFwidjFfcmVwbGFjZW1lbnRcIjpudWxsLFxuICAgICAgIFwiZmFtaWx5X3JlcGxhY2VtZW50XCI6bnVsbH0sXG4gICAgICB7XCJwYXR0ZXJuXCI6XCIoQXZhbnQpXCIsXG4gICAgICAgXCJ2MV9yZXBsYWNlbWVudFwiOlwiMVwiLFxuICAgICAgIFwiZmFtaWx5X3JlcGxhY2VtZW50XCI6bnVsbH0sXG4gICAgICB7XCJwYXR0ZXJuXCI6XCIoTm9raWEpW0VOXT8oXFxcXGQrKVwiLFxuICAgICAgIFwidjFfcmVwbGFjZW1lbnRcIjpudWxsLFxuICAgICAgIFwiZmFtaWx5X3JlcGxhY2VtZW50XCI6bnVsbH0sXG4gICAgICB7XCJwYXR0ZXJuXCI6XCIoQmxhY2tbYkJdZXJyeSkoXFxcXGQrKVwiLFxuICAgICAgIFwidjFfcmVwbGFjZW1lbnRcIjpudWxsLFxuICAgICAgIFwiZmFtaWx5X3JlcGxhY2VtZW50XCI6XCJCbGFja2JlcnJ5XCJ9LFxuICAgICAge1wicGF0dGVyblwiOlwiKE9tbmlXZWIpL3YoXFxcXGQrKVxcXFwuKFxcXFxkKylcIixcbiAgICAgICBcInYxX3JlcGxhY2VtZW50XCI6bnVsbCxcbiAgICAgICBcImZhbWlseV9yZXBsYWNlbWVudFwiOm51bGx9LFxuICAgICAge1wicGF0dGVyblwiOlwiKEJsYXplcikvKFxcXFxkKylcXFxcLihcXFxcZCspXCIsXG4gICAgICAgXCJ2MV9yZXBsYWNlbWVudFwiOm51bGwsXG4gICAgICAgXCJmYW1pbHlfcmVwbGFjZW1lbnRcIjpcIlBhbG0gQmxhemVyXCJ9LFxuICAgICAge1wicGF0dGVyblwiOlwiKFByZSkvKFxcXFxkKylcXFxcLihcXFxcZCspXCIsXG4gICAgICAgXCJ2MV9yZXBsYWNlbWVudFwiOm51bGwsXG4gICAgICAgXCJmYW1pbHlfcmVwbGFjZW1lbnRcIjpcIlBhbG0gUHJlXCJ9LFxuICAgICAge1wicGF0dGVyblwiOlwiKExpbmtzKSBcXFxcKChcXFxcZCspXFxcXC4oXFxcXGQrKVwiLFxuICAgICAgIFwidjFfcmVwbGFjZW1lbnRcIjpudWxsLFxuICAgICAgIFwiZmFtaWx5X3JlcGxhY2VtZW50XCI6bnVsbH0sXG4gICAgICB7XCJwYXR0ZXJuXCI6XCIoUXRXZWIpIEludGVybmV0IEJyb3dzZXIvKFxcXFxkKylcXFxcLihcXFxcZCspXCIsXG4gICAgICAgXCJ2MV9yZXBsYWNlbWVudFwiOm51bGwsXG4gICAgICAgXCJmYW1pbHlfcmVwbGFjZW1lbnRcIjpudWxsfSxcbiAgICAgIHtcInBhdHRlcm5cIjpcIihWZXJzaW9uKS8oXFxcXGQrKVxcXFwuKFxcXFxkKykoPzpcXFxcLihcXFxcZCspKT8uKlNhZmFyaS9cIixcbiAgICAgICBcInYxX3JlcGxhY2VtZW50XCI6bnVsbCxcbiAgICAgICBcImZhbWlseV9yZXBsYWNlbWVudFwiOlwiU2FmYXJpXCJ9LFxuICAgICAge1wicGF0dGVyblwiOlwiKE9MUEMpL1VwZGF0ZShcXFxcZCspXFxcXC4oXFxcXGQrKVwiLFxuICAgICAgIFwidjFfcmVwbGFjZW1lbnRcIjpudWxsLFxuICAgICAgIFwiZmFtaWx5X3JlcGxhY2VtZW50XCI6bnVsbH0sXG4gICAgICB7XCJwYXR0ZXJuXCI6XCIoT0xQQykvVXBkYXRlKClcXFxcLihcXFxcZCspXCIsXG4gICAgICAgXCJ2MV9yZXBsYWNlbWVudFwiOlwiMFwiLFxuICAgICAgIFwiZmFtaWx5X3JlcGxhY2VtZW50XCI6bnVsbH0sXG4gICAgICB7XCJwYXR0ZXJuXCI6XCIoU2Ftc3VuZ1NHSGk1NjApXCIsXG4gICAgICAgXCJ2MV9yZXBsYWNlbWVudFwiOm51bGwsXG4gICAgICAgXCJmYW1pbHlfcmVwbGFjZW1lbnRcIjpcIlNhbXN1bmcgU0dIaTU2MFwifSxcbiAgICAgIHtcInBhdHRlcm5cIjpcIl4oU29ueUVyaWNzc29uSzgwMGkpXCIsXG4gICAgICAgXCJ2MV9yZXBsYWNlbWVudFwiOm51bGwsXG4gICAgICAgXCJmYW1pbHlfcmVwbGFjZW1lbnRcIjpcIlNvbnkgRXJpY3Nzb24gSzgwMGlcIn0sXG4gICAgICB7XCJwYXR0ZXJuXCI6XCIoVGVsZWNhIFE3KVwiLFxuICAgICAgIFwidjFfcmVwbGFjZW1lbnRcIjpudWxsLFxuICAgICAgIFwiZmFtaWx5X3JlcGxhY2VtZW50XCI6bnVsbH0sXG4gICAgICB7XCJwYXR0ZXJuXCI6XCIoTVNJRSkgKFxcXFxkKylcXFxcLihcXFxcZCspXCIsXG4gICAgICAgXCJ2MV9yZXBsYWNlbWVudFwiOm51bGwsXG4gICAgICAgXCJmYW1pbHlfcmVwbGFjZW1lbnRcIjpcIklFXCJ9XG5cbiAgXTtcbiAgXG4gIHZhciBwYXJzZXJzID0gcmVnZXhlcy5tYXAoZnVuY3Rpb24ob2JqKSB7XG4gICAgdmFyIHJlZ2V4cCA9IG5ldyBSZWdFeHAob2JqLnBhdHRlcm4pLFxuICAgICAgICBmYW1SZXAgPSBvYmouZmFtaWx5X3JlcGxhY2VtZW50LFxuICAgICAgICB2MVJlcCA9IG9iai52MV9yZXBsYWNlbWVudDtcblxuICAgIGZ1bmN0aW9uIHBhcnNlcih1YSkge1xuICAgICAgdmFyIG0gPSB1YS5tYXRjaChyZWdleHApO1xuXG4gICAgICBpZiAoIW0pIHsgcmV0dXJuIG51bGw7IH1cblxuICAgICAgdmFyIGZhbWlsbHkgPSBmYW1SZXAgPyBmYW1SZXAucmVwbGFjZSgnJDEnLCBtWzFdKSA6IG1bMV07XG5cbiAgICAgIHZhciBvYmogPSBuZXcgVXNlckFnZW50KGZhbWlsbHkpO1xuICAgICAgb2JqLm1ham9yID0gcGFyc2VJbnQodjFSZXAgPyB2MVJlcCA6IG1bMl0pO1xuICAgICAgb2JqLm1pbm9yID0gbVszXSA/IHBhcnNlSW50KG1bM10pIDogbnVsbDtcbiAgICAgIG9iai5wYXRjaCA9IG1bNF0gPyBwYXJzZUludChtWzRdKSA6IG51bGw7XG5cbiAgICAgIHJldHVybiBvYmo7XG4gICAgfVxuXG4gICAgcmV0dXJuIHBhcnNlcjtcbiAgfSk7XG4gIFxuICBcbn0pKHdpbmRvdyk7XG5cblxuIl0sImZpbGUiOiJtb2Rlcm5penIvdGVzdC9qcy9saWIvdWFwYXJzZXIuanMiLCJzb3VyY2VSb290IjoiL3NvdXJjZS8ifQ==