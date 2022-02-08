# 03 JS_CSS Variable 打卡指南

> 作者：@sandystar
>
> 简介：[JavaScript30](https://javascript30.com/) 是 [Wes Bos](https://github.com/wesbos) 推出的一个 30 天挑战。项目免费提供了 30 个视频教程、30 个挑战的起始文档和 30 个挑战解决方案源代码。目的是帮助人们用纯 JavaScript 来写东西，不借助框架和库，也不使用编译器和引用。现在你看到的是这系列指南的第 3 篇。完整代码已经放到github上了，欢迎访问！

## 实现效果

要实现拖动进度条改变相应的边框和模糊程度，以及可以选择相应的颜色。同时标题中的JS两字和颜色也随图片边框颜色变化而变化。

![image-20220208113749921](https://gitee.com/guoluyan53/image-bed/raw/master/img/image-20220208113749921.png)

## 问题分解

1. 怎样改变边框大小、模糊程度、颜色（改变css属性）
2. 滑动条和选取颜色怎么实现？（利用CSS3中input的新特性）
3. js如何实时更新css的值？（添加监听事件）

## 实现要点

- `:root`
- `var(--XXX)`：CSS变量
- `filter:blur()`：模糊程度
- 事件 `change` 、`mousemove`

## 步骤分解

### 1. 定义全局的css变量

```css
:root{
        --spacing:5px;
        --blur: 2px;
        --base: #ffc555;
}
```

### 2. 将变量对应到页面中对应元素的属性

```css
img{
       padding: var(--spacing);
       filter: blur(var(--blur));
       background: var(--base);
}
.h1{
       color: var(--base);
}
```

### 3. 获取控件

```javascript
//获取控件，NodeList
const inputs = document.querySelectorAll('.controls input');
```

### 4. 添加监听事件

```javascript
function handUpdate(){
    //获取单位px或者颜色是没有单位的为空
    const suffix = this.dataset.sizing || '';
    //console.log(suffix);
    document.documentElement.style.setProperty(`--${this.name}`,this.value + suffix);
}
//遍历nodeList，为每个控件添加监听事件
inputs.forEach(input => input.addEventListener('change',handUpdate));
```

## 收获

**1. NodeList 和 Array的区别**

- NodeList有 `forEach()`、`keys()`等。
- Array的prototype有 `map()`、`pop()`等数组才有的方法。

**2. HTML5中自定义数据属性 `dataset`**

HTML5中可以为元素添加非标准的自定义属性，只需要加上 `data-`前缀。可以随便添加和命名。添加之后，可以通过元素的 `dataset`属性来访问这些值，`dataset`的值是DOMStringMap的一个实例化对象，其中包含之前所设定的自定义属性的 “名-值”对。

```javascript
<input id="blur" type="range" name="blur" min="0" max="25" value="10" data-sizing="px">
const suffix = this.dataset.sizing || '';
```

这里获取的就是`px`。

**3. :root伪类**

这个伪元素匹配的是文档的根元素，也就是 `<html>`标签。所以常用于声明全局的css变量：

```css
:root {
  --color: #fff;
}
```

使用：

```css
img {
  background: var(--base);
}
```

**4. css variable**

这是一个css3的新特性，IE和Edge目前都还不支持。命名写法是 `--变量名`，引用是 `var(--变量名)`

**5. CSS 滤镜 [filter](https://developer.mozilla.org/zh-CN/docs/Web/CSS/filter)**

css的滤镜提供了一些图形特效，比如高斯模糊、锐化、变色等，它带有一些预设的函数，在使用时加上参数调用这些函数即可。

**6. document.documentElement**

在 JavaScript 中 `document.documentElement` 即代表文档根元素。所以要改变全局的 CSS 变量，可以这样写：

```javascript
document.documentElement.style.setProperty('--base', '#fff');
```



