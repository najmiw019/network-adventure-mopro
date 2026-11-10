import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
import { colors, fonts } from '../theme/colors';

export default function WelcomeScreen({ navigation }) {
  return (
    <View style={s.container}>
      <Text style={s.title}>Level up your{'\n'}network skills!</Text>
      <Text style={s.sub}>Say goodbye to abstract theories.{'\n'}Welcome to Network Adventure.</Text>
      <Image source={require('../../assets/mascot/kita-mopro.png')} style={s.mascot} resizeMode="contain" />
      <TouchableOpacity style={s.primary} onPress={() => navigation.navigate('SignUp')}>
        <Text style={s.primaryText}>Sign Up</Text>
      </TouchableOpacity>
      <TouchableOpacity style={s.outline} onPress={() => navigation.navigate('Login')}>
        <Text style={s.outlineText}>Log In</Text>
      </TouchableOpacity>
    </View>
  );
}
const s = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bg, alignItems: 'center', justifyContent: 'center', padding: 32 },
  title: { fontFamily: fonts.bold, fontSize: 26, textAlign: 'center', color: colors.ink, lineHeight: 32 },
  sub: { fontFamily: fonts.body, fontSize: 11, textAlign: 'center', color: colors.ink, marginTop: 8 },
  mascot: { width: 260, height: 170, marginVertical: 24 },
  primary: { backgroundColor: colors.ink, borderRadius: 12, paddingVertical: 14, width: 230, alignItems: 'center' },
  primaryText: { color: '#fff', fontFamily: fonts.semi, fontSize: 14 },
  outline: { borderWidth: 1, borderColor: colors.primary, borderRadius: 12, paddingVertical: 14, width: 230, alignItems: 'center', marginTop: 14 },
  outlineText: { color: colors.primary, fontFamily: fonts.semi, fontSize: 14 },
});
