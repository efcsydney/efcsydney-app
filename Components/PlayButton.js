import React from 'react';
import {
  ActivityIndicator,
  StyleSheet,
  TouchableHighlight,
  View
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';

export default ({ isLoading, isPlaying, onPress }) => {
  return (
    <TouchableHighlight
      style={styles.wrapper}
      onPress={onPress}
      underlayColor="#007eba">
      <View>
        {!isPlaying && !isLoading && <Icon name="play" style={styles.icon} />}
        {isLoading &&
          <ActivityIndicator color="#fff" animating={true} size="small" />}
        {isPlaying && <Icon name="pause" style={styles.icon} />}
      </View>
    </TouchableHighlight>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    alignItems: 'center',
    backgroundColor: '#008cc9',
    borderRadius: 25,
    display: 'flex',
    height: 40,
    justifyContent: 'center',
    width: 40
  },
  icon: {
    color: '#fff',
    fontSize: 18
  }
});
