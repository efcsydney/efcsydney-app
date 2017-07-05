import React, { Component } from 'react';
import _ from 'lodash';
import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  Text,
  TouchableHighlight,
  View
} from 'react-native';
import { fetchFile } from '../Utils/api';
import { filterList, decode, normalizeItem } from '../Utils/helper';
import SermonList from './SermonList';

function translate(name) {
  if (name === 'Mandarin') {
    return '華語證道';
  } else if (name === 'English') {
    return 'English';
  } else if (name === 'Special') {
    return '特殊證道';
  }
  return name;
}

export default class Categories extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: false,
      error: false
    };
  }
  handlePress = item => {
    if (this.state.isLoading) {
      return;
    }

    this.setState({
      isLoading: true,
      error: ''
    });

    const { navigator } = this.props;
    const path = `/sermon/${item.file}`;

    fetchFile(path)
      .then(data => {
        navigator.push({
          screen: 'efcSermon2.SermonList',
          title: translate(item.name),
          passProps: {
            path,
            info: data.dirinfo,
            items: filterList(data.items)
          }
        });

        this.setState({
          isLoading: false,
          error: ''
        });
      })
      .catch(err => {
        this.setState({
          isLoading: false,
          error: err.message
        });
      });
  };
  render() {
    const items = this.props.items.map(normalizeItem);
    return (
      <View style={styles.container}>
        {items.map(item => {
          return (
            <TouchableHighlight
              key={item.key}
              style={[styles.itemWrap, styles[`itemWrap${item.name}`]]}
              onPress={this.handlePress.bind(this, item)}
              underlayColor="#88d4f5">
              <View>
                <Text style={styles.itemTitle}>{item.name} Sermon</Text>
                <Text style={styles.itemSubtitle}>{item.title}</Text>
              </View>
            </TouchableHighlight>
          );
        })}
        {this.state.isLoading &&
          <ActivityIndicator
            color="#fff"
            style={styles.indicator}
            animating={true}
            size="large"
          />}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#eee',
    flex: 1,
    padding: 10,
    marginBottom: -10
  },
  indicator: {
    ...StyleSheet.absoluteFillObject,
    flex: 1,
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)'
  },
  itemTitle: {
    color: '#333',
    fontWeight: '700',
    fontSize: 24,
    marginBottom: 5
  },
  itemSubtitle: {
    color: '#666',
    fontSize: 12
  },
  itemWrap: {
    alignItems: 'center',
    alignSelf: 'stretch',
    backgroundColor: '#fff',
    borderColor: '#ddd',
    borderRadius: 4,
    borderStyle: 'solid',
    borderWidth: 1,
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 10
  },
  itemWrapMandarin: {
    //backgroundColor: '#d2ecec',
  },
  itemWrapEnglish: {
    //backgroundColor: '#f8eeee',
  },
  itemWrapSpecial: {
    //backgroundColor: '#fde3f3',
  }
});
