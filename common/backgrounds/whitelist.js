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

const whitelist = async () => {
    let tmpBuffer = []; // temporary whitelisted URL, they aren't saved

    let buffer = []; // contains whitelisted RegExp, they are saved
    await browser.storage.local.get("whitelist")
	.then((item) => {
	    buffer = item.whitelist === undefined ? [] : item.whitelist;
	})
	.catch((err) => console.error(`whitelist initialization error: ${err}`));

    /* **try** to save */
    const save = (whitelist) => {
	return browser.storage.local.set({whitelist});
    };

    const getIndex = (regex, array = buffer) => {
	return array.indexOf(regex);
    };
    const contain = (regex, array = buffer) => {
	return getIndex(regex, array) !== -1 ? true : false;
    };
    
    return ({
	forEach: (func) => buffer.forEach(func),

	add: (regex, isTmp = false) => {
	    if (regex && isTmp === true && !contain(regex, tmpBuffer)) {
		tmpBuffer.push(regex);
		return Promise.resolve();
	    } else if (regex && isTmp === false && !contain(regex)) {
		const cloned = buffer.slice(0);
		cloned.push(regex);

		return save(cloned).then(() => {
		    buffer = cloned;
		});
	    } else {
		return Promise.reject(false);
	    }
	},

	rm: (regex) => {
	    const index = getIndex(regex);
	    if (index !== -1) {
		const cloned = buffer.slice(0);
		cloned.splice(index, 1);

		return save(cloned).then(() => {
		    buffer = cloned;
		});
	    } else {
		return Promise.reject(false);
	    }
	},

	modify: (oldRegex, newRegex) => {
	    const oldIndex = getIndex(oldRegex);
	    if (newRegex && oldIndex !== -1 && !contain(newRegex)) {
		const cloned = buffer.slice(0);
		cloned[oldIndex] = newRegex;

		return save(cloned).then(() => {
		    buffer = cloned;
		});
	    } else {
		return Promise.reject(false);
	    }
	},

	test: (regex, checkTmp = true) => {
	    if (checkTmp === true) {
		const tmpIndex = getIndex(regex, tmpBuffer);
		if (tmpIndex !== -1) {
		    tmpBuffer.splice(tmpIndex, 1);
		    return true;
		}
	    }

	    return buffer.some((e) => {
		return (new RegExp(e)).test(regex);
	    });
	},

	clean: () => {
	    return browser.storage.local.remove("whitelist").then(() => {
		buffer = [];
	    });
	}
    });
};
