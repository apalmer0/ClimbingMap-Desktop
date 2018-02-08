import React, { Component } from 'react';
import { bool } from 'prop-types';
import {
  Circle,
  DirectionsRenderer,
  GoogleMap,
  withGoogleMap,
  withScriptjs,
} from 'react-google-maps';

const boston = {
  lat: 41.8507300,
  lng: -87.6512600,
};
const crgCambridge = {
  lat: 42.3943939,
  lng: -71.1503452,
};
const crgWatertown = {
  lat: 42.3696015,
  lng: -71.1985997,
};

class Map extends Component {
  state = {
    directions: '',
    place: {},
  }

  componentDidMount () {
    const DirectionsService = new google.maps.DirectionsService();

    DirectionsService.route({
      origin: new google.maps.LatLng(crgCambridge),
      destination: new google.maps.LatLng(crgWatertown),
      travelMode: google.maps.TravelMode.DRIVING,
    }, (result, status) => {
      if (status === google.maps.DirectionsStatus.OK) {
        const polyline = result.routes[0].overview_polyline;
        const decoded = google.maps.geometry.encoding.decodePath(polyline);
        console.log('decoded', decoded);
        const newArr = decoded.map((pts) => {
          return ({
            lat: pts.lat(),
            lng: pts.lng(),
          });
        });
        const shortArr = [];
        newArr.forEach((ele, idx) => {
          if (idx % 10 === 0) {
            shortArr.push(ele);
          }
        });
        console.log('shortArr', shortArr);
        this.setState({
          directions: result,
          shortArr,
        });
      } else {
        console.error(`error fetching directions ${result}`);
      }
    });
  }
  render () {
    return (
      <GoogleMap
        defaultZoom={7}
        defaultCenter={boston}
      >
        {this.state.directions && <DirectionsRenderer directions={this.state.directions} />}
        {this.state.shortArr && this.state.shortArr.map((ele, idx) => {
          return (
            <Circle
              key={idx}
              center={new google.maps.LatLng(ele.lat, ele.lng)}
              radius={400}
            />
          );
        })}
      </GoogleMap>
    );
  }
}

Map.defaultProps = {
  isMarkerShown: false,
};

Map.propTypes = {
  isMarkerShown: bool,
};

export default withScriptjs(withGoogleMap(Map));
