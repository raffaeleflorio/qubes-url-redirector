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
        const {label=""} = spec;
        return Object.freeze({...spec, label});
    }

    function _isValidCommonSpec (spec) {
        const {label} = _normalizeSpec(spec);
        if (typeof label !== "string") {
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
                test: (v) => reObj.test(v),
                toString: (detailed = false) => detailed ? reObj.toString() : simpleString,
                toJSON: () => json
            });
        },
        makeURL (spec) {
            const scheme = spec.scheme || "https";
            const host = spec.host;
            const port = spec.port ? Number(spec.port) : "";
            const pqf = spec.path_query_fragment || "";

            if (!_isValidCommonSpec(spec)) {
                return null;
            }

            const net_utils = QUR.net_utils;

            const isIP6 = net_utils.isValidIP6(host);
            const isIP4 = net_utils.isValidIP4(host);
            const isDNS = net_utils.isValidDomainName(host);
            const isValidHost = isIP6 || isIP4 || isDNS;

            const isValidPQF = net_utils.isValidPQF(pqf);
            const isValidPort = net_utils.isValidPort(port);
            const isValidScheme = net_utils.isValidScheme(scheme);

            if (!isValidHost || !isValidPQF || !isValidPort || !isValidScheme) {
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
                test: (v) => reObj.test(v),
                toString: (detailed = false) => detailed ? reObj.toString() : simpleString,
                toJSON: () => json
            });
        },
        escapeRE: (v) => v.replace(/[|\\{}\[\]^$+*?\(\).]/g, "\\$&")
    });
}());
