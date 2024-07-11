import puppeteer from 'puppeteer';
import dotenv from 'dotenv'
dotenv.config()

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

/**
 * Get an element by its CSS selector and text content.
 * @param {import('puppeteer').Page} page - The Puppeteer page object.
 * @param {string} text - The text content of the element.
 * @param {string} selector - The CSS selector for the element to search within.
 * @returns {Promise<import('puppeteer').ElementHandle>} - The element handle.
 */
async function getElementByText(page, text, selector) {
  await page.waitForSelector(selector, { visible: true, timeout: 10000 });
  const elements = await page.$$(selector);
  for (const element of elements) {
    const elementText = await page.evaluate(el => el.textContent.trim(), element);
    if (elementText.includes(text)) {
      return element;
    }
  }
  throw new Error(`Element with text "${text}" not found`);
}

function generateRandomEmail() {
  const timestamp = Date.now();
  return `user${timestamp}@example.com`;
}

function generateRandomPassword() {
  return `4wretyui${Math.floor(Math.random() * 1000000)}`;
}


describe('Signup Tests', function () {
  let browser;
  let page;
  const baseUrl = process.env.BASE_URL
  before(async function () {
    browser = await puppeteer.launch({
      headless: false, defaultViewport:
        { width: 1860, height: 1080 }

    });
    page = await browser.newPage();
  });

  after(async function () {
    await browser.close();
  });

  const randomEmail = generateRandomEmail()
  const randomPassword = generateRandomPassword()

  it('should sign up successfully', async function () {
    this.timeout(20000);

    await page.goto(baseUrl);


    const signUpSpan = await getElementByText(page, "Sign up - It's Free", 'span');

    await page.evaluate(span => {
      span.scrollIntoView();
    }, signUpSpan);
    await delay(2000);

    await signUpSpan.click();

    await page.waitForSelector('input#email');
    await page.waitForSelector('input#password');

    await page.type('input#email', randomEmail);
    await page.type('input#password', randomPassword);

    const submitButton = await getElementByText(page, 'Create My Account', 'button');

    await page.evaluate(span => {
      span.scrollIntoView();
    }, submitButton);
    await delay(1300);

    await submitButton.click();

    await page.waitForNavigation({ waitUntil: 'networkidle0' });

    const url = page.url();
    console.log('Navigated to:', url);
  });
});
