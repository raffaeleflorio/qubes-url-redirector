const settings = async () => {
    const ACTION = {
	DVM: 0,
	VM: 1,
	HERE: 2
    }

    /* onChanged listeners */
    let listeners = []

    let buffer = { }
    await browser.storage.local.get("settings")
	.then((item) => {
	    buffer = item.settings === undefined ? {"default_action": ACTION.DVM} : item.settings
	}).catch((err) => console.error(`settings initialization error: ${err}`))

    /* **try** to save */
    const save = (settings) => {
	return browser.storage.local.set({settings})
    }

    return ({
	ACTION,

	set: (settings) => {
	    const default_action = settings.default_action
	    const default_vm = settings.default_vm

	    if (default_action === ACTION.DVM || default_action === ACTION.HERE || (default_action === ACTION.VM && default_vm)) {
		return save({default_action, default_vm}).then(() => {
		    buffer.default_action = default_action
		    buffer.default_vm = default_vm
		    listeners.forEach((l) => l())
		})
	    } else {
		return Promise.reject(false)
	    }
	},

	getDefaultAction: () => {
	    return buffer.default_action
	},

	getDefaultVm: () => {
	    return buffer.default_vm
	},

	/* TODO: improve */
	onChanged: {
	    addListener: (func) => {
		listeners.push(func)
	    }
	}
    })
}
