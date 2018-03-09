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

function renderSettings (settings) {
    "use strict";

    const form = document.getElementById("settings");
    form.default_action.value = settings.default_action;
    form.default_vm.value = settings.default_vm;
}

(function () {
    "use strict";

    function changeTypeDetails (ev) {
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
    }

    const entryType = Array.from(document.getElementById("whitelist").type);
    entryType.forEach((e) => e.addEventListener("change", changeTypeDetails));
}());
