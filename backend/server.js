'use strict';

import express from 'express';
import superagent from 'superagent';

const app = express();

require('dotenv').config();

const GOOGLE_OAUTH_URL = 'https://www.googleapis.com/oauth2/v4/token';
const OPEN_ID_URL = 'https://www.googleapis.com/plus/v1/people/me/openIdConnect';

app.get('/oauth/google', (request, response) => {
  console.log('__step 3.1__ receiving CODE');
  if (!request.query.code) {
    response.redirect(process.env.CLIENT_URL);
  } else {
    console.log('__CODE__', request.query.code);
    // ---------- 3.2 ------------------
    console.log('__step 3.2__ - sending the code back as part of the handshake');
    return superagent.post(GOOGLE_OAUTH_URL)
      .type('form')
      .send({
        code: request.query.code,
        grant_type: 'authorization_code',
        client_id: process.env.GOOGLE_OAUTH_ID,
        client_secret: process.env.GOOGLE_OAUTH_SECRET,
        redirect_uri: `${process.env.API_URL}/oauth/google`
      })
      .then(tokenResponse => {
        // --------- 3.3 ----------------
        console.log('___step 3.3 ___ ACCESS TOKEN');

        if (!tokenResponse.body.access_token) {
          response.redirect(process.env.CLIENT_URL);
        }

        const accessToken = tokenResponse.body.access_token;
        // --------------- 4 -------------
        return superagent.get(OPEN_ID_URL)
          .set('Authorization', `Bearer ${accessToken}`);
      })
      .then(openIDResponse => {
        console.log('___ step 4 ___ OPEN ID');
        console.log(openIDResponse.body);

        // STEP 5 - create our own account and token and send the token back to the front end
        response.cookie('HERE COMES THE TOKEN');
        response.redirect(process.env.CLIENT_URL);
      })
      .catch(error => {
        console.log(error);
        response.redirect(process.env.CLIENT_URL + '?error=oauth');
      });
  }
});

app.listen(process.env.PORT, () => {
  console.log('__SERVER_IS_UP__', process.env.PORT);
});
