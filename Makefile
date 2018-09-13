.PHONY: help setup chrome chromium firefox clean zip

BIN_NATIVE_D=/opt/qubes-url-redirector
BIN_NATIVE=qvm-open-in-vm-we.py

NATIVE_MANIFEST=qvm_open_in_vm.json

CHROME_NATIVE_D=~/.config/google-chrome/NativeMessagingHosts
CHROMIUM_NATIVE_D=~/.config/chromium/NativeMessagingHosts
FIREFOX_NATIVE_D=~/.mozilla/native-messaging-hosts

ZIP_D=packages/zip

help:
	@echo make help to show this help
	@echo make chrome to install in Chrome
	@echo make chromium to install in Chromium
	@echo make firefox to install in Firefox
	@echo make clean to remove file on disk

setup:
	sudo mkdir -p ${BIN_NATIVE_D}
	sudo cp common/${BIN_NATIVE} ${BIN_NATIVE_D}/
	sudo chmod u+x ${BIN_NATIVE_D}/${BIN_NATIVE}

chrome: setup
	mkdir -p ${CHROME_NATIVE_D}
	cp chrome/NativeMessagingHosts/${NATIVE_MANIFEST} ${CHROME_NATIVE_D}/

chromium: setup
	mkdir -p ${CHROMIUM_NATIVE_D}
	cp chrome/NativeMessagingHosts/${NATIVE_MANIFEST} ${CHROMIUM_NATIVE_D}

firefox: setup
	mkdir -p ${FIREFOX_NATIVE_D}
	cp firefox/native-messaging-hosts/${NATIVE_MANIFEST} ${FIREFOX_NATIVE_D}/

clean:
	rm -f ${FIREFOX_NATIVE_D}/${NATIVE_MANIFEST}
	rm -f ${CHROME_NATIVE_D}${NATIVE_MANIFEST}
	rm -f ${CHROMIUM_NATIV_D}/${NATIVE_MANIFEST}
	sudo rm -rf ${BIN_NATIVE_D}

zip:
	rm -f ${ZIP_D}/chrome-latest.zip
	rm -f ${ZIP_D}/firefox-latest.zip
	cd chrome && zip -x @../${ZIP_D}/exclude.lst -qr ../${ZIP_D}/chrome-latest.zip -9 -X .
	cd firefox && zip -x @../${ZIP_D}/exclude.lst -qr ../${ZIP_D}/firefox-latest.zip -9 -X .
