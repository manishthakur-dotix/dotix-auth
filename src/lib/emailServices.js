import axios from "axios";

const sendEmail = async ({ toEmail, toName, subject, htmlContent }) => {
  try {
    const response = await axios.post(
      "https://api.brevo.com/v3/smtp/email",
      {
        sender: {
          name: "Dotix Auth",
          email: "hello@dotix.io",
        },
        to: [
          {
            email: toEmail,
            name: toName,
          },
        ],
        subject: subject,
        htmlContent: htmlContent,
      },
      {
        headers: {
          accept: "application/json",
          "api-key": process.env.EMAIL_API_KEY,
          "content-type": "application/json",
        },
      }
    );

    console.log("Email sent successfully:", response.data);
  } catch (error) {
    console.error("Error sending email:", error);
    throw new Error("Failed to send email");
  }
};

export const sendWelcomeEmail = async (userEmail, userName, token) => {
  const subject = "Welcome to Dotix, Verify your email";
  const htmlContent = `
  <html>
  <head>
    <style>
      body {
        display: flex;
        justify-content: center;
        background-color: rgba(247, 247, 247, 0.892);
      }
      .container {
        background-color: white;
        border: 1px solid gainsboro;
        border-radius: 10px;
        padding: 20px;
        width: 450px;
      }
    </style>
  </head>
  <body>
    <div class="container">
      <p style="font-size: 30px; font-weight: 600; text-align: center">
        Verify Your Account
      </p>
      <p style="text-align: center; font-size: 18px;">
        Welcome to Dotix! You have successfully signed up. To get started,
        please confirm your email address by clicking the button below:
      </p>
      <br />
    
      <div style="text-align: center">
        <a
          href="${process.env.NEXTAUTH_URL}/v0/verify-email?token=${token}"
          target="_blank"
          style="
            background-color: #7c3aed;
            color: white;
            padding: 8px 16px;
            text-decoration: none;
            border-radius: 6px;
            width: 250px;
            text-align: center;
          "
          >Verify Email</a
        >
      </div>

      <br /><br />
      <div style="text-align: center">
        <p>If you did not register with us, please disregard this email.</p>
        <p>Best regards,<br /></p>
        <p>To unsubscribe from future emails, click <a href="#">here</a>.</p>
      </div>
    </div>
  </body>
</html>

  `;

  await sendEmail({
    toEmail: userEmail,
    toName: userName,
    subject: subject,
    htmlContent: htmlContent,
  });
};

export const sendForgotPasswordEmail = async (userEmail, userName, token) => {
  const subject = "Reset your password, Dotix";

  const htmlContent = `
  <html>
  <head>
    <style>
      body {
        display: flex;
        justify-content: center;
        background-color: rgba(247, 247, 247, 0.892);
      }
      .container {
        background-color: white;
        border: 1px solid gainsboro;
        border-radius: 10px;
        padding: 20px;
        width: 450px;
      }
    </style>
  </head>
  <body>
    <div class="container">
      <p style="font-size: 30px; font-weight: 600; text-align: center">
       Hello ${userName}, Reset Your Password
      </p>
      <p style="text-align: center; font-size: 18px;">
      Welcome to Dotix! We received a request to reset your password. Please click the link below to reset your password:
      </p>
      <br />
    
      <div style="text-align: center">
        <a
          href="${process.env.NEXTAUTH_URL}/v0/setup-password?token=${token}"
          target="_blank"
          style="
            background-color: #7c3aed;
            color: white;
            padding: 8px 16px;
            text-decoration: none;
            border-radius: 6px;
            width: 300px;
            text-align: center;
          "
          >Reset Password</a>
      </div>

      <br /><br />
      <div style="text-align: center">
        <p>If you did not register with us, please disregard this email.</p>
        <p>Best regards,<br /></p>
        <p>To unsubscribe from future emails, click <a href="#">here</a>.</p>
      </div>
    </div>
  </body>
</html>

  `;

  await sendEmail({
    toEmail: userEmail,
    toName: userName,
    subject: subject,
    htmlContent: htmlContent,
  });
};

export const sendPasswordResetSuccessEmail = async (userEmail, userName) => {
  const subject = "Password Reset Successfully";

  const htmlContent = `
  <html>
  <head>
    <style>
      body {
        display: flex;
        justify-content: center;
        background-color: rgba(247, 247, 247, 0.892);
      }
      .container {
        background-color: white;
        border: 1px solid gainsboro;
        border-radius: 10px;
        padding: 20px;
        width: 450px;
      }
    </style>
  </head>
  <body>
    <div class="container">
      <p style="font-size: 25px; font-weight: 600; text-align: center">
       Hello ${userName}, 
      </p>
    
      <p style="text-align: center; font-size: 18px; color: #333;">
        We're happy to inform you that your password has been successfully reset.
      </p>
      <p style="text-align: center; font-size: 18px; color: #555;">
        If you didn't request this change, please contact our support team immediately.
      </p>

      <br />

      <br /><br />
      <div style="text-align: center">
        <p>Best regards,<br /></p>
        <p>To unsubscribe from future emails, click <a href="#">here</a>.</p>
      </div>
    </div>
  </body>
</html>

  `;

  await sendEmail({
    toEmail: userEmail,
    toName: userName,
    subject: subject,
    htmlContent: htmlContent,
  });
};
