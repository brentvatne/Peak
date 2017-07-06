import * as actionTypes from './actionTypes';
import { AsyncStorage, Linking } from 'react-native';
import { Constants, WebBrowser } from 'expo';
import jwtDecoder from 'jwt-decode';

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
    // const encodedToken = responseObj.id_token;
    // const decodedToken = jwtDecoder(encodedToken);

    console.log({ responseObj });
    console.log({ decodedToken });

    let profile = await _fetchProfileAsync(accessToken);
    let session = { accessToken, idToken, ...profile };
    // console.log(session);
    // console.log(setUser(session));
    // dispatch(setUser(session));
    // AsyncStorage.setItem('session', JSON.stringify(session));
  } catch (e) {
    console.log({ e });
    dispatch(errorLoadingUser());
  }
}

let _signInCallback;

export const signIn = () => {
  return async function(dispatch) {
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
  };
};
export const setUser = session => ({
  type: actionTypes.SET_USER,
  accessToken: session.accessToken,
  idToken: session.idToken,
  userName: session.screen_name,
  userID: session.identities[0].user_id,
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
    // FabricTwitterKit.logOut(); //Doesnt work. Issue: https://github.com/tkporter/react-native-fabric-twitterkit/issues/33
    AsyncStorage.removeItem('session');
    dispatch(logOutAction());
  };
};

export const fetchProfile = () => {
  return function(dispatch) {
    // FabricTwitterKit.fetchProfile((error, profile) => {
    //   if (profile !== undefined) {
    //     dispatch(setProfile(profile));
    //   }
    // });
  };
};

export const setProfile = profile => ({
  type: actionTypes.SET_PROFILE,
  name: profile.name,
  imageURL: profile.profile_image_url_https,
});

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
