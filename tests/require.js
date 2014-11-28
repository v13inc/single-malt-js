var Test = require('../lib/test.js');
var Require = require('../lib/require.js');

Test.file('require.js', function() {
  var funcCalled = false;
  var func = function() { funcCalled = true };

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

  Test.test('Require.require should return a module given a path', function(done) {
    Test.assert(Require.require('func.js') === func);

    done();
  });

  Test.test('Require.require should resolve module paths', function(done) {
    Require.define('foo/bar/baz.js', func);
    Test.assert(Require.require('foo/./bar/../bar/baz.js') === func);

    done();
  });

  Test.test('Require.require should append index.js to folder paths', function(done) {
    Require.define('foo/bar/index.js', func);
    Test.assert(Require.require('foo/bar') === func);
    Test.assert(Require.require('foo/bar/') === func);

    done();
  });
});
