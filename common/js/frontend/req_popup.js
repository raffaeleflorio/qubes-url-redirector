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

(function () {
    const a = document.getElementById("open_settings");
    a.setAttribute("href", browser.runtime.getURL("/common/html/settings.html"));
    a.addEventListener("click", function (ev) {
        browser.runtime.openOptionsPage();
        ev.preventDefault();
        window.close();
    });
}());

browser.tabs.query({active: true, currentWindow: true})
    .then(function (tab) {
        "use strict";

        const MSG_BLOCKED_RES = {msg: 6};
        return browser.runtime.sendMessage({...MSG_BLOCKED_RES, options: tab[0].id});
    })
    .then(function (resources) {
        "use strict";

        resources.forEach(function (res) {
            const row = document.getElementById("req_row_tpl").content.cloneNode(true);
            row.querySelector(".url").setAttribute("href", res.url);
            row.querySelector(".url").textContent = res.url;
            row.querySelector(".type").textContent = res.type;

            document.getElementById("blocked_resources").appendChild(row);
        });
    });
