var Test = require('../lib/test.js');
var Require = require('../boot/require.js');

Test.file('require.js', function() {
  var func = function() { funcCalled = true };
  var testExports = { foo: 'bar' };

  var module = function(module, exports, require) {
    module.exports = testExports;
  }

  var modRequire = function(module, exports, require) {
    module.exports = require('foo.js');
  }

  Test.test('Require.define should add a module to Require.modules', function(done) {
    Require.define('func.js', func);
    Test.assert(Require.modules['func.js'] === func);

    done();
  });

  Test.test('Require.require should return module.exports given a path', function(done) {
    Require.define('module.js', module);
    Test.assert(Require.require('module.js') === testExports);

    done();
  });

  Test.test('Require.require should resolve module paths', function(done) {
    Require.define('foo/bar/baz.js', module);
    Test.assert(Require.require('foo/./bar/../bar/baz.js') === testExports);

    done();
  });

  Test.test('Require.require should append index.js to folder paths', function(done) {
    Require.define('foo/bar/index.js', module);
    Test.assert(Require.require('foo/bar') === testExports);
    Test.assert(Require.require('foo/bar/') === testExports);

    done();
  });

  Test.test('Modules should have a require function that resolves from its root', function(done) {
    Require.define('foo/module.js', modRequire);
    Require.define('foo/foo.js', module);
    Test.assert(Require.require('foo/module.js') === testExports);

    done();
  });

  Test.test('Require.wrapModule should wrap a require header around a function or string', function(done) {
    var body = 'module.exports = "foo"';
    var wrapped = Require.wrapModule('wrap.js', body); 
    Test.assert(wrapped.indexOf("Require.define('wrap.js'") != -1);
    Test.assert(wrapped.indexOf(body) != -1);
    // run the Require.define(...)
    eval(wrapped);
    Test.assert(Require.require('wrap.js') == 'foo');

    done();
  });
});
