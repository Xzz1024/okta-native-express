const config = require('../../config');


const fomartUrl = (config) => {
    let _str = ''; 
    for(var o in config){
        _str += o + "=" + config[o] + "&"; 
    } 
    const str = _str.substring(0, _str.length-1); 
    return str;
    
}

const authorizeURL = (state, code_challenge) => {
    const authorizeConfig = {
        client_id: config.okta.client_id,
        response_type: 'code',
        scope: encodeURIComponent(config.okta.scope),
        redirect_uri:encodeURIComponent(config.okta.redirect_uri),
        state: state,
        code_challenge_method: 'S256',
        code_challenge: code_challenge
    }
    const str = fomartUrl(authorizeConfig);
    const baseURL = config.api.baseURL
    return baseURL+'authorize?'+str; 
}
const tokenURL = (code, code_verifier) => {
    const tokenConfig = {
        client_id: config.okta.client_id,
        redirect_uri:encodeURIComponent(config.okta.redirect_uri),
        code: code,
        grant_type: 'authorization_code',
        code_verifier: code_verifier
    }
    const str = fomartUrl(tokenConfig);
    return 'token?'+ str;

}
const logoutURL = (id_token, post_logout_redirect_uri, state) => {
    const logoutConfig = {
        id_token_hint: id_token,
        post_logout_redirect_uri: post_logout_redirect_uri,
        state: state
    }
    const url = fomartUrl(logoutConfig);
    const baseURL = config.api.baseURL
    return `${baseURL}logout?${url}`

}
module.exports = {
    authorizeURL,
    tokenURL,
    logoutURL
}
