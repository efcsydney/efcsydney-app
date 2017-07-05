import React, { Component } from 'react';
import { View, Image, Text, StyleSheet } from 'react-native';
import Categories from './Categories';
import { fetchFile } from '../Utils/api';

export default class Welcome extends Component {
  componentDidMount() {
    const { navigator } = this.props;
    const path = '/sermon';
    fetchFile(path).then(data => {
      navigator.push({
        screen: 'efcSermon2.Categories',
        title: '分類',
        backButtonHidden: true,
        passProps: {
          path,
          info: data.dirinfo,
          items: data.items
        }
      });
    });
  }
  render() {
    return (
      <View style={styles.container}>
        <View style={styles.logoWrapper}>
          <Image style={styles.logo} source={require('../Assets/logo.png')} />
        </View>
        <View style={{ flex: 2, marginLeft: -15 }}>
          <Text style={styles.welcome}>
            Sermons
          </Text>
          <Text style={styles.instructions}>
            Evangelical Formosan Church of Sydney
          </Text>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#eee'
  },
  welcome: {
    fontSize: 32,
    fontWeight: '700',
    marginBottom: 5
  },
  logoWrapper: {
    flex: 1,
    width: 85,
    height: 95,
    alignItems: 'center'
  },
  logo: {
    width: 85,
    height: 95
  },
  instructions: {
    fontSize: 10,
    fontStyle: 'italic',
    color: '#999999',
    marginLeft: 3
  }
});
