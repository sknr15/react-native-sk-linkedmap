import React, { useEffect, useState } from 'react'
import {
  Alert,
  ImageSourcePropType,
  SafeAreaView,
  Text,
  TouchableOpacity,
  View,
} from 'react-native'
import LinkedMap, { TMap, TPosition } from 'react-native-sk-linkedmap'
import { request, check, PERMISSIONS } from 'react-native-permissions'

const example = require('./mapExample.png')

const App = () => {
  const pos: TPosition[] = [
    {
      key: '123',
      title: '123',
      target: 'www.123.de',
      coordinates: { x1: 9, x2: 32, y1: 31, y2: 42 },
    },
    { key: 'testmap1', title: 'Testmap 1', target: 'testmap.com' },
    {
      key: 'dasisteintest',
      title: 'Das ist ein Test',
      target: 'test',
      coordinates: { x1: 68, x2: 92, y1: 70, y2: 81 },
    },
    { key: '123456', title: '123456', target: '123456' },
  ]

  const [map, setMap] = useState<TMap>({
    key: 'mapexample',
    title: 'Map Example',
    imageSource: example,
    positions: [...pos],
  })

  const [showMenu, setShowMenu] = useState<boolean>(false)

  useEffect(() => {
    check(PERMISSIONS.IOS.CAMERA).then((res) => {
      console.log(res)
    })
    request(PERMISSIONS.IOS.PHOTO_LIBRARY_ADD_ONLY)
    request(PERMISSIONS.IOS.PHOTO_LIBRARY)
  }, [])

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View
        style={{
          width: '100%',
          backgroundColor: 'lightgray',
          alignItems: 'center',
          justifyContent: 'center',
          paddingVertical: 5,
        }}
      >
        <TouchableOpacity
          onPress={() => setShowMenu(!showMenu)}
          style={{ flexDirection: 'row', alignItems: 'center' }}
        >
          <View
            style={{
              width: 20,
              height: 20,
              borderColor: 'black',
              borderWidth: 1,
              marginRight: 5,
              borderRadius: 999,
            }}
          >
            <View
              style={{
                flex: 1,
                margin: 2,
                backgroundColor: showMenu ? 'black' : 'transparent',
                justifyContent: 'center',
                alignItems: 'center',
                borderRadius: 999,
              }}
            />
          </View>
          <Text style={{ fontSize: 16, color: 'black' }}>Enable Menu</Text>
        </TouchableOpacity>
      </View>
      <LinkedMap
        testID='linkedmap'
        map={map}
        showMenu={showMenu}
        onChange={(map) => {
          setMap(map)
        }}
        onClick={(pos) => {
          Alert.alert(`Position: ${pos?.title}`, `Target: ${pos?.target}`)
        }}
      />
    </SafeAreaView>
  )
}

export default App
