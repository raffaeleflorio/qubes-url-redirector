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
    "use strict";

    function attachFormHandlers () {
        document.getElementById("settings").addEventListener("submit", OPTIONS.settings.submitHandler);
        document.getElementById("whitelist").addEventListener("submit", OPTIONS.whitelist.submitHandler);
    }

    const MSG = OPTIONS.messaging.MSG;
    const sendMessage = OPTIONS.messaging.sendMessage;

    /* Initialization */
    sendMessage({msg: MSG.GET_SETTINGS})
        .then(OPTIONS.settings.render)
        .then(() => sendMessage({msg: MSG.GET_WHITELIST}))
        .then(OPTIONS.whitelist.render)
        .then(attachFormHandlers)
        .then(() => document.body.style.display = "")
        .then(() => console.info("[frontend] Init done"))
        .catch(OPTIONS.fatal);
}());
