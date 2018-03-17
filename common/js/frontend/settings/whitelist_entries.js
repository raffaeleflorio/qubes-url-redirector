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

OPTIONS.whitelist_entries = (function () {
    "use strict";

    const escapeRE = (v) => v.replace(/[|\\{}\[\]^$+*?.]/g, "\\$&");

    function makeBaseEntry () {
	const modifyButton = document.createElement("button");
	modifyButton.textContent = "Modify";

	const rmButton = document.createElement("button");
	rmButton.textContent = "Remove";

	/* SimpleString | DetailedString | EntryTypeString | ModifyBtn | RmBtn*/
	const cells = [];
	for (let i = 0; i < 5; ++i) {
	    cells[i] = document.createElement("td");
	}
	cells[3].appendChild(modifyButton);
	cells[4].appendChild(rmButton);

	const row = document.createElement("tr");
	cells.forEach((c) => row.appendChild(c));
	const getHTMLRow = () => row;

	return Object.freeze({
	    setSimple: (simple) => cells[0].textContent = simple,
	    setDetailed: (detailed) => cells[1].textContent = detailed,
	    setType: (type) => cells[2].textContent = type,
	    getHTMLRow,
	    getPublic: () => Object.freeze({getHTMLRow})
	});
    }

    return Object.freeze({
	ENTRY_TYPE: Object.freeze({
	    REGEXP: 0,
	    EXACT: 1,
	    DOMAIN: 2
	}),
	makeEntry (entrySpec) {
	    const that = OPTIONS.whitelist_entries;

	    const ENTRY_FUNC = [
		that.makeRegexp,
		that.makeExact,
		that.makeDomain
	    ];

	    const {type, spec} = entrySpec;

	    return ENTRY_FUNC[type](spec);
	},
	makeRegexp (spec) {
	    const base = makeBaseEntry(spec);
	    base.setSimple("/" + spec + "/");
	    base.setDetailed("/" + spec + "/");
	    base.setType("RegExp");
	    return base.getPublic();
	},
	makeExact (spec) {
	    const base = makeBaseEntry(spec);
	    base.setSimple(spec);
	    base.setDetailed("/^" + escapeRE(spec) + "$/");
	    base.setType("Exact Match");
	    return base.getPublic();
	},
	makeDomain (spec) {
	    const base = makeBaseEntry(spec);
	    const {domain, subdomain, schemas} = spec;

	    const schemaPrefix =  schemas.join("|");
	    const subPrefix = "(?:[\\w\\-]+\\.)*";
	    const prefix = "^(?:" + schemaPrefix + ")://?(?:www\\.)?" + (subdomain ? subPrefix : "");

	    const simpleString = [
		schemas.length > 1 ? "(" + schemaPrefix + ")" : schemaPrefix,
		"://" + (subdomain ? "*." : "") + domain
	    ].join("");

	    base.setSimple(simpleString);
	    base.setDetailed(prefix + escapeRE(domain));
	    base.setType("Domain");
	    return base.getPublic();
	}
    });
}());
