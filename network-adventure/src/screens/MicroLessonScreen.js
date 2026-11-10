import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import BackButton from '../components/BackButton';
import { colors, fonts, shadow } from '../theme/colors';
import { levels } from '../data/levels';
import { lessons } from '../data/lessons';

export default function MicroLessonScreen({ route, navigation }) {
  const insets = useSafeAreaInsets();
  const level = levels.find(l => l.level_id === route.params.levelId);
  const pages = lessons[level.level_id];
  const [i, setI] = useState(0);
  const page = pages[i];
  const last = i === pages.length - 1;

  const next = () => {
    if (!last) return setI(i + 1);
    
    navigation.navigate('Flashcard', { levelId: level.level_id });
  };

  return (
    <View style={[s.container, { paddingTop: insets.top + 16, paddingBottom: Math.max(insets.bottom, 16) }]}>
      
      {/* Header (Tombol Back & Judul) */}
      <View style={s.head}>
        <View style={s.backWrapper}>
          <BackButton onPress={() => (i > 0 ? setI(i - 1) : navigation.goBack())} />
        </View>
        <Text style={s.headTitle}>Materi {level.level_order}.{i + 1}</Text>
      </View>

      {/* Progress Bar & Indikator Halaman */}
      <View style={s.progressRow}>
        <View style={s.track}>
          <View style={[s.fill, { width: `${((i + 1) / pages.length) * 100}%` }]} />
        </View>
        <Text style={s.count}>{i + 1} dari {pages.length}</Text>
      </View>

      {/* Meta Durasi & Topik */}
      <Text style={s.meta}>{page.duration} Menit - {page.topic}</Text>
      <Text style={s.title}>{page.title}</Text>

      {/* Kotak Ilustrasi Fleksibel (Mengisi Ruang Kosong) */}
      <View style={s.illus}>
        {page.icons.map((ic, k) => (
          <Ionicons key={k} name={ic} size={52} color={colors.ink} />
        ))}
      </View>

      {/* Teks Penjelasan Materi */}
      <Text style={s.body} numberOfLines={4} ellipsizeMode="tail">{page.body}</Text>

      {/* Kotak Tip / Coba Bayangkan */}
      <View style={s.tip}>
        <View style={s.tipHead}>
          <Ionicons name="bulb-outline" size={22} color={colors.ink} />
          <Text style={s.tipTitle}>Coba bayangkan!</Text>
        </View>
        <Text style={s.tipText} numberOfLines={3}>{page.tip}</Text>
      </View>

      {/* Footer / Tombol Navigasi Bawah */}
      <View style={s.footer}>
        <TouchableOpacity 
          style={[s.btn, i === 0 && { opacity: 0.4 }]} 
          disabled={i === 0} 
          onPress={() => setI(i - 1)}
        >
          <Text style={s.btnText}>Sebelumnya</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={s.btn} onPress={next}>
          <Text style={s.btnText}>{last ? 'Lanjut ke Flashcard' : 'Berikutnya'}</Text>
        </TouchableOpacity>
      </View>

    </View>
  );
}

const s = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bg, paddingHorizontal: 20, justifyContent: 'space-between' },
  
  head: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', height: 40, position: 'relative', marginBottom: 8 },
  backWrapper: { position: 'absolute', left: 0 },
  headTitle: { fontFamily: fonts.bold, fontSize: 16, color: colors.ink },
  
  progressRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 8 },
  track: { flex: 1, height: 8, backgroundColor: '#B8B8B8', borderRadius: 4, overflow: 'hidden' },
  fill: { height: 8, backgroundColor: colors.done },
  count: { fontFamily: fonts.body, fontSize: 11, marginLeft: 8, color: colors.ink },

  meta: { fontFamily: fonts.body, fontSize: 11, color: colors.ink, marginBottom: 2 },
  title: { fontFamily: fonts.bold, fontSize: 18, color: colors.ink, marginBottom: 10 },

  illus: { flex: 1, backgroundColor: colors.sand, borderRadius: 24, flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center', marginVertical: 6, ...shadow },
  
  body: { fontFamily: fonts.body, fontSize: 13, lineHeight: 20, color: colors.ink, marginVertical: 6 },
  
  tip: { backgroundColor: colors.tipPurple, borderRadius: 20, padding: 12, marginVertical: 6, ...shadow },
  tipHead: { flexDirection: 'row', alignItems: 'center', marginBottom: 4 },
  tipTitle: { fontFamily: fonts.bold, fontSize: 12, marginLeft: 6, color: colors.ink },
  tipText: { fontFamily: fonts.body, fontSize: 11, lineHeight: 16, color: colors.ink },

  footer: { flexDirection: 'row', justifyContent: 'space-between', paddingTop: 8 },
  btn: { backgroundColor: colors.ink, borderRadius: 20, paddingVertical: 12, paddingHorizontal: 24 },
  btnText: { color: '#fff', fontFamily: fonts.semi, fontSize: 13 },
});