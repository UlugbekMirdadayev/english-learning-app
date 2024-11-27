import React from "react";
import { View, StyleSheet, TextInput } from "react-native";
import Typography from "./typography";

const Input = ({
  label = "",
  placeholder = "",
  placeholderTextColor = "#d7d7d7",
  type = "default",
  password = false,
  error = false,
  styleContainer = {},
  styleInput = {},
  inputProps = {},
}) => {
  return (
    <View style={[styles.inputView, styleContainer]}>
      <View style={styles.row}>
        {typeof label !== "string" && label.length ? (
          label?.map((text, key) => (
            <Typography
              style={[styles.label, key ? styles.label_primary : {}]}
              key={key}
            >
              {text}
            </Typography>
          ))
        ) : (
          <Typography style={styles.label}>{label?.toString()}</Typography>
        )}
      </View>
      <TextInput
        keyboardType={type}
        style={[styles.input, styleInput, error ? styles.error : {}]}
        placeholder={placeholder}
        placeholderTextColor={placeholderTextColor}
        secureTextEntry={password}
        {...inputProps}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  inputView: {
    width: "100%",
  },
  row: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-between",
  },
  input: {
    borderWidth: 1,
    borderRadius: 8,
    marginTop: 5,
    paddingHorizontal: 16,
    paddingVertical: 10,
    fontSize: 20,
    borderColor: "rgb(242, 242, 242)",
    borderRadius: 12,
    backgroundColor: "rgb(248, 248, 248)",
  },
  error: {
    borderColor: "#f50",
  },
  label: {
    fontSize: 12,
    color: "#131313",
    letterSpacing: 0.4,
    fontWeight: "400",
  },
  label_primary: {
    color: "#007aff",
  },
});

export default Input;
