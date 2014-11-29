var Test = require('../lib/test.js');
var Path = require('../boot/path.js');

Test.file('path.js', function() {
  Test.test('Path.extension should return the file extension of a file path', function(done) {
    Test.assert(Path.extension('foo/bar/test.js') == 'js');

    done();
  });

  Test.test('Path.resolve should resolve all ".."s and "."s in a path given a root path', function(done) {
    Test.assert(Path.resolve('1/2/3', 'foo/../bar/./baz') == '1/2/3/bar/baz');

    done();
  });
});
