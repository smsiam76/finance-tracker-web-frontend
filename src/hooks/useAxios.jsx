import axios from "axios";

const useAxios = axios.create({
    baseURL: 'https://finance-tracker-web-backend.onrender.com',
    // baseURL: 'http://localhost:5000',
    headers: {
         'Content-Type': 'application/json',
        'Accept': 'application/json'
    }
})

export default useAxios;