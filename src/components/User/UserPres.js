import React, { Component } from 'react';
import { Alert, View } from 'react-native';
import TweetsData from './TweetsData';
import Loader from '../Loaders/Loader';

class UserPresentation extends Component {
  render() {
    return (
      <View style={{ backgroundColor: '#FAFAFA', flex: 1 }}>
        {this.props.tweetsReady
          ? <TweetsData
              name={this.props.name}
              username={`@${this.props.user}`}
              imageURL={this.props.imageURL}
              onPressSignOut={this.showConfirmationMessage}
            />
          : <Loader
              color="#1da1f3"
              type="Pulse"
              loaderSize={300}
              backColor="#FAFAFA"
            />}
      </View>
    );
  }

  showConfirmationMessage = () => {
    Alert.alert(
      'Hey!',
      'Are you sure you want to log out?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'OK',
          onPress: () => {
            this.props.logOut();
          },
        },
      ],
      { cancelable: true }
    );
  };
  showSearch() {
    Alert.alert('Sorry!', 'Search not implemented yet', {
      cancelable: true,
    });
  }
}

export default UserPresentation;
