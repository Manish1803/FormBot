import { useEffect, useState } from "react";
import { useParams } from "react-router";
import { IoSend } from "react-icons/io5";
import { toast } from "react-hot-toast";
import axios from "axios";
import styles from "./FormPage.module.css";
const BASE_URL = import.meta.env.VITE_BASE_URL;

function FormPage() {
  const { responseLink } = useParams();
  const [form, setForm] = useState(null);
  const [currentFieldIndex, setCurrentFieldIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchForm = async () => {
      try {
        const response = await axios.get(
          `${BASE_URL}/forms/respond/${responseLink}`
        );
        setForm(response.data);
      } catch (error) {
        console.log(error || "Error fetching form");
      } finally {
        setIsLoading(false);
      }
    };

    fetchForm();
  }, [responseLink]);

  const handleFieldResponse = async (fieldId, value) => {
    try {
      await axios.post(`${BASE_URL}/forms/respond/${responseLink}/field`, {
        fieldId,
        value,
      });
      setAnswers({ ...answers, [fieldId]: value });
    } catch (error) {
      console.log(error || "Error submitting field response");
    }
  };

  const handleSubmit = async () => {
    try {
      await axios.post(`${BASE_URL}/forms/respond/${responseLink}/submit`, {
        answers: Object.entries(answers).map(([fieldId, value]) => ({
          field: fieldId,
          value,
        })),
      });
      toast.success("Form submitted successfully");
    } catch (error) {
      console.log(error || "Error submitting form response");
      toast.error("Error submitting form response");
    }
  };

  const handleNext = async (fieldId, value) => {
    await handleFieldResponse(fieldId, value);
    if (currentFieldIndex < form.fields.length - 1) {
      setCurrentFieldIndex((cur) => cur + 1);
    }
  };

  const renderField = (field) => {
    switch (field.type) {
      case "text-display":
        return (
          <div className={styles.chat}>
            <img
              src="/circle.png"
              alt="Profile"
              className={styles.profileIcon}
            />
            <p className={styles.message}>{field.value}</p>
          </div>
        );
      case "image-display":
        return (
          <div className={styles.chat}>
            <p></p>
            <img src={field.value} alt={field.label} className={styles.image} />
          </div>
        );
      case "text":
      case "email":
      case "phone":
      case "number":
      case "date":
        return (
          <input
            className={styles.input}
            type={field.type === "phone" ? "tel" : field.type}
            placeholder={field.placeholder || "Enter a " + field.type}
            value={answers[field.id] || ""}
            onChange={(e) =>
              setAnswers({ ...answers, [field.id]: e.target.value })
            }
          />
        );
      case "rating":
        return (
          <select
            value={answers[field.id] || ""}
            onChange={(e) =>
              setAnswers({ ...answers, [field.id]: e.target.value })
            }
          >
            <option value="">Select Rating</option>
            {[1, 2, 3, 4, 5].map((rating) => (
              <option key={rating} value={rating}>
                {rating} Star{rating > 1 ? "s" : ""}
              </option>
            ))}
          </select>
        );
      case "buttons":
        return (
          // <div>
          //   <button className={styles.submitButton} onClick={handleSubmit}>
          //     {field.value}
          //   </button>
          // </div>
          null
        );
      default:
        return null;
    }
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!form) {
    return <div>Form not found</div>;
  }

  return (
    <div className={styles.formPage}>
      <div className={styles.container}>
        {form.fields.slice(0, currentFieldIndex + 1).map((field, index) => (
          <div key={field.id} className={styles.buttonContainer}>
            {renderField(field)}
            {index === currentFieldIndex &&
              (index === form.fields.length - 1 ? (
                <button
                  className={styles.submitButton}
                  onClick={handleSubmit}
                  disabled={!answers[field.id]}
                >
                  Submit
                </button>
              ) : (
                <button
                  className={styles.nextButton}
                  onClick={() => handleNext(field.id, answers[field.id])}
                  disabled={!answers[field.id]}
                >
                  <IoSend color="#FFFFFF" />
                </button>
              ))}
          </div>
        ))}
      </div>
    </div>
  );
}

export default FormPage;
