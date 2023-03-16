import React, { useState, useEffect, useRef } from "react";

import {
  View,
  Text,
  Alert,
  Image,
  Animated,
  FlatList,
  Keyboard,
  Vibration,
  TextInput,
  StyleSheet,
  TouchableOpacity,
} from "react-native";

// import Video from "react-native-video";

// import { Video } from "expo-av";

import { ResizeMode } from "expo-av";
import VideoPlayer from "expo-video-player";

import Icon from "react-native-vector-icons/Ionicons";
import Icon1 from "react-native-vector-icons/MaterialCommunityIcons";

///////////////////////////////////////////////////////////////////////

const ChatWindow = () => {
  let [chat, setChat] = useState([
    {
      sender: "bot",
      message: "drop a 'hey'",
    },
  ]);
  let [inputMessage, setInputMessage] = useState("");
  let [botTyping, setbotTyping] = useState();
  let flatListRef = useRef(null);
  const name = "varun";

  //----------//

  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener(
      "keyboardDidShow",
      () => {
        flatListRef.current.scrollToEnd();
      }
    );

    return () => {
      keyboardDidShowListener.remove();
    };
  }, []);

  useEffect(() => {
    console.log("called");
  }, [chat]);

  //----------//

  const rasaAPI = async function handleClick(name, msg) {
    await fetch("https://rasa-anyo.loca.lt/webhooks/rest/webhook", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        charset: "UTF-8",
      },
      credentials: "same-origin",
      body: JSON.stringify({ sender: name, message: msg }),
    })
      .then((response) => response.json())
      .then((response) => {
        if (response) {
          for (let i = 0; i < response.length; i++) {
            const temp = response[i];
            let recipient_msg;
            const recipient_id = temp["recipient_id"];

            if (temp.hasOwnProperty("text")) {
              recipient_msg = temp["text"];
            }

            const response_temp = {
              sender: "bot",
              recipient_id: recipient_id,
              message: recipient_msg,
            };

            if (temp.hasOwnProperty("buttons")) {
              response_temp["buttons"] = temp["buttons"];
            }

            setChat((chat) => [...chat, response_temp]);
          }

          setbotTyping(false);
          flatListRef.current.scrollToEnd();
          // scrollBottom();
        }
      });
  };

  const handleSubmit = (evt) => {
    evt.preventDefault();
    const request_temp = {
      sender: "user",
      sender_id: name,
      message: inputMessage,
    };

    if (inputMessage !== "") {
      setChat((chat) => [...chat, request_temp]);
      setbotTyping(true);
      setInputMessage("");
      rasaAPI(name, inputMessage);
    } else {
      window.alert("Please enter valid message");
    }
    Vibration.vibrate(50);
  };

  const handleButton = (e, f) => {
    const request_temp = {
      sender: "user",
      sender_id: name,
      message: f,
    };
    rasaAPI(name, e);
    setChat((chat) => [...chat, request_temp]);
    setTimeout(() => {
      if (flatListRef.current) {
        flatListRef.current.scrollToEnd();
      }
    }, 1000);
  };

  const renderItem = ({ item }) => {
    return (
      <View
        style={{
          alignSelf: item["sender"] === "bot" ? "flex-start" : "flex-end",
          margin: 5,
        }}
      >
        {item.message.includes(".mp4") || item.message.includes("youtube") ? (
          // <Video
          //   style={styles.video}
          //   source={{
          //     uri: "http://d23dyxeqlo5psv.cloudfront.net/big_buck_bunny.mp4",
          //   }}
          // />
          <VideoPlayer
            key={item.message}
            style={styles.video}
            videoProps={{
              shouldPlay: true,
              resizeMode: ResizeMode.CONTAIN,
              // ❗ source is required https://docs.expo.io/versions/latest/sdk/video/#props
              source: {
                uri: "http://d23dyxeqlo5psv.cloudfront.net/big_buck_bunny.mp4",
              },
            }}
          />
        ) : (
          <View>
            {item.message.includes(".png") ||
            item.message.includes(".jpg") ||
            item.message.includes(".webp") ? (
              <Image source={{ uri: item.message }} style={styles.chatImg} />
            ) : (
              <Text style={styles.chatText}>{item.message}</Text>
            )}
          </View>
        )}

        {item.hasOwnProperty("buttons") ? (
          <View>
            {item.buttons.length <= 7 ? (
              <View>
                {item.buttons.map((button, index) => (
                  <View key={index} style={styles.btnsView}>
                    <Text
                      style={[
                        styles.btnsText,
                        {
                          fontSize: 10,
                          backgroundColor: "black",
                          fontWeight: "bold",
                        },
                      ]}
                    >
                      {"-->"}
                    </Text>
                    <TouchableOpacity
                      key={index}
                      onPress={() => handleButton(button.payload, button.title)}
                    >
                      <Text style={styles.btnsText}>{button.title}</Text>
                    </TouchableOpacity>
                  </View>
                ))}
              </View>
            ) : (
              <View>
                {item.buttons.map((button, index) => (
                  <View key={index} style={styles.multiBtnsView}>
                    <TouchableOpacity
                      key={index}
                      onPress={() => handleButton(button.payload, button.title)}
                    >
                      <Text style={styles.btnsText}>{button.title}</Text>
                    </TouchableOpacity>
                  </View>
                ))}
              </View>
            )}
          </View>
        ) : null}
      </View>
    );
  };

  //----------//

  return (
    <View style={{ marginTop: 10 }}>
      <FlatList
        ref={flatListRef}
        data={chat}
        renderItem={renderItem}
        style={{ flexDirection: "column" }}
      />

      <View style={styles.buttonTextView}>
        <TextInput
          value={inputMessage}
          onFocus={() => {
            setTimeout(() => {
              if (flatListRef.current) {
                flatListRef.current.scrollToEnd();
              }
            }, 1500);
          }}
          style={styles.textBox}
          onChangeText={(e) => {
            setInputMessage(e);
          }}
        />
        <TouchableOpacity style={styles.sendButton} onPress={handleSubmit}>
          <Icon name="send" size={20} color="white" />
        </TouchableOpacity>
      </View>
    </View>
  );
};

///////////////////////////////////////////////////////////////////////

export default ChatWindow;

///////////////////////////////////////////////////////////////////////

const styles = StyleSheet.create({
  sendButton: {
    width: 40,
    height: 40,
    borderRadius: 50,
    borderWidth: 1,
    backgroundColor: "grey",
    borderColor: "white",
    alignItems: "center",
    justifyContent: "center",
  },

  textBox: {
    borderColor: "white",
    borderWidth: 1,
    width: "86%",
    height: 40,
    borderRadius: 12,
    color: "white",
    backgroundColor: "grey",
    padding: 7,
  },

  buttonTextView: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-around",
    marginBottom: "40%",
    marginTop: 10,
  },

  chatText: {
    backgroundColor: "grey",
    padding: 8,
    borderRadius: 13,
    color: "white",
  },

  chatImg: {
    height: 150,
    width: 300,
    borderRadius: 12,
  },

  btnsText: {
    fontSize: 12,
    backgroundColor: "grey",
    marginTop: 8,
    marginLeft: 4,
    padding: 8,
    borderRadius: 13,
    color: "white",
  },
  multiBtnsView: {
    // height: 150,
    // width: 300,
    flexWrap: "wrap",
    flexDirection: "row",
  },
  btnsView: { flexDirection: "row", alignItem: "center" },
  video: { height: 150, width: 300, borderRadius: 12 },
});
