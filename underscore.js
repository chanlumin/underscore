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
  slice = ArrayProto.slice,
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

  // 回调函数
  var optimizeCb = function (func, context, argCount) {
    if(context == void 0) return func

    switch (argCount == null ? 3 : argCount) {
      case 1 : return function(value) {
        return func.call(context, value)
      }
      case 2 : return function (value, other) {
        return func.call(context, value, other)
      }
      case 3 : return function (value, index, collection) {
        return func.call(context, value, index, collection)
      }
      case 4 : return function(accumulator, value, index, collection) {
        return func.call(context, accumulator, value, index, collection)
      }
    }

    // 过多参数的话直接利用arguments 来绑定context
    return function() {
      func.apply(context, arguments)
    }
  }

  /**
   *  进一步优化回调函数
   * @param value
   * @param context
   * @param argCount
   */
  var cb = function (value, context, argCount) {
    // 1 如果value 为空 返回value
    if(value == null) return _.identity // cb(value) {return value}
    if(_.isFunction(value)) return optimizeCb(value, context, argCount)
    if(_.isObject(value)) return _.matcher(value)
    return property(value)
  }
  _.cb = function (value, context, argCount) {
    // 1 如果value 为空 返回value
    if (value == null) return _.identity // cb(value) {return value}
    if (_.isFunction(value)) return optimizeCb(value, context, argCount)
    if (_.isObject(value)) return _.matcher(value)
    return property(value)
  }
  _.iteratee = function (value, context, argCount) {
    return _.cb(value, context, argCount)
  }


  /**
   * attr传入的 对象
   * @type {matches}
   */
  _.matcher = _.matches = function (attrs) {
    // 复制 attrs自己的属性
    attrs = _.extendOwn({}, attrs)
    // 2 obj是否含有某attrs 属性值
    return function (obj) {
      return _.isMatch(obj, attrs)
    }

  }

  // 函数调用
  /**
   * obj 对象或者数组
   * iteratee 回调函数
   * context 想要绑定的上下文
   * @type {forEach}
   */
  _.each = _.forEach = function (obj, iteratee,  context) {
    // 1 如果回调函数是空的话 返回自身
    // 否则的话返回的是固定的三个参数 (argCount=3的时候)
    iteratee = optimizeCb(iteratee, context) // 默认argCount是3=> iteratee(value, index, collection) || iteratee  => 取决于context
    if(_.isArrayLike(obj)) {
      var length, index
      for(index = 0,length = obj.length; index < length; index++) {
        iteratee(obj[index], index, obj) // 执行回调函数
        console.log('arr')
      }
    } else if(_.isObject(obj)) {
      var keys = _.keys(obj)
      for(index = 0,length = keys.length; index < length; index++) {
        iteratee(obj[keys[index]],keys[index],obj)
        console.log('obj')
      }
    }

    // 此处就是为了上下文的调用
    return obj
  }

  // 返回获得属性的闭包
  var property = function (key) {
    return function (obj) {
      return obj == null ?  void 0 :  obj[key]
    }
  }

  var getLength = property('length')


  /**
   * 遍历对象或者数组 执行回调函数 返回执行后的结果
   * obj 对象或者数组
   * iteratee 回调函数
   * context 上下文环境 传入函数自动为你绑定上下文
   * @type {collect}
   */
  _.map = _.collect = function (obj, iteratee, context) {
    iteratee = cb(iteratee, context) // cb只需要传入回调函数和context

    // 一定是数组的键
    var keys = !_.isArrayLike(obj) && _.keys(obj)
    var length = (keys || obj).length // 数组或者obj
    var results = Array(length)

    for(index = 0; index < length; index++) {
      // 直接判断keys的存在与否
      // key = !_.isArrayLike(obj) ? keys[index] : index
      var currentKey = keys ? keys[index] : index
      console.log(currentKey)
      // 因为是数组所以要用index 而不是currentKey currentKeys可能是对象的key
      results[index] = iteratee(obj[currentKey], currentKey, context)
    }

    return results
  }

  /**
   * base累加操作
   * @param dir 向左累加还是向右累加
   */
  function createReduce(dir) {



    /**
     * 迭代的核心
     * @param obj 传递进去的对象
     * @param memo accumulator 累加器
     * @param keys 对象或者数组的键
     * @param length 键的长度
     * @param index iterator的索引
     */
    function iterator(obj, iteratee, memo, keys, length, index) {
      // index > 0 && index < length index 一定是在这个区间范围的
      for(; index >=0 && index < length; index+=dir) {
        var key = keys ? keys[index] : index // keys 可能是对象

        memo = iteratee(memo, obj[key], key, obj)
        console.log(key, memo)

      }

      console.log(memo)
      return memo
    }


    /**
     * obj  传递进去的参数
     * iteratee 回调函数
     * momo 累加变量 accumulator
     * context 上下文执行变量
     */
    return function (obj, iteratee, memo, context) {

      // 1 初始化工作
      iteratee = iteratee && optimizeCb(iteratee, context, 4) // 固定四个参数 => iteratee(accumulator, obj[key],key, obj]
      if(iteratee == null) {
        return obj
      }

      var keys = !_.isArrayLike(obj) && _.keys(obj), // 不是类数组就获取兑现固定的keys
         // length = (keys ?  keys : obj).length, //  或者 keys ? keys.length : obj.length
          length = (keys || obj).length, //  或者 keys ? keys.length : obj.length
          index = dir > 0 ? 0 : length - 1
      // 2 memo 是否有传入
      if(arguments.length < 3) {
        memo = obj[keys ? keys[index] : index] // 因为有可能是对象 所以要判断 而不是直接使用index
        index += dir // 第一次累加 index 向左或者向右进位移一个位置
      }

      // 返回一个iterator iterator最终返回一个memo值(累加的值)
      return iterator(obj, iteratee, memo, keys, length, index)

    }
  }


  _.reduce = _.foldl = _.inject = createReduce(1)

  _.reduceRight = _.foldr = createReduce(-1)


  /**
   * dir 为在+1 或者 -1 寻找可以从左边找 或者从右边找出 他的索引
   * @param dir
   */
  function createPredicateIndexFinder(dir) {
    /**
     * array数组
     * predicate 回调函数
     * context 执行环境上下文
     */
    return function (array, predicate, context) {
      // 1 初始化参数
      // 如果predicate这个参数是对象的话   predicate(obj) 最后返回的是这个参数 predicate这个对象已经作为第二个参数传递进去了
      predicate = cb(predicate, context) // 默认三个 参数=> predicate(value, index, collection)

      var length = getLength(array) // array.length 有可能没法获取
      var index = dir > 0 ? 0 : length - 1

      // 遍历 返回 index下标
      for(; index >= 0 && index < length; index+= dir) {
        /**
         *  predicate传入一个obj => array[index]
         */
        if(predicate(array[index], index, array)) {
          return index
        }
      }
      //  如果没有找到的话 就直接返回-1
      return -1
    }

  }

  _.findIndex = createPredicateIndexFinder(1)

  _.findLastIndex = createPredicateIndexFinder(-1)

  /**
   * 找obj中最大的数
   * @param obj
   * @param iteratee
   * @param context
   */
  _.max = function (obj, iteratee, context) {
    var result = -Infinity, computed = -Infinity, lastComputed = -Infinity, value = -Infinity

    // 1. 分两种情况 当没有回调函数的时候 遍历产找最大值
    if(iteratee == null && obj != null) {
      // 1 判断obj是数组还是对象
      obj = _.isArrayLike(obj) ? obj : _.values(obj) // _.values获取对象的值返回一个数组
      for(var i = 0,length = obj.length; i < length; i++) {
        value = obj[i]
        if(result < value) {
          result = value
        }
      }
    } else {
      // 2. 有回调函数的话
      // 优化回调函数 => iteratee(value, index,obj) 固定三个参数
      iteratee = cb(iteratee, context)

      // function(stooge){ return stooge.age;}
      _.each(obj, function (value, index, obj) {
        computed = iteratee(value, index, obj)
        if(lastComputed < computed || computed == -Infinity && result == -Infinity) {
          // 备注 result 应该等于value 而不是经过计算的value
          result = value
          lastComputed = computed
        }
      })
    }
    return result
  }

  /**
   * 需要注意的是 n == null || guard  ?  1 : n 执行顺序其实是 (n == null || guard) ? 1 : n
   * 而且是要删除的所以要用减的
   * @param array
   * @param n 去掉数组后面n个数字
   * @param guard 哨兵变量
   */
  _.initial = function (array, n, guard) {
    return slice.call(array,0, array.length - Math.max(n==null || guard ? 1 : n))
  }

  /**
   * 返回第一个元素 如果传入n的话 那么就返回第0到n个元素 也就是剔除array.length - n 个元素
   * @param array
   * @param n
   * @param guard
   */
  _.first = _.head = _.take = function (array, n, guard) {
    // 1 初始化
    if(array == null) {
      return void 0
    }
    // 2 n有传入就为n 否则就是1
    // if(n == null || guard) return array[0]
    n = (n == null || guard ? 1 : n)


    // 3 截取 0到 array.length - n 就是返回0到n到这个长度
    return _.initial(array, array.length - n)
  }

  /**
   * 删除前面n 个元素返回后面 array.length - n
   * @param array
   * @param n
   * @param guard
   * @returns {*}
   */
  _.rest = function (array, n, guard) {
    return slice.call(array, n == null || guard ? 1 : n)
  }

  /**
   *  返回最后一个元素 或者返回最后n个元素
   * @param array
   * @param n
   * @param guard
   */
  _.last = function (array, n, guard) {
    if(array == null) {
      return void 0
    }

    if(n == null || guard) {
      return array[array.length - 1]
    }
    // 去除 array.length - n 个元素 返回后面n个元素
    return _.rest(array,Math.max(0, array.length - n))
  }

  /**
   * 过滤不满足predicate条件的元素
   * 发挥一个数组的值
   * 或者返回对象的的value值
   * @type {select}
   */
  _.filter = _.select = function (obj, predicate, context) {
    // 优化回调函数
    predicate = cb(predicate, context)
    var results = []
    _.each(obj, function (value, index, obj) {
      if(predicate(value, index, obj)) {
        results.push(value)
      }
    })

    return results
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