import React from 'react';
import { Marker } from 'react-google-maps';
import { connect } from 'react-redux';
import { Animate } from 'react-move';
import { setOverMarker, setActiveMarker } from '../actions';

const easingFunc = (t, s = 5) => --t * t * ((s + 1) * t + s) + 1;


class MapMarker extends React.Component {

  // toggleInfoWindow = (marker) => {
  //   const { activeMarker } = this.state;
  //   if (!marker || activeMarker && marker.key === activeMarker.key) {
  //     this.setState({ activeMarker: null });
  //     return;
  //   }
  //   this.setState({ activeMarker: marker });
  // }


  render() {
    const { position, id, iconUrl, overed, ts } = this.props;
    return (
      <Animate
        data={{ scale: overed ? 70 : 50 }}
        duration={200}
        easing={easingFunc}
      >
        {data => (
          <Marker
            position={position}
            key={id}
            defaultAnimation={4}
            optimized
            icon={{
              scaledSize: new window.google.maps.Size(data.scale, data.scale),
              url: iconUrl,
            }}
            zIndex={overed ? 9999999999 : Math.round(ts / 1000)}
            onClick={() => this.props.setActiveMarker(id)}
            onMouseOver={() => this.props.setOverMarker(id)}
            onMouseOut={() => this.props.setOverMarker(null)}
          >
            {/* {active ?
                <InfoWindow
                  position={position}
                  onCloseclick={() => this.props.setActiveMarker(null)}
                  >
                  <MarkerContent type={type} id={id} />
                </InfoWindow>
                : null
              } */}
          </Marker>

        )}
      </Animate>

    );
  }
}

export default connect((state, props) => ({
  overed: state.overedMarkerId === props.id,
  active: state.activeMarkerId === props.id,
}), {
  setOverMarker,
  setActiveMarker,
})(MapMarker);
