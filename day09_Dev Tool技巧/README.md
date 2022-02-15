# 09 Dev Tools Domination打卡指南

## 实现效果

也没有什么效果，主要是在console面板的调试技巧。可以打开F12查看输出结果。

## console的类型

### 1、给页面标签添加断点

在按F12出现的Chrome开发工具中，在Elements选项卡之中，选择页面的某个标签，右键---break on ----Attributes-----modifications。即可为该元素添加断点，当它的属性发生改变时，会自动定位到页面代码中的对应行。

![image-20220215104202950](https://gitee.com/guoluyan53/image-bed/raw/master/img/image-20220215104202950.png)

### 2、.log的更多用法

支持字符串的替换模式：

- `%s`字符串
- `%d`整数
- `%c`：设定输出的样式，在之后的文字将按照第二个参数里的值进行显示

```javascript
console.log("你好，我是%s","张杰");
console.log('%c I am some great text', 'font-size:50px; background:red; text-shadow: 10px 10px 0 blue');
```

### 3、warn、error、info

除了常规的 log 之外，还有其他已经设定好的样式，区别在于图标或者颜色不一样：

```javascript
// warning! 警告
console.warn('OH NOOO');
// Error :| 错误
console.error('Shit!');
// Info 
console.info('Crocodiles eat 3-4 people per year');
```

![image-20220215105031953](https://gitee.com/guoluyan53/image-bed/raw/master/img/image-20220215105031953.png)

### 4、dir 打印输出DOM元素的属性列表

获取DOM元素之后，可以打印输出

```javascript
const p = document.querySelector('p');
console.log(p);
console.dir(p);
```

![image-20220215110624809](https://gitee.com/guoluyan53/image-bed/raw/master/img/image-20220215110624809.png)

### 5、clear

清空console面板输出内容。

```javascript
console.clear();
```

### 6、asset

测试。接收一个表达式作为参数，如果参数返回值是false，则会输出第二个参数中的内容。

```javascript
console.assert(p.classList.contains('ouch'), 'That is wrong!');
```

### 7、table

以表格的方式输出数据。`console.log()`可将数组、对象以表格的形式打印输出，如果只输出其中的某一列，可以加上第二个参数。

```javascript
console.table(dogs);
console.table(dogs, ["age"]);
```

### 8、分组展示数据

```javascript
const dogs = [{ name: 'Snickers', age: 2 }, { name: 'hugo', age: 8 }];
dogs.forEach(dog => {
	console.group();		
//	console.groupCollapsed();  // 收起列表
	console.log(`${dog.name}`);
	console.log(`${dog.age}`);
	console.log(`${dog.name} 有 ${dog.age} 岁了`);
	console.groupEnd();
});
```

这个例子中，`group()`/`groupCollapsed()` 与 `groupEnd()` 之间的内容会自动分组，区别在于是否自动展开。效果类似于 Excel 中的分类汇总的简易版。

![image-20220215111201364](https://gitee.com/guoluyan53/image-bed/raw/master/img/image-20220215111201364.png)

### 9、count计数

这里的计数对象仅限于由 `count()` 输出的内容，并非所有 console 中的输出。

```javascript
console.count('Wes');
console.count('Wes');
console.count('Steve');
console.count('Steve');
```

### 10、time计时

用 `time("name")` 和 `timeEnd("name")` 分别控制开始点和结束点，它们两的参数表示当前计时的名称，可以自定义但需要保持相同。所以如果想看异步获取数据花了多场时间，可以这样写：

```javascript
console.time('fetch my data');
fetch("https://api.github.com/users/soyaine")
  .then(data => data.json())
  .then(data => {
  console.timeEnd('fetch my data');
  console.log(data);
});
```

如果 timeEnd 中的名称如果和上面不一样，得到的数据是系统当前时间换算后的毫秒值。

