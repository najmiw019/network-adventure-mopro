import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import BackButton from '../components/BackButton';
import { colors, fonts, shadow } from '../theme/colors';
import { levels } from '../data/levels';
import { quizzes } from '../data/quizzes';

export default function QuizScreen({ route, navigation }) {
  const insets = useSafeAreaInsets();
  const levelId = route?.params?.levelId || 1;
  const level = levels.find(l => l.level_id === levelId) || levels[0];

  const questions = (quizzes[levelId] || []).slice(0, 3);

  const [currentQ, setCurrentQ] = useState(0);
  const [selectedOpt, setSelectedOpt] = useState(null);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [score, setScore] = useState(0);

  if (!questions || questions.length === 0) {
    return (
      <View style={[s.container, { paddingTop: insets.top + 16, justifyContent: 'center', alignItems: 'center' }]}>
        <Text style={{ fontFamily: fonts.bold, fontSize: 16, color: colors.ink }}>Soal kuis untuk level ini belum tersedia.</Text>
        <TouchableOpacity style={[s.btnMain, { marginTop: 20, width: '100%' }]} onPress={() => navigation.goBack()}>
          <Text style={s.btnText}>Kembali</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const q = questions[currentQ];
  const progressPct = Math.round(((currentQ + 1) / questions.length) * 100);
  const isLastQuestion = currentQ === questions.length - 1;

  const handleCheck = () => {
    if (selectedOpt === null) return;
    setIsSubmitted(true);
    let newScore = score;
    if (selectedOpt === q.correctIndex) {
      newScore = score + 1;
      setScore(newScore);
    }
  };

  const handleNext = () => {
    if (!isLastQuestion) {
      setIsSubmitted(false);
      setSelectedOpt(null);
      setCurrentQ(currentQ + 1);
    } else {
      navigation.replace('ResultScreen', { 
        score: score, 
        total: questions.length, 
        levelId: level.level_id 
      });
    }
  };

  const isCorrect = selectedOpt === q.correctIndex;

  return (
    <View style={[s.container, { paddingTop: insets.top + 16 }]}>
      {/* Header & Progress */}
      <View style={s.header}>
        <BackButton onPress={() => navigation.goBack()} />
        <Text style={s.headerTitle}>Kuis Kilat Level {level.level_order}</Text>
      </View>

      <Text style={s.counterText}>Pertanyaan {currentQ + 1} dari {questions.length}</Text>
      <View style={s.progressRow}>
        <View style={s.track}>
          <View style={[s.fill, { width: `${progressPct}%` }]} />
        </View>
        <Text style={s.pctText}>{progressPct}%</Text>
      </View>

      <ScrollView contentContainerStyle={{ paddingBottom: 30 }} showsVerticalScrollIndicator={false}>
        <Text style={s.questionText}>{q.question}</Text>
        <Text style={s.subInstruction}>Pilih satu jawaban yang paling tepat.</Text>

        {/* Pilihan Jawaban */}
        {q.options.map((opt, idx) => {
          let optStyle = s.optionCard;
          let textStyle = s.optionText;

          if (isSubmitted) {
            if (idx === q.correctIndex) {
              optStyle = [s.optionCard, s.optionCorrect];
              textStyle = [s.optionText, s.optionTextCorrect];
            } else if (idx === selectedOpt) {
              optStyle = [s.optionCard, s.optionWrong];
              textStyle = [s.optionText, s.optionTextWrong];
            }
          } else if (selectedOpt === idx) {
            optStyle = [s.optionCard, s.optionSelected];
          }

          return (
            <TouchableOpacity
              key={idx}
              style={optStyle}
              activeOpacity={0.85}
              disabled={isSubmitted}
              onPress={() => setSelectedOpt(idx)}
            >
              <Text style={textStyle}>{opt}</Text>
              {isSubmitted && idx === q.correctIndex && (
                <Ionicons name="checkmark-circle" size={20} color={colors.done} />
              )}
            </TouchableOpacity>
          );
        })}

        {/* Kotak Penjelasan / Pembahasan Muncul Setelah Dijawab */}
        {isSubmitted && (
          <View style={[s.explanationBox, isCorrect ? s.explCorrect : s.explWrong]}>
            <View style={s.explHeader}>
              <Ionicons 
                name={isCorrect ? "checkmark-circle-outline" : "alert-circle-outline"} 
                size={22} 
                color={isCorrect ? colors.done : '#E5473B'} 
              />
              <Text style={[s.explTitle, { color: isCorrect ? colors.done : '#E5473B' }]}>
                {isCorrect ? 'Jawaban Benar!' : 'Kurang Tepat'}
              </Text>
            </View>
            <Text style={s.explText}>
              {q.explanation || (isCorrect ? 'Keren sekali! Konsep ini sudah kamu kuasai dengan baik.' : 'Tetap semangat! Periksa kembali materi pada modul sebelumnya ya.')}
            </Text>
          </View>
        )}
      </ScrollView>

      {/* Tombol Periksa / Lanjut */}
      <View style={[s.footer, { paddingBottom: Math.max(insets.bottom, 20) }]}>
        {!isSubmitted ? (
          <TouchableOpacity 
            style={[s.btnMain, selectedOpt === null && { opacity: 0.5 }]} 
            disabled={selectedOpt === null}
            onPress={handleCheck}
          >
            <Text style={s.btnText}>Periksa jawaban</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity style={s.btnMain} onPress={handleNext}>
            <Text style={s.btnText}>
              {isLastQuestion ? 'Lihat Hasil Kuis' : 'Lanjutkan'}
            </Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}

const s = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bg, paddingHorizontal: 20 },
  header: { flexDirection: 'row', alignItems: 'center', marginBottom: 12 },
  headerTitle: { fontFamily: fonts.bold, fontSize: 16, color: colors.ink, marginLeft: 12 },
  
  counterText: { fontFamily: fonts.semi, fontSize: 12, color: colors.ink, marginBottom: 6 },
  progressRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 20 },
  track: { flex: 1, height: 8, backgroundColor: '#E0E0E0', borderRadius: 4, overflow: 'hidden' },
  fill: { height: 8, backgroundColor: colors.teal },
  pctText: { fontFamily: fonts.body, fontSize: 11, marginLeft: 10, color: colors.ink },

  questionText: { fontFamily: fonts.bold, fontSize: 20, color: colors.ink, lineHeight: 28, marginBottom: 6 },
  subInstruction: { fontFamily: fonts.body, fontSize: 12, color: colors.ink, opacity: 0.6, marginBottom: 20 },

  optionCard: { backgroundColor: colors.pinkCard, borderRadius: 16, padding: 16, marginBottom: 12, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', ...shadow },
  optionSelected: { borderWidth: 2, borderColor: colors.ink },
  optionCorrect: { backgroundColor: '#E1F5FE', borderWidth: 2, borderColor: colors.done },
  optionWrong: { backgroundColor: '#FFEBEE', borderWidth: 2, borderColor: '#E5473B' },

  optionText: { fontFamily: fonts.body, fontSize: 13, color: colors.ink, flex: 1, lineHeight: 18 },
  optionTextCorrect: { fontFamily: fonts.semi, color: colors.done },
  optionTextWrong: { fontFamily: fonts.semi, color: '#E5473B' },

  explanationBox: { borderRadius: 18, padding: 16, marginTop: 10, marginBottom: 10, ...shadow },
  explCorrect: { backgroundColor: '#E8F8F5', borderWidth: 1, borderColor: colors.done },
  explWrong: { backgroundColor: '#FDEDEC', borderWidth: 1, borderColor: '#E5473B' },
  explHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 6 },
  explTitle: { fontFamily: fonts.bold, fontSize: 13, marginLeft: 8 },
  explText: { fontFamily: fonts.body, fontSize: 12, color: colors.ink, lineHeight: 18 },

  footer: { paddingTop: 10 },
  btnMain: { backgroundColor: colors.ink, borderRadius: 18, paddingVertical: 16, alignItems: 'center', ...shadow },
  btnText: { color: '#fff', fontFamily: fonts.semi, fontSize: 14 },
});