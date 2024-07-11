import puppeteer from 'puppeteer';

/**
 * Get a button by its text content.
 * @param {import('puppeteer').Page} page - The Puppeteer page object.
 * @param {string} text - The text content of the button.
 * @returns {Promise<import('puppeteer').ElementHandle>} - The button element handle.
 */
export async function getButtonByText(page, text) {
  await page.waitForSelector('button', { visible: true });
  const buttons = await page.$$('button');
  for (const button of buttons) {
    const buttonText = await page.evaluate(el => el.textContent.trim(), button);
    if (buttonText.includes(text)) {
      return button;
    }
  }
  throw new Error(`${text} button not found`);
}

/**
 * Get an input field by its selector.
 * @param {import('puppeteer').Page} page - The Puppeteer page object.
 * @param {string} selector - The CSS selector for the input field.
 * @returns {Promise<import('puppeteer').ElementHandle>} - The input field element handle.
 */
export async function getInputField(page, selector) {
  await page.waitForSelector(selector, { visible: true });
  return await page.$(selector);
}

/**
 * Validate the presence of key UI elements for sign up or sign in.
 * @param {import('puppeteer').Page} page - The Puppeteer page object.
 */
export async function validateUIElements(page) {
  try {
    const gitHubButton = await getButtonByText(page, "Continue with GitHub");
    console.log('GitHub Button Visible:', gitHubButton ? 'Yes' : 'No');

    const googleButton = await getButtonByText(page, "Continue with Google");
    console.log('Google Button Visible:', googleButton ? 'Yes' : 'No');

    const emailField = await getInputField(page, 'input#email');
    console.log('Email Field Visible:', emailField ? 'Yes' : 'No');

    const passwordField = await getInputField(page, 'input#password');
    console.log('Password Field Visible:', passwordField ? 'Yes' : 'No');

  } catch (error) {
    console.error('Error validating UI elements:', error);
    throw error; // Re-throw the error to be handled by the caller
  }
}
