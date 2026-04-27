import schedule from 'node-schedule';
import { getExpiringMedicines } from '../server/database/medicines';
import { showExpiryNotification } from './notification';

let scheduledJob: schedule.Job | null = null;

export function startScheduler(): void {
  scheduledJob = schedule.scheduleJob('0 9 * * *', () => {
    console.log('[Scheduler] Running daily expiry check...');
    checkAndNotify();
  });
  console.log('[Scheduler] Scheduled daily check at 09:00');
}

export function checkAndNotify(): void {
  const expiring = getExpiringMedicines(7);
  if (expiring.length > 0) {
    console.log(`[Scheduler] Found ${expiring.length} medicines expiring soon`);
    showExpiryNotification(expiring);
  } else {
    console.log('[Scheduler] No medicines expiring within 7 days');
  }
}

export function stopScheduler(): void {
  if (scheduledJob) {
    scheduledJob.cancel();
    scheduledJob = null;
    console.log('[Scheduler] Stopped');
  }
}
