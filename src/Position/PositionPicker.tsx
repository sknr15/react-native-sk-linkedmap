import React, { createRef, useEffect, useRef, useState } from 'react'
import { Platform, ScrollView, TouchableOpacity, View } from 'react-native'
import ImageZoom from 'react-native-image-pan-zoom'
import Image from 'react-native-scalable-image'
import { emptyCoordinates, TCoordinates, TMap, TPosition } from '../interfaces'
import { Rnd } from 'react-rnd'

type ResizeDirection =
  | 'top'
  | 'right'
  | 'bottom'
  | 'left'
  | 'topRight'
  | 'topLeft'
  | 'bottomRight'
  | 'bottomLeft'

type Props = {
  height?: number
  map: TMap
  onChange?: (position: TPosition) => void
  position: TPosition
  testId: string
  width?: number
}

export const PositionPicker = ({
  height,
  map,
  onChange,
  position,
  testId,
  width,
}: Props) => {
  const IS_WEB = Platform.OS === 'web'
  const [containerSize, setContainerSize] = useState<{
    width: number
    height: number
  }>({ width: 0, height: 0 })

  const [sizeFactor, setSizeFactor] = useState<{
    width: number
    height: number
    x: number
    y: number
  }>({ width: 0, height: 0, x: 0, y: 0 })

  const [newCoordinates, setNewCoordinates] = useState<TCoordinates>(
    position.coordinates ?? emptyCoordinates
  )

  const [isSingleTouch, setIsSingleTouch] = useState<boolean>(true)

  const imgZoomRef = createRef<ImageZoom>()
  const scrollRef = useRef<ScrollView | null>(null)
  const [isHorizontal, setIsHorizontal] = useState<boolean>(false)
  const [hasScrolled, setHasScrolled] = useState<boolean>(false)

  useEffect(() => {
    if (
      newCoordinates &&
      JSON.stringify(newCoordinates) !==
        JSON.stringify(position.coordinates ?? emptyCoordinates)
    ) {
      _handleChange()
    }
  }, [newCoordinates])

  useEffect(() => {
    if (sizeFactor && containerSize) {
      if (sizeFactor.width > containerSize.width) {
        if (!isHorizontal) {
          setIsHorizontal(true)
        }
      } else {
        if (isHorizontal) {
          setIsHorizontal(false)
        }
      }
    }
  }, [sizeFactor, containerSize])

  const _handleChange = () => {
    if (onChange) {
      onChange({ ...position, coordinates: newCoordinates })
    }
  }

  const _handleCoordinates = (
    x1: number,
    y1: number,
    x2?: number,
    y2?: number
  ) => {
    let _coordinates = { ...newCoordinates }
    let x = x1
    let y = y1

    if (IS_WEB && imgZoomRef.current) {
      x = x / imgZoomRef.current['scale']
      y = y / imgZoomRef.current['scale']
    }
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

  const _handleResize = (
    direction: ResizeDirection,
    newX: number,
    newY: number
  ) => {
    direction
    let _coordinates = { ...newCoordinates }

    switch (direction) {
      case 'top':
        _coordinates = { ..._coordinates, y1: _coordinates.y1 - newY }
        break
      case 'topRight':
        _coordinates = {
          ..._coordinates,
          x2: _coordinates.x2 + newX,
          y1: _coordinates.y1 - newY,
        }
        break
      case 'right':
        _coordinates = { ..._coordinates, x2: _coordinates.x2 + newX }
        break
      case 'bottomRight':
        _coordinates = {
          ..._coordinates,
          x2: _coordinates.x2 + newX,
          y2: _coordinates.y2 + newY,
        }
        break
      case 'bottom':
        _coordinates = { ..._coordinates, y2: _coordinates.y2 + newY }
        break
      case 'bottomLeft':
        _coordinates = {
          ..._coordinates,
          x1: _coordinates.x1 - newX,
          y2: _coordinates.y2 + newY,
        }
        break
      case 'left':
        _coordinates = { ..._coordinates, x1: _coordinates.x1 - newX }
        break
      case 'topLeft':
        _coordinates = {
          ..._coordinates,
          x1: _coordinates.x1 - newX,
          y1: _coordinates.y1 - newY,
        }
        break
    }

    setNewCoordinates({ ..._coordinates })
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

      const _width = ((x2 - x1) / 100) * sizeFactor.width
      const _height = ((y2 - y1) / 100) * sizeFactor.height

      const posX =
        (x1 / 100) *
          sizeFactor.width *
          (imgZoomRef.current ? imgZoomRef.current['scale'] : 1) +
        sizeFactor.x
      const posY =
        (y1 / 100) *
          sizeFactor.height *
          (imgZoomRef.current ? imgZoomRef.current['scale'] : 1) +
        sizeFactor.y

      if (IS_WEB) {
        if (isHorizontal) {
          if (
            posX > 0 &&
            x2 > 0 &&
            y2 > 0 &&
            scrollRef.current &&
            !hasScrolled
          ) {
            let scrollTo = Math.max(
              posX + _width / 2 - containerSize.width / 2,
              0
            )
            scrollRef.current.scrollTo({ x: scrollTo, y: 0 })
            setHasScrolled(true)
          }
        } else {
          if (
            posY > 0 &&
            x2 > 0 &&
            y2 > 0 &&
            scrollRef.current &&
            !hasScrolled
          ) {
            let scrollTo = Math.max(
              posY + _height / 2 - containerSize.height / 2,
              0
            )
            scrollRef.current.scrollTo({ x: 0, y: scrollTo })
            setHasScrolled(true)
          }
        }

        return (
          <Rnd
            default={{
              x: posX,
              y: posY,
              height: Math.max(_height, 0),
              width: Math.max(_width, 0),
            }}
            position={{
              x: posX,
              y: posY,
            }}
            size={{
              height: Math.max(_height, 0),
              width: Math.max(_width, 0),
            }}
            style={{
              backgroundColor: '#ff000099',
              borderColor: 'red',
              borderWidth: 2,
            }}
            onDragStart={() => setIsSingleTouch(true)}
            onDrag={(e, d) => {
              setIsSingleTouch(false)
              if (d.deltaX || d.deltaY) {
                let _coordinates = { ...newCoordinates }
                const { x1, x2, y1, y2 } = _coordinates
                _coordinates = {
                  ..._coordinates,
                  x1: x1 + (d.deltaX / sizeFactor.width) * 100,
                  x2: x2 + (d.deltaX / sizeFactor.width) * 100,
                  y1: y1 + (d.deltaY / sizeFactor.height) * 100,
                  y2: y2 + (d.deltaY / sizeFactor.height) * 100,
                }
                setNewCoordinates({ ..._coordinates })
              }
            }}
            onDragStop={() => {
              setTimeout(() => {
                setIsSingleTouch(true)
              }, 500)
            }}
            onResizeStop={(e, direction, ref, delta, position) => {
              let deltaX = (delta.width / sizeFactor.width) * 100
              let deltaY = (delta.height / sizeFactor.height) * 100

              _handleResize(direction, deltaX, deltaY)
            }}
            bounds={'parent'}
          ></Rnd>
        )
      }

      return (
        <View
          key={`${testId}_map_position_${position.key}`}
          testID={`${testId}_map_position_${position.key}`}
          style={{
            position: 'absolute',
            left: (x1 / 100) * sizeFactor.width,
            top: (y1 / 100) * sizeFactor.height,
            width: Math.max(_width, 0),
            height: Math.max(_height, 0),
            borderWidth: x2 && y2 ? 2 : 1,
            borderColor: 'red',
            justifyContent: 'center',
            alignItems: 'center',
            zIndex: 10,
            backgroundColor: '#ff000033',
          }}
          pointerEvents={'none'}
        />
      )
    }

    return null
  }

  const _renderMap = () => {
    if (map && map.imageSource) {
      if (IS_WEB) {
        const size = Math.max(
          height ?? containerSize.height,
          width ?? containerSize.width
        )
        return (
          <ScrollView ref={scrollRef} horizontal={isHorizontal}>
            <TouchableOpacity
              activeOpacity={1}
              style={{
                flex: 1,
                alignSelf: 'center',
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: 'transparent',
              }}
              onPressOut={(e) => {
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
                height={Math.max(size, containerSize.height)}
                width={Math.max(size, containerSize.width)}
                onLayout={(e) => {
                  setSizeFactor(e.nativeEvent.layout)
                  setHasScrolled(false)
                }}
              ></Image>
              {_renderPosition()}
              {_renderNewPosition()}
            </TouchableOpacity>
          </ScrollView>
        )
      }

      return (
        <View
          style={{
            flex: 1,
            alignSelf: 'center',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: 'transparent',
          }}
          onTouchStart={(e) => {
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
            onLayout={(e) => {
              setSizeFactor(e.nativeEvent.layout)
            }}
          ></Image>
          {_renderPosition()}
          {_renderNewPosition()}
        </View>
      )
    }
  }

  if (map && map.imageSource) {
    // No cropper yet, positions are created via two clicks (1st + 2nd coordinates)
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
          ref={imgZoomRef}
          cropHeight={height ?? containerSize.height}
          cropWidth={width ?? containerSize.width}
          imageHeight={height ?? containerSize.height}
          imageWidth={width ?? containerSize.width}
          minScale={1}
          maxScale={IS_WEB ? 1 : 3}
          enableDoubleClickZoom={false}
        >
          {_renderMap()}
        </ImageZoom>
      </View>
    )
  }

  return null
}
