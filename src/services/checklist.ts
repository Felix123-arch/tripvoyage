import api from './api';

export interface ChecklistItem {
  id: string;
  userId: string;
  itineraryId?: string | null;
  label: string;
  completed: boolean;
  category?: string;
}

export async function getChecklist(itineraryId?: string): Promise<ChecklistItem[]> {
  const res = await api.get('/checklist', { params: itineraryId ? { itineraryId } : {} });
  return res.data;
}

export async function createChecklistItem(label: string, itineraryId?: string): Promise<ChecklistItem> {
  const res = await api.post('/checklist', { label, itineraryId });
  return res.data;
}

export async function updateChecklistItem(id: string, data: { label?: string; completed?: boolean }): Promise<ChecklistItem> {
  const res = await api.put(`/checklist/${id}`, data);
  return res.data;
}

export async function deleteChecklistItem(id: string): Promise<void> {
  await api.delete(`/checklist/${id}`);
}
