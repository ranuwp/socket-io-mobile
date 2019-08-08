/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, { Fragment, PureComponent } from 'react';
import {
  SafeAreaView,
  StyleSheet,
  ScrollView,
  View,
  Text,
  StatusBar,
  Button,
  TextInput,
  Platform,
} from 'react-native';
import SocketIOClient from 'socket.io-client';
import {
  Header,
  LearnMoreLinks,
  Colors,
  DebugInstructions,
  ReloadInstructions,
} from 'react-native/Libraries/NewAppScreen';

export default class App extends PureComponent {
  constructor (props) {
    super(props);
    this.state = {
      value: '',
      text: '',
    };
    this.socket = SocketIOClient(`http://${Platform.OS === 'ios' ? 'localhost' : '10.0.2.2'}:8000`);
    this.socket.on('connect', () => {
      console.log('connected to server');
    });
    this.socket.on('event', (data => {
      console.log('Event', data);
    }));
    // Listens to channel2 and display the data recieved
    this.socket.on('channel1', (data) => {
      console.log('Data recieved from server', data); //this will console 'channel 2'
      this.setState({value: data});
    });
  }

  componentWillUnmount () {
    this.socket && this.disconnectSocket();
  }

  disconnectSocket = () => {
    this.socket.disconnect();
    console.log('disconnected from server')
  };

  updateStream = () => {
    const { text } = this.state;
    this.socket.emit('channel1', text, (data) => {
      console.log('Hasil', data);
    });
  };

  updateText = (text) => {
    this.setState({
      text,
    });
  };

  render () {
    return (
      <Fragment>
        <StatusBar barStyle="dark-content" />
        <SafeAreaView>
          <ScrollView
            contentInsetAdjustmentBehavior="automatic"
            style={styles.scrollView}>
            <Header />
            {global.HermesInternal == null ? null : (
              <View style={styles.engine}>
                <Text style={styles.footer}>Engine: Hermes</Text>
              </View>
            )}
            <View style={styles.body}>
              <View style={styles.sectionContainer}>
                <Text style={styles.sectionTitle}>Step One</Text>
                <Text style={styles.sectionDescription}>
                  Edit <Text style={styles.highlight}>App.js</Text> to change this
                  screen and then come back to see your edits.
                </Text>
              </View>
              <View style={styles.sectionContainer}>
                <Text style={styles.sectionTitle}>See Your Changes</Text>
                <Text style={styles.sectionDescription}>
                  <ReloadInstructions />
                </Text>
              </View>
              <View style={styles.sectionContainer}>
                <Text style={styles.sectionTitle}>Debug</Text>
                <Text style={styles.sectionDescription}>
                  <DebugInstructions />
                </Text>
              </View>
              <View style={styles.sectionContainer}>
                <Text style={styles.sectionTitle}>Learn More</Text>
                <Text style={styles.sectionDescription}>
                  Read the docs to discover what to do next:
                </Text>
                <Text style={styles.sectionTitle}>Kenyoy {this.state.value}</Text>
                <TextInput placeholder='Masukin' onChangeText={this.updateText} />
                <Button title='HILIH' onPress={this.updateStream} />
              </View>
              <LearnMoreLinks />
            </View>
          </ScrollView>
        </SafeAreaView>
      </Fragment>
    );
  }
}

const styles = StyleSheet.create({
  scrollView: {
    backgroundColor: Colors.lighter,
  },
  engine: {
    position: 'absolute',
    right: 0,
  },
  body: {
    backgroundColor: Colors.white,
  },
  sectionContainer: {
    marginTop: 32,
    paddingHorizontal: 24,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '600',
    color: Colors.black,
  },
  sectionDescription: {
    marginTop: 8,
    fontSize: 18,
    fontWeight: '400',
    color: Colors.dark,
  },
  highlight: {
    fontWeight: '700',
  },
  footer: {
    color: Colors.dark,
    fontSize: 12,
    fontWeight: '600',
    padding: 4,
    paddingRight: 12,
    textAlign: 'right',
  },
});
