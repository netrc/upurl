
var UpUrl = {

  uArray : [],
  uE : {},

  setup : function ( e ) {
	UpUrl.xlog(" setup starting... ");
	UpUrl.uE = e;
	if (chrome && chrome.tabs) { // must not be in qUnit test
	  chrome.tabs.query( {active: true, lastFocusedWindow: true}, UpUrl.thisTab );
	}
  },

  addUrl : function( l ) {
	var newLi = document.createElement("li");
	// dev note: can't use an onClick anchor option, violates standard extension security policy
	newLi.innerHTML = '<a href="" > ' + l + ' </a>';
	newLi.addEventListener("click", function(){ chrome.tabs.create({url:l}); });
	UpUrl.uE.appendChild(newLi);
  },

  thisTab : function (tabArray) {
	UpUrl.xlog("thisTab start ");
	if (tabArray === undefined) { 
		UpUrl.xlog("getSelected Tab is undefined"); 
		return; 
	}
	if (tabArray === null) { 
		UpUrl.xlog("getSelected Tab is null"); 
		return; 
	}
	UpUrl.xlog("  thisTab length " + tabArray.length);
	if (tabArray.length === 0) { 
		UpUrl.xlog(" tabarray is zero length"); 
		return; 
	}
	for (var z = 0; z<tabArray.length; z++) {
		UpUrl.xlog("  url tab["+z+"]:" + tabArray[z].url);
	}

	var ua = UpUrl.getUpUrlsArray(tabArray[0].url);
	for (i=0; i<ua.length; i++) {
	  UpUrl.addUrl( ua[i] );
	}
  },

  getUpUrlsArray : function ( thisUrl ) {
	var sa = thisUrl.split("/");
        var h = sa.shift();	// e.g. "http:" or https or whatever
        var d = sa.shift();	// e.g. should be empty
	var u = h + "/" + d;	// e.g. "http:/"
	UpUrl.xlog("  u " + u);

	UpUrl.uArray = [];

	// check for dotted subdomains in sa[0]
	var ca = sa[0].split(".");
	UpUrl.xlog("  cal " + ca.length);
	var uu;
	for (var i = (ca.length-2); i>0; i--) {
		uu = u + '/'+ca.slice(i,ca.length).join(".");
		UpUrl.uArray.push( uu );
	}

	for (i=0; i<sa.length; i++) {
		if (sa[i].length === 0) continue;// exclude empty strings, esp. at end
		u = u + "/" + sa[i];		// e.g. "http://x.com", http://x.com/foo

		UpUrl.uArray.push( u );
	}
	return( UpUrl.uArray );
  },

  xlog : function ( s ) { // simple logger, displays in popup window
	return;
	var n = document.createElement("div"); 
	n.innerHTML = "<i> " + s + " </i>"; 
	document.body.appendChild(n);
  }
}

document.addEventListener('DOMContentLoaded', function() {
  UpUrl.setup( document.getElementById("upUrlList") );
});
