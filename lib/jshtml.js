var Str = require('./string.js');

var JsHtml = module.exports = {};

JsHtml.blocks = [
  { start: '<%', end: '%>', type: 'js' },
  { start: '{{', end: '}}', type: 'jsString' }
];

JsHtml.parse = function(string) {
  // helper to clean up the body of the loop
  var pushToken = function(type, start, end) { 
    tokens.push({ type: type, value: string.substring(start, end) });
  }

  var index = 0, stringStart = 0, tokens = [], block, endIndex, blockString, stringBlockString;
  // loop through each character in the string
  while(index < string.length) {
    // loop through each block and check to see if the current index matches the block start string
    for(var b = 0; b < JsHtml.blocks.length; b++) {
      block = JsHtml.blocks[b];
      if(Str.startsWith(string, block.start, index)) {
        // we also need to keep track of the text between blocks and turn those into "string" tokens
        pushToken('string', stringStart, index);
        // so we know that the current block starts at index, let's see where it ends
        endIndex = string.indexOf(block.end, index);
        // the end of a block is the start of a string token
        stringStart = endIndex + block.end.length;
        // push a token using the content inside the block
        pushToken(block.type, index + block.start.length, endIndex);
        // skip the block content when we check for the next token
        index = endIndex + block.end.length;

        // break out of the for loop -- only one block can match at a time
        break;
      }
    }
    // we will only get to this point if we havn't matched a block, so increment the index
    index += 1;
  }

  // add the final string block
  pushToken('string', stringStart, index);

  return tokens;
}

// compilers are functions that turn a block into a string
JsHtml.compilers = {
  js: function(block) {
    return block + '\n';
  },
  jsString: function(block) {
    return '_$output += ' + block + ';\n';
  },
  string: function(block) {
    // cool, you can use JSON.stringify to escape strings :)
    return '_$output += ' + JSON.stringify(block) + ';\n';
  }
}

JsHtml.compile = function(string) {
  // It's time to get meta! We need to turn the list of tokens into a valid (and ideally readable)
  // Javascript string. The code we are compiling needs to be a function that takes a single object
  // (the model / state) and returns an HTML string.
  var tokens = JsHtml.parse(string);

  // let's start with the header
  var compiled = 'module.exports = function(state) {\n';
  // we use an obfuscated variable for the string, so we don't accidentally overwrite it in the compiled code
  compiled += '  var _$output = "";\n';

  // loop through the blocks and look up each block's compiler, then use it to build the next chunk of code
  var compiler, token;
  for(var i = 0; i < tokens.length; i++) {
    token = tokens[i];
    compiler = JsHtml.compilers[token.type];
    compiled += Str.indent(compiler(token.value));
  }

  // add the footer
  compiled += '  return _$output;\n}\n';

  return compiled;
}
