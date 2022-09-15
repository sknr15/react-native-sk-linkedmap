import React, { ReactNode, useRef, useState, useEffect, createRef } from 'react'
import {
  Animated,
  TextStyle,
  TouchableOpacity,
  View,
  ViewStyle,
} from 'react-native'
import ImageZoom from 'react-native-image-pan-zoom'
import Image from 'react-native-scalable-image'
import { Text } from '../Form'
import { TMap, TPosition } from '../interfaces'

type Props = {
  activePosition?: TPosition
  height?: number
  map?: TMap
  onClick?: (position: TPosition) => void
  positionStyle?: ViewStyle
  showText?: boolean
  showZoomButtons?: boolean
  testId: string
  width?: number
  zoomable?: boolean
  zoomButtonsStyle?: ViewStyle & TextStyle
}

export const Map = ({
  activePosition,
  height,
  map,
  onClick,
  positionStyle,
  showText,
  showZoomButtons,
  testId,
  width,
  zoomable,
  zoomButtonsStyle,
}: Props) => {
  if (map && map.imageSource) {
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

    const zoomRef = createRef<ImageZoom>()

    const animatedOpacityValue = useRef(new Animated.Value(0))
    const [isAnimationFinished, setIsAnimationFinished] =
      useState<boolean>(false)
    const HIGH = 0.5
    const LOW = 0.0
    const ANIMATIONDURATION = 500
    const ANIMATIONINITIALDELAY = 1000

    useEffect(() => {
      // Animated dots for positions
      if (!positionStyle) {
        if (onClick && !isAnimationFinished) {
          Animated.loop(
            Animated.sequence([
              Animated.timing(animatedOpacityValue.current, {
                toValue: HIGH,
                duration: ANIMATIONDURATION,
                delay: ANIMATIONINITIALDELAY,
                useNativeDriver: true,
              }),
              Animated.timing(animatedOpacityValue.current, {
                toValue: LOW,
                duration: ANIMATIONDURATION,
                useNativeDriver: true,
              }),
              Animated.timing(animatedOpacityValue.current, {
                toValue: HIGH,
                duration: ANIMATIONDURATION,
                useNativeDriver: true,
              }),
              Animated.timing(animatedOpacityValue.current, {
                toValue: LOW,
                duration: 2500,
                useNativeDriver: true,
              }),
            ]),
            { iterations: 3 }
          ).start((e) => setIsAnimationFinished(e.finished))
        }
      }
    })

    const _renderPositions = () => {
      const elements: ReactNode[] = []

      map.positions?.forEach((position) => {
        if (position.coordinates) {
          const { x1, x2, y1, y2 } = position.coordinates

          const left = (x1 / 100) * sizeFactor.width + sizeFactor.x
          const top = (y1 / 100) * sizeFactor.height + sizeFactor.y

          const width = ((x2 - x1) / 100) * sizeFactor.width
          const height = ((y2 - y1) / 100) * sizeFactor.height

          const size = Math.min(width, height) * 0.75

          const isActivePosition =
            !activePosition?.key ||
            activePosition.key === '' ||
            position.key === activePosition?.key

          if (onClick) {
            elements.push(
              <TouchableOpacity
                key={`${testId}_map_position_${position.key}`}
                testID={`${testId}_map_position_${position.key}`}
                style={
                  isActivePosition
                    ? {
                        position: 'absolute',
                        top,
                        left,
                        height,
                        width,
                        borderWidth:
                          position.key === activePosition?.key
                            ? 3
                            : isAnimationFinished
                            ? 2
                            : 0,
                        borderColor: 'red',
                        borderRadius: 1,
                        alignItems: 'center',
                        justifyContent: 'center',
                        zIndex: 10,
                        ...positionStyle,
                      }
                    : {
                        position: 'absolute',
                        top,
                        left,
                        height,
                        width,
                        alignItems: 'center',
                        justifyContent: 'center',
                        ...positionStyle,
                      }
                }
                onPress={() => onClick(position)}
              >
                <Animated.View
                  style={
                    positionStyle
                      ? { opacity: positionStyle.opacity ?? 1 }
                      : isActivePosition
                      ? {
                          width: size,
                          height: size,
                          backgroundColor: 'red',
                          borderRadius: 999,
                          opacity: animatedOpacityValue.current,
                        }
                      : { width: size, height: size }
                  }
                >
                  {showText && (
                    <Text
                      center
                      style={{ fontSize: 10, paddingHorizontal: 10 }}
                      adjustsFontSizeToFit
                    >
                      {position.title}
                    </Text>
                  )}
                </Animated.View>
              </TouchableOpacity>
            )
          } else {
            elements.push(
              <View
                key={`${testId}_map_position_${position.key}`}
                testID={`${testId}_map_position_${position.key}`}
                style={{
                  position: 'absolute',
                  top,
                  left,
                  height,
                  width,
                  borderWidth: 1,
                  borderColor: 'red',
                  borderRadius: 1,
                  justifyContent: 'center',
                  alignItems: 'center',
                  zIndex: 10,
                  ...positionStyle,
                }}
              >
                {showText && (
                  <Text
                    center
                    style={{ fontSize: 10, paddingHorizontal: 10 }}
                    adjustsFontSizeToFit
                  >
                    {position.title}
                  </Text>
                )}
              </View>
            )
          }
        }
      })

      if (elements.length > 0) {
        return elements
      }

      return null
    }

    const _handleZoom = (type: 'in' | 'out' | 'reset') => {
      if (zoomRef.current) {
        switch (type) {
          case 'in':
            console.log('TODO: Zoom in')
            break
          case 'out':
            console.log('TODO: Zoom out')
            break
          case 'reset':
            zoomRef.current.reset()
            break
        }
      }
    }

    const _renderZoomButtons = () => {
      if (showZoomButtons) {
        const fontStyle = {
          fontFamily: zoomButtonsStyle?.fontFamily,
          fontSize: zoomButtonsStyle?.fontSize,
          fontStyle: zoomButtonsStyle?.fontStyle,
          fontWeight: zoomButtonsStyle?.fontWeight,
        }
        return (
          <View style={{ position: 'absolute', bottom: 0, right: 0 }}>
            <View
              style={{ marginBottom: zoomButtonsStyle?.marginBottom ? 0 : 5 }}
            >
              <TouchableOpacity
                testID={`${testId}_button_zoomIn`}
                style={{
                  alignItems: 'center',
                  backgroundColor: 'grey',
                  borderRadius: 999,
                  justifyContent: 'center',
                  padding: 5,
                  ...zoomButtonsStyle,
                }}
                onPress={() => _handleZoom('in')}
              >
                <Text center largerText style={fontStyle}>
                  +
                </Text>
              </TouchableOpacity>
            </View>
            <View
              style={{ marginBottom: zoomButtonsStyle?.marginBottom ? 0 : 5 }}
            >
              <TouchableOpacity
                testID={`${testId}_button_zoomOut`}
                style={{
                  alignItems: 'center',
                  backgroundColor: 'grey',
                  borderRadius: 999,
                  justifyContent: 'center',
                  padding: 5,
                  ...zoomButtonsStyle,
                }}
                onPress={() => _handleZoom('out')}
              >
                <Text center largerText style={fontStyle}>
                  -
                </Text>
              </TouchableOpacity>
            </View>
            <View>
              <TouchableOpacity
                testID={`${testId}_button_resetZoom`}
                style={{
                  alignItems: 'center',
                  backgroundColor: 'grey',
                  borderRadius: 999,
                  justifyContent: 'center',
                  padding: 5,
                  ...zoomButtonsStyle,
                }}
                onPress={() => _handleZoom('reset')}
              >
                <Text center largerText style={fontStyle}>
                  x
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        )
      }

      return null
    }

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
          ref={zoomRef}
          cropHeight={height ?? containerSize.height}
          cropWidth={width ?? containerSize.width}
          imageHeight={height ?? containerSize.height}
          imageWidth={width ?? containerSize.width}
          minScale={1}
          maxScale={zoomable ? 3 : 1}
          enableCenterFocus={false}
        >
          <View
            style={{
              flex: 1,
              alignSelf: 'center',
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: 'transparent',
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
            />
            {_renderPositions()}
          </View>
        </ImageZoom>
        {_renderZoomButtons()}
        {showText && (
          <View
            style={{
              position: 'absolute',
              bottom: 0,
              right: 0,
              padding: 4,
              backgroundColor: '#FFFFFFAA',
              borderTopLeftRadius: 5,
            }}
          >
            <Text style={{ fontSize: 10 }}>
              {Math.round(sizeFactor.height * 100) / 100} x
              {Math.round(sizeFactor.width * 100) / 100}
            </Text>
          </View>
        )}
      </View>
    )
  }

  return (
    <View>
      <Text>No image selected</Text>
    </View>
  )
}
