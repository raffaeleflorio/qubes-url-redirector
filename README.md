# qubes-url-redirector v2.1
qubes-url-redirector is a browser's extension to improve security. It's for Qubes OS and it's written using standard WebExtension APIs. It permits to manage which VM is responsible to open links, obviously redirection happens before any TCP connection is made. Furthermore, through context menu entries, you can open a specific link in a custom way. Currently you can open links in: DVM, a default-VM, a specific VM and in this VM.

It has a settings page embedded in browser where you manage default behavior and it supports a whitelist based on Javascript's RegExp, in this way there is a lot of flexibility to define trustworthy URLs or domains. Settings page is also accessible through a button in browser's toolbar, besides the default way (e.g. Firefox's Add-Ons manager).

Because of WebExtension API, currently, it can handles only HTTP(S) URL.

# Screenshots
**Settings**
![settings](https://raw.githubusercontent.com/raffaeleflorio/qubes-url-redirector/master/screenshots/empty_settings.png)
**Menus with a default vm name setted**
![menus](https://raw.githubusercontent.com/raffaeleflorio/qubes-url-redirector/master/screenshots/menus.png)

# Supported Browsers
  In theory every browser compatible with WebExtension API.
  ### Tested Browsers
  - Firefox (according API's reference from 50 onwards)
  - Chrome/Chromium (according API's reference from 42 onwards)

# How to install
Currently there is only a signed package for Firefox. The installation in Chrome is manual.<br>
In both case you need to clone this repo. It also contains a submodule ([webextension-browser-proxy](https://github.com/raffaeleflorio/webextension-browser-proxy)) as dependency.

In order to get the submodule you can clone this repo with:
```
$ git clone --recursive
```
Otherwise you can clone the submodule separately with:
```
qubes-url-redirector/cloned/repo $ git submodule init
qubes-url-redirector/cloned/repo $ git submodule update
```

Every commit is signed. You can get my key through https://pgp.mit.edu or through https://raffaeleflorio.github.io. The **fingerprint** is: _5527 116A DB00 1157 5877  8038 53D6 2C23 CF68 1104_.

#### Firefox
1. make firefox

#### Chrome/Chromium
1. make chrome (or chromium)
2. Follow istructions at this link, to install the extension (it's in `chrome` dir): https://developer.chrome.com/extensions/getstarted#unpacked
3. Replace `EXTENSION_ID_HERE` with the generated one (from the chrome://extensions page) in `~/.config/google-chrome/NativeMessagingHosts/qvm_open_in_vm.json` or `~/.config/chromium/NativeMessagingHosts/qvm_open_in_vm.json`, if you use Chrome or Chromium respectivly.

Now you can start to use it!
If you encounter some problems, don't hesitate to contact me!

# Additional infos
### Chrome/Chromium new tab behavior
Actually these browsers makes an HTTP(S) request to get the new tab contents. Currently the URL is: `https://google.com/_/chrome/newtab?ie=UTF-8`. So you need to either whitelist the URL or change the new tab behavior.

### Chrome/Chromium prediction issue
In order to use this extension with these browsers you have to disable `Use a prediction service to load pages more quickly` feature. If the latter is enabled the browser connects to a predetermined server before user consent. In this way some URL opens in an unexpected way.

### Google Search `rwt`
In Google Search when `onmousedown` event fires on link element, `rwt` function is called. It's a Javascript function that replaces link's URL with a custom Google's URL that redirects to original URL... I implemented the rwt escaping in this extension because it's needed to work correctly.

Nonetheless I also wrote a separate extension to disable this manipulation: [anti_rwt](https://github.com/raffaeleflorio/anti_rwt). However `qubes-url-redirector` implement anti manipulation more effectively with `anti_rdr` object.

### anti_rdr
`anti_rdr` is an object that escape manipulated URL. In this way correct behavior of this extension is preserved. Currently it implements escaping of:
- `google.com/url` url
- `l.facebook.com` url