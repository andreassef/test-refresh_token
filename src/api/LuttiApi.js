const axios = require('axios').default;
const axiosApiInstance = axios.create();
const {refresh} = require('./LuttiApi')

// Request interceptor for API calls
let token = "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjgwZTdjMjI4LTYzMjktNDg0OS1iMjljLWE4ODg1ZjNhMjM1OSIsImlhdCI6MTYxNTQ4NjkxOSwiZXhwIjoxNjE1NDg3MDk5fQ.r5uMjW5cboBhW4QRT3DULmZaDpUdpHvP0HLIZQ9I0C0"
axiosApiInstance.interceptors.request.use(
    async config => {
        // const value = await redisClient.get(rediskey)
        // const keys = JSON.parse(value)

        const token2 = config.headers.Authorization

        console.log('Token atual: ' + token)
        if (token2) {
            console.log('Entrou no if')
            token = token2;
        }

        console.log('Token vindo do refresh token: ' + config.headers.Authorization)
        config.headers = {
            'Authorization': `${token}`,
            'Accept': 'application/json',
            'Content-Type': 'application/x-www-form-urlencoded'
        }
        console.log('Estou enviando a requisicao')
        return config;
    },
    error => {
        Promise.reject(error)
    });

// Response interceptor for API calls
axiosApiInstance.interceptors.response.use((response) => {
    console.log('Resposta do servidor')
    return response
}, async function (error) {
    const originalRequest = error.config;
    if (error.response.status === 401 && !originalRequest._retry) {
        originalRequest._retry = true;
        const token2 = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjgwZTdjMjI4LTYzMjktNDg0OS1iMjljLWE4ODg1ZjNhMjM1OSIsImlhdCI6MTYxNTQ4Njk3NCwiZXhwIjoxNjE1NDg3MTU0fQ.PtD5mCMpSY3DX2TX09X4ZrSwn9f7H9aLqIt-5eOmsLo"
        //axiosApiInstance.defaults.headers.common['Authorization'] = 'Bearer ' + token2;
        originalRequest.headers.Authorization = `Bearer ${token2}`;
        console.log('O token foi renovado')
        console.log('Config origin: ' + JSON.stringify(originalRequest));
        return axiosApiInstance(originalRequest);
    }
    return Promise.reject(error);
});

exports.login = async function login(email, senha) {
    try {
        const user = await axios.post(`http://localhost:3000/users/login`, {
            email, senha
        });

        console.log(user.data.userData)
        return user;
    } catch (error) {
        throw new Error(error.response.data.erro)
    }
}

exports.list = async function list() {
    try {
        const users = await axiosApiInstance.get(`http://localhost:3000/users`);

        //console.log(users)
        return users;
    } catch (error) {
        throw new Error(error.response.data.erro)
    }
}

// exports.list = async function list() {
//     try {
//         const users = await axios.get(`http://localhost:3000/users`, {
//             headers: {
//                 authorization: `Bearer ${token}`
//             }
//         });

//         console.log(users)
//         return users;
//     } catch (error) {
//         throw new Error(error.response.data.erro)
//     }
// }

exports.refresh = async function refreshToken(refreshToken) {
    try {
        const newToken = await axios.post(`http://localhost:3000/users/refresh_token`, 
        {
            refreshToken
        },
         {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });

        console.log('Passou aqui')
        console.log(newToken)
        return newToken;
    } catch (error) {
        throw new Error(error.response.data.erro)
    }
}

// class LuttiApi {

//     // constructor() {
//     //     this.url = 'http://localhost:3000'
//     // }



// async login(email, senha) {
//     try {
//         const user = await axios.post(`http://localhost:3000/users/login`, {
//             email, senha
//         });

//         console.log(user.data.userData)
//         return user;
//     } catch (error) {
//         throw new Error(error.response.data.erro)
//     }
// }
// }

// module.exports = LuttiApi;