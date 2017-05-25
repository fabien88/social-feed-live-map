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
export const onMessagesReceived = (snaps) => {
  const messages = snaps;
  return {
    type: 'ON_MESSAGES_RECEIVED',
    payload: { messages },
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

export const flipForm = () => ({
  type: 'ON_FLIP_FORM',
  payload: { },
});

export const onShowThankYou = () => ({
  type: 'ON_SHOW_THANK_YOU',
  payload: { },
});
export const onHideThankYou = () => ({
  type: 'ON_HIDE_THANK_YOU',
  payload: { },
});

export const setMyPos = ({ lat, lng }) => ({
  type: 'ON_MY_POS_UPDATE',
  payload: { lat, lng },
});

export const queryFirebasePoints = lastPointTs => ({ firebase, dispatch }) => {
  const ref = firebase
        .child('tags/defidemalade/points')
        .orderByChild('createdAt')
        .startAt(lastPointTs + 1)
        .limitToLast(10000);
  Observable.fromEvent(ref, 'child_added').bufferTime(500).subscribe((vals) => {
    if (vals.length === 0) {
      return;
    }
    dispatch(onPointsReceived(vals.map(snap => snap.val())));
  });

  Observable.fromEvent(ref, 'child_changed').bufferTime(500).subscribe((vals) => {
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


export const queryFirebaseMessages = lastMessageTs => ({ firebase, dispatch }) => {
  const ref = firebase
        .child('tags/defidemalade/messages')
        .orderByChild('createdAt')
        .startAt(lastMessageTs + 1)
        .limitToLast(1000);
  const childsAdded = Observable.fromEvent(ref, 'child_added');
  const buffered = childsAdded.bufferTime(500);
  buffered.subscribe((vals) => {
    if (vals.length === 0) {
      return;
    }
    dispatch(onMessagesReceived(vals.map(snap => snap.val())));
  });

  return {
    type: 'ON_LAST_MESSAGE_WATCH',
    payload: { lastMessageTs },
  };
};
