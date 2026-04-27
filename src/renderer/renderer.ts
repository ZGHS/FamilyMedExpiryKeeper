const API_BASE = 'http://localhost:3000/api';

const modal = document.getElementById('modal');
const modalTitle = document.getElementById('modalTitle');
const medicineForm = document.getElementById('medicineForm') as HTMLFormElement;
const medicineTableBody = document.getElementById('medicineTableBody');
const btnRefresh = document.getElementById('btnRefresh');
const btnAdd = document.getElementById('btnAdd');
const modalClose = document.getElementById('modalClose');
const btnCancel = document.getElementById('btnCancel');

interface Medicine {
  id?: number;
  name: string;
  expiry_date: string;
  category: string;
  quantity: number;
  remark: string;
  created_at?: string;
  updated_at?: string;
}

interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
}

async function fetchApi<T>(url: string, options?: RequestInit): Promise<T> {
  const response = await fetch(url, options);
  return response.json();
}

function getDaysUntilExpiry(expiryDate: string): number {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const expiry = new Date(expiryDate);
  expiry.setHours(0, 0, 0, 0);
  const diffTime = expiry.getTime() - today.getTime();
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
}

function getStatusClass(expiryDate: string): { class: string; text: string } {
  const days = getDaysUntilExpiry(expiryDate);
  if (days < 0) {
    return { class: 'status-expired', text: '已过期' };
  } else if (days <= 7) {
    return { class: 'status-expiring', text: '即将过期' };
  }
  return { class: 'status-normal', text: '正常' };
}

function getRowClass(expiryDate: string): string {
  const days = getDaysUntilExpiry(expiryDate);
  if (days < 0) return 'row-expired';
  if (days <= 7) return 'row-expiring';
  return '';
}

function renderTable(medicines: Medicine[]): void {
  if (!medicineTableBody) return;

  if (medicines.length === 0) {
    medicineTableBody.innerHTML = '<tr><td colspan="8" class="empty-row">暂无药品数据</td></tr>';
    return;
  }

  medicineTableBody.innerHTML = medicines.map((medicine, index) => {
    const status = getStatusClass(medicine.expiry_date);
    const rowClass = getRowClass(medicine.expiry_date);
    return `
      <tr class="${rowClass}">
        <td>${index + 1}</td>
        <td>${escapeHtml(medicine.name)}</td>
        <td>${medicine.expiry_date}</td>
        <td>${escapeHtml(medicine.category || '-')}</td>
        <td>${medicine.quantity}</td>
        <td>${escapeHtml(medicine.remark || '-')}</td>
        <td><span class="${status.class}">${status.text}</span></td>
        <td class="actions">
          <button class="btn btn-sm btn-primary" onclick="editMedicine(${medicine.id})">编辑</button>
          <button class="btn btn-sm btn-danger" onclick="deleteMedicine(${medicine.id})">删除</button>
        </td>
      </tr>
    `;
  }).join('');
}

function updateStats(medicines: Medicine[]): void {
  const total = medicines.length;
  const expired = medicines.filter(m => getDaysUntilExpiry(m.expiry_date) < 0).length;
  const expiringSoon = medicines.filter(m => {
    const days = getDaysUntilExpiry(m.expiry_date);
    return days >= 0 && days <= 7;
  }).length;
  const normal = total - expired - expiringSoon;

  const statTotal = document.getElementById('statTotal');
  const statExpired = document.getElementById('statExpired');
  const statExpiring = document.getElementById('statExpiring');
  const statNormal = document.getElementById('statNormal');

  if (statTotal) statTotal.textContent = total.toString();
  if (statExpired) statExpired.textContent = expired.toString();
  if (statExpiring) statExpiring.textContent = expiringSoon.toString();
  if (statNormal) statNormal.textContent = normal.toString();
}

