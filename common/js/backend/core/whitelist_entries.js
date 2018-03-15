/*
 * Copyright (C) 2017,2018 Raffaele Florio <raffaeleflorio@protonmail.com>
 *
 * This file is part of qubes-url-redirector.
 *
 * qubes-url-redirector is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * qubes-url-redirector is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with qubes-url-redirector.  If not, see <http://www.gnu.org/licenses/>.
*/

QUR.whitelist_entries = Object.freeze({
    ENTRY_TYPE: Object.freeze({
	REGEXP: 0,
	EXACT: 1,
	DOMAIN: 2
    }),
    makeEntry (entrySpec) {
	"use strict";

	const that = QUR.whitelist_entries;

	const ENTRY_FUNC = [
	    that.makeRegexp,
	    that.makeExact,
	    that.makeDomain
	];

	const {type, spec} = entrySpec;
	const isValidEntryType = (v) => Object.values(that.ENTRY_TYPE).some((x) => x === v);
	if (!isValidEntryType(type) || !spec) {
	    return null;
	}

	return ENTRY_FUNC[type](spec);
    },
    isValidEntry (obj) {
	const that = QUR.whitelist_entries;

	const ENTRIES = [
	    that.makeRegexp(""),
	    that.makeExact(""),
	    that.makeDomain({domain: "example.org"})
	];

	if (typeof obj !== "object" || obj === null || typeof obj.getType !== "function") {
	    return false;
	}

	const type = obj.getType();
	const compEntry = ENTRIES[type];
	return Object.keys(obj).every((k) => typeof obj[k] === typeof compEntry[k]);
    },
    makeRegexp (spec) {
	"use strict";

	if (typeof spec !== "string") {
	    return null;
	}

	const that = QUR.whitelist_entries;

	const MY_TYPE = that.ENTRY_TYPE.REGEXP;
	const reObj = new RegExp(spec);
	const json = Object.freeze({type: MY_TYPE, spec: spec});
	return Object.freeze({
	    getType: () => MY_TYPE,
	    test: (v) => reObj.test(v),
	    toString: () => reObj.toString(),
	    toJSON: () => json
	});
    },
    makeExact (spec) {
	"use strict";

	if (typeof spec !== "string") {
	    return null;
	}

	const that = QUR.whitelist_entries;

	const MY_TYPE = that.ENTRY_TYPE.EXACT;
	const reObj = new RegExp("^" + that.escapeRE(spec) + "$");
	const simpleString = reObj.toString().slice(2, -2);
	const json = Object.freeze({type: MY_TYPE, spec: spec});
	return Object.freeze({
	    getType: () => MY_TYPE,
	    test: (v) => reObj.test(v),
	    toString: (detailed = false) => detailed ? reObj.toString() : simpleString,
	    toJSON: () => json
	});
    },
    makeDomain (spec) {
	"use strict";

	const domain = spec.domain;
	const subdomain = spec.subdomain || false;

	const isValidName = (v) => (/^([\w\-]+\.\w+)+$/).test(v);
	if (!isValidName(domain) || typeof subdomain !== "boolean") {
	    return null;
	}


	const that = QUR.whitelist_entries;

	const MY_TYPE = that.ENTRY_TYPE.DOMAIN;
	const reObj = new RegExp(function () {
	    const subPrefix = "(?:[\\w\\-]+\\.)*";
	    const prefix = "^(?:https?://)?(?:www\\.)?" + (subdomain ? subPrefix : "");
	    
	    return prefix + that.escapeRE(domain);
	}());
	const simpleString = (subdomain ? "*." : "") + domain;
	const json = Object.freeze({
	    type: MY_TYPE,
	    spec: Object.freeze({domain, subdomain})
	});
	return Object.freeze({
	    getType: () => MY_TYPE,
	    test: (v) => reObj.test(v),
	    toString: (detailed = false) => detailed ? reObj.toString() : simpleString,
	    toJSON: () => json
	});
    },
    escapeRE: (v) => v.replace(/[|\\{}\[\]^$+*?.]/g, "\\$&")
});
