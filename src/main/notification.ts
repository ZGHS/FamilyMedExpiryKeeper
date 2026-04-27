import { Notification } from 'electron';
import { Medicine } from '../shared/types';

export function showExpiryNotification(medicines: Medicine[]): void {
  if (medicines.length === 0) return;

  const medicineList = medicines.map(m => `${m.name} (${m.expiry_date})`).join(', ');
  const body = medicines.length === 1
    ? `药品「${medicineList}」即将过期，请及时处理！`
    : `有${medicines.length}个药品即将过期：${medicineList}`;

  const notification = new Notification({
    title: '药品效期提醒',
    body: body,
    silent: false
  });

  notification.show();
}

export function showGeneralNotification(title: string, body: string): void {
  const notification = new Notification({
    title,
    body,
    silent: false
  });

  notification.show();
}
