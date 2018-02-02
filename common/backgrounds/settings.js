/*
 * Copyright (C) 2017 Raffaele Florio <raffaeleflorio@protonmail.com>
 *
 * This file is part of qubes-url-redirector.
 *
 * qubes-url-redirector is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * qubes-url-redirector is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with qubes-url-redirector.  If not, see <http://www.gnu.org/licenses/>.
*/

const settings = async () => {
    const ACTION = {
	DVM: 0,
	VM: 1,
	HERE: 2
    };

    /* onChanged listeners */
    let listeners = [];

    let buffer = { };
    await browser.storage.local.get("settings")
	.then((item) => {
	    buffer = item.settings === undefined ? {"default_action": ACTION.DVM} : item.settings;
	})
	.catch((err) => console.error(`settings initialization error: ${err}`));

    /* **try** to save */
    const save = (settings) => {
	return browser.storage.local.set({settings});
    };

    return ({
	ACTION,

	set: (settings) => {
	    const default_action = settings.default_action;
	    const default_vm = settings.default_vm;

	    if (default_action === ACTION.DVM || default_action === ACTION.HERE || (default_action === ACTION.VM && default_vm)) {
		return save({default_action, default_vm}).then(() => {
		    buffer.default_action = default_action;
		    buffer.default_vm = default_vm;
		    listeners.forEach((l) => l());
		});
	    } else {
		return Promise.reject(false);
	    }
	},

	getDefaultAction: () => {
	    return buffer.default_action;
	},

	getDefaultVm: () => {
	    return buffer.default_vm;
	},

	/* TODO: improve */
	onChanged: {
	    addListener: (func) => {
		listeners.push(func);
	    }
	}
    });
};
