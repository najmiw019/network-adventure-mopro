import React, { useState } from 'react';
import { View, Text, Image, TextInput, StyleSheet, TouchableOpacity, KeyboardAvoidingView, Platform, Alert } from 'react-native';
import { colors, fonts } from '../theme/colors';

// Form dipakai bersama oleh Login dan Sign Up.
function AuthForm({ title, image, fields, linkText, linkLabel, onLink, onSubmit }) {
  const [values, setValues] = useState({});
  return (
    <KeyboardAvoidingView style={s.container} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <Text style={s.title}>{title}</Text>
      <Image source={image} style={s.mascot} resizeMode="contain" />
      {fields.map(f => (
        <TextInput
          key={f.key}
          style={s.input}
          placeholder={f.placeholder}
          placeholderTextColor={colors.inputText}
          secureTextEntry={f.secure}
          autoCapitalize={f.key === 'name' ? 'words' : 'none'}
          keyboardType={f.key === 'email' ? 'email-address' : 'default'}
          value={values[f.key] || ''}
          onChangeText={v => setValues({ ...values, [f.key]: v })}
        />
      ))}
      <TouchableOpacity style={s.btn} onPress={() => onSubmit(values)}>
        <Text style={s.btnText}>Let’s Start!</Text>
      </TouchableOpacity>
      <Text style={s.small}>
        {linkText}{' '}
        <Text style={s.link} onPress={onLink}>{linkLabel}</Text>
      </Text>
    </KeyboardAvoidingView>
  );
}

export function LoginScreen({ navigation }) {
  const handleLogin = async (values) => {
    // Validasi kosong di frontend
    if (!values.email || !values.password) {
      Alert.alert("Perhatian", "Email dan password wajib diisi!");
      return;
    }

    try {
      // Kirim request ke backend Express kamu (sesuaikan IP/port jika pakai HP fisik/emulator)
      const response = await fetch('http://localhost:3000/api/users/sync', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          auth_uid: values.email, // Sementara menggunakan email sebagai unik ID jika belum pakai Firebase
          email: values.email,
          name: values.email.split('@')[0]
        })
      });

      const data = await response.json();

      if (response.ok) {
        navigation.replace('Main');
      } else {
        Alert.alert("Gagal Login", data.message || "Terjadi kesalahan");
      }
    } catch (error) {
      console.error(error);
      Alert.alert("Error", "Tidak dapat terhubung ke server backend.");
    }
  };

  return (
    <AuthForm
      title="Ready for focus?"
      image={require('../../assets/mascot/ungu-musik.png')}
      fields={[{ key: 'email', placeholder: 'Email' }, { key: 'password', placeholder: 'Password', secure: true }]}
      linkText="You don’t have an account?"
      linkLabel="Sign Up"
      onLink={() => navigation.replace('SignUp')}
      onSubmit={handleLogin}
    />
  );
}

export function SignUpScreen({ navigation }) {
  const handleSignUp = async (values) => {
    if (!values.name || !values.email || !values.password) {
      Alert.alert("Perhatian", "Semua kolom wajib diisi!");
      return;
    }

    try {
      const response = await fetch('http://localhost:3000/api/users/sync', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          auth_uid: values.email,
          name: values.name,
          email: values.email
        })
      });

      const data = await response.json();

      if (response.ok) {
        navigation.replace('Main');
      } else {
        Alert.alert("Gagal Daftar", data.message || "Terjadi kesalahan");
      }
    } catch (error) {
      console.error(error);
      Alert.alert("Error", "Tidak dapat terhubung ke server backend.");
    }
  };

  return (
    <AuthForm
      title={'Welcome to network\nadventure!'}
      image={require('../../assets/mascot/pink-cari.png')}
      fields={[{ key: 'name', placeholder: 'Your name' }, { key: 'email', placeholder: 'Email' }, { key: 'password', placeholder: 'Password', secure: true }]}
      linkText="You have an account?"
      linkLabel="Log In"
      onLink={() => navigation.replace('Login')}
      onSubmit={handleSignUp}
    />
  );
}

const s = StyleSheet.create({
  // Style tetap sama seperti punyamu
  container: { flex: 1, backgroundColor: colors.bg, alignItems: 'center', justifyContent: 'center', padding: 32 },
  title: { fontFamily: fonts.bold, fontSize: 24, textAlign: 'center', color: colors.ink, lineHeight: 30 },
  mascot: { width: 170, height: 130, marginVertical: 16 },
  input: { backgroundColor: colors.input, borderRadius: 20, paddingHorizontal: 18, paddingVertical: 11, width: 240, marginBottom: 12, fontFamily: fonts.semi, fontSize: 12, color: colors.ink },
  btn: { backgroundColor: colors.primary, borderRadius: 20, paddingVertical: 11, width: 130, alignItems: 'center', marginTop: 4 },
  btnText: { color: '#fff', fontFamily: fonts.semi, fontSize: 12 },
  small: { fontFamily: fonts.body, fontSize: 10, color: colors.ink, marginTop: 12 },
  link: { color: colors.link, textDecorationLine: 'underline' },
});