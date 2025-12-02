import { Handler, HandlerEvent, HandlerContext } from '@netlify/functions';
import nodemailer from 'nodemailer';

const handler: Handler = async (event: HandlerEvent, context: HandlerContext) => {
  // Only allow POST
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: JSON.stringify({ message: 'Method not allowed' }),
    };
  }

  try {
    const { name, email, subject, message } = JSON.parse(event.body || '{}');

    // Validate required fields
    if (!name || !email || !subject || !message) {
      return {
        statusCode: 400,
        body: JSON.stringify({ message: 'All fields are required' }),
      };
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return {
        statusCode: 400,
        body: JSON.stringify({ message: 'Invalid email address' }),
      };
    }

    // Create transporter using environment variables
    const transporter = nodemailer.createTransporter({
      host: process.env.SMTP_HOST,
      port: parseInt(process.env.SMTP_PORT || '587'),
      secure: false, // true for 465, false for other ports
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });

    // Email content
    const mailOptions = {
      from: `"${name}" <${process.env.SMTP_USER}>`,
      to: process.env.RECIPIENT_EMAIL,
      replyTo: email,
      subject: `Contact Form: ${subject}`,
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body {
              font-family: Arial, sans-serif;
              line-height: 1.6;
              color: #333;
            }
            .container {
              max-width: 600px;
              margin: 0 auto;
              padding: 20px;
              background-color: #f9fafb;
            }
            .header {
              background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
              color: white;
              padding: 30px;
              border-radius: 10px 10px 0 0;
              text-align: center;
            }
            .content {
              background: white;
              padding: 30px;
              border-radius: 0 0 10px 10px;
              box-shadow: 0 2px 4px rgba(0,0,0,0.1);
            }
            .field {
              margin-bottom: 20px;
            }
            .label {
              font-weight: bold;
              color: #4f46e5;
              margin-bottom: 5px;
            }
            .value {
              padding: 10px;
              background-color: #f3f4f6;
              border-radius: 5px;
              border-left: 3px solid #4f46e5;
            }
            .message-box {
              background-color: #f9fafb;
              padding: 15px;
              border-radius: 8px;
              border: 1px solid #e5e7eb;
              white-space: pre-wrap;
              word-wrap: break-word;
            }
            .footer {
              text-align: center;
              margin-top: 20px;
              color: #6b7280;
              font-size: 14px;
            }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>📧 New Contact Form Submission</h1>
              <p>You have received a new message from your website</p>
            </div>
            <div class="content">
              <div class="field">
                <div class="label">👤 Name:</div>
                <div class="value">${name}</div>
              </div>
              
              <div class="field">
                <div class="label">📧 Email:</div>
                <div class="value"><a href="mailto:${email}">${email}</a></div>
              </div>
              
              <div class="field">
                <div class="label">📝 Subject:</div>
                <div class="value">${subject}</div>
              </div>
              
              <div class="field">
                <div class="label">💬 Message:</div>
                <div class="message-box">${message}</div>
              </div>
              
              <div class="footer">
                <p>This message was sent from the Shortcuts contact form</p>
                <p>Reply directly to this email to respond to ${name}</p>
              </div>
            </div>
          </div>
        </body>
        </html>
      `,
      text: `
New Contact Form Submission

Name: ${name}
Email: ${email}
Subject: ${subject}

Message:
${message}

---
This message was sent from the Shortcuts contact form.
Reply to ${email} to respond.
      `,
    };

    // Send email
    await transporter.sendMail(mailOptions);

    return {
      statusCode: 200,
      body: JSON.stringify({ 
        message: 'Message sent successfully',
        success: true 
      }),
    };
  } catch (error) {
    console.error('Error sending email:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ 
        message: 'Failed to send message. Please try again later.',
        error: process.env.NODE_ENV === 'development' ? String(error) : undefined
      }),
    };
  }
};

export { handler };
