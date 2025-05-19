import React from 'react';
import {StatusBar, SafeAreaView, useColorScheme} from 'react-native';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';

// Screens
import MenuScreen from './screens/MenuScreen';
import OrderSummaryScreen from './screens/OrderSummaryScreen';
import PaymentConfirmationScreen from './screens/PaymentConfirmationScreen';

// Define the stack navigator params
type RootStackParamList = {
  Menu: undefined;
  OrderSummary: {cartItems: any};
  PaymentConfirmation: {orderId: number; paymentResult: any};
};

const Stack = createStackNavigator<RootStackParamList>();

function App(): JSX.Element {
  const isDarkMode = useColorScheme() === 'dark';

  return (
    <SafeAreaView style={{flex: 1}}>
      <StatusBar
        barStyle={isDarkMode ? 'light-content' : 'dark-content'}
        backgroundColor={'transparent'}
        translucent
      />
      <NavigationContainer>
        <Stack.Navigator
          initialRouteName="Menu"
          screenOptions={{
            headerShown: false,
          }}>
          <Stack.Screen name="Menu" component={MenuScreen} />
          <Stack.Screen name="OrderSummary" component={OrderSummaryScreen} />
          <Stack.Screen
            name="PaymentConfirmation"
            component={PaymentConfirmationScreen}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </SafeAreaView>
  );
}

export default App;
