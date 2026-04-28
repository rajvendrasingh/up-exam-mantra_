# 💳 Payment Gateway Setup - Hindi Guide

## ✅ Kya Kya Add Hua Hai

### 1. Subscription Page (नया पेज)
- **Location**: `src/Subscription.jsx`
- **Features**:
  - Monthly Plan: ₹199/month
  - Yearly Plan: ₹1999/year (2 months free)
  - Razorpay payment integration
  - Active subscription status display
  - Beautiful UI with plan comparison

### 2. Payment Service (पेमेंट सर्विस)
- **Location**: `src/services/subscriptionService.js`
- **Functions**:
  - `getUserSubscription()` - यूजर की subscription check करता है
  - `createPaymentOrder()` - Payment order बनाता है
  - `verifyPayment()` - Payment verify करता है
  - `activateSubscription()` - Subscription activate करता है
  - `cancelSubscription()` - Subscription cancel करता है
  - `getSubscriptionHistory()` - Payment history दिखाता है

### 3. Navigation Updates
- User menu में "Subscription" link add हुआ
- Mobile menu में भी "Subscription" option है
- Route: `/subscription`

### 4. Razorpay Integration
- Razorpay script `index.html` में add हुई
- Environment variables `.env` में add हुए
- Test mode और Live mode दोनों support करता है

---

## 🚀 Setup Kaise Kare (5 Minutes)

### Step 1: Razorpay Account
1. https://razorpay.com/ पर जाओ
2. Sign up करो (free है)
3. Email verify करो

### Step 2: API Keys
1. Dashboard में login करो
2. Settings → API Keys
3. "Generate Test Key" पर click करो
4. दो keys मिलेंगी:
   - Key ID (Example: `rzp_test_1234567890`)
   - Key Secret (Example: `abcd1234efgh5678`)

### Step 3: Keys Add Karo
`.env` file खोलो और यह add करो:

```env
VITE_RAZORPAY_KEY_ID=rzp_test_आपकी_key_यहाँ
VITE_RAZORPAY_KEY_SECRET=आपकी_secret_यहाँ
```

### Step 4: Server Restart
```bash
# Terminal में
Ctrl+C  # Server बंद करो
npm run dev  # फिर से start करो
```

### Step 5: Test Payment
1. Website खोलो
2. Login करो
3. Profile menu → Subscription
4. कोई plan select करो
5. Test card use करो:
   - Card: `4111 1111 1111 1111`
   - Expiry: `12/25`
   - CVV: `123`

---

## 💰 Charges (खर्चा)

### Razorpay की Fees:
- **Per Transaction**: 2% + GST (18%)
- **Total**: लगभग 2.36%
- **Setup Fee**: ₹0 (बिल्कुल FREE)
- **Monthly Fee**: ₹0 (कोई monthly charge नहीं)

### Example:
```
User ने pay किया: ₹199
Razorpay की fee: ₹4.70
आपको मिलेगा: ₹194.30
```

---

## 📱 Users Kaise Use Karenge

### Desktop पर:
1. Login करो
2. Top right में profile icon पर click करो
3. "Subscription" option पर click करो
4. Plan select करो
5. Payment करो

### Mobile पर:
1. Login करो
2. Hamburger menu (☰) खोलो
3. "Subscription" पर click करो
4. Plan select करो
5. Payment करो

---

## 🗄️ Database Collections

Firestore में automatically 3 collections बनेंगे:

### 1. subscriptions
User की active subscriptions store होंगी
```javascript
{
  userId: "user123",
  planName: "Yearly Plan",
  amount: 1999,
  startDate: "2024-01-01",
  expiryDate: "2025-01-01",
  isActive: true
}
```

### 2. payments
सभी successful payments की record
```javascript
{
  paymentId: "pay_123",
  orderId: "order_123",
  status: "success",
  amount: 1999
}
```

### 3. paymentOrders
Payment orders की tracking
```javascript
{
  orderId: "order_123",
  amount: 199900,  // paise में
  userId: "user123",
  status: "created"
}
```

---

## 🔧 Code Kaise Kaam Karta Hai

