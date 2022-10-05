const baseURL = "http://localhost:1337";
//const baseURL = "https://jsramverk-editor-viai20.azurewebsites.net";

const authModel = {
    getUsers: async function getUsers() {
        const query = "{ users { _id email password admin } }";

        const result = fetch(`${baseURL}/graphql`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify({ query: query })
        })
            .then(r => r.json())
            .then(result => {return result.data.users});
        return result
    },

    getUser: async function getUser(id) {
        const users = await authModel.getUsers();

        const user = users.filter(user => {
            return user._id === id;
          });

        return user[0];
    },

    getUserByEmail: async function getUser(email) {
        const users = await authModel.getUsers();

        const user = users.filter(user => {
            return user.email === email;
          });

        return user[0];
    },

    deleteUser: async function deleteUser(id) {
        const userId = {
            id: id
        };

        const response = await fetch(`${baseURL}/auth/user`, {
            method: "DELETE",
            body: JSON.stringify(userId),
            headers: {
                "content-type": "application/json"
            },
        });

        const result = await response.json();
        return result;
    },


    login: async function login(email, password) {
        const user = {
            email: email,
            password: password
        };

        const response = await fetch(`${baseURL}/auth/login`, {
            method: "POST",
            body: JSON.stringify(user),
            headers: {
                "content-type": "application/json"
            },
        });

        const result = await response.json();

        return result;
    },

    register: async function register(email, password, admin) {
        const user = {
            email: email,
            password: password,
            admin: false
        };

        if (admin === true) {
            user.admin = true;
        };

        console.log(user);

        const response = await fetch(`${baseURL}/auth/register`, {
            method: "POST",
            body: JSON.stringify(user),
            headers: {
                "content-type": "application/json"
            },
        });

        const result = await response.json();

        return result;
    },
};

export default authModel;