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

function settingsSubmit (ev) {
    "use strict";

    const form = ev.target;

    const default_action = Number(form.default_action.value);
    const default_vm = form.default_vm.value || null;
    const newSettings = {default_action, default_vm};

    sendMessage({msg: MSG.UPDATE_SETTINGS, options: newSettings})
	.then(function (result) {
	    if (result) {
		alert("Settings saved successfully");
	    } else {
		alert("Unable to save settings!");
	    }
	})
	.catch((error) => fatal(error));

    ev.preventDefault();
}

function whitelistSubmit (ev) {
    "use strict";

    const form = ev.target;

    const entrySpec = {
	type: Number(form.type.value),
	spec: null
    };

    /* domain */
    if (entrySpec.type === 2) {
	entrySpec.spec = {};
	entrySpec.spec.domain = form.spec.value;
	entrySpec.spec.subdomain =  form.subdomain.checked;
    } else {
	entrySpec.spec = form.spec.value;
    }

    sendMessage({msg: MSG.ADD_TO_WHITELIST, options: entrySpec})
	.then(function (response) {
	    if (response.result) {
		alert("Entry added successfully");
		addEntry(response.addedEntry);
	    } else {
		alert("Unable to add entry!");
	    }
	})
	.catch((error) => fatal(error));

    ev.preventDefault();
}
