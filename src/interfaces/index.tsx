import { ImageSourcePropType } from 'react-native';

export type TCoordinates = { x1: number; x2: number; y1: number; y2: number };

export type TMap = {
	key: string;
	title?: string;
	imageSource?: ImageSourcePropType;
	positions?: TPosition[];
};

export type TPosition = {
	key: string;
	title: string;
	target: any;
	coordinates?: TCoordinates;
};

export const emptyCoordinates: TCoordinates = { x1: 0, x2: 0, y1: 0, y2: 0 };
