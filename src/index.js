/**
 * no use strict 
 */

/**
 * Wex 0.1.6
 * (c) 2018 Mayako
 * 小程序用简易状态机
 */

import {
  assert,
  deepCopy
} from './utils'
function testable(target) {

}

@testable
class Wex {
  constructor(x) {

  }
  init(args = {}) {
    assert(typeof Promise !== 'undefined', `Wex requires a Promise polyfill in this browser.`)
    this.history = [];
    installModule(args, this);
    let self = this;
    return {
      history:this.history,
      get state() {
        return deepCopy(self.$state)
      },
      on: this.on.bind(this),
      off: this.off.bind(this),
      emit: this.emit.bind(this),
      mapMutations: this.mapMutations,
      commit: (type, ...args) => {
        return this.commit(type, {
          store: this,
          args
        })
      }
    }
  }
  // state写入方法
  setState(n, m) {
    if (typeof m == 'Array' || typeof m == "object") {
      this.history.push({
        name: n,
        new: m,
        old: this.$state[n]
      })
      this.emit(n, m);
      this.$state[n] = m;
    } else {
      this.history.push({
        name: n,
        new: m,
        old: this.$state[n]
      })
      this.emit(n, m);
      this.$state[n] = m;
    }

  }
  // commit方法
  commit(_type, _payload) {
    const type = _type;
    const payload = unifyPayload.call(this, _payload);
    const entry = this.$mutations[type]
    if (!entry) {
      if (this.$Dev) {
        console.error(`[wex] unknown mutation type: ${type}`)
      }
      return
    }
    return entry({
      state: payload.store.state,
      setState: payload.store.setState.bind(payload.store),
      commit: payload.store.commit.bind(payload.store),
      args: payload.args
    })

  }
  // 设置只读属性
  get state() {
    return deepCopy(this.$state);
  }
  set state(x) {
    console.error('[wex] is not allowed change state ')
    return
  }
  get Mutation() {
    return this.$mutations;
  }
  // 触发自动响应，用于替代computed
  on(event, fn, ctx) {
    if (typeof fn != 'function') {
      console.error('fn must be a function')
      return
    }
    this._stores = this._stores || {};
    // 删除重复的响应事件
    let name = ctx.$name;
    for (var i in this._stores[event]) {
      if (this._stores[event][i].ctx.$name == name) {
        this.off(event, fn)
      }
    }

    // 添加函数到stores里
    (this._stores[event] = this._stores[event] || []).push({
      cb: fn,
      ctx: ctx
    })
    // 添加之后执行一次触发事件用于更新第一次数据
    this.emit(event, this.state[event])
  }
  emit(event, ...state) {
    this._stores = this._stores || {}
    var store = this._stores[event],
      args
    // 如果触发了不存在的stores，stores必须要提前定义
    if (this.state[event] == null || this.state[event] == undefined) {
      console.error(event + ' is undefined')
      return false;
      // this.state[event] =state[0]; 
    }
    if (store) {
      store = store.slice(0)
      args = state;
      this.$state[event] = args[0]
      for (var i = 0, len = store.length; i < len; i++) {
        store[i].cb.apply(store[i].ctx, args)
      }
    }
  }
  off(event, fn) {
    this._stores = this._stores || {}
    // 删除全部
    if (!arguments.length) {
      this._stores = {}
      return
    }
    var store = this._stores[event]
    if (!store) return
    // 删除同名全部
    if (arguments.length === 1) {
      delete this._stores[event]
      return
    }
    // 删除单独
    var cb
    for (var i = 0, len = store.length; i < len; i++) {
      cb = store[i].cb
      // 判断匿名函数是否一致，因为前面已经判断是否属于同一作用域，所以直接执行tostring()判断
      if (cb.toString() == fn.toString()) {
        store.splice(i, 1)
        break
      }
    }
    return
  }
}

function unifyPayload(...payload) {
  if (!payload[0].store) {
    payload = {
      store: this,
      args: payload
    }
    return payload
  }
  return payload[0]
}

function installModule(args, store) {
  store.$state = args.state;
  store.$mutations = args.Mutation;
  store.$committig = false
  store.$actions = Object.create(null)
  store.$wrappedGetters = Object.create(null)
  store.$subscribers = [];
  store.mapMutations = mapMutations(args.Mutation, store)
}

function mapMutations(mutations, store) {
  var res = {}
  normalizeMap(mutations).forEach(function (ref) {
    var key = ref.key;
    var val = ref.val;

    res[key] = function mappedMutation() {
      var args = [],
        len = arguments.length;
      while (len--) args[len] = arguments[len]; // 一个数组缓存传入的参数
      // val作为commit函数的第一个参数type， 剩下的参数依次是payload 和 options
      return store.commit(key, {
        store,
        args
      });
    }
  })
  return res
}

function normalizeMap(map) {
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
export {
  Wex
};
