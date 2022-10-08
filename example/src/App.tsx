import React, { useEffect, useState } from 'react'
import {
  Alert,
  BackHandler,
  LogBox,
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

if (__DEV__) LogBox.ignoreAllLogs()

const example = require('./mapExample.png')

const App = () => {
  const pos: TPosition[] = [
    {
      key: 'web1',
      title: 'Webseite',
      target: 'www.hellospaces.de',
      coordinates: { x1: 8.5, x2: 32.5, y1: 30.7, y2: 41.7 },
    },
    {
      key: 'multipos',
      title: 'Multiple Positions',
      target: ['expo1', 'stage1'],
      coordinates: { x1: 38, x2: 92, y1: 17.7, y2: 28.7 },
    },
    {
      key: 'dasisteintest',
      title: 'Das ist ein Test',
      target: 'test',
      coordinates: { x1: 68, x2: 92, y1: 70, y2: 81 },
    },
    { key: 'testmap5', title: 'Test Map 5', target: '123456' },
    {
      key: 'expo1',
      title: 'Expo Beispiel',
      target: { title: 'THM', location: 'Gießen', year: 1971 },
      coordinates: { x1: 68, x2: 92, y1: 43.8, y2: 54.8 },
    },
  ]

  const [map, setMap] = useState<TMap>({
    key: 'mapexample',
    title: 'Map Example',
    imageSource: example,
    positions: [...pos],
  })

  const [showMenu, setShowMenu] = useState<boolean>(false)
  const [showEditMode, setShowEditMode] = useState<boolean>(false)
  const [hidePositions, setHidePositions] = useState<boolean>(false)
  const [hasPermissions, setHasPermissions] = useState<boolean>(false)

  useEffect(() => {
    _requestPermission()
  }, [])

  useEffect(() => {
    BackHandler.addEventListener('hardwareBackPress', handleBackButtonPress)
    return () => {
      BackHandler.removeEventListener(
        'hardwareBackPress',
        handleBackButtonPress
      )
    }
  }, [])

  const handleBackButtonPress = () => {
    return true
  }

  const _requestPermission = async () => {
    switch (Platform.OS) {
      case 'android':
        try {
          const granted = await PermissionsAndroid.request(
            'android.permission.READ_EXTERNAL_STORAGE'
          )
          setHasPermissions(granted === PermissionsAndroid.RESULTS.GRANTED)
        } catch {
          setHasPermissions(false)
        }
        return
      case 'ios':
        try {
          const { status } =
            await ImagePicker.requestMediaLibraryPermissionsAsync()
          setHasPermissions(status === ImagePicker.PermissionStatus.GRANTED)
        } catch {
          setHasPermissions(false)
        }
        return
      case 'web':
      default:
        setHasPermissions(true)
        return
    }
  }

  const _renderTestButtons = () => {
    return (
      <View
        style={{
          width: '100%',
          backgroundColor: 'white',
          alignItems: 'center',
          justifyContent: 'space-evenly',
          paddingVertical: 5,
          paddingHorizontal: 20,
          flexDirection: 'row',
          flexWrap: 'wrap',
          borderBottomColor: 'black',
          borderBottomWidth: 1,
        }}
      >
        <TouchableOpacity
          onPress={() => setHidePositions(!hidePositions)}
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
                backgroundColor: hidePositions ? 'black' : 'transparent',
                justifyContent: 'center',
                alignItems: 'center',
                borderRadius: 999,
              }}
            />
          </View>
          <Text
            style={{
              fontSize: 16,
              color: 'black',
              fontWeight: hidePositions ? 'bold' : 'normal',
            }}
          >
            HidePos
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => {
            if (!showEditMode) {
              setShowMenu(false)
            }
            setShowEditMode(!showEditMode)
          }}
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
          <Text
            style={{
              fontSize: 16,
              color: 'black',
              fontWeight: showEditMode ? 'bold' : 'normal',
            }}
          >
            EditMode
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => setShowMenu(!showMenu)}
          style={{ flexDirection: 'row', alignItems: 'center' }}
          disabled={showEditMode}
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
          <Text
            style={{
              fontSize: 16,
              color: 'black',
              fontWeight: showMenu ? 'bold' : 'normal',
            }}
          >
            Menu
          </Text>
        </TouchableOpacity>
      </View>
    )
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: 'lightgray' }}>
      {_renderTestButtons()}
      <LinkedMap
        testID='linkedmap'
        map={map}
        editMode={showEditMode}
        hidePositions={hidePositions}
        showMenu={showMenu}
        onChange={(map) => {
          setMap(map)
        }}
        onClick={(pos) => {
          let _text = `Target: ${pos?.target}`
          let _target = pos?.target
          if (typeof _target === 'object') {
            _text = Object.entries(_target)
              .map((entry) => entry[0] + ': ' + entry[1])
              .join('\n')
          }
          if (Array.isArray(_target)) {
            _text = `Targets [${pos?.target.length}]:\n${_target.join('\n')}`
          }
          Alert.alert(`Position: ${pos?.title}`, `${_text}`)
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
        title={'Example for LinkedMap'}
        titleStyle={{
          backgroundColor: 'white',
          color: 'black',
          paddingHorizontal: 6,
          paddingVertical: 2,
        }}
      />
    </SafeAreaView>
  )
}

export default App
