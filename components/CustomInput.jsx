import { View, Text, TextInput } from 'react-native'
import React from 'react'

const CustomInput = ({ title, value, setValue, error, setError, secureTextEntry }) => {
    return (
        <View>
            <Text style={{
                color: error ? '#ff4444' : '#70747a',
                marginVertical: 6, paddingLeft: 20,

            }}>{error ? error : title}</Text>
            <TextInput
                value={value} onChangeText={text=>{setValue(text);if(error){setError('')}}}
                secureTextEntry= {secureTextEntry}
                style={{
                    borderWidth: 1,
                    borderColor: error ? '#ff5555' : 'transparent',
                    backgroundColor: '#e1e2e4',
                    borderRadius: 26, paddingHorizontal: 16,
                    paddingVertical: 6, height: 52,
                    fontSize: 16,
                }} />
        </View>
    )
}

export default CustomInput
