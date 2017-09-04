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
    return browser.storage.local.get("settings")
	.then(item => {
	    if (item.settings)
		return item.settings;
	    else
		return {};
	});
}

function getWhitelist()
{
    return browser.storage.local.get("whitelist")
	.then(item => {
	    if (item.whitelist)
		return item.whitelist;
	    else
		return [];
	});
}

function getDefaultVmName()
{
    return getSettings()
	.then(settings => {
	    settings.menu_enabled = settings.vmname != "" ? true : false;
	    settings.vmname = settings.vmname != "" ? settings.vmname : "default";
	    return settings;
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
    return browser.storage.local.set({"settings": settings});
}

function saveWhitelist(whitelist)
{
    return browser.storage.local.set({"whitelist": whitelist});
}

browser.browserAction.onClicked.addListener(() => {
    browser.runtime.openOptionsPage();
});
