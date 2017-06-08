import _ from 'lodash';
import React, { Component } from 'react';
import { Player } from 'react-native-audio-toolkit';
import Swiper from 'react-native-swiper';
import Icon from 'react-native-vector-icons/FontAwesome';
import {
  ActivityIndicator,
  Dimensions,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableHighlight,
  View
} from 'react-native';
import { fetchFile } from '../Utils/api';
import {
  decode,
  findNameByExtension,
  mapImageSizes,
  getColor
} from '../Utils/helper';

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
        backgroundColor: getColor(speaker)
      }
    });

    return (
      <View style={styles.container}>
        {(!_.isEmpty(speaker) && !_.isEmpty(info.date)) && (
        <View style={styles.info}>
          <View style={[styles.infoMedia, infoMediaStyle.overwrite]}>
            <Text style={styles.infoAvatar}>{speaker.charAt(0)}</Text>
          </View>
          <View style={styles.infoBody}>
            <Text style={styles.infoSpeaker}>{speaker}</Text>
            <Text style={styles.infoDate}>{decode(info.date)}</Text>
          </View>
        </View>
        )}
        <View style={styles.title}>
          <View style={styles.titleBody}>
            <Text style={styles.titleText}>{info.title | info.name}</Text>
            {(!_.isEmpty(info.Scripture)) && (
            <Text style={styles.titleScript}>{decode(info.Scripture)}</Text>
            )}
          </View>
          <View style={styles.titleMedia}>
            <TouchableHighlight
              style={styles.play}
              onPress={this.handlePress.bind(this, items)}
              underlayColor="#007eba">
              <View>
                {!this.state.isPlaying &&
                  !this.state.isLoading &&
                  <Icon name="play" style={styles.playIcon} />}
                {this.state.isLoading &&
                  <ActivityIndicator
                    style={styles.playIcon}
                    color="#fff"
                    animating={true}
                    size="small"
                  />}
                {this.state.isPlaying &&
                  <Icon name="pause" style={styles.playIcon} />}
              </View>
            </TouchableHighlight>
          </View>
        </View>
        <View style={styles.swiperWrap}>
          <Swiper height={200} horizontal={true} loop showsButtons>
            {slides.map(slide => {
              const viewWidth = Dimensions.get('window').width;
              const slideHeight = viewWidth / slide.width * slide.height;
              return (
                <View
                  key={slide}
                  style={{ width: viewWidth, height: 200}}>
                  <Image
                    source={{ uri: slide.url }}
                    style={{ width: viewWidth, height: 200}}
                    resizeMode="contain"
                  />
                </View>
              );
            })}
          </Swiper>
        </View>
        {(!_.isEmpty(info.desc)) && (
        <ScrollView style={styles.descWrap}>
          <Text style={styles.desc}>{decode(info.desc)}</Text>
        </ScrollView>
        )}
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
    fontWeight: 'bold',
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
    alignItems: 'center',
    backgroundColor: '#fff',
    display: 'flex',
    flexDirection: 'row',
    padding: 10,
    height: 60
  },
  titleBody: {
    flex: 2
  },
  titleMedia: {
    marginLeft: 'auto',
  },
  titleText: {
    lineHeight: 24,
    fontWeight: '700',
    fontSize: 22
  },
  titleScript: {
    fontSize: 11
  },
  // Audio
  play: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#008cc9',
    borderRadius: 25,
    width: 40,
    height: 40
  },
  playIcon: {
    color: '#fff',
    fontSize: 18
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
