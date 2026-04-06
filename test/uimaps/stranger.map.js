export const StrangerMap = {
    inputs: {
        image: '#inputImage',
        textArea: 'textarea[name="text"]'
    },
    buttons: {
        create: 'button=Create Item',
        update: 'button=Update Item',
        confirmDelete: 'button=Yes, delete it!',
        deleteInRow: 'button=Delete',
        editInRow: 'button=Edit'
    },
    containers: {
        itemsCount: 'h1.ng-binding',
        modal: '.modal-content',
        allStories: 'p.story'
    },
    dynamic: {
        rowByText: (text) => `//p[text()="${text}"]/ancestor::li`,
        textElement: (text) => `//p[text()="${text}"]`,
        imageInRow: 'img'
    }
};