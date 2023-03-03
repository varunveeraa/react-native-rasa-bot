import React, { useState, useEffect, useRef } from "react";

import {
  View,
  Text,
  Image,
  FlatList,
  Keyboard,
  Vibration,
  TextInput,
  StyleSheet,
  TouchableOpacity,
} from "react-native";

import Video from "react-native-video";
import Icon from "react-native-vector-icons/Ionicons";

///////////////////////////////////////////////////////////////////////

const ChatWindow = () => {
  let [chat, setChat] = useState([
    {
      sender: "bot",
      message: "say hai to continue",
    },
  ]);
  let [inputMessage, setInputMessage] = useState("");
  let [botTyping, setbotTyping] = useState();
  let flatListRef = useRef(null);

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
    await fetch(
      "https://274c-106-51-152-15.in.ngrok.io/webhooks/rest/webhook",
      {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          charset: "UTF-8",
        },
        credentials: "same-origin",
        body: JSON.stringify({ sender: name, message: msg }),
      }
    )
      .then((response) => response.json())
      .then((response) => {
        if (response) {
          for (let i = 0; i < response.length; i++) {
            const temp = response[i];
            let recipient_msg;
            const recipient_id = temp["recipient_id"];
            if (temp.hasOwnProperty("text")) {
              recipient_msg = temp["text"];
            } else {
              recipient_msg = temp["image"];
            }

            const response_temp = {
              sender: "bot",
              recipient_id: recipient_id,
              message: recipient_msg,
            };

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
    const name = "varun";
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

  const renderItem = ({ item }) => {
    return (
      <View
        style={{
          alignSelf: item["sender"] === "bot" ? "flex-start" : "flex-end",
          margin: 5,
        }}
      >
        {item.message.includes(".png") ||
        item.message.includes(".jpg") ||
        item.message.includes(".webp") ? (
          <Image source={{ uri: item.message }} style={styles.chatImg} />
        ) : (
          <View>
            {item.message.includes(".mp4") ||
            item.message.includes("youtube") ? (
              <Video source={{ url: item.message }} />
            ) : (
              <Text style={styles.chatText}>{item.message}</Text>
            )}
          </View>
        )}
      </View>
    );
  };

  //----------//

  return (
    <View style={{ marginTop: 20 }}>
      <FlatList
        ref={flatListRef}
        data={chat}
        renderItem={renderItem}
        style={{ flexDirection: "column" }}
      />

      <View style={styles.buttonTextView}>
        <TextInput
          value={inputMessage}
          onFocus={() => flatListRef.current.scrollToEnd()}
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
    marginLeft: 5,
  },
  textBox: {
    borderColor: "white",
    borderWidth: 1,
    width: 350,
    height: 40,
    borderRadius: 12,
    color: "white",
    backgroundColor: "grey",
    padding: 7,
  },
  buttonTextView: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginBottom: 20,
    marginTop: 25,
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
});
