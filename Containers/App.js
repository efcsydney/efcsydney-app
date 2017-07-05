import React, { Component } from 'react';
import { registerScreens } from '../screens';

import { Navigation } from 'react-native-navigation';

registerScreens();

Navigation.startSingleScreenApp({
  screen: {
    screen: 'efcSermon2.Welcome',
    title: '雪梨台福證道',
    navigatorStyle: {
      navBarBackgroundColor: '#f9bd49',
      navBarHidden: true
    },
    navigatorButtons: {}
  }
});
