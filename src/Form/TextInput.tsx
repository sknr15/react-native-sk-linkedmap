import React from 'react'
import { TextInput as RNTextInput, TextInputProps } from 'react-native'

interface ITextInputComponent extends TextInputProps {
  bold?: boolean
  center?: boolean
  children?: string | string[] | number | Element | null
  italic?: boolean
  largerText?: boolean
}

export const TextInput = (props: ITextInputComponent) => {
  const { bold, center, children, italic, largerText, style } = props

  return (
    <RNTextInput
      {...props}
      style={[
        {
          color: 'black',
          fontSize: largerText ? 18 : 14,
          fontWeight: bold ? 'bold' : 'normal',
          textAlign: center ? 'center' : 'left',
          fontStyle: italic ? 'italic' : props.value ? 'normal' : 'italic',
        },
        style,
      ]}
    >
      {children}
    </RNTextInput>
  )
}
