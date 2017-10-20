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

	test: (regex) => {
	    const tmpIndex = getIndex(regex, tmpBuffer);
	    if (tmpIndex !== -1) {
		tmpBuffer.splice(tmpIndex, 1);
		return true;
	    }

	    return buffer.some((e) => {
		return (new RegExp(e)).test(regex);
	    });
	},

	clear: () => {
	    return browser.storage.local.remove("whitelist").then(() => {
		buffer = [];
	    });
	}
    });
};
