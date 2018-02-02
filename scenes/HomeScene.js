import React from 'react';
import { StyleSheet, Text, View, Button, FlatList } from 'react-native';
import { List, ListItem } from "react-native-elements";

export class HomeScene extends React.Component {

  constructor(props){
    super(props);
    this.state = {
      sharedLocations: []
    };
    this.shareLocation = this.shareLocation.bind(this);
    this.viewSharedLocation = this.viewSharedLocation.bind(this);
    this.listItemForSharedLocation = this.listItemForSharedLocation.bind(this);
    this.baseURL = this.props.navigation.state.params.baseURL;
  }

  fetchSharedLocations() {
    fetch(`http://${this.baseURL}api/v1/shared_locations/`, {
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
      this.setState({sharedLocations: json.data});
      this.setupWebSocket();
    })
    .catch(error => {
      console.log('error', error);
    });
  }

  setupWebSocket() {
    this.ws = new WebSocket(`ws://${this.baseURL}socket/`);
      let ws = this.ws;
      ws.onopen = () => {
        //subscribe to channel
        let identifier = {
          channel: 'SharedLocationChannel'
        };
        let channelParams = {
          command: 'subscribe',
          identifier: JSON.stringify(identifier)
        };
        channelParams = JSON.stringify(channelParams);
        ws.send(channelParams, ws);
      };

      ws.onmessage = (e) => {
        console.log(e.data);
        let json = JSON.parse(e.data);
        let message;
        if(json.identifier) {
          let channel = JSON.parse(json.identifier).channel;
          if(channel === 'SharedLocationChannel') {
            message = json.message;
          }
        }
        if(message) {
          if(message.add) {
            let sharedLocations = this.state.sharedLocations.concat([{id: message.add}]);
            this.setState({sharedLocations});
          } else if (message.remove) {
            let id = parseInt(message.remove);
            let sharedLocations = [...this.state.sharedLocations];
            let ids = sharedLocations.map(item => parseInt(item.id));
            let index = ids.indexOf(id);
            if(index >= 0) {
              sharedLocations.splice(index, 1);
              this.setState({sharedLocations});
            }
          }
        }
      };

      ws.onerror = (e) => {
        console.log(e.message);
      };

      ws.onclose = (e) => {
        console.log(e.code, e.reason);
      };
  }

  componentWillMount() {
    this.fetchSharedLocations();
  }

  componentWillUnmount() {
    if(this.ws)ws.close();
  }

  shareLocation() {
    this.props.navigation.navigate('LocalLocation', {
      baseURL: this.baseURL
    });
    // navigator.geolocation.requestAuthorization().then(() => {navigate('LocalLocation')});
    // if (navigator.geolocation.requestAuthorization()) {
    //   navigate('LocalLocation');
    // }
  }

  viewSharedLocation(id) {
    this.props.navigation.navigate('SharedLocation', {
      baseURL: this.baseURL, 
      id: id
    });
  }


  render() {
    const { sharedLocations } = this.state;

    return (
      <View>
        <Button 
          title="Click to share location" 
          onPress={this.shareLocation} />
        <List>
          <FlatList
            data={sharedLocations}
            keyExtractor={item => item.id}
            renderItem={this.listItemForSharedLocation} />
        </List>
      </View>
    );
  }


  listItemForSharedLocation({item}) {
    return <ListItem title={`Shared location ${item.id}`} onPress={() => this.viewSharedLocation(item.id)} />;
  }

}

