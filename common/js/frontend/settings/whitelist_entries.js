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

OPTIONS.whitelist_entries = (function () {
    "use strict";

    const escapeRE = (v) => v.replace(/[|\\{}\[\]^$+*?.]/g, "\\$&");

    function makeBaseEntry(spec) {
        const that = OPTIONS.whitelist_entries;

        const {label, trust} = spec;
        return Object.freeze({
            getLabel: () => label,
            getTrust: () => (trust === that.TRUST.MAX) ? "Yes" : "No"
        });
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
            const that = OPTIONS.whitelist_entries;

            const ENTRY_FUNC = [
                that.makeRegexp,
                that.makeExact,
                that.makeURL
            ];

            const {type, spec} = entrySpec;

            return ENTRY_FUNC[type](spec);
        },
        makeRegexp (spec) {
            const {regexp} = spec;
            return Object.freeze({
                ...makeBaseEntry(spec),
                getSimple: () => "/" + regexp + "/",
                getDetailed: () => "/" + regexp + "/",
                getType: () => "RegExp"
            });
        },
        makeExact (spec) {
            const {exact} = spec;
            return Object.freeze({
                ...makeBaseEntry(spec),
                getSimple: () => exact,
                getDetailed: () => "/^" + escapeRE(exact) + "$/",
                getType: () => "Exact Match"
            });
        },
        makeURL (spec) {
            const {scheme, host, port, path_query_fragment:pqf} = spec;

            const portRepresentation = port === "" ? "" : ":" + port;
            const hostRepresentation = host.indexOf(":") >= 0 ? "[" + host + "]" : host;
            const simpleString = scheme + "://" + hostRepresentation + portRepresentation + pqf;

            const pqfSuffix = (pqf === "" || pqf.slice(-1) === "/") ? "" : "$";

            return Object.freeze({
                ...makeBaseEntry(spec),
                getSimple: () => simpleString,
                getDetailed: () => "/^" + escapeRE(simpleString) + pqfSuffix + "/",
                getType: () => "URL"
            });
        }
    });
}());
