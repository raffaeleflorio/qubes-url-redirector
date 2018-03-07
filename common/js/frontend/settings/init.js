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
	    .then(function (result) {
		if (result === null) {
		    return Promise.reject();
		} else {
		    return result.response;
		}
	    });
    }

    function fatal (error) {
	console.error(error);
	alert("A fatal error occurred. Reload the extension!");
	return false;
    }

    /* UI stuffs */
    function renderSettings (settings) {
	const form = document.getElementById("settings");
	form.default_action.value = settings.default_action;
	form.default_vm.value = settings.default_vm;
    }
    function renderWhitelist (whitelist) {
	const entries = document.getElementById("whitelist_entries");
	whitelist.forEach(function (e) {
	    console.log(e);
	});
    }

    /* Initialization */
    sendMessage({msg: null}) /* get messages */
	.then(function (messages) {
	    MSG = messages;
	})
	.then(() => sendMessage({msg: MSG.GET_SETTINGS})) /* get settings */
	.then(function (settings) {
	    renderSettings(settings);
	    document.body.style.display = "";
	})
	.then(() => sendMessage({msg: MSG.GET_WHITELIST})) /* get whitelist */
	.then(function (whitelist) {
	    renderWhitelist(whitelist);
	    console.log("[INFO] Init done");
	})
	.catch ((error) => fatal(error));

    /* HANDLERS */
    /* settings form submit handler */
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

    /* whitelist form submit handler */
    document.getElementById("whitelist").addEventListener("submit", function (ev) {
	const form = ev.target;

	const type = Number(form.type);
	const spec = Array.from(form.spec).map((x) => x.value);

	console.log(spec);

	ev.preventDefault();
    });

    /* whitelist entry type change handler */
    (function () {
	const type = Array.from(document.getElementById("whitelist").type);
	type.forEach((e) => e.addEventListener("change", function (ev) {
	    const checkedType = Number(ev.target.value);

	    const typeInfo = [];
	    typeInfo[0] = "Remember to escape special RegExp characters with a backslash.";
	    typeInfo[1] = "Escaping of special characters is done automatically.";
	    typeInfo[2] = typeInfo[1];
	    document.getElementById("type_info").textContent = typeInfo[checkedType];

	    const typeLabel = [
		"JavaScript RegExp: ",
		"Domain: www.",
		"String: "
	    ];
	    document.getElementById("type_label").firstChild.textContent = typeLabel[checkedType];
	}));
    }());
}());
