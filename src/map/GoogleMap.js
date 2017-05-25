import React from 'react';
import { withGoogleMap, GoogleMap, Marker, InfoWindow } from 'react-google-maps';
import withScriptjs from 'react-google-maps/lib/async/withScriptjs';
import { connect } from 'react-redux';
import MediaQuery from 'react-responsive';
import { Animate } from 'react-move';
import R from 'ramda';
import MapMarker from './MapMarker';
import { setActiveMarker, queryFirebaseMessages, queryFirebasePoints, flipForm, setMyPos } from '../actions';
import SideCard from './SideCard';
import { CursorWindow } from './Acclaim';
const mapStyles = require('./GoogleMapStyle.json');

const CDN = 'https://d1vfuujltsw10o.cloudfront.net';
const ICON_CDN = `${CDN}/icons`;

const humanIcons = [1, 2, 3, 4, 5].map(idx => `${ICON_CDN}/Encouragement_Homme_DefiRespire${idx}.png`);
const getRandomIcon = () => humanIcons[Math.round(Math.random() * (humanIcons.length - 1))];

const styles = {
  card: {
    left: 20,
    top: 10,
  },
  bottomCard: {
    paddingTop: 30,
    textAlign: 'center',
    width: 350,
    left: 20,
    bottom: 20,
    backgroundColor: 'white',
    overflow: 'auto',
    padding: 20,
    boxShadow: '0 14px 28px rgba(0,0,0,0.25), 0 10px 10px rgba(0,0,0,0.22)',
    borderRadius: 2,
  },
  socialBox: {
    backgroundColor: 'white',
    overflow: 'auto',
    padding: 10,
    WebkitOverflowScrolling: 'touch',
    boxShadow: '0 14px 28px rgba(0,0,0,0.25), 0 10px 10px rgba(0,0,0,0.22)',
    borderRadius: 2,
  },
  mapBox: {
    width: '100%',
  },
};

const getCoord = marker => ({
  lat: marker.coord ? marker.coord.latitude : 48.856614,  // Paris
  lng: marker.coord ? marker.coord.longitude : 2.3522219,
});

let GoogleMapComp = ({ markers, setActiveMarker, zoom, showForm, setMyPos, animationDuration, animationOff }) => {
  const markersRender = (
    <Animate
      default={{ length: 0 }}
      data={{ length: markers.length }}
      duration={animationDuration}
      easing="easeCircleOut"
      // flexDuration
    >
      {data =>
        <div>
          {markers && markers
            .map((marker, i) => (i < data.length &&
              <MapMarker
                hide={showForm}
                animation={i > markers.length - 10 ? window.google.maps.Animation.DROP : (i % 10 === 0 ? 4 : 0)}
                key={marker.id} {...marker} iconUrl={marker.runIcon}
            ></MapMarker>))
          }
        </div>
      }
    </Animate>
  );


  return (
    <GoogleMap
      defaultZoom={zoom}
      defaultCenter={{ lat: 47.43, lng: 2.43 }}
      defaultOptions={{ styles: mapStyles, disableDefaultUI: true }}
      onClick={() => setActiveMarker(null)}
    >
      { showForm && // Show draggable marker at center of france
        <Marker
          key="geoloc"
          position={{ lat: 46.8, lng: 2.43 }}
          draggable
          icon={{
            url: `${ICON_CDN}/Geolocalisation.png`,
            scaledSize: new window.google.maps.Size(50, 50),
          }}
          onDragEnd={e => setMyPos({ lat: e.latLng.lat(), lng: e.latLng.lng() })}
          onDrag={e => setMyPos({ lat: e.latLng.lat(), lng: e.latLng.lng() })}
        >
          <CursorWindow />
        </Marker>
      }
      {markersRender}

    </GoogleMap>
  );
};

GoogleMapComp = connect(({ animationDuration, showForm }) => ({
  showForm,
  animationDuration,
}), {
  setMyPos,
})(GoogleMapComp);

GoogleMapComp = withScriptjs(
  withGoogleMap(GoogleMapComp),
);


class GoogleMapWrapper extends React.Component {
  state = {
    markers: [],
    animationOff: false,
  };

