const baseURL = "http://localhost:1337";
//const baseURL = "https://jsramverk-editor-viai20.azurewebsites.net";

const inviteModel = {
    sendInvite: async function sendInvite(inputInvite, userEmail, title, token) {
        const content = {
            to: inputInvite,
            from: userEmail,
            title: title
        };
        const result = fetch(`${baseURL}/invite/send`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                "x-access-token": token
            },
            body: JSON.stringify(content)
        })
        .then(r => r.json())
        .then(result => {return result});

        return result;
    }
}

export default inviteModel;