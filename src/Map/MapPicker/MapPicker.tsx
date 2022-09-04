import React, { useEffect } from 'react'
import {
  Alert,
  ImageSourcePropType,
  TouchableOpacity,
  View,
} from 'react-native'
import { Text } from '../../Form'
import { TPosition } from '../../Position'
import * as ImagePicker from 'expo-image-picker'

export type TMap = {
  key: string
  title: string
  imageSource?: ImageSourcePropType
  positions?: TPosition[]
} // what does a map need?

type Props = {
  map?: TMap
  onChange?: (map: TMap) => void
}

export const MapPicker = ({ map, onChange }: Props) => {
  const [hasPermissions, setHasPermissions] = React.useState<boolean>(false)
  const [tempSource, setTempSource] = React.useState<string>('')

  useEffect(() => {
    // TODO: Check for permissions
    setHasPermissions(true)
  }, [])

  useEffect(() => {
    if (map) {
      if (typeof map.imageSource === 'string') {
        setTempSource(map.imageSource)
      }
      if (typeof map.imageSource === 'number') {
        setTempSource(map.imageSource.toString())
      }
    }
  }, [map])

  const _pickImage = async () => {
    if (!hasPermissions) {
      Alert.alert('No permission', 'No permissions to media library', [
        { text: 'OK' },
      ])
      return
    }

    // const result = await ImagePicker.launchImageLibraryAsync({})

    //
    // CHANGE!!!
    //

    if (map) {
      let _src = require('../solarMap.jpeg')

      if (map.imageSource === _src) _src = require('../mapExample.png')

      setTempSource(_src.toString())

      if (onChange) onChange({ ...map, imageSource: _src })
    }
  }

  return (
    <View>
      <View style={{ marginBottom: 20 }}>
        <Text style={{ color: 'red' }}>
          Achtung: Alle verlinkten Positionen gehen verloren!
        </Text>
      </View>
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
            console.log('TODO: ImagePicker öffnen, Bild ändern')
            _pickImage()
          }}
        >
          <Text>Bild auswählen...</Text>
        </TouchableOpacity>
        <Text
          style={{
            alignSelf: 'center',
            maxWidth: '50%',
            fontStyle: 'italic',
          }}
          numberOfLines={2}
        >
          Bild: {tempSource}
        </Text>
      </View>
    </View>
  )
}
