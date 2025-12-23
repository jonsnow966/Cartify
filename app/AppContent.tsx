import { Stack } from "expo-router";
import React from "react";
import { View } from "react-native";
import Header from "../components/Header/Header";
import useTheme from "../hooks/useTheme/useTheme";
import Colors from "../utilities/Color";

export default function AppContent() {

    const { dark } = useTheme();

    return (
        <View
            className="flex-1"
            style={{
                backgroundColor: dark ? Colors.dark_background : Colors.light_background,
            }}
        >
            <Header />

            {/* All your screens: index.tsx (AddItem), item-list.tsx, billing.tsx */}

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