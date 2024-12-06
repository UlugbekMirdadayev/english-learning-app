import React, { useState, useCallback, useEffect } from "react";
import {
  View,
  StyleSheet,
  ScrollView,
  RefreshControl,
  Image,
  Modal,
  Pressable,
  SectionList,
  Dimensions,
  Linking,
  TextInput,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Toast from "react-native-toast-message";
import Typography from "@/components/typography";
import {
  getThemes,
  postAnswers,
  postAnswersTest,
  postTelegramMessage,
} from "@/service/api";
import { useSelectorState } from "@/redux/selectors";
import WebView from "react-native-webview";
import Card from "@/components/card";
import TestCard from "@/components/test-card";
import Button from "@/components/button";
import * as Speech from "expo-speech";
import { Arrow, CheckIcon, BlockedIcon } from "@/assets/icons";
import { useNavigation } from "@react-navigation/native";
import { useLocalSearchParams } from "expo-router";
// import { useSearchParams } from "expo-router/build/hooks";

const ThemeScreen = () => {
  const navigation = useNavigation();
  // const { themeId } = useLocalSearchParams();
  const { theme: parsedTheme } = useLocalSearchParams();
  console.log({ parsedTheme });
  const theme = parsedTheme
    ? JSON.parse(decodeURIComponent(parsedTheme))
    : null;
  const user = useSelectorState("user");
  // const [theme, setTheme] = useState({});
  const [loading, setLoading] = useState(true);
  const [loadingTest, setloadingTest] = useState(false);
  const [loadingAnswer, setloadingAnswer] = useState(false);
  const [modalView, setModalView] = useState(false);
  const [modalResponse, setModalResponse] = useState({});

  const [errorImages, setErrorImages] = useState([]);
  const [selectedOption, setSelectedOption] = useState([]);
  const [answers, setAnswers] = useState([]);
  const [voices, setVoices] = useState([]);
  const [selectedVoice, setSelectedVoice] = useState(null);
  const [openModal, setOpenModal] = useState(false);
  const [imageWidth] = useState(Dimensions.get("screen").width - 32); // Initial width
  const [imageHeight] = useState(200); // Initial height

  // const getThemesData = useCallback(() => {
  //   setLoading(true);
  //   getThemes(user?.token, themeId)
  //     .then(({ data }) => {
  //       setLoading(false);
  //       setTheme(data);
  //     })
  //     .catch((err) => {
  //       console.log(err);
  //       if (err?.response?.status === 401) {
  //         navigation.reset({ index: 0, routes: [{ name: "(splash)" }] });
  //         AsyncStorage.clear();
  //       }
  //       Toast.show({
  //         type: "error",
  //         text1: "Error",
  //         text2: "Something went wrong",
  //       });
  //       setLoading(false);
  //     });
  // }, [user?.token]);

  // useEffect(() => {
  //   getThemesData();
  // }, [getThemesData]);

  useEffect(() => {
    Speech.getAvailableVoicesAsync()
      .then((_voices) => {
        setVoices([
          {
            title: "Voices",
            data: _voices.map((voice) => ({
              ...voice,
              name: `${voice.language} (${voice.name})`,
              id: voice.identifier,
            })),
          },
        ]);
      })
      .catch((error) => console.log("Error fetching voices:", error));
  }, []);

  const StickyHeaderComponent = () => (
    <Pressable style={styles.stickyHeader} onPress={() => setOpenModal(false)}>
      <Typography style={styles.stickyHeaderText}>Back</Typography>
    </Pressable>
  );

  const renderItems = ({ item }) => (
    <Pressable
      style={[
        styles.row,
        {
          paddingVertical: 16,
          paddingHorizontal: 16,
          borderBottomWidth: 1,
          borderBottomColor: selectedVoice === item?.id ? "#007aff" : "#dedede",
          backgroundColor: selectedVoice === item?.id ? "#007aff" : "#fff",
          borderRadius: 6,
          marginHorizontal: 16,
          marginTop: 8,
        },
      ]}
      onPress={() => {
        setSelectedVoice(item?.id);
        // setOpenModal(false);
        Speech.stop();
        Speech.speak(item?.name, {
          voice: item?.id,
          rate: 1,
          volume: 1,
          language: item?.language,
        });
      }}
    >
      <Typography
        style={{
          color: selectedVoice === item?.id ? "#fff" : "#007aff",
        }}
      >
        {item?.name}
      </Typography>
    </Pressable>
  );

  const onSubmit = () => {
    // if (testResult?.correct_percentage) {
    //   return Linking.openURL('https://t.me/mukarama_24_80');
    // }
    const formData = theme?.multiple_questions?.map((item) => {
      const answer = selectedOption?.find(
        (option) => option?.question_id === item?.id
      );
      return {
        answer: !!answer?.answer,
        id: answer?.question_id ? answer?.question_id : item?.id,
      };
    });

    const totalCount = formData?.length;
    const trueCount = formData?.filter((item) => item.answer)?.length;
    const falseCount = totalCount - trueCount;

    const truePercentage = (trueCount / totalCount) * 100;
    const falsePercentage = (falseCount / totalCount) * 100;
    setloadingTest(true);
    postTelegramMessage(
      `<b>🎓 Multiple Choice Results</b>\n\n` + // Bosh sarlavha
        `<b>📚 Lesson:</b> ${theme?.title}\n\n` + // Dars mavzusi
        `<b>📊 Results</b>\n` +
        `✔️ Correct percentage: <i>${truePercentage}%</i>\n` + // To'g'ri foizlar
        `❌ Wrong percentage: <i>${falsePercentage}%</i>\n\n` + // Xato foizlar
        `👤 <b>Student Name:</b> <u>${`${user?.first_name} ${user?.last_name}`}</u>` // O'quvchi ismi va familiyasi
    )
      .then(() => {
        setloadingTest(false);
        setModalResponse({
          text: `Correct percentage: ${truePercentage}\nWrong percentage: ${falsePercentage}\n`,
          status: String(truePercentage),
        });
        Toast.show({
          type: "info",
          text1: String(truePercentage),
          text2: "Your score",
        });
      })
      .catch((err) => {
        console.log(err, "error post message telegram");
        setloadingTest(false);
      });
    // setloadingTest(true);
    // postAnswersTest(user?.token, {questions: formData})
    //   .then(({data}) => {
    //     setloadingTest(false);
    //     Toast.show({
    //       type: 'info',
    //       text1: String(data?.correct_percentage),
    //       text2: 'Your score',
    //     });
    //     getThemesData();
    //     setModalResponse({
    //       text: `Correct percentage: ${data?.correct_percentage}\nWrong percentage: ${data?.wrong_percentage}\n`,
    //       status: data?.correct_percentage,
    //     });

    //   })
    //   .catch(err => {
    //     console.log(err?.response);
    //     setloadingTest(false);
    //     Toast.show({
    //       swipeable: true,
    //       type: 'error',
    //       text1: 'Error',
    //       text2: err.response?.data?.error,
    //     });
    //   });
  };

  const checkQuestion = (answer) => {
    setloadingAnswer(answer?.question_id);
    postTelegramMessage(
      `<b>🎓 Writing Results</b>\n\n` + // Bosh sarlavha
        `<b>📚 Lesson:</b> ${theme?.title}\n\n` + // Dars mavzusi
        `<b>❓ Question:</b> ${answer?.question?.trim()}\n\n` + // Savol
        `<b>✍️ Answer:</b> ${answer?.answer}\n\n` + // Talabaning javobi
        `👤 <b>Student Name:</b> <u>${user?.first_name} ${user?.last_name}</u>` // Talabaning ismi va familiyasi
    )
      .then(() => {
        setloadingAnswer(false);
        setModalResponse({
          text: `Answers received`,
          status: "Teacher checks now",
        });
        Toast.show({
          type: "info",
          text1: "Teacher checks now",
          text2: "Answers received",
        });
      })
      .catch((err) => {
        console.log(err, "error post message telegram");
        setloadingAnswer(false);
      });

    // setloadingAnswer(answer?.question_id);
    // postAnswers(user?.token, {
    //   user_answer: {
    //     text: answer?.answer,
    //     question_id: answer?.question_id,
    //   },
    // })
    //   .then(({data}) => {
    //     setloadingAnswer(false);
    //     Toast.show({
    //       type: 'info',
    //       text1: String(data?.evaluation?.score),
    //       text2: 'Your score',
    //     });
    //     setModalResponse({
    //       text: data?.evaluation?.feedback,
    //       status: data?.evaluation?.score,
    //     });
    //     speakText(data?.evaluation?.feedback, 0.4);
    //     getThemesData();
    //   })
    //   .catch(err => {
    //     setloadingAnswer(false);
    //     Toast.show({
    //       type: 'error',
    //       text1: 'Error',
    //       text2: JSON.stringify(err?.response?.data || 'Error'),
    //     });
    //   });
  };

  // console.log("====================================");
  // console.log(theme);
  // console.log("====================================");

  // const testResult = theme?.test_results?.length
  //   ? theme?.test_results[theme?.test_results?.length - 1]
  //   : {};

  return (
    <SafeAreaView style={styles.container}>
      <Modal visible={!!modalResponse?.status} transparent animationType="fade">
        <SafeAreaView style={styles.container}>
          <View
            style={{
              flex: 1,
              backgroundColor: "rgba(0,0,0,0.5)",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <View
              style={{
                backgroundColor: "#fff",
                padding: 16,
                margin: 16,
                borderRadius: 4,
              }}
            >
              <Typography>
                Your score: {modalResponse?.status}
                {"\n"}
              </Typography>
              <Typography>{modalResponse?.text}</Typography>
              <Button
                title={"OK"}
                style={{
                  marginTop: 16,
                }}
                onPress={() => {
                  setModalResponse({});
                }}
              />
            </View>
          </View>
        </SafeAreaView>
      </Modal>
      {theme?.id ? (
        <View style={[styles.containerInner, { paddingTop: 16 }]}>
          <Pressable style={styles.header} onPress={() => navigation.goBack()}>
            <Arrow />
            <Typography style={styles.title}> {theme?.title}</Typography>
          </Pressable>
        </View>
      ) : loading ? null : (
        <View
          style={[
            styles.container,
            {
              alignItems: "center",
              justifyContent: "center",
              gap: 16,
            },
          ]}
        >
          <Typography
            style={[{ textAlign: "center", marginTop: 16 }, styles.title]}
          >
            No data
          </Typography>
          <BlockedIcon fill="#000" />
        </View>
      )}
      <ScrollView
        nestedScrollEnabled
        showsVerticalScrollIndicator={false}
        // refreshControl={
        //   <RefreshControl refreshing={loading} onRefresh={getThemesData} />
        // }
      >
        {theme?.id ? (
          <View style={[styles.container, { paddingVertical: 16 }]}>
            <View style={styles.containerInner}>
              <View style={styles.roadmap}>
                <Typography style={styles.roadmapInner}>
                  The aim of the lesson
                </Typography>
                <Typography style={styles.roadmapInner}>
                  {theme?.objectives?.map((item) => item?.name)?.join("\n")}
                </Typography>
              </View>

              <View>
                <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                  {/* {errorImages.includes(theme?.media_items?.id) ? null : ( */}
                  <View
                    style={{
                      width: imageWidth,
                      height: imageHeight,
                      borderRadius: 6,
                      marginTop: 12,
                      position: "relative",
                      borderWidth: 1,
                      borderColor: "#d1d1d1",
                      borderRadius: 6,
                      overflow: "hidden",
                    }}
                  >
                    {/* {theme?.media === "image" ? (
                      <Image
                        source={{
                          uri: `https://langapp-production.up.railway.app${theme?.media_items?.media_link}`,
                        }}
                        style={{
                          position: "absolute",
                          top: 0,
                          left: 0,
                          width: "100%",
                          height: "100%",
                        }}
                        resizeMode="cover"
                        onError={() =>
                          setErrorImages([
                            ...errorImages,
                            theme?.media_items?.id,
                          ])
                        }
                      />
                    ) : theme?.media === "link" ? (
                      <> */}
                    <Modal visible={modalView} animationType="slide">
                      <SafeAreaView style={styles.container}>
                        <Button
                          title="Exit"
                          onPress={() => setModalView(false)}
                          style={{ borderRadius: 0 }}
                        />
                        <WebView
                          allowsFullscreenVideo
                          scrollEnabled
                          allowsLinkPreview
                          source={{ uri: theme?.media }}
                          style={{
                            height: "100%",
                            width: "100%",
                            position: "absolute",
                            top: 0,
                            left: 0,
                          }}
                          onError={() =>
                            setErrorImages([...errorImages, theme?.media])
                          }
                        />
                      </SafeAreaView>
                    </Modal>

                    <WebView
                      allowsFullscreenVideo
                      scrollEnabled
                      allowsLinkPreview
                      source={{ uri: theme?.media }}
                      style={{
                        height: "100%",
                        width: "100%",
                        position: "absolute",
                        top: 0,
                        left: 0,
                      }}
                      onError={() =>
                        setErrorImages([...errorImages, theme?.media])
                      }
                    />
                    {/* </>
                    ) : null} */}
                  </View>
                </ScrollView>
                {theme?.media ? (
                  <Button
                    style={{ marginTop: 10 }}
                    title="View full screen video"
                    onPress={() => setModalView(true)}
                  />
                ) : null}
                {/* )} */}
                {theme?.translations && (
                  <Typography style={{ marginTop: 16, fontSize: 16 }}>
                    New Words
                  </Typography>
                )}
                {voices?.length ? (
                  <>
                    <Button
                      title={selectedVoice?.name || "Select voice"}
                      style={{ marginVertical: 16 }}
                      onPress={() => setOpenModal(true)}
                    />
                    <Modal visible={openModal} animationType="fade">
                      <SafeAreaView
                        style={styles.container}
                        edges={["top", "bottom"]}
                      >
                        <SectionList
                          sections={voices}
                          keyExtractor={(item, index) => item + index}
                          renderItem={renderItems}
                          stickySectionHeadersEnabled={true}
                          renderSectionHeader={({ section: { title } }) => (
                            <StickyHeaderComponent title={title} />
                          )}
                          style={styles.container}
                        />
                      </SafeAreaView>
                    </Modal>
                  </>
                ) : null}
                {theme?.translations?.map((translations) => (
                  <Card
                    key={translations?.id}
                    title={{
                      en: translations?.en,
                      uz: translations?.uz,
                    }}
                  />
                ))}
                {theme?.multiple_questions?.length ? (
                  <>
                    <Typography style={{ marginTop: 16, fontSize: 16 }}>
                      Quiz
                    </Typography>
                    <View
                      style={{
                        position: "relative",
                        // height: testResult?.correct_percentage ? 120 : 'auto',
                        overflow: "hidden",
                        // padding: testResult?.correct_percentage ? 16 : 0,
                      }}
                    >
                      {/* {testResult?.correct_percentage ? (
                        <View style={styles.overlay}>
                          <Typography style={styles.overlay_text}>
                            Your result{'\n'}
                            Correct percentage: {testResult?.correct_percentage}
                            %{'\n'}
                            Wrong percentage: {testResult?.wrong_percentage}%
                          </Typography>
                        </View>
                      ) : null} */}
                      {theme?.multiple_questions?.map(
                        (multiple_questions, index) => (
                          <TestCard
                            key={index}
                            index={index + 1}
                            title={multiple_questions?.content}
                            options={multiple_questions?.answers?.sort(
                              (a, b) => a?.id - b?.id
                            )}
                            onChange={(option) =>
                              setSelectedOption([
                                ...(selectedOption || []).filter(
                                  (item) =>
                                    item?.question_id !== multiple_questions?.id
                                ),
                                {
                                  id: option?.id,
                                  answer: option?.correct,
                                  question_id: multiple_questions?.id,
                                },
                              ])
                            }
                          />
                        )
                      )}
                    </View>
                  </>
                ) : null}
              </View>

              {theme?.reading ? (
                <>
                  <Typography style={{ marginVertical: 8, fontSize: 22 }}>
                    Text essay
                  </Typography>
                  <Typography>{theme?.reading}</Typography>
                  <Typography style={{ marginVertical: 8, fontSize: 22 }}>
                    Questions
                  </Typography>
                  {theme?.questions?.map((question, index) => (
                    <View key={question?.id}>
                      <Typography>
                        {index + 1}) {question?.question}
                      </Typography>
                      <View style={styles.row}>
                        <TextInput
                          readOnly={
                            !!theme?.user_answers_scores?.find(
                              (answ) => answ?.question_id === question?.id
                            )?.score
                          }
                          style={{
                            borderWidth: 1,
                            borderRadius: 6,
                            borderTopRightRadius: 0,
                            borderBottomRightRadius: 0,
                            padding: 10,
                            height: 49,
                            marginVertical: 10,
                            fontSize: 16,
                            fontWeight: "400",
                            fontFamily: "Roboto-Regular",
                            flex: 1,
                            borderRightWidth: 0,
                          }}
                          // defaultValue={
                          //   theme?.user_answers_scores?.find(
                          //     (answ) => answ?.question_id === question?.id
                          //   )?.score
                          //     ? String(
                          //         "Your scrore: " +
                          //           theme?.user_answers_scores?.find(
                          //             (answ) =>
                          //               answ?.question_id === question?.id
                          //           )?.score
                          //       )
                          //     : ""
                          // }
                          onChangeText={(text) =>
                            setAnswers([
                              ...answers.filter(
                                (item) => item?.question_id !== question?.id
                              ),
                              {
                                question_id: question?.id,
                                answer: text,
                              },
                            ])
                          }
                          placeholder="Type your answer"
                          placeholderTextColor={"#d1d1d1"}
                        />

                        <Button
                          title={<CheckIcon fill="#fff" />}
                          style={styles.button}
                          disabled={
                            !answers?.find(
                              (item) => item?.question_id === question?.id
                            )?.answer ||
                            !!theme?.user_answers_scores?.find(
                              (answ) => answ?.question_id === question?.id
                            )?.score
                          }
                          onPress={() =>
                            checkQuestion({
                              ...answers?.find(
                                (item) => item?.question_id === question?.id
                              ),
                              question: question?.question,
                            })
                          }
                          loading={loadingAnswer === question?.id}
                        />
                      </View>
                    </View>
                  ))}
                </>
              ) : null}
            </View>
          </View>
        ) : null}
      </ScrollView>
      {theme?.multiple_questions?.length ? (
        <Button
          title={
            // testResult?.correct_percentage
            //   ? 'Click to try again'
            //   :
            "Send to check"
          }
          style={{
            margin: 16,
          }}
          loading={loadingTest}
          disabled={
            // testResult?.correct_percentage
            //   ? false
            //   :
            selectedOption?.length !== (theme?.multiple_questions?.length || 0)
          }
          onPress={onSubmit}
        />
      ) : null}
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
  stickyHeader: {
    backgroundColor: "#fff",
    paddingVertical: 8,
    borderBottomColor: "#ddd",
    borderBottomWidth: 1,
    paddingHorizontal: 16,
  },
  stickyHeaderText: {
    fontSize: 22,
    paddingHorizontal: 16,
    color: "#007aff",
    fontFamily: "SFProTextMedium",
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  header: {
    borderBottomWidth: 1,
    borderBottomColor: "#d1d1d1",
    marginBottom: 10,
    paddingBottom: 10,
    flexDirection: "row",
    alignItems: "center",
  },
  title: {
    fontSize: 20,
    lineHeight: 30,
    textTransform: "capitalize",
  },
  roadmap: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: "#007aff",
    borderRadius: 6,
  },
  roadmapInner: {
    fontSize: 14,
    color: "#fff",
  },
  button: {
    paddingHorizontal: 12,
    borderTopLeftRadius: 0,
    borderBottomLeftRadius: 0,
    height: 50,
  },
  overlay: {
    position: "absolute",
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
    backgroundColor: "rgba(0,0,0,0.8)",
    zIndex: 5,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  overlay_text: {
    textAlign: "center",
    color: "#fff",
    lineHeight: 25,
  },
});

export default ThemeScreen;
