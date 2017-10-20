/* initiliaze extension */

const qur = { };

/* init script */
(async () => {
    qur.whitelist = await whitelist();
    qur.settings = await settings();
    qur.native = native;

    browser.webRequest.onBeforeRequest.addListener(
	redirector().route,
	{
	    urls: ["<all_urls>"],
	    types: ["main_frame"]
	},
	["blocking"]
    );

    ui.init();

    /* callable by getBackgroundPage() */
    getQur = () => qur;
    
})();

