# 06 Type Ahead 实时搜索框打卡指南

## 实现效果

在搜索框中输入一些字母，匹配到城市（city）和州（state），并展示含有这些字母的相关信息而且高亮：

[json数据地址]: https://gist.githubusercontent.com/Miserlou/c5cd8364bf9b2420bb29/raw/2bf258763cdddd704f8ffd3ea9a3e81d25e2c6f6/cities.json

![image-20220211152924944](https://gitee.com/guoluyan53/image-bed/raw/master/img/image-20220211152924944.png)

## 实现问题

1. 怎样获取json数据
2. 怎样实时匹配相应的字符
3. 怎样展示想要的数据
4. 怎样实现高亮以及数字的分隔

## 关键要点

**promise**

- `fetch()`
- `then()`
- `json()`

**Array**

- `filter()`
- `map()`
- `push()`
- `join()`
- Spread syntax 扩展语句

**RegExp**

- `match()`
- `replace()`

## 步骤分解

**1. 声明一个空数组用于存放解析后的json数据**

```javascript
//1. 获取数据
const cities = [];
```

**2. 运用 fetch 发送 http 请求**

（1）获取返回的Promise对象； （2）解析json数据； （3）存入数组；

```javascript
//1. 获取数据
const cities = [];
fetch(endpoint)
    .then(response => response.json())
    .then(data => cities.push(...data));
```

**3. 获取两个主要HTML元素（input、ul），给input添加监听事件（change，keyup）**

```javascript
searchInput.addEventListener('change',displayMatches);
searchInput.addEventListener('keyup',displayMatches);
```

**4. 编写匹配输入函数**

（1）利用 `filter()`过滤数组数据； （2）创建正则表达式，构造过滤条件；

```javascript
//2. 过滤数据:(匹配的字符串，需要匹配的数组)
function findMatches(wordToMatch, cities){
    return cities.filter(place =>{
        const regex = new RegExp(wordToMatch,'gi');
        return place.city.match(regex) || place.state.match(regex);
});
```

**5. 编写展示数据的函数**

（1）获取匹配的数据；（2）替换关键词放入高亮的标签；（3）构造HTML标签数据；（4）将匹配值的HTML标签放入ul中；

```javascript
//3. 展示数据
function displayMatches() {
    console.log(this.value);
    const matchArray = findMatches(this.value,cities);
    const html = matchArray.map(place => {
        const regex = new RegExp(this.value,'gi');
        const cityName = place.city.replace(regex, `<span class="hl">${this.value}</span>`);
        const stateName = place.state.replace(regex,`<span class="hl">${this.value}</span>`);
        return `
            <li>
                <span class="name">${cityName},${stateName}</span>
                <span class="population">${numberWithCommas(place.population)}</span>
            </li>
            `
    }).join('') //去除数组中默认的分隔逗号

    suggestions.innerHTML = html;
}
const searchInput = document.querySelector('.search');
const suggestions = document.querySelector('.suggestions');
```

**6. 处理用逗号分隔的数据**

```javascript
//使用逗号分隔数字
function numberWithCommas(x){
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g,',');
}
```

## 所获知识

### [fetch()](https://developer.mozilla.org/zh-CN/docs/Web/API/Fetch_API/Using_Fetch)

 `fetch()` 必须接受一个参数——资源的路径。无论请求成功与否，它都返回一个 Promise 对象，resolve 对应请求的 [`Response`](https://developer.mozilla.org/zh-CN/docs/Web/API/Response)。

一个基本的 fetch 请求设置起来很简单。看看下面的代码：

```javascript
fetch('http://example.com/movies.json')
  .then(response => response.json())
  .then(data => console.log(data));
```

### [RegExp正则表达式](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/RegExp)

获取到了数据之后，如何匹配输入值呢？就要利用正则表达式了。正则表达式的 `match()` 可以执行一个匹配操作，我们再结合 `Array.filter()` 便能筛出整个数组中，满足条件的项，再经过字符串处理即可输出到页面。

