import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, TextInput, StyleSheet, Alert } from 'react-native';
import { useTheme } from '../theme';
import { useAuth } from '../contexts/AuthContext';
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
    title: 'A: Demographic Information',
    questions: [
      { id: 'q1', text: 'What is your age group?', type: 'radio', options: ['18-24', '25-34', '35-44', '45-54', '55+'] },
      { id: 'q2', text: 'How often do you travel?', type: 'radio', options: ['Rarely', '1-2 times/year', '3-5 times/year', 'More than 5 times/year'] },
      { id: 'q3', text: 'How comfortable are you with travel apps?', type: 'likert' },
    ],
  },
  {
    title: 'B: Ease of Navigation',
    questions: [
      { id: 'q4', text: 'The app layout was clear and easy to understand', type: 'likert' },
      { id: 'q5', text: 'I could easily find the search and filter functions', type: 'likert' },
      { id: 'q6', text: 'Navigating between tabs felt natural and intuitive', type: 'likert' },
      { id: 'q7', text: 'The bottom tab bar was easy to use', type: 'likert' },
      { id: 'q8', text: 'I never felt lost or confused about where I was in the app', type: 'likert' },
    ],
  },
  {
    title: 'C: Map Interactivity',
    questions: [
      { id: 'q9', text: 'The map view was responsive and easy to explore', type: 'likert' },
      { id: 'q10', text: 'Map pins clearly showed points of interest', type: 'likert' },
      { id: 'q11', text: 'Tapping a pin showed useful information in the bottom sheet', type: 'likert' },
      { id: 'q12', text: 'The route planning visualization was helpful', type: 'likert' },
    ],
  },
  {
    title: 'D: Login & Account Setup',
    questions: [
      { id: 'q13', text: 'The login/registration process was straightforward', type: 'likert' },
      { id: 'q14', text: 'I liked having the guest mode option to skip login', type: 'likert' },
      { id: 'q15', text: 'Setting up my travel preferences was easy', type: 'likert' },
    ],
  },
  {
    title: 'E: Personalized Recommendations',
    questions: [
      { id: 'q16', text: 'The recommended destinations matched my interests', type: 'likert' },
      { id: 'q17', text: 'The category filters (Beach, Mountain, City Break) were useful', type: 'likert' },
    ],
  },
  {
    title: 'F: Itinerary Management',
    questions: [
      { id: 'q18', text: 'The timeline view made the itinerary easy to follow', type: 'likert' },
      { id: 'q19', text: 'Status tags (Confirmed, Action Required) were clear and helpful', type: 'likert' },
      { id: 'q20', text: 'Adding activities to an itinerary was intuitive', type: 'likert' },
    ],
  },
  {
    title: 'G: Overall Satisfaction',
    questions: [
      { id: 'q21', text: 'Overall, I am satisfied with the TripVoyage app', type: 'likert' },
      { id: 'q22', text: 'I would recommend TripVoyage to other travelers', type: 'likert' },
      { id: 'q23', text: 'The visual design of the app is appealing', type: 'likert' },
    ],
  },
  {
    title: 'H: Open-Ended Feedback',
    questions: [
      { id: 'q24', text: 'What was the most useful feature?', type: 'text' },
      { id: 'q25', text: 'What was the most confusing or frustrating part?', type: 'text' },
      { id: 'q26', text: 'Any suggestions for improvement?', type: 'text' },
    ],
  },
];

const likertLabels = ['1 - Strongly Disagree', '2 - Disagree', '3 - Neutral', '4 - Agree', '5 - Strongly Agree'];

function generateSessionId(): string {
  return 's_' + Math.random().toString(36).substring(2) + Date.now().toString(36);
}

