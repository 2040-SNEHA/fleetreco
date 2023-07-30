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
  async function redirectEvent(info) {
    if (info.targetId === 'submit') {
      console.log(info.targetValue);
      await page.goto(info.targetValue);
    }
  }

  // Function to handle click event and report the action
  function reportEvent(info) {
    console.log(info);
    actions.push(info);
  }

  // Function to handle input event and report the user's input
  function reportInput(inputValue) {
    console.log('User typed:', inputValue);
    actions.push({ eventType: 'input', inputValue });
  }

  // Expose functions to the page context
  await page.exposeFunction('redirectEvent', redirectEvent);
  await page.exposeFunction('reportEvent', reportEvent);
  await page.exposeFunction('reportInput', reportInput);

  // Hook document with capturing event listeners that sniff all the important
  // information from the event and report it back to Node.js
  await page.evaluateOnNewDocument(() => {
    document.addEventListener('click', e => {
      window.reportEvent({
        targetName: e.target.tagName,
        eventType: 'click'
      });
    }, true /* capture */);

    document.addEventListener('scroll', e => {
      window.reportEvent({
        targetName: 'scroll',
        eventType: 'scroll',
        scrollTop: window.pageYOffset
      });
    }, true /* capture */);

    const searchInput = document.getElementById('searchInput'); // Replace 'searchInput' with the actual ID of your search input field
    if (searchInput) {
      searchInput.addEventListener('input', e => {
        window.reportInput(e.target.value);
      });
    }
  });

  await page.goto('file://E:/final pro/public/index.html');
})();
