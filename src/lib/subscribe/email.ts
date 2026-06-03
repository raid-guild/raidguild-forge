import sgMail from "@sendgrid/mail";

const defaultFromEmail = "no-reply@raidguild.org";
const defaultFromName = "RaidGuild Forge";

function getRequiredEnv(name: string) {
  const value = process.env[name];

  if (!value) {
    throw new Error(`${name} is required for subscribe confirmation emails.`);
  }

  return value;
}

export function escapeHtml(value: string) {
  return value.replace(/[&<>"']/g, (char) => {
    switch (char) {
      case "&":
        return "&amp;";
      case "<":
        return "&lt;";
      case ">":
        return "&gt;";
      case "\"":
        return "&quot;";
      default:
        return "&#39;";
    }
  });
}

export async function sendConfirmationEmail({
  to,
  confirmationUrl,
  unsubscribeUrl,
}: {
  to: string;
  confirmationUrl: string;
  unsubscribeUrl: string;
}) {
  const apiKey = process.env.SENDGRID_API_KEY;

  if (!apiKey && process.env.NODE_ENV !== "production") {
    console.info("SendGrid disabled; skipping subscribe confirmation email send.");
    return;
  }

  sgMail.setApiKey(apiKey ?? getRequiredEnv("SENDGRID_API_KEY"));

  const fromEmail = process.env.SENDGRID_FROM_EMAIL ?? defaultFromEmail;
  const fromName = process.env.SENDGRID_FROM_NAME ?? defaultFromName;
  const escapedConfirmationUrl = escapeHtml(confirmationUrl);
  const escapedUnsubscribeUrl = escapeHtml(unsubscribeUrl);

  await sgMail.send({
    to,
    from: {
      email: fromEmail,
      name: fromName,
    },
    subject: "Confirm your RaidGuild Forge updates",
    text: [
      "Confirm that you want updates from RaidGuild Forge.",
      "",
      confirmationUrl,
      "",
      "You can unsubscribe at any time:",
      unsubscribeUrl,
      "",
      "If you did not request this, you can ignore this email.",
    ].join("\n"),
    html: `
      <p>Confirm that you want updates from RaidGuild Forge.</p>
      <p><a href="${escapedConfirmationUrl}">Confirm your email</a></p>
      <p>You can <a href="${escapedUnsubscribeUrl}">unsubscribe at any time</a>.</p>
      <p>If you did not request this, you can ignore this email.</p>
    `,
  });
}

export async function sendAdminNotification({
  subject,
  textLines,
  htmlLines,
}: {
  subject: string;
  textLines: string[];
  htmlLines: string[];
}) {
  const to = process.env.ADMIN_NOTIFY_EMAIL;

  if (!to) {
    console.info("Admin notifications disabled; ADMIN_NOTIFY_EMAIL is not set.");
    return;
  }

  const apiKey = process.env.SENDGRID_API_KEY;

  if (!apiKey && process.env.NODE_ENV !== "production") {
    console.info("SendGrid disabled; skipping admin notification email send.");
    return;
  }

  sgMail.setApiKey(apiKey ?? getRequiredEnv("SENDGRID_API_KEY"));

  const fromEmail = process.env.SENDGRID_FROM_EMAIL ?? defaultFromEmail;
  const fromName = process.env.SENDGRID_FROM_NAME ?? defaultFromName;

  await sgMail.send({
    to,
    from: {
      email: fromEmail,
      name: fromName,
    },
    subject,
    text: textLines.join("\n"),
    html: htmlLines.join(""),
  });
}
