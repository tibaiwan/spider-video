const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.goto('https://www.ixigua.com/search/?keyword=%E7%BB%B4%E8%BE%B0%E8%B4%A2%E7%BB%8F');
  await page.waitFor(2000);
  await page.screenshot({path: 'example2.png'});

  await page.content()
  let s = await page.$$eval('.list-wrapper .card-wrapper .img-wrap', eles => {
    let arr = []
    for (let i = 0; i < eles.length; i++) {
      arr.push(eles[i].href)
    }
    return arr
  })

  console.log('s', s)
  // await browser.close();
})();
