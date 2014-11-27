var Test = module.exports = {};

var AssertError = Test.AssertError = function(evalString, result) {
  this.name = evalString + ' failed (result: ' + result + ')';
  this.result = result;
}

AssertError.prototype = Object.create(Error);

Test.tests = [];

Test.assert = function(evalString) {
  var result = eval(evalString);
  if(!result) throw new AssertError(evalString, result);

  console.log('- ' + evalString + ': ' + result);
}

Test.define = function(name, body) {
  Test.tests.push({ name: name, body: body });
}

Test.run = function() {
  console.log('Running tests...');
  Test.tests.forEach(Test.runTest);
}

Test.runTest = function(test) {
  console.log(test.name + ':');
  try {
    test.body(Test.done);
  } catch(err) {
    Test.logError(err);
  }
}

Test.done = function(err) {
  if(err) return Test.logError(err);
  Test.logPassed();
}

Test.logPassed = function() {
  console.log('- passed\n');
}

Test.logError = function(err) {
  console.log('- failed!');
  if(!err.name) return console.log(err + '\n');
  console.log(err.name + '\n' + err.stack + '\n');
}