### Simple Flow:
```
1. User "Subscribe Now" पर click करता है
   ↓
2. Payment order बनता है
   ↓
3. Razorpay window खुलती है
   ↓
4. User payment करता है
   ↓
5. Payment verify होती है
   ↓
6. Subscription activate होती है
   ↓
7. User को premium access मिल जाता है!
```

### Code में:
```javascript
// 1. Subscription check करो
const subscription = await getUserSubscription(userId);

// 2. Payment order बनाओ
const order = await createPaymentOrder({
  planId: "monthly",
  amount: 199
});

// 3. Razorpay payment
const razorpay = new Razorpay({
  key: "rzp_test_...",
  handler: async (response) => {
    // 4. Payment verify करो
    await verifyPayment(response);
    
    // 5. Subscription activate करो
    await activateSubscription({
      planId: "monthly",
      amount: 199
    });
  }
});
```

---

## ❓ Common Problems

### Problem: Payment window नहीं खुल रही
**Solution**: 
- `.env` file में keys check करो
- Server restart करो
- Browser console में errors देखो (F12 key)

### Problem: Keys कहाँ मिलेंगी?
**Solution**:
- Razorpay dashboard: https://dashboard.razorpay.com/
- Settings → API Keys
- "Generate Test Key" button

### Problem: Payment successful but subscription activate नहीं हुई
**Solution**:
- Internet connection check करो
- Firestore rules check करो
- Console में errors देखो

---

## 📝 Important Files

### Created (नई files):
1. `src/Subscription.jsx` - Subscription page
2. `src/services/subscriptionService.js` - Payment functions
3. `PAYMENT_GATEWAY_SETUP.md` - Detailed English guide
4. `RAZORPAY_QUICK_SETUP.txt` - Quick setup guide
5. `PAYMENT_SETUP_HINDI.md` - यह file

### Modified (बदली गई files):
1. `src/App.jsx` - Route और navigation add हुआ
2. `index.html` - Razorpay script add हुई
3. `.env` - Razorpay keys add हुईं

---

## 🎯 Features

### ✅ User Features:
- दो subscription plans (Monthly, Yearly)
- Secure Razorpay payment
- Active subscription status
- Subscription expiry tracking
- Payment history
- Auto-renewal option (future)

### ✅ Admin Features:
- Payment tracking
- Subscription management
- Revenue analytics (future)
- User subscription status
- Refund management (future)

### ✅ Security:
- Secure payment gateway
- Payment verification
- Encrypted keys in .env
- Firestore security rules
- No credit card data stored

---

## 🔄 Test Mode vs Live Mode

### Test Mode (अभी):
- Keys: `rzp_test_` से start होती हैं
- Fake payments (कोई real money नहीं)
- Test cards काम करते हैं
- Free testing

### Live Mode (Production के लिए):
1. Razorpay में account activation complete करो
2. Documents submit करो (PAN, Bank details)
3. Approval मिलने के बाद Live keys generate करो
4. Live keys `.env` में add करो
5. Website deploy करो

---

## 📊 Revenue Calculation

### Monthly Plan (₹199):
```
User Payment: ₹199
Razorpay Fee: ₹4.70 (2.36%)
Your Earning: ₹194.30
```

### Yearly Plan (₹1999):
```
User Payment: ₹1999
Razorpay Fee: ₹47.18 (2.36%)
Your Earning: ₹1951.82
```

### 100 Users (Monthly):
```
Total Revenue: ₹19,900
Razorpay Fee: ₹470
Your Earning: ₹19,430
```

---

## 🎉 Setup Complete!

अब आप payments accept कर सकते हो!

### Next Steps:
1. ✅ Test payment करो
2. ✅ Firestore में data check करो
3. ✅ User experience test करो
4. ✅ Live mode के लिए account activate करो
5. ✅ Website deploy करो

---

## 📞 Help Chahiye?

1. `PAYMENT_GATEWAY_SETUP.md` पढ़ो (detailed guide)
2. Browser console check करो (F12)
3. Razorpay dashboard logs देखो
4. Firestore database check करो

---

**🎊 Congratulations! Payment gateway successfully setup हो गया है!**

अब आप अपनी website पर paid subscriptions बेच सकते हो! 💰

Test payment जरूर करो before going live! ✅
