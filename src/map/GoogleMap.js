import React from 'react';
import { withGoogleMap, GoogleMap } from 'react-google-maps';
import MapMarker from './MapMarker';
import withScriptjs from 'react-google-maps/lib/async/withScriptjs';
import { connect } from 'react-redux';
import { setActiveMarker, queryFirebase } from '../actions';
import ItemTable from './ItemTable';
import FaSpinner from 'react-icons/lib/fa/spinner';
import ScrollableTable from './ScrollableTable';
import MediaQuery from 'react-responsive';
import { Animate } from 'react-move';
import R from 'ramda';
import Paper from 'material-ui/Paper';

const mapStyles = require('./GoogleMapStyle.json');

const styles = {
  card: {
    right: 10,
    top: 10,
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
  spinner: {
    display: 'block',
    width: '80px',
    height: '80px',
    margin: '150px auto',
    animation: 'fa-spin 2s infinite linear',
  },
};

const getCoord = marker => ({
  lat: marker.coord ? marker.coord.latitude : 48.856614,  // Paris
  lng: marker.coord ? marker.coord.longitude : 2.3522219,
});

let GoogleMapComp = ({ markers, setActiveMarker, zoom }) => (
  <Animate
    default={{ length: 0 }}
    data={{ length: markers.length }}
    duration={5000}
    easing="easeCubicInOut"
  >
    {data => (
      <GoogleMap
        defaultZoom={zoom}
        defaultCenter={{ lat: 47.0765491, lng: 1.3991939 }}
        defaultOptions={{ styles: mapStyles, disableDefaultUI: true }}
        onClick={() => setActiveMarker(null)}
      >

        {markers && markers.slice(0, data.length).map(marker => (
          <MapMarker
            key={marker.id}
            {...marker}
            iconUrl={marker.profile}
          />
          ))}
      </GoogleMap>
      )}
  </Animate>
);

GoogleMapComp = withScriptjs(
  withGoogleMap(GoogleMapComp),
);

class GoogleMapWrapper extends React.Component {
  state = {
    cheers: [
        // {
        //   type: 'cheering',
        //   id: Date.now(),
        //   profile: 'https://pbs.twimg.com/profile_images/640082816924057600/rq08l0ld_normal.png',
        //   userId: 'fabien',
        //   ts: Date.now(),
        //   message: 'Allez Brian !',
        // },
    ],
    markers: [],
  };

  flattenGeoUserMarkers = (props) => {
    const { geoUserToMarkers, geoUserToPosition } = this.getGeoUserMarkers(props);
    const markers = [];
    Object.keys(geoUserToMarkers).forEach((geoUserKey) => {
      const userMarkers = geoUserToMarkers[geoUserKey];
      const userPosition = geoUserToPosition[geoUserKey];
      userMarkers.forEach((marker, i) => {
        markers.push(
          {
            ...marker,
            position: { lat: userPosition.lat, lng: userPosition.lng + 0.001 * (userMarkers.length - i - 1) },
          },
        );
      });
    });
    return R.sortBy(R.prop('ts'))(markers);
  }

  getGeoUserMarkers(props) {
    const markers = R.sortBy(R.prop('ts'))(R.concat(this.state.cheers, props.points || []));
    if (!markers) {
      return { geoUserToMarkers: {}, geoUserToPosition: {}, length: 0 };
    }
    const geoUserToMarkers = { };
    const geoUserToPosition = {};
    const allCoords = {};
    markers.forEach((marker) => {
      let coord = getCoord(marker);
      const coordKey = `${coord.lat},${coord.lng}`;
      const geoUserKey = `${coordKey},${marker.userId}`;
      if (geoUserToMarkers[geoUserKey]) {
        geoUserToMarkers[geoUserKey] = [...geoUserToMarkers[geoUserKey], marker];
      } else {
        geoUserToMarkers[geoUserKey] = [marker];

          // Compute coords
        if (allCoords[coordKey]) {
            // Generate a random coordinate around original position
          coord = {
            lat: coord.lat + Math.random() / 10 - 0.05,
            lng: coord.lng + Math.random() / 10 - 0.05,
          };
        }
        allCoords[coordKey] = true;
        geoUserToPosition[geoUserKey] = coord;
      }
    });
    return {
      geoUserToMarkers,
      geoUserToPosition,
      length: markers.length,
    };
  }

  componentDidMount() {
    if (this.props.appStarted) {
      const lastPointTs = this.props.lastPointTs;
      // const maxKey = Math.max(0, ...points.map(o => o.ts));
      this.props.queryFirebase(lastPointTs + 1);
    }
    setTimeout(this.setState({ browser: true }), 0);
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.appStarted !== nextProps.appStarted && nextProps.appStarted) {
      const lastPointTs = this.props.lastPointTs;
      this.props.queryFirebase(lastPointTs + 1);
    }
    this.setState({ markers: this.flattenGeoUserMarkers(nextProps) });
  }

  componentWillMount() {
    this.setState({ markers: this.flattenGeoUserMarkers(this.props) });
  }

  render() {
    const markers = this.state.markers;
    if (!this.state.browser) {
      return null;
    }
    const FlipCard = require('react-flipcard');
    const responsiveRender = mobile => (
      <div>
        <GoogleMapComp
          googleMapURL="https://maps.googleapis.com/maps/api/js?v=3.exp&key=AIzaSyDfyjrkHc0y1l4OzqfFV2noO2906f1RNuY"
          zoom={mobile ? 5 : 7}
          loadingElement={
            <div style={{ height: '100%' }}>
              <FaSpinner
                style={styles.spinner}
              />
            </div>
            }
          containerElement={<div style={{ ...styles.mapBox, height: '100vh' }} />}
          mapElement={<div style={{ height: '100%' }} />}
          setActiveMarker={this.props.setActiveMarker}
          markers={markers}
        />
        <div style={{ ...styles.card, position: mobile ? 'relative' : 'absolute', width: mobile ? '100%' : 450, height: '90vh' }}>
          <FlipCard
            disabled
            flipped={this.state.isFlipped}
          >
            <div style={{ ...styles.socialBox, width: mobile ? '100%' : 450, height: '90vh' }} >
              <ScrollableTable markers={markers.slice().reverse()} width={mobile ? '100vw' : 420} onFlip={() => this.setState({ isFlipped: true })} />
            </div>
            <div style={{ ...styles.socialBox, width: mobile ? '100vw' : 450, height: '90vh' }} >
              <div>Back</div>
              <button type="button" ref="backButton" onClick={() => this.setState({ isFlipped: false })}>Show front</button>
            </div>
          </FlipCard>
        </div>
        {/* <div
  onClick={() => this.setState({ cheers: [...this.state.cheers, {
            type: 'cheering',
            id: Date.now(),
            profile: 'https://pbs.twimg.com/profile_images/640082816924057600/rq08l0ld_normal.png',
            userId: 'fabien',
            ts: Date.now(),
            message: `${Date.now()}Allez Brian !`,
          }] })}>Add</div> */}
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

const connectedWrapper = connect((state: State) => ({
  points: state.points,
  lastPointTs: state.lastPointTs,
  appStarted: state.started,
}), {
  setActiveMarker,
  queryFirebase,
})(GoogleMapWrapper);

export default connectedWrapper;
