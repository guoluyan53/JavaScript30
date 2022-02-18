# 11 Custom Video Player 自定义播放器 打卡指南

## 实现效果

实现一个自定义播放器，要有进度条，可以拖动；有音量条，有速度条；有前进，后退按钮；播放，暂停按钮的切换。

![image-20220218161808463](https://gitee.com/guoluyan53/image-bed/raw/master/img/image-20220218161808463.png)

## 问题预览

1. 点击鼠标（小图标）怎样使视频暂停和播放？
2. 怎样切换小图标？
3. 怎样调节音量和倍速？
4. 怎样实现快进和回退
5. 怎样让进度条实时跟着视频播放的内容走？
6. 调节进度条时怎样让视频跟着进度条走？

## 所用要点

- `Video`对象的各种属性、方法和事件
  - `paused`
  - `play()`
  - `pause()`
  - `currentTime`
  - `duration`
- `offsetX`、`offsetWidth`
- 监听事件
  - `click`
  - `play`
  - `pause`
  - `timeupdate`
  - `chang`
  - `mousemove `| `mouseup` | `mousedown`

## 实现步骤

**HTML元素**：

```html
<div class="player">
     <video class="player__video viewer" src="652333414.mp4"></video>

     <div class="player__controls">
       <div class="progress">
        <div class="progress__filled"></div>
       </div>
       <button class="player__button toggle" title="Toggle Play">►</button>
       <input type="range" name="volume" class="player__slider" min="0" max="1" step="0.05" value="1">
       <input type="range" name="playbackRate" class="player__slider" min="0.5" max="2" step="0.1" value="1">
       <button data-skip="-10" class="player__button">« 10s</button>
       <button data-skip="25" class="player__button">25s »</button>
</div>
```

### 1. 获取页面中的节点

```javascript
const player = document.querySelector('.player');
const video = player.querySelector('.viewer');
const progress = player.querySelector('.progress');
const progressBar = player.querySelector('.progress__filled');
const toggle = player.querySelector('.toggle');
const skipButtons = player.querySelectorAll('[data-skip]');
const ranges = player.querySelectorAll('.player__slider');
```

### 2. 播放和暂停

`video`对象有个 `paused`属性用来判断视频是否在播放。

- `play()`用于播放视频
- `pause()`用于暂停播放

主要是监听视频和播放的小按钮：

```javascript
//播放和暂停
function togglePlay() {
  const method = video.paused ? 'play' : 'pause';
  video[method]();
  //上面的方法等同于
  // if(video.paused){
  //   video.play();  //视频播放的方法
  // }else{
  //   video.pause();
  // }
}
video.addEventListener('click', togglePlay);
toggle.addEventListener('click', togglePlay);
```

### 3.►|❙❙ 的切换

这里同样可以判断视频是否在播放，从而切换不同的图标。

这里图标是一个文本，可以在一个网站上获得：[图标文本](https://copypastecharacter.com/all-characters)

```javascript
 //切换按钮样式
function updateButton(){
     const icon = this.paused ? '▶':'❙❙';
     console.log(icon);
     toggle.textContent = icon;  //将button的内容改为icon
}
video.addEventListener('play', updateButton);  
video.addEventListener('pause', updateButton);
```

上面的代码中，使用了关键字 `this`。其实在调用 `updateButton` 的时候，这个方法已经被绑定在了 `addEventListener` 的调用者上，也就是绑定到了 `video` 上。因此，`this.paused` 在这里就相当于 `video.paused`。

### 4. 快进和回退

`currentTime`用于获取当前视频的播放时间。

在HTML中，已经给快进和回退按钮添加了一个 `data-skip`的自定义属性，属性值为快进或回退的秒数。

```javascript
//快进或者回退
function skip() {
 video.currentTime += parseFloat(this.dataset.skip);  //加上或减去当前按钮的时间
}
skipButtons.forEach(button => button.addEventListener('click', skip));
```

要注意的是，这里就不能用 `this` 来访问 `video` 对象了，因为在这里面，`this` 指向的是遍历得到的每一个 `button`，而我们是要修改 `video` 的 `currentTime` 属性。

`data-**` 这样的属性以前提到过了，在 JavaScript 中需要通过 `.dataset.**` 来访问。因为我们获取到的是字符串，所以要通过 `parseFloat` 来转换一下。

### 5. 音量和倍速

接下来实现通过控制面板上两个滑动条来控制视频的音量和播放速度。这两个滑动条是 `range` 类型的 `input` 元素，在元素属性中指定了他们各自的最大、最小值和调节的“步值”。

其中需要注意的是，他们分别有一个 `volume` 和 `playbackRate` 的 `name` 属性，起这两个名字是因为他们是 `video` 对象里对应音量和播放速度的两个属性名。这样起名并不是必须的，但可以让后面 js 的操作更精简。

通过监听两个 `input` 元素的 `change` 事件，就可以通过其 `value` 值改变视频属性了：

```javascript
function handleRangeUpdate() {
    video[this.name] = this.value;
}

//遍历 ranges 给两个滑动条都绑定事件
ranges.forEach(range => range.addEventListener('change', handleRangeUpdate));
```

因为我们上面说过，`input` 的 `name` 值和 `video` 对象中的属性名是一样的，可以看到在 `handleRangeUpdate` 函数中我们利用了 `this.name` 的写法来代表属性，，这里的 `this` 一样是 `addEventListener` 的调用者，即 `range`。

现在调节两个滑动条我们已经可以改变视频相应属性了，美中不足就是滑块的调节并不是实时的，而要等我们放开鼠标才会生效，这是因为 `change` 事件只在 `blur`，也就是元素失去焦点的时候才会触发。要解决这个问题我们可以把 `change` 事件改为 `input` 事件；另一种比较传统的方法是同时监听鼠标在该元素上的 `mousemove` 事件来执行更新的操作， 在原来的代码下加上一行：

```javascript
ranges.forEach(range => range.addEventListener('mousemove', handleRangeUpdate));
```

这样鼠标在这滑动条上移动的时候也会更新视频属性了，只不过只有在鼠标拖动滑块的时候才会有值的改变。

### 6. 进度条操作

我们的进度条需要能在鼠标点击和拖动的时候改变视频播放的进度。我们先实现进度条随着视频播放更新进度的功能。

进度条显示进度的原理很简单，`progress__filled` 这个元素是一个 `flex` 定位的元素，我们改变其 `flex-basis` 的百分比值就可以调节它所占父元素的宽度。`flex-basis` 值代表 `flex` 元素在**主轴**方向上的初始尺寸。关于 `flex-basis` 的更多信息请参考 [MDN](https://developer.mozilla.org/zh-CN/docs/Web/CSS/flex-basis)

```javascript
// 根据当前播放时间来调节进度条
function handleProgress() {
    const percent = (video.currentTime / video.duration) * 100;
    progressBar.style.flexBasis = `${percent}%`;
}
```

现在只要运行 `handleProgress` 这个函数就能够更新对应的进度条，但我们需要的是自动执行这个操作。也许你会想到利用 `setInterval` 设置一个定时器，其实 `video` 元素给我们提供了更好的方法—— `timeupdate` 事件。这个事件会在媒体文件的 `currentTime` 属性改变的时触发，更多信息请参考 [MDN](https://developer.mozilla.org/zh-CN/docs/Web/Events/timeupdate)

事件操作如下：

```javascript
video.addEventListener('timeupdate', handleProgress);
```

现在随着视频的播放，进度条也会更新进度了。

接着我们需要点击进度条时调整播放进度，那么我们改变进度，或者说宽度就需要得到鼠标点击的位置，这可以通过事件对象的 `offsetX` 属性来找到，该属性代表鼠标点击位置相对于该元素的水平偏移。得到偏移之后计算出该位置的百分比，那么也就知道了进度的百分比：

```javascript
...
// 根据点击位置设置播放时间
function scrub(e) {
    const scrubTime = (e.offsetX / progress.offsetWidth) * vidoe.duration;
    video.currentTime = scrubTime;
}

// 点击事件监听
progress.addEventListener('click', scrub);
```

进度条还要求可以拖动，这个操作我们可以通过设置一个*标志*来判断当前是否出于拖动状态，然后配合 `mousedown`、`mouseup` 事件来更新这个标志：

```javascript
...
let mousedown = false;

// 鼠标在 progress 上移动时更新进度
progress.addEventListener('mousemove', (e) => {

    // 若处于拖拽状态则执行更新
    if (mousedown) {
        scrub(e);
    }
});

// 鼠标按下改变标志
progress.addEventListener('mousedown', () => mousedown = true);

// 鼠标抬起恢复标志
progress.addEventListener('mouseup', () => mousedown = false);
```

这样就实现了拖拽进度条时改变播放进度的功能，实际使用的时候会发现拖拽和视频的更新并不是实时的，会有一定延迟，这是因为 `mousemove` 事件触发的频率非常高，视频更新的速度跟不上。

对于 `mousemove` 的回调函数其实我们可以写得更简洁：

```javascript
progress.addEventListener('mousemove', (e) => mousedown && scrub(e));
```

我们利用逻辑和操作符 `&&` 的**短路**特性来实现 “只有当 `mousedown` 为 `true`，或可类型转换为 `true` 时才执行 `scrub(e)`” 的判断操作，由于逻辑和的判断必须两个都为真时才成立，所以若第一项不为真，那么 js 就不会去管第二项是什么，因此也就不会执行 `scrub(e)`。这种写法在实际项目中是挺常见的，算是一个小技巧，希望大家可以熟悉并使用。

