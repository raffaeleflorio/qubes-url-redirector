const routeRequest = details => {
    
    return Promise.all([getSettings(), getWhitelist()])
	.then(
	    items => {
		const whitelist = items[1];
		const settings = items[0];

		if (!tmpWhitelist.use(details.url) && settings.default_action != "here" && !whitelist.test(details.url)) {
		    const vmname = (!settings.default_action || settings.default_action == "dvm") ? "$dispvm" : settings.vmname;
		    openurl(vmname, details.url);
		    browser.tabs.remove(details.tabId);
		    return {cancel: true}
		}
		else
		    return {cancel: false} /* open here */
	    })
	.catch(
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
