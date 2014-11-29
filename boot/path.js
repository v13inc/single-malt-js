// 
// path utilities
//

var Path = {};
// make sure we export Path if this file is being run as a module
if(typeof module != 'undefined') module.exports = Path;

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

