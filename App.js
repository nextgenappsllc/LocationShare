import { StackNavigator } from 'react-navigation';
import { HomeScene } from './HomeScene';
import { LocalLocationScene } from './LocalLocationScene';

const App = StackNavigator({
  Home: { screen: HomeScene },
  LocalLocation: { screen: LocalLocationScene },
});
export default App;
