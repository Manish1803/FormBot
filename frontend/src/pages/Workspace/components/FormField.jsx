import { MdOutlineTextsms } from "react-icons/md";
import { RiDeleteBin6Line } from "react-icons/ri";
import { HiOutlineLink } from "react-icons/hi";

import styles from "./FormField.module.css";

function FormField({ field, onUpdate, onDelete }) {
  const renderInput = () => {
    switch (field.type) {
      case "text-display":
        return (
          <div>
            <div className={styles.inputContainer}>
              <MdOutlineTextsms size="2rem" color="#4B83FF" />
              <input
                type="text"
                placeholder="Click here to edit"
                value={field.value || ""}
                onChange={(e) => onUpdate({ value: e.target.value })}
                required
              />
            </div>
            <span className={styles.error}>
              {field.value === "" ? "Required Field" : ""}
            </span>
          </div>
        );
      case "image-display":
        return (
          <div>
            <div className={styles.inputContainer}>
              <HiOutlineLink size={"2rem"} color="#4B83FF" />
              <input
                type="text"
                placeholder="Click to add link"
                value={field.value || ""}
                onChange={(e) => onUpdate({ value: e.target.value })}
                required
              />
            </div>
            <span className={styles.error}>
              {field.value === "" ? "Required Field" : ""}
            </span>
          </div>
        );
      case "text":
        return (
          <p className={styles.hint}>
            Hint : User will input a text on his form
          </p>
        );
      case "number":
        return (
          <p className={styles.hint}>
            Hint : User will input a number on his form
          </p>
        );
      case "email":
        return (
          <p className={styles.hint}>
            Hint : User will input a email on his form
          </p>
        );
      case "phone":
        return (
          <p className={styles.hint}>
            Hint : User will input a phone number on his form
          </p>
        );
      case "date":
        return <p className={styles.hint}>Hint : User will select a date</p>;
      case "rating":
        return (
          <p className={styles.hint}>Hint : User will tap to rate out of 5</p>
        );
      case "buttons":
        return (
          <div>
            <div className={styles.inputContainer}>
              <MdOutlineTextsms size="2rem" color="#4B83FF" />
              <input
                type="text"
                placeholder="Submit"
                value={field.value || ""}
                onChange={(e) => onUpdate({ value: e.target.value })}
                required
              />
            </div>
            <span className={styles.error}>
              {field.value === "" ? "Required Field" : ""}
            </span>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className={styles.box}>
      <div className={styles.label}>
        <input
          type="text"
          value={field.title}
          onChange={(e) => onUpdate({ title: e.target.value })}
          placeholder="Question title"
        />
        <button onClick={onDelete} className={styles.deleteIcon}>
          <RiDeleteBin6Line size="2rem" color="#F55050" />
        </button>
      </div>
      <div>{renderInput()}</div>
    </div>
  );
}

export default FormField;
