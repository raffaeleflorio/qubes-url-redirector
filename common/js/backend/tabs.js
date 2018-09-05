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

    /* tabId: {_makeTab object} */
    const _tabs = {};

    function _makeTab(whitelisted) {
        if (typeof whitelisted !== "boolean") {
            return null;
        }

        /* {url: string, type: string} */
        let _blockedRes = [];
        let _whitelisted = whitelisted;

        return Object.freeze({
            isWhitelisted () {
                const ret = _whitelisted;
                _whitelisted = false;
                return ret;
            },
            addBlockedRes (details) {
                const {url, type} = details;
                if (typeof url !== "string" || typeof type !== "string") {
                    return;
                }

                if (type === "main_frame") {
                    _blockedRes = [];
                }

                const i = _blockedRes.findIndex((d) => d.url === url);
                const newRes = Object.freeze({url, type});
                if (i !== -1) {
                    _blockedRes[i] = newRes;
                } else {
                    _blockedRes.push(newRes);
                }
            },
            getBlockedRes: () => _blockedRes.slice(0)
        });
    }

    return Object.freeze({
        create (createProperties) {
            const {oneTimeWhitelisted=false} = createProperties;

            const qurTab = _makeTab(oneTimeWhitelisted);
            if (!qurTab) {
                return Promise.reject(null);
            }

            delete createProperties.oneTimeWhitelisted;
            return browser.tabs.create(createProperties).then(function (wTab) {
                _tabs[wTab.id] = qurTab;
                return tab;
            });
        },
        addBlockedRes (details) {
            let qurTab = _tabs[details.tabId];
            if (!qurTab) {
                qurTab = _makeTab(false);
                _tabs[details.tabId] = qurTab;
            }

            qurTab.addBlockedRes(details);
        },
        getBlockedRes: (tabId) => _tabs[tabId] ? _tabs[tabId].getBlockedRes() : [],
        isWhitelisted: (tabId) => _tabs[tabId] ? _tabs[tabId].isWhitelisted() : false
    });
}());
