// couponActions.js
export const applyCoupon = (coupon) => ({
    type: 'APPLY_COUPON',
    payload: coupon,
  });
  
  export const removeCoupon = () => ({
    type: 'REMOVE_COUPON',
  });
  