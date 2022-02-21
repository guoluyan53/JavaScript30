# 14 JS中的引用与复制

## 实现效果

主要是来感受一下JS中对不同数据类型的引用和复制的区别。

## 操作过程

### 1. 对于原始数据类型

String、Number、Boolean类型的值

```javascript
let name = zhang;
let name2 = name;  //zhang
name = li;  //此时name2还是zhang
```

首先声明了一个String型的变量 `name`，并将此变量赋值给另一个变量 `name2`，这时两个变量的值都是zhang。然后将name的值赋值为li，可见对 `name`的修改并不会对 `name2`造成影响。

### 2. 对于引用数据类型

#### 【数组】

（浅拷贝）

```javascript
const arr = ['red','blue','yellow','white'];
const color = arr; //color为['red','blue','yellow','white'];
color[2] = 'black'; //arr和color都为 ['red','blue','black','white'];
```

修改`color`中的值，发现原数组 `arr`中的值也被修改了。这是因为 `color`只是这个数组的引用，并不是它的复制。 `arr`和 `color`这两个变量指向的是同一个数组。

<u>**那如何实现真正的复制？（深拷贝）**</u>

- **方法一 `Array.prototype.slice()`**

由于运行 `slice`得到的结果是一个对原数组的浅拷贝，原数组不会修改。所以如果修改这两个数组中任意一个，另一个都不会受到影响。

```javascript
const color2 = arr.slice();
color2[2] = 'black'; //这里arr的值不会改变
```

- **方法二 `Array.prototype.concat()`**

`concat()`方法是用来合并数组的，它也不会更改原有的数组，而是返回一个新数组，所以可以将 `arr`数组与一个空数组合并，得到的结果就符合预期了。

```javascript
const color3 = [].concat(arr);
color3[2] = 'black'; //arr的值也不会改变
```

- **方法三 `ES六扩展语法...`**

扩展语法可以像扩展参数列表一样来扩展数组，效果与上述方法类似，但比较简洁。

```javascript
const color4 = [...arr];
color4[2] = 'black'; //arr的值也不会改变
```

- **方法四 `Array.from()`**

此外使用Array创建新的数组实例的方法也是可行的

```javascript
const color5 = Array.from(arr);
color5[2] = 'black';
```

> 除此之外，还可以用 `push`方法。

#### 【Object类型】

```javascript
const person = {
   name: 'Wes Bos',
   age: 80
 };
const captain = person;
captain.number = 99;
console.log(person, captain);
// Object {name: "Wes Bos", age: 80, number: 99} 
// Object {name: "Wes Bos", age: 80, number: 99}
```

这样做person的值也被修改了。

**如何做到真正的复制？**

- **方法一 `Object.assign()`**

使用`Object.assign(target,...sources)`时，后来的源对象的属性值，将会覆盖它之前的对象的属性值。所以可以先复制 `person`之后，再赋给属性新的值。

注意：这个例子里，我们用的数组和对象都只是一层嵌套，Lodash有一个深度复制的方法，但使用之前需要多考虑。

```javascript
const cap2 = Object.assign({}, person, { number: 99, age: 12 });
console.log(cap2); // Object {name: "Wes Bos", age: 12, number: 99}
```

- **方法二 JSON转换**

利用JSON可以先将对象转化成字符串格式，然后再把它转成JSON，从而实现复制。

```javascript
const wes = {
  name: 'Wes',
  age: 100,
  social: {
    twitter: '@wesbos',
    facebook: 'wesbos.developer'
  }
};

const dev = Object.assign({}, wes);
const dev2 = JSON.parse(JSON.stringify(wes));
console.log(wes);
console.log(dev);
console.log(dev2);
```

