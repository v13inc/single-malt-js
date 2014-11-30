var fs = require('fs');
var Test = require('../lib/test.js');
var Require = require('../boot/require.js');
var JsHtml = require('../lib/jshtml.js');

Test.file('jshtml.js', function() {
  var testJsHtml = fs.readFileSync('tests/test.jshtml', 'utf8');
  var testHtml = fs.readFileSync('tests/test.html', 'utf8');
  var testTokens = JSON.parse(fs.readFileSync('tests/test.tokens.json', 'utf8'));
  var state = { one: 'one', foo: 'baz' };

  Test.test('JsHtml.parse', function(done) {
    var tokens = JsHtml.parse(testJsHtml);
    Test.assert(JSON.stringify(tokens) == JSON.stringify(testTokens));

    done();
  });

  Test.test('JsHtml.compile', function(done) {
    var compiled = JsHtml.compile(testJsHtml);
    // wrap it in a module and eval it, now we should be able to require test.js to get a view function
    eval(Require.wrapModule('test.js', compiled));
    var view = Require.require('test.js');
    Test.assert(typeof view == 'function');

    var output = view(state);
    Test.assert(output == testHtml);

    done();
  });
});
