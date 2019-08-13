const axios = require('axios');
const config = require('../../config');


const axiosInstance1 = axios.create({
    baseURL: config.api.baseURL
})


module.exports = axiosInstance1;