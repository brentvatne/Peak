import * as actionTypes from './actionTypes';
import { AsyncStorage, Linking } from 'react-native';
import { Constants, WebBrowser } from 'expo';

const redirectUri = `${Constants.linkingUri}/redirect`;
const auth0ClientId = 'uvXXr01WqefMfY7twAkKBPy3OXat4Ntx';
const auth0Domain = 'https://brentvatne.auth0.com';

async function _fetchProfileAsync(accessToken) {
  let response = await fetch(`${auth0Domain}/userinfo`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  let result = await response.json();
  return result;
}

async function _handleAuth0RedirectAsync(event, dispatch) {
  if (!event.url.includes('+/redirect')) {
    return;
  }

  try {
    await WebBrowser.dismissBrowser();

    const [, queryString] = event.url.split('#');
    const responseObj = queryString.split('&').reduce((map, pair) => {
      const [key, value] = pair.split('=');
      map[key] = value;
      return map;
    }, {});

    const accessToken = responseObj.access_token;
    const idToken = responseObj.id_token;

    let profile = await _fetchProfileAsync(accessToken);
    let session = { accessToken, idToken, ...profile };
    dispatch(setUser(session));
    AsyncStorage.setItem('session', JSON.stringify(session));
  } catch (e) {
    console.log({ e });
    dispatch(errorLoadingUser());
  }
}

let _signInCallback;

export const signIn = () => {
  return function(dispatch) {
    (async () => {
      _signInCallback = event => {
        _handleAuth0RedirectAsync(event, dispatch);
      };

      Linking.addEventListener('url', _signInCallback);

      const redirectionURL =
        `${auth0Domain}/authorize` +
        _toQueryString({
          client_id: auth0ClientId,
          response_type: 'token',
          scope: 'openid name',
          redirect_uri: redirectUri,
          connection: 'twitter',
          state: redirectUri,
        });

      await WebBrowser.openBrowserAsync(redirectionURL);
      Linking.removeEventListener('url', _signInCallback);
    })();
  };
};
export const setUser = session => ({
  type: actionTypes.SET_USER,
  accessToken: session.accessToken,
  idToken: session.idToken,
  userName: session.screen_name,
  userID: session.identities[0].user_id,
  imageURL: session.picture,
  name: session.name,
  authorized: true,
  error: false,
});

export const loadUser = () => {
  return function(dispatch) {
    AsyncStorage.getItem('session').then(session => {
      if (session) {
        dispatch(setUser(JSON.parse(session)));
      }
    });
    dispatch(initCompleted());
  };
};

export const logOut = () => {
  return function(dispatch, getState) {
    AsyncStorage.removeItem('session');
    dispatch(logOutAction());
  };
};

export const logOutAction = () => ({
  type: actionTypes.LOG_OUT,
});

export const errorLoadingUser = () => ({
  type: actionTypes.ERROR_USER_LOGIN,
  error: true,
});

export const initCompleted = () => ({
  type: actionTypes.INIT_COMPLETED,
  init: true,
});

function _toQueryString(params) {
  return (
    '?' +
    Object.entries(params)
      .map(
        ([key, value]) =>
          `${encodeURIComponent(key)}=${encodeURIComponent(value)}`
      )
      .join('&')
  );
}
