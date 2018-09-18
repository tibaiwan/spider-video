# 批量爬取头条视频并保存

目标网站：[西瓜视频](https://www.ixigua.com)  
项目功能：下载头条号【维辰财经】下的最新20个视频  
姊妹项目：[批量下载美女图集](https://github.com/tibaiwan/spider-picture) 

## 简介

一般批量爬取视频或者图片的套路是，使用爬虫获得文件链接集合，然后通过 writeFile 等方法逐个保存文件。然而，头条的视频，在需要爬取的 html 文件（服务端渲染输出）中，无法捕捉视频链接。视频链接是页面在客户端渲染时，通过某些 js 文件内的算法或者解密方法，根据视频的已知 key 或者 hash 值，动态计算出来并添加到 video 标签的。这也是网站的一种反爬措施。

我们在浏览这些页面时，通过审核元素，可以看到计算后的文件地址。然而在批量下载时，逐个手动的获取视频链接显然不可取。开心的是，puppeteer 提供了模拟访问 Chrome 的功能，使我们可以爬取经过浏览器渲染出来的最终页面。

今日头条里有很多有意思的头条号玩家，他们发布了很多视频在里面。如果大家有批量下载某个头条号视频的需求，这个爬虫就派上用场了。当然，其他视频站也都大同小异，更改下部分代码设置就可以使用啦。

## 项目启动

> 命令

```bash
npm i
npm start
// 安装 puppeteer 的过程稍慢，耐心等待。
```

> 单个文件下载命令

```bash
npm run single
// 在文件 single.js 中设置视频名称和 src 即可。
```

> 配置文件

```js
// 配置相关
module.exports =  {
  originPath: 'https://www.ixigua.com', // 页面请求地址
  savePath: 'D:/videoZZ' // 存放路径
}
```

```js
// 单个视频下载设置
const folderName = 'D:/videoLOL'
const fileName = 'S8预选赛TOP5：Haro李青无解操作支配战局「LOL七周年」'
const videoSrc = 'http://v11-tt.ixigua.com/e2b7cbd320031f6c19890001503a6ca0/5b9fd7bb/video/m/2203ce04dd18e0e426381abfe64ea44f19b115bbe0a000027c1f6e94a77/'

// 初始化方法
const start = async () => {
  method.mkdirSaveFolder(folderName)
  let video = {
    src: videoSrc,
    title: fileName
  }
  downloadVideo(video)
}
```

## 技术点

> puppeteer

[官方API](https://github.com/GoogleChrome/puppeteer/blob/master/docs/api.md)

puppeteer 提供一个高级 API 来控制 Chrome 或者 Chromium。

puppeteer 主要作用：

- 利用网页生成 PDF、图片
- 爬取SPA应用，并生成预渲染内容（即“SSR” 服务端渲染）
- 可以从网站抓取内容
- 自动化表单提交、UI测试、键盘输入等

使用到的 API：

- puppeteer.launch() 启动浏览器实例
- browser.newPage() 创建一个新页面
- page.goto() 进入指定网页
- page.screenshot() 截图
- page.waitFor() 页面等待，可以是时间、某个元素、某个函数
- page.$eval() 获取一个指定元素，相当于 document.querySelector
- page.$$eval() 获取某类元素，相当于 document.querySelectorAll
- page.$('#id .className') 获取文档中的某个元素，操作类似jQuery

代码示例

```js
const puppeteer = require('puppeteer');
 
(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.goto('https://example.com');
  await page.screenshot({path: 'example.png'});
 
  await browser.close();
})();
```

## 视频文件下载方法

* 下载视频主方法
```js
const downloadVideo = async video => {
  // 判断视频文件是否已经下载
  if (!fs.existsSync(`${config.savePath}/${video.title}.mp4`)) {
    await getVideoData(video.src, 'binary').then(fileData => {
      console.log('下载视频中：', video.title)
      savefileToPath(video.title, fileData).then(res =>
        console.log(`${res}: ${video.title}`)
      )
    })
  } else {
    console.log(`视频文件已存在：${video.title}`)
  }
}
```

* 获取视频数据
```js
getVideoData (url, encoding) {
  return new Promise((resolve, reject) => {
    let req = http.get(url, function (res) {
      let result = ''
      encoding && res.setEncoding(encoding)
      res.on('data', function (d) {
        result += d
      })
      res.on('end', function () {
        resolve(result)
      })
      res.on('error', function (e) {
        reject(e)
      })
    })
    req.end()
  })
}
```

* 将视频数据保存到本地
```js
savefileToPath (fileName, fileData) {
  let fileFullName = `${config.savePath}/${fileName}.mp4`
  return new Promise((resolve, reject) => {
    fs.writeFile(fileFullName, fileData, 'binary', function (err) {
      if (err) {
        console.log('savefileToPath error:', err)
      }
      resolve('已下载')
    })
  })
}
```

## 爬取结果截图

<img src="./static/videos.jpg" width="700" alt="视频截图">

## 说明

此爬虫仅用于个人学习，如果侵权，即刻删除！
