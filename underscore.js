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

  //  用来创建对象
  var Ctor = function () {}

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
  
  //  判断一个对象属性是否在另一个对象属性中
  _.isMatch = function (obj, attrs) {
    // 因为要对比obj[key] 和 attrs[key] keys只需获取一次
    var keys = _.keys(attrs)
    var length = keys.length
    //
    var obj = Object(obj)

    // 判空 注意 是用length取反来返回结果
    if(obj == null) {
      return !length
    }
    for(var i = 0; i < length; i++) {
      var key = keys[i]
      // 第二个判断条件是 {a: 'hello'} {b: void 0}
      if(obj[key] != attrs[key] || !(key in obj)) {
        return false
      }
    }
    return true
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

  // 是否有对应的属性
  _.has = function (obj, key) {
    return obj != null && hasOwnProperty.call(obj, key)
  }
  
  // 判断是否是类数组
  var MAX_ARRAY_INDEX = Math.pow(2,53) - 1
  _.isArrayLike = function (collection) {
    var length = collection !=null && collection.length
    return typeof length == 'number' && length >=0 && length <= MAX_ARRAY_INDEX
  }

  _.keys = function (obj) {
    // 1. obj不是对象
    if(!_.isObject(obj)) return []

    // 2. 存在Object.keys
    if(nativeKeys) return nativeKeys(obj)

    // 3. 不存在Object.keys就遍历obj的keys 并保存
    var keys = []
    for(var key in obj) {
      // 新加入的键值对也会被遍历出来 所以需要进行判断
      if(_.has(obj, key)) {
        keys.push(key)
      }
    }
    return keys
  }
  // 把所有的键都都取出来 包括新添加的键
  _.allKeys = function (obj) {
    if(!_.isObject(obj)) return []

    var keys = []

    for(var key in obj) {
      keys.push(key)
    }
    return keys
  }


  // 拿到对象的所有值 返回一个数组
  _.values = function (obj) {
    var keys = _.keys(obj)
    var length = keys.length
    var values = Array(length)

    // 直接遍历
    for(var i = 0; i < length; i++) {
      values[i] = obj[keys[i]]
    }

    return values
  }
  // 把对象的key value 转成 [key, obj[key]] 返回数组
  _.pairs = function (obj) {
    var keys = _.keys(obj)
    var length = keys.length
    var pairs = Array(length)

    for(var i = 0; i <length; i++) {
      pairs[i] = [keys[i], obj[keys[i]]]
    }

    return pairs
  }
  // 反转对象的键值 返回一个新对象
  _.invert = function (obj) {
    var keys = _.keys(obj)
    var length = keys.length
    var invert = {}

    for(var i = 0; i < length; i++) {
      invert[obj[keys[i]]] = keys[i]
    }

    return invert
  }

  // 获取对象所有的方法名称
  _.functions = _.methods = function (obj) {

    var names = []

    // for in 可以遍历所有的属性 包括已经加入进去的属性
    for(var key in obj) {
      if(_.isFunction(obj[key])) {
        names.push(key)
      }
    }

    return names.sort()
  }
  // 拦截对象 执行函数操作 interceptor是一个函数
  //   http://www.css88.com/doc/underscore/#tap .tap(alert)
  _.tap = function (obj, interceptor) {
    interceptor(obj)
    return obj
  }

  // 判断对象是否没有可以枚举的属性 没有返回 true
  _.isEmpty = function (obj) {
    // 1 是undefined 和 null
    if(obj == null) return true

    if(_.isArrayLike(obj) && _.isArray(obj) || _.isString(obj) || _.isArguments(obj)) {
      return obj.length === 0
    }
    return _.keys(obj).length === 0
  }


  // createAssinger
  var createAssigner = function (keysFunc, undefinedOnly) {
    return function (obj) {
      var length = arguments.length

      // obj 为空也要返回
      if(length < 2 || obj == null) return obj

      for(var index = 1; index < length; index++) {
        // 取出src对象
        var source = arguments[index],
          keys = keysFunc(source),
          l = keys.length

        for (var i = 0; i < l; i++) {
          var key = keys[i]

          if (!undefinedOnly || obj[key] === void 0) {
            obj[key] = source[key]
          }
        }

      }
      return obj
    }
  }
  // 把所有的属性拷贝覆盖到传递进去的第一个对象中
  _.extend = createAssigner(_.allKeys) // 返回的是一个 function extend(obj)

  // 把所有的对象属性都覆盖到一个对象中去 只拷贝自己拥有的属性
  _.extendOwn = _.assign = createAssigner(_.keys)

  // 把所有的对象属性都覆盖到第一个对象中值为undefined的键值对中
  _.default  = createAssigner(_.allKeys, true)

  _.baseCreate = function (prototype) {

    // 1 参数判断
    if(!_.isObject(prototype)) return {}

    // 2 存在原生的Object.create 直接调用
    if(nativeCreate) return nativeCreate(prototype)

    // 3 利用Ctor 这个空函数 创建对象
    Ctor.prototype = prototype
    var result = new Ctor

    // 4 复用
    Ctor.prototype = null
    return result

  }

  // 模拟Object.create
  _.create = function (prototype, props) {
    var result = _.baseCreate(prototype)
    if(props) {
      _.extendOwn(result, props)
    }
    return result
  }

  // 对象的浅拷贝
  _.clone = function (obj) {
    // 不是对象的话 返回原来对象
    if(!_.isObject(obj)) return obj

    return _.isArray(obj) ? obj.slice() : _.extend({}, obj)
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