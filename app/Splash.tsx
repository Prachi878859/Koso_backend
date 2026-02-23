import { useRouter } from "expo-router";
import React from "react";
import {
  ImageBackground,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

export default function Splash() {
  const router = useRouter();

  return (
    <ImageBackground
      source={require("../assets/images/bg.png")} 
      style={styles.background}
      resizeMode="cover"
    >
      <View style={styles.overlay} />

      <View style={styles.content}>
        {/* Logo */}
        <Text style={styles.logo}>KOSO</Text>

        {/* Tagline */}
        <Text style={styles.tagline}>
          Built on Innovation. Sustained by Trust.
        </Text>

        {/* Button */}
        <TouchableOpacity
      style={styles.button}
      onPress={() => router.replace("/")}   // 👈 index.tsx साठी
    >
          <Text style={styles.buttonText}>Let’s Get Started →</Text>
        </TouchableOpacity>
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.7)", // faint dark layer
  },
  content: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
  },
  logo: {
    fontSize: 64,
    fontWeight: "bold",
    color: "#FF4D57",
    marginBottom: 12,
  },
  tagline: {
    fontSize: 14,
    color: "#FFFFFF",
    marginBottom: 80,
    textAlign: "center",
  },
  button: {
    backgroundColor: "#FF4D57",
    paddingVertical: 15,
    paddingHorizontal: 40,
    borderRadius: 30,
    position: "absolute",
    bottom: 80,
    alignSelf: "center",
  },
  buttonText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#FFFFFF",
  },
});
