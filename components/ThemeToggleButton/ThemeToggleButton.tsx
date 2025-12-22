// components/ThemeToggle.tsx
import { Moon, Sun } from 'lucide-react-native';
import React from 'react';
import { TouchableOpacity, View } from 'react-native';
import useTheme from '../../hooks/useTheme/useTheme';
import Colors from '../../utilities/Color';

export default function ThemeToggleButton() {
  const { dark, setDark } = useTheme();

  return (
    <TouchableOpacity
      activeOpacity={0.8}
      onPress={() => { setDark(!dark) }}
      className={`w-12 h-5
      flex flex-row justify-center items-center
      rounded-full`}

      style={{
        // boxShadow: dark ? '0 0 20px rgba(255,255,255,0.1)' : '0 0 0px rgba(0,0,0,0.1)',
        backgroundColor: dark ? Colors.light_header : Colors.dark_header,
        borderColor: dark ? Colors.logo_light : Colors.logo_dark, 
        borderWidth: dark ? 0.2 : 0.2
      }}
    >
      {/* Sun Icon (Light Mode) */}
      <View className={`rounded-3xl p-1
      w-10 h-10
      flex justify-center items-center
      transition-all duration-300 ease-in-out
      ${dark ? 'translate-x-3' : '-translate-x-3 shadow-2xl'}`}
        style={{
          backgroundColor: dark ? Colors.dark_header : Colors.light_header,
          borderColor: dark ? Colors.logo_light : Colors.logo_dark, 
          borderWidth: dark ? 0.1 : 0.001,
          boxShadow: dark ? '3px 0 5px rgba(255,255,255,0.1)' : '-3px 0 10px rgba(0,0,0,0.1)',
        }}>
        <View className={`${dark ? 'hidden' : 'flex'}`}>
          <Sun size={20} color="#FBBF24" strokeWidth={2} />
        </View>

        <View className={`${dark ? 'flex' : 'hidden'}`}>
          <Moon size={18} color="#E0E7FF" strokeWidth={2} />
        </View>
      </View>


      {/* Moon Icon (Dark Mode) */}

      {/* <View className={`rounded-2xl p-1 ${dark ? 'opacity-100' : 'opacity-0'} transition-all duration-300 ease-in-out`} 
      style={{ backgroundColor: Colors.dark_header, 
      borderColor : Colors.light_header, borderWidth: 1 }}>
        <Moon size={18} color="#E0E7FF" strokeWidth={2} />
      </View> */}
    </TouchableOpacity>
  );
};

