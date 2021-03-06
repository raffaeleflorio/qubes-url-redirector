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

QUR.net_utils = Object.freeze({
    isValidDomainName (v) {
        "use strict";

        if (typeof v !== "string" || v.length > 253) {
            return false;
        }

        const labels = v.split(".");
        /*
         * every label must be, at most, 63 characters long
         * The root label is the only one with a length of 0
         */
        if (labels.some((l) => l.length > 63 || l.length === 0)) {
            return false;
        }

        const labelRE = /^[a-zA-Z0-9](\-(?=[a-zA-Z0-9])|[a-zA-Z0-9])*$/;
        const tldTest = /[a-zA-Z]+/.test(labels.slice(-1));
        return tldTest && labels.every((l) => labelRE.test(l));
    },
    isValidIP4 (v) {
        "use strict";

        const parts = v.split(".");
        if (parts.length !== 4) {
            return false;
        }

        /*
         * 0 to 9
         * 10 to 99
         * 100 to 199
         * 200 to 249
         * 250 to 255
         */
        return parts.every((p) => (/^([0-9]|[1-9][0-9]|1[0-9][0-9]|2[0-4][0-9]|25[0-5])$/).test(p));
    },
    isValidIP6 (v) {
        "use strict";

        const that = QUR.net_utils;

        /* check if an ipv6 hextet is valid*/
        const isValidHextet = (x) => (/^[0-9a-fA-F]{1,4}$/).test(x);

        /* ipv6 with double colon */
        const i = v.indexOf("::");
        if (i >= 0) {
            const parts = v.split("::");
            if (parts.length !== 2) {
                return false;
            }

            /* ipv4 {compatible,mapped} address */
            if (i === 0 && parts[0] === "") {
                const ipv4 = (/^ffff:/).test(parts[1]) ? parts[1].split("ffff:")[1] : parts[1];
                return that.isValidIP4(ipv4);
            }

            if (i === 0) {
                parts.splice(0,1);
            }

            parts.forEach(function (p, i) {
                const subParts = p.split(":");
                parts.splice(i, 1, ...subParts);
            });

            return parts.every(isValidHextet);
        }

        /* complete ipv6 address */
        const parts = v.split(":");
        if (parts.length === 8) {
            return parts.every(isValidHextet);
        }

        return false;
    },
    isValidPort: (v) => ((v > 0 && v < 65536) || v === ""),
    isValidPQF: (v) => (v.startsWith("/") || v === ""),
    isValidScheme: (v) => (/^[a-zA-Z]+[a-zA-Z0-9\+\.\-]*$/).test(v)
});
