import React from 'react'
import { Text, TextInput, View } from 'react-native'
import { TMap, TPosition } from '..'
import { PositionPicker } from './PositionPicker'

type Props = {
  testId: string
  position: TPosition
  map: TMap
  onChange?: (title: string, coordinates?: { x: number; y: number }) => void
}

export const EditPosition = ({ testId, position, map, onChange }: Props) => {
  const [tempName, setTempName] = React.useState<string>('')
  const [modalSize, setModalSize] = React.useState<{
    height: number
    width: number
  }>({ height: 0, width: 0 })

  React.useEffect(() => {
    if (position) {
      setTempName(position.title)
    }
  }, [position])

  return (
    <View style={{ flex: 1 }}>
      <View
        style={{
          marginBottom: 20,
          flexDirection: 'row',
          alignItems: 'center',
        }}
      >
        <Text>Title: </Text>
        <TextInput
          testID={`${testId}_input`}
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
          testID='modal_edit_mapposition_map'
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
            <PositionPicker
              map={map}
              height={modalSize.height}
              width={modalSize.width}
            />
          </View>
        </View>
      </View>
    </View>
  )
}
