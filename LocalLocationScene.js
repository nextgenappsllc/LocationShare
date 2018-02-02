import React from 'react';
import { StyleSheet, Text, View, Button } from 'react-native';
import { LocationDisplay } from './components/LocationDisplay';
import RNSimpleCompass from 'react-native-simple-compass';

export class LocalLocationScene extends React.Component {

  constructor(props){
    super(props);
    this.state = {compass: 0, coordinate: {}};
    this.monitorLocation = this.monitorLocation.bind(this);
    this.baseURL = this.props.navigation.state.params.baseURL;
  }


  attributesFromState() {
    const {compass, coordinate} = this.state;
    const {latitude, longitude, heading} = coordinate;
    return {compass, latitude, longitude, heading};
  }

  postLocation(){
    let body = {
      _jsonapi: {
        data: { 
          attributes: this.attributesFromState()
        }
      }
    };
    body = JSON.stringify(body);
    // console.log('body', body);
    fetch(`http://${this.baseURL}api/v1/shared_locations/`, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json'
      },
      body: body
    })
    .then(response => {
      return response.json();
    })
    .then(json => {
      // console.log('succeeded', json);
      this.setState({id: json.data.id});
    })
    .catch(error => {
      console.log('error', error);
      this.pop();
    });
  }

  monitorLocation() {
    RNSimpleCompass.start(3, (degree) => {
      let data = {compass: degree};
      this.sendUpdatedLocation(Object.assign({}, this.attributesFromState(), data));
      this.setState(data);
    });
    this.watchID = navigator.geolocation.watchPosition(newLocation => {
      // console.log(newLocation);
      let data = newLocation.coords;
      this.sendUpdatedLocation(Object.assign({}, this.attributesFromState(), data));
      this.setState({coordinate: data});
      
    }, error => this.pop());
  }

  sendUpdatedLocation(data) {
    if (this.channel && this.ws && data) {
      console.log('sending!');
      let ws = this.ws;
      let id = this.state.id;
      let identifier = {
        channel: this.channel,
        id: id
      };
      let channelParams = {
        command: 'message',
        identifier: JSON.stringify(identifier),
        data: JSON.stringify(data)
      };
      channelParams = JSON.stringify(channelParams);
      ws.send(channelParams, ws);
    }
  }

  setupWebSocket(id) {
    this.ws = new WebSocket(`ws://${this.baseURL}socket/`);
      let ws = this.ws;
      ws.onopen = () => {
        //subscribe to channel
        let identifier = {
          channel: 'ShareLocationChannel',
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
        if(json.type === 'confirm_subscription') {
          // set channel
          this.channel = JSON.parse(json.identifier).channel;
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
    this.monitorLocation();
    this.postLocation();
  }

  componentWillUpdate(nextProps, nextState) {
    if (!this.ws && nextState.id) {
      this.setupWebSocket(nextState.id);
    }
  }

  componentDidUpdate(prevProps, prevState) {
  }

  componentWillUnmount() {
    navigator.geolocation.clearWatch(this.watchID);
    navigator.geolocation.stopObserving();
    RNSimpleCompass.stop();
    if(this.ws) {
      this.ws.close();
      this.ws = null;
    }
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