import React, { useEffect,useState } from 'react';
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
import * as Location from "expo-location";
export default function PrivateRequestScreen({ navigation }) {
    const [inputs, setInputs] = React.useState({
        requestType: 'personal',
        latitude: '',
        longitude:'',
        description: '',
        address: '',
        imgUrl: 'ncoqwjoijciwq',
        status: 'pending',
        dustbinId:'55555',
        userId: '',
    });
    const [errors, setErrors] = React.useState({});
    const [loading, setLoading] = React.useState(false);
    const [location, setLocation] = useState(null);
    const [errorMsg, setErrorMsg] = useState(null);
    const handleSubmit = async () => {
        console.log(inputs);
        const [error, requestData] = await trashRequest(inputs);
        console.log(error,"error")
        console.log(requestData);
        if (requestData) {
            navigation.navigate('Home');
        }
        else {
            alert(error, 'User does not exist');
        }
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
            setLocation(location);
            setInputs(prevState => ({ ...prevState, latitude:`${location.coords.latitude}`}));
        setInputs(prevState => ({ ...prevState, longitude:`${location.coords.longitude}`}));
            
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
        <SafeAreaView style={{ backgroundColor: COLORS.white, flex: 1}}>
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

                    <Button title="Submit" onPress={handleSubmit} />
                    <View style={{marginVertical:"10%"}}>

                    </View>
                </View>
            </ScrollView>
        </SafeAreaView>
    )
}