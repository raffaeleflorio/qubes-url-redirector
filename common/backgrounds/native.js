const native = {
    openurl: (vmname, url) => {
	browser.runtime.sendNativeMessage("qvm_open_in_vm", {vmname, url});
    }
};
