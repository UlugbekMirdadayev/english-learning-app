import React, { useState } from "react";
import { Pressable, StyleSheet, View } from "react-native";
import Typography from "./typography";

const words = ["a", "b", "c", "d", "e", "f", "g", "h", "i", "j"];

const TestCard = ({ title, options, onChange, index }) => {
  const [selectedOption, setSelectedOption] = useState(null);
  const handlePress = (option) => {
    setSelectedOption(option?.id);
    if (onChange) {
      onChange(option);
    }
  };
  return (
    <View>
      <Typography>
        {index}) {title}
      </Typography>
      <View style={styles.grid}>
        {options?.map((option, key) => (
          <Pressable
            key={option?.id}
            style={({ pressed }) => [
              styles.option,
              pressed && { transform: [{ scale: 0.98 }], opacity: 0.5 },
              option?.id === selectedOption && styles.selectedOption,
              options?.length % 2 !== 0 &&
                key === options?.length - 1 && { width: "100%" },
            ]}
            onPress={() => handlePress(option)}
          >
            <Typography
              style={{ color: option?.id === selectedOption ? "#fff" : "#000" }}
            >
              {words[key]}) {option?.option}
            </Typography>
          </Pressable>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  option: {
    width: "48%",
    padding: 16,
    borderRadius: 8,
    backgroundColor: "#f5f5f5",
    marginVertical: 8,
  },
  selectedOption: {
    backgroundColor: "#007aff",
  },
});

export default TestCard;
