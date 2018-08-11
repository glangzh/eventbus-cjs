# eventbus-cjs

> **eventbus-cjs** 是一个基于JavaScript装饰器（Decorator）实现的通信库, 支持Vue / React等常用框架, 支持node.js
 [![tests](https://travis-ci.org/glangzh/eventbus-cjs.svg?branch=master)](http://travis-ci.org/glangzh/eventbus-cjs)
 [![npm](https://img.shields.io/npm/v/eventbus-cjs.svg?style=flat-square)](https://www.npmjs.com/package/eventbus-cjs) [![npm](https://img.shields.io/npm/dt/eventbus-cjs.svg?style=flat-square)](https://www.npmjs.com/package/eventbus-cjs) [![npm](https://img.shields.io/npm/l/eventbus-cjs.svg?style=flat-square)](https://www.npmjs.com/package/eventbus-cjs)

## 使用方法
**1. 安装**
```sh
npm i eventbus-cjs --save
```
**Babel 转码器的支持**

安装 babel-plugin-transform-decorators-legacy
```sh
npm i babel-plugin-transform-decorators-legacy -D
```
配置 .babelrc 文件
```json
"plugins": ["transform-decorators-legacy"]
```
**如果是使用 create-react-app 创建的项目，需要先弹出 webpack 配置**
```sh
npm run eject
```
**安装 babel-plugin-transform-decorators-legacy，在 package.json  中配置 babel**
```json
"babel": {
    "presets": [
        "react-app"
    ],
    "plugins": [
        "transform-decorators-legacy"
    ]
  }
```
**vue-cli 3.x 以默认支持 Decorator。**

**2. 引入 eventbus-cjs**
```js
import { on, once, emit } from 'eventbus-cjs';
```

## 修饰器
##### 属性方法修饰器
* [@on](#on)
* [@once](#once)
* [@emit](#emit)
* [@remove](#remove)
* [@register](#register)
* [@unregister](#unregister)

##### 类修饰器
* [@register](#register)

**3. 使用**

### @emit
> 发送消息
```js
@emit('event_a')
send(msg) {
    return 'send ' + msg;
};
```

### @on
> 监听消息， 注意在Vue属性方法上监听，vue.methods中的方法无法监听
```js
@on('event_a')
onMessageA(msg) {
   
};
// vue
@register
created(){
    
},
@on('event_a')
onMessage(msg){
    // 和生命周期函数相似的 this
}
```

### @once
> 监听消息，只执行一次, 注意在Vue属性方法上监听，vue.methods中的方法无法监听
```js
@once('event_once')
onmessage(msg) {
    console.log(msg);
};
```

### @remove
> 移除当前对象监听的事件
```js
@remove('event_a', 'event_b')('onMessageA')
// @remove('event_a', 'event_b')('onMessageA', 'onMessageB')
// @remove('event_a', 'event_b')(['onMessageA1', 'onMessageA2'])
// @remove('event_a', 'event_b')(['onMessageA1', 'onMessageA2'], 'onMessageB')
// @remove('event_a', 'event_b')()
// @remove()()  //释放掉当前对象所监听的所有事件，等同于 @unregister
componentWillUnmount() {
    
}
// vue
@remove()()
beforeDestory(){

}
```

### @register
> @register 和 @unregisster 最好同时配置

> **Vue中必须进行注册才能正确监听消息，需在生命周期方法上注册，越早越好**
```js
// react
@register
class MyComponent extends Component{

}

// vue
export default {
    @register
    created() {

    }
}
```
> 通过@register修饰的对象可以直接通过 this.$emitter 对象发送、接收消息
```js
this.$emiiter.emit(eventName, msg);
this.$emiiter.on(eventName, function(){
    // receive messages
})
```

### @unregister
> 释放掉当前对象所监听的所有事件
```js
@unregister
componentWillUnmount() {
    
}
// vue
@unregister
beforeDestory(){

}
```