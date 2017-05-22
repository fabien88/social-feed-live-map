// @flow
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/bufferTime';
import 'rxjs/add/observable/fromEvent';

export const onPointsReceived = (snaps) => {
  const points = snaps;
  return {
    type: 'ON_POINTS_RECEIVED',
    payload: { points },
  };
};

export const setOverMarker = markerId => ({
  type: 'ON_SET_MARKER_OVER',
  payload: { markerId },
});

export const setActiveMarker = markerId => ({
  type: 'ON_SET_MARKER_ACTIVE',
  payload: { markerId },
});


export const queryFirebase = lastPointTs => ({ firebase, getState, dispatch }) => {
  const ref = firebase
        .child('tags/defidemalade/points')
        .orderByChild('ts')
        .startAt(lastPointTs + 1)
        .limitToLast(1000);
  const childsAdded = Observable.fromEvent(ref, 'child_added');
  const buffered = childsAdded.bufferTime(500);
  buffered.subscribe((vals) => {
    if (vals.length === 0) {
      return;
    }
    dispatch(onPointsReceived(vals.map(snap => snap.val())));
  });

  return {
    type: 'ON_LAST_POINTS_WATCH',
    payload: { lastPointTs },
  };
};
