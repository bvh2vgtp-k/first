import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import StartScreen from './Start';
import LoginScreen from './LoginScreen';
import VerificationCodeScreen from './VerificationCodeScreen';
import MapScreen from './MapScreen';
import ApartmentDetailScreen from './ApartmentDetailScreen';
import BookingScreen from './BookingScreen';

const Stack = createNativeStackNavigator();

const App = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator 
        initialRouteName="Start"
        screenOptions={{
          headerShown: false,
          animation: 'fade',
        }}
      >
        <Stack.Screen name="Start" component={StartScreen} />
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen 
          name="VerificationCode" 
          component={VerificationCodeScreen}
          options={{ gestureEnabled: false }}
        />
        <Stack.Screen 
          name="MapScreen" 
          component={MapScreen}
          options={{ 
            gestureEnabled: false,
            animation: 'none' 
          }}
        />
        <Stack.Screen 
          name="ApartmentDetail" 
          component={ApartmentDetailScreen}
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen 
          name="Booking" 
          component={BookingScreen}
          options={{
            headerShown: false,
            animation: 'slide_from_bottom',
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
