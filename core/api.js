import axios from 'axios'
const api = axios.create({
    baseURL:process.env.EXPO_PUBLIC_API_URL,
    headers:{
        //if need other type make multipart
        "Content-Type":'application/json'
    }
})

export default api