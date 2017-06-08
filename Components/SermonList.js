import React, { Component } from 'react';
import _ from 'lodash';
import {
  ActivityIndicator,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableHighlight,
  View
} from 'react-native';
import Sermon from './Sermon';
import { fetchFile } from '../Utils/api';
import { decode } from '../Utils/helper';

function filter(items) {
  return (items = _(items)
    .filter({ isdir: '1' })
    .filter(item => !item.ishide || item.ishide === '0')
    .filter(item => !_.isUndefined(item.grouptag))
    .orderBy('grouptag', 'desc')
    .value());
}

function normalize(item, path = '/sermon') {
  path = `${path}/${item.grouptag}`;
  return {
    _raw: item,
    path,
    date: item.date,
    dirinfo: item.dirinfo,
    file: item.grouptag,
    key: `${item.grouptag}-${item.name}`,
    speaker: decode(item.Speaker || ''),
    thumb: `http://media.efcsydney.org/data/thumb/200x200${path}/.thumb.jpg`,
    title: decode(item.title || item.name || 'Untitled')
  };
}

export default class SermonList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: false,
      error: false
    };
  }
  handlePress = item => {
    const { title, path, file } = item;

    if (this.state.isLoading) {
      return;
    }

    this.setState({
      isLoading: true,
      error: ''
    });

    fetchFile(path).then(data => {
      this.props.navigator.push({
        title,
        component: Sermon,
        passProps: {
          path,
          info: data.dirinfo,
          items: data.items
        }
      });
      this.setState({
        isLoading: false,
        error: ''
      });
    });
  }
  render() {
    const items = filter(this.props.items).map(item =>
      normalize(item, this.props.path)
    );

    return (
      <ScrollView style={styles.container}>
        {items.map(item => (
            <TouchableHighlight
              key={item.key}
              style={styles.itemWrap}
              onPress={this.handlePress.bind(this, item)}
              underlayColor="#88d4f5">
              <View style={styles.item}>
                <View style={styles.itemBody}>
                  <Text style={styles.date}>{item.date}</Text>
                  <Text style={styles.title}>{item.title}</Text>
                  <Text>{item.speaker}</Text>
                </View>
                <View style={styles.itemMedia}>
                  <Image source={{ uri: item.thumb }} style={styles.image} />
                </View>
              </View>
            </TouchableHighlight>
        ))}
        {this.state.isLoading &&
          <ActivityIndicator
            color="#fff"
            style={styles.indicator}
            animating={true}
            size="large"
          />}
      </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#eee',
    padding: 10
  },
  title: {
    marginBottom: 5,
    fontSize: 20,
    fontWeight: '700'
  },
  indicator: {
    ...StyleSheet.absoluteFillObject,
    flex: 1,
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)'
  },
  // item
  itemWrap: {
    backgroundColor: '#fff',
    borderColor: '#ccc',
    borderRadius: 4,
    borderStyle: 'solid',
    borderWidth: 1,
    marginBottom: 10,
    padding: 10
  },
  item: {
    alignItems: 'flex-start',
    display: 'flex',
    flexDirection: 'row',
    paddingTop: 10,
    paddingLeft: 10,
    marginBottom: 10
  },
  itemMedia: {
    alignItems: 'center',
    alignContent: 'center',
    display: 'flex',
    flex: 1,
    flexDirection: 'column',
    marginLeft: 5,
    padding: 4
  },
  itemBody: {
    flex: 2
  },
  image: {
    width: 100,
    height: 75
  },
  date: {
    color: '#999',
    fontSize: 11,
    marginBottom: 5
  }
});
