import React from 'react'
import { View } from 'react-native'
import { MultipleTextInput, TextInput } from '../Form'
import { TMap } from '../Map'
import { PositionPicker, TCoordinates, TPosition } from './PositionPicker'

type Props = {
  testId: string
  map: TMap
  onChangePosition?: (position: TPosition) => void
}

export const AddPosition = ({ testId, map, onChangePosition }: Props) => {
  const [tempPosition, setTempPosition] = React.useState<TPosition>({
    key: '',
    title: '',
    target: '',
    coordinates: undefined,
  })
  const [modalSize, setModalSize] = React.useState<{
    height: number
    width: number
  }>({ height: 0, width: 0 })

  const _onChange = (
    type: 'title' | 'target' | 'coordinates',
    value: string | TCoordinates
  ) => {
    setTempPosition({ ...tempPosition, [type]: value })

    if (onChangePosition) {
      onChangePosition({ ...tempPosition, [type]: value })
    }
  }

  return (
    <View style={{ flex: 1 }}>
      <TextInput
        testID={`${testId}_input_title`}
        label={'Title'}
        placeholder='Title...'
        value={tempPosition.title}
        onChangeText={(val) => {
          _onChange('title', val)
        }}
      />
      <TextInput
        testID={`${testId}_input_target`}
        label={'Target'}
        placeholder='Target...'
        autoCapitalize={'none'}
        value={tempPosition.target}
        onChangeText={(val) => {
          _onChange('target', val)
        }}
      />
      <MultipleTextInput
        testID={`${testId}_input_coordinates`}
        label={'Co - X1'}
        placeholder='Coordinates...'
        autoCapitalize={'none'}
        value={tempPosition.coordinates?.x1?.toString()}
        onChangeText={(val) => {
          _onChange('coordinates', {
            x1: Number(val),
            x2: Number(val),
            y1: Number(val),
            y2: Number(val),
          })
        }}
        onlyNumbers
        inputValues={
          tempPosition.coordinates
            ? [
                tempPosition.coordinates.x1,
                tempPosition.coordinates.x2,
                tempPosition.coordinates.y1,
                tempPosition.coordinates.y2,
              ]
            : [0, 0, 0, 0]
        }
      />
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
            {/* {_renderImage(modalSize.height, modalSize.width, true)} */}
            <PositionPicker
              testId={testId}
              map={map}
              position={tempPosition}
              width={modalSize.width}
              height={modalSize.height}
              onChange={(position) => {
                console.log('TODO: add', position)
                // _onChange('coordinates', position.coordinates)
              }}
            />
          </View>
        </View>
      </View>
    </View>
  )
}
