function save(e)
{
    let form = e.target;

    let settings = {
	default_action: form["default"].value,
	vmname: form["vmname"].value /* check esitenza ? */
    };

    browser.storage.local.set({"settings": settings})
	.then(
	    () => alert("Saved succesfully!"),
	    () => {
		alert("Failed to save!");
		restore();
	    }
	);

    e.preventDefault();
}

function restore()
{
    let form = document.getElementById("settings");

    browser.storage.local.get("settings")
	.then(item => {
	    if (!item.settings)
		return;
	    item = item.settings;
	    form[item.default_action].checked = true;
	    form["vmname"].value = item.vmname;
	});
}

restore();
document.getElementById("settings").addEventListener("submit", save);
