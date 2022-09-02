import React, { useEffect } from 'react'
import {
  Alert,
  ImageSourcePropType,
  SafeAreaView,
  Text,
  TouchableOpacity,
  View,
} from 'react-native'
import LinkedMap from 'react-native-sk-linkedmap'
import { request, check, PERMISSIONS } from 'react-native-permissions'

const example = require('./mapExample.png')
const solar = require('./solarMap.jpeg')

type TPosition = { key: string; title: string; target: any }
type TMap = { key: string; title: string; src?: ImageSourcePropType }

const App = () => {
  const [pos, setPos] = React.useState<TPosition[]>([])

  const pos1: TPosition[] = [
    { key: '123', title: '123', target: 'www.123.de' },
    { key: 'testmap1', title: 'Testmap 1', target: 'testmap.com' },
    { key: 'dasisteintest', title: 'Das ist ein Test', target: 'test' },
    { key: '123456', title: '123456', target: '123456' },
  ]

  const pos2: TPosition[] = [
    { key: 'nureine', title: 'nur eine', target: 'www.eine.de' },
  ]

  const [maps, setMaps] = React.useState<TMap[]>([
    { key: 'mapexample', title: 'Map Example', src: example },
    { key: 'solarmap', title: 'Solar Map', src: solar },
  ])

  const [activeIndex, setActiveIndex] = React.useState<number>(0)

  const [showMenu, setShowMenu] = React.useState<boolean>(false)

  useEffect(() => {
    check(PERMISSIONS.IOS.CAMERA).then((res) => {
      console.log(res)
    })
    request(PERMISSIONS.IOS.PHOTO_LIBRARY_ADD_ONLY)
    request(PERMISSIONS.IOS.PHOTO_LIBRARY)
  }, [])

  useEffect(() => {
    if (activeIndex === 1) {
      setPos(pos2)
    } else {
      setPos(pos1)
    }
  }, [activeIndex])

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
        map={maps[activeIndex]}
        showMenu={showMenu}
        positions={pos}
        onChangePositions={(pos) => setPos(pos)}
        onChangeMap={(map) => {
          if (activeIndex === 0) {
            setActiveIndex(1)
          } else {
            setActiveIndex(0)
          }
          const _maps = { ...maps }
          //_maps[activeIndex] = map
          setMaps(_maps)
        }}
        onClick={(pos) => {
          Alert.alert(`Position: ${pos?.title}`, `Target: ${pos?.target}`)
        }}
      />
    </SafeAreaView>
  )
}

export default App
