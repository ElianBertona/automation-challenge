import StrangerPage from "../pageobjects/stranger.page.js";
import path from "path";

describe("Angular Strangerlist: Challenge Suite", () => {
  // 1. Declaración de variables de suite
  let uniqueText;
  let updatedText;
  let imagePath;

  // 2. Setup inicial: se ejecuta una sola vez al empezar
  before(async () => {
    const timestamp = Date.now();
    uniqueText = `User Story ${timestamp}`;
    updatedText = `Updated Story ${timestamp}`;
    imagePath = path.join(process.cwd(), "assets", "image.jpg");
    
    // Abrimos la app para inicializar el navegador
    await StrangerPage.open();
  });

  // 3. Setup por test: asegura que cada test empiece en la URL base
  beforeEach(async () => {
    await StrangerPage.open();
  });

  it("TC-01: Create item with image and text", async () => {
    await StrangerPage.createItem(uniqueText, imagePath);

    const isFullyCreated = await StrangerPage.isItemFullyCreated(uniqueText);
    // Usamos el expect de WDIO (asincrónico)
    await expect(isFullyCreated).toBe(true);
  });

  it("TC-02: Edit another existing item", async () => {
    // Obtenemos un texto de la lista que no sea el que acabamos de crear
    const otherItemText = await StrangerPage.getAnotherItemText(uniqueText);

    if (otherItemText) {
      await StrangerPage.editItemBySpecificText(otherItemText, updatedText);

      const newTextExists = await StrangerPage.isTextInList(updatedText);
      const previousTextExists = await StrangerPage.isTextInList(otherItemText);

      await expect(newTextExists).toBe(true);
      await expect(previousTextExists).toBe(false);
    }
  });

  it("TC-03: Delete the item created", async () => {
    const exists = await StrangerPage.isTextInList(uniqueText);
    
    if (exists) {
      await StrangerPage.clickDeleteForText(uniqueText);
      await StrangerPage.confirmDeletion(uniqueText);
      
      const stillInList = await StrangerPage.isTextInList(uniqueText);
      await expect(stillInList).toBe(false);
    } else {
      throw new Error(
        `TC-03 could not be executed because the item "${uniqueText}" was not found.`,
      );
    }
  });
});