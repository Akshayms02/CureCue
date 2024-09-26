import nodemailer from "nodemailer";

const sendEmailOtp = async (email: string, otp: number | string) => {
  try {
    console.log(`Your otp is : ${otp}`);
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_ID,
        pass: process.env.EMAIL_PASSWORD,
      },
    });

    const mailOptions = {
      from: process.env.EMAIL_ID,
      to: email,
      subject: "Your Registration OTP",
      html: `<!DOCTYPE html>
    <html>
    <head>
      <style>
        body {
          font-family: Arial, sans-serif;
          background-color: #f4f4f4;
          margin: 0;
          padding: 0;
        }
        .container {
          max-width: 600px;
          margin: 0 auto;
          background-color: #ffffff;
          padding: 20px;
          border-radius: 8px;
          box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
        }
        .header {
          background-color: #1DB954;
          color: #ffffff;
          padding: 10px 0;
          text-align: center;
          border-radius: 8px 8px 0 0;
        }
        .content {
          margin: 20px 0;
          text-align: center;
        }
        .otp {
          font-size: 24px;
          font-weight: bold;
          margin: 20px 0;
        }
        .footer {
          margin: 20px 0;
          text-align: center;
          color: #777;
          font-size: 14px;
        }
        .footer a {
          color: #1DB954;
          text-decoration: none;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>Welcome to Our Service</h1>
        </div>
        <div class="content">
          <p>Thank you for registering with CureCue! Use the OTP below to complete your registration:</p>
          <div class="otp">${otp}</div>
          <p>This OTP is valid for 1 minute</p>
        </div>
        <div class="footer">
          <p>If you did not request this email, please ignore it.</p>
          <p>© 2024 CureCue. All rights reserved.</p>
          <p><a href="#">Unsubscribe</a> | <a href="#">Privacy Policy</a></p>
        </div>
      </div>
    </body>
    </html>`,
    };

    await transporter.sendMail(mailOptions);
  } catch (error: any) {
    throw new Error(error);
  }
};

export default sendEmailOtp;
