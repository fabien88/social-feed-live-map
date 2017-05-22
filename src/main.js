/**
 * React Static Boilerplate
 * https://github.com/kriasoft/react-static-boilerplate
 *
 * Copyright © 2015-present Kriasoft, LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.txt file in the root directory of this source tree.
 */

import 'babel-polyfill';
import 'whatwg-fetch';

import React from 'react';
import ReactDOM from 'react-dom';
import FastClick from 'fastclick';
import { Provider } from 'react-redux';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import { cyanA200, cyanA400, cyanA700 } from 'material-ui/styles/colors';
import injectTapEventPlugin from 'react-tap-event-plugin';
import { persistStore } from 'redux-persist';
import localforage from 'localforage';
import configureStorage from './storage';

import store from './store';
import router from './router';
import history from './history';

let routes = require('./routes.json').default; // Loaded with utils/routes-loader.js

const muiTheme = getMuiTheme({
  palette: {
    // primary1Color: cyanA400,
    // primary2Color: cyanA700,
    // primary3Color: cyanA700,
  },
}, {
  avatar: {
    borderColor: null,
  },
});

injectTapEventPlugin();
const container = document.getElementById('container');

const onRehydrate = () => {
    // Don't import appStarted action creator since it would break hot reload.
  store.dispatch(({ type: 'APP_STARTED' }));
};

const afterInitialRender = () => {
  persistStore(
      store,
    {
      ...configureStorage('tweet-map'),
      storage: localforage,
    },
      onRehydrate,
    );
};

function renderComponent(component) {
  const wrappedComp = (
    <MuiThemeProvider muiTheme={muiTheme}>
      {component}
    </MuiThemeProvider>
  );

  ReactDOM.render(<Provider store={store}>{wrappedComp}</Provider>, container, afterInitialRender);
}

// Find and render a web page matching the current URL path,
// if such page is not found then render an error page (see routes.json, core/router.js)
function render(location) {
  router.resolve(routes, location)
    .then(renderComponent)
    .catch(error => router.resolve(routes, { ...location, error }).then(renderComponent));
}

// Handle client-side navigation by using HTML5 History API
// For more information visit https://github.com/ReactJSTraining/history/tree/master/docs#readme
// history.listen(render);
// console.log(history.location);
// render(history.location);
render({ pathname: '/' });

// Eliminates the 300ms delay between a physical tap
// and the firing of a click event on mobile browsers
// https://github.com/ftlabs/fastclick
FastClick.attach(document.body);

// Enable Hot Module Replacement (HMR)
if (module.hot) {
  module.hot.accept('./routes.json', () => {
    routes = require('./routes.json').default; // eslint-disable-line global-require
    render(history.location);
  });
}
