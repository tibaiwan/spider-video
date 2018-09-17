# 批量抓取头条视频并保存到本地

目标网站：[西瓜视频](https://www.ixigua.com//)  
项目功能：下载头条号【维辰财经】下的最新20个视频

## 简介

    一般批量爬取视频或者图片的套路是，使用爬虫获得文件链接集合，然后通过 writeFile 等方法逐个保存文件。然而，头条的视频，在需要爬取的 html 文件（服务端渲染输出）中，无法捕捉视频链接。视频链接是页面在客户端渲染时，通过某些 js 文件内的算法或者解密方法，根据视频的已知 key 或者 hash 值，动态计算出来并添加到 video 标签的。这也是这些网站的一种反爬措施。

    我们在浏览这些页面时，通过审核元素，可以看到计算后的文件地址。然而在批量下载时，逐个手动的获取视频链接显然不可取。开心的是，puppeteer 提供了模拟访问 Chrome 的功能，使我们可以爬取经过浏览器渲染出来的最终页面。

## 项目启动

```bash
npm i
npm start
```

**Notice:** 安装 puppeteer 的过程稍慢，耐心等待。

## 配置

```js
// 配置相关
module.exports =  {
  originPath: 'https://www.ixigua.com', // 页面请求地址
  savePath: 'D:/videoZZ' // 存放路径
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
- page.$eval() 获取指定元素，相当于 document.querySelector
- page.$$eval() 获取指定元素，相当于 document.querySelectorAll
- page.$('#id .className') 获取文档中的某个元素

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
      console.log('下载视频ing：', video.title)
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
