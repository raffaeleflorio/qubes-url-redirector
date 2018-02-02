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

/* initiliaze extension */

const qur = { };

/* init script */
(async () => {
    /* pupulate qur namespace */
    qur.whitelist = await whitelist();
    qur.settings = await settings();
    qur.native = native;
    qur.anti_rdr = anti_rdr();

    /* listeners */
    browser.webRequest.onBeforeRequest.addListener(
	redirector().route,
	{
	    urls: ["<all_urls>"],
	    types: ["main_frame"]
	},
	["blocking"]
    );

    /* disabled because used only by chrome/content_scripts/aHandler.js */
    // browser.runtime.onMessage.addListener((request, sender, sendResponse) => {
    // 	if (request.msg === "isWhitelisted")
    // 	    sendResponse({result: qur.whitelist.test(anti_rdr.escape(request.url), false)});
    // });

    /* ui stuffs */
    ui.init();

    /* callable by getBackgroundPage() */
    getQur = () => qur;
    
})();
