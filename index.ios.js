import React, { Component } from 'react';
import {
  AppRegistry,
  NavigatorIOS,
  StyleSheet,
} from 'react-native';
import Welcome from './Components/Welcome';

export default class efcSermons2 extends Component {
  render() {
    return (
      <NavigatorIOS
        style={styles.container}
        barTintColor="#f9bd49"
        initialRoute={{
          title: '雪梨台福教會 - 證道資料',
          component: Welcome
        }}
      />
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
