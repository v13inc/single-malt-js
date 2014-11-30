// 
// string.js
//
// Varous string helpers.
//

var Str = module.exports = {};

Str.startsWith = function(string, substr, startIndex) {
  if(!startIndex) startIndex = 0;
  // don't use indexOf, since we are only looking for the first position
  for(var i = 0; i < substr.length; i++) {
    if(string[i + startIndex] != substr[i]) return false;
  }
  return true;
}

Str.indent = function(string, margin) {
  if(!margin) margin = '  '; // 2 spaces or DIE
  var addMargin = function(line) { return line ? margin + line : line };
  return string.split('\n').map(addMargin).join('\n');
}
