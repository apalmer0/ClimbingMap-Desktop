import React, { Component } from 'react';
import { bool } from 'prop-types';
import {
  Polygon,
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
const jsts = require('jsts');

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
        const loc1 = {
          lat: 42.380007,
          lng: -71.1805682,
        };
        const loc2 = {
          lat: 25.774,
          lng: -80.19,
        };
        const locationAlongRoute = new google.maps.LatLng(loc1.lat, loc1.lng)
        const carribean = new google.maps.LatLng(loc2.lat, loc2.lng)
        const overviewPath = result.routes[0].overview_path;
        const overviewPathGeo = [];
        for (let i = 0; i < overviewPath.length; i++) {
          overviewPathGeo.push(
            [overviewPath[i].lng(), overviewPath[i].lat()],
          );
        }
        console.log('result.routes[0]', result.routes[0]);
        console.log('overviewPathGeo', overviewPathGeo);
        const tenKm = 10 / 111.12;
        const distance = tenKm / 50; // m
        const geoInput = {
          type: 'LineString',
          coordinates: overviewPathGeo,
        };
        const geoReader = new jsts.io.GeoJSONReader();
        const geoWriter = new jsts.io.GeoJSONWriter();
        const geometry = geoReader.read(geoInput).buffer(distance);
        const prePolygon = geoWriter.write(geometry);
        const polygon = prePolygon.coordinates[0].map((array) => {
          return {
            lat: array[1],
            lng: array[0],
          };
        });
        const bermudaTriangle = new google.maps.Polygon({paths: polygon});
        const contain1 = google.maps.geometry.poly.containsLocation(locationAlongRoute, bermudaTriangle);
        const contain2 = google.maps.geometry.poly.containsLocation(carribean, bermudaTriangle);

        console.log('polygon', polygon);
        console.log('should be true', contain1);
        console.log('should be false', contain2);
        DirectionsService.route({
          origin: new google.maps.LatLng(crgCambridge),
          destination: new google.maps.LatLng(crgWatertown),
          travelMode: google.maps.TravelMode.DRIVING,
          waypoints: [
            {
              location: locationAlongRoute,
              stopover: true,
            },
          ]
        }, (result, status) => {
          if (status === google.maps.DirectionsStatus.OK) {
            this.setState({
              directions: result,
            });
          } else {
            console.error(`error fetching directions ${result}`);
          }
        });
        this.setState({
          // directions: result,
          polygon,
        });
      } else {
        console.error(`error fetching directions ${result}`);
      }
    });
  }
  render () {
    console.log('this.state.directions', this.state.directions)
    return (
      <GoogleMap
        defaultZoom={7}
        defaultCenter={boston}
      >
        {this.state.directions && <DirectionsRenderer directions={this.state.directions} />}
        {this.state.polygon &&
          <Polygon
            paths={this.state.polygon}
          />
        }
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
