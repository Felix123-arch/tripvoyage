import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, TextInput, StyleSheet, Alert } from 'react-native';
import { useTheme } from '../theme';
import { useAuth } from '../contexts/AuthContext';
import { useLang } from '../contexts/LanguageContext';
import { LoadingOverlay } from '../components';
import * as api from '../services';

interface Props {
  navigation: any;
}

interface Question {
  id: string;
  text: string;
  type: 'likert' | 'radio' | 'text';
  options?: string[];
}

const sections: { title: string; questions: Question[] }[] = [
  {
    title: 'q_sectionA',
    questions: [
      { id: 'q1', text: 'q1', type: 'radio', options: ['18-24', '25-34', '35-44', '45-54', '55+'] },
      { id: 'q2', text: 'q2', type: 'radio', options: ['q_rarely', 'q_1to2', 'q_3to5', 'q_5plus'] },
      { id: 'q3', text: 'q3', type: 'likert' },
    ],
  },
  {
    title: 'q_sectionB',
    questions: [
      { id: 'q4', text: 'q4', type: 'likert' },
      { id: 'q5', text: 'q5', type: 'likert' },
      { id: 'q6', text: 'q6', type: 'likert' },
      { id: 'q7', text: 'q7', type: 'likert' },
      { id: 'q8', text: 'q8', type: 'likert' },
    ],
  },
  {
    title: 'q_sectionC',
    questions: [
      { id: 'q9', text: 'q9', type: 'likert' },
      { id: 'q10', text: 'q10', type: 'likert' },
      { id: 'q11', text: 'q11', type: 'likert' },
      { id: 'q12', text: 'q12', type: 'likert' },
    ],
  },
  {
    title: 'q_sectionD',
    questions: [
      { id: 'q13', text: 'q13', type: 'likert' },
      { id: 'q14', text: 'q14', type: 'likert' },
      { id: 'q15', text: 'q15', type: 'likert' },
    ],
  },
  {
    title: 'q_sectionE',
    questions: [
      { id: 'q16', text: 'q16', type: 'likert' },
      { id: 'q17', text: 'q17', type: 'likert' },
    ],
  },
  {
    title: 'q_sectionF',
    questions: [
      { id: 'q18', text: 'q18', type: 'likert' },
      { id: 'q19', text: 'q19', type: 'likert' },
      { id: 'q20', text: 'q20', type: 'likert' },
    ],
  },
  {
    title: 'q_sectionG',
    questions: [
      { id: 'q21', text: 'q21', type: 'likert' },
      { id: 'q22', text: 'q22', type: 'likert' },
      { id: 'q23', text: 'q23', type: 'likert' },
    ],
  },
  {
    title: 'q_sectionH',
    questions: [
      { id: 'q24', text: 'q24', type: 'text' },
      { id: 'q25', text: 'q25', type: 'text' },
      { id: 'q26', text: 'q26', type: 'text' },
    ],
  },
];

const LIKERT_KEYS = ['q_likert1', 'q_likert2', 'q_likert3', 'q_likert4', 'q_likert5'];

function generateSessionId(): string {
  return 's_' + Math.random().toString(36).substring(2) + Date.now().toString(36);
}

