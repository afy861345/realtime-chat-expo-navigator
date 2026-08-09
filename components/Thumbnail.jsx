import { Image } from 'react-native'
import utils from '../utils'

export default function Thumbnail({size,url}) {
  return (
    <Image source={utils.thumbnail(url)} style={{
            width:size,height:size,borderRadius:90,backgroundColor:'#e0e0e0'
          }}/>
  )
}