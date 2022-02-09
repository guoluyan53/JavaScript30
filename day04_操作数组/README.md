# day04 Array Cardio day1 数组操作打卡指南

## 实现效果

这个小例子没有什么效果，主要是熟悉Array的几个基本方法。文档给出了一个初始操作的数组，基于这个数组熟悉Array的各个方法，可以打开控制面板查看输出结果。

## 问题求解

1. 筛选出出生在16世纪的发明家
2. 用一个数组来展示姓名（first and last name）
3. 根据出生日期，从大到小对发明家进行排序
4. 计算所有发明家一个活了多久
5. 根据活的时间对发明家进行排序
6. 筛选出一个网页里含有某个词语的标题
7. 按照姓氏对发明家进行排序
8. 统计出数组中各个物品的数量

## 所获知识

### [filter](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Array/filter)

过滤操作。筛选出的结果是选项为true的数组返回。

```javascript
// 1. Filter the list of inventors for those who were born in the 1500's
const fifteen = inventors.filter(function(inventor){
    if(inventor.year >= 1500 && inventor.year < 1600){
         return true;
    }
});
console.table(fifteen);  //以表格的形式输出
```

使用箭头函数,if语句的存在不是必要的：

```javascript
const fifteen = inventors.filter(inventor => inventor.year>=1500 && inventor.year<1600);
```

### [map](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Array/map)

map() 方法创建一个新数组，即把数组中的每个元素进行处理后，返回一个新的数组。

```javascript
// 2. Give us an array of the inventors first and last names
const fullNames = inventors.map(function(inventor){
        return inventor.first+' '+inventor.last;
})
console.log(fullNames);
```

ES6箭头函数：

```javascript
const fullNames = inventors.map(inventor => `${inventor.first} ${inventor.last}`);
```

### [sort](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Array/sort)

默认情况下，`Array.prototype.sort()` 会将数组以字符串的形式进行升序排列（10 会排在 2 之前），但 sort 也可以接受一个函数作为参数。所以需要对数字大小排序时需要自己设定一个比较函数.

```javascript
const olders = inventors.sort((a,b)=>{
        return b.year - a.year;
})
console.table(olders);
```

### [reduce](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Array/Reduce)

这是一个归并数组的方法，它接受一个函数作为参数（这个函数可以理解成累加器），它会遍历数组的所有项，然后构建一个最终的返回值，这个值就是这个累加器的第一个参数。例子如下：

```javascript
[0,1,2,3,4].reduce(function(previousValue, currentValue, index, array){
  return previousValue + currentValue;
});
```

而此处我们需要统计一个给定数组中各个项的值，恰好可以用到这个方法，在累加器之中，将统计信息存入一个新的对象，最后返回统计值。

```javascript
const data = ['car', 'car', 'truck', 'truck', 'bike', 'walk', 'car', 'van', 'bike', 'walk', 'car', 'van', 'car', 'truck' ];
const reduce = data.reduce( (obj, item) => {
	if( !obj[item]  ) { //当遇见新的字符串时，将他的初始数量值设置为0
		obj[item] = 0;
 }
	obj[item]++;
	return obj;
}, {});  //后面的{}是初始化obj为一个空对象
console.log(reduce);
```

### filter和map可以结合使用

即可以先获取指定的数组结合，然后再从里面筛选符合条件的数组项。

```javascript
const category = document.querySelector('.mw-category');
    const links = Array.from(category.querySelectorAll('a')); //将nodelist转换为数组
    const de = links
                    .map(link => link.textContent)  //获取所有a标签里的文本
                    .filter(streeName => streeName.includes('de'));  //将符合条件的城市名筛选出来
console.log(de);
```

> 需要提一点，由 `querySelectorAll()` 获取到的是一个 NodeList ，它并非是 Array 类型的数据，所以并不具有 `map` 和 `filter` 这样的方法，所以如果要进行筛选操作则需要把它转化成 Array 类型，使用下面示例之中的 `Array.from()` 来转化。

### console.table()

这个真的是非常好用和舒服。 `console.table()`可以将结果按照表格输出：

非常的直观明了！！！

![image-20220209130308255](https://gitee.com/guoluyan53/image-bed/raw/master/img/image-20220209130308255.png)

### ES6数组的结构赋值

左边可以给出数组的结构，右边按照结构进行赋值。可以取出左边相应位置的值：

```javascript
 // 7. sort Exercise
// Sort the people alphabetically by last name
const az = people.sort((a,b)=>{
    const [aFirst,aLast] = a.split(', ');  //es6里的自动赋值
    const [bFirst,bLast] = b.split(', ');
    return aLast > bLast ? 1:-1;
})
console.log(az);
```

