VERSION := v3.0.2_beta

# Directories
QUR_D := /usr/local/share/qubes-url-redirector

PACKAGES_D := packages
ZIP_D := ${PACKAGES_D}/zip

FIREFOX_D := firefox
CHROME_D := chrome

# Extension info, used during installation in *.mk
FIREFOX_ID := qubes-url-redirector@raffaeleflorio.github.io
FIREFOX_XPI := ${PACKAGES_D}/firefox-${VERSION}.xpi

CHROME_ID=cooilipombfggahablhdfembkajifpbi
CHROME_CRX=${PACKAGES_D}/chrome-${VERSION}.crx

# Native end files
NATIVE_MANIFEST := qvm_open_in_vm.json
NATIVE_BIN := qvm-open-in-vm-we.py

# Commands
INSTALL := install -m644
INSTALL_U := sudo -u user -- install -m644
INSTALL_EXE := install -m755

ZIP := zip -x @../${ZIP_D}/exclude.lst

include chrome.mk chromium.mk firefox.mk

.DEFAULT_GOAL := help
.PHONY: help
help: _help chrome-help chromium-help firefox-help

.PHONY: _help
_help:
	@echo 'make help to show this help'
	@echo 'make clean to remove every extension file'
	@echo 'make zip to make a zip, for each browser, of the current code'

.PHONY: cross-setup
cross-setup:
	${INSTALL_EXE} -Dt ${QUR_D} common/${NATIVE_BIN}

.PHONY: clean
clean: firefox-clean chrome-clean chromium-clean
	rm -rf ${QUR_D}

.PHONY: zip
zip: chrome-zip firefox-zip
