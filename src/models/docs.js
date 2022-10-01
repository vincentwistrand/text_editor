// Fetch docs from backend

//const baseURL = "http://localhost:1337";
const baseURL = "https://jsramverk-editor-viai20.azurewebsites.net";

const docsModel = {
    getAllDocs: async function getAllDocs(token) {
        const response = await fetch(`${baseURL}/docs`, {
            headers: {
                "x-access-token": token,
            }
        });
        const result = await response.json();

        return result.data;
    },


    getUserDocs: async function getUserDocs(token, email) {
        const query = `email=${email}`;

        const response = await fetch(`${baseURL}/userdocs?${query}`, {
            headers: {
                "x-access-token": token,
            }
        });
        const result = await response.json();

        return result.data;
    },


    saveDoc: async function saveDoc(doc, token) {
        const dokument = {
            id: doc._id,
            name: doc.name,
            content: doc.content,
            access: doc.access
        }

        const response = await fetch(`${baseURL}/docs`, {
            method: "PUT",
            body: JSON.stringify(dokument),
            headers: {
                "content-type": "application/json",
                "x-access-token": token,
            },
        });
        
        const result = await response.json();

        return result.data;
    },



    createDoc: async function createDoc(doc, token) {
        const requestOptions = {
            method: 'POST',
            headers: {
                "x-access-token": token,
            }
        };
        const query = `user=${doc.user}&name=${doc.name}`;
        
        const response = await fetch(`${baseURL}/docs?${query}`, requestOptions);
        const result = await response.json();

        return result.data;
    },


    deleteDoc: async function deleteDoc(doc, token) {
        const requestOptions = {
            method: 'DELETE',
            headers: {
                "x-access-token": token,
            }
        };
        const query = `id=${doc.id}`;
        
        await fetch(`${baseURL}/docs?${query}`, requestOptions);
    }
};

export default docsModel;