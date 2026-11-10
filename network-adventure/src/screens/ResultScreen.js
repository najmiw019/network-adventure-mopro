import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors, fonts, shadow } from '../theme/colors';
import { levels } from '../data/levels';

export default function ResultScreen({ route, navigation }) {
  const insets = useSafeAreaInsets();
  const { score = 0, total = 3, levelId = 1 } = route?.params || {};
  const level = levels.find(l => l.level_id === levelId) || levels[0];

  const percentage = Math.round((score / total) * 100);

  let recommendationText = 'Pertahankan semangatmu! Mari ulas kembali materi pada level ini agar semakin paham.';
  if (percentage === 100) {
    recommendationText = 'Luar biasa! Kamu menguasai materi ini dengan sempurna. Siap lanjut ke tantangan berikutnya!';
  } else if (percentage >= 70) {
    recommendationText = 'Hebat! Kamu sudah memahami sebagian besar konsep. Sedikit ulasan lagi akan membuatmu semakin mantap.';
  }

  return (
    <View style={[s.container, { paddingTop: insets.top + 16, paddingBottom: Math.max(insets.bottom, 16) }]}>
      
      {/* Tombol Home di Kiri Atas */}
      <View style={s.header}>
        <TouchableOpacity style={s.homeBtn} onPress={() => navigation.navigate('Main')}>
          <Ionicons name="home-outline" size={22} color={colors.ink} />
        </TouchableOpacity>
      </View>

      {/* Maskot / Ilustrasi Biru Wisuda (Sesuai aslimu) */}
      <View style={s.mascotContainer}>
        <Image 
          source={require('../../assets/mascot/biru-wisuda.png')} 
          style={s.mascotImage}
          resizeMode="contain"
        />
        <Text style={s.congratsSub}>You are great!</Text>
        <Text style={s.congratsTitle}>Good Job, Virgiani!</Text>
        <Text style={s.scoreDesc}>
          Langkahmu makin jauh. Sedikit ulasan akan membuatmu makin mantap.
        </Text>
      </View>

      {/* Bagian Card (Hasil Kuis & Rekomendasi Netto dibuat berdekatan) */}
      <View style={s.cardsWrapper}>
        {/* Kartu Ringkasan Putih (Skor) */}
        <View style={s.summaryCard}>
          <Text style={s.summaryTitle}>Hasil Kuis Level {level.level_order}</Text>
          <View style={s.scoreRow}>
            <Text style={s.scoreLabel}>Jawaban Benar:</Text>
            <Text style={s.scoreValue}>{score} / {total} ({percentage}%)</Text>
          </View>
        </View>

        {/* Rekomendasi Netto (Dibuat nempel/deket banget ke card atasnya) */}
        <View style={s.recommendationBox}>
          <Text style={s.rekomTitle}>Rekomendasi Netto</Text>
          <Text style={s.rekomText}>{recommendationText}</Text>
        </View>
      </View>

      {/* Tombol Bawah (Ulangi & Lanjut) */}
      <View style={s.footer}>
        <TouchableOpacity 
          style={s.btnOutline} 
          onPress={() => navigation.replace('Quiz', { levelId: level.level_id })}
        >
          <Text style={s.btnTextLight}>Ulangi</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={s.btnSolid} 
          onPress={() => navigation.navigate('Main')}
        >
          <Text style={s.btnTextLight}>Lanjut</Text>
        </TouchableOpacity>
      </View>

    </View>
  );
}

const s = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bg, paddingHorizontal: 20, justifyContent: 'space-between' },
  
  header: { flexDirection: 'row', alignItems: 'center' },
  homeBtn: { backgroundColor: '#fff', padding: 10, borderRadius: 14, ...shadow },

  mascotContainer: { alignItems: 'center', marginVertical: 2 },
  mascotImage: { width: 140, height: 130, marginBottom: 4 },
  congratsSub: { fontFamily: fonts.bold, fontSize: 13, color: '#9C27B0', letterSpacing: 0.5 },
  congratsTitle: { fontFamily: fonts.bold, fontSize: 22, color: colors.ink, marginTop: 2 },
  scoreDesc: { fontFamily: fonts.body, fontSize: 11.5, color: colors.ink, textAlign: 'center', opacity: 0.75, marginTop: 2, paddingHorizontal: 10, lineHeight: 16 },

  cardsWrapper: { marginVertical: -4 },

  summaryCard: { backgroundColor: '#fff', borderRadius: 24, padding: 14, marginBottom: 6, ...shadow },
  summaryTitle: { fontFamily: fonts.bold, fontSize: 13, color: colors.ink, marginBottom: 6 },
  scoreRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  scoreLabel: { fontFamily: fonts.body, fontSize: 12, color: colors.ink, opacity: 0.7 },
  scoreValue: { fontFamily: fonts.bold, fontSize: 14, color: colors.done },

  recommendationBox: { backgroundColor: colors.sand, borderRadius: 20, padding: 14, ...shadow },
  rekomTitle: { fontFamily: fonts.bold, fontSize: 12, color: colors.ink, marginBottom: 4 },
  rekomText: { fontFamily: fonts.body, fontSize: 11, color: colors.ink, lineHeight: 15, opacity: 0.85 },

  footer: { flexDirection: 'row', gap: 12, paddingTop: 4, paddingBottom: 4 },
  btnOutline: { flex: 1, backgroundColor: colors.ink, borderRadius: 18, paddingVertical: 14, alignItems: 'center', ...shadow },
  btnSolid: { flex: 1, backgroundColor: colors.ink, borderRadius: 18, paddingVertical: 14, alignItems: 'center', ...shadow },
  btnTextLight: { fontFamily: fonts.semi, fontSize: 13, color: '#fff' },
});