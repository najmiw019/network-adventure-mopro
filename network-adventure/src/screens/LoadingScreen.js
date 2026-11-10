import React, { useEffect, useState } from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';
import Blocks from '../components/Blocks';
import { colors, fonts } from '../theme/colors';

export default function LoadingScreen({ navigation }) {
  const [dots, setDots] = useState('');
  useEffect(() => {
    const d = setInterval(() => setDots(x => (x.length >= 2 ? '' : x + '.')), 350);
    const t = setTimeout(() => navigation.replace('Welcome'), 2200);
    return () => { clearInterval(d); clearTimeout(t); };
  }, []);
  return (
    <View style={s.container}>
      <Blocks />
      <Image source={require('../../assets/mascot/kuning-masak.png')} style={s.mascot} resizeMode="contain" />
      <Text style={s.text}>Loading{dots}</Text>
    </View>
  );
}
const s = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bg, alignItems: 'center', justifyContent: 'center' },
  mascot: { width: 220, height: 180 },
  text: { fontFamily: fonts.pixel, fontSize: 28, color: colors.ink, marginTop: 8, minWidth: 140 },
});
