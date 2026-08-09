import { View, Text } from 'react-native'
import React from 'react'

export default function Title({text,color,size}) {
  return (
    <View>
      <Text style={{color:color,fontSize:size,fontFamily:'LeckerliOne-Regular'}}>
        {text}
        </Text>
    </View>
  )
}