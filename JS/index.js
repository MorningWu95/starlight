/** 
 * 解析歌词字符串
 * 得到一个歌词对象的数组
 * 每个歌词对象：
 * {time:开始时间，words:歌词内容}
 */
function parseLrc() {
    const lrcList = lrc.split("\n");
    const arr = [];//歌词数组
    for (let i = 0; i < lrcList.length; i++) {
        const parts = lrcList[i].split("]");//将数组分成时间和内容两部分
        const timeStr = parts[0].substring(1);//取出数组第一部分下标为1的数据
        const obj = {
            time: parseTime(timeStr),
            words: parts[1]
        }
        arr.push(obj);
    }
    return arr;
}

/**
 * 将一个时间字符串解析为数字（秒）
 * @param {String} timeStr 时间字符串
 * @returns 
 */
function parseTime(timeStr) {
    const number = timeStr.split(":");
    const result = +number[0] * 60 + +number[1];
    return result;
}

const lrcData = parseLrc();

//获取需要的doms
const doms = {
    audio: document.querySelector("audio"),
    ul: document.querySelector(".lrc-list"),
    contianer : document.querySelector(".container")
}

/**
 * 计算出在当前情况下：lrcData数组中，应该高亮显示的歌词下标
 * 如果没有任何一句歌词需要显示，则得到-1
 */
function findIndex() {
    const curTime = doms.audio.currentTime;
    for (let i = 0; i < lrcData.length; i++) {
        if (curTime < lrcData[i].time) {
            return i - 1;
        }
    }
    //找遍了都没有找到（说明播放到最后一句）
    return lrcData.length - 1;
}


//界面
/**
 * 创建歌词元素
 */
function createLrcElements() {
    //当数据量很大，效率需要优化时，不建议总是操作dom树，而是先将需要改动的数据放置文档片段
    var frag = document.createDocumentFragment();
    for (let i = 0; i < lrcData.length; i++) {
        const li = document.createElement("li");
        li.textContent = lrcData[i].words;
        frag.appendChild(li);
    }
    doms.ul.appendChild(frag);
}
createLrcElements();

/**
 * 设置ul元素的偏移量
 */
let containerHeight = doms.contianer.clientHeight;//容器的高度
let liHeight = doms.ul.children[0].clientHeight;//每个li的高度
let maxOffset = doms.ul.clientHeight - containerHeight;
function setOffset(){
    let index = findIndex();
    let firstHeight = liHeight * index + liHeight / 2;//每个li距离容器的高度
    let offset = firstHeight - containerHeight / 2;
    if(offset < 0){
        offset = 0;
    }
    if(offset > maxOffset){
        offset = maxOffset;
    }
    doms.ul.style.transform = `translateY(-${offset}px)`;
    doms.ul.style.transition = `0.15s`;
    let li = doms.ul.querySelector(".active");
    if(li){
        li.classList.remove("active");
    }
    li = doms.ul.children[index];
    if(li){
        li.classList.add("active");
    //或：
    // li.className = "active"
    }   
}
doms.audio.addEventListener("timeupdate",setOffset);