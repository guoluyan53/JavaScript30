# 01 JavaScript Drum Kit 打卡指南

> 作者：@sandystar
>
> 简介：[JavaScript30](https://javascript30.com/) 是 [Wes Bos](https://github.com/wesbos) 推出的一个 30 天挑战。项目免费提供了 30 个视频教程、30 个挑战的起始文档和 30 个挑战解决方案源代码。目的是帮助人们用纯 JavaScript 来写东西，不借助框架和库，也不使用编译器和引用。现在你看到的是这系列指南的第 1 篇。

## 实现效果

模拟打击鼓的页面，在键盘上按下ASDFGHJKL这几个键时，页面上对应的字母的按键样式改变并且发出对应的声音。

![image-20220206095458063](https://gitee.com/guoluyan53/image-bed/raw/master/img/image-20220206095458063.png)

## 实现要点

1. 键盘监听事件
2. 播放声音
3. 改变样式

## 步骤分解

- 按下按键的时候，播放对应的声音
  - 要解决页面中不存在的按键按下问题
  - 要解决连续多次按键从头开始播放问题
- 按下按键时，改变按键的显示效果
  - 这个可以动态的为每次按下添加样式
- 按键效果转换之后，恢复到最初的状态

```javascript
//1.按下按键的时候，播放对应的声音
window.addEventListener('keydown',function(e){
    const audio = document.querySelector(`audio[data-key="${e.keyCode}"]`);
    const key = document.querySelector(`div[data-key="${e.keyCode}"]`);
    if(!audio) return;
    audio.currentTime = 0;
    audio.play();  //播放 
    // console.log(audio);
    //2.按下按钮的时候，改变按键的显示效果
    key.classList.add('playing');  //动态的添加样式
})

//3.按键效果转换之后，恢复到最初的状态
function removePlaying(e) {
    if(e.propertyName !== 'transform') return;
    this.classList.remove('playing');
}
const keys = document.querySelectorAll('.key');
keys.forEach(key => {
    key.addEventListener('transitionend',removePlaying);
})
```

## 难点解决

### 1、如何将按键和页面的按钮对应？

我们知道每个按键都有它对应的ASCLL码，而 `keyCode`属性的值与ASCLL码相同。

`div`和 `audio`标签中都添加了 `data-key`属性，用于存储对应的键码，这样做的目的是，添加键盘监听事件后，触发键盘事件即可获取事件的 `keyCode`属性值。

```javascript
const audio = document.querySelector(`audio[data-key="${e.keyCode}"]`);
const key = document.querySelector(`div[data-key="${e.keyCode}"]`);
```

### 2、如何保证按键被按住不放时，可以马上响起连续鼓点声？

每次播放音频之前，设置播放时间戳为 0：

```
var audio = document.getElementById("video"); 
audio.currentTime = 0;
audio.play();
```

### 3、如何使页面按钮恢复原状？

利用一个叫 [`transitionend`](https://developer.mozilla.org/zh-CN/docs/Web/Events/transitionend) 的事件，它在 CSS transition 结束后会被触发。我们就可以利用这个事件，在每次打鼓的效果（尺寸变大、颜色变化）完成之后，去除相应样式。

在这个页面中，发生 `transition` 的样式属性不止一个（`box-shadow`, `transform`, `border-color`），所以需要添加一个判断语句，使每发生一次按键事件时，只去除一次样式。

```
funciton remove(event) {
  if (event.propertyName !== 'border-left-color') return;
  this.classList.remove('playing');
  // event.target.classList.remove('playing');
}
```

## 收获

### ES6语法

1、`const`：声明一个变量，只能赋值一次。

2、`${}`：模板字面量中用于表示模板字符串的标识。特点是字符串首尾用反引号（`)，内部模板用${}括起来。

### forEach与箭头函数

- forEach方法用于调用数组的每个元素，并将元素传递给回调函数。

```javascript
// ES6
nums.forEach(v => {
	if (v % 5 === 0)
		fives.push(v);
})
```







