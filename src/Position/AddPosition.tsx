import React, { useState } from 'react'
import { View } from 'react-native'
import { TextInput } from '../Form'
import { emptyCoordinates, TCoordinates, TMap, TPosition } from '../interfaces'
import { PositionPicker } from './PositionPicker'

type Props = {
  map: TMap
  onChangePosition?: (position: TPosition) => void
  testId: string
}

export const AddPosition = ({ map, onChangePosition, testId }: Props) => {
  const [tempPosition, setTempPosition] = useState<TPosition>({
    key: '',
    title: '',
    target: '',
    coordinates: { x1: 0, x2: 0, y1: 0, y2: 0 },
  })
  const [modalSize, setModalSize] = useState<{
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

  const _renderCoordinatesInput = () => {
    const { x1, x2, y1, y2 } = tempPosition.coordinates ?? emptyCoordinates

    return (
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
        }}
      >
        <TextInput
          testID={`${testId}_input_x1`}
          label={'X1'}
          placeholder='X1...'
          autoCapitalize={'none'}
          value={(Math.round(x1 * 10) / 10).toString()}
          onChangeText={(val) => {
            _onChange('coordinates', {
              ...emptyCoordinates,
              ...tempPosition.coordinates,
              x1: Number(val),
            })
          }}
          onBlur={() => {
            if (
              !tempPosition.coordinates?.x2 ||
              tempPosition.coordinates.x2 === 0
            ) {
              _onChange('coordinates', {
                ...emptyCoordinates,
                ...tempPosition.coordinates,
                x2: x1 + 10,
              })
            }
          }}
          onlyNumbers
          style={{ flex: 1, maxWidth: '25%', marginRight: 5 }}
        />
        <TextInput
          testID={`${testId}_input_x2`}
          label={'X2'}
          placeholder='X2...'
          autoCapitalize={'none'}
          value={(Math.round(x2 * 10) / 10).toString()}
          onChangeText={(val) => {
            _onChange('coordinates', {
              ...emptyCoordinates,
              ...tempPosition.coordinates,
              x2: Number(val),
            })
          }}
          onlyNumbers
          style={{ flex: 1, maxWidth: '25%', marginRight: 5 }}
        />
        <TextInput
          testID={`${testId}_input_y1`}
          label={'Y1'}
          placeholder='Y1...'
          autoCapitalize={'none'}
          value={(Math.round(y1 * 10) / 10).toString()}
          onChangeText={(val) => {
            _onChange('coordinates', {
              ...emptyCoordinates,
              ...tempPosition.coordinates,
              y1: Number(val),
            })
          }}
          onBlur={() => {
            if (
              !tempPosition.coordinates?.y2 ||
              tempPosition.coordinates.y2 === 0
            ) {
              _onChange('coordinates', {
                ...emptyCoordinates,
                ...tempPosition.coordinates,
                y2: y1 + 10,
              })
            }
          }}
          onlyNumbers
          style={{ flex: 1, maxWidth: '25%', marginRight: 5 }}
        />
        <TextInput
          testID={`${testId}_input_y2`}
          label={'Y2'}
          placeholder='Y2...'
          autoCapitalize={'none'}
          value={(Math.round(y2 * 10) / 10).toString()}
          onChangeText={(val) => {
            _onChange('coordinates', {
              ...emptyCoordinates,
              ...tempPosition.coordinates,
              y2: Number(val),
            })
          }}
          onlyNumbers
          style={{ flex: 1, maxWidth: '25%' }}
        />
      </View>
    )
  }

  return (
    <View style={{ flex: 1, maxWidth: '100%' }}>
      <TextInput
        testID={`${testId}_input_title`}
        label={'Title'}
        placeholder='Title...'
        value={tempPosition.title}
        onChangeText={(val) => {
          _onChange('title', val)
        }}
      />
      {typeof tempPosition.target === 'string' && (
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
      )}
      {_renderCoordinatesInput()}
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
              testId={testId}
              map={map}
              position={tempPosition}
              width={modalSize.width}
              height={modalSize.height}
              onChange={(position) => {
                // console.log('TODO: add', position)
                _onChange(
                  'coordinates',
                  position.coordinates ?? emptyCoordinates
                )
              }}
            />
          </View>
        </View>
      </View>
    </View>
  )
}
