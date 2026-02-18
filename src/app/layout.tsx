import "./globals.css";
import { startReminderScheduler } from "@/lib/scheduler";

export const metadata = {
  title: "Sledování pokroku klientů",
  description: "Panel nutričního kouče a denní zápisy klientů"
};

startReminderScheduler();

export default function RootLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="cs">
      <body>{children}</body>
    </html>
  );
}
