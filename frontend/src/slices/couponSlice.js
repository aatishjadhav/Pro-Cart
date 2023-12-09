// couponSlice.js
import { createSlice } from '@reduxjs/toolkit';

const couponSlice = createSlice({
  name: 'coupon',
  initialState: {
    coupons: [], // Array to store coupons
    appliedCoupon: null,
  },
  reducers: {
    setCoupons: (state, action) => {
      state.coupons = action.payload;
    },
    applyCoupon: (state, action) => {
      state.appliedCoupon = action.payload;
    },
    removeCoupon: (state) => {
      state.appliedCoupon = null;
    },
  },
});

export const { setCoupons, applyCoupon, removeCoupon } = couponSlice.actions;
export default couponSlice.reducer;
