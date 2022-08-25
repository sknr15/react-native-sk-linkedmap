import React, { useEffect } from 'react'
import { ImageSourcePropType, SafeAreaView } from 'react-native'
import LinkedMap from 'react-native-sk-linkedmap'
import { request, check, PERMISSIONS } from 'react-native-permissions'

const example = require('./mapExample.png')

type TPositions = { key: string; title: string }
type TMap = { key: string; title: string; src?: ImageSourcePropType }

const App = () => {
  const [pos, setPos] = React.useState<TPositions[]>([
    { key: '123', title: '123' },
    { key: 'testmap1', title: 'Testmap 1' },
    { key: 'dasisteintest', title: 'Das ist ein Test' },
    { key: '123456', title: '123456' },
  ])

  const [maps, setMaps] = React.useState<TMap[]>([
    { key: 'mapexample', title: 'Map Example', src: example },
  ])

  useEffect(() => {
    check(PERMISSIONS.IOS.CAMERA).then((res) => {
      console.log(res)
    })
    request(PERMISSIONS.IOS.PHOTO_LIBRARY_ADD_ONLY)
    request(PERMISSIONS.IOS.PHOTO_LIBRARY)
  }, [])

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <LinkedMap
        //image={maps[0].src as ImageSourcePropType}
        map={maps[0]}
        showMenu
        positions={pos}
        onChangePositions={(pos) => setPos(pos)}
        onChangeMap={(map) => {
          const _maps = { ...maps }
          _maps[0] = map
          setMaps(_maps)
        }}
      />
    </SafeAreaView>
  )
}

export default App
