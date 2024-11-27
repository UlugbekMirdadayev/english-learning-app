import React, { useState } from "react";
import {
  View,
  StyleSheet,
  ScrollView,
  Pressable,
  Linking,
  Modal,
  Alert,
  ToastAndroid,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Typography from "@/components/typography";
import { Arrow, LogoutIcon, TelegramIcon } from "@/assets/icons";
import Button from "@/components/button";
import { useDispatch } from "react-redux";
import { setUser } from "@/redux/userSlice";
import ConfirmModal from "@/components/confirm";
import { useSelectorState } from "@/redux/selectors";
import DateDifferenceComponent from "@/utils/difference-date";
import UserUpdate from "@/components/user-update";
import Toast from "react-native-toast-message";
import { updateProfile } from "@/service/api";
import { useNavigation } from "@react-navigation/native";

const ProfileScreen = () => {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const user = useSelectorState("user");
  const [logout, setLogout] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({});

  const handleEdit = () => {
    const editedInfo = Object.keys(form)
      .map((key) => {
        if (key === "password") {
          return form?.[key]?.trim() ? key : null;
        }
        if (form?.[key]?.trim() !== user?.[key]?.trim()) {
          return key;
        }
        return null;
      })
      .filter(Boolean);

    if (!editedInfo.length) {
      Toast.show({
        type: "info",
        text1: "Info",
        text2: "No changes were made.",
      });
      return setModalVisible(false);
    }

    let data = {};
    editedInfo.forEach((key) => {
      data[key] = form[key];
    });

    setLoading(true);
    updateProfile(user?.token, { user: data }, user?.id)
      .then(({ data }) => {
        setLoading(false);
        Toast.show({
          type: "success",
          text1: "Success",
          text2: "Your information has been updated.",
        });
        dispatch(setUser({ ...user, ...data }));
        setModalVisible(false);
      })
      .catch((err) => {
        ToastAndroid.show(JSON.stringify(err?.response), ToastAndroid.LONG);
        if (err.response.status === 401) {
          dispatch(setUser({}));
          navigation.reset({
            index: 0,
            routes: [{ name: "(splash)" }],
          });
        }
        setLoading(false);
        Toast.show({
          type: "error",
          text1: "Error",
          text2: "An error occurred while updating your information.",
        });
      });
  };

  return (
    <SafeAreaView style={styles.container}>
      <UserUpdate
        setModalVisible={setModalVisible}
        modalVisible={modalVisible}
        styles={styles}
        form={form}
        setForm={setForm}
        user={user}
        handleEdit={handleEdit}
        loading={loading}
      />
      <ConfirmModal
        overlayClick={() => setLogout(null)}
        visible={logout}
        onConfirm={() => {
          setLogout(null);
          dispatch(setUser({}));
          navigation.reset({
            index: 0,
            routes: [{ name: "(splash)" }],
          });
        }}
        onCancel={() => setLogout(null)}
      />
      <View style={[styles.containerInner, { paddingVertical: 16 }]}>
        <View style={styles.row}>
          <Pressable style={styles.row} onPress={() => navigation.goBack()}>
            <Arrow />
            <Typography style={styles.title}>Profile</Typography>
          </Pressable>
        </View>
        <View style={styles.hr} />
      </View>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={[styles.container, { paddingBottom: 16 }]}>
          <View style={styles.containerInner}>
            <View style={styles.row}>
              <Typography style={styles.description}>
                Account settings
              </Typography>
            </View>
            <View style={styles.hr} />
            <View style={styles.row}>
              <Typography style={styles.description}>FullName</Typography>
              <Typography
                style={styles.description}
              >{`${user?.name} ${user?.surname}`}</Typography>
            </View>
            <View style={styles.hr} />
            <View style={styles.row}>
              <Typography style={styles.description}>Username</Typography>
              <Typography style={styles.description}>{user?.email}</Typography>
            </View>
            <View style={styles.hr} />
            <View style={styles.row}>
              <Typography style={styles.description}>
                Your age in the app.
              </Typography>
              <Typography style={styles.description}>
                {<DateDifferenceComponent date={user?.created_at} />}
              </Typography>
            </View>
            <View style={styles.hr} />
            <Pressable
              onPress={() =>
                Alert.alert(
                  "Want to know the password ?",
                  "Password should be asked by the teacher",
                  [
                    {
                      text: "Apply to the master",
                      onPress: () =>
                        Linking.openURL("https://t.me/mukarama_24_80"),
                    },
                    { text: "Cancel" },
                  ]
                )
              }
              style={styles.row}
            >
              <Typography style={styles.description}>Password</Typography>
              <Typography style={styles.description}>****</Typography>
            </Pressable>
            <View style={styles.hr} />
            <Button title={"Edit"} onPress={() => setModalVisible(true)} />
            <View style={styles.hr} />
            <View style={styles.row}>
              <Typography style={styles.description}>Support</Typography>
              <Pressable
                style={styles.row}
                onPress={() => Linking.openURL("https://t.me/mukarama_24_80")}
              >
                <Typography
                  style={[
                    styles.description,
                    { color: "#007aff", paddingRight: 10 },
                  ]}
                >
                  Contact us
                </Typography>
                <TelegramIcon fill="#007aff" />
              </Pressable>
            </View>
            <View style={styles.hr} />
          </View>
        </View>
      </ScrollView>
      <View style={[styles.containerInner, { paddingBottom: 16 }]}>
        <Pressable
          style={({ pressed }) => [
            styles.row,
            { paddingVertical: 16, paddingHorizontal: 8, borderRadius: 4 },
            pressed
              ? {
                  backgroundColor: "#d53e3648",
                }
              : {},
          ]}
          onPress={() => setLogout(true)}
        >
          <View style={styles.row}>
            <LogoutIcon fill="#d53f36" />
            <Typography
              style={[
                styles.description,
                { color: "#d53f36", paddingRight: 10 },
              ]}
            >
              {" Logout"}
            </Typography>
          </View>
        </Pressable>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#fff",
    flex: 1,
  },
  containerInner: {
    paddingHorizontal: 16,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  title: {
    fontSize: 20,
    paddingLeft: 12,
    fontFamily: "SFProTextRegular",
    fontWeight: "600",
    letterSpacing: -0.3,
  },
  hr: {
    height: 2,
    width: "100%",
    backgroundColor: "#f2f2f2",
    marginVertical: 8,
  },
  description: {
    fontSize: 18,
    textAlign: "right",
  },
  form: {
    backgroundColor: "rgba(0,0,0,0.7)",
    flex: 1,
    justifyContent: "center",
    padding: 16,
  },
  body: {
    backgroundColor: "#fff",
    borderRadius: 8,
    padding: 16,
  },
});

export default ProfileScreen;
