let processedRequest = [];

const routeRequest = details => {

    if (!/^https?:\/\//.test(details.url))
	return {cancel: false};

    if (processedRequest.indexOf(details.requestId) !== -1)
	return {cancel: true};
    
    return Promise.all([getSettings(), getWhitelist()])
	.then(
	    items => {
		const whitelist = items[1];
		const settings = items[0];

		const openHere = tmpWhitelist.use(details.url) || settings.default_action === "here" || whitelist.test(details.url);

		if (!openHere) {
		    const vmname = (!settings.default_action || settings.default_action === "dvm") ? "$dispvm" : settings.vmname;
		    openurl(vmname, details.url);
		    browser.tabs.remove(details.tabId);
		    processedRequest.push(details.requestId);
		    return {cancel: true}
		} else {
		    return {cancel: false}
		}
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
