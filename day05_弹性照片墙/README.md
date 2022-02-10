# 05 Flex Panel Gallery打卡指南

## 实现效果

要实现一个这样的弹性相册。当鼠标点击相片时，相片变宽并且压缩其他图片，有文字浮入。再次点击图片时，图片会压缩，同时会挤走上下两端的文字。

![image-20220210113814501](https://gitee.com/guoluyan53/image-bed/raw/master/img/image-20220210113814501.png)

## 思路

关于这类的动态效果，我们可以想想，其实动态效果都是使用css来实现的，而JavaScript就是使其css动态的改变。所以我们可以这样做：

1. 先定义好起始的css样式效果
2. 接着定义改变后的css样式效果
3. 然后使用JavaScript去动态添加或删除相应的css样式
4. 这期间想要做到顺滑的过渡要定义好 `transition` 属性

## 步骤

### 1. 定义初始的css样式

我们可以看到最初的相册是整体均分空间，并且当点击某一图片可以做到挤压其余图片扩展自己空间，这里可以想到使用`flex布局`来实现。

并且设置好过渡的 `transition`效果：

```css
.panels {
      min-height: 100vh;
      overflow: hidden;
      display: flex;
    }

.panel {
      background: #6B0F9C;
      box-shadow: inset 0 0 0 5px rgba(255,255,255,0.1);
      color: white;
      text-align: center;
      align-items: center;
      /* Safari transitionend event.propertyName === flex */
      /* Chrome + FF transitionend event.propertyName === flex-grow */
      transition:  /*添加动画效果*/
        font-size 0.7s cubic-bezier(0.61,-0.19, 0.7,-0.11),
        flex 0.7s cubic-bezier(0.61,-0.19, 0.7,-0.11),
        background 0.2s;
      font-size: 20px;
      background-size: cover;
      background-position: center;
      flex: 1;
      justify-content: center;
      display: flex;
      flex-direction: column;
}
 /*设置第一行和第三行元素在缩放时隐藏，这里将他们滑出可视区域*/
    .panel > *:first-child { transform: translateY(-100%); }
    .panel > *:last-child { transform: translateY(100%); }

```

### 2. 定义变化后的css样式

这里的 `.open-active` 和 `.open` 都是动态添加的样式，表示转换后给元素添加上的动态效果。

```css
 /*当照片打开时将第一行和第三行的元素滑入可视区*/
    .panel.open-active > *{
      transform: translateY(0);
    }
 /*定义图片打开时的样式---动态添加*/
    .panel.open {
      flex: 5;  /*宽度扩展*/
      font-size: 40px; /*字体变大*/
    }
```

### 3. 用JavaScript控制css的效果

获取每个图片的 `.panel` 属性，遍历 `.panels`为每个模块添加监听事件，当点击时就触发监听函数：

```javascript
const panels = document.querySelectorAll('.panel');

    function toggleOpen(){
        //console.log(this);
        this.classList.toggle('open'); //toggle:如果类值已存在，就移除它，否则就添加
    }
    function toggleActive(e){
        console.log(e.propertyName);
        if(e.propertyName.includes('flex')){
            this.classList.toggle('open-active');
        }
    }
    panels.forEach(panel => panel.addEventListener('click',toggleOpen));
    panels.forEach(panel => panel.addEventListener('transitionend',toggleActive));
```

> 这里的 `toggle`表示如果类值已存在，就移除它，否则就添加它，可以完美解决伸缩和扩展时对类的添加和删除。

## 思考

原方案的解决方法是定义了`两个`click触发时间的函数，将文字的移动用 `.open-active`来控制，同时还加上了 `transitionend`的监听事件。

但是这样做不仅麻烦还有一个问题：当快速点击两下时，会出现相反的结合（图片缩小 + 上下文字出现）。这显然不是我们想要的效果。

其实可以都只用一个 `.open`类来实现，既然效果是 **图片扩展+文字滑入** ，那可以利用 `transition`的 `delay`属性，来实现文字延迟与图片滑入。

```css
.panel > * {
	/* ... */
	transition:transform 0.5s 0.7s;
}

/* 修改 .open-actived -> .open*/
.panel.open > * {
	transform: translateY(0);
}
```

```javascript
const panels = document.querySelectorAll('.panel');

    function toggleOpen(){
        //console.log(this);
        this.classList.toggle('open'); //toggle:如果类值已存在，就移除它，否则就添加
    }
    panels.forEach(panel => panel.addEventListener('click',toggleOpen));
```

这样就完美解决了问题又简化了代码。

## 所获

### [Flex](https://developer.mozilla.org/zh-CN/docs/Web/CSS/CSS_Flexible_Box_Layout/Using_CSS_flexible_boxes)

这一个挑战的关键部分就在于理解如何使用 Flexbox，挑战的文档里嵌套了三个 flex 容器，作为弹性盒子，它们各自的作用是：

- `.panels`：使其中的 `.panel` 按横向的 flex 等分排布（此处为五等分）
- `.panel`：使其中的 `<p>` 按纵向的 flex 等分排布（此处为三等分）
- `p` ：借用 flex 相对于主轴及侧轴的对齐方式，使其中的文字垂直水平居中

这里容易混淆的是不同 CSS 属性的应用对象，想区分很简单，只需记住针对容器内子元素的特性较少（只有 5 个），可以这样联想：针对某一个具体的小元素进行设置，可供发挥的空间比较少，而针对 Flex 容器本身，有统筹大局的责任，故特性多一些。下面简单介绍一些基本的特性（没有完全列出）。

#### 针对 Flex items 的特性（Children）

- `flex-growth`：伸展值
- `flex-shrink`：可接受的压缩值
- `flex-basis`：元素默认的尺寸值
- `flex`：以上三个值按顺序的缩写

#### 针对 Flex container 的特性（Parent）

- `display: flex`：将这个元素设置成弹性盒子

- ```
  flex-direction
  ```

  ：主轴方向

  - `row`：横向
  - `column`：纵向

- `justify-content`：沿主轴的的对齐方式

- `align-items`：沿侧轴的对齐方式

- `align-content`：子元素中文本沿侧轴的对齐方式（只有一行时无效）

可以在下面几个地方试一下 Flex 的各种特性：

- http://demo.agektmr.com/flexbox/
- http://the-echoplex.net/flexyboxes/
- http://codepen.io/justd/pen/yydezN

### [classList](https://developer.mozilla.org/zh-CN/docs/Web/API/Element/classList)

`Element.classList` 是一个只读属性，返回一个元素的类属性的实时 [`DOMTokenList`](https://developer.mozilla.org/zh-CN/docs/Web/API/DOMTokenList) 集合。

相比将 [`element.className`](https://developer.mozilla.org/zh-CN/docs/Web/API/Element/className) 作为以空格分隔的字符串来使用，`classList` 是一种更方便的访问元素的类列表的方法。

### [toggle](https://developer.mozilla.org/zh-CN/docs/Web/API/DOMTokenList/toggle)

[`DOMTokenList`](https://developer.mozilla.org/zh-CN/docs/Web/API/DOMTokenList) 接口的 `toggle()` 方法从列表中删除一个给定的*标记* 并返回 `false` 。 如果*标记* 不存在，则添加并且函数返回 `true`。

