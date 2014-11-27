var Test = require('../lib/test.js');

Test.define('require.js', function(done) {
  console.log('test!');
  Test.assert('1 == 1');
  Test.assert('2 == 1');
  done();
});
