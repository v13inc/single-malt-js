// 
// require.js
//

var Require = {};

// naturally, Require.define isn't available, so we either require it (node.js)
// or assume it has already been defined (the build script will make sure path.js
// is concatted before require.js)
if(typeof module != 'undefined') {
  var Path = require('./path.js');
  module.exports = Require;
}


Require.root = '';
Require.modules = {};

// body: function(module, exports, require)
Require.define = function(path, body) {
  Require.modules[path] = body;
}

Require.require = function(root, path) {
  if(!path) path = root, root = Require.root;

  var modulePath = Path.resolve(root, path);
  if(!Path.isFile(modulePath)) modulePath += '/index.js';
  var module = Require.modules[modulePath];

  if(!module) return;
  if(!module.module) return Require.runModule(module, modulePath);
  return module.module.exports;
}

Require.runModule = function(moduleFunc, path) {
  var require = Require.require.bind(null, Path.dirname(path));
  var module = moduleFunc.module = { exports: {} };
  var exports = moduleFunc(module, module.exports, require);

  return module.exports;
}

Require.wrapModule = function(path, body) {
  var func = 'function(module, exports, require) {\n' + body.toString() + '\n}'
  var module = "Require.define('" + path + "', " + func + "); // " + path + "\n";

  return module;
}
