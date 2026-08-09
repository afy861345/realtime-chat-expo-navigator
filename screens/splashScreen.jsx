import { View, Text, StatusBar, Animated } from 'react-native'
import React, { useEffect, useLayoutEffect, useRef } from 'react'

import { SafeAreaView } from 'react-native-safe-area-context'
import Title from '../components/Title'
export default function SplashScreen({ navigation }) {
    const translateY = useRef(new Animated.Value(0)).current;
    const duration = 800
    useLayoutEffect(() => {
        navigation.setOptions({
            headerShown: false
        })
    }, [navigation])
    useEffect(() => {
        Animated.loop(
            Animated.sequence([
                Animated.timing(translateY, {
                    toValue: 20,
                    duration: duration,
                    useNativeDriver: true
                }),
                Animated.timing(translateY, {
                    toValue: 0,
                    duration: duration,
                    useNativeDriver: true
                })
            ])).start()
    }, [])
    return (
        <SafeAreaView style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'black' }}>
            <StatusBar barStyle={'light-content'} />
            <Animated.View style={{ transform: [{ translateY }] }}>
                <Title text={"What's App"} color={'white'} size={48} />
            </Animated.View>
        </SafeAreaView>
    )
}