import { useState } from "react";
import styles from "./Form.module.css";
import { toast } from "react-hot-toast";
import { MdError } from "react-icons/md";
import { useAuth } from "../../../contexts/AuthContext";
import { useNavigate } from "react-router";

function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    }
    if (!formData.password) {
      newErrors.password = "Password is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) {
      toast.error("Please fill out the form correctly");
    }

    setIsLoading(true);
    try {
      const response = await login(formData);
      toast.success(response.message);
      navigate("/dashboard");
      setFormData({
        email: "",
        password: "",
      });
    } catch (error) {
      toast.error(error.response?.data?.message || "Login failed");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
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
      <button className={styles.btn} type="submit" disabled={isLoading}>
        {isLoading ? "Loading..." : "Log In"}
      </button>
      <span style={{ textAlign: "center" }}>OR</span>
      <div
        className={styles.btn}
        onClick={() => {
          toast("Google Sign In not implemented yet", {
            icon: <MdError size="2rem" color="red" />,
          });
        }}
        disabled={isLoading}
      >
        Sign In with Google
      </div>
    </form>
  );
}

export default Login;
