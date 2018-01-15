## 使用方法

# 初始化&引入

新建一个文件为store.js 
内容为
``` javascript
/**
 * no use strict 
 */
import {
  Wex
} from './tool'
wx.wex = new Wex();
wx.wex.init({
  state: {
    dishesTypeId:1,
  },
  Mutation: {
    getdishesTypeId:()=>{
      return wx.wex.state.dishesTypeId
    },
    setdishesTypeId:(n)=>{
      wx.wex.setState('dishesTypeId',n);
    }
  }
})
```
在入口文件中引入  
``` javascript
import './store'
```
在需要使用的地方
``` javascript
// 如果只是需要使用获取值，设置值
let Mutation = wx.wex.Mutation;
Mutation.setdishesTypeId('3')
// 如果需要是值具有响应功能
wx.wex.on('dishesTypeId', (oj) => {
     this.dishesTypeId = oj;
}, this)
// 使用箭头函数保证作用域指向，在回调填写响应后的变化
// 同一页面内多次订阅同一状态会只记录最后一次订阅，防止多次无意义订阅造成内存泄漏
// 无法直接更改state和mutation，使用wx.wex.history可以查询到全部的变更记录

```