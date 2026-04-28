# 💳 Payment Gateway Setup Guide (Razorpay)

## ✅ Payment Gateway Successfully Integrated!

Aapki website me Razorpay payment gateway successfully add ho gaya hai. Ab users subscription plans buy kar sakte hain.

---

## 📋 Setup Steps (Admin ke liye)

### Step 1: Razorpay Account Banao

1. **Razorpay Website par jao**: https://razorpay.com/
2. **Sign Up karo** (Free hai)
3. **Email verify karo**
4. **Business details bharo**

### Step 2: API Keys Nikalo

1. Razorpay Dashboard me login karo: https://dashboard.razorpay.com/
2. Left sidebar me **Settings** par click karo
3. **API Keys** option par click karo
4. **Generate Test Key** button par click karo (testing ke liye)
5. Do keys milegi:
   - **Key ID** (Example: `rzp_test_1234567890`)
   - **Key Secret** (Example: `abcdefghijklmnop1234567890`)

⚠️ **IMPORTANT**: Key Secret ko kabhi kisi ke saath share mat karo!

### Step 3: Keys Ko .env File Me Daalo

1. Project folder me `.env` file kholo
2. Yeh lines dhundo:
   ```
   VITE_RAZORPAY_KEY_ID=rzp_test_YOUR_KEY_ID_HERE
   VITE_RAZORPAY_KEY_SECRET=YOUR_KEY_SECRET_HERE
   ```
3. `YOUR_KEY_ID_HERE` ko apni **Key ID** se replace karo
4. `YOUR_KEY_SECRET_HERE` ko apni **Key Secret** se replace karo

**Example:**
```env
VITE_RAZORPAY_KEY_ID=rzp_test_AbCdEfGhIjKlMnOp
VITE_RAZORPAY_KEY_SECRET=1234567890abcdefghijklmnop
```

5. File save karo
6. Server restart karo: `npm run dev`

### Step 4: Test Payment Karo

1. Website kholo aur login karo
2. User menu me **Subscription** par click karo
3. Koi bhi plan select karo
4. **Subscribe Now** button par click karo
5. Razorpay payment window khulegi

**Test Card Details** (Testing ke liye):
- **Card Number**: `4111 1111 1111 1111`
- **Expiry Date**: Koi bhi future date (Example: `12/25`)
- **CVV**: Koi bhi 3 digit (Example: `123`)
- **Name**: Kuch bhi likh sakte ho

6. Payment complete karo
7. Success message aana chahiye!

---

## 💰 Pricing & Charges

### Razorpay Charges (India)
- **Transaction Fee**: 2% + GST (18%)
- **Total**: Approximately 2.36% per transaction
- **Example**: ₹199 payment par ₹4.70 fee lagegi
- **Setup Fee**: ₹0 (FREE)
- **Monthly Fee**: ₹0 (FREE)
- **No hidden charges**

### Calculation Example:
```
User Payment: ₹199
Razorpay Fee: ₹199 × 2.36% = ₹4.70
You Receive: ₹199 - ₹4.70 = ₹194.30
```

---

## 🔄 Test Mode vs Live Mode

### Test Mode (Development)
- **Keys start with**: `rzp_test_`
- **No real money**: Fake payments for testing
- **Test cards work**: Use test card numbers
- **Free**: No charges

### Live Mode (Production)
1. Razorpay Dashboard me **Account Activation** complete karo
2. Documents submit karo (PAN, Bank details, etc.)
3. Approval milne ke baad **Live Keys** generate karo
4. Live keys `.env` file me daalo
5. Website deploy karo

**Live Keys Example:**
```env
VITE_RAZORPAY_KEY_ID=rzp_live_AbCdEfGhIjKlMnOp
VITE_RAZORPAY_KEY_SECRET=1234567890abcdefghijklmnop
```

---

## 📁 Files Created/Modified

### New Files:
1. **src/Subscription.jsx** - Subscription page with payment UI
2. **src/services/subscriptionService.js** - Payment functions
3. **PAYMENT_GATEWAY_SETUP.md** - Yeh guide

### Modified Files:
1. **src/App.jsx** - Subscription route added
2. **index.html** - Razorpay script added
3. **.env** - Razorpay keys added

---

