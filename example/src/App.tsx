import React from 'react'
import { Image, SafeAreaView, Text, View } from 'react-native'
import LinkedMap from 'react-native-sk-linkedmap'

const example = require('./mapExample.png')

const App = () => {
  return (
    <SafeAreaView style={{ flex: 1 }}>
      {/* <Text
        style={{
          alignSelf: 'center',
          padding: 20,
          fontSize: 24,
          fontWeight: 'bold',
        }}
      >
        Linked Map Example
      </Text> */}
      <LinkedMap image={example} showMenu />
    </SafeAreaView>
  )
}

export default App
