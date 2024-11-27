import React from "react";
import {
  View,
  StyleSheet,
  Image,
  Dimensions,
  ScrollView,
  Pressable,
} from "react-native";
import Typography from "@/components/typography";
import Button from "@/components/button";
import { useSelectorState } from "@/redux/selectors";
import LottieView from "lottie-react-native";
import { useNavigation } from "@react-navigation/native";

const { width, height } = Dimensions.get("window");

const WelcomeScreen = () => {
  const navigation = useNavigation();
  const user = useSelectorState("user");

  return (
    <ScrollView showsVerticalScrollIndicator={false}>
      <View style={styles.container}>
        <Image
          style={styles.logo}
          source={require("../../assets/images/logo.png")}
        />
        <LottieView
          style={styles.image}
          source={require("../../assets/lottie/welcome.json")}
          autoPlay
          loop
          speed={1}
        />
        <Typography style={styles.title}>
          {"Learn the language in\n3 minutes a day"}
        </Typography>
        <Button
          title="Start learning"
          style={styles.button}
          onPress={() =>
            navigation.reset({
              index: 0,
              routes: [{ name: user?.id ? "(tabs)" : "register" }],
            })
          }
        />
        <View style={styles.row}>
          <Typography style={styles.subtext} variant={"subheading"}>
            {"Already, have an account?"}
          </Typography>
          <Pressable
            style={({ pressed }) => [
              {
                paddingHorizontal: 8,
                paddingVertical: 4,
                borderRadius: 4,
              },
              pressed
                ? {
                    transform: [{ scale: 0.95 }],
                    backgroundColor: "#007bff48",
                  }
                : {},
            ]}
            onPress={() =>
              navigation.reset({
                index: 0,
                routes: [{ name: "login" }],
              })
            }
          >
            <Typography
              style={{
                ...styles.subtext,
                ...styles.link,
              }}
            >
              Log in
            </Typography>
          </Pressable>
        </View>
      </View>
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
    fontSize: 16,
  },
  link: {
    color: "#007aff",
    textDecorationLine: "underline",
    textDecorationColor: "#007aff",
  },
  button: {
    marginVertical: 16,
    width: "100%",
  },
  row: {
    alignItems: "center",
    justifyContent: "center",
  },
  logo: {
    width: 33,
    height: 33,
    resizeMode: "contain",
  },
});

export default WelcomeScreen;
