// 
// bootstrap.js
// 

Require.define('path.js', function(module, exports, require) {
  module.exports = Path;
});

Require.define('require.js', function(module, exports, require) {
  module.exports = Require;
});

window.require = Require.require;
