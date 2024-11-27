import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
  useNavigation,
} from "@react-navigation/native";
import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { StatusBar } from "expo-status-bar";
import { useEffect } from "react";
import "react-native-reanimated";
import { Text, TextInput } from "react-native";
import Toast from "react-native-toast-message";
import { SafeAreaProvider } from "react-native-safe-area-context";

import { useColorScheme } from "@/hooks/useColorScheme";
import { Provider } from "react-redux";
import store from "@/redux/store";
import { useSelectorState } from "@/redux/selectors";

Text.defaultProps = Text.defaultProps || {};
Text.defaultProps.allowFontScaling = false;

TextInput.defaultProps = TextInput.defaultProps || {};
TextInput.defaultProps.allowFontScaling = false;

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [loaded] = useFonts({
    SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
  });

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return (
    <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
      <Provider store={store}>
        <SafeAreaProvider>
          <App />
          <StatusBar style="dark" backgroundColor="#fff" animated />
        </SafeAreaProvider>
        <Toast autoHide visibilityTime={3000} />
      </Provider>
    </ThemeProvider>
  );
}

function App() {
  const user = useSelectorState("user");
  const navigate = useNavigation();
  const screenConfigs = [
    { name: "(splash)" },
    { name: "start" },
    { name: "welcome" },
    { name: "login" },
    { name: "register" },
    { name: "theme" },
  ];

  useEffect(() => {
    navigate.reset({
      index: 0,
      routes: [{ name: user?.id ? "(tabs)" : "(splash)" }],
    });
  }, [user?.id]);

  return (
    <Stack>
      {screenConfigs.map((config) => (
        <Stack.Screen
          key={config.name}
          name={config.name}
          options={{ headerShown: false }}
        />
      ))}
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen name="+not-found" />
    </Stack>
  );
}
