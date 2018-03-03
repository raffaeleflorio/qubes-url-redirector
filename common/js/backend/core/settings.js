/*
 * Copyright (C) 2017,2018 Raffaele Florio <raffaeleflorio@protonmail.com>
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

QUR.settings = (function () {
    "use strict";

    const ACTION = Object.freeze({
	DVM: 0,
	DEFAULT_VM: 1,
	OPEN_HERE: 2
    });
    
    const _settings = {
	default_action: ACTION.DVM,
	default_vm: null
    };

    const isValidVmName = (v) => (typeof v === "string" && v !== "") || (v === null);
    const isValidAction = (v) => Object.keys(ACTION).some((x) => ACTION[x] === v);
    	    
    /* PUBLIC */
    return Object.freeze({
	ACTION,

	getDefaultAction: () => _settings.default_action,
	getDefaultVm: () => _settings.default_vm,
	toString: () => JSON.stringify(_settings),
	toJSON: () => Object.assign({}, _settings),
	set (settings) {
	    const {default_vm = _settings.default_vm, default_action = _settings.default_action} = settings;

	    if (!isValidAction(default_action) || !isValidVmName(default_vm)) {
    		return false;
    	    }

    	    const requireVmName = default_action === ACTION.DEFAULT_VM;
	    /* default_vm could be null */
    	    if (requireVmName && !default_vm) {
    		return false;
    	    }

    	    _settings.default_vm = default_vm;
    	    _settings.default_action = default_action;
    	    return true;
	}
    });
}());
