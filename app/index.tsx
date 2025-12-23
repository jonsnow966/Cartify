import { yupResolver } from '@hookform/resolvers/yup';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Picker } from '@react-native-picker/picker';
import * as React from "react";
import { Controller, useForm } from "react-hook-form";
import { Text, TextInput, TouchableOpacity, View } from "react-native";
import * as yup from 'yup';
import useTheme from "../hooks/useTheme/useTheme";
import { addItemSchema, categories, metric } from "../schemas/dataSchema";
import Colors from "../utilities/Color";


type FormData = yup.InferType<typeof addItemSchema>;

export default function Index() {

  const { dark } = useTheme();

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting},
  } = useForm<FormData>({
    resolver: yupResolver(addItemSchema),
    defaultValues: {
      itemName: '',
      itemQuantity: undefined, // or null
    },
  });

const onSubmit = async (data: FormData) => {
  try {
    const existingJSON = await AsyncStorage.getItem('items');
    const existingItems = existingJSON ? JSON.parse(existingJSON) : [];

    const newItem = {
      // No id needed!
      ...data,
      createdAt: new Date().toISOString(),
    };

    const updatedItems = [...existingItems, newItem];
    await AsyncStorage.setItem('items', JSON.stringify(updatedItems));

    console.log('Item added:', newItem);
    reset();
  } catch (error) {
    console.error('Save failed:', error);
  }
};

  return (
    <View className="w-screen h-full 
    relative top-[120px]
    flex items-center"
      style={{
        backgroundColor: dark ? Colors.dark_background : Colors.light_background,
      }}>
      {/* Form */}
      <View className={`w-full h-fit
      flex items-center gap-5 px-10`}>
        {/* Form Heading */}
        {/* <Text className="font-bold text-3xl mb-8 text-center"
          style={{ color: dark ? Colors.logo_light : Colors.logo_dark }}>Add Items</Text> */}

        {/* Category Field */}
        <View className="w-full relative mb-6 z-10">
          <Text className="mb-2 text-lg absolute -top-3.5 left-3"
            style={{
              backgroundColor: dark ? Colors.dark_background : Colors.light_background,
              paddingHorizontal: 4,
              color: dark ? Colors.logo_light : Colors.logo_dark,
              zIndex: 20.
            }}>Category *</Text>

          <View className="border rounded-lg"
            style={{
              backgroundColor: dark ? Colors.dark_background : Colors.light_background,
              borderColor: dark ? Colors.light_background : Colors.dark_background,
              height: 60,
            }}>
            <Controller
              control={control}
              name="category"
              render={({ field: { onChange, value } }) => (
                <Picker
                  selectedValue={value || ''}
                  onValueChange={onChange}
                  style={{
                    height: 60,
                    color: dark ? 'white' : 'black',
                    // backgroundColor : dark ? Colors.dark_background: Colors.light_background,
                  }}
                  dropdownIconColor={dark ? Colors.light_background : Colors.dark_background}
                  mode='dropdown'
                  itemStyle={{ borderWidth: 10, borderColor: dark ? Colors.light_background : Colors.dark_background }}
                >
                  <Picker.Item label="Select category..." value=""
                    style={{
                      color: dark ? 'white' : 'black', backgroundColor: dark ? Colors.dark_background : Colors.light_background,
                      zIndex: 10,
                    }}
                  />
                  {categories.map((cat, index) => (
                    <Picker.Item key={`category-${index}`} label={cat} value={cat}
                      style={{ color: dark ? 'white' : 'black', backgroundColor: dark ? Colors.dark_background : Colors.light_background }} />
                  ))}
                </Picker>
              )}
            />
          </View>
          {errors.category && <Text className="text-red-500 mt-1">{errors.category.message}</Text>}
        </View>

        {/* Item Name Field*/}
        <View className="w-full relative mb-6 z-10"
          style={{ borderColor: dark ? Colors.light_background : Colors.dark_background, }}>
          <Text className="mb-2 text-lg absolute -top-3.5 left-3 z-20"
            style={{
              backgroundColor: dark ? Colors.dark_background : Colors.light_background,
              paddingHorizontal: 4,
              color: dark ? Colors.logo_light : Colors.logo_dark
            }}>Item Name *</Text>
          <Controller
            control={control}
            name="itemName"
            render={({ field: { onChange, onBlur, value } }) => (
              <TextInput
                placeholder="e.g. Apple Juice"
                placeholderTextColor="#999"
                onBlur={onBlur}
                onChangeText={onChange}
                value={value}
                className="border rounded-lg px-4"
                style={{
                  height: 60,
                  backgroundColor: dark ? Colors.dark_background : Colors.light_background,
                  color: dark ? 'white' : 'black',
                  borderColor: dark ? Colors.light_background : Colors.dark_background,
                }}
                autoCapitalize="words"
              />
            )}
          />
          {errors.itemName && (
            <Text className="text-red-500 mt-1">{errors.itemName.message}</Text>
          )}
        </View>

        <View className='w-full flex flex-row gap-3 justify-center items-center'>
          {/* Item Quantity Field*/}
          <View className="flex-1 relative mb-6 z-10"
            style={{ borderColor: dark ? Colors.light_background : Colors.dark_background, }}>
            <Text className="mb-2 text-lg absolute -top-3.5 left-3 z-20 "
              style={{
                backgroundColor: dark ? Colors.dark_background : Colors.light_background,
                paddingHorizontal: 4,
                color: dark ? Colors.logo_light : Colors.logo_dark
              }}>Item Quantity *</Text>
            <Controller
              control={control}
              name="itemQuantity"
              render={({ field: { onChange, onBlur, value } }) => (
                <TextInput
                  placeholder="e.g. 1.5"
                  placeholderTextColor="#999"
                  keyboardType="decimal-pad"
                  onBlur={onBlur}
                  onChangeText={onChange}
                  value={value}
                  className="border rounded-lg px-4"
                  style={{
                    height: 60,
                    backgroundColor: dark ? Colors.dark_background : Colors.light_background,
                    color: dark ? Colors.logo_light : Colors.logo_dark,
                    borderColor: dark ? Colors.light_background : Colors.dark_background,
                  }}
                />
              )}
            />
            {errors.itemQuantity && (
              <Text className="text-red-500 mt-1">{errors.itemQuantity.message}</Text>
            )}
          </View>
          {/* Metrics */}
          <View className="flex-1 relative mb-6 z-10">
            <Text
              className="absolute -top-3.5 left-3 z-20 text-lg"
              style={{
                backgroundColor: dark ? Colors.dark_background : Colors.light_background,
                paddingHorizontal: 4,
                color: dark ? Colors.logo_light : Colors.logo_dark,
              }}
            >
              Unit *
            </Text>

            <View
              className="border rounded-lg"
              style={{
                backgroundColor: dark ? Colors.dark_background : Colors.light_background,
                borderColor: dark ? Colors.light_background : Colors.dark_background,
                height: 60,
              }}
            >
              <Controller
                control={control}
                name="metric"
                render={({ field: { onChange, value } }) => (
                  <Picker
                    selectedValue={value || ''}
                    onValueChange={onChange}
                    style={{
                      height: 60,
                      color: dark ? 'white' : 'black',
                    }}
                    dropdownIconColor={dark ? Colors.light_background : Colors.dark_background}
                    mode="dropdown"
                  >
                    <Picker.Item label="Select unit..." value=""
                      style={{ color: dark ? 'white' : 'black', backgroundColor: dark ? Colors.dark_background : Colors.light_background }} />
                    {metric.map((unit, index) => (
                      <Picker.Item key={`metric-${index}`} label={unit} value={unit}
                        style={{ color: dark ? 'white' : 'black', backgroundColor: dark ? Colors.dark_background : Colors.light_background }} />
                    ))}
                  </Picker>
                )}
              />
            </View>

            {errors.metric && (
              <Text className="text-red-500 mt-1">{errors.metric.message}</Text>
            )}
          </View>
        </View>

        <TouchableOpacity className='w-full flex justify-center items-center py-5 rounded-xl'
          onPress={handleSubmit(onSubmit)}
          disabled={isSubmitting}
          style={{
            backgroundColor: dark ? Colors.light_background : Colors.dark_background,

          }}>
          <Text className='text-xl font-bold shadow-3xl' style={{ color: dark ? Colors.dark_background : Colors.light_background }}>
            {isSubmitting ? 'Adding...' : 'Add Item'}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
