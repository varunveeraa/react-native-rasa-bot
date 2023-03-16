import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View, SafeAreaView, Image } from "react-native";

import ChatWindow from "./Chat";

import { Header } from "react-native-elements";

export default function App() {
  return (
    <View>
      {/* <Header
        centerComponent={{ text: "My Chat App", style: { color: "#fff" } }}
        containerStyle={{ backgroundColor: "#f4511e" }}
      /> */}
      <StatusBar style="auto" hidden />
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <Image source={require("./logo.png")} style={styles.anyoLogo} />
          <Text style={{ fontSize: 18, fontWeight: "400", color: "white" }}>
            anyo
          </Text>
        </View>
        <ChatWindow></ChatWindow>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: "relative",
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "black",
  },
  header: {
    marginTop: 50,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "grey",
    width: "99%",
    height: 45,
    borderRadius: 10,
    borderColor: "white",
    borderWidth: 0.5,
  },
  anyoLogo: {
    width: 30,
    height: 30,
    marginLeft: 20,
    marginRight: 10,
    borderRadius: 50,
  },
});
