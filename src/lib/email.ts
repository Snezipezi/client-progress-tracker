import nodemailer from "nodemailer";

type EmailConfig = {
  host: string;
  port: number;
  user: string;
  pass: string;
  from: string;
};

export function getEmailConfig(): EmailConfig | null {
  const host = process.env.SMTP_HOST;
  const port = process.env.SMTP_PORT;
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;
  const from = process.env.SMTP_FROM;

  if (!host || !port || !user || !pass || !from) {
    return null;
  }

  return {
    host,
    port: Number(port),
    user,
    pass,
    from
  };
}

export async function sendReminderEmail(to: string, name: string) {
  const config = getEmailConfig();
  if (!config) {
    return { ok: false, reason: "missing-config" } as const;
  }

  const transporter = nodemailer.createTransport({
    host: config.host,
    port: config.port,
    secure: config.port === 465,
    auth: {
      user: config.user,
      pass: config.pass
    }
  });

  await transporter.sendMail({
    from: config.from,
    to,
    subject: "Daily check-in reminder",
    text: `Hi ${name},\n\nFriendly reminder to submit your daily check-in for your nutrition plan.\n\nThank you!`,
    html: `<p>Hi ${name},</p><p>Friendly reminder to submit your daily check-in for your nutrition plan.</p><p>Thank you!</p>`
  });

  return { ok: true } as const;
}
