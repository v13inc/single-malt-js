#
# single-malt-js build script
# 

# files
TEST_FILES=tests/*.js
# don't use a glob, since we need boot files to be in the right order
BOOT_FILES=boot/path.js boot/require.js boot/bootstrap.js
LIB_FILES=lib/*.js

# flags and settings
# leave blank for no debug
DEBUG=

build/build.js: build/boot.js build/lib.js
	mkdir -p build
	cat $^ > $@

build/boot.js: $(BOOT_FILES)
	mkdir -p build
	cat $^ > $@

build/lib.js: $(LIB_FILES)
	bin/smj-wrap-module $^ > $@

#
# Helper commands
#

.phony: test build

build: build/build.js

test: 
	@node $(DEBUG) bin/smj-test-file $(TEST_FILES)
