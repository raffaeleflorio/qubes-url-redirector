const menus = () => {
    const getDefaultVmState = () => {
	const default_vm = qur.settings.getDefaultVm();
	const title = default_vm ? default_vm : "default";
	const menu_enabled = default_vm ? true : false;
	return {title, menu_enabled};
    };

    return ({
	create: () => {
	    browser.contextMenus.create({
		id: "dvm",
		title: "Open in dvm",
		contexts: ["link"]
	    });
	    
	    const state = getDefaultVmState();
	    browser.contextMenus.create({
		id: "default-vm",
		title: "Open in " + state.title + " VM",
		contexts: ["link"],
		enabled: state.menu_enabled
	    });

	    browser.contextMenus.create({
		id: "some-vm",
		title: "Open in VM...",
		contexts: ["link"]
	    });

	    browser.contextMenus.create({
		id: "here",
		title: "Open here",
		contexts: ["link"]
	    });

	    browser.contextMenus.onClicked.addListener((info, tab) => {
		const url = qur.anti_rdr.escape(info.linkUrl);

		switch (info.menuItemId) {
		case "dvm":
		    qur.native.openurl("$dispvm", url);
		    break;
		case "default-vm":
		    qur.native.openurl(qur.settings.getDefaultVm(), url);
		    break;
		case "some-vm":
		    browser.windows.create({
			type: "popup",
			url: "popups/choose-vm.html?url=" + encodeURIComponent(url),
			width: 600,
			height: 160
		    });
		    break;
		case "here":

		    qur.whitelist.add(url, true);
		    browser.tabs.create({url});
		    break;
		}
	    });
	},

	callback: {
	    update: () => {
		const state = getDefaultVmState();
		browser.contextMenus.update("default-vm", {
		    title: "Open in " + state.title + " VM",
		    enabled: state.menu_enabled
		});
	    }
	}
    });
};


/* initialize contextMenus, pageAction, browserAction and related */
const ui = {
    init: () => {
	/* create menu entries */
	const menusObj = menus();
	menusObj.create();

	/* add various listeners */
	qur.settings.onChanged.addListener(menusObj.callback.update);
	browser.browserAction.onClicked.addListener(() => {
	    browser.runtime.openOptionsPage();
	});
    }
};
