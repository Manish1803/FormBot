import { useEffect, useState } from "react";
import { useParams } from "react-router";
import formService from "../services/formService";

function FormPage() {
  const { responseLink } = useParams();
  console.log(responseLink);
  const [form, setForm] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchForm = async () => {
      try {
        const response = await formService.getFormStructure(responseLink);
        setForm(response.data);
      } catch (error) {
        console.log(error || "Error fetching form");
      } finally {
        setIsLoading(false);
      }
    };

    fetchForm();
  }, [responseLink]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!form) {
    return <div>Form not found</div>;
  }

  return <div>FormPage</div>;
}

export default FormPage;
