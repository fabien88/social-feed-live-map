import React from 'react';
import { connect } from 'react-redux';
import TweetEmbed from 'react-tweet-embed';
import nl2br from 'react-nl2br';
import FacebookProvider, { EmbeddedPost, Parser } from 'react-facebook';

import { setOverMarker, setActiveMarker } from '../actions';

const styles = {
  profile: {
    borderRadius: 5,
    marginRight: 10,
  },
  markerInfo: {
    fontSize: 16,
    width: 300,
    paddingLeft: 10,
    paddingTop: 10,
  },
};


const MarkerContent = ({ id, type, ts, profile, userId, message, name, postUrl, userName, ...props }) => {
  if (type === 'step') {
    const { step, city, place, address, date } = props;
    return (
      <div style={{ ...styles.markerInfo }}>
        <div style={{ fontWeight: 700 }}>
          {new Date(date).toLocaleDateString()}
        </div>
        <div>
          {step}          : {city}
        </div>
        <div>
          {place}          - {address}
        </div>
      </div>
    );
  }
  if (type === 'tweet' || type === 'retweet') {
    return (
      <div style={{ ...styles.markerInfo, minHeight: 400 }}>
        <img src={profile} style={styles.profile} />{` a ${type === 'retweet' ? 're' : ''}tweeté :`}
        <TweetEmbed key={id} id={id} options={{ lang: 'fr' }} />
      </div>

    );
  }
  if (type === 'fb') {
    return (
      <div style={{ ...styles.markerInfo, minHeight: 400 }}>
        {/* <div style={{ paddingBottom: 10 }}>
          {userName.split(' ').slice(0, 1).join(' ')}          a commenté sur Facebook   : {message}
        </div> */}
        <FacebookProvider appId="296344554144830" language="fr_FR">
          <EmbeddedPost href={postUrl} width={300} />
        </FacebookProvider>

        <FacebookProvider appId="296344554144830" language="fr_FR" >
          <Parser>
            <div
              className="fb-comment-embed"
              data-href={`${postUrl}/?comment_id=${id}`}
              data-width={300}
            />
          </Parser>
        </FacebookProvider>

      </div>
    );
  }
  if (type === 'message') {
    return (
      <div>

        <div style={{ paddingRight: 50, paddingTop: 10, paddingLeft: 5 }}>
          {nl2br(message)}
        </div>
        <div style={{ paddingTop: 10, textAlign: 'right' }}>
          {name}
        </div>
      </div>
    );
  }
  return null;
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
export { MarkerContent };
export default connect((state, props) => ({
  overed: state.overedMarkerId === props.marker.id,
  active: state.activeMarkerId === props.marker.id,
  activeMarkerId: props.markers ? state.activeMarkerId : null,
}), {
  setOverMarker,
  setActiveMarker,
})(ItemTable);
