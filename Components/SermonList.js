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
import Sermon from './Sermon';
import {getSermon} from '../Utils/api';

export default class SermonList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: false,
      error: false
    }
  }
  handlePress = (type, grouptag, title) => {
    if (this.state.isLoading) {
      return;
    }
    this.setState({
      isLoading: true,
      error: '',
    });
    getSermon(type, grouptag).then(data => {
      this.props.navigator.push({
        title,
        component: Sermon,
        passProps: {
          sermon: data,
          title,
          category: type,
          grouptag
        },
      });
      this.setState({
        isLoading: false,
        error: ''
      });
    });
  }
  render() {
    const {sermonList} = this.props;

    const items = _(sermonList.items)
      .filter({isdir: '1'})
      .filter(item => (!item.ishide || item.ishide === '0'))
      .filter(item => !_.isUndefined(item.grouptag))
      .orderBy('grouptag', 'desc')
      .value();

    return (
      <ScrollView style={styles.container}>
        {items.map(item => {
          const key = `${item.grouptag}-${item.name}`;
          const title = unescape(decodeURI(item.title || item.name || 'Untitled'));
          return (
            <TouchableHighlight
              key={key}
              style={styles.viewLink}
              onPress={this.handlePress.bind(this, this.props.category, item.grouptag, title)}
              underlayColor="#88d4f5">
              <View>
                <View>
                  <Text style={{marginBottom: 5, fontSize: 20, fontWeight: '700'}}>{title}</Text>
                </View>
                <View>
                  <Text>{unescape(decodeURI(item.Speaker || ''))}</Text>
                </View>
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
      </ScrollView>
    );
  }
}

var styles = StyleSheet.create({
  container: {
    backgroundColor: '#eee',
    padding: 10,
  },
  viewLink: {
    padding: 10,
    borderColor: '#ccc',
    borderRadius: 4,
    borderStyle: 'solid',
    borderWidth: 1,
    marginBottom: 10,
    backgroundColor: '#fff',
  },
  indicator: {
    ...StyleSheet.absoluteFillObject,
    flex: 1,
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
});
