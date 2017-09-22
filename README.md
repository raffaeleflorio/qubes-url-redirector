# qubes-url-redirector v1.2

qubes-url-redirector is a browser's extension to improve security. It's for Qubes OS and it's written using standard WebExtension APIs. It permits to manage which VM is responsible to open links, obviously redirection happens before any TCP connection is made. Furthermore, through context menu entries, you can open a specific link in a custom way. Currently you can open links in: DVM, a default-VM, a specific VM and in this VM.

It has a settings page embedded in browser where you manage default behavior and it supports a whitelist based on Javascript's RegExp, in this way there is a lot of flexibility to define trustworthy URLs or domains. Settings page is also accessible through a button in browser's toolbar, besides the default way (e.g. Firefox's Add-Ons manager).

You can see interface in screenshots directory.

# Tested Browsers
  - Firefox (according API's reference from 50 onwards)
  - Chrome/Chromium (according API's reference from 42 onwards)

# Chrome/Chromium prediction issue

In order to use this extension with these browsers you have to disable `Use a prediction service to load pages more quickly` feature. If the latter is enabled the browser connects to a predetermined server before user consent.

# Google Search `rwt` issue

In Google Search when `onmousedown` event fires on link element, `rwt` function is called. It's a Javascript function that replaces link's URL with a custom Google's URL that redirects to original URL... So in order to prevent this behavior an external extension is needed. I did not implement this feature on this extension because it's more a privacy related issue than security one. Soon I'll write it.

However because with `rwt` you cannot use properly this extension with Google Search I implemented escaping of manipulated URL.