import React from 'react';
import {Text, StyleSheet} from 'react-native';

const Typography = ({variant, children, style, ...props}) => {
  const styles = variantStyles[variant] || variantStyles.body;

  return (
    <Text {...props} style={[styles, style]}>
      {children}
    </Text>
  );
};

const variantStyles = StyleSheet.create({
  heading: {
    color: 'rgb(19, 19, 19)',
    fontSize: 24,
    fontWeight: 'bold',
    fontFamily: 'SFProTextHeavy',
  },
  subheading: {
    color: 'rgb(19, 19, 19)',
    fontSize: 18,
    fontWeight: 'normal',
    fontFamily: 'SFProTextMedium',
  },
  body: {
    color: 'rgb(19, 19, 19)',
    fontSize: 16,
    fontWeight: 'normal',
    fontFamily: 'SFProTextMedium',
  },
});

export default Typography;
