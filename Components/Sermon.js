import _ from 'lodash';
import React, { Component } from 'react';
import { Player } from 'react-native-audio-toolkit';
import Swiper from 'react-native-swiper';
import {
  ActivityIndicator,
  Dimensions,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  View
} from 'react-native';
import { fetchFile } from '../Utils/api';
import {
  decode,
  findNameByExtension,
  mapImageSizes,
  getColor
} from '../Utils/helper';
import PlayButton from './PlayButton';

export default class Sermon extends Component {
  constructor(props) {
    super(props);
    this.player = null;
    this.state = {
      slides: [],
      isLoading: false,
      isPlaying: false,
      error: false
    };
  }
  handlePress = items => {
    const { isLoading, isPlaying } = this.state;
    const { path } = this.props;
    const player = this.player;

    if (isLoading) {
      return;
    }

    if (player && isPlaying) {
      this.setState({ isPlaying: false });
      player.pause();
      return;
    }

    if (player && !isPlaying) {
      this.setState({ isPlaying: true });
      player.play();
      return;
    }

    const fileName = findNameByExtension(items, 'mp3');
    const url = `http://media.efcsydney.org/data/file${path}/${fileName}`;

    this.player = new Player(url);
    this.setState({ isLoading: true });

    this.player.prepare(() => {
      this.setState({
        isLoading: false,
        isPlaying: true
      });
      this.player.play();
    });
  };
  componentDidMount() {
    const { items, path } = this.props;

    if (!items || !items.length) {
      return;
    }

    const slideName = findNameByExtension(items, 'pdf', true);
    const slidePath = `${path}/${slideName}`;

    fetchFile(slidePath).then(data => {
      const rootPath = 'http://media.efcsydney.org/data/thumb/960x960';
      const urls = data.items.map(
        i => `${rootPath}/${slidePath}/${i.grouptag}`
      );
      mapImageSizes(urls).then(data => this.setState({ slides: data }));
    });
  }
  componentWillUnmount() {
    if (this.player) this.player.destroy();
  }
  render() {
    const { path, info, items } = this.props;
    const { slides } = this.state;
    const speaker = decode(info.Speaker);
    const infoMediaStyle = StyleSheet.create({
      overwrite: {
        backgroundColor: speaker ? getColor(speaker) : 'transparent'
      }
    });
    const hasHeader = !_.isEmpty(speaker) && !_.isEmpty(info.date);

    return (
      <View style={styles.container}>
        {hasHeader &&
          <View style={styles.info}>
            <View style={[styles.infoMedia, infoMediaStyle.overwrite]}>
              <Text style={styles.infoAvatar}>{speaker.charAt(0)}</Text>
            </View>
            <View style={styles.infoBody}>
              {!_.isEmpty(speaker) &&
                <Text style={styles.infoSpeaker}>{speaker}</Text>}
              {!_.isEmpty(info.date) &&
                <Text style={styles.infoDate}>{decode(info.date)}</Text>}
            </View>
          </View>}
        <View style={styles.title}>
          <View style={styles.titleBody}>
            <Text style={styles.titleText}>
              {decode(info.title) || info.name}
            </Text>
            {!_.isEmpty(info.Scripture) &&
              <Text style={styles.titleScript}>{decode(info.Scripture)}</Text>}
          </View>
          <View style={styles.titleMedia}>
            <PlayButton
              isLoading={this.state.isLoading}
              isPlaying={this.state.isPlaying}
              onPress={this.handlePress.bind(this, items)}
            />
          </View>
        </View>
        <View style={styles.swiperWrap}>
          <Swiper height={200} horizontal={true} loop={false} showsButtons>
            {slides.map(slide => {
              const viewWidth = Dimensions.get('window').width;
              const slideHeight = viewWidth / slide.width * slide.height;
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
        {!_.isEmpty(info.desc) &&
          <ScrollView style={styles.descWrap}>
            <Text style={styles.desc}>{decode(info.desc)}</Text>
          </ScrollView>}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    backgroundColor: '#eee',
    marginTop: 65
  },
  // Info
  info: {
    alignItems: 'center',
    display: 'flex',
    flexDirection: 'row',
    paddingLeft: 10,
    paddingTop: 10,
    marginBottom: 10
  },
  infoMedia: {
    alignContent: 'center',
    alignItems: 'center',
    backgroundColor: '#ccc',
    borderRadius: 30,
    display: 'flex',
    height: 30,
    justifyContent: 'center',
    marginRight: 5,
    padding: 4,
    width: 30
  },
  infoAvatar: {
    color: '#fff',
    fontWeight: 'bold'
  },
  infoBody: {
    flex: 1
  },
  infoSpeaker: {
    color: '#666',
    fontSize: 11
  },
  infoDate: {
    color: '#666',
    fontSize: 11
  },
  // Title
  title: {
    alignItems: 'flex-start',
    backgroundColor: '#fff',
    display: 'flex',
    flexDirection: 'row',
    padding: 10,
  },
  titleBody: {
    flex: 2
  },
  titleMedia: {
    marginLeft: 'auto'
  },
  titleText: {
    lineHeight: 24,
    fontWeight: '700',
    fontSize: 22,
    marginBottom: 4
  },
  titleScript: {
    fontSize: 11
  },
  // Slide
  swiperWrap: {
    backgroundColor: '#000',
    height: 250,
    justifyContent: 'center',
    alignItems: 'center'
  },
  // Description
  descWrap: {
    margin: 10,
    padding: 10,
    backgroundColor: '#fff',
    borderRadius: 4,
    borderWidth: 1,
    borderColor: '#ccc',
    flex: 1
  },
  desc: {
    lineHeight: 20
  }
});
