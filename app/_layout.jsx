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
import { useEffect, useState } from "react";
import "react-native-reanimated";
import { Text, TextInput } from "react-native";
import Toast from "react-native-toast-message";
import { SafeAreaProvider } from "react-native-safe-area-context";

import { useColorScheme } from "@/hooks/useColorScheme";
import { Provider } from "react-redux";
import store from "@/redux/store";
import { useSelectorState } from "@/redux/selectors";
import { getUserMe } from "@/service/api";
import { setUser } from "@/redux/userSlice";
import AsyncStorage from "@react-native-async-storage/async-storage";

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
  const [loading, setLoading] = useState(true);
  const screenConfigs = [
    { name: "(splash)" },
    { name: "start" },
    { name: "welcome" },
    { name: "login" },
    { name: "register" },
    { name: "theme" },
    { name: "(tabs)" },
    { name: "+not-found" },
  ];

  useEffect(() => {
    AsyncStorage.getItem("user")
      .then((data) => {
        setLoading(false);
        if (data) {
          store.dispatch(setUser(JSON.parse(data)));
        }
      })
      .catch(() => {
        setLoading(false);
        store.dispatch(setUser(null));
      });
  }, []);

  useEffect(() => {
    if (loading)
      return navigate.reset({
        index: 0,
        routes: [{ name: "(splash)" }],
      });
    if (!user?.token) {
      return;
    }
    getUserMe(user?.token)
      .then(({ data }) => {
        setLoading(false);
        store.dispatch(setUser({ ...data?.result, token: user?.token }));
        // navigate.reset({
        //   index: 0,
        //   routes: [{ name: "(tabs)" }],
        // });
      })
      .catch((err) => {
        AsyncStorage.removeItem("user");
        setLoading(false);
        store.dispatch(setUser(null));
        // navigate.reset({
        //   index: 0,
        //   routes: [{ name: "(splash)" }],
        // });
      });
  }, [user?.token, loading]);

  return (
    <Stack initialRouteName="(splash)">
      {screenConfigs.map((config) => (
        <Stack.Screen
          key={config.name}
          name={config.name}
          options={{ headerShown: false }}
        />
      ))}
    </Stack>
  );
}
