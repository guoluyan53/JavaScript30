# 02 JavaScript Clock 打卡指南

> 作者：@sandystar
>
> 简介：[JavaScript30](https://javascript30.com/) 是 [Wes Bos](https://github.com/wesbos) 推出的一个 30 天挑战。项目免费提供了 30 个视频教程、30 个挑战的起始文档和 30 个挑战解决方案源代码。目的是帮助人们用纯 JavaScript 来写东西，不借助框架和库，也不使用编译器和引用。现在你看到的是这系列指南的第 2 篇。完整代码已经放到github上了，欢迎访问！

## 实现效果

实现一个像日常时钟一样的旋转效果，获取当前的时间，显示当前的效果。

![image-20220207205523672](https://gitee.com/guoluyan53/image-bed/raw/master/img/image-20220207205523672.png)

## 实现要点

1. 怎样让指针进行旋转
2. 怎样获取当前时间
3. 怎样让每一秒都改变一次指针的状态

## 步骤分解

### 1. 让指针旋转

我们知道在css中如果要让某个盒子进行旋转，势必要用到 `transform:rotate()`，所以我们**可以通过动态的修改每个指针的rotate的值来做到指针的动态旋转**。

```css
transition: all .05s;
transform-origin: 100%; /*让旋转的中心在中间*/
transition-timing-function: cubic-bezier(0.42,0,0,34,1,82); /*设置指针回弹式的效果，以实现秒针“滴答滴答”的效果*/
transform: rotate(90deg);  /*开始时让指针停在十二点整*/
```

### 2. 获取当前时间

（1）使用定时器每秒执行一次函数，以便获取每一时刻的时间。

```javascript
setInterval(setDate,1000);
```

（2）获取当前时间和小时、分钟和秒。（如果不知道怎么获取可以尝试打印时间的对象，从而找到对应的方法 `console.log([now])`）

```javascript
const seconds = now.getSeconds();  //获取当前秒
const min = now.getMinutes();
const hour = now.getHours();
```

### 3. 改变指针的状态

（1）计算每个时刻指针所走过的角度。要模拟更真实的时钟

**注：要实现像真正的时钟一样还要加上秒数或分钟数**

```javascript
const secondsDegrees = (seconds*6) + 90;  //秒针旋转的角度
const minsDegrees = (min*6) + ((seconds/60)*6) + 90; //秒针动的时候分针也会跟着动一点
const hourDegrees = (hour*30) + ((min/60)*30) + ((seconds/3600)*30) + 90;
```

（2）动态改变其transform

使用ES6里的模板变量

```javascript
secondHand.style.transform = `rotate(${secondsDegrees}deg)`;
            minsHand.style.transform = `rotate(${minsDegrees}deg)`;
            hourHand.style.transform = `rotate(${hourDegrees}deg)`;
```

## 问题解决

> 2017-01-06 更新完善，感谢 [@cody1991 提的 issue](https://github.com/soyaine/JavaScript30/issues/1)

这里有一个小瑕疵，当秒针旋转一周后回到初始位置，开始第二圈旋转，角度值的变化是 444° → 90° → 96°...这个过程中，指针会先逆时针从444°旋转至90°，再继续玩吗期望的顺时针旋转，由于秒钟变换只有0.05s，所以这个呈现的效果就是秒针闪现了一下。要解决这个问题，目前找到两种方法：

 此处存在一个小瑕疵，当秒针旋转一圈之后回到初始位置，开始第二圈旋转，角度值的变化时 444° → 90° → 96° .... 这个过程中，指针会先逆时针从 444° 旋转至 90°，再继续我们期望的顺时针旋转，由于秒针变换时间只有 0.05s，所以呈现的效果就是秒针闪了一下，如果想要观察细节，可以将 `.second` 设为 `transition: all 1s`。要解决这个问题，目前找到了两种解决办法：

#### 方法一

在这个特殊点将指针的 `transition` 属性去掉，由于距离短、时间短，将逆时针回旋的过程瞬间完成。

```
if (secondDeg === 90) secHand.style.transition = 'all 0s';
else secHand.style.transition = 'all 0.05s';

if (minDeg === 90) minHand.style.transition = 'all 0s';
else minHand.style.transition = 'all 0.1s';
```

#### 方法二

既然引发问题的是角度的大小变化，那就可以对这个值进行处理。此前的代码中，每秒都会重新 new 一个 Date 对象，用来计算角度值，但如果让这个角度值一直保持增长，也就不会出现逆时针回旋的问题了。

这是 @cody1991 提供的思路。只在页面第一次加载时 new 一次 Date 对象，此后每秒直接更新角度值。

```
let secondDeg = 0,
minDeg = 0,
hourDeg = 0;

function initDate() {
	const date = new Date();
	const second = date.getSeconds();
	secondDeg = 90 + (second / 60) * 360;
	const min = date.getMinutes();
	minDeg = 90 + (min / 60) * 360 + ((second / 60) / 60) * 360;
	const hour = date.getHours();
	hourDeg = 90 + (hour / 12) * 360 + ((min / 60) / 12) * 360 + (((second / 60) / 60) / 12) * 360;
}

function updateDate() {
	secondDeg += (1 / 60) * 360;
	minDeg += ((1 / 60) / 60) * 360;
	hourDeg += (((1 / 60) / 60) / 12);
	
	secHand.style.transform = `rotate(${ secondDeg}deg)`;
	minHand.style.transform = `rotate(${ minDeg }deg)`;
	hourHand.style.transform = `rotate(${ hourDeg }deg)`;
}

initDate();
setInterval(updateDate, 1000);
```

问题解决。大功告成！

## 收获

- `setInterval的使用`

`setInterval()` 方法可按照指定的周期（以毫秒计）来调用函数或计算表达式。

`setInterval()` 方法会不停地调用函数，直到 [clearInterval()](https://www.runoob.com/jsref/met-win-clearinterval.html) 被调用或窗口被关闭。由 setInterval() 返回的 ID 值可用作 clearInterv

- 动态的改变css样式

```javascript
dom.style.属性 = 属性值
//例：hourHand.style.transform = `rotate(${hourDegrees}deg)`;
```

- 使用 `transition` `和transform` 实现旋转效果





