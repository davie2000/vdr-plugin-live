function LiveAjaxCall(url)
{
	var xml = null;
	if (window.XMLHttpRequest) {
		xml = new XMLHttpRequest();
		if (xml.overrideMimeType)
			xml.overrideMimeType('text/xml');
	} else if (window.ActiveXObject) {
		try {
			xml = new ActiveXObject("Msxml2.XMLHTTP");
		} catch (e) {
			try {
				xml = new ActiveXObject("Microsoft.XMLHTTP");
			} catch (e) {}
		}
	}
	
	this.url = url;
	this.xml = xml;

	this.onerror = function(message) {};
	this.oncomplete = function() {};

	this.request = function(param, value) 
	{
		var url = this.url+'?'+param+"="+value;
		var obj = this;
		this.xml.onreadystatechange = function() { obj.readystatechanged(); }
		this.xml.open('GET', url, true);
		this.xml.send(null);
	};

	this.readystatechanged = function()
	{
		try {
			if (this.xml.readyState == 4) {
				if (this.xml.status == 200) {
					var xmldoc = xml.responseXML;
					var result = Number(xmldoc.getElementsByTagName('response').item(0).firstChild.data);
					alert(result);
					if (!result) {
						var error = xmldoc.getElementsByTagName('error').item(0).firstChild.data;
						alert(error);
						this.onerror(error);
					} else
						this.oncomplete();
				} else {
					this.onerror('Invocation of webservice "'+this.url+'" failed with http status code '+this.xml.status);
				}
			}
		} catch (e) {
			this.onerror('Invocation of webservice "'+this.url+'" failed with exception: '+e.description);
		}
	};
}
	
function LiveSimpleAjaxRequest(url, param, value)
{
	var xml = new LiveAjaxCall(url);
	xml.onerror = function(message) { alert(message); }
	xml.request(param, value);
};
