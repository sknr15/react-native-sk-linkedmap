import React, { useEffect } from 'react'
import {
  Alert,
  ImageSourcePropType,
  TouchableOpacity,
  View,
} from 'react-native'
import { Text } from '../../Form'
import { TPosition } from '../../Position'

export type TMap = { key: string; title: string; src?: ImageSourcePropType } // what does a map need?

type Props = {
  map?: TMap
  onChange?: (map: TMap) => void
  positions?: TPosition[]
}

export const MapPicker = ({ map, onChange, positions }: Props) => {
  const [hasPermissions, setHasPermissions] = React.useState<boolean>(false)
  const [tempSource, setTempSource] = React.useState<string>('')

  useEffect(() => {
    if (map) {
      if (typeof map.src === 'string') {
        setTempSource(map.src)
      }
      if (typeof map.src === 'number') {
        setTempSource(map.src.toString())
      }
    }
  }, [map])

  const _pickImage = async () => {
    if (hasPermissions) {
      Alert.alert('No permission', 'No permissions to media library', [
        { text: 'OK' },
      ])
      return
    }

    //const result = await ImagePicker.launchImageLibraryAsync({})

    //
    // CHANGE!!!
    //

    if (map) {
      console.log(123)
      let _src =
        'https://upload.wikimedia.org/wikipedia/commons/thumb/8/8f/Example_image.svg/600px-Example_image.svg.png' as ImageSourcePropType

      if (map.src === _src) _src = require('../mapExample.png')

      setTempSource(_src.toString())

      if (onChange) onChange({ ...map, src: _src })
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
          {tempSource}
        </Text>
      </View>
      <View></View>
    </View>
  )
}
