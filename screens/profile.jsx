import { View, Text, Image, TouchableOpacity } from 'react-native'
import React from 'react'
import useGlobal from '../core/gobal'
import { MaterialIcons, FontAwesome } from '@expo/vector-icons';
import * as ImagePicker from "expo-image-picker";
import utils from '../utils';
import * as ImageManipulator from "expo-image-manipulator";
import Thumbnail from '../components/Thumbnail';

function Logout() {
  const logout = useGlobal(state => state.logout)
  return (
    <TouchableOpacity
      onPress={logout}
      style={{
        height: 52,
        backgroundColor: '#202020',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 26,
        paddingHorizontal: 26,
        marginTop: 20,
        flexDirection: 'row'
      }}>
      <MaterialIcons
        name="logout"
        size={30}
        color="black"
      />
      <Text style={{ textAlign: 'center', color: '#d0d0d0', fontWeight: 'bold' }}>
        Logout
      </Text>
    </TouchableOpacity>
  )
}
function ProfileImage() {
  const uploadThumbnail = useGlobal(state => state.uploadThumbnail)
  const user = useGlobal(state => state.user)
  async function pickImage() {
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (permissionResult.granted === false) {
      alert('Permission to access camera roll is required!');
      return;
    }
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 1,
      allowsEditing: true
    });

    if (!result.canceled) {
      const file = result.assets[0]//this contain all file with base 64
      // utils.log('Selected image URI:', result.assets[0].uri);
      // Use this URI as needed
      const compressedImage = await ImageManipulator.manipulateAsync(
        file.uri,
        [
          {
            resize: {
              width: 800,
            },
          },
        ],
        {
          compress: 0.5,
          format: ImageManipulator.SaveFormat.JPEG,
          base64: true,
        }
      );

      // console.log("Compressed URI:", compressedImage.uri);
      // console.log("Base64 size:", compressedImage.base64?.length);
      uploadThumbnail({
        ...compressedImage,
        fileName: file.fileName
      })
    }


  }


  return (
    <View style={{ marginBottom: 20 }}
    >
      <Thumbnail size={180} url={user.thumbnail} />
      <TouchableOpacity
        onPress={pickImage}
        style={{
          position: 'absolute',
          bottom: 0, right: 0,
          backgroundColor: '#202020',
          width: 40, height: 40,
          justifyContent: 'center',
          alignItems: 'center',
          borderRadius: 20,
          borderWidth: 3,
          borderColor: 'white'
        }}>
        <FontAwesome name='pencil' size={15} color='#d0d0d0' />
      </TouchableOpacity>

    </View>
  )
}
export default function Profile() {
  const user = useGlobal(state => state.user)
  return (
    <View style={{
      flex: 1,
      alignItems: 'center', paddingTop: 100,
    }}>

      <ProfileImage />
      <Text style={{ textAlign: 'center', marginTop: 6, color: '#303030', fontSize: 20, fontWeight: 'bold' }}
      >{user.name}</Text>
      <Text style={{ textAlign: 'center', marginTop: 6, color: '#606060', fontSize: 14 }}

      >@{user.username}</Text>
      <Logout />

    </View>
  )
}

