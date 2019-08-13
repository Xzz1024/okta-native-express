const express = require('express');
const bodyParser = require('body-parser');
const config = require('./config');
const axiosInstance = require('./app/utils/axios-instance');
const axiosInstance1 = require('./app/utils/axios-instance');
const proxy = require('http-proxy-middleware');
const path = require('path');
const to = require('await-to-js').to;
const random = require('./app/utils/random');
const sha = require('./app/utils/sha256');
const formartUrl = require('./app/utils/formatUrl');
const session = require('express-session');
const axios = require('axios');


const app = express();

app.set('config', config);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug')


app.use(bodyParser.urlencoded({ extended: false}));
app.use(bodyParser.json());

app.use(session({
    secret:"session code",		
    cookie: {maxAge:6*60*60*1000},		
    resave: false,			
    saveUninitialized:false		
  }))



const token = async (code, code_verifier) => {
    const url = formartUrl.tokenURL(code, code_verifier);
    return await axiosInstance.post(`${url}`)
}


app.get('/',(req, res, next) => {
    
    const obj= {};
    const num = 43 + Math.round(Math.random()*10);

    const state = random(32);
    const code_verifier = random(num);
    const code_challenge = sha(code_verifier);
  
    obj.code_verifier = code_verifier;
    obj.code_challenge = code_challenge;

    req.session.obj = obj;

    const url = formartUrl.authorizeURL(state, obj.code_challenge);


    res.render('home', { title: 'ISE Authorization Code Samples', baseURL:url});
})



app.get('/redirect-callback',async (req, res, next) => {
    const state = random(32);
    let error, response
    if(!req.session.obj){
        res.redirect('/');
    }else{
        const code_verifier = req.session.obj.code_verifier;
        const code = req.query.code
        if(code){

            [error, response] = await to(token(code,code_verifier));
        }
        
        if(error){
            res.redirect('/')
        }else{
            
            req.session.accessToken = response.data.access_token;
            req.session.idToken = response.data.id_token;
            const logoutUrl = formartUrl.logoutURL(req.session.idToken,config.okta.post_logout_redirect_uri,state)
            req.session.logoutUrl = logoutUrl;
            res.render('index', { title: 'Response Body', message: response.data,logoutUrl:logoutUrl});
        }
    
    }

})

const getProfile = async (accessToken) => {
    axiosInstance1.defaults.headers.post['Authorization'] = `Bearer ${accessToken}`;
    return await axiosInstance1.post('userinfo')
}
app.get('/profile', async (req, res, next) => {
    
    let error, response;

    if(!req.session.accessToken){
        res.redirect('/')
    }
    const accessToken = req.session.accessToken;

    [error, response] = await to(getProfile(accessToken));
    if(error){
        res.json(error)
    }else{
        const logoutUrl = req.session.logoutUrl;
        res.render('profile',{title: 'Profile', message: response.data,logoutUrl: logoutUrl})
    }
})


app.get('/message', async (req, res, next) => {
    if(!req.session.accessToken){
        res.redirect('/')
    }
    const accessToken = req.session.accessToken;
    const response = await axios.get('http://localhost:8000/api/messages', {
        headers: {
          Authorization: `Bearer ${accessToken}`
        }
      })

    if(response){
        res.render('message',{title: 'Message Info', message: response.data.messages[0]})
    }else {
        res.redirect('/')
    }
})


app.listen(config.port, () => { 
    console.log(`App running on port ${config.port}`)
    
})
