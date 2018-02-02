FIREFOX_URL="https://github.com/raffaeleflorio/qubes-url-redirector/releases/download/v2.1/qubes-url-redirector-v2.1-firefox.xpi"
FIREFOX_NATIVE="https://raw.githubusercontent.com/raffaeleflorio/qubes-url-redirector/master/firefox/native-messaging-hosts/qvm_open_in_vm.json"

CHROME_URL="https://github.com/raffaeleflorio/qubes-url-redirector/releases/download/v2.1/qubes-url-redirector-v2.1-chrome.zip"

PY_URL="https://raw.githubusercontent.com/raffaeleflorio/qubes-url-redirector/v2.1/common/qvm-open-in-vm-we.py"

.PHONY: help setup chrome-setup chrome chromium firefox clean

help:
	@echo make help to show this help
	@echo make chrome to install in Chrome
	@echo make chromium to install in Chromium
	@echo make firefox to install in Firefox
	@echo make clean to remove file on disk

setup:
	wget -q $(PY_URL)
	sudo mv qvm-open-in-vm-we.py /usr/local/bin/
	sudo chmod u+x /usr/local/bin/qvm-open-in-vm-we.py

chrome-setup: setup
	wget -q $(CHROME_URL)
	unzip qubes-url-redirector-v2.1-chrome.zip

chrome: chrome-setup
	cp -r chrome/NativeMessagingHosts ~/.config/google-chrome/

chromium: chrome-setup
	cp -r chrome/NativeMessagingHosts ~/.config/chromium/

firefox: setup
	wget -q $(FIREFOX_NATIVE)
	wget -q $(FIREFOX_URL)
	mkdir -p ~/.mozilla/native-messaging-hosts
	mv qvm_open_in_vm.json ~/.mozilla/native-messaging-hosts
	firefox qubes-url-redirector-v2.1-firefox.xpi &

clean:
	rm -f ~/.mozilla/native-messaging-hosts/qvm_open_in_vm.json
	rm -f ~/.config/google-chrome/NativeMessagingHosts/qvm_open_in_vm.json
	rm -f ~/.config/chromium/NativeMessagingHosts/qvm_open_in_vm.json
	sudo rm -f /usr/local/bin/qvm-open-in-vm-we.py
