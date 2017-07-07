'use strict';

const moment = require('moment');
const request = require('request');
const express = require('express');
const Webtask = require('webtask-tools');
const Twitter = require('twitter-node-client').Twitter;
const app = express();
const jwtDecoder = require('jwt-decode');

/*
 * Local variables
 */
let accessToken = null;
let lastLogin = null;
app.get('/timeline', function(req, res) {
  if (!req.headers['authorization']) {
    return res.status(401).json({ error: 'unauthorized' });
  }

  const context = req.webtaskContext;

  const authorization =
    req.headers['authorization'] || req.headers['Authorization'];
  const token = authorization.split(' ')[1];
  const reqBody = req.body;
  const decoded = jwtDecoder(token);
  getAccessToken(
    context,
    reqBody,
    decoded,
    (err, context, reqBody, decoded, token) => {
      getUserProfile(
        context,
        reqBody,
        decoded,
        token,
        (error, context, reqBody, user) => {
          callExtIDPApi(context, reqBody, user, (err, result) => {
            res.setHeader('Content-Type', 'application/json');
            res.send(result);
          });
        }
      );
    }
  );
});

/*
* Request a Auth0 access token every 24 hours
*/
function getAccessToken(context, reqBody, decoded, cb) {
  if (
    !accessToken ||
    !lastLogin ||
    moment(new Date()).diff(lastLogin, 'minutes') > 1440
  ) {
    const options = {
      url: 'https://' + context.data.ACCOUNT_NAME + '.auth0.com/oauth/token',
      json: {
        audience: 'https://' + context.data.ACCOUNT_NAME + '.auth0.com/api/v2/',
        grant_type: 'client_credentials',
        client_id: context.data.CLIENT_ID,
        client_secret: context.data.CLIENT_SECRET,
      },
    };

    return request.post(options, function(err, response, body) {
      if (err) return cb(err);
      else {
        lastLogin = moment();
        accessToken = body.access_token;
        return cb(null, context, reqBody, decoded, accessToken);
      }
    });
  } else {
    return cb(null, context, reqBody, decoded, accessToken);
  }
}

/*
* Get the complete user profile with the read:user_idp_token scope
*/
function getUserProfile(context, reqBody, decoded, token, cb) {
  const options = {
    url:
      'https://' +
      context.data.ACCOUNT_NAME +
      '.auth0.com/api/v2/users/' +
      decoded.sub,
    json: true,
    headers: {
      authorization: 'Bearer ' + token,
    },
  };

  request.get(options, function(error, response, user) {
    return cb(error, context, reqBody, user);
  });
}

/*
* Call the External API with the IDP access token to return data back to the client.
*/
function callExtIDPApi(context, reqBody, user, cb) {
  let twitter_access_token = null;
  let twitter_access_token_secret = null;
  let twitter_user_id = null;
  const provider = user.user_id.split('|')[0];
  /*
  * Checks for the identities array in the user profile
  * Matches the access_token with the user_id provider/strategy
  */
  if (user && user.identities) {
    for (var i = 0; i < user.identities.length; i++) {
      if (
        user.identities[i].access_token &&
        user.identities[i].provider === provider
      ) {
        twitter_access_token = user.identities[i].access_token;
        twitter_access_token_secret = user.identities[i].access_token_secret;
        twitter_user_id = user.identities[i].user_id;
        i = user.identities.length;
      }
    }
  }
  if (twitter_access_token && twitter_access_token_secret) {
    let twitterClient = new Twitter({
      consumerKey: context.data.TWITTER_CONSUMER_KEY,
      consumerSecret: context.data.TWITTER_CONSUMER_SECRET,
      accessToken: twitter_access_token,
      accessTokenSecret: twitter_access_token_secret,
    });

    twitterClient.getUserTimeline(
      {
        user_id: `${twitter_user_id}`,
        count: '30',
        include_rts: 'false',
      },
      err => cb(err),
      data => cb(null, data)
    );
  } else {
    cb({ error: 'No Access Token Available' });
  }
}

module.exports = Webtask.fromExpress(app);
