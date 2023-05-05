import React,{useEffect}from 'react';
import {
  View,
  Text,
  SafeAreaView,
  Keyboard,
  ScrollView,
  Alert,
} from 'react-native';
import { trashRequest } from "../services/user.api";

import COLORS from '../theme/colors';
import Button from '../components/Button';
import Input from '../components/Input';
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function ScanDetailsScreen() {
    const [inputs, setInputs] = React.useState({
        requestType: 'public',
        latitude: 'jeqohfuiehfhe',
        longitude: 'fejofoqhofqa',
        description: '',
        imgUrl: 'ncoqwjoijciwq',
        status:'pending',
        dustbinId:'2',
        userId:'222',
      });
      const [errors, setErrors] = React.useState({});
      const [loading, setLoading] = React.useState(false);

      const handleSubmit =async ()=>{
        const [error,requestData] = await trashRequest(inputs);
        // console.log(error,"error")
        console.log(requestData);
        if(requestData){
          // if (requestData.data.code === 200) {
          //   console.log('hsr');
          //   navigation.navigate('Home');
          // }
          // else {
          //   alert('Error', 'User does not exist');
          // }
        }
        else {
          alert('Errorrrrrrrrrrr', 'User does not exist');
        }
      }

      useEffect(() => {
        AsyncStorage.getItem("user").then((value) => {
            if (value === null) {

            } else {
            setInputs(prevState => ({...prevState, userId: value.id}));
            }
          });
      }, [])
      
      const handleOnchange = (text, input) => {
        setInputs(prevState => ({...prevState, [input]: text}));
      };
      const handleError = (error, input) => {
        setErrors(prevState => ({...prevState, [input]: error}));
      };
  return (
    <SafeAreaView style={{backgroundColor: COLORS.white, flex: 1}}>
      {/* <Loader visible={loading} /> */}
      <ScrollView
        contentContainerStyle={{paddingTop: 50, paddingHorizontal: 20}}>
        <Text style={{color: COLORS.black, fontSize: 40, fontWeight: 'bold'}}>
          Request
        </Text>
        <Text style={{color: COLORS.grey, fontSize: 18, marginVertical: 10}}>
          Enter the following details
        </Text>
        <View style={{marginVertical: 20}}>
          <Input
            onChangeText={text => handleOnchange(text, 'Public')}
            onFocus={() => handleError(null, 'Public')}
            iconName="email-outline"
            label="Request"
            placeholder="Public"
            error={errors.public}
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
            onChangeText={text => handleOnchange(text, 'description')}
            onFocus={() => handleError(null, 'description')}
            iconName="account-outline"
            label="description"
            placeholder=""
            error={errors.description}
          />
          <Button title="Submit" onPress={handleSubmit}/>
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}