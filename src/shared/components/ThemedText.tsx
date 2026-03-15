import { Text as DefaultText, TextProps as DefaultTextProps } from 'react-native';
import { useColorScheme } from '../hooks/useColorScheme';
import { colors } from '../theme/colors';

type ThemeProps = {
  lightColor?: string;
  darkColor?: string;
  type?: 'default' | 'title' | 'defaultSemiBold' | 'subtitle' | 'link' | 'secondary' | 'error' | 'success';
};

export type ThemedTextProps = ThemeProps & DefaultTextProps;

export function ThemedText(props: ThemedTextProps) {
  const { style, lightColor, darkColor, type = 'default', ...otherProps } = props;
  const theme = useColorScheme();
  
  const colorFromProps = theme === 'light' ? lightColor : darkColor;
  const color = colorFromProps ?? colors[theme].text;
  
  const getTypeStyles = () => {
    switch (type) {
      case 'title':
        return { fontSize: 24, fontWeight: 'bold' as const };
      case 'subtitle':
        return { fontSize: 20, fontWeight: 'bold' as const };
      case 'defaultSemiBold':
        return { fontSize: 16, fontWeight: '600' as const };
      case 'link':
        return { fontSize: 16, color: colors[theme].primary };
      case 'secondary':
        return { color: colors[theme].textSecondary };
      case 'error':
        return { color: colors[theme].error };
      case 'success':
        return { color: colors[theme].success };
      case 'default':
      default:
        return { fontSize: 16 };
    }
  };

  return <DefaultText style={[{ color }, getTypeStyles(), style]} {...otherProps} />;
}
