export type FontWeight = 'regular' | 'medium' | 'semiBold' | 'bold';

export const typography = {
  regular: {
    fontFamily: 'Inter_400Regular',
    fontWeight: '400' as const,
  },
  medium: {
    fontFamily: 'Inter_500Medium',
    fontWeight: '500' as const,
  },
  semiBold: {
    fontFamily: 'Inter_600SemiBold',
    fontWeight: '600' as const,
  },
  bold: {
    fontFamily: 'Inter_700Bold',
    fontWeight: '700' as const,
  },
};
