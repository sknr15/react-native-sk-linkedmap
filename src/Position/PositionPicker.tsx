import React, { createRef, useEffect, useRef, useState } from 'react';
import { Platform, ScrollView, TouchableOpacity, View } from 'react-native';
import ImageZoom from 'react-native-image-pan-zoom';
import Image from 'react-native-scalable-image';
import { emptyCoordinates, TCoordinates, TMap, TPosition } from '../interfaces';

type Props = {
	height?: number;
	map: TMap;
	onChange?: (position: TPosition) => void;
	position: TPosition;
	testId: string;
	width?: number;
};

export const PositionPicker = ({ height, map, onChange, position, testId, width }: Props) => {
	const [containerSize, setContainerSize] = useState<{
		height: number;
		width: number;
	}>({ height: 0, width: 0 });

	const [sizeFactor, setSizeFactor] = useState<{
		height: number;
		width: number;
		x: number;
		y: number;
	}>({ height: 0, width: 0, x: 0, y: 0 });

	const [newCoordinates, setNewCoordinates] = useState<TCoordinates>(position.coordinates ?? emptyCoordinates);

	const [isSingleTouch, setIsSingleTouch] = useState<boolean>(true);

	const imgZoomRef = createRef<ImageZoom>();
	const scrollRef = useRef<ScrollView | null>(null);
	const [isHorizontal, setIsHorizontal] = useState<boolean>(false);
	const [hasScrolled, setHasScrolled] = useState<boolean>(false);

	useEffect(() => {
		if (newCoordinates && JSON.stringify(newCoordinates) !== JSON.stringify(position.coordinates ?? emptyCoordinates)) {
			_handleChange();
		}
	}, [newCoordinates]);

	useEffect(() => {
		if (sizeFactor && containerSize) {
			if (sizeFactor.width > containerSize.width) {
				if (!isHorizontal) {
					setIsHorizontal(true);
				}
			} else {
				if (isHorizontal) {
					setIsHorizontal(false);
				}
			}
		}
	}, [sizeFactor, containerSize]);

	const _handleChange = () => {
		if (onChange) {
			onChange({ ...position, coordinates: newCoordinates });
		}
	};

	const _handleCoordinates = (x1: number, y1: number, x2?: number, y2?: number) => {
		let _coordinates = { ...newCoordinates };
		let x = x1;
		let y = y1;

		if (x2 && y2) {
			_coordinates = { x1: x, x2, y1: y, y2 };
		} else {
			if (
				// if change is too small -> accidental tap
				Math.abs(x - _coordinates.x1) < 2.5 ||
				Math.abs(y - _coordinates.y1) < 2.5
			) {
				_coordinates = { ...emptyCoordinates, x1: x, y1: y };
			} else if (_coordinates.x1 === 0 && _coordinates.y1 === 0) {
				// if x1 & y1 NOT set -> set x1 & y1
				_coordinates = { ...emptyCoordinates, x1: x, y1: y };
			} else if (_coordinates.x2 !== 0 && _coordinates.y2 !== 0) {
				// if all coordinates set -> clear and set x1 & y1
				_coordinates = { ...emptyCoordinates, x1: x, y1: y };
			} else {
				// if x1 & y1 set are -> set x2 & y2 depending on position
				// if x1 or y1 are bigger than x2 or y2 -> swap numbers
				if (x < _coordinates.x1) {
					_coordinates = {
						..._coordinates,
						x2: _coordinates.x1,
						x1: x
					};
				} else {
					_coordinates = { ..._coordinates, x2: x };
				}
				if (y < _coordinates.y1) {
					_coordinates = {
						..._coordinates,
						y2: _coordinates.y1,
						y1: y
					};
				} else {
					_coordinates = { ..._coordinates, y2: y };
				}
			}
		}

		setNewCoordinates({ ..._coordinates });
	};

	const _renderPosition = () => {
		if (position.coordinates) {
			const { x1, x2, y1, y2 } = position.coordinates;

			if (JSON.stringify(position.coordinates) === JSON.stringify(emptyCoordinates)) {
				return null;
			}

			const _height = ((y2 - y1) / 100) * sizeFactor.height;
			const _width = ((x2 - x1) / 100) * sizeFactor.width;

			return (
				<View
					key={`${testId}_map_position_${position.key}`}
					testID={`${testId}_map_position_${position.key}`}
					style={{
						position: 'absolute',
						left: (x1 / 100) * sizeFactor.width + sizeFactor.x,
						top: (y1 / 100) * sizeFactor.height + sizeFactor.y,
						height: Math.max(_height, 0),
						width: Math.max(_width, 0),
						borderWidth: x2 && y2 ? 2 : 1,
						borderColor: 'red',
						justifyContent: 'center',
						alignItems: 'center',
						zIndex: 10,
						backgroundColor: '#ff000033'
					}}
					pointerEvents={'none'}
				/>
			);
		}

		return null;
	};

	const _renderMap = () => {
		if (map && map.imageSource) {
			return (
				<View
					style={{
						flex: 1,
						alignSelf: 'center',
						alignItems: 'center',
						justifyContent: 'center',
						backgroundColor: 'transparent'
					}}
					onTouchStart={(e) => {
						setIsSingleTouch(true);
					}}
					onTouchMove={() => setIsSingleTouch(false)}
					onTouchEnd={(e) => {
						const { locationX, locationY } = e.nativeEvent;
						if (isSingleTouch) {
							_handleCoordinates((locationX / sizeFactor.width) * 100, (locationY / sizeFactor.height) * 100);
						}
					}}
				>
					<Image
						testID={`${testId}_map_image`}
						source={map.imageSource}
						resizeMode="contain"
						resizeMethod="scale"
						height={height ?? containerSize.height}
						width={width ?? containerSize.width}
						onLayout={(e) => {
							setSizeFactor(e.nativeEvent.layout);
						}}
					/>
					{_renderPosition()}
				</View>
			);
		}
	};

	if (map && map.imageSource) {
		return (
			<View
				testID={`${testId}_map`}
				style={{
					flex: 1,
					height: '100%',
					width: '100%'
				}}
				onLayout={(e) => setContainerSize(e.nativeEvent.layout)}
			>
				<ImageZoom
					ref={imgZoomRef}
					cropHeight={height ?? containerSize.height}
					cropWidth={width ?? containerSize.width}
					imageHeight={height ?? containerSize.height}
					imageWidth={width ?? containerSize.width}
					minScale={1}
					maxScale={3}
					enableDoubleClickZoom={false}
				>
					{_renderMap()}
				</ImageZoom>
			</View>
		);
	}

	return null;
};
