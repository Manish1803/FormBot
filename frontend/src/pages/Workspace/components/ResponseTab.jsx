import styles from "./ResponseTab.module.css";

function ResponseTab() {
  return (
    <section className={styles.responseTab}>
      <div className={styles.noResponse}>
        <p className={styles.text}>No Response yet collected</p>
      </div>
    </section>
  );
}

export default ResponseTab;
