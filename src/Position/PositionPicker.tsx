import React from 'react'
import ReactCrop from 'react-image-crop'
import { ImageBackground, View } from 'react-native'
import { TextInput } from '../Form'
import { TMap } from '../Map'

export type TCoordinates = { x1: number; x2: number; y1: number; y2: number }
export type TPosition = {
  key: string
  title: string
  target: any
  coordinates?: TCoordinates
} // needs coordinates etc.

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
  // if iOS or Android
  return (
    <ImageBackground
      testID={`${testId}_pick_position`}
      source={
        typeof map.imageSource === 'string'
          ? { uri: map.imageSource }
          : map.imageSource ?? {}
      }
      resizeMode='contain'
      style={{ width: width ?? '100%', height: height ?? '100%' }}
      onLoad={() => {
        if (onChange) {
          onChange(position)
        }
      }}
    >
      {/* Cropper */}
    </ImageBackground>
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
