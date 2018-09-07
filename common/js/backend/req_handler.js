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

    const _isTopRequest = (details) => details.type === "main_frame";
    /* only request related to a tab and to a main frame should be redirected to another qube */
    const _isValidRequestToRedirect = (details) => _isTopRequest(details) && details.tabId !== -1;

    function _isNativeRequired (action) {
        return action === QUR.settings.ACTION.DVM || action === QUR.settings.ACTION.DEFAULT_VM;
    }

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
        function anti_rdr (details) {
            const antis = [
                {
                    /* google rwt */
                    urlRegexp: /^(?:https:?\/\/)?(?:www\.)?google\.\w+\/url\?/,
                    parameter: "url"
                }
            ];

            const {url, tabId} = details;
            const i = antis.findIndex((a) => a.urlRegexp.test(url));
            if (i > -1 && _isTopRequest(details)) {
                const anti = antis[i];
                return {redirectUrl: new URL(url).searchParams.get(anti.parameter)};
            }
        },
        function tabIsWhitelisted (details) {
            if (QUR.tabs.isWhitelisted(details.tabId)) {
                return {cancel: false};
            }
        },
        function chrome_fix (details) {
            if ((/^chrome-extension:\/\//).test(details.url)) {
                return {cancel: false};
            }
        },
        function data_fix (details) {
            if ((/^data:/).test(details.url)) {
                return {cancel: false};
            }
        },
        function firewall (details) {
            const {tabId, url} = details;
            if (QUR.whitelist.isWhitelisted(url)) {
                if (_isTopRequest(details)) {
                    QUR.tabs.clearBlockedRes(tabId);
                } else {
                    QUR.tabs.rmBlockedRes(details);
                }
                return {cancel: false};
            }

            const defaultAction = QUR.settings.getDefaultAction();
            if (_isValidRequestToRedirect(details)) {

                if (_isNativeRequired(defaultAction)) {
                    const openInDvm = QUR.settings.getDefaultAction() === QUR.settings.ACTION.DVM;
                    const vmname = openInDvm === true ? "$dispvm" : QUR.settings.getDefaultVm();

                    QUR.native.openurl({vmname, url});
                }

                const firewall_page = FIREWALL_PAGE + "?url=" + encodeURIComponent(url);
                browser.tabs.update(tabId, {url: firewall_page});
            }

            QUR.tabs.addBlockedRes(details);
            return {cancel: true};
        }
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
