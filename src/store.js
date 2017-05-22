/**
 * React Static Boilerplate
 * https://github.com/kriasoft/react-static-boilerplate
 *
 * Copyright © 2015-present Kriasoft, LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.txt file in the root directory of this source tree.
 */

import { applyMiddleware, createStore, compose } from 'redux';
import { autoRehydrate } from 'redux-persist';
import { createLogger } from 'redux-logger';
import firebase from 'firebase';
import uuid from 'uuid';
import R from 'ramda';
import configureReporting from './configureReporting';

// Centralized application state
// For more information visit http://redux.js.org/
const initialState = {
  started: false,
  viewer: null,
  points: [],
  overedMarkerId: null,
  activeMarkerId: null,
  lastPointTs: 0,
};

let firebaseDeps = null;

const createFirebaseDeps = () => {
  if (!firebaseDeps) {
    firebase.initializeApp({
      apiKey: 'AIzaSyCJVeWuKYQzSei-uklKmUfoQtkf8ye1_J0',
      authDomain: 'tweetmap-9c788.firebaseapp.com',
      databaseURL: 'https://tweetmap-9c788.firebaseio.com',
      storageBucket: 'tweetmap-9c788.appspot.com',
    });
    firebaseDeps = {
      firebase: firebase.database().ref(),
      firebaseAuth: firebase.auth,
      firebaseDatabase: firebase.database,
    };
  }
  return firebaseDeps;
};

const reportingMiddleware = configureReporting({
  appVersion: '1',
  sentryUrl: 'https://70fcdf895f854eff83961fcb8c6e9b2a@sentry.io/170256',
  unhandledRejection: fn => window.addEventListener('unhandledrejection', fn),
});


const configureDeps = () => ({
  ...createFirebaseDeps(),
  getUid: () => uuid.v4(),
  now: () => Date.now(),
});

const injectMiddleware = deps =>
  ({ dispatch, getState }: any) =>
    (next: any) =>
      (action: any) =>
        next(
          typeof action === 'function'
            ? action({ ...deps, dispatch, getState })
            : action,
        );

const enableLogger = process.env.NODE_ENV !== 'production';

const middleware = [
  injectMiddleware(configureDeps()),
  reportingMiddleware,
];

if (enableLogger) {
  const logger = createLogger({
    collapsed: true,
  });
  middleware.push(logger);
}

const store = createStore((state = initialState, action) => {
  // TODO: Add action handlers (aka "reducers")
  switch (action.type) {
    case 'APP_STARTED':
      return { ...state, started: true };

    case 'ON_POINTS_RECEIVED': {
      const { points } = action.payload;
      if (!points) {
        return { ...state };
      }
      let lastPointTs = state.lastPointTs;
      const newPoints = [];

      points.forEach((point) => {
        lastPointTs = Math.max(lastPointTs, point.ts);
        if (!R.find(R.propEq('id', point.id))(state.points)) {
          newPoints.push(point);
        } else {
          console.log('Duplicate found');
        }
      });

      return { ...state,
        lastPointTs,
        points: [...state.points, ...newPoints],
      };
    }
    case 'ON_SET_MARKER_OVER': {
      const { markerId } = action.payload;
      return { ...state, overedMarkerId: markerId };
    }
    case 'ON_SET_MARKER_ACTIVE': {
      const { markerId } = action.payload;
      return { ...state, activeMarkerId: markerId };
    }

    default:
      return state;
  }
},
initialState,
compose(
      applyMiddleware(...middleware),
      autoRehydrate(),
    ),
);

export default store;
