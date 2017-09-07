const background = browser.extension.getBackgroundPage();

function appendRegex(regex)
{
    const tbody = document.getElementById("whitelistTbl").querySelector("tbody");
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

    background.addToWhitelist(regex)
	.then(
	    () => {
		alert("Saved successfully!");
		appendRegex(regex);
	    },
	    () => alert("Failed to save!")
	);

    e.preventDefault();
}

function modifyRegex(e)
{
    const td = e.target.parentNode.parentNode.querySelector("td");
    const oldRegex = td.textContent;
    const newRegex = prompt("Insert new RegExp:");

    if (newRegex)
	background.modifyWhitelist(oldRegex, newRegex)
	    .then(
		() => {
		    alert("Modifed successfully!");
		    td.textContent = newRegex;
		},
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
    const tr = e.target.parentNode.parentNode;
    const regex = tr.querySelector("td").textContent;
    
    background.rmFromWhitelist(regex)
	.then(
	    () => {
		tr.parentNode.removeChild(tr);
		alert("RegExp removed successfully!");
	    },
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
	    () => alert("Saved succesfully!"),
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
document.getElementById("whitelistFrm").addEventListener("submit", addToWhitelist);
