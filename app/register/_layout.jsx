import React, { useState } from "react";
import {
  StyleSheet,
  View,
  Image,
  ScrollView,
  Dimensions,
  KeyboardAvoidingView,
  Pressable,
  Platform,
} from "react-native";
import { useDispatch } from "react-redux";
import { setUser } from "@/redux/userSlice";
import Typography from "@/components/typography";
import Button from "@/components/button";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Input from "@/components/input";
import LottieView from "lottie-react-native";
import { postRegister } from "@/service/api";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Toast from "react-native-toast-message";
import { useNavigation } from "@react-navigation/native";

const inputs = [
  {
    label: "First name",
    name: "first_name",
    placeholder: "John",
    password: false,
  },
  {
    label: "Last name",
    name: "last_name",
    placeholder: "Doe",
    password: false,
  },
  {
    label: "Email",
    name: "email",
    placeholder: "johndoe@mail.uz",
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

const RegisterScreen = () => {
  const navigation = useNavigation();
  const { top } = useSafeAreaInsets();
  const dispatch = useDispatch();
  const [formValues, setFormValues] = useState({
    password: "",
    email: "",
    first_name: "",
    last_name: "",
    clicked: false,
  });
  const [loading, setLoading] = useState(false);

  const [formErrors, setFormErrors] = useState({
    password: false,
    email: false,
    first_name: false,
    last_name: false,
  });

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
    if (Object.values(formValues).includes("")) {
      setFormErrors({
        email: !formValues.email,
        first_name: !formValues.first_name,
        last_name: !formValues.last_name,
        password: !formValues.password,
      });
      return setFormValues((prev) => ({
        ...prev,
        clicked: true,
      }));
    }
    const data = formValues;
    delete data.clicked;

    dispatch(setUser(data));
    navigation.reset({
      index: 0,
      routes: [{ name: "(tabs)" }],
    });
    // setLoading(true);
    // postRegister(data)
    //   .then(({ data }) => {
    //     setLoading(false);
    //     Toast.show({
    //       position: "top",
    //       type: "success",
    //       text1: data?.status || "Success",
    //       text2: data?.result || "You have successfully registered",
    //     });
    //     navigation.reset({
    //       index: 0,
    //       routes: [{ name: "login" }],
    //     });
    //   })
    //   .catch((error) => {
    //     setLoading(false);
    //     const errors = { ...error?.response?.data, ...error?.response?.data };
    //     Object.keys(errors).forEach((key) => {
    //       setFormErrors((prev) => ({
    //         ...prev,
    //         [key]: errors[key][0],
    //       }));
    //     });
    //     Toast.show({
    //       position: "top",
    //       type: "error",
    //       text1:
    //         Object.keys(errors)
    //           .map((key) => key)
    //           .join("\n") || JSON.stringify(error?.message),
    //       text2:
    //         Object.keys(errors)
    //           .map((key) => errors[key][0])
    //           .join("\n") || JSON.stringify(error?.message),
    //     });
    //   });
  };

  return (
    <KeyboardAvoidingView
      style={[styles.container, { paddingTop: top }]}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <ScrollView>
        <View style={styles.containerInner}>
          <Image
            style={styles.logo}
            source={require("../../assets/images/logo.png")}
          />
          <LottieView
            style={styles.image}
            source={require("../../assets/lottie/register.json")}
            autoPlay
            loop
            speed={1}
          />
          <Typography style={styles.title}>
            {"Sign up and start learning any language"}
          </Typography>
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
                secureTextEntry: input.password,
              }}
            />
          ))}
          <Button
            loading={loading}
            disabled={
              (formValues.clicked && Object.values(formValues).includes("")) ||
              !!formErrors.email ||
              !!formErrors.password ||
              !!formErrors.first_name ||
              !!formErrors.last_name
            }
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
                routes: [{ name: "login" }],
              })
            }
          >
            <Typography style={styles.subtext} variant={"subheading"}>
              {"Already, have an account? "}
              <Typography style={{ ...styles.subtext, ...styles.link }}>
                Log in
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
    paddingTop: 30,
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

export default RegisterScreen;
