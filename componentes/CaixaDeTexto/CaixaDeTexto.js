import React from 'react';
import { View, TextInput, StyleSheet } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { theme } from '../../theme';

const CaixaDeTexto = ({
  placeholder,
  value,
  onChangeText,
  secureTextEntry = false,
  keyboardType = 'default',
  icon,
  style,
  ...props
}) => {
  return (
    <View style={[styles.container, style]}>
      {icon && (() => {
        // map deprecated or invalid icon names to valid Material icons
        const iconName = icon === 'calendar' ? 'event' : icon;
        return (
          <MaterialIcons
            name={iconName}
            size={20}
            color={theme.colors.primary}
            style={styles.icon}
          />
        );
      })()}
      <TextInput
        style={styles.input}
        placeholder={placeholder}
        placeholderTextColor={theme.colors.textSoft}
        value={value}
        onChangeText={onChangeText}
        secureTextEntry={secureTextEntry}
        keyboardType={keyboardType}
        {...props}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: theme.radius.md,
    backgroundColor: theme.colors.screen,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
  },
  icon: {
    marginRight: theme.spacing.sm,
  },
  input: {
    flex: 1,
    color: theme.colors.text,
    fontSize: 16,
    fontFamily: 'Inter_400Regular',
    padding: 0,
  },
});

export default CaixaDeTexto;
