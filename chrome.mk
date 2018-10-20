CHROME_NATIVE_D := /etc/opt/chrome/native-messaging-hosts
CHROME_EXT_D := /usr/share/google-chrome/extensions

CHROME_USER_NATIVE_D := /home/user/.config/google-chrome/NativeMessagingHosts

.PHONY: chrome-help
chrome-help:
	@echo '*** Chrome ***'
	@echo 'make chrome to install in Chrome'
	@echo 'make chrome-appvm to install in Chrome in an AppVM'
	@echo 'make chrome-clean to remove Chrome extension files'
	@echo 'make chrome-zip to make a zip of the current Chrome/ium extension source code'

.PHONY: chrome-zip
chrome-zip:
	rm -f ${ZIP_D}/chrome-latest.zip
	cd ${CHROME_D} && ${ZIP} -qr ../${ZIP_D}/chrome-latest.zip -9 -X .

.PHONY: chrome-setup
chrome-setup: cross-setup
	${INSTALL} -t ${QUR_D} ${CHROME_CRX}

.PHONY: chrome
chrome: chrome-setup
	${INSTALL} -Dt ${CHROME_EXT_D} ${CHROME_D}/${CHROME_ID}.json
	${INSTALL} -Dt ${CHROME_NATIVE_D} ${CHROME_D}/NativeMessagingHosts/${NATIVE_MANIFEST}

.PHONY: chrome-appvm
chrome-appvm: chrome-setup
	@echo TODO
#	${INSTALL_U} -Dt ${CHROME_USER_NATIVE_D} ${CHROME_D}/NativeMessagingHosts/${NATIVE_MANIFEST}

.PHONY: chrome-clean
chrome-clean:
	rm -f ${CHROME_NATIVE_D}${NATIVE_MANIFEST}
	rm -f ${CHROME_EXT_D}/${CHROME_ID}.json
