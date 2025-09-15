/* eslint-disable */
// src/services/ApiUjianKhusus.js
import axios from "axios";

// ======================
// Konfigurasi Dasar
// ======================
const BASE_URL = import.meta.env.VITE_API_TS_IST_BASE_URL_
  ? import.meta.env.VITE_API_TS_IST_BASE_URL_
  : "http://localhost:8000/";

const API_VERSION = import.meta.env.VITE_API_TS_IST_VERSION || "v1";

// Buat instance axios dengan konfigurasi dasar
const axiosInstance = axios.create({
  baseURL: `${BASE_URL}api/${API_VERSION}/`,
  timeout: 30000, // 30 detik default timeout
});

// ======================
// Request Interceptor
// ======================
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    // Jangan set Content-Type jika FormData — biarkan browser set otomatis
    if (config.data instanceof FormData) {
      delete config.headers["Content-Type"];
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// ======================
// Response Interceptor (Global Error Handler)
// ======================
axiosInstance.interceptors.response.use(
  (response) => {
    // Untuk download file, jangan ekstrak .data — return full response
    if (response.config?.responseType === "blob") {
      return response; // <-- PENTING: return full response untuk blob
    }
    return response.data; // untuk JSON biasa, return data saja
  },
  (error) => {
    let message = "Terjadi kesalahan jaringan";

    if (error.response) {
      switch (error.response.status) {
        case 401:
          message = "Sesi Anda telah berakhir. Silakan login ulang.";
          // Opsional: redirect ke login
          // window.location.href = "/login";
          localStorage.removeItem("token");
          break;
        case 403:
          message = "Akses ditolak. Anda tidak memiliki izin.";
          break;
        case 404:
          message = "Data tidak ditemukan.";
          break;
        case 500:
          message = "Server sedang mengalami masalah. Coba lagi nanti.";
          break;
        default:
          message = error.response.data?.message || "Terjadi kesalahan server";
      }
    } else if (error.request) {
      message = "Tidak ada respons dari server. Periksa koneksi Anda.";
    }

    // ❗ Ganti dengan Toast / Notifikasi sistem kamu
    console.error("API Error:", message);
    // Contoh: Toast.danger("Error", message);

    return Promise.reject(error);
  }
);

// ======================
// Fungsi Request Universal
// ======================
const apiRequest = (method, url, data = null, config = {}) => {
  return axiosInstance({
    method,
    url,
    data,
    ...config, // <-- Teruskan semua opsi: responseType, timeout, headers tambahan, dll
  });
};

// ======================
// HTTP Methods
// ======================
const get = (url, config = {}) => apiRequest("get", url, null, config);
const post = (url, data, config = {}) => apiRequest("post", url, data, config);
const put = (url, data, config = {}) => apiRequest("put", url, data, config);
const patch = (url, data, config = {}) =>
  apiRequest("patch", url, data, config);
const del = (url, config = {}) => apiRequest("delete", url, null, config);

// ======================
// Export API Service
// ======================
export default {
  get,
  post,
  put,
  patch,
  delete: del, // karena "delete" adalah reserved keyword
};

// Export instance untuk kebutuhan khusus (misal: cancel token, dll)
export { axiosInstance };
