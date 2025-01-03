import FormField from "./FormField";
import styles from "./FormBuilder.module.css";
import { IoFlagSharp } from "react-icons/io5";

function FormBuilder({ fields, onUpdateField, onDeleteField }) {
  return (
    <section className={styles.formBuilder}>
      <article className={styles.container}>
        <button className={styles.startBtn}>
          <IoFlagSharp size="2rem" color="#4B83FF" />
          Start
        </button>
        {fields?.map((field, i) => (
          <FormField
            className={styles.field}
            key={i}
            field={field}
            onUpdate={(updates) => onUpdateField(field.id, updates)}
            onDelete={() => onDeleteField(field.id)}
          />
        ))}
        {fields && fields.length === 0 && (
          <div className={styles.noFields}>
            <p style={{ textAlign: "center" }}>No fields added yet</p>
          </div>
        )}
      </article>
    </section>
  );
}

export default FormBuilder;
