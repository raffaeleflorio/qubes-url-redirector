# qubes-url-redirector 1.2

Qubes OS URL Redirector 1.2

# Chrome/Chromium preload issue

In order to use this extension with these browsers you have to disable `Use a prediction service to load pages more quickly` feature. If the latter is enabled the browser connects to a predetermined server before user consent.

# Google Search `rwt` issue

In Google Search when `onmousedown` event fires on link element, `rwt` function is called. It's a Javascript function that replaces link's URL with a custom Google's URL that redirects to original URL... So in order to prevent this behavior an external extension is needed. I did not implement this feature on this extension because it's more a privacy related issue than security one. Soon I'll write it.