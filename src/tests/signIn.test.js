import puppeteer from 'puppeteer';
import dotenv from 'dotenv'
dotenv.config()

/**
 * Get a button by its text content.
 * @param {import('puppeteer').Page} page - The Puppeteer page object.
 * @param {string} text - The text content of the button.
 * @returns {Promise<import('puppeteer').ElementHandle>} - The button element handle.
 */
async function getButtonByText(page, text) {
  await page.waitForSelector('button', { visible: true });
  const buttons = await page.$$('button');
  for (const button of buttons) {
    const buttonText = await page.evaluate(el => el.textContent.trim(), button);
    if (buttonText === text) {
      return button;
    }
  }
  throw new Error(`Button with text "${text}" not found`);
}

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));


describe('Signin Tests', function () {
  let browser;
  let page;

  const baseUrl = process.env.BASE_URL

  const notSubEmail = process.env.NOT_SUB_EMAIL
  const notSubPassword = process.env.NOT_SUB_PASSWORD

  const subEmail = process.env.SUB_EMAIL
  const subPassword = process.env.SUB_PASSWORD

  before(async function () {
    browser = await puppeteer.launch({
      headless: false, defaultViewport: {
        width: 1860,
        height: 1080
      }
    });
    page = await browser.newPage();
  });

  // after(async function () {
  //   await browser.close();
  // });

  it('Navigate to checkout page for unsubscribed user', async function () {
    await page.goto(baseUrl);

    const signInButton = await getButtonByText(page, 'Sign in');
    await signInButton.click();

    await page.waitForSelector('input#email');
    await page.waitForSelector('input#password');

    await page.type('input#email', notSubEmail);
    await page.type('input#password', notSubPassword);

    const submitButton = await getButtonByText(page, 'CONTINUE');
    await submitButton.click();

    await delay(8000)

    const url = page.url();
    console.log('Navigated to:', url);

    if (!url.includes('freetrial')) {
      throw new Error('Failed to navigate to the aiprojects page.');
    }
  });

  it('Navigate to aiprojects page for subscribed user', async function () {
    await page.goto(baseUrl);

    const signInButton = await getButtonByText(page, 'Sign in');
    await signInButton.click();

    await page.waitForSelector('input#email');
    await page.waitForSelector('input#password');

    await page.type('input#email', subEmail);
    await page.type('input#password', subPassword);

    const submitButton = await getButtonByText(page, 'CONTINUE');
    await submitButton.click();

    await delay(8000)

    const url = page.url();
    console.log('Navigated to:', url);

    if (!url.includes('aiprojets')) {
      throw new Error('Failed to navigate to the aiprojects page.');
    }
  });
});
