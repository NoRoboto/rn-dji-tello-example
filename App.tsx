import React, {useRef, useState} from 'react';
import {
  Button,
  Image,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import Tello from 'rn-dji-tello';

const App = () => {
  const [init, setInit] = useState<boolean>(false);
  const drone = useRef<Tello>();

  const onInit = () => {
    try {
      drone.current = new Tello();

      drone.current.on('connection', () => {
        setInit(true);
        console.log('Connected to drone');
      });

      drone.current.on('state', state => {
        console.log('Received State > ', state);
      });

      drone.current.on('send', (err, length) => {
        if (err) {
          console.log('error', err);
        }

        console.log(`Sent command is ${length} long`);
      });

      drone.current.on('message', message => {
        console.log('Recieved Message > ', message);
      });
    } catch (error) {
      console.error(error);
      setInit(false);
    }
  };

  const run = async () => {
    await drone.current?.send('takeoff');
    await drone.current?.send('battery?');
    await drone.current?.send('land');
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" />
      <Text style={styles.text}>RN-DJI-TELLO TEST</Text>
      <Image
        style={styles.image}
        resizeMode="contain"
        source={require('./assets/drone.png')}
      />
      <View style={styles.buttonsWrapper}>
        <Button title="Run" disabled={!init} onPress={run} />
        <View style={styles.separator} />
        <Button title="Init" disabled={init} onPress={onInit} />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    fontSize: 30,
    paddingTop: 10,
  },
  buttonsWrapper: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
  },
  separator: {
    width: 20,
  },
  image: {
    width: 300,
    height: 400,
  },
});

export default App;
