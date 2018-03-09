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
  toString = ObjProto.toString,
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

    // 处理只有一个参数的问题
    if(max == null) {
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

  /**
   *  返回一个对象的副本 挑选出他选择的属性值
   * @param obj
   * @param iteratee
   * @param context
   */
   /*
  _.pick({name: 'moe', age: 50, userid: 'moe1'}, 'name', 'age');
  => {name: 'moe', age: 50}
  _.pick({name: 'moe', age: 50, userid: 'moe1'}, ['name', 'age']);
  => {name: 'moe', age: 50}
  _.pick({name: 'moe', age: 50, userid: 'moe1'}, function(value, key, object) {
    return _.isNumber(value);
  });
  => {age: 50}
  */
  _.pick = function (object, oiteratee, context) {
    var result = {}, obj = object, keys,iteratee

    if(obj == null) return result

    // 1 如果有第二个函数的话 那么keys从object中去获取 因为第二个参数不是传递keys
    if(_.isFunction(oiteratee)) {
      keys = _.allKeys(obj)
      iteratee = cb(oiteratee, context)
    } else {
      // 2 如果第二个参数是数组的话 从位置1开始展开这些数组
      keys = _.flatten(arguments, false,false, 1) //
      iteratee = function (value, key, obj) { return key in obj }
      // >
      obj = Object(obj)
    }

    for(var i = 0,length = keys.length; i < length; i++) {
      // 3 对每一个keys进行判断 如果符合iteratee这个函数的话就result这个对象添加一个key value值
      var key = keys[i]
      var value = obj[key]

      if(iteratee(value, key, obj)) {
        result[key] = value
      }
    }
    return result
  }

  /**
   * 返回一个方法的对立方法
   * @param predicate
   */
  _.negate = function (predicate) {
    return function () {
      // 1 不用传递参数 参数传递靠arguments
      return !predicate.apply(this, arguments)
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

  // 提供一个对象返回一个函数 只需要传入属性的值就可以获取对象的值
  var propertyOf = function (obj) {
    return obj == null ? function () {} : function (key) {
      return obj[key]
    }
  }
  _.propertyOf = function (obj) {
    return obj == null ? function () {} : function (key) {
      return obj[key]
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
        // 3 如果没有比-Infinity小的 也要返回正确的-Infinity
        if(lastComputed < computed || computed == -Infinity && result == -Infinity) {
          // 备注 result 应该等于value 而不是经过计算的value
          result = value
          lastComputed = computed
        }
      })
    }
    return result
  }
  
  _.min = function (obj, iteratee, context) {
    var result = Infinity, lastComputed = Infinity, computed, value
    if(iteratee == null && obj != null) {
      obj = _.isArrayLike(obj) ? obj : _.values(obj)
      for(var i = 0, length = obj.length; i < length; i++) {
        value = obj[i]
        if(value < result) {
          result = value
        }
      }
    } else {
      iteratee = cb(iteratee, context)
      _.each(obj,function (value, index, list) {
        computed = cb(value, index, list)
        if(computed < lastComputed || computed ==- Infinity || result === Infinity) {
          result = value
          lastComputed = computed
        }
      })
    }

    return result
  }
  /**
   * 萃取数组对象中的某属性值
   * @param obj
   * @param key
   *
   * var stooges = [{name: 'moe', age: 40}, {name: 'larry', age: 50}, {name: 'curly', age: 60}];
     _.pluck(stooges, 'name');
     => ["moe", "larry", "curly"]
   */
  _.pluck = function (obj, key) {
    return _.map(obj, property(key))
  }

  _.unzip = function (array) {
    // 1 传入的是嵌套数组 所以获取嵌套数组中数组长度最长的数组
    // max 里面的iteratee优化成proterty('length') 只要传入array就能获取array的length
    var length = array && _.max(array, 'length').length //  max 返回的是一个value 也就是Array
    var result = Array(length)

    // 2 遍历只需要进行萃取 提取某数组获取对象某属性的值
    for(var index = 0; index < length; index++) {
      result[index] = _.pluck(array, index)
    }
    return result
  }

  _.zip = function () {
    // 1 其实调用的是unzip 也就是说zip和unzip的代码本质上一样的 _.pluck(array, index) pluck参数
    // pluck重复调用 类似于取反
    return _.unzip(arguments)
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

  /**
   * 去除数组中所有的假值 比如 false null undefined 0 "" NaN 都是假值
   * @param array
   */
  _.compact = function (array) {
    //  _.identity => function(value) {return value} =》  直接对value进行filter
    return _.filter(array, _.identity)
  }

  /**
   * 过滤出不满足条件的元素
   * @param obj
   * @param predicate
   * @param context
   */
  _.reject = function (obj, predicate, context) {
    return _.filter(obj, _.negate(cb(predicate)), context)
  }

  /**
   * 展开数组  比如 [1,[1,2],[1]] => [1,1,2,1]
   * @param array
   * @param shallow
   * @param strict
   * @param output
   */
  var flatten = function (array, shallow, strict, output) {
    output = output || []
    var idx = output.length // 输出结果的开始下标

    for(var i = 0, length = getLength(array); i < length; i++) {
      // 后面会用到很多array[i]所以先取出来
      value = array[i]
      if(_.isArrayLike(value) && (_.isArray(value)) || _.isArguments(value)) {
        // 如果数组 判断是深展开还是浅展开
        if(shallow) {
          var j = 0, len = value.length
          while (j < len) output[idx++] = value[j++]
        } else {
          // 递归的时候参数传递错误 所以造成栈溢出
          flatten(value, shallow, strict, output)
        }
      } else if(!strict) {
        output[idx++] = value
      }
    }

    return output
  }

  _.flatten = function (array, shallow) {
    return flatten(array,shallow, false) // 非严格的
  }
  /*
   * 将list转为object对象
   * @param list
   * @param value
   */
  _.object = function (list, value) {
    var result = {},length = getLength(list)
    for(var i = 0; i < length; i++) {
      // 1. 如果没有传入value值 那么视list 为k-v对
      // _.object(['moe', 'larry', 'curly'], [30, 40, 50]);
      if(!value) {
        result[list[i][0]]  = list[i][1]
      } else {

      // 2 _.object([['moe', 30], ['larry', 40], ['curly', 50]]);
        result[list[i]] = value[i]
      }
    }
    return result
  }
  _.range = function (start, stop, step) {
    // 1 如果没有传入stop 参数
    if(stop == null) {
      stop = start || 0
      start = 0
    }
    // 2 如果没有step 默认是1 或者 -1
    if(!step) {
      step = start < stop ?  1 : -1
    }

    // 3 计算range长度
    var length = Math.max(Math.ceil((stop - start) / step), 0)
    var range = Array(length)

    // 4 遍历idx和start
    for(var idx = 0; idx < length; idx++, start+=step) {
      range[idx] = start
    }

    return range
  }

  // 将array划分为若干份,每份count个元素 再合并到一个数组
  _.chunk = function (array, count) {
    if(count == null || count < 1) return []

    var result = [],
    i = 0,
    length = array.length
    while (i < length) {
      result.push(slice.call(array, i, i+=count))
    }

    return result
  }
  
  // 
  function createIndexFinder(dir, predicateFind, sortedIndex ) {
    return function (array, item, index) {
      var length = getLength(array), i = 0
      // 存在的话  typofe xxx == 'number
      if(typeof index == 'number') {
        // 1 dir 大于0校正 i
        if(dir > 0) {
          // 此处的i其实就是index 只是校正正负数 此处应该是>=0
          i = index >= 0 ? index : Math.max(i, index + length)
        } else {
        //2 dir < 0 从右向左找 校正length   [0,1,2,3,4] => 如果index = -1 那么开始的位置是4
        //  [0,1,2,3,4] 如果index = 0 的话,从0这个位置往左找, 那么length 是等于1的
          length = index  >= 0 ?  Math.min(index + 1, length) :  index + length + 1 // -1 + 4 + 1=>4
        }
        // 如果是有序的话就调用二分查找排序 优化
      } else if(sortedIndex && index && length)  {
        index = sortedIndex(array, item) // sortedIndex  ?
        return array[index] === item ? index : -1
      }

      // 3 如果待查找的不是数字 是NaN
      if(item !== item) {
        index = predicateFind(slice.call(array, i, length), _.isNaN) // ?
        return index >= 0 ? index + i : -1
      }

      // 4 否则直接通过 === 进行查找 length - 1 又是多余的吧 i已经校正过了 根据dirlength也校正过了
      for(index = dir > 0 ? i : length -1; index >= 0  && index <length; index+=dir) {
        if(array[index] === item) return index
      }
      return -1
    }
  }


  /**
   * 就
   * @param array
   * @param obj
   * @param iteratee
   * @param context
   */
  _.sortedIndex = function (array, obj, iteratee, context) {
    iteratee = cb(iteratee,context)
    //
    var value = iteratee(obj)

    var low = 0, high = getLength(array)
    while (low < high) {
      var mid = Math.floor((low + high) / 2)
      // 如果iteratee是空的话 那么经过cb这个函数进行优化的话 可以返回自身
      if(value < iteratee(array[mid])) {
        high = mid
      } else {
        low = mid + 1
      }
    }
    return low
  }

  _.indexOf = createIndexFinder(1, _.findIndex, _.sortedIndex)
  _.lastIndexOf = createIndexFinder(-1, _.findLastIndex);


  _.contains = _.include = _.includes = function (obj, item, fromIndex) {
    // 1 如果不是类数组的话 获取对象的values返回一个数组
    if(!_.isArrayLike(obj)) {
      obj = _.values(obj)
      console.log('hello')
    }

    // 2 如果没有传递fromIndex的话 默认fromIndex 为-
    if(typeof fromIndex != 'number' || guard) {
      fromIndex = 0
    }

    // 3 调用_.indexOf
    return _.indexOf(obj, item, fromIndex) >= 0

  }

  _.size = function (obj) {
    if(obj == null) return 0

    // 如果是类数组之际获取length 否则获取obj的键值对数组 然后取到length
    return _.isArrayLike(obj) ? obj.length : _.keys(obj).length
  }

  /**
   * 把可以跌倒的对象转化成数组
   * @param obj
   * @returns {*}
   */
  _.toArray = function (obj) {
    if(!obj) return []
    // 1 如果是数组 返回数组的副本
    if(_.isArray(obj)) return slice.call(obj)

    // 2 如果是类数组 map 转化成数组
    if(_.isArrayLike(obj)) {
      return _.map(obj, _.identity)
    }

    // 3 如果是对象的话 返回对象的属性值
     return _.values(obj)
  }



  /**
   * 实现分组的行为 分组的行为就是如果已经有了的话就push 否则用数组给对应的key值进行赋值
   * @param behavior
   */
  var group = function (behavior) {
    // 1 返回一个function(obj, iteratee, context)
    return function (obj, iteratee, context) {
      var result = {}
      iteratee = cb(iteratee, cb)
      _.each(obj,function (value, index) {
        // 2 key就是GroupBy传递进来进行排序的依据
        // iteratee杜宇indexBy来说,如果传入一个obj就能把value这个属性的值给取出来
        var key = iteratee(value, index, obj)
        // 3 排序的行为
        behavior(result, value, key)
      })
      return result
    }
  }

  _.groupBy = group(function (result, value, key) {
    if(_.has(result, key)) {
      result[key].push(value)
    } else {
      // 因为result的key对应的属性值都是数组 所以要这样进行赋值
      result[key] = [value]
    }

  })

  /**
   * 返回每一项索引的对象
   * var stooges = [{name: 'moe', age: 40}, {name: 'larry', age: 50}, {name: 'curly', age: 60}];
   _.indexBy(stooges, 'age');

   */
  _.indexBy = group(function (result, value, key) {
    result[key] = value
  })


  /**
   * 返回各组中对象的数量的计数
   * _.countBy([1, 2, 3, 4, 5], function(num) {
      return num % 2 == 0 ? 'even': 'odd';
    });

   */
  _.countBy = group(function (result, value, key) {
    if(_.has(result, key)) {
      result[key]++
    } else {
      // 只要有遍历 就有key 没有已经存在的话 就是初始化赋值等于1
      result[key] = 1
    }
  })


  _.uniq = _.unique = function (array, isSorted, iteratee, context) {
    // 1 如果isSorted没有传递进来的话 调整参数把isSorted置为false
    // 他的意思是第二个参数可以能传递的是iteratee回调函数 就往后调整到第三个参数
    if(!_.isBoolean(isSorted)) {
    // if(!isSorted) {
      context = iteratee
      iteratee = isSorted
      isSorted = false
    }

    if(!iteratee)
      iteratee = cb(iteratee, context) // 返回一个固定三个参数的函数

    // 2 seen记录已经出现的(可能已经经过迭代) result记录结果集
    // seen = [] 然后 seen = 1 此时seen就指向另外一个边量地址
    var seen =[], result = []

    // 3 遍历去重
    for(var i = 0, length = getLength(array); i < length; i++) {
      var value = array[i]
      var computed = iteratee ? iteratee(value, i, array) : value

      // 如果有isSorted的话 数组有序 只需要跟上一个出现过的元素进行对比就行了
      // 其实有isSorted就美誉itetatee 因为这两个是互斥的
      if(isSorted && !iteratee) {
        if(!i || computed !== seen)  {
          result.push(value)
          seen = computed
        }
      } else if(iteratee) {
        if(!_.contains(seen, computed)) {
          seen.push(computed)
          result.push(value)
        }
      } else {
        if(!_.contains(result, value)) {
          result.push(value)
        }
      }
    }
    return result
  }

  /**
   * 查找对象中国属性满足iteratee这个函数的key
   * @param obj
   * @param iteratee
   * @param context
   * _.findKey({name :1,age :2},function(value){
    return value == 2;
    })
   */
  _.findKey = function (obj, predicate, context) {
    predicate = cb(predicate)
    var keys = _.keys(obj), key

    for(var i = 0, length = keys.length; i < length; i++) {
      key = keys[i]
      if(predicate(obj[key], key, obj)) {
        return key
      }
    }
  }

  /**
   * 它类似于map，但是这用于对象。转换每个属性的值。

     _.mapObject({start: 5, end: 12}, function(val, key) {
       return val + 5;
     });
   * @param obj
   * @param iteratee
   * @param context
   * @returns {{}}
   */
  _.mapObject = function (obj,iteratee, context) {
    iteratee = cb(iteratee,context)
    var keys = _.keys(obj),
        length = keys.length,
        currentKey,
        result = {}

    for(var index = 0; index <  length; index++) {
      //  从keys拿到currentKey
      currentKey = keys[index]
      result[currentKey] = iteratee(obj[currentKey], currentKey, obj)
    }
    return result

  }

  /**
   * 返回第一个通过predicate函数的值
   * var even = _.find([1, 2, 3, 4, 5, 6], function(num){ return num % 2 == 0; });
   * @type {detect}
   */
  _.find = _.detect = function (obj, predicate, context) {
    var key
    if(_.isArrayLike(obj)) {
      console.log(obj)
      key = _.findIndex(obj,predicate, context)
    } else {
      key = _.findKey(obj, predicate, context)
    }

    // 如果找到到话 就返回数组或者对象对应key的属性值
    if(key !== void 0 && key != -1) {
      console.log(obj[key])
      return obj[key]
    }
  }

  /**
   * 判断list中的元素是否都满足同一个条件
   * @type {all}
   */
  _.every = _.all = function (obj, predicate, context) {
    predicate = cb(predicate, context)

    // 1 如果是对象
    var keys = !_.isArrayLike(obj) && _.keys(obj),
        length = (keys || obj).length,
        currentKey

    for(var index = 0; index < length; index++) {
      currentKey = keys ? keys[index] : index
      if(!predicate(obj[currentKey], currentKey, obj)) debugger;return false
    }
    // 符合全部条件的话 就返回true
    return true
  }

  /**
   * 判断是list是否有一个元素满足predicate这个条件
   * @type {any}
   * _.some([null, 0, 'yes', false]);

   */
  _.some = _.any = function (obj, predicate, context) {
    predicate = cb(predicate, context)
    var keys = !_.isArrayLike(obj) && _.keys(obj),
        length = (keys || obj).length

    for(var index = 0; index < length; index++) {
      var currentKey = keys ? keys[index] : index
      // 1只要有一个元素满足条件的话 就返回true
      if(predicate(obj[currentKey], currentKey, obj)) return true
    }

    // 2 全部都不满足的话就返回false
    return false
  }

  /**
   * 在obj这个list里面的各个元素调用method
   * 如果method是字符串的话 那么调用元素的method
   * 多余的args 都传递给method
   * @param obj
   * @param method
   */
  _.invoke = function (obj, method) {
    var args = slice.call(arguments, 2)
    var isFunc = _.isFunction(obj)

    // 把map过后返回的数组返回回来
    return _.map(obj, function (value) {
      var func  = isFunc ? method : value[method]
      return func == null ? func : func.apply(value, args)
    })
  }

  /**
   * 返回list中含有attrs或者硕士property元素的值
   * var arr = [{name:2,age:3},{name:2,age:3,sex:'male'},{name:2}];
   _.where(arr,{name:2,age:3});
   * @param obj
   * @param attrs
   */
  _.where = function (obj, attrs) {
    // 过滤出一些包含attrs这些属性的元素 以数组形式返
    return _.filter(obj, _.matcher(attrs))
  }

  /**
   *  查找满足第一个元素的值
   * @param obj
   * @param attrs
   */
  _.findWhere = function (obj, attrs) {
    return _.find(obj, _.matcher(attrs))
  }

  /**
   * 返回list随机的一个副本
   * @param obj
   */
  _.shuffle = function (obj) {
    var set = _.isArrayLike(obj) ? obj : _.values(obj),
        length = obj.length

    var shuffled = Array(length)

    for(var index = 0; index < length; index++) {
      var rand = _.random(0, index)
      // 1 生成一个随机的下标 如果下标不同 才需要进行交换
      if(rand !== index) shuffled[index] = shuffled[rand]
      shuffled[rand] = set[index]
    }

    return shuffled

  }

  /**
   * 从list中返回一个随机样本 如果没有传入n返回一个随机数
   * @param obj
   * @param n
   * @param gurad
   * @returns {*}
   *
   *
   _.sample([1, 2, 3, 4, 5, 6]);
   => 4
   _.sample([1, 2, 3, 4, 5, 6], 3);
   => [1, 6, 2]
   */
  _.sample = function (obj, n, gurad) {
    if(n == null || gurad) {
      console.log('1')
      !_.isArrayLike(obj) && (obj = _.values(obj))
      console.log(obj.length, obj, _.random(obj.length - 1))
      return obj[_.random(obj.length - 1)]
    }

    return _.shuffle(obj).slice(0, Math.max(0, n))
  }
  
  _.sortBy = function (obj, iteratee, context) {

    // 先整出一个数据结构 按照这个数据结构的criteria或者index排序 把value这个值提取出来就有序了
    iteratee = cb(iteratee, context)
    return _.pluck(_.map(obj, function (value, index, obj) {
      return {
        value : value,
        index : index,
        criteria: iteratee(value, index, obj)
      }
    }).sort(function (left, right) {
      var a = left.criteria,
          b = right.criteria

      // 不想等的时候比 特别需要注意的是 a === void这个判断
      if(a !== b) {
        if(a < b || a === void 0) return -1
        if(a > b || b === void 0) return 1
      }
      // 相等的时候比index
      return left.index - right.index
    }), 'value') // 把value萃取出来
  }

  /**
   * 拆分一个数组（array）为两个数组：  第一个数组其元素都满足predicate迭代函数， 而第二个的所有元素均不能满足predicate迭代函数。
   * _.partition([0, 1, 2, 3, 4, 5], function(value, key, obj) {
     return value % 2 == 1
    });
   * @param obj
   * @param predicate
   * @param context
   */
  _.partition = function (obj, predicate, context) {
    predicate = cb(predicate, context)
    var pass = [], fail = []
    _.each(obj, function (value, key, obj) {
      (predicate(value, key, obj) ? pass : fail).push(value)
      // if(iteratee(value, key, obj)) {
      //   pass.push(value)
      // } else {
      //   fail.push(value)
      // }
    })
    return [pass, fail]
  }
  var executeBound = function (sourceFunc, boundFunc, context, callingContext, args) {

    if(!(callingContext instanceof boundFunc)) {
      // 直接调用函数绑定
      sourceFunc.apply(context, args)
    }


    // 否则 模拟new 生成函数 此时生成的函数只是继承了原型而已
    var self = _.baseCreate(sourceFunc.prototype)
    var result = sourceFunc.apply(self, args)

    // ???
    if(_.isObject(result)) return result

    return self

  }

  /**
   *
   var func = function(greeting){ return greeting + ': ' + this.name };
   func = _.bind(func, {name: 'moe'}, 'hi');
   func();
   => 'hi: moe'

   此处的函数其实要传入的是三个参数 第一个就是函数 第二个就是函数要绑定的对象 第三个参数是变量
   * 功能:.bind(function, object, *arguments)
   * 绑定函数到object中去 无论怎么调用函数的this都指向这个对象去
   * @param func
   * @param context
   */
  _.bind = function (func, context) {

    // Function.prototype.bind.apply(func,context)
    if(nativeBind && func.bind === nativeBind) {

      // 返回由this值和初始化参数改造的 原拷贝函数 也就返回原生的bind他直接bind到func中
      // apply接受的是一个包含多个参数的数组
      // 这句话的意思在func这个函数使用bind => func.bind(context, restArgs)  =》 函数的this就可以指向object中去了
      return nativeBind.apply(func, slice.call(arguments, 1))
    }

    if(!_.isFunction(func)) {
      throw  new TypeError('bind must be on a function')
    }
    
    var bound = function () {
     return executeBound(func, bound, context, this, slice.call(arguments))
    }
    return bound
  }

  /**
   * 其实这个函数就是为了提前传入一些默认的参数 局部填充默认的一些参数
   * var subtract = function(a, b) { return b - a; };
     sub5 = _.partial(subtract, 5);
     sub5(20);

     subFrom20 = _.partial(subtract, _, 20);
     subFrom20(5);
     => 15


   * @param func
   * @returns {bound}
   */
  _.partial = function (func) {
    var boundArgs = slice.call(arguments, 1)

    var bound = function() {
      var length = boundArgs.length,
        // 用来记录boundArgs提取的位置
          position = 0,
          args = Array(length)
      for(var i = 0; i < length; i++) {
        // 如果有占位符号的话 先从闭包函数的arguments去取
        args[i] = boundArgs[i] === '_' ? arguments[position++] : boundArgs[i]
      }
      while (position < arguments.length) {
        args.push(arguments[position++])
      }

      return executeBound(func, bound, this, this, args)

    }

    return bound

  }

  _.bindAll = function (func) {
    var length = arguments.length
    if(length <= 1) {
      throw new Error("bindAll must be pass function names")
    }

    for(var i = 1; i < length; i++) {
      var key = arguments[i]
      obj[key] = _.bind(obj[key], obj)
    }

    return obj
  }

  /**
   * var fibonacci = _.memoize(function(n) {
        return n < 2 ? n: fibonacci(n - 1) + fibonacci(n - 2);
      });
     fibonacci(11);

   实际上上面的 里面是斐波那契名称 作为memoize返回的函数 帮他重新命名为fibonacci 这个名字
   就可以形成递归,只需要在里面判断一下中间量是否有存在，存在直接返回不需要进行计算
   * @param func
   * @param hasher
   * @returns {memoize}
   */
  _.memoize = function (func, hasher) {

    var memoize = function(key) {

      // 如果有hasher函数的话 调用这个haser函数同时传入 arguments也就是key
      var address = '' + hasher ? hasher.apply(this, arguments) : key
      if(!_.has(cache, address)) {
        cache[address] = func.apply(this, arguments)
      }
      return cache[address]
    }

    memoize.cache = {}

    return memoize
  }

  /**

     var log = _.bind(console.log, console);
     _.delay(log, 1000, 'logged later');

   *
   *
   * 延迟wait秒后执行func, 如果第三个参数就作为func的参数被传递进行
   * @param func
   * @param wait
   */
  _.delay = function (func, wait) {
    var args = slice.call(arguments, 2)

    return setTimeout(function () {
      // 不需要绑定上下文 只需要把参数传递进去就好了
      return func.apply(null, args)
    }, wait)

  }

  /**
   *
   * 延迟调用function直到当前调用栈清空为止，类似使用延时为0的setTimeout方法。
   * 对于执行开销大的计算和无阻塞UI线程的HTML渲染时候非常有用。 如果传递arguments参数，
   * 当函数function执行时， arguments 会作为参数传入。

   *  其中 delay 至少需要两个参数一个是func 一个是wait也就是延迟时间
   *
   * @type {bound}
   */
  _.defer = _.partial(_.delay, _, 1)

  _.throttle = function(func, wait, options) {
    var context, args, result,timeout,
      previous = 0

    // 如果options == null
    if(options == null) options = {}

    // 只是
    var later = function() {
      // 之所以等于false就等于0是因为 下面的判断有 !options && options.leading === false ？ previous = _.now() ： ''
      // 此处也是刷新要执行函数时的这个阶段
      // 要执行函数了 所以timeout 要置为空
      timeout = null
      previous = options.leading === false ? 0 : _.now()
      result = func.apply(context, args)

      if(!timeout) context = args = null
    }
    
    return function () {
      // 计算剩下的时间是 wait - (now - previous)
      var now = _.now()
      previous = !previous && options.leading === false && _.now()
      var remaining = wait - (now - previous)

      // remaining 表示第二次的函数还没执行 第三次发送过去  此时会刷新previous underscore不阻止函数的执行 返回最新的一次执行结果
      if(remaining <  0 || remaining > wait) {
        // 执行函数 之前要判断一下timeout是否存在
        if(timeout) {
          // 先用clearTimeout清理定时器
          clearTimeout(timeout)
          timeout = null
        }

        // 每次要执行函数之前都要刷新当前的执行时间也就是previous
        previous = _.now()
        result = func.apply(context, args)
        if(!timeout) context = args = null

      } else if(!timeout && options.trailing !== false) {
        timeout = setTimeout(later, remaining)
      }
      return result
    }

  }

  _.debounce = function (func,  wait, immediate) {
    var args, context, timestamp, callNow, timeout, last

    var later = function() {
      // 获取最后一次执行需要的时间间隔
      last = _.now() - timestamp

      // setTimeout 的不准确性 所以需要判断 如果 last剩余的时间 仍然于小于wait的话
      if(last < wait && last > 0) {
        timeout = setTimeout(later, wait-last)
      } else {
        // 要执行函数了 所以  timeout要置为空
        timeout = null
        // 如果不是立即执行才需要
        if(!immediate) {
          result = func.apply(contxt, args)
          if(!timeout) {
            contxt = args = null
          }
        }
        // result = func.apply(contxt, args); contxt = args = null 上面那一段其实可以直接优化出
      }
    }


    return function() {
      context = this
      args = arguments
      // 1 执行函数的时候先设定时间戳
      timestamp = _.now()

      // 2 判断immediate参数 是否设置为立即触发
      callNow = immediate && !timeout

      if(callNow) {
        timeout = null
        func.apply(context, args)
      }

      if(!timeout)  {
        timeout = setTimeout(later, wait)
        context = args = null
      }

    }
  }

  /**
   * 将函数的传递给wrapper 并且作为wrapper的第一个参数
   * @param func
   * @param wrapper
   */
  _.wrap = function (func, wrapper) {
    return _.partial(wrapper, func)
  }

  /**
   * 将参数传递给最后面的函数, 计算的结果再次作为参数传递到前面的函数, 依次类推
   * @returns {Function}
   *
   *
   * var greet = function(name){ return "hi: " + name; };
     var exclaim = function(statement){ return statement.toUpperCase() + "!"; };
     var welcome = _.compose(greet, exclaim);
     welcome('moe');
   */
  
  _.compose = function () {
    var args = arguments,
        start = arguments.length - 1

    return function () {
      i = start
      var result = args[start].apply(this, arguments)

      while (i--) {
        // i先剪掉1再进来
        // 这边的apply 变成call就可以
        result = args[i].call(this, result)
      }
      return result
    }


  }

  /**
   * 函数只有调用了count次 才会执行
   *
   *
   var hello = function() {console.log("hello")}
   var af = _.after(2, hello)
   */
  _.after = function(times, func) {
    return function () {
      // 每一次调用都是空调用
      if (--times < 1) {
        func.apply(this, arguments)
      }
    }
  }

  /**
   * 调用不超过times次 比如times传入的是2 最多不超过2次也就是执行一次
   * 把最后一次返回的结果返回
   * @param times
   * @param func
   */
  _.before = function (times, func) {
    // 闭包变量可以持久性
    var memo

    return function() {
      if(--times > 0) {
        memo = func.apply(this,arguments)
      }

      if(times <= 1) {
        func = null
      }

      return memo
    }

  }
  /**
   * 创建一个只能调用一次的函数
   */
  _.once = function () {
    return _.partial(_.before, 2)
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