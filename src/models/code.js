const codeModel = {
    postCode: async function postCode(code) {
        var data = {
            code: btoa(code)
        };
        
        return fetch("https://execjs.emilfolino.se/code", {
            body: JSON.stringify(data),
            headers: {
                'content-type': 'application/json'
            },
            method: 'POST'
        })
        .then(function (response) {
            return response.json();
        })
        .then(function(result) {
            let decodedOutput = atob(result.data);
            return decodedOutput;
        });
    }
};

export default codeModel;