const background = browser.extension.getBackgroundPage();
const whitelistTbl = document.getElementById("whitelistTbl");
const whitelistFrm = document.getElementById("whitelistFrm");
let regex_prefix = "";


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
    const regex = form["regex"].value;
    
    form["regex"].value = "";

    if (form["type"].value == "domain" && !(/^(\w+\.\w+)+$/.test(regex)))
	alert("Invalid domain!");
    else
	background.addToWhitelist(regex_prefix+regex)
	    .then(
		() => {
		    alert("Saved successfully!");
		    appendRegex(regex_prefix+regex);
		})
	    .catch(
		() => alert("Failed to save!")
	    );

    e.preventDefault();
}

function modifyRegex(e)
{
    /* btn -> td -> tr -> first td */
    const td = e.target.parentNode.parentNode.querySelector("td");
    const oldRegex = td.textContent;
    const newRegex = prompt("Insert new RegExp:", oldRegex);

    if (newRegex && newRegex != oldRegex)
	background.modifyWhitelist(oldRegex, newRegex)
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

    background.getSettings()
	.then(settings => {
	    if (settings.default_action)
		document.getElementById(settings.default_action).checked = true;
	    else
		document.getElementById("dvm").checked = true;

	    if (settings.vmname)
		form["vmname"].value = settings.vmname;
	});
}

function restoreWhitelist()
{
    background.getWhitelist()
	.then(whitelist => {
	    whitelist.regex.forEach(regex => appendRegex(regex));
	});
}

function rmFromWhitelist(e)
{
    /* btn -> td -> tr */
    const tr = e.target.parentNode.parentNode;
    const regex = tr.querySelector("td").textContent;
    
    background.rmFromWhitelist(regex)
	.then(
	    () => {
		alert("RegExp removed successfully!");

		if (whitelistTbl.rows.length == 2)
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
	default_action: form["default_action"].value,
	vmname: form["vmname"].value
    };

    background.saveSettings(settings)
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
    
    if (e.target.value == "regex") {
	document.getElementById("wl_label_type").textContent = " Javascript RegExp: ";
	regex_prefix = "";
    }
    else {
	document.getElementById("wl_label_type").textContent = " Domain: www.";
	regex_prefix = "^(?:https?://)?(?:www\\.)?";
    }
}));
