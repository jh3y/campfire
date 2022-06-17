PARCEL = ./node_modules/.bin/parcel
VITE = ./node_modules/.bin/vite

SRC_BASE = ./
BOILERPLATE_BASE = ./boilerplate/

SCRIPT_FILE = script.js
STYLE_FILE = style.css
MARKUP_FILE = index.html
README_FILE = README.md

BOILERPLATE_README = $(BOILERPLATE_BASE)$(README_FILE)
BOILERPLATE_MARKUP = $(BOILERPLATE_BASE)$(MARKUP_FILE)
BOILERPLATE_SCRIPT = $(BOILERPLATE_BASE)$(SCRIPT_FILE)
BOILERPLATE_STYLE = $(BOILERPLATE_BASE)$(STYLE_FILE)

SCRIPT_SRC = $(SRC_BASE)/$(DEMO)/$(SCRIPT_FILE)
MARKUP_SRC = $(SRC_BASE)/$(DEMO)/$(MARKUP_FILE)
README_SRC = $(SRC_BASE)/$(DEMO)/$(README_FILE)
STYLE_SRC  = $(SRC_BASE)/$(DEMO)/$(STYLE_FILE)

help:
	@grep -E '^[a-zA-Z\._-]+:.*?## .*$$' $(MAKEFILE_LIST) | awk 'BEGIN {FS = ":.*?## "}; {printf "\033[36m%-20s\033[0m %s\n", $$1, $$2}'

# target that checks for demo to be set
checkForDemo:
ifndef DEMO
	$(error DEMO not set!!!)
endif

checkForConf:
ifndef CONF
	$(error CONF not set!!!)
endif

create: checkForDemo ## Creates new demo code ready to run
	cat $(BOILERPLATE_README) > $(README_SRC)
	cat $(BOILERPLATE_MARKUP) > $(MARKUP_SRC)
	cat $(BOILERPLATE_SCRIPT) > $(SCRIPT_SRC)
	cat $(BOILERPLATE_STYLE) > $(STYLE_SRC)


develop: checkForDemo ## Runs demo source
	$(PARCEL) $(DEMO)/$(MARKUP_FILE)

clean:
	rm -rf .parcel-cache dist

develop-conf: checkForConf ## Runs conference deck including demos
	$(PARCEL) $(CONF)/deck/**/*.html --https --cert ./localhost.pem --key ./localhost-key.pem --no-cache --no-source-maps

build-conf: checkForConf ## Runs conference deck including demos
	$(PARCEL) build $(CONF)/deck/**/*.html

build-demos: checkForConf ## Runs conference deck including demos
	$(PARCEL) build $(CONF)/demos/**/*.html --no-cache --no-source-maps

dev-pixel-pioneers:
	$(VITE) pixel-pioneers-2022/deck/ --port 1234
build-pixel-pioneers:
	$(VITE) build pixel-pioneers-2022/deck/ --outDir ../../.public