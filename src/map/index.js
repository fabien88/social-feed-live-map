// @flow
import React from 'react';
import GoogleMap from './GoogleMap';
import FacebookProvider, { EmbeddedPost, Parser } from 'react-facebook';

class SocialMapPage extends React.Component {

  render() {
    return (
      <GoogleMap />
    );
  }
}


export default SocialMapPage;
