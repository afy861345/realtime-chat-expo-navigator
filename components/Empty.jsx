import { View, Text } from 'react-native'
import React from 'react'
import { Ionicons } from '@expo/vector-icons';

const Empty = ({icon,message,centered}) => {
  return (
    <View style={{flex:1,
    alignItems:'center',
    paddingVertical:120,justifyContent:centered ?'center':'flex-start'}}>
      <Ionicons name={icon} size={180}
      color='#d0d0d0'
      style={{marginBottom:16}}/>
      <Text style={{color:'#c3c3c3',fontSize:16}}>
        {message}
      </Text>
    </View>
  )
}

export default Empty