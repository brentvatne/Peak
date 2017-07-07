import React from 'react';
import {
  Dimensions,
  Platform,
  Image,
  Text,
  StyleSheet,
  View,
} from 'react-native';
import { TabViewAnimated, TabBar, SceneMap } from 'react-native-tab-view';
import { Constants } from 'expo';
import Timeline from '../TimeLine/TimeLine';
import Stats from '../Stats/Stats';
import Touchable from 'react-native-platform-touchable';
import Ionicons from 'react-native-vector-icons/Ionicons';

export default class TweetsData extends React.Component {
  state = {
    index: 0,
    routes: [
      { key: '1', title: 'Highlights' },
      { key: '2', title: 'Timeline' },
    ],
  };

  _handleChangeTab = index => this.setState({ index });

  _renderHeader = props => {
    return (
      <TabBar
        {...props}
        style={[props.style, { backgroundColor: '#1da1f3' }]}
      />
    );
  };

  _renderScene = SceneMap({
    '1': Stats,
    '2': Timeline,
  });

  render() {
    return (
      <View style={{ flex: 1 }}>
        <View style={styles.userInfoHeader}>
          <View
            style={{
              position: 'absolute',
              top: Constants.stautsBarHeight,
              paddingTop: Platform.OS === 'android' ? 30 : 20,
              paddingLeft: 10,
              left: 0,
            }}>
            <Touchable
              hitSlop={{ top: 20, left: 20, right: 20, bottom: 20 }}
              onPress={this.props.onPressSignOut}
              background={Touchable.Ripple('#fff', true)}>
              <Ionicons
                name={'md-arrow-back'}
                style={{ color: '#fff' }}
                size={25}
              />
            </Touchable>
          </View>
          <Image source={{ uri: this.props.imageURL }} style={styles.avatar} />
          <Text style={styles.username}>
            {this.props.username}
          </Text>
        </View>
        <TabViewAnimated
          style={{ flex: 1 }}
          initialLayout={{
            width: Dimensions.get('window').width,
            height: Dimensions.get('window').height,
          }}
          navigationState={this.state}
          renderScene={this._renderScene}
          renderHeader={this._renderHeader}
          onRequestChangeTab={this._handleChangeTab}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  userInfoHeader: {
    height: Platform.OS === 'android' ? 75 : 60,
    backgroundColor: '#1da1f3',
    paddingTop:
      Platform.OS === 'android'
        ? Constants.statusBarHeight + 15
        : Constants.statusBarHeight,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatar: {
    width: 30,
    height: 30,
    borderRadius: 15,
  },
  username: {
    marginLeft: 5,
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