export function QuestionnaireScreen({ navigation }: Props) {
  const t = useTheme();
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
      Alert.alert('Incomplete', `Please answer all questions (${unanswered.length} remaining)`);
      return;
    }

    setSubmitting(true);
    try {
      const sessionId = generateSessionId();
      const responses = Object.entries(answers).map(([questionId, answer]) => ({
        questionId,
        answer,
      }));
      await api.submitQuestionnaire({ sessionId, responses });
      setSubmitted(true);
    } catch (err: any) {
      Alert.alert('Error', err.response?.data?.error || 'Failed to submit. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  if (submitting) return <LoadingOverlay message="Submitting responses..." />;

  if (submitted) {
    return (
      <View style={[st.container, { backgroundColor: t.colors.background }]}>
        <View style={st.thankYou}>
          <Text style={st.thankIcon}>{'🎉'}</Text>
          <Text style={[st.thankTitle, { color: t.colors.primary }]}>Thank You!</Text>
          <Text style={[st.thankText, { color: t.colors.onSurfaceVariant }]}>
            Your feedback helps us improve TripVoyage for everyone.
          </Text>
          <TouchableOpacity
            style={[st.doneBtn, { backgroundColor: t.colors.primary, borderRadius: t.radius.md }]}
            onPress={() => navigation.goBack()}
          >
            <Text style={st.doneBtnText}>Done</Text>
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
            <Text style={[st.backBtn, { color: t.colors.primary }]}>{'← Back'}</Text>
          </TouchableOpacity>
          <Text style={[st.headerTitle, { color: t.colors.onSurface, fontWeight: '600', fontSize: t.typography.bodyLg.fontSize }]}>
            User Testing Survey
          </Text>
          <View style={{ width: 50 }} />
        </View>
      </View>

      <View style={[st.progressBar, { backgroundColor: t.colors.outlineVariant }]}>
        <View style={[st.progressFill, { backgroundColor: t.colors.primary, width: `${progress * 100}%` }]} />
      </View>
      <Text style={[st.progressText, { color: t.colors.onSurfaceMuted }]}>
        {answeredCount} of {allQuestions.length} answered ({Math.round(progress * 100)}%)
      </Text>

      <ScrollView style={st.scroll} showsVerticalScrollIndicator={false}>
        {sections.map((section) => (
          <View key={section.title} style={[st.section, { paddingHorizontal: t.spacing.lg }]}>
            <Text style={[st.sectionTitle, { color: t.colors.primary, fontWeight: '600', fontSize: t.typography.title.fontSize }]}>
              {section.title}
            </Text>
            {section.questions.map((q) => (
              <View key={q.id} style={[st.questionBlock, { backgroundColor: t.colors.surface, borderColor: t.colors.outline, borderRadius: t.radius.md, padding: t.spacing.lg }]}>
                <Text style={[st.questionText, { color: t.colors.onSurface, fontWeight: '600', fontSize: t.typography.body.fontSize }]}>
                  {q.id.toUpperCase()}. {q.text}
                </Text>

                {q.type === 'likert' && (
                  <View style={st.likertRow}>
                    {[1, 2, 3, 4, 5].map((val) => (
                      <TouchableOpacity
                        key={val}
                        onPress={() => setAnswer(q.id, String(val))}
                        style={[
                          st.likertBtn,
                          {
                            backgroundColor: answers[q.id] === String(val) ? t.colors.primary : t.colors.surfaceContainer,
                            borderRadius: t.radius.sm,
                          },
                        ]}
                      >
                        <Text style={[st.likertNum, { color: answers[q.id] === String(val) ? '#FFFFFF' : t.colors.onSurfaceVariant, fontWeight: '600' }]}>
                          {val}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                )}

                {q.type === 'radio' && q.options && (
                  <View style={st.radioGroup}>
                    {q.options.map((opt) => (
                      <TouchableOpacity
                        key={opt}
                        onPress={() => setAnswer(q.id, opt)}
                        style={[
                          st.radioBtn,
                          {
                            backgroundColor: answers[q.id] === opt ? t.colors.primaryContainer : t.colors.surfaceContainer,
                            borderColor: answers[q.id] === opt ? t.colors.primary : t.colors.outline,
                            borderRadius: t.radius.sm,
                          },
                        ]}
                      >
                        <Text style={[st.radioText, { color: answers[q.id] === opt ? t.colors.onPrimaryContainer : t.colors.onSurfaceVariant }]}>
                          {opt}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                )}

                {q.type === 'text' && (
                  <TextInput
                    style={[st.textInput, { backgroundColor: t.colors.surfaceContainer, borderColor: t.colors.outline, borderRadius: t.radius.sm, color: t.colors.onSurface }]}
                    placeholder="Type your answer here..."
                    placeholderTextColor={t.colors.onSurfaceMuted}
                    value={answers[q.id] || ''}
                    onChangeText={(val) => setAnswer(q.id, val)}
                    multiline
                    numberOfLines={3}
                  />
                )}
              </View>
            ))}
          </View>
        ))}

        <View style={{ paddingHorizontal: t.spacing.lg, marginTop: t.spacing.xl, marginBottom: t.spacing['4xl'] }}>
          <TouchableOpacity
            style={[st.submitBtn, { backgroundColor: t.colors.primary, borderRadius: t.radius.md }]}
            onPress={handleSubmit}
            activeOpacity={0.8}
          >
            <Text style={st.submitText}>Submit Feedback</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}

const st = StyleSheet.create({
  container: { flex: 1 },
  header: { borderBottomWidth: 1 },
  headerRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  backBtn: { fontSize: 16 },
  headerTitle: {},
  progressBar: { height: 4, width: '100%' },
  progressFill: { height: 4 },
  progressText: { textAlign: 'center', fontSize: 12, marginTop: 4, marginBottom: 8 },
  scroll: { flex: 1 },
  section: { marginTop: 20 },
  sectionTitle: { marginBottom: 12 },
  questionBlock: { marginBottom: 12, borderWidth: 1 },
  questionText: { marginBottom: 12 },
  likertRow: { flexDirection: 'row', justifyContent: 'space-between', gap: 8 },
  likertBtn: { width: 48, height: 40, justifyContent: 'center', alignItems: 'center' },
  likertNum: { fontSize: 16 },
  radioGroup: { gap: 8 },
  radioBtn: { paddingVertical: 10, paddingHorizontal: 14, borderWidth: 1.5 },
  radioText: { fontSize: 14, fontWeight: '500' },
  textInput: { borderWidth: 1, padding: 12, fontSize: 15, minHeight: 80, textAlignVertical: 'top' },
  submitBtn: { height: 50, justifyContent: 'center', alignItems: 'center' },
  submitText: { color: '#FFFFFF', fontSize: 16, fontWeight: '700' },
  thankYou: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 32 },
  thankIcon: { fontSize: 64, marginBottom: 16 },
  thankTitle: { fontSize: 28, fontWeight: '700', marginBottom: 12 },
  thankText: { fontSize: 16, textAlign: 'center', lineHeight: 24, marginBottom: 32 },
  doneBtn: { paddingHorizontal: 40, paddingVertical: 14 },
  doneBtnText: { color: '#FFFFFF', fontSize: 16, fontWeight: '600' },
});
