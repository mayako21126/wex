## 使用方法

# 初始化&引入

新建一个文件为store.js 
内容为
``` javascript
/**
 * no use strict 
 */
wx.wex = new Wex().init({
  state: {
    obj: '咩咩咩咩',
    TS: 2,
    peopleNum: 0,
    dishesTypeId: 1,
    dishesTypeName: '',
    test:{
      a:1,
      b:{a:2}
    }
  },
  Mutation: {
    getFoodInfo: () => {

    },
    setTest:({setState,args})=>{
      setState('test',args[0])
    },
    getTest:({state})=>{
      return state.test;
    },
    getdishesTypeId: ({state}) => {
      return state.dishesTypeId
    },
    setdishesTypeId: ({setState,args}) => {
      setState('dishesTypeId', args[0] );
    },
    setdishesTypeName: ({setState,args}) => {
      setState('dishesTypeName', args[0] );
    },
    getdishesTypeName: ({state}) => {
      return state.dishesTypeName;
    },
    getObj: ({state}) => {
      return state.obj
    },
    tt: ({state}) => {
      return state.TS
    },
    setTs: ({setState,args}) => {
      setState('TS', args[0])
      
    },
    setObj: ({setState,commit,args}) => {
      setState('obj', args[0])
      commit('setTs',args[0])
    },
    setPeopleNum: ({setState,args}) => {
      setState('peopleNum', args[0] )
    },
    getPeopleNum: ({state}) => {
      return state.peopleNum
    }

  }
});

```
在入口文件中引入  
``` javascript
import './store'
```
在需要使用的地方
``` javascript
// 如果只是需要使用获取值，设置值
    var {
        setPeopleNum,
        getTest,
        setTest
    } = wx.wex.mapMutations;
setTest('test')
// 如果需要是值具有响应功能
wx.wex.on('dishesTypeId', (oj) => {
     this.dishesTypeId = oj;
}, this)
// 使用箭头函数保证作用域指向，在回调填写响应后的变化
// 同一页面内多次订阅同一状态会只记录最后一次订阅，防止多次无意义订阅造成内存泄漏
// 无法直接更改state和mutation，使用wx.wex.history可以查询到全部的变更记录

```
## wex对象提供state(取值),commit(提交方法),on(订阅),emit(触发),off(删除),mapMutations(映射mutations方法),history(变更记录)几个方法

## 在mutaions里参数包含state,setState,commit,args4个参数。