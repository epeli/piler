'use strict';
var codeFrom, debug, removeTrailingComma, types;

debug = require("debug")("piler:serialize");

removeTrailingComma = function(s) {
  return s.trim().replace(/,$/, "");
};

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
    if (Array.isArray(obj)) {
      return this._array(obj);
    }
    code = "{";
    for (k in obj) {
      v = obj[k];
      code += "\"" + k + "\": " + (codeFrom(v)) + ",";
    }
    return "" + (removeTrailingComma(code)) + " }";
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

exports.stringify = codeFrom = function(obj) {
  var _name;
  return typeof types[_name = typeof obj] === "function" ? types[_name](obj) : void 0;
};