var Test = module.exports = {};

var AssertError = Test.AssertError = function(value) {
  Error.call(this);

  this.message = 'Assertion failed: ' + value
  this.stack = (new Error()).stack.split('\n').slice(3).join('\n');
}

AssertError.prototype = Object.create(Error);

Test.files = [];

Test.file = function(name, body) {
  Test.files.push({ name: name, body: body });
}

Test.assert = function(value) {
  if(!value) throw new AssertError(value);
}

Test.run = function() {
  Test.files.forEach(Test.runFile);
}

Test.runFile = function(file) {
  Test.logHeader(file.name);
  file.body();
}

Test.test = function(name, body) {
  Test.log(name);
  try {
    body(Test.done);
  } catch(err) {
    Test.logError(err);
  }
}

Test.done = function(err) {
  if(err) Test.logError(err);
  Test.logItem('passed');
}

Test.log = function() {
  [].forEach.call(arguments, function(arg) {
    console.log(arg);
  });
}

Test.logHeader = function(header, lineChar) {
  lineChar = lineChar || '-';
  var line = [].map.call(header, ''.toString.bind(lineChar)).join('');
  console.log(header + '\n' + line);
}

Test.logItem = function() {
  [].forEach.call(arguments, function(arg) {
    console.log('- ' + arg);
  });
}

Test.logError = function(err) {
  if(!err.message) return Test.logItem(err + '\n');
  Test.logItem(err.message + '\n' + err.stack + '\n');
}
