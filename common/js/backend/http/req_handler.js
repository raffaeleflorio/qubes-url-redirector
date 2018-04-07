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

    const console_prefix = "[req_handler] ";

    const FIREWALL_PAGE = browser.runtime.getURL("/common/html/firewall.html");
    const LIMITATOR_PAGE = browser.runtime.getURL("/common/html/limitator.html");

    /* only request related to a tab and to a main frame should be redirected to another qube */
    const isValidRequestToRedirect = (details) => details.type === "main_frame" && details.tabId !== -1;

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
	function tabIsWhitelisted (details) {
	    if (QUR.tabs.isWhitelisted(details.tabId)) {
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
	    if (!QUR.whitelist.isWhitelisted(details.url)) {
		if (!isValidRequestToRedirect(details)) {
		    return {cancel: true};
		}
		/* pass to the limitator the non whitelisted request */
		return details;
	    } else {
		return {cancel: false};
	    }
	},
	(function () {
	    const MAX_REQ = 3; /* QUR.settings.getMaxReqPerThreshold() */
	    const THRESHOLD = 1000; /* QUR.settings.getReqThreshold() */

	    let currentRequestCount = 0;
	    let lastTimeStamp = null;

	    function openInQube (reqDetails) {
		const openInDvm = QUR.settings.getDefaultAction() === QUR.settings.ACTION.DVM;
		const vmname = openInDvm === true ? "$dispvm" : QUR.settings.getDefaultVm();

		const {tabId, url} = reqDetails;
		QUR.native.openurl({vmname, url});
		browser.tabs.update(tabId, {url: FIREWALL_PAGE});
	    }

	    function setWaitTime () {
		/*
		 * min(WAIT_TIME) = THRESHOLD*2
		 * max(WAIT_TIME) = min + 3000
		 */
		const WAIT_TIME = Math.round((Math.random() * 3000) + (THRESHOLD * 2));
		const now = Date.now();
		const base = lastTimeStamp > (now + WAIT_TIME) ? lastTimeStamp : now;
		lastTimeStamp = base + WAIT_TIME;
	    }


	    return function limitator (details) {
		const currentTimeStamp = details.timeStamp;
		const diff = currentTimeStamp - lastTimeStamp;

		currentRequestCount += 1;
		if (lastTimeStamp === null || diff > THRESHOLD) {
		    lastTimeStamp = currentTimeStamp;
		    currentRequestCount = 1;

		    openInQube(details);
		} else if (diff <= THRESHOLD && currentRequestCount > MAX_REQ) {
		    setWaitTime();
		    browser.tabs.update(details.tabId, {url: LIMITATOR_PAGE});
		} else if (diff <= THRESHOLD && currentRequestCount <= MAX_REQ) {
		    openInQube(details);
		    if (currentRequestCount === MAX_REQ) {
			setWaitTime();
		    }
		}

		return {cancel: true};
	    }
	}())
    ];

    browser.webRequest.onBeforeRequest.addListener(function (details) {
	/* the response returned to the browser */
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

	/* no decision was made by the above handlers, so permit the request */
	if (finalResponse === null) {
	    finalResponse = {cancel: false};
	    console.warn(console_prefix + "the request to " + details.url + " is permitted");
	}

	return finalResponse;
    }, {urls: ["<all_urls>"]}, ["blocking"]);
});
