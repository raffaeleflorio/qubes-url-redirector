function addToWhitelist(url)
{
    return getWhitelist()
	.then(whitelist => {
	    if (whitelist.indexOf(url) == -1 && url.match(/^\w*:\/\//)) {
		whitelist.push(url);
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
	    if (!items.whitelist)
		items.whitelist = [];

	    if (!items.settings)
		items.settings = {};

	    return items;
	});
}

function rmFromWhitelist(url)
{
    return getWhitelist()
	.then(whitelist => {
	    const index = whitelist.indexOf(url);
	    if (index != -1) {
		whitelist.splice(index, 1);
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
    else if (actions == "default-vm" && (!settings.vmname || settings.vmname == ""))
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
