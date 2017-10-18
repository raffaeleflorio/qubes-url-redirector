const qur = browser.extension.getBackgroundPage().getQur()
const whitelistTbl = document.getElementById("whitelistTbl");
const whitelistFrm = document.getElementById("whitelistFrm");

function appendRegex(regex)
{
    whitelistTbl.style.display = "table";
    
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

    const default_action = qur.settings.getDefaultAction()
    const default_vm = qur.settings.getDefaultVm()

    document.getElementById("action" + default_action).checked = true;
    if (default_vm)
	form["vmname"].value = default_vm;
}

function restoreWhitelist()
{
    qur.whitelist.forEach((regex) => {
	appendRegex(regex);
    })
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
