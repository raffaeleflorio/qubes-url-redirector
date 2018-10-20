CHROMIUM_NATIVE_D := /etc/chromium/native-messaging-hosts
CHROMIUM_EXT_D := /usr/share/chromium/extensions

CHROMIUM_USER_NATIVE_D := /home/user/.config/chromium/NativeMessagingHosts

.PHONY: chromium-help
chromium-help:
	@echo '*** Chromium ***'
	@echo 'make chromium to install in Chromium'
	@echo 'make chromium-appvm to install in Chromium in an AppVM'
	@echo 'make chromium-clean to remove Chromium extension files'

.PHONY: chromium
chromium: chrome-setup
	${INSTALL} -Dt ${CHROMIUM_EXT_D} ${CHROME_D}/${CHROME_ID}.json
	${INSTALL} -Dt ${CHROMIUM_NATIVE_D} ${CHROME_D}/NativeMessagingHosts/${NATIVE_MANIFEST}

.PHONY: chromium-appvm
chromium-appvm: chrome-setup
	@echo TODO
#	${INSTALL_U} -Dt ${CHROMIUM_USER_NATIVE_D} ${CHROME_D}/NativeMessagingHosts/${NATIVE_MANIFEST}

.PHONY: chromium-clean
chromium-clean:
	rm -f ${CHROMIUM_NATIVE_D}/${NATIVE_MANIFEST}
	rm -f ${CHROMIUM_EXT_D}/${CHROME_ID}.json

#	rm -f -Dt ${CHROMIUM_USER_NATIVE_D}/${NATIVE_MANIFEST}
