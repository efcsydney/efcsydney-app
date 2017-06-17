import React, { Component, PropTypes } from 'react';
import { Player } from 'react-native-audio-toolkit';
import PlayButton from './PlayButton';

export default class InlinePlayer extends Component {
  static propTypes = {
    url: PropTypes.string.isRequired
  };
  constructor(props) {
    super(props);
    this.player = null;
    this.state = {
      isLoading: false,
      isPlaying: false,
      error: false
    };
  }
  componentWillUnmount() {
    if (this.player) {
      console.log('componentDidMount');
      this.player.destroy();
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
        isLoading: false,
        isPlaying: true
      });
      this.player.play();
    });

    this.setState({ isLoading: true });
  };
  render() {
    const { isLoading, isPlaying } = this.state;

    return (
      <PlayButton
        isLoading={isLoading}
        isPlaying={isPlaying}
        onPress={this.handlePress}
      />
    );
  }
}
