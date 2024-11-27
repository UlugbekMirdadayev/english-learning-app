import React from "react";
import LottieView from "lottie-react-native";
import { useSelectorState } from "@/redux/selectors";
import { useNavigation } from "expo-router";

const SplashScreen = () => {
  const navigation = useNavigation();
  const user = useSelectorState("user"); // useSelectorState is a custom hook
  return (
    <LottieView
      style={{
        flex: 1,
        backgroundColor: "#fff",
      }}
      source={require("../../assets/lottie/splash.json")}
      autoPlay
      loop={false}
      speed={1}
      onAnimationFinish={() =>
        navigation.reset({
          index: 0,
          routes: [{ name: user?.id ? "(tabs)" : "start" }],
        })
      }
    />
  );
};

export default SplashScreen;
