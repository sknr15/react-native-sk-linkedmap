import React from 'react'
import { View } from 'react-native'
import { MultipleTextInput, TextInput } from '../Form'
import { TMap } from '../Map'
import { PositionPicker, TCoordinates, TPosition } from './PositionPicker'

type Props = {
  testId: string
  position: TPosition
  map: TMap
  onChangePosition?: (position: TPosition) => void
}

export const EditPosition = ({
  testId,
  position,
  map,
  onChangePosition,
}: Props) => {
  const [tempPosition, setTempPosition] = React.useState<TPosition>({
    ...position,
  })
  const [modalSize, setModalSize] = React.useState<{
    height: number
    width: number
  }>({ height: 0, width: 0 })

  React.useEffect(() => {
    if (position) {
      setTempPosition({ ...position })
    }
  }, [position])

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
        onChangeText={(val) => {
          _onChange('coordinates', {
            x1: Number(val),
            x2: Number(val),
            y1: Number(val),
            y2: Number(val),
          })
        }}
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
        onlyNumbers
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
            <PositionPicker
              testId={`${testId}`}
              map={map}
              position={position}
              height={modalSize.height}
              width={modalSize.width}
              onChange={(position) => {
                console.log('TODO: edit', position)
                // _onChange('coordinates', position.coordinates)
              }}
            />
          </View>
        </View>
      </View>
    </View>
  )
}
