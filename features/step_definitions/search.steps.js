const puppeteer = require("puppeteer");
const chai = require("chai");
const expect = chai.expect;
const { Given, When, Then, Before, After } = require("cucumber");
const commands = require("../../lib/commands.js");

Before(async function () {
  const browser = await puppeteer.launch({ headless: false, slowMo: 50 });
  const page = await browser.newPage();
  this.browser = browser;
  this.page = page;
});

After(async function () {
  if (this.browser) {
    await this.browser.close();
  }
});

Given("user is on booking page", async function () {
  return await this.page.goto("https://qamid.tmweb.ru/client/index.php", {
    setTimeout: 20000,
  });
});

When("user booking a movie day {string}", async function (day) {
  await commands.clickDay(this.page, day);
});

When("user booking a movie session {string}", async function (time) {
  await commands.selectSession(this.page, time);
});

When("user booking {string} seat", async function (seatType) {
  await commands.selectSeat(this.page, seatType)
});

When("user booking taken seat", async function () {
  await this.page.waitForSelector("span.buying-scheme__chair_taken", { visible: true, timeout: 2000 });
  const takenSeat = await this.page.$("span.buying-scheme__chair_taken");
  try {
    await commands.clickElement(this.page, takenSeat);
  } catch (error) {
    expect(error.message).to.contain("Selector is not clickable");
  }
});

When("user confirm seat", async function () {
  await commands.confirmSeat(this.page);
});

When("user buy ticket", async function () {
  await commands.buyTicket(this.page);
});

Then("booking confirmed", async function () {
  const confirmationText = await commands.getConfirmationText(this.page);
  expect(confirmationText).to.contain("Электронный билет");
});

Then("booking confirmation button disabled", async function () {
  const isButtonDisabled = await this.page.$eval(
    ".acceptin-button",
    (el) => el.disabled
  );
  expect(isButtonDisabled).to.be.true;
});
