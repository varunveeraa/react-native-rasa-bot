import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View, SafeAreaView } from "react-native";

import ChatWindow from "./Chat";

// import { Header } from "react-native-elements";

export default function App() {
  return (
    <SafeAreaView style={styles.container}>
      <ChatWindow></ChatWindow>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "black",
  },
});
