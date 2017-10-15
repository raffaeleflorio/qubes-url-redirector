.PHONY: help setup chrome chromium firefox clean

help:
	@echo make help to show this help
	@echo make chrome to install in Chrome
	@echo make chromium to install in Chromium
	@echo make firefox to install in Firefox
	@echo make clean to unistall from every browser

setup:
	sudo cp common/qvm-open-in-vm-we.py /usr/local/bin/
	sudo chmod u+x /usr/local/bin/qvm-open-in-vm-we.py
	git submodule init
	git submodule update

chrome: setup
	cp -r chrome/NativeMessagingHosts ~/.config/google-chrome/

chromium: setup
	cp -r chrome/NativeMessagingHosts ~/.config/chromium/

firefox: setup
	cp -r firefox/native-messaging-hosts ~/.mozilla/

clean:
	rm -f ~/.mozilla/native-messaging-hosts/qvm-open-in-vm-we.py
	rm -f ~/.config/google-chrome/NativeMessagingHosts/qvm-open-in-vm-we.py
	rm -f ~/.config/chromium/NativeMessagingHosts/qvm-open-in-vm-we.py
	sudo rm -f /usr/local/bin/qvm-copy-to-vm-we.py
