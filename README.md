![cf](http://i.imgur.com/7v5ASc8.png) 43: OAuth
===

## Overview
- This project was to learn how to implement OAuth using a third party API.  The front end consists of a simple index.html with a link redirecting a user to login with their Google account credentials.  Upon choosing to log in with Google a POST request is made via a server on a backend web application server that goes to https://www.googleapis.com/oauth2/v4/token
- The Google endpoint will then respond with a code that begins the handshake process.  
- When the code is received via the POST response, the backend web server sends a predetermined http request with the following fields....
```
.send({
        code: request.query.code,
        grant_type: 'authorization_code',
        client_id: process.env.GOOGLE_OAUTH_ID,
        client_secret: process.env.GOOGLE_OAUTH_SECRET,
        redirect_uri: `${process.env.API_URL}/oauth/google`
```

- If the request is authorized, Google's endpoint returns a response and we then send a GET request to https://www.googleapis.com/plus/v1/people/me/openIdConnect where our application and the user is authenticated again.  Upon a successful response from this GET request we can create a token and authorization for the user which goes back to the front end and allows the user to access our application.

## Initial Login 
![](./assets/login%20start.png)

## Choosing a Google Account for Login
![](./assets/Choose%20an%20Account.png)
