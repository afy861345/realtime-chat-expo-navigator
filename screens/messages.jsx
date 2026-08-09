import { View, Text, TextInput, KeyboardAvoidingView, TouchableOpacity, TouchableWithoutFeedback, Keyboard, Platform, FlatList, Animated, Easing } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import Thumbnail from '../components/Thumbnail'
import { FontAwesome } from "@expo/vector-icons"
import useGlobal from '../core/gobal'
function MessageHeader({ friend }) {
  return (
    <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center' }}>
      <Thumbnail
        url={friend.thumbnail}
        size={40} />
      <Text style={{ color: '#202020', fontSize: 18, marginLeft: 10, fontWeight: 'bold' }}>{friend.name ? friend.name : friend.username}</Text>
    </View>
  )
}
function MessageInput({ message, setMessage, onPress }) {
  return (
    <View style={{
      paddingHorizontal: 10,
      paddingBottom: 10, backgroundColor: 'white',
      flexDirection: 'row', alignItems: 'center'
    }}>

      <TextInput value={message} onChangeText={(text) => setMessage(text)} placeholder='Message' placeholderTextColor='#909090' style={{
        paddingHorizontal: 10, flex: 1, borderWidth: 1,
        borderColor: '#d0d0d0', height: 50,
        borderRadius: 25, backgroundColor: 'white'
      }} />
      <TouchableOpacity onPress={onPress}>
        <FontAwesome name='paper-plane' size={28} color='#303040' style={{
          marginHorizontal: 12
        }} />
      </TouchableOpacity>
    </View>
  )
}
const MessageBubbleMe = ({ text }) => {
  return (
    <View
      style={{
        flexDirection: 'row',
        padding: 4,
        paddingRight: 12
      }}

    >
      {/* make right direction by space */}
      <View style={{ flex: 1 }} />
      <View
        style={{
          backgroundColor: '#303040',
          borderRadius: 21,
          borderBottomRightRadius: 0,
          maxWidth: '75%',
          paddingHorizontal: 16,
          paddingVertical: 12,
          justifyContent: 'center',
          marginRight: 8,
          minHeight: 42
        }}
      >
        <Text
          style={{
            color: 'white',
            fontSize: 16,
            lineHeight: 18
          }}
        >
          {text}
        </Text>

      </View>

    </View>

  )
}
function MessageTypingAnimation({ offset }) {

  const Y = useRef(new Animated.Value(0)).current
  useEffect(() => {
    const total = 1000
    const bump = 200
    const animation = Animated.loop(
      Animated.sequence([
        Animated.delay(bump * offset),
        Animated.timing(Y, {
          toValue: 1,
          duration: bump,
          easing: Easing.linear,
          useNativeDriver: true
        }),
        Animated.timing(Y, {
          toValue: 0,
          duration: bump,
          easing: Easing.linear,
          useNativeDriver: true
        }),
        Animated.delay(total - bump * 2 - bump * offset)
      ])
    )
    animation.start()
    return () => {
      animation.stop();
      Y.setValue(0);

    }
  }, [])
  const translateY = Y.interpolate({
    inputRange: [0, 1],
    outputRange: [0, -8]
  })
  return (
    <Animated.View style={{
      width: 8, height: 8, marginHorizontal: 1.5,
      borderRadius: 4,
      backgroundColor: '#606060',
      transform: [{ translateY }]
    }}>

    </Animated.View>
  )
}
function MessageBubbleFriend({ text = '', friend, typing = false }) {
  return (
    <View
      style={{
        flexDirection: 'row',
        padding: 4,
        paddingLeft: 16
      }}
    >
      <Thumbnail
        url={friend.thumbnail}
        size={42}
      />
      <View
        style={{
          backgroundColor: '#d0d2db',
          borderRadius: 21,
          borderBottomStartRadius: 0,
          maxWidth: '75%',
          paddingHorizontal: 16,
          paddingVertical: 12,
          justifyContent: 'center',
          marginLeft: 8,
          minHeight: 42
        }}
      >
        {typing ? (<View style={{ flexDirection: 'row' }}>
          <MessageTypingAnimation offset={0} />
          <MessageTypingAnimation offset={1} />
          <MessageTypingAnimation offset={2} />

        </View>) : (
          <Text
            style={{
              color: '#202020',
              fontSize: 16,
              lineHeight: 18
            }}
          >
            {text}
          </Text>
        )}
      </View>
      <View style={{ flex: 1 }} />
    </View>
  )
}
function MessageBubble({ message, index, friend }) {
  const [showTyping, setShowTyping] = useState(false)
  const messageTyping = useGlobal(state => state.messageTyping)
  useEffect(() => {
    if (index !== 0) return
    if (messageTyping === null) {
      setShowTyping(false)
      return
    }
    setShowTyping(true)
    const check = setInterval(() => {
      const now = new Date()
      const ms = now - messageTyping
      if (ms > 10000) {
        setShowTyping(false)
      }
    }, 1000)
    return () => clearInterval(check)
  }, [messageTyping])
  if (index === 0) {
    if (showTyping) {
      return <MessageBubbleFriend friend={friend} typing={true} />
    }
    return null;
  }
  return message.is_me ? (<MessageBubbleMe text={message.text} />) : (<MessageBubbleFriend text={message.text} friend={friend} />)
}
export default function Messages({ navigation, route }) {
  const { id: connectionId, friend } = route.params;
  const [message, setMessage] = useState("");
  const messageSend = useGlobal(state => state.messageSend)
  const messagesList = useGlobal(state => state.messagesList)
  const messagesRequest = useGlobal(state => state.messagesRequest)
  const messageType = useGlobal(state => state.messageType)
  const messageNext = useGlobal(state => state.messageNext)

  useLayoutEffect(() => {//sould be before useeffect
    navigation.setOptions({
      headerTitle: () => <MessageHeader friend={friend} />
    });
  }, [navigation, friend]);
  useEffect(() => {
    messagesRequest(connectionId)
  }, [connectionId])
  function onSend() {
    const cleaned = message.replace(/\s+/g, ' ').trim()
    if (cleaned.length === 0) {
      return
    }
    messageSend(connectionId, cleaned)
    setMessage("")
  }
  function onType(value) {
    setMessage(value)
    messageType(friend.username)
  }
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={90} // adjust if header overlaps
      >




        {/* Message list */}
          <View style={{ flex: 1 }}>
            {messagesList.length === 0 ? (
              <View style={{
                flex: 1, alignItems: 'center',
                justifyContent: 'center'
              }}>
                <Text style={{ color: '#6ff124', fontSize: 20, fontWeight: 'bold' }}>Be first to add message</Text>
              </View>
            ) : (
              <FlatList
                data={[{ id: -1 }, ...messagesList]}//this add object fake with index 0

                inverted={true}
                keyExtractor={item => item.id.toString()}
                renderItem={({ item, index }) => (
                  <MessageBubble message={item} friend={friend} index={index} />
                )}
                automaticallyAdjustKeyboardInsets={true}
                contentContainerStyle={{ paddingTop: 30 }}
                onEndReached={() => {
                  if (messageNext) {
                    messagesRequest(connectionId, messageNext)
                  }
                }} />
            )}

          </View>
        

        {/* Input */}
        <MessageInput
          message={message}
          setMessage={onType}
          onPress={onSend}
        />

      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}




