import React from 'react';
import { View, StyleSheet } from 'react-native';
import { colors } from '../theme/colors';

// Kotak warna dekoratif di pojok layar (splash & loading)
export default function Blocks() {
  return (
    <View style={StyleSheet.absoluteFill} pointerEvents="none">
      <View style={[b.box, { top: 48, left: 0, width: 54, height: 44, backgroundColor: colors.blue }]} />
      <View style={[b.box, { top: 0, right: 0, width: 100, height: 92, backgroundColor: colors.yellow }]} />
      <View style={[b.box, { top: '68%', right: 0, width: 36, height: 44, backgroundColor: colors.lilac }]} />
      <View style={[b.box, { bottom: 0, left: 0, width: 96, height: 100, backgroundColor: colors.pink }]} />
    </View>
  );
}
const b = StyleSheet.create({ box: { position: 'absolute' } });
