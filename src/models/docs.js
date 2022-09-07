// Fetch docs from backend

const docsModel = {
    getAllDocs: async function getAllDocs() {
        const response = await fetch(`https://jsramverk-editor-viai20.azurewebsites.net/docs`);
        const result = await response.json();

        return result;
    },
    saveDoc: async function saveDoc(doc) {
        const requestOptions = {
            method: 'PUT'
        };
        const query = `id=${doc.id}&name=${doc.name}&content=${doc.content}`;
        
        const response = await fetch(`https://jsramverk-editor-viai20.azurewebsites.net/docs?${query}`, requestOptions);
        const result = await response.json();

        return result;
    },
    createDoc: async function createDoc(doc) {
        const requestOptions = {
            method: 'POST'
        };
        const query = `name=${doc.name}&content=${doc.content}`;
        
        const response = await fetch(`https://jsramverk-editor-viai20.azurewebsites.net/docs?${query}`, requestOptions);
        const result = await response.json();

        return result;
    },
    deleteDoc: async function deleteDoc(doc) {
        const requestOptions = {
            method: 'DELETE'
        };
        const query = `id=${doc.id}`;
        
        await fetch(`https://jsramverk-editor-viai20.azurewebsites.net/docs?${query}`, requestOptions);

    }
};

export default docsModel;