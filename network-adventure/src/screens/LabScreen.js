import React, { useState, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Alert, Animated, PanResponder } from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors, fonts, shadow } from '../theme/colors';
import { labLevels } from '../data/labLevels';

function DraggableDeviceItem({ device, onDelete }) {
  const pan = useRef(new Animated.ValueXY({ x: device.x, y: device.y })).current;

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onPanResponderMove: Animated.event(
        [null, { dx: pan.x, dy: pan.y }],
        { useNativeDriver: false }
      ),
      onPanResponderRelease: () => {
        pan.extractOffset();
      },
    })
  ).current;

  const renderIcon = (type) => {
    switch (type) {
      case 'pc': return <Ionicons name="desktop-outline" size={28} color={colors.ink} />;
      case 'switch': return <MaterialCommunityIcons name="expansion-card" size={28} color={colors.ink} />;
      case 'router': return <MaterialCommunityIcons name="router-wireless" size={28} color={colors.ink} />;
      case 'server': return <MaterialCommunityIcons name="server" size={28} color={colors.ink} />;
      default: return <Ionicons name="hardware-chip-outline" size={28} color={colors.ink} />;
    }
  };

  return (
    <Animated.View
      style={[
        s.droppedDevice,
        {
          transform: [{ translateX: pan.x }, { translateY: pan.y }],
        },
      ]}
      {...panResponder.panHandlers}
    >
      <View style={s.deviceIconWrapper}>
        {renderIcon(device.type)}
      </View>
      <Text style={s.droppedLabel}>{device.type.toUpperCase()}</Text>
      
      {/* Tombol Hapus Perangkat */}
      <TouchableOpacity style={s.deleteBadge} onPress={() => onDelete(device.id)}>
        <Ionicons name="close" size={10} color="#fff" />
      </TouchableOpacity>
    </Animated.View>
  );
}

