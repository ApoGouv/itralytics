/**
 * File    : index.js.js
 * Project : iTrAlytics
 */
import 'materialize-css/dist/css/materialize.min.css';
import 'font-awesome/css/font-awesome.min.css';
import './styles/app.css';
// import 'jquery/src/jquery';
// import 'materialize-css/dist/js/materialize.min.js';
import React from 'react';
import ReactDom from 'react-dom';
import { Provider } from 'react-redux';
import { createStore, applyMiddleware } from 'redux';
import reduxThunk from 'redux-thunk';

import App from './components/App';
import reducers from './reducers';
import $ from 'jquery';
window.jQuery = $;
require('materialize-css/dist/js/materialize.js');

// redux store - createStore( reducer, initial state, middleware )
const store = createStore(reducers, {}, applyMiddleware(reduxThunk));

ReactDom.render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.querySelector('#root')
);
