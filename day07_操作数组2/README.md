# 07 Array Cardio Day2操作数组打卡指南

## 操作功能

**对于people数组**：

1. 判断是否有超过19岁的？
2. 判断是否有所有人都超过19岁？

```javascript
//判断数组里是否有年龄大于等于19岁
    const isAdult = people.some(person => (new Date()).getFullYear-person.year >=19);
    //判断数组里是否所有的年龄都大于等于19岁
    const allAdult = people.every(person => (new Date()).getFullYear - person.year >=19);
```

**对于comments数组**：

1. 查找Id号为823423的评论
2. 删除ID号为823423的评论
   1. 获取此ID元素在数组中的位置
   2. 利用位置，删除该子元素
   3. 或者利用拼接换成新数组

```javascript
// Array.prototype.find() 用于查找某一个元素
    // Find is like filter, but instead returns just the one you are looking for
    // find the comment with the ID of 823423
    const comment = comments.find(item => item.id===823423);
    console.log(comment);

    // Array.prototype.findIndex()
    // Find the comment with this ID
    // delete the comment with the ID of 823423
    const delindex = comments.findIndex(item => item.id == 823423);
    const newComments = [
        ...comments.slice(0,delindex),
        ...comments.slice(delindex)
    ];
    console.table(newComments);
```

## 相关知识

### [some](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Array/some) 和 [every](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Array/every)

两者的相同之处是，都接受一个函数作为参数，对数组元素都执行一次此函数，都不会改变原数组的值。不同之处在于返回条件不同：

`some()` 中直到某个数组元素使此函数为 `true`，就立即返回 `true`。所以可以用来判断一个数组中，是否存在某个符合条件的值。

```javascript
    const isAdult = people.some( person => {
		const currentYear = (new Date()).getFullYear();
		return currentYear - person.year >= 19;
	});
	console.log({isAdult});
```

而 `every()` 中除非所有值都使此函数为 `true`，才会返回 `true` 值，否则为 `false`。主要用处，即判断是否所有元素都符合条件。

```javascript
	const allAdult = people.every( person => new Date().getFullYear() - person.year >= 19);
	console.log({allAdult});
```

与 `some()` 相对应的话，`some()` 像是或运算，而 `every()` 则是与运算了。

### [find](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Array/find) 和 [fineIndex](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Array/findIndex)

这两个 ES6 的新特性类似于 `some()` ，但对于符合条件的元素，返回值不是布尔类型。不一样的地方在于，`find()` 返回的是这个元素的值（或 `undefined`），而 `findIndex()` 返回的是这个元素的索引（或 `-1`）。

```javascript
	const comment = comments.find(comment => comment.id == 823423);
	const index = comments.findIndex(comment => comment.id == 823423);
```

### [slice](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Array/slice) 和 [splice](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Array/splice)

这两者比较相似的地方，大概只有：参数的第一个都是指的起始位置，且都接受负数，若是负数，代表倒数第几位。

而其他地方是需要区分清楚的：

- `slice()`：不修改原数组，按照参数复制一个新数组，参数表述复制的起点和终点索引（省略则代表到末尾），但终点索引位置的元素不包含在内。
- `splice()`：原数组会被修改。第二个参数代表要删掉的元素个数，之后可选的参数，表示要替补被删除位置的元素。

让我们来联想一下，看到一块纹着漂亮花纹的布料，slice 拿出相机拍了一张照，而 splice 拿出剪刀把这个花纹剪下来带走了，再用其他布料给缝回去。

所以想要删除一个元素，有两种实现思路，一是把出它之外的元素给复制下来再合在一起，二是直接把它删除。

```javascript
	// 删除方法一，splice()
	// comments.splice(index, 1);
	
	// 删除方法二，slice 拼接
	const newComments = [
		...comments.slice(0, index),
		...comments.slice(index + 1)
	];
```

上面的三个点（`...`）是 [ES6 中的扩展语法](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Operators/Spread_operator)，可以展开这个数组并方便的拼接。