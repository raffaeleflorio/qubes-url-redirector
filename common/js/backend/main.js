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

const QUR = (function () {
    "use strict";

    const dep = [
	"settings",
	"whitelist"
    ];

    let readyResolve = null;
    const ready = new Promise(function (resolve) {
	readyResolve = resolve;
    });

    const _QUR = {
	ready
    };

    return new Proxy(_QUR, {
	set (target, prop, value) {
	    target[prop] = value;

	    const i = dep.indexOf(prop);
	    if (i >= 0) {
		dep.splice(i, 1);
	    }
	    if (dep.length === 0) {
		readyResolve(true);
	    }

	    return true;
	}
    });
}());
