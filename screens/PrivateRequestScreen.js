import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  SafeAreaView,
  Keyboard,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  StyleSheet
} from 'react-native';
import { trashRequest } from "../services/user.api";
import Modal from "react-native-modal";
import { payment } from "../services/user.api";

import Ionicons from "@expo/vector-icons/Ionicons";
import Toast from 'react-native-toast-message';
import COLORS from '../theme/colors';
import Button from '../components/Button';
import Input from '../components/Input';
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Location from "expo-location";
import { useFonts } from 'expo-font';
import NSLight from '../assets/fonts/NunitoSans_7pt-Light.ttf';
import NSRegular from '../assets/fonts/NunitoSans_7pt-Regular.ttf';
import NSBold from '../assets/fonts/NunitoSans_7pt-Bold.ttf';
import NSExtraBold from '../assets/fonts/NunitoSans_7pt-ExtraBold.ttf';
export default function PrivateRequestScreen({ navigation }) {
  const [inputs, setInputs] = React.useState({
    requestType: 'personal',
    latitude: '',
    longitude: '',
    description: '',
    address: '',
    imgUrl: 'ncoqwjoijciwq',
    status: 'pending',
    dustbinId: '5999999',
    userId: '',
  });
  const [errors, setErrors] = React.useState({});
  const [loading, setLoading] = React.useState(false);
  const [status, setStatus] = useState(false);
  const [errorMsg, setErrorMsg] = useState(null);
  const [isModalVisible, setModalVisible] = useState(false);
  const [loaded] = useFonts({
    NSLight,
    NSRegular,
    NSBold,
    NSExtraBold,
  });
  const toggleModal = () => {
    setModalVisible(!isModalVisible);
  };

  const handleSubmit = async () => {
    console.log(inputs);
    const [error, requestData] = await trashRequest(inputs);
    console.log(error, "error")
    console.log(requestData);
    if (requestData) {
      navigation.navigate('Home');
    }
    else {
      alert(error, 'User does not exist');
    }
  }
  const handlePayment = async () => {
    const requestData = await payment(inputs.userId,50);
    console.log(requestData);
    if (requestData) {
    }
    else {
      alert( 'payment failed');
    }
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      Toast.show({
        type: "success",
        text1: "Payment Successful",
        text2: "₹50 paid to driver",
        position: "top",
  
      })
      setModalVisible(!isModalVisible);
      setStatus(true);
    
    }, 4000);

  }


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
      console.log(location);
      // setLocation(location);
      setInputs(prevState => ({ ...prevState, latitude: `${location.coords.latitude}` }));
      setInputs(prevState => ({ ...prevState, longitude: `${location.coords.longitude}` }));

    })();
    AsyncStorage.getItem("user").then((value) => {
      if (value === null) {

      } else {
        setInputs(prevState => ({ ...prevState, userId: JSON.parse(value)._id }));
      }
    });
  }, [])

  const handleOnchange = (text, input) => {
    setInputs(prevState => ({ ...prevState, [input]: text }));
  };
  const handleError = (error, input) => {
    setErrors(prevState => ({ ...prevState, [input]: error }));
  };
  return (
    <SafeAreaView style={{ backgroundColor: COLORS.white, flex: 1 }}>
      {/* <Loader visible={loading} /> */}
      <ScrollView
        contentContainerStyle={{ paddingTop: 50, paddingHorizontal: 20 }}>
        <Text style={{ color: COLORS.black, fontSize: 40, fontWeight: 'bold' }}>
          Request
        </Text>
        <Text style={{ color: COLORS.grey, fontSize: 18, marginVertical: 10 }}>
          Please fill the following details
        </Text>
        <View style={{ marginVertical: 20 }}>
          <Input
            onChangeText={text => handleOnchange(text, 'personal')}
            onFocus={() => handleError(null, 'personal')}
            iconName="email-outline"
            label="Request"
            placeholder="personal"
            error={errors.requestType}
            editable={false}
          // selectTextOnFocus={false}
          />
          <Input
            onChangeText={text => handleOnchange(text, 'pending')}
            onFocus={() => handleError(null, 'pending')}
            iconName="email-outline"
            label="Status"
            placeholder="Pending"
            error={errors.status}
            editable={false}
          // selectTextOnFocus={false}
          />
          <Input
            onChangeText={text => handleOnchange(text, 'address')}
            onFocus={() => handleError(null, 'address')}
            iconName="account-outline"
            label="address"
            placeholder=""
            error={errors.address}
          />

          <Input
            onChangeText={text => handleOnchange(text, 'description')}
            onFocus={() => handleError(null, 'description')}
            iconName="account-outline"
            label="description"
            placeholder=""
            error={errors.description}
          />
          <View
            style={{
              backgroundColor: '#fff',
              borderRadius: 10,
              marginHorizontal: 10,
              shadowColor: '#000',
              shadowOffset: {
                width: 0,
                height: 2,
              },
              shadowOpacity: 0.25,
              shadowRadius: 3.84,
              elevation: 5,
              padding: 14,
              justifyContent: 'space-between',
            }}
          >

            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <View style={{ flex: 1 }}>
                <Text style={{ fontFamily: 'NSRegular', fontSize: 16 }}>
                  Amount
                </Text>
                <Text style={{ fontFamily: 'NSBold', fontSize: 30 }}>₹505</Text>
              </View>
              <View style={{ flexDirection: 'row' }}>

                {!status?<TouchableOpacity
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    backgroundColor: '#333',
                    marginLeft: 10,
                    paddingLeft: 4,
                    paddingRight: 10,
                    paddingVertical: 4,
                    borderRadius: 4,
                  }}
                  onPress={toggleModal}
                >
                  {/* <Icon name='arrow-down-left' size='20' color='#fff' /> */}
                  <Text
                    style={{
                      color: '#fff',
                      fontFamily: 'NSExtraBold',
                      fontSize: 16,
                      marginLeft: 4,
                    }}
                  >
                    Pay
                  </Text> 

                </TouchableOpacity>:<Text>Successful</Text>}
              </View>
            </View>
          </View>
          {!status ? <Text style={{ marginVertical: "10%",marginLeft:"27%",fontFamily:"NSExtraBold"}}>Please make payment</Text>:
          <Button title="Submit" onPress={handleSubmit} />}
          <View style={{ marginVertical: "10%" }}>

          </View>
        </View>
      </ScrollView>
      <Toast />
      <Modal
        onBackdropPress={() => setModalVisible(false)}
        onBackButtonPress={() => setModalVisible(false)}
        isVisible={isModalVisible}
        swipeDirection="down"
        onSwipeComplete={toggleModal}
        animationIn="bounceInUp"
        animationOut="bounceOutDown"
        animationInTiming={900}
        animationOutTiming={500}
        backdropTransitionInTiming={1000}
        backdropTransitionOutTiming={500}
        style={styles.modal}
      >
        <View style={styles.modalContent}>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <View
              style={{
                backgroundColor: '#fff',
                marginTop: 0,
                flex: 1,
                flexDirection: 'row',
                alignItems: 'center',
                borderRadius: 5,
                marginBottom: 10,
                marginHorizontal: 0,
                shadowColor: '#000',
                shadowOffset: {
                  width: 0,
                  height: 2,
                },
                shadowOpacity: 0.25,
                shadowRadius: 3.84,
                elevation: 5,
                padding: 14,
                justifyContent: 'space-between',
              }}
            >
              <Ionicons name="wallet-outline" size={24} color="black" /><Text style={{ fontFamily: "NSBold", fontSize: 16 }}>
                500</Text></View>
            <View style={{ width: 150, marginLeft: 100 }}>
              <TouchableOpacity
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: "center",
                  backgroundColor: '#00A86B',
                  marginLeft: 10,
                  paddingLeft: 4,
                  paddingRight: 10,
                  paddingVertical: 4,
                  borderRadius: 4,
                }}
              >
                {/* <Icon name='arrow-down-left' size='20' color='#fff' /> */}
                <Text
                  style={{
                    color: '#fff',
                    fontFamily: 'NSExtraBold',
                    fontSize: 16,
                    marginLeft: 4,
                  }}
                >
                  Add Money
                </Text>
              </TouchableOpacity>
            </View>
          </View>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>

            <View style={{ flex: 0 }}>
              <Text style={{ fontFamily: 'NSRegular', fontSize: 25 }}>
                Pay with your wallet
              </Text>
              <Text style={{ fontFamily: 'NSBold', fontSize: 30 }}>₹50</Text>
            </View>

          </View>
          {!loading ?<TouchableOpacity
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: "center",
              backgroundColor: '#000000',
              marginLeft: 10,
              paddingLeft: 4,
              marginTop: 200,
              paddingRight: 10,
              paddingVertical: 4,
              borderRadius: 4,
            }}
            onPress={handlePayment}
          >
            {/* <Icon name='arrow-down-left' size='20' color='#fff' /> */}
            <Text
              style={{
                color: '#fff',
                fontFamily: 'NSExtraBold',
                fontSize: 26,
              }}
            >
              Pay
            </Text>
          </TouchableOpacity>: <ActivityIndicator size="large" color="#008A6B"   />}
        </View>
      </Modal>
    </SafeAreaView>
  )
}
const styles = StyleSheet.create({
  flexView: {
    flex: 1,
    backgroundColor: "white",
  },
  modal: {
    justifyContent: "flex-end",
    margin: 0,
  },
  modalContent: {
    backgroundColor: "white",
    paddingTop: 12,
    paddingHorizontal: 12,
    borderTopRightRadius: 20,
    borderTopLeftRadius: 20,
    minHeight: 400,
    paddingBottom: 20,
  },
  center: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  barIcon: {
    width: 60,
    height: 5,
    backgroundColor: "#bbb",
    borderRadius: 3,
  },
  text: {
    color: "black",
    fontSize: 24,
    marginTop: 100,
  },
  btnContainer: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    height: 500,
  },
});