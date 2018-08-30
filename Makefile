.PHONY: help setup chrome chromium firefox clean

NATIVE_PATH=/opt/qubes-url-redirector
NATIVE_NAME=qvm-open-in-vm-we.py

help:
	@echo make help to show this help
	@echo make chrome to install in Chrome
	@echo make chromium to install in Chromium
	@echo make firefox to install in Firefox
	@echo make clean to remove file on disk

setup:
	sudo mkdir -p ${NATIVE_PATH}
	sudo cp common/${NATIVE_NAME} ${NATIVE_PATH}/
	sudo chmod u+x ${NATIVE_PATH}/${NATIVE_NAME}

chrome: setup
	mkdir -p ~/.config/google-chrome/NativeMessagingHosts
	cp chrome/NativeMessagingHosts/qvm_open_in_vm.json ~/.config/google-chrome/NativeMessagingHosts/

chromium: setup
	mkdir -p ~/.config/chromium
	cp chrome/NativeMessagingHosts/qvm_open_in_vm.json ~/.config/chromium/NativeMessagingHosts/

firefox: setup
	mkdir -p ~/.mozilla/native-messaging-hosts
	cp firefox/native-messaging-hosts/qvm_open_in_vm.json ~/.mozilla/native-messaging-hosts/
	firefox packages/qubes-url-redirector-v2.1-firefox.xpi &

clean:
	rm -f ~/.mozilla/native-messaging-hosts/qvm_open_in_vm.json
	rm -f ~/.config/google-chrome/NativeMessagingHosts/qvm_open_in_vm.json
	rm -f ~/.config/chromium/NativeMessagingHosts/qvm_open_in_vm.json
	sudo rm -rf ${NATIVE_PATH}
