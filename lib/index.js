'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Wex = undefined;

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _class; /**
             * no use strict 
             */

/**
 * Wex 0.01
 * (c) 2018 Mayako
 * 扫码点餐小程序用简易状态机
 */

var _utils = require('./utils');

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function testable(target) {}

var Wex = testable(_class = function () {
  function Wex(x) {
    _classCallCheck(this, Wex);
  }

  _createClass(Wex, [{
    key: 'init',
    value: function init() {
      var _this = this;

      var args = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

      (0, _utils.assert)(typeof Promise !== 'undefined', 'Wex requires a Promise polyfill in this browser.');
      this.history = [];
      installModule(args, this);
      var self = this;
      return {
        history: this.history,
        get state() {
          return (0, _utils.deepCopy)(self.$state);
        },
        on: this.on.bind(this),
        off: this.off.bind(this),
        emit: this.emit.bind(this),
        mapMutations: this.mapMutations,
        commit: function commit(type) {
          for (var _len = arguments.length, args = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
            args[_key - 1] = arguments[_key];
          }

          return _this.commit(type, {
            store: _this,
            args: args
          });
        }
      };
    }
    // state写入方法

  }, {
    key: 'setState',
    value: function setState(n, m) {
      if (typeof m == 'Array' || (typeof m === 'undefined' ? 'undefined' : _typeof(m)) == "object") {
        this.history.push({
          name: n,
          new: m,
          old: this.$state[n]
        });
        this.emit(n, m);
        this.$state[n] = m;
      } else {
        this.history.push({
          name: n,
          new: m,
          old: this.$state[n]
        });
        this.emit(n, m);
        this.$state[n] = m;
      }
    }
    // commit方法

  }, {
    key: 'commit',
    value: function commit(_type, _payload) {
      var type = _type;
      var payload = unifyPayload.call(this, _payload);
      var entry = this.$mutations[type];
      if (!entry) {
        if (this.$Dev) {
          console.error('[wex] unknown mutation type: ' + type);
        }
        return;
      }
      return entry({
        state: payload.store.state,
        setState: payload.store.setState.bind(payload.store),
        commit: payload.store.commit.bind(payload.store),
        args: payload.args
      });
    }
    // 设置只读属性

  }, {
    key: 'on',

    // 触发自动响应，用于替代computed
    value: function on(event, fn, ctx) {
      if (typeof fn != 'function') {
        console.error('fn must be a function');
        return;
      }
      this._stores = this._stores || {};
      // 删除重复的响应事件
      var name = ctx.$name;
      for (var i in this._stores[event]) {
        if (this._stores[event][i].ctx.$name == name) {
          this.off(event, fn);
        }
      }

      // 添加函数到stores里
      (this._stores[event] = this._stores[event] || []).push({
        cb: fn,
        ctx: ctx
      });
      // 添加之后执行一次触发事件用于更新第一次数据
      this.emit(event, this.state[event]);
    }
  }, {
    key: 'emit',
    value: function emit(event) {
      this._stores = this._stores || {};
      var store = this._stores[event],
          args;
      // 如果触发了不存在的stores，stores必须要提前定义
      if (this.state[event] == null || this.state[event] == undefined) {
        console.error(event + ' is undefined');
        return false;
        // this.state[event] =state[0]; 
      }
      if (store) {
        store = store.slice(0);

        for (var _len2 = arguments.length, state = Array(_len2 > 1 ? _len2 - 1 : 0), _key2 = 1; _key2 < _len2; _key2++) {
          state[_key2 - 1] = arguments[_key2];
        }

        args = state;
        this.$state[event] = args[0];
        for (var i = 0, len = store.length; i < len; i++) {
          store[i].cb.apply(store[i].ctx, args);
        }
      }
    }
  }, {
    key: 'off',
    value: function off(event, fn) {
      this._stores = this._stores || {};
      // 删除全部
      if (!arguments.length) {
        this._stores = {};
        return;
      }
      var store = this._stores[event];
      if (!store) return;
      // 删除同名全部
      if (arguments.length === 1) {
        delete this._stores[event];
        return;
      }
      // 删除单独
      var cb;
      for (var i = 0, len = store.length; i < len; i++) {
        cb = store[i].cb;
        // 判断匿名函数是否一致，因为前面已经判断是否属于同一作用域，所以直接执行tostring()判断
        if (cb.toString() == fn.toString()) {
          store.splice(i, 1);
          break;
        }
      }
      return;
    }
  }, {
    key: 'state',
    get: function get() {
      return (0, _utils.deepCopy)(this.$state);
    },
    set: function set(x) {
      console.error('[wex] is not allowed change state ');
      return;
    }
  }, {
    key: 'Mutation',
    get: function get() {
      return this.$mutations;
    }
  }]);

  return Wex;
}()) || _class;

function unifyPayload() {
  for (var _len3 = arguments.length, payload = Array(_len3), _key3 = 0; _key3 < _len3; _key3++) {
    payload[_key3] = arguments[_key3];
  }

  if (!payload[0].store) {
    payload = {
      store: this,
      args: payload
    };
    return payload;
  }
  return payload[0];
}

function installModule(args, store) {
  store.$state = args.state;
  store.$mutations = args.Mutation;
  store.$committig = false;
  store.$actions = Object.create(null);
  store.$wrappedGetters = Object.create(null);
  store.$subscribers = [];
  store.mapMutations = mapMutations(args.Mutation, store);
}

function mapMutations(mutations, store) {
  var res = {};
  normalizeMap(mutations).forEach(function (ref) {
    var key = ref.key;
    var val = ref.val;

    res[key] = function mappedMutation() {
      var args = [],
          len = arguments.length;
      while (len--) {
        args[len] = arguments[len];
      } // 一个数组缓存传入的参数
      // val作为commit函数的第一个参数type， 剩下的参数依次是payload 和 options
      return store.commit(key, {
        store: store,
        args: args
      });
    };
  });
  return res;
}

function normalizeMap(map) {
  return Array.isArray(map) ? map.map(function (key) {
    return {
      key: key,
      val: key
    };
  }) : Object.keys(map).map(function (key) {
    return {
      key: key,
      val: map[key]
    };
  });
}
exports.Wex = Wex;
//# sourceMappingURL=index.js.map