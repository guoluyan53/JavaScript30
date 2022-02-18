/* Get Our Elements */
const player = document.querySelector('.player');
const video = player.querySelector('.viewer');
const progress = player.querySelector('.progress');
const progressBar = player.querySelector('.progress__filled');
const toggle = player.querySelector('.toggle');
const skipButtons = player.querySelectorAll('[data-skip]');
const ranges = player.querySelectorAll('.player__slider');

/* Build out functions */
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

//切换按钮
function updateButton() {
  const icon = this.paused ? '►' : '❚ ❚';
  console.log(icon);
  toggle.textContent = icon;  //将button的文字改为icon
}

//快进或者回退
function skip() {
 video.currentTime += parseFloat(this.dataset.skip);  //加上或减去当前按钮的时间
}

function handleRangeUpdate() {
  video[this.name] = this.value;
}

//进度条跟随视频走
function handleProgress() {
  const percent = (video.currentTime / video.duration) * 100;
  progressBar.style.flexBasis = `${percent}%`;  //flexBasis填充的状态
}

//视频的时间跟随进度条走
function scrub(e) {
  const scrubTime = (e.offsetX / progress.offsetWidth) * video.duration;
  video.currentTime = scrubTime;
}

/* Hook up the event listeners */
video.addEventListener('click', togglePlay);
video.addEventListener('play', updateButton);  
video.addEventListener('pause', updateButton);
video.addEventListener('timeupdate', handleProgress);

toggle.addEventListener('click', togglePlay);
skipButtons.forEach(button => button.addEventListener('click', skip));
ranges.forEach(range => range.addEventListener('change', handleRangeUpdate));
ranges.forEach(range => range.addEventListener('mousemove', handleRangeUpdate));//平滑拖动

let mousedown = false;
progress.addEventListener('click', scrub);
//按下就可以拖动 
progress.addEventListener('mousemove', (e) => mousedown && scrub(e));
progress.addEventListener('mousedown', () => mousedown = true);
progress.addEventListener('mouseup', () => mousedown = false);
