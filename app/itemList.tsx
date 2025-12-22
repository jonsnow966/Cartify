import * as React from "react";
import { Text, View } from "react-native";
import useTheme from "../hooks/useTheme/useTheme";
import Colors from "../utilities/Color";


export default function ItemList() {

  const {dark} = useTheme();

  return (
    <View className="w-screen h-full 
    relative top-12
    flex items-center"
    style={{
      backgroundColor: dark ? Colors.dark_background : Colors.light_background,
    }}>
      <Text className={`text-2xl text-center font-bold`}
        style={{ color: dark ? Colors.logo_light : Colors.logo_dark }}>Item List Screen</Text>
    </View>

  );
}
