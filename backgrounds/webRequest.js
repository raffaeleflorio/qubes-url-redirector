const routeRequest = details => {
    return getWhitelistAndSettings()
	.then(
	    items => {
		const whitelist = items.whitelist;
		const settings = items.settings;

		if (!tmpWhitelist.use(details.url) && settings.default_action != "here" && !whitelist.test(details.url)) {
		    const vmname = (!settings.default_action || settings.default_action == "dvm") ? "$dispvm" : settings.vmname;
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
