import React from 'react';
import { withGoogleMap, GoogleMap, Marker } from 'react-google-maps';
import MarkerClusterer from 'react-google-maps/lib/addons/MarkerClusterer';

import withScriptjs from 'react-google-maps/lib/async/withScriptjs';
import { connect } from 'react-redux';
import MediaQuery from 'react-responsive';
import { Animate } from 'react-move';
import R from 'ramda';
import MapMarker from './MapMarker';
import {
  setActiveMarker,
  queryFirebaseMessages,
  queryFirebasePoints,
  queryFirebaseLikes,
  queryConfig,
  flipForm,
  setMyPos,
} from '../actions';
import SideCard from './SideCard';
import { CursorWindow } from './Acclaim';
import SupporterCounter from './SupporterCounter';
import 'whatwg-fetch';
import { typecastRoutes } from './GoogleMapUtil';
import Script from 'react-load-script';
import GoogleMapDirection from './GoogleMapDirection';

const mapStyles = require('./GoogleMapStyle.json');

const CDN = 'https://d1vfuujltsw10o.cloudfront.net';
const ICON_CDN = `${CDN}/icons`;

const asyncMapFragments = [1, 2].map(i => `geocodeSteps${i}`);
const asyncMapFragmentsUrls = asyncMapFragments.map(name => `${CDN}/map/${name}.js`);

const humanIcons = [1, 2, 3, 4, 5].map(
  idx => `${ICON_CDN}/Encouragement_Homme_DefiRespire${idx}.png`,
);
const getRandomIcon = () => humanIcons[Math.round(Math.random() * (humanIcons.length - 1))];

const styles = {
  card: {
    left: 20,
    top: 10,
    position: 'absolute',
  },
  cardMobile: {
    width: '100vw',
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
    position: 'absolute',
  },
  bottomCardMobile: {
    textAlign: 'center',
    backgroundColor: 'white',
    overflow: 'auto',
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
  lat: marker.coord ? marker.coord.latitude : 48.856614, // Paris
  lng: marker.coord ? marker.coord.longitude : 2.3522219,
});

let GoogleMapComp = ({
  markers,
  setActiveMarker,
  zoom,
  showForm,
  setMyPos,
  animationDuration,
  animationOff,
  onMapLoad,
  fragmentsMap,
  mobile,
  blackListedUsersId,
  challenges,
}) => {
  const iconSize = showForm ? 0 : mobile ? 31 : 70;
  const clusterStyles = [
    {
      textSize: 0.0001,
      url: `${ICON_CDN}/svg/cluster_1.svg`,
      zIndex: 0,
      height: iconSize,
      width: iconSize,
    },
    {
      // textColor: 'white',
      textSize: 0.0001,
      url: `${ICON_CDN}/svg/cluster_1.svg`,
      zIndex: 0,
      height: iconSize,
      width: iconSize,
    },
    {
      // textColor: 'white',
      textSize: 0.0001,
      url: `${ICON_CDN}/svg/cluster_1.svg`,
      zIndex: 0,
      height: iconSize,
      width: iconSize,
    },
  ];
  const markersRender = (
    <MarkerClusterer
      averageCenter
      // enableRetinaIcons
      gridSize={mobile ? 10 : 40}
      styles={clusterStyles}
      minimumClusterSize={mobile ? 100 : 100}
      // imageSizes={1}
      // imagePath={`${ICON_CDN}/cluster1.png`}
    >
      <Animate
        default={{ length: 0 }}
        data={{ length: markers.length }}
        duration={animationDuration}
        easing="easeCircleOut"
        // flexDuration
      >
        {data => (
          <div>
            {markers &&
              markers.map((marker, i) => {
                if (
                  i < data.length &&
                  !(blackListedUsersId.has(marker.userId) || blackListedUsersId.has(marker.id))
                ) {
                  return (
                    <MapMarker
                      hide={showForm}
                      animation={
                        i > markers.length - 10
                          ? window.google.maps.Animation.DROP
                          : i % 10 === 0 ? 4 : 0
                      }
                      key={marker.id}
                      {...marker}
                      iconUrl={marker.runIcon}
                      mobile={mobile}
                    />
                  );
                }
                return null;
              })}
          </div>
        )}
      </Animate>
    </MarkerClusterer>
  );
  return (
    <GoogleMap
      defaultZoom={zoom}
      defaultCenter={{ lat: 47.43, lng: 2.43 }}
      defaultOptions={{
        styles: mapStyles,
        disableDefaultUI: true,
        zoomControl: true,
        zoomControlOptions: {
          position: google.maps.ControlPosition.RIGHT_TOP,
        },
        minZoom: Math.min(3, zoom),
        scrollwheel: false,
        maxZoom: 13,
      }}
      onClick={() => setActiveMarker(null)}
      ref={onMapLoad}
    >
      {showForm && ( // Show draggable marker at center of france
        <Marker
          key="geoloc"
          position={{ lat: 47.2, lng: 3.03 }}
          draggable
          icon={{
            url: `${ICON_CDN}/Geolocalisation.png`,
            scaledSize: new window.google.maps.Size(70, 70),
          }}
          onDragEnd={e => setMyPos({ lat: e.latLng.lat(), lng: e.latLng.lng() })}
          onDrag={e => setMyPos({ lat: e.latLng.lat(), lng: e.latLng.lng() })}
        >
          <CursorWindow />
        </Marker>
      )}
      {markersRender}
      {challenges.map(({ latitude, longitude, ...challenge }, i) => (
        <MapMarker
          hide={showForm}
          animation={window.google.maps.Animation.DROP}
          key={`challenge.${i}`}
          id={`challenge.${i}`}
          type="challenge"
          iconUrl={`${ICON_CDN}/Geolocalisation.png`}
          mobile={mobile}
          position={{ lat: Number(latitude), lng: Number(longitude) }}
          bigger
          {...challenge}
          smaller={false}
        />
      ))}
    </GoogleMap>
  );
};

