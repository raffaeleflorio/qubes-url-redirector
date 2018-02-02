/*
 * Copyright (C) 2017 Raffaele Florio <raffaeleflorio@protonmail.com>
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

const qur = browser.extension.getBackgroundPage().getQur();
const whitelistTbl = document.getElementById("whitelistTbl");
const whitelistFrm = document.getElementById("whitelistFrm");
const whitelistClean = document.getElementById("whitelistClean");

function appendRegex(regex)
{
    whitelistTbl.style.display = "table";
    whitelistClean.style.display = "block";

    const tbody = whitelistTbl.querySelector("tbody");
    const tr = document.createElement("tr");

    let td = document.createElement("td");
    td.textContent = regex;
    tr.appendChild(td);

    let btn = document.createElement("button");
    btn.className = "modifyRegex";
    btn.textContent = "Modify";
    btn.addEventListener("click", modifyRegex);

    td = document.createElement("td");
    td.appendChild(btn);
    tr.appendChild(td);

    btn = document.createElement("button");
    btn.className = "rmRegex";
    btn.textContent = "Remove";
    btn.addEventListener("click", rmFromWhitelist);

    td = document.createElement("td");
    td.appendChild(btn);
    tr.appendChild(td);
    
    tbody.appendChild(tr);
}

function addToWhitelist(e)
{
    const form = e.target;
    let regex = form["regex"].value;

    form["regex"].value = "";

    const isDomain = form["type"].value === "domain";
    const whitelistSub = form["subdomain"].checked;
    const isExact = form["type"].value === "exact";
    
    if (isDomain && !(/^([\w-]+\.\w+)+$/.test(regex))) {
	alert("Invalid domain name!");
    } else {
	regex = isDomain || isExact ? regex.replace(/[|\\{}\[\]^$+*?.]/g, "\\$&") : regex;

	if (isDomain)
	    regex = "^(?:https?://)?(?:www\\.)?" + (whitelistSub ? "(?:[\\w-]+\\.)*" : "" ) + regex;
	else if (isExact)
	    regex = "^" + regex + "$";
	
	qur.whitelist.add(regex)
	    .then(
		() => {
		    alert("Saved successfully!");
		    appendRegex(regex);
		})
	    .catch(
		() => alert("Failed to save!")
	    );
    }
    
    e.preventDefault();
}

function modifyRegex(e)
{
    /* btn -> td -> tr -> first td */
    const td = e.target.parentNode.parentNode.querySelector("td");
    const oldRegex = td.textContent;
    const newRegex = prompt("Insert new RegExp:", oldRegex);

    if (newRegex && newRegex !== oldRegex)
	qur.whitelist.modify(oldRegex, newRegex)
	    .then(
		() => {
		    alert("Modifed successfully!");
		    td.textContent = newRegex;
		}
	    )
	    .catch(
		() => alert("Unable to modify!")
	    );
}

function restoreSettings()
{
    const form = document.getElementById("settingsFrm");

    const default_action = qur.settings.getDefaultAction();
    const default_vm = qur.settings.getDefaultVm();

    document.getElementById("action" + default_action).checked = true;
    if (default_vm)
	form["vmname"].value = default_vm;
}

function restoreWhitelist()
{
    qur.whitelist.forEach((regex) => {
	appendRegex(regex);
    });
}

function rmFromWhitelist(e)
{
    /* btn -> td -> tr */
    const tr = e.target.parentNode.parentNode;
    const regex = tr.querySelector("td").textContent;
    
    qur.whitelist.rm(regex)
	.then(
	    () => {
		alert("RegExp removed successfully!");

		if (whitelistTbl.rows.length === 2)
		    whitelistTbl.style.display = "none";
		tr.parentNode.removeChild(tr);
	    })
	.catch (
	    () => alert("Failed to remove!")
	);
}

function saveSettings(e)
{
    const form = e.target;

    const settings = {
	default_action: parseInt(form["default_action"].value),
	default_vm: form["vmname"].value
    };

    qur.settings.set(settings)
	.then(
	    () => alert("Saved succesfully!")
	)
	.catch(
	    () => {
		alert("Failed to save!");
		restoreSettings();
	    }
	);

    e.preventDefault();
}

restoreSettings();
restoreWhitelist();

document.getElementById("settingsFrm").addEventListener("submit", saveSettings);

whitelistFrm.addEventListener("submit", addToWhitelist);

whitelistClean.querySelector("button").addEventListener("click", () => {
    qur.whitelist.clean()
	.then(() => {
	    alert("Whitelist cleaned succesfully!");
	    whitelistTbl.style.display = "none";
	    whitelistClean.style.display = "none";
	    whitelistTbl.replaceChild(document.createElement("tbody"), whitelistTbl.querySelector("tbody"));
	})
	.catch(() => {
	    alert("Unable to clean the whitelist!");
	});
});

whitelistFrm["type"].forEach(radio => radio.addEventListener("change", e => {
    
    if (e.target.value === "regex") {
	document.getElementById("subdomain").style.display = "none";
	document.getElementById("wl_label_type").textContent = " Javascript RegExp: ";
	document.getElementById("wl_info_regex").textContent = " To escape regexp chars use a backslash. Slash's escape is optional. ";
    } else if (e.target.value === "domain") {
	document.getElementById("subdomain").style.display = "initial";
	document.getElementById("wl_label_type").textContent = " Domain name: www.";
	document.getElementById("wl_info_regex").textContent = " Escaping of regexp chars is done automatically. ";
    } else if (e.target.value === "exact") {
	document.getElementById("subdomain").style.display = "none";
	document.getElementById("wl_label_type").textContent = " String: ";
	document.getElementById("wl_info_regex").textContent = " Escaping of regexp chars is done automatically.. ";
    }
}));
