import React from 'react';
import { StyleSheet, Text, View, Button } from 'react-native';
import { LocationDisplay } from './components/LocationDisplay';

export class LocalLocationScene extends React.Component {

  constructor(props){
    super(props);
    this.state = {};
    this.monitorLocation = this.monitorLocation.bind(this);
  }

  monitorLocation() {
    this.watchID = navigator.geolocation.watchPosition(newLocation => {
      console.log(newLocation);
      this.setState({coordinate: newLocation.coords});
    }, error => {
      this.props.navigation.pop();
    });
  }

  componentWillMount() {
    this.monitorLocation();
  }

  componentWillUnmount() {
    navigator.geolocation.clearWatch(this.watchID);
    navigator.geolocation.stopObserving();
  }

  render() {
    return (
      <View style={styles.container}>
      { this.state.coordinate ? 
        <LocationDisplay coordinate={this.state.coordinate}></LocationDisplay> : 
        <Text>Waiting for location.</Text> 
      }
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});