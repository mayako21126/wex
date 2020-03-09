/**
 *
 * @param {Array} list
 * @param {Function} f
 * @return {*}
 */
export function find(list, f) {
  return list.filter(f)[0]
}
var curry =
  (fn, arity = fn.length, nextCurried) =>
  (nextCurried = prevArgs =>
    nextArg => {
      var args = [...prevArgs, nextArg];

      if (args.length >= arity) {
        return fn(...args);
      } else {
        return nextCurried(args);
      }
    }
  )([]);
export {
  curry
}
/**
 *
 * @param {*} obj
 * @param {Array<Object>} cache
 * @return {*}
 */
export function deepCopy(obj, cache = []) {

  if (obj === null || typeof obj !== 'object') {
    return obj
  }


  const hit = find(cache, c => c.original === obj)
  if (hit) {
    return hit.copy
  }

  const copy = Array.isArray(obj) ? [] : {}

  cache.push({
    original: obj,
    copy
  })

  Object.keys(obj).forEach(key => {
    copy[key] = deepCopy(obj[key], cache)
  })

  return copy
}

/**
 * forEach for object
 */
export function forEachValue(obj, fn) {
  Object.keys(obj).forEach(key => fn(obj[key], key))
}

export function isObject(obj) {
  return obj !== null && typeof obj === 'object'
}

export function isPromise(val) {
  return val && typeof val.then === 'function'
}

export function assert(condition, msg) {
  if (!condition) throw new Error(`[vuex] ${msg}`)
}
export function normalizeMap(map) {
  return Array.isArray(map) ?
    map.map(function (key) {
      return ({
        key: key,
        val: key
      });
    }) :
    Object.keys(map).map(function (key) {
      return ({
        key: key,
        val: map[key]
      });
    })
}
export function isObjectValueEqual(a, b) {
  var aProps = Object.getOwnPropertyNames(a);
  var bProps = Object.getOwnPropertyNames(b);
   if (aProps.length != bProps.length) {
        return false;
   }
   for (var i = 0; i < aProps.length; i++) {
     var propName = aProps[i]

     var propA = a[propName]
     var propB = b[propName]
     if ((typeof (propA) === 'object')) {
       if (isObjectValueEqual(propA, propB)) {
           return true
         } else {
           return false
         }
     } else if (propA !== propB) {
       return false
     } else { }
   }
 return true
 }
 var a = {
     id:1,
     name:2,
     c:{
         age:3
     }
 };
 var b = {
     id:1,
     name:2,
     c:{
         age:3
     }
 }
export function Watch(obj, callback) {
  var that = this
  // debugger
  // var ua = navigator.userAgent.toLowerCase();
  // if (ua.match(/MicroMessenger/i) == "micromessenger") {
  //   //ios的ua中无miniProgram，但都有MicroMessenger（表示是微信浏览器）
  //   wx.miniProgram.getEnv((res) => {
  //     if (res.miniprogram) {
  //       that = wx
  //     } else {
  //       that = window
  //     }
  //   })
  // } else {
  //   that = window
  // }
  that.callback = callback;
  //监听_obj对象 判断是否为对象,如果是数组,则对数组对应的原型进行封装
  //path代表相应属性在原始对象的位置,以数组表示. 如[ 'a', 'dd', 'ddd' ] 表示对象obj.a.dd.ddd的属性改变
  that.observe = function (_obj, path) {
    var type = Object.prototype.toString.call(_obj);
    if (type == '[object Object]' || type == '[object Array]') {
      that.observeObj(_obj, path);
      if (type == '[object Array]') {
        that.cloneArray(_obj, path);
      }
    }
  };

  //遍历对象obj,设置set,get属性,set属性能触发callback函数,并将val的值改为newVal
  //遍历结束后再次调用observe函数 判断val是否为对象,如果是则在对val进行遍历设置set,get
  that.observeObj = function (obj, path) {
    var t = that;
    Object.keys(obj).forEach(function (prop) {
      var val = obj[prop];
      var tpath = path.slice(0);
      tpath.push(prop);
      Object.defineProperty(obj, prop, {
        get: function () {
          return val;
        },
        set: function (newVal) {
          t.callback(tpath, newVal, val);
          val = newVal;
        }
      });
      t.observe(val, tpath);
    });
  };

  //通过对特定数组的原型中间放一个newProto原型,该原型继承于Array的原型,但是对push,pop等数组操作属性进行封装
  that.cloneArray = function (a_array, path) {
    var ORP = ['push', 'pop', 'shift', 'unshift', 'splice', 'sort', 'reverse'];
    var arrayProto = Array.prototype;
    var newProto = Object.create(arrayProto);
    var t = that;
    ORP.forEach(function (prop) {
      Object.defineProperty(newProto, prop, {
        value: function (newVal) {
          path.push(prop);
          t.callback(path, newVal);
          arrayProto[prop].apply(a_array, arguments);
        },
        enumerable: false,
        configurable: true,
        writable: true
      });
    });
    a_array.__proto__ = newProto;
  };

  //开始监听obj对象,初始path为[]
  that.observe(obj, []);
}
// 考虑proxy的兼容性，已废弃
export function watchState(object, onChange) {
  const handler = {
    get(target, property, receiver) {
      try {
        return new Proxy(target[property], handler);
      } catch (err) {
        return Reflect.get(target, property, receiver);
      }
    },
    defineProperty(target, property, descriptor) {
      onChange(target, property, descriptor);
      return Reflect.defineProperty(target, property, descriptor);
    },
    deleteProperty(target, property) {
      onChange(target, property);
      return Reflect.deleteProperty(target, property);
    }
  };

  return new Proxy(object, handler);
}

