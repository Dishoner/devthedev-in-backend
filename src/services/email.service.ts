import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

interface SendEmailParams {
  to: string;
  subject: string;
  html: string;
  text?: string;
  cc?: string | string[];
}

export async function sendEmail({
  to,
  subject,
  html,
  text,
  cc,
}: SendEmailParams): Promise<void> {
  if (!process.env.RESEND_FROM_EMAIL) {
    throw new Error("RESEND_FROM_EMAIL not configured");
  }

  await resend.emails.send({
    from: process.env.RESEND_FROM_EMAIL, // e.g. DevTheDev <contact@devthedev.in>
    to,
    subject,
    html,
    text,
    cc,
  });
}

export async function sendContactEmail(
  name: string,
  email: string,
  message: string
): Promise<void> {
  const recipient = process.env.CONTACT_RECIPIENT_EMAIL;

  if (!recipient) {
    throw new Error("CONTACT_RECIPIENT_EMAIL not configured");
  }

  const subject = `New Contact Form Submission from ${name}`;

  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px;">
      <h2>New Contact Form Submission</h2>
      <p><strong>Name:</strong> ${name}</p>
      <p><strong>Email:</strong> ${email}</p>
      <p><strong>Message:</strong></p>
      <p>${message.replace(/\n/g, "<br>")}</p>
    </div>
  `;

  await sendEmail({
    to: recipient,
    subject,
    html,
    cc: email,
  });
}
