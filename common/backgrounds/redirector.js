/*
 * Copyright (C) 2017 Raffaele Florio <raffaeleflorio@protonmail.com>
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

const redirector = () => {
    let processedRequest = [];

    return ({
	route: (details) => {
	    /* chrome fix */
	    if (!/^https?:\/\//.test(details.url))
		return {cancel: false};

	    if (qur.anti_rdr.test(details.url))
		return {redirectUrl: qur.anti_rdr.escape(details.url)};

	    if (processedRequest.indexOf(details.requestId) !== -1)
		return {cancel: false};
	    
	    const default_action = qur.settings.getDefaultAction();
	    const whitelistPass = qur.whitelist.test(details.url);
	    const openHere = default_action === qur.settings.ACTION.HERE || whitelistPass;

	    if (!openHere) {
		const vmname = default_action === qur.settings.ACTION.DVM ? "$dispvm" : qur.settings.getDefaultVm();

		/* Immediate closing in Chrome */
		if (browser.isPolyfilled)
		    browser.tabs.remove(details.tabId);
		else
		    browser.tabs.get(details.tabId)
		    .then((requestTab) => {
			if (requestTab.url === "about:blank")
			    browser.tabs.remove(details.tabId);
		    });
		
		qur.native.openurl(vmname, details.url);
		return {cancel: true};
	    } else {
		if (processedRequest.indexOf(details.requestId) === -1)
		    processedRequest.push(details.requestId);
		return {cancel: false};
	    }
	}
    });
};
