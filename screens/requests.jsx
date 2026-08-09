import { View, Text, ActivityIndicator, FlatList, TouchableOpacity } from 'react-native'
import React from 'react'

import useGlobal from '../core/gobal'
import Empty from '../components/Empty'
import Thumbnail from '../components/Thumbnail'
import Cell from "../components/Cell"
import { SafeAreaView } from 'react-native-safe-area-context'

function RequestAccept({item}){
  const requestAccept = useGlobal(state=>state.requestAccept)
  return(
    <TouchableOpacity style={{backgroundColor:'#202020',
      height:36,borderRadius:18,paddingHorizontal:14,
      alignItems:'center',justifyContent:'center'
    }}
    onPress={()=>requestAccept(item.sender.username)}> 
      <Text style={{color:'white',fontWeight:'bold'}}>
        Accept
      </Text>

    </TouchableOpacity>

  )
}


function RequestRow({ item }) {
  const message = "requested to connect with you at : "
  const time = '7 am'
  return (
    <Cell>
      <Thumbnail url={item.sender.thumbnail} size={76} />
      <View style={{ flex: 1, paddingHorizontal: 16 }}>
        <Text style={{
          fontWeight: 'bold',
          color: '#202020',
          marginBottom: 4,

        }}>{item.sender.name}

        </Text>
        <Text style={{
          color: '#606060',

        }}>{item.sender.username}

        </Text>
        <Text style={{
          color: '#606060',

        }}>{message}<Text style={{ fontSize: 13, color: '#909090' }}>{time}</Text>
        </Text>

      </View>
      <RequestAccept item={item}/>
    </Cell>
  )
}
export default function Requests() {
  const requestList = useGlobal(state => state.requestList)

  if (requestList === null) {
    return (
      <ActivityIndicator style={{ flex: 1 }}
        size='large' />
    )
  }
  if (requestList.length === 0) {
    return (
      <Empty icon='file-tray-outline' message="no request yet" />
    )
  }
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={{ flex: 1 }}>
        <FlatList
          data={requestList}
          renderItem={({ item }) => (
            <RequestRow item={item} />

          )}
          keyExtractor={item => item.sender.username}>

        </FlatList>
      </View>
    </SafeAreaView>
  )
}