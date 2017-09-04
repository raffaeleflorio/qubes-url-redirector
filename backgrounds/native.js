function openurl(vm, url)
{
    browser.runtime.sendNativeMessage("qvm_open_in_vm", {"vmname": vm, "url": url});
}
