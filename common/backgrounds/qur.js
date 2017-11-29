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
