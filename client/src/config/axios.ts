import axios from 'axios';

// Create an axios instance with a base URL
const axiosInstance = axios.create({
    baseURL: 'http://localhost:3000/api/v1',
    withCredentials: true,
    headers: {
        'Content-Type': 'application/json',
    },
});



export default axiosInstance;
