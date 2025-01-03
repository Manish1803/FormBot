import { useBuilder } from "../../../contexts/FormBuilderContext";
import FormBuilder from "./FormBuilder";
import Sidebar from "./Sidebar";

function FlowTab() {
  const { form, onAddField, onUpdateField, onDeleteField } = useBuilder();
  return (
    <section
      style={{
        display: "grid",
        gridTemplateColumns: "30rem 1fr",
        gap: "2rem",
        backgroundColor: "var(--canvas-color)",
        padding: "1rem 2rem",
      }}
    >
      <Sidebar onAddField={onAddField} />
      <FormBuilder
        fields={form.fields}
        onUpdateField={onUpdateField}
        onDeleteField={onDeleteField}
      />
    </section>
  );
}

export default FlowTab;
