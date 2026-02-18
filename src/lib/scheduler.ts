import cron from "node-cron";
import { runReminderSweep } from "@/lib/reminders";

let started = false;

export function startReminderScheduler() {
  if (started) {
    return;
  }

  started = true;
  cron.schedule("0 * * * *", async () => {
    try {
      await runReminderSweep();
    } catch (error) {
      console.error("Reminder sweep failed", error);
    }
  });
}
