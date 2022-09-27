import React from 'react'
import {
  TextInput as RNTextInput,
  TextInputProps,
  TouchableOpacity,
  View,
} from 'react-native'
import { Text } from './Text'

interface ISearchBarComponent extends TextInputProps {
  bold?: boolean
  center?: boolean
  largerText?: boolean
  onClear?: () => void
}

export const SearchBar = (props: ISearchBarComponent) => {
  const { bold, center, largerText, onClear, style } = props

  return (
    <View
      style={[
        {
          flexDirection: 'row',
          alignItems: 'center',
          marginVertical: 5,
          paddingVertical: 10,
        },
        style,
      ]}
    >
      <View
        style={{
          flex: 1,
          borderWidth: 1,
          borderRadius: 2,
          flexDirection: 'row',
          justifyContent: 'space-between',
        }}
      >
        <RNTextInput
          {...props}
          testID={`searchbar`}
          style={{
            color: 'black',
            fontSize: largerText ? 20 : 16,
            fontWeight: bold ? 'bold' : 'normal',
            textAlign: center ? 'center' : 'left',
            fontStyle: props.value ? 'normal' : 'italic',
            paddingHorizontal: 5,
            paddingVertical: 2,
            maxWidth: '100%',
          }}
          value={props.value ?? ''}
          placeholderTextColor={'grey'}
          onChangeText={(val) => {
            if (props.onChangeText) {
              props.onChangeText(val)
            }
          }}
        ></RNTextInput>
        {props.value !== '' && (
          <TouchableOpacity
            style={{
              justifyContent: 'center',
              alignItems: 'center',
              backgroundColor: 'lightgrey',
              paddingHorizontal: 8,
              borderTopRightRadius: 2,
              borderBottomRightRadius: 2,
            }}
            onPress={onClear}
          >
            <Text>X</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  )
}
