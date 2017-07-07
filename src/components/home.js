import React, { Component } from 'react';
import Loader from './Loaders/Loader';
import User from './User/User';
import { connect } from 'react-redux';
import { getfixedURL } from '../store/selectors/image';
import { fetchTweets } from '../store/actions/tweets';

class Home extends Component {
  componentDidMount() {
    this.props.fetchTweets();
  }

  render() {
    return this.props.imageURL === ''
      ? <Loader
          color="white"
          loaderSize={140}
          backColor="#2980c6"
          type="Bounce"
        />
      : <User />;
  }
}

const mapStateToProps = state => {
  return {
    imageURL: getfixedURL(state.user.imageURL),
    userID: state.user.userID,
  };
};

const mapDispatchToProps = dispatch => ({
  fetchTweets: tweets => {
    dispatch(fetchTweets());
  },
});

Home = connect(mapStateToProps, mapDispatchToProps)(Home);
export default Home;
