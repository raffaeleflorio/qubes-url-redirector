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

QUR.whitelist_entries = (function () {
    "use strict";

    function _normalizeSpec (spec) {
        const {label="", trust=QUR.whitelist_entries.TRUST.MIN} = spec;
        return Object.freeze({...spec, label, trust});
    }

    function _isValidCommonSpec (spec) {
        const {label="", trust=QUR.whitelist_entries.TRUST.MIN} = spec;
        if (typeof label !== "string" || typeof trust !== "number") {
            return false;
        }
        return true;
    }

    return Object.freeze({
        ENTRY_TYPE: Object.freeze({
            REGEXP: 0,
            EXACT: 1,
            URL: 2
        }),
        TRUST: Object.freeze({
            MIN: 0,
            MAX: 1
        }),
        makeEntry (entrySpec) {
            const that = QUR.whitelist_entries;

            const ENTRY_FUNC = [
                that.makeRegexp,
                that.makeExact,
                that.makeURL
            ];

            const {type, spec} = entrySpec;
            const isValidEntryType = (v) => Object.values(that.ENTRY_TYPE).some((x) => x === v);
            if (!isValidEntryType(type) || !spec) {
                return null;
            }

            return ENTRY_FUNC[type](spec);
        },
        isValidEntry (obj) {
            const that = QUR.whitelist_entries;

            const ENTRIES = [
                that.makeRegexp({regexp: ""}),
                that.makeExact({exact: ""}),
                that.makeURL({host: "127.0.0.1"})
            ];

            if (typeof obj !== "object" || obj === null || typeof obj.getType !== "function") {
                return false;
            }

            const type = obj.getType();
            const compEntry = ENTRIES[type];
            return Object.keys(obj).every((k) => typeof obj[k] === typeof compEntry[k]);
        },
        makeRegexp (spec) {
            const {regexp} = spec;
            if (typeof regexp !== "string" || !_isValidCommonSpec(spec)) {
                return null;
            }

            const that = QUR.whitelist_entries;

            const MY_TYPE = that.ENTRY_TYPE.REGEXP;
            const reObj = new RegExp(regexp);
            const nspec = _normalizeSpec(spec);
            const json = Object.freeze({type: MY_TYPE, spec: nspec});
            return Object.freeze({
                getType: () => MY_TYPE,
                getTrust: () => nspec.trust,
                test: (v) => reObj.test(v),
                toString: () => reObj.toString(),
                toJSON: () => json
            });
        },
        makeExact (spec) {
            const {exact} = spec;
            if (typeof exact !== "string" || !_isValidCommonSpec(spec)) {
                return null;
            }

            const that = QUR.whitelist_entries;

            const MY_TYPE = that.ENTRY_TYPE.EXACT;
            const reObj = new RegExp("^" + that.escapeRE(exact) + "$");
            const simpleString = reObj.toString().slice(2, -2);
            const nspec = _normalizeSpec(spec);
            const json = Object.freeze({type: MY_TYPE, spec: nspec});
            return Object.freeze({
                getType: () => MY_TYPE,
                getTrust: () => nspec.trust,
                test: (v) => reObj.test(v),
                toString: (detailed = false) => detailed ? reObj.toString() : simpleString,
                toJSON: () => json
            });
        },
        makeURL (spec) {
            const scheme = spec.scheme || "https";
            const host = spec.host;
            const port = Number(spec.port) || "";
            const pqf = spec.path_query_fragment || "";

            if (!_isValidCommonSpec(spec)) {
                return null;
            }

            const isValidScheme = (v) => (/^[a-zA-Z]+[a-zA-Z0-9\+\.\-]*$/).test(v);

            function isValidDomainName (v) {
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

                const labelRE = /^[a-zA-Z0-9]([a-zA-Z0-9-](?=[a-zA-Z0-9])|[a-zA-Z0-9])*$/;
                return labels.every((l) => labelRE.test(l));
            };

            function isValidIP4 (v) {
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
            };

            /* between bracket */
            function isValidIP6 (v) {
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
                        return isValidIP4(ipv4);
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
            };
            const isIP6 = isValidIP6(host);
            const isValidHost = (v) => isValidDomainName(v) || isValidIP4(v) || isIP6;

            const isValidPort = (v) => (v > 0 && v < 65536) || v === "";

            const isValidPQF = (v) => v.startsWith("/") || v === "";

            if (!isValidPQF(pqf) || !isValidPort(port) || !isValidScheme(scheme) || !isValidHost(host)) {
                return null;
            }

            const that = QUR.whitelist_entries;

            const portRepresentation = port === "" ? "" : ":" + port;
            const hostRepresentation = isIP6 ? "[" + host + "]" : host;

            const MY_TYPE = that.ENTRY_TYPE.URL;
            const reObj = new RegExp(function () {
                const schemePrefix = "^" + scheme + "://";

                const escapedPqf = that.escapeRE(pqf);
                const pqfSuffix = (pqf === "" || pqf.slice(-1) === "/") ? "" : escapedPqf + "$";

                return schemePrefix + that.escapeRE(hostRepresentation) + portRepresentation + "(?![^/])" + pqfSuffix;
            }());

            const simpleString = scheme + "://" + hostRepresentation + portRepresentation + pqf;

            const nspec = _normalizeSpec(spec);
            const json = Object.freeze({
                type: MY_TYPE,
                spec: Object.freeze({...nspec, scheme, host, port, path_query_fragment: pqf})
            });
            return Object.freeze({
                getType: () => MY_TYPE,
                getTrust: () => nspec.trust,
                test: (v) => reObj.test(v),
                toString: (detailed = false) => detailed ? reObj.toString() : simpleString,
                toJSON: () => json
            });
        },
        escapeRE: (v) => v.replace(/[|\\{}\[\]^$+*?.]/g, "\\$&")
    });
}());
