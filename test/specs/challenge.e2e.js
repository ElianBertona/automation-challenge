import StrangerPage from '../pageobjects/stranger.page.js';
import path from 'path';

describe('Angular Strangerlist: Challenge Suite', () => {
    const uniqueText = `User Story ${Date.now()}`;
    const updatedText = `Updated Story ${Date.now()}`;
    const imagePath = path.join(process.cwd(), 'assets', 'test.jpg');
    let otherItemText = '';

    beforeEach(async () => {
        await StrangerPage.open();
    });

    it('TC-01: Create an item', async () => {
        await StrangerPage.createItem(uniqueText, imagePath);
        
        const exists = await StrangerPage.isTextInList(uniqueText);
        expect(exists).toBe(true);
    });

    it('TC-02: Edit another existing item', async () => {
        otherItemText = await StrangerPage.getAnotherItemText(uniqueText);
        
        await StrangerPage.editItemBySpecificText(otherItemText, updatedText);
        
        const newTextExists = await StrangerPage.isTextInList(updatedText);
        const previousTextExists = await StrangerPage.isTextInList(otherItemText);
        
        expect(newTextExists).toBe(true);
        expect(previousTextExists).toBe(false);
    });

    it('TC-03: Delete the item created', async () => {
        const exists = await StrangerPage.isTextInList(uniqueText);
        if (exists) {
            await StrangerPage.clickDeleteForText(uniqueText);
            await StrangerPage.confirmDeletion(uniqueText);
            expect(await StrangerPage.isTextInList(uniqueText)).toBe(false);
        } else {
            throw new Error(`No se pudo ejecutar TC-03 porque el item "${uniqueText}" nunca se creó.`);
        }
    });
});