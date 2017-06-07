import React, { Component } from 'react';
import {
  View,
	Image,
  Text,
  TextInput,
  TouchableHighlight,
  ActivityIndicator,
  StyleSheet
} from 'react-native';
import Categories from './Categories';
import {getCategories} from '../Utils/api';
import SVGImage from 'react-native-svg-image';

export default class Main extends Component {
  componentWillMount() {
    this.props.navigator.navigationBarHidden = false;
  }
  componentDidMount() {
    getCategories().then((data) => {
      this.props.navigator.replace({
        title: 'Categories',
        component: Categories,
        passProps: {categories: data},
      });
    });
  }
  render() {
    return (
				<View style={styles.container}>
					<View style={styles.logoWrapper}>
						<Image
							style={styles.logo}
							source={require('./logo.png')}/>
					</View>
					<View style={{flex: 2, marginLeft: -15}}>
						<Text style={styles.welcome}>
							Sermons
						</Text>
						<Text style={styles.instructions}>
								Evangelical Formosan Church of Sydney
						</Text>
					</View>
				</View>
    );
  }
}


const styles = StyleSheet.create({
  container: {
		backgroundColor: 'red',
    flex: 1,
		flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#efefef',
  },
  welcome: {
    fontSize: 32,
    fontWeight: '700',
		marginBottom: 5,
  },
	logoWrapper: {
		flex: 1,
		width: 70,
		height: 60,
		alignItems: 'center'
	},
	logo: {
		width: 70,
		height: 60,
	},
  instructions: {
    fontSize: 10,
    fontStyle: 'italic',
    color: '#999999',
		marginLeft: 3,
  }
});
