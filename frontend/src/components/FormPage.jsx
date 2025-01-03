import { useEffect, useState } from "react";
import { useParams } from "react-router";
import { toast } from "react-hot-toast";
import axios from "axios";

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
      setCurrentFieldIndex(currentFieldIndex + 1);
    }
  };

  const renderField = (field) => {
    switch (field.type) {
      case "text-display":
        return <p>{field.label}</p>;
      case "image-display":
        return <img src={field.imageUrl} alt={field.label} />;
      case "text":
      case "email":
      case "phone":
      case "number":
      case "date":
        return (
          <input
            type={field.type === "phone" ? "tel" : field.type}
            placeholder={field.label}
            value={answers[field._id] || ""}
            onChange={(e) =>
              setAnswers({ ...answers, [field._id]: e.target.value })
            }
          />
        );
      case "rating":
        return (
          <select
            value={answers[field._id] || ""}
            onChange={(e) =>
              setAnswers({ ...answers, [field._id]: e.target.value })
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
          <div>
            {field.options.map((option) => (
              <button
                key={option}
                onClick={() => setAnswers({ ...answers, [field._id]: option })}
              >
                {option}
              </button>
            ))}
          </div>
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

  const currentField = form.fields[currentFieldIndex];
  const isLastField = currentFieldIndex === form.fields.length - 1;

  return (
    <div>
      <h1>{form.title}</h1>
      <div>{renderField(currentField)}</div>
      <div>
        {!isLastField && (
          <button
            onClick={() =>
              handleNext(currentField._id, answers[currentField._id])
            }
            disabled={!answers[currentField._id]}
          >
            Next
          </button>
        )}
        {isLastField && (
          <button onClick={handleSubmit} disabled={!answers[currentField._id]}>
            Submit
          </button>
        )}
      </div>
    </div>
  );
}

export default FormPage;
