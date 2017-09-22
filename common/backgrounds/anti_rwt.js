const anti_rwt = {
    test: function(url) {
	const google_rwt = /^(?:https?:\/\/)?(?:www\.)?google\.\w+\/url\?/;
	return google_rwt.test(url);
    },

    escape: function(url) {
	return this.test(url) ? (new URL(url)).searchParams.get("url") : url;
    }   
};
