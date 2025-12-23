// app/itemList.tsx

import AsyncStorage from "@react-native-async-storage/async-storage";
import { Picker } from '@react-native-picker/picker';
import { ChevronDown, ChevronUp, ShoppingCart, Trash2 } from "lucide-react-native";
import * as React from "react";
import { useEffect, useState } from "react";
import { SectionList, Text, TextInput, TouchableOpacity, View } from "react-native";
import useTheme from "../hooks/useTheme/useTheme";
import { buySchema, categories, metric } from "../schemas/buySchema";
import Colors from "../utilities/Color";

type Item = {
  itemName: string;
  itemQuantity: string | null;
  category: string;
  metric: string;
  rate?: string;
  createdAt: string;
};

type Errors = {
  itemName?: string;
  itemQuantity?: string;
  rate?: string;
  metric?: string;
};

export default function ItemList() {
  const { dark } = useTheme();

  const [items, setItems] = useState<Item[]>([]);
  const [openSection, setOpenSection] = useState<string | null>(null);
  const [openItems, setOpenItems] = useState<Set<string>>(new Set()); // Now keys are createdAt strings
  const [errors, setErrors] = useState<Map<string, Errors>>(new Map());

  const loadItems = async () => {
    try {
      const json = await AsyncStorage.getItem('items');
      if (json) {
        const parsedItems: Item[] = JSON.parse(json);
        const sortedItems = parsedItems.sort((a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
        setItems(sortedItems);
      }
    } catch (error) {
      console.error('Failed to load items:', error);
    }
  };

  useEffect(() => {
    loadItems();
  }, []);

  const saveItems = async (newItems: Item[]) => {
    await AsyncStorage.setItem('items', JSON.stringify(newItems));
  };

  const sections = categories.map(cat => ({
    title: cat,
    data: items.filter(item => item.category === cat),
  }));

  const toggleSection = (title: string) => {
    setOpenSection((prev) => (prev === title ? null : title));
  };

  const toggleItem = (createdAt: string) => {
    setOpenItems((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(createdAt)) {
        newSet.delete(createdAt);
      } else {
        newSet.add(createdAt);
      }
      return newSet;
    });
  };

  const getItemKey = (item: Item) => item.createdAt;

  const validateField = async (item: Item, field: keyof Errors, value: any) => {
    try {
      await buySchema.validateAt(field, { ...item, [field]: value });
      setErrors(prev => {
        const newMap = new Map(prev);
        const itemErrors = { ...(newMap.get(getItemKey(item)) || {}) };
        delete itemErrors[field];
        if (Object.keys(itemErrors).length === 0) newMap.delete(getItemKey(item));
        else newMap.set(getItemKey(item), itemErrors);
        return newMap;
      });
    } catch (err: any) {
      setErrors(prev => {
        const newMap = new Map(prev);
        const itemErrors = { ...(newMap.get(getItemKey(item)) || {}) };
        itemErrors[field] = err.message;
        newMap.set(getItemKey(item), itemErrors);
        return newMap;
      });
    }
  };

  const updateField = (item: Item, field: 'itemName' | 'itemQuantity' | 'rate' | 'metric', value: string) => {
    const newItems = [...items];
    const index = newItems.findIndex(i => i.createdAt === item.createdAt);
    if (index !== -1) {
      (newItems[index] as any)[field] = value;
      setItems(newItems);
      validateField(newItems[index], field, value);

      const currentErrors = errors.get(getItemKey(newItems[index])) || {};
      const updatedErrors = { ...currentErrors };
      delete updatedErrors[field];
      if (Object.keys(updatedErrors).length === 0) {
        saveItems(newItems);
      }
    }
  };

  const handleDelete = async (item: Item) => {
    const updated = items.filter(i => i.createdAt !== item.createdAt);
    setItems(updated);
    setErrors(prev => {
      const newMap = new Map(prev);
      newMap.delete(getItemKey(item));
      return newMap;
    });
    await saveItems(updated);
  };

  const handleAddToBill = async (item: Item) => {
    try {
      await buySchema.validate(item, { abortEarly: false });
    } catch (err: any) {
      const validationErrors: Errors = {};
      err.inner.forEach((e: any) => {
        validationErrors[e.path as keyof Errors] = e.message;
      });
      setErrors(prev => new Map(prev).set(getItemKey(item), validationErrors));
      return;
    }

    const qty = parseFloat(item.itemQuantity || '0') || 0;
    const rate = parseFloat(item.rate || '0') || 0;
    const total = (qty * rate).toFixed(2);

    const billItem = {
      itemName: item.itemName,
      itemQuantity: item.itemQuantity,
      metric: item.metric,
      rate: item.rate || '0',
      totalPrice: total,
    };

    const existingBill = await AsyncStorage.getItem('billItems');
    const bill = existingBill ? JSON.parse(existingBill) : [];
    bill.push(billItem);
    await AsyncStorage.setItem('billItems', JSON.stringify(bill));

    await handleDelete(item);
  };

  const renderSectionHeader = ({ section: { title, data } }: { section: { title: string; data: Item[] } }) => {
    const isOpen = openSection === title;

    return (
      <TouchableOpacity onPress={() => toggleSection(title)}>
        <View className='w-full flex flex-row justify-between items-center border-b-2 pb-2 mt-10'
          style={{
            borderBottomColor: dark ? Colors.light_background : Colors.dark_background,
          }}
        >
          <Text className="text-xl font-bold"
            style={{
              color: dark ? Colors.logo_light : Colors.logo_dark,
            }}
          >
            {title} ({data.length})
          </Text>
          {isOpen ? (
            <ChevronUp color={dark ? Colors.light_background : Colors.dark_background} size={28} />
          ) : (
            <ChevronDown color={dark ? Colors.light_background : Colors.dark_background} size={28} />
          )}
        </View>
      </TouchableOpacity>
    );
  };

  const renderItem = ({ item, section }: { item: Item; section: { title: string } }) => {
    if (openSection !== section.title) return null;
    const isOpen = openItems.has(item.createdAt);
    const itemErrors = errors.get(getItemKey(item)) || {};

    const qty = parseFloat(item.itemQuantity || '0') || 0;
    const rate = parseFloat(item.rate || '0') || 0;
    const totalPrice = (qty * rate).toFixed(2);

    return (
      <View className="w-full mt-4 px-3">
        {/* Header */}
        <TouchableOpacity onPress={() => toggleItem(item.createdAt)}>
          <View
            className="w-full flex-row justify-between items-center p-4 rounded-xl"
            style={{
              backgroundColor: dark ? Colors.dark_card : Colors.light_card,
            }}
          >
            <View className="flex flex-row justify-start items-center gap-10">
              <Text className="text-xl font-bold" style={{ color: dark ? 'white' : 'black' }}>
                {item.itemName}
              </Text>
              <Text className="text-xl " style={{ color: dark ? 'white' : 'black' }}>
                {item.itemQuantity || '0'} {item.metric}
              </Text>
              <Text className="text-md" style={{ color: dark ? 'white' : 'black' }}>
                Added: {new Date(item.createdAt).toLocaleDateString()}
              </Text>
            </View>
            {isOpen ? (
              <ChevronUp color={dark ? Colors.logo_light : Colors.logo_dark} size={28} />
            ) : (
              <ChevronDown color={dark ? Colors.logo_light : Colors.logo_dark} size={28} />
            )}
          </View>
        </TouchableOpacity>

        {/* Dropdown Content */}
        {isOpen && (
          <View className="w-full px-6 pt-4 pb-6" style={{ backgroundColor: dark ? '#222' : 'white' }}>
            {/* Item Name */}
            <View className="w-full relative mb-6 z-10 mt-2">
              <Text className="mb-2 text-lg absolute -top-3.5 left-3"
                style={{
                  backgroundColor: dark ? '#222' : 'white',
                  paddingHorizontal: 4,
                  color: dark ? Colors.logo_light : Colors.logo_dark,
                  zIndex: 20,
                }}>Item Name</Text>

              <TextInput
                value={item.itemName}
                onChangeText={(val) => updateField(item, 'itemName', val)}
                className="border rounded-lg px-4"
                style={{
                  height: 60,
                  backgroundColor: dark ? '#222' : 'white',
                  color: dark ? 'white' : 'black',
                  borderColor: itemErrors.itemName ? '#dc2626' : (dark ? Colors.light_background : Colors.dark_background),
                }}
              />
              {itemErrors.itemName && (
                <Text style={{ color: '#dc2626', marginTop: 6, marginLeft: 4 }}>
                  {itemErrors.itemName}
                </Text>
              )}
            </View>

            {/* Quantity + Unit Row */}
            <View className='w-full flex flex-row gap-3 justify-center items-center'>
              {/* Quantity */}
              <View className="flex-1 relative mb-6 z-10">
                <Text className="mb-2 text-lg absolute -top-3.5 left-3 z-20 "
                  style={{
                    backgroundColor: dark ? '#222' : 'white',
                    paddingHorizontal: 4,
                    color: dark ? Colors.logo_light : Colors.logo_dark
                  }}>Item Quantity</Text>
                <TextInput
                  value={item.itemQuantity ?? ''}
                  onChangeText={(val) => updateField(item, 'itemQuantity', val)}
                  placeholder="e.g. 1.5"
                  placeholderTextColor="#999"
                  keyboardType="decimal-pad"
                  className="border rounded-lg px-4"
                  style={{
                    height: 60,
                    backgroundColor: dark ? '#222' : 'white',
                    color: dark ? 'white' : 'black',
                    borderColor: itemErrors.itemQuantity ? '#dc2626' : (dark ? Colors.light_background : Colors.dark_background),
                  }}
                />
                {itemErrors.itemQuantity && (
                  <Text style={{ color: '#dc2626', marginTop: 6, marginLeft: 4 }}>
                    {itemErrors.itemQuantity}
                  </Text>
                )}
              </View>

              {/* Unit */}
              <View className="flex-1 relative mb-6 z-10">
                <Text className="absolute -top-3.5 left-3 z-20 text-lg"
                  style={{
                    backgroundColor: dark ? '#222' : 'white',
                    paddingHorizontal: 4,
                    color: dark ? Colors.logo_light : Colors.logo_dark,
                  }}
                >
                  Unit
                </Text>

                <View className="border rounded-lg"
                  style={{
                    backgroundColor: dark ? '#222' : 'white',
                    borderColor: itemErrors.metric ? '#dc2626' : (dark ? Colors.light_background : Colors.dark_background),
                    height: 60,
                  }}
                >
                  <Picker
                    selectedValue={item.metric}
                    onValueChange={(val) => updateField(item, 'metric', val)}
                    style={{ height: 60, color: dark ? 'white' : 'black' }}
                    dropdownIconColor={dark ? Colors.light_background : Colors.dark_background}
                    mode="dropdown"
                  >
                    <Picker.Item label="Select unit..." value="" />
                    {metric.map((unit, index) => (
                      <Picker.Item key={`metric-${index}`} label={unit} value={unit} />
                    ))}
                  </Picker>
                </View>
                {itemErrors.metric && (
                  <Text style={{ color: '#dc2626', marginTop: 6, marginLeft: 4 }}>
                    {itemErrors.metric}
                  </Text>
                )}
              </View>
            </View>

            {/* Rate */}
            <View className="w-full relative mb-6 z-10">
              <Text className="mb-2 text-lg absolute -top-3.5 left-3"
                style={{
                  backgroundColor: dark ? '#222' : 'white',
                  paddingHorizontal: 4,
                  color: dark ? Colors.logo_light : Colors.logo_dark,
                  zIndex: 20,
                }}>Rate (per unit)</Text>

              <TextInput
                value={item.rate ?? ''}
                onChangeText={(val) => updateField(item, 'rate', val)}
                placeholder="e.g. 50.00"
                placeholderTextColor="#999"
                keyboardType="decimal-pad"
                className="border rounded-lg px-4"
                style={{
                  height: 60,
                  backgroundColor: dark ? '#222' : 'white',
                  color: dark ? 'white' : 'black',
                  borderColor: itemErrors.rate ? '#dc2626' : (dark ? Colors.light_background : Colors.dark_background),
                }}
              />
              {itemErrors.rate && (
                <Text style={{ color: '#dc2626', marginTop: 6, marginLeft: 4 }}>
                  {itemErrors.rate}
                </Text>
              )}
            </View>

            {/* Total Price */}
            <Text className="text-2xl font-bold text-right mb-6"
              style={{
                color: dark ? '#16a34a' : '#379e5d',
              }}
            >
              Total Price: {totalPrice}
            </Text>

            {/* Buttons */}
            <View className="flex-row justify-center items-center gap-10 mt-4">
              <TouchableOpacity
                onPress={() => handleDelete(item)}
                className="p-4 rounded-xl border"
                style={{ backgroundColor: dark ? '#222' : 'white', borderColor: dark ? Colors.logo_light : Colors.logo_dark }}
              >
                <Trash2 color="#dc2626" size={28} />
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => handleAddToBill(item)}
                className="p-4 rounded-xl border"
                style={{ backgroundColor: dark ? '#222' : 'white', borderColor: dark ? Colors.logo_light : Colors.logo_dark }}
              >
                <ShoppingCart color="#16a34a" size={28} />
              </TouchableOpacity>
            </View>
          </View>
        )}
      </View>
    );
  };

  return (
    <View
      className="w-screen h-full relative top-[80px]"
      style={{
        backgroundColor: dark ? Colors.dark_background : Colors.light_background,
      }}
    >
      <SectionList
        sections={sections}
        keyExtractor={(item) => item.createdAt}
        renderSectionHeader={renderSectionHeader}
        renderItem={renderItem}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 100 }}
        ListEmptyComponent={
          <Text style={{ textAlign: "center", fontSize: 18, color: "#999", marginTop: 50 }}>
            No items added yet!
          </Text>
        }
      />
    </View>
  );
}