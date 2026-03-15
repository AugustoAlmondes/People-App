import { View as DefaultView, ViewProps as DefaultViewProps } from 'react-native';
import { useColorScheme } from '../hooks/useColorScheme';
import { colors } from '../theme/colors';

type ThemeProps = {
  lightColor?: string;
  darkColor?: string;
  elevated?: boolean;
};

export type ThemedViewProps = ThemeProps & DefaultViewProps;

export function ThemedView(props: ThemedViewProps) {
  const { style, lightColor, darkColor, elevated, ...otherProps } = props;
  const theme = useColorScheme();
  
  const colorFromProps = theme === 'light' ? lightColor : darkColor;
  const backgroundColor = colorFromProps ?? (elevated ? colors[theme].surfaceElevated : colors[theme].background);

  return <DefaultView style={[{ backgroundColor }, style]} {...otherProps} />;
}
