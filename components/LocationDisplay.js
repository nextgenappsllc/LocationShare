import React from 'react';
import { StyleSheet, Text, View, Button, Image } from 'react-native';
import MapView, { Marker } from 'react-native-maps';

export class LocationDisplay extends React.Component {

  render() {
    const {latitude, longitude, heading} = this.props.coordinate;
    const compass = this.props.compass;
    const coordinate = {latitude, longitude};
    const region = {
      latitudeDelta: 0.0922,
      longitudeDelta: 0.0421, 
      ...coordinate
    }; 
    const mapStyle = {width: '100%', height: '100%'};
    const markerStyle = {
      transform: [{ rotate: `${compass}deg` }]
    };

    return (
      <MapView
      region={region}
      style={mapStyle} >
        <Marker coordinate={coordinate}  >
          <Image source={require('../assets/marker.png')} style={markerStyle} />
        </Marker>
      </MapView>
    );
  }
}