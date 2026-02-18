import { createTransporter } from "./mail.config.js";
import { 
  VERIFICATION_EMAIL_TEMPLATE,
  PASSWORD_RESET_REQUEST_TEMPLATE,
  PASSWORD_RESET_SUCCESS_TEMPLATE 
} from "./emailTemplates.js";

export const sendVerificationEmail = async (email, verificationToken) => {
  const transporter = createTransporter();

  // inject the code into the HTML template
  const htmlContent = VERIFICATION_EMAIL_TEMPLATE.replace(
    "{verificationCode}",
    verificationToken
  );

  try {
    const info = await transporter.sendMail({
      from: {
        address: "support@voiceofafrica.co.uk",
        name: "Auth App",
      },
      to: email,
      subject: "Verify Your Email",
      html: htmlContent,
    });

    console.log("✅ Email sent successfully:", info.messageId);
  } catch (err) {
    console.error("❌ Error sending verification email:", err);
    throw new Error(`Error sending verification email: ${err.message}`);
  }
};

//SEND WELCOME EMAIL
export const sendWelcomeEmail = async (email, name) => {
  const transporter = createTransporter();

  // Build your HTML template
  const htmlContent = `
    <h1>Welcome, ${name} 🎉</h1>
    <p>We’re so happy to have you at <strong>Auth App</strong>.</p>
    <p>Your account with <em>${email}</em> has been successfully verified.</p>
    <br/>
    <p>Auth App</p>
  `;

  try {
    const info = await transporter.sendMail({
      from: {
        address: "support@voiceofafrica.co.uk",
        name: "Auth App",
      },
      to: email,
      subject: "🎉 Welcome to Auth App!",
      html: htmlContent,
    });

    console.log("✅ Welcome email sent successfully:", info.messageId);
  } catch (error) {
    console.error("❌ Error sending welcome email:", error);
    throw new Error(`Error sending welcome email: ${error.message}`);
  }
};

// PASSWORD RESER EMAIL
export const sendPasswordResetEmail = async (email, resetURL) => {
	const transporter = createTransporter();

   // inject the code into the HTML template
   const htmlContent = PASSWORD_RESET_REQUEST_TEMPLATE.replace(
    "{resetURL}",
    resetURL
  );

	try {
		const info = await transporter.sendMail({
			from: {
        address: "support@voiceofafrica.co.uk",
        name: "Auth App",
      },
			  to: recipient,
			  subject: "Reset your password",
        html: htmlContent,
		});
	} catch (error) {
		console.error(`Error sending password reset email`, error);

		throw new Error(`Error sending password reset email: ${error}`);
	}
};

export const sendResetSuccessEmail = async (email) => {
	const transporter = createTransporter();

  const htmlContent = PASSWORD_RESET_SUCCESS_TEMPLATE.replace()

	try {
		const info = await transporter.sendMail({
      from: {
        address: "support@voiceofafrica.co.uk",
        name: "Auth App",
      },
			 to: recipient,
			 subject: "Password Reset Successful",
       html: htmlContent,
		});

		console.log("Password reset email sent successfully", response);
	} catch (error) {
		console.error(`Error sending password reset success email`, error);

		throw new Error(`Error sending password reset success email: ${error}`);
	}
};
