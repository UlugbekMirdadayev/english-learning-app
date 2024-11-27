import React from "react";
import { StyleSheet, Image, Dimensions, ScrollView } from "react-native";
import Typography from "@/components/typography";
import Button from "@/components/button";
import { SafeAreaView } from "react-native-safe-area-context";
import { useSelectorState } from "@/redux/selectors";
import LottieView from "lottie-react-native";
import { useNavigation } from "@react-navigation/native";

const { width, height } = Dimensions.get("window");

const StartScreen = () => {
  const navigation = useNavigation();
  const user = useSelectorState("user");

  return (
    <ScrollView showsVerticalScrollIndicator={false}>
      <SafeAreaView style={styles.container}>
        <Image
          style={styles.logo}
          source={require("../../assets/images/logo.png")}
        />
        <LottieView
          style={styles.image}
          source={require("../../assets/lottie/start.json")}
          autoPlay
          speed={0.4}
          duration={3000}
          loop={false}
        />
        <Typography style={styles.title}>{"Welcome!"}</Typography>
        <Typography style={styles.subtext} variant={"subheading"}>
          {"Let's start studying!"}
        </Typography>
        <Button
          title="Let's Go!"
          style={styles.button}
          onPress={() =>
            navigation.reset({
              index: 0,
              routes: [{ name: user?.id ? "(tabs)" : "welcome" }],
            })
          }
        />
      </SafeAreaView>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
    padding: 16,
    minHeight: height,
  },
  image: {
    maxWidth: 400,
    maxHeight: 400,
    width: width,
    height: width,
    resizeMode: "cover",
  },
  title: {
    fontFamily: "SFProTextSemibold",
    fontSize: 32,
    lineHeight: 40,
    letterSpacing: -1,
    textAlign: "center",
    paddingTop: 21,
  },
  subtext: {
    paddingTop: 5,
  },
  button: {
    marginTop: 16,
    width: "100%",
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  logo: {
    width: 33,
    height: 33,
    resizeMode: "contain",
  },
});

export default StartScreen;
