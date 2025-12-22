 
import AsyncStorage from "@react-native-async-storage/async-storage";
import { ReactNode, useEffect, useState } from "react";
import { ThemeContext } from "../ThemeContext/ThemeContext";

const STORAGE_KEY = '@theme_dark_mode';

export default function ThemeProvider({children} : {children : ReactNode}){
    const [dark, setDark] = useState(true);

    useEffect(() => {
        const loadTheme = async () => {
            try {const savedTheme = await AsyncStorage.getItem(STORAGE_KEY);
                if (savedTheme !== null) {
                    setDark(JSON.parse(savedTheme));
                }
            } catch (error) {
                console.error("Failed to load theme", error);
            }
        };
        loadTheme();
    }, []);
    useEffect(() => {
        const saveTheme = async () => {
            try {
                await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(dark));
            } catch (error) {
                console.error("Failed to save theme", error);
            }
        };
        saveTheme();
    }, [dark]);
    
    return(
        <ThemeContext.Provider value={{dark, setDark}}>
            {children}
        </ThemeContext.Provider>
    )
} 