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

    let MSG = null;
    function sendMessage (message) {
	return browser.runtime.sendMessage(message)
	    .then((results) => results.response);
    }

    function fatal (error) {
	console.error(error);
	alert("A fatal error occurred. The extension couldn't work anymore!");
	return false;
    }

    /* UI stuffs */
    function renderSettings (settings) {
	const form = document.getElementById("settings");
	form.default_action.value = settings.default_action;
	form.default_vm.value = settings.default_vm;
    }

    /* INIT: get messages and settings */
    sendMessage({msg: null})
	.then(function (messages) {
	    MSG = messages;
	})
	.then(() => sendMessage({msg: MSG.GET_SETTINGS}))
	.then(function (settings) {
	    renderSettings(settings);
	    document.body.style.display = "";
	    console.log("[INFO] Init done");
	})
	.catch ((error) => fatal(error));


    /* settings submit handler */
    document.getElementById("settings").addEventListener("submit", function (ev) {
	const form = ev.target;

	const default_action = Number(form.default_action.value);
	const default_vm = form.default_vm.value || null;
	const newSettings = {default_action, default_vm};

	sendMessage({msg: MSG.UPDATE_SETTINGS, options: newSettings})
	    .then(function (result) {
		if (result) {
		    alert("Settings saved successfully");
		    renderSettings(newSettings);
		} else {
		    alert("Unable to save settings!");
		}
	    })
	    .catch((error) => fatal(error));
	
	ev.preventDefault();
    });
}());
