import React, { useState } from 'react';
import { TextInput as RNTextInput, TextInputProps, TouchableOpacity, View } from 'react-native';
import { Text } from './Text';

interface ISearchBarComponent extends TextInputProps {
	bold?: boolean;
	center?: boolean;
	largerText?: boolean;
	onClear?: () => void;
}

export const SearchBar = (props: ISearchBarComponent) => {
	const { bold, center, largerText, onClear, style } = props;

	const [containerHeight, setContainerHeight] = useState<number>(0);

	return (
		<View
			style={[
				{
					flexDirection: 'row',
					alignItems: 'center',
					paddingVertical: 10,
					height: 'auto'
				},
				style
			]}
		>
			<View
				style={{
					flex: 1,
					borderWidth: 1,
					borderRadius: 2,
					flexDirection: 'row',
					justifyContent: 'space-between'
				}}
			>
				<RNTextInput
					{...props}
					testID={`searchbar`}
					style={{
						flex: 1,
						color: 'black',
						fontSize: largerText ? 20 : 16,
						fontWeight: bold ? 'bold' : 'normal',
						textAlign: center ? 'center' : 'left',
						fontStyle: props.value ? 'normal' : 'italic',
						padding: 5,
						maxWidth: '100%'
					}}
					value={props.value ?? ''}
					placeholderTextColor={'grey'}
					onChangeText={(val) => {
						if (props.onChangeText) {
							props.onChangeText(val);
						}
					}}
					onLayout={(e) => setContainerHeight(e.nativeEvent.layout.height)}
				></RNTextInput>
				{props.value !== '' && (
					<TouchableOpacity
						style={{
							justifyContent: 'center',
							alignItems: 'center',
							backgroundColor: 'lightgrey',
							borderTopRightRadius: 2,
							borderBottomRightRadius: 2,
							height: containerHeight,
							width: containerHeight
						}}
						onPress={onClear}
					>
						<Text center>X</Text>
					</TouchableOpacity>
				)}
			</View>
		</View>
	);
};
