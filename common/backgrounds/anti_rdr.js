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
