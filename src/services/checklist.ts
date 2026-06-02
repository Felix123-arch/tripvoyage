import api from './api';

export interface ChecklistItem {
  id: string;
  userId: string;
  label: string;
  completed: boolean;
}

export async function getChecklist(): Promise<ChecklistItem[]> {
  const res = await api.get('/checklist');
  return res.data;
}

export async function createChecklistItem(label: string): Promise<ChecklistItem> {
  const res = await api.post('/checklist', { label });
  return res.data;
}

export async function updateChecklistItem(id: string, data: { label?: string; completed?: boolean }): Promise<ChecklistItem> {
  const res = await api.put(`/checklist/${id}`, data);
  return res.data;
}

export async function deleteChecklistItem(id: string): Promise<void> {
  await api.delete(`/checklist/${id}`);
}
