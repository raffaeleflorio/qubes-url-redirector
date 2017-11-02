const redirector = () => {
    let processedRequest = [];
    /* used to fix #2 */
    let blockedTabs = {};

    return ({
	route: (details) => {
	    /* chrome fix */
	    if (!/^https?:\/\//.test(details.url))
		return {cancel: false};

	    let tab = blockedTabs[details.tabId];
	    if (tab) {
		url = tab.redirectUrl;
		if (url !== null && url !== details.url) {
		    browser.tabs.update(details.tabId, {url}); /* if something goes wrong the next request is blocked */
		    delete blockedTabs[details.tabId];
		    return {redirectUrl: url};
		} else if (url !== null && url === details.url) { /* if the URL is typed */
		    browser.tabs.remove(details.tabId);
		    delete blockedTabs[details.tabId];
		    return {cancel: true};
		} else { /* if a redirectUrl is not yet setted */
		    return {cancel: true};
		}
	    }

	    if (processedRequest.indexOf(details.requestId) !== -1)
		return {cancel: false};
	    
	    const default_action = qur.settings.getDefaultAction();
	    const whitelistPass = qur.whitelist.test(details.url);
	    const openHere = default_action === qur.settings.ACTION.HERE || whitelistPass;

	    if (!openHere) {
		const vmname = default_action === qur.settings.ACTION.DVM ? "$dispvm" : qur.settings.getDefaultVm();

		if (browser.isPolyfilled === true)
		    blockedTabs[details.tabId] = {"redirectUrl": null};

		browser.tabs.get(details.tabId)
		    .then((requestTab) => {
			if (browser.isPolyfilled === true) /* Chrome case */
			    blockedTabs[requestTab.id].redirectUrl = requestTab.url;
			else if (requestTab.url === "about:blank" || requestTab.url === "about:newtab") /* Firefox case */
			    browser.tabs.remove(details.tabId);
		    });
		
		qur.native.openurl(vmname, details.url);
		return {cancel: true};
	    } else {
		if (processedRequest.indexOf(details.requestId) === -1)
		    processedRequest.push(details.requestId);
		return {cancel: false};
	    }
	}
    });
};
