import React, { useEffect, useState } from 'react'
import { Alert, Platform, TouchableOpacity, View } from 'react-native'
import { Text } from '../../Form'
import * as ImagePicker from 'expo-image-picker'
import { TMap, TPosition } from '../../interfaces'
import { Map } from '../Map'

type Props = {
  map?: TMap
  onChange?: (map: TMap) => void
  testId: string
}

export const MapPicker = ({ map, onChange, testId }: Props) => {
  const IS_WEB = Platform.OS === 'web'
  const [hasPermissions, setHasPermissions] = useState<boolean>(false)
  const [tempMap, setTempMap] = useState<TMap | undefined>(map)
  const [tempPositions, setTempPositions] = useState<TPosition[]>([])

  const [sizeFactor, setSizeFactor] = useState<{
    height: number
    width: number
  }>({ height: 1, width: 1 })

  useEffect(() => {
    _requestPermission()
  }, [])

  useEffect(() => {
    if (map) {
      setTempMap(map)
      setTempPositions(map.positions ?? [])
    }
  }, [map])

  const _requestPermission = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync()
    setHasPermissions(status === ImagePicker.PermissionStatus.GRANTED)
  }

  const _pickImage = async () => {
    if (!hasPermissions && !__DEV__) {
      if (IS_WEB) {
        window.confirm('No permissions to media library')
      } else {
        Alert.alert('No permission', 'No permissions to media library', [
          { text: 'OK' },
        ])
      }
      return
    }

    if (__DEV__) {
      //
      // CHANGE!!!
      //

      console.log('TODO: ImagePicker öffnen, Bild ändern')

      if (tempMap) {
        let _src = require('../solarMap.jpeg')

        if (tempMap?.imageSource === _src) _src = require('../mapExample.png')

        setTempMap({ ...tempMap, imageSource: _src, positions: [] })

        if (onChange) onChange({ ...tempMap, positions: [], imageSource: _src })
      }
    } else {
      const pickedMedia = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        quality: 0.66,
      })

      if (!pickedMedia.cancelled) {
        let uri = pickedMedia.uri
        if (pickedMedia.type === 'image' || pickedMedia.uri.includes('image')) {
          if (pickedMedia.height > 4096 || pickedMedia.width > 4096) {
            Alert.alert('Image too big', 'Selected image is too big (> 2000)', [
              { text: 'OK' },
            ])
            return
          }
        }

        if (tempMap) {
          setTempMap({ ...tempMap, imageSource: { uri }, positions: [] })
        }
      }
    }
  }

  const _getImageName = () => {
    let source = ''

    switch (typeof tempMap?.imageSource) {
      case 'number':
      case 'string':
        source = tempMap.imageSource.toString()
        break
      case 'object':
        source =
          (Array.isArray(tempMap.imageSource)
            ? tempMap.imageSource[0].uri
            : tempMap.imageSource.uri) ?? ''
        break
      default:
        break
    }

    return source
  }

  return (
    <View style={{ flex: 1 }}>
      <View style={{ marginBottom: 20 }}>
        <Text style={{ color: 'red' }}>
          Attention: All linked positions will be deleted on change!
        </Text>
      </View>
      <View style={{ flex: 1, marginBottom: 20 }}>
        <View style={{ marginBottom: 20 }}>
          <TouchableOpacity
            style={{
              justifyContent: 'center',
              alignItems: 'center',
              paddingVertical: 10,
              paddingHorizontal: 20,
              borderRadius: 5,
              borderColor: 'black',
              borderWidth: 1,
              backgroundColor: '#EEE',
              alignSelf: 'center',
              marginBottom: 2,
            }}
            onPress={async () => {
              _pickImage()
            }}
          >
            <Text>Choose image...</Text>
          </TouchableOpacity>
          <Text
            style={{
              alignSelf: 'center',
              maxWidth: '60%',
              fontStyle: 'italic',
              paddingHorizontal: 10,
            }}
            numberOfLines={2}
            center
          >
            Image: {_getImageName()}
          </Text>
        </View>
        <View
          style={{
            flexGrow: 1,
            borderWidth: 1,
          }}
        >
          <Map testId='mappicker' map={tempMap} showText />
        </View>
      </View>
    </View>
  )
}
