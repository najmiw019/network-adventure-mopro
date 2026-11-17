import React, { useCallback, useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors, fonts, shadow } from '../theme/colors';
import { levels } from '../data/levels';
import { API_URL } from '../config';

export default function ResultScreen({ route, navigation }) {
  const insets = useSafeAreaInsets();
  const { score = 0, total = 3, levelId = 1, userId } = route?.params || {};
  const level = levels.find(l => l.level_id === levelId) || levels[0];

  const percentage = total > 0 ? Math.round((score / total) * 100) : 0;
  const [savingProgress, setSavingProgress] = useState(false);
  const [progressSaved, setProgressSaved] = useState(false);
  const [progressError, setProgressError] = useState(null);
  const [reward, setReward] = useState(null);
  const [userName, setUserName] = useState('');

  useEffect(() => {
    if (!userId) return undefined;

    let active = true;
    const fetchUserName = async () => {
      try {
        const response = await fetch(`${API_URL}/users/${userId}`);
        const json = await response.json();
        if (!response.ok || !json.success || !json.data?.name) {
          throw new Error(json.message || 'Gagal mengambil nama akun.');
        }
        if (active) setUserName(json.data.name);
      } catch (error) {
        console.error('Gagal mengambil nama akun:', error);
      }
    };

    fetchUserName();
    return () => {
      active = false;
    };
  }, [userId]);

  const saveProgress = useCallback(async () => {
    if (!userId) {
      setProgressError('ID akun tidak ditemukan. Silakan login kembali.');
      return;
    }

    setSavingProgress(true);
    setProgressError(null);
    try {
      const response = await fetch(`${API_URL}/map/${userId}/complete`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ levelId: level.level_id, score, total }),
      });
      const json = await response.json();

      if (!response.ok || !json.success) {
        throw new Error(json.message || 'Gagal menyimpan progres level.');
      }
      setReward(json.data);
      setProgressSaved(true);
    } catch (error) {
      console.error('Gagal menyimpan progres level:', error);
      setProgressError(error.message || 'Tidak dapat terhubung ke server.');
    } finally {
      setSavingProgress(false);
    }
  }, [level.level_id, percentage, userId]);

  useEffect(() => {
    if (percentage >= 60) {
      saveProgress();
    }
  }, [percentage, saveProgress]);

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
        <TouchableOpacity style={s.homeBtn} onPress={() => navigation.navigate('Main', { userId })}>
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
        <Text style={s.congratsTitle}>Good Job, {userName || 'Explorer'}!</Text>
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
        {percentage >= 60 && (
        <View style={s.rewardCard}>
          <View style={s.rewardHeader}>
            <Text style={s.rewardTitle}>Hadiah Petualangan</Text>
          </View>

          {savingProgress ? (
            <Text style={s.progressStatus}>Menyimpan progres dan hadiah...</Text>
          ) : progressError ? (
            <Text style={[s.progressStatus, { color: '#E5473B' }]}>{progressError}</Text>
          ) : reward ? (
            <>
              <View style={s.scoreRow}>
                <Text style={s.scoreLabel}>XP didapat:</Text>
                <Text style={s.scoreValue}>
                  {reward.xpGained > 0 ? `+${reward.xpGained} XP` : 'Sudah selesai'}
                </Text>
              </View>
              <View style={[s.scoreRow, { marginTop: 6 }]}>
                <Text style={s.scoreLabel}>Streak:</Text>
                <Text style={s.scoreValue}>
                  {reward.streakCount} hari{reward.streakIncreased ? ' (+1)' : ''}
                </Text>
              </View>
            </>
          ) : null}
        </View>
      )}
      </View>

      {/* Tombol Bawah (Ulangi & Lanjut) */}
      <View style={s.footer}>
        <TouchableOpacity 
          style={s.btnOutline} 
          onPress={() => navigation.replace('Quiz', { levelId: level.level_id, userId })}
        >
          <Text style={s.btnTextLight}>Ulangi</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={[s.btnSolid, savingProgress && { opacity: 0.6 }]}
          disabled={savingProgress}
          onPress={() => {
            if (percentage >= 60 && !progressSaved) {
              saveProgress();
              return;
            }
            navigation.navigate('Main', {
              userId,
              screen: 'Map',
              params: { userId },
            });
          }}
        >
          <Text style={s.btnTextLight}>
            {savingProgress
              ? 'Menyimpan...'
              : percentage >= 60 && !progressSaved
                ? 'Coba simpan'
                : 'Lanjut ke Peta'}
          </Text>
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
  rewardCard: { backgroundColor: '#fff', borderRadius: 24, padding: 14, marginTop: 6, ...shadow },
  rewardHeader: { flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 6 },
  rewardTitle: { fontFamily: fonts.bold, fontSize: 13, color: colors.ink },
  progressStatus: { fontFamily: fonts.body, fontSize: 12, color: colors.ink, opacity: 0.7 },

  footer: { flexDirection: 'row', gap: 12, paddingTop: 4, paddingBottom: 4 },
  btnOutline: { flex: 1, backgroundColor: colors.ink, borderRadius: 18, paddingVertical: 14, alignItems: 'center', ...shadow },
  btnSolid: { flex: 1, backgroundColor: colors.ink, borderRadius: 18, paddingVertical: 14, alignItems: 'center', ...shadow },
  btnTextLight: { fontFamily: fonts.semi, fontSize: 13, color: '#fff' },
});