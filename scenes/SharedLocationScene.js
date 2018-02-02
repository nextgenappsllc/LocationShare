import React from 'react';
import { StyleSheet, Text, View, Button } from 'react-native';
import { LocationDisplay } from '../components/LocationDisplay';

export class SharedLocationScene extends React.Component {

  constructor(props){
    super(props);
    this.state = {compass: 0};
    this.baseURL = this.props.navigation.state.params.baseURL;
    this.id = this.props.navigation.state.params.id;
  }

  fetchLocation(){
    fetch(`http://${this.baseURL}api/v1/shared_locations/${this.id}`, {
      method: 'GET',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json'
      }
    })
    .then(response => {
      return response.json();
    })
    .then(json => {
      // console.log('succeeded', json);
      if (!this.ws) {
        this.setupWebSocket(this.id);
      }
      let {compass, latitude, longitude, heading} = json.data.attributes;
      if(!compass) compass = 0;
      let coordinate = {latitude, longitude, heading};
      this.setState({coordinate, compass});
    })
    .catch(error => {
      console.log('error', error);
      this.pop();
    });
  }

  setupWebSocket(id) {
    this.ws = new WebSocket(`ws://${this.baseURL}socket/`);
      let ws = this.ws;
      ws.onopen = () => {
        //subscribe to channel
        let identifier = {
          channel: 'SharedLocationChannel',
          id: id
        };
        let channelParams = {
          command: 'subscribe',
          identifier: JSON.stringify(identifier)
        };
        channelParams = JSON.stringify(channelParams);
        ws.send(channelParams, ws);
      };

      ws.onmessage = (e) => {
        let json = JSON.parse(e.data);
        let message = json.message;
        if(message && message.id) {
          let {compass, latitude, longitude, heading} = message;
          if(!compass) compass = 0;
          let coordinate = {latitude, longitude, heading};
          this.setState({coordinate, compass});
          // this.setState(message.attributes);
        }
        console.log(e.data);
      };

      ws.onerror = (e) => {
        console.log(e.message);
      };

      ws.onclose = (e) => {
        console.log(e.code, e.reason);
      };
  }

  pop() {
    this.props.navigation.goBack();
  }

  componentDidMount() {
    this.fetchLocation();
  }

  componentWillUpdate(nextProps, nextState) {
    
  }

  componentDidUpdate(prevProps, prevState) {
  }

  componentWillUnmount() {
    if(this.ws) this.ws.close();
  }

  render() {
    let content = <Text>Waiting for location.</Text>;
    if (this.state.coordinate && this.state.coordinate.latitude && this.state.coordinate.longitude) {
      content = (
        <LocationDisplay coordinate={this.state.coordinate} compass={this.state.compass} ></LocationDisplay>
      );
    }
    return (
      <View style={styles.container}>
      {content}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center'
  }
});