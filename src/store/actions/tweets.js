import * as actionTypes from './actionTypes';

const TIMELINE_ENDPOINT =
  'https://wt-579a528974090c0172cf8cecab01ea26-0.run.webtask.io/webtask/timeline';

export const fetchTweets = () => {
  return function(dispatch, getState) {
    (async () => {
      try {
        let idToken = getState().user.idToken;
        let response = await fetch(TIMELINE_ENDPOINT, {
          headers: {
            Authorization: `Bearer ${idToken}`,
          },
        });

        let data = await response.json();
        dispatch(setTweets(data));
      } catch (e) {
        alert('Unable to fetch tweets :(');
        console.log({ e });
      }
    })();
  };
};

export const setTweets = tweets => ({
  type: actionTypes.SET_TWEETS,
  tweets: tweets,
});
