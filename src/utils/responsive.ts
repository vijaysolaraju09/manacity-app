import { Dimensions } from 'react-native';

const { width, height } = Dimensions.get('window');

export const responsiveWidth = (percentage: number) => (width * percentage) / 100;
export const responsiveHeight = (percentage: number) => (height * percentage) / 100;
export const responsiveFontSize = (size: number) => size * (width / 375);
