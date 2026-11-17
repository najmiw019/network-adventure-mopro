import React, { useCallback, useState } from 'react';
import { View, Text, ScrollView, Image, StyleSheet, TouchableOpacity, Alert, useWindowDimensions, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Svg, { Path } from 'react-native-svg';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useFocusEffect } from '@react-navigation/native';
import { colors, fonts, shadow } from '../theme/colors';
import { API_URL } from '../config';
import { levelDesc, getLevelStatus } from '../data/levels';

const ROW = 130;
const TOP = 110;
const R = 38;
export default function MapScreen({ navigation, route }) {
  const insets = useSafeAreaInsets();
  const { width } = useWindowDimensions();
  const W = Math.min(width, 440);
  const userId = route?.params?.userId;
  const [levels, setLevels] = useState([]);
  const [completedLevels, setCompletedLevels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchMapData = useCallback(async () => {
    if (!userId) {
      setError('ID akun tidak ditemukan. Silakan login kembali.');
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`${API_URL}/map/${userId}`);
      const json = await response.json();

      if (!response.ok || !json.success) {
        throw new Error(json.message || 'Gagal mengambil progres peta.');
      }
      if (!Array.isArray(json.levels) || !Array.isArray(json.completedLevels)) {
        throw new Error('Format data peta dari server tidak valid.');
      }

      setLevels(json.levels);
      setCompletedLevels(json.completedLevels);
    } catch (fetchError) {
      console.error('Gagal mengambil data peta:', fetchError);
      setError(fetchError.message || 'Tidak dapat terhubung ke server.');
    } finally {
      setLoading(false);
    }
  }, [userId]);

  useFocusEffect(
    useCallback(() => {
      fetchMapData();
    }, [fetchMapData])
  );

  if (loading) {
    return (
      <View style={[s.container, s.stateContainer]}>
        <ActivityIndicator size="large" color={colors.teal} />
        <Text style={s.stateText}>Memuat progres peta...</Text>
      </View>
    );
  }

  if (error || levels.length === 0) {
    return (
      <View style={[s.container, s.stateContainer]}>
        <Text style={s.stateText}>{error || 'Data level belum tersedia.'}</Text>
        <TouchableOpacity style={s.retryButton} onPress={fetchMapData}>
          <Text style={s.retryText}>Coba lagi</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const n = levels.length;
  const done = levels.filter(level => completedLevels.includes(level.level_id)).length;
  const pct = Math.round((done / n) * 100);
  const H = TOP + (n - 1) * ROW + 200;

  const pos = levels.map((_, i) => ({ x: i % 2 === 0 ? W * 0.74 : W * 0.26, y: TOP + i * ROW }));
  let d = `M ${pos[0].x} ${pos[0].y}`;
  for (let i = 0; i < n - 1; i++) {
    const a = pos[i], b = pos[i + 1];
    d += ` C ${a.x} ${a.y + ROW * 0.6}, ${b.x} ${b.y - ROW * 0.6}, ${b.x} ${b.y}`;
  }

  const onPress = (level, status) => {
    if (status === 'locked') {
      Alert.alert('Level terkunci', 'Selesaikan level sebelumnya dulu ya.');
      return;
    }
    navigation.navigate('MissionBriefing', { levelId: level.level_id, userId });
  };

  return (
    <View style={s.container}>
      <View style={[s.banner, { marginTop: Math.max(insets.top + 12, 32) }]}>
        <View style={s.bannerRow}>
          <Text style={s.bannerTitle}>Progres kamu</Text>
          <Text style={s.bannerTitle}>{pct}%</Text>
        </View>
        <View style={s.track}><View style={[s.fill, { width: `${pct}%` }]} /></View>
        <Text style={s.bannerSub}>{done} dari {n} level selesai</Text>
      </View>

      <ScrollView 
        contentContainerStyle={{ alignItems: 'center', paddingBottom: 60 }}
        showsVerticalScrollIndicator={false}
      >
        <View style={{ width: W, height: H }}>
          <View style={[s.deco, { top: 160, left: W * 0.5 - 10, width: 110, height: 110 }]} />
          <View style={[s.deco, { top: 380, left: -20, width: 90, height: 90 }]} />
          <View style={[s.deco, { top: 520, left: W * 0.6, width: 80, height: 80 }]} />

          <Svg width={W} height={H} style={StyleSheet.absoluteFill}>
            <Path d={d} stroke={colors.path} strokeWidth={22} strokeLinecap="round" fill="none" />
          </Svg>

          <Image 
            source={require('../../assets/mascot/ungu-terjun.png')}
            style={{ position: 'absolute', left: 16, top: pos[0].y - 80, width: 90, height: 90 }} 
            resizeMode="contain" 
          />

          {levels.map((level, i) => {
            const status = getLevelStatus(level, completedLevels);
            const { x, y } = pos[i];
            const right = i % 2 === 0;
            return (
              <View key={level.level_id} style={{ opacity: status === 'locked' ? 0.6 : 1 }}>
                <TouchableOpacity 
                  activeOpacity={0.85} 
                  onPress={() => onPress(level, status)}
                  style={[s.label, right ? { right: W - x + R + 6 } : { left: x + R + 6 }, { top: y - 24 }]}
                >
                  <Text style={s.labelTitle} numberOfLines={2}>{level.name}</Text>
                  <Text style={s.labelSub} numberOfLines={2}>{levelDesc[level.level_id] || ''}</Text>
                </TouchableOpacity>

                <TouchableOpacity 
                  activeOpacity={0.85} 
                  onPress={() => onPress(level, status)}
                  style={[s.node, { left: x - R, top: y - R }]}
                >
                  <Text style={s.nodeNum}>{level.level_order}</Text>
                </TouchableOpacity>

                {status === 'done' && (
                  <View style={[s.check, { left: x + R - 26, top: y - R - 6 }]}>
                    <Ionicons name="checkmark" size={18} color="#fff" />
                  </View>
                )}
              </View>
            );
          })}

          <Image 
            source={require('../../assets/mascot/kuning-finish.png')}
            style={{ position: 'absolute', right: 20, top: pos[n - 1].y + 35, width: 100, height: 100 }} 
            resizeMode="contain" 
          />
        </View>
      </ScrollView>
    </View>
  );
}

const s = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bg },
  stateContainer: { justifyContent: 'center', alignItems: 'center', padding: 24 },
  stateText: { fontFamily: fonts.body, fontSize: 13, color: colors.ink, textAlign: 'center' },
  retryButton: { backgroundColor: colors.ink, borderRadius: 16, paddingHorizontal: 20, paddingVertical: 10, marginTop: 16 },
  retryText: { fontFamily: fonts.semi, fontSize: 12, color: '#fff' },
  banner: { backgroundColor: colors.green, borderRadius: 22, padding: 16, marginHorizontal: 20, marginBottom: 10, maxWidth: 440, alignSelf: 'stretch', ...shadow },
  bannerRow: { flexDirection: 'row', justifyContent: 'space-between' },
  bannerTitle: { fontFamily: fonts.bold, color: '#fff', fontSize: 16 },
  track: { height: 9, borderRadius: 5, backgroundColor: 'rgba(0,0,0,0.3)', marginTop: 8, overflow: 'hidden' },
  fill: { height: 9, backgroundColor: '#E6E6E6' },
  bannerSub: { fontFamily: fonts.body, color: '#fff', fontSize: 11, marginTop: 6 },
  deco: { position: 'absolute', borderRadius: 100, backgroundColor: colors.sandCircle },
  node: { position: 'absolute', width: R * 2, height: R * 2, borderRadius: R, backgroundColor: colors.teal, borderBottomWidth: 6, borderColor: colors.tealDark, alignItems: 'center', justifyContent: 'center' },
  nodeNum: { fontFamily: fonts.bold, color: '#fff', fontSize: 34, marginTop: -4 },
  check: { position: 'absolute', width: 28, height: 28, borderRadius: 14, backgroundColor: colors.done, alignItems: 'center', justifyContent: 'center' },
  label: { position: 'absolute', width: 130, backgroundColor: '#fff', borderRadius: 12, paddingVertical: 7, paddingHorizontal: 10, ...shadow },
  labelTitle: { fontFamily: fonts.bold, fontSize: 11, color: colors.ink },
  labelSub: { fontFamily: fonts.body, fontSize: 8, color: colors.ink, marginTop: 1 },
});