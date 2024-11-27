import React, {useState} from 'react';
import {StyleSheet, Pressable, ActivityIndicator} from 'react-native';
import Typography from './typography';

const Button = ({title, onPress, disabled, style, loading}) => {
  return (
    <Pressable
      disabled={disabled || loading}
      style={({pressed}) => [
        styles.button,
        pressed
          ? {
              transform: [{scale: 0.99}],
            }
          : {},
        style,
        disabled ? styles.disabled : {},
      ]}
      onPress={onPress}>
      <Typography style={styles.buttonText}>
        {loading ? <ActivityIndicator color={'#fff'} /> : title}
      </Typography>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  button: {
    backgroundColor: '#007aff',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
  },
  disabled: {backgroundColor: '#007bff6a', opacity: 0.5},
});

export default Button;
