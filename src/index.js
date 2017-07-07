import React from 'react';
import { createStore, applyMiddleware } from 'redux';
import { StatusBar, View } from 'react-native';
import thunk from 'redux-thunk';
import { Provider } from 'react-redux';
import reducers from './store/reducers/index';
import App from './app';

const store = createStore(reducers, applyMiddleware(thunk));

const Beak = () =>
  <Provider store={store}>
    <View style={{ flex: 1 }}>
      <App />
      <StatusBar barStyle="light-content" backgroundColor="#1da1f3" />
    </View>
  </Provider>;

export default Beak;
