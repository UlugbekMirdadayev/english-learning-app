import React, { useState, useRef } from "react";
import { StyleSheet, TouchableOpacity, Animated, Alert } from "react-native";
import * as Speech from "expo-speech";
import Typography from "./typography";
import { ArrowChangeIcon, VoiceIcon } from "@/assets/icons";

const Card = ({ title, onLanguageChange }) => {
  const [isEn, setIsEn] = useState(true); // Initial language state
  const scaleX = useRef(new Animated.Value(1)).current; // Animated value for scale transform

  const speakText = async (textToSpeak, speed) => {
    Speech.stop(); // Stop speaking if there is any text being spoken
    Speech.speak(textToSpeak, {
      language: isEn ? "en" : "uz",
      rate: speed,
      volume: 1,
      voice: isEn ? "en-US" : "ru-RU",
    }); // Set default rate for speech
  };

  const toggleLanguage = () => {
    setIsEn(!isEn);
    typeof onLanguageChange === "function" && onLanguageChange(!isEn); // Pass language state for potential external handling

    Animated.timing(scaleX, {
      toValue: isEn ? -1 : 1, // Animate scaleX based on language
      duration: 300, // Animation duration in milliseconds
      useNativeDriver: true, // Use native driver for smoother animation (optional)
    }).start();
  };

  return (
    <>
      <TouchableOpacity style={styles.card} onPress={toggleLanguage}>
        <ArrowChangeIcon />
        <TouchableOpacity
          style={{
            position: "absolute",
            top: 0,
            right: 0,
            padding: 8,
            flexDirection: "row",
            alignItems: "center",
            padding: 8,
            backgroundColor: "#0075fa59",
            borderTopLeftRadius: 8,
            width: 75,
          }}
          onPress={() => speakText(title[isEn ? "en" : "uz"], 0.3)}
        >
          <VoiceIcon />
          <Typography>0.5x</Typography>
        </TouchableOpacity>
        <TouchableOpacity
          style={{
            position: "absolute",
            top: 40,
            right: 0,
            padding: 8,
            flexDirection: "row",
            alignItems: "center",
            padding: 8,
            backgroundColor: "#0075fa59",
            width: 75,
          }}
          onPress={() => speakText(title[isEn ? "en" : "uz"], 0.5)}
        >
          <VoiceIcon />
          <Typography>1x</Typography>
        </TouchableOpacity>
        <TouchableOpacity
          style={{
            position: "absolute",
            top: 80,
            right: 0,
            padding: 8,
            flexDirection: "row",
            alignItems: "center",
            padding: 8,
            backgroundColor: "#0075fa59",
            width: 75,
            borderBottomLeftRadius: 8,
          }}
          onPress={() => speakText(title[isEn ? "en" : "uz"], 0.6)}
        >
          <VoiceIcon />
          <Typography>2x</Typography>
        </TouchableOpacity>
        <Animated.View style={[{ transform: [{ scaleX }] }]}>
          <Animated.View style={{ transform: [{ scaleX }] }}>
            <Typography style={styles.title}>
              {title[isEn ? "en" : "uz"]}
            </Typography>
          </Animated.View>
        </Animated.View>
      </TouchableOpacity>
    </>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    width: "100%",
    height: 120,
    marginTop: 16,
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
  },
});

export default Card;
