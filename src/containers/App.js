import { applyMiddleware, createStore } from 'redux';
import { Provider } from 'react-redux';
import { Navigation } from 'react-native-navigation';
import logger from 'redux-logger';
import { registerScreens } from '../screens';
import reducer from '../redux';
import {changeOrientation} from '../redux/app';
import Orientation from 'react-native-orientation';

const store = createStore(reducer, applyMiddleware(logger));

registerScreens(store, Provider);

export default class App {
  constructor() {
    const orientation = Orientation.getInitialOrientation().toLowerCase();
    store.subscribe(this.onStoreUpdate.bind(this));
    store.dispatch(changeOrientation(orientation));
  }
  onStoreUpdate() {
    if (!this.isInitialized) {
      this.startApp();
      this.isInitialized = true;
    }
  }
  startApp() {
    Orientation.addOrientationListener(orientation => {
      changeOrientation(orientation.toLowerCase());
    });

    Navigation.startSingleScreenApp({
      screen: {
        screen: 'efcSermon2.Welcome',
        title: 'EFC Sydney Church',
        navigatorStyle: {
            navBarBackgroundColor: '#f9bd49',
            navBarHidden: true
        },
        navigatorButtons: {}
      }
    });

  }
}