GoogleMapComp = connect(
  ({ animationDuration, showForm, config }) => ({
    showForm,
    animationDuration,
    blackListedUsersId: config.blackList,
    challenges: config.challenges || [],
  }),
  {
    setMyPos,
  },
)(GoogleMapComp);

GoogleMapComp = withScriptjs(withGoogleMap(GoogleMapComp));

const steps1 = [
  'Chemin du Pouverel, 83390 Cuers',
  'AVENUE ADJUDANT CHEF MARIE LOUIS BROQUIER, 83170 Brignoles',
  'Chemin de la Halte, 83910 Pourrières',
  '40 Allée des Dolia, 13100 Aix-en-Provence, France',
  '53 avenue des Frères Roqueplan, 13370 MALLEMORT',
  '1945 Place du Huit Mai 1945, 84510 Caumont-sur-Durance',
  'Rue Carnot, 30150 Roquemaure',
  '30200 Saint-Gervais', // "50 Avenue du Mont d'Arbois, 74170 Saint-Gervais-les-Bains",
  'Le Village, 07150 Bessas',
  'La combe, 07140 Saint-Pierre-Saint-Jean',
  'La chavade,07330 Astet',
  'Le Bourg, 43510 Le Bouchet-Saint-Nicolas, France',
  'Le Bourg, 43300 Siaugues-Sainte-Marie, France',
  'Rue Rabelais, 43100 Brioude, France',
  '4 Avenue Pierre et Marie Curie, 63500 Issoire, France',
  '3 Rue de la Ganne, 63170 Aubière, France',
  '57 bis, belle allée - 63460 COMBRONDE',
  'Route des bayons - 63700 ST ELOY LES MINES',
  'Montluçon - Place Jean Dormoy',
];

const steps2 = [
  'Montluçon - Place Jean Dormoy',
  '12 Place de la Mairie, 03360 Meaulne, France',
  'Place de la République,18200 Saint-Amand-Montrond',
  'Impasse Vincent Van Gogh, 18340 Plaimpied-Givaudins, France',
  'Place de la République,18200 Saint-Amand-Montrond',
  '1 Rue de la Croix de Mauconseil, 18700 Aubigny-sur-Nère, France',
  'Chemin de la Pillardière, 45600 Sully-sur-Loire, France',
  'Place Jules Ferry, 45270 Bellegarde, France',
  '2 Avenue du Maréchal Berthier, 45300 Pithiviers, France',
  'Place du Marché Franc, 91150 Étampes, France',
  'Rue du Pont aux Pins, 91310, France',
  'Champs de mars, 75007 Paris',
  'Rue Courtil Bajou, 95540 Méry-sur-Oise, France',
  '44 Rue Aristide Briand, 60110 Méru, France',
  '1 Rue Desgroux, 60000 Beauvais, France',
  '10 Place de la Censé, 60210 Grandvilliers, France',
  'Rue des Airettes, 80540 Molliens-Dreuil, France',
  '3 Avenue du Rivage, 80100 Abbeville, France',
  '1 Rue de la Mairie, 80120 Quend',
  "Parc d'Activité Opalopolis, Boulevard Edouard Lévêque, 62630 Étaples",
  "Parc naturel régional des Caps et Marais d'Opale, 11 Rue Jules Ferry, 62720 Rety",
  'Place du Soldat Inconnu, 62100 Calais, France',
];

class GoogleMapWrapper extends React.Component {
  state = {
    markers: [],
    animationOff: false,
    route: null,
  };

  flattenGeoUserMarkers = (props) => {
    const prevMarkers = this.state.markers;
    const markersFromProps = props.points;
    const markers = {};
    const allCoords = {};
    markersFromProps.forEach((marker) => {
      if (prevMarkers[marker.id]) {
        markers[marker.id] = prevMarkers[marker.id];
        const coord = getCoord(marker);
        const coordKey = `${coord.lat},${coord.lng}`;
        allCoords[coordKey] = true;
      } else {
        let coord = getCoord(marker);
        const coordKey = `${coord.lat},${coord.lng}`;

        if (allCoords[coordKey]) {
          // Generate a random coordinate around original position
          const angle = Math.random() * Math.PI * 2;
          coord = {
            lat: coord.lat + Math.cos(angle) * Math.random() / 10,
            lng: coord.lng + Math.sin(angle) * Math.random() / 6,
          };
        }
        allCoords[coordKey] = true;
        markers[marker.id] = {
          ...marker,
          runIcon: getRandomIcon(),
          position: { lat: coord.lat, lng: coord.lng },
        };
      }
    });
    return markers;
  };

