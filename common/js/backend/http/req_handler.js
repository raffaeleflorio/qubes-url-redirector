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

browser.webRequest.onBeforeRequest.addListener(function (details) {
    "use strict";

    const console_prefix = "[req_handler] ";

    /*
     *
     * Chain of functions to estabilish if a request will be cancelled or redirected.
     * Each function could return one of these objects:
     *     *) An object with either cancel or redirectUrl property, but not both.
     *     *) An optional details object to be passed to the next function.
     *        Details object could be modified by the functions.
     * If the functions don't make a decision (i.e. they never return the object with cancel or redirectUrl),
     * the request is permitted.
     *
     */
    const fns = [
	chrome_fix,
	firewall
    ];

    let finalResponse = {cancel: false};

    let fnResponse = details;
    fns.some(function (fn) {
	fnResponse = fn(fnResponse) || fnResponse;

	const cancelled = typeof fnResponse.cancel !== "undefined";
	const redirected = typeof fnResponse.redirectUrl !== "undefined";

	if (cancelled || redirected) {
	    const msg = [
		console_prefix + details.url,
		(redirected ? "redirected" : (fnResponse.cancel === true ? "blocked" : "permitted")),
		"by the handler: " + fn.name
	    ].join(" ");
	    console.warn(msg);

	    finalResponse = fnResponse;
	    return true;
	}
    });

    if (finalResponse.cancel === false) {
	console.warn(console_prefix + details.url + " permitted");
    }
    return finalResponse;
}, {urls: ["<all_urls>"]}, ["blocking"]);
