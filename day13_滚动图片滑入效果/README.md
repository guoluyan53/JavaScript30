# 13 Slide in on Scroll 滑动滑入效果 打卡指南

## 实现效果

实现鼠标滚动到图片一般位置是，图片从两侧滑入；看不见图片时，图片向两侧滑出。

也就是鼠标滚动到指定位置，图片的滑动效果。



![image-20220219170153791](https://gitee.com/guoluyan53/image-bed/raw/master/img/image-20220219170153791.png)

![image-20220219170217710](https://gitee.com/guoluyan53/image-bed/raw/master/img/image-20220219170217710.png)

## 解决问题

- 怎样监听滚动了多少长度？
- 怎样使图片有滑入滑出的效果？（结合css）
- 怎样防抖？

## 实现要点

- `scroll`监听事件
- `window.scrollY` 获取已经滚出屏幕的长度
- `window.innerHeight` 获取可视屏幕的长度
- `el.height` 获取元素的高度
- `el.offsetTop` 当前元素顶部相对其 `offsetParent` 元素顶部的距离。

## 实现步骤

### 1. 获取页面中所有的图片元素

```javascript
const images = document.querySelectorAll('.slide-in');
```

### 2. 滚动监听事件

```javascript
//监听
window.addEventListener('scroll',checkSlide);
//防抖
//window.addEventListener('scroll',debounce(checkSlide));
```

### 3. 滚动高度获取以及处理

![尺寸示意图](https://gitee.com/guoluyan53/image-bed/raw/master/img/68747470733a2f2f636c2e6c792f3077337031763179337131342f496d616765253230323031372d30372d3138253230617425323031302e32342e31302532302545342542382538412545352538442538382e706e67)

```javascript
//滑到图片一半的位置
const slidein = (window.scrollY+window.innerHeight)-image.height/2;
//滑到图片底部的位置
const slideBottom = image.offsetTop + image.height;
```

### 4. 滚动至指定区域的条件判断

需要利用两个临界点来判断图片是否处在需要显示的区域内，故利用两个值来存取此条件的结果（以保证每次事件监听的结果赋值给常亮后，不会随 `window` 的属性值变化）。

对于满足显示条件的，给此图片添加 `.active` 类，不满足的则去掉：

```javascript
const isHalfShown = slidein > image.offsetTop;
const isNotScrolledPast = window.scrollY < slideBottom;
if(isHalfShown && isNotScrolledPast){
       image.classList.add('active');
}else{
       image.classList.remove('active');
}
```

### 5. 防抖函数

降低事件监听的频率，使用了Lodash中的 debounce方法。

```javascript
//防抖函数，防止调用的次数太多
function debounce(func, wait = 20, immediate = true) {
   var timeout;
   return function() {
      var context = this, args = arguments;
      var later = function() {
          timeout = null;
          if (!immediate) func.apply(context, args);
        };
      var callNow = immediate && !timeout;
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
      if (callNow) func.apply(context, args);
   };
}
```

