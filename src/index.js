import React from 'react';
import { createStore, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import { Provider } from 'react-redux';
import reducers from './store/reducers/index';
import App from './app';

const store = createStore(reducers, applyMiddleware(thunk));

const Beak = () =>
  <Provider store={store}>
    <App />
  </Provider>;

export default Beak;
