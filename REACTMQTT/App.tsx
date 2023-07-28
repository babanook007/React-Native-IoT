import { StyleSheet, Text, View, Alert, TouchableOpacity} from "react-native";
import React, { useState, useEffect, Component } from "react";
import { createMqttClient } from 'react-native-mqtt-v3';
import base64 from 'base64-js';
import { mqttHost } from "./host";

export default function App() {

  const [mqttClient, setMqttClient] = useState<any>(null);
  const [dataFromMqtt, setDataFromMqtt] = useState<any>(null);

  const [redisPressed, redsetIsPressed] = useState(true);
  const [yellowisPressed, yellowsetIsPressed] = useState(true);
  const [blueisPressed, bluesetIsPressed] = useState(true);
  const [greenisPressed, greensetIsPressed] = useState(true);
  const [purpleisPressed, purplesetIsPressed] = useState(false);
  
  useEffect(() => {
    const setupMqttClient = async () => {
      const client = await createMqttClient({
        clientId: 'rnmqttv31883',
        host: mqttHost,
        port: 1883,
      });
      await client.connect();
      await client.subscribe('RED/#');
      setMqttClient(client);
  
      client.onMessage((message: any) => {
        const topic = message.topic;
        const payload = message.payload;
        if (payload) {
          const payloadString = payload.toString(); // แปลง payload เป็น string
          setDataFromMqtt(payloadString);
          console.log('Data from MQTT:', payloadString); // เปลี่ยน console.log(dataFromMqtt) เป็น console.log('Data from MQTT:', payloadString)
        }
      });
    };
  
    setupMqttClient();
  
    // ลบคำสั่ง return เพื่อให้ subscribe ทำงานตลอดเวลา
  }, []);
  
  const redhandlePublish = async (redtopic: string) => {
    try {
      if (mqttClient) {
        const message = redtopic;
        const uint8Array = new Uint8Array(Array.from(message).map((c) => c.charCodeAt(0)));
        const base64Message = base64.fromByteArray(uint8Array);
        await mqttClient.publish('RED/LED', base64Message);
        console.log('RED:', message);
      }
    } catch (error) {
      console.error('Error while publishing:', error);
    }
  };
  
  const RedhandlePress = () => {
    redsetIsPressed((prevState) => !prevState);
    const redtopic = redisPressed ? 'ON' : 'OFF';
    redhandlePublish(redtopic);
  };

  const redbuttonStyle = {
    backgroundColor: redisPressed ? "transparent" : "red",
    borderColor: redisPressed ? "red" : "transparent",
  };

  const redbuttonText = redisPressed ? "Red Led" : "Red On";

  const yellowHandlePublish = async (yellowTopic: string) => {
    try {
      if (mqttClient) {
        const message = yellowTopic;
        const uint8Array = new Uint8Array(Array.from(message).map((c) => c.charCodeAt(0)));
        const base64Message = base64.fromByteArray(uint8Array);
        await mqttClient.publish('YELLOW/LED', base64Message);
        console.log('YELLOW:', message);
      }
    } catch (error) {
      console.error('Error while publishing:', error);
    }
  };

  const YellowHandlePress = () => {
    yellowsetIsPressed((prevState) => !prevState);
    const yellowTopic = yellowisPressed ? 'ON' : 'OFF';
    yellowHandlePublish(yellowTopic);
  };

  const yellowbuttonStyle = {
    backgroundColor: yellowisPressed ? 'transparent' : '#cc7722',
    borderColor: yellowisPressed ? '#cc7722' : 'transparent',
  };

  const yellowbuttonText = yellowisPressed ? 'Yellow Led' : 'Yellow On';

  const blueHandlePublish = async (blueTopic: string) => {
    try {
      if (mqttClient) {
        const message = blueTopic;
        const uint8Array = new Uint8Array(Array.from(message).map((c) => c.charCodeAt(0)));
        const base64Message = base64.fromByteArray(uint8Array);
        await mqttClient.publish('BLUE/LED', base64Message);
        console.log('BLUE:', message);
      }
    } catch (error) {
      console.error('Error while publishing:', error);
    }
  };
  
  const BlueHandlePress = () => {
    bluesetIsPressed((prevState) => !prevState);
    const blueTopic = blueisPressed ? 'ON' : 'OFF';
    blueHandlePublish(blueTopic);
  };
  
  const bluebuttonStyle = {
    backgroundColor: blueisPressed ? 'transparent' : 'blue',
    borderColor: blueisPressed ? 'blue' : 'transparent',
    // ... other styles
  };
  

  const bluebuttonText = blueisPressed ? 'Blue Led' : 'Blue On';

  const greenHandlePublish = async (greenTopic: string) => {
    try {
      if (mqttClient) {
        const message = greenTopic;
        const uint8Array = new Uint8Array(Array.from(message).map((c) => c.charCodeAt(0)));
        const base64Message = base64.fromByteArray(uint8Array);
        await mqttClient.publish('GREEN/LED', base64Message);
        console.log('GREEN:', message);
      }
    } catch (error) {
      console.error('Error while publishing:', error);
    }
  };
  
  const GreenHandlePress = () => {
    greensetIsPressed((prevState) => !prevState);
    const greenTopic = greenisPressed ? 'ON' : 'OFF';
    greenHandlePublish(greenTopic);
  };
  
  const greenbuttonStyle = {
    backgroundColor: greenisPressed ? 'transparent' : 'green',
    borderColor: greenisPressed ? 'green' : 'transparent',
    // ... other styles
  };
  
  const greenbuttonText = greenisPressed ? 'Green Led' : 'Green On';
  

  const purpleHandlePublish = async (purpleTopic: string) => {
    try {
      if (mqttClient) {
        const message = purpleTopic;
        const uint8Array = new Uint8Array(Array.from(message).map((c) => c.charCodeAt(0)));
        const base64Message = base64.fromByteArray(uint8Array);
        await mqttClient.publish('RELAY/STATUS', base64Message);
        console.log('RELAY:', message);
      }
    } catch (error) {
      console.error('Error while publishing:', error);
    }
  };
  
  const PurpleHandlePress = () => {
    purplesetIsPressed((prevState) => !prevState);
    const purpleTopic = purpleisPressed ? 'ON' : 'OFF';
    purpleHandlePublish(purpleTopic);
  };
  
  const purplebuttonStyle = {
    backgroundColor: purpleisPressed ? 'transparent' : 'purple',
    borderColor: purpleisPressed ? 'purple' : 'transparent',
    // ... other styles
  };

  const purplebuttonText = purpleisPressed ? 'Relay Off' : 'Relay On';

  return (
    <View style={styles.container}>
      <View style={styles.topBox}>
      <TouchableOpacity style={[styles.button1, redbuttonStyle]} onPress={RedhandlePress}>
        <Text style={styles.buttonText}>{redbuttonText}</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={[styles.button2, yellowbuttonStyle]}
        onPress={YellowHandlePress}
      >
        <Text style={styles.buttonText}>{yellowbuttonText}</Text>
      </TouchableOpacity>
      </View>
      <View style={styles.middleBox}>
        <TouchableOpacity
        style={[styles.button3, bluebuttonStyle]}
        onPress={BlueHandlePress}
      >
        <Text style={styles.buttonText}>{bluebuttonText}</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={[styles.button4, greenbuttonStyle]}
        onPress={GreenHandlePress}
      >
        <Text style={styles.buttonText}>{greenbuttonText}</Text>
      </TouchableOpacity>
      </View>
      <View style={styles.bottomBox}>
      <TouchableOpacity
        style={[styles.button5, purplebuttonStyle]}
        onPress={PurpleHandlePress}
      >
        <Text style={styles.buttonText}>{purplebuttonText}</Text>
      </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "black",
    alignItems: "center",
    justifyContent: "center",
    color: "white",
  },

  topBox: {
    flex: 1,
    width: "100%",
    justifyContent: "space-around",
    alignItems: "center",
    flexDirection: "row",
  },

  middleBox: {
    flex: 1,
    width: "100%",
    justifyContent: "space-around",
    alignItems: "center",
    flexDirection: "row",
  },

  bottomBox: {
    flex: 1,
    width: "100%",
    justifyContent: "space-around",
    alignItems: "center",
    flexDirection: "row",
  },

  button1: {
    backgroundColor: "red",
    width: 100, // กำหนดความกว้างเป็น 200
    height: 100, // กำหนดความยาวเป็น 50
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 50,
    borderWidth: 2,
  },
  buttonText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 18,
  },

  button2: {
    backgroundColor: "#cc7722",
    width: 100, // กำหนดความกว้างเป็น 200
    height: 100, // กำหนดความยาวเป็น 50
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 50,
    borderWidth: 2,
  },

  button3: {
    backgroundColor: "blue",
    width: 100, // กำหนดความกว้างเป็น 200
    height: 100, // กำหนดความยาวเป็น 50
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 50,
    borderWidth: 2,
  },

  button4: {
    backgroundColor: "green",
    width: 100, // กำหนดความกว้างเป็น 200
    height: 100, // กำหนดความยาวเป็น 50
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 50,
    borderWidth: 2,
  },

  button5: {
    backgroundColor: "purple",
    width: 100, // กำหนดความกว้างเป็น 200
    height: 100, // กำหนดความยาวเป็น 50
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 50,
    borderWidth: 2,
  },
});
