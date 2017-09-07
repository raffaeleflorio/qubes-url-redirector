function addToWhitelist(regex)
{
    return getWhitelist()
	.then(whitelist => {
	    if (whitelist.regex.indexOf(regex) == -1) {
		whitelist.regex.push(regex);
		return saveWhitelist(whitelist);
	    } else {
		throw false;
	    }
	});    
}

function getSettings()
{
    return getWhitelistAndSettings().then(items => { return items.settings });
}

function getWhitelist()
{
    return getWhitelistAndSettings().then(items => { return items.whitelist });
}

function getWhitelistAndSettings()
{
    return browser.storage.local.get(["settings", "whitelist"])
	.then(items => {
	    if (!items.whitelist) {
		items.whitelist = { };
		items.whitelist.regex = [];
	    }
		
	    if (!items.settings)
		items.settings = {};

	    items.whitelist.test = function(regex) {
		let found = false;
		for (let i = 0; i < this.regex.length && !found; i++)
		    found = (new RegExp(this.regex[i])).test(regex);
		return found;
	    };

	    return items;
	});
}

function rmFromWhitelist(regex)
{
    return getWhitelist()
	.then(whitelist => {
	    const index = whitelist.regex.indexOf(regex);
	    if (index != -1) {
		whitelist.regex.splice(index, 1);
		saveWhitelist(whitelist);
		return true;
	    } else {
		throw false;
	    }
	});
}

function saveSettings(settings)
{
    const actions = ["dvm", "default-vm", "here"];

    if (actions.indexOf(settings.default_action) == -1)
	return Promise.reject(false);
    else if (settings.default_action == "default-vm" && (!settings.vmname || settings.vmname == ""))
	return Promise.reject(false);	
    else
	return browser.storage.local.set({"settings": settings});
}

/* not accessible by getBackgroundPage() */
const saveWhitelist = whitelist => {
    return browser.storage.local.set({"whitelist": whitelist});
}

browser.browserAction.onClicked.addListener(() => {
    browser.runtime.openOptionsPage();
});
