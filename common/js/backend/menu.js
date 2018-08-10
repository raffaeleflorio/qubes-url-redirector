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

QUR.ready.then(function () {
    "use strict";

    browser.contextMenus.create({
        id: "open-in-dvm",
        title: "Open in DVM",
        contexts: ["link"],
        enabled: true
    });

    const vm = QUR.settings.getDefaultVm();
    browser.contextMenus.create({
        id: "open-in-default-vm",
        title: "Open in " + (vm === null ? "default" : vm) + " VM",
        contexts: ["link"],
        enabled: (vm !== null)
    });

    browser.contextMenus.create({
        id: "open-here",
        title: "Open here",
        contexts: ["link"],
        enabled: true
    });

    browser.contextMenus.onClicked.addListener(function (info) {
        const id = info.menuItemId;
        const url = info.linkUrl;

        if (id === "open-in-dvm") {
            QUR.native.openurl({vmname: "$dispvm", url});
        } else if (id === "open-in-default-vm") {
            QUR.native.openurl({vmname: QUR.settings.getDefaultVm(), url});
        } else if (id === "open-here") {
            QUR.tabs.create({url, oneTimeWhitelisted: true});
        }
    });

    QUR.settings.onChanged.addListener(function () {
        const vm = QUR.settings.getDefaultVm();
        browser.contextMenus.update(
            "open-in-default-vm",
            {
                title: "Open in " + (vm === null ? "default" : vm) + " VM",
                enabled: (vm !== null)
            });
    });
});
