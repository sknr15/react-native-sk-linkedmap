import React from 'react'
import { ImageBackground } from 'react-native'
import { TMap, TPosition } from '..'

type Props = {
  map: TMap
  onChange?: (position: TPosition) => void
  width?: number
  height?: number
}

export const PositionPicker = ({ map, onChange, width, height }: Props) => {
  // if iOS or Android
  return (
    <ImageBackground
      source={typeof map.src === 'string' ? { uri: map.src } : map.src!}
      resizeMode='contain'
      style={{ width: width ?? '100%', height: height ?? '100%' }}
    >
      {/* Cropper */}
    </ImageBackground>
  )

  // if WEB
  // return (
  //   <ReactCrop onChange={() => {}}>
  //     {_renderImage(height, width, true)}
  //   </ReactCrop>
  // )
}
