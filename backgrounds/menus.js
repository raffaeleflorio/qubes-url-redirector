function createMenus()
{
    browser.contextMenus.create({
	id: "dvm",
	title: "Open in dvm",
	contexts: ["link"]
    });
    
    getVmName().then(item => {
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
	    /* in native.js */
	    openurl("$dispvm", info.linkUrl);
	    break;
	case "default-vm":
	    /* in native.js */
	    getVmName().then(item => {
		openurl(item.vmname, info.linkUrl);
	    });
	    break;
	case "some-vm":
	    browser.windows.create({
		type: "popup",
		url: "choose-vm/popup.html?url=" + info.linkUrl,
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

function getVmName()
{
    return browser.storage.local.get("settings")
	.then(item => {
	    if (item.settings)
		item = item.settings;
	    else
		item = {}
	    
	    item.menu_enabled = !item.vmname || item.vmname == "" ? false : true;
	    item.vmname = !item.vmname || item.vmname == "" ? "default" : item.vmname;
	    return item;
	});
}

function updateMenus()
{
    getVmName().then(item => {
	browser.contextMenus.update("default-vm", {
	    title: "Open in " + item.vmname + " VM",
	    enabled: item.menu_enabled
	});
    });
}

createMenus();
browser.storage.onChanged.addListener(updateMenus);
