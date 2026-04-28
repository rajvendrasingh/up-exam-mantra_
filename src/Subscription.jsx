import { useState, useEffect } from "react";
import { auth } from "./firebase";
import { getUserSubscription, createPaymentOrder, verifyPayment, activateSubscription } from "./services/subscriptionService";

/**
 * SUBSCRIPTION PAGE
 * 
 * Yeh page users ko subscription plans dikhata hai
 * User apni choice ka plan select kar sakta hai
 * Payment successful hone ke baad user ko premium access milta hai
 */

export default function Subscription() {
  // User ki current subscription status
  const [userSubscription, setUserSubscription] = useState(null);
  const [loading, setLoading] = useState(true);

  // Subscription plans - Admin panel se bhi manage kar sakte ho future me
  const plans = [
    {
      id: "monthly",
      name: "Monthly Plan",
      price: 199,
      duration: "1 Month",
      features: [
        "✅ All Premium Test Series",
        "✅ Unlimited Mock Tests",
        "✅ Detailed Solutions",
        "✅ Performance Analytics",
        "✅ Priority Support"
      ]
    },
    {
      id: "yearly",
      name: "Yearly Plan",
      price: 1999,
      duration: "12 Months",
      discount: "Save ₹390",
      features: [
        "✅ All Monthly Features",
        "✅ 2 Months FREE",
        "✅ Exclusive Study Material",
        "✅ Live Doubt Sessions",
        "✅ Certificate on Completion"
      ],
      popular: true
    }
  ];

  // Page load hone par user ki subscription check karo
  useEffect(() => {
    checkUserSubscription();
  }, []);

  // User ki subscription status check karne ka function
  const checkUserSubscription = async () => {
    try {
      const user = auth.currentUser;
      if (user) {
        const subscription = await getUserSubscription(user.uid);
        setUserSubscription(subscription);
      }
    } catch (error) {
      console.error("Error checking subscription:", error);
    } finally {
      setLoading(false);
    }
  };

  // Payment process start karne ka function
  const handleSubscribe = async (plan) => {
    try {
      const user = auth.currentUser;
      
      // Agar user logged in nahi hai
      if (!user) {
        alert("Please login first to subscribe!");
        return;
      }

      // Payment order create karo
      const orderData = await createPaymentOrder({
        planId: plan.id,
        amount: plan.price,
        userId: user.uid,
        userEmail: user.email
      });

      // Razorpay payment window open karo
      openRazorpayCheckout(orderData, plan);

    } catch (error) {
      console.error("Payment error:", error);
      alert("Payment failed. Please try again!");
    }
  };

  // Razorpay checkout window open karne ka function
  const openRazorpayCheckout = (orderData, plan) => {
    // Razorpay Key ID - .env file se load hoti hai
    const razorpayKeyId = import.meta.env.VITE_RAZORPAY_KEY_ID;
    
    // Agar key nahi mili to error dikhao
    if (!razorpayKeyId || razorpayKeyId === 'rzp_test_YOUR_KEY_ID_HERE') {
      alert("⚠️ Razorpay configuration missing!\n\nAdmin: Please add VITE_RAZORPAY_KEY_ID in .env file");
      console.error("Razorpay Key ID not found in environment variables");
      return;
    }
    
    // Razorpay options
    const options = {
      key: razorpayKeyId, // .env file se Razorpay key
      amount: plan.price * 100, // Paise me convert karo (₹199 = 19900 paise)
      currency: "INR",
      name: "UP Exam Mantra",
      description: `${plan.name} Subscription`,
      order_id: orderData.orderId,
      
      // Payment successful hone par yeh function call hoga
      handler: async function (response) {
        console.log("✅ Payment successful:", response);
        
        try {
          // Payment verify karo
          const isVerified = await verifyPayment(response);
          
          if (isVerified) {
            // Subscription activate karo
            await activateSubscription({
              userId: auth.currentUser.uid,
              userName: auth.currentUser.displayName || auth.currentUser.email?.split('@')[0] || 'User',
              userEmail: auth.currentUser.email,
              planId: plan.id,
              planName: plan.name,
              amount: plan.price,
              paymentId: response.razorpay_payment_id,
              orderId: response.razorpay_order_id
            });
            
            alert("🎉 Payment Successful!\n\nYour subscription is now active. Enjoy premium access!");
            
            // Subscription status refresh karo
            checkUserSubscription();
          } else {
            alert("⚠️ Payment verification failed. Please contact support.");
          }
        } catch (error) {
          console.error("Error activating subscription:", error);
          alert("❌ Error activating subscription. Please contact support with your payment ID: " + response.razorpay_payment_id);
        }
      },
      
      // Payment cancel ya fail hone par
      modal: {
        ondismiss: function() {
          console.log("Payment cancelled by user");
        }
      },
      
      // User details pre-fill karo
      prefill: {
        name: auth.currentUser?.displayName || '',
        email: auth.currentUser?.email || '',
        contact: auth.currentUser?.phoneNumber || ''
      },
      
      // Theme color
      theme: {
        color: "#2563EB"
      },
      
      // Notes (optional - admin panel me dikhega)
      notes: {
        userId: auth.currentUser?.uid,
        planId: plan.id
      }
    };

    // Razorpay checkout open karo
    const razorpay = new window.Razorpay(options);
    
    // Payment fail hone par
    razorpay.on('payment.failed', function (response) {
      console.error("❌ Payment failed:", response.error);
      alert(`Payment Failed!\n\nReason: ${response.error.description}\n\nPlease try again.`);
    });
    
    razorpay.open();
  };

  if (loading) {
    return (
      <div style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center"
      }}>
        <div style={{ fontSize: "1.5rem", color: "#2563EB" }}>Loading...</div>
      </div>
    );
  }

  return (
    <div style={{
      minHeight: "100vh",
      background: "#FFFFFF",
      padding: "40px 20px"
    }}>
      <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
        
        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: "50px" }}>
          <h1 style={{ 
            fontSize: "2.5rem", 
            color: "#1e293b", 
            marginBottom: "15px" 
          }}>
            Choose Your Plan
          </h1>
          <p style={{ fontSize: "1.1rem", color: "#64748b" }}>
            Get unlimited access to all premium test series
          </p>
        </div>

        {/* Current Subscription Status */}
        {userSubscription && userSubscription.isActive && (
          <div style={{
            background: "linear-gradient(135deg, #10b981 0%, #059669 100%)",
            color: "#fff",
            padding: "20px",
            borderRadius: "12px",
            marginBottom: "40px",
            textAlign: "center"
          }}>
            <h3 style={{ margin: "0 0 10px 0" }}>✅ Active Subscription</h3>
            <p style={{ margin: 0 }}>
              Your {userSubscription.planName} is active until {new Date(userSubscription.expiryDate).toLocaleDateString()}
            </p>
          </div>
        )}

        {/* Subscription Plans */}
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
          gap: "30px",
          marginBottom: "50px"
        }}>
          {plans.map((plan) => (
            <div
              key={plan.id}
              style={{
                background: "#fff",
                border: plan.popular ? "3px solid #2563EB" : "2px solid #e2e8f0",
                borderRadius: "15px",
                padding: "30px",
                position: "relative",
                boxShadow: plan.popular ? "0 10px 40px rgba(37, 99, 235, 0.2)" : "0 4px 15px rgba(0,0,0,0.1)",
                transition: "transform 0.3s",
                cursor: "pointer"
              }}
              onMouseEnter={(e) => e.currentTarget.style.transform = "translateY(-5px)"}
              onMouseLeave={(e) => e.currentTarget.style.transform = "translateY(0)"}
            >
              {/* Popular Badge */}
              {plan.popular && (
                <div style={{
                  position: "absolute",
                  top: "-15px",
                  left: "50%",
                  transform: "translateX(-50%)",
                  background: "#2563EB",
                  color: "#fff",
                  padding: "5px 20px",
                  borderRadius: "20px",
                  fontSize: "0.85rem",
                  fontWeight: "700"
                }}>
                  🔥 Most Popular
                </div>
              )}

              {/* Plan Name */}
              <h3 style={{ 
                fontSize: "1.5rem", 
                color: "#1e293b", 
                marginBottom: "10px",
                marginTop: plan.popular ? "10px" : "0"
              }}>
                {plan.name}
              </h3>

              {/* Price */}
              <div style={{ marginBottom: "20px" }}>
                <span style={{ 
                  fontSize: "3rem", 
                  fontWeight: "700", 
                  color: "#2563EB" 
                }}>
                  ₹{plan.price}
                </span>
                <span style={{ 
                  fontSize: "1rem", 
                  color: "#64748b",
                  marginLeft: "5px"
                }}>
                  / {plan.duration}
                </span>
              </div>

              {/* Discount */}
              {plan.discount && (
                <div style={{
                  background: "#fef3c7",
                  color: "#92400e",
                  padding: "8px 15px",
                  borderRadius: "8px",
                  fontSize: "0.9rem",
                  fontWeight: "600",
                  marginBottom: "20px",
                  textAlign: "center"
                }}>
                  💰 {plan.discount}
                </div>
              )}

              {/* Features */}
              <ul style={{ 
                listStyle: "none", 
                padding: 0, 
                marginBottom: "30px" 
              }}>
                {plan.features.map((feature, idx) => (
                  <li key={idx} style={{
                    padding: "10px 0",
                    color: "#1e293b",
                    fontSize: "0.95rem",
                    borderBottom: idx < plan.features.length - 1 ? "1px solid #f1f5f9" : "none"
                  }}>
                    {feature}
                  </li>
                ))}
              </ul>

              {/* Subscribe Button */}
              <button
                onClick={() => handleSubscribe(plan)}
                disabled={userSubscription?.isActive}
                style={{
                  width: "100%",
                  padding: "15px",
                  background: userSubscription?.isActive 
                    ? "#94a3b8" 
                    : plan.popular 
                      ? "linear-gradient(135deg, #2563EB 0%, #3B82F6 100%)" 
                      : "#2563EB",
                  color: "#fff",
                  border: "none",
                  borderRadius: "10px",
                  fontSize: "1.1rem",
                  fontWeight: "700",
                  cursor: userSubscription?.isActive ? "not-allowed" : "pointer",
                  transition: "transform 0.2s"
                }}
                onMouseEnter={(e) => {
                  if (!userSubscription?.isActive) {
                    e.currentTarget.style.transform = "scale(1.05)";
                  }
                }}
                onMouseLeave={(e) => e.currentTarget.style.transform = "scale(1)"}
              >
                {userSubscription?.isActive ? "Already Subscribed" : "Subscribe Now"}
              </button>
            </div>
          ))}
        </div>

        {/* Benefits Section */}
        <div style={{
          background: "#f8fafc",
          padding: "40px",
          borderRadius: "15px",
          textAlign: "center"
        }}>
          <h3 style={{ 
            fontSize: "1.8rem", 
            color: "#1e293b", 
            marginBottom: "30px" 
          }}>
            Why Subscribe?
          </h3>
          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
            gap: "20px"
          }}>
            <div style={{ padding: "20px" }}>
              <div style={{ fontSize: "3rem", marginBottom: "10px" }}>🎯</div>
              <h4 style={{ color: "#1e293b", marginBottom: "10px" }}>Unlimited Access</h4>
              <p style={{ color: "#64748b", fontSize: "0.9rem" }}>
                Access all premium test series without any limits
              </p>
            </div>
            <div style={{ padding: "20px" }}>
              <div style={{ fontSize: "3rem", marginBottom: "10px" }}>📊</div>
              <h4 style={{ color: "#1e293b", marginBottom: "10px" }}>Detailed Analytics</h4>
              <p style={{ color: "#64748b", fontSize: "0.9rem" }}>
                Track your progress with advanced performance metrics
              </p>
            </div>
            <div style={{ padding: "20px" }}>
              <div style={{ fontSize: "3rem", marginBottom: "10px" }}>💪</div>
              <h4 style={{ color: "#1e293b", marginBottom: "10px" }}>Expert Support</h4>
              <p style={{ color: "#64748b", fontSize: "0.9rem" }}>
                Get priority support from our expert team
              </p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
