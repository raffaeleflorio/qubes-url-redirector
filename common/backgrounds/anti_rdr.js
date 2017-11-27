const anti_rdr = () => {
    const buildAnti = (regex, parameter) => {
	return {"r": regex, "p": parameter};
    };

    const antis = [
	buildAnti(/^(?:https?:\/\/)?(?:www\.)?google\.\w+\/url\?/, "url"),
	buildAnti(/^(?:https?:\/\/)?(?:www\.)?l\.facebook\.com\/l\.php\?/, "u")
    ];

    const indexOfAnti = (url) => antis.findIndex((anti) => anti.r.test(url));

    const findAnti = (url) => {
	const i = indexOfAnti(url);
	if (i !== -1)
	    return antis[i];
	else
	    return null;
    };

    return ({
	test: (url) => {
	    return indexOfAnti(url) !== -1 ? true : false;
	},

	escape: (url) => {
	    const anti = findAnti(url);

	    if (anti)
		return new URL(url).searchParams.get(anti.p);
	    else
		return url;
	}
    });
};
