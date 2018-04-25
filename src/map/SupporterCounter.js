import React from 'react';
import { Animate } from 'react-move';
import { connect } from 'react-redux';

const SupporterCounter = ({ markersCount, likesCount, animationDuration }) => (
  <div>
    <p>Encouragez les Défis Respire et rejoignez les:</p>
    <Animate
      data={{ n: markersCount + likesCount }}
      duration={animationDuration}
      easing="easeSinOut"
    >
      {data => (
        <div style={{ color: '#26B8D0', paddingTop: 5, fontSize: 35 }}>
          {Math.round(data.n).toLocaleString('fr', { maximumFractionDigits: 2 })}
        </div>
      )}
    </Animate>
    <p style={{ textTransform: 'uppercase', paddingTop: 10, color: '#5F6061', fontSize: 20 }}>
      supporters
    </p>
  </div>
);

export default connect(({ likesCount, animationDuration }) => ({
  likesCount,
  animationDuration,
}))(SupporterCounter);
