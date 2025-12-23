// schemas/rateSchema.ts

import * as yup from 'yup';

export const categories = [
    'Grocery',
    'Vegetables',
    'Fruits',
    'Meat',
    'Dairy',
] as const;

export const metric = [
    'kg',
    'oz',
    'dozen',
    'litre',
    'packet',
    'pieces',
] as const

export type Category = typeof categories[number];
export type Metric = typeof metric[number];

// Helper to convert string to Title Case
const toTitleCase = (str: string): string => {
    return str
        .toLowerCase()
        .trim()
        .split(' ')
        .filter(word => word.length > 0)
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');
};

export const buySchema = yup.object({
    category: yup
        .mixed<Category>()
        .oneOf(categories, 'Please select a valid category')
        .required('Category is required'),

    metric: yup
        .mixed<Metric>()
        .oneOf(metric, 'Please select a valid category')
        .required('Metric is Required'),

    rate: yup
        .string()
        .required('Rate is required')
        .trim()
        .matches(/^\d+(\.\d{1,2})?$/, 'Rate must be a number with up to 2 decimal places')
        .test('is-non-negative', 'Rate cannot be negative', (value) => {
            if (!value) return false;
            const num = parseFloat(value);
            return num >= 0;
        })
        .test('max-rate', 'Rate cannot exceed ₹99,999.99', (value) => {
            if (!value) return true;
            const num = parseFloat(value);
            return num <= 99999.99;
        }),

    itemName: yup
        .string()
        .required('Item name is required')
        .matches(/^[a-zA-Z\s]+$/, 'Item name must contain only letters and spaces')
        .min(2, 'Item name must be at least 2 characters')
        .max(30, 'Item name cannot exceed 30 characters')
        .transform((value) => (value ? toTitleCase(value) : value)),

    itemQuantity: yup
        .string()
        .required('Quantity is required')  // ← Now required
        .trim()
        .matches(/^\d+(\.\d{1,2})?$/, 'Quantity must be a positive number with up to 2 decimal places')
        .test('is-positive', 'Quantity must be greater than 0', (value) => {
            if (!value) return false; // Already caught by required, but safe
            const num = parseFloat(value);
            return num > 0;
        })
        .test('max-quantity', 'Quantity cannot exceed 999.99', (value) => {
            if (!value) return true;
            const num = parseFloat(value);
            return num <= 999.99;
        }),
})