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

export const sendWelcomeEmail = async (email: string, name: string) => {
  try {
    const mailOptions = {
      from: "Clark <no-reply@clarkai.com>",
      to: email,
      subject: "Welcome to Clark!",
      html: `<!DOCTYPE html>
      <html lang="en">
      <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Welcome to Clark</title>
          <style>
              body {
                  font-family: 'Arial', sans-serif;
                  background-color: #f7f7f7;
                  margin: 0;
                  padding: 20px;
              }
              .container {
                  background-color: #ffffff;
                  padding: 30px;
                  border-radius: 10px;
                  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
                  max-width: 600px;
                  margin: 0 auto;
              }
              h1 {
                  color: #333;
                  font-size: 30px;
                  margin-bottom: 20px;
              }
              p {
                  color: #555;
                  font-size: 16px;
                  line-height: 1.8;
              }
              .features-list {
                  margin: 20px 0;
                  padding-left: 20px;
              }
              .feature-item {
                  margin: 10px 0;
                  font-size: 16px;
                  color: #444;
              }
              .cta-button {
                  background-color: #007bff;
                  color: #fff;
                  text-decoration: none;
                  padding: 10px 20px;
                  border-radius: 5px;
                  font-weight: bold;
                  display: inline-block;
                  margin-top: 20px;
              }
              .footer {
                  margin-top: 40px;
                  font-size: 14px;
                  color: #999;
                  text-align: center;
              }
          </style>
      </head>
      <body>
          <div class="container">
              <h1>Hello ${name.split(" ").length > 1 ? name.split(" ")[0] : name},</h1>
              <p>Welcome to Clark! We are thrilled to have you join our community. At Clark, we are committed to providing you with an intelligent, personalized experience that helps you achieve your goals more efficiently.</p>
              <p>Here are some of the key features you’ll enjoy:</p>
              <ul class="features-list">
                <li class="feature-item"><strong>PDF Analysis:</strong> Upload and analyze your PDF documents with AI-powered insights to enhance your understanding.</li>
                <li class="feature-item"><strong>AI-Powered Q&A:</strong> Ask questions related to your PDFs, and get instant AI-generated responses for deeper learning.</li>
                <li class="feature-item"><strong>One-on-One AI Chat:</strong> Engage in a personalized chat with AI for detailed explanations, study support, and tutoring.</li>
                <li class="feature-item"><strong>Math Equation Solver:</strong> Scan and solve complex math equations with the help of AI-driven solutions.</li>
                <li class="feature-item"><strong>AI-Generated Quizzes:</strong> Test your knowledge with customized quizzes created by AI based on your study materials.</li>
            </ul>
              <p>If you have any questions, feel free to reach out. We're always here to help!</p>
              <a href="https://clarkai-baxl.onrender.com/" class="cta-button">Get Started</a>
              <div class="footer">
                  Best regards,<br>
                  The Clark Team<br>
                  <a href="https://clarkai-baxl.onrender.com/" style="color: #007bff;">ClarkAI.com</a>
              </div>
          </div>
      </body>
      </html>`
    };

    transporter.sendMail(mailOptions, async (error: any, info: any) => {
      if (error) {
        console.log("Error sending email: ", error);
      } else {
        console.log("Welcome email sent: ", info.response);
        return true;
      }
    });
  } catch (error) {
    console.log("Error: ", error);
    return "Error sending email";
  }
};
