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

    /* used by submitHandler when an entry should be replaced by another one */
    let replaceEntry = false;
    let entrySpecToReplace = null;
    let rowToReplace = null;

    /*
     * Update #type_label according the selected entry type
     */
    function updateTypeLabel (activeType) {
	const typeLabel = [
	    "JavaScript RegExp: ",
	    "String: ",
	    "Protocol and domain name: "
	];

	document.getElementById("type_label").firstChild.textContent = typeLabel[activeType];
    }

    /*
     * Update #type_info according the selected entry type
     */
    function updateTypeInfo (activeType) {
	const typeInfo = [];
	typeInfo[0] = "Remember to escape special RegExp characters with a backslash. Escaping of slash is optional.";
	typeInfo[1] = "Escaping of special characters is done automatically.";
	typeInfo[2] = typeInfo[1];

	document.getElementById("type_info").textContent = typeInfo[activeType];
    }

    /*
     * Show/Hide input in #whitelist according the selected entry type
     */
    function updateFormInput (activeType) {
	const form = document.getElementById("whitelist");

	if (activeType === OPTIONS.whitelist_entries.ENTRY_TYPE.DOMAIN) {
	    form.subdomain.parentNode.style.display = "";
	    form.schemas.parentNode.style.display = "";
	} else {
	    form.schemas.parentNode.style.display = "none";
	    form.subdomain.parentNode.style.display = "none";
	    form.subdomain.checked = false;
	}
    }

    /*
     * Update the #whitelist form according the selected entry type
     */
    function updateWhitelist (activeType) {
	updateTypeInfo(activeType);
	updateTypeLabel(activeType);
	updateFormInput(activeType);
    }

    /*
     * Handle the change of the selected entry radio
     */
    Array.from(document.getElementById("whitelist").type).forEach(function (radioType) {
	radioType.addEventListener("change", () => updateWhitelist(Number(radioType.value)));
    });

    /*
     * #whitelist reset
     */
    function formReset () {
	document.getElementById("whitelist").reset();

	const defaultType = OPTIONS.whitelist_entries.ENTRY_TYPE.REGEXP;
	updateWhitelist(defaultType);

	replaceEntry = false;
	entrySpecToReplace = null;
	rowToReplace = null;
	document.getElementById("whitelistSubmit").textContent = "Save";
    };
    /* attach to the reset */
    document.getElementById("whitelistReset").addEventListener("click", formReset);

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
	    entrySpec.spec.subdomain =  form.subdomain.checked;
	    entrySpec.spec.schemas = form.schemas.value.split("|");
	} else {
	    entrySpec.spec = form.spec.value;
	}
	return entrySpec;
    }

    /*
     * ctx is the entrySpec and the related row
     */
    function modifyButtonHandler (ctx) {
	const form = document.getElementById("whitelist");
	const {row, entrySpec} = ctx;

	form.type.value = entrySpec.type;
	if (entrySpec.type === OPTIONS.whitelist_entries.ENTRY_TYPE.DOMAIN) {
	    form.spec.value = entrySpec.spec.domain;
	    form.subdomain.checked = entrySpec.spec.subdomain || false;
	    form.subdomain.parentNode.style.display = "";
	    form.schemas.parentNode.style.display = "";
	} else {
	    form.spec.value = entrySpec.spec;
	}

	const whitelistSubmit = document.getElementById("whitelistSubmit");
	whitelistSubmit.textContent = "Modify";
	replaceEntry = true;
	entrySpecToReplace = entrySpec;
	rowToReplace = row;
    }

    /*
     * ctx is the entrySpec and the related row
     */
    function removeButtonHandler (ctx) {
	const {row, entrySpec} = ctx;
	const table = document.getElementById("whitelist_entries");

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
    }

    /*
     * Attach to the row representing an entry the handler of the modify/remove buttons
     */
    function attachHandlerToRow (ctx) {
	ctx.row.childNodes[3].addEventListener("click", () => modifyButtonHandler(ctx));
	ctx.row.childNodes[4].addEventListener("click", () => removeButtonHandler(ctx));
    }

    return Object.freeze({
	submitHandler (ev) {
	    "use strict";
	    const form = ev.target;
	    const entrySpec = buildEntrySpec(form);

	    if (replaceEntry) {
		sendMessage({msg: MSG.REPLACE_IN_WHITELIST, options: {oldEntrySpec: entrySpecToReplace, newEntrySpec: entrySpec}})
		    .then(function (result) {
			if (result) {
			    alert("Entry modified successfully");
			    const newRow = OPTIONS.whitelist_entries.makeEntry(entrySpec).getHTMLRow();
			    attachHandlerToRow({row: newRow, entrySpec});
			    document.getElementById("whitelist_entries").replaceChild(newRow, rowToReplace);
			    formReset();
			} else {
			    alert("Unable to modify entry!");
			}
		    })
		    .catch((error) => OPTIONS.fatal(error));
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
		    .catch((error) => OPTIONS.fatal(error));
	    }

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

	    attachHandlerToRow({row, entrySpec});

	    row.className = "entry";
	    table.appendChild(row);
	}
    });
}());
