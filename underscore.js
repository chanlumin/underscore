(function() {

  var root = typeof self === 'object' && self.self === self && self ||
  typeof global === 'object' && global === global && global ||
  this ||
  {}

  // 保存原来的_对象 用于后面处理冲突
  var previousUnderscore = root._

  // 便于压缩代码
  var ArrayProto = Array.prototype, ObjProto = Object.prototype, FuncProto = Function.prototype

  var
  lice = ArrayProto.slice,
  push = ArrayProto.push,
  toString = ArrayProto.toString,
  hasOwnProperty = ObjProto.hasOwnProperty

  var
  nativeIsArray = Array.isArray,
  nativeKeys = Object.keys,
  nativeBind = FuncProto.bind,
  nativeCreate = Object.create;

  // 无new实例化
  var _ = function(obj) {
    if(obj instanceof _) return obj
    if(!(this instanceof _)) return new _(obj)
    this._wrapped = obj
  }


  if(typeof module != 'undefined' && module.exports != 'undefined') {
    module.exports = _
  } else {
    root._ = _
  }

  // 静态api
  /**
   * 空函数 用来减少填充接口时 多次使用空函数的时候的开销
   */
  _.noop = function () {}
  
  _.random = function (min, max) {
    // 处理整数
    min = Math.floor(min)
    max = Math.floor(max)

    // 处理只有一个参数的问题
    if(max === null) {
      max = min
      min = 0
    } else if(min > max) { // 处理min和max传递相反的问题
      var temp = min
      min = max
      max = min
    }

    return  min + Math.floor(Math.random() * (max - min + 1))
  }

  // 实例方法
  _.prototype.value = function () {
    return this._wrapped
  }

  _.prototype.valueOf = _.prototype.toJSON = _.prototype.value

  _.prototype.toString = function () {
    return '' + this._wrapped
  }

  // 对amd 支持
  if(typeof define === 'function' && defined.amd) {
    define('underscore',[], function () {
      return _
    })
  }

})()