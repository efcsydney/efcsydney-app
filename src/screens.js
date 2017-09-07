import { Navigation } from 'react-native-navigation';

import Categories from './containers/Categories';
import SermonList from './containers/SermonList';
import Sermon from './containers/Sermon';

export function registerScreens(store, Provider) {
  Navigation.registerComponent('efcSermon2.Categories',  () => Categories, store, Provider);
  Navigation.registerComponent('efcSermon2.SermonList', () => SermonList, store, Provider);
  Navigation.registerComponent('efcSermon2.Sermon',  () => Sermon, store, Provider);
}