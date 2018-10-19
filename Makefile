.PHONY: help setup chrome chromium firefox clean zip

# local stuff
VERSION=v3.0.1_beta

NATIVE_MANIFEST=qvm_open_in_vm.json
NATIVE_BIN=qvm-open-in-vm-we.py

PACKAGES_D=packages
ZIP_D=${PACKAGES_D}/zip

CHROME_ID=cooilipombfggahablhdfembkajifpbi
FIREFOX_ID=qubes-url-redirector@raffaeleflorio.github.io

CHROME_CRX=${PACKAGES_D}/chrome-${VERSION}.crx
FIREFOX_XPI=${PACKAGES_D}/firefox-${VERSION}.xpi

# installation dir
QUR_D=/opt/qubes-url-redirector

CHROME_NATIVE_D=/home/user/.config/google-chrome/NativeMessagingHosts
CHROME_EXT_D=/usr/share/google-chrome/extensions

CHROMIUM_NATIVE_D=/home/user/.config/chromium/NativeMessagingHosts
CHROMIUM_EXT_D=/usr/share/chromium/extensions

FIREFOX_NATIVE_D=/home/user/.mozilla/native-messaging-hosts
FIREFOX_EXT_D=/usr/share/mozilla/extensions/{ec8030f7-c20a-464f-9b0e-13a3a9e97384}

# macro
INSTALL=install -m644
INSTALL_EXE=install -m755

INSTALL_UCONF=sudo -u user -- install -m644

help:
	@echo make help to show this help
	@echo make chrome to install in Chrome
	@echo make chromium to install in Chromium
	@echo make firefox to install in Firefox
	@echo make clean to remove file on disk

setup:
	${INSTALL_EXE} -Dt ${QUR_D} common/${NATIVE_BIN}

chrome: setup
	${INSTALL} -Dt ${CHROME_EXT_D} chrome/${CHROME_ID}.json
	${INSTALL} -t ${QUR_D} ${CHROME_CRX}
	${INSTALL_UCONF} -Dt ${CHROME_NATIVE_D} chrome/NativeMessagingHosts/${NATIVE_MANIFEST}

chromium: setup
	${INSTALL} -Dt ${CHROMIUM_EXT_D} chrome/${CHROME_ID}.json
	${INSTALL} -t ${QUR_D} ${CHROME_CRX}
	${INSTALL_UCONF} -Dt ${CHROMIUM_NATIVE_D} chrome/NativeMessagingHosts/${NATIVE_MANIFEST}

firefox: setup
	${INSTALL} -D ${FIREFOX_XPI} ${FIREFOX_EXT_D}/${FIREFOX_ID}.xpi
	${INSTALL_UCONF} -Dt ${FIREFOX_NATIVE_D} firefox/native-messaging-hosts/${NATIVE_MANIFEST}

clean:
	rm -rf ${QUR_D}

	rm -f ${FIREFOX_NATIVE_D}/${NATIVE_MANIFEST}
	rm -f ${FIREFOX_EXT_D}/${FIREFOX_ID}.xpi

	rm -f ${CHROME_NATIVE_D}${NATIVE_MANIFEST}
	rm -f ${CHROME_EXT_D}/${CHROME_ID}.json

	rm -f ${CHROMIUM_NATIVE_D}/${NATIVE_MANIFEST}
	rm -f ${CHROMIUM_EXT_D}/${CHROME_ID}.json

zip:
	rm -f ${ZIP_D}/chrome-latest.zip
	rm -f ${ZIP_D}/firefox-latest.zip
	cd chrome && zip -x @../${ZIP_D}/exclude.lst -qr ../${ZIP_D}/chrome-latest.zip -9 -X .
	cd firefox && zip -x @../${ZIP_D}/exclude.lst -qr ../${ZIP_D}/firefox-latest.zip -9 -X .
