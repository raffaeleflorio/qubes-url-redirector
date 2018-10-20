CHROME_NATIVE_D := /etc/opt/chrome/native-messaging-hosts
CHROME_EXT_D := /usr/share/google-chrome/extensions

CHROME_USER_NATIVE_D := /home/user/.config/google-chrome/NativeMessagingHosts

CHROMIUM_NATIVE_D := /etc/chromium/native-messaging-hosts
CHROMIUM_EXT_D := /usr/share/chromium/extensions

CHROMIUM_USER_NATIVE_D := /home/user/.config/chromium/NativeMessagingHosts

.PHONY: chrome-help
chrome-help:
	@echo '*** Chrome/Chromium ***'
	@echo 'make chrome to install in Chrome'
	@echo 'make chromium to install in Chromium'
	@echo 'make chrome-clean to remove Chrome extension files'
	@echo 'make chromium-clean to remove Chromium extension files'
	@echo 'make chrome-appvm to install in Chrome in an AppVM'
	@echo 'make chromium-appvm to install in Chromium in an AppVM'
	@echo 'make chrome-zip to make a zip of the current Chrome/ium extension source code'

.PHONY: chrome-zip
chrome-zip:
	rm -f ${ZIP_D}/chrome-latest.zip
	cd ${CHROME_D} && ${ZIP} -qr ../${ZIP_D}/chrome-latest.zip -9 -X .


.PHONY: chrome-setup
chrome-setup:
	${INSTALL} -t ${QUR_D} ${CHROME_CRX}

# Chrome
.PHONY: chrome
chrome: chrome-setup
	${INSTALL} -Dt ${CHROME_EXT_D} ${CHROME_D}/${CHROME_ID}.json
	${INSTALL_U} -Dt ${CHROME_NATIVE_D} ${CHROME_D}/NativeMessagingHosts/${NATIVE_MANIFEST}

.PHONY: chrome-appvm
chrome-appvm:
	@echo TODO

.PHONY: chrome-clean
chrome-clean:
	rm -f ${CHROME_NATIVE_D}${NATIVE_MANIFEST}
	rm -f ${CHROME_EXT_D}/${CHROME_ID}.json

# Chromium
.PHONY: chromium
chromium: chrome-setup
	${INSTALL} -Dt ${CHROMIUM_EXT_D} ${CHROME_D}/${CHROME_ID}.json
	${INSTALL_U} -Dt ${CHROMIUM_NATIVE_D} ${CHROME_D}/NativeMessagingHosts/${NATIVE_MANIFEST}

.PHONY: chromium-appvm
chromium-appvm:
	@echo TODO

.PHONY: chromium-clean
chromium-clean:
	rm -f ${CHROMIUM_NATIVE_D}/${NATIVE_MANIFEST}
	rm -f ${CHROMIUM_EXT_D}/${CHROME_ID}.json
