import * as actionTypes from '../actions/actionTypes';
import * as grader from '../../utils/grader';

const gradeTweets = tweets => {
  return tweets.map(tweet => gradeTweet(tweet.text));
};
const gradeTweet = text => {
  return grader.grade(text);
};

const tweets = (state = [], action) => {
  let nextState = state;
  switch (action.type) {
    case actionTypes.SET_TWEETS:
      nextState = {
        ...state,
        tweets: action.tweets,
        grades: gradeTweets(action.tweets),
        tweetsReady: true,
      };

  }

  return nextState;
};
export default tweets;
