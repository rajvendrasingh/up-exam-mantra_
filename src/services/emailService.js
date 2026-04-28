import emailjs from '@emailjs/browser';

// EmailJS Configuration
const EMAILJS_SERVICE_ID = import.meta.env.VITE_EMAILJS_SERVICE_ID;
const EMAILJS_TEMPLATE_ID = import.meta.env.VITE_EMAILJS_TEMPLATE_ID;
const EMAILJS_PUBLIC_KEY = import.meta.env.VITE_EMAILJS_PUBLIC_KEY;

// Initialize EmailJS
if (EMAILJS_PUBLIC_KEY && EMAILJS_PUBLIC_KEY !== 'your_emailjs_public_key_here') {
  emailjs.init(EMAILJS_PUBLIC_KEY);
}

/**
 * Send password reset email using EmailJS
 * @param {string} email - Recipient email address
 * @param {string} resetLink - Password reset link
 * @returns {Promise<boolean>} - Success status
 */
export const sendPasswordResetEmail = async (email, resetLink) => {
  try {
    // Check if EmailJS is configured
    if (!EMAILJS_SERVICE_ID || !EMAILJS_TEMPLATE_ID || !EMAILJS_PUBLIC_KEY) {
      console.log('⚠️ EmailJS not configured, using Firebase default');
      return false;
    }

    console.log('📧 Sending password reset email via EmailJS...');
    console.log('To:', email);

    const templateParams = {
      to_email: email,
      to_name: email.split('@')[0],
      reset_link: resetLink,
      app_name: 'UP Exam Mantra',
      support_email: 'support@upexammantra.com'
    };

    const response = await emailjs.send(
      EMAILJS_SERVICE_ID,
      EMAILJS_TEMPLATE_ID,
      templateParams
    );

    if (response.status === 200) {
      console.log('✅ Password reset email sent successfully via EmailJS');
      return true;
    } else {
      throw new Error('Email sending failed');
    }
    
  } catch (error) {
    console.error('❌ EmailJS error:', error);
    throw new Error('Failed to send email. Please try again or contact support.');
  }
};

/**
 * Send welcome email to new users
 * @param {string} email - User email
 * @param {string} name - User name
 */
export const sendWelcomeEmail = async (email, name) => {
  try {
    if (!EMAILJS_SERVICE_ID || !EMAILJS_PUBLIC_KEY) {
      console.log('⚠️ EmailJS not configured, skipping welcome email');
      return false;
    }

    const templateParams = {
      to_email: email,
      to_name: name,
      app_name: 'UP Exam Mantra'
    };

    await emailjs.send(
      EMAILJS_SERVICE_ID,
      'welcome_template', // You'll need to create this template
      templateParams
    );

    console.log('✅ Welcome email sent');
    return true;
    
  } catch (error) {
    console.error('❌ Welcome email error:', error);
    return false;
  }
};

export default {
  sendPasswordResetEmail,
  sendWelcomeEmail
};
