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

/* Persist to storage.local the JSON representation of objects */
QUR.JSONPersistence = (function () {
    "use strict";

    /* id -> JSON */
    // const _buffer = {};
    // const isBufferized = (id) => _buffer[id] !== undefined;

    function stackTrace (error) {
	console.error(`[JSONPersistence] ${error}`);
	console.trace();
	return false;
    }

    return Object.freeze({
	persist (objects) {
	    const toSave = {};
	    Object.keys(objects).forEach((k) => toSave[k] = JSON.stringify(objects[k]));

	    return browser.storage.local.set(toSave)
		.then(() => true)
		.catch((error) => stackTrace(error));
	},
	get (ids) {
	    return browser.storage.local.get(ids)
		.then(function (results) {
		    const ret = {};
		    Object.keys(results).forEach((k) => ret[k] = JSON.parse(results[k]));
		    return ret;
		})
		.catch((error) => stackTrace());
	},
	remove (id) {
	    return browser.storage.local.remove(id)
		.then(() => true)
		.catch((error) => stackTrace(error));
	}
    });
}());
