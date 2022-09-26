import React, { useEffect, useState } from 'react'
import {
  Alert,
  PermissionsAndroid,
  Platform,
  SafeAreaView,
  Text,
  TouchableOpacity,
  View,
} from 'react-native'
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
  const [showEditMode, setShowEditMode] = useState<boolean>(false)
  const [hasPermissions, setHasPermissions] = useState<boolean>(false)

  useEffect(() => {
    _requestPermission()
  }, [])

  const _requestPermission = async () => {
    switch (Platform.OS) {
      case 'android':
        const granted = await PermissionsAndroid.request(
          'android.permission.READ_EXTERNAL_STORAGE'
        )
        setHasPermissions(granted === PermissionsAndroid.RESULTS.GRANTED)
        return
      case 'ios':
        const { status } =
          await ImagePicker.requestMediaLibraryPermissionsAsync()
        setHasPermissions(status === ImagePicker.PermissionStatus.GRANTED)
        return
      case 'web':
      default:
        setHasPermissions(true)
        return
    }
  }

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View
        style={{
          width: '100%',
          backgroundColor: 'lightgray',
          alignItems: 'center',
          justifyContent: 'space-evenly',
          paddingVertical: 5,
          paddingHorizontal: 20,
          flexDirection: 'row',
          flexWrap: 'wrap',
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
        <TouchableOpacity
          onPress={() => setShowEditMode(!showEditMode)}
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
                backgroundColor: showEditMode ? 'black' : 'transparent',
                justifyContent: 'center',
                alignItems: 'center',
                borderRadius: 999,
              }}
            />
          </View>
          <Text style={{ fontSize: 16, color: 'black' }}>Enable EditMode</Text>
        </TouchableOpacity>
      </View>
      <LinkedMap
        testID='linkedmap'
        map={map}
        showMenu={showMenu}
        editMode={showEditMode}
        onChange={(map) => {
          setMap(map)
        }}
        onClick={(pos) => {
          Alert.alert(`Position: ${pos?.title}`, `Target: ${pos?.target}`)
        }}
        showZoomButtons={showMenu}
        zoomButtonsStyle={{
          marginRight: 12,
          marginBottom: 10,
          padding: 5,
          fontSize: 20,
          width: 40,
          height: 40,
        }}
      />
    </SafeAreaView>
  )
}

export default App
