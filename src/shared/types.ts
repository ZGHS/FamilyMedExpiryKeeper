export interface Medicine {
  id?: number;
  name: string;
  expiry_date: string;
  category: string;
  quantity: number;
  remark: string;
  created_at?: string;
  updated_at?: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
}

export interface MedicineStatus {
  total: number;
  expired: number;
  expiringSoon: number;
  normal: number;
}
