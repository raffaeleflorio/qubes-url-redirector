const createMenus = () => {
    browser.contextMenus.create({
	id: "dvm",
	title: "Open in dvm",
	contexts: ["link"]
    });
    
    getDefaultVmName().then(item => {
	browser.contextMenus.create({
	    id: "default-vm",
	    title: "Open in " + item.vmname + " VM",
	    contexts: ["link"],
	    enabled: item.menu_enabled
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
    });

    browser.contextMenus.onClicked.addListener((info, tab) => {
	switch (info.menuItemId) {
	case "dvm":
	    openurl("$dispvm", info.linkUrl);
	    break;
	case "default-vm":
	    getDefaultVmName().then(item => {
		openurl(item.vmname, info.linkUrl);
	    });
	    break;
	case "some-vm":
	    browser.windows.create({
		type: "popup",
		url: "choose-vm/popup.html?url=" + encodeURIComponent(info.linkUrl),
		width: 600,
		height: 160
	    });
	    break;
	case "here":
	    browser.tabs.create({url: info.linkUrl});
	    break;
	}
    });
}

const getDefaultVmName = () => {
    return getSettings()
	.then(settings => {
	    settings.menu_enabled = settings.vmname && settings.vmname != "" ? true : false;
	    settings.vmname = settings.vmname && settings.vmname != "" ? settings.vmname : "default";
	    return settings;
	});
}

const updateMenus =  () => {
    getDefaultVmName().then(item => {
	browser.contextMenus.update("default-vm", {
	    title: "Open in " + item.vmname + " VM",
	    enabled: item.menu_enabled
	});
    });
}

createMenus();
browser.storage.onChanged.addListener(updateMenus);
