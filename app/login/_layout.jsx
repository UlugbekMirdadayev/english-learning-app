import React, { useState } from "react";
import {
  StyleSheet,
  View,
  Image,
  ScrollView,
  Dimensions,
  KeyboardAvoidingView,
  Pressable,
  Linking,
  Platform,
} from "react-native";
import { useDispatch } from "react-redux";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import LottieView from "lottie-react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { postLogin } from "@/service/api";
import Toast from "react-native-toast-message";
import Input from "@/components/input";
import { setUser } from "@/redux/userSlice";
import Typography from "@/components/typography";
import Button from "@/components/button";
import { useNavigation } from "@react-navigation/native";

const inputs = [
  {
    label: "Email",
    name: "email",
    placeholder: "john_doe@mail.com",
    password: false,
  },
  {
    label: "Password",
    name: "password",
    placeholder: "password",
    password: true,
  },
];

const { width, height } = Dimensions.get("window");

const LoginScreen = () => {
  const navigation = useNavigation();
  const { top } = useSafeAreaInsets();
  const dispatch = useDispatch();
  const [formValues, setFormValues] = useState({
    password: "",
    email: "",
    clicked: false,
  });

  const [formErrors, setFormErrors] = useState({
    password: false,
    email: false,
  });
  const [loading, setLoading] = useState(false);

  const onChangeText = (value, name) => {
    setFormErrors((prev) => ({
      ...prev,
      [name]: !value,
    }));
    setFormValues((prev) => ({
      ...prev,
      [name]: value?.toString(),
    }));
  };

  const onSubmit = () => {
    navigation.reset({
      index: 0,
      routes: [{ name: "(tabs)" }],
    });
    // if (!formValues.email || !formValues.password) {
    //   setFormErrors({
    //     email: !formValues.email,
    //     password: !formValues.password,
    //   });
    //   return setFormValues((prev) => ({
    //     ...prev,
    //     clicked: true,
    //   }));
    // }
    // const data = formValues;
    // delete data.clicked; // key clicked remove
    // setLoading(true);
    // postLogin(data)
    //   .then(({ data }) => {
    //     setLoading(false);
    //     if (data?.user?.teacher) {
    //       Toast.show({
    //         position: "top",
    //         type: "info",
    //         text1: "You are a teacher !",
    //         text2: "You are not allowed to log in.",
    //       });
    //       return Linking.openURL("https://sooyaa.uz/");
    //     }
    //     Toast.show({
    //       position: "top",
    //       type: "success",
    //       text1: "Success",
    //       text2: "You have successfully logged in",
    //     });
    //     console.log(data?.token);
    //     dispatch(setUser({ ...data?.user, token: data?.token }));
    //     AsyncStorage.setItem("token", data?.token);
    //     navigation.reset({
    //       index: 0,
    //       routes: [{ name: "(tabs)" }],
    //     });
    //   })
    //   .catch((error) => {
    //     setLoading(false);
    //     Toast.show({
    //       position: "top",
    //       type: "error",
    //       text1: "Error",
    //       text2: JSON.stringify(error?.response?.data),
    //     });
    //   });
  };

  return (
    <KeyboardAvoidingView
      style={[styles.container, { paddingTop: top }]}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.containerInner}>
          <Image
            style={styles.logo}
            source={require("../../assets/images/logo.png")}
          />
          <LottieView
            style={styles.image}
            source={require("../../assets/lottie/login.json")}
            autoPlay
            loop
            speed={1}
          />
          <Typography style={styles.title}>{"Welcome!"}</Typography>
          {inputs.map((input) => (
            <Input
              key={input.name}
              label={input.label}
              placeholder={input.placeholder}
              error={formErrors[input.name]}
              styleContainer={styles.inputView}
              inputProps={{
                value: formValues[input.name],
                onChangeText: (e) => onChangeText(e, input.name),
              }}
            />
          ))}
          <Button
            disabled={
              formValues.clicked && (!formValues.email || !formValues.password)
            }
            loading={loading}
            title="Continue"
            style={styles.button}
            onPress={onSubmit}
          />
          <Pressable
            style={({ pressed }) => [
              styles.row,
              {
                paddingHorizontal: 8,
                paddingVertical: 4,
                borderRadius: 4,
                backgroundColor: pressed ? "#007bff48" : "transparent",
              },
            ]}
            onPress={() =>
              navigation.reset({
                index: 0,
                routes: [{ name: "register" }],
              })
            }
          >
            <Typography style={styles.subtext} variant={"subheading"}>
              {"Do not have an account ? "}
              <Typography style={{ ...styles.subtext, ...styles.link }}>
                Register
              </Typography>
            </Typography>
          </Pressable>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    width,
    backgroundColor: "#fff",
  },
  containerInner: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 16,
    width: "100%",
    minHeight: height,
    paddingBottom: 16,
  },
  logo: {
    width: 33,
    height: 33,
    resizeMode: "contain",
  },
  button: {
    width: "100%",
    marginTop: 16,
  },
  inputView: {
    marginTop: 16,
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
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  image: {
    maxWidth: 400,
    width: width,
    height: 200,
    resizeMode: "cover",
    marginBottom: 20,
  },
  title: {
    textAlign: "center",
  },
});

export default LoginScreen;
