import React from 'react'
import { TouchableOpacity, Text, StyleSheet, TouchableOpacityProps } from 'react-native'

interface ButtonProps extends TouchableOpacityProps {
  children: React.ReactNode
  variant?: 'default' | 'outline' | 'ghost'
}

export const Button: React.FC<ButtonProps> = ({ children, style, variant = 'default', ...props }) => {
  return (
    <TouchableOpacity 
      style={[
        styles.button, 
        variant === 'outline' && styles.outlineButton,
        variant === 'ghost' && styles.ghostButton,
        style
      ]} 
      {...props}
    >
      <Text 
        style={[
          styles.buttonText,
          variant === 'outline' && styles.outlineButtonText,
          variant === 'ghost' && styles.ghostButtonText,
        ]}
      >
        {children}
      </Text>
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  button: {
    backgroundColor: '#3B82F6',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 6,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  outlineButton: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: '#3B82F6',
  },
  outlineButtonText: {
    color: '#3B82F6',
  },
  ghostButton: {
    backgroundColor: 'transparent',
  },
  ghostButtonText: {
    color: '#3B82F6',
  },
})