import { View, Text, SafeAreaView, KeyboardAvoidingView, Platform, TouchableWithoutFeedback, Keyboard } from 'react-native'
import React, { useLayoutEffect, useState } from 'react'
import Title from '../components/Title'
import CustomInput from '../components/CustomInput'
import CustomButton from '../components/CustomButton'
import api from '../core/api'
import utils from '../utils'
import useGlobal from '../core/gobal'

export default function SignIn({ navigation }) {
  const login = useGlobal(state => state.login)

  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [usernameError, setUsernameError] = useState('')
  const [passwordError, setPasswordError] = useState('')
  useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: false
    })
  }, [navigation])
  const onSignin = () => {
    const failUsername = !username;
    if (failUsername) {
      setUsernameError('username should not be empty')
    }
    const failPassword = !password;
    if (failPassword) {
      setPasswordError('password should not be empty')
    }
    if (failUsername || failPassword) {
      return
    }
    api({
      method: 'POST',
      url: 'signin/',
      data: {
        username: username,
        password: password
      }
    }).then(response => {
      const credentials = {
        username: username,
        password: password
      }
      utils.log(response.data);
      login(response.data.user, credentials, response.data.tokens);

    })
      .catch(error => {
        console.log("message:", error.message);
        console.log("code:", error.code);
        console.log("response:", error.response?.data);
        console.log("status:", error.response?.status);
        console.log("request:", error.request);
      })

  }
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{ flex: 1 }}>
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <View style={{
            flex: 1,
            justifyContent: 'center',
            paddingHorizontal: 20
          }}>

            <Title text={"Sign In"} color={'#202020'} size={48} />
            <CustomInput title={'Username'}
              value={username} setValue={setUsername}
              error={usernameError} setError={setUsernameError} />
            <CustomInput title="Password"
              value={password} setValue={setPassword} error={passwordError} setError={setPasswordError}
              secureTextEntry={true} />
            <CustomButton title={'Sign In'} onPress={onSignin} />
            <Text style={{ textAlign: 'center', marginVertical: 20 }}>
              Don't have an account please <Text
                style={{ color: 'blue', fontWeight: 'bold' }}
                onPress={() => navigation.navigate('SignUp')}>
                Sign Up</Text>
            </Text>
          </View>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>

    </SafeAreaView>
  )
}