export function QuestionnaireScreen({ navigation }: Props) {
  const t = useTheme();
  const { t: tx } = useLang();
  const { user } = useAuth();
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const allQuestions = sections.flatMap((s) => s.questions);
  const answeredCount = allQuestions.filter((q) => answers[q.id]).length;
  const progress = allQuestions.length > 0 ? answeredCount / allQuestions.length : 0;

  const setAnswer = (qId: string, value: string) => {
    setAnswers((prev) => ({ ...prev, [qId]: value }));
  };

  const handleSubmit = async () => {
    const unanswered = allQuestions.filter((q) => !answers[q.id]);
    if (unanswered.length > 0) {
      Alert.alert(tx('q_incomplete'), tx('q_remaining') + ' (' + unanswered.length + ')');
      return;
    }
    setSubmitting(true);
    try {
      const sessionId = generateSessionId();
      const responses = Object.entries(answers).map(([questionId, answer]) => ({ questionId, answer }));
      await api.submitQuestionnaire({ sessionId, responses });
      setSubmitted(true);
    } catch (err: any) {
      Alert.alert(tx('error'), err.response?.data?.error || tx('q_failed'));
    } finally {
      setSubmitting(false);
    }
  };

  if (submitting) return <LoadingOverlay message={tx('q_submitting')} />;

  if (submitted) {
    return (
      <View style={[st.container, { backgroundColor: t.colors.background }]}>
        <View style={st.thankYou}>
          <Text style={st.thankIcon}>{'🎉'}</Text>
          <Text style={[st.thankTitle, { color: t.colors.primary }]}>{tx('q_thankyou')}</Text>
          <Text style={[st.thankText, { color: t.colors.onSurfaceVariant }]}>{tx('q_feedbackThanks')}</Text>
          <TouchableOpacity style={[st.doneBtn, { backgroundColor: t.colors.primary, borderRadius: t.radius.md }]} onPress={() => navigation.goBack()}>
            <Text style={st.doneBtnText}>{tx('q_done')}</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <View style={[st.container, { backgroundColor: t.colors.background }]}>
      <View style={[st.header, { backgroundColor: t.colors.surface, borderBottomColor: t.colors.outline, paddingHorizontal: t.spacing.lg, paddingTop: t.spacing['2xl'], paddingBottom: t.spacing.md }]}>
        <View style={st.headerRow}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Text style={{ fontSize: 18, color: t.colors.primary, paddingRight: 12 }}>{'←'}</Text>
          </TouchableOpacity>
          <Text style={[st.headerTitle, { fontWeight: '600', fontSize: 17, color: t.colors.onSurface }]}>{tx('q_title')}</Text>
        </View>
        <View style={[st.progressBar, { backgroundColor: t.colors.outline, borderRadius: 4, marginTop: 8 }]}>
          <View style={[st.progressFill, { backgroundColor: t.colors.primary, borderRadius: 4, width: `${progress * 100}%` }]} />
        </View>
        <Text style={{ color: t.colors.onSurfaceMuted, fontSize: 12, marginTop: 4 }}>{answeredCount} / {allQuestions.length}</Text>
      </View>

      <ScrollView style={st.scroll} showsVerticalScrollIndicator={false}>
        {sections.map((section) => (
          <View key={section.title} style={{ paddingHorizontal: t.spacing.lg, marginTop: t.spacing.xl }}>
            <Text style={[st.sectionTitle, { fontWeight: '600', fontSize: 15, color: t.colors.primary, marginBottom: t.spacing.md }]}>
              {tx(section.title)}
            </Text>
            {section.questions.map((q) => (
              <View key={q.id} style={[st.questionCard, { backgroundColor: t.colors.surface, borderColor: t.colors.outline, borderRadius: t.radius.md, borderWidth: 1, padding: t.spacing.md, marginBottom: t.spacing.sm }]}>
                <Text style={{ fontWeight: '500', fontSize: 14, color: t.colors.onSurface, marginBottom: 8 }}>{tx(q.text)}</Text>
                {q.type === 'likert' && (
                  <View style={st.likertRow}>
                    {LIKERT_KEYS.map((key, i) => (
                      <TouchableOpacity key={key} onPress={() => setAnswer(q.id, String(i + 1))}
                        style={[st.likertBtn, { backgroundColor: answers[q.id] === String(i + 1) ? t.colors.primary : t.colors.surfaceContainer, borderColor: t.colors.outline, borderRadius: t.radius.sm, borderWidth: 1 }]}>
                        <Text style={{ fontSize: 10, color: answers[q.id] === String(i + 1) ? '#FFF' : t.colors.onSurfaceVariant, textAlign: 'center' }}>
                          {tx(key)}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                )}
                {q.type === 'radio' && q.options && (
                  <View style={st.likertRow}>
                    {q.options.map((opt) => (
                      <TouchableOpacity key={opt} onPress={() => setAnswer(q.id, opt)}
                        style={[st.likertBtn, { backgroundColor: answers[q.id] === opt ? t.colors.primary : t.colors.surfaceContainer, borderColor: t.colors.outline, borderRadius: t.radius.sm, borderWidth: 1 }]}>
                        <Text style={{ fontSize: 11, color: answers[q.id] === opt ? '#FFF' : t.colors.onSurfaceVariant, textAlign: 'center' }}>
                          {tx(opt)}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                )}
                {q.type === 'text' && (
                  <TextInput
                    style={[st.textInput, { backgroundColor: t.colors.surfaceContainer, borderColor: t.colors.outline, borderRadius: t.radius.sm, borderWidth: 1, color: t.colors.onSurface }]}
                    placeholder={tx('q_placeholder')}
                    placeholderTextColor={t.colors.onSurfaceMuted}
                    multiline numberOfLines={3}
                    value={answers[q.id] || ''}
                    onChangeText={(v) => setAnswer(q.id, v)}
                  />
                )}
              </View>
            ))}
          </View>
        ))}
        <View style={{ paddingHorizontal: t.spacing.lg, marginTop: t.spacing.xl, marginBottom: 40 }}>
          <TouchableOpacity style={[st.submitBtn, { backgroundColor: t.colors.primary, borderRadius: t.radius.md }]} onPress={handleSubmit}>
            <Text style={{ color: '#FFF', fontWeight: '600', fontSize: 16 }}>{tx('submitFeedback')}</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}

const st = StyleSheet.create({
  container: { flex: 1 },
  header: { borderBottomWidth: 1 },
  headerRow: { flexDirection: 'row', alignItems: 'center' },
  headerTitle: {},
  progressBar: { height: 6, overflow: 'hidden' },
  progressFill: { height: 6 },
  scroll: { flex: 1 },
  sectionTitle: {},
  questionCard: {},
  likertRow: { flexDirection: 'row', gap: 4 },
  likertBtn: { flex: 1, paddingVertical: 8, alignItems: 'center', justifyContent: 'center' },
  textInput: { minHeight: 80, textAlignVertical: 'top', padding: 10, fontSize: 13 },
  submitBtn: { height: 48, justifyContent: 'center', alignItems: 'center' },
  thankYou: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 32 },
  thankIcon: { fontSize: 60, marginBottom: 16 },
  thankTitle: { fontSize: 24, fontWeight: '700', marginBottom: 8 },
  thankText: { fontSize: 15, textAlign: 'center', lineHeight: 22, marginBottom: 24 },
  doneBtn: { paddingHorizontal: 32, paddingVertical: 12 },
  doneBtnText: { color: '#FFF', fontWeight: '600', fontSize: 16 },
});
