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

const REQ_POPUP = {
    fatal (error) {
        "use strict";

        console.error(error);
        alert("A fatal error occurred. Reload the extension!");
    }
};

(function () {
    "use strict";

    const a = document.getElementById("open_settings");
    a.setAttribute("href", browser.runtime.getURL("/common/html/settings.html"));
    a.addEventListener("click", function (ev) {
        browser.runtime.openOptionsPage();
        ev.preventDefault();
        window.close();
    });
}());

(function () {
    "use strict";

    function render (resources) {
        Array.from(document.getElementsByClassName("res")).forEach(function (r) {
            document.getElementById("blocked_resources").removeChild(r);
        });

        resources.forEach(addRes);
    }

    function addRes (res) {
        const row = document.getElementById("req_row_tpl").content.cloneNode(true);
        row.querySelector(".url").setAttribute("href", res.url);
        row.querySelector(".url").textContent = res.url;
        row.querySelector(".type").textContent = res.type;

        row.querySelector(".allow").addEventListener("click", function (ev) {
            const EXACT = 1;
            const MSG_ADD_TO_WHITELIST = {msg: 2};
            const options = {
                type: EXACT,
                spec: {exact: res.url, label: "Added from the popup"}
            };

            browser.runtime.sendMessage({...MSG_ADD_TO_WHITELIST, options}).then(function () {
                const tabId = REQ_POPUP.TAB_ID;

                if (res.type === "main_frame") {
                    browser.tabs.update(tabId, {url: res.url});
                } else {
                    browser.tabs.reload(tabId);
                }

                browser.tabs.onUpdated.addListener(function (tabId) {
                    getBlockedRes(tabId).then(render);
                },{
                    properties: ["status"],
                    tabId
                });
            }).catch(REQ_POPUP.fatal);
        });

        document.getElementById("blocked_resources").appendChild(row);
    }

    function getBlockedRes () {
        const MSG_BLOCKED_RES = {msg: 6};
        return browser.runtime.sendMessage({...MSG_BLOCKED_RES, options: REQ_POPUP.tabId});
    }

    browser.tabs.query({active: true, currentWindow: true})
        .then((tab) => REQ_POPUP.tabId = tab[0].id)
        .then(getBlockedRes)
        .then(render)
        .catch(REQ_POPUP.fatal);
}());
