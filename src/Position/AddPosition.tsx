import React from 'react'
import { Text, TextInput, View } from 'react-native'
import { TMap, TPosition } from '..'
import { PositionPicker } from './PositionPicker'

type Props = {
  map: TMap
  onChange?: (title: string, coordinates?: { x: number; y: number }) => void
}

export const AddPosition = ({ map, onChange }: Props) => {
  const [tempName, setTempName] = React.useState<string>('')
  const [tempPosition, setTempPosition] = React.useState<TPosition | undefined>(
    undefined
  )
  const [modalSize, setModalSize] = React.useState<{
    height: number
    width: number
  }>({ height: 0, width: 0 })

  //return null

  return (
    <View style={{ flex: 1 }}>
      <View
        testID='modal_add_mapposition_input'
        style={{
          marginBottom: 20,
          flexDirection: 'row',
          alignItems: 'center',
        }}
      >
        <Text>Title: </Text>
        <TextInput
          placeholder='Title'
          style={{
            flex: 1,
            marginLeft: 5,
            paddingHorizontal: 5,
            paddingVertical: 2,
            borderRadius: 2,
            borderWidth: 1,
          }}
          value={tempName}
          onChangeText={(val) => {
            setTempName(val)
            if (onChange) onChange(val)
          }}
        />
      </View>
      <View style={{ flex: 1 }}>
        {/* {_renderAspectRatioButtons()} */}
        <View
          testID='modal_add_mapposition_map'
          style={{
            height: '100%',
            width: '100%',
            borderColor: 'black',
            borderWidth: 1,
            justifyContent: 'center',
            alignItems: 'center',
          }}
          onLayout={(e) =>
            setModalSize({
              height: e.nativeEvent.layout.height - 2,
              width: e.nativeEvent.layout.width - 2,
            })
          }
        >
          <View style={{ flex: 1 }}>
            {/* {_renderImage(modalSize.height, modalSize.width, true)} */}
            <PositionPicker
              map={map}
              width={modalSize.width}
              height={modalSize.height}
            />
          </View>
        </View>
      </View>
    </View>
  )
}
