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

QUR.messaging = (function () {
    const MSG = Object.freeze({
	UPDATE_SETTINGS: 0,
	GET_SETTINGS: 1,
    });
    /* listeners[msg] = [handler_0, ... handler_n] */
    const listeners = { };

    const isValidMessage = (x) => Object.values(MSG).some((m) => m === x);
    const isValidListener = (x) => typeof x === "function";

    browser.runtime.onMessage.addListener(function (request, sender, sendResponse) {
	const {msg, options} = request;
	if (msg === null) {
	    sendResponse({response: MSG});
	    return true;
	}
	if (!isValidMessage(msg)) {
	    return Promise.reject("Invalid message: " + msg.toString());
	}

	const handlers = listeners[msg];
	const details = {sendResponse, sender, options};
	handlers && handlers.forEach((fn) => fn(details));
    });

    return Object.freeze({
	MSG,

	addListener (spec) {
	    const {msg, handler} = spec;
	    if (!isValidMessage(msg) || !isValidListener(handler)) {
		return false;
	    }

	    listeners[msg] = listeners[msg] || [];
	    listeners[msg].push(handler);
	    return true;
	}
    });
}());
