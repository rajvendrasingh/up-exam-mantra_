// Simple SMS Server for Fast2SMS
// Run this with: node sms-server.js

import express from 'express';
import cors from 'cors';
import fetch from 'node-fetch';

const app = express();
app.use(cors());
app.use(express.json());

const FAST2SMS_API_KEY = "VUsNfLzanQAO9WxSDoF43E6KeCgIH8jyprGk7YJm01RMqcdTwikibKpqPVAum0wGWSLo2agJRO1fYclx";

app.post('/send-otp', async (req, res) => {
  try {
    const { phone, otp } = req.body;
    
    console.log('Sending OTP:', otp, 'to phone:', phone);
    
    const response = await fetch('https://www.fast2sms.com/dev/bulkV2', {
      method: 'POST',
      headers: {
        'authorization': FAST2SMS_API_KEY,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        route: 'q',
        message: `Your UP Exam Mantra OTP is ${otp}. Valid for 5 minutes.`,
        language: 'english',
        flash: 0,
        numbers: phone
      })
    });

    const result = await response.json();
    console.log('Fast2SMS Response:', result);
    
    if (result.return === true) {
      res.json({ success: true, message: 'OTP sent successfully' });
    } else {
      res.json({ success: false, error: result.message || 'Failed to send SMS' });
    }
  } catch (error) {
    console.error('Error:', error);
    res.json({ success: false, error: error.message });
  }
});

const PORT = 3001;
app.listen(PORT, () => {
  console.log(`SMS Server running on http://localhost:${PORT}`);
  console.log('Ready to send OTP messages!');
});
