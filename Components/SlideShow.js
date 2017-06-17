import React, { Component, PropTypes } from 'react';
import { Dimensions, Image, StyleSheet, Text, View } from 'react-native';
import Swiper from 'react-native-swiper';

export default class SlideShow extends Component {
  static propTypes = {
    slides: PropTypes.array.isRequired
  };
  renderPagination(index, total, context) {
    return (
      <View style={styles.pageInfo}>
        <Text style={styles.pageText}>{index + 1} / {total}</Text>
      </View>
    );
  }
  render() {
    const { slides } = this.props;
    return (
      <View style={styles.wrapper}>
        <Swiper
          height={200}
          horizontal={true}
          loop={true}
          showsButtons
          renderPagination={this.renderPagination}>
          {slides.map(slide => {
            const viewWidth = Dimensions.get('window').width;
            return (
              <View key={slide} style={{ width: viewWidth, height: 200 }}>
                <Image
                  source={{ uri: slide.url, cache: 'force-cache' }}
                  style={{ width: viewWidth, height: 200 }}
                  resizeMode="contain"
                />
              </View>
            );
          })}
        </Swiper>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  wrapper: {
    alignItems: 'center',
    backgroundColor: '#000',
    height: 250,
    justifyContent: 'center'
  },
  pageInfo: {
    alignItems: 'center',
    backgroundColor: '#333',
    borderRadius: 12,
    bottom: -15,
    display: 'flex',
    left: '50%',
    marginLeft: -30,
    opacity: 0.7,
    padding: 4,
    position: 'absolute',
    width: 60
  },
  pageText: {
    color: 'white',
    fontSize: 12
  }
});
