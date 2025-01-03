import { createContext, useContext, useEffect, useState } from "react";
import authService from "./../services/authService";

const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem("token"));
  const [isAuthenticated, setIsAuthenticated] = useState(!!token);

  useEffect(() => {
    if (token) {
      localStorage.setItem("token", token);
      setIsAuthenticated(true);
    } else {
      localStorage.removeItem("token");
      setIsAuthenticated(false);
    }
  }, [token]);

  const register = async (userData) => {
    try {
      const { token, userId, message } = await authService.register(userData);

      setToken(token);
      setUser({ id: userId });
      return { message };
    } catch (error) {
      throw new Error(error.response?.data?.message || "Sign up failed");
    }
  };

  const login = async (credentials) => {
    try {
      const { token, userId, message } = await authService.login(credentials);
      setToken(token);
      setUser({ id: userId });
      return { message };
    } catch (error) {
      throw new Error(error.response?.data?.message || "Login failed");
    }
  };

  const logout = async () => {
    try {
      await authService.logout(token);
      setToken(null);
      setUser(null);
    } catch (error) {
      throw new Error(error.response?.data?.message || "Logout failed");
    }
  };

  const updateUser = async (userData) => {
    try {
      const updatedUser = await authService.updateUser(userData, token);
      setUser(updatedUser);
    } catch (error) {
      throw new Error(error.response?.data?.message || "Update failed");
    }
  };

  const resetPassword = async (oldPassword, newPassword) => {
    try {
      await authService.resetPassword(oldPassword, newPassword);
    } catch (error) {
      throw new Error(error.response?.data?.message || "Password reset failed");
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated,
        register,
        login,
        logout,
        updateUser,
        resetPassword,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export { AuthProvider, useAuth };
