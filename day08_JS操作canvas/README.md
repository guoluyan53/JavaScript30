# 07 Fun with HTML5 Canvas打卡指南

## 实现效果

使用canvas实现一个可以在浏览器中画画的效果。画笔粗细渐变，颜色渐变。

![image-20220214113020732](https://gitee.com/guoluyan53/image-bed/raw/master/img/image-20220214113020732.png)

## 实现要点

**【canvas】**：

基本属性：

- [getContext()](https://developer.mozilla.org/zh-CN/docs/Web/API/HTMLCanvasElement/getContext) ：方法返回`canvas` 的上下文，如果上下文没有定义则返回null
- [strokeStyle()](https://developer.mozilla.org/zh-CN/docs/Web/API/CanvasRenderingContext2D/strokeStyle)：是 Canvas 2D API 描述画笔（绘制图形）颜色或者样式的属性。默认值是 `#000` (black)
- [lineJoin](https://developer.mozilla.org/zh-CN/docs/Web/API/CanvasRenderingContext2D/lineJoin)：是 Canvas 2D API 用来设置2个长度不为0的相连部分（线段，圆弧，曲线）如何连接在一起的属性（长度为0的变形部分，其指定的末端和控制点在同一位置，会被忽略）。
- [lineCap()](https://developer.mozilla.org/zh-CN/docs/Web/API/CanvasRenderingContext2D/lineCap)：是 Canvas 2D API 指定如何绘制每一条线段末端的属性。有3个可能的值，分别是：`butt`, `round` and `square`。默认值是 `butt。`
- [lineWidth()](https://developer.mozilla.org/zh-CN/docs/Web/API/CanvasRenderingContext2D/lineWidth)：是 Canvas 2D API 设置线段厚度的属性（即线段的宽度）。

路径绘制：

- [beginPath()](https://developer.mozilla.org/zh-CN/docs/Web/API/CanvasRenderingContext2D/beginPath)：是 Canvas 2D API 通过清空子路径列表开始一个新路径的方法。 当你想创建一个新的路径时，调用此方法。
- [lineTo()](https://developer.mozilla.org/zh-CN/docs/Web/API/CanvasRenderingContext2D/lineTo)：是 Canvas 2D API 使用直线连接子路径的终点到x，y坐标的方法（并不会真正地绘制）。
- [moveTo()](https://developer.mozilla.org/zh-CN/docs/Web/API/CanvasRenderingContext2D/moveTo)：是 Canvas 2D API 将一个新的子路径的起始点移动到(x，y)坐标的方法。
- [stroke()](https://developer.mozilla.org/zh-CN/docs/Web/API/CanvasRenderingContext2D/stroke)：是 Canvas 2D API 使用非零环绕规则，根据当前的画线样式，绘制当前或已经存在的路径的方法。

**【鼠标事件】**：

- `mousedown`：鼠标按下
- `mouseup`：鼠标抬起
- `mousemove`：鼠标移动
- `mouseout`：鼠标移出界限

## 实现步骤

1. 获取 HTML 中的 `<canvas>` 元素，并设定宽度和高度
2. `.getContext('2d')` 获取上下文，下面以 ctx 表示
3. 设定 ctx 基本属性
   - 描边和线条颜色
   - 线条宽度
   - 线条末端形状
4. 绘画效果
   1. 设定一个用于标记绘画状态的变量
   2. 鼠标事件监听，不同类型的事件将标记变量设为不同值
   3. 编写发生绘制时触发的函数，设定绘制路径起点、终点
5. 线条彩虹渐变效果（运用 hsl 的 `h` 值的变化，累加）
6. 线条粗细渐变效果（设定一个范围，当超出这个范围时，线条粗细进行逆向改变

## 所获

### [Canvas](https://developer.mozilla.org/zh-CN/docs/Web/API/Canvas_API)

首先需要了解最基本的 Canvas 用法，创建一个可以绘画的环境，由对某个元素获取其用于渲染的上下文开始：

```
var canvas = document.getElementById('canvas');
var ctx = canvas.getContext('2d');
```

对于这个用于渲染的 ctx（请自动替换成上下文这个别扭的词），有一些基本样式属性可供修改，类似于配置你的调色盘：

- `lineCap`：笔触的形状，有 round | butt | square 圆、平、方三种。
- `lineJoin`：线条相较的方式，有 round | bevel | miter 圆交、斜交、斜接三种。
- `lineWidth`：线条的宽度
- `strokeStyle`：线条描边的颜色
- `fillStyle`：填充的颜色

Canvas 让 JS 具备了动态绘制图形的能力，但在这里例子中我们只需要使用到一些简单的[路径绘制方法](https://developer.mozilla.org/zh-CN/docs/Web/API/Canvas_API/Tutorial/Drawing_shapes#绘制路径)，路径是点和线的集合，下面只列举了我们用到的方法：

- `beginPath()`：新建一条路径
- `stroke()`：绘制轮廓
- `moveTo()`：（此次）绘制操作的起点
- `lineTo()`：路径的终点

### 彩虹渐变颜色——HSL

在这个挑战中，涉及到改变线条的颜色，如何实现彩虹的渐变效果？我们需要利用 HSL 色彩模式，首先可以去这个网站 [http://mothereffinghsl.com](http://mothereffinghsl.com/) 感受一下 HSL 不同色彩值对应的效果。

- H(hue) 代表色调，取值为 0~360，专业术语叫色相
- S 是饱和度，可以理解为掺杂进去的灰度值，取值为 0~1
- L 则是亮度，取值也是 0~1，或者百分比。

这之中 H 值从 0 到 360 的变化代表了色相的角度的值域变化，利用这一点就可以实现绘制时线条颜色的渐变了，只需要在它的值超过 360 时恢复到 0 重新累加即可。

```
let hue = 0;

ctx.strokeStyle = `hsl(${ hue }, 100%, 50%)`;	
if(hue >= 360) hue = 0;
hue++;
```

除此之外，如果想实现黑白水墨的颜色，可以将颜色设置为黑色，通过透明度的改变来实现深浅不一的颜色。

## 疑难问题

### 如何让按下鼠标后的轨迹画在画布上？

#### 事件监听部分

解决这个问题，只需要将鼠标绘制时的动作分解清楚。思考或者模拟一下，在用鼠标画一条线时发生了什么：

1. 单击鼠标-按下准备开始
2. 移动鼠标-画线
3. 松开手指-结束画线

这几个分解动作都有对应的鼠标事件，在编写这部分时你可以对每个事件监听 `console.log(e)` 来查看当前触发事件的属性、类型。对应 ctx 的操作的即是第二阶段，所以可以设定 `mousemove` 事件监听触发的函数进行绘制。

```
canvas.addEventListener('mousemove', draw);
```

但只有这个并不够，你会发现只有 `mousemove` 事件监听时，只要鼠标在页面上划过都会触发函数。这时我们需要一个标记变量，来控制当前鼠标是不是处在按下的状态。

```
let isDrawing = false;

canvas.addEventListener('mousedown', isDrawing = true);
canvas.addEventListener('mousemove', draw);
canvas.addEventListener('mouseup', () => isDrawing = false);
canvas.addEventListener('mouseout', () => isDrawing = false); // 鼠标移出画布范围时
```

#### Canvas 绘制部分

处理好事件监听，就可以编写绘制时触发的函数了。

```
[lastX, lastY] = [e.offsetX, e.offsetY];
ctx.beginPath();
// 起点
ctx.moveTo(lastX, lastY);
// 终点
ctx.lineTo(e.offsetX, e.offsetY);
ctx.stroke();
```

此处再次引入两个变量，用于存放上一次绘制线条的终点。但这个写法有一点小问题。

### 如何解决线条的衔接问题？

回想一下你点进来看顶部的示例动图时，有没有注意到一个细节，中间的两个数字是由一些点构成的，而不是一条线，这是由于我写的时候速度过快造成的，这是为什么呢？是我忽略了一个问题，上面这种写法下，`lastX` 和 `offsetX` 的值其实是相等的，这就出现了只绘制出一个个点的状况，所以需要改变一下更新 last 值的位置。

```
function draw() {
	/* ... */
    ctx.beginPath();
    // 起点
    ctx.moveTo(lastX, lastY);
    // 终点
    ctx.lineTo(e.offsetX, e.offsetY);
    ctx.stroke();
    [lastX, lastY] = [e.offsetX, e.offsetY];	
	/* ... */
}

/*..*/

canvas.addEventListener('mousedown', (e) => {
	isDrawing = true;
	[lastX, lastY] = [e.offsetX, e.offsetY];
	// 同样效果的写法：
	lastX = e.offsetX;
	lastY = e.offsetY;
});
```

注意箭头函数里的参数 `e` 别忘记写。修复好问题之后，效果是下面这样，也就不会出现题图中的断断续续的情况了，此处我设置了透明度方便理解，可以观察到，当移动速度加快时，两个坐标之间会自动以直线连接起来。

### 如何让线条的颜色和粗细发生渐变？

上面已经简单介绍了 HSL 的独特性质，那如何把这个特性应用起来呢？很简单，只需要在每次新建路径时添加一个判断和累记的操作即可。颜色需要控制它的 H 值在 0~360 之间变化。

而线条粗细也是一样的道理，只需要保证它在你期望的范围内。在这里可以引入一个布尔类型的标记变量，用它的值来控制线条是变粗还是变细，在线条粗细超过我们需要的范围时，将它取反。

```
let direction = true;
ctx.lineWidth = 90;

// 控制笔触大小
if(ctx.lineWidth > 100 || ctx.lineWidth < 80) {
	direction = !direction;
} 
if (direction) {
	ctx.lineWidth++;
} else {
	ctx.lineWidth--;
}
```

## 延伸思考

在手机上或者触摸屏上操作时，用鼠标并不是最好的操作方式，所以我添加了触摸操作的事件处理，但由于触摸事件中可以获取到的坐标属性名，与鼠标事件不相同，如果要同时支持触摸绘图，需要判断事件类型。

```
// 处理鼠标点击操作
if(e.type == "mousemove"){
	x = e.offsetX;
	y = e.offsetY;
} else  {
// 处理触摸屏操作
	x = e.changedTouches[0].clientX;
	y = e.changedTouches[0].clientY;
}
```

这样一来，你在手机 Chrome 上也可以试一试这个网页绘图板的效果。