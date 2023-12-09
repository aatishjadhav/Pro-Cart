// couponReducer.js
const initialState = {
  coupons: [], // Array to store coupons
  appliedCoupon: null,
};

const couponReducer = (state = initialState, action) => {
  switch (action.type) {
    case 'SET_COUPONS':
      return { ...state, coupons: action.payload };
    case 'APPLY_COUPON':
      return { ...state, appliedCoupon: action.payload };
    case 'REMOVE_COUPON':
      return { ...state, appliedCoupon: null };
    default:
      return state;
  }
};

export default couponReducer;
