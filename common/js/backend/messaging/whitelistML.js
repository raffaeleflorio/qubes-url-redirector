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

QUR.messaging.addListener({
    msg: QUR.messaging.MSG.GET_WHITELIST,
    handler (details) {
	"use strict";

	const {sendResponse} = details;
	const ret = QUR.whitelist.map((entry) => entry.toJSON());
	sendResponse(ret);
    }
});

QUR.messaging.addListener({
    msg: QUR.messaging.MSG.ADD_TO_WHITELIST,
    handler (details) {
	"use strict";
	const {sendResponse, options:entrySpec} = details;
	const entry = QUR.whitelist_entries.makeEntry(entrySpec);

	QUR.whitelist.add(entry)
	    .then(sendResponse)
	    .catch(function (error) {
		console.error(error);
		sendResponse(null);
	    });
    }
});

QUR.messaging.addListener({
    msg: QUR.messaging.MSG.RM_FROM_WHITELIST,
    handler (details) {
	"use strict";

	const {sendResponse, options:entrySpec} = details;
	const entry = QUR.whitelist_entries.makeEntry(entrySpec);
	QUR.whitelist.rm(entry)
	    .then(sendResponse)
	    .catch(function (error) {
		console.error(error);
		sendResponse(null);
	    });
    }
});
