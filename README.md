# qubes-url-redirector v1.2
qubes-url-redirector is a browser's extension to improve security. It's for Qubes OS and it's written using standard WebExtension APIs. It permits to manage which VM is responsible to open links, obviously redirection happens before any TCP connection is made. Furthermore, through context menu entries, you can open a specific link in a custom way. Currently you can open links in: DVM, a default-VM, a specific VM and in this VM.

It has a settings page embedded in browser where you manage default behavior and it supports a whitelist based on Javascript's RegExp, in this way there is a lot of flexibility to define trustworthy URLs or domains. Settings page is also accessible through a button in browser's toolbar, besides the default way (e.g. Firefox's Add-Ons manager).

You can see interface in screenshots directory.

# Supported Browsers
  In theory every browser compatible with WebExtension API.
  ### Tested Browsers
  - Firefox (according API's reference from 50 onwards)
  - Chrome/Chromium (according API's reference from 42 onwards)

# How to install
Currently there isn't any official Qubes package. For this reason installation is manual and it's done in two phases: setup and loading.

### Setup
To perform initial setup you can use `make`.<br>
For example to setup for Firefox:
```
[my/repo/path]$ make firefox
```

### Loading
#### Firefox
Follow istructions in this link: https://developer.mozilla.org/en-US/Add-ons/WebExtensions/Temporary_Installation_in_Firefox<br>
Note that with this method the installation is temporarly. Furthermore only extensions signed by Mozilla could be installed permanently, unless you disable sign verification globally. Obviously when package is finished, extension will be signed.

#### Chrome/Chromium
1. Follow istructions this link: https://developer.chrome.com/extensions/getstarted#unpacked
2. Replace `EXTENSION_ID_HERE` with the generated one in `~/.config/google-chrome/NativeMessagingHosts/qvm_open_in_vm.json` or `~/.config/chromium/NativeMessagingHosts/qvm_open_in_vm.json`, if you use Chrome or Chromium respectivly.

After loading you can start to use it!
If you encounter some problems, don't hesitate to contact me!

# Chrome/Chromium prediction issue
In order to use this extension with these browsers you have to disable `Use a prediction service to load pages more quickly` feature. If the latter is enabled the browser connects to a predetermined server before user consent.

# Google Search `rwt` issue and `anti_rwt`
In Google Search when `onmousedown` event fires on link element, `rwt` function is called. It's a Javascript function that replaces link's URL with a custom Google's URL that redirects to original URL... So in order to prevent this behavior an external extension is needed. I did not implement this feature on this extension because it's more a privacy related issue than security one.
However I wrote an extension to disable this manipulation: `anti_rwt`. Without the latter `qubes-url-redirector` cannot work properly with Google Search. Here the extension's repo: https://github.com/raffaeleflorio/anti_rwt.