import React, { useEffect } from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';
import Blocks from '../components/Blocks';
import { colors, fonts } from '../theme/colors';

export default function SplashScreen({ navigation }) {
  useEffect(() => {
    const t = setTimeout(() => navigation.replace('Loading'), 2000);
    return () => clearTimeout(t);
  }, []);
  return (
    <View style={s.container}>
      <Blocks />
      <Image source={require('../../assets/mascot/kuning-laptop.png')} style={s.mascot} resizeMode="contain" />
      <Text style={s.title}>NETWORK{'\n'}ADVENTURE</Text>
    </View>
  );
}
const s = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bg, alignItems: 'center', justifyContent: 'center' },
  mascot: { width: 200, height: 160 },
  title: { fontFamily: fonts.pixel, fontSize: 34, textAlign: 'center', color: colors.ink, lineHeight: 42, marginTop: 8 },
});
