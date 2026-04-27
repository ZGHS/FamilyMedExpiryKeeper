import db from './db';
import { Medicine } from '../../shared/types';

export function getAllMedicines(): Medicine[] {
  const stmt = db.prepare('SELECT * FROM medicines ORDER BY expiry_date ASC');
  return stmt.all() as Medicine[];
}

export function getMedicineById(id: number): Medicine | undefined {
  const stmt = db.prepare('SELECT * FROM medicines WHERE id = ?');
  return stmt.get(id) as Medicine | undefined;
}

export function addMedicine(medicine: Omit<Medicine, 'id' | 'created_at' | 'updated_at'>): Medicine {
  const stmt = db.prepare(`
    INSERT INTO medicines (name, expiry_date, category, quantity, remark)
    VALUES (?, ?, ?, ?, ?)
  `);
  const result = stmt.run(
    medicine.name,
    medicine.expiry_date,
    medicine.category || '',
    medicine.quantity || 0,
    medicine.remark || ''
  );
  return getMedicineById(result.lastInsertRowid as number) as Medicine;
}

export function updateMedicine(id: number, medicine: Partial<Medicine>): Medicine | undefined {
  const existing = getMedicineById(id);
  if (!existing) return undefined;

  const stmt = db.prepare(`
    UPDATE medicines
    SET name = ?, expiry_date = ?, category = ?, quantity = ?, remark = ?, updated_at = datetime('now')
    WHERE id = ?
  `);
  stmt.run(
    medicine.name ?? existing.name,
    medicine.expiry_date ?? existing.expiry_date,
    medicine.category ?? existing.category,
    medicine.quantity ?? existing.quantity,
    medicine.remark ?? existing.remark,
    id
  );
  return getMedicineById(id);
}

export function deleteMedicine(id: number): boolean {
  const stmt = db.prepare('DELETE FROM medicines WHERE id = ?');
  const result = stmt.run(id);
  return result.changes > 0;
}

export function getExpiringMedicines(days: number = 7): Medicine[] {
  const stmt = db.prepare(`
    SELECT * FROM medicines
    WHERE date(expiry_date) <= date('now', '+' || ? || ' days')
    AND date(expiry_date) >= date('now')
    ORDER BY expiry_date ASC
  `);
  return stmt.all(days) as Medicine[];
}

export function getExpiredMedicines(): Medicine[] {
  const stmt = db.prepare(`
    SELECT * FROM medicines
    WHERE date(expiry_date) < date('now')
    ORDER BY expiry_date ASC
  `);
  return stmt.all() as Medicine[];
}

export function getNormalMedicines(): Medicine[] {
  const stmt = db.prepare(`
    SELECT * FROM medicines
    WHERE date(expiry_date) > date('now', '+7 days')
    ORDER BY expiry_date ASC
  `);
  return stmt.all() as Medicine[];
}
