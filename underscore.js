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

  // 返回当前的事件戳
  _.now = Date.now || function () {
    return new Date().time()
  }

  var idCounter = 0
  // 返回dom id
  _.uniqueId = function (prefix) {
    var id = idCounter++ + ''
    return prefix ? prefix + id : id
  }

  // 返回自身的函数
  _.identity = function (value) {
    return value
  }
  
  _.constant = function (value) {
    return function () {
      return value
    }
  }

  // 基本类型判断
  _.isUndefined = function (obj) {
    return obj === void 0
  }

  // 是否是null
  _.isNull = function (obj) {
    return obj === null // 三等号 即使obj = undefinded 也是返回false
  }

  // 是否是数组对象
  _.isArray = nativeIsArray || function (obj) {
    return toString.call(obj) === '[object Array]'
  }
  // 是否是Boolean类型

  // new Boolean() == false => true || new Boolean() === false => false => toString(true) = '[object Boolean]'
  _.isBoolean = function (obj) {
    return obj === true || obj === false || toString.call(obj) === '[object Boolean]'
  }
  // 是否是数值对象
  _.isNumber = function (obj) {
    return toString.call(obj) === '[object Number]'
  }
  // 是否是函数内置的Arguments
  _.isArguments = function (obj) {
    return toString.call(obj) === '[object Arguments]'
  }

  // 是否是函数
  _.isFunction = function (obj) {
    return toString.call(obj) === '[object Function]'
  }

  // 是否是String对象
  _.isString = function (obj) {
    return toString.call(obj) === '[object String]'
  }
  // 是否是日期对象
  _.isDate = function (obj) {
    return toString.call(obj) === '[object Date]'
  }
  // 是否是正则表达式
  _.isRegExp = function (obj) {
    return toString.call(obj) === '[object RegExp]'
  }
  // 是否是错误的表达式
  _.isError =function (obj) {
    return toString.call(obj) === '[object Error]'
  }
  // 是否是有限的数值
  _.isFinite = function (obj) {
    // is not a number // ??? 第二个判断是为什么呢?
    return isFinite(obj) && !isNaN(parseFloat(obj))
  }

  // 是否是对象类型
  _.isObject = function (obj) {
    var type = typeof obj
    return type === 'function' || type === 'object' && !!obj
  }

  // 是否是dom对象
  _.isElement = function (obj) {
    // return !!(obj && obj.nodeType === 1)
    // return obj instanceof Element
    // 所有的Dom元素都是继承Element的
    return !!(obj && obj.nodeType ===1 && obj instanceof Element)
  }

  //
  _.has = function (obj, key) {
    return obj != null && hasOwnProperty.call(obj, key)
  }


  // 处理全局变量的冲突 可能 root._ 已经被占用了=> 给underscore重新起名字
  _.noConflict = function () {
    root._ = previousUnderscore
    return this
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