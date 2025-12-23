// AppContent.tsx

import { Stack } from "expo-router";
import React, { useEffect, useRef } from "react";
import { BackHandler, Platform, ToastAndroid, View } from "react-native";
import Header from "../components/Header/Header";
import useTheme from "../hooks/useTheme/useTheme";
import Colors from "../utilities/Color";

export default function AppContent() {
  const { dark } = useTheme();

  // Back button handler: double press to exit
  const backPressCount = useRef(0);

  useEffect(() => {
    if (Platform.OS === 'android') {
      const subscription = BackHandler.addEventListener(
        'hardwareBackPress',
        () => {
          if (backPressCount.current === 0) {
            backPressCount.current = 1;
            ToastAndroid.show('Press back again to exit', ToastAndroid.SHORT);

            setTimeout(() => {
              backPressCount.current = 0;
            }, 2000);

            return true; // Prevent default navigation
          }

          BackHandler.exitApp();
          return true;
        }
      );

      return () => subscription.remove();
    }
  }, []);

  return (
    <View
      className="flex-1"
      style={{
        backgroundColor: dark ? Colors.dark_background : Colors.light_background,
      }}
    >
      <Header />

      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: {
            backgroundColor: dark ? Colors.dark_background : Colors.light_background,
          },
        }}
      />
    </View>
  );
}