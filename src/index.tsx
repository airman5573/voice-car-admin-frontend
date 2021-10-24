import 'bootstrap/dist/css/bootstrap.min.css';
import React from 'react';
import { render } from 'react-dom';
import App from './App';
import { Provider } from 'react-redux';
import store from "./redux/index";

render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById('app')
);