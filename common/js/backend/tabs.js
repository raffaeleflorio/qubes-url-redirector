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

QUR.tabs = (function () {
    "use strict";

    const _whitelistedTabs = [];

    return Object.freeze({
	create (createProperties) {
	    const {oneTimeWhitelisted} = createProperties;
	    delete createProperties.oneTimeWhitelisted;

	    return browser.tabs.create(createProperties).then(function (tab) {
		if (oneTimeWhitelisted === true) {
		    _whitelistedTabs[tab.id] = true;
		}
		return tab;
	    });
	},
	isWhitelisted (tabId) {
	    const ret = _whitelistedTabs[tabId] === true;
	    /* A tab is whitelisted for one time */
	    _whitelistedTabs.splice(tabId, 1);
	    return ret;
	}
    });
}());
