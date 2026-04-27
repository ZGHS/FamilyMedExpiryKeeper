import { Router, Request, Response } from 'express';
import {
  getAllMedicines,
  getMedicineById,
  addMedicine,
  updateMedicine,
  deleteMedicine,
  getExpiringMedicines
} from '../database/medicines';
import { Medicine, ApiResponse } from '../../shared/types';

const router = Router();

router.get('/', (_req: Request, res: Response) => {
  const medicines = getAllMedicines();
  const response: ApiResponse<Medicine[]> = { success: true, data: medicines };
  res.json(response);
});

router.get('/expiring', (_req: Request, res: Response) => {
  const medicines = getExpiringMedicines(7);
  const response: ApiResponse<Medicine[]> = { success: true, data: medicines };
  res.json(response);
});

router.get('/:id', (req: Request, res: Response) => {
  const id = parseInt(req.params.id);
  if (isNaN(id)) {
    res.status(400).json({ success: false, message: 'Invalid ID' });
    return;
  }
  const medicine = getMedicineById(id);
  if (!medicine) {
    res.status(404).json({ success: false, message: 'Medicine not found' });
    return;
  }
  const response: ApiResponse<Medicine> = { success: true, data: medicine };
  res.json(response);
});

router.post('/', (req: Request, res: Response) => {
  const { name, expiry_date, category, quantity, remark } = req.body;
  if (!name || !expiry_date) {
    res.status(400).json({ success: false, message: 'Name and expiry_date are required' });
    return;
  }
  const medicine = addMedicine({ name, expiry_date, category, quantity, remark });
  const response: ApiResponse<Medicine> = { success: true, data: medicine };
  res.status(201).json(response);
});

router.put('/:id', (req: Request, res: Response) => {
  const id = parseInt(req.params.id);
  if (isNaN(id)) {
    res.status(400).json({ success: false, message: 'Invalid ID' });
    return;
  }
  const { name, expiry_date, category, quantity, remark } = req.body;
  const medicine = updateMedicine(id, { name, expiry_date, category, quantity, remark });
  if (!medicine) {
    res.status(404).json({ success: false, message: 'Medicine not found' });
    return;
  }
  const response: ApiResponse<Medicine> = { success: true, data: medicine };
  res.json(response);
});

router.delete('/:id', (req: Request, res: Response) => {
  const id = parseInt(req.params.id);
  if (isNaN(id)) {
    res.status(400).json({ success: false, message: 'Invalid ID' });
    return;
  }
  const deleted = deleteMedicine(id);
  if (!deleted) {
    res.status(404).json({ success: false, message: 'Medicine not found' });
    return;
  }
  res.json({ success: true });
});

export default router;
