import { render } from '@testing-library/react-native';
import React from 'react';
import { ThemedText } from '../src/components/Themed';
import { ThemeProvider } from '../src/context/ThemeContext';

describe('ThemeProvider', () => {
  it('provides typography styles to children', () => {
    const screen = render(
      <ThemeProvider>
        <ThemedText accessibilityLabel="theme-text">Hello</ThemedText>
      </ThemeProvider>,
    );

    const node = screen.getByLabelText('theme-text');
    expect(node).toBeTruthy();
  });
});
