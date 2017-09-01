function openurl(vm, url)
{
    browser.runtime.sendNativeMessage("qvm_open_in_vm", {"vmname": vm, "url": url});
}

browser.runtime.onMessage.addListener((req, sender, sendResponse) => {
    openurl(req.vmname, req.url);
});
