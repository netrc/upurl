
var UpUrl = {

  setup : function () {
	UpUrl.xlog(" setup starting... ");
	chrome.tabs.query( {active: true}, UpUrl.thisTab );
  },

  addUrl : function( ul, l ) {
	var newLi = document.createElement("li");
	// dev note: can't use an onClick anchor option, violates standard extension security policy
	newLi.innerHTML = '<a href="" > ' + l + ' </a>';
	newLi.addEventListener("click", function(){ chrome.tabs.create({url:l}); });
	ul.appendChild(newLi);
  },

  thisTab : function (tabArray) {
	UpUrl.xlog("thisTab start ");
	if (tabArray === undefined) { 
		UpUrl.xlog("getSelected Tab is undefined"); 
		return; 
	};
	if (tabArray == null) { 
		UpUrl.xlog("getSelected Tab is null"); 
		return; 
	};
	UpUrl.xlog("  thisTab length " + tabArray.length);
	if (tabArray.length == 0) { 
		UpUrl.xlog(" tabarray is zero length"); 
		return; 
	};
	UpUrl.xlog("  url " + tabArray[0].url);
	var sa = tabArray[0].url.split("/");
        var h = sa.shift();	// e.g. "http:" or https or whatever
        var d = sa.shift();	// e.g. should be empty
	var u = h + "/" + d;	// e.g. "http:/"
	UpUrl.xlog("  u " + u);

	var ul = document.getElementById("upUrlList");

	// check for dotted subdomains in sa[0]
	var ca = sa[0].split(".");
	UpUrl.xlog("  cal " + ca.length);
	var newLi;
	var uu;
	for (var i = (ca.length-2); i>0; i--) {
		uu = u + '/'+ca.slice(i,ca.length).join(".");
		UpUrl.xlog("  ccu: " + uu);
		UpUrl.addUrl( ul, uu );
	}

	for (i=0; i<sa.length; i++) {
		if (sa[i].length == 0) continue;// exclude empty strings, esp. at end
		u = u + "/" + sa[i];		// e.g. "http://x.com", http://x.com/foo

		UpUrl.addUrl( ul, u );
	}
  },

  xlog : function ( s ) { // simple logger, displays in popup window
	return;
	var n = document.createElement("div"); 
	n.innerHTML = "<i> " + s + " </i>"; 
	document.body.appendChild(n);
  }
}

document.addEventListener('DOMContentLoaded', function() { UpUrl.setup(); });
