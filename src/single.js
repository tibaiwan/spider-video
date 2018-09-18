// 根据视频 url 下载单个视频

const fs = require('fs'),
      method = require('./method')

const folderName = 'D:/videoLOL'
const fileName = 'S8预选赛TOP5：Haro李青无解操作支配战局「LOL七周年」'
// 该视频链接可能已经失效了，请安排个正确的视频 src
const videoSrc = 'http://v1-tt.ixigua.com/ad160a207f438d576d06f3cffa1ca52f/5ba06826/video/m/2203ce04dd18e0e426381abfe64ea44f19b115bbe0a000027c1f6e94a77/'

// 初始化方法
const start = async () => {
  method.mkdirSaveFolder(folderName)
  let video = {
    src: videoSrc,
    title: fileName
  }
  downloadVideo(video)
}

// 下载视频
const downloadVideo = async video => {
  console.log(video)
  // 判断视频文件是否已经下载
  if (!fs.existsSync(`${folderName}/${video.title}.mp4`)) {
    await method.getVideoData(video.src, 'binary').then(fileData => {
      console.log('下载视频中：', video.title)
      method.savefileToPath(folderName, video.title, fileData).then(res =>
        console.log(`${res}: ${video.title}`)
      )
    })
  } else {
    console.log(`视频文件已存在：${video.title}`)
  }
}

start()
