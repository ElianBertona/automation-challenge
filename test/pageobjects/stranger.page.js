import { $ } from '@wdio/globals'

class StrangerPage {
    get inputImage() { return $('#inputImage'); }
    get inputText() { return $('textarea[name="text"]'); }
    get btnCreate() { return $('button=Create Item'); }
    get btnUpdate() { return $('button=Update Item'); }
    get itemsCountLabel() { return $('h1.ng-binding'); }
    get modalContainer() { return $('.modal-content'); }
    get btnConfirmDelete() { return $('button=Yes, delete it!'); }
    get allStoriesTexts() { return $$('p.story'); }
    btnDeleteInRow(row) { return row.$('button=Delete'); }
    btnEditInRow(row) { return row.$('button=Edit'); }

    async open() {
        await browser.url('/');
        await this.itemsCountLabel.waitForDisplayed({ timeout: 15000 });
    }

    async createItem(text, filePath) {
        const remoteFilePath = await browser.uploadFile(filePath);
        await this.inputImage.setValue(remoteFilePath);
        await this.inputText.setValue(text);
        await this.btnCreate.click();
        
        await browser.waitUntil(async () => {
            return await this.isTextInList(text);
        }, { timeout: 10000, timeoutMsg: 'El ítem no apareció' });
    }

    async clickDeleteForText(text) {
        const row = await $(`//p[text()="${text}"]/ancestor::li`);
        await row.scrollIntoView();
        const deleteBtn = await this.btnDeleteInRow(row);
        await deleteBtn.waitForClickable();
        await deleteBtn.click();
    }

    async confirmDeletion(textThatShouldLeave) {
        await this.modalContainer.waitForDisplayed();
        await this.btnConfirmDelete.click();
        
        const element = await $(`//p[text()="${textThatShouldLeave}"]`);
        await element.waitForExist({ reverse: true, timeout: 8000 });
    }

    async getAnotherItemText(excludeText) {
        await (await $('p.story')).waitForExist();
        const stories = await this.allStoriesTexts;
        
        for (const story of stories) {
            const text = await story.getText();
            if (text.trim() !== excludeText.trim() && text.trim().length > 0) {
                return text;
            }
        }
        throw new Error("No hay otros ítems");
    }

    async editItemBySpecificText(originalText, newText) {
        const row = await $(`//p[text()="${originalText}"]/ancestor::li`);
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
        const element = await $(`//p[text()="${text}"]`);
        return await element.isDisplayed().catch(() => false);
    }
}

export default new StrangerPage();