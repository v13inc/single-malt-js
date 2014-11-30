var Test = require('../lib/test.js');
var Str = require('../lib/string.js');

Test.file('string.js', function() {
  Test.test('Str.startsWith(string, search) should return true if string starts with search.', function(done) {
    Test.assert(Str.startsWith('foobar', 'foo') == true);
    Test.assert(Str.startsWith('foobar', 'foo2') == false);
    Test.assert(Str.startsWith('foobar', 'bar') == false);
    Test.assert(Str.startsWith('foobar', 'bar', 3) == true);

    done();
  });
});
