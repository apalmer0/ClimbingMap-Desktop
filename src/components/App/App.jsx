import React, { Component } from 'react';

import Map from '../Map';

class App extends Component {
  render () {
    return (
      <div className="app">
        <h1>Maps</h1>
        <Map
          googleMapURL="https://maps.googleapis.com/maps/api/js?key=AIzaSyCNaCv8ozBsC4BF4QRzELhTT73d4KOvp0I&v=3.exp&libraries=geometry,drawing,places"
          loadingElement={<div style={{ height: '100%' }} />}
          containerElement={<div style={{ height: '600px' }} />}
          isMarkerShown
          mapElement={<div style={{ height: '100%' }} />}
        />
      </div>
    );
  }
}

export default App;
