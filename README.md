# qubes-url-redirector v2.1.1
This is a browser extension, aimed to improve surfing security. It's written for Qubes OS using standard WebExtension APIs and it allows you to manage which qube is responsible to open URLs. Obviously redirection happens before any TCP connection is opened. Furthermore, through context menu entries, you can open a specific link in a custom way.

It has a settings page embedded in browser where you customize default behavior and it supports a whitelist based on Javascript's RegExp, in this way there is a lot of flexibility to define trustworthy URLs. Settings page is also accessible through the browser's toolbar button.

# Screenshots
**Settings**
![settings](https://raw.githubusercontent.com/raffaeleflorio/qubes-url-redirector/master/common/screenshots/settings.png)
**Menus with a default qube setted**
![menus](https://raw.githubusercontent.com/raffaeleflorio/qubes-url-redirector/master/common/screenshots/menus.png)

You can see more screenshots in the `common/screenshots` directory.

# How to install
Soon there will be a signed rpm package. Now you need to clone this repo.

Because the extension needs ([webextension-browser-proxy](https://github.com/raffaeleflorio/webextension-browser-proxy), to run on Chrome/ium, clone the repo with the `recursive` flag:
```
$ git clone --recursive https://github.com/raffaeleflorio/qubes-url-redirector.git
```
Otherwise you can clone the submodule separately with:
```
qubes-url-redirector/cloned/repo $ git submodule init
qubes-url-redirector/cloned/repo $ git submodule update
```

Every commit is signed. You can get my key through https://pgp.mit.edu or through https://raffaeleflorio.github.io. The **fingerprint** is: _6F1B 35D5 4A43 864C 62D3  ACC3 0DEF F00A 47CF 317F_.

## Firefox
`qubes-url-redirector/cloned/repo $ make firefox`

## Chrome
`qubes-url-redirector/cloned/repo $ make chrome`

## Chromium
`qubes-url-redirector/cloned/repo $ make chromium`

That's all! :D
If you encounter some problems, don't hesitate to contact me!

# Additional infos
## Firefox
It's strongly advisable to disable ftp support in Firefox, because the API doesn't permit the extension to intercept this type of request. Nonetheless the browser supports the protocol. From Firefox 60 onwards you can disable ftp by setting to `false` `network.ftp.enabled` in `about:config` page.