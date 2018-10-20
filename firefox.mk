FIREFOX_NATIVE_D := /usr/lib/mozilla/native-messaging-hosts
FIREFOX_EXT_D := /usr/share/mozilla/extensions/{ec8030f7-c20a-464f-9b0e-13a3a9e97384}

FIREFOX_USER_NATIVE_D := /home/user/.mozilla/native-messaging-hosts
FIREFOX_USER_EXT_D := /home/user/.mozilla/extensions/{ec8030f7-c20a-464f-9b0e-13a3a9e97384}

.PHONY: firefox-help
firefox-help:
	@echo '*** Firefox ***'
	@echo 'make firefox to install in Firefox globally (i.e. in a TemplateVM)'
	@echo 'make firefox-appvm to install in Firefox in an AppVM'
	@echo 'make firefox-clean to uninstall the extension globally'
	@echo 'make firefox-zip to make a zip of the current Firefox extension source code'

.PHONY: firefox-zip
firefox-zip:
	rm -f ${ZIP_D}/firefox-latest.zip
	cd ${FIREFOX_D} && ${ZIP} -qr ../${ZIP_D}/firefox-latest.zip -9 -X .

.PHONY: firefox
firefox: cross-setup
	${INSTALL} -Dt ${FIREFOX_NATIVE_D} ${FIREFOX_D}/native-messaging-hosts/${NATIVE_MANIFEST}
	${INSTALL} -D ${FIREFOX_XPI} ${FIREFOX_EXT_D}/${FIREFOX_ID}.xpi

.PHONY: firefox-appvm
firefox-appvm: cross-setup
	${INSTALL_U} -Dt ${FIREFOX_USER_NATIVE_D} ${FIREFOX_D}/native-messaging-hosts/${NATIVE_MANIFEST}
	${INSTALL_U} -D ${FIREFOX_XPI} ${FIREFOX_USER_EXT_D}/${FIREFOX_ID}.xpi

.PHONY: firefox-clean
firefox-clean:
	rm -f ${FIREFOX_EXT_D}/${FIREFOX_ID}.xpi
	rm -f ${FIREFOX_NATIVE_D}/${NATIVE_MANIFEST}

	rm -f ${FIREFOX_USER_EXT_D}/${FIREFOX_ID}.xpi
	rm -f ${FIREFOX_USER_NATIVE_D}/${NATIVE_MANIFEST}
