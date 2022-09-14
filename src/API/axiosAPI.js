import axios from 'axios';

const axiosAPI = axios.create({
    baseURL: 'https://youtube.googleapis.com/youtube/v3/',
    params: {
        key: process.env.REACT_APP_YT_API_KEY1,
    },
    validateStatus: status => { 
        console.log('Response validation: status ', status); 
        return (status < 400)}
});

axiosAPI.interceptors.request.use(request => {
    if (request.withToken) {
        console.log('Authorization header added');
        request.headers.Authorization = `Bearer ${localStorage.getItem('token')}`;
    }
        return request
}, error => {
    return Promise.reject(error);
});

axiosAPI.interceptors.response.use(response => response, 
    error => {
        if (error?.response?.status === 401) {
            console.log('401 intercepted');
        } 
        return Promise.reject(error);
});

export default axiosAPI
