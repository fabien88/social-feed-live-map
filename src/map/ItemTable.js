import React from 'react';
import { connect } from 'react-redux';
import TweetEmbed from 'react-tweet-embed';
import { setOverMarker, setActiveMarker } from '../actions';

const MarkerContent = ({ id, type, ts, profile, userId, message }) => {
  if (type === 'twitter') {
    return (
      <div>
        <img src={profile} /> {id} {new Date(ts).toString()}        A tweeté :
        <TweetEmbed key={id} id={id} />
      </div>

    );
  }
  if (type === 'cheering') {
    return (
      <div>
        <img src={profile} /> {userId}        a lancé un encouragement :
        <div>
          {message}
        </div>
      </div>

    );
  }
};


class ItemTable extends React.Component {


  render() {
    let { marker, setOverMarker, markers } = this.props;
    if (markers) {
      // We fetch current selected marker
      if (!this.props.activeMarkerId) {
        return <div />;
      }
      this.props.markers.forEach((markerIt) => {
        if (markerIt.id === this.props.activeMarkerId) {
          marker = markerIt;
        }
      });
    }
    return (
      <div
        onMouseOver={() => setOverMarker(marker.id)}
        onMouseOut={() => setOverMarker(null)}
        ref={(c) => { this.obj = c; }}
      >
        <MarkerContent {...marker} />
      </div>
    );
  }
}

export default connect((state, props) => ({
  overed: state.overedMarkerId === props.marker.id,
  active: state.activeMarkerId === props.marker.id,
  activeMarkerId: props.markers ? state.activeMarkerId : null,
}), {
  setOverMarker,
  setActiveMarker,
})(ItemTable);
