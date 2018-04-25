import React from 'react';
import { Marker, InfoWindow } from 'react-google-maps';
import { connect } from 'react-redux';
import { Animate } from 'react-move';
import { setOverMarker, setActiveMarker } from '../actions';
import { MarkerContent } from './ItemTable';
const easingFunc = (t, s = 5) => --t * t * ((s + 1) * t + s) + 1;

class MapMarker extends React.Component {
  render() {
    const {
      position,
      id,
      iconUrl,
      active,
      overed,
      ts,
      animation,
      hide,
      mobile,
      bigger,
      smaller,
      showOnOver,
      disableAutoPan,
      groupId,
      overedGroup,
    } = this.props;
    const sizeAdd = bigger ? (mobile ? 60 : 30) : smaller ? -20 : 0;
    const multiplicator = mobile ? 0.5 : 1;

    let zIndex = 0;
    if (overed || overedGroup) {
      zIndex = 99999998; // Show on top
      if (bigger) {
        zIndex += 10;
      }
    } else if (bigger) {
      zIndex = 99999999; // For Paris and PasDeCalais flags
      console.log('bigger');
    } else {
      zIndex = Math.round(ts / 1000000); // Last ts are show on top first
    }
    return (
      <Animate
        data={{ scale: ((overed || active ? 60 : 40) + sizeAdd) * multiplicator }}
        duration={200}
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
            zIndex={zIndex}
            onClick={() => !showOnOver && this.props.setActiveMarker(id)}
            onMouseOver={() => this.props.setOverMarker(id, groupId)}
            onMouseOut={() => this.props.setOverMarker(null)}
            visible={!hide}
          >
            {active || (showOnOver && overed) ? (
              <InfoWindow
                position={position}
                options={{ disableAutoPan }}
                onCloseClick={() => this.props.setActiveMarker(null)}
              >
                <MarkerContent {...this.props} />
              </InfoWindow>
            ) : null}
          </Marker>
        )}
      </Animate>
    );
  }
}

export default connect(
  (state, props) => ({
    overed: state.overedMarkerId === props.id,
    overedGroup: props.groupId && state.overedGroupId === props.groupId,
    active: state.activeMarkerId === props.id || state.newMarkerId === props.id,
    disableAutoPan: state.newMarkerId === props.id,
  }),
  {
    setOverMarker,
    setActiveMarker,
  },
)(MapMarker);
