import React from 'react'
import { View } from 'react-native'
import { Text, TextInput } from '../Form'
import { TMap } from '../Map'
import { PositionPicker, TPosition } from './PositionPicker'

type Props = {
  testId: string
  position: TPosition
  map: TMap
  onChange?: (
    title: string,
    target: string,
    coordinates?: { x: number; y: number }
  ) => void
}

export const EditPosition = ({ testId, position, map, onChange }: Props) => {
  const [tempValues, setTempValues] = React.useState<{
    title: string
    target: string
  }>({ title: '', target: '' })
  const [modalSize, setModalSize] = React.useState<{
    height: number
    width: number
  }>({ height: 0, width: 0 })

  React.useEffect(() => {
    if (position) {
      setTempValues({ title: position.title, target: position.target })
    }
  }, [position])

  const _onChange = (type: 'title' | 'target', value: string) => {
    setTempValues({ ...tempValues, [type]: value })

    if (onChange) {
      switch (type) {
        case 'title':
          onChange(value, tempValues.target)
          break
        case 'target':
          onChange(tempValues.title, value)
          break
      }
    }
  }

  return (
    <View style={{ flex: 1 }}>
      <View
        style={{
          marginBottom: 20,
          flexDirection: 'row',
          alignItems: 'center',
        }}
      >
        <Text bold>Title: </Text>
        <TextInput
          testID={`${testId}_input_title`}
          placeholder='Title...'
          style={{
            flex: 1,
            marginLeft: 5,
            paddingHorizontal: 5,
            paddingVertical: 2,
            borderRadius: 2,
            borderWidth: 1,
          }}
          value={tempValues.title}
          onChangeText={(val) => {
            _onChange('title', val)
          }}
        />
      </View>
      <View
        style={{
          marginBottom: 20,
          flexDirection: 'row',
          alignItems: 'center',
        }}
      >
        <Text bold>Target: </Text>
        <TextInput
          testID={`${testId}_input_target`}
          placeholder='Target...'
          style={{
            flex: 1,
            marginLeft: 5,
            paddingHorizontal: 5,
            paddingVertical: 2,
            borderRadius: 2,
            borderWidth: 1,
          }}
          autoCapitalize={'none'}
          value={tempValues.target}
          onChangeText={(val) => {
            _onChange('target', val)
          }}
        />
      </View>
      <View style={{ flex: 1 }}>
        {/* {_renderAspectRatioButtons()} */}
        <View
          testID={`${testId}_map`}
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
              testId={`${testId}`}
              map={map}
              height={modalSize.height}
              width={modalSize.width}
              onChange={() => {}}
            />
          </View>
        </View>
      </View>
    </View>
  )
}
