// 
// require.js
// ==========
//

var Require = module.exports = {};

// 
// path utilities
//

var Path = Require.Path = {};

Path.extension = function(path) {
  var index = path.lastIndexOf('.');
  if(index == -1) return '';
  return path.substring(index + 1);
}

Path.isFile = function(path) {
  return Path.extension(path) != '';
}

Path.dirname = function(path) {
  return path.split('/').slice(0, -1).join('/');
}

Path.resolve = function(root, path) {
  var resolve = function(curPath, components) {
    if(!components.length) return curPath.filter(function(p) { return p != '' });

    var comp = components[0], comps = components.slice(1);
    if(comp == '..') return resolve(curPath.slice(0, -1), comps);
    if(comp == '.') return resolve(curPath, comps);
    return resolve(curPath.concat(comp), comps);
  }

  return resolve(root.split('/'), path.split('/')).join('/');
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
