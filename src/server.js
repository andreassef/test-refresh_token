const express = require('express');
const app = express();
const {v4: uuid} = require('uuid');
const LuttiApi = require('./api/LuttiApi');
const {list} = require('./api/LuttiApi');
const {login} = require('./api/LuttiApi');
const {refresh} = require('./api/LuttiApi');
//const luttiApi = new LuttiApi();

app.use(express.json());

app.post("/userLutti", async (request, response) => {
    try {
        const {email, senha} = request.body;
        // const user = request.body;

        const user = await login(email, senha);

        if (email == "") {
            throw Error("O email nao pode estar vazio");
        }

        if (senha == "") {
            throw Error("A senha nao pode estar vazio");
        }

        return response.status(200).json({user: user.data.userData, refresh: user.data.refreshToken, authorization: user.headers.authorization });
    } catch (error) {
        return response.status(400).json({error: error.message})
    }
})

app.post("/user/refreshToken", async (request, response) => {
    try {
        const {refreshToken} = request.body;
        
        const newToken = await refresh(refreshToken);

        return response.status(200).json({data: newToken.data.userData, refresh: newToken.data.refreshToken, authorization: newToken.headers.authorization});
    } catch (error) {
        return response.status(400).json({error: error.message})
    }
})

app.get("/userLutti", async (request, response) => {

    // let usersList = users.map((element) => {
    //     return element;
    // })

    try {
        const users = await list()

        return response.status(200).json(users.data)
    } catch (error) {
        return response.status(400).json({error: error.message})
    }
})

app.get("/user", (request, response) => {

    // let usersList = users.map((element) => {
    //     return element;
    // }) 

    return response.status(200).json(users)
})

app.put("/user/:id", (request, response) => {
    let userId = request.params;
    let user = request.body;

    let updateUser;
    users.map((element) => {
        if (element.id == userId.id) {
            updateUser = element.name = user.name;
            return updateUser;
        }
    })

    return response.status(200).json(updateUser)

})

app.delete("/user/:id", (request, response) => {
    let userId = request.params;

    // let updateUser;
    // users.map((element, index) => {
    //     if (element.id == userId.id) {
    //         updateUser = element.name
    //         users.splice(index,1);
    //         return updateUser;
    //     }
    // })

    var indice = users.findIndex(obj => obj.id == userId.id);
    let userName = users[indice].name;
    users.splice(indice, 1);
    console.log(indice);

    return response.status(204).json(userName)
})

//app.patch()

const port = 3333;

app.listen(port, () => {
    console.log(`Server up on port ${port}`)
})