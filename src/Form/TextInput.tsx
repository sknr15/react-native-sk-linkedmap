import React from 'react'
import { TextInput as RNTextInput, TextInputProps, View } from 'react-native'
import { Text } from './Text'

interface ITextInputComponent extends TextInputProps {
  children?: string | string[] | number | Element | null
  label?: string
  bold?: boolean
  center?: boolean
  italic?: boolean
  largerText?: boolean
  onlyNumbers?: boolean
}

export const TextInput = (props: ITextInputComponent) => {
  const {
    children,
    label,
    bold,
    center,
    italic,
    largerText,
    style,
    onlyNumbers,
  } = props

  return (
    <View
      style={[
        {
          flexDirection: 'row',
          alignItems: 'center',
          marginBottom: 10,
        },
        style,
      ]}
    >
      {label && (
        <Text
          bold
          numberOfLines={1}
          style={{ fontSize: largerText ? 20 : 15, marginRight: 8 }}
        >
          {label}
        </Text>
      )}
      <RNTextInput
        {...props}
        testID={`input`}
        style={{
          color: 'black',
          fontSize: largerText ? 18 : 14,
          fontWeight: bold ? 'bold' : 'normal',
          textAlign: center ? 'center' : 'left',
          fontStyle: italic ? 'italic' : props.value ? 'normal' : 'italic',
          borderWidth: 1,
          borderRadius: 2,
          flex: 1,
          paddingHorizontal: 5,
          paddingVertical: 2,
        }}
        value={props.value ?? ''}
        placeholderTextColor={'grey'}
        onChangeText={(val) => {
          let _val = val
          if (onlyNumbers) {
            _val = _val.replace(/[^0-9]/g, '')
          }

          if (props.onChangeText) {
            props.onChangeText(_val)
          }
        }}
      >
        {children}
      </RNTextInput>
    </View>
  )
}
