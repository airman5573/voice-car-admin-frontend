import 'bootstrap/dist/css/bootstrap.min.css';
import React from 'react';
import { render } from 'react-dom';
import App from './App';
import { Provider } from 'react-redux';
import store from "./redux/index";


window.__group__ = ((window.location.href.trim().split("."))[0]).replace('http://', '');
if (__DEVELOPMENT__) {
  window.__group__ = 'a';
}

render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById('app')
);