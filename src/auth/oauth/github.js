const superagent = require('superagent');
const Users = require('../users-model.js');
require('dotenv').config();

 const API = 'http://localhost:3000';
const GTS = 'https://github.com/login/oauth/authorize';
const GAK = process.env.GITHUB_API_KEY;
// const SERVICE = 'https://www.googleapis.com/plus/v1/people/me/openIdConnect';

 let authorize = (request) => {
  return superagent
    .get(GTS)
    .type('form')
    .send({
      client_id: GAK,
      redirect_uri: `${API}/githubAuth`,
    })
    .then((response) => {
      console.log(response);
      return superagent
        .post('https://github.com/login/oauth/access_token')
        .send({
          code: response.code,
          client_id: GAK,
          client_secret: process.env.GITHUB_CLIENT_SECRET,
        })
        .then((response) => {
          let access_token = response.body.access_token;
          console.log('(2)', access_token);
          return access_token;
        })
        .then((token) => {
          console.log(token);
          return (
            superagent
              // .get(SERVICE)
              .set('Authorization', `Bearer ${token}`)
              .then((response) => {
                let user = response.body;
                console.log('(3)', user);
                return user;
              })
          );
        })
        .then((oauthUser) => {
          console.log('(4) Create Our Account');
          return Users.createFromOauth(oauthUser.email);
        })
        .then((actualUser) => {
          return actualUser.generateToken();
        })
        .catch((error) => error);
    });
};

 module.exports = authorize;