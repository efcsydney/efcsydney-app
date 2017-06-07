import _ from 'lodash';
import React, { Component } from 'react';
import Sound from 'react-native-sound';
import { Player, MediaStates } from 'react-native-audio-toolkit';
import ImageSlider from 'react-native-image-slider';
import Swiper from 'react-native-swiper';
import Icon from 'react-native-vector-icons/FontAwesome';
import { ActivityIndicator, Image, View, Text, StyleSheet, TouchableHighlight } from 'react-native';
import { getSermonSlides } from '../Utils/api';

function decode(str) {
  return unescape(decodeURI(str));
}

function getColor(str) {
  var hash = 0,
  i, c;

  if (!str.length) {
    return hash;
  }
  for (i = 0; i < str.length; i++) {
    c = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + c;
    hash = hash & hash; // Convert to 32bit integer
  }

  colors = [
    '#9b6bcc',
    '#3e76bb',
    '#96b556',
    '#ff894f',
    '#6bc7cc',
    '#b56d56',
    '#f94c83',
    '#bd2f2f',
  ];

  return colors[Math.abs(hash) % 8]
}

function getFileNameByExtension(items, extension, isDir = false) {
  const itemInfo = _.find(items, item => {
    if (isDir) {
      return (
        item.isdir === '1' &&
        item.name.toLowerCase().indexOf(`.${extension}`) !== -1
      );
    } else {
      return (
        item.isdir === '0' &&
        item.name.toLowerCase().indexOf(`.${extension}`) !== -1
      );
    }
  }) || {};

  return _.get(itemInfo, 'name');
}

export default class Sermon extends Component {
  constructor(props) {
    super(props);
    this.player = null;
    this.state = {
      slides: [],
      isLoading: false,
      isPlaying: false,
      error: false
    }
  }
  handlePress = () => {
    const { isLoading, isPlaying } = this.state;
    const { title, category, grouptag, sermon } = this.props;
    const player = this.player;

    if (isLoading) {
      return;
    }

    if (player && isPlaying) {
      this.setState({isPlaying: false});
      player.pause();
      return;
    }

    if (player && !isPlaying) {
      this.setState({isPlaying: true});
      player.play();
      return;
    }

    const fileName = getFileNameByExtension(sermon.items, 'mp3');
    const url = `http://media.efcsydney.org/data/file/sermon/${category}/${grouptag}/${fileName}`;

    this.player = new Player(url);
    this.setState({isLoading: true});

    this.player.prepare(() => {
      this.setState({
        isLoading: false,
        isPlaying: true
      });
      this.player.play();
    });
  }
  componentDidMount() {
    const {
      title,
      sermon,
      category,
      grouptag
    } = this.props;

    if (!sermon.items || !sermon.items.length) {
      return;
    }

    const slideName = getFileNameByExtension(sermon.items, 'pdf', true);

    getSermonSlides(category, grouptag, slideName).then((data) => {
      const rootPath = 'http://media.efcsydney.org/data/thumb/960x960/sermon';
      const images = _.map(data.items, item => {
        return `${rootPath}/${category}/${grouptag}/${slideName}/${item.grouptag}`;
      });

      this.setState({'slides': images});
    });
  }
  render() {
    const {title, sermon} = this.props;
    const speaker = decode(sermon.dirinfo.Speaker);
    const infoMediaStyle = StyleSheet.create({
      overwrite: {
        backgroundColor: getColor(speaker)
      }
    });

    console.log(this.state.slides);

    return (
      <View style={styles.container}>
        <View style={styles.info}>
          <View style={[styles.infoMedia, infoMediaStyle.overwrite]}>
            <Text style={styles.infoAvatar}>{speaker.charAt(0)}</Text>
          </View>
          <View style={styles.infoBody}>
            <Text style={styles.infoSpeaker}>{speaker}</Text>
            <Text style={styles.infoDate}>{decode(sermon.dirinfo.date)}</Text>
          </View>
        </View>
        <View style={styles.title}>
          <Text style={styles.titleText}>{title}</Text>
          <Text style={styles.titleScript}>{decode(sermon.dirinfo.Scripture)}</Text>
        </View>
        <TouchableHighlight
          style={styles.audio}
          onPress={this.handlePress}
          underlayColor="#88d4f5">
          <View>
            {(!this.state.isPlaying && !this.state.isLoading) && (
            <View style={styles.audioIcon}>
              <Icon
                name="play"
                size={15}
                style={{marginRight: 5}}
                color="#333"/>
              <Text>Play Audio</Text>
            </View>
            )}
            {(this.state.isLoading) && (
            <View style={styles.audioIcon}>
              <ActivityIndicator
                color="#333"
                style={{marginRight: 5}}
                animating={true}
                size="small"/>
              <Text>Loading Audio...</Text>
            </View>
            )}
            {(this.state.isPlaying) && (
            <View style={styles.audioIcon}>
              <Icon
                name="pause"
                size={15}
                style={{marginRight: 5}}
                color="#333"/>
              <Text>Pause Audio</Text>
            </View>
            )}
          </View>
        </TouchableHighlight>
        <Swiper
          height={200} horizontal={true}
          style={styles.sliders}
          loop
          showsButtons>
          {this.state.slides.map(slide => (
          <View style={styles.slide}>
            <Image
              source={{uri: slide}}
              key={slide}
              style={{flex: 1, width: 350, height: 200}}
              resizeMode='stretch'/>
          </View>
          ))}
        </Swiper>
      </View>
    );
  }
}

var styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    backgroundColor: '#eee',
    marginTop: 65,
  },
  // Info
  info: {
    alignItems: 'flex-start',
    display: 'flex',
    flexDirection: 'row',
    paddingTop: 10,
    paddingLeft: 10,
    marginBottom: 10,
  },
  infoMedia: {
    alignItems: 'center',
    alignContent: 'center',
    backgroundColor: '#ccc',
    borderRadius: 30,
    display: 'flex',
    flexDirection: 'column',
    height: 30,
    marginRight: 5,
    padding: 4,
    width: 30,
  },
  infoAvatar: {
    color: '#fff',
    fontWeight: 'bold',
    marginTop: 2,
  },
  infoBody: {
    flex: 1,
  },
  infoSpeaker: {
    color: '#666',
    fontSize: 11,
  },
  infoDate: {
    color: '#666',
    fontSize: 11,
  },
  // Title
  title: {
    paddingLeft: 10,
    paddingRight: 10,
    marginBottom: 10,
  },
  titleText: {
    lineHeight: 24,
    fontWeight: '700',
    fontSize: 22,
  },
  titleScript: {
    fontSize: 11,
  },
  // Audio
  audio: {
    backgroundColor: '#fff',
    borderColor: '#d4d4d4',
    borderWidth: 1,
    borderStyle: 'solid',
    borderRadius: 6,
    padding: 10,
    marginLeft: 10,
    marginRight: 10,
    marginBottom: 10,
  },
  audioIcon: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center'
  },
  // Slide
  slides: {
  },
  slide: {
    backgroundColor: '#000',
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
