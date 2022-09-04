import React from 'react'
import { TextInput as RNTextInput, TextInputProps, View } from 'react-native'
import { Text } from './Text'

interface IMultipleTextInputComponent extends TextInputProps {
  children?: string | string[] | number | Element | null
  label?: string
  bold?: boolean
  center?: boolean
  italic?: boolean
  largerText?: boolean
  onlyNumbers?: boolean
  inputValues?: any[]
}

export const MultipleTextInput = (props: IMultipleTextInputComponent) => {
  const {
    children,
    label,
    bold,
    center,
    italic,
    largerText,
    style,
    onlyNumbers,
    inputValues,
  } = props

  const _inputCount = inputValues?.length ?? 1

  const _renderInputs = () => {
    const elements: any[] = []

    const isLastItem = _inputCount - 1

    for (let idx = 0; idx < _inputCount; idx++) {
      elements.push(
        <RNTextInput
          {...props}
          testID={`input_${idx}`}
          key={`input_${idx}`}
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
            marginRight: idx === isLastItem ? 0 : 10,
          }}
          value={inputValues ? inputValues[idx].toString() : ''}
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
      )
    }

    return elements
  }

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
      {_renderInputs()}
    </View>
  )
}
