import _ from 'lodash';
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
  handleOrientationChange = (orientation) => {
    orientation = orientation.toLowerCase();
    if (orientation === 'portrait' || orientation === 'landscape') {
      store.dispatch(changeOrientation(orientation));
    }
  }
  onStoreUpdate() {
    if (!this.isInitialized) {
      this.startApp();
      this.isInitialized = true;
    }
  }
  startApp() {
    Orientation.addOrientationListener(_.debounce(this.handleOrientationChange, 500));

    Navigation.startSingleScreenApp({
      screen: {
        screen: 'efcSermon2.Categories',
        title: '分類',
        navigatorStyle: {
            navBarBackgroundColor: '#f9bd49',
            navBarHidden: false,
            navBarTitleTextCentered: true
        },
        navigatorButtons: {}
      }
    });

  }
}