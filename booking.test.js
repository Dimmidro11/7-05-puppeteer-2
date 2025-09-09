const { default: puppeteer } = require("puppeteer");
const commands = require("./lib/commands.js");


describe("Booking cinema tests", () => {
  
  let browser;
  let page;

  beforeAll(async () => {
    browser = await puppeteer.launch({
      headless: false,
      slowMo: 50,
    });
  });

  afterAll(async () => {
    await browser.close();
  });

  beforeEach(async () => {
    page = await browser.newPage();
    await page.goto("https://qamid.tmweb.ru/client/index.php");
  });

  afterEach(async () => {
    await page.close();
  })

  test("Should buy one VIP seat", async () => {
    const day = "Чт";
    const time = "00:00";

    await commands.clickDay(page, day);
    await commands.selectSession(page, time);
    await commands.selectSeat(page, "vip");
    await commands.confirmSeat(page);
    await commands.buyTicket(page);

    const confirmationText = await commands.getConfirmationText(page);
    expect(confirmationText).toContain("Электронный билет");
  }, 20000);

  test("Should buy two Standart seat", async () => {
    const day = "Вс";
    const time = "13:00";

    await commands.clickDay(page, day);
    await commands.selectSession(page, time);
    await commands.selectSeat(page);
    await commands.selectSeat(page);
    await commands.confirmSeat(page);
    await commands.buyTicket(page);

    const confirmationText = await commands.getConfirmationText(page);
    expect(confirmationText).toContain("Электронный билет");
  }, 20000);

  test("Should not buy booking seat", async () => {
    const day = "Вс";
    const time = "13:00";

    await commands.clickDay(page, day);
    await commands.selectSession(page, time);
    await page.waitForSelector("span.buying-scheme__chair_taken", { visible: true, timeout: 2000 });
    const takenSeat = await page.$("span.buying-scheme__chair_taken");
    expect(takenSeat).toBeTruthy();
    await expect(commands.clickElement(page, takenSeat)).rejects.toThrow("Selector is not clickable");
    const isButtonDisabled = await page.$eval(
      ".acceptin-button",
      (el) => el.disabled
    );
    expect(isButtonDisabled).toBe(true);
  }, 30000)
});
