import React, { ReactNode, useRef, useState, useEffect } from 'react'
import { Animated, TouchableOpacity, View } from 'react-native'
import ImageZoom from 'react-native-image-pan-zoom'
import Image from 'react-native-scalable-image'
import { Text } from '../Form'
import { TMap, TPosition } from '../interfaces'

type Props = {
  testId: string
  map?: TMap
  height?: number
  width?: number
  zoomable?: boolean
  showText?: boolean
  onClick?: (position: TPosition) => void
}

export const Map = ({
  testId,
  map,
  height,
  width,
  zoomable,
  showText,
  onClick,
}: Props) => {
  if (map && map.imageSource) {
    const [containerSize, setContainerSize] = useState<{
      width: number
      height: number
    }>({ width: 0, height: 0 })

    const [sizeFactor, setSizeFactor] = useState<{
      width: number
      height: number
    }>({ width: 1, height: 1 })

    const animatedOpacityValue = useRef(new Animated.Value(0))
    const [isAnimationFinished, setIsAnimationFinished] =
      useState<boolean>(false)
    const HIGH = 0.5
    const LOW = 0.0
    const ANIMATIONDURATION = 500
    const ANIMATIONINITIALDELAY = 1000

    useEffect(() => {
      if (!isAnimationFinished) {
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
    })

    const _renderPositions = () => {
      const elements: ReactNode[] = []

      map.positions?.forEach((position) => {
        if (position.coordinates) {
          const { x1, x2, y1, y2 } = position.coordinates

          const top = (y1 / 100) * sizeFactor.height
          const left = (x1 / 100) * sizeFactor.width

          const width = ((x2 - x1) / 100) * sizeFactor.width
          const height = ((y2 - y1) / 100) * sizeFactor.height

          const size = Math.min(width, height) * 0.75

          if (onClick) {
            elements.push(
              <TouchableOpacity
                key={`${testId}_map_position_${position.key}`}
                testID={`${testId}_map_position_${position.key}`}
                style={{
                  position: 'absolute',
                  top,
                  left,
                  height,
                  width,
                  alignItems: 'center',
                  justifyContent: 'center',
                  zIndex: 10,
                  borderColor: 'red',
                  borderWidth: isAnimationFinished ? 1 : 0,
                }}
                onPress={onClick ? () => onClick(position) : undefined}
              >
                <Animated.View
                  style={{
                    width: size,
                    height: size,
                    backgroundColor: 'red',
                    borderRadius: 999,
                    opacity: animatedOpacityValue.current,
                  }}
                >
                  {showText && <Text>{position.title}</Text>}
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
                  justifyContent: 'center',
                  alignItems: 'center',
                  zIndex: 10,
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
