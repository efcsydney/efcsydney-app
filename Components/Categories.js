import React, { Component } from 'react';
import _ from 'lodash';
import {
  View,
  Text,
  TextInput,
  TouchableHighlight,
  ActivityIndicator,
  StyleSheet,
  ScrollView,
} from 'react-native';
import SermonList from './SermonList';
import {getSermonList} from '../Utils/api';

export default class Categories extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: false,
      error: false
    }
  }
  handlePress = (key) => {
    if (this.state.isLoading) {
      return;
    }
    this.setState({
      isLoading: true,
      error: '',
    });
    getSermonList(key).then(data => {
      this.props.navigator.push({
        title: `${_.capitalize(key)} Sermon`,
        component: SermonList,
        passProps: {sermonList: data, category: key},
      });
      this.setState({
        isLoading: false,
        error: ''
      });
    }).catch(err => {
      console.info(err);
      this.setState({
        isLoading: false,
        error: err.message
      });
    });
  }
  render() {
    const {categories: {items}} = this.props;

    return (
      <View style={styles.container}>
        {items.map(item => {
          const key = item.grouptag;
          return (
            <TouchableHighlight
              key={key}
              style={styles.viewLink}
              onPress={this.handlePress.bind(this, key)}
              underlayColor="#88d4f5">
              <View>
                <Text style={styles.itemTitle}>{_.capitalize(item.grouptag)} Sermon</Text>
                <Text>{decodeURI(item.title)}</Text>
              </View>
            </TouchableHighlight>
          );
        })}
        {(this.state.isLoading) && (
        <ActivityIndicator
          color="#fff"
          style={styles.indicator}
          animating={true}
          size="large"/>
        )}
      </View>
    );
  }
}

var styles = StyleSheet.create({
  container: {
    backgroundColor: '#eee',
    flex: 1,
    padding: 10,
    marginTop: 65,
    marginBottom: -10,
  },
  indicator: {
    ...StyleSheet.absoluteFillObject,
    flex: 1,
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  itemTitle: {
    fontWeight: '700',
    fontSize: 24,
    marginBottom: 5,
  },
  viewLink: {
    alignItems: 'center',
    borderColor: '#ccc',
    borderRadius: 4,
    borderStyle: 'solid',
    borderWidth: 1,
    marginBottom: 10,
    alignSelf: 'stretch',
    backgroundColor: '#fff',
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center'
  }
});
