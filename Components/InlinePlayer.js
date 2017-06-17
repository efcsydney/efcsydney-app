import React, { Component, PropTypes } from 'react';
import { View, StyleSheet, Text } from 'react-native';
import { Player } from 'react-native-audio-toolkit';
import PlayButton from './PlayButton';
import {formatTime} from '../Utils/helper.js';

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
      error: false
    };
  }
  componentWillUnmount() {
    if (this.player) {
      this.player.destroy();
    }
    if (this.timer) {
      clearInterval(this.timer);
    }
  }
  handlePress = items => {
    const { isLoading, isPlaying } = this.state;
    const { url } = this.props;
    let player = this.player;

    if (isLoading) {
      return;
    }

    // Play -> Pause
    if (player && isPlaying) {
      this.setState({ isPlaying: false });
      player.pause();
      return;
    }

    // Pause -> Play
    if (player && !isPlaying) {
      this.setState({ isPlaying: true });
      player.play();
      return;
    }

    // Initial
    this.player = new Player(url);
    this.player.on('error', () => {
      this.setState({
        isLoading: false
      });
    });
    this.player.on('ended', () => {
      this.setState({
        isPlaying: false
      });
    });
    this.player.prepare(() => {
      this.setState({
        duration: this.player.duration,
        isLoading: false,
        isPlaying: true
      });
      this.player.play();
      this.timer = setInterval(() => {
        this.setState({
          currentTime: this.player.currentTime,
          duration: this.player.duration
        });
      }, 1000);
    });

    this.setState({ isLoading: true });
  };
  render() {
    const { currentTime, duration, isLoading, isPlaying } = this.state;

    return (
      <View style={styles.wrapper}>
        <PlayButton
          isLoading={isLoading}
          isPlaying={isPlaying}
          onPress={this.handlePress}
        />
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
    width: 60
  },
  info: {
    color: '#666',
    fontSize: 10,
    marginTop: 4,
    textAlign: 'center'
  }
});
