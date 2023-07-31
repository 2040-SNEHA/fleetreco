const pptr = require('puppeteer');

(async () => {
  // 1. Launch browser in headful mode so that we can click around and see how
  // script works.
  const browser = await pptr.launch({
    headless: false,
  });
  const page = await browser.newPage();

  const actions = [];

  // Function to handle redirect event
  await page.exposeFunction('redirectEvent', async (info) => {
    if (info.targetId == 'loginButton') {
      console.log(info.targetValue);
      await page.goto('file://E:/final pro/public/recording.html');
    }
  });
  await page.evaluateOnNewDocument(() => {
    document.addEventListener('click', e => redirectEvent({
      targetId: e.target.getAttribute("id"),
      targetValue: document.getElementById("url").value
    }), true /* capture */);
    document.getElementById('loginButton').addEventListener('click', e => redirectEvent({
      targetId: e.target.getAttribute("id"),
      //targetValue: document.getElementById("url").value
    }), true /* capture */);
  });

  await page.exposeFunction('reportEvent', info => {
    console.log(info);
    actions.push(info);
  });
  await page.evaluateOnNewDocument(() => {
    document.addEventListener('click', e => reportEvent({ targetName: e.target.baseURI, eventType: 'click' }), true /* capture */);
  });

  // Function to handle scroll event
  await page.exposeFunction('scrollEvent', info => {
    console.log(info);
    actions.push(info);
  });
  await page.evaluateOnNewDocument(() => {
    window.addEventListener('scroll', () => {
      scrollEvent({
        eventType: 'scroll',
        scrollX: window.scrollX,
        scrollY: window.scrollY,
      });
    });
  });

  // Function to handle search event
  await page.exposeFunction('searchEvent', info => {
    console.log(info);
    actions.push(info);
  });
  await page.evaluateOnNewDocument(() => {
    const searchInput = document.getElementById('searchBar'); // Replace 'searchBar' with the actual ID of your search bar input element
    searchInput.addEventListener('input', () => {
      searchEvent({
        eventType: 'search',
        searchQuery: searchInput.value,
      });
    });
  });

  await page.goto('file://E:/final pro/public/index.html');
})();
