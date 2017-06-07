/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, { Component } from 'react';
import {
  AppRegistry,
  NavigatorIOS,
  StyleSheet,
  Text,
  View
} from 'react-native';
import Main from './Components/Main';

export default class efcSermons2 extends Component {
  render() {
    return (
      <NavigatorIOS
                ref="navigator2"
        style={styles.container}
                barTintColor="#fff"
        initialRoute={{
          title: 'Sermons',
          component: Main,
        }}/>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff'
  }
});

AppRegistry.registerComponent('efcSermons2', () => efcSermons2);
