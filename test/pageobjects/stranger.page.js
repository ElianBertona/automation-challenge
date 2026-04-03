import { $ } from "@wdio/globals";

class StrangerPage {
  get inputImage() {
    return $("#inputImage");
  }
  get inputText() {
    return $('textarea[name="text"]');
  }
  get btnCreate() {
    return $("button=Create Item");
  }
  get btnUpdate() {
    return $("button=Update Item");
  }
  get itemsCountLabel() {
    return $("h1.ng-binding");
  }
  get modalContainer() {
    return $(".modal-content");
  }
  get btnConfirmDelete() {
    return $("button=Yes, delete it!");
  }
  get allStoriesTexts() {
    return $$("p.story");
  }
  btnDeleteInRow(row) {
    return row.$("button=Delete");
  }
  btnEditInRow(row) {
    return row.$("button=Edit");
  }

  escapeXPathString(str) {
    if (!str.includes("'")) return `'${str}'`;
    if (!str.includes('"')) return `"${str}"`;
    return `concat('${str.replace(/'/g, "', \"'\", '")}')`;
  }

  async open() {
    await browser.url("/");
    await this.itemsCountLabel.waitForDisplayed({
      timeout: 20000,
      timeoutMsg: "Page did not load within 20s",
    });
  }

  async createItem(text, filePath) {
    const remoteFilePath = await browser.uploadFile(filePath);
    await this.inputImage.setValue(remoteFilePath);
    await this.inputText.setValue(text);
    await this.btnCreate.click();

    await browser.waitUntil(
      async () => {
        return await this.isTextInList(text);
      },
      { timeout: 10000, timeoutMsg: "The item did not appear in the list" },
    );
  }

  async clickDeleteForText(text) {
    const safeText = this.escapeXPathString(text);
    const row = await $(`//p[text()="${safeText}"]/ancestor::li`);
    await row.scrollIntoView();
    const deleteBtn = await this.btnDeleteInRow(row);
    await deleteBtn.waitForClickable();
    await deleteBtn.click();
  }

  async confirmDeletion(textThatShouldLeave) {
    await this.modalContainer.waitForDisplayed();
    await this.btnConfirmDelete.click();

    const safeText = this.escapeXPathString(textThatShouldLeave);
    const element = await $(`//p[text()="${safeText}"]`);
    await element.waitForExist({ reverse: true, timeout: 8000 });
  }

  async getAnotherItemText(excludeText) {
    await (await $("p.story")).waitForExist();
    const stories = await this.allStoriesTexts;

    for (const story of stories) {
      const text = await story.getText();
      if (text.trim() !== excludeText.trim() && text.trim().length > 0) {
        return text;
      }
    }
    throw new Error("There are no other items");
  }

  async editItemBySpecificText(originalText, newText) {
    const safeOriginalText = this.escapeXPathString(originalText);
    const row = await $(`//p[text()="${safeOriginalText}"]/ancestor::li`);
    await row.scrollIntoView();
    const editBtn = await this.btnEditInRow(row);

    try {
      await editBtn.click();
    } catch (e) {
      await browser.execute((el) => el.click(), await editBtn);
    }

    await this.inputText.setValue(newText);
    await this.btnUpdate.click();
    await this.btnUpdate.waitForDisplayed({ reverse: true });
  }

  async isTextInList(text) {
    const safeText = this.escapeXPathString(text);
    const element = await $(`//p[text()="${safeText}"]`);
    return await element.isDisplayed().catch(() => false);
  }

  async isItemFullyCreated(text) {
    const safeText = this.escapeXPathString(text);
    const row = await $(`//p[text()="${safeText}"]/ancestor::li`);
    const image = await row.$("img");

    const isTextDisplayed = await row.isDisplayed();
    const imageSrc = await image.getAttribute("src");

    return isTextDisplayed && !!imageSrc && imageSrc.length > 0;
  }
}

export default new StrangerPage();
