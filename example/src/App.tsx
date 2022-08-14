import React from 'react'
import { Image, SafeAreaView, Text, View } from 'react-native'
import LinkedMap from 'react-native-sk-linkedmap'

const example = require('./mapExample.png')

type TPositions = { key: string; title: string }

const App = () => {
  const [pos, setPos] = React.useState<TPositions[]>([
    { key: '123', title: '123' },
    { key: '1234', title: '1234' },
    { key: '12345', title: '12345' },
    { key: '123456', title: '123456' },
  ])

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <LinkedMap
        image={example}
        showMenu
        positions={pos}
        onChange={(pos) => setPos(pos)}
      />
    </SafeAreaView>
  )
}

export default App
