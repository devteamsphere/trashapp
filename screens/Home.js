import React from "react";
import { useState, useRef } from "react";
import {
  StyleSheet,
  View,
  TouchableOpacity,
  Text,
  Linking,
  Button,
  SafeAreaView,
  FlatList,
} from "react-native";
import { useEffect } from "react";
import * as Location from "expo-location";
import Card from "../components/Card";

const Home = () => {
  const [location, setLocation] = useState(null);
  const [destination, setDestination] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);

  useEffect(() => {
    (async () => {
      console.log("getting location dhruv");
      let { status } = await Location.requestForegroundPermissionsAsync();
      console.log(status);
      if (status !== "granted") {
        setErrorMsg("Permission to access location was denied");
        console.log(errorMsg);
        return;
      }

      let location = await Location.getCurrentPositionAsync({});
      console.log(`${location.coords.latitude} ${location.coords.longitude}`);
      setLocation(location.coords);
    })();
  }, []);

  let text = "Waiting..";
  if (errorMsg) {
    text = errorMsg;
  } else if (location) {
    text = JSON.stringify(location);
    console.log(text);
  }
  const redirectToUser = (destination) => {
    const redirectToGoogleMaps = (startingPoint, destination) => {
      const baseUrl = "https://www.google.com/maps/dir/?api=1";
      const encodedStartingPoint = encodeURIComponent(startingPoint);
      const encodedDestination = encodeURIComponent(destination);
      const url = `${baseUrl}&origin=${encodedStartingPoint}&destination=${encodedDestination}`;

      Linking.canOpenURL("comgooglemaps://").then((supported) => {
        if (supported) {
          Linking.openURL(
            `comgooglemaps://?saddr=${encodedStartingPoint}&daddr=${encodedDestination}`
          );
        } else {
          Linking.openURL(url);
        }
      });
    };

    // Usage example
    const startingPoint = `${location.latitude},${location.longitude}`;
    // const destination = "peoples mall, bhopal, india";
    redirectToGoogleMaps(startingPoint, destination);
  };

  const DATA = [
    {
      id: "bd7acbea-c1b1-46c2-aed5-3ad53abb28ba",
      title: "First Item",
      destination: "peoples mall, bhopal, india",
    },
    {
      id: "3ac68afc-c605-48d3-a4f8-fbd91aa97f63",
      title: "Second Item",
      destination: "mp nagar , bhoapl, india",
    },
  ];

  return (
    // <View style={styles.container}>
    //   {/* pass props to card */}
    //   <Card
    //     pickUpTitle="UIT RGPV BHOPAL"
    //     pickUpAddress="Public Dustin is full of garbage, please clean it."
    //     pickUpTime="25 mins 30 sec "
    //     onPress={redirectToUser}
    //   />

    //   <Card
    //     pickUpTitle="UIT RGPV BHOPAL"
    //     pickUpAddress="Public Dustin is full of garbage, please clean it."
    //     pickUpTime="25 mins 30 sec "
    //     onPress={redirectToUser}
    //   />
    //   <Card
    //     pickUpTitle="UIT RGPV BHOPAL"
    //     pickUpAddress="Public Dustin is full of garbage, please clean it."
    //     pickUpTime="25 mins 30 sec "
    //     onPress={redirectToUser}
    //   />

    //   <Card
    //     pickUpTitle="UIT RGPV BHOPAL"
    //     pickUpAddress="Public Dustin is full of garbage, please clean it."
    //     pickUpTime="25 mins 30 sec "
    //     onPress={redirectToUser}
    //   />
    // </View>

    <SafeAreaView style={styles.container}>
      <FlatList
        showsHorizontalScrollIndicator={false}
        data={DATA}
        renderItem={({ item }) => (
          <Card
            pickUpTitle="UIT RGPV BHOPAL"
            pickUpAddress="Public Dustin is full of garbage, please clean it."
            pickUpTime="25 mins 30 sec "
            onPress={() => {
              redirectToUser(item.destination);
            }}
          />
        )}
        keyExtractor={(item) => item.id}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "column",
    flex: 1,
    alignItems: "center",
  },
});

module.exports = Home;
