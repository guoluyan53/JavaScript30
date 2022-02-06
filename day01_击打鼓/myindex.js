//1.按下按键的时候，播放对应的声音
window.addEventListener('keydown',function(e){
    // 获取按键所对应的音频信息
    const audio = document.querySelector(`audio[data-key="${e.keyCode}"]`);
    const key = document.querySelector(`div[data-key="${e.keyCode}"]`);
    // 解决页面中不存在的按键按下问题
    if(!audio) return;
    // 解决多次按键不会从头开始问题
    audio.currentTime = 0;
    audio.play();  //播放 
    // console.log(audio);


    //2.按下按钮的时候，改变按键的显示效果
    key.classList.add('playing');  //动态的添加样式
})

//3.按键效果转换之后，恢复到最初的状态
function removePlaying(e) {
    if(e.propertyName !== 'transform') return;
    this.classList.remove('playing');
}
const keys = document.querySelectorAll('.key');
keys.forEach(key => {
    key.addEventListener('transitionend',removePlaying);
})
