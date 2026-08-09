import { View, Text, TextInput, TouchableOpacity, KeyboardAvoidingView, Platform, ScrollView } from 'react-native'
import React, { useLayoutEffect, useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import CustomInput from '../components/CustomInput'
import Title from '../components/Title'
import CustomButton from '../components/CustomButton'
import utils from '../utils'
import api from '../core/api'
import useGlobal from '../core/gobal'

export default function SignUp({ navigation }) {
  const login = useGlobal(state => state.login)

  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [password2, setPassword2] = useState('')
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [usernameError, setUsernameError] = useState('')
  const [firstNameError, setFirstNameError] = useState('')
  const [lastNameError, setLastNameError] = useState('')
  const [passwordError, setPasswordError] = useState('')
  const [passwordError2, setPasswordError2] = useState('')
  useLayoutEffect(() => {//should be before effect
    navigation.setOptions({
      headerShown: false,
    })
  }, [navigation])
  function onSignUp() {
    const failUsername = !username || username.length < 2;
    if (failUsername) {
      setUsernameError('username should be = or > 5 charcters')
    }
    const failFirstName = !firstName;
    if (failFirstName) {
      setFirstNameError('First name should not be empty')
    }
    const failLastName = !lastName;
    if (failLastName) {
      setLastNameError('Last name should not be empty')
    }
    const failPassword = !password || password.length < 8;
    if (failPassword) {
      setPasswordError('password is short')
    };
    const failPassword2 = password !== password2;
    if (failPassword2) {
      setPasswordError2('password2 should be same as password1')
    }

    if (failUsername || failFirstName || failLastName || failPassword || failPassword2) {
      return
    }
    api({
      method: 'POST',
      url: 'signup/',
      data: {
        username: username,
        first_name: firstName,
        last_name: lastName,
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
      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
        <ScrollView keyboardShouldPersistTaps="handled">
          <View style={{ flex: 1, justifyContent: 'center', paddingHorizontal: 20 }}>
            <Title text={"Sign Up"} color={'#202020'} size={48} />
            <CustomInput title='Username'
              value={username}
              setValue={setUsername}
              error={usernameError}
              setError={setUsernameError} />
            <CustomInput title='First Name'
              value={firstName}
              setValue={setFirstName}
              error={firstNameError}
              setError={setFirstNameError} />
            <CustomInput title='Last Name'
              value={lastName}
              setValue={setLastName}
              error={lastNameError}
              setError={setLastNameError} />
            <CustomInput title='Password'
              value={password}
              setValue={setPassword}
              error={passwordError}
              setError={setPasswordError}
              secureTextEntry={true} />
            <CustomInput title='Retype Password'
              value={password2}
              setValue={setPassword2}
              error={passwordError2}
              setError={setPasswordError2}
              secureTextEntry={true} />
            <CustomButton title='Sign-Up' onPress={onSignUp} />
            <Text style={{ textAlign: 'center', marginTop: 40 }}>
              Allready have an account please <Text style={{ color: 'green', fontWeight: 'bold' }}
                onPress={() => navigation.navigate('SignIn')}>SignIn</Text>
            </Text>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  )
}