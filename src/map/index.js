// @flow
import React from 'react';
import GoogleMap from './GoogleMap';
import FacebookProvider, { EmbeddedPost, Parser } from 'react-facebook';

class SocialMapPage extends React.Component {

  render() {
    return (
      <div
        style={{ height: '600px', width: '100%' }}
      >

        <GoogleMap />

      </div>
    );
  }
}


export default SocialMapPage;
