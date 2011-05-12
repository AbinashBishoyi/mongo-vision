//
// Copyright 2010-2011 Three Crickets LLC.
//
// The contents of this file are subject to the terms of the Apache License
// version 2.0: http://www.opensource.org/licenses/apache2.0.php
// 
// Alternatively, you can obtain a royalty free commercial license with less
// limitations, transferable or non-transferable, directly from Three Crickets
// at http://threecrickets.com/
//

/**
 * Ext.ux.HumanJSON
 *
 * A JSON encoder that supports optional multiline indenting, HTML vs. plain text,
 * and removing curly brackets from the root object. The point is to produce
 * human-readable JSON, not necessarily the most compact JSON.
 *
 * We've been inspired by the code in Ext.util.JSON, though have diverged
 * significantly. We also use some code from Douglas Crockford's json2.js.
*/

Ext.namespace('Ext.ux.HumanJSON');

Ext.ux.HumanJSON.escapable = /[\\\"\x00-\x1f\x7f-\x9f\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g;
Ext.ux.HumanJSON.meta = {
	'\b': '\\b',
	'\t': '\\t',
	'\n': '\\n',
	'\f': '\\f',
	'\r': '\\r',
	'"' : '\\"',
	'\\': '\\\\'
};

Ext.ux.HumanJSON.quote = function(string) {
	// Yanked from Douglas Crockford's json2.js (public domain)
	
	// If the string contains no control characters, no quote characters, and no
	// backslash characters, then we can safely slap some quotes around it.
	// Otherwise we must also replace the offending characters with safe escape
	// sequences.
	
	Ext.ux.HumanJSON.escapable.lastIndex = 0;
	return Ext.ux.HumanJSON.escapable.test(string) ? '"' + string.replace(Ext.ux.HumanJSON.escapable, function(a) {
		var c = Ext.ux.HumanJSON.meta[a];
		return typeof c === 'string' ? c : '\\u' + ('0000' + a.charCodeAt(0).toString(16)).slice(-4);
	}) + '"' : '"' + string + '"';
};

Ext.ux.HumanJSON.encode = function(value, html, multiline) {
	function toJSON(value, html, multiline, indent, depth) {
		var json = '';
		
		function space() {
			return html ? '&nbsp;&nbsp;&nbsp;' : '\t';
		}
		
		var indentation = '';
		if (multiline) {
			for (var i = 0; i < depth; i++) {
				indentation += space();
			}
		}
		if (indent) {
			json += indentation;
		}
		
		if ((value == null) || !Ext.isDefined(value)) {
			json += 'null';
		}
		else if (Ext.isString(value)) {
			if (html) {
				value = value.replace(/</g, '&lt;');
				value = value.replace(/>/g, '&gt;');
			}
			json += Ext.ux.HumanJSON.quote(value);
		}
		else if (typeof value == 'number') {
			// Don't use isNumber here, since finite checks happen inside isNumber
			json += (isFinite(value) ? String(value) : 'null');
		}
		else if (Ext.isBoolean(value)) {
			json += String(value);
		}
		else if (Ext.isArray(value)) {
			json += html ? '<span class="json-symbol">[</span>' : '[';
			var length = value.length;
			if (length > 0) {
				if (multiline) {
					json += html ? '<br/>' : '\n';
				}
				for (var i = 0; i < length - 1; i++) {
					json += toJSON(value[i], html, multiline, true, depth + 1) + (multiline ? (html ? ',<br/>' : ',\n') : ', ');
				}
				json += toJSON(value[i], html, multiline, true, depth + 1);
				if (multiline) {
					json += (html ? '<br/>' : '\n') + indentation;
				}
			}
			json += html ? '<span class="json-symbol">]</span>' : ']';
		}
		else {
			if (depth > -1) {
				json += html ? '<span class="json-symbol">{</span>' : '{';
			}
			var keys = [];
			for (var key in value) {
				keys.push(key);
			}
			var length = keys.length;
			if (length > 0) {
				if (multiline && (depth > -1)) {
					json += html ? '<br/>' : '\n';
				}
				for (var i = 0; i < length - 1; i++) {
					if (multiline && (depth > -1)) {
						json += indentation + space();
					}
					json +=
						(html ? '<span class="json-key">' + keys[i] + ':</span> ' : keys[i] + ': ') +
						toJSON(value[keys[i]], html, multiline, false, depth + 1) +
						(multiline ? (html ? '<span class="json-symbol">,</span><br/>' : ',\n') : (html ? '<span class="json-symbol">,</span> ' : ', '));
				}
				if (multiline && (depth > -1)) {
					json += indentation + space();
				}
				json += 
					(html ? '<span class="json-key">' + keys[i] + ':</span> ' : keys[i] + ': ') +
					toJSON(value[keys[i]], html, multiline, false, depth + 1);
				if (multiline && (depth > -1)) {
					json += (html ? '<br/>' : '\n') + indentation;
				}
			}
			if (depth > -1) {
				json += html ? '<span class="json-symbol">}</span>' : '}';
			}
		}
	
		return json;
	}

	return toJSON(value, html, multiline, false, -1);
};
