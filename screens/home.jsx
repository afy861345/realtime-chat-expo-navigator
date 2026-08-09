import { View, Text, TouchableOpacity, Image } from 'react-native'
import React, { useEffect, useLayoutEffect } from 'react'
import Friends from "./friends";
import Requests from "./requests";
import Profile from "./profile";
import { SafeAreaView } from 'react-native-safe-area-context'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { FontAwesome6, FontAwesome, FontAwesome5 } from '@expo/vector-icons';
import useGlobal from '../core/gobal';
import Thumbnail from '../components/Thumbnail';

const Tab = createBottomTabNavigator();

const Home = ({ navigation }) => {
  const socketConnect = useGlobal(state => state.socketConnect)
  const socketClose = useGlobal(state => state.socketClose)
  const user = useGlobal((state => state.user));
  useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: false
    })
  }, [navigation])
  useEffect(() => {
    socketConnect();
    return () => { socketClose() }
  }, []) //if go to other screen it close
  return (
    <Tab.Navigator screenOptions={({ route, navigation }) => ({
      headerRight: () => (
        <TouchableOpacity onPress={() => navigation.navigate('Search')}>
          <FontAwesome style={{ marginRight: 16 }} name='search' size={20} color='#404040' />
        </TouchableOpacity>
      ),
      headerLeft: () => (
         <View>
          <Thumbnail url={user.thumbnail} size={38}/>
        </View>
      ),
      tabBarIcon: ({ focused, color, size }) => {
        const icons = {
          'Requests': 'user-clock',
          'Friends': 'user-group',
          'Profile': 'user',
        };
        const icon = icons[route.name]
        return (
          <FontAwesome6 name={icon} size={28} color={color} />
        )
      },
      tabBarActiveTintColor: '#202020',
      tabBarShowLabel: false
    })}>
      <Tab.Screen name='Friends' component={Friends} />
      <Tab.Screen name='Requests' component={Requests} />
      <Tab.Screen name='Profile' component={Profile} />
    </Tab.Navigator>
  )
}

export default Home