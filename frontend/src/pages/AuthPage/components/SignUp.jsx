import { useState } from "react";
import { toast } from "react-hot-toast";
import styles from "./Form.module.css";
import { MdError } from "react-icons/md";
import { useAuth } from "../../../contexts/AuthContext";
import { useNavigate } from "react-router";

function SignUp() {
  const navigate = useNavigate();
  const { register } = useAuth();
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    cfPassword: "",
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
    setErrors((prevErrors) => ({
      ...prevErrors,
      [name]: "",
    }));
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.username.trim()) {
      newErrors.username = "Username is required";
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Enter a valid email";
    }

    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }

    if (!formData.cfPassword) {
      newErrors.cfPassword = "Confirm Password is required";
    } else if (formData.cfPassword !== formData.password) {
      newErrors.cfPassword = "Passwords do not match";
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      toast.error("Please fill out the form correctly");
      return;
    }

    setIsLoading(true);
    try {
      const response = await register(formData);
      toast.success(response.message);
      navigate("/dashboard");
      setFormData({
        username: "",
        email: "",
        password: "",
        cfPassword: "",
      });
    } catch (error) {
      setFormData({
        username: "",
        email: "",
        password: "",
        cfPassword: "",
      });
      toast.error(error.response?.data?.message || "Sign up failed");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      <div className={styles.inputContainer}>
        <label htmlFor="username">Username</label>
        <input
          type="text"
          placeholder="Enter your username"
          name="username"
          id="username"
          value={formData.username}
          onChange={handleChange}
        />
        <span className={styles.error}>{errors.username}</span>
      </div>
      <div className={styles.inputContainer}>
        <label htmlFor="email">Email</label>
        <input
          type="text"
          placeholder="Enter your email"
          name="email"
          id="email"
          value={formData.email}
          onChange={handleChange}
        />
        <span className={styles.error}>{errors.email}</span>
      </div>
      <div className={styles.inputContainer}>
        <label htmlFor="password">Password</label>
        <input
          type="text"
          placeholder="***********"
          name="password"
          id="password"
          value={formData.password}
          onChange={handleChange}
        />
        <span className={styles.error}>{errors.password}</span>
      </div>
      <div className={styles.inputContainer}>
        <label htmlFor="cfPassword">Confirm Password</label>
        <input
          type="text"
          placeholder="***********"
          name="cfPassword"
          id="cfPassword"
          value={formData.cfPassword}
          onChange={handleChange}
        />
        <span className={styles.error}>{errors.cfPassword}</span>
      </div>
      <button className={styles.btn} type="submit" disabled={isLoading}>
        {isLoading ? "Signing up..." : "Sign Up"}
      </button>
      <span style={{ textAlign: "center" }}>OR</span>
      <div
        className={styles.btn}
        onClick={() => {
          toast("Google Sign Up not implemented yet", {
            icon: <MdError size="2rem" color="red" />,
          });
        }}
        disabled={isLoading}
      >
        Sign Up with Google
      </div>
    </form>
  );
}

export default SignUp;
