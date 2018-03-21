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

QUR.ready.then(function () {
    "use strict";
    browser.webRequest.onBeforeRequest.addListener(function (details) {
	const console_prefix = "[req_handler] ";

	/*
	 *
	 * Chain of functions to estabilish if a request will be cancelled or redirected.
	 * Each function could return one of these objects:
	 *     *) An object with either cancel or redirectUrl property, but not both.
	 *        In this case the handler make a decision.
	 *     *) An **optional** details object to be passed to the next function.
	 *        Details object could be modified by the functions.
	 * If the functions don't make a decision the request is permitted.
	 *
	 */
	const fns = [
	    function isDisabled () {
		if (QUR.settings.getDefaultAction() === QUR.settings.ACTION.OPEN_HERE) {
		    return {cancel: false};
		}
	    },
	    function chrome_fix (details) {
		/* intercept only HTTP(S) request */
		if (!(/^https?:\/\//).test(details.url)) {
		    return {cancel: false};
		}
	    },
	    function firewall (details) {
		if (!QUR.whitelist.test(details.url)) {
		    return {cancel: true};
		}
	    }
	];

	let finalResponse = null;

	let fnResponse = details;
	fns.some(function (fn) {
	    fnResponse = fn(fnResponse) || fnResponse;

	    const cancelled = fnResponse.cancel !== undefined;
	    const redirected = fnResponse.redirectUrl !== undefined;

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

	/* no decision was made by the above handlers */
	if (finalResponse === null) {
	    console.warn(console_prefix + "the request to " + details.url + " is permitted");
	}

	/* only url in main frame or related to a tab will be opened in another qube */
	const isValidRequestToRedirect = (details) => details.type === "main_frame" && details.tabId !== -1;
	if (finalResponse && finalResponse.cancel === true && isValidRequestToRedirect(details)) {
	    const openInDvm = QUR.settings.getDefaultAction() === QUR.settings.ACTION.DVM;

	    const vmname = openInDvm ? "$dispvm" : QUR.settings.getDefaultVm();
	    QUR.native.openurl({vmname, url: details.url});
	}

	return finalResponse;
    }, {urls: ["<all_urls>"]}, ["blocking"]);
});
