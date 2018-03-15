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

OPTIONS.messaging = Object.freeze({
    MSG: Object.freeze({
	UPDATE_SETTINGS: 0,
	GET_SETTINGS: 1,
	ADD_TO_WHITELIST: 2,
	GET_WHITELIST: 3,
	RM_FROM_WHITELIST: 4,
	REPLACE_IN_WHITELIST: 5
    }),
    sendMessage (message) {
	"use strict";

	return browser.runtime.sendMessage(message)
	    .then(function (response) {
		if (response === null) {
		    return Promise.reject("Communication error")
		}

		return response;
	    });
    }
});
