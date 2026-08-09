import { View, Text, TouchableOpacity, SafeAreaView, TextInput, FlatList } from 'react-native'
import React, { useEffect, useState } from 'react'
import { FontAwesome, Ionicons } from "@expo/vector-icons"
import Empty from '../components/Empty'
import Thumbnail from '../components/Thumbnail'
import useGlobal from '../core/gobal'

function SearchButton({ user }) {
  const requestConnect = useGlobal(state => state.requestConnect)

  if (user.status === 'connected') {
    return (
      <Ionicons style={{ marginRight: 6 }}
        name='checkmark-circle' size={30} color='#20d080' />
    )
  }
  const data = {}
  switch (user.status) {
    case 'not-connected':
      data.text = 'Connect'
      data.disabled = false
      data.onPress = () => {requestConnect(user.username)};
      break
    case 'pending_them':
      data.text = 'Pending'
      data.disabled = false
      data.onPress = () => { }
      break
    case 'pending_me':
      data.text = 'Pending'
      data.disabled = true
      data.onPress = () => { }
      break
    default: break
  }
  return (
    <TouchableOpacity style={{
      backgroundColor: data.disabled ? '#505050' : '#202020',
      alignItems: 'center', justifyContent: 'center',
      paddingHorizontal: 16,
      height: 36, borderRadius: 30
    }}
      disabled={data.disabled} onPress={data.onPress}>
      <Text style={{ color: data.disabled ? '#808080' : 'white' }}>{data.text}</Text>
    </TouchableOpacity>
  )
}
function SearchRow({ user }) {

  return (
    <View style={{
      paddingHorizontal: 20,
      flexDirection: 'row',
      alignItems: 'center',
      borderBottomWidth: 1, borderColor: '#f0f0f0',
      height: 106
    }}>
      <Thumbnail url={user.thumbnail} size={76} />
      <View style={{ flex: 1, paddingHorizontal: 16 }}>
        <Text style={{
          fontWeight: 'bold',
          color: '#202020', marginBottom: 4, marginLeft: 8
        }}>{user.name}</Text>
        <Text style={{
          color: '#606060', marginBottom: 4, marginLeft: 8
        }}>{user.username}</Text>

      </View>
      <SearchButton user={user} />
    </View>
  )
}

export default function Search() {
  const [query, setQuery] = useState("");
  const searchList = useGlobal(state => state.searchList);
  const uploadSearch = useGlobal(state => state.uploadSearch)
  useEffect(() => {
    const seachTimeOut = setTimeout(() => {
      uploadSearch(query)
    }, 400)
    return () => clearTimeout(seachTimeOut)
  }, [query])

  return (
    <SafeAreaView style={{ flex: 1, padding: 20 }}>
      <View style={{
        borderBottomWidth: 3,
        borderColor: '#f0f0f0'
      }}>
        <TextInput style={{
          height: 52,
          backgroundColor: '#e1e2e4',
          borderRadius: 20, padding: 16,
          fontSize: 16,
          paddingLeft: 50
        }}
          value={query} onChangeText={setQuery}
          placeholder='Search user'
          placeholderTextColor='#b0b0b0' />
        <FontAwesome
          style={{
            position: 'absolute',
            top: 17, left: 13
          }}
          name='search' size={20} color='#505050' />
      </View>
      {searchList === null ?
        (<Empty icon='cube-outline'
          message={'search for users'}
          centered={false} />) : searchList.length === 0 ?
          (<Empty icon='person-outline'
            message={"no user found for" + query}
            centered={false} />) : (
            <FlatList
              data={searchList}
              renderItem={({ item }) => (
                <SearchRow user={item} />
              )}
              keyExtractor={item => item.username} />)}
    </SafeAreaView>
  )
}
