/* 批量下载主程序 */
const fs = require('fs'),
      config = require('./cofig'),
      method = require('./method')

// 初始化方法
const start = async () => {
  method.mkdirSaveFolder(config.savePath)
  let toutiaoName = '维辰财经'
  let offset = 0 // offset: 0：第一页数据，20：第二页数据，依次类推
  let pageUrlList = await method.getVideoPageList(toutiaoName, offset)
  main(pageUrlList)
}

// 主方法
const main = async pageUrlList => {
  console.log('视频所在页面列表：')
  console.log(pageUrlList)
  // 视频列表
  let pageVideoList = []
  for (let i = 0; i < pageUrlList.length; i++) {
    let videoSrc = await method.getVideoSrc(pageUrlList[i].pathname)
    pageVideoList.push({
      src: videoSrc,
      title: pageUrlList[i].title
    })
  }
  console.log('视频列表：')
  console.log(pageVideoList)
  // 开始下载
  for (let j = 0; j < pageVideoList.length; j++) {
    await downloadVideo(pageVideoList[j])
  }
  console.log('下载结束')
  process.exit(0)
}

// 下载视频
const downloadVideo = async video => {
  // 判断视频文件是否已经下载
  if (!fs.existsSync(`${config.savePath}/${video.title}.mp4`)) {
    await method.getVideoData(video.src, 'binary').then(fileData => {
      console.log('下载视频中：', video.title)
      method.savefileToPath(config.savePath, video.title, fileData).then(res =>
        console.log(`${res}: ${video.title}`)
      )
    })
  } else {
    console.log(`视频文件已存在：${video.title}`)
  }
}

module.exports = {
  start
}
