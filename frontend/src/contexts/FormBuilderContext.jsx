import { createContext, useContext, useState } from "react";
import { v4 as uuid } from "uuid";
const FormBuilderContext = createContext();

function FormBuilderProvider({ children }) {
  const [form, setForm] = useState({});

  const handleAddField = (fieldType) => {
    const newField = {
      id: uuid(),
      title: fieldType,
      type: fieldType,
      label: "",
      value: "",
      placeholder: "",
    };

    setForm((prev) => ({ ...prev, fields: [...prev.fields, newField] }));
  };

  const handleUpdateField = (id, updatedData) => {
    setForm((prev) => ({
      ...prev,
      fields: prev.fields.map((field) =>
        field.id === id ? { ...field, ...updatedData } : field
      ),
    }));
  };

  const handleDeleteField = (id) => {
    setForm((prev) => ({
      ...prev,
      fields: prev.fields.filter((field) => field.id !== id),
    }));
  };

  return (
    <FormBuilderContext.Provider
      value={{
        form,
        setForm,
        fields: form.fields || [],
        onAddField: handleAddField,
        onUpdateField: handleUpdateField,
        onDeleteField: handleDeleteField,
      }}
    >
      {children}
    </FormBuilderContext.Provider>
  );
}

const useBuilder = () => {
  const context = useContext(FormBuilderContext);
  if (context === undefined) {
    throw new Error("useBuilder must be used within a FormBuilderProvider");
  }
  return context;
};

export { FormBuilderProvider, useBuilder };
