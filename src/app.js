const fs = require('fs'),
      config = require('./cofig'),
      method = require('./method')

// 初始化方法
const start = async () => {
  method.mkdirSaveFolder()
  // main(currentPageNum)
  method.getVideoData('https://v1-tt.ixigua.com/80f1d86bd4de90e65976a4e9f894c566/5b9e3621/video/m/2207d98735520a5400ea145ddefd4ed720a1158ae7000000c4fd17a4a7a/', 'binary').then(fileData => {
    method.savefileToPath('qwq', fileData).then(res =>
      console.log(res)
    )
  })
}

// 主方法
const main = async pageNum => {

}

module.exports = {
  start
}
