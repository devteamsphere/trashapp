import React,{useEffect, useState} from 'react';
import {View, SafeAreaView, StyleSheet} from 'react-native';
import {
  Avatar,
  Title,
  Caption,
  Text,
  TouchableRipple,
} from 'react-native-paper';
import {Ionicons } from '@expo/vector-icons'; 
// import Share from 'react-native-share';
import AsyncStorage from "@react-native-async-storage/async-storage";
import {getUser} from "../services/user.api"


const ProfileScreen = ({navigation}) => {

//   const myCustomShare = async() => {
//     const shareOptions = {
//       message: 'Order your next meal from FoodFinder App. I\'ve already ordered more than 10 meals on it.',
//       url: files.appLogo,
//       // urls: [files.image1, files.image2]
//     }

//     try {
//       const ShareResponse = await Share.open(shareOptions);
//       console.log(JSON.stringify(ShareResponse));
//     } catch(error) {
//       console.log('Error => ', error);
//     }
//   };
const [data, setData] = useState({});

useEffect(() => {
  const getData = async () => {
    console.log('firstLaunch');
    const id= await AsyncStorage.getItem('user');
    const requestData = await getUser(JSON.parse(id)._id);
    console.log(requestData);
    if (requestData) {
      console.log(requestData);
      setData(requestData.data);
    }
    else {
      alert('User does not exist');
    }
  }
getData();  
}, [])


  return (
    <SafeAreaView style={styles.container}>

      <View style={styles.userInfoSection}>
        <View style={{flexDirection: 'row', marginTop: 15}}>
          <Avatar.Image 
            source={{
              uri: 'https://api.adorable.io/avatars/80/abott@adorable.png',
            }}
            size={80}
          />
          <View style={{marginLeft: 20}}>
            <Title style={[styles.title, {
              marginTop:15,
              marginBottom: 5,
            }]}>{data?data.firstName:null}</Title>
            <Caption style={styles.caption}>_joe</Caption>
          </View>
        </View>
      </View>

      <View style={styles.userInfoSection}>
        <View style={styles.row}>
          <Ionicons name="location" color="#777777" size={20}/>
          <Text style={{color:"#777777", marginLeft: 20}}>{data?data.address:null}</Text>
        </View>
        <View style={styles.row}>
          <Ionicons name="ios-call" color="#777777" size={20}/>
          <Text style={{color:"#777777", marginLeft: 20}}>{data?data.contactNo:null}</Text>
        </View>
        <View style={styles.row}>
          <Ionicons name="mail" color="#777777" size={20}/>
          <Text style={{color:"#777777", marginLeft: 20}}>{data?data.email:null}</Text>
        </View>
      </View>

      <View style={styles.infoBoxWrapper}>
          <View style={[styles.infoBox, {
            borderRightColor: '#dddddd',
            borderRightWidth: 1
          }]}>
            <Title>₹{data?data.credits:null}</Title>
            <Caption>Wallet</Caption>
          </View>
          <View style={styles.infoBox}>
            <Title>{data?data.resolvedRequest:null}</Title>
            <Caption>Orders</Caption>
          </View>
      </View>

      <View style={styles.menuWrapper}>
        <TouchableRipple onPress={() => {}}>
          <View style={styles.menuItem}>
            <Ionicons name="heart" color="#FF6347" size={25}/>
            <Text style={styles.menuItemText}>Your Favorites</Text>
          </View>
        </TouchableRipple>
        <TouchableRipple onPress={() => {}}>
          <View style={styles.menuItem}>
            <Ionicons name="card" color="#FF6347" size={25}/>
            <Text style={styles.menuItemText}>Payment</Text>
          </View>
        </TouchableRipple>
        <TouchableRipple 
        // onPress={myCustomShare}
        >
          <View style={styles.menuItem}>
            <Ionicons name="share" color="#FF6347" size={25}/>
            <Text style={styles.menuItemText}>Tell Your Friends</Text>
          </View>
        </TouchableRipple>
        <TouchableRipple onPress={() => {}}>
          <View style={styles.menuItem}>
            <Ionicons name="help" color="#FF6347" size={25}/>
            <Text style={styles.menuItemText}>Support</Text>
          </View>
        </TouchableRipple>
        <TouchableRipple onPress={() => {}}>
          <View style={styles.menuItem}>
            <Ionicons name="settings" color="#FF6347" size={25}/>
            <Text style={styles.menuItemText}>Settings</Text>
          </View>
        </TouchableRipple>
      </View>
    </SafeAreaView>
  );
};

export default ProfileScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  userInfoSection: {
    paddingHorizontal: 30,
    marginBottom: 25,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  caption: {
    fontSize: 14,
    lineHeight: 14,
    fontWeight: '500',
  },
  row: {
    flexDirection: 'row',
    marginBottom: 10,
  },
  infoBoxWrapper: {
    borderBottomColor: '#dddddd',
    borderBottomWidth: 1,
    borderTopColor: '#dddddd',
    borderTopWidth: 1,
    flexDirection: 'row',
    height: 100,
  },
  infoBox: {
    width: '50%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  menuWrapper: {
    marginTop: 10,
  },
  menuItem: {
    flexDirection: 'row',
    paddingVertical: 15,
    paddingHorizontal: 30,
  },
  menuItemText: {
    color: '#777777',
    marginLeft: 20,
    fontWeight: '600',
    fontSize: 16,
    lineHeight: 26,
  },
});