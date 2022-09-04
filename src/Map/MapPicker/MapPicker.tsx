import React, { LegacyRef, useEffect, useRef } from 'react'
import {
  Alert,
  ImageBackground,
  ImageSourcePropType,
  ScrollView,
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
  testId: string
  map?: TMap
  onChange?: (map: TMap) => void
}

export const MapPicker = ({ testId, map, onChange }: Props) => {
  const [hasPermissions, setHasPermissions] = React.useState<boolean>(false)
  const [tempSource, setTempSource] = React.useState<
    ImageSourcePropType | undefined
  >(map?.imageSource)

  const [sizeFactor, setSizeFactor] = React.useState<{
    width: number
    height: number
  }>({ width: 1, height: 1 })

  const imageRef = useRef<ImageBackground>()

  useEffect(() => {
    // TODO: Check for permissions
    setHasPermissions(true)
  }, [])

  useEffect(() => {
    if (map) {
      setTempSource(map.imageSource)
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

      if (tempSource === _src) _src = require('../mapExample.png')

      setTempSource(_src)

      if (onChange) onChange({ ...map, positions: [], imageSource: _src })
    }
  }

  return (
    <ScrollView style={{ flex: 1 }}>
      <View style={{ marginBottom: 20 }}>
        <Text style={{ color: 'red' }}>
          Attention: All linked positions will be deleted on change!
        </Text>
      </View>
      <View style={{ flexGrow: 1, marginBottom: 20 }}>
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
          >
            Image: {tempSource}
          </Text>
        </View>
        <View
          style={{
            flexGrow: 1,
            borderWidth: 1,
            padding: 10,
          }}
        >
          <ImageBackground
            testID={`${testId}_pick_position`}
            source={tempSource ?? {}}
            resizeMode='contain'
            resizeMethod='scale'
            style={{ width: '100%', height: '100%', flexGrow: 1 }}
            onLayout={(e) => setSizeFactor(e.nativeEvent.layout)}
          >
            <View
              style={{
                position: 'absolute',
                width: '100%',
                height: '100%',
                backgroundColor: 'transparent',
              }}
            >
              {map?.positions?.map((position) => {
                if (position.coordinates) {
                  const { x1, x2, y1, y2 } = position.coordinates
                  return (
                    <View
                      key={`${testId}_position_${position.key}`}
                      style={{
                        position: 'absolute',
                        left: (x1 / 100) * sizeFactor.width,
                        top: (y1 / 100) * sizeFactor.height,
                        width: ((x2 - x1) / 100) * sizeFactor.width,
                        height: ((y2 - y1) / 100) * sizeFactor.height,
                        borderWidth: 1,
                        borderColor: 'red',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      <Text adjustsFontSizeToFit>{position.title}</Text>
                    </View>
                  )
                }

                return null
              })}
            </View>
          </ImageBackground>
        </View>
      </View>
    </ScrollView>
  )
}
