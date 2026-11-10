import React from 'react';
import { TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, shadow } from '../theme/colors';

export default function BackButton({ onPress }) {
  return (
    <TouchableOpacity style={s.btn} onPress={onPress} activeOpacity={0.8}>
      <Ionicons name="chevron-back" size={22} color={colors.ink} />
    </TouchableOpacity>
  );
}
const s = StyleSheet.create({
  btn: { width: 40, height: 40, borderRadius: 12, backgroundColor: '#fff', alignItems: 'center', justifyContent: 'center', ...shadow },
});
