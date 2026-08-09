import { View, Text, TouchableOpacity } from 'react-native'
import React from 'react'

export default function CustomButton({ title, onPress }) {
    return (
        <View>
            <TouchableOpacity
                onPress={onPress}
                style={{
                    backgroundColor: '#202020',
                    height: 52, borderRadius: 28, justifyContent: 'center', alignItems: 'center',
                    marginTop: 16
                }}>
                <Text style={{ color: 'white', fontSize: 16, fontWeight: 'bold' }}>{title}</Text>
            </TouchableOpacity>
        </View>
    )
}
