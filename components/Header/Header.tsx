import { Link, usePathname } from "expo-router";
import { MenuIcon } from "lucide-react-native";
import React, { useState } from "react";
import { Image, Text, TouchableOpacity, View } from "react-native";
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import useTheme from "../../hooks/useTheme/useTheme";
import Colors from "../../utilities/Color";
import ThemeToggleButton from "../ThemeToggleButton/ThemeToggleButton";

export default function Header() {
    const { top } = useSafeAreaInsets();
    const { dark } = useTheme();
    const pathname = usePathname();
    const isActive = (route: string) => pathname === route;

    const [isVisible, setIsVisible] = useState(true);

    const toggleVisibility = () => {
        setIsVisible(prev => !prev);
    }

    let color_changer = dark ? Colors.logo_light : Colors.logo_dark;
    let image_holder = dark ? require('../../assets/images/cartify-icon-light.png') : require('../../assets/images/cartify-icon-dark.png');

    return (
        <View className={`w-full h-[120px]
        relative top-0
        flex flex-row justify-between items-center
        px-8 shadow-md shadow-gray-500 z-20`}
        style={{
            paddingTop: top, backgroundColor: dark ? Colors.dark_header : Colors.light_header,
            boxShadow: dark ? '0 0 5px rgba(255,255,255,0.1)' : '0 0 5px rgba(0,0,0,0.1)'
        }}
        >
            <View className="flex flex-row gap-3 justify-center items-center">
                <Image
                    source={image_holder}
                    className="w-6 h-6 mb-2"
                />
                <Text className={`text-2xl text-center font-bold`}
                    style={{ color: dark ? Colors.logo_light : Colors.logo_dark }}>
                    CARTIFY</Text>
            </View>

            <View className="flex flex-row gap-10 justify-center items-center">
                <ThemeToggleButton />
                <TouchableOpacity className="w-fit h-fit mb-2" onPress={toggleVisibility}>
                    <MenuIcon color={color_changer} size={32} />
                </TouchableOpacity>
            </View>

            <View className={`w-screen h-20 overflow-hidden
            flex-row gap-2 px-4 pb-1 justify-center items-center
            transition-all duration-500 ease-in-out z-10`}
                style={{
                    position: 'absolute', top: top + 77,
                    borderBottomLeftRadius: 0, borderBottomRightRadius: 0,
                    backgroundColor: dark ? Colors.dark_header : Colors.light_header,
                    boxShadow: dark ? '0 0px 5px rgba(255,255,255,0.1)' : '0 0px 5px rgba(0,0,0,0.1)',
                    display: isVisible ? 'flex' : 'none'
                }}>
                <Link href="/" asChild>
                    <TouchableOpacity className="w-1/3 h-full flex justify-center items-center"
                        style={{
                            boxShadow: dark ? '-1px 0px 5px rgba(255,255,255,0.1)' : '-1px 0px 5px rgba(0,0,0,0.1)',
                            borderBottomWidth: isActive('/') ? 2 : 0,
                            borderBottomColor: dark ? Colors.logo_light : Colors.logo_dark
                        }}>
                        <Text className="text-2xl"
                            style={{
                                color: dark ? Colors.logo_light : Colors.logo_dark,

                            }}>Add Items</Text>
                    </TouchableOpacity>
                </Link>

                <Link href="/itemList" asChild>
                    <TouchableOpacity className="w-1/3 h-full flex justify-center items-center "
                        style={{
                            boxShadow: dark ? '0px 0px 5px rgba(255,255,255,0.1)' : '0px 0px 5px rgba(0,0,0,0.1)',
                            borderBottomWidth: isActive('/itemList') ? 2 : 0,
                            borderBottomColor: dark ? Colors.logo_light : Colors.logo_dark
                        }}>
                        <Text className="text-2xl"
                            style={{
                                color: dark ? Colors.logo_light : Colors.logo_dark,
                            }}>Buy Items</Text>
                    </TouchableOpacity>
                </Link>


                <Link href="/billing" asChild>
                    <TouchableOpacity className="w-1/3 h-full flex justify-center items-center"
                        style={{
                            boxShadow: dark ? '2px 0px 5px rgba(255,255,255,0.1)' : '2px 0px 5px rgba(0,0,0,0.1)',
                            borderBottomWidth: isActive('/billing') ? 2 : 0,
                            borderBottomColor: dark ? Colors.logo_light : Colors.logo_dark
                        }}>
                        <Text className="text-2xl"
                            style={{ color: dark ? Colors.logo_light : Colors.logo_dark }}>Billing</Text>
                    </TouchableOpacity>
                </Link>
            </View>
        </View>
    )
}