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

OPTIONS.whitelist = (function () {
    "use strict";

    /* set the handler that will be called when the type radio change */
    const entryTypeRadios = Array.from(document.getElementById("whitelist").type);
    entryTypeRadios.forEach((e) => e.addEventListener("change", function (ev) {
	const checkedType = Number(ev.target.value);

	const typeInfo = [];
	typeInfo[0] = "Remember to escape special RegExp characters with a backslash.";
	typeInfo[1] = "Escaping of special characters is done automatically.";
	typeInfo[2] = typeInfo[1];
	document.getElementById("type_info").textContent = typeInfo[checkedType];

	/* content of the label before the text input */
	const typeLabel = [
	    "JavaScript RegExp: ",
	    "String: ",
	    "Domain: www."
	];
	document.getElementById("type_label").firstChild.textContent = typeLabel[checkedType];
    }));

    /* Reset button handler */
    document.getElementById("whitelistReset").addEventListener("click", function (ev) {
	const form = document.getElementById("whitelist");
	form.reset();
    });

    return Object.freeze({
	submitHandler (ev) {
	    "use strict";

	    const form = ev.target;

	    const entrySpec = {
		type: Number(form.type.value),
		spec: null
	    };

	    if (entrySpec.type === OPTIONS.whitelist_entries.ENTRY_TYPE.DOMAIN) {
		entrySpec.spec = {};
		entrySpec.spec.domain = form.spec.value;
		entrySpec.spec.subdomain =  form.subdomain.checked;
	    } else {
		entrySpec.spec = form.spec.value;
	    }

	    const MSG = OPTIONS.messaging.MSG;
	    const sendMessage = OPTIONS.messaging.sendMessage;
	    sendMessage({msg: MSG.ADD_TO_WHITELIST, options: entrySpec})
		.then(function (result) {
		    if (result) {
			alert("Entry added successfully");
			OPTIONS.whitelist.addEntry(entrySpec);
		    } else {
			alert("Unable to add entry!");
		    }
		})
		.catch((error) => OPTIONS.fatal(error));

	    ev.preventDefault();
	},
	render (entries) {
	    "use strict";

	    const that = OPTIONS.whitelist;
	    entries.forEach(that.addEntry);
	},
	addEntry (entrySpec) {
	    "use strict";

	    const table = document.getElementById("whitelist_entries");

	    const entry = OPTIONS.whitelist_entries.makeEntry(entrySpec);
	    const row = entry.getHTMLRow();

	    const MSG = OPTIONS.messaging.MSG;
	    const sendMessage = OPTIONS.messaging.sendMessage;

	    const modifyBtn = row.childNodes[3];
	    /* Modify Button handler */
	    modifyBtn.addEventListener("click", function (ev) {
		const form = document.getElementById("whitelist");
		form.type.value = entrySpec.type;
		if (entrySpec.type === OPTIONS.whitelist_entries.ENTRY_TYPE.DOMAIN) {
		    form.spec.value = entrySpec.spec.domain;
		} else {
		    form.spec.value = entrySpec.spec;
		}
		form.subdomain.checked = entrySpec.spec.subdomain || false;


		const whitelistSubmit = document.getElementById("whitelistSubmit");
		whitelistSubmit.textContent = "Modify";
	    });

	    const rmBtn = row.childNodes[4];
	    /* Remove Button handler */
	    rmBtn.addEventListener("click", function (ev) {
		sendMessage({msg: MSG.RM_FROM_WHITELIST, options: entrySpec})
		    .then(function (result) {
			if (result) {
			    table.removeChild(row);
			    alert("Entry removed successfully!");
			} else {
			    alert("Unable to remove entry!");
			}
		    })
		    .catch((error) => OPTIONS.fatal(error));
	    });

	    row.className = "entry";
	    table.appendChild(row);
	}
    });
}());
