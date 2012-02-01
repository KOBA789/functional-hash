module.exports = (function () {
  function FnHash () {
    this._hashList = [{}];
  }
  
  FnHash.prototype.add = function (key, value) {
    switch (typeof key) {
    case 'string':
    case 'number':
    case 'boolean':
      this._addPrimitive(key, value);
      break;

    case 'function':
      this._addFunc(key, value);
      break;

    case 'object':
      if (key instanceof RegExp) {
        this._addRegexp(key, value);
        break;
      }
      
    default:
      throw new Error('illigal key type.');
    }
  };
  
  Array.prototype.last = function () {
    return this[this.length - 1];
  };

  FnHash.prototype._addPrimitive = function (key, value) {
    var isLastItemArray = this._hashList.last() instanceof Array;
    if (isLastItemArray) {
      var obj = {};
      obj[key] = value;
      this._hashList.push(obj);
    } else {
      this._hashList.last()[key] = value;
    }
  };

  FnHash.prototype._addFunc = function (func, value) {
    this._hashList.push([func, value]);
  };

  FnHash.prototype._addRegexp = function (regexp, value) {
    this._addFunc(function (target) {
      var result = regexp.exec(target);
      return result === null ? undefined : result;
    }, value);
  };

  FnHash.prototype.get = function (exKey) {
    var value = undefined;
    var result = undefined;
    for (var i = 0; i < this._hashList.length; i ++) {
      var item = this._hashList[i];
      // pattern are 'Object' or 'Array'
      if (item instanceof Array) {
        var itemKey = item[0];
        var itemValue = item[1];
        result = item[0](exKey);
        if (result !== undefined) {
          value = itemValue;
        }
      } else {
        value = item[exKey];
      }
      if (value !== undefined) {
        break;
      }
    }
    return this._getEvaluatedValue(value, exKey, result);
  };

  FnHash.prototype._getEvaluatedValue = function (value, input, result) {
    if (typeof value === 'function') {
      return value(input, result);
    } else {
      return value;
    }
  };

  return FnHash;
})();
