import React, { useEffect, useState } from 'react';
import { Alert, Platform, TouchableOpacity, View, PermissionsAndroid } from 'react-native';
import { Text } from '../../Form';
import * as ImagePicker from 'expo-image-picker';
import { TMap } from '../../interfaces';
import { Map } from '../Map';

type Props = {
	map?: TMap;
	onChange?: (map: TMap) => void;
	testId: string;
};

export const MapPicker = ({ map, onChange, testId }: Props) => {
	const [hasPermissions, setHasPermissions] = useState<boolean>(false);
	const [tempMap, setTempMap] = useState<TMap | undefined>(map);

	useEffect(() => {
		_requestPermission();
	}, []);

	useEffect(() => {
		if (map) {
			setTempMap(map);
		}
	}, [map]);

	const _requestPermission = async () => {
		switch (Platform.OS) {
			case 'android':
				try {
					const granted = await PermissionsAndroid.request('android.permission.READ_EXTERNAL_STORAGE');
					setHasPermissions(granted === PermissionsAndroid.RESULTS.GRANTED);
				} catch {
					setHasPermissions(false);
				}
				return;
			case 'ios':
				try {
					const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
					setHasPermissions(status === ImagePicker.PermissionStatus.GRANTED);
				} catch {
					setHasPermissions(false);
				}
				return;
			case 'web':
			default:
				setHasPermissions(true);
				return;
		}
	};

	const _pickImage = async () => {
		if (__DEV__) {
			// for testing in development mode
			if (tempMap) {
				let _src = require('../../Assets/mapExample2.png');

				if (tempMap?.imageSource === _src) {
					_src = require('../../Assets/mapExample.png') ?? {
						uri: 'https://www.edrawsoft.com/images/examples/office%20position.png'
					};
				}

				let _positions = tempMap.positions;

				if (tempMap.positions && tempMap.positions.length > 0) {
					if (Platform.OS === 'web') {
						const result = window?.confirm(`Do you want to reset the positions?`);

						if (result) {
							_positions = [];
						}
					} else {
						Alert.alert('Reset?', `Do you want to reset the positions?`, [
							{
								text: 'No',
								style: 'cancel'
							},
							{
								text: 'Yes',
								onPress: () => {
									setTempMap({ ...tempMap, imageSource: _src, positions: [] });
									if (onChange) {
										onChange({ ...tempMap, imageSource: _src, positions: [] });
									}
									return;
								},
								style: 'destructive'
							}
						]);
					}
				}

				setTempMap({
					...tempMap,
					imageSource: _src,
					positions: _positions
				});

				if (onChange) {
					onChange({
						...tempMap,
						imageSource: _src,
						positions: _positions
					});
				}
			}
		} else {
			if (!hasPermissions) {
				if (Platform.OS === 'web') {
					window?.confirm('No permissions to media library');
				} else {
					Alert.alert('No permission', 'No permissions to media library', [{ text: 'OK' }]);
				}
				return;
			}

			try {
				const pickedMedia = await ImagePicker.launchImageLibraryAsync({
					mediaTypes: ImagePicker.MediaTypeOptions.Images,
					allowsEditing: true,
					quality: 0.66,
					base64: true
				});

				if (!pickedMedia) {
					return;
				}

				if (!pickedMedia.cancelled) {
					let uri = pickedMedia.uri;
					if (pickedMedia.height > 4096 || pickedMedia.width > 4096) {
						Alert.alert('Image too big', 'Selected image is too big (> 4096)', [{ text: 'OK' }]);
						return;
					}

					if (tempMap) {
						let _positions = tempMap.positions;

						if (tempMap.positions && tempMap.positions.length > 0) {
							if (Platform.OS === 'web') {
								const result = window?.confirm(`Do you want to reset the positions?`);

								if (result) {
									_positions = [];
								}
							} else {
								Alert.alert('Reset?', `Do you want to reset the positions?`, [
									{
										text: 'No',
										style: 'cancel'
									},
									{
										text: 'Yes',
										onPress: () => {
											setTempMap({ ...tempMap, imageSource: { uri }, positions: [] });
											if (onChange) {
												onChange({ ...tempMap, imageSource: { uri }, positions: [] });
											}
											return;
										},
										style: 'destructive'
									}
								]);
							}
						}

						setTempMap({
							...tempMap,
							imageSource: { uri },
							positions: _positions
						});

						if (onChange)
							onChange({
								...tempMap,
								imageSource: { uri },
								positions: _positions
							});
					}
				}
			} catch (error) {
				console.log(error);
			}
		}
	};

	const _getImageName = () => {
		let source = '';

		switch (typeof tempMap?.imageSource) {
			case 'number':
			case 'string':
				source = tempMap.imageSource.toString();
				break;
			case 'object':
				source = (Array.isArray(tempMap.imageSource) ? tempMap.imageSource[0].uri : tempMap.imageSource.uri) ?? '';
				break;
			default:
				break;
		}

		return ' ' + source + ' ';
	};

	return (
		<View style={{ flex: 1 }}>
			{/* <View style={{ marginBottom: 10 }}>
				<Text style={{ color: 'red' }}>Attention: All linked positions will be deleted on change!</Text>
			</View> */}
			<View style={{ flex: 1, marginBottom: 10 }}>
				<View style={{ marginBottom: 10 }}>
					<TouchableOpacity
						style={{
							paddingVertical: 10,
							paddingHorizontal: 15,
							alignSelf: 'center',
							alignItems: 'center',
							justifyContent: 'center',
							backgroundColor: '#448AFF',
							borderRadius: 5,
							width: Platform.OS === 'web' ? 'auto' : '100%',
							marginBottom: 5
						}}
						onPress={async () => {
							_pickImage();
						}}
					>
						<Text style={{ fontSize: 16, color: 'white' }}>Choose image...</Text>
					</TouchableOpacity>
					<Text
						style={{
							alignSelf: 'center',
							maxWidth: '60%',
							fontStyle: 'italic',
							paddingHorizontal: 10
						}}
						numberOfLines={2}
						center
					>
						{`Image:${_getImageName()}`}
					</Text>
				</View>
				<View
					style={{
						flexGrow: 1,
						borderWidth: 1
					}}
				>
					<Map testId="mappicker" map={tempMap} showImageSize showPositionTitle zoomable={false} />
				</View>
			</View>
		</View>
	);
};
