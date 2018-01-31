import React from 'react';
import { StyleSheet, Text, View, Button } from 'react-native';
import { LocalLocationScene } from './LocalLocationScene';

export class HomeScene extends React.Component {

  constructor(props){
    super(props);
    this.shareLocation = this.shareLocation.bind(this);
  }

  shareLocation() {
    this.props.navigation.navigate('LocalLocation');
    // navigator.geolocation.requestAuthorization().then(() => {navigate('LocalLocation')});
    // if (navigator.geolocation.requestAuthorization()) {
    //   navigate('LocalLocation');
    // }
  }


  render() {
    return (
      <View style={styles.container}>
      <Button 
      title="Click to share location" 
      onPress={this.shareLocation}>
      </Button> 
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