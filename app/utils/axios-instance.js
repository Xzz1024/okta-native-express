const axios = require('axios');
const config = require('../../config');

const axiosInstance = axios.create({
    baseURL: config.api.baseURL
})

axiosInstance.defaults.headers.post['Accept'] = 'application/json';
axiosInstance.defaults.headers.post['Cache-Control'] = 'no-cache';
axiosInstance.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded';

module.exports = axiosInstance;