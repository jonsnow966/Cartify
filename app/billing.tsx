// app/Billing.tsx

import AsyncStorage from "@react-native-async-storage/async-storage";
import { ShoppingCart, Trash2 } from "lucide-react-native";
import * as React from "react";
import { useEffect, useState } from "react";
import { ScrollView, Text, ToastAndroid, TouchableOpacity, View } from "react-native";
import useTheme from "../hooks/useTheme/useTheme";
import Colors from "../utilities/Color";

import { printToFileAsync } from 'expo-print';
import * as Sharing from 'expo-sharing';

type BillItem = {
  itemName: string;
  itemQuantity: string | null;
  metric: string;
  rate: string;
  totalPrice: string;
};

export default function Billing() {
  const { dark } = useTheme();
  const [billItems, setBillItems] = useState<BillItem[]>([]);
  const [loading, setLoading] = useState(true);

  const loadBill = async () => {
    try {
      const json = await AsyncStorage.getItem('billItems');
      if (json) {
        const parsed = JSON.parse(json);
        setBillItems(parsed);
      }
    } catch (error) {
      console.error('Failed to load bill:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadBill();
  }, []);

  const grandTotal = billItems.reduce((sum, item) => {
    return sum + parseFloat(item.totalPrice || '0');
  }, 0).toFixed(2);

  const deleteItem = async (index: number) => {
    const updated = billItems.filter((_, i) => i !== index);
    setBillItems(updated);
    await AsyncStorage.setItem('billItems', JSON.stringify(updated));
  };

  const clearBill = async () => {
    setBillItems([]);
    await AsyncStorage.removeItem('billItems');
  };

  const generatePDF = async () => {
    if (billItems.length === 0) {
      ToastAndroid.show('Bill is empty!', ToastAndroid.SHORT);
      return;
    }

    const itemsRows = billItems.map(item => `
      <tr>
        <td style="padding: 12px 8px; text-align: left; border-bottom: 1px solid #ddd;">${item.itemName}</td>
        <td style="padding: 12px 8px; text-align: center; border-bottom: 1px solid #ddd;">${item.itemQuantity || ''} ${item.metric}</td>
        <td style="padding: 12px 8px; text-align: center; border-bottom: 1px solid #ddd;">${item.rate}</td>
        <td style="padding: 12px 8px; text-align: right; border-bottom: 1px solid #ddd; font-weight: bold;">${item.totalPrice}</td>
      </tr>
    `).join('');

    const htmlContent = `
      <html>
        <head>
          <meta charset="utf-8">
          <title>Bill</title>
          <style>
            body { font-family: 'Helvetica', sans-serif; margin: 0; padding: 30px; background: #f9f9f9; }
            .invoice { max-width: 800px; margin: auto; padding: 30px; background: white; border-radius: 10px; box-shadow: 0 0 15px rgba(0,0,0,0.1); }
            .header { text-align: center; margin-bottom: 40px }
            h1 { color: #333; margin: 0; font-size: 32px; }
            .date { color: #666; font-size: 16px; margin: 8px 0; }
            table { width: 100%; border-collapse: collapse; margin: 30px 0; }
            th { background: #0a0008; color: white; padding: 15px; text-align: center; font-size: 16px; }
            td { padding: 12px 8px; }
            .total-row { background: #f0ebef; font-size: 20px; }
            .total-row td { padding: 20px; font-weight: bold; }
            .footer { text-align: center; margin-top: 60px; color: #888; font-size: 14px; }
          </style>
        </head>
        <body>
          <div class="invoice">
            <div class="header">
              <h1>Bill</h1>
              <div class="date">
                Date: ${new Date().toLocaleDateString('en-IN')}<br>
                Time: ${new Date().toLocaleTimeString('en-IN')}
              </div>
            </div>

            <table>
              <thead>
                <tr>
                  <th style="width: 40%; text-align: left;">Item Name</th>
                  <th style="width: 20%;">Quantity</th>
                  <th style="width: 20%;">Rate</th>
                  <th style="width: 20%; text-align: right;">Total Price</th>
                </tr>
              </thead>
              <tbody>
                ${itemsRows}
                <tr class="total-row">
                  <td colspan="3" style="text-align: right; font-size: 22px;">Grand Total</td>
                  <td style="text-align: right; font-size: 26px; color: #16a34a;">${grandTotal}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </body>
      </html>
    `;

    try {
      const { uri } = await printToFileAsync({ html: htmlContent });
      ToastAndroid.show('PDF Generated!', ToastAndroid.SHORT);
      if (await Sharing.isAvailableAsync()) {
        await Sharing.shareAsync(uri, {
          mimeType: 'application/pdf',
          dialogTitle: 'Share Bill PDF',
        });
      }
    } catch (error) {
      console.error('PDF Error:', error);
      ToastAndroid.show('Failed to generate PDF', ToastAndroid.SHORT);
    }
  };

  if (loading) {
    return (
      <View className="flex-1 justify-center items-center" style={{ backgroundColor: dark ? Colors.dark_background : Colors.light_background }}>
        <Text className="text-xl" style={{ color: dark ? '#fff' : '#000' }}>Loading bill...</Text>
      </View>
    );
  }

  if (billItems.length === 0) {
    return (
      <View className="flex-1 justify-center items-center px-10" style={{ backgroundColor: dark ? Colors.dark_background : Colors.light_background }}>
        <ShoppingCart color={dark ? '#aaa' : '#666'} size={120} />
        <Text className="text-3xl font-bold mt-12 text-center" style={{ color: dark ? Colors.logo_light : Colors.logo_dark }}>
          Your Bill is Empty
        </Text>
        <Text className="text-lg text-center mt-6" style={{ color: dark ? '#ccc' : '#666' }}>
          Add items from the Item List to generate your bill
        </Text>
      </View>
    );
  }

  return (
    <View className="flex-1" style={{ backgroundColor: dark ? Colors.dark_background : Colors.light_background }}>
      {/* Scrollable Items List */}
      <ScrollView
        contentContainerStyle={{ paddingHorizontal: 20, paddingTop: 90, paddingBottom: 160 }}
        showsVerticalScrollIndicator={false}
      >
        <View
          className="w-full p-3 mb-6 flex-row justify-between items-center"
          style={{
            backgroundColor: dark ? '#222' : 'white',
          }}
        >
          <View className="flex-1 flex-row justify-start items-center gap-2 pl-2 pr-4">
            <Text className="w-1/5 text-lg font-bold text-center " style={{ color: dark ? 'white' : 'black' }}>
              Item Name
            </Text>
            <Text className="w-1/5 text-lg font-bold text-center" style={{ color: dark ? Colors.logo_light : Colors.dark_text }}>
              Quantity
            </Text>
            <Text className="w-1/5 text-lg font-bold text-center " style={{ color: dark ? 'white' : 'black' }}>
              Rate
            </Text>
            <Text className="w-1/5 text-lg font-bold text-center" style={{ color: dark ? Colors.logo_light : Colors.dark_text }}>
              Total Price
            </Text>
            <Text className="w-1/5 text-lg font-bold text-center" style={{ color: dark ? 'white' : 'black' }}>
              Action
            </Text>
          </View>

        </View>
        {billItems.map((item, index) => (
          <View
            key={index}
            className="w-full px-3 mb-6 rounded-2xl flex-row justify-between items-center"
            style={{
              backgroundColor: dark ? '#222' : 'white',
            }}
          >
            <View className="flex-1 flex-row justify-start items-center gap-2 px-2">
              <Text className="w-1/5 text-lg font-bold text-center " style={{ color: dark ? 'white' : 'black' }}>
                {item.itemName}
              </Text>
              <Text className="w-1/5 text-lg font-bold text-center" style={{ color: dark ? Colors.logo_light : Colors.dark_text }}>
                {item.itemQuantity} {item.metric}
              </Text>
              <Text className="w-1/5 text-lg font-bold text-center " style={{ color: dark ? 'white' : 'black' }}>
                {item.rate}
              </Text>
              <Text className="w-1/5 text-lg font-bold text-center" style={{ color: dark ? Colors.logo_light : Colors.dark_text }}>
                {item.totalPrice}
              </Text>
              <Text className="w-1/5 text-lg font-bold text-center" style={{ color: dark ? 'white' : 'black' }}>
                <TouchableOpacity
                  onPress={() => deleteItem(index)}
                  className="p-4 rounded-xl flex justify-center items-center"
                  style={{ backgroundColor: dark ? '#222' : 'white' }}
                >
                  <Trash2 color="#dc2626" size={20} />
                </TouchableOpacity>
              </Text>
            </View>
          </View>
        ))}
      </ScrollView>

      {/* Fixed Bottom Bar */}
      <View
        className="absolute bottom-0 left-0 right-0 px-6 pb-8 pt-4"
        style={{
          backgroundColor: dark ? 'black' : 'white',
          borderTopWidth: 1,
          borderTopColor: dark ? '#333' : '#eee',
        }}
      >
        <View className="w-full mb-4">
          <Text className="text-4xl font-bold text-center" style={{ color: dark ? Colors.light_background : Colors.dark_background }}>
            Grand Total: {grandTotal}
          </Text>
        </View>

        <View className="flex-row justify-between gap-4">
          <TouchableOpacity
            onPress={clearBill}
            className="flex-1 justify-center items-center py-4 rounded-xl"
            style={{ backgroundColor: dark ? '#e37f7f' : '#b81c1c' }}
          >
            <Text className="text-2xl font-bold text-white">
              Clear All
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={generatePDF}
            className="flex-1 justify-center items-center py-4 rounded-xl"
            style={{ backgroundColor: dark ? Colors.light_background : Colors.dark_background }}
          >
            <Text className="text-2xl font-bold text-white" style={{ color: dark ? Colors.dark_background : Colors.light_background }}>
              Generate PDF
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}