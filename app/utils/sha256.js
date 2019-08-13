const crypto = require('crypto');

const base64URLEncode = (str) => {
    
    return sha256(str).toString('base64')
        .replace(/\+/g, '-')
        .replace(/\//g, '_')
        .replace(/=/g, '');
}

const sha256 = (buffer) => {
    return crypto.createHash('sha256').update(buffer).digest();
}

module.exports = base64URLEncode
