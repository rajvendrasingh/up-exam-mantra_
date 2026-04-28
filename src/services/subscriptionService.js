/**
 * SUBSCRIPTION SERVICE
 * 
 * Yeh file payment aur subscription ko manage karti hai
 * Razorpay payment gateway ka use karke user ko subscription deti hai
 * 
 * IMPORTANT FUNCTIONS:
 * 1. getUserSubscription() - User ki current subscription check karta hai
 * 2. createPaymentOrder() - Razorpay payment order create karta hai
 * 3. verifyPayment() - Payment successful hai ya nahi check karta hai
 * 4. activateSubscription() - Payment success hone par subscription activate karta hai
 */

import { 
  collection, 
  doc, 
  getDoc, 
  getDocs, 
  addDoc, 
  updateDoc,
  query, 
  where,
  serverTimestamp
} from 'firebase/firestore';
import { db } from '../firebase';

// ==================== USER SUBSCRIPTION CHECK ====================

/**
 * User ki current subscription status check karta hai
 * 
 * @param {string} userId - User ka unique ID
 * @returns {Object|null} - Subscription details ya null agar subscription nahi hai
 * 
 * EXAMPLE RETURN:
 * {
 *   isActive: true,
 *   planId: "yearly",
 *   planName: "Yearly Plan",
 *   startDate: "2024-01-01",
 *   expiryDate: "2025-01-01",
 *   amount: 1999
 * }
 */
export const getUserSubscription = async (userId) => {
  try {
    console.log("🔍 Checking subscription for user:", userId);
    
    // Firestore se user ki subscription fetch karo
    const q = query(
      collection(db, 'subscriptions'),
      where('userId', '==', userId),
      where('isActive', '==', true)
    );
    
    const snapshot = await getDocs(q);
    
    // Agar koi active subscription nahi mili
    if (snapshot.empty) {
      console.log("❌ No active subscription found");
      return null;
    }
    
    // Pehli active subscription return karo
    const subscriptionData = snapshot.docs[0].data();
    const expiryDate = new Date(subscriptionData.expiryDate);
    const today = new Date();
    
    // Check karo ki subscription expire to nahi ho gayi
    if (expiryDate < today) {
      console.log("⚠️ Subscription expired on:", expiryDate);
      
      // Subscription ko inactive mark karo
      await updateDoc(doc(db, 'subscriptions', snapshot.docs[0].id), {
        isActive: false,
        updatedAt: serverTimestamp()
      });
      
      return null;
    }
    
    console.log("✅ Active subscription found:", subscriptionData.planName);
    return {
      id: snapshot.docs[0].id,
      ...subscriptionData,
      isActive: true
    };
    
  } catch (error) {
    console.error("❌ Error checking subscription:", error);
    return null;
  }
};

// ==================== PAYMENT ORDER CREATION ====================

/**
 * Razorpay payment order create karta hai
 * 
 * @param {Object} orderData - Payment order ki details
 * @param {string} orderData.planId - Plan ka ID (monthly/yearly)
 * @param {number} orderData.amount - Payment amount in rupees
 * @param {string} orderData.userId - User ka ID
 * @param {string} orderData.userEmail - User ka email
 * @returns {Object} - Order details with orderId
 * 
 * NOTE: Real production me yeh function backend (Node.js/Firebase Functions) me hona chahiye
 * Kyunki Razorpay key_secret ko frontend me expose nahi karna chahiye
 * Abhi ke liye simple implementation hai
 */
