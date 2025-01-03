import { useTheme } from "./../ThemeContext";
import styles from "./ToggleThemeButton.module.css";

function ToggleThemeButton() {
  const { isDarkMode, toggleTheme } = useTheme();

  return (
    <div className={styles.theme}>
      <span>Light</span>
      <label className={styles.switch}>
        <input type="checkbox" checked={isDarkMode} onChange={toggleTheme} />
        <span className={`${styles.slider} ${styles.round}`}></span>
      </label>
      <span>Dark</span>
    </div>
  );
}

export default ToggleThemeButton;
