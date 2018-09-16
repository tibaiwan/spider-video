const config = require('./cofig'),
      fs = require('fs'),
      http = require('http'),
      https = require('https');

module.exports = {
  // 获取视频数据
  getVideoData (url, encoding) {
    return new Promise((resolve, reject) => {
      var req = https.get(url, function (res) {
        var result = ''
        encoding && res.setEncoding(encoding)
        res.on('data', function (d) {
          result += d
        })
        res.on('end', function () {
          resolve(result)
        })
        res.on('error', function (e) {
          console.error(e)
          reject(e)
        })
      })
      req.end()
    })
  },
  // 下载视频到本地
  savefileToPath (fileName, fileData) {
    let fileFullName = `${config.savePath}/${fileName}.mp4`
    console.log('fileFullName: ', fileFullName)
    return new Promise((resolve, reject) => {
      fs.writeFile(fileFullName, fileData, 'binary', function (err) {
        if (err) {
          console.log('save error', err)
          reject(err)
        }
        console.log(`${fileFullName} 已下载!`)
        resolve('done!!')
      })
    })
  },
  // 新建保存图片的文件夹
  mkdirSaveFolder () {
    if (!fs.existsSync(config.savePath)) {
      fs.mkdirSync(config.savePath)
      console.log(`主文件夹已生成：${config.savePath}`)
    } else {
      console.log(`主文件夹已存在：${config.savePath}`)
    }
  }
}
