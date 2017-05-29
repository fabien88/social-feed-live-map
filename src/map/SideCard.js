import React from 'react';
import { connect } from 'react-redux';
import FlipCard from 'react-flipcard';
import s from './styles.css';
import { setActiveMarker, flipForm } from '../actions';
import ScrollableTable from './ScrollableTable';
import { AcclaimForm } from './Acclaim';

const styles = {
  socialBox: {
    backgroundColor: 'white',
    // overflow: 'auto',
    padding: 20,
    // WebkitOverflowScrolling: 'touch',
    boxShadow: '0 14px 28px rgba(0,0,0,0.25), 0 10px 10px rgba(0,0,0,0.22)',
    borderRadius: 2,
    width: '88vw',
    userSelect: 'none',
  },
};

const SideCard = ({ mobile, markers, showForm, flipForm }) => (
  <FlipCard
    disabled
    className={s.content}
    flipped={showForm}
  >
    <div style={{ ...styles.socialBox, width: mobile ? '87vw' : 350, marginTop: mobile ? 125 : 0, minHeight: 520, height: 520 }} >
      <ScrollableTable markers={markers.filter(c => c.type === 'message').reverse()} onFlip={flipForm} />
    </div>
    <div style={{ ...styles.socialBox, width: mobile ? '87vw' : 350, minHeight: 520, height: 520 }} >
      <AcclaimForm onFlip={flipForm} />
    </div>
  </FlipCard>
  );


export default connect(state => ({
  showForm: state.showForm,
}), {
  setActiveMarker,
  flipForm,
})(SideCard);
