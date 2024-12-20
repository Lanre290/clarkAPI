
const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
    host: process.env.MAIL_HOST,
    port: process.env.MAIL_PORT,
    secure: true,
    auth: {
      user: process.env.MAIL_USERNAME,
      pass: process.env.MAIL_PASSWORD,
    },
  });


export const sendOTP = async (email: string, name: string, otp: number) => {
    try {
      const mailOptions = {
        from: "Clark <no-reply@clarkai.com>",
        to: email,
        subject: "Verify your Identity",
        html: `<!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Email Confirmation</title>
            <style>
                body {
                    font-family: Arial, sans-serif;
                    background-color: #f9f9f9;
                    margin: 0;
                    padding: 20px;
                }
                .container {
                    background-color: #fff;
                    padding: 20px;
                    border-radius: 10px;
                    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
                    max-width: 600px;
                    margin: 0 auto;
                }
                h1 {
                    color: #333;
                    font-size: 24px;
                    margin-bottom: 10px;
                }
                h4 {
                    color: #555;
                    font-size: 18px;
                }
                .otp-code {
                    font-size: 28px;
                    font-weight: bold;
                    color: #007BFF;
                    background-color: #f0f8ff;
                    padding: 15px;
                    border-radius: 8px;
                    display: inline-block;
                    letter-spacing: 2px;
                    margin: 15px 0;
                }
                p {
                    color: #666;
                    font-size: 16px;
                    line-height: 1.8;
                }
                .footer {
                    margin-top: 30px;
                    font-size: 14px;
                    color: #999;
                }
            </style>
        </head>
        <body>
            <div class="container">
                <h1>Hi ${
                  name.split(" ").length > 1 ? name.split(" ")[0] : name
                }</h1>
                <p>We received a request to verify your email address. To complete the process, please use the OTP below:</p>
                <h4>Your One-Time Password (OTP)</h4>
                <div class="otp-code">${otp}</div>
                <p>If you didn't request this, no worries! You can safely ignore this email.</p>
                <p>Thanks for being part of our community! If you need any help, feel free to reach out.</p>
                <div class="footer">
                    Best regards,<br>
                    Clark
                </div>
            </div>
        </body>
        </html>      
  `,
      };
  
      transporter.sendMail(mailOptions, async (error: any, info: any) => {
        if (error) {
          console.log("error");
        } else {
          return true;
        }
      });
    } catch (error) {
      return "Error sending mail";
    }
  };
  