const env = 'dev'; 
const appConfig = require(`./config/${env}.json`);


const config = {
    env: env, 
    port: process.env.PORT || 3001,
    ...appConfig 
}
module.exports = config;