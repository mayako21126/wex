/**
 * Wex 0.01
 * (c) 2018 Mayako
 * 餐小程序用简易状态机
 */
function testable(target) {
  
}

@testable
class Wex {
  init(args) {
    this.history=[];
    this.$state = args.state;
    this.$Mutation = args.Mutation;
    this.$Mutation.state = this.$state;
  }
  // state写入方法
  setState(n, m) {
    this.history.push({n,m})
    this.emit(n, m);
    this.$state[n] = m;
  }
  // 设置只读属性
  get state() {
    return this.$state;
  }
  get Mutation() {
    return this.$Mutation;
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
export {
  curry,
  Wex
};
