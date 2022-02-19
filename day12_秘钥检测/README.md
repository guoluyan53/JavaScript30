# 12 Key Sequence Detection密钥检测 打卡指南

## 实现效果

当在页面完整输入了“暗号”（一串事先定义好的字符串）时，生成Cornify特效。

从 [Cornify.com](https://www.cornify.com/)加载一个JS文件，调用其中的 `Cornify_add()`方法时，会在页面中追加 `p`标签，并在DOM中插入一个图标。Cornify的具体效果可以到官网去体验。

![image-20220219095830735](https://gitee.com/guoluyan53/image-bed/raw/master/img/image-20220219095830735.png)

## 实现要点

- `keyup`键盘点击事件
- `splice`切分数组并返回
- `join`将数组里的元素以空格分隔
- `includes`判断数组里是否包含某个字符串

```javascript
const pressed = [];
const secretCode = 'wesbos';

window.addEventListener('keyup', (e) => {
  console.log(e.key);
  pressed.push(e.key);
  pressed.splice(-secretCode.length - 1, pressed.length - secretCode.length);
  if (pressed.join('').includes(secretCode)) {
    console.log('DING DING!');
    cornify_add();
  }
  console.log(pressed);
});
```

