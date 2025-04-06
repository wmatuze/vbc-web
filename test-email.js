// Test script to send an email directly
require('dotenv').config();
const nodemailer = require('nodemailer');

async function testEmail() {
  console.log('Testing email functionality...');
  
  // Create a transporter using Gmail
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER || 'watu.matuze@gmail.com',
      pass: process.env.EMAIL_PASSWORD || 'chxp rnip ozqo daxa',
    },
  });
  
  // Email options
  const mailOptions = {
    from: process.env.EMAIL_FROM || 'Victory Bible Church <watu.matuze@gmail.com>',
    to: 'watu.matuze@hotmail.com', // Test recipient
    subject: 'Test Email from Church CMS',
    text: 'This is a test email from the Church CMS system.',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background-color: #4f46e5; color: white; padding: 20px; text-align: center;">
          <h1>Test Email</h1>
        </div>
        <div style="padding: 20px; border: 1px solid #e5e7eb; border-top: none;">
          <p>Dear User,</p>
          
          <p>This is a test email from the Church CMS system.</p>
          
          <p>If you received this email, it means the email functionality is working correctly.</p>
          
          <p>Blessings,<br>Victory Bible Church Team</p>
        </div>
        <div style="background-color: #f3f4f6; padding: 10px; text-align: center; font-size: 12px; color: #6b7280;">
          &copy; ${new Date().getFullYear()} Victory Bible Church. All rights reserved.
        </div>
      </div>
    `
  };
  
  try {
    // Send the email
    const info = await transporter.sendMail(mailOptions);
    console.log('Email sent successfully:', info.messageId);
    console.log('Preview URL:', nodemailer.getTestMessageUrl(info));
  } catch (error) {
    console.error('Error sending email:', error);
  }
}

// Run the test
testEmail();
