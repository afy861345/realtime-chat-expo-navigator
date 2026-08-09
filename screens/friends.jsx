import { View, Text, ActivityIndicator,FlatList, TouchableOpacity } from 'react-native'
import React from 'react'
import useGlobal from '../core/gobal'
import Empty from '../components/Empty'
import Thumbnail from '../components/Thumbnail'
import Cell from '../components/Cell'
import utils from '../utils'

function FriendRow({navigation,item }) {
	return (
		<TouchableOpacity onPress={() => {
			navigation.navigate('Messages', item)
		}}>
      
			<Cell>
				<Thumbnail
					url={item.friend.thumbnail}
					size={76}
				/>
				<View
					style={{
						flex: 1,
						paddingHorizontal: 16
					}}
				>
					<Text
						style={{
							fontWeight: 'bold',
							color: '#202020',
							marginBottom: 4
						}}
					>
						{item.friend.name} <Text style={{fontSize: 18, color: "#505050", fontWeight: 'light'}}>@{item.friend.username}</Text>
					</Text>
					<Text
						style={{
							color: '#606060',
						}}
					>
            
						{item.preview} <Text style={{ color: '#909090', fontSize: 13 }}>
              {utils.formatedTime(item.updated)}
						</Text>
					</Text>
				</View>
			</Cell>
		</TouchableOpacity>
	)
}


export default function Friends({navigation}) {
  const friendList = useGlobal(state => state.friendList)
  // Show loading indicator
	if (friendList === null) {
		return  (
			<ActivityIndicator style={{ flex: 1 }} />
		)
	}
 
	// Show empty if no requests
	if (friendList.length === 0) {
		return (
			<Empty icon='file-tray-outline' message='No messages yet' />
		)
	}

	// Show request list
	return (
		<View style={{ flex: 1 }}>
			<FlatList
				data={friendList}
				renderItem={({ item }) => (
					<FriendRow navigation={navigation} item={item} />
				)}
				keyExtractor={item => item.id.toString()}
			/>
		</View>
	)
}


