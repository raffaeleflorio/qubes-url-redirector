const redirector = () => {
    let processedRequest = [];

    return ({
	route: (details) => {
	    /* chrome fix */
	    if (!/^https?:\/\//.test(details.url))
		return {cancel: false};

	    if (anti_rwt.test(details.url)) {
		console.log("RWWTT");
		return {redirectUrl: anti_rwt.escape(details.url)};
	    }

	    console.log("open: " + details.url);

	    if (processedRequest.indexOf(details.requestId) !== -1)
		return {cancel: false};
	    
	    const default_action = qur.settings.getDefaultAction();
	    const whitelistPass = qur.whitelist.test(details.url);
	    const openHere = default_action === qur.settings.ACTION.HERE || whitelistPass;

	    if (!openHere) {
		const vmname = default_action === qur.settings.ACTION.DVM ? "$dispvm" : qur.settings.getDefaultVm();

		/* TODO: fix for Chrome */
		/* Currently immediate closing in Chrome */
		if (browser.isPolyfilled)
		    browser.tabs.remove(details.tabId);
		else
		    browser.tabs.get(details.tabId)
		    .then((requestTab) => {
			if (requestTab.url === "about:blank" || requestTab.url === "about:newtab" || requestTab.url === details.url)
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