export function mi() {
  return {
    isOperator: isOperator,
    calCommonExp: calCommonExp,
    getPrioraty: getPrioraty,
    prioraty: prioraty,
    outputRpn: outputRpn,
    calRpnExp: calRpnExp
  }

  function isOperator(value) {
    var operatorString = '+-*/()×÷';
    return operatorString.indexOf(value) > -1;
  }

  function getPrioraty(value) {
    if (value == '-' || value == '+') {
      return 1;
    } else if (value == '*' || value == '/' || value == '×' || value == '÷') {
      return 2;
    } else {
      return 0;
    }
  }

  function prioraty(v1, v2) {
    return getPrioraty(v1) <= getPrioraty(v2);
  }

  function outputRpn(exp) {
    var inputStack = [];
    var outputStack = [];
    var outputQueue = [];
    var firstIsOperator = false;
    exp.replace(/\s/g, '');
    if (isOperator(exp[0])) {
      exp = exp.substring(1);
      firstIsOperator = true;
    }
    for (var i = 0, max = exp.length; i < max; i++) {
      if (!isOperator(exp[i]) && !isOperator(exp[i - 1]) && (i != 0)) {
        inputStack[inputStack.length - 1] = inputStack[inputStack.length - 1] + exp[i] + '';
      } else {
        inputStack.push(exp[i]);
      }
    }
    if (firstIsOperator) {
      inputStack[0] = -inputStack[0]
    }
    while (inputStack.length > 0) {
      var cur = inputStack.shift();
      if (isOperator(cur)) {
        if (cur == '(') {
          outputStack.push(cur);
        } else if (cur == ')') {
          var po = outputStack.pop();
          while (po != '(' && outputStack.length > 0) {
            outputQueue.push(po);
            po = outputStack.pop();
          }
        } else {
          while (prioraty(cur, outputStack[outputStack.length - 1]) && outputStack.length > 0) {
            outputQueue.push(outputStack.pop());
          }
          outputStack.push(cur)
        }
      } else {
        outputQueue.push(Number(cur));
      }
    }
    if (outputStack.length > 0) {
      while (outputStack.length > 0) {
        outputQueue.push(outputStack.pop());
      }
    }
    return outputQueue;
  }

  function calRpnExp(rpnArr) {
    var stack = [];
    for (var i = 0, max = rpnArr.length; i < max; i++) {
      if (!isOperator(rpnArr[i])) {
        stack.push(rpnArr[i]);
      } else {
        var num1 = stack.pop();
        var num2 = stack.pop();
        if (rpnArr[i] == '-') {
          var num = num2 - num1;
        } else if (rpnArr[i] == '+') {
          var num = num2 + num1;
        } else if (rpnArr[i] == '*' || rpnArr[i] == '×') {
          var num = num2 * num1;
        } else if (rpnArr[i] == '/' || rpnArr[i] == '÷') {
          var num = num2 / num1;
        }
        stack.push(num);
      }
    }
    return stack[0];
  }

  function calCommonExp(exp) {
    var rpnArr = outputRpn(exp);
    return calRpnExp(rpnArr)
  }
}