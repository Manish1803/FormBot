import { useState } from "react";
import { FaArrowLeft } from "react-icons/fa6";
import styles from "./AuthPage.module.css";
import Login from "./components/Login";
import SignUp from "./components/SignUp";
import { useNavigate } from "react-router";

function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);
  const navigate = useNavigate();

  const toggleForm = () => {
    setIsLogin((prevState) => !prevState);
  };

  return (
    <main className={styles.authPage}>
      <nav className={styles.btnBack} onClick={() => navigate(-1)}>
        <FaArrowLeft size="2.5rem" />
      </nav>
      <article className={styles.authForm}>
        {isLogin ? <Login /> : <SignUp />}
        <p className={styles.toggleForm}>
          {isLogin ? "Don't you have an account?" : "Already have an account?"}{" "}
          <button onClick={toggleForm} className={styles.toggleButton}>
            {isLogin ? "Register Now" : "Login"}
          </button>
        </p>
      </article>
      <img
        src="https://res.cloudinary.com/df6bjvmam/image/upload/f_auto,q_auto,w_300/v1735043573/triangle_y3vdsg.png"
        alt="svg triangle"
        className={styles.svgTriangle}
      />
      <div className={styles.circle1}></div>
      <div className={styles.circle2}></div>
    </main>
  );
}

export default AuthPage;
