import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, Image, StyleSheet, TouchableOpacity, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors, fonts, shadow } from '../theme/colors';
import { API_URL } from '../config';

export default function DashboardScreen({ navigation, route }) {
  const insets = useSafeAreaInsets();
  const currentUserId = route?.params?.userId;

  const [loading, setLoading] = useState(true);
  const [userData, setUserData] = useState(null);
  const [currentLevel, setCurrentLevel] = useState(null);
  const [recommendation, setRecommendation] = useState(null);


  useEffect(() => {
    if (!currentUserId) {
      setLoading(false);
      return;
    }
    fetchDashboardData();
  }, [currentUserId]);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_URL}/dashboard/${currentUserId}`);
      const json = await response.json();
      
      if (json.success) {
        setUserData(json.user);
        setCurrentLevel(json.current_level);
        setRecommendation(json.recommendation);
      }
    } catch (error) {
      console.error("Gagal mengambil data dashboard:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <View style={[s.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <ActivityIndicator size="large" color={colors.teal} />
        <Text style={[s.small, { marginTop: 10 }]}>Memuat data akun...</Text>
      </View>
    );
  }

  if (!currentUserId) {
    return (
      <View style={[s.container, { justifyContent: 'center', alignItems: 'center', padding: 20 }]}>
        <Text style={s.small}>Data akun tidak ditemukan. Silakan login kembali.</Text>
      </View>
    );
  }

  const xpLevel = Math.floor((userData?.total_xp || 0) / 100) + 1;
  const currentProgress = currentLevel?.progress || 0;

  return (
    <ScrollView 
      style={s.container} 
      contentContainerStyle={{ padding: 20, paddingTop: Math.max(insets.top + 16, 36), paddingBottom: 35 }}
      showsVerticalScrollIndicator={false}
    >
      <Text style={s.hello}>Halo, {userData?.name || 'Explorer'}!</Text>

      <TouchableOpacity activeOpacity={0.9} style={s.hero} onPress={() => navigation.navigate('Map')}>
        <View style={s.badge}>
          <Ionicons name="flash" size={14} color={colors.yellow} />
          <Text style={s.badgeText}>Level {xpLevel}</Text>
        </View>
        <Text style={s.heroTitle}>Siap lanjutkan misi hari ini?</Text>
        <Text style={s.heroText}>Netto sudah menyiapkan{'\n'}materi singkat untukmu.</Text>
        <Image source={require('../../assets/mascot/hijau-hai.png')} style={s.heroMascot} resizeMode="contain" />
      </TouchableOpacity>

      {/* Progres belajar */}
      <Text style={s.section}>Progres Belajar</Text>
      {currentLevel ? (
        <View style={[s.pink, { flexDirection: 'row' }]}>
          <View style={s.thumb}>
            <Ionicons name="git-network-outline" size={44} color={colors.teal} />
          </View>
          <View style={{ flex: 1, marginLeft: 14 }}>
            <Text style={s.lessonTitle} numberOfLines={2}>Level {currentLevel.level_order}: {currentLevel.name}</Text>
            
            {/* Menampilkan deskripsi yang ditarik langsung dari database MySQL */}
            <Text style={s.small} numberOfLines={2}>
              {currentLevel.description || 'Materi pembelajaran jaringan komputer.'}
            </Text>

            <View style={s.barRow}>
              <View style={s.barBg}>
                <View style={[s.barFill, { width: `${currentProgress}%` }]} />
              </View>
              <Text style={s.pct}>{currentProgress}%</Text>
            </View>
            <TouchableOpacity 
              style={s.btn} 
              onPress={() => navigation.navigate('MissionBriefing', { levelId: currentLevel.level_id })}
              activeOpacity={0.8}
            >
              <Text style={s.btnText}>
                {currentProgress === 0 ? 'Mulai Belajar' : 'Lanjutkan belajar'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      ) : (
        <View style={[s.pink, { padding: 20, alignItems: 'center' }]}>
          <Text style={s.lessonTitle}>Semua level telah selesai!</Text>
          <Text style={s.small}>Hebat! Kamu telah menamatkan seluruh materi.</Text>
        </View>
      )}

      {/* Streak & XP */}
      <View style={s.statRow}>
        <View style={[s.pink, s.stat]}>
          <Ionicons name="flame" size={34} color="#E5473B" />
          <View style={{ marginLeft: 8, flexShrink: 1 }}>
            <Text style={s.statValue}>{userData?.streak_count || 0} hari</Text>
            <Text style={s.statLabel}>Streak</Text>
          </View>
        </View>
        <View style={[s.pink, s.stat]}>
          <Ionicons name="flash" size={34} color="#F2C230" />
          <View style={{ marginLeft: 8, flexShrink: 1 }}>
            <Text style={s.statValue}>{userData?.total_xp || 0} XP</Text>
            <Text style={s.statLabel}>Total XP</Text>
          </View>
        </View>
      </View>

      {/* Tantangan Harian */}
      <TouchableOpacity 
        style={[s.pink, { marginTop: 14, flexDirection: 'row', alignItems: 'center' }]} 
        activeOpacity={0.9}
        onPress={() => {}}
      >
        <View style={s.challengeIcon}>
          <Ionicons name="today-outline" size={26} color={colors.teal} />
        </View>
        <View style={{ flex: 1, marginLeft: 12 }}>
          <Text style={s.recHead}>Tantangan Hari Ini</Text>
          <Text style={s.lessonTitle}>Kuis Kilat 3 Menit</Text>
          <Text style={s.small}>Pertahankan streak dan raih +20 XP tambahan!</Text>
        </View>
        <Ionicons name="chevron-forward" size={20} color={colors.ink} />
      </TouchableOpacity>

      {/* Quick Flashcard Review */}
      <TouchableOpacity 
        style={[s.pink, { marginTop: 14, flexDirection: 'row', alignItems: 'center' }]} 
        activeOpacity={0.9}
        onPress={() => {}}
      >
        <View style={s.challengeIcon}>
          <Ionicons name="albums-outline" size={26} color="#E5473B" />
        </View>
        <View style={{ flex: 1, marginLeft: 12 }}>
          <Text style={s.recHead}>Flashcard Pintar</Text>
          <Text style={s.lessonTitle}>Review Istilah Tertunda</Text>
          <Text style={s.small}>Perkuat memori konsep dasar yang perlu diulas.</Text>
        </View>
        <Ionicons name="chevron-forward" size={20} color={colors.ink} />
      </TouchableOpacity>

      {/* Rekomendasi Netto */}
      {recommendation && (
        <View style={[s.pink, { marginTop: 14 }]}>
          <Text style={s.recHead}>Rekomendasi Netto</Text>
          <Text style={s.lessonTitle}>{recommendation.title}</Text>
          <Text style={s.small}>{recommendation.reason}</Text>
        </View>
      )}
    </ScrollView>
  );
}

const s = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bg },
  hello: { fontFamily: fonts.bold, fontSize: 20, color: colors.ink, marginBottom: 14 },
  hero: { backgroundColor: colors.green, borderRadius: 24, padding: 18, minHeight: 190, overflow: 'hidden', ...shadow },
  badge: { flexDirection: 'row', alignItems: 'center', alignSelf: 'flex-start', backgroundColor: 'rgba(255,255,255,0.22)', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 14 },
  badgeText: { fontFamily: fonts.semi, color: '#fff', fontSize: 12, marginLeft: 4 },
  heroTitle: { fontFamily: fonts.bold, color: '#fff', fontSize: 22, lineHeight: 28, marginTop: 12, maxWidth: 250 },
  heroText: { fontFamily: fonts.body, color: '#fff', fontSize: 13, marginTop: 8, maxWidth: 170 },
  heroMascot: { position: 'absolute', right: 6, bottom: 6, width: 130, height: 110 },
  section: { fontFamily: fonts.bold, fontSize: 18, color: colors.ink, marginTop: 20, marginBottom: 10 },
  pink: { backgroundColor: colors.pinkCard, borderRadius: 22, padding: 14, ...shadow },
  thumb: { width: 100, backgroundColor: '#fff', borderRadius: 18, alignItems: 'center', justifyContent: 'center', minHeight: 150 },
  lessonTitle: { fontFamily: fonts.bold, fontSize: 16, color: colors.ink, lineHeight: 22 },
  small: { fontFamily: fonts.body, fontSize: 11, color: colors.ink, marginTop: 4, opacity: 0.85 },
  barRow: { flexDirection: 'row', alignItems: 'center', marginTop: 10 },
  barBg: { flex: 1, height: 8, backgroundColor: '#fff', borderRadius: 4, overflow: 'hidden' },
  barFill: { height: 8, backgroundColor: colors.done },
  pct: { fontFamily: fonts.body, fontSize: 10, marginLeft: 6, color: colors.ink },
  btn: { backgroundColor: colors.ink, borderRadius: 14, paddingVertical: 9, paddingHorizontal: 14, alignSelf: 'flex-end', marginTop: 12 },
  btnText: { color: '#fff', fontFamily: fonts.semi, fontSize: 12 },
  statRow: { flexDirection: 'row', gap: 14, marginTop: 14 },
  stat: { flex: 1, flexDirection: 'row', alignItems: 'center', paddingVertical: 12 },
  statValue: { fontFamily: fonts.bold, fontSize: 15, color: colors.ink },
  statLabel: { fontFamily: fonts.body, fontSize: 11, color: colors.ink, opacity: 0.8 },
  recHead: { fontFamily: fonts.semi, fontSize: 12, color: colors.ink, opacity: 0.7, marginBottom: 4 },
  challengeIcon: { width: 48, height: 48, backgroundColor: '#fff', borderRadius: 14, alignItems: 'center', justifyContent: 'center' },
});