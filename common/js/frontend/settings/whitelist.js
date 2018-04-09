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

    const MSG = OPTIONS.messaging.MSG;
    const sendMessage = OPTIONS.messaging.sendMessage;

    const updateWhitelistForm = (function () {
	/* #type_info update */
	function updateTypeInfo (activeType) {
	    const typeInfo = [];
	    typeInfo[0] = "Remember to escape special RegExp characters with a backslash. Escaping of slash is optional.";
	    typeInfo[1] = "Escaping of special characters is done automatically.";
	    typeInfo[2] = typeInfo[1];

	    document.getElementById("type_info").textContent = typeInfo[activeType];
	}
	/* #type_label update */
	function updateTypeLabel (activeType) {
	    const typeLabel = [
		"JavaScript RegExp: ",
		"String: ",
		"Host (IP or Domain Name): "
	    ];

	    document.getElementById("type_label").firstChild.textContent = typeLabel[activeType];
	}
	/* #whitelist update */
	function updateFormInput (activeType) {
	    const form = document.getElementById("whitelist");

	    if (activeType === OPTIONS.whitelist_entries.ENTRY_TYPE.DOMAIN) {
		const urlSpec = document.getElementsByClassName("entry_spec_url");
		Array.from(urlSpec).forEach((e) => e.style.display = "block");
	    } else {
		const urlSpec = document.getElementsByClassName("entry_spec_url");
		Array.from(urlSpec).forEach((e) => e.style.display = "none");
		form.all_subdomain.checked = false;
	    }
	}
	/* update everything according the active entry type */
	function _updateWhitelist (activeType) {
	    updateTypeInfo(activeType);
	    updateTypeLabel(activeType);
	    updateFormInput(activeType);
	}

	Array.from(document.getElementById("whitelist").type).forEach(function (radioType) {
	    radioType.addEventListener("change", () => _updateWhitelist(Number(radioType.value)));
	});

	return _updateWhitelist;
    }());

    /*
     * Make the spec to build the whitelist entry
     */
    function buildEntrySpec (form) {
	const entrySpec = {
	    type: Number(form.type.value),
	    spec: null
	};

	if (entrySpec.type === OPTIONS.whitelist_entries.ENTRY_TYPE.DOMAIN) {
	    entrySpec.spec = {};
	    entrySpec.spec.domain = form.spec.value;
	    entrySpec.spec.subdomain =  form.all_subdomain.checked;
	    entrySpec.spec.schemas = form.schemas.value.split("|");
	} else {
	    entrySpec.spec = form.spec.value;
	}
	return entrySpec;
    }

    /*
     * The reset function of the whitelistReset button
     */
    const formReset = (function () {
	function _formReset (ev) {
	    const form = ev && ev.target.parentNode || document.getElementById("whitelist");
	    form.reset();
	    form.setAttribute("data-mode", "insert");

	    const defaultType = OPTIONS.whitelist_entries.ENTRY_TYPE.REGEXP;
	    updateWhitelistForm(defaultType);

	    document.getElementById("whitelistSubmit").textContent = "Save";
	};

	document.getElementById("whitelistReset").addEventListener("click", _formReset);
	return _formReset;
    }());

    /*
     * Button Handlers of the whitelist entries
     */
    const buttonHandler = {
	modify (ev) {
	    const row = ev.target.parentNode.parentNode;
	    let entrySpec = row.getAttribute("data-entrySpec");

	    const form = document.getElementById("whitelist");
	    form.setAttribute("data-mode", "replace");
	    form.setAttribute("data-entrySpecToReplace", entrySpec);

	    entrySpec = JSON.parse(entrySpec);
	    form.type.value = entrySpec.type;
	    if (entrySpec.type === OPTIONS.whitelist_entries.ENTRY_TYPE.DOMAIN) {
		form.spec.value = entrySpec.spec.domain;
		form.all_subdomain.checked = entrySpec.spec.subdomain || false;
	    } else {
		form.spec.value = entrySpec.spec;
	    }

	    updateWhitelistForm(entrySpec.type);
	    const whitelistSubmit = document.getElementById("whitelistSubmit");
	    whitelistSubmit.textContent = "Modify";
	},
	remove (ev) {
	    const row = ev.target.parentNode.parentNode;
	    const entrySpec = JSON.parse(row.getAttribute("data-entrySpec"));

	    sendMessage({msg: MSG.RM_FROM_WHITELIST, options: entrySpec})
		.then(function (result) {
		    if (result) {
			const table = document.getElementById("whitelist_entries");
			table.removeChild(row);
			alert("Entry removed successfully!");
		    } else {
			alert("Unable to remove entry!");
		    }
		})
		.catch(OPTIONS.fatal);
	}
    };

    function mapEntrySpecToRow (entrySpec) {
	const entry = OPTIONS.whitelist_entries.makeEntry(entrySpec);
	const row = document.getElementById("whitelist_row_tpl").content.cloneNode(true);

	row.querySelector(".simple").textContent = entry.getSimple();
	row.querySelector(".detailed").textContent = entry.getDetailed();
	row.querySelector(".type").textContent = entry.getType();

	row.querySelector(".entry").setAttribute("data-entrySpec", JSON.stringify(entrySpec));

	row.querySelector(".modify").addEventListener("click", buttonHandler.modify);
	row.querySelector(".remove").addEventListener("click", buttonHandler.remove);

	return row;
    }

    return Object.freeze({
	submitHandler (ev) {
	    const form = ev.target;
	    const entrySpec = buildEntrySpec(form);

	    const replaceMode = form.getAttribute("data-mode") === "replace";

	    if (replaceMode) {
		const entrySpecToReplace = JSON.parse(form.getAttribute("data-entrySpecToReplace"));

		sendMessage({msg: MSG.REPLACE_IN_WHITELIST, options: {oldEntrySpec: entrySpecToReplace, newEntrySpec: entrySpec}})
		    .then(function (result) {
			if (result) {
			    alert("Entry modified successfully");
			    OPTIONS.whitelist.replaceEntry(entrySpecToReplace, entrySpec);
			    formReset();
			}else {
			    alert("Unable to modify entry!");
			}
		    })
		    .catch(OPTIONS.fatal);
	    } else {
		sendMessage({msg: MSG.ADD_TO_WHITELIST, options: entrySpec})
		    .then(function (result) {
			if (result) {
			    alert("Entry added successfully");
			    OPTIONS.whitelist.addEntry(entrySpec);
			    formReset();
			} else {
			    alert("Unable to add entry!");
			}
		    })
		    .catch(OPTIONS.fatal);
	    }

	    ev.preventDefault();
	},
	replaceEntry (entrySpecToReplace, newEntrySpec) {
	    const table = document.getElementById("whitelist_entries");
	    const oldRow = table.querySelector("tr[data-entrySpec='" + JSON.stringify(entrySpecToReplace) + "']");
	    const newRow = mapEntrySpecToRow(newEntrySpec);
	    table.replaceChild(newRow, oldRow);
	},
	addEntry (entrySpec) {
	    const table = document.getElementById("whitelist_entries");
	    const row = mapEntrySpecToRow(entrySpec);
	    table.appendChild(row);
	},
	render: (entries) => entries.forEach(OPTIONS.whitelist.addEntry)
    });
}());