  initFirebase() {
    const lastPointTs = this.props.lastPointTs;
    const lastMessageTs = this.props.lastMessageTs;
    // const maxKey = Math.max(0, ...points.map(o => o.createdAt));
    this.props.queryFirebasePoints(lastPointTs);
    this.props.queryFirebaseMessages(lastMessageTs);
    this.props.queryFirebaseLikes();
    this.props.queryConfig();
  }
  componentDidMount() {
    if (this.props.appStarted) {
      this.initFirebase();
    }
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

  transformRoute = (routeName) => {
    const globalRouteFromExtJs = window[routeName]; // Loaded from external js
    if (globalRouteFromExtJs && window.google && window.google.maps) {
      typecastRoutes(globalRouteFromExtJs.routes);
      this.setState({
        [routeName]: {
          routes: globalRouteFromExtJs.routes,
          request: {
            travelMode: window.google.maps.TravelMode.WALKING,
          },
        },
      });
      window[routeName] = null;
    }
  };
  onMapLoad = () => {
    this.transformRoute('geocodeSteps1');
    this.transformRoute('geocodeSteps2');

    // if (!this.state.route1 && !this.state.route2) {
    //   const loadForStep = (steps, stepName) => {
    //     const directionsService = new window.google.maps.DirectionsService();
    //     const origin = steps[0];
    //     const destination = steps[steps.length - 1];
    //     const waypoints = steps.slice(1, -1).map(step => ({
    //       location: step,
    //       stopover: false,
    //     }));
    //
    //     const request = {
    //       origin,
    //       destination,
    //       waypoints,
    //       optimizeWaypoints: false,
    //       provideRouteAlternatives: false,
    //       // language: 'fr',
    //       travelMode: window.google.maps.TravelMode.WALKING,
    //     };
    //     directionsService.route(request, (result, status) => {
    //       if (status === window.google.maps.DirectionsStatus.OK) {
    //         this.setState({ [stepName]: result });
    //       }
    //     });
    //   };
    //   loadForStep(steps1, 'route1');
    //   loadForStep(steps2, 'route2');
    // }
  };

  render() {
    const markers = R.sortBy(R.prop('ts'))(Object.values(this.state.markers));
    // const markers = R.sortBy(R.prop('lat'))(Object.values(this.state.markers));

    const responsiveRender = mobile => (
      <div style={{ minHeight: mobile ? 1500 : null }}>
        {asyncMapFragments.map((name, i) => (
          <Script
            url={asyncMapFragmentsUrls[i]}
            key={name}
            onError={console.log}
            onLoad={() => this.transformRoute(name)}
          />
        ))}
        <GoogleMapComp
          googleMapURL="https://maps.googleapis.com/maps/api/js?v=3.exp&libraries=geometry&key=AIzaSyDfyjrkHc0y1l4OzqfFV2noO2906f1RNuY"
          zoom={mobile ? 5 : 7}
          loadingElement={<div style={{ height: '100%' }} />}
          containerElement={
            <div
              style={{ ...styles.mapBox, height: mobile ? '700px' : '100vh', userSelect: 'none' }}
            />
          }
          mapElement={<div style={{ height: '100%' }} />}
          setActiveMarker={this.props.setActiveMarker}
          markers={markers}
          animationOff={this.state.animationOff}
          onMapLoad={this.onMapLoad}
          fragmentsMap={asyncMapFragments.map(name => this.state[name])}
          mobile={mobile}
        />
        <div style={mobile ? styles.bottomCardMobile : styles.bottomCard}>
          <SupporterCounter markersCount={markers.length} />
        </div>
        <div style={mobile ? styles.cardMobile : styles.card}>
          <SideCard mobile={mobile} markers={markers} />
        </div>
      </div>
    );

    return (
      <div style={{ position: 'relative' }}>
        <MediaQuery maxDeviceWidth={750}>
          {(matches) => {
            if (matches) {
              return responsiveRender(true);
            }
            return null;
          }}
        </MediaQuery>
        <MediaQuery minDeviceWidth={750}>
          {(matches) => {
            if (matches) {
              return responsiveRender(false);
            }
            return null;
          }}
        </MediaQuery>
      </div>
    );
  }
}

const connectedWrapper = connect(
  state => ({
    points: state.points,
    lastPointTs: state.lastPointTs,
    lastMessageTs: state.lastMessageTs,
    appStarted: state.started,
  }),
  {
    setActiveMarker,
    queryFirebasePoints,
    queryFirebaseMessages,
    queryFirebaseLikes,
    queryConfig,
    flipForm,
  },
)(GoogleMapWrapper);

export default connectedWrapper;
