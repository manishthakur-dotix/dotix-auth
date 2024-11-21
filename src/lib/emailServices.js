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
      <head></head> 
      <body>
        <p>Hello ${userName},</p>
        <p>
            Welcome to Dotix! You have successfully signed up.
            To get started, please confirm your email address by clicking the button below:
        </p>
        <br>
        <a href="${process.env.NEXTAUTH_URL}/v0/verify-email?token=${token}" target="_blank" 
        style="background-color: #7C3AED; color: white; padding: 8px 16px; text-decoration: none; border-radius: 6px;"
        >Verify My Account</a>

        <br><br>

        <p>If the button above doesn&apos;t work, copy and paste the following link into your browser:</p>
        <p>${process.env.NEXTAUTH_URL}/v0/verify-email?token=${token}</p>
     
        <br>
        <p>If you didn&apos;t sign up for Adperk, you can safely ignore this email.</p>
        <p>Best regards,<br>Adperk Team</p>
        <p>To unsubscribe from future emails, click <a href="#">here</a>.</p>
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
      <head></head>
      <body>
        <p>Hello ${userName},</p>
        <p>Welcome to Dotix! Click the link below to reset your password:</p>
        <br>

        <a href="${process.env.NEXTAUTH_URL}/v0/setup-password?token=${token}" target="_blank" 
          style="background-color: #7C3AED; color: white; padding: 8px 16px; text-decoration: none; border-radius: 6px;"
        >Reset Password</a>

        <br><br>

        <p>If the button above doesn&apos;t work, copy and paste the following link into your browser:</p>
        <p>${process.env.NEXTAUTH_URL}/v0/setup-password?token=${token}</p>

        <br>
        <p>To unsubscribe from future emails, click <a href="#">here</a>.</p>
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
