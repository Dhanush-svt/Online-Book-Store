import axios from "axios";

export const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";

// Each role keeps its own token in localStorage so a browser can (in theory)
// be signed in as a user and a seller in different tabs without clashing.
const TOKEN_KEYS = {
  user: "bookstore_user_token",
  seller: "bookstore_seller_token",
  admin: "bookstore_admin_token",
};

function createApi(role) {
  const instance = axios.create({ baseURL: `${BASE_URL}/api/${role}s` });

  instance.interceptors.request.use((config) => {
    const token = localStorage.getItem(TOKEN_KEYS[role]);
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
  });

  instance.interceptors.response.use(
    (res) => res,
    (err) => {
      if (err.response?.status === 401) {
        // token expired/invalid — clear it so the UI can redirect to login
        localStorage.removeItem(TOKEN_KEYS[role]);
      }
      return Promise.reject(err);
    }
  );

  return instance;
}

export const userApi = createApi("user");
export const sellerApi = createApi("seller");
export const adminApi = createApi("admin");

export const auth = {
  saveToken: (role, token) => localStorage.setItem(TOKEN_KEYS[role], token),
  getToken: (role) => localStorage.getItem(TOKEN_KEYS[role]),
  clearToken: (role) => localStorage.removeItem(TOKEN_KEYS[role]),
  isLoggedIn: (role) => Boolean(localStorage.getItem(TOKEN_KEYS[role])),
};

export const imageUrl = (path) => {
  if (!path) return "";
  // Already a full URL (e.g. a cover pulled from an external books API)
  if (path.startsWith("http://") || path.startsWith("https://")) return path;
  // Otherwise it's a locally-uploaded file served from our own /uploads folder
  return `${BASE_URL}${path}`;
};
