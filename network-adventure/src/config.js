// Alamat backend dipakai di seluruh aplikasi dari satu tempat ini.
// Default-nya localhost (cukup untuk Expo web di laptop yang sama).
// Untuk HP/emulator, buat file network-adventure/.env.local berisi:
//   EXPO_PUBLIC_API_URL=http://<IP-laptop-atau-url-tunnel>:3000/api
// lalu restart `npx expo start`. File .env.local tidak ikut ke-push ke GitHub.
export const API_URL = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:3000/api';
