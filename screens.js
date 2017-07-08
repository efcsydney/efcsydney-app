import { Navigation } from 'react-native-navigation';

import Welcome from './Components/Welcome';
import Categories from './Components/Categories';
import SermonList from './Components/SermonList';
import Sermon from './Components/Sermon';

export function registerScreens(store, Provider) {
  Navigation.registerComponent('efcSermon2.Welcome', () => Welcome, store, Provider);
  Navigation.registerComponent('efcSermon2.Categories',  () => Categories, store, Provider);
  Navigation.registerComponent('efcSermon2.SermonList', () => SermonList, store, Provider);
  Navigation.registerComponent('efcSermon2.Sermon',  () => Sermon, store, Provider);
}