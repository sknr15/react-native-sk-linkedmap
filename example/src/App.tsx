import React, { useEffect, useState } from 'react'
import { Alert, SafeAreaView, Text, TouchableOpacity, View } from 'react-native'
import LinkedMap, { TMap, TPosition } from 'react-native-sk-linkedmap'
import { request, check, PERMISSIONS } from 'react-native-permissions'
import * as ImagePicker from 'expo-image-picker'

const example = require('./mapExample.png')

const App = () => {
  const pos: TPosition[] = [
    {
      key: '123',
      title: '123',
      target: 'www.123.de',
      coordinates: { x1: 9, x2: 32, y1: 31, y2: 42 },
    },
    { key: 'testmap4', title: 'Target Array', target: [] },
    {
      key: 'dasisteintest',
      title: 'Das ist ein Test',
      target: 'test',
      coordinates: { x1: 68, x2: 92, y1: 70, y2: 81 },
    },
    { key: 'testmap5', title: 'Test Map 5', target: '123456' },
    { key: 'testmaparr', title: 'Test Map Array', target: ['expobeispiel'] },
  ]

  const [map, setMap] = useState<TMap>({
    key: 'mapexample',
    title: 'Map Example',
    imageSource: example,
    positions: [...pos],
  })

  const [showMenu, setShowMenu] = useState<boolean>(false)
  const [hasPermissions, setHasPermissions] = useState<boolean>(false)

  useEffect(() => {
    // _requestPermission()
  }, [])

  const _requestPermission = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync()
    setHasPermissions(status === ImagePicker.PermissionStatus.GRANTED)
  }

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
        showZoomButtons
      />
    </SafeAreaView>
  )
}

export default App
