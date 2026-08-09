import { NavigationContainer, DefaultTheme, ThemeProvider } from "@react-navigation/native";
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import SplashScreen from './screens/splashScreen';
import { useFonts } from "expo-font";
import { useEffect, useState } from 'react';
import SignIn from "./screens/signIn";
import SignUp from "./screens/signUp";
import Home from "./screens/home";
import Search from "./screens/search";
import Messages from "./screens/messages";
import useGlobal from "./core/gobal";
const Stack = createNativeStackNavigator();
const LightTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    background: 'white'
  }
}
export default function App() {
  const initialized = useGlobal(state => state.initialized)
  const isAuthenticated = useGlobal(state => state.isAuthenticated)
  const init = useGlobal(state => state.init)

  useEffect(() => {
    init();
  }, [init]);
  const [fontsLoaded] = useFonts({
    'LeckerliOne-Regular': require('./assets/fonts/LeckerliOne-Regular.ttf'),
  });
  if (!fontsLoaded) {
    return null;
  }

  return (
    <ThemeProvider>
      <NavigationContainer theme={LightTheme}>
        <Stack.Navigator>
          {!initialized ? (
            <>
              <Stack.Screen name='Splash' component={SplashScreen} />
            </>
          ) : !isAuthenticated ? (
            <>
              <Stack.Screen name='SignIn' component={SignIn} />
              <Stack.Screen name='SignUp' component={SignUp} />
            </>
          ) : (
            <>
              <Stack.Screen name='Home' component={Home} />
              <Stack.Screen name='Search' component={Search} />
              <Stack.Screen name='Messages' component={Messages} />
            </>
          )}

        </Stack.Navigator>
      </NavigationContainer>
    </ThemeProvider>
  );
}