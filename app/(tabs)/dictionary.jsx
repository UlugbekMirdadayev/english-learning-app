import React from "react";
import { SectionList, View, StyleSheet, Pressable } from "react-native";
import terms from "@/assets/localization/locale.json";
import Typography from "@/components/typography";
import * as Speech from "expo-speech";
import { SafeAreaView } from "react-native-safe-area-context";

const data = terms.map((term) => ({
  title: term.title,
  data: term.terms,
}));

const Dictionary = () => {
  const StickyHeaderComponent = ({ title }) => (
    <View style={styles.stickyHeader}>
      <Typography style={styles.stickyHeaderText}>{title}</Typography>
    </View>
  );

  const speakText = async (textToSpeak, lang) => {
    Speech.stop(); // Stop speaking if there is any text being spoken
    Speech.speak(textToSpeak, {
      language: lang,
      rate: lang ? 0.4 : 0.5,
      volume: 1,
      voice: lang ? "ru-RU" : "en-US",
    }); // Speak the text}
  };

  const renderItems = ({ item }) => (
    <Pressable
      style={({ pressed }) => [
        styles.row,
        {
          backgroundColor: pressed ? "#0075fa48" : "#fff",
        },
      ]}
      onPress={() => {
        speakText(item.term);
      }}
      onLongPress={() => {
        Speech.stop();
        speakText(item.definition, "ru-RU");
      }}
    >
      <Typography style={{ ...styles.col, ...styles.left }}>
        {item.term}
      </Typography>
      <Typography style={{ ...styles.col, ...styles.right }}>
        {item.translation}
      </Typography>
    </Pressable>
  );

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: "#fff",
    },
    stickyHeader: {
      backgroundColor: "#fff",
      paddingVertical: 8,
      borderBottomColor: "#ddd",
      borderBottomWidth: 1,
      paddingHorizontal: 16,
    },
    stickyHeaderText: {
      fontSize: 22,
      fontWeight: "bold",
    },
    row: {
      paddingHorizontal: 16,
      paddingVertical: 8,
      borderBottomWidth: 1,
      borderBottomColor: "#ddd",
      flexDirection: "row",
    },
    col: {
      width: "48%",
    },
    left: {
      textAlign: "left",
    },
    right: {
      textAlign: "right",
    },
  });
  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <SectionList
        sections={data}
        keyExtractor={(item, index) => item + index}
        renderItem={renderItems}
        stickySectionHeadersEnabled={true}
        renderSectionHeader={({ section: { title } }) => (
          <StickyHeaderComponent title={title} />
        )}
        style={styles.container}
      />
    </SafeAreaView>
  );
};

export default Dictionary;
