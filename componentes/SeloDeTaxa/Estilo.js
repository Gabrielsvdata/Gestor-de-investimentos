import { StyleSheet } from 'react-native';
import { theme } from '../../theme'; // Assuming theme is in the root

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    gap: 10,
    backgroundColor: theme.colors.badgeBg,
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: theme.radius.pill,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: theme.colors.border
  },
  text: {
    fontSize: 12,
    fontWeight: '800',
    color: theme.colors.text
  }
});

export default styles;
