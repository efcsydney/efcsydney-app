import React, { Component, PropTypes } from 'react';
import { View, StyleSheet, Text } from 'react-native';
import Sound from 'react-native-sound';
import PlayButton from './PlayButton';
import { formatTime } from '../utils/helper.js';

Sound.setCategory('Playback');

export default class InlinePlayer extends Component {
  static propTypes = {
    url: PropTypes.string.isRequired
  };
  constructor(props) {
    super(props);
    this.player = null;
    this.timer = null;
    this.state = {
      currentTime: 0,
      duration: 0,
      isLoading: false,
      isPlaying: false,
      isReady: false,
      error: false
    };
  }
  componentWillUnmount() {
    const player = this.player;

    if (player) {
      player.release();
    }

    if (this.timer) {
      clearInterval(this.timer);
    }
  }
  handleEnd = () => {
    this.player.stop();
    clearInterval(this.timer);
    this.setState({
      currentTime: 0,
      isPlaying: false
    });
  }
  handlePress = items => {
    const { isLoading, isPlaying, isReady } = this.state;
    const { url } = this.props;
    let player = this.player;

    if (isLoading) return;

    // 1. Init
    if (!isReady) {
      this.preparePlayer(url).then(player => this.play(), error => console.log(error));
      return;
    }
    // 2. Ready/Pause -> Play
    if (isReady && !isPlaying) {
      this.play();
      return;
    }
    // 3. Play -> Pause
    if (player && isPlaying) {
      this.setState({ isPlaying: false });
      clearInterval(this.timer);
      player.pause();
      return;
    }
  };
  play() {
    const player = this.player;
    player.play(this.handleEnd);
    this.setState({ isPlaying: true });
    this.timer = setInterval(() => {
      player.getCurrentTime(sec => this.setState({ currentTime: sec }));
    }, 1000);
  }
  preparePlayer(url) {
    this.setState({ isLoading: true });
    return new Promise((resolve, reject) => {
      this.player = new Sound(url, '', error => {
        if (error) {
          this.setState({ isLoading: false });
          reject(error);
          return;
        }
        this.setState({
          duration: this.player.getDuration(),
          isLoading: false,
          isReady: true
        });
        resolve(this.player);
      });
    });
  }
  render() {
    const { currentTime, duration, isLoading, isPlaying, isReady } = this.state;

    return (
      <View style={styles.wrapper}>
        <PlayButton isLoading={isLoading} isPlaying={isPlaying} onPress={this.handlePress} />
        <Text style={styles.info}>
          {formatTime(currentTime)} / {formatTime(duration)}
        </Text>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  wrapper: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 75
  },
  info: {
    color: '#666',
    fontSize: 10,
    marginTop: 4,
    textAlign: 'center'
  }
});
