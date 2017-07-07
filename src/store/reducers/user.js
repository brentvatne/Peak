import * as actionTypes from '../actions/actionTypes';

var initialState = {
  init: false,
  authorized: false,
  userName: '',
  name: '',
  userID: '',
  error: false,
  tweets: [],
  imageURL: null,
  idToken: '',
  accessToken: '',
};

const user = (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.INIT_COMPLETED:
      return {
        ...state,
        init: true,
      };
    case actionTypes.ERROR_USER_LOGIN:
      return {
        ...state,
        error: true,
      };
    case actionTypes.SET_USER:
      console.log(action);
      return {
        ...state,
        userName: action.userName,
        userID: action.userID,
        authorized: true,
        authToken: action.authToken,
        authTokenSecret: action.authTokenSecret,
        error: false,
        idToken: action.idToken,
        accessToken: action.accessToken,
        imageURL: action.imageURL,
        name: action.name,
      };
    case actionTypes.LOG_OUT:
      return {
        ...initialState,
        init: true,
      };
    default:
      return state;
  }
};
export default user;