  flattenGeoUserMarkers = (props) => {
    const prevMarkers = this.state.markers;
    const markersFromProps = props.points;
    const markers = {};
    const allCoords = {};
    markersFromProps.forEach((marker) => {
      if (prevMarkers[marker.id]) {
        markers[marker.id] = prevMarkers[marker.id];
      } else {
        let coord = getCoord(marker);
        const coordKey = `${coord.lat},${coord.lng}`;

        if (allCoords[coordKey]) {
              // Generate a random coordinate around original position
          coord = {
            lat: coord.lat + Math.random() / 5 - 0.1,
            lng: coord.lng + Math.random() / 5 - 0.1,
          };
        }
        allCoords[coordKey] = true;
        markers[marker.id] = {
          ...marker,
          runIcon: getRandomIcon(),
          position: { lat: coord.lat, lng: coord.lng },
          lat: coord.lat,
        };
      }
    });
    return markers;
  }

  initFirebase() {
    const lastPointTs = this.props.lastPointTs;
    const lastMessageTs = this.props.lastMessageTs;
    // const maxKey = Math.max(0, ...points.map(o => o.createdAt));
    this.props.queryFirebasePoints(lastPointTs);
    this.props.queryFirebaseMessages(lastMessageTs);
  }
  componentDidMount() {
    if (this.props.appStarted) {
      this.initFirebase();
    }
    // setTimeout(() => this.setState({ animationOff: true }), 15000);
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.appStarted !== nextProps.appStarted && nextProps.appStarted) {
      this.initFirebase();
    }
    this.setState({ markers: this.flattenGeoUserMarkers(nextProps) });
  }

  componentWillMount() {
    this.setState({ markers: this.flattenGeoUserMarkers(this.props) });
  }

  render() {
    const markers = R.sortBy(R.prop('ts'))(Object.values(this.state.markers));

    const responsiveRender = mobile => (
      <div>
        <GoogleMapComp
          googleMapURL="https://maps.googleapis.com/maps/api/js?v=3.exp&key=AIzaSyDfyjrkHc0y1l4OzqfFV2noO2906f1RNuY"
          zoom={mobile ? 5 : 7}
          loadingElement={
            <div style={{ height: '100%' }} />
            }
          containerElement={<div style={{ ...styles.mapBox, height: '100vh' }} />}
          mapElement={<div style={{ height: '100%' }} />}
          setActiveMarker={this.props.setActiveMarker}
          markers={markers}
          animationOff={this.state.animationOff}
        />
        <div style={{ ...styles.card, position: mobile ? 'relative' : 'absolute', height: '90vh' }} >
          <SideCard mobile={mobile} markers={markers} />
        </div>
        <div style={{ ...styles.bottomCard, position: mobile ? 'relative' : 'absolute' }} >
          <p>Encouragez Brian et rejoignez les:</p>
          <Animate
            data={{ n: markers.length }}
            duration={this.props.animationDuration}
            easing="easeSinOut"
          >
            {data => (<div style={{ color: '#26B8D0', paddingTop: 5, fontSize: 35 }}>
              {Math.round(data.n).toLocaleString('fr', { maximumFractionDigits: 2 }) }
            </div>)}
          </Animate>
          <p style={{ textTransform: 'uppercase', paddingTop: 10, color: '#5F6061', fontSize: 20 }}>supporters</p>
        </div>
      </div>
    );

    return (
      <div>
        <MediaQuery query="(max-width: 800px)">
          {responsiveRender(true)}
        </MediaQuery>
        <MediaQuery query="(min-device-width: 800px)" values={{ deviceWidth: 1600 }}>
          {responsiveRender(false)}
        </MediaQuery>
      </div>


    );
  }
}

const connectedWrapper = connect(state => ({
  points: state.points,
  lastPointTs: state.lastPointTs,
  lastMessageTs: state.lastMessageTs,
  appStarted: state.started,
  animationDuration: state.animationDuration,
}), {
  setActiveMarker,
  queryFirebasePoints,
  queryFirebaseMessages,
  flipForm,
})(GoogleMapWrapper);

export default connectedWrapper;
