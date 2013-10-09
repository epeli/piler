var codeFrom, removeTrailingComma, types;

// Remove last comma from string
removeTrailingComma = function(s) {
  return s.trim().replace(/,$/, "");
};

// Map of functions that can convert various Javascript objects to strings.
types = {
  "function": function(fn) {
    return "" + fn;
  },
  string: function(s) {
    return JSON.stringify(s);
  },
  number: function(n) {
    return n.toString();
  },
  boolean: function(n) {
    return n.toString();
  },
  object: function(obj) {
    var code, k, v;
	// typeof reports array as object
    if (Array.isArray(obj)) {
      return this._array(obj);
    }
    code = "{";
    for (k in obj) {
      v = obj[k];
      code += "\"" + k + "\": " + (codeFrom(v)) + ",";
    }
    return removeTrailingComma(code) + "}";
  },
  _array: function(array) {
    var code, v, _i, _len;
    code = "[";
    for (_i = 0, _len = array.length; _i < _len; _i++) {
      v = array[_i];
      code += " " + (codeFrom(v)) + ",";
    }
    return removeTrailingComma(code) + "]";
  }
};

// Generates code string from given object. Works for numbers, strings, regexes
// and even functions. Does not handle circular references.
exports.stringify = codeFrom = function(obj) {
  var _name;
  return typeof types[_name = typeof obj] === "function" ? types[_name](obj) : void 0;
};

if (require.main === module) {
  console.log(exports.stringify({
    foo: 1,
    bar: {
      lol: ":D",
      hah: 2
    }
  }));
}
