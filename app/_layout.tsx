import useLoad from "@/hooks/useLoad/useLoad";
import React from "react";
import { Image, LogBox, Text, View } from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";
import '../global.css';
import ThemeProvider from "../ThemeToggle/ThemeProvider/ThemeProvider";
import Colors from "../utilities/Color";
import AppContent from "./AppContent";

// Disable Reanimated strict mode warnings
LogBox.ignoreLogs([
  '[Reanimated] Reading from `value` during component render',
  '[Reanimated] Writing to `value` during component render',
]);

export default function RootLayout() {
  const loading = useLoad();
  if (loading) {
    const image_holder = require("../assets/images/cartify-icon-light.png");

    return (
      <View
        className="flex-1 justify-center items-center"
        style={{
          backgroundColor: Colors.dark_background
        }}
      >
        <Image
          source={image_holder}
          style={{
            width: 95,
            height: 75,
            resizeMode: 'cover',  // ← This replaces object-cover
          }}
          className="animate-drop-and-bounce"  // ← Keep only the animation class
        />
        <Text
          className="mt-4 text-4xl font-semibold"
          style={{ color: Colors.logo_light }}
        >
          CARTIFY
        </Text>
      </View>
    );
  }

  return (
    <SafeAreaProvider>
      <ThemeProvider>
        <AppContent />
      </ThemeProvider>
    </SafeAreaProvider>
  )
}



