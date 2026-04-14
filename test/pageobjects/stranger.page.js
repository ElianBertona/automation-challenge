import { $ } from "@wdio/globals";
import { StrangerMap } from "../uimaps/stranger.map.js";

class StrangerPage {
  get inputImage() {
    return $(StrangerMap.inputs.image);
  }
  get inputText() {
    return $(StrangerMap.inputs.textArea);
  }
  get btnCreate() {
    return $(StrangerMap.buttons.create);
  }
  get btnUpdate() {
    return $(StrangerMap.buttons.update);
  }
  get itemsCountLabel() {
    return $(StrangerMap.containers.itemsCount);
  }
  get modalContainer() {
    return $(StrangerMap.containers.modal);
  }
  get btnConfirmDelete() {
    return $(StrangerMap.buttons.confirmDelete);
  }
  get allStoriesTexts() {
    return $$(StrangerMap.containers.allStories);
  }

  async getRowByText(text) {
    return $(StrangerMap.dynamic.rowByText(text));
  }

  async getElementByText(text) {
    return $(StrangerMap.dynamic.textElement(text));
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

    await browser.waitUntil(async () => await this.isTextInList(text), {
      timeout: 10000,
      timeoutMsg: `The item with text "${text}" did not appear in the list`,
    });
  }

  async clickDeleteForText(text) {
    const row = await this.getRowByText(text);
    await row.scrollIntoView();

    const deleteBtn = await row.$(StrangerMap.buttons.deleteInRow);
    await deleteBtn.waitForClickable();
    await deleteBtn.click();
  }

  async confirmDeletion(textThatShouldLeave) {
    await this.modalContainer.waitForDisplayed();
    await this.btnConfirmDelete.click();

    const element = await this.getElementByText(textThatShouldLeave);
    await element.waitForExist({
      reverse: true,
      timeout: 8000,
      timeoutMsg: "The item was not deleted from the DOM",
    });
  }

  async editItemBySpecificText(originalText, newText) {
    const row = await this.getRowByText(originalText);
    await row.scrollIntoView();

    const editBtn = await row.$(StrangerMap.buttons.editInRow);

    try {
      await editBtn.click();
    } catch (e) {
      await browser.execute((el) => el.click(), await editBtn);
    }

    await this.inputText.setValue(newText);
    await this.btnUpdate.click();

    await this.btnUpdate.waitForDisplayed({ reverse: true });
  }

  async getAnotherItemText(excludeText) {
    const firstStory = await $(StrangerMap.containers.allStories);
    await firstStory.waitForExist();

    const stories = await this.allStoriesTexts;

    for (const story of stories) {
      const text = await story.getText();
      const cleanText = text.trim();
      const cleanExclude = excludeText.trim();

      if (cleanText !== cleanExclude && cleanText.length > 0) {
        return cleanText;
      }
    }
    throw new Error("There are no other items to interact with in the list");
  }

  async getRowImage(text) {
    const row = await this.getRowByText(text);
    return await row.$(StrangerMap.dynamic.imageInRow);
  }

  async getItemImageSrc(text) {
    const row = await this.getRowByText(text);
    const image = await row.$(StrangerMap.dynamic.imageInRow);
    return await image.getAttribute("src");
}

  async isTextInList(text) {
    const element = await this.getElementByText(text);
    return await element.isDisplayed().catch(() => false);
  }
}

export default new StrangerPage();
