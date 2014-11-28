BIN=bin
LOG=log
TEST_RUNNER=$(BIN)/smj-test-file
TEST_FILES=tests/*.js

test: 
	@$(TEST_RUNNER) $(TEST_FILES) > $(LOG)/test.log
	@cat $(LOG)/test.log

.phony: test
