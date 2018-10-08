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

CHROME_NATIVE_D=~/.config/google-chrome/NativeMessagingHosts
CHROME_EXT_D=/usr/share/google-chrome/extensions

CHROMIUM_NATIVE_D=~/.config/chromium/NativeMessagingHosts
CHROMIUM_EXT_D=/usr/share/chromium/extensions

FIREFOX_NATIVE_D=~/.mozilla/native-messaging-hosts
FIREFOX_EXT_D=/usr/share/mozilla/extensions/{ec8030f7-c20a-464f-9b0e-13a3a9e97384}

help:
	@echo make help to show this help
	@echo make chrome to install in Chrome
	@echo make chromium to install in Chromium
	@echo make firefox to install in Firefox
	@echo make clean to remove file on disk

setup:
	sudo mkdir -p ${QUR_D}
	sudo cp common/${NATIVE_BIN} ${QUR_D}/
	sudo chmod u+x ${QUR_D}/${NATIVE_BIN}

chrome: setup
	mkdir -p ${CHROME_NATIVE_D}
	cp chrome/NativeMessagingHosts/${NATIVE_MANIFEST} ${CHROME_NATIVE_D}/

	sudo cp ${CHROME_CRX} ${QUR_D}/
	sudo mkdir -p ${CHROME_EXT_D}
	sudo cp chrome/${CHROME_ID}.json ${CHROME_EXT_D}/

chromium: setup
	mkdir -p ${CHROMIUM_NATIVE_D}
	cp chrome/NativeMessagingHosts/${NATIVE_MANIFEST} ${CHROMIUM_NATIVE_D}/

	sudo cp ${CHROME_CRX} ${QUR_D}/
	sudo mkdir -p ${CHROMIUM_EXT_D}
	sudo cp chrome/${CHROME_ID}.json ${CHROMIUM_EXT_D}/

firefox: setup
	mkdir -p ${FIREFOX_NATIVE_D}
	cp firefox/native-messaging-hosts/${NATIVE_MANIFEST} ${FIREFOX_NATIVE_D}/

	sudo mkdir -p ${FIREFOX_EXT_D}
	sudo cp ${FIREFOX_XPI} ${FIREFOX_EXT_D}/${FIREFOX_ID}.xpi

clean:
	sudo rm -rf ${QUR_D}

	rm -f ${FIREFOX_NATIVE_D}/${NATIVE_MANIFEST}
	sudo rm -f ${FIREFOX_EXT_D}/${FIREFOX_ID}.xpi

	rm -f ${CHROME_NATIVE_D}${NATIVE_MANIFEST}
	sudo rm -f ${CHROME_EXT_D}/${CHROME_ID}.json

	rm -f ${CHROMIUM_NATIVE_D}/${NATIVE_MANIFEST}
	sudo rm -f ${CHROMIUM_EXT_D}/${CHROME_ID}.json

zip:
	rm -f ${ZIP_D}/chrome-latest.zip
	rm -f ${ZIP_D}/firefox-latest.zip
	cd chrome && zip -x @../${ZIP_D}/exclude.lst -qr ../${ZIP_D}/chrome-latest.zip -9 -X .
	cd firefox && zip -x @../${ZIP_D}/exclude.lst -qr ../${ZIP_D}/firefox-latest.zip -9 -X .
