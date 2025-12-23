// schemas/rateSchema.ts

import * as yup from 'yup';

export const rateSchema = yup.object({
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
});