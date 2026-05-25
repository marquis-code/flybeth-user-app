const puppeteer = require('puppeteer');

(async () => {
  try {
    const browser = await puppeteer.launch({ args: ['--no-sandbox', '--disable-setuid-sandbox'] });
    const page = await browser.newPage();
    
    page.on('console', msg => console.log('LOG:', msg.text()));
    page.on('pageerror', err => console.log('ERROR:', err.message));
    
    await page.goto('http://localhost:3000/', { waitUntil: 'networkidle0', timeout: 15000 });
    
    const content = await page.content();
    console.log("HTML has __nuxt content:", content.includes('<div id="__nuxt"></div>') ? 'yes' : 'no');
    
    // Check if there are elements inside __nuxt
    const childCount = await page.$eval('#__nuxt', el => el.children.length).catch(() => -1);
    console.log("Children inside __nuxt:", childCount);
    
    await browser.close();
  } catch (e) {
    console.log('SCRIPT_ERROR', e);
  }
})();
