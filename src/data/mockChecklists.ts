import { ChecklistItem } from './types';

export const mockChecklist: ChecklistItem[] = [
  { id: 'visa', label: 'Visa Check', completed: true },
  { id: 'packing', label: 'Packing List', completed: true },
  { id: 'vaccination', label: 'Vaccination Records', completed: true },
  { id: 'insurance', label: 'Travel Insurance', completed: false },
  { id: 'currency', label: 'Currency Exchange', completed: false },
];
