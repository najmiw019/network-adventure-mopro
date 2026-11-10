import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors, fonts, shadow } from '../theme/colors';

const TABS = {
  Dashboard: { label: 'Home', icon: 'home-outline' },
  Map: { label: 'Map', icon: 'map-outline' },
  Lab: { label: 'Lab', icon: 'server-outline' },
  Profil: { label: 'Profile', icon: 'person-outline' },
};

export default function TabBar({ state, navigation }) {
  const insets = useSafeAreaInsets();
  return (
    <View style={[s.wrap, { paddingBottom: Math.max(insets.bottom, 10) }]}>
      <View style={s.bar}>
        {state.routes.map((route, index) => {
          const focused = state.index === index;
          const cfg = TABS[route.name];
          const onPress = () => {
            const e = navigation.emit({ type: 'tabPress', target: route.key, canPreventDefault: true });
            if (!focused && !e.defaultPrevented) navigation.navigate(route.name);
          };
          return (
            <TouchableOpacity key={route.key} style={s.item} onPress={onPress} activeOpacity={0.8}>
              <View style={[s.iconBox, focused && s.iconActive]}>
                <Ionicons name={cfg.icon} size={24} color={colors.ink} />
                <Text style={s.label}>{cfg.label}</Text>
              </View>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
}

const s = StyleSheet.create({
  wrap: { backgroundColor: colors.bg, paddingHorizontal: 12, paddingTop: 6 },
  bar: { flexDirection: 'row', backgroundColor: colors.navBar, borderRadius: 28, padding: 8, justifyContent: 'space-around', ...shadow },
  item: { flex: 1, alignItems: 'center' },
  iconBox: { alignItems: 'center', paddingVertical: 6, paddingHorizontal: 14, borderRadius: 16 },
  iconActive: { backgroundColor: colors.navActive },
  label: { fontFamily: fonts.body, fontSize: 10, color: colors.ink, marginTop: 2 },
});