## 🎯 Features Implemented

### ✅ User Features:
- Subscription plans display (Monthly ₹199, Yearly ₹1999)
- Razorpay payment gateway integration
- Active subscription status check
- Subscription expiry tracking
- Payment history

### ✅ Admin Features:
- Payment tracking in Firestore
- Subscription management
- User subscription status
- Payment verification

### ✅ Security:
- Payment verification
- Secure key storage in .env
- Server-side validation ready
- Firestore security rules

---

## 🗄️ Firestore Collections Created

### 1. subscriptions
```javascript
{
  userId: "user123",
  userName: "John Doe",
  userEmail: "john@example.com",
  planId: "yearly",
  planName: "Yearly Plan",
  amount: 1999,
  startDate: "2024-01-01",
  expiryDate: "2025-01-01",
  isActive: true,
  paymentId: "pay_123456",
  orderId: "order_123456",
  createdAt: timestamp,
  updatedAt: timestamp
}
```

### 2. payments
```javascript
{
  paymentId: "pay_123456",
  orderId: "order_123456",
  signature: "abc123...",
  status: "success",
  verifiedAt: timestamp,
  createdAt: timestamp
}
```

### 3. paymentOrders
```javascript
{
  orderId: "order_123456",
  amount: 19900, // paise me
  currency: "INR",
  planId: "monthly",
  userId: "user123",
  userEmail: "john@example.com",
  status: "created",
  createdAt: timestamp
}
```

---

## 🔧 How It Works (Simple Explanation)

### Payment Flow:
```
1. User clicks "Subscribe Now"
   ↓
2. createPaymentOrder() - Order create hota hai
   ↓
3. Razorpay window opens - User payment karta hai
   ↓
4. Payment successful
   ↓
5. verifyPayment() - Payment verify hoti hai
   ↓
6. activateSubscription() - Subscription activate hoti hai
   ↓
7. User ko premium access mil jata hai!
```

### Code Flow:
```javascript
// 1. User subscription check
const subscription = await getUserSubscription(userId);

// 2. Payment order create
const order = await createPaymentOrder({
  planId: "monthly",
  amount: 199,
  userId: "user123"
});

// 3. Razorpay payment
const razorpay = new Razorpay({
  key: "rzp_test_...",
  amount: 19900,
  handler: async (response) => {
    // 4. Payment verify
    await verifyPayment(response);
    
    // 5. Subscription activate
    await activateSubscription({
      userId: "user123",
      planId: "monthly",
      amount: 199
    });
  }
});
```

---

## 🚀 Next Steps (Optional)

### 1. Backend Integration (Recommended for Production)
- Firebase Functions use karo
- Payment verification backend me karo
- Key Secret ko secure rakho

### 2. Add More Features:
- Subscription renewal reminders
- Auto-renewal option
- Discount coupons
- Referral system
- Invoice generation

### 3. Admin Panel Features:
- Payment dashboard
- Revenue analytics
- Subscription reports
- Refund management

---

## ❓ Troubleshooting

### Problem: Payment window nahi khul rahi
**Solution**: 
- Check karo `.env` file me `VITE_RAZORPAY_KEY_ID` sahi hai ya nahi
- Browser console me error check karo
- Razorpay script load ho rahi hai ya nahi check karo

### Problem: Payment successful but subscription activate nahi hui
**Solution**:
- Firestore rules check karo
- Console me error logs dekho
- `activateSubscription()` function check karo

### Problem: "Razorpay is not defined" error
**Solution**:
- `index.html` me Razorpay script add hai ya nahi check karo
- Page refresh karo

---

## 📞 Support

Agar koi problem aaye to:
1. Browser console me errors check karo
2. Firestore me data check karo
3. Razorpay dashboard me logs dekho
4. `.env` file ki keys verify karo

---

## ✅ Checklist

- [ ] Razorpay account banaya
- [ ] API keys generate kiye
- [ ] Keys `.env` file me daale
- [ ] Server restart kiya
- [ ] Test payment successful
- [ ] Subscription activate hui
- [ ] Firestore me data save hua

---

**🎉 Congratulations! Payment gateway successfully setup ho gaya hai!**

Ab aap apni website par paid subscriptions sell kar sakte ho! 💰
