import React, { useCallback, useState } from 'react';
import { View, Text, Image, ScrollView, StyleSheet, TouchableOpacity, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors, fonts, shadow } from '../theme/colors';
import { API_URL } from '../config';

export default function ProfileScreen({ navigation, route }) {
  const insets = useSafeAreaInsets();
  const userId = route?.params?.userId;
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchProfile = useCallback(async () => {
    if (!userId) {
      setError('ID akun tidak ditemukan. Silakan login kembali.');
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const [profileResponse, dashboardResponse, mapResponse] = await Promise.all([
        fetch(`${API_URL}/users/${userId}`),
        fetch(`${API_URL}/dashboard/${userId}`),
        fetch(`${API_URL}/map/${userId}`),
      ]);
      const [profileJson, dashboardJson, mapJson] = await Promise.all([
        profileResponse.json(),
        dashboardResponse.json(),
        mapResponse.json(),
      ]);

      if (!profileResponse.ok || !profileJson.success) {
        throw new Error(profileJson.message || 'Gagal mengambil data akun.');
      }
      if (!dashboardResponse.ok || !dashboardJson.success) {
        throw new Error(dashboardJson.message || 'Gagal mengambil statistik akun.');
      }
      if (!mapResponse.ok || !mapJson.success) {
        throw new Error(mapJson.message || 'Gagal mengambil progres level.');
      }

      setProfile({
        name: dashboardJson.user.name || profileJson.data.name,
        email: profileJson.data.email,
        totalXp: Number(dashboardJson.user.total_xp) || 0,
        streakCount: Number(dashboardJson.user.streak_count) || 0,
        completedLevels: mapJson.completedLevels.length,
        totalLevels: mapJson.levels.length,
        currentLevel: dashboardJson.current_level,
        currentProgress: Math.min(100, Math.max(0, Number(dashboardJson.current_level?.progress) || 0)),
      });
    } catch (fetchError) {
      console.error('Gagal mengambil data profil:', fetchError);
      setError(fetchError.message || 'Gagal mengambil data profil.');
    } finally {
      setLoading(false);
    }
  }, [userId]);

  useFocusEffect(
    useCallback(() => {
      fetchProfile();
    }, [fetchProfile])
  );

  const logout = () => navigation.getParent()?.reset({ index: 0, routes: [{ name: 'Welcome' }] });

  if (loading) {
    return (
      <View style={[s.container, s.centered, { paddingTop: insets.top }]}>
        <ActivityIndicator size="large" color={colors.teal} />
        <Text style={s.row}>Memuat profil...</Text>
      </View>
    );
  }

  if (error || !profile) {
    return (
      <View style={[s.container, s.centered, { padding: 20 }]}>
        <Text style={s.row}>{error || 'Data profil tidak tersedia.'}</Text>
        {userId ? (
          <TouchableOpacity style={s.btn} onPress={fetchProfile}>
            <Text style={s.btnText}>Coba lagi</Text>
          </TouchableOpacity>
        ) : null}
      </View>
    );
  }

  const achievements = [
    {
      title: 'Langkah Pertama',
      description: 'Selesaikan level pertamamu',
      unlocked: profile.completedLevels >= 1,
    },
    {
      title: 'Konsisten 3 Hari',
      description: 'Jaga streak selama 3 hari',
      unlocked: profile.streakCount >= 3,
    },
    {
      title: 'Pemburu XP',
      description: 'Kumpulkan 100 XP',
      unlocked: profile.totalXp >= 100,
    },
    {
      title: 'Penjelajah Jaringan',
      description: 'Selesaikan 3 level',
      unlocked: profile.completedLevels >= 3,
    },
    {
      title: 'Ahli Jaringan',
      description: 'Selesaikan semua level',
      unlocked: profile.totalLevels > 0 && profile.completedLevels >= profile.totalLevels,
    },
  ];
  const currentLevelName = profile.currentLevel?.name?.replace(/^Level\s+\d+:\s*/i, '');

  return (
    <ScrollView style={s.container} contentContainerStyle={{ padding: 20, paddingTop: insets.top + 24, alignItems: 'center' }}>
      <View style={s.avatar}>
        <Image source={require('../../assets/mascot/hijau-biasa.png')} style={{ width: 90, height: 80 }} resizeMode="contain" />
      </View>
      <Text style={s.name}>{profile.name}</Text>

      <View style={s.card}>
        <Text style={s.cardTitle}>Akun</Text>
        <Text style={s.row}>Email: {profile.email}</Text>
      </View>
      <View style={s.card}>
        <Text style={s.cardTitle}>Statistik</Text>
        <Text style={s.row}>Total XP: {profile.totalXp}</Text>
        <Text style={s.row}>Streak: {profile.streakCount} hari</Text>
        <Text style={s.row}>Level selesai: {profile.completedLevels} dari {profile.totalLevels}</Text>
      </View>
      <View style={s.card}>
        <Text style={s.cardTitle}>Progres belajar</Text>
        {profile.currentLevel ? (
          <>
            <Text style={s.progressTitle}>
              Level {profile.currentLevel.level_order}: {currentLevelName || 'Petualangan jaringan'}
            </Text>
            <View style={s.progressRow}>
              <View style={s.progressBackground}>
                <View style={[s.progressFill, { width: `${profile.currentProgress}%` }]} />
              </View>
              <Text style={s.progressPercent}>{profile.currentProgress}%</Text>
            </View>
          </>
        ) : (
          <Text style={s.row}>Semua level sudah selesai. Hebat!</Text>
        )}
      </View>
      <View style={s.card}>
        <Text style={s.cardTitle}>Pencapaian</Text>
        {achievements.map(achievement => (
          <View key={achievement.title} style={s.achievementRow}>
            <Ionicons
              name={achievement.unlocked ? 'trophy' : 'lock-closed'}
              size={22}
              color={achievement.unlocked ? colors.accent : colors.locked}
            />
            <View style={s.achievementText}>
              <Text style={s.achievementTitle}>{achievement.title}</Text>
              <Text style={s.achievementDescription}>{achievement.description}</Text>
            </View>
            <Text style={[s.achievementStatus, achievement.unlocked && s.unlockedStatus]}>
              {achievement.unlocked ? 'Didapat' : 'Terkunci'}
            </Text>
          </View>
        ))}
      </View>

      <TouchableOpacity style={s.btn} onPress={logout}>
        <Text style={s.btnText}>Keluar</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const s = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bg },
  centered: { justifyContent: 'center', alignItems: 'center' },
  avatar: { width: 128, height: 104, borderRadius: 28, backgroundColor: colors.green, alignItems: 'center', justifyContent: 'center', ...shadow },
  name: { fontFamily: fonts.bold, fontSize: 20, color: colors.ink, marginTop: 12, marginBottom: 18 },
  card: { alignSelf: 'stretch', backgroundColor: colors.pinkCard, borderRadius: 22, padding: 16, marginBottom: 14, ...shadow },
  cardTitle: { fontFamily: fonts.bold, fontSize: 15, color: colors.ink, marginBottom: 6 },
  row: { fontFamily: fonts.body, fontSize: 13, color: colors.ink, marginTop: 2 },
  progressTitle: { fontFamily: fonts.semi, fontSize: 13, color: colors.ink, marginTop: 4 },
  progressRow: { flexDirection: 'row', alignItems: 'center', marginTop: 10 },
  progressBackground: { flex: 1, height: 10, borderRadius: 5, backgroundColor: '#fff', overflow: 'hidden' },
  progressFill: { height: '100%', borderRadius: 5, backgroundColor: colors.teal },
  progressPercent: { width: 42, textAlign: 'right', fontFamily: fonts.semi, fontSize: 12, color: colors.ink },
  achievementRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: 9, borderTopWidth: 1, borderTopColor: 'rgba(26, 15, 46, 0.1)' },
  achievementText: { flex: 1, marginLeft: 10 },
  achievementTitle: { fontFamily: fonts.semi, fontSize: 12, color: colors.ink },
  achievementDescription: { fontFamily: fonts.body, fontSize: 10, color: colors.ink, opacity: 0.7 },
  achievementStatus: { fontFamily: fonts.semi, fontSize: 10, color: colors.muted, marginLeft: 6 },
  unlockedStatus: { color: colors.tealDark },
  btn: { backgroundColor: colors.ink, borderRadius: 16, paddingVertical: 12, paddingHorizontal: 34, marginTop: 6 },
  btnText: { color: '#fff', fontFamily: fonts.semi, fontSize: 13 },
});
