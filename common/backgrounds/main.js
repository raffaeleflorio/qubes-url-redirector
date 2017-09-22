function addToWhitelist(regex)
{
    return getWhitelist()
	.then(whitelist => {
	    if (regex && whitelist.regex.indexOf(regex) === -1) {
		whitelist.regex.push(regex);
		return saveWhitelist(whitelist);
	    } else {
		throw false;
	    }
	});    
}

function getSettings()
{
    return browser.storage.local.get("settings")
	.then(item => {
	    item = item.settings ? item.settings : { };
	    return item;
	});
}

function getWhitelist()
{
    return browser.storage.local.get("whitelist")
	.then(item => {
	    item = item.whitelist ? item.whitelist : {regex: []};

	    item.test = function(regex) {
		let found = false;
		for (let i = 0; i < this.regex.length && !found; i++)
		    found = (new RegExp(this.regex[i])).test(regex);
		return found;
	    };
	    
	    return item;
	});
}

function modifyWhitelist(oldRegex, newRegex)
{
    return getWhitelist()
	.then(whitelist => {
	    const index = whitelist.regex.indexOf(oldRegex);
	    if (newRegex && index !== -1 && whitelist.regex.indexOf(newRegex) === -1) {
		whitelist.regex[index] = newRegex;
		return saveWhitelist(whitelist);
	    } else {
		throw false;
	    }
	});
}

function rmFromWhitelist(regex)
{
    return getWhitelist()
	.then(whitelist => {
	    const index = whitelist.regex.indexOf(regex);
	    if (index !== -1) {
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

    if (actions.indexOf(settings.default_action) === -1)
	return Promise.reject(false);
    else if (settings.default_action === "default-vm" && !settings.vmname)
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
