var Test = require('../lib/test.js');
var Require = require('../lib/require.js');

Test.file('require.js', function() {
  var func = function() { funcCalled = true };
  var testExports = { foo: 'bar' };

  var module = function(module, exports, require) {
    module.exports = testExports;
  }

  var modRequire = function(module, exports, require) {
    module.exports = require('foo.js');
  }

  // 
  // Path utilities
  //

  Test.test('Path.extension should return the file extension of a file path', function(done) {
    Test.assert(Require.Path.extension('foo/bar/test.js') == 'js');

    done();
  });

  Test.test('Path.resolve should resolve all ".."s and "."s in a path given a root path', function(done) {
    Test.assert(Require.Path.resolve('1/2/3', 'foo/../bar/./baz') == '1/2/3/bar/baz');

    done();
  });

  // 
  // Module definition and loading
  //

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
});
