import React, { useEffect, useState } from 'react'
import { View } from 'react-native'
import ImageZoom from 'react-native-image-pan-zoom'
import Image from 'react-native-scalable-image'
import { emptyCoordinates, TCoordinates, TMap, TPosition } from '../interfaces'

type Props = {
  testId: string
  map: TMap
  position: TPosition
  onChange?: (position: TPosition) => void
  width?: number
  height?: number
}

export const PositionPicker = ({
  testId,
  map,
  position,
  onChange,
  width,
  height,
}: Props) => {
  const [containerSize, setContainerSize] = useState<{
    width: number
    height: number
  }>({ width: 0, height: 0 })

  const [sizeFactor, setSizeFactor] = useState<{
    width: number
    height: number
  }>({ width: 1, height: 1 })

  const [newCoordinates, setNewCoordinates] = useState<TCoordinates>(
    position.coordinates ?? emptyCoordinates
  )

  const [isSingleTouch, setIsSingleTouch] = useState<boolean>(true)

  useEffect(() => {
    if (
      newCoordinates &&
      JSON.stringify(newCoordinates) !==
        JSON.stringify(position.coordinates ?? emptyCoordinates)
    ) {
      _handleChange()
    }
  }, [newCoordinates])

  const _handleChange = () => {
    if (onChange) {
      onChange({ ...position, coordinates: newCoordinates })
    }
  }

  const _handleCoordinates = (
    x: number,
    y: number,
    x2?: number,
    y2?: number
  ) => {
    let _coordinates = { ...newCoordinates }
    if (x2 && y2) {
      _coordinates = { x1: x, x2, y1: y, y2 }
    } else {
      if (
        // if change is too small -> accidental tap
        Math.abs(x - _coordinates.x1) < 2.5 ||
        Math.abs(y - _coordinates.y1) < 2.5
      ) {
        _coordinates = { ...emptyCoordinates, x1: x, y1: y }
      } else if (_coordinates.x1 === 0 && _coordinates.y1 === 0) {
        // if x1 & y1 NOT set -> set x1 & y1
        _coordinates = { ...emptyCoordinates, x1: x, y1: y }
      } else if (_coordinates.x2 !== 0 && _coordinates.y2 !== 0) {
        // if all coordinates set -> clear and set x1 & y1
        _coordinates = { ...emptyCoordinates, x1: x, y1: y }
      } else {
        // if x1 & y1 set are -> set x2 & y2 depending on position
        // if x1 or y1 are bigger than x2 or y2 -> swap numbers
        if (x < _coordinates.x1) {
          _coordinates = { ..._coordinates, x2: _coordinates.x1, x1: x }
        } else {
          _coordinates = { ..._coordinates, x2: x }
        }
        if (y < _coordinates.y1) {
          _coordinates = { ..._coordinates, y2: _coordinates.y1, y1: y }
        } else {
          _coordinates = { ..._coordinates, y2: y }
        }
      }
    }

    setNewCoordinates({ ..._coordinates })
  }

  const _renderNewPosition = () => {
    return
  }

  const _renderPosition = () => {
    if (position.coordinates) {
      const { x1, x2, y1, y2 } = position.coordinates

      if (
        JSON.stringify(position.coordinates) ===
        JSON.stringify(emptyCoordinates)
      ) {
        return null
      }

      return (
        <View
          key={`${testId}_map_position_${position.key}`}
          testID={`${testId}_map_position_${position.key}`}
          style={{
            position: 'absolute',
            left: (x1 / 100) * sizeFactor.width,
            top: (y1 / 100) * sizeFactor.height,
            width: ((x2 - x1) / 100) * sizeFactor.width,
            height: ((y2 - y1) / 100) * sizeFactor.height,
            borderWidth: x2 && y2 ? 2 : 1,
            borderColor: 'red',
            justifyContent: 'center',
            alignItems: 'center',
            zIndex: 10,
            backgroundColor: '#ff000033',
          }}
        />
      )
    }

    return null
  }

  if (map && map.imageSource) {
    // No cropper yet, positions are created via two clicks (1st + 2nd coordinates)

    // if iOS or Android
    return (
      <View
        testID={`${testId}_map`}
        style={{
          flex: 1,
          width: '100%',
          height: '100%',
        }}
        onLayout={(e) => setContainerSize(e.nativeEvent.layout)}
      >
        <ImageZoom
          cropHeight={height ?? containerSize.height}
          cropWidth={width ?? containerSize.width}
          imageHeight={height ?? containerSize.height}
          imageWidth={width ?? containerSize.width}
          minScale={1}
          maxScale={3}
        >
          <View
            style={{
              flex: 1,
              alignSelf: 'center',
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: 'transparent',
            }}
            onTouchStart={() => {
              setIsSingleTouch(true)
            }}
            onTouchMove={() => setIsSingleTouch(false)}
            onTouchEnd={(e) => {
              const { locationX, locationY } = e.nativeEvent
              if (isSingleTouch) {
                _handleCoordinates(
                  (locationX / sizeFactor.width) * 100,
                  (locationY / sizeFactor.height) * 100
                )
              }
            }}
          >
            <Image
              testID={`${testId}_map_image`}
              source={map.imageSource}
              resizeMode='contain'
              resizeMethod='scale'
              height={height ?? containerSize.height}
              width={width ?? containerSize.width}
              onLayout={(e) => setSizeFactor(e.nativeEvent.layout)}
            ></Image>
            {_renderPosition()}
            {_renderNewPosition()}
          </View>
        </ImageZoom>
      </View>
    )

    // if WEB
    // return (
    //   <ReactCrop onChange={() => onChange()}>
    //     <ImageBackground
    //       source={typeof map.src === 'string' ? { uri: map.src } : map.src ?? {}}
    //       resizeMode='contain'
    //       style={{ width: width ?? '100%', height: height ?? '100%' }}
    //     />
    //   </ReactCrop>
    // )
  }

  return null
}
