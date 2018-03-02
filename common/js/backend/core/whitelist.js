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

QUR.whitelist = (function () {
    "use strict";

    let _whitelist = [];

    const findIndex = (entry) => _whitelist.findIndex((x) => x.toString(true) === entry.toString(true));

    /* PUBLIC */
    return Object.freeze({
	toString: () => _whitelist.toString(),
	toJSON: () => JSON.stringify(_whitelist),
	test: (value) => _whitelist.some((x) => x.test(value)),
	add (entry) {
	    if (findIndex(entry) >= 0) {
		return false;
	    }

	    _whitelist.push(entry);
	    return true;
	},
	rm (entry) {
	    const i = findIndex(entry);
	    if (i === -1) {
		return false;
	    }
	    
	    _whitelist.splice(i, 1);
	    return true;
	},
	replace (oldEntry, newEntry) {
	    const i = findIndex(oldEntry);
	    const j = findIndex(newEntry);
	    if (i === -1 || j >= 0) {
		return false;
	    }

	    _whitelist[i] = newEntry;
	    return true;
	},
	clear () {
	    _whitelist = [];
	}
    });
}());
