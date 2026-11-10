import AsyncStorage from '@react-native-async-storage/async-storage';

// Sesuaikan IP laptop kamu (hasil dari command 'ipconfig' di CMD)
const BASE_URL = 'http://10.190.92.197:5000/api'; 

// 1. REGISTER / SIGN UP API
export const signUpAPI = async (name, email, password) => {
  try {
    const res = await fetch(`${BASE_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, password }),
    });

    const data = await res.json();

    // Toleran membaca respons sukses (HTTP 200/201 atau data.success / data.insertId / data.userId)
    if (res.ok || data.success || data.insertId || data.userId || data.user_id) {
      const userData = data.data || data.user || { name, email, user_id: data.insertId || data.userId };
      
      // Otomatis simpan data session user ke HP biar bisa langsung dipakai
      if (userData) {
        await AsyncStorage.setItem('user', JSON.stringify(userData));
      }

      return { success: true, message: data.message || 'Registrasi berhasil!', data: userData };
    }

    return { success: false, message: data.message || 'Gagal mendaftarkan akun' };
  } catch (err) {
    console.error('SignUp error:', err);
    return { success: false, message: 'Gagal terhubung ke server backend' };
  }
};

// 2. LOGIN API
export const loginAPI = async (email, password) => {
  try {
    const res = await fetch(`${BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });

    const data = await res.json();
    
    if (res.ok && (data.success || data.data)) {
      const userData = data.data || data.user || data;
      await AsyncStorage.setItem('user', JSON.stringify(userData));
      return { success: true, data: userData };
    }

    return { success: false, message: data.message || 'Email atau password salah' };
  } catch (err) {
    console.error('Login error:', err);
    return { success: false, message: 'Gagal terhubung ke server backend' };
  }
};

// 3. FETCH PROFILE USER TERBARU DARI BACKEND
export const fetchUserProfileAPI = async (userId) => {
  try {
    const res = await fetch(`${BASE_URL}/users/${userId}`);
    const data = await res.json();

    if (res.ok && (data.success || data.data)) {
      const updatedUser = data.data || data;
      await AsyncStorage.setItem('user', JSON.stringify(updatedUser));
      return { success: true, data: updatedUser };
    }

    return { success: false, message: data.message || 'Gagal mengambil profil' };
  } catch (err) {
    console.error('Fetch profile error:', err);
    return { success: false, message: 'Gagal mengambil profil' };
  }
};

// 4. GET USER FROM ASYNCSTORAGE
export const getSavedUser = async () => {
  try {
    const userJson = await AsyncStorage.getItem('user');
    return userJson != null ? JSON.parse(userJson) : null;
  } catch (e) {
    console.error('Get saved user error:', e);
    return null;
  }
};

// 5. LOGOUT USER
export const logoutUser = async () => {
  try {
    await AsyncStorage.removeItem('user');
  } catch (e) {
    console.error('Logout error:', e);
  }
};

// 6. AMBIL SOAL KUIS PER LEVEL
// AMBIL SOAL KUIS PER LEVEL
export const fetchQuizByLevel = async (levelId) => {
  try {
    const res = await fetch(`${BASE_URL}/activities/quiz/${levelId}`);
    const data = await res.json();
    
    if (res.ok && (data.success || Array.isArray(data) || data.data)) {
      return {
        success: true,
        data: Array.isArray(data) ? data : (data.data || data.questions || [])
      };
    }
    return { success: false, message: data.message || 'Kuis tidak ditemukan' };
  } catch (err) {
    console.error('Fetch quiz error:', err);
    return { success: false, message: 'Gagal terhubung ke server backend' };
  }
};

// 7. SUBMIT HASIL KUIS
export const submitQuizResult = async (userId, levelId, score, xpEarned) => {
  try {
    const res = await fetch(`${BASE_URL}/activities/quiz/submit`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        user_id: userId,
        lesson_id: levelId,
        score: score,
        xp_earned: xpEarned
      }),
    });
    return await res.json();
  } catch (err) {
    console.error('Submit quiz error:', err);
    return { success: false, message: 'Gagal menyimpan hasil kuis' };
  }
};