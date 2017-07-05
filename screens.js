import { Navigation } from 'react-native-navigation';

import Welcome from './Components/Welcome';
import Categories from './Components/Categories';
import SermonList from './Components/SermonList';
import Sermon from './Components/Sermon';

export function registerScreens() {
  Navigation.registerComponent('efcSermon2.Welcome', () => Welcome);
  Navigation.registerComponent('efcSermon2.Categories',  () => Categories);
  Navigation.registerComponent('efcSermon2.SermonList', () => SermonList);
  Navigation.registerComponent('efcSermon2.Sermon',  () => Sermon);
}