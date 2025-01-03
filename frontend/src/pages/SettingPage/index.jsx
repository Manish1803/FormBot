import styles from "./SettingPage.module.css";
import { FaRegUser } from "react-icons/fa6";
import { LuLockKeyhole } from "react-icons/lu";

import { MdAlternateEmail } from "react-icons/md";
import { FiEye, FiEyeOff } from "react-icons/fi";
import { TbLogout } from "react-icons/tb";
import { useState } from "react";
import { toast } from "react-hot-toast";
import { useAuth } from "../../contexts/AuthContext";
import { useNavigate } from "react-router";

function SettingPage() {
  const navigate = useNavigate();
  const { updateUser, resetPassword, logout } = useAuth();
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    oldPassword: "",
    newPassword: "",
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const validateForm = () => {
    const newErrors = {};
    if (
      !formData.username &&
      !formData.email &&
      !formData.oldPassword &&
      !formData.newPassword
    ) {
      newErrors.general = "At least one field must be filled.";
    }
    if (
      (formData.oldPassword && !formData.newPassword) ||
      (!formData.oldPassword && formData.newPassword)
    ) {
      newErrors.password =
        "Both old and new passwords are required to reset the password.";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleUpdate = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      toast.error("Please fix the errors before submitting.");
      return;
    }

    setIsLoading(true);
    try {
      const updateData = {};
      if (formData.username) updateData.username = formData.username;
      if (formData.email) updateData.email = formData.email;

      if (Object.keys(updateData).length > 0) {
        await updateUser(updateData);
        toast.success("User details updated successfully.");
      }

      if (formData.oldPassword && formData.newPassword) {
        await resetPassword(formData.oldPassword, formData.newPassword);
        toast.success("Password updated successfully.");
      }

      setFormData({
        username: "",
        email: "",
        oldPassword: "",
        newPassword: "",
      });
    } catch (error) {
      toast.error(error.response?.data?.error || "Invalid credentials.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
      toast.success("Logged out successfully.");
      navigate("/");
    } catch (error) {
      toast.error(error.message || "Logout failed.");
    }
  };

  return (
    <main className={styles.settingPage}>
      <p className={styles.title}>Settings</p>

      <section className={styles.formContainer}>
        <form className={styles.form} onSubmit={handleUpdate}>
          <div className={styles.inputContainer}>
            <FaRegUser size="2rem" />
            <input
              type="text"
              placeholder="Name"
              name="username"
              value={formData.username}
              onChange={handleChange}
              aria-label="Update name"
            />
          </div>
          <div className={styles.inputContainer}>
            <MdAlternateEmail size="2rem" />

            <input
              type="text"
              placeholder="Update Email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              aria-label="Update email"
            />
          </div>
          <div className={styles.inputContainer}>
            <LuLockKeyhole size="2rem" />

            <input
              type={showPassword ? "text" : "password"}
              placeholder="Old Password"
              name="oldPassword"
              value={formData.oldPassword}
              onChange={handleChange}
              aria-label="Old password"
            />
            <button
              type="button"
              onClick={() => setShowPassword((is) => !is)}
              aria-pressed={showPassword}
              className={styles.eye}
            >
              {showPassword ? <FiEyeOff size="2rem" /> : <FiEye size="2rem" />}
            </button>
          </div>
          <div className={styles.inputContainer}>
            <LuLockKeyhole size="2rem" />

            <input
              type={showPassword ? "text" : "password"}
              placeholder="New Password"
              name="newPassword"
              value={formData.newPassword}
              onChange={handleChange}
              aria-label="New password"
            />
            <button
              type="button"
              onClick={() => setShowPassword((is) => !is)}
              aria-pressed={showPassword}
              className={styles.eye}
            >
              {showPassword ? <FiEyeOff size="2rem" /> : <FiEye size="2rem" />}
            </button>
          </div>
          {errors.general && <p className={styles.error}>{errors.general}</p>}
          {errors.password && <p className={styles.error}>{errors.password}</p>}

          <button className={styles.btn} type="submit" disabled={isLoading}>
            {isLoading ? "Loading..." : "Update"}
          </button>
        </form>
      </section>

      <button className={styles.logout} onClick={handleLogout}>
        <TbLogout size="2rem" />
        Logout
      </button>
    </main>
  );
}

export default SettingPage;
