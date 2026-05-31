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
    console.info("Subscribe confirmation URL:", confirmationUrl);
    console.info("Subscribe unsubscribe URL:", unsubscribeUrl);
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
      <p><a href="${confirmationUrl}">Confirm your email</a></p>
      <p>You can <a href="${unsubscribeUrl}">unsubscribe at any time</a>.</p>
      <p>If you did not request this, you can ignore this email.</p>
    `,
  });
}