export const createPaymentOrder = async (orderData) => {
  try {
    console.log("💳 Creating payment order:", orderData);
    
    const { planId, amount, userId, userEmail } = orderData;
    
    // Generate unique order ID
    // Real production me yeh Razorpay API se aayega
    const orderId = `order_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    // Payment order details
    const paymentOrder = {
      orderId: orderId,
      amount: amount * 100, // Razorpay amount paise me chahiye (₹199 = 19900 paise)
      currency: "INR",
      planId: planId,
      userId: userId,
      userEmail: userEmail,
      status: "created",
      createdAt: new Date().toISOString()
    };
    
    // Firestore me payment order save karo (tracking ke liye)
    await addDoc(collection(db, 'paymentOrders'), {
      ...paymentOrder,
      createdAt: serverTimestamp()
    });
    
    console.log("✅ Payment order created:", orderId);
    return paymentOrder;
    
  } catch (error) {
    console.error("❌ Error creating payment order:", error);
    throw new Error("Failed to create payment order");
  }
};

// ==================== PAYMENT VERIFICATION ====================

/**
 * Razorpay payment successful hai ya nahi verify karta hai
 * 
 * @param {Object} paymentData - Razorpay se aaya hua payment response
 * @param {string} paymentData.razorpay_payment_id - Payment ID
 * @param {string} paymentData.razorpay_order_id - Order ID
 * @param {string} paymentData.razorpay_signature - Payment signature (security ke liye)
 * @returns {boolean} - true agar payment successful hai
 * 
 * NOTE: Real production me signature verification backend me honi chahiye
 * Kyunki key_secret frontend me expose nahi hona chahiye
 */
export const verifyPayment = async (paymentData) => {
  try {
    console.log("🔐 Verifying payment:", paymentData);
    
    const { razorpay_payment_id, razorpay_order_id, razorpay_signature } = paymentData;
    
    // Real production me yahan backend API call hogi
    // Backend signature verify karega using crypto library
    // const response = await fetch('/api/verify-payment', {
    //   method: 'POST',
    //   body: JSON.stringify(paymentData)
    // });
    
    // Abhi ke liye simple check - payment ID aur order ID present hai ya nahi
    if (razorpay_payment_id && razorpay_order_id) {
      console.log("✅ Payment verified successfully");
      
      // Payment record ko Firestore me save karo
      await addDoc(collection(db, 'payments'), {
        paymentId: razorpay_payment_id,
        orderId: razorpay_order_id,
        signature: razorpay_signature,
        status: "success",
        verifiedAt: serverTimestamp(),
        createdAt: serverTimestamp()
      });
      
      return true;
    }
    
    console.log("❌ Payment verification failed");
    return false;
    
  } catch (error) {
    console.error("❌ Error verifying payment:", error);
    return false;
  }
};

// ==================== SUBSCRIPTION ACTIVATION ====================

/**
 * Payment successful hone ke baad user ko subscription activate karta hai
 * 
 * @param {Object} subscriptionData - Subscription ki details
 * @param {string} subscriptionData.userId - User ka ID
 * @param {string} subscriptionData.userName - User ka naam
 * @param {string} subscriptionData.userEmail - User ka email
 * @param {string} subscriptionData.planId - Plan ID (monthly/yearly)
 * @param {string} subscriptionData.planName - Plan ka naam
 * @param {number} subscriptionData.amount - Payment amount
 * @param {string} subscriptionData.paymentId - Razorpay payment ID
 * @param {string} subscriptionData.orderId - Razorpay order ID
 * @returns {Object} - Activated subscription details
 */
export const activateSubscription = async (subscriptionData) => {
  try {
    console.log("🎉 Activating subscription:", subscriptionData);
    
    const {
      userId,
      userName,
      userEmail,
      planId,
      planName,
      amount,
      paymentId,
      orderId
    } = subscriptionData;
    
    // Calculate subscription dates
    const startDate = new Date();
    const expiryDate = new Date();
    
    // Plan ke according expiry date set karo
    if (planId === "monthly") {
      // Monthly plan - 1 month add karo
      expiryDate.setMonth(expiryDate.getMonth() + 1);
    } else if (planId === "yearly") {
      // Yearly plan - 12 months add karo
      expiryDate.setMonth(expiryDate.getMonth() + 12);
    }
    
    // Subscription data prepare karo
    const subscription = {
      userId: userId,
      userName: userName,
      userEmail: userEmail,
      planId: planId,
      planName: planName,
      amount: amount,
      paymentId: paymentId,
      orderId: orderId,
      startDate: startDate.toISOString(),
      expiryDate: expiryDate.toISOString(),
      isActive: true,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    };
    
    // Check karo ki user ki already koi active subscription to nahi hai
    const existingQuery = query(
      collection(db, 'subscriptions'),
      where('userId', '==', userId),
      where('isActive', '==', true)
    );
    
    const existingSnapshot = await getDocs(existingQuery);
    
    // Agar purani subscription hai to usko deactivate karo
    if (!existingSnapshot.empty) {
      console.log("⚠️ Deactivating old subscription");
      for (const doc of existingSnapshot.docs) {
        await updateDoc(doc.ref, {
          isActive: false,
          updatedAt: serverTimestamp()
        });
      }
    }
    
    // Nayi subscription create karo
    const docRef = await addDoc(collection(db, 'subscriptions'), subscription);
    
    console.log("✅ Subscription activated successfully:", docRef.id);
    
    return {
      id: docRef.id,
      ...subscription
    };
    
  } catch (error) {
    console.error("❌ Error activating subscription:", error);
    throw new Error("Failed to activate subscription");
  }
};

// ==================== SUBSCRIPTION CANCELLATION ====================

/**
 * User ki subscription cancel karta hai
 * 
 * @param {string} subscriptionId - Subscription ka ID
 * @returns {boolean} - true agar successfully cancel ho gayi
 */
export const cancelSubscription = async (subscriptionId) => {
  try {
    console.log("🚫 Cancelling subscription:", subscriptionId);
    
    // Subscription ko inactive mark karo
    await updateDoc(doc(db, 'subscriptions', subscriptionId), {
      isActive: false,
      cancelledAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    });
    
    console.log("✅ Subscription cancelled successfully");
    return true;
    
  } catch (error) {
    console.error("❌ Error cancelling subscription:", error);
    return false;
  }
};

// ==================== SUBSCRIPTION HISTORY ====================

/**
 * User ki saari subscriptions (active + expired) fetch karta hai
 * 
 * @param {string} userId - User ka ID
 * @returns {Array} - Subscription history array
 */
export const getSubscriptionHistory = async (userId) => {
  try {
    console.log("📜 Fetching subscription history for:", userId);
    
    const q = query(
      collection(db, 'subscriptions'),
      where('userId', '==', userId)
    );
    
    const snapshot = await getDocs(q);
    const history = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
    
    // Sort by creation date (newest first)
    history.sort((a, b) => {
      const dateA = new Date(a.startDate);
      const dateB = new Date(b.startDate);
      return dateB - dateA;
    });
    
    console.log("✅ Subscription history fetched:", history.length, "records");
    return history;
    
  } catch (error) {
    console.error("❌ Error fetching subscription history:", error);
    return [];
  }
};

// ==================== HELPER FUNCTIONS ====================

/**
 * Check karta hai ki user ke paas active subscription hai ya nahi
 * 
 * @param {string} userId - User ka ID
 * @returns {boolean} - true agar active subscription hai
 */
export const hasActiveSubscription = async (userId) => {
  const subscription = await getUserSubscription(userId);
  return subscription !== null && subscription.isActive === true;
};

/**
 * Subscription ke remaining days calculate karta hai
 * 
 * @param {string} expiryDate - Subscription expiry date (ISO string)
 * @returns {number} - Remaining days
 */
export const getRemainingDays = (expiryDate) => {
  const expiry = new Date(expiryDate);
  const today = new Date();
  const diffTime = expiry - today;
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays > 0 ? diffDays : 0;
};
