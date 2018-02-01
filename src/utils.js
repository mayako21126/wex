/**
 *
 * @param {Array} list
 * @param {Function} f
 * @return {*}
 */
export function find(list, f) {
  return list.filter(f)[0]
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

export function watchState(object, onChange) {
  
  const handler = {
    get(target, property, receiver) {
      try {
        // console.log(target,property)
        // console.log(receiver)
        // handler.target=target[property]
        return new Proxy(target[property], handler);
      } catch (err) {
        return Reflect.get(target, property, receiver);
      }
    },
    defineProperty(target, property, descriptor) {
      // console.log(this,descriptor)
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
