import { Outlet, useParams } from "react-router";
import Header from "./components/Header";
import { toast } from "react-hot-toast";
import { useEffect } from "react";
import formService from "./../../services/formService";
import { useBuilder } from "../../contexts/FormBuilderContext";
// import styles from "./Workspace.module.css";
function Workspace() {
  const { id } = useParams();
  const { setForm } = useBuilder();

  useEffect(() => {
    const fetchForm = async () => {
      try {
        const form = await formService.getForm(id);
        setForm(form);
        console.log(form);
        toast.success(form.message || "Form fetched successfully");
      } catch (error) {
        toast.error(error.message || "Something went wrong");
      }
    };
    fetchForm();
  }, [id]);

  return (
    <main
      style={{
        height: "100vh",
        width: "100%",
        display: "grid",
        gridTemplateRows: "auto 1fr",
      }}
    >
      <Header />
      <Outlet />
    </main>
  );
}

export default Workspace;
