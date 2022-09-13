import React from 'react'
import {
  Dimensions,
  TextInput as RNTextInput,
  TextInputProps,
  View,
} from 'react-native'
import { Text } from './Text'

interface ITextInputComponent extends TextInputProps {
  bold?: boolean
  center?: boolean
  children?: string | string[] | number | Element | null
  italic?: boolean
  label?: string
  largerText?: boolean
  onlyNumbers?: boolean
}

export const TextInput = (props: ITextInputComponent) => {
  const {
    bold,
    center,
    children,
    italic,
    label,
    largerText,
    onlyNumbers,
    style,
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
      {label && Dimensions.get('window').width > 500 && (
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
          maxWidth: '100%',
        }}
        value={props.value ?? ''}
        placeholderTextColor={'grey'}
        onChangeText={(val) => {
          let _val = val
          if (onlyNumbers) {
            _val = _val.replace(/[^0-9\.]/g, '')
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
