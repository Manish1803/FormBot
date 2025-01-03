import axios from "axios";

const BASE_URL = import.meta.env.VITE_BASE_URL;

const getToken = () => {
  return localStorage.getItem("token");
};

const authService = {
  register: async (userData) => {
    const response = await axios.post(`${BASE_URL}/auth/register`, userData);
    return response.data;
  },

  login: async (credentials) => {
    const response = await axios.post(`${BASE_URL}/auth/login`, credentials);
    return response.data;
  },

  logout: async (token) => {
    const response = await axios.post(
      `${BASE_URL}/auth/logout`,
      {},
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  },

  updateUser: async (userData, token) => {
    const response = await axios.put(`${BASE_URL}/auth/update`, userData, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  },

  resetPassword: async (oldPassword, newPassword) => {
    const response = await axios.post(
      `${BASE_URL}/auth/reset-password`,
      { oldPassword, newPassword },
      {
        headers: {
          Authorization: `Bearer ${getToken()}`,
        },
      }
    );
    return response.data;
  },
};

export default authService;
