import React, { useCallback, useEffect, useState } from "react";
import {
  View,
  StyleSheet,
  Dimensions,
  Pressable,
  FlatList,
  RefreshControl,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Toast from "react-native-toast-message";
import Typography from "@/components/typography";
import { BlockedIcon, ForwardIcon } from "@/assets/icons";
import { useSelectorState } from "@/redux/selectors";
import { getThemes } from "@/service/api";
import { useRouter } from "expo-router";
import { useNavigation } from "@react-navigation/native";

const { width } = Dimensions.get("window");

const renderItem = ({ item, index, router, themes }) => (
  <React.Fragment key={item?.id}>
    <Pressable
      onLongPress={
        () =>
          // item?.completed
          //   ?
          Alert.alert(
            "View",
            `View lesson "${item?.title}"`,
            [
              {
                text: "Cancel",
                style: "cancel",
              },
              {
                text: "Yes please",
                onPress: () => router.push(`/theme/${item?.id}`),
              },
            ],
            { cancelable: true }
          )
        // : Toast.show({
        //     type: 'info',
        //     text1: 'Info',
        //     text2: 'You have not completed this theme yet',
        //   })
      }
      delayLongPress={500}
      onPress={
        () =>
          // !item?.completed
          //   ?
          router.push(`/theme/${item?.id}`)
        // : Toast.show({
        //     type: 'info',
        //     text1: 'Info',
        //     text2: 'You have not completed this theme yet',
        //   })
      }
      style={({ pressed }) => [
        styles.row,
        {
          paddingLeft: 8,
          paddingVertical: 8,
          paddingRight: 16,
          borderWidth: 1,
          borderColor: "#e6f2ff",
          marginBottom: index + 1 === themes?.length ? 16 : 0,
        },
        pressed
          ? {
              backgroundColor: "#e6f2ff",
              transform: [{ scale: 0.99 }],
            }
          : {},
      ]}
    >
      <View style={styles.row}>
        <View style={styles.avatar}>
          <View
            style={[
              styles.avatarInner,
              // item?.completed ?
              { backgroundColor: "#fff" },
              // : {},
            ]}
          >
            <Typography
              style={[
                styles.avatarInnerText,
                {
                  fontSize: 8,
                },
              ]}
            >
              {"Index:\n"}
              <Typography style={styles.avatarInnerText}>
                {item?.index}
              </Typography>
            </Typography>
          </View>
        </View>
        <View style={styles.nameTheme}>
          <Typography style={styles.nameThemeInner} numberOfLines={2}>
            {item?.title}
          </Typography>
        </View>
      </View>
      <Pressable
        onPress={() =>
          // item?.completed &&
          router.push(`/theme/${item?.id}`)
        }
        style={({ pressed }) => [
          styles.saveBtn,
          // item?.completed
          //   ?
          {
            backgroundColor: pressed ? "#fff" : "#007aff",
          },
          // :
          // {backgroundColor: pressed ? '#007aff' : '#fff'},
        ]}
      >
        {
          ({ pressed }) => (
            // item?.completed ? (
            <ForwardIcon fill={pressed ? "#007aff" : "#fff"} />
          )
          // ) : (
          //   <BlockedIcon fill={pressed ? '#fff' : '#007aff'} />
          // )
        }
      </Pressable>
    </Pressable>
    {index + 1 === themes?.length ? null : (
      <View
        style={[
          styles.line,
          // item?.completed ?
          { backgroundColor: "#007aff" },
          // : {},
        ]}
      />
    )}
  </React.Fragment>
);

const ThemesScreen = () => {
  const navigation = useNavigation();
  const router = useRouter();
  const user = useSelectorState("user");
  const [themes, setThemes] = useState([
    // {
    //   id: 1,
    //   title: "Theme 1",
    //   index: 1,
    //   completed: false,
    // },
  ]);
  const [loading, setLoading] = useState(false);

  const getThemesData = useCallback(() => {
    setLoading(true);
    getThemes(user?.token)
      .then(({ data }) => {
        setLoading(false);
        setThemes(data);
      })
      .catch((err) => {
        if (err?.response?.status === 401) {
          navigation.reset({ index: 0, routes: [{ name: "(splash)" }] });
          AsyncStorage.clear();
        }
        Toast.show({
          type: "error",
          text1: "Error occurred while fetching themes",
          text2: JSON.stringify(err?.response?.data),
        });
        setLoading(false);
      });
  }, [user?.token]);

  useEffect(() => {
    if (!user?.token) return;
    getThemesData();
  }, [getThemesData]);

  return (
    <SafeAreaView mode="padding" style={styles.container}>
      <View style={[styles.containerInner, { paddingTop: 30 }]}>
        <View style={styles.row}>
          <Pressable
            style={({ pressed }) => [
              styles.row,
              { transform: [{ scale: pressed ? 0.99 : 1 }] },
            ]}
            onPress={() => navigation.navigate("profile")}
          >
            <View style={[styles.avatar, { borderColor: "#e6f2ff" }]}>
              <Typography style={{ textTransform: "uppercase" }}>
                {user?.first_name?.[0]} {user?.last_name?.[0]}
              </Typography>
            </View>
            <Typography style={styles.username}>
              {user?.first_name} {user?.last_name}
              <Typography style={styles.span}>{"\nLessons"}</Typography>
            </Typography>
          </Pressable>
          <View style={styles.row}>
            <Typography style={styles.statistics}>
              0/{themes?.length}
            </Typography>
          </View>
        </View>
      </View>

      <FlatList
        data={themes?.sort((a, b) => a?.index - b?.index)}
        renderItem={(props) => renderItem({ ...props, router, themes })}
        keyExtractor={(item) => item?.id?.toString()}
        showsVerticalScrollIndicator={false}
        style={[styles.container, styles.flatList]}
        refreshControl={
          <RefreshControl refreshing={loading} onRefresh={getThemesData} />
        }
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#fff",
    flex: 1,
  },
  flatList: { paddingHorizontal: 16 },
  containerInner: {
    padding: 16,
  },
  span: {
    fontSize: 12,
    color: "#007aff",
    textTransform: "uppercase",
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderRadius: 8,
    position: "relative",
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 60,
    borderWidth: 3,
    borderColor: "#007aff",
    padding: 6,
    alignItems: "center",
    justifyContent: "center",
  },
  avatarInner: {
    width: "100%",
    height: "100%",
    borderRadius: 60,
    backgroundColor: "#d7d7d7",
    alignItems: "center",
    justifyContent: "center",
  },
  avatarInnerText: {
    fontSize: 16,
    color: "#007aff",
    fontFamily: "SFProTextHeavy",
    textAlign: "center",
  },
  nameTheme: {
    width: width - 176,
    marginRight: "auto",
    marginLeft: 12,
  },
  nameThemeInner: {
    fontSize: 18,
    color: "#131313",
    letterSpacing: -0.5,
    fontFamily: "SFProTextRegular",
    fontWeight: "600",
  },
  saveBtn: {
    borderWidth: 2,
    borderColor: "#007aff",
    borderRadius: 12,
    padding: 8,
  },
  line: {
    width: 3,
    height: 36,
    left: 36,
    backgroundColor: "#f2f2f2",
    zIndex: 2,
  },
  username: {
    fontSize: 20,
    letterSpacing: -0.5,
    paddingLeft: 6,
    textTransform: "capitalize",
  },
  statistics: {
    fontFamily: "SFProTextBold",
    letterSpacing: -0.3,
  },
});

export default ThemesScreen;
