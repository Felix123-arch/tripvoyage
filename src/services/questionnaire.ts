import api from './api';

export interface QuestionnaireResponse {
  questionId: string;
  answer: string;
}

export interface SubmitData {
  sessionId: string;
  responses: QuestionnaireResponse[];
}

export async function submitQuestionnaire(data: SubmitData): Promise<{ count: number }> {
  const res = await api.post('/questionnaire', data);
  return res.data;
}

export async function getQuestionnaireStats(): Promise<any> {
  const res = await api.get('/questionnaire/stats');
  return res.data;
}
