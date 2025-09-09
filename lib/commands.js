module.exports = {
  clickElement: async function (page, selector) {
    try {
      await page.waitForSelector(selector);
      await page.click(selector);
    } catch (error) {
      throw new Error(`Selector is not clickable: ${selector}`);
    }
  },

  clickDay: async function (page, shortName) {
    try {
      const days = await page.$$('.page-nav__day');

      for (const day of days) {
        const textContent = await day.evaluate((el) => el.textContent.trim());

        if (textContent.includes(shortName)) {
          await day.click();
          return; 
        }
     }
    } catch (error) {
     throw new Error ("День не найден");
    }
  },

  selectSession: async function (page, time) {
    await page.waitForSelector("a.movie-seances__time", { visible: true });

    try {

      const sessions = await page.$$(".movie-seances__time-block");

      for (const session of sessions) {
        const textContent = await session.evaluate((el) => el.textContent.trim());

        if (textContent.includes(time)) {
          await session.click();
          return;
        }
      }
    } catch (error) {
      throw new Error ("Время не найдено");
    }

    await page.waitForSelector("span.buying-scheme__chair", { visible: true });
  },

  selectSeat: async function (page, seatType = "standart", taken = false) {
    const selector = `span.buying-scheme__chair.buying-scheme__chair_${seatType}${
      taken
        ? ".buying-scheme__chair_taken"
        : ":not(.buying-scheme__chair_taken):not(.buying-scheme__chair_selected)"
    }`;
    await this.clickElement(page, selector);
  },

  confirmSeat: async function (page) {
    await this.clickElement(page, ".acceptin-button");

    await page.waitForSelector("h2", { visible: true });
  },

  buyTicket: async function (page) {
    await this.clickElement(page, ".acceptin-button")

    await page.waitForSelector(".ticket__info-qr", {visible: true});
  },

  getConfirmationText: async function (page) {
    return page.$eval("h2", (el) => el.textContent.trim());
  }
};