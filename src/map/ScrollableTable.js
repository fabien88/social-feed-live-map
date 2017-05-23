import React from 'react';
import { connect } from 'react-redux';
import { setOverMarker, setActiveMarker } from '../actions';
import ItemTable from './ItemTable';
import ReactList from 'react-list';
import { AcclaimIntro } from './Acclaim';

class ScrollableTable extends React.Component {
  state= {
    browser: false,
  }
  componentWillReceiveProps(nextProps) {
    if (nextProps.activeMarkerId !== this.props.activeMarkerId) {
      if (this.list) {
        this.list.scrollTo(0);
      }
    }
  }


  renderItem = (index, key) => {
    if (index === 0) {
      return <ItemTable key={key} marker={{}} markers={this.props.markers} />;
    }
    return <ItemTable key={key} marker={this.props.markers[index - 1]} />;
  }

  render() {
    const { markers, width } = this.props;

    return (
      <div>
        <AcclaimIntro onClick={this.props.onFlip} />
        <ReactList
          itemRenderer={this.renderItem}
          length={markers.length + 1}
            // minSize={10}
          type="simple"
          ref={c => this.list = c}
        />
      </div>
    );
  }
}


export default connect(state => ({
  // overed: state.overedMarkerId,
  activeMarkerId: state.activeMarkerId,
}), {
  setOverMarker,
  setActiveMarker,
})(ScrollableTable);
