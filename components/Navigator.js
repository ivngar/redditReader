import { StackNavigator } from 'react-navigation';
import Home from './Home';
import DetailPost from './DetailPost';

const Navigator = StackNavigator({
  Home: { screen: Home },
  DetailPost: { screen: DetailPost },
}, {
  initialRouteName: 'Home' },
);

export default Navigator;