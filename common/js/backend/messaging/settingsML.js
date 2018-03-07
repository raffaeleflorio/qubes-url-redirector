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

(function () {
    "use strict";

    const that = QUR.messaging;

    /* UPDATE_SETTINGS handler */
    that.addListener({
	msg: that.MSG.UPDATE_SETTINGS,
	handler: function (details) {
	    const {sendResponse, options:newSettings} = details;
	    const oldSettings = QUR.settings.toJSON();

	    if (QUR.settings.set(newSettings)) {
		QUR.JSONPersistence.persist({"settings": QUR.settings})
		    .then(() => sendResponse({response: true}))
		    .catch(function () {
			QUR.settings.set(oldSettings);
			sendResponse({response: false});
		    });
	    } else {
		sendResponse({response: false});
	    }
	}
    });

    /* GET_SETTINGS handler */
    that.addListener({
	msg: that.MSG.GET_SETTINGS,
	handler: function (details) {
	    const {sendResponse} = details;

	    QUR.JSONPersistence.get("settings")
		.then(function (result) {
		    const {settings = QUR.settings.toJSON()} = result;

		    QUR.settings.set(settings);
		    sendResponse({response: settings});
		})
		.catch(() => sendResponse({response: false}));
	}
    });
}());
