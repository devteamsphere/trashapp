import React from "react";
import { View, Text, TouchableOpacity, StyleSheet, Button } from "react-native";

const Card = ({ pickUpTitle, pickUpAddress, pickUpTime, onPress }) => {
  return (
    <View style={styles.cardContent}>
      <Text style={styles.pickUpTitle}>{pickUpTitle}</Text>
      <Text style={styles.pickUpAddress}>{pickUpAddress}</Text>
      <View style={styles.row}>
        <Text style={styles.pickUpTime}>{pickUpTime}</Text>
        <TouchableOpacity onPress={onPress} style={styles.roundButton}>
          <Text style={styles.text}>Go</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  cardContainer: {
    backgroundColor: "#FFF",
    borderRadius: 8,
    marginBottom: 16,
    elevation: 2,
  },
  cardContent: {
    padding: 16,
    marginTop: 16,
    backgroundColor: "#FFF",
    width: "100%",
  },
  pickUpTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 8,
  },
  pickUpAddress: {
    fontSize: 14,
    marginBottom: 8,
  },
  pickUpTime: {
    fontSize: 12,
    color: "#888",
  },
  roundButton: {
    width: 50,
    height: 50,
    justifyContent: "center",
    alignItems: "center",
    padding: 5,
    borderRadius: 100,
    backgroundColor: "#228B22",
  },
  text: {
    color: "#fff",
  },
});

export default Card;
