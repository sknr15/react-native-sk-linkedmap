import React from 'react'
import ReactCrop from 'react-image-crop'
import { ImageBackground } from 'react-native'
import { TMap } from '../Map'

export type TPosition = { key: string; title: string; target: any } // needs coordinates etc.

type Props = {
  testId: string
  map: TMap
  onChange?: (position: TPosition) => void
  width?: number
  height?: number
}

export const PositionPicker = ({
  testId,
  map,
  onChange,
  width,
  height,
}: Props) => {
  // if iOS or Android
  return (
    <ImageBackground
      testID={`${testId}_pick_position`}
      source={typeof map.src === 'string' ? { uri: map.src } : map.src ?? {}}
      resizeMode='contain'
      style={{ width: width ?? '100%', height: height ?? '100%' }}
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
