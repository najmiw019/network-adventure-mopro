import React, { useState, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Animated } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import BackButton from '../components/BackButton';
import { colors, fonts, shadow } from '../theme/colors';
import { levels } from '../data/levels';
import { flashcards } from '../data/flashcards';

export default function FlashcardScreen({ route, navigation }) {
  const insets = useSafeAreaInsets();
  const levelId = route?.params?.levelId || 1;
  const level = levels.find(l => l.level_id === levelId) || levels[0];
  
  const cards = flashcards[levelId] || [
    { 
      front: 'Jaringan Komputer', 
      desc: 'Menurutmu, apa artinya?', 
      back: 'Sekumpulan perangkat yang saling terhubung untuk bertukar data dan berbagi sumber daya.',
      icon: 'git-network-outline'
    }
  ];

  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  
  const flipAnimation = useRef(new Animated.Value(0)).current;

  const card = cards[currentIndex];
  const lastCard = currentIndex === cards.length - 1;

  const flipCard = () => {
    if (isFlipped) {
      Animated.spring(flipAnimation, {
        toValue: 0,
        friction: 8,
        tension: 10,
        useNativeDriver: true,
      }).start();
      setIsFlipped(false);
    } else {
      Animated.spring(flipAnimation, {
        toValue: 180,
        friction: 8,
        tension: 10,
        useNativeDriver: true,
      }).start();
      setIsFlipped(true);
    }
  };

  const handleAnswer = (understood) => {
    Animated.spring(flipAnimation, { toValue: 0, useNativeDriver: true }).start();
    setIsFlipped(false);

    if (!lastCard) {
      setCurrentIndex(currentIndex + 1);
    } else {
      navigation.navigate('Quiz', { levelId: level.level_id });
    }
  };

  const frontInterpolate = flipAnimation.interpolate({
    inputRange: [0, 180],
    outputRange: ['0deg', '180deg'],
  });

  const backInterpolate = flipAnimation.interpolate({
    inputRange: [0, 180],
    outputRange: ['180deg', '360deg'],
  });

  const frontAnimatedStyle = { transform: [{ rotateY: frontInterpolate }] };
  const backAnimatedStyle = { transform: [{ rotateY: backInterpolate }] };

  const cardIcon = card.icon || 'albums-outline';

  return (
    <View style={[s.container, { paddingTop: insets.top + 16 }]}>
      {/* Header & Progress Bar */}
      <View style={s.header}>
        <BackButton onPress={() => navigation.goBack()} />
        <Text style={s.headerTitle}>Flashcard Level {level.level_order}</Text>
      </View>

      <View style={s.progressRow}>
        {cards.map((_, idx) => (
          <View 
            key={idx} 
            style={[s.progressBar, idx <= currentIndex ? s.progressActive : s.progressInactive]} 
          />
        ))}
      </View>
      <Text style={s.cardCounter}>Kartu {currentIndex + 1} dari {cards.length}</Text>

      {/* Area Kartu dengan Animasi Putar */}
      <TouchableOpacity activeOpacity={0.95} onPress={flipCard} style={s.cardContainer}>
        
        {/* SISI DEPAN (Biru) */}
        <Animated.View style={[s.cardBox, s.cardFrontBg, frontAnimatedStyle, s.absoluteCard]}>
          <Text style={s.cardCategoryFront}>ISTILAH JARINGAN</Text>
          <View style={s.cardContentCenter}>
            <Ionicons name={cardIcon} size={64} color="#fff" />
            <Text style={s.cardTitleFront}>{card.front}</Text>
            {card.desc && <Text style={s.cardDescFront}>{card.desc}</Text>}
          </View>
          <Text style={s.cardHintFront}>
            <Ionicons name="repeat-outline" size={12} /> Ketuk kartu untuk membalik
          </Text>
        </Animated.View>

        {/* SISI BELAKANG (Putih / Penalaran) */}
        <Animated.View style={[s.cardBox, s.cardBackBg, backAnimatedStyle, s.absoluteCard]}>
          <Text style={s.cardCategoryBack}>PENALARAN</Text>
          <View style={s.cardContentCenter}>
            <Ionicons name={cardIcon} size={64} color={colors.ink} />
            <Text style={s.cardTitleBack}>{card.front}</Text>
            <Text style={s.cardDescBack}>{card.back}</Text>
          </View>
          <Text style={s.cardHintBack}>
            <Ionicons name="repeat-outline" size={12} /> Ketuk kartu untuk membalik
          </Text>
        </Animated.View>

      </TouchableOpacity>

      {/* Bagian Bawah */}
      <View style={[s.footer, { paddingBottom: Math.max(insets.bottom, 20) }]}>
        <Text style={s.footerLabel}>Sudah paham konsep ini?</Text>
        <Text style={s.footerSub}>Jawabanmu membantu Netto memilih materi ulasan.</Text>
        
        <View style={s.btnRow}>
          <TouchableOpacity style={s.btnNotYet} onPress={() => handleAnswer(false)}>
            <Text style={s.btnTextDark}>Belum paham</Text>
          </TouchableOpacity>
          <TouchableOpacity style={s.btnUnderstood} onPress={() => handleAnswer(true)}>
            <Text style={s.btnTextLight}>Sudah paham</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const s = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bg, paddingHorizontal: 20 },
  header: { flexDirection: 'row', alignItems: 'center', marginBottom: 12 },
  headerTitle: { fontFamily: fonts.bold, fontSize: 16, color: colors.ink, marginLeft: 12 },
  
  progressRow: { flexDirection: 'row', gap: 6, marginBottom: 6 },
  progressBar: { flex: 1, height: 6, borderRadius: 3 },
  progressActive: { backgroundColor: colors.teal },
  progressInactive: { backgroundColor: '#D6D6D6' },
  cardCounter: { fontFamily: fonts.body, fontSize: 11, color: colors.ink, marginBottom: 14 },

  cardContainer: { flex: 1, marginBottom: 16, position: 'relative' },
  absoluteCard: { position: 'absolute', width: '100%', height: '100%', backfaceVisibility: 'hidden' },

  cardBox: { borderRadius: 28, padding: 24, justifyContent: 'space-between', alignItems: 'center', height: '100%', ...shadow },
  
  cardFrontBg: { backgroundColor: '#4A69FF' },
  cardCategoryFront: { fontFamily: fonts.bold, fontSize: 12, color: '#fff', opacity: 0.8, letterSpacing: 1.2 },
  cardTitleFront: { fontFamily: fonts.bold, fontSize: 22, color: '#fff', textAlign: 'center', marginTop: 16 },
  cardDescFront: { fontFamily: fonts.body, fontSize: 13, color: '#fff', opacity: 0.85, textAlign: 'center', marginTop: 6 },
  cardHintFront: { fontFamily: fonts.body, fontSize: 11, color: '#fff', opacity: 0.7 },

  cardBackBg: { backgroundColor: '#fff', borderWidth: 1, borderColor: '#E5E5E5' },
  cardCategoryBack: { fontFamily: fonts.bold, fontSize: 12, color: colors.ink, opacity: 0.5, letterSpacing: 1.2 },
  cardTitleBack: { fontFamily: fonts.bold, fontSize: 20, color: colors.ink, textAlign: 'center', marginTop: 14 },
  cardDescBack: { fontFamily: fonts.body, fontSize: 13, color: colors.ink, textAlign: 'center', marginTop: 8, lineHeight: 20 },
  cardHintBack: { fontFamily: fonts.body, fontSize: 11, color: colors.ink, opacity: 0.4 },

  cardContentCenter: { alignItems: 'center', justifyContent: 'center', paddingHorizontal: 10, flex: 1 },

  footer: { paddingTop: 4 },
  footerLabel: { fontFamily: fonts.bold, fontSize: 14, color: colors.ink, textAlign: 'center' },
  footerSub: { fontFamily: fonts.body, fontSize: 11, color: colors.ink, opacity: 0.7, textAlign: 'center', marginBottom: 14 },
  btnRow: { flexDirection: 'row', gap: 12 },
  btnNotYet: { flex: 1, backgroundColor: '#fff', borderRadius: 16, paddingVertical: 14, alignItems: 'center', borderWidth: 1, borderColor: '#ddd', ...shadow },
  btnUnderstood: { flex: 1, backgroundColor: colors.ink, borderRadius: 16, paddingVertical: 14, alignItems: 'center', ...shadow },
  btnTextDark: { fontFamily: fonts.semi, fontSize: 13, color: colors.ink },
  btnTextLight: { fontFamily: fonts.semi, fontSize: 13, color: '#fff' },
});