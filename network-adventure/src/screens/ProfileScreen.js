import React from 'react';
import { View, Text, Image, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors, fonts, shadow } from '../theme/colors';
import { user } from '../data/user';
import { levels } from '../data/levels';

export default function ProfileScreen({ navigation }) {
  const insets = useSafeAreaInsets();
  const logout = () => navigation.getParent()?.reset({ index: 0, routes: [{ name: 'Welcome' }] });
  return (
    <ScrollView style={s.container} contentContainerStyle={{ padding: 20, paddingTop: insets.top + 24, alignItems: 'center' }}>
      <View style={s.avatar}>
        <Image source={require('../../assets/mascot/hijau-biasa.png')} style={{ width: 90, height: 80 }} resizeMode="contain" />
      </View>
      <Text style={s.name}>{user.name}</Text>

      <View style={s.card}>
        <Text style={s.cardTitle}>Akun</Text>
        <Text style={s.row}>Email: {user.email}</Text>
      </View>
      <View style={s.card}>
        <Text style={s.cardTitle}>Statistik</Text>
        <Text style={s.row}>Total XP: {user.total_xp}</Text>
        <Text style={s.row}>Streak: {user.streak_count} hari</Text>
        <Text style={s.row}>Level selesai: {user.completedLevels.length} dari {levels.length}</Text>
      </View>
      <View style={s.card}>
        <Text style={s.cardTitle}>Pencapaian</Text>
        <Text style={s.row}>Segera hadir</Text>
      </View>

      <TouchableOpacity style={s.btn} onPress={logout}>
        <Text style={s.btnText}>Keluar</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const s = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bg },
  avatar: { width: 128, height: 104, borderRadius: 28, backgroundColor: colors.green, alignItems: 'center', justifyContent: 'center', ...shadow },
  name: { fontFamily: fonts.bold, fontSize: 20, color: colors.ink, marginTop: 12, marginBottom: 18 },
  card: { alignSelf: 'stretch', backgroundColor: colors.pinkCard, borderRadius: 22, padding: 16, marginBottom: 14, ...shadow },
  cardTitle: { fontFamily: fonts.bold, fontSize: 15, color: colors.ink, marginBottom: 6 },
  row: { fontFamily: fonts.body, fontSize: 13, color: colors.ink, marginTop: 2 },
  btn: { backgroundColor: colors.ink, borderRadius: 16, paddingVertical: 12, paddingHorizontal: 34, marginTop: 6 },
  btnText: { color: '#fff', fontFamily: fonts.semi, fontSize: 13 },
});
