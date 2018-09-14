# qubes-url-redirector v3.0
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

Every commit is signed. You can get my key [from raffaeleflorio.github.io](https://raffaeleflorio.github.io/resources/pgp.asc) or [from pgp.mit.edu](https://pgp.mit.edu/pks/lookup?op=get&search=0x0deff00a47cf317f). The **fingerprint** is: _6F1B 35D5 4A43 864C 62D3  ACC3 0DEF F00A 47CF 317F_. To check the commit signature you need to import the key in gpg.

To check **every** commit signature:
```
qubes-url-redirector/cloned/repo $ git log --show-signature
```

To limit the check to *a_number* of commits:
```
qubes-url-redirector/cloned/repo $ git log --show-signature -*a_number*
```

## Firefox
`qubes-url-redirector/cloned/repo $ make firefox`

## Chrome
`qubes-url-redirector/cloned/repo $ make chrome`

## Chromium
`qubes-url-redirector/cloned/repo $ make chromium`

---

That's all! :D
If you encounter some problems, don't hesitate to contact me!

# Supported browser
- Firefox 52 onwards (according the API's reference). Firefox 60 strongly recommended (see [below](#firefox-1)).
- Chromium 42 onwards (according the API's reference).

## Schemes compatibility table
| scheme | Firefox | Chrome/ium |
|---|---|---|
| http | supported | supported |
| https | supported | supported |
| ws | supported | supported since v58 |
| wss | supported | supported since v58|
| ftp | not supported (see [below](#firefox-1)) | supported |
| file | not supported | supported |

## Firefox
It's strongly recommended to disable ftp support in Firefox, because the API doesn't permit the extension to intercept this type of request. Nonetheless the browser supports the protocol. Since Firefox 60 onwards you can disable ftp by setting to `false` `network.ftp.enabled` in `about:config` page.