import React from 'react';
import { Marker, InfoWindow } from 'react-google-maps';
import { connect } from 'react-redux';
import { Animate } from 'react-move';
import { setOverMarker, setActiveMarker } from '../actions';
import { MarkerContent } from './ItemTable';
const easingFunc = (t, s = 5) => --t * t * ((s + 1) * t + s) + 1;


class MapMarker extends React.Component {

  render() {
    const { position, id, iconUrl, active, overed, ts, animation, hide } = this.props;
    return (
      <Animate
        data={{ scale: hide ? 0 : (overed || active ? 70 : 50) }}
        duration={200}
        ignore={hide ? ['scale'] : []}
        easing={easingFunc}
      >
        {data => (
          <Marker
            position={position}
            key={id}
            defaultAnimation={animation}
            // optimized
            icon={{
              scaledSize: new window.google.maps.Size(data.scale, data.scale),
              url: iconUrl,
            }}
            zIndex={overed ? 9999999999 : Math.round(ts / 1000)}
            onClick={() => this.props.setActiveMarker(id)}
            onMouseOver={() => this.props.setOverMarker(id)}
            onMouseOut={() => this.props.setOverMarker(null)}
          >
            { !hide && active ?
              <InfoWindow
                position={position}
                onCloseClick={() => this.props.setActiveMarker(null)}
              >
                <MarkerContent {...this.props} />
              </InfoWindow>
                : null
              }
          </Marker>

        )}
      </Animate>

    );
  }
}

export default connect((state, props) => ({
  overed: state.overedMarkerId === props.id,
  active: state.activeMarkerId === props.id || state.newMarkerId === props.id,
}), {
  setOverMarker,
  setActiveMarker,
})(MapMarker);