export default function LabScreen({ navigation }) {
  const insets = useSafeAreaInsets();
  const [currentLevelIndex, setCurrentLevelIndex] = useState(0);
  const [simulationStatus, setSimulationStatus] = useState('idle');

  const [workspaceDevices, setWorkspaceDevices] = useState([
    { id: '1', type: 'pc', x: 20, y: 20 },
    { id: '2', type: 'switch', x: 120, y: 80 }
  ]);

  const currentLevel = labLevels[currentLevelIndex] || labLevels[0];

  const handleAddDevice = (type) => {
    if (workspaceDevices.length >= 6) {
      Alert.alert('Area Kerja Penuh', 'Maksimal 6 perangkat di dalam area kerja!');
      return;
    }
    const newDevice = {
      id: Date.now().toString() + Math.random(),
      type: type,
      x: Math.random() * 100 + 20,
      y: Math.random() * 60 + 20,
    };
    setWorkspaceDevices([...workspaceDevices, newDevice]);
    setSimulationStatus('idle');
  };

  const handleRemoveDevice = (id) => {
    setWorkspaceDevices(workspaceDevices.filter(dev => dev.id !== id));
    setSimulationStatus('idle');
  };

  const handleRunSimulation = () => {
    const pcCount = workspaceDevices.filter(d => d.type === 'pc').length;
    const switchCount = workspaceDevices.filter(d => d.type === 'switch').length;
    const routerCount = workspaceDevices.filter(d => d.type === 'router').length;
    const serverCount = workspaceDevices.filter(d => d.type === 'server').length;

    let isMissionValid = false;
    let errorMessage = 'Topologi perangkat belum sesuai dengan instruksi misi level ini!';

    // Aturan validasi per level
    if (currentLevel.id === 1) {
      // Level 1: Hubungkan dua komputer (Minimal 2 PC dan 1 Switch)
      if (pcCount >= 2 && switchCount >= 1) isMissionValid = true;
      else errorMessage = 'Level 1: Pasang minimal 2 buah PC dan 1 buah Switch!';
    } else if (currentLevel.id === 2) {
      // Level 2: Jaringan Antar Switch (Minimal 2 Switch)
      if (switchCount >= 2) isMissionValid = true;
      else errorMessage = 'Level 2: Pasang minimal 2 buah Switch di area kerja!';
    } else if (currentLevel.id === 3) {
      // Level 3: Gerbang Router (Minimal 1 Router dan 1 Switch)
      if (routerCount >= 1 && switchCount >= 1) isMissionValid = true;
      else errorMessage = 'Level 3: Pasang minimal 1 Router dan 1 Switch!';
    } else if (currentLevel.id === 4) {
      // Level 4: Pusat Server (Minimal 1 Server, 1 PC, dan 1 Switch)
      if (serverCount >= 1 && pcCount >= 1 && switchCount >= 1) isMissionValid = true;
      else errorMessage = 'Level 4: Pasang minimal 1 Server, 1 PC, dan 1 Switch!';
    } else {
      // Level 5 & 6: Bebas / Kompleks (Minimal 3 perangkat apa saja)
      if (workspaceDevices.length >= 3) isMissionValid = true;
      else errorMessage = 'Pasang minimal 3 perangkat untuk menyelesaikan level mahir ini!';
    }

    if (!isMissionValid) {
      setSimulationStatus('idle');
      Alert.alert('Belum Sesuai Misi!', errorMessage);
      return;
    }

    // Jika Berhasil
    setSimulationStatus('success');
    Alert.alert(
      'Simulasi Berhasil!',
      `Kabel terhubung dengan sempurna! Paket data berhasil dikirim pada ${currentLevel.title}.`
    );
  };

  // Navigasi Level Mundur (Kembali)
  const handlePrevLevel = () => {
    if (currentLevelIndex > 0) {
      setCurrentLevelIndex(currentLevelIndex - 1);
      setSimulationStatus('idle');
      setWorkspaceDevices([
        { id: '1', type: 'pc', x: 20, y: 20 },
        { id: '2', type: 'switch', x: 120, y: 80 }
      ]);
    } else {
      Alert.alert('Informasi', 'Kamu sudah berada di level pertama.');
    }
  };

  // Navigasi Level Maju (Lanjut)
  const handleNextLevel = () => {
    if (simulationStatus !== 'success') {
      Alert.alert('Simulasi Belum Dijalankan', 'Jalankan dan pastikan simulasi berhasil (sukses) terlebih dahulu sebelum lanjut!');
      return;
    }

    if (currentLevelIndex < labLevels.length - 1) {
      setCurrentLevelIndex(currentLevelIndex + 1);
      setSimulationStatus('idle');
      setWorkspaceDevices([
        { id: '1', type: 'pc', x: 30, y: 30 },
        { id: '2', type: 'switch', x: 130, y: 90 }
      ]);
    } else {
      Alert.alert('Luar Biasa!', 'Kamu telah menamatkan seluruh level Praktikum Lab Jaringan!');
      navigation.navigate('Main');
    }
  };

  return (
    <View style={[s.container, { paddingTop: insets.top + 16, paddingBottom: Math.max(insets.bottom, 16) }]}>
      
      {/* Header dengan Tombol Home */}
      <View style={s.header}>
        <TouchableOpacity style={s.homeBtn} onPress={() => navigation.navigate('Main')}>
          <Ionicons name="home-outline" size={22} color={colors.ink} />
        </TouchableOpacity>
        <Text style={s.headerTitle}>Laboratorium Jaringan</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView contentContainerStyle={s.scrollContent} showsVerticalScrollIndicator={false}>
        
        {/* Kartu Instruksi Misi */}
        <View style={s.instructionCard}>
          <View style={s.levelBadge}>
            <Text style={s.levelBadgeText}>{currentLevel.id}</Text>
          </View>
          <View style={s.instructionTextWrapper}>
            <Text style={s.instructionTitle}>{currentLevel.title}</Text>
            <Text style={s.instructionDesc}>{currentLevel.desc}</Text>
          </View>
        </View>

        {/* Label Area Kerja */}
        <Text style={s.sectionTitle}>Area Kerja Topologi (Geser Perangkat)</Text>

        {/* Canvas Area Kerja */}
        <View style={s.workspaceCanvas}>
          {workspaceDevices.length === 0 ? (
            <View style={s.emptyContainer}>
              <Ionicons name="grid-outline" size={36} color={colors.ink} style={{ opacity: 0.3, marginBottom: 6 }} />
              <Text style={s.emptyWorkspaceText}>Area Kerja Kosong{'\n'}Ketuk tambah perangkat di bawah</Text>
            </View>
          ) : (
            <View style={s.canvasInner}>
              {workspaceDevices.map((dev) => (
                <DraggableDeviceItem 
                  key={dev.id} 
                  device={dev} 
                  onDelete={handleRemoveDevice} 
                />
              ))}
            </View>
          )}
        </View>

        {/* Slot Status Koneksi Kabel */}
        <View style={[s.statusSlot, simulationStatus === 'success' && s.statusSlotSuccess]}>
          <View style={[s.statusDot, simulationStatus === 'success' && { backgroundColor: '#4CAF50' }]} />
          <Text style={s.statusText}>
            {simulationStatus === 'success' 
              ? 'Status: Jaringan Terhubung Sesuai Misi' 
              : workspaceDevices.length >= 2 
                ? 'Status: Perangkat siap diuji jalankan simulasinya' 
                : 'Status: Tambahkan perangkat sesuai instruksi'}
          </Text>
        </View>

        {/* Section Tambah Perangkat */}
        <Text style={s.sectionTitle}>Tambah Perangkat</Text>
        <View style={s.devicePalette}>
          
          <TouchableOpacity style={s.paletteItem} onPress={() => handleAddDevice('pc')} activeOpacity={0.7}>
            <View style={s.addBadge}><Ionicons name="add" size={12} color="#fff" /></View>
            <Ionicons name="desktop-outline" size={26} color={colors.ink} />
            <Text style={s.paletteLabel}>PC</Text>
          </TouchableOpacity>

          <TouchableOpacity style={s.paletteItem} onPress={() => handleAddDevice('switch')} activeOpacity={0.7}>
            <View style={s.addBadge}><Ionicons name="add" size={12} color="#fff" /></View>
            <MaterialCommunityIcons name="expansion-card" size={26} color={colors.ink} />
            <Text style={s.paletteLabel}>Switch</Text>
          </TouchableOpacity>

          <TouchableOpacity style={s.paletteItem} onPress={() => handleAddDevice('router')} activeOpacity={0.7}>
            <View style={s.addBadge}><Ionicons name="add" size={12} color="#fff" /></View>
            <MaterialCommunityIcons name="router-wireless" size={26} color={colors.ink} />
            <Text style={s.paletteLabel}>Router</Text>
          </TouchableOpacity>

          <TouchableOpacity style={s.paletteItem} onPress={() => handleAddDevice('server')} activeOpacity={0.7}>
            <View style={s.addBadge}><Ionicons name="add" size={12} color="#fff" /></View>
            <MaterialCommunityIcons name="server" size={26} color={colors.ink} />
            <Text style={s.paletteLabel}>Server</Text>
          </TouchableOpacity>

        </View>

        {/* Tombol Jalankan Simulasi */}
        <TouchableOpacity style={s.btnSimulate} onPress={handleRunSimulation} activeOpacity={0.85}>
          <Ionicons name="play-circle-outline" size={18} color="#fff" style={{ marginRight: 6 }} />
          <Text style={s.btnSimulateText}>Jalankan Simulasi</Text>
        </TouchableOpacity>

        {/* Tombol Navigasi Bawah (Kembali & Lanjut) */}
        <View style={s.footerNavWrapper}>
          <TouchableOpacity 
            style={[s.btnPrev, currentLevelIndex === 0 && { opacity: 0.4 }]} 
            onPress={handlePrevLevel}
            activeOpacity={0.8}
            disabled={currentLevelIndex === 0}
          >
            <Ionicons name="arrow-back" size={16} color={colors.ink} style={{ marginRight: 4 }} />
            <Text style={s.btnPrevText}>Kembali</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={[s.btnNext, simulationStatus !== 'success' && { opacity: 0.6 }]} 
            onPress={handleNextLevel} 
            activeOpacity={0.85}
          >
            <Text style={s.btnNextText}>Lanjut ({currentLevelIndex + 1}/{labLevels.length})</Text>
            <Ionicons name="arrow-forward" size={16} color="#fff" style={{ marginLeft: 6 }} />
          </TouchableOpacity>
        </View>

      </ScrollView>
    </View>
  );
}

