# 10 JS实现按住shift的多选功能打卡指南

## 实现效果

当选中某个复选框时，p标签中的文字会显示删除线。如果按下shift，则前面的元素都选择上。也就是：

1. 选中起始元素
2. 按下shift键
3. 再选中结束元素
4. A-B之间的所有项都被选中

![image-20220217100127678](https://gitee.com/guoluyan53/image-bed/raw/master/img/image-20220217100127678.png)

## 实现难点

> 怎样在A-B之间选中复选框？

可以设置一个变量，用来标记这个范围。变量初始值为 `false`，当按下shift键同时选中了某个元素时，遍历所有项，遍历过程中，若遇到A或B，则将标记值取反。同时，将所有标记为 `true`的项设置为选中。

```javascript
//获取勾选框列表
    const checkboxes = document.querySelectorAll('.inbox input[type="checkbox"]');

    let lastChecked;
    function handleCheck(e){
        let inBetween = false;  //定义一个开关变量，用于寻找中间的元素
        //如果按住shift和点击checkbox
        if(e.shiftKey && this.checked){
            //遍历所有的CheckBox，如果是头，则将标记的值设置为true，遇到尾则设置为false
            checkboxes.forEach(checkbox=>{
                if(checkbox === this || checkbox === lastChecked){
                    inBetween = !inBetween;
                    console.log('Starting to check them in between!');
                }
                //因为遇到头和尾才将标记取反，故可将中间遍历的元素的选中
                if(inBetween){
                    checkbox.checked = true;
                }
            });
        }
        lastChecked = this;
    }

//监听每个CheckBox
checkboxes.forEach(checkbox=> {
     checkbox.addEventListener('click',handleCheck);
})
```

> 怎样将文字选中时添加一个删除线？

使用css伪类选择器 `:checked`：表示选中的时的样式

```css
input:checked + p {
      background: #F9F9F9;
      text-decoration: line-through;
}
```

- 这里 + 号表示 选择紧跟选中元素的首个 p 元素。