async function loadMedicines(): Promise<void> {
  try {
    const response = await fetchApi<ApiResponse<Medicine[]>>(`${API_BASE}/medicines`);
    if (response.success && response.data) {
      renderTable(response.data);
      updateStats(response.data);
    }
  } catch (error) {
    console.error('Failed to load medicines:', error);
    if (medicineTableBody) {
      medicineTableBody.innerHTML = '<tr><td colspan="8" class="empty-row">加载失败，请检查服务器</td></tr>';
    }
  }
}

function openModal(isEdit: boolean, medicine?: Medicine): void {
  if (!modal || !modalTitle) return;

  if (isEdit && medicine) {
    modalTitle.textContent = '编辑药品';
    (document.getElementById('medicineId') as HTMLInputElement).value = medicine.id?.toString() || '';
    (document.getElementById('medicineName') as HTMLInputElement).value = medicine.name;
    (document.getElementById('medicineExpiry') as HTMLInputElement).value = medicine.expiry_date;
    (document.getElementById('medicineCategory') as HTMLInputElement).value = medicine.category || '';
    (document.getElementById('medicineQuantity') as HTMLInputElement).value = medicine.quantity.toString();
    (document.getElementById('medicineRemark') as HTMLInputElement).value = medicine.remark || '';
  } else {
    modalTitle.textContent = '添加药品';
    medicineForm?.reset();
    (document.getElementById('medicineId') as HTMLInputElement).value = '';
  }

  modal.classList.add('show');
}

function closeModal(): void {
  if (!modal) return;
  modal.classList.remove('show');
}

async function handleFormSubmit(e: Event): Promise<void> {
  e.preventDefault();

  const id = (document.getElementById('medicineId') as HTMLInputElement).value;
  const medicine: Omit<Medicine, 'id'> = {
    name: (document.getElementById('medicineName') as HTMLInputElement).value,
    expiry_date: (document.getElementById('medicineExpiry') as HTMLInputElement).value,
    category: (document.getElementById('medicineCategory') as HTMLInputElement).value,
    quantity: parseInt((document.getElementById('medicineQuantity') as HTMLInputElement).value) || 0,
    remark: (document.getElementById('medicineRemark') as HTMLInputElement).value
  };

  try {
    if (id) {
      await fetchApi<ApiResponse<Medicine>>(`${API_BASE}/medicines/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(medicine)
      });
    } else {
      await fetchApi<ApiResponse<Medicine>>(`${API_BASE}/medicines`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(medicine)
      });
    }
    closeModal();
    loadMedicines();
  } catch (error) {
    console.error('Failed to save medicine:', error);
    alert('保存失败，请重试');
  }
}

async function editMedicine(id: number): Promise<void> {
  try {
    const response = await fetchApi<ApiResponse<Medicine>>(`${API_BASE}/medicines/${id}`);
    if (response.success && response.data) {
      openModal(true, response.data);
    }
  } catch (error) {
    console.error('Failed to load medicine:', error);
  }
}

async function deleteMedicine(id: number): Promise<void> {
  if (!confirm('确定要删除这个药品吗？')) return;

  try {
    await fetchApi<ApiResponse<void>>(`${API_BASE}/medicines/${id}`, {
      method: 'DELETE'
    });
    loadMedicines();
  } catch (error) {
    console.error('Failed to delete medicine:', error);
    alert('删除失败，请重试');
  }
}

function escapeHtml(text: string): string {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

btnRefresh?.addEventListener('click', loadMedicines);
btnAdd?.addEventListener('click', () => openModal(false));
modalClose?.addEventListener('click', closeModal);
btnCancel?.addEventListener('click', closeModal);
medicineForm?.addEventListener('submit', handleFormSubmit);

modal?.addEventListener('click', (e) => {
  if (e.target === modal) closeModal();
});

window.editMedicine = editMedicine;
window.deleteMedicine = deleteMedicine;

document.addEventListener('DOMContentLoaded', loadMedicines);
