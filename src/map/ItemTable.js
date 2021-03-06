import React from 'react';
import { connect } from 'react-redux';
import TweetEmbed from 'react-tweet-embed';
import nl2br from 'react-nl2br';
import FacebookProvider, { EmbeddedPost, Parser } from 'react-facebook';
import { Animate } from 'react-move';
const HotKey = require('react-shortcut');

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
  loader: {
    position: 'absolute',
    top: 0,
    marginLeft: -10,
    marginTop: '50%',
    display: 'flex',
    justifyContent: 'center',
    width: '100%',
  },
};

const Loader = () => (
  <Animate default={{ size: 60 }} data={{ size: 0 }} duration={500} easing="easeElasticIn">
    {data => (
      <div style={styles.loader}>
        {data.size > 1 ? (
          <img
            alt="loader"
            src="https://d1vfuujltsw10o.cloudfront.net/icons/loader.svg"
            width={data.size}
          />
        ) : null}
      </div>
    )}
  </Animate>
);

class MarkerContent extends React.Component {
  state = {};

  onKeysDetails = () => {
    this.setState({ showDetails: !this.state.showDetails });
  };

  render() {
    const {
      id,
      type,
      ts,
      profile,
      userId,
      message,
      name,
      postUrl,
      userName,
      ...props
    } = this.props;
    let content = null;
    if (type === 'step') {
      const { step, city, place, address, date } = props;
      content = (
        <div style={{ ...styles.markerInfo }}>
          <div style={{ fontWeight: 700 }}>
            {new Date(date).toLocaleDateString()} {step}
          </div>
          <div>{city} , arrivée vers 14h-15h</div>
          <div>
            {place}            - {address}
          </div>
        </div>
      );
    }
    if (type === 'challenge') {
      const { description, link } = props;
      content = (
        <div style={{ ...styles.markerInfo }}>
          <div style={{ fontWeight: 700, paddingBottom: 10 }}>{name}</div>
          <div style={{ paddingBottom: 10 }}>{description}</div>
          <div style={{ paddingBottom: 10 }}>
            <a href={link}>{link}</a>
          </div>
        </div>
      );
    }

    if (type === 'tweet' || type === 'retweet') {
      content = (
        <div style={{ ...styles.markerInfo, minHeight: 400 }}>
          <Loader />
          <img src={profile} style={styles.profile} />
          {` a ${type === 'retweet' ? 're' : ''}tweeté :`}
          <TweetEmbed key={id} id={id} options={{ lang: 'fr' }} />
        </div>
      );
    }
    if (type === 'fb') {
      content = (
        <div style={{ ...styles.markerInfo, minHeight: 400 }}>
          <Loader />
          <FacebookProvider appId="296344554144830" language="fr_FR">
            <EmbeddedPost href={postUrl} width={300} />
          </FacebookProvider>

          <FacebookProvider appId="296344554144830" language="fr_FR">
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
      content = (
        <div>
          <div style={{ paddingRight: 50, paddingTop: 10, paddingLeft: 5 }}>{nl2br(message)}</div>
          <div style={{ paddingTop: 10, textAlign: 'right' }}>{name}</div>
        </div>
      );
    }
    return (
      <div style={{ userSelect: 'text' }}>
        <HotKey keys={['shift', 'd']} simultaneous onKeysCoincide={this.onKeysDetails} />
        {this.state.showDetails && (userId || id)}
        {content}
      </div>
    );
  }
}

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
        ref={(c) => {
          this.obj = c;
        }}
      >
        <MarkerContent {...marker} />
      </div>
    );
  }
}
export { MarkerContent };
export default connect(
  (state, props) => ({
    overed: state.overedMarkerId === props.marker.id,
    active: state.activeMarkerId === props.marker.id,
    activeMarkerId: props.markers ? state.activeMarkerId : null,
  }),
  {
    setOverMarker,
    setActiveMarker,
  },
)(ItemTable);
