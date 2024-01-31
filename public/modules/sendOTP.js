const gmailPass = 'stqu ljoj aifa rezm';
//const otp=35435

const nodemailer = require('nodemailer');
const send_otp = (otp,mail_id)=>{

    // Replace these with your Gmail credentials
    const gmailUser = 'yesudasporathur@gmail.com';
    const gmailPass = 'stqu ljoj aifa rezm';
  
    // Create a nodemailer transporter
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: gmailUser,
        pass: gmailPass,
      },
    });
  
    
  
    // Email configuration
    const mailOptions = {
      from: `"Greenergy" <${gmailUser}>`,
      to: `<${mail_id}>`, // Replace with the recipient's email address
      subject: 'OTP Validation',
      text: `Your OTP code is: ${otp}`,
    };
  
    // Send the email
    transporter.sendMail(mailOptions, (error, info) => {
  
      setImmediate(() => {
        if (error) {
          console.error('Error sending email:', error);
        } else {
          console.log('Email sent:', info.response);
          console.log('OTP is',otp)
        }
      }, 500);
    });
  }
module.exports=send_otp