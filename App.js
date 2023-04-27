import React from "react";
import {
  Alert,
  Animated,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
import { CurvedBottomBarExpo } from 'react-native-curved-bottom-bar';
import Ionicons from "@expo/vector-icons/Ionicons";
import { NavigationContainer } from "@react-navigation/native";
import RegisterScreen from "./screens/RegisterScreen";
import Home from "./screens/Home.js";
import LoginScreen from "./screens/LoginScreen.js";
import ScanScreen from "./screens/ScanScreen.js";
import { createStackNavigator } from "@react-navigation/stack";
// import { TailwindProvider } from "tailwindcss-react-native";
import OnboardingScreen from "./screens/OnboardingScreen";
import AsyncStorage from "@react-native-async-storage/async-storage";
import ProfileScreen from "./screens/ProfileScreen";

const Stack = createStackNavigator();

const Screen2 = () => {
  return <View style={styles.screen2} />;
};

export default function App() {
  const [firstLaunch, setIsFirstLaunch] = React.useState(false);
  React.useEffect(() => {
    AsyncStorage.getItem("alreadyLaunched").then((value) => {
      if (value === null) {
        AsyncStorage.setItem("alreadyLaunched", "true");
        setIsFirstLaunch(true);
      } else {
        setIsFirstLaunch(false);
      }
    });
  }, []);
  function HomeNav({navigation}) {
    return (
  <CurvedBottomBarExpo.Navigator
  screenOptions={{headerShown: false}}
            type="DOWN"
            style={styles.bottomBar}
            shadowStyle={styles.shawdow}
            height={55}
            circleWidth={25}
            bgColor="#00A86B"
            initialRouteName="Home"
            borderTopLeftRight
            renderCircle={({ selectedTab, navigate }) => (
              <Animated.View style={styles.btnCircleUp}>
                <TouchableOpacity
                  style={styles.button}
                  onPress={() => navigate('ScanScreen')}
                  // component={() => <ScanScreen navigation={navigation} />}
                >
                  <Ionicons name={'qr-code-outline'} color="gray" size={25} />
                </TouchableOpacity>
              </Animated.View>
            )}
            tabBar={renderTabBar}
          >
            <CurvedBottomBarExpo.Screen
              name="title1"
              position="LEFT"
              component={() => <Home navigation={navigation} />}
            />
              <CurvedBottomBarExpo.Screen
              name="title3"
              position="LEFT"
              component={() => <Home navigation={navigation} />}
            />
            <CurvedBottomBarExpo.Screen
              name="title2"
              component={() => <ProfileScreen />}
              position="RIGHT"
            />
                        <CurvedBottomBarExpo.Screen
              name="title4"
              component={() => <Screen2 />}
              position="RIGHT"
            />
          </CurvedBottomBarExpo.Navigator>
    );
  }
  const _renderIcon = (routeName, selectedTab) => {
    let icon = "";

    switch (routeName) {
      case "title1":
        icon = "ios-home-outline";
        break;
      case "title2":
        icon = "cart-outline";
        break;
      case "title3":
        icon = "location-outline";
        break;
      case "title4":
        icon = "settings-outline";
        break;
    }

    return (
      <Ionicons
        name={icon}
        size={25}
        color={routeName === selectedTab ? "black" : "#ddd"}
      />
    );
  };
  const renderTabBar = ({ routeName, selectedTab, navigate }) => {
    return (
      <TouchableOpacity
        onPress={() => navigate(routeName)}
        style={styles.tabbarItem}
      >
        {_renderIcon(routeName, selectedTab)}
      </TouchableOpacity>
    );
  };

  return (
    <NavigationContainer>
      <Stack.Navigator
      initialRouteName="Home"
      >
        {firstLaunch && (
        <Stack.Screen
          options={{ headerShown: false }}
          name="OnBoarding"
          screenOptions={{ headerShown: false }}
          component={OnboardingScreen}
        />
       )}
       
        <Stack.Screen name="RegisterScreen" component={RegisterScreen} />
        <Stack.Screen name="LoginScreen" component={LoginScreen} />
        <Stack.Screen name="Home" component={HomeNav}/>
        <Stack.Screen name="ScanScreen" component={ScanScreen} />
      </Stack.Navigator>

      {/* 
        <CurvedBottomBarExpo.Navigator
          type="DOWN"
          style={styles.bottomBar}
          shadowStyle={styles.shawdow}
          height={55}
          circleWidth={50}
          bgColor="white"
          initialRouteName="title1"
          borderTopLeftRight
          renderCircle={({ selectedTab, navigate }) => (
            <Animated.View style={styles.btnCircleUp}>
              <TouchableOpacity
                style={styles.button}
                onPress={() => Alert.alert('Click Action')}
              >
                <Ionicons name={'apps-sharp'} color="gray" size={25} />
              </TouchableOpacity>
            </Animated.View>
          )}
          tabBar={renderTabBar}
        >
          <CurvedBottomBarExpo.Screen
            name="title1"
            position="LEFT"
            component={() => <Home navigation={navigation} />}
          />
          <CurvedBottomBarExpo.Screen
            name="title2"
            component={() => <Screen2 />}
            position="RIGHT"
          />
        </CurvedBottomBarExpo.Navigator> */}
    </NavigationContainer>
  );
}

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  shawdow: {
    shadowColor: "#DDDDDD",
    shadowOffset: {
      width: 0,
      height: 0,
    },
    shadowOpacity: 1,
    shadowRadius: 5,
  },
  button: {
    flex: 1,
    justifyContent: "center",
  },
  bottomBar: {},
  btnCircleUp: {
    width: 60,
    height: 60,
    borderRadius: 30,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#E8E8E8",
    bottom: 30,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
    elevation: 1,
  },
  imgCircle: {
    width: 30,
    height: 30,
    tintColor: "gray",
  },
  tabbarItem: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  img: {
    width: 30,
    height: 30,
  },
  screen1: {
    flex: 1,
    backgroundColor: "#BFEFFF",
  },
  screen2: {
    flex: 1,
    backgroundColor: "#FFEBCD",
  },
});
