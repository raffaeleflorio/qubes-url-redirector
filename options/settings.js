const background = browser.extension.getBackgroundPage();

function appendUrl(url)
{
    const tbody = document.getElementById("whitelistTbl").querySelector("tbody");
    const tr = document.createElement("tr");
    let td = document.createElement("td");
    td.textContent = url;
    tr.appendChild(td);
    const btn = document.createElement("button");
    btn.className = "rmUrlBtn";
    btn.textContent = "Remove";
    td = document.createElement("td");
    btn.addEventListener("click", rmFromWhitelist);
    td.appendChild(btn);
    tr.appendChild(td);
    tbody.appendChild(tr);
}

function addToWhitelist(e)
{
    const form = e.target;
    const url = form["url"].value;
    
    form["url"].value = "";

    background.addToWhitelist(url)
	.then(
	    () => {
		alert("Saved successfully!");
		appendUrl(url);
	    },
	    () => alert("Failed to save!")
	);

    e.preventDefault();
}

function restoreSettings()
{
    const form = document.getElementById("settingsFrm");

    background.getSettings()
	.then(settings => {
	    form[settings.default_action].checked = true;
	    form["vmname"].value = settings.vmname;
	});
}

function restoreWhitelist()
{
    background.getWhitelist()
	.then(whitelist => {
	    for (let i = 0; i < whitelist.length; i++)
		appendUrl(whitelist[i]);
	});
}

function rmFromWhitelist(e)
{
    const tr = e.target.parentNode.parentNode;
    const url = tr.querySelector("td").textContent;
    
    background.rmFromWhitelist(url)
	.then(
	    () => {
		tr.parentNode.removeChild(tr);
		alert("URL removed successfully!");
	    },
	    () => alert("Failed to remove!")
	);
}

function saveSettings(e)
{
    const form = e.target;

    const settings = {
	default_action: form["default"].value,
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
