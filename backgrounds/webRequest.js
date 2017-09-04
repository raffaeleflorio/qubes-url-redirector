function routeRequest(details)
{
    return getWhitelistAndSettings()
	.then(
	    items => {
		const whitelist = items.whitelist;
		const settings = items.settings;
		
		if (settings.default_action != "here" && whitelist.indexOf(details.url) == -1) {
		    const vmname = settings.default_action == "dvm" ? "$dispvm" : settings.vmname;
		    openurl(vmname, details.url);
		    browser.tabs.remove(details.tabId);
		    return {cancel: true}
		}
		else
		    return {cancel: false} /* open here */
	    },
	    () => {
		browser.tabs.remove(details.tabId);
		return {cancel: true}
	    });
}

browser.webRequest.onBeforeRequest.addListener(
    routeRequest,
    {
	urls: ["<all_urls>"],
	types: ["main_frame"]
    },
    ["blocking"]
);
