import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import BackButton from '../components/BackButton';
import { colors, fonts, shadow } from '../theme/colors';
import { levels } from '../data/levels';

export default function MissionBriefingScreen({ route, navigation }) {
  const insets = useSafeAreaInsets();
  
  const levelId = route?.params?.levelId || 1;
  const level = levels.find(l => l.level_id === levelId) || levels[0];

  return (
    <View style={[s.container, { paddingTop: insets.top + 12 }]}>
      <BackButton onPress={() => navigation.goBack()} />
      
      <View style={s.body}>
        <View>
          {/* Badge Level & Kesulitan */}
          <View style={s.badgeRow}>
            <Text style={s.badge}>Level {level.level_order} · {level.difficulty}</Text>
            <View style={s.timeBadge}>
              <Ionicons name="time-outline" size={13} color={colors.primary} />
              <Text style={s.timeText}>3-5 Mnt</Text>
            </View>
          </View>

          <Text style={s.title}>{level.subtitle}</Text>
          
          {/* Kartu Utama Briefing */}
          <View style={s.card}>
            <Image source={require('../../assets/mascot/hijau-hai.png')} style={s.mascot} resizeMode="contain" />
            <Text style={s.text}>{level.briefing}</Text>
          </View>

          {/* Info Singkat Penemangat agar ruang tengah terisi dengan rapi */}
          <View style={s.infoBox}>
            <Ionicons name="sparkles" size={18} color={colors.teal} />
            <Text style={s.infoText}>
              Selesaikan materi interaktif dan kuis di level ini untuk mengumpulkan XP dan menjaga streak belajarmu!
            </Text>
          </View>
        </View>

        {/* Tombol Aksi */}
        <TouchableOpacity 
          style={s.btn} 
          onPress={() => navigation.navigate('MicroLesson', { levelId: level.level_id })}
          activeOpacity={0.85}
        >
          <Text style={s.btnText}>Start Learning</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const s = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bg, paddingHorizontal: 20 },
  body: { flex: 1, justifyContent: 'space-between', paddingBottom: 28, paddingTop: 6 },
  badgeRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 },
  badge: { fontFamily: fonts.semi, color: colors.primary, fontSize: 13 },
  timeBadge: { flexDirection: 'row', alignItems: 'center', backgroundColor: 'rgba(32,33,43,0.06)', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 10 },
  timeText: { fontFamily: fonts.semi, fontSize: 11, color: colors.primary, marginLeft: 4 },
  title: { fontFamily: fonts.bold, fontSize: 26, color: colors.ink, marginBottom: 16 },
  
  card: { backgroundColor: colors.pinkCard, borderRadius: 24, padding: 22, marginBottom: 16, ...shadow },
  mascot: { width: 90, height: 80, alignSelf: 'flex-end', marginBottom: 4 },
  text: { fontFamily: fonts.body, fontSize: 14, lineHeight: 22, color: colors.ink },

  infoBox: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#fff', borderRadius: 18, padding: 16, ...shadow },
  infoText: { fontFamily: fonts.body, fontSize: 12, color: colors.ink, marginLeft: 12, flex: 1, lineHeight: 18 },

  btn: { backgroundColor: colors.ink, padding: 16, borderRadius: 18, alignItems: 'center' },
  btnText: { color: '#fff', fontFamily: fonts.semi, fontSize: 14 },
});