const s = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bg, paddingHorizontal: 20 },
  
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 },
  homeBtn: { backgroundColor: '#fff', padding: 10, borderRadius: 14, ...shadow },
  headerTitle: { fontFamily: fonts.bold, fontSize: 16, color: colors.ink },

  scrollContent: { paddingBottom: 20 },

  instructionCard: { 
    backgroundColor: '#5C9E43', 
    borderRadius: 22, 
    padding: 14, 
    flexDirection: 'row', 
    alignItems: 'center', 
    marginBottom: 16,
    ...shadow 
  },
  levelBadge: { 
    width: 40, 
    height: 48, 
    backgroundColor: '#fff', 
    borderRadius: 12, 
    justifyContent: 'center', 
    alignItems: 'center', 
    marginRight: 12 
  },
  levelBadgeText: { fontFamily: fonts.bold, fontSize: 22, color: colors.ink },
  instructionTextWrapper: { flex: 1 },
  instructionTitle: { fontFamily: fonts.bold, fontSize: 15, color: '#fff', marginBottom: 2 },
  instructionDesc: { fontFamily: fonts.body, fontSize: 11, color: '#E8F5E9', lineHeight: 15 },

  sectionTitle: { fontFamily: fonts.bold, fontSize: 13, color: colors.ink, marginBottom: 8 },

  workspaceCanvas: { 
    backgroundColor: '#C5F5FF', 
    borderRadius: 24, 
    height: 220, 
    overflow: 'hidden',
    position: 'relative',
    marginBottom: 10,
    ...shadow 
  },
  emptyContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 },
  emptyWorkspaceText: { fontFamily: fonts.body, fontSize: 11, color: colors.ink, opacity: 0.6, textAlign: 'center', lineHeight: 16 },
  canvasInner: { flex: 1, position: 'relative' },
  
  droppedDevice: { 
    position: 'absolute', 
    alignItems: 'center', 
    backgroundColor: '#fff', 
    padding: 8, 
    borderRadius: 14, 
    width: 64,
    zIndex: 10,
    ...shadow 
  },
  deviceIconWrapper: { alignItems: 'center', justifyContent: 'center' },
  droppedLabel: { fontFamily: fonts.bold, fontSize: 9, color: colors.ink, marginTop: 2 },
  deleteBadge: { 
    position: 'absolute', 
    top: -4, 
    right: -4, 
    backgroundColor: '#E5473B', 
    borderRadius: 8, 
    width: 16, 
    height: 16, 
    justifyContent: 'center', 
    alignItems: 'center' 
  },

  statusSlot: { 
    backgroundColor: '#E0F7FA', 
    borderRadius: 16, 
    paddingVertical: 10, 
    paddingHorizontal: 14, 
    flexDirection: 'row', 
    alignItems: 'center', 
    marginBottom: 16, 
    borderWidth: 1, 
    borderColor: '#B2EBF2' 
  },
  statusSlotSuccess: { backgroundColor: '#E8F5E9', borderColor: '#C8E6C9' },
  statusDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: '#FFB162', marginRight: 8 },
  statusText: { fontFamily: fonts.body, fontSize: 11, color: colors.ink, opacity: 0.8 },

  devicePalette: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 14 },
  paletteItem: { 
    width: '23%', 
    aspectRatio: 1, 
    backgroundColor: '#BCEEFA', 
    borderRadius: 16, 
    justifyContent: 'center', 
    alignItems: 'center', 
    position: 'relative',
    ...shadow 
  },
  addBadge: { 
    position: 'absolute', 
    top: -3, 
    right: -3, 
    backgroundColor: '#5C9E43', 
    borderRadius: 8, 
    width: 16, 
    height: 16, 
    justifyContent: 'center', 
    alignItems: 'center' 
  },
  paletteLabel: { fontFamily: fonts.semi, fontSize: 10, color: colors.ink, marginTop: 4 },

  btnSimulate: { 
    backgroundColor: colors.ink, 
    borderRadius: 18, 
    paddingVertical: 14, 
    flexDirection: 'row', 
    justifyContent: 'center', 
    alignItems: 'center', 
    marginBottom: 12, 
    ...shadow 
  },
  btnSimulateText: { fontFamily: fonts.bold, fontSize: 13, color: '#fff' },

  footerNavWrapper: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 },
  btnPrev: { 
    backgroundColor: '#fff', 
    borderRadius: 16, 
    paddingVertical: 12, 
    paddingHorizontal: 20, 
    flexDirection: 'row', 
    alignItems: 'center', 
    ...shadow 
  },
  btnPrevText: { fontFamily: fonts.bold, fontSize: 12, color: colors.ink },
  
  btnNext: { 
    backgroundColor: colors.ink, 
    borderRadius: 16, 
    paddingVertical: 12, 
    paddingHorizontal: 24, 
    flexDirection: 'row', 
    alignItems: 'center', 
    ...shadow 
  },
  btnNextText: { fontFamily: fonts.bold, fontSize: 12, color: '#fff' },
});