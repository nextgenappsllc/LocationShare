import { StackNavigator } from 'react-navigation';
import { HomeScene } from './HomeScene';
import { LocalLocationScene } from './LocalLocationScene';
import { SharedLocationScene } from './SharedLocationScene';

const baseURL = '192.168.2.110:3000/';

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
