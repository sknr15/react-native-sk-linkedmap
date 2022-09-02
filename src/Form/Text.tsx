import React from 'react'
import { Text as RNText, TextProps } from 'react-native'

interface ITextComponent extends TextProps {
  bold?: boolean
  center?: boolean
  children?: string | string[] | number | Element | null
  italic?: boolean
  largerText?: boolean
}

export const Text = (props: ITextComponent) => {
  const { bold, center, children, italic, largerText, style } = props

  return (
    <RNText
      {...props}
      style={[
        {
          color: 'black',
          fontSize: largerText ? 18 : 14,
          fontWeight: bold ? 'bold' : 'normal',
          textAlign: center ? 'center' : 'left',
          fontStyle: italic ? 'italic' : 'normal',
        },
        style,
      ]}
    >
      {children}
    </RNText>
  )
}
