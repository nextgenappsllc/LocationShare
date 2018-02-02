import { StackNavigator } from 'react-navigation';
import { HomeScene } from './scenes/HomeScene';
import { LocalLocationScene } from './scenes/LocalLocationScene';
import { SharedLocationScene } from './scenes/SharedLocationScene';

// Change this to the IP address of your local machine
const baseURL = '192.168.100.4:3000/'; 

const App = StackNavigator({
  Home: { 
  	screen: HomeScene
  },
  LocalLocation: { 
  	screen: LocalLocationScene
  },
  SharedLocation: {
  	screen: SharedLocationScene
  }
}, {
	initialRouteParams: { baseURL }
});
export default App;
